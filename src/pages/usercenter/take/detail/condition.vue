<template>
  <div class="mc condition">
    <div class="left-nav">
      <router-link to="/usercenter/take/dynamic" class="nav-main-lan"
        >订阅管理</router-link
      >
      <router-link to="/usercenter/take/dynamic" class="nav-lan"
        >订阅动态</router-link
      >
      <router-link
        to="/usercenter/take/condition"
        class="nav-lan nav-lan-active"
        >订阅条件&nbsp;&nbsp;></router-link
      >
      <router-link to="/usercenter/take/new" class="nav-lan"
        >新增订阅</router-link
      >
      <div style="margin-top: 20px; padding: 0 20px; font-weight: 400">
        关注药智数据服务号
        <p style="color: #868ea3">随时随地掌握最新动态</p>
      </div>
      <img
        width="96"
        height="96"
        style="margin: 10px 0 0 18px"
        src="../../../../../static/imgs/wechart/code.png"
        alt=""
      />
    </div>
    <div class="right-view" v-waiting="dytjLoading">
      <!-- PART:订阅条件 -->
      <div class="section">
        <!-- 暂时影藏 -->
        <!-- <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>订阅条件</span></div>
          <el-select v-model="value" placeholder="请选择订阅数据库" class="handle-select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <!-- PART:订阅动态(无) -->
        <div class="all-none" v-if="!data.count">
          <img
            class="all-none-pic"
            src="/static/imgs/usercenter/nodata/none22.png"
          />
          <div class="all-none-msg">
            <span
              >您还没有订阅任何数据噢，马上去
              <router-link tag="a" to="/usercenter/take/new" class="link-blue"
                >添加</router-link
              >
            </span>
          </div>
        </div>
        <!-- PART:订阅动态(有) -->
        <div class="sec-view" v-else>
          <el-table :data="data.res" fixed class="table" style="width: 100%">
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'dingyueshujuku'">
                  {{ scope.row.head_title }}
                </div>
                <div v-if="item.prop === 'dingyuefenlei'">
                  {{ scope.row.category }}
                </div>
                <div
                  v-if="item.prop === 'guanjianzi'"
                  class="keywords"
                  v-html="scope.row.keywords"
                ></div>
                <div v-if="item.prop === 'jieshoupinlv'">
                  {{ scope.row.subscribe_title }}
                </div>
                <div v-if="item.prop === 'jieshoufangshi'">
                  {{ scope.row.send_title }}
                </div>
                <div v-if="item.prop === 'dingyueshijian'">
                  {{ timestampToTime(scope.row.addtime) }}
                </div>
                <div v-if="item.prop === 'caozuo'">
                  <el-button
                    type="info"
                    round
                    size="mini"
                    @click="deleteRow(scope.row.id)"
                    style="
                      background: #97a2bf;
                      color: #fff;
                      padding: 4px 13px;
                      line-height: 1;
                    "
                    >取消</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination
            v-if="data.count"
            @current-change="handleCurrentChange"
            :current-page="param.page"
            :page-size="param.pageSize"
            layout="total, prev, pager, next"
            :total="data.count"
          >
          </el-pagination>
        </div>
        <!-- 各类提示 -->
        <div class="alert" @click="hideAlerts()">
          <!-- 取消订阅成功 -->
          <div class="right right1">
            <span>取消订阅成功</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import tableHead from "@/config/tablehead";
const defaultFiled = tableHead.usercenter.dytj;
export default {
  data() {
    return {
      defaultFiled: defaultFiled,
      options: [
        {
          value: "1",
          label: "药品注册与受理",
        },
        {
          value: "2",
          label: "医院数据库",
        },
        {
          value: "3",
          label: "器械标准数据库",
        },
        {
          value: "4",
          label: "中标数据库",
        },
        {
          value: "5",
          label: "上市公司数据库",
        },
      ],
      value: "",
      tableHead: [],
      param: {
        page: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapState({
      data: (state) => state.UserCenter.dytjData,
      accesstoken: (state) => state.UserCenter.accesstoken,
      dytjLoading: (state) => state.UserCenter.dytjLoading,
    }),
  },
  watch: {
    $route() {
      this.hideAlerts();
    },
  },
  methods: {
    init() {
      this.tableHead = defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item);
        }
        return res;
      }, []);
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val;
      Store.dispatch("UserCenter/handleDytjAxios", this.param);
    },
    // 时间戳转化为时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return Y + M + D;
    },
    // 点击取消的事件
    async deleteRow(msgid) {
      await window
        .Axios({
          method: "post",
          url: "/api/rss/delrsswhere",
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
            id: msgid,
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            Store.dispatch("UserCenter/handleDytjAxios", this.param);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      this.toggleAlert("right1");
    },
    toggleAlert(cls) {
      // 切换alert提示
      $(".alert").fadeIn();
      $(".alert")
        .find("." + cls)
        .fadeIn();
      setTimeout(() => {
        $(".alert").fadeOut();
        $(".alert")
          .find("." + cls)
          .fadeOut();
      }, 2000);
    },
    hideAlerts() {
      $(".alert").hide();
    },
  },
  created() {
    this.init();
    Store.dispatch("UserCenter/handleDytjAxios", this.param);
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
// @import "~@/assets/less/app.less";

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
      position: relative;

      .head {
        .handle-select {
          float: right;
        }
      }

      .sec-view {
        .el-button {
          padding: 0px 13px;
          font-size: 12px;
        }
      }

      .alert {
        z-index: 9999;
        display: none;
        width: 175px;
        height: 105px;
        position: absolute;
        top: 100px;
        left: 50%;
        margin-left: -87.5px;

        .right {
          position: relative;
          width: 175px;
          height: 105px;
          background: url("/static/imgs/usercenter/alert/right.png") no-repeat;

          span {
            position: absolute;
            bottom: 22px;
            left: 0px;
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }
        }

        .wrong {
          position: relative;
          width: 175px;
          height: 105px;
          background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;

          span {
            position: absolute;
            bottom: 22px;
            left: 0px;
            width: 100%;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }
        }

        div {
          display: none;
        }
      }
    }
  }
}

.el-select-dropdown__list {
  li {
    padding: 0 20px;
  }
}
</style>

<style lang="less">
.condition {
  .el-table tbody td > .cell > div {
    display: flex;
    align-items: center;
  }

  .keywords {
    font-size: 14px;
    font-weight: 400;
    color: #4877e8;
    line-height: 20px;
    flex-wrap: wrap;
  }

  .is_like {
    display: flex;
    justify-content: center;
    width: 48px;
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #90c320;
    line-height: 12px;
  }
}
</style>
