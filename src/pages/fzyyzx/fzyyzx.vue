<template>
  <div class="fzyyzx">
    <Main class="yzx" :unshow="$route.name!='database_fzyyzx_pjjd'">
      <!-- 左边部分 -->
      <div slot="left" v-if="$route.name==='database_fzyyzx_pjjd'">
        <!-- 普通/高级搜索 -->
        <Search :vuex_name="vuexName" :api_name="apiName" route1="pjjd" />
        <!-- 热点筛选条件 -->
        <HotFilter :vuex_name="vuexName" route1="pjjd"></HotFilter>
        <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
        <Filters :vuex_name="vuexName" route1="pjjd" :tooltip="tooltip"></Filters>
        <!-- 保存的条件 -->
        <Saved :vuex_name="vuexName" :api_name="apiName"></Saved>
        <!-- 历史搜索 -->
      </div>

      <!-- 右边部分 -->
      <div class="la-right">
        <!-- 顶部 -->
        <main-top :vuex_name="vuexName" :countShow="false" />
        <!-- 列表 -->
        <main-list :vuex_name="vuexName" route1="pjjd" tab :optionShow="$route.name==='database_fzyyzx_pjjd'">
          <template slot="tab">
            <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/yzx/pjdt','abandon-click-method':nopms.pjdt}">
              <span class="nav"><i class="yzx-title-icon pjdt-title-icon"></i>一致性评价动态</span>
            </a>
            <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/yzx/pjjd'}">
              <span class="nav"><i class="yzx-title-icon pzjd-title-icon"></i>一致性评价品种进度</span>
            </a>
            <a @click.prevent="navRouteTo(3)" class="nav_one" :class="{'router-link-active': $route.path == '/yzx/pjzc','abandon-click-method':nopms.pjzc}">
              <span class="nav"><i class="yzx-title-icon zcwd-title-icon"></i>一致性评价政策与问题解答</span>
            </a>
          </template>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </main-list>
      </div>
    </Main>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Main from '@/components/layouts/main'
  import Saved from '@/components/common/saved'
  import Optioned from '@/components/common/options'
  import Filters from '@/components/common/filters-config'
  import HotFilter from '@/components/common/hot-filter'
  import Search from '@/components/common/search'
  import MainTop from '@/components/common/main-top'
  import MainList from '@/components/common/main-list'

  export default{
    components: {
      Main,
      HotFilter,
      Filters,
      Saved,
      Optioned,
      Search,
      MainTop,
      MainList
    },
    data () {
      return {
        vuexName: "Yzx",
        apiName: "Yzx",
        tooltip: {
          dailiangcaigou: '集中采购品种目录中药品名称、规格及其生产企业相同的药品'
        }
      };
    },
    computed:{
      ...mapState({
        nopms: state => state.Yzx.nopms,
        allBase: state => state.Yzx.allBase,
      })
    },
    methods: {
      navRouteTo (index) {
        if (index == 1 && !this.nopms.pjdt) {
          this.$router.push({ path: '/yzx/pjdt'})
        } else if (index == 2 ) {
          this.$router.push({ path: '/yzx/pjjd'})
        } else if(index == 3 && !this.nopms.pjzc) {
					this.$router.push({ path: '/yzx/pjzc'})
				}
      },
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
      Store.dispatch("Yzx/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
    },
  }
</script>

<style lang="less" scoped>
.nav_one{
  width: 100%;
  .nav {
    i {
      font-size: 26px;
      margin-right: 4px;
      font-weight: normal;
    }
  }
  &:hover{
    .pjdt-title-icon{
      background-position: 0 -18px;
    }
    .pzjd-title-icon{
      background-position: -19px -18px;
    }
    .zcwd-title-icon{
      background-position: -38px -18px;
    }
  }
}
.yzx-title-icon{
  background: url("~@/assets/imgs/yzx/title_icon.png");
}
.pjdt-title-icon{
  width: 18px;
  height: 18px;
}
.pzjd-title-icon{
  width: 17px;
  height: 17px;
  background-position: -19px 0px;
}
.zcwd-title-icon{
  width: 19px;
  height: 17px;
  background-position: -38px 0px;
}
.router-link-active{
  .pjdt-title-icon{
    background-position: 0 -18px;
  }
  .pzjd-title-icon{
    background-position: -19px -18px;
  }
  .zcwd-title-icon{
    background-position: -38px -18px;
  }
}
</style>
