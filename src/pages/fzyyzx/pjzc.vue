<template>
  <div class="list-tabs">
    <el-tabs v-model="activeTabName" @tab-click="handleClickTag">
      <el-tab-pane
        label="政策法规"
        name="zcfg">
        <ListZcfg></ListZcfg>
      </el-tab-pane>
      <el-tab-pane
        name="wtjd">
        <span slot="label">问题解答
          <el-tooltip effect="light" placement="right">
            <div slot="content">该问题解答整理自CDE仿制药一致性评价百问百答</div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </span>
        <ListWtjd></ListWtjd>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ListZcfg from './lists/list-zcfg'
import ListWtjd from './lists/list-wtjd'
import { mapState } from 'vuex'

export default{
  components:{
    ListZcfg,
    ListWtjd,
  },
  data (){
    return {
      activeTabName: ""
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      nopms: state => state.Yzx.nopms,
      allBase: state => state.Yzx.allBase,
    })
  },
  methods: {
    handleClickTag (tab,event) {
      this.activeTabName = tab.name
    }
  },
  created () {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted () {
    //解决刷新下划线消失
    setTimeout(()=>{
      this.activeTabName = "zcfg"
    },500)
  }
}
</script>

<style lang="less" scoped>

</style>