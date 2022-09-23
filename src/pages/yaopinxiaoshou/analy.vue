<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'db-index-loading'" :loadFlag="analyLoading" v-if="analyLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="chart">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="totals">
          <ul class="total-item">
            <li class="li1">品种数</li>
            <li class="li2">总计<span>{{ basic.sp_count}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">生产企业</li>
            <li class="li2">总计<span>{{ basic.qy_count}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">ATC分类</li>
            <li class="li2">总计<span>{{ basic.atc_count}}</span>个</li>
          </ul>
          <ul class="total-item">
            <li class="li1">销售年份</li>
            <li class="li2">总计<span>{{ basic.nd_count}}</span>个</li>
          </ul>
        </div>
      </div>
      <div class="chart_bottom" style="padding-top:11px;">
        <div class="go-list">
          <selectNuit v-model="nuit" gaKey="zhinengfenxi" title="货币单位" analy />
          <router-link tag="a" :to="{path: '/ypxs/list'}">返回列表</router-link>
        </div>
        <div class="chart-boxes">
          <DbEcharts title="品种排行">
            <div class="chart-tab">
              <div :class="['btn',source===1? 'active':'']" @click="switchPzChart(1)">
                英文
              </div>
              <div :class="['btn',source===2? 'active':'']" @click="switchPzChart(2)">
                中文
              </div>
            </div>
            <div id="echarts-a" class="echarts" style="margin: 10px 10px 0 10px;">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="企业排行">
            <div id="echarts-b" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="年度销售">
            <div id="echarts-c" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="ATC分类">
            <div v-if="atcs_sel" class="echarts">
              <div class="nodata-box-atc"></div>
            </div>
            <div v-else id="echarts-d" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog" v-show="dialogVisible">
        <div class="menu">
          <div v-for="(ti,index) in title" v-bind:class="[index==openIndex? 'active':'','nav']"
            @click="handleOpenIndex(index)" :key="index">
            {{ ti}}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title">{{ title[openIndex]}}</span>
            <a class="esc-btn" href="javascript:;" @click="handleDialogVisible(false)"><i></i><img
                src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏"></a>
          </div>
          <div class="echarts-items">
            <div class="echarts-item">
              <div class="chart-tab">
                <div :class="['btn',source===1? 'active':'']" @click="switchPzChart(1,true)">
                  英文
                </div>
                <div :class="['btn',source===2? 'active':'']" @click="switchPzChart(2,true)">
                  中文
                </div>
              </div>
              <div id="a-open" class="open-charts" style="margin: 10px 10px 0 10px;">
                <div class="nodata-box"></div>
              </div>
            </div>
            <div class="echarts-item">
              <div id="b-open" class="open-charts">
                <div class="nodata-box"></div>
              </div>
            </div>
            <div class="echarts-item">
              <div id="c-open" class="open-charts">
                <div class="nodata-box"></div>
              </div>
            </div>
            <div class="echarts-item">
              <div id="d-open" class="open-charts">
                <div class="nodata-box"></div>
              </div>
            </div>
          </div>
          <div class="ctr-actions">
            <el-button class="pre action" @click="handleOpenIndex(openIndex-1)"><i class="el-icon-arrow-left"></i>
            </el-button>
            <el-button class="next action" @click="handleOpenIndex(openIndex+1)"><i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
          <div class="nodata-box fullcharts hide">
            <div :class="atcs_sel? 'nodata-box-atc':'nodata-box'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from '@/components/common/globalCom/loading-gif'
import DbEcharts from "@/components/common/db-echarts"
import selectNuit from './selectNuit'
import { mapState, mapGetters } from "vuex"

var _res = {}
const myicon = {
  open: "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891"
}

export default {
  components: {
    LoadingGif,
    DbEcharts,
    selectNuit
  },
  data() {
    return {
      pzLoading: false,
      nuit: '1',
      itemWidth: 700,
      promise: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      title: ["品种排行", "企业排行", "年度销售", "ATC分类"], //图形标题
      basic: {},
      data_a: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      data_b: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      data_c: {
        echarts: null,
        xAxis_data: [],
        yAxis_data1: [],
        yAxis_data2: [],
      },
      data_d: {
        echarts: null,
        xAxis_data: [],
        series_data: [],
      },
      recordNoData: new Set,
      atcs_sel: false,
    }
  },
  computed: {
    ...mapState({
      nopms: state => state.Yaopinxiaoshou.nopms,
      kshResNum: state => state.Yaopinxiaoshou.kshResNum,
      kshRes1: state => state.Yaopinxiaoshou.kshRes1,
      kshRes2: state => state.Yaopinxiaoshou.kshRes2,
      kshRes3: state => state.Yaopinxiaoshou.kshRes3,
      kshRes4: state => state.Yaopinxiaoshou.kshRes4,
      analyLoading: state => state.Yaopinxiaoshou.analyLoading,
      conditions: state => state.Yaopinxiaoshou.conditions,
      allBase: state => state.Yaopinxiaoshou.allBase,
      activeTabName: state => state.Yaopinxiaoshou.tabname,
      res1: state => state.Yaopinxiaoshou.res1,
      res2: state => state.Yaopinxiaoshou.res2,
      res3: state => state.Yaopinxiaoshou.res3,
      source: state => state.Yaopinxiaoshou.source,
      showPromtNotice: state => state.showPromtNotice
    }),
    noData() {
      return !this.res1.res && !this.res2.res && !this.res3.res
    },
    kshRes() {
      return {
        kshRes1: this.kshRes1,
        kshRes2: this.kshRes2,
        kshRes3: this.kshRes3,
        kshRes4: this.kshRes4,
      }
    },
    nuitValue() {
      let value = ''
      switch (this.nuit) {
        case '1':
          value = '万'
          break;
        case '100':
          value = '百万'
          break;
        case '1000':
          value = '千万'
          break;
        case '10000':
          value = '亿'
          break;
      }
      return value
    }
  },
  methods: {
    // 品种排行切换
    switchPzChart(val, isOpen) {
      this.pzLoading = true;
      Store.commit('Yaopinxiaoshou/source', val)
      // 1为英文名
      if (this.source === 1) {

      } else if (this.source === 2) {
        // 2为中文名
      }

      const _that = this;

      this.$store
        .dispatch("Yaopinxiaoshou/getKshRes", {
          source: this.source === 2 ? 2 : 1, // 1是英文名2中文名
        }).then(res => {
          if (isOpen) {
            _that.drawAOpen();
          }
        })
    },
    getImgName(i) {
      return `药智数据企业版-${document.title}-智能分析-${this.title[i]}`
    },
    initLayout() {
      let screen_width = window.innerWidth;
      let screen_height = window.innerHeight;
      this.itemWidth = screen_width - 244;
      $(".dialog .echarts-items-wap").css("height", screen_height - 50);
      $(".dialog .echarts-items-wap").css("width", screen_width - 244);
      $(".dialog .echarts-items").width((this.itemWidth + 12) * 10).css("margin-left", -this.openIndex * this.itemWidth);
      $(".dialog .echarts-item").width(this.itemWidth - 100);
    },
    loadData: _.debounce(function () {
      Store.dispatch("Yaopinxiaoshou/getKshRes")

      this.update()
    }, 10),
    handleOpenIndex(index) {

      if (index > 0 && index < 4) {
        this.openIndex = index;
      } else {
        this.openIndex = 0;
      }

      // 显示 no-data 提示图片
      if (this.recordNoData.has(this.openIndex)) {
        $('.fullcharts').show();
      } else {
        $('.fullcharts').hide();
      }
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    update() {
      this.basic = this.kshResNum;
      // Store.commit("Yaopinxiaoshou/extendCount", {
      //   BaseCount: Number(this.basic.total[0]),
      //   NameCount: Number(this.basic.shenbaoname[0]),
      //   QiyeCount: Number(this.basic.shenbaoqiye[0]),
      // })
      console.log(this.kshRes.kshRes1);
      this.dealA(this.kshRes.kshRes1)
      this.dealB(this.kshRes.kshRes2)
      this.dealC(this.kshRes.kshRes3)
      this.dealD(this.kshRes.kshRes4)
    },
    //初始化全屏图形
    initOpendKsh(index) {
      var _that = this;
      this.loading = true;
      this.dialogVisible = true;

      //使用定时器 解决echarts无法在隐藏元素绘制图形问题
      if (!_that.initopen) {
        _that.loading = false;
        setTimeout(() => {
          _that.initLayout();
          _that.initopen = true;
          _that.drawAOpen()
          _that.drawBOpen()
          _that.drawCOpen()
          _that.drawDOpen()

          _that.handleOpenIndex(index);
          this.loading = false;
        }, 500);
      } else {
        this.handleOpenIndex(index);
        this.loading = false;
      }
    },
    // 品种排行
    dealA(kshRes1) {
      let _len = kshRes1 ? kshRes1.length : 0;
      let yAxis_data = [];
      let series_data = [];
      let name = [];
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          yAxis_data.push(kshRes1[i].name1);
          series_data.push(this.ypxsNuitChange(this.nuit, kshRes1[i].Salesvolume));
          name.push(kshRes1[i].name);
        }
        this.data_a.yAxis_data = yAxis_data;
        this.data_a.series_data = series_data;
        this.drawA();
        // 修改vuex里面的值，用于定量分析搜索默认值
        Store.commit("Yaopinxiaoshou/fenxi_yp_name", name[name.length - 1]);

        this.recordNoData.delete(0);
      } else {
        this.recordNoData.add(0)
        $('#echarts-a').html('<div class="nodata-box"></div>');
        $('#echarts-a').removeAttr('_echarts_instance_');
      }
    },
    drawA() {
      var _that = this;
      _that.data_a.echarts = Echarts.init(document.getElementById("echarts-a"), 'yaozh_theme');
      _that.data_a.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size)
          },
          trigger: "axis",
          formatter: (params) => {
            let data = params[0]
            return `
                ${data.name}<br />销售额: ${this.echartsTooltipMoney(data.value)}（${this.nuitValue}元）
            `
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(0);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          right: 100,
        },
        yAxis: {
          type: "category",
          axisLabel: {
            formatter: function (value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          },
          data: _that.data_a.yAxis_data
        },
        xAxis: {
          type: "value",
          name: `销售额(${this.nuitValue}元)`,
          axisLabel: {
            formatter: function (value) {
              let len = String(value).length
              if (len >= 4 && len < 7) {
                return value / 1000 + "K"
              } else if (len >= 7) {
                return value / 1000000 + "M"
              } else {
                return value
              }
            }
          }
        },
        series: [
          {
            data: _that.data_a.series_data,
            type: "bar"
          }
        ]
      });
    },
    drawAOpen() {
      var _that = this;
      Echarts.init(document.getElementById("a-open"), 'yaozh_theme').setOption({
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let data = params[0]
            return `
                ${data.name}<br />销售额: ${this.echartsTooltipMoney(data.value)}（${this.nuitValue}元）
            `
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.data_a.yAxis_data
        },
        xAxis: {
          type: "value",
          name: `销售额(${this.nuitValue}元)`,
          axisLabel: {
            formatter: function (value) {
              let len = String(value).length
              if (len >= 4 && len < 7) {
                return value / 1000 + "K"
              } else if (len >= 7) {
                return value / 1000000 + "M"
              } else {
                return value
              }
            }
          }
        },
        series: [
          {
            data: _that.data_a.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 企业排行
    dealB(kshRes2) {
      let _len = kshRes2 ? kshRes2.length : 0;
      let yAxis_data = [];
      let series_data = [];
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          yAxis_data.push(kshRes2[i].company);
          series_data.push(this.ypxsNuitChange(this.nuit, kshRes2[i].Salesvolume));
        }
        this.data_b.yAxis_data = yAxis_data;
        this.data_b.series_data = series_data;
        this.drawB();
        // 修改vuex里面的值，用于定量分析搜索默认值
        Store.commit("Yaopinxiaoshou/fenxi_qy_name", yAxis_data[yAxis_data.length - 1]);

        this.recordNoData.delete(1);
      } else {
        this.recordNoData.add(1)
        $('#echarts-b').html('<div class="nodata-box"></div>');
        $('#echarts-b').removeAttr('_echarts_instance_');
      }
    },
    drawB() {
      var _that = this;
      _that.data_b.echarts = Echarts.init(document.getElementById("echarts-b"), 'yaozh_theme');
      _that.data_b.echarts.setOption({
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size)
          },
          trigger: "axis",
          formatter: (params) => {
            let data = params[0]
            return `
                ${data.name}<br />销售额: ${this.echartsTooltipMoney(data.value)}（${this.nuitValue}元）
            `
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(1);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          right: 100,
        },
        yAxis: {
          type: "category",
          axisLabel: {
            formatter: function (value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          },
          data: _that.data_b.yAxis_data
        },
        xAxis: {
          type: "value",
          name: `销售额(${this.nuitValue}元)`,
          axisLabel: {
            formatter: function (value) {
              let len = String(value).length
              if (len >= 4 && len < 7) {
                return value / 1000 + "K"
              } else if (len >= 7) {
                return value / 1000000 + "M"
              } else {
                return value
              }
            }
          },
        },
        series: [
          {
            data: _that.data_b.series_data,
            type: "bar"
          }
        ]
      });
    },
    drawBOpen() {
      var _that = this;
      Echarts.init(document.getElementById("b-open"), 'yaozh_theme').setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            let data = params[0]
            return `
                ${data.name}<br />销售额: ${this.echartsTooltipMoney(data.value)}（${this.nuitValue}元）
            `
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        grid: {
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: _that.data_b.yAxis_data,
        },
        xAxis: {
          type: "value",
          name: `销售额(${this.nuitValue}元)`,
          axisLabel: {
            formatter: function (value) {
              let len = String(value).length
              if (len >= 4 && len < 7) {
                return value / 1000 + "K"
              } else if (len >= 7) {
                return value / 1000000 + "M"
              } else {
                return value
              }
            }
          },
        },
        series: [
          {
            data: _that.data_b.series_data,
            type: "bar"
          }
        ]
      });
    },
    // 年度销售
    dealC(kshRes3) {
      let _len = kshRes3 ? kshRes3.length : 0
      let xAxis_data = []
      let yAxis_data1 = []
      let yAxis_data2 = []
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(kshRes3[i].year)
          yAxis_data1.push(this.ypxsNuitChange(this.nuit, kshRes3[i].Salesvolume))
          if (i !== 0) {
            let tb = Number(((kshRes3[i].Salesvolume - kshRes3[i - 1].Salesvolume) / kshRes3[i - 1].Salesvolume) * 100).toFixed(2)
            yAxis_data2.push(tb)
          } else {
            yAxis_data2.push(null)
          }
        }
        this.data_c.xAxis_data = xAxis_data
        this.data_c.yAxis_data1 = yAxis_data1
        this.data_c.yAxis_data2 = yAxis_data2
        this.drawC()

        this.recordNoData.delete(2);
      } else {
        this.recordNoData.add(2)
        $('#echarts-c').html('<div class="nodata-box"></div>');
        $('#echarts-c').removeAttr('_echarts_instance_');
      }

    },
    drawC() {
      var _that = this;
      _that.data_c.echarts = Echarts.init(document.getElementById("echarts-c"), 'yaozh_theme');
      _that.data_c.echarts.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params, ticket) => {
            //实现设计图上的提示样式
            let str = params[0].name + '<br>'
            _.map(params, item => {
              if (item.seriesType == "bar") {
                str += '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' + item.color + '"></span>' + "销售额（" + this.nuitValue + "元/RMB）: " + this.echartsTooltipMoney(item.value) + '<br>'
              } else if (item.seriesType == "line" && item.value) {
                str += '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' + item.color + '"></span>' + "同比（%）: " + item.value + '<br>'
              }
            })
            return str
          },
        },
        dataZoom: {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(2);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          top: 60,
          bottom: 70,
        },
        legend: {
          data: [
            {
              name: `销售额（${this.nuitValue}元/RMB）`,
              icon: 'circle'
            },
            {
              name: '同比（%）'
            }
          ],
          bottom: 20,
        },
        xAxis: [
          {
            type: 'category',
            data: this.data_c.xAxis_data,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: `销售额（${this.nuitValue}元/RMB）`,
            axisLabel: {
              formatter: function (value) {
                if (String(value).length >= 4 && String(value).length < 7) {
                  return value / 1000 + "K"
                } else if (String(value).length >= 7) {
                  return value / 1000000 + "M"
                } else {
                  return value
                }
              }
            },
            splitLine: {
              show: false,
            }
          },
          {
            type: 'value',
            name: '同比（%）',
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (value) {
                return value + '%'
              }
            },
          }
        ],
        series: [
          {
            name: `销售额（${this.nuitValue}元/RMB）`,
            type: 'bar',
            barWidth: 10,
            data: this.data_c.yAxis_data1,
          },
          {
            name: '同比（%）',
            type: 'line',
            yAxisIndex: 1,
            data: this.data_c.yAxis_data2,
          }
        ],
        fontSize: "14",
      })
    },
    drawCOpen() {
      var _that = this;
      Echarts.init(document.getElementById("c-open"), 'yaozh_theme').setOption({
        tooltip: {
          trigger: 'axis',
          formatter: (params, ticket) => {
            //实现设计图上的提示样式
            let str = params[0].name + '<br>'
            _.map(params, item => {
              if (item.seriesType == "bar") {
                str += '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' + item.color + '"></span>' + "销售额（" + this.nuitValue + "元/RMB）: " + this.echartsTooltipMoney(item.value) + '<br>'
              } else if (item.seriesType == "line" && item.value) {
                str += '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' + item.color + '"></span>' + "同比（%）: " + item.value + '<br>'
              }
            })
            return str
          },
        },
        dataZoom: {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(2),
              icon: "image:///static/imgs/echarts/download.png"
            },
          }
        },
        grid: {
          containLabel: true,
          top: 10,
          bottom: 70,
        },
        legend: {
          data: [
            {
              name: `销售额（${this.nuitValue}元/RMB）`,
              icon: 'circle'
            },
            {
              name: '同比（%）'
            }
          ],
          bottom: 20,
        },
        xAxis: [
          {
            type: 'category',
            data: this.data_c.xAxis_data,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 45,
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: `销售额（${this.nuitValue}元/RMB）`,
            axisLabel: {
              formatter: function (value) {
                if (String(value).length >= 4 && String(value).length < 7) {
                  return value / 1000 + "K"
                } else if (String(value).length >= 7) {
                  return value / 1000000 + "M"
                } else {
                  return value
                }
              }
            },
            splitLine: {
              show: false,
            }
          },
          {
            type: 'value',
            name: '同比（%）',
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (value) {
                return value + '%'
              }
            },
          }
        ],
        series: [
          {
            name: `销售额（${this.nuitValue}元/RMB）`,
            type: 'bar',
            barWidth: 10,
            data: this.data_c.yAxis_data1,
          },
          {
            name: '同比（%）',
            type: 'line',
            yAxisIndex: 1,
            data: this.data_c.yAxis_data2,
          }
        ],
        fontSize: "14",
      })
    },
    // ATC分类
    dealD(kshRes4) {
      this.atcs_sel = false
      _.forEach(this.conditions, (item) => {
        if (item.name === 'atc' || item.name === 'atcb') {
          if (item.atcs_sel) {
            this.atcs_sel = true
          };
        };
      })
      let _len = kshRes4 ? kshRes4.length : 0
      let xAxis_data = []
      let series_data = []
      if (_len > 0) {
        for (var i = 0; i < _len; i++) {
          xAxis_data.push(kshRes4[i].name)
          let obj = {
            "name": kshRes4[i].name,
            "value": this.ypxsNuitChange(this.nuit, kshRes4[i].num),
          }
          series_data.push(obj)
        }

        this.data_d.xAxis_data = xAxis_data
        this.data_d.series_data = series_data

        this.$nextTick(() => {
          this.drawD()
        })
        this.recordNoData.delete(3);
      } else {
        this.recordNoData.add(3)
        let html = this.atcs_sel ? '<div class="nodata-box-atc"></div>' : '<div class="nodata-box"></div>'
        $('#echarts-d').html(html);
        $('#echarts-d').removeAttr('_echarts_instance_');
      }
    },
    drawD() {
      var _that = this;
      _that.data_d.echarts = Echarts.init(document.getElementById("echarts-d"), 'yaozh_theme');
      _that.data_d.echarts.setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: this.data_d.xAxis_data,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(3),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(3);
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `
                ${params.name}<br />销售额: ${this.echartsTooltipMoney(params.value)}（${this.nuitValue}元）<br/>占比：${params.percent}%
            `
          },
        },
        series: [
          {
            type: "pie",
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%"
              }
            },
            data: this.data_d.series_data,
          }
        ]
      });
    },
    drawDOpen() {
      var _that = this;
      Echarts.init(document.getElementById("d-open"), 'yaozh_theme').setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.data_d.xAxis_data
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(3),
              icon: "image:///static/imgs/echarts/download.png"
            },
          }
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `
                ${params.name}<br />销售额: ${this.echartsTooltipMoney(params.value)}（${this.nuitValue}元）<br/>占比：${params.percent}%
            `
          },
        },
        series: [
          {
            type: "pie",
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%"
              }
            },
            data: this.data_d.series_data
          }
        ]
      });
    },

    handleDialogVisible(value) {
      this.dialogVisible = value;
      // 退出全屏的时候需要将initopen改为false，不然不会重新渲染图标。
      this.initopen = value
    },
    echartsResizeHandler() {
      if (this.dialogVisible) {
        this.initLayout()
        this.echartsResize('open-charts')
      }
      this.$nextTick(() => {
        this.echartsResize('echarts')
      })
    }
  },
  created() {
    //this.initLayout()
    this.loadData()
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  mounted() {
    window.addEventListener('resize', this.echartsResizeHandler);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.ksh)
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh)
  },
  watch: {
    kshResNum() {
      this.update();
    },
    kshRes() {
      this.update();
    },
    $route() {
      if (this.$route.path === '/ypxs/analy' && !this.kshRes1.length && !this.kshRes2.length && !this.kshRes3.length && !this.kshRes4.length) {
        this.loadData()
      }
      if (this.$route.path === '/ypxs/analy') {
        window.addEventListener('resize', this.echartsResizeHandler);
      } else {
        window.removeEventListener('resize', this.echartsResizeHandler);
        this.echartsClear('open-charts');
        this.echartsClear('echarts');
      }
      if (this.$route.path === '/ypxs/list') {
        //智能分析重新搜索清空列表数据tab无法自动复位
        let tabname = this.activeTabName
        Store.commit('Yaopinxiaoshou/tabname', '')
        Store.commit('Yaopinxiaoshou/tabname', tabname)
        this.noData && Store.dispatch('Yaopinxiaoshou/nomalSearch', { queryToPutong: false, tabs: true })
      }
    },
    dialogVisible() {
      if (this.dialogVisible) {
        $(".dialog").removeClass("hide");
        this.initLayout()
        this.echartsResize('open-charts')
      } else {
        $(".dialog").addClass("hide");
      }
    },
    nuit() {
      this.update();
    }
  },
}
</script>

<style lang="less">
.chart-title {
  position: relative !important;
}

.nodata,
.nodata-box,
.nodata-box-atc {
  width: 100%;
  height: 100%;
}

.nodata-box-atc {
  background: url(/static/imgs/nodata_atc.png) center center no-repeat;
}

.nodata-box,
.nodata {
  background: url(/static/imgs/nodata.png) center center no-repeat;
}

.fullcharts.nodata-box {
  position: absolute;
  top: 40px;
  height: calc(100vh - 40px - 48px - 80px);
  background: #fff;
}

@import "~@/assets/less/var.less";

.chart {
  .totals {
    // margin-top:20px!important;
    height: 100px;
    background-color: @White;
    // box-shadow: @BoxShadow;
    // border-top: 1px solid #dfe5f1;
    display: flex;
    justify-content: space-between;

    .total-item {
      display: inline-block;
      width: 25%;
      min-width: 130px;
      height: 100%;
      text-align: center;
      vertical-align: text-bottom;
      border-bottom: 3px solid @White;

      &:hover {
        color: @PrimaryColor;
        background-color: #eff2fa;
        border-bottom: 3px solid @PrimaryColor;
      }

      .li1 {
        padding-top: 30px;
        font-size: 13px;
        font-weight: 600;
      }

      .li2 {
        font-size: 14px;

        span {
          font-size: 24px;
          color: @PrimaryColor;
        }
      }
    }
  }

  .chart-boxes {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .echarts {
    box-sizing: border-box;
    display: inline-block;
    margin: 50px 10px 20px 10px;
    width: calc(100% - 20px);
    height: 400px;
  }

  .chart-tab {
    display: flex;
    margin: 10px;

    .btn {
      margin-right: 10px;
      width: 56px;
      height: 22px;
      border-radius: 4px;
      border: 1px solid #4877e8;
      font-size: 13px;
      font-weight: 400;
      color: #4877e8;
      line-height: 22px;
      cursor: pointer;
      text-align: center;
      box-sizing: border-box;
    }

    .active {
      height: 22px;
      border: 0;
      color: #ffffff;
      background: #4877e8;
      transition: all 0.3s ease-in-out;
    }
  }

  .hide {
    display: none;
  }

  .prompt-notice {
    top: 78px !important;
    height: 100% !important;
  }

  .dialog {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0px;
    width: 100%;
    height: calc(100%);
    background-color: @PrimaryBackgroundColor;

    .menu {
      position: fixed;
      left: 0px;
      top: 48px;

      .nav {
        width: 220px;
        padding-left: 20px;
        line-height: 40px;
        border-left: 4px solid @PrimaryBackgroundColor;
        border-bottom: 1px dashed @BorderColor;
        cursor: pointer;

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

    .echarts-items-wap {
      width: calc(100% - 250px) !important;
      height: 100% !important;
      position: absolute;
      // overflow-y: scroll;
      overflow-x: hidden;
      top: 0px;
      left: 250px;
      background-color: #fff;
      box-shadow: @BoxShadow;

      .echarts-items-title {
        position: relative;
        padding-right: 40px;
        background-color: @PrimaryBackgroundColor;
        line-height: 40px;
        text-align: right;

        .echart-title {
          position: absolute;
          left: 18px;
        }

        .esc-btn {
          display: inline-block;
          height: 100%;
          font-size: 13px;

          img {
            display: inline-block;
            margin-top: 10px;
          }
        }
      }

      .echarts-items {
        width: 1414px * 10;
        height: 700px;
        overflow-y: scroll;
        overflow-x: hidden;

        .echarts-item {
          display: inline-block;
          margin: 0px 50px;
          width: 1300px;
          height: 900px;
        }

        .open-charts {
          width: 100%;
          height: 700px;
        }
      }

      .ctr-actions {
        padding: 100px 0px 20px;
        text-align: center;

        .action {
          cursor: pointer;
          padding: 5px;
        }
      }
    }
  }

  .chart_top {
    background-color: #eff2fa;
  }

  .chart_bottom {
    background-color: #eff2fa;
    padding-top: 22px;

    .go-list {
      text-align: right;
      font-size: 14px;

      a {
        margin: 0 40px 0 10px;
      }

      a:hover {
        color: #4877e8;
      }
    }
  }
}
</style>
