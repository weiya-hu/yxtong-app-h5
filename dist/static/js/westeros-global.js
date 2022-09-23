(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('westeros', {
        "color": [
            "#8285ce",
            "#404bc5",
            "#5d64ce",
            "#002fa7",
            "#aeafe1",
            "#c4cadf",
            "#aeaec6"
        ],
        "backgroundColor": "rgba(255,255,255,1)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#000f32"
            },
            "subtextStyle": {
                "color": "#5c6973"
            }
        },
        "line": {
            "itemStyle": {
                "borderWidth": "1"
            },
            "lineStyle": {
                "width": "1"
            },
            "symbolSize": "5",
            "symbol": "circle",
            "smooth": true
        },
        "radar": {
            "itemStyle": {
                "borderWidth": "1"
            },
            "lineStyle": {
                "width": "1"
            },
            "symbolSize": "5",
            "symbol": "circle",
            "smooth": true
        },
        "bar": {
            "itemStyle": {
                "barBorderWidth": 0,
                "barBorderColor": "#ffffff"
            }
        },
        "pie": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "scatter": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "boxplot": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "parallel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "sankey": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "funnel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "gauge": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            }
        },
        "candlestick": {
            "itemStyle": {
                "color": "#a7d356",
                "color0": "#92adf1",
                "borderColor": "#5db81b",
                "borderColor0": "#002fa7",
                "borderWidth": "1"
            }
        },
        "graph": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ffffff"
            },
            "lineStyle": {
                "width": 1,
                "color": "#dcdfe6"
            },
            "symbolSize": "5",
            "symbol": "circle",
            "smooth": true,
            "color": [
                "#8285ce",
                "#404bc5",
                "#5d64ce",
                "#002fa7",
                "#aeafe1",
                "#c4cadf",
                "#aeaec6"
            ],
            "label": {
                "color": "#ffffff"
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#f3f3f3",
                    "borderColor": "#516b91",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "#a5e7f0",
                    "borderColor": "#516b91",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#000"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#516b91"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#f3f3f3",
                    "borderColor": "#516b91",
                    "borderWidth": 0.5
                },
                "emphasis": {
                    "areaColor": "#a5e7f0",
                    "borderColor": "#516b91",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#000"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#516b91"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#5c6973"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#fafbfd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#5c6973"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#fafbfd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#5c6973"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#fafbfd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#e0e0e0"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#5c6973"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#fafbfd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.05)",
                        "rgba(200,200,200,0.02)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#999999"
                },
                "emphasis": {
                    "borderColor": "#666666"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#5c6973"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#002fa7",
                    "width": "1"
                },
                "crossStyle": {
                    "color": "#002fa7",
                    "width": "1"
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#002fa7",
                "width": "1"
            },
            "itemStyle": {
                "normal": {
                    "color": "#dfe5f1",
                    "borderWidth": "1"
                },
                "emphasis": {
                    "color": "#002fa7"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#002fa7",
                    "borderColor": "#abc2f6",
                    "borderWidth": "0.5"
                },
                "emphasis": {
                    "color": "#002fa7",
                    "borderColor": "#abc2f6",
                    "borderWidth": "0.5"
                }
            },
            "checkpointStyle": {
                "color": "#002fa7",
                "borderColor": "rgba(171,194,246,1)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#5c6973"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#5c6973"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#002fa7",
                "#404bc5",
                "#3a79f0",
                "#598dfc",
                "#8bb4fa",
                "#afc9fe",
                "#cddefd",
                "#e8f1fe"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(255,255,255,1)",
            "dataBackgroundColor": "rgba(255,255,255,1)",
            "fillerColor": "rgba(130,133,206,1)",
            "handleColor": "#ffa914",
            "handleSize": "80%",
            "textStyle": {
                "color": "#5c6973"
            }
        },
        "markPoint": {
            "label": {
                "color": "#ffffff"
            },
            "emphasis": {
                "label": {
                    "color": "#ffffff"
                }
            }
        }
    });
}));

