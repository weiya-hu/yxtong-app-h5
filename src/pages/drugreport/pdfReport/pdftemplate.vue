<template>
  <div style="position: relative; top: 2000px">
    <div class="pdf-wrap" id="pdfBox" ref="pdfBox">
      <div id="pdf-part1">
        <div class="pdf-header">
          <div class="pdf-header-logo">
            <img class="logo" src="~@/assets/imgs/login-sign.jpg" />
            <div class="middle-logo m-logo">
              <div class="logo-zh">药智数据企业版</div>
              <div class="logo-url">vip.yaozh.com</div>
            </div>
            <div class="middle-logo s-logo">智能决策，洞见未来</div>
          </div>
          <div class="pdf-header-datetime">
            <span>{{ date }}</span>
            <span>{{ time }}</span>
          </div>
        </div>

        <div class="pdf-content">
          <div class="section">
            <div class="pdf-title pdf-title-zh" v-if="infoData.name">{{ infoData.name }}药物报告</div>
            <div
              class="pdf-title pdf-title-en"
              v-if="infoData.englishname"
            >{{ infoData.englishname }} Drug Report</div>

            <div class="pdf-catalog">
              <div class="pdf-catalog-title">
                <span>内容大纲</span>
              </div>
              <div class="pdf-catalog-page">
                <div class="pdf-catalog-item" v-for="(item, i) in catalogList" :key="i">
                  <span>PART {{ i > 8 ? i + 1 : `0${i + 1}` }}</span>
                  <span class="line"></span>
                  <span style="width:150px">{{ item }}</span>
                  <!-- <div class="pdf-catalog-item-child" v-if="item === '基本概述'">
              <span>{{i+1}}.1</span>
              <span class="line"></span>
              <span>API信息</span>
            </div>
            <div class="pdf-catalog-item-child" v-if="item === '基本概述'">
              <span>{{i+1}}.2</span>
              <span class="line"></span>
              <span>API信息</span>
                  </div>-->
                </div>
              </div>
            </div>
          </div>
          <div class="pdf-name-wrap">
            <img class="pdf-name-img" src="/static/imgs/general/drug-icon.png" alt />
            <div class="name-zh">
              <span class="top-id" :title="infoData.name ? infoData.name : infoData.englishname">
                {{
                  infoData.name ? infoData.name : infoData.englishname
                }}
              </span>
              <span v-if="infoData.zgss" class="icon-head">
                <!-- <i class="iconfont">&#xe66d;</i> -->
                &nbsp;中国上市&nbsp;
              </span>
              <span v-if="infoData.higheststatus" class="icon-head">
                <!-- <i class="iconfont">&#xe63a;</i> -->
                &nbsp;{{ infoData.higheststatus || "/" }}&nbsp;
                <!-- <i class="iconfont icon-dui">&#xe634;</i> -->
              </span>
            </div>
            <div class="name-en" v-if="infoData.name">{{ infoData.englishname || "/" }}</div>
          </div>

          <!-- 多数据详情 -->
          <div class="main-p1-container">
            <div class="main-p1">
              <ul class="basic-info">
                <li>
                  <label>药物别名：</label>
                  <span
                    style="word-break: break-all"
                    :title="infoData.ename"
                  >{{ infoData.ename || "/" }}</span>
                </li>
                <li>
                  <label>药物类型：</label>
                  <span>{{ infoData.leixing2 || "/" }}</span>
                </li>
                <li>
                  <label>原研单位：</label>
                  <span>{{ infoData.originatorcompany || "/" }}</span>
                </li>
                <li>
                  <label>全球最高状态：</label>
                  <span v-if="infoData.higheststatus">{{ infoData.higheststatus || "/" }}</span>
                </li>
                <li>
                  <label>中国上市：</label>
                  <span>
                    {{
                      infoData.chinamarked == ""
                        ? "/"
                        : infoData.chinamarked == 1
                          ? "是"
                          : "否"
                    }}
                  </span>
                </li>
                <li>
                  <label>
                    中国1类新药：
                    <el-tooltip effect="light" placement="left">
                      <div slot="content">中国新注册分类（2016版化药和2020版生物药）中的1类新药</div>
                      <span></span>
                    </el-tooltip>
                  </label>
                  <span>{{ infoData.zclx1 || "/" }}</span>
                </li>
                <li v-if="infoData.compound && infoData.compound != '否'">
                  <label>复方药：</label>
                  <span>{{ infoData.compound || "/" }}</span>
                </li>
              </ul>
            </div>
            <div class="drug-img">
              <img
                v-if="infoData.structpicture"
                :src="`${infoData.structpicture}?date=${new Date().getTime()}`"
                @error="picLoadError"
                crossorigin="anonymous"
              />
              <img v-else src="/static/imgs/general/no-drug-img.jpg" />
            </div>
          </div>
        </div>

        <div class="pdf-item" v-if="infoData.yaowugaishu">
          <div class="pdf-item-title">药物概述</div>
          <div class="pdf-item-text">{{ infoData.yaowugaishu }}</div>
        </div>
        <div class="pdf-item" v-if="showJBXX() == true">
          <div class="pdf-item-title">基本信息</div>
          <DetailJbxx :res="infoData" :extendList="extendList" :jspdf="jspdf" />
        </div>

        <div
          class="pdf-item"
          v-if="
            (Object.values(this.infoData.api).every(
              (item) => item != '' && item != null
            ) &&
              this.infoData.api != '') ||
            (this.infoData.cas != '' && this.infoData.cas != null)
          "
        >
          <div class="pdf-item-title">API信息</div>
          <DetailAPIJbxx :extendList="extendList" :jspdf="jspdf" :res="infoData"></DetailAPIJbxx>
        </div>
        <div class="pdf-item" v-if="isShowYxx(infoData)">
          <div class="pdf-item-title">药效学/药动学</div>
          <DetailYxx :extendList="extendList" :jspdf="jspdf" :res="infoData"></DetailYxx>
        </div>
        <div class="pdf-item" v-if="infoData.target.length > 0 || infoData.targets_abbr.length > 0">
          <div class="pdf-item-title">竞争格局（靶点）</div>
          <DetailJzgj :which="0" :moreData="moreData" :jspdf="jspdf"></DetailJzgj>
        </div>

        <div class="pdf-item" v-if="catalogues.developmentstatus > 0">
          <div class="pdf-item-title">适应症进展</div>
          <DetailIndication
            :jspdf="jspdf"
            :drugid="drugid"
            :extendList="extendList"
            :initData="developmentList"
            :initEchartData="developmentEchart"
          />
        </div>

        <div class="pdf-item" v-if="catalogues.zhuce > 0">
          <div class="pdf-item-title">中国注册申报</div>
          <DetailZhuce
            :jspdf="jspdf"
            :ylbm="ylbm"
            :extendList="extendList"
            :initData="zhuceList"
            :initEchartData="zhuceEchart"
          />
        </div>
      </div>

      <div id="pdf-part2">
        <div class="pdf-item" v-if="catalogues.clinical > 0">
          <div class="pdf-item-title">临床试验</div>
          <DetailClinical :jspdf="jspdf" :extendList="extendList" :initData="clinicalList" />
        </div>
        <div class="pdf-item" v-if="catalogues.sspz > 0">
          <div class="pdf-item-title">上市批准</div>
          <DetailSspz
            ref="detailSSPZ"
            :jspdf="jspdf"
            :ylbm="ylbm"
            :extendList="extendList"
            :sspzchina="sspzchina"
            :sspztw="sspztw"
            :sspzus="sspzus"
            :sspzeu="sspzeu"
            :sspzjp="sspzjp"
            :sspzother="sspzother"
            :pizhunHis="pizhunHis"
          />
        </div>
        <div class="pdf-item" v-if="catalogues.ypxs > 0">
          <div class="pdf-item-title">市场销售</div>
          <DetailYpxs
            :jspdf="jspdf"
            :extendList="extendList"
            :info="infoData"
            :ypxsEchart="ypxsEchart"
            :ypxsList="ypxsList"
            :yyxsEchart="yyxsEchart"
            :yyxsList="yyxsList"
          />
        </div>
      </div>

      <div id="pdf-part3">
        <div class="pdf-item" v-if="catalogues.biaozhun > 0">
          <div class="pdf-item-title">药品标准</div>
          <DetailBiaozhun
            :jspdf="jspdf"
            :extendList="extendList"
            :drugStandard="drugStandard"
            :allCount="catalogues.biaozhun"
          />
        </div>
        <div class="pdf-item" v-if="catalogues.instruct > 0">
          <div class="pdf-item-title">药品说明书</div>
          <DetailInstruct
            :jspdf="jspdf"
            :extendList="extendList"
            :ylbm="ylbm"
            :instruct="instruct"
          />
        </div>

        <div class="pdf-item" v-if="catalogues.yaopinzhongbiao > 0">
          <div class="pdf-item-title">中标信息</div>
          <DetailYaopinzhongbiao
            :jspdf="jspdf"
            :extendList="extendList"
            :yaopinzhongbiao="yaopinzhongbiao"
          />
        </div>
        <div class="pdf-item" v-if="showZLBJ()">
          <div class="pdf-item-title">专利布局</div>
          <DetailPatent
            :jspdf="jspdf"
            :extendList="extendList"
            isPdf
            :res="infoData"
            :ylbm="ylbm"
            :dbgroupscn="dbgroupscn"
            :dbgroupsall="dbgroupsall"
            :cnListRes="cnListRes"
            :usListRes="usListRes"
            :allListRes="allListRes"
          />
        </div>
        <div class="pdf-item" v-if="extendList.length > 0">
          <div class="pdf-item-title">扩展信息</div>
          <DetailKzxx :extendList="extendList"></DetailKzxx>
        </div>

        <div class="bottom">
          <div class="fl-left">
            <div class="pdf-header-logo bottom-logo">
              <img class="logo" src="@/assets/imgs/login-sign.jpg" />
              <div class="middle-logo m-logo">
                <div class="logo-zh">药智数据企业版</div>
                <div class="logo-url">vip.yaozh.com</div>
              </div>
              <div class="middle-logo s-logo">智能决策，洞见未来</div>
            </div>

            <p>更多药物报告尽在药智数据企业版</p>
            <p>
              还可定制化服务，报告咨询热线：
              <span class="cl-blue">400-678-0778</span>
            </p>
          </div>
          <div class="fl-right">
            <div class="fl-left code-box">
              <img src="~@/assets/imgs/yzx/app_code.png" />
              <span style="height: auto">扫码下载APP</span>
            </div>
            <div class="fl-left code-box">
              <img src="~@/assets/imgs/yzx/gzh_code.png" />
              <span style="height: auto">扫码关注公众号</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import jspdf from "@/mixins/jspdf_core.js";
import DetailAPIJbxx from "../detail/apijbxx";
import DetailYxx from "../detail/yxx";
import DetailJzgj from "../detail/jzgj";
import DetailPinn from "../detail/pinndetail";
import DetailJbxx from "../detail/jbxx";
import DetailZhuce from "../detail/zhuce";
import DetailIndication from "../detail/indication";
import DetailClinical from "../detail/clinical";
import DetailSspz from "../detail/sspz";
import DetailBiaozhun from "../detail/biaozhun";
import DetailYpxs from "../detail/ypxs";
import DetailYaopinzhongbiao from "../detail/yaopinzhongbiao";
import DetailPatent from "../detail/patent";
import DetailInstruct from "../detail/instruct";
import DetailKzxx from "../detail/kzxx";
import { mapGetters, mapState } from "vuex";
import Axios from "axios";
import md from "@/md";

export default {
  components: {
    DetailKzxx,
    DetailAPIJbxx,
    DetailYxx,
    DetailJzgj,
    LoadingGif,
    DetailPinn,
    DetailJbxx,
    DetailZhuce,
    DetailClinical,
    DetailSspz,
    DetailBiaozhun,
    DetailYpxs,
    DetailYaopinzhongbiao,
    DetailPatent,
    DetailInstruct,
    DetailIndication
  },
  props: {
    extendList: Array,
    jspdf: {
      type: Boolean,
    },
    isPinn: {
      type: Boolean,
    },
    infoData: {
      type: Object,
    },
    moreData: {
      type: Array,
    },
    catalogues: {
      type: Object,
    },
    cnListRes: {
      type: Object,
    },
    usListRes: {
      type: Object,
    },
    allListRes: {
      type: Object,
    },
    ylbm: {
      type: String,
    },
    drugid: {
      type: String
    }
  },
  mixins: [jspdf],
  data() {
    return {
      imgs: [],
      isloading: false,
      zhuceList: {},
      zhuceEchart: {},
      clinicalList: {},
      sspzchina: {},
      sspztw: {},
      sspzus: {},
      sspzeu: {},
      sspzjp: {},
      sspzother: {},
      pizhunHis: {},
      jzgj1: [],
      jzgj2: [],
      drugStandard: {},
      ypxsEchart: {},
      ypxsList: {},
      yyxsEchart: {},
      yyxsList: {},
      yaopinzhongbiao: {},
      dbgroupscn: {},
      dbgroupsall: {},
      instruct: {},
      developmentList: {},
      developmentEchart: []
    };
  },
  computed: {
    ...mapState({
      yfjdParams: (state) => state.DrugReport.yfjdParams,
    }),
    isAPI() {
      let status = false;
      status =
        this.infoData.chemicalname == "" ||
        this.infoData.cas == "" ||
        this.infoData.cas == "" ||
        this.infoData.formulaweight == "";
      return status;
    },
    fullDate() {
      let date = new Date(),
        fullDate = date.toLocaleString("chinese", { hour12: false }),
        fullDateArr = fullDate.split(" ");
      return fullDateArr;
    },
    date() {
      return this.fullDate[0];
    },
    time() {
      return this.fullDate[1];
    },
    catalogList() {
      let list = [
        {
          key: "apijbxx",
          val: "API信息",
        },
        {
          key: "jzgj1",
          val: "竞争格局",
        },
        {
          key: "jzgj2",
          val: "竞争格局",
        },
        {
          key: "developmentstatus",
          val: "适应症进展",
        },
        {
          key: "zhuce",
          val: "中国注册申报",
        },
        {
          key: "clinical",
          val: "临床试验",
        },
        {
          key: "sspz",
          val: "上市批准",
        },
        {
          key: "ypxs",
          val: "市场销售",
        },
        {
          key: "biaozhun",
          val: "药品标准",
        },
        {
          key: "instruct",
          val: "药品说明书",
        },
        {
          key: "yaopinzhongbiao",
          val: "中标信息",
        },
      ];
      let trueList = ["药物概述"];
      if (this.showJBXX() == true) {
        trueList.push("基本信息");
      }
      if (
        (Object.values(this.infoData.api).every(
          (item) => item != "" && item != null
        ) &&
          this.infoData.api != "") ||
        (this.infoData.cas != "" && this.infoData.cas != null)
      ) {
        trueList.push("API信息");
      }
      if (this.isShowYxx(this.infoData) == true) {
        trueList.push("药效学/药动学");
      }
      if (
        this.infoData.target.length > 0 ||
        this.infoData.targets_abbr.length > 0
      ) {
        trueList.push("竞争格局（靶点）");
      }
      list.forEach((item, index) => {
        if (this.catalogues[item.key] > 0) {
          trueList.push(item.val);
        }
      });
      if (this.showZLBJ() == true) {
        trueList.push("专利布局");
      }
      if (this.extendList.length > 0) {
        trueList.push("扩展信息");
      }
      return trueList;
    },
  },
  created() {
    let obj = {
      zhuceEchart: "/api/report/zhuce",
      zhuceList: "/api/report/zhucelist",
      developmentList: "/api/report/developmentList",
      developmentEchart: "/api/report/development",
      clinicalList: "/api/report/clinicallist",
      sspzchina: "/api/report/globalapproval?source=中国",
      sspztw: "/api/report/globalapproval?source=中国台湾",
      sspzus: "/api/report/globalapproval?source=美国",
      sspzeu: "/api/report/globalapproval?source=欧盟",
      sspzjp: "/api/report/globalapproval?source=日本",
      sspzother: "/api/report/globalapproval?source=其他",
      pizhunHis: "/api/report/pizhunHis",
      drugStandard: "/api/report/drugStandard",
      ypxsEchart: "/api/report/ypxs",
      ypxsList: "/api/report/ypxslist",
      yyxsEchart: "/api/report/yyxs",
      yyxsList: "/api/report/yyxslist",
      yaopinzhongbiao: "/api/report/yaopinzhongbiao",
      instruct: "/api/report/instruct",
    };

    this.dbgroupscn = _.find(this.moreData, (o) => {
      return o.url === this.PATAPI_PROXY + "/dbgroups" && o.data.ATP;
    });
    this.dbgroupsall = _.find(this.moreData, (o) => {
      return o.url === this.PATAPI_PROXY + "/dbgroups" && o.data.COT;
    });

    _.forIn(obj, (val, key) => {
      let findObj = _.find(this.moreData, { url: val });
      if (findObj) {
        if (Array.isArray(findObj.data)) {
          this[key] = findObj.data.length > 0 ? findObj.data : {};
        } else {
          this[key] = findObj.data;
        }
      }
    });
  },
  watch: {
    imgs: {
      handler(newVal, oldVal) {
        this.imgs = newVal;
      },
      deep: true,
    },
  },
  methods: {
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
    showJBXX() {
      if (
        this.infoData.target_unique.length > 0 ||
        this.infoData.targets_abbr.length > 0 ||
        this.infoData.indication_pizhun ||
        this.infoData.indication ||
        this.infoData.inactiveindications_cn ||
        this.infoData.atc ||
        this.infoData.mechanism_of_action ||
        this.infoData.pharmacodynamics ||
        this.infoData.yaodongxue ||
        this.infoData.othercompany.length > 0 ||
        this.infoData.wikiurl ||
        this.infoData.drugbankurl ||
        this.infoData.keggurl
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
        (this.usListRes.count > 0 ||
          this.cnListRes.totle > 0 ||
          this.allListRes.totle > 0)
      ) {
        return true;
      } else {
        return false;
      }
    },
    picLoadError(ev) {
      // 图片加载失败，切换为默认图
      ev.target.src = "/static/imgs/general/no-drug-img.jpg";
    },
    checkScreen() {
      if (!$(".basic-info") || $(".basic-info").length == 0) return;
      let basicInfoHeight = $(".main-p1").height(),
        img = $(".drug-img img");
      if (basicInfoHeight > 0) {
        img.css("padding", `${(basicInfoHeight - img.height()) / 2 + 10}px 0`);
      }
    },
  },
  async mounted() {
    this.$nextTick(() => {
      this.checkScreen();
    });
    setTimeout(async () => {
      await this.init({
        fontfaces: [
          "Helvetica Neue",
          "Helvetica",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "Noto Sans CJK SC",
          "WenQuanYi Micro Hei",
          "Arial",
          "sans-serif",
        ],
      });
      let box = await this.$refs.pdfBox;

      await this.generate(
        box,
        `${this.infoData.name || this.infoData.englishname
        }-药智数据企业版药物报告`
      );
      this.$emit("update:jspdf", false);
      this.$emit("update:isloading", false);
    }, 1400);
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";
@import "../css/com.less";
@textColor: #545b6d;
.center() {
  text-align: center;
}
.cl-blue {
  color: @Blue;
}
.pdf-wrap {
  position: relative;
  width: 900px;

  // top: 2500px;
  //   margin-left: -450px;
  background: #fff;
  font-size: 13px;
  padding: 24px;

  /* height: 700px;
  overflow: auto; */
}
.pdf-page {
  //   position: absolute;
  //   top: 1320px;
  font-size: 13px;
  .center();
}
.pdf-content {
  margin-top: 100px;
  text-align: center;
}
.pdf-catalog {
  min-height: 1000px;
  margin-top: 60px;
  .pdf-catalog-title {
    position: relative;
    height: 70px;
    .center();
    span {
      //   position: absolute;
      background: #fff;
      padding: 0 20px;
      font-size: 45px;
      color: @Blue;
      .center();
    }
    // &:before {
    //   content: "";
    //   position: absolute;
    //   .center();
    //   top: 50%;
    //   width: 40%;
    //   height: 1px;
    //   background: @Blue;
    // }
  }
  .pdf-catalog-page {
    margin-top: 50px;
  }
  .pdf-catalog-item {
    font-size: 24px;
    margin: 20px auto;
    width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pdf-catalog-item-child {
      margin-left: 70px;
      font-size: 16px;
      span {
        margin-right: 5px;
      }
    }
    .line {
      width: 250px;
      height: 3px;
      display: inline-block;
      vertical-align: middle;
      background: url(~@/assets/imgs/pdf/dashed.png);
    }
  }
}
.pdf-header {
  //   position: absolute;
  top: 0;
  .center();
  width: 900px;
  padding: 0 0 5px 0;
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: 0;
    background: #ccc;
  }
  .pdf-header-datetime {
    float: right;
    font-size: 16px;
    margin-top: 8px;
    span {
      line-height: 16px;
      margin-left: 6px;
    }
  }
}
.pdf-header-logo {
  float: left;
  color: #2e4873;
  text-align: left;
  position: relative;
  padding-left: 35px;
  .logo {
    position: absolute;
    width: 29px;
    height: 29px;
    left: 0;
    top: 0;
  }
  .middle-logo {
    display: inline-block;
    vertical-align: middle;
  }
  .logo-zh {
    font-size: 16px;
  }
  .logo-url {
    font-size: 13px;
  }
  .m-logo {
    position: relative;
    &:before {
      content: "";
      position: absolute;
      height: 22px;
      width: 1px;
      background: @textColor;
      right: -11px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .s-logo {
    font-size: 18px;
    margin-left: 20px;
    line-height: 20px;
  }
  div {
    line-height: 16px;
  }
}
.pdf-title {
  color: @textColor;
  text-align: center;
  font-weight: bold;
}
.pdf-title-en {
  line-height: 16px;
}
.pdf-title-zh {
  font-size: 32px;
}
.pdf-title-en {
  font-size: 28px;
}
.pdf-name-wrap {
  padding: 18px 15px;
  border: 1px solid #ccc;
  margin-top: 28px;
  // background: url(/static/imgs/general/drug-icon.png) no-repeat 16px center;
  text-align: left;
  padding-left: 78px;
  position: relative;
  .pdf-name-img {
    position: absolute;
    top: 15px;
    left: 18px;
  }
  .name-zh {
    font-size: 23px;
    color: @Blue;
    .icon-head {
      font-size: 13px;
    }
    .icon-dui {
      color: @Green;
      vertical-align: middle;
    }
  }
  .name-en {
    font-size: 15px;
  }
}
.main-p1-container {
  display: inline-flex;
  width: 100%;
  align-items: center;
  .main-p1 {
    border: 1px solid #ccc;
    border-top: none;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 20px;
    display: inline-flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    .icon-dui {
      color: @Green;
      vertical-align: middle;
      margin-left: 5px;
    }
    .basic-info {
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex: 1;
      flex-direction: column;
      height: fit-content;
      text-align: left;
      li {
        display: flex;
        line-height: 30px;
        color: #545b6d;
        font-size: 16px;
        width: 100%;
        position: relative;
      }
      label {
        display: flex;
        width: 110px;
        font-size: 13px;
        height: inherit;
        white-space: nowrap;
      }
      span {
        display: inline-block;
        width: 450px;
        color: @FontColor;
        height: inherit;
        font-size: 13px;
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
    img {
      width: auto;
      max-width: 300px;
      height: 140px;
    }
  }
}
.pdf-item-title {
  color: @Blue;
  font-size: 22px;
  line-height: 20px;
  padding-left: 8px;
  font-weight: bold;
  position: relative;
  margin-bottom: 10px;
  &:before {
    content: "";
    position: absolute;
    height: 100%;
    width: 3px;
    background: @Blue;
    left: -2px;
    top: 0;
  }
}
.pdf-item {
  margin-top: 24px;
  white-space: normal;
  /deep/.slide-section {
    box-shadow: unset;
    .header {
      background: #fff;
      .lc {
        color: @Blue;
        border-left: 3px solid @Blue;
        padding-left: 8px;
        line-height: 18px;
        font-size: 20px;
        margin-left: 0;
      }
    }
    .content {
      padding: 10px 0 0 0;
    }
  }
  /deep/.table-left-head {
    margin: 0;
    width: 100%;
    tr {
      td {
        font-size: 16px;
      }
    }
  }
  /deep/.detail-items {
    .detail-item {
      .item-title {
        border: none;
        padding: 0;
        .text {
          border: none;
          color: @textColor;
          font-size: 16px;
        }
      }
    }
    .mt30 {
      margin: 0;
    }
  }
}
.pdf-item-text {
  text-indent: 2em;
  margin-top: 8px;
  font-size: 16px;
}
.fl-left {
  float: left;
}
.fl-right {
  float: right;
}
.code-box {
  margin-right: 20px;
  span,
  img {
    display: block;
    width: auto;
    height: 100px;
    text-align: center;
  }
  img {
    margin: auto;
  }
  span {
    font-size: 13px;
  }
}
.bottom {
  margin-top: 70px;
  padding: 30px 80px 0 80px;
  height: 110px;
  font-size: 13px;
  border-top: 1px solid #ccc;
  p {
    font-size: 16px;
    line-height: 16px;
    margin: 5px 0;
  }
}
.bottom-logo {
  margin-bottom: 13px;
  float: unset;
}
@media screen and (min-width: 1401px) and (max-width: 1600px) {
  /deep/.slide-section {
    .content {
      .tb-wrap,
      .extend-list {
        padding: 0;
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  /deep/.slide-section {
    .content {
      .tb-wrap,
      .extend-list {
        padding: 0;
      }
    }
  }
}

/deep/.left-bottom {
  margin-top: 0 !important;
}
/deep/.bottom-name {
  height: 13px !important;
  line-height: 13px !important;
}
.left-top {
  align-items: center;
}
.detail-list {
  padding-bottom: 20px;

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
    }
    .icon-dui {
      color: @Green;
    }

    .header-right {
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
          font-size: 13px;
          background: #4877e8;
          color: #fff;
          line-height: 28px;
          border-radius: 6px;
          cursor: pointer;

          span {
            margin-left: 8px;
          }
          &:hover {
            opacity: 0.9;
          }
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
        padding: 13px 0;
        padding-left: 20px;
        border-left: 4px solid @PrimaryBackgroundColor;
        border-bottom: 1px dashed #dfe5f1;
        cursor: pointer;
        font-size: 13px;
        border-radius: 0 4px 4px 0;
        &.active,
        &:hover {
          border-left: 4px solid @PrimaryColor;
          background-color: #fff;
          box-shadow: @BoxShadow;
          border-bottom: 1px dashed transparent;
        }
      }
    }
    .classified-info {
      box-shadow: @BoxShadow;
      margin-left: 190px;
      background-color: @White;
      min-height: 200px;
    }
  }
}
.wrapper {
  .detail-list {
    .header-right {
      .ywbg {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 5px;
        .ywbg-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 6px;
          height: 28px;
          width: 106px;
          font-size: 13px;
          background: #4877e8;
          color: #fff;
          line-height: 28px;
          border-radius: 4px;
          cursor: pointer;

          span {
            margin-left: 8px;
          }
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
    .main {
      .part0 {
        .fenzi {
          display: inline-block;
          color: #4877e8;
          margin-right: 10px;
        }
        .s-color {
          display: inline-block;
          width: 124px;
          margin-right: 10px;
          line-height: 19px;
          border-radius: 10px;
          text-align: center;
          background: #f2f2f2;
          color: #36364b;
        }
        .s-color1 {
          background: #91c332;
          color: #fff;
        }
        .s-color2 {
          background: #4877e8;
          color: #fff;
        }
        .s-color3,
        .s-color4 {
          background: #638beb;
          color: #fff;
        }
        .s-color5,
        .s-color6 {
          background: #91adf1;
          color: #fff;
        }
        .s-color7,
        .s-color8 {
          background: #acc2f5;
          color: #fff;
        }
        .s-color9,
        .s-color10 {
          background: #c8d6f8;
          color: #36364b;
        }
        .s-color11 {
          background: #e4ebfb;
          color: #36364b;
        }
        .s-color12 {
          background: #ff9a75;
          color: #fff;
        }
        .s-color13 {
          background: #fbc78e;
          color: #fff;
        }
        .s-color14,
        .s-color15,
        .s-color17 {
          background: #f2f2f2;
          color: #36364b;
        }
        .s-color16 {
          background: #56596c;
          color: #fff;
        }
      }
      .part1 {
        .nav-switch {
          display: flex;
          justify-content: center;

          ul {
            display: flex;
            padding: 0 100px;
            border-bottom: 3px solid #4877e8;

            li {
              width: 120px;
              text-align: center;
              font-size: 13px;
              height: 28px;
              line-height: 28px;
              cursor: pointer;
            }
            li.active {
              background: #4877e8;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.el-pagination {
  padding-bottom: 0;
}
.sixe13 {
  font-size: 13px;
}
.choose-opt {
  margin-top: 30px;
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-start;
  position: relative;
  label {
    margin-right: 8px;
    line-height: 30px;
    font-size: 13px;
  }
  .sp-r {
    color: #999;
    position: absolute;
    right: 0;
    line-height: 30px;
  }
  .title-box1 {
    width: 240px;
    margin-right: 20px;
  }
  /deep/.el-select,
  /deep/.el-autocomplete {
    width: 100%;
  }
  /deep/.el-input__icon {
    padding-right: 6px;
    line-height: 30px;
    cursor: pointer;
  }
}

.nodata-box {
  // position: absolute;
  // top: 0;
  // left: 0;
  height: 300px;
  width: 100%;
  background: #fff url(/static/imgs/nodata.png) center center no-repeat;
}
.table-out {
  width: 100%;
  min-height: 100px;
  position: relative;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.7);
  }
}

.header-left {
  justify-content: start !important;
}
a {
  color: rgb(72, 119, 232);
}

.overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 60px;
  word-break: break-all;
}
</style>
