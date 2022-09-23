<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions" :style="posi">
        <!-- 显示 -->
        <list-check :defaultFiled="defaultFiled"
            style="text-align:left;" vuex_name="Qxzhuce" :showArray="tableHead" @changeTableHeader="(list)=>changeTableHeader(this,list)" />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Qxzhuce"
          api_name="qxzhuce"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align:left;"></Export>
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
        v-if="show_table"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :min-width="item.field_width || item.width || 100"
          :key="item.prop"
          :sortable="item.sort"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :title="scope.row[item.prop]">
              <div v-if="item.prop === 'slh'">
                <span v-if="vueCheckListPms('Qxzhuce', item.label)">
                  <router-link
                    tag="a"
                    :to="'/qxzhuce/'+scope.row.id"
                    target="_blank"
                    class="cl-blue"
                  >{{ scope.row.slh }}</router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else-if="item.prop === 'sqqy'">
                <span v-if="vueCheckListPms('Qxzhuce', item.label)">
                  <a
                    @click.prevent="resolveTdLink(item.prop, scope.row.sqqy)"
                    class="link-underline"
                  >{{ scope.row.sqqy }}</a>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>

              <div v-else>
                <span v-if="vueCheckListPms('Qxzhuce', item.label)">{{ scope.row[item.prop] }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
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
  import listCheck from "@/components/common/list-check"
  import Export from "@/components/common/export"
  import { mapState } from "vuex";
  import tablehead from "@/config/tablehead";
  import List from "@/components/layouts/list"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.qxzhuce.list
  export default {
    components: {
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
        defaultFiled: defaultFiled,
        tableHead: [],
        show_table: true,
        vuexName: "Qxzhuce",
        apiName: "qxzhuce",
        vuex_name: 'Qxzhuce',
        posi: 'position:static;padding:0 15px;text-align:right;',
        tableHeight: document.documentElement.clientHeight-48-60-35-88
      };
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        allBase: state => state.Qxzhuce.allBase,
        nopms: state => state.Qxzhuce.nopms,
        extendCount: state => state.Qxzhuce.extendCount,
        tableconf: state => state.Qxzhuce.tableconf,
        res1: state => _.keys(state.Qxzhuce.res1).length ? state.Qxzhuce.res1.res : [],
        errocode: state => state.Qxzhuce.error,
        listLoading: state => state.Qxzhuce.listLoading,
        param: state => state.Qxzhuce.param,
        order: state => state.Qxzhuce.order
      }),
      exportDefaultFiled () {
        let arr = []
        let addFiled = [
          {
            prop:"sfqk",
            label:"收费情况",
            width:150,   //最少宽度
            checked:true //默认是否选择
          },
          {
            prop:"zs",
            label:"主审专家",
            width:150,   //最少宽度
            checked:true //默认是否选择
          }
        ]
        for (let item of defaultFiled.concat(addFiled)) {
          arr.push(item)
        }
        return arr
      },
    },
    mounted() {
    },
    methods: {
      init() {
        this.tableHead = this.defaultFiled.reduce((res, item) => {
          if (item.checked) {
            res.push(item);
          }
          return res;
        }, []);
      },
      sortChange(column, prop, order) {
        let sort;
        if (column.prop) {
          sort = column.prop + " " + (column.order == "descending" ? "desc" : "asc");
        }
        this.param.order = sort;
        Store.commit('Qxzhuce/order', Object.assign({}, this.$store.state.Database.order, {base: sort ? sort : null}))
        Store.dispatch("Qxzhuce/nomalSearch", { params: this.param });
      },
      resolveTdLink(type_id, key_word) {
        window.open(`/qxzhuce?${type_id}=${key_word}`, "_blank")
      },
      handleCurrentChange (val) {
        this.param.page = val
        if (val * this.param.pageSize <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Qxzhuce/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('Qxzhuce/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
    },
    created() {
      this.init();
    },
    updated() {
      this.vueTogglePmsTooltip();
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
      tableconf(n){
        this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled);
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
