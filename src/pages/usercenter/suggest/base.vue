<template>
  <div class="mc">
    <!-- 问题反馈弹出框 -->
    <el-dialog :visible.sync="dialogFeedbackShow" :modal-append-to-body="false" width="820px">
      <div slot="title" class="dialog-header">
        问题反馈
      </div>
      <DialogFeedback @closeDialog="closeDialogFeedback"></DialogFeedback>
    </el-dialog>
    <!-- 左侧导航 -->
    <div class="left-nav">
      <router-link to="/usercenter/suggest" class="nav-main-lan">建议反馈&nbsp;&nbsp;&nbsp;&nbsp;></router-link>
    </div>
    <!-- 右侧视图 -->
    <div class="right-view" v-waiting="loading">
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>我的反馈</span></div>
        </div>
        <!-- PART:我的反馈(无) -->
        <div class="all-none" v-if="!data.count">
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none5.png">
          <div class="all-none-msg">
            <span>您还没有反馈任何东西噢，快去 <a class="link-blue" @click="showFeedback()">吐槽</a> 一下吧~</span>
          </div>
        </div>
        <!-- PART:我的反馈(有) -->
        <div class="sec-view" v-else>
          <el-table :data="data.res" class="table" style="width: 100%">
            <el-table-column v-for="item in tableHead" :prop="item.prop" :min-width="item.width" :key="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <div v-if="item.prop === 'fankuineirong'" v-html="scope.row.content"></div>
                <div v-if="item.prop === 'fankuiriqi'">
                  {{ scope.row.addtime }}</div>
                <div v-if="item.prop === 'zhuangtai'"
                  :style="{ color: (scope.row.isreply == 1 ? '#90c320' : '#f77d54') }">
                  {{ scope.row.isreply == 1 ? '已回复' : '未回复' }}
                </div>
                <div v-if="item.prop === 'caozuo'">
                  <el-button type="primary" round size="mini" class="usercenter-suggest-view-btn"
                    @click.prevent="handleSuggestView(scope.row.id)">
                    查看
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination @current-change="handleCurrentChange" :current-page="param.page" :page-size="param.pageSize"
            layout="total, prev, pager, next" :total="data.count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DialogFeedback from '@/components/common/dialog-feedback'
import { mapState } from 'vuex'
import tableHead from '@/config/tablehead'
const defaultFiled = tableHead.usercenter.my_suggest

export default {
  components: {
    DialogFeedback,
  },
  data() {
    return {
      loading: true,
      dialogFeedbackShow: false, // 建议反馈弹出框显示判断
      defaultFiled: defaultFiled,
      data: {},
      tableHead: [],
      param: { // 页码 & 每页数量
        pageSize: 10,
        page: 1,
      }
    }
  },
  computed: {
    ...mapState({
      uid: state => state.UserCenter.uid,
    })
  },
  methods: {
    closeDialogFeedback() {
      this.dialogFeedbackShow = false
    },
    showFeedback() {
      this.dialogFeedbackShow = true
    },
    // 
    init() {
      this.tableHead = defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item)
        }
        return res
      }, [])
    },
    // AXIOS - 获取数据
    handleAxios() {
      window.Axios({
        method: 'get',
        url: '/api/usercenter/jyfklist',
        params: _.assign({
          accesstoken: this.vueGetCookie("accesstoken"),
        }, this.param)
      }).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.data = data
        }
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.log(err);
      })
    },
    // 点击取消的事件
    deleteRow() {

    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val
      this.handleAxios()
    },
    handleSuggestView(id) {
      this.$router.push({
        path: "/usercenter/suggest/" + id
      })
    }
  },
  created() {
    this.init()
    this.handleAxios()
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '建议反馈']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '建议反馈'])
    }, 1000);
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";

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
        .handle-select {
          float: right;
        }
      }

      .sec-view {
        .el-pagination {
          margin: 20px;
        }

        .el-button {
          padding: 4px 13px;
        }
      }
    }

    .usercenter-suggest-view-btn {
      height: 22px;
      line-height: 12px;
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
