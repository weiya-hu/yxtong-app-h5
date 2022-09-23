<template>
  <div class="market_nav">
      <router-link tag="a" :to="{path:'/instruct'}" class="nav_one" active-class="router-link-active" >
        <span class="nav active">
          <span class="left-icon">CHN</span><span>中国</span>
        </span>
      </router-link>
      <router-link tag="a" :to="{path:'/fdalabel'}" class="nav_one" active-class="router-link-active">
        <span class="nav">
          <span class="left-icon">USA</span><span>美国</span>
        </span>
      </router-link>
      <router-link tag="a" :to="{path:'/jp_shuomingshu'}" class="nav_one" active-class="router-link-active">
        <span class="nav">
          <span class="left-icon">JPN</span><span>日本</span>
        </span>
      </router-link>
      <router-link tag="a" :to="{path:'/unlabeleduse'}" class="nav_one" active-class="router-link-active">
        <span class="nav">
          <span class="left-icon">超</span><span>超说明书</span>
        </span>
      </router-link>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.market_nav{
  overflow: hidden;
  .nav_one{
    width: 25%;
    .nav{
      .left-icon {
        transition: all 300ms;
        display: inline-block;
        border-radius: 50%;
        background-color: #545b6d;
        width: 26px;
        height: 26px;
        margin-right: 8px;
        color: #fff;
        font-size: 8px;
        line-height: 26px;
        text-align: center;
        font-weight: 400!important;
      }
    }
    &:hover{
      .nav {
        .left-icon {
          transition: all 300ms;
          background-color: Lighten(@PrimaryColor, 10%);
        }
      }
    }
  }

}
.router-link-active{
  .nav{
    color: @PrimaryColor;
    background-color: #fff;
    .left-icon {
      background-color: @PrimaryColor!important;
    }
  }
}
</style>
