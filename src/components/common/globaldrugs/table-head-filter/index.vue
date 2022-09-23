<template>
  <div class="table-head-filter" @click.stop="">
    <el-popover
      ref="poper"
      @after-leave="hidePop"
      @after-enter="showPop"
      placement="bottom-start"
      width="240"
      :offset="offset"
      :visible-arrow="false"
      trigger="click"
    >
      <div class="filter-main">
        <input
          class="filter-input"
          :placeholder="placeholder"
          v-model="filterText"
        />
        <div class="filter-content">
          <el-tree
            v-if="showTree"
            ref="tree"
            show-checkbox
            :node-key="props.key || props.label"
            check-on-click-node
            :filter-node-method="filterNode"
            :data="options"
            :props="props"
          >
          </el-tree>
        </div>
        <div class="filter-sub-btns">
          <a class="sub-btn confirm" @click="confirm">确定</a>
          <a class="sub-btn cancel" @click="close()">取消</a>
        </div>
      </div>
      <template slot="reference">
        <span>
          <template>
            <slot v-if="$slots.name" name="name"></slot>
            <template v-else>
              {{ name }}
            </template>
          </template>

          <i v-if="active" class="el-icon-arrow-down active"></i>
          <i v-else class="el-icon-arrow-down"></i>
        </span>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "table-head-filter",
  props: {
    // 搜索输入框的placeholder

    placeholder: {
      default: "输入关键字进行过滤",
      type: String,
    },
    // 表头标题
    name: {
      default: "表头标题",
      type: String,
    },
    // 控制popover左右偏移量 详情页里面是-24 其他地方单独设置
    offset: {
      default: 0,
      type: Number,
    },
    // 筛选项 数组
    options: {
      default: () => [],
      type: Array,
    },
    // props 同 tree组件的 props
    props: {
      default: () => ({
        label: "label",
        key: "",
      }),
      type: Object,
    },
    prop: "",
    saved_condition: "",
  },
  data() {
    return {
      filterText: "",
      checkedNodes: [],
      showTree: false,
    };
  },
  computed: {
    active() {
      return this.checkedNodes.length > 0;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    // 转换药物明细筛选字符串为对象
    decode_conditions(str) {
      let cache = str || "";
      let condition_array = cache.split(" _and ");
      let condition_obj = {};
      condition_array.forEach((item) => {
        if (item) {
          let [key, value] = item.split("=");
          let val = value ? value.split("ღ") : [];
          if (key && key.replace(/\s/g, "")) {
            condition_obj[key] = val;
          }
        }
      });
      return condition_obj;
    },
    confirm() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      this.$emit("confirm", checkedNodes);
      this.checkedNodes = checkedNodes;
      this.$refs.poper.showPopper = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    showPop() {
      let id = this.$refs.poper.popperElm.id;
      this.$root.$emit("filter-show", id);

      // document.querySelectorAll(".el-popover").forEach((item) => {
      //   if (item.style.display == "" && item.id !== id) {
      //     item.style.display = "none";
      //   }
      // });

      this.setChecked(true);
    },
    hidePop() {
      this.$refs.tree.setCheckedNodes(this.checkedNodes);
      this.filterText = "";
      this.showTree = false;
      //   console.log(this.$refs.poper.popperElm, "poper");
    },
    close() {
      this.$emit("cancel");
      this.checkedNodes = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.poper.showPopper = false;
    },
    setChecked(showTree) {
      if (showTree) {
        this.showTree = true;
      }
      if (this.prop) {
        // this.showTree = true;
        let obj = this.decode_conditions(this.saved_condition);
        if (obj[this.prop]) {
          this.checkedNodes = obj[this.prop].map((t) => ({ label: t }));
          if (this.props.key) {
            this.$nextTick(() => {
              if (this.$refs.tree) {
                this.$refs.tree.setCheckedKeys(obj[this.prop]);
              }
            });
          } else {
            this.$nextTick(() => {
              this.$refs.tree.setCheckedNodes(this.checkedNodes);
            });
          }
        }
      }
    },
  },
  mounted() {
    this.setChecked();
    this.$root.$on("filter-show", (id) => {
      if (
        this.$refs.poper &&
        this.$refs.poper.popperElm &&
        this.$refs.poper.popperElm.id != id
      ) {
        this.$refs.poper.showPopper = false;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.table-head-filter {
  cursor: pointer;
  padding-right: 0;
  padding-left: 0;
}
.filter-input {
  box-shadow: 0px 1px 5px 0px rgba(9, 20, 79, 0.1);
  width: 100%;
  height: 28px;
  outline: none;
  border: none;
  font-size: 12px;
  padding: 0 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  border-radius: 3px;
}
.filter-content {
  max-height: 160px;
  min-height: 60px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 10px;
}
.el-icon-arrow-down {
  width: 13px;
  height: 13px;
  border: 1px solid #dbdfe7;
  display: inline-flex;
  border-radius: 2px;
  font-size: 12px;
  box-sizing: border-box;
  justify-content: center;
  &.active {
    color: #ffa914;
  }
  &::before {
    transform: scale(0.8);
    display: inline-block;
  }
}
.sub-btn {
  width: 40px;
  height: 20px;
  display: inline-block;
  margin-right: 5px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  border-radius: 3px;
  text-decoration: none;
  &.confirm {
    background: #ffa914;
    color: #fff;
  }
  &.cancel {
    background: #c0c4cc;
    color: #fff;
  }
}
/deep/.el-tree {
  overflow-y: auto;
  .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__label {
    font-size: 12px;
    color: #333;
  }
  .el-tree-node.is-checked .el-tree-node__label {
    color: #002ea6;
  }
  .el-checkbox__inner {
    background-color: transparent;
    border-color: #dcdfe6;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    border: 1px solid #ffa500;
    border-left: 0;
    border-top: 0;
  }
}
</style>
