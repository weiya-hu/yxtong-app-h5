<template>
  <Main class="epyp">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Epyp"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Epyp"
        api_name="epyp"
        route1="list"
        route2="analy"
        route3="qb"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->

      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Epyp"
          api_name="epyp"
          route1="list"
          route2="analy"
          route3="qb"
          :item="item"
          :key="index"
          ref="ileft"></Normal>
      </template>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon">
          <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()" :class="{'abandon-click-method': nopms.gjss}">高级搜索</a>
          <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
            <div slot="content" v-html="helpInfo.high_holder"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->

      <!-- 热点筛选条件 -->
      <!-- <HotFilter vuex_name="Epyp" route1="list" route2="analy" route3="qb"></HotFilter> -->
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Epyp" route1="list" route2="analy" route3="qb"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Epyp" api_name="epyp"></Saved>
      <!-- 历史搜索 -->

    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{allBase.dbname}}</span>
        <!-- <span class="database-num" v-if="extendCount">{{extendCount | formatNumber}}</span> -->
        <div class="sec1-right">
          <div class="top-update-wrap">
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            {{update_conf.log}}

            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.indexOf('analy')>-1"><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
              <el-breadcrumb-item v-else>{{allBase.dbname}}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.indexOf('analy')>-1">智能分析</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </section>
      <section class="sec2">
        <div class="la-body-tab">
          <div class="tab-nav">
            <Nav></Nav>
          </div>
        </div>
        <div class="search-body-content">
          <Optioned
            minHeight
            @showSavedPop="showSavedPop"
            @clearTheLeft="clearTheLeft"
            @clearLeft="clearLeft"
            vuex_name="Epyp"
            route1="list"
            route2="analy"
            route3="qb"></Optioned>
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
  import Saved from '@/components/common/saved'
  import SavedPop from '@/components/common/saved-pop'
  import Normal from '@/components/common/normal'
  import Advanced from '@/components/common/advanced'
  import Optioned from '@/components/common/options'
  import Filters from '@/components/common/filters-config'
  import Main from '@/components/layouts/main'
  import { mapState } from 'vuex'
  import List from './list'
  import Nav from '../components/nav'

  export default{
    components: {
      Saved,
      SavedPop,
      Optioned,
      Normal,
      Advanced,
      Filters,
      Main,
      List,
      Nav,
    },
    data () {
      return {
        savedPopVisible: false,
        dialogFormVisible: false, //控制高级搜索弹框
        route: this.$route.path.split('/')[2],
        api_name:'epyp'
      };
    },
    computed:{
      ...mapState({
        nopms: state => state.Epyp.nopms,
        allBase: state => state.Epyp.allBase,
        helpInfo: state => state.Epyp.helpInfo,
        nomal_filed: state => state.Epyp.nomal_filed,
        advanced_filed: state => state.Epyp.advanced_filed,
        putong: state => state.Epyp.putong,
        extendCount: state => state.Epyp.extendCount,
        update_conf: state => state.Epyp.update_conf,
      })
    },
    filters: {
      // 给数字每三位数加一个逗号
      formatNumber (val) {
        val = parseInt(val)
        return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
    watch: {
      $route () {
        this.route = this.$route.path.split('/')[2]
      }
    },
    filters: {
      // 给数字每三位数加一个逗号
      formatNumber (val) {
        val = parseInt(val)
        return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
    methods: {
      // 关闭保存条件框（可能并没有起作用，可有可无）
      closeSavedPop () {
        this.savedPopVisible = false
      },
      showSavedPop () {
        this.savedPopVisible = true
      },
      //获取普通搜索
      nomalSearch () {
        Store.commit("Epyp/conditions",[])
        //清空高级搜索条件和筛选项
        Store.commit('Epyp/groups',{})
        Store.dispatch('Epyp/nomalSearch')
      },
      // 点击左侧栏中的“高级搜索”触发的事件
      handleAdvancedClick () {
        if (!this.nopms.gjss) {
          this.dialogFormVisible = true

          if (this.$refs.advanced) { // 第一次点击之后才渲染，所以加此判定
            this.$refs.advanced.initConditions()
          }
        }
      },
      // 关闭高级搜索框（可能并没有起作用，可有可无）
      closeAdvancedDialog () {
        this.dialogFormVisible = false
      },
      // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
      clearLeft () {
        this.vueClearLeft()
      },
      // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
      clearTheLeft (option) {
        this.vueClearTheLeft(option)
      },
    },
    created () {
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    mounted () {
      Store.dispatch("Epyp/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom("Epyp")
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/var.less";
  .el-dialog {
    border-radius: 20px!important;
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
  .la-right{
    .sec1{
      height: 60px;
      line-height: 60px;
      padding-left: 30px;
      text-align: bottom;
      .database-name{
        color: @PrimaryColor;
        font-size: 28px;
      }
      .database-num{
        font-size: 26px;
        font-weight: 900;
      }
      .sec1-right{
        float: right;
        .help-tip{
          padding-right: 10px;
          color: @FontColor;
        }
      }
    }
     .sec2{

      .tab-nav{
        height: 60px;
        overflow: hidden;
        width: 100%;
        .iconfont{
          font-size: @FontSizeHuge;
          padding-right: 3px;
          font-size: 24px;
          display: inline-block;
        }
        .item {
          // display: inline-block;
          height: 60px;
          width: 33.33%;
          float: left;
          box-sizing: border-box;
          text-decoration: none;
          transition: all 300ms;
          .nav{
            display: flex;
            justify-content: center;
            flex-wrap: nowrap;
            align-items: center;
            height: 60px;
            width: 100%;
            font-size:@FontSizeLarge;
            text-align: center;
            box-shadow: 0px 0px 2px #c4d3f8;
            font-weight: 700;
            .nav-title {
              display: inline-block;
            }
          }
          &:hover{
            color: Lighten(@PrimaryColor, 10%);
            background: #f5f7fb;;
            transition: all 300ms;
          }
        }
      }
      .router-link-active{
        .nav{
          color: @PrimaryColor;
          background-color: #fff;
          // box-shadow: none;
        }
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
  }
  // el-dialog遮罩层样式（背景色）
  .v-modal {
    background: rgba(102,102,102, .4);
  }
</style>
