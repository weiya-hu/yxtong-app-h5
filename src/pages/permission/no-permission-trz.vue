<template>
  <div class="no-pms-msg">
  <HeaderTrz></HeaderTrz>
    <div class="msg">
      <img src="/static/imgs/nodata/db-nodata.png" />
      <div class="inner-msg">
        <div class="tips">暂无权限</div>
        <p class="desc">
          尊敬的企业版会员，您好！您的账号不具备该模块权限，请联系销售或客服人员开通。
        </p>
        <div class="btn-area">
          <div class="back btn" @click="back">返回企业版首页</div>
          <div class="online btn" @click="online">在线咨询</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sha1 from "sha1";
import UUID from "uuid-js";
import { mapState } from "vuex";
import HeaderTrz from "@/components/layouts/trz/header";

export default {
  data() {
    return {};
  },
  components: {
    HeaderTrz
  },
  mounted() {
    this.clearBrowserHistory();
    // $(".header-trz.transparent").removeClass("transparent home-head");
  },
  beforeDestroy() {
    // $(".header-trz").addClass("transparent home-head");
  },
  computed: {
    ...mapState({
      username: state => state.UserCenter.accountData.username,
      grade_name: state => state.UserCenter.accountData.grade_name,
      accountData: state => state.UserCenter.accountData
    })
  },
  methods: {
    clearBrowserHistory() {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", function() {
        history.pushState(null, null, document.URL);
      });
    },
    back() {
      window.ga("send", "event", "button", "click", "viptrz_wuquanxian_home");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_wuquanxian_home"
      ]);
      this.clearBrowserHistory();
      this.$router.push("/home");
    },
    online() {
      window.ga("send", "event", "button", "click", "viptrz_wuquanxian_zixun");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "viptrz_wuquanxian_zixun"
      ]);
      let _this = this;
      let random = UUID.create().toString();
      let sign_str = `nonce=${random}&timestamp=${new Date().getTime()}&web_token=${_this
        .accountData.email || _this.accountData.uid}`;
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
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

body {
  background: #fff !important;
}

.no-pms-msg {
  width: 100vw;
  height: 100vh;
  .msg {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
    .inner-msg {
      text-align: center;
      font-size: 14px;
      color: #9ea8c3;
      line-height: 22px;
      padding-top: 10px;
      .tips {
        height: 22px;
        font-size: 22px;
        font-weight: 500;
        color: #e7af2f;
        line-height: 22px;
        margin-bottom: 10px;
      }
      .desc {
        font-size: 16px;
        font-weight: 400;
        color: #666666;
        line-height: 24px;
        margin-bottom: 20px;
      }

      .btn-area {
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 118px;
          height: 36px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .back {
          color: #ffffff;
          background: #3556b9;
          margin-right: 20px;
        }
        .online {
          border: 1px solid #3556b9;
          color: #3556b9;
        }
      }
    }
  }
}
</style>
