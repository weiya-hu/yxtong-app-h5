<template>
  <div class="page-wrap">
    <LoadingGif
      :className="'db-index-loading'"
      :loadFlag="isloading"
      v-if="isloading"
    ></LoadingGif>
    <slide-section :title="'药品分析'" class="the-part">
      <div class="tb-wrap">
        <!-- 名称 -->
        <div class="head">
          <div class="yyxs-title">
            {{ showInputName }}
          </div>
          <div class="yyxs-name">
            药品名称
            <el-autocomplete
              style="margin: 0 20px"
              class="inline-input"
              v-model="inputName"
              :fetch-suggestions="querySearch"
              :placeholder="inputName"
              :popper-append-to-body="false"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
        </div>
        <!-- 顶部统计 -->
        <div class="cont-wrap">
          <div class="newtotals">
            <ul class="total-item">
              <li class="li1">中选批次</li>
              <li class="li2">
                总计<span class="num-s">{{ basicDataObj.zxpici_count }}</span
                >个
              </li>
              <li class="li3">批次：{{ basicDataObj.zxpici }}</li>
            </ul>
            <ul class="total-item">
              <li class="li1">品种规格</li>
              <li class="li2">
                总计<span class="num-s">{{
                  basicDataObj.zxguifanguige_count
                }}</span
                >个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">中选企业</li>
              <li class="li2">
                总计<span class="num-s">{{ basicDataObj.zxqiye_count }}</span
                >家
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">平均降幅</li>
              <li class="li2">
                <span class="num-s">{{ basicDataObj.average_drop }}</span>
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">最高中选单价</li>
              <li class="li1" style="padding-top: 0">（最小制剂单位）</li>
              <li class="li3">
                {{ basicDataObj.danjian_of_max_selected_unit_price }}元
              </li>
              <li class="li3">
                {{ basicDataObj.guifanguige_of_max_selected_unit_price }}
                {{ basicDataObj.baozhuanguige_of_max_selected_unit_price }}
              </li>
              <li class="li3">
                {{ basicDataObj.qiye_of_max_selected_unit_price
                }}<span v-if="basicDataObj.type_of_max_selected_unit_price"
                  >（{{ basicDataObj.type_of_max_selected_unit_price }}）</span
                >
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">最低中选单价</li>
              <li class="li1" style="padding-top: 0">（最小制剂单位）</li>
              <li class="li3">
                {{ basicDataObj.danjian_of_min_selected_unit_price }}元
              </li>
              <li class="li3">
                {{ basicDataObj.guifanguige_of_min_selected_unit_price }}
                {{ basicDataObj.baozhuanguige_of_min_selected_unit_price }}
              </li>
              <li class="li3">
                {{ basicDataObj.qiye_of_min_selected_unit_price
                }}<span v-if="basicDataObj.type_of_min_selected_unit_price"
                  >（{{ basicDataObj.type_of_min_selected_unit_price }}）</span
                >
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">最高降幅</li>
              <li class="li2">
                <span class="num-s">{{
                  basicDataObj.highest_rate_of_decrease
                }}</span>
              </li>
              <li class="li3">
                {{ basicDataObj.guifanguige_the_highest_decline }}
                {{ basicDataObj.baozhuanguige_the_highest_decline }}
              </li>
              <li class="li3">
                {{ basicDataObj.qiye_of_the_highest_decline
                }}<span v-if="basicDataObj.type_the_highest_decline"
                  >（{{ basicDataObj.type_the_highest_decline }}）</span
                >
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">最低降幅</li>
              <li class="li2">
                <span class="num-s">{{
                  basicDataObj.minimum_rate_of_decrease
                }}</span>
              </li>
              <li class="li3">
                {{ basicDataObj.guifanguige_the_minimum_decline }}
                {{ basicDataObj.baozhuanguige_the_minimum_decline }}
              </li>
              <li class="li3">
                {{ basicDataObj.qiye_of_the_minimum_decline
                }}<span v-if="basicDataObj.type_the_minimum_decline"
                  >（{{ basicDataObj.type_the_minimum_decline }}）</span
                >
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">一致性评价进度</li>
              <li class="li1" style="padding-top: 0">通过/视同通过）</li>
              <li class="li2">
                <span class="num-s">{{ basicDataObj.yzxpj_jindu }}</span
                >家企业
              </li>
              <li
                class="li2"
                style="cursor: pointer; margin-top: 30px"
                @click="lookMore"
              >
                查看更多
              </li>
            </ul>
          </div>
        </div>
        <div class="screen">
          <div class="yyxs-title">请选择规格：</div>
          <ul>
            <li
              v-for="(item, i) in guigeSelectList"
              @click="guiGeChange(item)"
              :class="{ active: item === curGuiGe }"
              :key="i"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <!-- 图表项 -->
        <div class="echarts-wrap">
          <div class="echart-item" ref="echartItem">
            <div class="header">
              <span class="title">企业中选价格分析</span>
            </div>
            <div
              v-show="qiYeZhongXuanObj.danjia.length > 0"
              class="echarts"
              id="qiYeZhongXuan"
            ></div>
            <div v-show="qiYeZhongXuanObj.danjia.length == 0" class="shadow">
              <img src="../../../../static/imgs/nodata.png" alt="" />
            </div>
          </div>
          <div class="echart-item" ref="echartItem">
            <div class="header">
              <span class="title">首年约定采购量分析</span>
            </div>
            <div style="display: flex">
              <div class="yyxs-name" style="margin-left: 20px">
                批次：
                <el-select
                  v-model="curPici"
                  @change="changeValue"
                  :popper-append-to-body="false"
                  ref="popoverSelect"
                >
                  <el-option
                    v-for="(option, index) in piciList"
                    :key="index"
                    :title="option"
                    :label="option"
                    :value="option"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="yyxs-name" style="margin-left: 20px">
                企业：
                <el-select
                  v-model="curQiYe"
                  @change="changeValue2"
                  :popper-append-to-body="false"
                  ref="popoverSelect"
                >
                  <el-option
                    v-for="(option, index) in qiYeList"
                    :key="index"
                    :title="option"
                    :label="option"
                    :value="option"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div
              v-show="mapList.length > 0"
              class="echarts"
              ref="shouNianChart"
              id="shouNianYueDing"
            ></div>
            <div class="shadow" v-show="mapList.length == 0">
              <img src="../../../../static/imgs/nodata.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </slide-section>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import Select from "@/components/inputs/select";
import SlideSection from "@/components/common/slide-section";
import { mapState } from "vuex";
import Axios from "axios";

export default {
  props: {
    ypname: {
      type: String
    },
    nopmState: {
      type: Boolean
    },
    type: {
      type: Number
    }
  },
  components: {
    LoadingGif,
    Select,
    SlideSection
  },
  data() {
    return {
      flag: false, // 是否点击批次或企业切换过，默认为false
      showInputName: "", // 展示的药品名称
      curQiYe: "", // 当前选中的企业
      qiYeList: [], // 批次下拉数组
      curPici: "", // 当前选中的批次
      piciList: [], // 批次下拉数组
      curGuiGe: "", // 当前选中的规格，
      guigeSelectList: [], // 规格数据源
      inputName: "", // 默认输入的药品名称
      iconShow: true,
      isloading: true,
      inputIcon: "el-icon-search",
      nameSel: {
        model: this.ypname || "阿普唑仑",
        placeholder: "请输入活性成分或药品名称",
        options: [],
        loading: false,
        type: this.type || 1
      },
      yearSel: {
        model: "",
        placeholder: "请选择年份",
        options: [],
        loading: false
      },
      guifanqiye: "",
      screenList: [],
      totalList: [],
      titleYearStr: "",
      apiDlypinputList: [],
      clearSel: false,
      title: ["首年约定采购量分析"], //图形标题
      dialogVisible: false,
      basicDataObj: {}, // 顶部基础数据对象
      // 企业中选价格分析数据对象
      qiYeZhongXuanObj: {
        xAxis: [],
        danjia: [],
        feiyong_uint_avg_res: [],
        xianjia: [],
        jiangfu: []
      },
      eType: "map",
      mapList: [], // 首年约定采购量分析地图数组
      shouNianChart: null, // 首年约定采购量分析图表对象
      qiYeZhongXuanChart: null, // 企业中选价格分析图表对象
      /**
       * 窗口大小调整事件
       */
      windowResizeEvent: _.throttle(() => {
        this.echartsResize("echarts");
      }, 500)
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Yyxs.nopms
    }),
    yearModel() {
      return this.yearSel.model.toString();
    }
  },
  watch: {},
  methods: {
    guiGeChange(val) {
      this.isloading = true;
      this.curGuiGe = val;
      Echarts.getInstanceByDom(
        document.getElementById("shouNianYueDing")
      ).clear();
      this.getBasicShouNianYueDing();
      this.qiYeZhongXuan();
      this.getQiyeZhongxuanJiage();
      this.getshouNianYueDing();
      this.isloading = false;
    },
    changeValue(currentVal) {
      this.flag = true;
      this.isloading = true;
      this.curPici = currentVal;
      Echarts.getInstanceByDom(
        document.getElementById("shouNianYueDing")
      ).clear();
      console.log(this.curPici);
      this.getshouNianYueDing();
      this.isloading = false;
    },
    changeValue2(currentVal) {
      this.flag = true;
      this.isloading = true;
      this.curQiYe = currentVal;
      Echarts.getInstanceByDom(
        document.getElementById("shouNianYueDing")
      ).clear();
      this.getshouNianYueDing();
      this.isloading = false;
    },
    getAllRequest() {
      // 获取顶部药品名称
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/mostEnterprisesName"
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            console.log(data);
            this.inputName = data.guifanname;
            this.showInputName = this.inputName;
            this.batchAnalysisName();
            this.getGuigeSelect();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 顶部基础数据项
    batchAnalysisName() {
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/batchAnalysisName",
          params: {
            guifanname: this.inputName
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.basicDataObj = data;
            console.log(data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 规格选项
    getGuigeSelect(guige) {
      const _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/guigeSelect",
          params: {
            guifanname: _this.inputName
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            _this.guigeSelectList = data;
            _this.curGuiGe = guige ? guige : _this.guigeSelectList[0]; // 默认选中第一个
            new Promise((resolve, reject) => {
              resolve(_this.qiYeZhongXuan());
            })
              .then(_this.getBasicShouNianYueDing())
              .then(_this.getQiyeZhongxuanJiage());
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 查看更多
    lookMore() {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        `dailiangcaigoudrugs_yzxjd__${this.inputName}`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `dailiangcaigoudrugs_yzxjd__${this.inputName}`
      ]);

      let routerData = this.$router.resolve({
        path: "/yzxjd",
        query: {
          ypname: this.inputName
        }
      });
      window.open(routerData.href, "_blank");
    },
    querySearch(queryString, cb) {
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/inputAnaly",
          params: {
            guifanname: this.inputName
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            console.log(data);
            let arr = [];
            if (data.length > 0) {
              data.length > 0 &&
                data.forEach(item => {
                  arr.push({
                    value: item
                  });
                });
              // 调用 callback 返回建议列表的数据
              cb(arr);
            } else {
              cb([]);
            }
          } else {
            cb([]);
          }
        });
    },
    handleSelect(item) {
      this.isloading = true;
      this.inputName = item.value;
      this.showInputName = this.inputName;
      new Promise((resolve, reject) => {
        resolve(this.batchAnalysisName());
      })
        .then(this.getGuigeSelect())
        .then((this.isloading = false));
    },
    getImgName(i) {
      return `药智数据企业版-带量采购信息库-智能分析-${this.title[i]}`;
    },
    // 请求-获取企业中选价格分析
    getQiyeZhongxuanJiage() {
      console.log(this.curGuiGe);
      const _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/qiyeZhongxuanJiage",
          params: {
            guifanname: _this.inputName,
            guifanguige: _this.curGuiGe
          }
        })
        .then(res => {
          _this.qiYeZhongXuanObj = {
            xAxis: [],
            danjia: [],
            feiyong_uint_avg_res: [],
            xianjia: [],
            jiangfu: []
          };
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            console.log(data);
            data.length > 0 &&
              data.forEach(item => {
                _this.qiYeZhongXuanObj.xAxis.push(
                  item.guifanqiyezhongbiao +
                    (item.type ? `（${item.type}）` : "")
                );
                _this.qiYeZhongXuanObj.feiyong_uint_avg_res.push(
                  item.feiyong_uint_avg_res
                );
                _this.qiYeZhongXuanObj.danjia.push(item.danjia);
                _this.qiYeZhongXuanObj.jiangfu.push(item.jiangfu);
                _this.qiYeZhongXuanObj.xianjia.push(item.xianjia);
              });
            console.log(_this.qiYeZhongXuanObj.jiangfu);
          }
        })
        .then(_this.qiYeZhongXuan)
        .catch(err => {
          console.log(err);
        });
    },
    // 图表渲染-企业中选价格分析
    qiYeZhongXuan() {
      if (this.qiYeZhongXuanChart == null) {
        this.qiYeZhongXuanChart = Echarts.init(
          document.getElementById("qiYeZhongXuan"),
          "yaozh_theme"
        );
      } else {
        this.qiYeZhongXuanChart = Echarts.getInstanceByDom(
          document.getElementById("qiYeZhongXuan"),
          "yaozh_theme"
        );
      }
      this.qiYeZhongXuanChart.setOption({
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-带量采购信息库-精准分析-企业中选价格分析`,
              icon: "image:///static/imgs/echarts/download.png"
            }
          }
        },
        tooltip: {
          trigger: "axis",

          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          containLabel: true,
          left: "6%",
          right: "10%",
          top: "5%",
          bottom: "10%"
        },
        legend: {
          data: [
            "中选单价（最小制剂单位）",
            "中标平均价（近3年）",
            "最高有效申报价",
            "降幅"
          ],
          bottom: 0
        },
        dataZoom: [
          {
            show: true,
            bottom: 40
          }
        ],
        xAxis: [
          {
            type: "category",
            data: this.qiYeZhongXuanObj.xAxis,
            axisLabel: {
              show: true,
              rotate: 55,
              formatter: function(params) {
                if (!params) return "";
                else {
                  let str1 = params.substring(0, 10),
                    str2 = params.substring(10, 20)
                      ? params.substring(10, 20)
                      : "",
                    str3 = params.substring(20, params.length)
                      ? params.substring(20, params.length)
                      : "",
                    str4 = "";
                  if (str1) {
                    str4 = `${str1}`;
                  }
                  if (str1 && str2) {
                    str4 = `${str1}\n${str2}`;
                  }
                  if (str1 && str2 && str3) {
                    str4 = `${str1}\n${str2}\n${str3}`;
                  }
                  return str4;
                }
              }
            }
          }
        ],
        yAxis: [
          {
            name: "价格（元）",
            type: "value"
          },
          {
            name: "降价幅度",
            type: "value"
          }
        ],
        series: [
          {
            name: "中选单价（最小制剂单位）",
            type: "bar",
            data: this.qiYeZhongXuanObj.danjia
          },
          {
            name: "中标平均价（近3年）",
            type: "bar",
            data: this.qiYeZhongXuanObj.feiyong_uint_avg_res
          },
          {
            name: "最高有效申报价",
            type: "bar",
            data: this.qiYeZhongXuanObj.xianjia
          },
          {
            name: "降幅（%）",
            type: "line",
            yAxisIndex: 1,
            label: {
              show: true,
              position: "right",
              formatter: "{c} %"
            },
            data: this.qiYeZhongXuanObj.jiangfu
          }
        ]
      });
    },
    async getBasicShouNianYueDing(pici, qiye) {
      const res = await window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/firstPiciSelect",
        params: {
          guifanname: this.inputName,
          guifanguige: this.curGuiGe
        }
      });
      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        this.piciList = data;
        this.curPici = pici ? pici : this.piciList[0];
        console.log(this.curPici);
      }
      const res2 = await window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/firstQiyeSelect",
        params: {
          guifanname: this.inputName,
          guifanguige: this.curGuiGe
        }
      });
      if (res2.data.code === 200 && res2.data.data) {
        let data = res2.data.data;
        this.qiYeList = ["全部", ...data];
        this.curQiYe = qiye ? qiye : this.qiYeList[0];
        console.log(data);
      }
      this.getshouNianYueDing();
    },
    // 请求-首年约定采购量分析
    async getshouNianYueDing() {
      this.mapList = [];
      console.log(this.curPici);
      const res3 = await window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/shounianCaigouliang",
        params: {
          guifanname: this.inputName,
          guifanguige: this.curGuiGe,
          type: this.curPici,
          guifanqiyezhongbiao: this.curQiYe == "全部" ? "" : this.curQiYe
        }
      });
      if (res3.data.code === 200 && res3.data.data) {
        let data = res3.data.data;
        data.length > 0 &&
          data.forEach(item => {
            this.mapList.push({
              name: item.first,
              value: item.amount
            });
          });
        this.isloading = false;
        this.shouNianYueDing();
      } else {
        this.isloading = false;
      }
    },
    // 首年约定采购量分析切换
    handleToggle(dom, type, data) {
      console.log(data);
      let container = Echarts.getInstanceByDom(
          document.getElementById(dom),
          "yaozh_theme"
        ),
        option = {},
        xAxis_data = [],
        yAxis_data = [],
        maxVal = [],
        _that = this;
      _that.eType = type;
      maxVal = _.maxBy(data, "value");
      maxVal = maxVal ? maxVal : 0;
      xAxis_data = _.map(data, "name");
      yAxis_data = _.map(data, "value");

      if (container) {
        container.clear(); // 存在的话先清空上一次的图表，释放内存
        container = Echarts.init(document.getElementById(dom), "yaozh_theme");
      }

      option = {
        // 柱状图
        bar: {
          legend: {
            type: "scroll",
            bottom: 0,
            data: xAxis_data
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-带量采购信息库-精准分析-首年约定采购量分析柱形图`,
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.handleToggle("shouNianYueDing", "pie", _that.mapList);
                }
              },
              myToggleMap: {
                show: true,
                title: "热力图",
                icon: "image:///static/imgs/echarts/map.png",
                onclick() {
                  _that.handleToggle("shouNianYueDing", "map", _that.mapList);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function(params) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
              }万片/支/袋`;
            }
          },
          dataZoom: [
            {
              show: true,
              bottom: 40
            }
          ],
          grid: {
            containLabel: true,
            left: "5%",
            right: "10%",
            top: "5%",
            bottom: "15%"
          },
          yAxis: {
            type: "value"
          },
          xAxis: [
            {
              type: "category",
              axisLabel: {
                show: true,
                rotate: 55,
                formatter: function(params) {
                  if (!params) return "";
                  else {
                    let str1 = params.substring(0, 10),
                      str2 = params.substring(10, 20)
                        ? params.substring(10, 20)
                        : "",
                      str3 = params.substring(20, params.length)
                        ? params.substring(20, params.length)
                        : "",
                      str4 = "";
                    if (str1) {
                      str4 = `${str1}`;
                    }
                    if (str1 && str2) {
                      str4 = `${str1}\n${str2}`;
                    }
                    if (str1 && str2 && str3) {
                      str4 = `${str1}\n${str2}\n${str3}`;
                    }
                    return str4;
                  }
                }
              },
              data: xAxis_data
            }
          ],
          series: [
            {
              type: "bar",
              data: yAxis_data
            }
          ]
        },
        // 饼图
        pie: {
          legend: {
            type: "scroll",
            bottom: "bottom",
            data: xAxis_data
          },
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-带量采购信息库-精准分析-首年约定采购量分析饼图`,
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.handleToggle("shouNianYueDing", "bar", _that.mapList);
                }
              },
              myToggleMap: {
                show: true,
                title: "热力图",
                icon: "image:///static/imgs/echarts/map.png",
                onclick() {
                  _that.handleToggle("shouNianYueDing", "map", _that.mapList);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function(params) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
              }万片/支/袋`;
            }
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
              data: data
            }
          ]
        },
        // 地图
        map: {
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-带量采购信息库-精准分析-首年约定采购量分析地图`,
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.handleToggle(dom, "bar", data);
                }
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.handleToggle(dom, "pie", data);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function(params) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
              }万片/支/袋`;
            }
          },
          visualMap: {
            min: 0,
            max: maxVal.value,
            left: "left",
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true
          },
          series: [
            {
              type: "map",
              mapType: "china",
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: data
            }
          ]
        }
      };
      container.setOption(option[type]);
      console.log(container, option[type]);
    },
    // 图表渲染-首年约定采购量分析
    shouNianYueDing() {
      const _that = this;
      this.mapList.forEach(item => {
        if (item.name === "新疆（含兵团）") {
          item.name = "新疆";
        }
      });
      let maxVal = _.maxBy(this.mapList, "value");
      maxVal = maxVal ? maxVal : 0;
      if (this.shouNianChart == null) {
        this.shouNianChart = Echarts.init(
          document.getElementById("shouNianYueDing"),
          "yaozh_theme"
        );
      } else {
        this.shouNianChart = Echarts.getInstanceByDom(
          document.getElementById("shouNianYueDing"),
          "yaozh_theme"
        );
      }
      if (_that.flag) {
        _that.handleToggle("shouNianYueDing", _that.eType, _that.mapList);
      } else {
        this.shouNianChart.setOption({
          toolbox: {
            right: "20",
            feature: {
              saveAsImage: {
                title: "保存",
                name: `药智数据企业版-带量采购信息库-精准分析-首年约定采购量分析`,
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.handleToggle("shouNianYueDing", "bar", _that.mapList);
                }
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.handleToggle("shouNianYueDing", "pie", _that.mapList);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: function(params) {
              return `${params.name}<br/>数量：${
                params.value ? params.value : 0
              }万片/支/袋`;
            }
          },
          visualMap: {
            min: 0,
            max: maxVal.value,
            left: "left",
            top: "bottom",
            text: ["高", "低"], // 文本，默认为数值文本
            calculable: true
          },
          series: [
            {
              type: "map",
              mapType: "china",
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: _that.mapList
            }
          ]
        });
      }
    }
  },
  mounted() {
    let query = this.$route.query;
    console.log(query);
    if (query.nav === "药品分析") {
      this.inputName = query.guifanname;
      this.showInputName = this.inputName;
      new Promise((resolve, reject) => {
        resolve(this.batchAnalysisName());
      })
        .then(() => {
          const _this = this;
          window
            .Axios({
              method: "get",
              url: "/api/dailiangcaigou/guigeSelect",
              params: {
                guifanname: _this.inputName
              }
            })
            .then(res => {
              if (res.data.code === 200 && res.data.data) {
                let data = res.data.data;
                _this.guigeSelectList = data;
                _this.curGuiGe = query.guifanguige; // 默认选中第一个
                new Promise((resolve, reject) => {
                  resolve(_this.qiYeZhongXuan());
                })
                  .then(
                    _this.getBasicShouNianYueDing(
                      query.type,
                      query.guifanqiyezhongbiao
                    )
                  )
                  .then(_this.getQiyeZhongxuanJiage());
              } else {
                _this.isloading = false;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .then(this.getQiyeZhongxuanJiage());
    } else {
      this.getAllRequest();
    }
    window.addEventListener("resize", this.windowResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.windowResizeEvent);
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";

@FontsizeSmall: 13px;
@FontsizeSmallBold: bold;

.page-wrap {
  background: #fff;
  box-shadow: 0 0 5px #c4d3f8;
  overflow: hidden;
  // padding-bottom: 90px;

  min-height: calc(100vh - 150px);
  // min-width: 400px !important;
  background: #fff;
  // padding-bottom: 60px;
}

/deep/ .slide-section {
  margin-bottom: 0 !important;
}

.head {
  height: 58px;
  line-height: 58px;
  display: flex;
  justify-content: space-between;

  .yyxs-title {
    font-size: 15px;
    color: @PrimaryColor;
    margin-left: 18px;
    &:before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      background: @PrimaryColor;
      margin-right: 10px;
    }
  }
}
.screen {
  margin: 20px 0 20px 18px;
  clear: both;
  overflow: hidden;
  font-size: 14px;
  .yyxs-title {
    float: left;
  }
  ul {
    float: left;
    margin-left: 20px;
    width: calc(100% - 135px);
    li {
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      &:hover {
        color: @PrimaryColor;
      }
    }
    .active {
      color: @PrimaryColor;
    }
  }
}
.top {
  margin: 20px 0 0 20px;
  clear: both;
  overflow: hidden;
  .item-sel {
    margin-right: 10px;
    float: left;
  }
  .top-btn {
    float: right;
    margin-right: 20px;
  }
}
.inp-group {
  position: relative;
  width: 230px;
  .el-select {
    width: 100%;
  }
  .el-icon-search {
    position: absolute;
    z-index: 9;
    right: 22px;
    top: 50%;
    margin-top: -6px;
    font-size: 14px;
    color: #c0c4cc;
  }
}
.nopms-btn {
  background: #97a2bf;
  border: none;
  color: #fff !important;
}
/deep/.content {
  padding: 0 !important;
}
.the-part {
  .tb-wrap {
    padding: 0 0 20px 0 !important;
    .chart_top {
      position: relative;
      background-color: #eff2fa;
    }
    .chart_bottom {
      background-color: #eff2fa;
      padding-top: 22px;
    }
    .newtotals {
      display: flex;
      align-items: center;
      background: #fff;
      overflow-x: auto;
      .total-item {
        flex: 1;
        min-width: 127px;
        text-align: center;
        vertical-align: text-bottom;
        border-bottom: 3px solid @White;

        &:not(:last-child) {
          margin-right: 20px;
        }
        .num-s {
          color: #4877e8;
        }
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
    .id-state {
      display: inline-block;
      padding: 0 12px;
      background: @Green;
      border-radius: 10px;
      height: 20px;
      line-height: 20px;
      color: #fff;
    }
    .tb-f1 {
      position: relative;
      margin-bottom: 10px;
      width: 100%;
      tr {
        height: 33px;
        line-height: 33px;

        th {
          border: 1px solid @BorderColorNew;
          font-size: @FontsizeSmall;
          background: @DetailTableLeftColor;
          font-weight: @FontsizeSmallBold;
        }
        td {
          border: 1px solid @BorderColorNew;
          font-size: @FontsizeSmall;
          background: @DetailTableRightColor;
          padding: 0 20px;
          text-align: center;
        }

        .xuhao {
          width: 20px;
        }
        .mc {
          // width: 80px;
        }
        .yf {
          text-align: left;
        }
      }
    }
    .tb-f2 {
      position: relative;
      margin-bottom: 10px;
      width: 100%;
      border-top: 1px solid @BorderColorNew;
      border-right: 1px solid @BorderColorNew;

      /deep/tr {
        height: 33px;
        line-height: 33px;

        /deep/th {
          padding: 0;
          border-left: 1px solid @BorderColorNew;
          border-bottom: 1px solid @BorderColorNew;
          font-size: @FontsizeSmall;
          background: @DetailTableLeftColor;
          font-weight: @FontsizeSmallBold;
        }
        /deep/td {
          border-left: 1px solid @BorderColorNew;
          border-bottom: 1px solid @BorderColorNew;
          font-size: @FontsizeSmall;
          background: @DetailTableRightColor;
          padding: 0 20px;
          text-align: center;
        }
      }

      /deep/.cell {
        padding: 0;
        text-align: center;
      }
    }
    /deep/.tb-f2.el-table:before {
      height: 0;
    }
    .h4 {
      font-size: 14px;
      font-weight: bold;
      height: 33px;
      line-height: 33px;
    }
    p {
      font-size: 13px;
    }
  }
  .echart-item {
    position: relative;
    margin-top: 15px;
    .header {
      height: 32px;
      background: #fff;
      border-bottom: 1px solid #dfe5f1;
      line-height: 32px;
      margin-bottom: 10px;
      .title {
        display: inline-block;
        height: 29px;
        line-height: 29px;
        color: @PrimaryColor;
        font-size: 14px;
        padding: 0 10px 0 4px;
        border-bottom: 3px solid @PrimaryColor;
        margin-left: 32px;
      }
    }
    .echarts-screen {
      padding-left: 32px;
    }
  }

  .echart-item {
    position: relative;
    margin-top: 15px;
    .header {
      height: 32px;
      border-bottom: 1px solid #dfe5f1;
      line-height: 32px;
      margin-bottom: 10px;
      .title {
        display: inline-block;
        height: 29px;
        line-height: 29px;
        color: @PrimaryColor;
        font-size: 14px;
        padding: 0 10px 0 4px;
        border-bottom: 3px solid @PrimaryColor;
        margin-left: 32px;
      }
    }
    .echarts-screen {
      padding-left: 32px;
    }
  }
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

.echarts {
  width: calc(100vw - 400px);
  margin: auto;
  height: 600px;
}

.dialog {
  position: fixed;
  z-index: 99999;
  top: 48px;
  left: 0px;
  width: 100%;
  height: calc(100% - 48px);
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
        color: @PrimaryColor;
        box-shadow: @BoxShadow;
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
        height: 100%;
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

.shadow {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
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

/deep/.lc {
  font-weight: unset !important;
  font-size: 14px !important;
  margin-left: 20px !important;
}

.cont-wrap {
  background: #fff;
  padding-bottom: 1px;
}

.D {
  background: @TdBackgroundColor;
  padding: 30px 0 25px 0;
  ul {
    display: inline-block;
    display: flex;
    justify-content: space-around;
    align-items: center;
    div .num {
      font-size: 24px;
      color: @PrimaryColor;
    }
    .gg-company {
      max-width: 300px;
      .company {
        white-space: nowrap;
      }
    }
  }
}
</style>
