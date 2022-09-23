<template>
  <div class="TrialMemberExpiresModal">
    <el-dialog
      class="dialog-actions"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="showUserInfo = false"
      :modal-append-to-body="false"
      :visible="showUserInfo"
    >
      <div slot="title" class="dialog-header">温馨提示</div>
      <div class="clearfix zjl_body">
        <div class="fl body_left">
          <img src="~@/assets/imgs/reminder.png" height="114" width="90" />
        </div>
        <div class="fl body_right">
          <div class="title">
            尊敬的药智用户，您的药智数据企业版试用账号，将于
            <span style="color: #F77B52;">{{ data.vipendtime }}</span
            >到期。
          </div>
          <div class="describe" style="margin-top: 10px;">
            同时，非常感谢您使用我们的产品，为了提高您的产品体验，
            诚邀您参与问卷调研， 期待您的建议！
          </div>
          <div class="title" style="margin-top: 10px;">
            客服热线：<span style="color: #4877E8;">400-678-0778</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="zjl_footer">
        <el-button @click="linkTo" type="primary">问卷调研</el-button>
        <el-button @click="showUserInfo = false" class="ml50"
          >继续体验</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      showUserInfo: false,
      data: {},
      primaryFlag: ""
    };
  },
  mounted() {},
  watch: {
    accountData(val) {
      this.primaryFlag = "TrialMemberExpiresModal" + val.uid;
      if (
        !localStorage.getItem(this.primaryFlag) ||
        localStorage.getItem(this.primaryFlag) == "false"
      ) {
        this.getUserInfo(); // 试用会员到期提示
      }
    }
  },
  computed: {
    ...mapState({
      accountData: state => state.UserCenter.accountData
    })
  },
  methods: {
    linkTo() {
      const { href } = this.$router.resolve({
        path: `/qs/${this.data.token}`,
        query: {
          source: 2
        }
      });
      window.open(href, "_blank");
    },
    async getUserInfo() {
      const that = this,
        res = await window
          .Axios({
            method: "get",
            url: "/api/questionnaire/userInfo",
            params: {
              token: GETCOOKIEFUN("accesstoken"),
              type: 2
            }
          })
          .catch(err => {
            console.log(err);
          });
      if (res.data && res.data.code === 200) {
        this.showUserInfo = res.data.data.auth_check;
        this.data = res.data.data;
        localStorage.setItem(this.primaryFlag, this.showUserInfo);
      } else {
        this.showUserInfo = false;
        localStorage.setItem(this.primaryFlag, this.showUserInfo);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.TrialMemberExpiresModal {
  /deep/.v-modal {
    background: rgba(216, 216, 216, 0.65);
  }

  /deep/.el-dialog {
    border-radius: 20px !important;
    width: 550px;
    top: 50vh !important;
    box-shadow: -3px 2px 8px 0px rgba(188, 188, 188, 0.33);
  }
  /deep/.el-dialog__header {
    padding: 0px 20px;
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid @BorderColor;
    .dialog-header {
      height: 50px;
      line-height: 50px;
    }
  }
  /deep/.el-dialog__body {
    padding: 0px;
    .zjl_body {
      margin-top: 20px;
      display: flex;
      .body_left {
        margin-left: 46px;
        margin-top: 10px;
      }
      .body_right {
        margin-left: 30px;
        margin-right: 20px;
        .mt15 {
          margin-top: 15px;
        }
        .title {
          font-size: 14px;
          font-weight: 400;
          color: #545b6d;
          line-height: 20px;
        }
        .describe {
          font-size: 13px;
          font-weight: 400;
          color: #868ea3;
          line-height: 18px;

          .link {
            color: #4877e8;
            text-decoration: none;
          }
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    border-top: none;
    .zjl_footer {
      margin-top: 20px;
      text-align: center;
      .ml50 {
        margin-left: 50px;
      }
      .error {
        color: red;
        margin-top: 5px;
      }
    }
  }
}
</style>
