<template>
  <div class="csco">

    <el-table v-waiting="loading" :data="state">
      <el-table-column
        v-for="head in tableHead"
        :key="head.key"
        :prop="head.key"
        :label="head.name"
      >
        <template slot-scope="{ row }">
          <div>
            <el-popover :trigger="row[head.key]?'hover':''" placement="left" width="300">
              <div>
                {{ row[head.key] }}
              </div>
              <div slot="reference">
                {{ row[head.key] }}
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <template slot="append">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="10"
          layout="total, prev, next"
          hide-on-single-page
          :total="total"
        >
        </el-pagination>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "csco",
  data() {
    return {
      tableHead: [
        {
          name: "用药/治疗措施",
          key: "yongyao",
        },
        {
          name: "适应症",
          key: "indication",
        },
        {
          name: "分级(1)",
          key: "fenji1",
        },
        {
          name: "分级(2)",
          key: "fenji2",
        },
        {
          name: "分级(3)",
          key: "fenji3",
        },
        {
          name: "线数",
          key: "lines",
        },
        {
          name: "推荐级别",
          key: "tuijian",
        },
        {
          name: "证据类型",
          key: "zhengju",
        },
        {
          name: "补充资料",
          key: "buchong2",
        },
      ],
      state: [],
      total: 0,
      page: 0,
      loading: false,
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
    handleCurrentChange(e) {
      console.log(e);
      this.getTableData(e);
    },
    // /globaldrugs/drugCsco
    getTableData(page = 1) {
      this.loading = true;
      Axios({
        url: "/api/globaldrugs/drugCsco",
        params: {
          drugname_standard: this.drugname_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.state = res.data.data.res;
            this.total = res.data.data.count;
            this.page = res.data.data.page;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getTableData(1);
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.csco {
  padding: 10px;
}
</style>