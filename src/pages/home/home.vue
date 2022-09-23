<template>
    <div class="home">
      <MianSearch></MianSearch>
      <Customization></Customization>
      <!-- 视频弹窗 -->
      <div class="video-wap" v-show="$route.path === '/home' && isDialog && guideRenewsFlags && questionCloseFlags">
        <div class="video-bg">
          <template v-if="bannerType == 3">
            <div class="pause-advi" v-show="isShowAdvertisement">
              <img :src="videoInfo.pauseImg"  @click="advertRedirect" />
              <i class="pause-advert-close el-icon-close" @click="advertClose"></i>
            </div>
            <i class="video-close el-icon-close" v-show="videoInfo.isClose" @click="dialogClose"></i>
            <video id="videobox" class="video-js" width="660" height="372"></video>
          </template>
          <template v-else-if="bannerType == 2">
            <div class="video-bg-img" v-show="closeBanner">
              <i class="video-close el-icon-close" @click="closeBanners"></i>
              <a :href="bannerDirect" target="_blank"><img :src="bannerUrl" /></a>
            </div>
          </template>
        </div>
      </div>
      <RenewTips  />
    </div>
</template>
<script>
  import { mapState } from "vuex"
  import  MianSearch from './search';
  import  Customization from './customization'
  import RenewTips from "@/components/common/RenewTips"
  import { setTimeout, setInterval, clearInterval, clearTimeout } from 'timers';
  import videojs from 'video.js'

export default{
  data(){
    return {
      questionCloseFlags: false,
      guideRenewsFlags: false,
      //视频参数配置
      videoInfo: {
        posterSrc: '',
        isClose: 0,
        pauseImg: '',
        redirectUrl: '',
        videoSrc: 'https://zy.yaozh.com/newdb/upload/image/vipadvideo/20190327102eac9e5e910af5e933879429e6b68b.mp4',
        id: ''
      },
      isFirst: true,
      isDialog: false,
      isShowAdvertisement: false,
      mediaObj: null,
      //广告类型：2为图片，3为视频
      bannerType: 0,
      //广告图片地址
      bannerUrl: '',
      //是否关闭广告
      closeBanner: false,
      //图片广告跳转地址
      bannerDirect: ''
    }
  },
  components:{
    MianSearch,
    Customization,
    RenewTips
  },
    computed:{
      ...mapState({
        guideFlagsRenew: state => state.UserCenter.guideFlagsRenew,
        questionClose: state => state.UserCenter.questionClose,
      }),
    },
  beforeCreate() {
    if (!this.vueGetCookie("accesstoken") && this.$route.path != "/login") {
      this.$router.push({
        path: "/login",
      })
    } else if (this.vueGetCookie("accesstoken") && this.$route.path == "/login") {
      this.$router.push({
        path: "/home",
      })
    }
  },
  created() {},
  watch: {
    $route(to, from) {
      if(to.fullPath == '/home') {
        this.initVideo()
      }
    },
    guideFlagsRenew: {
      handler(val) {
        if(val){
          this.guideRenewsFlags = true
        }
      },
      immediate: true
    },
    questionClose: {
      handler(val) {
        if(val){
          this.questionCloseFlags = true
        }
      },
      immediate: true
    },
  },
  mounted() {
    this.initVideo()
  },
  methods: {
    initVideo() {
      let that = this;
      window.Axios({
          method: 'get',
          url: '/api/ad',
          header: {
            'Cache-Control': 'no-cache'
          },
          params: {
            accesstoken: that.vueGetCookie("accesstoken"),
            identification: "index_video",
            timestap: (new Date()).getTime()
          }
        }).then(res => {
          let resObject =  res.data.data.res[0];
          if(res.data.code  == 404) {
            that.isDialog = false;
            Store.dispatch("UserCenter/stepNumHomeA", true)
          }else {
            //有视频广告时关闭引导弹窗
            // $('.guide').hide();
            this.bannerType = resObject.type
            if(this.bannerType == 3) {
              //广告跳转地址
              that.videoInfo.redirectUrl = resObject.url;
              //是否允许关闭（通过该属性控制是否显示控制条）
              that.videoInfo.isClose = resObject.isclose;
              //暂停时显示的广告图片
              that.videoInfo.pauseImg = resObject.stopimage;
              //视频地址
              that.videoInfo.videoSrc = resObject.video;
              //初始化视频封面
              that.videoInfo.posterSrc = resObject.image;
              //视频ID
              that.videoInfo.id = resObject.id;

              let videoSource = [{type: 'video/mp4', src: that.videoInfo.videoSrc}];
              setTimeout(() => {
                that.mediaObj = videojs('videobox',{
                  autoplay: true,
                  preload: 'auto',
                  width: '660',
                  height: '372',
                  loop: false,
                  muted: true
                }, function() {
                  console.log(videoSource)
                  let play = this;
                  that.isDialog = true;
                  play.controls(that.videoInfo.isClose?true:false);
                  play.src(videoSource)
                  play.load();
                  play.on('play', function() {
                    console.log('播放')
                    that.isShowAdvertisement = false;
                  });
                  play.on('pause', function() {
                    console.log('暂停')
                    if(that.videoInfo.pauseImg != '') {
                      that.isShowAdvertisement = true;
                    }else {
                      that.isShowAdvertisement = false;
                    }

                  });
                  play.on('ended', function() {
                    console.log('结束')
                    that.counterPlayNum();
                    if(that.isFirst) {
                      play.controls(true);
                      play.muted(false);
                      that.isFirst = false;
                      that.videoInfo.isClose = 1;
                    }
                  });
                });
              }, 500)

            }else if(this.bannerType == 2) {
              this.isDialog = true
              this.closeBanner = true
              this.bannerUrl = resObject.image
              this.bannerDirect = resObject.url
              //视频ID
              this.videoInfo.id = resObject.id;
              this.counterPlayNum()
            }

          }
        }).catch(err => {
          console.log(err)
        })
    },
    //跳转
    advertRedirect() {
      window.open(this.videoInfo.redirectUrl, "_blank");
    },
    //关闭暂停广告
    advertClose() {
      this.isShowAdvertisement = false;
    },
    //关闭视频弹窗
    dialogClose() {
      this.isDialog = false;
      this.mediaObj.dispose();

      Store.dispatch("UserCenter/stepNumHomeA", true)
      console.log('视频结束')
    },
    //关闭广告图
    closeBanners() {
      this.isDialog = false
      this.closeBanner = false
    },
    // 统计播放次数
    counterPlayNum() {
      let that = this;
      Axios.get('/api/ad/adlook?',{
        params: {
          accesstoken: that.vueGetCookie("accesstoken"),
          adid: that.videoInfo.id
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    }
  }
}
</script>
<style lang="less">
  @import "~@/assets/less/var.less";
  video::-webkit-media-controls-fullscreen-button {
      display: none;
  }
  video::-webkit-media-controls-download-button {
      display: none;
  }

  .home{
    margin: 0px;
    // padding: @Space 20px 0px 20px;
    // padding-left: 20px;
    .video-wap {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background: rgba(102,102,102, .4);
      z-index: 3500;
      .video-bg {
        position: absolute;
        left: 50%;
        margin-left: -330px;
        top: 50%;
        margin-top: -186px;
        .video-bg-img {
          width: 660px;
          height: 372px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 9px;
          }
        }
      }
      .video-close {
        position:absolute;
        top: -3px;
        right: -34px;
        z-index: 999;
      }
      .pause-advert-close {
        position:absolute;
        top: 10px;
        right: 10px;
        z-index: 999;
        border-radius: 50%;
        background: rgba(000,000,000,.4);
        padding: 4px;
      }
      .el-icon-close:before {
        color: #fff;
        cursor: pointer;
        font-size: 20px;
      }
      .pause-advi {
        background: #fff;
        position: absolute;
        width: 380px;
        height: 280px;
        z-index: 2147483647;
        left: 50%;
        top: 50%;
        border-radius: 10px;
        margin-left: -190px;
        margin-top: -140px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
        .el-icon-close:before {
        color: #fff;
        cursor: pointer;
        font-size: 10px;
      }
      }
    }
  }
  // .homeNav{
  //   padding: 0px;
  //   padding-left: 20px !important;
  // }
</style>
