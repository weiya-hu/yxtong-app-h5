<template>
  <section class="main-search">
    <form class="c-search-form">
      <div class="comprehensive-check">
        <div class="check-item" v-for="(sc, index) in searchCategorys" :key="index" @click="handleCategoryClick(sc)"
          :class="{ 'active': sc === searchCategory }" :searchCategory="sc">
          <input type="radio" name="cats">
          <label class="label">
            {{ $t("cSearch.searchCategorys." + sc + ".label") }}
          </label>
        </div>
      </div>
      <inputPopover :value="searchwords">
        <div class="c-search-input">
          <el-input id="search-input" :placeholder="$t('cSearch.searchCategorys.' + searchCategory + '.ph')"
            v-model="searchwords" ref="scInput" :autofocus="true" @keydown.enter.native.prevent="handleSearchClick"
            @input="autoInput(searchwords)" @focus="handleHomeSearchInputFocus(trimKeyword, searchwords)"
            @blur="handleHomeSearchInputBlur()" clearable></el-input>
          <a id="main-serach-btn" class="el-icon-search button" @click="handleSearchClick"></a>
          <router-link tag="span" id="main-serach" class="sc-btn" style="display: none"
            :to="{ path: '/search', query: { comprehensive: searchCategory, searchwords: filterSerchText(trimKeyword), source: '1' } }">
            <el-button type="primary" round>搜&nbsp;&nbsp;索</el-button>
          </router-link>
          <!-- 历史搜索提示下拉框 -->
          <div class="xiala-history" id="xiala-history" v-if="history_keys.length && showWhat == 1">
            <!-- 历史搜索 -->
            <a href="javascript:void(0)" :title="key" class="one-history" @click="gaPush(key, '3')"
              v-for="(key, index) in history_keys" :key="index">
              <span>{{ key }}</span>
              <i class="el-icon-close" @click.stop="deleteTheHistory(key)"></i>
            </a>
            <!-- 清空历史搜索 -->
            <div class="delete-all" @click="deleteAllHistory()">
              <i class="el-icon-delete"></i>
              <span>清空历史搜索</span>
            </div>
          </div>
          <!-- 输入提示下拉框 -->
          <div class="xiala-input" id="xiala-input" v-if="input_keys.length && showWhat == 2">
            <!-- 输入提示 -->
            <a href="javascript:void(0)" :title="key" @click="gaPush(key, '1')" class="one-input"
              v-for="(key, index) in input_keys" :key="index">
              <span>{{ key }}</span>
            </a>
          </div>
        </div>
      </inputPopover>
      <!-- 热门搜索 -->
      <div class="hot" v-if="hot_keys && hot_keys.length">
        <i class="iconfont" style="color: #ff2d01;">&#xe64d;</i>
        <span>热门搜索：</span>
        <router-link :to="{ path: '/search', query: { comprehensive: searchCategory, searchwords: key, source: '2' } }"
          v-for="(key, index) in hot_keys" :key="index">
          {{ key }}
        </router-link>
      </div>
    </form>
  </section>
</template>

<script>
import inputPopover from '@/components/inputs/input-popover'
import { mapState } from 'vuex'
export default {
  name: 'mianSearch',
  data() {
    return {
      historyFlag: false,
      searchCategorys: ['drug', 'targets', 'company', 'disease', 'chinesemedicine', 'food', 'cosmetics'],
      comprehensive: '',
      hot_keys: [],
      history_keys: [],
      input_keys: [],
      showWhat: 0,
    }
  },
  components: {
    inputPopover
  },
  computed: {
    // 去除keyword的前后空格和<>左右尖括号
    trimKeyword() {
      return $.trim(this.searchwords)
    },
    searchwords: {
      get() {
        return this.$store.state.Search.keywords
      },
      set(val) {
        this.$store.commit('Search/sendKeywords', val)
      }
    },
    ...mapState({
      searchCategory: state => state.Search.comprehensive,
    }),
  },
  watch: {
    $route(to, from) {
      if (to.path === '/home') {
        this.$nextTick(() => { })
        this.$refs.scInput.$el.querySelector('input').focus()
      }
    },
    searchwords() {
      if (!this.searchwords) {
        this.showWhat = 1
      } else if (this.trimKeyword.length >= 2 && (this.trimKeyword.indexOf('<') == -1 && this.trimKeyword.indexOf('>') == -1)) {
        this.showWhat = 2
      } else {
        this.showWhat = 0
      }
    }
  },
  methods: {
    autoInput(key) {
      key = key.trim() // 前后去空
      // 输入的内容大于等于2或者不存在左右尖括号的时候才进行搜索提示
      if (key.length >= 2 && (key.indexOf('<') == -1 && key.indexOf('>') == -1)) {
        this.showWhat = 2
        window.Axios({
          method: 'get',
          url: '/api/search/input',
          params: _.assign({
            // accesstoken: this.vueGetCookie("accesstoken"), // 输入提示无需accesstoken
          }, _.set({}, this.searchCategory, key))
        }).then(res => {
          if (res.data.code = 200 && res.data.data) {
            let data = res.data.data
            this.input_keys = data
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.showWhat = 0
      }
    },
    async deleteTheHistory(key) {
      await window.Axios({
        method: 'get',
        url: '/api/search/delhistory',
        params: _.assign({
          accesstoken: this.vueGetCookie("accesstoken"),
        }, _.set({}, this.searchCategory, key))
      }).then(res => {
        if (res.data.code = 200) {
          // console.log("删除历史搜索")
        }
      }).catch(err => {
        console.log(err)
      })

      this.getHistoryKeys()
    },
    async deleteAllHistory() {
      await window.Axios({
        method: 'get',
        url: '/api/search/delhistory',
        params: _.assign({
          accesstoken: this.vueGetCookie("accesstoken"),
        }, _.set({}, this.searchCategory, ''))
      }).then(res => {
        if (res.data.code = 200) {
          // console.log("删除所有历史搜索")
        }
      }).catch(err => {
        console.log(err)
      })

      this.getHistoryKeys()
    },
    // 对应获取历史搜索数据
    getHistoryKeys() {
      if (!this.searchwords) {
        this.showWhat = 1
      }
      window.Axios({
        method: 'get',
        url: '/api/search/history',
        params: {
          accesstoken: this.vueGetCookie("accesstoken"),
          type: this.searchCategory,
        }
      }).then(res => {
        if (res.data.code = 200 && res.data.data) {
          let data = res.data.data
          this.history_keys = data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 对应获取热门搜索数据
    getHotKeys() {
      window.Axios({
        method: 'get',
        url: '/api/search/hot',
        params: {
          // accesstoken: this.vueGetCookie("accesstoken"), // 热门搜索无需accesstoken
          type: this.searchCategory,
        }
      }).then(res => {
        if (res.data.code = 200 && res.data.data) {
          let data = res.data.data
          this.hot_keys = data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleCategoryClick(val) {
      //切换时清除keywords
      if (val != this.searchCategory) {
        this.searchwords = ''
        this.showWhat = 0
      };

      this.$store.commit('Search/sendComprehensive', val)
      // 改变热门搜索部分
      this.getHotKeys()

    },
    handleSearchClick() {
      if (Boolean(this.searchwords)) {
        Store.commit("Search/sendKeywords", $.trim(this.filterSerchText(this.searchwords)))
        $("#main-serach").click();
      }
    },
    gaPush(key, source) {
      window.ga("send", "event", "button", "click", "vip_zhss_tishi1")
      window._paq.push(['trackEvent', 'button', 'click', "vip_zhss_tishi1",])

      this.$router.push({ path: '/search', query: { comprehensive: this.searchCategory, searchwords: $.trim(this.filterSerchText(key)), source } })
    },
    handleHomeSearchInputFocus(trimKeyword, searchwords) {
      $('.c-search-input').addClass('on-focus')
      if (String(trimKeyword).length) {
        this.autoInput(searchwords)
      } else {
        if (this.historyFlag) {
          this.getHistoryKeys()
        }
        this.historyFlag = true
      }
    },
    handleHomeSearchInputBlur() {
      $('.c-search-input').removeClass('on-focus')
    },

    // 过滤输入框HTML标签 例如：1、阿莫<br>西林=阿莫西林 2、阿莫<br西林=阿莫 3、阿莫br>西林=西林
    filterSerchText(str) {
      // 过滤<...>
      let str1 = str.replace(/<.*?>/g, '')
      let index = str1.lastIndexOf('<')
      let index1 = str1.lastIndexOf('>')
      // 过滤<及其右边的
      let str2
      // 过滤>及其左边的
      let str3
      // 过滤<及其右边的，去掉>及其左边的
      let str4
      if (index > -1 || index1 > -1) {
        if (index > -1 && index1 === -1) {
          str2 = str1.substring(0, index)
          console.log('str2=' + str2)
          return str2
        } else if (index === -1 && index1 > 1) {
          str3 = str1.substring(index1 + 1, str1.length)
          console.log('str3=' + str3)
          return str3
        } else {
          str2 = str1.substring(0, index)
          str4 = str2.substring(index1 + 1, str2.length)
          console.log('str4=' + str4)
          return str4
        }

      } else {
        console.log('str1=' + str1)
        return str1
      }
    }

  },
  created() {
    this.getHotKeys()
  },
  mounted() {
    // 处理点击目标dom外的显示与隐藏
    let _that = this
    $(document).click((e) => {
      let ele = e ? e.target : window.event.srcElement
      if (ele.id != 'search-input' && ele.id != 'xiala-history' && ele.id != 'xiala-input' && !$(ele).parents('#xiala-history').length) {
        _that.showWhat = 0
      }
    })
    //鼠标移出下拉框隐藏
    $("body").on("mouseleave", "#xiala-input,#xiala-history", () => {
      this.$nextTick(() => {
        this.showWhat = 0
        $("#search-input").blur()
      })
    })

    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scInput.$el.querySelector('input').focus()
      }, 500)
    })
  },
}
</script>
<style lang="less">
@import "~@/assets/less/var.less";
// @HomeSearchInputBoxShadow: 0px 0px 3px 0px rgba(196, 211, 248, 0.6862745098039216);
@HomeSearchInputBoxShadow: 0px 0px 2px 0px #35384a;
// @HomeSearchInputBoxShadowHover: 0px 0px 6px 1px rgba(196, 211, 248, 0.6862745098039216);
@HomeSearchInputBoxShadowHover: 0px 0px 5px 1px @BorderColor;
@inputWidth: 640px;

.hide {
  display: none;
}

.main-search {
  background-color: @White;
  box-shadow: @BoxShadow;
  // height: calc(100vh - 64px);
  height: calc(100vh - 49px);

  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  .c-search-form {
    width: @inputWidth;
    margin: 0px auto 0px auto;
    padding-top: 130px;
  }

  .comprehensive-check {
    padding: 70px 0px 14px 0px;
    text-align: center;
    color: @FontColor;
    font-size: 15px;

    .check-item {
      display: inline-block;

      &:not(:last-child) {
        margin-right: 15px;
      }

      input {
        display: none;
      }

      .label {
        cursor: pointer;

        &.active,
        &:hover {
          color: #4877E8;
        }
      }
    }

    .active {
      label {
        color: #4877E8 !important;
      }
    }
  }

  .c-search-input {
    position: relative;
    box-sizing: border-box;
    // border: 1px solid @BorderColor;
    transition: all 500ms;
    width: 640px;
    height: 36px;
    line-height: 36px;
    background: #FFFFFF;
    border: 1px solid #B3BBCC;
    border-radius: 4px;

    &.on-focus {
      transition: all 500ms;
      box-shadow: @BoxShadow;
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
      top: 5px;
      right: 22px;
      font-size: 22px;
      color: @PrimaryColor;
      font-weight: bold;
      width: 22px;
      height: 22px;
      transition: all 300ms;
      transform: scale(1) rotate(0deg);
      // &:hover {
      //   transition: all 300ms;
      //   transform: scale(1) rotate(90deg);
      // }
    }

    .el-input {
      z-index: 10;
    }

    #search-input {
      box-sizing: border-box;
      height: 1;
      line-height: 1;
      padding-left: 22px;
      padding-right: 50px;
      border: none;
      font-family: 'iconfont';
    }

    .iconfont {
      font-family: 'iconfont';
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

        &>span {
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

        &>span {
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
    padding: 20px 0px 20px 0px;
    text-align: center;
    font-size: @FontSizeSmall;
    color: #7b8190;

    a {
      padding-left: 12px;
      color: #7b8190;
    }
  }
}
</style>
