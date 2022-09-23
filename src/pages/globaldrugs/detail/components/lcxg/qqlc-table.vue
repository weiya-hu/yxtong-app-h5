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
          <div v-if="vueCheckListPms('Clinical', item.label)">
            <!-- 登记号 -->
            <template v-if="item.field === 'me_id'">
              <router-link
                tag="a"
                :title="scope.row.me_id"
                :to="{ path: '/clinical/' + scope.row.id }"
                class="no-underline cl-blue"
                target="_blank"
              >
                {{ scope.row.me_id }}
              </router-link>
            </template>

            <template v-else-if="item.field === 'recruitment'">
              <div :title="scope.row.recruitment" style="width: 100%">
                {{ scope.row.recruitment }}
              </div>
              <div :title="scope.row.recruitment_guifan" style="width: 100%">
                {{ scope.row.recruitment_guifan }}
              </div>
            </template>

            <!-- 靶点 -->
            <template v-else-if="item.field === 'targets_abbr'" :title="''">
              <TooltipBD
                :targets="scope.row.targets"
                :targets_abbr="scope.row.targets_abbr"
              />
            </template>

            <!-- 开始日期 -->
            <template v-else-if="item.field === 'start'" :title="''">
              <template v-if="scope.row.register === 'ClinicalTrials.gov美国'">
                <div
                  v-if="scope.row.start_s"
                  :title="scope.row.start_s + '(计划)'"
                >
                  {{ scope.row.start_s }}(计划)
                </div>
                <div v-if="scope.row.start" :title="scope.row.start + '(实际)'">
                  {{ scope.row.start }}(实际)
                </div>
              </template>
              <div v-else>{{ scope.row.start }}</div>
            </template>

            <!-- 完成日期 -->
            <template v-else-if="item.field === 'completion'" :title="''">
              <template v-if="scope.row.register === 'ClinicalTrials.gov美国'">
                <div
                  v-if="scope.row.completion_s"
                  :title="scope.row.completion_s + '(计划)'"
                >
                  {{ scope.row.completion_s }}(计划)
                </div>
                <div
                  v-if="scope.row.completion"
                  :title="scope.row.completion + '(实际)'"
                >
                  {{ scope.row.completion }}(实际)
                </div>
              </template>
              <div v-else>{{ scope.row.completion }}</div>
            </template>

            <template v-else
              ><span :title="scope.row[item.field]">{{
                scope.row[item.field]
              }}</span></template
            >
          </div>
          <span v-else class="abandon-click-method">暂无权限</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="qqlc_page"
      :page-size="10"
      layout="total, prev, next"  hide-on-single-page
      :total="qqlc_total"
    >
    </el-pagination>
  </div>
</template>

<script>
// 全球临床table
import TooltipBD from "@/components/common/globalCom/target-tooltip";

export default {
  name: "qqlc-table",
  components: { TooltipBD },
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
    request: "",
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
      this.getTableData(val);
    },
    getTableData(page = 1) {
      // const { drugname_standard, company_standard } = this.$route.query;
      this.loading = true;
      Axios({
        url: "/api/Clinical",
        params: {
          keywords: this.drugname_standard,
          sponsors: this.company_standard,
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
        url: "/api/config/view?dbname=clinical",
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
@import url(../table-style.less);
</style>