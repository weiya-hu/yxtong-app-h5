<template>
  <div class="top-wrap" ref="headFixed">
    <section class="sec1 clearfix scroll-head" :class="{'head-Fixed':headFixed}">
      <span class="database-name">{{title||allBase.dbname}}</span>
      <!-- <span class="database-num" v-if="countShow && extendCount">{{extendCount | formatNumber}}</span> -->
      <slot></slot>
      <div class="sec1-right">
        <!-- <div :class="{'top-help-wrap':update_conf.log}">
          <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
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
            <el-breadcrumb-item v-if="detailTitle"><router-link :to="{path: backPath}">{{title}}</router-link></el-breadcrumb-item>
            <el-breadcrumb-item>
              <span v-if="detailTitle||title">{{detailTitle||title}}</span>
              <a v-else :href="'/' + allBase.dbename">{{allBase.dbname}}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
        <div class="top-update-wrap">
          <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
            <div slot="content">
              <el-scrollbar>
                <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
              </el-scrollbar>
              <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
            </div>
            <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
          </el-tooltip>
          {{update_conf.log}}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  export default{
    props: {
      vuex_name: {
        type: String,
      },
      countShow: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
      },
      detailTitle: {
        type: String,
      },
      backPath: {
        type: String,
      }
    },
    data(){
      return{
        headFixed: false,
      }
    },
    filters: {
      // 给数字每三位数加一个逗号
      formatNumber (val) {
        val = parseInt(val)
        return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      }
    },
    computed:{
      helpInfo(){
        return this.isVuex('helpInfo')
      },
      allBase(){
        return this.isVuex('allBase')
      },
      extendCount(){
        return this.isVuex('extendCount')
      },
      update_conf(){
        return this.isVuex('update_conf')
      }
    },
    watch: {
      '$route.path'(){
        this.headFixed = false
      }
    },
    methods: {
      isVuex(key) {
        return this.vuex_name ? Store.state[this.vuex_name][key] : {}
      },
      handleScrolls() {
        let scrollTop = this.$refs.headFixed.getBoundingClientRect().top
        this.headFixed = scrollTop < 1
      }
    },
    mounted (){
      window.addEventListener("scroll", this.handleScrolls, true)
      if (this.$route.path.includes('/nav')) {
        $(".sec1").addClass("flex-align");
      }
    },
    destroyed(){
      window.removeEventListener('scroll',this.handleScrolls)
    },
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.top-wrap{
  height: 40px;
  display: flex;
}
.flex-align {
  display: inline-flex;
  align-items: center;
}
.sec1{
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  text-align: bottom;
  overflow: hidden;
  .database-name{
    height: 18px;
    line-height: 18px;
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #545B6D;
  }
  .database-num{
    font-size: 26px;
    font-weight: 900;
    float: left;
  }
  .sec1-right{
    float: right;
    .help-tip{
      padding-right: 10px;
    }
  }
}
.head-Fixed{
  position: relative;
  width: calc(100% - 81px);
  background: @BackgroundColor;
  z-index: 50;
  box-shadow: @BoxShadowHover;
  right: 0;
  top: 48px;
  animation:headermove .5s;
}
@keyframes headermove
{
  from {
    transform: translate(0, -100%);
  }
  to {
    transform: translate(0, 0);
  }
}
</style>
