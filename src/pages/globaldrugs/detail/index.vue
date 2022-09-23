<template>
  <div
    class="wrapper"
    :style="{
      height: showPromtNotice ? 'calc(100vh - 78px)' : 'calc(100vh - 48px)',
    }"
  >
    <LoadingGif :loadFlag="detailLoading" v-if="detailLoading" />
    <div class="wrapper-head">
      <div class="wrapper-head_left">
        <div class="name">
          <div class="name-list">
            <span
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 70%;
              "
              >{{ zwname }} {{ drugname_standard }}</span
            >
            <span class="tag" v-if="basic.zgss">中国上市</span>
            <span class="tag" v-if="basic.zclx_1">中国1类新药</span>
            <span class="tag" v-if="basic.yxsp"
              >优先评审 <template>{{ basic.yxsp_source }}</template></span
            >
            <span class="tag" v-if="basic.tpxzl"
              >突破性治疗 <template>{{ basic.tpxzl_source }}</template></span
            >
            <span class="tag green" v-if="basic.higheststatus">{{
              basic.higheststatus
            }}</span>
          </div>
          <span
            style="
              font-size: 14px;
              font-weight: normal;
              color: #666;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            :title="company_standard"
            >{{ company_standard }}</span
          >
        </div>
      </div>
      <div class="wrapper-head_right">
        <div
          v-show="true"
          @click="baseSubscribe()"
          :class="noRssPermission?'tag-btn abandon-click-method':'tag-btn'"
          style="background-color: #9dcc40"
        >
          <img
            style="width: 13px; height: 14px"
            src="/static/imgs/globaldrugs/dingyue.png"
            alt=""
          />
          <span>订阅</span>
        </div>
        <div
          v-show="true"
          @click="baseContrast"
          :class="noComparePermission?'tag-btn abandon-click-method':'tag-btn'"
          style="background-color: #ffa914"
        >
          <img
            style="width: 15px; height: 14px"
            src="/static/imgs/globaldrugs/duibi.png"
            alt=""
          />

          <span>对比</span>
        </div>
        <div
          v-show="devShow"
          @click="baseExport"
          class="tag-btn"
          style="background-color: #002fa7"
        >
          <img
            style="width: 15px; height: 14px"
            src="/static/imgs/globaldrugs/daochu.png"
            alt=""
          />

          <span>导出</span>
        </div>
        <span style="color: #333; margin-left: 10px">
          当前位置：
          <router-link
            target="a"
            onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_面包屑_首页' ])"
            style="font-style: normal; color: #002fa7"
            to="/home"
            >首页</router-link
          >
          >
          <router-link
            target="a"
            onclick="_paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_药物详情_面包屑_全球药物2.0' ])"
            style="font-style: normal; color: #002fa7"
            to="/globaldrugs"
            >{{ allBase.dbname }}</router-link
          >
          >
          <i style="font-style: normal; color: #333">药品详情</i>
        </span>
      </div>
    </div>
    <div class="wrapper-main">
      <div class="wrapper-menu" :style="{ width: expanded ? '180px' : '0' }">
        <side-menu :menus="menus" v-model="activeMenu"></side-menu>
        <div class="wrapper-fold" @click="expanded = !expanded">
          <i v-if="expanded" class="arrow-left"></i>
          <i v-else class="arrow-right"></i>
        </div>
      </div>
      <div
        ref="scrolling"
        v-if="base_loaded"
        class="wrapper-content scrolling-wrapper"
        :style="{ width: expanded ? 'calc(100% - 190px)' : 'calc(100% - 10px)' }"
      >
        <content-section
          v-for="(item, idx) in menus.filter((item) => !item.hidden)"
          :key="item.name"
          :name="item.name1"
          :desc="item.desc"
          :idx="idx"
        >
          <!-- v-show="activeMenu == idx" -->

          <template v-if="item.name == '竞争格局'" #head>
            <div style="display: flex; align-items: center">
              <span style="font-size: 13px; color: #333; line-height: 1"
                >药品名称：</span
              >
              <el-autocomplete
                size="mini"
                class="jzgj-searcher"
                v-model="ywmc"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect"
                clearable
              >
                <template slot-scope="{ item }">
                  <div class="drug-item">
                    <div :title="item.value" class="drug-item_durgname">
                      {{ item.value }}
                    </div>
                  </div>
                </template>
              </el-autocomplete>
            </div>
          </template>
          <component
            v-if="!detailLoading"
            :is="item.component"
            :idx="idx"
            :base="basic"
            :drugname_standard="drugname_standard"
            :company_standard="company_standard"
          />
        </content-section>
      </div>
    </div>
    <!-- 各类提示 -->
    <div class="alert" @click="hideAlerts()">
      <!-- 订阅成功 -->
      <div class="right right1">
        <span>订阅成功</span>
      </div>
      <!-- 关键词不能为空 -->
      <div class="wrong wrong1">
        <div class="inner">
          <img
            style="margin-bottom: 5px"
            src="/static/imgs/globaldrugs/noencode.png"
            width="34"
            height="34"
            alt=""
          />

          <p>暂无数据！</p>
        </div>
      </div>

      <!-- 该功能正在建设中 -->
      <div class="wrong wrong7">
        <div class="inner">
          <img
            style="margin-bottom: 5px"
            src="/static/imgs/globaldrugs/noencode.png"
            width="34"
            height="34"
            alt=""
          />
          <p>该功能正在建设中…</p>
          <p>即将上线</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SideMenu from "./components/sideMenu";
import ContentSection from "./components/contentSection";
import Ywsgz from "./components/ywsgz";
import Ywgl from "./components/ywgl";
import Syz from "./components/syz";
import Jzgj from "./components/jzgj";
import Lcxg from "./components/lcxg";
import Xwzx from "./components/xwzx";
import Sjts from "./components/sjts";
import Kzxx from "./components/kzxx";
import Jyxx from "./components/jyxx";
export default {
  data() {
    return {
      devShow: /dev|local|lc/.test(location.host),
      menus: [
        {
          component: Ywgl,
          name: "药品概览",
          name1: "药品概览",
          ico: "/static/imgs/globaldrugs/ywgl_ico.png",
          ico1: "/static/imgs/globaldrugs/ywgl_ico-c.png",
          desc: "药品概览集合了药品的基本信息及相关的企业、靶点、适应症等。",
        },
        {
          component: Ywsgz,
          name: "药品时光轴",
          name1: "药品时光轴",
          ico: "/static/imgs/globaldrugs/ywsgz_ico.png",
          ico1: "/static/imgs/globaldrugs/ywsgz_ico-c.png",
          desc: "时光轴将药品相关的数据进行整合展示，药品详情页只展示最早的7条数据，更多数据可点击右下角“详情版本”查看，其中黄色填充的数据为该药品重要节点信息。",
        },
        {
          component: Syz,
          name: "适应症",
          name1: "适应症",
          ico: "/static/imgs/globaldrugs/syz_ico.png",
          ico1: "/static/imgs/globaldrugs/syz_ico-c.png",
          desc: "适应症统计并展示了适应症的批准国家或地区情况，也展示了在研适应症的最高状态及详细信息。",
        },
        {
          component: Jzgj,
          name: "竞争格局",
          name1: "同活性成分竞争格局",
          ico: "/static/imgs/globaldrugs/jzgj_ico.png",
          ico1: "/static/imgs/globaldrugs/jzgj_ico-c.png",
          desc: "竞争格局首先统计了同活性成分靶点药品的分布情况及同活性成分药品的的研发进度。",
        },
        {
          component: Lcxg,
          name: "临床相关",
          name1: "临床相关",
          ico: "/static/imgs/globaldrugs/jyqy_ico.png",
          ico1: "/static/imgs/globaldrugs/jyqy_ico-c.png",
          desc: "临床相关展示了该项目在全球临床试验及结果、中国临床试验，以及相关的文献信息。",
        },
        {
          component: Xwzx,
          name: "新闻资讯",
          name1: "新闻资讯",
          ico: "/static/imgs/globaldrugs/xwzx_ico.png",
          ico1: "/static/imgs/globaldrugs/xwzx_ico-c.png",
          desc: "该项目相关的新闻资讯，包括研发进展、企业官网、适应症信息、合作开发等内容。",
        },
        {
          component: Sjts,
          name: "数据透视",
          name1: "同活性成分数据透视",
          ico: "/static/imgs/globaldrugs/sjts_ico.png",
          ico1: "/static/imgs/globaldrugs/sjts_ico-c.png",
          desc: "数据透视集合展示了药品研发过程中各个重要阶段的数据，并进行了初步的可视化分析。",
        },
        {
            component: Jyxx,
            name: "交易信息",
            name1: "交易信息",
            ico: "/static/imgs/globaldrugs/company/jyxx.png",
            ico1: "/static/imgs/globaldrugs/company/jyxx_active.png",
            desc: "该药品相关的交易信息，可进入投资格局-医药交易数据库查看更多交易信息。",
        },
        {
          component: Kzxx,
          name: "扩展信息",
          name1: "扩展信息",
          ico: "/static/imgs/globaldrugs/kzxx_ico.png",
          ico1: "/static/imgs/globaldrugs/kzxx_ico-c.png",
          desc: "从扩展信息可以直接关联到与该项目有关的药智其他数据库。",
        },
      ],
      basic: {
        zgss: false,
        zclx_1: false,
        yxsp: false,
        tpxzl: false,
        higheststatus: false,
        othername: "",
        leixing2: "",
        cate: "",
        company: {
          company_standard: [],
          coo_company: [],
          per_company: [],
        },
        indication: {},
        targets: [],
        worldstatus: {
          china: { name: "", date: "" },
          global: { name: "", date: "" },
        },
        firstmarket: {},
        atcarr: {},
        pharmaco: {
          pharmacodynamics: "",
          mechanism_of_action: "",
          protein: "",
          halflife: "",
          toxicity: "",
          absorption: "",
          volume: "",
          metabolism: "",
          route: "",
          clearance: "",
        },
        structpicture: "",
        chemicalname: "",
        cas: "",
        formulations: "",
        formulaweight: "",
        summary: "",
        extendList: "",
      },
      //   activeMenu: 0,
      scorllObserved: [],
      ywmc: "",
      detailLoading: true, // 加载中
      drugname_standard: "",
      company_standard: "",
      zwname: "",
      observer: null,
      base_loaded: false, // 药物概览信息 获取情况
      expanded: true, // 侧边菜单是否展开
      // activeMenu: 0
    };
  },
  components: {
    LoadingGif,
    SideMenu,
    ContentSection,
    Ywgl,
    Ywsgz,
    Syz,
  },
  computed: {
    activeMenu: {
      get() {
        let observed = this.scorllObserved.sort((a, b) => a - b);
        return observed.length ? observed[0] : 0;
      },
      set(v) {
        let sections = document.querySelectorAll(".section");
        let top = sections[v].offsetTop;
        let root = document.querySelector(".scrolling-wrapper");
        root.scrollTo(0, top);
      },
    },
    ...mapState("Globaldrugs", ["allBase",'norules']),
    
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice,
    }),
    noRssPermission() {
      return this.norules.exclusive.find(t => t.action === 'rss');
    },
    noComparePermission() {
      return this.norules.exclusive.find(t => t.action === 'compare');
    }
  },
  methods: {
    toggleAlert(cls) {
      // 切换alert提示
      $(".alert").fadeIn();
      $(".alert")
        .find("." + cls)
        .fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert")
          .find("." + cls)
          .fadeOut();
      }, 2000);
    },
    hideAlerts() {
      $(".alert").hide();
    },
    querySearch(query, cb) {
      if (query.length < 2) {
        cb([]);
        return;
      }
      Axios({
        method: "get",
        url: "/api/globaldrugs/input",
        params: _.assign(
          {
            drugname1: query,
          },
          {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        ),
      }).then((res) => {
        if (res.data.code == 200) {
          let r = res.data.data.map((t) => {
            return { value: t.drugname_standard };
          });
          cb(r);
        } else {
          cb([]);
        }
      });
    },
    // 板块左上搜索框输入事件传递
    handleSelect(e) {
      this.$root.$emit("search", e.value);
    },
    // 导出事件分发
    exportExcel(e) {
      this.$root.$emit("export", e);
    },
    // 滚动状态监听
    scrollingObserve() {
      if (this.observer) {
        this.observer.disconnect();
      }
      const observerOptions = {
        threshold: 0,
        root: this.$refs.scrolling,
      };
      const observerCallback = (entries) => {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            // 在可视区域 记录模块IDX
            // this.scorllObserved.push(item.target.parentNode.__vue__.idx);
            this.scorllObserved.push(item.target.__vue__.idx);
          } else {
            // 不在可视区域 移除记录模块IDX
            // this.scorllObserved = this.scorllObserved.filter((t) => t != item.target.parentNode.__vue__.idx);
            this.scorllObserved = this.scorllObserved.filter(
              (t) => t != item.target.__vue__.idx
            );
          }
        });
      };
      this.observer = new IntersectionObserver(
        observerCallback,
        observerOptions
      );
      const targets = document.querySelectorAll(".section");
      targets.forEach((target) => {
        this.observer.observe(target);
      });
    },
    // 获取基本概览信息的接口 ，进入页面触发
    getBasicInfo() {
      const { drugname_standard, company_standard } = this.$route.query;
      Axios({
        method: "get",
        url: "/api/globaldrugs/drugoverview",
        params: {
          drugname_standard,
          company_standard,
        },
      }).then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.detailLoading = false;
          this.basic = res.data.data;
          this.zwname = res.data.data.zwname;
          this.ywmc = res.data.data.ylbm;
          this.drugname_standard = res.data.data.drugname_standard;
          this.company_standard = res.data.data.company.company_standard
            .map((t) => t.name)
            .join(";");
          this.base_loaded = true;
          this.$nextTick(() => {
            this.scrollingObserve();
          });
        } else {
          this.$root.$emit("hide-section", "药品概览");
        }
      });
    },
    // 导出
    baseExport() {
      // this.$message("功能正在建设中...");
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_导出",
      ]);
      // this.toggleAlert("wrong7");
      let url = location.href.replace('/globaldrugs/detail','/globaldrugs/pdf/drugs');
      window.open(url,'_blank')
    },
    // 订阅
    baseSubscribe() {
      // this.$message("功能正在建设中...");
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_订阅",
      ]);
      if (this.noRssPermission) {
        return;
      }
      // this.toggleAlert("wrong7");
      const url = this.$router.resolve({
        path: "/usercenter/take/new",
        query: {
          source: "globaldrugs",
          key: this.drugname_standard,
        },
      });
      window.open(url.href, "_blank");
    },
    // 对比contrast
    baseContrast() {
      _paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_药物详情_对比",
      ]);
      if (this.noComparePermission) {
        return;
      }
      // let { company_standard, drugname_standard } = this.$route.query;
      let company_standard = this.company_standard;
      let drugname_standard = this.drugname_standard;
      let drugcontraststate = localStorage.getItem("globaldrugsContrast")
        ? JSON.parse(localStorage.getItem("globaldrugsContrast"))
        : [];
      if (
        drugcontraststate.findIndex(
          (item) =>
            item.company_standard == company_standard &&
            item.drugname_standard == drugname_standard
        ) > -1
      ) {
        window.open("/globaldrugs/contrast", "_blank");
      } else {
        drugcontraststate.push({ company_standard, drugname_standard });
        localStorage.setItem(
          "globaldrugsContrast",
          JSON.stringify(drugcontraststate)
        );
        window.open("/globaldrugs/contrast", "_blank");
      }
    },
  },
  mounted() {
    Store.dispatch("Globaldrugs/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip();
      document.title = this.allBase.dbname + "-药品详情";
    });
    // 滚动监听

    this.getBasicInfo();
    this.$root.$on("hide-section", (name) => {
      this.scrollingObserve();
      this.menus = this.menus.map((t) => {
        if (t.name == name) {
          return { ...t, hidden: true };
        } else {
          return t;
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-width: 1231px;
  position: relative;
  height: calc(100vh - 48px);
}

.wrapper-head {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;

  &_left {
    display: flex;
    align-items: center;
    flex: 1;
  }

  &_right {
    display: flex;
    align-items: center;

    .tag-btn {
      margin-left: 5px;
      height: 20px;
      display: flex;
      align-items: center;
      color: #fff;
      padding: 0 8px;
      border-radius: 2px;
      cursor: pointer;
      user-select: none;

      &:hover {
        opacity: 0.9;
      }

      img {
        margin-right: 3px;
      }
    }

    span {
      line-height: 20px;
    }
  }

  .name {
    width: 100%;
    font-size: 20px;
    color: #333;
    font-family: "微软雅黑", SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    display: flex;
    flex-direction: column;

    .name-list {
      display: flex;
      align-items: center;
    }
  }

  .tag {
    height: 20px;
    font-size: 12px;
    border: 1px solid #002fa7;
    color: #002fa7;
    margin-left: 10px;
    border-radius: 3px;
    padding: 0 5px;
    box-sizing: border-box;
    line-height: 18px;
    vertical-align: middle;
    white-space: nowrap;
    min-width: 70px;
    text-align: center;

    &.green {
      background-color: #9dcc40;
      border-color: #9dcc40;
      color: #fff;
    }
  }
}

.wrapper-main {
  height: calc(100% - 70px);
  display: flex;
  padding-top: 10px;
  background-color: #f5f8fc;
  position: relative;

  .wrapper-menu {
    width: 180px;
    margin-right: 10px;
    background: #ffffff;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
    border-radius: 0px 3px 0px 0px;

    position: relative;
    transition: .3s;
    .wrapper-fold {
      width: 8px;
      height: 36px;
      background-color: #97a2be;
      color: #fff;
      position: absolute;
      top: calc(50% - 18px);
      right: -8px;
      display: flex;
      align-items: center;
      i.arrow-left {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 7px solid #f0f3fa;
        border-bottom: 6px solid transparent;
        display: inline-block;
      }
      i.arrow-right {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-left: 7px solid #f0f3fa;
        border-bottom: 6px solid transparent;
        display: inline-block;
      }
      &:hover {
        background-color: #4a4e68;
        cursor: pointer;
      }
    }
  }

  .wrapper-content {
    // width: calc(100% - 190px);
    transition: .3s;
    overflow: auto;
    position: relative;

    .export {
      cursor: pointer;
      user-select: none;
    }
  }
}

.alert {
  z-index: 9999;
  display: none;
  width: 175px;
  height: 105px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -52.5px;
  margin-left: -87.5px;

  .right {
    position: relative;
    width: 175px;
    height: 105px;
    background: url("/static/imgs/usercenter/alert/right.png") no-repeat;

    span {
      position: absolute;
      bottom: 22px;
      left: 0px;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .wrong {
    position: relative;
    width: 175px;
    height: 105px;
    background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;
    display: none;

    span {
      position: absolute;
      bottom: 22px;
      left: 0px;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    &.wrong7,
    &.wrong1 {
      display: none;
      background-image: unset;

      .inner {
        width: 180px;
        height: 100px;
        background-color: #002fa7;
        background-image: unset;
        box-shadow: 0px 1px 20px 0px rgba(9, 20, 79, 0.25);
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        p {
          text-align: center;
          color: #fff;
          font-size: 13px;
        }
      }
    }
  }

  div {
    display: none;
  }
}

/deep/.jzgj-searcher {
  .el-input__inner {
    height: 20px;
    font-size: 12px;
    color: #002fa7;
  }

  .el-input {
    height: 20px;
    display: block;
  }

  .el-input__prefix {
    top: -3px !important;
  }

  .el-input__suffix {
    top: -3px !important;
  }
}

.el-autocomplete {
  .el-input__suffix {
    top: -3px !important;
  }
}

.drug-item {
  .drug-item_durgname {
    font-size: 13px;
    // font-weight: bold;
    color: #333;
    height: 35px;
    line-height: 35px;
  }

  .drug-item_company {
    font-size: 12px;
    color: #a3a3a3;
    height: 18px;
    line-height: 18px;
  }
}
</style>
