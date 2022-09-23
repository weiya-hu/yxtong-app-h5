<template>
  <div class="updatelog">
    <LoadingGif :loadFlag="loading" v-if="loading"></LoadingGif>
    <!-- 升级消息公告 -->
    <transition name="el-fade-in-linear">
      <marquee-kz v-if="noticeMsg.length > 0 && showPromtNotice" :noticeMsg="noticeMsg" @closeNotice="closeNotice">
      </marquee-kz>
    </transition>

    <div class="updatelog_wrapper">
      <!-- 顶部导航栏 -->
      <div class="updatelog_nav">
        <div class="updatelog_header">
          <router-link class="logo" to="/introduce">
            <!-- <img src="~@/assets/imgs/home-logo.png"> -->
            <img src="~@/assets/imgs/intro_logo.png">

          </router-link>
          <nav class="nav_right">
            <router-link tag="a" class="right-nav-item" to="/introduce" exact>首页</router-link>
            <router-link tag="a" class="right-nav-item" to="/help?ga_source=vip&ga_name=vip_service_topnav" exact>帮助中心
            </router-link>
            <router-link tag="a" class="right-nav-item" to="/updatelog?ga_source=vip&ga_name=vip_updatelog_list_topnav"
              exact>更新日志</router-link>
            <router-link tag="a" class="right-nav-item" to="/service?ga_source=vip&ga_name=vip_service_topnav" exact>
              客服中心</router-link>
            <!-- <router-link tag="a" class="right-nav-item" to="/" @click.native="introduce" exact>掌上数据库</router-link> -->
            <a class="right-nav-item" href="javascript:;" @click="introduce" exact>掌上数据库</a>
            <!-- nav底部滑动交互条 -->
            <div class="slide-z"></div>
          </nav>
        </div>
      </div>
      <!-- 中间搜索部分 -->
      <div class="updatelog_top"></div>
      <!-- 内容部分 -->
      <div class="updatelog_container">
        <div class="container">
          <!-- 以年份为单位展开 -->
          <div class="item" v-for="(key, index) in keys" :key="index">
            <div class="year">{{ key }}年</div>
            <!-- 以版本为单位展开 -->
            <div v-for="(item, index1) in lists[key]" :key="index1">
              <div class="list-title">
                <span class="date">{{ item.update_time }}</span>
                <span class="version">企业版{{ item.update_version }}</span>
                <span :class="index == 0 && index1 == 0 ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
                  @click="handleSwitch($event)"></span>
              </div>
              <div :class="[index == 0 && index1 == 0 ? 'open' : 'close', 'list-wap']">
                <div class="list" v-html="item.update_brief"></div>
                <router-link tag="a" target="_blank" class="to-deatil" :to="{
                  path: '/usercenter/message/' + item.id,
                  query: {
                    form: 'updatelog',
                    infoid_formid: item.id
                  }
                }">版本详情</router-link>
              </div>
            </div>
          </div>
          <div class="yaozh-down">
            <img src="~@/assets/imgs/scan_updatelog_leftside_1.png" />
          </div>
        </div>
      </div>
      <!-- footer部分-->
      <Footer1></Footer1>
    </div>
  </div>
</template>
<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import Footer1 from '@/components/layouts/footer1'
import { mapState } from 'vuex'
import Moment from "moment"

export default {
  components: {
    LoadingGif,
    Footer1
  },
  data() {
    return {
      noticeMsgStr: "",
      noticeMsg: [],
      loading: true,
      erro: false,
      lists: [],
      keys: []
    };
  },
  computed: {
    ...mapState({
      showPromtNotice: state => state.showPromtNotice
    })
  },
  created() {
    this.getList();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '更新日志']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '更新日志'])
    }, 1000);
  },
  watch: {
  },
  methods: {
    //获取列表数据
    getList() {
      var _that = this
      window.Axios({
        method: 'get',
        url: '/api/usercenter/noticelist'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let result = res.data.data
          if (result.length > 0) {
            _that.dealData(result)
            _that.loading = false
          } else {
            _that.loading = false
            _that.erro = true
          }

        }
      })
    },
    //数据转换  前提数据按照时间从高到低一次排列  数据转换成[{2019:[{2019年具体一个版本对应的内容},{}]},{2018:[{},{}]}]
    dealData(arr) {
      let temp_year = ''        //存上一次处理的年份
      let key = new Array()
      let temp_lists = new Array()
      for (var l = arr.length, i = 0; i < l; i++) {
        let year = arr[i].update_time.slice(0, 4)
        if (year !== temp_year) {
          temp_year = year
          //存储年份
          key.push(year)
          temp_lists[year] = new Array()
          temp_lists[year].push({
            'id': arr[i].id,
            'update_brief': arr[i].update_brief,
            'update_time': arr[i].update_time.slice(5),
            'update_version': arr[i].update_version
          })
        } else {
          temp_lists[year].push({
            'id': arr[i].id,
            'update_brief': arr[i].update_brief,
            'update_time': arr[i].update_time.slice(5),
            'update_version': arr[i].update_version
          })
        }
      }
      this.keys = key
      this.lists = temp_lists

    },
    onScroll() {
      window.addEventListener("scroll", this.handleScroll, true);
    },
    //计算scrolltop的高度，控制nav固定在某一固定位置显示。
    handleScroll() {
      const scrollTop = $('.el-scrollbar__wrap').scrollTop(); //左侧图标fixed显示
      if (scrollTop > 490) {
        $('.yaozh-down').css('top', scrollTop - 490)
      }
    },
    // 顶部导航条UI样式自适应处理方法
    handleNavPoint() {
      let distance = 0
      let index = -1
      if (this.$route.path.indexOf('/home') == 0) {
        index = 0
      }
      //若导航中的权限放开 下面的index依次+1
      // else if (this.$route.path.indexOf('/quanxian') == 0) {
      //   index = 1
      // }
      else if (this.$route.path.indexOf('/help') == 0) {
        index = 1
      } else if (this.$route.path.indexOf('/updatelog') == 0) {
        index = 2
      } else if (this.$route.path.indexOf('/service') == 0) {
        index = 3
      }
      else {
        index = -1
      }

      if (index != -1) {
        let width = $('.nav_right .right-nav-item').eq(index).width()
        for (let i = 0; i < index; i++) {
          distance = distance + $('.nav_right .right-nav-item').eq(i).width() + 18 + 18
        }
        distance += 18
        $('.slide-z').css({ 'opacity': 1, 'left': distance, 'width': width, 'transition': 'all 500ms' })
      } else {
        $('.slide-z').css({ 'opacity': 0, 'left': 0, 'width': 0, 'transition': 'all 500ms' })
      }
    },
    // 顶部导航条UI样式hover处理方法
    handleNavHover() {
      let _that = this
      $('.nav_right .right-nav-item').hover(function () {
        let distance = 0
        let index = $(this).index()
        let width = $(this).width()
        for (let i = 0; i < index; i++) {
          distance = distance + $('.nav_right .right-nav-item').eq(i).width() + 18 + 18
        }
        distance += 18
        $('.slide-z').css({ 'opacity': 1, 'left': distance, 'width': width, 'transition': 'all 500ms' })
      }, function () {
        // $('.slide-z').css({'opacity': 0, 'left': 0, 'width': 0, 'transition': 'all 500ms'})
        _that.handleNavPoint()
      })
    },
    //控制不同版本介绍是否展开
    handleSwitch(el) {
      el.target.className = el.target.className === "el-icon-caret-bottom" ? "el-icon-caret-top" : "el-icon-caret-bottom"
      if (el.target.className === "el-icon-caret-bottom") {
        $(el.target).parent().next(".list-wap").removeClass("close").addClass('open')
      } else {
        $(el.target).parent().next(".list-wap").removeClass("open").addClass('close')
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
    show() {
      // if (this.noticeMsg.length == 0) return;
      $(".text-container").css("visibility", "hidden");
      let $ul = $(".text-container .inner ul"),
        width = $(".text-container .inner ul").width(),
        speed = 0.04;
      if (width == 0) width = $(window).width() - 1200;
      if (width > parseInt($(".text-container").width() / 2)) {
        let html = `
          .text-container .inner { animation: marquee `+ width / speed + `ms linear infinite; }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-` + width + `px);
            }
          }`;
        let cloneStr = $(".text-container .inner").html();
        $(".text-container .inner").append(cloneStr) //复制n个增加宽度
        $("#marquee").html(html);
      }
      $(".text-container").css("visibility", "visible");
    },
    closeNotice() {
      this.noticeMsg = [];
      this.noticeMsgStr = "";
      localStorage.isFirstNotice = true;
      this.$store.commit('showPromtNotice', false);
    },
    getNoticeMsg() {
      window.Axios.post('/api/config/notice')
        .then(res => {
          let data = res.data;
          if (data.code == 200) {
            let curTimeStamp = Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            this.noticeMsg = [];
            data.data.forEach((item) => {
              if (
                (Moment(curTimeStamp).isAfter(Moment(item.time_start * 1000).format('YYYY-MM-DD HH:mm:ss')) &&
                  Moment(curTimeStamp).isBefore(Moment(item.time_end * 1000).format('YYYY-MM-DD HH:mm:ss'))) ||
                Moment(curTimeStamp).isSame(Moment(item.time_start * 1000).format('YYYY-MM-DD HH:mm:ss')) ||
                Moment(curTimeStamp).isSame(Moment(item.time_end * 1000).format('YYYY-MM-DD HH:mm:ss'))
              ) {
                this.noticeMsg.push(item);
              }
            });

            setTimeout(() => {
              // 第一次要弹
              if (!localStorage.noticeMsgStr) {
                localStorage.setItem("noticeMsgStr", JSON.stringify(data.data));
                this.$store.commit('showPromtNotice', this.noticeMsg.length > 0);
                localStorage.isFirstNotice = false;
              } else {
                // 没点过关闭按钮的 要显示出来
                if (localStorage.isFirstNotice == "false") {
                  this.$store.commit('showPromtNotice', this.noticeMsg.length > 0);
                  console.log(2);
                } else {
                  // 点过关闭按钮的 但是有新的内容的 也要弹出来
                  // 如果有新的公告也要弹
                  if (JSON.stringify(data.data) !== localStorage.noticeMsgStr) {
                    localStorage.isFirstNotice = false;
                    localStorage.setItem("noticeMsgStr", JSON.stringify(data.data));
                    this.$store.commit('showPromtNotice', this.noticeMsg.length > 0);
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
    }
  },
  mounted() {
    let style = document.createElement('style');
    style.id = "marquee";
    document.getElementsByTagName('head')[0].appendChild(style);
    // 获取公告数据
    this.getNoticeMsg();
    this.onScroll()
    setTimeout(() => {
      this.handleNavPoint()
      this.handleNavHover()
    }, 1000)

  },
} 
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";

.updatelog-cl-blue {
  color: @PrimaryColor !important;

  &::before {
    background-color: @PrimaryColor !important;
  }
}

.fullscreen-loading {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.updatelog {
  margin: 0;
  width: 100%;
  height: auto;

  .updatelog_wrapper {
    min-width: 1280px;
    height: 100%;
    margin: 0 auto;
    position: relative;

    .updatelog_nav {
      width: 100%;
      height: 66px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;

      .updatelog_header {
        width: 1198px;
        height: 66px;
        line-height: 66px;
        margin: 0 auto;

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

    .updatelog_top {
      width: 100%;
      height: 490px;
      background: url(~@/assets/imgs/updatelog-top.jpg) no-repeat center top;
    }

    .updatelog_container {
      width: 100%;
      min-height: 500px;

      .container {
        width: 960px;
        margin: 0px auto 20px;
        position: relative;

        .yaozh-down {
          position: absolute;
          left: -100px;
          top: 0;

          img {
            width: 136px;
          }
        }

        .year {
          width: 198px;
          height: 24px;
          padding: 12px 76px 38px 0px;
          font-size: 25px;
          color: @PrimaryColor;
          text-align: right;
          background: url(~@/assets/imgs/updatelog-timeline.jpg) no-repeat right 10px;
        }

        .list-title {
          font-size: 18px;
          color: @PrimaryColor;

          .date {
            display: inline-block;
            width: 200px;
            text-align: right;
          }

          .version {
            padding: 0px 30px 0px 90px;
            background: url(~@/assets/imgs/updatelog-timeline.jpg) no-repeat 7px -75px;
          }

          .el-icon-caret-top:before {
            content: "\e60b";
          }

          .el-icon-caret-bottom:before {
            content: "\e60c";
          }

          .el-icon-caret-bottom,
          .el-icon-caret-top {
            cursor: pointer;
          }
        }

        .list-wap {
          margin-left: 227px;
          overflow: hidden;
          border-left: 2px solid @PrimaryColor;
          transition: all 300ms;

          &.close {
            padding-top: 40px;
            max-height: 0px;
          }

          &.open {
            max-height: 700px;
          }

          .list {
            max-height: 560px;
            margin: 30px 0px 15px 58px;
            margin-left: 58px;
            padding: 15px 10px 15px 30px;
            overflow: hidden;
            font-size: 13px;
            line-height: 26px;
            background-color: #f7fbff;
          }

          .to-deatil {
            display: inline-block;
            padding: 4px 20px;
            margin: 16px 0px 50px 65px;
            font-size: 14px;
            color: @PrimaryColor;
            border: 1px solid @PrimaryColor;
            border-radius: 16px;
            text-decoration: none;
          }
        }
      }

    }
  }
}
</style>

<style scoped>
/* 解决 对v-html的内容样式不起作用 */
.list>>>p {
  margin: 0px;
}
</style>
