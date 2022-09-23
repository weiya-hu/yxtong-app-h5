<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/collect/database" class="nav-main-lan">收藏管理</router-link>
      <router-link to="/usercenter/collect/database" class="nav-lan nav-lan-active">收藏的数据库&nbsp;&nbsp;></router-link>
      <router-link to="/usercenter/collect/page" class="nav-lan">收藏的页面</router-link>
      <router-link to="/usercenter/collect/company" class="nav-lan">收藏的企业</router-link>
    </div>
    <!--  -->
    <div class="right-view">
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>收藏的数据库</span></div>
        </div>
        <!-- PART:收藏的数据库(无) -->
        <div class="all-none" v-if="!data.count">
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none3.png">
          <div class="all-none-msg">
            <span>您还没有收藏任何东西噢</span>
          </div>
        </div>
        <!-- PART:收藏的数据库(有) -->
        <div class="sec-view" v-else>
          <el-table
            :data="data.res"
            fixed
            class="table"
            style="width: 100%">
            <el-table-column
            v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <div v-if="item.prop === 'shujukumingcheng'">
                  <router-link tag="span" :to="scope.row.url">
                    {{ scope.row.label }}
                  </router-link>
                </div>
                <div v-if="item.prop === 'shujuliang'">
                  {{ scope.row.datacount }}
                </div>
                <div v-if="item.prop === 'zuijingengxinshijian'">
                  {{ scope.row.lastuptime }}
                </div>
                <div v-if="item.prop === 'shoucangshijian'">
                  {{ scope.row.addtime }}
                </div>
                <div v-if="item.prop === 'caozuo'">
                  <el-button type="primary" round size="mini">
                    <router-link tag="span" :to="scope.row.url">
                      查看
                    </router-link></el-button>
                  <el-button type="info" round size="mini" @click="handleClickToCancel(scope.row.favid)">取消</el-button>
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
            :total="data.count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import tableHead from '@/config/tablehead'
const defaultFiled = tableHead.usercenter.sc_sjk
export default {
  data() {
    return {
      data: {},
      tableHead: [],
      param: {
        pageSize: 10,
        page: 1
      }
    }
  },
  computed: {
    ...mapState({
      uid: state => state.UserCenter.uid,
    })
  },
  methods: {
    init () {
      this.tableHead = defaultFiled.reduce((res, item) => {
        if(item.checked){
          res.push(item)
        }
        return res
      }, [])
    },
    handleAxios () {
      window.Axios({
        method: 'get',
        url: '/api/usercenter/scsjklist',
        params: _.assign({
          accesstoken: this.vueGetCookie("accesstoken"),
        }, this.param)
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.data = data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击取消收藏
    async handleClickToCancel (favid) {
      await window.Axios({
        method: 'post',
        url: '/api/usercenter/qxsc',
        params: {
          type: 'sjk',
          accesstoken: this.vueGetCookie("accesstoken"),
          favid: favid
        }
      }).then((res) => {
        if (res.data.code === 200) {
          // console.log("数据库取消收藏成功")
        }
      }).catch((err) => {
        console.log(err)
      })
      
      this.handleAxios() // post之后再get数据
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val
      this.handleAxios()
    },
  },
  created() {
    this.init()
    this.handleAxios()
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '收藏管理']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '收藏管理'])
    }, 1000);
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
        .handle-select {
          float: right;
        }
      }
      .sec-view {
        .el-button {
          padding: 4px 13px;
        }
      }
    }
  }
}
</style>
