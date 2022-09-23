<template>
  <div class="lists">
    <el-tabs
      :value="activeTabName"
      @tab-click="handleClickTag"
      class="la-list epyp-list"
    >
      <el-tab-pane
        :label="getTabLabel('按产品编号浏览', extendCount.BaseCount)"
        name="first"
        class="slh-pane"
      >
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按活性成分浏览', extendCount.NameCount)"
        name="namegroup"
        :disabled="nopms.namegroup"
        :class="{ 'abandon-click-method': nopms.namegroup }"
      >
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('按上市许可持有人浏览', extendCount.holderCount)"
        name="holdergroup"
        :disabled="nopms.holdergroup"
        :class="{ 'abandon-click-method': nopms.holdergroup }"
      >
        <ListThree></ListThree>
      </el-tab-pane>
      <el-tab-pane
        :label="getTabLabel('正在审评', extendCount.epypzhuceCount)"
        name="epypzhuce"
        :disabled="nopms.epypzhuce"
        :class="{ 'abandon-click-method': nopms.epypzhuce }"
      >
        <ListFour></ListFour>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListOne from "./lists/list-one";
import ListTwo from "./lists/list-two";
import ListThree from "./lists/list-three";
import ListFour from "./lists/list-four";
import { mapState } from "vuex";

export default {
  components: {
    ListOne,
    ListTwo,
    ListThree,
    ListFour,
  },
  data() {
    return {};
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: (state) => state.Epyp.tabname,
      extendCount: (state) => state.Epyp.extendCount,
      res1: (state) => state.Epyp.res1,
      res2: (state) => state.Epyp.res2,
      res3: (state) => state.Epyp.res3,
      res4: (state) => state.Epyp.res4,
      nopms: (state) => state.Epyp.nopms,
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.length&&!this.res3.length
    } */
  },
  methods: {
    handleClickTag(tab, event) {
      window.ga("send", "event", "tab", "click", "epyp_" + tab.name);
      window._paq.push(["trackEvent", "tab", "click", "epyp_" + tab.name]);

      let path = tab.name === "first" ? "/api/epyp" : "/api/epyp/" + tab.name;
      Store.commit("Epyp/tabname", tab.name);
      Store.commit("Epyp/path", path);
      if (
        (tab.name === "first" && !_.keys(this.res1.res).length) ||
        (tab.name === "namegroup" && !_.keys(this.res2).length) ||
        (tab.name === "holdergroup" && !_.keys(this.res3).length) ||
        (tab.name === "epypzhuce" && !_.keys(this.res4).length)
      ) {
        Store.dispatch("Epyp/nomalSearch", {
          path: path,
          queryToPutong: false,
        });
      }
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.epyp-list {
  .el-tabs__header {
    padding-left: 14px;
    margin: 0px;
  }
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
