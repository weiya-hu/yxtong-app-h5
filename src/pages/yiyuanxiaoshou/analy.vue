<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif :className="'db-index-loading'" :loadFlag="analyLoading" v-if="analyLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="shengwuzhipin-analy">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="totals">
          <ul class="total-item" v-for="(item, i) in totalList" :key="i">
            <template v-if="
              Object.prototype.toString.call(kshResTotal[item.key]) ===
              '[object Object]' && item.key === 'tb'
            ">
              <li class="li1">
                {{ item.name }}（{{ kshResTotal[item.key]["year"] }}）
              </li>
              <li class="li2">
                总计
                <span>{{
                    kshResTotal[item.key]["value"]
                      ? kshResTotal[item.key]["value"]
                      : "-"
                }}</span>{{ item.unit }}
              </li>
            </template>
            <template v-else>
              <li class="li1">
                {{ item.name }}
              </li>
              <li class="li2" v-if="kshResTotal[item.key] >= 100000000 && item.key === 'sale'">
                总计
                <span>{{
                    kshResTotal[item.key]
                      ? (kshResTotal[item.key] / 100000000).toFixed(2)
                      : "-"
                }}</span>{{ amount_type == 1 ? "亿元" : "亿" }}
              </li>
              <li class="li2" v-else>
                <div v-if="item.key === 'sale'">
                  总计
                  <span>{{
                      kshResTotal[item.key]
                        ? (kshResTotal[item.key] / 10000).toFixed(2)
                        : "-"
                  }}</span>{{ item.unit }}
                </div>
                <div v-else>
                  总计
                  <span>{{
                      kshResTotal[item.key] ? kshResTotal[item.key] : "-"
                  }}</span>{{ item.unit }}
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/yyxs/list' }">返回列表</router-link>
        </div>
        <div class="chart-boxes">
          <template v-for="(item, i) in echartsList">
            <DbEcharts v-if="(amount_type != 2 || item.api != 'djfb_xszb') && i == 0"
              :title="i < 3 ? tempTitle[i] : item.title" :key="i"
              style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
              <MEcharts :ref="'echarts' + i" :option="item.option" :id="'echarts' + i" class="echarts"
                :conditions="conditions" :name="item.api" :atcsSel="atcsSel" />
              <div style="display:flex;align-items: center;">
                <div style="z-index: 9;">销售额：</div>
                <el-select size="mini" v-model="ypph_guifanname" @change="selectChange1" class="select-sort"
                  popper-class="popper-class">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="0-100万" value="0:100"></el-option>
                  <el-option label="100-1000万" value="100:1000"></el-option>
                  <el-option label="1000-5000万" value="1000:5000"></el-option>
                  <el-option label="5000万-1亿" value="5000:10000"></el-option>
                  <el-option label="1-10亿" value="10000:100000"></el-option>
                  <el-option label="10亿+" value="100000"></el-option>
                </el-select>
              </div>
            </DbEcharts>
            <DbEcharts v-else-if="(amount_type != 2 || item.api != 'djfb_xszb') && i == 1"
              :title="i < 3 ? tempTitle[i] : item.title" :key="i"
              style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
              <MEcharts :ref="'echarts' + i" :option="item.option" :id="'echarts' + i" class="echarts"
                :conditions="conditions" :name="item.api" :atcsSel="atcsSel" />
              <div style="display:flex;align-items: center;">
                <div style="z-index: 9;">销售额：</div>
                <el-select size="mini" v-model="ppph_guifan" @change="selectChange3" class="select-sort"
                  popper-class="popper-class">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="0-100万" value="0:100"></el-option>
                  <el-option label="100-1000万" value="100:1000"></el-option>
                  <el-option label="1000-5000万" value="1000:5000"></el-option>
                  <el-option label="5000万-1亿" value="5000:10000"></el-option>
                  <el-option label="1-10亿" value="10000:100000"></el-option>
                  <el-option label="10亿+" value="100000"></el-option>
                </el-select>
              </div>
            </DbEcharts>
            <DbEcharts v-else-if="(amount_type != 2 || item.api != 'djfb_xszb') && i == 2"
              :title="i < 3 ? tempTitle[i] : item.title" :key="i"
              style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
              <MEcharts :ref="'echarts' + i" :option="item.option" :id="'echarts' + i" class="echarts"
                :conditions="conditions" :name="item.api" :atcsSel="atcsSel" />
              <div style="display:flex;align-items: center;">
                <div style="z-index: 9;">销售额：</div>
                <el-select size="mini" v-model="qyph_guifanqiye" @change="selectChange2" class="select-sort"
                  popper-class="popper-class">
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="0-100万" value="0:100"></el-option>
                  <el-option label="100-1000万" value="100:1000"></el-option>
                  <el-option label="1000-5000万" value="1000:5000"></el-option>
                  <el-option label="5000万-1亿" value="5000:10000"></el-option>
                  <el-option label="1-10亿" value="10000:100000"></el-option>
                  <el-option label="10亿+" value="100000"></el-option>
                </el-select>
              </div>
            </DbEcharts>
            <DbEcharts v-else :title="i < 3 ? tempTitle[i] : item.title" :key="'else_' + i">
              <MEcharts :ref="'echarts' + i" :option="item.option" :id="'echarts' + i" class="echarts"
                :conditions="conditions" :name="item.api" :atcsSel="atcsSel" />
            </DbEcharts>
          </template>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog"
        :style="{ top: showPromtNotice ? '0' : '48px', height: showPromtNotice ? '100%' : 'calc(100% - 48px)' }"
        v-show="dialogVisible">
        <div class="menu">
          <div v-for="(ti, index) in title" v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
            @click="handleOpenIndex(index, [], true)" :key="index">
            {{ ti }}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title" v-if="openIndex < 3">{{
                tempTitle[openIndex]
            }}</span>
            <span class="echart-title" v-else>{{ title[openIndex] }}</span>
            <a class="esc-btn" href="javascript:;" @click="handleCloseIndex()">
              <i></i>
              <img src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏" />
            </a>
          </div>
          <div class="echarts-items">
            <div class="echarts-item" v-for="(item, i) in echartsListOpen" :key="i" v-show="i === openIndex">
              <div v-if="i === 0" style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
                <MEcharts :option="item.option" class="open-charts" :ref="'open-echarts' + i" :id="'open-echarts' + i"
                  :width="echartsOpenWidth" :conditions="conditions" :height="700" :name="item.api"
                  :atcsSel="atcsSel" />
                <div style="display:flex;align-items: center;">
                  <div style="z-index: 9;">销售额：</div>
                  <el-select size="mini" v-model="ypph_guifanname" @change="selectChange1" class="select-sort"
                    popper-class="popper-class">
                    <el-option label="0-100万" value="0:100"></el-option>
                    <el-option label="100-1000万" value="100:1000"></el-option>
                    <el-option label="1000-5000万" value="1000:5000"></el-option>
                    <el-option label="5000万-1亿" value="5000:10000"></el-option>
                    <el-option label="1-10亿" value="10000:100000"></el-option>
                    <el-option label="10亿+" value="100000"></el-option>
                  </el-select>
                </div>
              </div>
              <div v-else-if="i === 1" style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
                <MEcharts :option="item.option" class="open-charts" :ref="'open-echarts' + i" :id="'open-echarts' + i"
                  :width="echartsOpenWidth" :conditions="conditions" :height="700" :name="item.api"
                  :atcsSel="atcsSel" />
                <div style="display:flex;align-items: center;">
                  <div style="z-index: 9;">销售额：</div>
                  <el-select size="mini" v-model="ppph_guifan" @change="selectChange3" class="select-sort"
                    popper-class="popper-class">
                    <el-option label="0-100万" value="0:100"></el-option>
                    <el-option label="100-1000万" value="100:1000"></el-option>
                    <el-option label="1000-5000万" value="1000:5000"></el-option>
                    <el-option label="5000万-1亿" value="5000:10000"></el-option>
                    <el-option label="1-10亿" value="10000:100000"></el-option>
                    <el-option label="10亿+" value="100000"></el-option>
                  </el-select>
                </div>
              </div>
              <div v-else-if="i === 2" style="display:flex;flex-direction: column-reverse;align-items: flex-end;">
                <MEcharts :option="item.option" class="open-charts" :ref="'open-echarts' + i" :id="'open-echarts' + i"
                  :width="echartsOpenWidth" :conditions="conditions" :height="700" :name="item.api"
                  :atcsSel="atcsSel" />
                <div style="display:flex;align-items: center;">
                  <div style="z-index: 9;">销售额：</div>
                  <el-select size="mini" v-model="qyph_guifanqiye" @change="selectChange2" class="select-sort"
                    popper-class="popper-class">
                    <el-option label="0-100万" value="0:100"></el-option>
                    <el-option label="100-1000万" value="100:1000"></el-option>
                    <el-option label="1000-5000万" value="1000:5000"></el-option>
                    <el-option label="5000万-1亿" value="5000:10000"></el-option>
                    <el-option label="1-10亿" value="10000:100000"></el-option>
                    <el-option label="10亿+" value="100000"></el-option>
                  </el-select>
                </div>
              </div>
              <MEcharts v-else :option="item.option" class="open-charts" :ref="'open-echarts' + i"
                :id="'open-echarts' + i" :width="echartsOpenWidth" :conditions="conditions" :height="700"
                :name="item.api" :atcsSel="atcsSel" />
            </div>
          </div>
          <div class="ctr-actions">
            <el-button class="pre action" @click="handleOpenIndex(openIndex - 1, [], true)">
              <i class="el-icon-arrow-left"></i>
            </el-button>
            <el-button class="next action" @click="handleOpenIndex(openIndex + 1, [], true)">
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
          <div class="nodata-box fullcharts hide">
            <div class="nodata"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import DbEcharts from "@/components/common/db-echarts";
import MEcharts from "./components/echarts.vue";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    LoadingGif,
    DbEcharts,
    MEcharts,
  },
  data() {
    return {
      ypph_guifanname: "", // 药品销售
      qyph_guifanqiye: "", // 品牌销售
      ppph_guifan: "", // 企业销售
      specType: 0, // 0：占比统计 1：数据统计 默认占比统计
      tempTitle: [],
      titles: [
        !(this.$route.query.type == 2) ? "药品销售额排行" : "药品销售量排行",
        !(this.$route.query.type == 2) ? "品牌销售额排行" : "药品销售量排行",
        !(this.$route.query.type == 2) ? "企业销售额排行" : "药品销售量排行",
      ],
      n: 0,
      kshResTotal: {},
      totalList: [
        { name: "生产企业", key: "guifanqiye", unit: "个" },
        { name: "活性成分", key: "zwylbm", unit: "种" },
        { name: "品种数", key: "guifanname", unit: "个" },
        { name: "剂型", key: "jixing2", unit: "个" },
        { name: "规格", key: "guifanguige", unit: "个" },
        {
          name: !(this.$route.query.type == 2) ? "总销售额" : "总销售量",
          key: "sale",
          unit: "万元",
        },
        {
          name: !(this.$route.query.type == 2) ? "销售额同比" : "销售量同比",
          key: "tb",
          unit: "%",
        },
      ],
      echartsList: [
        {
          title: !(this.$route.query.type == 2)
            ? "药品销售额排行"
            : "药品销售量排行",
          api: "ypph",
          ykey: "field",
          skey: "sale",
          option: {},
        },
        {
          title: !(this.$route.query.type == 2)
            ? "品牌销售额排行"
            : "品牌销售量排行",
          api: "ppph",
          ykey: "field",
          skey: "sale",
          option: {},
        },
        {
          title: !(this.$route.query.type == 2)
            ? "企业销售额排行"
            : "企业销售量排行",
          api: "qyph",
          ykey: "field",
          skey: "sale",
          option: {},
        },
        {
          title: !(this.$route.query.type == 2) ? "年度销售额" : "年度销售量",
          api: "ndph",
          xkey: "field",
          lineKey: "sale",
          barKey: "sale",
          option: {},
        },
        {
          title: !(this.$route.query.type == 2)
            ? "医疗机构销售额"
            : "医疗机构销售量",
          api: "djfb_xszb",
          ykey: "field",
          skey: "sale",
          option: {},
        },
        {
          title: !(this.$route.query.type == 2)
            ? "ATC分类销售额"
            : "ATC分类销售量",
          api: "atc",
          ykey: "field",
          skey: "sale",
          option: {},
        },
      ],
      echartsListOpen: [],
      echartsOpenWidth: 700,
      promise: null,
      dialogVisible: false,
      openIndex: 0, //控制展开第几个图形
      atcsSel: false,
      id: "",
      analyLoading: true,
      tempType: [],
      tempTotalData: null,
      tempData: [], // 用于关闭全屏的数据传递存储
      searchState: {
        putong: {},
        gaoji: {},
        shaixuan: {},
        fourth: {},
      },
    };
  },
  watch: {
    clearSelect(val) {
      if (val) {
        this.analyLoading = true;
        this.ypph_guifanname = "";
        this.qyph_guifanqiye = "";
        this.ppph_guifan = "";
        Store.commit("Yyxs/clearSelect", false);
        console.log(this.param);
        this.analyLoading = false;
      }
    },
    dialogVisible: {
      handler(newVal, oldVal) {
        // this.selectChange1(this.ypph_guifanname)
        // this.selectChange2(this.qyph_guifanqiye)
        // this.selectChange3(this.ppph_guifan)
        this.id = newVal ? "open-echarts" : "echarts";
      },
      immediate: true,
      deep: true,
    },
    kshRes(obj) {
      if (this.$route.path === "/yyxs/analy") {
        this.kshResTotal = obj.aggs;
        this.tempTotalData = obj.view;
        if (document.getElementById("echarts4")) {
          let chart = Echarts.getInstanceByDom(
            document.getElementById("echarts4")
          );
          chart && chart.clear();
        }
        obj.view.djfb_xse.forEach((item) => (item.sale = item.sale / 10000));
        this.update(obj.view);
      }
    },
    $route(n, o) {
      if (n.query.type != o.query.type) {
        this.loadData();
      }
      if (this.$route.path === "/yyxs/analy" && !this.kshRes.aggs) {
        this.loadData();
      }
      if (this.$route.path === "/yyxs/analy") {
        window.addEventListener("resize", this.echartsResizeHandler);
      } else {
        window.removeEventListener("resize", this.echartsResizeHandler);
        this.echartsClear("echarts");
      }
      if (this.$route.path === "/yyxs/list") {
        //智能分析重新搜索清空列表数据tab无法自动复位
        let tabname = this.activeTabName;
        Store.commit("Yyxs/tabname", "");
        Store.commit("Yyxs/tabname", tabname);
        this.noData &&
          Store.dispatch("Yyxs/nomalSearch", {
            queryToPutong: false,
            tabs: true,
          });
      }
    },
  },
  computed: {
    ...mapState({
      nopms: (state) => state.Yyxs.nopms,
      kshRes: (state) => state.Yyxs.kshRes,
      conditions: (state) => state.Yyxs.conditions,
      allBase: (state) => state.Yyxs.allBase,
      activeTabName: (state) => state.Yyxs.tabname,
      res1: (state) => state.Yyxs.res1,
      res2: (state) => state.Yyxs.res2,
      res3: (state) => state.Yyxs.res3,
      res4: (state) => state.Yyxs.res4,
      putong: (state) => state.Yyxs.putong,
      gaoji: (state) => state.Yyxs.gaoji,
      shaixuan: (state) => state.Yyxs.shaixuan,
      fourth: (state) => state.Yyxs.fourth,
      param: (state) => state.Yyxs.param,
      clearSelect: (state) => state.Yyxs.clearSelect,
      showPromtNotice: (state) => state.showPromtNotice,
    }),
    amount_type() {
      return this.$route.query.type || "1";
    },
    noData() {
      return (
        !this.res1.res && !this.res2.res && !this.res3.res && !this.res4.res
      );
    },
    title() {
      let list = [];
      _.forEach(this.echartsList, (item) => {
        list.push(item.title);
      });
      return list;
    },
  },
  methods: {
    async selectChange1(value) {
      this.ypph_guifanname = value;
      Store.commit('Yyxs/ypph_guifanname', this.ypph_guifanname);
      Store.commit('Yyxs/param', { ...this.param, ypph_guifanname: this.ypph_guifanname });
      await this.loadData();
    },
    async selectChange2(value) {
      this.qyph_guifanqiye = value;
      Store.commit('Yyxs/qyph_guifanqiye', this.qyph_guifanqiye);
      Store.commit('Yyxs/param', { ...this.param, qyph_guifanqiye: this.qyph_guifanqiye });
      await this.loadData();
    },
    async selectChange3(value) {
      this.ppph_guifan = value;
      Store.commit('Yyxs/ppph_guifan', this.ppph_guifan);
      Store.commit('Yyxs/param', { ...this.param, ppph_guifan: this.ppph_guifan });
      await this.loadData();
    },
    async exportHandler(index, subIndex) {
      this.analyLoading = true;
      let moduleName = "",
        unit = "万",
        outdata_action = this.echartsList[index].api,
        title = "";
      switch (outdata_action) {
        case "atc":
          title = "分类名称";
          moduleName = !(this.$route.query.type == 2)
            ? "ATC分类销售额"
            : "ATC分类销售量";
          break;
        case "ndph":
          title = "年份";
          moduleName = !(this.$route.query.type == 2)
            ? "年度销售额"
            : "年度销售量";
          break;
        case "ppph":
          title = "品牌名称";
          moduleName = !(this.$route.query.type == 2)
            ? "品牌销售额排行"
            : "品牌销售量排行";
          break;
        case "qyph":
          title = "企业名称";
          moduleName = !(this.$route.query.type == 2)
            ? "企业销售额排行"
            : "企业销售量排行";
          break;
        case "ypph":
          title = "药品名称";
          moduleName = !(this.$route.query.type == 2)
            ? "药品销售额排行"
            : "药品销售量排行";
          break;
      }
      let outdata_column = !(this.$route.query.type == 2)
        ? `field=${title},sale=销售额（${unit}元）`
        : `field=${title},sale=销售额（${unit}）`;
      // 特殊：医疗机构销售额
      if (index === 4) {
        moduleName = !(this.$route.query.type == 2)
          ? "医疗机构销售额"
          : "医疗机构销售量";
        // 占比统计
        if (subIndex === 0) {
          outdata_action = "djfb_xszb";
          outdata_column = `field=医院等级,sale=销售数据占比`;
        } else if (subIndex === 1) {
          outdata_action = "djfb_xse";
          // 数据统计
          outdata_column = !(this.$route.query.type == 2)
            ? `field=医院等级,sale=销售额（万元）`
            : `field=医院等级,sale=销售量（万）`;
        }
      }
      let temParam = {
        moduleName,
        outdata_column,
        outdata_action,
        amount_type: 1,
      };
      if (['ypph', 'ppph', 'qyph'].includes(outdata_action)) {
        temParam = _.assign(temParam, this.param);
      }
      const res = await Store.dispatch("Yyxs/exportAsExcel", temParam);
      setTimeout(() => {
        this.analyLoading = false;
      }, 1000);
    },
    getImgName(i) {
      return `药智数据企业版-${document.title}-智能分析-${this.echartsList[i].title}`;
    },
    //统一转换单位
    unitChange(data, key) {
      key = key || "sale";
      let isBillion = this.isBillion(data, key);
      if (isBillion) {
        _.forEach(data, (item) => {
          item[key] = item[key] / 10000;
        });
      }
      return data;
    },
    //判断是否需要转换单位
    isBillion(data, key) {
      key = key || "sale";
      let isBillion = false;
      _.forEach(data, (item) => {
        let num = parseFloat(item[key]);
        if (num >= 10000) {
          isBillion = true;
        }
      });
      return isBillion;
    },
    initLayout() {
      let inner_width = window.innerWidth;
      this.echartsOpenWidth = inner_width - 310;
    },
    loadData: _.debounce(function () {
      this.analyLoading = true;
      this.echartsListOpen = _.cloneDeep(this.echartsList);
      // 加载 aggs API的数量总计
      this.promise = Store.dispatch(
        "Yyxs/getKshRes",
        this.$route.query.type == 2 ? 2 : 1
      ).then((res) => {
        this.update(res);
        return res;
      });
      setTimeout(() => {
        this.analyLoading = false;
      }, 2000);
    }, 10),
    handleCloseIndex() {
      let i = this.openIndex,
        id = "echarts" + i.toString(),
        chart = Echarts.getInstanceByDom(document.getElementById(id)),
        type = this.tempType[i],
        option = {},
        data = this.tempData[i];
      if (chart) {
        chart.clear();
      } else {
        chart = Echarts.init(document.getElementById(id));
      }
      if (this.echartsList[i].api == "atc") {
        type = "pie";
      }
      if (type == "pie") {
        let { pie_data, yAxis_data, series_data } = data;
        option = this.drawPieEcharts(i, pie_data, yAxis_data, series_data);
        option.toolbox.feature.myMagnify.show = true;
        option.tooltip.formatter = (params) => {
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            "销售额（亿元）: " +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      } else if (type == "doughnut") {
        let { pie_data, yAxis_data, series_data } = data;
        option = this.drawDoughnutEcharts(i, pie_data, yAxis_data, series_data);
      } else if (type == "bar") {
        let { yAxis_data, series_data } = data;
        yAxis_data = yAxis_data.reverse();
        series_data = series_data.reverse();
        option = this.drawBarEchartsY(i, yAxis_data, series_data);
        option.toolbox.feature.myMagnify.show = true;
        option.tooltip.formatter = (params) => {
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            (!(this.$route.query.type == 2)
              ? "销售额（亿元）: "
              : "销售量（亿）: ") +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      } else if (type == "barLine") {
        let { xAxis_data, series_data } = data,
          api = this.echartsList[i].api,
          bar = {
            type: "bar",
            name: !(this.$route.query.type == 2)
              ? "销售额（万元）: "
              : "销售量（万）: ",
            data: [],
            label: {
              show: true,
              position: "top",
              color: "#333",
              formatter: (data) => {
                return this.echartsTooltipMoney(data.value);
              },
            },
          },
          rate = [],
          xkey = this.echartsList[i].xkey,
          barKey = this.echartsList[i].barKey,
          line = {
            type: "line",
            name: "同比（%）",
            yAxisIndex: 1,
            data: [],
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: (val) => {
                return val.value + "%";
              },
            },
          },
          isBillion = this.isBillion(originalData, this.echartsList[i].skey),
          originalData = [];
        if (i !== 3) {
          originalData = this.unitChange(
            this.tempTotalData[api],
            this.echartsList[i].skey
          );
        }
        // this.echartsList[i].isBillion = isBillion;
        if (api === "ndph") {
          this.tempTotalData[api].forEach((item) => {
            xAxis_data.push(item[xkey]);
            bar.data.push(item[barKey]);
            rate.push(item[barKey]);
          });
        }
        if (api === "ndph") {
          bar.data.reverse();
          let _rate = rate.reverse();
          line.data = this.rateFn(_rate);
          xAxis_data = xAxis_data.reverse();
          series_data = [bar, line];
        }
        option = this.drawBarLineEcharts(i, xAxis_data.reverse(), [bar, line]);
        option.toolbox.feature.myMagnify.show = true;
        option.tooltip.formatter = (params) => {
          let unit = this.echartsList[i].isBillion ? "亿" : "万";
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            "销售额（" + unit + "元）: " +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      }
      chart.setOption(option);
      this.dialogVisible = false;
    },
    handleOpenIndex(i, data, isMenuClick = false) {
      if (i > 0 && i < this.echartsList.length) {
        this.openIndex = i;
      } else {
        this.openIndex = 0;
      }
      if (isMenuClick == true) {
        data = this.tempData[i];
      }
      let id = "open-echarts" + i.toString(),
        chart = Echarts.getInstanceByDom(document.getElementById(id)),
        type = this.tempType[i],
        option = {};
      if (chart) {
        chart.clear();
      } else {
        chart = Echarts.init(document.getElementById(id));
      }
      if (this.echartsList[i].api == "atc") {
        type = "pie";
      }
      if (type == "pie") {
        let { pie_data, yAxis_data, series_data } = data;
        option = this.drawPieEcharts(i, pie_data, yAxis_data, series_data);
        option.toolbox.feature.myMagnify.show = false;
        option.tooltip.formatter = (params) => {
          let unit = this.echartsList[i].isBillion ? "亿" : "万";
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            "销售额（" + unit + "元）: " +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      } else if (type == "bar") {
        let { yAxis_data, series_data } = data;
        yAxis_data = yAxis_data.reverse();
        series_data = series_data.reverse();
        option = this.drawBarEchartsY(i, yAxis_data, series_data);
        option.toolbox.feature.myMagnify.show = false;
        option.tooltip.formatter = (params) => {
          let unit = this.echartsList[i].isBillion ? "亿" : "万";
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            (!(this.$route.query.type == 2)
              ? "销售额（" + unit + "元）: "
              : "销售量（" + unit + "）: ") +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      } else if (type == "doughnut") {
        let { pie_data, yAxis_data, series_data } = data;
        option = this.drawDoughnutEcharts(i, pie_data, yAxis_data, series_data);
      } else if (type == "barLine") {
        let unit = this.echartsList[i].isBillion ? "亿" : "万";
        let { xAxis_data, series_data } = data,
          api = this.echartsList[i].api,
          bar = {
            type: "bar",
            name: !(this.$route.query.type == 2)
              ? "销售额（" + unit + "元）: "
              : "销售量（" + unit + "）: ",
            data: [],
            label: {
              show: true,
              position: "top",
              color: "#333",
              formatter: (data) => {
                return this.echartsTooltipMoney(data.value);
              },
            },
          },
          rate = [],
          xkey = this.echartsList[i].xkey,
          barKey = this.echartsList[i].barKey,
          line = {
            type: "line",
            name: "同比（%）",
            yAxisIndex: 1,
            data: [],
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: (val) => {
                return val.value + "%";
              },
            },
          },
          isBillion = this.isBillion(originalData, this.echartsList[i].skey),
          originalData = [];
        if (i !== 3) {
          originalData = this.unitChange(
            this.tempTotalData[api],
            this.echartsList[i].skey
          );
        }
        // this.echartsList[i].isBillion = isBillion;
        if (api === "ndph") {
          this.tempTotalData[api].forEach((item) => {
            xAxis_data.push(item[xkey]);
            bar.data.push(item[barKey]);
            rate.push(item[barKey]);
          });
        }
        if (api === "ndph") {
          bar.data.reverse();
          let _rate = rate.reverse();
          line.data = this.rateFn(_rate);
          xAxis_data = xAxis_data.reverse();
          series_data = [bar, line];
        }
        option = this.drawBarLineEcharts(i, xAxis_data.reverse(), [bar, line]);
        option.toolbox.feature.myMagnify.show = false;
        option.tooltip.formatter = (params) => {
          let unit = this.echartsList[i].isBillion ? "亿" : "万";
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            (!(this.$route.query.type == 2)
              ? "销售额（" + unit + "元）: "
              : "销售量（" + unit + "）: ") +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      }
      chart.setOption(option);
    },
    update(res) {
      _.forEach(res, (item, key) => {
        _.forEach(this.echartsList, (items, i) => {
          if (key === items.api) {
            this.echartsData(key, i);
          }
        });
      });
    },
    //初始化全屏图形
    initOpendKsh(index, data) {
      this.dialogVisible = true;
      this.handleOpenIndex(index, data);
    },
    // 统一处理echarts数据
    echartsData(key, i) {
      let originalData = this.kshRes.view[key];
      this.tempTotalData[this.echartsList[i].api] = originalData;
      if (key === "djfb_xse") {
        this.tempTotalData[key] = this.kshRes.view[key];
        this.echartsList[i].isBillion = isBillion;
      }
      let eitem = this.echartsList[i];
      let api = eitem.api;
      let yAxis_data = [];
      let series_data = [];
      let xAxis_data = [];
      let pie_data = [];
      let _len = 0;
      let ykey = eitem.ykey;
      let skey = eitem.skey;
      let xkey = eitem.xkey;
      let barKey = eitem.barKey;
      let lineKey = eitem.lineKey;
      let rate = [];
      let bar = {
        type: "bar",
        name: "销售额（万元）: ",
        data: [],
        label: {
          show: true,
          position: "top",
          color: "#333",
          formatter: (data) => {
            return this.echartsTooltipMoney(data.value);
          },
        },
      };
      let line = {
        type: "line",
        name: "同比（%）",
        yAxisIndex: 1,
        data: [],
        label: {
          show: true,
          position: "right",
          color: "#333",
          formatter: (val) => {
            return val.value + "%";
          },
        },
      };
      if (typeof originalData != "undefined") {
        let isBillion = this.isBillion(originalData, eitem.skey);
        originalData = this.unitChange(originalData, eitem.skey);
        eitem.isBillion = isBillion;
        _len = originalData.length;
        for (var j = 0; j < _len; j++) {
          let item = originalData[j];
          if (api === "ndph") {
            xAxis_data.push(item[xkey]);
            bar.data.push(item[barKey]);
            rate.push(item[barKey]);
          } else {
            yAxis_data.push(item[ykey]);
            series_data.push(Number(item[skey]));
            pie_data.push({ value: Number(item[skey]), name: item[ykey] });
          }
        }
        let option;
        if (api === "ndph") {
          bar.data.reverse();
          let _rate = rate.reverse();
          line.data = this.rateFn(_rate);
          option = this.drawBarLineEcharts(i, xAxis_data.reverse(), [
            bar,
            line,
          ]);
        } else if (api === "atc") {
          option = this.drawPieEcharts(i, pie_data, yAxis_data, series_data);
        } else if (api === "djfb_xszb") {
          this.tempType[i] = "doughnut";
          this.specType = 0;
          option = this.drawDoughnutEcharts(
            i,
            pie_data,
            yAxis_data,
            series_data
          );
        } else {
          option = this.drawBarEchartsY(i, yAxis_data, series_data);
        }
        this.echartsList[i].option = _.cloneDeep(option);
        this.echartsListOpen[i].option = _.cloneDeep(option);
        this.echartsListOpen[i].option.toolbox.feature.myMagnify.show = false;
        this.echartsListOpen[i].option.tooltip.formatter = (params) => {
          let unit = this.echartsList[i].isBillion ? "亿" : "万";
          return (
            (_.isArray(params) ? params[0].name : params.name) +
            "<br/>" +
            "销售额（" + unit + "元）: " +
            this.echartsTooltipMoney(
              _.isArray(params) ? params[0].value : params.value
            )
          );
        };
        this.echartsListOpen[i].option.series[0].label.formatter = (data) => {
          return this.echartsTooltipMoney(data.value);
        };
      }
      this.getAtc();
    },

    getAtc() {
      this.atcsSel = false;
      _.forEach(this.conditions, (item) => {
        if (item.name === "atc") {
          if (item.atcs_sel) {
            this.atcsSel = true;
          }
        }
      });
    },

    //计算增长率
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

    //横向柱状图
    drawBarEchartsY(i, yAxis_data, series_data) {
      let pie_data = [];
      const that = this;
      if (i !== 4) {
        yAxis_data.length > 0 &&
          yAxis_data.forEach((item, i) => {
            pie_data.push({
              name: item,
              value: series_data[i],
            });
          });
        yAxis_data = [];
        series_data = [];
        this.tempTotalData[this.echartsList[i].api].forEach((item) =>
          yAxis_data.push(item.number + "-" + item.field)
        );
        this.tempTotalData[this.echartsList[i].api].forEach((item) =>
          series_data.push(item.sale)
        );
        yAxis_data = yAxis_data.reverse();
        series_data = series_data.reverse();
      } else {
        series_data = series_data.reverse();
        yAxis_data = yAxis_data.reverse();
      }
      let otherIndex =
        yAxis_data && yAxis_data.findIndex((item, i) => item.includes("-其他"));
      if (otherIndex > -1) {
        yAxis_data.splice(otherIndex, 1);
        series_data.splice(otherIndex, 1);
      }
      this.tempTitle[i] = this.titles[i] + "(TOP100)";
      this.tempData[i] = { yAxis_data, series_data };
      this.tempType[i] = "bar";
      let unit = this.echartsList[i].isBillion ? "亿" : "万",
        startValue = series_data.length - 10,
        endValue = series_data.length - 1;
      if (series_data.length < 10) {
        startValue = 0;
        endValue = series_data.length - 1;
      }
      let obj = {
        tooltip: {
          position: (point, params, dom, rect, size) => {
            return this.echartsTooltipPositionX(point, params, dom, rect, size);
          },
          trigger: "axis",
          formatter: (params) => {
            return (
              params[0].name +
              "<br/>" +
              (!(this.$route.query.type == 2) ? "销售额（" : "销售量（") +
              unit +
              (!(this.$route.query.type == 2) ? "元）: " : "）:") +
              this.echartsTooltipMoney(params[0].value)
            );
          },
        },
        dataZoom: [
          {
            show: series_data.length > 10,
            startValue,
            endValue,
            width: "35",
            showDetail: false,
            yAxisIndex: 0,
            left: 20,
          },
        ],
        toolbox: {
          feature: {
            saveAsImage: {
              show: false,
            },
            myExport: {
              title: "导出",
              icon: "image:///static/imgs/echarts/download.png",
              onclick: () => {
                if (i !== 4) {
                  that.exportHandler(i);
                } else {
                  that.exportHandler(4, that.specType);
                }
              },
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/screen.png",
              onclick: () => {
                let specType = that.specType == 0 ? "djfb_xszb" : "djfb_xse",
                  yAxis_data = that.tempTotalData[specType]
                    .map((item) => item.field)
                    .reverse(),
                  series_data = that.tempTotalData[specType]
                    .map((item) => item.sale)
                    .reverse();
                that.initOpendKsh(i, { yAxis_data, series_data });
              },
            },
          },
        },
        grid: {
          containLabel: true,
          left: yAxis_data.length > 10 ? -40 : -30,
          right: "100px",
        },
        yAxis: {
          type: "category",
          axisLabel: {
            margin: 110,
            textStyle: {
              align: "left",
            },
            formatter: (value) => {
              let text = "";
              if (value.length > 9) {
                text = value.substring(0, 9) + "...";
              } else {
                text = value;
              }
              return text;
            },
          },
          data: yAxis_data,
        },
        xAxis: {
          type: "value",
          name: !(this.$route.query.type == 2)
            ? `销售额（${unit}元）`
            : `销售量（${unit}）`,
          axisLabel: {
            formatter: (value) => {
              return this.echartsUnitTransform(value);
            },
          },
        },
        series: [
          {
            data: series_data,
            type: "bar",
            label: {
              show: true,
              position: "right",
              color: "#333",
              formatter: (data) => {
                return this.echartsTooltipMoney(data.value);
              },
            },
          },
        ],
      };
      if (i < this.echartsList.length - 1) {
        if (i === 4) {
          let myToggleDoughnut = {
            show: true,
            title: "占比统计",
            icon: "image:///static/imgs/echarts/doughnut.png",
            onclick: () => {
              that.specType = 0;
              that.tempType[i] = "doughnut";
              let id = that.id + i.toString();
              let chart = Echarts.getInstanceByDom(document.getElementById(id));
              chart.clear();
              chart = Echarts.init(document.getElementById(id));
              let series_data2 = that.tempTotalData["djfb_xszb"].map((item) =>
                Number(item.sale)
              ),
                yAxis_data2 = that.tempTotalData["djfb_xszb"].map(
                  (item) => item.field
                ),
                pie_data2 = [];
              that.tempTotalData["djfb_xszb"].forEach((item) => {
                pie_data2.push({ value: Number(item.sale), name: item.field });
              });
              let option = that.drawDoughnutEcharts(
                i,
                pie_data2,
                yAxis_data2,
                series_data2
              );
              option.toolbox.feature.myTogglePie = false;
              option.series[0].data = pie_data2;
              if (that.dialogVisible) {
                that.echartsListOpen[i].option = _.cloneDeep(option);
                that.echartsListOpen[
                  i
                ].option.toolbox.feature.myMagnify.show = false;
                that.echartsListOpen[i].option.tooltip.formatter = (params) => {
                  return params.name + "：" + params.value + "%";
                };
                that.echartsListOpen[i].option.series[0].label.formatter = (
                  data
                ) => {
                  return that.echartsTooltipMoney(data.value);
                };
              } else {
                that.echartsList[i].option = _.cloneDeep(option);
                if (
                  that.echartsListOpen[i].option.toolbox.feature.myTogglePie
                ) {
                  that.echartsListOpen[
                    i
                  ].option.toolbox.feature.myTogglePie.show = false;
                }
                that.echartsList[i].option.tooltip.formatter = (params) => {
                  return params.name + "：" + params.value + "%";
                };
              }
            },
          };
          let { saveAsImage, myExport, myMagnify } = obj.toolbox.feature;
          obj.toolbox.feature = {
            saveAsImage,
            myToggleDoughnut,
            myExport,
            myMagnify,
          };
        } else {
          let myTogglePie = {
            show: true,
            title: "饼形图",
            icon: "image:///static/imgs/echarts/pie.png",
            onclick: () => {
              that.tempType[i] = "pie";
              let id = that.id + i.toString();
              let chart = Echarts.getInstanceByDom(document.getElementById(id));
              if (chart) {
                chart.clear();
              } else {
                chart = Echarts.init(document.getElementById(id));
              }
              let ykey = this.echartsList[i].ykey,
                skey = this.echartsList[i].skey;
              yAxis_data = [];
              series_data = [];
              pie_data = [];
              this.tempTotalData[this.echartsList[i].api].forEach((item) => {
                yAxis_data.push(item[ykey]);
                series_data.push(item[skey]);
                pie_data.push({ value: item[skey], name: item[ykey] });
              });
              let option = that.drawPieEcharts(
                i,
                pie_data,
                yAxis_data,
                series_data
              );
              if (that.dialogVisible) {
                that.echartsListOpen[i].option = _.cloneDeep(option);
                that.echartsListOpen[
                  i
                ].option.toolbox.feature.myMagnify.show = false;
                that.echartsListOpen[i].option.tooltip.formatter = (params) => {
                  return (
                    (_.isArray(params) ? params[0].name : params.name) +
                    "<br/>" +
                    (!(this.$route.query.type == 2)
                      ? "销售额（亿元）: "
                      : "销售量（亿）: ") +
                    that.echartsTooltipMoney(
                      _.isArray(params) ? params[0].value : params.value
                    )
                  );
                };
                that.echartsListOpen[i].option.series[0].label.formatter = (
                  data
                ) => {
                  return that.echartsTooltipMoney(data.value);
                };
              } else {
                that.echartsList[i].option = _.cloneDeep(option);
                if (
                  that.echartsListOpen[i].option.toolbox.feature.myToggleLine
                ) {
                  that.echartsListOpen[
                    i
                  ].option.toolbox.feature.myToggleLine.show = false;
                }
              }
            },
          };
          let { saveAsImage, myExport, myMagnify } = obj.toolbox.feature;
          obj.toolbox.feature = {
            saveAsImage,
            myTogglePie,
            myExport,
            myMagnify,
          };
        }
      }
      return obj;
    },

    //柱状图&折线图混合
    drawBarLineEcharts(i, xAxis_data, series_data) {
      const that = this;
      let unit = this.echartsList[i].isBillion ? "亿" : "万",
        api = this.echartsList[i].api,
        bar = {
          type: "bar",
          name: !(this.$route.query.type == 2)
            ? "销售额（" + unit + "元）"
            : "销售量（" + unit + "）",
          data: [],
          label: {
            show: true,
            position: "top",
            color: "#333",
            formatter: (data) => {
              return this.echartsTooltipMoney(data.value);
            },
          },
        },
        rate = [],
        xkey = this.echartsList[i].xkey,
        barKey = this.echartsList[i].barKey,
        line = {
          type: "line",
          name: "同比（%）",
          yAxisIndex: 1,
          data: [],
          label: {
            show: true,
            position: "right",
            color: "#333",
            formatter: (val) => {
              return val.value + "%";
            },
          },
        },
        isBillion = this.isBillion(originalData, this.echartsList[i].skey),
        originalData = [],
        yAxisName = !(this.$route.query.type == 2)
          ? `销售额（${unit}元）`
          : `销售量（${unit}）`;
      if (i !== 3) {
        originalData = this.unitChange(
          this.tempTotalData[api],
          this.echartsList[i].skey
        );
      }
      xAxis_data = [];
      bar.data = [];
      // this.echartsList[i].isBillion = isBillion;
      if (api === "ndph") {
        this.tempTotalData[api].forEach((item) => {
          xAxis_data.push(item[xkey]);
          bar.data.push(item[barKey]);
          rate.push(item[barKey]);
        });
      }
      if (api === "ndph") {
        bar.data.reverse();
        let _rate = rate.reverse();
        line.data = this.rateFn(_rate);
        xAxis_data = xAxis_data.reverse();
        series_data = [bar, line];
      }
      this.tempData[i] = { xAxis_data, series_data };
      this.tempType[i] = "barLine";
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let str = params[0].name + "<br>";
            _.map(params, (item) => {
              if (item.seriesType == "bar") {
                str +=
                  '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                  item.color +
                  '"></span>' +
                  (!(this.$route.query.type == 2) ? "销售额（" : "销售量（") +
                  unit +
                  (!(this.$route.query.type == 2) ? "元）: " : "）:") +
                  this.echartsTooltipMoney(item.value) +
                  "<br>";
              } else if (item.seriesType == "line" && item.value) {
                str +=
                  '<span style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;margin-right:5px; background-color:' +
                  item.color +
                  '"></span>' +
                  "同比（%）: " +
                  item.value +
                  "<br>";
              }
            });
            return str;
          },
        },
        grid: {
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false,
            },
            myExport: {
              show: true,
              title: "导出",
              icon: "image:///static/imgs/echarts/download.png",
              onclick: () => {
                that.exportHandler(i);
              },
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/screen.png",
              onclick: () => {
                that.initOpendKsh(i, { xAxis_data, series_data });
              },
            },
          },
        },
        legend: {
          data: [
            {
              name: !(this.$route.query.type == 2)
                ? `销售额（${unit}元）`
                : `销售量（${unit}）`,
              icon: "circle",
            },
            {
              name: "同比（%）",
            },
          ],
          bottom: 20,
        },
        xAxis: [
          {
            type: "category",
            data: xAxis_data,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: yAxisName,
            axisLabel: {
              formatter: (value) => {
                return this.echartsUnitTransform(value);
              },
            },
          },
          {
            type: "value",
            name: "同比（%）",
            axisLabel: {
              formatter: (value) => {
                return value + "%";
              },
            },
          },
        ],
        series: series_data,
      };
      return option;
    },
    // 环形图
    drawDoughnutEcharts(i, data, yAxis_data, series_data) {
      let unit = "%",
        pie_data = [],
        api = this.echartsList[i].api,
        ykey = this.echartsList[i].ykey,
        skey = this.echartsList[i].skey;
      const that = this;
      // yAxis_data.length > 0 &&
      //   yAxis_data.forEach((item, i) => {
      //     pie_data.push({
      //       name: item,
      //       value: series_data[i]
      //     });
      //   });
      yAxis_data = [];
      series_data = [];
      pie_data = [];
      this.tempTotalData[api].forEach((item) => {
        yAxis_data.push(item[ykey]);
        series_data.push(item[skey]);
        pie_data.push({ value: Number(item[skey]), name: item[ykey] });
      });
      this.tempTitle[i] = this.titles[i] + "(TOP10)";
      this.tempData[i] = { pie_data, yAxis_data, series_data };
      this.tempType[i] = "doughnut";
      let obj = {
        toolbox: {
          feature: {
            saveAsImage: {
              show: false,
            },
            myToggleBar: {
              show: true,
              title: "数据统计",
              icon: "image:///static/imgs/echarts/bar-horizontal.png",
              onclick: () => {
                that.tempType[i] = "bar";
                that.specType = 1;
                let id = that.id + i.toString(),
                  unit = "亿";
                let chart = Echarts.getInstanceByDom(
                  document.getElementById(id)
                );
                chart.clear();
                chart = Echarts.init(document.getElementById(id));
                let series_data2 = that.tempTotalData["djfb_xse"].map(
                  (item) => item.sale
                ),
                  yAxis_data2 = that.tempTotalData["djfb_xse"].map(
                    (item) => item.field
                  );
                let option = that.drawBarEchartsY(i, yAxis_data2, series_data2);
                option.xAxis.name = !(this.$route.query.type == 2)
                  ? `销售额（亿元）`
                  : `销售量（亿）`;
                option.toolbox.feature.myTogglePie = false;
                option.series[0].data = series_data2;
                if (that.dialogVisible) {
                  that.echartsListOpen[i].option = _.cloneDeep(option);
                  that.echartsListOpen[
                    i
                  ].option.toolbox.feature.myMagnify.show = false;
                  that.echartsListOpen[i].option.tooltip.formatter = (
                    params
                  ) => {
                    let value = Number(
                      _.isArray(params) ? params[0].value : params.value
                    );
                    return (
                      (_.isArray(params) ? params[0].name : params.name) +
                      "<br/>" +
                      (!(this.$route.query.type == 2)
                        ? `销售额（${unit}元）: `
                        : `销售量（${unit}）: `) +
                      that.echartsTooltipMoney(value)
                    );
                  };
                  that.echartsListOpen[i].option.series[0].label.formatter = (
                    data
                  ) => {
                    return that.echartsTooltipMoney(data.value);
                  };
                } else {
                  that.echartsList[i].option = _.cloneDeep(option);
                  if (
                    that.echartsListOpen[i].option.toolbox.feature.myTogglePie
                  ) {
                    that.echartsListOpen[
                      i
                    ].option.toolbox.feature.myTogglePie.show = false;
                  }
                  that.echartsList[i].option.tooltip.formatter = (params) => {
                    let value = Number(
                      _.isArray(params) ? params[0].value : params.value
                    );
                    return (
                      (_.isArray(params) ? params[0].name : params.name) +
                      "<br/>" +
                      (!(this.$route.query.type == 2)
                        ? `销售额（${unit}元）: `
                        : `销售量（${unit}）: `) +
                      that.echartsTooltipMoney(value)
                    );
                  };
                }
              },
            },
            myExport: {
              title: "导出",
              icon: "image:///static/imgs/echarts/download.png",
              onclick: () => {
                if (i !== 4) {
                  that.exportHandler(i);
                } else {
                  that.exportHandler(4, that.specType);
                }
              },
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/screen.png",
              onclick: () => {
                that.initOpendKsh(i, { pie_data, yAxis_data, series_data });
              },
            },
          },
        },
        legend: {
          type: "scroll",
          bottom: 0,
          data,
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return params.name + "：" + params.value + unit;
          },
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "75%"],
            data,
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: (value) => {
                  if (value.name.length > 9) {
                    return (
                      value.name.substring(0, 9) + "..." + value.percent + "%"
                    );
                  } else {
                    return value.name + value.percent + "%";
                  }
                },
                color: "#606266",
              },
            },
            itemStyle: {},
          },
        ],
      };
      return obj;
    },
    //饼图
    drawPieEcharts(i, data, yAxis_data, series_data) {
      let unit = this.echartsList[i].isBillion ? "亿" : "万",
        pie_data = [],
        api = this.echartsList[i].api,
        ykey = this.echartsList[i].ykey,
        skey = this.echartsList[i].skey;
      const that = this;
      // yAxis_data.length > 0 &&
      //   yAxis_data.forEach((item, i) => {
      //     pie_data.push({
      //       name: item,
      //       value: series_data[i]
      //     });
      //   });
      yAxis_data = [];
      series_data = [];
      pie_data = [];
      this.tempTotalData[api].forEach((item) => {
        yAxis_data.push(item[ykey]);
        series_data.push(item[skey]);
        pie_data.push({ value: item[skey], name: item[ykey] });
      });
      this.tempTitle[i] = this.titles[i] + "(TOP10)";
      this.tempData[i] = { pie_data, yAxis_data, series_data };
      this.tempType[i] = "pie";
      let pies = data;
      if (data.length > 10) {
        pies = [...data.slice(0, 10), data[data.length - 1]];
      }
      let obj = {
        toolbox: {
          feature: {
            saveAsImage: {
              show: false,
            },
            myExport: {
              title: "导出",
              icon: "image:///static/imgs/echarts/download.png",
              onclick: () => {
                that.exportHandler(i);
              },
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/screen.png",
              onclick: () => {
                that.initOpendKsh(i, { pie_data, yAxis_data, series_data });
              },
            },
          },
        },
        legend: {
          type: "scroll",
          bottom: 0,
          data:
            api == "atc" ? data : data.slice(0, 10).map((item) => item.name),
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return (
              params.name +
              "<br/>" +
              (!(this.$route.query.type == 2) ? "销售额（" : "销售量（") +
              unit +
              (!(this.$route.query.type == 2) ? "元）: " : "）: ") +
              this.echartsTooltipMoney(params.value)
            );
          },
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: api == "atc" ? data : pies,
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: (value) => {
                  if (value.name.length > 9) {
                    return (
                      value.name.substring(0, 9) + "..." + value.percent + "%"
                    );
                  } else {
                    return value.name + value.percent + "%";
                  }
                },
                color: "#606266",
              },
            },
            itemStyle: {},
          },
        ],
      };
      if (i < this.echartsList.length - 1) {
        let myToggleLine = {
          show: true,
          title: "柱状图",
          icon: "image:///static/imgs/echarts/bar.png",
          onclick: () => {
            that.tempType[i] = "bar";
            let id = that.id + i.toString();
            let chart = Echarts.getInstanceByDom(document.getElementById(id));
            if (chart) {
              chart.clear();
            } else {
              chart = Echarts.init(document.getElementById(id));
            }
            let option = that.drawBarEchartsY(i, yAxis_data, series_data);
            if (that.dialogVisible) {
              that.echartsListOpen[i].option = _.cloneDeep(option);
              that.echartsListOpen[
                i
              ].option.toolbox.feature.myMagnify.show = false;
              that.echartsListOpen[i].option.tooltip.formatter = (params) => {
                return (
                  (_.isArray(params) ? params[0].name : params.name) +
                  "<br/>" +
                  (!(this.$route.query.type == 2)
                    ? "销售额（亿元）: "
                    : "销售量（亿）: ") +
                  that.echartsTooltipMoney(
                    _.isArray(params) ? params[0].value : params.value
                  )
                );
              };
              that.echartsListOpen[i].option.series[0].label.formatter = (
                data
              ) => {
                return that.echartsTooltipMoney(data.value);
              };
            } else {
              that.echartsList[i].option = _.cloneDeep(option);
              if (that.echartsListOpen[i].option.toolbox.feature.myTogglePie) {
                that.echartsListOpen[
                  i
                ].option.toolbox.feature.myTogglePie.show = false;
              }
            }
          },
        };
        let { saveAsImage, myExport, myMagnify } = obj.toolbox.feature;
        obj.toolbox.feature = {
          saveAsImage,
          myToggleLine,
          myExport,
          myMagnify,
        };
      }
      return obj;
    },
    echartsResizeHandler() {
      if (this.dialogVisible) {
        this.initLayout();
      }
      this.$nextTick(() => {
        this.echartsResize("echart");
      });
    },
    // Vuex内存储的搜索条件和页面内的对比，返回状态
    diffSearchData() {
      const currentSearchData = {
        putong: this.putong,
        gaoji: this.gaoji,
        shaixuan: this.shaixuan,
        fourth: this.fourth,
      };
      const currentJson = JSON.stringify(currentSearchData);
      const localJson = JSON.stringify(this.searchState);
      if (currentJson != localJson) {
        this.searchState = currentSearchData;
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.$nextTick(() => {
      this.initLayout();
      this.loadData();
      this.titles.forEach((item, i) => {
        this.tempTitle[i] = this.titles[i] + "(TOP100)";
      });
    });
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    $(".select-sort .el-input__inner").attr("UNSELECTABLE", 'on')
    window.addEventListener("resize", this.echartsResizeHandler);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.ksh);
    if (this.diffSearchData()) {
      this.loadData();
    }
    // ;
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
  },
};
</script>

<style lang="less">
.nodata,
.nodata-box {
  width: 100%;
  height: 100%;
  background: url(/static/imgs/nodata.png) center center no-repeat;
}

.fullcharts.nodata-box {
  position: absolute;
  top: 40px;
  height: calc(100vh - 40px - 48px - 80px);
  background: #fff;
}

@import "~@/assets/less/var.less";

.shengwuzhipin-analy {

  .select-sort {
    width: 108px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #4877E8;
    margin: 5px 10px 5px 0 !important;

    .el-input--mini .el-input__inner {
      padding: 0 10px;
      font-size: 12px;
      font-weight: 400;
      color: #4877E8;
    }

    .el-select .el-input.is-focus .el-input__inner,
    input.el-input__inner {
      border: none;
    }

    .el-input__inner {
      background: transparent;
    }
  }

  .el-select .el-input .el-select__caret {
    color: #4877E8 !important;
  }

  .totals {
    // margin-top:20px!important;
    height: 86px;
    background-color: @White;
    // box-shadow: @BoxShadow;
    display: flex;
    justify-content: space-between;
    border-radius: 0 0 4px 4px;
    overflow: hidden;

    .total-item {
      display: inline-block;
      width: 20%;
      min-width: 127px;
      text-align: center;
      vertical-align: text-bottom;
      border-bottom: 3px solid @White;

      &:hover {
        color: @PrimaryColor;
        background-color: #eff2fa;
        border-bottom: 3px solid @PrimaryColor;
      }

      .li1 {
        padding-top: 19px;
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
    // .chart-box {
    //   box-sizing: border-box;
    //   position: relative;
    //   display: inline-block;
    //   margin: 8px;
    //   width: calc(50% - 16px);
    //   background-color: @White;
    //   box-shadow: @BoxShadow;
    //   overflow: hidden;
    //   transition: all 300ms;
    //   canvas {
    //     width: 100%!important;
    //   }
    //   .chart-title {
    //     position: absolute;
    //     top: 0px;
    //     left: 0px;
    //     width: 100%;
    //     padding-left: 5px;
    //     line-height: 40px;
    //     background-color: @GrayBackgroundColor;
    //     border-left: 5px solid @PrimaryColor;
    //   }
    //   &:hover {
    //     transition: all 300ms;
    //   }
    // }
  }

  .echarts {
    box-sizing: border-box;
    display: inline-block;
    margin: 50px 10px 20px 10px;
    width: calc(100% - 20px);
    height: 400px;
  }

  .hide {
    display: none;
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
          box-shadow: @BoxShadow;
          color: @PrimaryColor;
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
        width: 100%;
        height: 700px;
        overflow: hidden;

        .echarts-item {
          display: inline-block;
          margin: 0px 50px;
          height: 900px;
        }

        .open-charts {
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

  .chart_top {
    background-color: #eff2fa;
    box-shadow: 0px 2px 8px 0px #D8E2FA;
    position: relative;
    border-radius: 0 0 4px 4px;
  }

  .chart_bottom {
    background-color: #eff2fa;

    .go-list {
      line-height: 30px;
      text-align: left;
      padding-right: 40px;
      font-size: 14px;
      padding: 6px 0 1px;

      a {
        width: 86px;
        height: 24px;
        line-height: 24px;
        background: #f4a622;
        border-radius: 4px;
        display: block;
        text-align: center;
        color: #fff;
      }

      a:hover {
        color: #fff;
      }
    }
  }
}

.la-main .la-right .sec2 {
  box-shadow: none;
}

/deep/.optioned {
  display: inline-flex;
  align-items: center;
  height: 40px
}

.la-optioned .optioned.main {
  display: inline-flex !important;
  align-items: center !important;
  height: 40px !important
}

.wrap-add-del {
  margin: 0 !important;
}
</style>
