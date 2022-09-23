<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res4 && !res4.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.ksh}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Linchuangshiyan" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Linchuangshiyan"
          api_name="linchuangshiyan"
          :max_num="extendCount.SyjgCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="syjg"></Export>
      </div>
      <el-table
        :data="res4"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        @sort-change="sortChange"
        :default-sort = "order.syjg ? defaultSort(order.syjg) : {}"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @cell-click="toggleRowExpansion"
        class="table extensible-table"
        style="width: 100%"
        v-if="show_table">
        <el-table-column type="expand" width="1">
          <div type="expand" slot-scope="props" class="table-expand">
            <!-- 自定义加载界面 -->
            <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="expandsLoading" v-if="expandsLoading"></LoadingGif>
            <!-- 加载完成显示部分 -->
            <div v-else>
              <el-table
                :data="props.row.second[scope].res"
                fixed
                ref="expandtable"
                style="width: 100%">
                <el-table-column
                v-for="item in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="item.prop"
                  :min-width="item.field_width || item.width || 100"
                  :label="item.label">
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <div v-if="item.prop === 'me_id'">
                        <router-link tag="a" :to="{path:'/linchuangshiyan/' + scope.row.id}" target="_blank" class="cl-blue">
                          {{ scope.row.me_id }}
                        </router-link>
                      </div>
                      <div v-else>
                        {{ scope.row[item.prop] }}
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
                :class="{'abandon-click-method': nopms.qy}">
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
          <!-- 自定义表头 -->
          <!-- <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="item" effect="zhuce" placement="right">
                <div slot="content" v-if="item.prop == 'institutes_guifan'">{{helpDesc.setList}}</div>
                <div slot="content" v-else-if="item.prop == 'pingzhongnum'">{{helpDesc.pingzhongnum}}</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template> -->
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'institutes_guifan'">
                <!-- <router-link tag="a" :to="'/search?comprehensive=company&searchwords=' + scope.row.institutes_guifan" target="_blank"> -->
                  {{ scope.row.institutes_guifan }}
                <!-- </router-link> -->
              </div>
              <div v-else :class="{'extensible-td': Number(scope.row[item.prop])}" @click="getExpandRes(scope.row.institutes_guifan, item.prop, scope.row[item.prop],scope)">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="extendCount.SyjgCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.SyjgCount"
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
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import { mapState } from 'vuex'
  import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.linchuangshiyan.syjg
  const expandFiled = tablehead.linchuangshiyan.syjgExpand

  export default {
    components: {
      LoadingGif,
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
        scope: "",
        defaultFiled: defaultFiled,
        expandFiled: expandFiled,
        tableHead:[],
        getRowKeys(row) {
          return row.institutes_guifan
        },
        expandParams:{   //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
          institutes_guifan_eq:'',
          column_name: '',
          pageSize: 20,
          page:1
        },
        expands: {
          expandsrow:[],  //存要展开的行
          element: null, //存分组点击的dom元素
          expanCell: "", //存当前展开项对应的cell 便于控制收起
          expandRes:{},  //展开项对应的资源
          erroCode:'200',
        },
        expandsLoading: true,
        checkallShow: [],
        show_table: true,
        helpDesc: {
          setList: '源于NMPA',
          pingzhongnum: '该企业已在中国申报的品种数'
        },
        changeStyle:'',
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88,
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Linchuangshiyan.tableconf,
        allBase: state => state.Linchuangshiyan.allBase,
        res4: state => _.keys(state.Linchuangshiyan.res4).length ? state.Linchuangshiyan.res4 : [],
        errocode: state => state.Linchuangshiyan.error,
        listLoading: state => state.Linchuangshiyan.listLoading,
        putong: state => state.Linchuangshiyan.putong,
        gaoji: state => state.Linchuangshiyan.gaoji,
        shaixuan: state => state.Linchuangshiyan.shaixuan,
        extendCount: state => state.Linchuangshiyan.extendCount,
        param: state => state.Linchuangshiyan.syjg_param, // 附加参数(存于vuex内)
        nopms: state => state.Linchuangshiyan.nopms,
        order: state => state.Linchuangshiyan.order
      }),
      exportDefaultFiled () {
        let arr = []
        for (let item of defaultFiled) {
          arr.push(item)
        }
        return arr
      },
    },
    mounted(){
    },
    methods: {
      // 跳转到智能分析
      sendGa() {
        if (this.nopms && !this.nopms.ksh) {
          window.ga("send","event", "tab", "click", "linchuangshiyan_analy")
          window._paq.push(['trackEvent', 'tab', 'click',"linchuangshiyan_analy"])
          this.$router.push({ path: '/linchuangshiyan/analy'})
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
          Store.dispatch('Linchuangshiyan/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Linchuangshiyan/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleRequest(props){
        Store.dispatch("Linchuangshiyan/getGroupRes",{path:'/api/linchuangshiyan/syjglist',params:this.expandParams}).then(res=>{
          this.expandsLoading = false
          if (res.data.code == 404) {
            this.expands.erroCode = '404'
          }else if (res.data.code == 200) {
            this.expands.erroCode = '200'
            this.$set(props.row.second,[this.scope],res.data.data)
            // 处理二级列表出现后不能滚动的问题
            $('.el-table').addClass('el-table--scrollable-y')
          }
        }).catch(error=>{
          this.expandsLoading = false
          this.expands.erroCode = '500'
        })
      },
      //分组展示的page发生改变
      expandCurrentChange (val,props) {
        this.expandParams.page = val
        this.handleRequest(props)
      },
      sortChange (column, prop, order) {
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
        Store.commit('Linchuangshiyan/order', Object.assign({}, this.$store.state.Linchuangshiyan.order, {syjg: sort ? sort : null}))
        Store.dispatch('Linchuangshiyan/nomalSearch',{params:this.param})
      },
      getExpandRes (institutes_guifan,groupname,num,scope) {
        this.expandParams.column_name = groupname
        window.ga("send", "event", "tab", "click", this.allBase.dbename+"_syjggroup_"+groupname)
        window._paq.push(['trackEvent', 'tab', 'click',this.allBase.dbename+"_syjggroup_"+groupname,])

        if (Number(num)) {
          this.expandParams.institutes_guifan_eq = institutes_guifan
          if(/me_statusint/.test(groupname)){
            this.expandParams.me_statusint = groupname.substr(groupname.length-1)
          }else{
            this.$delete(this.expandParams,'me_statusint')
          }

          this.scope = scope.column.property
          if(scope.row.second[this.scope]) return
          this.expandParams.page = 1
          this.expandsLoading = true
          this.handleRequest(scope)
        }
      },
      toggleRowExpansion(row, column, cell, event){
        if(event.target.localName==='td'||event.target.className==='cell') return
        let num = Number($(cell).text().trim())
        if (num) {
          let isOneRow = false
          let column_index = $(cell).index()
          let row_index = $(cell).parent().index()
          if (this.expands.old_row >= 0) {
            if (this.expands.old_row == row_index) {
              isOneRow = true
            }
          }
          this.expands.old_row = row_index
          let src_el = $(event.srcElement).closest('td')
          let name = "active"
          if (!this.expands.element) {
            this.expands.element = src_el
          }
          this.expands.expandsrow = [];
          //判断是不是之前的按钮
          if (column.id == this.expands.expanCell && isOneRow) {
            if(src_el.hasClass('active')){
              this.expands.element.removeClass('active')
            }else{
              this.expands.element.addClass('active')
            }
            this.expands.expanCell = ""
          }else{
            this.expands.expanCell = column.id
            this.expands.expandsrow.push(row.institutes_guifan)
            this.expands.element.removeClass('active')
            src_el.addClass('active')
            this.expands.element = src_el
          }
        }
      },
    },
    created () {
      this.init()
    },
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
      res4: {
        handler(){
        // 重置行点击
          this.expands = {
            expandsrow:[],
            element: null,
            expanCell: "",
            expandRes:{},
            erroCode:'200',
          }
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
      //  tableconf(n){
      //   this.expandFiled = this.tableheaderCombain(n, this.expandFiled);
      // },
    }
  }
</script>
<style lang="less">
  @import "~@/assets/less/var.less";

  .extensible-table{
    .extensible-td{
      cursor: pointer;
      text-decoration: underline;
      &:hover{
      color: @PrimaryColor;
        font-weight: 600;
      }
    }
    tr.el-table__row--striped{
      td{
        &.active{
          color: @PrimaryColor;
          font-weight: 600;
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
        font-weight: 600;
        background:url('~@/assets/imgs/zhuce/el-icon-caret-top.png') no-repeat 30px bottom;
        border: none;
      }
    }

  }

</style>
