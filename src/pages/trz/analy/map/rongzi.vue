<template>
  <div class="trz-map-rz">
    <LoadingGif
      :className="'fullscreen-loading'"
      :loadFlag="loading"
    ></LoadingGif>
    <div class="left">
      <div class="left-top">
        <div class="left-back" v-if="!isWorldMap" @click="backWorldMap()">
          <img src="../../../../../static/imgs/trz/world.png" alt="" />
          返回世界地图
        </div>
        <div
          class="left-back"
          v-if="isWorldMap"
          @click="getChinaMapData('中国')"
        >
          <img src="../../../../../static/imgs/trz/china.png" alt="" />
          查看中国地图
        </div>
        <div @mouseleave="leaveMap()">
          <div v-show="isWorldMap">
            <!-- 世界地图 -->
            <div id="allChart" class="charts"></div>
          </div>

          <div v-show="!isWorldMap">
            <!-- 世界地图 -->
            <div id="chinaChart" class="charts"></div>
          </div>

          <!-- 地图的弹窗详细数据 -->
          <div
            v-if="isShow"
            class="charts-detail"
            :style="{ top: top, left: left }"
            @mouseover="clearTimer()"
          >
            <!-- <div v-if="isShow" class="charts-detail" @mouseover="clearTimer()"> -->
            <LoadingGif
              :className="'list-in-loading'"
              :classNameImg="'little-size-loading'"
              :loadFlag="isChartLoading"
              v-if="isChartLoading"
            ></LoadingGif>

            <div class="title">
              <span>{{ content }}</span>
              <p>投融资趋势</p>
            </div>

            <i class="el-icon-close" @click="leaveMap()"></i>

            <!-- 单个国家或者地区的事件数 总金额 -->
            <div>
              <div id="chart-single" class="chart-single"></div>
            </div>

            <!-- 单个国家或者地区的投资方 融资方 -->
            <div class="company" v-if="companyDetailArr.length > 0">
              <div class="company-title">最新投融资事件</div>
              <div class="company-title1">
                <span>融资方</span>
                <span>投资方</span>
              </div>
              <div
                v-for="(item, index) in companyDetailArr"
                :key="index"
                class="company-box"
              >
                <div class="rzf">
                  <a
                    v-for="(text, i) in item.shortname"
                    :key="i"
                    @click.stop="goToListDetail(text)"
                    :class="{ 'no-click': !text.gsWyuid && !text.jgWyuid }"
                  >
                    {{ text.name || "未披露" }}
                  </a>
                </div>
                <div class="tzf">
                  <a
                    v-for="txt in item.investors"
                    :key="txt.name"
                    @click.stop="goToListDetail(txt)"
                    :class="{ 'no-click': !txt.gsWyuid && !txt.jgWyuid }"
                  >
                    {{ txt.name || "未披露" }}
                  </a>
                </div>
              </div>
            </div>
            <el-button
              class="company-btn"
              type="primary"
              @click="lookMore(content, isWorldMap)"
              >查看全部</el-button
            >
          </div>
        </div>
      </div>

      <div class="left-bottom" v-show="isWorldMap">
        <!-- 事件数 总金额 -->
        <div class="info">
          <p>投融资趋势</p>
          <div id="chart-sj"></div>
        </div>

        <!-- 投资机构 -->
        <div class="info">
          <p>投资机构TOP榜</p>
          <div id="chart-jg"></div>
        </div>

        <!-- 投资方、融资方 -->
        <div class="company" v-if="companyArr.length > 0">
          <div class="company-title">
            <span>最新投融资事件</span>
            <span @click="lookMoreRongzi(isWorldMap)">查看更多</span>
          </div>
          <div class="company-title1">
            <span>融资方</span>
            <span>投资方</span>
          </div>
          <div
            v-for="(item, index) in companyArr"
            :key="index"
            class="company-box"
          >
            <div class="rzf">
              <a
                v-for="(text, i) in item.shortname"
                :key="i"
                @click.stop="goToListDetail(text)"
                :class="{ 'no-click': !text.gsWyuid && !text.jgWyuid }"
              >
                {{ text.name || "未披露" }}
              </a>
            </div>
            <div class="tzf">
              <a
                v-for="txt in item.investors"
                :key="txt.name"
                @click.stop="goToListDetail(txt)"
                :class="{ 'no-click': !txt.gsWyuid && !txt.jgWyuid }"
              >
                {{ txt.name || "未披露" }}
              </a>
            </div>
          </div>
        </div>

        <!-- 地区事件金额 -->
        <div class="right" v-if="isWorldMap">
          <div class="right-title">各国家投融资事件及金额</div>

          <div class="right-title1">
            <span class="span1">国家</span>
            <span class="span1">事件</span>
            <span class="span2">金额</span>
          </div>
          <!-- 世界地图国家数据 -->
          <div
            v-if="worldData.length > 0"
            @click="goToRongzi($event)"
            class="right-box"
          >
            <vueSeamlessScroll
              :data="worldData"
              :class-option="defaultOption"
              class="scroll-box"
              ref="seamlessScrollWorld"
            >
              <div style="margin-bottom: 50px">
                <div
                  v-for="item in worldData"
                  :key="item.country"
                  class="box"
                  :data-name="item.country"
                >
                  <span
                    class="country"
                    :title="item.country"
                    :data-name="item.country"
                    >{{ item.country }}</span
                  >
                  <span
                    class="count"
                    :title="item.doc_count"
                    :data-name="item.country"
                    >{{ item.doc_count }}件</span
                  >
                  <span
                    class="amounts"
                    :title="item.guifan_amount"
                    :data-name="item.province"
                  >
                    <span v-if="item.guifan_amount">总计</span>
                    <span style="color: #e7af2f" v-if="item.guifan_amount">
                      {{ item.guifan_amount }}
                    </span>
                  </span>
                </div>
              </div>
            </vueSeamlessScroll>
          </div>
        </div>
      </div>

      <div class="left-bottom" v-show="!isWorldMap">
        <!-- 事件数 总金额 -->
        <div class="info">
          <p>投融资趋势</p>
          <div id="chinaChart-sj"></div>
        </div>

        <!-- 投资机构 -->
        <div class="info">
          <p>投资机构TOP榜</p>
          <div id="chinaChart-jg"></div>
        </div>

        <!-- 投资方、融资方 -->
        <div class="company" v-if="companyChinaArr.length > 0">
          <div class="company-title">
            <span>最新投融资事件</span>
            <span @click="lookMoreRongzi(isWorldMap)">查看更多</span>
          </div>
          <div class="company-title1">
            <span>融资方</span>
            <span>投资方</span>
          </div>
          <div
            v-for="(item, index) in companyChinaArr"
            :key="index"
            class="company-box"
          >
            <div class="rzf">
              <a
                v-for="(text, i) in item.shortname"
                :key="i"
                @click.stop="goToListDetail(text)"
                :class="{ 'no-click': !text.gsWyuid && !text.jgWyuid }"
              >
                {{ text.name || "未披露" }}
              </a>
            </div>
            <div class="tzf">
              <a
                v-for="txt in item.investors"
                :key="txt.name"
                @click.stop="goToListDetail(txt)"
                :class="{ 'no-click': !txt.gsWyuid && !txt.jgWyuid }"
              >
                {{ txt.name || "未披露" }}
              </a>
            </div>
          </div>
        </div>

        <!-- 地区事件金额 -->

        <div class="right">
          <div class="right-title">各省市投融资事件及金额</div>
          <div class="right-title1">
            <span class="span1">省市</span>
            <span class="span1">事件</span>
            <span class="span2">金额</span>
          </div>
          <div
            v-if="chinaData.length > 0"
            @click="goToRongzi($event, '中国')"
            class="right-box"
          >
            <!-- 中国地图数据 -->
            <vueSeamlessScroll
              :data="chinaData"
              :class-option="defaultChinaOption"
              class="scroll-box"
              v-if="chinaData.length > 0"
              ref="seamlessScrollChina"
            >
              <div style="margin-bottom: 50px">
                <div
                  v-for="item in chinaData"
                  :key="item.province"
                  class="box"
                  :data-name="item.province"
                >
                  <span
                    class="country"
                    :title="item.province"
                    :data-name="item.province"
                    >{{ item.province }}</span
                  >
                  <span
                    class="count"
                    :title="item.doc_count"
                    :data-name="item.province"
                    >{{ item.doc_count }}件</span
                  >
                  <span
                    class="amounts"
                    :title="item.guifan_amount"
                    :data-name="item.province"
                  >
                    <span v-if="item.guifan_amount">总计</span>
                    <span style="color: #e7af2f" v-if="item.guifan_amount">
                      {{ item.guifan_amount }}
                    </span>
                  </span>
                </div>
              </div>
            </vueSeamlessScroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import NoData from "@/components/common/trz/noData";
import vueSeamlessScroll from "vue-seamless-scroll";
import "../../../../../node_modules/echarts/map/js/world.js"; // 引入世界地图数据
export default {
  components: {
    LoadingGif,
    NoData,
    vueSeamlessScroll,
  },
  data() {
    return {
      loading: false,
      isChartLoading: false,
      isShow: false,
      content: "",
      worldData: [], // 世界地图数据
      chinaData: [], // 世界地图数据
      timer: null, // 定时器
      isWorldMap: true, // 默认为true，显示世界地图， false显示中国地图。
      companyArr: [], // 世界地图底部融资方投资方数据
      companyChinaArr: [], // 中国地图底部融资方投资方数据
      companyDetailArr: [], // 鼠标移入数据
      top: 0,
      left: 0,
      defaultOption: {},
      defaultChinaOption: {},
    };
  },

  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsResize("chart-sj");
      this.echartsResize("chinaChart-sj");
      this.echartsResize("chart-jg");
      this.echartsResize("chinaChart-jg");
      this.echartsResize("allChart");
      this.echartsResize("chinaChart");
    });
  },
  mounted() {
    this.getMapData();
    this.windowResize();
  },
  activated() {
    if (this.isWorldMap) {
      this.echartsResize("chart-sj");
      this.echartsResize("chart-jg");
      this.echartsResize("allChart");
    } else {
      this.echartsResize("chinaChart");
      this.echartsResize("chinaChart-sj");
      this.echartsResize("chinaChart-jg");
    }
  },
  methods: {
    windowResize() {
      window.addEventListener("resize", () => {
        this.$nextTick(() => {
          if (this.isWorldMap) {
            window.removeEventListener("resize", () => {
              this.echartsResize("chinaChart");
              this.echartsResize("chinaChart-sj");
              this.echartsResize("chinaChart-jg");
            });
            this.echartsResize("chart-sj");
            this.echartsResize("chart-jg");
            this.echartsResize("allChart");
          } else {
            window.removeEventListener("resize", () => {
              this.echartsResize("chart-sj");
              this.echartsResize("chart-jg");
              this.echartsResize("allChart");
            });
            this.echartsResize("chinaChart");
            this.echartsResize("chinaChart-sj");
            this.echartsResize("chinaChart-jg");
          }
          this.leaveMap();
        });
      });
    },
    echartsResize(id) {
      console.log(id);
      if (!document.getElementById(id)) return;
      let echart = Echarts.getInstanceByDom(document.getElementById(id));
      if (echart) echart.resize();
    },
    // 获取默认世界地图的数据
    getMapData() {
      this.loading = true;
      window
        .Axios({
          method: "get",
          url: "/api/Tourongzi_analyze_map/tourongzi",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            this.worldData = res.data.data.right;
            this.worldConfigure(this.worldData);
            this.drawLine(res.data.data.bot.amount_num, "chart-sj");
            this.drawBar(res.data.data.bot.tzsl, "chart-jg");
            this.companyArr = res.data.data.bot.latest;
            this.defaultOption = {
              step: 0, // 数值越大速度滚动越快
              limitMoveNum: this.worldData.length, // 开始无缝滚动的数据量
              hoverStop: true, // 是否开启鼠标悬停stop
              direction: 1, // 0向下 1向上 2向左 3向右
              openWatch: true, // 开启数据实时监控刷新dom
              singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
              singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
              waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
            };

            let settime = setTimeout(() => {
              this.defaultOption.step = 0.5;
              console.log(this.defaultOption);
              clearTimeout(settime);
            }, 5000);

            this.setWorldDefault();
          }
        });
    },
    // 设置世界地图默认展开中国的详情弹窗
    setWorldDefault() {
      this.companyDetailArr = [];
      this.content = "";
      this.isChartLoading = true;
      let width = document.body.clientWidth;
      if (width > 1700) {
        this.left = "68%";
        this.top = "35%";
      } else {
        this.left = "25%";
        this.top = "15%";
      }

      this.getChartData("中国", 1);
    },

    // 设置中国地图默认展开北京的详情弹窗
    setChinaDefault() {
      this.companyDetailArr = [];
      this.content = "";
      this.isChartLoading = true;
      let width = document.body.clientWidth;
      if (width > 1700) {
        this.left = "58%";
        this.top = "40%";
      } else {
        this.left = "56%";
        this.top = "20%";
      }

      this.getChartData("北京", 2);
    },
    // 鼠标点击中国地图获取中国地图数据
    getChinaMapData(name) {
      if (this.chinaData.length > 0) {
        // this.$refs.seamlessScrollChina.yPos = 0
        this.isWorldMap = false;
        // this.$nextTick(() => {
        //   this.echartsResize("chinaChart");
        //   this.echartsResize("chinaChart-sj");
        //   this.echartsResize("chinaChart-jg");
        // });
        this.setChinaDefault();
        return;
      }
      this.loading = true;
      window
        .Axios({
          method: "get",
          url: "/api/Tourongzi_analyze_map/tourongzi",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            country: name,
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200 && res.data.data) {
            this.isWorldMap = false;
            this.chinaData = res.data.data.right;
            this.$nextTick(() => {
              // 重置滚动距离
              this.$refs.seamlessScrollChina.yPos = 0;
              // console.log(this.$refs.seamlessScrollChina);
              this.chinaConfigure(this.chinaData);
              this.drawLine(res.data.data.bot.amount_num, "chinaChart-sj");
              this.drawBar(res.data.data.bot.tzsl, "chinaChart-jg");
              this.companyChinaArr = res.data.data.bot.latest;
              this.defaultChinaOption = {
                step: 0, // 数值越大速度滚动越快
                limitMoveNum: this.chinaData.length, // 开始无缝滚动的数据量
                hoverStop: true, // 是否开启鼠标悬停stop
                direction: 1, // 0向下 1向上 2向左 3向右
                openWatch: true, // 开启数据实时监控刷新dom
                singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
              };

              let settime = setTimeout(() => {
                this.defaultChinaOption.step = 0.5;
                console.log(this.defaultChinaOption);
                clearTimeout(settime);
              }, 5000);

              this.setChinaDefault();
            });
          }
        });
    },

    // 鼠标移入国家或者省份获取详细信息
    getChartData(name, type) {
      this.isShow = true;
      window
        .Axios({
          method: "get",
          url: "/api/Tourongzi_analyze_map/tourongziProvince",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            type: type,
            name: name,
          },
        })
        .then((res) => {
          this.isChartLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.content = name;
            this.drawLine(res.data.data.investmentsAmount, "chart-single");
            this.companyDetailArr = res.data.data.latest;
          }
        });
    },

    // 绘制世界地图
    worldConfigure(worldData) {
      let that = this;
      var newArr = [];
      for (var i = 0; i < worldData.length; i++) {
        let c = worldData[i];
        var json = {
          name: c.country,
          value: c.amounts,
        };
        newArr.push(json);
      }
      let max = _.maxBy(newArr, "value").value;
      let myChart = Echarts.init(
        document.getElementById("allChart"),
        "customed"
      );
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter(params) {
            if (params.data) {
              if (that.content == params.data.name) return;
              that.companyDetailArr = [];
              that.content = "";
              that.isChartLoading = true;
              if (that.timer) {
                clearTimeout(that.timer);
              }
              that.timer = setTimeout(() => {
                // 调用获取详细数据的接口方法
                if (params.data) that.getChartData(params.data.name, 1);
              }, 500);
            } else {
              that.leaveMap();
            }
          },
          // 获取坐标
          position(p, params) {
            if (params.data && params.data.name !== that.content) {
              let width = document.body.clientWidth;
              let height = document.body.clientHeight;
              let minHeight = 720;
              if (width < 1700) {
                minHeight = 600;
              }
              console.log(width, height, p);
              if (p[0] + 505 <= width) {
                that.left = p[0] + 5 + "px";
              } else {
                that.left = p[0] - 505 + "px";
              }

              if (p[1] + minHeight <= height) {
                that.top = p[1] + "px";
              } else {
                // console.log(p[1] - (p[1] + 600 - height));
                that.top = p[1] - (p[1] + minHeight - height) + "px";
              }
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
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
        },
        visualMap: {
          max,
          left: "60",
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
            // left: '15%',
            // right: '15%',
            // bottom: 20,
            // top: 20,
            // itemStyle:{
            //     normal:{
            //         color:'#000',
            //         borderColor:'rgba(100,149,237,1)',
            //         borderWidth:0.5,
            //         areaColor: 'black',
            //         areaStyle:{
            //             color: '#000000'
            //         }
            //     }
            // },
            label: {
              show: false,
              color: "rgb(0, 0, 0)",
            },
            data: newArr,
          },
        ],
      });

      myChart.on("mouseout", function (params) {
        that.clearTimer();
      });

      myChart.on("click", function (params) {
        if (params.data.name == "中国") {
          if (that.isShow === true) return;
          that.leaveMap();
          that.chinaData = [];
          that.getChinaMapData(params.data.name);
        }
      });
    },

    // 绘制中国地图
    chinaConfigure(data) {
      let that = this;
      let series = [];
      data.length > 0 &&
        data.forEach((item) => {
          if (item.amounts > 0 && item.province) {
            // if (item.province.includes("省"))
            //   item.province = item.province.replace("省", "");
            if (item.province.includes("市"))
              item.province = item.province.replace("市", "");
            let provinces = {
              内蒙古自治区: "内蒙古",
              广西壮族自治区: "广西",
              西藏自治区: "西藏",
              宁夏回族自治区: "宁夏",
              新疆维吾尔自治区: "新疆",
              香港特别行政区: "香港",
              澳门特别行政区: "澳门",
            };
            if (provinces[item.province])
              item.province = provinces[item.province];
            series.push({
              name: item.province,
              value: parseInt(item.amounts),
            });
          }
        });
      console.log(series);
      let max = _.maxBy(series, "value").value,
        option = {
          tooltip: {
            trigger: "item",
            formatter(params) {
              if (params.data) {
                if (that.content == params.data.name) return;
                that.companyDetailArr = [];
                that.content = "";
                that.isChartLoading = true;
                if (that.timer) {
                  clearTimeout(that.timer);
                }
                that.timer = setTimeout(() => {
                  // 调用获取详细数据的接口方法
                  if (params.data) that.getChartData(params.data.name, 2);
                }, 500);
              } else {
                that.leaveMap();
              }
            },
            // 获取坐标
            position(p, params) {
              if (params.data && params.data.name !== that.content) {
                let width = document.body.clientWidth;
                let height = document.body.clientHeight;
                // console.log(width, height, p);
                let minHeight = 740;
                if (width < 1700) {
                  minHeight = 600;
                }
                console.log(width, height, p);
                if (p[0] + 505 <= width) {
                  that.left = p[0] + 5 + "px";
                } else {
                  that.left = p[0] - 505 + "px";
                }

                if (p[1] + minHeight <= height) {
                  that.top = p[1] + "px";
                } else {
                  // console.log(p[1] - (p[1] + 600 - height));
                  that.top = p[1] - (p[1] + minHeight - height) + "px";
                }
              }
            },
          },
          visualMap: {
            max,
            left: "60",
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true,
          },
          series: [
            {
              type: "map",
              mapType: "china",
              // left: '20%',
              // right: '20%',
              // bottom: 20,
              // top: 20,
              label: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: true,
                },
              },
              data: series,
            },
          ],
        };
      let myChart = Echarts.init(
        document.getElementById("chinaChart"),
        "customed"
      );
      myChart.setOption(option);

      myChart.on("mouseout", function (params) {
        that.clearTimer();
      });
    },

    // 绘制总金额和事件数折线图
    drawLine(data, id) {
      let that = this;
      console.log(data);
      let xAixs = data.map((item) => parseInt(item.year)),
        eventArr = data.map((item) => item.doc_count),
        amountArr = data.map((item) => item.amounts),
        startValue = data.length - 10,
        endValue = data.length - 1,
        bottom = data.length > 10 ? 40 : 10;
      let option = {
        tooltip: {
          trigger: "axis",
          formatter(params) {
            let maoHao = "：";
            return `${params[0].name}<br />${
              params[0].seriesName + maoHao + params[0].data
            }${"件"}<br />${
              params[1].seriesName +
              maoHao +
              that.echartsTooltipMoney(params[1].data)
            }${"元"}`;
          },
        },
        legend: {
          data: ["事件数", "总金额"],
          top: 5,
          left: "center",
        },
        grid: {
          top: 40,
          left: 13,
          bottom,
          right: 25,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          // name: "年",
          nameTextStyle: {
            color: "#66666",
          },
          data: xAixs,
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: [
          {
            type: "value",
            name: "事件数",
            position: "left",
            offset: -15,
            nameTextStyle: {
              color: "#66666",
            },
            axisLabel: {
              show: true,
            },
          },
          {
            type: "value",
            name: "总金额(亿元)",
            position: "right",
            offset: -10,
            nameTextStyle: {
              color: "#66666",
            },
            axisLabel: {
              show: true,
              formatter(params) {
                return params / 100000000;
              },
            },
          },
        ],
        dataZoom: [
          {
            show: data.length > 10,
            startValue,
            endValue,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            height: 20, //这里可以设置dataZoom的尺寸
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
          },
        ],
        series: [
          {
            name: "事件数",
            type: "line",
            yAxisIndex: 0,
            data: eventArr,
          },
          {
            name: "总金额",
            type: "line",
            yAxisIndex: 1,
            data: amountArr,
          },
        ],
      };

      Echarts.init(document.getElementById(id), "customed").clear();
      Echarts.init(document.getElementById(id), "customed").setOption(option);
    },

    // 绘制投资机构柱状图
    drawBar(value, id) {
      let data = _.orderBy(value, ["touzishuliang"], ["asc"]),
        that = this,
        yAxis = data.map((item) => item.jgname),
        series = data.map((item) => item.touzishuliang),
        option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            top: 10,
            left: 20,
            right: 20,
            bottom: 10,
            containLabel: true,
          },
          xAxis: {
            type: "value",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
            },
          },
          yAxis: {
            type: "category",
            data: yAxis,
            nameTextStyle: {
              color: "#66666",
            },
            triggerEvent: true,
            axisLabel: {
              show: true,
              color: "#66666",
              formatter(value) {
                return that.labelLenLimit(value);
              },
            },
          },
          barMaxWidth: 80,
          series: [
            {
              name: "投资数量",
              type: "bar",
              data: series,
            },
          ],
        };
      console.log(data);
      let myChart = Echarts.init(document.getElementById(id), "customed");
      myChart.setOption(option);
      myChart.on("click", function (params) {
        console.log(params);
        if (params.componentType == "yAxis") {
          that.linkJiGouDetail(
            data.filter((item) => item.jgname === params.value)[0].wyuid
          );
        }
      });
    },

    // 跳转到投融资数据库
    goToRongzi(e, val) {
      let target = e.target;
      if (!target.dataset.name) return;
      let query = val
        ? {
            filter_condition: JSON.stringify({
              province: [`${target.dataset.name}`],
            }),
          }
        : {
            filter_condition: JSON.stringify({
              country: [`${target.dataset.name}`],
            }),
          };
      let routeData = this.$router.resolve({
        path: "/trz/rongzi",
        query: query,
      });
      window.open(routeData.href, "_blank");
    },

    lookMore(name, type) {
      let query = type
        ? {
            filter_condition: JSON.stringify({
              country: [`${name}`],
            }),
          }
        : {
            filter_condition: JSON.stringify({
              province: [`${name}`],
            }),
          };
      let routeData = this.$router.resolve({
        path: "/trz/rongzi",
        query: query,
      });
      window.open(routeData.href, "_blank");
    },

    lookMoreRongzi(isWorldMap) {
      let routeData;
      if (isWorldMap) {
        routeData = this.$router.resolve({
          path: "/trz/rongzi",
        });
      } else {
        routeData = this.$router.resolve({
          path: "/trz/rongzi",
          query: {
            filter_condition: JSON.stringify({
              country: ["中国"],
            }),
          },
        });
      }

      window.open(routeData.href, "_blank");
    },

    cutLength(str) {
      let len = String(str).length;
      let arr = [];
      let ret = "";
      if (len > 4) {
        arr = String(str).split("");
        arr.splice(4, len - 4, "...");
        ret = arr && arr.join("");
      } else {
        ret = str;
      }

      return ret;
    },

    linkJiGouDetail(wyuid) {
      let { href } = this.$router.resolve({
        path: "/trz/jigou/" + wyuid,
      });
      window.open(href, "_blank");
    },

    goToListDetail(val) {
      let path = "";
      console.log(val);
      if (!val.gsWyuid && !val.jgWyuid) return false;
      // 如果gsWyuid存在跳转到企业详情
      if (val.gsWyuid) path = `/trz/qiye/${val.gsWyuid}`;

      // 如果jgWyuid存在跳转到企业详情
      if (val.jgWyuid) path = `/trz/jigou/${val.jgWyuid}`;

      let routeData = this.$router.resolve({
        path: path,
      });
      window.open(routeData.href, "_blank");
    },

    // 地图鼠标离开事件
    leaveMap() {
      this.isShow = false;
      this.content = "";
      this.clearTimer();
    },

    clearTimer() {
      clearTimeout(this.timer);
    },

    backWorldMap() {
      this.leaveMap();
      this.isWorldMap = true;
      this.setWorldDefault();

      this.$nextTick(() => {
        this.echartsResize("chart-sj");
        this.echartsResize("chart-jg");
        this.echartsResize("allChart");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.list-in-loading {
  position: absolute;
  z-index: 9999;
  height: 94%;
  width: 94%;
  background: rgba(255, 255, 255, 1);
}
.trz-map-rz {
  height: calc(100vh - 48px);
  min-width: 1280px;
  background: #f5f8fc;
  padding-top: 48px;
  display: flex;
  background-color: #fff;
  .left {
    width: 100vw;
    min-width: 1280px;

    .charts {
      min-width: 1280px;
      height: calc(100vh - 250px - 68px);
    }

    &-top {
      height: calc(100vh - 250px - 68px);
      margin-bottom: 10px;
      position: relative;

      .left-back {
        position: absolute;
        top: 24px;
        right: 40px;
        z-index: 99;
        font-size: 16px;
        font-weight: 400;
        color: #3556b9;
        cursor: pointer;

        &:hover {
          color: #e7af2f;
        }

        img {
          width: 16px;
          margin-top: 1px;
          vertical-align: text-top;
        }
      }

      .charts-detail {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 500px;
        min-height: 640px;
        background: #fff;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
        border-radius: 4px;
        z-index: 9999;
        padding-bottom: 15px;
        box-sizing: border-box;
        transition: all 0.5s ease;

        .el-icon-close {
          color: #333;
          font-size: 20px;
          font-weight: bolder;
          position: absolute;
          top: 8px;
          right: 10px;
          z-index: 9999;
          cursor: pointer;
        }

        .title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;

          span {
            display: block;
            background: #f5f8fc;
            color: #0d1a62;
            padding: 5px 0 5px 13px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }

          p {
            font-size: 14px;
            margin-top: 5px;
            padding-left: 13px;
          }
        }

        .chart-single {
          width: 490px;
          height: 250px;
        }

        .company {
          padding: 20px 0px 0px 0px;
          overflow: auto;

          &-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-left: 13px;
            box-sizing: border-box;
            color: #333;
          }

          &-title1 {
            display: flex;
            padding-left: 13px;
            box-sizing: border-box;

            span {
              flex: 1;
              font-size: 13px;
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }

            span:first-child {
              flex: 0.4;
            }
          }

          &-box {
            display: flex;
            padding-left: 13px;

            > div {
              flex: 1;
              margin-bottom: 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            a {
              margin-right: 8px;
              color: #3556b9;
              cursor: pointer;
              &:hover {
                color: #e7af2f;
              }
            }

            .no-click {
              text-decoration: none;
              color: #09144f;
              cursor: unset;
              &:hover {
                color: #09144f;
              }
            }

            .rzf {
              flex: 0.4;
            }
          }

          &-btn {
            width: 120px;
            height: 30px;
            padding: 7px 0;
            margin: 20px 0 0 10px;
            background: #3556b9;
          }
        }
      }
    }

    &-bottom {
      height: 250px;
      margin-bottom: 10px;
      display: flex;

      .info {
        width: calc((100vw - 30px) / 4);
        min-width: 320px;
        margin-right: 10px;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
        border-radius: 4px;

        p {
          font-size: 14px;
          font-weight: bold;
          background: #f5f8fc;
          color: #0d1a62;
          margin-bottom: 5px;
          padding: 5px 0 5px 13px;
          box-sizing: border-box;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
      }

      #chart-sj,
      #chart-jg,
      #chinaChart-sj,
      #chinaChart-jg,
      .company {
        height: 220px;
        width: calc((100vw - 30px) / 4);
        min-width: 320px;
        box-sizing: border-box;
      }

      .company {
        height: 250px;
        margin-bottom: 20px;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
        border-radius: 4px;
        overflow: auto;
        &-title {
          font-size: 14px;
          font-weight: bold;
          background: #f5f8fc;
          color: #0d1a62;
          margin-bottom: 10px;
          padding: 5px 13px 5px 13px;
          box-sizing: border-box;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;

          span:last-child {
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        &-title1 {
          display: flex;
          padding: 0 20px 0px 13px;
          box-sizing: border-box;

          span {
            flex: 1;
            font-size: 13px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }

          span:first-child {
            flex: 0.4;
          }
        }

        &-box {
          display: flex;
          padding: 0 20px 0px 13px;

          > div {
            flex: 1;
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          a {
            margin-right: 8px;
            color: #3556b9;
            cursor: pointer;
            &:hover {
              color: #e7af2f;
            }
          }

          .no-click {
            text-decoration: none;
            color: #09144f;
            cursor: unset;
            &:hover {
              color: #09144f;
            }
          }

          .rzf {
            flex: 0.4;
          }
        }
      }
    }
  }
  .right {
    // width: 300px;
    margin-left: 10px;
    box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.19);
    border-radius: 4px;
    // height: calc(100vh - 68px);
    height: 250px;
    width: calc((100vw - 30px) / 4);
    min-width: 320px;
    box-sizing: border-box;

    .right-box {
      // height: calc(100vh - 68px - 47px);
      height: 180px;
      overflow: hidden;
    }

    .right-title {
      // width: 300px;
      font-size: 14px;
      font-weight: bold;
      color: #0d1a62;
      margin-bottom: 10px;
      padding: 5px 10px 5px 10px;
      background: #f5f8fc;
      box-sizing: border-box;
    }

    .right-title1 {
      display: flex;
      padding-left: 10px;
      span {
        font-size: 13px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
        margin-right: 10px;
      }
      .span1 {
        flex: 0.3;
      }

      .span2 {
        flex: 1;
      }
    }

    .scroll-box {
      // height: calc(100vh - 58px - 32px);
      // width: 300px;
      height: 180px;
      padding: 10px 0px;
      box-sizing: border-box;

      .box {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        color: #333;
        box-sizing: border-box;
        font-size: 12px;
        margin-bottom: 10px;
        cursor: pointer;

        .country {
          min-width: 70px;
          flex: 0.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
          color: #3556b9;
        }

        .count {
          min-width: 50px;
          flex: 0.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
        }
        .amounts {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .box:hover {
        color: #e7af2f;

        .country {
          color: #e7af2f;
          text-decoration: underline;
        }
      }
    }
  }

  @media screen and (max-width: 1930px) {
    .left {
      .charts {
        height: calc(100vh - 220px - 68px);
      }

      &-top {
        height: calc(100vh - 220px - 68px);
      }

      &-bottom {
        height: 220px;

        #chart-sj,
        #chart-jg,
        #chinaChart-sj,
        #chinaChart-jg,
        .company {
          height: 190px;
        }

        .company {
          height: 220px;

          &-box {
            > div {
              margin-bottom: 2px;
            }
          }
        }
      }

      .right {
        height: 220px;

        .right-box,
        .scroll-box {
          height: 150px;
        }
      }
    }
  }

  @media screen and (max-width: 1700px) {
    .left {
      &-top {
        .charts-detail {
          min-height: 500px;
          .title {
            margin-bottom: 5px;
          }

          .chart-single {
            height: 190px;
          }

          .company {
            padding-top: 5px;
          }

          .company-title {
            margin-bottom: 5px;
          }

          .company-box > div {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
