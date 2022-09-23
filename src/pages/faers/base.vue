<template>
<!-- 药品不良反应信息分析预警系统 -->
  <Main>
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Faers"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Faers"
        route1="list"
        api_name="faers"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Faers"
          api_name="faers"
          route1="list"
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
          <img src="/static/imgs/newProjectGuide/new.png" v-if="is_show_new" @click.prevent="handleAdvancedClick()" alt="高级搜索" class="new-img"/>
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 热点筛选条件 -->
      <HotFilter vuex_name="Faers" route1="list"></HotFilter>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Faers" route1="list"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Faers" api_name="faers"></Saved>
      <!-- 历史搜索 -->

    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{allBase.dbname}}</span>
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
          </div>
        </div>
      </section>
      <section class="sec2">
        <div class="search-body-content">
          <Optioned
          minHeight
          @showSavedPop="showSavedPop"
          @clearTheLeft="clearTheLeft"
          route1="list"
          route2="analy"
          @clearLeft="clearLeft"
          vuex_name="Faers"></Optioned>
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
  import HotFilter from '@/components/common/hot-filter'
  import Main from '@/components/layouts/main'
  import { mapState } from 'vuex'

  export default{
    components: {
      Saved,
      SavedPop,
      Optioned,
      Normal,
      Advanced,
      Filters,
      HotFilter,
      Main,
    },
    data () {
      return {
        savedPopVisible: false,
        api_name:'faers',
        vuex_name: 'Faers',
        dialogFormVisible: false, //控制高级搜索弹框
        route: this.$route.path.split('/')[2],
        isShowNew: false
      };
    },
    computed:{
      ...mapState({
        nopms: state => state.Faers.nopms,
        allBase: state => state.Faers.allBase,
        helpInfo: state => state.Faers.helpInfo,
        nomal_filed: state => state.Faers.nomal_filed,
        advanced_filed: state => state.Faers.advanced_filed,
        putong: state => state.Faers.putong,
        extendCount: state => state.Faers.extendCount,
        update_conf: state => state.Faers.update_conf,
      }),
      // 判断高级搜索旁边的new标签是否显示
      is_show_new () {
        Store.state[this.vuex_name].advanced_filed.map(item=> {
          if (item.is_show_new === 1) {
            this.isShowNew = true
          }
        })
        return this.isShowNew
      },
    },
    filters: {
      // 给数字每三位数加一个逗号
      formatNumber (val) {
        val = parseInt(val)
        return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
    watch: {

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
        Store.commit("Faers/conditions",[])
        //清空高级搜索条件和筛选项
        Store.commit('Faers/groups',{})
        Store.dispatch('Faers/nomalSearch')
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
      localStorage.setItem( //newProjectGuide 组件需要的东西
        "newProjectGuideArr",
        JSON.stringify([])
      )
      localStorage.setItem("domPosition","")
    },
    mounted () {
      Store.dispatch("Faers/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom("Faers")
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/var.less";
  .el-dialog {
    border-radius: 20px!important;
  }
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

        .market_nav{
          // box-shadow: @BoxShadow;
          .nav_one{
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
        .la-body-tab{
          box-shadow:0 -4px 5px -3px #c4d3f8;
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

  .new-img {
    position: absolute;
    top: 0;
    cursor: pointer;
    right: -20px;
  }
</style>
