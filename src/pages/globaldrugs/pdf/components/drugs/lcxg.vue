<template>
  <div class="lcxg">
    <div class="part-title">临床相关</div>
    <template v-if="qqlc.length">
      <div class="part-sub-title">全球临床试验:</div>
      <div class="table">
        <table>
          <tr>
            <th
              :style="{ width: `calc(100% / ${qqlcHead.length})` }"
              v-for="(head, hi) in qqlcHead"
              :key="hi"
            >
              {{ head.label }}
            </th>
          </tr>
          <tr v-for="(row, idx) in qqlc" :key="idx">
            <td v-for="(head, hi) in qqlcHead" :key="hi">
              <div>{{ row[head.field] || "-" }}</div>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-if="lcjg.length">
      <div class="part-sub-title">临床结果:</div>
      <div class="table">
        <table>
          <tr>
            <th
              :style="{ width: `calc(100% / ${lcjgHead.length})` }"
              v-for="(head, hi) in lcjgHead"
              :key="hi"
            >
              {{ head.label }}
            </th>
          </tr>
          <tr v-for="(row, idx) in lcjg" :key="idx">
            <td v-for="(head, hi) in lcjgHead" :key="hi">
              <div>{{ row[head.prop] || "-" }}</div>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-if="zglc.length">
      <div class="part-sub-title">中国临床试验:</div>
      <div class="table">
        <table>
          <tr>
            <th
              :style="{ width: `calc(100% / ${zglcHead.length})` }"
              v-for="(head, hi) in zglcHead"
              :key="hi"
            >
              {{ head.label }}
            </th>
          </tr>
          <tr v-for="(row, idx) in zglc" :key="idx">
            <td v-for="(head, hi) in zglcHead" :key="hi">
              <div>{{ row[head.field] || "-" }}</div>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-if="lcwx.length">
      <div class="part-sub-title">临床文献:</div>
      <div class="table">
        <table>
          <tr>
            <th
              :style="{ width: `calc(100% / ${lcwxHead.length})` }"
              v-for="(head, hi) in lcwxHead"
              :key="hi"
            >
              {{ head.label }}
            </th>
          </tr>
          <tr v-for="(row, idx) in lcwx" :key="idx">
            <td v-for="(head, hi) in lcwxHead" :key="hi">
              <div>
                {{ row[head.field] || "-" }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import lcjghead from "@/config/tablehead";

const defaultLcjgFiled = lcjghead.clinical.lcjg;

export default {
  name: "pdf-lcxg",
  data() {
    return {
      qqlc: [],
      qqlcHead: [],
      lcjg: [],
      lcjgHead: [],
      zglc: [],
      zglcHead: [],
      lcwx: [],
      lcwxHead: [
        { label: "文献标题", field: "title" },
        { label: "文献来源", field: "qikan" },
        { label: "文献发布日期", field: "day" },
        { label: "最优剂量有效性", field: "yxx" },
        { label: "结果倾向", field: "resultsqx" },
        { label: "结果简介", field: "results" },
      ],
    };
  },
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  methods: {
    getQqlcData(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      return Axios({
        url: "/api/Clinical",
        params: {
          keywords: this.drugname_standard,
          sponsors: this.company_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200&& this.isEmpty(res.data.data)) {
            this.qqlc = res.data.data.List.res;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getQqlcConf() {
      // /config/view?dbname=clinical
      Axios({
        url: "/api/config/view?dbname=clinical",
      }).then((res) => {
        if (res.data.code == 200) {
          this.qqlcHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
    getLcjgData(page = 1) {
      return Axios({
        url: "/api/Clinical/clinicalresultsgroup",
        params: {
          keywords: this.drugname_standard,
          sponsors: this.company_standard,
          page,
          pageSize: 10,
        },
      }).then((res) => {
        if (res.data.code == 200&& this.isEmpty(res.data.data)) {
          this.lcjg = res.data.data.res;
        }
      });
    },
    getLcjgConf() {
      this.lcjgHead = defaultLcjgFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },
    getZglcData(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      return Axios({
        url: "/api/linchuangshiyan/basegroup",
        params: {
          name: this.drugname_standard,
          company: this.company_standard,
          page,
          pageSize: 10,
        },
      }).then((res) => {
        if (res.data.code == 200&& this.isEmpty(res.data.data)) {
          this.zglc = res.data.data.List.res;
        }
      });
    },
    getZglcConf() {
      // /config/view?dbname=clinical
      Axios({
        url: "/api/config/view?dbname=linchuangshiyan",
      }).then((res) => {
        if (res.data.code == 200) {
          this.zglcHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
    getWxData(page = 1, count = 0) {
      return Axios({
        url: "/api/globaldrugs/drugClinicalLiterature",
        method:'post',
        data: {
          drugids: this.base.drugids,
          page,
          pageSize: 10,
        },
      }).then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.lcwx = res.data.data.res;
        }
      });
    },
  },
  async mounted() {
    await this.getQqlcData();
    this.getQqlcConf();
    await this.getLcjgData();
    this.getLcjgConf();
    await this.getZglcData();
    this.getZglcConf();
    await this.getWxData();
    if ((this.qqlc.length+this.lcjg.length+this.zglc.length+this.lcwx.length)== 0) {
      this.$root.$emit('hide-page','临床相关')
    }
    this.$root.$emit("load-page", "临床相关");
  },
};
</script>

<style scoped lang="less">
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
}
.part-sub-title {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  border-left: 2px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
  margin-left: 10px;
}
.table {
  position: relative;
  padding-left: 10px;
  min-height: 50px;
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      height: 30px;
      background-color: #ebeef5;
      font-size: 12px;
    }
    td {
      padding: 5px;
      border: 1px solid #ebeef5;
      word-break: break-all;
      font-size: 12px;
      & > div {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
</style>