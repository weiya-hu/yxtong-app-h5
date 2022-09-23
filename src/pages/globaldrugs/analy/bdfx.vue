<template>
  <div class="bdfx">
    <div class="panel" v-waiting="bdfxLoading">
      <div class="chart_bottom">
        <div class="chart-boxes">
          <div class="part">
            <div id="ypfxBdzyjzfl-bar-globaldrugs" class="echarts">
              <div class="nodata-box"></div>
            </div>
            <div class="title">靶点作用机制分类
              <el-tooltip effect="zhuce" placement="right">
                <div slot="content" v-html="'统计不同作用机制分类的靶点数量。'">
                </div>
                <i class="section-ico-qa" style="margin-left: 4px; line-height: 28px"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="part">
            <div id="ypfxBdlx-pie-globaldrugs" class="echarts">
              <div class="nodata-box"></div>
            </div>
            <div class="title">靶点类型
              <el-tooltip effect="zhuce" placement="right">
                <div slot="content" v-html="'统计不同靶点类型的靶点数量及占比情况。'">
                </div>
                <i class="section-ico-qa" style="margin-left: 4px; line-height: 28px"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="part">
            <div id="ypfxBdzgyfjd-pie-globaldrugs" class="echarts">
              <div class="nodata-box"></div>
            </div>
            <div class="title">靶点最高研发阶段
              <el-tooltip effect="zhuce" placement="right">
                <div slot="content" v-html="'统计不同研发阶段的靶点数量及占比情况。此处统计的是靶点的最高研发阶段，比如PD1已经有药品批准上市，那么认为PD1的最高研发阶段为批准上市。'">
                </div>
                <i class="section-ico-qa" style="margin-left: 4px; line-height: 28px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>

        <div class="table" v-waiting="tableLoading">
          <div class="analy-type fl">
            <div class="analy-type-item checked">靶点热度
              <el-tooltip effect="zhuce" placement="right">
                <div slot="content" v-html="'展示药品数量靠前的靶点，并分别统计各靶点在全球/中国处于不同研发阶段的药品数量。'">
                </div>
                <i class="section-ico-qa" style="margin-left: 4px; line-height: 28px"></i>
              </el-tooltip>
            </div>
            <div class="analy-type-item">
              <!-- <span class="action-btn" @click="handleActionExport">
                <img src="~@/assets/imgs/globaldrugs/export_icon.png" width="14px" alt="" />
                导出
              </span> -->
            </div>
          </div>
          <el-table :data="ypfxBdrdFormat" stripe style="width: 100%">
            <el-table-column prop="label" label="靶点名称" width="200">
              <template slot-scope="scope">
                <!-- 靶点名称 -->
                <span class="target-class" @click="linkTargetDetail(scope.row.hash_label)" :title="scope.row.label">{{
                  scope.row.label
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="kind" label="靶点类型" width="200"></el-table-column>
            <el-table-column min-width="600">
              <template slot="header" slot-scope="scope">
                <div class="cus-head">
                  <div>各研发阶段药品数量分布</div>
                  <div class="right-select">
                    *研发阶段：
                    <el-select multiple collapse-tags class="cus-select" placeholder="全选" v-model="ypfxBdrdChoose"
                      @change="selectChange">
                      <el-option v-for="(key,value) of ypfxBdrdSelect" :key="key" :label="key" :value="value" />
                    </el-select>
                    <span class="btn-area">
                      <span class="search" @click="searchHandler">确定</span>
                    </span>
                  </div>
                </div>
              </template>
              <template slot-scope="scope">
                <el-tooltip v-if="scope.row.count.world>0" effect="light" placement="right">
                  <div slot="content">
                    <div class="tooltip-info">
                      <div>{{ scope.row.label}}（全球）</div>
                      <div style="display: flex;align-items: center;">
                        <span class="dot" :style="{'background-color': totalColor}"></span>总数：{{
                        scope.row.count.world
                        }}
                      </div>
                      <div style="display: flex;align-items: center;"
                        v-for="(worldItem,worldIndex) in scope.row.project.world" :key="'info-item-world_'+worldIndex">
                        <span class="dot"
                          :style="{'background-color': bdrdStyleHandler(worldItem,worldIndex,0).backgroundColor}"></span>
                        {{ worldItem.phase}}：{{ worldItem.num}}
                      </div>
                    </div>
                  </div>
                  <div class="line" style="position:relative;" v-if="scope.row.count.world>0">
                    <img src="/static/imgs/globaldrugs/glob.png" style="z-index: 12;" class="icon" width="20"
                      height="20" alt="" />
                    <div style="width:20px;height:20px;position:absolute;left:0;top:0;z-index:11;" class="block"></div>
                    <div class="line-container">
                      <div v-for="(item,index) in scope.row.project.world" :key="'world'+index"
                        :style="bdrdStyleHandler(item,index,0)" v-if="item.num>0" class="line-item"></div>
                    </div>
                  </div>
                </el-tooltip>
                <el-tooltip v-if="scope.row.count.china>0" effect="light" placement="right">
                  <div slot="content">
                    <div class="tooltip-info">
                      <div>{{ scope.row.label}}（中国）</div>
                      <div style="display: flex;align-items: center;">
                        <span class="dot" :style="{'background-color': totalColor}"></span>总数：{{
                        scope.row.count.china
                        }}
                      </div>
                      <div style="display: flex;align-items: center;"
                        v-for="(chinaItem,chinaIndex) in scope.row.project.china" :key="'info-item-china_'+chinaIndex">
                        <span class="dot"
                          :style="{'background-color': bdrdStyleHandler(chinaItem,chinaIndex,1).backgroundColor}"></span>
                        {{ chinaItem.phase}}：{{ chinaItem.num}}
                      </div>
                    </div>
                  </div>
                  <div class="line" style="position:relative;" v-if="scope.row.count.china>0">
                    <img src="/static/imgs/globaldrugs/cn.png" style="z-index: 12;" class="icon" width="20" height="20"
                      alt="" />
                    <div style="width:20px;height:20px;position:absolute;left:0;top:0;z-index:11;" class="block"></div>
                    <div class="line-container">
                      <div v-for="(item,index) in scope.row.project.china" :key="'china'+index"
                        :style="bdrdStyleHandler(item,index,1)" v-if="item.num>0" class="line-item"></div>
                    </div>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <template slot="append">
              <div class="last-row">
                <div class="load-more" v-if="bdrdShowMore" @click="loadMore">
                  默认展示前<span class="spec">{{ ypfxBdrd_param.pageSize}}</span>条，<span class="spec">加载更多</span>
                </div>
                <div class="not-more" v-else>最多支持60条数据显示哦...</div>
                <div class="yfjz-desc">
                  <div class="desc-item">
                    <span class="title">全球：</span><span class="block-item" v-for="(item,index) in phaseColorBlock"
                      :key="'phaseColorBlock'+index">
                      <span class="linebar" :style="{'background-color': item.color}"></span>
                      <span>{{ item.label}}</span>
                    </span>
                  </div>
                  <div class="desc-item">
                    <span class="title">中国：</span>
                    <span class="block-item" v-for="(item,index) in phaseColorBlock2" :key="'phaseColorBlock2'+index">
                      <span class="linebar" :style="{'background-color': item.color}"></span>
                      <span>{{ item.label}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import DbEcharts from "@/components/common/db-echarts";

export default {
  components: { DbEcharts },
  data() {
    return {
      searchState: {
        putongAnaly: {},
        shaixuanAnaly: {},
      },
      tableLoading: false,  // 靶点热度表格加载状态
      totalColor: '#000',
      eachWidth: 0, // 靶点热度-各研发阶段药品数量分布列的平均每份宽度
      ypfxBdrdFormat: [],
      ypfxBdrdChoose: "",
      phaseColorBlock: [
        {
          color: '#EBEEF5',
          label: "其他"
        },
        {
          color: "#E8F1FE",
          label: "临床前"
        },
        {
          color: "#CDDEFD",
          label: "临床申请"
        },
        {
          color: "#AFC9FE",
          label: "临床Ⅰ期"
        },
        {
          color: "#8BB4FA",
          label: "临床Ⅱ期"
        },
        {
          color: "#598DFC",
          label: "临床Ⅲ期"
        },
        {
          color: "#3A79F0",
          label: "注册申请"
        },
        {
          color: "#1944B0",
          label: "批准上市"
        }
      ],
      phaseColorBlock2: [
        {
          color: '#EBEEF5',
          label: "其他"
        },
        {
          color: "#E4FCB6",
          label: "临床前"
        },
        {
          color: "#D2F789",
          label: "临床申请"
        },
        {
          color: "#C1E975",
          label: "临床Ⅰ期"
        },
        {
          color: "#B0D867",
          label: "临床Ⅱ期"
        },
        {
          color: "#92D763",
          label: "临床Ⅲ期"
        },
        {
          color: "#82CC19",
          label: "注册申请"
        },
        {
          color: "#6DBF32",
          label: "批准上市"
        }
      ],
      global_line_map: [
        '#EBEEF5',
        "#E8F1FE",
        "#CDDEFD",
        "#AFC9FE",
        "#8BB4FA",
        "#598DFC",
        "#3A79F0",
        "#1944B0"
      ],
      cn_line_map: [
        '#EBEEF5',
        "#E4FCB6",
        "#D2F789",
        "#C1E975",
        "#B0D867",
        "#92D763",
        "#82CC19",
        "#6DBF32"
      ],
      titleBottom: 10,
      ypfxBdzyjzfl_bar: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      ypfxBdlx_pie: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      ypfxBdzgyfjd_pie: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      phaseArr: [
        '其他',
        '临床前',
        '临床申请',
        '临床Ⅰ期',
        '临床Ⅱ期',
        '临床Ⅲ期',
        '注册申请',
        '批准上市'
      ],
    }
  },
  computed: {
    ...mapState({
      bdrdShowMore: state => state.Globaldrugs.bdrdShowMore,
      bdfxLoading: state => state.Globaldrugs.bdfxLoading,
      ypfxBdrd_param: state => state.Globaldrugs.ypfxBdrd_param,
      ypfxBdzyjzfl: state => state.Globaldrugs.ypfxBdzyjzfl,
      ypfxBdlx: state => state.Globaldrugs.ypfxBdlx,
      ypfxBdzgyfjd: state => state.Globaldrugs.ypfxBdzgyfjd,
      ypfxBdrdSelect: state => state.Globaldrugs.ypfxBdrdSelect,
      ypfxBdrd: state => state.Globaldrugs.ypfxBdrd,
      paramAnaly: state => state.Globaldrugs.paramAnaly,
      analyLoading: state => state.Globaldrugs.analyLoading,
      nopms: state => state.Globaldrugs.nopms,
      conditionsAnaly: state => state.Globaldrugs.conditionsAnaly,
      putongAnaly: (state) => state.Globaldrugs.putongAnaly,
      gaojiAnaly: (state) => state.Globaldrugs.gaojiAnaly,
      shaixuanAnaly: (state) => state.Globaldrugs.shaixuanAnaly
    })
  },
  watch: {
    ypfxBdzyjzfl(newVal) {
      if (this.$route.path == "/globaldrugs/analysis") {
        this.$nextTick(() => {
          this.dealYpfxBdzyjzflBar(newVal);
        })
      }
    },
    ypfxBdlx(newVal) {
      if (this.$route.path == "/globaldrugs/analysis") {
        this.$nextTick(() => {
          this.dealYpfxBdlxPie(newVal);
        })
      }
    },
    ypfxBdzgyfjd(newVal) {
      if (this.$route.path == "/globaldrugs/analysis") {
        this.$nextTick(() => {
          this.dealYpfxBdzgyfjdPie(newVal);
        })
      }
    },
    ypfxBdrd(newVal) {
      if (this.$route.path == "/globaldrugs/analysis") {
        this.$nextTick(() => {
          this.ypfxBdrdTableHandler(newVal);
        })
      }
    }
  },
  methods: {
    // 加载更多
    loadMore() {
      this.tableLoading = true;
      window.ga("send", "event", "button", "click", "企业版_全球药物_智能分析_靶点分析_靶点热度_加载更多");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_智能分析_靶点分析_靶点热度_加载更多"
      ]);
      if (this.ypfxBdrd_param.page > 5) {
        return;
      }
      Store.commit('Globaldrugs/analyLoading', true)
      let params = _.cloneDeep(this.ypfxBdrd_param);
      params.page++;
      params = _.assign({}, this.paramAnaly, params);
      Store.commit('Globaldrugs/ypfxBdrd_param', params)
      const _that = this;
      Store.dispatch('Globaldrugs/getYpfxBdrd', params).then(res => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data;
          Store.commit('Globaldrugs/bdrdShowMore', data.length >= _that.ypfxBdrd_param.pageSize)
          let oldData = _.cloneDeep(_that.ypfxBdrd),
            totalData = oldData.concat(data);
          Store.commit('Globaldrugs/ypfxBdrd', totalData)
          _that.ypfxBdrdTableHandler(totalData);
          Store.commit('Globaldrugs/analyLoading', false)
          this.tableLoading = false;
        }
      }).catch(err => {
        this.tableLoading = false;
        console.log(err);
      })
    },
    linkTargetDetail(target) {
      const { href } = this.$router.resolve({
        path: '/globaldrugs/target/detail',
        query: {
          target
        }
      });
      window.open(href, "_blank");
    },
    bdrdStyleHandler(obj, i, type) {
      let style = {
        // left: -i * 2 + '%',
        zIndex: 10 - i,
      },
        width = this.eachWidth * obj.num;

      // 全球
      if (type == 0) {
        if (obj.num > 0) {
          let tempIndex = this.phaseColorBlock.findIndex(item => item.label == obj.phase);
          style.backgroundColor = this.global_line_map[tempIndex];
          style.width = (width || 0) + 'px';
        }
      } else if (type == 1) {
        // 中国
        let tempIndex = this.phaseColorBlock2.findIndex(item => item.label == obj.phase);
        style.backgroundColor = this.cn_line_map[tempIndex];
        style.width = (width || 0) + 'px';
      }
      style.paddingLeft = width < 10 ? 'unset' : '-10px';
      return style;
    },
    handleActionExport() {
      let token = GETCOOKIEFUN("accesstoken"),
        url = `/api/globaldrugs/ypfxBdrdOutdata?accesstoken=${token}`;
      let params = {
        phase1: this.ypfxBdrdChoose
      }
      // 选择全部
      if (this.ypfxBdrdChoose == '') {
        delete params.phase1;
      } else {
        params.phase1 = this.ypfxBdrdChoose.join("ღ");
        url += `&phase1=${params.phase1}`;
      }
      this.downloadFile(url);
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "企业版_全球药物_智能分析_导出"
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_智能分析_导出",
      ]);
    },
    selectChange(val) {
      this.ypfxBdrdChoose = val;
    },
    ypfxBdrdTableHandler(ypfxBdrd) {
      this.ypfxBdrdFormat = ypfxBdrd;
      console.log(ypfxBdrd);
      if (this.ypfxBdrdFormat.length > 0) {
        this.ypfxBdrdFormat.forEach(item => {
          item.project.world.map(subItem => subItem.num = Number(subItem.num));
          item.project.world = item.project.world.filter(subItem => subItem.num > 0);
          item.project.china.map(subItem => subItem.num = Number(subItem.num));
          item.project.china = item.project.china.filter(subItem => subItem.num > 0);
        })

        const _that = this;

        this.$nextTick(() => {
          let domSize = $(".el-table thead tr th").length - 1,
            tableW = $(".el-table thead tr th:eq(" + domSize + ")").width(),
            worldTotal = _that.ypfxBdrdFormat[0].count.world;
          _that.eachWidth = ((tableW - 300) / worldTotal);
        })
      }
    },
    searchHandler() {
      window.ga("send", "event", "button", "click", "企业版_全球药物_智能分析_靶点分析_靶点热度_研发阶段_确定");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_智能分析_靶点分析_靶点热度_研发阶段_确定"
      ]);
      this.tableLoading = true;
      Store.commit('Globaldrugs/analyLoading', true)
      Store.commit('Globaldrugs/bdfxLoading', true);
      const _that = this
      let params = {
        phase1: this.ypfxBdrdChoose
      }
      // 选择全部
      if (this.ypfxBdrdChoose == '') {
        delete params.phase1;
      } else {
        params.phase1 = this.ypfxBdrdChoose.join("ღ");
      }
      let tempParam = _.cloneDeep(this.ypfxBdrd_param);
      tempParam.page = 1;
      Store.commit('Globaldrugs/ypfxBdrd_param', tempParam)
      params = _.assign({}, this.paramAnaly, params);
      Store.dispatch("Globaldrugs/getYpfxBdrd", params).then(res => {
        let data = res.data.data;
        Store.commit('Globaldrugs/bdrdShowMore', data.length >= _that.ypfxBdrd_param.pageSize)
        if (res.data.code === 200 && res.data.data) {
          _that.ypfxBdrdTableHandler(data);
          Store.commit('Globaldrugs/ypfxBdrd', data)
          Store.commit('Globaldrugs/bdfxLoading', false);
          Store.commit('Globaldrugs/analyLoading', false)
          _that.tableLoading = false;
        } else {
          Store.commit('Globaldrugs/bdfxLoading', false);
          Store.commit('Globaldrugs/analyLoading', false)
        }
      }).catch(err => {
        Store.commit('Globaldrugs/bdfxLoading', false);
        Store.commit('Globaldrugs/analyLoading', false)
        _that.tableLoading = false;
      })
    },
    loadData: _.debounce(function () {
      Store.dispatch("Globaldrugs/getKshRes").then(res => {
        this.update();
      });
    }, 10),
    update() {
      this.dealYpfxBdzyjzflBar(this.ypfxBdzyjzfl);
      this.dealYpfxBdlxPie(this.ypfxBdlx);
      this.dealYpfxBdzgyfjdPie(this.ypfxBdzgyfjd);
    },
    // 最高研发阶段双柱状图
    dealYpfxBdzyjzflBar(ypfxBdzyjzfl) {
      let _len1 = ypfxBdzyjzfl.length,
        xAxis1_data = [],
        series1_data = [];

      if (_len1 > 0) {
        ypfxBdzyjzfl.length > 0 && ypfxBdzyjzfl.forEach(item => {
          xAxis1_data.push(item.label);
          series1_data.push(item.count);
        })

        this.ypfxBdzyjzfl_bar.xAxis1_data = xAxis1_data;
        this.ypfxBdzyjzfl_bar.series1_data = series1_data;
        this.drawYpfxBdzyjzflBar();

        // this.recordNoData.delete(7);
      } else {
        // this.recordNoData.add(7);
        $("#ypfxBdzyjzfl-bar-globaldrugs").html('<div class="nodata-box"></div>');
        $("#ypfxBdzyjzfl-bar-globaldrugs").removeAttr("_echarts_instance_");
      }
    },
    drawYpfxBdzyjzflBar() {
      var _that = this;
      _that.ypfxBdzyjzfl_bar.echarts = Echarts.init(
        document.getElementById("ypfxBdzyjzfl-bar-globaldrugs"),
        "westeros"
      );
      let dataLen = 20; // 数据缩放条展示数据条数
      const domID = document.getElementById("ypfxBdzyjzfl-bar-globaldrugs");
      _that.ypfxBdzyjzfl_bar.echarts = Echarts.getInstanceByDom(domID, "westeros")
      if (_that.ypfxBdzyjzfl_bar.echarts) {
        _that.ypfxBdzyjzfl_bar.echarts = Echarts.getInstanceByDom(
          domID,
          "westeros"
        )
      } else {
        _that.ypfxBdzyjzfl_bar.echarts.clear()
      }
      let option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return `${params.name}：${params.value ? params.value : 0
              }`;
          }
        },
        grid: [
          {
            left: 30,
            right: 50,
            width: '95%',
            containLabel: true,
            bottom: 80
          }
        ],
        dataZoom: {
          id: 'dataZoomX',
          show: true,
          startValue: 0,
          endValue: dataLen - 1,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
          left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
          bottom: 50, // 组件离容器下侧的距离,'20%'
          height: 25 //这里可以设置dataZoom的尺寸
        },
        xAxis: {
          type: 'category',
          data: _that.ypfxBdzyjzfl_bar.xAxis1_data,
          axisLabel: {
            interval: 0,
            rotate: 30,
            formatter(value) {
              return _that.labelLenLimit(value, 12);
            },
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          }
        },
        backgroundColor: "#FAFBFD",
        series: {
          type: 'bar',
          barMaxWidth: 30,
          stack: 'chart',
          z: 3,
          label: {
            normal: {
              position: 'top',
              show: true
            }
          },
          data: _that.ypfxBdzyjzfl_bar.series1_data
        }
      }
      if (_that.ypfxBdzyjzfl_bar.xAxis1_data.length < dataLen) {
        option.dataZoom.show = false;
      } else {
        option.dataZoom.show = true;
      }
      _that.ypfxBdzyjzfl_bar.echarts.setOption(option);
    },
    // 药品类型饼图
    dealYpfxBdlxPie(ypfxBdlx) {
      let _len1 = ypfxBdlx.length,
        xAxis1_data = [],
        series1_data = [];

      if (_len1 > 0) {
        ypfxBdlx.length > 0 && ypfxBdlx.forEach(item => {
          series1_data.push({ name: item.label, value: item.count });
        })

        this.ypfxBdlx_pie.xAxis1_data = xAxis1_data;
        this.ypfxBdlx_pie.series1_data = series1_data;
        this.drawYpfxBdlxPie();

        // this.recordNoData.delete(7);
      } else {
        // this.recordNoData.add(7);
        $("#ypfxBdlx-pie-globaldrugs").html('<div class="nodata-box"></div>');
        $("#ypfxBdlx-pie-globaldrugs").removeAttr("_echarts_instance_");
      }
    },
    drawYpfxBdlxPie() {
      var _that = this;
      _that.ypfxBdlx_pie.echarts = Echarts.init(
        document.getElementById("ypfxBdlx-pie-globaldrugs"),
        "westeros"
      );
      let legend_data1 = _that.ypfxBdlx.map(item => item.label);
      const domID = document.getElementById("ypfxBdlx-pie-globaldrugs");
      _that.ypfxBdlx_pie.echarts = Echarts.getInstanceByDom(domID, "westeros")
      if (_that.ypfxBdlx_pie.echarts) {
        _that.ypfxBdlx_pie.echarts = Echarts.getInstanceByDom(
          domID,
          "westeros"
        )
      } else {
        _that.ypfxBdlx_pie.echarts.clear()
      }
      _that.ypfxBdlx_pie.echarts.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `${params.name}：${params.value ? params.value : 0}<br/>占比：${params.percent ? params.percent : 0}%`;
            }
          },
          legend: [
            {
              data: legend_data1,
              type: 'scroll',
              orient: 'vertical',
              left: 10,
              bottom: _that.titleBottom,
              height: '35%',
              containLabel: true
            }
          ],
          backgroundColor: "#FAFBFD",
          series: [
            {
              type: "pie",
              radius: '50%',
              center: ['50%', '50%'],
              data: _that.ypfxBdlx_pie.series1_data,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside"
                },

              },
              labelLine: {
                normal: {
                  show: false
                }
              },
            }
          ],
        }
      );
    },
    // 靶点最高研发阶段
    dealYpfxBdzgyfjdPie(ypfxBdzgyfjd) {
      let _len1 = ypfxBdzgyfjd.length,
        xAxis1_data = [],
        series1_data = [];

      if (_len1 > 0) {
        ypfxBdzgyfjd.length > 0 && ypfxBdzgyfjd.forEach(item => {
          series1_data.push({ name: item.phase, value: item.num });
        })

        this.ypfxBdzgyfjd_pie.xAxis1_data = xAxis1_data;
        this.ypfxBdzgyfjd_pie.series1_data = series1_data;
        this.drawYpfxBdzgyfjdPie();

        // this.recordNoData.delete(7);
      } else {
        // this.recordNoData.add(7);
        $("#ypfxBdzgyfjd-pie-globaldrugs").html('<div class="nodata-box"></div>');
        $("#ypfxBdzgyfjd-pie-globaldrugs").removeAttr("_echarts_instance_");
      }
    },
    drawYpfxBdzgyfjdPie() {
      var _that = this;
      _that.ypfxBdzgyfjd_pie.echarts = Echarts.init(
        document.getElementById("ypfxBdzgyfjd-pie-globaldrugs"),
        "westeros"
      );
      let legend_data1 = _that.ypfxBdzgyfjd.map(item => item.phase);
      const domID = document.getElementById("ypfxBdzgyfjd-pie-globaldrugs");
      _that.ypfxBdzgyfjd_pie.echarts = Echarts.getInstanceByDom(domID, "westeros")
      if (_that.ypfxBdzgyfjd_pie.echarts) {
        _that.ypfxBdzgyfjd_pie.echarts = Echarts.getInstanceByDom(
          domID,
          "westeros"
        )
      } else {
        _that.ypfxBdzgyfjd_pie.echarts.clear()
      }
      _that.ypfxBdzgyfjd_pie.echarts.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `${params.name}：${params.value ? params.value : 0}<br/>占比：${params.percent ? params.percent : 0}%`;
            }
          },
          legend: [
            {
              data: legend_data1,
              type: 'scroll',
              orient: 'vertical',
              left: 10,
              bottom: _that.titleBottom,
              height: '35%',
              containLabel: true
            }
          ],
          backgroundColor: "#FAFBFD",
          series: [
            {
              type: "pie",
              radius: ["30%", "50%"],
              center: ['50%', '50%'],
              data: _that.ypfxBdzgyfjd_pie.series1_data,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "outside"
                },

              },
              labelLine: {
                normal: {
                  show: false
                }
              },
            }
          ],
        }
      );
    },
    echartsResizeHandler() {
      this.echartsResize("echarts");
      this.ypfxBdrdTableHandler(this.ypfxBdrd);
      // setTimeout(() => {
      //   this.filterPanelH = $(".filter-panel").height();
      //   $(".filter-panel").css('height', this.filterPanelH + 'px');
      // }, 200);
    },
    // Vuex内存储的搜索条件和页面内的对比，返回状态
    diffSearchData() {
      const currentSearchData = {
        putongAnaly: this.putongAnaly,
        // gaojiAnaly: this.gaojiAnaly,
        shaixuanAnaly: this.shaixuanAnaly
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
    this.loadData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.echartsResizeHandler);
  },
  mounted() {
    window.addEventListener("resize", this.echartsResizeHandler);
  },
  activated() {
    this.update();
    window.addEventListener("resize", this.echartsResizeHandler);
    // this.nopms一直为undefined状态，暂时屏蔽，后续再观察是否有其它用处
    this.vueRouteToNoPms(this.nopms.ksh);
    if (this.diffSearchData()) {
      this.loadData();
    }
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
  },
}
</script>

<style lang="less" scoped>
@import url(../detail/components/table-style.less);

.tooltip-info {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.line {
  width: 100%;
  white-space: nowrap;
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
  position: relative;

  .line-container {
    // margin-left: 30px;
  }

  .icon {
    position: absolute;
    left: 0;
    z-index: 11;
  }

  &:nth-child(2) {
    margin-top: 10px;
  }

  &-item {
    height: 20px;
    position: relative;
    display: inline-block;
  }

  .line-item:first-child {
    margin-left: 10px !important;
    border-radius: 10px 0px 0px 10px;
  }

  .line-item:last-child {
    border-radius: 0px 10px 10px 0;
    min-width: 10px;
  }
}

.last-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 14px;
  margin-top: 15px;
  margin-bottom: 27px;

  .load-more {
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    cursor: pointer;
    white-space: nowrap;

    .spec {
      color: #002FA7;
      font-weight: 400;
      font-size: 14px;
    }
  }

  .not-more {
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    white-space: nowrap;
  }

  .yfjz-desc {
    width: 100%;
    height: 33px;
    padding: 0 8px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    font-size: 12px;
    box-sizing: border-box;
    margin-top: 10px;
    flex-direction: column;

    .desc-item {
      display: flex;
      align-items: center;
      margin-right: 60px;

      .title {
        white-space: nowrap;
      }

      &:last-child {
        margin-top: 10px;
      }
    }

    .block-item {
      display: flex;
      align-items: center;
      white-space: nowrap;

      &:not(:last-child) {
        margin-right: 10px;
      }
    }

    .linebar {
      width: 15px;
      height: 8px;
      border-radius: 2px;
      margin-right: 5px;
    }

    span {
      line-height: 1;
    }

    span:nth-child(2n):not(:last-child) {
      margin-right: 10px;
    }
  }
}

.yfdw {
  display: flex;
  font-size: 12px;

  .label {
    width: 50px;
  }

  .c {
    flex: 1;
  }
}

.cus-head {
  align-items: center;

  div {
    text-align: left;
    position: relative;
    display: flex;
    align-items: center;
  }

  .right-select {
    flex: unset;
    font-size: 14px;
    font-weight: 400;
    color: #333333;

    .btn-area {
      height: 100%;
      width: 80px;
      display: flex;
      justify-content: end;

      .search {
        width: 100%;
        height: 28px;
        background: #002FA7;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;
        cursor: pointer;
      }
    }

    .cus-select {
      width: 190px;

      /deep/.el-input.el-input--suffix {
        position: relative;
      }

      /deep/.el-input--suffix .el-input__inner {
        padding-left: 30px !important;
        padding-right: 0 !important;
        height: 28px !important;
      }

      /deep/.el-input__suffix {
        // left: -63px;
        right: 10px;
      }
    }
  }
}

.echarts {
  height: 376px !important;
}

.section-ico-qa {
  width: 14px;
  height: 14px;
  display: block;
  background-image: url(/static/imgs/globaldrugs/qa.png);
  background-size: cover;
  margin-left: 5px;

  &:hover {
    background-image: url(/static/imgs/globaldrugs/qa-c.png);
  }
}

.part {
  background: rgb(250, 251, 253);
  padding-top: 10px !important;
  margin-top: 0 !important;
  width: 25% !important;

  &:first-child {
    width: 50% !important;
  }

  .title {
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.analy-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  border-bottom: 1px solid #EBEEF5;
  margin-bottom: 10px;
  width: 100%;

  .line {
    margin: 0 10px;
    height: 14px;
    border: 0.5px solid #EBEEF5;
  }

  &-item {
    position: absolute;
    cursor: pointer;
    box-sizing: content-box;

    &.checked {
      font-weight: bold;
      color: #000F32;
      display: flex;
      align-items: center;

      &::after {
        display: block;
        content: "";
        position: absolute;
        height: 3px;
        width: 100%;
        background-color: #002FA7;
        border-radius: 2px;
        bottom: 2px;
        left: 0;
      }
    }
  }

  &::after {
    display: block;
    width: 100%;
    border-bottom: 1px solid #dfe5f1;
    content: "";
    position: absolute;
    top: 40px;
    left: 0;
  }
}

.el-table {
  overflow: auto;

  &::before {
    height: 0 !important;
  }

  /deep/th {
    background: #FFF !important;
  }
}

/deep/.el-table__header-wrapper {
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 10px;

  thead tr th>.cell {
    font-size: 14px;
    line-height: 14px;
    font-weight: bold;
    color: #333333;
  }
}
</style>

<style lang="less">
@import "~@/assets/less/var.less";

.bdfx {
  .el-table__body-wrapper {
    .cell {
      max-height: 70px !important;
      padding: 0 !important;
      line-height: 70px;
    }

    td {
      border: none !important;
    }

    .el-table__body {
      border-bottom: 1px solid #EBEEF5;
    }

  }

  .action-btn {
    margin-right: 0 !important;
    display: flex;
    align-items: center;

    img {
      margin-right: 4px;
    }

    &:hover {
      color: @PrimaryColor;
    }
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td,
  .el-table--striped .el-table__body tr.el-table__row--striped td:hover {
    background: #FAFBFD;
  }

  .el-table_1_column_1,
  .el-table_1_column_2 {
    font-size: 14px;
    font-weight: bold;
    color: #333333;
  }

  .el-table_1_column_1 {
    cursor: pointer;
  }

  .target-class {
    line-height: 14px;
    font-size: 14px;
    font-weight: bold;
    color: #333333;

    &:hover {
      text-decoration: none;
      color: #002FA7;
    }
  }

  .el-table_1_column_2 {
    font-weight: 400;
  }

  .el-table__body tr.el-table__row--striped:hover>td,
  .el-table__body tr:hover>td {
    background-color: #ebeef5 !important;
  }

  .nodata-box {
    background: url('~@/assets/imgs/globaldrugs/analy/chart-nodata.png') no-repeat center;
    background-size: 275px 251px;
    width: 100%;
    height: 100%;
  }
}
</style>