<template>
  <div id="pdfBox" class="pdf-box">
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <!-- pdf第一页 -->
    <div class="pdf-box-item">
      <!-- header -->
      <div class="header">
        <div class="header-left fl-left"></div>
        <div class="header-right fl-right">
          智能决策 洞见未来
        </div>
      </div>
      <!-- body -->
      <div class="body">
        <div class="title-main">仿制药一致性评价动态报告</div>

        <div class="title-item">
          <div class="title">一致性评价{{ zxdt }}动态</div>
          <div class="time">{{ zxdtTime }}</div>
        </div>
        <ul class="body-list">
          <li v-for="(item,index) in zxdtList" :key="index">
            <span class="num">{{ dataFilter(pjdt,item.code) }}</span>
            <span class="text">{{ item.name }}</span>
          </li>
        </ul>

        <div class="title-item">
          <div class="title">一致性评价总览</div>
          <div class="time" v-if="pjzlTime">{{ pjzlTime }}</div>
        </div>
        <ul class="body-list">
          <li v-for="(item,index) in pjzlList" v-if="index < 4" :key="index">
            <span class="num">{{ dataFilter(pjzl,item.code) }}</span>
            <span class="text">{{ item.name }}</span>
          </li>
        </ul>
        <ul class="body-list">
          <li v-for="(item,index) in pjzlList" v-if="index >= 4" :key="index">
            <span class="num">{{ dataFilter(pjzl,item.code) }}</span>
            <span class="text">{{ item.name }}</span>
          </li>
        </ul>
        <!-- echarts -->
        <div class="echarts-box-zl">

          <div class="echart-box echart-box-qs">
            <div class="echart-title">一致性评价申报/通过趋势</div>
            <div v-show="qs_xdata.length" class="qs-chart" ref="echarts_qs_pdf"></div>
            <div v-if="!qs_xdata.length" class="nodata-box"></div>
          </div>
          <div class="echart-box echart-box-jx">
            <div class="echart-title">申报剂型</div>
            <div v-show="jx_data.length" class="jx-chart" ref="echarts_jx_pdf"></div>
            <div v-if="!jx_data.length" class="nodata-box"></div>
          </div>
        </div>

        <div class="bottom" v-if="!this.phbDataList.length">
          <div class="fl-left">
            <p>更多一致性评价相关动态尽在药智数据企业版</p>
            <p>还可定制化服务，报告咨询热线： 400-678-0778</p>
            <p>vip.yaozh.com</p>
          </div>
          <div class="fl-right">
            <div class="fl-left code-box">
              <img src="~@/assets/imgs/yzx/app_code.png">
              <span>扫码下载APP</span>
            </div>
            <div class="fl-left code-box">
              <img src="~@/assets/imgs/yzx/gzh_code.png">
              <span>扫码关注公众号</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 遍历剩下页 -->
    <div class="pdf-box-item" v-for="(item,index) in phbDataList">
      <!-- header -->
      <div class="header">
        <div class="header-left fl-left"></div>
        <div class="header-right fl-right">
          智能决策 洞见未来
        </div>
      </div>
      <!-- body -->
      <div class="body">
        <div class="title-item">
          <div class="title">{{ item.name }}</div>
          <div class="time" v-if="pjzlTime">{{pjzlTime}}</div>
        </div>
        <div class="echart-box" v-for="(items,indexs) in item.list" :key="indexs">
          <div class="echart-title">{{items.name}}</div>
          <!-- <div class="ph-chart" :id="'echarts_ph_pdf'+items.code"></div> -->
          <div v-if="index < 2" class="echart-phb-body">
            <div v-show="phbDataSb[items.code].length" class="ph-chart" :id="'echarts_ph_pdf'+items.code"></div>
            <div v-if="!phbDataSb[items.code].length" class="nodata-box"></div>
          </div>
          <div v-else class="echart-phb-body">
            <div v-show="phbDataTg[items.code].length" class="ph-chart" :id="'echarts_ph_pdf'+items.code"></div>
            <div v-if="!phbDataTg[items.code].length" class="nodata-box"></div>
          </div>
        </div>
        <div class="bottom" v-if="index === phbDataList.length-1">
          <div class="fl-left">
            <p>更多一致性评价相关动态尽在药智数据企业版</p>
            <p>还可定制化服务，报告咨询热线： 400-678-0778</p>
            <p>vip.yaozh.com</p>
          </div>
          <div class="fl-right">
            <div class="fl-left code-box">
              <img src="~@/assets/imgs/yzx/app_code.png">
              <span>扫码下载APP</span>
            </div>
            <div class="fl-left code-box">
              <img src="~@/assets/imgs/yzx/gzh_code.png">
              <span>扫码关注公众号</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default{
  props:{
    pjdt:{
      type:Object,
    },
    pjzl:{
      type:Object,
    },
    zxdtDay:{
      type:Number,
    },
    pjzlDay:{
      type:Array,
    },
    qs_xdata:{
      type:Array,
    },
    qs_ydata:{
      type:Object,
    },
    jx_data:{
      type:Array,
    },
    pdfXData:{
      type:Array,
    },
    pdfYData:{
      type:Array,
    }
  },
  components: {
    LoadingGif
  },
  data () {
    return {
      isloading:true,
      phbDataSb:{
        view_pz:[],
        view_pzsb:[],
        view_qy:[],
        view_qysb:[],
        view_sf:[],
        view_sfsb:[]
      },
      phbDataTg:{
        view_pz_tg:[],
        view_pzsb_tg:[],
        view_qy_tg:[],
        view_qysb_tg:[],
        view_sf_tg:[],
        view_sfsb_tg:[]
      },
      zxdt:this.zxdtDay === 7 ? "周" : "月",
      pjzlTime:this.pjzlDay[0]&&this.pjzlDay[1] ? this.formatDate(this.pjzlDay[0]) + "至" + this.formatDate(this.pjzlDay[1]) : "",
      zxdtList:[
        {
          code: "num_slh",
          name: "受理号"
        },
        // {
        //   code: "num_me289",
        //   name: "289受理号"
        // },
        {
          code: "num_tg",
          name: "通过批文"
        },
        {
          code: "num_sttg",
          name: "视同通过批文"
        },
      ],
      pjzlList:[
        {
          code: "num_yzxpjslh",
          name: "一致性评价受理号"
        },
        {
          code: "num_ytgslh",
          name: "已通过批文"
        },
        {
          code: "num_xzcflfzyslh",
          name: "新注册分类仿制药受理号"
        },
        {
          code: "num_sttgslh",
          name: "视同通过批文"
        },
        {
          code: "num_yzxsbzs",
          name: "一致性评价申报品种数"
        },
        {
          code: "num_yzxsbqys",
          name: "一致性评价申报企业数"
        },
        // {
        //   code: "num_289slh",
        //   name: "289受理号"
        // },
        // {
        //   code: "num_289pzs",
        //   name: "289品种数"
        // },
      ],
      phbDataList: [{
        name: "一致性评价申报榜",
        list: [
          {
            code: "view_pz",
            name: "品种申报受理号数TOP10"
          },
          {
            code: "view_qy",
            name: "企业申报受理号数TOP10"
          },
          {
            code: "view_sf",
            name: "地区申报受理号数TOP10"
          },
        ]
      },{
        name: "一致性评价申报榜",
        list: [
          {
            code: "view_pzsb",
            name: "品种申报企业数TOP10"
          },
          {
            code: "view_qysb",
            name: "企业申报品种数TOP10"
          },
          {
            code: "view_sfsb",
            name: "地区申报品种数TOP10"
          },
        ]
      },{
        name: "一致性评价通过榜",
        list: [
          {
            code: "view_pz_tg",
            name: "品种通过受理号数TOP10"
          },
          {
            code: "view_qy_tg",
            name: "企业通过受理号数TOP10"
          },
          {
            code: "view_sf_tg",
            name: "地区通过受理号数TOP10"
          },
        ]
      },{
        name: "一致性评价通过榜",
        list: [
          {
            code: "view_pzsb_tg",
            name: "品种通过企业数TOP10"
          },
          {
            code: "view_qysb_tg",
            name: "企业通过品种数TOP10"
          },
          {
            code: "view_sfsb_tg",
            name: "地区通过品种数TOP10"
          },
        ]
      }],
    }
  },
  computed: {
    zxdtTime(){
      if (this.zxdtDay===7) {
        return this.formatDate(this.vueGetDate(-6)) + "至" + this.formatDate(this.vueGetDate(0))
      }else{
        return this.formatDate(this.vueGetDate(-29)) + "至" + this.formatDate(this.vueGetDate(0))
      }
    }
  },
  watch: {

  },
  methods: {
    isPhbEmpty (data) {
      let n = 0
      for(let key in data){
        if (data[key].length === 0) {
          n++
        }
      }
      return n === 6
    },
    getViewsbb () {
      Axios.all([this.getViewsbbSb(),this.getViewsbbTg()])
      .then(Axios.spread((a,b) => {
        this.getData(a,(data) => {
          this.phbDataSb = data
        })
        this.getData(b,(data) => {
          for(let key in data){
            this.phbDataTg[key + "_tg"] = data[key]
          }
        })
        if (this.isPhbEmpty(this.phbDataSb)&&this.isPhbEmpty(this.phbDataTg)) {
          this.phbDataList = []
        }
        if (this.isPhbEmpty(this.phbDataSb)&&!this.isPhbEmpty(this.phbDataTg)){
          this.phbDataList = this.phbDataList.slice(2, 4)
        }
        if (!this.isPhbEmpty(this.phbDataSb)&&this.isPhbEmpty(this.phbDataTg)){
          this.phbDataList = this.phbDataList.slice(0, 2)
        }

        this.phbListFn()
        setTimeout(()=>{
          //this.isloading = false
          this.htmlCovertPdf()
        },500);

      }))
    },
    //统一处理全部返回数据
    getData (res,fn) {
      if (res.data.code === 200 && res.data) {
        let data = res.data.data
        fn(data)
      }
    },
    //获取通过榜数据
    getViewsbbTg () {
      let date = this.pjzlDay.join(":")
      return window.Axios({
        method: "get",
        url: '/api/yzx/viewsbb',
        params: {
          date:date===":"?"":date,
          tp:2,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
    },
    //获取申报榜数据
    getViewsbbSb () {
      let date = this.pjzlDay.join(":")
      return window.Axios({
        method: "get",
        url: '/api/yzx/viewsbb',
        params: {
          date:date===":"?"":date,
          tp:1,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
    },
    //处理时间格式
    formatDate (str){
      let nstr = str.slice(0,4) + "-" + str.slice(4,6) + "-" + str.slice(6,8)
      return nstr
    },
    dataFilter (data,val) {
      return data[val]||0
    },
    //转PDF
		htmlCovertPdf() {
      let element = document.querySelector("#pdfBox");
      html2canvas(element, {
        dpi: window.devicePixelRatio*2,
        scale:2,
        }).then(canvas => {

        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        let pageHeight = contentWidth / 592.28 * 841.89;
        //未生成pdf的html页面高度
        let leftHeight = contentHeight;
        //页面偏移
        let position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28;
        let imgHeight = 592.28/contentWidth * contentHeight;

        let pageData = canvas.toDataURL('image/jpeg');

        let pdf = new jsPDF('', 'pt', 'a4');

        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {    // 分页
            while(leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight;
                position -= 841.89;
                //避免添加空白页
                if(leftHeight > 0) {
                  pdf.addPage();
                }
            }
        }
        pdf.save('仿制药一致性评价动态报告.pdf',{returnPromise:true}).then(()=>{
          setTimeout(()=>{
            this.isloading = false
            this.$emit("update:jspdf", false);
          },500)
        });
      })
    },
    //一致性评价申报/通过趋势echarts
    drawLineQs () {
      let dataZoom_start
      let dom = this.$refs.echarts_qs_pdf
      this.echarts_qs = Echarts.init(dom, 'yaozh_theme')
      this.echarts_qs.setOption({
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisTick: {
            // show: false,
          },
          axisLabel: {
            interval: 0,
            color: '#000',
            rotate: 45
          },
          data: this.qs_xdata.length>15?this.pdfXData:this.qs_xdata,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#000',
          },
        },
        tooltip:{
          show: true,
          trigger: 'axis',
        },
        grid:{
          show: false,
          containLabel: true,
          top: 50,
          left: 0,
          right: 0,
          bottom: 50,
        },
        legend: {
          data:['一致性评价申报数量', '一致性评价通过（含视同通过）数量'],
          bottom: 25,
        },
        series: [
          {
            name: "一致性评价申报数量",
            type: "line",
            connectNulls: true,//断点连接
            data: this.qs_xdata.length>15?this.pdfYData[0]:this.qs_ydata.series_data[0]
          },
          {
            name: "一致性评价通过（含视同通过）数量",
            type: "line",
            connectNulls: true,//断点连接
            data: this.qs_xdata.length>15?this.pdfYData[1]:this.qs_ydata.series_data[1]
          }
        ],
      })
    },
    //申报剂型echarts
    drawPieJx () {
      let dom = this.$refs.echarts_jx_pdf
      this.echarts_jx = Echarts.init(dom, 'yaozh_theme')
      this.echarts_jx.setOption({
        series : [
            {
                type: 'pie',
                radius : '60%',
                center: ['50%', '50%'],
                data: this.jx_data,
                label: {
                  normal: {
                    show: true,
                    position: "outside",
                    formatter: "{b}{d}%",
                    color: "#606266"
                  }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      })
    },
    phbListFn () {
      for (let i = 0; i < this.phbDataList.length; i++) {
        _.forEach(this.phbDataList[i].list,(item,index) => {
          let ydata = []
          let sdata = []
          if(i < 2){
            _.forEach(this.phbDataSb[item.code],(items,indexs) => {
              ydata.push(items.key)
              sdata.push(items.doc_count)
            })
            this.drawBarPh('echarts_ph_pdf'+item.code,item.name,ydata,sdata,index)
          }else{
            let code = item.code.substr(0,item.code.length-3)
            _.forEach(this.phbDataTg[code+"_tg"],(items,indexs) => {
              ydata.push(items.key)
              sdata.push(items.doc_count)
            })
            this.drawBarPh('echarts_ph_pdf'+item.code,item.name,ydata,sdata,index)
          }
        })
      }
    },
    //排行榜echarts
    drawBarPh (id,title,ydata,data,index){
      let dom = document.getElementById(id)
      let echarts = Echarts.init(dom, 'yaozh_theme')
      echarts.setOption({
        grid:{
          show: false,
          left: 300,
          top: 0,
          bottom: 0,
          width: 420,
        },
        xAxis: {
          show: false,
          type: 'value',
          boundaryGap: [0, 0]
        },
        yAxis: {
          boundaryGap: [0, 0],
          type: 'category',
          inverse: true, //排序
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter: (params) => {
              return params.length > 19 ? params.slice(0, 19) + "..." : params
            },
            fontSize: 13,
            lineHeight: 14
          },
          axisTick: {
            show: false
          },
          data: ydata
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#606266',
                }
            },
            barWidth: 16,
            itemStyle: {
              normal: {
                color: (params) => {
                  let colorList = ["#3aa1ff","#89d1eb","#36cbcb"]
                  return colorList[index]
                }
              }
            },
            data: data
          }
        ]
      })
    },
  },
  created () {

  },
  mounted () {
    this.isloading = true
    this.getViewsbb()
    this.drawLineQs()
    this.drawPieJx()
  },
  updated() {

  },
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
.fl-left{
  float: left
}
.fl-right{
  float: right
}
.pdf-box{
  width: 900px;
  margin: auto;
  background: #fff;
  font-size: 20px;
  position: absolute;
  bottom: -4890px;
  left: 50%;
  margin-left: -450px;
}
.pdf-box-bottom{
  bottom: -5670px;
}
.pdf-box-item{
  position: relative;
  height: 1279px;
  background: url("~@/assets/imgs/yzx/pdf_bg.png") no-repeat;
  background-size: 900px;
  background-position-y: bottom;
  top: 0;
  left: 0;
}
.header{
  height: 44px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  &:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: #c9c9c9;
    bottom: 0;
    left: 0;
  }
}
.body{
  position: absolute;
  width: 100%;
  top: 45px;
  left: 0;
}
.header-right{
  color: #555b71;
  margin: 22px 38px 0 0;
}
.header-left{
  width: 190px;
  height: 33px;
  margin-top: 10px;
  background: url("~@/assets/imgs/yzx/pdf_ym.png");
}
.header-right{
  font-size: 13px;
}
.title-main{
  text-align: center;
  font-size: 24px;
  color: @PrimaryColor;
  font-weight: bold;
  margin-top: 20px;
}
.title-item{
  margin: 7px 0;
  .title,.time{
    text-align: center;
  }
  .title{
    font-size: 18px;
  }
  .time{
    font-size: 12px;
  }
}
.body-list{
  display: flex;
  padding: 0 60px;
  margin-bottom: 10px;
  li{
    flex: 1;
    background: #eff2fa;
    margin: 0 5px;
    padding: 10px 0;
    span{
      display: block;
      text-align: center;
    }
    .num{
      font-size: 24px;
      color: @PrimaryColor;
      line-height: 1;
    }
    .text{
      font-size: 13px;
    }
  }
}
.echarts-box-zl{
  margin-top: 20px;
}
.echart-box{
  width: 100%;
}
.qs-chart{
  width: 550px;
  height: 365px;
  margin: auto;
}
.jx-chart{
  width: 500px;
  height: 400px;
  margin: auto;
}
.ph-chart{
  width: 900px;
  height: 330px;
}
.bottom{
  padding: 0 80px;
  height: 90px;
  .fl-right{
    margin-top: -20px;
  }
  p{
    font-size: 16px;
    line-height: 16px;
    margin: 5px 0;
  }
}
.code-box{
  margin-right: 20px;
  span,img{
    display: block;
  }
  img{
    margin: auto;
  }
  span{
    font-size: 13px;
  }
}
.echart-title{
  text-align: center;
  font-size: 13px;
  color: @PrimaryColor;
}
.nodata-box{
  width: 100%;
  height: 100%;
  margin: -10px 0;
  background: url(/static/imgs/nodata.png) center center no-repeat;
}
.echart-box-qs{
  height: 365px;
}
.echart-box-jx{
  height: 380px;
  margin-top: 10px;
}
.echart-phb-body{
  height: 340px;
  width: 900px;
  margin: 1px 0 5px 0;
}
</style>
