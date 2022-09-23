<template>
  <div class="lists">
    <el-tabs :value="activeTabName" @tab-click="handleClickTag" class="la-list zhuce-list">
      <el-tab-pane :label="getTabLabel('按受理号浏览', extendCount.BaseCount)" name="first" class="slh-pane">
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane :label="getTabLabel('按药品名称浏览', extendCount.NameCount)" name="namegroup" :disabled="nopms.namegroup"
        :class="{ 'abandon-click-method': nopms.namegroup }">
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane :label="getTabLabel('按企业名称浏览', extendCount.QiyeCount)" name="qiyegroup" :disabled="nopms.qiyegroup"
        :class="{ 'abandon-click-method': nopms.qiyegroup }">
        <ListThree></ListThree>
      </el-tab-pane>

      <el-tab-pane name="speciesgroup" :disabled="nopms.speciesgroup"
        :class="{ 'abandon-click-method': nopms.speciesgroup }">
        <span slot="label">
          {{ getTabLabel("按品种浏览", extendCount.Species) }}
          <el-tooltip style="position: absolute; top: 13px; right: -2px;" effect="light" placement="right"
            content="按品种浏览：按“药品+企业”维度，查看某企业某药品的注册申报情况。">
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <ListFour></ListFour>
      </el-tab-pane>

      <el-tab-pane :label="getTabLabel('品种申报进展')" name="speciesProdev" :disabled="nopms.speciesProdev"
        :class="{ 'abandon-click-method': nopms.speciesProdev }">
        <ListFive></ListFive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import ListOne from '@/components/common/list-config'
import ListOne from "./lists/list-one";
import ListTwo from "./lists/list-two";
import ListThree from "./lists/list-three";
import ListFour from "./lists/list-four";
import ListFive from "./lists/list-five";
import { mapState } from "vuex";

export default {
  components: {
    ListOne,
    ListTwo,
    ListThree,
    ListFour,
    ListFive
  },
  data() {
    return {
      searchState: {
        putong: {},
        gaoji: {},
        shaixuan: {},
        fourth: {},
        hot: {}
      },
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: (state) => state.Zhuce.tabname,
      extendCount: (state) => state.Zhuce.extendCount,
      res1: (state) => state.Zhuce.res1,
      res2: (state) => state.Zhuce.res2,
      res3: (state) => state.Zhuce.res3,
      res4: (state) => state.Zhuce.res4,
      res5: (state) => state.Zhuce.res5,
      nopms: (state) => state.Zhuce.nopms,
      putong: (state) => state.Zhuce.putong,
      gaoji: (state) => state.Zhuce.gaoji,
      shaixuan: (state) => state.Zhuce.shaixuan,
      fourth: (state) => state.Zhuce.fourth,
      hot: (state) => state.Zhuce.hot
    }),
    /* noData() {
      return !this.res1.res&&!this.res2.length&&!this.res3.length
    } */
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (this.$route.path === "/zhuce/list") {
          //智能分析重新搜索清空列表数据tab无法自动复位
          if (this.diffSearchData()) {
            let path = this.activeTabName === "first" ? "/api/zhuce" : "/api/zhuce/" + this.activeTabName;
            Store.dispatch("Zhuce/nomalSearch", {
              path: path,
              queryToPutong: false,
              tabs: true
            });
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // Vuex内存储的搜索条件和页面内的对比，返回状态
    diffSearchData() {
      const currentSearchData = {
        putong: this.putong,
        gaoji: this.gaoji,
        shaixuan: this.shaixuan,
        fourth: this.fourth,
        hot: this.hot
      };
      const currentJson = JSON.stringify(currentSearchData);
      const localJson = JSON.stringify(this.searchState);
      console.log(currentJson, localJson, currentJson != localJson);
      if (currentJson != localJson) {
        this.searchState = currentSearchData;
        return true;
      } else {
        return false;
      }
    },
    handleClickTag(tab, event) {
      // this.$nextTick(()=>{
      //   $(event.path[0]).attr('tabindex',-1)
      // })
      window.ga("send", "event", "tab", "click", "zhuce_" + tab.name);
      window._paq.push(["trackEvent", "tab", "click", "zhuce_" + tab.name]);

      let path = tab.name === "first" ? "/api/zhuce" : "/api/zhuce/" + tab.name;
      // window.ga("send", "event", "tab", "click", "zhuce_"+tab.name)
      Store.commit("Zhuce/tabname", tab.name);
      Store.commit("Zhuce/path", path);
      if (
        (tab.name === "first" && !_.keys(this.res1.res).length) ||
        (tab.name === "namegroup" && !_.keys(this.res2).length) ||
        (tab.name === "qiyegroup" && !_.keys(this.res3).length) ||
        (tab.name === "speciesgroup" && !_.keys(this.res4).length) ||
        (tab.name === "speciesProdev" && !_.keys(this.res5).length)
      ) {
        Store.dispatch("Zhuce/nomalSearch", {
          path: path,
          queryToPutong: false,
        });
      }
    },
  },
  // activated() {
  //   if (this.diffSearchData()) {
  //     let path = this.activeTabName === "first" ? "/api/zhuce" : "/api/zhuce/" + this.activeTabName;
  //     Store.dispatch("Zhuce/nomalSearch", {
  //       path: path,
  //       queryToPutong: false,
  //     });
  //   }
  // },
  created() { },
  mounted() { },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.zhuce-list {
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
