<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/suggest" class="nav-main-lan">建议反馈&nbsp;&nbsp;&nbsp;&nbsp;></router-link>
    </div>
    <!--  -->
    <div class="right-view">
      <!-- PART:反馈详情 -->
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>反馈详情</span></div>
        </div>
        <div class="sec-view">
          <!-- A:用户提问栏 Q:客服回答栏 -->
          <div
            v-for="(item, index) in data.res" :key="index"
            class="lan"
            :class="{'part-a': item.type === 'A', 'part-q': item.type === 'Q'}">
              <div class="time">{{item.time}}</div>
              <!-- 用户信息 -->
              <div class="msg" v-if="item.type === 'Q'">
                <div class="photo"><img :src="vueGetCookie('userPicture')"></div>
                <div class="name">{{userName}}</div>
              </div>
              <!-- 客服信息 -->
              <div class="msg" v-if="item.type === 'A'">
                <div class="photo"><img src="/static/imgs/usercenter/kefu.jpg"></div>
                <div class="name">药智客服</div>
              </div>
              <div class="feedback-one-content" v-html="item.content"></div>
          </div>
        </div>
      </div>
      <!-- PART:新增反馈 -->
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>新增反馈</span></div>
        </div>
        <div class="sec-view">
          <el-input
            class="suggest_textarea"
            type="textarea"
            :rows="6"
            placeholder="请输入您的建议反馈..."
            v-model="new_suggest">
          </el-input>
          <el-button type="primary" round size="medium" class="tj-btn" @click="submitSuggest">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      // fid: this.$route.path.split('/')[3],
      // fid:this.$route.query.id,
      fid:this.$route.params.id,
      data: {},
      new_suggest: '', // 输入的新反馈内容
    }
  },
  computed: {
    ...mapState({
      uid: state => state.UserCenter.uid,
      userName: state => state.UserCenter.userName,
    })
  },
  methods: {
    handleAxios () {
      let ids = this.fid.split('-')
      window.Axios({
        method: 'get',
        url: '/api/usercenter/jyfkdetail',
        params: {
          accesstoken: this.vueGetCookie("accesstoken"),
          fid: ids[0],
          msg_readid: ids[1],
          id: ids[0],
          // from: 1,

        }
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.data = data

          // Store.dispatch("UserCenter/handleXxtzAxios", this.param)
          Store.dispatch("UserCenter/handleHeaderMsgAxios", {page: 1, pageSize: 5})

        }
      })
    },
    // 提交新反馈
    async submitSuggest () {
      await window.Axios({
        method: 'post',
        url: '/api/usercenter/jyfkzw',
        params: {
          accesstoken: this.vueGetCookie("accesstoken"),
          fid: this.fid,
          content: this.new_suggest
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: '提交成功!',
            type: 'success'
          })
        } else {
          this.$message({
            message: '提交失败!',
            type: 'error'
          })
        }
      }).catch((err) => {
        console.log(err)
      })

      this.new_suggest = '' // 清空输入框
      this.handleAxios()
    }
  },
  created() {
    this.handleAxios()
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '建议反馈']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '建议反馈'])
    }, 1000);
  },
  updated() {
    // 控制消息气泡中img的最大宽度
    $('.feedback-one-content img').css({
      'max-width': '510px'
    })
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.mc {
  .right-view {
    float: right;
    width: 1020px;
    .section {
      .sec-view {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .tj-btn {
          width: 120px;
          height: 30px;
          line-height: 30px;
          border-radius: 16px;
          padding: 0px;
          margin: 15px 0px;
        }
        .lan {
          width: 100%;
          position: relative;
          padding-top: 40px;
          .time {
            position: absolute;
            top: 5px;
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #a9adb7;
            font-size: 12px;
          }
          .msg {
            min-width: 67px;
            padding-top: 70px;
            position: relative;
            .photo {
              position: absolute;
              top: 0px;
              left: 50%;
              margin-left: -33px;
              overflow: hidden;
              width: 67px;
              height: 67px;
              border-radius: 34px;
              img {
                width: 67px;
                height: 67px;
                display: inline-block;
              }
            }
            .name {
              text-align: center;
              color: #a9adb7;
              font-size: 13px;
            }
          }
          .feedback-one-content {
            min-height: 22px;
            line-height: 22px;
            padding: 18px 30px;
            font-size: 13px;
            border-radius: 10px;
            position: relative;
            max-width: 510px;
            word-wrap:break-word;
            margin-top: 5px;
            margin-bottom: 30px;
            img {
              max-width: 510px;
            }
          }
        }
        .part-q {
          .msg {
            float: right;
          }
          .feedback-one-content {
            float: right;
            color: #35384a;
            background: #eff2fa;
            margin-right: 20px;
            transition: all 300ms;
            img {
              max-width: 510px;
            }
            &::after {
              transition: all 300ms;
              content: '';
              position: absolute;
              right: -8px;
              top: 22px;
              width:0;
              height:0;
              border-top:8px solid transparent;
              border-bottom: 8px solid transparent;
              border-left: 8px solid #eff2fa;
            }
            &:hover {
              transition: all 300ms;
              background: Darken(#eff2fa, 5%);
              &::after {
                transition: all 300ms;
                border-left: 8px solid Darken(#eff2fa, 5%);
              }
            }
          }
        }
        .part-a {
          .msg {
            float: left;
          }
          .feedback-one-content {
            float: left;
            color: #fff;
            background: #97a2bf;
            margin-left: 20px;
            transition: all 300ms;
            img {
              max-width: 510px;
            }
            &::after {
              transition: all 300ms;
              content: '';
              position: absolute;
              left: -8px;
              top: 22px;
              width:0;
              height:0;
              border-top:8px solid transparent;
              border-bottom: 8px solid transparent;
              border-right: 8px solid #97a2bf;
            }
            &:hover {
              transition: all 300ms;
              background: Lighten(#97a2bf, 5%);
              &::after {
                transition: all 300ms;
                border-right: 8px solid Lighten(#97a2bf, 5%);
              }
            }
          }
        }
      }
    }
  }
}
</style>
