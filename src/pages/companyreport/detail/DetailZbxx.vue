<template>
	<div id="zbxx">
		<!-- 数据概览 -->
		<div class="sjgl">
			<div class="title fs14">
		    	<div class="content">
		    		<span class="tit vm">药品中标信息</span>
		    	</div>
		    </div>
		    <div class="gl con clearfix">
					<div class="gl-checkbox">
						<div class="item active" @click="handleCheckItemClick">中标情况</div>
						<div class="item" @click="handleCheckItemClick">价格品种</div>
					</div>
		    	<div class="gl-item left active">
		    		<ul class="gl-list gl-left-list clearfix fs13">
		    			<li>
		    				<span class="list-item-title">中标品种</span>
		    				<div class="list-item-detail">
		    					<span>{{zbxxTopData.count_pz}}</span>个
		    				</div>
		    			</li>
		    			<li>
		    				<span class="list-item-title">中标量最高药品</span>
		    				<div class="list-item-detail">
		    					<span>{{zbxxTopData.ypname}}</span>
		    				</div>
		    			</li>
		    			<li>
		    				<span class="list-item-title">中标地区</span>
		    				<div class="list-item-detail">
		    					<span>{{zbxxTopData.count_first}}</span>个
		    				</div>
		    			</li>
		    			<li>
		    				<span class="list-item-title">中标量最高地区</span>
		    				<div class="list-item-detail">
		    					<span>{{zbxxTopData.first}}</span>
		    				</div>
		    			</li>
		    		</ul>
		    	</div>
		    	<div class="gl-item right">
		    		<ul class="gl-list gl-right-list clearfix fs13">
		    			<li>
		    				<span class="list-item-title">最高中标价品种</span>
		    				<div class="list-item-detail">
		    					<a href="javascript:;" :title="headTop.guifanname">{{headTop.guifanname}}</a>
		    					<div>
										<div>
											<span>{{headTop.guifanguige}}</span>
										</div>
										<div>
											<span>{{headTop.feiyong}}</span>
											<span>{{headTop.approvaldate}}</span>
											<span>{{headTop.first}}</span>
										</div>
									</div>
		    				</div>
		    			</li>
		    			<li>
		    				<span class="list-item-title">最低中标价品种</span>
		    				<div class="list-item-detail">
		    					<a href="javascript:;" :title="headLow.guifanname">{{headLow.guifanname}}</a>
		    					<div>
										<span>{{headLow.guifanguige}}</span>
										<span>{{headLow.feiyong}}</span>
										<span>{{headLow.approvaldate}}</span>
										<span>{{headLow.first}}</span>
									</div>
		    				</div>
		    			</li>
		    		</ul>
		    	</div>
		    </div>
		</div>
		<!-- 视图列表 -->
		<div class="stlb">
			<div class="title fs14">
				<div class="content">
					<span class="tit vm">视图列表</span>
				</div>
			</div>
			<!-- 图表 -->
			<div class="see-data tc">
				<div class="item ib" ref="echarts_zbqs"></div>
				<div class="item has-inner ib">
					<el-select v-model="year" placeholder="全部年份" class="yearSelect">
						<el-option
							v-for="item in years"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
					<div class="item-inner" ref="echarts_zbyp"></div>
				</div>
			</div>
			<!-- 导出按钮 -->
			<!-- 暂时隐藏导出 -->
			<!-- <div class="con clearfix">
				<a class="fr">
					<i class="iconfont vm">&#xe605;</i>
					导出
				</a>
			</div> -->
			<!-- 表格 -->
			<!-- 自定义加载界面 -->
      <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
			<!-- 加载完成显示部分 -->
			<el-table
				:data="zbxxListData.res"
				stripe
				fixed
				class="table"
				style="width: 100%"
				v-else>
				<el-table-column
					v-for="item in tableHead"
					:prop="item.prop"
					:min-width="item.width"
					:width="item.okWidth"
					:key="item.prop"
					:label="item.label">
						<template slot-scope="scope">
							<div v-if="item.prop === 'yaopintongyongming'">
								{{ scope.row.guifanname }}
							</div>
							<div v-if="item.prop === 'jixing'">
								{{ scope.row.guifanjixing }}
							</div>
							<div v-if="item.prop === 'guige'">
								{{ scope.row.guifanguige }}
							</div>
							<div v-if="item.prop === 'baozhuangzhuanhuanbi'">
								{{ scope.row.baozhuanguige2 }}
							</div>
							<div v-if="item.prop === 'danwei'">
								{{ scope.row.packaging }}
							</div>
							<div v-if="item.prop === 'zhongbiaojia'">
								{{ scope.row.feiyong }}
							</div>
							<div v-if="item.prop === 'toubiaoqiye'">
								{{ scope.row.bidder }}
							</div>
							<div v-if="item.prop === 'zhongbiaoshengfen'">
								{{ scope.row.first }}
							</div>
							<div v-if="item.prop === 'faburiqi'">
								{{ scope.row.approvaldate }}
							</div>
						</template>
				</el-table-column>
			</el-table>
			<!-- 分页栏 -->
			<el-pagination
			  v-if="zbxxListData.count > 10"
				@current-change="handleCurrentChange"
				:current-page="param.page"
				:page-size="param.pageSize"
				layout="total, prev, pager, next"
				:total="zbxxListData.count">
			</el-pagination>
		</div>

	</div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from '@/config/tablehead'
const zbxxHead = tablehead.companyreport.DetailZbxx

	export default {
    components: {
      LoadingGif
    },
		data () {
			return {
				bm: Store.state.CompanyReport.bm,
				tableHead: zbxxHead,
				year: '',
				years: [
					// {
					// 	value: '0',
					// 	label: '全部年份'
					// },
					// {
					// 	value: '2017',
					// 	label: '2017'
					// },
					// {
					// 	value: '2016',
					// 	label: '2016'
					// },
					// {
					// 	value: '2015',
					// 	label: '2015'
					// }
				],
				zbxxTopData: {},
				headTop: {},
				headLow: {},
				zbxxLData: {
					x: [],
					y: [],
				},
				zbxxRData: {
					x: [],
					y: [],
				},
				zbxxListData: {},
				param: {
					pageSize: 20,
					page: 1,
				},
				loading1: true,
			}
		},
		watch: {
			year () {
				this.handleAxiosZbxx()
			}
		},
		methods: {
			// 获取 顶部栏信息数据 & 可视化数据
			handleAxiosZbxx () {
				window.Axios({
					method: 'get',
					url: '/api/company/zbxx',
					params: {
						bm: this.bm,
						year: this.year
					}
				}).then(res => {
					if (res.data.code === 200 && res.data) {
						let data = res.data.data
						this.zbxxEchartsData = data.view
						this.zbxxTopData = data.tongji
						this.headTop = data.tongji.zbjgpz.top
						this.headLow = data.tongji.zbjgpz.low
						if (!this.years.length) { // 初始处理，之后不处理
							this.handleEchartsLData()
						}
						this.handleEchartsRData()
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			// 获取 列表数据
			handleAxiosZbxxList () {
				window.Axios({
					method: 'get',
					url: '/api/company/zbxxlist',
					params: _.assign({
						bm: this.bm
					}, this.param)
				}).then(res => {
					if (res.data.code === 200 && res.data) {
						this.loading1 = false
						let data = res.data.data
						this.zbxxListData = data
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			handleEchartsLData () {
				let data = this.zbxxEchartsData

				// 处理years中的时间顺序 - 得到的sortedYears是排好序的years数组
				let sortedYears = data.years
				for (let index in sortedYears) {
					for (let i = 0; i < index; i++) {
						if (sortedYears[index].key < sortedYears[i].key) {
							let zdKey = sortedYears[index].key // 暂存的key值
							let zdValue = sortedYears[index].doc_count // 暂存的value值
							// 下面做替换
							sortedYears[index].key = sortedYears[i].key
							sortedYears[index].doc_count = sortedYears[i].doc_count
							sortedYears[i].key = zdKey
							sortedYears[i].doc_count = zdValue
						}
					}
				}

				// 处理select的this.years
				let sl_years = [{value: '0', label: '全部年份'}] // 存放后赋予this.years
				for (let item of sortedYears) {
					let obj = {
						value: item.key,
						label: item.key,
					}
					sl_years.push(obj)
				}
				this.years= sl_years

				// 处理echarts需要的数据
				for (let item of sortedYears) {
					this.zbxxLData.x.push(item.key)
					this.zbxxLData.y.push(item.doc_count)
				}

				this.drawZbqsLine()
			},
			handleEchartsRData() {
				let data = this.zbxxEchartsData
				// 处理echarts需要的数据
				this.zbxxRData = {
					x: [],
					y: [],
				}
				for (let item of data.zbyp) {
					this.zbxxRData.x.push(item.guifanname)
					this.zbxxRData.y.push(item.value)
				}
				this.drawZbypBar()
			},
			// 中标趋势图 - 折线图
			drawZbqsLine () {
				let dom = this.$refs.echarts_zbqs
        let ec = Echarts.init(dom, 'yaozh_theme')
      	ec.setOption({
					xAxis: {
						type: 'category',
						axisLine: {
							lineStyle: {
								color: '#aaa',
							},
						},
						axisLabel: {
							color: '#000',
						},
						data: this.zbxxLData.x,
					},
					yAxis: {
						type: 'value',
						name: "中标品种数量（个）",
						axisLabel: {
							color: '#000',
						},
					},
					grid: {
						show: false,
						containLabel: true,
						// left: 70,
						// right: 10,
						// top: 30,
						// bottom: 30,
					},
					tooltip:{
						show: true,
						trigger: 'axis',
					},
					series: [{
						name: '中标品种数量（个）',
						data: this.zbxxLData.y,
						type: 'line'
					}],
					title: {
						text: "中标趋势图",
						x: "center",
						top: 0,
						textStyle: {
							fontSize: "12",
							color: "#646A7A"
						},
						fontSize: "8"
					},
					fontSize: "14",
				})
			},
			// 中标药品（top20） - 柱形图
			drawZbypBar () {
				let dom = this.$refs.echarts_zbyp
        let ec = Echarts.init(dom, 'yaozh_theme')
      	ec.setOption({
					xAxis: [
						{
							type: 'category',
							axisTick: {
								show: true,
								interval: 0
							},
							axisLabel: {
								rotate: 45
							},
							data: this.zbxxRData.x,
						}
					],
					yAxis: {
						type: 'value',
						name: '中标地区数（个）',
						axisLabel: {
							color: '#000',
						},
					},
					grid: {
						show: false,
						containLabel: true,
						// top: 55,
						// bottom: 120,
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						},
					},
					series: [{
						name: '中标地区数量（个）',
						type: 'bar',
						barGap: 0,
						data: this.zbxxRData.y,
						barWidth: 8,
					}],
					title: {
						text: "中标药品（top20）",
						x: "center",
						top: 0,
						textStyle: {
							fontSize: "12",
							color: "#646A7A"
						},
						fontSize: "8"
					},
					fontSize: "14",
				})
			},
			// pageSize 改变时会触发
			handleSizeChange(val) {
				this.loading1 = true
				this.param.pageSize = val
				this.handleAxiosZbxxList()
			},
			// currentPage 改变时会触发
			handleCurrentChange(val) {
				this.loading1 = true
				this.param.page = val
				this.handleAxiosZbxxList()
			},
			handleCheckItemClick (event) {
        let dom = event.target
				let index = $(dom).index()
				$(".gl-checkbox .item").removeClass("active")
				$(".gl-checkbox .item").eq(index).addClass("active")
				$(".gl .gl-item").removeClass("active")
				$(".gl .gl-item").eq(index).addClass("active")
			},
		},
		created () {
			this.handleAxiosZbxx()
			this.handleAxiosZbxxList()
		},
		mounted () {

		},
	}
</script>

<style lang="less">
	@import "~@/assets/less/var.less";
	@import "~@/assets/less/app.less";

	#zbxx {
		@conWidth: 100%;
		background: @White;
		box-shadow: @BoxShadowHover;
		padding-bottom:50px;

		border-radius: 4px;
    
		.el-pagination{
			padding-bottom: 0;
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
			padding-top: 15px;margin-bottom: 33px;
			padding-bottom: 0px;
			.content {
				box-sizing: border-box;
				padding: 0px 32px;
				.con;
				position: relative;
				.tit {
					border-bottom: 3px solid @PrimaryColor;
					padding: 0 5px;
					display: inline-block;
				}
			}

		}
		// 数据概览
		.sjgl {
			.gl {
				box-sizing: border-box;
				text-align: center;
				margin: 30px auto 25px auto;
				padding: 0px 32px;
				.left {
					width: 752px;
					float: left;
					li {
						padding: 0 49px;
					}
				}
				.right {
					width: calc(100% - 762px);
					float: right;
					li {
						padding: 0 66px;
					}
				}
				.gl-checkbox {
					margin: 0px auto 14px auto;
					padding: 0px 20px;
					width: 40%;
					border-bottom: 2px solid @PrimaryColor;
					display: flex;
					justify-content: center;
					.item {
						cursor: pointer;
						text-align: center;
						min-width: 120px;
						height: 30px;
						line-height: 30px;
						margin: 0px 2px;
						&.active {
							background-color: @PrimaryColor;
							color: #fff;
						}
						&:hover {
							background-color: @PrimaryColor;
							color: #fff;
						}
					}
				}
				.gl-item {
					background: @TdBackgroundColor;
					padding: 25px 0 0 0;
					width: 100%;
					height: 130px;
					overflow: hidden;
					display: none;
					&.active {
						display: block;
					}
					.gl-list {
						width: 100%;
						display: flex;
						justify-content: space-around;
						margin-top: 25px;
					}
					.gl-left-list {
						.list-item-detail>span {
							font-size: 24px;
							color: @PrimaryColor;
						}
					}
					.gl-right-list {
						.list-item-detail {
							&>span {
								font-size: 24px;
								color: @PrimaryColor;
							}
							&>div {
								&>div {
									display: inline-block;
									&>span {
										display: inline-block;
										padding: 0px 4px;
									}
								}
							}
						}
						li {
							max-width: 300px;
							div {
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								a {
									font-size: 24px;
									color: #4877e8;
									cursor: text;
									text-decoration: none;
								}
							}
						}
					}
					li {
						float: left;
					}
					li:first-child {
						padding-left: 0;
					}
					li:last-child {
						padding-right: 0;
					}
				}
			}

		}
		// 视频列表
		.stlb {
			.see-data {
				display: flex;
				justify-content: center;
				.item {
					box-sizing: border-box;
					width: 45%;
					margin: 0px 5%;
					height: 350px;
					position: relative;
					.item-inner {
						width: 100%;
						height: 100%;
					}
					// 覆盖样式
					.el-input input {
						border-radius: 0;
					}
					.yearSelect {
						position: absolute;
						right: 0px;
						top: 0px;
						width: 118px;
						z-index: 999;
					}
				}
			}
			.title {

			}
		}
	}
	@media screen and (max-width: 1500px) {
		.see-data {
			flex-wrap: wrap;
			.item {
				width: 100%;
			}
		}
	}
</style>
