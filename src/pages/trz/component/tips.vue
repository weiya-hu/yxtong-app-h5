<template>
  <div class="rongzi-tips">
    <div class="text" @click="goSubscribe">
      订阅<br />推送
      <img
        class="code"
        src="../../../../static/imgs/wechart/code.png"
        alt=""
      />
    </div>
    <div class="text" @click="handleOutClick()">建议<br />反馈</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import sha1 from "sha1";
import UUID from "uuid-js";
export default {
  name: "event-item",
  props: {
    source: {
      type: String,
    },
  },
  computed: {
    ...mapState({
      username: (state) => state.UserCenter.accountData.username,
      grade_name: (state) => state.UserCenter.accountData.grade_name,
      accountData: (state) => state.UserCenter.accountData,
    }),
  },
  methods: {
    // 去订阅页面
    goSubscribe() {
      let routeData = this.$router.resolve({
        path: `/usercenter/take/new`,
        query: {
          source: this.source,
        },
      });
      window.open(routeData.href, "_blank");
    },

    // 建议反馈打开客服
    handleOutClick() {
      window.ga("send", "event", "button", "click", "vip_home_corner_zixun");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_home_corner_zixun",
      ]);

      let _this = this;
      let random = UUID.create().toString();
      let sign_str = `nonce=${random}&timestamp=${new Date().getTime()}&web_token=${
        _this.accountData.email || _this.accountData.uid
      }`;
      console.info(sign_str + "&2314e6df23cb93264629bbfa10e67c77");
      let sha1Result = sha1(
        sign_str + "&2314e6df23cb93264629bbfa10e67c77"
      ).toUpperCase();

      window.open(
        `https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=${encodeURI(
          _this.username || "咨询客户"
        )}&c_desc=${encodeURI(_this.grade_name || "暂无描述")}&c_email=${
          _this.accountData.email
        }&${sign_str}&signature=${sha1Result}`,
        "_blank"
      );
    },
  }
};
</script>
<style lang="less" scoped>
  .rongzi-tips {
    position: fixed;
    bottom: 130px;
    right: 18px;
    .text {
      width: 40px;
      height: 40px;
      padding: 1px 0;
      text-align: center;
      background: #3556b9;
      color: #fff;
      box-sizing: border-box;
      border-radius: 4px 0 0 4px;
      margin-top: 5px;
      cursor: pointer;
    }

    .code {
      width: 98px;
      position: absolute;
      top: 5px;
      left: -108px;
      display: none;
    }

    .text:nth-child(1):hover {
      .code {
        display: block;
      }
    }
  }
</style>
