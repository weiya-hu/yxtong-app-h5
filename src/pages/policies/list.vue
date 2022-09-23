<template>
  <div class="policies-list" :style="{
    'height': showPromtNotice? 'calc(100vh - 88px)':'calc(100vh - 48px)',
    'padding-top': showPromtNotice? '78px':'48px',
  }">
    <LoadingGif v-if="listLoading" :loadFlag="listLoading"></LoadingGif>
    <div class="breadcrumb">
      <el-tooltip class="help-tip" effect="light" v-if="helpInfo.remark ? helpInfo.remark : ''">
        <div slot="content">
          <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
          <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
        </div>
        <span><span class="section-ico-qa"></span>帮助</span>
      </el-tooltip>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
        <el-breadcrumb-item><a href="/policies/home">政策法规</a></el-breadcrumb-item>
        <el-breadcrumb-item>列表检索</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 已选条件 -->
    <Optioned @showSavedPop="showSavedPop" @clearTheLeft="clearTheLeft" @clearLeft="clearLeft" vuex_name="Policies"
      route1="list"></Optioned>

    <!-- 面板开始 -->
    <div class="container" :style="{height: isSearch? 'calc(100% - 35px)':'100%'}">
      <div class="panel">
        <el-tabs v-model="activeTabName" @tab-click="handleClickTag" class="la-list policies-list" ref="tab">
          <el-tab-pane v-for="(item,index) in tabs" :key="item.key" :name="item.key">
            <span slot="label">
              {{ item.label}}
              <span class="num" v-if="item.doc_count">({{ formattedNumber(item.doc_count)}})</span>
            </span>
            <CardItem :tab="tab" :tabs="tabs" :list="list.res" @handleCurrentChange="handleCurrentChange">
            </CardItem>
            <!-- <CardItemFilterd v-else :tab="tab" :tabs="tabs" :list="list.res" @handleCurrentChange="handleCurrentChange">
            </CardItemFilterd> -->
          </el-tab-pane>
        </el-tabs>
        <NoData v-if="tabs.length === 0 ||list.length === 0"></NoData>
      </div>
    </div>
    <!-- 面板结束 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import NoData from "./components/noData";
import Optioned from "@/components/common/policies/options";
import CardItem from "./components/card-item";
import CardItemFilterd from "./components/card-item-filterd";
import LoadingGif from '@/components/common/globalCom/loading-gif'

export default {
  components: {
    NoData,
    Optioned,
    CardItem,
    CardItemFilterd,
    LoadingGif
  },
  data() {
    return {
      route: this.$route.path.split("/")[2],
      activeTabName: "",
      savedPopVisible: false,
      html: `<span></span><el-tooltip>`,
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Policies.allBase,
      helpInfo: (state) => state.Policies.helpInfo,
      showPromtNotice: (state) => state.showPromtNotice,
      listLoading: (state) => state.Policies.listLoading,
      tabs: (state) => state.Policies.tabs,
      tab: (state) => state.Policies.tab,
      list: (state) => state.Policies.list,
      parent_type: (state) => state.Policies.parent_type,
      // activeTabName: (state) => state.Policies.activeTabName,
      param: (state) => state.Policies.param,
      pageObj: (state) => state.Policies.pageObj,
      putong: (state) => state.Policies.putong,
      gaoji: (state) => state.Policies.gaoji,
      shaixuan: (state) => state.Policies.shaixuan,
      groups: (state) => state.Policies.groups,
      isSearch: (state) => state.Policies.isSearch,
      storeState: (state) => state.Policies,
      total: (state) => state.Policies.total,
    }),
  },
  watch: {
    list: {
      handler(val) {
        if (this.isEmpty(val)) {
        }
      },
      deep: true,
      immediate: true,
    },
    tabs: {
      handler(val) {
        if (this.isEmpty(val)) {
          this.activeTabName = '0'
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // Store.dispatch('Policies/nomalSearch');
    // this.getTabs(this.pageObj); // 获取顶部tabs
    localStorage.setItem('firstInPolicies', true)
  },
  activated() {
    let status = Object.keys(this.storeState.putong).length > 1 ||
      (this.storeState.gaoji && this.storeState.gaoji.words) ||
      (this.storeState.fourth && this.storeState.fourth.fourth_condition) ||
      (this.storeState.shaixuan && this.storeState.shaixuan.filter_condition)
    Store.commit('Policies/isSearch', status)
    // 不是第一次进入页面 才执行
    if (localStorage.getItem('firstInPolicies') == 'false') {
      Store.dispatch("Policies/nomalSearch");
    }

    localStorage.setItem('firstInPolicies', false)
  },
  beforeDestroy() {
    // 离开页面就删掉这个状态值
    localStorage.removeItem('firstInPolicies')
  },
  methods: {
    resetActivePosition($el) {
      this.$nextTick(() => {
        const activeEl = $el.querySelector(".el-tabs__item.is-active");
        const lineEl = $el.querySelector(".el-tabs__active-bar");
        const style = getComputedStyle(activeEl);
        const pl = style.paddingLeft.match(/\d+/)[0] * 1;
        const pr = style.paddingRight.match(/\d+/)[0] * 1;
        const w = style.width.match(/\d+/)[0] * 1;
        lineEl.style.transform =
          "translateX(" + (activeEl.offsetLeft + pl) + "px)";
        lineEl.style.width = w - pl - pr + "px";
      });
    },
    handleCurrentChange(tab, pageObj) {
      Store.commit("Policies/parent_type", tab.key);
      let paramsObj = Object.assign(this.param, {
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
      if (tab.key) {
        paramsObj = Object.assign(paramsObj, {
          parent_type: tab.key,
        });
      }
      paramsObj.page = tab[pageObj].page;
      window
        .Axios({
          method: "get",
          url: "/api/policies",
          params: paramsObj,
        })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data.res;
            Store.commit("Policies/list", res.data.data);
          } else {
            Store.commit("Policies/list", []);
          }
          Store.commit("Policies/listLoading", false);
        })
        .catch((err) => {
          console.error(err);
          Store.commit("Policies/list", []);
          Store.commit("Policies/listLoading", false);
        });
    },
    async getTabs(params) {
      try {
        let res = await Promise.all([
          Store.dispatch("Policies/getTabs", params),
        ]);
        if (res[0].data.code === 200 && res[0].data) {
          let data = res[0].data.data;
          Store.commit("Policies/tabs", data);
          Store.commit("Policies/tab", data[0]);
          this.handleClickTag(this.tabs[1], this.pageObj);
        } else {
          Store.commit("Policies/tabs", []);
          Store.commit("Policies/tab", '');
        }
      } catch (error) {
        Store.commit("Policies/tabs", []);
        Store.commit("Policies/tab", '');
      }
    },
    async handleClickTag(tab, key, event) {
      this.resetActivePosition(this.$refs.tab.$el);
      Store.commit("Policies/listLoading", true);
      Store.commit("Policies/parent_type", tab.name);
      Store.commit("Policies/tab", this.tabs.filter(item => item.key === tab.name)[0]);
      let paramsObj = Object.assign(this.param, {
        accesstoken: GETCOOKIEFUN("accesstoken"),
      });
      if (tab.name != "") {
        paramsObj = Object.assign(paramsObj, {
          parent_type: tab.name,
        });
      } else {
        delete paramsObj.parent_type;
      }
      paramsObj.page = this.pageObj[tab.name].page;
      window
        .Axios({
          method: "get",
          url: '/api/policies',
          params: paramsObj
        })
        .then(async subRes => {
          if (subRes.data.code === 200 && subRes.data) {
            let data2 = subRes.data.data.res;
            let pageObj = _.cloneDeep(this.pageObj)
            pageObj[tab.name].total = Number(subRes.data.data.count);
            Store.commit('Policies/pageObj', pageObj);
            Store.commit('Policies/total', Number(subRes.data.data.count));
            Store.commit("Policies/error", 0);
            Store.commit("Policies/list", subRes.data.data);
            Store.commit("Policies/listLoading", false);
          } else if (subRes.data.code == 404) {
            Store.commit("Policies/error", 404);
            Store.commit("Policies/listLoading", false);
            Store.commit('Policies/total', 0);
            Store.commit("Policies/list", []);
            Store.commit('Policies/pageObj', {});
          }
        })
        .catch(subRes => {
          console.error(subRes)
          Store.commit("Policies/error", 500);
          Store.commit("Policies/listLoading", false);
          Store.commit('Policies/total', 0);
          Store.commit("Policies/list", []);
          Store.commit('Policies/pageObj', {});
        });
    },
    formattedNumber(num) {
      // flag用于判断数字是正数还是负数（true负数）
      let flag = false;
      if (!num) {
        return "";
      }
      if (num < 0) {
        num = Math.abs(num);
        flag = true;
      }
      var num = num.toString();
      let numArry = num.split(".");
      let intPart = Math.trunc(num); // 获取整数部分
      let intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
      var result = "";
      if (numArry[1]) {
        result = intPartFormat + `.${numArry[1]}`;
      } else {
        result = intPartFormat;
      }
      return flag ? `-${result}` : result;
    },
    showSavedPop() {
      this.savedPopVisible = true;
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft();
    },
    // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
    clearTheLeft(option) {
      this.vueClearTheLeft(option);
    },
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.policies-list {
  margin-bottom: 10px;

  .breadcrumb {
    float: right;
    display: flex;
    align-items: center;
    height: 45px;

    .help-tip {
      display: flex;
      align-items: center;
      height: 14px;
      line-height: 14px;
    }

    .el-breadcrumb {
      z-index: 9;
      margin-left: 20px !important;

      .el-breadcrumb__item:first-child .el-breadcrumb__inner {
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .cl-green {
      color: #ffa914;
    }

    .section-ico-qa {
      width: 14px;
      height: 14px;
      display: block;
      margin-right: 5px;
      background-image: url(/static/imgs/globaldrugs/qa-y.png);
      background-size: cover;
      z-index: 9;
    }
  }

  .policies-no-data {
    height: calc(100vh - 180px) !important;
  }

  .container {
    transition: all 300ms 50ms;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .panel {
      background: #fff;
      border-radius: 4px;
      // height: calc(100% - 20px);
      min-height: calc(100% - 10px);
      padding: 10px;
      box-shadow: @BoxShadow;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px;

      .el-tabs__header {
        padding-left: 14px;
        margin: 0px;
        border-bottom: 1px solid #ebeef5;
      }

      .el-tabs__content {
        overflow: visible;
        padding: 10px 0 0 0;
      }

      .el-tabs__active-bar {
        height: 3px;
        border-radius: 2px;
        background-color: #002fa7;
      }

      .el-tabs__item {
        padding: 0 10px;
        color: #333;

        &:hover {
          color: #000f32;
        }

        .num {
          color: #9aa4b8 !important;
          font-weight: 400 !important;
        }
      }

      .el-tabs__item.is-disabled {
        color: #c0c4cc;
      }

      .el-tabs__item.is-active {
        color: #000f32;
        font-weight: bold;

        .num {
          color: #5c6973 !important;
          font-weight: bold;
        }
      }
    }
  }

  .el-loading-mask {
    z-index: 9 !important;
  }

  .fullscreen-loading {
    left: 298px !important;
    width: calc(100vw - 298px) !important;

    @media screen and (max-width: 1280px) {
      left: 270px !important;
      width: calc(100vw - 270px) !important;
    }
  }
}

.pc-policies-list .la-right {
  height: 100vh !important;
}
</style>
