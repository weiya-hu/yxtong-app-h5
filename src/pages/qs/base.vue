<template>
  <div class="qs-wrapper">
    <img 
    class="qs-banner"
    src="/static/imgs/wenquandiaocha/bg.png" alt="">
    <div class="qs-main">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
  
.qs-wrapper {
    min-height: 100vh;
    background-color: #eff2fa;
    border: 1px solid transparent;
    box-sizing: border-box;
}
.qs-banner {
  margin: 25px auto 0;
  display: block;
}
.qs-main {
    width: 920px;
    min-height: 800px;
    margin: 0 auto;
    background-color: #fff;
}
@media only screen and (max-width: 768px) {
  .la-app-main {
    min-width: unset !important;
  }
  .qs-wrapper {
    width: 100%;
  }
  .qs-main {
    width: 100%;
    margin: 0;
    min-height: 500px;
  }
  .qs-banner {
    width: 100%;
    margin: 25px auto 0;
    display: block;
  }
}
</style>