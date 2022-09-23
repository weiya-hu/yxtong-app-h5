<template>
  <div class="lists">
    <el-tabs
      :value="activeTabName"
      @tab-click="handleClickTag"
      class="la-list globaldrugs-list"
      ref="tabs"
    >
      <el-tab-pane name="first" class="slh-pane">
        <span slot="label">
          按药品浏览
          <span class="num" v-if="extendCount.baseCount"
            >({{ formattedNumber(extendCount.baseCount) }})</span
          >
          <!-- {{
            getTabLabel("按药品浏览", formattedNumber(extendCount.baseCount))
          }} -->
          <!-- <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含GlobaldrugsTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip> -->
        </span>
        <ListOne></ListOne>
      </el-tab-pane>
      <el-tab-pane
        name="projectGroup"
        :disabled="nopms.projectgroup"
        :class="{ 'abandon-click-method': nopms && nopms.projectgroup }"
      >
        <span slot="label">
          项目进展
          <!-- {{
            getTabLabel("项目进展", formattedNumber(extendCount.projectCount))
          }} -->
          <span class="num" v-if="extendCount.projectCount"
            >({{ formattedNumber(extendCount.projectCount) }})</span
          >
          <!-- <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含GlobaldrugsTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip> -->
        </span>
        <ListTwo></ListTwo>
      </el-tab-pane>
      <el-tab-pane
        name="companyGroup"
        :disabled="nopms.companygroup"
        :class="{ 'abandon-click-method': nopms && nopms.companygroup }"
      >
        <span slot="label">
          按企业浏览
          <!-- {{
            getTabLabel("按企业浏览", formattedNumber(extendCount.companyCount))
          }} -->
          <span class="num" v-if="extendCount.companyCount"
            >({{ formattedNumber(extendCount.companyCount) }})</span
          >
          <!-- <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含GlobaldrugsTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip> -->
        </span>
        <ListThree></ListThree>
      </el-tab-pane>
      <el-tab-pane
        name="targetGroup"
        :disabled="nopms.targetgroup"
        :class="{ 'abandon-click-method': nopms && nopms.targetgroup }"
      >
        <span slot="label">
          按靶点浏览
          <!-- {{
            getTabLabel("按靶点浏览", formattedNumber(extendCount.targetCount))
          }} -->
          <span class="num" v-if="extendCount.targetCount"
            >({{ formattedNumber(extendCount.targetCount) }})</span
          >
          <!-- <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含GlobaldrugsTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip> -->
        </span>
        <ListFour></ListFour>
      </el-tab-pane>
      <el-tab-pane
        name="indicationGroup"
        :disabled="nopms.indicationgroup"
        :class="{ 'abandon-click-method': nopms && nopms.indicationgroup }"
      >
        <span slot="label">
          按适应症浏览
          <!-- {{
            getTabLabel("按靶点浏览", formattedNumber(extendCount.targetCount))
          }} -->
          <span class="num" v-if="extendCount.indicationCount"
            >({{ formattedNumber(extendCount.indicationCount) }})</span
          >
          <!-- <el-tooltip
            style="position: absolute; top: 14px; right: -1px"
            effect="light"
            placement="right"
            content="仅包含GlobaldrugsTrials.gov美国的数据。"
          >
            <i class="el-icon-question cl-green"></i>
          </el-tooltip> -->
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
      activeTabName: (state) => state.Globaldrugs.tabname,
      extendCount: (state) => state.Globaldrugs.extendCount,
      res1: (state) => state.Globaldrugs.res1,
      res2: (state) => state.Globaldrugs.res2,
      res3: (state) => state.Globaldrugs.res3,
      res4: (state) => state.Globaldrugs.res4,
      res5: (state) => state.Globaldrugs.res5,
      nopms: (state) => state.Globaldrugs.nopms,
      putong: (state) => state.Globaldrugs.putong,
      gaoji: (state) => state.Globaldrugs.gaoji,
      shaixuan: (state) => state.Globaldrugs.shaixuan,
      fourth: (state) => state.Globaldrugs.fourth,
      hot: (state) => state.Globaldrugs.hot,
    }),
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        if (this.$route.path === "/globaldrugs/list") {
          //智能分析重新搜索清空列表数据tab无法自动复位
          if (this.diffSearchData()) {
            let path =
              this.activeTabName === "first"
                ? "/api/globaldrugs"
                : "/api/globaldrugs/" + this.activeTabName;
            Store.dispatch("Globaldrugs/nomalSearch", {
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
      this.resetActivePosition(this.$refs.tabs.$el);

      let name = "";
      tab.name === "first"
        ? (name = "按药品浏览")
        : tab.name === "projectGroup"
        ? (name = "项目进展")
        : tab.name === "companyGroup"
        ? (name = "按企业浏览")
        : tab.name === "targetGroup"
        ? (name = "按靶点浏览")
        : (name = "按适应症浏览");
      window.ga(
        "send",
        "event",
        "tab",
        "click",
        "企业版_全球药物_列表_" + name
      );
      window._paq.push([
        "trackEvent",
        "tab",
        "click",
        "企业版_全球药物_列表_" + name,
      ]);

      let path =
        tab.name === "first"
          ? "/api/globaldrugs"
          : "/api/globaldrugs/" + tab.name;
      Store.commit("Globaldrugs/tabname", tab.name);
      Store.commit("Globaldrugs/path", path);
      if (
        (tab.name === "first" && !_.keys(this.res1.res).length) ||
        (tab.name === "projectGroup" && !_.keys(this.res2).length) ||
        (tab.name === "companyGroup" && !_.keys(this.res3).length) ||
        (tab.name === "targetGroup" && !_.keys(this.res4).length) ||
        (tab.name === "indicationGroup" && !_.keys(this.res5).length)
      ) {
        Store.dispatch("Globaldrugs/nomalSearch", {
          path: path,
          queryToPutong: false,
        });
      }
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

    formattedNumber(num) {
      // flag用于判断数字是正数还是负数（true负数）
      let flag = false;
      if (!num) {
        return "";
      }
      if (num < 0) {
        num = Math.abs(num);
        flag = true;
      }
      var num = num.toString();
      let numArry = num.split(".");
      let intPart = Math.trunc(num); // 获取整数部分
      let intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
      var result = "";
      console.log();
      if (numArry[1]) {
        result = intPartFormat + `.${numArry[1]}`;
      } else {
        result = intPartFormat;
      }
      return flag ? `-${result}` : result;
    },
  },
  created() {},
  mounted() {
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.globaldrugs-list {
  .el-table .sort-caret.ascending {
    top: 3px;
  }
  .el-tabs__header {
    padding-left: 14px;
    margin: 0px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-tabs__content {
    overflow: visible;
    padding: 20px 20px 0 20px;
  }

  .el-tabs__active-bar {
    height: 3px;
    border-radius: 2px;
    background-color: #002fa7;
  }

  .el-tabs__item {
    padding: 0 10px;
    color: #333;
    &:hover {
      color: #000f32;
    }

    .num {
      color: #9aa4b8 !important;
    }
  }

  .el-tabs__item.is-disabled {
    color: #c0c4cc;
  }

  .el-tabs__item.is-active {
    color: #000f32;
    font-weight: bold;

    .num {
      color: #5c6973 !important;
      font-weight: bold;
    }
  }

  .el-table thead th > .cell {
    height: 36px;
    line-height: 36px;
  }
}
</style>
