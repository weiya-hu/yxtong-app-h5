<template>
  <div class="la-content">
    <LoadingGif :loadFlag="loading" v-if="loading"></LoadingGif>
    <div class="help_wrapper">
      <!-- 顶部导航栏 -->
      <div class="detail_nav">
        <div class="help_header">
          <router-link class="logo" to="/home">
            <img src="~@/assets/imgs/home-logo.png">
          </router-link>
          <!-- <ul class="nav_right">
            <li class="nav_item">首页</li>
            <li class="nav_item">权限介绍</li>
            <li class="nav_item active">帮助中心</li>
            <li class="nav_item">关于我们</li>
          </ul> -->
          <nav class="nav_right">
            <router-link tag="a" class="right-nav-item" to="/home" exact>首页</router-link>
            <!-- <router-link tag="a" class="right-nav-item" to="/quanxian" exact>权限介绍</router-link> -->
            <router-link tag="a" class="right-nav-item" to="/help" exact>帮助中心</router-link>
            <!-- <router-link tag="a" class="right-nav-item" to="/about" exact>关于我们</router-link> -->
            <!-- nav底部滑动交互条 -->
            <div class="slide-z"></div>
          </nav>
        </div>
      </div>
      <!-- 主要部分 -->
      <div class="detail_container clearfix">
        <div class="container">
          <!-- 帮助详情 -->
          <div class="detail_right">
            <!-- 帮助详情 - 面包屑 -->
            <div class="right_nav">
              <div class="help_center">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
                  <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </div>
            <div id="detail_name">{{detail.name}}</div>
            <!-- 帮助详情 - 内容 -->
            <div class="right_list" id="detail_content" v-html="detailContent"></div>
            <!-- 点赞 + 浏览数 -->
            <div class="right_watch">
              <span class="watch_lls">
                浏览数：{{detail.liulan}}
              </span>
              <span class="watch_dz">
                <span>此词条帮助：</span>
                <i class="iconfont icon-up" :class="{'active': love == 1}" @click="hanldeLoveClick(1)">&#xe648;</i>
                <i class="iconfont icon-down" :class="{'active': love == 2}" @click="hanldeLoveClick(2)">&#xe64a;</i>
              </span>
            </div>
            <!-- 相关问题 -->
            <div v-if="helpLabel.length">
              <!-- 相关问题 - title -->
              <div class="right_nav">
                <div class="help_center">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>相关问题</el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </div>
              <!-- 相关问题 - 列表-->
              <div class="right_list">
                <div class="detail_question">
                  <router-link :to="'/help/detail/' + item.id" v-for="(item, index) in helpLabel" :key="index">
                    <p>
                      {{item.name}}
                      <span class="data">{{item.addtime}}</span>
                    </p>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- footer-->
      <Footer1></Footer1>
      <div class="clearfix"></div>
      <div id="maginfy-img-wap" class="magnify-img dn" title="点击返回">
        <i class="el-icon-close"></i>
        <img id="maginfy-outimg" src="" >
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import List from '../list'
import Footer1 from '@/components/layouts/footer1'
import { mapState } from 'vuex'
export default{
  components:{
    LoadingGif,
    List,
    Footer1
  },
  data() {
    return {
      loading:true,
      activeNames: ['1'],
      currentPage4: 4,
      id:'',
      detail:{},
      helpLabel: [],
      breadcrumb: [],
      love: 0,
    }
  },
  computed: {
    ...mapState({
      extendCount: state => state.CfdaDrug.extendCount,
      param: state => state.CfdaDrug.param,
    }),
    detailContent() {
      // String.prototype.replaceAll = function (FindText, RepText) {
      //   let regExp = new RegExp(FindText, "g");
      //   return this.replace(regExp, RepText);
      // } 
      let str = this.detail.content ? String(this.detail.content) : ""

      // str = String(str).replaceAll("/upload/image/", "https://adminvip.yaozh.com/upload/image/")
      return str
    },
  },
  methods: {
    handleChange(val) {
      // console.log(val);
    },
    handleSizeChange(val) {
      this.param.pageSize = val
    },
    handleCurrentChange(val) {
      this.param.page = val
    },
    getFiled() {
      return window.Axios({
        method: 'get',
        url: '/api/help/'+this.$route.params.id,
        params: {
          accesstoken: this.vueGetCookie('accesstoken'),
        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          // 普通搜索项
          let data = res.data.data
          this.detail = data
          this.helpLabel = data.helpLabel
          this.love = data.lovetype
          this.breadcrumb = data.breadcrumb
          this.loading = false
        }
      }).catch((err) => {
        this.loading = false
        console.log(err)
      }) 
    },
    hanldeLoveClick(type) {
      window.Axios({
        method: 'get',
        url: '/api/help/love',
        params: {
          id: this.$route.params.id,
          type: type,
          accesstoken: this.vueGetCookie('accesstoken'),
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.code === 200) {
          this.love = type
        }
      })
    },
    // 顶部导航条UI样式自适应处理方法
    handleNavPoint () {
      let distance = 0
      let index = -1
      if (this.$route.path.indexOf('/home') == 0) {
        index = 0
      } else if (this.$route.path.indexOf('/quanxian') == 0) {
        index = 1
      } else if (this.$route.path.indexOf('/help') == 0) {
        index = 2
      } else if (this.$route.path.indexOf('/about') == 0) {
        index = 3
      } else {
        index = -1
      } 

      if (index != -1) {
        let width = $('.nav_right .right-nav-item').eq(index).width()
        for (let i = 0; i < index; i++) {
          distance = distance + $('.nav_right .right-nav-item').eq(i).width() + 18 + 18
        }
        distance += 18
        $('.slide-z').css({'opacity': 1, 'left': distance, 'width': width, 'transition': 'all 500ms'})
      } else {
        $('.slide-z').css({'opacity': 0, 'left': 0, 'width': 0, 'transition': 'all 500ms'})
      }
    },
    // 顶部导航条UI样式hover处理方法
    handleNavHover () {
      let _that = this
      $('.nav_right .right-nav-item').hover(function () {
        let distance = 0
        let index = $(this).index()
        let width = $(this).width()
        for (let i = 0; i < index; i++) {
          distance = distance + $('.nav_right .right-nav-item').eq(i).width() + 18 + 18
        }
        distance += 18
        $('.slide-z').css({'opacity': 1, 'left': distance, 'width': width, 'transition': 'all 500ms'})
      }, function () {
        // $('.slide-z').css({'opacity': 0, 'left': 0, 'width': 0, 'transition': 'all 500ms'})
        _that.handleNavPoint()
      })
    },
    //为内容中的图片添加样式并绑定点击事件
    handleMaginfyImg () {
     var _that = this
     let imgs = $('#detail_content').find('img') 
     if(imgs.length>0){
       //为内容中的图片绑定点击放大功能
       for(let img of imgs){
         let $img = $(img)
          $img.addClass('magnify-img').attr({'title':''})
          $img.on('click', () => {
            $('#maginfy-outimg').attr({'src':$(img).attr('src')})
            $('#maginfy-img-wap').removeClass('dn').show("fast");
          })
       }
       //使放大的图片具有关闭功能
       this.initMaginfyImg()
     }
    },
    //为装放大图片的容器绑定点击关闭功能
    initMaginfyImg () {
      var _that = this
      $('#maginfy-img-wap').on('click', () => {
        $('#maginfy-img-wap').hide("fast");
      })
    }
  },
  created(){
    this.getFiled()
  },
  mounted() {
    this.handleNavPoint()
    this.handleNavHover()
  },
  watch:{
    detail(){
      this.$nextTick(()=>{
        this.handleMaginfyImg()
      })
    }
  }
} 
</script>
<style lang="less">
@import "~@/assets/less/var.less";
.la-content{
  width:100%;
.fullscreen-loading{
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
  .help_wrapper{
    width: 100%;
    margin:0 auto;
    position: relative;
    .detail_nav{
      width: 100%;
      height: 50px;
      position:fixed;
      top:0;
      left:0;
      z-index: 999;
      background-color: @PrimaryColor;
      .help_header{
        width: 1198px;
        height: 50px;
        margin:0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo {
          float: left;
          height: 34px;
          width: 121px;
          margin-left: 20px;
          background-color: @PrimaryColor;

          img {
            height: 34px;
            width: 121px;
          }
        }
        .nav_right{
          height: 50px;
          float: right;
          font-size: 14px;
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
          a{
            line-height: 50px;
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
    .detail_container{
      width: 100%;
      box-sizing: border-box;
      min-height: calc(100vh - 50px);
      margin-top: 50px;
      padding-bottom: 20px;
      background-color: #fff;
      .container{
        width: 1198px;
        margin:0 auto; 
        min-height: 658px;
        .detail_right{
          width: 100%;
          margin-top: 38px;
          float: left;
          #detail_name {
            text-align: center;
            font-size: 18px;
            height: 24px;
            line-height: 24px;
            color: @PrimaryColor;
            padding: 20px 32px 10px 32px;
          }
          #detail_content{
            font-size: 14px;
            img{
              max-width: 1100px;
            }
          }
          .right_nav{
            width: 100%;
            height: 30px;
            border-bottom: 1px solid #ebeef5;
            .help_center{
              margin-left: 35px;
              display: inline-block;
              font-size: 16px;
              line-height: 18px;
              border-bottom: 3px solid @PrimaryColor;
              padding: 4px 10px 4px 10px;
              .search_font{
                color:#F77D56;
              }
              .el-breadcrumb {
                padding-right: 0px;
                .el-breadcrumb__inner{
                  font-size:16px;
                }
              }
            }
          }
          .right_list{
            box-sizing: border-box;
            width: 100%;
            // height: 426px;
            padding: 0 30px;
            .detail_title{
              width: 100%;
              height: 70px;
              font-size: 12px;
              color: @PrimaryColor;
              text-align: center;
              line-height: 70px;
            }
            .detail_introduce{
              width: 100%;
              height: auto;
              font-size: 12px;
              p{
                margin: 0;
                line-height: 22px;
              }
            }
            .detail_picture{
              width: 100%;
              height: 288px;
              margin-top: 26px;
              img{
                width: 100%;
                height: 288px;
              }
            }
            .detail_question{
              width: 100%;
              height: auto;
              font-size: 12px;
              text-decoration: none;
              a{
                text-decoration: none;
                p{
                  height: 20px;
                  margin: 10px 0;
                  padding-left: 10px;
                  line-height: 22px;
                  &:hover{
                    color:@PrimaryColor;
                  }
                  .data{
                    float:right;
                  }
                }
              }
            }
          }
          .right_watch{
            box-sizing: border-box;
            width: 100%;
            height: 35px;
            background-color: #F5F8FB;
            margin-top: 24px;
            margin-bottom: 40px;
            font-size: 13px;
            &>span {
              float: right;
              height: 35px;
              line-height: 35px;
              &>span {
                float: left;
                line-height: 35px;
              }
              &>.iconfont {
                float: left;
                line-height: 35px;
                cursor: pointer;
                font-size: 20px;
                color: #999;
              }
            }
            .watch_dz {
              margin-right: 40px;
              .icon-up {
                margin-right: 20px;
                &:hover {
                  color: @PrimaryColor;
                }
                &.active {
                  color: @PrimaryColor;
                }
              }
              .icon-down {
                &:hover {
                  color: @DarkGray;
                }
                &.active {
                  color: @DarkGray;
                }
              }
            }
            .watch_lls {
              margin-right: 25px;
            }
          }
        }
      }
    }
    #maginfy-img-wap{
      position: fixed;
      left: 0px;
      top: 0px;
      z-index: 1100;
      width: 100vw;
      height: 100vh;
      line-height:  100vh;
      text-align: center;
      background: rgba(102,102,102, .4);
      overflow: auto;
      .el-icon-close{
        position: absolute;
        right:20px;
        top: 10px;
        color: #fff;
        font-size: 40px;
      }
      img{
        vertical-align: middle;
      }
    }
  }
}
</style>
 
