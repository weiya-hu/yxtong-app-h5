<template>
  <div>
    <el-cascader
      class="la-advenced-cascader"
      :class="{ 'atc-cascader': item.name == 'atc' || item.name == 'atcb' }"
      v-model="vals"
      :placeholder="placeholder"
      :options="options"
      :props="cascaderConfig"
      @change="updateValue"
      separator=">"
      filterable
      change-on-select
      clearable
      ref="popoverCascader"
    ></el-cascader>
    <el-checkbox
      @change="() => $emit('changeClassify', index, atcs_sel)"
      v-model="atcs_sel"
      class="atc-check"
      v-if="item.name == 'atc' || item.name == 'atcb'"
      >多分类</el-checkbox
    >
  </div>
</template>
<script>
export default {
  props: {
    vuex_name: {
      type: String,
      default() {
        return "";
      },
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    option: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    index: {
      type: Number,
    },
    placeholder: {
      type: String,
      default() {
        return "试试搜索：消化道及代谢";
      },
    },
    noTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      atcs_sel: false,
      vals: this.value,
      cascaderConfig: {
        label: "label",
        value: "value",
        children: "children",
      },
      options: [],
    };
  },
  computed: {
    storeState() {
      return Store.state[this.vuex_name];
    },
  },
  watch: {
    value(val) {
      this.vals = val;
    },
    storeState: {
      handler(val) {
        val.query.forEach((e) => {
          if (e.name === this.item.name) {
            this.vals = e.show;
            this.atcs_sel = e.atcs_sel == "1" || e.atcs_sel;
          }
        });
        val.conditions.forEach((e) => {
          if (e.name === this.item.name) {
            this.atcs_sel = e.atcs_sel == "1" || e.atcs_sel;
          }
        });
      },
      deep: true,
    },
  },
  created() {
    let options = this.option;

    if (this.vuex_name) {
      // 普通有值
      this.storeState.query.forEach((e) => {
        if (e.name === this.item.name) {
          this.vals = e.show;
          this.atcs_sel = e.atcs_sel == "1" || e.atcs_sel;
        }
      });
      this.storeState.conditions.forEach((e) => {
        if (e.name === this.item.name) {
          this.atcs_sel = e.atcs_sel == "1" || e.atcs_sel;
        }
      });
    }

    for (let key in options) {
      this.options.push(options[key]);
    }
  },
  mounted() {
    this.cascaderPopMouseleave(this);
  },
  methods: {
    updateValue(value) {
      let last_index = value.length - 1;
      let last_value = value[last_index];
      this.$emit("updateValue", this.index, last_value, value);
    },
  },
};
</script>
<style lang="less" scoped>
.la-advenced-cascader {
  line-height: 30px;
  &.el-cascader {
    width: 100%;
    line-height: 30px;
  }
  &.atc-cascader {
    width: 240px;
  }
  & /deep/ .el-icon-circle-close {
    line-height: 30px;
  }
}
.cascader-relative {
  position: relative;
}
.icon-absolute {
  position: absolute;
  top: 50%;
  left: 80px;
  transform: translateY(-50%);
}
</style>
