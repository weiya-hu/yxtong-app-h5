<template>
  <div class="la-list zdyScrool_Bar">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.dailiangcaigoujzfx}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          精准分析
        </span>
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Dailiangcaigou"
          :showArray="tableHead"
          @changeTableHeader="(list)=>changeTableHeader(this,list)"
          style="text-align:left;"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Dailiangcaigou"
          api_name="dailiangcaigou"
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
            <!-- <template :slot="item.tips ?'header':''">
              <span>
                {{item.label}}
                <el-tooltip  effect="dailiangcaigou" placement="right">
                  <div slot="content" v-html="headDesc[item.prop]"></div>
                  <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
                </el-tooltip>
              </span>
            </template> -->
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
              <div :title="scope.row[item.prop]">
              <!-- 药品名称 -->
              <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Dailiangcaigou', item.label)">
                  <!-- 详情页需要下面的参数请求数据 -->
                  <router-link
                    tag="a"
                    :to="{path:'/dailiangcaigou/detail', query: {paramStr: JSON.stringify({
                      name: scope.row.name,
                      guige: scope.row.guige,
                      baozhuanguige: scope.row.baozhuanguige,
                      feiyong: scope.row.feiyong,
                      shengchanqiye: scope.row.shengchanqiye,
                      type: scope.row.type,
                      packaging: scope.row.packaging,
                      guifanname: scope.row.guifanname,
                      guifanguige: scope.row.guifanguige,
                      guifanqiyezhongbiao: scope.row.guifanqiyezhongbiao
                    })}}"
                    target="_blank"
                    style="color:#4877e8;"
                  >{{ scope.row.name }}</router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- 品种一致性情况 -->
              <div v-else-if="item.prop === 'guifanname'">
                <div v-if="vueCheckListPms('Dailiangcaigou', item.label)" style="color: #4877E8;text-decoration: underline;cursor: pointer;display: inline-block;" @click="goYpYzxpj(scope.row.guifanname)">查看</div>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- 企业一致性情况 -->
              <div v-else-if="item.prop === 'guifanqiyezhongbiao'">
                <div v-if="vueCheckListPms('Dailiangcaigou', item.label)"  style="color: #4877E8;text-decoration: underline;cursor: pointer;display: inline-block;" @click="goQyYzxpj(scope.row.guifanqiyezhongbiao)">查看</div>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- 文件来源 -->
              <div v-else-if="item.prop === 'source'">
                <span v-if="vueCheckListPms('Dailiangcaigou', item.label)">
                  <a
                    :class="{'link-blue': item.urlstyle === '蓝色', 'link-underline': item.urlstyle === '下划线'}"
                    :href="((scope.row[item.parameter] + item.linkcs).indexOf('http') > -1 ? '': 'http://') + scope.row[item.parameter] + (item.linkcs ? item.linkcs : '')"
                    :target="item.target === '新窗口' ? '_blank' : '_self'"
                  >{{ scope.row.source }}</a>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else>
                <span v-if="vueCheckListPms('Dailiangcaigou', item.label)">{{ scope.row[item.prop] }}</span>
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
  import tablehead from "@/config/tablehead"
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
        vuex_name: 'Dailiangcaigou',
        show_table: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      };
    },
    computed: {
      ...mapState({
        tableconf: state => state.Dailiangcaigou.tableconf,
        nopms: state => state.Dailiangcaigou.nopms,
        allBase: state => state.Dailiangcaigou.allBase,
        extendCount: state => state.Dailiangcaigou.extendCount,
        putong: state => state.Dailiangcaigou.putong,
        gaoji: state => state.Dailiangcaigou.gaoji,
        shaixuan: state => state.Dailiangcaigou.shaixuan,
        param: state => state.Dailiangcaigou.param,
        order: state => state.Dailiangcaigou.order,
        listLoading: state => state.Dailiangcaigou.listLoading,
        res1: state =>
          _.keys(state.Dailiangcaigou.res1).length ? state.Dailiangcaigou.res1 : []
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
      sendGa() {
        if (this.nopms && !this.nopms.dailiangcaigoujzfx) {
          window.ga("send","event", "tab", "click", "dailiangcaigou_analy")
          window._paq.push(['trackEvent', 'tab', 'click',  "dailiangcaigou_analy", ])
          let routeData = this.$router.resolve({ path: '/dailiangcaigou/analysis'})
          window.open(routeData.href, '_blank')
        }
      },

      // 品种一致性情况跳转到一致性评价进度页面
      goYpYzxpj(name) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          `dailiangcaigoudrugs_yzxjd__${name}`
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          `dailiangcaigoudrugs_yzxjd__${name}`,
        ]);

        let routerData = this.$router.resolve({
          path: "/yzxjd",
          query: {
            ypname: name,
          },
        });
        window.open(routerData.href, "_blank");
      },

      // 企业一致性情况跳转到一致性评价进度页面
      goQyYzxpj(name) {
        window.ga(
          "send",
          "event",
          "button",
          "click",
          `dailiangcaigoudrugs_yzxjd__${name}`
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          `dailiangcaigoudrugs_yzxjd__${name}`,
        ]);

        let routerData = this.$router.resolve({
          path: "/yzxjd",
          query: {
            qyname: name,
          },
        });
        window.open(routerData.href, "_blank");
      },

      handleCurrentChange(val) {
        this.param.page = val;
        if (val * this.param.pageSize <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Dailiangcaigou/nomalSearch", { params: this.param });
        } else {
          $(".out-of-page").show();
        }
      },
      handleSizeChange(val) {
        this.param.page = 1
        this.param.pageSize = val;
        if (val * this.param.page <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Dailiangcaigou/nomalSearch", { params: this.param });
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

