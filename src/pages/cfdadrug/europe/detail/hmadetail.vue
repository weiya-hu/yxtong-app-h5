<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.List.product">
              {{ data.List.product }}
            </span>
            <span class="id-green">{{ data.Source }}</span>
          </div>

          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item
              ><a :href="'/' + allBase.dbename">{{
                allBase.dbname
              }}</a></el-breadcrumb-item
            >
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div
          class="left-nav"
          :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }"
        >
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active">基本信息</a>
            <a class="nav-item" v-if="hasCountryerInfo">成员国信息</a>
            <a class="nav-item" v-if="hasAttachments">附件文档</a>
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" class="the-part part-one">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.List.mrno">
                  <td>MR号</td>
                  <td>{{ data.List.mrno }}</td>
                </tr>
                <tr v-if="data.List.product">
                  <td>商品名称</td>
                  <td>{{ data.List.product }}</td>
                </tr>
                <tr v-if="data.List.activesubstances">
                  <td>活性成分(英文)</td>
                  <td>{{ data.List.activesubstances }}</td>
                </tr>
                <tr v-if="data.List.ylbm">
                  <td>活性成分(药智)</td>
                  <td>{{ data.List.ylbm }}</td>
                </tr>
                <tr v-if="data.List.cname">
                  <td>活性成分(中文)</td>
                  <td>{{ data.List.cname }}</td>
                </tr>
                <tr v-if="data.List.holder">
                  <td>上市许可持有人</td>
                  <td>{{ data.List.holder }}</td>
                </tr>
                <tr v-if="data.List.outcometime">
                  <td>批准日期</td>
                  <td>{{ data.List.outcometime }}</td>
                </tr>
                <tr v-if="data.List.atccode">
                  <td>ATC编码</td>
                  <td>{{ data.List.atccode }}</td>
                </tr>
                <tr v-if="data.List.zwoutcome">
                  <td>
                    市场状态
                    <el-tooltip
                      effect="light"
                      placement="right"
                      content="针对HMA市场状态：当一种药品被欧盟批准上市后，信息更新时会对药品的安全情况增加正向评价或负向评价。"
                    >
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td>{{ data.List.zwoutcome }}</td>
                </tr>
                <tr v-if="data.List.form">
                  <td>剂型</td>
                  <td>{{ data.List.form }}</td>
                </tr>
                <tr v-if="data.List.zwform2">
                  <td>
                    剂型(药智)
                    <el-tooltip
                      effect="light"
                      placement="right"
                      content="此功能只针对于筛选HMA批准上市的相关数据。"
                    >
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td>{{ data.List.zwform2 }}</td>
                </tr>
                <tr v-if="data.List.strength">
                  <td>规格(药智)</td>
                  <td>{{ data.List.strength }}</td>
                </tr>
                <tr v-if="data.List.updatetime">
                  <td>最新更改日期</td>
                  <td>{{ data.List.updatetime }}</td>
                </tr>
                <tr v-if="data.List.typeLevel1">
                  <td>申请类型1</td>
                  <td>{{ data.List.typeLevel1 }}</td>
                </tr>
                <tr v-if="data.List.typeLevel2">
                  <td>申请类型2</td>
                  <td>{{ data.List.typeLevel2 }}</td>
                </tr>
                <tr v-if="data.List.typeLevel3">
                  <td>申请类型3</td>
                  <td>{{ data.List.typeLevel3 }}</td>
                </tr>
                <tr v-if="data.List.typeLevel4">
                  <td>申请类型4</td>
                  <td>{{ data.List.typeLevel4 }}</td>
                </tr>
                <tr v-if="data.List.typeLevel5">
                  <td>申请类型5</td>
                  <td>{{ data.List.typeLevel5 }}</td>
                </tr>
              </table>
            </div>
          </slide-section>
          <slide-section
            v-if="hasCountryerInfo"
            class="the-part part-two"
            :title="'成员国信息'"
          >
            <div v-if="data.List.rms" class="tb-wrap">
              <span class="title">参照成员国</span>
              <table class="tb-t">
                <tr>
                  <td>国家名称</td>
                  <td
                    style="background: #f6f8fc"
                    v-if="data.List.rmsproductname"
                  >
                    产品名称
                  </td>
                </tr>
                <tr>
                  <td>{{ data.List.rms }}</td>
                  <td v-if="data.List.rmsproductname">
                    {{ data.List.rmsproductname }}
                  </td>
                </tr>
              </table>
            </div>
            <div
              v-if="data.List.cmsList && data.List.cmsList.length > 0"
              class="tb-wrap"
            >
              <span class="title">有关成员国</span>
              <table class="tb-t">
                <tr>
                  <td
                    v-if="
                      !data.List.cmsList.every((item) => item.cmscountry == '')
                    "
                  >
                    国家名称
                  </td>
                  <td
                    v-if="
                      !data.List.cmsList.every((item) => item.cmsproduct == '')
                    "
                    style="background: #f6f8fc"
                  >
                    产品名称
                  </td>
                </tr>
                <tr
                  v-if="data.List.cmsList && data.List.cmsList.length > 0"
                  v-for="(item, index) in data.List.cmsList"
                  :key="'cmsList' + index"
                >
                  <td
                    v-if="
                      !data.List.cmsList.every((item) => item.cmscountry == '')
                    "
                    style="background: #fff"
                  >
                    {{ item.cmscountry }}
                  </td>
                  <td
                    v-if="
                      !data.List.cmsList.every((item) => item.cmsproduct == '')
                    "
                  >
                    {{ item.cmsproduct }}
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>
          <slide-section
            v-if="hasAttachments"
            class="the-part part-three"
            :title="'附件文档'"
          >
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.List.spc && data.List.spc.split(',').length > 0">
                  <td
                    v-if="data.List.spc && data.List.spc.split(',').length > 0"
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.spc.split(',')"
                      :key="'spc-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >产品特性概要</a
                      >
                    </div>
                  </td>
                </tr>
                <tr v-if="data.List.pl && data.List.pl.split(',').length > 0">
                  <td
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.pl.split(',')"
                      :key="'pl-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >标签</a
                      >
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="
                    data.List.labelling &&
                    data.List.labelling.split(',').length > 0
                  "
                >
                  <td
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.labelling.split(',')"
                      :key="'labelling-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >包装信息</a
                      >
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="
                    data.List.information &&
                    data.List.information.split(',').length > 0
                  "
                >
                  <td
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.information.split(',')"
                      :key="'information-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >最终产品信息</a
                      >
                    </div>
                  </td>
                </tr>
                <tr v-if="data.List.par && data.List.par.split(',').length > 0">
                  <td
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.par.split(',')"
                      :key="'par-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >评估报告</a
                      >
                    </div>
                  </td>
                </tr>

                <tr v-if="data.List.FPL && data.List.FPL.split(',').length > 0">
                  <td
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.FPL.split(',')"
                      :key="'FPL-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >产品说明书</a
                      >
                    </div>
                  </td>
                </tr>

                <tr
                  v-if="
                    data.List.PARSUM && data.List.PARSUM.split(',').length > 0
                  "
                >
                  <td
                    style="
                      background: #fff;
                      display: flex;
                      flex-wrap: wrap;
                      max-width: unset !important;
                      width: unset !important;
                    "
                  >
                    <div
                      class="word"
                      v-for="(item, index) in data.List.PARSUM.split(',')"
                      :key="'PARSUM-' + index"
                      style="
                        word-break: break-all;
                        margin-right: 15px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      <a :href="pdfUrl + item" target="_blank" class="link-a"
                        >评估报告总结
                        <el-tooltip
                          effect="light"
                          placement="right"
                          content="解释本药物是如何被评估的，它的授权是如何被推荐的，以及它的使用条件（不包括实用建议）。"
                        >
                          <i class="el-icon-question cl-green"></i>
                        </el-tooltip>
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>
          <!-- 扩展信息开始 -->
          <slide-section
            :title="'扩展信息'"
            class="the-part part-four"
            v-if="hasExtend"
          >
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
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import { mapState } from "vuex";
import ExtendButton from "@/components/common/extend-button";
import detailScrollMixins from "@/mixins/detailScroll.js";
export default {
  components: {
    SlideSection,
    LaFooter,
    ExtendButton,
    LoadingGif,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      pdfUrl: "https://zy.yaozh.com/hma/",
      hasCountryerInfo: false,
      hasAttachments: false,
      wordBreak: "word-break: break-word;",
      isLoading: true,
      data: {},
      id: "",
      extendList: [],
      hasExtend: false,
      // dbname: qixiebiaozhun, // 数据库类型名称，如hmap、qixiebiaozhun等
      // id: 8782 //具体对应编号
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Epyp.nopms,
      allBase: (state) => state.Epyp.allBase,
      helpInfo: (state) => state.Epyp.helpInfo,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
  },
  watch: {
    showPromtNotice(val) {
      if (val) {
        if ($(".left-nav").css("top")) {
          $(".left-nav").css("top", "128px");
        }
      } else {
        if ($(".left-nav").css("top")) $(".left-nav").css("top", "98px");
      }
    },
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/epyp/hmadetail",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.data = res.data.data;
            this.hasCountryerInfo =
              this.data.List.rms || this.data.List.cmsList.length > 0; // 是否显示成员国信息
            this.hasAttachments =
              this.data.List.spc ||
              this.data.List.pl ||
              this.data.List.labelling ||
              this.data.List.information ||
              this.data.List.par; // 是否显示附件文档
            this.getExtendList("epyp", res.data.data.extendList);
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
    Store.dispatch("Epyp/getBaseInfo");
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

.t-line5 {
  display: flex;
  flex-wrap: wrap;
}
.wrapper .detail-list .detail-header .header-left .left-top {
  width: auto;
}
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
.link-a {
  color: #4877e8;

  &:hover {
    text-decoration: underline;
  }
}

.tb-wrap {
  .title {
    font-size: 16px;
  }
  .link-a {
    color: #4877e8;

    &:hover {
      text-decoration: underline;
    }
  }
}
.single-td {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  max-width: unset !important;
  width: unset !important;
}
// 主要信息部分
.main {
  // 右边 - 详细列表
  .right-list {
    .part-one {
      position: relative;
    }
    // PART 3 部分
    .part-three {
      .tb-wrap {
        .tb-t {
          margin-bottom: 30px;
          tr {
            height: 33px;
            td {
              border: 1px solid @BorderColorNew;
              &:nth-child(1) {
                background: @DetailTableLeftColor;
                width: 183px;
                padding-left: 28px;
              }
              &:nth-child(2) {
                background: #fff;
                width: 336px;
                padding-left: 35px;
              }
              &:nth-child(3) {
                background: @DetailTableLeftColor;
                width: 183px;
                padding-left: 28px;
              }
              &:nth-child(4) {
                background: #fff;
                width: 336px;
                padding-left: 35px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
