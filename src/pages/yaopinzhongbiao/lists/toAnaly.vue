<template>
  <span @click="navRouteTo()" class="anylay">
    <span class="nav" style="font-size:14px;"><i class="iconfont pr5">&#xe643;</i>智能分析</span>
  </span>
</template>
<script>
export default {
  methods:{
    navRouteTo(){
        window.ga("send","event", "button", "click", "vip_yaopinzhongbiao_analy")
        window._paq.push(['trackEvent', 'button', 'click','vip_yaopinzhongbiao_analy',])
        // window.ga("send","event", "button", "click", "vip_yaopinzhongbiao_analy")
        this.$router.push({ path: '/yaopinzhongbiao/analy'})
      },
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
  .anylay{
    margin-right: 16px;
    cursor: pointer;
    &:hover{
      color:@PrimaryColor;
    }
  }
</style>
