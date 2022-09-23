<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Yzx" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
        :out_max="allBase.out_max"
        vuex_name="Yzx"
        api_name="yzx"
        :max_num="extendCount.piwenCount"
        :defaultFiled="exportDefaultFiled"
        outdataAction="piwen"></Export>
      </div>
      <el-table
        :data="res1"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        @sort-change="sortChange"
        :default-sort = "order.piwen ? defaultSort(order.piwen) : {}"
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
          <template slot-scope="scope">

            <div :title="scope.row[item.prop]">
            <template v-if="item.prop === 'pizhunwenhao'||item.prop === 'name'||item.prop === 'enddate'||item.prop === 'pwjd'||item.prop === 'dailiangcaigou'">
              <div v-if="item.prop === 'pizhunwenhao'">
                <span v-if="vueCheckListPms('Yzx', item.label)" class="cell-shoulihao-wrap">
                  <router-link v-if="scope.row.tp=='1'" tag="a" :to="{path:'/cfdadrug/detail/' + scope.row.xuhao}" class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.pizhunwenhao }}
                  </router-link>
                  <router-link v-else tag="a" :to="{path:'/cfdadrug/jkdetail/' + scope.row.xuhao}" class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.pizhunwenhao }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ (scope.row.yaopinleixing_1 ? scope.row.yaopinleixing_1 : '') + (scope.row.name ? scope.row.name : '') }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'enddate'">
                <span v-if="vueCheckListPms('Yzx', item.label)">{{ scope.row.enddate | formatDate }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'pwjd'">
                <span :class="yzxjdClass(scope.row.pwjd)" v-if="vueCheckListPms('Yzx', item.label)">{{ scope.row.pwjd||'/' }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'dailiangcaigou'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  <router-link target="_blank" v-if="scope.row.dailiangcaigou === '是'" class="under_a" :to="{ path: '/dailiangcaigou', query: { 'fourth_condition': `bianma=${scope.row.bianma} _and qiyebianmatz=${scope.row.qiyebianmatz} _and guifanguige=${scope.row.guifanguige}` }}">{{ scope.row.dailiangcaigou||'/' }}</router-link>
                  <span v-else>{{ scope.row.dailiangcaigou||"/" }}</span>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
            </template>

            <template v-else>
              <div>
                <span v-if="vueCheckListPms('Yzx', item.label)">{{ scope.row[item.prop]||'/' }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
            </template>
            </div></template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="extendCount.piwenCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.piwenCount"
          :disabled="nopms.fy"
          :class="{'abandon-click-method': nopms.fy}">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>

    </List>
  </div>
</template>
<script>
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import { mapState } from 'vuex'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
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
    data () {
      return {
        activeTabName: 'first',
        defaultFiled: [],
        exportDefaultFiled: [],
        tableHead: [],
        checkallShow: [],
        show_table: true,
        changeStyle:'',
        helpDesc: {
          dailiangcaigou: '集中采购品种目录中药品名称、规格及其生产企业相同的药品',
          shuoming: '此列为ATC第三级分类，详细分类可至详情页查看'
        },
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Yzx.tableconf,
        allBase: state => state.Yzx.allBase,
        res1: state => _.keys(state.Yzx.res1).length ? state.Yzx.res1.res : [],
        yzxjd: state => state.Yzx.yzxjd,
        listLoading: state => state.Yzx.listLoading,
        putong: state => state.Yzx.putong,
        gaoji: state => state.Yzx.gaoji,
        shaixuan: state => state.Yzx.shaixuan,
        extendCount: state => state.Yzx.extendCount,
        param: state => state.Yzx.piwen_param, // 附加参数(存于vuex内)
        nopms: state => state.Yzx.nopms,
        order: state => state.Yzx.order
      }),
    },
    mounted(){
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
        this.exportDefaultFiled = this.defaultFiled;
        this.init();
      },
    },
    filters: {
      formatDate:(date) => {
        if (date) {
          let len = date.length>10 ? 10 : date.length
          let newData = date.slice(0, len).trim()
          let newArray = newData.split("-")
          for (let i = 1; i < 3; i++) {
            if (newArray[i].length<2) {
              newArray[i] = "0" + newArray[i]
            }
          }
          newData = newArray.join("-")
          return newData
        }else{
          return '/'
        }
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
      yzxjdClass (code) {
        return `yzxjd-btn yzxjd-btn-${this.yzxjd[code]}`
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
          Store.dispatch('Yzx/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Yzx/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      sortChange (column) {
        let sort
        // column.prop为null时，默认排序
        if (column.prop) {
          if (column.order == "ascending") {
            sort = column.prop + " " + "asc"
          } else if (column.order == "descending") {
            sort = column.prop + " " + "desc"
          } else {
            sort = ""
          }
        }
        this.param.order = sort
        Store.commit('Yzx/order', Object.assign({}, this.$store.state.Yzx.order, {piwen: sort ? sort : null}))
        Store.dispatch('Yzx/nomalSearch', {params: this.param, queryToPutong: false})
      }
    },
    created () {
    },
    updated () {
      this.vueTogglePmsTooltip()
    },
  }
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
  .el-table {
    .cell {
      overflow: visible;
      // padding-left: 30px;
    }
  }

  .cell-shoulihao-wrap {
    position: relative;
    .cell-shoulihao {
      float: left;
    }
  }
  .bg-green-br {
    // display: inline-block;
    text-align: center;
    font-size: 12px;
    padding: 0px 10px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    background-color: @Green;
    color: #fff;
    max-width: 80px;
    overflow: hidden;
  }
  .bg-orange-br {
    // display: inline-block;
    text-align: center;
    font-size: 12px;
    padding: 0px 10px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    background-color: @Orange;
    color: #fff;
    max-width: 80px;
    overflow: hidden;
  }

  .la-slh{

  }
  .ytz-icons {
    display: inline-block;
    &>span {
      overflow: hidden;
      display: inline-block;
      float: left;
      font-size: 12px;
      padding: 4px;
      // margin: 0px 0px 0px 6px;
      width: 14px;
      height: 14px;
      line-height: 14px;
      text-align: center;
      color: #fff;
      border-radius: 11px;
    }
  }
  .yxsp-icon {
    background: @McTypeGreen;
  }
  .zdzx-icon {
    background: @PrimaryColor;
  }
  .tssp-icon {
    background: @McTypeOrange;
  }
  .under_a{
    text-decoration: underline;
    &:hover{
      color: @PrimaryColor;
      font-weight: 600;
    }
  }
  // el-dialog遮罩层样式（背景色）
  .v-modal {
    background: rgba(102,102,102, .4);
  }
</style>
