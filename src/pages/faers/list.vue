<template>
  <div class="la-list zdyScrool_Bar">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Faers"
          :showArray="tableHead"
          @changeTableHeader="(list)=>changeTableHeader(this,list)"
          style="text-align:left;"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Faers"
          api_name="faers"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align:left;"
        ></Export>
      </div>
      <div class="item_content1">
        <el-table
          :data="res1"
          ref="ElTable"
          :height="tableHeight"
          stripe
          fixed
          @sort-change="sortChange"
          :default-sort="order.base ? defaultSort(order.base) : {}"
          class="table"
          style="width: 100%"
          v-if="show_table"
        >
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.field_width?item.field_width:100"
            :key="item.prop"
            :sortable="item.order === '1' ? 'custom' : false"
            :label="item.label"
            :fixed="item.is_fixed == '1'"
          >
            <template :slot="1 ? 'header':''" slot-scope="scope">
              <span>
                <NewProjectGuide  postion="列表" :newPosition="{ top: -5, right: getPositonRight(item.order,item.statement) }" :onlyKey="item['new_id']" display="inline" compoentsName="字段" :initItem="item" :showMenban="item['is_show_new']">{{item.label}}</NewProjectGuide>
              </span>
              <el-tooltip
              v-if="item.statement"
              class=""
              effect="zhuce"
              placement="right"
            >
              <div slot="content" v-html="item.statement"></div>
              <i class="el-icon-question cl-green" style="margin-left: 4px;line-height: 28px;"></i>
            </el-tooltip>
            </template>
            <template slot-scope="scope">
              <div :title="Array.isArray(scope.row[item.prop])?scope.row[item.prop].join(';'):scope.row[item.prop]">
                <!-- FAERS报告号 -->
                <div v-if="item.prop === 'primaryid'">
                  <span v-if="vueCheckListPms('Faers', item.label)">
                    <router-link tag="a" :to="{path:'/faers/' + scope.row.primaryid}" style="color:#4877e8;" target="_blank">
                      {{ scope.row.primaryid }}
                    </router-link>
                  </span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 适应症 -->
                <div v-else-if="item.prop === 'indi_pt'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.indi_pt.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 不良事件 -->
                <div v-else-if="item.prop === 'pt'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.pt.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 不良事件结果 -->
                <div v-else-if="item.prop === 'outc_cod'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.outc_cod.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 主要可疑药品 -->
                <div v-else-if="item.prop === 'me_prod_ai_guifan_ps'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.me_prod_ai_guifan_ps.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 次要可疑药品 -->
                <div v-else-if="item.prop === 'me_prod_ai_guifan_ss'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.me_prod_ai_guifan_ss.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 伴随药物 -->
                <div v-else-if="item.prop === 'me_prod_ai_guifan_c'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.me_prod_ai_guifan_c.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 相互作用物 -->
                <div v-else-if="item.prop === 'me_prod_ai_guifan_i'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.me_prod_ai_guifan_i.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 给药途径 -->
                <div v-else-if="item.prop === 'route'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.route.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 剂量 -->
                <div v-else-if="item.prop === 'dose_vbm'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.dose_vbm.join(';') }}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 制造商 -->
                <div v-else-if="item.prop === 'mfr_sndr'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.mfr_sndr}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 报告类型 -->
                <div v-else-if="item.prop === 'rept_cod'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.rept_cod}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- FDA收到报告日期 -->
                <div v-else-if="item.prop === 'fda_dt'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.fda_dt}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 报告者职业 -->
                <div v-else-if="item.prop === 'occp_cod'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.occp_cod}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 事件发生的国家 -->
                <div v-else-if="item.prop === 'occr_country'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.occr_country}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                <!-- 患者性别 -->
                <div v-else-if="item.prop === 'sex'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.sex}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>

                 <!-- 患者年龄分组 -->
                <div v-else-if="item.prop === 'age_grp'">
                  <span v-if="vueCheckListPms('Faers', item.label)">{{ scope.row.age_grp}}</span>
                  <span v-else class="abandon-click-method">暂无权限</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="positon: relative;">
          <el-pagination
            v-if="extendCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.page"
            :page-sizes="[20, 30, 50]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="extendCount"
            :disabled="nopms.fy"
            :class="{'abandon-click-method': nopms.fy}"
          ></el-pagination>
          <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
  import TooltipBD from "@/components/common/globalCom/target-tooltip"
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import { mapState } from "vuex"
  import commonMixins from '@/mixins/common.js'
  import listCheck from "@/components/common/list-check"
  import setTableHMixins from '@/mixins/setTableH.js'
  export default {
    components: {
      TooltipBD,
      List,
      Export,
      listCheck
    },
    mixins: [
      setTableHMixins,
      commonMixins
    ],
    data() {
      return {
        defaultFiled: [],
        filedVisible: false,
        tableHead: [],
        checkallShow: [],
        vuex_name: 'Faers',
        show_table: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      };
    },
    computed: {
      ...mapState({
        tableconf: state => state.Faers.tableconf,
        nopms: state => state.Faers.nopms,
        allBase: state => state.Faers.allBase,
        extendCount: state => state.Faers.extendCount,
        putong: state => state.Faers.putong,
        gaoji: state => state.Faers.gaoji,
        shaixuan: state => state.Faers.shaixuan,
        param: state => state.Faers.param,
        order: state => state.Faers.order,
        listLoading: state => state.Faers.listLoading,
        res1: state =>
          _.keys(state.Faers.res1).length ? state.Faers.res1 : []
      }),
      exportDefaultFiled() {
        let arr = [];
        for (let item of this.defaultFiled) {
          arr.push(item);
        }
        return arr;
      }
    },
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
      res1: {
        handler() {
          this.$nextTick(() => {
            this.registerEven()
          })
        },
        immediate: true
      },
      tableHead: {
        handler() {
          this.$nextTick(() => {
            this.registerEven();
          });
        },
        immediate: true,
      },
      tableconf(n){
        n.forEach(item => {
          item.checked = item.hidden === undefined;
          item.prop = item.field;
        })
        //后台控制列表宽度
        this.defaultFiled = this.tableheaderCombain(n, n)
        this.init();
      }
    },
    methods: {
      // 动态计算new标签的right间距(order为排序标签，statement为提示问号)
      getPositonRight(order, statement) {
        if (order && !statement) {
          return -42
        } else if (!order && statement) {
          return -40
        } else if (order && statement) {
          return -58
        } else {
          return -25
        }
      },
      init() {
        this.tableHead = this.defaultFiled.reduce((res, item) => {
          if (item.checked) {
            res.push(item);
          }
          return res;
        }, []);
      },

      handleCurrentChange(val) {
        this.param.page = val;
        if (val * this.param.pageSize <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Faers/nomalSearch", { params: this.param });
        } else {
          $(".out-of-page").show();
        }
      },
      handleSizeChange(val) {
        this.param.page = 1
        this.param.pageSize = val;
        if (val * this.param.page <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Faers/nomalSearch", { params: this.param });
        } else {
          $(".out-of-page").show();
        }
      }
    },
    created() {
      // this.init();
    },
    mounted() {
    },
    updated() {
      this.vueTogglePmsTooltip();
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.la-list {
  .item_top {
    height: 190px;
    padding: 28px 20px 21px 35px;
    display: flex;
  }
  .item_content {
    height: 408px;
    padding-left: 34px;
    .chart_box {
      background-color: white;
      float: left;
      .echarts {
        width: 760px;
        height: 400px;
      }
    }
  }
  .table /deep/.cell{
    // padding-left: 30px;
    box-sizing: border-box;
  }
  .item_content1 {
    height: auto;
    background-color: white;
    .el-table {
      .el-table__header-wrapper {
        padding-left: 34px;
        background-color: #eaeef9;
        .el-table__header {
          .has-gutter {
            .el-table_3_column_15 {
              width: 169px !important;
            }
          }
        }
      }
      .el-table__body-wrapper {
        .el-table__body {
          .el-table__row td {
            padding-left: 34px;
          }
        }
      }
    }
  }
  .actions {
    position: static;
    float: right;
    padding: 0px 15px;
  }
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
}
.action-btn{
  text-decoration: none;
}
.tpz-pop {
  width: 300px;
}
.under_a{
  text-decoration: underline;
  &:hover{
    color: @PrimaryColor;
    font-weight: 600;
  }
}
</style>
