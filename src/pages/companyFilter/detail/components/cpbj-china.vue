<template>
  <div class="cpbj-box">
    <LoadingGif
      :loadFlag="isLoading"
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      v-if="isLoading"
    />

    <div class="chart-boxs">
      <!-- 国家分布 -->
      <div class="chart-box">
        <div class="chart-title">国家分布</div>
        <div class="echarts" id="gjfbChina">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 药品类型 -->
      <div class="chart-box">
        <div class="chart-title">药品类型</div>
        <div class="echarts" id="cplbChina">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 药品分类 -->
      <div class="chart-box">
        <div class="chart-title">药品分类</div>
        <div class="echarts" id="yplxChina">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 项目阶段布局 -->
      <div class="chart-box">
        <div class="chart-title">项目阶段布局</div>
        <div class="echarts" id="xmjdChina">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>

      <!-- 治疗领域布局 -->
      <div class="chart-box zllyChina">
        <div class="chart-title">治疗领域布局</div>
        <div class="echarts" id="zllyChina">
          <div class="no-data">
            <img src="/static/imgs/trz/no_data.png" alt="" />
            <div class="text">暂无相关数据</div>
          </div>
        </div>
      </div>
    </div>
    <Target :countries="'国内'" :qiyemingcheng="qiyemingcheng"></Target>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import Target from "./target.vue";
import "../../../../../node_modules/echarts/map/js/world.js"; // 引入世界地图数据
export default {
  components: {
    LoadingGif,
    Target,
  },
  props: {
    qiyemingcheng: {
      type: String,
    },
  },
  data() {
    return {
      isLoading: true,
      chinaData: {}, // 数据源
      cplbChinaArr: ["研发中", "已上市", "其他"],
    };
  },
  computed: {},
  watch: {},
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chinaResize();
    });
  },
  mounted() {
    this.getCpbjAll();
    window.addEventListener("resize", () => {
      this.chinaResize();
    });
  },
  methods: {
    chinaResize() {
      this.$nextTick(() => {
        this.echartsResize("gjfbChina");
        this.echartsResize("cplbChina");
        this.echartsResize("yplxChina");
        this.echartsResize("xmjdChina");
        this.echartsResize("zllyChina");
      });
    },
    echartsResize(id) {
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    // 获取数据
    getCpbjAll() {
      // if (Object.keys(this.chinaData).length>0) {
      //   this.isLoading = false;
      //   return
      // }
      window
        .Axios({
          method: "get",
          url: "/api/company_filter/companyProducts",
          params: {
            id: this.$route.params.id,
            countries: "国内",
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.chinaData = res.data.data;
            this.$nextTick(() => {
              this.worldConfigure(res.data.data.country);
              this.cplbChinaConfigure(res.data.data.leibie);
              this.yplxChinaConfigure(res.data.data.leixing);
              this.xmjdChinaConfigure(res.data.data.phase);
              this.zllyChinaConfigure(res.data.data.indication);
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 绘制全部地图
    worldConfigure(worldData) {
      if (!worldData.length) {
        return;
      }
      let that = this;
      var newArr = [];
      for (var i = 0; i < worldData.length; i++) {
        let c = worldData[i];
        var json = {
          name: c.country,
          value: Number(c.doc_count),
        };
        newArr.push(json);
      }
      let max = _.maxBy(newArr, "value").value;
      console.log(max);
      let myChart = Echarts.init(
        document.getElementById("gjfbChina"),
        "yaozh_theme"
      );
      myChart.setOption({
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-国家分布`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
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
          China: "中国",
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
        visualMap: {
          min: 0,
          max: max,
          left: "30",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
        },
        roamController: {
          show: true,
          left: "right",
          mapTypeControl: {
            world: true,
          },
        },
        series: [
          {
            type: "map",
            mapType: "world",
            roam: false,
            label: {
              show: false,
              color: "rgb(0, 0, 0)",
            },
            data: newArr,
          },
        ],
      });
    },

    // 绘制药品类型堆叠图
    cplbChinaConfigure(cplbChinaData) {
      var _len = cplbChinaData.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data_len = this.cplbChinaArr.length;
      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(cplbChinaData[k].label);
        }

        for (var j = 0; j < legend_data_len; j++) {
          let tempArr = [];
          for (var l = 0; l < cplbChinaData.length; l++) {
            tempArr.push(
              cplbChinaData[l].children[j] !== undefined
                ? cplbChinaData[l].children[j].doc_count
                : 0
            );
          }
          series_data[j] = tempArr;
        }

        for (var i = 0; i < legend_data_len; i++) {
          series_data_result.push({
            name: this.cplbChinaArr[i],
            type: "bar",
            stack: "药品类型",
            barMaxWidth: 60,
            data: series_data[i],
          });
        }
        let myChart = Echarts.init(
          document.getElementById("cplbChina"),
          "yaozh_theme"
        );
        myChart.setOption({
          legend: {
            type: "scroll",
            bottom: 0,
            data: this.cplbChinaArr,
          },
          toolbox: {
            top: 20,
            right: 20,
            show: true,
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-${document.title}-药品类型`,
                icon: "image:///static/imgs/echarts/download.png",
              },
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          xAxis: {
            type: "value",
          },
          yAxis: {
            type: "category",
            data: yAxis_data,
          },
          series: series_data_result,
        });
      }
    },

    // 绘制药品分类堆叠图
    yplxChinaConfigure(cplbChinaData) {
      var _len = cplbChinaData.length;
      var yAxis_data = [];
      var series_data = [[]];
      var series_data_result = [];
      var legend_data_len = this.cplbChinaArr.length;
      if (_len > 0) {
        for (var k = 0; k < _len; k++) {
          yAxis_data.push(cplbChinaData[k].label);
        }

        for (var j = 0; j < legend_data_len; j++) {
          let tempArr = [];
          for (var l = 0; l < cplbChinaData.length; l++) {
            tempArr.push(
              cplbChinaData[l].children[j] !== undefined
                ? cplbChinaData[l].children[j].doc_count
                : 0
            );
          }
          series_data[j] = tempArr;
        }

        for (var i = 0; i < legend_data_len; i++) {
          series_data_result.push({
            name: this.cplbChinaArr[i],
            type: "bar",
            stack: "药品分类",
            barMaxWidth: 60,
            data: series_data[i],
          });
        }
        console.log(series_data_result);
        let myChart = Echarts.init(
          document.getElementById("yplxChina"),
          "yaozh_theme"
        );
        myChart.setOption({
          legend: {
            type: "scroll",
            bottom: 0,
            data: this.cplbChinaArr,
          },
          toolbox: {
            top: 20,
            right: 20,
            show: true,
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-${document.title}-药品分类`,
                icon: "image:///static/imgs/echarts/download.png",
              },
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          xAxis: {
            type: "value",
          },
          yAxis: {
            type: "category",
            data: yAxis_data,
          },
          series: series_data_result,
        });
      }
    },

    // 项目阶段
    xmjdChinaConfigure(data) {
      console.log(data);
      if (!data.length) {
        return;
      }
      var xAxis_data = [];
      var series_data = [];
      for (var k = 0; k < data.length; k++) {
        xAxis_data.push(data[k].label);
        series_data.push(data[k].doc_count);
      }

      let myChart = Echarts.init(
        document.getElementById("xmjdChina"),
        "yaozh_theme"
      );
      myChart.setOption({
        tooltip: {
          trigger: "item",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: "{b}<br />数量: {c}",
        },
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-项目阶段布局`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        xAxis: {
          type: "category",
          data: xAxis_data,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: series_data,
            type: "bar",
            barMaxWidth: 60,
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      });
    },

    // 治疗领域布局
    zllyChinaConfigure(data) {
      var _len = data.length;
      if (!_len) {
        return;
      }
      var xAxis_data = [];
      var series_data = [[], [], []];
      for (var k = 0; k < data.length; k++) {
        xAxis_data.push(data[k].label);
        for (var j = 0; j < this.cplbChinaArr.length; j++) {
          series_data[j].push(data[k].children[j].doc_count);
        }
      }

      console.log(series_data);
      let myChart = Echarts.init(
        document.getElementById("zllyChina"),
        "yaozh_theme"
      );
      myChart.setOption({
        legend: {
          type: "scroll",
          top: 0,
          data: this.cplbChinaArr,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        dataZoom: [
          {
            id: "dataZoomX",
            show: true,
            startValue: 0,
            endValue: 9,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: "rgba(167,183,204,0.4)", // 选中的填充颜色
            bottom: 0, // 组件离容器下侧的距离,'20%'
            height: 25, //这里可以设置dataZoom的尺寸
          },
        ],
        grid: [
          {
            bottom: 30,
            containLabel: true,
          },
        ],
        toolbox: {
          top: 20,
          right: 20,
          show: true,
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-${document.title}-治疗领域布局`,
              icon: "image:///static/imgs/echarts/download.png",
            },
          },
        },
        xAxis: {
          type: "category",
          data: xAxis_data,
          axisLabel: {
            rotate: 30,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: series_data[0],
            type: "bar",
            name: "研发中",
            barMaxWidth: 60,
          },
          {
            data: series_data[1],
            type: "bar",
            name: "已上市",
            barMaxWidth: 60,
          },
          {
            data: series_data[2],
            type: "bar",
            name: "其他",
            barMaxWidth: 60,
          },
        ],
      });
    },
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.cpbj-box {
  .fullscreen-loading {
    background: rgba(255, 255, 255, 1);
  }

  .chart-boxs {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .chart-box {
      box-sizing: border-box;
      position: relative;
      display: inline-block;
      margin: 5px 0px;
      width: calc(50% - 5px);
      background: #fafbfd;
      border-radius: 3px;

      .chart-title {
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
        background: #ebeef5;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
      }

      .echarts {
        height: 366px;
        width: calc(100% - 20px);
        margin: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .no-data {
          text-align: center;
          color: #999;
        }
      }
    }

    .zllyChina,
    .ypyf {
      width: calc(100% - 5px) !important;
    }
  }

  @media screen and (max-width: 1500px) {
    .chart-boxs {
      .chart-box {
        width: 100%;
      }
    }
  }
}
</style>
