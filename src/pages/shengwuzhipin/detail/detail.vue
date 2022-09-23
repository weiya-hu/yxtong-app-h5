<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="title.pihao">{{ title.pihao }}</span>
            <div class="left-bottom">
              <span class="bottom-name">{{ title.name }}</span>
              <span class="company-name">{{ title.qiye }}</span>
            </div>
            <span class="id-green">{{ title.country }}</span>
            <span class="id-green">{{ title.categ }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <slide-section :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr v-for="(infos, index) in baseInfos" :key="index">
                <template v-if="infos[0].name == '规格'">
                  <td>{{ infos[0].name }}</td>
                  <td colspan="3">{{ infos[0].state }}</td>
                </template>
                <template v-else-if="infos[0].name == '销售季度'">
                  <td>{{ infos[1].name }}</td>
                  <td colspan="3">{{ infos[1].state }}</td>
                </template>
                <template v-else>
                  <td>{{ infos[0].name }}</td>
                  <td>{{ infos[0].state }}</td>
                  <td>{{ infos[1].name }}</td>
                  <td>{{ infos[1].state }}</td>
                </template>
              </tr>
            </table>
          </div>
        </slide-section>
        <slide-section :title="'扩展信息'" v-if="extendList.length">
          <div class="extend-list">
            <ExtendButton
              v-for="(item, index) in extendList"
              :key="index"
              :item="item"
            ></ExtendButton>
          </div>
        </slide-section>
      </div>
      <la-footer></la-footer>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";

import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      isLoading: true,
      title: {},
      id: "",
      baseInfos: [], //存放基本信息
      extendList: [],
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Shengwuzhipin.allBase,
      helpInfo: (state) => state.Shengwuzhipin.helpInfo,
      nopms: (state) => state.Shengwuzhipin.nopms,
    }),
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/pqf/" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            //放基本信息的data
            let data = res.data.data;
            this.title = data;
            // 获取基本信息
            let baseInfo = [
              { name: "批号", state: data.pihao },
              { name: "检品类型", state: data.categ },
              { name: "检品名称", state: data.name },
              { name: "检品编号", state: data.bianhao },
              { name: "生产单位", state: data.qiye },
              { name: "签发证号", state: data.qfzh },
              { name: "签发日期", state: data.date },
              { name: "有效期至", state: data.youxiaoqi },
              { name: "签发机构", state: data.organization },
              { name: "签发结论", state: data.conclusion },
              { name: "规格", state: data.guige },
              { name: "", state: "" },
              { name: "单位", state: data.packaging },
              { name: "销量", state: data.piliang },
              { name: "销售季度", state: data.quarter },
              { name: "销售额（元）", state: data.total },
            ];
            for (let i = 0; i < baseInfo.length; i++) {
              if (i % 2 === 0) {
                this.baseInfos.push([]);
              }
              this.baseInfos[parseInt(i / 2)].push(baseInfo[i]);
            }
            this.getExtendList("pqf", data.extendList);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading);
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxios();
    }
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    Store.dispatch("Shengwuzhipin/getBaseInfo");
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .top-id {
    max-width: 40vw !important;
  }
}
</style>
