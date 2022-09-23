<template>
  <div class="ypbz" v-waiting="loading" style="min-height: 300px">
    <div class="notify">
      数据说明： 此处数据来自中国药品标准，立即
      <a href="/biaozhun?ga_source=vip&ga_name=globaldrugs_sjts" target="_blank"
      onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_中国药品标准_进入数据库', ])"
        >进入数据库</a
      >
      查看更多数据。
    </div>
    <el-table :data="state" style="width: 100%">
      <el-table-column
        v-for="item in tableHead"
        :prop="item.field"
        :min-width="item.field_width || item.width || 100"
        :key="item.field"
        :label="item.label"
      >
        <template slot-scope="{ row }">
          <div v-if="item.readtype == '单独开发'" v-html="row.down"></div>
          <span v-else>{{ row[item.field] }}</span>
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
// 数据透视 药品标准
export default {
  name: "ypbz",
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
    handleCurrentChange(e) {
      console.log(e);
      this.getTableData(e);
    },
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
          if (res.data.code == 200) {
            this.state = res.data.data.res;
            this.page = res.data.data.page;
            this.total = res.data.data.count;
          }
        })
        .finally(() => {
          this.loading = false;
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
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.ypbz {
  padding: 10px;
  .notify {
    font-size: 13px;
    a {
      color: #002fa7;
      text-decoration: underline;
      // font-size: 14px;
    }
  }
}
</style>