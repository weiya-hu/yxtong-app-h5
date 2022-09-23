<template>
  <div class="companyfilter-cpbj">
    <div class="content-title">
      产品布局
      <el-tooltip
        class="desc"
        effect="light"
        :content="'只展示原研单位的产品管线，暂未展示合作企业的产品管线。'"
        placement="right"
      >
        <span class="section-ico-qa"></span>
      </el-tooltip>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClickTab" ref="companyTabs">
      <el-tab-pane label="查看全部" name="全部">
        <cpbj-all ref="cpbjAll" :qiyemingcheng="qiyemingcheng"></cpbj-all>
      </el-tab-pane>
      <el-tab-pane label="只看国内" name="国内">
        <cpbj-china ref="cpbjChina" :qiyemingcheng="qiyemingcheng"></cpbj-china>
      </el-tab-pane>
      <el-tab-pane label="只看国外" name="国外">
        <cpbj-word ref="cpbjWord" :qiyemingcheng="qiyemingcheng"></cpbj-word>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CpbjAll from "./components/cpbj-all";
import CpbjChina from "./components/cpbj-china";
import CpbjWord from "./components/cpbj-word";
export default {
  props: {
    qiyemingcheng: {
      type: String,
    },
  },
  components: {
    CpbjAll,
    CpbjChina,
    CpbjWord,
  },
  data() {
    return {
      activeName: "全部", // 全球新药产品布局激活选项，默认为全部
    };
  },
  watch: {},
  methods: {
    chartResize() {
      if (this.activeName == "全部") {
        this.$refs.cpbjAll.allResize();
      } else if (this.activeName == "国外") {
        this.$refs.cpbjWord.wordResize();
      } else {
        this.$refs.cpbjChina.chinaResize();
      }
    },
    // 产品布局tab切换数据
    handleClickTab(name) {
      this.resetActivePosition(this.$refs.companyTabs.$el);
      this.activeName = name.name;
      if (this.activeName == "全部") {
        this.$refs.cpbjAll.allResize();
      } else if (this.activeName == "国外") {
        this.$refs.cpbjWord.wordResize();
      } else {
        this.$refs.cpbjChina.chinaResize();
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
  },
  mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-cpbj {

}
</style>
