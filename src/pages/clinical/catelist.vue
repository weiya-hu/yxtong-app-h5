<template>
  <div class="la-list">
    <template v-if="changeBox==='szm'">
      <div class="cate-search">
        <div class="cate-label-ou">
          <div class="cate-label" v-show="param.cate">
            <span>{{cateLabelObj[cate_param_one]}}：按类别浏览 > {{param.cate}} </span>
            <span class="el-icon-close" @click="handleCloseClick()"></span>
          </div>
        </div>
        <div class="cate-search-box">
          <span>{{cateLabelObj[cate_param_one]}}</span>
          <el-autocomplete
            v-model="param.name"
            :trigger-on-focus="false"
            placeholder=""
            clearable
            @clear="changeTitle"
            :fetch-suggestions="querySearch"
            @keyup.native.enter="changeTitle"
            @select="changeTitle"
                :popper-append-to-body="false"
            ref="popoverAutoInput"
          ><i class="el-icon-search el-input__icon"
              slot="suffix"
              @click="changeTitle">
            </i>
            <template slot-scope="{ item }">
              <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" :title="item.value">{{ item.value }}</div>
            </template>
          </el-autocomplete>
        </div>
      </div>
    <List :loading="listLoading" :nodata="cateList && !cateList.length">
      <el-table
        :data="cateList"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        @sort-change="sortCateChange"
        :default-sort="param.order ? defaultSort(param.order) : {}"
        >
        <el-table-column
          v-for="item in headTable"
          :prop="item.prop"
          :min-width="item.width || 100"
          :width="item.okWidth || null"
          :key="item.prop"
          :sortable="item.sort"
          :label="item.label">
          <template slot-scope="scope">
            <div v-if="vueCheckListPms('Clinical', item.label)" :title="scope.row[item.prop]">

              <template v-if="item.prop==='title'"><span class="underline-span" @click="searchClick(scope.row[item.prop])">{{scope.row[item.prop]}}</span></template>
              <template v-else><span>{{scope.row[item.prop]}}</span></template>
            </div>
            <span v-else class="abandon-click-method">暂无权限</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="cateCount">
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
    </List>
    </template>
    <template v-else-if="changeBox==='lbqu'">
    <List :loading="listLoading" :nodata="cateNum && !cateNum.length">
      <el-table
        :data="cateNum"
        stripe
        fixed
        ref="ElTable"
        :height="tableHeight"
        v-if="hideSortF"
        >
        <el-table-column
          v-for="(item, ix) in cateHead"
          :prop="item.prop"
          :key="ix"
          :sortable="item.sort"
          :label="item.label">
          <template slot-scope="scope">
            <template v-if="item.prop==='name'"><span class="underline-span" @click="nextClick(scope.row[item.prop])">{{scope.row[item.prop]}}</span></template>
            <template v-else><span>{{scope.row[item.prop]}}</span></template>
          </template>
        </el-table-column>
      </el-table>
    </List>
    </template>
    <template v-else-if="changeBox==='dt'">
      <stateMap :guanlian="guanlian" />
    </template>
  </div>
</template>
<script>
  import List from "@/components/layouts/list"
  import { mapState } from 'vuex'
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  import stateMap from './components/stateMap'

  export default{
    components: {
      List,
      stateMap
    },
    mixins: [
      commonMixins,
      setTableHMixins
    ],
    data () {
      return {
        hideSortF: true,
        guanlian: {
          szm: {
            conditions:'conditions2',
            interventions:'interventions2',
            rare:'rare',
            dietary:'dietary2',
            sponsor:'sponsor2',
            locations:'locations2_guifan',
          },
          lbqu: {
            conditions:'conditions2',
            interventions:'interventions2',
            rare:'rare',
            dietary:'dietary2',
            sponsor:'sponsor2',
            locations:'locations2_guifan',
          },
          dt: {
            locations:'locations2_guifan1',
          }
        },
        cateHead: [],
        headTable:[
          {
            prop:"title",
            label:"疾病",
            width:130,   //最少宽度
            checked:true //默认是否选择
          },
          {
            prop:"doc_count",
            label:"临床试验研究总数",
            sort: "custom",
            width:130,   //最少宽度
            checked:true //默认是否选择
          },

        ],
        tableHeight: document.documentElement.clientHeight-48-60-60-60-88,
      }
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        allBase: state => state.Clinical.allBase,
        cateList: state => _.keys(state.Clinical.cateList).length ? state.Clinical.cateList.res : [],
        listLoading: state => state.Clinical.listLoading,
        cateCount: state => state.Clinical.cateCount,
        cateNum: state => state.Clinical.cateNum,
        changeBox: state => state.Clinical.changeBox,
        cate_param_one: state => state.Clinical.cate_param_one,
        cateLabelObj: state => state.Clinical.cateLabelObj,
        param: state => state.Clinical.cate_param,
      }),
    },
    // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
    activated() {
      this.registerEven();
    },
    watch: {
      cateList: {
        handler() {
          this.$nextTick(() => {
            this.registerEven()
          })
        }
      },
      headTable: {
        handler() {
          this.$nextTick(() => {
            this.registerEven();
          });
        },
        immediate: true,
      },
      cateHead: {
        handler() {
          this.$nextTick(() => {
            this.registerEven();
          });
        },
        immediate: true,
      },
      cateNum: {
        handler() {
          this.hideSortF = false
          setTimeout(() => {
            this.hideSortF = true
          }, 0)
          this.$nextTick(() => {
            this.registerEven(10)
          })
        }
      },
      cate_param_one: {
        handler() {
          this.headTable[0].label = this.cateLabelObj[this.cate_param_one]
          this.cateHead = [
            {
              prop:"name",
              label: this.cateLabelObj[this.cate_param_one] + '：按类别浏览'
            },{
              prop:"doc_count",
              label:"临床试验研究总数",
              sort: true,
            }
          ]
        }
      }
    },
    methods: {
      searchClick(name){
        if(this.param.cate){
          window.ga("send", "event", "option", "click","clinical_conditions_category_"+ this.param.cate + '_' + name) // param.cate
          window._paq.push(['trackEvent', 'option', 'click', "clinical_conditions_category_"+ this.param.cate + '_' + name])

        }else{
          window.ga("send", "event", "option", "click","clinical_conditions_alphabetical_"+name)
          window._paq.push(['trackEvent', 'option', 'click', "clinical_conditions_alphabetical_"+ name])

        }
        this.vueExtendTo('/clinical?'+this.guanlian[this.changeBox][this.cate_param_one]+'_eq='+name)
      },
      nextClick(name){
        window.ga("send", "event", "option", "click","clinical_conditions_category_"+name)
        window._paq.push(['trackEvent', 'option', 'click', "clinical_conditions_category_"+ name])

        this.param.page = 1
        this.param.pageSize = 20
        this.param.cate = name
        this.param.type = this.cate_param_one
        this.param.order = null
        Store.commit('Clinical/changeBox', 'szm')
        Store.dispatch('Clinical/getCatestand',{params:this.param})

      },
      handleCloseClick(){
        this.param.page = 1
        this.param.cate = null
        Store.commit('Clinical/changeBox', 'lbqu')
        Store.dispatch('Clinical/getCate',this.cate_param_one)
      },
      //获取提示词
      querySearch(queryString, callback) {
        window.Axios({
          methods: 'get',
          url: '/api/clinical/cateinput',
          params: {
            type: this.param.type,
            name: this.param.name,
            cate:this.param.cate,
          }
        }).then(res=>{
          if (res.data == '') {
            callback([])
          } else {
            let data = []
            for (let i = 0, l = res.data.data.length; i < l; i++) {
              data.push({"value": res.data.data[i]})
            }
            callback(data)
          }
        })
        .catch(thrown=>{
          console.log("请求出错了");
        })

      },
      changeTitle(){
        this.param.page = 1
        this.param.order = null
        Store.dispatch('Clinical/getCatestand',{params:this.param})
      },
      handleCurrentChange (val) {
        this.param.page = val
        if (val * this.param.pageSize <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Clinical/getCatestand',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Clinical/getCatestand',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      sortCateChange (column) {
        let prop = column.prop
        let sort
        // prop为null时，默认排序
        if (prop) {
          if (column.order == "ascending") {
            sort = prop + " " + "asc"
          } else if (column.order == "descending") {
            sort = prop + " " + "desc"
          } else {
            sort = ""
          }
        }
        this.param.order = sort
        Store.dispatch('Clinical/getCatestand', {params: this.param})
      },
    },
    created () {

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
    mounted () {
      this.inputPopMouseleave(this)
    }
  }
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
  .cate-search{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    .cate-label-ou{
      flex: 1;
    }
    .cate-label{
      display: inline-block;
      background-color: #f6f8fc;
      border: 1px solid #dfe5f1;
      font-size: 12px;
      color: #35384a;
      border-radius: 4px;
      height: 24px;
      line-height: 24px;

      >span{
        padding: 0 10px;
      }
      .el-icon-close{
        font-weight: 700;
        cursor: pointer;
      }
      &:hover {
        background-color: #eaeef9;
      }
    }
    .cate-search-box{
      display: flex;
      align-items: center;
      >span{
        margin-right: 10px;
      }
    }
    .el-input__icon{
      padding-right: 6px;
      line-height: 30px;
      cursor: pointer;
    }
  }
  .underline-span{
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      color: @PrimaryColor;
      color: #4877e8;
    }
  }

</style>
