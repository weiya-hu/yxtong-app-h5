<template>
  <div class="page-404" v-if="show">
    <div class="page-404-flex">
      <div class="page-404-l">
        <img src="~@/assets/imgs/404.gif">
      </div>
      <div class="page-404-r">
        <div>
          <p class="fs-60">小智不小心打翻了实验室！<br/>正在努力抢修......</p>
          <p class="fs-18">抱歉，你要查找的页面不在这里！你可以返回首页或给我们反馈问题。</p>
        </div>
        <div class="page-404-btn">
          <el-button class="btn-home" type="primary" size="mini" round @click="goHome">返回首页</el-button>
          <el-button class="btn-bgfff" size="mini" round @click="goFeedback">反馈问题</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DialogFeedback from '@/components/common/dialog-feedback'
import router from '@/router'
import sha1 from "sha1"
import UUID from "uuid-js"
export default{
  components:{
    DialogFeedback,
  },
  data(){
    return {
      dialogFormVisible: false,
      show: true,
    }
  },
  methods: {
    goHome() {
      router.push({ path:"/home" })
      setTimeout(() => {
        this.show = false
      }, 500)
    },
    goFeedback() {
      let isLogin = Boolean(this.vueGetCookie("accesstoken"))
      let random = UUID.create().toString()
      let times = new Date().getTime()
      let web_token = isLogin ? this.vueGetCookie("userID"): ''
      let sign_str = `nonce=${random}&timestamp=${times}&web_token=${web_token}`
      let sha1Result = sha1(sign_str+'&2314e6df23cb93264629bbfa10e67c77').toUpperCase()
      window.open(`https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=${isLogin? this.vueGetCookie("userName"): '用户未登录'}&c_desc=${isLogin? this.vueGetCookie("userGradeName"): '暂无描述'}&${sign_str}&signature=${sha1Result}`, '_blank')
    },
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.page-404 {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background: @PrimaryColor;
}
.page-404-flex {
  height: 100%;
  display: flex;
  align-items: center;
  max-width: 1500px;
  margin: auto;
}
.page-404-l {
  flex: 1;
  img {
    width: 100%;
    display: block;
  }
}
.page-404-r {
  flex: 1;
  p {
    color: #fff;
  }
}
.fs-60 {
  font-size: 60px;
  line-height: 74px;
}
.fs-18 {
  font-size: 18px;
  line-height: 36px;
}
.page-404-btn {
  margin-top: 40px;
  button {
    font-size: 18px;
    margin-right: 20px;
  }
}
.btn-home {
  border: 1px solid #fff;
}
.btn-bgfff {
  color: @PrimaryColor;
}
@media screen and (max-width: 1500px) {
  .fs-60 {
    font-size: 3vw;
    line-height: 4vw;
  }
  .fs-18,.page-404-btn button {
    font-size: 1.2vw;
  }
}
</style>
