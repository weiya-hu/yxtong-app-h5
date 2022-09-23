<template>
  <div class="wrapper" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="base_info.drugname">{{
              base_info.drugname
            }}</span>
            <span class="top-num">{{ base_info.applno }}</span>
            <div class="left-bottom">
              <span
                class="id-green bg-blue"
                v-if="base_info.firstgeneric === '是'"
                >首仿</span
              >
              <span
                class="id-green bg-orange"
                v-if="base_info.chengpishu === '是'"
                >橙皮书</span
              >
              <span
                class="id-green"
                v-if="base_info.submissionpropertytypecode === '是'"
                >孤儿药</span
              >
              <span
                class="id-green bg-blue"
                v-if="base_info.essentialmedicine !== ''"
                >基药</span
              >
              <span
                class="id-green bg-orange"
                v-if="base_info.firstinclass !== ''"
                title="首创新药"
                >首创</span
              >
              <span
                class="id-green"
                v-if="base_info.firstapproved !== ''"
                title="美国首批"
                >首批</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="main" style="padding-top: 50px">
        <slide-section :title="'基本信息'" class="the-part">
          <div class="tb-wrap">
            <table class="tb-t">
              <tr v-if="base_info.applno">
                <td>申请号</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.applno }}</div>
                </td>
              </tr>
              <tr v-if="base_info.appltype">
                <td>
                  申请类型
                  <el-tooltip effect="light" placement="right">
                    <div slot="content">
                      生物药CBER即“生物制品审评与研究中心“批准的产品，包括过敏原性、血液制品、细胞和基因治疗、疫苗等产品。
                    </div>
                    <i class="el-icon-question cl-green"></i>
                  </el-tooltip>
                </td>
                <td colspan="3">
                  <div class="td-line5">生物药（CBER）</div>
                </td>
              </tr>
              <tr v-if="base_info.drugname">
                <td>商品名称</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.drugname }}</div>
                </td>
              </tr>
              <tr v-if="base_info.activeingredient">
                <td>通用名称</td>
                <td colspan="3">
                  <div class="td-line5">
                    <div class="flex1">
                      <span>
                        <!-- <router-link v-if="base_info.activeingredient" tag="a" :to="{path: `/fdadrugnew?cname=${base_info.activeingredient}&tabName=nameGroup`}" target="_blank" class="link-a">
                          {{base_info.activeingredient}} 
                        </router-link> -->
                        {{ base_info.activeingredient }}
                        {{ base_info.cname }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="base_info.drugname">
                <td>申请机构</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.sponsorname }}</div>
                </td>
              </tr>
              <tr v-if="base_info.submissionstatusdate1">
                <td>上市日期</td>
                <td colspan="3">
                  <div class="td-line5">
                    {{ base_info.submissionstatusdate1 }}
                  </div>
                </td>
              </tr>
              <tr v-if="base_info.summary">
                <td>药物概述</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.summary }}</div>
                </td>
              </tr>
              <tr v-if="base_info.shiyingzheng">
                <td>适应症</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.shiyingzheng }}</div>
                </td>
              </tr>
              <tr v-if="base_info.clinical">
                <td>临床试验信息</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.clinical }}</div>
                </td>
              </tr>
              <tr v-if="base_info.targets_abbr">
                <td>靶点简称</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.targets_abbr }}</div>
                </td>
              </tr>
              <tr v-if="base_info.targets">
                <td>靶点全称</td>
                <td colspan="3">
                  <div class="td-line5">{{ base_info.targets }}</div>
                </td>
              </tr>
              <tr v-if="base_info.productInformation">
                <td>药品信息</td>
                <td colspan="3">
                  <div class="td-line5">
                    <a
                      :href="base_info.productInformation"
                      target="_blank"
                      class="link-a"
                      >查看</a
                    >
                  </div>
                </td>
              </tr>
              <tr v-if="base_info.supportingdocuments">
                <td>附件</td>
                <td colspan="3">
                  <div class="td-line5">
                    <a
                      :href="base_info.supportingdocuments"
                      target="_blank"
                      class="link-a"
                      >查看</a
                    >
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </slide-section>

        <a href="#" name="part8"></a>
        <slide-section
          :title="'扩展信息'"
          class="the-part"
          v-if="extendList && extendList.length"
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
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import ExtendButton from "@/components/common/extend-button";
import LaFooter from "@/components/layouts/footer";
import tablehead from "@/config/tablehead";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll.js";
const ypxxHead = tablehead.cfdadrug.Detailfdadrugxq;
const lsspHead = tablehead.cfdadrug.Detailyssq;
const splsHead = tablehead.cfdadrug.Detailspls;
const ndcHead = tablehead.cfdadrug.Detailndc;
const equivalentHead = tablehead.cfdadrug.Detailequivalent;

export default {
  components: {
    SlideSection,
    LaFooter,
    ExtendButton,
    LoadingGif
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      spacingH: 0,
      temActive: 0,
      tooltip: {
        marketingstatusid:
          "暂定批准是指对符合全部批准条件的仿制药申请所采取的行动，但是在申请所参考的上市药物的市场独占权和/或专利期限到期之前，它不被允许在美国合法销售。",
        firstgeneric:
          "FDA首次批准并允许制造商在美国销售此药。FDA认为第一个首仿药对公众健康很重要，并优先审查这些提交的文件。",
        f505b2:
          "当NDA申请人提交完整的安全性和有效性研究报告时，至少有部分内容来源于非申请者开展或申请者无权引用的研究，则必须通过505(b)(2)途径。",
        offexclusiity:
          "申请人在这些NDA新药过了保护期之后申请ANDA，但是向FDA提交ANDA之前，需要参考上述三个选项。partI：若提交为ANDA，FDA可立即受理；partII：若提交为ANDA，会涉及到部分法案，需要在此之前与FDA沟通；appendix：从partI、partII删除，已获得FDA的批准。",
        acceleration:
          "加速批准主要适用于病程较长和需要较长的时间才能衡量药物预期的临床效益的环境。",
        breakthroughtherapy:
          "如果一种药物被指定为突破性治疗，FDA将加快这种药物的开发和审查。所有突破性治疗指定的申请将在收到后60天内进行审核，FDA有权利批准或拒绝该申请。",
        priority:
          "优先审评是在提交BLA，NDA或功效补充剂时确定的。如果符合相关标准，则任何药物，包括已获得快速通道名称，突破性疗法名称或正在评估加速批准的药物，都可以进行优先审评。",
        fasttrack:
          "快速审批通道是指用于治疗严重或危及生命的疾病的药物，非临床或临床数据表明有潜力解决严重疾病的未满足医疗需求。",
        submissionclasscode:
          "对于原始(ORIG)的NDA提交，此处提供了新药申请的分类；对于补充(SUPPL)提交，此处描述了FDA批准申请的变更类型。",
        tecode:
          "使用户快速了解FDA是否已将特定批准的药品评估为与其他药学等效性产品具有等效治疗性（第一个字母），并在FDA的评估基础上提供其他信息（第二个字母）。首字母A代表没有生物等效问题，或已解决，B有生物等效问题且尚未解决。第二个字母按照剂型等划分其他信息。",
        referencedrug:
          "简称RLD，是指在FDA批准上市，用于仿制药注册申请的参照药品。通常是具有完整规范的安全性和有效性研究数据的药品。"
      },

      isLoading: true,
      id: "",
      // steps,
      data: {},
      scroll: "",
      heightArr: [],
      hasPartOne: true,
      hasPartTwo: false,
      hasPartThree: false,
      hasPartFour: false,
      hasExtend: false,
      yfxx: {},
      base_info: {},
      ypxxListData: {
        List: [],
        tableHead: ypxxHead
      },
      lsspListData: {
        List: [],
        tableHead: lsspHead
      },
      splsListData: {
        List: [],
        tableHead: splsHead
      },
      ndc: {
        List: [],
        tableHead: ndcHead
      },
      equivalent: {
        List: [],
        tableHead: equivalentHead
      },
      sull: "",
      pass: "", //原始申请url获取的参数
      passtwo: "", //审批历史url获取的参数
      passthree: "",
      extendList: []
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Fdadrugnew.nopms,
      allBase: state => state.Fdadrugnew.allBase,
      helpInfo: state => state.Fdadrugnew.helpInfo
    })
  },
  watch: {
    isLoading(val) {
      if (!val) {
        this.$nextTick(function() {
          setTimeout(() => {
            this.spacingH = $(".base-info").outerHeight() + 20;
            this.getPartsHeight();
          }, 0);
        });
      }
    }
  },
  methods: {
    handleNavClick1(e) {
      const index = Number($(e.target).attr("data-ix"));
      $(e.target)
        .parent()
        .children()
        .removeClass("active");
      $(e.target).addClass("active");
      this.temActive = index;
    },
    handleScroll() {
      const h = $(".detail-header").height();
      const h1 = $(".base-info").height();
      const scrollTop = $(".wrapper").offset().top;

      if (scrollTop < -h1 + 40) {
        $(".left-nav-in").css({
          top: h + 20 + 15 + 48,
          left: 10,
          position: "fixed"
        });
      } else {
        $(".left-nav-in").css({ top: 0, left: 0, position: "absolute" });
      }
    },
    onScroll() {
      window.addEventListener("scroll", this.handleScroll, true);
    },
    //控制审批历史里面标签显示的文字
    handleAAA(item) {
      if (item.indexOf("/appletter/") !== -1) {
        return "Letter";
      } else if (item.indexOf("/label/") !== -1) {
        return "Label";
      } else if (item.indexOf("/nda/") !== -1) {
        return "Review";
      }
    },
    //获取详情头部和基本信息的数据
    handleAxiosJbxxList() {
      window
        .Axios({
          method: "get",
          url: "/api/fdadrugnew/cberdetails?id=" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.base_info = data.basicInformation;

            this.ypxxListData.List = data.apply_number_drug_list;
            this.lsspListData.List = data.original_apply_list;
            this.splsListData.List = data.approval_history_list;
            this.equivalent.List = data.equivalent;
            this.ndc.List = data.ndc;
            this.getExtendList("fdadrugnew", data.extendList);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.removeLoading);
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    }
  },
  created() {
    if (!this.nopms.xqy) {
      this.handleAxiosJbxxList();
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
    Store.dispatch("Fdadrugnew/getBaseInfo");
    // this.onScroll()
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
.flex {
  display: flex;
}
.flex1 {
  flex: 1;
}
.t-line5 {
  max-height: 100px;
  overflow-y: auto;
}
.link-a {
  text-decoration: underline;
  color: #4877e8;
}
.link-a1 {
  color: #4877e8;
}
.label-zl {
  span {
    margin-right: 30px;
    font-size: 13px;
  }
}
.equiv-lz {
  margin-top: 20px;
  p {
    font-size: 14px;
    // font-style: italic;
  }
  span.fontw {
    font-weight: 700;
  }
}
/deep/.slide-section .content {
  padding-top: 0 !important;
}
.base-info {
  position: relative;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 5px #c4d3f8;
  background: #fff;
  border-radius: 4px;
  .base-info-ou {
    display: flex;
  }
  .base-info-in1 {
    padding: 0 20px;

    > li {
      margin-bottom: 10px;
      line-height: 20px;
      list-style-type: disc;
      color: #4877e8;
      font-size: 16px;

      label {
        width: 100px;
        display: inline-block;
        font-size: 14px;
      }
      span {
        color: #35384a;
        font-size: 14px;
      }
    }
  }
  .base-info-in2 {
    > li {
      display: flex;
      align-items: center;
      margin-top: 15px;
      padding: 20px 20px 20px 0;
      background: #eff2fa;
      label {
        width: 24px;
        padding: 10px;
        background: #4877e8;
        color: #fff;
        text-align: center;
        font-weight: 700;
      }
      .p-cont {
        line-height: 20px;
        padding-left: 20px;
        font-size: 13px;
        flex: 1;
        p {
          word-break: break-all;
        }
      }
    }
  }
}
.left-nav {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
}
</style>
<style scoped>
.zjl_unset >>> .cell {
  -webkit-line-clamp: unset !important;
}
</style>
