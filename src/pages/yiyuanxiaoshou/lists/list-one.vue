<template>
  <div class="la-slh">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.ksh}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          <!-- <img class="action-ico" src="../../../../static/imgs/echarts/znfx.png" alt="" srcset="">
          <img class="action-ico hover" src="../../../../static/imgs/echarts/znfx-a.png" alt="" srcset=""> -->
          <span style="line-height:1">智能分析</span>
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Yyxs" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" style="text-align:left;" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Yyxs"
          api_name="yyxs"
          :max_num="extendCount.listCount"
          :defaultFiled="defaultFiled"
          outdataAction="base"
          style="text-align:left;"></Export>
      </div>
      <el-table
        ref="ElTable"
        :height="tableHeight"
        :data="res1"
        stripe
        fixed
        class="table"
        @sort-change="sortChange"
        :default-sort = "order.base ? defaultSort(order.base) : {}"
        style="width: 100%"
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
                <div slot="content">为最小制剂单位的销量，例如片、丸、粒、袋、支、瓶等</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <div v-if="item.prop === 'targets'">
              <TooltipBD :targets="scope.row.targets" :targets_abbr="scope.row.targets_abbr" />
            </div>
            <div v-else :title="scope.row[item.prop]">
              <span v-if="vueCheckListPms('Yyxs', item.label)">{{ (item.prop==='sale')?echartsTooltipMoney(scope.row[item.prop]):(item.prop==='amount')?echartsTooltipMoney(scope.row[item.prop], 1):scope.row[item.prop]?scope.row[item.prop]:'-' }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="extendCount.listCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.listCount"
          :disabled="nopms.fy"
          :class="{'abandon-click-method': nopms.fy}">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
    </List>
  </div>
</template>
<script>
  import TooltipBD from "@/components/common/globalCom/target-tooltip"
  import Export from '@/components/common/export'
  import List from '@/components/layouts/list'
  import { mapState } from 'vuex'
  import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.yyxs.year
  export default{
    components: {
      TooltipBD,
      List,
      Export,
      listCheck
    },
    mixins: [
      commonMixins,
      setTableHMixins
    ],
    data (){
      return {
        defaultFiled: defaultFiled,
        tableHead:[],
        vuex_name: 'Yyxs',
        checkallShow: [],
        show_table: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88,
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        allBase: state => state.Yyxs.allBase,
        tableconf: state => state.Yyxs.tableconf,
        res1: state => _.keys(state.Yyxs.res1).length ? state.Yyxs.res1.res : [],
        errocode: state => state.Yyxs.error,
        listLoading: state => state.Yyxs.listLoading,
        params: state => state.Yyxs.putong,
        words: state => state.Yyxs.gaoji,
        group: state => state.Yyxs.shaixuan,
        extendCount: state => state.Yyxs.extendCount,
        nopms: state => state.Yyxs.nopms,
        param: state => state.Yyxs.year_param, // 附加参数(存于vuex内)
        order: state => state.Yyxs.order
      }),
    },
    methods: {

      // 跳转到智能分析
      sendGa() {
        if (this.nopms && !this.nopms.ksh) {
          window.ga("send","event", "tab", "click", "yyxs_analy");
          window._paq.push(['trackEvent', 'tab',"click", "yyxs_analy", ])
          this.$router.push({ path: '/yyxs/analy'})
        }
      },

      init () {
        console.log(this.defaultFiled);
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
          Store.dispatch('Yyxs/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Yyxs/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      }
    },
    created () {
      this.init()
    },
    mounted (){

    },
    updated () {
      this.vueTogglePmsTooltip()
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
        handler(n, o) {
          this.$nextTick(() => {
            this.registerEven();
          });
        },
        immediate: true,
      },
      tableconf(n){
        this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled)
      },
      checkedFiled () {
        this.tableHead = []
        this.defaultFiled = _.map(defaultFiled,item=>{
          if(this.checkedFiled.indexOf(item.prop) != -1){
            item.checked = true
            this.tableHead.push(item)
          }else{
            item.checked = false
          }
          return item
        })
      }
    }
  }
</script>
<style lang="less">
@import "~@/assets/less/var.less";


  .la-slh{
    min-height: 100px;
    .no-data-msg {
      width: 100%;
      text-align: center;
      font-weight: bold;
      // font-size: 20px;
    }
  }
  .yxsp-icon {
    display: inline-block;
    font-size: 9px;
    padding: 1px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    border-radius: 8px;
    background: @McTypeGreen;
  }
  .zdzx-icon {
    display: inline-block;
    font-size: 9px;
    padding: 1px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    border-radius: 8px;
    background: @PrimaryColor;
  }
  .tssp-icon {
    display: inline-block;
    font-size: 9px;
    padding: 1px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    border-radius: 8px;
    background: @McTypeOrange;
  }
  // el-dialog遮罩层样式（背景色）
  .v-modal {
    background: rgba(102,102,102, .4);
  }
</style>
