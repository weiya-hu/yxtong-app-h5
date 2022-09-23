<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.name">{{ data.name }}</span>
            <div class="left-bottom">
              <span class="bottom-name">{{ data.bah }}</span>
              <span class="company-name">{{ data.barmc }}</span>
            </div>
            <span class="id-green">{{ data.sf }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <slide-section :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr v-if="data.name">
                <td>器械名称</td>
                <td>{{ data.name }}</td>
              </tr>
              <tr v-if="data.bah">
                <td>备案号</td>
                <td>{{ data.bah }}</td>
              </tr>
              <!-- <tr v-if="data.cplb">
                <td>产品类别</td>
                <td>{{data.cplb}}</td>
              </tr>
              <tr v-if="data.ggxh">
                <td>型号规格</td>
                <td>{{data.ggxh}}</td>
              </tr> -->
              <tr v-if="data.barmc">
                <td>
                  备案人名称
                  <el-tooltip
                    class="tooltips-canbi"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.nameOfFiler"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.barmc }}</td>
              </tr>
              <!--<tr v-if="data.dm">
                <td>备案人组织机构代码</td>
                <td>{{data.dm}}</td>
              </tr>-->
              <tr v-if="data.zcdz">
                <td>
                  备案人注册地址
                  <el-tooltip
                    class="tooltips-canbi"
                    effect="light"
                    placement="right"
                  >
                    <div
                      slot="content"
                      v-html="helpDesc.registeredAddressOfFiler"
                    ></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.zcdz }}</td>
              </tr>
              <tr v-if="data.scdz">
                <td>生产地址</td>
                <td>{{ data.scdz }}</td>
              </tr>
              <tr v-if="data.dlr">
                <td>
                  代理人名称
                  <el-tooltip
                    class="tooltips-canbi"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.nameOfAgent"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.dlr }}</td>
              </tr>
              <tr v-if="data.phone">
                <td>
                  企业联系电话
                  <el-tooltip
                    class="tooltips-registrationCertificateName"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.phone"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.phone }}</td>
              </tr>
              <tr v-if="data.qiyeurl">
                <td>网址</td>
                <td>
                  <a :href="data.qiyeurl" class="link-blue" target="_blank">{{
                    data.qiyeurl
                  }}</a>
                </td>
              </tr>
              <tr v-if="data.dlrzcdz">
                <td>
                  代理人注册地址
                  <el-tooltip
                    class="tooltips-canbi"
                    effect="light"
                    placement="right"
                  >
                    <div
                      slot="content"
                      v-html="helpDesc.agentRegistrationAddress"
                    ></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.dlrzcdz }}</td>
              </tr>
              <tr v-if="data.ggxh">
                <td>型号规格</td>
                <td>{{ data.ggxh }}</td>
              </tr>
              <tr v-if="data.yxq">
                <td>产品有效期</td>
                <td>{{ data.yxq }}</td>
              </tr>
              <tr v-if="data.cf">
                <td>产品描述</td>
                <td>{{ data.cf }}</td>
              </tr>
              <tr v-if="data.yqyt">
                <td>预期用途</td>
                <td>{{ data.yqyt }}</td>
              </tr>
              <tr v-if="data.bz">
                <td>备注</td>
                <td>{{ data.bz }}</td>
              </tr>
              <tr v-if="data.bzdw">
                <td>
                  备案单位
                  <el-tooltip
                    class="tooltips-canbi"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.recordingUnit"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.bzdw }}</td>
              </tr>
              <tr v-if="data.barq">
                <td>备案日期</td>
                <td>{{ data.barq }}</td>
              </tr>
              <tr v-if="data.change">
                <td>变更情况</td>
                <td>{{ data.change }}</td>
              </tr>
              <!--<tr v-if="data.bazt">
                <td>备案状态</td>
                <td>{{data.bazt}}</td>
              </tr>-->
              <tr v-if="data.glfl">
                <td>
                  管理分类
                  <el-tooltip
                    class="tooltips-canbi"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.managerType"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.glfl }}</td>
              </tr>
              <!--<tr v-if="data.balx">
                <td>备案类型</td>
                <td>{{data.balx}}</td>
              </tr>-->
            </table>
          </div>
        </slide-section>
        <slide-section :title="'扩展信息'" v-if="hasExtend">
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
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";

export default {
  components: {
    LoadingGif,
    SlideSection,
    ExtendButton,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      isLoading: true,
      data: {},
      id: "",
      extendList: [],
      hasExtend: false,
      helpDesc: {
        nameOfFiler: "对该器械申请备案通过的公司名称",
        registeredAddressOfFiler: "同备案该器械的公司地址",
        nameOfAgent: "境外进口器械代理备案的境内企业名称",
        agentRegistrationAddress: "代理注册的境内公司地址",
        recordingUnit: "执行备案职能的国家机关",
        managerType: "医疗器械根据安全性分为Ⅰ类、Ⅱ类、Ⅲ类",
        phone: "企业联系电话为国产注册企业和进口国内代理企业联系电话",
      },
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Qxba.allBase,
      helpInfo: (state) => state.Qxba.helpInfo,
      nopms: (state) => state.Qxba.nopms,
    }),
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/qixiebeian/" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.data = res.data.data;
            this.getExtendList("qixiebeian", res.data.data.extendList);
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
    Store.dispatch("Qxba/getBaseInfo");
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
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .top-id {
    max-width: 50vw !important;
  }
}
</style>
