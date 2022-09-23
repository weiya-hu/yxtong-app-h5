<template>
  <div class="page-wrap">
    <!-- 顶部搜索 -->
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="top el-input-icon-lineHeight30">
      <div class="block-middle">
        <inputPopover :value="nameSel.model">
          <el-autocomplete
            v-model="nameSel.model"
            :trigger-on-focus="false"
            :fetch-suggestions="remoteMethod"
            :placeholder="nameSel.placeholder"
            :suffix-icon="inputIcon"
            @select="changeName"
                :popper-append-to-body="false"
            @focus="() => (inputIcon = '')"
            @blur="() => (inputIcon = 'el-icon-search')"
            clearable
            ref="popoverAutoInput"
          />
        </inputPopover>
      </div>
      <Select
        v-model="yearSel.model"
        :loading="yearSel.loading"
        :placeholder="yearSel.placeholder"
        @change="init"
        autoWidth
      >
        <el-option label="全部年份" value=""></el-option>
        <el-option
          v-for="item in yearSel.options"
          :key="item"
          :label="item"
          :value="item"
        />
      </Select>
            <el-select v-model="tview">
        <el-option value="1" label="销售额">销售额</el-option> 
        <el-option value="2" label="销售量">销售量</el-option> 
      </el-select>
      <el-button
        v-if="nopmState"
        class="top-btn"
        :class="{ 'abandon-click-method nopms-btn': nopms.yyxsfxxtoutdata }"
        type="primary"
        size="mini"
        round
        @click="clickBtn"
        ><i class="iconfont download-icon">&#xe62c;</i>下载数据</el-button
      >
    </div>
    <!-- 名称 -->
    <div class="head">
      <div class="yyxs-title">
        {{ nameModel }}
      </div>
    </div>
    <!-- 数量统计 -->
    <Total :list="totalList" :totalObj="totalObj" />
    <!-- 图表项 -->
    <div class="echarts-wrap">
      <div v-for="(item, i) in echartList" :key="i">
        <EchartsItem
          ref="echartsItem"
          :nopmState="nopmState"
          :item="item"
          :index="i"
          queryName="guifanqiye"
          :year="yearModel"
          :name="nameModel"
          @selChange="selChange"
          @changeEcharts="changeEcharts"
          @changeLoading="(type) => (isloading = type)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import inputPopover from "@/components/inputs/input-popover";
import Total from "./components/total.vue";
import EchartsItem from "./components/echartsItem.vue";
import Select from "@/components/inputs/select";
import { mapState } from "vuex";

export default {
  props: {
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
    EchartsItem,
    Select,
    inputPopover,
  },
  data() {
    return {
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
      tview: '1',
      guifanname: "",
      totalList: [],
      totalObj: {
        guifanname: {
          val: "品种",
          unit: "个",
        },
        area: {
          val: "区域",
          unit: "个",
        },
        state: {
          val: "省份",
          unit: "个",
        },
        year: {
          val: "销售总额",
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
          option: {},
          show: true,
          nameKey: "key",
          sKey: "value",
          nameValue: "年",
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
        {
          name: "省份分析",
          url: "dlqydqfx",
          type: ["bar", "pie", "table"],
          curType: "bar",
          title: "",
          barType: "y",
          nameKey: "state",
          option: {},
          show: true,
          tableHead: [
            { prop: "state", label: "省份" },
            { prop: "sale", label: "销售额（万元）" },
          ],
          unit: "万",
        },
      ],
      titleList: [
        "销售额时间分析（年统计）",
        "销售额品种分析（TOP10）",
        "销售额省份分析（TOP10）",
      ],
      titleYearStr: "",
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
      // if (val) {
      //   this.echartList[0].tableHead[3] = { prop: "hb", label: '环比（%）' }
      // };
      this.echartList[0].tableHead[0].label = "年份";
      this.titleList[0] = val ? "销售额时间分析" : "销售额时间分析（年统计）";
      this.getTitle();
    },
  },
  methods: {
    //切换图标类型
    changeEcharts(type, index) {
      let eobj = this.echartList[index];
      if (type === "bar") {
        if (eobj.name === "销售趋势") {
          this.$refs.echartsItem[index].drawBarLine(eobj.edata, eobj.isBillion);
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
      };
      // 处于放大测试版
      if (this.getUrlParam("type_id") == 2) {
        commonParam.is_magnify = 1;
      }
      //销售趋势的api
      let xsqsUrlList = [
        {
          url: "dlqyxsqslist",
          params: {
            year: this.yearSel.model || null,
            name: this.guifanname.slice(0, this.inpMaxLen) || null,
            guifanqiye: this.nameSel.model.slice(0, this.inpMaxLen) || null,
          },
        }, //销售趋势列表
        {
          url: "dlqyxsqs",
          params: this.keywordStatistics(
            {
              year: this.yearSel.model || null,
              name: this.guifanname.slice(0, this.inpMaxLen) || null,
              guifanqiye: this.nameSel.model.slice(0, this.inpMaxLen) || null,
            },
            { guifanqiye: "企业名称", name: "药品名称", year: "年份" }
          ),
        }, //销售趋势
      ];
      //其余图表的api
      let echartsUrlList = [
        { url: "dlqypzfx", params: commonParam }, //品种分析
        { url: "dlqydqfx", params: commonParam }, //省份分析
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
            _.forEach(this.totalObj, (item, key) => {
              this.totalList.push({ key: key, value: total.list[key] });
            });
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
            eitem.curType = "bar";
            if (this.getUrlParam("type_id") == 2) {
              eitem.type = ["bar", "pie", "table"];
            } else {
              eitem.type = this.yearModel
                ? ["bar", "pie", "table"]
                : ["bar", "table"];
            }
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
            this.$refs.echartsItem[0].drawBarLine(eitem.edata, isBillion);
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
        return data;
      } else {
        return false;
      }
    },
    selChange(val, fn) {
      this.guifanname = val;
      let title = this.yearModel
        ? "销售额时间分析（季度统计）"
        : "销售额时间分析（年统计）";
      let gfName = this.guifanname ? `-${this.guifanname}` : "";
      let eitem = this.echartList[0];
      eitem.title = `${this.titleYearStr}年-${
        this.screenModel || this.nameModel
      }${gfName}${title}`;
      let params = {
        year: this.yearSel.model || null,
        name:
          (this.guifanname && this.guifanname.slice(0, this.inpMaxLen)) || null,
        guifanqiye:
          (this.nameSel.model && this.nameSel.model.slice(0, this.inpMaxLen)) ||
          null,
      };
      Axios.all([
        Store.dispatch("Yyxs/getApi", {
          url: "dlqyxsqs",
          params: this.keywordStatistics(params, {
            guifanqiye: "企业名称",
            name: "药品名称",
            year: "年份",
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
          this.$refs.echartsItem[0].drawBarLine(xsqsData.list, isBillion);
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
      let url = `/api/yyxs/dlqyoutdata?guifanqiye=${this.nameSel.model}&${yearStr}outdata_column=guifanname=药品名称,guifanqiye=企业名称,${headYearStr}tablename=${this.nameModel}销售数据&accesstoken=${token}`;

      // Axios.get(url+'&outdata_count')
      // .then((res) => {
      //   if (res.data.code == 200 && res.data.data) {
      //     let total = res.data.data.count
      //     if (total>1000) {
      //       this.$Confirm('导出',`当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,() => {
      //         this.downloadFile(url)
      //       })
      //     }else{
      //       this.downloadFile(url)
      //     }
      //     this.isloading = false;
      //   };
      // })
      this.downloadFile(url);
      this.isloading = false;
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
  activated() {
    // TODO 医院销售普通版重定向到放大测试版
    if (
      this.$route.path === "/yyxsdata" &&
      this.getUrlParam("type_id") != 2 &&
      this.getUrlParam("ga_name") != "navmap"
    ) {
      this.$router.push({
        path: "/yyxsdata",
        query: {
          type_id: 2,
        },
      });
    } else if (this.getUrlParam("ga_name") == "navmap") {
      this.$router.push({
        path: "/yyxsdata",
        query: { ga_source: "vip", ga_name: "navmap", type_id: 2 },
      });
    }
  },
  mounted() {
    // TODO 医院销售普通版重定向到放大测试版
    if (
      this.$route.path === "/yyxsdata" &&
      this.getUrlParam("type_id") != 2 &&
      this.getUrlParam("ga_name") != "navmap"
    ) {
      this.$router.push({
        path: "/yyxsdata",
        query: {
          type_id: 2,
        },
      });
    } else if (this.getUrlParam("ga_name") == "navmap") {
      this.$router.push({
        path: "/yyxsdata",
        query: { ga_source: "vip", ga_name: "navmap", type_id: 2 },
      });
    }
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
  overflow: hidden;
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
</style>
