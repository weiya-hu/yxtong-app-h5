<template>
  <div class="not-supportIE">
    <div class="no-data-msg">
      <img src="/static/imgs/nodata/db-nodata.png" />
      <div class="msg">
        <p>抱歉，当前页面不支持IE浏览器</p>
        <p>请您使用其他浏览器打开</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.not-supportIE {
  .no-data-msg {
    width: 100%;
    text-align: center;
    padding-top: 324px;
    .msg {
      width: 223px;
      font-size: 16px;
      font-weight: 400;
      color: #97a2bf;
      line-height: 22px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 100%;
    }
  }
}
</style>
