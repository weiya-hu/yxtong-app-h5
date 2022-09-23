<template>
  <div class="la-content">
    <LoadingGif :loadFlag="loading" v-if="loading"></LoadingGif>
    <!-- 升级消息公告 -->
    <transition name="el-fade-in-linear">
      <marquee-kz v-if="noticeMsg.length > 0 && showPromtNotice" :noticeMsg="noticeMsg" @closeNotice="closeNotice">
      </marquee-kz>
    </transition>

    <div class="help_wrapper">
      <!-- 顶部导航栏 -->
      <div class="help_nav">
        <div class="help_header">
          <router-link class="logo" to="/introduce">
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
            <div class="slide-z"></div>
          </nav>
        </div>
      </div>
      <!-- 中间搜索部分 -->
      <div class="help_top">
        <div class="help_content">
          <div class="help_name">帮助中心</div>
          <div class="help_search">
            <i class="iconfont">&#xe615;</i>
            <div class="content_search">
              <el-input @keydown.enter.native.prevent="nameSearch('2')" class="ser_question"
                placeholder="请输入您想要查找的关键词，例如数据库名称" v-model="searchVal" value=""></el-input>
            </div>
            <el-button class="content_btn el-button--primary" @click="nameSearch('1')">搜索</el-button>
          </div>
        </div>
      </div>
      <!-- 内容部分 -->
      <div class="help_container">
        <div class="container">
          <!-- 左侧部分 -->
          <div class="help_left">
            <div class="type">帮助分类</div>
            <div class="select">
              <el-collapse v-model="activeNames" accordion>
                <el-collapse-item v-for="(item, index) in lists" :key="index" :name="item.name + '^' +item.id">
                  <template slot="title">
                    {{item.name}}
                  </template>
                  <div class="item1" v-for="(item1, index) in item.children" :key="index" @click="handleChange2(item1)"
                    v-if="item1.id != '3a4'">
                    {{item1.name}}
                  </div>
                  <div class="item1" v-else>
                    <span @click="linkProductManual()">{{item1.name}}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="hand-data">
              <img src="~@/assets/imgs/scan_help_leftside_1.gif" />
            </div>
          </div>
          <!-- 右侧列表内容部分 -->
          <div class="help_right">
            <!-- 首页部分 -->
            <div>
              <!-- 面包屑导航 -->
              <div class="right_nav">
                <div class="help_center">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="help_name1">{{help_name1}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="help_name2">{{help_name2}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </div>
              <!-- 列表内容 -->
              <cList :nodata="list && !list.length" :loading="false">
                <ul class="right_list">
                  <List v-for="(item, index) in list" :key="index" :name="item.name" :content="item.content"
                    :id="item.id">
                  </List>
                </ul>
              </cList>
              <el-pagination v-if="extendCount > 10" @current-change="handleCurrentChange" :page-size="param.pageSize"
                :page="param.page" layout="total, prev, pager, next" :total="extendCount">
              </el-pagination>
            </div>
            <!-- 搜索结果的部分 -->
          </div>
          <!-- 清除浮动 -->
          <div class="clearfix"></div>
        </div>
      </div>
      <!-- footer部分-->
      <Footer1></Footer1>
    </div>
  </div>
</template>
<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import cList from "@/components/layouts/list"
import List from './list'
import Footer1 from '@/components/layouts/footer1'
// import helpleft from './help-left'
import { mapState } from 'vuex'
import Moment from "moment"

export default {
  components: {
    LoadingGif,
    cList,
    List,
    Footer1
    // helpleft
  },
  data() {
    return {
      noticeMsgStr: "",
      noticeMsg: [],
      loading: true,
      activeNames: '操作手册^3',
      searchVal: '',//搜索框里的内容
      category: [],//存放列表主要内容
      extendCount: 0,
      list: null,//存放内容列表主要内容的
      lists: [],//左侧列表主要内容
      types: [],
      param: {
        pageSize: 10,
        page: 1,
      },
      help_name1: "", // 帮助名的面包屑1
      help_name2: "", // 帮助名的面包屑2
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => !state.UserCenter.accountData.username,
      showPromtNotice: state => state.showPromtNotice
    })
  },
  created() {
    this.getList()
    this.getCategory()
  },
  watch: {
    activeNames(to, from) {
      if (to && to != "-") {
        let name = String(this.activeNames).split("^")[0]
        let father_id = String(this.activeNames).split("^")[1]
        this.help_name1 = name
        this.help_name2 = ""
        this.handleChange1(father_id)
      } else if (!to) {
        this.help_name1 = ""
        this.help_name2 = ""
        this.handleChange1()
      } else if (to && to == "-") {
        let str = this.searchVal
        // this.help_name1 = ""
        this.help_name2 = ""
      }
    }
  },
  methods: {
    // 跳转到产品手册 判断是否登录
    linkProductManual() {
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
    },
    // 获取列表数据
    getList(other) {
      let search_obj = {}
      for (let key in this.param) {
        _.set(search_obj, key, this.param[key])
      }
      window.Axios({
        method: 'get',
        url: '/api/help/list',
        params: other ? _.assign(search_obj, other) : search_obj
      }).then(res => {
        if (res.data) {
          this.list = res.data.data.res
          this.category = res.data.data.res
          this.extendCount = res.data.data.count
          // 普通搜索项
        }
      })
    },
    //左侧列表内容
    getCategory() {
      window.Axios({
        method: 'get',
        url: '/api/help/category'
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.lists = res.data.data
          this.loading = false
        }
      })
    },
    handleChange1(active_name) {
      let obj = {
        "catid": active_name
      }

      if (active_name) {
        this.getList(obj)
      } else {
        this.getList()
      }

      // 样式
      $('.help_left .item1').removeClass("help-cl-blue")
    },
    handleChange2(item) {
      let obj = {
        "catid": item.id
      }

      this.help_name2 = item.name
      this.getList(obj)

      // 样式
      $('.help_left .item1').removeClass("help-cl-blue")
      $(event.target).addClass("help-cl-blue")
    },
    handleSizeChange(val) {
      this.list.pageSize = val
    },
    handleCurrentChange(val) {
      this.list.page = val
    },
    //筛选，进行搜索
    nameSearch(type) {
      if (this.searchVal) {
        ga("send", "event", "button", "click", "vip_help_search" + type)
        window._paq.push(['trackEvent', 'button', 'click', "vip_help_search" + type,])

        let str = this.searchVal
        this.activeNames = "-"
        this.help_name1 = "搜索关键词：" + str
        let obj = {
          "name": this.searchVal,
          "page": 1
        }
        this.getList(obj)
      } else if (!this.searchVal && !this.activeNames) {
        this.help_name1 = ""
        this.help_name2 = ""
        this.getList()
      } else if (!this.searchVal && this.activeNames == '-') {
        this.activeNames = ""
        this.help_name1 = ""
        this.help_name2 = ""
        this.getList()
      }
    },
    //获取滚动的高度
    onScroll() {
      window.addEventListener('scroll', this.handleScroll, true)
    },
    //计算scrolltop的高度，控制nav固定在某一固定位置显示。
    handleScroll() {
      let scrollTop = $('.la-content').offset().top;
      // 左侧导航栏scroll超过250px之后，贴着顶部（如果顶部发生变化，250px可能会发生变化）
      if (scrollTop < -252) {
        $('.help_nav').css({ "top": 0, "left": 0, "position": "fixed", "background": "#4877e8" })
      } else {
        $('.help_nav').css({ "top": 0, "left": 0, "position": "absolute", "background": "none" })// top最小为49
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
      }
      else if (this.$route.path.indexOf('/service') == 0) {
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
        _that.handleNavPoint()
      })
    },
    handleCurrentChange(val) {
      this.param.page = val
      let obj = {
        name: this.searchVal,
        page: parseInt(val)
      }
      this.getList(obj)
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
<style lang="less">
@import "~@/assets/less/var.less";

.help-cl-blue {
  color: @PrimaryColor  !important;

  &::before {
    background-color: @PrimaryColor  !important;
  }
}

.la-content {
  margin: 0;
  width: 100%;
  height: auto;

  .fullscreen-loading {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .help_wrapper {
    width: 1920px;
    height: 100%;
    margin: 0 auto;
    position: relative;

    .help_nav {
      width: 100%;
      height: 66px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;

      .help_header {
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

        // .nav_right{
        //   width: 344px;
        //   height: 24px;
        //   padding-right:9px;
        //   padding-top: 26px;
        //   float: right;
        //   font-size: 14px;
        //   color: white;
        //   .nav_item{
        //     height: 18px;
        //     margin-left: 36px;
        //     padding-bottom: 3px;
        //     line-height: 18px;
        //     float: left;
        //   }
        //   .active{
        //     border-bottom: 3px solid white;
        //   }
        // }
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

    .help_top {
      width: 100%;
      height: 350px;
      background: url(~@/assets/imgs/help_content.jpg) no-repeat center 0;

      .help_content {
        width: 622px;
        height: 245px;
        margin: 0 auto;

        .help_name {
          margin-top: 132px;
          width: 100%;
          height: 30px;
          font-size: 30px;
          line-height: 30px;
          color: white;
          text-align: center;
          float: left;
        }

        .help_search {
          width: 100%;
          height: 38px;
          margin-top: 46px;
          border-radius: 25px;
          background-color: white;
          float: left;

          .iconfont {
            color: #B7B7B7;
            margin-left: 46px;
            line-height: 38px;
            font-size: 20px;
            float: left;
          }

          .content_search {
            width: 432px;
            height: 37px;
            float: left;

            .ser_question {
              width: 432px;
              float: left;

              .el-input__inner {
                width: 432px;
                height: 37px;
                outline: none;
                -webkit-appearance: none;
                border: none;
                color: #555B6D;
              }
            }
          }

          .content_btn {
            float: left;
            width: 124px;
            border-radius: 25px;
            font-size: 16px;
            height: 100%;
          }
        }
      }
    }

    .help_container {
      width: 100%;
      background-color: #fff;

      .container {
        width: 1198px;
        margin: 0 auto;

        .help_left {
          width: 188px;
          height: 604px;
          margin-top: 38px;
          float: left;

          .type {
            width: 100%;
            height: 28px;
            font-size: 16px;
            padding-left: 12px;
            font-weight: 600;
            color: #555B6D;
          }

          .hand-data {
            padding-left: 16px;

            img {
              width: 135px;
            }
          }

          .select {
            .el-collapse {
              border-top: none;
            }

            .el-collapse-item__header {
              height: 48px;
              line-height: 48px;
              color: #35384a;
              cursor: pointer;
              border: none;
              font-size: 14px;
              font-weight: 500;
              padding-left: 30px;
            }

            .item1 {
              margin-left: 30px;
              float: left;
              width: 100%;
              cursor: pointer;

              &:hover {
                color: @PrimaryColor;

                &::before {
                  background-color: @PrimaryColor;
                }
              }

              &::before {
                content: '';
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #303133;
                margin: 8px 6px;
                float: left;
              }
            }
          }
        }

        .help_right {
          width: 1010px;
          margin-top: 38px;
          float: left;

          .right_nav {
            width: 100%;
            height: 30px;
            border-bottom: 1px solid #ebeef5;

            .help_center {
              margin-left: 35px;
              display: inline-block;
              font-size: 16px;
              line-height: 18px;
              border-bottom: 3px solid @PrimaryColor;
              padding: 4px 10px 4px 10px;

              .search_font {
                color: #F77D56;
              }

              .el-breadcrumb {
                padding-right: 0px;
              }
            }
          }

          .right_list {
            width: 978px;
            height: auto;
            padding: 18px 0 0 32px;
            border-top: 1px solid #ebeef5;

            .item {
              width: 100%;
              height: auto;
              // background-color: aquamarine;
              border-bottom: 1px dashed #ebeef5;

              a {
                color: @PrimaryColor;
              }

              .item_name {
                height: 35px;
                font-size: 14px;
                line-height: 35px;
                color: @PrimaryColor;
                padding-left: 4px;
                margin: 0;
              }

              .introduce {
                height: auto;
                font-size: 14px;
                padding-left: 4px;
              }
            }
          }
        }
      }
    }

  }
}
</style>
