<template>
  <el-checkbox
  :indeterminate="value==-1"
  :value="value==1"
  :true-label="1"
  :false-label="0"
  @change="change"
  >
      <slot></slot>
  </el-checkbox>
</template>

<script>
export default {
    name: "v-check-box",
    props: {
        value: {
            default: 0,
            type: Number
        }
    },
    methods: {
        change(e) {
            this.$emit('change', this.value>0?-1:this.value+1)
        }
    }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

/deep/.el-checkbox__inner {
    font-family: element-icons!important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
}
/deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    content: '\E60F';
    top: 1px;
    left: -1px;
    line-height: 10px;
    transform: scale(1);
    background-color: unset;
    color: #F4A622;
}

/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #F4A622;
  background-color: #fff;
}
</style>
