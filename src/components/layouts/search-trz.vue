<template>
  <section class="main-search-trz">
    <form onSubmit="return false" class="c-search-form">
      <div class="comprehensive-check">
        <div
          class="check-item"
          v-for="(item, index) in arr"
          :key="index"
          @click="handleCategoryClick(item.type, index, item.ga)"
          :class="{ active: item.key === curSelectType }"
          :searchCategory="item.key"
        >
          <label class="label">{{ item.type }}</label>
        </div>
      </div>
      <inputPopover :value="keywords">
        <div class="c-search-input">
          <el-input
            id="search-input"
            placeholder="请输入"
            v-model="keywords"
            ref="scInput"
            :autofocus="true"
            @keyup.enter.native="search(trimKeyword)"
            @input="autoInput(keywords)"
            @focus="handleHomeSearchInputFocus(trimKeyword, keywords)"
            @blur="handleHomeSearchInputBlur()"
          ></el-input>
          <a id="main-serach-btn" class="button"></a>
          <div id="main-serach" class="sc-btn" @click="search(trimKeyword)">
            <div class="search-btn">搜索</div>
          </div>
          <!-- 历史搜索提示下拉框 -->
          <!-- <div
            class="xiala-history"
            id="xiala-history"
            v-if="history_keys.length && showWhat == 1"
          >
            <a
              href="javascript:void(0)"
              :title="key"
              class="one-history"
              @click="gaPush(key, '3')"
              v-for="(key, index) in history_keys"
              :key="index"
            >
              <span>{{ key }}</span>
              <i class="el-icon-close" @click.stop="deleteTheHistory(key)"></i>
            </a>
            <div class="delete-all" @click="deleteAllHistory()">
              <i class="el-icon-delete"></i>
              <span>清空历史搜索</span>
            </div>
          </div> -->
          <!-- 输入提示下拉框 -->
          <!-- <div
            class="xiala-input"
            id="xiala-input"
            v-if="input_keys.length && showWhat == 2"
          >
            <a
              href="javascript:void(0)"
              :title="key"
              @click="gaPush(key, '1')"
              class="one-input"
              v-for="(key, index) in input_keys"
              :key="index"
            >
              <span>{{ key }}</span>
            </a>
          </div> -->
        </div>
      </inputPopover>
      <!-- 热门搜索 -->
      <div class="hot" v-if="hot_keys && hot_keys.length">
        <span style="color: #b5c3d3;padding-right: 0;">热门搜索：</span>
        <span
          @click="hotSearch(item)"
          v-for="(item, index) in hot_keys"
          :key="index"
        >
          {{ item }}
        </span>
      </div>
    </form>
  </section>
</template>

<script>
import inputPopover from "@/components/inputs/input-popover";
import { mapState } from "vuex";
export default {
  name: "mianSearch",
  data() {
    return {
      curIndex: -1,
      arr: [
        {
          type: "全部",
          key: "tourongzi_all",
          ga: "all"
        },
        {
          type: "投融资事件",
          key: "tourongzi",
          ga: "tourongzi"
        },
        {
          type: "融资企业",
          key: "qiyedetails",
          ga: "qiye"
        },
        {
          type: "投资机构",
          key: "jigoudetails",
          ga: "jigou"
        },
        {
          type: "新闻动态",
          key: "news",
          ga: "news"
        }
      ],
      curSelectType: "tourongzi_all",
      historyFlag: false,
      comprehensive: "",
      hot_keys: [],
      history_keys: [],
      input_keys: [],
      showWhat: 0,
      router: {
        tourongzi: "rongzi", // 投融资事件
        qiyedetails: "qiye", // 融资企业
        jigoudetails: "jigou", // 投资机构
        news: "news" // 新闻动态
      },
      keywords: ""
    };
  },
  components: {
    inputPopover
  },
  computed: {
    // 去除keyword的前后空格和<>左右尖括号
    trimKeyword() {
      return $.trim(this.keywords);
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === "/trz/home") {
        this.$nextTick(() => {});
        this.$refs.scInput.$el.querySelector("input").focus();
      }
    }
  },
  methods: {
    // 热门搜索
    hotSearch(item) {
      // 点击全部分类下的热门搜索，才会跳转到综合搜索结果页
      if (this.curSelectType == "tourongzi_all") {
        this.$router.push({
          path: "/trz/comprehensiveSearch",
          query: {
            keywords: item
          }
        });
      } else {
        // 点击其他分类下的热门搜索，就会跳转到对应的数据库列表，带关键词检索
        let routeData = this.$router.resolve({
          path: `/trz/${this.router[this.curSelectType]}`,
          query: {
            keywords: item
          }
        });
        window.open(routeData.href, "_blank");
      }
    },
    // 搜索按钮
    search(trimKeyword) {
      if (trimKeyword.trim() != "") {
        // 只有全部分类下输入关键词进行搜索，才会跳转到综合搜索结果页
        if (this.curSelectType == "tourongzi_all") {
          this.$router.push({
            path: "/trz/comprehensiveSearch",
            query: {
              keywords: this.filterSerchText(trimKeyword)
            }
          });
        } else {
          // 切换到其他的分类下进行搜索
          let query = {
            keywords: this.filterSerchText(trimKeyword)
          };
          if (this.curSelectType == "qiyedetails")
            query = {
              keywords: this.filterSerchText(trimKeyword)
            };
          console.log(this.curSelectType);
          this.vueSetCookie(
            `from_${this.curSelectType}_home`,
            this.filterSerchText(trimKeyword)
          );
          // 切换到其他的分类下进行搜索，或者点击其他分类下的热门搜索，就会跳转到对应的数据库列表，带关键词检索
          let routeData = this.$router.resolve({
            path: `/trz/${this.router[this.curSelectType]}`,
            query
          });
          window.open(routeData.href, "_blank");
        }
      }
    },
    autoInput(key) {
      key = key.trim(); // 前后去空
      // 输入的内容大于等于2或者不存在左右尖括号的时候才进行搜索提示
      if (key.length >= 2 && key.indexOf("<") == -1 && key.indexOf(">") == -1) {
        this.showWhat = 2;
        window
          .Axios({
            method: "get",
            url: "/api/search/input",
            params: _.assign(
              {
                // accesstoken: this.vueGetCookie("accesstoken"), // 输入提示无需accesstoken
              },
              _.set({}, this.curSelectType, key)
            )
          })
          .then(res => {
            if ((res.data.code = 200 && res.data.data)) {
              let data = res.data.data;
              this.input_keys = data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.showWhat = 0;
      }
    },
    // 对应获取热门搜索数据
    getHotKeys() {
      window
        .Axios({
          method: "get",
          url: "/api/search/hot",
          params: {
            // accesstoken: this.vueGetCookie("accesstoken"), // 热门搜索无需accesstoken
            type: this.curSelectType
          }
        })
        .then(res => {
          if ((res.data.code = 200 && res.data.data)) {
            let data = res.data.data;
            this.hot_keys = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCategoryClick(val, index, ga) {
      console.log(ga);
      window.ga("send", "event", "button", "click", `viptrz_home_search_${ga}`);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `viptrz_home_search_${ga}`
      ]);
      this.curSelectType = this.arr[index].key;

      this.$store.commit("TrzHome/sendComprehensive", val);
      // 改变热门搜索部分
      this.getHotKeys();
    },
    gaPush(key, source) {
      window.ga("send", "event", "button", "click", "vip_zhss_tishi1");
      window._paq.push(["trackEvent", "button", "click", "vip_zhss_tishi1"]);

      this.$router.push({
        path: "/search",
        query: {
          comprehensive: this.curSelectType,
          keywords: $.trim(this.filterSerchText(key)),
          source
        }
      });
    },
    handleHomeSearchInputFocus(trimKeyword, keywords) {
      $(".c-search-input").addClass("on-focus");
      if (String(trimKeyword).length) {
        this.autoInput(keywords);
      } else {
        // if (this.historyFlag) {
        //   this.getHistoryKeys();
        // }
        // this.historyFlag = true;
      }
    },
    handleHomeSearchInputBlur() {
      $(".c-search-input").removeClass("on-focus");
    },
    // 过滤输入框HTML标签 例如：1、阿莫<br>西林=阿莫西林 2、阿莫<br西林=阿莫 3、阿莫br>西林=西林
    filterSerchText(str) {
      // 过滤<...>
      let str1 = str.replace(/<.*?>/g, "");
      let index = str1.lastIndexOf("<");
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
    }
  },
  created() {
    this.getHotKeys();
  },
  mounted() {
    // this.handleCategoryClick(this.arr[0], 0);
    // 处理点击目标dom外的显示与隐藏
    let _that = this;
    $(document).click(e => {
      let ele = e ? e.target : window.event.srcElement;
      if (
        ele.id != "search-input" &&
        ele.id != "xiala-history" &&
        ele.id != "xiala-input" &&
        !$(ele).parents("#xiala-history").length
      ) {
        _that.showWhat = 0;
      }
    });
    //鼠标移出下拉框隐藏
    $("body").on("mouseleave", "#xiala-input,#xiala-history", () => {
      this.$nextTick(() => {
        this.showWhat = 0;
        $("#search-input").blur();
      });
    });

    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scInput.$el.querySelector("input").focus();
      }, 500);
    });
  }
};
</script>
<style lang="less">
@import "~@/assets/less/var.less";
// @HomeSearchInputBoxShadow: 0px 0px 3px 0px rgba(196, 211, 248, 0.6862745098039216);
@HomeSearchInputBoxShadow: 0px 0px 2px 0px #35384a;
// @HomeSearchInputBoxShadowHover: 0px 0px 6px 1px rgba(196, 211, 248, 0.6862745098039216);
@HomeSearchInputBoxShadowHover: 0px 0px 5px 1px @BorderColor;

@Selected: #e7af2f;
@inputWidth: 560px;
.hide {
  display: none;
}
.main-search-trz {
  padding-top: 70px;

  .c-search-form {
    width: @inputWidth;
    margin: 0 auto;
  }
  .comprehensive-check {
    padding: 70px 0px 16px 0px;
    color: #fff;
    display: flex;
    justify-content: center;
    .check-item {
      font-size: 14px;

      font-weight: 400;
      color: #ffffff;
      height: 20px;
      line-height: 20px;
      &:not(:last-child) {
        margin-right: 25px;
      }
      input {
        display: none;
      }
      .label {
        cursor: pointer;
        &.active,
        &:hover {
          color: @Selected;
        }
      }
    }
    .active {
      label {
        color: @Selected !important;
      }
    }
  }
  .c-search-input {
    position: relative;
    box-sizing: border-box;
    // border: 1px solid @BorderColor;
    transition: all 500ms;
    width: @inputWidth;
    height: 40px;
    line-height: 40px;
    background: rgba(181, 195, 211, 0.3);
    border-radius: 20px;
    display: flex;
    align-items: center;

    .search-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 22px;
      font-size: 16px;
      font-weight: 400;
      color: #0d1d39;
      width: 77px;
      height: 40px;
      background: #e7af2f;
      border-radius: 0 20px 20px 0;
      cursor: pointer;
    }

    &:hover {
      transition: all 500ms;
    }
    .el-icon-search {
      z-index: 101;
      font-size: 16px;
    }
    #main-serach-btn {
      text-decoration: none;
      position: absolute;
      top: 10px;
      left: 12px;
      font-size: 22px;
      color: #fff;
      font-weight: bold;
      width: 22px;
      height: 22px;
      transition: all 300ms;
      transform: scale(1) rotate(0deg);
      background: url("~@/assets/imgs/trz/search-trz.png") no-repeat center;
      background-size: 20px 20px;
      // &:hover {
      //   transition: all 300ms;
      //   transform: scale(1) rotate(90deg);
      // }
    }
    .el-input {
      z-index: 10;
      font-size: 14px;
    }
    #search-input {
      box-sizing: border-box;
      height: 20px;
      line-height: 20px;
      padding-left: 40px;
      padding-right: 50px;
      background: none;
      border: none;
      font-family: "iconfont";
      justify-content: center;
      width: 98%;
      color: #fff;

      /* - Chrome ≤56,
   - Safari 5-10.0
   - iOS Safari 4.2-10.2
   - Opera 15-43
   - Opera Mobile >12
   - Android Browser 2.1-4.4.4
   - Samsung Internet
   - UC Browser for Android
   - QQ Browser */
      &::-webkit-input-placeholder {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.3);
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
      }

      /* Firefox 4-18 */
      &:-moz-placeholder {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.3);
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
      }

      /* Firefox 19-50 */
      &::-moz-placeholder {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.3);
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
      }

      /* - Internet Explorer 10–11
   - Internet Explorer Mobile 10-11 */
      &:-ms-input-placeholder {
        height: 20px !important;
        line-height: 20px !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        color: #fff !important;
        font-family: PingFangSC-Regular, PingFang SC !important;
        -ms-user-select: none !important; /* IE 10+ and Edge */
      }

      /* Edge (also supports ::-webkit-input-placeholder) */
      &::-ms-input-placeholder {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.3);
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
      }

      /* CSS Working Draft */
      &::placeholder {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.3);
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10+ and Edge */
        user-select: none; /* Standard syntax */
      }
    }

    .iconfont {
      font-family: "iconfont";
    }
    .el-button {
      z-index: 10;
    }
    .xiala-history {
      z-index: 8;
      position: absolute;
      width: 100%;
      padding: 27px 0px 10px 0px;
      background-color: #fff;
      box-shadow: @HomeSearchInputBoxShadowHover;
      top: 14px;
      left: 0px;
      border-radius: 0 0 4px 4px;
      // &::after {
      //   content: "";
      //   height: 1px;
      //   width: 590px;
      //   background-color: #ccc;
      //   position: absolute;
      //   top: 14px;
      //   left: 15px;
      // }
      .el-icon-close {
        transition: all 300ms;
        transform: scale(1);
        &:hover {
          transition: all 300ms;
          transform: scale(1.5);
        }
      }
      .one-history {
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        line-height: 32px;
        color: @PrimaryColor;
        font-size: 14px;
        padding-left: 24px;
        padding-right: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-decoration: none;
        & > span {
          display: inline-block;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:first-of-type {
          position: relative;
          &::before {
            content: "";
            height: 1px;
            width: 590px;
            background-color: #ccc;
            position: absolute;
            top: 0px;
            left: 15px;
          }
        }
        i {
          color: #333;
          font-size: 9px;
          font-weight: bolder;
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
        width: 100%;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: bold;
        padding-left: 24px;
        padding-right: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-decoration: none;
        transition: all 300ms;
        span {
          transition: all 300ms;
          cursor: pointer;
          position: absolute;
          top: 0;
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
    .xiala-input {
      z-index: 9;
      position: absolute;
      width: 100%;
      padding: 27px 0px 10px 0px;
      background-color: #fff;
      box-shadow: @BoxShadow;
      top: 14px;
      left: 0px;
      border-radius: 0 0 4px 4px;
      // &::after {
      //   content: "";
      //   height: 1px;
      //   width: 590px;
      //   background-color: #ccc;
      //   position: absolute;
      //   top: 14px;
      //   left: 15px;
      // }
      .one-input {
        overflow: hidden;
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        padding-left: 24px;
        padding-right: 20px;
        text-decoration: none;
        & > span {
          display: inline-block;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:first-of-type {
          position: relative;
          &::before {
            content: "";
            height: 1px;
            width: 590px;
            background-color: #ccc;
            position: absolute;
            top: 0px;
            left: 15px;
          }
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
  .el-input--prefix {
    display: inline-block;
    width: 89.2%;
  }
  // .el-input__inner{
  //   box-sizing: border-box;
  //   height: 40px;
  //   padding-left: 25px;
  //   padding-right: 50px;
  //   border-radius: 20px;
  //   border-color: Lighten(@PrimaryColor, 10%);
  //   border-width: 1px;
  //   font-family: 'iconfont';
  //   &:focus {
  //     border-color: @PrimaryColor;
  //   }
  // }
  .el-input__icon {
    font-size: 26px;
  }
  .el-input__clear {
    font-size: 18px;
    padding-right: 50px;
  }
  .el-input__prefix {
    left: 30px;
  }
  .hot {
    margin-top: 10px;
    color: #b5c3d3;
    display: flex;
    justify-content: center;
    white-space: nowrap;
    line-height: 20px;
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;
    color: #fff;
    span {
      text-decoration: none;
      color: #fff;
      cursor: pointer;
      &:not(:last-child) {
        padding-right: 16px;
      }

      &:hover {
        color: @Selected;
      }
    }
  }
}
</style>
