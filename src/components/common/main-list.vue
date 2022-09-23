<template>
  <section class="sec2">
    <div class="la-body-tab" v-if="tab">
      <div class="market_nav">
        <slot name="tab"></slot>
      </div>
    </div>
    <div class="search-body-content">
      <div class="option_wrapper">
        <Optioned
          v-if="optionShow"
          :vuex_name="vuex_name"
          :dbname="api_name"
          :route1="route1"
          :minHeight="minHeight">
        </Optioned>
        <i class="iconfont sh">&#xe60c;</i>
        <!-- &#xe67f; -->
      </div>
      <slot></slot>
    </div>
  </section>
</template>

<script>
  import Optioned from '@/components/common/options'
  export default{
    components: {
      Optioned
    },
    props: {
      vuex_name: {
        type: String,
      },
      api_name: {
        type: String,
      },
      route1: {
        type: String,
      },
      tab: {
        type: Boolean,
      },
      minHeight: {
        type: Boolean,
      },
      optionShow: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {

      }
    },
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.sec2 {
  box-shadow: @BoxShadow;
  width: 100%;
  .la-body-tab {
    box-shadow:0 -4px 5px -3px #c4d3f8;
  }
  .search-body-content {
    width: 100%;
    position: relative;
    .sh {
      position: absolute;
      right: 26px;
      top: 16px;
      cursor: pointer;
      z-index: 7;
      display: none;
    }
  }
}
.market_nav {
  width:100%;
  display: flex;
  justify-content: space-between;
  background-color: #f6f8fc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow: hidden;
}
</style>