<template>
  <Main>
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="ShuomingshuCsm"></SavedPop>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="ShuomingshuCsm"
          api_name="unlabeleduse"
          :item="item"
          :key="index"
          ref="ileft"></Normal>
      </template>
      <!-- 普通搜索按钮 -->
      <div class="advanced-search">
        <!-- 普通搜索 -->
        <el-button class="normal-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 保存的条件 -->
      <Saved vuex_name="ShuomingshuCsm" api_name="unlabeleduse"></Saved>
      <!-- 历史搜索 -->

    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{allBase.dbname}}</span>
        <!-- <span class="database-num" v-if="extendCount">{{extendCount | formatNumber}}</span> -->
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
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item>超说明书</el-breadcrumb-item>
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
            @showSavedPop="showSavedPop"
            @clearTheLeft="clearTheLeft"
            @clearLeft="clearLeft"
            vuex_name="ShuomingshuCsm"></Optioned>
            <i class="iconfont sh">&#xe60c;</i>
          <!-- &#xe67f; -->
          <List @clearLeft="clearLeft"></List>
        </div>
      </section>
    </div>
  </Main>
</template>

<script>
  import Saved from '@/components/common/saved'
  import SavedPop from '@/components/common/saved-pop'
  import Normal from '@/components/common/normal'
  import Optioned from '@/components/common/options'
  import Main from '@/components/layouts/main'
  import { mapState } from 'vuex'
  import List from './list'
  import Nav from '../components/nav'

  export default{
    components: {
      Saved,
      SavedPop,
      Normal,
      Optioned,
      Main,
      List,
      Nav,
    },
    data () {
      return {
        savedPopVisible: false,
        route: this.$route.path.split('/')[2],
        api_name: 'unlabeleduse',
      };
    },
    computed:{
      ...mapState({
        nopms: state => state.ShuomingshuCsm.nopms,
        allBase: state => state.ShuomingshuCsm.allBase,
        helpInfo: state => state.ShuomingshuCsm.helpInfo,
        nomal_filed: state => state.ShuomingshuCsm.nomal_filed,
        advanced_filed: state => state.ShuomingshuCsm.advanced_filed,
        putong: state => state.ShuomingshuCsm.putong,
        extendCount: state => state.ShuomingshuCsm.extendCount,
        update_conf: state => state.ShuomingshuCsm.update_conf,
      })
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
        //清空高级搜索条件和筛选项
        Store.dispatch('ShuomingshuCsm/nomalSearch')
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
      Store.dispatch("ShuomingshuCsm/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom("ShuomingshuCsm")
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
