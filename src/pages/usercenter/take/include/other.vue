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
      <!-- PART:订阅动态 - qy -->
      <div class="section">
        <div class="head">
          <div class="title">
            <i class="iconfont">&#xe757;</i><span>订阅动态</span>
          </div>
          <div class="handle-clear" @click="changeToReadedAll" v-if="data.change_count != 0 || data.new_count != 0">
            全部标记为已读<i class="icon el-icon-circle-check cl-green"></i>
          </div>
        </div>
        <div class="sec-view">
          <div class="title">{{ $route.query.title }}</div>
          <div class="preview">
            <div class="hang slh">
              <div class="left">
                <span class="iconfont">&#xe629;</span>
                <span class="name">受理号变化</span>
              </div>
              <div class="middle">
                <span class="num">{{ data.change_count }}</span>
                <span class="dw">个</span>
              </div>
              <div class="right">未读</div>
            </div>
            <!-- <div class="hang new">
              <div class="left">
                <span class="iconfont">&#xe616;</span>
                <span class="name">新申请</span>
              </div>
              <div class="middle">
                <span class="num">{{data.new_count}}</span>
                <span class="dw">个</span>
              </div>
              <div class="right">未读</div>
            </div> -->
          </div>
          <div class="lans">
            <div class="lan" :class="{ readed: item.status === 1 }" v-for="(item, index) in data.res" :key="index">
              <div class="content">
                <!-- 受理号变化 -->
                <router-link v-if="item.type == 1" :to="{ path: '/usercenter/take/dynamic/slh/' + item.id }"
                  class="main">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
                <!-- 新申请 -->
                <!-- <router-link v-if="item.type == 2" :to="{path: '/zhuce/' + item.infoid, query:{msg_readid: item.id}}" @click.native="changeToReaded(item.id)" target="_blank" class="main">
                  {{item.title}}
                  <span class="topic"><span v-if="item.type_title">#</span>{{item.type_title}}</span>
                </router-link> -->
                <!-- 点击标记为已读 -->
                <i class="handle-read el-icon-circle-check cl-green" @click="changeToReaded(item.id)"></i>
              </div>
              <div class="time">{{ item.addtime.split(" ")[0] }}</div>
            </div>
          </div>
        </div>
        <!-- 分页栏 -->
        <el-pagination @current-change="handleCurrentChange" :current-page="param.page" :page-size="param.pageSize"
          layout="total, prev, pager, next" :total="data.count">
        </el-pagination>
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
      param: {
        page: 1,
        pageSize: 10
      },
      id: this.$route.params.id
    };
  },
  computed: {
    ...mapState({
      accesstoken: state => state.UserCenter.accesstoken
    })
  },
  methods: {
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/rss/zhuce",
          params: _.assign(
            {
              accesstoken: this.vueGetCookie("accesstoken"),
              id: this.$route.params.id,
              msg_readid: this.$route.params.id
              // id: 2,
              // msg_readid: 2,
            },
            this.param
          )
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.data = data;
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    changeToReaded(theId) {
      window
        .Axios({
          method: "get",
          url: "/api/rss/zhuceshouli",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: theId,
            msg_readid: theId,
            from: 1
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            // Store.dispatch("UserCenter/handleXxtzAxios", this.param)
            this.handleAxios();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeToReadedAll() {
      //标记全部已读
      window
        .Axios({
          method: "post",
          // url: '/api/usercenter/msgread',
          url: "/api/rss/setread",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            // type: 'all'
            id: this.id
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            // Store.dispatch("UserCenter/handleXxtzAxios", this.param)
            this.handleAxios();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val;
      this.handleAxios();
    }
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
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.mc {
  .right-view {
    .section {
      .head {
        .handle-clear {
          cursor: pointer;
          float: right;

          .icon {
            display: inline-block;
            margin-left: 4px;
            font-size: 14px;
          }

          &:hover {
            color: @PrimaryColor;
          }
        }
      }

      .sec-view {
        .title {
          font-size: 18px;
          color: @PrimaryColor;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }

        .preview {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;

          .hang {
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: @TdBackgroundColor;

            .left {
              text-align: center;

              .iconfont {
                display: block;
                font-size: 18px;
                color: @PrimaryColor;
              }

              .name {
                font-size: 13px;
              }
            }

            .middle {
              .num {
                font-size: 40px;
                color: @PrimaryColor;
                font-weight: bold;
              }

              .dw {
                font-size: 16px;
              }
            }

            .right {
              color: @McTypeGray;
              font-size: 13px;
            }
          }
        }

        .lans {
          .lan {
            width: 100%;
            height: 48px;
            line-height: 48px;
            font-size: 14px;

            &:hover {
              .content {
                .handle-read {
                  display: inline-block;
                }
              }
            }

            .content {
              display: inline-block;
              padding-left: 22px;
              background: url("/static/imgs/usercenter/unread.jpg") 0px 17px no-repeat;

              .topic {
                color: @PrimaryColor;
              }

              .handle-read {
                font-size: 16px;
                display: none;
                cursor: pointer;
                padding-left: 5px;

                &:hover {
                  color: Lighten(@McTypeGreen, 5%);
                }
              }
            }

            .time {
              float: right;
              width: 80px;
            }

            // 未读
            // 已读
            &.readed {
              .content {
                background: none;

                .main {
                  color: @McTypeGray;
                }

                .topic {
                  color: @McTypeGray;
                }
              }

              .time {
                color: @McTypeGray;
              }

              &:hover {
                .content {
                  .handle-read {
                    display: none !important;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
