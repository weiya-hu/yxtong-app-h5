<template>
  <div class="page-wrap">
    <!-- 顶部搜索 -->
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="top">
      <CascaderSelect v-if="atcSel.options.length > 0" class="item-sel" :placeholder="atcSel.placeholder"
        :option="atcSel.options" @updateValue="atcSelChange" />
      <Select v-model="categSel.model" clearable :placeholder="categSel.placeholder" autoWidth>
        <el-option v-for="item in categSel.options" :key="item" :label="item" :value="item" />
      </Select>
      <Select v-model="yearSel.model" clearable :placeholder="yearSel.placeholder" autoWidth>
        <el-option label="全部年份" value=""></el-option>
        <el-option v-for="item in yearSel.options" :key="item" :label="item" :value="item" />
      </Select>
      <el-select v-model="tview" @change="init">
        <el-option value="1" label="销售额">销售额</el-option>
        <el-option value="2" label="销售量">销售量</el-option>
      </el-select>
      <el-button class="top-btn" type="primary" size="mini" round @click="clickBtn">搜索</el-button>
    </div>
    <!-- 数量统计 -->
    <Total style="margin-top: 10px" :list="totalList" :totalObj="totalObj"
      :tviewkey="tview == '1' ? 'sale' : 'amount'" />
    <!-- 图表项 -->
    <div class="echarts-wrap">
      <div v-for="(item, i) in eList" :key="i">
        <EchartsItemMagnify ref="echartsItem" :item="item" :index="i" :year="clickYear" :nopmState="nopmState"
          :atc="atcSel.model" :categ="categSel.model" :tviewkey="tview == '1' ? 'sale' : 'amount'" :nowNav="nowNav"
          @drawBarLine="
            (i) =>
              drawBarLine(
                eList[i].data,
                eList[i].lastData,
                'quarter',
                'sale',
                i,
                false,
                true,
                eList[i].data
              )
          " @changeEcharts="changeEcharts" />
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import EchartsItemMagnify from "./components/echartsItemMagnify.vue";
import CascaderSelect from "@/components/inputs/cascader-select";
import Select from "@/components/inputs/select";
import Total from "./components/total.vue";
import { mapState } from "vuex";
export default {
  props: {
    nowNav: {
      type: String
    },
    nopmState: {
      type: Boolean,
    },
  },
  components: {
    LoadingGif,
    EchartsItemMagnify,
    CascaderSelect,
    Select,
    Total,
  },
  data() {
    return {
      clickYear: "",
      isloading: true,
      atcSel: {
        model: "",
        placeholder: "ATC分类",
        options: [],
      },
      categSel: {
        model: "",
        placeholder: "药品分类",
        options: [],
      },
      yearSel: {
        model: "",
        placeholder: "时间",
        options: [],
      },
      tview: "1",
      guifanqiye: "",
      titleAtc: "",
      totalList: [],
      totalObj: {
        guifanqiye: {
          val: "生产企业",
          unit: "个",
        },
        zwylbm: {
          val: "活性成分",
          unit: "种",
        },
        guifanname: {
          val: "品种",
          unit: "个",
        },
        jixing2: {
          val: "剂型",
          unit: "个",
        },
        year: {
          val: "总销售额",
          unit: "万元",
        },
        tb: {
          val: "销售同比",
          unit: "%",
        },
      },
      echartList: [
        {
          name: "销售趋势",
          url: "dlflxsqsoutdata",
          type: ["bar", "table"],
          curType: "bar",
          title: "",
          option: {},
          show: true,
          nameKey: "quarter",
          nameValue: "季度",
          tableHead: [
            { prop: "quarter", label: "年份" },
            { prop: "sale", label: "销售额（万元）" },
            { prop: "tb", label: "同比（%）" },
          ],
          unit: "万",
        },
        {
          name: "剂型分析",
          url: "dlfljxfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "state",
          option: {},
          show: true,
          tableHead: [
            { prop: "state", label: "剂型" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
        {
          name: "活性成分分析",
          url: "dlflhxcf",
          type: ["bar", "pie", "table"],
          title: "",
          nameKey: "state",
          curType: "bar",
          barType: "x",
          option: {},
          show: true,
          tableHead: [
            { prop: "state", label: "活性成分" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
        {
          name: "品种分析",
          url: "dlflpzfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "state",
          option: {},
          show: true,
          tableHead: [
            { prop: "state", label: "品种" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
        {
          name: "企业分析",
          url: "dlflqyfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "state",
          option: {},
          show: true,
          tableHead: [
            { prop: "state", label: "企业" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
        {
          name: "品牌分析",
          url: "dlflppfx",
          type: ["bar", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "name",
          nameKey2: "guifanqiye",
          option: {},
          show: true,
          tableHead: [
            { prop: "name", label: "品牌" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          tableFormat: true, // 表格品牌列 展示方式： 品牌（公司）
          unit: "万",
        },
        {
          name: "ATC分类分析",
          url: "dlflylfl",
          type: ["pie"],
          curType: "pie",
          title: "",
          barType: "x",
          nameKey: "key",
          sKey: "doc_count",
          show: true,
          option: {},
          unit: "万",
        },
        // , {
        //   name: '省份分析',
        //   type: ['bar', 'table'],
        //   curType: 'bar',
        //   title: '',
        //   barType: 'y',
        //   nameKey: 'key',
        //   sKey: 'value',
        //   option: {},
        //   show: true,
        //   tableHead: [{ prop: "key", label: '省份' }, { prop: "value", label: '销售额（万元）' }],
        //   unit: '万',
        // }
      ],
      lastData: [],
      titleList: [
        "销售额时间分析（年统计）",
        "年销售额剂型分析（TOP10）",
        "年销售额活性成分（TOP10）",
        "销售额品种分析（TOP10）",
        "销售额企业分析（TOP10）",
        "销售额品牌分析（TOP10）",
        "销售额品种分析（TOP10）",
        // , '销售额省份分析（TOP10）'
      ],
      xsysData: {},
    };
  },
  computed: {
    ...mapState({
      isFangDa: (state) => state.UserCenter.isFangDa,
    }),
    yearModel() {
      return this.yearSel.model;
    },
    eList() {
      let t = _.clone(this.echartList);
      t[0].name = this.tview == 1 ? "销售额趋势" : "销售量趋势";
      return t;
    },
  },
  watch: {
    clickYear(val) {
      this.echartList[0].tableHead = [
        { prop: "quarter", label: "年份" },
        { prop: "sale", label: "销售额（万元）" },
        { prop: "tb", label: "同比（%）" },
      ];
      if (val) {
        this.echartList[0].tableHead[3] = { prop: "hb", label: "环比（%）" };
      }
      this.echartList[0].tableHead[0].label = val ? "季度" : "年份";
      this.titleList[0] = val
        ? "销售额时间分析（季度统计）"
        : "销售额时间分析（年统计）";
      this.getTitle();
    },
  },
  methods: {
    //切换图标类型
    changeEcharts(type, index) {
      let eobj = this.echartList[index];
      let comdata = this.xsysData;
      if (type === "bar") {
        if (eobj.name == "销售额趋势" || eobj.name == "销售量趋势") {
          this.drawBarLine(
            comdata.list,
            comdata.last,
            "quarter",
            "sale",
            index,
            eobj.isBillion,
            true,
            eobj.data
          );
        } else {
          this.$refs.echartsItem[index]["drawBar" + eobj.barType](
            eobj.data,
            eobj.nameKey,
            eobj.sKey,
            eobj.nameKey2
          );
        }
      }
      if (type === "pie") {
        this.$refs.echartsItem[index].drawPie(
          eobj.data,
          eobj.nameKey,
          eobj.sKey
        );
      }
    },
    //获取搜索条件
    getSearch() {
      this.isloading = true;
      Store.dispatch("Yyxs/getApi", {
        url: "dlflsearch",
        params: { is_magnify: 1, type_view: this.tview || null },
      }).then((res) => {
        this.isloading = false;
        let searchData = this.getData(res);
        this.searchData = searchData;
        this.atcSel.options = searchData.atc;
        this.categSel.options = searchData.categ;
        this.yearSel.options = searchData.year;
        this.getTitle();
      });
    },

    init() {
      _.forEach(this.echartList, (item) => {
        item.eloading = true;
      });
      //公共参数
      let commonParam = {
        atc: this.atcSel.model || null,
        categ: this.categSel.model || null,
        year: this.yearSel.model || null,
        platform: "app-dev",
        type_view: this.tview || null,
      };
      // 处于放大测试版
      if (this.getUrlParam("type_id") == 2) {
        commonParam.is_magnify = 1;
      }
      //图表调用的api
      let apiUrlList = [
        {
          url: "dlflxsqs",
          params: this.keywordStatistics(commonParam, {
            atc: "ATC分类",
            categ: "药品分类",
            year: "年份",
            type_view: this.tview || null,
          }),
        }, //销售趋势
        { url: "dlfljxfx", params: commonParam }, //剂型分析
        { url: "dlflhxcf", params: commonParam }, //活性成分
        { url: "dlflpzfx", params: commonParam }, //品种分析
        { url: "dlflqyfx", params: commonParam }, //企业分析
        { url: "dlflppfx", params: commonParam }, //品牌分析
        { url: "dlflylfl", params: commonParam }, //药理分析
        // { url: 'dlfldqfx', params: commonParam }, //省份分析
      ];
      let apiList = [];
      Store.dispatch("Yyxs/getApi", { url: "dlfltj", params: commonParam })
        .then((res) => {
          this.isloading = false;
          this.totalList = [];
          let total = this.getData(res);
          if (total) {
            _.forEach(this.totalObj, (item, key) => {
              let value = _.cloneDeep(total.list[key]);
              let sort = 0;
              switch (key) {
                case "guifanqiye":
                  sort = 1;
                  break;
                case "zwylbm":
                  sort = 2;
                  break;
                case "guifanname":
                  sort = 3;
                  break;
                case "jixing2":
                  sort = 4;
                  break;
                case "year":
                  sort = 5;
                  if (value && value.value) {
                    if (parseFloat(value.value) >= 100000000) {
                      value.value = parseFloat(value.value / 100000000).toFixed(
                        2
                      );
                      this.totalObj["sale"].unit = "亿元";
                    } else {
                      value.value = parseFloat(value.value / 10000).toFixed(2);
                      this.totalObj["sale"].unit = "万元";
                    }
                    value["year"] = this.yearSel.options[0];
                  }
                  break;
                case "tb":
                  sort = 6;
                  break;
              }
              this.totalList.push({ key: key, value, sort });
            });
            this.totalList = _.orderBy(this.totalList, ["sort"], ["asc"]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
      //渲染图表
      _.forEach(apiUrlList, (item, i) => {
        Store.dispatch("Yyxs/getApi", {
          url: item.url,
          params: item.params,
        }).then((res) => {
          let comdata = this.getData(res);
          let eitem = this.echartList[i];
          let isBillion =
            i === 0
              ? this.$refs.echartsItem[i].isBillion(comdata.list, eitem.sKey)
              : this.$refs.echartsItem[i].isBillion(comdata, eitem.sKey);

          eitem.unit = isBillion ? "亿" : "万";
          eitem.isBillion = isBillion;
          if (eitem.tableHead) {
            eitem.tableHead[1].label = isBillion
              ? "销售额（亿元）"
              : "销售额（万元）";
          }
          if (i === 0) {
            this.xsysData = this.getData(res);
            let comdata = JSON.parse(JSON.stringify(this.xsysData));
            let xslist = _.map(comdata.list, "sale");
            let rxliat = this.rateFn(xslist);
            let lastData = comdata.last;
            let HbList =
              this.yearModel && lastData.length > 0
                ? this.getHbList(xslist, lastData)
                : [];
            _.forEach(comdata.list, (item, i) => {
              if (this.yearModel && lastData.length > 0) {
                _.forEach(lastData, (items, is) => {
                  comdata.list[is].tb = Number(
                    ((Number(comdata.list[is].sale) - Number(items.sale)) /
                      Number(items.sale)) *
                    100
                  ).toFixed(2);
                });
                item.hb = HbList[i];
              } else {
                item.tb = rxliat[i];
              }
            });
            eitem.curType = "bar";
            eitem.type = this.yearModel
              ? ["bar", "pie", "table"]
              : ["bar", "table"];
            eitem.data = this.$refs.echartsItem[i].unitChange(
              comdata.list,
              eitem.sKey
            );
            eitem.lastData = comdata.last;
            this.drawBarLine(
              this.xsysData.list,
              this.xsysData.last,
              "quarter",
              "sale",
              0,
              isBillion,
              true,
              eitem.data
            );
          } else if (i === this.echartList.length - 1) {
            comdata = this.$refs.echartsItem[i].unitChange(comdata, eitem.sKey);
            this.$refs.echartsItem[i].drawPie(
              comdata,
              eitem.nameKey,
              eitem.sKey
            );
          } else {
            eitem.data = this.$refs.echartsItem[i].unitChange(
              comdata,
              eitem.sKey
            );
            this.$refs.echartsItem[i]["drawBar" + eitem.barType](
              comdata,
              eitem.nameKey,
              eitem.sKey,
              eitem.nameKey2
            );
          }
          eitem.eloading = false;
        });
      });
    },
    atcSelChange(i, val, modelList) {
      if (val) {
        let list = this.atcSel.options;
        let obj;
        _.forEach(modelList, (item, i) => {
          let _list = i === 0 ? list : obj.children;
          obj = _.find(_list, (item) => {
            return item.value === modelList[i];
          });
        });
        this.titleAtc = obj.label;
        this.atcSel.model = val;
      } else {
        this.titleAtc = "";
        this.atcSel.model = "";
      }
    },
    //获取环比数据
    getHbList(list, lastData) {
      let hbArr = [];
      let hbdata = [];
      let laArr = [];
      let tdata = this.rateFn(list);
      _.forEach(lastData, (item) => {
        if (item.quarter === 4) {
          laArr = [item.sale];
        }
      });
      if (laArr.length > 0) {
        hbArr = _.concat(laArr, list);
        let rateArr = this.rateFn(hbArr);
        hbdata = rateArr.slice(1, rateArr.length);
      } else {
        hbdata = tdata;
      }
      return hbdata;
    },
    //计算同/环比
    rateFn(list) {
      let elist = [];
      _.forEach(list, (item, i) => {
        if (i !== 0) {
          let tb = Number(((item - list[i - 1]) / list[i - 1]) * 100).toFixed(
            2
          );
          elist.push(tb);
        } else {
          elist.push(null);
        }
      });
      return elist;
    },
    //柱状折线图
    drawBarLine(
      data,
      lastData,
      xkey,
      skey,
      i,
      isBillion,
      is_magnify = false,
      sourceData
    ) {
      if (is_magnify) {
        let unit = isBillion ? "亿" : "万";
        let xdata = [];
        let xsdata = [];
        let hbxsdata = [];
        let _data = JSON.parse(JSON.stringify(data));
        _data = this.$refs.echartsItem[i].unitChange(_data);
        _.forEach(_data, (item, i) => {
          xdata.push(item[xkey]);
          xsdata.push(item[skey]);
          hbxsdata.push(data[i][skey]);
        });
        let tdata = this.rateFn(xsdata);

        let sdata = [
          {
            type: "bar",
            name: this.tview == 1 ? `销售额（${unit}元）` : `销售量（${unit}）`,
            data: xsdata,
            label: {
              show: true,
              position: "top",
              color: "#333",
              formatter: (data) => {
                return this.echartsTooltipMoney(data.value);
              },
            },
          },
          {
            type: "line",
            name: "同比（%）",
            yAxisIndex: 1,
            data: tdata,
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: (val) => {
                return val.value + "%";
              },
            },
          },
        ];
        let obj = {
          tooltip: {
            show: true,
            trigger: "axis",
            formatter: (list) => {
              let str = `${list[0].name}${this.yearModel ? "季度" : ""}<br/>`;
              _.forEach(list, (item) => {
                if (item.data) {
                  str += `${item.seriesName}：${this.echartsTooltipMoney(
                    item.data
                  )}<br/>`;
                }
              });
              return str;
            },
          },
          legend: {
            data: [
              {
                name: this.tview == 1 ? `销售额（${unit}元）` : `销售量（${unit}）`,
                icon: "circle",
              },
              {
                name: "同比（%）",
              },
            ],
            bottom: 0,
          },
          grid: {
            containLabel: true,
            left: "10%",
            right: "12%",
            top: "10%",
            bottom: "8%",
          },
          yAxis: [
            {
              type: "value",
              name: this.tview == 1 ? `销售额（${unit}元）` : `销售量（${unit}）`,
              nameTextStyle: {
                padding: [0, 40, 0, 0],
              },
              axisLabel: {
                formatter: (value) => {
                  return this.echartsUnitTransform(value);
                },
              },
            },
            {
              type: "value",
              name: "同比（%）",
              nameTextStyle: {
                padding: [0, 0, 0, 40],
              },
              axisLabel: {
                formatter: (value) => {
                  return this.echartsUnitTransform(value);
                },
              },
            },
          ],
          xAxis: {
            type: "category",
            show: true,
            axisLabel: {
              formatter: (value) => {
                value = this.yearModel ? `${value}季度` : value;
                return value;
              },
            },
          },
        };
        if (this.yearModel) {
          let tbdata = [];
          let hbdata = [];
          let laArr = [];
          let hbArr = [];
          obj.yAxis[1].name = "同/环比（%）";
          obj.legend.data.push({ name: "环比（%）" });
          sdata[1].name = "同比（%）";
          if (lastData.length > 0) {
            _.forEach(data, (item, i) => {
              if (item.sale && lastData[i]) {
                tbdata[i] = Number(
                  ((item.sale - lastData[i].sale) / lastData[i].sale) * 100
                ).toFixed(2);
              }
            });
            sdata[1].data = tbdata;
          }
          hbdata = this.getHbList(hbxsdata, lastData);
          sdata.push({
            type: "line",
            name: "环比（%）",
            yAxisIndex: 1,
            data: hbdata,
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: (val) => {
                return val.value + "%";
              },
            },
          });
        }
        obj.xAxis.data = xdata;
        let tbArr = [],
          hbArr = [];
        sourceData.forEach((item) => {
          tbArr.push(item.tb);
        });
        sourceData.forEach((item) => {
          hbArr.push(item.hb);
        });

        sdata.forEach((item) => {
          if (item.name.includes("环比")) {
            item.data = hbArr;
          }
          if (item.name.includes("同比")) {
            item.data = tbArr;
          }
        });
        obj.series = sdata;
        this.echartList[i].option = obj;
      } else {
        let unit = isBillion ? "亿" : "万";
        let xdata = [];
        let xsdata = [];
        let hbxsdata = [];
        let _data = JSON.parse(JSON.stringify(data));
        _data = this.$refs.echartsItem[i].unitChange(_data);
        _.forEach(_data, (item, i) => {
          xdata.push(item[xkey]);
          xsdata.push(item[skey]);
          hbxsdata.push(data[i][skey]);
        });
        let tdata = this.rateFn(xsdata);

        let sdata = [
          {
            type: "bar",
            name: this.tview == 1 ? `销售额（${unit}元）` : `销售量（${unit}）`,
            data: xsdata,
            label: {
              show: true,
              position: "top",
              color: "#333",
              formatter: (data) => {
                return this.echartsTooltipMoney(data.value);
              },
            },
          },
          {
            type: "line",
            name: "同比（%）",
            yAxisIndex: 1,
            data: tdata,
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: (val) => {
                return val.value + "%";
              },
            },
          },
        ];
        let obj = {
          tooltip: {
            show: true,
            trigger: "axis",
            formatter: (list) => {
              let str = `${list[0].name}<br/>`;
              _.forEach(list, (item) => {
                if (item.data) {
                  str += `${item.seriesName}：${this.echartsTooltipMoney(
                    item.data
                  )}<br/>`;
                }
              });
              return str;
            },
          },
          legend: {
            data: [
              {
                name: this.tview == 1 ? `销售额（${unit}元）` : `销售量（${unit}）`,
                icon: "circle",
              },
              {
                name: "同比（%）",
              },
            ],
            bottom: 0,
          },
          grid: {
            containLabel: true,
            left: "10%",
            right: "12%",
            top: "10%",
            bottom: "8%",
          },
          yAxis: [
            {
              type: "value",
              name: this.tview == 1 ? `销售额（${unit}元）` : `销售量（${unit}）`,
              nameTextStyle: {
                padding: [0, 40, 0, 0],
              },
              axisLabel: {
                formatter: (value) => {
                  return this.echartsUnitTransform(value);
                },
              },
            },
            {
              type: "value",
              name: "同比（%）",
              nameTextStyle: {
                padding: [0, 0, 0, 40],
              },
              axisLabel: {
                formatter: (value) => {
                  return this.echartsUnitTransform(value);
                },
              },
            },
          ],
          xAxis: {
            type: "category",
            show: true,
            axisLabel: {
              formatter: (value) => {
                value = this.yearModel ? this.yearModel : `${value}`;
                return value;
              },
            },
          },
        };
        if (this.yearModel) {
          let tbdata = [];
          let hbdata = [];
          let laArr = [];
          let hbArr = [];
          obj.yAxis[1].name = "同比（%）";
          sdata[1].name = "同比（%）";
          if (lastData.length > 0) {
            _.forEach(data, (item, i) => {
              if (item.sale && lastData[i]) {
                tbdata[i] = Number(
                  ((item.sale - lastData[i].sale) / lastData[i].sale) * 100
                ).toFixed(2);
              }
            });
            sdata[1].data = tbdata;
          }
          hbdata = this.getHbList(hbxsdata, lastData);
        }
        obj.xAxis.data = xdata;
        obj.series = sdata;
        this.echartList[i].option = obj;
      }
    },
    //处理返回数据
    getData(res) {
      if (!res) {
        return false;
      }
      if (res.data.code === 200 && res.data) {
        let data = res.data.data;
        if (this.tview == 2) {
          data = this.getAmountData(data);
        }
        return data;
      } else {
        return false;
      }
    },
    // 处理销售量的返回数据 （接口字段不统一）
    getAmountData(data) {
      return JSON.parse(JSON.stringify(data).replace(/amount/gi, "sale"));
    },
    //渲染标题
    getTitle() {
      let titleAtc = this.titleAtc;
      let titleCat = this.categSel.model;
      let titleYear = this.yearSel.model;
      let yearData = this.searchData.year;
      let yearStr =
        titleYear ||
        (yearData.length > 1
          ? `${yearData[yearData.length - 1]}-${yearData[0]}`
          : `${yearData[0]}`);
      let catStr = titleCat ? `${titleCat}-` : "";
      let totalText = catStr || titleAtc ? "" : "总体-";
      let atcStr = titleAtc ? `${titleAtc}-` : "";
      _.forEach(this.titleList, (item, i) => {
        this.echartList[
          i
        ].title = `${yearStr}年-${catStr}${totalText}${atcStr}${item}`;
      });
    },
    //搜索
    clickBtn() {
      this.getTitle();
      this.clickYear = this.yearModel ? this.yearModel.toString() : "";
      this.init();
    },
  },
  mounted() {
    this.getSearch();
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";

.page-wrap {
  background: #fff;
  box-shadow: 0 0 5px #c4d3f8;
  overflow: hidden;
  padding-bottom: 90px;
}

.top {
  margin: 20px 0 0 20px;
  clear: both;
  overflow: hidden;

  .item-sel {
    margin-right: 10px;
    float: left;
    line-height: 30px;
    width: auto;
  }
}

.top-btn {
  border-radius: 4px !important;
}

/deep/.el-select-dropdown__item {
  width: 300px;
  display: block;
}
</style>
