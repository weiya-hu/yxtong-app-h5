<template>
  <div class="zbxx">
    <div class="part-title">中标信息</div>
    <div class="table">
        <table>
            <tr>
                <th v-for="(item) in tableHead" :key="item.field">
                    {{item.label}}
                </th>
            </tr>
            <tr v-for="(row,idx) in state" :key="idx">
                <td v-for="(item) in tableHead" :key="item.field+'_'+idx">
                    <div>{{row[item.field]}}</div>
                </td>
            </tr>
        </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "pdf-zbxx",
  data() {
    return {
      tableHead: [],
      state: [],
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
  },
  methods: {
    getTableData(page = 1) {
      
      return Axios({
        url: "/api/yaopinzhongbiao",
        params: {
          bmname: this.drugname_standard,
          // bmqiye: this.company_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.state = res.data.data.List.res||[];
          } else {
            this.$root.$emit('hide-page','中标信息')
          }
        })
        .finally(() => {
          this.$root.$emit("load-page", "中标信息");
        })
    },
    getTableConf() {
      // /config/view?dbname=yaopinzhongbiao
      Axios({
        url: "/api/config/view?dbname=yaopinzhongbiao",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
  },
  async mounted() {
    this.getTableConf();
    await this.getTableData(1);
    if (this.state.length == 0) {
      this.$root.$emit('hide-page','中标信息')
    }
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