<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res2 && !res2.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.visualization}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Globalapproval" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Globalapproval"
          api_name="globalapproval"
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
            <div v-else>
              <el-table
                :data="props.row.second[scope].res"
                fixed
                ref="expandtable"
                style="width: 100%">
                <el-table-column
                  v-for="(item,index) in expandFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="index"
                  :min-width="item.field_width || item.width || 100"
                  :label="item.label">
                  <template :slot="item.tips ? 'header':''" slot-scope="scope">
                    <span>
                      {{item.label}}
                      <el-tooltip class="item" effect="zhuce" placement="right">
                        <div slot="content">包括中国批准文号及美国申请号等。</div>
                        <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                       <!-- drugid字段需要配合source字段点击跳转到对应数据库的详情页 -->
                      <template v-if="item.prop === 'drugid'">
                        <div v-if="scope.row.link.id">
                          <span
                          v-if="scope.row[item.prop]"
                          class="drugid"
                          @click="goDetail(scope.row)"
                          >{{ scope.row[item.prop] || '—' }}</span
                          >
                        </div>
                        <span v-else>{{ scope.row[item.prop] || '—' }}</span>
                      </template>
                      <!-- 查看 单品种分析 -->
                      <template v-else-if="item.prop === 'fensantu'">
                        <span
                          v-if="nopms.cname"
                          :class="{ 'abandon-click-method': nopms.cname }"
                          >查看</span
                        >
                        <router-link
                          :to="`/globalapproval/scatter-graph?keyword=${scope.row['activeingredient']}`"
                          tag="a"
                          target="_blank"
                          style="color: #4877e8"
                          v-if="scope.row['activeingredient'] && !nopms.cname"
                          >查看</router-link
                        >
                      </template>
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
                :class="{'abandon-click-method': nopms.fy}">
              </el-pagination>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in tableHead"
          :prop="item.prop"
          :key="index"
          :sortable="item.sort"
          :min-width="item.width"
          :width="item.okWidth || null"
          :label="item.label">

          <!-- 自定义表头 -->
          <!-- <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="item" effect="zhuce" placement="right">
                <div slot="content">该品种已在中国申报的厂家数（包含子企业）</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template> -->
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <template v-if="item.prop === 'activeingredient'">
                <router-link
                :to="`/globalapproval/detail?activeingredient=${scope.row['activeingredient']}`"
                tag="a"
                target="_blank"
                style="color: #4877e8"
                >{{scope.row['activeingredient']}}</router-link>
              </template>
              <!-- 最早批准日期 -->
              <template v-else-if="item.prop === 'olddate'">
                <span class="extensible-td" @click="getExpandRes(item.prop, scope.row[item.prop], scope.row.olddateCount, scope)">{{scope.row[item.prop]}}<span v-if="scope.row.olddateCount" class="num-text">({{scope.row.olddateCount}})</span></span>
              </template>
              <!-- 最新批准日期 -->
              <template v-else-if="item.prop === 'newestdate'">
                <span class="extensible-td" @click="getExpandRes(item.prop, scope.row[item.prop], scope.row.newestdateCount, scope)">{{scope.row[item.prop]}}<span v-if="scope.row.newestdateCount" class="num-text">({{scope.row.newestdateCount}})</span></span>
              </template>
              <!-- 中国最早批准日期 -->
              <template v-else-if="item.prop === 'oldchina'">
                <span class="extensible-td" @click="getExpandRes(item.prop, scope.row[item.prop], scope.row.oldchinaCount, scope)">{{scope.row[item.prop]}}<span v-if="scope.row.oldchinaCount" class="num-text">({{scope.row.oldchinaCount}})</span> </span>
              </template>
              <!-- 中国最新批准日期 -->
              <template v-else-if="item.prop === 'newchina'">
                <span class="extensible-td" @click="getExpandRes(item.prop, scope.row[item.prop], scope.row.newchinaCount, scope)">{{scope.row[item.prop]}}<span v-if="scope.row.newchinaCount" class="num-text">({{scope.row.newchinaCount}})</span> </span>
              </template>
              <!-- 查看 单品种分析 -->
              <template v-else-if="item.prop === 'fensantu'">
                <span
                  v-if="nopms.cname"
                  :class="{ 'abandon-click-method': nopms.cname }"
                  >查看</span
                >
                <router-link
                  :to="`/globalapproval/scatter-graph?keyword=${scope.row['activeingredient']}`"
                  tag="a"
                  target="_blank"
                  style="color: #4877e8"
                  v-if="scope.row['activeingredient'] && !nopms.cname"
                  >查看</router-link
                >
              </template>
              <div v-else>
                {{ scope.row[item.prop] }}
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
  const defaultFiled = tablehead.globalapproval.hxcf
  const expandFiled = tablehead.globalapproval.hxcfExpand
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
        scope: '',
        defaultFiled: defaultFiled,
        expandFiled: expandFiled,
        checkall: [],
        checkedFiled: [],
        tableHead:[],
        getRowKeys(row) {
          return row.acz
        },
        expandParams:{   //存分组查询的条件
          activeingredient_eq: '', // 活性成分英文
          cname_eq: '', // 活性成分中文
          zwform_eq: '', // 剂型
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
        tableconf: state => state.Globalapproval.tableconf,
        allBase: state => state.Globalapproval.allBase,
        res2: state => _.keys(state.Globalapproval.res2).length ? state.Globalapproval.res2 : [],
        errocode: state => state.Globalapproval.error,
        listLoading: state => state.Globalapproval.listLoading,
        putong: state => state.Globalapproval.putong,
        gaoji: state => state.Globalapproval.gaoji,
        shaixuan: state => state.Globalapproval.shaixuan,
        extendCount: state => state.Globalapproval.extendCount,
        param: state => state.Globalapproval.ypmc_param, // 附加参数(存于vuex内)
        nopms: state => state.Globalapproval.nopms,
        order: state => state.Globalapproval.order
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
      // drugid点击跳转到对应数据库详情页
      goDetail(row) {
        let urlObj = {
          path: ''
        }
        if (row.source === '中国') {
          // tip 1国产
          if (row.link.tp == 1) {
            urlObj.path = `/cfdadrug/detail/${row.link.id}`
            urlObj.query = {
              pizhunwenhao: row.link.pizhunwenhao
            }
          } else {
            urlObj.path = `/cfdadrug/jkdetail/${row.link.id}`
            urlObj.query = {
              pizhunwenhao: row.link.pizhunwenhao
            }
          }
        } else if (row.source === '美国') {
          urlObj.path = `/fdadrugnew/${row.link.id}`
        } else if (row.source === '欧盟EMA') {
          urlObj.path = `/epyp/emadetail/${row.link.id}`
        } else if (row.source === '欧盟HMA') {
          urlObj.path = `/epyp/hmadetail/${row.link.id}`
        } else if (row.source === '日本') {
          urlObj.path = `/pmda/${row.link.id}`
        } else if (row.source === '英国') {
          urlObj.path = `/uk/${row.link.id}`
        } else if (row.source === '中国台湾') {
          urlObj.path = `/taiwan/${row.link.id}`
        } else if (row.source === '德国') {
          urlObj.path = `/germany/${row.link.id}`
        } else if (row.source === '加拿大') {
          urlObj.path = `/canada/${row.link.id}`
        } else if (row.source === '法国') {
          urlObj.path = `/france/${row.link.id}`
        } else if (row.source === '印度') {
          urlObj.path = `/india/${row.link.id}`
        } else if (row.source === "韩国") {
          urlObj.path = `/korean/${row.link.id}`;
        }
        let routeData = this.$router.resolve(urlObj)
        window.open(routeData.href, "_blank")
        console.log(row)
      },
      // 跳转到智能分析
      sendGa() {
        if (this.nopms && !this.nopms.visualization) {
          window.ga("send","event", "tab", "click", "globalapproval_analy")
          window._paq.push(['trackEvent', 'tab', 'click',"globalapproval_analy"])
          this.$router.push({ path: '/globalapproval/analy'})
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
          Store.dispatch('Globalapproval/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Globalapproval/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleRequest(props){
        Store.dispatch("Globalapproval/getGroupRes",{path:'/api/globalapproval/namelist',params:this.expandParams}).then(res=>{
          this.expandsLoading = false
          if (res.data.code == 404) {
            this.expands.erroCode = '404'
          }else{
            if (res.data.code == 200) {
              this.expands.erroCode = '200'
              this.$set(props.row.second,[this.scope],res.data.data)
              // 处理二级列表出现后不能滚动的问题
              $('.el-table').addClass('el-table--scrollable-y')
            }
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
        Store.commit('Globalapproval/order', Object.assign({}, this.$store.state.Globalapproval.order, {name: sort ? sort : null}))
        Store.dispatch('Globalapproval/nomalSearch',{params:this.param})
      },
      // 获取展开列表的数据
      getExpandRes (groupname,date,num,scope) {
        console.log(groupname,date,num,scope)
        window.ga("send", "event", "tab", "click", this.allBase.dbename+"_namegroup_"+groupname)
        window._paq.push(['trackEvent', 'tab', 'click',this.allBase.dbename+"_namegroup_"+groupname,])

        if (Number(num)) {
          this.expandParams.activeingredient_eq = scope.row.activeingredient
          this.expandParams.cname_eq = scope.row.cname
          this.expandParams.zwform_eq = scope.row.zwform
          this.expandParams.date_eq = date
          if (groupname == 'oldchina' || groupname == 'newchina') {
            this.expandParams.source_eq = '中国'
          } else {
            delete this.expandParams.source_eq
          }
          this.scope = scope.column.property
          if(scope.row.second[this.scope]) return
          this.expandParams.page = 1
          this.expandsLoading = true
          this.handleRequest(scope)
        }
      },
      toggleRowExpansion(row, column, cell, event){
        console.log(cell)
        if(event.target.localName==='td'||event.target.className==='cell') return
        let num = $(cell).find('.num-text').text()
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
            this.expands.expandsrow.push(row.acz)
            this.expands.element.removeClass('active')
            src_el.addClass('active')
            this.expands.element = src_el
          }
          //console.log(this.expands,row)
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
