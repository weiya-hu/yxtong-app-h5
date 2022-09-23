<template>
  <div class="kzxx_items">
    <div class="extend-list">
      <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
    </div>
  </div>
</template>

<script>
import ExtendButton from '@/components/common/extend-button'
export default {
  components: {
    ExtendButton,
  },
  props:{
    extendList: Array
  },
  data () {
    return {
    }
  },
  methods: {
  },
  created() {
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.classified-info {
  .kzxx_items {
    box-shadow: @BoxShadowHover;
    background-color: #fff;
    padding: 50px;
  }
}
</style>
