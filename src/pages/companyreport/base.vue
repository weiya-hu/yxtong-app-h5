<template>
  <div class="company-index">
    <Main class="">
      <!-- 保存条件 - 输入名称 弹出框 -->
      <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
        <div slot="title" class="dialog-header">
          保存条件
        </div>
        <SavedPop @closeSavedPop="closeSavedPop" vuex_name="CompanyReport"></SavedPop>
      </el-dialog>

      <div slot="left">
        <div>
          <!-- 普通搜索项 -->
          <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
            <Normal
              vuex_name="CompanyReport"
              api_name="company"
              :item="item"
              :key="index"
              ref="ileft"></Normal>
          </template>
          <div class="advanced-search">
            <el-button class="normal-search-btn" type="primary" size="mini" round @click="nomalSearch">搜 索</el-button>
          </div>
        </div>
        <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
        <Filters vuex_name="CompanyReport"></Filters>
        <!-- 保存的条件 -->
        <Saved vuex_name="CompanyReport" api_name="company"></Saved>
        <!-- 历史搜索 -->

      </div>
      <div solt="content" class="la-right">
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
            </div>
          </div>
        </section>
        <section class="sec2">
          <Optioned
            @showSavedPop="showSavedPop"
            @clearTheLeft="clearTheLeft"
            @clearLeft="clearLeft"
            vuex_name="CompanyReport"></Optioned>
          <!-- List组件 -->
          <List></List>
        </section>
      </div>
    </Main>
  </div>
</template>

<script>
  import Saved from '@/components/common/saved'
  import SavedPop from '@/components/common/saved-pop'
  import Filters from '@/components/common/filters'
  import Normal from '@/components/common/normal'
  import Optioned from '@/components/common/options'
  import Main from '@/components/layouts/main'
  import List from './list'

  import { mapState } from 'vuex'
  export default{
    components:{
      Saved,
      SavedPop,
      Filters,
      Normal,
      Optioned,
      Main,
      List,
    },
    data () {
      return {
        savedPopVisible: false,
      }
    },
    computed:{
      ...mapState({
        allBase: state => state.CompanyReport.allBase,
        helpInfo: state => state.CompanyReport.helpInfo,
        nomal_filed: state => state.CompanyReport.nomal_filed,
        advanced_filed: state => state.CompanyReport.advanced_filed,
        putong: state => state.CompanyReport.putong,
        extendCount: state => state.CompanyReport.extendCount,
        update_conf: state => state.CompanyReport.update_conf,
      }),
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
      Store.dispatch("CompanyReport/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom("CompanyReport")
    },
    methods:{
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
        Store.commit('CompanyReport/groups',{})
        Store.dispatch('CompanyReport/nomalSearch')
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
    filters: {
      // 给数字每三位数加一个逗号
      formatNumber (val) {
        val = parseInt(val)
        return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.company-index {
  height: 100%;
  // .la-left-side{
  //   width: 250px;
  //   //height: 930px;
  //   .title{
  //     padding: 10px 0px 4px;
  //     font-size: 14px;
  //     .title-right {
  //       float: right;
  //       color: @FontColor3;
  //     }
  //   }
  //   .la-input {
  //     padding: 0px 15px;
  //   }
  //   .noraml-search-btn {
  //     display: inline-block;
  //     box-sizing: border-box;
  //     width: calc(100% - 30px);
  //     margin: 40px 15px;
  //     word-spacing: 1em;
  //   }
  //   .item {
  //     padding-bottom: 20px;
  //   }
  //   .item-title {
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
      text-align: bottom;
      padding-left: 30px;
      .database-name{
        // padding-left: 50px;
        color: @PrimaryColor;
        font-size: 28px;
        margin-right: 10px;
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
      box-shadow: @BoxShadow;
    }
  }
}
</style>
