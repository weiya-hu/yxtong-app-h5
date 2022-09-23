<template>
  <div class="la-header-globaldrugs" v-if="path.indexOf('/login') !== 0">
    <transition name="el-fade-in-linear">
      <marquee-kz v-if="noticeMsg.length > 0 && showPromtNotice" :noticeMsg="noticeMsg" @closeNotice="closeNotice">
      </marquee-kz>
    </transition>

    <div style="width: 100%; display: flex; align-items: center">
      <router-link tag="a" class="logo" to="/home">
        <img src="~@/assets/imgs/home-logo.png" />
      </router-link>
      <div :class="$route.path != '/home' ? 'right' : 'right2'">
        <nav class="la-header-nav">
          <div @mouseover="mouseOver" class="header-nav-item" :class="{
            cursor: item.label === '器械',
            'hover-sc': item.shortlabel == '市场' && firstShowTrzNav == '1',
            'hover-sc': item.shortlabel == '研发' && firstShowGlobaldrugsNav == '1',
            'hover-sc':
              item.shortlabel == '市场' && firstShowPoliciesNav == '1',
          }" v-for="item in menuList" :key="'/' + item.label" v-if="
            item.groupList[0].group.length > 0 ||
            item.shortlabel == '其他' ||
            item.shortlabel == '导航' ||
            item.shortlabel == '器械'
          ">
            <div style="display: flex; align-items: center" v-if="item.label !== '更多' && item.label !== '器械'">
              {{ item.label }}
              <!-- 显示new标签 -->
              <img v-if="item.navlabel === 4" src="/static/imgs/tag-new.svg#svgView(preserveAspectRatio(none))"
                class="new-tag" />
            </div>
            <div style="
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: center;
              " v-else-if="item.label === '器械'">
              <div @click="linkToQX">
                {{ item.label }}
                <!-- 显示new标签 -->
                <img v-if="item.navlabel === 4" src="/static/imgs/tag-new.svg#svgView(preserveAspectRatio(none))"
                  class="new-tag" />
              </div>
            </div>
            <div v-else style="display: flex; margin: 23px 0">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <div class="submenu" v-if="item.type != 2 && item.label !== '器械'">
              <img class="trz-rk" v-if="item.shortlabel == '市场'" src="~@/assets/imgs/policy/policies.png" alt
                @click="goPoliciesHome" />
              <img class="trz-rk" v-if="item.shortlabel == '研发'" src="/static/imgs/globaldrugs/globaldrugs.png" alt
                @click="goGlobaldrugsHome" />
              <ul class="group-list" :key="'group-item' + listIndex" v-for="(lists, listIndex) in item.groupList">
                <li v-for="list in lists.group" :key="list.href">
                  <router-link class="group-item" tag="a" :to="'/' + list.href" :title="list.title" v-if="
                    list.href.indexOf('http') != 0 &&
                    list.label !== '临床结果' &&
                    list.label !== '全球临床试验'
                  ">
                    <i class="iconfont li-style">&#xe757;</i>
                    <span v-html="list.label" :class="{ internal: list.internal }"></span>
                    <span :class="navStatus(list.navlabel)">
                      {{ statusIcon(list.navlabel) }}
                    </span>
                  </router-link>
                  <!-- 临床结果要单独跳转到全球临床的 临床结果tab -->
                  <span class="group-item" v-else-if="
                    list.label === '临床结果' || list.label === '全球临床试验'
                  " @click="goClinical(list.label)">
                    <i class="iconfont li-style">&#xe757;</i>
                    <span v-html="list.label" :class="{ internal: list.internal }"></span>
                    <span :class="navStatus(list.navlabel)">
                      {{ statusIcon(list.navlabel) }}
                    </span>
                  </span>
                  <a class="group-item" :href="list.href" :title="list.title" target="_blank" v-else>
                    <i class="iconfont li-style">&#xe757;</i>
                    <span v-html="list.label" :class="{ internal: list.internal }"></span>
                    <span :class="navStatus(list.navlabel)">
                      {{ statusIcon(list.navlabel) }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- nav底部滑动交互条 -->
          <div class="slide-z"></div>
        </nav>
        <div class="header-right">
          <!-- 顶部综合搜索栏 -->
          <div v-if="$route.path !== '/home'" class="search-form-box">
            <form class="c-search-form" @submit.prevent="onSubmit">
              <el-select class="comprehensive" v-model="searchCategory" popper-class="header-elselect"
                :placeholder="$t('cSearch.common.select_placeholder')" ref="popoverSelect" @change="searchChange">
                <el-option v-for="(sc, index) in searchCategorys"
                  :label="$t('cSearch.searchCategorys.' + sc + '.label')" :value="sc" :key="index">
                </el-option>
              </el-select>
              <!-- :placeholder="$t('cSearch.searchCategorys.'+searchCategory+'.ph')" -->
              <inputPopover :value="searchwords">
                <el-input id="header-search-input" class="searchwords" v-model="searchwords"
                  @keydown.enter.native.prevent="handleSearchClick" @input="autoInput(searchwords)" @focus="
                    trimKeyword.length == 0
                      ? getHistoryKeys()
                      : autoInput(searchwords)
                  " @blur="hisHide()"></el-input>
              </inputPopover>
              <a id="header-search-btn" class="el-icon-search header-search-btn" @click="handleSearchClick"></a>
              <router-link id="header-search" tag="button" :to="{
                path: '/search',
                query: {
                  comprehensive: searchCategory,
                  searchwords: filterSerchText(trimKeyword),
                  source: '1',
                },
              }" type="primary" native-type="submit" style="display: none">{{ $t("cSearch.common.search") }}
              </router-link>
              <!-- 历史搜索提示下拉框 -->
              <div class="header-xiala-history" id="header-xiala-history" v-if="history_keys.length && showWhat == 1">
                <!-- 历史搜索 -->
                <a href="javascript:void(0)" @click="gaPush(key, '3')" :title="key" class="one-history"
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
              <div class="header-xiala-input" id="header-xiala-input" v-if="input_keys.length && showWhat == 2">
                <!-- 输入提示 -->
                <a href="javascript:void(0)" @click="gaPush(key, '1')" :title="key" class="one-input"
                  v-for="(key, index) in input_keys" :key="index">
                  <span>{{ key }}</span>
                </a>
              </div>
            </form>
            <!-- <button class="save-express fs-small" @click="handleSaveExpress"><i class="icon">&#xe615;</i> {{ $t("common.save_express") }}</button> -->
          </div>
          <div class="header-nav-downs" @mousemove="tipsShow = true" @mouseout="tipsShow = false">
            <a class="header-nav-a" target="_blank"
              href="https://db.yaozh.com/app?ga_source=vip&ga_name=sumlink_vipty_top">
              <img src="@/assets/imgs/phone.png" class="phone" alt />
            </a>
            <div class="header-downs-tips-ou" v-show="tipsShow">
              <div class="header-downs-tips">
                <em class="arrow-top"></em>
                <img src="~@/assets/imgs/sumscan_vipty_top.png" />
                <a href="javascript:;" @click="googleGa('android')">
                  <i class="iconfont">&#xe674;</i>
                  <span>下载</span>
                </a>
                <a href="javascript:;" @click="googleGa('ios')">
                  <i class="iconfont">&#xe673;</i>
                  <span>下载</span>
                </a>
              </div>
            </div>
          </div>
          <div class="la-header-side">
            <!-- 消息通知 -->
            <el-popover placement="bottom" width="320" trigger="hover" v-model="popShow" visible-arrow="true"
              popper-class="msg-notice-popover" style>
              <!-- content -->
              <div>
                <div class="pop-head">
                  <span class="pop-head-title">通知</span>
                  <div class="handle-clear" @click="changeToReadedAll" v-if="unreadNum">
                    全部标记为已读
                    <i class="icon el-icon-circle-check cl-green"></i>
                  </div>
                </div>
                <div class="pop-content">
                  <div class="has-msg" v-if="allNum">
                    <div class="lan" :class="{ readed: item.status === 1 }" v-for="(item, index) in headerMsg.res"
                      :key="index" @click="handleHeaderMsgRoute(item)">
                      <div class="short-title" :class="{
                        gxgg: item.short_head_title === '更新',
                        zcdy: item.short_head_title === '订阅',
                        //'zbgg': item.short_head_title === '中标',
                        xtgg: item.short_head_title === '系统',
                        fkhf: item.short_head_title === '反馈',
                      }" :title="item.head_title">
                        {{ item.short_head_title }}
                      </div>
                      <div class="content">
                        <span class="content-title text-overflow">
                          {{ item.title }}
                        </span>
                      </div>
                      <div class="time">{{ item.addtime.split(" ")[0] }}</div>
                    </div>
                  </div>
                  <div class="no-msg" v-else>
                    <div class="no-msg-detail">暂无通知</div>
                  </div>
                </div>
                <div class="pop-footer" v-if="allNum && allNum > 5">
                  <router-link to="/usercenter/message" class="more-msg">查看更多通知</router-link>
                </div>
              </div>
              <!-- reference -->
              <span ref="popBtn" slot="reference" style="margin-right: 10px">
                <router-link tag="span" to="/usercenter/message" v-if="unreadNum">
                  <el-badge :value="unreadNum" :max="99" class="msg-badge" type="primary">
                    <i class="iconfont msg-iconfont">&#xe6eb;</i>
                  </el-badge>
                </router-link>
                <router-link tag="span" class="no-msg-badge" to="/usercenter/message" title="暂无消息" v-else>
                  <i class="iconfont msg-iconfont">&#xe6eb;</i>
                </router-link>
              </span>
            </el-popover>

            <!-- 移入显示下拉框 -->
            <el-dropdown class="la-header-dropdown">
              <!-- 头像&用户名 -->
              <div class="el-dropdown-link">
                <router-link to="/usercenter" class="avatar">
                  <span class="user-img-wrap">
                    <img class="user-img" :src="accountData.picture" />
                  </span>
                  <span class="user-name">{{ accountData.username }}</span>
                </router-link>
                <span></span>
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </div>
              <!-- 下拉框 -->
              <el-dropdown-menu class="la-header-menu" slot="dropdown" placement="top">
                <el-dropdown-item>
                  <router-link to="/usercenter/message" target="_blank">消息通知</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/usercenter/take" target="_blank">订阅管理</router-link>
                </el-dropdown-item>
                <!-- <el-dropdown-item><router-link to="/usercenter/collect" target="_blank">收藏管理</router-link></el-dropdown-item> -->
                <el-dropdown-item>
                  <router-link to="/usercenter/history" target="_blank">搜索记录</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/usercenter/suggest" target="_blank">建议反馈</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/help/list" target="_blank">帮助中心</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/updatelog" target="_blank">更新日志</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/usercenter/account" target="_blank">账号管理</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <router-link to="/home" @click.native="noviceEvent">新手教程</router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a @click="handleLogOut">退出登录</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputPopover from "@/components/inputs/input-popover";
import crypto from "crypto-js";
import { mapState } from "vuex";
import Moment from "moment";

export default {
  components: {
    inputPopover,
  },
  data() {
    return {
      menuList: [],
      noticeMsgStr: "",
      noticeMsg: [],
      navPaths: [
        { path: "/home", label: this.$t("header.navPath.home") },
        {
          path: "/report?ga_source=vip&ga_name=topnav",
          label: this.$t("header.navPath.drug"),
        },
        {
          path: "/newdrug/list?ga_source=vip&ga_name=topnav",
          label: this.$t("header.navPath.newdrug"),
        },
        {
          path: "/targetdatas/list?ga_source=vip&ga_name=topnav",
          label: this.$t("header.navPath.target"),
        },
        {
          path: "/company?ga_source=vip&ga_name=topnav",
          label: this.$t("header.navPath.company"),
        },
        {
          path: "/yzx/pjdt?ga_source=vip&ga_name=topnav",
          label: this.$t("header.navPath.consistencyEvaluation"),
        },
        {
          path: "/yyxsdata?ga_source=vip&ga_name=topnav",
          label: this.$t("header.navPath.yyxsdata"),
        },
        // 未开发的暂时注释掉
        // {path: "/intelligent", label: this.$t("header.navPath.intelligent")},
        // {path: "/information", label: this.$t("header.navPath.information")}
      ],
      input: "",
      select: "",
      searchCategorys: [
        "drug",
        "targets",
        "company",
        "disease",
        "chinesemedicine",
        'food',
        'cosmetics'
      ],
      path: this.$route.path ? this.$route.path : "",
      userInfo: {},
      history_keys: [],
      input_keys: [],
      showWhat: 0,
      param: {
        page: 1,
        pageSize: 10,
      },
      popShow: false,
      tipsShow: false,
      APPshow: false,
      winWdith: window.innerWidth,
      timer: null, // 菜单定时器
    };
  },
  computed: {
    trimKeyword() {
      return $.trim(this.searchwords);
    },
    allNum() {
      return Number(this.xxtzNum ? this.xxtzNum : 0);
    },
    unreadNum() {
      return Number(this.xxtzNumUnread ? this.xxtzNumUnread : 0);
    },
    padding() {
      let padding = 18;
      let innerWidth = this.winWdith;
      if (innerWidth < 1430) {
        padding = 16;
      }
      if (innerWidth < 1410) {
        padding = 13;
      }
      if (innerWidth < 1370) {
        padding = 10;
      }
      if (innerWidth < 1330) {
        padding = 8;
      }
      if (innerWidth < 1300) {
        padding = 13;
      }
      return padding;
    },
    ...mapState({
      xxtzNum: (state) => state.UserCenter.xxtzNum,
      xxtzNumUnread: (state) => state.UserCenter.xxtzNumUnread,
      headerMsg: (state) => state.UserCenter.headerMsg,
      msgBellShow: (state) => state.Layouts.msgBellShow,
      accountData: (state) => state.UserCenter.accountData,
      stepNumHome: (state) => state.UserCenter.stepNumHome,
      guideFlagsRenew: (state) => state.UserCenter.guideFlagsRenew,
      renewTipsAPP: (state) => state.UserCenter.renewTipsAPP,
      questionClose: (state) => state.UserCenter.questionClose,
      showPromtNotice: (state) => state.showPromtNotice,
      firstShowTrzNav: (state) => state.firstShowTrzNav,
      firstShowGlobaldrugsNav: (state) => state.firstShowGlobaldrugsNav,
      firstShowPoliciesNav: (state) => state.firstShowPoliciesNav,
      userData: (state) => state.UserCenter.accountData,
    }),
    searchCategory: {
      get() {
        return this.$store.state.Search.comprehensive;
      },
      set(val) {
        this.$store.commit("Search/sendComprehensive", val);
      },
    },
    searchwords: {
      get() {
        return this.$store.state.Search.keywords;
      },
      set(val) {
        this.$store.commit("Search/sendKeywords", val);
      },
    },
  },
  watch: {
    userData() {
      this.getNavData();
    },
    stepNumHome: {
      handler(val) {
        if (
          val &&
          this.guideFlagsRenew &&
          this.renewTipsAPP &&
          this.questionClose
        ) {
          setTimeout(() => {
            // localStorage.setItem('tipsKey', '1')
            this.popShow = Boolean(
              this.xxtzNumUnread && this.$route.path === "/home"
            );
          }, 300);
        }
      },
      immediate: true,
    },
    guideFlagsRenew: {
      handler(val) {
        if (
          val &&
          this.stepNumHome &&
          this.renewTipsAPP &&
          this.questionClose
        ) {
          setTimeout(() => {
            // localStorage.setItem('tipsKey', '1')
            this.popShow = Boolean(
              this.xxtzNumUnread && this.$route.path === "/home"
            );
          }, 300);
        }
      },
      immediate: true,
    },
    renewTipsAPP: {
      handler(val) {
        if (
          val &&
          this.guideFlagsRenew &&
          this.stepNumHome &&
          this.questionClose
        ) {
          setTimeout(() => {
            // localStorage.setItem('tipsKey', '1')
            this.popShow = Boolean(
              this.xxtzNumUnread && this.$route.path === "/home"
            );
          }, 300);
        }
      },
      immediate: true,
    },
    questionClose: {
      handler(val) {
        if (
          val &&
          this.guideFlagsRenew &&
          this.stepNumHome &&
          this.renewTipsAPP
        ) {
          setTimeout(() => {
            // localStorage.setItem('tipsKey', '1')
            this.popShow = Boolean(
              this.xxtzNumUnread && this.$route.path === "/home"
            );
          }, 300);
        }
      },
      immediate: true,
    },
    $route(val) {
      this.handleNavPoint();
      this.$nextTick(() => {
        setTimeout(() => {
          if (
            this.guideFlagsRenew &&
            this.stepNumHome &&
            this.renewTipsAPP &&
            this.questionClose
          ) {
            this.popShow = Boolean(
              this.xxtzNumUnread && this.$route.path === "/home"
            );
          }
        }, 1000);
      });
      this.handleUrlQuery();
    },
    unreadNum(val) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (
            this.guideFlagsRenew &&
            this.stepNumHome &&
            this.renewTipsAPP &&
            this.questionClose
          ) {
            this.popShow = Boolean(
              this.xxtzNumUnread && this.$route.path === "/home"
            );
          }
        }, 1000);
      });
    },
    // 此方法用于在用户导引界面的时候显示右上角的铃铛消息，通过修改 store 数据，触发
    msgBellShow(newVal, oldVal) {
      if (newVal) {
        this.popShow = true;
      } else {
        this.popShow = false;
      }
    },
    showPromtNotice: {
      handler(val) {
        // this.registerEven();
      },
    },
  },
  methods: {
    // 点击跳转至药智器械平台
    linkToQX() {
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_首页_导航_器械",
      ]); // matomo埋点
      window.ga("send", "event", "button", "click", "vip_shouye_nav_qixie"); // 谷歌埋点
      let development = "";
      if (
        location.href.includes("vip-dev") ||
        location.href.includes("vip-local")
      )
        development = "-dev";
      window.open(
        `https://qx${development}.yaozh.com/home?ga_source=vip&ga_name=nav`,
        "_blank"
      );
    },
    // 点击图片调整到政策法规
    goPoliciesHome() {
      let routeData = this.$router.resolve({
        path: "/policies/home?ga_source=vip&ga_name=policies",
      });
      window.open(routeData.href, "_blank");
    },
    // 点击图片跳转到全球药品2.0
    goGlobaldrugsHome() {
      let routeData = this.$router.resolve({
        path: "/globaldrugs/list?ga_source=vip&ga_name=nav_global",
      });
      window.open(routeData.href, "_blank");
    },
    statusIcon(status) {
      switch (status) {
        case 1:
          return "【新】";
          break;
        case 2:
          return "【热】";
          break;
        case 3:
          return "【荐】";
          break;
        default:
          return "";
          break;
      }
    },
    navStatus(label) {
      return label == 1 ? "new" : label == 2 ? "hot" : "recommand";
    },
    getNavData() {
      let that = this;
      window
        .Axios({
          method: "get",
          url: "/api/config/nav",
        })
        .then((res) => {
          this.menuList = [];
          let data = res.data.data;
          let iconConfig = this.iconConfig;
          let userGradeId = this.userData.grade_id;
          let isInside = this.insideUserList.indexOf(userGradeId) > -1;
          data.forEach((item) => {
            let iconList = _.find(iconConfig, { label: item.label });
            let list = JSON.parse(JSON.stringify(item));
            let groupList = (list.groupList[0].group = []);
            item.groupList[0].group.forEach((items) => {
              if (isInside) {
                if (items.internal) {
                  items.label += "（内）";
                }
              } else {
                if (items.internal) {
                  return;
                }
              }
              groupList.push(items);
            });
            if (list.label == "市场") {
              list.groupList[0].group.forEach((item) => {
                if (item.title == "医院销售数据") {
                  item.href = "yyxsdata?type_id=2";
                }
              });
            }
            this.menuList.push(list);
          });

          try {
            that.frontEndLog(that.$route.path, {
              handlerType: "refresh",
              handlerTypeDesc: "首页导航数据为空",
              token: GETCOOKIEFUN("accesstoken"),
            });
          } catch (error) {
            console.info(error);
          }
        })
        .catch((error) => {
          console.info(error);
        });
    },
    closeNotice() {
      this.noticeMsg = [];
      this.noticeMsgStr = "";
      localStorage.isFirstNotice = true;
      this.$store.commit("showPromtNotice", false);
    },
    noviceEvent() {
      window.ga("send", "event", "button", "click", "home_xsjc");
      _paq.push(["trackEvent", "button", "click", "home_xsjc"]);
      Store.dispatch("UserCenter/needGuideShowA", true);
      Store.dispatch("UserCenter/guideFlagsRenewA", false);
    },
    searchChange() {
      this.searchwords = "";
      this.showWhat = 0;
    },
    gaPush(key, source) {
      window.ga("send", "event", "button", "click", "vip_zhss_tishi2");
      window._paq.push(["trackEvent", "button", "click", "vip_zhss_tishi2"]);

      this.$router.push({
        path: "/search",
        query: {
          comprehensive: this.searchCategory,
          searchwords: $.trim(this.filterSerchText(key)),
          source,
        },
      });
    },
    // 顶部消息route跳转（多方式）
    handleHeaderMsgRoute(item) {
      // 并购事件跳转
      if (item.dbename === "binggou") {
        this.$router.push({
          path: "/usercenter/take/dynamic/trzMsg/" + item.id,
          query: {
            dbename: item.dbename,
          },
        });
        return;
      }

      // 融资事件跳转
      if (item.dbename === "tourongzi") {
        this.$router.push({
          path: "/usercenter/take/dynamic/trzMsg/" + item.id,
          query: {
            dbename: item.dbename,
          },
        });
        return;
      }

      // 全球药物
      if (item.dbename === "globaldrugs") {
        this.$router.push({
          path: "/usercenter/take/dynamic/gldrugs/" + item.id,
          query: { title: item.title },
        });
        return;
      }

      // 数据库对于ID（0为系统消息，2为注册数据库）
      if (item.dbid === 0 && item.type !== 13) {
        // 系统消息
        this.$router.push({
          path: "/usercenter/message/" + item.id,
          query: {
            infoid_formid: item.infoid,
          },
        });
      } else if (item.dbid === 0 && item.type === 13) {
        // 反馈回复
        this.$router.push({
          path: "/usercenter/suggest/" + item.infoid,
          query: {
            infoid_formid: item.infoid,
          },
        });
      } else if (item.field == "shoulihao" && item.type == 1) {
        // 注册数据库 - 按受理号订阅 && 受理号变化
        this.$router.push({
          path: "/usercenter/take/dynamic/slh/" + item.id,
          query: {
            infoid_formid: item.infoid,
          },
        });
      } else if (item.field == "shoulihao" && item.type == 2) {
        // 注册数据库 - 按受理号订阅 && 新申请
        const { href } = this.$router.resolve({
          path: "/zhuce/" + item.infoid,
          query: {
            infoid_formid: item.infoid,
          },
        });
        window.open(href, "_blank");
      } else if (item.field != "shoulihao") {
        // 注册数据库 - 非按受理号订阅
        this.$router.push({
          path: "/usercenter/take/dynamic/other/" + item.id,
          query: { title: item.title, infoid_formid: item.infoid },
        });
      }
    },
    // 顶部导航条UI样式自适应处理方法
    handleNavPoint() {
      let distance = 0;
      let index = -1;
      let urlList = [
        "/home",
        "/report",
        "newdrug",
        "/targetdatas",
        "/company",
        "/yzx",
        "/yyxsdata",
      ];
      _.forEach(urlList, (item, i) => {
        if (this.$route.path.indexOf(item) > -1) {
          index = i;
        }
      });
      if (index != -1) {
        let width = $(".la-header-nav .header-nav-item").eq(index).width();
        for (let i = 0; i < index; i++) {
          distance =
            distance +
            $(".la-header-nav .header-nav-item").eq(i).width() +
            this.padding +
            this.padding;
        }
        distance += this.padding;
        $(".slide-z").css({
          opacity: 1,
          left: distance,
          width: width,
          transition: "all 500ms",
        });
      } else {
        $(".slide-z").css({
          opacity: 0,
          left: 0,
          width: 0,
          transition: "all 500ms",
        });
      }
    },
    // 顶部导航条UI样式hover处理方法
    handleNavHover() {
      let _that = this;
      $(".la-header-nav .header-nav-item").hover(
        function () {
          let distance = 0;
          let index = $(this).index();
          let width = $(this).width();
          for (let i = 0; i < index; i++) {
            distance =
              distance +
              $(".la-header-nav .header-nav-item").eq(i).width() +
              _that.padding +
              _that.padding;
          }
          distance += _that.padding;
          $(".slide-z").css({
            opacity: 1,
            left: distance,
            width: width,
            transition: "all 500ms",
          });
        },
        function () {
          // $('.slide-z').css({'opacity': 0, 'left': 0, 'width': 0, 'transition': 'all 500ms'})
          _that.handleNavPoint();
        }
      );
    },

    mouseOver() {
      this.$store.commit("firstShowTrzNav", 0);
      this.$store.commit("firstShowGlobaldrugsNav", 0);
      this.$store.commit("firstShowPoliciesNav", 0);
    },
    handleSearchClick() {
      if (Boolean(this.searchwords)) {
        Store.commit(
          "Search/sendKeywords",
          $.trim(this.filterSerchText(this.searchwords))
        );
        $("#header-search").click();
      }
    },
    // 输入字段联想 长度 > 2
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
              _.set({}, this.searchCategory, key)
            ),
          })
          .then((res) => {
            if ((res.data.code = 200 && res.data.data)) {
              let data = res.data.data;
              this.input_keys = data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.showWhat = 0;
      }
    },
    hisHide() {
      // $('.xiala-history').hover(() => {
      //   this.showWhat = 1
      // }, () => {
      //   this.showWhat = 0
      // })
    },
    async deleteTheHistory(key) {
      await window
        .Axios({
          method: "get",
          url: "/api/search/delhistory",
          params: _.assign(
            {
              accesstoken: this.vueGetCookie("accesstoken"),
            },
            _.set({}, this.searchCategory, key)
          ),
        })
        .then((res) => {
          if ((res.data.code = 200)) {
            console.log("删除历史搜索");
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.getHistoryKeys();
    },
    async deleteAllHistory() {
      await window
        .Axios({
          method: "get",
          url: "/api/search/delhistory",
          params: _.assign(
            {
              accesstoken: this.vueGetCookie("accesstoken"),
            },
            _.set({}, this.searchCategory, "")
          ),
        })
        .then((res) => {
          if ((res.data.code = 200)) {
            console.log("删除所有历史搜索");
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.getHistoryKeys();
    },
    // 对应获取历史搜索数据
    getHistoryKeys() {
      if (!this.searchwords) {
        this.showWhat = 1;
      }
      window
        .Axios({
          method: "get",
          url: "/api/search/history",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            type: this.searchCategory,
          },
        })
        .then((res) => {
          if ((res.data.code = 200 && res.data.data)) {
            let data = res.data.data;
            this.history_keys = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserInfo() {
      // 获取消息数量
      Store.dispatch("UserCenter/handleHeaderMsgAxios", {
        page: 1,
        pageSize: 5,
      });
    },
    // 时间戳+随机字符串 生成签名
    // getSignature (strArr) {
    //   let str = strArr.sort((a, b) => {
    //     a = a.charCodeAt(0);
    //     b = b.charCodeAt(0);
    //     return a-b;
    //   }).join('');
    //   return crypto.MD5(crypto.SHA1(str).toString()).toString().toUpperCase();
    // },
    //老板退出登录 /ajax/loginout
    ajaxloginout() {
      window
        .Axios({
          method: "post",
          url: "/api/ajax/loginout",
          params: {},
        })
        .then((res) => {
          return true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击退出登录
    handleLogOut() {
      let timeStamp = Date.now();
      let randStr = Math.random().toString(36).slice(2); // 生成随机字符串
      // console.log(timeStamp + "~" +randStr);
      let accesstoken = this.vueGetCookie("accesstoken");
      // if(!accesstoken){
      //   this.vueBackToLogin();
      //   return;
      // }
      window
        .Axios({
          method: "post",
          url: "/api/user/logout",
          params: {
            accesstoken: accesstoken,
            timeStamp: timeStamp,
            randStr: randStr,
            signature: this.getSignature([timeStamp + "", randStr, "newdb"]),
          },
        })
        .then((res) => {
          if (res.data.code == 200) {
            // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到login.vue中动态添加到body里面
            res.data.data.items &&
              res.data.data.items.length > 0 &&
              this.vueSetCookie(
                "bbsOutScript",
                JSON.stringify(res.data.data.items)
              );

            let flag = this.$route.path.includes("/login");
            this.vueBackToLogin(flag); //全局方法，清楚cookie
            // this.vueBackToLogin();
            // this.ajaxloginout();
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 清理用户使用时长
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("gradeId");
      localStorage.removeItem("step1");
      localStorage.removeItem("step2");
      localStorage.removeItem("step3");
      localStorage.removeItem("step4");
    },
    changeToReaded(theId) {
      window
        .Axios({
          method: "post",
          url: "/api/usercenter/notice",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: theId,
            msg_readid: theId,
            from: 1,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            Store.dispatch("UserCenter/handleHeaderMsgAxios", {
              page: 1,
              pageSize: 5,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeToReadedAll() {
      window
        .Axios({
          method: "post",
          url: "/api/usercenter/msgread",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            type: "all",
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            Store.dispatch("UserCenter/handleXxtzAxios", this.param);
            Store.dispatch("UserCenter/handleHeaderMsgAxios", {
              page: 1,
              pageSize: 5,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //点击通知弹窗和引导窗以外的区域隐藏
    popHide() {
      $(document).click((e) => {
        let ele = e ? e.target : window.event.srcElement;
        if (
          ele.id.indexOf("el-popover") === -1 &&
          ele.className != "guide" &&
          !$(ele).parents(".guide").length
        ) {
          this.popShow = false;
        }
      });
    },
    googleGa(type) {
      if (type == "ios") {
        window.open("https://apps.apple.com/cn/app/id1025304074", "_blank");
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "appdownload_ios_vipty_top"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "appdownload_ios_vipty_top",
        ]);
      } else {
        window.open("https://static.yaozh.com/yaozh_latest.apk", "_blank");
        window.ga(
          "send",
          "event",
          "button",
          "click",
          "appdownload_android_vipty_top"
        );
        window._paq.push([
          "trackEvent",
          "button",
          "click",
          "appdownload_android_vipty_top",
        ]);
      }
    },
    APPshowHide() {
      let innerWidth = window.innerWidth;
      let width = 1368;
      this.APPshow = innerWidth > width;
    },
    handleUrlQuery() {
      let query = this.$route.query;
      this.$store.commit(
        "Search/sendComprehensive",
        query.comprehensive || this.searchCategory
      );
      this.$store.commit(
        "Search/sendKeywords",
        query.searchwords || this.searchwords
      );
    },
    getNoticeMsg() {
      window.Axios.post("/api/config/notice")
        .then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let curTimeStamp = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.noticeMsg = [];
            data.data.forEach((item) => {
              if (
                (Moment(curTimeStamp).isAfter(
                  Moment(item.time_start * 1000).format("YYYY-MM-DD HH:mm:ss")
                ) &&
                  Moment(curTimeStamp).isBefore(
                    Moment(item.time_end * 1000).format("YYYY-MM-DD HH:mm:ss")
                  )) ||
                Moment(curTimeStamp).isSame(
                  Moment(item.time_start * 1000).format("YYYY-MM-DD HH:mm:ss")
                ) ||
                Moment(curTimeStamp).isSame(
                  Moment(item.time_end * 1000).format("YYYY-MM-DD HH:mm:ss")
                )
              ) {
                this.noticeMsg.push(item);
              }
            });

            setTimeout(() => {
              // 第一次要弹
              if (!localStorage.noticeMsgStr) {
                localStorage.setItem("noticeMsgStr", JSON.stringify(data.data));
                this.$store.commit(
                  "showPromtNotice",
                  this.noticeMsg.length > 0
                );
                localStorage.isFirstNotice = false;
              } else {
                // 没点过关闭按钮的 要显示出来
                if (localStorage.isFirstNotice == "false") {
                  this.$store.commit(
                    "showPromtNotice",
                    this.noticeMsg.length > 0
                  );
                } else {
                  // 点过关闭按钮的 但是有新的内容的 也要弹出来
                  // 如果有新的公告也要弹
                  if (JSON.stringify(data.data) !== localStorage.noticeMsgStr) {
                    localStorage.isFirstNotice = false;
                    localStorage.setItem(
                      "noticeMsgStr",
                      JSON.stringify(data.data)
                    );
                    this.$store.commit(
                      "showPromtNotice",
                      this.noticeMsg.length > 0
                    );
                  }
                }
              }
            }, 100);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
    // 跳到全球临床临床结果tab
    async goClinical(label) {
      let path = "";
      let api = "";
      let tabname = "";
      if (label == "临床结果") {
        path = "/clinical/list?tabName=clinicalresultsgroup";
        api = "/api/clinical/clinicalresultsgroup";
        tabname = "clinicalresultsgroup";
      } else {
        path = "/clinical/list";
        api = "/api/clinical";
        tabname = "first";
      }
      await this.$router.push({
        path: path,
      });
      await this.$store.commit("Clinical/tabname", tabname);
      await this.$store.commit("Clinical/path", api);
      await Store.dispatch("Clinical/nomalSearch", {
        path: api,
        queryToPutong: false,
      });
    },
  },
  created() {
    if (this.userData.grade_id) {
      this.getNavData();
    }
    let style = document.createElement("style");
    style.id = "marquee";
    document.getElementsByTagName("head")[0].appendChild(style);
    this.getUserInfo();
    //url中有参数顶部搜索框回显
    this.handleUrlQuery();
  },
  mounted() {
    this.selectPopMouseleave(this);
    //小屏幕隐藏APP按钮
    this.APPshowHide();
    $(window).resize(() => {
      this.APPshowHide();

      this.winWdith = window.innerWidth;
      this.handleNavPoint();
    });

    setTimeout(() => {
      this.handleNavPoint();
      this.handleNavHover();
    }, 500);

    this.popHide();

    // 处理点击目标dom外的显示与隐藏
    let _that = this;
    $(document).click((e) => {
      let ele = e ? e.target : window.event.srcElement;
      if (
        ele.id != "header-search-input" &&
        ele.id != "header-xiala-history" &&
        ele.id != "header-xiala-input" &&
        !$(ele).parents("#header-xiala-history").length
      ) {
        _that.showWhat = 0;
      }
    });
    //鼠标移出隐藏
    $("body").on(
      "mouseleave",
      "#header-xiala-input,#header-xiala-history",
      () => {
        this.$nextTick(() => {
          this.showWhat = 0;
          $("#header-search-input").blur();
        });
      }
    );
    // 获取公告数据
    this.getNoticeMsg();

    //点击任何区域隐藏二维码弹框
    // $(document).on('click', function(e) {
    //   if(!localStorage.getItem('tipsKeyFlag')){
    //     if(localStorage.getItem('tipsKey')){
    //       _that.tipsShow = false;
    //       localStorage.setItem('tipsKeyFlag', '1')
    //     }
    //   }
    // })
    if (localStorage.getItem("firstShowTrzNav") == 0) {
      this.$store.commit("firstShowTrzNav", 0);
    }

    if (localStorage.getItem("firstShowGlobaldrugsNav") == 0) {
      this.$store.commit("firstShowGlobaldrugsNav", 0);
    }

    if (localStorage.getItem("firstShowPoliciesNav") == 0) {
      this.$store.commit("firstShowPoliciesNav", 0);
    }
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
@height: 48px;
@leftWidth: 295px;

@width: 295px;
@titlewidth: 50px;
@labelwidth: 200px;

@rightW: calc(100% - 121px - 20px);

i {
  user-select: none; // iconfont（i标签内）不能被选中
}

.new {
  color: #90c31f;
}

.hot {
  color: #ff1f01;
}

.recommand {
  color: #f5a623;
}

.internal {
  color: @MenuOrange;
}

.msg-notice-popover {
  padding: 0px;
  box-shadow: @BoxShadow;

  .pop-head {
    height: 30px;
    padding: 10px 30px 0px 30px;
    border-bottom: 1px solid #f2f5f9;

    .pop-head-title {
      float: left;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      color: @PrimaryColor;
      padding-left: 14px;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        top: 12px;
        left: 4px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: @PrimaryColor;
        float: left;
      }
    }

    .handle-clear {
      cursor: pointer;
      float: right;
      height: 30px;
      line-height: 30px;

      .icon {
        display: inline-block;
        margin-left: 4px;
        font-size: 14px;
      }

      &:hover {
        color: @PrimaryColor;
      }
    }
  }

  .pop-content {
    padding: 20px 0px;

    .has-msg {
      .lan {
        cursor: pointer;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        padding: 8px 30px;
        font-size: 12px;

        a {
          text-decoration: none;
        }

        &:hover {
          background-color: @BackgroundColor;

          .content {
            .handle-read {
              display: inline-block;
            }
          }
        }

        .short-title {
          display: inline-block;
          // box-sizing: border-box;
          padding: 0px 6px;
          // margin-right: 18px;
          width: 10%;
          height: 20px;
          line-height: 20px;
          color: #fff;
          border-radius: 10px;
          text-align: center;

          &.gxgg {
            // 更新公告
            background: @PrimaryColor;
          }

          &.zcdy {
            // 注册订阅
            background: @McTypeGreen;
          }

          &.zbgg {
            // 中标公告
            background: @McTypeGray;
          }

          &.xtgg {
            // 系统公告
            background: @McTypeRed;
          }

          &.fkhf {
            // 反馈回复
            background: @McTypeOrange;
          }
        }

        .content {
          display: inline-block;
          cursor: pointer;
          position: relative;
          top: 2px;
          box-sizing: border-box;
          // width: 100%;
          width: 84%;
          padding-left: 8px;

          // background: url("/static/imgs/usercenter/unread.jpg") 0px 2px no-repeat;
          // &::after {
          //   content: '';
          //   width: 8px;
          //   height: 8px;
          //   border-radius: 50%;
          //   background-color: #F78359;
          //   position: absolute;
          //   left: 3px;
          //   top: 4px;
          // }
          // &::before {
          //   content: '';
          //   width: 14px;
          //   height: 14px;
          //   border-radius: 50%;
          //   background-color: #FCCDBD;
          //   position: absolute;
          //   left: 0px;
          //   top: 1px;
          // }
          .content-title {
            cursor: pointer;
            display: inline-block;
            width: 100%;
          }
        }

        .time {
          cursor: pointer;
          box-sizing: border-box;
          display: block;
          padding-left: 50px;
          width: 100%;
          color: @FontColor3;
        }

        // 未读
        // 已读
        &.readed {
          .short-title {
            background: @FontColor6;
            color: #ffffff;
          }

          .content {
            background: none;
            color: @FontColor6;
            // &::after {
            //   content: '';
            //   display: none;
            //   width: 8px;
            //   height: 8px;
            //   border-radius: 50%;
            //   background-color: #F78359;
            //   position: absolute;
            //   left: 3px;
            //   top: 4px;
            // }
            // &::before {
            //   content: '';
            //   display: none;
            //   width: 14px;
            //   height: 14px;
            //   border-radius: 50%;
            //   background-color: #FCCDBD;
            //   position: absolute;
            //   left: 0px;
            //   top: 1px;
            // }
          }

          .time {
            color: @FontColor6;
          }

          &:hover {
            .content {
              .handle-read {
                display: none !important;
              }
            }
          }
        }
      }
    }

    .no-msg {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;

      .no-msg-detail {
        width: 144px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #acbacc;
        text-align: center;
        padding-top: 100px;
        background: url("/static/imgs/usercenter/header-more-msg.png") 0px 0px no-repeat;
      }
    }
  }

  .pop-footer {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #f2f5f9;

    .more-msg {
      display: block;
      width: 100%;
      height: 40px;
      text-align: center;
      color: @PrimaryColor;
      font-size: 12px;
    }
  }
}

.cursor {
  cursor: pointer;
  padding: 0 !important;
  width: 68px;
}

.la-header-globaldrugs {
  //min-width: 1920px;
  // margin-top: 30px;
  line-height: @height;
  width: 100%;
  min-width: 1200px;
  display: flex;
  flex-flow: column;
  align-items: center;
  // height: @height;
  position: relative;
  // top: 0;
  // left: 0;
  z-index: 1999;
  background-color: rgb(0, 47, 168);

  // box-shadow: @BoxShadow;
  .logo {
    float: left;
    height: 34px;
    width: 121px;
    margin-left: 20px;

    img {
      height: 34px;
      width: 121px;
    }
  }

  .right {
    white-space: nowrap;
    margin-left: 81px;
    height: 48px;
    width: @rightW;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99999;
    position: relative;

    .header-right {
      display: inline-flex;
      align-items: center;
      min-width: 380px;
    }

    .la-header-nav {
      min-width: 530px;
      display: flex;
      align-items: center;
      font-size: @FontSizeLarge;
      position: relative;
      border-radius: 5px;

      // .slide-z {
      //   position: absolute;
      //   width: 0px;
      //   height: 5px;
      //   background: #fff;
      //   border-radius: 3px;
      //   bottom: 0px;
      //   left: 0px;
      // }

      .header-nav-item {
        height: 48px;
        padding: 0px 18px;
        display: inline-block;
        position: relative;
        text-decoration: none;
        font-size: 16px;
        // font-family: Source Han Sans CN;
        color: #ffffff;

        .new-tag {
          margin-top: -9px;
          width: 23px;
          height: 11px;
        }

        .dot {
          border-radius: 50%;
          background: #fff;
          width: 5px;
          margin-left: 3px;
          height: 5px;
        }

        &:hover,
        &.hover {
          background: #35384a;

          .submenu {
            display: block;
          }
        }

        .submenu {
          z-index: 2001;
          display: none;
          position: absolute;
          top: 48px;
          left: 0;
          min-width: 230px;
          height: auto;
          background-color: @menuHoverBackgroundColor;
          color: @White;
          border-radius: 0px 0px 4px 4px;

          .group-title {
            display: block;
            width: 217px;
            padding: 20px 20px 5px 30px;
            font-size: @FontSizeSmall + 2;
          }

          .group-list {
            padding: 20px 0 30px 0;
            max-height: calc(100vh - 48px - 20px - 30px);
            overflow-y: auto;

            li {
              white-space: nowrap;
              font-size: @FontSizeSmall;
              height: 30px;
              line-height: 30px;
              padding: 0px;
              cursor: pointer;
              overflow: hidden;
              position: relative;

              // transition: background-color 100ms;
              .group-item {
                // 注意：z-inde只在position为非static（默认）的情况下生效
                position: relative;
                text-decoration: none;
                color: @White;
                width: 100%;
                height: 100%;
                padding: 0px 0 0px 10px;
                font-weight: 400;
                display: flex;
                font-size: 12px;
                // font-family: Microsoft YaHei;
                box-sizing: border-box;

                // z-index: 100;
                .li-style {
                  font-size: 12px;
                  vertical-align: middle;
                  margin-right: 6px;
                }

                a {
                  color: @White;
                  text-decoration: none;
                }
              }

              // &::after {
              //   content: '';
              //   position: absolute;
              //   right: -100%;
              //   top: 0;
              //   width: 100%;
              //   height: 30px;
              //   background: @PrimaryColor;
              //   transition: right 200ms;
              //   z-index: 1;
              // }
              &:hover {
                // &::after{
                //   right: 0px;
                //   transition: right 200ms;
                // }
                background-color: @PrimaryColor;
                // transition: background-color 300ms;
              }
            }
          }
        }
      }

      .header-nav-item.hover-sc {
        background: #35384a;

        .submenu {
          display: block;
        }
      }

      .trz-rk {
        display: block;
        width: 300px;
        height: 150px;
        position: absolute;
        left: 230px;
        cursor: pointer;
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
          width: 396px;
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
            height: 24px;
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

    .la-header-side {
      margin-right: 10px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      height: 52px;
      overflow: hidden;
      text-align: right;
      text-align: right;
      color: @White;

      .no-msg-badge {
        cursor: pointer;
        display: inline-flex;
        height: 52px;

        .msg-iconfont {
          transition: all 300ms;
          transform: scale(1);
          font-size: 24px;
          opacity: 1;
          margin-left: 10px;
          margin-right: 10px;
          margin-top: 3px !important;
        }
      }

      .el-badge {
        cursor: pointer;
        display: inline-flex;
        align-items: center;

        // margin-right: 10px;
        &:hover {
          .msg-iconfont {
            transition: all 300ms 100ms;
            opacity: 0;
          }

          .el-badge__content {
            transition: all 300ms 100ms;
            // background-color: #fff;
            // color: @Orange;
            // border-color: @Orange;
            transform: scale(1);
            transform: translate(10px, 10px);

            &.is-fixed {
              top: 5px;
            }
          }
        }

        .msg-iconfont {
          margin-right: 0px;
          transition: all 300ms 100ms;
          opacity: 1;
          font-size: 24px;
        }

        .el-badge__content {
          transition: all 300ms 100ms;
          background-color: @Orange;
          border-color: @Orange;
          transform: scale(0.8);

          // transform: translate(10px);
          &.is-fixed {
            top: 5px;
          }
        }
      }

      .avatar {
        text-decoration: none;
        float: left;
        padding-left: 0;

        .user-img-wrap {
          float: left;
          width: 34px;
          height: 34px;
          border-radius: 34px;
          overflow: hidden;
          margin-top: 6px;

          .user-img {
            float: left;
            width: 34px;
            height: 34px;
          }
        }

        .user-name {
          color: @White;
          font-size: 13px;
          max-width: 90px;
          float: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin-left: 4px;
        }
      }

      .el-dropdown {
        color: @White;

        >div:focus {
          outline: none;
        }
      }
    }
  }

  .right2 {
    white-space: nowrap;
    margin-left: 81px;
    height: 48px;
    width: @rightW;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99999;
    position: relative;

    .header-right {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 380px;
    }

    .la-header-nav {
      min-width: 530px;
      display: flex;
      align-items: center;
      font-size: @FontSizeLarge;
      position: relative;
      border-radius: 5px;

      // .slide-z {
      //   position: absolute;
      //   width: 0px;
      //   height: 5px;
      //   background: #fff;
      //   border-radius: 3px;
      //   bottom: 0px;
      //   left: 0px;
      // }
      .header-nav-item {
        height: 48px;
        padding: 0px 18px;
        display: inline-block;
        position: relative;
        text-decoration: none;
        font-size: 16px;
        // font-family: Source Han Sans CN;
        color: #ffffff;

        .dot {
          border-radius: 50%;
          background: #fff;
          width: 5px;
          margin-left: 3px;
          height: 5px;
        }

        &:hover,
        &.hover {
          background: #35384a;

          .submenu {
            display: block;
          }
        }

        .submenu {
          z-index: 2001;
          display: none;
          position: absolute;
          top: 48px;
          left: 0;
          min-width: 230px;
          height: auto;
          background-color: @menuHoverBackgroundColor;
          color: @White;
          border-radius: 0px 0px 4px 4px;

          .group-title {
            display: block;
            width: 217px;
            padding: 20px 20px 5px 30px;
            font-size: @FontSizeSmall + 2;
          }

          .group-list {
            padding: 20px 0 30px 0;
            max-height: calc(100vh - 48px - 20px - 30px);
            overflow-y: auto;

            li {
              white-space: nowrap;
              font-size: @FontSizeSmall;
              height: 30px;
              line-height: 30px;
              padding: 0px;
              cursor: pointer;
              overflow: hidden;
              position: relative;

              // transition: background-color 100ms;
              .group-item {
                // 注意：z-inde只在position为非static（默认）的情况下生效
                position: relative;
                text-decoration: none;
                color: @White;
                width: 100%;
                height: 100%;
                padding: 0px 0 0px 10px;
                font-weight: 400;
                display: flex;
                font-size: 12px;
                // font-family: Microsoft YaHei;
                box-sizing: border-box;

                // z-index: 100;
                .li-style {
                  font-size: 12px;
                  vertical-align: middle;
                  margin-right: 6px;
                }

                a {
                  color: @White;
                  text-decoration: none;
                }
              }

              // &::after {
              //   content: '';
              //   position: absolute;
              //   right: -100%;
              //   top: 0;
              //   width: 100%;
              //   height: 30px;
              //   background: @PrimaryColor;
              //   transition: right 200ms;
              //   z-index: 1;
              // }
              &:hover {
                // &::after{
                //   right: 0px;
                //   transition: right 200ms;
                // }
                background-color: @PrimaryColor;
                // transition: background-color 300ms;
              }
            }
          }
        }
      }

      .header-nav-item.hover-sc {
        background: #35384a;

        .submenu {
          display: block;
        }
      }

      .trz-rk {
        display: block;
        width: 300px;
        height: 150px;
        position: absolute;
        left: 230px;
        cursor: pointer;
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
            padding-left: 97px;
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

          &:hover {
            transition: all 300ms;
            transform: scale(1) rotate(90deg);
          }
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
            left: 15px;
          }

          .one-history {
            overflow: hidden;
            box-sizing: border-box;
            width: 100%;
            height: 25px;
            line-height: 25px;
            color: @PrimaryColor;
            font-size: 12px;
            padding-left: 24px;
            padding-right: 20px;
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

    .la-header-side {
      margin-right: 10px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      height: 52px;
      overflow: hidden;
      text-align: right;
      color: @White;

      .msg-badge {
        display: inline-flex;
        align-items: center;
      }

      .no-msg-badge {
        cursor: pointer;
        display: inline-flex;
        height: 52px;

        .msg-iconfont {
          transition: all 300ms;
          transform: scale(1);
          font-size: 24px;
          opacity: 1;
          margin-left: 10px;
          margin-right: 10px;
          margin-top: 3px !important;
        }
      }

      .el-badge {
        cursor: pointer;
        display: inline-flex;
        align-items: center;

        // margin-right: 10px;
        &:hover {
          .msg-iconfont {
            transition: all 300ms 100ms;
            opacity: 0;
          }

          .el-badge__content {
            transition: all 300ms 100ms;
            // background-color: #fff;
            // color: @Orange;
            // border-color: @Orange;
            transform: scale(1);
            transform: translate(10px, 10px);

            &.is-fixed {
              top: 5px;
            }
          }
        }

        .msg-iconfont {
          margin-right: 0px;
          transition: all 300ms 100ms;
          opacity: 1;
          font-size: 24px;
        }

        .el-badge__content {
          transition: all 300ms 100ms;
          background-color: @Orange;
          border-color: @Orange;
          transform: scale(0.8);

          // transform: translate(10px);
          &.is-fixed {
            top: 5px;
          }
        }
      }

      .avatar {
        text-decoration: none;
        float: left;
        padding-left: 0;

        .user-img-wrap {
          float: left;
          width: 34px;
          height: 34px;
          border-radius: 34px;
          border: 1px solid #fff;
          overflow: hidden;
          margin-top: 6px;

          .user-img {
            float: left;
            width: 34px;
            height: 34px;
          }
        }

        .user-name {
          color: @White;
          font-size: 13px;
          max-width: 90px;
          float: left;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin-left: 4px;
        }
      }

      .el-dropdown {
        color: @White;

        >div:focus {
          outline: none;
        }
      }
    }
  }
}

.header-nav-downs {
  color: #fff;
  box-sizing: border-box;
  font-size: 12px;
  cursor: pointer;
  z-index: 3;
  position: relative;

  .header-nav-a {
    color: #fff;
  }

  .phone {
    display: flex;
    width: 14px;
    padding: 15px 0;
    height: 20px;
    line-height: 20px;
    color: #fff;
    animation: move 10s 0s infinite;
    -webkit-animation: move 10s 0s infinite;
    transform-origin: bottom;
    -webkit-transform-origin: bottom;
  }

  span {
    display: inline-block;
  }

  .header-downs-tips-ou {
    width: 190px;
    padding-top: 12px;
    position: absolute;
    top: 36px;
    right: -90px;
    z-index: 4;
  }

  .header-downs-tips {
    background: #fff;
    box-shadow: 0px 3px 14px 3px rgba(72, 119, 232, 0.13);
    padding: 0 22px 20px;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    border-radius: 4px;

    .arrow-top {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #fff;
      font-size: 0;
      line-height: 0;
      position: absolute;
      z-index: 5;
      top: -8px;
      left: 87px;
    }

    img {
      width: 146px;
      margin-top: 20px;
    }

    a {
      text-decoration: none;
      color: #fff;
      display: block;
      width: 146px;
      margin-top: 10px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      background-color: #4877e8;
      border-radius: 13px;

      i {
        display: inline-block;
        vertical-align: 0;
        margin-right: 10px;
      }

      span {
        color: #fff;
        display: inline-block;
        font-size: 14px;
      }
    }

    a:hover {
      background-color: #6d92ed;
    }
  }
}

.la-header-menu {
  float: right;
  padding: 0 !important;
  margin: 0 0 0 10px !important;

  .el-dropdown-menu__item {
    padding: 0px;

    a {
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
      padding: 0px 20px;
      text-decoration: none;
    }

    &:hover {
      // background: @PrimaryColor;
      background: #4b5af8;

      a {
        color: #fff;
      }
    }

    &:last-of-type {
      a {
        color: @Red;
      }

      &:hover {
        background: @Red;

        a {
          color: #fff;
        }
      }
    }
  }

  .popper__arrow:after {
    top: 0 !important;
  }

  .first {
    border-radius: 4px 4px 0 0;
  }

  .last {
    border-radius: 0 0 4px 4px;
  }
}

.el-select-dropdown__list {
  padding: 0 !important;
}

.header-elselect {
  margin-top: 8px;
}

@keyframes move {

  0%,
  90% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  92% {
    -webkit-transform: rotate(6deg);
    transform: rotate(6deg);
  }

  94% {
    -webkit-transform: rotate(-6deg);
    transform: rotate(-6deg);
  }

  96% {
    -webkit-transform: rotate(6deg);
    transform: rotate(6deg);
  }

  98% {
    -webkit-transform: rotate(-6deg);
    transform: rotate(-6deg);
  }

  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

@-webkit-keyframes move {

  0%,
  90% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  92% {
    -webkit-transform: rotate(6deg);
    transform: rotate(6deg);
  }

  94% {
    -webkit-transform: rotate(-6deg);
    transform: rotate(-6deg);
  }

  96% {
    -webkit-transform: rotate(6deg);
    transform: rotate(6deg);
  }

  98% {
    -webkit-transform: rotate(-6deg);
    transform: rotate(-6deg);
  }

  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}

@media screen and (max-width: 1550px) {
  .la-header-globaldrugs {
    .right {
      .search-form-box {
        // .c-search-form {
        //   width: 288px;
        //   .header-xiala-history {
        //     width: 288px;
        //     &::after {
        //       width: 270px;
        //     }
        //   }
        //   .header-xiala-input {
        //     width: 300px;
        //     &::after {
        //       width: 270px;
        //     }
        //   }
        // }
      }
    }
  }
}

@media screen and (max-width: 1480px) {
  .la-header-globaldrugs {
    .right {
      .search-form-box {
        // .c-search-form {
        //   width: 195px;
        //   .header-xiala-history {
        //     width: 195px;
        //     &::after {
        //       width: 165px;
        //     }
        //   }
        //   .header-xiala-input {
        //     width: 195px;
        //     &::after {
        //       width: 165px;
        //     }
        //   }
        // }
      }
    }
  }
}

@media screen and (max-width: 1430px) {
  .la-header-globaldrugs {
    .right {
      .la-header-nav {
        .header-nav-item {
          padding: 0px 16px;
        }
      }
    }
  }
}

@media screen and (max-width: 1410px) {
  .la-header-globaldrugs {
    .right {
      .la-header-nav {
        .header-nav-item {
          padding: 0px 12px;
        }
      }
    }
  }
}

@media screen and (max-width: 1370px) {
  .la-header-globaldrugs {
    .right {
      .la-header-nav {
        .header-nav-item {
          padding: 0px 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 1330px) {
  .la-header-globaldrugs {
    .right {
      .la-header-nav {
        .header-nav-item {
          padding: 0px 8px;
        }
      }
    }
  }
}

@media screen and (max-width: 1300px) {
  .la-header-globaldrugs {
    .right {
      .la-header-nav {
        .header-nav-item {
          padding: 0px 12px;
        }
      }
    }
  }
}
</style>
