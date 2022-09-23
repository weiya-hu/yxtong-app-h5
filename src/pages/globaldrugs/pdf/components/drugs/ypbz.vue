<template>
  <div class="ypbz">
    <div class="part-title">药品标准</div>
    <div class="table">
      <table>
        <tr>
          <th v-for="item in tableHead" :key="item.field">
            {{ item.label }}
          </th>
        </tr>
        <tr v-for="(row, idx) in state" :key="idx">
          <td v-for="item in tableHead" :key="item.field + '_' + idx">
            <div v-if="item.readtype == '单独开发'" v-html="row.down"></div>
            <span v-else>{{ row[item.field] }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "pdf-ypbz",
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
  data() {
    return {
      tableHead: [],
      state: [],
      page: 0,
      total: 0,
      loading: false,
    };
  },
  methods: {
    getTableData(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.loading = true;
      Axios({
        url: "/api/biaozhun",
        params: {
          name: this.drugname_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.state = res.data.data.res;
            this.page = res.data.data.page;
            this.total = res.data.data.count;
          } else {
            this.$root.$emit("hide-page", "药品标准");
          }
        })
        .finally(() => {
          this.loading = false;
          this.$root.$emit("load-page", "药品标准");
        });
    },
    getTableConf() {
      // /config/view?dbname=biaozhun
      Axios({
        url: "/api/config/view?dbname=biaozhun",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
  },
  mounted() {
    this.getTableConf();
    this.getTableData(1);
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