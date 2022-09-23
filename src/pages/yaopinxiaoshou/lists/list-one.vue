<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.ksh}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Yaopinxiaoshou" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Yaopinxiaoshou"
          api_name="ypxs"
          :max_num="extendCount.listCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          :params="exparam"></Export>
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
          <template :slot="item.prop==='value' ? 'header':''" slot-scope="scope">
            <selectNuit v-model="nuit" gaKey="nianfen" />
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'brandname'">
                <span v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">
                  <a :href="'/ypxs/' + scope.row.id" target="_blank" class="cl-blue">{{ scope.row.brandname }}{{scope.row.brandnamecn ? `(${scope.row.brandnamecn})` : ''}}</a>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else-if="item.prop === 'value'">
                <span v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">{{ echartsTooltipMoney(ypxsNuitChange(nuit,scope.row.value)) }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'targets'" :title="''">
                <template v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">
                  <TooltipBD :targets="scope.row.targets" :targets_abbr="scope.row.targets_abbr" />
                </template>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else>
                <span v-if="vueCheckListPms('Yaopinxiaoshou', item.label)">{{ scope.row[item.prop] }}</span>
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
  import TooltipBD from "@/components/common/globalCom/target-tooltip"
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import { mapState } from 'vuex'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  import selectNuit from '../selectNuit'
  export default{
    components: {
      TooltipBD,
      List,
      Export,
      listCheck,
      selectNuit
    },
    mixins: [
      commonMixins,
      setTableHMixins
    ],
    data () {
      return {
        nuit: "1",
        activeTabName: 'first',
        defaultFiled: [],
        tableHead: [],
        filedVisible: false,
        checkallShow: [],
        show_table: true,
        helpDesc: {
          salesVolume: '根据货币在对应年份的平均汇率换算成万元人民币为单位的销售额数值',
          salesVolumeOld: '年报中所描述的销售额数值，需结合“货币单位(原始)”字段一起表达销售额',
          monetaryUnit: '年报中描述的销售额数值所对应的规范后货币单位如：百万美元、千欧元、亿日元等',
          productCompany: '规范的企业名称，一般按照中文(英文)组合的形式展示',
          pharmacologyType: '列表显示ATC编码第三级分类'
        },
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Yaopinxiaoshou.tableconf,
        allBase: state => state.Yaopinxiaoshou.allBase,
        res1: state => _.keys(state.Yaopinxiaoshou.res1).length ? state.Yaopinxiaoshou.res1.res : [],
        errorcode: state => state.Yaopinxiaoshou.error,
        listLoading: state => state.Yaopinxiaoshou.listLoading,
        putong: state => state.Yaopinxiaoshou.putong,
        gaoji: state => state.Yaopinxiaoshou.gaoji,
        shaixuan: state => state.Yaopinxiaoshou.shaixuan,
        extendCount: state => state.Yaopinxiaoshou.extendCount,
        param: state => state.Yaopinxiaoshou.xsnf_param, // 附加参数(存于vuex内)
        nopms: state => state.Yaopinxiaoshou.nopms,
        order: state => state.Yaopinxiaoshou.order
      }),
      exportDefaultFiled () {
        let arr = []
        for (let item of this.defaultFiled) {
          if (item.prop === 'value') {
            item.label = `${this.nuitValue}元（RMB）`
          };
          arr.push(item)
        }
        return arr
      },
      nuitValue(){
        let value = ''
        switch(this.nuit){
          case '1':
            value = '万'
            break;
          case '100':
            value = '百万'
            break;
          case '1000':
            value = '千万'
            break;
          case '10000':
            value = '亿'
            break;
        }
        return value
      },
      exparam () {
        let obj = {}
        switch(this.nuit){
          case '1':
            obj.unitchange = '0'
            break;
          case '100':
            obj.unitchange = '1'
            break;
          case '1000':
            obj.unitchange = '2'
            break;
          case '10000':
            obj.unitchange = '3'
            break;
        }
        return obj
      }
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
          window.ga("send","event", "tab", "click", "ypxs_analy");
          window._paq.push(['trackEvent', 'tab',"click", 'ypxs_analy', ])
          this.$router.push({ path: '/ypxs/analy'})
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
          Store.dispatch('Yaopinxiaoshou/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Yaopinxiaoshou/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      sortChange (column, prop, order) {
        let sort
        // column.prop为null时，不排序
        if (column.prop) {
          sort = column.prop + " " + (column.order == "descending" ? "desc" : "asc")
        }
        this.param.order = sort
        Store.commit('Yaopinxiaoshou/order', Object.assign({}, this.$store.state.Yaopinxiaoshou.order, {base: sort ? sort : null}))
        Store.dispatch('Yaopinxiaoshou/nomalSearch', {params: this.param})
      }
    },
    created () {
      this.init()
    },
    updated () {
      this.vueTogglePmsTooltip()
    },
    mounted (){

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
      tableconf(n) {
        n.forEach((item) => {
          item.checked = item.hidden === undefined;
          item.prop = item.field;
        });
        //后台控制列表宽度
        this.defaultFiled = this.tableheaderCombain(n, n);
        this.init();
      },
    },
  }
</script>
<style lang="less">
@import "~@/assets/less/var.less";
  .la-slh{

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
