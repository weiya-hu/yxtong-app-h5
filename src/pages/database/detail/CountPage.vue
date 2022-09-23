<template>
<!-- 展示图片 -->
  <div>
    <!-- {{itemFather}} -->
    <span v-if="itemFather.special_img == '1'">
      <!-- {{itemFather}} -->
      <img  style="cursor:pointer" title="点击图片放大" @click="handleMaginfyImg" :src="value" width="auto" :height="itemFather.imgSize+'px'" alt="">
    </span> 
   
      <span class="value" v-else  v-html="value"></span>    
    
  </div>
</template>   

<script>
export default {
  props:['itemFather','value'], 
  methods:{
    //为内容中的图片添加样式并绑定点击事件
    handleMaginfyImg (e) {
     var _that = this;    
    //  let imgs = $('.detail_content') 
    //  if(imgs.length>0){
       //为内容中的图片绑定点击放大功能
      //  for(let img of imgs){
        // console.log($(e))
         let $img = $(e)
          $img.addClass('magnify-img').attr({'title':''})
           $('#maginfy-outimg').attr({'src':_that.value})
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

<style scoped>
.value >>> table { 
  width: 100%;
}
.value >>> table tr td {
      box-sizing: border-box;
      padding: 5px 50px;
      height: 34px;
      line-height: 26px;
      border: 1px solid #d7ddeb;
      font-size:13px;
}
.value >>> table tr td:first-child {       
    width: 184px;
    /* white-space: nowrap; */
    background: #f6f8fc;
    font-weight:bold;
  }
  .value >>> table tr td:nth-child(2) {
    background: #fdfdfd;
  }
    

  

  
</style>
