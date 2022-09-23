import echarts from 'echarts'
import Vue from 'vue'

/**
  * 折线图
  * @param {HTMLDivElement} el echart容器
*/
export const initLine = (el,yAxisData,seriesData,openDialog,Vc)=>{
  let legendData = []
  let isShowSelected = false
  seriesData.map(v=> {
    legendData.push(v.name)
    if(v.name == '中国' || v.name =='美国') {
      isShowSelected = true
    }
  })
  // console.log(isShowSelected);
  let selected = {}
  // 默认只展示美国和中国
  isShowSelected && legendData.map(v=> {
      let key_name = v
      if (key_name === '中国' || key_name =='美国') {
        selected[key_name] = true
      } else {
        selected[key_name] = false
      }
    })


  let chart = echarts.init(el, 'yaozh_theme')
  chart.setOption({
    toolbox: {
      right: '20',
      top: 5,
      show: true,
      feature: {
        saveAsImage: {
          title: "保存",
          name: Vc.getImgName(),
          icon: "image:///static/imgs/echarts/download.png"
        },
        myMagnify: !Vc.isOpen?{
         show: true,
         title: "全屏",
         icon: "image:///static/imgs/echarts/fullscreen.png",
         onclick() {
           openDialog(Vc.eIndex)
         }
       }:{}
      }
    },
    dataZoom: [{
      id: 'dataZoomX',
      show: true,
      startValue: yAxisData.length-10,
      endValue: yAxisData.length-1,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
      left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
      top: 'bottom', // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
      right: 'auto', // 组件离容器右侧的距离,'20%'
      bottom: '50', // 组件离容器下侧的距离,'20%'
      height: 20 //这里可以设置dataZoom的尺寸
    },
    ],
    legend: {
      type: "scroll",
      show: true,
      top: 5,
      right: 70,
      data: legendData,
      selected: selected // 默认只展示中国和美国
    },
    tooltip: {
      trigger: 'axis',
      position: "right"
    },
    grid: {
      containLabel: true
    },
    xAxis: {
      data: yAxisData
    },
    yAxis: {
     type: 'value'
    },
    series: seriesData
  });
  return chart
 }

/**
  * 柱状图
  * @param {HTMLDivElement} el echart容器
*/
export const initBar = (el,yAxisData,seriesData,changeType,openDialog,Vc)=>{
  let chart = echarts.init(el, 'yaozh_theme')
  chart.setOption({
    tooltip: {
      position: (point, params, dom, rect, size) => {
        return Vue.prototype.echartsTooltipPositionX(point, params, dom, rect, size)
      },
      trigger: "item",
      formatter: "{b}<br />数量: {c}"
    },
    toolbox: {
      right: '20',
      feature: {
        myToggleMapt: !Vc.mapCheckLock&&Vc.type==='map'?{
          show: true,
          title: "切换",
          icon: "image:///static/imgs/echarts/check.png",
          onclick() {
            Vc.changeMapType()
          }
        }:{},
        saveAsImage: {
          title: "保存",
          name: Vc.getImgName(),
          icon: "image:///static/imgs/echarts/download.png"
        },
        myTogglePie: Vc.seriesDataMap.length>0 ?{
          show: true,
          title: "饼形图",
          icon: "image:///static/imgs/echarts/pie.png",
          onclick() {
            changeType('pie')
          }
        }:{},
        myToggleMap: Vc.type==='map' ?{
          show: true,
          title: "地图",
          icon: "image:///static/imgs/echarts/map.png",
          onclick() {
            changeType('map')
          }
        }:{},
        myMagnify: !Vc.isOpen?{
          show: true,
          title: "全屏",
          icon: "image:///static/imgs/echarts/fullscreen.png",
          onclick() {
            openDialog(Vc.eIndex)
          }
        }:{}
      }
    },
    grid: {
      containLabel: true
    },
    yAxis: {
      type: "category",
      axisLabel: {
        formatter: function(value) {
          if (value.length > 12) {
            return value.substring(0, 12) + "...";
          } else {
            return value;
          }
        }
      },
      data: yAxisData.length>11?yAxisData.slice(-11):yAxisData
    },
    xAxis: {
      type: "value",
      name: "数量"
    },
    series: [
      {
        data: seriesData.length>11?seriesData.slice(-11):seriesData,
        type: "bar",
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  });
  return chart
 }

 /**
 * 实心圆
 * @param {HTMLDivElement} el echart容器
 */
export const initPie = (el,legendData,seriesData,changeType,openDialog,Vc)=>{
  let chart = echarts.init(el, 'yaozh_theme')
  chart.setOption({
    legend: {
      type: "scroll",
      bottom: 0,
      data: legendData
    },
    toolbox: {
      right: '20',
      feature: {
        myToggleMapt: !Vc.mapCheckLock&&Vc.type==='map'?{
          show: true,
          title: "切换",
          icon: "image:///static/imgs/echarts/check.png",
          onclick() {
            Vc.changeMapType()
          }
        }:{},
        saveAsImage: {
          title: "保存",
          name: Vc.getImgName(),
          icon: "image:///static/imgs/echarts/download.png"
        },
        myToggleBar: {
          show: true,
          title: "柱形图",
          icon: "image:///static/imgs/echarts/bar.png",
          onclick() {
            changeType('bar')
          }
        },
        myToggleMap: Vc.type==='map' ?{
          show: true,
          title: "地图",
          icon: "image:///static/imgs/echarts/map.png",
          onclick() {
            changeType('map')
          }
        }:{},
        myMagnify: !Vc.isOpen?{
          show: true,
          title: "全屏",
          icon: "image:///static/imgs/echarts/fullscreen.png",
          onclick() {
            openDialog(Vc.eIndex)
          }
        }:{}
      }
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>数量：{c}<br/>占比：{d}%"
    },
    series: [
      {
        type: "pie",
        startAngle:180,
        label: {
          normal: {
            show: true,
            position: "outside",
            formatter: "{b}{d}%"
          }
        },
        data: seriesData
      }
    ]
  });
  return chart
}
