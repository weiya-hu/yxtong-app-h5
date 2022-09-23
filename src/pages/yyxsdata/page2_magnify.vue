<template>
  <div class="page-wrap">
    <!-- 顶部搜索 -->
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="top el-input-icon-lineHeight30">
      <div class="block-middle">
        <inputPopover :value="nameSel.model">
          <el-autocomplete v-model="nameSel.model" :trigger-on-focus="false" :fetch-suggestions="remoteMethod"
            :placeholder="nameSel.placeholder" :suffix-icon="inputIcon" :popper-append-to-body="false"
            @select="changeName" @focus="() => (inputIcon = '')" @blur="() => (inputIcon = 'el-icon-search')" clearable
            ref="popoverAutoInput" />
        </inputPopover>
      </div>
      <Select v-model="yearSel.model" :loading="yearSel.loading" :placeholder="yearSel.placeholder" @change="init"
        autoWidth>
        <el-option label="全部年份" value=""></el-option>
        <el-option v-for="item in yearSel.options" :key="item" :label="item" :value="item" />
      </Select>
      <el-select v-model="tview" @change="xslChange">
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
    <!-- 数量统计 -->
    <Total :list="totalList" :totalObj="totalObj" :tviewkey="tview == '1' ? 'sale' : 'amount'" />
    <!-- 图表项 -->
    <div class="echarts-wrap">
      <div v-for="(item, i) in eList" :key="i">
        <EchartsItemMagnify ref="echartsItem" :nopmState="nopmState" :item="item" :index="i" queryName="guifanqiye"
          :tviewkey="tview == '1' ? 'sale' : 'amount'" :year="yearModel" :qyTitle="qyTitle" :nowNav="nowNav"
          :multiple="item.multiple" :name="nameModel" @selChange="selChange" @changeEcharts="changeEcharts"
          @changeLoading="(type) => (isloading = type)" />
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import inputPopover from "@/components/inputs/input-popover";
import Total from "./components/total.vue";
import EchartsItemMagnify from "./components/echartsItemMagnify.vue";
import Select from "@/components/inputs/select";
import { mapState } from "vuex";

export default {
  props: {
    nowNav: {
      type: String
    },
    qyname: {
      type: String,
    },
    nopmState: {
      type: Boolean,
    },
  },
  components: {
    LoadingGif,
    Total,
    EchartsItemMagnify,
    Select,
    inputPopover,
  },
  data() {
    return {
      qyTitle: "",
      isloading: true,
      inputIcon: "el-icon-search",
      nameModel: this.qyname || "重庆华邦制药有限公司",
      nameSel: {
        model: this.qyname || "重庆华邦制药有限公司",
        placeholder: "请输入企业名称",
        options: [],
        loading: false,
        type: 1,
      },
      yearSel: {
        model: "",
        placeholder: "请选择年份",
        options: [],
        loading: false,
      },
      tview: "1",
      guifanname: "",
      totalList: [],
      totalObj: {
        guifanname: {
          val: "品种",
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
          url: "dlqyxsqsoutdata",
          type: ["bar", "table"],
          curType: "bar",
          title: "",
          multiple: true,
          option: {},
          show: true,
          nameKey: "key",
          sKey: "value",
          nameValue: "季度",
          tableHead: [
            { prop: "key", label: "年份" },
            { prop: "value", label: "销售额（万元）" },
            { prop: "tb", label: "同比（%）" },
          ],
          select: {
            model: "",
            placeholder: "请选择或输入药品名称",
            option: [],
          },
          unit: "万",
        },
        {
          name: "剂型分析",
          url: "dlqyjxfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "jixing2",
          option: {},
          show: true,
          tableHead: [
            { prop: "jixing2", label: "剂型" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
        {
          name: "品种分析",
          url: "dlqypzfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "x",
          nameKey: "guifanname",
          option: {},
          show: true,
          tableHead: [
            { prop: "guifanname", label: "品种" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
        // , {
        //   name: '省份分析',
        //   url: 'dlqydqfx',
        //   type: ['bar', 'pie', 'table'],
        //   curType: 'bar',
        //   title: '',
        //   barType: 'y',
        //   nameKey: 'state',
        //   option: {},
        //   show: true,
        //   tableHead: [{ prop: "state", label: '省份' }, { prop: "sale", label: '销售额（万元）' }],
        //   unit: '万',
        // }
      ],
      titleList: [
        "销售额时间分析（年统计）",
        "销售额剂型分析（TOP10）",
        "销售额品种分析（TOP10）",
        // , '销售额省份分析（TOP10）'
      ],
      titleYearStr: "",
    };
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Yyxs.nopms,
      isFangDa: (state) => state.UserCenter.isFangDa,
    }),
    yearModel() {
      return this.yearSel.model.toString();
    },
    eList() {
      let t = _.clone(this.echartList);
      t[0].name = this.tview == 1 ? "销售额趋势" : "销售量趋势";
      return t;
    },
  },
  watch: {
    qyname(val) {
      this.nameModel = val || "重庆华邦制药有限公司";
      this.nameSel.model = val || "重庆华邦制药有限公司";
      this.init();
    },
    yearModel(val) {
      this.echartList[0].tableHead = [
        { prop: "key", label: "年份" },
        { prop: "value", label: "销售额（万元）" },
        { prop: "tb", label: "同比（%）" },
      ];
      if (val) {
        this.echartList[0].tableHead[3] = { prop: "hb", label: "环比（%）" };
      }
      this.echartList[0].tableHead[0].label = val ? "季度" : "年份";
      this.titleList[0] = val
        ? `销售额时间分析（季度统计）`
        : "销售额时间分析（年统计）";
      this.getTitle();
    },
  },
  methods: {
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
        url: "dlyqyflist",
        params: { guifanqiye: this.nameModel.slice(0, this.inpMaxLen) },
      }).then((res) => {
        let yearData = this.getData(res);
        this.yearSel.options = yearData;
        this.yearData = yearData;
        this.getTitle();
      });
    },
    //渲染标题
    getTitle() {
      let yearData = this.yearData;
      this.titleYearStr =
        this.yearSel.model ||
        (yearData.length > 1
          ? `${yearData[yearData.length - 1]}-${yearData[0]}`
          : `${yearData[0]}`);
      _.forEach(this.titleList, (item, i) => {
        this.echartList[
          i
        ].title = `${this.titleYearStr}年-${this.nameSel.model}${item}`;
      });
    },
    init() {
      _.forEach(this.echartList, (item) => {
        item.eloading = true;
      });
      this.echartList[0].select.model = "";
      this.guifanname = "";
      //公共参数
      let commonParam = {
        guifanqiye: this.nameSel.model.slice(0, this.inpMaxLen),
        year: this.yearSel.model || null,
        is_magnify: 1,
        type_view: this.tview || null,
      };
      let name = "";
      if (
        this.guifanname.length > 0 &&
        this.guifanname.slice(0, this.inpMaxLen).length > 0
      ) {
        name = this.guifanname.slice(0, this.inpMaxLen).join(",");
      }
      let xsqsParams = {
        year: this.yearSel.model || null,
        guifanqiye: this.nameSel.model.slice(0, this.inpMaxLen),
        is_magnify: 1,
        type_view: this.tview || null,
      };
      if (
        this.guifanname.length > 0 &&
        this.guifanname.slice(0, this.inpMaxLen).length > 0
      ) {
        xsqsParams.namestr = name;
      }
      let params = {
        year: this.yearSel.model || null,
        guifanqiye: this.nameSel.model.slice(0, this.inpMaxLen),
        is_magnify: 1,
        type_view: this.tview || null,
      };
      if (name != "") {
        params.namestr = name;
      }
      //销售趋势的api
      let xsqsUrlList = [
        {
          url: "dlqyxsqslist",
          params,
        }, //销售趋势列表
        {
          url: "dlqyxsqs",
          params: this.keywordStatistics(xsqsParams, {
            namestr: "药品名称",
            year: "年份",
            guifanqiye: "企业名称",
          }),
        }, //销售趋势
      ];
      if (
        this.guifanname.length > 0 &&
        this.guifanname.slice(0, this.inpMaxLen).length > 0
      ) {
        xsqsUrlList[0].params.namestr = name;
      }
      //其余图表的api
      let echartsUrlList = [
        { url: "dlqyjxfx", params: commonParam }, //剂型分析
        { url: "dlqypzfx", params: commonParam }, //品种分析
        // { url: 'dlqydqfx', params: commonParam }, //省份分析
      ];
      let xsqsList = [];
      _.forEach(xsqsUrlList, (item) => {
        xsqsList.push(
          Store.dispatch("Yyxs/getApi", { url: item.url, params: item.params })
        );
      });

      //渲染合计
      this.isloading = true;
      Store.dispatch("Yyxs/getApi", { url: "dlqytj", params: commonParam })
        .then((res) => {
          this.isloading = false;
          this.totalList = [];
          let total = this.getData(res);
          if (total) {
            this.totalObj["jixing2"] = {
              val: "剂型统计",
              unit: "个",
            };
            _.forEach(this.totalObj, (item, key) => {
              let value = _.cloneDeep(total.list[key]);
              if (["year"].includes(key)) {
                delete value.year;
              }
              let sort = 0;
              switch (key) {
                case "guifanname":
                  sort = 1;
                  break;
                case "jixing2":
                  sort = 2;
                  break;
                case "year":
                  sort = 3;
                  break;
                case "tb":
                  sort = 4;
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
        .catch((err) => {
          console.error(err);
        });

      //渲染品种分析、省份分析
      _.forEach(echartsUrlList, (item, i) => {
        i = i + 1;
        let eitem = this.echartList[i];
        Store.dispatch("Yyxs/getApi", {
          url: item.url,
          params: item.params,
        }).then((res) => {
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
    changeName(obj) {
      this.yearSel.model = "";
      this.nameModel = obj.value;
      this.getYearData();
      this.init();
    },
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
    selChange(val, fn) {
      this.guifanname = val;
      let title = this.yearModel
        ? `销售额时间分析（${this.yearModel}年统计）`
        : "销售额时间分析（年统计）";
      let gfName = this.guifanname ? `-${this.guifanname}` : "";
      let eitem = this.echartList[0];
      eitem.title = `${this.titleYearStr}年-${this.screenModel || this.nameModel
        }${gfName}${title}`;
      this.qyTitle = `${this.titleYearStr}年-${this.screenModel || this.nameModel
        }${this.guifanqiye ? `-${this.guifanqiye[0]}等` : ""}`;
      let name = "";
      if (
        this.guifanname.length > 0 &&
        this.guifanname.slice(0, this.inpMaxLen).length > 0
      ) {
        name = this.guifanname.slice(0, this.inpMaxLen).join(",");
      }
      let params = {
        year: this.yearSel.model || null,
        guifanqiye:
          this.nameSel.model && this.nameSel.model.slice(0, this.inpMaxLen),
        is_magnify: 1,
        type_view: this.tview || null,
      };
      if (this.guifanname.slice(0, this.inpMaxLen).length > 0) {
        params.namestr = name;
      }
      console.log(this.guifanname.slice(0, this.inpMaxLen).length > 0, params);
      Axios.all([
        Store.dispatch("Yyxs/getApi", {
          url: "dlqyxsqs",
          params: this.keywordStatistics(params, {
            namestr: "药品名称",
            year: "年份",
            guifanqiye: "企业名称",
          }),
        }),
        Store.dispatch("Yyxs/getApi", { url: "dlqyxsqslist", params: params }),
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
      _.forEach(this.yearSel.options, (item) => {
        headYearStr += `${item}=${item},`;
      });
      let yearStr = this.yearModel ? `year=${this.yearModel}&` : "";
      headYearStr = yearStr
        ? `${this.yearModel}=${this.yearModel},`
        : headYearStr;
      let token = GETCOOKIEFUN("accesstoken");
      let url = `/api/yyxs/dlqyoutdata?guifanqiye=${this.nameSel.model}&${yearStr}outdata_column=guifanname=药品名称,guifanqiye=企业名称,${headYearStr}tablename=${this.nameModel}${this.tview == 1 ? '销售额数据' : '销售量数据'}&accesstoken=${token}`;

      this.downloadFile(url + "&is_magnify=1&type_view=" + this.tview);
      this.isloading = false;
      // Axios.get(url+'&is_magnify=1')
      // .then((res) => {
      //   this.downloadFile(url+'&is_magnify=1')
      //   this.isloading = false;
      // if (res.data.code == 200 && res.data.data) {
      //   let total = res.data.data.count
      //   if (total>1000) {
      //     this.$Confirm('导出',`当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,() => {
      //       this.downloadFile(url)
      //     })
      //   }else{
      //       this.downloadFile(url)
      //   }
      // }
      // })
    },
    //改变名称
    remoteMethod(val, callback) {
      if (val) {
        Store.dispatch("Yyxs/getApi", {
          url: "dlqyinput",
          params: { guifanqiye: val.slice(0, this.inpMaxLen) },
        }).then((res) => {
          let data = this.getData(res);
          let _data = [];
          _.forEach(data, (item) => {
            _data.push({ value: item });
          });
          callback(_data);
        });
      }
    },
  },
  mounted() {
    this.getYearData();
    this.init();
    this.inputPopMouseleave(this);
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

.top {
  margin: 20px 0 0 20px;
  clear: both;

  .top-btn {
    float: right;
    margin-right: 20px;
    border-radius: 4px !important;
  }
}

.nopms-btn {
  color: #fff !important;
  background: #97a2bf;
  border: none;
}

.block-middle {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}

/deep/.el-select-dropdown__item {
  width: 300px;
  display: block;
}
</style>
