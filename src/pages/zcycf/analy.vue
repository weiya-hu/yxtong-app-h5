<template>
  <div class="analy-wrapeer">
    <!-- 自定义加载界面 -->
    <LoadingGif
      :loadFlag="analyLoading"
      v-if="analyLoading"
    ></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="chart">
      <!-- 顶部统计 -->
      <div class="chart_top">
        <div class="newtotals">
          <div
            class="iconfont newtotals-arrow newtotals-left"
            @click="handleShowScrollLeft"
          >
            &#xe64e;
          </div>
          <div
            class="iconfont newtotals-arrow newtotals-right"
            @click="handleShowScrollRight"
          >
            &#xe64f;
          </div>
          <div class="newtotals-scroll">
            <div class="newtotals-scroll-inner">
              <ul class="total-item">
                <li class="li1">药品品种</li>
                <li class="li2">
                  <span>{{
                    typeof kshTotal.yp == "undefined" ? 0 : kshTotal.yp
                  }}</span
                  >个
                </li>
              </ul>
              <ul class="total-item">
                <li class="li1">药材数量</li>
                <li class="li2">
                  <span>{{
                    typeof kshTotal.yc == "undefined" ? 0 : kshTotal.yc
                  }}</span
                  >种
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="chart_bottom">
        <div class="go-list">
          <router-link tag="a" :to="{ path: '/chufang/list' }"
            >返回列表</router-link
          >
        </div>
        <div class="chart-boxes">
          <DbEcharts title="ATC分类TOP10">
            <div id="sqlx-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
          <DbEcharts title="药材分析TOP10">
            <div id="yclx-bar" class="echarts">
              <div class="nodata-box"></div>
            </div>
          </DbEcharts>
        </div>
      </div>
      <!-- 展开效果 -->
      <div class="dialog hide">
        <div class="menu">
          <div
            v-for="(ti, index) in title"
            v-bind:class="[index == openIndex ? 'active' : '', 'nav']"
            @click="handleOpenIndex(index)"
            :key="index"
          >
            {{ ti }}
          </div>
        </div>
        <div class="echarts-items-wap">
          <div class="echarts-items-title">
            <span class="echart-title">{{ title[openIndex] }}</span>
            <a
              class="esc-btn"
              href="javascript:;"
              @click="handleDialogVisible(false)"
              ><i></i
              ><img src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏"
            /></a>
          </div>
          <div class="echarts-items">
            <div class="echarts-item">
              <!-- 药理 -->
              <div id="sqlx-bar-open" class="open-charts"></div>
            </div>
            <div class="echarts-item">
              <!-- 药材 -->
              <div id="yclx-bar-open" class="open-charts"></div>
            </div>
          </div>
          <div class="ctr-actions">
            <el-button
              class="pre action"
              @click="handleOpenIndex(openIndex - 1)"
              ><i class="el-icon-arrow-left"></i
            ></el-button>
            <el-button
              class="next action"
              @click="handleOpenIndex(openIndex + 1)"
              ><i class="el-icon-arrow-right"></i
            ></el-button>
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

import { mapState, mapGetters } from "vuex";

var _res = {};
const myicon = {
  open:
    "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891"
};

export default {
  components: {
    LoadingGif,
    DbEcharts
  },
  data() {
    return {
      itemWidth: 700,
      promise: null,
      loading: true,
      dialogVisible: false,
      initopen: false, //控制渲染一次
      openIndex: 0, //控制展开第几个图形
      title: ["ATC分类TOP10", "药材分析TOP10"], //图形标题
      // 用于全屏的ATC分类TOP10
      sqlx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于非全屏的ATC分类TOP10
      sqlx_bar2: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于全屏的药材分析TOP10
      yclx_bar: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },
      // 用于非全屏的药材分析TOP10
      yclx_bar2: {
        echarts: null,
        xAxis_data: [],
        series_data: []
      },

      // 记录大屏智能分析的无数据的选项卡
      recordNoData: new Set()
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.Zcycf.nopms,
      kshRes: state => state.Zcycf.kshRes,
      kshTotal: state => state.Zcycf.kshTotal,
      analyLoading: state => state.Zcycf.analyLoading,
      judge: state => state.Zcycf.judge,
      allBase: state => state.Zcycf.allBase,
      res1: state => (_.keys(state.Zcycf.res1).length ? state.Zcycf.res1 : [])
    })
  },
  methods: {
    getImgName(i) {
      return `药智数据企业版-${document.title}-智能分析-${this.title[i]}`;
    },
    initLayout() {
      let screen_width = window.innerWidth;
      let screen_height = window.innerHeight;
      this.itemWidth = screen_width - 244;
      $(".dialog .echarts-items-wap").css("height", screen_height - 50);
      $(".dialog .echarts-items-wap").css("width", screen_width - 244);
      $(".dialog .echarts-items")
        .width((this.itemWidth + 12) * 10)
        .css("margin-left", -this.openIndex * this.itemWidth);
      $(".dialog .echarts-item").width(this.itemWidth - 100);
      // 如果沒有数据，则显示 nodata
      $(".open-charts .nodata-box").show();
    },
    loadData: _.debounce(function() {
      // 加载 aggs API的数量总计
      this.promise = Store.dispatch("Zcycf/getKshRes").then(res => {
        this.update();
        return res;
      });
    }, 10),
    handleOpenIndex(index) {
      if (index > 0 && index < this.title.length) {
        this.openIndex = index;
      } else {
        this.openIndex = 0;
      }

      // 显示 no-data 提示图片
      if (this.recordNoData.has(this.openIndex)) {
        $(".fullcharts").show();
      } else {
        $(".fullcharts").hide();
      }
      $(".echarts-items").css("margin-left", -this.openIndex * this.itemWidth);
    },
    update() {
      // 解决bug 图形绘制重叠清除
      this.dealSqlxBar([]);
      this.ycfxSqlxBar([]);

      this.dealSqlxBar(this.kshRes.ylfl);
      this.ycfxSqlxBar(this.kshRes.ycfl);
    },
    //初始化全屏图形
    initOpendKsh(index) {
      var _that = this;
      this.loading = true;
      this.dialogVisible = true;

      //使用定时器 解决echarts无法在隐藏元素绘制图形问题
      if (!_that.initopen) {
        _that.loading = false;
        setTimeout(() => {
          _that.initLayout();
          _that.initopen = true;

          _that.drawSqlxBarOpen();

          _that.handleOpenIndex(index);
          this.loading = false;
        }, 500);
      } else {
        this.handleOpenIndex(index);
        this.loading = false;
      }
    },
    // ATC分类TOP10
    dealSqlxBar(originalData) {
      let _len = originalData.length;
      if (_len > 0) {
        let xAxis_data = [];
        let series_data = [];

        for (var i = 0; i < _len; i++) {
          xAxis_data.push(originalData[i].key);
          series_data.push({
            value: originalData[i].doc_count,
            name: originalData[i].key
          });
        }

        this.sqlx_bar.xAxis_data = xAxis_data;
        this.sqlx_bar.series_data = series_data;

        this.sqlx_bar2.xAxis_data = xAxis_data;
        this.sqlx_bar2.series_data = series_data;

        this.drawSqlxBar();

        // this.recordNoData.delete(2);
      } else {
        // this.recordNoData.add(2);
        $("#sqlx-bar").html('<div class="nodata-box"></div>');
        $("#sqlx-bar").removeAttr("_echarts_instance_");
      }
    },
    // ATC分类TOP10
    drawSqlxBar() {
      var _that = this;
      _that.sqlx_bar2.echarts = Echarts.init(
        document.getElementById("sqlx-bar"),
        "yaozh_theme"
      );

      _that.sqlx_bar2.echarts.setOption({
        color: _that.sqlx_bar.color,
        tooltip: {
          trigger: "item",
          formatter: "{b}:<br />药品数量: {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.handleTogglePie("sqlx-bar", _that.sqlx_bar2, 0);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(0);
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 0
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 45,
            formatter: function(vals) {
              return vals.length > 10 ? `${vals.slice(0, 10)}...` : vals;
            }
          },
          data: this.sqlx_bar2.xAxis_data.slice(0, 10)
        },
        yAxis: {
          type: "value",
          name: "药品数量"
        },
        series: [
          {
            data: this.sqlx_bar2.series_data.slice(0, 10),
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          }
        ]
      });
    },
    // ATC分类TOP10/药材
    drawSqlxBarOpen() {
      var _that = this;

      Echarts.init(
        document.getElementById("sqlx-bar-open"),
        "yaozh_theme"
      ).setOption({
        color: _that.sqlx_bar.color,
        tooltip: {
          trigger: "item",
          formatter: "{b}:<br />药品数量: {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(0),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.handleTogglePie(
                  "sqlx-bar-open",
                  _that.sqlx_bar,
                  undefined
                );
              }
            }
          }
        },
        grid: {
          containLabel: true,
          bottom: 0
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 45
          },
          data: this.sqlx_bar.xAxis_data.slice(0, 10)
        },
        yAxis: {
          type: "value",
          name: "药品数量"
        },
        series: [
          {
            data: this.sqlx_bar.series_data.slice(0, 10),
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          }
        ]
      });
      Echarts.init(
        document.getElementById("yclx-bar-open"),
        "yaozh_theme"
      ).setOption({
        color: _that.yclx_bar.color,
        tooltip: {
          trigger: "item",
          formatter: "{b}:<br />出现次数: {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.handleTogglePie(
                  "yclx-bar-open",
                  _that.yclx_bar,
                  undefined
                );
              }
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 45
          },
          data: this.yclx_bar.xAxis_data.slice(0, 10)
        },
        yAxis: {
          type: "value",
          name: "出现次数"
        },
        series: [
          {
            data: this.yclx_bar.series_data.slice(0, 10),
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          }
        ]
      });
    },
    // 药材分析TOP10
    ycfxSqlxBar(originalData) {
      let _len = originalData.length;
      if (_len > 0) {
        let xAxis_data = [];
        let series_data = [];

        for (var i = 0; i < _len; i++) {
          xAxis_data.push(originalData[i].yaocai);
          series_data.push({
            value: originalData[i].num,
            name: originalData[i].yaocai
          });
        }

        this.yclx_bar.xAxis_data = xAxis_data;
        this.yclx_bar.series_data = series_data;

        this.yclx_bar2.xAxis_data = xAxis_data;
        this.yclx_bar2.series_data = series_data;

        this.ycfxDrawSqlxBar();

        // this.recordNoData.delete(2);
      } else {
        // this.recordNoData.add(2);
        $("#yclx-bar").html('<div class="nodata-box"></div>');
        $("#yclx-bar").removeAttr("_echarts_instance_");
      }
    },
    // 药材分析TOP10
    ycfxDrawSqlxBar() {
      var _that = this;
      _that.yclx_bar2.echarts = Echarts.init(
        document.getElementById("yclx-bar"),
        "yaozh_theme"
      );

      _that.yclx_bar2.echarts.setOption({
        color: _that.yclx_bar.color,
        tooltip: {
          trigger: "item",
          formatter: "{b}:<br />出现次数: {c}"
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "饼形图",
              icon: "image:///static/imgs/echarts/pie.png",
              onclick() {
                _that.handleTogglePie("yclx-bar", _that.yclx_bar2, 1);
              }
            },
            myMagnify: {
              show: true,
              title: "全屏",
              icon: "image:///static/imgs/echarts/fullscreen.png",
              onclick() {
                _that.initOpendKsh(1);
              }
            }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 45
          },
          data: this.yclx_bar2.xAxis_data.slice(0, 10)
        },
        yAxis: {
          type: "value",
          name: "出现次数"
        },
        series: [
          {
            data: this.yclx_bar2.series_data.slice(0, 10),
            type: "bar",
            label: {
              show: true,
              position: "top"
            }
          }
        ]
      });
    },
    // 药材分析TOP10
    ycfxSqlxBarOpen() {
      var _that = this;
      Echarts.init(
        document.getElementById("yclx-bar-open"),
        "yaozh_theme"
      ).setOption({
        legend: {
          type: "scroll",
          bottom: 0,
          data: _that.yclx_bar.xAxis_data
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
              name: _that.getImgName(1),
              icon: "image:///static/imgs/echarts/download.png"
            },
            myTogglePie: {
              show: true,
              title: "柱形图",
              icon: "image:///static/imgs/echarts/bar.png",
              onclick() {
                _that.handleToggleBar(
                  "yclx-bar-open",
                  _that.yclx_bar,
                  undefined
                );
              }
            }
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>出现次数{c}<br/>占比：{d}%"
        },
        series: [
          {
            type: "pie",
            label: {
              normal: {
                show: true,
                position: "outside",
                formatter: "{b}{d}%"
              }
            },
            data: this.yclx_bar.series_data
          }
        ]
      });
    },
    handleDialogVisible(value) {
      this.dialogVisible = value;
      // 退出全屏的时候需要将initopen改为false，不然不会重新渲染图标。
      this.initopen = value;
    },
    // 切换为饼形图
    handleTogglePie(el, data, index) {
      let _that = this;
      let option;
      if (el == "yclx-bar" || el == "yclx-bar-open") {
        // 药材分析 专属饼形图属性
        option = {
          color: data.color,
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.handleToggleBar(el, data, index);
                }
              },
              myMagnify: {
                show: el == "yclx-bar" ? true : false,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>出现次数:{c}"
          },
          series: [
            {
              type: "pie",
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%"
                }
              },
              data: data.series_data
            }
          ]
        };
      } else if (el == "sqlx-bar" || el == "sqlx-bar-open") {
        // 药理分类 专属饼形图属性
        option = {
          color: data.color,
          legend: {
            type: "scroll",
            bottom: 0,
            data: data.xAxis_data
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myToggleBar: {
                show: true,
                title: "柱形图",
                icon: "image:///static/imgs/echarts/bar.png",
                onclick() {
                  _that.handleToggleBar(el, data, index);
                }
              },
              myMagnify: {
                show: el == "sqlx-bar" ? true : false,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>药品数量:{c}"
          },
          series: [
            {
              type: "pie",
              label: {
                normal: {
                  show: true,
                  position: "outside",
                  formatter: "{b}{d}%"
                }
              },
              data: data.series_data
            }
          ]
        };
      }

      if (index == undefined) {
        option.toolbox.feature.myMagnify = {};
      }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      //chart.clear()
      chart.setOption(option);
    },
    // 切换为柱形图
    handleToggleBar(el, data, index) {
      let _that = this;
      let option;
      if (el == "yclx-bar" || el == "yclx-bar-open") {
        option = {
          color: data.color,
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />出现次数: {c}"
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.handleTogglePie(el, data, index);
                }
              },
              myMagnify: {
                show: el == "yclx-bar" ? true : false,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          grid: {
            containLabel: true
          },
          xAxis: {
            type: "category",
            axisLabel: {
              rotate: 45
            },
            data: data.xAxis_data.slice(0, 10)
          },
          yAxis: {
            type: "value",
            name: "出现次数"
          },
          series: [
            {
              data: data.series_data.slice(0, 10),
              type: "bar",
              label: {
                show: true,
                position: "top"
              }
            }
          ]
        };
      } else if (el == "sqlx-bar" || el == "sqlx-bar-open") {
        option = {
          color: data.color,
          tooltip: {
            trigger: "item",
            formatter: "{b}:<br />药品数量: {c}"
          },
          toolbox: {
            feature: {
              saveAsImage: {
                title: "保存",
                name: _that.getImgName(index),
                icon: "image:///static/imgs/echarts/download.png"
              },
              myTogglePie: {
                show: true,
                title: "饼形图",
                icon: "image:///static/imgs/echarts/pie.png",
                onclick() {
                  _that.handleTogglePie(el, data, index);
                }
              },
              myMagnify: {
                show: el == "sqlx-bar" ? true : false,
                title: "全屏",
                icon: "image:///static/imgs/echarts/fullscreen.png",
                onclick() {
                  _that.initOpendKsh(index);
                }
              }
            }
          },
          grid: {
            containLabel: true,
            bottom: 0
          },
          xAxis: {
            type: "category",
            axisLabel: {
              rotate: 45
            },
            data: data.xAxis_data.slice(0, 10)
          },
          yAxis: {
            type: "value",
            name: "药品数量"
          },
          series: [
            {
              data: data.series_data.slice(0, 10),
              type: "bar",
              label: {
                show: true,
                position: "top"
              }
            }
          ]
        };
      }

      // if (index == undefined) {
      //   option.toolbox.feature.myMagnify = {};
      // }
      $("#" + el).removeAttr("_echarts_instance_");
      let chart = Echarts.init(document.getElementById(el), "yaozh_theme");
      chart.setOption(option);
    },
    initShowScroll() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 150);
      if (150 * num <= outterWidth) {
        $(".newtotals-left").hide();
        $(".newtotals-right").hide();
        $(".newtotals .total-item").css({
          width: 100 / num + "%"
        });
        $(".newtotals-scroll").css({
          width: "100%",
          margin: "0"
        });
        $(".newtotals-scroll-inner").css({
          width: "100%"
        });
      } else {
        $(".newtotals-left").show();
        $(".newtotals-right").show();
        $(".newtotals-scroll").css({
          width: 150 * maxNum,
          margin: "0px 30px"
        });
        $(".newtotals-scroll-inner").css({
          width: 150 * num
        });
        $(".newtotals .total-item").css({
          width: 150
        });
      }
    },
    handleShowScrollLeft() {
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 0 && pointer % 150 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer + 150
          },
          300
        );
      }
    },
    handleShowScrollRight() {
      let outterWidth = Number($(".newtotals").width());
      let num = Number($(".newtotals .total-item").length);
      let maxNum = parseInt((outterWidth - 60) / 150);
      let pointer = Number(
        _.replace($(".newtotals-scroll-inner").css("left"), "px", "")
      );
      if (pointer != 150 * (maxNum - num) && pointer % 150 == 0) {
        $(".newtotals-scroll-inner").animate(
          {
            left: pointer - 150
          },
          300
        );
      }
    },
    echartsResizeHandler() {
      if (this.dialogVisible) {
        this.initLayout();
        this.echartsResize("open-charts");
      }
      this.$nextTick(() => {
        this.echartsResize("echarts");
      });
    }
  },
  created() {
    this.initLayout();
    // this.loadData()
    if (this.judge) {
      Store.dispatch("Zcycf/getKshRes");
    }
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    window.addEventListener("resize", this.echartsResizeHandler);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.ksh);
    this.update()
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.ksh);
    this.initShowScroll();
  },
  watch: {
    kshRes() {
      this.update();
    },
    $route() {
      if (
        this.$route.path === "/chufang/analy" &&
        Object.keys(this.kshRes).length <= 1
      ) {
        this.loadData();
      }
      if (this.$route.path === "/chufang/analy") {
        window.addEventListener("resize", this.echartsResizeHandler);
      } else {
        window.removeEventListener("resize", this.echartsResizeHandler);
        this.echartsClear("open-charts");
        this.echartsClear("echarts");
      }
      if (this.$route.path === "/chufang/list" && !this.res1.length) {
        Store.dispatch("Zcycf/nomalSearch", { queryToPutong: false });
      }
    },
    dialogVisible() {
      if (this.dialogVisible) {
        $(".dialog").removeClass("hide");
        this.initLayout();
        this.echartsResize("open-charts");
      } else {
        $(".dialog").addClass("hide");
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.zcycf {
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
  .chart {
    .chart_top {
      position: relative;
      background-color: #eff2fa;
    }
    .chart_bottom {
      background-color: #eff2fa;

      .go-list {
        height: 22px;
        line-height: 30px;
        text-align: right;
        padding-right: 40px;
        font-size: 14px;

        a:hover {
          color: #4877e8;
        }
      }
    }
    .newtotals {
      // margin-top: 20px!important;
      height: 130px;
      background-color: @White;
      box-shadow: 0 0;
      // border-top: 1px solid #dfe5f1;
      overflow: hidden;
      display: flex;
      justify-content: center;
      position: relative;
      .newtotals-scroll {
        width: 100%;
        overflow: hidden;
        position: relative;
        .newtotals-scroll-inner {
          position: absolute;
          width: 100%;
          top: 0px;
          left: 0px;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          flex-wrap: nowrap;
        }
      }
      .newtotals-arrow {
        display: none;
        height: 130px;
        line-height: 130px;
        width: 30px;
        color: @PrimaryColor;
        font-size: 20px;
        text-align: center;
        position: absolute;
        top: 0px;
        cursor: pointer;
        &:hover {
          background-color: rgba(222, 222, 222, 0.5);
        }
      }
      .newtotals-left {
        left: 0px;
      }
      .newtotals-right {
        right: 0px;
      }
      .newtotals-disabled {
        color: #aaa;
        cursor: normal;
        &:hover {
          background-color: transparent;
        }
      }
      .total-item {
        display: inline-block;
        width: 10%;
        min-width: 127px;
        height: 127px;
        text-align: center;
        vertical-align: text-bottom;
        border-bottom: 3px solid @White;
        &:hover {
          color: @PrimaryColor;
          background-color: #eff2fa;
          border-bottom: 3px solid @PrimaryColor;
        }
        .li1 {
          padding-top: 30px;
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
          width: 1414px * 10;
          height: 700px;
          overflow-y: scroll;
          overflow-x: hidden;
          .echarts-item {
            display: inline-block;
            margin: 0px 50px;
            width: 1300px;
            height: 900px;
          }
          .open-charts {
            width: 100%;
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
  }
}
</style>
