<template>
  <div class="page-wrap">
    <LoadingGif :className="'db-index-loading'" :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <slide-section :title="'企业分析'" class="the-part">
      <div class="tb-wrap">
        <!-- 名称 -->
        <div class="head">
          <div class="yyxs-title">
            {{ showInputName }}
          </div>
          <div class="yyxs-name">
            企业名称
            <el-autocomplete style="margin: 0 20px" class="inline-input" v-model="inputName"
              :fetch-suggestions="querySearch" :popper-append-to-body="false" :placeholder="inputName"
              :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
          </div>
        </div>
        <!-- 顶部统计 -->
        <div class="chart_top">
          <div class="newtotals">
            <ul class="total-item">
              <li class="li1">中选批次</li>
              <li class="li2">
                总计<span class="num-s">{{ basicDataObj.zxpici_count }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">中选品种</li>
              <li class="li2">
                总计
                <span class="num-s">{{ basicDataObj.zxguifanname_count }}</span>个
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">最高中选单价</li>
              <li class="li1" style="padding-top: 0">（最小制剂单位）</li>
              <li class="li3">
                {{ basicDataObj.danjian_of_max_selected_unit_price }}元
              </li>
              <li class="li3">
                {{ basicDataObj.guifanname_of_max_selected_unit_price }}
                （{{ basicDataObj.guifanguige_of_max_selected_unit_price }}）
              </li>
              <li class="li3">
                <span v-if="basicDataObj.type_of_max_selected_unit_price">{{
                    basicDataObj.type_of_max_selected_unit_price
                }}</span>
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">最低中选单价</li>
              <li class="li1" style="padding-top: 0">（最小制剂单位）</li>
              <li class="li3">
                {{ basicDataObj.danjian_of_min_selected_unit_price }}元
              </li>
              <li class="li3">
                {{ basicDataObj.qiye_of_min_selected_unit_price }}
                （{{ basicDataObj.guifanguige_of_min_selected_unit_price }}）
              </li>
              <li class="li3">
                <span v-if="basicDataObj.type_of_min_selected_unit_price">{{
                    basicDataObj.type_of_min_selected_unit_price
                }}</span>
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
                {{ basicDataObj.guifanname_of_the_highest_decline }}
                <span v-if="basicDataObj.guifanguige_the_highest_decline">（{{
                    basicDataObj.guifanguige_the_highest_decline
                }}）</span>
              </li>
              <li class="li3">
                {{ basicDataObj.type_the_highest_decline }}
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
                {{ basicDataObj.guifanname_of_the_minimum_decline }}
                <span v-if="basicDataObj.guifanguige_the_minimum_decline">（{{
                    basicDataObj.guifanguige_the_minimum_decline
                }}）</span>
              </li>
              <li class="li3">
                {{ basicDataObj.type_the_minimum_decline }}
              </li>
            </ul>
            <ul class="total-item">
              <li class="li1">一致性评价进度</li>
              <li class="li1" style="padding-top: 0">通过/视同通过）</li>
              <li class="li2">
                <span class="num-s">{{ basicDataObj.yzxpj_jindu }}</span>个
              </li>
              <li class="li3">未进入集中采购目录</li>
              <li class="li3" style="padding-top: 0">
                品种
                <span class="num-s" style="
                    cursor: pointer;
                    text-decoration: underline;
                    margin-top: 30px;
                  " @click="lookMore">{{ basicDataObj.yzxpj_jindu_weijinru }}</span>
                个
              </li>
            </ul>
          </div>
        </div>
        <!-- 图表项 -->
        <div class="echarts-wrap">
          <div class="echart-item" ref="echartItem" v-waiting="qiYeZhongXuanObj.danjia.length == 0">
            <div class="header">
              <span class="title">药品中选价格分析</span>
            </div>
            <div v-show="qiYeZhongXuanObj.danjia.length > 0" class="echarts" ref="qiYeZhongXuan" id="qiYeZhongXuan">
            </div>
            <div class="shadow" v-show="qiYeZhongXuanObj.danjia.length == 0">
              <img src="../../../../static/imgs/nodata.png" alt="" />
            </div>
          </div>
          <div class="echart-item" ref="echartItem">
            <div class="header">
              <span class="title">首年约定销售额分析</span>
            </div>
            <div style="display: flex">
              <div class="yyxs-name" style="margin-left: 20px">
                批次：
                <el-select v-model="curPici" @change="changeValue" :popper-append-to-body="false" ref="popoverSelect">
                  <el-option v-for="(option, index) in piciList" :key="index" :title="option" :label="option"
                    :value="option">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="echarts-container">
              <div v-show="isShowQS">
                <div v-show="shouNianYueDingQSObj.xiaoshoue.length > 0" class="echarts" ref="shouNianYueDingQS"
                  id="shouNianYueDingQS"></div>
                <div class="shadow" v-show="shouNianYueDingQSObj.xiaoshoue.length == 0">
                  <img src="../../../../static/imgs/nodata.png" alt="" />
                </div>
              </div>
              <div v-show="shouNianYueDingZZObj.xiaoshoue.length > 0" class="echarts" ref="shouNianYueDingZZ"
                id="shouNianYueDingZZ"></div>
              <div class="shadow" v-show="shouNianYueDingZZObj.xiaoshoue.length == 0">
                <img src="../../../../static/imgs/nodata.png" alt="" />
              </div>
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
      type: String,
    },
    nopmState: {
      type: Boolean,
    },
    type: {
      type: Number,
    },
  },
  components: {
    LoadingGif,
    Select,
    SlideSection,
  },
  data() {
    return {
      isShowQS: true, // 批次选择了除全部以外的批次，都不展示第一个图表
      showInputName: "", // 展示的企业名称
      curPici: "全部", // 当前选中的批次
      piciList: [], // 批次下拉数组
      inputName: "", // 默认输入的企业名称
      iconShow: true,
      isloading: true,
      inputIcon: "el-icon-search",
      yearSel: {
        model: "",
        placeholder: "请选择年份",
        options: [],
        loading: false,
      },
      guifanqiye: "",
      screenList: [],
      totalList: [],
      titleYearStr: "",
      apiDlypinputList: [],
      clearSel: false,
      title: ["首年约定销售额分析"], //图形标题
      dialogVisible: false,
      basicDataObj: {}, // 顶部基础数据对象
      // 药品中选价格分析数据对象
      qiYeZhongXuanObj: {
        xAxis: [],
        danjia: [],
        feiyong_uint_avg_res: [],
        xianjia: [],
        jiangfu: [],
      },
      shouNianYueDingQSObj: {
        xAxis: [],
        xiaoshoue: [], // 销售额，单位（万元）
      },
      shouNianYueDingZZObj: {
        xAxis: [],
        xiaoshoue: [], // 销售额，单位（万元）
      },
      qiYeZhongXuanChart: null,
      shouNianYueDingQSChart: null, // 首年约定销售额分析图表对象
      shouNianYueDingZZChart: null, // 药品中选价格分析图表对象
      /**
       * 窗口大小调整事件
       */
      windowResizeEvent: _.throttle(() => {
        this.echartsResize("echarts");
      }, 500),
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Yyxs.nopms,
    }),
    yearModel() {
      return this.yearSel.model.toString();
    },
  },
  watch: {},
  methods: {
    changeValue(currentVal) {
      this.isloading = true;
      this.curPici = currentVal;
      if (this.curPici === "全部" && this.piciList.length > 2) {
        this.isShowQS = true;
      } else if (this.piciList.length === 2 && this.curPici === "全部") {
        this.isShowQS = false;
      } else this.isShowQS = false;
      if (this.isShowQS) {
        this.getshouNianYueDingQS();
      }
      this.getshouNianYueDingZZ();
      this.isloading = false;
    },
    getAllRequest() {
      const _this = this;
      // 获取顶部企业名称
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/mostEnterprises",
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            console.log(data);
            _this.inputName = data.guifanqiyezhongbiao;
            _this.showInputName = _this.inputName;
            _this.batchAnalysisQiye();
            _this.getBasicShouNianYueDing();
            _this.getNameZhongxuanJiage();
            // _this.getshouNianYueDingQS();
            // _this.getshouNianYueDingZZ();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 顶部基础数据项
    batchAnalysisQiye() {
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/batchAnalysisQiye",
          params: {
            guifanqiyezhongbiao: this.inputName,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.basicDataObj = data;
            console.log(data);
          }
        })
        .catch((err) => {
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
        `dailiangcaigouqiye_yzxjd__${this.inputName}`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `dailiangcaigouqiye_yzxjd__${this.inputName}`,
      ]);

      let routerData = this.$router.resolve({
        path: "/yzxjd",
        query: {
          qyname: this.inputName,
        },
      });
      window.open(routerData.href, "_blank");
    },
    querySearch(queryString, cb) {
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/inputAnaly",
          params: {
            guifanqiyezhongbiao: this.inputName,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            console.log(data);
            let arr = [];
            if (data.length > 0) {
              data.length > 0 &&
                data.forEach((item) => {
                  arr.push({
                    value: item,
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
        resolve(this.batchAnalysisQiye());
      })
        .then(this.getBasicShouNianYueDing)
        .then(this.getNameZhongxuanJiage)
        .then(this.getshouNianYueDingQS)
        .then(this.getshouNianYueDingZZ)
        .then((this.isloading = false));
    },
    getImgName(i) {
      return `药智数据企业版-带量采购信息库-智能分析-${this.title[i]}`;
    },
    // 请求-获取药品中选价格分析
    getNameZhongxuanJiage() {
      const _this = this;
      window
        .Axios({
          method: "get",
          url: "/api/dailiangcaigou/nameZhongxuanJiage",
          params: {
            guifanqiyezhongbiao: _this.inputName,
          },
        })
        .then((res) => {
          _this.qiYeZhongXuanObj = {
            xAxis: [],
            danjia: [],
            feiyong_uint_avg_res: [],
            xianjia: [],
            jiangfu: [],
          };
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            console.log(data);
            data.length > 0 &&
              data.forEach((item) => {
                _this.qiYeZhongXuanObj.xAxis.push(
                  item.guifanname + `（${item.guifanguige}, ${item.type}）`
                );
                _this.qiYeZhongXuanObj.feiyong_uint_avg_res.push(
                  item.feiyong_uint_avg_res
                );
                _this.qiYeZhongXuanObj.danjia.push(item.danjia);
                _this.qiYeZhongXuanObj.jiangfu.push(item.jiangfu);
                _this.qiYeZhongXuanObj.xianjia.push(item.xianjia);
              });
            console.log(_this.qiYeZhongXuanObj.jiangfu);
            _this.qiYeZhongXuan();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 图表渲染-药品中选价格分析
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
      console.log(this.qiYeZhongXuanChart);
      this.qiYeZhongXuanChart.setOption({
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-带量采购信息库-精准分析-药品中选价格分析}`,
              icon: "image:///static/imgs/echarts/download.png"
            },
          }
        },
        tooltip: {
          trigger: "axis",

          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          containLabel: true,
          left: "6%",
          right: "10%",
          top: "5%",
          bottom: 100,
        },
        legend: {
          data: [
            "中选单价（最小制剂单位）",
            "中标平均价（近3年）",
            "最高有效申报价",
            "降幅",
          ],
          bottom: 0,
        },
        dataZoom: [
          {
            show: true,
            bottom: 40,
            startValue: this.qiYeZhongXuanObj.xAxis.length > 0 ? 0 : null,
            endValue: this.qiYeZhongXuanObj.xAxis.length > 10 ? 9 : this.qiYeZhongXuanObj.xAxis.length - 1
          },
        ],
        xAxis: [
          {
            type: "category",

            axisLabel: {
              show: true,
              rotate: 55,
              formatter: function (params) {
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
              },
            },
            data: this.qiYeZhongXuanObj.xAxis,
          },
        ],
        yAxis: [
          {
            name: "价格（元）",
            type: "value",
          },
          {
            name: "降价幅度",
            type: "value",
          },
        ],
        series: [
          {
            name: "中选单价（最小制剂单位）",
            type: "bar",
            data: this.qiYeZhongXuanObj.danjia,
          },
          {
            name: "中标平均价（近3年）",
            type: "bar",
            data: this.qiYeZhongXuanObj.feiyong_uint_avg_res,
          },
          {
            name: "最高有效申报价",
            type: "bar",
            data: this.qiYeZhongXuanObj.xianjia,
          },
          {
            name: "降幅（%）",
            type: "line",
            yAxisIndex: 1,
            label: {
              show: true,
              position: "right",
              formatter: "{c} %",
            },
            data: this.qiYeZhongXuanObj.jiangfu,
          },
        ],
      });
    },
    async getBasicShouNianYueDing() {
      const res = await window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/firstPiciSelect",
        params: {
          guifanqiyezhongbiao: this.inputName,
        },
      });
      if (res.data.code === 200 && res.data.data) {
        let data = res.data.data;
        this.piciList = ["全部", ...data];
        this.curPici = this.piciList[0];
        if (this.curPici === "全部" && this.piciList.length > 2) {
          this.isShowQS = true;
          this.getshouNianYueDingQS();
        } else if (this.piciList.length === 2 && this.curPici === "全部") {
          this.isShowQS = false;
        } else this.isShowQS = false;
        console.log(this.curPici, data);
      }
      this.getshouNianYueDingZZ();
    },
    // 请求-首年约定销售额分析
    async getshouNianYueDingQS() {
      const res3 = await window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/shounianXiaoshoueZhexian",
        params: {
          guifanqiyezhongbiao: this.inputName,
        },
      });
      this.shouNianYueDingQSObj.xAxis = [];
      this.shouNianYueDingQSObj.xiaoshoue = []; // 销售额，单位（万元）
      if (res3.data.code === 200 && res3.data.data) {
        let data = res3.data.data;
        console.log(this.shouNianYueDingQSObj);
        data.length > 0 &&
          data.forEach((item) => {
            this.shouNianYueDingQSObj.xAxis.push(item.type);
            this.shouNianYueDingQSObj.xiaoshoue.push(item.xiaoshoue);
          });
        this.shouNianYueDingQS();
      }
    },
    // 图表渲染-首年约定销售额分析
    shouNianYueDingQS() {
      console.log(this.shouNianYueDingQSObj);
      const _that = this;
      if (_that.shouNianYueDingQSChart == null) {
        _that.shouNianYueDingQSChart = Echarts.init(
          document.getElementById("shouNianYueDingQS"),
          "yaozh_theme"
        );
        console.log(_that.shouNianYueDingQSChart);
      } else {
        _that.shouNianYueDingQSChart = Echarts.getInstanceByDom(
          document.getElementById("shouNianYueDingQS"),
          "yaozh_theme"
        );
      }
      let option = {
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-带量采购信息库-精准分析-首年约定销售额分析趋势图`,
              icon: "image:///static/imgs/echarts/download.png"
            },
          }
        },
        tooltip: {
          trigger: "axis",

          axisPointer: {
            type: "shadow",
          },
          formatter: "{b}销售额<br/>{c} 万元",
        },
        grid: {
          containLabel: true,
          left: "6%",
          right: "10%",
          top: "5%",
          bottom: "15%",
        },
        dataZoom: [
          {
            show: true,
            bottom: 40,
          },
        ],
        yAxis: {
          type: "value",
          name: "单位（万元）",
        },
        xAxis: [
          {
            type: "category",

            axisLabel: {
              show: true,
              rotate: 55,
              formatter: function (params) {
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
              },
            },
            data: _that.shouNianYueDingQSObj.xAxis,
          },
        ],
        series: [
          {
            type: "line",
            data: _that.shouNianYueDingQSObj.xiaoshoue,
          },
        ],
      };
      console.log(option);
      _that.shouNianYueDingQSChart.setOption(option);
    },
    // 请求-首年约定销售额分析
    async getshouNianYueDingZZ() {
      const res3 = await window.Axios({
        method: "get",
        url: "/api/dailiangcaigou/shounianXiaoshoueZhuzhuang",
        params: {
          guifanqiyezhongbiao: this.inputName,
          type: this.curPici == "全部" ? "" : this.curPici,
        },
      });
      this.shouNianYueDingZZObj.xAxis = [];
      this.shouNianYueDingZZObj.xiaoshoue = [];
      if (res3.data.code === 200 && res3.data.data) {
        let data = res3.data.data;
        console.log(data);
        data.length > 0 &&
          data.forEach((item) => {
            this.shouNianYueDingZZObj.xAxis.push(item.guifanname);
            this.shouNianYueDingZZObj.xiaoshoue.push(item.xiaoshoue);
          });
        this.isloading = false;
        this.shouNianYueDingZZ();
      }
    },
    shouNianYueDingZZ() {
      console.log(this.shouNianYueDingZZObj);
      const _that = this;
      if (!_that.shouNianYueDingZZChart) {
        _that.shouNianYueDingZZChart = Echarts.init(
          document.getElementById("shouNianYueDingZZ"),
          "yaozh_theme"
        );
      } else {
        _that.shouNianYueDingZZChart = Echarts.getInstanceByDom(
          document.getElementById("shouNianYueDingZZ"),
          "yaozh_theme"
        );
      }
      console.log(_that.shouNianYueDingZZChart);
      _that.shouNianYueDingZZChart.setOption({
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: `药智数据企业版-带量采购信息库-精准分析-首年约定销售额分析柱状图`,
              icon: "image:///static/imgs/echarts/download.png"
            },
          }
        },
        tooltip: {
          trigger: "axis",

          axisPointer: {
            type: "shadow",
          },
          formatter: "{b}: {c} 万元",
        },
        grid: {
          containLabel: true,
          left: "5%",
          right: "10%",
          top: "5%",
          bottom: "15%",
        },
        dataZoom: [
          {
            show: true,
            bottom: 40,
            startValue: _that.shouNianYueDingZZObj.xAxis.length > 0 ? 0 : null,
            endValue: _that.shouNianYueDingZZObj.xAxis.length > 10 ? 9 : _that.shouNianYueDingZZObj.xAxis.length - 1
          },
        ],
        yAxis: {
          type: "value",
          name: "单位（万元）",
        },
        xAxis: [
          {
            type: "category",

            axisLabel: {
              show: true,
              rotate: 55,
              formatter: function (params) {
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
              },
            },
            data: _that.shouNianYueDingZZObj.xAxis,
          },
        ],
        series: [
          {
            type: "bar",
            data: _that.shouNianYueDingZZObj.xiaoshoue,
          },
        ],
      });
    },
  },
  mounted() {
    this.getAllRequest();
    window.addEventListener("resize", this.windowResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.windowResizeEvent);
  },
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

/deep/.el-input__inner {
  min-width: 200px;
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

.echarts-container {
  display: flex;
  flex-wrap: wrap;

  div {
    width: 600px;
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
</style>
