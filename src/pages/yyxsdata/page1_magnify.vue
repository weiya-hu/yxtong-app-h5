<template>
  <div class="page-wrap">
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="el-input-icon-lineHeight30 top">
      <div class="item-sel inp-group">
        <i v-show="iconShow" class="el-icon-search"></i>
        <el-select id="nameSel" @click.native="nameSelChange" @change="changeName" @clear="clearSelFn"
          @blur="() => (iconShow = true)" @focus="() => (iconShow = false)" v-model="nameSel.model" filterable remote
          clearable popper-class="inp-group-pop" :placeholder="nameSel.placeholder" :remote-method="remoteMethod"
          :loading="nameSel.loading" ref="popoverSelect">
          <el-option-group v-for="group in nameSel.options" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.value" :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </div>

      <Select v-model="yearSel.model" :loading="yearSel.loading" :placeholder="yearSel.placeholder" @change="init"
        autoWidth>
        <el-option label="全部年份" value=""></el-option>
        <el-option v-for="item in yearSel.options" :key="item" :label="item" :value="item" />
      </Select>
      <el-select v-model="tview" @change="xslChange()">
        <el-option value="1" label="销售额">销售额</el-option>
        <el-option value="2" label="销售量">销售量</el-option>
      </el-select>
      <el-button v-if="nopmState" class="top-btn" :class="{
        'abandon-click-method nopms-btn': nopms.yyxsfxxtoutdata,
      }" type="primary" size="mini" round @click="clickBtn"><i class="iconfont download-icon">&#xe62c;</i>下载数据
      </el-button>
    </div>
    <!-- 名称 -->
    <div class="head">
      <div class="yyxs-title">
        {{ nameModel }}
      </div>
    </div>
    <!-- 筛选项type=1显示 -->
    <div class="screen" v-if="stype == 1">
      <div class="yyxs-title">请选择具体品种：</div>
      <ul>
        <!-- <li @click="pzClick(nameModel)" :class="{ active: screenModel === nameModel }">
          全部
        </li> -->
        <li style="position: relative">
          <el-checkbox-group :style="{
            display: 'flex',
            'flex-wrap': 'wrap',
            'max-height': toggleStatus ? '40px' : 'unset',
            overflow: 'hidden',
          }" ref="checkboxGroup" v-model="checkList" @change="checkListChange">
            <el-checkbox :style="{ 'margin-right': screenList.length > 1 ? '30px' : '0' }"
              v-for="(item, i) in screenList" :key="i" :label="item">{{ item }}</el-checkbox>
          </el-checkbox-group>
        </li>
        <li>
          <el-button type="primary" size="mini" @click="searchHandler">筛选</el-button>
          <span v-if="showMore" class="more-btn" @click="showMoreHandler">
            <span>更多</span>
            <i class="icon el-icon-d-arrow-right"></i>
          </span>
        </li>
      </ul>
    </div>
    <!-- 数量统计 -->
    <Total v-if="totalList.length > 0" :tviewkey="tview == '1' ? 'sale' : 'amount'" :list="totalList"
      :totalObj="totalObj" />
    <!-- 图表项 -->
    <div class="echarts-wrap">
      <div v-for="(item, i) in eList" :key="i">
        <EchartsItemMagnify ref="echartsItem" :nopmState="nopmState" v-show="item.show" :item="item" :index="i"
          :tviewkey="tview == '1' ? 'sale' : 'amount'" queryName="namestr" :year="yearModel"
          :name="screenModel || nameModel" :type="nameSel.type" :nowNav="nowNav"
          :namestr="checkList.join('、') || nameModel || screenModel" :qyTitle="qyTitle" :multiple="item.multiple"
          :zwylbm="nameSel.model" @selChange="selChange" @changeEcharts="changeEcharts"
          @changeLoading="(type) => (isloading = type)" />
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import Total from "./components/total.vue";
import EchartsItemMagnify from "./components/echartsItemMagnify.vue";
import Select from "@/components/inputs/select";
import { mapState } from "vuex";
import Axios from "axios";

export default {
  props: {
    nowNav: {
      type: String
    },
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
    Total,
    EchartsItemMagnify,
    Select
  },
  data() {
    return {
      toggleStatus: false,
      showMore: true,
      qyTitle: "",
      iconShow: true,
      isloading: true,
      screenModel: this.ypname || "阿普唑仑",
      inputIcon: "el-icon-search",
      nameModel: this.ypname || "阿普唑仑",
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
      tview: "1", // 1 sale 2 amount
      guifanqiye: [],
      stype: this.type || 1,
      checkList: [],
      screenList: [],
      totalList: [],
      totalObj: {
        guifanqiye: {
          val: "生产企业",
          unit: "个"
        },
        year: {
          val: "总销售额",
          unit: "万元"
        },
        tb: {
          val: "销售同比",
          unit: "%"
        }
      },
      echartList: [
        {
          name: "销售趋势",
          url: "dlypxsqsoutdata",
          multiple: true,
          type: ["Line", "table"],
          curType: "Line",
          title: "",
          option: {},
          async: true,
          show: true,
          nameKey: "key",
          sKey: "value",
          nameValue: "季度",
          tableHead: [
            { prop: "key", label: "年份" },
            { prop: "value", label: "销售额（万元）" },
            { prop: "tb", label: "同比（%）" }
          ],
          select: {
            model: "",
            placeholder: "请选择或输入企业名称",
            option: []
          },
          unit: "万"
        },
        {
          name: "企业分析",
          url: "dlypqyfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "guifanqiye",
          option: {},
          show: true,
          tableHead: [
            { prop: "guifanqiye", label: "企业名称" },
            { prop: "sale", label: "销售额（万元）" }
          ],
          unit: "万"
        },
        {
          name: "剂型分析",
          url: "dlypjxfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "jixing2",
          option: {},
          show: true,
          tableHead: [
            { prop: "jixing2", label: "剂型" },
            { prop: "sale", label: "销售额（万元）" }
          ],
          unit: "万"
        },
        {
          name: "品种分析",
          url: "dlyppzfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "guifanname",
          option: {},
          show:
            (this.ypname && this.$route.query.subType == 1) ||
              this.$route.query.subType != undefined
              ? true
              : false,
          tableHead: [
            { prop: "guifanname", label: "品种" },
            { prop: "sale", label: "销售额（万元）" }
          ],
          unit: "万"
        },
        {
          name: "规格分析",
          url: "dlypggfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "y",
          nameKey: "guifanguige",
          option: {},
          show: this.ypname && !this.$route.query.subType ? true : false,
          tableHead: [
            { prop: "guifanguige", label: "规格" },
            { prop: "sale", label: "销售额（万元）" }
          ],
          unit: "万"
        }
      ],
      titleList: [
        "销售额时间分析（年统计）",
        "销售额企业占比分析",
        "销售额剂型分析（TOP10）",
        "销售额品种分析（TOP10）",
        "销售额规格分析（TOP10）"
        // , '销售额省份分析（TOP10）'
      ],
      titleYearStr: "",
      apiDlypinputList: [],
      clearSel: false
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Yyxs.nopms,
      isFangDa: state => state.UserCenter.isFangDa
    }),
    yearModel() {
      return this.yearSel.model.toString();
    },
    eList() {
      let t = _.clone(this.echartList);
      t[0].name = this.tview == 1 ? '销售额趋势' : '销售量趋势'
      return t;
    }
  },
  watch: {
    screenList(newVal) {
      this.$nextTick(() => {
        let checkBoxHeight = $(".el-checkbox-group").height();
        if (checkBoxHeight >= 40) {
          this.showMore = true;
          this.toggleStatus = true;
        } else {
          this.showMore = false;
          this.toggleStatus = false;
        }
      })
    },
    ypname(val) {
      this.nameModel = val || "阿普唑仑";
      this.nameSel.model = val || "阿普唑仑";
      this.init();
    },
    yearModel(val) {
      this.echartList[0].tableHead = [
        { prop: "key", label: "年份" },
        { prop: "value", label: "销售额（" + (this.tview == 1 ? "万元" : "万") + "）" },
        { prop: "tb", label: "同比（%）" }
      ];
      if (val) {
        this.echartList[0].tableHead[3] = { prop: "hb", label: "环比（%）" };
      }
      this.echartList[0].tableHead[0].label = val ? "季度" : "年份";
      // this.echartList[0].tableHead[0].label = "年份";
      this.titleList[0] = val
        ? `销售额时间分析（季度统计）`
        : "销售额时间分析（年统计）";
      this.getTitle();
    },
    nameModel(val) {
      this.screenModel = val;
    },
    "nameSel.type"(val) {
      this.echartList[4].show = val == 2;
    }
  },
  methods: {
    showMoreHandler() {
      if ($(".more-btn span").text() == "更多") {
        this.toggleStatus = false;
        $(".more-btn span").text('收起')
        $(".more-btn i").css('transform', 'rotate(-90deg)')
      } else {
        this.toggleStatus = true;
        $(".more-btn span").text('更多')
        $(".more-btn i").css('transform', 'rotate(90deg)')
      }
    },
    searchHandler() {
      console.log(this.checkList);
      this.nameSel.type = this.checkList.length > 0 ? 2 : 1;
      // this.screenModel = val;
      // this.echartList[2].show = val != this.nameModel;
      this.echartList[3].show = this.checkList === this.nameModel;
      this.init();
      this.getTitle();
    },
    checkListChange(val) {
      this.checkList = val;
    },
    xslChange() {
      this.guifanqiye = [];
      this.qyTitle = '';
      this.getTitle();
      this.init()
    },
    //切换图标类型
    changeEcharts(type, index) {
      let eobj = this.echartList[index];
      if (type === "bar") {
        // 企业分析修改标题
        if (index === 1) {
          this.titleList[index] = "销售额企业占比分析";
          this.getTitle();
        }
        if (eobj.name == "销售额趋势" || eobj.name == "销售量趋势") {
          this.$refs.echartsItem[index].drawBarLine(
            eobj.edata,
            eobj.isBillion,
            true
          );
        } else {

          this.$refs.echartsItem[index]["drawBar" + eobj.barType](
            eobj.data,
            eobj.nameKey,
            "sale"
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
    //获取年份
    getYearData() {
      Store.dispatch("Yyxs/getApi", {
        url: "dlypnflist",
        params: { namestr: this.nameModel, is_magnify: 1 }
      }).then(res => {
        let yearData = this.getData(res);
        this.yearSel.options = yearData;
        this.yearData = yearData;
        this.getTitle();
      });
    },
    //渲染标题
    getTitle() {
      let yearData = this.yearData;
      if (yearData) {
        this.titleYearStr =
          this.yearSel.model ||
          (yearData.length > 1
            ? `${yearData[yearData.length - 1]}-${yearData[0]}`
            : `${yearData[0]}`);
      }

      let namestr = '';
      namestr = this.checkList.join("、") || this.nameModel
      _.forEach(this.titleList, (item, i) => {
        if (i == 0) {
          this.echartList[i].title = `${this.titleYearStr}年-${namestr}${this.guifanqiye.length > 0 ? `-${this.guifanqiye.join(',')}` : ""}${item}`;
        } else {
          this.echartList[i].title = `${this.titleYearStr}年-${namestr}${item}`;
        }
      });
    },

    init() {
      _.forEach(this.echartList, item => {
        item.eloading = true;
      });
      this.echartList[0].select.model = "";
      this.guifanqiye = [];
      let namestr = '';
      namestr = this.checkList.join("、") || this.nameModel
      //公共参数
      let commonParam = {
        namestr,
        year: this.yearSel.model || null,
        type: this.nameSel.type || null,
        type_view: this.tview || null,
      };
      //初始化调用的api
      let apiUrlList = [
        { url: "dljtpz", params: { namestr: this.nameModel || null } }, //具体品种
        { url: "dlyptj", params: commonParam } //总计
      ];
      let guifanqiye = "";
      if (this.guifanqiye.length > 0) {
        guifanqiye = this.guifanqiye.join(",");
      }
      let params = {
        namestr,
        year: this.yearSel.model || null,
        type: this.nameSel.type,
        type_view: this.tview || null,
      };
      if (guifanqiye != "") {
        params.guifanqiyestr = guifanqiye;
      }
      //销售趋势的api
      let xsqsUrlList = [
        {
          url: "dlypxsqslist",
          params
        }, //销售趋势列表
        {
          url: "dlypxsqs"
        } //销售趋势
      ];
      if (guifanqiye != "") {
        xsqsUrlList[0].params.guifanqiyestr = guifanqiye;
      }
      // 处于放大测试版
      if (this.getUrlParam("type_id") == 2) {
        commonParam.is_magnify = 1;
        if (apiUrlList[0].url == "dljtpz") {
          apiUrlList[0].params.is_magnify = 1;
        }
        xsqsUrlList[0].params.is_magnify = 1;
        let xsqsUrlListParam = {
          namestr,
          type: this.nameSel.type,
          is_magnify: 1,
          type_view: this.tview || null,
        };
        if (guifanqiye != "") {
          xsqsUrlListParam.guifanqiye = guifanqiye;
        }
        xsqsUrlList[1].params = this.keywordStatistics(xsqsUrlListParam, {
          name: "药品名称",
          guifanqiyestr: "企业名称"
        });
        xsqsUrlList[1].params.is_magnify = 1;
        xsqsUrlList[1].params.year = this.yearSel.model || null;
      }
      //其余图表的api
      let echartsUrlList = [
        { url: "dlypqyfx", params: commonParam }, //企业分析
        { url: "dlypjxfx", params: commonParam }, //剂型分析
        { url: "dlyppzfx", params: commonParam }, //品种分析
        { url: "dlypggfx", params: commonParam } //规格分析
        // { url: 'dlypdqfx', params: commonParam }, //省份分析
      ];
      let apiList = [];
      let xsqsList = [];

      _.forEach(apiUrlList, item => {
        apiList.push(
          Store.dispatch("Yyxs/getApi", { url: item.url, params: item.params })
        );
      });
      _.forEach(xsqsUrlList, item => {
        xsqsList.push(
          Store.dispatch("Yyxs/getApi", { url: item.url, params: item.params })
        );
      });
      this.isloading = true;
      Axios.all([...apiList])
        .then(
          Axios.spread((jtpz, yptj) => {

            this.isloading = false;
            //渲染具体品种
            this.screenList = this.getData(jtpz);
            //渲染总计
            this.totalList = [];
            let total = this.getData(yptj);
            if (total) {
              // 活性成分
              if (this.nameSel.type === 1) {
                this.totalObj["jixing2"] = {
                  val: "剂型统计",
                  unit: "个"
                };
                this.totalObj["guifanguige"] = {
                  val: "规格统计",
                  unit: "种"
                };
              } else if (this.nameSel.type === 2) {
                if (this.totalObj.jixing2) delete this.totalObj.jixing2;
                // 药品名称
                this.totalObj["guifanguige"] = {
                  val: "规格统计",
                  unit: "种"
                };
              }
              _.forEach(this.totalObj, (item, key) => {
                // 统计-总销售额、剂型统计、规格统计不显示年份
                let value = _.cloneDeep(total.list[key]);
                if (["year", "jixing2", "guifanguige"].includes(key)) {
                  delete value.year;
                }
                let sort = 0;
                switch (key) {
                  case "guifanqiye":
                    sort = 1;
                    break;
                  case "jixing2":
                    sort = 2;
                  case "guifanguige":
                    sort = 3;
                    break;
                  case "year":
                    sort = 4;
                    break;
                  case "tb":
                    sort = 5;
                    break;
                }
                this.totalList.push({ key: key, value, sort });
              });
              this.totalList = _.orderBy(this.totalList, ["sort"], ["asc"]);
            }
          })
        )
        .catch(err => {
          console.error(err);
        });

      //渲染销售趋势
      Axios.all([...xsqsList])
        .then(
          Axios.spread((odata, xsqs) => {
            //销售表格数据

            let odataData = this.getData(odata);
            let comdata = this.getData(xsqs);
            let eitem = this.echartList[0];
            let isBillion = this.$refs.echartsItem[0].isBillion(
              odataData,
              eitem.sKey
            );
            eitem.curType = "bar";
            eitem.type = this.yearModel
              ? ["bar", "pie", "table"]
              : ["bar", "table"];
            eitem.select.option = comdata.select;
            eitem.isBillion = isBillion;
            eitem.unit = isBillion ? "亿" : "万";
            eitem.tableHead[1].label = isBillion
              ? "销售额（亿元）"
              : "销售额（万元）";
            eitem.edata = comdata.list;
            eitem.data = this.$refs.echartsItem[0].unitChange(
              odataData,
              eitem.sKey
            );
            eitem.eloading = false;
            this.$refs.echartsItem[0].drawBarLine(eitem.edata, isBillion, true);
          })
        )
        .catch(err => {
          console.error(err);
        });

      //渲染企业分析、渲染品种分析、渲染规格分析、渲染省份分析
      _.forEach(echartsUrlList, (item, i) => {
        i = i + 1;
        let eitem = this.echartList[i];
        Store.dispatch("Yyxs/getApi", {
          url: item.url,
          params: item.params
        }).then(res => {

          let comdata = this.getData(res);
          let isBillion = this.$refs.echartsItem[i].isBillion(
            comdata,
            eitem.sKey
          );
          eitem.unit = isBillion ? "亿" : "万";
          eitem.isBillion = isBillion;
          eitem.tableHead[1].label =
            isBillion && eitem.tableHead ? "销售额（亿元）" : "销售额（万元）";
          eitem.data = this.$refs.echartsItem[i].unitChange(
            comdata,
            eitem.sKey
          );
          eitem.eloading = false;
          this.$refs.echartsItem[i]["drawBar" + eitem.barType](
            comdata,
            eitem.nameKey,
            "sale"
          );
        });
      });
    },
    clearSelFn() {
      $("#nameSel").val("");
      this.clearSel = true;
      this.nameSel.options = [];
    },
    nameSelChange() {
      if (!this.clearSel) {
        $("#nameSel").val(this.nameModel);
      }
    },
    //选择名称
    changeName(val) {
      if (val) {
        this.checkList = [];
        let obj = _.find(this.apiDlypinputList, { name: val });
        this.clearSel = false;
        this.yearSel.model = "";
        this.nameModel = obj.name;
        // this.screenModel = obj.name;
        console.log(obj.type);
        this.nameSel.type = obj.type;
        this.stype = obj.type;
        // this.echartList[2].show = obj.type === 2;
        this.echartList[3].show = obj.type === 1; // 显示品种分析
        this.getYearData();
        this.getTitle();
        this.init();
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
          data = this.getAmountData(data)
        }
        return data;
      } else {
        return false;
      }
    },
    // 处理销售量的返回数据 （接口字段不统一）
    getAmountData(data) {
      return JSON.parse(JSON.stringify(data).replace(/amount/gi, 'sale'));
    },
    //选择品种
    pzClick(val) {
      this.nameSel.type = this.checkList.length > 1 ? 2 : 1; // 1表示全部品种 同时活性成分 2表示具体某一个品种 选择药品名称
      this.screenModel = val;
      // this.echartList[2].show = val != this.nameModel;
      this.echartList[3].show = val === this.nameModel;
      this.init();
      this.getTitle();
    },
    //公司下拉框
    selChange(val, fn) {
      this.guifanqiye = val;
      let title = this.yearModel
        ? `销售额时间分析（${this.yearModel}年统计）`
        : "销售额时间分析（年统计）";
      let qTitle = this.guifanqiye ? `-${this.guifanqiye.join('、')}` : "";
      let eitem = this.echartList[0];
      eitem.title = `${this.titleYearStr}年-${this.checkList.join("、") || this.screenModel || this.nameModel}-${qTitle}${title}`;
      this.qyTitle = `${this.titleYearStr}年-${this.screenModel ||
        this.nameModel}等-${this.guifanqiye ? `${this.guifanqiye[0]}等` : ""}`; // 用于公司下拉多选的标题

      let guifanqiye = "";
      if (this.guifanqiye.length > 0) {
        guifanqiye = this.guifanqiye.join(",");
      }
      let namestr = this.checkList.join("、") || this.nameModel
      let params = {
        year: this.yearSel.model || null,
        namestr,
        type: this.nameSel.type || null,
        is_magnify: 1,
        type_view: this.tview || null,
      };
      if (guifanqiye != "") {
        params.guifanqiyestr = guifanqiye;
      }
      Axios.all([
        Store.dispatch("Yyxs/getApi", {
          url: "dlypxsqs",
          params: this.keywordStatistics(params, {
            name: "药品名称",
            year: "年份",
            guifanqiyestr: "企业名称"
          })
        }),
        Store.dispatch("Yyxs/getApi", { url: "dlypxsqslist", params: params })
      ]).then(
        Axios.spread((xsqs, odata) => {
          let odataData = this.getData(odata);
          let isBillion = this.$refs.echartsItem[0].isBillion(
            odataData,
            eitem.sKey
          );
          eitem.tableHead[1].label = isBillion
            ? "销售额（亿元）"
            : "销售额（万元）";
          eitem.unit = isBillion ? "亿" : "万";
          eitem.data = this.$refs.echartsItem[0].unitChange(
            odataData,
            eitem.sKey
          );
          eitem.isBillion = isBillion;

          let xsqsData = this.getData(xsqs);
          eitem.edata = xsqsData.list;
          this.$refs.echartsItem[0].drawBarLine(xsqsData.list, isBillion, true);
          // this.getTitle();
          fn();
        })
      );
    },
    //导出总体数据
    clickBtn() {
      if (this.nopms.yyxsfxxtoutdata) {
        return false;
      }
      this.isloading = true;
      let headYearStr = "";
      _.forEach(this.yearSel.options, item => {
        headYearStr += `${item}=${item},`;
      });
      let yearStr = this.yearModel ? `year=${this.yearModel}&` : "";
      let namestr = this.checkList.join('、') || this.nameModel || this.screenModel;
      headYearStr = yearStr
        ? `${this.yearModel}=${this.yearModel},`
        : headYearStr;
      let token = GETCOOKIEFUN("accesstoken");
      let url = `/api/yyxs/dlypoutdata?namestr=${namestr}&zwylbm=${this.nameSel.model
        }&${yearStr}type=${this.nameSel.type
        }&outdata_column=guifanname=药品名称,guifanqiye=企业名称,${headYearStr}tablename=${namestr
        }${this.tview == 1 ? '销售额数据' : '销售量数据'}&accesstoken=${token}&time=${new Date().getTime()}`;

      console.log(this.nameSel.model, this.nameSel.type, this.nameModel);
      console.log(url);
      this.downloadFile(url + "&is_magnify=1&type_view=" + this.tview);
      this.isloading = false;
      /*使用ajax同步请求，避免回调open被拦截*/
      // window.Axios({
      //   method: "get",
      //   // dataType: "json",
      //   url: url+'&is_magnify=1'
      // }).then((res) => {
      //   setTimeout(async () => {
      //     await this.downloadFile(url+'&is_magnify=1');
      //     this.isloading = false;
      //   }, 300);
      // let data =typeof res.data== "string"? JSON.parse(res.data) : res.data;
      // let code = data.code;
      // if(code == 200){
      //   let total = data.data.count
      //   if (total>1000) {
      //     this.$Confirm('导出',`当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,() => {
      //       this.downloadFile(url+'&is_magnify=1')
      //     })
      //   }else{
      //       this.downloadFile(url+'&is_magnify=1')
      //   }
      // }
      // })
    },
    //改变名称
    remoteMethod(val, callback) {
      if (val) {
        this.nameSel.loading = true;
        Store.dispatch("Yyxs/getApi", {
          url: "dlypinput",
          params: { name: val }
        }).then(res => {
          this.nameSel.loading = false;
          let data = this.getData(res);
          let _data = [];
          let options1 = [];
          let options2 = [];
          this.apiDlypinputList = data;
          _.forEach(data, item => {
            if (item.type === 1) {
              options1.push({ value: item.name, type: item.type });
            }
            if (item.type === 2) {
              options2.push({ value: item.name, type: item.type });
            }
          });
          if (options1.length > 0) {
            _data.push({ label: "活性成分", options: options1 });
          }
          if (options2.length > 0) {
            _data.push({ label: "药品名称", options: options2 });
          }
          this.nameSel.options = _data;
        });
      } else {
        this.nameSel.options = [];
        $("#nameSel").attr("placeholder", "请输入活性成分或药品名称");
      }
    }
  },
  mounted() {
    // if (this.$route.query.type) {
    //   this.pzClick(this.$route.query.type);
    // }
    // if (!this.$route.query.subType && !this.$route.query.type) {
    //   this.pzClick(this.nameModel);
    // }
    this.getYearData();
    this.init();
    this.selectPopMouseleave(this);
  }
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

.head {
  height: 58px;
  line-height: 58px;

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
  margin: 0 0 20px 18px;
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
    border-radius: 4px !important;
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

/deep/.el-select-dropdown__item {
  width: 300px;
  display: block;
}

.more-btn {
  z-index: 3;
  line-height: 20px;
  // position: absolute;
  bottom: -18px;
  right: 3px;

  .icon {
    transform: rotate(90deg);
  }
}

.el-checkbox-group {
  font-size: unset;
}

.el-checkbox+.el-checkbox {
  margin-left: 0 !important;
  margin-right: 30px;
}
</style>
