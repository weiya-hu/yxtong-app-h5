<template>
  <div class="csco">
    <div class="part-title">CSCO指南</div>
    <div class="table">
      <table>
        <tr>
          <th 
          :style="{width: head.width?head.width+'px':'auto'}"
          v-for="head in tableHead" :key="head.key">{{ head.name }}</th>
        </tr>
        <tr v-for="(row, idx) in state" :key="idx">
          <td v-for="head in tableHead" :key="idx + '_' + head.key">
            <div>{{ row[head.key] || "-" }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "pdf-csco",
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
      tableHead: [
        {
          name: "用药/治疗措施",
          key: "yongyao",
          width: 100,
        },
        {
          name: "适应症",
          key: "indication",
          width: 80,
        },
        {
          name: "分级(1)",
          key: "fenji1",
          width: 80,
        },
        {
          name: "分级(2)",
          key: "fenji2",
          width: 80,
        },
        {
          name: "分级(3)",
          key: "fenji3",
          width: 80,
        },
        {
          name: "线数",
          key: "lines",
          width: 50,
        },
        {
          name: "推荐级别",
          key: "tuijian",
          width: 60,
        },
        {
          name: "证据类型",
          key: "zhengju",
          width: 60,
        },
        {
          name: "补充资料",
          key: "buchong2",
        },
      ],
      state: [],
    };
  },
  methods: {
    // /globaldrugs/drugCsco
    getTableData(page = 1) {
      Axios({
        url: "/api/globaldrugs/drugCsco",
        params: {
          drugname_standard: this.drugname_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200 && this.isEmpty(res.data.data)) {
            this.state = res.data.data.res;
            if (this.state.length == 0) {
              this.$root.$emit("hide-page", "CSCO指南");
            }
          } else {
            this.$root.$emit("hide-page", "CSCO指南");
          }
        })
        .finally(() => {
          this.$root.$emit("load-page", "CSCO指南");
        });
    },
  },
  mounted() {
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