<template>
  <div class="zgzcsb">
    <div class="notify">
      数据说明： 此处数据来自药品注册与受理，立即
      <a href="/zhuce/list?ga_source=vip&ga_name=globaldrugs_sjts" target="_blank"
      onclick="_paq.push(['trackEvent', 'button', 'click', '全球药物2.0_数据透视_药品注册与受理_进入数据库', ])"
      >进入数据库</a>
      查看更多数据。
    </div>
    <div class="charts" style="margin-bottom: 20px">
      <div class="chart" id="sbqs">申报趋势</div>
      <div class="chart" id="blzt"></div>
      <div class="chart" id="sqlx">申请类型</div>
      <div class="chart" id="psjl">审评结论</div>
    </div>
    <el-table v-waiting="loading" :data="datas">
      <el-table-column
        v-for="item in tableHead"
        :prop="item.field"
        :min-width="item.field_width || item.width || 150"
        :key="item.field"
        :label="item.label"
      >
        <template :slot="1 ? 'header' : ''" slot-scope="scope">
          <span>
            {{ item.label }}
          </span>
          <el-tooltip
            v-if="item.statement"
            class=""
            effect="zhuce"
            placement="right"
          >
            <div slot="content" v-html="item.statement"></div>
            <i
              class="el-icon-question cl-green"
              style="margin-left: 4px; line-height: 28px"
            ></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div :title="scope.row[item.field]">
            <div v-if="item.field === 'shoulihao'">
              <!-- <span @click="handleRss(scope.row.rss.shoulihao===1,1,scope.row.shoulihao,scope.row.name,scope.row.qiyemingcheng)" class="row-absolute" :class="scope.row.rss.shoulihao===1?'row-absolute-ok':'row-absolute-no'">{{scope.row.rss.shoulihao===1?'已订':'订阅'}}</span> -->
              <span
                v-if="vueCheckListPms('Zhuce', item.label)"
                class="cell-shoulihao-wrap"
              >
                <router-link
                  tag="a"
                  :to="{ path: '/zhuce/' + scope.row.id }"
                  class="cell-shoulihao no-underline cl-blue"
                  target="_blank"
                >
                  {{ scope.row.shoulihao }}
                </router-link>
                <!-- <div class="ytz-icons">
                  <span class="yxsp-icon" v-if="scope.row.yxsp" title="优先审评">优</span>
                  <span class="zdzx-icon" v-if="scope.row.zdzx" title="重大专项">重</span>
                  <span class="tssp-icon" v-if="scope.row.tspz" title="特殊审批">特</span>
                  <span class="icon iconfont" v-if="scope.row.yzxpj == '是'" title="一致性评价" style="font-size: 15px; color: #f77d54;line-height:15px;">&#xe686;</span>
                </div> -->
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'name'">
              <div v-if="vueCheckListPms('Zhuce', item.label)">
                <span
                  class="link-underline"
                  @click="resolveTdLink(item.field, scope.row.name)"
                  >{{ scope.row.name }}</span
                >
                <!-- <div class="zhuce-yyfz" :title="scope.row.yuanyanhuofangzhi" v-if="scope.row.yuanyanhuofangzhi">
                  {{ scope.row.yuanyanhuofangzhi }}
                </div> -->
              </div>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'zhuceleixing'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">
                {{
                  (scope.row.yaopinleixing_1 ? scope.row.yaopinleixing_1 : "") +
                  (scope.row.zhuceleixing ? scope.row.zhuceleixing : "")
                }}
              </span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'shenqingleixing_1'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.shenqingleixing_1
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'zhucebanben'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.zhucebanben
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'chengbanriqi'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.chengbanriqi
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'qiyemingcheng'">
              <span
                v-if="vueCheckListPms('Zhuce', item.label)"
                @click="resolveTdLink(item.field, scope.row.qiyemingcheng)"
                class="link-underline"
                >{{ scope.row.qiyemingcheng }}</span
              >
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'qiyelianheshenbao'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.qiyelianheshenbao
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'banlizhuangtai'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.banlizhuangtai
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'zhuangtaikaishishijian'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.zhuangtaikaishishijian
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'shenpingrenwufenlei'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.shenpingrenwufenlei
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'xuhao'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.xuhao
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'jielun'" style="width: 125px">
              <span
                v-if="vueCheckListPms('Zhuce', item.label)"
                :title="scope.row.jielun"
                :class="{
                  'bg-green-br':
                    scope.row.jielun &&
                    scope.row.jielun.indexOf('批准') === 0 &&
                    vueCheckListPms('Zhuce', item.label),
                  'bg-orange-br':
                    scope.row.jielun &&
                    scope.row.jielun.indexOf('批准') !== 0 &&
                    vueCheckListPms('Zhuce', item.label),
                }"
                >{{ scope.row.jielun }}</span
              >
              <span v-else class="abandon-click-method">暂无权限</span>
              <!-- 判断类型是否为预测状态：0(预测)、1(预测结论)、2(预测对的结论)、3(有争议的) -->
              <em
                v-if="
                  scope.row.type == '1' &&
                  scope.row.jielun != '' &&
                  vueCheckListPms('Zhuce', item.label)
                "
                class="status-fore"
                title="预测结论"
                >预</em
              >
            </div>
            <div v-else-if="item.field === 'tspz'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.tspz == 1 ? "是" : "否"
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'zdzx'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.zdzx == 1 ? "是" : "否"
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'yxsp'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.yxsp == 1 || scope.row.yxsp == 4 ? "是" : "否"
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>

            <div v-else-if="item.field === 'yxsply'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.yxsply
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>

            <div v-else-if="item.field === 'gdcf'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.gdcf
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'wftjcbzj'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.wftjcbzj == "是" ? "是" : "否"
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>

            <div v-else-if="item.field === 'tpxzl'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.tpxzl
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'zjxzsp'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.zjxzsp == 1 ? "是" : "否"
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'shengfen'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.shengfen
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'linchuangdate'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.linchuangdate
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'shenpingdate'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.shenpingdate
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
            <div v-else-if="item.field === 'targets'" :title="''">
              <template v-if="vueCheckListPms('Zhuce', item.label)">
                <TooltipBD
                  :targets="scope.row.targets"
                  :targets_abbr="scope.row.targets_abbr"
                />
              </template>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>

            <!-- 临床急需境外新药 -->
            <div v-else-if="item.field === 'lcjxjwxy'">
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row.lcjxjwxy == 2 ? "是" : "否"
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>

            <!-- 审评报告 -->
            <div v-else-if="item.field === 'report'">
              <template v-if="scope.row.report != ''">
                <span
                  class="linksBtn"
                  v-if="vueCheckListPms('Zhuce', item.label)"
                  @click="redirectNewPage(scope.row.report)"
                  >查看</span
                >
                <span v-else class="abandon-click-method">暂无权限</span>
              </template>
              <span>&nbsp;</span>
            </div>
            <!-- 说明书 -->
            <div v-else-if="item.field === 'instruct'">
              <template v-if="scope.row.instruct != ''">
                <span
                  class="linksBtn"
                  v-if="vueCheckListPms('Zhuce', item.label)"
                  @click="redirectNewPage(scope.row.instruct)"
                  >查看</span
                >
                <span v-else class="abandon-click-method">暂无权限</span>
              </template>
              <span>&nbsp;</span>
            </div>

            <!-- 适应症品种 -->
            <div v-else-if="item.field === 'indication2'" :title="''">
              <template v-if="scope.row.indication2 != ''">
                <el-tooltip
                  v-if="vueCheckListPms('Zhuce', item.label)"
                  class=""
                  effect="zhuce"
                  placement="right"
                >
                  <div slot="content" v-html="scope.row.indication2"></div>
                  <span v-html="scope.row.indication2"></span>
                </el-tooltip>

                <span v-else class="abandon-click-method">暂无权限</span>
              </template>
              <span>&nbsp;</span>
            </div>

            <!-- 适应症受理号 -->
            <div v-else-if="item.field === 'indication1'" :title="''">
              <template v-if="scope.row.indication1 != ''">
                <el-tooltip
                  v-if="vueCheckListPms('Zhuce', item.label)"
                  class=""
                  effect="zhuce"
                  placement="right"
                >
                  <div slot="content" v-html="scope.row.indication1"></div>
                  <span v-html="scope.row.indication1"></span>
                </el-tooltip>
                <span v-else class="abandon-click-method">暂无权限</span>
              </template>
              <span>&nbsp;</span>
            </div>

            <div v-else>
              <span v-if="vueCheckListPms('Zhuce', item.label)">{{
                scope.row[item.field]
              }}</span>
              <span v-else class="abandon-click-method">暂无权限</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, next"
      hide-on-single-page
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
// 中国注册申报
export default {
  name: "sjts-zgzcsb",
  props: {
    drugids: {
      default: "",
      type: String,
    },
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      activeName: "",
      tableHead: [
        {
          name: "受理号",
          key: "slh",
        },
        {
          name: "药品名称",
          key: "ypmc",
        },
        {
          name: "注册分类",
          key: "zcfl",
        },
        {
          name: "申请类型",
          key: "sqlx",
        },
        {
          name: "承办日期",
          key: "cbrq",
        },
        {
          name: "企业名称",
          key: "qymc",
        },
        {
          name: "办理状态(药智)",
          key: "blzt",
        },
        {
          name: "状态开始日期(药智)",
          key: "ztksrq",
        },
        {
          name: "审评结论",
          key: "spjl",
        },
      ],
      sbqs_chart: null,
      blzt_chart: null,
      sqlx_chart: null,
      psjl_chart: null,
      datas: [],
      page: 0,
      total: 0,
    };
  },
  methods: {
    resolveTdLink(type_id, key_word) {
      let query = {};
      query[type_id] = key_word;
      let routeData = this.$router.resolve({
        path: `/zhuce`,
        query: query,
      });
      window.open(routeData.href, "_blank");
      // window.open(`/zhuce?${type_id}=${key_word}`, "_blank");
    },
    //跳转审评报告或说明书页面
    redirectNewPage(pages) {
      window.open(pages, "_blank");
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getTableData(val);
    },
    getTableData(page = 1) {
      this.loading = true;
      // const { drugname_standard, company_standard } = this.$route.query;

      // /api/zhuce
      Axios({
        url: "/api/zhuce",
        params: {
          name1: this.drugname_standard,
          // qiyemingcheng: this.company_standard,
          // shoulihao_IN: drugids,
          page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            this.datas = res.data.data.List.res;
            this.page = res.data.data.List.page;
            this.total = res.data.data.List.count;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // /api/config/view?dbname=zhuce
    getTableConf() {
      Axios({
        url: "/api/config/view?dbname=zhuce",
      }).then((res) => {
        if (res.data.code == 200) {
          this.tableHead = res.data.data.tableconf.filter((t) => t.hidden != 1);
        }
      });
    },

    // sbqs 申报趋势图表 api/zhuce/visualizationNew
    async setSbqsLine() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          ismore: 0,
          chengbanriqiType: "year",
          action: "shenbaoshuliang",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let xAxis_data = Datas.data.data.map((item) => item.key_as_string);
        let series_data = Datas.data.data.map((item) => item.doc_count);
        this.sbqs_chart = Echarts.init(
          document.querySelector("#sbqs"),
          "westeros"
        );
        this.sbqs_chart.clear();
        let option = {
          legend: {
            show: true,
            bottom: 25,
            data: ["申报数量"],
          },
          tooltip: {
            trigger: "axis",
            position: "right",
          },
          grid: {
            containLabel: true,
            bottom: 60,
          },
          dataZoom: {
            id: "dataZoomX",
            show: true,
            startValue: xAxis_data.length - 12,
            endValue: xAxis_data.length - 1,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: "rgba(167,183,204,0.4)", // 选中的填充颜色
            left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
            top: "bottom", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
            right: "auto", // 组件离容器右侧的距离,'20%'
            bottom: "auto", // 组件离容器下侧的距离,'20%'
            height: 25, //这里可以设置dataZoom的尺寸
          },
          xAxis: {
            data: xAxis_data,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              name: "申报数量",
              type: "line",
              connectNulls: true,
              data: series_data,
            },
          ],
        };
        if (xAxis_data.length < 12) {
          delete option.dataZoom;
        }
        this.sbqs_chart.setOption(option);
      }
    },
    // blzt 办理状态图表
    async setBlztBar() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          ismore: 0,
          chengbanriqiType: "year",
          action: "guifanzhuangtaizhongwen",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let xAxis_data = Datas.data.data.map((item) => item.label);
        let series_data = Datas.data.data.map((item) => item.doc_count);
        this.blzt_chart = Echarts.init(
          document.querySelector("#blzt"),
          "westeros"
        );
        this.blzt_chart.clear();
        let option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />数量: {c}",
          },
          grid: {
            // 控制图的大小，调整下面这些值就可以，
            containLabel: true,
          },
          dataZoom: {
            id: "dataZoomX",
            show: true,
            startValue: xAxis_data.length - 3,
            endValue: xAxis_data.length - 1,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            fillerColor: "rgba(167,183,204,0.4)", // 选中的填充颜色
            left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
            top: "bottom", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
            right: "auto", // 组件离容器右侧的距离,'20%'
            bottom: "auto", // 组件离容器下侧的距离,'20%'
            height: 25, //这里可以设置dataZoom的尺寸
          },
          xAxis: {
            type: "category",
            axisLabel: {
              interval: 0,
              rotate: 30,
            },
            data: xAxis_data,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            name: "数量",
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              type: "bar",
              label: {
                show: true,
                position: "top",
              },
              barMaxWidth: 30,
              data: series_data,
            },
          ],
        };
        if (xAxis_data.length < 5) {
          delete option.dataZoom;
        }
        this.blzt_chart.setOption(option);
      }
    },
    // 设置 申请类型
    async setSqlxPie() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          // shenqingleixing
          ismore: 0,
          chengbanriqiType: "year",
          action: "shenqingleixing",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let x_data = Datas.data.data.map((item) => item.label);
        let series_data = Datas.data.data.map((item) => ({
          name: item.label,
          value: item.doc_count,
        }));
        this.sqlx_chart = Echarts.init(
          document.querySelector("#sqlx"),
          "westeros"
        );
        this.sqlx_chart.clear();
        let option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: x_data,
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "75%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside",
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "14",
                    fontWeight: "bold",
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: series_data,
            },
          ],
        };
        this.sqlx_chart.setOption(option);
      }
    },
    // 设置 评审结论
    async setPsjlPie() {
      let Datas = await Axios({
        url: "/api/zhuce/visualizationNew",
        params: {
          // shenqingleixing
          ismore: 0,
          chengbanriqiType: "year",
          action: "xulie",
          name1: this.drugname_standard,
        },
      });
      if (Datas.data.code == 200) {
        let x_data = Datas.data.data.map((item) => item.label);
        let series_data = Datas.data.data.map((item) => ({
          name: item.label,
          value: item.doc_count,
        }));
        this.psjl_chart = Echarts.init(
          document.querySelector("#psjl"),
          "westeros"
        );
        this.psjl_chart.clear();
        let option = {
          legend: {
            type: "scroll",
            bottom: 0,
            data: x_data,
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "75%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside",
                },
                emphasis: {
                  show: true,
                  formatter: "{d}%",
                  align: "center",
                  textStyle: {
                    fontSize: "14",
                    fontWeight: "bold",
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: series_data,
            },
          ],
        };
        this.psjl_chart.setOption(option);
      }
    },
  },
  mounted() {
    this.getTableConf();
    this.getTableData(1);
    // 图表数据 获取
    this.setSbqsLine();
    this.setBlztBar();
    this.setSqlxPie();
    this.setPsjlPie();
    let _this = this;
    window.onresize = function () {
      let charts = [
        _this.sbqs_chart,
        _this.blzt_chart,
        _this.sqlx_chart,
        _this.psjl_chart,
      ];
      charts.forEach((chart) => {
        chart.resize();
      });
    };
  },
  beforeDestroy() {},
};
</script>

<style scoped lang="less">
@import url(../table-style.less);
.zgzcsb {
  padding: 10px;
  .notify {
    font-size: 13px;
    a {
      color: #002fa7;
      text-decoration: underline;
      // font-size: 14px;
    }
  }
  .charts {
    display: flex;
    .chart {
      flex: 1;
      height: 320px;
      padding: 0 5px;
    }
  }
}
.link-underline {
  text-decoration: none;
}
</style>