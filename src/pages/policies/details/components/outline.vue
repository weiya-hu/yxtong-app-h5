<template>
  <div class="outline-component">
    <div class="outline-txt fleximg" @click="()=>{outLineShow = !outLineShow;doMatomo('企业版_政策法规_详情页_正文_大纲视图')}">大纲视图</div>
    <div class="outline right-list" v-show="outLineShow">
      <HeaderPolicies></HeaderPolicies>
      <div class="d3Tree" ref="d3Tree" @mousemove="d3TreeMove">
        <svg class="d3Tree_svg" id="d3Tree_svg"></svg>
      </div>
      <div class="exit" @click="outLineShow = !outLineShow">
        <div class="exit-img"></div>
        <div class="exit-txt" >退出</div>
      </div>
    </div>
    
  </div>
  
</template>

<script>
import * as d3 from "d3";
import HeaderPolicies from "@/components/layouts/policies/header-policies";
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    secendCatalogueNum:{
      type: Number,
      required: true
    }
  },
  components:{
    HeaderPolicies,
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
      zoomPosition: {},
      doScale:null,
      tree:null,
      outLineShow:false,
    };
  },
  mounted() {
    this.d3Tree_hover_dom = this.$refs.d3Tree_hover;
    console.log(this.data)
    this.getTreeData(this.data[0]);
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
      var viewerWidth = $(".outline").width();
      var viewerHeight = $(".outline").height();

      let _this = this;
      let d3Tree = this.$refs.d3Tree;
      let offsetWidth = d3Tree.offsetWidth,
        offsetHeight = d3Tree.offsetHeight;

      var width = this.changeSize(
          _this.height * _this.heightN,
          offsetWidth 
        ),
        height = this.changeSize(
          _this.width * (_this.widthN + _this.widthNR),
          offsetHeight
        );
      console.log(width, height);
      var tree = d3.layout
        .tree()
        .size([width/2, height/2])
        // .size([2100, 1000])
        .separation(function(a, b) {
          return a.parent == b.parent ? 1 : 2;
        });
        this.tree = tree
      // define a d3 diagonal projection for use by the node paths later on.
      var diagonal = d3.svg.diagonal().projection(function(d) {
        // console.log(d);
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
      this.zoonlis = zoomListener
      function changeNodes(node){
          let nodeSeperateSpace = 5
          node.forEach(function (d) {
              d.x = d.x - d.depth * nodeSeperateSpace;
              //if (d.depth==0)
                  d.y = d.y + d.depth*5;
              //else
                  //d.y = d.y - 150;
          });
          return node
      }
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
          
          links = tree.links(changeNodes(nodes));
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
        parentLink = tree.links(changeNodes(tree.nodes(draggingNode.parent)));
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
        var scale = zoomListener.scale()/1.1,
          x = -source.y0, 
          y = -source.x0;
          // x = x * scale + viewerWidth / 2;
        x = viewerWidth /2;
        y = viewerHeight /2 +50;
        // y = y * scale + viewerHeight / 2+250;

        // x = $(".right-list").position().left +150;
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
          links = tree.links(changeNodes(nodes));

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
          // d.x=d.id*20
          // if(d.depth === 2){flagId = flagId || d.id}
          if(d.depth == 0){
            d.y =  0
          }else if(d.depth == 1){
            d.y =  100
          }else if(d.depth == 2){
            d.y =  100+200
            // d.x=d.x+ ((d.id - flagId)*3)
          }else{
            d.y = 100+200+((d.depth-2)*30)
          }

          // d.y = d.depth * (maxLabelLength * 1); //maxLabelLength * 10px
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
          // .on("click", (d) => {
          //   d.children = d.children ? null : d._children;
          //   update(d);
          // });

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
            // return d.children || d._children ? "end" : "start";
            return 'end'
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
          
          // .on("click", function(d) {
          //   if (d.children) {
          //     //如果这个节点有children属性，则删除并重新绘图
          //     d.flag = true;
          //   } else {
          //     d.flag = false;
          //   }
          // });

          nodeEnter.append("title")
            .text(d => d.title);

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
          })
          .on("click", (d) => {
            d.children = d.children ? null : d._children;
            console.log(width,height)
            tree.size([(_this.secendCatalogueNum*20 > (width/2)) ? _this.secendCatalogueNum*20: width/2, height/2])
            update(d);
          });
          ;

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
    d3TreeMove(e) {
      let all = this.d3Tree_hover_dom;
      if (all) {
        all.style.left = e.screenX - all.offsetWidth - 50 + "px";
        all.style.top = e.screenY - all.offsetHeight + "px";
      }
    },
    // childrenLoading()
    changeSize(a, b) {
      var c = a > b ? a : b;
      return c;
    },
    scaleTo(){
      // console.log(this.doScale)
      // console.log(this.tree)
      // this.d3Tree_hover_dom.scaleTo(0.3)
      // this.tree.scale(0.3)
      // this.tree.call(
      //   d3.zoom().scaleTo(0.3).on("zoom", zoom)
      // );
      var viewerWidth = $(".outline").width();
      var viewerHeight = $(".outline").height();
      var duration = 600,
        delay = 0,
        ease = [0.5];
      var scale = this.zoonlis.scale()/0.3,
          x = -this.data[0].y0, 
          y = -this.data[0].x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2+250;
        x = $(".right-list").position().left +150;
        d3.select("g")
          .transition()
          .duration(duration)
          .delay(delay)
          .ease(ease)
          .attr(
            "transform",
            "translate(" + x + "," + y + ")scale(" + scale + ")"
          );
          this.zoonlis.scale(scale);
          this.zoonlis.translate([x, y]);
    },
    doMatomo(str){
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        str,
      ]); // matomo埋点
    },
  }
};
</script>

<style lang="less">
.outline-component{
  position: relative;
  .exit{
    width: 44px;
    height: 45px;
    background: #ffffff;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    border: #bbbbbb solid 1px;
    box-shadow: 0px 0px 8px #cccccc;
    box-sizing: border-box;
    padding: 4px 0;
    cursor: pointer;
    .exit-img{
      width: 16px;
      height: 16px;
      margin: 0 auto;
      background: url(../../../../assets/imgs/policy/exit.png) no-repeat;
    }
    .exit-txt{
      text-align: center;
      font-size: 12px;
      color: #545B6D;
    }
    &:hover{
      background: #DF9008 ;
      // border-color: #DF9008;
      .exit-img{
        background: url(../../../../assets/imgs/policy/exit_white.png) no-repeat;
      }
      .exit-txt{
        color: #ffffff;
      }
    }
  }
}
.right-list {
  width: 100vw;
  min-width: 1100px;
  margin-left: 10px;
  padding-top: 0 !important;
  padding-left: unset !important;

  .border-box {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    border: 1px solid #dfe5f1;

    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
.outline-txt{
  font-size: 14px;
  font-weight: 400;
  color: #002FA7;
  line-height: 20px;
  cursor: pointer;
  // position: absolute;
  // right: 20px;
  // top: 50%;
  // transform: translateY(-50%);
}
.outline{
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
}
.outline,
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
