<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.name + ' ' + data.slh + '审评报告'" style="cursor:pointer;" v-if="route == 3">
              {{ data.name }} {{ data.slh }}审评报告
            </span>
            <span class="top-id" :title="data.title" style="cursor:pointer;" v-else>
              {{ data.title }}
            </span>
            <div class="left-bottom">
              <span class="bottom-name">{{data.source}}</span>
            </div>
            <!-- <span class="id-state" >{{data.apptype}}</span> -->
            <!-- <span class="id-green">{{route == 1 ? 'EMA' : route == 2 ? 'FDA' : 'CDE'}}</span> -->
          </div>
        </div>
      </div>
      <div class="main">
        <slide-section  :title="'基础信息'">
          <div class="tb-wrap">
            <table class="tb-f" v-if="route == 3">
              <tr>
                <td>文献类型</td>
                <td>{{data.type}}</td>
                <td>受理号</td>
                <td>{{data.slh}}</td>
              </tr>
              <tr>
                <td>药品类型</td>
                <td>{{data.type}}</td>
                <td>注册类型</td>
                <td>{{data.zhuceleixing}}</td>
              </tr>
              <tr>
                <td>申请方</td>
                <td>{{data.sponsor}}</td>
                <td>承办日期</td>
                <td>{{data.date}}</td>
              </tr>
            </table>
            <table class="tb-f" v-else>
              <tr>
                <td>文献类型</td>
                <td>{{data.type}}</td>
                <td>发布日期</td>
                <td>{{data.pubdate}}</td>
              </tr>
              <tr>
                <td>热门标签</td>
                <td>{{data.bq1}}</td>
                <td>类型标签</td>
                <td>{{data.bq2}}</td>
              </tr>
              <tr>
                <td>关键词/摘要</td>
                <td colspan="3">{{data.kwds}}</td>
              </tr>
            </table>
          </div>
        </slide-section>
        <slide-section  :title="'文献信息'" v-if="isPdf1||isPdf2">
          <div class="tb-wrap">
            <div class="pdf-wrapper-left" :class="{'pdf-wrapper-single':!isPdf2}" v-if="isPdf1">
                <iframe :src="`/static/pdf/web/viewer.html?file=${encodeURIComponent(data.down)}`" width="100%" height="100%"></iframe>
            </div>
            <div class="pdf-wrapper-right" :class="{'pdf-wrapper-single':!isPdf1}" v-if="isPdf2">
              <iframe :src="`/static/pdf/web/viewer.html?file=${encodeURIComponent(data.down1)}`" width="100%" height="100%"></iframe>
            </div>
            <div class="clearfix"></div>
          </div>
        </slide-section>
        <slide-section  :title="'扩展信息'" v-if="hasExtend">
          <div class="extend-list">
            <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
          </div>
        </slide-section>
      </div>
    </div>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import SlideSection from '@/components/common/slide-section'
  import ExtendButton from '@/components/common/extend-button'
  import { mapState } from 'vuex'
  import detailScrollMixins from '@/mixins/detailScroll.js'
  export default {
    components: {
      LoadingGif,
      SlideSection,
      ExtendButton
    },
    mixins: [
      detailScrollMixins
    ],
    data () {
      return {
        isLoading: true,
        data: { },
        isPdf1: false,
        isPdf2: false,
        extendList: [], // 扩展信息
        hasExtend: false,
        route: this.$route.query.tb,
      }
    },
    computed: {
      ...mapState({
        nopms: state => state.Dae.nopms,
        allBase: state => state.Dae.allBase,
        helpInfo: state => state.Dae.helpInfo,
      }),
    },
    methods: {
      handleAxios () {
        window.Axios({
          method: 'get',
          url: '/api/dae/' + this.$route.params.id,
          params: {
            tb: this.$route.query.tb,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        }).then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.data = res.data.data
            this.getExtendList('dae',res.data.data.extendList)
            this.isPdf1 = this.data.down ? true : false
            this.isPdf2 = this.data.down1 ? true : false
            // this.data.down ? this.checkPDF(this.data.down,"1") : this.isPdf1 = false
            // this.data.down1 ? this.checkPDF(this.data.down1,"2") : this.isPdf2 = false
          }
        }).catch((err) => {
          console.log(err)
        }).then(this.removeLoading)
      },
      checkPDF (url,i) {
        // console.log(url,this['isPdf'+i])
        window.Axios({
          method: 'get',
          url: url,
          params: {}
        }).then((res) => {
          if (res.status === 200) {
            this['isPdf'+i] = true
          }
        }).catch((err) => {
          console.log(err)
        }).then(this.removeLoading)
      },
      // 加载完后移除加载界面
      removeLoading () {
        this.isLoading = false
      },
    },
    created () {
      if (!this.nopms.xqy) {
        this.handleAxios()
      }
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    mounted() {
      Store.dispatch("Dae/getBaseInfo")
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

    .pdf-wrapper-left {
      float: left;
      width: 50%;
      height: 800px;
      padding: 0px;
      margin: 0px;
      iframe {
        border: none;
      }
    }
    .pdf-wrapper-right {
      float: right;
      width: 50%;
      height: 800px;
      padding: 0px;
      margin: 0px;
      iframe {
        border: none;
      }
    }
    .pdf-wrapper-single{
      float: unset;
      margin: auto;
    }

    .left-bottom {
      margin-left: 0 !important;
    }
    /deep/td {
      height: 34px !important;
    }
</style>
