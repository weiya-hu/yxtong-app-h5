<template>
  <div class="wrapper drugreport-detail">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isloading != '' || loading" v-if="isloading != '' || loading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <img src="/static/imgs/general/drug-icon.png" class="drug-icon" />
        <div class="header-left">
          <div style="margin-left: 10px">
            <div class="left-top">
              <span class="top-id" :title="base_info.name ? base_info.name : base_info.englishname">
                {{ base_info.name ? base_info.name : base_info.englishname }}
              </span>
              <div class="left-bottom" v-if="base_info.name">
                <span class="bottom-name fontw">
                  {{ base_info.englishname }}
                </span>
              </div>
              <span v-if="base_info.chinamarked == 1" class="icon-head">
                <i class="iconfont">&#xe66d;</i>&nbsp;中国上市&nbsp;
                <i class="iconfont icon-dui">&#xe634;</i>
              </span>
              <span v-if="base_info.higheststatus" class="icon-head">
                <i class="iconfont">&#xe63a;</i>
                &nbsp;{{ base_info.higheststatus }}&nbsp;
                <i class="iconfont icon-dui">&#xe634;</i>
              </span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="ywbg">
            <!-- <el-tooltip effect="light" placement="left" v-if="base_info.is_newdrug">
              <div slot="content">可查看该药物及同靶点药物研发进展情况</div>
              <span>
                <i class="el-icon-question cl-green sixe13"></i>
              </span>
            </el-tooltip>-->
            <!-- <div
              class="ywbg-btn"
              @click="ywbgLink(base_info.is_newdrug)"
              v-if="base_info.is_newdrug"
            >
              <img src="~@/assets/imgs/ywbg2.png" />
              <span>新药进展</span>
            </div>-->
            <!-- v-if="isDev" -->
            <!-- <div
              class="ywbg-btn"
              v-loading="!cate_loaded"
              element-loading-spinner="el-icon-loading"
              @click="cate_loaded && getPDF(true)"
            >
              <img width="20px" src="~@/assets/imgs/yzx/pdf_i.png" />
              <span>生成报告</span>
            </div>-->
            <!-- 导出可复制的PDF  -->
            <div class="ywbg-btn" v-loading="!cate_loaded && !font_loaded" element-loading-spinner="el-icon-loading"
              @click="cate_loaded && font_loaded && getPDF()">
              <img width="16px" src="~@/assets/imgs/yzx/pdf_icon.png" />
              <span>生成报告</span>
            </div>
          </div>

          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 新手引导 -->
      <div class="new-guide" v-if="showGlobaldrugsDetailGuide">
        <div :style="{
          left: step1Position && step1Position.left + 'px',
          top: step1Position && step1Position.top + 'px'
        }" :class="['guide-bg', `guide-step${guideStep}`]"></div>

        <div v-if="guideStep == 0" class="guide-content0">
          <img src="/static/imgs/trz/trz_tips.png" alt="" />
          <div class="info">
            <h4>全球药物2.0内测上线</h4>
            <div class="info-footer">
              <div @click="handleNextStep">立即前往</div>
              <span @click="handleKnow">继续使用当前版本</span>
            </div>
          </div>
        </div>
      </div>

      <div class="main" style="padding-top: 50px">
        <div class="detail-type1">
          <div class="mian-inf">
            <div class="main-p1-container">
              <div class="main-p1">
                <ul class="basic-info">
                  <li>
                    <label>药物别名</label>
                    <span style="word-break: break-all" :title="base_info.ename">{{ base_info.ename || "/" }}</span>
                  </li>
                  <li style="width: 100%">
                    <label>药物类型</label>
                    <span>{{ base_info.leixing2 || "/" }}</span>
                  </li>
                  <li>
                    <label>原研单位</label>
                    <span>{{
                        base_info.guifanqiye || base_info.originatorcompany || "/"
                    }}</span>
                  </li>
                  <li>
                    <label>全球最高状态</label>
                    <span v-if="base_info.higheststatus">
                      {{ base_info.higheststatus || "/" }}
                      <i class="iconfont icon-dui">&#xe634;</i>
                    </span>
                  </li>
                  <!-- <li>
                  <label>ATC分类</label>
                  <div class="atc-fl">
                    <div v-for="(item, index) in getAtcName(base_info.atc)" :key="item" class="clearfix">
                      <span>{{item}}&nbsp;&nbsp;</span><span>{{getAtc(item, base_info.atcarr)}}</span>
                      <br v-if="index%2 != 0" />
                    </div>
                  </div>
                  </li>-->
                </ul>
                <ul class="basic-info">
                  <li>
                    <label>中国上市</label>
                    <span>
                      {{
                          base_info.chinamarked == ""
                            ? "/"
                            : base_info.chinamarked == 1
                              ? "是"
                              : "否"
                      }}
                    </span>
                  </li>
                  <li>
                    <label>
                      中国1类新药
                      <el-tooltip effect="light" placement="left" style="align-items: center">
                        <div slot="content">
                          中国新注册分类（2016版化药和2020版生物药）中的1类新药
                        </div>
                        <span>
                          <i class="el-icon-question cl-green sixe13"></i>
                        </span>
                      </el-tooltip>
                    </label>
                    <span>{{ base_info.zclx1 || "/" }}</span>
                  </li>
                  <li v-if="base_info.compound && base_info.compound != '否'">
                    <label>复方药</label>
                    <span>{{ base_info.compound || "/" }}</span>
                  </li>
                </ul>
              </div>
              <div class="drug-img">
                <slide-lan>
                  <img v-if="base_info.structpicture" @click="() => $Img(base_info.structpicture)"
                    :src="base_info.structpicture" @error="picLoadError" />
                  <img v-else src="/static/imgs/general/no-drug-img.jpg" />
                </slide-lan>
              </div>
            </div>
            <div class="main-p2" v-if="base_info.yaowugaishu">
              <div class="summary">
                <h4>药物概述</h4>
                <div class="summary-info t-line6" v-html="base_info.yaowugaishu"></div>
              </div>
            </div>
          </div>
          <div class="classified">
            <div class="catalogues">
              <div v-if="(index = 'jbxx' && showJBXX())" id="jbxx" v-bind:class="[
                active_catalogue == 'jbxx' ? 'active' : '',
                'catalogue',
              ]" @click="SwitchCatalogue('jbxx')">
                基本信息
              </div>
              <div v-if="
                (index = 'apijbxx' && Object.keys(base_info.api).length > 0)
              " v-bind:class="[
  active_catalogue == 'apijbxx' ? 'active' : '',
  'catalogue',
]" id="apijbxx" @click="SwitchCatalogue('apijbxx')">
                API信息
              </div>
              <div v-if="(index = 'yxx' && isShowYxx(base_info))" v-bind:class="[
                active_catalogue == 'yxx' ? 'active' : '',
                'catalogue',
              ]" id="yxx" @click="SwitchCatalogue('yxx')">
                药效学/药动学
              </div>
              <div v-if="
                (index =
                  'jzgj' &&
                  (base_info.target.length > 0 != '' ||
                    base_info.targets_abbr.length > 0))
              " v-bind:class="[
  active_catalogue == 'jzgj' ? 'active' : '',
  'catalogue',
]" id="jzgj" @click="SwitchCatalogue('jzgj')">
                竞争格局（靶点）
              </div>
              <template v-for="(catalogue, index) in catalogues">
                <div v-if="
                  index == 'developmentstatus' &&
                  catalogue != 0 &&
                  catalogues.developmentstatus > 0
                " v-bind:class="[
  active_catalogue == 'developmentstatus' ? 'active' : '',
  'catalogue',
]" :key="index" id="developmentstatus" @click="SwitchCatalogue(index)">
                  适应症进展
                </div>

                <div v-if="
                  index == 'zhuce' && catalogue != 0 && catalogues.zhuce > 0
                " v-bind:class="[
  active_catalogue == 'zhuce' ? 'active' : '',
  'catalogue',
]" :key="index" id="zhuce" @click="SwitchCatalogue(index)">
                  中国注册申报
                </div>

                <div v-if="
                  index == 'clinical' &&
                  catalogue != 0 &&
                  catalogues.clinical > 0
                " v-bind:class="[
  active_catalogue == 'clinical' ? 'active' : '',
  'catalogue',
]" :key="index" id="clinical" @click="SwitchCatalogue(index)">
                  临床试验
                </div>
                <div v-if="
                  index == 'sspz' && catalogue != 0 && catalogues.sspz > 0
                " v-bind:class="[
  active_catalogue == 'sspz' ? 'active' : '',
  'catalogue',
]" :key="index" id="sspz" @click="SwitchCatalogue(index)">
                  上市批准
                </div>
                <div v-if="
                  index == 'ypxs' && catalogue != 0 && catalogues.ypxs > 0
                " v-bind:class="[
  active_catalogue == 'ypxs' ? 'active' : '',
  'catalogue',
]" :key="index" id="ypxs" @click="SwitchCatalogue(index)">
                  市场销售
                </div>
                <div v-if="
                  index == 'yaopinzhongbiao' &&
                  catalogue != 0 &&
                  catalogues.yaopinzhongbiao > 0
                " v-bind:class="[
  active_catalogue == 'yaopinzhongbiao' ? 'active' : '',
  'catalogue',
]" :key="index" id="yaopinzhongbiao" @click="SwitchCatalogue(index)">
                  中标信息
                </div>
                <div v-if="
                  index == 'biaozhun' &&
                  catalogue != 0 &&
                  catalogues.biaozhun > 0
                " v-bind:class="[
  active_catalogue == 'biaozhun' ? 'active' : '',
  'catalogue',
]" :key="index" id="biaozhun" @click="SwitchCatalogue(index)">
                  药品标准
                </div>
                <div v-if="
                  index == 'instruct' &&
                  catalogue != 0 &&
                  catalogues.instruct > 0
                " v-bind:class="[
  active_catalogue == 'instruct' ? 'active' : '',
  'catalogue',
]" :key="index" id="instruct" @click="SwitchCatalogue(index)">
                  药品说明书
                </div>
              </template>
              <div v-if="showZLBJ()" v-bind:class="[
                active_catalogue == 'patent_us' ? 'active' : '',
                'catalogue',
              ]" id="patent_us" @click="SwitchCatalogue('patent_us')">
                专利布局
              </div>
            </div>
            <div class="classified-info">
              <keep-alive>
                <DetailAPIJbxx v-if="
                  active_catalogue == 'apijbxx' &&
                  Object.keys(base_info.api).length > 0
                " :res="base_info" :extendList="extendList"></DetailAPIJbxx>
                <DetailYxx v-if="active_catalogue == 'yxx' && isShowYxx(base_info)" :res="base_info"
                  :extendList="extendList"></DetailYxx>
                <DetailJzgj ref="jzgj" v-if="
                  active_catalogue == 'jzgj' &&
                  (base_info.target.length > 0 != '' ||
                    base_info.targets_abbr.length > 0)
                " :base_info="base_info" :extendList="extendList"></DetailJzgj>
                <DetailJbxx v-if="active_catalogue == 'jbxx' && showJBXX()" :res="base_info" :extendList="extendList">
                </DetailJbxx>

                <DetailIndication v-if="
                  active_catalogue == 'developmentstatus' &&
                  catalogues.developmentstatus > 0
                " :drugid="drugid" :extendList="extendList"></DetailIndication>

                <DetailZhuce v-if="active_catalogue == 'zhuce' && catalogues.zhuce > 0" :res="base_info" :ylbm="ylbm"
                  :extendList="extendList"></DetailZhuce>
                <DetailClinical v-if="
                  active_catalogue == 'clinical' && catalogues.clinical > 0
                " :res="base_info" :ylbm="ylbm" :allCount="catalogues.clinical" :extendList="extendList">
                </DetailClinical>

                <DetailSspz v-if="active_catalogue == 'sspz' && catalogues.sspz > 0" :res="base_info" :ylbm="ylbm"
                  ref="detailSSPZ" :allCount="catalogues.sspz" :extendList="extendList"></DetailSspz>
                <DetailBiaozhun v-if="
                  active_catalogue == 'biaozhun' && catalogues.biaozhun > 0
                " :res="base_info" :ylbm="ylbm" :allCount="catalogues.biaozhun" :extendList="extendList">
                </DetailBiaozhun>
                <DetailInstruct v-if="
                  active_catalogue == 'instruct' && catalogues.instruct > 0
                " :ylbm="ylbm" :allCount="catalogues.instruct" :extendList="extendList"></DetailInstruct>
                <DetailYaopinzhongbiao v-if="
                  active_catalogue == 'yaopinzhongbiao' &&
                  catalogues.yaopinzhongbiao > 0
                " :res="base_info" :ylbm="ylbm" :allCount="catalogues.yaopinzhongbiao" :extendList="extendList">
                </DetailYaopinzhongbiao>
                <DetailYpxs v-if="active_catalogue == 'ypxs' && catalogues.ypxs > 0" :info="base_info" :ylbm="ylbm"
                  :allCount="catalogues.zhuce" :extendList="extendList"></DetailYpxs>
                <DetailPatent v-if="active_catalogue == 'patent_us' && showZLBJ()" :res="base_info" :ylbm="ylbm"
                  :cnListRes="cnListRes" :usListRes="usListRes" :allListRes="allListRes" :extendList="extendList">
                </DetailPatent>
              </keep-alive>
            </div>
          </div>
        </div>
        <!-- <DetailPinn v-else :pinnData="base_info" :extendList="extendList" /> -->
      </div>
    </div>
    <!-- PDF生成图片测试 -->
    <!-- <div v-for="(item, index) in imgs" :key="index">
      <img :src="item" />
    </div>-->
    <!-- <pdf-report
      :isloading.sync="isloading"
      :jspdf.sync="jspdf"
      v-if="jspdf"
      :extendList="extendList"
      :isPinn="isPinn"
      :ylbm="ylbm"
      @modalHandler="modalHandler"
      :infoData="base_info"
      :moreData="pdfData"
      :catalogues="catalogues"
      :cnListRes="cnListRes"
      :usListRes="usListRes"
      :allListRes="allListRes"
    />-->

    <!-- v-if="isDev" -->
    <template>
      <pdf-report-new :isloading.sync="isloading" :jspdf.sync="jspdfNew" v-if="jspdfNew" :extendList="extendList"
        :isPinn="isPinn" :ylbm="ylbm" @modalHandler="modalHandler" :infoData="base_info" :moreData="pdfData"
        :catalogues="catalogues" :cnListRes="cnListRes" :usListRes="usListRes" :allListRes="allListRes" />
    </template>
    <template>
      <pdf-template v-if="jspdf" :isloading.sync="isloading" :jspdf.sync="jspdf" :extendList="extendList"
        :isPinn="isPinn" :ylbm="ylbm" :drugid="drugid" @modalHandler="modalHandler" :infoData="base_info"
        :moreData="pdfData" :catalogues="catalogues" :cnListRes="cnListRes" :usListRes="usListRes"
        :allListRes="allListRes"></pdf-template>
    </template>
    <!-- PDF下载提示框 -->
    <el-dialog class="dialog-actions" :visible="showModal" @close="showModal = false" width="579px"
      :modal-append-to-body="false" :close-on-click-modal="false">
      <div>您的报告已生成，请点击下载！</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" id="downlodPDF">确 定</el-button>
        <el-button @click="showModal = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DetailAPIJbxx from "./apijbxx";
import DetailYxx from "./yxx";
import DetailJzgj from "./jzgj";
import DetailJbxx from "./jbxx";
import DetailIndication from "./indication";
import DetailZhuce from "./zhuce";
import DetailClinical from "./clinical";
import DetailSspz from "./sspz";
import DetailYpxs from "./ypxs";
import DetailYaopinzhongbiao from "./yaopinzhongbiao";
import DetailBiaozhun from "./biaozhun";
import DetailPatent from "./patent";
import DetailInstruct from "./instruct";
import DetailPinn from "./pinndetail";
import { mapState } from "vuex";
import pdfReport from "../pdfReport/pdfReport";
import pdfReportNew from "../pdfReport/pdfReportNew";
import pdfTemplate from "../pdfReport/pdftemplate";
import detailScrollMixins from "@/mixins/detailScroll.js";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideLan from "@/components/common/slide-lan";

export default {
  components: {
    SlideLan,
    DetailAPIJbxx,
    DetailYxx,
    DetailJzgj,
    DetailJbxx,
    DetailIndication,
    DetailZhuce,
    DetailClinical,
    DetailSspz,
    DetailBiaozhun,
    DetailInstruct,
    DetailYaopinzhongbiao,
    DetailYpxs,
    DetailPatent,
    DetailPinn,
    pdfReport,
    pdfReportNew,
    LoadingGif,
    pdfTemplate
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      step1Position: {},
      guideStep: 0, // 新手引导步骤数
      showGlobaldrugsDetailGuide: false, // 控制新手引导弹窗显示隐藏
      cate_loaded: false,
      isDev: /dev|local/.test(location.hostname), // 是否为开发环境
      pdfURL: "",
      showModal: false,
      jspdf: false,
      jspdfNew: false,
      loading: true,
      isloading: false,
      jzgj1: [],
      jzgj2: [],
      catalogues: {},
      base_info: {},
      active_catalogue: "", //标识选中栏目
      cnListRes: {},
      allListRes: {},
      usListRes: {},
      ylbm: "",
      drugid: "",
      extendList: [],
      isPinn: this.$route.query.pinn === "Cortellis",
      pdfData: []
      // urls: (location.host).indexOf('dev')>-1 ? '/pat': '/lineat'
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.DrugReport.nopms,
      allBase: state => state.DrugReport.allBase,
      helpInfo: state => state.DrugReport.helpInfo,
      yfjdParams: state => state.DrugReport.yfjdParams,
      font_loaded: state => state.Layouts.font_loaded
    })
  },
  watch: {
    base_info() {
      this.$nextTick(() => {
        this.loading = false;
      });
    }
  },
  methods: {
    // 继续使用当前版本
    handleKnow() {
      window._paq.push(['trackEvent', 'button', 'click', '全球药物详情_继续使用',])

      localStorage.setItem("showGlobaldrugsDetailGuide", "showGlobaldrugsDetailGuide");
      this.showGlobaldrugsDetailGuide = false;
    },

    // 立即前往按钮
    handleNextStep() {
      window._paq.push(['trackEvent', 'button', 'click', '全球药物详情_立即前往',])

      localStorage.setItem("showGlobaldrugsDetailGuide", "showGlobaldrugsDetailGuide");
      this.showGlobaldrugsDetailGuide = false;

      const { href } = this.$router.resolve({
        path: '/globaldrugs',
        query: {
          ga_source: "vip",
          ga_name: "report_detail"
        }
      })
      window.open(href, "_blank")
    },
    // 获取左边距
    getGuidLeft() {
      let id = `#step${this.guideStep}`
      if ($(id).offset()) {
        this.step1Position = $(id).offset();
      }
    },
    isShowYxx(obj) {
      let flag = false;
      if (obj.targetsarr) {
        if (obj.targetsarr.pharmacodynamics || obj.targetsarr.mechanism_of_action || obj.targetsarr.protein || obj.targetsarr.halflife || obj.targetsarr.toxicity || obj.targetsarr.absorption || obj.targetsarr.volume || obj.targetsarr.metabolism || obj.targetsarr.route || obj.targetsarr.clearance) { // 判断是否有数据
          flag = true;
        } else {
          flag = false;
        }
      } else {
        flag = false;
      }
      return flag;
    },
    modalHandler(url) {
      this.pdfURL = url;
      console.log(url);
      this.showModal = url != "";
      if (url) {
        $("#downlodPDF").on("click", e => {
          window.open(url, "_blank");
        });
      }
    },
    showJBXX() {
      if (
        this.base_info.target_unique.length > 0 != '' ||
        this.base_info.targets_abbr.length > 0 != '' ||
        this.base_info.indication_pizhun != '' ||
        this.base_info.indication != '' ||
        this.base_info.inactiveindications_cn != '' ||
        this.base_info.atc != '' ||
        this.base_info.mechanism_of_action != '' ||
        this.base_info.pharmacodynamics != '' ||
        this.base_info.yaodongxue != '' ||
        this.base_info.othercompany.length > 0 != '' ||
        this.base_info.wikiurl != '' ||
        this.base_info.drugbankurl != '' ||
        this.base_info.keggurl
      ) {
        return true;
      } else {
        return false;
      }
    },
    showZLBJ() {
      if (
        this.ylbm != "" &&
        this.ylbm != null &&
        (this.usListRes.count > 0 != '' ||
          this.cnListRes.totle > 0 != '' ||
          this.allListRes.totle > 0)
      ) {
        return true;
      } else {
        return false;
      }
    },
    getPDF(isNew) {
      if (this.isIE()) {
        this.$Message.error("该功能只适用非IE内核浏览器，请更换浏览器");
        return false;
      }
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "vip_report_xiangqing_scbg"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_report_xiangqing_scbg"
      ]);

      Store.commit("DrugReport/pdfHandlerStatus", false);

      this.isloading = true;
      let accesstoken = GETCOOKIEFUN("accesstoken");
      // 导出统计功能-数据记录到表内-特殊库详情页或者报告的下载 需求单独加的接口
      window.Axios({
        method: "get",
        url: "/api/report/specOutData",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          name: this.base_info.name != '' || this.base_info.englishname
        }
      });
      let params = {
        ylbm: this.ylbm,
        pageSize: 10,
        page: 1,
        accesstoken
      };
      let navList = [
        {
          key: "developmentstatus",
          url: ["/api/report/development", "/api/report/developmentList"]
        },
        {
          key: "zhuce",
          url: ["/api/report/zhuce", "/api/report/zhucelist"]
        },
        {
          key: "clinical",
          url: ["/api/report/clinicallist"]
        },
        {
          key: "sspz",
          url: [
            "/api/report/pizhunHis",
            "/api/report/globalapproval?source=中国",
            "/api/report/globalapproval?source=中国台湾",
            "/api/report/globalapproval?source=美国",
            "/api/report/globalapproval?source=欧盟",
            "/api/report/globalapproval?source=日本",
            "/api/report/globalapproval?source=其他",
          ]
        },
        {
          key: "biaozhun",
          url: ["/api/report/drugStandard"]
        },
        {
          key: "ypxs",
          url: ["/api/report/ypxs", "/api/report/ypxslist", "/api/report/yyxs", "/api/report/yyxslist"]
        },
        {
          key: "yaopinzhongbiao",
          url: ["/api/report/yaopinzhongbiao"]
        },
        {
          key: "patent_us",
          url: [
            this.PATAPI_PROXY + "/dbgroups",
            this.PATAPI_PROXY + "/dbgroups"
          ]
        },
        {
          key: "instruct",
          url: ["/api/report/instruct"]
        }
      ];
      let trueList = [];
      navList.forEach(item => {
        if (this.catalogues[item.key]) {
          trueList = _.concat(trueList, item.url);
        }
      });
      let list = trueList.map((item, i) => {
        let _params = {};
        if (item === this.PATAPI_PROXY + "/dbgroups") {
          _params = {
            words: "KWS=" + (i % 2 === 0 ? this.base_info.name : this.ylbm),
            sourceType: i % 2 === 0 ? "cn" : "all",
            accesstoken
          };
        } else if (
          [
            "/api/report/globalapproval?source=中国",
            "/api/report/globalapproval?source=中国台湾",
            "/api/report/globalapproval?source=美国",
            "/api/report/globalapproval?source=欧盟",
            "/api/report/globalapproval?source=日本",
            "/api/report/globalapproval?source=其他",
          ].includes(item)
        ) {
          _params = { ...params, englishname: this.base_info.englishname };
        } else if (["/api/report/pizhunHis"].includes(item)) {
          _params = params
        } else if ([
          "/api/report/development",
          "/api/report/developmentList"
        ].includes(item)) {
          _params = {
            drugid: this.drugid,
            pageSize: 10,
            page: 1,
            accesstoken
          }
        } else {
          _params = params;
        }
        return {
          url: item,
          params: _params
        };
      });
      console.log(list);
      let axiosList = list => {
        return window.Axios({
          method: "get",
          url: list.url,
          params: list.params
        });
      };
      let jzgj1 = {
        params: {
          page: 1,
          pageSize: 10,
          rname: "",
          target:
            this.base_info.targets_abbr && this.base_info.targets_abbr.length
              ? this.base_info.targets_abbr[0].name
              : this.base_info.target && this.base_info.target.length
                ? this.base_info.target[0].name
                : "",
          ck: 0,
          readid: parseInt(this.$route.params.id),
          accesstoken: GETCOOKIEFUN("accesstoken")
        },
        url: "/api/report/yfjd"
      },
        jzgj2 = {
          params: {
            page: 1,
            pageSize: 10,
            rname: "",
            target:
              this.base_info.targets_abbr && this.base_info.targets_abbr.length
                ? this.base_info.targets_abbr[0].name
                : this.base_info.target && this.base_info.target.length
                  ? this.base_info.target[0].name
                  : "",
            ck: 1,
            readid: parseInt(this.$route.params.id),
            accesstoken: GETCOOKIEFUN("accesstoken")
          },
          url: "/api/report/yfjd"
        },
        jzgjCompt = this.$refs.jzgj;
      if (jzgjCompt != undefined) {
        jzgj1.page = jzgjCompt.page;
        jzgj1.pageSize = jzgjCompt.pageSize;
        jzgj1.rname = jzgjCompt.rname;
        jzgj1.target = jzgjCompt.select;
        jzgj2.page = jzgjCompt.page;
        jzgj2.pageSize = jzgjCompt.pageSize;
        jzgj2.rname = jzgjCompt.rname;
        jzgj2.target = jzgjCompt.select;
      }
      list.push(jzgj1, jzgj2);
      let promiseList = list.map(item => axiosList(item));

      Promise.all(promiseList)
        .then(res => {
          this.pdfData = res.map(item => {
            let obj = {
              url: item.config.url,
              data: item.data.data
            };
            if (item.config.url.includes("yfjd")) {
              if (item.config.params.ck === 0) {
                obj["ck"] = 0;
              } else if (item.config.params.ck === 1) {
                obj["ck"] = 1;
              }
            }
            return obj;
          });
          setTimeout(() => {
            Store.commit("DrugReport/pdfHandlerStatus", true);
          }, 1000);
          // 这里 进行判断， isNew == true 使用新版导出
          if (isNew) {
            this.jspdfNew = true;
          } else {
            this.jspdf = true;
          }
        })
        .catch(err => {
          this.$Message.error("下载失败，请稍后再试");
          this.isloading = false;
        });
    },
    // ywbgLink(val) {
    //   window.ga("send", "event", "button", "click", "report_detail_righttop");
    //   window._paq.push([
    //     "trackEvent",
    //     "button",
    //     "click",
    //     "report_detail_righttop"
    //   ]);

    //   window.open("/newdrug/" + val);
    // },
    handleScroll() {
      const h = $(".detail-header").height();
      const h1 = $(".mian-inf").height();
      const scrollTop = $(".wrapper").offset().top;

      if (scrollTop < scri - h1 + 20) {
        $(".catalogues").css({
          top: h + 20 + 15 + 48,
          left: 10,
          position: "absolute"
        });
      } else {
        $(".catalogues").css({ top: 0, left: 0, position: "absolute" });
      }
    },
    onScroll() {
      window.addEventListener("scroll", this.handleScroll, true);
    },
    SwitchCatalogue(tab) {
      this.active_catalogue = tab;
    },
    //获取中国专利列表数据
    LoadCnListData() {
      window
        .Axios({
          method: "get",
          url: this.PATAPI_PROXY + "/dblist",
          params: {
            sort: 'publicationdate=desc',
            words: "KWS=" + this.base_info.name,
            sourceType: "cn",
            pageSize: 10,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            this.cnListRes = res.data.data;
          }
        });
    },
    //获取世界专利列表数据
    LoadAllListData() {
      window
        .Axios({
          method: "get",
          url: this.PATAPI_PROXY + "/dblist",
          params: {
            sort: 'publicationdate=desc',
            words: "KWS=" + this.ylbm,
            sourceType: "all",
            pageSize: 10,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            this.allListRes = res.data.data;
          }
        });
    },
    //获取美国专利列表数据
    LoadUsListData() {
      window
        .Axios({
          method: "get",
          url: "/api/report/patentus",
          params: {
            ylbm: this.ylbm,
            pageSize: 10,
            page: 1,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            this.usListRes = res.data.data;
          }
        });
    },
    //获取详情导航
    getNav() {
      window
        .Axios({
          method: "get",
          url: "/api/report/nav",
          params: {
            ylbm: this.ylbm,
            drugid: this.drugid,
            englishname: this.base_info.englishname,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          this.cate_loaded = true;
          if (res.data.code == 200 && res.data.data) {
            this.catalogues = res.data.data;
          }
        });
    },
    getDetail(id) {
      const _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/report/" + id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code == 200 && res.data.data) {
            let data = res.data.data;
            this.base_info = data;
            if (this.base_info.ename == null) this.base_info.ename = "";
            this.ylbm = data.ylbm;
            this.drugid = data.drugid
            let jzgjCompt = this.$refs.jzgj;
            let obj = {};
            if (jzgjCompt != undefined) {
              obj = {
                page: jzgjCompt.page,
                pageSize: jzgjCompt.pageSize,
                rname: jzgjCompt.rname,
                target: jzgjCompt.select,
                ck: 0,
                readid: id,
                accesstoken: GETCOOKIEFUN("accesstoken")
              };
              obj.page = jzgjCompt.page;
              obj.pageSize = jzgjCompt.pageSize;
              obj.rname = jzgjCompt.rname;
              obj.target = jzgjCompt.select;
            } else {
              obj.page = 1;
              obj.pageSize = 10;
              obj.rname = "";
              obj.target =
                data.targets_abbr && data.targets_abbr.length
                  ? data.targets_abbr[0].name
                  : data.target && data.target.length
                    ? data.target[0].name
                    : "";
            }
            Store.commit("DrugReport/yfjdParams", obj);
            this.getExtendList("report", data.extendList);
          }

          Promise.all([
            this.getNav(),
            this.LoadCnListData(),
            this.LoadAllListData(),
            this.LoadUsListData()
          ]).then(res => {
            this.$nextTick(() => {
              this.active_catalogue = $(".catalogues div:eq(0)").prop("id");
            });
            this.checkScreen();
          });
        });
    },
    // 获取atc的中文
    getAtc(name, arr) {
      let str = "";
      // console.log(name, arr[name][0].shuoming)
      // return false;
      if (arr) {
        for (let index in arr[name]) {
          str += arr[name][index].shuoming + " > ";
        }
        str = _.trimEnd(str, " > "); // 去除最后多余的" > "
      }

      return str;
    },
    getAtcName(name) {
      return name.replace(/\s+/g, "").split(";");
    },
    picLoadError(ev) {
      // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/general/no-drug-img.jpg";
    },
    checkScreen() {
      if (!$(".basic-info") != '' || $(".basic-info").length == 0) return;
      let basicInfoHeight = $(".main-p1").height(),
        img = $(".drug-img img");
      if (basicInfoHeight > 0) {
        img.css("padding", `${(basicInfoHeight - img.height()) / 2}px 0`);
      }

      $(".main-p1").css(
        "width",
        $(".main-p1-container").width() - $(".drug-img").width() - 50
      );
    }
  },
  created() {
    if (!this.nopms.xqy) {
      let id = this.$route.params.id;
      this.getDetail(id);
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
    this.$nextTick(() => {
      let timer = setTimeout(() => {
        if (!localStorage.getItem("showGlobaldrugsDetailGuide")) {
          this.showGlobaldrugsDetailGuide = true;
          this.getGuidLeft();
        }
        clearTimeout(timer);
      }, 0);
    });
    window.addEventListener('resize', () => {
      this.getGuidLeft();
    })
    Store.dispatch("DrugReport/getBaseInfo");
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        this.checkScreen();
      });
    });

    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
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
@import "~@/assets/less/app.less";
@import "~@/assets/less/detailCom.less";

.wrapper.drugreport-detail {
  /deep/ .el-table th {
    background-color: #f6f8fc;
  }

  /deep/ .el-table td,
  /deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #dfe5f1;
  }

  /deep/ .el-table thead th>.cell {
    justify-content: center;
    height: 34px;
    line-height: 34px;
  }

  /deep/.left-bottom {
    margin-top: 0 !important;
  }

  /deep/.bottom-name {
    height: 13px !important;
    line-height: 13px !important;
  }

  /deep/.el-loading-spinner {
    margin-top: -14px;
  }

  .left-top {
    align-items: center;
    width: unset !important;
  }

  .detail-list {
    padding-bottom: 20px;
    height: 100%;
    min-height: calc(100vh - 68px);

    .detail-header {
      align-items: center;

      .header-left {
        align-items: center;
      }

      .drug-icon {
        height: 40px;
        align-self: center;
      }

      .icon-head {
        display: flex;
        align-items: flex-end;
        margin-right: 10px;
        color: @Blue;
        line-height: 1;
        white-space: nowrap;
      }

      .icon-dui {
        color: @Green;
      }

      .header-right {
        display: flex;
        align-items: center;

        .ywbg {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .ywbg-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 6px;
            height: 28px;
            width: 106px;
            font-size: 14px;
            background: #4877e8;
            color: #fff;
            line-height: 28px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;

            span {
              margin-left: 8px;
            }

            &:hover {
              opacity: 0.9;
            }
          }
        }

        .detail-header .header-left .left-top {
          width: unset !important;
        }

        .el-breadcrumb {
          display: inline-flex;
          white-space: nowrap;
          margin-left: 30px !important;
        }
      }
    }

    .mian-inf {
      border-radius: 4px;
      position: relative;
      padding: 10px;
      box-shadow: @BoxShadow;
      background-color: #fff;

      .main-p1-container {
        display: inline-flex;
        width: 100%;
        align-items: center;

        .main-p1 {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          padding-bottom: 20px;
          display: inline-flex;
          flex-wrap: wrap;

          .kj-navs {
            max-height: 78px;
            overflow: hidden;

            .kj-nav {
              position: relative;
              display: inline-block;
              height: 50px;
              width: 35px;
              padding: 14px 27px 14px 70px;
              margin-right: 16px;
              font-size: 16px;
              text-decoration: none;
              background-color: #eff2fa;
              border-radius: 5px;

              .icon-wap {
                position: absolute;
                left: 12px;
                top: 14px;
                width: 50px;
                height: 50px;
                line-height: 50px;
                border-radius: 50%;
                text-align: center;
                background-color: #c7cee1;

                .iconfont {
                  color: #fff;
                  font-size: 28px;
                }
              }

              &.active,
              &:hover {
                color: #fff;
                background-color: @PrimaryColor;

                .icon-wap {
                  background-color: #fff;

                  .iconfont {
                    color: @PrimaryColor;
                    font-size: 28px;
                  }
                }
              }
            }
          }

          .basic-info {
            padding: 10px 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            flex-direction: column;
            height: fit-content;

            &:nth-child(2) {
              max-width: 400px;
            }

            @media screen and (max-width: 1920px) {
              padding: 0 20px;
            }

            li {
              display: flex;
              line-height: 30px;
              color: #545b6d;
              font-size: 16px;
              width: calc((100%) / 2);
              position: relative;

              @media screen and (max-width: 1920px) {
                width: 700px;
              }

              &:nth-child(odd) {
                min-width: 800px;
                max-width: 1000px;

                @media screen and (max-width: 1920px) {
                  max-width: unset;
                }
              }

              &:before {
                content: " ";
                position: absolute;
                left: -12px;
                top: 12px;
                width: 4px;
                height: 4px;
                background-color: #545b6d;
                border-radius: 50%;
              }

              @media screen and (max-width: 1920px) {
                // width: calc(100vw - 500px);
                min-width: 700px;
              }

              >label {
                display: flex;
                width: 120px;
                font-size: 14px;
                height: inherit;
                white-space: nowrap;
                font-weight: 600;
              }

              .atc-fl {
                max-width: 650px;
                float: left;
                height: auto;
              }

              span {
                display: inline-flex;
                justify-content: space-between;
                max-width: 680px;
                color: @FontColor;
                height: inherit;
                font-size: 14px;

                @media screen and (max-width: 1920px) {
                  max-width: 680px;
                }
              }

              a {
                color: @PrimaryColor;
                padding-right: 5px;
                font-size: 14px;
              }

              .icon-dui {
                color: @Green;
                padding-left: 5px;
              }
            }
          }
        }

        .drug-img {
          display: flex;
          align-items: center;
          border: 1px solid #dfe5f1;
          text-align: center;
          border-radius: 4px;
          position: relative;
          cursor: pointer;

          img {
            width: auto;
            max-width: 500px;
            height: 140px;
          }
        }

        .slide-lan /deep/.content {
          padding: 0;
          width: 100%;
          border: none;
        }
      }

      .main-p2 {
        .summary {
          display: flex;
          align-items: center;
          position: relative;
          box-sizing: border-box;
          padding: 20px 30px 20px 0px;
          width: 100%;
          background-color: @PrimaryBackgroundColor;

          h4 {
            width: 24px;
            padding: 10px;
            background-color: @PrimaryColor;
            color: @White;
          }

          .summary-info {
            padding-left: 20px;
            flex: 1;
            font-size: 13px;
            line-height: 26px;
          }
        }
      }
    }

    .classified {
      position: relative;
      margin-top: 10px;

      .catalogues {
        position: absolute;
        left: 0;
        top: 0;

        .catalogue {
          box-sizing: border-box;
          width: 180px;
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          border-left: 4px solid @PrimaryBackgroundColor;
          border-bottom: 1px solid #dfe5f1;
          cursor: pointer;
          font-size: 14px;
          border-radius: 0 4px 4px 0;
          position: relative;

          &.active,
          &:hover {
            // border-left: 4px solid @PrimaryColor;
            background-color: #fff;
            box-shadow: @BoxShadow;
            // border-bottom: 1px dashed transparent;
          }

          &.active::before,
          &:hover::before {
            content: "";
            width: 4px;
            height: 40px;
            background: #4877e8;
            box-shadow: 0px 2px 4px 0px rgba(216, 226, 250, 0.5);
            border-radius: 4px;
            position: absolute;
            left: -4px;
          }
        }
      }

      .classified-info {
        // box-shadow: @BoxShadow;
        margin-left: 190px;
        background-color: @White;
        min-height: 200px;
      }
    }
  }

  // 新手引导样式
  .new-guide {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    min-width: 1280px;
    // background: rgba(0, 0, 0, 0.3)

    .fadeInUp {
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        -webkit-transform: translate3d(0, 45%, 0);
        transform: translate3d(0, 45%, 0);
      }

      to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
      }
    }

    .guide-bg {
      box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      position: absolute;
    }

    .guide-step0 {
      width: 460px;
      height: 200px;
      padding: 40px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 4px;
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%);
      margin-left: 0 !important;
    }

    .guide-content0 {
      display: flex;
      align-items: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 88px;
        height: 112px;
        margin-right: 30px;
      }

      .info {
        h4 {
          font-size: 20px;
          font-weight: 600;
          color: #182462;
          margin-bottom: 10px;
          line-height: 20px;
        }

        p {
          font-size: 16px;
          line-height: 16px;
          color: #666666;
          margin-bottom: 20px;
        }

        &-footer {
          display: flex;
          align-items: center;

          div {
            width: 100px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            background: #3556b9;
            border-radius: 4px;
            font-size: 16px;
            color: #ffffff;
            margin-right: 20px;
            cursor: pointer;
          }

          span {
            font-size: 14px;
            color: #666666;
            cursor: pointer;
          }
        }
      }
    }

    .guide-step1 {
      width: 645px;
      height: 40px;
    }
  }
}

.left-bottom {
  margin-left: 0 !important;
}

.t-line6 {
  max-height: 150px;
  overflow-y: auto;
}

.overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 60px;
  word-break: break-all;

  @media screen and (max-width: 1920px) {
    width: calc(100vw - 500px);
    min-width: 500px;
  }
}

/deep/.classified {
  min-height: 100% !important;
}

.top-id {
  min-width: 100px;
}
</style>
