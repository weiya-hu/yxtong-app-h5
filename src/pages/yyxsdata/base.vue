<template>
  <div class="yyxsfx">
    <!-- 顶部 -->
    <header class="header" :class="onTrial ? 'onTrial' : ''">
      <div class="header-top">
        <h1>医院销售数据库</h1>
        <div class="header-right">
          <div style="display:inline-flex;align-items:center;">
            <el-tooltip class="help-tip" effect="light" placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''">
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span>
                <i class="el-icon-warning cl-green pr5"></i>帮助
              </span>
            </el-tooltip>
            <div class="conf-log" v-if="update_conf.log">{{ update_conf.log }}</div>
            <i-wave />更多高级功能和权限，请使用
            <!--  -->
            <router-link :to="{ path: '/yyxs/list', query: { ga_source: 'vip', ga_name: 'yyxsdata_toptips' } }"
              class="cl-blue" target="_blank">医院销售数据挖掘系统</router-link>
          </div>

          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>医院销售数据库</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div v-if="onTrial" class="header-bottom" :style="{ margin: onTrial ? '5px 0' : '0' }">
        您当前为试用用户，仅提供2016，2017，2018年销售数据可查，正式用户可查最新数据</div>
    </header>

    <!-- 右边部分 -->
    <div class="cont-r">
      <!-- 左边导航 -->
      <leftNav :navs="navs" :nowNav="nowNav" @changeNowNav="changeNowNav" />
      <div class="la-right">
        <section class="sec2">
          <template v-if="ypfxTnit">
            <!--xxxMagnify表示：放大测试版 -->
            <page1 v-if="nowNav === '药品分析' && is_magnify == false" :ypname="ypname" :nopmState="nopmState"
              :type="type" />
            <page1Magnify v-else-if="nowNav === '药品分析' && is_magnify == true" :nowNav="nowNav" :ypname="ypname"
              :nopmState="nopmState" :type="type" />
          </template>
          <template v-if="qyfxInit">
            <page2 v-if="nowNav === '企业分析' && is_magnify == false" :qyname="qyname" :nopmState="nopmState" />
            <page2Magnify v-else-if="nowNav === '企业分析' && is_magnify == true" :nowNav="nowNav" :qyname="qyname"
              :nopmState="nopmState" />
          </template>
          <template v-if="flfxInit">
            <page3 v-if="nowNav === '分类分析' && is_magnify == false" :qyname="qyname" :nopmState="nopmState" />
            <page3Magnify v-else-if="nowNav === '分类分析' && is_magnify == true" :nowNav="nowNav" :qyname="qyname"
              :nopmState="nopmState" />
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import IWave from "@/components/common/icon-wave";
import leftNav from "./components/leftNav";
import page1 from "./page1";
import page1Magnify from "./page1_magnify";
import page2 from "./page2";
import page2Magnify from "./page2_magnify";
import page3 from "./page3";
import page3Magnify from "./page3_magnify";
import { mapState } from "vuex";
import noPermission from "@/pages/permission/no-permission";

export default {
  components: {
    leftNav,
    page1,
    page1Magnify,
    page2,
    page2Magnify,
    page3,
    page3Magnify,
    IWave,
    noPermission
  },
  data() {
    return {
      navs: ["药品分析", "企业分析", "分类分析"],
      nowNav: "药品分析",
      ypname: this.$route.query.ypname,
      qyname: this.$route.query.qyname,
      tab: this.$route.query.tab,
      type: Number(this.$route.query.type),
      nopmState: false,
      ypfxTnit: false,
      qyfxInit: false,
      flfxInit: false,
      is_magnify: this.getUrlParam("type_id") == 2
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Yyxs.nopms,
      helpInfo: state => state.Yyxs.helpInfo,
      accountData: state => state.UserCenter.accountData,
      update_conf: state => state.Yyxs.update_conf,
      no_rules: state => state.Yyxs.norules,
      allBase: state => state.Yyxs.allBase,
      userInfo: state => state.UserCenter.userInfo,
      isFangDa: state => state.UserCenter.isFangDa
    }),
    onTrial() {
      let list = [62, 63, 64, 65, 84, 85, 86];
      let bl = false;
      _.forEach(list, item => {
        if (item === this.accountData.grade_id) {
          bl = true;
        }
      });
      return bl;
    }
  },
  methods: {
    changeNowNav(name) {
      localStorage.nowNav = name;
      if (name === "药品分析") {
        this.ypfxTnit = true;
      }
      if (name === "企业分析") {
        this.qyfxInit = true;
      }
      if (name === "分类分析") {
        this.flfxInit = true;
      }
      this.nowNav = name;
    },
    getUserInfo() {
      const _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/usercenter/userinfo",
          params: {
            accesstoken: this.vueGetCookie("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            Store.commit("UserCenter/userInfo", data);
            // Store.commit("UserCenter/isFangDa", data.type_id == 2);
            _this.is_magnify = _this.getUrlParam("type_id") == 2;
            console.log(
              _this.nowNav === "药品分析" && _this.is_magnify == true
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    if (this.tab) {
      switch (this.tab) {
        case "1":
          this.ypfxTnit = true;
          this.nowNav = "药品分析";
          break;
        case "2":
          this.qyfxInit = true;
          this.nowNav = "企业分析";
          break;
      }
    } else {
      if (localStorage.nowNav && this.getUrlParam("type_id") == 2) {
        switch (localStorage.nowNav) {
          case "药品分析":
            this.ypfxTnit = true;
            break;
          case "企业分析":
            this.qyfxInit = true;
            break;
          case "分类分析":
            this.flfxInit = true;
            break;
          default:
            this.ypfxTnit = true;
            break;
        }
        this.nowNav = localStorage.nowNav;
      } else {
        this.ypfxTnit = true;
      }
    }
    Store.dispatch("Yyxs/getBaseInfo").then(() => {
      this.nopmState = true;
      this.vueTogglePmsTooltip();
      document.title = "医院销售数据库";
      this.getUserInfo();
    });
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.yyxsfx {
  clear: both;
  overflow: hidden;
  padding: 0 10px 10px;
}

.header {
  height: 40px;
  display: flex;
  align-items: center;

  .header-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #545b6d;
      margin: 0 !important;
    }

    .conf-log {
      font-size: 12px;
      color: #999;
      line-height: 1;
      text-align: right;
      margin-right: 10px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .el-breadcrumb {
      margin-left: 30px !important;
    }
  }

  .header-bottom {
    font-size: 12px;
    color: #999;
    line-height: 1;
  }
}

.help-tip {
  padding-right: 10px;
}

.cont-r {
  display: flex;
  justify-content: space-between;
}

.la-right {
  width: calc(100% - 190px);
}

.container {
  margin-bottom: 0 !important;
}

.onTrial {
  display: block !important;
  min-height: 40px;
  height: auto !important;
}
</style>
