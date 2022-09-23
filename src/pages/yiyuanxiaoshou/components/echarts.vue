<template>
<div>
  <template v-if="isloading">
    <LoadingGif :className="'item-loading'" :loadFlag="loading" v-if="loading" :delayTime="0"></LoadingGif>
  </template>
  <div v-show="show" ref="echart" class="echart" :id="id" :style="{width: width + 'px',height: height + 'px'}">
    <div :class="atcsSel&&name==='atc'?'nodata-box-atc':'nodata-box'"></div>
  </div>
  <div v-show="!show" :class="atcsSel&&name==='atc'?'nodata-box-atc':'nodata-box'" :style="{width: width + 'px'}"></div>
</div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
export default{
  props: {
    id: {
      type:String
    },
    option: {
      type: Object,
    },
    width: {
      type: Number,
    },
    height:{
      type: Number,
    },
    isloading:{
      type: Boolean,
    },
    loading:{
      type: Boolean,
      default: true
    },
    atcsSel:{
      type: Boolean,
    },
    conditions:{
      type: Array,
    },
    name:{
      type: String,
    }
  },
  components:{
    LoadingGif,
  },
  data (){
    return {
      echart: {},
      show: true,
      atc: false
    }
  },
  computed: {

  },
  watch:{
    option(option){
      if(option.series[0].data.length>0){
        this.show = true
        this.$nextTick(()=>{
          this.drawEcharts(option)
        })
      }else{
        this.show = false
      }
    },
  },
  methods: {
    drawEcharts(option){
      this.echart = Echarts.init(this.$refs.echart, 'yaozh_theme');
      this.echart.setOption(option, true);
    },
    clear(){
      this.echart.clear()
    }
  },
  mounted () {

  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.echart{
  height: 400px;
}
.nodata-box,.nodata-box-atc {
  width: 100% !important;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 430px;
}
.nodata-box {
  background: #FFF url(/static/imgs/nodata.png) center center no-repeat;
}
.nodata-box-atc {
  background: #FFF url(/static/imgs/nodata_atc.png) center center no-repeat;
}
.item-loading {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  background: rgba(255, 255, 255, .7);
  z-index: 99;
}
</style>