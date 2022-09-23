<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res3 && !res3.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Fdadrugnew" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Fdadrugnew"
          api_name="fdadrugnew"
          :max_num="extendCount.JigouCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="jigou"></Export>
      </div>
      <el-table
        :data="res3"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        :row-key="getRowKeys"
        @sort-change="sortChange"
        :expand-row-keys="expands.expandsrow"
        :default-sort = "order.jigou ? defaultSort(order.jigou) : {}"
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
                :span-method="objectSpanMethod"
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
                      <div v-if="item.prop === 'activeingredient'" :title="scope.row.activeingredient + scope.row.cname">
                        <span class="dis">{{ scope.row.activeingredient }}</span>
                        <span class="dis">{{ scope.row.cname }}</span>
                      </div>
                      <div v-if="item.prop === 'applno'">
                        <router-link tag="a" :to="{path:'/fdadrugnew/' + scope.row.applno}" target="_blank" class="cl-blue">
                          <span>{{ scope.row.applno }}</span>
                        </router-link>
                      </div>
                      <div v-if="item.prop === 'appltype'">
                        <span>{{ scope.row.appltype}}</span>
                      </div>
                      <div v-if="item.prop === 'drugname'">
                        <span>{{ scope.row.drugname }}</span>
                      </div>
                      <div v-if="item.prop === 'route'">
                        <span>{{ scope.row.route }}</span>
                      </div>
                      <div v-if="item.prop === 'submissionstatusdate1'">
                        <span>{{ scope.row.submissionstatusdate1 }}</span>
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
          <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="item" effect="zhuce" placement="right">
                <div slot="content">
                  <p>上市品种数：该企业上市的品种数量</p>
                  <p>上市总数：该企业上市的申请号数量（包含同品种，不同剂型规格及申请号等）</p>
                </div>

                <i class="el-icon-question cl-green" style="margin-left: 4px;"></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
            <div v-if="item.prop === 'sponsorname'">
                {{ scope.row.sponsorname }}
            </div>
            <div v-if="item.prop === 'shangshi_pinzhong_count'" :class="{'extensible-td': Number(scope.row.shangshi_pinzhong_total_count)}" @click="getExpandRes(scope.row.sponsorname, 'marketingstatusid', scope.row.shangshi_pinzhong_total_count, '1ღ2',scope)">
              <template v-if="scope.row.shangshi_pinzhong_total_count">
                {{ scope.row.shangshi_pinzhong_count }}
                (<span class="num-text">{{scope.row.shangshi_pinzhong_total_count}}</span>)
              </template>
              <span v-else>0</span>
            </div>
            <div v-if="item.prop === 'cheshi_pinzhong_count'" :class="{'extensible-td': Number(scope.row.cheshi_pinzhong_total_count)}" @click="getExpandRes(scope.row.sponsorname, 'marketingstatusid', scope.row.cheshi_pinzhong_total_count, 3,scope)">
              <template v-if="scope.row.cheshi_pinzhong_total_count">
                {{ scope.row.cheshi_pinzhong_count }}
                (<span class="num-text">{{scope.row.cheshi_pinzhong_total_count}}</span>)
              </template>
              <span v-else>0</span>
            </div>
            <div v-if="item.prop === 'zanding_pizhun_pinzhong_count'" :class="{'extensible-td': Number(scope.row.zanding_pizhun_pinzhong_total_count)}" @click="getExpandRes(scope.row.sponsorname, 'marketingstatusid', scope.row.zanding_pizhun_pinzhong_total_count, 4,scope)">
              <template v-if="scope.row.zanding_pizhun_pinzhong_total_count">
                {{ scope.row.zanding_pizhun_pinzhong_count }}
                (<span class="num-text">{{scope.row.zanding_pizhun_pinzhong_total_count}}</span>)
              </template>
              <span v-else>0</span>
            </div>
            <div v-if="item.prop === 'orphan_drug_pinzhong_count'" :class="{'extensible-td': Number(scope.row.orphan_drug_pinzhong_total_count)}" @click="getExpandRes(scope.row.sponsorname, 'submissionpropertytypecode', scope.row.orphan_drug_pinzhong_total_count, 'orphan',scope)">
              <template v-if="scope.row.orphan_drug_pinzhong_total_count">
                {{ scope.row.orphan_drug_pinzhong_count }}
              (<span class="num-text">{{scope.row.orphan_drug_pinzhong_total_count}}</span>)
              </template>
              <span v-else>0</span>
            </div>
            <div v-if="item.prop === 'new_pinzhong_pizhun_date'" :class="{'extensible-td': Number(scope.row.new_pinzhong_pizhun_count)}" @click="getExpandRes(scope.row.sponsorname, 'submissionstatusdate1', scope.row.new_pinzhong_pizhun_count,scope.row.new_pinzhong_pizhun_date,scope)">
              <template v-if="scope.row.new_pinzhong_pizhun_date">
                {{ scope.row.new_pinzhong_pizhun_date }}
                (<span class="num-text">{{scope.row.new_pinzhong_pizhun_count}}</span>)
              </template>
            </div>
            <div v-if="item.prop === 'zuizao_pinzhong_pizhun_date'" :class="{'extensible-td': Number(scope.row.zuizao_pinzhong_pizhun_count)}" @click="getExpandRes(scope.row.sponsorname, 'submissionstatusdate1', scope.row.zuizao_pinzhong_pizhun_count,scope.row.zuizao_pinzhong_pizhun_date,scope)">
              <template v-if="scope.row.zuizao_pinzhong_pizhun_date">
                {{ scope.row.zuizao_pinzhong_pizhun_date }}
                (<span class="num-text">{{scope.row.zuizao_pinzhong_pizhun_count}}</span>)
              </template>
            </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="extendCount.JigouCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.JigouCount"
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
  const defaultFiled = tablehead.fdadrugnew.sqjg
  const expandFiled = tablehead.fdadrugnew.sqjgExpand

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
        scope: '',
        defaultFiled: defaultFiled,
        expandFiled: expandFiled,
        tableHead:[],
        getRowKeys(row) {
          return row.sponsorname
        },
        deletename: '',
        expandParams:{   //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
          sponsorname_eq:'',
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
        rowIx: 0,
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Fdadrugnew.tableconf,
        allBase: state => state.Fdadrugnew.allBase,
        res3: state => _.keys(state.Fdadrugnew.res3).length ? state.Fdadrugnew.res3 : [],
        errocode: state => state.Fdadrugnew.error,
        listLoading: state => state.Fdadrugnew.listLoading,
        putong: state => state.Fdadrugnew.putong,
        gaoji: state => state.Fdadrugnew.gaoji,
        shaixuan: state => state.Fdadrugnew.shaixuan,
        extendCount: state => state.Fdadrugnew.extendCount,
        param: state => state.Fdadrugnew.qy_param, // 附加参数(存于vuex内)
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
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        let arr = this.expands.expandRes.res
        if (columnIndex === 0) {
          if(rowIndex===0){
            if(arr.length===1||arr[rowIndex].cname!==arr[rowIndex+1].cname){
              return [1,1]
            }else{
              let rowspan = 1
              for(let a=rowIndex+1;a<arr.length;a++){
                if(arr[rowIndex].cname===arr[a].cname){
                  rowspan+=1
                }else{
                  break
                }
              }
              return [rowspan,1]
            }
          }else if(rowIndex===arr.length-1){
            if(arr[rowIndex].cname!==arr[rowIndex-1].cname){
              return [1,1]
            }else{
              return [0,0]
            }
          }else{
            if(arr[rowIndex].cname!==arr[rowIndex-1].cname){
              if(arr[rowIndex].cname===arr[rowIndex+1].cname){
                let rowspan = 1
                for(let a=rowIndex+1;a<arr.length;a++){
                  if(arr[rowIndex].cname===arr[a].cname){
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
      handleRequest(props) {
        Store.dispatch("Fdadrugnew/getGroupRes",{path:'/api/fdadrugnew/jigouList',params:this.expandParams}).then(res=>{
          this.expandsLoading = false
          if (res.data.code == 404) {
            this.expands.erroCode = '404'
          }else if (res.data.code == 200) {
            this.expands.erroCode = '200'
            this.expands.expandRes = res.data.data
            if(props) this.$set(props.row.second,[this.scope],res.data.data)
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
        Store.commit('Fdadrugnew/order', Object.assign({}, this.$store.state.Fdadrugnew.order, {jigou: sort ? sort : null}))
        Store.dispatch('Fdadrugnew/nomalSearch',{params:this.param})
      },
      getExpandRes (sponsorname,groupname,num,str,scope) {
        window.ga("send", "event", "tab", "click", this.allBase.dbename+"_jigouGroup_"+groupname)
        window._paq.push(['trackEvent', 'tab', 'click', this.allBase.dbename+"_jigouGroup_"+groupname,])

        if (Number(num)) {
          this.expandParams.sponsorname_eq = sponsorname

          this.$delete(this.expandParams, this.deletname)
          this.deletname = groupname
          this.expandParams[groupname] = str ? str : num

          this.expandParams.pageSize = 20
          this.expandParams.page = 1
          this.scope = scope.column.property
          if(scope.row.second[this.scope]) return
          this.expandsLoading = true
          this.handleRequest(scope)
        }
      },
      toggleRowExpansion(row, column, cell, event){
        if(event.target.localName==='td'||event.target.className==='cell') return
        // let num = Number($(cell).text().trim())
        let num = Number($(cell).find('.num-text').text().trim())
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
            this.expands.expandsrow.push(row.sponsorname)
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
      res3: {
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
  .la-qy{

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
