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
    <div class="right-view">
      <!-- PART:订阅动态 - slh -->
      <div class="section">
        <div class="head">
          <div class="title">
            <router-link to="/usercenter/take/dynamic"><i class="iconfont">&#xe757;</i><span>订阅动态/</span></router-link>
            <span style="color: #545b6d">全球药物2.0订阅</span>
          </div>
        </div>
        <div class="sec-view" v-if="showView">
          <div class="head">
            <div>
              <router-link tag="a" :to="{
                path: '/globaldrugs/detail',
                query: {
                  drugname_standard: data.drugname_hash,
                  company_standard: data.company_standard_hash,
                },
              }" target="_blank">{{ data.drugname }}
              </router-link>
              <template v-for="item in data.company_standard_list">
                <router-link v-if="item.company_hash" :key="item.name" tag="a" :to="{
                  path: '/globaldrugs/companyDetail',
                  query: {
                    company_standard: item.company_hash,
                  },
                }" target="_blank" style="color: #9aa4b8" class="cpy">
                  {{ item.name }}
                </router-link>
                <span class="cpy" v-else style="color: #9aa4b8;font-size: 14px;font-weight: bold;">
                  {{ item.name }}
                </span>
              </template>
            </div>
            <span style="color: #9aa4b8; font-size: 13px">
              变更时间：
              {{ data.addtime }}</span>
            <!-- <span>{{ data.drugname }}</span> -->
            <!-- <span>{{ data.company_standard }}</span> -->
            <!-- <span>承办日期：{{data.addtime}}</span> -->
          </div>
          <div class="main">
            <table class="main-table">
              <tr>
                <th class="before">变更前</th>
                <th class="field">变化状态</th>
                <th class="after">变更后</th>
              </tr>
              <tr v-for="col in data.change_data" :key="col.field_name">
                <td>
                  <div v-if="col.is_mult">
                    <div v-for="(i, k) in col.old" :key="k" style="margin-bottom: 10px" class="change-item">
                      <template v-if="i">
                        <span class="tag green" v-if="k == 'pizhun'">{{
                          keymap[k]
                          }}</span>
                        <span class="tag blue" v-else-if="k == 'zaiyan'">{{
                          keymap[k]
                          }}</span>
                        <span class="tag red" v-else-if="k == 'zhongzhi'">{{
                          keymap[k]
                          }}</span>
                        <span class="label" v-else>{{ keymap[k] }}：</span>
                        <div class="change-item_context">{{ i }}</div>
                      </template>
                    </div>
                  </div>
                  <div v-else>{{ col.old }}</div>
                </td>
                <td>
                  <div>{{ col.field_name }}</div>
                </td>
                <td>
                  <div v-if="col.is_mult">
                    <div v-for="(i, k) in col.new" :key="k" style="margin-bottom: 10px" class="change-item">
                      <template v-if="i">
                        <span class="tag green" v-if="k == 'pizhun'">{{
                          keymap[k]
                          }}</span>
                        <span class="tag blue" v-else-if="k == 'zaiyan'">{{
                          keymap[k]
                          }}</span>
                        <span class="tag red" v-else-if="k == 'zhongzhi'">{{
                          keymap[k]
                          }}</span>
                        <span class="label" v-else>{{ keymap[k] }}：</span>
                        <span class="change-item_context" v-html="highlight(i, col.old[k])" style="color: #002fa7">
                        </span>
                      </template>
                    </div>
                  </div>
                  <div v-else>
                    <span v-html="highlight(col.new, col.old)" style="color: #002fa7">
                    </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div style="display: flex; justify-content: flex-end">
            <router-link class="more-btn" tag="a" :to="{
              path: '/globaldrugs/detail',
              query: {
                drugname_standard: data.drugname_hash,
                company_standard: data.company_standard_hash,
              },
            }" target="_blank">
              查看详情
            </router-link>
          </div>
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
      showView: true,
      data: {},
      keymap: {
        pizhun: "批准",
        zaiyan: "在研",
        zhongzhi: "终止",
        company_standard: "原研企业",
        coo_company: "合作企业",
        per_company: "许可企业",
      },
    };
  },
  computed: {
    ...mapState({
      accesstoken: (state) => state.UserCenter.accesstoken,
    }),
  },

  methods: {
    highlight(nval, oval) {
      let content = nval.replace(
        oval,
        `<font style="color:#333">${oval}</font>`
      );
      return content;
    },
    handleAxios() {
      window
        .Axios({
          method: "get",
          url: "/api/rss/globaldrugs",
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
          this.showView = this.data.change_data && this.data.change_data.length > 0
        })
        .catch((err) => {
          console.log(err);
          this.showView = false;
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

          // text-align: center;
          margin-bottom: 5px;
          padding: 0 12px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &>span {
            display: inline-block;
            margin: 0px 10px;
          }

          a {
            color: #333;
            font-size: 14px;
            line-height: 1;
            font-weight: bold;

            &:first-child::before {
              content: "";
              display: inline-block;
              width: 2px;
              height: 14px;
              border-radius: 1px;
              background-color: #002fa7;
              margin-right: 5px;
              top: 1px;
              position: relative;
            }
          }
        }

        .main {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;

          &-table {
            width: 100%;

            th {
              height: 40px;
              background-color: #ebeef5;
              color: #333333;
              text-align: left;
              padding: 0 10px;
            }

            td {
              border: 1px solid #dfe5f1;
              font-size: 13px;
              color: #333;

              &>div {
                min-height: 40px;
                padding: 12px;
                box-sizing: border-box;
              }
            }

            .label {
              font-weight: bold;
            }

            .tag {
              display: inline-block;
              width: 50px;
              height: 20px;
              border-radius: 2px;
              border-width: 1px;
              border-style: solid;
              font-size: 12px;
              text-align: center;
              vertical-align: middle;
              box-sizing: border-box;
              line-height: 18px;

              &.green {
                border-color: #9dcc40;
                color: #9dcc40;
              }

              &.blue {
                border-color: #002fa7;
                color: #002fa7;
              }

              &.red {
                border-color: #c14a27;
                color: #c14a27;
              }
            }

            .before,
            .after {
              width: 400px;
            }

            .field {
              width: 220px;
            }
          }
        }

        .more-btn {
          width: 80px;
          height: 28px;
          box-sizing: border-box;
          line-height: 28px;
          color: #fff;
          font-size: 12px;
          background: #002fa7;
          border-radius: 3px;
          text-align: center;
          text-decoration: none;
          display: block;
          cursor: pointer;
          margin-top: 20px;

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

.cpy {
  &::after {
    content: ";"
  }

  &:last-child::after {
    content: ""
  }
}

.change-item {
  display: flex;

  &_context {
    flex: 1;
    margin-left: 10px;
  }
}
</style>
