<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/history/saved" class="nav-main-lan">搜索记录</router-link>
      <router-link to="/usercenter/history/saved" class="nav-lan nav-lan-active">保存的条件&nbsp;&nbsp;></router-link>
      <!-- <router-link to="/usercenter/history/old" class="nav-lan">历史搜索</router-link> -->
    </div>
    <div class="right-view" v-waiting="loading">
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>保存的条件</span></div>
        </div>
        <!-- PART:保存的条件(无) -->
        <div class="all-none" v-if="!saved_all_count">
          <img class="all-none-pic" src="/static/imgs/usercenter/nodata/none4.png">
          <div class="all-none-msg">
            <span>您还没有保存任何搜索条件噢</span>
          </div>
        </div>
        <!-- PART:保存的条件(有) -->
        <div class="sec-view" v-else>
          <el-table :data="list" class="table" style="width: 100%">
            <el-table-column v-for="item in tableHead" :prop="item.prop" :min-width="item.width" :key="item.prop"
              :label="item.label">
              <template slot-scope="scope">
                <div v-if="item.prop === 'wherename'">
                  {{ scope.row.wherename }}
                </div>
                <div v-if="item.prop === 'dbname'">
                  {{ scope.row.dbname }}
                </div>
                <div v-if="item.prop === 'addtime'">
                  {{ vueTimestampToTime(scope.row.addtime) }}
                </div>
                <div v-if="item.prop === 'caozuo'">
                  <el-button type="primary" round size="mini"
                    @click="hanldeSavedSearch(scope.row.dbename, scope.row.whereinfo)">检索</el-button>
                  <el-button type="danger" round size="mini" @click="handleDelOption(scope.row.id, scope.row.dbename)">
                    删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页栏 -->
          <el-pagination @current-change="handleCurrentChange" :current-page="param.page" :page-size="param.pageSize"
            layout="total, prev, pager, next" :total="saved_all_count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tableHead from '@/config/tablehead'
const defaultFiled = tableHead.usercenter.hs_saved

export default {
  data() {
    return {
      loading: true,
      defaultFiled: defaultFiled,
      list: [],
      tableHead: [],
      saved_all_count: 0,
      param: {
        page: 1,
        pageSize: 10,
      }
    }
  },
  methods: {
    init() {
      this.tableHead = defaultFiled.reduce((res, item) => {
        if (item.checked) {
          res.push(item)
        }
        return res
      }, [])
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.param.page = val
      this.handleAxios()
    },
    handleAxios() {
      window.Axios({
        method: 'get',
        url: '/api/usercenter/savewherelist',
        params: _.assign(this.param, {
          accesstoken: this.vueGetCookie("accesstoken")
        })
      }).then((res) => {
        if (res.data.code == 200 && res.data.data) {
          let data = res.data.data
          this.list = data.res
          this.saved_all_count = data.count ? data.count : 0
          // console.log(this.saved_all_count)
        } else if (res.data.code == 404) { //解决最后一条数据已经删除了 但是页面依然显示的问题
          this.saved_all_count = 0
        }
        this.loading = false;
      }).catch((err) => {
        console.log(err)
        this.loading = false;
      })
    },
    hanldeSavedSearch(dbname, api_addr) {
      //由于一致性评价需要定向到/pjdt，所以添加判断
      window.open(`/${dbname === 'yzx' ? 'yzx/pjjd' : dbname}?saved_condition=${encodeURIComponent(api_addr)}`, "_blank")
    },
    // 点击删除的事件
    handleDelOption(id, dbname) {
      window.Axios({
        method: 'get',
        url: '/api/' + dbname + '/delsavewhere',
        params: {
          accesstoken: this.vueGetCookie('accesstoken'),
          id: id,
        }
      }).then((res) => {
        if (res.data.code == 200) {
          this.handleAxios()
        }
      })
    },
  },
  created() {
    this.init()
    this.handleAxios()
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '搜索记录']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '搜索记录'])
    }, 1000);
  },
  // updated(){
  //   this.handleAxios()
  // }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.mc {
  .right-view {
    float: right;
    width: 1020px;

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
