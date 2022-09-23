<template>
  <transition name="fade">
    <div @click="()=>show=false" class="dialog-img-wrap" v-if="show" title="点击返回">
      <div class="img-container">
        <i class="el-icon-close"></i>
        <img ref="imgDiv" :src="url" @mousewheel="rollImg" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'imgDialog',
  props: {
    url: {
      type: String,
    }
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
    setTimeout(()=>{
      this.show = true
    },10)
  },
  methods: {
    // 缩放图片
    rollImg() {
      /* 获取当前页面的缩放比 若未设置zoom缩放比，则为默认100%，即1，原图大小 */
      var zoom = parseInt(this.$refs.imgDiv.style.zoom) || 100;
      
      /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动 */
      zoom += event.wheelDelta / 12;

      /* 最小范围 和 最大范围 的图片缩放尺度 */
      if (zoom >= 50 && zoom < 200) {
        this.$refs.imgDiv.style.zoom = zoom + "%";
      }
      return false;
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active,.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter,.fade-leave-to {
  opacity: 0;
}
.dialog-img-wrap {
  position: relative;
  img {
    vertical-align: middle;
  }
  .img-container {
    height: auto;
    overflow: scroll;
    position: fixed;
    width: 100%;
    height: 100%;
    right: 0;
    bottom: 0;
    background: rgba(102,102,102, .4);
    z-index: 2001;
    text-align: center;
    line-height: 100vh;
    cursor: pointer;
  }
  .el-icon-close {
    position: fixed;
    top: 20px;
    right: 20px;
    color: #fff;
    font-size: 40px;
  }
}
</style>
