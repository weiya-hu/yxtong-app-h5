<template>
  <div class="echart-item" ref="echartItem">
    <!-- <LoadingGif
      :className="'item-loading'"
      :loadFlag="edata.loading"
      v-if="edata.loading"
      :delayTime="0"
    ></LoadingGif> -->
    <div class="header">
      <span class="title">{{ edata.name | labelFilter(that) }}</span>
    </div>
    <div class="echarts-screen" v-if="edata.select">
      <el-select v-model="edata.select.model" :style="{
        display: 'flex',
        minWidth: '200px',
        maxWidth: selectWidth
      }" :placeholder="edata.select.placeholder" filterable clearable autoWidth :collapse-tags="multiple"
        :multiple-limit="5" :multiple="multiple" :popper-append-to-body="false" @change="selChange">
        <el-option v-for="item in edata.select.option" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <div class="echarts-title">
      <div class="title" v-html="titleWrap"></div>
      <div class="change-wrap">
        <span title="柱状图" v-if="edata.type.indexOf('bar') > -1 && edata.curType != 'bar'"
          @click="changeEcharts('bar')"><img src="~@/assets/imgs/bar.png" /></span>
        <span title="饼图" v-if="edata.type.indexOf('pie') > -1 && edata.curType != 'pie'"
          @click="changeEcharts('pie')"><img src="~@/assets/imgs/pie.png" /></span>
        <span title="表格" v-if="edata.type.indexOf('table') > -1 && edata.curType != 'table'"
          @click="drawTable('table')"><i class="iconfont">&#xe654;</i></span>
      </div>
    </div>
    <div v-if="edata.curType == 'table'" class="echart-table-wrap">
      <!-- 分类分析的导出因为数据量太大 所以隐藏 -->
      <div class="export-table" v-if="!noexport && edata.data && edata.url !== 'dlflxsqsoutdata'">
        更多数据点击<span v-if="nopmState" @click="clickeExport" :class="{ 'abandon-click-method': hasPermission }">导出<i
            title="导出" class="iconfont">&#xe641;</i></span>
      </div>
      <el-table v-if="!edata.tableFormat" :data="edata.data" class="echart-table" style="width: 100%">
        <el-table-column v-for="(item, i) in edata.tableHead" prop="num" :label="item.label | labelFilter(that)"
          :key="i">
          <template slot-scope="scope">
            <div>
              <span v-if="item.prop === 'sale' || item.prop === 'value'">{{
                  echartsTooltipMoney(scope.row[item.prop]) | labelFilter(that)
              }}</span>
              <span v-else>{{ scope.row[item.prop] | labelFilter(that) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else :data="edata.data" class="echart-table" style="width: 100%">
        <el-table-column v-for="(item, i) in edata.tableHead" prop="num" :label="item.label" :key="i">
          <template slot-scope="scope">
            <div>
              <span v-if="item.prop === 'sale' || item.prop === 'value'">{{
                  echartsTooltipMoney(scope.row[item.prop]) | labelFilter(that)
              }}</span>
              <span v-else>{{
                  scope.row[item.prop] + "（" + scope.row["guifanqiye"] + "）" | labelFilter(that)
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <MEcharts ref="echarts" v-show="edata.curType != 'table'" :option="edata.option" class="echarts" :width="width"
      :style="{ width: width + 'px' }" isloading :loading="edata.eloading" />
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import MEcharts from "../../yiyuanxiaoshou/components/echarts.vue";
import Select from "@/components/inputs/select";
import { mapState } from "vuex";
export default {
  props: {
    nowNav: {
      type: String
    },
    atc: {
      type: String
    },
    categ: {
      type: String
    },
    qyTitle: {
      type: String
    },
    multiple: {
      type: Boolean
    },
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    year: {
      type: String
    },
    name: {
      type: String
    },
    namestr: {
      type: String
    },
    type: {
      type: Number
    },
    noexport: {
      type: Boolean
    },
    queryName: {
      type: String
    },
    nopmState: {
      type: Boolean
    },
    tviewkey: {
      type: String,
      default: "sale"
    }
  },
  components: {
    LoadingGif,
    MEcharts,
    Select
  },
  filters: {
    labelFilter(t, that) {
      t = t ? t.toString() : "-";
      if (that.tviewkey == 'amount') {
        return t.replace(/销售额/gi, '销售量').replace(/元/gi, '')
      } else {
        return t
      }
    }
  },
  data() {
    return {
      selectWidth: 0,
      edata: this.item,
      xsqs: "0",
      xsqsList: [
        {
          value: "0",
          label: "全部"
        }
      ],
      width: window.innerWidth - 340,
      that: this
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Yyxs.nopms
    }),
    totalN() {
      if (this.tviewkey == 'sale') {
        return "总额"
      } else {
        return "总量"
      }
    },
    hasPermission() {
      return this.nopms.yyxsviewoutdata;
    },
    titleWrap() {
      let val = this.edata.title;
      if (this.tviewkey == 'amount') {
        val = val.replace(/销售额/gi, '销售量')
      }
      function lenStat(str) {
        function isChinese(str) {
          //判断是不是中文
          var reCh = /[u00-uff]/;
          return !reCh.test(str);
        }
        var strlen = 0; //初始定义长度为0
        var text = str.trim();
        for (var i = 0; i < text.length; i++) {
          if (isChinese(text.charAt(i)) == true) {
            strlen = strlen + 2; //中文为2个字符
          } else {
            strlen = strlen + 1; //英文一个字符
          }
        }
        return strlen;
      }
      var strlen = lenStat(val);
      var strs = "";
      for (var i = 0; i < strlen; i = i + 40) {
        strs += val.substring(i, i + 40) + "<br>";
      }
      return strs;
    }
  },
  watch: {
    year(val) {
      this.$refs.echarts.clear();
    },
    name(val) {
      this.$refs.echarts.clear();
    },
    item: {
      deep: true,
      handler: obj => {
        this.edata = obj;
      }
    },
    $route() {
      if (this.$route.path === "/yyxsdata") {
        window.addEventListener("resize", this.echartsResizeHandler);
      } else {
        window.removeEventListener("resize", this.echartsResizeHandler);
        this.echartsClear("echarts");
      }
    }
  },
  methods: {
    //统一转换单位
    unitChange(data, key) {
      key = key || "sale";
      let isBillion = this.isBillion(data, key);
      if (isBillion) {
        _.forEach(data, item => {
          item[key] = item[key] / 10000;
        });
      }
      return data;
    },
    //判断是否需要转换单位
    isBillion(data, key) {
      key = key || "sale";
      let isBillion = false;
      _.forEach(data, item => {
        let num = parseFloat(item[key]);
        if (num >= 10000) {
          isBillion = true;
        }
      });
      return isBillion;
    },
    changeEcharts(type) {
      this.showTable = false;
      this.edata.curType = type;
      this.$emit("changeEcharts", type, this.index);
      this.$refs.echarts.clear();
    },
    selChange() {
      this.edata.loading = true;
      this.$refs.echarts.clear();
      this.$emit("selChange", this.edata.select.model, () => {
        this.edata.loading = false;
      });
      if (this.edata.select.model[0].length > 0) {
        let len = this.edata.select.model[0].length;
        this.selectWidth = (len > 0 ? len * 17 : 0) + 60;
        this.selectWidth =
          (this.selectWidth > 200 ? this.selectWidth : 200) + "px";
        $(".el-select-dropdown__item").css("width", this.selectWidth);
      }
    },
    //导出单元表格
    clickeExport() {
      if (this.nopms.yyxsviewoutdata) {
        return false;
      }
      let head = this.edata.tableHead;
      let headStr = "";
      _.forEach(head, item => {
        headStr += `${item.prop}=${item.label},`;
      });

      let url;
      let yearStr = this.year ? `year=${this.year}` : "";
      let typeStr = this.type ? `type=${this.type}` : "";
      let guifanqiyeStr = this.namestr ? `${this.queryName}=${this.namestr}` : '';
      if (this.edata.url === "dlypxsqsoutdata") {
        guifanqiyeStr = this.namestr ? `${this.queryName}=${this.namestr}` : '';
      } else if (this.edata.url === "dlqyxsqsoutdata") {
        guifanqiyeStr = this.name ? `${this.queryName}=${this.name}` : '';
      }
      let token = GETCOOKIEFUN("accesstoken");
      let fileName = (this.multiple ? this.qyTitle : this.edata.title) || this.edata.title;
      if (
        this.edata.url === "dlypxsqsoutdata" ||
        this.edata.url === "dlqyxsqsoutdata"
      ) {
        let qyStr;
        if (this.edata.select.model) {
          let guifanqiye = "",
            name = this.edata.select.model.join(",") || "";
          if (this.edata.select.model.length > 0) {
            guifanqiye = this.edata.select.model.join(",");
            qyStr = this.type
              ? `guifanqiyestr=${guifanqiye}`
              : `namestr=${name}`;
            if (this.type) {
              qyStr = guifanqiye ? `guifanqiyestr=${guifanqiye}` : "";
            } else {
              qyStr = name ? `namestr=${name}` : "";
            }
          } else {
            if (!this.type) {
              qyStr = name ? `namestr=${name}` : "";
            }
          }
        } else {
          qyStr = "";
        }
        url = `/api/yyxs/${this.edata.url}?${yearStr}&${guifanqiyeStr}&${typeStr}&${qyStr}&outdata_column=${headStr}tablename=${fileName}&accesstoken=${token}`;
      } else if (this.edata.url === "dlflxsqsoutdata") {
        let str = "";
        if (this.edata.select.atc) {
          str += `atc=${this.edata.select.atc}&`;
        }
        if (this.edata.select.categ) {
          str += `categ=${this.edata.select.categ}&`;
        }
        if (this.edata.select.year) {
          str += `year=${this.edata.select.year}&`;
        }
        if (this.edata.select.year) {
          url = `/api/yyxs/${this.edata.url}?${str}outdata_column=key=季度,value=销售额（亿元）,tb=同比（%）,hb=环比（%）`;
        } else {
          url = `/api/yyxs/${this.edata.url}?${str}outdata_column=key=年份,value=销售额（亿元）,tb=同比（%）`;
        }
        url += `,tablename=${this.edata.title}&accesstoken=${token}`;
      } else {
        let str = "";
        if (this.atc) {
          str += `atc=${this.atc}&`;
        }
        if (this.categ) {
          str += `categ=${this.categ}&`;
        }
        if (this.year) {
          str += `year=${this.year}&`;
        }
        url = `/api/yyxs/dlyyxsoutdata?${str}`;
        if (this.nowNav == '药品分析') {
          if (this.queryName && this.namestr) {
            url += `${this.queryName}=${this.namestr}&`;
          }
        } else if (this.nowNav == '企业分析') {
          if (this.queryName && this.name) {
            url += `${this.queryName}=${this.name}&`;
          }
        } else {
          if (this.queryName && this.namestr) {
            url += `${this.queryName}=${this.namestr}&`;
          }
        }
        if (typeStr) {
          url += `${typeStr}&`;
        }
        url += `outdata_column=${headStr}tablename=${this.edata.title}&outdata_action=${this.edata.url}&accesstoken=${token}`;
      }
      url += "&is_magnify=1";
      if (this.tviewkey == 'amount') {
        url = url.replace(/销售额/gi, '销售量').replace(/元/gi, '片/粒/袋/支')
        url = url.replace(/sale\=/gi, 'amount=')
        url += "&type_view=2"
      }
      console.log(url)
      // return 
      if (
        this.edata.name === "销售量趋势" ||
        this.edata.name === "销售额趋势" ||
        this.edata.name === "省份分析" ||
        this.edata.url == "dlypjxfx" ||
        this.edata.url == "dlqyjxfx" ||
        this.edata.url == "dlfljxfx" ||
        this.edata.url == "dlflhxcf" ||
        this.edata.url == "dlflpzfx" ||
        this.edata.url == "dlflqyfx" ||
        this.edata.url == "dlflppfx"
      ) {
        window.open(url);
      } else {
        this.$emit("changeLoading", true);
        /*使用ajax同步请求，避免回调open被拦截*/
        setTimeout(() => {
          this.$emit("changeLoading", false);
          $.ajax({
            method: "get",
            dataType: "json",
            url: url + "&outdata_count",
            async: false, //设置为同步请求
            success: res => {
              let data = JSON.parse(res);
              let total = data.data.count;
              if (total > 1000) {
                this.$Confirm(
                  "导出",
                  `当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,
                  () => {
                    window.open(url);
                  }
                );
              } else {
                window.open(url);
              }
            }
          });
        }, 300);
      }
    },
    //柱状折线图
    drawBarLine(data, isBillion, is_magnify = false) {
      if (is_magnify) {
        let unit = this.edata.unit;
        let totalsData = [
          {
            name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
            type: "bar",
            data: []
          }
        ];
        let xdata = [];
        let ldata = [];
        _.forEach(data, (item, i) => {
          if (this.year) {
            totalsData[0].data.push(isBillion ? item.sale / 10000 : item.sale);
          }
          xdata.push(this.year ? item.quarter : item.year);
          _.forEach(item.value, items => {
            ldata.push(items.key);
          });
        });

        let zlist = _.uniq(ldata);
        let sdata = [];
        let _sdata = [];
        let totalList = [];
        _.forEach(zlist, (item, i) => {
          _sdata[i] = [];
          _.forEach(data, (items, j) => {
            _sdata[i].length = data.length;
            _.forEach(items.value, itemss => {
              if (itemss.key === "总额") {
                totalList[j] = isBillion
                  ? itemss.sale.value / 10000
                  : itemss.sale.value;
              }
              if (item === itemss.key && item != "总额") {
                let svalue;
                if (itemss.value) {
                  svalue = itemss.value.sale.value;
                } else {
                  svalue = itemss.sale.value;
                }
                _sdata[i][j] = isBillion ? svalue / 10000 : svalue;
              }
            });
          });
        });
        _.forEach(zlist, (item, i) => {
          sdata.push({
            name: item,
            type: "bar",
            stack: "year",
            data: _sdata[i]
          });
        });
        let tbList = [];
        _.forEach(this.edata.data, (item, i) => {
          tbList[i] = item.tb;
        });

        // sdata = this.year ? totalsData : sdata

        if (is_magnify) {
          sdata = this.year ? totalsData : sdata;
        }

        sdata.push({
          type: "line",
          name: "同比（%）",
          yAxisIndex: 1,
          data: tbList,
          label: {
            show: true,
            position: "right",
            color: "#333",
            formatter: val => {
              return val.value + "%";
            }
          }
        });

        let obj = {
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: list => {
              let zeStr = "",
                str = "";
              if (is_magnify) {
                zeStr =
                  this.year || this.edata.select.model
                    ? ""
                    : `${this.totalN}：${this.echartsTooltipMoney(
                      totalList[list[0].dataIndex]
                    )}`;
                str = `${list[0].name}${this.year ? "季度" : ""
                  }&nbsp;&nbsp;&nbsp;&nbsp;${zeStr}<br/>`;
              } else {
                zeStr =
                  this.year || this.edata.select.model
                    ? ""
                    : `${this.totalN}：${this.echartsTooltipMoney(
                      totalList[list[0].dataIndex]
                    )}`;
                str = `${list[0].name == "undefined" ? "" : list[0].name}${this.year ? this.year : ""
                  }&nbsp;&nbsp;&nbsp;&nbsp;${zeStr}<br/>`;
              }
              _.forEach(list, item => {
                if (item.data && item.seriesName != "总额") {
                  if (
                    item.seriesName != "其他" &&
                    item.seriesName != "同比（%）"
                  ) {
                    str += `<span style='display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:${item.color
                      }'></span>${item.seriesName}：${this.echartsTooltipMoney(
                        item.data
                      )}<br/>`;
                  }
                }
              });
              _.forEach(list, item => {
                if (item.data) {
                  if (item.seriesName == "其他") {
                    str += `<span style='display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:${item.color
                      }'></span>${item.seriesName}：${this.echartsTooltipMoney(
                        item.data
                      )}<br/>`;
                  }
                }
              });
              _.forEach(list, item => {
                if (item.data) {
                  if (item.seriesName == "同比（%）") {
                    str += `<span style='display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:${item.color}'></span>${item.seriesName}：${item.data}<br/>`;
                  }
                }
              });
              return str;
            }
          },
          grid: {
            left: "10%",
            right: "12%",
            bottom: "8%",
            top: "10%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            show: true,
            axisLabel: {
              formatter: value => {
                if (is_magnify) {
                  value = this.year ? `${value}季度` : value;
                } else {
                  value = this.year ? this.year : `${value}`;
                }
                return value;
              }
            }
          },
          yAxis: [
            {
              type: "value",
              name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
              show: true,
              nameTextStyle: {
                padding: [0, 40, 0, 0]
              }
            },
            {
              type: "value",
              name: "同比（%）",
              show: true,
              nameTextStyle: {
                padding: [0, 0, 0, 40]
              },
              axisLabel: {
                formatter: value => {
                  return this.echartsUnitTransform(value);
                }
              }
            }
          ]
        };
        if (this.year) {
          obj.legend = {
            data: [
              {
                name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
                icon: "circle"
              },
              {
                name: "同比（%）"
              },
              {
                name: "环比（%）"
              }
            ],
            bottom: 0
          };
          obj.yAxis[1].name = "同/环比（%）";
          let hbList = [];
          _.forEach(this.edata.data, (item, i) => {
            hbList[i] = item.hb;
          });
          sdata.push({
            type: "line",
            name: "环比（%）",
            yAxisIndex: 1,
            data: hbList,
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: val => {
                return val.value + "%";
              }
            }
          });
          sdata[0].label = {
            show: true,
            position: "top",
            color: "#333",
            formatter: val => {
              return this.echartsTooltipMoney(val.value);
            }
          };
        } else {
          let topList = [];
          _.forEach(this.edata.data, item => {
            topList.push(item.value);
          });
          sdata.push({
            name: this.tviewkey == 'sale' ? "总额" : "总量",
            type: "line",
            data: topList,
            color: "transparent",
            symbolSize: 1,
            yAxisIndex: 0,
            hoverAnimation: false,
            itemStyle: {
              color: "transparent",
              opacity: 1
            },
            label: {
              show: true,
              position: "insideBottom",
              color: "#333",
              formatter: val => {
                return this.echartsTooltipMoney(val.value);
              }
            }
          });
        }

        obj.xAxis.data = xdata;
        obj.series = sdata;
        this.edata.option = obj;
      } else {
        let unit = this.edata.unit;
        let totalsData = [
          {
            name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
            type: "bar",
            data: []
          }
        ];
        let xdata = [];
        let ldata = [];
        _.forEach(data, (item, i) => {
          if (this.year) {
            totalsData[0].data.push(isBillion ? item.sale / 10000 : item.sale);
          }
          xdata.push(this.year ? item.quarter : item.year);
          _.forEach(item.value, items => {
            ldata.push(items.key);
          });
        });

        let zlist = _.uniq(ldata);
        let sdata = [];
        let _sdata = [];
        let totalList = [];
        _.forEach(zlist, (item, i) => {
          _sdata[i] = [];
          _.forEach(data, (items, j) => {
            _sdata[i].length = data.length;
            _.forEach(items.value, itemss => {
              if (itemss.key === "总额") {
                totalList[j] = isBillion
                  ? itemss.sale.value / 10000
                  : itemss.sale.value;
              }
              if (item === itemss.key && item != "总额") {
                let svalue;
                if (itemss.value) {
                  svalue = itemss.value.sale.value;
                } else {
                  svalue = itemss.sale.value;
                }
                _sdata[i][j] = isBillion ? svalue / 10000 : svalue;
              }
            });
          });
        });
        _.forEach(zlist, (item, i) => {
          sdata.push({
            name: item,
            type: "bar",
            stack: "year",
            data: _sdata[i]
          });
        });
        let tbList = [];
        _.forEach(this.edata.data, (item, i) => {
          tbList[i] = item.tb;
        });

        // sdata = this.year ? totalsData : sdata

        sdata.push({
          type: "line",
          name: "同比（%）",
          yAxisIndex: 1,
          data: tbList,
          label: {
            show: true,
            position: "right",
            color: "#333",
            formatter: val => {
              return val.value + "%";
            }
          }
        });

        let obj = {
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: list => {
              let zeStr = "",
                str = "";
              zeStr =
                this.year || this.edata.select.model
                  ? ""
                  : `${this.totalN}：${this.echartsTooltipMoney(
                    totalList[list[0].dataIndex]
                  )}`;
              str = `${list[0].name == "undefined" ? "" : list[0].name}${this.year ? this.year : ""
                }&nbsp;&nbsp;&nbsp;&nbsp;${zeStr}<br/>`;

              _.forEach(list, item => {
                if (item.data && item.seriesName != "总额") {
                  if (
                    item.seriesName != "其他" &&
                    item.seriesName != "同比（%）"
                  ) {
                    str += `<span style='display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:${item.color
                      }'></span>${item.seriesName}：${this.echartsTooltipMoney(
                        item.data
                      )}<br/>`;
                  }
                }
              });
              _.forEach(list, item => {
                if (item.data) {
                  if (item.seriesName == "其他") {
                    str += `<span style='display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:${item.color
                      }'></span>${item.seriesName}：${this.echartsTooltipMoney(
                        item.data
                      )}<br/>`;
                  }
                }
              });
              _.forEach(list, item => {
                if (item.data) {
                  if (item.seriesName == "同比（%）") {
                    str += `<span style='display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:${item.color}'></span>${item.seriesName}：${item.data}<br/>`;
                  }
                }
              });
              return str;
            }
          },
          grid: {
            left: "10%",
            right: "12%",
            bottom: "8%",
            top: "10%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            show: true,
            axisLabel: {
              formatter: value => {
                value = this.year ? this.year : `${value}`;
                return value;
              }
            }
          },
          yAxis: [
            {
              type: "value",
              name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
              show: true,
              nameTextStyle: {
                padding: [0, 40, 0, 0]
              }
            },
            {
              type: "value",
              name: "同比（%）",
              show: true,
              nameTextStyle: {
                padding: [0, 0, 0, 40]
              },
              axisLabel: {
                formatter: value => {
                  return this.echartsUnitTransform(value);
                }
              }
            }
          ]
        };
        if (this.year) {
          obj.legend = {
            data: [
              {
                name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
                icon: "circle"
              },
              {
                name: "同比（%）"
              }
            ],
            bottom: 0
          };
          obj.yAxis[1].name = "同比（%）";
          let hbList = [];
          _.forEach(this.edata.data, (item, i) => {
            hbList[i] = item.hb;
          });
          sdata[0].label = {
            show: true,
            position: "top",
            color: "#333",
            formatter: val => {
              return this.echartsTooltipMoney(val.value);
            }
          };
        } else {
          let topList = [];
          _.forEach(this.edata.data, item => {
            topList.push(item.value);
          });
          sdata.push({
            name: this.tviewkey == 'sale' ? "总额" : "总量",
            type: "line",
            data: topList,
            color: "transparent",
            symbolSize: 1,
            yAxisIndex: 0,
            hoverAnimation: false,
            itemStyle: {
              color: "transparent",
              opacity: 1
            },
            label: {
              show: true,
              position: "insideBottom",
              color: "#333",
              formatter: val => {
                return this.echartsTooltipMoney(val.value);
              }
            }
          });
        }

        obj.xAxis.data = xdata;
        obj.series = sdata;
        this.edata.option = obj;
      }
    },
    //竖向柱状图
    drawBary(data, xkey, skey) {
      let unit = this.edata.unit;
      this.showTable = false;
      this.edata.curType = "bar";
      skey = skey || "sale";
      let xdata = [];
      let sdata = [];
      _.forEach(data, item => {
        xdata.push(item[xkey]);
        sdata.push(item[skey]);
      });

      let obj = {
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: params => {
            return (
              (this.tviewkey == 'sale' ?
                (params[0].name +
                  "<br/>" +
                  "销售额（" +
                  unit +
                  "元）: ") :
                (params[0].name +
                  "<br/>" +
                  "销售量（" +
                  unit +
                  "）: "))
              +
              this.echartsTooltipMoney(params[0].value)
            );
          }
        },
        grid: {
          containLabel: true,
          left: "10%",
          right: "12%",
          top: "7%",
          bottom: "2%"
        },
        yAxis: {
          show: true,
          name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
          nameTextStyle: {
            padding: [0, 40, 0, 0]
          },
          axisLabel: {
            formatter: value => {
              return this.echartsUnitTransform(value);
            }
          }
        },
        xAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: true,
            rotate: 55,
            interval: 0
          }
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "top",
              color: "#333",
              formatter: data => {
                return this.echartsTooltipMoney(data.value);
              }
            }
          }
        ]
      };
      obj.xAxis.data = xdata;
      obj.series[0].data = sdata;
      this.edata.option = obj;
    },
    //横向柱状图
    drawBarx(data, ykey, skey, ykey2) {
      let unit = this.edata.unit;
      this.showTable = false;
      this.edata.curType = "bar";
      skey = skey || "sale";
      let ydata = [];
      let sdata = [];
      let sdatatotal = 0;
      for (let j = data.length - 1; j >= 0; j--) {
        let item = data[j];
        if (ykey2) {
          ydata.push(`${item[ykey]}（${item[ykey2]}）`);
        } else {
          ydata.push(item[ykey]);
        }
        sdata.push(item[skey]);
      }
      // 药品分析-企业分析 横向柱状图计算百分比
      if (ykey === "guifanqiye") {
        sdata &&
          sdata.forEach(item => {
            sdatatotal += Number(item);
          });
      }
      let obj = {
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: params => {
            let text =
              (this.tviewkey == 'sale' ?
                (params[0].name +
                  "<br/>" +
                  "销售额（" +
                  unit +
                  "元）: ") :
                (params[0].name +
                  "<br/>" +
                  "销售量（" +
                  unit +
                  "）: "))
              +
              this.echartsTooltipMoney(params[0].value);
            if (ykey === "guifanqiye") {
              text +=
                "<br/>" +
                "百分比：" +
                ((params[0].value / sdatatotal) * 100).toFixed(2) +
                "%";
            }
            return text;
          }
        },
        grid: {
          containLabel: true,
          left: "10%",
          right: "12%",
          top: "4%",
          bottom: "2%"
        },
        yAxis: {
          type: "category",
          show: true,
          axisLabel: {
            formatter: function (value) {
              if (value.length > 12) {
                return value.substring(0, 12) + "...";
              } else {
                return value;
              }
            }
          }
        },
        xAxis: {
          type: "value",
          show: true,
          name: this.tviewkey == 'sale' ? `销售额（${unit}元）` : `销售量（${unit}）`,
          axisLabel: {
            rotate: 45,
            formatter: value => {
              return this.echartsUnitTransform(value);
            }
          }
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: data => {
                return this.echartsTooltipMoney(data.value);
              }
            }
          }
        ]
      };
      obj.yAxis.data = ydata;
      obj.series[0].data = sdata;
      this.edata.option = obj;
    },
    //饼图
    drawPie(data, xkey, skey) {
      let unit = this.edata.unit;
      this.showTable = false;
      this.edata.curType = "pie";
      skey = skey || "sale";
      let sdata = [];
      _.forEach(data, item => {
        sdata.push({
          name: `${item[xkey]}${this.edata.nameValue || ""}`,
          value: item[skey]
        });
      });
      let obj = {
        tooltip: {
          show: true,
          trigger: "item",
          formatter: params => {
            return (
              (this.tviewkey == 'sale' ?
                (params.name +
                  "<br/>" +
                  "销售额（" +
                  unit +
                  "元）: ") :
                (params.name +
                  "<br/>" +
                  "销售量（" +
                  unit +
                  "）: "))
              +
              this.echartsTooltipMoney(params.value)
            );
          }
        },
        yAxis: {
          show: false
        },
        xAxis: {
          show: false
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "55%"],
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%",
                color: "#606266"
              }
            }
          }
        ]
      };

      obj.series[0].data = sdata;
      this.edata.option = obj;
    },
    //切换成表格
    drawTable(type) {
      this.edata.curType = type;
    },
    echartsResizeHandler() {
      this.width = window.innerWidth - 340;
      this.echartsResize("echart");
    }
  },
  mounted() {
    window.addEventListener("resize", this.echartsResizeHandler);
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";

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

.echarts {
  width: 100%;
  margin: auto;
  height: 400px;
}

.echarts-title {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  position: relative;

  .change-wrap {
    position: absolute;
    top: 0;
    right: 50px;
    font-size: 14px;

    .iconfont {
      font-size: 18px;
    }

    span {
      cursor: pointer;
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 3px;
    }

    img {
      display: block;
      width: 100%;
    }
  }
}

.echart-table-wrap {
  width: 80%;
  margin: auto;
}

.echart-table {
  margin-top: 10px;
  border: 1px solid #ebeef5;
  border-bottom: none;
}

.export-table {
  text-align: right;

  span {
    cursor: pointer;
    color: @PrimaryColor;
  }

  .iconfont {
    display: inline-block;
    vertical-align: middle;
  }
}

.item-loading {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 99;
}

/deep/.el-input__inner,
/deep/.el-select,
/deep/.el-select__tags {
  height: 40px !important;
  line-height: 40px !important;
}

/deep/.el-select__tags {
  max-width: unset !important;
}
</style>
