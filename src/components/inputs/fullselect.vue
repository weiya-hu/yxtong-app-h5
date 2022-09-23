<template>
  <el-cascader
    class="la-advenced-fullselect"
    :options="options"
    :props="cascaderConfig"
    @change="updateValue"
    v-model="vals"
    separator=">"
    filterable
    change-on-select
    clearable
    ref="popoverCascader"
  ></el-cascader>
</template>
<script>
  export default {
    props: {
      vuex_name: {
        type: String,
        default () {
          return ""
        }
      },
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      option: {
        type:Array,
        default () {
          return []
        }
      },
      value: {
        type: Array,
        default: [],
      },
      index: {
        type: Number,
      }
    },
    data() {
      return {
        vals: this.value,
        cascaderConfig: {
          label: 'label',
          value: 'value',
          children: 'children'
        },
        options: []
      };
    },
    watch: {
      value(val){
        this.vals = val
      },
    },
    created () {
      let options = this.option
      for(let key in options){
        this.options.push(options[key])
      }
    },
    mounted() {
      this.cascaderPopMouseleave(this)
    },
    methods:{
      updateValue (value) {
        console.log(value);
        console.log(this.options);
        let new_value = value.join("⊙")
        // 这里是使用编码特殊开发的多级筛选功能，与后台配置的多级筛选功能不一样，因此只需要传选项值。
        // 特殊开发的多级筛选功能包括（注册库"优先审评品种：yxsply"，企业筛选系统 主营业务zhuyingyewu、产品类型qiyepinzhongbq）
        if (this.item.name === "yxsply" || this.item.name === "zhuyingyewu" || this.item.name === "qiyepinzhongbq") {
          new_value = value[value.length-1]
        }
        this.$emit("updateValue",this.index,new_value,value,this.item.type)
      }
    }
  };
</script>
<style lang="less">
  .la-advenced-fullselect{
    &.el-cascader{
      width: 100%;
      line-height: 30px;
    }
  }
</style>
