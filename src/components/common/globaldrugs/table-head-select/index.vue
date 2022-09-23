<template>
  <div class="table-head-select" @click.stop="">
    <el-popover ref="poper" @after-leave="hidePop" @after-enter="showPop" placement="bottom-start" width="200"
      :offset="offset" :visible-arrow="false" trigger="click">
      <div class="filter-main">
        <!-- <input class="filter-input" :placeholder="placeholder" v-model="selectValue" /> -->
        <div class="filter-content">
          <!-- <el-tree ref="tree" show-checkbox node-key="label" check-on-click-node :filter-node-method="filterNode"
            :data="options" :props="props">
          </el-tree> -->

          <el-select ref="select" :placeholder="placeholder" v-model="selectValue" @change="selectChange" filterable>
            <el-option v-for="item of options" :key="item.key" :label="item.val" :value="item.key" />
          </el-select>
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
  name: "table-head-select",
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
      default: () => ({}),
      type: Object,
    },
    prop: "",
    saved_condition: "",
  },
  data() {
    return {
      selectValue: "",
      checkedNodes: [],
    };
  },
  computed: {
    active() {
      return this.selectValue;
    },
  },
  methods: {
    selectChange(val) {
      console.log(val);
      this.selectValue = val;
    },
    // 转换药物明细筛选字符串为对象
    decode_conditions(str) {
      let cache = str || '';
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
      this.$emit("confirm", this.selectValue);
      this.checkedNodes = this.selectValue;
      this.$refs.poper.showPopper = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    showPop() {
      console.log(this.$refs.poper.popperElm, "poper");
    },
    hidePop() {
      console.log(this.selectValue);
      //   console.log(this.$refs.poper.popperElm, "poper");
    },
    close() {
      this.$emit("cancel");
      this.checkedNodes = [];
      this.selectValue = ""
      this.$refs.poper.showPopper = false;
    },
  },
  created() {
    if (this.prop) {
      console.log(this.prop)
      // let obj = this.decode_conditions(this.saved_condition);
      // // console.log(obj, "updated");
      // this.checkedNodes = obj[this.prop].map(t => ({label: t}));
      // this.$nextTick(() => {
      //   this.$refs.tree.setCheckedNodes(this.checkedNodes)
      // })
    }
  },
};
</script>

<style lang="less" scoped>
.table-head-select {
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