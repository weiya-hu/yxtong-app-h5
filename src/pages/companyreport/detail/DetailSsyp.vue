<template>
  <div id="ssyp">
  	<!-- 数据概览-start -->
    <div class="title fs14">
    	<div class="content"><span>数据概览</span></div>
    </div>
    <div class="gl con clearfix">
			<div class="gl-checkbox">
				<div class="item active" @click="handleCheckItemClick">上市汇总</div>
				<div class="item" @click="handleCheckItemClick">治疗领域（国内）</div>
			</div>
    	<div class="gl-item left active">
    		<ul class="clearfix fs13">
    			<li>
    				<span>国内上市</span>
    				<div>
    					<span>{{ sjglD.l.gnss }}</span>个
    				</div>
    			</li>
    			<li>
    				<span>国外上市</span>
    				<div>
    					<span>{{ sjglD.l.gwss }}</span>个
    				</div>
    			</li>
    			<li>
    				<span>国外进口</span>
    				<div>
    					<span>{{ sjglD.l.gwjk }}</span>个
    				</div>
    			</li>
    		</ul>
    	</div>
    	<div class="gl-item right pr">
				<div class="ul-zllygn clearfix fs13">
					<ul>
						<li v-for="(v,i) in sjglD.r.atcs" :title="v.key + '：' + v.value + '个'">
							<span class="right-title">{{ v.key }}</span>
							<div>
								<span>{{ v.value }}</span>个
							</div>
						</li>
					</ul>
				</div>
    	</div>
    </div>
    <!-- 数据概览-end -->

		<!-- 国内上市药品-start -->
		<div class="title fs14">
			<div class="content"><span>国内上市药品({{ gnssTotal }})</span></div>
		</div>
		<div class="con gnss-search">
			<div class="tc">
				<ul class="clearfix fs14" @click="gnssBigType">
					<li class="active">
						<i class="gray"></i>
						<span class="bigtype">全部（{{ gnssTotal }}）</span>
					</li>
					<li>
						<i class="green"></i>
						<span class="bigtype">化学药品（{{ gnssD.totalHx }}）</span>
					</li>
					<li>
						<i class="blue"></i>
						<span class="bigtype">中药（{{ gnssD.totalZy }}）</span>
					</li>
					<li>
						<i class="purple"></i>
						<span class="bigtype">生物制品（{{ gnssD.totalSw }}）</span>
					</li>
					<li>
						<i class="orange"></i>
						<span class="bigtype">其他（{{ gnssD.totalOther }}）</span>
					</li>
					<li>
						<el-input
						placeholder='药品名称'
						class="gnssSearch"
						v-model='gnssD.valSearch'
						@keyup.enter.native="gnssSearch"
						>
							<i
							class="el-input__icon el-icon-search"
							slot="suffix"
							@click="gnssSearch"></i>
						</el-input>
					</li>
				</ul>
			</div>
		</div>
		<div class="con gnss-con clearfix">
			<div class="item fl left">
				<ul class="con-box">
					<li v-for="(item,index) in gnssD.dataList">
						<div class="tit">
							<span class="year">{{ item.year }}</span>
							<i :class="['iconfont', {'open': index == 0}]" @click="gnssToggleShow">&#xe609;</i>
						</div>
						<ul :style="{height: index ? 0:'auto'}">
							<li v-for="(ite,inde) in item.data" :class="[ite.bigtype, {active: index || inde ? false:true }]">
								<span class="date">{{ ite.authorizationday }}</span>
								<span class="name" @click="gnssItemDetail(ite, $event)">{{ ite.name }}</span>
								<span class="type">{{ '#'+ite.atc }}</span>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<div class="item fr right">
				<table v-show="gnssD.detail.name">
					<tr>
						<td colspan="2" class="msg">
							产品详情
						</td>
					</tr>
					<tr v-if="gnssD.detail.name">
						<td colspan="2" :class="['name', gnssD.detail.bigtype]">
							<span>{{ gnssD.detail.name }}</span>
						</td>
					</tr>
					<tr v-if="gnssD.detail.pizhunwenhao">
						<td>
							批准文号
						</td>
						<td>
							{{ gnssD.detail.pizhunwenhao }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.englishname">
						<td>
							产品名称（英文）
						</td>
						<td>
							{{ gnssD.detail.englishname }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.brandname">
						<td>
							商品名
						</td>
						<td>
							{{ gnssD.detail.brandname }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.shengchanqiye">
						<td>
							生产单位
						</td>
						<td>
							{{ gnssD.detail.shengchanqiye }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.guige">
						<td>
							规格
						</td>
						<td>
							{{ gnssD.detail.guige }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.jixing">
						<td>
							剂型
						</td>
						<td>
							{{ gnssD.detail.jixing }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.type">
						<td>
							产品类型
						</td>
						<td>
							{{ gnssD.detail.type }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.authorizationday">
						<td>
							批准日期
						</td>
						<td>
							{{ gnssD.detail.authorizationday }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.benweima">
						<td>
							药品本位码
						</td>
						<td>
							{{ gnssD.detail.benweima }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.address">
						<td>
							生产地址
						</td>
						<td>
							{{ gnssD.detail.address }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.isYiBao">
						<td>
							是否医保
						</td>
						<td>
							{{ gnssD.detail.isYiBao }}
						</td>
					</tr>
					<tr v-if="gnssD.detail.instruction">
						<td>
							药品说明书
						</td>
						<td>
							{{ gnssD.detail.instruction }}
						</td>
					</tr>
				</table>
			</div>
		</div>
		<!-- 国内上市药品-end -->

		<!-- 国外进口药品-start -->
		<div class="all-gwjk" v-show="gwjkD.total">
			<div class="title fs14">
				<div class="content"><span>国外进口药品({{gwjkD.total}})</span></div>
			</div>
			<div class="table-box clearfix">
				<div class="msg con">
					<i class="iconA iconA2"></i>
					<span class="txt">国外进口</span>
					<div class="fr">
						<a>
							<i class="iconfont">&#xe605;</i>
							导出
						</a>
					</div>
				</div>
				<!-- 表格 -->
				<!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="!Object.keys(gwjkD.table).length" v-if="!Object.keys(gwjkD.table).length" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
				<el-table
					:data="gwjkD.table"
					stripe
					v-else>
					<el-table-column
						prop="chanpinmingchengzhongwen"
						label="药品名称（中文）">
					</el-table-column>
					<el-table-column
						prop="guigezhongwen"
						label="药品规格">
					</el-table-column>
					<el-table-column
						prop="changshangguojiazhongwen"
						label="国家">
					</el-table-column>
					<el-table-column
						prop="zhucezhenghao"
						label="注册证号">
					</el-table-column>
					<el-table-column
						prop="fazhengriqi"
						label="发证日期">
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					v-if="gwjkD.total > 10"
					@current-change="gwjkCurrChange"
					:current-page="gwjkD.currPage"
					:page-size="pageSize"
					:layout="layout"
					:total="gwjkD.total">
				</el-pagination>
			</div>
		</div>
		<!-- 国外进口药品-end -->

		<!-- 国外上市药品-start -->
		<div class="all-gwss" v-show="usD.total + omD.total + jpD.total">
			<div class="title fs14 mt60">
				<div class="content"><span>国外上市药品({{usD.total + omD.total + jpD.total}})</span></div>
			</div>

			<!-- 美国上市-start -->
			<div class="table-box clearfix" v-show="usD.total">
				<div class="msg con">
					<i class="iconA iconA0"></i>
					<span class="txt">美国上市</span>
					<div class="fr">
						<a>
							<i class="iconfont">&#xe605;</i>
							导出
						</a>
					</div>
				</div>
				<!-- 表格 -->
				<!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="!Object.keys(usD.table).length" v-if="!Object.keys(usD.table).length" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
				<el-table
					:data="usD.table"
					stripe
					v-else>
					<el-table-column
						prop="ApplNo"
						label="申请号">
					</el-table-column>
					<el-table-column
						prop="drugname"
						label="商标名">
					</el-table-column>
					<el-table-column
						prop="activeingredient"
						label="活性成分">
					</el-table-column>
					<el-table-column
						prop="cname"
						label="中文活性成分">
					</el-table-column>
					<el-table-column
						prop="form"
						label="剂型">
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					v-if="usD.total > 10"
					@current-change="usCurrChange"
					:current-page="usD.currPage"
					:page-size="pageSize"
					:layout="layout"
					:total="usD.total">
				</el-pagination>
			</div>
			<!-- 美国上市-end -->

			<!-- 欧盟上市-start -->
			<div class="table-box clearfix" v-show="omD.total">
				<div class="msg con">
					<i class="iconA iconA1"></i>
					<span class="txt">欧盟上市</span>
					<div class="fr">
						<a>
							<i class="iconfont">&#xe605;</i>
							导出
						</a>
					</div>
				</div>
				<!-- 表格 -->
				<!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="!Object.keys(omD.table).length" v-if="!Object.keys(omD.table).length" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
				<el-table
					:data="omD.table"
					stripe
					v-else>
					<el-table-column
						prop="num"
						label="编号">
					</el-table-column>
					<el-table-column
						prop="name"
						label="药品名称">
					</el-table-column>
					<el-table-column
						prop="hxcf"
						label="活性成分">
					</el-table-column>
					<el-table-column
						prop="form"
						label="剂型">
					</el-table-column>
					<el-table-column
						prop="changshang"
						label="上市许可持有人">
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					v-if="omD.total > 10"
					@current-change="omCurrChange"
					:current-page="omD.currPage"
					:page-size="pageSize"
					:layout="layout"
					:total="omD.total">
				</el-pagination>
			</div>
			<!-- 欧盟上市-end -->

			<!-- 日本上市-start -->
			<div class="table-box clearfix" v-show="jpD.total">
				<div class="msg con">
					<span class="txt">日本上市</span>
					<div class="fr">
						<a>
							<i class="iconfont">&#xe605;</i>
							导出
						</a>
					</div>
				</div>
				<!-- 表格 -->
				<!-- 自定义加载界面 -->
        <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="!Object.keys(jpD.table).length" v-if="!Object.keys(jpD.table).length" :delayTime="0"></LoadingGif>
        <!-- 加载完成显示部分 -->
				<el-table
					:data="jpD.table"
					stripe
					v-else>
					<el-table-column
						prop="bandname"
						label="商标名">
					</el-table-column>
					<el-table-column
						prop="active"
						label="活性成份">
					</el-table-column>
					<el-table-column
						prop="approval"
						label="申请类型">
					</el-table-column>
					<el-table-column
						prop="date"
						label="批准日期">
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-pagination
					v-if="jpD.total > 10"
					@current-change="jpCurrChange"
					:current-page="jpD.currPage"
					:page-size="pageSize"
					:layout="layout"
					:total="jpD.total">
				</el-pagination>
			</div>
			<!-- 日本上市-end -->
		</div>
		<!-- 国外上市药品-end -->
	</div>
</template>

<script>
	import { mapState } from 'vuex'
  import LoadingGif from '@/components/common/globalCom/loading-gif'
	export default {
    components: {
      LoadingGif
    },
		data () {
			return {
				pageSizes: [20, 30, 50],
				pageSize: 10,
				layout: 'total, prev, pager, next',
				// 数据概览
				sjglD: {
					api: '/api/company/ssypsjgl',
					stateData: null,
					l: {
						gnss: 0,
						gwss: 0,
						gwjk: 0
					},
					r: {
						atcs: null,
						atcsPointer: 0
					}
				},
				// 国内上市
				gnssD: {
					api: '/api/company/ssyp',
					stateData: null,
					valSearch: '',
					currBigType: '全部',
					totalHx: 0,
					totalZy: 0,
					totalSw: 0,
					totalOther: 0,
					typeColor: {
						'化学药品': 'g',
						'中药': 'b',
						'生物制品': 'p',
						'其他': 'o'
					},
					cacheDataList: null,
					dataList: null,
					detail: {
						bigtype: null,
					}
				},
				// 国外进口
				gwjkD: {
					api: '/api/company/ssypgwjk',
					table: [],
					currPage: 1,
					total: 0,
					pageSize: 0,
					source: {}
				},
				// 美国（上市）
				usD: {
					api: '/api/company/ssypus',
					stateData: null,
					table: [],
					currPage: 1,
					total: 0,
					pageSize: 0,
					source: {}
				},
				// 欧盟（上市）
				omD: {
					api: '/api/company/ssypom',
					stateData: null,
					table: [],
					currPage: 1,
					total: 0,
					pageSize: 0,
					source: {}
				},
				// 日本（上市）
				jpD: {
					api: '/api/company/ssypjp',
					stateData: null,
					table: [],
					currPage: 1,
					total: 0,
					pageSize: 0,
					source: {}
				},
			}
		},
		created () {
			if (this.ssyp.bm == this.bm) {
				this.recoverData()
			} else {
				// 保存 bm
				Store.commit('CompanyReport/ssypBm', this.bm)
				this.initData()
			}
		},
		computed: {
			...mapState({
				bm: state => state.CompanyReport.bm,
				ssyp: state => state.CompanyReport.ssyp
			}),
			gnssTotal () {
				let g = this.gnssD;
				return g.totalHx+g.totalZy+g.totalSw+g.totalOther;
			}
		},
		watch: {
			'sjglD.stateData' (n) {
				let s = this.sjglD, tmpArr = [];
				n = n.data;

				s.l.gnss = n.count_gnss;
				s.l.gwss = n.count_gwss;
				s.l.gwjk = n.count_gwjk;
				s.r.atcs = n.count_atcs;
			},
			'gnssD.stateData' (n) {
				n = n.data;
				this.gnssD.totalHx = n.count_gnssyp.hxyp.value;
				this.gnssD.totalZy = n.count_gnssyp.zy.value;
				this.gnssD.totalSw = n.count_gnssyp.swzp.value;
				this.gnssD.totalOther = n.count_gnssyp.qt.value;
				// 缓存，方便之后的搜索
				this.gnssD.cacheDataList = _.reduce(n.pjlist, (total, val, key, obj) => {
					total.push({
						year: key,
						data: _.reduce(val, (total, val, index, arr) => {
							total.push(Object.assign(val, {
								bigtype: this.gnssD.typeColor[val.type] || 'o'
							}))
							return total;
						}, [])
					});
					return total;
				}, []).sort(function (a, b) {
					return parseInt(b.year)-parseInt(a.year);
				})
				this.gnssD.dataList = this.gnssD.cacheDataList.slice(0);
			},
			'gnssD.dataList' (n) {
				n = n[0] && n[0].data[0] || {};
				// 详情数据改变
				this.gnssD.detail = Object.assign({}, this.gnssD.detail, n)
			}
		},
		methods: {
			initData () {
				this.apiSjgl();
				this.apiGnss();
				this.apiGwjk(1, this.pageSize);
				this.apiUs(1, this.pageSize);
				this.apiOm(1, this.pageSize);
				this.apiJp(1, this.pageSize);
				this.gwjkD.pageSize = this.pageSize;
				this.usD.pageSize = this.pageSize;
				this.omD.pageSize = this.pageSize;
				this.jpD.pageSize = this.pageSize;
			},
			recoverData () {
				// 如果 Store 没有就请求
				let s = this.ssyp;
				if (s.apiSjgl) {
					this.sjglD.stateData = s.apiSjgl;
				} else {
					this.apiSjgl(1, this.pageSize);
				}
				if (s.apiGnss) {
					this.gnssD.stateData = s.apiGnss;
				} else {
					this.apiGnss(1, this.pageSize);
				}
				if (s.apiGwjk.data.length) {
					// 从 state 中恢复表格相关数据
					this.gwjkD.table = s.apiGwjk.data.slice(0, this.pageSize).filter(d => d);
					this.gwjkD.total = s.apiGwjk.total;
				} else {
					this.apiGwjk(1, this.pageSize);
				}
				if (s.apiUs.data.length) {
					// 从 state 中恢复表格相关数据
					this.usD.table = s.apiUs.data.slice(0, this.pageSize).filter(d => d);
					this.usD.total = s.apiUs.total;
				} else {
					this.apiUs(1, this.pageSize);
				}
				if (s.apiOm.data.length) {
					// 从 state 中恢复表格相关数据
					this.omD.table = s.apiOm.data.slice(0, this.pageSize).filter(d => d);
					this.omD.total = s.apiOm.total;
				} else {
					this.apiOm(1, this.pageSize);
				}
				if (s.apiJp.data.length) {
					// 从 state 中恢复表格相关数据
					this.jpD.table = s.apiJp.data.slice(0, this.pageSize).filter(d => d);
					this.jpD.total = s.apiJp.total;
				} else {
					this.apiJp(1, this.pageSize);
				}
			},
			// 后端数据请求
			apiSjgl () {
				Axios.get(this.sjglD.api, {
					params: {
						bm: this.bm
					}
				})
				.then(res => {
					Store.commit('CompanyReport/ssypApiSjgl', this.sjglD.stateData = res.data);
				})
			},
			apiGnss () {
				Axios.get(this.gnssD.api, {
					params: {
						bm: this.bm
					}
				})
				.then(res => {
					Store.commit('CompanyReport/ssypApiGnss', this.gnssD.stateData = res.data);
				})
			},
			apiGwjk (currPage, pageSize) {
				this.gwjkD.source = Axios.CancelToken.source();
				Axios.get(this.gwjkD.api, {
					params: {
						bm: this.bm,
						page: currPage,
						pageSize: pageSize,
						// bm: 'Laboratorios Dalmer S.A.'
					},
					cancelToken: this.gwjkD.source.token
				})
				.then(res => {
					let r = res.data.data;
					if (r.res && r.res.length) {
						// 更新表格数据
						this.gwjkD.table = r.res;
						this.gwjkD.total = r.count;
						this.ssyp.apiGwjk.total = r.count;
						// 更改 state 数组长度，极度方便之后取缓存的范围计算。
						if (!this.ssyp.apiGwjk.data.length) {
							this.ssyp.apiGwjk.data.length = r.count+Math.max(...this.pageSizes);
						}
						// 缓存数据（不修改 apiGwjk 对象）
						r.res.forEach((curr, index, arr) => {
							this.ssyp.apiGwjk.data[index + (currPage - 1)*pageSize] = curr;
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			apiUs (currPage, pageSize) {
				this.usD.source = Axios.CancelToken.source();
				Axios.get(this.usD.api, {
					params: {
						bm: this.bm,
						page: currPage,
						pageSize: pageSize,
						// bm: '704676287'
					},
					cancelToken: this.usD.source.token
				})
				.then(res => {
					let r = res.data.data;
					if (r.res && r.res.length) {
						// 更新表格数据
						this.usD.table = r.res;
						this.usD.total = r.count;
						this.ssyp.apiUs.total = r.count;
						// 更改 state 数组长度，极度方便之后取缓存的范围计算。
						if (!this.ssyp.apiUs.data.length) {
							this.ssyp.apiUs.data.length = r.count+Math.max(...this.pageSizes);
						}
						// 缓存数据（不修改 apiUs 对象）
						r.res.forEach((curr, index, arr) => {
							this.ssyp.apiUs.data[index + (currPage - 1)*pageSize] = curr;
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			apiOm (currPage, pageSize) {
				this.omD.source = Axios.CancelToken.source();
				Axios.get(this.omD.api, {
					params: {
						bm: this.bm,
						page: currPage,
						pageSize: pageSize
					},
					cancelToken: this.omD.source.token
				})
				.then(res => {
					let r = res.data.data;
					if (r && r.res && r.res.length) {
						// 更新表格数据
						this.omD.table = r.res;
						this.omD.total = r.count;
						this.ssyp.apiOm.total = r.count;
						// 更改 state 数组长度，极度方便之后取缓存的范围计算。
						if (!this.ssyp.apiOm.data.length) {
							this.ssyp.apiOm.data.length = r.count+Math.max(...this.pageSizes);
						}
						// 缓存数据（不修改 apiOm 对象）
						r.res.forEach((curr, index, arr) => {
							this.ssyp.apiOm.data[index + (currPage - 1)*pageSize] = curr;
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			apiJp (currPage, pageSize) {
				this.jpD.source = Axios.CancelToken.source();
				Axios.get(this.jpD.api, {
					params: {
						bm: this.bm,
						page: currPage,
						pageSize: pageSize
					},
					cancelToken: this.jpD.source.token
				})
				.then(res => {
					let r = res.data.data;
					if (r.res && r.res.length) {
						// 更新表格数据
						this.jpD.table = r.res;
						this.jpD.total = r.count;
						this.ssyp.apiJp.total = r.count;
						// 更改 state 数组长度，极度方便之后取缓存的范围计算。
						if (!this.ssyp.apiJp.data.length) {
							this.ssyp.apiJp.data.length = r.count+Math.max(...this.pageSizes);
						}
						// 缓存数据（不修改 apiJp 对象）
						r.res.forEach((curr, index, arr) => {
							this.ssyp.apiJp.data[index + (currPage - 1)*pageSize] = curr;
						})
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			// 数据概览
			sjglZllyToggle (flag) {
				// let showNum = 5
				// let step = 1 // 每次点击左滑/右滑步数
				// let t = this.sjglD.stateData.data.count_atcs, start, end;
				// if (flag) { // next
				// 	start = this.sjglD.r.atcsPointer + step + showNum > t.length ? t.length - showNum : this.sjglD.r.atcsPointer + step;
				// } else { 	// last
				// 	start = this.sjglD.r.atcsPointer - step < 0 ? 0 : this.sjglD.r.atcsPointer - step;
				// }
				// end = start + showNum;
				// this.sjglD.r.atcsPointer = start;
				// this.sjglD.r.atcs = t.slice(start, end);
				let left = Number(_.replace($(".ul-zllygn>ul").css("left"), "px", ""))
				let ulWidth = "-" + Number($(".ul-zllygn>ul").width() - 230)
				let canScroll = !Boolean(left % 230)
				if (canScroll) {
					console.log(left);
					if (flag && left != ulWidth) {
						let changed = String(Number(_.replace(left, "px", "")) - 230) + "px"
						$(".ul-zllygn>ul").css({
							"left": changed
						})
					} else if (!flag && left != 0) {
						let changed = String(Number(_.replace(left, "px", "")) + 230) + "px"
						$(".ul-zllygn>ul").css({
							"left": changed
						})
					}
				}
			},
			// 国内上市
			gnssToggleShow (e) {
				let o = $(e.target).parent().next();
				if (o.height()) {
					// 收起
					o.height('0');
					$(e.target).removeClass('open')
				} else {
					// 展开
					o.height('auto');
					$(e.target).addClass('open')
					// 隐藏其他展开的
					$(e.target).parents('.con-box').find('ul').not(o).height('0').end().end().find('.tit i').not(e.target).removeClass('open');
				}
			},
			gnssItemDetail (obj, e) {
				this.gnssD.detail = Object.assign({}, this.gnssD.detail, obj);
				$(e.currentTarget).parents('.con-box').find('li.active').removeClass('active');
				$(e.currentTarget).parent().addClass('active');
			},
			gnssSearch () {
				// num 数组顺序需和 typeName 数组顺序对应
				let num = ['totalHx', 'totalZy', 'totalSw', 'totalOther']
				num.forEach((curr) => {
					this.gnssD[curr] = 0;
				})

				// 逻辑有点复杂，一开始就应该将 分类抽成配置，谁知道要求越来越多。。。。
				this.gnssD.dataList = this.gnssD.cacheDataList.reduce((total, curr, index, arr) => {
					let d = curr.data.reduce((tota, cur, inde, ar) => {
						// 要同时满足搜索条件 和 currBigType 的分类
						let typeName = ['化学药品', '中药', '生物制品'];
						let isOK = cur.name.search(this.gnssD.valSearch.trim()+'') >= 0 &&
								(this.gnssD.currBigType == '全部'? true : (this.gnssD.currBigType == '其他' ? (
									// 如果选中了 其他，则要排除 化学药品、生物制品、中药等
									typeName.indexOf(cur.type) == -1
								) : cur.type == this.gnssD.currBigType));

						// 搜索 和 分类筛选之后，需要更新  【 全部（70） 化学药品（38） 中药（32） 生物制品（0） 其他（0）】  括号里面的数量
						// 满足搜索条件 和 分类
						if (isOK) {
							let index = typeName.indexOf(cur.type);
							index == -1 ? this.gnssD[num[num.length-1]]++ : this.gnssD[num[index]]++;
						}

						return isOK ? tota.push(cur) && tota : tota;

					}, [])
					return d.length > 0 ? total.push({
						year: curr.year,
						data: d
					}) && total : total;
				}, [])
			},
			gnssBigType (e) {
				if (e.target.nodeName.toLowerCase() != 'ul') {
					// 点击的样式更改
					let li = $(e.target).closest('li');
					if (!li.find('.gnssSearch')[0] && ( li.find('span').text().match(/\d+/)[0] != '0' )) {
						$(e.target).closest('ul').find('li').removeClass('active');
						li.addClass('active');
						// 点击的数据更新
						this.gnssD.currBigType = li.find('.bigtype').text().split('（')[0];
						this.gnssSearch();
					}
				}
			},
			getDataListTypeNum (dl) {
				// 返回形如 this.gnssD.dataList 数据格式 中各个 type 的数量
				return dl.reduce((total, curr) => {
					curr.data.forEach((cur) => {
						if (total[cur.type]) {
							total[cur.type]++;
						} else {
							total[cur.type] = 1;
						}
					})
					return total;
				}, {})
			},
			// 国外进口
			gwjkSizeChange (size) {
				this.gwjkD.pageSize = size;
				// 如果页条数切换导致 页面总数变少，那么当前页最大不能超过最后一页。
				let currPage = Math.min(this.gwjkD.currPage, Math.ceil(this.gwjkD.total/size));
				let start = (currPage - 1)*size;
				let tmpArr = this.ssyp.apiGwjk.data.slice(start, Math.min(start+size, this.gwjkD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.gwjkD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {

					this.gwjkD.table = tmpArr;
				} else {
					this.apiGwjk(currPage, size);
				}
			},
			gwjkCurrChange (currPage) {
				this.loading1 = true
				this.gwjkD.currPage = currPage;
				let start = (currPage - 1)*this.gwjkD.pageSize;
				let tmpArr = this.ssyp.apiGwjk.data.slice(start, Math.min(start+this.gwjkD.pageSize, this.gwjkD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.gwjkD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.gwjkD.table = tmpArr;
				} else {
					this.apiGwjk(currPage, this.gwjkD.pageSize);
				}
			},
			// 美国上市
			usSizeChange  (size) {
				this.usD.pageSize = size;
				// 如果页条数切换导致 页面总数变少，那么当前页最大不能超过最后一页。
				let currPage = Math.min(this.usD.currPage, Math.ceil(this.usD.total/size));
				let start = (currPage - 1)*size;
				let tmpArr = this.ssyp.apiUs.data.slice(start, Math.min(start+size, this.usD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.usD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.usD.table = tmpArr;
				} else {
					this.apiUs(currPage, size);
				}
			},
			usCurrChange (currPage) {
				this.loading2 = true
				this.usD.currPage = currPage;
				let start = (currPage - 1)*this.usD.pageSize;
				let tmpArr = this.ssyp.apiUs.data.slice(start, Math.min(start+this.usD.pageSize, this.usD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.usD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.usD.table = tmpArr;
				} else {
					this.apiUs(currPage, this.usD.pageSize);
				}
			},
			// 欧盟上市
			omSizeChange  (size) {
				this.omD.pageSize = size;
				// 如果页条数切换导致 页面总数变少，那么当前页最大不能超过最后一页。
				let currPage = Math.min(this.omD.currPage, Math.ceil(this.omD.total/size));
				let start = (currPage - 1)*size;
				let tmpArr = this.ssyp.apiOm.data.slice(start, Math.min(start+size, this.omD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.omD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.omD.table = tmpArr;
				} else {
					this.apiOm(currPage, size);
				}
			},
			omCurrChange (currPage) {
				this.loading3 = true
				this.omD.currPage = currPage;
				let start = (currPage - 1)*this.omD.pageSize;
				let tmpArr = this.ssyp.apiOm.data.slice(start, Math.min(start+this.omD.pageSize, this.omD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.omD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.omD.table = tmpArr;
				} else {
					this.apiOm(currPage, this.omD.pageSize);
				}
			},
			// 日本上市
			jpSizeChange (size) {
				this.jpD.pageSize = size;
				// 如果页条数切换导致 页面总数变少，那么当前页最大不能超过最后一页。
				let currPage = Math.min(this.jpD.currPage, Math.ceil(this.jpD.total/size));
				let start = (currPage - 1)*size;
				let tmpArr = this.ssyp.apiJp.data.slice(start, Math.min(start+size, this.jpD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.jpD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.jpD.table = tmpArr;
				} else {
					this.apiJp(currPage, size);
				}
			},
			jpCurrChange (currPage) {
				this.loading4 = true
				this.jpD.currPage = currPage;
				let start = (currPage - 1)*this.jpD.pageSize;
				let tmpArr = this.ssyp.apiJp.data.slice(start, Math.min(start+this.jpD.pageSize, this.jpD.total));
				// 根据页码和每页条数 计算展示数据的范围，如果取值范围在缓存中 全是 有效数据，则使用缓存
				let tmp = 0;
				tmpArr.reduce(() => {tmp++},'');
				// 取消上次请求
				this.jpD.source.cancel();
				// 原理：原生的 reduce  等方法，会忽略 empty
				if (tmp == tmpArr.length) {
					this.jpD.table = tmpArr;
				} else {
					this.apiJp(currPage, this.jpD.pageSize);
				}
			},
			handleCheckItemClick (event) {
        let dom = event.target
				let index = $(dom).index()
				$(".gl-checkbox .item").removeClass("active")
				$(".gl-checkbox .item").eq(index).addClass("active")
				$(".gl .gl-item").removeClass("active")
				$(".gl .gl-item").eq(index).addClass("active")
			},
		}
	}
</script>

<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";
#ssyp {
	@conWidth: 100%;
	@Gray: #35384a;
	@Purple: #8c66b9;

	background: @White;
	box-shadow: @BoxShadowHover;
	padding: 15px 0;
	overflow: auto;

	border-radius: 4px;

	.el-table .cell {
		padding-left: 39px;
	}

	a {
		text-decoration: none;
	}
	.orange {
		background: @Orange;
	}
	.green {
		background: @Green;
	}
	.blue {
		background: @Blue;
	}
	.purple {
		background: @Purple;
	}
	.gray {
		background: @Gray;
	}
	.mt60 {
		margin-top: 60px;
	}

	.con {
		box-sizing: border-box;
		width: calc(100% - 64px);
		margin: 0px auto;
	}
	.title {
		color: @FontColorHover;
		border-bottom: 1px solid @BorderColor;
		padding-top: 0px;
		padding-bottom: 0px;
		.content {
			width: @conWidth;
			span {
				border-bottom: 3px solid @PrimaryColor;
				padding: 0 5px;
				margin-left: 32px;
				display: inline-block;
			}
		}
	}
	.gl {
		text-align: center;
		padding: 30px 0px;
		box-sizing: border-box;
		.left {
			width: 500px;
			float: left;
			li {
				display: inline-block;
				padding: 0 50px;
			}
		}
		.right {
			width: calc(100% - 520px);
			float: right;
			.ul-zllygn {
				width: calc(100% - 80px);
				height: 58px;
				position: relative;
				overflow: hidden;
				margin: 20px auto 0px auto;
				ul {
					position: absolute;
					width: 100%;
					top: 0px;
					left: 0px;
					margin: 0px!important;
					display: flex;
					justify-content: space-between;
					flex-wrap: nowrap;
					overflow: hidden;
					height: 58px;
					transition: all 200ms;
					li {
						// float: left;
						// width: 130px;
						padding: 0 5px;
						max-width: 100px;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						.right-title {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							display: block;
						}
					}
				}
			}
		}
		.gl-checkbox {
			margin: 0px auto 14px auto;
			padding: 0px 20px;
			width: 40%;
			display: flex;
			justify-content: center;
			border-bottom: 2px solid @PrimaryColor;
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
			padding: 25px 0 15px 0;
			height: 106px;
			width: 100%;
			display: none;
			&.active {
				display: block;
			}
			ul {
				display: inline-block;
				margin-top: 20px;
				display: flex;
				justify-content: space-around;
				div span {
					font-size: 24px;
					color: @PrimaryColor;
				}
			}
			.switch {
				height: 100%;width: 30px;
				top: 0;display: table;
				i {
					.fs20;
					vertical-align: middle;
					display: table-cell;
					color: @PrimaryColor;
					span {
						cursor: pointer;
					}
				}
			}
			.last i {
				transform: rotate(180deg);
			}
			.next {
				right: 0;
			}
		}
	}

	.gnss-search {
		background: @TdBackgroundColor;
		padding: 18px 0 15px 0;
		margin-top: 15px;
		ul {
			display: inline-block;
			li {
				float: left;
				margin: 0 10px;
				cursor: pointer;
				&.active, &:hover {
					i.gray {box-shadow: 0 0 0 3px rgba(84, 91, 109, .5);}
					i.green {box-shadow: 0 0 0 3px rgba(144, 195, 31, .5);}
					i.blue {box-shadow: 0 0 0 3px rgba(72, 119, 232, .5);}
					i.purple {box-shadow: 0 0 0 3px rgba(140, 102, 185, .5);}
					i.orange {box-shadow: 0 0 0 3px rgba(247, 125, 84, .5);}
				}
				.bigtype:hover {
					text-decoration: underline;
				}
			}
			li:not(:last-child) {
				line-height: 30px;
			}
			i:not(.el-input__icon) {
				width: 11px;
				height: 11px;
				border-radius: 11px;
				display: inline-block;
				vertical-align: middle;
				margin: 0 3px;
			}
			.el-input__icon {
				line-height: 30px;
				margin-right: 5px;
				cursor: pointer;
			}
			span {
				vertical-align: middle;
				cursor: pointer;
			}
		}
	}

	.gnss-con {
		margin: 8px auto 60px auto;
		display: flex;
		justify-content: center;
		.item {
			width: 50%;height: 428px;
			background: @TdBackgroundColor;
			padding: 50px 0 50px 100px;
			overflow: auto;
			border: 14px solid @TdBackgroundColor;
			border-width: 14px 0;
		}
		.left {
			.tit {
				position: relative;
				width: 133px;
				.year {
					vertical-align: middle;
					font-size: 14px;
					margin-left: 38px;
				}
				.iconfont {
					.pa;
					display: inline-block;
					color: #c3d3f6;
					transform: rotate(-90deg);
					height: 16px;line-height: 17px;
					box-shadow: 0 0 0 2px #e3ebf9;
					border-radius: 99px;
					vertical-align: middle;
					background: @ReportBackgroundColor;
					cursor: pointer;
					z-index: 10;
					right: 28px;top: 3px;
				}
				.open{
					transform:rotate(90deg);
					display: inline-block;
					color: #c3d3f6;
					height: 16px;line-height: 17px;
					box-shadow: 0 0 0 2px #e3ebf9;
					border-radius: 99px;
					vertical-align: middle;
					background: @ReportBackgroundColor;
					cursor: pointer;
					z-index: 10;
					right: 28px;top: 3px;
				}
			}
			.con-box {
				overflow: hidden;
				ul {
					color: @FontColor;
					font-size: 11px;
					line-height: 35px;
					margin: 15px 0;
				}
				li {
					&.g .date:after {.green}
					&.b .date:after {.blue}
					&.o .date:after {.orange}
					&.h .date:after {.gray}
					&.p .date:after {.purple}


					&.g.active {
						color: @Green;
						.type {
							color: @Green;
						}
					}
					&.b.active {
						color: @Blue;
						.type {
							color: @Blue;
						}
					}
					&.o.active {
						color: @Orange;
						.type {
							color: @Orange;
						}
					}
					&.h.active {
						color: @Gray;
						.type {
							color: @Gray;
						}
					}

					ul {
						overflow: hidden;
						height: 0;
					}
					&:first-child {
						.year {
							&:after {
								content: '';display: block;
								width: 1px;height: 1000000px;
								background: @BorderColor;
								position: absolute;top: 3px;right: 35px;
							}
						}
						ul {
							height: auto;
						}
					}
					&:last-child {
						.year:before {
							.pa;
							content: '';
							width: 1px;height: 1000000px;
							background: @TdBackgroundColor;
							top: 5px;right: 35px;
						}
						ul {
							margin: 0;
							li:first-child {
								margin-top: 15px;
							}
							li:last-child {
								.name:before {
									.pa;
									content: '';
									width: 1px;height: 1000000px;
									background: @BorderColor;
									bottom: 3px;left: -39px;
								}
							}
						}
					}

				}

			}
			.date {
				.ib;
				.pr;
				width: 133px;
				&:after {
					.pa;
					content: '';display: inline-block;
					width: 9px;height: 9px;
					border-radius: 9px;background: #f00;
					position: absolute;right: 31px;top: 50%;margin-top: -4.5px;
					z-index: 10;
				}
			}
			.name {
				.fs13;
				margin-right: 10px;
				position: relative;
				cursor: pointer;
				&:hover {
					text-decoration: underline;
				}
			}
			.type {
				color: @FontColor3;
			}
		}
		.right {
			td:first-child {
				.fs13;
				width: 117px;
				color: @FontColor2;
				line-height: 28px;
				+ td {
					.fs14;
					color: @FontColor;
				}
			}
			.msg {
				.fb;
				.fs14;
				color: @PrimaryColor!important;
			}
			td.name {
				.fs20;
				color: @Green;
				line-height: 46px;
				&.g {
					color: @Green;
					&:before {
						.green
					}
				}
				&.b {
					color: @Blue;
					&:before {
						.blue
					}
				}
				&.o {
					color: @Orange;
					&:before {
						.orange
					}
				}
				&.h {
					color: @Gray;
					&:before {
						.gray
					}
				}
				&.p {
					color: @Purple;
					&:before {
						.purple
					}
				}
			}
			td.name:before {
				.vm;
				content: '';
				display: inline-block;
				width: 9px;height: 9px;
				background: @Green;
				border-radius: 9px;
				margin-right: 10px;
			}
		}
	}

	.table-box {
		.iconA{background:url(/static/imgs/companyreport/scxs/iconA.png)  no-repeat;display: inline-block;margin-right: 3px;}
		.iconA2{height:17px;width:17px;background-position:0 0;}
		.iconA0{height:13px;width:20px;background-position:-17px 0;}
		.iconA1{height:13px;width:21px;background-position:-37px 0;}

		.msg {
			margin: 35px auto 12px auto;
			width: 1508px;
			.txt {
				vertical-align: -1px;
			}
		}
	}

}
</style>
