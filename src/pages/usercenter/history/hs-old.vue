<template>
  <div class="mc">
    <div class="left-nav">
      <router-link to="/usercenter/history/saved" class="nav-main-lan">搜索记录</router-link>
      <router-link to="/usercenter/history/saved" class="nav-lan">保存的条件</router-link>
      <router-link to="/usercenter/history/old" class="nav-lan nav-lan-active">历史搜索&nbsp;&nbsp;></router-link>
    </div>
    <div class="right-view">
      <!-- PART:历史搜索 -->
      <div class="section">
        <div class="head">
          <div class="title"><i class="iconfont">&#xe757;</i><span>历史搜索</span></div>
        </div>
        <div class="sec-view">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  created() {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', '搜索记录']);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', '搜索记录'])
    }, 1000);
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.mc {
  .right-view {
    .section {
      .head {
        .handle-select {
          float: right;
        }
      }
      .sec-view {
        .more-btn {
          cursor: pointer;
          display: inline-block;
          width: 50px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          border-radius: 10px;
          background: @PrimaryColor;
          color: #fff;
          &:hover {
            background: Lighten(@PrimaryColor, 10%);
          }
        }
        .cancel-btn {
          cursor: pointer;
          display: inline-block;
          width: 50px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          border-radius: 10px;
          background: #97a2bf;
          color: #fff;
          &:hover {
            background: Lighten(#97a2bf, 10%);
          }
        }
      }
    }
  }
}
</style>
