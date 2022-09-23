<template>
<!-- 更新日志 帮助中心都在使用的底部 -->
  <div class="la_footer1 clearfix">
        <div class="content">
          <div class="left">
            <div class="left_top">
              <!-- <a href="" target="_blank">VIP尊享</a> -->
              <a class="item" href="https://about.yaozh.com/about.html?ga_source=vip&ga_position=bottom_help " target="_blank">关于我们</a>
              <a class="item" href="https://vip.yaozh.com/help/list" target="_blank">帮助中心</a>
              <a class="item" href="https://vip.yaozh.com/service" target="_blank">客服中心</a>
              <a class="item" href="https://www.yaozh.com/ued?ga_source=vip&ga_position=bottom_help" target="_blank">用户体验提升计划</a>
            </div>
            <div class="left_bottom">
              <p>地址：重庆市南岸区茶园新区玉马路8号科创园2F（药智网）</p>
              <p>客服热线：<span>400-678-0778</span></p>
              <p>邮箱：service@yaozh.com</p>
              <p>Copyright © 2009-2022 药智网YAOZH.COM All Rights Reserved.</p>
            </div>
          </div>
          <div class="right">
            <img src="~@/assets/imgs/footer_erwei.jpg">
            <p>药智网二维码</p>
          </div>
          <div class="right">
            <img src="~@/assets/imgs/scan_vipty_bottom_1.png">
            <p>药智数据APP</p>
          </div>
        </div>
      </div>
</template>

<style lang="less">
@import "~@/assets/less/var.less";
.la_footer1{
  width: 100%;
  height: 180px;
  background-color: #303236;
  // float: left;
  // position:absolute;
  // bottom:-7px;
  .content{
    width: 1198px;
    height: 148px;
    padding-top: 25px;
    margin:0 auto;
    .left{
      // width: 566px;
      height: 100%;
      color: white;
      float: left;
      .left_top{
        width: 100%;
        height: 14px;
        .item{
          cursor: pointer;
          // width: 78px;
          height: 14px;
          padding: 0px 30px;
          font-size: 14px;
          line-height: 14px;
          border-right: 1px solid white;
          float: left;
          color: #fff;
          &:hover {
            // color: @PrimaryColor;
          }
          &:first-of-type {
            padding: 0px 30px 0px 0px;
          }
          &:last-of-type {
            padding: 0px 0px 0px 30px;
            border-right: none;
          }
        }
      }
      .left_bottom{
        width: auto;
        height: 78px;
        margin-top: 22px;
        p{
          height: 22px;
          margin:0;
          font-size: 14px;
          line-height: 14px;
          margin-bottom:3px;
          span{
            font-size:16px;

          }
        }
      }
    }
    .right{
      width: 94px;
      // height: 106px;
      // background-color: #555B6D;
      float: right;
      margin-top:4px;
      margin-left: 30px;
      // background: url(~@/assets/imgs/footer_erwei.png)
      img{
        width:94px;
      }
      p{
        color:#fff;
        text-align: center;
        font-size:14px;
        margin-top:4px;
      }
    }
  }
}
.clearfix { display:block; }
.clearfix:after {
  content:'';
  display:block;
  height:0;
  clear:both;
  visibility:hidden;
  }
</style>
