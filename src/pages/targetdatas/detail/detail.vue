<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.target">{{ data.target }}</span>
            <span
              class="id-green"
              v-if="data.higheststatus"
              :title="'最高研发阶段：' + data.higheststatus"
              >{{ data.higheststatus }}</span
            >
          </div>
        </div>
      </div>
      <div class="main" style="padding-top: 50px;">
        <slide-section :title="'基本信息'" class="the-part">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>靶点简称</td>
                <td colspan="3">
                  <span>{{ data.genename ? data.genename : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>靶点别称</td>
                <td colspan="3">
                  <div>
                    {{ data.alias ? data.alias : "/" }}
                  </div>
                </td>
              </tr>
              <tr>
                <td>靶点类型</td>
                <td>
                  <span>{{ data.kind ? data.kind : "/" }}</span>
                </td>
                <td>物种来源</td>
                <td>
                  <span>{{ data.organism ? data.organism : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>作用机制分类</td>
                <td>
                  <span>{{ data.actions ? data.actions : "/" }}</span>
                </td>
                <td>分子量</td>
                <td>
                  <span>{{ data.weight ? data.weight : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>UniprotID号</td>
                <td>
                  <a v-if="data.uniprotid" :href="`https://www.uniprot.org/uniprot/${data.uniprotid}`" target="_blank" style="color: #4877e8">{{ data.uniprotid }}</a>
                  <span v-else>/</span>
                </td>
                <td>Uniprot名称</td>
                <td>
                  <span>{{ data.uniprotname ? data.uniprotname : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>最高研发阶段</td>
                <td>
                  <span>{{
                    data.higheststatus ? data.higheststatus : "/"
                  }}</span>
                </td>
                <td>相关药物原研单位</td>
                <td>
                  <span v-if="data.xgywyydw && data.xgywyydw != 0">
                    <router-link
                      tag="a"
                      :to="'/report?target_eq=' + data.target"
                      target="_blank"
                      style="display: inline-block; color: #4877e8"
                      >{{ data.xgywyydw }}</router-link
                    >
                  </span>
                  <span v-else>{{ data.xgywyydw == 0 ? 0 : "/" }}</span>
                </td>
              </tr>
              <tr>
                <td>分子序列</td>
                <td colspan="3">
                  <div v-if="data.sequence" class="td-line3">
                    <p
                      v-for="(item, ix) in parseInt(
                        data.sequence.length / 60 + 1
                      )"
                      :key="ix"
                    >
                      {{ data.sequence.slice(60 * ix, 60 * ix + 60) }}
                    </p>
                  </div>
                  <span v-else>/</span>
                </td>
              </tr>
              <tr>
                <td>基因功能</td>
                <td colspan="3">
                  <div class="td-line3">
                    {{ data.generalfunction ? data.generalfunction : "/" }}
                  </div>
                </td>
              </tr>
              <tr>
                <td>适应症</td>
                <td colspan="3">
                  <div class="td-line5">
                    {{ data.indication ? data.indication : "/" }}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </slide-section>

        <slide-section :title="'相关药物研发进展'" class="the-part part1">
          <div class="tb-wrap">
            <div class="title-box1">
              <el-autocomplete
                v-model="rname"
                placeholder="请输入药物中文/英文名称"
                :trigger-on-focus="false"
                @keyup.native.enter="changeTitle"
                @clear="changeTitle"
                :popper-append-to-body="false"
                clearable
                :fetch-suggestions="querySearch"
                @select="changeTitle"
              ><i
                  class="el-icon-search el-input__icon"
                  slot="suffix"
                  @click="changeTitle"
                >
                </i>
                <template slot-scope="{ item }">
                  <div
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    :title="item.value"
                  >
                    {{ item.value }}
                  </div>
                  </i>
                </template>
              </el-autocomplete>
            </div>
            <div class="nav-switch">
              <ul>
                <li :class="{ active: yaow == 0 }" @click="switchs(0)">全球</li>
                <li :class="{ active: yaow == 1 }" @click="switchs(1)">中国</li>
              </ul>
              <span
                v-if="yaow == 1"
                style="
                  color: rgb(255, 107, 63);
                  position: absolute;
                  right: 20px;
                "
                >*所有相关药物在中国的进展。</span
              >
            </div>
            <div class="table-out">
              <Global
                v-if="!yaow && globalData.length"
                :globalData="globalData"
                :years="years"
              />
              <China v-if="yaow && chinaData.length" :chinaData="chinaData" />

              <!-- 无数据 -->
              <div class="nodata-box" v-else-if="nodata"></div>
              <!-- 加载中 -->

              <LoadingGif
                :className="'loading'"
                :loadFlag="loading"
                v-if="loading"
              ></LoadingGif>
            </div>

            <el-pagination
              v-if="dataTotal && dataTotal / pageSize > 1"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              layout="total, prev, pager, next"
              :page-size="pageSize"
              :total="dataTotal"
            >
            </el-pagination>
          </div>
        </slide-section>

        <a href="#" name="part8"></a>
        <slide-section
          :title="'扩展信息'"
          class="the-part"
          v-if="extendList && extendList.length"
        >
          <div class="extend-list">
            <ExtendButton
              v-for="(item, index) in extendList"
              :key="index"
              :item="item"
            ></ExtendButton>
          </div>
        </slide-section>
      </div>
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import China from "./components/china";
import Global from "./components/global";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton,
    China,
    Global,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      yaow: 0,
      dataTotal: 0,
      currentPage: 1,
      pageSize: 10,
      rname: "",
      chinaData: [],
      globalData: [],
      isLoading: true,
      loading: true,
      nodata: false,
      years: "",
      id: this.$route.params.id,
      scroll: "",
      data: {},
      heightArr: [],
      extendList: [], // 扩展信息
      helpDesc: {
        deliveryInformation:
          "发补通知、通知现场检查、通知电子提交（修改） 、通知审评咨询会等；（2009年初至今的送达事项）",
        defaultLicenseDate: "更新结论的时间",
      },
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Targetdatas.allBase,
      helpInfo: (state) => state.Targetdatas.helpInfo,
      nopms: (state) => state.Targetdatas.nopms,
    }),
  },
  watch: {},
  methods: {
    switchs(val) {
      this.yaow = val;
      this.dataGet(1);
    },
    changeTitle() {
      this.dataGet(1);
    },
    handleCurrentChange(val) {
      this.dataGet(val);
    },
    //获取提示词
    querySearch(queryString, callback) {
      window
        .Axios({
          methods: "get",
          url: "/api/report/yfjdinput",
          params: {
            name: queryString,
            target: this.data.genename ? this.data.genename : "",
            accesstoken: this.vueGetCookie("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data == "") {
            callback([]);
          } else {
            let data = [];
            for (let i = 0, l = res.data.data.length; i < l; i++) {
              data.push({ value: res.data.data[i] });
            }
            callback(data);
          }
        })
        .catch((thrown) => {
          console.log("请求出错了");
        });
    },
    dataGet(page) {
      this.loading = true;
      window
        .Axios({
          method: "get",
          url: "/api/targetdatas/report",
          params: {
            page,
            pageSize: this.pageSize,
            rname: this.rname,
            tp: this.yaow,
            bdbm: this.data.bdbm ? this.data.bdbm : "",
            // bdbm: 'TG0002716',
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.nodata = false;
          this.loading = false;

          if (res.data.code === 200) {
            let datas = res.data.data.res ? res.data.data.res : [];
            this.years = res.data.data.years ? res.data.data.years : "";

            if (!datas.length) {
              this.nodata = true;
            }
            if (this.yaow) {
              // 获取当前列最大值
              datas.forEach((item) => {
                item.maxNum = Math.max(
                  item.count_sbqy,
                  item.count_sblcqy,
                  item.count_pzlcqy,
                  item.count_lcsysbdw,
                  item.count_pzssqy,
                  item.count_yzxpjqy,
                  item.count_yzxpjtgqy
                );
              });
              this.chinaData = datas;
            } else {
              datas.forEach((v) => {
                if (v.worldstatus_int === 2) {
                  v.worldstatus_int = 11;
                } else if (v.worldstatus_int > 2) {
                  v.worldstatus_int = v.worldstatus_int - 1;
                }
              });
              this.globalData = datas;
            }
            this.currentPage = res.data.data.page ? res.data.data.page : 1;
            this.dataTotal = res.data.data.count ? res.data.data.count : 0;
          } else {
            this.nodata = true;
          this.globalData = [];
          this.chinaData = [];
            this.currentPage = 1;
            this.dataTotal = 0;
          }
        })
        .catch((err) => {
          this.globalData = [];
          this.chinaData = [];
          this.nodata = true;
          console.log(err);
        });
      // .then(this.removeLoadingMin)
    },
    async handleAxios() {
      // 基本信息
      await window
        .Axios({
          method: "get",
          url: "/api/targetdatas/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            msg_readid: this.$route.query.msg_readid,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            this.getExtendList("targetdatas", data.extendList);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading);

      this.dataGet(1);
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    // 加载完后移除加载
    removeLoadingMin() {
      this.loading = false;
    },
  },
  created() {
    this.handleAxios();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    Store.dispatch("Targetdatas/getBaseInfo");
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.part1 {
  .nav-switch {
    display: flex;
    justify-content: center;
    align-items: center;

    ul {
      display: flex;
      padding: 0 100px;
      border-bottom: 3px solid #4877e8;

      li {
        width: 120px;
        text-align: center;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
      }
      li.active {
        background: #4877e8;
        color: #fff;
      }
    }
  }
}
.link {
  color: @PrimaryColor;
}

.el-pagination {
  padding-bottom: 0;
}

.title-box1 {
  width: 240px;
  position: absolute;
}
.el-input__icon {
  padding-right: 6px;
  line-height: 30px;
  cursor: pointer;
}

.nodata-box {
  height: 300px;
  width: 100%;
  background: #fff url(/static/imgs/nodata.png) center center no-repeat;
}
.table-out {
  margin-top: 30px;
  min-height: 100px;
  position: relative;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.7);
  }
}
</style>
