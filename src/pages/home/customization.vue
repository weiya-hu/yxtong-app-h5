<template>
  <div></div>
<!--   <section class="la-Customization">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="常用数据库" name="first">常用数据库</el-tab-pane>
      <el-tab-pane label="我的订阅" name="second">我的订阅</el-tab-pane>
      <el-tab-pane label="保存的检索" name="third">保存的检索</el-tab-pane>
    </el-tabs>
  </section> -->
</template>

<script>
  export default {
    name: 'Customization',
    data () {
      return {
        activeName: 'first'
      }
    }
  }
</script>
<style lang="less">
  @import "~@/assets/less/var.less";
  .la-Customization{
    box-shadow: @BoxShadow;
    width: 1182px;
    height: 190px;
    margin-top: @Space;
    background-color: @White;
  }
</style>