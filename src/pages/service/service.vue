<template>
    <div>
        <!-- 自定义加载界面 -->
        <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
        <div class="service" v-else>
            <!-- 升级消息公告 -->
            <transition name="el-fade-in-linear">
                <marquee-kz v-if="noticeMsg.length > 0 && showPromtNotice" :noticeMsg="noticeMsg"
                    @closeNotice="closeNotice">
                </marquee-kz>
            </transition>

            <!-- 试用申请弹出框 -->
            <el-dialog :visible.sync="dialogProbationShow" :modal-append-to-body="false" width="850px">
                <div slot="title" class="dialog-header">
                    <span>试用申请</span>
                </div>
                <DialogProbation :serviceGa="serviceGa"></DialogProbation>
            </el-dialog>
            <div class="service_wrapper">
                <!-- 顶部导航 -->
                <div class="service_nav">
                    <div class="service_header">
                        <router-link tag="a" to="/introduce">
                            <div class="logo">
                                <img src="~@/assets/imgs/intro_logo.png">
                            </div>
                        </router-link>
                        <nav class="nav_right">
                            <router-link tag="a" class="right-nav-item" to="/introduce" exact>首页</router-link>
                            <router-link tag="a" class="right-nav-item"
                                to="/help?ga_source=vip&ga_name=vip_service_topnav" exact>帮助中心</router-link>
                            <router-link tag="a" class="right-nav-item"
                                to="/updatelog?ga_source=vip&ga_name=vip_updatelog_list_topnav" exact>更新日志</router-link>
                            <router-link tag="a" class="right-nav-item"
                                to="/service?ga_source=vip&ga_name=vip_service_topnav" exact>客服中心</router-link>
                            <!-- <router-link tag="a" class="right-nav-item" to="/" @click.native="introduce" exact>掌上数据库</router-link> -->
                            <a class="right-nav-item" href="javascript:;" @click="introduce" exact>掌上数据库</a>
                            <!-- nav底部滑动交互条 -->
                            <div class="slide-z"></div>
                        </nav>
                    </div>
                </div>
                <!-- header中间部分 -->
                <div class="service_top">
                    <el-button @click="showProbation('viptrial_service')">免费试用</el-button>
                </div>
                <!-- 内容部分 -->
                <div class="service_container">
                    <!-- 第一部分内容 -->
                    <div class="container_top">
                        <div class="container">
                            <div class="title">药智服务</div>
                            <div class="subtitle">COMPANY SERVICES</div>
                            <div class="yaozh-service">
                                <div class="yaozh-service-child clearfix">
                                    <div class="vline"></div>
                                    <div class="mark clearfix">
                                        <p class="child-title"><i class="iconfont">&#xe67b;</i>药智数据</p>
                                        <p class="child-desc">
                                        <ul>
                                            <li><em></em>数据深度加工，挖掘药物精准信息；</li>
                                            <li><em></em>可视多维分析，洞见医药竞争态势；</li>
                                            <li><em></em>极致的数据库体验，助力医药行业发展；</li>
                                        </ul>
                                        </p>
                                    </div>
                                </div>
                                <div class="yaozh-service-child clearfix">
                                    <div class="vline"></div>
                                    <div class="mark">
                                        <p class="child-title"><i class="iconfont"
                                                style="font-size: 18px;">&#xe67c;</i>药智咨询</p>
                                        <p class="child-desc">
                                        <ul>
                                            <li><em></em>药物立项/评估、行业研究、产品筛选；</li>
                                            <li><em></em>医药大数据挖掘、处理、分析服务；</li>
                                            <li><em></em>专利布局与挑战、侵权分析、价值评估；</li>
                                            <li><em></em>项目推荐服务、项目技术与价值评估；</li>
                                        </ul>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container containertop">
                            <div class="title">药智数据</div>
                            <div class="subtitle">DATABASE CONSULTANT</div>
                            <!-- <div class="content">
                                <div class="row header">
                                    <div class="col">联系人</div>
                                    <div class="col">联系方式</div>
                                    <div class="col">在线咨询</div>
                                </div>

                                <template v-for="(item,index) in zixunService">
                                    <div class="row row1" :key="index">
                                        <div class="col col1">{{item.username}}</div>
                                        <div class="col col1">
                                            <span class="mobilephone"></span>
                                            <span class="number">{{item.phone}}</span>
                                        </div>
                                        <div class="col col1 ">
                                            <a class="qq" :href="'tencent://message/?uin='+item.qq+'&Site=&Menu=yes'"><span ></span>在线咨询</a>
                                        </div>
                                    </div>
                                </template>
                            </div> -->
                            <div class="consult-services clearfix">
                                <ul>
                                    <li v-for="(items, idx) in zixunService" :key="idx">
                                        <img :src="items.head_icon != '' ? items.head_icon : require('@/assets/imgs/service/kefu-women.png')"
                                            v-if="items.gender == 1" />
                                        <img :src="items.head_icon != '' ? items.head_icon : require('@/assets/imgs/service/kefu-man.png')"
                                            v-else />
                                        <p class="uname">{{ items.username }}</p>
                                        <p>{{ items.introduction }}</p>
                                        <p><span class="phone"></span>{{ items.phone }}</p>
                                        <p><a class="chat chat1"
                                                :href="'tencent://message/?uin=' + items.qq + '&Site=&Menu=yes'"><span></span>在线咨询</a>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="wufu">
                            <img src="~@/assets/imgs/service/fuwu.png">
                        </div>
                        <div class="container containertop">
                            <div class="title">药智咨询</div>
                            <div class="subtitle">CONSULT SERVICES</div>
                            <div class="consult-services clearfix">
                                <ul>
                                    <template v-for="(items, idx) in dingzhiService">
                                        <li>
                                            <img :src="items.head_icon != '' ? items.head_icon : require('@/assets/imgs/service/kefu-women.png')"
                                                v-if="items.gender == 1" />
                                            <img :src="items.head_icon != '' ? items.head_icon : require('@/assets/imgs/service/kefu-man.png')"
                                                v-else />
                                            <p class="uname">{{ items.username }}</p>
                                            <p>{{ items.introduction }}</p>
                                            <p><span class="phone"></span>{{ items.mobile }}</p>
                                            <p><a class="chat chat1"
                                                    :href="'tencent://message/?uin=' + items.qq + '&Site=&Menu=yes'"><span></span>在线咨询</a>
                                            </p>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>

                        <div class="container">
                            <div class="title">客服服务</div>
                            <div class="subtitle">CUSTOMER SERVICES</div>
                            <div class="consult-services clearfix">
                                <ul>
                                    <li v-for="(items, idx) in guwenService" :key="idx">
                                        <img :src="items.head_icon != '' ? items.head_icon : require('@/assets/imgs/service/kefu-women.png')"
                                            v-if="items.gender == 1" />
                                        <img :src="items.head_icon != '' ? items.head_icon : require('@/assets/imgs/service/kefu-man.png')"
                                            v-else />
                                        <p class="uname">{{ items.username }}</p>
                                        <p>{{ items.introduction }}</p>
                                        <p><span class="phone"></span>{{ items.phone }}</p>
                                        <p><a class="chat chat1"
                                                :href="'tencent://message/?uin=' + items.qq + '&Site=&Menu=yes'"><span></span>在线咨询</a>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <!-- <div class="content">
                                <div class="row">
                                    <div class="col">联系人</div>
                                    <div class="col">联系方式</div>
                                    <div class="col">在线咨询</div>
                                </div>

                                <template v-for="(item,index) in guwenService">
                                    <div class="row row1" :key="index">
                                        <div class="col col1">{{item.username}}</div>
                                        <div class="col col1 alignment">
                                            <span class="mobilephone"></span>
                                            <span class="number">{{item.phone}}</span>
                                            <span class="mail">{{item.email}}</span>
                                        </div>
                                        <div class="col col1 ">
                                            <a class="qq" :href="'tencent://message/?uin='+item.qq+'&Site=&Menu=yes'"><span ></span>在线咨询</a>
                                        </div>
                                    </div>
                                </template>
                            </div> -->
                        </div>
                        <div class="container tousu">
                            <div class="title">投诉受理</div>
                            <div class="subtitle">COMPLAINT ACCEPTANCE</div>
                            <div class="content">
                                <div class="row">
                                    <div class="col">联系人</div>
                                    <div class="col">联系方式</div>
                                    <div class="col">在线咨询</div>
                                </div>

                                <template v-for="(item, index) in tousuServer">
                                    <div class="row row1" :key="index">
                                        <div class="col col1">{{ item.username }}</div>
                                        <div class="col col1 alignment">
                                            <span class="mobilephone"></span>
                                            <span class="number">{{ item.phone }}</span>
                                            <span class="mail">{{ item.email }}</span>
                                        </div>
                                        <div class="col col1 ">
                                            <a class="qq"
                                                :href="'tencent://message/?uin=' + item.qq + '&Site=&Menu=yes'"><span></span>在线咨询</a>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer1></Footer1>
        </div>
    </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import crypto from "crypto-js";
import DialogProbation from "@/components/common/dialog-probation";
import { setTimeout } from "timers";
import { mapState } from "vuex";
import Footer1 from "@/components/layouts/footer1";
import Moment from "moment";
export default {
  components: {
    LoadingGif,
    DialogProbation,
    Footer1,
  },
  data() {
    return {
      noticeMsgStr: "",
      noticeMsg: [],
      isLoading: true,
      dialogProbationShow: false, // 申请试用显示判断
      zixunService: [],
      dingzhiService: [],
      guwenService: [],
      tousuServer: [],
      serviceGa: "viptrial_servicesuccess",
    };
  },
  computed: {
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice,
    }),
  },
  methods: {
    // 使用申请弹框显示
    showProbation(a) {
      window.ga("send", "event", "button", "click", a);
      window._paq.push(["trackEvent", "button", "click", a]);

      this.dialogProbationShow = true;
    },
    // 顶部导航条UI样式自适应处理方法
    handleNavPoint() {
      let distance = 0;
      let index = -1;
      if (this.$route.path.indexOf("/home") == 0) {
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
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/usercenter/customer",
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.zixunService = res.data.data["药智数据"];
            this.dingzhiService = res.data.data["药智咨询"];
            this.guwenService = res.data.data["客服服务"];
            this.tousuServer = res.data.data["投诉受理"];

            this.isLoading = false;
          }
        });
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
        "_self"
      );
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
    this.handleAxios();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "客服中心"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "客服中心"]);
    }, 1000);
  },
  mounted() {
    let style = document.createElement("style");
    style.id = "marquee";
    document.getElementsByTagName("head")[0].appendChild(style);

    // 约定判断是否打开试用申请
    if (this.$route.query.tryout == 1) {
      this.showProbation("viptrial_service");
    }

    let query = this.$route.query;
    if (query) {
      document.title = `客服中心${
        query.ga_source ? "-" + query.ga_source : ""
      }${query.ga_name ? "-" + query.ga_name : ""}${
        query.back_url ? "-" + query.back_url : ""
      }-药智数据企业版`;
    } else {
      document.title = "客服中心-药智数据企业版";
    }

    // 获取公告数据
    this.getNoticeMsg();
    window.global = {
      methods: {
        showProbation: this.showProbation,
      },
    };
    setTimeout(() => {
      this.handleNavPoint();
      this.handleNavHover();
    }, 2000);
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";

.fullscreen-loading {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.service {
  margin: 0;
  width: 100%;
  height: auto;

  .service_wrapper {
    min-width: 1280px;
    height: 100%;
    margin: 0 auto;
    position: relative;

    .service_nav {
      width: 100%;
      height: 66px;
      position: absolute;
      z-index: 99;

      .service_header {
        width: 1200px;
        height: 66px;
        line-height: 66px;
        margin: 0 auto;
        overflow: hidden;

        .logo {
          float: left;

          img {
            vertical-align: middle;
          }
        }

        .nav_right {
          height: 66px;
          float: right;
          font-size: 16px;
          position: relative;
          overflow: hidden;
          border-radius: 5px;

          // margin-right: 82px;
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
    }

    .service_top {
      position: relative;
      width: 100%;
      height: 350px;
      background: url(~@/assets/imgs/service/header_bg.jpg) no-repeat center top;
      background-size: contain;
      text-align: center;

      .el-button {
        display: inline-block;
        width: 110px;
        height: 30px;
        line-height: 1px;
        position: absolute;
        top: 72%;
        left: 50%;
        margin-left: -55px;
        // margin-top:250px;
        border-radius: 4px;
        font-size: 14px;
        color: #4877e8;
        background: #fff;
        border: none;

        span {
          position: relative;
          top: -4px;
        }
      }
    }

    .service_container {
      width: 100%;
      background: #fff;

      .container_top {
        .container {
          width: 1200px;
          margin: 0 auto;

          padding-top: 110px;

          .title {
            font-size: 24px;
            color: #4877e8;
            text-align: center;

            &:after {
              content: "";
              display: block;
              width: 20px;
              height: 2px;
              background: #4877e8;
              margin: 4px auto;
            }
          }

          .subtitle {
            font-size: 14px;
            color: #999999;
            text-align: center;
            margin-bottom: 39px;
          }

          .conhigh {
            height: 280px;
          }

          .content {
            // width:1200px;
            // margin:0 auto;
            box-shadow: 0px 2px 8px 3px #f7f8fb;

            .row {
              text-align: center;
              overflow: hidden;
              height: 60px;
              line-height: 70px;
              background: #deecfb;

              .col {
                width: 400px;
                float: left;
                font-size: 18px;
                color: #333;
              }
            }

            .row:last-child {
              border-bottom: 1px solid transparent;
            }

            .row1 {
              background: #fff;

              .alignment {
                text-align: left;
              }

              .col1 {
                font-size: 16px;
                color: #666;

                .email {
                  width: 22px;
                  height: 13px;
                  display: inline-block;
                  background: url("~@/assets/imgs/service/email1.png") no-repeat;
                }

                .mobilephone {
                  display: inline-block;
                  width: 14px;
                  height: 20px;
                  background: url("~@/assets/imgs/service/phone_bg.png")
                    no-repeat -58px -36px;
                  position: relative;
                  top: 4px;
                }

                .number {
                  font-size: 14px;
                  color: #666;
                  // position: relative;
                  // top: 0px;
                }

                .mail {
                  display: inline-block;
                  background: url("~@/assets/imgs/service/email1.png") no-repeat
                    0 27px;
                  padding-left: 28px;
                  margin-left: 47px;
                }

                .qq {
                  display: block;
                  width: 110px;
                  height: 30px;
                  line-height: 30px;
                  text-align: center;
                  border-radius: 4px;
                  margin: 16px auto 0 auto;
                  background: #4877e8;
                  color: #fff;
                  text-decoration: none;
                  font-size: 14px;

                  span {
                    display: inline-block;
                    width: 14px;
                    height: 16px;
                    background: url(~@/assets/imgs/service/qq1.png) no-repeat;
                    background-size: contain;
                    vertical-align: middle;
                    margin-right: 2px;
                  }
                }
              }

              &:hover {
                background: #4877e8;
              }
            }

            .row1:hover .col1 {
              color: #fff;
            }

            .row1:hover .col1 .mail {
              background: url("~@/assets/imgs/service/email2.png") no-repeat 0
                27px;
            }

            .row1:hover .col1 .mobilephone {
              background: url("~@/assets/imgs/service/phone_bg.png") no-repeat -58px -1px;
            }

            .row1:hover .col1 .number {
              color: #fff;
            }

            .row1:hover .col1 .email {
              background: url("~@/assets/imgs/service/email2.png") no-repeat;
            }

            .row1:hover .col1 .qq {
              background: #fff;

              color: #4877e8;
            }

            .row1:hover .col1 .qq span {
              background: url("~@/assets/imgs/service/qq2.png") no-repeat;
            }
          }
        }

        .containertop {
          margin-top: -28px;

          .con {
            .custom {
              margin-bottom: 28px;
            }
          }
        }

        .tousu {
          padding-bottom: 110px;
        }
      }
    }
  }

  .yaozh-service {
    .yaozh-service-child {
      width: 49%;
      height: 170px;
      background-color: #fff;
      box-shadow: 1px 6px 28px 2px rgba(39, 59, 135, 0.07);
      border-radius: 4px;
      display: inline-block;
      vertical-align: middle;

      .vline {
        width: 8px;
        height: 100%;
        float: left;
        background-color: #4877e8;
        border-radius: 4px;
      }

      .mark {
        padding: 16px 0px 16px 29px;
        box-sizing: border-box;

        .child-title {
          margin-bottom: 25px;
          font-size: 16px;
          color: #4877e8;
          font-weight: bold;
          font-size: 16px;
        }

        .child-desc {
          font-size: 14px;

          li {
            color: #666;
            float: left;
            margin-bottom: 17px;
            width: 265px;

            em {
              width: 6px;
              height: 6px;
              border-radius: 20px;
              background-color: #666;
              display: inline-block;
              vertical-align: 2px;
              margin-right: 4px;
            }
          }

          li:nth-child(odd) {
            margin-right: 10px;
          }
        }

        i {
          color: #4877e8;
          font-weight: normal;
          margin-right: 5px;
        }
      }
    }

    .yaozh-service-child:first-child {
      margin-right: 1%;
    }
  }

  .yaozh-service-child:hover {
    color: #fff;
    background-color: #4877e8;

    .vline {
      background-color: #a2bdf2;
    }

    .mark {
      i {
        color: #fff;
      }

      .child-title {
        color: #fff;
      }

      .child-desc {
        li {
          color: #fff;

          em {
            background-color: #fff;
          }
        }
      }
    }
  }

  .header {
    background: #deecfb;
  }

  .consult-services {
    li {
      width: 48%;
      background-color: #ffffff;
      box-shadow: 1px 6px 28px 2px rgba(39, 59, 135, 0.07);
      border-radius: 3px;
      padding: 10px;
      box-sizing: border-box;
      float: left;
      font-size: 14px;
      color: #666;

      .uname {
        margin-top: 13px;
        font-size: 18px;
        color: #333;
      }

      img {
        width: 180px;
        height: 180px;
        float: left;
      }

      p {
        margin-top: 0;
        padding-left: 214px;

        a {
          background-color: #4877e8;
          border-radius: 3px;
          color: #fff;
          width: 110px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          display: block;
          text-decoration: none;

          span {
            display: inline-block;
            vertical-align: -2px;
            margin-right: 5px;
            width: 14px;
            height: 16px;
            background: url("~@/assets/imgs/service/qq1.png") no-repeat;
          }
        }

        .phone {
          display: inline-block;
          vertical-align: -4px;
          margin-right: 2px;
          width: 14px;
          height: 20px;
          font-size: 16px;
          background: url("~@/assets/imgs/service/phone_bg.png") no-repeat -58px -36px;
        }
      }

      p:nth-child(2),
      p:nth-child(3) {
        margin-bottom: 13px;
      }

      p:nth-child(4) {
        margin-bottom: 27px;
      }
    }

    li:nth-child(odd) {
      margin-right: 2%;
    }
  }

  .consult-services {
    li:hover {
      color: #fff;
      background-color: #4877e8;

      .uname {
        color: #fff;
      }

      p {
        a {
          background: #fff;
          color: #4877e8;

          span {
            background: url("~@/assets/imgs/service/qq2.png") no-repeat;
          }
        }

        .phone {
          background: url("~@/assets/imgs/service/phone_bg.png") no-repeat -58px
            0;
        }
      }
    }
  }
}

.wufu {
  margin-top: 17px;

  img {
    width: 100%;
  }
}

@media screen and (min-width: 1461px) and (max-width: 1620px) {
  .service {
    .service_wrapper {
      .service_top {
        height: 290px;

        .el-button {
          top: 70%;
        }
      }
    }
  }
}

@media screen and (min-width: 1361px) and (max-width: 1460px) {
  .service {
    .service_wrapper {
      .service_top {
        height: 260px;

        .el-button {
          top: 70%;
        }
      }
    }
  }
}

@media screen and (min-width: 1260px) and (max-width: 1360px) {
  .service {
    .service_wrapper {
      .service_top {
        height: 247px;

        .el-button {
          top: 70%;
        }
      }
    }
  }
}
</style>

