<template>
  <div
    class="header-indicator la-header"
  >
    <div class="header-content">
      <div class="indicator-logo">
        <img src="~@/assets/imgs/home-logo.png" width="121" height="34" @click="linkTo('/home')"/>
        <div class="line"></div>
        <div class="txt">医药宏观数据分析系统Beta</div>
      </div>
      <div class="menu"></div>
      <div class="userinfo">
        <div class="el-dropdown-link">
          <router-link to="/usercenter" class="avatar">
            <span class="user-img-wrap">
              <img class="user-img" :src="accountData.picture" />
            </span>
            <span class="user-name">{{ accountData.username }}</span>
          </router-link>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputPopover from "@/components/inputs/input-popover";
import { mapState } from "vuex";
import Moment from "moment";

export default {
  components: {
    inputPopover
  },
  name: "indicator-header",
  data() {
    return {
      path: this.$route.path ? this.$route.path : "",
      noticeMsgStr: "",
      noticeMsg: []
    };
  },
  mounted() {
  },
  computed: {
    ...mapState({
      accountData: state => state.UserCenter.accountData
    })
  },
  methods: {
    linkTo(path) {
      if (path != this.$route.path)
        this.$router.push({
          path
        });
    },

    handleClick(val) {
      console.log(`vipindicator_${val}`);
      window.ga("send", "event", "button", "click", `vipindicator_${val}`);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `vipindicator_${val}`
      ]);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.header-indicator {
  height: 48px;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  min-width: 1200px;
  z-index: 9999;
  background: #4877e8;
  padding: 0 20px;
  top: 0;
  left: 0;
  box-sizing: border-box;
  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 45%, 0);
      transform: translate3d(0, 45%, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  .fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }

  .header-content {
    height: 100%;
    width: 100%;
    min-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    position: relative;

    .indicator-logo {
      display: flex;
      align-items: center;
      margin-right: 90px;
      img {
        &:hover {
          cursor: pointer;
        }
      }
      .line {
        width: 2px;
        height: 18px;
        background: #fff;
        margin: 0 10px;
      }
      .txt {
        font-size: 14px;
        color: #fff;
      }
    }

    .menu {
      height: 100%;
      align-self: normal;
      display: flex;
      .title {
        height: 100%;
        display: flex;
        align-items: center;
      }
      span {
        color: #ffffff;
        font-size: 16px;
        font-weight: 400;
        display: flex;
        align-items: center;
        position: relative;
        &:hover {
          cursor: pointer;
          color: #e7af2f !important;
        }

        &:hover {
          .menu-items {
            display: block;
          }
        }

        .menu-items {
          animation-duration: 0.6s;
          animation-fill-mode: forwards;
          position: absolute;
          top: 40px;
          left: 0;
          width: 120px;
          display: none;
          background: #fff;
          border-radius: 4px;
          padding: 10px;
          z-index: 9999;
          box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);

          .submenu-active {
            color: #182462 !important;
          }

          .menu-item {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            text-decoration: none;
            &:hover {
              color: #182462 !important;
            }
          }

          .menu-line {
            width: 118px;
            height: 1px;
            margin: 10px auto;
            display: flex;
          }
        }
      }

      span.hover {
        .menu-items {
          display: block;
        }
      }

      & > :not(:last-child) {
        margin-right: 50px;
        // padding-bottom: 20px !important;
      }

      .active {
        color: #e7af2f !important;
        position: relative;

        &::after {
          content: "";
          top: 35px;
          left: 0;
          position: absolute;
          width: 100%;
          height: 2px;
          background: #e7af2f;
        }
      }

      .arrow {
        margin-left: 6px;
        width: 12px;
        height: 7px;
      }

      span:hover > .title > .arrow {
        transform: rotate(180deg);
        transition: 0.6s ease-in-out;
      }
    }

    .search-form-box {
      float: right;
      margin-right: 20px;
      min-width: 200px;
      .c-search-form {
        box-sizing: border-box;
        position: relative;
        z-index: 3000;
        height: 26px;
        line-height: 26px;
        border-radius: 14px;

        @media screen and (min-width: 1918px) {
          width: 300px;
        }

        @media screen and (max-width: 1281px) {
          width: 196px;
        }
        .el-input {
          z-index: 2010;
        }
        #header-search-btn {
          z-index: 2011;
        }
        .header-xiala-history {
          z-index: 2008;
          position: absolute;
          top: 14px;
          left: 0px;
          width: 100%;
          padding: 20px 0px 10px 0px;
          background-color: #fff;
          box-shadow: @BoxShadow;
          border-radius: 0 0 4px 4px;
          .el-icon-close {
            transition: all 300ms;
            transform: scale(1);
            &:hover {
              transition: all 300ms;
              transform: scale(1.5);
            }
          }
          &::after {
            content: "";
            height: 1px;
            width: 100%;
            background-color: #ccc;
            position: absolute;
            top: 14px;
            left: 0;
          }
          .one-history {
            overflow: hidden;
            box-sizing: border-box;
            width: 100%;
            height: 25px;
            line-height: 25px;
            color: @PrimaryColor;
            font-size: 12px;
            padding: 0 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-decoration: none;
            & > span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              max-width: 100%;
            }
            i {
              color: #333;
              font-size: 16px;
              &:hover {
                font-weight: bold;
              }
            }
            &:hover {
              background-color: #f6f8fc;
            }
            &:active {
              background-color: Darken(#f6f8fc, 5%);
            }
          }
          .delete-all {
            cursor: pointer;
            position: relative;
            box-sizing: border-box;
            min-width: 200px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-weight: bold;
            padding: 0 6px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            text-decoration: none;
            transition: all 300ms;
            span {
              transition: all 300ms;
              cursor: pointer;
              position: absolute;
              left: 24px;
              padding: 0px;
            }
            i {
              transition: all 100ms;
              font-size: 16px;
              opacity: 0;
            }
            &:hover {
              transition: all 300ms;
              background-color: #f6f8fc;
              span {
                transition: all 300ms;
                left: 44px;
              }
              i {
                transition: all 500ms;
                opacity: 1;
              }
            }
          }
        }
        .header-xiala-input {
          z-index: 2009;
          position: absolute;
          top: 14px;
          left: 0px;
          width: 100%;
          padding: 20px 0px 10px 0px;
          background-color: #fff;
          box-shadow: @BoxShadow;
          border-radius: 0 0 4px 4px;
          &::after {
            content: "";
            height: 1px;
            width: 100%;
            background-color: #ccc;
            position: absolute;
            top: 14px;
            left: 0;
          }
          .one-input {
            overflow: hidden;
            display: block;
            box-sizing: border-box;
            width: 100%;
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            padding: 0 6px;
            text-decoration: none;
            & > span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              max-width: 100%;
            }
            &:hover {
              background-color: #f6f8fc;
            }
            &:active {
              background-color: Darken(#f6f8fc, 5%);
            }
          }
        }
      }
    }
    .userinfo {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      .avatar {
        text-decoration: none;
        display: flex;
        align-items: center;
        padding-left: 0;
        .user-img-wrap {
          float: left;
          width: 34px;
          height: 34px;
          border-radius: 34px;
          border: 1px solid #fff;
          overflow: hidden;
          .user-img {
            float: left;
            width: 34px;
            height: 34px;
          }
        }
        .user-name {
          color: #fff;
          font-size: 13px;
          max-width: 90px;
          float: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin-left: 4px;
        }
      }
    }
  }

  .prompt-notice {
    z-index: 99999;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #fff5f2;

    .prompt-content {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      height: 100%;
      overflow: hidden;
      img {
        height: 10px;
        margin-top: 10px;
      }
      .text-container {
        width: calc(100% - 40px);
        margin: 0 auto;
        overflow: hidden;
        .text {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #f77d54;
          animation: scroll 20s linear infinite;
        }

        .box {
          width: 500px;
          border: 1px solid red;
          margin: 20px auto;
          overflow: hidden;
        }
        .clearfix:after {
          content: ".";
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
        .inner {
          display: flex;
        }
        ul {
          white-space: nowrap;
          list-style: none;
          display: flex;
        }
        li {
          display: flex;
          margin-right: 30px;
        }
      }
      .close_notice_icon {
        cursor: pointer;
      }
    }
  }
}
</style>
