<template>
  <transition name="dialog">
    <div v-show="show" class="subscription-modal">
      <div
        class="first-time"
        :style="{ top: (showPromtNotice ? 117 : 87) + 'px' }"
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
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    // 区分显示第一次进入的弹框还是显示悬浮到问号上显示的弹框，1表示第一次进入的弹框，0表示悬浮上去的弹框
    hoverType: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {},
  watch: {
    hoverType(val) {
      this.show = val;
      this.$parent.hoverType = val;
    },
    showPromtNotice: {
      handler(val) {
        this.$nextTick(() => {
          document.querySelector(".first-time").style.top =
            (val ? "117" : "87") + "px";
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.show = false;
      this.$parent.hoverType = this.show;
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
// 弹窗动画
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.6s;
}

.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}
.subscription-modal {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  .close-animate {
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    width: 0;
    height: 0;
  }

  .first-time {
    transition: all 1s;
    z-index: 999;
    width: 351px;
    height: 162px;
    background: #ffffff;
    position: fixed;
    right: 96px;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0px 1px 8px 0px #d8e2fa;

    &::after {
      content: " ";
      width: 10px;
      height: 10px;
      position: absolute;
      z-index: 999;
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
