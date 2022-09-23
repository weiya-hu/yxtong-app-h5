<template>
  <div class="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <!-- 根据tp值的不同，从而显示不同的表格，tp=1显示国产的表格，tp=2显示进口的表格 -->

      <div class="detail-header">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.name">{{ data.name }}</span>
            <div class="left-bottom">
              <span class="bottom-name" v-if="this.$route.query.tp == 1">{{
                data.zczbh
              }}</span>
              <span class="company-name">{{ data.zcrmc }}</span>
            </div>
            <span class="id-green bg-blue">{{ data.tp }}</span>
            <span class="id-green" v-if="this.$route.query.tp == 1">{{
              data.sf
            }}</span>
            <span class="id-green bg-orange">{{ data.gllb }}</span>
          </div>
        </div>
      </div>
      <div class="main">
        <slide-section :title="'基本信息'">
          <div class="tb-wrap">
            <table class="tb-t" v-if="this.$route.query.tp == 1">
              <tr v-if="data.name">
                <td>器械名称</td>
                <td>{{ data.name }}</td>
              </tr>
              <!--<tr v-if="data.cpbz">
                <td>产品标准编号</td>
                <td>{{data.cpbz}}</td>
              </tr>-->
              <tr v-if="data.jgzc">
                <td>结构及组成/主要组成成分</td>
                <td>{{ data.jgzc }}</td>
              </tr>
              <tr v-if="data.syfw">
                <td>适用范围/预期用途</td>
                <td>{{ data.syfw }}</td>
              </tr>
              <tr v-if="data.xhgg">
                <td>型号规格</td>
                <td>{{ data.xhgg }}</td>
              </tr>
              <!--<tr v-if="data.zycf">
                <td>主要组成成分（体外诊断试剂）</td>
                <td>{{data.zycf}}</td>
              </tr>
              <tr v-if="data.yqyt">
                <td>预期用途（体外诊断试剂）</td>
                <td>{{data.yqyt}}</td>
              </tr>-->
              <tr v-if="data.tj">
                <td>产品储存条件及有效期</td>
                <td>{{ data.tj }}</td>
              </tr>
              <tr v-if="data.zczbh">
                <td>
                  注册证编号
                  <el-tooltip
                    class="tooltips-registrationCertificateNumber"
                    effect="light"
                    placement="right"
                  >
                    <div
                      slot="content"
                      v-html="helpDesc.registrationCertificateNumber"
                    ></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.zczbh }}</td>
              </tr>
              <tr v-if="data.zcrmc">
                <td>
                  注册人名称
                  <el-tooltip
                    class="tooltips-registrationCertificateName"
                    effect="light"
                    placement="right"
                  >
                    <div
                      slot="content"
                      v-html="helpDesc.registrationCertificateName"
                    ></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.zcrmc }}</td>
              </tr>
              <tr v-if="data.qiyeleixing">
                <td>国内上市企业</td>
                <td>{{ data.qiyeleixing }}</td>
              </tr>
              <tr v-if="data.specificationcodescqy">
                <td>医保耗材代码数量</td>
                <td>
                  <router-link
                    v-if="data.specificationcodescqy"
                    tag="a"
                    :to="{
                      path: '/ybhcsjbm',
                      query: { zczbh: data.zczbh },
                    }"
                    target="_blank"
                    class="cl-blue"
                  >
                    {{ data.specificationcodescqy }}
                  </router-link>
                </td>
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
              <tr v-if="data.zcrzs">
                <td>
                  注册人住所
                  <el-tooltip
                    class="tooltips-registrationCertificateResidence"
                    effect="light"
                    placement="right"
                  >
                    <div
                      slot="content"
                      v-html="helpDesc.registrationCertificateResidence"
                    ></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.zcrzs }}</td>
              </tr>
              <tr v-if="data.scdz">
                <td>生产地址</td>
                <td>{{ data.scdz }}</td>
              </tr>
              <!--<tr v-if="data.dlrmc">
                <td>代理人名称</td>
                <td>{{data.dlrmc}}</td>
              </tr>
              <tr v-if="data.dlrzs">
                <td>代理人住所</td>
                <td>{{data.dlrzs}}</td>
              </tr>-->
              <tr v-if="data.qt">
                <td>其他内容</td>
                <td>{{ data.qt }}</td>
              </tr>
              <tr v-if="data.bz">
                <td>备注</td>
                <td>{{ data.bz }}</td>
              </tr>
              <tr v-if="data.pzrq">
                <td>批准日期</td>
                <td>{{ data.pzrq }}</td>
              </tr>
              <tr v-if="data.yxq">
                <td>有效期至</td>
                <td>{{ data.yxq }}</td>
              </tr>
              <tr v-if="data.bgqk">
                <td>变更情况</td>
                <td>{{ data.bgqk }}</td>
              </tr>
              <!--<tr v-if="data.bgrq">
                <td>变更日期</td>
                <td>{{data.bgrq}}</td>
              </tr>
              <tr v-if="data.yb">
                <td>邮编</td>
                <td>{{data.yb}}</td>
              </tr>-->
              <!-- <tr v-if="data.fj">
                <td>附件</td>
                <td class="iconfont"><a :href="data.fj">&#xe62c;</a></td>
              </tr> -->
              <tr v-if="data.bmdh">
                <td>
                  编码代号
                  <el-tooltip
                    class="tooltips-codingCode"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.codingCode"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.bmdh }}</td>
              </tr>
              <tr v-if="data.bmdh2018">
                <td>编码代号（2018版）</td>
                <td>{{ data.bmdh2018 }}</td>
              </tr>
              <tr v-if="data.gllb">
                <td>
                  管理分类
                  <el-tooltip
                    class="tooltips-managerType"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.managerType"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.gllb }}</td>
              </tr>
            </table>

            <table class="tb-t" v-else>
              <tr v-if="data.name">
                <td>器械名称</td>
                <td>{{ data.name }}</td>
              </tr>
              <!--<tr v-if="data.name2">
                <td>器械名称</td>
                <td>{{data.name2}}</td>
              </tr>
              <tr v-if="data.cpbz">
                <td>产品标准编号</td>
                <td>{{data.cpbz}}</td>
              </tr>-->
              <tr v-if="data.jgzc">
                <td>结构及组成/主要组成成分</td>
                <td>{{ data.jgzc }}</td>
              </tr>
              <tr v-if="data.syfw">
                <td>适用范围/预期用途</td>
                <td>{{ data.syfw }}</td>
              </tr>
              <tr v-if="data.xhgg">
                <td>型号规格</td>
                <td>{{ data.xhgg }}</td>
              </tr>
              <!--<tr v-if="data.zycf">
                <td>主要组成成分（体外诊断试剂）</td>
                <td>{{data.zycf}}</td>
              </tr>
              <tr v-if="data.yqyt">
                <td>预期用途（体外诊断试剂）</td>
                <td>{{data.yqyt}}</td>
              </tr>-->
              <tr v-if="data.tj">
                <td>产品储存条件及有效期</td>
                <td>{{ data.tj }}</td>
              </tr>
              <tr v-if="data.zczbh">
                <td>注册证编号</td>
                <td>{{ data.zczbh }}</td>
              </tr>
              <tr v-if="data.zcrmc">
                <td>注册人名称</td>
                <td>{{ data.zcrmc }}</td>
              </tr>
              <tr v-if="data.specificationcodescqy">
                <td>医保耗材代码数量</td>
                <td>
                  <router-link
                    v-if="data.specificationcodescqy"
                    tag="a"
                    :to="{
                      path: '/ybhcsjbm',
                      query: { zczbh: data.zczbh },
                    }"
                    target="_blank"
                    class="cl-blue"
                  >
                    {{ data.specificationcodescqy }}
                  </router-link>
                </td>
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
              <tr v-if="data.zcrzs">
                <td>注册人住所</td>
                <td>{{ data.zcrzs }}</td>
              </tr>
              <!--
              <tr v-if="data.scdz">
                <td>生产地址</td>
                <td>{{data.scdz}}</td>
              </tr> -->
              <tr v-if="data.dlrmc">
                <td>代理人名称</td>
                <td>{{ data.dlrmc }}</td>
              </tr>
              <tr v-if="data.dlrzs">
                <td>代理人住所</td>
                <td>{{ data.dlrzs }}</td>
              </tr>
              <!-- <tr v-if="data.gjy">
                <td>生产国或地区</td>
                <td>{{data.gjy}}</td>
              </tr>-->
              <tr v-if="data.qt">
                <td>其他内容</td>
                <td>{{ data.qt }}</td>
              </tr>
              <tr v-if="data.bmdh">
                <td>
                  编码代号
                  <el-tooltip
                    class="tooltips-codingCode"
                    effect="light"
                    placement="right"
                  >
                    <div slot="content" v-html="helpDesc.codingCode"></div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td>{{ data.bmdh }}</td>
              </tr>
              <tr v-if="data.bmdh2018">
                <td>编码代号（2018版）</td>
                <td>{{ data.bmdh2018 }}</td>
              </tr>
              <tr v-if="data.bz">
                <td>备注</td>
                <td>{{ data.bz }}</td>
              </tr>
              <tr v-if="data.pzrq">
                <td>批准日期</td>
                <td>{{ data.pzrq }}</td>
              </tr>
              <tr v-if="data.yxq">
                <td>有效期至</td>
                <td>{{ data.yxq }}</td>
              </tr>
              <!--<tr v-if="data.scsz">
                <td>生产厂商名称</td>
                <td>{{data.scsz}}</td>
              </tr>
              <tr v-if="data.shfw">
                <td>售后服务机构</td>
                <td>{{data.shfw}}</td>
              </tr>-->
              <tr v-if="data.bgqk">
                <td>变更情况</td>
                <td>{{ data.bgqk }}</td>
              </tr>
              <!--<tr v-if="data.bgrq">
                <td>变更日期</td>
                <td>{{data.bgrq}}</td>
              </tr>-->
              <tr v-if="data.fj">
                <td>附件下载</td>
                <td class="iconfont"><a :href="data.fj">&#xe62c;</a></td>
              </tr>
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
      tp: "",
      extendList: [], // 扩展信息
      hasExtend: false,
      helpDesc: {
        registrationCertificateNumber: "完成器械注册后赋予的唯一标识编号",
        registrationCertificateName: "同注册该器械的公司名称",
        registrationCertificateResidence: "同注册该器械的公司地址",
        codingCode: "医疗器械分类目录下的二级目录",
        managerType: "医疗器械根据安全性分为Ⅰ类、Ⅱ类、Ⅲ类",
        phone: "企业联系电话为国产注册企业和进口国内代理企业联系电话",
      },
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Qxss.nopms,
      allBase: (state) => state.Qxss.allBase,
      helpInfo: (state) => state.Qxss.helpInfo,
    }),
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/qxss/" + this.$route.params.id,
          params: {
            tp: this.$route.query.tp,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.data = res.data.data;
            this.getExtendList("qxss", res.data.data.extendList);
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
    Store.dispatch("Qxss/getBaseInfo");
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
