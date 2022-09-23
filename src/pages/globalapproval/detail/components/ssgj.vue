<template>
  <div class="ssgj">
    <div class="d3Tree" ref="d3Tree" @mousemove="d3TreeMove">
      <svg class="d3Tree_svg" id="d3Tree_svg">
        <g
          class="svg_content"
          :transform="
            'translate(' +
              (zoomPosition.translate || '50,50') +
              ') scale(' +
              (zoomPosition.scale || 1) +
              ')'
          "
          id="svg_content"
        >
          <g class="content_r" id="content_r"></g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    // 活性成分
    name: {
      type: String,
      required: true
    },
    // 活性成分中文名称
    cname: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      width: 150,
      height: 60,
      widthN: 2,
      widthNR: 2,
      heightN: 30,
      timeOutId: null,
      svgData: {},
      d3Tree_hover_dom: {},
      d3Tree_hover_show: false,
      arrDAta: null,
      zoomPosition: {}
    };
  },
  mounted() {
    this.d3Tree_hover_dom = this.$refs.d3Tree_hover;
    this.getEchartsData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsResize("guojia");
    });
  },
  methods: {
    getloading() {
      const { citationsize, citationedsize } = this.data;
      if (citationsize + citationedsize > 100) {
        this.firstTree();
      } else {
        this.getEchartsData();
      }
    },
    d3TreeMove(e) {
      let all = this.d3Tree_hover_dom;
      if (all) {
        all.style.left = e.screenX - all.offsetWidth - 50 + "px";
        all.style.top = e.screenY - all.offsetHeight + "px";
      }
    },
    firstTree() {
      this.sendLoadingP({ isnoDAta: false });
      let children = [
        {
          name: "引用",
          change: "yy",
          deep: 0,
          citationsize: 1
        },
        {
          name: "被引用",
          deep: 0,
          change: "byy",
          citationsize: 1
        }
      ];

      this.getTree(children[0], true, true);
      this.getTree(children[1], false, true);
    },
    sendLoadingP(val) {
      this.$emit("isLoading", val);
    },
    // childrenLoading()
    changeSize(a, b) {
      var c = a > b ? a : b;
      return c;
    },
    getTree(root, direction, isfirst) {
      let _this = this;
      let d3Tree = this.$refs.d3Tree;
      let offsetWidth = d3Tree.offsetWidth,
        offsetHeight = d3Tree.offsetHeight;

      var width = this.changeSize(
          _this.height * _this.heightN,
          offsetWidth / 2
        ),
        height = this.changeSize(
          _this.width * (_this.widthN + _this.widthNR),
          offsetHeight
        ); // 修改线条长度

      d3.select("#content_m").attr(
        "transform",
        "translate(" + height / 2 + ", " + width / 2 + ")"
      );
      var tree = d3.layout
        .tree()
        .size([width, height])
        .separation(function(a, b) {
          return a.parent == b.parent ? 1 : 2;
        });
      var zoom = d3.behavior
        .zoom()
        .scaleExtent([0.1, 2])
        .on("zoom", function(d) {
          let event = d3.event;
          if (_this.arrDAta) {
            _this.arrDAta.map((val, index) => {
              let i = event.translate[index];
              event.translate[index] = i + val;
            });
          }
          _this.zoomPosition = event;
        });

      var svg = d3
        .select("#d3Tree_svg")
        .call(zoom)
        .attr("width", offsetWidth)
        .attr("height", offsetHeight);
      // 相当于zoom（svg）;

      // addTree(root);
      addTree(root, direction);
      // addTree(root,direction);
      function addTree(root, direction) {
        d3.select("#content_r").remove();

        var diagonal = d3.svg.diagonal().projection(function(d) {
          if (!d.parent && d.children) {
            return [height / 2 + 150, width / 2];
          } else {
            return [height / 2 + 150 + d.y, d.x];
          }
        });

        let svgC = "";
        if (!d3.select("#content_r")[0][0]) {
          svgC = d3
            .select("#svg_content")
            .append("g")
            .attr("class", "content_r")
            .attr("id", "content_r");
        } else {
          svgC = d3.select("#content_r");
        }
        var nodes = tree.nodes(root);
        var links = tree.links(nodes);

        //用来为每一个节点的children添加一个备份**
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].children) {
            nodes[i].childrenB = nodes[i].children;
          }
        }

        var link = svgC
          .selectAll(".link")
          .data(links)
          .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", diagonal);

        var node = svgC
          .selectAll(".node")
          .data(nodes)
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            if (direction) {
              if (d.deep == 0) {
                return (
                  "translate(" + (height / 2 - 150) + "," + width / 2 + ")"
                );
              } else {
                return (
                  "translate(" +
                  (height / 2 - 150 - d.y) +
                  "," +
                  (width - d.x) +
                  ")"
                );
              }
            } else {
              if (d.deep == 0) {
                return (
                  "translate(" + (height / 2 + 150) + "," + width / 2 + ")"
                );
              } else {
                return (
                  "translate(" + (height / 2 + 150 + d.y) + "," + d.x + ")"
                );
              }
            }
          });

        node
          .append("text")
          .attr("dx", function(d) {
            var nam = d.name ? d.name : "";
            let len = nam.length * 9;
            if (direction) {
              if (d.deep == 0 && !d.children) {
                return 10;
              } else {
                return d.children ? len : -len;
              }
            } else {
              return d.children ? -10 : 10;
            }
          })
          .attr("dy", 4)
          .style("text-anchor", function(d) {
            return d.children ? "end" : "start";
          })
          .attr("class", function(d) {
            let className = "parNode";

            if (d.name === "查看更多") {
              className = "more";
            } else if (d.depth == 2) {
              className = "subNode";
            }
            return className;
          })
          .text(function(d) {
            return d.name;
          })
          .on("mouseover", function(data) {
            // hover事件
            if (data.deep && data.deep != 0) {
              _this.svgData = data;
              _this.d3Tree_hover_show = true;

              if (_this.timeOutId) {
                clearTimeout(_this.timeOutId);
              }
            }
          })
          .on("mouseout", function(d, e) {
            _this.timeOutId = setTimeout(function() {
              _this.d3Tree_hover_show = false;
            }, 500);
          })
          .on("click", function(d) {
            let path = "/",
              query = {};
            if (_this.name) {
              _this.name = _this.name;
            } else {
              _this.name = _this.cname;
            }
            if (d.depth == 2 && d.name == "查看更多") {
              switch (d.parent.name) {
                case "中国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "中国",
                        key: "中国",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "美国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "美国",
                        key: "美国",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "欧盟HMA":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "欧盟HMA",
                        key: "欧盟HMA",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "欧盟EMA":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "欧盟EMA",
                        key: "欧盟EMA",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "日本":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "日本",
                        key: "日本",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "英国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "英国",
                        key: "英国",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "德国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "德国",
                        key: "德国",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "法国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "法国",
                        key: "法国",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "加拿大":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "加拿大",
                        key: "加拿大",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "印度":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "印度",
                        key: "印度",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
                case "中国台湾":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "中国台湾",
                        key: "中国台湾",
                        checked: 1
                      }
                    ]),
                    name_eq: _this.name
                  };
                  break;
              }
              const { href } = _this.$router.resolve({
                path,
                query
              });
              window.open(href, "_blank");
            } else if (d.depth == 2 && d.name != "查看更多") {
              switch (d.parent.name) {
                case "中国":
                  path += "cfdadrug/list";
                  query = {
                    name_eq: d.name
                  };
                  break;
                case "美国":
                  path += "fdadrugnew/list";
                  query = {
                    drugname_eq: d.name
                  };
                  break;
                case "欧盟HMA":
                  path += "epyp";
                  query = {
                    name_eq: d.name,
                    filter_condition: JSON.stringify({
                      source: [2]
                    })
                  };
                  break;
                case "欧盟EMA":
                  path += "epyp";
                  query = {
                    name_eq: d.name,
                    filter_condition: JSON.stringify({
                      source: [1]
                    })
                  };
                  break;
                case "日本":
                  path += "pmda";
                  query = {
                    tname_eq: d.name
                  };
                  break;
                case "英国":
                  path += "uk";
                  query = {
                    name_eq: d.name
                  };
                  break;
                case "德国":
                  path += "germany";
                  query = {
                    name_eq: d.name
                  };
                  break;
                case "法国":
                  path += "france";
                  query = {
                    name_eq: d.name
                  };
                  break;
                case "加拿大":
                  path += "canada";
                  query = {
                    productname_eq: d.name
                  };
                  break;
                case "印度":
                  path += "india";
                  query = {
                    brandname_eq: d.name
                  };
                  break;
                case "中国台湾":
                  path += "taiwan";
                  query = {
                    name_eq: d.name
                  };
                  break;
              }
              const { href } = _this.$router.resolve({
                path,
                query
              });
              window.open(href, "_blank");
            }
          });

        node
          .append("circle")
          .attr("class", function(d) {
            let val = "circle";
            let flag = d.flag;
            if (flag) {
              val = "circlefill";
            }
            if (d.depth > 1) {
              val += " subCircle";
            }
            return val;
          })
          .attr("r", 4.5)
          .on("click", function(d) {
            if (d.children) {
              //如果这个节点有children属性，则删除并重新绘图
              d.flag = true;
              delete d.children;
              addTree(root, direction);
            } else {
              // if()
              d.flag = false;
              //否则的话，检测这个节点是否有childrenB属性，有的话为这个节点添加children属性，并重新绘图
              if (d.childrenB) {
                d.children = d.childrenB;

                addTree(root, direction);
              } else {
                let citationsize = d.citationsize;
                if (citationsize ? citationsize != 0 : false) {
                  _this.getEchartsData(
                    d.deep + 1,
                    d.publicationkey,
                    d.change,
                    d.deepXunhuan
                  );
                }
              }
            }
          });
      }
      function timeoutrun() {
        let svg_content = document.getElementById("svg_content");
        let content_m = document.getElementById("content_m");
        let d3Tree_svg = document.getElementById("d3Tree_svg");
        let svg_contentV = svg_content.getBBox();

        let id = null;
        if (svg_contentV.width == 0) {
          id = setTimeout(function() {
            timeoutrun();
            clearTimeout(id);
          }, 200);
          return;
        }
        id = null;
        let d3Width = d3Tree_svg.clientWidth;
        let d3Height = d3Tree_svg.clientHeight;
        let arr = [
          -150,
          d3Height / 2 - svg_contentV.height / 2 - svg_contentV.y
        ];
        _this.arrDAta = arr;
        _this.zoomPosition = {
          translate: arr
        };
      }
      timeoutrun();
    },

    getEchartsData(deep = 1, publicationkey, change, deepXunhuan) {
      let _this = this;
      var _data = this.data;

      function deepFor(arr) {
        _this.heightN = _this.changeSize(arr.length, _this.heightN);

        if (arr) {
          var a = arr.map((val, index) => {
            val.children = val.children;
            val.deep = deep;
            return val;
          });
          return a;
        }
      }
      let fatherR = deepFor(_data);
      var obj = {};
      if (deep == 1) {
        // obj = {
        //   name: _this.name,
        //   children: fatherR
        // };
        // _this.chartObject = obj;
        obj = {
          children: fatherR
        };
        obj = {
          children: [
            {
              name: fatherR[0].name,
              deep: 0,
              change: "byy",
              children: fatherR[0].children
            }
          ]
        };
        _this.chartObject = obj;
      } else {
        var chartObject = _this.chartObject;
        function deepFour(arr, adddarr) {
          if (!arr) {
            return;
          }
          if (arr.constructor == Array) {
            arr.map(val => {
              if (val.deepXunhuan == deepXunhuan) {
                val.children = adddarr;
              } else {
                deepFour(val.children, adddarr);
              }
            });
          } else {
            if (arr.deepXunhuan == deepXunhuan) {
              arr.children = adddarr;
            } else {
              deepFour(arr.children, adddarr);
            }
          }
        }
        deepFour(chartObject.children[1], fatherR);
        _this.widthNR = deep;
        obj = chartObject;
      }
      if (deep == 1) {
        this.getTree(obj.children[0], false, true);
      } else {
        this.getTree(obj.children[0], false);
      }
    }
  }
};
</script>

<style lang="less">
.ssgj {
  height: 100%;
}
.d3Tree {
  height: 100%;
  .d3Tree_hover {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    transition: 0.1s;
  }
  .d3Tree_svg {
    height: 100%;
    min-width: 100%;
    min-height: 600px;
    background-color: #fcfcfc;
    fill: #545b6d;
    .svg_content {
      .link {
        fill: none;
        stroke: #dfe5f1;
        stroke-width: 1px;
      }
      .node {
        .more {
          fill: #4877e8;
        }
        .subNode {
          fill: #868ea3;
        }
        .parNode {
          fill: #545b6d;
        }
        cursor: pointer;
        .circle {
          fill: white;
          stroke: #4877e8;
        }
        .circlefill {
          fill: #4877e8;
          stroke: #4877e8;
        }
        &:hover {
          .subNode,
          .subCircle {
            fill: #4877e8;
          }
        }
      }

      .content_m {
        .text {
          text-anchor: middle;
          dominant-baseline: middle;
        }
      }
      .content_r {
        min-height: 600px;
        min-width: 500px;
      }
    }
  }
}
</style>
