<template>
  <div id="nbsj">
  	<!-- 年份选择 -->
    <div class="main-switch tc">
    	<span class="main-title fs18 vm">年报数据</span>
    	<el-select v-model="year" type="mini" @change="handleYearChange">
				<el-option
					v-for="(item, index) in years"
					:key="index"
					:value="item">
				</el-option>
			</el-select>
    </div>
    <!-- 营收情况 -->
    <div class="ysqk">
    	<div class="title fs14">
	    	<div class="content clearfix">
	    		<div class="vm fl">营收情况</div>
					<el-select v-model="tp" class="fl" style="margin-top: 1px;" placeholder="请选择" type="mini" @change="handleTpChange">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
	    	</div>
	    </div>
	    <!-- 可视化数据 -->
	    <div class="see-data tc">
				<div class="item ib" id="echarts_yxfx"></div>
				<div class="right-two">
					<div class="check-box">
						<div class="item active" @click="handleCheckItemClick">营业收入</div>
						<div class="item" @click="handleCheckItemClick">营业成本</div>
					</div>
					<div class="item ib ec_active" id="echarts_yysr"></div>
					<div class="item ib" id="echarts_yycb"></div>
				</div>
	    </div>
	    <!-- 表格 -->
	    <div class="item_content1">
				<!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <el-table
					:data="ysqkListRes.res"
					stripe
					fixed
					class="table"
					style="width: 100%"
					v-else>
          <el-table-column
						v-for="item in tableHead"
						:prop="item.prop"
						:min-width="item.width"
						:key="item.prop"
						:label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'zhuce.shoulihao'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'zhuce.name'">
                {{ scope.row.yyshouru }}
              </div>
              <div v-if="item.prop === 'zhuce.shenqingleixing_1'">
                {{ scope.row.srpercent }}
              </div>
              <div v-if="item.prop === 'zhuce.guifanjixing'">
                {{ scope.row.yychengben}}
              </div>
              <div v-if="item.prop === 'zhuce.yaopingleixing_1+zhuce.zhuceleixing'">
                {{ scope.row.cbpercent }}
              </div>
              <div v-if="item.prop === 'zhuce.chengbanriqi'">
                {{ scope.row.yylirun}}
              </div>
              <div v-if="item.prop === 'zhuce.banlizhuangta'">
                {{ scope.row.maolilv }}
              </div>
              <div v-if="item.prop === 'zhuce.zhuangtaikaishishijian'">
                {{ scope.row.mlvpercent }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
				<el-pagination
				  v-if="ysqkListRes.count > 10"
          @current-change="handleCurrentChange"
          :current-page="yinshouParam.page"
          :page-size="yinshouParam.pageSize"
          layout="total, prev, pager, next"
          :total="ysqkListRes.count">
        </el-pagination>
      </div>
    </div>
    <!-- 研发情况 -->
    <div class="yfqk" v-show="yfqkListRes.count">
    	<div class="title fs14">
	    	<div class="content">
	    		<span class="vm">研发情况</span>
	    	</div>
	  	</div>
	    <!-- 表格 -->
	   	<div class="item_content1">
				 <!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading2" v-if="loading2" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <el-table
					:data="yfqkListRes.res"
					stripe
					fixed
					class="table"
					style="width: 100%"
					v-else>
          <el-table-column
						v-for="item in yfqkHead"
						:prop="item.prop"
						:min-width="item.width"
						:key="item.prop"
						:label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'zhuce.shoulihao'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'zhuce.name'">
                {{ scope.row.zhuce }}
              </div>
              <div v-if="item.prop === 'zhuce.shenqingleixing_1'">
                {{ scope.row.gongneng }}
              </div>
              <div v-if="item.prop === 'zhuce.guifanjixing'">
                {{ scope.row.jieduan}}
              </div>
              <div v-if="item.prop === 'zhuce.yaopingleixing_1+zhuce.zhuceleixing'">
                {{ scope.row.jinzhan }}
              </div>
              <div v-if="item.prop === 'zhuce.chengbanriqi'">
                {{ scope.row.yanfatouru}}
              </div>
              <div v-if="item.prop === 'zhuce.banlizhuangta'">
                {{ scope.row.jepercent }}
              </div>
              <div v-if="item.prop === 'zhuce.zhuangtaikaishishijian'">
                {{ scope.row.ljyanfatouru }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
				<el-pagination
				  v-if="yfqkListRes.count > 10"
          @current-change="handleCurrentChange1"
          :current-page="yanfaParam.page"
          :page-size="yanfaParam.pageSize"
          layout="total, prev, pager, next"
          :total="yfqkListRes.count">
        </el-pagination>
      </div>
    </div>
		<!-- 产销量 -->
    <div class="cxl" v-show="cxlListRes.count">
    	<div class="title fs14">
	    	<div class="content">
	    		<span class="vm">产销量</span>
                    <!-- 暂时隐藏导出 -->
					<!-- <a class="fr">
                                        <i class="iconfont">&#xe605;</i>
                                        导出 -->
	    		</a>
	    	</div>
	    </div>
	    <!-- 表格 -->
			<div class="item_content1">
				<!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading3" v-if="loading3" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
        <el-table
					:data="cxlListRes.res"
					stripe
					fixed
					class="table"
					style="width: 100%"
					v-else>
          <el-table-column
						v-for="item in cxlHead"
						:prop="item.prop"
						:min-width="item.width"
						:key="item.prop"
						:label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'zhuce.shoulihao'">
                {{ scope.row.name }}
              </div>
              <div v-if="item.prop === 'zhuce.name'">
                {{ scope.row.unit }}
              </div>
              <div v-if="item.prop === 'zhuce.shenqingleixing_1'">
                {{ scope.row.sales }}
              </div>
              <div v-if="item.prop === 'zhuce.guifanjixing'">
                {{ scope.row.production}}
              </div>
              <div v-if="item.prop === 'zhuce.yaopingleixing_1+zhuce.zhuceleixing'">
                {{ scope.row.inventory }}
              </div>
              <div v-if="item.prop === 'zhuce.chengbanriqi'">
                {{ scope.row.salespct}}
              </div>
              <div v-if="item.prop === 'zhuce.banlizhuangta'">
                {{ scope.row.productionpct }}
              </div>
              <div v-if="item.prop === 'zhuce.zhuangtaikaishishijian'">
                {{ scope.row.inventorypct }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
				<el-pagination
				  v-if="cxlListRes.count > 10"
          @current-change="handleCurrentChange2"
          :current-page="cxlParam.page"
          :page-size="cxlParam.pageSize"
          layout="total, prev, pager, next"
          :total="cxlListRes.count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import LoadingGif from '@/components/common/globalCom/loading-gif'
	import tablehead from '@/config/tablehead'
	const tableFiled = tablehead.companyreport.DetailNbsj
	const DetailYfqk = tablehead.companyreport.DetailYfqk
	const DetailCxl = tablehead.companyreport.DetailCxl

	export default {
    components: {
      LoadingGif
    },
		props:{
        res:{
            type:Object,
        },
        item:{
          type:Object
				},
    },
		data () {
			return {
				bm: Store.state.CompanyReport.bm,
				years: [],
				year: 0,
				tp:	1,
				//营收情况的头部
				tableHead: tableFiled,
				//研发情况的头部
				yfqkHead: DetailYfqk,
				//产销量的头部
				cxlHead: DetailCxl,
				//可视化数据接口
				kshData:{}, // 可视化原始数据
				// 右：占比饼图（2个）处理后数据
				zbData: {
					yysr: [], // 营业收入 - 饼图处理后数据
					yycb: [], // 营业成本 - 饼图处理后数据
				},
				// 左：混合图-处理后数据
				yxfx_xdata:[],//营销名字
				yxfx_ydata3:[],//毛利率
				yxfx_ydata2:[],//营销成本
				yxfx_ydata1:[],//营销收入
				// 营收情况
				ysqkListRes: {},
				yinshouParam: {
          pageSize: 10,
          page: 1,
        },
				// 研发情况
				yfqkListRes:{},
				yanfaParam: {
					pageSize: 10,
          page: 1,
				},
				// 产销量
				cxlListRes:{},
				cxlParam:{
					pageSize: 10,
          page: 1,
				},
				// 分类：行业、产品、地区...
				options: [
					{
						value: 1,
						label: '分行业'
					},
					{
          	value: 2,
          	label: '分产品'
					},
					{
          	value: 3,
          	label: '分地区'
        	}
				],
				value: '',
				loading1: true,
				loading2: true,
				loading3: true,
			}
		},
		created () {

		},
		mounted () {
			this.getYears()
		},
		watch: {
			// 监视：分行业、分产品、分地区变化
			// tp () {
			// 	this.handleTpChange()
			// },
			// year () {
			// 	this.handleYearChange()
			// },
			ysqkListRes () { // 避免使用v-show影响echarts的渲染样式（主要是长宽），更不能去使用v-if
				if (!this.ysqkListRes.count) {
					$('.ysqk').hide()
				} else {
					$('.ysqk').show()
				}
			},
		},
		methods: {
			// 最优先获取年份
			async getYears() {
				await window.Axios({
					method: 'get',
					url: '/api/company/nbsjYear',
					params: {
						bm: this.bm,
					}
				}).then(res=>{
					if (res.data.code === 200 && res.data) {
						let data = res.data.data
						this.years = data.List
            // 默认为最新年份
						let yearsLen = 0
						this.year = this.years[yearsLen]
					}
				}).catch((err) => {
					console.log(err)
				})

				this.loadEchartsData()
				this.loadListOneData()
				this.loadListTwoData()
				this.loadListThreeData()
			},
			//1.先获取数据  再进行数据处理
      async loadEchartsData () {
				await window.Axios({
					method: 'get',
					url: '/api/company/nbsjysqk',
					params: {
						bm: this.bm,
						year: this.year,
						tp: this.tp,
					},
				}).then(res=>{
					if (res.data.code === 200 && res.data) {
						let data = res.data.data
						//把获取到的数，精确到小数点后三位
						this.kshData = data.GroupList // 可视化原始数据
					}
				}).catch((err) => {
					console.log(err)
				})

				this.handleEchartsDraw()
			},
			handleKshData () {
				this.handleLeftData()
				this.handleRightData()
			},
			// 左：可视化处理
			handleLeftData () {
        for (let value of this.kshData) {
					this.yxfx_xdata.push(value.name)
					this.yxfx_ydata1.push(value.yyshouru)
					this.yxfx_ydata2.push(value.yychengben)
					this.yxfx_ydata3.push(value.maolilv)
     	  }
      },
			// 右：可视化数据处理
      handleRightData () {
				let data = this.kshData
				for (let item of data) {
					let obj1 = {
						value: item.yyshouru,
						name: item.name
					}
					let obj2 = {
						value: item.yychengben,
						name: item.name
					}
					this.zbData.yysr.push(obj1)
					this.zbData.yycb.push(obj2)
				}
			},
			//2.对获取到的数据进行处理的操作，再进行图形的绘制
			async handleEchartsDraw () {
				await this.handleKshData()
				this.drawLeftMix()
				let text = $('.right-two .check-box .item.active').text()
				if (text.indexOf('营业收入') !== -1) {
          this.drawRightOnePie()
        } else if (text.indexOf('营业成本') !== -1) {
          this.drawRightTwoPie()
        }
      },
			// 营销分析 - 混合图
			drawLeftMix () {
				let dom = document.getElementById("echarts_yxfx")
				this.myChart = Echarts.init(dom, 'yaozh_theme')
				this.myChart.setOption({
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow',
						}
					},
					grid: {
						containLabel: true,
						// x: 100, //默认是80px
						// y: 60, //默认是60px
						// x2: 40, //默认80px
						// y2: 45 //默认60px
					},
					title:{
						text:"营销分析",
						x:'center',
						top:'0px',
						textStyle:{
							fontSize:'16',
							color:'#646A7A'
						}
					},
					legend: {
						data:['营业收入','营业成本','毛利率'],
						bottom:'0px',
					},
					xAxis: [
						{
							type: 'category',
							data: this.yxfx_xdata,
							axisPointer: {
								type: 'shadow'
							},
							splitLine: {
								show: false, // 去除网格线
							},
						}
					],
					yAxis: [
						{
							type: 'value',
							name: '营业情况',
							axisLabel: {
								formatter: (value) => {
									return (value / 1000) + 'k'
								},
							},
							splitLine: {show: false}, // 去除网格线
						},
						{
							type: 'value',
							name: '毛利率（%）',
							// min: 0,
							// max: 25,
							// interval: 5,
							axisLabel: {
								formatter: '{value}'
							},
							splitLine:{show: false},//去除网格线
						}
					],
					series: [
						{
							name:'营业收入',
							type:'bar',
							data:this.yxfx_ydata1,
						},
						{
							name:'营业成本',
							type:'bar',
							data:this.yxfx_ydata2
						},
						{
							name:'毛利率',
							type:'line',
							yAxisIndex: 1,
							data:this.yxfx_ydata3
						}
					]
				})
			},
			// 营业收入 - 饼状图
			drawRightOnePie () {
				let dom = document.getElementById("echarts_yysr")
				this.myChart = Echarts.init(dom, 'yaozh_theme')
				this.myChart.setOption({
					title:{
						text:'主营业收入占比',
						x:'center',
						top:'0px',
						textStyle:{
							fontSize:'16',
							color:'#646A7A'
						}
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					series : [
						{
							name:'主营业收入占比',
							type: 'pie',
							radius : '55%',
							center: ['50%', '60%'],
							label: {
								normal: {
									show: true,
									position: "outside",
									formatter: "{b}{d}%"
								}
							},
							data:this.zbData.yysr,
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
			// 营业成本 - 饼状图
			drawRightTwoPie () {
				let dom = document.getElementById("echarts_yycb")
				this.myChart = Echarts.init(dom, 'yaozh_theme')
				this.myChart.setOption({
					title:{
						text:'主营业成本占比',
						x:'center',
						top:'0px',
						textStyle:{
							fontSize:'16',
							color:'#646A7A'
						}
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					series : [
						{
							name:'主营业成本占比',
							type: 'pie',
							radius : '55%',
							center: ['50%', '60%'],
							label: {
								normal: {
									show: true,
									position: "outside",
									formatter: "{b}{d}%"
								}
							},
							data:this.zbData.yycb,
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
			//获取营收情况的表格数据
      loadListOneData () {
				window.Axios({
					method: 'get',
					url: '/api/company/nbsjysqk',
					params: _.assign({
						bm: this.bm,
						year: this.year,
						tp: this.tp,
					}, this.yinshouParam)
				}).then(res=>{
					this.loading1 = false
					this.ysqkListRes = res.data.data.List
				})
			},
			//获取研发情况的表格数据
			loadListTwoData () {
				window.Axios({
					method: 'get',
					url: '/api/company/nbsjyfqk',
					params: _.assign({
						bm: this.bm,
						year: this.year
					}, this.yanfaParam)
				}).then(res=>{
					this.loading2 = false
					this.yfqkListRes = res.data.data
				})
			},
			//获取产销量的表格数据
			loadListThreeData () {
				window.Axios({
					method: 'get',
					url: '/api/company/nbsjcxl',
					params: _.assign({
						bm: this.bm,
						year: this.year
					}, this.cxlParam)
				}).then(res=>{
					this.loading3 = false
					this.cxlListRes = res.data.data
				})
			},
			// checkbox 点击事件
      handleCheckItemClick (event) {
        let dom = event.target
        let text = dom.innerText
        if (text.indexOf('营业收入') !== -1) {
          $('.right-two .check-box .item').removeClass('active')
          $('.right-two .check-box .item').eq(0).addClass('active')
          $('.right-two>.item').removeClass('ec_active')
          $('.right-two>.item').eq(0).addClass('ec_active')
          this.drawRightOnePie()
        } else if (text.indexOf('营业成本') !== -1) {
          $('.right-two .check-box .item').removeClass('active')
          $('.right-two .check-box .item').eq(1).addClass('active')
          $('.right-two>.item').removeClass('ec_active')
          $('.right-two>.item').eq(1).addClass('ec_active')
          this.drawRightTwoPie()
        }
			},
			// 监视tp改变进行的操作
			handleTpChange() {
				/* 重置 start */
				//可视化数据接口
				this.kshData = {} // 可视化原始数据
				// 右：占比饼图（2个）处理后数据
				this.zbData = {
					yysr: [], // 营业收入 - 饼图处理后数据
					yycb: [] // 营业成本 - 饼图处理后数据
				}
				// 左：混合图-处理后数据
				this.yxfx_xdata = []//营销名字
				this.yxfx_ydata3 = []//毛利率
				this.yxfx_ydata2 = []//营销成本
				this.yxfx_ydata1 = []//营销收入
				// 营收情况
				this.ysqkListRes = {}
				this.yinshouParam = {
          pageSize: 20,
          page: 1,
				},
				/* 重置 end */
				this.loadEchartsData()
				this.loading1 = true
				this.loadListOneData()
			},
			// 监视year改变进行的操作
			handleYearChange() {
				/* 重置 start */
				// 研发情况
				this.yfqkListRes = {}
				this.yanfaParam =  {
					pageSize: 20,
          page: 1,
				}
				// 产销量
				this.cxlListRes = {}
				this.cxlParam = {
					pageSize: 20,
          page: 1,
				}
				/* 重置 end */
				// year改变包含tp改变的所有操作
				this.handleTpChange()
				// 重载第二个第三个列表
				this.loading2 = false
				this.loadListTwoData()
				this.loading3 = false
				this.loadListThreeData()

			},
			// 营收情况分页 pageSize 改变时会触发
      handleSizeChange(val) {
				this.loading1 = false
        this.yinshouParam.pageSize = val
				this.loadListOneData()//营收情况的表格
				this.loading2 = false
				this.yanfaParam.pageSize = val
				this.loadListTwoData()
			},
			handleCurrentChange(val) {
				this.loading1 = false
        this.yinshouParam.page = val
				this.loadListOneData()
				this.loading2 = false
				this.yanfaParam.page = val
				this.loadListTwoData()
			},
			//研发情况分页 pageSize 改变时会触发
			handleSizeChange1(val) {
				this.loading2 = false
				this.yanfaParam.pageSize = val
				this.loadListTwoData()
			},
			handleCurrentChange1(val) {
				this.loading2 = false
				this.yanfaParam.page = val
				this.loadListTwoData()
			},
			//研发情况分页 pageSize 改变时会触发
			handleSizeChange2(val) {
				this.loading3 = false
				this.cxlParam.pageSize = val
				this.loadListThreeData()
			},
			handleCurrentChange2(val) {
				this.loading3 = false
				this.cxlParam.page = val
				this.loadListThreeData()
			},

		}
	}
</script>

<style lang="less">
	@import "~@/assets/less/var.less";
	@import "~@/assets/less/app.less";
	#nbsj {
		@conWidth: 100%;
		background: @White;
		box-shadow: @BoxShadowHover;
		padding-bottom: 20px;
		border-radius: 4px;

		a {
			text-decoration: none;
		}
		.con {
			width: @conWidth;
			margin: 0 auto;
		}
		.el-table .cell {
			padding-left: 39px;
		}

		// 标题
		.title {
			color: @FontColorHover;
			border-bottom: 1px solid @BorderColor;
			margin: 15px 0px 0px 0px;
			padding-bottom: 0px;
			.content {
				box-sizing: border-box;
				padding: 0px 32px;
				.con;
				.vm {
					border-bottom: 3px solid @PrimaryColor;
					padding: 0 5px;
					display: inline-block;
				}
				.el-select{
					border-bottom:0;
				}
				.el-input__inner {
					border-radius: 0;
					font-size: 10px;
					width: 86px;
					height: 24px;
					margin-left: 5px;
					margin-bottom: -1px;
				}
				.el-select .el-input.is-focus .el-input__inner{
					border-color:#CCCC;
				}
				.input__inner:focus{
					border:#CCCC;
				}
			}
			select {
				color: @FontColor;
				outline: none;
			}
		}
		// 顶部的年份切换
		.main-switch {
			border-radius: 4px 4px 0 0;
			height: 44px;
			line-height: 44px;
			background: #c3cde7;
			color: @White;
			display: flex;
			justify-content: center;
			align-items: center;
			&:before, &:after {
				content: '';
				width: 79px;height: 1px;
				display: inline-block;
				background: @White;
				margin: 0 15px;
			}
			.main-title {
				display: inline-block;
				margin-right: 8px;
			}
			// 重置顶部选择年份的选择框样式（原始为element样式）
			.el-select {
				width: 80px!important;
				.el-input {
					width: 100%!important;
					.el-input__inner {
						display: inline-block!important;
						min-width: 100%!important;
						height: 24px!important;
						border-radius: 4px!important;
						margin-top: 5px!important;
					}
					.el-input__suffix {
						display: inline-block!important;
						height: 24px!important;
					}
				}
			}
		}
		// 营收情况
		.ysqk {
			.title {
				margin-top: 15px;
				padding-bottom: 0px;
				select {
					.fs12;
					border-color: @BorderColor;
					padding-bottom: 3px;
					margin: 0 0 -6px 30px;
				}
			}
			.see-data {
        display: flex;
				justify-content: center;
				flex-wrap: wrap;
				min-height: 355px;
				margin-top: 30px;
        &>.item {
          width: 750px;
          height: 355px;
          margin: 0 30px;
        }
        &>.right-two {
          width: 750px;
          height: 322px;
          margin: 20px 30px 0px 30px;
          position: relative;
          padding-top: 33px;
          &>.check-box {
            width: 60%;
            height: 30px;
            border-bottom: 2px solid @PrimaryColor;
            position: absolute;
            top: 0;
            left: 20%;
            display: flex;
            justify-content: center;
            &>.item {
              width: 100px;
              height: 30px;
              line-height: 30px;
              margin: 0px 2px;
              padding: 0px;
              cursor: pointer;
              &.active {
                background: @PrimaryColor;
                color: #fff;
              }
              &:hover {
                background: @PrimaryColor;
                color: #fff;
              }
            }
          }
          &>.item {
            display: none;
            box-sizing: border-box;
            padding: 8px;
            width: 750px;
            height: 322px;
            &.ec_active {
              display: block!important;
            }
          }
        }
			}
			.item_content1{
				height: auto;
				background-color: white;
				padding-bottom:30px;
				.el-table{
					.el-table__header-wrapper{
						// padding-left: 34px;
						background-color: #EAEEF9;
						.el-table__header{
							.has-gutter{
								.el-table_3_column_15{
									width: 169px !important;
								}
							}
						}
					}
				}
			}
		}
		.item_content1{
			height: auto;
			background-color: white;
			padding-bottom:30px;
		}
		.el-pagination{
			padding-bottom: 0;
		}
	}
	@media screen and (max-width: 1526px) {
		.see-data {
			&>.item {
				width: 90%;
			}
			&>.right-two {
				width: 90%;
			}
		}
	}
</style>
