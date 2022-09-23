<template >
  <div v-if="homefooter" :class="{'la-footer-home': homefooter, 'la-footer-other': otherfooter}" class="la-footer">
    Copyright © 2009-2022  YAOZH.COM All Rights Reserved
  </div>
</template>

<script>
export default {
  computed:{
    homefooter () {
      return this.$route.path.split('/')[1] === 'home';
    },
    otherfooter () {
      let routePath = this.$route.path.split('/')[1]
      switch (routePath)
      {
        case 'drug': return true; break
        case 'company': return true; break
        case 'intelligent': return true; break
        case 'information': return true; break
        default: return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
  .la-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    line-height: 50px;
    text-align: center;
    color: @FontColor3;
  }
  .la-footer-other {
    padding-left: 51px;
  }
</style>
