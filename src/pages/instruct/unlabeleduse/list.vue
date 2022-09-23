<template>
  <div class="la-list">
    <List :loading="listLoading"
      :nodata="res1 && !res1.length">
      <div class="item_content1">
        <div class="zw"></div>
        <div class="card-hand">
          <div class="box">
            <div class="item"
              :class="{'on': isTableCard}"
              @click="onTableView">
              <i class="iconfont">&#xe654;</i>
              <span class="txt">表格视图</span>
            </div>
            <div class="item"
              :class="{'on': !isTableCard}"
              @click="onCard">
              <i class="iconfont">&#xe9ff;</i>
              <span class="txt">卡片式</span>
            </div>
          </div>
        </div>
        <div>
          <el-table ref="ElTable"
            v-if="isTableCard"
            :height="tableHeight"
            :data="res1"
            stripe
            @sort-change="sortChange"
            :default-sort = "order.base ? defaultSort(order.base) : {}"
            style="width: 100%">
            <el-table-column v-for="(item,index) in defaultFiled"
              :prop="item.prop"
              :sortable="item.sort"
              :min-width="item.field_width || item.width || 100"
              :key="index"
              :label="item.label">
              <template slot-scope="scope">

                <div :title="scope.row[item.prop]">
                  <div v-if="item.label=='药品名称'&& item.prop=='name'">
                    <a v-if="scope.row.id"
                      class="cl-blue"
                      :href="'/unlabeleduse/' + scope.row.id"
                      target="_blank">{{ scope.row.name }}</a>
                    <span v-else>{{ scope.row.name }}</span>
                  </div>
                  <div v-else-if="item.prop=='china'">
                    <a :class="scope.row.china == 0?'no_link-underline':'link-underline link-underline_hover'"
                      @click.prevent="pushRoute('instruct', 'database_instruct', 'ShuomingshuZg', scope.row.ylbm, scope.row.china)">{{ scope.row.china }}</a>
                  </div>
                  <div v-else-if="item.prop=='usa'">
                    <a :class="scope.row.usa == 0?'no_link-underline':'link-underline link-underline_hover'"
                      class="link-underline"
                      @click.prevent="pushRoute('fdalabel', 'database_fdalabel', 'ShuomingshuMg', scope.row.ylbm, scope.row.usa)">{{ scope.row.usa }}</a>
                  </div>
                  <div v-else-if="item.prop=='japan'">
                    <a :class="scope.row.japan == 0?'no_link-underline':'link-underline link-underline_hover'"
                      class="link-underline"
                      @click.prevent="pushRoute('jp_shuomingshu', 'database_jp_shuomingshu', 'ShuomingshuRb', scope.row.ylbm, scope.row.japan)">{{ scope.row.japan }}</a>
                  </div>
                  <!-- <div v-else-if="item.prop=='super'">
                    <a :class="scope.row.super == 0?'no_link-underline':'link-underline link-underline_hover'"
                      class="link-underline"
                      @click.prevent="pushRoute('unlabeleduse', 'database_unlabeleduse', 'ShuomingshuCsm', scope.row.ylbm, scope.row.super)">{{ scope.row.super }}</a>
                  </div> -->
                  <div v-else>{{scope.row[item.prop]}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div :style="{height:tableHeight+'px'}"
            class="page-cards"
            v-else>
            <router-link tag="a"
              :to="{path: '/unlabeleduse/' + item.id}"
              class="card"
              v-for="(item, index) in res1"
              :key="index"
              target="_blank">
              <div class="card-top">
                <div class="guding-tip bg-green">超说明</div>
                <div class="drug-name"
                  :title="'药品名称：' + item.name">{{item.name}}</div>
                <div class="drug-ct1"
                  :title="'适应症：' + item.shiyingzheng">
                  <div class="ct-content">{{item.shiyingzheng}}</div>
                  <div class="ct-title">（适应症）</div>
                </div>
                <div class="drug-ct2"
                  :title="'说明来源：' + item.laiyuan">
                  {{item.laiyuan}}
                </div>
              </div>
              <div class="card-middle">
                <span class="ttip">相关说明书</span>
                <el-tooltip class="item"
                  effect="light"
                  content="与该药品原料相同的其他药品说明书"
                  placement="right">
                  <i class="iconfont cl-green">&#xe628;</i>
                </el-tooltip>
              </div>
              <div class="card-bottom">
                <span class="bottom-item"
                  @click.prevent="pushRoute('instruct', 'database_instruct', 'ShuomingshuZg', item.ylbm, item.china)">
                  <div class="item-num">{{item.china}}</div>
                  <div class="item-name">中国药品</div>
                </span>
                <span class="bottom-item"
                  @click.prevent="pushRoute('fdalabel', 'database_fdalabel', 'ShuomingshuMg', item.ylbm, item.usa)">
                  <div class="item-num">{{item.usa}}</div>
                  <div class="item-name">美国药品</div>
                </span>
                <span class="bottom-item"
                  @click.prevent="pushRoute('jp_shuomingshu', 'database_jp_shuomingshu', 'ShuomingshuRb', item.ylbm, item.japan)">
                  <div class="item-num">{{item.japan}}</div>
                  <div class="item-name">日本药品</div>
                </span>
                <span class="bottom-item"
                  @click.prevent="clickToSearch(item.ylbm, item.super)">
                  <div class="item-num">{{item.super}}</div>
                  <div class="item-name">超说明药品</div>
                </span>
              </div>
            </router-link>
          </div>
          <div style="positon: relative;">
            <el-pagination v-if="extendCount"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page="param.page"
              :page-sizes="[20, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :page-size="param.pageSize"
              :total="extendCount"
              :disabled="nopms.fy"
              :class="{'abandon-click-method': nopms.fy}">
            </el-pagination>
            <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
          </div>
        </div>
      </div>
    </List>
  </div>
</template>

<script>
  import List from '@/components/layouts/list'
  import { mapState } from 'vuex'
  import defaultFiled from "./table"
  import commonMixins from '@/mixins/common.js'
  import setTableHMixins from '@/mixins/setTableH.js'
  export default {
    components: {
      List
    },
    mixins: [
      setTableHMixins,
      commonMixins
    ],
    data() {
      return {
        isTableCard: true,
        changeStyle: "",
        vuex_name: 'ShuomingshuCsm',
        defaultFiled,
        tableHeight: document.documentElement.clientHeight-48-60-60-45-88
      }
    },
    computed: {
      ...mapState({
        tableconf: state => state.ShuomingshuCsm.tableconf,
        nopms: state => state.ShuomingshuCsm.nopms,
        extendCount: state => state.ShuomingshuCsm.extendCount,
        putong: state => state.ShuomingshuCsm.putong,
        param: state => state.ShuomingshuCsm.param,
        order: state => state.ShuomingshuCsm.order,
        listLoading: state => state.ShuomingshuCsm.listLoading,
        res1: state => _.keys(state.ShuomingshuCsm.res1).length ? state.ShuomingshuCsm.res1 : [],
      }),
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
      tableconf(n) {
        //后台控制列表宽度
        this.defaultFiled = this.tableheaderCombain(n, this.defaultFiled)
      }
    },
    methods: {
      handleSizeChange (val) {
        this.param.page = 1
        this.param.pageSize = val
        if (val * this.param.page <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('ShuomingshuCsm/nomalSearch',{params:this.param})
        } else {
          $('.out-of-page').show()
        }
      },
      handleCurrentChange(val) {
        this.param.page = val
        if (val * this.param.pageSize <= 1500) {
          $('.out-of-page').hide()
          Store.dispatch('ShuomingshuCsm/nomalSearch', { params: this.param })
        } else {
          $('.out-of-page').show()
        }
      },
      // 链接到数据库
      pushRoute(href, route_name, vuex_name, option, num) {
        if (num) {
          this.$router.push({
            path: href,
            name: route_name,
          })
          Store.commit(vuex_name + "/fourth_checked", [{
            "logic": "_and",
            "name": "ylbm_eq",
            "value": option,
          }])
          if (Store.state[vuex_name].query) {
            Store.state[vuex_name].query = []
          }
          if (Store.state[vuex_name].putong) {
            Store.state[vuex_name].putong = {}
          }
          if (Store.state[vuex_name].conditions) {
            Store.state[vuex_name].conditions = []
          }
          if (Store.state[vuex_name].gaoji) {
            Store.state[vuex_name].gaoji = {}
          }
          if (Store.state[vuex_name].groups) {
            Store.state[vuex_name].groups = {}
          }
          if (Store.state[vuex_name].shaixuan) {
            Store.state[vuex_name].shaixuan = {}
          }
          Store.dispatch(vuex_name + "/nomalSearch")
        }
      },
      // 如果点击后不用跳转，只需要在本页搜索，则用此方法
      clickToSearch(option, num) {
        let _that = this
        if (num) {
          Store.commit("ShuomingshuCsm/fourth_checked", [{
            "logic": "_and",
            "name": "ylbm_eq",
            "value": option,
          }])
          if (Store.state.ShuomingshuCsm.query) {
            Store.state.ShuomingshuCsm.query = []
          }
          if (Store.state.ShuomingshuCsm.putong) {
            Store.state.ShuomingshuCsm.putong = {}
          }
          if (Store.state.ShuomingshuCsm.conditions) {
            Store.state.ShuomingshuCsm.conditions = []
          }
          if (Store.state.ShuomingshuCsm.gaoji) {
            Store.state.ShuomingshuCsm.gaoji = {}
          }
          if (Store.state.ShuomingshuCsm.groups) {
            Store.state.ShuomingshuCsm.groups = {}
          }
          if (Store.state.ShuomingshuCsm.shaixuan) {
            Store.state.ShuomingshuCsm.shaixuan = {}
          }
          /*_that.$emit("clearLeft")*/
          Store.commit("ShuomingshuCsm/queryStr", Store.state.ShuomingshuCsm.query)
          Store.dispatch("ShuomingshuCsm/nomalSearch")
        }
      },
      // 表格视图
      onTableView(event) {
        this.isTableCard = true;
      },
      // 卡片式
      onCard() {
        this.isTableCard = false;
      }
    },
    created() {

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
    },
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
// @import "~@/assets/less/app.less";
.bg-green {
  background-color: @Green;
}
.bg-orange {
  background-color: @Orange;
}

.la-list {
  padding-top: 0px;

  .card-hand {
    padding-right: 10px;
    padding-top: 0;

    i {
      font-size: 14px;
    }

    .txt {
      font-size: 13px;
    }
  }

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
}
.item_content1 {
  .label {
    text-align: center;
    line-height: 30px;
    margin-left: 30px;
  }
  .page-cards {
    box-sizing: border-box;
    overflow-y: auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .card {
      float: left;
      cursor: pointer;
      transition: all 300ms;
      width: 290px;
      height: 380px;
      box-shadow: @BoxShadow;
      background-color: #fff;
      overflow: hidden;
      margin: 0px 8px 28px;
      text-decoration: none;
      &:hover {
        transition: all 300ms;
        box-shadow: @BoxShadowHover;
        .card-top {
          .drug-name {
            color: @PrimaryColor;
          }
          .drug-ct1 {
            color: @PrimaryColor;
          }
          .drug-ct2 {
            color: @PrimaryColor;
          }
        }
        .card-bottom {
          .bottom-item {
            transition: all 300ms;
            background-color: @PrimaryColor;
            color: #fff;
            .item-num {
              transition: all 300ms;
              color: #fff;
            }
          }
        }
      }
      .card-top {
        box-sizing: border-box;
        padding: 14px 12px;
        width: 100%;
        height: 250px;
        position: relative;
        .guding-tip {
          float: left;
          // position: absolute;
          margin-top: 3px;
          margin-right: 4px;
          width: 80px;
          height: 20px;
          line-height: 20px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          border-radius: 10px;
          // top: 17px;
          // left: 12px;
        }
        .drug-name {
          text-align: center;
          width: 100%;
          font-size: 23px;
          height: 36px;
          line-height: 36px;
          margin: 40px 0px 26px 0px;
          overflow: hidden;
          padding: 0px 20px;
          box-sizing: border-box;
        }
        .drug-ct1 {
          text-align: center;
          font-size: 14px;
          padding: 0px 20px;
          margin-bottom: 20px;
          box-sizing: border-box;
          .ct-title {
            font-size: 13px;
            margin-top: 5px;
          }
          .ct-content {
            height: 19px;
            line-height: 19px;
            overflow: hidden;
          }
        }
        .drug-ct2 {
          text-align: center;
          font-size: 14px;
          max-height: 38px;
          line-height: 19px;
          overflow: hidden;
          margin-top: 25px;
          padding: 0px 20px;
          box-sizing: border-box;
        }
      }
      .card-middle {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: @GrayBackgroundColor;
        .ttip {
          display: inline-block;
          font-size: 13px;
          padding: 0px 2px 0px 15px;
        }
      }
      .card-bottom {
        width: 100%;
        height: 90px;
        .bottom-item {
          transition: all 300ms;
          float: left;
          width: 25%;
          height: 100%;
          background-color: @BorderColor;
          position: relative;
          overflow: hidden;
          text-align: center;
          &::after {
            content: "";
            transition: all 300ms;
            position: absolute;
            bottom: -3px;
            left: 0px;
            width: 100%;
            height: 3px;
            background-color: #fff;
            border-radius: 2px;
          }
          &:hover {
            background-color: Lighten(@PrimaryColor, 10%);
            &::after {
              transition: all 300ms;
              bottom: 0px;
            }
          }
          .item-num {
            transition: all 300ms;
            color: #7f8697;
            font-size: 23px;
            padding: 16px 0px 5px 0px;
          }
          .item-name {
            font-size: 12px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1594px) {
  .page-cards {
    justify-content: center !important;
  }
}

@media screen and (max-width: 1300px) {
  .page-cards {
    .card {
      margin: 0px 6px 28px !important;
    }
  }
}
</style>

