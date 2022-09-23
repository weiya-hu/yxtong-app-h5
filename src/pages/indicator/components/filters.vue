<template>
  <div class="indicator-filters">
    <el-input
      placeholder="输入关键字查询指标"
      v-model="filterText"
      @input="filterChange()"
      @change="filterChange()"
    ></el-input>
    <div class="trees">
      <el-tree
        node-key="name"
        :indent="5"
        class="filter-tree"
        :data="groupList.indicators"
        :props="{ children: 'children', label: 'name' }"
        show-checkbox
        check-on-click-node
        :default-checked-keys="checked"
        :default-expanded-keys="checked"
        :filter-node-method="filterNode"
        @check="(data, checkTree) => checkGA(data, checkTree)"
        @check-change="(data, isChecked) => checkChange(data, isChecked)"
        :check-strictly="true"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
        ref="indicatorTree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="num" v-if="data.count">({{ data.count }})</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupList: {
      // 树节点数据
      type: Object
    },
    changeIndicatorList: {
      // 移除后的节点数据
      type: Array,
      default() {
        return [
          "全国医药工业主营业务收入(亿元)"
        ];
      }
    }
  },
  data() {
    return {
      filterText: "",
      checked: [
        "全国医药工业主营业务收入(亿元)"
      ]
    };
  },
  watch: {
    changeIndicatorList: {
      handler(newValue, oldValue) {
        this.changeIndicator();
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 清空指标
    clearChecked() {
      this.$refs.indicatorTree.setCheckedKeys([]);
      this.checked = [];
      this.$emit("filterChecked", this.checked);
    },
    // 设置选中值
    changeIndicator() {
      this.$nextTick(() => {
        this.$refs["indicatorTree"].setCheckedKeys(this.changeIndicatorList);
      });
      // console.log(this.changeIndicatorList);
      // this.checked = this.changeIndicatorList
      // this.$emit("filterChecked", this.changeIndicatorList);
    },
    checkChange(data, isChecked) {
      this.checked = this.$refs.indicatorTree.getCheckedKeys();
      // console.log(
      //   "进入@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@..................."
      // );
      // // this.checked = [...this.changeIndicatorList]
      // console.log(this.checked);
      // if(isChecked) {
      //   this.checked.push(data.name)
      // } else {
      //   this.checked.splice(
      //     this.checked.indexOf(data.name),
      //     1
      //   );
      // }
      var temp = "";
      let that = this;
      function fn(num) {
        temp = num;
        setTimeout(() => {
          //ajax
          if (temp == num) {
            that.$emit("filterChecked", that.checked);
          }
        }, 1);
      }
      fn(this.checked.length);
      // console.log(this.checked, data, isChecked);
    },
    // // 复选框被点击触发的事件
    checkGA(data, checkTree) {
      //   /**
      //    * 获取树结构已选节点：如果是父节点下子节点全选则只获取父节点。如果父节点下的子节点未全选则只获取对应勾选的子节点。采用递归获取所需要的节点
      //    * @param {*} store === this.$refs.tree.store
      //    * @returns
      //    */
      //   let store = this.$refs["indicatorTree"].store
      //   const checkedNodes = [];
      //   const traverse = function (node) {
      //     const childNodes = node.root ? node.root.childNodes : node.childNodes;
      //     console.log(childNodes);
      //     childNodes.forEach((child) => {
      //       // child.checked表示子孙节点被选中了，checked状态的节点不需要继续递归。
      //       if (child.checked) {
      //         checkedNodes.push(child.data);
      //       }
      //       // child.indeterminate 表示该节点的子孙节点部分被选中。如果是indeterminate的节点，需要继续递归这个过程
      //       if (child.indeterminate) {
      //         traverse(child);
      //       }
      //     });
      //   };
      //   traverse(store);
      //   this.checked = []
      //   console.log(store);
      //   checkedNodes.forEach((item)=> {
      //     if (!item.disabled) {
      //       this.checked.push(item.name)
      //     }
      //   })
      //   this.$emit('filterChecked', this.checked)
      //   console.log(checkedNodes, this.checked);
    },

    filterChange() {
      console.log(this.$refs["indicatorTree"]);
      this.$refs["indicatorTree"].filter(this.filterText);
    },

    filterNode(value, data) {
      console.log(data, value);
      if (!value) return true;
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },

    nodeExpand(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function(value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },

    nodeCollapse(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function(value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },

    _easeout(start, end, rate, callback) {
      var _end = end;
      if (start == end || typeof start != "number") {
        return;
      }
      end = end || 0;
      rate = rate || 2;

      var step = function() {
        start = start + (end - start) / rate;
        if (Math.abs(start - _end) < 1) {
          callback(end, true);
          return;
        }
        callback(start, false);
        requestAnimationFrame(step);
      };
      step();
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-input__inner {
  height: 30px;
}

// /deep/ .el-tree-node__content {
//   height: 40px;
// }
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: initial;
}

/deep/ .el-tree {
  // 不可全选样式
  .el-tree-node {
    .is-leaf + .el-checkbox .el-checkbox__inner {
      display: inline-block;
    }
    .el-checkbox .el-checkbox__inner {
      display: none;
    }
  }
}
.indicator-filters {
  padding: 5px 14px 5px 10px;

  .trees {
    margin-top: 20px;
    overflow: auto;
    max-height: calc(100vh - 180px);

    .custom-tree-node {
      span:first-child {
        color: #545b6d;
        font-size: 13px;
      }

      .num {
        font-size: 13px;
        color: #97a2bf;
      }
    }

    /deep/ .el-checkbox__inner {
      width: 13px;
      height: 13px;
    }
  }
}
/deep/.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 6px 0px 6px 0 !important;
}
/deep/.custom-tree-node {
  margin-left: 6px;
}
</style>
