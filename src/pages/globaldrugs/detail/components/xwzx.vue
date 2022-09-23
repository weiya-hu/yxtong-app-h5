<template>
  <div class="xwzx" v-waiting="loading">
    <el-tabs
     @tab-click="handleClickTag"
      ref="tabs"
    v-model="activeName">
      <el-tab-pane
        v-for="(item, key) in xwzx"
        :key="key"
        :name="item.label"
      >
        <span slot="label">
          {{item.label}} <span style="color:#9AA4B8">({{item.doc_count}})</span>
        </span>
        <List
          v-if="item.label == activeName"
          :name="item.leixing"
          :coo_company="coo_company"
          :drugname_standard="drugname_standard"
          :company_standard="company_standard"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 新闻资讯
import List from "./xwzx/list";
export default {
  name: "yaowu-xwzx",
  components: { List },
  data() {
    return {
      activeName: "",
      xwzx: [],
      loading: false,
      coo_company: "",
    };
  },
  watch: {
    activeName: {
      handler(val) {
        this.xwzx[val] &&
          _paq.push([
            "trackEvent",
            "button",
            "click",
            "企业版_全球药物_药物详情_新闻资讯_TAB点击_" + this.xwzx[val].label,
          ]);
      },
      immediate: true,
    },
  },
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  methods: {
    handleClickTag(tab, event) {
      this.resetActivePosition(this.$refs.tabs.$el);
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
    getXwzx() {
      this.loading = true;
      Axios({
        url: "/api/globaldrugs/drugNews",
        params: {
          drugname_standard: this.drugname_standard,
          company_standard: this.company_standard,
          coo_company: this.base.company.coo_company
            .map((t) => t.name)
            .join(";"),
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.xwzx = res.data.data.statistics;
            this.activeName = res.data.data.statistics[0].label || "";
          } else {
            this.$root.$emit("hide-section", "新闻资讯");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    initState(t = 0) {
      if (t > 5) {
        this.$root.$emit("hide-section", "新闻资讯");
        return;
      }
      if (this.base && this.base.company && this.base.company.coo_company) {
        this.getXwzx();
      } else {
        setTimeout(() => {
          this.initState(t + 1);
        }, 500);
      }
    },
  },
  mounted() {
    this.initState();
  },
};
</script>

<style scoped lang="less">
@import url(./table-style.less);
.xwzx {
  padding: 10px;
  position: relative;
}
</style>