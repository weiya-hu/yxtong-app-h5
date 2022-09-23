<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class=" top-id" :title="jbxx.Title.drugname">{{jbxx.Title.drugname}}</span>
            <span class="top-num">{{jbxx.Title.applno}}</span>
            <span class="id-green" v-if="jbxx.List.submissionpropertytypecode !== '否'">{{jbxx.Title.submissionpropertytypecode}}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="breadcrumb-f">
            <el-tooltip class="help-tip" effect="light" placement="bottom" v-if="helpInfo.remark ? helpInfo.remark : ''">
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green"></i> 帮助</span>
            </el-tooltip>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item> <a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
              <el-breadcrumb-item><span class="FontColor">{{jbxx.Title.drugname}}</span></el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="left-nav">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active"  v-if="hasPartOne">基本信息</a>
            <a class="nav-item" v-if="hasPartTwo">与该申请号相关的药品信息</a>
            <a class="nav-item" v-if="hasPartThree">原始申请或者临时审批</a>
            <a class="nav-item" v-if="hasPartFour">审批历史</a>
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">

          <slide-section :title="'基本信息'" class="the-part" v-if="hasPartOne">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>申请类型</td>
                  <td>{{jbxx.List.appltype}}</td>
                </tr>
                <tr>
                  <td>活性成分</td>
                  <td>{{jbxx.List.activeingredient}}</td>
                </tr>
                <tr>
                  <td>申请机构</td>
                  <td>{{jbxx.List.sponsorname}}</td>
                </tr>
                <tr>
                  <td>孤儿药</td>
                  <td>{{jbxx.List.submissionpropertytypecode}}</td>
                </tr>
                <tr v-if="jbxx.List.targets">
                  <td>靶点</td>
                  <td>{{jbxx.List.targets}}</td>
                </tr>
              </table>
            </div>

          </slide-section>

          <slide-section :title="'与该申请号相关的药品信息'" class="the-part" v-if="hasPartTwo">
            <div class="tb-wrap">
              <el-table
                :data="ypxxListData.List"
                stripe
                fixed
                class="table"
                style="width: 100%">
                <el-table-column
                  v-for="item in ypxxListData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label">
                    <template slot-scope="scope">
                      <div v-if="item.prop === 'drugname'">
                        {{ scope.row.drugname }}
                      </div>
                      <div v-if="item.prop === 'activeingredient'">
                        {{ scope.row.activeingredient }}
                      </div>
                      <div v-if="item.prop === 'strength'">
                        {{ scope.row.strength }}
                      </div>
                      <div v-if="item.prop === 'form'">
                        {{ scope.row.form }}
                      </div>
                      <div v-if="item.prop === 'marketingstatusid'">
                        {{ scope.row.marketingstatusid }}
                      </div>
                      <div v-if="item.prop === 'referencedrug'">
                        {{ scope.row.referencedrug }}
                      </div>
                      <div v-if="item.prop === 'referencestandard'">
                        {{ scope.row.referencestandard }}
                      </div>
                      <div v-if="item.prop === 'tecode'">
                        {{ scope.row.tecode }}
                      </div>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section :title="'原始申请或者临时审批'" class="the-part" v-if="hasPartThree">
            <div class="tb-wrap">
              <el-table
                :data="lsspListData.list"
                stripe
                fixed
                class="table"
                style="width: 100%">
                <el-table-column
                  v-for="item in lsspListData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label"
                  >
                    <template slot-scope="scope">
                      <div v-if="item.prop === 'submissionstatusdate'">
                        {{ scope.row.submissionstatusdate }}
                      </div>
                      <div v-if="item.prop === 'submissiontype'">
                        {{ scope.row.submissiontype }}
                      </div>
                      <div v-if="item.prop === 'submissionstatus'">
                        {{ scope.row.submissionstatus }}
                      </div>
                      <div v-if="item.prop === 'submissionclasscode'">
                        {{ scope.row.submissionclasscode }}
                      </div>
                      <div v-if="item.prop === 'reviewpriority'">
                        {{ scope.row.reviewpriority }}
                      </div>
                      <div v-if="item.prop === 'applicationdocsurl'">
                        <!-- <p>
                          <a v-if="pass=='label'" :href="scope.row.applicationdocsurl" style="color:#4877e8;" target="_blank">
                            Label
                          </a>
                        </p>
                        <p>
                          <a v-if="pass=='appletter'" :href="scope.row.applicationdocsurl" style="color:#4877e8;" target="_blank">
                            Letter
                          </a>
                        </p>
                        <p>
                          <a v-if="pass=='nda'" :href="scope.row.applicationdocsurl" style="color:#4877e8;" target="_blank">
                            Review
                          </a>
                        </p>  -->
                        <span v-html="scope.row.url"></span>
                      </div>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section :title="'审批历史'" class="the-part" v-if="hasPartFour">
            <div class="tb-wrap">
              <el-table
                :data="splsListData.list"
                stripe
                fixed
                class="table"
                style="width: 100%"
                >
                <el-table-column
                  v-for="item in splsListData.tableHead"
                  :prop="item.prop"
                  :min-width="item.width"
                  :key="item.prop"
                  :label="item.label">
                    <template slot-scope="scope" v-if="scope.row.submissiontype!==''">
                      <div v-if="item.prop === 'submissionstatusdate'">
                        {{ scope.row.submissionstatusdate }}
                      </div>
                      <div v-if="item.prop === 'submissiontype'">
                        {{ scope.row.submissiontype }}
                      </div>
                      <div v-if="item.prop === 'submissionno'">
                        {{ scope.row.submissionno }}
                      </div>
                      <div v-if="item.prop === 'submissionclasscode'">
                        {{ scope.row.submissionclasscode }}
                      </div>
                      <div v-if="item.prop === 'applicationdocsurl'">
                        <p v-for="(item, index) in scope.row.applicationdocsurl" :key="index">
                          <a :href="item" style="color:#4877e8;" target="_blank">
                            <div v-html="handleAAA(item)"></div>
                          </a>
                        </p>
                      </div>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </slide-section>

          <slide-section :title="'扩展信息'" class="the-part" v-if="hasExtend">
            <div class="extend-list">
              <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
            </div>
          </slide-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import SlideSection from '@/components/common/slide-section'
  import ExtendButton from '@/components/common/extend-button'
  import LaFooter from '@/components/layouts/footer'
  import tablehead from '@/config/tablehead'
  import { mapState } from 'vuex'
  import detailScrollMixins from '@/mixins/detailScroll.js'
  const ypxxHead = tablehead.cfdadrug.Detailfdadrugxq
  const lsspHead = tablehead.cfdadrug.Detailyssq
  const splsHead = tablehead.cfdadrug.Detailspls

  export default{
    components: {
      SlideSection,
      LaFooter,
      ExtendButton,
      LoadingGif
    },
    mixins: [
      detailScrollMixins
    ],
    data(){
      return{
        isLoading: true,
        isLoadingNum: 4,
        id: '',
        // steps,
        data: {},
        scroll: '',
        heightArr:[],
        hasPartOne:true,
        hasPartTwo:false,
        hasPartThree:false,
        hasPartFour:false,
        hasExtend:false,
        yfxx:{},
        jbxx:{
          List: {},
          Title: {}
        },
        ypxxListData:{
          List:[],
          tableHead: ypxxHead,
        },
        lsspListData:{
          list:[],
          tableHead: lsspHead,
        },
        splsListData:{
          list:[],
          tableHead: splsHead,
        },
        sull:'',
        pass:'',//原始申请url获取的参数
        passtwo:'',//审批历史url获取的参数
        passthree:'',
        extendList: [],
      }
    },
    computed: {
      ...mapState({
        nopms: state => state.FdaDrug.nopms,
        allBase: state => state.FdaDrug.allBase,
        helpInfo: state => state.FdaDrug.helpInfo,
      }),
    },
    methods:{
      //控制审批历史里面标签显示的文字
      handleAAA (item) {
        if (item.indexOf('/appletter/') !== -1) {
          return 'Letter'
        } else if (item.indexOf('/label/') !== -1) {
          return 'Label'
        } else if (item.indexOf('/nda/') !== -1) {
          return 'Review'
        }
      },
      //获取详情头部和基本信息的数据
      handleAxiosJbxxList () {
        window.Axios({
          method: 'get',
          url: '/api/fdadrug/' + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.jbxx = data
            this.getExtendList('fdadrug',data.extendList)
          }
        }).then(this.removeLoading)
      },
      // 获取原始申请或者临时审批的数据
      LoadListData () {
        window.Axios({
          method: 'get',
          url: '/api/fdadrug/getLssp?id='+this.$route.params.id,
        }).then(res=>{
          if(res.data.code === 200 && res.data.data){
            let data = res.data.data
            this.lsspListData.list= data.list
            //获取到url地址并且对地址切割，为了找到letter,nda,letter
            let urlya = this.lsspListData.list[0].applicationdocsurl ? this.lsspListData.list[0].applicationdocsurl.split('/') : ''
            //把获取到的参数放到pass里并在列表里进行判断。
            this.pass = urlya ? urlya[4] : ''
          }
        }).then(this.removeLoading)

      },
      // 获取审批历史的数据
      LoadSplsData(){
        window.Axios({
          method: 'get',
          url: '/api/fdadrug/getSpls?id='+this.$route.params.id,
        }).then(res=>{
          if(res.data.code === 200 && res.data.data!==null){
            let data = res.data.data
            this.splsListData.list= data.list
            this.hasPartFour = true
          }else{
            this.hasPartFour = false
          }
        }).then(this.removeLoading)
      },
      //获取与该申请号相关药品信息的数据
      handleAxios () {
        Axios.get('/api/fdadrug/getYpxx?id='+this.$route.params.id).then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data
            this.ypxxListData.List = data.List
            //右侧国家进口的基础信息获取
            this.hasPartOne = true
            //右侧国家进口的医保信息获取
            this.hasPartTwo = true
            this.hasPartThree = true

          }
        }).catch((err) => {
          console.log(err)
        }).then(this.removeLoading)
      },
      // 加载完后移除加载界面
      removeLoading () {
        this.isLoadingNum = this.isLoadingNum - 1
        if(!this.isLoadingNum){
          this.isLoading = false
        }
      },
    },
    created () {
      if (!this.nopms.xqy) {
        this.handleAxios()
      }
      this.LoadListData()
      this.handleAxiosJbxxList()
      this.LoadSplsData()
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    mounted () {
      Store.dispatch("FdaDrug/getBaseInfo")
    },
    activated() {
      this.vueRouteToNoPms(this.nopms.xqy)
    },
    updated() {
      this.vueRouteToNoPms(this.nopms.xqy)
      this.vueTogglePmsTooltip()
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/var.less";
  @import "~@/assets/less/detailCom.less";

</style>
