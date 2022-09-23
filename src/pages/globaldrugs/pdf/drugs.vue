<template>
  <div class="pdf" v-waiting="detailLoading">
    <div class="generator" v-if="showGenerate && $route.query.offline">
      <el-button id="generate" size="mini" @click="generate()">生成</el-button>
    </div>
    <div class="paper" v-if="base_loaded">
      <Page :fullDate="fullDate">
        <div>
          <div class="pdf-title-zh">{{ zwname }}药物报告</div>
          <div class="pdf-title-en">{{ drugname_standard }} Drug Report</div>
          <!-- <div class="pdf-title-en">{{ company_standard }}</div> -->
          <div class="pdf-menu-title">内容大纲</div>
          <div
            v-for="(item, i) in showMenu"
            :key="item.name"
            class="text-center pdf-menu"
          >
            <div class="fl part-index">
              PART{{ i > 8 ? i + 1 : `0${i + 1}` }}
            </div>
            <div class="fl line"></div>
            <div class="fl menu-name">{{ item.name }}</div>
          </div>
        </div>
      </Page>
      <template v-for="(temp, idx) in menus">
        <Page
          :key="idx"
          v-if="temp.component && !temp.isHide"
          :fullDate="fullDate"
          :page="findPage(temp.name)"
        >
          <component
            v-if="base_loaded"
            :is="temp.component"
            :idx="idx"
            :base="basic"
            :drugname_standard="drugname_standard"
            :company_standard="company_standard"
          />
        </Page>
      </template>
    </div>
  </div>
</template>

<script>
import Page from "./components/page";
import YWGL from "./components/drugs/gl";
import TL from "./components/drugs/timeline";
import SYZ from "./components/drugs/syz";
import JZGJ from "./components/drugs/jzgj";
import LCXG from "./components/drugs/lcxg";
import ZGZCSB from "./components/drugs/zgzcsb";
import SSPZ from "./components/drugs/sspz";
import ZLBJ from "./components/drugs/zlbj";
import CSCO from "./components/drugs/csco";
import SCXS from "./components/drugs/scxs";
import ZBXX from "./components/drugs/zbxx";
import PSBG from "./components/drugs/psbg";
import YPSMS from "./components/drugs/ypsms";
import YPBZ from "./components/drugs/ypbz";
const { jsPDF } = window.jspdf;
export default {
  name: "pdf-drugs",
  components: { Page, YWGL, TL, SYZ, JZGJ, LCXG, SSPZ, ZLBJ },
  data() {
    return {
      pdf: null,
      basic: {},
      zwname: "",
      ywmc: "",
      drugname_standard: "",
      company_standard: "",
      base_loaded: false,
      detailLoading: true,
      menus: [
        { name: "药品概览", isHide: false, loaded: false, component: YWGL },
        { name: "药品时光轴", isHide: false, loaded: false, component: TL },
        { name: "适应症", isHide: false, loaded: false, component: SYZ },
        { name: "竞争格局", isHide: false, loaded: false, component: JZGJ },
        { name: "临床相关", isHide: false, loaded: false, component: LCXG },
        // { name: "新闻资讯", isHide: false,loaded: false, component: null },
        {
          name: "中国注册申报",
          isHide: false,
          loaded: false,
          component: ZGZCSB,
        },
        { name: "上市批准", isHide: false, loaded: false, component: SSPZ },
        { name: "专利布局", isHide: false, loaded: false, component: ZLBJ },
        { name: "CSCO指南", isHide: false, loaded: false, component: CSCO },
        { name: "市场销售", isHide: false, loaded: false, component: SCXS },
        { name: "中标信息", isHide: false, loaded: false, component: ZBXX },
        {
          name: "全球药品评审报告",
          isHide: false,
          loaded: false,
          component: PSBG,
        },
        { name: "药品说明书", isHide: false, loaded: false, component: YPSMS },
        { name: "药品标准", isHide: false, loaded: false, component: YPBZ },
      ],
      showGenerate: false,
    };
  },
  watch: {
    showGenerate(n, o) {
      if (n) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.generate();
          }, 2000);
        });
      }
    },
  },
  computed: {
    fullDate() {
      let date = new Date(),
        fullDate = date.toLocaleString("chinese", { hour12: false }),
        fullDateArr = fullDate.split(" ");
      return fullDateArr;
    },
    showMenu() {
      return this.menus.filter((t) => !t.isHide && t.component);
    },
  },
  methods: {
    findPage(name) {
      return this.showMenu.findIndex((t) => t.name == name) + 1;
    },
    html2pdf(node, page = 0, scale) {
      console.log(page);
      return new Promise((resolve) => {
        this.pdf.html(node, {
          callback: function (pdf) {
            resolve(pdf);
          },
          x: 0,
          y: 841.89 * page,
          html2canvas: {
            useCORS: true,
            scale: scale || 0.75,
            dpi: 96,
            backgroundColor: "#ffffff",
          },
        });
      });
    },
    async init() {
      this.pdf = null;
      this.pdf = await new jsPDF("p", "pt", "a4");
      let fontfaces = [
        "Helvetica Neue",
        "Helvetica",
        "PingFang SC",
        "Hiragino Sans GB",
        "Microsoft YaHei",
        "Noto Sans CJK SC",
        "WenQuanYi Micro Hei",
        "Arial",
        "sans-serif",
      ];
      this.pdf.addFileToVFS("wqyhei.ttf", window.font);
      fontfaces.forEach((font) => {
        this.pdf.addFont("wqyhei.ttf", font, "normal");
        this.pdf.setFont(font, "normal");
      });
    },
    async generate() {
      // this.detailLoading = true;
      var pages = document.querySelectorAll(".page");
      var pdfs = [];
      let page = 0;
      for (let i = 0; i < pages.length; i++) {
        let pageHeightScale = Math.ceil(pages[i].clientHeight / 1120); // 当前页 占用页面高度
        if (pageHeightScale > 1) {
          pages[i].style.height = 1120 * pageHeightScale + "px";
        }
        let pdf = await this.html2pdf(pages[i], page);
        page += pageHeightScale;
        this.pdf = pdf;
        // pdfs.push(pdf)
      }
      // this.pdf.deletePage(1);
      let total = this.pdf.getNumberOfPages();
      while (total > page) {
        this.pdf.deletePage(total);
        total -= 1;
      }
      this.detailLoading = false;
      this.pdf.save(this.zwname + "-药智数据企业版药物报告.pdf");
      // http://vip-local.yaozh.com:8082/globaldrugs/pdf/drugs?drugname_standard=VAFTRxFaTA8LVEISWwEMRl8%3D&company_standard=3%2FWu1%2BaF09LG1O3T0eDu&offline=1
      window.close();
    },
    // /api/globaldrugs/drugoverview
    async getOverview() {
      const { drugname_standard, company_standard } = this.$route.query;
      Axios({
        method: "get",
        url: "/api/globaldrugs/drugoverview",
        params: {
          drugname_standard,
          company_standard,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            // this.detailLoading = false;
            this.basic = res.data.data;
            this.zwname = res.data.data.zwname;
            this.ywmc = res.data.data.ylbm;
            this.drugname_standard = res.data.data.drugname_standard;
            this.company_standard = res.data.data.company.company_standard
              .map((t) => t.name)
              .join(";");
            this.base_loaded = true;
          }
        })
        .finally(() => {
          this.$root.$emit("load-page", "药品概览");
        });
    },
    hideMenu(name) {
      let menus = this.menus.map((t) => {
        if (t.name == name) {
          t.isHide = true;
        }
        return t;
      });
      this.menus = menus;
    },
    loadedPage(name) {
      let menus = this.menus.map((t) => {
        if (t.name == name) {
          t.loaded = true;
        }
        return t;
      });
      this.menus = menus;
    },
  },
  mounted() {
    this.$root.$on("font-loaded", async () => {
      await this.getOverview();
      await this.init();
    });
    this.$root.$on("hide-page", (name) => {
      this.hideMenu(name);
    });
    this.$root.$on("load-page", (name) => {
      this.loadedPage(name);
      if (this.menus.every((t) => t.loaded == true)) {
        // this.detailLoading = false;
        this.showGenerate = true;
        // this.$nextTick(() => {
        //   this.generate();
        // })
      }
    });
  },
};
</script>

<style lang="less">
@import url(./pdf.less);
.paper {
  position: absolute;
  left: 100%;
  top: -100%;
}
.pdf-menu {
  font-size: 18px;
  margin: 20px auto;
  width: 600px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .line {
    width: 250px;
    height: 3px;
    display: inline-block;
    vertical-align: middle;
    background: url(~@/assets/imgs/pdf/dashed.png);
  }
  .menu-name {
    width: 150px;
    text-align: right;
  }
  .part-index {
    width: 150px;
    text-align: left;
  }
}

.pdf-title-zh {
  width: 100%;
  font-weight: bold;
  text-align: center;
  font-size: 28px;
  margin-top: 30px;
}
.pdf-title-en {
  width: 100%;
  font-weight: bold;
  text-align: center;
  font-size: 24px;
  line-height: 16px;
}
.pdf-menu-title {
  color: #4877e8;
  height: 70px;
  font-size: 36px;
  margin-top: 30px;
  text-align: center;
}
</style>