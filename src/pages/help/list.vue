<template>
  <li class="item">
    <router-link :to="{path:'/help/detail/' + id}" tag="a" target="_blank"> 
      <p class="item_name">{{name}}</p>
    </router-link>
    <!-- <div class="introduce" v-html="content"></div> -->
  </li>
    <!-- 搜索结果的部分 -->
</template>
<script>
export default{
  props: ['name', 'content','id'],
  data() {
    return {
    };
  },
} 
</script>
<style lang="less">
@import "~@/assets/less/var.less";
.help_right{
  width: 1010px;
  height: auto;
  margin-top: 38px;
  float: left;
  .right_nav{
    width: 100%;
    height: 32px;
    .help_center{
      margin-left: 35px;
      padding-bottom: 12px;
      display: inline;
      font-size: 16px;
      line-height: 18px;
      border-bottom: 3px solid @PrimaryColor;
      .search_font{
        color:#F77D56;
      }
      .el-breadcrumb__inner{
        font-size: 16px;
      }
    }
  }
  .right_list{
    width: 978px;
    height: auto;
    padding: 18px 0 0 32px;
    border-top:1px solid #ebeef5;
    .item{
      width: 100%;
      height: auto;
       // background-color: aquamarine;
      border-bottom: 1px dashed #ebeef5;
      .item_name{
        height: 35px;
        font-size: 14px;
        line-height: 35px;
        color: @PrimaryColor;
        padding-left: 4px;
        margin: 0;
      }
      .introduce{
        height: auto;
        font-size: 14px;
        padding-left: 4px;
      }
    }
  }
}
</style>

