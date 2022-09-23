<!--
	说明：
	0、此组件耦合过深，已从公共组件中淘汰

	1、首用于 /yaopinzhongbiao/analy（药品中标数据库-》按药品排序和按企业排序的定量分析），应产品要求，以后会被经常复用，特意抽出。
	2、为了解耦，此组件只能用于展示数组，所有的一切加深耦合的逻辑均有父组件（调用处）传入（包括，API的请求，事件的响应）。
	3、因为组件与内容无关，所以命名也采用 大写字母代替
	4、注释内容与写组件时，所应用的环境有关，所以具体展示的效果参考 说明1处 指出的首用处
	5、后来人改动此组件，请详细看懂整个逻辑 or 询问创建者【如果还没离职的话~】
	6、不知道 $emit  和 直接传进方法调用 有何区别？
 -->
 <template>
	<div class="gh-analy dialog">
		<div class="header">
			<h1>药品中标精准分析</h1>
			<div style="display:flex;align-items:center;">
				<span class="esc-btn" @click="() => $emit('ananlyBClick')">返回</span>
				<el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
					<el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
					<el-breadcrumb-item v-if="this.route.indexOf('analy') > -1"><a :href="'/' + allBase.dbename">{{
							allBase.dbname
					}}</a></el-breadcrumb-item>
					<el-breadcrumb-item v-else>{{ allBase.dbname }}</el-breadcrumb-item>
					<el-breadcrumb-item>精准分析</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="cont">
			<div class="left">
				<!-- 点击左侧 导航的时候 将 index 下标传给父组件，让父组件传入对应切换的数据数组的数据，导航和数据 两个数组下标需对应 -->
				<div v-for="(curr, index) in A.nav" v-if="A.nav.length" class="A"
					:class="[A.activeValue == curr.value ? 'active' : '']" @click="$emit(A.clickNav, index, curr.value)"
					:key="curr.value">
					{{ curr.label }}
				</div>
			</div>
			<div class="right" target=".gh-analy .right">
				<div class="right-in">
					<!-- <el-scrollbar> -->
					<template v-for="(curr, index) in right">
						<!-- 当前导航 & 隐藏按钮 -->
						<div v-if="curr.name == 'B'" class="B">
							<span class="leftText">{{ curr.leftText }}</span>
						</div>
						<div class="cont-wrap">

							<!-- 选项搜索-->
							<div v-if="curr.name == 'C'" class="C">
								<span class="currInfoName fs15 ml18">{{ curr.leftText }}</span>
								<span class="fr fs13">
									{{ curr.rightText }}
									<el-autocomplete clearable v-model="curr.default" :popper-append-to-body="false"
										@select="(objVal) => { curr.handleSelect(A.activeValue, index, objVal) }"
										:fetch-suggestions="(str, cb) => { curr.remoteMethod(A.activeValue, index, { str: str, cb: cb }); }"
										suffix-icon="el-icon-search">
										<template slot-scope="{ item }">
											<div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
												:title="item.value">{{ item.value }}</div>
										</template>
									</el-autocomplete>
									<!-- 由于产品需求，做好的搜索按钮需要和生物制品统一，so 按钮不要了，改为切换就自动搜索 -->
									<!-- <button type="button" class="search" @click="$emit(curr.clickBtn, A.activeValue, index, curr.default)">{{ curr.btnVal }}</button> -->
								</span>
							</div>
							<!-- 信息概览 -->
							<div v-if="curr.name == 'D'" class="D fs13 clearfix tc">
								<ul>
									<li v-for="i in curr.data">
										<span>{{ i.title }}</span>
										<div>
											<span class="num">{{ i.num }}</span>{{ i.danwei }}
											<el-tooltip v-if="i.tips" effect="light" placement="right"
												content="中标地区包含地区和军区">
												<i class="el-icon-question cl-green"></i>
											</el-tooltip>
										</div>
										<div class="gg-company">
											{{ i.guige }}<span class="company" v-if="i.company">&nbsp;&nbsp;{{ i.company
											}}</span>
										</div>
										<div>
											{{ i.province }}<template v-if="i.date">&nbsp;&nbsp;{{ i.date }}</template>
										</div>
									</li>
								</ul>
							</div>
							<!-- 搜索条件筛选 -->
							<div v-if="curr.name == 'E'" class="E fs13">
								<table>
									<colgroup span="2">
										<col width="100">
										<col width="208">
									</colgroup>
									<tr>
										<td>
											{{ curr.text }}
										</td>
										<td>
											{{ curr.text2 }}
											<span class="cl-blue">{{ curr.text3 }}</span>
										</td>
										<td>
											<el-radio-group v-model="curr.default"
												@change="val => { curr.change(A.activeValue, index, val, curr.default2) }">
												<el-radio-button v-for="i in curr.group" :key="i" :label="i">
												</el-radio-button>
											</el-radio-group>
										</td>
									</tr>
									<tr>
										<td>

										</td>
										<td>
											{{ curr.text4 }}
											<span class="cl-blue">{{ curr.text5 }}</span>
										</td>
										<td>
											<el-radio-group v-model="curr.default2"
												@change="val => { curr.change2(A.activeValue, index, curr.default, val) }">
												<el-radio-button v-for="i in curr.group2" :key="i" :label="i">
												</el-radio-button>
											</el-radio-group>
										</td>
									</tr>
								</table>
							</div>
							<!-- 之前将，key写到了 right 循环的 div 上面，导致在更新 el-select 组件的 loading 状态的时候，出现【加载中】被自动隐藏的情况，伤心，沉痛万分 -->
							<!-- 用了key的部分是无法被复用的，所以类似 el-select 的某些使用中的状态无法被维护，有这种情况，将内容写在没有 key 属性 的外部 -->
							<!-- 时间维度分析 -->
							<div v-if="curr.name == 'F'" class="F">
								<div class="chart-title">
									<span class="text ml18 cl-blue fs14 ib">{{ curr.title }}</span>
								</div>
								<div class="wdSearch ml18">
									<el-select v-model="curr.default" popper-class="gh-analy" class="el-select-1"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
										<el-option v-for="item in curr.option" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<el-select v-model="curr.default2" popper-class="gh-analy" class="el-select-2 ml10"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
										<el-option v-for="item in curr.option2" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<!-- 由于产品需求，做好的搜索按钮需要和生物制品统一，so 按钮不要了，改为切换就自动搜索 -->
									<!-- <button type="button" class="search dn" @click="">{{ curr.btnVal || '搜索' }}</button> -->
								</div>
								<!-- 因为这里在 v-for 循环中，所以如果在此处使用方法或者计算属性修改data中的数据，会报可能无限循环的警告，所以直接下标加入数据 -->
								<!-- 图表 container 加入数组，方便循环待展示的数组数据，根据对应下标初始化 container -->
								<!-- <div class="chart ma" :ref="'chartRef'+index"></div> -->
								<div class="chart ma" :ref="'chartRef' + index" :key="JSON.stringify(curr)"></div>
							</div>
							<!-- 企业维度分析 -->
							<div v-if="curr.name == 'G'" class="G">
								<div class="chart-title">
									<span class="text ml18 cl-blue fs14 ib">{{ curr.title || '标题' }}</span>
								</div>
								<div class="wdSearch ml18">
									<!-- isMultiple 为 true 是给 企业在执行价格分析，选择的企业数量少于等于 4 个用的 -->
									<template v-if="curr.isMultiple">
										<el-select v-model="curr.default" :placeholder="curr.placeholder" multiple
											filterable :multiple-limit="10" collapse-tags popper-class="gh-analy"
											class="el-select-1"
											@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
											<el-option v-for="item in curr.option" :key="item.value" :label="item.label"
												:value="item.value">
											</el-option>
										</el-select>
										<el-select v-model="curr.default2" :placeholder="curr.placeholder2"
											popper-class="gh-analy" class="el-select-2 ml10"
											@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
											<el-option v-for="item in curr.option2" :key="item.value"
												:label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</template>
									<template v-else>
										<el-select v-model="curr.default" popper-class="gh-analy" class="el-select-1"
											@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
											<el-option v-for="item in curr.option" :key="item.value" :label="item.label"
												:value="item.value">
											</el-option>
										</el-select>
										<el-select v-model="curr.default2" popper-class="gh-analy"
											class="el-select-2 ml10"
											@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
											<el-option v-for="item in curr.option2" :key="item.value"
												:label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</template>
									<!-- 由于产品需求，做好的搜索按钮需要和生物制品统一，so 按钮不要了，改为切换就自动搜索 -->
									<!-- <button type="button" class="search dn" @click="">{{ curr.btnVal || '搜索' }}</button> -->
								</div>
								<!-- 因为这里在 v-for 循环中，所以如果在此处使用方法或者计算属性修改data中的数据，会报可能无限循环的警告，所以直接下标加入数据 -->
								<!-- 图表 container 加入数组，方便循环待展示的数组数据，根据对应下标初始化 container -->
								<!-- <div class="chart ma" :ref="'chartRef'+index"></div> -->
								<div class="chart ma" :ref="'chartRef' + index" :key="JSON.stringify(curr)"></div>
							</div>
							<!-- 地区维度分析 -->
							<!-- 地区维度，和企业维度模板一样，只是提供的数据不同 -->
							<!-- 中标地区热力图 -->
							<div v-if="curr.name == 'I'" class="I">
								<div class="chart-title">
									<span class="text ml18 cl-blue fs14 ib">{{ curr.title || '标题' }}</span>
								</div>
								<!-- 因为这里在 v-for 循环中，所以如果在此处使用方法或者计算属性修改data中的数据，会报可能无限循环的警告，所以直接下标加入数据 -->
								<!-- 图表 container 加入数组，方便循环待展示的数组数据，根据对应下标初始化 container -->
								<!-- <div class="chart ma" :ref="'chartRef'+index"></div> -->
								<div class="chart ma" :ref="'chartRef' + index" :key="JSON.stringify(curr)"></div>
							</div>
							<!-- 企业在执行价格分析 -->
							<div v-if="curr.name == 'J'" class="J">
								<div class="chart-title">
									<span class="text ml18 cl-blue fs14 ib">{{ curr.title || '标题' }}</span>
								</div>
								<div class="wdSearch ml18">
									<el-select v-model="curr.default" :placeholder="curr.placeholder" multiple
										filterable :multiple-limit="10" collapse-tags popper-class="gh-analy"
										class="el-select-1"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
										<el-option v-for="item in curr.option" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<el-select v-model="curr.default2" :placeholder="curr.placeholder2"
										popper-class="gh-analy" class="el-select-2 ml10"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
										<el-option v-for="item in curr.option2" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<!-- 由于产品需求，做好的搜索按钮需要和生物制品统一，so 按钮不要了，改为切换就自动搜索 -->
									<!-- <button type="button" class="search dn" @click="">{{ curr.btnVal || '搜索' }}</button> -->
								</div>
								<!-- 因为这里在 v-for 循环中，所以如果在此处使用方法或者计算属性修改data中的数据，会报可能无限循环的警告，所以直接下标加入数据 -->
								<!-- 图表 container 加入数组，方便循环待展示的数组数据，根据对应下标初始化 container -->
								<!-- <div class="chart ma" :ref="'chartRef'+index"></div> -->
								<div class="chart ma" :ref="'chartRef' + index" :key="JSON.stringify(curr)"></div>
							</div>

							<!-- 品种维度分析 & 时间维度分析2 -->
							<div v-if="curr.name == 'K'" class="K">
								<div class="chart-title">
									<span class="text ml18 cl-blue fs14 ib">{{ curr.title || '标题' }}</span>
								</div>
								<div class="wdSearch ml18">
									<el-select v-model="curr.default" popper-class="gh-analy" class="el-select-2"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default)">
										<el-option v-for="item in curr.option" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<!-- 由于产品需求，做好的搜索按钮需要和生物制品统一，so 按钮不要了，改为切换就自动搜索 -->
									<!-- <button type="button" class="search dn" @click="">{{ curr.btnVal || '搜索' }}</button> -->
								</div>
								<!-- 因为这里在 v-for 循环中，所以如果在此处使用方法或者计算属性修改data中的数据，会报可能无限循环的警告，所以直接下标加入数据 -->
								<!-- 图表 container 加入数组，方便循环待展示的数组数据，根据对应下标初始化 container -->
								<!-- <div class="chart ma" :ref="'chartRef'+index"></div> -->
								<div class="chart ma" :ref="'chartRef' + index" :key="JSON.stringify(curr)"></div>
							</div>
							<!-- MMMP的要求少于4个企业用条形图，否则用热力图，设计的时候select和图表类型绑定死了，只有单独写一个多选select对应了条形图 -->
							<!-- 用于企业在执行价格分析 不同 数量的企业的显示 -->
							<div v-if="curr.name == 'L'" class="L">
								<div class="chart-title">
									<span class="text ml18 cl-blue fs14 ib">{{ curr.title || '标题' }}</span>
								</div>
								<div class="wdSearch ml18">
									<el-select v-model="curr.default" placeholder="请选择" multiple filterable
										collapse-tags popper-class="gh-analy" class="el-select-1"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
										<el-option v-for="item in curr.option" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<el-select v-model="curr.default2" placeholder="请选择" popper-class="gh-analy"
										class="el-select-2 ml10"
										@change="$emit(curr.clickBtn, A.activeValue, index, curr.default, curr.default2)">
										<el-option v-for="item in curr.option2" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
									<!-- 由于产品需求，做好的搜索按钮需要和生物制品统一，so 按钮不要了，改为切换就自动搜索 -->
									<!-- <button type="button" class="search dn" @click="">{{ curr.btnVal || '搜索' }}</button> -->
								</div>
								<!-- 因为这里在 v-for 循环中，所以如果在此处使用方法或者计算属性修改data中的数据，会报可能无限循环的警告，所以直接下标加入数据 -->
								<!-- 图表 container 加入数组，方便循环待展示的数组数据，根据对应下标初始化 container -->
								<!-- <div class="chart ma" :ref="'chartRef'+index"></div> -->
								<div class="chart ma" :ref="'chartRef' + index" :key="JSON.stringify(curr)"></div>
							</div>



						</div>
					</template>
				</div>
				<!-- </el-scrollbar> -->
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
export default {
	props: {
		A: {
			// 左侧导航
			type: Object,
			default: () => {
				return {};
			}
		},
		right: {
			type: Array,
			default: () => {
				return [];
			}
		},	// 存储最外层的大循环，这个的存在是为了 方便 根据数据出现的顺序，对右侧的每个部分出现的顺序进行控制
		loading: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	components: {
	},
	data() {
		return {
			route: this.$route.path.split('/')[2],
		}
	},
	computed: {
		...mapState({
			allBase: state => state.Yaopinzhongbiao.allBase
		})
	},
	created() {
		window.ghAnaly = this;
	},
	mounted() {
	},
	updated() {
		// if (!this.loading) {
		// 	this.$nextTick(() => {
		// 		this.setChart();
		// 	})
		// }
	},
	watch: {
		$route() {
			this.route = this.$route.path.split('/')[2]
		},
	},
	methods: {
		// elementUI 组件的方法调用，在里面调用父组件传入的方法名，传出参数。
		E_change(label) {
			this.$emit(E.change, label);
		},
		E_change2(label) {
			this.$emit(E.change2, label);
		},
		setChart() {
			this.$nextTick(() => {
				this.right.forEach((curr, index, arr) => {
					if (curr.type == 'chart') {
						// 值得注意的是：这里的ref出现的是数组，不知道是不是因为 v-for 循环的原因
						let chartType = curr.name;
						if (chartType == 'L') {
							// 用一个图表模板
							chartType = 'G';
						}
						Echarts.init(this.$refs['chartRef' + index][0], "yaozh_theme",).setOption(this[chartType + '_option'](curr));
					}
				})
			})
		},
		// 图表配置选项
		// 时间维度分析
		F_option(obj) {
			return {
				title: {
					text: obj.titleChart,
					textAlign: 'center',
					left: '50%'
				},
				tooltip: {
					trigger: 'axis',
				},
				dataZoom: null,
				legend: {
					data: obj.legendData,
					orient: 'vertical',
					right: 0,
					y: 'center',
					align: 'left'
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					right: 180,
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: obj.x
					}
				],
				yAxis: [
					{
						type: 'value',
						name: obj.yLeftTitle,
					}
				],
				series: obj.series
			}
		},
		// 企业维度分析
		G_option(obj) {
			return {
				title: {
					text: obj.titleChart,
					textAlign: 'center',
					left: '50%'
				},
				tooltip: {
					trigger: 'axis',
				},
				grid: {
					right: 180,
					containLabel: true
				},
				dataZoom: obj.hasDataZoom ? {
					type: 'slider',
					show: true,
					startValue: obj.hasDataZoom.startValue,
					endValue: obj.hasDataZoom.endValue,
					// handleSize: 18
				} : null,
				toolbox: {
					feature: {
						// dataView: {show: true, readOnly: false},
						// magicType: {show: true, type: ['line', 'bar']},
						// restore: {show: true},
						saveAsImage: { show: true }
					}
				},
				legend: {
					data: obj.legendData,
					orient: 'vertical',
					right: 0,
					y: 'center',
					align: 'left',
					formatter: function (name) {
						return name.length > 10 ? name.slice(0, 10) + '...' : name;
					}
				},
				xAxis: [
					{
						type: 'category',
						data: obj.x,
						axisPointer: {
							type: 'shadow'
						},
						axisLabel: {
							rotate: obj.rotate || 0
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						name: obj.yLeftTitle,
						// interval: 50
					},
					{
						type: 'value',
						name: obj.yRightTitle,
						// interval: 5
					}
				],
				series: obj.series
			}
		},
		// 地区维度分析
		// 地区维度，和企业维度模板一样，只是提供的数据不同
		// 中标地区热力图
		I_option(obj) {
			return {
				title: {
					text: obj.titleChart,
					textAlign: 'center',
					left: '50%',
					subtext: obj.subtext
				},
				tooltip: {
					position: 'top'
				},
				toolbox: {
					feature: {
						saveAsImage: {
							title: "保存",
							icon: "image:///static/imgs/echarts/download.png"
						},
					}
				},
				xAxis: {
					type: 'category',
					data: obj.x,
					splitArea: {
						show: true
					},
					axisLabel: {
						interval: 0,
						rotate: 45,
					},
					axisLine: {
						lineStyle: {
							color: '#aaa',
						},
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#c6daf0',
						}
					},
				},
				yAxis: {
					type: 'category',
					data: obj.y,
					splitArea: {
						show: true
					},
					axisLabel: {
						interval: 0,
					},
					axisTick: {
						show: false,
					},
					axisLine: {
						lineStyle: {
							color: '#aaa',
						},
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#c6daf0',
						}
					},
				},
				visualMap: [
					{
						calculable: true,
						min: 0,
						max: obj.maxValue, //根据具体最大值来确定
						right: 30,
						align: 'left',
						calculable: true,
						realtime: false,
						itemHeight: 580,
						itemWidth: 10,
						inverse: obj.inverse,
						inRange: {
							color: ['#fff', '#4877e8']
						}
					}
				],
				series: [{
					type: 'heatmap',
					data: obj.series,
					tooltip: {
						formatter: function (params) {
							return '<b>' + obj.xName + '</b>' + params.name + '<br/><b>' + obj.yName + '</b>' + obj.y[params.value[1]] + '<br/><b>数值：</b>' + params.value[2]
						}
					},
					label: {
						show: true,
						color: '#000',
						fontWeight: 'bold',
						formatter: function (params) {
							if (Number(params.value[2]) > 0) {
								return params.value[2];
							} else {
								return '0';
							}
						}
					},
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						},
					},
				}]
			}
		},
		// 企业在执行价格分析
		J_option(obj) {
			let dataZoom = [];
			obj.hasDataZoomX && dataZoom.push(
				{
					type: 'slider',
					show: true,
					// start: 25,
					// end: 75,
					startValue: obj.hasDataZoomX.startValue,
					endValue: obj.hasDataZoomX.endValue
				}
			)
			obj.hasDataZoomY && dataZoom.push(
				{
					type: 'slider',
					show: true,
					// start: 25,
					yAxisIndex: 0,
					startValue: obj.hasDataZoomY.startValue,
					endValue: obj.hasDataZoomY.endValue
					// end: 75,
				}
			)
			return {
				title: {
					text: obj.titleChart,
					subtext: obj.subtext,
					left: 'center'
				},
				tooltip: {
					position: 'top',
					formatter: function (params) {
						if (params.componentType == 'series') {
							return '<b>' + obj.xName + '</b>' + params.name + '<br/><b>' + obj.yName + '</b>' + obj.y[params.value[1]] + '<br/><b>数值：</b>' + params.value[2]
						}
					}
				},
				dataZoom: dataZoom,
				xAxis: {
					type: 'category',
					data: obj.x,
					boundaryGap: false,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#999',
							type: 'dashed'
						}
					},
					axisLine: {
						show: false
					},
					axisLabel: {
						formatter: function (value, index) {
							return value.slice(0, 7) + '...';
						}
					}
				},
				yAxis: {
					type: 'category',
					data: obj.y,
					axisLine: {
						show: false
					},
					offset: 20,
				},
				series: obj.series
			}
		},
		// 品种维度分析
		K_option(obj) {
			return {
				title: {
					text: obj.titleChart,
					textAlign: 'center',
					left: '50%'
				},
				tooltip: {
					trigger: 'axis',
				},
				grid: {
					right: 180,
					containLabel: true
				},
				toolbox: {
					feature: {
						// dataView: {show: true, readOnly: false},
						// magicType: {show: true, type: ['line', 'bar']},
						// restore: {show: true},
						saveAsImage: { show: true }
					}
				},
				dataZoom: obj.hasDataZoom ? {
					type: 'slider',
					show: true,
					startValue: obj.hasDataZoom.startValue,
					endValue: obj.hasDataZoom.endValue,
				} : null,
				rotate: obj.rotate || 0,
				legend: {
					data: obj.legendData,
					orient: 'vertical',
					right: 0,
					top: '40%',
					align: 'left'
				},
				xAxis: [
					{
						type: 'category',
						data: obj.x,
						axisPointer: {
							type: 'shadow'
						},
						axisLabel: {
							rotate: obj.rotate || 0
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						name: obj.yLeftTitle,
						// interval: 50
					}
				],
				series: obj.series
			}
		}
	}
}
</script>
<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";

.gh-analy.el-select-dropdown {
	margin-top: 0;
	margin-bottom: 0;
}

.gh-analy.dialog {
	padding: 10px;
	position: absolute;
	z-index: 1000;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-color: @PrimaryBackgroundColor;
	overflow: auto;
	box-sizing: border-box;
	min-width: 1200px;

	input.el-input__inner::-webkit-input-placeholder {
		color: #52586A;
	}

	input.el-input__inner::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: #52586A;
	}

	input.el-input__inner:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		color: #52586A;
	}

	input.el-input__inner:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #52586A;
	}

	.el-autocomplete {
		width: auto;
	}

	.ml18 {
		margin-left: 18px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		h1 {
			font-size: 18px;
			font-weight: bold;
			margin: 0;
			line-height: 1;
			color: #545b6d;
		}

		.esc-btn {
			align-self: flex-end;
			font-size: 13px;
			line-height: 1;
			cursor: pointer;
		}
	}

	.cont {
		position: relative;
		margin-top: 15px;
	}

	.left {
		position: absolute;
		left: 0;
		top: 0;

		.A {
			width: 180px;
			box-sizing: border-box;
			padding-left: 20px;
			line-height: 40px;
			border-left: 4px solid @PrimaryBackgroundColor;
			border-bottom: 1px dashed @BorderColor;
			cursor: pointer;
			font-size: 14px;

			&.active,
			&:hover {
				border-left: 4px solid @PrimaryColor;
				border-bottom: 0px;
				background-color: #fff;
				box-shadow: @BoxShadow;
				color: @PrimaryColor;
			}
		}
	}

	.right {
		box-sizing: border-box;
		padding-left: 190px;

		.right-in {
			box-shadow: @BoxShadow;
			box-sizing: border-box;
		}

		.cont-wrap {
			background: #FFF;
			padding-bottom: 1px;
		}

		.chart-title {
			border-bottom: 1px solid @BorderColor;

			.text {
				border-bottom: 3px solid @PrimaryColor;
				padding: 1px 5px;
			}
		}

		button.search {
			.fs13;
			border-radius: 14px;
			width: 68px;
			height: 28px;
			color: @White;
			line-height: normal;
			outline: none;
			border: 0;
			background: @McTypeGray;
			margin-left: 10px;
		}

		.wdSearch {
			height: 60px;
			line-height: 60px;

			.el-input__inner {
				background: @TimeBgGray;
				border-color: #dfe5f1;
			}

			.el-select-1 {
				input {
					width: 350px;
					height: 30px !important;
				}
			}

			.el-select-2 {
				input {
					width: 150px;
				}
			}
		}

		.chart {
			width: 100%;
			height: 640px;
			padding: 30px;
			box-sizing: border-box;
		}

		// 私用
		.B {
			padding-left: 20px;
			line-height: 40px;
			background-color: @PrimaryBackgroundColor;

			.leftText {

				font-size: 14px;
			}

			.rightText {
				display: inline-block;
				height: 100%;
				font-size: 13px;

				img {
					display: inline-block;
					margin-top: 10px;
				}
			}
		}

		.C {
			height: 58px;
			line-height: 58px;
			padding-right: 40px;

			.currInfoName {
				.vm;
				color: @PrimaryColor;

				&:before {
					content: '';
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 8px;
					background: #4e8bfe;
					margin-right: 10px;
				}
			}
		}

		.D {
			background: @TdBackgroundColor;
			padding: 30px 0 25px 0;

			ul {
				display: inline-block;
				display: flex;
				justify-content: space-around;
				align-items: center;

				div .num {
					font-size: 24px;
					color: @PrimaryColor;
				}

				.gg-company {
					max-width: 300px;

					.company {
						white-space: nowrap;
					}
				}
			}
		}

		.E {
			padding: 15px 0 0 18px;

			td:first-child,
			td:first-child+td {
				vertical-align: top;
			}

			.el-radio-button {
				.el-radio-button__inner {
					.fs13;
					height: 20px;
					line-height: 13px;
					border-radius: 15px;
					padding: 3px 5px;
					// border: 1px solid @FontColor;
					border: 0;
					background: transparent;
					margin-right: 13px;
					box-shadow: none;
					margin: 0 10px 10px 0;
				}

				&.is-active {
					.el-radio-button__inner {
						border: 1px solid @PrimaryColor;
						color: @PrimaryColor;
					}
				}
			}
		}
	}
}
</style>
