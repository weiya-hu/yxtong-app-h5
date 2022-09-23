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
      <div class="section">
        <div class="head">
          <div class="title">
            <router-link to="/usercenter/take/dynamic"><i class="iconfont">&#xe757;</i><span>订阅动态/</span></router-link>
            <span style="color:#545B6D;">{{ dbename === 'tourongzi' ? '融资事件' : '并购事件' }}</span>
          </div>
        </div>
        <div class="sec-view" v-if="data.res && data.res.length > 0">
          <div class="sec-title">
            <div>时间：{{ data.addtime }}</div>
          </div>

          <template v-if="dbename === 'tourongzi'">
            <div v-for="(item, index) in data.res" :key="item.uid" class="sec-info">
              <div class="info-title">
                <div>
                  <img src="../../../../../static/imgs/trzmsg.png" width="16" height="16"
                    style="margin-right: 5px; vertical-align: text-top" alt="" />
                  融资事件 {{ index + 1 }}
                </div>

                <router-link tag="a" :to="`/trz/rongzi/${item.data_id}`" class="btn" target="_blank">查看详情</router-link>
              </div>

              <div class="info-box">
                <div class="box" v-if="item.time">
                  <span class="box-title">时间：</span>{{ item.time }}
                </div>
                <div class="box" v-if="item.shortname">
                  <span class="box-title">融资方：</span>{{ item.shortname }}
                </div>
                <div class="box" v-if="item.investors">
                  <span class="box-title">投资方：</span>{{ item.investors }}
                </div>
                <div class="box" v-if="item.guifan_amount">
                  <span class="box-title">融资金额：</span>{{ item.guifan_amount }}
                </div>
                <div class="box" v-if="item.country || item.province || item.city">
                  <span class="box-title">融资地区：</span>
                  {{ item.country }} <span v-if="item.province">-</span>
                  {{ item.province }} <span v-if="item.city">-</span>
                  {{ item.city }}
                </div>
                <div class="box" v-if="item.title">
                  <span class="box-title">事件描述：</span>{{ item.title }}
                </div>
                <div class="box" v-if="item.financingpurpose">
                  <span class="box-title">融资目的：</span>{{ item.financingpurpose }}
                </div>
              </div>
            </div>
          </template>

          <template v-if="dbename === 'binggou'">
            <div v-for="(item, index) in data.res" :key="item.uid" class="sec-info">
              <div class="info-title">
                <div>
                  <img src="../../../../../static/imgs/trzmsg.png" width="16" height="16"
                    style="margin-right: 5px; vertical-align: text-top" alt="" />
                  并购事件 {{ index + 1 }}
                </div>

                <router-link tag="a" :to="`/trz/binggou/${item.data_id}`" class="btn" target="_blank">查看详情</router-link>
              </div>

              <div class="info-box">
                <div class="box" v-if="item.time">
                  <span class="box-title">时间：</span>{{ item.time }}
                </div>
                <div class="box" v-if="item.acquirer">
                  <span class="box-title">买方：</span>{{ item.acquirer }}
                </div>
                <div class="box" v-if="item.shortname">
                  <span class="box-title">卖方：</span>{{ item.shortname }}
                </div>
                <div class="box" v-if="item.guifan_amount">
                  <span class="box-title">交易金额：</span>{{ item.guifan_amount }}
                </div>
                <div class="box" v-if="item.country || item.province || item.city">
                  <span class="box-title">交易地区：</span>
                  {{ item.country }} <span v-if="item.province">-</span>
                  {{ item.province }} <span v-if="item.city">-</span>
                  {{ item.city }}
                </div>
                <div class="box" v-if="item.title">
                  <span class="box-title">事件描述：</span>{{ item.title }}
                </div>
                <div class="box" v-if="item.purposeofm_a">
                  <span class="box-title">并购目的：</span>{{ item.purposeofm_a }}
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="all-none" v-else>
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none22.png" />
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
      dbename: "",
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
          url: "/api/rss/tourongzi",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: this.$route.params.id,
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
    this.dbename = this.$route.query.dbename;
    console.log(this.dbename);
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
        margin-top: 40px;

        .sec-title {
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          color: #545b6d;
          padding-bottom: 20px;
          margin-bottom: 20px;
          box-sizing: border-box;
          border-bottom: 1px solid #dfe5f1;
        }

        .sec-info {
          border-radius: 4px;
          border: 1px solid #dfe5f1;
          margin-bottom: 20px;

          .info-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 34px;
            background: #f6f8fc;
            padding: 0 20px;
            border-radius: 4px 4px 0px 0px;

            >div {
              font-size: 16px;
              font-weight: 600;
              color: #4877e8;
            }

            .btn {
              font-size: 14px;
              color: #4877e8;
            }
          }

          .info-box {
            padding: 20px 20px 12px 20px;
            box-sizing: border-box;

            .box {
              font-size: 13px;
              color: #545b6d;
              margin-bottom: 8px;

              .box-title {
                font-weight: bold;
              }
            }
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
