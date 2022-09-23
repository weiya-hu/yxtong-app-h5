<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.List.name">
              {{ data.List.name }}
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
            <a class="nav-item" v-if="hasUrl">审批文档</a>
            <a
              class="nav-item"
              v-if="data.List.withdrawaldate || data.List.withdrawalurl"
              >申请人已撤回</a
            >
            <!-- <a class="nav-item" v-if="hasPartTwo">注册时光轴</a> -->
            <a class="nav-item" v-if="hasExtend">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" class="the-part part-one">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.List.num">
                  <td>产品编号</td>
                  <td>{{ data.List.num }}</td>
                </tr>
                <tr v-if="data.List.name">
                  <td>商品名称</td>
                  <td>{{ data.List.name }}</td>
                </tr>
                <tr v-if="data.List.commonname">
                  <td>通用名称</td>
                  <td>{{ data.List.commonname }}</td>
                </tr>
                <tr v-if="data.List.active">
                  <td>活性成分(英文)</td>
                  <td>{{ data.List.active }}</td>
                </tr>
                <tr v-if="data.List.ylbm">
                  <td>活性成分(药智)</td>
                  <td>{{ data.List.ylbm }}</td>
                </tr>
                <tr v-if="data.List.cname">
                  <td>活性成分(中文)</td>
                  <td>{{ data.List.cname }}</td>
                </tr>
                <tr v-if="data.List.changshang">
                  <td>上市许可持有人</td>
                  <td>{{ data.List.changshang }}</td>
                </tr>
                <tr v-if="data.List.date">
                  <td>批准日期</td>
                  <td>{{ data.List.date }}</td>
                </tr>
                <tr v-if="data.List.atc">
                  <td>ATC编码</td>
                  <td>{{ data.List.atc }}</td>
                </tr>
                <tr v-if="data.List.zwstatus">
                  <td>市场状态</td>
                  <td>{{ data.List.zwstatus }}</td>
                </tr>
                <tr v-if="data.List.therapeuticarea">
                  <td>治疗领域</td>
                  <td>{{ data.List.therapeuticarea }}</td>
                </tr>
                <tr v-if="data.List.shiyingzheng">
                  <td>适应症</td>
                  <td>{{ data.List.shiyingzheng }}</td>
                </tr>
                <tr v-if="data.List.biosimilar">
                  <td>生物类似药</td>
                  <td>{{ data.List.biosimilar }}</td>
                </tr>
                <tr v-if="data.List.isgeneric">
                  <td>仿制药</td>
                  <td>{{ data.List.isgeneric }}</td>
                </tr>
                <tr v-if="data.List.isorphan">
                  <td>孤儿药</td>
                  <td>{{ data.List.isorphan }}</td>
                </tr>
                <tr v-if="data.List.acceleration">
                  <td>加速审评</td>
                  <td>{{ data.List.acceleration }}</td>
                </tr>
                <tr v-if="data.List.additionalmonitor">
                  <td>额外监管</td>
                  <td>{{ data.List.additionalmonitor }}</td>
                </tr>
                <tr v-if="data.List.conditionapproval">
                  <td>
                    附带条件批准
                    <el-tooltip
                      class="tooltips-incidentalConditions"
                      effect="light"
                      placement="right"
                    >
                      <div
                        slot="content"
                        v-html="helpDesc.incidentalConditions"
                      ></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td>{{ data.List.conditionapproval }}</td>
                </tr>
                <tr v-if="data.List.exceptionalcircumstance">
                  <td>
                    特殊情况批准
                    <el-tooltip
                      class="tooltips-incidentalConditions"
                      effect="light"
                      placement="right"
                    >
                      <div
                        slot="content"
                        v-html="helpDesc.exceptionalCase"
                      ></div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td>{{ data.List.exceptionalcircumstance }}</td>
                </tr>
              </table>
            </div>
          </slide-section>
          <slide-section
            :title="'申请人已撤回'"
            class="the-part part-one"
            v-if="data.List.withdrawaldate || data.List.withdrawalurl"
          >
            <div class="tb-wrap">
              <table class="tb-t">
                <tr>
                  <td>申请撤回日期</td>
                  <td v-if="data.List.withdrawaldate">
                    {{ data.List.withdrawaldate }}
                  </td>
                </tr>
                <tr>
                  <td>详情</td>
                  <td v-if="data.List.withdrawalurl">
                    <a
                      :href="data.List.withdrawalurl"
                      target="_blank"
                      style="color: #4877e8"
                      >查看</a
                    >
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>
          <slide-section
            v-if="hasUrl"
            :title="'审批文档'"
            class="the-part part-two"
          >
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.List.url">
                  <td style="background: #fff">
                    <a
                      :href="data.List.url"
                      style="color: #4877e8"
                      target="_blank"
                      v-if="data.List.url !== ''"
                    >
                      查看
                      (公众评估报告、授权细节、产品规格/剂型、标签、历史评估信息)
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>
          <!-- 扩展信息开始 -->
          <slide-section
            :title="'扩展信息'"
            v-if="hasExtend"
            class="the-part part-three"
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
      wordBreak: "word-break: break-word;",
      isLoading: true,
      data: {},
      id: "",
      extendList: [],
      hasUrl: false, // 是否有审批文档
      hasExtend: false,
      helpDesc: {
        incidentalConditions:
          "同时满足以下要求的药品申请，人用药品委员会（CHMP）可以授予有条件批准：申请人可能能够提供全面数据；能够满足未被满足的医疗需求；药品即时使用的收益大于因缺少正常审批的数据而带来的风险。附带条件批准的产品有效期为一年，每年续期一次。",
        exceptionalCase:
          "申请人可以提出申请但无法提供正常申请的有关安全性和有效性的全部数据，原因如下：① 产品的适应症人群太少，难以获得预期的充分数据；② 以当前的科学认知水平无法获得充分数据；③ 搜集这些信息与公认的医学伦理学原则相违背。只作为处方药管理且只在严格的监督下使用。",
      },
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
          url: "/api/epyp/emadetail",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.data = res.data.data;
            this.hasUrl =
              this.data.List.url &&
              this.data.List.url != "" &&
              this.data.List.url != null;
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
