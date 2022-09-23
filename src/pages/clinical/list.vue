<template>
  <div class="lists">
    <el-tabs
      :value="activeTabName"
      @tab-click="handleClickTag"
      class="la-list clinical-list"
    >
      <el-tab-pane
        :label="getTabLabel('按登记号浏览', extendCount.BaseCount)"
        name="first"
        class="slh-pane"
      >
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        name="conditions1group"
        :disabled="nopms.conditions1group"
        :class="{ 'abandon-click-method': nopms.conditions1group }"
      >
        <span slot="label">
          {{ getTabLabel("按疾病领域浏览", extendCount.Conditions1Count) }}
          <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含ClinicalTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        name="interventions1group"
        :disabled="nopms.interventions1group"
        :class="{ 'abandon-click-method': nopms.interventions1group }"
      >
        <span slot="label">
          {{
            getTabLabel("按干预药物类别浏览", extendCount.Interventions1Count)
          }}
          <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含ClinicalTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <ListThree></ListThree>
      </el-tab-pane>
      <el-tab-pane
        name="sponsor1group"
        :disabled="nopms.sponsor1group"
        :class="{ 'abandon-click-method': nopms.sponsor1group }"
      >
        <span slot="label">
          {{
            getTabLabel("按申办者/合作者类型浏览", extendCount.Sponsor1Count)
          }}
          <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含ClinicalTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <ListFour></ListFour>
      </el-tab-pane>
      <el-tab-pane
        name="clinicalresultsgroup"
        :disabled="nopms.clinicalresultsgroup"
        :class="{ 'abandon-click-method': nopms.clinicalresultsgroup }"
      >
        <span slot="label">
          {{
            getTabLabel("按临床结果浏览", extendCount.ClinicalresultsCount)
          }}
          <el-tooltip
            style="position: absolute; top: 14px; right: -14px"
            effect="light"
            placement="right"
            content="该列表数据按试验结果来源条数显示。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
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
    ListFive,
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
      activeTabName: (state) => state.Clinical.tabname,
      extendCount: (state) => state.Clinical.extendCount,
      res1: (state) => state.Clinical.res1,
      res2: (state) => state.Clinical.res2,
      res3: (state) => state.Clinical.res3,
      res4: (state) => state.Clinical.res4,
      res5: (state) => state.Clinical.res5,
      nopms: (state) => state.Clinical.nopms,
      putong: (state) => state.Clinical.putong,
      gaoji: (state) => state.Clinical.gaoji,
      shaixuan: (state) => state.Clinical.shaixuan,
      fourth: (state) => state.Clinical.fourth,
      hot: (state) => state.Clinical.hot,
    }),
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (this.$route.path === "/clinical/list") {
          //智能分析重新搜索清空列表数据tab无法自动复位
          if (this.diffSearchData()) {
            let path =
              this.activeTabName === "first"
                ? "/api/clinical"
                : "/api/clinical/" + this.activeTabName;
            Store.dispatch("Clinical/nomalSearch", {
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
      window.ga("send", "event", "tab", "click", "Clinical" + tab.name);
      window._paq.push(["trackEvent", "tab", "click", "Clinical" + tab.name]);

      let path =
        tab.name === "first" ? "/api/Clinical" : "/api/Clinical/" + tab.name;
      Store.commit("Clinical/tabname", tab.name);
      Store.commit("Clinical/path", path);
      if (
        (tab.name === "first" && !_.keys(this.res1.res).length) ||
        (tab.name === "conditions1group" && !_.keys(this.res2).length) ||
        (tab.name === "interventions1group" && !_.keys(this.res3).length) ||
        (tab.name === "sponsor1group" && !_.keys(this.res4).length) ||
        (tab.name === "clinicalresultsgroup" && !_.keys(this.res5).length)
      ) {
        Store.dispatch("Clinical/nomalSearch", {
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

.clinical-list {
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
