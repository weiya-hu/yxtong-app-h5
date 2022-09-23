<template>
  <div class="la-advenced-select" :class="{ 'autowidth-select': autoWidth }">
    <el-select
      v-if="multiple"
      v-model="valueList"
      :placeholder="placeholder"
      :loading="loading"
      @change="updateValue"
      :multiple="multiple"
      :collapse-tags="collapseTags"
      :filterable="filterable"
      :clearable="clearable"
      ref="popoverSelect"
    >
      <el-option
        v-for="item in option"
        :key="item.value"
        :title="item.label"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-else
      v-model="selVal"
      :placeholder="placeholder"
      :loading="loading"
      @change="updateValue"
      :filterable="filterable"
      :clearable="clearable"
      ref="popoverSelect"
    >
      <slot v-if="$slots.default"></slot>
      <el-option
        v-else
        v-for="item in option"
        :key="item.value"
        :title="item.label"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    multiple: {
      type: Boolean
    },
    collapseTags: {
      type: Boolean
    },
    placeholder: {
      type: String
    },
    option: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: [String, Number]
    },
    valueList: {
      type: Array,
      default() {
        return [];
      }
    },
    index: {
      type: Number
    },
    loading: {
      type: Boolean
    },
    filterable: {
      type: Boolean
    },
    clearable: {
      type: Boolean
    },
    autoWidth: {
      type: Boolean
    }
  },
  model: {
    prop: this.multiple ? "valueList" : "value",
    event: this.multiple ? "updateValue" : "change"
  },
  data() {
    return {
      selVal: this.value
    };
  },
  watch: {
    value(val) {
      this.selVal = val;
    }
  },
  methods: {
    updateValue(value) {
      this.multiple
        ? this.$emit("updateValue", this.index, value)
        : this.$emit("change", value);
    }
  },
  mounted() {
    this.selectPopMouseleave(this);
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.la-advenced-select {
  /deep/.el-select {
    width: 100%;
  }
}
.autowidth-select {
  display: inline-block;
  margin-right: 7px;
  vertical-align: middle;
  /deep/.el-select {
    width: auto;
  }
}
</style>
