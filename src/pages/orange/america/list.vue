<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions" :style="posi">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="FdaProducts" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" style="text-align:left;" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="FdaProducts"
          api_name="fdaproducts"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
           style="text-align:left;"></Export>
      </div>
      <div class="item_content1">
        <el-table
          ref="ElTable"
          :height="tableHeight"
          :data="res1"
          stripe
          fixed
          class="table"
          style="width: 100%"
          @sort-change="sortChange"
          :default-sort = "order.base ? defaultSort(order.base) : {}"
          v-if="show_table">
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.field_width || item.width || 100"
            :key="item.prop"
            :sortable="item.sort"
            :label="item.label">
            <template :slot="item.tips ? 'header':''" slot-scope="scope">
              <span>
                {{item.label}}
                <el-tooltip class="" effect="zhuce" placement="right">
                  <div slot="content" v-if="item.prop=='rld'">{{helpDesc.canbi}}</div>
                  <div slot="content" v-else-if="item.prop=='rs'">{{helpDesc.biaozhun}}</div>
                  <div slot="content" v-else-if="item.prop=='te_code'">{{helpDesc.te}}</div>
                  <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
                </el-tooltip>
              </span>
            </template>
            <template slot-scope="scope">
              <div :title="nbspToSpace(scope.row[item.prop])">
              <div v-if="item.prop === 'appl_no'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">
                  <router-link tag="a" :to="{path:'/fdaproducts/' + scope.row.id}" target="_blank" class="cl-blue" v-html="scope.row.appl_no"></router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'product_no'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.product_no }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'trade_name'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.trade_name }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'cname'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.cname }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'ingredient'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.ingredient }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'df_route'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.df_route }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'strength'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.strength }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'applicant'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.applicant }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'pzendtime'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.pzendtime }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'rld'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.rld }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'rs'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.rs }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'type'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.type }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'te_code'">
                <span v-if="vueCheckListPms('FdaProducts', item.label)">{{ scope.row.te_code }}</span>
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
            :class="{'abandon-click-method': nopms.fy}">
          </el-pagination>
          <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
  import List from '@/components/layouts/list'
  import Export from "@/components/common/export"
  import { mapState } from 'vuex'
  import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.orange.america
  export default {
    components:{
      List,
      Export,
      listCheck
    },
    mixins: [
      commonMixins,
      setTableHMixins
    ],
    data(){
      return{
        defaultFiled: defaultFiled,
        filedVisible: false,
        tableHead:[],
        vuex_name: 'FdaProducts',
        checkallShow: [],
        show_table: true,
        helpDesc: {
          canbi: '简称RLD，是指在我国批准上市，用于仿制药注册申请的参照药品。通常是具有完整规范的安全性和有效性研究数据的药品。',
          biaozhun: '简称RS，是指在我国批准上市，用于人体生物等效性研究的对照药品。通常最大规格的参比制剂被确定为标准制剂。',
          te: '治疗等效性评价代码，目的是能够让使用者快速了解收录的药品是否治疗等效及是否采用了生物等效性试验确定治疗等效。'
        },
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-35-88,
        posi: 'position:static;text-align:right;padding:0 15px;'
      }
    },
    computed: {
      ...mapState({
        tableconf: state => state.FdaProducts.tableconf,
        nopms: state => state.FdaProducts.nopms,
        allBase: state => state.FdaProducts.allBase,
        extendCount: state => state.FdaProducts.extendCount,
        putong: state => state.FdaProducts.putong,
        gaoji: state => state.FdaProducts.gaoji,
        shaixuan: state => state.FdaProducts.shaixuan,
        param: state => state.FdaProducts.param,
        listLoading: state => state.FdaProducts.listLoading,
        res1: state => _.keys(state.FdaProducts.res1).length ? state.FdaProducts.res1 : [],
        order: state => state.FdaProducts.order
      }),
      exportDefaultFiled () {
        let arr = []
        for (let item of defaultFiled) {
          arr.push(item)
        }
        return arr
      },
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
        // console.info(123)
        this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled)
      },
    },
    methods: {
      //空格符转换
      nbspToSpace(str) {
        var arrEntities = {'nbsp' : ' '};
        if(!str) return str
        return str.replace(/&(nbsp);/ig, function(all, t){
          return arrEntities[t]
        })
      },
      init () {
        this.tableHead = this.defaultFiled.reduce((res, item) => {
          if(item.checked){
            res.push(item)
          }
          return res
        }, [])
      },
      handleCurrentChange (val) {
        this.param.page = val
        if (val * this.param.pageSize <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('FdaProducts/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('FdaProducts/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      }
    },
    created (){
      this.init()
    },
    mounted () {
    },
    updated () {
      if (this.param.pageSize * this.param.page <= 1500) {
        $('.out-of-page').hide()
      } else {
        $('.out-of-page').show()
      }
      this.vueTogglePmsTooltip()
    },
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
// @import "~@/assets/less/app.less";

.la-list{
    .item_top {
      height: 190px;
      padding: 28px 20px 21px 35px;
      display: flex;
      .content_one {
        margin: 0px 5px;
        flex-grow: 1;
        background-color: #F5F8FB;
        padding-right: 30px;
        float: left;
        .content_title {
          padding-top: 15px;
          .content_shenbao {
            width: 140px;
            height: 40px;
            margin: 0 auto;
            line-height: 40px;
            .shenbao_left {
              width: 30px;
              height: 1px;
              background: #4A77E8;
              margin-top: 17px;
              float: left;
            }
            .shenbao_word {
              margin: 0 10px;
              float: left;
              font-size: 14px;
              color: #4A77E8;
            }
          }
        }
        .contents {
          width: 100%;
          padding-left: 34px;
          display:flex;
          .content_total {
            flex-grow: 1;
            width: 52px;
            height: 94px;
            text-align: center;
            float: left;
            margin-right: 36px;
            .total_item1 {
              padding-top: 10px;
              font-size: 12px;
            }
            .total_item2 {
              padding-top: 14px;
              span {
                font-size: 20px;
                color: #4A77E8;
              }
            }
          }
        }
      }
      .content_two {
        margin-left: 12px;
        background-color: #F5F8FB;
        float: left;
        .content_title {
          padding-top: 15px;
          .content_shenbao {
            width: 140px;
            height: 40px;
            margin: 0 auto;
            line-height: 40px;
            .shenbao_left {
              width: 30px;
              height: 1px;
              background: #4A77E8;
              margin-top: 17px;
              float: left;
            }
            .shenbao_word {
              margin: 0 10px;
              float: left;
              font-size: 14px;
              color: #4A77E8;
            }
          }
        }
        .contents {
          background: #5f88eb;
          padding-left: 34px;
          .content_total {
            width: 52px;
            height: 94px;
            text-align: center;
            float: left;
            margin-right: 40px;
            .total_item1 {
              padding-top: 10px;
              font-size: 12px;
            }
            .total_item2 {
              padding-top: 14px;
              span {
                font-size: 20px;
                color: #4A77E8;
              }
            }
          }
        }
      }
      .content_three {
        margin-left: 12px;
        background-color: #F5F8FB;
        float: left;
        .content_title {
          padding-top: 15px;
          .content_shenbao {
            width: 140px;
            height: 40px;
            margin: 0 auto;
            line-height: 40px;
            .shenbao_left {
              width: 30px;
              height: 1px;
              background: #4A77E8;
              margin-top: 17px;
              float: left;
            }
            .shenbao_word {
              margin: 0 10px;
              float: left;
              font-size: 14px;
              color: #4A77E8;
            }
          }
        }
        .contents {
          background: #5f88eb;
          padding-left: 34px;
          .content_total {
            width: 52px;
            height: 94px;
            text-align: center;
            float: left;
            margin-right: 42px;
            .total_item1 {
              padding-top: 10px;
              font-size: 12px;
            }
            .total_item2 {
              padding-top: 14px;
              span {
                font-size: 20px;
                color: #4A77E8;
              }
            }
          }
        }
      }
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
    .item_content1{
      position: relative;
      height: auto;
      background-color: white;
      .el-table{
        .el-table__header-wrapper{
          padding-left: 34px;
          background-color: #EAEEF9;
          .el-table__header{
            .has-gutter{
              .el-table_3_column_15{
                width: 169px !important;
              }
            }
          }
        }
        .el-table__body-wrapper{
          .el-table__body{
            .el-table__row td{
              padding-left: 34px;
          }
          }
        }
      }
    }
    .actions{
      position: static;
      padding: 0 15px;
      float: right;
    }
  }
.item_content1{
  .label{
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
}
</style>
