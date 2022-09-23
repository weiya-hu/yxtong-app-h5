<template>
  <Main class="clinical">
    <!-- 左边部分 -->
    <div slot="left">
      <CateNav />
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{ allBase.dbname }}</span>
        <div class="sec1-right">
          <!-- <div :class="{'top-help-wrap':update_conf.log}">
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''"  >
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
            </el-breadcrumb>
          </div> -->
          <div class="top-update-wrap">
            <el-tooltip class="help-tip" effect="light" placement="bottom"
              v-if="helpInfo.remark ? helpInfo.remark : ''">
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            {{ update_conf.log }}
          </div>
        </div>
      </section>
      <section class="sec2 newsec2">
        <div class="la-body-tab">
          <div class="market_nav">
            <a @click.prevent="navRouteTo(1)" class="nav_one"
              :class="{ 'router-link-active': $route.path == '/clinical/list' }">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe62d;</i>全球临床试验</span>
            </a>
            <a @click.prevent="navRouteTo(2)" class="nav_one"
              :class="{ 'router-link-active': $route.path == '/clinical/cate' }">
              <span class="nav"><i class="iconfont pr5"
                  style="font-size:20px;">&#xe643;</i>分类浏览（ClinicalTrials.gov）</span>
            </a>
          </div>
        </div>
        <router-view></router-view>
      </section>
    </div>
  </Main>
</template>

<script>
import { mapState } from 'vuex'
import Main from '@/components/layouts/main'
import CateNav from './components/cate-nav'

export default {
  components: {
    Main,
    CateNav
  },
  data() {
    return {
      route: this.$route.path.split('/')[2]
    };
  },
  computed: {
    ...mapState({
      allBase: state => state.Clinical.allBase,
      helpInfo: state => state.Clinical.helpInfo,
      update_conf: state => state.Clinical.update_conf,
    })
  },
  watch: {
    $route() {
      this.route = this.$route.path.split('/')[2]
    },

  },
  methods: {
    navRouteTo(index) {
      if (index == 1) {
        window.ga("send", "event", "tab", "click", "clinical_list");
        window._paq.push(['trackEvent', 'tab', 'click', 'clinical_list'])

        this.$router.push({ path: '/clinical/list' })
      }
    },
  },
  created() {

    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted() {
    Store.dispatch("Clinical/getBaseInfo").then(() => {
      this.vueTogglePmsTooltip()
    })

    // Store.dispatch('Clinical/getCate', 'locations')
    Store.dispatch('Clinical/getSydqData', { action: 'locations1_guifan' })
    Store.commit('Clinical/changeBox', 'lbqu')
    // Store.dispatch("Clinical/getCatestand")
  },
}
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";


.la-right {
  .sec1 {
    height: 60px;
    line-height: 60px;
    padding-left: 30px;
    text-align: bottom;

    .database-name {
      color: @PrimaryColor;
      font-size: 28px;
    }

    .database-num {
      font-size: 26px;
      font-weight: 900;
    }

    .sec1-right {
      float: right;

      .help-tip {
        padding-right: 10px;
      }
    }
  }

  .sec2 {

    .market_nav {
      .nav_one {
        width: 50%;

        .nav {
          i {
            font-size: 26px;
            margin-right: 4px;
            font-weight: normal;
          }
        }
      }
    }

    .la-body-tab {
      box-shadow: 0 -4px 5px -3px #c4d3f8;
    }
  }
}

// el-dialog遮罩层样式（背景色）
.v-modal {
  background: rgba(102, 102, 102, .4);
}
</style>
