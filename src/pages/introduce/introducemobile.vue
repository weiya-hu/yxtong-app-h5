<template>
  <div>
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- <div class="introduce"> -->
    <div class="introduce" v-else>
      <div class="logos">
        <img src="@/assets/imgs/shiyonglogo.png" />
      </div>
      <div class="heder_con">
        <p>您当前正在使用手机访问企业版,</p>
        <p>为了给您带来更好的体验，推荐使用药智数据APP！</p>
        <div class="btn">
          <el-button @click="showProbation()">申请试用(企业版)</el-button>
          <el-button @click="linkApp()" class="btn1">立即下载(APP)</el-button>
        </div>
        <p>联系客服：<a class="focus_a" href="tel:400-678-0778" style="color: #466DF7;">400-678-0778</a></p>
      </div>
      <!-- 试用申请弹出框 -->
      <!-- <el-dialog class="dialog-m" :visible.sync="dialogProbationShow" :show-close="false" :modal-append-to-body="false" width="850px"> -->
      <!-- <div slot="title" class="dialog-header"> -->
      <!-- <div class="dialog-header">
          <span>试用申请</span>
        </div> -->
      <DialogProbation @closeDialog="closeDialog" v-if="dialogProbationShow"></DialogProbation>
      <!-- </el-dialog> -->
    </div>
  </div>
</template>
<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import crypto from "crypto-js";
import DialogProbation from "@/components/common/dialog-probation-mobile";
import { setTimeout } from "timers";
import { mapState } from 'vuex'
export default {
  components: {
    LoadingGif,
    DialogProbation
  },
  data() {
    return {
      isLoading: true,
      dialogProbationShow: false, // 申请试用显示判断
      accountData: {
        grade_id: 0 //初始化赋值一下
      },
      btnFlag: false, //返回顶部按钮显示判断
      // isLogin: true //登录状态
    };
  },
  computed: {
    ...mapState({
      isLogin: state => !state.UserCenter.accountData.username,
      UserCenterAccountData: state => state.UserCenter.accountData
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
  methods: {
    closeDialog() {
      this.dialogProbationShow = false
    },
    // 使用申请弹框显示
    showProbation() {
      window.ga("send", "event", "button", "click", "vip_mobile_applyforatrial")
      window._paq.push(['trackEvent', 'button', 'click', 'vip_mobile_applyforatrial',])

      this.dialogProbationShow = true;
    },
    linkApp() {
      window.ga("send", "event", "button", "click", "vip_mobile_appdownload")
      window._paq.push(['trackEvent', 'button', 'click', 'vip_mobile_appdownload',])

      window.open(`https://db${/dev/.test(location.origin) ? '-dev' : ''}.yaozh.com/app/download_share`)

    },
    handleAxios() {
      window.Axios({
        method: "get",
        url: "/api/yzindex",
        params: {
          accesstoken: this.vueGetCookie("accesstoken")
          // accesstoken: isPrams
        }
      })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.accountData.grade_id = data.grade_id;

            this.isLoading = false;
          }
        })
        .catch(err => {
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
      }
      else {
        index = -1;
      }

      if (index != -1) {
        let width = $(".nav_right .right-nav-item")
          .eq(index)
          .width();
        for (let i = 0; i < index; i++) {
          distance =
            distance +
            $(".nav_right .right-nav-item")
              .eq(i)
              .width() +
            18 +
            18;
        }
        distance += 18;
        $(".slide-z").css({
          opacity: 1,
          left: distance,
          width: width,
          transition: "all 500ms"
        });
      } else {
        $(".slide-z").css({
          opacity: 0,
          left: 0,
          width: 0,
          transition: "all 500ms"
        });
      }
    },
    // 顶部导航条UI样式hover处理方法
    handleNavHover() {
      let _that = this;
      $('.nav_right a:eq(1)').hover(function () {
        $('.tip-product').show();
      },
        function () {
          $('.tip-product').hide();
        })
      $(".nav_right .right-nav-item").hover(
        function () {
          let distance = 0;
          let index = $(this).index();
          let width = $(this).width();
          for (let i = 0; i < index; i++) {
            distance =
              distance +
              $(".nav_right .right-nav-item")
                .eq(i)
                .width() +
              18 +
              18;
          }
          distance += 18;
          $(".slide-z").css({
            opacity: 1,
            left: distance,
            width: width,
            transition: "all 500ms"
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
      let randStr = Math.random()
        .toString(36)
        .slice(2); // 生成随机字符串
      // console.log(timeStamp + "~" +randStr);
      let accesstoken = this.vueGetCookie("accesstoken");
      // if(!accesstoken){
      //   this.vueBackToLogin();
      //   return;
      // }
      window.Axios({
        method: "post",
        url: "/api/user/logout",
        params: {
          accesstoken: accesstoken,
          timeStamp: timeStamp,
          randStr: randStr,
          signature: this.getSignature([timeStamp + "", randStr, "newdb"])
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            // 此处代码为 配合bbs论坛同步企业版登录，存储后端返回的script src地址，到login.vue中动态添加到body里面
            res.data.data.items && res.data.data.items.length > 0 && this.vueSetCookie('bbsOutScript', JSON.stringify(res.data.data.items))
            let flag = this.$route.path.includes("/login");
            this.vueBackToLogin(flag); //全局方法，清楚cookie
            // this.vueBackToLogin();
            location.reload();
          }
        })
        .catch(err => {
          console.log(err);
        });

      // 清理用户使用时长
      localStorage.removeItem("accesstoken")
      localStorage.removeItem('gradeId')
      localStorage.removeItem('step1')
      localStorage.removeItem('step2')
      localStorage.removeItem('step3')
      localStorage.removeItem('step4')
    },
    nextPage() {
      document.getElementsByClassName("el-scrollbar__wrap")[0].scrollTop = 850;
    },
    backTop() {
      let that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 5);
        document.getElementsByClassName("el-scrollbar__wrap")[0].scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
    scrollToTop() {
      let that = this;
      let scrollTop = document.getElementsByClassName("el-scrollbar__wrap")[0]
        .scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 300) {
        that.btnFlag = true;
        $(".introduce_nav").css("background", "#4b5af8");
      } else {
        that.btnFlag = false;
      }
      if (that.scrollTop > 100) {
        $(".introduce_nav").css("background", "#4b5af8");
      } else {
        $(".introduce_nav").css("background", "transparent");
      }
    },
    introduce() {
      let hosts = '';
      if ((window.location.host).indexOf('dev') > -1) {
        hosts = 'https://db-dev.yaozh.com';
      } else {
        hosts = 'https://db.yaozh.com';
      }
      window.open(hosts + '/app?ga_source=vip&ga_name=vip_introduce_topnav', '_self');
    },
    redirect(url, type = 1) {
      console.log(url)
      if (type == 1) {
        this.$router.push({
          path: url
        })
      } else {
        // window.open('/static/imgs/pdf/product_manual.pdf')
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

    }
  },
  created() {
    setTimeout(() => {
      this.isLoading = false;
    }, 0);
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '产品介绍页']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '产品介绍页'])
    }, 1000);
  },
  watch: {
    isLogin(o, n) {
      // console.info(this.UserCenterAccountData)
      if (!o) {
        // this.UserCenterAccountData.picture = this.vueGetCookie("userPicture");
        this.handleAxios();
      }
    }
  },
  mounted() {
    var ua = navigator.userAgent

    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      this.$router.replace({
        path: '/introduce',
        query: Object.assign({}, this.$route.query, { ga_source: 'vip', ga_name: 'vip_pc' })
      })
      return
    }

    if (!this.$route.query.ga_source && !this.$route.query.ga_name) {
      const ga_name = ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger" ? 'vip_mobile_wechat' : 'vip_mobile_h5'
      this.$router.push({
        query: Object.assign({}, this.$route.query, { ga_source: 'vip', ga_name })
      })
    }

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
      this.dialogProbationShow = true
    }

    setTimeout(() => {
      this.handleNavPoint();
      this.handleNavHover();
    }, 1000);

    window.global = {
      methods: {
        showProbation: this.showProbation
      }
    };
    window.addEventListener("scroll", srcollEvent, true); //第一个动画
    window.addEventListener("scroll", srcollTwo, true); //第二个动画
    window.addEventListener("scroll", this.scrollToTop, true); //返回顶部
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  }
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
  var scrollTop = document.getElementsByClassName("el-scrollbar__wrap")[0]
    .scrollTop;
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
}

p {
  padding: 0;
  margin: 0;
}

.introduce {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(~@/assets/imgs/shiyongbg.png) no-repeat;
  background-size: 100% 100%;

  .logos {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 200px;
    text-align: center;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }

  .heder_con {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 15px 0 20px;

    p {
      color: #666;
      font-size: 13x;
    }

    a.focus_a:focus,
    a.focus_a:active {
      text-decoration: none;
    }

    .btn {
      display: flex;
      justify-content: center;
      padding: 15px 0 20px;

      .el-button {
        width: 140px;
        height: 34px;
        border-radius: 35px;
        font-size: 16px;
        color: #fff;
        background: linear-gradient(to right, #36BAF3, #4961F8);
        border: none;
        animation: pfive 1s ease;
        -webkit-animation: pfive 1s ease;
        padding: 8px 0;
        font-size: 14px;
      }

      .btn1 {
        margin-left: 10px;
        background: none;
        border: 1px solid #476CF7;
        color: #476CF7;
      }
    }
  }
}

.dialog-m {
  /deep/.el-dialog {
    height: 100%;
    width: 100%;
  }

  /deep/.el-dialog__bod {
    padding: 0;
  }
}
</style>
<style>
@keyframes movelt {
  form {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
