<template>
  <div class="ywgl" v-waiting="loading">
    <div class="ywgl-up">
      <div class="flex1 ywinfo">
        <div class="info-item" v-if="isEmpty(base.targets_abbr)">
          <div class="label">靶点简称：</div>
          <div class="content td-line3">
            {{ base.targets_abbr }}
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.targets)">
          <div class="label">靶点全称：</div>
          <div class="content td-line3">
            {{ base.targets }}
          </div>
        </div>
        <div class="info-item more" v-if="isEmpty(base.alias)">
          <div class="label">靶点别称：</div>
          <div class="content">
            <div class="text" :class="{ 'line3': toggleStatus1 }">{{ base.alias }}</div>
            <span v-if="showMore1" class="more-btn" @click="showMoreHandler(0)">
              <span>更多</span>
              <i class="icon el-icon-d-arrow-right"></i>
            </span>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.kind)">
          <div class="label">靶点类型：</div>
          <div class="content td-line3">{{ base.kind }}</div>
        </div>
        <div class="info-item" v-if="isEmpty(base.organism)">
          <div class="label">物种来源：</div>
          <div class="content td-line3">{{ base.organism }}</div>
        </div>
        <div class="info-item" v-if="isEmpty(base.uniprotid)">
          <div class="label">UniprotID号：</div>
          <a :href="'https://www.uniprot.org/uniprot/' + base.uniprotid" @click="tongjiHandler" target="_blank"
            class="content td-line3">{{
                base.uniprotid
            }}</a>
        </div>
        <div class="info-item" v-if="isEmpty(base.uniprotname)">
          <div class="label">UniprotID名称：</div>
          <div class="content td-line3">{{ base.uniprotname }}</div>
        </div>
        <div class="info-item more" v-if="isEmpty(base.sequence)">
          <div class="label">分子序列：</div>
          <div class="content">
            <div class="text" :class="{ 'line3': toggleStatus2 }">{{ base.sequence }}</div>
            <span v-if="showMore2" class="more-btn" @click="showMoreHandler(1)">
              <span>更多</span>
              <i class="icon el-icon-d-arrow-right"></i>
            </span>
          </div>
        </div>
        <div class="info-item more" v-if="isEmpty(base.generalfunction)">
          <div class="label">基因功能：</div>
          <div class="content">
            <div class="text" :class="{ 'line3': toggleStatus3 }">{{ base.generalfunction }}</div>
            <span v-if="showMore3" class="more-btn" @click="showMoreHandler(2)">
              <span>更多</span>
              <i class="icon el-icon-d-arrow-right"></i>
            </span>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.indication)">
          <div class="label">适应症：</div>
          <div class="content flex flex-dc syz">
            <div class="flex item more" v-if="base.indication['已批准']">
              <span class="label green">已批准</span>
              <div class="content flex flex1">
                <div class="text" :class="{ 'line3': toggleStatus4 }">
                  <span class="tag" v-for="(t, i) in base.indication['已批准']" :key="'已批准_' + i">
                    {{ t }}
                    {{ i < base.indication["已批准"].length - 1 ? ";" : "" }} </span>
                </div>
                <span v-if="showMore4" class="more-btn" @click="showMoreHandler2(0, 3)">
                  <span>更多</span>
                  <i class="icon el-icon-d-arrow-right"></i>
                </span>
              </div>
            </div>
            <div class="flex item more" v-if="base.indication['在研']">
              <span class="label blue">在研</span>
              <div class="content flex flex1">
                <div class="text" :class="{ 'line3': toggleStatus5 }">
                  <span class="tag" v-for="(t, i) in base.indication['在研']" :key="'在研_' + i">
                    {{ t }}
                    {{ i < base.indication["在研"].length - 1 ? ";" : "" }} </span>
                </div>
                <span v-if="showMore5" class="more-btn" @click="showMoreHandler2(1, 4)">
                  <span>更多</span>
                  <i class="icon el-icon-d-arrow-right"></i>
                </span>
              </div>
            </div>
            <div class="flex item more" v-if="base.indication['停止']">
              <span class="label red">停止</span>
              <div class="content flex flex1">
                <div class="text" :class="{ 'line3': toggleStatus6 }">
                  <span class="tag" v-for="(t, i) in base.indication['停止']" :key="'停止_' + i">
                    {{ t }}
                    {{ i < base.indication["停止"].length - 1 ? ";" : "" }} </span>
                </div>
                <span v-if="showMore6" class="more-btn" @click="showMoreHandler2(2, 5)">
                  <span>更多</span>
                  <i class="icon el-icon-d-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="info-item" v-if="isEmpty(base.worldstatus)">
          <div class="label">最高研发阶段：</div>
          <div class="content td-line3" style="display:flex;align-items:center;">
            <div style="cursor:pointer;display:flex;align-items: center;flex-wrap: wrap;"
              @click="linkYwlist(t, k)" v-if="t.name != ''" v-for="(t, k) in base.worldstatus" :key="k">
              <img v-if="k == 'china'" style="margin-right: 5px;" src="@/assets/imgs/globaldrugs/detail/china.png"
                height="15" width="15" />
              <img v-else style="margin-right: 5px;" src="@/assets/imgs/globaldrugs/detail/world.png" height="15"
                width="15" />
              <span style="color: #9aa4b8">{{ k == 'china' ? '中国' : '全球' }}：</span>
              <span class="zgyfzt-item" style="font-weight: bold;margin-right: 5px;">
                {{ t.name }}
                <span v-if="t.date">
                  （{{ t.date }}）
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex1 ywhuaxue">
        <div class="huaxue">
          <div id="bar-globaldrugs" class="echarts">
            <div class="nodata-box"></div>
          </div>
          <div id="kind-pie-globaldrugs" class="echarts">
            <div class="nodata-box"></div>
          </div>
        </div>
        <div @click="linkToAnaly" class="analy-link">进入更多分析</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "badian-gailan",
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  data() {
    return {
      showMore1: false,
      showMore2: false,
      showMore3: false,
      showMore4: false,
      showMore5: false,
      showMore6: false,
      toggleStatus1: false, // 分子序列
      toggleStatus2: false, // 适应症-已批准
      toggleStatus3: false, // 适应症-在研
      toggleStatus4: false, // 适应症-停止
      toggleStatus5: false, // 适应症-停止
      toggleStatus6: false, // 适应症-停止
      loading: true,
      phase_bar: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      kind_pie: {
        echarts: null,
        xAxis1_data: [],
        series1_data: [],
        xAxis2_data: [],
        series2_data: []
      },
      dialogVisible: false,
      showPreview: false,
      pop_desc_map: {
        pharmacodynamics: "药效学",
        mechanism_of_action: "作用机制",
        protein: "蛋白结晶",
        halflife: "半衰期",
        toxicity: "毒理",
        absorption: "吸收",
        volume: "分布",
        metabolism: "代谢",
        route: "排泄",
        clearance: "清除",
      },
      titleBottom: 10,
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.echartsResizeHandler);
  },
  mounted() {

  },
  watch: {
    base(val) {
      if (this.base.statistics.phase.length > 0) {
        this.phase_bar.xAxis1_data = this.base.statistics.phase.map(item => item.phase);
        this.phase_bar.series1_data = [];
        // this.phase_bar.series2_data = [];
        this.base.statistics.phase.forEach(item => {
          // 全球
          this.phase_bar.series1_data.push(item.statistics.all)
          // 中国
          // this.phase_bar.series2_data.push(item.statistics.china)
        })
        this.drawPhaseBar();
      } else {
        $("#bar-globaldrugs").html('<div class="nodata-box"></div>');
        $("#bar-globaldrugs").removeAttr("_echarts_instance_");
      }
      if (this.base.statistics.kind.length > 0) {
        this.kind_pie.series1_data = [];
        this.base.statistics.kind.forEach(item => {
          this.kind_pie.series1_data.push({ name: item.category, value: Number(item.count) });
        })
        this.drawKindPie();
      } else {
        $("#kind-pie-globaldrugs").html('<div class="nodata-box"></div>');
        $("#kind-pie-globaldrugs").removeAttr("_echarts_instance_");
      }
      this.loading = false;
    },
    "base.alias"(val) {
      this.$nextTick(() => {
        let contentHeight = $(".more:eq(0) .text").height();
        if (contentHeight >= 70) {
          this.showMore1 = true;
          this.toggleStatus1 = true; // 分子序列
        } else {
          this.showMore1 = false;
          this.toggleStatus1 = false; // 分子序列
        }
      })
    },
    "base.sequence"(val) {
      this.$nextTick(() => {
        let contentHeight = $(".more:eq(1) .text").height();

        if (contentHeight >= 70) {
          this.showMore2 = true;
          this.toggleStatus2 = true; // 分子序列
        } else {
          this.showMore2 = false;
          this.toggleStatus2 = false; // 分子序列
        }
      })
    },
    "base.generalfunction"(val) {
      this.$nextTick(() => {
        let contentHeight = $(".more:eq(2) .text").height();
        console.log(contentHeight);

        if (contentHeight >= 70) {
          this.showMore3 = true;
          this.toggleStatus3 = true; // 分子序列
        } else {
          this.showMore3 = false;
          this.toggleStatus3 = false; // 分子序列
        }
      })
    },
    // 适应症 - 已批准
    "base.indication"(val) {
      if (val) {
        if (this.base.indication['已批准']) {
          this.$nextTick(() => {
            let contentHeight = $("div.flex.item.more:eq(0) .text").height();
            if (contentHeight >= 70) {
              this.showMore4 = true;
              this.toggleStatus4 = true;
            } else {
              this.showMore4 = false; // 适应症 - 已批准
              this.toggleStatus4 = false; // 适应症 - 已批准
            }
          })
        }
        if (this.base.indication['在研']) {
          this.$nextTick(() => {
            let contentHeight = $("div.flex.item.more:eq(1) .text").height();
            if (contentHeight >= 70) {
              this.showMore5 = true;
              this.toggleStatus5 = true;
            } else {
              this.showMore5 = false; // 适应症 - 在研
              this.toggleStatus5 = false; // 适应症 - 在研
            }
          })
        }
        if (this.base.indication['停止']) {
          this.$nextTick(() => {
            let contentHeight = $("div.flex.item.more:eq(2) .text").height();
            if (contentHeight >= 70) {
              this.showMore6 = true;
              this.toggleStatus6 = true;
            } else {
              this.showMore6 = false; // 适应症 - 停止
              this.toggleStatus6 = false; // 适应症 - 停止
            }
          })
        }
      }
    }
  },
  methods: {
    tongjiHandler() {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_靶点概览_UniprotID号跳转");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_靶点概览_UniprotID号跳转"
      ]);
    },
    showMoreHandler(index) {
      let obj = $(`.info-item.more:eq(${index}) .more-btn`);
      if (obj.find("span").text() == "更多") {
        switch (index) {
          case 0:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_靶点别称_展开");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_靶点别称_展开"
            ]);
            break;
          case 1:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_分子序列_展开");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_分子序列_展开"
            ]);
            break;
        }
        this["toggleStatus" + (index + 1)] = false;
        obj.find("span").text('收起')
        obj.find("i").css('transform', 'rotate(-90deg)')
      } else {
        switch (index) {
          case 0:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_靶点别称_收起");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_靶点别称_收起"
            ]);
            break;
          case 1:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_分子序列_收起");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_分子序列_收起"
            ]);
            break;
        }
        this["toggleStatus" + (index + 1)] = true;
        obj.find("span").text('更多')
        obj.find("i").css('transform', 'rotate(90deg)')
      }
    },
    showMoreHandler2(index, subIndex) {
      let obj = $(`div.flex.item.more:eq(${index}) .more-btn:eq(0)`);
      if (obj.find("span").text() == "更多") {
        switch (subIndex) {
          case 3:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_适应症_已批准_展开");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_适应症_已批准_展开"
            ]);
            break;
          case 4:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_适应症_在研_展开");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_适应症_在研_展开"
            ]);
            break;
          case 5:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_适应症_停止_展开");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_适应症_停止_展开"
            ]);
            break;
        }
        this["toggleStatus" + (subIndex + 1)] = false;
        obj.find("span").text('收起')
        obj.find("i").css('transform', 'rotate(-90deg)')
      } else {
        switch (subIndex) {
          case 3:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_适应症_已批准_收起");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_适应症_已批准_收起"
            ]);
            break;
          case 4:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_适应症_在研_收起");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_适应症_在研_收起"
            ]);
            break;
          case 5:
            window.ga("send", "event", "button", "click", "企业版_全球药物_靶点详情_适应症_停止_收起");
            window._paq.push([
              "trackEvent",
              "button",
              "click",
              "企业版_全球药物_靶点详情_适应症_停止_收起"
            ]);
            break;
        }
        this["toggleStatus" + (subIndex + 1)] = true;
        obj.find("span").text('更多')
        obj.find("i").css('transform', 'rotate(90deg)')
      }
    },
    linkToAnaly() {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_靶点概览_进入更多分析");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_靶点概览_进入更多分析"
      ]);
      const { href } = this.$router.resolve({
        path: "/globaldrugs/analysis",
        query: {
          targets: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
        }
      });

      window.open(href, "_blank")
    },
    drawPhaseBar() {
      var _that = this;
      _that.phase_bar.echarts = Echarts.init(
        document.getElementById("bar-globaldrugs"),
        "westeros"
      );
      let dataLen = 5; // 数据缩放条展示数据条数
      _that.phase_bar.echarts.clear()
      let option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return `${params.name}：${params.value ? params.value : 0
              }`;
          }
        },
        // legend: {
        //   data: ['全球']
        // },
        // title: {
        //   text: '靶点作用机制分类',
        //   left: '50%',
        //   bottom: _that.titleBottom,
        //   textAlign: 'center',
        //   textStyle: {
        //     fontSize: 14
        //   }
        // },
        grid: [
          {
            containLabel: true
          }
        ],
        // dataZoom: [{
        //   id: 'dataZoomX',
        //   show: true,
        //   startValue: 0,
        //   endValue: dataLen - 1,
        //   zoomOnMouseWheel: true,
        //   moveOnMouseMove: true,
        //   fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
        //   left: 'center', // 组件离容器左侧的距离,'left', 'center', 'right','20%'
        //   bottom: 10, // 组件离容器下侧的距离,'20%'
        //   height: 25 //这里可以设置dataZoom的尺寸
        // }],
        xAxis: {
          type: 'category',
          data: _that.phase_bar.xAxis1_data,
          axisLabel: {
            interval: 0,
            rotate: 30
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
        series: [{
          name: "全球",
          type: 'bar',
          barMaxWidth: 30,
          label: {
            normal: {
              position: 'top',
              show: true
            }
          },
          data: _that.phase_bar.series1_data
        }
          // , {
          //   name: "中国",
          //   type: 'bar',
          //   label: {
          //     normal: {
          //       position: 'top',
          //       show: true
          //     }
          //   },
          //   data: _that.phase_bar.series2_data
          // }
        ]
      }
      // if (_that.phase_bar.xAxis1_data.length < dataLen) {
      //   option.dataZoom.show = false;
      // } else {
      //   option.dataZoom.show = true;
      // }

      _that.phase_bar.echarts.setOption(option);
      window.addEventListener("resize", this.echartsResizeHandler);
    },
    echartsResizeHandler() {
      this.echartsResize("echarts");
      // setTimeout(() => {
      //   this.filterPanelH = $(".filter-panel").height();
      //   $(".filter-panel").css('height', this.filterPanelH + 'px');
      // }, 200);
    },
    drawKindPie() {
      var _that = this;
      _that.kind_pie.echarts = Echarts.init(
        document.getElementById("kind-pie-globaldrugs"),
        "westeros"
      );
      _that.kind_pie.echarts.clear()
      _that.kind_pie.echarts.setOption(
        {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              return `${params.name}：${params.value ? params.value : 0}
                            <br/>占比：${params.percent ? params.percent : 0}%`;
            }
          },
          backgroundColor: "#FAFBFD",
          series: {
            type: "pie",
            radius: '50%',
            center: '50%',
            data: _that.kind_pie.series1_data,
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "outside"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
          },
        }
      );
      window.addEventListener("resize", this.echartsResizeHandler);
    },
    linkYwlist(obj, type) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_最高研发阶段_" + (type == 'global' ? '全球' : '中国'));
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_最高研发阶段_" + (type == 'global' ? '全球' : '中国')
      ]);
      let numObj = {};
      if (type == 'global') {
        // 全球最高阶段
        numObj = {
          phase1: [obj.num.toString()]
        }
      } else if (type == 'china') {
        // 中国最高阶段
        numObj = {
          phase2: [obj.num.toString()]
        }
      }
      let { href } = this.$router.resolve({
        path: "/globaldrugs",
        query: {
          targets: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          filter_condition: JSON.stringify(numObj)
        }
      });
      window.open(href, "_blank");
    },
    closeViewer() {
      this.showPreview = false;
    },
    isEmpty(t) {
      // 先处理一些怪异的类型
      if (t === null || t === undefined || t === NaN) return false;
      // 获得构造器名称
      let type = t.constructor.name;
      // 处理对应的类型
      let funcs = {
        String: e => {
          return !!e.length
        },
        Object: e => {
          return !!Object.keys(e).length
        },
        Array: e => {
          return !!e.length
        },
        Number: e => {
          return true
        }
      }
      return funcs[type](t);
    }
  },
};
</script>

<style scoped lang="less">
.flex-column {
  flex-direction: column;
}

.ywgl {
  padding: 10px;

  .ywgl-up {
    display: flex;
    color: #333;
  }

  .flex1 {
    flex: 1;
  }

  .info-item {
    display: flex;
    font-size: 13px;

    &>.label {
      background-color: #fafbfd;
      width: 120px;
      text-align: right;
      padding: 5px;
      box-sizing: border-box;
    }

    &>.content {
      flex: 1;
      word-break: break-all;
      padding: 5px;

      .link {
        color: #002fa7;
        text-decoration: none;
      }

      .badian {
        padding: 4px 10px;
        border-radius: 2px;
        border: 1px solid #dcdfe6;
        margin-right: 10px;
        color: #002fa7;
        line-height: 1;

        &:hover {
          border-color: #002fa7;
          background-color: #002fa7;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }

  .ywgl-down {
    background-color: #fafbfd;
    margin-top: 10px;

    &>.label {
      font-weight: bold;
    }

    &>.content {
      flex: 1;
      word-break: break-all;
      font-size: 12px;
    }
  }

  .bold {
    font-weight: bold;
  }

  .ywhuaxue {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content: center;

    .analy-link {
      height: 18px;
      line-height: 18px;
      font-size: 12px;
      font-weight: 500;
      color: #002FA7;
      border-bottom: 1px solid #002FA7;
      cursor: pointer;
      margin-right: 5px;
    }

    .huaxue {
      width: 100%;
      max-width: 634px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      align-self: flex-end;

      .preview {
        position: absolute;
        font-size: 12px;
        right: 7px;
        top: 7px;
        align-items: center;
        cursor: pointer;

        img {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }

      .huaxue-desc {
        flex: 1;
      }
    }

    .huaxue-item {
      display: flex;
      margin-bottom: 15px;

      &_label {
        font-weight: 500;
        width: 90px;
        text-align: right;
      }

      &_content {
        flex: 1;
        word-break: break-all;
      }
    }
  }
}

.yfqy {
  font-size: 12px;

  .item {
    margin-bottom: 12px;
    height: 22px;
    line-height: 22px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      width: 50px;
      display: inline-block;
      color: #9aa4b8;
    }

    .content {
      color: #002fa7;

      &:hover {
        font-size: 13px;
        font-weight: bold;
        color: #333;
        cursor: pointer;
      }
    }
  }
}

.syz {
  &>.item {
    margin-bottom: 10px;

    .label {
      display: inline-block;
      width: 50px;
      height: 20px;
      border-radius: 2px;
      border-width: 1px;
      border-style: solid;
      font-size: 12px;
      text-align: center;
      vertical-align: middle;
      box-sizing: border-box;
      line-height: 18px;

      &.green {
        border-color: #9dcc40;
        color: #9dcc40;
      }

      &.blue {
        border-color: #002fa7;
        color: #002fa7;
      }

      &.red {
        border-color: #c14a27;
        color: #c14a27;
      }
    }

    .content {
      flex-wrap: wrap;
      padding-left: 10px;

      .tag {
        font-weight: 400;

        // &:hover {
        //   text-decoration: underline;
        //   color: #002fa7;
        //   cursor: pointer;
        // }
      }
    }
  }
}

.flex {
  display: flex;
}

.flex-dc {
  flex-direction: column;
}

/deep/.el-image__inner {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow: 0px 1px 10px 0px rgb(9 20 79 / 10%);
}

.pop-desc {
  height: 600px;
  overflow: auto;

  .pop-desc-item {
    display: flex;

    &_label {
      width: 80px;
      font-weight: bold;
    }

    &_content {
      flex: 1;
      font-size: 12px;
    }
  }
}

.echarts {
  margin-top: 0 !important;
  width: 50% !important;
  height: 300px;
}

.line3 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 60px;
}

.more-btn {
  z-index: 3;
  line-height: 28px;
  cursor: pointer;
  color: #002fa8;

  .icon {
    transform: rotate(90deg);
  }
}

.zgyfzt-item {
  &:hover {
    text-decoration: underline;
  }
}
</style>