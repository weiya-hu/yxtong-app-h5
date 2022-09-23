<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-logo">
        <img class="logo" src="~@/assets/imgs/login-sign.jpg" />
        <div class="middle-logo m-logo">
          <div class="logo-zh">药智数据企业版</div>
          <div class="logo-url">vip.yaozh.com</div>
        </div>
        <div class="middle-logo s-logo">智能决策，洞见未来</div>
      </div>
      <div v-if="fullDate.length" class="page-header-datetime">
        <span>{{ fullDate[0] }}</span>
        <span>{{ fullDate[1] }}</span>
      </div>
    </div>
    <div class="page-container">
      <slot />
    </div>
    <div class="page-foot" >
      <div>更多内容，请在网页版查看</div>
      <div v-if="page" style="font-weight:bold">第{{ page }}页</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pdf-page",
  props: {
    fullDate: { type: Array, default: () => [] },
    page: {
      default: 0,
      type: Number,
    },
  },
};
</script>

<style scoped lang="less">
@import url(../pdf.less);
.page-header {
  text-align: center;
  width: 100%;
  top: 0;
  left: 0;
  height: 50px;
  box-sizing: border-box;
  padding: 10px 20px;
}
.page-header-logo {
  float: left;
  color: #2e4873;
  text-align: left;
  position: relative;
  padding-left: 35px;
  .logo {
    position: absolute;
    width: 29px;
    height: 29px;
    left: 0;
    top: 0;
  }
  .middle-logo {
    display: inline-block;
    vertical-align: middle;
  }
  .logo-zh {
    font-size: 14px;
  }
  .logo-url {
    font-size: 12px;
  }
  .m-logo {
    position: relative;
    &:before {
      content: "";
      position: absolute;
      height: 22px;
      width: 1px;
      background: #545b6d;
      right: -11px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .s-logo {
    font-size: 15px;
    margin-left: 20px;
    line-height: 20px;
  }
  div {
    line-height: 16px;
  }
}
.page-header-datetime {
  float: right;
  font-size: 14px;
  margin-top: 8px;
  span {
    line-height: 16px;
    margin-left: 6px;
  }
}
.page {
  width: 794px;
  min-height: 1120px;
  margin-bottom: 10px;
  box-shadow: 1px 1px 5px 1px #e4e4e4;
  background-color: #fff;
  position: relative;
}
.page-container {
  min-height: 1060px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #fff;
  padding: 0 20px 30px;
  position: relative;
}
.page-foot {
  text-align: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  left: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;
}
</style>