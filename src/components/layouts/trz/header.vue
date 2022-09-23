<template>
  <div class="header-trz" ref="header-trz">
    <div class="header-content">
      <div class="logo">
        <img src="~@/assets/imgs/trz/logo.png" @click="linkTo('/home')" />
      </div>
      <div class="menu">
        <router-link tag="span" to="/trz/home" active-class="active" exact @click.native="handleClick('home')">首页
        </router-link>
        <span>
          <div class="title">
            找投资
            <img src="~@/assets/imgs/trz/dropdown-icon.png" class="arrow" />
          </div>
          <div class="menu-items fadeInUp">
            <router-link tag="span" to="/trz/jigou" active-class="submenu-active" class="menu-item" exact
              @click.native="handleClick('jigou')">投资机构</router-link>
          </div>
        </span>
        <span>
          <div class="title">
            寻项目
            <img src="~@/assets/imgs/trz/dropdown-icon.png" class="arrow" />
          </div>
          <div class="menu-items fadeInUp">
            <router-link tag="span" to="/trz/rongzi" active-class="submenu-active" class="menu-item" exact
              @click.native="handleClick('rongzi')">投融资事件</router-link>
            <img src="~@/assets/imgs/trz/menu-line.png" class="menu-line" />
            <router-link tag="span" to="/trz/binggou" active-class="submenu-active" class="menu-item" exact
              @click.native="handleClick('binggou')">并购事件</router-link>
            <img src="~@/assets/imgs/trz/menu-line.png" class="menu-line" />
            <router-link tag="span" to="/trz/kuajing" active-class="submenu-active" class="menu-item" exact
              @click.native="handleClick('kuajing')">医药交易</router-link>
          </div>
        </span>
        <span>
          <div class="title">
            看企业
            <img src="~@/assets/imgs/trz/dropdown-icon.png" class="arrow" />
          </div>
          <div class="menu-items fadeInUp">
            <router-link tag="span" to="/trz/qiye" active-class="submenu-active" class="menu-item" exact
              @click.native="handleClick('qiye')">融资企业</router-link>
          </div>
        </span>
        <router-link tag="span" to="/trz/news" active-class="active" exact @click.native="handleClick('news')">新闻动态
        </router-link>
        <span>
          <div class="title">
            数据分析
            <img src="~@/assets/imgs/trz/dropdown-icon.png" class="arrow" />
          </div>
          <div class="menu-items fadeInUp">
            <router-link tag="a" to="/trz/report" active-class="submenu-active" class="menu-item" target="_blank" exact
              @click.native="handleClick('report')">投融资分析报告</router-link>
            <img src="~@/assets/imgs/trz/menu-line.png" class="menu-line" />
            <router-link tag="a" to="/trz/map?map=rongzi" active-class="submenu-active" class="menu-item"
              target="_blank" exact @click.native="handleClick('rongzimap')">投融资地图</router-link>
            <img src="~@/assets/imgs/trz/menu-line.png" class="menu-line" />
            <router-link tag="a" to="/trz/map?map=binggou" active-class="submenu-active" class="menu-item"
              target="_blank" exact @click.native="handleClick('binggoumap')">并购地图</router-link>
            <!-- <img src="~@/assets/imgs/trz/menu-line.png" class="menu-line" />
            <router-link
              tag="a"
              to="/trz/industry"
              active-class="submenu-active"
              class="menu-item"
              exact
              >医药产业链</router-link
            > -->
          </div>
        </span>
      </div>
      <div class="userinfo">
        <!-- 顶部综合搜索栏 -->
        <div v-if="!['/trz/home', '/trz/report', '/trz/map'].includes($route.path)" class="search-form-box">
          <form class="c-search-form" @submit.prevent="onSubmit">
            <!-- :placeholder="$t('cSearch.searchCategorys.'+searchCategory+'.ph')" -->
            <inputPopover :value="searchwords">
              <el-input id="header-search-input" class="searchwords" v-model="searchwords"
                @keydown.enter.native.prevent="handleSearchClick"></el-input>
            </inputPopover>
            <a id="header-search-btn" class="el-icon-search header-search-btn" @click="handleSearchClick"></a>
            <router-link id="header-search" tag="button" :to="{
              path: '/trz/comprehensiveSearch',
              query: {
                keywords: filterSerchText(trimKeyword)
              }
            }" type="primary" native-type="submit" style="display: none">{{ $t("cSearch.common.search") }}
            </router-link>
          </form>
          <!-- <button class="save-express fs-small" @click="handleSaveExpress"><i class="icon">&#xe615;</i> {{ $t("common.save_express") }}</button> -->
        </div>
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

export default {
  components: {
    inputPopover
  },
  name: "trz-header",
  data() {
    return {
      searchCategorys: [
        "drug",
        "targets",
        "company",
        "devices",
        "disease",
        "chinesemedicine"
      ]
    };
  },
  mounted() {
    $(".submenu-active")
      .parent()
      .parent()
      .addClass("active")
      .siblings()
      .removeClass("active");
    if (this.$route.name == "database_trz_index") {
      $(".header-trz").addClass("transparent");
      $(".header-trz").addClass("home-head");
      window.addEventListener("scroll", this.handleScrolls, true);
    }
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleScrolls);
  },
  computed: {
    ...mapState({
      accountData: state => state.UserCenter.accountData
    }),
    trimKeyword() {
      return $.trim(this.searchwords);
    },
    searchCategory: {
      get() {
        return this.$store.state.Search.comprehensive;
      },
      set(val) {
        this.$store.commit("Search/sendComprehensive", val);
      }
    },
    searchwords: {
      get() {
        return this.$store.state.TrzHome.keywords;
      },
      set(val) {
        this.$store.commit("TrzHome/sendKeywords", val);
      }
    }
  },
  methods: {
    handleSearchClick() {
      if (Boolean(this.searchwords)) {
        Store.commit(
          "TrzHome/sendKeywords",
          $.trim(this.filterSerchText(this.searchwords))
        );
        $("#header-search").click();
      }
    },
    // 过滤输入框HTML标签 例如：1、阿莫<br>西林=阿莫西林 2、阿莫<br西林=阿莫 3、阿莫br>西林=西林
    filterSerchText(str) {
      // 过滤<...>
      let str1 = str.replace(/<.*?>/g, "");
      let index = str1.indexOf("<");
      let index1 = str1.lastIndexOf(">");
      // 过滤<及其右边的
      let str2;
      // 过滤>及其左边的
      let str3;
      // 过滤<及其右边的，去掉>及其左边的
      let str4;
      if (index > -1 || index1 > -1) {
        if (index > -1 && index1 === -1) {
          str2 = str1.substring(0, index);
          console.log("str2=" + str2);
          return str2;
        } else if (index === -1 && index1 > 1) {
          str3 = str1.substring(index1 + 1, str1.length);
          console.log("str3=" + str3);
          return str3;
        } else {
          str2 = str1.substring(0, index);
          str4 = str2.substring(index1 + 1, str2.length);
          console.log("str4=" + str4);
          return str4;
        }
      } else {
        console.log("str1=" + str1);
        return str1;
      }
    },
    searchChange() {
      this.searchwords = "";
      this.showWhat = 0;
    },
    linkTo(path) {
      if (path != this.$route.path)
        this.$router.push({
          path
        });
    },
    handleScrolls() {
      if (this.$route.name == "database_trz_index") {
        let top = document.querySelector(".la-app-main.la-app-main-nomenu-noheader").scrollTop;
        if (top > $(".header-trz").height()) {
          $(".header-trz").removeClass("transparent");
        } else {
          $(".header-trz").addClass("transparent");
        }
      }
    },

    handleClick(val) {
      console.log(`viptrz_${val}`);
      window.ga("send", "event", "button", "click", `viptrz_${val}`);
      window._paq.push(["trackEvent", "button", "click", `viptrz_${val}`]);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.header-trz {
  height: 48px;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  min-width: 1200px;
  z-index: 999;
  background: rgb(9, 20, 79);
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

  &.home-head {
    height: 64px;

    .header-content {
      width: 1200px;
    }
  }

  &.transparent {
    background: transparent;
  }

  .fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }

  &.home-head {
    height: 64px;

    .header-content {
      width: 1200px;
    }
  }

  &.transparent {
    background: transparent;
  }

  .header-content {
    height: 44px;
    width: 100%;
    min-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    position: relative;

    .logo {
      display: flex;
      align-items: center;
      margin-right: 90px;

      img {
        width: 143px;
        height: 34px;

        &:hover {
          cursor: pointer;
        }
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

      &> :not(:last-child) {
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

      span:hover>.title>.arrow {
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

        .comprehensive {
          position: absolute;
          left: 0px;
          top: 0px;
          z-index: 2013;
          width: 76px;
          height: 26px;
          background-color: transparent;
          font-size: 13px;

          .el-input__inner {
            height: 26px;
            // padding: 10px 15px 10px 10px;
            padding: 0 15px 0 6px;
            border: 0px;
            border-radius: 4px;
            z-index: 2013;
          }

          .el-input__suffix {
            .el-select__caret {
              color: black;
            }

            .el-input__inner {
              color: black;
            }
          }
        }

        .searchwords {
          box-sizing: border-box;
          width: 100%;
          // border: 1px solid @PrimaryColor;
          border-radius: 15px;

          input {
            height: 26px;
            border: 0px;
            padding-left: 77px;
            padding-right: 45px;
            border-radius: 4px;
          }
        }

        .header-search-btn {
          text-decoration: none;
          position: absolute;
          right: 6px;
          top: 4px;
          font-size: 16px;
          color: @PrimaryColor;
          border-radius: 50%;
          font-weight: bold;
          transition: all 300ms;
          transform: scale(1) rotate(0deg);
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

            &>span {
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

            &>span {
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
}
</style>
