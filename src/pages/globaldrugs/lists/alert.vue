<template>
  <div class="globaldrugs-alert">
    <!-- 各类提示 -->
    <div class="alert" @click="hideAlerts()">
      <!-- 该功能正在建设中 -->
      <div class="wrong wrong7">
        <!-- <img src="/static/imgs/globaldrugs/noencode.png" alt="" width="34" /> -->
        <span
          >该功能正在建设中...<br />
          即将上线</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      activeTabName: (state) => state.Globaldrugs.tabname,
    }),
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.hideAlerts();
      },
    },
    activeTabName: {
      handler(newVal, oldVal) {
        this.hideAlerts();
      },
    },
  },
  methods: {
    hideAlerts() {
      $(".alert").hide();
    },
    changeAlert() {
      $(".alert").fadeIn();
      $(".alert").find(".wrong7").fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert").find(".wrong7").fadeOut();
      }, 2000);
    },
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.globaldrugs-alert {
  .alert {
    z-index: 9999;
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .wrong {
      position: relative;
      width: 180px;
      height: 100px;
      background: #002fa7;
      box-shadow: 0px 1px 20px 0px rgba(9, 20, 79, 0.25);
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        display: block;
      }
      span {
        font-size: 13px;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
        margin-top: 5px;
        text-align: center;
      }
    }
    div {
      display: none;
    }
  }
}
</style>
