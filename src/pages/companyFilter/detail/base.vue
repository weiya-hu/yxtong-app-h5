<template>
  <div class="companyfilter-detail">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 顶部信息 -->
    <div class="company-head">
      <div style="display: flex; align-items: center">
        <!-- <template v-if="detailInfo.top && detailInfo.gsxx.guobie !== '中国'">
          <img
            :src="
              (detailInfo.gsxx && detailInfo.gsxx.logo) ||
              '/static/imgs/globaldrugs/company/logo.png'
            "
            alt=""
          />
        </template> -->
        <template>
          <img
            v-if="detailInfo.top && detailInfo.top.logo.is_pic"
            :src="
              detailInfo.top.logo.content ||
              '/static/imgs/globaldrugs/company/logo.png'
            "
            alt=""
          />

          <img
            v-if="
              detailInfo.top &&
              detailInfo.top.logo.is_pic === false &&
              !detailInfo.top.logo.content
            "
            src="/static/imgs/globaldrugs/company/logo.png"
            alt=""
          />

          <div
            v-if="
              detailInfo.top &&
              detailInfo.top.logo.is_pic === false &&
              detailInfo.top.logo.content
            "
            class="logo-box"
          >
            {{ detailInfo.top.logo.content.substring(0, 2) }}<br />
            {{ detailInfo.top.logo.content.substring(2, 4) }}
          </div>
        </template>
        <div class="head-info" v-if="detailInfo.top">
          <h3 class="title">
            {{ detailInfo.top.qiyemingcheng }}
            &nbsp;&nbsp;{{ detailInfo.top.qiyeyingwenmingcheng }}
          </h3>
          <div class="tags" v-if="detailInfo.top.biaoqianzhi.length">
            <span
              class="tag"
              :class="{
                tag1: item.type == 1,
                tag2: item.type == 2,
                tag2: item.type == 3,
                tag2: item.type == 4,
                tag2: item.type == 5,
                tag3: item.type == 6,
              }"
              v-if="detailInfo.top.biaoqianzhi.length > 0"
              v-for="(item, index) in detailInfo.top.biaoqianzhi"
              :key="index"
              >{{ item.type == 1 ? "主营：" : "" }}{{ item.val }}</span
            >
            <!-- <span class="tag tag-rz" v-if="detailInfo.top.rongzileixing">{{
              detailInfo.top.rongzileixing
            }}</span> -->
          </div>
          <div class="info">
            <div class="info-box" v-if="detailInfo.top.faren">
              <span>法定代表人：</span
              ><span class="color3">{{ detailInfo.top.faren }}</span>
            </div>
            <div class="info-box" v-if="detailInfo.top.zhucezibenyuanshi">
              <span>注册资本：</span
              ><span class="color3">{{
                detailInfo.top.zhucezibenyuanshi
              }}</span>
            </div>
            <div class="info-box" v-if="detailInfo.top.xinyongdaima">
              <span>统一社会信用代码：</span
              ><span class="color3">{{ detailInfo.top.xinyongdaima }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        v-if="allBase.dbname"
      >
        <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item
          ><a :href="'/' + allBase.dbename">{{
            allBase.dbname
          }}</a></el-breadcrumb-item
        >
        <el-breadcrumb-item>企业详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="company-main">
      <div class="company-menu" v-if="isMenuCollapse">
        <div class="menu">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="qyxx">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/qyxx.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">企业信息</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'gsxx' }"
                  @click="handleChangeTitle('gsxx')"
                >
                  工商信息
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'ssxx' }"
                  @click="handleChangeTitle('ssxx')"
                >
                  上市信息
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'qynb' }"
                  @click="handleChangeTitle('qynb')"
                >
                  企业年报
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'glqy' }"
                  @click="handleChangeTitle('glqy')"
                >
                  关联企业
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="ypyf">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/ypyf.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">药品研发</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'cpbj' }"
                  @click="handleChangeTitle('cpbj')"
                  v-if="menuNav.productLayout"
                >
                  产品布局
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'yfgx' }"
                  @click="handleChangeTitle('yfgx')"
                  v-if="menuNav.RDPipeline"
                >
                  研发管线
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'zcsb' }"
                  @click="handleChangeTitle('zcsb')"
                >
                  注册申报
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'lcsy' }"
                  @click="handleChangeTitle('lcsy')"
                >
                  临床试验
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="ylqy" v-if="menuNav.listFiling || menuNav.zbPurchasing">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/ylqx.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">医疗器械</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'ssba' }"
                  @click="handleChangeTitle('ssba')"
                  v-if="menuNav.listFiling"
                >
                  上市&备案
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'zbcg' }"
                  @click="handleChangeTitle('zbcg')"
                  v-if="menuNav.zbPurchasing"
                >
                  中标&带量采购
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="xwzx">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/xwzx.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">新闻资讯</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'xwzx' }"
                  @click="handleChangeTitle('xwzx')"
                >
                  新闻资讯
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="tzgj">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/tzgj.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">投资格局</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'trz' }"
                  @click="handleChangeTitle('trz')"
                >
                  投融资
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="scxs">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/scxs.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">市场销售</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'ssyp' }"
                  @click="handleChangeTitle('ssyp')"
                >
                  上市药品
                </div>
              </div>
            </el-collapse-item>
            <!-- <el-collapse-item name="zscq">
              <template slot="title">
                <img src="/static/imgs/companyfilter/zscq.png" width="14" alt="">
                <span class="c333">知识产权</span>
              </template>
            </el-collapse-item> -->
            <el-collapse-item name="qt">
              <template slot="title">
                <div class="title-box">
                  <img
                    src="/static/imgs/companyfilter/qt.png"
                    width="14"
                    alt=""
                  />
                  <span class="c333">其他</span>
                </div>
              </template>
              <div class="menu-title">
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'scrz' }"
                  @click="handleChangeTitle('scrz')"
                >
                  生产认证
                </div>
                <div
                  class="title-item"
                  :class="{ 'title-active': activeTitle == 'kzxx' }"
                  @click="handleChangeTitle('kzxx')"
                >
                  扩展信息
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <div
        class="menu-collapse"
        @click="isMenuCollapse = !isMenuCollapse"
        :class="{ 'menu-shrink': !isMenuCollapse }"
      >
        <i class="arrow-left"></i>
        <i class="arrow-right"></i>
      </div>

      <div
        class="company-content"
        :class="{ 'company-content-shrink': !isMenuCollapse }"
      >
        <keep-alive>
          <!-- 工商信息 -->
          <Detailgsxx
            v-if="activeTitle === 'gsxx'"
            :business="detailInfo.business"
          ></Detailgsxx>
          <!-- 上市信息 -->
          <Detailssxx v-if="activeTitle === 'ssxx'" ref="ssxx"></Detailssxx>
          <!-- 企业年报 -->
          <Detailqynb v-if="activeTitle === 'qynb'" ref="qynb"></Detailqynb>
          <!-- 关联企业 -->
          <Detailglqy v-if="activeTitle === 'glqy'"></Detailglqy>
          <!-- 产品布局 -->
          <Detailcpbj
            v-if="activeTitle === 'cpbj'"
            ref="cpbj"
            :qiyemingcheng="detailInfo.top.qiyemingcheng"
          ></Detailcpbj>
          <!-- 研发管线 -->
          <Detailyfgx
            v-if="activeTitle === 'yfgx'"
            :qiyemingcheng="detailInfo.top.qiyemingcheng"
          ></Detailyfgx>
          <!-- 注册申报 -->
          <Detailzcsb v-if="activeTitle === 'zcsb'" ref="zcsb"></Detailzcsb>
          <!-- 临床试验 -->
          <Detaillcsy v-if="activeTitle === 'lcsy'" ref="lcsy"></Detaillcsy>
          <!-- 上市备案 -->
          <Detailssba v-if="activeTitle === 'ssba'" ref="ssba"></Detailssba>
          <!-- 中标采购 -->
          <Detailzbcg v-if="activeTitle === 'zbcg'" ref="zbcg"></Detailzbcg>
          <!-- 新闻资讯 -->
          <Detailxwzx v-if="activeTitle === 'xwzx'"></Detailxwzx>
          <!-- 投融资 -->
          <Detailtrz v-if="activeTitle === 'trz'"></Detailtrz>
          <!-- 上市药品 -->
          <Detailssyp v-if="activeTitle === 'ssyp'"></Detailssyp>
          <!-- 生成认证 -->
          <Detailscrz v-if="activeTitle === 'scrz'"></Detailscrz>
          <!-- 扩展信息 -->
          <Detailkzxx
            v-if="activeTitle === 'kzxx'"
            :extend="detailInfo.extendList"
          ></Detailkzxx>
        </keep-alive>

        <!-- <iframe src="https://zy.yaozh.com/product_manual.pdf" type="application/x-google-chrome-pdf" width="100%" height="1000px"></iframe> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import Detailgsxx from "./Detailgsxx";
import Detailssxx from "./Detailssxx";
import Detailqynb from "./Detailqynb";
import Detailglqy from "./Detailglqy";
import Detailcpbj from "./Detailcpbj";
import Detailyfgx from "./Detailyfgx";
import Detailzcsb from "./Detailzcsb";
import Detaillcsy from "./Detaillcsy";
import Detailxwzx from "./Detailxwzx";
import Detailtrz from "./Detailtrz";
import Detailssyp from "./Detailssyp";
import Detailscrz from "./Detailscrz";
import Detailkzxx from "./Detailkzxx";
import Detailssba from "./Detailssba";
import Detailzbcg from "./Detailzbcg";
export default {
  components: {
    LoadingGif,
    Detailgsxx,
    Detailssxx,
    Detailqynb,
    Detailglqy,
    Detailcpbj,
    Detailyfgx,
    Detailzcsb,
    Detaillcsy,
    Detailxwzx,
    Detailtrz,
    Detailssyp,
    Detailscrz,
    Detailkzxx,
    Detailssba,
    Detailzbcg,
  },
  data() {
    return {
      isLoading: true,
      isHideCpbj: false,
      activeName: "qyxx",
      activeTitle: "gsxx",
      detailInfo: {
        extendList: "",
      },
      isMenuCollapse: true,
      menuNav: {}, // 菜单有无数据
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: (state) => state.CompanyFilter.allBase,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
  },
  watch: {
    showPromtNotice(val) {
      if (val) {
        $(".companyfilter-detail").css("height", "calc(100vh - 78px)");
      } else {
        $(".companyfilter-detail").css("height", "calc(100vh - 48px)");
      }
    },

    // 监听展开收起状态，调用图表的resize方法。
    isMenuCollapse(val) {
      console.log(this.$refs);
      if (this.$refs.ssxx) {
        this.$refs.ssxx.chartResize();
      }

      if (this.$refs.qynb) {
        this.$refs.qynb.chartResize();
      }

      if (this.$refs.cpbj) {
        this.$refs.cpbj.chartResize();
      }

      if (this.$refs.zcsb) {
        this.$refs.zcsb.chartResize();
      }

      if (this.$refs.lcsy) {
        this.$refs.lcsy.chartResize();
      }

      if (this.$refs.ssba) {
        this.$refs.ssba.chartResize();
      }

      if (this.$refs.zbcg) {
        this.$refs.zbcg.chartResize();
      }
    },
  },
  methods: {
    // 左侧菜单栏切换事件
    handleChangeTitle(title) {
      this.activeTitle = title;
    },
    // 导航点击切换
    changeTab(name) {
      this.menuActive = name;
      if (this.menuActive == "产品布局") {
        this.$refs.cpbjAll.allResize();
      }
    },
    // 产品布局tab切换数据
    handleClickTab(name) {
      this.resetActivePosition(this.$refs.companyTabs.$el);
      this.activeName = name.name;
      console.log(this.activeName);
      if (this.activeName == "全部") {
        this.$refs.cpbjAll.allResize();
      } else if (this.activeName == "国外") {
        this.$refs.cpbjWord.wordResize();
      } else {
        this.$refs.cpbjChina.chinaResize();
      }
    },
    handleClickNewTab() {
      this.resetActivePosition(this.$refs.newTabs.$el);
    },
    resetActivePosition($el) {
      this.$nextTick(() => {
        const activeEl = $el.querySelector(".el-tabs__item.is-active");
        const lineEl = $el.querySelector(".el-tabs__active-bar");
        const style = getComputedStyle(activeEl);
        const pl = style.paddingLeft.match(/\d+/)[0] * 1;
        const pr = style.paddingRight.match(/\d+/)[0] * 1;
        const w = style.width.match(/\d+/)[0] * 1;
        lineEl.style.transform =
          "translateX(" + (activeEl.offsetLeft + pl) + "px)";
        lineEl.style.width = w - pl - pr + "px";
      });
    },
    // 获取顶部数据和公司信息数据
    getCompanyInfo() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/" + this.$route.params.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.detailInfo = res.data.data;
          } else {
            this.detailInfo = {};
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 第一版只判断产品布局、研发管线菜单有无数据
    getMenuNav() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/navForTwo",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.menuNav = res.data.data;
          } else {
            this.menuNav = {};
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {},
  async mounted() {
    await Store.dispatch("CompanyFilter/getBaseInfo");
    document.title = `${this.allBase.dbname}-企业详情`;
    if (this.$route.query.activeModule) {
      if (this.$route.query.activeModule == "ssyp") this.activeName = "scxs";
      if (this.$route.query.activeModule == "zcsb") this.activeName = "ypyf";
      if (this.$route.query.activeModule == "lcsy") this.activeName = "ypyf";
      this.activeTitle = this.$route.query.activeModule;
    }
    this.getCompanyInfo();
    this.getMenuNav();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.el-loading-mask {
  z-index: 1998 !important;
  background-color: rgba(255, 255, 255, 1);
}
.globaldrugs-company-content {
  font-size: 12px;
  position: relative;

  .section-ico-qa {
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url(/static/imgs/globaldrugs/qa.png);
    background-size: cover;
    margin-left: 5px;
    &:hover {
      background-image: url(/static/imgs/globaldrugs/qa-c.png);
    }
  }

  .max-content {
    max-height: 400px;
    overflow-y: auto;
  }

  .trangle {
    width: 8px;
    height: 8px;
    position: absolute;
    right: -12px;
    top: -12px;
  }
  .content {
    margin-bottom: 10px;
    display: flex;

    .title {
      color: #9aa4b8;
      width: 65px;
    }

    .info {
      color: #333333;
      flex: 1;
      word-break: break-all;
    }
  }
}
.companyfilter-detail {
  .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 0 !important;
  }
  .el-tabs--bottom .el-tabs__item.is-bottom:last-child,
  .el-tabs--bottom .el-tabs__item.is-top:last-child,
  .el-tabs--top .el-tabs__item.is-bottom:last-child,
  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-right: 0 !important;
  }

  .el-tabs {
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;

    .el-tabs__header {
      border-bottom: 1px solid #ebeef5;
    }
    .el-tabs__item {
      font-weight: 400;
      padding: 0 10px;
      color: #333;
      position: relative;
      &:hover {
        color: #000f32;
      }

      .num {
        color: #9aa4b8 !important;
      }

      &::after {
        content: "";
        width: 1px;
        height: 14px;
        background: #ebeef5;
        position: absolute;
        right: 0px;
        top: 14px;
      }
    }

    .el-tabs__item:last-child {
      &::after {
        content: "";
        width: 1px;
        height: 14px;
        background: transparent;
        position: absolute;
        right: 0px;
        top: 14px;
      }
    }

    .el-tabs__item.is-active {
      color: #000f32;

      .num {
        color: #5c6973 !important;
        font-weight: bold;
      }
    }
    .el-tabs__item.is-active {
      font-weight: bold;
      color: #000f32;
    }

    .el-tabs__active-bar {
      background-color: #4877e8;
      height: 3px;
      border-radius: 2px;
    }
  }

  .el-table {
    color: #333;
  }

  height: calc(100vh - 48px);
  .target-bg {
    background: #f3f5f9 !important;
  }

  .el-pagination {
    padding-left: 0;
    padding-top: 14px;

    .el-pager li {
      min-width: 28px;
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
    }

    .more {
      margin-left: 8px;
    }

    .el-pagination__total {
      font-size: 13px;
      color: #5c6973;
      height: 28px;
      line-height: 28px;
    }

    .el-select .el-input .el-input__inner {
      border-radius: 4px;
      border-color: #dcdfe6;
      height: 28px;
      color: #5c6973;
    }

    .btn-prev,
    .btn-next {
      width: 28px;
      height: 28px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #5c6973;
    }

    .btn-next {
      margin-left: 8px;
    }

    .el-pager {
      .number {
        height: 28px;
        line-height: 28px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        color: #666;
        margin-left: 8px;
        font-weight: normal;
      }

      .active {
        background: #4877e8;
        color: #ffffff;
      }
    }
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #fafbfd;
  }
  .el-table {
    .el-table__body tr.el-table__row--striped:hover > td,
    .el-table__body tr:hover > td {
      background-color: #ebeef5 !important;
    }
  }
  .list-in-loading {
    height: calc(100vh - 220px);
  }

  .el-breadcrumb__inner a {
    color: #4877e8 !important;
  }

  .fullscreen-loading {
    background: #ffffff;
  }

  .company-head {
    width: 100%;
    padding: 15px 10px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 68px;
      height: 68px;
      border-radius: 3px;
      border: 1px solid #ebeef5;
      box-sizing: border-box;
      margin-right: 14px;
    }

    .logo-box {
      width: 68px;
      height: 68px;
      background: #4877e8;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 3px;
      border-radius: 3px;
      border: 1px solid #ebeef5;
      margin-right: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .head-info {
      .title {
        font-size: 20px;
        font-weight: 600;
        color: #000f32;
        margin-bottom: 3px;
      }

      .tags {
        margin-bottom: 5px;
        .tag {
          padding: 0 8px;
          height: 20px;
          line-height: 18px;
          border-radius: 3px;
          border: 1px solid #4877e8;
          box-sizing: border-box;
          font-size: 12px;
          color: #4877e8;
          margin-right: 10px;
          display: inline-block;
        }
        .tag1 {
          background: #4877e8;
          border: 1px solid #4877e8;
          color: #fff;
        }

        .tag3 {
          border: 1px solid #1D881A;
          color: #1D881A;
        }
      }

      .info {
        display: flex;

        .info-box {
          margin-right: 10px;
          padding-right: 10px;
          border-right: 1px solid #ebeef5;
          color: #5c6973;
          font-size: 12px;
        }

        .info-box:nth-of-type(3) {
          border-right: none;
        }

        .color3 {
          color: #333;
          font-size: 13px;
        }
      }
    }
  }

  .company-main {
    height: calc(100% - 130px);
    display: flex;
    padding-top: 10px;
    background-color: #f5f8fc;
    position: relative;

    .menu-collapse {
      transition: all 300ms 50ms;
      position: fixed;
      left: 181px;
      top: 55%;
      transform: translateY(-36px);
      width: 8px;
      height: 36px;
      line-height: 36px;
      background-color: #97a2be;
      color: #fff;
      cursor: pointer;

      &:hover {
        color: @White;
        background-color: Lighten(#35384a, 10%);
      }
      .arrow-left {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 7px solid #f0f3fa;
        border-bottom: 6px solid transparent;
        display: inline-block;
      }
      .arrow-right {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-left: 7px solid #f0f3fa;
        border-bottom: 6px solid transparent;
        display: none;
      }
    }

    .menu-shrink {
      transition: all 300ms 50ms;
      left: 1px;
      background-color: #97a2be !important;
      .arrow-left {
        display: none;
      }
      .arrow-right {
        display: inline-block;
      }
      &:hover {
        color: @White!important;
        background-color: Lighten(#35384a, 10%) !important;
      }
    }

    .company-menu {
      width: 180px;
      margin-right: 10px;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 0px 3px 0px 0px;
      height: 100%;
      overflow-y: auto;
      position: relative;

      .menu {
        .c333 {
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }
        .el-collapse-item__header {
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          box-sizing: border-box;
          position: relative;

          .title-box {
            display: flex;
            align-items: center;
            img {
              margin-right: 8px;
            }
          }

          .el-collapse-item__arrow {
            line-height: 40px;
            display: none;
          }
        }

        .el-collapse-item__header.is-active {
          box-shadow: 0px 1px 8px 0px rgba(9, 20, 79, 0.1);
          &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            border-bottom: none;
            width: 2px;
            height: 100%;
            background-color: #4877e8;
          }
        }
        .el-collapse-item__content {
          padding: 0 10px;
          .title-item {
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #ebeef5;
            font-size: 14px;
            color: #333333;
            padding-left: 20px;
            cursor: pointer;
          }

          .title-active {
            color: #4877e8;
          }

          .title-item:last-child {
            border-bottom: 0;
          }
        }
      }
    }

    .gsxx-title {
      font-size: 14px;
      padding-left: 20px;
      color: #333333;
      position: relative;
      margin-bottom: 10px;
      font-weight: 600;

      &::before {
        content: "";
        width: 2px;
        height: 14px;
        background: #4877e8;
        border-radius: 1px;
        position: absolute;
        left: 10px;
        top: 4px;
      }
    }

    .company-content {
      width: calc(100% - 200px);
      height: 100%;
      overflow: auto;
      position: relative;
      background: #ffffff;
      box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
      border-radius: 3px;

      .content-title {
        height: 34px;
        display: flex;
        align-items: center;
        background: #f5f6fa;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        padding: 0 10px;

        .title {
          font-weight: 400;
        }

        .el-date-editor.el-input {
          width: 130px;
          height: 20px;
          border-radius: 3px;
          border: 1px solid #ebeef5;
          color: #333;
        }
        .el-input--mini .el-input__inner {
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          padding-right: 15px;
          font-weight: normal;
        }

        .el-input--mini .el-input__icon {
          line-height: 24px;
          color: #ffa500;
        }

        .btn-line {
          width: 40px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: #ffa914;
          border-radius: 3px;
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
          display: inline-block;
        }
      }

      .line-title {
        justify-content: space-between;
      }
    }

    .company-content-shrink {
      width: calc(100% - 20px);
      margin-left: 10px;
    }
    // 产品布局
    .company-cpbj {
      .el-tabs {
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;

        .el-tabs__header {
          border-bottom: 1px solid #ebeef5;
        }
        .el-tabs__item {
          font-weight: 400;
          color: #333333;
          padding: 0 10px;
          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: #ebeef5;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }
        .el-tabs__item:last-child {
          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: transparent;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }
        .el-tabs__item.is-active {
          font-weight: bold;
          color: #000f32;
        }

        .el-tabs__active-bar {
          background-color: #4877e8;
          height: 3px;
          border-radius: 2px;
        }

        // .el-tabs__item.is-top:nth-child(2) {
        //   padding-left: 0 !important;
        // }
      }
    }

    // 研发管线
    .company-line {
      .line-box {
        padding: 20px 10px;
        box-sizing: border-box;
        .el-table {
          color: #333;
          font-size: 13px;
        }

        .detail-table {
          td,
          th.is-leaf {
            border-bottom: 1px solid #fff;
          }

          .link {
            color: #4877e8;
            font-size: 13px;

            &:hover {
              text-decoration: none;
            }
          }

          .phase-title-box {
            width: 100%;
            display: flex;
            padding: 0;

            div {
              flex: 1;
              padding: 0;
              text-align: center;
              position: relative;
            }
          }

          .line {
            width: 100%;
            white-space: nowrap;
            padding: 3px 0;
            box-sizing: border-box;
            height: 20px;

            .item {
              height: 14px;
              border-radius: 7px;
              width: calc(100% / 6);
              position: relative;
              display: inline-block;
              font-size: 12px;
              span {
                position: absolute;
                left: 60%;
                transform: translateX(-60%);
                line-height: 14px;
              }
            }
            .item:nth-of-type(1) {
              background: #e8f1fe;
              left: 0%;
              color: #35384a;
              z-index: 7;
            }
            .item:nth-of-type(2) {
              background: #cddefd;
              left: -3%;
              color: #35384a;
              z-index: 6;
            }
            .item:nth-of-type(3) {
              background: #afc9fe;
              z-index: 5;
              color: #35384a;
              left: -6%;
            }
            .item:nth-of-type(4) {
              background: #8bb4fa;
              color: #fff;
              z-index: 4;
              left: -9%;
            }
            .item:nth-of-type(5) {
              background: #598dfc;
              color: #fff;
              z-index: 3;
              left: -12%;
            }
            .item:nth-of-type(6) {
              background: #3a79f0;
              color: #fff;
              z-index: 2;
              left: -15%;
            }
            .item:nth-of-type(7) {
              background: #1944b0;
              color: #fff;
              z-index: 1;
              left: -18%;
            }
          }

          .cl-blue {
            font-size: 14px;
            color: #4877e8;
            &:hover {
              text-decoration: none;
            }
          }
        }

        .el-table.detail-table td .cell {
          overflow: unset;
          text-overflow: unset;
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
          padding-right: 14px;
        }

        .el-table.detail-table td .cell > div {
          overflow: unset;
          text-overflow: unset;
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
          max-height: unset;
        }

        .leixing2 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .line-table {
          margin-bottom: 20px;
          .img-map {
            margin-right: 5px;
          }
        }

        .el-table.line-table td,
        .el-table.line-table th.is-leaf {
          border-bottom: 1px solid #ebeef5;
        }

        .el-table.line-table td:first-child {
          border-left: 1px solid #ebeef5;
        }

        .el-table.line-table td:last-child {
          border-right: 1px solid #ebeef5;
        }

        .el-table.line-table thead th > .cell {
          height: 36px;
          line-height: 36px;
          justify-content: center;
          padding: 0;
        }

        .el-table.detail-table thead th > .cell {
          height: 36px;
          line-height: 36px;
        }

        .el-table.line-table tbody td > .cell {
          padding-left: 0;
        }

        .gsxx-title {
          padding-left: 10px;

          &::before {
            left: 0;
          }
        }

        .indication-zy {
          font-size: 13px;
          margin-bottom: 8px;
          box-sizing: border-box;
          display: flex;

          .title {
            width: 40px;
          }

          .content {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }

        .indication-ypz {
          color: #5c6973;
        }
      }
    }

    // 新闻资讯
    .company-xwzx {
      .el-tabs {
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;

        .el-tabs__header {
          border-bottom: 1px solid #ebeef5;
        }
        .el-tabs__item {
          font-weight: 400;
          padding: 0 10px;
          color: #333;
          position: relative;
          &:hover {
            color: #000f32;
          }

          .num {
            color: #9aa4b8 !important;
          }

          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: #ebeef5;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }

        .el-tabs__item:last-child {
          &::after {
            content: "";
            width: 1px;
            height: 14px;
            background: transparent;
            position: absolute;
            right: 0px;
            top: 14px;
          }
        }

        .el-tabs__item.is-active {
          color: #000f32;

          .num {
            color: #5c6973 !important;
            font-weight: bold;
          }
        }
        .el-tabs__item.is-active {
          font-weight: bold;
          color: #000f32;
        }

        .el-tabs__active-bar {
          background-color: #4877e8;
          height: 3px;
          border-radius: 2px;
        }
      }
    }

    // 工商信息
    .company-gsxx {
      .qygl {
        margin: 10px;
        padding: 10px;
        box-sizing: border-box;
        background: #fafbfd;
        border-radius: 3px;

        .qygl-box {
          display: flex;
          flex-wrap: wrap;
          border-bottom: 1px solid #ebeef5;

          .box-info {
            padding-left: 14px;
            margin-bottom: 10px;
            box-sizing: border-box;
            .title {
              color: #5c6973;
              font-size: 14px;
              position: relative;

              &::after {
                content: "";
                width: 4px;
                height: 4px;
                background: #545b6d;
                position: absolute;
                left: -12px;
                top: 6px;
                border-radius: 50%;
              }
            }

            .text {
              color: #333333;
              font-size: 14px;
              font-weight: 600;

              a {
                color: #333333;

                &:hover {
                  color: #4877e8;
                  text-decoration: none;
                }
              }
            }
          }
          .box-info:nth-of-type(1),
          .box-info:nth-of-type(3) {
            width: 30%;
          }

          .box-info:nth-of-type(2),
          .box-info:nth-of-type(4) {
            width: 70%;
          }
        }

        .box-jianjie {
          padding: 10px 10px 10px 14px;
          box-sizing: border-box;
          display: flex;
          overflow: hidden;
          .title {
            color: #5c6973;
            font-size: 14px;
            position: relative;
            width: 45px;

            &::after {
              content: "";
              width: 4px;
              height: 4px;
              background: #545b6d;
              position: absolute;
              left: -12px;
              top: 8px;
              border-radius: 50%;
            }
          }

          .text {
            flex: 1;
            color: #333333;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: justify;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            position: relative;

            &::before {
              content: "";
              height: calc(100% - 24px);
              float: right;
            }

            &::after {
              content: "";
              width: 999vw;
              height: 999vw;
              position: absolute;
              box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0
                #fafbfd;
              margin-left: -100px;
            }
          }

          .btn {
            float: right;
            clear: both;
            margin-left: 10px;
            font-size: 14px;
            color: #4877e8;
            cursor: pointer;
            margin-top: 2px;
          }
          .btn::before {
            content: "【展开】";
          }
          .exp {
            display: none;
          }

          .exp:checked + .title + .text {
            -webkit-line-clamp: 999;
          }
          .exp:checked + .title + .text::after {
            visibility: hidden;
          }
          .exp:checked + .title + .text .btn::before {
            content: "【收起】";
          }
        }
      }

      .tb-t {
        width: calc(100% - 20px);
        margin: 0 10px 10px 10px;

        tr {
          td {
            box-sizing: border-box;
            height: 32px;
            border: 1px solid #ebeef5;
            font-size: 13px;
            font-weight: 400;
            color: #333333;
            line-height: 32px;
            padding: 8px 8px 8px 2%;

            // max-width: 30vw;
            &:nth-child(odd) {
              min-width: 110px;
              width: 180px;
              background: #fafbfd;
            }

            &:nth-child(even) {
              width: 30vw;
              min-width: 270px;
              word-wrap: break-word;
              word-break: break-all;
              white-space: normal;
              background: #fff;
              line-height: 23px;
            }

            &:nth-child(2n) {
              padding: 8px 8px 8px 2%;
              color: #5c6973;
            }
          }
        }
      }
    }
  }
}
</style>
