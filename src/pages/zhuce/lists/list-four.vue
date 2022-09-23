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
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Zhuce"
          :showArray="tableHead"
          @changeTableHeader="(list)=>changeTableHeader(this,list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Zhuce"
          api_name="zhuce"
          :max_num="extendCount.Species"
          :defaultFiled="exportDefaultFiled"
          outdataAction="species"
        ></Export>
      </div>
      <el-table
        :data="res4"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        @sort-change="sortChange"
        row-class-name="row-class-position"
        :cell-class-name="cellClass"
        :header-cell-class-name="headerClass"
        :row-key="getRowKeys"
        :expand-row-keys="expands.expandsrow"
        @cell-click="toggleRowExpansion"
        class="table extensible-table"
        style="width: 100%"
        v-if="show_table"
      >
        <el-table-column type="expand" width="1">
          <div type="expand" slot-scope="props" class="table-expand">
            <!-- 自定义加载界面 -->
            <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="expandsLoading" v-if="expandsLoading"></LoadingGif>
            <!-- 加载完成显示部分 -->
            <div v-else-if="tableType==='one'">
              <el-table
                :data="props.row.second[scope].res"
                fixed
                @sort-change="(obj)=>expandSortChange(obj,props)"
                :default-sort="props.row.second[scope].order ? defaultSort(props.row.second[scope].order) : {}"
                ref="expandtable"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item, ix) in currentFiled"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="item.prop + ix"
                  :min-width="item.width || 100"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <div v-if="item.prop === 'shoulihao'">
                        <router-link
                          tag="a"
                          :to="{path:'/zhuce/' + scope.row.id}"
                          target="_blank"
                          class="cl-blue"
                        >{{ scope.row.shoulihao }}</router-link>
                      </div>
                      <div v-else-if="item.prop === 'yaopinleixing_1'">
                        <span>
                          {{
                            (scope.row.yaopinleixing_1
                              ? scope.row.yaopinleixing_1
                              : "") +
                            (scope.row.zhuceleixing ? scope.row.zhuceleixing : "")
                          }}
                        </span>
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
                :class="{'abandon-click-method': nopms.species}"
              ></el-pagination>
            </div>
            <div v-else-if="tableType==='two'">
              <el-table
              :data="props.row.second[scope].res"
              fixed
              @sort-change="(obj)=>expandSortChange(obj,props)"
              :default-sort="props.row.second[scope].order ? defaultSort(props.row.second[scope].order) : {}"
              ref="expandtable"
              style="width: 100%">
                <el-table-column
                  v-for="(item,index) in expandFiledTwo"
                  :prop="item.prop"
                  :sortable="item.sort"
                  :key="item.prop+index"
                  :min-width="item.width || 100"
                  :label="item.label"
                >
                  <template slot-scope="scope">
                    <div :title="scope.row[item.prop]">
                      <div v-if="item.prop === 'shoulihao'">
                        <router-link
                          tag="a"
                          :to="{path:'/zhuce/' + scope.row.id}"
                          target="_blank"
                          class="cl-blue"
                        >{{ scope.row.shoulihao }}</router-link>
                      </div>
                      <div v-else-if="item.prop === 'yaopinleixing_1'">
                        <span>
                          {{
                            (scope.row.yaopinleixing_1
                              ? scope.row.yaopinleixing_1
                              : "") +
                            (scope.row.zhuceleixing ? scope.row.zhuceleixing : "")
                          }}
                        </span>
                      </div>
                      <div v-else>{{scope.row[item.prop]}}</div>
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
                :class="{'abandon-click-method': nopms.fy}"
              ></el-pagination>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in tableHead"
          :prop="item.prop"
          :key="item.prop + index"
          :sortable="item.sort"
          :min-width="item.width || 100"
          :label="item.label"
        >
          <!-- 自定义表头 -->
          <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
            </span>
          </template>
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div
                v-if="item.prop==='yaopin_high'"
                :class="{'extensible-num-td': Number(scope.row.yaopin_high.count)&&scope.row.yaopin_high.yaopin_high}"
                @click="otherGetExpand(scope.row, item.prop, item.prop,item.prop,scope)"
                :title="scope.row.yaopin_high.yaopin_high|highestStatus"
              >
                <span>
                  <span>{{scope.row.yaopin_high.yaopin_high|highestStatus}}</span>
                  <span v-if="scope.row.yaopin_high.yaopin_high!=0">
                    (
                    <span class="num-text">{{scope.row.yaopin_high.count}}</span>)
                  </span>
                </span>
              </div>
              <div
                v-else-if="item.prop==='zhuangtaidate1'"
                :class="{'extensible-num-td': Number(scope.row.zhuangtaidate1.count)}"
                @click="otherGetExpand(scope.row,  item.prop, item.prop,item.prop,scope)"
                :title="scope.row.zhuangtaidate1.zhuangtaidate1"
              >
                <span v-if="scope.row.zhuangtaidate1.zhuangtaidate1">
                  {{scope.row.zhuangtaidate1.zhuangtaidate1}}
                  <span>
                    (
                    <span class="num-text">{{scope.row.zhuangtaidate1.count}}</span>)
                  </span>
                </span>
                <span v-else>/</span>
              </div>
              <div
                v-else
                :class="{'extensible-td': Number(scope.row[item.prop])}"
                @click="getExpandRes(scope.row.guifanqiyezhongbiao, item.prop, scope.row[item.prop],scope.row,scope)"
              >
                <span>{{ scope.row[item.prop] }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="extendCount.Species"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount.Species"
          :disabled="nopms.fy"
          :class="{'abandon-click-method': nopms.fy}"
        ></el-pagination>
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
const defaultFiled = tablehead.zhuce.species
const expandFiled = tablehead.zhuce.speciesExpand
const expandFiledTwo = tablehead.zhuce.speciesExpandTwo

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
  data() {
    return {
      scope: '',
      defaultFiled: defaultFiled,
      expandFiled: expandFiled,
      expandFiledTwo: expandFiledTwo,
      tableHead: [],
      tableType: null,
      getRowKeys(row) {
        return row.guifanname + row.guifanqiyezhongbiao
      },
      expandParams: {   //存分组查询的条件 横坐标和纵坐标的prop值 以及page pageSize
        guifanqiyezhongbiao_eq: '',
        guifanname_eq: '',
        pageSize: 20,
        page: 1
      },
      otherParams: null,//新增字段二级列表请求参数
      expands: {
        expandsrow: [],  //存要展开的行
        element: null, //存分组点击的dom元素
        expanCell: "", //存当前展开项对应的cell 便于控制收起
        expandRes: {},  //展开项对应的资源
        erroCode: '200',
      },
      currentRow: {},
      expandSort: '',
      expandsLoading: true,
      checkallShow: [],
      show_table: true,
      changeStyle: '',
      tableHeight: document.documentElement.clientHeight-48-60-60-50-88
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: state => state.Zhuce.tableconf,
      allBase: state => state.Zhuce.allBase,
      res4: state => _.keys(state.Zhuce.res4).length ? state.Zhuce.res4 : [],
      errocode: state => state.Zhuce.error,
      listLoading: state => state.Zhuce.listLoading,
      putong: state => state.Zhuce.putong,
      gaoji: state => state.Zhuce.gaoji,
      shaixuan: state => state.Zhuce.shaixuan,
      extendCount: state => state.Zhuce.extendCount,
      param: state => state.Zhuce.species_param, // 附加参数(存于vuex内)
      nopms: state => state.Zhuce.nopms,
      order: state => state.Zhuce.order
    }),
    exportDefaultFiled() {
      let arr = []
      for (let item of defaultFiled) {
        //导出没做好暂时隐藏
        if (item.prop != 'zxzt') {
          arr.push(item)
        };
      }
      return arr
    },
    currentFiled() {
      let removeFiled = this.otherParams && (this.otherParams.zhuangtaidate1_eq || this.otherParams.zhuangtaidate1)
        ? '最高状态时间'
        : '最新状态时间'

      return expandFiled.filter(element => element.label !== removeFiled)
    }
  },
  filters: {
    highestStatus(type) {
      let str = ''
      type = Number(type)
      switch (type) {
        case 1:
          str = '申请临床'
          break
        case 4:
          str = '批准临床'
          break
        case 7:
          str = '申请上市'
          break
        case 10:
          str = '批准上市'
          break
        default:
          str = '/'
      }
      return str
    }
  },
  methods: {

    // 跳转到智能分析
    sendGa() {
      if (this.nopms && !this.nopms.ksh) {
        window.ga("send","event", "tab", "click", "zhuce_analy");
        window._paq.push(['trackEvent', 'tab',"click","zhuce_analy",  ])
        this.$router.push({ path: '/zhuce/analy'})
      }
    },

    init() {
      this.tableHead = this.defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item)
        }
        return res
      }, [])
    },
    handleCurrentChange(val) {
      this.param.page = val
      if (val * this.param.pageSize <= 1500) {
        $('.out-of-page').hide()
        Store.dispatch('Zhuce/nomalSearch', { params: this.param })
      } else {
        $('.out-of-page').show()
      }
    },
    handleSizeChange(val) {
      this.param.page = 1
      this.param.pageSize = val
      if (val * this.param.page <= 1500) {
        $('.out-of-page').hide()
        Store.dispatch('Zhuce/nomalSearch', { params: this.param })
      } else {
        $('.out-of-page').show()
      }
    },
    setActiveIndex(el) {
      let src_el = el.find('.extensible-td').length
        ? el.find('.extensible-td')
        : el.find('.extensible-num-td')
      let width = src_el.find('span').eq(0).width() / 2 + 15
      el.eq(0).css('background-position-x', `${width}px`)
    },
    //分组展示的page发生改变
    expandCurrentChange(val, props) {
      if (this.otherParams) {
        this.otherParams.page = val
        this.otherParams.order = props.row.second[this.scope].order
      } else {
        this.expandParams.page = val
        this.expandParams.order = props.row.second[this.scope].order
      }
      this.handleRequest(props, props.row.second[this.scope].order)
    },
    sortChange(column, prop, order) {
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
      Store.commit('Zhuce/order', Object.assign({}, this.$store.state.Zhuce.order, { species: sort ? sort : null }))
      Store.dispatch('Zhuce/nomalSearch', { params: this.param })
    },
    expandSortChange({column, prop, order},props) {
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
      this.expandSort = sort
      if (this.otherParams) {
        this.otherParams.page = props.row.second[this.scope].page ? props.row.second[this.scope].page : 1
      } else {
        this.expandParams.page = props.row.second[this.scope].page ? props.row.second[this.scope].page : 1
      }
      this.handleRequest(props,sort)
    },
    getExpandRes(qiyemingcheng, groupname, num, row, scope) {
      console.log(qiyemingcheng, groupname, num, row, scope);
      window.ga("send", "event", "tab", "click", this.allBase.dbename + "_speciesgroup_" + groupname)
      window._paq.push(['trackEvent', 'tab',"click",this.allBase.dbename + "_speciesgroup_" + groupname,  ])

      this.otherParams = null
      if (Number(num)) {
        this.currentRow = row
        this.expandSort = ''
        this.expandParams.guifanqiyezhongbiao_eq = qiyemingcheng
        this.expandParams.groupname = groupname
        this.expandParams.guifanname_eq = row.guifanname
        this.expandParams.pageSize = 20
        this.expandParams.page = 1
        this.scope = scope.column.property
        if(scope.row.second[this.scope]){
          this.$set(scope.row.second,[this.scope],scope.row.second[this.scope])
          return
        }
        this.expandsLoading = true
        this.handleRequest(scope)
      }
    },
    otherGetExpand(row, key, item_key, post_key, scope) {
      window.ga("send", "event", "tab", "click", this.allBase.dbename + "_namegroup_" + key)
      window._paq.push(['trackEvent', 'tab',"click",this.allBase.dbename + "_namegroup_" + key,  ])

      let num = Number(row[key].count)
      if (num) {
        this.currentRow = row
        this.expandSort = ''
        this.otherParams = {
          page: 1,
          pageSize: 20
        }
        this.otherParams[post_key] = row[key][item_key]
        this.otherParams.guifanqiyezhongbiao_eq = row.guifanqiyezhongbiao
        this.otherParams.guifanname_eq = row.guifanname
        this.scope = scope.column.property
        if(scope.row.second[this.scope]) return
        this.expandsLoading = true
        this.handleRequest(scope)
      }
    },
    handleRequest(props, order) {
      let params = {}
      params = this.otherParams ? this.otherParams : this.expandParams
      if (params.zhuangtaidate1) {
          params.zhuangtaidate1_eq = params.zhuangtaidate1
          delete params.zhuangtaidate1
        }
      if (this.expandSort) params.order = this.expandSort
      Store.dispatch("Zhuce/getGroupRes", { path: '/api/zhuce/speciesList', params, row: this.currentRow, type: 1 }).then(res => {
        this.expandsLoading = false
        if (res.data.code == 404) {
          this.expands.expandRes = []
          this.expands.erroCode = '404'
        } else {
          if (res.data.code == 200) {
            this.expands.erroCode = '200'
            this.expands.expandRes = res.data.data
            res.data.data.order = order // 保存排序
            if(props) this.$set(props.row.second,[this.scope],res.data.data)
            // 处理二级列表出现后不能滚动的问题
            $('.el-table').addClass('el-table--scrollable-y')
          }
        }
      }).catch(error => {
        this.expandsLoading = false
        this.expands.expandRes = []
        this.expands.erroCode = '500'
      })
    },
    toggleRowExpansion(row, column, cell, event) {
      if(event.target.localName==='td'||event.target.className==='cell') return
      let num = Number($(cell).text().trim())
      let newColum = ['zhuangtaidate1', 'yaopin_high']
      if (newColum.indexOf(column.property) !== -1) {
        if (column.property === 'yaopin_high' && row.yaopin_high.yaopin_high == 0) {
          num = false
        } else {
          num = Number(row[column.property].count)
        }
      }

      if (num) {
        //前三个字段用表格1
        let tableTypeArr = ['yaopin_high', 'zhuangtaidate1']
        this.tableType = tableTypeArr.some(item => item === column.property) ?
        'one' : 'two'
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
          if (src_el.hasClass('active')) {
            this.expands.element.removeClass('active')
          } else {
            this.expands.element.addClass('active')
          }
          this.expands.expanCell = ""
        } else {
          this.expands.expanCell = column.id
          this.expands.expandsrow.push(row.guifanname + row.guifanqiyezhongbiao)
          this.expands.element.removeClass('active')
          src_el.addClass('active')
          this.expands.element = src_el
        }
        this.$nextTick(() => {
          this.setActiveIndex(src_el)
        })
      }
    },
    handleRss(rsss, type, shoulihao, name, qiyemingcheng) {
      window.ga("send", "event", "button", "click", "vip_zhuce_qiye_dingyue")
      window._paq.push(['trackEvent', 'button',"click", "vip_zhuce_qiye_dingyue",  ])

      let dataObj = {
        shoulihao: shoulihao,
        name: name,
        qiyemingcheng: qiyemingcheng
      }
      if (rsss) {
        //新页面打开
        let routeData = this.$router.resolve({
          path: "/usercenter/take/condition"
        });
        window.open(routeData.href, "_blank");
      } else {
        this.vueSetCookie("rss_type", type);
        this.vueSetCookie("rss_keyword", JSON.stringify(dataObj));
        let routeData = this.$router.resolve({
          path: "/usercenter/take/new"
        });
        window.open(routeData.href, "_blank");
      }
    },
    headerClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'padLHeader'
      };
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'padLCell'
      };
    },
    ztIcon(val) {
      let classname = ""
      switch (val) {
        case '申请临床':
          classname = 'sqlc'
          break;
        case '批准临床':
          classname = 'pzlc'
          break;
        case '申请上市':
          classname = 'sqss'
          break;
        case '批准上市':
          classname = 'pzss'
          break;
      }
      return classname
    }
  },
  created() {
    this.init()
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
    res4: {
      handler() {
        this.$nextTick(() => {
          this.registerEven()
        })
        // 重置行点击
        this.expands = {
          expandsrow: [],
          element: null,
          expanCell: "",
          expandRes: {},
          erroCode: '200',
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
    checkedFiled() {
      this.tableHead = []
      this.defaultFiled = _.map(defaultFiled, item => {
        if (this.checkedFiled.indexOf(item.prop) != -1) {
          item.checked = true
          this.tableHead.push(item)
        } else {
          item.checked = false
        }
        return item
      })
    },
    // tableconf(n) {
    //   //后台控制列表宽度
    //   this.expandFiled = this.tableheaderCombain(n, this.expandFiled);;
    // }
  }
}
</script>
<style lang="less">
@import "~@/assets/less/var.less";
.row-class-position {
  position: relative;
  td:first-child {
    // padding-left: 24px;
  }
  .row-absolute {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30px;
    writing-mode: vertical-lr;
    line-height: 30px;
    text-align: center;
    letter-spacing: 1px;
    display: none;
    color: #fff;
    overflow: hidden;
    cursor: pointer;
  }
  &:hover {
    .row-absolute {
      display: block;
    }
  }
}
.extensible-table {
  .extensible-td {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: @PrimaryColor;
      font-weight: 600;
    }
  }
  .extensible-num-td {
    cursor: pointer;
    > span > span {
      white-space: nowrap;
    }
    .num-text {
      text-decoration: underline;
      &:hover {
        color: @PrimaryColor;
        font-weight: 600;
      }
    }
  }
  tr.el-table__row--striped {
    td {
      &.active {
        color: @PrimaryColor;
        font-weight: 600;
        background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
          30px bottom #f5f8fb;
        border: none;
      }
    }
  }
  td {
    position: relative;
    .el-icon-caret-top {
      font-size: 20px;
      display: none;
    }
    &.active {
      color: @PrimaryColor;
      font-weight: 600;
      background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
        30px bottom;
      border: none;
    }
  }
}

</style>
