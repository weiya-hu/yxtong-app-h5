<template>
  <div class="la-ypmc">
    <List :loading="listLoading" :nodata="res2 && !res2.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Yaopinxiaoshou" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Yaopinxiaoshou"
          api_name="ypxs"
          :max_num="extendCount.nameCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="name"></Export>
      </div>
      <!-- row-key 和 expand-row-keys 配合显示展开的数据，row-key 定义每一行唯一的 key；expand-row-keys 数组，定义哪些 key 显示展开的数据 -->
      <el-table
        ref="ElTable"
        :height="tableHeight"
        :data="res2"
        stripe
        fixed
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @sort-change="sortChange"
        :default-sort = "order.name ? defaultSort(order.name) : {}"
        @cell-click="toggleRowExpansion"
        class="table extensible-table"
        style="width: 100%"
        v-if="show_table">
        <el-table-column type="expand" width="1">
          <div type="expand" slot-scope="props" class="table-expand">
            <!-- 自定义加载界面 -->
            <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="expandsLoading" v-if="expandsLoading"></LoadingGif>
            <!-- 加载完成显示部分 -->
            <div v-else-if="show_table_column">
              <el-table
                :data="props.row.second[scope]&&props.row.second[scope].res"
                fixed
                @sort-change="(obj)=>expandSortChange(obj,props)"
                :default-sort="props.row.second[scope]&&props.row.second[scope].order ? defaultSort(props.row.second[scope].order) : {}"
                ref="expandtable"
                style="width: 100%"
                class="expand-table">
                <el-table-column
                  v-for="(item,ix) in expandFiled"
                  :prop="item.prop"
                  :key="ix"
                  :sortable="item.sort"
                  :min-width="item.field_width || item.width || 100"
                  :label="item.label">
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <div v-if="item.prop === 'brandname'">
                        {{ scope.row.brandname }}
                      </div>
                      <div v-else-if="item.prop === 'atc'">
                        {{ scope.row.shuoming }}
                      </div>
                      <div v-else-if="item.prop === 'company'">
                        {{ scope.row.company }}
                      </div>
                      <div v-else-if="item.prop === 'unit'">
                        <selectNuit v-model="scope.row.unit" gaKey="yaopin" />
                      </div>
                      <div v-else-if="item.prop === 'xiangqing'">
                        <router-link tag="a" :to="'/ypxs/' + scope.row.id" target="_blank" style="color: #4877e8">
                          查看
                        </router-link>
                      </div>
                      <div v-else>
                        {{ scope.row.year[item.prop]==='-' ? '-' : echartsTooltipMoney(ypxsNuitChange(scope.row.unit,scope.row.year[item.prop])) }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="props.row.second[scope].count > 20"
                @current-change="(val)=>expandCurrentChange(val,props)"
                :current-page="props.row.second[scope].page"
                :page-size="20"
                layout="prev, next"
                :total="props.row.second[scope].count"
                :disabled="nopms.fy"
                :class="{'abandon-click-method': nopms.fy}">
              </el-pagination>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :key="item.prop"
          :sortable="item.sort"
          :min-width="item.width"
          :width="item.okWidth || null"
          :label="item.label">
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
            <div v-if="item.prop === 'name'" class="extensible-td cl-blue" @click="getExpandRes(scope.row.name,scope)">
              {{ scope.row.name }}
            </div>
            <div v-if="item.prop === 'cname'">
              {{ scope.row.cname }}
            </div>
            <div v-if="item.prop === 'sp_count'">
              {{ scope.row.sp_count }}
            </div>
            <div v-if="item.prop === 'atc_count'">
              {{ scope.row.atc_count }}
            </div>
            <div v-if="item.prop === 'qy_count'">
              {{ scope.row.qy_count }}
            </div>
            <div v-if="item.prop === 'yaopinfenxi'">
              <a href="javascript:void(0);" class="cl-blue"  @click="getFullScreen(scope.row.name)">药品分析</a>
            </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
         <el-pagination
          v-if="extendCount.nameCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.nameCount"
          :disabled="nopms.fy"
          :class="{'abandon-click-method': nopms.fy}">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>

    </List>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import Export from '@/components/common/export'
  import List from '@/components/layouts/list'
  import { mapState } from 'vuex'
  import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import selectNuit from '../selectNuit'
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.yaopinxiaoshou.ypmc
  const expandFiled = tablehead.yaopinxiaoshou.ypmcExpand
  export default{
    components: {
      LoadingGif,
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
        show_table_column: true,
        scope: '',
        defaultFiled: defaultFiled,
        expandFiled: expandFiled,
        filedVisible: false,
        tableHead:[],
        checkallShow: [],
        show_table: true,
        getRowKeys(row) {
          return row.name
        },
        expandParams:{    //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
          pageSize: 20,
          page:1
        },
        expands: {
          expandsrow:[],  //存要展开的行
          element: null,  //存分组点击的dom元素（点击这个元素，触发展开）
          expanCell: "",  //存当前展开项对应的 列id（此 id 是 el-table 生成的）
          expandRes:{},   //展开项对应的资源
          erroCode:'200',
        },
        expandsLoading: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Yaopinxiaoshou.tableconf,
        allBase: state => state.Yaopinxiaoshou.allBase,
        nowNav: state => state.Yaopinxiaoshou.nowNav,
        res2: state => _.keys(state.Yaopinxiaoshou.res2).length ? state.Yaopinxiaoshou.res2.res : [],
        errocode: state => state.Yaopinxiaoshou.error,
        listLoading: state => state.Yaopinxiaoshou.listLoading,
        params: state => state.Yaopinxiaoshou.putong,
        words: state => state.Yaopinxiaoshou.gaoji,
        group: state => state.Yaopinxiaoshou.shaixuan,
        extendCount: state => state.Yaopinxiaoshou.extendCount,
        param: state => state.Yaopinxiaoshou.ypmc_param, // 附加参数(存于vuex内)
        nopms: state => state.Yaopinxiaoshou.nopms,
        order: state => state.Yaopinxiaoshou.order
      }),
      exportDefaultFiled () {
        let arr = []
        for (let item of defaultFiled) {
          arr.push(item)
        }
        return arr
      },
    },
    methods: {
      getFullScreen (name) {
        Store.commit("Yaopinxiaoshou/fenxi_yp", [])
        Store.commit("Yaopinxiaoshou/nowNav", "药品分析")
        Store.commit("Yaopinxiaoshou/yp_selects1", [])
        Store.commit("Yaopinxiaoshou/yp_selects2", [])
        Store.commit("Yaopinxiaoshou/yp_selects3", [])
        Store.commit("Yaopinxiaoshou/fenxi_yp_name", name)
        Store.commit("Yaopinxiaoshou/from", "list")
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
      //分组展示的page发生改变
      expandCurrentChange (val,props) {
        this.expandParams.page = val
        this.expandParams.order = props.row.second[this.scope].order
        this.handleRequest(props, props.row.second[this.scope].order)
      },
      // 排序
      sortChange (column, prop, order) {
        // column.prop为null时，默认排序
        let sort
        if (column.prop) {
          if (column.order == "ascending") {
            sort = column.prop + " " + "asc"
          } else if (column.order == "descending") {
            sort = column.prop + " " + "desc"
          }
          this.param.order = sort
        } else {
          this.param.order = null
        }

        let p = _.unset(this.param, "name")
        this.param = p
        Store.commit('Yaopinxiaoshou/order', Object.assign({}, this.$store.state.Yaopinxiaoshou.order, {name: sort ? sort : null}))
        Store.dispatch('Yaopinxiaoshou/nomalSearch',{path:'/api/ypxs/getnamelist',params: this.param})
      },
      // 内部排序
      expandSortChange ({column, prop, order},props) {
        let sort
        if (prop) {
          if (order == "ascending") {
            sort = prop + " " + "asc"
          } else if (order == "descending") {
            sort = prop + " " + "desc"
          } else {
            sort = ""
          }
        }
        this.expandParams.order = sort
        this.expandParams.page = props.row.second[this.scope].page ? props.row.second[this.scope].page : 1
        this.handleRequest(props,sort)
      },
      //二级表格公共方法
      handleRequest(props, order){
        Store.dispatch("Yaopinxiaoshou/getGroupRes",{path:'/api/ypxs/getbyname',params:this.expandParams}).then(res=>{
          this.expandsLoading = false
          if (res.data.code == 404) {
            this.expands.erroCode = '404'
          }else{
            if (res.data.code == 200) {
              this.expands.erroCode = '200'
              let data = res.data.data.List

              _.forEach(data.res,(item) => {
                item.unit = "1"
              })
              if (data.res && data.res.length>0) {
                this.getexpandHeader(data.res[0].year)
              }

              data.order = order // 保存排序
              this.$set(props.row.second,[this.scope],data)
              // 处理二级列表出现后不能滚动的问题
              $('.el-table').addClass('el-table--scrollable-y')
            }
          }
        }).catch(error=>{
          this.expandsLoading = false
          this.expands.erroCode = '500'
        })
      },
      // 获取展开列表的数据
      getExpandRes (val, scope) {
        this.expandParams.sname = val
        this.scope = scope.column.property
        if(scope.row.second[this.scope]){
          this.$set(scope.row.second,[this.scope],scope.row.second[this.scope])
          return
        }
        this.$delete(this.expandParams, 'order')
        this.expandParams.page = 1
        this.expandsLoading = true
        this.handleRequest(scope)
      },
      getexpandHeader(data) {
        let list = []
        _.forIn(data, (value, key) => {
          list.push({
            prop: key,
            label: key
          })
        })
        list.push({
          prop: "xiangqing",
          label: "更多数据",
        })
        this.expandFiled = _.concat(expandFiled, list)
      },
      // 切换展开行
      toggleRowExpansion(row, column, cell, event){
        if(event.target.localName==='td'||event.target.className==='cell') return
        if (column.property != 'name') {
          return
        }
        let isOneRow = false
        let column_index = $(cell).index()
        let row_index = $(cell).parent().index()
        if (this.expands.old_row >= 0) {
          if (this.expands.old_row == row_index) {
            isOneRow = true
          }
        }
        this.expands.old_row = row_index
        let src_el = $(cell)
        if (!this.expands.element) {
          // 存储点击的 src_el
          this.expands.element = src_el
        }
        // 展开显示的数据清空
        this.expands.expandsrow = [];
        // 判断是不是之前列
        if (column.id == this.expands.expanCell && isOneRow) {
          if(src_el.hasClass('active')){
            this.expands.element.removeClass('active')
          }else{
            this.expands.element.addClass('active')
          }
          this.expands.expanCell = ""
          // 如果是点击的同一个 cell，无论是展开还是收起，page重置为1
          this.expandParams.page = 1;
        }else{
          this.expands.expanCell = column.id
          this.expands.expandsrow.push(row.name)
          this.expands.element.removeClass('active')
          src_el.addClass('active')
          this.expands.element = src_el
        }

        this.show_table_column = false
        setTimeout(() => {
          this.show_table_column = true
        }, 0)
      },
    },
    created () {
      this.init()
    },
    mounted (){

    },
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
      res2: {
        handler() {
          this.$nextTick(() => {
            this.registerEven()
          })
          // 重置行点击
          this.expands = {
            expandsrow:[],
            element: null,
            expanCell: "",
            expandRes:{},
            erroCode:'200',
          }
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
      // tableconf(n){
      //   this.expandFiled = this.tableheaderCombain(n, this.expandFiled)
      // },
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
  .la-ypmc{
    min-height: 100px;
    .no-data-msg {
      width: 100%;
      text-align: center;
      font-weight: bold;
      // font-size: 20px;
    }
  }
  .extensible-table{
    .extensible-td{
      cursor: pointer;
      &:hover{
        color: @PrimaryColor;
        text-decoration: underline;
        font-weight: normal;
      }
    }
    tr.el-table__row--striped{
      td{
        &.active{
          color: @PrimaryColor;
          background:url('~@/assets/imgs/zhuce/el-icon-caret-top.png') no-repeat 30px bottom #f5f8fb!important;
          border: none;
        }
      }
    }
    td{
      position: relative;
      .el-icon-caret-top{
        font-size: 20px;
        display: none;
      }
      &.active{
        color: @PrimaryColor;
        background:url('~@/assets/imgs/zhuce/el-icon-caret-top.png') no-repeat 30px bottom;
        border: none;
      }
    }
    .expand-table {
      th:first-child,td:first-child {
        padding-left: 30px;
      }
    }
  }

</style>
