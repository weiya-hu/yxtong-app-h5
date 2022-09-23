<template>
  <div class="lcxg" v-waiting="loading">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-if="countMap[0] && countMap[0].count != 0"
        :label="`全球临床试验${
          countMap[0] ? '（' + countMap[0].count + '）' : ''
        }`"
        name="first"
      >
        <qqlc-table
          v-if="activeName == 'first'"
          :request="countMap[0].request"
          :drugname_standard="drugname_standard"
          :company_standard="company_standard"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="`临床结果${countMap[1] ? '（' + countMap[1].count + '）' : ''}`"
        v-if="countMap[1] && countMap[1].count != 0"
        name="second"
      >
        <lcjg-table
          v-if="activeName == 'second'"
          :request="countMap[1].request"
          :drugname_standard="drugname_standard"
          :company_standard="company_standard"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="`中国临床试验${
          countMap[2] ? '（' + countMap[2].count + '）' : ''
        }`"
        v-if="countMap[2] && countMap[2].count != 0"
        name="third"
      >
        <zglc-table
          v-if="activeName == 'third'"
          :request="countMap[2].request"
          :drugname_standard="drugname_standard"
          :company_standard="company_standard"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="`临床文献${countMap[3] ? '（' + countMap[3].count + '）' : ''}`"
        v-if="countMap[3] && countMap[3].count != 0"
        name="fourth"
      >
        <lcwx-table
          :drugids="drugids"
          v-if="activeName == 'fourth'"
          :request="countMap[3].request"
          :drugname_standard="drugname_standard"
          :company_standard="company_standard"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 临床相关
import QqlcTable from "./lcxg/qqlc-table";
import LcjgTable from "./lcxg/lcjg-table";
import ZglcTable from "./lcxg/zglc-table";
import LcwxTable from "./lcxg/lcwx-table";
export default {
  name: "lcxg",
  components: { QqlcTable, LcjgTable, ZglcTable, LcwxTable },
  data() {
    return {
      activeName: "",
      countMap: [],
      drugids: "",
      loading: true
    };
  },
  watch: {
    activeName: {
      handler(val) {
        const maps = {
          first: "全球临床试验",
          second: "临床结果",
          third: "中国临床试验",
          fourth: "临床文献",
        };

        maps[val] &&
          _paq.push([
            "trackEvent",
            "button",
            "click",
            "企业版_全球药物_药物详情_临床相关_TAB点击_" + maps[val],
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
    initState(t = 0) {
      this.loading = true
      if (t > 5) {
        this.loading = false
        this.$root.$emit("hide-section", "临床相关");
        return;
      }
      if (this.base && this.base.drugids) {
        this.drugids = this.base.drugids;
        Axios({
          method: "post",
          url: "/api/globaldrugs/drugClinicalStatistics",
          data: {
            drugname_standard: this.drugname_standard,
            company_standard: this.company_standard,
            drugids: this.base.drugids,
          },
        }).then((res) => {
          if (res.data.code == 200) {
            // this.activeName = "first";
            const maps = ["first", "second", "third", "fourth"];
            const itx = res.data.data.findIndex((t) => t.doc_count > 0);
            if (itx == -1) {
              this.$root.$emit("hide-section", "临床相关");
            }
            this.countMap = res.data.data.map((t) => ({
              count: t.doc_count,
              request: t.key,
            }));
            this.activeName = maps[itx];
          }
        }).finally(() => {
          this.loading = false
        });
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
.lcxg {
  padding: 10px;
  position: relative;
  min-height: 300px;
}
</style>