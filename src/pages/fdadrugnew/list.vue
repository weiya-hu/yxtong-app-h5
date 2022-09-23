<template>
  <div>
    <el-tabs
      :value="activeTabName"
      @tab-click="handleClickTag"
      class="la-list"
      :before-leave="beforeLeave"
    >
      <el-tab-pane
        :label="getTabLabel('按申请号浏览', extendCount.BaseCount)"
        name="basegroup"
        class="slh-pane"
      >
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按活性成分浏览', extendCount.NameCount)"
        name="nameGroup"
        :disabled="nopms.nameGroup"
        :class="{ 'abandon-click-method': nopms.nameGroup }"
      >
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按申请机构浏览', extendCount.JigouCount)"
        name="jigouGroup"
        :disabled="nopms.jigouGroup"
        :class="{ 'abandon-click-method': nopms.jigouGroup }"
      >
        <ListThree></ListThree>
      </el-tab-pane>
      <el-tab-pane label="最新批准" name="zuixinpizhun"> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListOne from "./lists/list-one";
import ListTwo from "./lists/list-two";
import ListThree from "./lists/list-three";
import { mapState } from "vuex";

export default {
  components: {
    ListOne,
    ListTwo,
    ListThree
  },
  data() {
    return {};
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: state => state.Fdadrugnew.tabname,
      extendCount: state => state.Fdadrugnew.extendCount,
      res1: state => state.Fdadrugnew.res1,
      res2: state => state.Fdadrugnew.res2,
      res3: state => state.Fdadrugnew.res3,
      nopms: state => state.Fdadrugnew.nopms,
      allBase: state => state.Fdadrugnew.allBase
    })
  },
  methods: {
    beforeLeave(item) {
      return new Promise((resolve, reject) => {
        if (item === "zuixinpizhun") {
          reject();
        } else {
          resolve();
        }
      });
    },
    linkTo(url) {
      const { href } = this.$router.resolve({
        path: `/${url}`
      });
      window.open(href, "_blank");
    },
    handleClickTag(tab, event) {
      let path =
        tab.name !== "basegroup"
          ? "/api/fdadrugnew/" + tab.name
          : "/api/fdadrugnew/";
      window.ga("send", "event", "tab", "click", "fdadrugnew_" + tab.name);
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        "fdadrugnew_" + tab.name
      ]);

      if (tab.name === "zuixinpizhun") {
        this.linkTo("fdadailydrug");
        return;
      }
      Store.commit("Fdadrugnew/tabname", tab.name);
      Store.commit("Fdadrugnew/path", path);
      if (
        (tab.name === "basegroup" && !_.keys(this.res1).length) ||
        (tab.name === "nameGroup" && !_.keys(this.res2).length) ||
        (tab.name === "jigouGroup" && !_.keys(this.res3).length)
      ) {
        Store.dispatch("Fdadrugnew/nomalSearch", {
          path: path,
          queryToPutong: false
        });
      }
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
  mounted() {}
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.el-tabs__header {
  padding-left: 14px;
  margin: 0px;
}
.el-tabs__content {
  overflow: visible;
}
.el-tabs__active-bar {
  height: 3px;
  border-radius: 5px;
}

.el-tabs__item {
  padding: 0 14px;
}
</style>
