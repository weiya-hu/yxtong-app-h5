<template>
  <div class="la-mc">
    <div class="header">
      <div class="header-main">
        <div class="photo">
          <img :src="accountData.picture" />
        </div>
        <div class="name">{{ accountData.username }}</div>
        <div class="power">
          <img
            :src="'/static/imgs/usercenter/' + vip_img.name"
            :style="vip_img.style"
            :title="accountData.grade_name"
          />
          <span>会员等级：{{ accountData.grade_name }}</span>
          <span @click="onRenew" v-if="lessThanTheTime(accountData.endtime)"
            >点击续约</span
          >
        </div>
        <div
          class="acorss-time"
          v-if="accountData.endtime != '' && accountData.starttime != ''"
        >
          <span>{{ accountData.starttime ? accountData.starttime : "-" }}</span>
          &nbsp;至&nbsp;
          <span>{{ accountData.endtime ? accountData.endtime : "-" }}</span>
          <el-tooltip
            class="item"
            effect="light"
            content="尊敬的vip会员，您的产品使用期限即将到期，请及时联系客服续约，以免影响您的正常使用。"
            placement="right"
            v-if="lessThanTheTime(accountData.endtime)"
          >
            <i class="el-icon-warning cl-orange"></i>
          </el-tooltip>
        </div>
      </div>
      <!-- 导航条 -->
      <div class="header-nav">
        <router-link to="/usercenter/message" class="nav-item">
          <img
            src="@/assets/imgs/usercenter/xiaoxi-nav-icon.png"
            class="nav-icon"
            width="14"
            height="16"
          />
          <span class="nav-name"
            >消息通知<span class="nav-num" v-if="xxtzNumUnread">{{
              xxtzNumUnread
            }}</span></span
          >
        </router-link>
        <!-- 暂不上线，暂时隐藏 -->
        <router-link to="/usercenter/take" class="nav-item">
          <img
            src="@/assets/imgs/usercenter/dingyue-nav-icon.png"
            class="nav-icon"
            width="14"
            height="16"
          />
          <span class="nav-name"
            >订阅管理<span class="nav-num" v-if="dyglNum">{{
              dyglNum
            }}</span></span
          >
        </router-link>
        <!-- 暂未开发，暂时隐藏 -->
        <!-- <router-link to="/usercenter/collect" class="nav-item">
          <i class="iconfont">&#xe612;</i>
          <span class="nav-name">收藏管理</span>
        </router-link> -->
        <router-link to="/usercenter/history" class="nav-item">
          <img
            src="@/assets/imgs/usercenter/sousuo-nav-icon.png"
            class="nav-icon"
            width="15"
            height="15"
          />
          <span class="nav-name">搜索记录</span>
        </router-link>
        <router-link to="/usercenter/suggest" class="nav-item">
          <img
            src="@/assets/imgs/usercenter/jianyi-nav-icon.png"
            class="nav-icon"
            width="17"
            height="16"
          />
          <span class="nav-name">建议反馈</span>
        </router-link>
        <router-link to="/usercenter/account" class="nav-item">
          <img
            src="@/assets/imgs/usercenter/zhanghao-nav-icon.png"
            class="nav-icon"
            width="15"
            height="16"
          />
          <span class="nav-name">账号管理</span>
        </router-link>
        <router-link to="/home" class="nav-item" @click.native="noviceEvent">
          <img
            src="@/assets/imgs/usercenter/xinshou-nav-icon.png"
            class="nav-icon"
            width="18"
            height="15"
          />
          <span class="nav-name">新手教程</span>
        </router-link>
      </div>
    </div>
    <div class="mc-view">
      <router-view></router-view>
    </div>
    <RenewBase :filedVisible="filedVisible" @closeD="filedVisible = false" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import RenewBase from "./renew/base";

export default {
  components: {
    RenewBase
  },
  data() {
    return {
      filedVisible: false,
      data: {
        param: {
          page: 1,
          pageSize: 10
        }
      }
    };
  },
  computed: {
    ...mapState({
      uid: state => state.UserCenter.uid,
      xxtzNumUnread: state => state.UserCenter.xxtzNumUnread,
      xxtzNum: state => state.UserCenter.xxtzNum,
      dyglNum: state => state.UserCenter.dyglNum,
      accountData: state => state.UserCenter.accountData
    }),
    vip_img() {
      // style 是为了适应不同的图片对齐文字，设计上需要进步
      let imgs = [
        { id: [4, 10, 51, 58], imgName: "vip-cj.png", style: "" }, // 初级
        { id: [5, 11, 52, 59], imgName: "vip-zj.png", style: "" }, // 中级
        { id: [6, 12, 53, 60], imgName: "vip-gj.png", style: "" }, // 高级
        { id: [7, 13, 61], imgName: "vip-tj.png", style: "margin-top: -7px;" }, // 特级
        { id: [1, 23, 55], imgName: "vip-nb.png", style: "" } // 内部
      ];
      let obj = imgs.find(item => {
        return item.id.indexOf(this.accountData.grade_id) != -1;
      });
      return obj
        ? {
            name: obj.imgName,
            style: obj.style
          }
        : {
            name: "vip-default.jpg",
            style: ""
          };
    }
  },
  watch: {
    $route() {
      // if (this.$route.path.indexOf('/usercenter/message') === 0) {
      //   Store.dispatch("UserCenter/handleXxtzAxios", {page: 1, pageSize: 10})
      // } else if (this.$route.path.indexOf('/usercenter/take/dynamic') === 0) {
      //   Store.dispatch("UserCenter/handleDyglAxios", {page: 1, pageSize: 10})
      // }
    }
  },
  methods: {
    noviceEvent() {
      console.log(1);
      window.ga("send", "event", "button", "click", "usercenter_xsjc");
      _paq.push(["trackEvent", "button", "click", "usercenter_xsjc"]);
      Store.dispatch("UserCenter/needGuideShowA", true);
      Store.dispatch("UserCenter/guideFlagsRenewA", false);
    },
    onRenew() {
      this.filedVisible = true;
    },
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/usercenter/userinfo",
          params: {
            accesstoken: this.vueGetCookie("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            console.log(data);
            this.data = data;
            this.grade_id = data.grade_id;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 是否会员期少于90天
    lessThanTheTime(end_time) {
      if (!end_time) {
        return;
      }

      // 过滤试用账号
      if (
        [62, 63, 64, 65, 84, 85, 86].some(e => e === this.accountData.grade_id)
      ) {
        return false;
      }

      let now_ts = Date.parse(new Date());
      let the_ts = 60 * 60 * 24 * 90 * 1000;

      if (new Date(end_time).getTime() - now_ts < the_ts) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    // this.handleAxios()
    Store.dispatch("UserCenter/handleDyglAxios", { page: 1, pageSize: 10 });
    Store.dispatch("UserCenter/handleAccountAxios");
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "会员中心"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "会员中心"]);
    }, 1000);
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
.la-mc {
  .header {
    width: 100%;
    height: 300px;
    background: url("/static/imgs/usercenter/head-bg.jpg");
    color: #fff;
    padding-bottom: 40px;
    box-sizing: border-box;
    position: relative;
    .header-main {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .photo {
        width: 92px;
        height: 92px;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 46px;
        box-shadow: 0px 10px 10px 0px #3a445d;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        font-size: 21px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .power {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        height: 16px;
        line-height: 16px;

        > span:nth-child(2) {
          margin: 0 10px;
        }
        > span:nth-child(3) {
          padding: 2px 10px;
          border-radius: 10px;
          background: @Green;
          cursor: pointer;
        }
      }
    }
    .header-nav {
      width: 100%;
      height: 40px;
      // line-height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0px;
      left: 0px;
      .nav-item {
        color: #fff;
        text-decoration: none;
        font-size: 14px;
        margin: 2px 30px;
        padding: 5px 1px;
        position: relative;
        box-sizing: border-box;
        font-size: 14px;
        display: flex;
        align-items: center;

        .nav-icon {
          margin-right: 5px;
        }
        &.router-link-active {
          &:hover {
            &::after {
              border-radius: 2px;
            }
          }
        }
        &::after {
          content: "";
          display: inline-block;
          width: 100%;
          height: 3px;
          background: #fff;
          border-radius: 2px;
          position: absolute;
          bottom: -10px;
          left: 0px;
        }
        &:hover {
          &::after {
            bottom: -4px !important;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
            transition: all 300ms;
          }
        }
        .iconfont {
          display: inline-block;
          margin-right: 4px;
        }
        .nav-name {
          position: relative;
          height: 16px;
          line-height: 16px;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          .nav-num {
            position: absolute;
            top: -8px;
            left: 70px;
            // padding: 2px 2px;
            box-sizing: border-box;
            display: inline-block;
            min-width: 16px;
            height: 16px;
            line-height: 16px;
            color: #fff;
            font-size: 11px;
            background: #f77b52;
            border-radius: 8px;
            text-align: center;
          }
        }

        &.router-link-active {
          &::after {
            bottom: -6px !important;
          }
        }
      }
    }
  }
  .mc-view {
    display: flex;
    justify-content: center;
    background: #fff;
    min-height: calc(100vh - 48px - 300px);
  }
  /* 会员中心 - 公共样式 start */
  .mc {
    width: 1200px;
    min-height: 320px;
    box-sizing: border-box;
    margin-top: 35px;
    min-height: 320px;
    .left-nav {
      float: left;
      width: 180px;
      font-weight: bold;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      a {
        text-decoration: none;
      }
      .nav-main-lan {
        height: 30px;
        line-height: 30px;
        padding-left: 24px;
        color: @PrimaryColor;
        border-left: 2px solid @PrimaryColor!important;
        transition: all 300ms;
        margin-bottom: 20px;
        &:hover {
          border-left: 6px solid @PrimaryColor!important;
          padding-left: 20px !important;
          transition: all 200ms;
        }
      }
      .nav-lan {
        font-size: 13px;
        height: 30px;
        line-height: 30px;
        padding-left: 38px;
        border-left: 2px solid @BorderColor!important;
        transition: all 300ms;
        &:hover {
          border-left: 6px solid @BorderColor!important;
          padding-left: 34px !important;
          transition: all 200ms;
        }
        &.nav-lan-active {
          color: @PrimaryColor!important;
        }
      }
      .yaozh-down {
        img {
          width: 136px;
        }
      }
    }
    .right-view {
      float: right;
      width: 1020px;
      .section {
        .head {
          width: 100%;
          height: 30px;
          line-height: 30px;
          margin-bottom: 20px;
          .title {
            float: left;
            padding: 0px;
            color: @PrimaryColor;
            font-size: 14px;
            font-weight: bold;
            height: 30px;
            line-height: 30px;
            display: flex;
            align-items: center;
            a{
              color: @PrimaryColor;
              display: flex;
              align-items: center;

              &:hover{
                text-decoration: none;
              }
            }
            .iconfont {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  /* 会员中心 - 公共样式 end */
}
</style>
