<template>
  <transition name="fade">
    <div class="message" :class="'message-'+type" v-if="show">
      <span>{{text}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'message',
  props: {
    type: {
      type: String,
      default: 'success',
    },
    text: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter,.fade-leave-to {
  opacity: 0;
}
.message {
  width: 175px;
  height: 105px;
  position: fixed;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%,-50%);
  background: '#f5f5f5';
  font-size: 14px;
  line-height: 1.4;
  border-radius: 4px;
  z-index: 9999;
  span {
    position: absolute;
    left: 0;
    bottom: 30%;
    transform: translateY(50%);
    color: #fff;
    font-size: 14px;
    width: 100%;
    text-align: center;
    font-weight: bold;
  }
}
.message-success {
  background: url(/static/imgs/usercenter/alert/right.png) no-repeat;
}
.message-error {
  background: url(/static/imgs/usercenter/alert/wrong.png) no-repeat;
}
</style>
