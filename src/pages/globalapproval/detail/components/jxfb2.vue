<template>
  <div class="jxfb">
    <div class="d3Tree" ref="d3Tree" @mousemove="d3TreeMove">
      <svg class="d3Tree_svg" id="d3Tree_svg"></svg>
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
    // this.getEchartsData();
    // 如果活性成分中文名称为空 就使用英文名称
    if (!this.cname) {
      this.data[0].name = this.name;
    }
    this.getTreeData(this.data[0]);
    console.log($("#d3Tree_svg"));
  },
  methods: {
    getTreeData(treeData) {
      console.log(treeData);
      // Calculate total nodes, max label length
      var totalNodes = 0;
      var maxLabelLength = 0;
      // variables for drag/drop
      var selectedNode = null;
      var draggingNode = null;
      // panning variables
      var panSpeed = 200;
      var panBoundary = 20; // Within 20px from edges will pan when dragging.
      // Misc. variables
      var i = 0;
      var duration = 600,
        delay = 0,
        ease = [0.5];
      var root;

      // size of the diagram
      var viewerWidth = $(".jxfb").width();
      var viewerHeight = $(".jxfb").height();

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
        );
      console.log(width, height);
      var tree = d3.layout
        .tree()
        .size([width/2, height/2])
        .separation(function(a, b) {
          return a.parent == b.parent ? 1 : 2;
        });

      // define a d3 diagonal projection for use by the node paths later on.
      var diagonal = d3.svg.diagonal().projection(function(d) {
        console.log(d);
        return [d.y * 3.5, d.x];
      });

      // A recursive helper function for performing some setup by walking through all nodes

      function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
          var count = children.length;
          for (var i = 0; i < count; i++) {
            visit(children[i], visitFn, childrenFn);
          }
        }
      }

      // Call visit function to establish maxLabelLength
      visit(
        treeData,
        function(d) {
          totalNodes++;
          maxLabelLength = Math.max(d.name.length, maxLabelLength);
        },
        function(d) {
          return d.children && d.children.length > 0 ? d.children : null;
        }
      );

      // sort the tree according to the node names

      function sortTree() {
        tree.sort(function(a, b) {
          return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
      }
      // Sort the tree initially incase the JSON isn't in a sorted order.
      // sortTree();

      // TODO: Pan function, can be better implemented.
      var domNode = null;

      function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
          clearTimeout(panTimer);
          translateCoords = d3.transform(svgGroup.attr("transform"));
          if (direction == "left" || direction == "right") {
            translateX =
              direction == "left"
                ? translateCoords.translate[0] + speed
                : translateCoords.translate[0] - speed;
            translateY = translateCoords.translate[1];
          } else if (direction == "up" || direction == "down") {
            translateX = translateCoords.translate[0];
            translateY =
              direction == "up"
                ? translateCoords.translate[1] + speed
                : translateCoords.translate[1] - speed;
          }
          scaleX = translateCoords.scale[0];
          scaleY = translateCoords.scale[1];
          scale = zoomListener.scale();
          svgGroup
            .transition()
            .attr(
              "transform",
              "translate(" +
                translateX +
                "," +
                translateY +
                ")scale(" +
                scale +
                ")"
            );
          d3.select(domNode)
            .select("g.node")
            .attr(
              "transform",
              "translate(" + translateX + "," + translateY + ")"
            );
          zoomListener.scale(zoomListener.scale());
          zoomListener.translate([translateX, translateY]);
          panTimer = setTimeout(function() {
            pan(domNode, speed, direction);
          }, 0);
        }
      }

      // Define the zoom function for the zoomable tree

      function zoom() {
        svgGroup.attr(
          "transform",
          "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
        );
      }

      // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
      var zoomListener = d3.behavior
        .zoom()
        .scaleExtent([0.1, 2])
        .on("zoom", zoom);
      var dragStarted = null;

      function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode)
          .select(".ghostCircle")
          .attr("pointer-events", "none");
        d3.selectAll(".ghostCircle").attr("class", "ghostCircle show");
        d3.select(domNode).attr("class", "node activeDrag");

        svgGroup.selectAll("g.node").sort(function(a, b) {
          // select the parent and sort the path's
          if (a.id != draggingNode.id) return 1;
          // a is not the hovered element, send "a" to the back
          else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
          // remove link paths
          links = tree.links(nodes);
          nodePaths = svgGroup
            .selectAll("path.link")
            .data(links, function(d) {
              return d.target.id;
            })
            .remove();
          // remove child nodes
          nodesExit = svgGroup
            .selectAll("g.node")
            .data(nodes, function(d) {
              return d.id;
            })
            .filter(function(d, i) {
              if (d.id == draggingNode.id) {
                return false;
              }
              return true;
            })
            .remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup
          .selectAll("path.link")
          .filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
              return true;
            }
            return false;
          })
          .remove();

        dragStarted = null;
      }

      var baseSvg = d3
        .select("#d3Tree_svg")
        .attr("width", offsetWidth)
        .attr("height", offsetHeight)
        .call(zoomListener);

      // Define the drag listeners for drag/drop behaviour of nodes.
      var dragListener = d3.behavior
        .drag()
        .on("dragstart", function(d) {
          if (d == root) {
            return;
          }
          dragStarted = true;
          var nodes = tree.nodes(d);
          d3.event.sourceEvent.stopPropagation();
          // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
          if (d == root) {
            return;
          }
          if (dragStarted) {
            domNode = this;
            initiateDrag(d, domNode);
          }

          // get coords of mouseEvent relative to svg container to allow for panning
          relCoords = d3.mouse($("svg").get(0));
          if (relCoords[0] < panBoundary) {
            panTimer = true;
            pan(this, "left");
          } else if (relCoords[0] > $("svg").width() - panBoundary) {
            panTimer = true;
            pan(this, "right");
          } else if (relCoords[1] < panBoundary) {
            panTimer = true;
            pan(this, "up");
          } else if (relCoords[1] > $("svg").height() - panBoundary) {
            panTimer = true;
            pan(this, "down");
          } else {
            try {
              clearTimeout(panTimer);
            } catch (e) {}
          }

          d.x0 += d3.event.dy;
          d.y0 += d3.event.dx;
          var node = d3.select(this);
          node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
          updateTempConnector();
        })
        .on("dragend", function(d) {
          if (d == root) {
            return;
          }
          domNode = this;
          if (selectedNode) {
            // now remove the element from the parent, and insert it into the new elements children
            var index = draggingNode.parent.children.indexOf(draggingNode);
            if (index > -1) {
              draggingNode.parent.children.splice(index, 1);
            }
            if (
              typeof selectedNode.children !== "undefined" ||
              typeof selectedNode._children !== "undefined"
            ) {
              if (typeof selectedNode.children !== "undefined") {
                selectedNode.children.push(draggingNode);
              } else {
                selectedNode._children.push(draggingNode);
              }
            } else {
              selectedNode.children = [];
              selectedNode.children.push(draggingNode);
            }
            // Make sure that the node being added to is expanded so user can see added node is correctly moved
            expand(selectedNode);
            // sortTree();
            endDrag();
          } else {
            endDrag();
          }
        });

      function endDrag() {
        selectedNode = null;
        d3.selectAll(".ghostCircle").attr("class", "ghostCircle");
        d3.select(domNode).attr("class", "node");
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode)
          .select(".ghostCircle")
          .attr("pointer-events", "");
        updateTempConnector();
        if (draggingNode !== null) {
          update(root);
          centerNode(draggingNode);
          draggingNode = null;
        }
      }

      // Helper functions for collapsing and expanding nodes.

      function collapse(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      function expand(d) {
        if (d._children) {
          d.children = d._children;
          d.children.forEach(expand);
          d._children = null;
        }
      }

      var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
      };
      var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
      };

      // Function to update the temporary connector indicating dragging affiliation
      var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
          // have to flip the source coordinates since we did this for the existing connectors on the original tree
          data = [
            {
              source: {
                x: selectedNode.y0,
                y: selectedNode.x0
              },
              target: {
                x: draggingNode.y0,
                y: draggingNode.x0
              }
            }
          ];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        var diagonal = d3.svg.diagonal().projection(function(d) {
          if (!d.parent && d.children) {
            return [height / 2 + 150, width / 2];
          } else {
            return [height / 2 + 150 + d.y, d.x];
          }
        });
        link
          .enter()
          .append("path")
          .attr("class", "templink")
          .attr("d", diagonal)
          .attr("pointer-events", "none");

        link.exit().remove();
      };

      function centerNode(source) {
        var scale = zoomListener.scale(),
          x = -source.y0,
          y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        x = $(".right-list").position().left + 50;
        d3.select("g")
          .transition()
          .duration(duration)
          .delay(delay)
          .ease(ease)
          .attr(
            "transform",
            "translate(" + x + "," + y + ")scale(" + scale + ")"
          );
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
      }

      // Toggle children function

      function toggleChildren(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else if (d._children) {
          d.children = d._children;
          d._children = null;
        }
        return d;
      }

      function click(d) {
        d = toggleChildren(d);
        update(d);
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
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
                ])
              };
              break;
            case "韩国":
              path += "globalapproval/list";
              query = {
                globalapprovalSource: JSON.stringify([
                  {
                    label: "韩国",
                    key: "韩国",
                    checked: 1
                  }
                ])
              };
              break;
          }
          query.name_eq = _this.name;
          const { href } = _this.$router.resolve({
            path,
            query
          });
          window.open(href, "_blank");
        } else if (d.depth == 2 && d.name != "查看更多") {
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
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
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
              };
              break;
            case "韩国":
              path += "globalapproval/list";
              query = {
                globalapprovalSource: JSON.stringify([
                  {
                    label: "韩国",
                    key: "韩国",
                    checked: 1
                  }
                ]),
                filter_condition: JSON.stringify({
                  zwform: [d.name]
                })
              };
              break;
          }
          query.name_eq = _this.name;
          const { href } = _this.$router.resolve({
            path,
            query
          });
          window.open(href, "_blank");
        }
        // centerNode(d);
      }

      function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {
          if (n.children && n.children.length > 0) {
            if (levelWidth.length <= level + 1) levelWidth.push(0);

            levelWidth[level + 1] += n.children.length;
            n.children.forEach(function(d) {
              childCount(level + 1, d);
            });
          }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        // tree = tree.size([newHeight, viewerWidth / 20]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root),
          links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
          d.y = d.depth * (maxLabelLength * 10); //maxLabelLength * 10px
          // alternatively to keep a fixed scale one can set a fixed depth per level
          // Normalize for fixed-depth by commenting out below line
          // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        var node = svgGroup.selectAll("g.node").data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });

        // Enter any new nodes at the parent's previous position.
        // TODO 节点收缩展开的位置 要换算的地方都要换算，例如这里 x轴乘以 4，其他地方都要乘以 4
        var nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + source.y0 * 3.5 + "," + source.x0 + ")";
          })
          .on("click", click);

        nodeEnter
          .append("circle")
          .attr("class", "nodeCircle")
          .attr("r", 0)
          .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
          });

        nodeEnter
          .append("text")
          .attr("x", function(d) {
            return d.children || d._children ? -10 : 10;
          })
          .attr("dy", 4)
          .attr("class", "nodeText")
          .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
          })
          .text(function(d) {
            return d.name;
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
          .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter
          .append("circle")
          .attr("class", "ghostCircle")
          .attr("r", 30)
          .attr("opacity", 0.2) // change this to zero to hide the target area
          .attr("r", 4.5)
          .attr("pointer-events", "mouseover")
          .on("mouseover", function(node) {
            overCircle(node);
          })
          .on("mouseout", function(node) {
            outCircle(node);
          })
          .on("click", function(d) {
            if (d.children) {
              //如果这个节点有children属性，则删除并重新绘图
              d.flag = true;
            } else {
              d.flag = false;
            }
          });

        // Update the text to reflect whether node has children or not.
        node
          .select("text")
          .attr("x", function(d) {
            return d.children || d._children ? -10 : 10;
          })
          .attr("font-size", "12px")
          .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
          })
          .text(function(d) {
            return d.name;
          });

        // Change the circle fill depending on whether it has children and is collapsed
        node
          .select("circle.nodeCircle")
          .attr("r", 4.5)
          .style("fill", function(d) {
            return d._children ? "#4877e8" : "#fff";
          });

        // Transition nodes to their new position.
        // TODO 如果要修改线的长度 配合diagonal使用
        var nodeUpdate = node
          .transition()
          .duration(duration)
          .delay(delay)
          .ease(ease)
          .attr("transform", function(d) {
            return "translate(" + d.y * 3.5 + "," + d.x + ")";
          });

        // Fade the text in
        nodeUpdate.select("text").style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node
          .exit()
          .transition()
          .duration(duration)
          .delay(delay)
          .ease(ease)
          .attr("transform", function(d) {
            return "translate(" + source.y * 3.5 + "," + source.x + ")";
          })
          .remove();

        nodeExit.select("circle").attr("r", 0);

        nodeExit.select("text").style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link").data(links, function(d) {
          return d.target.id;
        });
        console.log(diagonal);
        // Enter any new links at the parent's previous position.
        link
          .enter()
          .insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
            var o = {
              x: source.x0,
              y: source.y0
            };
            return diagonal({
              source: o,
              target: o
            });
          });

        // Transition links to their new position.
        link
          .transition()
          .duration(duration)
          .delay(delay)
          .ease(ease)
          .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link
          .exit()
          .transition()
          .duration(duration)
          .delay(delay)
          .ease(ease)
          .attr("d", function(d) {
            var o = {
              x: source.x,
              y: source.y
            };
            return diagonal({
              source: o,
              target: o
            });
          })
          .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Append a group which holds all nodes and which the zoom Listener can act upon.
      var svgGroup = baseSvg.append("g");

      // Define the root
      root = treeData;
      root.x0 = viewerHeight / 2;
      root.y0 = 0;

      // Layout the tree initially and center on the root node.
      update(root);
      centerNode(root);
    },
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

      console.log(offsetWidth, offsetHeight);

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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
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
                    ])
                  };
                  break;
                case "韩国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "韩国",
                        key: "韩国",
                        checked: 1
                      }
                    ])
                  };
                  break;
              }
              query.name_eq = _this.name;
              const { href } = _this.$router.resolve({
                path,
                query
              });
              window.open(href, "_blank");
            } else if (d.depth == 2 && d.name != "查看更多") {
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
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
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
                  };
                  break;
                case "韩国":
                  path += "globalapproval/list";
                  query = {
                    globalapprovalSource: JSON.stringify([
                      {
                        label: "韩国",
                        key: "韩国",
                        checked: 1
                      }
                    ]),
                    filter_condition: JSON.stringify({
                      zwform: [d.name]
                    })
                  };
                  break;
              }
              query.name_eq = _this.name;
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
.jxfb,
.d3Tree {
  height: 100%;
}
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
}
.link {
  fill: none;
  stroke: #dfe5f1;
  stroke-width: 1px;
}
.node {
  cursor: pointer;
}
.more {
  fill: #4877e8;
}
.subNode {
  fill: #868ea3;
}
.parNode {
  fill: #545b6d;
}
.circle {
  fill: white;
  stroke: #4877e8;
}
.circlefill {
  fill: #4877e8;
  stroke: #4877e8;
}

.node circle {
  fill: #fff;
  stroke: #4877e8;
  stroke-width: 1.5px;
}

.templink {
  fill: none;
  stroke-width: 3px;
}

.ghostCircle.show {
  display: block;
}

.ghostCircle,
.activeDrag .ghostCircle {
  display: none;
}
.node:hover .subNode,
.node:hover .subCircle {
  fill: #4877e8;
}
</style>
