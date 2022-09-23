<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res2 && !res2.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Fdadrugnew" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Fdadrugnew"
          api_name="fdadrugnew"
          :max_num="extendCount.NameCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="name"></Export>
      </div>
      <el-table
        :data="res2"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @sort-change="sortChange"
        :default-sort="order.name ? defaultSort(order.name) : {}"
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
                :data="props.row.second[scope].res"
                :span-method="objectSpanMethod"
                fixed
                @sort-change="(obj)=>expandSortChange(obj,props)"
                :default-sort="props.row.second[scope].order ? defaultSort(props.row.second[scope].order) : {}"
                ref="expandtable"
                style="width: 100%">
                <el-table-column
                  v-for="(item, ix) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="ix"
                  :min-width="item.field_width || item.width || 100"
                  :label="item.label">
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <div v-if="item.prop === 'applno'">
                        <router-link tag="a" :to="{path:'/fdadrugnew/' + scope.row.applno}" target="_blank" class="cl-blue">
                          {{ scope.row.applno }}
                        </router-link>
                      </div>
                      <div v-if="item.prop === 'appltype'">
                        {{ scope.row.appltype }}
                      </div>
                      <div v-if="item.prop === 'drugname'">
                        {{ scope.row.drugname }}
                      </div>
                      <div v-if="item.prop === 'activeingredient'" :title="scope.row.activeingredient + scope.row.cname">
                        <span class="dis">{{ scope.row.activeingredient }}</span>
                        <span class="dis">{{ scope.row.cname }}</span>
                      </div>
                      <div v-if="item.prop === 'route'">
                        {{ scope.row.route }}
                      </div>
                      <div v-if="item.prop === 'submissionstatusdate1'">
                        {{ scope.row.submissionstatusdate1 }}
                      </div>
                      <div v-if="item.prop === 'sponsorname'">
                        {{ scope.row.sponsorname }}
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
          v-for="(item, ix) in tableHead"
          :prop="item.prop"
          :key="ix"
          :sortable="item.sort"
          :min-width="item.width"
          :width="item.okWidth || null"
          :label="item.label">

          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
            <div v-if="item.prop === 'activeingredient'">
              <span>{{ scope.row.activeingredient }}</span>
            </div>
            <div v-if="item.prop === 'cname'">
              <span>{{ scope.row.cname }}</span>
            </div>
            <div v-if="item.prop === 'yishangshi_count'" :class="{'extensible-td': Number(scope.row.yishangshi_count)}" @click="getExpandRes(scope.row.activeingredient, 'marketingstatusid', scope.row.yishangshi_count, '1ღ2',scope)">
              <span>{{ scope.row.yishangshi_count }}</span>
            </div>
            <div v-if="item.prop === 'yicheshi_count'" :class="{'extensible-td': Number(scope.row.yicheshi_count)}" @click="getExpandRes(scope.row.activeingredient, 'marketingstatusid', scope.row.yicheshi_count, 3,scope)">
              <span>{{ scope.row.yicheshi_count }}</span>
            </div>
            <div v-if="item.prop === 'zandingpizhun_count'" :class="{'extensible-td': Number(scope.row.zandingpizhun_count)}" @click="getExpandRes(scope.row.activeingredient, 'marketingstatusid', scope.row.zandingpizhun_count,4,scope)">
              <span>{{ scope.row.zandingpizhun_count }}</span>
            </div>
            <div v-if="item.prop === 'shenqingjigou_count'" :class="{'extensible-td': Number(scope.row.shenqingjigou_count)}" @click="getExpandRes(scope.row.activeingredient, 'level_two_type', scope.row.shenqingjigou_count,'shenqingjigou_count',scope)">
              <span>{{ scope.row.shenqingjigou_count }}</span>
            </div>
            <div v-if="item.prop === 'new_pizhun_date'" :class="{'extensible-td': Number(scope.row.new_pizhun_count)}" @click="getExpandRes(scope.row.activeingredient, 'submissionstatusdate1', scope.row.new_pizhun_count,scope.row.new_pizhun_date,scope)">
              <template v-if="scope.row.new_pizhun_date">
                {{ scope.row.new_pizhun_date }}
                (<span class="num-text">{{scope.row.new_pizhun_count}}</span>)
              </template>
            </div>
            <div v-if="item.prop === 'zuizao_pizhun_date'" :class="{'extensible-td': Number(scope.row.zuizao_pizhun_count)}" @click="getExpandRes(scope.row.activeingredient,'submissionstatusdate1',scope.row.zuizao_pizhun_count,scope.row.zuizao_pizhun_date,scope)">
              <template v-if="scope.row.zuizao_pizhun_date">
                {{ scope.row.zuizao_pizhun_date }}
                (<span class="num-text">{{scope.row.zuizao_pizhun_count}}</span>)
              </template>
            </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="extendCount.NameCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.NameCount"
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
  const defaultFiled = tablehead.fdadrugnew.tymc
  const expandFiled = tablehead.fdadrugnew.tymcExpand
  export default{
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
        show_table_column: true,
        scope: '',
        defaultFiled: defaultFiled,
        expandFiled: expandFiled,
        checkall: [],
        checkedFiled: [],
        tableHead:[],
        getRowKeys(row) {
          return row.activeingredient
        },
        deletname: '',
        expandParams:{   //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
          activeingredient_eq:'',
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
        changeStyle:'',
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Fdadrugnew.tableconf,
        allBase: state => state.Fdadrugnew.allBase,
        res2: state => _.keys(state.Fdadrugnew.res2).length ? state.Fdadrugnew.res2 : [],
        errocode: state => state.Fdadrugnew.error,
        listLoading: state => state.Fdadrugnew.listLoading,
        putong: state => state.Fdadrugnew.putong,
        gaoji: state => state.Fdadrugnew.gaoji,
        shaixuan: state => state.Fdadrugnew.shaixuan,
        extendCount: state => state.Fdadrugnew.extendCount,
        param: state => state.Fdadrugnew.ypmc_param, // 附加参数(存于vuex内)
        nopms: state => state.Fdadrugnew.nopms,
        order: state => state.Fdadrugnew.order
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
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
      res2: {
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
      // tableconf(n){
      //   // console.info(123)
      //   this.expandFiled = this.tableheaderCombain(n, this.expandFiled);
      // },
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        let arr = this.expands.expandRes.res
        if (columnIndex === 0 && this.deletname === 'level_two_type') {
          if(rowIndex===0){
            if(arr.length===1||arr[rowIndex].sponsorname!==arr[rowIndex+1].sponsorname){
              return [1,1]
            }else{
              let rowspan = 1
              for(let a=rowIndex+1;a<arr.length;a++){
                if(arr[rowIndex].sponsorname===arr[a].sponsorname){
                  rowspan+=1
                }else{
                  break
                }
              }
              return [rowspan,1]
            }
          }else if(rowIndex===arr.length-1){
            if(arr[rowIndex].sponsorname!==arr[rowIndex-1].sponsorname){
              return [1,1]
            }else{
              return [0,0]
            }
          }else{
            if(arr[rowIndex].sponsorname!==arr[rowIndex-1].sponsorname){
              if(arr[rowIndex].sponsorname===arr[rowIndex+1].sponsorname){
                let rowspan = 1
                for(let a=rowIndex+1;a<arr.length;a++){
                  if(arr[rowIndex].sponsorname===arr[a].sponsorname){
                    rowspan+=1
                  }else{
                    break
                  }
                }
                return [rowspan,1]
              }else{
                return [1,1]
              }
            }else{
              return [0,0]
            }
          }
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
          Store.dispatch('Fdadrugnew/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Fdadrugnew/nomalSearch',{params:this.param})
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
      handleRequest (props, order) {
        Store.dispatch("Fdadrugnew/getGroupRes",{path:'/api/fdadrugnew/nameList',params:this.expandParams}).then(res=>{
          this.expandsLoading = false
          if (res.data.code == 404) {
            this.expands.erroCode = '404'
          }else{
            if (res.data.code == 200) {
              this.expands.erroCode = '200'
              this.expands.expandRes = res.data.data
              res.data.data.order = order // 保存排序
              if(props) this.$set(props.row.second,[this.scope],res.data.data)
              // 处理二级列表出现后不能滚动的问题
              $('.el-table').addClass('el-table--scrollable-y')
            }
          }
        }).catch(error=>{
          this.expandsLoading = false
          this.expands.erroCode = '500'
        })
      },
      // 排序
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
        Store.commit('Fdadrugnew/order', Object.assign({}, this.$store.state.Fdadrugnew.order, {name: sort ? sort : null}))
        Store.dispatch('Fdadrugnew/nomalSearch',{params:this.param})
      },
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
      // 获取展开列表的数据
      getExpandRes (drugsname,groupname,num,str,scope) {
        console.log(drugsname,groupname,num,str,scope)
        window.ga("send", "event", "tab", "click", this.allBase.dbename+"_nameGroup_"+groupname)
        window._paq.push(['trackEvent', 'tab', 'click', this.allBase.dbename+"_nameGroup_"+groupname,])

        if (Number(num)) {
          this.expandParams.activeingredient_eq = drugsname

          this.$delete(this.expandParams, this.deletname)
          this.$delete(this.expandParams, 'order')
          this.deletname = groupname
            this.expandParams[groupname] = str ? str : num
          this.expandParams.pageSize = 20
          this.expandParams.page = 1
          this.scope = scope.column.property
          if(scope.row.second[this.scope]){
            this.$set(scope.row.second,[this.scope],scope.row.second[this.scope])
            this.expands.expandRes = scope.row.second[this.scope]
            return
          }
          this.expandsLoading = true
          this.handleRequest(scope)
        }
      },
      toggleRowExpansion(row, column, cell, event){
        if(event.target.localName==='td'||event.target.className==='cell') return
        let num = Number($(cell).text().trim())

        // 增加判断 start
        let paixu = this.expandFiled.findIndex(e => e.prop === "submissionstatusdate1")
        let shunxu = this.expandFiled.findIndex(e => e.prop === "sponsorname")
        if(column.property === "yishangshi_count" || column.property === "yicheshi_count" || column.property === "zandingpizhun_count" ){
          this.expandFiled[paixu].sort = 'custom'
        }else{
          this.$delete(this.expandFiled[paixu],'sort')
        }

        if(column.property === "shenqingjigou_count"){
          let item = this.expandFiled.splice(shunxu, 1)
          this.expandFiled.unshift(item[0])
        }else{
          let item = this.expandFiled.splice(shunxu, 1)
          this.expandFiled.push(item[0])
        }

        if(column.property === "new_pizhun_date" || column.property === "zuizao_pizhun_date"){
          num = Number($(cell).find('.num-text').text().trim())
        }
        // 增加判断 end

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
            this.expands.expandsrow.push(row.activeingredient)
            this.expands.element.removeClass('active')
            src_el.addClass('active')
            this.expands.element = src_el
          }

          this.show_table_column = false
          setTimeout(() => {
            this.show_table_column = true
          }, 0)
        }
      },
    },
    created () {
      this.init()
    },
    updated () {
      this.vueTogglePmsTooltip()
    },
  }
</script>

<style lang="less">
  @import "~@/assets/less/var.less";

  .la-ypmc{

  }
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
          background:url('~@/assets/imgs/zhuce/el-icon-caret-top.png') no-repeat 10px bottom #f5f8fb!important;
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
        background:url('~@/assets/imgs/zhuce/el-icon-caret-top.png') no-repeat 10px bottom;
      }
    }

  }

</style>
