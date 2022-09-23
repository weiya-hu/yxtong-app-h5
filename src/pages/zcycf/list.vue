<template>
  <div>
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions actions1" style="align-items: center;">
        <span class="action-btn"
          :class="{'abandon-click-method': nopms && nopms.ksh}"
          @click="sendGa">
          <span class="icon iconfont">&#xe643;</span>
          智能分析
        </span>
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled" vuex_name="Zcycf" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Zcycf"
          api_name="chufang"
          :max_num="listCount"
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
            <div :title="item.prop!=='down'?scope.row[item.prop]:''">
            <div v-if="item.prop === 'name'">
              <span v-if="vueCheckListPms('Zcycf', item.label)">
                <a :href="'/chufang/' + scope.row.id" :class="'cl-blue'" target="_blank" >{{ scope.row.name }}</a>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.prop === 'down'">
              <span v-if="vueCheckListPms('Zcycf', item.label)">
                <a  v-if="scope.row.down" :href="scope.row.down" class="cl-blue" target="_blank">查看</a>
                <span v-else>/</span>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.prop === ''">
              <span v-if="vueCheckListPms('Zcycf', item.label)">
                <a :href="'https://db.yaozh.com/bigdata/zcycf?id='+scope.row.id" class="cl-blue" target="_blank">查看</a>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else>
              <span v-if="vueCheckListPms('Zcycf', item.label)">{{ scope.row[item.prop] }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          v-if="listCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="listCount"
          :disabled="nopms.fy"
          :class="{'abandon-click-method': nopms.fy}">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>

    </List>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import tablehead from '@/config/tablehead'
  import List from '@/components/layouts/list'
  import Export from '@/components/common/export'
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.zcycf.ls
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
        vuex_name: 'Zcycf',
        defaultFiled: defaultFiled,
        tableHead:[],
        checkallShow: [],
        show_table: true,
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-47-88,
        isFirst: true //是否第一次点击筛选
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Zcycf.tableconf,
        allBase: state => state.Zcycf.allBase,
        currentPage: state => state.Zcycf.currentPage,
        res1: state => _.keys(state.Zcycf.res1).length ? state.Zcycf.res1 : [],
        errocode: state => state.Zcycf.error,
        listLoading: state => state.Zcycf.listLoading,
        params: state => state.Zcycf.putong,
        words: state => state.Zcycf.gaoji,
        group: state => state.Zcycf.shaixuan,
        listCount: state => state.Zcycf.listCount,
        nopms: state => state.Zcycf.nopms,
        param: state => state.Zcycf.param,
        order: state => state.Zcycf.order
      }),
      exportDefaultFiled () {
        let arr = []
        for (let item of defaultFiled) {
          if(item.prop&&item.prop!=='down'){
            arr.push(item)
          }
        }
        return arr
      },
    },
    methods: {
       // 跳转到智能分析
      sendGa() {
        if (this.nopms && !this.nopms.ksh) {
          window.ga("send","event", "tab", "click", "chufang_analy");
          window._paq.push(['trackEvent', 'tab',"click","chufang_analy", ])
          this.$router.push({ path: '/chufang/analy'})
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
          Store.dispatch('Zcycf/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Zcycf/nomalSearch',{params:this.param})
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
      /* $route:{
        handler() {
          if(this.$route.path==='/chufang/list'&&!this.res1.length){
            Store.dispatch('Zcycf/nomalSearch',{queryToPutong: false})
          }
        },
        immediate: true
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
      currentPage(val) {
        if(val){
          this.param.page = val
        }
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
<style lang="less">
@import "~@/assets/less/var.less";
  .actions1{
    // line-height: 35px;
    padding-right: 10px;
    display: flex;
    justify-content: flex-end;

      .action-btn{

        cursor: pointer;
        margin-right: 16px;

        &:hover {
          color: @PrimaryColor;
        }
      }
  }
  .la-slh{
    min-height: 100px;
    .no-data-msg {
      width: 100%;
      text-align: center;
      font-weight: bold;
      // font-size: 20px;
    }
    .no-blue{
      color:@FontColor1;
      text-decoration: none;
      cursor: text;
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
