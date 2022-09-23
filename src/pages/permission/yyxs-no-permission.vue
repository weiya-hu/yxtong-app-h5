<template>
  <div class="no-pms-msg">
    <div class="msg">
      <img src="/static/imgs/nodata/yyxs-nodata.png">
      <div class="inner-msg">
        <div class="fs16">
          医院销售数据放大测试版正在开发中，敬请期待。
        </div>
        <p class="fs16">如有疑问，请<span class="cl-blue">联系客服</span>&nbsp;&nbsp;<span class="cl-orange">400-678-0778</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        
      }
    },
    methods: {
      
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.no-pms-msg {
  box-sizing: border-box;
  width: 510px;
  height: 140px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -180px;
  .msg {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    position: relative;
    padding-left: 150px;
    display: flex;
    align-items: center;
    img {
      position: absolute;
      width: 120px;
      height: auto;
      left: 0;
      top: 0;
    }
    .inner-msg {
      font-size: 14px;
      color: #444;
      line-height: 26px;
      padding-top: 10px;
      p {
        margin: 0px;
        a {
          color: @PrimaryColor;
        }
      }
    }
  }
}
</style>