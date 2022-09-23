<template>
  <div class="qqxs-detail">
    <el-table
      :data="qqxsList"
      :span-method="objectSpanMethod"
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="year"
        align="center"
        label="年度"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="company"
        align="center"
        label="企业名称"
      ></el-table-column>
      <el-table-column
        prop="value"
        align="center"
        width="490"
        label="销售额（万元/RMB）"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      qqxsList: []
    };
  },
  mounted() {
    this.qqxsList = this.data;
  },
  methods: {
    flitterData(arr) {
      let spanOneArr = [];
      let concatOne = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          //name 修改
          if (item.year === arr[index - 1].year) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr
      };
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // this.qqxsList  修改
        const _row = this.flitterData(this.qqxsList).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    }
  }
};
</script>

<style lang="less" scoped>
.qqxs-detail {
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  padding: 10px;
  /deep/.el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5 !important;
  }
  /deep/.el-table thead th > .cell {
    justify-content: center;
  }
}
</style>
