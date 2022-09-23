<template>
  <div class="slide-lan">
    <div class="header" v-if="title">
      <div class="lc">{{title}}</div>
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    title: {
      type: String,
    },
  }
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";

// middle
.slide-lan {
  width: 100%;
  background-color: #fff;

  .content {
    background: #fff;
    padding: 30px 65px;
    border-bottom: 1px solid #DFE5F1;
    margin-right: 20px;
  }

  .header {
    background-color: #fff;
    box-sizing: border-box;
    height: 24px;
    line-height: 24px;

    .lc {
      position: relative;
      display: inline-block;
      margin-left: 32px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0px 10px 0px 4px;
      font-weight: bold;
    }

    .lc::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 8px;
      width: 4px;
      height: 14px;
      border-radius: 2px;
      background-color: #868EA3;
    }
  }
}

@media screen and (max-width: 1920px) {
  .slide-lan {
    .content {
      // padding-right: 90px;
    }
  }
}

@media screen and (max-width: 1440px) {
  .slide-lan {
    .content {
      // padding-right: 90px;
    }
  }
}
</style>
