<template>
  <Main class="zhuce">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Fdadrugnew"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        vuex_name="Fdadrugnew"
        api_name="fdadrugnew"
        route1="list"
        route2="analy"
        route3="qb"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left" style="position: relative;">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Fdadrugnew"
          api_name="fdadrugnew"
          :item="item"
          route1="list"
          route2="analy"
          route3="qb"
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
      <!-- 热点筛选条件 -->
      <HotFilter vuex_name="Fdadrugnew" route1="list" route2="analy" route3="qb"></HotFilter>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Fdadrugnew" route1="list" route2="analy" route3="qb" :tooltip="tooltip"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Fdadrugnew" api_name="fdadrugnew"></Saved>
      <!-- 历史搜索 -->

    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{allBase.dbname}}</span>
        <!-- <span class="database-num" v-if="baseCount&&$route.path.split('/')[2]==='list'">{{baseCount | formatNumber}}</span> -->
        <div class="sec1-right">
          <!-- <div :class="{'top-help-wrap':update_conf.log}">
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''"  >
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
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''"  >
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
      <section class="sec2 newsec2">
        <!-- <div class="la-body-tab">
          <div class="market_nav">
            <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/fdadrugnew/list'}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe62d;</i>上市数据</span>
            </a>
            <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/fdadrugnew/analy', 'abandon-click-method': nopms.ksh}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe643;</i>智能分析</span>
            </a>
          </div>
        </div> -->
        <div class="search-body-content">
          <Optioned
            @showSavedPop="showSavedPop"
            @clearTheLeft="clearTheLeft"
            @clearLeft="clearLeft"
            vuex_name="Fdadrugnew"
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
  import { mapState } from 'vuex'
  import Main from '@/components/layouts/main'
  import Saved from '@/components/common/saved'
  import SavedPop from '@/components/common/saved-pop'
  import Optioned from '@/components/common/options'
  import Normal from '@/components/common/normal'
  import Advanced from '@/components/common/advanced'
  import Filters from '@/components/common/filters-config'
  import HotFilter from '@/components/common/hot-filter'

  export default{
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
    data () {
      return {
        savedPopVisible: false,
        dialogFormVisible: false, //控制高级搜索弹框
        route: this.$route.path.split('/')[2],
        basic: {},
        api_name: 'fdadrugnew',
        tooltip: {
          fdadrugnew: '生物药CBER即“生物制品审评与研究中心“批准的产品，包括过敏原性、血液制品、细胞和基因治疗、疫苗等产品。',
          marketingstatusid: '暂定批准是指对符合全部批准条件的仿制药申请所采取的行动，但是在申请所参考的上市药物的市场独占权和/或专利期限到期之前，它不被允许在美国合法销售。',
          firstgeneric: 'FDA首次批准并允许制造商在美国销售此药。FDA认为第一个首仿药对公众健康很重要，并优先审查这些提交的文件。',
          f505b2: '当NDA申请人提交完整的安全性和有效性研究报告时，至少有部分内容来源于非申请者开展或申请者无权引用的研究，则必须通过505(b)(2)途径。',
          offexclusiity: '申请人在这些NDA新药过了保护期之后申请ANDA，但是向FDA提交ANDA之前，需要参考上述三个选项。partI：若提交为ANDA，FDA可立即受理；partII：若提交为ANDA，会涉及到部分法案，需要在此之前与FDA沟通；appendix：从partI、partII删除，已获得FDA的批准。',
          acceleration: '加速批准主要适用于病程较长和需要较长的时间才能衡量药物预期的临床效益的环境。',
          breakthroughtherapy: '如果一种药物被指定为突破性治疗，FDA将加快这种药物的开发和审查。所有突破性治疗指定的申请将在收到后60天内进行审核，FDA有权利批准或拒绝该申请。',
          priority: '优先审评是在提交BLA，NDA或功效补充剂时确定的。如果符合相关标准，则任何药物，包括已获得快速通道名称，突破性疗法名称或正在评估加速批准的药物，都可以进行优先审评。',
          fasttrack: '快速审批通道是指用于治疗严重或危及生命的疾病的药物，非临床或临床数据表明有潜力解决严重疾病的未满足医疗需求。',
          submissionclasscode: '对于原始(ORIG)的NDA提交，此处提供了新药申请的分类；对于补充(SUPPL)提交，此处描述了FDA批准申请的变更类型。',
          tecode: '使用户快速了解FDA是否已将特定批准的药品评估为与其他药学等效性产品具有等效治疗性（第一个字母），并在FDA的评估基础上提供其他信息（第二个字母）。首字母A代表没有生物等效问题，或已解决，B有生物等效问题且尚未解决。第二个字母按照剂型等划分其他信息。',
          referencedrug: '简称RLD，是指在FDA批准上市，用于仿制药注册申请的参照药品。通常是具有完整规范的安全性和有效性研究数据的药品。',
          appltype: '生物药CBER即“生物制品审评与研究中心“批准的产品，包括过敏原性、血液制品、细胞和基因治疗、疫苗等产品。'
        }
      };
    },
    computed:{
      ...mapState({
        allBase: state => state.Fdadrugnew.allBase,
        helpInfo: state => state.Fdadrugnew.helpInfo,
        nomal_filed: state => state.Fdadrugnew.nomal_filed,
        advanced_filed: state => state.Fdadrugnew.advanced_filed,
        baseCount: state => state.Fdadrugnew.extendCount.BaseCount,
        putong: state => state.Fdadrugnew.putong,
        nopms: state => state.Fdadrugnew.nopms,
        norules: state => state.Fdadrugnew.norules,
        update_conf: state => state.Fdadrugnew.update_conf,
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
      },

    },
    methods: {
      // 关闭保存条件框
      closeSavedPop () {
        this.savedPopVisible = false
      },
      showSavedPop () {
        this.savedPopVisible = true
      },
      //获取普通搜索
      nomalSearch () {
        Store.commit("Fdadrugnew/conditions",[])
        //清空高级搜索条件和筛选项
        Store.commit('Fdadrugnew/groups',{})
        if (this.route=='list') {
          Store.dispatch('Fdadrugnew/nomalSearch')
        }else if(this.route=='analy'){
          Store.dispatch('Fdadrugnew/getKshRes')
        }
      },
      // 点击左侧栏中的“高级搜索”触发的事件
      handleAdvancedClick () {
        if (!this.nopms.gjss) {
          this.dialogFormVisible = true

          if (this.$refs.advanced) { // 第一次点击之后才渲染，所以加此判定
            this.$refs.advanced.initConditions()
          }
        }
        window.ga("send", "event", "botton", "click", "advanced_search", "search")
        window._paq.push(['trackEvent', 'botton', 'click', "advanced_search", "search"])

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
      navRouteTo (index) {
        if (index == 1) {
          this.$router.push({ path: '/fdadrugnew/list'})
        } else if (index == 2 && !this.nopms.ksh) {
          this.$router.push({ path: '/fdadrugnew/analy'})
          window.ga("send","event", "tab", "click", "fdadrugnew_analy")
          window._paq.push(['trackEvent', 'tab', 'click', "fdadrugnew_analy",])

        }
      },
    },
    created() {
      // Store.commit("Fdadrugnew/reset")
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    mounted () {
      Store.dispatch("Fdadrugnew/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom("Fdadrugnew")
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/app.less";
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

      .market_nav{
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
</style>
