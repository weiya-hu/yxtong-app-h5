<template>
  <div>
    <!-- 左侧自动补全输入组件 -->
    <LeftAutoInput v-if="item.type=='text' && item.search_hint" :vuex_name="vuex_name" :api_name="api_name" :item="item" @nomalSearch="nomalSearch"></LeftAutoInput>
    <!-- 左侧输入组件 -->
    <LeftInput v-if="item.type=='text' && !item.search_hint" :vuex_name="vuex_name" :item="item" @nomalSearch="nomalSearch"></LeftInput>
    <!-- 左侧日期选择组件 -->
    <LeftDateRange v-if="item.type=='date'" :vuex_name="vuex_name" :item="item"></LeftDateRange>
    <!-- 左侧联级选择组件 -->
    <LeftFullselect v-if="item.type=='fullselect'" :vuex_name="vuex_name" :item="item"></LeftFullselect>
    <!-- 左侧选择组件 -->
    <LeftSelect v-if="item.type=='select'" :vuex_name="vuex_name" :item="item"></LeftSelect>
    <!-- 复选框 -->
    <LeftCheckBox v-if="item.type=='check'" :vuex_name="vuex_name" :item="item"></LeftCheckBox>
  </div>
</template>

<script>
import LeftInput from '@/components/inputs/trz/left-input'
import LeftAutoInput from '@/components/inputs/trz/left-auto-input'
import LeftDateRange from '@/components/inputs/trz/left-date-range'
import LeftFullselect from '@/components/inputs/trz/left-fullselect'
import LeftSelect from '@/components/inputs/trz/left-select'
import LeftCheckBox from '@/components/inputs/trz/Left-check-box'

export default {
  components: {
    LeftInput,
    LeftAutoInput,
    LeftDateRange,
    LeftFullselect,
    LeftSelect,
    LeftCheckBox
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
  },
  data () {
    return {
      route: this.$route.path.split('/')[2],
    }
  },
  computed: {
    storeState () {
      return Store.state[this.vuex_name]
    },
  },
  methods: {
    //获取普通搜索
    nomalSearch () {
      Store.dispatch(this.vuex_name + '/nomalSearch')
    },
  }
}
</script>

<style lang="less" scoped>
  .box-padd {
    padding-top: 16px;
  }

  /deep/ .el-input--suffix .el-input__inner {
    padding: 0 10px;
  }
</style>
