<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/take/dynamic" class="nav-main-lan">订阅管理</router-link>
      <router-link to="/usercenter/take/dynamic" class="nav-lan nav-lan-active">订阅动态&nbsp;&nbsp;></router-link>
      <router-link to="/usercenter/take/condition" class="nav-lan">订阅条件</router-link>
      <router-link to="/usercenter/take/new" class="nav-lan">新增订阅</router-link>
    </div>
    <!--  -->
    <div class="right-view">
      <!-- PART:订阅动态 - ypmc -->
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>订阅动态</span></div>
          <div class="handle-clear">
            全部标记为已读<i class="icon el-icon-circle-check cl-green"></i>
          </div>
        </div>
        <div class="sec-view">
          <div class="title">普瑞巴林胶囊</div>
          <div class="preview">
            <div class="hang slh">
              <div class="left">
                <span class="iconfont">&#xe629;</span>
                <span class="name">受理号变化</span>
              </div>
              <div class="middle">
                <span class="num">3</span>
                <span class="dw">个</span>
              </div>
              <div class="right">未读</div>
            </div>
            <div class="hang new">
              <div class="left">
                <span class="iconfont">&#xe616;</span>
                <span class="name">新申请</span>
              </div>
              <div class="middle">
                <span class="num">1</span>
                <span class="dw">个</span>
              </div>
              <div class="right">未读</div>
            </div>
          </div>
          <div class="lans">
            <div class="lan">
              <div class="content">
                <router-link to="/usercenter/take/dynamic/slh" class="main">JYH81800437 甲磺酸沙芬酰胺片</router-link>
                <router-link to="/usercenter/take/dynamic" class="topic">#受理号变化</router-link>
                <!-- 点击标记为已读 -->
                <i class="handle-read el-icon-circle-check cl-green"></i>
              </div>
              <div class="time">2018-07-17</div>
            </div>
            <div class="lan">
              <div class="content">
                <router-link to="/usercenter/take/dynamic/ypmc" class="main">普瑞巴林胶囊</router-link>
                <router-link to="/usercenter/take/dynamic" class="topic"></router-link>
                <!-- 点击标记为已读 -->
                <i class="handle-read el-icon-circle-check cl-green"></i>
              </div>
              <div class="time">2018-07-17</div>
            </div>
            <div class="lan readed">
              <div class="content">
                <router-link to="/usercenter/take/dynamic/qy" class="main">江苏恒瑞医药股份有限公司</router-link>
                <router-link to="/usercenter/take/dynamic" class="topic"></router-link>
                <!-- 点击标记为已读 -->
                <i class="handle-read el-icon-circle-check cl-green"></i>
              </div>
              <div class="time">2018-07-17</div>
            </div>
          </div>
        </div>
        <!-- 分页栏 -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-size="param.pageSize"
          layout="total, prev, pager, next"
          :total="23456">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data () {
    return {
      param: {
        page :1,
        pageSize: 10,
      }
    }
  },
  created () {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '订阅管理']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '订阅管理'])
    }, 1000);
  },
  methods: {
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      
    }
  },
}
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
            width: 49.5%;
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
              .main {

              }
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
            &.unread {}
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
                    display: none!important;
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
