<template>
  <div class="menu">
    <div
      class="nav-item"
      v-for="(item, index) in navs"
      :key="index"
      :class="{ active: item === nowNav }"
      @click="navToContent(item, index)"
    >
      {{ item }}
    </div>
    <!-- <div class="yyxs-btn" @click="GoYyxsBtn">
      <span>医院销售数据放大测试版</span><span class="icon iconfont">&#xe67d;</span>
    </div> -->
    <div>
      <!-- <div class="yyxs-btn" :class="{'yyxs-abandon-click-method nopms-btn': isFangDa === false }" @click="GoYyxsFdcsBtn">
        <span @click="GoYyxsFdcsBtn">医院销售数据放大测试版</span><span class="icon iconfont">&#xe67d;</span>
      </div> -->
      <div class="yyxs-btn" @click="GoYyxsBtn">
        <span>医院销售数据挖掘系统</span>
        <span class="icon iconfont">&#xe67d;</span>
      </div>
    </div>
    <!-- <div v-else-if="$route.query.type_id == 2" class="yyxs-btn" @click="back">
      <span>医院销售数据库</span><span class="icon iconfont">&#xe67d;</span>
    </div> -->
    <!--
      暂时不加
    <div class="yyxs-img-btn" @click="GoYyxsImgBtn">
      <img src="~@/assets/imgs/yyxs/goyyxs.gif" />
    </div>
    -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    navs: {
      type: Array,
    },
    nowNav: {
      type: String,
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.UserCenter.userInfo,
      isFangDa: (state) => state.UserCenter.isFangDa,
      no_rules: (state) => state.Yyxs.norules,
    }),
  },
  watch: {
    no_rules(newVal) {
      let flag = newVal.exclusive.every(
        (item) => item.action !== "yyxsdlfxenlarged_test"
      );
      if (newVal.exclusive.length == 0) {
        flag = true;
      }
      console.log(flag);
      Store.commit("UserCenter/isFangDa", flag);
    },
  },
  methods: {
    GoYyxsImgBtn() {
      window.ga(
        "send",
        "event",
        "img",
        "click",
        "yyxsdata_sidebarnav_yyxslist"
      );
      window._paq.push([
        "trackEvent",
        "img",
        "click",
        "yyxsdata_sidebarnav_yyxslist",
      ]);

      window.open("/yyxs/list?ga_source=vip&ga_name=yyxsdata_xiaozhigif");
    },
    GoYyxsBtn() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "yyxsdata_sidebarnav_yyxslist"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "yyxsdata_sidebarnav_yyxslist",
      ]);

      window.open("/yyxs/list?ga_source=vip&ga_name=yyxsdata_siderbar");
    },
    // 返回医院销售数据库
    back() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "yyxsdata_sidebarnav_yyxslist"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "yyxsdata_sidebarnav_yyxslist",
      ]);

      location.href = "/yyxsdata";
    },
    // 切换到放大测试版
    GoYyxsFdcsBtn() {
      if (this.isFangDa == false) return;
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "yyxsdata_sidebarnav_enlarged_test_version"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "yyxsdata_sidebarnav_enlarged_test_version",
      ]);
      location.href = "/yyxsdata?type_id=2";
    },
    navToContent(name, index) {
      // 点击导航条类目，左右对应的激活情况改变
      this.$emit("changeNowNav", name);
    },
    getUserInfo() {
      window
        .Axios({
          method: "get",
          url: "/api/usercenter/userinfo",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            Store.commit("UserCenter/userInfo", data);
            Store.commit("UserCenter/isFangDa", data.type_id == 2);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    if (this.$route.query.type_id == 2) {
      this.getUserInfo();
    }
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.menu {
  .nav-item {
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 180px;
    height: 40px;
    border-radius: 4px;
    padding-left: 18px;
    margin-left: 0px;
    border-bottom: 1px solid @BorderColor;
    cursor: pointer;
    box-sizing: border-box; // 若不是border-box，则需要改变宽度
    font-size: 14px;
    &:hover {
      transition: all 500ms;
      margin-left: 0px;
      display: flex;
      width: 180px;
      height: 40px;
      background: #ffffff;
      border-radius: 4px;
      padding-left: 18px;
      position: relative;
      background: #fff;
      border-bottom: none;
      color: @PrimaryColor;
      // box-shadow: @BoxShadow;
      &::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 40px;
        background: @PrimaryColor;
      }
    }
  }
  // 导航选项 - active
  .active {
    margin-left: 0px;
    width: 180px;
    padding-left: 18px;
    position: relative;
    background: #fff;
    border-bottom: none;
    color: @PrimaryColor;
    box-shadow: @BoxShadow;
    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 40px;
      background: @PrimaryColor;
    }
  }
  .yyxs-btn {
    background: @PrimaryColor;
    color: #fff;
    font-size: 14px;
    margin: 28px 0 0 0;
    height: 30px;
    line-height: 29px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: #6d92ed;
      border-color: #6d92ed;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
    .icon {
      font-size: 16px;
      margin-left: 3px;
    }
  }
  .yyxs-img-btn {
    position: fixed;
    bottom: -10px;
    left: 51px;
    cursor: pointer;
  }
  .nopms-btn {
    color: #fff !important;
    background: #97a2bf !important;
    border: none;
  }
}
</style>
