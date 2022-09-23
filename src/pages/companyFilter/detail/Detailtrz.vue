<template>
  <div class="companyfilter-trz">
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="isloading"
      v-if="isloading"
    ></LoadingGif>
    <template v-else>
      <div class="content-title">投融资</div>

      <div class="gsxx-title" v-if="rzlcList.length">融资历程</div>
      <div class="rzlc" v-if="rzlcList.length">
        <div class="rzlc-warp" ref="rzlcwarp" id="rzlcwarp">
          <div class="rzlc-scroll">
            <div
              class="rzlc-item"
              v-for="(item, i) in rzlcList"
              :key="item.id"
              :class="i === rzlcCur ? 'active' : ''"
            >
              <div class="inner">
                <div class="hd">
                  <span v-if="item.time">{{ item.time }}</span>
                  <em v-if="item.round">{{ item.round }}</em>
                  <a
                    v-if="item.data_id"
                    :href="'/trz/rongzi/' + item.data_id"
                    target="_blank"
                    >查看详情</a
                  >
                </div>
                <div class="bd">
                  <div class="info">
                    <label
                      ><span>融</span><span>资</span><span>金</span
                      ><span>额：</span></label
                    >
                    <div v-if="item.guifan_amount">
                      <span class="money">{{ item.guifan_amount }}</span>
                    </div>
                  </div>
                  <div class="info">
                    <label
                      ><span>投</span><span>资</span><span>人：</span></label
                    >
                    <div>{{ item.investors }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rzlc-btn-area">
          <div
            class="rzlc-btn btn-prev"
            :class="rzlcCur == 0 ? 'disabled' : ''"
            @click="rzlcScroll(0)"
          ></div>
          <div
            class="rzlc-btn btn-next"
            :class="rzlcCur == rzlcList.length - 1 ? 'disabled' : ''"
            @click="rzlcScroll(1)"
          ></div>
        </div>
      </div>
    </template>

    <div class="gsxx-title" v-show="!loadingTable">医药交易</div>
    <div style="padding: 0 10px">
      <LoadingGif
        class="table-loading"
        :className="'list-in-loading'"
        :classNameImg="'little-size-loading'"
        :loadFlag="loadingTable"
        v-if="loadingTable"
      ></LoadingGif>

      <el-table
        v-else
        fixed
        border
        :data="tableData"
        :header-cell-style="{
          background: '#F5F6FA',
          color: '#333333',
          fontSize: '14px',
          fontWeight: 'bold',
        }"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :min-width="item.width"
          :key="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'edit'">
              <router-link
                style="color: #4b79ec"
                target="_blank"
                :to="`/trz/kuajing/${scope.row.data_id}`"
                >查看详情</router-link
              >
            </div>
            <!-- 标题 -->
            <div
              v-else-if="item.prop === 'guifan_item'"
              :title="
                scope.row.guifan_item ? scope.row.guifan_item : scope.row.item
              "
            >
              {{
                scope.row.guifan_item ? scope.row.guifan_item : scope.row.item
              }}
            </div>

            <!-- 卖方 -->
            <div
              v-else-if="item.prop === 'transferor'"
              :title="
                scope.row.transferor
                  ? scope.row.transferor
                  : scope.row.guifan_transferor
              "
            >
              {{
                scope.row.transferor
                  ? scope.row.transferor
                  : scope.row.guifan_transferor
              }}
            </div>

            <!-- 买方 -->
            <div
              v-else-if="item.prop === 'buyer'"
              :title="
                scope.row.buyer
                  ? scope.row.buyer
                  : scope.row.guifan_buyer
              "
            >
              {{
                scope.row.buyer
                  ? scope.row.buyer
                  : scope.row.guifan_buyer
              }}
            </div>
            <div v-else :title="scope.row[item.prop]">
              <span>{{ scope.row[item.prop] }}</span>
            </div>
          </template>
        </el-table-column></el-table
      >
      <el-pagination
        v-if="tableTotal > 10"
        @current-change="handleCurrentChange"
        :current-page="tableParams.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="tableTotal"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
export default {
  components: {
    LoadingGif,
  },
  data() {
    return {
      isloading: true,
      rzlcCur: 0, // 融资历程当前下标
      rzlcList: [], // 融资历程列表
      tableParams: {
        pageSize: 10,
        page: 1,
      },
      tableTotal: 0,
      tableData: [],
      tableHead: [
        {
          prop: "guifan_cooperationtype",
          label: "类型",
          width: 120, //最少宽度
        },
        {
          prop: "guifan_item",
          label: "标题",
          width: 300, //最少宽度
        },
        {
          prop: "transferor",
          label: "卖方",
          width: 200, //最少宽度
        },
        {
          prop: "buyer",
          label: "买方",
          width: 200, //最少宽度
        },
        {
          prop: "guifan_totalamount",
          label: "交易金额",
          width: 120, //最少宽度
        },
        {
          prop: "time",
          label: "交易时间",
          width: 100, //最少宽度
        },
        {
          prop: "edit",
          label: "操作",
          width: 100, //最少宽度
        },
      ],
      loadingTable: true,
    };
  },
  watch: {},
  methods: {
    // 获取融资历程数据
    getRzlist() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/investment",
          params: {
            id: this.$route.params.id,
            position: 1,
          },
        })
        .then((res) => {
          this.isloading = false;
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.rzlcList = _.orderBy(data.fun_history.res, ["time"], ["asc"]);
            setTimeout(() => {
              // 融资历程初始化
              if (this.rzlcList.length) {
                this.rzlcCur = this.rzlcList.length - 1;
                this.rzlcScrollPosition();
                this.$refs.rzlcwarp.style.visibility = "visible";
              }
            }, 0);
          }
        });
    },
    // 融资历程左右按钮事件
    rzlcScroll(flag) {
      if (
        (flag && this.rzlcCur == this.rzlcList.length - 1) ||
        (!flag && this.rzlcCur == 0)
      ) {
        return;
      }
      if (flag) {
        this.rzlcCur++;
      } else {
        this.rzlcCur--;
      }
      this.rzlcScrollPosition();
    },
    // 融资历程定位
    rzlcScrollPosition() {
      this.$refs.rzlcwarp.scrollLeft = 170 * this.rzlcCur - 340;
    },

    // 获取表格数据
    getTableData() {
      this.loadingTable = true;
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/investment",
          params: {
            id: this.$route.params.id,
            position: 2,
            ...this.tableParams,
          },
        })
        .then((res) => {
          this.loadingTable = false;
          if (res.data.code === 200 && res.data) {
            this.tableTotal = res.data.data.items.count;
            this.tableData = res.data.data.items.res;
          } else {
            this.tableData = [];
            this.tableTotal = 0;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 表格翻页
    handleCurrentChange(e) {
      this.tableParams.page = e;
      this.getTableData();
    },
  },
  mounted() {
    // 获取融资历程数据
    this.getRzlist();

    // 获取医药交易数据
    this.getTableData();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.companyfilter-trz {
  .gsxx-title {
    margin-top: 10px;
  }
  .rzlc {
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 10px;
    box-sizing: border-box;
    &:after {
      content: "";
      position: absolute;
      left: 10px;
      top: 184px;
      width: calc(100% - 20px);
      height: 1px;
      z-index: 1;
      background: #dae0e9;
    }
  }
  .rzlc-warp {
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 2;
    visibility: hidden;
  }
  .rzlc-scroll {
    white-space: nowrap;
    padding: 170px 85px; // 170px100px
    position: relative;
    z-index: 1;
  }
  .rzlc-item {
    position: relative;
    margin: 0 84px;
    height: 1px;
    background-color: #dae0e9;
    display: inline-block;
    transition: all 0.05s ease-in;
    * {
      transition: all 0.05s ease-in;
    }
    z-index: 2;
    .inner {
      width: 320px;
      height: 122px;
      overflow: hidden;
      position: absolute;
      left: -165px;
      border: 1px solid #dae0e9;
      background-color: #fff;
      font-size: 13px;
      z-index: 5;
      border-radius: 4px;
      .hd {
        height: 20px;
        line-height: 20px;
        background-color: #f5f8fc;
        color: #333;
        padding: 7px 18px;
        a {
          color: #4877E8;
          float: right;
        }
        em {
          display: inline-block;
          font-style: normal;
          height: 20px;
          line-height: 20px;
          border-radius: 4px;
          border: 1px solid #4877E8;
          padding: 0 15px;
          font-size: 13px;
          color: #4877E8;
          text-align: center;
          margin-left: 8px;
        }
      }
      .bd {
        padding: 7px 18px;
        .info {
          line-height: 1.75;
          width: 100%;
          display: flex;
          label {
            width: 68px;
            color: #666;
            display: flex;
            justify-content: space-between;
            flex-shrink: 0;
          }
          .money {
            color: #e7af2f;
            font-size: 18px;
            vertical-align: middle;
            display: inline-block;
            margin-top: -5px;
          }
          > div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    &:before {
      content: "";
      position: absolute;
      left: 5px;
      width: 1px;
      z-index: 1;
      background: #dae0e9;
      height: 50px;
    }
    &:after {
      content: "";
      position: absolute;
      top: -5px;
      left: 0;
      width: 10px;
      height: 10px;
      background-color: #fff;
      border: 1px solid #4877E8;
      border-radius: 50%;
      z-index: 2;
    }
    &:nth-child(even) {
      &:before {
        top: -50px;
      }
      .inner {
        top: -170px;
      }
    }
    &:nth-child(odd) {
      &:before {
        top: 0;
      }
      .inner {
        top: 50px;
      }
    }
    &.active {
      .inner {
        border-color: #4877E8;
        .hd {
          background-color: #4877E8;
          color: #fff;
          a {
            color: #fff;
          }
          em {
            color: #fff;
            border-color: #fff;
          }
        }
      }
      &:before {
        background: #4877E8;
      }
      &:after {
        width: 15px;
        height: 15px;
        background: url("~@/assets/imgs/trz/dot.png") no-repeat;
        top: -7px;
        left: -3px;
      }
    }
  }
  .rzlc-btn-area {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .rzlc-btn {
      // position: absolute;
      // bottom: 0;
      &:first-child {
        margin-right: 20px;
      }
      width: 28px;
      height: 28px;
      z-index: 10;
      background-image: url("~@/assets/imgs/trz/rzlc-btn.png");
      background-repeat: no-repeat;
      cursor: pointer;
      &.disabled {
        cursor: default;
      }
      &.btn-prev {
        // right: 42px;
        background-position: 0 0;
        &.disabled {
          background-position: 0 -76px !important;
        }
        &:hover {
          background-position: 0 -152px;
        }
      }
      &.btn-next {
        // right: 0;
        background-position: 0 -38px;
        &.disabled {
          background-position: 0 -114px !important;
        }
        &:hover {
          background-position: 0 -190px;
        }
      }
    }
  }

  .el-table thead th > .cell {
    height: 36px;
    line-height: 36px;
    color: #333;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
  .table-loading {
    height: 440px;
  }
}
</style>
