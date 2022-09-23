<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Ywhc2" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Ywhc2"
          api_name="fzk1"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"></Export>
      </div>
      <div class="item_content1">
        <el-table
          ref="ElTable"
          :height="tableHeight"
          :data="res1"
          stripe
          fixed
          @sort-change="sortChange"
          :default-sort = "order.base ? defaultSort(order.base) : {}"
          class="table"
          style="width: 100%"
          v-if="show_table">
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :sortable="item.sort"
            :min-width="item.field_width || item.width || 100"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'en'">
                <span v-if="vueCheckListPms('Ywhc2', item.label)">{{ scope.row.en }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'pinm'">
                <span v-if="vueCheckListPms('Ywhc2', item.label)">
                  <router-link tag="a" :to="{path:'/fzk1/'+ scope.row.id}" target="_blank" class="cl-blue">
                    {{ scope.row.pinm }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'casn'">
                <span v-if="vueCheckListPms('Ywhc2', item.label)">{{ scope.row.casn }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'fzs'">
                <span v-if="vueCheckListPms('Ywhc2', item.label)" v-html="vueFormulationsFormatter(scope.row.fzs)"></span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'more'">
                <span v-if="vueCheckListPms('Ywhc2', item.label)">
                  <a :href="'https://db.yaozh.com/bigdata/hctp?source=db&dbname=fzk&position=list_zjt&en='+ scope.row.en" target="_blank" class="cl-blue">
                    查看
                  </a>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              </div>
            </template>
          </el-table-column>
        </el-table>

      <div style="positon: relative;">
         <!-- 分页栏 -->
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
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import { mapState } from 'vuex'
  import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import setTableHMixins from '@/mixins/setTableH.js'
  import commonMixins from '@/mixins/common.js'
  const defaultFiled = tablehead.yaowuhecheng.fzk1

  export default {
    components: {
      List,
      Export,
      listCheck
    },
    mixins: [
      setTableHMixins,
      commonMixins
    ],
    data(){
      return{
        vuex_name: 'Ywhc2',
        defaultFiled: defaultFiled,
        filedVisible: false,
        tableHead:[],
        checkallShow: [],
        show_table: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-35-88
      }
    },
    computed: {
      ...mapState({
        tableconf: state => state.Ywhc2.tableconf,
        allBase: state => state.Ywhc2.allBase,
        nopms: state => state.Ywhc2.nopms,
        extendCount: state => state.Ywhc2.extendCount,
        putong: state => state.Ywhc2.putong,
        gaoji: state => state.Ywhc2.gaoji,
        shaixuan: state => state.Ywhc2.shaixuan,
        param: state => state.Ywhc2.param,
        order: state => state.Ywhc2.order,
        listLoading: state => state.Ywhc2.listLoading,
        res1: state => _.keys(state.Ywhc2.res1).length ? state.Ywhc2.res1 : [],
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
          this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled)
        },
    },
    created (){
      this.init()
    },
    mounted () {

    },
    methods:{
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
          Store.dispatch('Ywhc2/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Ywhc2/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
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
    float: right;
    padding: 0 15px;
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

