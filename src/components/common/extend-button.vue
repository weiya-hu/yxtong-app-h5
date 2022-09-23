<template>
  <span class="extend-link-btn" @click.prevent="handleClick(item.href)">
    {{item.label}}<span class="info-num" v-if="item.count">({{item.count}})</span>
  </span>
</template>

<script>
export default {
  props: {
    item: {
      default: {},
      type: Object,
    }
  },
  methods: {
    handleClick(href) {
      // 当href链接里面存在http时为外链直接打开，不存在是为内部路由跳转
      if (href.indexOf('http') === -1) {
        this.vueExtendTo(href)
      } else {
        window.open(href)
      }
    }
  }
}
</script>

<style lang="less">
  @import "~@/assets/less/var.less";

  .extend-link-btn {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    text-decoration: none;
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
    padding: 0 15px;
    font-size: 13px;
    color: @PrimaryColor;
    border: 1px solid @PrimaryColor;
    margin-right: 6px;
    margin-bottom: 10px;
    &:hover {
      background: @PrimaryColor;
      color: #fff;
    }
  }

</style>
