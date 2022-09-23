<template>
  <div class="target-xwzx" v-waiting="loading">
    <el-tabs v-model="activeName" @tab-click="paneClick">
      <el-tab-pane v-for="(item, key) in xwzx" :key="'target' + key" :name="item.label">
        <div slot="label">
          <span style="color: #333333;">{{ item.label }}</span>
          <span v-if="item.doc_count" style="color: #9AA4B8;">（{{ item.doc_count }}）</span>
        </div>
        <List v-if="item.label == activeName" :base="base" :treeData="treeData" :name="item.leixing" />
        <el-pagination style="border:0 !important;" @current-change="handleCurrentChange" :current-page="xwzxObj.page"
          :page-size="xwzxObj.pageSize" layout="total, prev, next"  hide-on-single-page :total="total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 新闻资讯
import List from "./list";
export default {
  name: "badian-xwzx",
  components: { List },
  data() {
    return {
      xwzxObj: {
        order: null, // 排序
        page: 1, // 页数
        pageSize: 5 // 每页条数
      },
      activeName: "",
      xwzx: [],
      total: 0,
      loading: false,
      treeData: {}
    };
  },
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  watch: {
    base(val) {
      if (this.isEmpty(val)) {
        this.getXwzx();
      }
    }
  },
  methods: {
    async handleCurrentChange(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_新闻资讯_翻页_" + val);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_新闻资讯_翻页_" + val
      ]);
      this.xwzxObj.page = val;
      this.getXwzx();
    },
    paneClick(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_新闻资讯_切换面板");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_新闻资讯_切换面板"
      ]);
      this.activeName = val.name;
      this.xwzxObj.page = 1;
      this.getXwzx(val.name != '全部' ? val.name : '');
    },
    getXwzx(leixing = '') {
      this.loading = true;
      Axios({
        url: "/api/globaldrugs/targetNews",
        params: {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          leixing,
          page: this.xwzxObj.page,
          pageSize: 5
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.treeData = res.data.data.res;
            this.total = res.data.data.res.count;
            this.xwzx = res.data.data.statistics;
            if (!leixing) this.activeName = res.data.data.statistics[0].label || "";
          } else {
            this.$root.$emit('hide-section', '新闻资讯')
          }
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);

.target-xwzx {
  padding: 10px;
  position: relative;
}
</style>