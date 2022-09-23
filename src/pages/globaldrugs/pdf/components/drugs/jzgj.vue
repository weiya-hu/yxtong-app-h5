<template>
  <div class="jzgj">
    <div class="part-title">同活性成分竞争格局</div>
    <template v-if="bdtj.length">
      <div class="part-sub-title">靶点统计:</div>
      <div class="table">
        <table>
          <tr>
            <th>靶点名称</th>
            <th>临床前</th>
            <th>临床申请</th>
            <th>临床Ⅰ期</th>
            <th>临床Ⅱ期</th>
            <th>临床Ⅲ期</th>
            <th>注册申请</th>
            <th>批准上市</th>
            <th>其他</th>
            <th>总计</th>
          </tr>
          <tr v-for="(row, idx) in bdtj" :key="idx">
            <td>
              <div>{{ row.name }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status10 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status20 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status30 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status40 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status50 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status60 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status70 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.status0 }}</div>
            </td>
            <td>
              <div style="text-align: center">{{ row.total }}</div>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template v-if="ywjd.length">
      <div class="part-sub-title">药品进度:</div>
      <div class="table">
        <table>
          <tr>
            <th style="width: 80px">药品类型</th>
            <th style="width: 80px">药品名称</th>
            <th style="width: 420px">
              <div class="combine-head">
                <div>临床前</div>
                <div>临床申请</div>
                <div>临床Ⅰ期</div>
                <div>临床Ⅱ期</div>
                <div>临床Ⅲ期</div>
                <div>注册申请</div>
                <div>批准上市</div>
              </div>
            </th>
            <th style="width: 100px">适应症</th>
            <th>研发企业</th>
          </tr>
          <tr v-for="(row, idx) in ywjd" :key="idx">
            <td v-if="ywjd_span_map[row.cate].start==idx"
            :rowspan="ywjd_span_map[row.cate].rowspan"
            >
              <div>{{ row.cate }}</div>
            </td>
            
            <td>
              <div>{{ row.drugname_standard }}</div>
            </td>
            <td>
              <div
                class="line"
                v-if="findEnumIndex(row.worldstatus.status) >= 0"
              >
                <div
                  v-for="(c, i) in global_line_map"
                  :key="c"
                  :style="{
                    backgroundColor: c,
                    left: -i * 3 + '%',
                    zIndex: 10 - i,
                  }"
                  class="line-item"
                  v-if="findEnumIndex(row.worldstatus.status) >= i"
                >
                  <span
                    :class="[
                      'line-item_label',
                      findEnumIndex(row.worldstatus.status) < 3 ? 'dark' : '',
                    ]"
                    v-if="findEnumIndex(row.worldstatus.status) == i"
                    :style="{
                      'font-size': '12px',
                      left: `calc((97% - 70px) / 1.3)`,
                    }"
                    >{{ row.worldstatus.date }}</span
                  >
                </div>
              </div>
            </td>
            <td>
              <div>{{ row.indication }}</div>
            </td>
            <td>
              <div>
                <p v-for="(t, i) in row.company_standard" :key="i">
                  <span>{{ t.name }}</span>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template>
      <div class="part-sub-title">药品分布:</div>
      <div class="table" v-if="formatMapData.length">
        <table>
          <tr>
            <th>国家或地区</th>
            <th>数量</th>
          </tr>
          <tr v-for="(row, idx) in formatMapData" :key="idx">
            <td>
              <div>{{ row.name }}</div>
            </td>
            <td>
              <div>{{ row.value }}</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="chart" id="map-globaldrugs"></div>
      <div class="chart" id="phase-bar-globaldrugs" ref="ypfbdata"></div>
    </template>
  </div>
</template>

<script>
import "../../../../../../node_modules/echarts/map/js/world.js";

export default {
  name: "pdf-jzgj",
  props: {
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  data() {
    return {
      bdtj: [],
      ywjd: [],
      phase: [],
      formatMapData: [],
      ywjd_span_map:{},
      global_line_map: [
        "#E5EFFE",
        "#CADAFF",
        "#A3C4FC",
        "#82ABF9",
        "#467FF7",
        "#2C66F6",
        "#002FA7",
      ],
      ypfb_bar: null,
      nameMap: {
        Afghanistan: "阿富汗",
        Singapore: "新加坡",
        Angola: "安哥拉",
        Albania: "阿尔巴尼亚",
        "United Arab Emirates": "阿联酋",
        Argentina: "阿根廷",
        Armenia: "亚美尼亚",
        "French Southern and Antarctic Lands": "法属南半球和南极领地",
        Australia: "澳大利亚",
        Austria: "奥地利",
        Azerbaijan: "阿塞拜疆",
        Burundi: "布隆迪",
        Belgium: "比利时",
        Benin: "贝宁",
        "Burkina Faso": "布基纳法索",
        Bangladesh: "孟加拉国",
        Bulgaria: "保加利亚",
        "The Bahamas": "巴哈马",
        "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
        Belarus: "白俄罗斯",
        Belize: "伯利兹",
        Bermuda: "百慕大",
        Bolivia: "玻利维亚",
        Brazil: "巴西",
        Brunei: "文莱",
        Bhutan: "不丹",
        Botswana: "博茨瓦纳",
        "Central African Republic": "中非共和国",
        Canada: "加拿大",
        Switzerland: "瑞士",
        Chile: "智利",
        China: "中国（总）",
        "Ivory Coast": "象牙海岸",
        Cameroon: "喀麦隆",
        "Democratic Republic of the Congo": "刚果民主共和国",
        "Republic of the Congo": "刚果共和国",
        Colombia: "哥伦比亚",
        "Costa Rica": "哥斯达黎加",
        Cuba: "古巴",
        "Northern Cyprus": "北塞浦路斯",
        Cyprus: "塞浦路斯",
        "Czech Republic": "捷克共和国",
        Germany: "德国",
        Djibouti: "吉布提",
        Denmark: "丹麦",
        "Dominican Republic": "多明尼加共和国",
        Algeria: "阿尔及利亚",
        Ecuador: "厄瓜多尔",
        Egypt: "埃及",
        Eritrea: "厄立特里亚",
        Spain: "西班牙",
        Estonia: "爱沙尼亚",
        Ethiopia: "埃塞俄比亚",
        Finland: "芬兰",
        Fiji: "斐",
        "Falkland Islands": "福克兰群岛",
        France: "法国",
        Gabon: "加蓬",
        "United Kingdom": "英国",
        Georgia: "格鲁吉亚",
        Ghana: "加纳",
        Guinea: "几内亚",
        Gambia: "冈比亚",
        "Guinea Bissau": "几内亚比绍",
        Greece: "希腊",
        Greenland: "格陵兰",
        Guatemala: "危地马拉",
        "French Guiana": "法属圭亚那",
        Guyana: "圭亚那",
        Honduras: "洪都拉斯",
        Croatia: "克罗地亚",
        Haiti: "海地",
        Hungary: "匈牙利",
        Indonesia: "印度尼西亚",
        India: "印度",
        Ireland: "爱尔兰",
        Iran: "伊朗",
        Iraq: "伊拉克",
        Iceland: "冰岛",
        Israel: "以色列",
        Italy: "意大利",
        Jamaica: "牙买加",
        Jordan: "约旦",
        Japan: "日本",
        Kazakhstan: "哈萨克斯坦",
        Kenya: "肯尼亚",
        Kyrgyzstan: "吉尔吉斯斯坦",
        Cambodia: "柬埔寨",
        Kosovo: "科索沃",
        Kuwait: "科威特",
        Laos: "老挝",
        Lebanon: "黎巴嫩",
        Liberia: "利比里亚",
        Libya: "利比亚",
        "Sri Lanka": "斯里兰卡",
        Lesotho: "莱索托",
        Lithuania: "立陶宛",
        Luxembourg: "卢森堡",
        Latvia: "拉脱维亚",
        Morocco: "摩洛哥",
        Moldova: "摩尔多瓦",
        Madagascar: "马达加斯加",
        Mexico: "墨西哥",
        Macedonia: "马其顿",
        Mali: "马里",
        Myanmar: "缅甸",
        Montenegro: "黑山",
        Mongolia: "蒙古",
        Mozambique: "莫桑比克",
        Mauritania: "毛里塔尼亚",
        Malawi: "马拉维",
        Malaysia: "马来西亚",
        Namibia: "纳米比亚",
        "New Caledonia": "新喀里多尼亚",
        Niger: "尼日尔",
        Nigeria: "尼日利亚",
        Nicaragua: "尼加拉瓜",
        Netherlands: "荷兰",
        Norway: "挪威",
        Nepal: "尼泊尔",
        "New Zealand": "新西兰",
        Oman: "阿曼",
        Pakistan: "巴基斯坦",
        Panama: "巴拿马",
        Peru: "秘鲁",
        Philippines: "菲律宾",
        "Papua New Guinea": "巴布亚新几内亚",
        Poland: "波兰",
        "Puerto Rico": "波多黎各",
        "North Korea": "北朝鲜",
        Portugal: "葡萄牙",
        Paraguay: "巴拉圭",
        Qatar: "卡塔尔",
        Romania: "罗马尼亚",
        Russia: "俄罗斯",
        Rwanda: "卢旺达",
        "Western Sahara": "西撒哈拉",
        "Saudi Arabia": "沙特阿拉伯",
        Sudan: "苏丹",
        "South Sudan": "南苏丹",
        Senegal: "塞内加尔",
        "Solomon Islands": "所罗门群岛",
        "Sierra Leone": "塞拉利昂",
        "El Salvador": "萨尔瓦多",
        Somaliland: "索马里兰",
        Somalia: "索马里",
        "Republic of Serbia": "塞尔维亚",
        Suriname: "苏里南",
        Slovakia: "斯洛伐克",
        Slovenia: "斯洛文尼亚",
        Sweden: "瑞典",
        Swaziland: "斯威士兰",
        Syria: "叙利亚",
        Chad: "乍得",
        Togo: "多哥",
        Thailand: "泰国",
        Tajikistan: "塔吉克斯坦",
        Turkmenistan: "土库曼斯坦",
        "East Timor": "东帝汶",
        "Trinidad and Tobago": "特里尼达和多巴哥",
        Tunisia: "突尼斯",
        Turkey: "土耳其",
        "United Republic of Tanzania": "坦桑尼亚",
        Uganda: "乌干达",
        Ukraine: "乌克兰",
        Uruguay: "乌拉圭",
        "United States": "美国",
        Uzbekistan: "乌兹别克斯坦",
        Venezuela: "委内瑞拉",
        Vietnam: "越南",
        Vanuatu: "瓦努阿图",
        "West Bank": "西岸",
        Yemen: "也门",
        "South Africa": "南非",
        Zambia: "赞比亚",
        Korea: "韩国",
        Tanzania: "坦桑尼亚",
        Zimbabwe: "津巴布韦",
        Congo: "刚果",
        "Central African Rep.": "中非",
        Serbia: "塞尔维亚",
        "Bosnia and Herz.": "波黑",
        "Czech Rep.": "捷克",
        "W. Sahara": "西撒哈拉",
        "Lao PDR": "老挝",
        "Dem.Rep.Korea": "朝鲜",
        "Falkland Is.": "福克兰群岛",
        "Timor-Leste": "东帝汶",
        "Solomon Is.": "所罗门群岛",
        Palestine: "巴勒斯坦",
        "N. Cyprus": "北塞浦路斯",
        Aland: "奥兰群岛",
        "Fr. S. Antarctic Lands": "法属南半球和南极陆地",
        Mauritius: "毛里求斯",
        Comoros: "科摩罗",
        "Eq. Guinea": "赤道几内亚",
        "Guinea-Bissau": "几内亚比绍",
        "Dominican Rep.": "多米尼加",
        "Saint Lucia": "圣卢西亚",
        Dominica: "多米尼克",
        "Antigua and Barb.": "安提瓜和巴布达",
        "U.S. Virgin Is.": "美国原始岛屿",
        Montserrat: "蒙塞拉特",
        Grenada: "格林纳达",
        Barbados: "巴巴多斯",
        Samoa: "萨摩亚",
        Bahamas: "巴哈马",
        "Cayman Is.": "开曼群岛",
        "Faeroe Is.": "法罗群岛",
        "IsIe of Man": "马恩岛",
        Malta: "马耳他共和国",
        Jersey: "泽西",
        "Cape Verde": "佛得角共和国",
        "Turks and Caicos Is.": "特克斯和凯科斯群岛",
        "St. Vin. and Gren.": "圣文森特和格林纳丁斯",
      },
    };
  },
  methods: {
    drawPhaseBar(x, s) {
      this.ypfb_bar = Echarts.init(
        document.getElementById("phase-bar-globaldrugs"),
        "westeros"
      );
      this.ypfb_bar.clear();
      let options = {
        // color: [
        //   "#91C332",
        //   "#91adf1",
        //   "#fbc78e",
        //   "#ff9a75",
        //   "#56596C",
        //   "#E0E0E0",
        // ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        // legend: {
        //   textStyle: {
        //     color: "#87A2EE",
        //   },
        //   itemGap: 40,
        //   icon: "rect",
        //   bottom: 20,
        //   itemWidth: 20,
        //   itemHeight: 20,
        //   selector: false,
        //   data: _that.ypfb_bar.xAxis1_data,
        // },
        grid: {
          right: 40,
          top: "10%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          name: "数量",
          nameTextStyle: {
            color: "#87A2EE",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            show: false,
          },
          type: "value",
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: "研发状态",
          nameTextStyle: {
            color: "#87A2EE",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            color: "#545b6d",
          },
          type: "category",
          data: x,
          splitLine: {
            show: false,
          },
        },
        backgroundColor: "#FAFBFD",
        series: {
          type: "bar",
          barMaxWidth: 30,
          data: s,
        },
      };
      this.ypfb_bar.setOption(options);
    },
    findEnumIndex(num) {
      let enums = [10, 20, 30, 40, 50, 60, 70];
      return enums.findIndex((t) => t == num);
    },
     // 绘制全部地图
    worldConfigure(worldData) {
      if (!worldData.length) {
        return;
      }
      let _that = this;
      let max = _.maxBy(worldData, "value").value;
      this.ypfb_map = Echarts.init(
        document.getElementById("map-globaldrugs"),
        "westeros"
      );
      console.log(this.ypfb_map, "this.ypfb_map");
      this.ypfb_map && this.ypfb_map.clear();
      this.ypfb_map.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            if (params.name) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
              }`;
            }
          },
        },
        visualMap: {
          min: 0,
          max: worldData.length ? worldData[0].value : 0,
          left: 30,
          bottom: 0,
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
        },
        backgroundColor: "#FAFBFD",
        series: [
          {
            type: "map",
            mapType: "world",
            zoom: 1, //当前视角的缩放比例
            roam: true, //是否开启平游或缩放
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            nameMap: this.nameMap,
            data: worldData,
          },
        ],
      });
    },
    dataGet() {
      Axios({
        url: "/api/globaldrugs/scape",
        params: {
          drugname_standard: this.drugname_standard,
          position: 0,
          pageSize: 10,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          if (!this.isEmpty(res.data.data)) {
            return;
          }
          this.bdtj = res.data.data.target.list;
          this.ywjd = res.data.data.progress.list;
          this.ywjd_span_map = res.data.data.progress.list.reduce(
              (p, c, i) => {
                if (p[c.cate]) {
                  p[c.cate]["rowspan"] += 1;
                } else {
                  p[c.cate] = {
                    rowspan: 1,
                    start: i,
                  };
                }
                return p;
              },
              {}
            )
          let phase = res.data.data.distribution.phase;
          let mapData = res.data.data.distribution.map;
          this.phase = phase;
          if (phase.length) {
            let phaseColorBlock = [
              {
                color: "#EBEEF5",
                label: "其他",
              },
              {
                color: "#F0F3FA",
                label: "临床前",
              },
              {
                color: "#E2E7F3",
                label: "临床申请",
              },
              {
                color: "#D9DFF0",
                label: "临床Ⅰ期",
              },
              {
                color: "#CFD9F5",
                label: "临床Ⅱ期",
              },
              {
                color: "#C2CFF2",
                label: "临床Ⅲ期",
              },
              {
                color: "#B4C3ED",
                label: "注册申请",
              },
              {
                color: "#A0B5EF",
                label: "批准上市",
              },
            ];
            phase = phase.reverse();
            let x_axis1_data = [];
            let series1_data = [];
            phase.forEach((item) => {
              x_axis1_data.push(item.name);
              let color = phaseColorBlock.filter(
                (phase) => phase.label === item.name
              );
              let obj = {
                value: item.count,
                itemStyle: {
                  color: color && color[0].color,
                },
              };
              series1_data.push(obj);
            });
            this.drawPhaseBar(x_axis1_data, series1_data);
          }
          if (mapData.length) {
            this.formatMapData = mapData.map((item) => ({
              name: item.label,
              value: item.doc_count,
            }));
            this.worldConfigure(this.formatMapData);
          }
          if (this.bdtj.length == 0 && this.ywjd.length == 0) {
            this.$root.$emit('hide-page','竞争格局')
          }
        } else {
          this.$root.$emit('hide-page','竞争格局')
        }
      })
      .finally(() => {
          this.$root.$emit("load-page", "竞争格局");
      })
      ;
    },
  },
  mounted() {
    this.dataGet();
  },
};
</script>

<style scoped lang="less">
.part-title {
  font-size: 22px;
  font-weight: bold;
  color: #002fa7;
  margin-bottom: 10px;
  border-left: 4px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
}
.part-sub-title {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  border-left: 2px solid #002fa7;
  line-height: 1;
  padding-left: 5px;
  margin-left: 10px;
}
.table {
  position: relative;
  padding-left: 10px;
  min-height: 50px;
  table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    border-spacing: 0;
    th {
      height: 30px;
      background-color: #ebeef5;
      font-size: 12px;
    }
    td {
      padding: 5px;
      border: 1px solid #ebeef5;
      word-break: break-all;
      font-size: 12px;
      & > div {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}
.combine-head {
  display: flex;
  width: 420px;
  div {
    width: 60px;
  }
}
.line {
  width: 100%;
  white-space: nowrap;
  padding: 3px 0;
  box-sizing: border-box;
  height: 20px;
  &-item {
    height: 14px;
    border-radius: 7px;
    width: calc(100% / 6);
    position: relative;
    display: inline-flex;
    &:last-child {
      z-index: 10 !important;
    }
    .line-item_label {
      font-size: 12px;
      color: #fff;
      position: absolute;
      line-height: 14px;
      right: calc(20%);
    }
  }
}
.chart {
  margin: 20px auto 20px;
  height: 280px;
}
</style>