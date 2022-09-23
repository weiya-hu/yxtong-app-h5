<template>
  <Main class="yiyuanxiaoshou">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">保存条件</div>
      <SavedPop @closeSavedPop="() => (savedPopVisible = false)" vuex_name="Yyxs"></SavedPop>
    </el-dialog>
    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">高级搜索</div>
      <Advanced :dialogFormVisible="dialogFormVisible" vuex_name="Yyxs" api_name="yyxs" route1="list" route2="analy"
        route3="analy_amount" @closeAdvancedDialog="() => (dialogFormVisible = false)" @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal vuex_name="Yyxs" api_name="yyxs" route1="list" route2="analy" :item="item" :key="index" ref="ileft">
        </Normal>
      </template>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon">
          <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()"
            :class="{ 'abandon-click-method': nopms.gjss }">高级搜索</a>
          <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
            <div slot="content" v-html="helpInfo.high_holder"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Yyxs" route1="list" route2="analy" route3="analy_amount"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Yyxs" api_name="yyxs"></Saved>
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix" :class="{ 'sec1-onTrial': onTrial }">
        <div class="onTrial-wrap" :style="{ height: (onTrial ? 'auto' : '100%') + '!important' }">
          <span class="database-name">{{ allBase.dbname }}</span>
          <!-- <span class="database-num" v-if="baseCount&&$route.path.split('/')[2]==='list'">{{baseCount | formatNumber}}</span> -->
          <div class="sec1-right">
            <!-- <div :class="{'top-help-wrap':update_conf.log}">
              <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
                <div slot="content">
                  <el-scrollbar>
                    <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                  </el-scrollbar>
                  <a class="btn default" :href="helpInfo.url" target="_blank">帮助中心</a>
                </div>
                <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
              </el-tooltip>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
                <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
                <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
              </el-breadcrumb>
            </div> -->
            <div class="top-update-wrap">
              <el-tooltip class="help-tip" effect="light" placement="bottom"
                v-if="helpInfo.remark ? helpInfo.remark : ''">
                <div slot="content">
                  <el-scrollbar>
                    <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                  </el-scrollbar>
                  <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
                </div>
                <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
              </el-tooltip>
              {{ update_conf.log }}

              <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
                <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.route.indexOf('analy') > -1"><a :href="'/' + allBase.dbename">{{
                    allBase.dbname
                }}</a></el-breadcrumb-item>
                <el-breadcrumb-item v-else>{{ allBase.dbname }}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.route.indexOf('analy') > -1">智能分析</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
        </div>
        <div v-if="onTrial" class="database-name-accessory">
          （您当前为试用用户，仅提供2016，2017，2018年销售数据可查，正式用户可查最新数据）
        </div>
      </section>
      <section class="sec2">
        <!-- <div class="la-body-tab">
          <div class="market_nav">
            <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/yyxs/list'}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe627;</i>销售数据</span>
            </a>
            <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/yyxs/analy', 'abandon-click-method': nopms.ksh}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe643;</i>智能分析</span>
            </a>
          </div>
        </div> -->
        <div class="search-body-content">
          <Optioned @showSavedPop="() => (savedPopVisible = true)" @clearLeft="clearLeft" @clearTheLeft="clearTheLeft"
            vuex_name="Yyxs" dbname="yyxs" route1="list" route2="analy" route3="analy_amount">
            <div class="analy-type fl" v-if="route === 'analy' || route === 'analy_amount'">
              <div :class="['analy-type-item', amount_type == 1 ? 'checked' : '']"
                @click="amount_type != 1 && $router.push('/yyxs/analy')">
                销售额
              </div>
              <div :class="['analy-type-item', amount_type == 2 ? 'checked' : '']"
                @click="amount_type != 2 && $router.push('/yyxs/analy_amount')">
                销售量
              </div>
            </div>
            <div class="analy fr" v-if="route === 'analy' || route === 'analy_amount'">
              <i-wave />
              <span>
                快捷查询，试试<router-link :to="{ path: '/yyxsdata' }" class="cl-blue" target="_blank">医院销售数据库</router-link>吧
              </span>
            </div>
          </Optioned>
          <i class="iconfont sh">&#xe60c;</i>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </section>
    </div>
  </Main>
</template>

<script>
import IWave from "@/components/common/icon-wave";
import Saved from "@/components/common/saved";
import SavedPop from "@/components/common/saved-pop";
import Optioned from "@/components/common/options";
import Normal from "@/components/common/normal";
import Advanced from "@/components/common/advanced";
import Filters from "@/components/common/filters";
import Main from "@/components/layouts/main";
import { mapState } from "vuex";

export default {
  components: {
    Saved,
    SavedPop,
    Optioned,
    Normal,
    Advanced,
    Filters,
    Main,
    IWave,
  },
  data() {
    return {
      savedPopVisible: false,
      dialogFormVisible: false, //控制高级搜索弹框
      route: this.$route.path.split("/")[2],
      api_name: "yyxs",
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Yyxs.nopms,
      allBase: (state) => state.Yyxs.allBase,
      helpInfo: (state) => state.Yyxs.helpInfo,
      nomal_filed: (state) => state.Yyxs.nomal_filed,
      advanced_filed: (state) => state.Yyxs.advanced_filed,
      putong: (state) => state.Yyxs.putong,
      baseCount: (state) => state.Yyxs.extendCount.listCount,
      nowNav: (state) => state.Yyxs.dlfx.nowNav,
      update_conf: (state) => state.Yyxs.update_conf,
      accountData: (state) => state.UserCenter.accountData,
    }),
    onTrial() {
      let list = [62, 63, 64, 65, 84, 85, 86];
      let bl = false;
      _.forEach(list, (item) => {
        if (item === this.accountData.grade_id) {
          bl = true;
        }
      });
      return bl;
    },
    amount_type() {
      return this.$route.name == 'database_yyxs_analy_amount' ? "2" : "1";
    },
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val);
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    },
  },
  watch: {
    $route() {
      this.route = this.$route.path.split("/")[2];
    },
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  methods: {
    navRouteTo(index) {
      if (index == 1) {
        this.$router.push({ path: "/yyxs/list" });
      } else if (index == 2 && !this.nopms.ksh) {
        window.ga("send", "event", "tab", "click", "yyxs_analy");
        window._paq.push(["trackEvent", "tab", "click", "yyxs_analy"]);

        this.$router.push({ path: "/yyxs/analy" });
      }
    },
    //获取普通搜索
    nomalSearch() {
      Store.commit("Yyxs/conditions", []);
      //清空高级搜索条件和筛选项
      Store.commit("Yyxs/groups", {});
      if (this.route == "list") {
        Store.dispatch("Yyxs/nomalSearch");
      } else if (this.route == "analy") {
        Store.dispatch("Yyxs/getKshRes");
      } else if (this.route == "analy_amount") {
        Store.dispatch("Yyxs/getKshRes", 2);
      }
    },
    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true;

        if (this.$refs.advanced) {
          // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions();
        }
      }
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
  mounted() {
    Store.dispatch("Yyxs/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
    });
    this.vueRouteFrom("Yyxs");
  },
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

// end-slot
.el-dialog {
  border-radius: 20px !important;
}

// .la-left-side{
//   .el-input__inner{
//     height: 30px;
//     line-height: 30px;
//     border-radius: 15px;
//   }
//   .la-input{
//     padding: 0px 15px;
//   }
//   .title{
//     padding: 10px 0px 4px;
//     font-size: 14px;
//     .title-right{
//       float: right;
//       color: @FontColor3;
//     }
//   }
//   .la-date{
//     padding: 0px 15px;
//     .shortcut-date{
//       font-size: @FontSizeSmall;
//       .el-radio{
//         margin-bottom: 10px;
//       }
//       .el-radio+.el-radio{
//         margin: 0px 2px 2px 0px;
//       }
//       .el-radio__label{
//         padding: 0px 2px 0px;
//         margin: 0px 5px;
//         font-size: @FontSizeSmall;
//       }
//     }
//     .date-range{
//       .el-radio__label{
//         padding-left: 4px;
//         font-size: @FontSizeSmall;
//       }
//       .el-input__inner{
//         padding: 0px 0px 0px 20px;
//       }
//       .el-date-editor.el-input, .el-date-editor.el-input__inner{
//         width: 100px;
//       }
//       .el-input__prefix{
//         left: 3px;
//       }
//       .el-input__icon{
//         width: 11px;
//         line-height: 30px;
//       }
//     }
//   }
//   .item{
//     padding-bottom: 20px;
//   }
//   .item-title{
//     display: block;
//     height: 30px;
//     padding-left: 15px;
//     line-height: 30px;
//     font-size: @FontSize;
//     background-color: @PrimaryBackgroundColor;
//   }
//   .el-dialog__header{
//     padding: 20px 0px;
//     font-size: 15px;
//     border-bottom: 1px solid @BorderColor;
//     .dialog-header{
//       padding: 0px 30px;
//     }
//   }
// }
.la-right {
  .sec1 {
    line-height: 60px;
    padding-left: 30px;

    .database-name {
      color: @PrimaryColor;
      font-size: 28px;
    }

    .database-num {
      font-size: 26px;
      font-weight: 900;
    }

    .sec1-right {
      float: right;

      .help-tip {
        padding-right: 10px;
      }
    }
  }

  .sec2 {
    .market_nav {
      .nav_one {
        width: 50%;

        .nav {
          i {
            font-size: 26px;
            margin-right: 4px;
            font-weight: normal;
          }
        }
      }
    }

    .la-body-tab {
      box-shadow: 0 -4px 5px -3px #c4d3f8;
    }
  }
}

.yiyuanxiaoshou {
  .analy {
    display: inline-block;
    height: 40px;
    line-height: 40px;
  }
}

.search-body-content {
  width: 100%;
  position: relative;

  .sh {
    position: absolute;
    right: 26px;
    top: 16px;
    cursor: pointer;
    z-index: 7;
    display: none;
  }

  .analy-type {
    display: flex;
    line-height: 40px;

    &-item {
      font-size: 14px;
      margin-right: 30px;
      position: relative;
      cursor: pointer;

      &:hover {
        color: #4877e8;
      }

      &.checked {
        color: #4877e8;

        &::after {
          display: block;
          content: "";
          position: absolute;
          height: 3px;
          width: 100%;
          background-color: #4877e8;
          border-radius: 2px;
          bottom: 0;
          left: 0;
        }
      }
    }

    &::after {
      display: block;
      width: 100%;
      border-bottom: 1px solid #dfe5f1;
      content: "";
      position: absolute;
      top: 40px;
      left: 0;
    }
  }
}
</style>
