<template>
  <div class="indicator">
    <header-indicator></header-indicator>
    <Main style="padding-top: 48px">
      <!-- 左边部分 -->
      <div slot="left" style="position: relative" class="indicator-left">
        <el-tabs v-model="activeName" @tab-click="handleLeftTabClick">
          <el-tab-pane label="选择指标" name="indicators">
            <Filters
              :groupList="groupList"
              :changeIndicatorList="changeIndicatorList"
              @filterChecked="filterChecked"
              ref="indicatorFilters"
            ></Filters>
          </el-tab-pane>
          <el-tab-pane label="我的收藏" name="collect">
            <Collect ref="collect" @getCollectData="getCollectData"></Collect>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右边部分 -->
      <div class="la-right">
        <div class="la-list">
          <el-tabs v-model="activeNameRight" @tab-click="handleRightTabClick">
            <el-tab-pane label="按时间查看" name="date">
              <DateItem
                :filterChecked="indicatorChecked"
                :activeName="activeName"
                :activeNameRight="activeNameRight"
                @clearIndicator="clearIndicator"
                @changeIndicator="changeIndicator"
                :collectDateData="collectDateData"
                ref="indicatorDate"
              ></DateItem>
            </el-tab-pane>
            <el-tab-pane label="按地区查看" name="area">
              <AreaItem
                :filterChecked="indicatorChecked"
                :activeName="activeName"
                :activeNameRight="activeNameRight"
                @clearIndicator="clearIndicator"
                @changeIndicator="changeIndicator"
                :collectAreaData="collectAreaData"
                ref="indicatorArea"
              ></AreaItem>
            </el-tab-pane>
          </el-tabs>

          <!-- 加入收藏，导出 -->
          <div class="btn-box">
            <div class="collect" @click="openDialog()">加入收藏</div>
            <div class="export" @click="exportIndicator">导出Excel</div>
          </div>
        </div>
      </div>

      <!-- 保存条件 - 输入名称 弹出框 -->
      <el-dialog
        class="dialog-saved"
        :visible.sync="savedPopVisible"
        :append-to-body="true"
      >
        <div slot="title" class="dialog-header">加入收藏</div>
        <div class="saved-box">
          <span class="name">收藏名称</span>
          <el-input v-model="collectName"></el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCollection" type="primary" round
            >提 交</el-button
          >
          <el-button @click="savedPopVisible = false" round>取 消</el-button>
        </div>
      </el-dialog>
    </Main>
  </div>
</template>

<script>
import Main from "@/components/layouts/main";
import Filters from "./components/filters";
import Collect from "./components/collect";
import DateItem from "./date/date";
import AreaItem from "./area/area";
import HeaderIndicator from "@/components/layouts/indicator/header";
import { mapState } from "vuex";
import Moment from "moment";

export default {
  components: { HeaderIndicator, Main, Filters, Collect, DateItem, AreaItem },
  data() {
    return {
      path: this.$route.path ? this.$route.path : "",
      noticeMsgStr: "",
      noticeMsg: [],
      activeName: "indicators", // 左侧tab切换
      activeNameRight: "date", // 右侧tab切换
      indicatorChecked: [
        "全国医药工业主营业务收入(亿元)"
      ],
      groupList: {}, // 待选指标数据
      savedPopVisible: false,
      collectName: "我的收藏1", // 默认收藏名字
      changeIndicatorList: [
        "全国医药工业主营业务收入(亿元)"
      ],
      collectDateData: {}, // 接收我的收藏时间点击后的参数
      collectAreaData: {} // 接收我的收藏地区点击后的参数
    };
  },
  computed: {
    ...mapState({
      accountData: state => state.UserCenter.accountData
    })
  },
  created() {},
  mounted() {
    this.getFilterList();
  },
  methods: {
    // 获取待选指标数据
    getFilterList() {
      window
        .Axios({
          method: "get",
          url: "/api/Macropharmaindicators/secondOption",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.groupList = res.data.data.GroupList;
          }
        });
    },
    // 接收左侧待选指标的已选值
    filterChecked(val) {
      this.indicatorChecked = val;
    },

    // 清空指标
    clearIndicator() {
      this.$refs.indicatorFilters.clearChecked();
      this.$refs.collect.resetIndex();
      if (this.activeNameRight === "date") {
        this.collectDateData = {};
      } else {
        this.collectAreaData = {};
      }
    },

    // 获取删除后的指标项
    changeIndicator(val) {
      this.changeIndicatorList = val;
    },

    // 点击加入收藏按钮
    openDialog() {
      if (
        this.indicatorChecked.length <= 0 &&
        Object.keys(this.collectDateData).length <= 0 &&
        Object.keys(this.collectAreaData).length <= 0
      ) {
        this.$message({
          message: "请选择指标数据",
          type: "warning"
        });
        return;
      }
      // 获取收藏组件的数组长度 拼接默认收藏名
      this.collectName =
        "我的收藏" + (this.$refs.collect.collectList.length + 1);
      this.savedPopVisible = true;
    },

    // 加入收藏提交
    addCollection() {
      // 处理url
      let urlObj = {};
      // 获取时间查看的params
      if (this.activeNameRight === "date") {
        urlObj = _.cloneDeep(this.$refs.indicatorDate.params);
      } else {
        // 获取地区查看的params
        urlObj = _.cloneDeep(this.$refs.indicatorArea.params);
      }
      _.unset(urlObj, "page");
      _.unset(urlObj, "pageSize");

      // type为1时间查看需要处理year
      if (urlObj.type == 1) {
        urlObj.year = urlObj.year.join(":");
      }

      if (this.indicatorChecked.length > 0) {
        urlObj.filter_condition =
          "indicator_name_guifan=" + this.indicatorChecked.join("ღ");
      } else {
        if (this.activeNameRight == "date") {
          urlObj.filter_condition = this.collectDateData.filter_condition;
        } else {
          urlObj.filter_condition = this.collectAreaData.filter_condition;
        }
      }

      // console.log(urlObj);

      window
        .Axios({
          method: "post",
          url: "/api/Macropharmaindicators/savewhere",
          data: {
            accesstoken: this.vueGetCookie("accesstoken"),
            wherename: this.collectName,
            url: Qs.stringify(urlObj)
          }
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              message: "收藏成功",
              type: "success"
            });
            this.savedPopVisible = false;
            this.$refs.collect.getCollectList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
    },

    // 接收我的收藏组件列表点击传入过来的参数
    getCollectData(item) {
      let obj = Qs.parse(item.whereinfo);
      this.indicatorChecked = [];
      // 我的收藏参数赋值
      // 时间查看
      if (obj.type == 1) {
        this.collectDateData = obj;
        this.activeNameRight = "date";
      } else {
        // 地区查看
        this.activeNameRight = "area";
        this.collectAreaData = obj;
      }
    },

    // 导出
    exportIndicator() {
      if (
        this.indicatorChecked.length <= 0 &&
        Object.keys(this.collectDateData).length <= 0 &&
        Object.keys(this.collectAreaData).length <= 0
      ) {
        this.$message({
          message: "请选择指标数据",
          type: "warning"
        });
        return;
      }
      // 处理url
      let urlObj = {};
      // 获取时间查看的params
      if (this.activeNameRight === "date") {
        urlObj = _.cloneDeep(this.$refs.indicatorDate.params);
      } else {
        // 获取地区查看的params
        urlObj = _.cloneDeep(this.$refs.indicatorArea.params);
      }
      _.unset(urlObj, "page");
      _.unset(urlObj, "pageSize");

      // type为1时间查看需要处理year
      if (urlObj.type == 1) {
        urlObj.year = urlObj.year.join(":");
      }

      if (this.indicatorChecked.length > 0) {
        urlObj.filter_condition =
          "indicator_name_guifan=" + this.indicatorChecked.join("ღ");
      } else {
        if (this.activeNameRight == "date") {
          urlObj.filter_condition = this.collectDateData.filter_condition;
        } else {
          urlObj.filter_condition = this.collectAreaData.filter_condition;
        }
      }
      let url =
        `/api/Macropharmaindicators/outdata?accesstoken=` +
        GETCOOKIEFUN("accesstoken") +
        "&" +
        Qs.stringify(urlObj);
      window.open(decodeURI(url));
      window
        .Axios({
          method: "get",
          url: url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },

          responseType: "arraybuffer" //arraybuffer/blob//加上格式，二进制
        })
        .then(res => {
          let name = res.headers["file_name_urlencode"];
          if (name) {
            const blob = new Blob([res.data], {
              type: "application/zip;charset=utf-8"
            });
            let objectURL = window.URL.createObjectURL(blob);
            window.URL.revokeObjectURL(objectURL); // 释放内存
          }
        });
    },

    handleLeftTabClick(tab) {
      // console.log(tab.name);
      this.activeName = tab.name;
      this.collectDateData = {};
      this.collectAreaData = {};

      if (this.activeName === "indicators") {
        this.$refs.collect.resetIndex();
      }

      if (tab.name === "collect") {
        this.$nextTick(() => {
          $(".indicator-left .el-tabs__active-bar").css({
            left: "-20px"
          });
        });
      } else {
        this.$nextTick(() => {
          $(".indicator-left .el-tabs__active-bar").css({
            left: "0"
          });
        });
      }
    },

    handleRightTabClick(tab) {
      this.activeNameRight = tab.name;
      if (
        Object.keys(this.collectDateData).length > 0 ||
        Object.keys(this.collectAreaData).length > 0
      ) {
        if (this.activeNameRight === "date") {
          this.$refs.indicatorDate.getDateIndicator();
        } else {
          this.$refs.indicatorArea.getData();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .la-main .la-left-side {
  width: 400px ;
  top: 48px !important;
}
.indicator-left {
  /deep/ .el-tabs__content {
    overflow: hidden;
  }

  /deep/ .el-tabs__nav {
    width: 100%;
  }

  /deep/ .el-tabs__active-bar {
    height: 3px;
    border-radius: 5px;
    width: 200px !important;
  }

  /deep/ .el-tabs__item {
    padding: 0;
    height: 50px;
    line-height: 50px;
    text-align: center;
    width: 50%;
    font-size: 16px;
    font-weight: bold;
  }

  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #dfe5f1;
  }
}
/deep/ .la-main .side-fold {
  width: 10px;
  top: 50%;
  left: 400px;
  background: #b5c3d3;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
/deep/ .la-main.fold-left-side .side-fold {
  background: #b5c3d3 !important;
}

/deep/ .la-main .side-fold .arrow-right {
  margin-left: 2px;
}

.indicator {
  height: 100vh;
  min-width: 1280px;
  background: #f5f8fc;
  // padding-top: 48px;

  .la-right {
    padding-top: 10px;
    padding-left: 410px;

    .la-list {
      position: relative;
      box-shadow: 0px 2px 8px 0px #d8e2fa;
      height: 100%;

      /deep/.el-tabs__header {
        border-bottom: 1px solid #dfe5f1;
        padding-left: 10px;
        margin-bottom: 10px;
      }

      /deep/ .el-tabs__item {
        height: 39px;
        line-height: 39px;
        font-size: 14px;
        font-weight: bold;
      }

      /deep/ .el-tabs__active-bar {
        height: 3px;
        border-radius: 5px;
        width: 70px !important;
      }

      .btn-box {
        display: flex;
        position: absolute;
        right: 10px;
        top: 8px;

        div {
          width: 80px;
          height: 26px;
          line-height: 26px;
          border-radius: 4px;
          font-size: 14px;
          color: #fff;
          text-align: center;
          cursor: pointer;
        }

        .collect {
          background: #f4a622;
          margin-right: 10px;
        }

        .export {
          background: #4877e8;
        }
      }
    }
  }

  .prompt-notice {
    z-index: 99999;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #fff5f2;

    .prompt-content {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      height: 100%;
      overflow: hidden;
      img {
        height: 10px;
        margin-top: 10px;
      }
      .text-container {
        width: calc(100% - 40px);
        margin: 0 auto;
        overflow: hidden;
        .text {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #f77d54;
          animation: scroll 20s linear infinite;
        }

        .box {
          width: 500px;
          border: 1px solid red;
          margin: 20px auto;
          overflow: hidden;
        }
        .clearfix:after {
          content: ".";
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
        .inner {
          display: flex;
        }
        ul {
          white-space: nowrap;
          list-style: none;
          display: flex;
        }
        li {
          display: flex;
          margin-right: 30px;
        }
      }
      .close_notice_icon {
        cursor: pointer;
      }
    }
  }
}

/deep/ .el-dialog__body {
  padding: 20px 20px 20px 80px;

  .saved-box {
    display: flex;
    .name {
      width: 80px;
    }
    .el-input {
      width: 250px;
    }
  }
}

/deep/ .el-dialog__footer {
  border-top: 0;
  padding-left: 80px;
  .dialog-footer {
    padding-top: 0;
    .el-button.is-round {
      width: 150px;
      padding: 7px 40px;
    }
  }
}
/deep/.el-tree-node__content > .el-checkbox {
  margin-right: 0;
}
</style>
