<template>
<div id="ypxs">
  <!-- 药品销售数据 -->
  <div class="ypxs">
    <div class="title fs14">
      <div class="content">
        <span class="vm">药品销售数据</span>
      </div>
    </div>
    <!-- 药品销售数据 - 图表（1） -->
    <div class="charts ma" ref="echarts_ypxs">
    </div>
    <!-- 药品销售数据 - 导出按钮 -->
    <div class="con clearfix">
      <a class="fr">
        <i class="iconfont vm">&#xe605;</i>
        导出
      </a>
    </div>
    <!-- 药品销售数据 - 表格 -->
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading1" v-if="loading1" :delayTime="0"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <el-table
      :data="ypxsListData.res"
      stripe
      fixed
      class="table"
      style="width: 100%"
      v-else>
      <el-table-column
        v-for="item in tableHead1"
        :prop="item.prop"
        :min-width="item.width"
        :key="item.prop"
        :label="item.label">
          <template slot-scope="scope">
            <!-- <div v-if="item.prop === 'fenxizhanshi'">
              <el-checkbox 
                :label="1"
                checked>
              </el-checkbox>
            </div> -->
            <div v-if="item.prop === 'shangpinming'">
              {{ scope.row.brandname }}
            </div>
            <div v-if="item.prop === 'tongyongming'">
              {{ scope.row.name }}
            </div>
            <div v-if="item.prop === 'cntongyongming'">
              {{ scope.row.cname }}
            </div>
            <div v-if="item.prop === 'xiaoshoue'">
              {{ scope.row.value }}
            </div>
            <div v-if="item.prop === 'nianfen'">
              {{ scope.row.year }}
            </div>
          </template>
      </el-table-column>
    </el-table>
    <!-- 药品销售数据 - 分页栏 -->
    <el-pagination
      v-if="ypxsListData.count > 10"
      @current-change="handleCurrentChange1"
      :current-page="oneParam.page"
      :page-size="oneParam.pageSize"
      layout="total, prev, pager, next"
      :total="ypxsListData.count">
    </el-pagination>
  </div>
  <!-- 生物制品销售数据 -->
  <div class="swzp" v-if="showSwzp">
    <div class="title fs14">
      <div class="content">
        <span class="vm">生物制品销售数据</span>
      </div>
    </div>
    <!-- 生物制品销售数据 - 图表（2） -->
    <div class="see-data tc">
      <div class="item ib" ref="echarts_xstj"></div>
      <div class="right-two">
        <div class="check-box">
          <div class="item active" @click="handleCheckItemClick">销量</div>
          <div class="item" @click="handleCheckItemClick">销售额</div>
        </div>
        <div class="item ib ec_active" ref="echarts_xl"></div>
        <div class="item ib" ref="echarts_xse"></div>
      </div>
    </div>
    <!-- 生物制品销售数据 - 导出按钮 -->
    <div class="con clearfix">
      <a class="fr">
        <i class="iconfont vm">&#xe605;</i>
        导出
      </a>
    </div>
    <!-- 生物制品销售数据 - 表格 -->
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'list-in-loading'" :classNameImg="'little-size-loading'" :loadFlag="loading2" v-if="loading2" :delayTime="0"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <el-table
      :data="swzpListData.res"
      stripe
      fixed
      class="table"
      style="width: 100%"
      v-else>
      <el-table-column
        v-for="item in tableHead2"
        :prop="item.prop"
        :min-width="item.width"
        :key="item.prop"
        :label="item.label">
          <template slot-scope="scope">
            <div v-if="item.prop === 'yaopinmingcheng'">
              {{ scope.row.name }}
            </div>
            <div v-if="item.prop === 'guige'">
              {{ scope.row.guige }}
            </div>
            <div v-if="item.prop === 'xiaoliang'">
              {{ scope.row.piliang }}
            </div>
            <div v-if="item.prop === 'danwei'">
              {{ scope.row.packaging }}
            </div>
            <div v-if="item.prop === 'pihao'">
              {{ scope.row.pihao }}
            </div>
            <div v-if="item.prop === 'qianfariqi'">
              {{ scope.row.date }}
            </div>
            <div v-if="item.prop === 'youxiaoqi'">
              {{ scope.row.youxiaoqi }}
            </div>
          </template>
      </el-table-column>
    </el-table>
    <!-- 生物制品销售数据 - 分页栏 -->
    <el-pagination
      v-if="swzpListData.count > 10"
      @current-change="handleCurrentChange2"
      :current-page="twoParam.page"
      :page-size="twoParam.pageSize"
      layout="total, prev, pager, next"
      :total="swzpListData.count">
    </el-pagination>
  </div>
</div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import tablehead from '@/config/tablehead'
const oneHead = tablehead.companyreport.DetailYpsx1
const twoHead = tablehead.companyreport.DetailYpsx2
  export default {
    components: {
      LoadingGif
    },
    data () {
      return {
        bm: Store.state.CompanyReport.bm, // 企业编码
        tableHead1: oneHead, // 药品销售 表头
        tableHead2: twoHead, // 生物制品 表头
        ypxsEchartsData: [], // 药品销售 Echarts api数据
        ypxsEchartsListData: {}, // 药品销售 Echarts List api数据
        ypxsListData: {}, // 药品销售 List api数据
        swzpXlEchartsData: [], // 生物制品 echarts api数据
        swzpXsEchartsData: [],
        swzpListData: {}, // 生物制品 list api数据
        oneParam: { // 药品销售 额外参数
          pageSize: 10,
          page: 1,
        },
        twoParam: { // 生物制品 额外参数
          pageSize: 10,
          page: 1,
        },
        // echarts数据
        // ypxs - 药品销售
        ypxs_xdata: [],
        ypxs_types: [],
        ypxs_data: [],
        // sxtj - 销售统计
        xstj_xdata: [],
        xstj_ydata1: [],
        xstj_ydata2: [],
        // 销量占比
        xl_data: [],
        // 销售额占比
        xse_data: [],
        loading1: true,
        loading2: true,
        // 物制品销售数据是否显示
      }
    },
    computed: {
      showSwzp () {
        let bol = false
        if (this.swzpXlEchartsData.length || this.swzpXsEchartsData.length || this.swzpListData.count) {
          bol = true
        }
        return bol
      }
    },
    watch: {
      
    },
    methods: {
      async handleYpxsEcharts () {
        await window.Axios({
					method: 'get',
					url: '/api/company/ypxs',
					params: _.assign({
						bm: this.bm
					})
				}).then(res => {
					if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.ypxsEchartsData = data.GroupList
            this.ypxsEchartsListData = data.List
					}
				}).catch((err) => {
					console.log(err)
        })
        this.handleYpxsData()
        this.drawYpxsMix()
      },
      // 获取数据等
      handleAxiosYpsx () {
        window.Axios({
					method: 'get',
					url: '/api/company/ypxs',
					params: _.assign({
						bm: this.bm
					}, this.oneParam)
				}).then(res => {
					if (res.data.code === 200 && res.data) {
            this.loading1 = false
            let data = res.data.data
						this.ypxsListData = data.List
					}
				}).catch((err) => {
					console.log(err)
        })
      },
      async handleAxiosSwzp () {
        await window.Axios({
					method: 'get',
					url: '/api/company/ypxsswzp',
					params: _.assign({
            bm: this.bm
            // bm: 'SANOFI PASTEUR S.A.' // 有数据的示例编码号
					})
				}).then(res => {
					if (res.data.code === 200 && res.data) {
						let data = res.data.data
            this.swzpXlEchartsData = data.GroupList.xl
            this.swzpXsEchartsData = data.GroupList.xs
					}
				}).catch((err) => {
					console.log(err)
        })
        this.handleSwzpData ()
      },
      handleAxiosSwzpList () {
        window.Axios({
					method: 'get',
					url: '/api/company/ypxsswzplist',
					params: _.assign({
            bm: this.bm
            // bm: 'SANOFI PASTEUR S.A.' // 有数据的示例编码号
					}, this.twoParam)
				}).then(res => {
          this.loading2 = false
					if (res.data.code === 200 && res.data) {
						let data = res.data.data
						this.swzpListData = data
					}
				}).catch((err) => {
					console.log(err)
        })
      },
      // 处理 药品销售 数据
      async handleYpxsData () {
        let echartsData = this.ypxsEchartsData
        let listData = this.ypxsEchartsListData

        // 按照年份（year）倒序排列
        let sortedList = listData.res
				for (let index in sortedList) {
					for (let i = 0; i < index; i++) {
						if (sortedList[index].year > sortedList[i].year) {
							let zdYear = sortedList[index].year // 暂存的year值
              let zdBn = sortedList[index].brandname // 暂存的值
              let zdCn = sortedList[index].cname // 暂存的值
              let zdName = sortedList[index].name // 暂存的值
              let zdValue = sortedList[index].value // 暂存的值
							// 下面做替换
							sortedList[index].year = sortedList[i].year
              sortedList[index].brandname = sortedList[i].brandname
              sortedList[index].cname = sortedList[i].cname
              sortedList[index].name = sortedList[i].name
              sortedList[index].value = sortedList[i].value
							sortedList[i].year = zdYear
              sortedList[i].brandname = zdBn
              sortedList[i].cname = zdCn
              sortedList[i].name = zdName
              sortedList[i].value = zdValue
						}
					}
        }
        
        // TODO:处理出药品销售数据的echarts所需数据
        for (let item of echartsData) {
          this.ypxs_xdata.push(item.year)
        }
        
        let allRes = [] // 用于存储最终的serie数据
        let typeArr = [] // 去重前 - 暂存（this.ypxs_types储存去重后的种类）
        for (let item of listData.res) {
          typeArr.push(item.cname)
        }

        // 去重
        for(let i = 0; i < typeArr.length; i++){
          for(let j = i + 1; j < typeArr.length; j++){
            if (typeArr[i] === typeArr[j]){
              j = ++i;
            }
          }
          this.ypxs_types.push(typeArr[i])
        }

        // 将echarts中serie所需的数组数据处理出来
        for (let i = 0; i < this.ypxs_types.length; i++) {
          let pushArr = new Array(this.ypxs_xdata.length)
          
          for (let k = 0; k < pushArr.length; k++) {
            pushArr[k] = 0
          }
          
          for (let j = 0; j < this.ypxs_xdata.length; j++) {
            for (let item of listData.res) {
              if (item.cname == this.ypxs_types[i] && item.year == this.ypxs_xdata[j]) {
                pushArr.splice(j, 1, Number(item.value))
              } 
            }
          }
          
          let serieObj = {
            name: this.ypxs_types[i],
            type: 'bar',
            stack: '总量',
            data: pushArr,
          }
          this.ypxs_data.push(serieObj)
        }

        // 处理出同比增长率的数据
        let tongbiArr = []
        for (let item of echartsData) {
          let arr = item.data.split(';')
          let xse = 0
          for (let item1 of arr) {
            xse += Number(item1.split('=')[1])
          }
          tongbiArr.push(xse)
        }

        let tongbiData = [,] // 英文逗号不要删，把持index=0时为empty
        for (let index in tongbiArr) {
          if (index > 0) {
            let tongbiRate = ((tongbiArr[index] - tongbiArr[index - 1]) / tongbiArr[index - 1]) * 100
            tongbiData.push(tongbiRate.toFixed(2))
          }
        }
        
        this.ypxs_data.push({
          name: '同比（%）',
          type: 'line',
          color: '#4095c8',
          yAxisIndex: 1,
          data: tongbiData,
        })
      },
      // 处理 生物制品（销售统计、销量、销售额） 数据
      handleSwzpData () {
        // 销售统计 - 处理
        for (let item of this.swzpXsEchartsData) {
          this.xstj_xdata.push(item.date)
          this.xstj_ydata1.push(item.piliang)
          this.xstj_ydata2.push(item.total)
        }

        // 销量 - 处理
        for (let item of this.swzpXlEchartsData) {
          let obj = {
            "value": Number(item.piliang),
            "name": item.name
          }
          this.xl_data.push(obj)
        }
        // 销售额 - 处理
        for (let item of this.swzpXsEchartsData) {
          let obj = {
            "value": Number(item.total),
            "name": item.date
          }
          this.xse_data.push(obj)
          
        }
        
        this.drawXstjMix()
        this.drawXlBar()
        // this.drawXseBar()
      },
      // 药品销售数据 - 柱状图&折线图（混合）
      drawYpxsMix () {
        Echarts.init(this.$refs.echarts_ypxs, 'yaozh_theme').setOption({
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid:{
            show: false,
            containLabel: true,
            // top: 10,
            // bottom: 90,
          },
          legend: {
            data: this.ypxs_types,
            bottom: 30,
            padding: [40, 50, 0, 50],
            type: 'scroll',
          },
          xAxis: {
            name: '销售年份',
            nameLocation: 'center',
            nameTextStyle: {
              padding: [10, 0, 0, 0]
            },
            type: 'category',
            data: this.ypxs_xdata,
          },
          yAxis:  [
            {
              type: 'value',
              name: '销售额（万元/RMB）',
              nameLocation: 'center',
              nameTextStyle: {
                padding: [0, 0, 30, 0]
              },
              axisLabel: {
                formatter: (value) => {
                  return value / 1000 + 'k'
                }
              },
            },
            {
              type: 'value',
              name: '同比（%）',
              nameLocation: 'center',
              nameTextStyle: {
                padding: [30, 0, 0, 0]
              },
              axisLabel: {
                formatter: (value) => {
                  return value + '%'
                }
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              }
            }
          ],
          series: this.ypxs_data,
          // title: {
          //   text: "国内临床试验",
          //   x: "center",
          //   bottom: 0,
          //   textStyle: {
          //     fontSize: "12",
          //     color: "#646A7A"
          //   },
          //   fontSize: "8"
          // },
          fontSize: "14",
        })
      },
      // 销售统计（年统计） - 柱状图&折线图（混合）
      drawXstjMix () {
        Echarts.init(this.$refs.echarts_xstj, 'yaozh_theme').setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            }
          },
          grid:{
            show: false,
            containLabel: true,
            // top: 10,
            // bottom: 70,
          },
          legend: {
            data:[
              {
                name: '销量（瓶（支））',
                icon: 'circle'
              },
              {
                name: '销售额（万元）',
              }
            ],
            bottom: 20,
          },
          xAxis: [
            {
              type: 'category',
              data: this.xstj_xdata,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '销量（瓶（支））',
              axisLabel: {
                formatter: function(value) {
                  return value / 1000000 + 'M'
                },
              },
            },
            {
              type: 'value',
              name: '销售额（万元）',
              axisLabel: {
                formatter: function(value) {
                  return value / 1000000 + 'M'
                },
              },
              splitLine: {
                show: false,
              }
            }
          ],
          series: [
            {
              name:'销量（瓶（支））',
              type:'bar',
              barWidth: 20,
              data:this.xstj_ydata1,
            },
            {
              name:'销售额（万元）',
              type:'line',
              yAxisIndex: 1,
              data:this.xstj_ydata2,
            }
          ],
          title: {
            text: "研发投入",
            x: "center",
            bottom: 0,
            textStyle: {
              fontSize: "12",
              color: "#646A7A"
            },
            fontSize: "8"
          },
          fontSize: "14",
        })
      },
      // 销量占比 - 饼形图
      drawXlBar () {
        Echarts.init(this.$refs.echarts_xl, 'yaozh_theme').setOption({
          tooltip: {
            trigger: "item",
            formatter: "{b}:{d}%"
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              avoidLabelOverlap: false,
              center: "50%",
              label: {
                normal: {
                  formatter: "{b}{d}%"
                }
              },
              data: this.xl_data,
            }
          ],
          title: {
            text: "销量占比",
            x: "center",
            bottom: "20px",
            textStyle: {
              fontSize: "12",
              color: "#646A7A"
            },
            fontSize: "8"
          },
          fontSize: "14"
        })
      },
      // 销售额占比 - 饼形图
      drawXseBar () {
        Echarts.init(this.$refs.echarts_xse, 'yaozh_theme').setOption({
          tooltip: {
            trigger: "item",
            formatter: "{b}:{d}%"
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              avoidLabelOverlap: false,
              center: "50%",
              label: {
                normal: {
                  formatter: "{b}{d}%"
                }
              },
              data: this.xse_data,
            }
          ],
          title: {
            text: "销售额占比",
            x: "center",
            bottom: "20px",
            textStyle: {
              fontSize: "12",
              color: "#646A7A"
            },
            fontSize: "8"
          },
          fontSize: "14"
        })
      },

      // pageSize 改变时会触发
			handleSizeChange1(val) {
        this.loading1 = true
				this.oneParam.pageSize = val
				this.handleAxiosYpsx()
			},
			// currentPage 改变时会触发
			handleCurrentChange1(val) {
        this.loading1 = true
				this.oneParam.page = val
				this.handleAxiosYpsx()
      },
      // pageSize 改变时会触发
			handleSizeChange2(val) {
        this.loading2 = true
				this.twoParam.pageSize = val
				this.handleAxiosSwzpList()
			},
			// currentPage 改变时会触发
			handleCurrentChange2(val) {
        this.loading2 = true
				this.twoParam.page = val
				this.handleAxiosSwzpList()
      },
      // checkbox 点击事件
      handleCheckItemClick (event) {
        let dom = event.target
        let text = dom.innerText
        if (text.indexOf('销量') !== -1) {
          $('.right-two .check-box .item').removeClass('active')
          $('.right-two .check-box .item').eq(0).addClass('active')
          $('.right-two>.item').removeClass('ec_active')
          $('.right-two>.item').eq(0).addClass('ec_active')
          this.drawXlBar()
        } else if (text.indexOf('销售额') !== -1) {
          $('.right-two .check-box .item').removeClass('active')
          $('.right-two .check-box .item').eq(1).addClass('active')
          $('.right-two>.item').removeClass('ec_active')
          $('.right-two>.item').eq(1).addClass('ec_active')
          this.drawXseBar()
        }
      },
    },
    created () {
      this.handleAxiosYpsx()
      this.handleYpxsEcharts()
      this.handleAxiosSwzp()
      this.handleAxiosSwzpList()
    },
    mounted () {
      
    },
  }
</script>

<style lang="less">
  @import "~@/assets/less/var.less";
  @import "~@/assets/less/app.less";

  #ypxs {
    @conWidth: 100%;
    background: @White;
    box-shadow: @BoxShadowHover;
    padding-bottom: 50px;
    
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
    .el-checkbox__label {
      display: none;
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
        span {
          border-bottom: 3px solid @PrimaryColor;
          padding: 0 5px;
          display: inline-block;
        }
      }
    }
    // 药品销售数据
    .ypxs {
      .charts {
        width: 888px;
        height: 444px;
      }
    }
    // 生物制品
    .swzp {
      .see-data {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        height: 355px;
        &>.item {
          min-width: 45%;
          height: 100%;
          margin: 0 30px;
        }
        .right-two {
          min-width: 45%;
          height: 322px;
          margin: 0 30px;
          position: relative;
          padding-top: 33px;
          .check-box {
            width: 60%;
            height: 30px;
            border-bottom: 3px solid @PrimaryColor;
            position: absolute;
            top: 0;
            left: 20%;
            display: flex;
            justify-content: center;
            .item {
              width: 100%;
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
            width: 100%;
            height: 100%;
            &.ec_active {
              display: block!important;
            }
          }
        }
      }
    }

  }

</style>
