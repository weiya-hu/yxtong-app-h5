<template>
  <div class="help_nav">
        <div class="help_header">
          <router-link class="logo" to="/introduce">
            <img src="~@/assets/imgs/home-logo.png">
          </router-link>
          <nav class="nav_right">
            <router-link tag="a" class="right-nav-item" to="/home" exact>首页</router-link>
            <router-link tag="a" class="right-nav-item" to="/quanxian" exact>权限介绍</router-link>
            <router-link tag="a" class="right-nav-item" to="/help" exact>帮助中心</router-link>
            <router-link tag="a" class="right-nav-item" to="/updatelog" exact>更新日志</router-link>
            <router-link tag="a" class="right-nav-item" to="/about" exact>关于我们</router-link>
            <!-- nav底部滑动交互条 -->
            <div class="slide-z"></div>
          </nav>
        </div>
      </div>
</template>