<template>
  <div>
    <el-table v-waiting="loading" :data="qqlc" style="width: 100%">
      <el-table-column
        v-for="item in tableHead"
        :prop="item.prop"
        :key="item.prop"
        :min-width="item.width || 100"
        :label="item.label"
      >
        <!-- :sortable="item.sort" -->
        <template :slot="1 ? 'header' : ''" slot-scope="scope">
          <span>{{ item.label }}</span>
          <el-tooltip
            v-if="item.prop == 'me_id'"
            class=""
            effect="zhuce"
            placement="right"
          >
            <div
              slot="content"
              v-html="
                '点击登记号直接跳转到详情页“临床结果文献”板块，查看具体结果信息。'
              "
            ></div>
            <i
              class="el-icon-question cl-green"
              style="margin-left: 4px; line-height: 28px"
            ></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div :title="scope.row[item.prop]">
            <template v-if="item.prop === 'me_id'">
              <router-link
                tag="a"
                :title="scope.row.me_id"
                :to="{
                  path: `/clinical/${scope.row.id}?linkModule=临床结果文献`,
                }"
                class="no-underline cl-blue"
                target="_blank"
              >
                {{ scope.row.me_id }}
              </router-link>
            </template>
            <template v-else-if="item.prop === 'targets'" :title="''">
              <TooltipBD
                :targets="scope.row.targets"
                :targets_abbr="scope.row.targets_abbr"
              />
            </template>
            <template v-else-if="item.prop === 'title'">
              <a
                tag="a"
                :title="scope.row.title"
                v-if="
                  scope.row.url1 ||
                  scope.row.url2 ||
                  scope.row.url3 ||
                  scope.row.url
                "
                :href="
                  scope.row.url1 ||
                  scope.row.url2 ||
                  scope.row.url3 ||
                  scope.row.url
                "
                class="no-underline cl-blue"
                target="_blank"
              >
                {{ scope.row.title }}
              </a>
              <span v-else :title="scope.row.title">{{ scope.row.title }}</span>
            </template>
            <div v-else>{{ scope.row[item.prop] }}</div>
          </div>
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
import tablehead from "@/config/tablehead";
import TooltipBD from "@/components/common/globalCom/target-tooltip";

const defaultFiled = tablehead.clinical.lcjg;

export default {
  name: "qqlc-table",
  components: { TooltipBD },
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
  data() {
    return {
      qqlc: [],
      tableHead: [],
      checkedFiled: [],

      defaultFiled: defaultFiled,
      qqlc_page: 0,
      qqlc_total: 0,
      loading: false,
    };
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getLcjgData(val);
    },
    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },
    getLcjgData(page = 1) {
      this.loading = true;
      Axios({
        url: "/api/Clinical/clinicalresultsgroup",
        params: {
          keywords: this.drugname_standard,
          sponsors: this.company_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.qqlc = res.data.data.res;
            this.qqlc_page = res.data.data.page;
            this.qqlc_total = res.data.data.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  watch: {},

  mounted() {
    this.getLcjgData();
    this.init();
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);

/deep/.el-table__append-wrapper {
  position: sticky;
  left: 0;
  top: 412px;
  background-color: #fff;
  z-index: 5;
}
</style>