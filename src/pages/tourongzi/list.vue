<template>
  <div class="la-trz">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.ksh}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Tourongzi" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Tourongzi"
          api_name="tourongzi"
          :max_num="extendCount"
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
          :label="item.label">
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
            <div v-if="item.prop === 'type'">
              <span v-if="vueCheckListPms('Tourongzi', item.label)">{{ scope.row.type }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'receiver'">
              <span v-if="vueCheckListPms('Tourongzi', item.label)">
                <a :href="scope.row.qyid ? '/company/'+scope.row.qyid : 'javascript: ;'" :class="scope.row.qyid ? 'cl-blue' : 'no-blue'" :target="scope.row.qyid ? '_blank' : '_self'">{{ scope.row.receiver }}</a>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'round'">
              <span v-if="vueCheckListPms('Tourongzi', item.label)">{{ scope.row.round }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'money'">
              <span v-if="vueCheckListPms('Tourongzi', item.label)">{{ scope.row.money }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'funders'">
              <!-- <span v-if="vueCheckListPms('Tourongzi', item.label)">
                <a :href="scope.row.qiyebianma2 ? '/company/'+scope.row.qiyebianma2 : '#'" :class="scope.row.qiyebianma2 ? 'cl-blue' : 'no-blue'" :target="scope.row.qiyebianma2 ? '_blank' : '_self'">{{ scope.row.funders }}</a>
              </span> -->
              <span v-if="vueCheckListPms('Tourongzi', item.label)">{{ scope.row.funders }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'area'">
              <span v-if="vueCheckListPms('Tourongzi', item.label)">{{ scope.row.area }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'date'">
              <span v-if="vueCheckListPms('Tourongzi', item.label)">{{ scope.row.date }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'detail'">
              <!-- <span v-if="vueCheckListPms('Tourongzi', item.label)">详情</span>
              <span v-else class="abandon-click-method">暂无权限</span> -->
              <a :href="'/tourongzi/'+scope.row.id" class="cl-blue" target="_blank">详情</a>
            </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
         <el-pagination
          v-if="extendCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="extendCount"
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
  import tablehead from '@/config/tablehead'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.tourongzi.trz
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
        vuex_name: 'Tourongzi',
        // param:{
        //   order:null,
        //   page:1,
        //   pageSize:20,
        // },
        defaultFiled: defaultFiled,
        filedVisible: false,
        tableHead:[],
        checkallShow: [],
        show_table: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Tourongzi.tableconf,
        allBase: state => state.Tourongzi.allBase,
        res1: state => _.keys(state.Tourongzi.res1).length ? state.Tourongzi.res1.res : [],
        errocode: state => state.Tourongzi.error,
        listLoading: state => state.Tourongzi.listLoading,
        params: state => state.Tourongzi.putong,
        words: state => state.Tourongzi.gaoji,
        group: state => state.Tourongzi.shaixuan,
        extendCount: state => state.Tourongzi.extendCount,
        nopms: state => state.Tourongzi.nopms,
        param: state =>state.Tourongzi.sx_params,
        order: state => state.Tourongzi.order
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
      // 跳转到智能分析
      sendGa() {
        if (this.nopms && !this.nopms.ksh) {
          window.ga("send","event", "tab", "click", "tourongzi_analy");
          window._paq.push(['trackEvent', 'tab', 'click',"tourongzi_analy", ])
          this.$router.push({ path: '/tourongzi/analy'})
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

          Store.dispatch('Tourongzi/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Tourongzi/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      }
    },
    created () {
      this.init()
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
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
      /* $route(){
        if(this.$route.path==='/tourongzi/list'&&!this.res1.length){
          Store.dispatch('Tourongzi/nomalSearch',{queryToPutong: false,tabs:true})
        }
      }, */
      tableHead: {
        handler() {
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
<style lang="less" >
@import "~@/assets/less/var.less";

  .la-trz{
    min-height: 100px;
    position:relative;
    .no-blue{
      color:@FontColor1;
      text-decoration: none;
      cursor: text;
    }
    .no-data-msg {
      width: 100%;
      text-align: center;
      font-weight: bold;
      // font-size: 20px;
    }
    .actions{
      position:static;
      padding: 0 10px;
      float: right;
      cursor: pointer;

      .action-btn {
        margin-right: 16px;
      }
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
