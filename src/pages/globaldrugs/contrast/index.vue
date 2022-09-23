<template>
  <div class="contrast">
    <div
      class="wrapper-head"
      style="box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1)"
    >
      <div class="wrapper-head_left">
        <span class="name">全球药物对比</span>
      </div>
      <div class="wrapper-head_right">
        <span style="color: #333">
          当前位置：
          <router-link to="/home">首页</router-link>
          >
          <router-link to="/globaldrugs">全球药物</router-link>
          >
          <i style="font-style: normal; color: #002fa7">药物对比</i>
        </span>
      </div>
    </div>
    <el-card class="container" v-waiting="loading">
      <div class="flex headliner" style="margin-bottom: 20px">
        <div class="flex">
          <span style="font-size: 14px; color: #333"
            >当前共选择<b style="font-size: 16px; color: #ffa914">{{
              tdata.length
            }}</b
            >款药品进行对比</span
          >
          <span style="margin-left: 10px; color: #5c6973; font-size: 12px"
            >注意：最多可添加10个药品。</span
          >
        </div>
        <div class="flex" style="margin-left: 140px">
          <div class="flex right">
            <img
              class="ico"
              src="/static/imgs/globaldrugs/time.png"
              style="width: 14px; height: 14px"
            /><span>对比时间：{{ nowDate }}</span>
          </div>
          <a class="flex right" @click="exportExcel"
            ><img
              class="ico"
              src="/static/imgs/globaldrugs/export.png"
              style="width: 14px; height: 14px"
            /><span style="color: #002fa7">导出Excel</span></a
          >
        </div>
      </div>
      <div class="table">
        <div
          v-for="(label, i) in labeldata"
          :key="label.key"
          :class="['row', i == 0 ? 'table-head sticky-top' : '']"
        >
          <div
            :class="[
              'col',
              'sticky-left',
              i == 0 ? 'sticky-top ' : 'row-label',
            ]"
          >
            <span>{{ label.name }}</span>
          </div>
          <div
            :class="[
              'col',
              i > 0 && j > 0 && diffCol(label.key, item[label.key])
                ? 'col-dif'
                : '',
            ]"
            v-for="(item, j) in tdata"
            :key="i + '_' + j"
          >
            <span v-if="label.key !== 'name'">
              {{
                item[label.key]
                  ? item[label.key]
                  : item[label.key] === 0
                  ? 0
                  : " — "
              }}
            </span>
            <span v-else>{{ item["zwname"] + item["drugname_standard"] }}</span>
            <i
              v-if="i == 0 && j > 0"
              class="icon"
              style="color: #f56c6c; cursor: pointer"
              @click="del(j)"
            >
            </i>
            <span class="col-tag" v-if="i == 0 && j == 0">基础药品</span>
            <span class="col-tag" v-if="i == 0 && j > 0">对比药品{{ j }}</span>
          </div>
          <div v-if="tdata.length < 10" class="col insert-col">
            <div v-if="i == 0" ref="insert">
              <el-autocomplete
                size="mini"
                style="width: 250px"
                v-model="newcoltext"
                :fetch-suggestions="querySearch"
                placeholder="请输入并选择内容"
                :trigger-on-focus="false"
                @select="handleSelect"
                clearable
                valueKey="drugname_standard"
              >
                <template slot-scope="{ item }">
                  <div class="drug-item">
                    <div
                      :title="item.value.drugname_standard"
                      class="drug-item_durgname"
                    >
                      {{ item.value.drugname_standard }}
                    </div>
                    <div
                      :title="item.value.company_standard"
                      class="drug-item_company"
                    >
                      {{ item.value.company_standard }}
                    </div>
                  </div>
                </template>
              </el-autocomplete>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 各类提示 -->
    <div class="alert" @click="hideAlerts()">
      <!-- 订阅成功 -->
      <div class="right right1">
        <span>订阅成功</span>
      </div>
      <!-- 关键词不能为空 -->
      <div class="wrong wrong1">
        <span>未找到数据!</span>
      </div>
      <!-- 您已经订阅过该关键词 -->
      <div class="wrong wrong2">
        <span>已存在，请重新选择！</span>
      </div>
      <!-- 请输入正确的关键词 -->
      <div class="wrong wrong3">
        <span>请先添加对比数据！</span>
      </div>
      <!-- 请选择接收方式 -->
      <div class="wrong wrong4">
        <span>请选择接收方式</span>
      </div>
      <!-- 请输入邮箱 -->
      <div class="wrong wrong5">
        <span>请输入邮箱</span>
      </div>
      <!-- 请输入正确的邮箱 -->
      <div class="wrong wrong6">
        <span>请输入正确的邮箱</span>
      </div>

      <!-- 该功能正在建设中 -->
      <div class="wrong wrong7">
        <span>该功能正在建设中</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from "moment";
import Axios from "axios";
export default {
  name: "globaldrug_contrast",
  data() {
    return {
      nowDate: moment().format("YYYY-MM-DD"),
      newcoltext: "",
      tdata: [], // 表格数据
      labeldata: [
        { name: "属性名称", key: "name" },
        { name: "药品分类", key: "leixing2" },
        { name: "靶点", key: "targets_abbr" },
        { name: "已批准适应症", key: "pizhun_indication" },
        { name: "在研适应症", key: "zaiyan_indication" },
        { name: "终止适应症", key: "zhongzhi_indication" },
        { name: "原研单位", key: "company" },
        { name: "合作企业", key: "coo_company" },
        { name: "许可单位", key: "per_company" },
        { name: "全球最高状态", key: "phase1" },
        { name: "中国最高状态", key: "phase2" },
        { name: "已批准企业数", key: "pizhun_company" },
        { name: "在研企业数", key: "zaiyan_company" },
        { name: "终止企业数", key: "zhongzhi_company" },
        { name: "最新状态时间", key: "date" },
      ], // 表头数据
      baseCol: {
        leixing2: "",
        targets_abbr: "",
        pizhun_indication: "",
        zaiyan_indication: "",
        zhongzhi_indication: "",
        company: "",
        coo_company: "",
        per_company: "",
        phase1: "",
        phase2: "",
        pizhun_company: "",
        zaiyan_company: "",
        zhongzhi_company: "",
        date: "",
      },
      loading: false,
    };
  },
  methods: {
    toggleAlert(cls) {
      // 切换alert提示
      $(".alert").fadeIn();
      $(".alert")
        .find("." + cls)
        .fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert")
          .find("." + cls)
          .fadeOut();
      }, 2000);
    },
    hideAlerts() {
      $(".alert").hide();
    },
    initData() {
      this.loading = true;
      let initDrugs =
        (localStorage.getItem("globaldrugsContrast") &&
          JSON.parse(localStorage.getItem("globaldrugsContrast"))) ||
        [];
      initDrugs = initDrugs.map((item) => ({
        name: item.drugname_standard,
        company: item.company_standard,
      }));
      if (!initDrugs.length) {
        this.loading = false;
        return;
      }
      Axios({
        method: "post",
        url: "/api/globaldrugs/compare",
        data: {
          drugname: JSON.stringify(initDrugs),
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.tdata = res.data.data;
            if (res.data.data.length) {
              this.baseCol = res.data.data[0];
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    exportExcel() {
      this.loading = true;
      let initDrugs =
        (localStorage.getItem("globaldrugsContrast") &&
          JSON.parse(localStorage.getItem("globaldrugsContrast"))) ||
        [];
      if (!initDrugs.length) {
        // this.$message.error("请先添加对比数据！");
        this.toggleAlert("wrong3");
        return;
      }
      let strs = JSON.stringify(
        initDrugs.map((t) => ({
          name: t.drugname_standard,
          company: t.company_standard,
        }))
      );
      Axios({
        method: "post",
        url: "/api/globaldrugs/compare",
        responseType: "blob",
        params: {
          isExport: 1,
        },
        data: {
          drugname: strs,
        },
      })
        .then((t) => {
          console.log(decodeURIComponent(t.headers.file_name_urlencode));
          // saveAs 来自于 index.html fileSaverjs
          saveAs(t.data, decodeURIComponent(t.headers.file_name_urlencode));
        })
        .finally(() => {
          this.loading = false;
        });
      // window.open(
      //   `/api/globaldrugs/compare?drugname=${strs}&accesstoken=${GETCOOKIEFUN(
      //     "accesstoken"
      //   )}&isExport=1`,
      //   "_blank"
      // );
    },
    querySearch(query, cb) {
      if (query.length < 2) {
        cb([]);
        return;
      }
      Axios({
        method: "get",
        url: "/api/globaldrugs/input",
        params: _.assign(
          {
            drugname1: query,
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      }).then((res) => {
        if (res.data.code == 200) {
          let r = res.data.data.map((t) => {
            return { value: t };
          });
          cb(r);
        } else {
          cb([]);
        }
      });
    },

    handleSelect(e) {
      this.loading = true;
      let drugcontraststate = localStorage.getItem("globaldrugsContrast")
        ? JSON.parse(localStorage.getItem("globaldrugsContrast"))
        : [];
      if (
        drugcontraststate.findIndex(
          (item) =>
            item.company_standard == e.value.company_standard &&
            item.drugname_standard == e.value.drugname_standard
        ) > -1
      ) {
        // this.$message.error("对比数据已存在，请重新选择！");
        this.toggleAlert("wrong2");
        this.newcoltext = ""; //重置输入框
        this.loading = false;
        return;
      }
      Axios({
        method: "post",
        url: "/api/globaldrugs/compare",
        data: {
          drugname: JSON.stringify(
            [e.value].map((t) => ({
              name: t.drugname_standard,
              company: t.company_standard,
            }))
          ),
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.tdata = this.tdata.concat(res.data.data);
            this.newcoltext = ""; //重置输入框
            // 滚动到输入框
            this.$nextTick(() => {
              this.$refs.insert &&
                this.$refs.insert[0].scrollIntoView({ block: "end" });
            });
            // 记录对比的药物
            drugcontraststate.push(e.value);
            localStorage.setItem(
              "globaldrugsContrast",
              JSON.stringify(drugcontraststate)
            );
          } else {
            // this.$message.error(res.data.msg);
            this.toggleAlert("wrong1");
            this.newcoltext = ""; //重置输入框
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    del(idx) {
      this.tdata.splice(idx, 1);
      let drugcontraststate = JSON.parse(
        localStorage.getItem("globaldrugsContrast")
      );
      drugcontraststate.splice(idx, 1);
      localStorage.setItem(
        "globaldrugsContrast",
        JSON.stringify(drugcontraststate)
      );
    },
    diffCol(key, value) {
      return this.baseCol[key] !== value;
    },
  },
  computed: {
    ...mapState('Globaldrugs', ['allBase'])
  },
  mounted() {
    Store.dispatch("Globaldrugs/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
      document.title = this.allBase.dbname+"-药品对比";
    });
    this.initData();
  },
};
</script>

<style scoped lang="less">
.container {
  width: 99%;
  min-width: 1200px;
  margin: 0 auto;
  // overflow: auto;
  // /deep/ .el-card__body {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: flex-start;
  //   width: max-content;
  //   width: -moz-max-content; //works fine on Mozilla
  //   width: -ms-max-content; //doesn't work on EDGE and MS-Explorer
  // }
  .headliner {
    height: 30px;
    width: 100%;
    // display: flex;
    // justify-content: space-between;

    span {
      line-height: 1;
    }
    .right {
      margin-left: 15px;
      font-size: 14px;
      a {
        color: #002fa7;
      }
    }
    .ico {
      margin-right: 5px;
    }
  }
}

.table {
  max-width: 100%;
  width: fit-content;
  position: relative;
  overflow: auto;
  height: calc(100vh - 185px);
  padding: 0 3px 0 0;
}

.table::-webkit-scrollbar-thumb {
  width: 5px;
}

.table::-webkit-scrollbar-track {
  width: 5px;
}

.row {
  display: flex;
  min-height: 74px;
  &.table-head {
    min-height: 60px;
    min-height: 0;
  }
  .row-label {
    background-color: #fafbfd;
    font-size: 14px;
    font-weight: bold;
    color: #5c6973;
    border-right-color: #fff;
  }
}

.col {
  width: 180px;
  min-width: 180px;
  border: 1px solid #e1e1e1;
  padding: 15px;
  background-color: #fff;
  border-left: 0;
  border-top: 0;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 13px;
  color: #333;
  box-sizing: border-box;
  &.insert-col {
    width: 300px;
    min-width: 300px;
  }
  .icon {
    position: absolute;
    width: 16px;
    height: 16px;
    background-image: url(/static/imgs/globaldrugs/close.png);
    background-size: cover;
    top: 5px;
    right: 5px;
  }
  .col-tag {
    position: absolute;
    font-size: 12px;
    line-height: 1;
    padding: 2px;
    border-radius: 2px;
    background-color: #ffa914;
    color: #fff;
    top: 0;
    left: 0;
    font-weight: normal;
  }
  &.col-dif {
    background-color: #ebeef5;
  }
  span {
    display: inline-block;
    line-height: 20px;
    word-break: break-all;
  }
}
.row:first-child .col {
  // border-top: 1px solid #ececec;
}
.col:first-child {
  border-left: 1px solid #ececec !important;
}
.sticky-left {
  position: sticky;
  left: 0;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 3;
}

.table-head {
  z-index: 1;
  min-height: 60px;
  .col {
    color: #333;
    // border-color: transparent !important;
    font-weight: bold;
    font-size: 14px;
    border-radius: 3px;
    padding: 20px 15px 15px;
    border: none;
    box-shadow: 0px 2px 5px 0px rgba(9, 20, 79, 0.1);
  }
  :not(.sticky-top).col {
    position: relative;
  }
}
.wrapper-head {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  .name {
    font-size: 20px;
    color: #333;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
  }
  .tag {
    height: 20px;
    font-size: 12px;
    border: 1px solid #002fa7;
    color: #002fa7;
    margin-left: 10px;
    border-radius: 3px;
    padding: 2px 5px;
    &.green {
      background-color: #9dcc40;
      border-color: #9dcc40;
      color: #fff;
    }
  }
}
.flex {
  display: flex;
  align-items: center;
}
.alert {
  z-index: 9999;
  display: none;
  width: 175px;
  height: 105px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -52.5px;
  margin-left: -87.5px;
  .right {
    position: relative;
    width: 175px;
    height: 105px;
    background: url("/static/imgs/usercenter/alert/right.png") no-repeat;
    span {
      position: absolute;
      bottom: 22px;
      left: 0px;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .wrong {
    position: relative;
    width: 175px;
    height: 105px;
    background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;
    span {
      position: absolute;
      bottom: 22px;
      left: 0px;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
  div {
    display: none;
  }
}
.drug-item {
  .drug-item_durgname {
    font-size: 13px;
    font-weight: bold;
    color: #333;
    height: 25px;
    line-height: 25px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .drug-item_company {
    font-size: 12px;
    color: #a3a3a3;
    height: 18px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/deep/.el-card__body {
  padding: 10px;
}
</style>
