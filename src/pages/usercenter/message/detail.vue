<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/message" class="nav-main-lan">消息通知&nbsp;&nbsp;&nbsp;&nbsp;></router-link>
    </div>
    <!--  -->
    <div class="right-view">
      <!-- 通知详情 -->
      <div class="detail">
        <div class="section tzxq">
          <div class="head">
            <div class="title"><i class="iconfont">&#xe757;</i><span>通知详情</span></div>
          </div>
          <div class="sec-view" v-if="ifShow">
            <div class="detail-title">{{data.title}}</div>
            <div class="detail-time">{{data.pid==2?timestampToTime(data.addtime):timestampToTime(data.update_time)}}</div>
            <div id="detail_content" class="detail-content" v-html="data.content"></div>
          </div>
          <div class="noticetj_data" v-if="noticetj_data.length !=0 ">
            <div class="head">
              <div class="title"><i class="iconfont">&#xe757;</i><span>相关推荐</span></div>
            </div>
            <div>

                <div class="data_list clearfix"  v-for="(item, index) in noticetj_data" :key="index" >
                  <div class="list_l">
                    <router-link :title="item.title" :to="{path:'/usercenter/message/'+item.id,query:{
                    infoid_formid:item.infoid,noticetj:0
                  }}">
                    {{item.title}}
                  </router-link>
                  </div>
                  <div class="list_r">{{item.addtime.split(' ')[0]}}</div>
                </div>

            </div>

          </div>

        </div>
        <!-- <div class="section xgtj">
          <div class="head">
            <div class="title"><i class="iconfont">&#xe757;</i><span>相关推荐</span></div>
          </div>
          <div class="sec-view">
            <ul>
              <li>
                <a href="" class="title text-overflow">推荐内容1</a>
                <span class="time">2018-07-17</span>
              </li>
              <li>
                <a href="" class="title">长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容，长的推荐内容</a>
                <span class="time">2018-07-17</span>
              </li>
              <li>
                <a href="" class="title">推荐内容3</a>
                <span class="time">2018-07-17</span>
              </li>
              <li>
                <a href="" class="title">推荐内容推荐内容推荐内容推荐内容推荐内容推荐内容推荐内容5</a>
                <span class="time">2018-07-17</span>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
    </div>

    <div id="maginfy-img-wap" class="magnify-img dn" title="点击返回">
        <i class="el-icon-close"></i>
        <img id="maginfy-outimg" src="" >
      </div>
  </div>
</template>

<script>


import { mapState } from 'vuex'
export default {
  data () {
    return {
      noticetj_data:[],
      data: {},
      id: this.$route.params.id,
      query: this.$route.query || {},
      ifShow: false, //解决载入时请求接口数据时  页面出现NAN-NAN-NAN
    }
  },
  computed: {
    ...mapState({
      accesstoken: state => state.UserCenter.accesstoken,
    }),
  },
  methods: {
    noticetj(){
      let _this = this;
      window.Axios({
        method: 'post',
        url: '/api/usercenter/noticetj',
        params: {
          id:this.query.infoid_formid || '',
          // from:1,
          // fid:this.id,

        }
      }).then((res) => {
        console.info(res)
        let _Data = res.data;
        if (_Data.code === 200 && _Data) {
          let _data = _Data.data;
          _this.noticetj_data = _data || [];
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAxios() {
      console.log('enter detail axios')
      let keys = _.keys(this.query)
      console.log(keys)
      let params = {
        accesstoken: this.vueGetCookie("accesstoken"),
        id: this.id,
        msg_readid: this.id,

        }
      if((_.indexOf(keys,'infoid_formid') !=-1 && keys.length == 1) || keys.length==0){ //从其他页面（例如updatelog）跳过来的 id值为infoid的值 且不能带form参数
        params = Object.assign({},params,{'from':1})
      }else{ //从其他页面（例如updatelog）跳过来的 id值为infoid的值 且不能带form参数 要加上msg_own  让他对应的消息通知当条消息已读
        params = Object.assign({},params,{' msg_own':1})
      }

      window.Axios({
        method: 'post',
        url: '/api/usercenter/notice',
        params: params
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.data = data
          this.ifShow= true
          // Store.dispatch("UserCenter/handleXxtzAxios", this.param)
          Store.dispatch("UserCenter/handleHeaderMsgAxios", {page: 1, pageSize: 5})
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 时间戳转化为时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      return Y + M + D
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
  created() {
    this.handleAxios();
    this.noticetj();
  },
  watch:{
    data(){
      this.$nextTick(()=>{
        this.handleMaginfyImg()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.mc {
  .right-view {
    .detail {
      .tzxq {
        .noticetj_data{
          margin-bottom: 50px;
          .data_list {
            box-sizing: border-box;
            text-decoration: none;
            height: 28px;
            line-height: 28px;

            padding: 0 15px;
            font-size: 13px;
            color: @McTypeGray;
            .list_l{
              float: left;

              max-width: 400px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              a{
                color: @McTypeGray;
              }
            }
            .list_r{
              float: right;
            }
          }
        }
        .sec-view {
          .detail-title {
            font-size: 18px;
            line-height: 20px;
            font-weight: bold;
            text-align: center;
            color: @PrimaryColor;
            margin-bottom: 10px;
          }
          .detail-time {
            font-size: 13px;
            color: @McTypeGray;
            line-height: 20px;
            text-align: center;
            margin-bottom: 30px;
          }
          .detail-content {
            font-size: 13px;
            line-height: 30px;
            margin-bottom: 60px;
            // a{

            // }
          }
        }
      }
      .xgtj {
        .sec-view {
          ul {
            li {
              display: block;
              width: 100%;
              box-sizing: border-box;
              padding-right: 80px;
              color: @McTypeGray;
              font-size: 13px;
              height: 30px;
              line-height: 30px;
              overflow: hidden;
              .title {
                padding: 0px;
                display: inline-block;
                max-width: 700px;
                color: @McTypeGray;
              }
              .time {
                float: right;
              }
            }
          }
        }
      }
    }

  }
  #maginfy-img-wap{
      position: fixed;
      left: 0px;
      top: 0px;
      z-index: 2500;
      width: 100vw;
      height: 100vh;
      padding-top: 60px;
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
</style>

<style scoped>
.mc .right-view .detail .detail-content>>>img{
  max-width: 1000px;
}
.mc .right-view .detail .detail-content>>>a{
  color: #4877e8;
}
</style>
