<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/take/dynamic" class="nav-main-lan">订阅管理</router-link>
      <router-link to="/usercenter/take/dynamic" class="nav-lan nav-lan-active">订阅动态&nbsp;&nbsp;></router-link>
      <router-link to="/usercenter/take/condition" class="nav-lan">订阅条件</router-link>
      <router-link to="/usercenter/take/new" class="nav-lan">新增订阅</router-link>
      <div style="margin-top: 20px; padding: 0 20px; font-weight: 400">
        关注药智数据服务号
        <p style="color: #868ea3">随时随地掌握最新动态</p>
      </div>
      <img width="96" height="96" style="margin: 10px 0 0 18px" src="../../../../../static/imgs/wechart/code.png"
        alt="" />
    </div>
    <!--  -->
    <div class="right-view" v-waiting="loading">
      <!-- PART:订阅动态 - slh -->
      <div class="section">
        <div class="head">
          <div class="title">
            <router-link to="/usercenter/take/dynamic"><i class="iconfont">&#xe757;</i><span>订阅动态/</span></router-link>
            <span style="color:#545B6D;">注册订阅</span>
          </div>
        </div>
        <div class="sec-view" v-if="data.history && data.history.length > 0">
          <div class="head">
            <router-link tag="a" :to="{ path: '/zhuce/' + data.id }" target="_blank"><span>{{ data.shoulihao }}</span>
            </router-link>
            <span>{{ data.name }}</span>
            <span>{{ data.qiyemingcheng }}</span>
            <!-- <span>承办日期：{{data.addtime}}</span> -->
          </div>
          <div class="main">
            <div class="main-head">
              <span class="left">变更前</span>
              <span class="middle">变更时间：{{ data.change_time }}</span>
              <span class="right">变更后</span>
            </div>
            <div class="main-lan" v-for="(item, index) in data.history" :key="index">
              <span class="left" :title="item.old">{{ item.old }}</span>
              <span class="middle">{{ item.field_name }}</span>
              <span class="right" :title="item.new">{{ item.new }}</span>
            </div>
          </div>
          <router-link tag="a" :to="{ path: '/zhuce/' + data.id }" target="_blank">
            <div class="more-btn">查看详情</div>
          </router-link>
        </div>

        <div class="all-none" v-else>
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none22.png">
          <div class="all-none-msg">
            <span>暂无订阅动态</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: true,
      data: {},
    };
  },
  computed: {
    ...mapState({
      accesstoken: (state) => state.UserCenter.accesstoken,
    }),
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/rss/timeline",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: this.$route.params.id,
            msg_readid: this.$route.params.id,
            // id: 2,
            // msg_readid: 2,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.data = data;
          } else {
            this.data = {};
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
  },
  created() {
    this.handleAxios();
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", "订阅管理"]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", "订阅管理"]);
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.mc {
  .right-view {
    .section {
      .sec-view {
        .head {
          color: @PrimaryColor;
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 60px;

          &>span {
            display: inline-block;
            margin: 0px 10px;
          }
        }

        .main {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;

          .main-head {
            width: 890px;
            height: 35px;
            font-size: 15px;
            line-height: 35px;
            color: @PrimaryColor;
            font-weight: bold;
            margin-bottom: 20px;

            &>span {
              height: 100%;
              display: inline-block;
              width: 33%;
              box-sizing: border-box;
            }

            .left {
              background: url("/static/imgs/usercenter/qian.jpg") 96px 6px no-repeat;
              padding-left: 130px;
            }

            .middle {
              text-align: center;
            }

            .right {
              background: url("/static/imgs/usercenter/hou.jpg") 96px 5px no-repeat;
              padding-left: 130px;
            }
          }

          .main-lan {
            width: 890px;
            height: 40px;
            font-size: 13px;
            line-height: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: url("/static/imgs/usercenter/slh-lan.jpg") no-repeat;
            background-size: 100% 100%;

            &>span {
              // height: 41px;
              display: inline-block;
              width: 33%;
              box-sizing: border-box;
              text-align: center;
              padding: 0 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              max-height: 40px;
            }

            .middle {
              color: @PrimaryColor;
            }

            .right {
              color: #fff;
            }
          }
        }

        .more-btn {
          width: 118px;
          height: 36px;
          box-sizing: border-box;
          line-height: 36px;
          color: #fff;
          font-size: 12px;
          background: @PrimaryColor;
          border-radius: 18px;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          margin: 14px auto;

          &:hover {
            background: Lighten(@PrimaryColor, 5%);
          }
        }
      }

      .all-none {
        width: 100%;
        min-height: calc(100vh - 35px - 304px - 48px - 50px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .all-none-msg {
          margin-top: 24px;
          font-size: 14px;
          color: @FontColor2;
        }
      }
    }
  }
}
</style>
