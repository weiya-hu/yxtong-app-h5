<template>
  <div class="dailiangcaigou-analy" v-if="!nopms.dailiangcaigoujzfx">
    <!-- 顶部 -->
    <header class="header">
      <div class="header-top">
        <h1>带量采购精准分析</h1>
        <div class="header-right">
          <!-- <span class="header-back" @click.self="goBack">返回</span> -->

          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item
              ><a :href="'/dailiangcaigou'">
               国家药品集中带量采购</a></el-breadcrumb-item
            >
            <el-breadcrumb-item>精准分析</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </header>

    <!-- 右边部分 -->
    <div class="cont-r">
      <!-- 左边导航 -->
      <leftNav :navs="navs" :nowNav="nowNav" @changeNowNav="changeNowNav" />

      <!-- 主体内容 -->
      <div class="la-right">
        <component v-bind:is="nowCpmponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
import leftNav from "@/components/common/leftNav";
import pici from "./analys/pici";
import yaoping from "./analys/yaoping";
import qiye from "./analys/qiye";
import { mapState } from "vuex";
export default {
  components: {
    leftNav,
    pici,
    yaoping,
    qiye
  },
  data() {
    return {
      navs: ["批次分析", "药品分析", "企业分析"],
      nowNav: "批次分析",
      nowCpmponent: "pici"
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Dailiangcaigou.allBase,
      nopms: state => state.Dailiangcaigou.nopms
    })
  },
  methods: {
    // 左侧tab组件切换事件
    changeNowNav(name) {
      this.nowNav = name;
      if (name === "批次分析") {
        this.nowCpmponent = "pici";
      }
      if (name === "药品分析") {
        this.nowCpmponent = "yaoping";
      }
      if (name === "企业分析") {
        this.nowCpmponent = "qiye";
      }
    },

    // 返回带量采购列表页
    goBack() {
      let routeData = this.$router.resolve({ path: "/dailiangcaigou/list" });
      window.open(routeData.href, "_self");
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
    if (this.$route.query.nav) {
      this.changeNowNav(this.$route.query.nav);
    }
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.dailiangcaigoujzfx);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.dailiangcaigoujzfx);
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.dailiangcaigou-analy {
  clear: both;
  overflow: hidden;
  padding: 0 10px 10px;
}
.header {
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      align-self: flex-start;
      font-size: 28px;
      font-weight: 400;
      margin: 0;
      line-height: 1;
      color: #4877e8;
    }

    .header-right {
      display: flex;
      align-items: center;

      .el-breadcrumb {
        margin-left: 30px;
      }
    }
    .header-back {
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
    }
  }
}
.cont-r {
  display: flex;
  justify-content: space-between;
}
.la-right {
  width: calc(100% - 250px);
  background: #fff;
  border-radius: 4px;
  -webkit-box-shadow: 0px 0px 5px #c4d3f8;
  box-shadow: 0px 0px 5px #c4d3f8;
}

/deep/.header {
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
  .header-bottom {
    font-size: 12px;
    color: #999;
    line-height: 1;
  }
}

/deep/.la-right {
  width: calc(100% - 190px);
}
</style>
