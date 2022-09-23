<template>
  <div>
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- <div class="introduce"> -->
    <div class="introduce" v-else>
      <!-- 升级消息公告 -->
      <transition name="el-fade-in-linear">
        <marquee-kz v-if="noticeMsg.length > 0 && showPromtNotice" :noticeMsg="noticeMsg" @closeNotice="closeNotice">
        </marquee-kz>
      </transition>
      <!-- 试用申请弹出框 -->
      <el-dialog :visible.sync="dialogProbationShow" :modal-append-to-body="false" width="850px">
        <div slot="title" class="dialog-header">
          <span>试用申请</span>
        </div>
        <DialogProbation :serviceGa="serviceGa"></DialogProbation>
      </el-dialog>
      <div class="introduce_wrapper">
        <!-- 顶部导航 -->
        <div class="introduce_nav">
          <div class="introduce_header">
            <div class="nav-all" v-show="navShow" @mouseleave="navShowMouseleave">
              <ul>
                <li>
                  <router-link to="/home">首页</router-link>
                </li>
                <li></li>
                <li>
                  <a href="javascript:;" @click="() => (navHelpShow = !navHelpShow)">帮助中心<i class="nav-rotate-show"
                      :class="{ 'nav-rotate-hide': !navHelpShow }"><span></span><span></span></i></a>
                  <transition name="slide">
                    <div class="help_sel" v-show="navHelpShow">
                      <span><a href="javascript:;" @click="
                        redirect(
                          '/help?ga_source=vip&ga_name=vip_service_topnav'
                        )
                      ">帮助中心</a></span>
                      <span><a href="javascript:;" @click="redirect('', 2)">手册下载</a></span>
                    </div>
                  </transition>
                </li>
                <li></li>
                <li>
                  <router-link target="_blank" :to="{
                    path: '/updatelog?ga_source=vip&ga_name=vip_updatelog_list_topnav',
                  }">更新日志</router-link>
                </li>
                <li></li>
                <li>
                  <router-link target="_blank" :to="{
                    path: '/service?ga_source=vip&ga_name=vip_service_topnav',
                  }">客服中心</router-link>
                </li>
                <li></li>
                <li>
                  <a href="javascript:;" @click="introduce">掌上数据库</a>
                </li>
              </ul>
            </div>

            <router-link tag="a" to="/login?ga_source=vip&ga_name=introduce" v-if="isLogin">
              <div class="logo">
                <img src="~@/assets/imgs/intro_logo.png" />
              </div>
            </router-link>
            <router-link tag="a" to="/introduce" v-else>
              <div class="logo">
                <img src="~@/assets/imgs/intro_logo.png" />
              </div>
            </router-link>

            <!-- 是否登录 -->
            <div class="nav_login">
              <div v-if="isLogin">
                <router-link tag="a" to="/login" class="login_btn">登录</router-link>
              </div>
              <div v-else class="nav_login_img">
                <!-- 移入显示下拉框 -->
                <el-dropdown class="la-header-dropdown">
                  <!-- 头像&用户名 -->
                  <div class="el-dropdown-link">
                    <router-link to="/usercenter" class="avatar">
                      <span class="user-img-wrap">
                        <img class="user-img" :src="UserCenterAccountData.picture" />
                      </span>
                      <span class="user-name">{{
                      UserCenterAccountData.username
                      }}</span>
                    </router-link>
                    <i class="el-icon-caret-bottom el-icon--right icon-color"></i>
                  </div>
                  <!-- 下拉框 -->
                  <el-dropdown-menu class="la-header-menu" slot="dropdown" placement="top">
                    <el-dropdown-item class="first">
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
                    <el-dropdown-item class="last">
                      <a @click="handleLogOut">退出登录</a>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="power">
                  <img :src="'/static/imgs/usercenter/' + vip_img.name" :style="vip_img.style" />
                </div>
              </div>
            </div>
            <div class="tohome">
              <div v-if="!isLogin">
                <router-link tag="a" to="/home" class="tohome_btn">进入数据库</router-link>
              </div>
            </div>
            <nav class="nav_right">
              <router-link tag="a" class="right-nav-item" to="/home" exact>首页</router-link>
              <a href="javascript:;" class="right-nav-item" style="position: relative" exact>
                帮助中心<i class="el-icon-caret-bottom el-icon--right icon-color"></i>
                <div class="tip-product">
                  <i class="el-icon-caret-top"></i>
                  <div class="tip-product-list">
                    <span @click="
                      redirect(
                        '/help?ga_source=vip&ga_name=vip_service_topnav'
                      )
                    ">帮助中心</span>
                    <span @click="redirect('', 2)">手册下载</span>
                  </div>
                </div>
              </a>
              <router-link tag="a" class="right-nav-item" target="_blank" :to="{
                path: '/updatelog?ga_source=vip&ga_name=vip_updatelog_list_topnav',
              }" exact>更新日志</router-link>
              <router-link tag="a" class="right-nav-item" target="_blank" :to="{
                path: '/service?ga_source=vip&ga_name=vip_service_topnav',
              }" exact>客服中心</router-link>
              <!-- <router-link tag="a" class="right-nav-item" to="/" @click.native="introduce" exact>掌上数据库</router-link> -->
              <a class="right-nav-item" href="javascript:;" @click="introduce" exact>掌上数据库</a>
              <!-- nav底部滑动交互条 -->
              <div class="slide-z"></div>
            </nav>
            <div class="in_sel">
              <img @mouseenter="() => (navShow = true)" src="@/assets/imgs/in_sel.png" />
            </div>
          </div>
        </div>
        <!-- header中间部分 -->
        <div class="introduce_top">
          <div class="heder_con">
            <div class="p1">药智数据企业版</div>
            <!-- <div class="p2">全新上线</div> -->
            <div class="p3">
              <div class="fl">因/为/专/业</div>
              <div class="fr">所/以/信/赖</div>
            </div>
            <div class="p4">
              <div class="fl p4_img">高度整合</div>
              <div class="fl p4_img">深度分析</div>
              <div class="fl p4_img">智能情报</div>
              <div class="fl p4_img">体验升级</div>
            </div>
            <el-button @click="showProbation('vip_top_applyforatrial')">免费试用</el-button>
          </div>
          <div class="drop" @click="nextPage()">
            <span class="span1"></span>
            <span class="span2"></span>
          </div>
        </div>
        <!-- 内容部分 -->
        <div class="introduce_container">
          <div class="container_wrapper container_wrapper1">
            <div class="container">
              <div class="main_title">
                <p class="title">核心价值</p>
                <p class="subtitle">助力决策 洞见未来</p>
              </div>
              <div class="main_con">
                <div class="lineone">
                  <div class="one">
                    <div class="div1"></div>
                    <p>跟踪国内外药品</p>
                    <p>研发信息</p>
                  </div>
                  <div class="one">
                    <div class="div2"></div>
                    <p>发现热点研发领域</p>
                    <p>评估即将上市药物的商业前景</p>
                  </div>
                  <div class="one">
                    <div class="div3"></div>
                    <p>筛选潜在可研产品</p>
                    <p>和投资机会</p>
                  </div>
                </div>
                <div class="lineone">
                  <div class="one">
                    <div class="div4"></div>
                    <p>获取产品报告</p>
                    <p>及相关的信息和资料</p>
                  </div>
                  <div class="one">
                    <div class="div5"></div>
                    <p>研究和评估竞争者的</p>
                    <p>在研产品和上市产品</p>
                  </div>
                  <div class="one">
                    <div class="div6"></div>
                    <p>制定企业</p>
                    <p>战略规划与决策</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container_wrapper container_wrapper2">
            <div class="container">
              <div class="main_title">
                <p class="title">特色功能</p>
                <p class="subtitle">量身打造 智能精准</p>
              </div>
              <div class="main_con">
                <div class="main_con1">
                  <div class="move_lt">
                    <img src="~@/assets/imgs/block2.png" />
                  </div>
                  <div class="move_rt">
                    <p>
                      <img src="~@/assets/imgs/move1.png" />
                      <span>多库整合轻松检索</span>
                    </p>
                    <p>
                      <img src="~@/assets/imgs/move2.png" />
                      <span>多种搜索方式、方便快捷</span>
                    </p>
                    <p>
                      <img src="~@/assets/imgs/move3.png" />
                      <span>智能分析、精准捕捉</span>
                    </p>
                    <p>
                      <img src="~@/assets/imgs/move4.png" />
                      <span>注册时光轴、详细申报动态一目了然</span>
                    </p>
                    <p>
                      <img src="~@/assets/imgs/move5.png" />
                      <span>订阅注册数据、实时追踪申报动态</span>
                    </p>
                  </div>
                </div>
                <div class="main_con2">
                  <div class="main_lt">
                    <img src="~@/assets/imgs/zhuan.png" />
                  </div>
                  <div class="main_mid">
                    <img src="~@/assets/imgs/mid.png" />
                    <img src="~@/assets/imgs/1.png" />
                    <img src="~@/assets/imgs/4.png" />
                    <img src="~@/assets/imgs/2.png" />
                    <img src="~@/assets/imgs/3.png" />
                    <img src="~@/assets/imgs/5.png" />
                  </div>
                  <div class="main_rt">
                    <p class="p1">核心数据</p>
                    <p class="p2">高度整合 深度分析</p>
                    <span></span>
                    <p class="p3">
                      涵盖药品注册、药物报告、企业报告、药品上市、药品中标、药品销售等核心数据
                    </p>
                    <p class="p3">为医药企业提供专业精准的医药情报信息</p>
                    <p class="p3">
                      打通从研发、生产、销售、使用、投资等各个环节的信息通道
                    </p>
                  </div>
                </div>
                <div class="main_con3">
                  <div class="main_lt">
                    <p class="p1">全新升级</p>
                    <p class="p2">智能情报 体验升级</p>
                    <span></span>
                    <p class="p3">
                      更聚焦用户体验，帮助用户锁定重点、节省检索时间
                    </p>
                    <p class="p3">
                      人性化的UI和交互设计，让用户拥有更舒适的查询体验
                    </p>
                    <p class="p3">
                      智能、强大的数据分析功能，助力用户洞察数据背后的商业秘密
                    </p>
                  </div>
                  <div class="main_rt moveto">
                    <p>
                      <img src="~@/assets/imgs/fei1.png" />
                    </p>
                    <p>
                      <img src="~@/assets/imgs/fei2.png" />
                    </p>
                    <p>
                      <img src="~@/assets/imgs/fei3.png" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container_wrapper container_wrapper3">
            <div class="container">
              <div class="main_title">
                <p class="title">服务对象</p>
                <p class="subtitle">
                  药智数据企业版为国内外上1000家VIP企业提供专业数据服务
                </p>
              </div>
              <div class="main_con">
                <div class="custom">
                  <div class="custom_item">
                    <div class="top">
                      <img src="~@/assets/imgs/custom1.png" />
                    </div>
                    <p>医药研发企业</p>
                  </div>
                  <div class="custom_item">
                    <div class="top">
                      <img src="~@/assets/imgs/custom2.png" />
                    </div>
                    <p>生产企业</p>
                  </div>
                  <div class="custom_item">
                    <div class="top">
                      <img src="~@/assets/imgs/custom3.png" />
                    </div>
                    <p>研发机构</p>
                  </div>
                  <div class="custom_item">
                    <div class="top">
                      <img src="~@/assets/imgs/custom4.png" />
                    </div>
                    <p>科研院所</p>
                  </div>
                  <div class="custom_item">
                    <div class="top">
                      <img src="~@/assets/imgs/custom5.png" />
                    </div>
                    <p>医药销售公司</p>
                  </div>
                  <div class="custom_item">
                    <div class="top">
                      <img src="~@/assets/imgs/custom6.png" />
                    </div>
                    <p>投资机构</p>
                  </div>
                </div>
                <div class="introduce-foot">
                  <div class="foot_top">
                    <p class="p1">药智数据企业版</p>
                    <p class="p2">专为VIP企业用户量身打造的医药数据智能系统</p>
                    <el-button @click="showProbation('vip_bottom_applyforatrial')" class="try">立即体验</el-button>
                  </div>
                  <div class="footer">
                    <div class="footer_lt">
                      <p class="p1">
                        <a target="_blank" href="https://about.yaozh.com/about.html">关于我们</a>
                        <a href="https://vip.yaozh.com/help/list" target="_blank">帮助中心</a>
                        <a :href="`https://${handlerUrl()}.yaozh.com/service?ga_source=vip&amp;ga_position=bottom_help`"
                          target="_blank">客服中心</a>
                        <a target="_blank" href="https://www.yaozh.com/ued?source=www&amp;name=zhihui_footer">用户体验计划</a>
                      </p>
                      <p class="p2">
                        地址：重庆市南岸区茶园新区玉马路8号科创园2F（药智网）
                      </p>
                      <p class="p2">
                        客服热线：400-678-0778
                        &nbsp;&nbsp;&nbsp;&nbsp;邮箱：service@yaozh.com
                      </p>
                      <p class="p2">
                        Copyright © 2009-2022 药智网 YAOZH.COM All Rights
                        Reserved
                      </p>
                    </div>
                    <div class="footer_rt">
                      <div>
                        <img src="~@/assets/imgs/footer_erwei.jpg" />
                      </div>
                      <p class="p2">药智网二维码</p>
                    </div>
                    <div class="footer_rt">
                      <div>
                        <img src="~@/assets/imgs/scan_vipty_bottom_1.png" />
                      </div>
                      <p class="p2">药智数据APP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧固定栏 -->
          <div class="fix_box">
            <a class="a1" v-if="btnFlag" @click="backTop">
              <img src="~@/assets/imgs/back0.png" class="img0" />
              <img src="~@/assets/imgs/back1.png" class="img1" />
            </a>
            <a class="a2">
              <img src="~@/assets/imgs/back2.png" class="img0" />
              <img src="~@/assets/imgs/back3.png" class="img1" />
              <div class="erweima">
                <!-- <img src="~@/assets/imgs/appma.jpg"> -->
                <img src="~@/assets/imgs/scan_introduce_rightside_2.png" />
                <p>扫码免费下载APP</p>
              </div>
            </a>
            <a @click="handleOutClick2()" class="a3">
              <img src="~@/assets/imgs/back4.png" class="img0" />
              <img src="~@/assets/imgs/back5.png" class="img1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import crypto from "crypto-js";
import DialogProbation from "@/components/common/dialog-probation";
import { setTimeout } from "timers";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll";
import Moment from "moment";

export default {
  mixins: [detailScrollMixins],
  components: {
    LoadingGif,
    DialogProbation,
  },
  data() {
    return {
      noticeMsgStr: "",
      noticeMsg: [],
      serviceGa: "",
      navHelpShow: true,
      navShow: false,
      isLoading: true,
      dialogProbationShow: false, // 申请试用显示判断
      accountData: {
        grade_id: 0, //初始化赋值一下
      },
      btnFlag: false, //返回顶部按钮显示判断
      // isLogin: true //登录状态
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => !state.UserCenter.accountData.username,
      UserCenterAccountData: (state) => state.UserCenter.accountData,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
    vip_img() {
      // style 是为了适应不同的图片对齐文字，设计上需要进步
      let imgs = [
        { id: [4, 10, 51, 58], imgName: "vip-cj.png", style: "" }, // 初级
        { id: [5, 11, 52, 59], imgName: "vip-zj.png", style: "" }, // 中级
        { id: [6, 12, 53, 60], imgName: "vip-gj.png", style: "" }, // 高级
        { id: [7, 13, 61], imgName: "vip-tj.png", style: "margin-top: -7px;" }, // 特级
        { id: [1, 23, 55], imgName: "vip-nb.png", style: "" }, // 内部
      ];
      let obj = imgs.find((item) => {
        return item.id.indexOf(this.accountData.grade_id) != -1;
      });
      return obj
        ? {
          name: obj.imgName,
          style: obj.style,
        }
        : {
          name: "vip-default.jpg",
          style: "",
        };
    },
  },
  methods: {
    handlerUrl() {
      return location.href.includes("vip-dev") ? "vip-dev" : "vip";
    },
    navShowMouseleave(e) {
      if (e.relatedTarget != null) {
        //防止连续点击触发mouseleave
        this.navShow = false;
      }
    },
    // 使用申请弹框显示
    showProbation(t) {
      if (t) {
        window.ga("send", "event", "button", "click", t);
        window._paq.push(["trackEvent", "button", "click", t]);

        this.serviceGa =
          t === "vip_top_applyforatrial"
            ? "vip_pc_applyforatrial_submit2"
            : "vip_pc_applyforatrial_submit3";
      }
      this.dialogProbationShow = true;
    },
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/yzindex",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            // accesstoken: isPrams
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.accountData.grade_id = data.grade_id;

            this.isLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 顶部导航条UI样式自适应处理方法
    handleNavPoint() {
      let distance = 0;
      let index = -1;
      if (this.$route.path.indexOf("/introduce") == 0) {
        index = 0;
      } else if (this.$route.path.indexOf("/help") == 0) {
        index = 1;
      } else if (this.$route.path.indexOf("/updatelog") == 0) {
        index = 2;
      } else if (this.$route.path.indexOf("/service") == 0) {
        index = 3;
      } else {
        index = -1;
      }

      if (index != -1) {
        let width = $(".nav_right .right-nav-item").eq(index).width();
        for (let i = 0; i < index; i++) {
          distance =
            distance + $(".nav_right .right-nav-item").eq(i).width() + 18 + 18;
        }
        distance += 18;
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
      $(".nav_right a:eq(1)").hover(
        function () {
          $(".tip-product").show();
        },
        function () {
          $(".tip-product").hide();
        }
      );
      $(".nav_right .right-nav-item").hover(
        function () {
          let distance = 0;
          let index = $(this).index();
          let width = $(this).width();
          for (let i = 0; i < index; i++) {
            distance =
              distance +
              $(".nav_right .right-nav-item").eq(i).width() +
              18 +
              18;
          }
          distance += 18;
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
    // 时间戳+随机字符串 生成签名
    // getSignature(strArr) {
    //   let str = strArr
    //     .sort((a, b) => {
    //       a = a.charCodeAt(0);
    //       b = b.charCodeAt(0);
    //       return a - b;
    //     })
    //     .join("");
    //   return crypto
    //     .MD5(crypto.SHA1(str).toString())
    //     .toString()
    //     .toUpperCase();
    // },
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
            this.vueBackToLogin();
            location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击“客服”触发的事件 - 美洽客服
    handleOutClick2() {
      window.ga("send", "event", "button", "click", "vip_pc_introduce_kefu");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "vip_pc_introduce_kefu",
      ]);

      meiqiaCallback(function (flag) {
        if (!flag) {
          _MEIQIA("withoutBtn");
          _MEIQIA("init");
          _MEIQIA("allSet", function () {
            _MEIQIA("showPanel");
          });
        } else {
          _MEIQIA("showPanel");
        }
      });
    },
    nextPage() {
      document.getElementsByClassName("la-app-main")[0].scrollTop =
        window.screen.width > 1280 ? 850 : 600;
    },
    backTop() {
      let that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.getElementsByClassName("la-app-main")[0].scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    scrollToTop() {
      let that = this;
      let scrollTop =
        document.getElementsByClassName("la-app-main")[0].scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 300) {
        that.btnFlag = true;
        $(".introduce_nav").css("background", "#4b5af8");
        if (that.showPromtNotice) {
          $(".introduce_nav").css("top", "30px");
          $(".prompt-notice").css("position", "fixed");
        } else {
          $(".introduce_nav").css("top", "0");
          $(".prompt-notice").css("position", "fixed");
        }
      } else {
        that.btnFlag = false;
      }
      if (that.scrollTop > 100) {
        $(".introduce_nav").css("background", "#4b5af8");
        if (that.showPromtNotice) {
          $(".introduce_nav").css("top", "30px");
          $(".prompt-notice").css("position", "fixed");
        }
      } else {
        $(".introduce_nav").css("background", "transparent");
        $(".prompt-notice").css("position", "unset");
      }
    },
    introduce() {
      let hosts = "";
      if (window.location.host.indexOf("dev") > -1) {
        hosts = "https://db-dev.yaozh.com";
      } else {
        hosts = "https://db.yaozh.com";
      }
      window.open(
        hosts + "/app?ga_source=vip&ga_name=vip_introduce_topnav",
        "_blank"
      );
    },
    redirect(url, type = 1) {
      if (type == 1) {
        // 进入帮助中心
        // this.$router.push({
        //   path: url
        // })
        window.open(url, "_blank");
      } else {
        // 手册下载
        // window.open("/static/imgs/pdf/product_manual.pdf");
        // 产品手册更换为服务器地址
        if (this.isLogin) {
          // 没有登录就跳到登录页面
          this.$router.push({
            path: `/login`,
            query: {
              ga_source: 'vip',
              ga_name: 'introduce'
            }
          })
        } else {
          //登录了打开手册
          window.open("https://zy.yaozh.com/product_manual.pdf");
        }
      }
    },
    show() {
      // if (this.noticeMsg.length == 0) return;
      $(".text-container").css("visibility", "hidden");
      let $ul = $(".text-container .inner ul"),
        width = $(".text-container .inner ul").width(),
        speed = 0.04;
      if (width == 0) width = $(window).width() - 1200;
      if (width > parseInt($(".text-container").width() / 2)) {
        let html =
          `
          .text-container .inner { animation: marquee ` +
          width / speed +
          `ms linear infinite; }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-` +
          width +
          `px);
            }
          }`;
        let cloneStr = $(".text-container .inner").html();
        $(".text-container .inner").append(cloneStr); //复制n个增加宽度
        $("#marquee").html(html);
      }
      $(".text-container").css("visibility", "visible");
    },
    closeNotice() {
      this.noticeMsg = [];
      this.noticeMsgStr = "";
      localStorage.isFirstNotice = true;
      this.$store.commit("showPromtNotice", false);
      this.scrollToTop();
    },
    getNoticeMsg() {
      const that = this;
      window.Axios.post("/api/config/notice")
        .then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let curTimeStamp = Moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            that.noticeMsg = [];
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
                that.noticeMsg.push(item);
              }
            });
            that.noticeMsgStr = "";
            that.noticeMsg.forEach((item) => {
              that.noticeMsgStr +=
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                item.content;
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
                  console.log(2);
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
                    console.log(3);
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
  },
  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "产品介绍页"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "产品介绍页"]);
    }, 1000);
  },
  watch: {
    isLogin(o, n) {
      // console.info(this.UserCenterAccountData)
      if (!o) {
        // this.UserCenterAccountData.picture = this.vueGetCookie("userPicture");
        this.handleAxios();
      }
    },
    // isLoading(val) {
    //   if (!val) {
    //     // 获取公告数据
    //     this.getNoticeMsg();
    //   }
    // },
    showPromtNotice: {
      handler(val) {
        this.registerEven();
      },
    },
  },
  mounted() {
    let style = document.createElement("style");
    style.id = "marquee";
    document.getElementsByTagName("head")[0].appendChild(style);
    // 获取公告数据
    this.getNoticeMsg();

    if (!this.$route.query.ga_source && !this.$route.query.ga_name) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {
          ga_source: "vip",
          ga_name: "vip_pc",
        }),
      });
    }

    console.log(this.$route.query);
    let query = this.$route.query;
    if (query) {
      document.title = `试用申请${query.ga_source ? "-" + query.ga_source : ""
        }${query.ga_name ? "-" + query.ga_name : ""}${query.back_url ? "-" + query.back_url : ""
        }-药智数据企业版`;
    } else {
      document.title = "试用申请-药智数据企业版";
    }
    // 约定判断是否打开试用申请
    if (this.$route.query.tryout == 1) {
      this.dialogProbationShow = true;
      this.serviceGa = "vip_pc_applyforatrial_submit0";
    }

    setTimeout(() => {
      this.handleNavPoint();
      this.handleNavHover();
    }, 3000);

    window.global = {
      methods: {
        showProbation: this.showProbation,
      },
    };
    if (window.screen.width > 1280) {
      window.addEventListener("scroll", srcollEvent, true); //第一个动画
      window.addEventListener("scroll", srcollTwo, true); //第二个动画
    }
    window.addEventListener("scroll", this.scrollToTop, true); //返回顶部
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
};
// 第一个动画
function srcollEvent() {
  // $('.move_left').css('opacity','1');
  // setTimeout(()=>{
  //    $('.move_left').css('opacity','1');
  // },4000)

  // $('.move_lt').css('opacity','1');
  let dom = $(".move_rt p");
  let h = 900;
  let remove = false;
  if (remove) {
    window.removeEventListener("scroll", srcollEvent);
  }
  for (let i = 0; i < dom.length; i++) {
    remove = true;
    if (getScrollTop() - h > dom[i].offsetTop && !dom[i].first) {
      dom[i].first = true;
      dom[i].style.transform = " translate(0px)";
      if (dom[dom.length - 1].first) {
        $(".move_lt img").animate({ opacity: 1 }, 3000);
      }
      // setTimeout(()=>{
      //   $('.move_lt img').css('opacity','1');
      // },5000)
    }
    if (!dom[i].first) {
      remove = false;
    }
  }
}
function srcollTwo() {
  let dom = $(".moveto p");
  let h = 3000;
  let remove = false;
  if (remove) {
    window.removeEventListener("scroll", srcollEvent);
  }

  for (let i = 0; i < dom.length; i++) {
    remove = true;
    if (getScrollTop() - h > dom[i].offsetTop && !dom[i].first) {
      dom[i].first = true;
      dom[i].style.transform = " translate(0px)";
    }
    if (!dom[i].first) {
      remove = false;
    }
  }
}
// 第二个动画
function getScrollTop() {
  var scrollTop = 0;
  var scrollTop =
    document.getElementsByClassName("la-app-main")[0].scrollTop;
  return scrollTop;
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";

.fullscreen-loading {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.icon-color {
  color: #fff;
  margin: 0 10px 0 5px;
}

p {
  padding: 0;
  margin: 0;
}

.introduce_header {
  width: 1200px;
  height: 66px;
  line-height: 66px;
  margin: 0 auto;
  position: relative;

  .logo {
    // height: 29px;
    // width: 254px;
    // padding: 7.5px 17px;
    // float: left;
    position: absolute;
    top: 0;
    left: 0;

    img {
      // width: 172px;
      // height: 100%;
      vertical-align: middle;
    }
  }

  .nav_right {
    height: 66px;
    // float: right;
    font-size: 16px;
    // position: relative;
    position: absolute;
    top: 0;
    right: 280px;
    // overflow: hidden;
    border-radius: 5px;
    margin-right: 82px;

    .slide-z {
      position: absolute;
      width: 0px;
      height: 5px;
      background: #fff;
      border-radius: 3px;
      bottom: 0px;
      left: 0px;
    }

    a {
      line-height: 66px;
      height: 100%;
      float: left;
      padding: 0px 18px;
      color: @White;
      position: relative;
      text-decoration: none;
    }
  }
}

.tohome {
  // float:right;
  position: absolute;
  top: 0;
  right: 238px;

  .tohome_btn {
    display: inline-block;
    width: 104px;
    height: 30px;
    line-height: 30px;
    border-radius: 30px;
    border: 1px solid #fff;
    color: #fff;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
  }

  .tohome_btn:hover {
    background: #fff;
    color: #4b5af8;
  }
}

.nav_login {
  // float: right;
  position: absolute;
  top: 0;
  right: 0;

  .login_btn {
    display: inline-block;
    width: 84px;
    height: 32px;
    line-height: 32px;
    border-radius: 32px;
    border: 1px solid #fff;
    color: #fff;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
  }

  .login_btn:hover {
    background: #fff;
    color: #4b5af8;
  }

  .nav_login_img {
    display: flex;
    align-items: center;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
  }

  .el-dropdown-link:focus {
    outline: none;
  }

  .avatar {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 42px;
    text-decoration: none;

    .user-img-wrap {
      display: inline-block;
      width: 34px;
      height: 34px;
      border-radius: 34px;
      border: 1px solid #fff;
      overflow: hidden;

      .user-img {
        width: 34px;
        height: 34px;
      }
    }

    .user-name {
      margin-left: 5px;
      color: @White;
      font-size: 13px;
      display: inline-block;
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }
  }

  .power {
    display: inline-block;
    height: 16px;
    line-height: 16px;

    img {
      float: left;
    }

    span {
      margin-left: 9px;
      float: left;
    }
  }
}

.introduce {
  margin: 0;
  width: 100%;
  height: auto;

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
          display: flex;
          white-space: nowrap;
          list-style: none;
        }

        li {
          float: left;
        }
      }

      .close_notice_icon {
        cursor: pointer;
      }
    }
  }
}

.introduce_wrapper {
  min-width: 1280px;
  height: 100%;
  margin: 0 auto;
  position: relative;

  .introduce_nav {
    width: 100%;
    height: 66px;
    // position: absolute;
    // top: 32px;
    // left: 0;
    position: fixed;
    // background:#4b5af8;
    z-index: 99;
  }

  .introduce_container {
    width: 100%;
  }
}

.introduce_top {
  position: relative;
  width: 100%;
  height: 908px;
  background: url(~@/assets/imgs/header_bg.png) no-repeat center top;
  background-size: 100% auto;
}

.container_wrapper2 {
  width: 100%;
  height: 2566px;
  background: url(~@/assets/imgs/middle_bg.jpg) no-repeat center top;

  .container {
    position: relative;
  }
}

.drop {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  bottom: 40px;
  margin-left: -30px;
  background: #fff;
  box-shadow: 3px 5px 14px 3px #e8eaf2;
  animation: drop 0.5s ease infinite alternate;
  -webkit-animation: drop 0.5s ease infinite alternate;

  span {
    display: inline-block;
    width: 16px;
    height: 2px;
    background: #4b5af8;
    position: absolute;
  }

  .span1 {
    top: 32px;
    left: 16px;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    /* IE 9 */
    -webkit-transform: rotate(45deg);
    /* Safari and Chrome */
  }

  .span2 {
    top: 32px;
    left: 27px;
    transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    /* IE 9 */
    -webkit-transform: rotate(-45deg);
    /* Safari and Chrome */
  }
}

.drop:hover {
  background: linear-gradient(to right, #49ebe6, #20b0fb);
  cursor: pointer;
}

.drop:hover span {
  background: #fff;
}

@keyframes drop {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-5px);
  }

  100% {
    transform: translateY(-10px);
  }
}

.main_con2 {
  // overflow:hidden;
  position: relative;

  .main_lt {
    width: 420px;
    animation: a 3000s;
    position: relative;

    @keyframes a {
      form {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(36000deg);
      }
    }

    @keyframes b {
      form {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(-36000deg);
      }
    }
  }

  .main_mid {
    position: absolute;
    top: 10px;
    left: 0px;

    img:nth-child(1) {
      position: absolute;
      top: 96px;
      left: 102px;
      // animation: b 3000s;
      // transform-origin: center center;
    }

    img:nth-child(2) {
      position: absolute;
      top: -52px;
      left: 164px;
      // animation: b 3000s;
      // transform-origin: center center;
    }

    img:nth-child(3) {
      position: absolute;
      top: 94px;
      left: 340px;
      // animation: b 3000s;
      // transform-origin: center center;
    }

    img:nth-child(4) {
      position: absolute;
      top: 286px;
      left: 282px;
      // animation: b 3000s;
      // transform-origin: center center;
    }

    img:nth-child(5) {
      position: absolute;
      top: 284px;
      left: 30px;

      // animation: b 3000s;
      // transform-origin: center center;
    }

    img:nth-child(6) {
      position: absolute;
      top: 94px;
      left: -20px;

      // animation: b 3000s;
      // transform-origin: center center;
    }
  }
}

.main_con1 {
  margin: 128px 0 480px 0;
  position: relative;

  .move_lt img {
    opacity: 0;
    // display: none;
    // animation:movelt 2s linear;
  }

  .move_rt {
    position: absolute;
    top: -8px;
    right: 0;
    width: 510px;

    p {
      color: #4b5af8;
      font-size: 20px;
      position: relative;
      transform: translate(-800px);
      transition: transform 1.8s;

      img {
        vertical-align: middle;
        margin-right: 6px;
      }
    }

    p:nth-child(1) {
      left: 0px;
      transition-delay: 0s;
    }

    p:nth-child(2) {
      left: 100px;
      transition-delay: 0.1s;
    }

    p:nth-child(3) {
      left: 200px;
      transition-delay: 0.2s;
    }

    p:nth-child(4) {
      left: 100px;
      transition-delay: 0.3s;
    }

    p:nth-child(5) {
      left: 0px;
      transition-delay: 0.4s;
    }
  }
}

.container_wrapper3 {
  width: 100%;
  height: 1316px;
  background: url(~@/assets/imgs/footer_bg.jpg) no-repeat center top;

  .container {
    position: relative;

    .custom {
      overflow: hidden;
      margin-top: 130px;
      display: flex;
    }
  }
}

.main_con3 {
  position: relative;
  top: 360px;
  left: 0;
  // overflow: hidden;
  width: 100%;

  .main_lt {
    // float: left;
    color: #fff;
    padding-top: 86px;

    .p1 {
      font-size: 30px;
      color: #4b5af8;
    }

    .p2 {
      font-size: 14px;
      color: #999999;
    }

    span {
      display: block;
      width: 20px;
      height: 2px;
      background: #4b5af8;
      margin: 14px 0 45px 0;
    }

    .p3 {
      font-size: 18px;
      color: #666;
    }
  }

  .moveto {
    // float: right;
    position: absolute;
    top: -4px;
    right: 0;
    width: 527px;
    height: 438px;
    background: url(~@/assets/imgs/introa1.png) no-repeat center top;

    p {
      color: #4b5af8;
      font-size: 20px;
      position: relative;
      transform: translate(-300px);
      transition: transform 0.8s;
      left: 74px;

      img {
        vertical-align: middle;
        margin-right: 6px;
      }
    }

    p:nth-child(1) {
      top: 80px;
      transition-delay: 0s;
    }

    p:nth-child(2) {
      top: 96px;
      transition-delay: 0.1s;
    }

    p:nth-child(3) {
      top: 112px;
      transition-delay: 0.2s;
    }
  }
}

.main_rt {
  position: absolute;
  right: 0;
  top: 68px;
  color: #fff;

  .p1 {
    font-size: 30px;
  }

  .p2 {
    font-size: 14px;
  }

  span {
    display: block;
    width: 20px;
    height: 2px;
    background: #fff;
    margin: 14px 0 45px 0;
  }

  .p3 {
    font-size: 18px;
  }
}

.custom_item {
  float: left;
  width: 200px;
  text-align: center;
  cursor: pointer;

  .top {
    width: 130px;
    height: 130px;
    line-height: 130px;
    margin: 10px auto;
    border-radius: 50%;

    img {
      vertical-align: middle;
    }
  }

  p {
    color: #333333;
    font-size: 20px;
    margin-top: 60px;
  }

  &:hover .top {
    background: #fff;
    box-shadow: 3px 5px 14px 3px #e2e4ed;
  }

  &:hover p {
    color: #4b5af8;
  }
}

.container_wrapper {
  .container {
    width: 1200px;
    margin: 0px auto;

    .main_title {
      text-align: center;
      padding-top: 80px;

      .title {
        font-size: 30px;
        color: #4b5af8;
        position: relative;

        &:after {
          content: " ";
          display: block;
          width: 20px;
          height: 2px;
          background: #4b5af8;
          text-align: center;
          position: absolute;
          top: 47px;
          left: 50%;
          margin-left: -10px;
        }
      }

      .subtitle {
        font-size: 14px;
        color: #a6a6a7;
        margin-top: 10px;
      }
    }

    .main_con {
      margin-top: 60px;
      padding-bottom: 80px;
    }
  }
}

.heder_con {
  width: 1200px;
  margin: 0 auto;
  color: #fff;
  position: relative;

  .p1 {
    position: absolute;

    left: 0px;
    top: 380px;
    font-size: 50px;
    animation: pone 1s ease;
    -webkit-animation: pone 1s ease;
  }

  // .p2 {
  //   position: absolute;
  //   left: 0px;
  //   top: 485px;
  //   font-size: 63px;
  //   animation: ptwo 1s ease;
  //   -webkit-animation: ptwo 1s ease;
  // }
  .p3 {
    position: absolute;
    width: 350px;
    left: 0px;
    letter-spacing: 6px;
    top: 450px;
    font-size: 22px;
    animation: pthree 1s ease;
    -webkit-animation: pthree 1s ease;
  }

  .p4 {
    position: absolute;
    left: 0px;
    top: 510px;
    font-size: 20px;
    animation: pfour 1s ease;
    -webkit-animation: pfour 1s ease;

    .p4_img {
      padding-left: 27px;
      height: 32px;
      margin-right: 33px;
      background: url(~@/assets/imgs/introduce/img_1.png) no-repeat left center;
      //background-size: auto 100%;
    }

    .p4_img:nth-child(2) {
      background: url(~@/assets/imgs/introduce/img_2.png) no-repeat left center;
      // background-size: auto 100%;
    }

    .p4_img:nth-child(3) {
      background: url(~@/assets/imgs/introduce/img_3.png) no-repeat left center;
      //background-size: auto 100%;
    }

    .p4_img:nth-child(4) {
      background: url(~@/assets/imgs/introduce/img_4.png) no-repeat left center;
      //background-size: auto 100%;
    }
  }

  .el-button {
    position: absolute;
    left: 0px;
    top: 590px;
    width: 158px;
    height: 40px;
    border-radius: 25px;
    margin-top: 32px;
    font-size: 16px;
    color: #fff;
    background: linear-gradient(to right, #49ebe6, #20b0fb);
    border: none;
    animation: pfive 1s ease;
    -webkit-animation: pfive 1s ease;
  }

  .el-button:hover {
    background: linear-gradient(to right, #4ccfec, #3586fa);
  }

  @keyframes pone {
    0% {
      left: 854px;
      top: 490px;
      font-size: 14px;
    }

    100% {
      left: 0px;
      top: 380px;
      font-size: 50px;
    }
  }

  @keyframes ptwo {
    0% {
      left: 854px;
      top: 520px;
      font-size: 14px;
    }

    100% {
      left: 0px;
      top: 365px;
      font-size: 63px;
    }
  }

  @keyframes pthree {
    0% {
      left: 854px;
      top: 540px;
      font-size: 14px;
    }

    100% {
      left: 0px;
      top: 450px;
      font-size: 22px;
    }
  }

  @keyframes pfour {
    0% {
      left: 854px;
      top: 540px;
      font-size: 14px;
    }

    100% {
      left: 0px;
      top: 510px;
      font-size: 20px;
    }
  }

  @keyframes pfive {
    0% {
      left: 854px;
      top: 540px;
      font-size: 16px;
    }

    100% {
      left: 0px;
      top: 590px;
      font-size: 16px;
    }
  }
}

.lineone {
  overflow: hidden;
  display: flex;

  .one {
    float: left;
    width: 380px;
    height: 256px;
    text-align: center;
    // background:green;
    border-radius: 16px;
    margin: 10px 10px 15px;

    // box-shadow: 1px 3px 12px 2px red;
    div {
      width: 40px;
      height: 40px;
      margin: 66px auto 30px;
      // background:yellow;
    }

    .div1 {
      width: 80px;
      height: 44px;
      background: url(~@/assets/imgs/block1.jpg) no-repeat 0px 0px;
    }

    .div2 {
      width: 80px;
      height: 44px;
      background: url(~@/assets/imgs/block1.jpg) no-repeat -415px 0px;
    }

    .div3 {
      width: 80px;
      height: 44px;
      background: url(~@/assets/imgs/block1.jpg) no-repeat -830px 0px;
    }

    .div4 {
      width: 80px;
      height: 46px;
      background: url(~@/assets/imgs/block1.jpg) no-repeat 0px -298px;
    }

    .div5 {
      width: 80px;
      height: 46px;
      background: url(~@/assets/imgs/block1.jpg) no-repeat -415px -298px;
    }

    .div6 {
      width: 80px;
      height: 46px;
      background: url(~@/assets/imgs/block1.jpg) no-repeat -830px -298px;
    }

    p {
      color: #333;
      font-size: 18px;
    }

    // box-shadow:3px 5px 14px 3px rgba(233, 28, 28, 0.61)
  }

  .one:hover {
    cursor: pointer;
    // box-shadow: 3px 5px 14px 3px #e8eaf2;
    box-shadow: 1px 3px 12px 2px #e8eaf2;
  }
}

.introduce-foot {
  position: absolute;
  width: 100%;
  top: 800px;
  left: 0;

  .foot_top {
    color: #fff;
    text-align: center;
    padding-bottom: 90px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .p1 {
      font-size: 30px;
    }

    .p2 {
      font-size: 14px;
      margin: 14px 0 20px 0;
    }

    .try {
      width: 158px;
      height: 40px;
      border-radius: 25px;
      margin-top: 32px;
      font-size: 16px;
      color: #fff;
      background: linear-gradient(to right, #49ebe6, #20b0fb);
      border: none;
    }

    .try:hover {
      background: linear-gradient(to right, #4ccfec, #3586fa);
    }
  }

  .footer {
    overflow: hidden;
  }
}

.footer_lt {
  float: left;
  color: #fff;

  .p1 {
    margin: 40px 0 46px 0;

    a {
      font-size: 16px;
      display: inline-block;
      margin-right: 80px;
      color: #fff;
    }
  }

  .p2 {
    font-size: 14px;
  }
}

.footer_rt {
  float: right;
  text-align: center;
  margin-left: 30px;
  margin-top: 40px;

  p {
    color: #fff;
    font-size: 14px;
    // margin-bottom: 6px;
  }

  .p1 {
    margin-top: 40px;
  }

  img {
    margin: 6px 0 2px;
    width: 110px;
  }
}

.fix_box {
  position: fixed;
  // left: 1600px;
  right: 200px;
  bottom: 90px;

  // width: 200px;
  // height: 300px;
  a {
    display: block;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 10px;

    img {
      position: relative;
      top: 12px;
      left: 12px;
    }
  }

  .a1 {
    background: #fff;

    .img0 {
      display: none;
    }
  }

  .a1:hover {
    background: #4b5af8;
  }

  .a1:hover .img1 {
    display: none;
  }

  .a1:hover .img0 {
    display: block;
  }

  .a2 {
    background: #fff;
    position: relative;

    .img0 {
      display: none;
    }

    .erweima {
      position: absolute;
      top: 0px;
      right: 90px;
      width: 146px;
      height: 165px;
      background: #fff;
      text-align: center;
      display: none;

      img {
        display: block;
        width: 120px;
      }

      p {
        margin-top: 20px;
      }
    }
  }

  .a2:hover {
    background: #4b5af8;
  }

  .a2:hover .img1 {
    display: none;
  }

  .a2:hover .img0 {
    display: block;
  }

  .a2:hover .erweima {
    display: block;
  }

  .a3 {
    background: #fff;

    .img0 {
      display: none;
    }
  }

  .a3:hover {
    background: #4b5af8;
  }

  .a3:hover .img1 {
    display: none;
  }

  .a3:hover .img0 {
    display: block;
  }
}

.tip-product {
  display: none;
  position: absolute;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #626262;
  padding: 1px;
  left: 6px;
  top: 53px;
  z-index: 200;
  line-height: 26px;
  border-radius: 3px;
  text-align: center;

  .el-icon-caret-top {
    height: 14px;
    line-height: 0;
    position: absolute;
    top: -2px;
    left: 50%;
    margin-left: -7px;
  }

  .el-icon-caret-top:before {
    color: #fff;
  }

  span {
    display: inline-block;
    width: 100%;
    margin-bottom: 6px;
    padding: 4px 0;
  }

  span:hover {
    background: #4b5af8;
    color: #fff;
  }

  span:last-child {
    margin-bottom: 0;
  }
}

.in_sel,
.nav-all {
  display: none;
}

// @media screen and (max-width: 1281px) {
//   .introduce_top {
//     height: 640px;
//   }
//   .heder_con {
//     .p1 {
//       top: 160px;
//     }
//     .p2 {
//       top: 200px;
//     }
//     .p3 {
//       top: 300px;
//     }
//     .p4 {
//       top: 330px;
//     }
//     .el-button {
//       top: 360px;
//     }
//     .el-button:hover {
//       background: linear-gradient(to right, #4ccfec, #3586fa);
//     }
//     @keyframes pone {
//       0% {
//         left: 854px;
//         top: 160px;
//         font-size: 14px;
//       }
//       100% {
//         left: 0px;
//         top: 160px;
//         font-size: 36px;
//       }
//     }
//     @keyframes ptwo {
//       0% {
//         left: 854px;
//         top: 300px;
//         font-size: 14px;
//       }
//       100% {
//         left: 0px;
//         top: 200px;
//         font-size: 63px;
//       }
//     }
//     @keyframes pthree {
//       0% {
//         left: 854px;
//         top: 540px;
//         font-size: 14px;
//       }
//       100% {
//         left: 0px;
//         top: 300px;
//         font-size: 20px;
//       }
//     }
//     @keyframes pfour {
//       0% {
//         left: 854px;
//         top: 540px;
//         font-size: 14px;
//       }
//       100% {
//         left: 0px;
//         top: 330px;
//         font-size: 20px;
//       }
//     }
//     @keyframes pfive {
//       0% {
//         left: 854px;
//         top: 540px;
//         font-size: 16px;
//       }
//       100% {
//         left: 0px;
//         top: 360px;
//         font-size: 16px;
//       }
//     }
//   }
// }
@media screen and (min-width: 1281px) and (max-width: 1460px) {
  .introduce {
    .introduce_wrapper {
      .introduce_top {
        height: 684px;

        .heder_con {
          .p1 {
            top: 240px;
            font-size: 44px;
          }

          .p2 {
            top: 232px;
          }

          .p3 {
            top: 300px;
            font-size: 20px;
          }

          .p4 {
            top: 352px;
            font-size: 20px;
          }

          .el-button {
            top: 430px;
          }

          .el-button:hover {
            background: linear-gradient(to right, #4ccfec, #3586fa);
          }

          @keyframes pone {
            0% {
              left: 854px;
              top: 220px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 240px;
              font-size: 44px;
            }
          }

          @keyframes ptwo {
            0% {
              left: 854px;
              top: 300px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 232px;
              font-size: 63px;
            }
          }

          @keyframes pthree {
            0% {
              left: 854px;
              top: 540px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 300px;
              font-size: 20px;
            }
          }

          @keyframes pfour {
            0% {
              left: 854px;
              top: 540px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 352px;
              font-size: 20px;
            }
          }

          @keyframes pfive {
            0% {
              left: 854px;
              top: 540px;
              font-size: 16px;
            }

            100% {
              left: 0px;
              top: 430px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1461px) and (max-width: 1620px) {
  .introduce {
    .introduce_wrapper {
      .introduce_top {
        height: 750px;

        .heder_con {
          .p1 {
            top: 300px;
            font-size: 50px;
          }

          .p2 {
            top: 340px;
          }

          .p3 {
            top: 370px;
          }

          .p4 {
            top: 440px;
          }

          .el-button {
            top: 520px;
          }

          .el-button:hover {
            background: linear-gradient(to right, #4ccfec, #3586fa);
          }

          @keyframes pone {
            0% {
              left: 854px;
              top: 220px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 300px;
              font-size: 50px;
            }
          }

          @keyframes ptwo {
            0% {
              left: 854px;
              top: 300px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 232px;
              font-size: 63px;
            }
          }

          @keyframes pthree {
            0% {
              left: 854px;
              top: 540px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 370px;
              font-size: 20px;
            }
          }

          @keyframes pfour {
            0% {
              left: 854px;
              top: 540px;
              font-size: 14px;
            }

            100% {
              left: 0px;
              top: 440px;
              font-size: 20px;
            }
          }

          @keyframes pfive {
            0% {
              left: 854px;
              top: 540px;
              font-size: 16px;
            }

            100% {
              left: 0px;
              top: 520px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .nav_login {
    right: 70px;
  }

  .nav_right {
    display: none;
  }

  .introduce_header {
    width: auto;

    .logo {
      left: 20px;
    }
  }

  .in_sel {
    display: block;
    position: absolute;
    top: 0;
    right: 20px;

    img {
      vertical-align: middle;
    }
  }

  .nav-all {
    display: block;
    position: relative;
    top: 66px;
    left: 0;
    width: 100%;
    background: #edeffe;
    min-height: 66px;

    ul {
      display: flex;
      margin-right: 20px;

      li {
        flex: 1;
        text-align: center;

        &:nth-child(2n) {
          flex: 0.3;
          position: relative;

          &:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 1px;
            top: 32px;
            left: 0;
            background: #cdd1fd;
          }
        }

        &>a {
          font-size: 16px;
          color: #4b5af8;
        }
      }
    }
  }

  .help_sel {
    margin-top: -14px;
    padding-bottom: 14px;

    span {
      display: block;
      height: 26px;
      line-height: 26px;

      a {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .nav-rotate-show {
    position: relative;
    display: inline-block;
    transform-origin: center center;
    height: 12px;
    transform: rotate(180deg);
    top: -4px;
    left: 16px;

    span {
      position: absolute;
      height: 2px;
      width: 8px;
      display: block;
      top: 0;
      left: 0;
      background: #4b5af8;

      &:first-child {
        transform: rotate(45deg);
      }

      &:last-child {
        transform: rotate(-45deg);
        left: 5px;
      }
    }
  }

  .nav-rotate-hide {
    top: 5px;
    left: 3px;
    transform: rotate(0);
  }

  .slide-enter-active {
    transition: all 0.3s ease;
  }

  .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter,
  .slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }

  .tohome {
    right: 290px;
  }

  .fix_box {
    right: 20px;
  }

  .introduce_wrapper {
    min-width: auto;
  }

  .container_wrapper {
    .container {
      width: auto;
      padding: 0 40px;

      .main_con {
        margin-top: 0;
        padding-bottom: 0;
      }
    }
  }

  .introduce-foot {
    top: 530px;

    .foot_top {
      padding-bottom: 55px;

      .p1 {
        font-size: 24px;
      }
    }
  }

  .footer {
    padding: 0 60px;
  }

  .lineone {
    .one {
      width: 270px;
      flex: 1;
    }
  }

  .heder_con {
    width: 700px;

    .p1,
    .p2,
    .p3,
    .p4,
    .el-button {
      animation: unset;
    }

    .p1 {
      font-size: 32px;
      top: 155px;
    }

    .p2 {
      font-size: 50px;
    }

    .p3,
    .p4 {
      font-size: 14px;
    }

    .p3 {
      top: 200px;
      width: 230px;
    }

    .p4 {
      top: 250px;

      width: 300px;

      .p4_img {
        height: 20px;
        margin-bottom: 10px;
      }
    }

    .el-button {
      margin-top: 0;
      top: 360px;
    }
  }

  .custom_item {
    width: 150px;
    flex: 1;
  }

  .main_rt {
    width: 400px;
  }

  .main_con3 {
    .main_lt {
      padding-top: 8px;
      margin-left: 30px;
    }

    .moveto {
      background-size: 290px;
      width: 290px;
      height: 250px;
      top: 0;
      right: 30px;

      p {
        transform: translate(0);
        left: 46px;

        &:nth-child(1) {
          top: 40px;
        }

        &:nth-child(2) {
          top: 50px;
        }

        &:nth-child(3) {
          top: 60px;
        }

        img {
          width: 132px;
        }
      }
    }
  }

  .container_wrapper2 {
    height: 2100px;
    background-position: center -130px;
    background-size: 1780px;
  }

  .main_con1 {
    margin: 90px 0 390px 0;

    .move_lt {
      img {
        width: 440px;
        opacity: 1;
      }
    }

    .move_rt {
      top: -38px;

      p {
        transform: translate(0);
      }
    }
  }

  .container_wrapper3 {
    height: 960px;
    background-position: center -260px;

    .container {
      .custom {
        margin-top: 0;
      }
    }
  }

  .main_con2 {

    .main_lt,
    .main_mid {
      left: 50px;
    }
  }

  .drop {
    width: 30px;
    height: 30px;
    margin-left: -15px;
    bottom: 20px;

    span {
      width: 10px;
    }

    .span1,
    .span2 {
      top: 16px;
    }

    .span1 {
      left: 8px;
    }

    .span2 {
      left: 14px;
    }
  }

  .introduce_top {
    height: 490px;
    background-size: cover;
    background-position: center bottom;
  }
}

@media screen and (max-width: 1000px) {
  .introduce_top {
    height: 380px;
  }

  .heder_con {
    .p1 {
      top: 90px;
    }

    .p2 {
      top: 125px;
    }

    .p3 {
      width: 224px;
      top: 130px;
      letter-spacing: 2px;
    }

    .p4 {
      top: 170px;
    }

    .el-button {
      top: 270px;
    }
  }

  .footer {
    padding: 0 22px;
  }

  .footer_lt {
    .p1 {
      a {
        margin-right: 16px;
      }
    }
  }

  .drop {
    display: none;
  }

  .container_wrapper {
    .container {
      padding: 0;
    }
  }

  .container_wrapper2 {
    background-size: 1720px;
    height: 1930px;
  }

  .main_con1 {
    .move_rt {
      p {
        font-size: 18px;
      }
    }
  }

  .main_con2 {
    .main_lt {
      width: 290px;

      img {
        width: 290px;
      }
    }

    .main_mid {
      img {
        &:nth-child(1) {
          width: 150px;
          top: 72px;
          left: 75px;
        }

        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5) {
          width: 70px;
        }

        &:nth-child(2) {
          top: -32px;
          left: 116px;
        }

        &:nth-child(3) {
          top: 100px;
          left: 243px;
        }

        &:nth-child(4) {
          top: 225px;
          left: 116px;
        }

        &:nth-child(5) {
          top: 100px;
          left: -25px;
        }
      }
    }
  }

  .main_rt {
    width: 340px;
    right: 15px;

    .p3 {
      font-size: 14px;
    }
  }

  .main_con3 {
    .main_lt {
      .p3 {
        font-size: 14px;
      }
    }
  }

  .main_rt {
    top: 0;
  }

  .custom_item {
    p {
      font-size: 18px;
    }
  }
}
</style>
<style lang="less">
@keyframes movelt {
  form {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
