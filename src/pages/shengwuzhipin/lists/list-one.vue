<template>
  <div class="la-slh">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.ksh}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Shengwuzhipin" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Shengwuzhipin"
          api_name="pqf"
          :max_num="extendCount.listCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"></Export>
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
          :fixed="item.is_fixed == '1'"
          :label="item.label">
          <template :slot="1 ? 'header' : ''" slot-scope="scope">
            <span>
              <NewProjectGuide
                postion="列表"
                :newPosition="{
                  top: -5,
                  right: getPositonRight(item.order, item.statement),
                }"
                :onlyKey="item['new_id']"
                display="inline"
                compoentsName="字段"
                :initItem="item"
                :showMenban="item['is_show_new']"
                >{{ item.label }}</NewProjectGuide
              >
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
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'pihao'" >
                <span v-if="vueCheckListPms('Shengwuzhipin', item.label)">
                  <a :href="'/pqf/'+scope.row.id" class="cl-blue" target="_blank">{{ scope.row.pihao }}</a>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else>
                <span v-if="vueCheckListPms('Shengwuzhipin', item.label)">{{ scope.row[item.prop] }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
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
  import Export from '@/components/common/export'
  import List from '@/components/layouts/list'
  import { mapState } from 'vuex'
  // import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  // const defaultFiled = tablehead.shengwuzhipin.slh
  export default{
    components: {
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
        activeTabName: 'first',
        // param:{
        //   order:null,
        //   page:1,
        //   pageSize:20,
        // },
        vuex_name: 'Shengwuzhipin',
        defaultFiled: [],
        filedVisible: false,
        exportDefaultFiled: [],
        tableHead:[],
        checkallShow: [],
        show_table: true,
        ElTableData:null,
        changeStyle:'',
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Shengwuzhipin.tableconf,
        allBase: state => state.Shengwuzhipin.allBase,
        res1: state => _.keys(state.Shengwuzhipin.res1).length ? state.Shengwuzhipin.res1.res : [],
        errocode: state => state.Shengwuzhipin.error,
        listLoading: state => state.Shengwuzhipin.listLoading,
        params: state => state.Shengwuzhipin.putong,
        words: state => state.Shengwuzhipin.gaoji,
        group: state => state.Shengwuzhipin.shaixuan,
        extendCount: state => state.Shengwuzhipin.extendCount,
        nopms: state => state.Shengwuzhipin.nopms,
        param: state => state.Shengwuzhipin.slh_param, // 附加参数(存于vuex内)
        order: state => state.Shengwuzhipin.order
      }),
    },
     mounted(){
    },
    methods: {
      // 动态计算new标签的right间距(order为排序标签，statement为提示问号)
      getPositonRight(order, statement) {
        if (order && !statement) {
          return -42;
        } else if (!order && statement) {
          return -40;
        } else if (order && statement) {
          return -58;
        } else {
          return -25;
        }
      },

      // 跳转到智能分析
      sendGa() {
        if (this.nopms && !this.nopms.ksh) {
          window.ga("send","event", "tab", "click", "pqf_analy");
          window._paq.push(['trackEvent', 'tab', 'click','pqf_analy',])

          this.$router.push({ path: '/pqf/analy'})
        }
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
          Store.dispatch('Shengwuzhipin/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Shengwuzhipin/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      }
    },
    created () {
      // this.init()
    },
    updated () {
      this.vueTogglePmsTooltip()
    },
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
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
      },
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
      tableconf(n) {
        n.forEach((item) => {
          item.checked = item.hidden === undefined;
          item.prop = item.field;
        });
        //后台控制列表宽度
        this.defaultFiled = this.tableheaderCombain(n, n);
        this.exportDefaultFiled = this.defaultFiled;
        this.init();
      },
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
