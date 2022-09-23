<template>
  <div class="wq-stoped">
      <h1 class="wq-stoped-notify">{{status}}</h1>
      <img class="wq-stoped-qrcode" src="@/assets/imgs/fuwuhao.png" alt="服务号二维码">
      <p>扫码关注<b>“药智数据服务”</b>服务号</p>
      <p>随时掌握最新动态！</p>
  </div>
</template>

<script>
export default {
  name: 'stoped',
  computed: {
    status() {
      const status = this.$route.query.s || 'err';
      const sMap = {
        ok: "您的问卷已经提交，感谢您的反馈！",
        visited: "您已提交过问卷，请勿重复提交！",
        err: "您访问的问卷已截止收集！"
      }
      return sMap[status] || sMap['err']
    }
  }
}
</script>

<style scoped lang="less">
.wq-stoped {
  text-align: center;
  padding-top: 110px;
  &-notify {
    margin: 0;
    font-size: 18px;
    color: #4877E8;
    font-weight: 600;
  }
  &-qrcode {
    margin: 60px auto 10px;
  }
  p {
    font-size: 14px;
    color: #333;
  }
}
</style>