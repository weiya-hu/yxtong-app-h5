<template>
  <div class="market_nav">
      <router-link tag="a" :to="{path:'/qxss'}" class="nav_one" active-class="router-link-active">  
        <span class="nav">
          器械上市
        </span>
      </router-link>
      <router-link tag="a" :to="{path:'/qxba'}" class="nav_one" active-class="router-link-active"> 
        <span class="nav">
          器械备案
        </span>  
      </router-link>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.market_nav{
  .nav_one{
    width: 50%;
    text-decoration: none;
    .nav{
      img {
        transition: all 300ms;
        display: inline-block;
        border-radius: 50%;
        background-color: #35384a;
        width: 26px;
        height: 26px;
        margin-right: 8px;
      }
    }
    &:hover{
      .nav {
        img {
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
    img {
      background-color: @PrimaryColor!important;
    }
  }
}
</style>
