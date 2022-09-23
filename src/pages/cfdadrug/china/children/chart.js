import echarts from 'echarts'
import Vue from 'vue'
import 'echarts/map/js/world'


/**
  * 折线图
  * @param {HTMLDivElement} el echart容器
*/
export const initLine = (el,yAxisData,seriesData,openDialog,Vc)=>{
 let chart = echarts.init(el, 'yaozh_theme')
 chart.setOption({
   toolbox: {
     right: '20',
     show: true,
     feature: {
       saveAsImage: {
         title: "保存",
         name: Vc.getImgName(),
         icon: "image:///static/imgs/echarts/download.png"
       },
       myToggleLine:{
        show: true,
        title: "柱状图",
        icon: "image:///static/imgs/echarts/bar.png",
        onclick() {
          Vc.changeType('bars')
        }
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
   dataZoom: Vc.title==='上市趋势' ? {
        type: 'inside',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
    } : '',
   legend: {
     show: true,
     bottom: 0,
     data: ['进口','国产','上市数量',]
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
   series: [
    {
      name: "进口",
      type: "line",
      connectNulls: true,
      data: seriesData[2]
    },
    {
      name: "国产",
      type: "line",
      connectNulls: true,
      data: seriesData[1]
    },
     {
       name: "上市数量",
       type: "line",
       connectNulls: true,
       data: seriesData[0]
     }
   ]
 });
 return chart
}

/**
  * 多柱状图
  * @param {HTMLDivElement} el echart容器
*/
export const initBars = (el,yAxisData,seriesData,changeType,openDialog,Vc)=>{
  let chart = echarts.init(el, 'yaozh_theme')
  chart.setOption({
    tooltip: {
      position: (point, params, dom, rect, size) => {
        return Vue.prototype.echartsTooltipPositionX(point, params, dom, rect, size)
      },
      trigger: "axis"
    },
    legend: {
      show: true,
      bottom: 0,
      data: ['进口','国产','上市数量',]
    },
    dataZoom: Vc.title==='上市趋势' ? {
      type: 'inside',
      show: true,
      xAxisIndex: [0],
      start: 0,
      end: 100,
  } : '',
    toolbox: {
      right: '20',
      feature: {
        saveAsImage: {
          title: "保存",
          name: Vc.getImgName(),
          icon: "image:///static/imgs/echarts/download.png"
        },
        myToggleLine:{
          show: true,
          title: "线状图",
          icon: "image:///static/imgs/echarts/check.png",
          onclick() {
            changeType('line')
          }
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
    grid: {
      containLabel: true
    },
    yAxis: [
      {
        type: 'value'
      }
    ],
    xAxis: {
      type: 'category',
      data: yAxisData,
      axisLabel:{
        show:true,
        interval:0
      },
      axisTick:{
        show:true,
        interval:0
      }
    },
    series: [
      {
       name: "进口",
       type: "bar",
       stack: '总量',
       z:10,
       label: {
        show: true,
        position: 'inside',
        distance: 0,
        fontSize: 12,
        padding: [0, 0, 0, 0],
        borderRadius: 100
      },
       data: seriesData[2]
     },
     {
      name: "国产",
      type: "bar",
      stack: '总量',
      z:9,
      label: {
        show: true,
        position: 'inside',
        distance: 0,
        fontSize: 12,
        padding: [10, 0, 50, 0],
        borderRadius: 100
      },
      data: seriesData[1]
    },
     {
      name: "上市数量",
      type: "bar",
      stack: '总量',
      label: {
        show: true,
        position: 'inside',
        distance: 0,
        fontSize: 12,
        padding: [0, 0, 70, 0],
        borderRadius: 100
      },
      z:8,
      data: seriesData[0]
    },
    ]
  });
  return chart
 }

/**
 * 实心圆
 * @param {HTMLDivElement} el echart容器
 */
export const initPie = (el,legendData,seriesData,changeType,openDialog,Vc)=>{
    if(seriesData.length>10){
      seriesData = window._.cloneDeep(seriesData).reverse()
      let seriesDataContainer=seriesData.slice(0,10)
      let other = 0
      seriesData.forEach((item,i)=>{
        if(i>9){
          other+=Number(item.value)
        }
      })
      seriesDataContainer.push({name:'其他',value:other})
      seriesData=seriesDataContainer.sort((a,b)=>a.value - b.value)
      legendData=[]
      seriesData.forEach(item=>{
        legendData.push(item.name)
      })
    }
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
/**
  * 空心图
  * @param {HTMLDivElement} el echart容器
*/
export const initCircle = (el,legendData,seriesData,changeType,openDialog,Vc)=>{
  if(seriesData.length>10){
    seriesData = window._.cloneDeep(seriesData).reverse()
    let seriesDataContainer=seriesData.slice(0,10)
    let other = 0
    seriesData.forEach((item,i)=>{
      if(i>9){
        other+=Number(item.value)
      }
    })
    seriesDataContainer.push({name:'其他',value:other})
    seriesData=seriesDataContainer.sort((a,b)=>a.value - b.value)
    legendData=[]
    seriesData.forEach(item=>{
      legendData.push(item.name)
    })
  }
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
        radius: ["40%", "75%"],
        label: {
          normal: {
            show: true,
            position: "outside",
            formatter: "{b}{d}%"
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        },
        data: seriesData
      }
    ]
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
  * 地图
  * @param {HTMLDivElement} el echart容器
  * @param {Object} Vc chart组件
*/
export const initMap = (el,seriesData,changeType,openDialog,Vc)=>{
  let chart = echarts.init(el, 'yaozh_theme')
  chart.setOption({
    toolbox: {
      right: '20',
      feature: {
        myToggleMapt: !Vc.mapCheckLock?{
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
        myTogglePie: {
          show: true,
          title: "饼形图",
          icon: "image:///static/imgs/echarts/pie.png",
          onclick() {
            changeType('pie')
          }
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
    tooltip: {
      trigger: "item",
      formatter(param){
        if(Vc.mapType==='world'){
          return `
          国家：${param.name}<br/>
          类型：${param.name==='中国'?'国产':'进口'}<br/>
          数量：${param.value?param.value:0}
          `
        }else{
          return `
            ${param.name}<br/>
            数量：${param.value?param.value:0}
          `
        }
      }
    },
    visualMap: {
      min: 0,
      max: seriesData[seriesData.length-1].value,
      left: "left",
      top: "bottom",
      text: ["高", "低"], // 文本，默认为数值文本
      inRange:{
        color:['rgba(204,231,255,1)','rgba(58,161,255,1)'],
      },
      calculable: true,
    },
    series: [
      {
        name: '数量',
        type: "map",
        mapType: Vc.mapType,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        nameMap:{
          'Singapore Rep.':'新加坡',
          'Dominican Rep.':'多米尼加',
          'Palestine':'巴勒斯坦',
          'Bahamas':'巴哈马',
          'Timor-Leste':'东帝汶',
         'Afghanistan':'阿富汗',
         'Guinea-Bissau':'几内亚比绍',
         "Côte d'Ivoire":'科特迪瓦',
         'Siachen Glacier':'锡亚琴冰川',
         "Br. Indian Ocean Ter.":'英属印度洋领土',
         'Angola':'安哥拉',
         'Albania':'阿尔巴尼亚',
         'United Arab Emirates':'阿联酋',
         'Argentina':'阿根廷',
         'Armenia':'亚美尼亚',
         'French Southern and Antarctic Lands':'法属南半球和南极领地',
         'Australia':'澳大利亚',
         'Austria':'奥地利',
         'Azerbaijan':'阿塞拜疆',
         'Burundi':'布隆迪',
         'Belgium':'比利时',
         'Benin':'贝宁',
         'Burkina Faso':'布基纳法索',
         'Bangladesh':'孟加拉国',
         'Bulgaria':'保加利亚',
         'The Bahamas':'巴哈马',
         'Bosnia and Herz.':'波斯尼亚和黑塞哥维那',
         'Belarus':'白俄罗斯',
         'Belize':'伯利兹',
         'Bermuda':'百慕大',
         'Bolivia':'玻利维亚',
         'Brazil':'巴西',
         'Brunei':'文莱',
         'Bhutan':'不丹',
         'Botswana':'博茨瓦纳',
         'Central African Rep.':'中非',
         'Canada':'加拿大',
         'Switzerland':'瑞士',
         'Chile':'智利',
         'China':'中国',
         'Ivory Coast':'象牙海岸',
         'Cameroon':'喀麦隆',
         'Dem. Rep. Congo':'刚果民主共和国',
         'Congo':'刚果',
         'Colombia':'哥伦比亚',
         'Costa Rica':'哥斯达黎加',
         'Cuba':'古巴',
         'N. Cyprus':'北塞浦路斯',
         'Cyprus':'塞浦路斯',
         'Czech Rep.':'捷克',
         'Germany':'德国',
         'Djibouti':'吉布提',
         'Denmark':'丹麦',
         'Algeria':'阿尔及利亚',
         'Ecuador':'厄瓜多尔',
         'Egypt':'埃及',
         'Eritrea':'厄立特里亚',
         'Spain':'西班牙',
         'Estonia':'爱沙尼亚',
         'Ethiopia':'埃塞俄比亚',
         'Finland':'芬兰',
         'Fiji':'斐',
         'Falkland Islands':'福克兰群岛',
         'France':'法国',
         'Gabon':'加蓬',
         'United Kingdom':'英国',
         'Georgia':'格鲁吉亚',
         'Ghana':'加纳',
         'Guinea':'几内亚',
         'Gambia':'冈比亚',
         'Guinea Bissau':'几内亚比绍',
         'Eq. Guinea':'赤道几内亚',
         'Greece':'希腊',
         'Greenland':'格陵兰',
         'Guatemala':'危地马拉',
         'French Guiana':'法属圭亚那',
         'Guyana':'圭亚那',
         'Honduras':'洪都拉斯',
         'Croatia':'克罗地亚',
         'Haiti':'海地',
         'Hungary':'匈牙利',
         'Indonesia':'印度尼西亚',
         'India':'印度',
         'Ireland':'爱尔兰',
         'Iran':'伊朗',
         'Iraq':'伊拉克',
         'Iceland':'冰岛',
         'Israel':'以色列',
         'Italy':'意大利',
         'Jamaica':'牙买加',
         'Jordan':'约旦',
         'Japan':'日本',
         'Kazakhstan':'哈萨克斯坦',
         'Kenya':'肯尼亚',
         'Kyrgyzstan':'吉尔吉斯斯坦',
         'Cambodia':'柬埔寨',
         'Korea':'韩国',
         'Kosovo':'科索沃',
         'Kuwait':'科威特',
         'Lao PDR':'老挝',
         'Lebanon':'黎巴嫩',
         'Liberia':'利比里亚',
         'Libya':'利比亚',
         'Sri Lanka':'斯里兰卡',
         'Lesotho':'莱索托',
         'Lithuania':'立陶宛',
         'Luxembourg':'卢森堡',
         'Latvia':'拉脱维亚',
         'Morocco':'摩洛哥',
         'Moldova':'摩尔多瓦',
         'Madagascar':'马达加斯加',
         'Mexico':'墨西哥',
         'Macedonia':'马其顿',
         'Mali':'马里',
         'Myanmar':'缅甸',
         'Montenegro':'黑山',
         'Mongolia':'蒙古',
         'Mozambique':'莫桑比克',
         'Mauritania':'毛里塔尼亚',
         'Malawi':'马拉维',
         'Malaysia':'马来西亚',
         'Namibia':'纳米比亚',
         'New Caledonia':'新喀里多尼亚',
         'Niger':'尼日尔',
         'Nigeria':'尼日利亚',
         'Nicaragua':'尼加拉瓜',
         'Netherlands':'荷兰',
         'Norway':'挪威',
         'Nepal':'尼泊尔',
         'New Zealand':'新西兰',
         'Oman':'阿曼',
         'Pakistan':'巴基斯坦',
         'Panama':'巴拿马',
         'Peru':'秘鲁',
         'Philippines':'菲律宾',
         'Papua New Guinea':'巴布亚新几内亚',
         'Poland':'波兰',
         'Puerto Rico':'波多黎各',
         'Dem. Rep. Korea':'朝鲜',
         'Portugal':'葡萄牙',
         'Paraguay':'巴拉圭',
         'Qatar':'卡塔尔',
         'Romania':'罗马尼亚',
         'Russia':'俄罗斯',
         'Rwanda':'卢旺达',
         'W. Sahara':'西撒哈拉',
         'Saudi Arabia':'沙特阿拉伯',
         'Sudan':'苏丹',
         'S. Sudan':'南苏丹',
         'Senegal':'塞内加尔',
         'Solomon Is.':'所罗门群岛',
         'Sierra Leone':'塞拉利昂',
         'El Salvador':'萨尔瓦多',
         'Somaliland':'索马里兰',
         'Somalia':'索马里',
         'Serbia':'塞尔维亚',
         'Suriname':'苏里南',
         'Slovakia':'斯洛伐克',
         'Slovenia':'斯洛文尼亚',
         'Sweden':'瑞典',
         'Swaziland':'斯威士兰',
         'Syria':'叙利亚',
         'Chad':'乍得',
         'Togo':'多哥',
         'Thailand':'泰国',
         'Tajikistan':'塔吉克斯坦',
         'Turkmenistan':'土库曼斯坦',
         'East Timor':'东帝汶',
         'Trinidad and Tobago':'特里尼达和多巴哥',
         'Tunisia':'突尼斯',
         'Turkey':'土耳其',
         'Tanzania':'坦桑尼亚',
         'Uganda':'乌干达',
         'Ukraine':'乌克兰',
         'Uruguay':'乌拉圭',
         'United States':'美国',
         'Uzbekistan':'乌兹别克斯坦',
         'Venezuela':'委内瑞拉',
         'Vietnam':'越南',
         'Vanuatu':'瓦努阿图',
         'West Bank':'西岸',
         'Yemen':'也门',
         'South Africa':'南非',
         'Zambia':'赞比亚',
         'Zimbabwe':'津巴布韦'
      },
        data: seriesData
      }
    ]
  });
  chart.on('click', function(params){
    if(params.name==='中国'){
      Vc.changeMapType()
    }
  })
  return chart
 }