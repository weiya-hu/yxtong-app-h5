<template>
  <div class="container">
    <div class="dot"></div>
    <div class="pulse1"></div>
    <div class="pulse2"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  props: {

  },
  mounted() {

  },
}

</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@keyframes pulsewarn {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
.container {
  position: relative;
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-bottom: 4px;
  vertical-align: middle;
}
/* 保持大小不变的小圆圈  */
.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  left: 50%;
  top: 50%;
  margin: -4px;
  background: @PrimaryColor;
  border-radius: 8px;
  z-index: 1;
}
/* 产生动画（向外扩散变大）的圆圈  */
.pulse1 {
  position: absolute;
  width: 24px;
  height: 24px;
  left: 50%;
  top: 50%;
  margin: -12px;
  background: @PrimaryColor;
  border-radius: 30px;
  z-index: 2;
  animation: pulsewarn 1s ease-out;
  animation-iteration-count: infinite;
}
/* 产生动画（向外扩散变大）的圆圈  */
.pulse2 {
  position: absolute;
  width: 18px;
  height: 18px;
  left: 50%;
  top: 50%;
  margin: -9px;
  background: @PrimaryColor;
  border-radius: 30px;
  z-index: 3;
  animation: pulsewarn 1s ease-out;
  animation-iteration-count: infinite;
}
</style>
