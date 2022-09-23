<template>
  <div class="mc">
    <!-- 左边 - 子导航 -->
    <div class="left-nav">
      <router-link to="/usercenter/message" class="nav-main-lan">消息通知&nbsp;&nbsp;&nbsp;&nbsp;></router-link>
      <div class="yaozh-down">
        <img src="/static/imgs/hand-data.gif" />
      </div>
    </div>
    <!-- 右边 - 对应内容 -->
    <div class="right-view" v-waiting="xxtzNumLoading">
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>全部通知</span></div>
          <div class="handle-clear" v-if="xxtzNum" @click="changeToReadedAll">
            全部标记为已读<i class="icon el-icon-circle-check cl-green"></i>
          </div>
        </div>
        <!-- PART:全部通知(无) -->
        <div class="all-none" v-if="!xxtzNum">
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none1.png">
          <div class="all-none-msg">
            <span>暂无消息</span>
          </div>
        </div>
        <!-- PART:全部通知(有) -->
        <div class="sec-view" v-if="xxtzNum">
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
              <!-- 数据库对于ID（0为系统消息，2为注册数据库） -->
              <!-- 系统消息 -->
              <template v-if="item.dbename !== 'binggou' && item.dbename !== 'tourongzi'">
                <router-link v-if="item.dbid === 0 && item.type !== 13" :to="{
                  path: '/usercenter/message/' + item.id, query: {
                    infoid_formid: item.infoid
                  }
                }" class="main" :data-url="'/api/usercenter/notice'" :data-id="item.id">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
                <!-- 反馈回复 -->
                <router-link v-else-if="item.dbid === 0 && item.type === 13"
                  :to="'/usercenter/suggest/' + item.infoid + '-' + item.id" class="main"
                  :data-url="'/api/usercenter/jyfkdetail'" :data-id="item.id">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
                <!-- 注册数据库 - 按受理号订阅 && 受理号变化 -->
                <router-link v-else-if="item.dbid !== 0 && item.field == 'shoulihao' && item.type == 1"
                  :to="{ path: '/usercenter/take/dynamic/slh/' + item.id }" class="main"
                  :data-url="'/api/rss/zhuceshouli'" :data-id="item.id">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
                <!-- 注册数据库 - 按受理号订阅 && 新申请 -->
                <router-link v-else-if="item.dbid !== 0 && item.field == 'shoulihao' && item.type == 2"
                  :to="{ path: '/zhuce/' + item.infoid }" class="main" target="_blank" :data-url="'/api/rss/zhuce'"
                  :data-id="item.id">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
                <!-- 全球药物订阅 -->
                <router-link v-else-if="item.dbid !== 0 && item.dbename == 'globaldrugs'"
                  :to="{ path: '/usercenter/take/dynamic/gldrugs/' + item.id, query: { title: item.title } }" class="main"
                  :data-url="'/api/rss/globaldrugs'" :data-id="item.id">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
                <!-- 注册数据库 - 非按受理号订阅 -->
                <router-link v-else-if="item.dbid !== 0 && item.field != 'shoulihao'"
                  :to="{ path: '/usercenter/take/dynamic/other/' + item.id, query: { title: item.title } }" class="main"
                  :data-url="'/api/rss/zhuce'" :data-id="item.id">
                  {{ item.title }}
                  <span class="topic"><span v-if="item.type_title">#</span>{{ item.type_title }}</span>
                </router-link>
              </template>
              <template v-else>
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
              </template>

              <!-- 点击标记为已读 -->
              <i class="handle-read el-icon-circle-check cl-green" @click.stop="changeToReaded(item.id, $event)"></i>
            </div>
            <div class="time">{{ item.addtime.split(' ')[0] }}</div>
          </div>
        </div>
        <!-- 分页栏 -->
        <el-pagination v-if="xxtzNum" @current-change="handleCurrentChange" :current-page="param.page"
          :page-size="param.pageSize" layout="total, prev, pager, next" :total="xxtzNum">
        </el-pagination>
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
      data: state => state.UserCenter.xxtzData,
      xxtzNumLoading: state => state.UserCenter.xxtzNumLoading,
      xxtzNum: state => state.UserCenter.xxtzNum,
    })
  },
  created() {
    Store.dispatch("UserCenter/handleXxtzAxios", { page: 1, pageSize: 10 })
  },
  methods: {
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val
      Store.dispatch("UserCenter/handleXxtzAxios", this.param)
    },
    changeToReaded(theId, event) {
      let url = ''
      let params = {}
      let urlId = event.currentTarget.parentNode.firstChild.attributes['data-id'].value
      let urlData = event.currentTarget.parentNode.firstChild.attributes['data-url'].value
      if (urlData === '/api/usercenter/jyfkdetail') {//反馈回复
        url = urlData
        // console.log(url)
        // console.log(urlId)
        params = {
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            fid: urlId,
            msg_readid: urlId,
            id: urlId,
            from: 1,
          }
        }
      } else if (urlData === '/api/usercenter/notice') {
        url = urlData
        params = {
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: urlId,
            msg_readid: urlId,
            from: 1,
          }
        }
      } else if (urlData === '/api/rss/zhuceshouli') {//订阅 传参dingyue:1
        url = urlData
        params = {
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: urlId,
            msg_readid: urlId,
            dingyue: 1
          }
        }
      } else { //订阅 传参dingyue:1
        url = '/api/rss/zhuce'
        params = {
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: urlId,
            msg_readid: urlId,
            dingyue: 1
          }
        }
      }
      let obj = {
        method: 'post',
        url: url,
      }
      Axios(Object.assign({}, obj, params)).then((res) => {

        if (res.data.code === 200) {
          Store.dispatch("UserCenter/handleXxtzAxios", this.param)
          Store.dispatch("UserCenter/handleHeaderMsgAxios", { page: 1, pageSize: 5 })
          Store.dispatch("UserCenter/handleDyglAxios", this.param)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    changeToReadedAll() {
      window.Axios({
        method: 'post',
        url: '/api/usercenter/msgread',
        params: {
          accesstoken: this.vueGetCookie("accesstoken"),
          type: 'all'
        }
      }).then((res) => {
        if (res.data.code === 200) {
          Store.dispatch("UserCenter/handleXxtzAxios", this.param)
          Store.dispatch("UserCenter/handleHeaderMsgAxios", { page: 1, pageSize: 5 })
          Store.dispatch("UserCenter/handleDyglAxios", this.param)

        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
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
          // line-height: 48px;
          font-size: 14px;

          &:hover {
            .content {
              .handle-read {
                display: inline-block;
              }
            }
          }

          .type {
            float: left;
            // box-sizing: border-box;
            padding: 0px 6px;
            margin-right: 18px;
            margin-top: 13px;
            width: 88px;
            height: 20px;
            line-height: 20px;
            color: #fff;
            border-radius: 10px;
            text-align: center;

            &.gxgg {
              // 更新公告
              background: @PrimaryColor;
            }

            &.zcdy {
              // 注册订阅
              background: @McTypeGreen;
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
            float: left;
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
              vertical-align: top;
              margin-top: 15px;

              &:hover {
                color: Lighten(@McTypeGreen, 5%);
              }
            }

            a {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 720px;
              display: inline-block;
              margin-top: 13px;
            }
          }

          .time {
            float: right;
            width: 80px;
            margin-top: 12px;
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
</style>
