<template>
  <div>
    <el-table v-waiting="loading" :data="qqlc" style="width: 100%">
      <el-table-column
        v-for="item in tableHead"
        :prop="item.field"
        :min-width="item.field_width || item.width || 100"
        :key="item.field"
        :label="item.label"
      >
        <!-- :fixed="item.is_fixed == '1'" -->
        <!-- :sortable="item.sort" -->
        <!-- <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="" effect="zhuce" placement="right">
                <div slot="content">{{helpDesc.setList}}</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template> -->
        <template :slot="1 ? 'header' : ''" slot-scope="scope">
          <span>
            {{ item.label }}
          </span>
          <el-tooltip
            v-if="item.statement"
            class=""
            effect="zhuce"
            placement="right"
          >
            <div slot="content" v-html="item.statement"></div>
            <i
              class="el-icon-question cl-green"
              style="margin-left: 4px; line-height: 28px"
            ></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div :title="scope.row[item.field]">
            <div v-if="item.field === 'me_id'">
              <span
                v-if="vueCheckListPms('Linchuangshiyan', item.label)"
                class="cell-shoulihao-wrap"
              >
                <router-link
                  tag="a"
                  :to="{ path: '/linchuangshiyan/' + scope.row.id }"
                  class="cell-shoulihao no-underline cl-blue"
                  target="_blank"
                >
                  {{ scope.row.me_id }}
                </router-link>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'targets'">
              <template v-if="vueCheckListPms('Linchuangshiyan', item.label)">
                <TooltipBD
                  :targets="scope.row.targets"
                  :targets_abbr="scope.row.targets_abbr"
                />
              </template>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>

            <div v-else>
              <span v-if="vueCheckListPms('Linchuangshiyan', item.label)">{{
                scope.row[item.field]
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="qqlc_page"
      :page-size="10"
      layout="total, prev, next"
      hide-on-single-page
      :total="qqlc_total"
    >
    </el-pagination>
  </div>
</template>

<script>
// 全球临床table
export default {
  name: "qqlc-table",
  data() {
    return {
      tableHead: [],
      qqlc: [],
      qqlc_page: 0,
      qqlc_total: 0,
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
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getZglc(val);
    },
    getZglc(page = 1) {
      this.loading = true;
      // const { drugname_standard, company_standard } = this.$route.query;
      Axios({
        url: "/api/linchuangshiyan/basegroup",
        params: {
          name: this.drugname_standard,
          company: this.company_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.qqlc = res.data.data.List.res;
            this.qqlc_page = res.data.data.List.page;
            this.qqlc_total = res.data.data.List.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTableConf() {
      // /config/view?dbname=clinical
      Axios({
        url: "/api/config/view?dbname=linchuangshiyan",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },
  },
  mounted() {
    this.getZglc();
    this.getTableConf();
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
</style>