<template>
  <Main>
    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通/高级搜索 -->
      <Search :vuex_name="vuexName" :api_name="apiName" />
      <!-- 条件筛选 (route1 列表数据, route2 可视化数据) -->
      <Filters :vuex_name="vuexName" route1="list" />
      <!-- 保存的条件 -->
      <Saved :vuex_name="vuexName" :api_name="apiName" />
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <main-top :vuex_name="vuexName" />
      <!-- 列表 (route1 列表数据, route2 可视化数据) -->
      <main-list :vuex_name="vuexName" route1="list" minHeight >
        <List />
      </main-list>
    </div>
  </Main>
</template>

<script>
  import Saved from '@/components/common/saved'
  import Search from '@/components/common/search'
  import Filters from '@/components/common/filters'
  import MainTop from '@/components/common/main-top'
  import MainList from '@/components/common/main-list'
  import Main from '@/components/layouts/main'
  import List from './list'
  import { mapState } from 'vuex'

  export default{
    components: {
      Saved,
      Filters,
      Main,
      List,
      Search,
      MainTop,
      MainList
    },
    data () {
      return {
        vuexName: "Qxzhuce",
        apiName: "qxzhuce"
      };
    },
    computed:{
      ...mapState({
        allBase: state => state.Qxzhuce.allBase,
      }),
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
      Store.dispatch(this.vuexName+"/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom(this.vuexName)
    },
  }
</script>

<style lang="less" scoped>

</style>