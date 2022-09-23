<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data_title">{{ data_title }}</span>
          </div>
        </div>
      </div>

      <div class="main">
        <slide-section :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr>
                <td>药品名称</td>
                <td>{{ data_jbxx.name }}</td>
              </tr>
              <tr v-if="data_jbxx.jixing">
                <td>剂型</td>
                <td>{{ data_jbxx.jixing }}</td>
              </tr>
              <tr>
                <td>批准适应症</td>
                <td>{{ data_jbxx.indication }}</td>
              </tr>
              <tr>
                <td>超说明书来源</td>
                <td>{{ data_jbxx.laiyuan }}</td>
              </tr>
            </table>
          </div>
        </slide-section>
        <slide-section :title="'超说明书用药情况'" v-if="data_sms.length">
          <div class="tb-wrap">
            <div
              class="shuomingshu-qk"
              v-for="(one, index1) in data_sms"
              :key="index1"
            >
              <div class="shuomingshu-qk-title">
                <span>{{ index1 + 1 }}.</span
                ><span style="font-weight: bold">{{ one.shiyingzheng }}</span>
              </div>
              <table class="tb-t">
                <tr v-if="one.name">
                  <td>适应症</td>
                  <td v-html="one.name"></td>
                </tr>
                <tr v-if="one.yongfaliang">
                  <td>用法用量</td>
                  <td v-html="one.yongfaliang"></td>
                </tr>
                <tr v-if="one.liaoxiao">
                  <td>疗效</td>
                  <td v-html="one.liaoxiao"></td>
                </tr>
                <tr v-if="one.jizhi">
                  <td>机制</td>
                  <td v-html="one.jizhi"></td>
                </tr>
                <tr v-if="one.tishi">
                  <td>特别提醒</td>
                  <td v-html="one.tishi"></td>
                </tr>
                <tr v-if="one.yijudengji">
                  <td>依据等级</td>
                  <td v-html="one.yijudengji"></td>
                </tr>
                <tr v-if="one.ckwx">
                  <td>参考文献</td>
                  <td v-html="one.ckwx"></td>
                </tr>
              </table>
            </div>
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
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import ExtendButton from "@/components/common/extend-button";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    ExtendButton,
    SlideSection,
    LaFooter
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      extendList: [],
      isLoading: true,
      id: this.$route.params.id,
      data: {},
      data_title: "",
      data_jbxx: {},
      data_sms: [],
      data_ckwx: ""
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.ShuomingshuCsm.nopms,
      allBase: state => state.ShuomingshuCsm.allBase,
      helpInfo: state => state.ShuomingshuCsm.helpInfo
    })
  },
  methods: {
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/unlabeleduse/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;

            // 一一对应获取数据
            this.data_title = data.Title ? data.Title : "";
            this.data_jbxx = data.Jbxx ? data.Jbxx : {};
            this.data_sms = data.Sms && data.Sms.length ? data.Sms : [];
            this.data_ckwx = data.Ckwx ? data.Ckwx : "";
            this.getExtendList("unlabeleduse", data.extendList);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.removeLoading)
        .then(this.getPartsHeight);
    }
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
    Store.dispatch("ShuomingshuCsm/getBaseInfo");
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

/deep/.slide-section {
  .tb-t,
  .tb-f {
    tr {
      td {
        box-sizing: border-box;
        height: 32px;
        border: 1px solid @BorderColorNew;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        line-height: 32px;
        padding: 0 0 0 50px !important;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #545b6d;
        max-width: 30vw !important;
        &:nth-child(odd) {
          min-width: 180px !important;
          width: 230px !important;
          background: @DetailTableLeftColor;
        }
        &:nth-child(even) {
          max-width: 20vw !important;
          width: auto !important;
          min-width: auto !important;
          word-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          background: @DetailTableRightColor;
          line-height: 23px;
        }
        &:nth-child(2n) {
          padding: 0 0 0 60px !important;
        }
      }
    }
  }
}
</style>
