<template>
  <List :loading="loading" :nodata="nodata">
    <div style="display:flex;width:100%;" :style="{ height: isOpen ? '700px' : '480px' }">
      <div id="statemap" v-if="!isOpen" :style="{ height: '100%', width: mapWidth }"></div>
      <div id="statemap-open" v-else :style="{ height: '100%', width: mapWidth }"></div>
      <div class="map-table">
        <div v-if="level > 1" class="go-back" :class="isOpen ? 'open' : 'mini'" @click="goBack">
          返回上级
        </div>
        <el-table v-if="level == 1" :data="seriesData" class="custom-table">
          <el-table-column v-for="(item, ix) in qyHead" :prop="item.prop" :key="ix" :label="item.label">
            <template slot-scope="scope">
              <span v-if="item.prop == 'name'" class="underline-span"
                @click="nextClick({ name: scope.row.name }, item.prop)">{{
                    scope.row[item.prop]
                }}</span>
              <span v-else>{{
                  scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>

        <el-table v-else-if="level == 2" :data="seriesData" class="custom-table">
          <el-table-column v-for="(item, ix) in qyHead" :prop="item.prop" :key="ix" :label="item.label">
            <template slot-scope="scope">
              <span v-if="item.prop == 'value'" class="underline-span"
                @click="nextClick({ name: scope.row.name }, item.prop)">{{
                    scope.row[item.prop]
                }}</span>
              <span v-else>{{
                  scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </List>
</template>
<script>
import { mapState } from 'vuex'
import List from "@/components/layouts/list"
import commonMixins from '@/mixins/common.js'
import setTableHMixins from '@/mixins/setTableH.js'

export default {
  props: {
    // 保存图片的最后一级标题
    title: {
      type: String,
      default: "试验地区"
    },
    guanlian: {
      type: Object,
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  components: {
    List,
  },
  mixins: [
    commonMixins,
    setTableHMixins
  ],
  data() {
    return {
      mapName: "",
      loading: false,
      mapWidth: '100%',
      qyHead: [
        {
          prop: "name",
          label: "国家或地区",
          width: 50,
        },
        {
          prop: "value",
          label: "数量",
          width: 50,
        }
      ],
      seriesData: [],
      level: 1,
      nodata: false,
      mapJsonName: 'State',
      tableHeight: document.documentElement.clientHeight - 48 - 60 - 60,
      myChart: null,
      nameMaps: {
        "EastAsia": "东亚",
        "SoutheastAsia": "东南亚",
        "MiddleEast": "中东",
        "CentralAmerica": "中美洲",
        "NorthAsia": "北亚",
        "NorthAmerica": "北美洲",
        "SouthAsia": "南亚",
        "SouthAmerica": "南美洲",
        "Pacifica": "太平洋",
        "Europe": "欧洲",
        "Africa": "非洲"
      },
      countryName: {
        'Singapore Rep.': '新加坡',
        'Dominican Republic': '多米尼加',
        'Palestine': '巴勒斯坦',
        'Bahamas': '巴哈马',
        'Timor-Leste': '东帝汶',
        'Afghanistan': '阿富汗',
        'Guinea-Bissau': '几内亚比绍',
        "Côte D'Ivoire": '科特迪瓦',
        "Ivory Coast": '科特迪瓦',
        'Siachen Glacier': '锡亚琴冰川',
        "Br. Indian Ocean Ter.": '英属印度洋领土',
        'Angola': '安哥拉',
        'Albania': '阿尔巴尼亚',
        'United Arab Emirates': '阿联酋',
        'Argentina': '阿根廷',
        'Armenia': '亚美尼亚',
        'French Southern and Antarctic Lands': '法属南半球和南极领地',
        'Australia': '澳大利亚',
        'Austria': '奥地利',
        'Azerbaijan': '阿塞拜疆',
        'Burundi': '布隆迪',
        'Belgium': '比利时',
        'Benin': '贝宁',
        'Burkina Faso': '布基纳法索',
        'Bangladesh': '孟加拉国',
        'Bulgaria': '保加利亚',
        'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
        'Belarus': '白俄罗斯',
        'Belize': '伯利兹',
        'Bermuda': '百慕大',
        'Bolivia': '玻利维亚',
        'Brazil': '巴西',
        'Brunei Darussalam': '文莱',
        'Bhutan': '不丹',
        'Botswana': '博茨瓦纳',
        'Central African Republic': '中非',
        'Canada': '加拿大',
        'Switzerland': '瑞士',
        'Chile': '智利',
        'China': '中国',
        'Ivory Coast': '象牙海岸',
        'Cameroon': '喀麦隆',
        'Congo, The Democratic Republic of the': '刚果民主共和国',
        'Congo': '刚果',
        'Colombia': '哥伦比亚',
        'Costa Rica': '哥斯达黎加',
        'Cuba': '古巴',
        'N. Cyprus': '北塞浦路斯',
        'Cyprus': '塞浦路斯',
        'Czech Republic': '捷克',
        'Germany': '德国',
        'Djibouti': '吉布提',
        'Denmark': '丹麦',
        'Algeria': '阿尔及利亚',
        'Ecuador': '厄瓜多尔',
        'Egypt': '埃及',
        'Eritrea': '厄立特里亚',
        'Spain': '西班牙',
        'Estonia': '爱沙尼亚',
        'Ethiopia': '埃塞俄比亚',
        'Finland': '芬兰',
        'Fiji': '斐济',
        'Falkland Islands': '福克兰群岛',
        'France': '法国',
        'Gabon': '加蓬',
        'United Kingdom': '英国',
        'Georgia': '格鲁吉亚',
        'Ghana': '加纳',
        'Guinea': '几内亚',
        'Gambia': '冈比亚',
        'Guinea-Bissau': '几内亚比绍',
        'Equatorial Guinea': '赤道几内亚',
        'Greece': '希腊',
        'Greenland': '格陵兰',
        'Guatemala': '危地马拉',
        'French Guiana': '法属圭亚那',
        'Guyana': '圭亚那',
        'Honduras': '洪都拉斯',
        'Croatia': '克罗地亚',
        'Haiti': '海地',
        'Hungary': '匈牙利',
        'Indonesia': '印度尼西亚',
        'India': '印度',
        'Ireland': '爱尔兰',
        'Iran, Islamic Republic of': '伊朗',
        'Iraq': '伊拉克',
        'Iceland': '冰岛',
        'Israel': '以色列',
        'Italy': '意大利',
        'Jamaica': '牙买加',
        'Jordan': '约旦',
        'Japan': '日本',
        'Kazakhstan': '哈萨克斯坦',
        'Kenya': '肯尼亚',
        'Kyrgyzstan': '吉尔吉斯斯坦',
        'Cambodia': '柬埔寨',
        'Korea, Republic of': '韩国',
        'Kosovo': '科索沃',
        'Kuwait': '科威特',
        'Lao People’s Democratic Republic': '老挝',
        'Lebanon': '黎巴嫩',
        'Liberia': '利比里亚',
        'Libyan Arab Jamahiriya': '利比亚',
        'Sri Lanka': '斯里兰卡',
        'Lesotho': '莱索托',
        'Lithuania': '立陶宛',
        'Luxembourg': '卢森堡',
        'Latvia': '拉脱维亚',
        'Morocco': '摩洛哥',
        'Moldova, Republic of': '摩尔多瓦',
        'Madagascar': '马达加斯加',
        'Mexico': '墨西哥',
        'Macedonia, The Former Yugoslav Republic of': '马其顿',
        'Mali': '马里',
        'Myanmar': '缅甸',
        'Montenegro': '黑山',
        'Mongolia': '蒙古',
        'Mozambique': '莫桑比克',
        'Mauritania': '毛里塔尼亚',
        'Malawi': '马拉维',
        'Malaysia': '马来西亚',
        'Namibia': '纳米比亚',
        'New Caledonia': '新喀里多尼亚',
        'Niger': '尼日尔',
        'Nigeria': '尼日利亚',
        'Nicaragua': '尼加拉瓜',
        'Netherlands': '荷兰',
        'Norway': '挪威',
        'Nepal': '尼泊尔',
        'New Zealand': '新西兰',
        'Oman': '阿曼',
        'Pakistan': '巴基斯坦',
        'Panama': '巴拿马',
        'Peru': '秘鲁',
        'Philippines': '菲律宾',
        'Papua New Guinea': '巴布亚新几内亚',
        'Poland': '波兰',
        'Puerto Rico': '波多黎各',
        'Korea, Democratic People’s Republic of': '朝鲜',
        'Portugal': '葡萄牙',
        'Paraguay': '巴拉圭',
        'Qatar': '卡塔尔',
        'Romania': '罗马尼亚',
        'Russian Federation': '俄罗斯',
        'Rwanda': '卢旺达',
        'W. Sahara': '西撒哈拉',
        'Saudi Arabia': '沙特阿拉伯',
        'Sudan': '苏丹',
        'S. Sudan': '南苏丹',
        'Senegal': '塞内加尔',
        'Solomon Is.': '所罗门群岛',
        'Sierra Leone': '塞拉利昂',
        'El Salvador': '萨尔瓦多',
        'Somaliland': '索马里兰',
        'Somalia': '索马里',
        'Serbia': '塞尔维亚',
        'Suriname': '苏里南',
        'Slovakia': '斯洛伐克',
        'Slovenia': '斯洛文尼亚',
        'Sweden': '瑞典',
        'Swaziland': '斯威士兰',
        'Syrian Arab Republic': '叙利亚',
        'Chad': '乍得',
        'Togo': '多哥',
        'Thailand': '泰国',
        'Tajikistan': '塔吉克斯坦',
        'Turkmenistan': '土库曼斯坦',
        'East Timor': '东帝汶',
        'Trinidad and Tobago': '特里尼达和多巴哥',
        'Tunisia': '突尼斯',
        'Turkey': '土耳其',
        'Tanzania': '坦桑尼亚',
        'Uganda': '乌干达',
        'Ukraine': '乌克兰',
        'Uruguay': '乌拉圭',
        'United States': '美国',
        'Uzbekistan': '乌兹别克斯坦',
        'Venezuela': '委内瑞拉',
        'Vietnam': '越南',
        'Vanuatu': '瓦努阿图',
        'West Bank': '西岸',
        'Yemen': '也门',
        'South Africa': '南非',
        'Zambia': '赞比亚',
        'Zimbabwe': '津巴布韦',

        'Comoros': '科摩罗群岛',
        'Mauritius': '毛里求斯',
        'Mayotte': '马约特岛',
        'Réunion': '留尼汪岛',
        'Seychelles': '塞舌尔',
        'Antigua and Barbuda': '安提瓜和巴布达',
        'Aruba': '阿鲁巴',
        'Barbados': '巴巴多斯',
        'Cayman Islands': '开曼群岛',
        'Dominica': '多米尼克',
        'Grenada': '格林纳达',
        'Guadeloupe': '瓜德罗普',
        'Martinique': '马提尼克',
        'Montserrat': '蒙特色拉特',
        'Saint Kitts and Nevis': '圣基茨和尼维斯',
        'Saint Lucia': '圣卢西亚',
        'Saint Vincent and the Grenadines': '圣文森特和格林纳丁斯',
        'Virgin Islands (U.S.)': '美属维尔京群岛',
        'Hong Kong': '中国香港',
        'Taiwan': '中国台湾',
        'Andorra': '安道尔',
        'Faroe Islands': '法罗群岛',
        'Gibraltar': '直布罗陀',
        'Holy See (Vatican City State)': '梵蒂冈',
        'Jersey': '泽西岛',
        'Liechtenstein': '列支敦士登',
        'Malta': '马耳他',
        'Monaco': '摩纳哥',
        'San Marino': '圣马力诺',
        'Bahrain': '巴林',
        'Guam': '关岛',
        'Palau': '帕劳',
        'Samoa': '萨摩亚',
        'Maldives': '马尔代夫',
        'Solomon Islands': '所罗门群岛',
        'Northern Mariana Islands': '北马里亚纳群岛邦',
        'Kiribati': '基里巴斯',
        'American Samoa': '美属萨摩亚',
        'French Polynesia': '法属波利尼西亚',
        'Netherlands Antilles': '列斯群岛'
      }
    }
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      allBase: state => state.Clinical.allBase,
      tableconf: state => state.Clinical.tableconf,
      cateList: state => _.keys(state.Clinical.cateList).length && state.Clinical.cateList.res && state.Clinical.cateList.res.length ? state.Clinical.cateList.res : [],
      listLoading: state => state.Clinical.listLoading,
      cateCount: state => state.Clinical.cateCount,
      cateNum: state => state.Clinical.cateNum && state.Clinical.cateNum.length ? state.Clinical.cateNum : [],
      changeBox: state => state.Clinical.changeBox,
      cate_param_one: state => state.Clinical.cate_param_one,
      param: state => state.Clinical.param,
      mapGeoJson: state => state.Clinical.mapGeoJson,
    }),
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven(10);
  },
  watch: {
    cateList: {
      handler(val) {
        // this.nodata = val.length ? false : true
        this.$nextTick(() => {
          this.registerEven(10)
          this.mapData()
        })
      }
    },
    qyHead: {
      handler(val) {
        this.$nextTick(() => {
          this.registerEven(10)
        })
      }
    },
    cateNum: {
      handler(val) {
        // this.nodata = val.length ? false : true
        this.$nextTick(() => {
          this.registerEven(10)
          this.mapJsonName = 'State'
          this.mapData()
        })
      }
    }
  },
  methods: {
    goBack() {
      this.level = 1;
      this.mapJsonName = 'State'
      this.mapData()
    },
    mapData() {
      this.loading = true;
      if (this.mapGeoJson[this.mapJsonName]) {
        this.drawMap(this.mapGeoJson[this.mapJsonName])
      } else {
        window.Axios.get('/static/geoJson/' + this.mapJsonName + '.json').then(res => {
          if (res.status === 200) {
            this.mapGeoJson[this.mapJsonName] = res.data
            this.drawMap(res.data)
          }
        })
      }
      this.resizeEvent()
    },
    drawMap(mapdata) {
      const _this = this
      let seriesData = []
      let id = this.isOpen ? 'statemap-open' : 'statemap'
      let statemapId = document.getElementById(id)
      if (!statemapId) return
      if (this.myChart) {
        this.myChart.clear()
        this.myChart.off()
      }

      if (this.mapJsonName === 'State') {
        seriesData = _.sortBy(this.cateNum, function (item) {
          return -item.doc_count
        })
        seriesData.forEach(e => e.value = e.doc_count)
      } else {
        seriesData = this.cateList
        seriesData.forEach(e => {
          e.value = e.doc_count
          e.name = e.label
        })
      }
      this.seriesData = seriesData

      Echarts.registerMap(this.mapJsonName, mapdata)
      this.myChart = Echarts.getInstanceByDom(
        statemapId
      );
      if (this.myChart) {
        this.myChart.clear()
        this.myChart.off('click');
      }
      this.myChart = Echarts.init(statemapId, 'yaozh_theme')
      let option = {
        toolbox: {
          top: 50,
          right: 30,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-智能分析-${this.title}`,
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return `${params.name}<br/>数量：${params.value ? params.value : 0}`
          },
        },
        visualMap: {
          min: 0,
          max: seriesData.length ? seriesData[0].value : 0,
          left: 30,
          bottom: 0,
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
        },
        series: [{
          type: 'map',
          map: this.mapJsonName,
          zoom: 1, //当前视角的缩放比例
          roam: true, //是否开启平游或缩放
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          nameMap: this.mapJsonName === 'State' ? this.nameMaps : this.countryName,
          data: seriesData
        }]
      }
      if (this.isOpen) {
        if (option.toolbox.feature.myMagnify) delete option.toolbox.feature.myMagnify;
      } else {
        option.toolbox.feature.myMagnify = {
          show: true,
          title: "全屏",
          icon: "image:///static/imgs/echarts/fullscreen.png",
          onclick() {
            _this.$emit('fullscreen')
          }
        }
      }
      this.myChart.setOption(option)

      this.loading = false;
      this.myChart.on('click', function (params) {
        _this.nextClick(params)
      })
    },
    nextClick(params, pop) {
      let _this = this

      let hz = ""
      if (pop === "name") {
        hz = "_table"
      } else if (pop === "value") {
        hz = "_tablenum"
      } else {
        hz = ""
      }

      if (this.level == 1) {
        this.loading = true;
        this.level = 2;
        this.mapName = params.name;

        window.ga("send", "event", "option", "click", "clinical_conditions_map_" + params.name + hz)
        window._paq.push(['trackEvent', 'option', 'click', "clinical_conditions_map_" + params.name + hz])

        let name = Object.keys(_this.nameMaps).filter(e => _this.nameMaps[e] === params.name)[0]
        _this.mapJsonName = name
        let paramsObj = _.assign(_this.param, { action: 'locations2_guifan', locations1_guifan: params.name })
        Store.dispatch('Clinical/getSydqData', paramsObj)

        this.loading = false
      } else {

        window.ga("send", "event", "option", "click", "clinical_conditions_map_" + _this.nameMaps[_this.mapJsonName] + '_' + params.name + hz)
        window._paq.push(['trackEvent', 'option', 'click', "clinical_conditions_map_" + _this.nameMaps[_this.mapJsonName] + '_' + params.name + hz])

        _this.vueExtendTo('/clinical?' + 'locations1_guifan=' + this.mapName + '&locations2_guifan1=' + params.name)
        // const { href } = this.$router.resolve({
        //   path: `/clinical/list`,
        //   query: {
        //     filter_condition: JSON.stringify({
        //       locations1_guifan: [this.mapName],
        //       locations2_guifan1: [params.name]
        //     })
        //   }
        // });
        // window.open(href, "_blank");
      }
    },
    resizeEvent() {
      // if(this.$route.path === '/clinical/cate'){
      const that = this;
      this.mapWidth = 'calc(100% - ' + $(".map-table").width() + "px - 10px)"
      this.$nextTick(() => {
        that.myChart && that.myChart.resize()
      })
      // }
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEvent)
  },
  mounted() {
    window.addEventListener('resize', this.resizeEvent)
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
      window._paq.push(['setDocumentTitle', this.allBase.dbname])
    }, 1000);
  },
  updated() {

  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/app.less";

.go-back {
  width: 70px;
  height: 24px;
  line-height: 24px;
  background: #F4A622;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  position: absolute;
  left: 0;
  top: 50px;
  z-index: 99;
}

.map-table {
  position: relative;
  width: 20%;
  padding: 50px 10px 0 0;
  box-sizing: border-box;

  /deep/.el-table thead th>.cell {
    height: auto !important;
    line-height: auto !important;
    justify-content: center;
    padding: 0 !important;
  }

  /deep/.el-table tbody td>.cell {
    padding-left: 0 !important;
  }

  /deep/.el-table tbody tr td:last-child {
    padding-right: 0 !important;
  }

  .custom-table {
    margin-top: 30px;
    max-height: calc(100% - 40px);
    overflow-y: auto;
  }
}

.underline-span {
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: @PrimaryColor;
    color: #4877e8;
  }
}

/deep/.el-table {
  td,
  th {
    text-align: center;
    border-right: 1px solid #ebeef5;
  }

  td:first-child,
  th:first-child {
    border-left: 1px solid #ebeef5;
  }

  th {
    padding: 8px 0px;
    background-color: #F5F8FB;
    border-top: 1px solid #ebeef5;
  }
}

/deep/.el-table:before {
  height: 0;
  background-color: #fff;
}

/deep/.el-table--fit {
  border-bottom: 1px solid #ebeef5;
}
</style>
