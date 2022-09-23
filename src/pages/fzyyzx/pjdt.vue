
<template>
  <div class="yzx-pjdt">
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="part-left">

      <!-- 一致性评价最新动态 -->
      <div class="column">
        <!-- HEAD -->
        <div class="head">
          <span class="title">一致性评价最新动态</span>
          <span class="pdf-btn" @click="getPdf">
            <img width="20px" src="~@/assets/imgs/yzx/pdf_i.png">
            <span>生成报告</span>
          </span>
        </div>
        <!-- VIEW -->
        <div class="view">
					<div class="btn-box">
						<span class="btn" :class="{'active':item.value === zxdtDay}" v-for="(item,index) in zxdtDayList" :key="index" @click="getZxdtData(item.value)">{{ item.name }}</span>
            <el-tooltip class="doubt-i" effect="light" placement="right">
              <div slot="content">可检索最近七天/最近30天内申报或通过的情况</div>
              <i class="el-icon-question cl-green"></i>
            </el-tooltip>
					</div>
					<ul class="view-item-wrap">
						<li class="view-item-box" v-for="(item,index) in zxdtList" :key="index">
							<div class="view-item" @click="ClickZxdt(YzxpjzxdtData,item.code)" :class="{'click-ok':dataFilter(YzxpjzxdtData,item.code) != '0'}">
								<div class="center num">{{ dataFilter(YzxpjzxdtData,item.code) }}</div>
								<div class="center name">{{ item.name }} <span v-if="dataFilter(YzxpjzxdtData,item.code)>0">></span></div>
							</div>
						</li>
					</ul>
        </div>
      </div>
      <!-- 一致性评价总览 -->
      <div class="column">
        <!-- HEAD -->
        <div class="head ">
          <span class="title">一致性评价总览</span>
        </div>
        <!-- VIEW -->
        <div class="view">
          <div class="btn-box">
          	<span>承办/通过时间</span>
						<div class="time-inline">
                <el-date-picker
                  class="date-range-item"
                  type="date"
                  v-model="dateval[0]"
                  placeholder="选择日期"
                  size="mini"
                  format="yyyy-MM-dd"
                  value-format="yyyyMMdd"
                  clearable
                  @change="update()"
                  :picker-options="pickerOptionsStart"
                  ref="popoverStart"
                  >
                </el-date-picker>
                <span>-</span>
                <el-date-picker
                  class="date-range-item"
                  type="date"
                  v-model="dateval[1]"
                  placeholder="选择日期"
                  size="mini"
                  format="yyyy-MM-dd"
                  value-format="yyyyMMdd"
                  clearable
                  @change="update()"
                  :picker-options="pickerOptionsEnd"
                  ref="popoverEnd"
                  >
                </el-date-picker>
                <span class="time-inline-btn" @click="changeDate">搜&nbsp;&nbsp;索</span>
                <el-tooltip class="doubt-i" effect="light" placement="right">
                  <div slot="content">可自定义检索某段时间内申报或通过的情况</div>
                  <i class="el-icon-question cl-green"></i>
                </el-tooltip>
						</div>
          </div>

					<div class="newtotals">
            <div class="iconfont newtotals-btn newtotals-left" @click="handleShowScrollLeft">&#xe64e;</div>
            <div class="iconfont newtotals-btn newtotals-right" @click="handleShowScrollRight">&#xe64f;</div>
            <div class="newtotals-scroll">
              <ul class="view-item-wrap newtotals-scroll-inner">
                <li class="view-item-box total-item" v-if="Object.keys(YzxpjzlData).length > 0" v-for="(item,index) in pjzlList" :key="index">
                  <div class="view-item" @click="ClickZxdt(YzxpjzlData,item.code,'zl')" :class="{'click-ok':dataFilter(YzxpjzlData,item.code) != '0'}">
                    <div class="center num">{{ dataFilter(YzxpjzlData,item.code) }}</div>
                    <div class="center name">{{ item.name }} <span v-if="dataFilter(YzxpjzlData,item.code)>0">></span></div>
                  </div>
                </li>
              </ul>
            </div>
					</div>

					<div class="echarts-box-zl">

						<div class="echart-box echart-box-qs">
              <div class="echart-title">一致性评价申报/通过趋势</div>
						  <div v-show="qs_xdata.length" class="qs-chart" ref="echarts_qs"></div>
              <div v-if="!qs_xdata.length" class="nodata-box"></div>
						</div>

						<div class="echart-box echart-box-jx">
              <div class="echart-title">申报剂型</div>
						  <div v-show="jx_data.length" class="jx-chart" ref="echarts_jx"></div>
              <div v-if="!jx_data.length" class="nodata-box"></div>
						</div>
					</div>

					<div class="view-bottom">
						<div class="title">
							<div class="main phb-title"><img src="~@/assets/imgs/yzx/phb-title.png">一致性评价排行榜</div>
							<div class="phb-list-box">
								<ul>
									<li v-for="(item,index) in phbList" :key="index" :class="{'active':index === phbActive}" @click="changePhb(index)">{{ item }}</li>
								</ul>
							</div>
              <div class="title-ps">（ 注：通过榜含视同通过 ）</div>
						</div>
						<div class="echarts-box-phb">

							<div v-show="!isPhbEmpty" class="echart-box echart-phb" v-for="(item,index) in phbDataList" :key="index">
                <div class="echart-title">{{item.name}}</div>
							  <div v-show="phbData[item.code].length" class="ph-chart" :id="'echarts_ph'+item.code"></div>
                <div v-if="!phbData[item.code].length" class="nodata-box"></div>
							</div>
              <div v-if="isPhbEmpty" class="echart-box-qs">
                <div class="nodata-box"></div>
              </div>

						</div>
					</div>

        </div>
      </div>
    </div>
    <jspdf :jspdf.sync="jspdf" :pjdt="YzxpjzxdtData" :pjzl="YzxpjzlData" :zxdtDay="zxdtDay" :pjzlDay="datevalPdf" :qs_xdata="qs_xdata" :qs_ydata="qs_ydata" :pdfXData="pdfXData" :pdfYData="pdfYData" :jx_data="jx_data" v-if="jspdf"/>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import { mapState } from 'vuex'
import jspdf from './jspdf/jspdf'

export default {
	components: {
    LoadingGif,
	  jspdf
	},
  data () {
    return {
      isloading: true,
      pdfXData:[],
      pdfYData:[[],[]],
			zxdtDay: 7,
			YzxpjzxdtData: {},
			YzxpjzlData: {},
      dateval: ["", ""],
      datevalPdf: ["", ""],
      zlDate:"",
      jspdf:false,
      dtDate:this.vueGetDate(-6) + ":" + this.vueGetDate(0),
			zxdtDayList: [
				{
					name: "最近7天",
					value: 7
				},
				{
					name: "最近30天",
					value: 30
				}
			],
			zxdtList: [
				{
					code: "num_slh",
					name: "受理号"
				},
				// {
				// 	code: "num_me289",
				// 	name: "289受理号"
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
			pjzlList: [
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
				// 	code: "num_289slh",
				// 	name: "289受理号"
				// },
				// {
				// 	code: "num_289pzs",
				// 	name: "289品种数"
				// },
			],
      phbType: "申报",

			//一致性评价申报/通过趋势
			echarts_qs:{},
			qs_xdata:[],
			qs_ydata:{
				series_data:[
					[],
					[]
				]
			},

			//申报剂型
			echarts_jx:{},
			jx_data:[],

			//排行榜
			phbList:["申报榜","通过榜"],
			phbActive:0,
      phbData:{
        view_pz:[],
        view_pzsb:[],
        view_qy:[],
        view_qysb:[],
        view_sf:[],
        view_sfsb:[]
      },
      //日期选择组件
      pickerOptionsStart:{},
      pickerOptionsEnd:{},
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: state => state.Yzx.allBase,
    }),
    //判断排行榜数据是否全为空
    isPhbEmpty(){
      let data = this.phbData
      let n = 0
      for(let key in data){
        if (data[key].length === 0) {
          n++
        }
      }
      return n === 6
    },
    phbDataList(){
      return [
        {
          code: "view_pz",
          name: "品种"+this.phbType+"受理号数TOP10"
        },
        {
          code: "view_pzsb",
          name: "品种"+this.phbType+"企业数TOP10"
        },
        {
          code: "view_qy",
          name: "企业"+this.phbType+"受理号数TOP10"
        },
        {
          code: "view_qysb",
          name: "企业"+this.phbType+"品种数TOP10"
        },
        {
          code: "view_sf",
          name: "地区"+this.phbType+"受理号数TOP10"
        },
        {
          code: "view_sfsb",
          name: "地区"+this.phbType+"品种数TOP10"
        },
      ]
    }
  },
  methods: {
    //日期选择时间问题
    update () {
      //开始时间
      var that=this
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
            disabledDate: (time) => {
              let endTime=that.dateval[1] ? that.dateval[1] :'';
              endTime=endTime.slice(0,4)+'-'+endTime.slice(4,6)+'-'+endTime.slice(6,8);
                // 若时间有误差，可加减一天1000*3600*24
                return that.dateval[1]!=''?time.getTime() >= new Date(endTime).getTime():false;
            }
        })

      //结束时间
         this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
            disabledDate: (time) => {
              let endTime=that.dateval[0] ? that.dateval[0] :'';
              endTime=endTime.slice(0,4)+'-'+endTime.slice(4,6)+'-'+endTime.slice(6,8);
                return  that.dateval[0]!=''?time.getTime() < new Date(endTime).getTime()-(1000*3600*24):false;
            }
        })
    },
    //生成PDF
    getPdf (){
      if(this.isIE()){
        this.$Message.error('该功能只适用非IE内核浏览器，请更换浏览器')
        return false
      }

      // 导出统计功能-数据记录到表内-特殊库详情页或者报告的下载 需求单独加的接口
      window.Axios({
        method: "get",
        url: "/api/yzx/specOutData",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          day: this.zxdtDay,
          date: this.zlDate
        }
      })
      this.jspdf = true
    },
    //最新动态跳转
    ClickZxdt (data,code,type) {
      let num = this.dataFilter(data,code),
      href = '',
      query = {},
      date = type ? this.zlDate : this.dtDate;
      if (num) {
        //受理号
        if (code === 'num_slh') {
          href = '/zhuce/list'
          query = {
            filter_condition: JSON.stringify({yzxpj:["1"]})
          }
          if (date) {
            query.chengbanriqi = date
          }
        }
        // //289受理号
        // if (code === 'num_me289') {
        //   href = '/zhuce/list'
        //   query = {
        //     filter_condition: JSON.stringify({yzxpj:["1"],me289:[1]}),
        //     chengbanriqi: date
        //   }
        // }
        //通过批文
        if (code === 'num_tg') {
          href = '/yzx/pjjd'
          query = {
            hot_condition: JSON.stringify({yzxtype:["通过"]}),
            tabName: 'groupbypiwen'
          }
          if (date) {
            query.enddate = date
          }
        }
        //视同通过批文
        if (code === 'num_sttg') {
          href = '/yzx/pjjd'

          query = {
            hot_condition: JSON.stringify({yzxtype:["视同通过"]}),
            tabName: 'groupbypiwen'
          }
          if (date) {
            query.enddate = date
          }
        }
        //一致性评价受理号
        if (code === 'num_yzxpjslh') {
          href = '/zhuce/list'

          query = {
            filter_condition: JSON.stringify({yzxpj:["1"]}),
          }
          if (date) {
            query.chengbanriqi = date
          }
        }
        //已通过批文
        if (code === 'num_ytgslh') {
          href = '/yzx/pjjd'

          query = {
            hot_condition: JSON.stringify({yzxtype:["通过"]}),
            tabName: 'groupbypiwen'
          }
          if (date) {
            query.enddate = date
          }
        }
        //新注册分类仿制药受理号
        if (code === 'num_xzcflfzyslh') {
          // let _date = ""
          // let dataS = (this.dateval[0] < 20160304) ? "20160304" : this.dateval[0]
          // let dataE = this.dateval[1] || this.vueGetDate(0)
          // _date = dataS + ':' + dataE
          href = '/zhuce/list'

          query = {
            filter_condition: JSON.stringify({yzxpj: ['2']}),
          }
          if (date) {
            query.chengbanriqi = date
          }
        }
        //视同通过批文
        if (code === 'num_sttgslh') {
          href = '/yzx/pjjd'

          query = {
            hot_condition: JSON.stringify({yzxtype:["视同通过"]}),
            tabName: 'groupbypiwen'
          }
          if (date) {
            query.enddate = date
          }
        }
        //一致性评价申报品种数
        if (code === 'num_yzxsbzs') {
          href = '/zhuce/list'

          query = {
            filter_condition: JSON.stringify({yzxpj:["1"]}),
            tabName: 'namegroup'
          }
          if (date) {
            query.chengbanriqi = date
          }
        }
        //一致性评价申报企业数
        if (code === 'num_yzxsbqys') {
          href = '/zhuce/list'

          query = {
            filter_condition: JSON.stringify({yzxpj:["1"]}),
            tabName: 'qiyegroup'
          }
          if (date) {
            query.chengbanriqi = date
          }
        }
        // //289受理号
        // if (code === 'num_289slh') {
        //   href = '/zhuce/list'
        //   query = {
        //     filter_condition: JSON.stringify({yzxpj:["1"],me289:[1]}),
        //     chengbanriqi: date
        //   }
        // }
        // //289品种数
        // if (code === 'num_289pzs') {
        //   href = '/zhuce/list'
        //   query = {
        //     filter_condition: JSON.stringify({yzxpj:["1"],me289:[1]}),
        //     chengbanriqi: date,
        //     tabName: 'namegroup'
        //   }
        // }
        let routeData = this.$router.resolve({ path: href,query: query })
        window.open(routeData.href, '_blank')
      }else{
        return false
      }
    },
    initShowScroll () {
      let outterWidth = Number($(".newtotals").width())
      let num = 8
      let maxNum = parseInt((outterWidth - 60) / 194)
      if (210 * num <= outterWidth) {
        $(".newtotals-left").hide()
        $(".newtotals-right").hide()
      } else {
        $(".newtotals-left").show()
        $(".newtotals-right").show()
        $(".newtotals-scroll").css({
          "width": 194 * maxNum,
          "margin": "auto"
        })
        $(".newtotals-scroll-inner").css({
          "width": 200 * num
        })
        $(".newtotals .total-item").css({
          "width": 180
        })
      }
    },
    handleShowScrollLeft () {
      let pointer = Number(_.replace($(".newtotals-scroll-inner").css("left"), "px", ""))
      if (pointer != 0 && pointer % 194 == 0) {
        $(".newtotals-scroll-inner").animate({
          "left": pointer + 194
        }, 300)
      }
    },
    handleShowScrollRight () {
      let outterWidth = Number($(".newtotals").width())
      let num = Number($(".newtotals .total-item").length)
      let maxNum = parseInt((outterWidth - 60) / 194)
      let pointer = Number(_.replace($(".newtotals-scroll-inner").css("left"), "px", ""))
      if (pointer != 194 * (maxNum - num) && pointer % 194 == 0) {
        $(".newtotals-scroll-inner").animate({
          "left": pointer - 194
        }, 300)
      }
    },

		dataFilter (data,val) {
			return data[val]||0
		},
    //最新动态改变时间
		getZxdtData (val) {
      this.isloading = true
			this.zxdtDay = val
      this.dtDate = this.vueGetDate(-val+1) + ":" + this.vueGetDate(0)
			this.getYzxpjzxdt()
      .then((data) => {
        this.getData(data,(res) => {
          this.getYzxpjzxdtData(res,() => {
            this.isloading = false
          })
        })
      })
		},
    //评价总览改变时间
    changeDate () {
      this.isloading = true;
      this.zlDate = this.dateval[0]||this.dateval[1] ? this.dateval.join(':') : ""
      this.qs_xdata = []
      this.qs_ydata = {series_data:[[],[]]}
      this.jx_data = []
      this.getYzxpjzl()
      this.getViewsbb()
      this.datevalPdf = JSON.parse(JSON.stringify(this.dateval));
      Axios.all([this.getYzxpjzl(),this.getViewsbb()])
      .then(Axios.spread((a,b)=>{
        this.isloading = false
        this.getData(a,(data) => {
          this.getYzxpjzlData(data)
        })
        this.getData(b,(data) => {
          this.phbListFn(data)
        })
      }))
    },
    //切换排行榜
    changePhb (val) {
      this.isloading = true
      this.phbActive = val
      this.phbType = val===0?"申报":"通过"
      this.getViewsbb()
      .then((data) => {
        this.getData(data,(res) => {
          this.getViewsbbData(res,() => {
            this.isloading = false
          })
        })
      })
    },
    //初始化api全部加载
    init () {
      Axios.all([this.getYzxpjzxdt(),this.getYzxpjzl(),this.getViewsbb()])
      .then(Axios.spread((a,b,c)=>{
        this.isloading = false
        this.getData(a,(data) => {
          this.getYzxpjzxdtData(data)
        })

        this.getData(b,(data) => {
          this.getYzxpjzlData(data)
        })

        this.getData(c,(data) => {
          this.phbListFn(data)
        })
      }))
      .catch((err) => {
        console.log(err)
      })
    },

    //统一处理全部返回数据
    getData (res,fn) {
      if (res.data.code === 200 && res.data) {
        let data = res.data.data
        fn(data)
      }
    },
    //处理最新动态数据
    getYzxpjzxdtData (data,fn) {
      this.YzxpjzxdtData = data
      if (fn) {
        fn()
      }
    },
    //处理评价总览数据
    getYzxpjzlData (data,fn) {
      this.YzxpjzlData = data
      if (data.view_qs.sb.length > 0) {
        let sb = data.view_qs.sb
        let _sb = sb.reverse()
        _.forEach(_sb,(item) => {
          this.qs_xdata.push(item.key)
          this.qs_ydata.series_data[0].push(item.doc_count)
        })
      }

      if (data.view_qs.tg.length > 0) {
        let tg = data.view_qs.tg.reverse();
        _.forEach(this.qs_xdata,(item,i)=>{
          tg.find((items) => {
            if (items.key === item){
              this.qs_ydata.series_data[1][i] = items.doc_count
            };
          })
        })
      }

      if (data.view_sbjx.length > 0) {
        _.forEach(data.view_sbjx,(item) => {
          this.jx_data.push({name:item.key,value:item.doc_count})
        })
      }
      this.drawLineQs()

      /*初始化如果超过15条数据，截取最后15条到pdf*/
      if (this.qs_xdata.length > 15) {
        let len = this.qs_xdata.length
        this.pdfXData = JSON.parse(JSON.stringify(this.qs_xdata)).slice(len-15,len);
        this.pdfYData[0] = this.qs_ydata.series_data[0].slice(len-15,len);
        this.pdfYData[1] = this.qs_ydata.series_data[1].slice(len-15,len);
      }
      /*滚动滑块，截取当前数据到pdf*/
      this.echarts_qs.on('dataZoom',(params) => {
        let startValue = this.echarts_qs.getModel().option.dataZoom[0].startValue;
        let endValue = this.echarts_qs.getModel().option.dataZoom[0].endValue;
        this.pdfXData = JSON.parse(JSON.stringify(this.qs_xdata)).slice(startValue,endValue+1);
        this.pdfYData[0] = this.qs_ydata.series_data[0].slice(startValue,endValue+1);
        this.pdfYData[1] = this.qs_ydata.series_data[1].slice(startValue,endValue+1);
      });

      this.drawPieJx()
      if (fn) {
        fn()
      }
    },
    //处理排行榜数据
    getViewsbbData(data,fn) {
      this.phbListFn(data)
      if (fn) {
        fn()
      }
    },
		//最新动态api
		getYzxpjzxdt () {
      //一致性评价最新动态显示为0的日志埋点
      let obj = {
            handlerType: 'refresh',
            handlerTypeDesc: '一致性评价最新动态显示为0',
            api: '/api/yzx/yzxpjzxdt',
            day: this.zxdtDay,
            token: GETCOOKIEFUN("accesstoken")
          }
      this.frontEndLog(this.$route.path, obj)
      return window.Axios({
        method: "get",
        url: '/api/yzx/yzxpjzxdt',
        params: {
          day:this.zxdtDay,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
		},
		//评价总览api
		getYzxpjzl () {
      //一致性评价总览显示为0的日志埋点
      let obj = {
            handlerType: 'refresh',
            handlerTypeDesc: '一致性评价总览显示为0',
            api: '/api/yzx/yzxpjzl',
            date:this.zlDate,
            token: GETCOOKIEFUN("accesstoken")
          }
      this.frontEndLog(this.$route.path, obj)
      return window.Axios({
        method: "get",
        url: '/api/yzx/yzxpjzl',
        params: {
          date:this.zlDate,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
		},
		//排行榜api
		getViewsbb () {
      return window.Axios({
        method: "get",
        url: '/api/yzx/viewsbb',
        params: {
          date:this.zlDate,
          tp:this.phbActive+1,
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      })
		},
		//处理排行榜数据
		phbListFn (data) {
      this.phbData = data;
			_.forEach(this.phbDataList,(item,index) => {
				let ydata = []
				let sdata = []
				_.forEach(data[item.code],(items) => {
					ydata.push({value:items.key})
					sdata.push(items.doc_count)
				})
				this.drawBarPh('echarts_ph'+item.code,item.name,ydata,sdata,index)
			})
		},
		//一致性评价申报/通过趋势echarts
		drawLineQs () {
      let dataZoom_start
      if(this.qs_xdata.length >15 ){
        dataZoom_start = 100 - (15/this.qs_xdata.length)*100;
      }else{
        dataZoom_start = 0;
      }
		  let dom = this.$refs.echarts_qs
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
		      data: this.qs_xdata,
		    },
        dataZoom: [{
          type: 'slider',
          show: this.qs_xdata.length > 15,
          xAxisIndex: [0],
          left: 24,
          bottom: -5,
          start: dataZoom_start,
          end: 100 //初始化滚动条
        }],
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
            data: this.qs_ydata.series_data[0]
          },
          {
            name: "一致性评价通过（含视同通过）数量",
            type: "line",
            connectNulls: true,//断点连接
            data: this.qs_ydata.series_data[1]
          }
        ],
		    fontSize: "14",
		  })
		},
		//申报剂型echarts
		drawPieJx () {
			let dom = this.$refs.echarts_jx
			this.echarts_jx = Echarts.init(dom, 'yaozh_theme')
			this.echarts_jx.setOption({
				series : [
					{
						type: 'pie',
						radius : '65%',
						center: ['50%', '45%'],
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

						}
					}
				]
			})
		},
		//排行榜echarts
		drawBarPh (id,title,ydata,data,index){
			let dom = document.getElementById(id)
			let echarts = Echarts.init(dom, 'yaozh_theme')
      let option = {
        grid:{
          left: 180,
          top: 20,
          bottom: 5,
          width: 500,
        },
        xAxis: {
          show: false,
          type: 'value',
        },
        yAxis: {
          triggerEvent: true,
          type: 'category',
          inverse: true, //排序
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter: (params) => {
              return params.length > 12 ? params.slice(0, 12) + "..." : params
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
            barWidth: 18,
            itemStyle: {
              normal: {
                color: (params) => {
                  let colorList = ["#3aa1ff","#3aa1ff","#89d1eb","#89d1eb","#36cbcb","#36cbcb"]
                  return colorList[index]
                }
              }
            },
            data: data
          }
        ]
      }
			echarts.setOption(option)
      this.extension(echarts,option,index)
    },
    //鼠标悬停坐标轴文字显示全部
    extension(mychart,option,index){
      var id = document.getElementById("extension");
      if(!id) {
        var div = "<div id = 'extension' sytle=\"display:none\"></div>"
        $('html').append(div);
      }
      mychart.off('mouseover')
      mychart.on('mouseover', (params) => {
        //模拟hover
        if (params.componentType == "yAxis") {
          let data = option.yAxis.data
          let list = []
          let code = this.phbDataList[index].code
          if (code==='view_sf'||code==='view_sfsb') {
            return false
          };
          _.forEach(data,(item) => {
            let obj = {value:item.value,textStyle:{color:"#333"}}
            if (item.value===params.value) {
              obj.textStyle.color = "#4877e8"
            };
            list.push(obj)
          })
          option.yAxis.data = list
          mychart.setOption(option)
        };
        if(params.componentType == "yAxis"&&params.value.length > 12) {
          $('#extension').css({
            "position": "absolute",
            "background": "#fff",
            "color": "#606266",
            "border":"solid 1px #606266",
            "font-family": "微软雅黑",
            "font-size": "13px",
            "padding": "5px",
            "display": "inline"
          }).text(params.value);

          $("html").mousemove((event) => {
            var xx = event.pageX - 30;
            var yy = event.pageY + 20;
            $('#extension').css('top', yy).css('left', xx);
          });
        }
      });
      mychart.off('mouseout')
      mychart.on('mouseout', (params) => {
        if(params.componentType == "yAxis") {
          let code = this.phbDataList[index].code
          if (code==='view_sf'||code==='view_sfsb') {
            return false
          };
          $('#extension').css('display', 'none');
          let data = option.yAxis.data
          let list = []
          _.forEach(data,(item) => {
            list.push({value:item.value,textStyle:{color:"#333"}})
          })
          option.yAxis.data = list
          mychart.setOption(option)
        }
      });

      //点击Y轴跳转
      mychart.off('click')
      mychart.on('click', (params) => {
        if(params.componentType == "yAxis") {
          let code = this.phbDataList[index].code
          if (code==='view_sf'||code==='view_sfsb') {
            return false
          };
          let active = _.find(this.phbData[code], {'key':params.value});
          let href={},obj={};
          obj.path = "/yzx/detail"
          obj.query = active.bianma?{name:active.key,bianma:active.bianma}:{name:active.key,qiyebianmatz:active.qiyebianmatz}
          href = this.$router.resolve(obj)
          window.open(href.href, "_blank")
        }
      });
    }
  },
  watch: {
     YzxpjzlData(newVal, oldVal) {
      if (Object.keys(newVal).length > 0) this.initShowScroll()
     }
  },
  created() {
    setTimeout(() => {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted () {
    this.init()
    this.datePopMouseleave(this)
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

// 本页的样式
.yzx-pjdt {
  color: @FontColor;
  // height: 2000px;
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding: 0 0 20px 0;
  // 左
  .part-left {
    width: 100%;
    background: #fff;
   }
}
// 通用的column样式
.column {
  width: 100%;
  padding: 10px;
  .head {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #dfe5f1;
    margin-bottom: 10px;
    &.mb30 {
      margin-bottom: 30px;
    }
    .title {
      display: inline-block;
      margin-left: 26px;
      height: 29px;
      line-height: 29px;
      color: @PrimaryColor;
      font-size: 14px;
      padding: 0px 10px 0px 4px;
      border-bottom: 3px solid @PrimaryColor;
    }
    .more {
      display: inline-block;
      margin-right: 25px;
      color: @PrimaryColor;
      font-size: 13px;
    }
  }
  .view {
    padding-left: 26px;
    padding-right: 28px;
  }
}

.btn-box {
  .doubt-i{
    font-size: 14px;
    vertical-align: middle;
    margin-left: 5px;
  }
	.btn {
		padding: 4px 12px;
		border: 1px solid #b3bbcc;
    border-radius: 14px;
		color: #606266;
		cursor: pointer;
		transition: 0.2s;
    &:first-child{
      margin-right: 15px;
    }
		&:hover {
			color: @PrimaryColor;
			border-color: @PrimaryColor;
		}
	}
	.active {
		color: @PrimaryColor;
		border-color: @PrimaryColor;
	}
}
.time-inline{
	display: inline-block;
  margin-left: 5px;
  .time-inline-btn{
    color: #fff;
    background: @PrimaryColor;
    width: 80px;
    text-align: center;
    line-height: 26px;
    font-size: 14px;
    display: inline-block;
    border-radius: 15px;
    margin-left: 5px;
    cursor: pointer;
    font-weight: bold;
  }
}

.view-item-wrap{
	margin: 10px -7px 0 -7px;
	clear: both;
	overflow: hidden;
	.view-item-box {
		float: left;
		width: 192px;
		padding: 0 7px;
		.active {
			background: @PrimaryColor;
		}
	}
}
.view-item {
	background: @BackgroundColor;
	padding: 16px 0;
	border-radius: 3px;
	transition: 0.2s;
	&:hover {
		background: @PrimaryColor;
		.num,.name {
			color: #fff;
		}
	}
	.center {
		text-align: center;
    font-size: 13px;
	}
	.num {
		font-size: 24px;
		color: @PrimaryColor;
	}
}
.click-ok {
  cursor: pointer;
}

.view-bottom{
	margin-top: 30px;
	.title{
		width: 430px;
		margin: auto;
    .title-ps{
      text-align: center;
      color: #999;
      margin-top: 10px;
    }
	}
	.main{
		width: 240px;
		margin: auto;
		color: @PrimaryColor;
		font-size: 14px;
		text-align: center
	}
}
.phb-list-box{
	border-bottom: 3px solid @PrimaryColor;
	margin-top: 10px;
	ul{
		width: 240px;
		margin: auto;
		clear: both;
		overflow: hidden;
		li{
			float: left;
			width: 120px;
			text-align: center;
			font-size: 14px;
			height: 28px;
			line-height: 28px;
			cursor: pointer;
		}
	}
	.active{
		background: @PrimaryColor;
		color: #fff;
	}
}

.pdf-btn{
  display: block;
  width: 120px;
  height: 30px;
  font-size: 13px;
  background: @PrimaryColor;
  color: #fff;
  text-align: center;
  margin: -4px 20px 0 0;
  border-radius: 3px;
  line-height: 30px;
  cursor: pointer;
  span{
    letter-spacing: 2px;
    text-indent: 3px
  }
  img{
    margin-top: -1px;
  }
  span,img{
    display: inline-block;
    vertical-align: middle;
  }
}
.qs-chart{
	width: 600px;
	height: 420px;
  margin: 0 0 0 130px;
}
.jx-chart{
	width: 550px;
	height: 420px;
  margin: 30px auto 0 auto;
}
.ph-chart{
	width: 700px;
	height: 380px;
  margin: auto;
}
.echart-box{
	float: left;
  width: 50%;
}
.echarts-box-zl{
	margin-top: 56px;
	height: 460px;
}
.echart-box-qs{
  height:420px;
}
.echart-box-jx{
  height: 420px;
}
.echart-title{
  text-align: center;
  font-size: 13px;
  color: @PrimaryColor;
}
.echart-phb{
  margin-top: 30px;
  height: 430px;
}

.phb-title{
  position: relative;
  img{
    position: absolute;
    top: 1px;
    left: 42px;
  }
  &:after{
    content: "";
    position: absolute;
    width: 30px;
    height: 1px;
    background: @PrimaryColor;
    top: 50%;
    left: 0;
  }
  &:before{
    content: "";
    position: absolute;
    width: 30px;
    height: 1px;
    background: @PrimaryColor;
    top: 50%;
    right: 20px;
  }
}
.newtotals{
  height: 109px;
  position: relative;
  overflow: hidden;
}
.newtotals-scroll-inner{
  width: 1800px;
  height: 100%;
  position: absolute;
  left: 0;
}
.newtotals-scroll{
  height: 100%;
  position: relative;
  overflow: hidden;
}

.newtotals-btn{
  position: absolute;
  top: 50%;
  margin-top: -1px;
  cursor: pointer;
}
.newtotals-left{
  left: 1px;
}
.newtotals-right{
  right: 1px;
}
.nodata-box{
  width: 100%;
  height: 100%;
  background: url(/static/imgs/nodata.png) center center no-repeat;
}

@media screen and (max-width: 1480px){
  .echart-box{
    float: none;
    width: 100%;
    .qs-chart{
      margin: auto;
    }
  }
  .echarts-box-phb{
    .echart-box{
      width: 100%;
      .ph-chart{
        margin: auto;
      }
    }
  }
  .echart-box-qs{
    margin-bottom: 50px;
  }
  .echarts-box-zl{
    height:920px;
  }
}

.date-range-item{
  width:128px !important;
}
</style>
