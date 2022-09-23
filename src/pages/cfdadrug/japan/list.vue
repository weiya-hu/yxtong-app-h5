<template>
  <div class="la-list">
    <List :loading="listLoading" :nodata="res1 && !res1.length">
      <div class="actions" :style="posi">
        <!-- 显示 -->
        <list-check
          :defaultFiled="defaultFiled"
          vuex_name="Pmda"
          :showArray="tableHead"
          @changeTableHeader="(list)=>changeTableHeader(this,list)"
          style="text-align:left;"
        />
        <!-- 导出 -->
        <Export
          :out_max="allBase.out_max"
          vuex_name="Pmda"
          api_name="pmda"
          :max_num="extendCount"
          :defaultFiled="exportDefaultFiled"
          outdataAction="base"
          style="text-align:left;"
        ></Export>
      </div>
      <div class="item_content1">
        <el-table
          ref="ElTable"
          :height="tableHeight"
          :data="res1"
          stripe
          fixed
          @sort-change="sortChange"
          :default-sort = "order.base ? defaultSort(order.base) : {}"
          class="table"
          style="width: 100%"
          v-if="show_table"
        >
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :sortable="item.sort"
            :min-width="item.field_width || item.width || 100"
            :key="item.prop+''"
            :label="item.label"
          >
           <template :slot="item.tips ? 'header':''" slot-scope="scope">
            <span>
              {{item.label}}
              <el-tooltip class="" effect="zhuce" placement="right">
                <div slot="content" v-if="item.prop == 'shuoming'">{{helpDesc.shuoming}}</div>
                <i class="el-icon-question cl-green" style="margin-left:4px;"></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
              <div :title="scope.row[item.prop]">
              <!-- <div v-if="item.prop === 'approvalnumber'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.approvalnumber }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div> -->
              <div v-if="item.prop === 'tname'">
                <span v-if="vueCheckListPms('Pmda', item.label)">
                  <router-link
                    tag="a"
                    :to="{path:'/pmda/' + scope.row.id}"
                    target="_blank"
                    class="cl-blue"
                  >{{ scope.row.tname }}</router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <!-- <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.name }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'jan'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.jan }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'cname'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.cname }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'company'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.company }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'date'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.date }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'producttypename'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.producttypename }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'zwform'">
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row.zwform }}</span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div> -->
              <div v-else-if="item.prop === 'pdf_url'">
                <span v-if="vueCheckListPms('Pmda', item.label)">
                  <a
                    v-if="scope.row.pdf_url"
                    :href="scope.row.pdf_url"
                    class="cl-blue"
                    target="_blank"
                  >查看</a>&nbsp;
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else-if="item.prop === 'if_url'" class="download-box">
                <span v-if="vueCheckListPms('Pmda', item.label)">
                  <template v-if="scope.row.if_url">
                    <a
                      class="attachment cl-blue"
                      v-if="(scope.row.if_url.split(';')).length == 1"
                      :href="(scope.row.if_url.split(';'))[0]"
                      target="_blank"
                    >
                      <i class="iconfont icon-xiazai"></i>
                    </a>
                    <template v-else>
                      <i class="iconfont icon-xiazai"></i>
                      <div class="attachments">
                        <template v-for="(item, index) in scope.row.if_url.split(';')">
                          <a
                            class="attachment cl-blue"
                            :key="index"
                            v-if="item"
                            :href="item"
                            target="_blank"
                          >下载{{ index+1 }}</a>&nbsp;
                        </template>
                      </div>
                    </template>
                  </template>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-else>
                <span v-if="vueCheckListPms('Pmda', item.label)">{{ scope.row[item.prop] }}</span>
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
            :class="{'abandon-click-method': nopms.fy}"
          ></el-pagination>
          <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
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
  import setTableHMixins from '@/mixins/setTableH.js'
  import commonMixins from '@/mixins/common.js'
  const defaultFiled = tablehead.cfdadrug.Detailpmda
  export default {
    components: {
      List,
      Export,
      listCheck
    },
    mixins: [
      setTableHMixins,
      commonMixins
    ],
    data() {
      return {
        vuex_name: 'Pmda',
        defaultFiled: defaultFiled,
        filedVisible: false,
        tableHead: [],
        checkallShow: [],
        show_table: true,
        changeStyle: "",
        helpDesc: {
          shuoming: '此列为ATC第三级分类，详细分类可至详情页查看'
        },
        tableHeight: document.documentElement.clientHeight-48-60-60-35-88,
        posi: 'position:static;text-align:right;padding:0 10px;'
      };
    },
    computed: {
      ...mapState({
        tableconf:state => state.Pmda.tableconf,
        nopms: state => state.Pmda.nopms,
        allBase: state => state.Pmda.allBase,
        extendCount: state => state.Pmda.extendCount,
        putong: state => state.Pmda.putong,
        gaoji: state => state.Pmda.gaoji,
        shaixuan: state => state.Pmda.shaixuan,
        param: state => state.Pmda.param,
        order: state => state.Pmda.order,
        listLoading: state => state.Pmda.listLoading,
        res1: state => (_.keys(state.Pmda.res1).length ? state.Pmda.res1 : [])
      }),
      exportDefaultFiled() {
        let arr = [];
        for (let item of defaultFiled) {
          arr.push(item);
        }
        return arr;
      }
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
        handler(val) {
          this.$nextTick(() => {
            this.registerEven()
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
          Store.dispatch("Pmda/nomalSearch", { params: this.param })
        } else {
          $(".out-of-page").show();
        }
      },
      handleSizeChange(val) {
        this.param.page = 1
        this.param.pageSize = val;
        if (val * this.param.page <= 1500) {
          $(".out-of-page").hide();
          Store.dispatch("Pmda/nomalSearch", { params: this.param })
        } else {
          $(".out-of-page").show();
        }
      }
    },
    created() {
      this.init();
    },
    mounted() {
    },
    updated() {
      if (this.param.pageSize * this.param.page <= 1500) {
        $('.out-of-page').hide()
      } else {
        $('.out-of-page').show()
      }
      this.vueTogglePmsTooltip()
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
// @import "~@/assets/less/app.less";

.la-list {
  .item_top {
    height: 190px;
    padding: 28px 20px 21px 35px;
    display: flex;
    .content_one {
      margin: 0px 5px;
      flex-grow: 1;
      background-color: #f5f8fb;
      padding-right: 30px;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        width: 100%;
        padding-left: 34px;
        display: flex;
        .content_total {
          flex-grow: 1;
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 36px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_two {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 40px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
    .content_three {
      margin-left: 12px;
      background-color: #f5f8fb;
      float: left;
      .content_title {
        padding-top: 15px;
        .content_shenbao {
          width: 140px;
          height: 40px;
          margin: 0 auto;
          line-height: 40px;
          .shenbao_left {
            width: 30px;
            height: 1px;
            background: #4a77e8;
            margin-top: 17px;
            float: left;
          }
          .shenbao_word {
            margin: 0 10px;
            float: left;
            font-size: 14px;
            color: #4a77e8;
          }
        }
      }
      .contents {
        background: #5f88eb;
        padding-left: 34px;
        .content_total {
          width: 52px;
          height: 94px;
          text-align: center;
          float: left;
          margin-right: 42px;
          .total_item1 {
            padding-top: 10px;
            font-size: 12px;
          }
          .total_item2 {
            padding-top: 14px;
            span {
              font-size: 20px;
              color: #4a77e8;
            }
          }
        }
      }
    }
  }
  .item_content {
    height: 408px;
    padding-left: 34px;
    .chart_box {
      background-color: white;
      float: left;
      .echarts {
        width: 760px;
        height: 400px;
      }
    }
  }
  .item_content1 {
    height: auto;
    background-color: white;
    .el-table {
      .el-table__header-wrapper {
        padding-left: 34px;
        background-color: #eaeef9;
        .el-table__header {
          .has-gutter {
            .el-table_3_column_15 {
              width: 169px !important;
            }
          }
        }
      }
      .el-table__body-wrapper {
        .el-table__body {
          .el-table__row td {
            padding-left: 34px;
          }
        }
      }
    }
  }
  .actions {
    position: absolute;
    right: 10px;
  }
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
}
</style>

