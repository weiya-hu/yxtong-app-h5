<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/take/dynamic" class="nav-main-lan">订阅管理</router-link>
      <router-link to="/usercenter/take/dynamic" class="nav-lan nav-lan-active">订阅动态&nbsp;&nbsp;></router-link>
      <router-link to="/usercenter/take/condition" class="nav-lan">订阅条件</router-link>
      <router-link to="/usercenter/take/new" class="nav-lan">新增订阅</router-link>
      <div style="margin-top:20px; padding: 0 20px;font-weight: 400;">关注药智数据服务号 <p style="color: #868EA3;">随时随地掌握最新动态
        </p>
      </div>
      <img width="96" height="96" style="margin:10px 0 0 18px;" src="../../../../../static/imgs/wechart/code.png"
        alt="">
    </div>
    <!--  -->
    <div class="right-view" v-waiting="loading">
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>订阅动态</span></div>
          <div class="handle-clear" v-if="dyglNum" @click="changeToReadedAll">
            全部标记为已读<i class="icon el-icon-circle-check cl-green"></i>
          </div>
        </div>
        <!-- PART:订阅动态(无) -->
        <div class="all-none" v-if="!dyglAllNum">
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none21.png">
          <div class="all-none-msg">
            <span>暂无订阅动态</span>
          </div>
        </div>
        <!-- PART:订阅动态(有) -->
        <div class="sec-view" v-else>
          <div class="lan" :class="{ 'readed': item.status === 1 }" v-for="(item, index) in data.res" :key="index">
            <div class="type" :class="{
              'gxgg': item.head_title === '更新公告',
              'zcdy': item.head_title === '注册订阅',
              'zbgg': item.head_title === '中标公告',
              'xtgg': item.head_title === '系统公告',
              'fkhf': item.head_title === '反馈回复',
              'binggou': item.head_title === '并购事件',
              'rongzi': item.head_title === '融资事件',
              'qqyw': item.head_title === '全球药物2.0',
            }">{{ item.head_title }}</div>
            <div class="content">
              <!-- 按受理号订阅 && 受理号变化 -->
              <router-link v-if="item.field == 'shoulihao' && item.type == 1"
                :to="{ path: '/usercenter/take/dynamic/slh/' + item.id }" class="main">
                {{ item.title }}
                <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
              </router-link>
              <!-- 按受理号订阅 && 新申请 -->
              <router-link v-if="item.field == 'shoulihao' && item.type == 2"
                :to="{ path: '/zhuce/' + item.infoid, query: { msg_readid: item.id } }" class="main"
                @click="changeToReaded(item.type_title, item.id)" target="_blank">
                {{ item.title }}
                <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
              </router-link>
              <router-link v-if="item.dbename == 'globaldrugs'"
                :to="{ path: '/usercenter/take/dynamic/gldrugs/' + item.id, query: { title: item.title } }"
                class="main">
                {{ item.title }}
                <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
              </router-link>
              <!-- 非按受理号订阅 -->
              <router-link
                v-if="item.field != 'shoulihao' && (item.dbename !== 'binggou' && item.dbename !== 'tourongzi' && item.dbename != 'globaldrugs')"
                :to="{ path: '/usercenter/take/dynamic/other/' + item.id, query: { title: item.title } }" class="main">
                {{ item.title }}
                <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
              </router-link>

              <!-- 并购事件 -->
              <router-link v-if="item.dbename === 'binggou'"
                :to="{ path: '/usercenter/take/dynamic/trzMsg/' + item.id, query: { dbename: item.dbename } }"
                class="main">
                您订阅的并购事件新增加<span class="count">{{ item.count }}</span>件
              </router-link>

              <!-- 融资事件 -->
              <router-link v-if="item.dbename === 'tourongzi'"
                :to="{ path: '/usercenter/take/dynamic/trzMsg/' + item.id, query: { dbename: item.dbename } }"
                class="main">
                您订阅的投融资事件新增加<span class="count">{{ item.count }}</span>件
              </router-link>

              <!-- 点击标记为已读 -->
              <i class="handle-read el-icon-circle-check cl-green"
                @click="changeToReaded(item.type_title, item.id)"></i>
            </div>
            <div class="time">{{ item.addtime.split(' ')[0] }}</div>
          </div>
          <!-- 分页栏 -->
          <el-pagination @current-change="handleCurrentChange" :current-page="param.page" :page-size="param.pageSize"
            layout="total, prev, pager, next" :total="dyglAllNum">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
export default {
  data() {
    return {
      param: {
        page: 1,
        pageSize: 10,
      }
    }
  },
  computed: {
    ...mapState({
      accesstoken: state => state.UserCenter.accesstoken,
      data: state => state.UserCenter.dyglData,
      dyglNum: state => state.UserCenter.dyglNum,
      dyglAllNum: state => state.UserCenter.dyglAllNum,
      loading: state => state.UserCenter.loading
    })
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '订阅管理']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '订阅管理'])
    }, 1000);
  },
  methods: {
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val
      Store.dispatch("UserCenter/handleDyglAxios", this.param)
    },
    changeToReaded(theType, theId) {
      if (theType.indexOf('受理号') !== -1) {
        window.Axios({
          method: 'post',
          url: '/api/rss/zhuceshouli',
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: theId,
            msg_readid: theId,
            dingyue: 1
          }
        }).then((res) => {
          if (res.data.code === 200) {
            Store.dispatch("UserCenter/handleDyglAxios", this.param)
            Store.dispatch("UserCenter/handleXxtzAxios", this.param)
            Store.dispatch("UserCenter/handleHeaderMsgAxios", { page: 1, pageSize: 5 })
          }
        }).catch((err) => {
          console.log(err)
        })
      } else if (theType.indexOf('受理号') === -1) {
        window.Axios({
          method: 'post',
          url: '/api/rss/zhuce',
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: theId,
            msg_readid: theId,
            dingyue: 1
          }
        }).then((res) => {
          if (res.data.code === 200) {
            Store.dispatch("UserCenter/handleDyglAxios", this.param)
            Store.dispatch("UserCenter/handleXxtzAxios", this.param)
            Store.dispatch("UserCenter/handleHeaderMsgAxios", { page: 1, pageSize: 5 })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    changeToReadedAll() {
      window.Axios({
        method: 'post',
        url: '/api/usercenter/msgread',
        params: {
          accesstoken: this.vueGetCookie("accesstoken"),
          type: 'rss'
        }
      }).then((res) => {
        if (res.data.code === 200) {
          Store.dispatch("UserCenter/handleDyglAxios", this.param)
          Store.dispatch("UserCenter/handleXxtzAxios", this.param)
          Store.dispatch("UserCenter/handleHeaderMsgAxios", { page: 1, pageSize: 5 })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.mc {
  .right-view {
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
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

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

          .type {
            display: inline-block;
            // box-sizing: border-box;
            padding: 0px 6px;
            margin-right: 18px;
            width: 90px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            border-radius: 10px;
            text-align: center;

            &.zcdy {
              // 注册订阅
              background: @McTypeGreen;
            }

            &.gxgg {
              // 更新公告
              background: @PrimaryColor;
            }

            &.zbgg {
              // 中标公告
              background: @McTypeGray;
            }

            &.xtgg {
              // 系统公告
              background: @McTypeRed;
            }

            &.fkhf {
              // 反馈回复
              background: @McTypeOrange;
            }

            &.binggou {
              // 并购事件
              background: #F3AC00;
            }

            &.rongzi {
              background: #2556C0;
            }

            &.qqyw {
              background: #002FA7;
            }
          }

          .content {
            display: inline-block;
            padding-left: 22px;
            background: url("/static/imgs/usercenter/unread.jpg") 0px 17px no-repeat;

            .topic {
              color: @PrimaryColor;
            }

            .count {
              color: #F4A622;
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

              .topic,
              .count {
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
</style>
