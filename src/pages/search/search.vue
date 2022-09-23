<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="search" v-else>
      <div class="search-result">
        <span class="search-title">综合搜索</span>
        <span>关键词：</span>
        <span class="theme-font" :title="this.$route.query.searchwords"
          >{{ handleCutLength(this.$route.query.searchwords) }}（{{
            $t(
              "cSearch.searchCategorys." + $route.query.comprehensive + ".label"
            )
          }}）</span
        >
        <span class="ml20">结果共计：</span
        ><span class="theme-font">{{ allNum }}条数据</span>
        <div
          style="font-size: 12px; color: #999"
          v-show="getStrXX(this.$route.query.searchwords)"
        >
          "{{ getStrXX(this.$route.query.searchwords) }}"
          (之后的字词)均被忽略，因为药智数据企业版的查询限制在50个字以内。
        </div>
        <div class="clearfix minw1200">
          <div
            :class="
              !Object.keys(dataRpDrug).length &&
              !Object.keys(dataRpCompany).length &&
              !hasModule
                ? 'w100_100 fl'
                : 'fl w100_660'
            "
          >
            <DataNav
              :data="dataNav"
              v-if="Object.keys(this.dataNav).length"
            ></DataNav>
          </div>
          <div class="fl w640 ml10">
            <ReportForDrug
              :data="dataRpDrug"
              v-if="$route.query.comprehensive == 'drug' && hasModule"
            ></ReportForDrug>
            <ReportForCompany
              :data="dataRpCompany"
              v-if="$route.query.comprehensive == 'company' && hasModule"
            >
            </ReportForCompany>
          </div>
        </div>
      </div>
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import ReportForDrug from "./components/report-for-drug";
import ReportForCompany from "./components/report-for-company";
import DataNav from "./components/data-nav";
import LaFooter from "@/components/layouts/footer";
import { mapState } from "vuex";
export default {
  components: {
    LoadingGif,
    ReportForDrug,
    ReportForCompany,
    DataNav,
    LaFooter,
  },
  data() {
    let searchDatas = {
      isLoading: true,
      hasModule: false,
      dataRpDrug: {} || [], // 存放“概览”的药物（drug）数据，是一个对象
      dataRpCompany: {} || [], // 存放“概览”的企业（company）数据，是一个对象
      dataNav: [], // 存放“导航”的数据，是一个数组
      allNum: 0, // 顶部结果共计的数字，初始为0
    };
    return searchDatas;
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route(to, from) {
      if (String(to.path).indexOf("/search") == 0) {
        this.fetchData();
      }
    },
  },
  methods: {
    handleCutLength(str) {
      let len = String(str).length;
      let arr = [];
      let ret = "";
      if (len > 40) {
        arr = String(str).split("");
        arr.splice(40, len - 40, "...");
        ret = arr.join("");
      } else {
        ret = str;
      }
      return ret;
    },
    getStrXX(str) {
      let strNeed = String(str);
      let len = strNeed.length;
      let arr = [];
      let ret = "";
      if (len > 50) {
        arr = strNeed.split("");

        ret = arr[48] + arr[49];
      } else {
        ret = "";
      }
      return ret;
    },
    fetchData() {
      this.resetCpData();
      this.handleAxios();
      this.getAllNum();
    },
    resetCpData() {
      this.dataRpDrug = {} || [];
      this.dataRpCompany = {} || [];
      this.dataNav = [];
      this.hasModule = false;
      this.allNum = 0;
    },
    commonAxios(vuex_name, type_name) {
      Axios.get(
        `/api/${vuex_name}/searchall?searchwords=` +
          encodeURIComponent(this.$route.query.searchwords) +
          "&comprehensive=" +
          this.$route.query.comprehensive +
          "&accesstoken=" +
          this.vueGetCookie("accesstoken")
      )
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            let list = this.dataNav;
            let isScxx = false;
            _.forEach(list, (item) => {
              if (item.title === type_name) {
                console.log(data);
                if (
                  data.href == "yyxs" ||
                  data.href == "globaldrugs" ||
                  data.href == "company_filter" ||
                  data.href == "instruct"
                ) {
                  item._child.unshift(data);
                } else {
                  item._child.push(data);
                }
                isScxx = true;
              }
            });
            if (!isScxx && data.count) {
              list.push({ title: type_name, _child: [data] });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.getAllNum); // 在异步获取到数据后再统计条数
    },
    getDetailModule(params, type, key) {
      window.Axios.get(`/api/search/${type}?${params}`)
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this[key] = res.data.data[type];
          } else {
            this.hasModule = false;
          }
        })
        .catch((e) => {
          this.hasModule = false;
        });
    },
    handleAxios() {
      this.isLoading = true;
      let params =
        this.$route.query.comprehensive +
        "=" +
        encodeURIComponent(this.$route.query.searchwords) +
        "&accesstoken=" +
        this.vueGetCookie("accesstoken") +
        "&source=" +
        this.$route.query.source;
      Axios.get("/api/search?" + params)
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.hasModule =
              this.comprehensive === "company"
                ? data.is_company
                : data.is_report;
            console.log(this.hasModule, Number(this.hasModule));
            if (Number(this.hasModule))
              this.getDetailModule(
                params,
                this.comprehensive === "company" ? "company" : "report",
                this.comprehensive === "company"
                  ? "dataRpCompany"
                  : "dataRpDrug"
              );
            this.dataNav = data.dbs;
          }
          this.removeLoading();
          this.commonAxios("doc", "药品研发"); // 单独添加全球药品审评报告
          this.commonAxios("yyxs", "市场信息"); // 单独添加医院销售数据
          this.commonAxios("dailiangcaigou", "市场信息"); // 单独添加带量采购数据库
          this.commonAxios("dae", "合理用药"); // 单独添加药品应用评价数据
          this.commonAxios("globaldrugs", "药品研发"); // 单独添加全球药物2。0
          this.commonAxios("company_filter", "生产检验"); // 单独企业筛选系统
          this.commonAxios("policies", "市场信息"); // 单独添加政策法规
          this.commonAxios("instruct", "合理用药"); // 单独添加药品说明书
        })
        .catch((err) => {
          console.log(err);
          this.removeLoading();
        });
    },
    // 获取共计结果条数
    getAllNum() {
      this.allNum = 0;

      let dbs = this.dataNav;
      for (let item of dbs) {
        for (let bar of item._child) {
          this.allNum += bar.count;
        }
      }
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
  },
  computed: {
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice,
    }),
    comprehensive: {
      get() {
        return this.$route.query.comprehensive;
      },
    },
  },
  created() {
    this.handleAxios();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.wrapper {
  box-sizing: border-box;
  min-height: 100%;
  position: relative;
  // padding-bottom: 50px;
}

.search {
  box-sizing: border-box;
  min-height: calc(100vh - 48px);
  padding: 10px;

  .w640 {
    width: 640px;
  }

  .w100_660 {
    width: calc(100% - 650px);
    // min-width: 580px;
  }

  .w100_100 {
    width: 100%;
    // min-width: 580px;
  }

  .ml10 {
    margin-left: 10px;
  }

  .ml20 {
    margin-left: 20px;
  }

  .minw1200 {
    min-width: 1200px;
  }

  .search-result {
    .search-title {
      height: 18px;
      line-height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #545b6d;
      margin-right: 30px;
    }

    span {
      height: 13px;
      line-height: 13px;
      font-size: 13px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #606266;

      &.theme-font {
        color: @PrimaryColor;
      }
    }
  }
}
</style>
