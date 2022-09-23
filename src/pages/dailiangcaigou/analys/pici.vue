<template>
  <!-- 带量采购精准分析-批次分析 -->
  <div class="pici-analy">
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'db-index-loading'" :loadFlag="analyLoading" v-if="analyLoading"></LoadingGif>
    <template>
      <div class="title">批次分析</div>
      <!-- 批次信息基本数据模块 -->
      <div class="info" v-if="showTotal">
        <!-- 批次筛选模块 -->
        <div class="select-wrap">
          <span class="select-text">{{ selectValue }}</span>
          <div>
            <span>批次：</span>
            <el-select v-model="selectValue" placeholder="请选择批次" @change="changeValue" :popper-append-to-body="false">
              <el-option v-for="(option, index) in optionsValue" :key="index" :title="option" :label="option"
                :value="option">
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- 批次信息模块 -->
        <div class="pici-info">
          <ul class="total-item">
            <li class="li1">采购品种</li>
            <li class="li2">总计<span class="f24">{{ piciData.purchase_varieties }}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">中选品种</li>
            <li class="li2">总计<span class="f24">{{ piciData.selected_varieties }}</span>个</li>
            <li class="li2">中选率：<span>{{ piciData.winning_rate }}</span></li>
          </ul>
          <ul class="total-item">
            <li class="li1">流标品种</li>
            <li class="li2">总计<span class="f24">{{ piciData.stream_selection }}</span>个</li>
            <li class="li2">流标率：<span>{{ piciData.stream_selection_rate }}</span></li>
            <li v-if="piciData.stream_selection"><span class="look" @click="handleLook">查看品种</span></li>
          </ul>
          <ul class="total-item">
            <li class="li1">中选企业</li>
            <li class="li2">总计<span class="f24">{{ piciData.selected_companies }}</span>个</li>
            <li class="li2">
              {{ piciData.most_selected_companies }}最多<br>共<span>{{ piciData.most_selected_companies_nums }}</span>个品种
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">平均降幅</li>
            <li class="li2"><span class="f24">{{ piciData.average_drop }}</span></li>
            <!-- 环比为空的时候不显示 -->
            <li class="li2" v-if="piciData.average_drop_month_on_month">
              环比（{{ piciData.average_drop_pici }}）<br>{{ averageText }}<span>{{ piciData.average_drop_month_on_month
                }}</span>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">最高降幅品种
              <el-tooltip class="item tooltips-position" effect="light" placement="right">
                <div slot="content">上海试点、4+7试点、4+7扩围，部分中选产品无最高申报限价</div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </li>
            <!-- 降幅为空的时候不显示 -->
            <li class="li2" v-if="piciData.highest_rate_of_decrease">{{ piciData.the_name_of_the_highest_drop_drug }}
            </li>
            <li class="li2" v-if="piciData.highest_rate_of_decrease">
              {{ piciData.name_of_the_company_with_the_highest_decline }}<br>中选价：<span>{{
                piciData.the_highest_price_drop
                }}</span>元<br>降幅：<span>{{ piciData.highest_rate_of_decrease }}</span>
            </li>
          </ul>
          <ul class="total-item">
            <li class="li1">最低降幅品种</li>
            <li class="li2">{{ piciData.name_of_the_lowest_drop_drug }}</li>
            <li class="li2">
              {{ piciData.minimum_decrease_company_name }}<br>中选价：<span>{{ piciData.the_lowest_price_drop
                }}</span>元<br>降幅：<span>{{ piciData.minimum_rate_of_decrease }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="no-info" v-else>
        <img src="../../../../static/imgs/nodata.png" alt="">
      </div>

      <!-- 最低中选单价模块（条形图） -->
      <div class="chart-wrap" v-waiting="Object.keys(zdzxOption).length === 0">
        <div class="chart-title">
          <span class="text">最低中选单价</span>
          <el-tooltip class="item tooltips-position" effect="light" placement="right">
            <div slot="content">按最小制剂单位（元/片、粒、袋、支）</div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </div>
        <i-echart v-if="Object.keys(zdzxOption).length > 0" :option="zdzxOption" class="echarts-container1"
          :width="width" :height="900"></i-echart>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>

      <!-- 药品降幅排行模块（条形图） -->
      <div class="chart-wrap" v-waiting="Object.keys(ypjfOption).length === 0">
        <div class="chart-title">
          <span class="text">药品降幅排行</span>
          <el-tooltip class="item tooltips-position" effect="light" placement="right">
            <div slot="content">1、降幅由高到低，前20 <br> 2、4+7试点和扩围降幅计算规则为对比前三年平均价，结果供参考</div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </div>
        <i-echart v-if="Object.keys(ypjfOption).length > 0" :option="ypjfOption" class="echarts-container1"
          :width="width" :height="900"></i-echart>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>

      <!-- 品种最高降幅模块（柱状图） -->
      <div class="chart-wrap" v-waiting="Object.keys(pzzgjfOption).length === 0">
        <div class="chart-title">
          <span class="text">品种最高降幅</span>
          <el-tooltip class="item tooltips-position" effect="light" placement="right">
            <div slot="content">1、不同品种的最高降幅排名 <br> 2、4+7试点和扩围降幅计算规则为对比前三年平均价，结果供参考</div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
        </div>
        <i-echart v-if="Object.keys(pzzgjfOption).length > 0" :option="pzzgjfOption" class="echarts-container2"
          :width="width" :height="600"></i-echart>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>

      <!-- 企业中选品种数模块（堆叠图） -->
      <div class="chart-wrap" v-waiting="Object.keys(qyzxOption).length === 0">
        <div class="chart-title">
          <span class="text">企业中选品种数</span>
        </div>
        <i-echart v-if="Object.keys(qyzxOption).length > 0" :option="qyzxOption" class="echarts-container2"
          :width="width" :height="600"></i-echart>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>

      <!-- 企业所属省市中选品种数（堆叠图） -->
      <div class="chart-wrap" v-waiting="Object.keys(qyssOption).length === 0">
        <div class="chart-title">
          <span class="text">企业所属省市中选品种数</span>
        </div>
        <i-echart v-if="Object.keys(qyssOption).length > 0" :option="qyssOption" class="echarts-container2"
          :width="width" :height="600"></i-echart>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>

      <!-- 剂型分布（堆叠图、饼图） -->
      <div class="chart-wrap" v-waiting="Object.keys(jxfbBarOption).length === 0">
        <div class="chart-title">
          <span class="text">剂型分布</span>
        </div>
        <div class="chart-box" v-if="Object.keys(jxfbBarOption).length > 0">
          <!-- 堆叠图 -->
          <i-echart v-if="Object.keys(jxfbBarOption).length > 0" :option="jxfbBarOption" class="echarts-container3"
            :width="(width - 20) / 2" :height="700"></i-echart>
          <!-- 饼图 -->
          <i-echart v-if="Object.keys(jxfbPieOption).length > 0" :option="jxfbPieOption" class="echarts-container3"
            :width="(width - 20) / 2" :height="700"></i-echart>
        </div>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>

      <!-- ATC分类（堆叠图、饼图） -->
      <div class="chart-wrap" v-waiting="Object.keys(atcBarOption).length === 0">
        <div class="chart-title">
          <span class="text">ATC分类</span>
        </div>
        <div class="chart-box" v-if="Object.keys(atcBarOption).length > 0">
          <!-- 堆叠图 -->
          <i-echart v-if="Object.keys(atcBarOption).length > 0" :option="atcBarOption" class="echarts-container3"
            :width="(width - 20) / 2" :height="700"></i-echart>
          <!-- 饼图 -->
          <i-echart v-if="Object.keys(atcPieOption).length > 0" :option="atcPieOption" class="echarts-container3"
            :width="(width - 20) / 2" :height="700"></i-echart>
        </div>
        <div class="shadow" v-else>
          <img src="../../../../static/imgs/nodata.png" alt="">
        </div>
      </div>
    </template>

    <!-- 流标品种列表弹窗 -->
    <el-dialog :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="800px">
      <div slot="title" class="dialog-header">
        流标品种
      </div>
      <el-table :data="lbData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe fixed>
        <el-table-column prop="name" label="药品名称" width="200"></el-table-column>
        <el-table-column prop="type" label="批次"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <!-- <el-table-column label="药品中标精准分析" align="center" width="160">
          <template slot-scope="scope">
            <div style="color: #4877E8;text-decoration: underline;cursor: pointer" @click="goYpzb(scope.row.name)">查看</div>
          </template>
        </el-table-column>
        <el-table-column label="一致性评价进度分析" align="center" width="160">
          <template slot-scope="scope">
            <div style="color: #4877E8;text-decoration: underline;cursor: pointer" @click="goYzxpj(scope.row.name)">查看</div>
          </template>
        </el-table-column> -->
      </el-table>
      <div style="positon: relative;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import iEchart from './components/i-echarts'
export default {
  components: {
    LoadingGif,
    iEchart
  },
  data() {
    return {
      showTotal: true,
      width: window.innerWidth - 340,
      selectValue: '', // 当前选中项value
      optionsValue: [], // 批次选项框数据
      analyLoading: true, // 控制loading组件显示隐藏，默认为true
      piciData: {}, // 顶部批次基础数据
      averageText: '下降', // 平均降幅下降或上升的文字显示
      lbData: [], // 流标数据列表
      currentPage: 1, // 流标列表前端分页
      pageSize: 10, // 流标列表前端分页size
      total: 0, // 流标列表总条数
      dialogTableVisible: false, // 控制流标品种弹窗显示隐藏，默认为false
      zdzxOption: {}, // 最低中选单价配置项
      ypjfOption: {}, // 药品降幅配置项
      pzzgjfOption: {}, // 品种最高降幅配置项
      qyzxOption: {}, // 企业中选品种数配置项
      qyssOption: {}, // 企业所属省市中选品种数
      jxfbBarOption: {}, // 剂型分布堆叠图配置项
      jxfbPieOption: {}, // 剂型分布饼状图配置项
      atcBarOption: {}, // atc分类堆叠图配置项
      atcPieOption: {}, // atc分类饼状图配置项
      // 窗口大小调整事件
      windowResizeEvent: _.throttle(() => {
        this.width = window.innerWidth - 340
        this.echartsResize('echarts')
      }, 500),
    }
  },
  mounted() {
    window.addEventListener('resize', this.windowResizeEvent)
    this.getPiciOption()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.windowResizeEvent)
  },
  methods: {
    // 获取批次下拉选项
    getPiciOption() {
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/batchAnalysisList",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          // 初始下拉选项赋值
          this.selectValue = res.data.data.res[0]
          // 前端加上全部批次选项 模板为（全部（共n个批次））
          res.data.data.res.unshift(`全部（共${res.data.data.res.length}个批次）`)
          // 下拉选项赋值
          this.optionsValue = res.data.data.res
          this.getPiciData()
          this.getZdzxData()
          this.getYpjfData()
          this.getPzzgjfData()
          this.getqyzxData()
          this.getqyssData()
          this.getjxfbData()
          this.getAtcData()
        }
      })
    },

    // 获取顶部批次基础数据
    getPiciData() {
      this.analyLoading = true
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/batchAnalysis",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        // 请求完成将analyLoading改为false
        this.analyLoading = false
        if (res.data.code === 200 && res.data.data) {
          // 处理平均降幅环比上一期是上升还是下降，下降：负数，上升：正数，取绝对值
          if (res.data.data.average_drop_month_on_month) {
            let index = res.data.data.average_drop_month_on_month.indexOf('%')
            let average = res.data.data.average_drop_month_on_month.substring(0, index)
            if (parseFloat(average) <= 0) {
              this.averageText = '下降'
              res.data.data.average_drop_month_on_month = `${Math.abs(average)}%`
            } else {
              this.averageText = '上升'
              res.data.data.average_drop_month_on_month = `${Math.abs(average)}%`
            }
          }
          // 批次基础数据赋值
          this.piciData = res.data.data
          this.showTotal = Object.keys(this.piciData).length > 0
        }
      }).catch(err => {
        this.analyLoading = false
        this.showTotal = false
      })
    },

    // 批次选项框选项值改变事件
    changeValue(val) {
      this.selectValue = val
      this.getPiciData()
      this.getZdzxData()
      this.getYpjfData()
      this.getPzzgjfData()
      this.getqyzxData()
      this.getqyssData()
      this.getjxfbData()
      this.getAtcData()
    },

    // 获取流标品种数据
    handleLook() {
      this.dialogTableVisible = true
      // 数据重置
      this.lbData = []
      this.total = 0
      this.currentPage = 1
      this.pageSize = 10
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/stream_selection_list",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          // console.log(res.data.data)
          // 批次基础数据赋值
          this.lbData = res.data.data
          this.total = res.data.data.length
        }
      })
    },

    // 获取最低中选单价数据
    getZdzxData() {
      this.analyLoading = true
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.zdzxOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/lowestSelectedUnitPrice",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        this.analyLoading = false
        if (res.data.code === 200 && res.data.data) {
          // console.log(res.data.data)
          let yAxisData = [] // y轴数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成条形图需要的数据
          res.data.data.map(item => {
            let obj = {}
            obj.value = item.zhongxuanpinzhongdanjia
            obj.type = item.type
            yAxisData.unshift(`${item.guifanname}(${item.guifanguige})\n${item.guifanqiyezhongbiao}`)
            xAxisData.unshift(obj)
          })
          console.log(yAxisData)
          // 最低中选单价配置项
          this.zdzxOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
            },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-最低中选单价',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            grid: {
              containLabel: true,
              left: '6%',
              right: '15%',
              top: '6%',
              bottom: '5%',
            },
            xAxis: {
              type: 'value',
              name: '单位（元）',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: yAxisData,
            },
            series: [
              {
                name: '单位（元）',
                label: {
                  show: true,
                  position: 'right',
                  formatter: function (params) {
                    return `${params.value} （${params.data.type}）`
                  }
                },
                type: 'bar',
                data: xAxisData
              }
            ]
          }
        }
      }).catch(err => {
        this.analyLoading = false
      })
    },

    // 获取药品降幅排行数据
    getYpjfData() {
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.ypjfOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/drugDeclineRanking",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          // console.log(res.data.data)
          let yAxisData = [] // y轴数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成条形图需要的数据
          res.data.data.map(item => {
            let obj = {}
            obj.value = item.jiangfu
            obj.type = item.type
            yAxisData.unshift(`${item.guifanname}(${item.guifanguige})\n${item.guifanqiyezhongbiao}`)
            xAxisData.unshift(obj)
          })
          // 药品降幅配置项
          this.ypjfOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
            },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-药品降幅排行',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            grid: {
              containLabel: true,
              left: '6%',
              right: '15%',
              top: '6%',
              bottom: '5%',
            },
            xAxis: {
              type: 'value',
              name: '降幅',
              boundaryGap: [0, 0.01],
              axisLabel: {
                show: true,
                // interval: 'auto',
                formatter: '{value} %'
              },
            },
            yAxis: {
              type: 'category',
              data: yAxisData,
            },
            series: [
              {
                name: '降幅（%）',
                label: {
                  show: true,
                  position: 'right',
                  formatter: function (params) {
                    return `${params.value}% （${params.data.type}）`
                  }
                },
                type: 'bar',
                data: xAxisData
              }
            ]
          }
        }
      })
    },

    // 获取品种最高降幅数据
    getPzzgjfData() {
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.pzzgjfOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/highestDrop",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          // console.log(res.data.data)
          let yAxisData = [] // y轴数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成条形图需要的数据
          res.data.data.map(item => {
            yAxisData.push(item.guifanname)
            xAxisData.push(item.jiangfu)
          })
          // 品种最高降幅配置项
          this.pzzgjfOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            // legend: {
            //   top: 20,
            //   data: ['降幅']
            // },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-品种最高降幅',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            dataZoom: [{
              id: 'dataZoomX',
              show: true,
              startValue: 0,
              endValue: 19,
              zoomOnMouseWheel: true,
              moveOnMouseMove: true,
              fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
              left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
              top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
              right: 'auto', // 组件离容器右侧的距离,'20%'
              bottom: 'auto', // 组件离容器下侧的距离,'20%'
              height: 20 //这里可以设置dataZoom的尺寸
            },
              //  {
              //   type: 'inside', // 鼠标滚轮
              //   zoomOnMouseWheel: true,
              //   moveOnMouseMove: true
              // }
            ],
            grid: {
              containLabel: true,
              left: '6%',
              right: '10%',
              top: '10%',
              bottom: '5%',
            },
            xAxis: {
              type: "category",
              axisLabel: {
                // interval: 0,
                show: true,
                rotate: 45
              },
              data: yAxisData
            },
            yAxis: {
              type: "value",
              axisLabel: {
                show: true,
                // interval: 'auto',
                formatter: '{value} %'
              },
            },
            series: [
              {
                name: '降幅（%）',
                type: "bar",
                label: {
                  show: true,
                  position: "top",
                  formatter: '{c}%'
                },
                data: xAxisData
              }
            ]
          }
        }
      })
    },

    // 获取企业中选品种数数据
    getqyzxData() {
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.qyzxOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/numberOfSelectedProductsInTheEnterprise",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          // console.log(res.data.data)
          let legendData = []
          // 获取配置项的legend数据，判断下拉选择值是否选中全部
          if (this.selectValue.indexOf('全部') === -1) {
            // 如果没选中全部则为当前选中值
            legendData.push(this.selectValue)
          } else {
            // 如果全部选中为当前下拉框所有数据，这里使用深拷贝，避免影响原始数据
            legendData = _.cloneDeep(this.optionsValue)
            // 因为前端默认加了一个全部选项值，所以这里要将其截取掉
            legendData.splice(0, 1)
          }
          let seriesData = [] // series数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成x轴的数据
          res.data.data.map(item => {
            xAxisData.push(item.guifanqiyezhongbiao)
          })
          let _sdata = [] // 用于临时存储批次数据
          // 因为图表堆叠的是批次数据，所以这里用批次数组来遍历数据
          _.forEach(legendData, (item, i) => {
            _sdata[i] = []
            _.forEach(res.data.data, (items, j) => {
              _sdata[i].length = res.data.data.length
              _.forEach(items.value, (itemss) => {
                if (item === itemss.type) {
                  _sdata[i][j] = itemss.num
                }
              })
            })
          })
          // 组合最终需要的series数据
          _.forEach(legendData, (item, i) => {
            seriesData.unshift({
              name: item,
              stack: '批次',
              type: 'bar',
              label: {
                show: true,
                position: "inside",
              },
              data: _sdata[i]
            })
          })
          // console.log(seriesData)
          // 企业中选品种数配置项
          this.qyzxOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-企业中选品种数',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            legend: {
              top: 20,
              data: legendData
            },
            dataZoom: [{
              id: 'dataZoomX',
              show: true,
              startValue: 0,
              endValue: 19,
              zoomOnMouseWheel: true,
              moveOnMouseMove: true,
              fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
              left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
              top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
              right: 'auto', // 组件离容器右侧的距离,'20%'
              bottom: 'auto', // 组件离容器下侧的距离,'20%'
              height: 20 //这里可以设置dataZoom的尺寸
            }],
            grid: {
              containLabel: true,
              left: '6%',
              right: '10%',
              top: '10%',
              bottom: '5%',
            },
            xAxis: {
              type: "category",
              axisLabel: {
                // interval: 0,
                show: true,
                rotate: 55,
                formatter: function (params) {
                  let str1 = params.substring(0, 20)
                  let str2 = params.substring(20, 40) ? params.substring(20, 40) : ''
                  let str3 = params.substring(40, params.length) ? params.substring(40, params.length) : ''
                  let str4 = ''
                  if (str1) {
                    str4 = `${str1}`
                  }
                  if (str1 && str2) {
                    str4 = `${str1}\n${str2}`
                  }
                  if (str1 && str2 && str3) {
                    str4 = `${str1}\n${str2}\n${str3}`
                  }
                  return str4
                }
              },
              data: xAxisData
            },
            yAxis: {
              type: "value",
            },
            series: seriesData
          }
        }
      })
    },

    // 获取企业所属省市中选品种数
    getqyssData() {
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.qyssOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/enterpriseSProvince",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          // console.log(res.data.data)
          let legendData = []
          // 获取配置项的legend数据，判断下拉选择值是否选中全部
          if (this.selectValue.indexOf('全部') === -1) {
            // 如果没选中全部则为当前选中值
            legendData.push(this.selectValue)
          } else {
            // 如果全部选中为当前下拉框所有数据，这里使用深拷贝，避免影响原始数据
            legendData = _.cloneDeep(this.optionsValue)
            // 因为前端默认加了一个全部选项值，所以这里要将其截取掉
            legendData.splice(0, 1)
          }
          let seriesData = [] // series数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成x轴的数据
          res.data.data.map(item => {
            xAxisData.push(item.shengfen)
          })
          let _sdata = [] // 用于临时存储批次数据
          // 因为图表堆叠的是批次数据，所以这里用批次数组来遍历数据
          _.forEach(legendData, (item, i) => {
            _sdata[i] = []
            _.forEach(res.data.data, (items, j) => {
              _sdata[i].length = res.data.data.length
              _.forEach(items.value, (itemss) => {
                if (item === itemss.type) {
                  _sdata[i][j] = itemss.num
                }
              })
            })
          })
          // 组合最终需要的series数据
          _.forEach(legendData, (item, i) => {
            seriesData.unshift({
              name: item,
              stack: '批次',
              type: 'bar',
              label: {
                show: true,
                position: "inside",
              },
              data: _sdata[i]
            })
          })
          // console.log(seriesData)
          // 企业所属省市中选品种数
          this.qyssOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-企业所属省市中选品种数',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            legend: {
              top: 25,
              data: legendData
            },
            dataZoom: [{
              id: 'dataZoomX',
              show: true,
              startValue: 0,
              endValue: 19,
              zoomOnMouseWheel: true,
              moveOnMouseMove: true,
              fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
              left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
              top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
              right: 'auto', // 组件离容器右侧的距离,'20%'
              bottom: 'auto', // 组件离容器下侧的距离,'20%'
              height: 20 //这里可以设置dataZoom的尺寸
            }],
            grid: {
              containLabel: true,
              left: '6%',
              right: '10%',
              top: '10%',
              bottom: '5%',
            },
            xAxis: {
              type: "category",
              axisLabel: {
                // interval: 0,
                show: true,
                rotate: 45
              },
              data: xAxisData
            },
            yAxis: {
              type: "value",
            },
            series: seriesData
          }
        }
      })
    },

    // 获取剂型分布数据
    getjxfbData() {
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.jxfbBarOption = {}
      this.jxfbPieOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/dosageFormDistribution",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let legendData = []
          // 获取配置项的legend数据，判断下拉选择值是否选中全部
          if (this.selectValue.indexOf('全部') === -1) {
            // 如果没选中全部则为当前选中值
            legendData.push(this.selectValue)
          } else {
            // 如果全部选中为当前下拉框所有数据，这里使用深拷贝，避免影响原始数据
            legendData = _.cloneDeep(this.optionsValue)
            // 因为前端默认加了一个全部选项值，所以这里要将其截取掉
            legendData.splice(0, 1)
          }
          let seriesData = [] // series数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成x轴的数据
          res.data.data.map(item => {
            xAxisData.push(item.guifanjixing)
          })
          // console.log(xAxisData)
          let _sdata = [] // 用于临时存储批次数据
          // 因为图表堆叠的是批次数据，所以这里用批次数组来遍历数据
          _.forEach(legendData, (item, i) => {
            _sdata[i] = []
            _.forEach(res.data.data, (items, j) => {
              _sdata[i].length = res.data.data.length
              _.forEach(items.value, (itemss) => {
                if (item === itemss.type) {
                  _sdata[i][j] = itemss.num
                }
              })
            })
          })
          // 组合最终需要的series数据
          _.forEach(legendData, (item, i) => {
            seriesData.unshift({
              name: item,
              stack: '批次',
              type: 'bar',
              label: {
                show: true,
                position: "inside",
              },
              data: _sdata[i]
            })
          })
          // console.log(seriesData)
          // 剂型分布堆叠图配置项
          this.jxfbBarOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-剂型分布',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            legend: {
              type: "scroll",
              top: 25,
              data: legendData
            },
            dataZoom: [{
              id: 'dataZoomX',
              show: true,
              startValue: 0,
              endValue: 9,
              zoomOnMouseWheel: true,
              moveOnMouseMove: true,
              fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
              left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
              top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
              right: 'auto', // 组件离容器右侧的距离,'20%'
              bottom: 'auto', // 组件离容器下侧的距离,'20%'
              height: 20 //这里可以设置dataZoom的尺寸
            }],
            grid: {
              containLabel: true,
              left: '6%',
              right: '10%',
              top: '10%',
              bottom: '5%',
            },
            xAxis: {
              type: "category",
              axisLabel: {
                // interval: 0,
                show: true,
                rotate: 45
              },
              data: xAxisData
            },
            yAxis: {
              type: "value",
            },
            series: seriesData
          }

          let pieData = res.data.data
          // 饼图配置项data数据
          let pieOptionData = []
          // 遍历原始数据组合饼图配置项需要的数据格式
          _.forEach(pieData, (item, i) => {
            let obj = {}
            let sum = 0
            obj.name = item.guifanjixing
            _.forEach(item.value, (val, i) => {
              // 饼图value为当前类型所有批次num相加综合
              sum += val.num
              obj.value = sum
            })
            pieOptionData.push(obj)
          })
          console.log(pieOptionData)
          // 剂型分布饼图配置项
          this.jxfbPieOption = {
            legend: {
              type: "scroll",
              bottom: 0,
              data: xAxisData
            },
            toolbox: {
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-剂型分布',
                  icon: "image:///static/imgs/echarts/download.png"
                }
              }
            },
            tooltip: {
              trigger: "item",
              formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
            },
            series: [
              {
                type: "pie",
                radius: '40%', // 设置图的大小
                center: ['50%', '50%'], // 控制上下左右位置
                label: {
                  normal: {
                    show: true,
                    position: "outside",
                    formatter: "{b}{d}%"
                  }
                },
                data: pieOptionData
              }
            ]
          }
        }
      })
    },

    // 获取Atc分类数据
    getAtcData() {
      // 先清空配置项再去掉用数据，防止数据不渲染
      this.atcBarOption = {}
      this.atcPieOption = {}
      window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/atcClassification",
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken"),
          type: this.selectValue.indexOf('全部') === -1 ? this.selectValue : '' // this.selectValue为全部批次的时候type为空
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.data) {
          let legendData = []
          // 获取配置项的legend数据，判断下拉选择值是否选中全部
          if (this.selectValue.indexOf('全部') === -1) {
            // 如果没选中全部则为当前选中值
            legendData.push(this.selectValue)
          } else {
            // 如果全部选中为当前下拉框所有数据，这里使用深拷贝，避免影响原始数据
            legendData = _.cloneDeep(this.optionsValue)
            // 因为前端默认加了一个全部选项值，所以这里要将其截取掉
            legendData.splice(0, 1)
          }
          let seriesData = [] // series数据
          let xAxisData = [] // x轴数据
          // 遍历基础数据 组合成x轴的数据
          res.data.data.map(item => {
            xAxisData.push(item.shuoming)
          })
          // console.log(xAxisData)
          let _sdata = [] // 用于临时存储批次数据
          // 因为图表堆叠的是批次数据，所以这里用批次数组来遍历数据
          _.forEach(legendData, (item, i) => {
            _sdata[i] = []
            _.forEach(res.data.data, (items, j) => {
              _sdata[i].length = res.data.data.length
              _.forEach(items.value, (itemss) => {
                if (item === itemss.type) {
                  _sdata[i][j] = itemss.num
                }
              })
            })
          })
          // 组合最终需要的series数据
          _.forEach(legendData, (item, i) => {
            seriesData.unshift({
              name: item,
              stack: '批次',
              type: 'bar',
              label: {
                show: true,
                position: "inside",
              },
              data: _sdata[i]
            })
          })
          // console.log(seriesData)
          // Atc分类堆叠图配置项
          this.atcBarOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            toolbox: {
              top: 10,
              right: 20,
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-ATC分类',
                  icon: "image:///static/imgs/echarts/download.png"
                },
              }
            },
            legend: {
              type: "scroll",
              top: 25,
              data: legendData
            },
            dataZoom: [{
              id: 'dataZoomX',
              show: true,
              startValue: 0,
              endValue: 9,
              zoomOnMouseWheel: true,
              moveOnMouseMove: true,
              fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
              left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
              top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
              right: 'auto', // 组件离容器右侧的距离,'20%'
              bottom: 'auto', // 组件离容器下侧的距离,'20%'
              height: 20 //这里可以设置dataZoom的尺寸
            }],
            grid: {
              containLabel: true,
              left: '6%',
              right: '10%',
              top: '10%',
              bottom: '5%',
            },
            xAxis: {
              type: "category",
              axisLabel: {
                // interval: 0,
                show: true,
                rotate: 45
              },
              data: xAxisData
            },
            yAxis: {
              type: "value",
            },
            series: seriesData
          }

          let pieData = res.data.data
          // 饼图配置项data数据
          let pieOptionData = []
          // 遍历原始数据组合饼图配置项需要的数据格式
          _.forEach(pieData, (item, i) => {
            let obj = {}
            let sum = 0
            obj.name = item.shuoming
            _.forEach(item.value, (val, i) => {
              // 饼图value为当前类型所有批次num相加综合
              sum += val.num
              obj.value = sum
            })
            pieOptionData.push(obj)
          })
          // console.log(pieOptionData)
          // ATC分类饼图配置项
          this.atcPieOption = {
            legend: {
              type: "scroll",
              bottom: 0,
              data: xAxisData
            },
            toolbox: {
              feature: {
                saveAsImage: {
                  title: "保存",
                  name: '药智数据企业版-带量采购信息库-精准分析-ATC分类',
                  icon: "image:///static/imgs/echarts/download.png"
                }
              }
            },
            tooltip: {
              trigger: "item",
              formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
            },
            series: [
              {
                type: "pie",
                radius: '40%', // 设置图的大小
                center: ['50%', '50%'], // 控制上下左右位置
                label: {
                  normal: {
                    show: true,
                    position: "outside",
                    formatter: "{b}{d}%"
                  }
                },
                data: pieOptionData
              }
            ]
          }
        }
      })
    },

    // 流标品种列表点击跳转到药品中标精准分析页面
    goYpzb(name) {
      window.ga("send", "event", "button", "cilick", "dailiangcaigoumiss_yaopinzhongbiao__" + name)
      window._paq.push(['trackEvent', 'button', 'cilick', 'dailiangcaigoumiss_yaopinzhongbiao__' + name,])
      let routeData = this.$router.resolve({ path: '/yaopinzhongbiao/list', query: { name: name } })
      window.open(routeData.href, '_blank')
    },

    // 流标品种列表点击跳转到一致性评级进度分析页面
    goYzxpj(name) {
      window.ga("send", "event", "button", "cilick", "dailiangcaigoumiss_yzxjd__" + name)
      window._paq.push(['trackEvent', 'button', 'cilick', 'dailiangcaigoumiss_yzxjd__' + name,])
      let routeData = this.$router.resolve({ path: '/yzxjd', query: { ypname: name } })
      window.open(routeData.href, '_blank')
    },

    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
    },

    handleCurrentChange(val) {
      this.currentPage = val
    },

  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.pici-analy {
  min-height: calc(100vh - 150px);
  // min-width: 400px !important;
  background: #fff;
  padding-bottom: 60px;

  /deep/ .el-dialog__body {
    padding: 20px;
  }

  .title {
    padding-left: 20px;
    line-height: 40px;
    background-color: #eff2fa;
    font-size: 14px;
  }

  // 批次基本信息样式
  .info {

    .select-wrap {
      width: 100%;
      height: 58px;
      line-height: 58px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;

      .select-text {
        vertical-align: middle;
        font-size: 15px;
        color: #4877e8;
      }

      .select-text::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
        background: #4e8bfe;
        margin-right: 10px;
      }
    }

    .pici-info {
      display: flex;
      overflow-x: auto;

      .total-item {
        flex: 1;
        height: 130px;
        min-width: 150px;
        padding: 15px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        text-align: center;
        vertical-align: text-bottom;
        border-bottom: 3px solid @White;

        .look {
          display: block;
          margin-top: 10px;
          color: #4877E8;
          text-decoration: underline;
          cursor: pointer;
        }

        &:hover {
          color: @PrimaryColor;
          background-color: #eff2fa;
          border-bottom: 3px solid @PrimaryColor;
        }

        .li1 {
          font-size: 14px;
          font-weight: 600;
        }

        .li2 {
          font-size: 12px;

          span {
            color: @PrimaryColor;
          }

          .f24 {
            font-size: 24px;
          }
        }
      }
    }
  }

  .no-info {
    width: 100%;
    height: 100%;
    min-height: 188px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 图表样式
  .chart-wrap {
    background: #FFF;
    padding-top: 20px;
    min-height: 400px;

    .shadow {
      width: 100%;
      height: 100%;
      min-height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .chart-title {
      border-bottom: 1px solid #dfe5f1;

      .text {
        display: inline-block;
        height: 29px;
        line-height: 29px;
        color: #4877e8;
        font-size: 14px;
        padding: 0 10px 0 4px;
        border-bottom: 3px solid #4877e8;
        margin-left: 32px;
      }
    }

    .chart-box {
      display: flex;
      flex-wrap: wrap;
    }

    .echarts-container1 {
      width: 100%;
      height: 900px;
    }

    .echarts-container2 {
      width: 100%;
      height: 600px;
    }

    .echarts-container3 {
      width: 100%;
      height: 700px;
    }
  }

  .db-index-loading {
    transition: all 300ms 50ms;
    //置于提示窗下
    z-index: 1997;
    position: fixed;
    top: 48px;
    width: calc(100vw - 51px);
    height: calc(100vh - 48px);
    background: rgba(255, 255, 255, 1);
    text-align: center;
    overflow: hidden;

    /deep/ img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0px !important;
    }
  }
}
</style>
