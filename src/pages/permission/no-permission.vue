<template>
  <div class="no-pms-msg">
    <div class="msg">
      <img src="/static/imgs/nodata/db-nodata.png" />
      <div class="inner-msg">
        <p>
          对不起，您暂无该功能权限，需升级权限<br />
          享用更多功能。
        </p>
        <p>
          <span class="cl-blue fs16">联系客服</span>&nbsp;&nbsp;<span
            class="cl-orange fs16"
            >400-678-0778</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function() {
      history.pushState(null, null, document.URL);
    });
  },
  methods: {}
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.no-pms-msg {
  box-sizing: border-box;
  width: 460px;
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
    padding-left: 84px;
    padding-top: 10px;
    img {
      position: absolute;
      width: 74px;
      height: 108px;
      left: 0;
      top: 0;
    }
    .inner-msg {
      font-size: 14px;
      color: #9ea8c3;
      line-height: 22px;
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
