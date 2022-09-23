<template>
  <Main class="spa-db">
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Database"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Database"
        :api_name="database_name"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 结构式检索弹出框 -->
    <el-dialog :visible.sync="formulaFormVisible" :modal-append-to-body="false" width="1000px">
      <div slot="title" class="dialog-header">
        结构式检索
      </div>
      <Ketcher @getKetcherData="getKetcherData" />
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Database"
          :api_name="database_name"
          :item="item"
          :key="index"
          ref="ileft"></Normal>
      </template>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon" style="position: relative;" v-if="hasHighSearch&&advanced_filed.length" >
          <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()" :class="{'abandon-click-method': nopms.gjss}">高级搜索</a>
          <el-tooltip class="item" effect="light" placement="right" v-if="help_conf.high_holder">
            <div slot="content" v-html="help_conf.high_holder ? help_conf.high_holder : ''"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
          <img src="/static/imgs/newProjectGuide/new.png" v-if="is_show_new" @click.prevent="handleAdvancedClick()" alt="高级搜索" class="new-img"/>
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" :class="{'has-advanced': hasHighSearch&&advanced_filed.length}" type="primary" size="mini" round @click="nomalSearch()">搜索</el-button>
      </div>
      <div class="hxs-btn-wrap" v-if="$route.path.indexOf('structural')>0">
        <a class="hxs-btn" @click.prevent="handleFormulaClick()"><span class="icon iconfont">&#xe682;</span>结构式检索</a>
        <el-tooltip class="item" effect="light" placement="right">
          <div slot="content">在结构式编辑器中绘制结构式，选择精确、子结构、相似检索中的一种，即可匹配出相应的化合物。</div>
          <i class="el-icon-question cl-green"></i>
        </el-tooltip>
      </div>

      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Database"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Database" :api_name="database_name"></Saved>
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix" :class="{'sec1-onTrial':onTrialHtml}">
        <div class="onTrial-wrap">
          <span class="database-name">{{base_conf.dbname}}</span>
          <!-- <span class="database-num" v-if="extendCount">{{extendCount | formatNumber}}</span> -->
          <div class="sec1-right">
            <!-- <div :class="{'top-help-wrap':update_conf.log}">
              <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="help_conf.remark ? help_conf.remark : ''" >
                <div slot="content">
                  <el-scrollbar>
                    <div class="tip-content" v-html="help_conf.remark ? help_conf.remark : ''"></div>
                  </el-scrollbar>
                  <a class="btn default" :href="help_conf.url" target="_blank">帮助中心</a>
                </div>
                <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
              </el-tooltip>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
                <el-breadcrumb-item>{{base_conf.catname}}</el-breadcrumb-item>
                <el-breadcrumb-item><a class="link-blue" :href="'/' + base_conf.dbename">{{base_conf.dbname}}</a></el-breadcrumb-item>
              </el-breadcrumb>
            </div> -->

            <div class="top-update-wrap">
              <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="help_conf.remark ? help_conf.remark : ''" >
                <div slot="content">
                  <el-scrollbar>
                    <div class="tip-content" v-html="help_conf.remark ? help_conf.remark : ''"></div>
                  </el-scrollbar>
                  <a class="btn default" v-if="help_conf.url" :href="help_conf.url" target="_blank">帮助中心</a>
                </div>
                <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
              </el-tooltip>
              {{update_conf.log}}

              <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item>{{allBase.dbname}}</el-breadcrumb-item>
            </el-breadcrumb>
            </div>
          </div>
        </div>
        <div v-if="onTrialHtml" class="database-name-accessory">{{ onTrialHtml }}</div>
      </section>
      <section class="sec2">
        <div class="la-body-tab" v-if="base_conf_nav_show && base_conf_nav.length">
          <div class="tab-nav">
            <div class="market_nav">
              <router-link tag="a" :to="{path:'/' + item.url}" class="nav_one" active-class="router-link-active" v-for="(item, index) in base_conf_nav" :key="index">
                <span class="nav">
                  {{item.label}}
                </span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="search-body-content">
          <Optioned
            minHeight
            @showSavedPop="showSavedPop"
            @clearTheLeft="clearTheLeft"
            @clearLeft="clearLeft"
            vuex_name="Database">
            <!-- 如果没有筛选条件，临时占位，方便显示和导出UI显示 -->
            <!-- <div v-if="!(storeState.shaixuan && storeState.shaixuan.filter_condition)" style="height: 35px;"></div> -->
          </Optioned>
          <i class="iconfont sh">&#xe60c;</i>
          <!-- &#xe67f; -->
          <List></List>
        </div>
      </section>
    </div>
  </Main>
</template>

<script>
  import Normal from '@/components/common/normal'
  import Advanced from '@/components/common/advanced'
  import Saved from '@/components/common/saved'
  import SavedPop from '@/components/common/saved-pop'
  import Optioned from '@/components/common/options'
  import Filters from './include/filters'
  // import Filters from '@/components/common/filters'
  import Main from '@/components/layouts/main'
  import { mapState } from 'vuex'
  import List from './list'
  import Ketcher from '@/components/common/ketcher'
  import setTableHMixins from '@/mixins/setTableH.js'

  export default {
    components: {
      Normal,
      Advanced,
      Optioned,
      Saved,
      SavedPop,
      Filters,
      Main,
      List,
      Ketcher,
    },
    mixins: [
      setTableHMixins
    ],
    data () {
      return {
        savedPopVisible: false,
        dialogFormVisible: false, //控制高级搜索弹框
        formulaFormVisible: false,
        onTrialHtml: "",
        vuex_name: 'Database',
        isShowNew: false
      };
    },
    computed:{
      ...mapState({
        database_name: state => state.Database.database_name,
        allBase: state => state.Database.allBase,
        base_conf_nav_show: state => state.Database.base_conf_nav_show,
        base_conf_nav: state => state.Database.base_conf_nav,
        base_conf: state => state.Database.base_conf,
        update_conf: state => state.Database.update_conf,
        help_conf: state => state.Database.help_conf,
        nomal_filed: state => state.Database.nomal_filed,
        advanced_filed: state => state.Database.advanced_filed,
        query: state => state.Database.query,
        hasHighSearch: state => state.Database.hasHighSearch,
        putong: state => state.Database.putong,
        extendCount: state => state.Database.extendCount,
        nopms: state => state.Database.nopms,
        filters: state => state.Database.filters,
        filters1: state => state.Database.filters1,
        storeState: state => state.Database,
        param: state => state.Database.param,
        structuralsType: state => state.Database.structuralsType,
      }),
      api_name:{
        get(){
          return  this.database_name
        }
      },
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
      base_conf_nav: {
        handler() {
          this.$nextTick(() => {
            this.registerEven()
          })
        },
        immediate: true
      }
    },
    methods: {
      getKetcherData(obj){
        Store.commit("Database/query", [])
        Store.commit("Database/queryStr")
        Store.commit("Database/putong", {})
        Store.commit("Database/setStructuralsParams", obj)
        Store.commit("Database/setStructuralsType", obj.type)
        this.formulaFormVisible = false
        if (obj.type=='3') {
          this.nomalSearch({path:'/api/structurals',params:{type:obj.type,smilescode:obj.smilescode,simi:obj.simi},type:'post',hxs:true})
        } else {
          this.nomalSearch({path:'/api/structurals',params:{type:obj.type,smilescode:obj.smilescode,simi:obj.simi,page:1,pageSize:this.param.pageSize},type:'post',hxs:true})
        };
      },
      // 关闭保存条件框
      closeSavedPop () {
        this.savedPopVisible = false
      },
      showSavedPop () {
        this.savedPopVisible = true
      },
      //获取普通搜索
      nomalSearch (params) {
        Store.commit("Database/conditions",[])
        //清空高级搜索条件和筛选项
        Store.commit('Database/groups',{})
        //区别化学结构式搜索，普通搜索还原
        if (!params) {
          Store.commit("Database/setStructuralsType", 0)
        };
        this.onTrialHtml=""
        Store.dispatch('Database/nomalSearch',params).then((res)=>{
          let count = res.data.data.count
          if(this.structuralsType=='3' && count===50) {
            this.onTrialHtml = '（子结构检索最多返回50条数据）'
          }
        })
        Store.commit(this.vuex_name + "/queryStr", Store.state[this.vuex_name].query)
      },
      handleFormulaClick(){
        this.formulaFormVisible = true
        ga("send", "event", "button", "click","structuralsearch")
        window._paq.push(['trackEvent', 'button', 'click', "structuralsearch",])
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
      // 确定nav每个的百分比宽度
      setNavOneWidth () {
        let len = this.base_conf_nav.length
        if (len) {
          let width = String((100 / Number(len)).toFixed(1)) + "%"
          $(".market_nav .nav_one").css({
            width: width
          })
        }
      },
    },
    beforeCreate() {
      if (!Store.state.Database.resetObj) {
        Store.commit("Database/reset")
      } else {
        Store.dispatch("Database/reset")
      }
    },
    created() {
      // 使VUEX获取路径名
      Store.dispatch("Database/getApiAddress", this.$route.path)
      Store.commit("Database/refreshFilter",true)
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.base_conf.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.base_conf.dbname])
      }, 1000);
      localStorage.setItem( //newProjectGuide 组件需要的东西
        "newProjectGuideArr",
        JSON.stringify([])
      )
      localStorage.setItem("domPosition","")
    },
    async mounted () {
      await Store.dispatch("Database/getConf")
      this.vueRouteFrom("Database")
    },
    updated() {
      this.setNavOneWidth()
    },
  }
</script>

<style lang="less" scoped>
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
  //   .advanced-search{
  //     padding: 16px 15px;
  //     font-size: 14px;
  //     display: flex;
  //     justify-content: space-between;
  //     .adva-icon em, .adva-icon a {
  //       color: #4877e8;
  //       font-size: 14px;
  //     }

  //     .new-img {
  //       position: absolute;
  //       top: 0;
  //       cursor: pointer;
  //     }

  //     .advanced-search-btn {
  //       display: inline-block;
  //       padding: 5px 0px;
  //       width: 220px!important;
  //       box-sizing: border-box;
  //       &.has-advanced {
  //         width: 100px!important;
  //       }
  //     }
  //     .fr{
  //       display: inline-block;
  //       height: 24px;
  //       line-height: 24px;
  //       i{
  //         display: inline-block;
  //         padding: 0px;
  //         margin: 0px;
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
      .sec1-right{
        float: right;
        .help-tip{
          padding-right: 10px;
        }
      }
    }
     .sec2{

      .tab-nav{
        height: 36px;
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
          height: 36px;
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
            height: 36px;
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

  .market_nav{
    .nav_one{
      // width: 50%;
      text-decoration: none;
      .nav{
        img {
          transition: all 300ms;
          display: inline-block;
          border-radius: 50%;
          background-color: #35384a;
          width: 26px;
          height: 26px;
          margin-right: 8px;
        }
      }
      &:hover{
        .nav {
          img {
            transition: all 300ms;
            background-color: Lighten(@PrimaryColor, 10%);
          }
        }
      }
    }
  }
  .router-link-active{
    .nav{
      color: @PrimaryColor;
      background-color: #fff;
      img {
        background-color: @PrimaryColor!important;
      }
    }
  }
.hxs-btn-wrap{
  margin: 0 15px;
  .hxs-btn{
    color: @PrimaryColor;
    font-size: 14px;
    cursor: pointer;
    .icon {
      margin-right: 4px;
    }
  }
}
</style>
