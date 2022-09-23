<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res2 && !res2.length">
      <div class="actions">
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Yzx"
          :showArray="tableHead"
          @changeTableHeader="(list)=>changeTableHeader(this,list)"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Yzx"
          api_name="yzx"
          :max_num="extendCount.nameCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="name"
        ></Export>
      </div>
      <el-table ref="ElTable" :height="tableHeight" :data="res2" stripe fixed
        @sort-change="sortChange"
        :default-sort = "order.name ? defaultSort(order.name) : {}"
        v-if="show_table">
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
            <div v-if="item.prop === 'name'">
              <span v-if="vueCheckListPms('Yzx', item.label)" class="cell-shoulihao-wrap">
                <router-link
                  tag="a"
                  :to="{path:'/yzx/detail',query:{name:scope.row.name,bianma:scope.row.bianma}}"
                  class="cell-shoulihao no-underline cl-blue"
                  target="_blank"
                >{{ scope.row.name }}</router-link>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'pizhunwenhao'">
              <span
                v-if="vueCheckListPms('Yzx', item.label)"
              >{{ (scope.row.yaopinleixing_1 ? scope.row.yaopinleixing_1 : '') + (scope.row.pizhunwenhao ? scope.row.pizhunwenhao : '') }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'guige'">
              <span v-if="vueCheckListPms('Yzx', item.label)">{{ scope.row.guige||'/' }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'qiye'">
              <span v-if="vueCheckListPms('Yzx', item.label)">{{ scope.row.qiye||'/' }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'yzxtype'">
              <span
                v-if="vueCheckListPms('Yzx', item.label)"
                class="font-bold"
              >{{ scope.row.yzxtype }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'zgjd'">
              <span
                :class="yzxjdClass(scope.row.zgjd)"
                v-if="vueCheckListPms('Yzx', item.label)"
              >{{ scope.row.zgjd||'/' }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-if="item.prop === 'xiangqing'">
              <span v-if="vueCheckListPms('Yzx', item.label)">
                <span v-if="scope.row.ck===0">/</span>
                <router-link
                  v-else
                  tag="a"
                  :to="{path:'/yzxjd',query:{ypname:scope.row.name}}"
                  class="cell-shoulihao no-underline cl-blue"
                  target="_blank"
                >查看</router-link>
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
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
          :class="{'abandon-click-method': nopms.fy}"
        ></el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
    </List>
  </div>
</template>
<script>
  import List from "@/components/layouts/list"
  import Export from "@/components/common/export"
  import { mapState } from "vuex"
  import tablehead from "@/config/tablehead"
  import listCheck from "@/components/common/list-check"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  const defaultFiled = tablehead.yzx.pz
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
        activeTabName: "first",
        defaultFiled: defaultFiled,
        tableHead: [],
        checkallShow: [],
        show_table: true,
        vuex_name: 'Yzx',
        changeStyle: "",
        tableHeight: document.documentElement.clientHeight-48-60-60-50-88
      };
    },
    computed: {
      //同时获取多个属性
      ...mapState({
        tableconf: state => state.Yzx.tableconf,
        allBase: state => state.Yzx.allBase,
        res2: state => (_.keys(state.Yzx.res2).length ? state.Yzx.res2.res : []),
        yzxjd: state => state.Yzx.yzxjd,
        listLoading: state => state.Yzx.listLoading,
        putong: state => state.Yzx.putong,
        gaoji: state => state.Yzx.gaoji,
        shaixuan: state => state.Yzx.shaixuan,
        extendCount: state => state.Yzx.extendCount,
        param: state => state.Yzx.name_param, // 附加参数(存于vuex内)
        nopms: state => state.Yzx.nopms,
        order: state => state.Yzx.order
      }),
      exportDefaultFiled() {
        let arr = [];
        for (let item of defaultFiled) {
          arr.push(item);
        }
        return arr;
      }
    },
    mounted() {
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
        //后台控制列表宽度
        this.defaultFiled = this.tableheaderCombain(n,this.defaultFiled)
      }
    },
    methods: {
      yzxjdClass(code) {
        return `yzxjd-btn yzxjd-btn-${this.yzxjd[code]}`;
      },
      init() {
        this.tableHead = this.defaultFiled.reduce((res, item) => {
          if (item.checked) {
            res.push(item);
          }
          return res;
        }, []);
      },
      handleCurrentChange(val) {
        this.param.page = val;
        if (val * this.param.pageSize <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Yzx/nomalSearch", { params: this.param });
        } else {
          $(".out-of-page").show();
        }
      },
      handleSizeChange(val) {
        this.param.page = 1
        this.param.pageSize = val;
        if (val * this.param.page <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Yzx/nomalSearch", { params: this.param });
        } else {
          $(".out-of-page").show();
        }
      }
    },
    created() {
      this.init();
    },
    updated() {
      this.vueTogglePmsTooltip();
    }
  }
</script>
<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
.el-table {
  .cell {
    overflow: visible;
    // padding-left: 30px;
  }
}

.cell-shoulihao-wrap {
  position: relative;
  .cell-shoulihao {
    float: left;
  }
}
.bg-green-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Green;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}
.bg-orange-br {
  // display: inline-block;
  text-align: center;
  font-size: 12px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  background-color: @Orange;
  color: #fff;
  max-width: 80px;
  overflow: hidden;
}

.ytz-icons {
  display: inline-block;
  & > span {
    overflow: hidden;
    display: inline-block;
    float: left;
    font-size: 12px;
    padding: 4px;
    // margin: 0px 0px 0px 6px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    text-align: center;
    color: #fff;
    border-radius: 11px;
  }
}
.yxsp-icon {
  background: @McTypeGreen;
}
.zdzx-icon {
  background: @PrimaryColor;
}
.tssp-icon {
  background: @McTypeOrange;
}
// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102,102,102, .4);
}
</style>
