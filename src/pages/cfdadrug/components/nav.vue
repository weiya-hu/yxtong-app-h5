<template>
  <div class="market_nav">
      <router-link tag="a" :to="{path:'/cfdadrug'}" class="nav_one" active-class="router-link-active">  
        <span class="nav">
          <img src="/static/imgs/navicon/cfdadrug.png"><span>中国</span>
        </span>
      </router-link>
      <router-link tag="a" :to="{path:'/epyp'}" class="nav_one" active-class="router-link-active"> 
        <span class="nav">
          <img src="/static/imgs/navicon/epyp.png"><span>欧盟</span>
        </span>  
      </router-link>
      <router-link tag="a" :to="{path:'/fdadrug'}" class="nav_one" active-class="router-link-active">  
        <span class="nav">
          <img src="/static/imgs/navicon/fdadrug.png"><span>美国</span>
        </span>                       
      </router-link>
      <router-link tag="a" :to="{path:'/pmda'}" class="nav_one" active-class="router-link-active">
        <span class="nav">
          <img src="/static/imgs/navicon/pmda.png"><span>日本</span>
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
  overflow: hidden;
  .nav_one{
    width: 25%;
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
