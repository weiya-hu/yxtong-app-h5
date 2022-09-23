<template>
  <div class="zbxx">
    <div class="notify" style="margin-bottom: 10px">
      数据说明： 此处数据来自药品中标，立即
      <a
        href="/yaopinzhongbiao/list?ga_source=vip&ga_name=globaldrugs_sjts"
        target="_blank"
        onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_药品中标_进入数据库', ])"
        >进入数据库</a
      >
      查看更多数据。
    </div>
    <el-table v-waiting="loading" :data="state">
      <el-table-column
        v-for="item in tableHead"
        :prop="item.field"
        :min-width="item.field_width || item.width || 100"
        :key="item.field"
        :label="item.label"
      >
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
            <div v-if="item.field === 'source'">
              <!-- 链接字段关联关系 -->
              <span v-if="vueCheckListPms('Yaopinzhongbiao', item.label)">
                <a
                  :href="scope.row.down ? scope.row.down : 'javascript:;'"
                  :class="scope.row.down ? 'cl-blue' : 'no-blue'"
                  v-if="!scope.row.down"
                  >{{ scope.row.source }}</a
                >
                <a
                  :href="scope.row.down ? scope.row.down : 'javascript:;'"
                  :class="scope.row.down ? 'cl-blue' : 'no-blue'"
                  target="_blank"
                  v-else
                  >{{ scope.row.source }}</a
                >
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'name'" :title="''">
              <template v-if="vueCheckListPms('CfdaDrug', item.label)">
                <span v-if="scope.row.name" :title="scope.row.name">
                  {{ scope.row.name }}
                </span>
                <span
                  v-if="scope.row.yibao"
                  :title="scope.row.yibao === '甲' ? '医保甲类' : '医保乙类'"
                  class="label-span bg-orange"
                  >{{ scope.row.yibao === "甲" ? "甲" : "乙" }}</span
                >
                <span
                  v-if="scope.row.jiyao"
                  :title="'基药'"
                  class="label-span bg-green"
                  >{{ "基" }}</span
                >
              </template>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'targets'" :title="''">
              <template v-if="vueCheckListPms('CfdaDrug', item.label)">
                <TooltipBD
                  :targets="scope.row.targets"
                  :targets_abbr="scope.row.targets_abbr"
                />
              </template>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else>
              <span v-if="vueCheckListPms('Yaopinzhongbiao', item.label)">{{
                scope.row[item.field]
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
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
// 中标信息
export default {
  name: "zbxx",
  data() {
    return {
      tableHead: [],
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
    getTableData(page = 1) {
      const { drugname_standard, company_standard } = this.$route.query;
      this.loading = true;
      Axios({
        url: "/api/yaopinzhongbiao",
        params: {
          bmname: this.drugname_standard,
          // bmqiye: this.company_standard,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.state = res.data.data.List.res;
            this.page = res.data.data.List.page;
            this.total = res.data.data.List.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
  mounted() {
    this.getTableConf();
    this.getTableData(1);
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.zbxx {
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
.label-span {
  color: #fff;
  border-radius: 10px;
  padding: 0px 10px;
  display: inline-block;
  font-size: 12px;
  // height: 20px;
  line-height: 14px;
}
.bg-green {
  background: #90c31f;
}
.bg-orange {
  background: #f77d54;
}
</style>