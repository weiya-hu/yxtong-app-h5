<template>
  <div>
    <!-- 左侧自动补全输入组件 -->
    <LeftAutoInput
      v-if="item.type == 'text' && item.search_hint && item.name !== 'keywords'"
      :vuex_name="vuex_name"
      :api_name="api_name"
      :item="item"
      @nomalSearch="nomalSearch"
    ></LeftAutoInput>
    <!-- 左侧输入组件 -->
    <LeftInput
      v-if="item.type == 'text' && !item.search_hint"
      :vuex_name="vuex_name"
      :item="item"
      @nomalSearch="nomalSearch"
    ></LeftInput>
    <!-- 左侧日期选择组件 -->
    <LeftDateRange
      v-if="item.type == 'date'"
      :vuex_name="vuex_name"
      :item="item"
    ></LeftDateRange>
    <!-- 左侧日期选择组件 -->
    <LeftDateRangeYear
      v-if="item.type == 'date_y'"
      :vuex_name="vuex_name"
      :item="item"
    ></LeftDateRangeYear>
    <!-- 左侧日期选择组件 -->
    <LeftDateRangeMonth
      v-if="item.type == 'date_m'"
      :vuex_name="vuex_name"
      :item="item"
    ></LeftDateRangeMonth>
    <!-- 左侧联级选择组件（atc专用） -->
    <LeftCascaderSelect
      v-if="item.name == 'atc' && item.type == 'fullselect'"
      :vuex_name="vuex_name"
      :item="item"
    >
    </LeftCascaderSelect>
    <!-- 左侧联级选择组件（非atc） -->
    <LeftFullselect
      v-if="item.name != 'atc' && item.type == 'fullselect'"
      :vuex_name="vuex_name"
      :item="item"
    >
    </LeftFullselect>
    <!-- 左侧选择组件 -->
    <LeftSelect
      v-if="item.type == 'select'"
      :vuex_name="vuex_name"
      :item="item"
    ></LeftSelect>

    <left-check-box
      v-if="item.type == 'check'"
      :vuex_name="vuex_name"
      :item="item"
    ></left-check-box>

    <autoSelect
      v-if="item.name == 'keywords'"
      :vuex_name="vuex_name"
      :api_name="api_name"
      :item="item"
      @nomalSearch="nomalSearch"
    ></autoSelect>
  </div>
</template>

<script>
import LeftInput from "@/components/inputs/left-input";
import LeftAutoInput from "@/components/inputs/left-auto-input";
import LeftDateRange from "@/components/inputs/left-date-range";
import LeftDateRangeYear from "@/components/inputs/left-date-range-year";
import LeftDateRangeMonth from "@/components/inputs/left-date-range-month";
import LeftCascaderSelect from "@/components/inputs/left-cascader-select";
import LeftFullselect from "@/components/inputs/left-fullselect";
import LeftSelect from "@/components/inputs/left-select";
import LeftCheckBox from "@/components/inputs/LeftCheckBox";
import autoSelect from "@/components/inputs/left-auto-select";

export default {
  components: {
    LeftInput,
    LeftAutoInput,
    LeftDateRange,
    LeftDateRangeYear,
    LeftDateRangeMonth,
    LeftCascaderSelect,
    LeftFullselect,
    LeftSelect,
    LeftCheckBox,
    autoSelect,
  },
  props: {
    item: {
      default: {},
      type: Object,
    },
    vuex_name: {
      default: "",
      type: String,
    },
    api_name: {
      default: "",
      type: String,
    },
    route1: {
      default: "",
      type: String,
    },
    route2: {
      default: "",
      type: String,
    },
    route3: {
      default: "",
      type: String,
    },
    route4: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      route: this.$route.path.split("/")[2],
    };
  },
  computed: {
    storeState() {
      return Store.state[this.vuex_name];
    },
  },
  methods: {
    //获取普通搜索
    nomalSearch() {
      this.$emit("nomalSearch");
      // // console.log(this.storeState);
      // // console.log(this);
      // if (this.storeState.conditions) {
      //   Store.commit(this.vuex_name + "/conditions", []);
      // }
      // // if (this.storeState.groups) {
      // //   //清空高级搜索条件和筛选项
      // //   Store.commit(this.vuex_name + "/groups", {});
      // // }

      // let route = this.$route.path.split("/")[2];
      // if (route) {
      //   if (route == this.route1) {
      //     Store.dispatch(this.vuex_name + "/nomalSearch");
      //   }
      // } else {
      //   Store.dispatch(this.vuex_name + "/nomalSearch");
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.box-padd {
  padding-top: 16px;
}

/deep/ .el-input--suffix .el-input__inner {
  padding: 0 10px;
}
</style>
