<template>
  <div class="lists">
    <el-tabs
      :value="activeTabName"
      @tab-click="handleClickTag"
      class="la-list company-list"
    >
      <el-tab-pane
        :label="getTabLabel('按企业浏览', extendCount.baseCount)"
        name="first"
        class="slh-pane"
      >
        <ListOne></ListOne>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import ListOne from '@/components/common/list-config'
import ListOne from "./lists/list-one";
import { mapState } from "vuex";

export default {
  components: {
    ListOne,
  },
  data() {
    return {
      searchState: {
        putong: {},
        gaoji: {},
        shaixuan: {},
        fourth: {},
        hot: {},
      },
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: (state) => state.CompanyFilter.tabname,
      extendCount: (state) => state.CompanyFilter.extendCount,
      res1: (state) => state.CompanyFilter.res1,
      res2: (state) => state.CompanyFilter.res2,
      res3: (state) => state.CompanyFilter.res3,
      res4: (state) => state.CompanyFilter.res4,
      res5: (state) => state.CompanyFilter.res5,
      nopms: (state) => state.CompanyFilter.nopms,
      putong: (state) => state.CompanyFilter.putong,
      gaoji: (state) => state.CompanyFilter.gaoji,
      shaixuan: (state) => state.CompanyFilter.shaixuan,
      fourth: (state) => state.CompanyFilter.fourth,
      hot: (state) => state.CompanyFilter.hot,
    }),
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (this.$route.path === "/company/list") {
          //智能分析重新搜索清空列表数据tab无法自动复位
          if (this.diffSearchData()) {
            let path =
              this.activeTabName === "first"
                ? "/api/company"
                : "/api/company/" + this.activeTabName;
            Store.dispatch("CompanyFilter/nomalSearch", {
              path: path,
              queryToPutong: false,
              tabs: true,
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // Vuex内存储的搜索条件和页面内的对比，返回状态
    diffSearchData() {
      const currentSearchData = {
        putong: this.putong,
        gaoji: this.gaoji,
        shaixuan: this.shaixuan,
        fourth: this.fourth,
        hot: this.hot,
      };
      const currentJson = JSON.stringify(currentSearchData);
      const localJson = JSON.stringify(this.searchState);
      if (currentJson != localJson) {
        this.searchState = currentSearchData;
        return true;
      } else {
        return false;
      }
    },
    handleClickTag(tab, event) {
      window.ga("send", "event", "tab", "click", "CompanyFilter" + tab.name);
      window._paq.push(["trackEvent", "tab", "click", "CompanyFilter" + tab.name]);

      let path =
        tab.name === "first" ? "/api/company_filter" : "/api/company_filter/" + tab.name;
      Store.commit("CompanyFilter/tabname", tab.name);
      Store.commit("CompanyFilter/path", path);
      if (
        (tab.name === "first" && !_.keys(this.res1.res).length) ||
        (tab.name === "conditions1group" && !_.keys(this.res2).length) ||
        (tab.name === "interventions1group" && !_.keys(this.res3).length) ||
        (tab.name === "sponsor1group" && !_.keys(this.res4).length) ||
        (tab.name === "companyresultsgroup" && !_.keys(this.res5).length)
      ) {
        Store.dispatch("CompanyFilter/nomalSearch", {
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

.company-list {
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
