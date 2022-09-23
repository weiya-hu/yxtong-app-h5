<template>
  <div v-show="show" class="first-time-subscription">
    <transition name="el-zoom-in-top">
      <div
        v-show="show"
        class="first-time"
        :style="{ top: showPromtNotice ? 128 : 98 + 'px' }"
      >
        <div class="title">
          <img src="/static/imgs/zhuce/info-icon.png" height="16" width="16" />
          <span>温馨提示：</span>
        </div>
        <div class="content">
          <div class="info">
            <p>
              点击“<span class="color-blue">订阅</span>”，关注数据库最新变更数据
            </p>
            <p>
              扫码关注“<span class="color-blue">药智数据服务</span>”微信公众号，
            </p>
            <p>绑定账号即可随时掌握最新动态~</p>
          </div>
          <div class="qr-code">
            <img
              src="/static/imgs/zhuce/subscribe-official-account-QR-code.png"
              height="84"
              width="83"
            />
          </div>
        </div>
        <div class="btn" @click="closeModal">
          我已知晓
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      show: true
    };
  },
  mounted() {
    if (localStorage.getItem("closeSubscribeModal") != undefined) {
      this.show = false;
    } else {
      this.show = true;
      localStorage.setItem("closeSubscribeModal", true);
    }
  },
  watch: {
    showPromtNotice: {
      handler(val) {
        this.$nextTick(() => {
          document.querySelector(".first-time").style.top =
            (val ? "128" : "98") + "px";
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.show = false;
      localStorage.setItem("closeSubscribeModal", false);
    }
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    })
  }
};
</script>

<style lang="less" scoped>
.first-time-subscription {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;

  .first-time {
    width: 351px;
    height: 162px;
    background: #ffffff;
    position: fixed;
    right: 10px;
    border-radius: 8px;
    padding: 20px;

    &::after {
      content: " ";
      width: 10px;
      height: 10px;
      position: absolute;
      top: -5px;
      right: 30px;
      transform: translate(-50%) rotate(135deg);
      background: #fff;
    }

    .title {
      height: 16px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: #545b6d;
      line-height: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dfe5f1;

      img {
        margin-right: 4px;
      }

      span {
        height: 16px;
        font-size: 16px;
        font-weight: 600;
        color: #545b6d;
        line-height: 16px;
      }
    }

    .content {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .info {
        .color-blue {
          color: #4877e8;
          font-weight: bold;
        }
        p:first-child {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #545b6d;
          line-height: 14px;
          margin-bottom: 10px;
        }
        p:not(:first-child) {
          font-size: 14px;
          font-weight: 400;
          color: #545b6d;
          line-height: 20px;
        }
      }

      .qr-code {
        margin-right: 6px;
      }
    }

    .btn {
      width: 76px;
      height: 24px;
      background: #4877e8;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
