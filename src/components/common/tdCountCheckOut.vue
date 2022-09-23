<template>
  <div v-if="!loading">
    <!-- {{itemFather}} -->
    <span v-if="itemFather.special_img == '1'" class="img-wrap">
      <!-- {{itemFather}} -->
      <template v-if="isCas">
        <img :title="getKeys(item)+'，点击图片放大'" style="cursor:pointer" @click="handleMaginfyCASImg(item[getKeys(item)],index)" :src="item[getKeys(item)]" v-for="(item,index) in onlyImg" :height="itemFather.imgSize+'px'" :key="index" @error="picLoadError($event,index)" />
      </template>
      <img v-else style="cursor:pointer" title="点击图片放大" @click="handleMaginfyImg" :src="onlyImg" width="auto" :height="itemFather.imgSize+'px'" @error="picLoadError">
    </span>
    <span v-else-if="itemFather.num_down == '1'">
      <span  v-html="overflowEclips(vueFormulationsFormatter(scopeRow ? scopeRow : itemFather.nodata_content),itemFather.fieldmax )"></span>
    </span>
    <span v-else>
     <slot></slot>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  props:['itemFather', 'scopeRow','scopeRowAll','kaifaType','loading'],
  data() {
    return {
      errorImgList:[],
      errorImg:false,
      imgSrcNeed:this.scopeRowAll[this.itemFather.parameter] ? this.scopeRowAll[this.itemFather.parameter] : this.itemFather.nodata_content||'undefined',
    }
  },
  computed: {
    ...mapState({
      structuralsType: state => state.Database.structuralsType,
    }),
    imgSrckaifaType(){
      return this.scopeRowAll[this.itemFather.callbackfield] ? this.scopeRowAll[this.itemFather.callbackfield] : this.itemFather.nodata_content||'undefined'
    },
    imgSrcHxs(){
      let base = this.scopeRowAll[this.itemFather.field].toString()
      let src = ''
      if (this.structuralsType) {
        src = base
      }else{
        src = this.itemFather.uri + base
      }
      return src||'undefined'
    },
    onlyImg(){
      return this.kaifaType=='单独开发'?this.imgSrckaifaType:(this.$route.path==='/structural'||this.$route.path==='/structural/')?this.imgSrcHxs:this.imgSrcNeed
    },
    //判断是否是结构式图片
    //截止2020.1.9，若图片为数组时必定是结构式图片,暂只需判断数据类型
    isCas(){
      let isArray = this.onlyImg instanceof Array
      return isArray && this.onlyImg.length>0
    }
  },
  methods:{
    getKeys(item) {
      return Object.keys(item)
    },
    //为内容中的图片添加样式并绑定点击事件
    handleMaginfyImg (e) {
      //破图不可点击放大
      if (this.errorImg) {
        return
      };
      var _that = this;
      let scopeRowAll = this.scopeRowAll;
      let itemFather = this.itemFather;
      let $img = $(e)
      $img.addClass('magnify-img').attr({'title':''})
      if(this.kaifaType=='单独开发'){
        $('#maginfy-outimg').attr({'src':this.imgSrckaifaType})
      }else if(this.$route.path==='/structural'||this.$route.path==='/structural/'){
        $('#maginfy-outimg').attr({'src':this.imgSrcHxs})
      }else{
        $('#maginfy-outimg').attr({'src':this.imgSrcNeed})
      }
      $('#maginfy-img-wap').removeClass('dn').show("fast");
      this.initMaginfyImg()
    },
    //结构式放大图片
    handleMaginfyCASImg (url,i) {
      //破图不可点击放大
      if (this.errorImgList.indexOf(i)>-1) {
        return
      };
      $('#maginfy-outimg').attr({'src':url})
      $('#maginfy-img-wap').removeClass('dn').show("fast");
      this.initMaginfyImg()
    },
    //为装放大图片的容器绑定点击关闭功能
    initMaginfyImg () {
      var _that = this
      $('#maginfy-img-wap').on('click', () => {
        $('#maginfy-img-wap').hide("fast");
      })
    },
    picLoadError (ev,i) { // 图片加载失败，切换为默认图
      let style = ev.target.style
      style.height = 'auto'
      style.marginTop = '10px'
      style.cursor = 'unset'
      ev.target.title = '暂无图片'
      ev.target.src = "/static/imgs/general/no-drug-img.jpg"
      if (i) {
        this.errorImgList.push(i)
      }else{
        this.errorImg = true
      };
    },
  }
}
</script>

<style lang="less" scoped>
.img-wrap {
  display: block;
  img {
    margin-right: 15px;
  }
}
</style>
