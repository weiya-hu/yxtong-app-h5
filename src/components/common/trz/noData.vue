<template>
  <div class="trz-no-data">
    <div class="box">
      <img src="../../../../static/imgs/trz/no_data.png" alt="">
      <span>暂无相关数据</span>
    </div>
  </div>
</template>

<script>

export default {
}
</script>

<style lang="less" scoped>
  .trz-no-data {
    height: 100%;
    background: #fff;
    position: relative;

    .box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      span {
        display: block;
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #B5C3D3;
      }
    }
  }
</style>
