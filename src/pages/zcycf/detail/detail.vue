<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class=" top-id" :title="data.name">{{ data.name }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="breadcrumb-f">
            <el-tooltip class="help-tip" effect="light" placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''">
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green"></i> 帮助</span>
            </el-tooltip>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item>{{ allBase.catname }}</el-breadcrumb-item>
              <el-breadcrumb-item><a href="/chufang" target="_blank">{{ allBase.dbname }}</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="data.name"><span class="FontColor">{{ data.name }}</span></el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>

      <div class="main">
        <slide-section :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <template v-for="(item, index) in field">
                <template>
                  <tr :key="index" v-if="data[item[0]]">
                    <td v-html="item[1]"></td>
                    <td colspan="8" v-html="data[item[0]]"></td>
                  </tr>
                </template>
              </template>

            </table>
          </div>
        </slide-section>
        <slide-section :title="'扩展信息'" v-if="extendList.length">
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
import ExtendButton from '@/components/common/extend-button'
import SlideSection from '@/components/common/slide-section'
import LaFooter from '@/components/layouts/footer'
import detailScrollMixins from '@/mixins/detailScroll.js'
import { mapState } from 'vuex'
import Axios from 'axios'

export default {
  components: {
    LoadingGif,
    ExtendButton,
    SlideSection,
    LaFooter,
  },
  mixins: [
    detailScrollMixins
  ],
  data() {
    return {
      isLoading: true,
      field: [
        ['name', '药品名称'],
        ['source', '处方来源'],
        ['page', '页码'],
        ['chufangs', '处方'],
        ['yongtu', '功能主治'],
        ['fangjisource', '方剂来源'],
        ['fangjie', '方解'],
        ['buliangfanying', '不良反应'],
        ['zhuyshixiang', '注意事项'],
        ['cankaowenxian', '参考文献'],
        ['chufang', '处方组成'],
      ],
      data: {},
      extendList: [],
    }
  },
  computed: {
    ...mapState({
      allBase: state => state.Zcycf.allBase,
      helpInfo: state => state.Zcycf.helpInfo,
    }),
  },
  methods: {
    fetchDetailData() {
      return window.Axios({
        method: 'get',
        url: '/api' + this.$route.path,
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        if (res.status === 200) {
          return res.data.data;
        }
        return false;
      }).catch(err => {
        console.error(err);
      })
    },
  },
  watch: {

  },
  created() {
    Store.dispatch("Zcycf/getBaseInfo");
    this.fetchDetailData().then((res) => {
      if (res) {
        this.data = res.List;
        this.getExtendList('chufang', res.extendList)
      }
      this.isLoading = false;
    })
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted() {

  },
  activated() {
  },
  updated() {
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";
  .left-top {
    width: unset !important;
  }
</style>