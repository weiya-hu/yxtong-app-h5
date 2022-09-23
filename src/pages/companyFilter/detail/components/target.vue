<template>
  <div class="cpbj-target">
    <div class="gsxx-title">新药靶点布局</div>
    <el-table
      :data="targetData.res"
      border
      :stripe="false"
      fixed
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :prop="item.prop"
        :key="index"
        :sortable="item.sort"
        :min-width="item.width"
        :label="item.label"
        align="center"
      >
        <template slot-scope="scope">
          <div :title="scope.row[item.prop]">
            <template v-if="item.prop !== 'targets_abbr'">
              <div
                v-if="scope.row[item.prop] > 0"
                class="scope-bg hover-bg"
                :style="{
                  background: getIndicationBg(scope.row[item.prop]),
                  color: getIndicationColor(scope.row[item.prop]),
                }"
                @click="goToListThree(scope.row, item.prop)"
              >
                <span>{{ scope.row[item.prop] }}</span>
              </div>
              <div class="scope-bg" v-else>-</div>
            </template>

            <div v-else class="scope-bg" style="padding-left: 14px">
              {{ scope.row[item.prop] }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="20"
      layout="total, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    countries: {
      type: String,
    },
    qiyemingcheng: {
      type: String,
    },
  },
  data() {
    return {
      targetData: {},
      tableHead: [
        {
          prop: "targets_abbr",
          label: "靶点名称",
          width: 100, //最少宽度
        },
        {
          prop: "phase1",
          label: "临床前",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
        {
          prop: "phase2",
          label: "临床申请",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
        {
          prop: "phase3",
          label: "临床Ⅰ期",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
        {
          prop: "phase4",
          label: "临床Ⅱ期",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
        {
          prop: "phase5",
          label: "临床Ⅲ期",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
        {
          prop: "phase6",
          label: "注册申请",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
        {
          prop: "phase7",
          label: "批准上市",
          sort: "custom", //是否排序
          width: 100, //最少宽度
        },
      ],
      colorData: [
        { color: "#333333 ", bg: "#F5F7FB" },
        { color: "#333333 ", bg: "#F4F7FF" },
        { color: "#333333 ", bg: "#E3ECFE" },
        { color: "#333333 ", bg: "#CEDBFC" },
        { color: "#333333 ", bg: "#C8D5F6" },
        { color: "#333333 ", bg: "#B9CCFF" },
        { color: "#333333 ", bg: "#A1B8F9" },
        { color: "#fff ", bg: "#8DA9F8" },
        { color: "#fff ", bg: "#6B8FF4" },
        { color: "#fff ", bg: "#4877E8" },
      ], // 靶点布局第一个列表的背景颜色数组
      phaseObj: {
        phase1: "10",
        phase2: "20",
        phase3: "30",
        phase4: "40",
        phase5: "50",
        phase6: "60",
        phase7: "70",
      },
      order: "", // 排序
      page: 1,
      total: 0
    };
  },
  computed: {},
  watch: {},
  methods: {
    getData() {
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/drugnamePhase",
          params: {
            id: this.$route.params.id,
            countries: this.countries,
            order: this.order,
            page: this.page,
            pageSize: 20,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.targetData = res.data.data.drugnamePhase;
            this.total = Number(res.data.data.drugnamePhase.count)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
     handleCurrentChange(e) {
      this.page = e;
      this.getData();
    },
    async goToListThree(row, phase) {
      let { href } = this.$router.resolve({
        path: "/globaldrugs/list",
        query: {
          company: this.qiyemingcheng,
          targets: row.targets_abbr,
          tabName: "targetGroup",
        },
      });
      window.open(href, "_blank");
    },
    // 获取靶点布局第一个列表的数字背景色
    getIndicationBg(num) {
      // 规则 指定十个颜色，根据最大数据值分区间进行赋色，比如最大数值为10，则一个数字对应一个颜色，比如最大数字是100，则1-10对应第一个颜色、11-20对应第二个颜色...以此类推
      // this.colorData[Math.ceil(num/Math.ceil(targetData.max/10))-1].bg
      if (num == 0) {
        return "";
      } else {
        return this.colorData[
          Math.ceil(num / Math.ceil(this.targetData.max / 10)) - 1
        ].bg;
      }
    },

    // 获取靶点布局第一个列表的数字颜色
    getIndicationColor(num) {
      // this.colorData[Math.ceil(num/Math.ceil(targetData.max/10))-1].color
      if (num == 0) {
        return "";
      } else {
        return this.colorData[
          Math.ceil(num / Math.ceil(this.targetData.max / 10)) - 1
        ].color;
      }
    },
    // 排序
    sortChange(column, prop, order) {
      let sort;
      // column.prop为null时，默认排序
      if (column.prop) {
        if (column.order == "ascending") {
          sort = column.prop + " " + "asc";
        } else if (column.order == "descending") {
          sort = column.prop + " " + "desc";
        } else {
          sort = "";
        }
      }

      this.order = sort;
      this.getData();
    },
  },
  created() {},
  mounted() {
    this.getData();
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.cpbj-target {
  .el-table .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5;
  }
  .el-table thead th > .cell {
    height: 40px;
    line-height: 40px;
    color: #333;
  }

  .el-table th {
    background-color: #ebeef5;
  }

  .el-table thead th > .cell {
    justify-content: center;
  }
  .el-table tbody td > .cell {
    padding: 0;
  }
  .el-table td .cell > div > .scope-bg {
    padding: 8px 0 8px 0px;
    max-height: 45px;
    white-space: nowrap; /*超出的空白区域不换行*/
    overflow: hidden; /*超出隐藏*/
    text-overflow: ellipsis; /*文本超出显示省略号*/
  }
  .el-table tbody tr td:last-child {
    padding: 0;
  }

  .el-table .descending .sort-caret.descending {
    border-top-color: #ffa914;
  }

  .el-table .sort-caret.ascending {
    top: 3px;
  }

  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #ffa914;
  }

  .hover-bg {
    cursor: pointer;
    &:hover {
      color: #4877E8 !important;
      background: #eff2fa !important;
    }
  }

  .gsxx-title {
    font-size: 14px;
    padding-left: 10px;
    color: #333333;
    position: relative;
    margin-bottom: 10px;
    font-weight: 600;

    &::before {
      content: "";
      width: 2px;
      height: 14px;
      background: #4877E8;
      border-radius: 1px;
      position: absolute;
      left: 0px;
      top: 4px;
    }
  }
}
</style>
