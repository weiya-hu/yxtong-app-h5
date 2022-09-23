<template>
  <div>
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="china-page" v-else>
      <MainTop title="文献" :detailTitle="title" :backPath="'/literature'" :countShow="false"/>
      <div class="detail-type" v-if="othervipcategoryDetail.length>0 && permission.length>0">
        <div class="header">
          <div class="lc">{{title}}</div>
        </div>
        <div class="content">
          <div class="tab-tilte">
            <span
              v-for="(item, index) in othervipcategoryDetail"
              :key="index"
              @click="cur=item.id"
              :class="{active:cur==item.id}"
            >{{item.name}}</span>
          </div>
          <div class="tab-content">
            <template v-for="(item , index) in othervipcategoryDetail">
              <div :key="index" v-show="cur == item.id">
                <div class="main-con" id="otherVIPCategroy" v-if="
                    othervipcategoryDetail.length > 0 &&
                    permission.includes(item.name) &&
                    item.children.length > 0
                  ">
                    <!-- <div :key="idx" v-html="item.textarea"></div>    -->
                    <!-- <template v-for="(children , idx) in item.children" >
                        <div :key="idx"  v-html="children.textarea"></div>
                    </template>                -->
                </div>
                <div v-else>
                  <noPermission></noPermission>
                </div>
                <div class="footer">
                  <p>
                    <i class="el-icon-warning cl-green pr5"></i>帮助为了您更好的查询，如以上数据库用户名和密码不能登录，请及时与我们联系，电话：
                    <span>023-62988285</span>
                    <a href="tencent://message/?uin=2102176267&Site=&Menu=yes">客服QQ</a>或发邮件至
                    <a href="mailto:yaozh99@163.com?subject=邮件标题&body=邮件内容">yaozh99@163.com</a>
                  </p>
                  <p>
                    如果出现页面打不开的情况，请尝试清空浏览器数据，方法见
                    <a
                      href="https://jingyan.baidu.com/article/8065f87fc59f1723312498f1.html"
                      target="_blank"
                    >清空浏览器数据</a>
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
  import MainTop from '@/components/common/main-top'
  import noPermission from "@/pages/permission/no-permission";
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        title:'',
        cur:''
      }
    },
    components: {
      LoadingGif,
      noPermission,
      MainTop
    },
    computed: {
      ...mapState({
        permission: state => state.Vipwenxian.permission,
        othervipcategoryDetail: state => state.Vipwenxian.othervipcategoryDetail,
        isLoading: state => state.Vipwenxian.isLoading
      })
    },
    watch: {
      $route(to, from) {
        this.cur = to.fullPath.split("?")[1];
      },
      othervipcategoryDetail:{
        handler(newVal) {
          this.$nextTick(() => {
            setTimeout(() => {
              $.each($(".tab-content .main-con"), function(i, o) {
                $(o).empty()
                newVal[i].children.forEach((item, i3) => {
                  $(o).append(item.textarea + '<br />')
                })
              })
            }, 500);
          })
        },
        deep: true,
        immediate: true
      }
    },
    methods: {},
    created() {
      this.$store.commit(
        "Vipwenxian/accesstoken",
        this.vueGetCookie("accesstoken")
      );
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', '文献']);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', '文献'])
      }, 1000);
    },
    mounted() {
      const { params,query } = this.$route;
      this.title = query.name;
      this.cur = query.cur;
      this.$store.dispatch("Vipwenxian/getOthervipcategory", {
        pid: params.id
      });
      window.handle = function(value) {
        window.ga("send", "event", "button", "vip_qiyeban", value);
        window._paq.push(['trackEvent', 'button', 'vip_qiyeban',value, ])
      };
    },
    activated() {
      const { params,query } = this.$route;
      this.title = query.name;
      this.cur = query.cur;
      this.$nextTick(() => {
        setTimeout(() => {
          $.each($(".tab-content .main-con"), (i, o)=> {
            $(o).empty()
            this.othervipcategoryDetail[i].children.forEach((item, i3) => {
              $(o).append(item.textarea + '<br />')
            })
          })
        }, 500);
      })
    }
  }
</script>
 <style lang="less" >
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.la-app .la-app-main {
  .china-page {
    width: 100%;
    padding: 0 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .nav {
      height: 24px;
      line-height: 24px;
      text-align: bottom;
      .el-breadcrumb {
        padding: 0;
      }
      .la-left {
        float: left;
        font-size: 24px;
        font-weight: bold;
        color: @PrimaryColor;
      }
      .la-right {
        float: right;
      }
    }
    .detail-type {
      box-shadow: 0px 0px 5px #c4d3f8;

      &:hover{
        box-shadow: 0px 0px 10px 2px #c4d3f8;
      }

      &:hover .header .lc{
        color: @PrimaryColor;
      }

      .header {
        width: 100%;
        height: 43px;
        line-height: 43px;
        background: #eff2fa;
        position: relative;
        .lc {
          display: inline-block;
          font-weight: bold;
          font-size: 16px;
          margin-left: 20px;
          color: #545b6d;
        }
      }
      .content {
        background: #fff;
        padding-top: 15px;
        position: relative;
        height: 600px;
        cursor: pointer;
        .tab-tilte {
          border-bottom: 1px solid #eff2fa;
          width: 80%;
          span {
            display: inline-block;
            padding: 0 8px;
            margin-left: 26px;
            border-bottom: 2px solid #fff;
            color: #545b6d;
            font-size: 13px;
          }
          .active {
            color: @PrimaryColor;
            border-bottom: 2px solid @PrimaryColor;
          }
        }
        .tab-content {
          margin: 35px 0 0 32px;
          font-size: 13px;
          .main-con {
            height: 440px;
            .subtitle {
              margin-bottom: 10px;
              button {
                margin: 0;
                padding: 0;
                border: none; //自定义边框
                outline: none; //消除默认点击蓝色边框效果
                background: #fff;
                &:hover {
                  color: @PrimaryColor;
                  text-decoration: underline;
                }

                i {
                  color: @PrimaryColor;
                  font-size: 13px;
                }
              }
            }
            .detail {
              width: 80%;

              background: #eff2fa;
              padding-bottom: 26px;
              p {
                margin: 0 42px;
                padding-top: 20px;
              }
            }
          }
          .no-pms-msg {
            margin-left: -400px;
          }
          .footer {
            color: #545b6d;
            font-size: 13px;
            padding-top: 24px;
            p {
              line-height: 20px;
              margin: 0;
              i {
                margin-right: 4px;
              }
              span {
                color: @PrimaryColor;
              }
              a {
                color: @PrimaryColor;
              }
              &:last-child {
                margin-left: 18px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
