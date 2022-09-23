<template>
  <div id="table-bar" style="height: 500px; width: 100%"></div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      maxNum: 1,
    };
  },
  // computed: {

  // },
  watch: {
    chinaData: {
      handler(val) {
        this.setTime();
      },
      immediate: true,
    },
  },
  props: {
    chinaData: {
      default: [],
      type: Array,
    },
    targets: {
      default: "",
      type: String,
    },
    router: {
      default: "newdrug",
      type: String,
    },
  },
  methods: {
    setTime() {
      setTimeout(() => {
        if (document.getElementById("table-bar")) {
          this.drawSbqsBarOpen(this.chinaData);
        } else {
          this.setTime();
        }
      }, 20);
    },
    drawSbqsBarOpen(arrData) {
      var _that = this;
      let legend = ["上市", "进行中", "暂停", "停止", "撤市", "无研发进展"];
      let datas = [];
      let linedata = [];
      legend.forEach((e) => {
        let num = [];
        arrData.forEach((v) => {
          num.push(v[e] ? v[e] : 0);
          let ns = 0;
          Object.keys(v).forEach((n) => {
            if (n !== "name") {
              ns = ns + v[n];
              console.log(ns, v[n])
            }
          });
          linedata.push(ns);
        });
        datas.push({
          name: e,
          type: "bar",
          stack: "总量",
          barMaxWidth: 20,
          // legendHoverLink: false,
          label: {
            show: true,
            // position: ['50%', '50%'],
            align: "center",
            verticalAlign: "middle",
            color: "#fff",
            // formatter: '{a|{c}}',
            formatter: function (params) {
              if (params.name === "无研发进展报道" && params.value) {
                return "{a|" + params.value + "}";
              }
              // return '{'+ params.name === "无研发进展报道" ? 'a' : 'b' +'|' + params.value ? '{c}' : '' + '}'
              return params.value ? params.value : "";
            },
            rich: {
              a: {
                color: "#36364b",
              },
            },
          },
          data: num,
        });
      });
      let myChart = Echarts.init(
        document.getElementById("table-bar"),
        "yaozh_theme"
      );
      console.log(linedata, {
        color: [
          "#91C332",
          "#91adf1",
          "#fbc78e",
          "#ff9a75",
          "#56596C",
          "#E0E0E0",
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        legend: {
          textStyle: {
            color: "#87A2EE",
          },
          itemGap: 40,
          icon: "rect",
          bottom: 20,
          itemWidth: 20,
          itemHeight: 20,
          selector: false,
          data: legend,
        },
        grid: {
          left: "10%",
          right: "10%",
          top: "10%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          name: "数量",
          nameTextStyle: {
            color: "#87A2EE",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            show: false,
          },
          type: "value",
        },
        yAxis: {
          name: "研发状态",
          nameTextStyle: {
            color: "#87A2EE",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            color: "#545b6d",
          },
          type: "category",
          data: _.map(_that.chinaData, "name"),
        },
        series: datas.concat({
          name: "总数",
          type: "line",
          symbolSize: 1,
          symbol: "circle",
          lineStyle: {
            color: "rgba(0,0,0,0)",
          },
          label: {
            show: true,
            position: "right",
            color: "#545B6D",
            fontSize: 14,
            fontWeight: 700,
            verticalAlign: "middle",
            lineHeight: 20,
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            },
          },
          itemStyle: {
            normal: {
              color: "rgba(0,0,0,0)",
            },
          },
          data: linedata,
        }),
      })
      myChart.setOption({
        color: [
          "#91C332",
          "#91adf1",
          "#fbc78e",
          "#ff9a75",
          "#56596C",
          "#E0E0E0",
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        legend: {
          textStyle: {
            color: "#87A2EE",
          },
          itemGap: 40,
          icon: "rect",
          bottom: 20,
          itemWidth: 20,
          itemHeight: 20,
          selector: false,
          data: legend,
        },
        grid: {
          left: "10%",
          right: "10%",
          top: "10%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          name: "数量",
          nameTextStyle: {
            color: "#87A2EE",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            show: false,
          },
          type: "value",
        },
        yAxis: {
          name: "研发状态",
          nameTextStyle: {
            color: "#87A2EE",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#DCDFE6",
            },
          },
          axisLabel: {
            color: "#545b6d",
          },
          type: "category",
          data: _.map(_that.chinaData, "name"),
        },
        series: datas.concat({
          name: "总数",
          type: "line",
          symbolSize: 1,
          symbol: "circle",
          lineStyle: {
            color: "rgba(0,0,0,0)",
          },
          label: {
            show: true,
            position: "right",
            color: "#545B6D",
            fontSize: 14,
            fontWeight: 700,
            verticalAlign: "middle",
            lineHeight: 20,
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            },
          },
          itemStyle: {
            normal: {
              color: "rgba(0,0,0,0)",
            },
          },
          data: linedata,
        }),
      });
      myChart.off();
      myChart.on("click", function (params) {
        if (params.name) {
          let st = {
            // "撤市": ['11'],
            // '批准上市': ['10', '11'],
            // '注册申请': ['9'],
            // '预注册申请': ['8'],
            // '临床Ⅲ期': ['7'],
            // '临床Ⅱ期': ['6'],
            // '临床Ⅰ期': ['5'],
            // '临床前': ['4'],
            // '停止': ['3'],
            // '暂停': ['2'],
            // '无研发进展报道': ['1']
            // "撤市": ['11'],
            批准上市: ["11", "2"],
            注册申请: ["10"],
            临床Ⅲ期: ["9"],
            临床Ⅱ期: ["8"],
            临床Ⅰ期: ["7"],
            临床申请: ["6"],
            临床前: ["5"],
            停止: ["4"],
            暂停: ["3"],
            无研发进展报道: ["1"],
          };
          if (_that.router === "newdrug") {
            const { href } = _that.$router.resolve({
              path: `/${_that.router}`,
              query: {
                filter_condition: JSON.stringify({
                  worldstatusorder: st[params.name],
                }),
                target_eq: _that.targets,
              },
            });
            window.open(href, "_blank");
          } else if (_that.router === "report") {
            const { href } = _that.$router.resolve({
              path: `/${_that.router}`,
              query: {
                filter_condition: JSON.stringify({
                  worldstatusorder: st[params.name],
                }),
                target_eq: _that.targets,
              },
            });
            window.open(href, "_blank");
          }
          // window.open('/newdrug?filter_condition=' + JSON.stringify({worldstatusorder: st[params.name]}) + '&target_eq=' + _that.targets, '_blank')
        }
      });
      // 图例改变重新绘制
      myChart.on("legendselectchanged", function (params) {
        let sel = [];
        let drawdata = _.cloneDeep(_that.chinaData);
        Object.keys(params.selected).forEach((v) => {
          if (!params.selected[v]) {
            sel.push(v);
          }
        });

        drawdata.forEach((v) => {
          sel.forEach((e) => {
            if (v[e]) {
              v[e] = 0;
            }
          });
        });
        _that.drawSbqsBarOpen(drawdata);
      });
    },
  },
  created() { },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.table-ul {
  // margin-top: 30px;
}

.ul1 {
  display: flex;
  align-items: center;
  background: #e1e6f0;
  height: 40px;
  font-size: 13px;
  color: #35384a;
  font-weight: 700;

  li:nth-child(1n + 2) {
    flex: 1;
    text-align: center;
  }

  li:first-child {
    padding-left: 30px;
    width: 200px;
    text-align: left;
  }
}

.ul2 {
  display: flex;
  height: 64px;
  border-bottom: 1px solid #dfe5f1;
  border-left: 1px solid #dfe5f1;
  border-right: 1px solid #dfe5f1;

  li:nth-child(1n + 2) {
    flex: 1;
    text-align: center;
    margin-left: 1px;
    padding: 20px 0;

    .bgs {
      line-height: 24px;
      font-size: 13px;
      font-weight: 700;
      color: #35384a;
    }

    a {
      text-decoration: underline;
    }

    a.colorF {
      color: #fff;
    }
  }

  li:first-child {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 30px;
    padding-right: 10px;
    width: 200px;
    text-align: left;

    .only {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      display: inline-block;
      padding: 0 12px;
      background: @Green;
      border-radius: 10px;
      height: 20px;
      line-height: 20px;
      color: #fff;
    }

    .height20 {
      height: 20px;
    }

    .colbg {
      border: 1px solid #4877e8;
      color: #4877e8;
      background: none;
      box-sizing: border-box;
    }

    span.color2 {
      background: #fbc78e;
    }

    span.color3 {
      background: #ff9a75;
    }

    span.color4 {
      color: #666;
      background: #e4ebfb;
    }

    span.color5 {
      color: #666;
      background: #c8d6f8;
    }

    span.color6 {
      color: #666;
      background: #acc2f5;
    }

    span.color7 {
      background: #91adf1;
    }

    span.color8 {
      background: #638beb;
    }

    span.color9 {
      background: #4877e8;
    }

    span.color10 {
      background: #91c332;
    }

    span.color11 {
      background: #56596c;
    }
  }
}
</style>
