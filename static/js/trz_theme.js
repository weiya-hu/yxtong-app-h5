(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["exports", "echarts"], factory);
    } else if (
        typeof exports === "object" &&
        typeof exports.nodeName !== "string"
    ) {
        // CommonJS
        factory(exports, require("echarts"));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
})(this, function(exports, echarts) {
    var log = function(msg) {
        if (typeof console !== "undefined") {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log("ECharts is not Loaded");
        return;
    }
    echarts.registerTheme("customed", {
        color: [
            "#3556b9",
            "#e7af2f",
            "#7fab56",
            "#87c7d0",
            "#e08646",
            "#5884ad",
            "#d1c18a",
            "#b89249",
            "#25b8c2",
            "#bed173",
            "#82a5d9"
        ],
        backgroundColor: "rgba(0, 0, 0, 0)",
        textStyle: {},
        title: {
            textStyle: {
                color: "#333"
            },
            subtextStyle: {
                color: "#999999"
            }
        },
        line: {
            itemStyle: {
                borderWidth: "2"
            },
            lineStyle: {
                width: 2
            },
            symbolSize: "6",
            symbol: "emptyCircle",
            smooth: false
        },
        radar: {
            itemStyle: {
                borderWidth: "2"
            },
            lineStyle: {
                width: 2
            },
            symbolSize: "6",
            symbol: "emptyCircle",
            smooth: false
        },
        bar: {
            itemStyle: {
                barBorderWidth: "",
                barBorderColor: "#ccc"
            }
        },
        pie: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        scatter: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        boxplot: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        parallel: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        sankey: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        funnel: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        gauge: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            }
        },
        candlestick: {
            itemStyle: {
                color: "#3556b9",
                color0: "#e7af2f",
                borderColor: "#3556b9",
                borderColor0: "#e7af2f",
                borderWidth: 1
            }
        },
        graph: {
            itemStyle: {
                borderWidth: "",
                borderColor: "#ccc"
            },
            lineStyle: {
                width: 1,
                color: "#aaa"
            },
            symbolSize: "6",
            symbol: "emptyCircle",
            smooth: false,
            color: [
                "#3556b9",
                "#e7af2f",
                "#7fab56",
                "#87c7d0",
                "#e08646",
                "#5884ad",
                "#d1c18a",
                "#b89249",
                "#25b8c2",
                "#bed173",
                "#82a5d9"
            ],
            label: {
                color: "#eee"
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaColor: "#eee",
                    borderColor: "#444",
                    borderWidth: 0.5
                },
                emphasis: {
                    areaColor: "rgba(255,215,0,0.8)",
                    borderColor: "#444",
                    borderWidth: 1
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: "#000"
                    }
                },
                emphasis: {
                    textStyle: {
                        color: "rgb(100,0,0)"
                    }
                }
            }
        },
        geo: {
            itemStyle: {
                normal: {
                    areaColor: "#eee",
                    borderColor: "#444",
                    borderWidth: 0.5
                },
                emphasis: {
                    areaColor: "rgba(255,215,0,0.8)",
                    borderColor: "#444",
                    borderWidth: 1
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: "#000"
                    }
                },
                emphasis: {
                    textStyle: {
                        color: "rgb(100,0,0)"
                    }
                }
            }
        },
        categoryAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#666666"
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#f5f8fc"]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]
                }
            }
        },
        valueAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#666666"
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ["#f5f8fc"]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]
                }
            }
        },
        logAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#666666"
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ["#f5f8fc"]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]
                }
            }
        },
        timeAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color: "#dbe0e8"
                }
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: "#dae0e9"
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: "#666666"
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ["#f5f8fc"]
                }
            },
            splitArea: {
                show: false,
                areaStyle: {
                    color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]
                }
            }
        },
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: "#dae0e9"
                },
                emphasis: {
                    borderColor: "#666"
                }
            }
        },
        legend: {
            textStyle: {
                color: "#666666"
            }
        },
        tooltip: {
            axisPointer: {
                lineStyle: {
                    color: "#ccc",
                    width: 1
                },
                crossStyle: {
                    color: "#ccc",
                    width: 1
                }
            }
        },
        timeline: {
            lineStyle: {
                color: "#dae0e9",
                width: 1
            },
            itemStyle: {
                normal: {
                    color: "#3556b9",
                    borderWidth: 1
                },
                emphasis: {
                    color: "#3556b9"
                }
            },
            controlStyle: {
                normal: {
                    color: "#3556b9",
                    borderColor: "#3556b9",
                    borderWidth: 0.5
                },
                emphasis: {
                    color: "#3556b9",
                    borderColor: "#3556b9",
                    borderWidth: 0.5
                }
            },
            checkpointStyle: {
                color: "#3556b9",
                borderColor: "#d7e0fc"
            },
            label: {
                normal: {
                    textStyle: {
                        color: "#666666"
                    }
                },
                emphasis: {
                    textStyle: {
                        color: "#666666"
                    }
                }
            }
        },
        visualMap: {
            color: ["#3556b9", "#e7af2f", "#7fab56"]
        },
        dataZoom: {
            backgroundColor: "rgba(47,69,84,0)",
            dataBackgroundColor: "rgba(47,69,84,0.3)",
            fillerColor: "rgba(167,183,204,0.4)",
            handleColor: "#a7b7cc",
            handleSize: "100%",
            textStyle: {
                color: "#333"
            }
        },
        markPoint: {
            label: {
                color: "#eee"
            },
            emphasis: {
                label: {
                    color: "#eee"
                }
            }
        }
    });
});