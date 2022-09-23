<template>
  <div >
    <span v-if="itemFather.special_img == '1'">
      <img style="cursor:pointer" title="点击图片放大" @click="handleMaginfyImg" :src="scopeRow ? scopeRow : itemFather.nodata_content" width="auto" :height="itemFather.imgSize+'px'" alt="">
    </span>
    <span v-else>
      <span v-if="itemFather.num_down == '1'" v-html="vueFormulationsFormatter(scopeRow ? scopeRow : itemFather.nodata_content)"></span>
      <span v-else  v-html="scopeRow ? scopeRow : itemFather.nodata_content"></span>
    </span>
    <div class="clearfix"></div>
      <div id="maginfy-img-wap" class="magnify-img dn" title="点击返回">
        <i class="el-icon-close"></i>
        <img id="maginfy-outimg" src="" >
      </div>
  </div>
</template>   

<script>
export default {
  props:['itemFather','scopeRow'],
   methods:{
    //为内容中的图片添加样式并绑定点击事件
    handleMaginfyImg (e) {
     var _that = this
    //  let imgs = $('.detail_content') 
    //  if(imgs.length>0){
       //为内容中的图片绑定点击放大功能
      //  for(let img of imgs){
        console.log($(e))
         let $img = $(e)
          $img.addClass('magnify-img').attr({'title':''})
           $('#maginfy-outimg').attr({'src':_that.scopeRow})
            $('#maginfy-img-wap').removeClass('dn').show("fast");
      //  }
       //使放大的图片具有关闭功能
       this.initMaginfyImg()
    //  }
    },
    //为装放大图片的容器绑定点击关闭功能
    initMaginfyImg () {
      var _that = this
      $('#maginfy-img-wap').on('click', () => {
        $('#maginfy-img-wap').hide("fast");
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #maginfy-img-wap{
      position: fixed;
      left: 0px;
      top: 0px;
      z-index: 1100;
      width: 100vw;
      height: 100vh;
      line-height:  100vh;
      text-align: center;
      background: rgba(102,102,102, .4);
      overflow: auto;
      .el-icon-close{
        position: absolute;
        right:20px;
        top: 10px;
        color: #fff;
        font-size: 40px;
      }
      img{
        vertical-align: middle;
      }
    }
</style>
