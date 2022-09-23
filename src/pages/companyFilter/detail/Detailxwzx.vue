<template>
  <div class="companyfilter-xwzx">
    <div class="content-title">新闻资讯</div>
    <div v-if="xwzxTab.length">
      <el-tabs
        v-model="activeNameNews"
        @tab-click="handleClickNewTab"
        ref="newTabs"
      >
        <el-tab-pane
          v-for="(item, key) in xwzxTab"
          :key="key"
          :label="item.sourceleixing + `(${item.doc_count})`"
          :name="item.sourceleixing"
        >
          <span slot="label">
            {{ item.sourceleixing }}
            <span class="num" v-if="item.doc_count"
              >({{ item.doc_count }})</span
            >
          </span>
          <Xwzx
            v-if="item.sourceleixing == activeNameNews"
            :name="item.sourceleixing"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else style="text-align: center; color: #999; margin-top: 200px">
      <img src="/static/imgs/trz/no_data.png" alt="" />
      <div class="text">暂无相关数据</div>
    </div>
  </div>
</template>

<script>
import Xwzx from "./xwzx";
export default {
  components: {
    Xwzx
  },
  data() {
    return {
      activeNameNews: "",
      xwzxTab: [],
    };
  },
  methods: {
    // 获取新闻资讯顶部切换tab
    getXwzxTab() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/newsCate",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.xwzxTab = res.data.data;
            this.activeNameNews = this.xwzxTab[0].sourceleixing;
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
  },
  mounted() {
    this.getXwzxTab();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-xwzx {
}
</style>
