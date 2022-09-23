<template>
  <Main class="zhuce-list">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Zhuce"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>

      <Advanced :dialogFormVisible="dialogFormVisible" vuex_name="Zhuce" api_name="zhuce" route1="list" route2="analy"
        route3="qb" route4="analy_breed" @closeAdvancedDialog="closeAdvancedDialog" @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left" style="position: relative;">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal vuex_name="Zhuce" api_name="zhuce" :item="item" route1="list" route2="analy" route3="qb"
          route4="analy_breed" :key="index" ref="ileft"></Normal>
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
          <img src="/static/imgs/newProjectGuide/new.png" v-if="is_show_new" @click.prevent="handleAdvancedClick()"
            alt="高级搜索" class="new-img" />
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 热点筛选条件 -->
      <HotFilter vuex_name="Zhuce" route1="list" route2="analy" route3="qb" route4="analy_breed"></HotFilter>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Zhuce" route1="list" route2="analy" route3="qb" route4="analy_breed"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Zhuce" api_name="zhuce"></Saved>
      <!-- 历史搜索 -->

    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{ allBase.dbname }}</span>
        <!-- <span class="database-num" v-if="baseCount&&$route.path.split('/')[2]==='list'">{{baseCount | formatNumber}}</span> -->
        <div class="sec1-right">
          <!-- <div :class="{'top-help-wrap':update_conf.log}"> -->

          <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
            </el-breadcrumb> -->
          <!-- </div> -->

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
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.route.indexOf('analy')>-1"><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
              <el-breadcrumb-item v-else>{{allBase.dbname}}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.route.indexOf('analy')>-1">智能分析</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </section>
      <section class="sec2 newsec2">
        <!-- <div class="la-body-tab"> -->
        <!-- <div class="market_nav"> -->
        <!-- <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/zhuce/list'}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe62d;</i>注册数据</span>
            </a> -->
        <!-- <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/zhuce/analy', 'abandon-click-method': nopms.ksh}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe643;</i>智能分析</span>
            </a> -->
        <!-- 注册情报 暂未开发，暂时隐藏，将两个 a 的宽度改为 50%；如果以后开发，记得将宽度改回 33.33% -->
        <!-- <a @click.prevent="navRouteTo(3)" class="nav_one" :class="{'router-link-active': $route.path == '/zhuce/qb'}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe642;</i>注册情报</span>
            </a> -->
        <!-- </div> -->
        <!-- </div> -->
        <div class="search-body-content">
          <Optioned @showSavedPop="showSavedPop" @clearTheLeft="clearTheLeft" @clearLeft="clearLeft" dbname="zhuce"
            vuex_name="Zhuce" route1="list" route2="analy" route3="qb" route4="analy_breed">
            <div class="analy-type fl" v-if="route === 'analy' || route === 'analy_breed'">
              <div :class="['analy-type-item', analy_zhuce_type == 1 ? 'checked' : '']" @click="tabClick(1)">
                按受理号统计
              </div>
              <div :class="['analy-type-item', analy_zhuce_type == 2 ? 'checked' : '']" @click="tabClick(2)">
                按品种统计
                <el-tooltip class="item" effect="light" placement="right">
                  <div slot="content" v-html="'按品种统计：按“药品+企业”从各个维度进行统计分析。'"></div>
                  <i class="el-icon-question cl-green"></i>
                </el-tooltip>
              </div>
            </div>
            <div class="analy fr" v-if="route === 'analy' || route === 'analy_breed'">
              <div class="go-list">
                <router-link tag="a" :to="{ path: '/zhuce/list' }">返回列表</router-link>
              </div>
            </div>
          </Optioned>
          <i class="iconfont sh">&#xe60c;</i>
          <!-- &#xe67f; -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </section>
    </div>
  </Main>
</template>

<script>
import { mapState } from 'vuex'
import Main from '@/components/layouts/main'
import Saved from '@/components/common/saved'
import SavedPop from '@/components/common/saved-pop'
import Optioned from '@/components/common/options'
import Normal from '@/components/common/normal'
import Advanced from '@/components/common/advanced'
import Filters from '@/components/common/filters-config'
import HotFilter from '@/components/common/hot-filter'

export default {
  components: {
    Main,
    Normal,
    Advanced,
    HotFilter,
    Filters,
    Saved,
    SavedPop,
    Optioned,
  },
  data() {
    return {
      savedPopVisible: false,
      dialogFormVisible: false, //控制高级搜索弹框
      route: this.$route.path.split('/')[2],
      basic: {},
      api_name: 'zhuce',
      vuex_name: 'Zhuce',
      isShowNew: false
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Zhuce.allBase,
      helpInfo: state => state.Zhuce.helpInfo,
      nomal_filed: state => state.Zhuce.nomal_filed,
      advanced_filed: state => state.Zhuce.advanced_filed,
      baseCount: state => state.Zhuce.extendCount.BaseCount,
      putong: state => state.Zhuce.putong,
      nopms: state => state.Zhuce.nopms,
      norules: state => state.Zhuce.norules,
      update_conf: state => state.Zhuce.update_conf,
    }),
    // 判断高级搜索旁边的new标签是否显示
    is_show_new() {
      Store.state[this.vuex_name].advanced_filed.map(item => {
        if (item.is_show_new === 1) {
          this.isShowNew = true
        }
      })
      return this.isShowNew
    },
    analy_zhuce_type() {
      return this.$route.name == 'database_zhuce_analy_breed' ? "2" : "1";
    },
  },
  filters: {
    // 给数字每三位数加一个逗号
    formatNumber(val) {
      val = parseInt(val)
      return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    }
  },
  watch: {
    $route() {
      this.route = this.$route.path.split('/')[2]
    },

  },
  methods: {
    tabClick(type) {
      if (type == 1) {
        window.ga("send", "event", "button", "click", "vip_zhuce_analy_shoulihao")
        window._paq.push(['trackEvent', 'button', '企业版-注册-智能分析', '按受理号统计'])
        this.analy_zhuce_type != 1 && this.$router.push('/zhuce/analy')
      } else if (type == 2) {
        window.ga("send", "event", "button", "click", "vip_zhuce_analy_pinzhong")
        window._paq.push(['trackEvent', 'button', '企业版-注册-智能分析', '按品种统计'])
        this.analy_zhuce_type != 2 && this.$router.push('/zhuce/analy_breed')
      }
    },
    // 关闭保存条件框
    closeSavedPop() {
      this.savedPopVisible = false
    },
    showSavedPop() {
      this.savedPopVisible = true
    },
    //获取普通搜索
    nomalSearch() {
      Store.commit("Zhuce/conditions", [])
      //清空高级搜索条件和筛选项
      Store.commit('Zhuce/groups', {})
      if (this.route == 'list') {
        Store.dispatch('Zhuce/nomalSearch')
      } else if (this.route == 'analy') {
        Store.dispatch('Zhuce/getKshRes')
      } else if (this.route == "analy_breed") {
        Store.dispatch("Zhuce/getKshRes_Breed");
      }
    },
    // 点击左侧栏中的“高级搜索”触发的事件
    handleAdvancedClick() {
      if (!this.nopms.gjss) {
        this.dialogFormVisible = true

        if (this.$refs.advanced) { // 第一次点击之后才渲染，所以加此判定
          this.$refs.advanced.initConditions()
        }
      }
      window.ga("send", "event", "botton", "click", "advanced_search", "search")
      window._paq.push(['trackEvent', 'botton', "click", "advanced_search", "search"])

    },
    // 关闭高级搜索框（可能并没有起作用，可有可无）
    closeAdvancedDialog() {
      this.dialogFormVisible = false
    },
    // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
    clearLeft() {
      this.vueClearLeft()
    },
    // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
    clearTheLeft(option) {
      this.vueClearTheLeft(option)
    },
    navRouteTo(index) {
      if (index == 1) {
        this.$router.push({ path: '/zhuce/list' })
      } else if (index == 2 && !this.nopms.ksh) {
        window.ga("send", "event", "tab", "click", "zhuce_analy");
        window._paq.push(['trackEvent', 'tab', "click", "zhuce_analy",])

        this.$router.push({ path: '/zhuce/analy' })
      }
    },
    totalHtml() {
      let win = window.performance.timing
      //     console.log('页面渲染时间统计： '+ (win.domContentLoadedEventEnd - win.navigationStart));
      //     console.log('---------------------------------------')
      //     console.log('请求耗时：' + (win.responseEnd - win.responseStart))
    }
  },
  created() {
    // Store.commit("Zhuce/reset")
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
    localStorage.setItem( //newProjectGuide 组件需要的东西
      "newProjectGuideArr",
      JSON.stringify([])
    )
    localStorage.setItem("domPosition", "")
  },
  mounted() {
    Store.dispatch("Zhuce/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip()
    })
    this.vueRouteFrom("Zhuce")
    this.totalHtml()
  },
}
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

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
    height: 40px;
    line-height: 40px;

    .database-name {
      color: @SerchFontColor;
      font-size: 18px;
      font-weight: bold;
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
      font-weight: 600;
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

// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, .4);
}

.new-img {
  position: absolute;
  top: 0;
  cursor: pointer;
  right: -20px;
}

.zhuce-list {
  .analy {
    display: inline-block;
    height: 40px;
    line-height: 40px;

    .go-list {
      width: 86px;
      height: 24px;
      line-height: 24px;
      background: #F4A622;
      border-radius: 4px;
      margin-top: 8px;
      text-align: center;
      cursor: pointer;

      a {
        text-decoration: none;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
      }
    }
  }
}
</style>
