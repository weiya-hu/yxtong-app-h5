<template>
    <div class="ywfx">
        <div class="panel">
            <div class="chart_bottom">
                <div class="chart-boxes">
                    <DbEcharts title="最高研发阶段" :statement="zgyfjdDesc">
                        <div id="zgyfjd-bar-globaldrugs" v-waiting="topphaseLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                    <DbEcharts title="药品分类" :statement="ypflDesc">
                        <div id="ypfl-dought-globaldrugs" v-waiting="ypfxLeixingbmLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                    <DbEcharts title="药品类型" :statement="yplxDesc">
                        <div id="yplx-pie-globaldrugs" v-waiting="ypfxYplxLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                    <DbEcharts title="特殊审评" :statement="tsspDesc">
                        <div id="tssp-dought-globaldrugs" v-waiting="ypfxTsspLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                    <DbEcharts title="治疗领域" :statement="zllyDesc">
                        <div id="zlly-stackbar-globaldrugs" v-waiting="ypfxZllyLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                    <DbEcharts title="靶点排行" :statement="bdphDesc">
                        <div id="bdph-stackbar-globaldrugs" v-waiting="ypfxBdphLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                    <keep-alive>
                        <div class="chart-box">
                            <div class="analy-type chart-title fl">
                                <div :class="['analy-type-item',panelChildIndex===0? 'check':'']"
                                    @click="showEchartChildPanel(0)">
                                    已批准适应症排行
                                </div>
                                <div class="line"></div>
                                <div :class="['analy-type-item',panelChildIndex===1? 'check':'']"
                                    @click="showEchartChildPanel(1)">
                                    在研适应症排行
                                </div>
                                <div class="line"></div>
                                <div :class="['analy-type-item',panelChildIndex===2? 'check':'']"
                                    @click="showEchartChildPanel(2)">
                                    终止适应症排行
                                </div>
                                <el-tooltip effect="zhuce" placement="right">
                                    <div slot="content" v-html="ypzDesc">
                                    </div>
                                    <i class="section-ico-qa" style="margin-left: 4px; line-height: 28px"></i>
                                </el-tooltip>
                            </div>

                            <div v-waiting="ypfxYpzsyzphLoading" v-show="panelChildIndex===0"
                                id="ypzsyzph-stackbar-globaldrugs" class="echarts">
                                <div class="nodata-box"></div>
                            </div>
                            <div v-waiting="ypfxZysyzphLoading" v-show="panelChildIndex===1"
                                id="zysyzph-stackbar-globaldrugs" class="echarts">
                                <div class="nodata-box"></div>
                            </div>
                            <div v-waiting="ypfxZzsyzphLoading" v-show="panelChildIndex===2"
                                id="zzsyzph-stackbar-globaldrugs" class="echarts">
                                <div class="nodata-box"></div>
                            </div>
                        </div>
                    </keep-alive>
                    <DbEcharts title="原研单位排行" :statement="yydwphDesc">
                        <div id="yydwph-stackbar-globaldrugs" v-waiting="ypfxYydwphLoading" class="echarts">
                            <div class="nodata-box"></div>
                        </div>
                    </DbEcharts>
                </div>
            </div>

            <!-- 展开效果 -->
            <div class="dialog" v-show="dialogVisible">
                <div class="menu">
                    <div v-for="(ti,index) in title" v-bind:class="[index==openIndex? 'active':'','nav']"
                        @click="handleOpenIndex(index)" :key="index">{{ ti}}</div>
                </div>
                <div class="echarts-items-wap">
                    <div class="echarts-items-title">
                        <span class="echart-title">
                            {{ title[openIndex]}}
                            <el-tooltip effect="zhuce" placement="right">
                                <div slot="content" v-html="descHandler(openIndex)">
                                </div>
                                <span class="section-ico-qa"></span>
                            </el-tooltip>
                        </span>
                        <a class="esc-btn" href="javascript:;" @click="handleDialogVisible(false)">
                            <i></i>
                            <img src="/static/imgs/echarts/esc-fullscreen.png" alt="退出全屏" />
                        </a>
                    </div>
                    <div class="echarts-items">
                        <!-- <div v-for="(item, index) in echartsDomOpen" :key="'open-echarts' + index" class="echarts-item">
                            <div>
                                <div :id="item" class="open-charts"></div>
                            </div>
                        </div> -->
                        <div class="echarts-item">
                            <div id="zgyfjd-bar-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="ypfl-dought-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="yplx-pie-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="tssp-dought-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="zlly-stackbar-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="bdph-stackbar-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="ypzsyzph-stackbar-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="zysyzph-stackbar-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="zzsyzph-stackbar-globaldrugs-open" class="open-charts"></div>
                        </div>
                        <div class="echarts-item">
                            <div id="yydwph-stackbar-globaldrugs-open" class="open-charts"></div>
                        </div>
                    </div>
                    <div class="ctr-actions">
                        <el-button class="pre action" @click="handleOpenIndex(openIndex-1)">
                            <i class="el-icon-arrow-left"></i>
                        </el-button>
                        <el-button class="next action" @click="handleOpenIndex(openIndex+1)">
                            <i class="el-icon-arrow-right"></i>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import DbEcharts from "@/components/common/globaldrugs/analy/db-echarts";
import Moment from 'moment';

export default {
    components: { DbEcharts },
    data() {
        return {
            zgyfjdDesc: '统计各最高研发阶段的药品数量。此处统计的是药品最高研发阶段，部分药品在全球进展快，而在中国进展慢，我们会将其统计到不同阶段里面，因此会出现同一阶段中国数量大于全球数量的情况。',
            ypflDesc: '统计各药品分类的药品数量。',
            yplxDesc: '统计各药品类型的药品数量。',
            tsspDesc: '统计各特殊审评的药品数量。',
            zllyDesc: '展示药品数量靠前的治疗领域，并统计各治疗领域处于不同研发阶段的药品数量。',
            bdphDesc: '展示药品数量靠前的靶点，并统计各靶点处于不同研发阶段的药品数量。',
            ypzDesc: '展示药品数量靠前的已批准适应症/在研适应症/终止适应症，并统计各已批准适应症/在研适应症/终止适应症处于不同研发阶段的药品数量。',
            yydwphDesc: '展示药品数量靠前的原研单位，并统计各原研单位处于不同研发阶段的药品数量。',
            pieIcon: "image:///static/imgs/echarts/globaldrugs/analy/pie.png",
            barIcon: "image:///static/imgs/echarts/globaldrugs/analy/bar.png",
            saveIcon: "image:///static/imgs/echarts/globaldrugs/analy/save.png",
            fullscreenIcon: "image:///static/imgs/echarts/globaldrugs/analy/fullscreen.png",
            echartsDomOpen: [],
            loading: true,
            tempType: [],
            tempData: [],// 用于关闭全屏的数据传递存储
            recordNoData: new Set(),// 记录大屏智能分析的无数据的选项卡
            searchState: {
                putongAnaly: {},
                shaixuanAnaly: {},
            },
            titleBottom: 10,
            itemWidth: 700,
            panelChildIndex: 0, // 药品分析子面板里的切换
            title: [
                "最高研发阶段",
                "药品分类",
                "药品类型",
                "特殊审评"
            ],
            zgyfjd_bar: {
                echarts: null,
                xAxis1_data: [],
                series1_data: [],
                xAxis2_data: [],
                series2_data: []
            },
            ypfl_dought: {
                echarts: null,
                xAxis1_data: [],
                series1_data: [],
                xAxis2_data: [],
                series2_data: []
            },
            yplx_pie: {
                echarts: null,
                xAxis1_data: [],
                series1_data: [],
                xAxis2_data: [],
                series2_data: []
            },
            zlly_stackbar: {
                echarts: null,
                xAxis1_data: [],
                series1_data: [],
                xAxis2_data: [],
                series2_data: []
            },
            bdph_stackbar: {
                echarts: null,
                xAxis_data1: [],
                series_data1: [],
                xAxis_data2: [],
                series_data2: [],
            },
            ypzsyzph_stackbar: {
                echarts: null,
                xAxis_data1: [],
                series_data1: [],
                xAxis_data2: [],
                series_data2: [],
            },
            zysyzph_stackbar: {
                echarts: null,
                xAxis_data1: [],
                series_data1: [],
                xAxis_data2: [],
                series_data2: [],
            },
            zzsyzph_stackbar: {
                echarts: null,
                xAxis_data1: [],
                series_data1: [],
                xAxis_data2: [],
                series_data2: [],
            },
            yydwph_stackbar: {
                echarts: null,
                xAxis_data1: [],
                series_data1: [],
                xAxis_data2: [],
                series_data2: [],
            },
            tssp_dought: {
                echarts: null,
                xAxis1_data: [],
                series1_data: [],
                xAxis2_data: [],
                series2_data: []
            },
            ypfxBdphworld: [],
            ypfxBdphchina: [],
            ypfxYpzsyzphworld: [],
            ypfxYpzsyzpchina: [],
            ypfxZysyzphworld: [],
            ypfxZysyzphchina: [],
            ypfxZzsyzphworld: [],
            ypfxZzsyzphchina: [],
            ypfxYydwphworld: [],
            ypfxYydwphchina: [],
            phaseArr: [
                '临床前',
                '临床申请',
                '临床Ⅰ期',
                '临床Ⅱ期',
                '临床Ⅲ期',
                '注册申请',
                '批准上市'
            ],
            dialogVisible: false,
            initopen: false, //控制渲染一次
            openIndex: 0, //控制展开第几个图形
            title: [
                "最高研发阶段",
                "药品分类",
                "药品类型",
                "特殊审评",
                "治疗领域",
                "靶点排行",
                "已批准适应症排行",
                "在研适应症排行",
                "终止适应症排行",
                "原研单位排行"
            ],
            markerArr: []
        }
    },
    computed: {
        ...mapState({
            topphase: state => state.Globaldrugs.topphase,
            ypfxLeixingbm: state => state.Globaldrugs.ypfxLeixingbm,
            ypfxYplx: state => state.Globaldrugs.ypfxYplx,
            ypfxTssp: state => state.Globaldrugs.ypfxTssp,
            ypfxZlly: state => state.Globaldrugs.ypfxZlly,
            ypfxBdph: state => state.Globaldrugs.ypfxBdph,
            ypfxYpzsyzph: state => state.Globaldrugs.ypfxYpzsyzph,
            ypfxZysyzph: state => state.Globaldrugs.ypfxZysyzph,
            ypfxZzsyzph: state => state.Globaldrugs.ypfxZzsyzph,
            ypfxYydwph: state => state.Globaldrugs.ypfxYydwph,

            topphaseLoading: state => state.Globaldrugs.topphaseLoading,
            ypfxLeixingbmLoading: state => state.Globaldrugs.ypfxLeixingbmLoading,
            ypfxYplxLoading: state => state.Globaldrugs.ypfxYplxLoading,
            ypfxTsspLoading: state => state.Globaldrugs.ypfxTsspLoading,
            ypfxZllyLoading: state => state.Globaldrugs.ypfxZllyLoading,
            ypfxBdphLoading: state => state.Globaldrugs.ypfxBdphLoading,
            ypfxYpzsyzphLoading: state => state.Globaldrugs.ypfxYpzsyzphLoading,
            ypfxZysyzphLoading: state => state.Globaldrugs.ypfxZysyzphLoading,
            ypfxZzsyzphLoading: state => state.Globaldrugs.ypfxZzsyzphLoading,
            ypfxYydwphLoading: state => state.Globaldrugs.ypfxYydwphLoading,

            paramAnaly: state => state.Globaldrugs.paramAnaly,
            filtersAnaly: state => state.Globaldrugs.filtersAnaly,
            analyLoading: state => state.Globaldrugs.analyLoading,
            nopms: state => state.Globaldrugs.nopms,
            conditionsAnaly: state => state.Globaldrugs.conditionsAnaly,
            putongAnaly: (state) => state.Globaldrugs.putongAnaly,
            gaojiAnaly: (state) => state.Globaldrugs.gaojiAnaly,
            shaixuanAnaly: (state) => state.Globaldrugs.shaixuanAnaly,
            groupsAnaly: (state) => state.Globaldrugs.groupsAnaly
        })
    },
    watch: {
        initopen(val) {
            this.tempType.forEach((item, i) => {
                if (val) {
                    switch (i) {
                        case 0:
                            if (item == 'pie') {
                                this.handleTogglePie("zgyfjd-bar-globaldrugs-open", this.zgyfjd_bar, undefined, 0)
                            } else if (item == 'bar') {
                                this.tempType[i] = 'bar';
                                this.drawZgyfjdBarOpen();
                            }
                            break;
                        case 1:
                            if (item == 'bar') {
                                this.handleToggleBar("ypfl-dought-globaldrugs-open", this.ypfl_dought, undefined, 1)
                            } else if (item == 'pie') {
                                this.tempType[i] = 'pie';
                                this.drawYpflDoughtOpen();
                            }
                            break;
                        case 2:
                            if (item == 'bar') {
                                this.handleToggleBar("yplx-pie-globaldrugs-open", this.yplx_pie, undefined, 2)
                            } else if (item == 'pie') {
                                this.tempType[i] = 'pie';
                                this.drawYplxPieOpen();
                            }
                            break;
                        case 3:
                            if (item == 'bar') {
                                this.handleToggleBar("tssp-dought-globaldrugs-open", this.tssp_dought, undefined, 3)
                            } else if (item == 'pie') {
                                this.tempType[i] = 'pie';
                                this.drawTsspDoughtOpen();
                            }
                            break;
                    }
                } else {
                    switch (i) {
                        case 0:
                            if (item == 'pie') {
                                this.handleTogglePie("zgyfjd-bar-globaldrugs", this.zgyfjd_bar, 0)
                            } else if (item == 'bar') {
                                this.tempType[i] = 'bar';
                                this.drawZgyfjdBar();
                            }
                            break;
                        case 1:
                            if (item == 'bar') {
                                this.handleToggleBar("ypfl-dought-globaldrugs", this.ypfl_dought, 1)
                            } else if (item == 'pie') {
                                this.tempType[i] = 'pie';
                                this.drawYpflDought();
                            }
                            break;
                        case 2:
                            if (item == 'bar') {
                                this.handleToggleBar("yplx-pie-globaldrugs", this.yplx_pie, 2)
                            } else if (item == 'pie') {
                                this.tempType[i] = 'pie';
                                this.drawYplxPie();
                            }
                            break;
                        case 3:
                            if (item == 'bar') {
                                this.handleToggleBar("tssp-dought-globaldrugs", this.tssp_dought, 3)
                            } else if (item == 'pie') {
                                this.tempType[i] = 'pie';
                                this.drawTsspDought();
                            }
                            break;
                    }
                }
            })
        },
        topphase(newVal) {
            if (this.$route.path == "/globaldrugs/analysis" && this.isEmpty(newVal)) {
                this.dealZgyfjdBar(newVal);
            }
        },
        ypfxLeixingbm(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealYpflDought(newVal);
            }
        },
        ypfxYplx(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealYplxPie(newVal);
            }
        },
        ypfxTssp(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealTsspDought(newVal);
            }
        },
        ypfxZlly(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealZllyStackBar(newVal);
            }
        },
        ypfxBdph(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealBdphBar(newVal);
            }
        },
        // 已批准适应症排行
        ypfxYpzsyzph(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealYpzsyzphBar(newVal);
            }
        },
        // 在研适应症排行
        ypfxZysyzph(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealZysyzphBar(newVal);
            }
        },
        // 终止适应症排行
        ypfxZzsyzph(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealZzsyzphBar(newVal);
            }
        },
        // 原研单位排行
        ypfxYydwph(newVal) {
            if (this.$route.path == "/globaldrugs/analysis") {
                this.dealYydwphBar(newVal);
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
    },
    methods: {
        descHandler(index) {
            let arr = ['zgyfjdDesc', 'ypflDesc', 'yplxDesc', 'tsspDesc', 'zllyDesc', 'bdphDesc', 'ypzDesc', 'ypzDesc', 'ypzDesc', 'yydwphDesc'];
            return this[arr[index]]
        },
        //初始化全屏图形
        initOpendKsh(index) {
            const _that = this;
            this.loading = true;
            this.dialogVisible = true;
            //使用定时器 解决echarts无法在隐藏元素绘制图形问题
            if (!_that.initopen) {
                _that.loading = false;
                setTimeout(() => {
                    _that.initLayout();
                    _that.initopen = true;
                    _that.drawZgyfjdBarOpen();
                    _that.drawYpflDoughtOpen();
                    _that.drawYplxPieOpen();
                    _that.drawZllyStackBarOpen();
                    _that.drawBdphBarOpen();
                    _that.drawYpzsyzBarOpen();
                    _that.drawZysyzphBarOpen();
                    _that.drawZzsyzphBarOpen();
                    _that.drawYydwphBarOpen();

                    _that.handleOpenIndex(index);
                    this.loading = false;
                }, 500);
            } else {
                this.handleOpenIndex(index);
                this.loading = false;
            }
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
        },
        // 切换为饼形图
        handleTogglePie(el, data, index, oIndex) {
            let _that = this;
            let option;
            $("#" + el).removeAttr("_echarts_instance_");
            let chart = Echarts.init(document.getElementById(el), "westeros");
            chart.off('click')
            chart.clear()

            let legend_data1 = [],
                legend_data2 = [];

            if (el == "zgyfjd-bar-globaldrugs" || el == "zgyfjd-bar-globaldrugs-open") {
                legend_data1 = _that.topphase.world_maxphase.map(item => item.label);
                legend_data2 = _that.topphase.china_maxphase.map(item => item.label);
                option = {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(index, chart);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_切换',])
                                    if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                                    _that.handleToggleBar(el, data, index);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_全屏',])
                                    _that.initOpendKsh(index);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }<br/>占比：${params.percent ? params.percent : 0}%`;
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
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%',
                            containLabel: true
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: '50%',
                            center: ['25%', '50%'],
                            data: data.xAxis1_data.reduce((res, item, index) => {
                                res.push({ value: data.series1_data[index], name: item });
                                return res;
                            }, []),
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
                        {
                            type: "pie",
                            radius: '50%',
                            center: ['75%', '50%'],
                            data: data.xAxis2_data.reduce((res, item, index) => {
                                res.push({ value: data.series2_data[index], name: item });
                                return res;
                            }, []),
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
                    ],
                };

                if (index == undefined) {
                    option.toolbox.feature.myMagnify = {};
                }
                chart.setOption(option);
                chart.on('click', function (params) {
                    _that.zgyfjdLink(params);
                });
            } else if (el == "ypfl-dought-globaldrugs" || el == "ypfl-dought-globaldrugs-open") {
                legend_data1 = _that.ypfxLeixingbm.world.map(item => item.label);
                legend_data2 = _that.ypfxLeixingbm.china.map(item => item.label);

                option = {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(index, chart);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_切换',])
                                    if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                                    _that.handleToggleBar(el, data, index);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_全屏',])
                                    _that.initOpendKsh(index);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }<br/>占比：${params.percent ? params.percent : 0}%`;
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
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%',
                            containLabel: true
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['25%', '50%'],
                            data: data.series1_data,
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
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['75%', '50%'],
                            data: data.series2_data,
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
                    ],
                };

                if (index == undefined) {
                    option.toolbox.feature.myMagnify = {};
                }
                chart.setOption(option);
                chart.on('click', function (params) {
                    _that.ypflLink(params);
                });
            } else if (el == "yplx-pie-globaldrugs" || el == "yplx-pie-globaldrugs-open") {
                legend_data1 = _that.ypfxYplx.world.map(item => item.label);
                legend_data2 = _that.ypfxYplx.china.map(item => item.label);

                option = {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(index, chart);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_切换',])
                                    if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                                    _that.handleToggleBar(el, data, index);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_全屏',])
                                    _that.initOpendKsh(index);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }<br/>占比：${params.percent ? params.percent : 0}%`;
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
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%',
                            containLabel: true
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: '50%',
                            center: ['25%', '50%'],
                            data: data.series1_data,
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
                        {
                            type: "pie",
                            radius: '50%',
                            center: ['75%', '50%'],
                            data: data.series2_data,
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
                    ],
                };

                if (index == undefined) {
                    option.toolbox.feature.myMagnify = {};
                }
                chart.setOption(option);
                chart.on('click', function (params) {
                    _that.yplxLink(params);
                });
            } else if (el == "tssp-dought-globaldrugs" || el == "tssp-dought-globaldrugs-open") {
                legend_data1 = _that.ypfxTssp.world.map(item => item.label);
                legend_data2 = _that.ypfxTssp.china.map(item => item.label);

                option = {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(index, chart);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_切换',])
                                    if (oIndex || index) _that.tempType[oIndex || index] = "bar";
                                    _that.handleToggleBar(el, data, index);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_全屏',])
                                    _that.initOpendKsh(index);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }<br/>占比：${params.percent ? params.percent : 0}%`;
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
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%',
                            containLabel: true
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['25%', '50%'],
                            data: data.series1_data,
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
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['75%', '50%'],
                            data: data.series2_data,
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
                    ],
                };

                if (index == undefined) {
                    option.toolbox.feature.myMagnify = {};
                }
                chart.setOption(option);
                chart.on('click', function (params) {
                    _that.tsspLink(params);
                });
            }
        },
        // 切换为柱形图
        handleToggleBar(el, data, index, oIndex) {
            const _that = this;
            let option;
            $("#" + el).removeAttr("_echarts_instance_");
            let chart = Echarts.init(document.getElementById(el), "westeros");
            chart.off('click')
            chart.clear()
            if (el == 'zgyfjd-bar-globaldrugs' || el == 'zgyfjd-bar-globaldrugs-open') {
                _that.tempType[0] = "bar";
                option = {
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }`;
                        }
                    },
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(index, chart);
                                }
                            },
                            myTogglePie: {
                                show: true,
                                title: "饼形图",
                                icon: _that.pieIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_切换',])
                                    if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                                    _that.handleTogglePie(el, data, index);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_全屏',])
                                    _that.initOpendKsh(index);
                                }
                            }
                        }
                    },
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    grid: [
                        {
                            right: '52%',
                            width: '43%',
                            bottom: 80,
                            containLabel: true
                        },
                        {
                            left: '53%',
                            width: '43%',
                            bottom: 80,
                            containLabel: true
                        }
                    ],
                    xAxis: [{
                        type: 'category',
                        data: data.xAxis1_data,
                        axisLabel: {
                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }, {
                        gridIndex: 1,
                        type: 'category',
                        data: data.xAxis2_data,
                        axisLabel: {

                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    }, {
                        type: 'value',
                        gridIndex: 1,
                        splitLine: {
                            show: false
                        }
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [{
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
                        data: data.series1_data
                    }, {
                        type: 'bar',
                        barMaxWidth: 30,
                        stack: 'component',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        z: 3,
                        label: {
                            normal: {
                                position: 'top',
                                show: true
                            }
                        },
                        data: data.series2_data
                    }]
                };

                if (index == undefined) {
                    option.toolbox.feature.myMagnify = {};
                }
                chart.setOption(option);
                chart.on('click', function (params) {
                    _that.zgyfjdLink(params);
                });
            } else {
                option = {
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }`;
                        }
                    },
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(index, chart);
                                }
                            },
                            myTogglePie: {
                                show: true,
                                title: "饼形图",
                                icon: _that.pieIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_切换',])
                                    if (oIndex || index) _that.tempType[oIndex || index] = "pie";
                                    _that.handleTogglePie(el, data, index);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[oIndex || index] + '_全屏',])
                                    _that.initOpendKsh(index);
                                }
                            }
                        }
                    },
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    grid: [
                        {
                            right: '52%',
                            width: '43%',
                            bottom: 80,
                            containLabel: true
                        },
                        {
                            left: '53%',
                            width: '43%',
                            bottom: 80,
                            containLabel: true
                        }
                    ],
                    xAxis: [{
                        type: 'category',
                        data: data.xAxis1_data,
                        axisLabel: {
                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }, {
                        gridIndex: 1,
                        type: 'category',
                        data: data.xAxis2_data,
                        axisLabel: {

                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    }, {
                        type: 'value',
                        gridIndex: 1,
                        splitLine: {
                            show: false
                        }
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [{
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
                        data: data.series1_data
                    }, {
                        type: 'bar',
                        barMaxWidth: 30,
                        stack: 'component',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        z: 3,
                        label: {
                            normal: {
                                position: 'top',
                                show: true
                            }
                        },
                        data: data.series2_data
                    }]
                };

                if (index == undefined) {
                    option.toolbox.feature.myMagnify = {};
                }
                chart.setOption(option);
                chart.on('click', function (params) {
                    switch (el) {
                        case "ypfl-dought-globaldrugs":
                        case "ypfl-dought-globaldrugs-open":
                            _that.ypflLink(params);
                            break;
                        case "yplx-pie-globaldrugs":
                        case "yplx-pie-globaldrugs-open":
                            _that.yplxLink(params);
                            break;
                        case "tssp-dought-globaldrugs":
                        case "tssp-dought-globaldrugs-open":
                            _that.tsspLink(params);
                            break;
                    }
                });
            }
        },
        handleDialogVisible(value) {
            this.dialogVisible = value;
            // 退出全屏的时候需要将initopen改为false，不然不会重新渲染图标。
            this.initopen = value;
        },
        handleOpenIndex(index) {
            if (index > 0 && index < 10) {
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
        getImgName(i, chart) {
            let title = i ? this.title[i] : this.title[this.openIndex];
            window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + title + '_保存',])
            let imgName = `药智数据企业版-${document.title}-${title}-${Moment().format("YYYYMMDDHHss")}.png`;
            // 这里是获取到的图片base64编码,这里只是个例子哈，要自行编码图片替换这里才能测试看到效果
            const imgUrl = chart.getDataURL({
                excludeComponents: ['toolbox']
            });
            // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
            if (window.navigator.msSaveOrOpenBlob) {
                let bstr = Buffer.from(imgUrl.split(",")[1], 'base64');
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                let blob = new Blob([u8arr]);
                window.navigator.msSaveOrOpenBlob(blob, imgName);
            } else {
                // 这里就按照chrome等新版浏览器来处理
                let a = document.createElement("a");
                a.href = imgUrl;
                a.setAttribute("download", imgName);
                a.click();
            }
        },
        acceptList() {
            let query = this.$route.query;
            Store.commit('Globaldrugs/putongAnaly', query);
        },
        showEchartChildPanel(index) {
            this.panelChildIndex = index;
            const _that = this;
            this.$nextTick(() => {
                _that.echartsResizeHandler()
            })
        },
        loadData: _.debounce(function () {
            Store.dispatch("Globaldrugs/getKshRes").then(res => {
                this.update();
            });
        }, 10),
        update() {
            this.dealZgyfjdBar(this.topphase);
            this.dealYpflDought(this.ypfxLeixingbm);
            this.dealYplxPie(this.ypfxYplx);
            this.dealZllyStackBar(this.ypfxZlly);
            this.dealBdphBar(this.ypfxBdph);
            this.dealYpzsyzphBar(this.ypfxYpzsyzph);
            this.dealZysyzphBar(this.ypfxZysyzph);
            this.dealZzsyzphBar(this.ypfxZzsyzph);
            this.dealYydwphBar(this.ypfxYydwph);
        },
        zgyfjdLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = _that.topphase[params.componentIndex == 0 ? 'world_maxphase' : 'china_maxphase'].filter(item => item.label === params.name);
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (arr.length > 0) {
                // 全球最高研发阶段
                if (params.componentIndex == 0) {
                    tempObj["phase1"] = [arr[0].key]
                } else if (params.componentIndex == 1) {
                    // 中国最高研发阶段
                    tempObj["phase2"] = [arr[0].key]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (const [key, val] of Object.entries(tempObj)) {
                    if (val[0].length > 0) {
                        val[0] = val[0].join("ღ")
                        console.log(key, val);
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        // 最高研发阶段双柱状图
        dealZgyfjdBar(topphase) {
            if (this.isEmpty(topphase)) {
                let _len1 = topphase.china_maxphase.length,
                    _len2 = topphase.world_maxphase.length,
                    dataIndex = 0,
                    xAxis1_data = [],
                    xAxis2_data = [],
                    series1_data = [],
                    series2_data = [];

                if (_len1 > 0 || _len2 > 0) {
                    topphase.world_maxphase.length > 0 && topphase.world_maxphase.forEach(item => {
                        xAxis1_data.push(item.label);
                        series1_data.push(item.doc_count);
                    })
                    topphase.china_maxphase.length > 0 && topphase.china_maxphase.forEach(item => {
                        xAxis2_data.push(item.label);
                        series2_data.push(item.doc_count);
                    })

                    this.zgyfjd_bar.xAxis1_data = xAxis1_data;
                    this.zgyfjd_bar.series1_data = series1_data;
                    this.zgyfjd_bar.xAxis2_data = xAxis2_data;
                    this.zgyfjd_bar.series2_data = series2_data;
                    this.drawZgyfjdBar();

                    this.recordNoData.delete(0);
                } else {
                    this.recordNoData.add(0);
                    $("#zgyfjd-bar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#zgyfjd-bar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(0);
                $("#zgyfjd-bar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#zgyfjd-bar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        drawZgyfjdBar() {
            var _that = this;
            let dom = "zgyfjd-bar-globaldrugs",
                dataIndex = 0;
            _that.zgyfjd_bar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            _that.zgyfjd_bar.echarts.clear()
            _that.zgyfjd_bar.echarts.off('click');
            _that.tempType[0] = 'bar'
            _that.zgyfjd_bar.echarts.setOption(
                {
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }`;
                        }
                    },
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(dataIndex, _that.zgyfjd_bar.echarts);
                                }
                            },
                            myTogglePie: {
                                show: true,
                                title: "饼形图",
                                icon: _that.pieIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                    _that.tempType[0] = 'pie';
                                    _that.handleTogglePie(dom, _that.zgyfjd_bar, 0);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                    _that.tempType[0] = 'bar';
                                    _that.initOpendKsh(0);
                                }
                            }
                        }
                    },
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    grid: [
                        {
                            right: '52%',
                            width: '43%',
                            bottom: 80,
                            containLabel: true
                        },
                        {
                            left: '53%',
                            width: '43%',
                            bottom: 80,
                            containLabel: true
                        }
                    ],
                    xAxis: [{
                        type: 'category',
                        data: _that.zgyfjd_bar.xAxis1_data,
                        axisLabel: {
                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }, {
                        gridIndex: 1,
                        type: 'category',
                        data: _that.zgyfjd_bar.xAxis2_data,
                        axisLabel: {

                            rotate: 30
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: false
                        }
                    }, {
                        type: 'value',
                        gridIndex: 1,
                        splitLine: {
                            show: false
                        }
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [{
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
                        data: _that.zgyfjd_bar.series1_data
                    }, {
                        type: 'bar',
                        barMaxWidth: 30,
                        stack: 'component',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        z: 3,
                        label: {
                            normal: {
                                position: 'top',
                                show: true
                            }
                        },
                        data: _that.zgyfjd_bar.series2_data
                    }]
                }
            );
            _that.zgyfjd_bar.echarts.on('click', function (params) {
                _that.zgyfjdLink(params);
            });
        },
        drawZgyfjdBarOpen() {
            var _that = this;
            let typeIndex = 0, dom = "zgyfjd-bar-globaldrugs-open";

            if (this.tempType[0] == 'pie') {
                _that.handleTogglePie(
                    "zgyfjd-bar-globaldrugs-open",
                    _that.zgyfjd_bar,
                    undefined,
                    0
                );
            } else {
                var e = Echarts.init(
                    document.getElementById(dom),
                    "westeros"
                );
                e.clear()
                e.off('click')
                e.setOption(
                    {
                        tooltip: {
                            trigger: "item",
                            formatter: function (params) {
                                let str = params.seriesIndex == 0 ? '全球' : '中国';
                                return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                    }`;
                            }
                        },
                        toolbox: {
                            right: "20",
                            feature: {
                                mySaveAsImage: {
                                    title: "保存",
                                    icon: _that.saveIcon,
                                    onclick() {
                                        _that.getImgName(typeIndex, e);
                                    }
                                },
                                myTogglePie: {
                                    show: true,
                                    title: "饼形图",
                                    icon: _that.pieIcon,
                                    onclick() {
                                        window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[typeIndex] + '_切换',])
                                        _that.tempType[0] = "pie";
                                        _that.handleTogglePie(
                                            "zgyfjd-bar-globaldrugs-open",
                                            _that.zgyfjd_bar,
                                            undefined
                                        );
                                    }
                                }
                            }
                        },
                        title: [{
                            text: '全球',
                            left: '25%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }, {
                            text: '中国',
                            left: '75%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }],
                        grid: [
                            {
                                right: '52%',
                                width: '43%',
                                bottom: 80,
                                containLabel: true
                            },
                            {
                                left: '53%',
                                width: '43%',
                                bottom: 80,
                                containLabel: true
                            }
                        ],
                        xAxis: [{
                            type: 'category',
                            data: _that.zgyfjd_bar.xAxis1_data,
                            axisLabel: {
                                rotate: 30
                            },
                            splitLine: {
                                show: false
                            }
                        }, {
                            gridIndex: 1,
                            type: 'category',
                            data: _that.zgyfjd_bar.xAxis2_data,
                            axisLabel: {

                                rotate: 30
                            },
                            splitLine: {
                                show: false
                            }
                        }],
                        yAxis: [{
                            type: 'value',
                            splitLine: {
                                show: false
                            }
                        }, {
                            type: 'value',
                            gridIndex: 1,
                            splitLine: {
                                show: false
                            }
                        }],
                        backgroundColor: "#FAFBFD",
                        series: [{
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
                            data: _that.zgyfjd_bar.series1_data
                        }, {
                            type: 'bar',
                            barMaxWidth: 30,
                            stack: 'component',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            z: 3,
                            label: {
                                normal: {
                                    position: 'top',
                                    show: true
                                }
                            },
                            data: _that.zgyfjd_bar.series2_data
                        }]
                    }
                );
                e.on('click', function (params) {
                    _that.zgyfjdLink(params);
                });
            }
        },
        // 药品分类双环形图
        dealYpflDought(ypfxLeixingbm) {
            if (this.isEmpty(ypfxLeixingbm)) {
                let _len1 = ypfxLeixingbm.china.length,
                    _len2 = ypfxLeixingbm.world.length,
                    dataIndex = 1,
                    xAxis1_data = [],
                    xAxis2_data = [],
                    series1_data = [],
                    series2_data = [];

                if (_len1 > 0 || _len2 > 0) {
                    ypfxLeixingbm.world.length > 0 && ypfxLeixingbm.world.forEach(item => {
                        xAxis1_data.push(item.label);
                        series1_data.push({ name: item.label, value: item.doc_count });
                    })
                    ypfxLeixingbm.china.length > 0 && ypfxLeixingbm.china.forEach(item => {
                        xAxis2_data.push(item.label);
                        series2_data.push({ name: item.label, value: item.doc_count });
                    })

                    this.ypfl_dought.xAxis1_data = xAxis1_data;
                    this.ypfl_dought.series1_data = series1_data;
                    this.ypfl_dought.xAxis2_data = xAxis2_data;
                    this.ypfl_dought.series2_data = series2_data;
                    this.drawYpflDought();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#ypfl-dought-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#ypfl-dought-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#ypfl-dought-globaldrugs").html('<div class="nodata-box"></div>');
                $("#ypfl-dought-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        ypflLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = [];
            for (const [key, val] of Object.entries(_that.filtersAnaly)) {
                if (key == 'leixingbm') {
                    arr = val;
                }
            }
            arr = arr.filter(item => item.label == params.name);
            if (arr.length > 0) {
                tempObj["leixingbm"] = [arr[0].key]
            }
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.componentIndex === 1) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            console.log(tempObj)
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                console.log(tempObj)
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawYpflDought() {
            const _that = this;
            let dom = "ypfl-dought-globaldrugs",
                dataIndex = 1;
            _that.ypfl_dought.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );

            let legend_data1 = _that.ypfxLeixingbm.world.map(item => item.label),
                legend_data2 = _that.ypfxLeixingbm.china.map(item => item.label)

            _that.ypfl_dought.echarts.clear()
            _that.ypfl_dought.echarts.off('click');
            _that.tempType[dataIndex] = 'pie'
            _that.ypfl_dought.echarts.setOption(
                {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(dataIndex, _that.ypfl_dought.echarts);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                    _that.tempType[dataIndex] = 'bar';
                                    _that.handleToggleBar(dom, _that.ypfl_dought, dataIndex);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                    _that.tempType[dataIndex] = 'pie';
                                    _that.initOpendKsh(dataIndex);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }<br/>占比：${params.percent ? params.percent : 0}%`;
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
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%',
                            containLabel: true
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['25%', '50%'],
                            data: _that.ypfl_dought.series1_data,
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
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['75%', '50%'],
                            data: _that.ypfl_dought.series2_data,
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
                    ],
                }
            );

            _that.ypfl_dought.echarts.on('click', function (params) {
                _that.ypflLink(params)
            });
        },
        drawYpflDoughtOpen() {
            const _that = this;
            let dom = "ypfl-dought-globaldrugs-open",
                dataIndex = 1;
            if (this.tempType[dataIndex] == 'pie') {
                _that.handleTogglePie(
                    dom,
                    _that.ypfl_dought,
                    undefined,
                    dataIndex
                );
            } else {
                var e = Echarts.init(
                    document.getElementById(dom),
                    "westeros"
                );
                e.clear()
                e.off('click')
                let legend_data1 = _that.ypfxLeixingbm.world.map(item => item.label),
                    legend_data2 = _that.ypfxLeixingbm.china.map(item => item.label)

                e.setOption(
                    {
                        toolbox: {
                            right: "20",
                            feature: {
                                mySaveAsImage: {
                                    title: "保存",
                                    icon: _that.saveIcon,
                                    onclick() {
                                        _that.getImgName(dataIndex, e);
                                    }
                                },
                                myToggleBar: {
                                    show: true,
                                    title: "柱形图",
                                    icon: _that.barIcon,
                                    onclick() {
                                        window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                        _that.tempType[dataIndex] = "bar";
                                        _that.handleToggleBar(
                                            dom,
                                            _that.ypfl_dought,
                                            undefined
                                        );
                                    }
                                },
                            }
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: function (params) {
                                let str = params.seriesIndex == 0 ? '全球' : '中国';
                                return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                    }<br/>占比：${params.percent ? params.percent : 0}%`;
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
                            },
                            {
                                data: legend_data2,
                                type: 'scroll',
                                orient: 'vertical',
                                left: '50%',
                                bottom: _that.titleBottom,
                                height: '35%',
                                containLabel: true
                            }
                        ],
                        title: [{
                            text: '全球',
                            left: '25%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }, {
                            text: '中国',
                            left: '75%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }],
                        backgroundColor: "#FAFBFD",
                        series: [
                            {
                                type: "pie",
                                radius: ["30%", "50%"],
                                center: ['25%', '50%'],
                                data: _that.ypfl_dought.series1_data,
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
                            {
                                type: "pie",
                                radius: ["30%", "50%"],
                                center: ['75%', '50%'],
                                data: _that.ypfl_dought.series2_data,
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
                        ],
                    }
                );

                e.on('click', function (params) {
                    _that.ypflLink(params)
                });
            }
        },
        // 药品类型双饼图
        dealYplxPie(ypfxYplx) {
            if (this.isEmpty(ypfxYplx)) {
                let _len1 = ypfxYplx.china.length,
                    _len2 = ypfxYplx.world.length,
                    dataIndex = 2,
                    xAxis1_data = [],
                    xAxis2_data = [],
                    series1_data = [],
                    series2_data = [];

                if (_len1 > 0 || _len2 > 0) {
                    ypfxYplx.world.length > 0 && ypfxYplx.world.forEach(item => {
                        xAxis1_data.push(item.label);
                        series1_data.push({ name: item.label, value: item.doc_count });
                    })
                    ypfxYplx.china.length > 0 && ypfxYplx.china.forEach(item => {
                        xAxis2_data.push(item.label);
                        series2_data.push({ name: item.label, value: item.doc_count });
                    })

                    this.yplx_pie.xAxis1_data = xAxis1_data;
                    this.yplx_pie.series1_data = series1_data;
                    this.yplx_pie.xAxis2_data = xAxis2_data;
                    this.yplx_pie.series2_data = series2_data;
                    this.drawYplxPie();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#yplx-pie-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#yplx-pie-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#yplx-pie-globaldrugs").html('<div class="nodata-box"></div>');
                $("#yplx-pie-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        yplxLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = _that.ypfxYplx[params.componentIndex == 0 ? 'world' : 'china'].filter(item => item.label === params.name);
            if (arr.length > 0) {
                tempObj["leixing"] = [arr[0].key]
            }
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.componentIndex === 1) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawYplxPie() {
            const _that = this;
            let dom = "yplx-pie-globaldrugs",
                dataIndex = 2;
            _that.yplx_pie.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            let legend_data1 = _that.ypfxYplx.world.map(item => item.label),
                legend_data2 = _that.ypfxYplx.china.map(item => item.label)

            _that.yplx_pie.echarts.clear()
            _that.yplx_pie.echarts.off('click')
            _that.tempType[dataIndex] = 'pie'
            _that.yplx_pie.echarts.setOption(
                {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(dataIndex, _that.yplx_pie.echarts);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                    _that.tempType[dataIndex] = 'bar'
                                    _that.handleToggleBar(dom, _that.yplx_pie, dataIndex);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                    _that.tempType[dataIndex] = 'pie'
                                    _that.initOpendKsh(dataIndex);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0}
                            <br/>占比：${params.percent ? params.percent : 0}%`;
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
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%',
                            containLabel: true
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: '50%',
                            center: ['25%', '50%'],
                            data: _that.yplx_pie.series1_data,
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
                        {
                            type: "pie",
                            radius: '50%',
                            center: ['75%', '50%'],
                            data: _that.yplx_pie.series2_data,
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
                    ],
                }
            );

            _that.yplx_pie.echarts.on('click', function (params) {
                _that.yplxLink(params)
            });
        },
        drawYplxPieOpen() {
            const _that = this;
            let dom = "yplx-pie-globaldrugs-open",
                dataIndex = 2;
            if (this.tempType[dataIndex] == 'pie') {
                _that.handleTogglePie(
                    dom,
                    _that.yplx_pie,
                    undefined,
                    dataIndex
                );
            } else {
                var e = Echarts.init(
                    document.getElementById(dom),
                    "westeros"
                );
                e.clear()
                e.off('click')
                let legend_data1 = _that.ypfxYplx.world.map(item => item.label),
                    legend_data2 = _that.ypfxYplx.china.map(item => item.label)

                e.setOption(
                    {
                        toolbox: {
                            right: "20",
                            feature: {
                                mySaveAsImage: {
                                    title: "保存",
                                    icon: _that.saveIcon,
                                    onclick() {
                                        _that.getImgName(dataIndex, e);
                                    }
                                },
                                myTogglePie: {
                                    show: true,
                                    title: "柱形图",
                                    icon: _that.barIcon,
                                    onclick() {
                                        window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                        _that.tempType[dataIndex] = "bar";
                                        _that.handleToggleBar(
                                            dom,
                                            _that.ylfl_pie,
                                            undefined
                                        );
                                    }
                                }
                            }
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: function (params) {
                                let str = params.seriesIndex == 0 ? '全球' : '中国';
                                return `${params.name}<br/>${str}：${params.value ? params.value : 0}
                            <br/>占比：${params.percent ? params.percent : 0}%`;
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
                            },
                            {
                                data: legend_data2,
                                type: 'scroll',
                                orient: 'vertical',
                                left: '50%',
                                bottom: _that.titleBottom,
                                height: '35%',
                                containLabel: true
                            }
                        ],
                        title: [{
                            text: '全球',
                            left: '25%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }, {
                            text: '中国',
                            left: '75%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }],
                        backgroundColor: "#FAFBFD",
                        series: [
                            {
                                type: "pie",
                                radius: '50%',
                                center: ['25%', '50%'],
                                data: _that.yplx_pie.series1_data,
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
                            {
                                type: "pie",
                                radius: '50%',
                                center: ['75%', '50%'],
                                data: _that.yplx_pie.series2_data,
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
                        ],
                    }
                );

                e.on('click', function (params) {
                    _that.yplxLink(params)
                });
            }
        },
        // 特殊审评双环形图
        dealTsspDought(ypfxTssp) {
            if (this.isEmpty(ypfxTssp)) {
                let _len1 = ypfxTssp.china.length,
                    _len2 = ypfxTssp.world.length,
                    dataIndex = 3,
                    xAxis1_data = [],
                    xAxis2_data = [],
                    series1_data = [],
                    series2_data = [];

                if (_len1 > 0 || _len2 > 0) {
                    ypfxTssp.world.length > 0 && ypfxTssp.world.forEach(item => {
                        xAxis1_data.push(item.label);
                        series1_data.push({ name: item.label, value: item.doc_count });
                    })
                    ypfxTssp.china.length > 0 && ypfxTssp.china.forEach(item => {
                        xAxis2_data.push(item.label);
                        series2_data.push({ name: item.label, value: item.doc_count });
                    })

                    this.tssp_dought.xAxis1_data = xAxis1_data;
                    this.tssp_dought.series1_data = series1_data;
                    this.tssp_dought.xAxis2_data = xAxis2_data;
                    this.tssp_dought.series2_data = series2_data;
                    this.drawTsspDought();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#tssp-dought-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#tssp-dought-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#tssp-dought-globaldrugs").html('<div class="nodata-box"></div>');
                $("#tssp-dought-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        tsspLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = _that.ypfxTssp[params.componentIndex == 0 ? 'world' : 'china'].filter(item => item.label === params.name);

            if (arr.length > 0) {
                tempObj["tssp"] = [arr[0].key]
            }
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.componentIndex === 1) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawTsspDought() {
            const _that = this;
            let dom = "tssp-dought-globaldrugs",
                dataIndex = 3;
            _that.tssp_dought.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            let legend_data1 = _that.ypfxTssp.world.map(item => item.label),
                legend_data2 = _that.ypfxTssp.china.map(item => item.label)

            _that.tssp_dought.echarts.off('click')
            _that.tssp_dought.echarts.clear()
            _that.tempType[dataIndex] = 'pie'
            _that.tssp_dought.echarts.setOption(
                {
                    toolbox: {
                        right: "20",
                        feature: {
                            mySaveAsImage: {
                                title: "保存",
                                icon: _that.saveIcon,
                                onclick() {
                                    _that.getImgName(dataIndex, _that.tssp_dought.echarts);
                                }
                            },
                            myToggleBar: {
                                show: true,
                                title: "柱形图",
                                icon: _that.barIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                    _that.tempType[dataIndex] = 'bar';
                                    _that.handleToggleBar(dom, _that.tssp_dought, dataIndex);
                                }
                            },
                            myMagnify: {
                                show: true,
                                title: "全屏",
                                icon: _that.fullscreenIcon,
                                onclick() {
                                    window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                    _that.tempType[dataIndex] = 'pie';
                                    _that.initOpendKsh(dataIndex);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            let str = params.seriesIndex == 0 ? '全球' : '中国';
                            return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                }<br/>占比：${params.percent ? params.percent : 0}%`;
                        }
                    },
                    legend: [
                        {
                            data: legend_data1,
                            type: 'scroll',
                            orient: 'vertical',
                            left: 10,
                            bottom: _that.titleBottom,
                            height: '35%'
                        },
                        {
                            data: legend_data2,
                            type: 'scroll',
                            orient: 'vertical',
                            left: '50%',
                            bottom: _that.titleBottom,
                            height: '35%'
                        }
                    ],
                    title: [{
                        text: '全球',
                        left: '25%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }, {
                        text: '中国',
                        left: '75%',
                        bottom: _that.titleBottom,
                        textStyle: {
                            fontSize: 14
                        },
                        textAlign: 'center',
                    }],
                    backgroundColor: "#FAFBFD",
                    series: [
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['25%', '50%'],
                            data: _that.tssp_dought.series1_data,
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
                        {
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: ['75%', '50%'],
                            data: _that.tssp_dought.series2_data,
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
                    ],
                }
            );

            _that.tssp_dought.echarts.on('click', function (params) {
                _that.tsspLink(params)
            });
        },
        drawTsspDoughtOpen() {
            const _that = this;
            let dom = "tssp-dought-globaldrugs-open",
                dataIndex = 3;
            if (this.tempType[dataIndex] == 'pie') {
                _that.handleTogglePie(
                    dom,
                    _that.tssp_dought,
                    undefined,
                    dataIndex
                );
            } else {
                var e = Echarts.init(
                    document.getElementById(dom),
                    "westeros"
                );
                e.clear()
                e.off('click')
                let legend_data1 = _that.ypfxTssp.world.map(item => item.label),
                    legend_data2 = _that.ypfxTssp.china.map(item => item.label)

                e.setOption(
                    {
                        toolbox: {
                            right: "20",
                            feature: {
                                mySaveAsImage: {
                                    title: "保存",
                                    icon: _that.saveIcon,
                                    onclick() {
                                        _that.getImgName(dataIndex, e);
                                    }
                                },
                                myTogglePie: {
                                    show: true,
                                    title: "柱形图",
                                    icon: _that.barIcon,
                                    onclick() {
                                        window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_切换',])
                                        _that.tempType[dataIndex] = "bar";
                                        _that.handleToggleBar(
                                            dom,
                                            _that.tssp_dought,
                                            undefined
                                        );
                                    }
                                }
                            }
                        },
                        tooltip: {
                            trigger: "item",
                            formatter: function (params) {
                                let str = params.seriesIndex == 0 ? '全球' : '中国';
                                return `${params.name}<br/>${str}：${params.value ? params.value : 0
                                    }<br/>占比：${params.percent ? params.percent : 0}%`;
                            }
                        },
                        legend: [
                            {
                                data: legend_data1,
                                type: 'scroll',
                                orient: 'vertical',
                                left: 10,
                                bottom: _that.titleBottom,
                                height: '35%'
                            },
                            {
                                data: legend_data2,
                                type: 'scroll',
                                orient: 'vertical',
                                left: '50%',
                                bottom: _that.titleBottom,
                                height: '35%'
                            }
                        ],
                        title: [{
                            text: '全球',
                            left: '25%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }, {
                            text: '中国',
                            left: '75%',
                            bottom: _that.titleBottom,
                            textStyle: {
                                fontSize: 14
                            },
                            textAlign: 'center',
                        }],
                        backgroundColor: "#FAFBFD",
                        series: [
                            {
                                type: "pie",
                                radius: ["30%", "50%"],
                                center: ['25%', '50%'],
                                data: _that.tssp_dought.series1_data,
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
                            {
                                type: "pie",
                                radius: ["30%", "50%"],
                                center: ['75%', '50%'],
                                data: _that.tssp_dought.series2_data,
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
                        ],
                    }
                );

                e.on('click', function (params) {
                    _that.tsspLink(params)
                });
            }
        },
        // 治疗领域双堆叠柱状图
        dealZllyStackBar(ypfxZllySource) {
            if (this.isEmpty(ypfxZllySource)) {
                let ypfxZlly = _.cloneDeep(ypfxZllySource),
                    _len1 = ypfxZlly.world.length,
                    _len2 = ypfxZlly.china.length,
                    dataIndex = 4,
                    xAxis1_data = [],
                    xAxis2_data = [],
                    series_data_result1 = [],
                    series_data_result2 = [],
                    yAxis_data1 = [],
                    series_data1 = [],
                    yAxis_data2 = [],
                    series_data2 = [],
                    legend_data1 = ypfxZlly.world.map(item => item.label),
                    legend_data2 = ypfxZlly.china.map(item => item.label),
                    legend_data_len1 = legend_data1.length,
                    legend_data_len2 = legend_data2.length;

                // let notAllZero1 = ypfxZlly.world.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // }), notAllZero2 = ypfxZlly.china.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // });

                // if (!notAllZero1) {
                //     _len1 = 0;
                // }
                // if (!notAllZero2) {
                //     _len2 = 0;
                // }

                if (_len1 > 0 || _len2 > 0) {
                    try {

                        if (_len1 > 0) {
                            for (var k = 0; k < _len1; k++) {
                                yAxis_data1.push(ypfxZlly.world[k].label);
                            }
                            for (var i = 0; i < 7; i++) {
                                series_data1[i] = new Array(_len1);
                                for (var j = 0; j < 7; j++) {
                                    let gfzt_len1 = ypfxZlly.world[j].zong.length;
                                    let gfzt_phase = [];
                                    for (var n = 0; n < gfzt_len1; n++) {
                                        gfzt_phase.push(ypfxZlly.world[j].zong[n].phase);
                                    }
                                    let m = _.indexOf(gfzt_phase, legend_data1[i].trim());
                                    if (m < 0) {
                                        series_data1[i][j] = 0;
                                    } else {
                                        series_data1[i][j] =
                                            ypfxZlly.world[j].zong[m].num;
                                    }
                                }
                            }
                            for (var j = 0; j < 7; j++) {
                                let tempArr = [],
                                    total = 0;
                                ypfxZlly.world[j].zong.forEach(item => {
                                    total += item.num;
                                })
                                for (var l = 0; l < legend_data_len1; l++) {
                                    tempArr.push(ypfxZlly.world[l].zong[j] !== undefined ? ypfxZlly.world[l].zong[j].num : 0);
                                }
                                series_data1[j] = tempArr;
                            }
                            for (var i = 0; i < 7; i++) {
                                series_data_result1.push({
                                    name: legend_data1[i] + '-全球',
                                    barMaxWidth: 30,
                                    type: "bar",
                                    stack: "治疗领域-全球",
                                    data: series_data1[i]
                                });
                            }
                        }

                        if (_len2 > 0) {
                            for (var k = 0; k < _len2; k++) {
                                yAxis_data2.push(ypfxZlly.china[k].label);
                            }
                            for (var i = 0; i < legend_data_len2; i++) {
                                series_data2[i] = new Array(_len2);
                                for (var j = 0; j < 7; j++) {
                                    let gfzt_len2 = ypfxZlly.china[j].zong.length;
                                    let gfzt_phase = [];
                                    for (var n = 0; n < gfzt_len2; n++) {
                                        gfzt_phase.push(ypfxZlly.china[j].zong[n].phase);
                                    }
                                    let m = _.indexOf(gfzt_phase, legend_data2[i].trim());
                                    if (m < 0) {
                                        series_data2[i][j] = 0;
                                    } else {
                                        series_data2[i][j] =
                                            ypfxZlly.china[j].zong[m].num;
                                    }
                                }
                            }
                            for (var j = 0; j < 7; j++) {
                                let tempArr = [],
                                    total = 0;
                                ypfxZlly.china[j].zong.forEach(item => {
                                    total += item.num;
                                })
                                for (var l = 0; l < legend_data_len2; l++) {
                                    tempArr.push(ypfxZlly.china[l].zong[j] !== undefined ? ypfxZlly.china[l].zong[j].num : 0);
                                }
                                series_data2[j] = tempArr;
                            }
                            for (var i = 0; i < 7; i++) {
                                series_data_result2.push({
                                    name: legend_data2[i] + '-中国',
                                    barMaxWidth: 30,
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    type: "bar",
                                    stack: "治疗领域-中国",
                                    data: series_data2[i]
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let series_data = []

                    if (series_data_result1.length > 0) {
                        series_data = series_data.concat(series_data_result1);
                    }

                    if (series_data_result2.length > 0) {
                        series_data = series_data.concat(series_data_result2);
                    }

                    this.zlly_stackbar.xAxis1_data = yAxis_data1;
                    // this.zlly_stackbar.series1_data = series1_data;
                    this.zlly_stackbar.xAxis2_data = yAxis_data2;
                    this.zlly_stackbar.series_data = series_data;
                    this.drawZllyStackBar();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#zlly-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#zlly-stackbar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#zlly-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#zlly-stackbar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        zllyLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = [];
            for (const [key, val] of Object.entries(_that.filtersAnaly)) {
                if (key == 'indication_standard') {
                    arr = val;
                }
            }
            arr = arr.filter(item => item.label == params.name);
            if (arr.length > 0) {
                tempObj["indication_standard"] = [arr[0].key]
            }
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.seriesName.includes('-中国')) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawZllyStackBar() {
            const _that = this;
            let dom = "zlly-stackbar-globaldrugs",
                dataIndex = 4;
            _that.zlly_stackbar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            let dataLen = 20; // 数据缩放条展示数据条数

            _that.zlly_stackbar.echarts.off('click')
            _that.zlly_stackbar.echarts.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, _that.zlly_stackbar.echarts);
                            }
                        },
                        myMagnify: {
                            show: true,
                            title: "全屏",
                            icon: _that.fullscreenIcon,
                            onclick() {
                                window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                _that.initOpendKsh(dataIndex);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];
                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxZlly.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxZlly.china);
                        }
                        tempData.filter(item => {
                            return item.label == params.name
                        })
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach((item, index) => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'category',
                    data: _that.zlly_stackbar.xAxis1_data,
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.zlly_stackbar.xAxis2_data,
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                backgroundColor: "#FAFBFD",
                series: _that.zlly_stackbar.series_data
            }
            if (_that.zlly_stackbar.xAxis1_data.length <= (dataLen / 2)) {
                option.grid[0].bottom = 40;
            } else {
                if (!option.dataZoom || option.dataZoom.length == 0) {
                    option.dataZoom = []
                }
                option.dataZoom.push({
                    id: 'dataZoomX',
                    show: true,
                    startValue: 0,
                    endValue: (dataLen / 2) - 1,
                    // realtime: false,// 拖动时，是否实时更新系列的视图。如果设置为 false，则只在拖拽结束的时候更新。
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
                    left: 50,
                    bottom: 50, // 组件离容器下侧的距离,'20%'
                    height: 25 //这里可以设置dataZoom的尺寸
                });
            }
            if (_that.zlly_stackbar.xAxis2_data.length <= (dataLen / 2)) {
                option.grid[1].bottom = 40;
            } else {
                if (!option.dataZoom || option.dataZoom.length == 0) {
                    option.dataZoom = []
                }
                option.dataZoom.push({
                    id: 'dataZoomX2',
                    xAxisIndex: 1,
                    show: true,
                    startValue: 0,
                    endValue: (dataLen / 2) - 1,
                    // realtime: false,// 拖动时，是否实时更新系列的视图。如果设置为 false，则只在拖拽结束的时候更新。
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
                    left: '52%',
                    bottom: 50, // 组件离容器下侧的距离,'20%'
                    height: 25 //这里可以设置dataZoom的尺寸
                });
            }
            _that.zlly_stackbar.echarts.setOption(option);

            _that.zlly_stackbar.echarts.on('click', function (params) {
                _that.zllyLink(params)
            });
        },
        drawZllyStackBarOpen() {
            const _that = this;
            let dom = "zlly-stackbar-globaldrugs-open",
                dataIndex = 4;
            var e = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            let dataLen = 20; // 数据缩放条展示数据条数

            e.off('click')
            e.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, e);
                            }
                        },
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxZlly.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxZlly.china);
                        }
                        tempData.filter(item => {
                            return item.label == params.name
                        })
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'category',
                    data: _that.zlly_stackbar.xAxis1_data,
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.zlly_stackbar.xAxis2_data,
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                backgroundColor: "#FAFBFD",
                series: _that.zlly_stackbar.series_data
            }
            if (_that.zlly_stackbar.xAxis1_data.length <= (dataLen / 2)) {
                option.grid[0].bottom = 40;
            } else {
                if (!option.dataZoom || option.dataZoom.length == 0) {
                    option.dataZoom = []
                }
                option.dataZoom.push({
                    id: 'dataZoomX',
                    show: true,
                    startValue: 0,
                    endValue: (dataLen / 2) - 1,
                    realtime: false,// 拖动时，是否实时更新系列的视图。如果设置为 false，则只在拖拽结束的时候更新。
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
                    left: 50,
                    bottom: 50, // 组件离容器下侧的距离,'20%'
                    height: 25 //这里可以设置dataZoom的尺寸
                });
            }
            if (_that.zlly_stackbar.xAxis2_data.length <= (dataLen / 2)) {
                option.grid[1].bottom = 40;
            } else {
                if (!option.dataZoom || option.dataZoom.length == 0) {
                    option.dataZoom = []
                }
                option.dataZoom.push({
                    id: 'dataZoomX2',
                    xAxisIndex: 1,
                    show: true,
                    startValue: 0,
                    endValue: (dataLen / 2) - 1,
                    realtime: false,// 拖动时，是否实时更新系列的视图。如果设置为 false，则只在拖拽结束的时候更新。
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true,
                    fillerColor: 'rgba(167,183,204,0.4)', // 选中的填充颜色
                    left: '52%',
                    bottom: 50, // 组件离容器下侧的距离,'20%'
                    height: 25 //这里可以设置dataZoom的尺寸
                });
            }
            e.setOption(option);
            e.on('click', function (params) {
                _that.zllyLink(params)
            });
        },
        // 靶点排行横向柱状图
        dealBdphBar(ypfxBdphSource) {
            if (this.isEmpty(ypfxBdphSource)) {
                let ypfxBdph = _.cloneDeep(ypfxBdphSource);
                let _len1 = ypfxBdph.world.length,
                    _len2 = ypfxBdph.china.length,
                    dataIndex = 5,
                    yAxis_data1 = [],
                    series_data1 = [],
                    series_data_result1 = [],
                    series_data_result2 = [],
                    yAxis_data2 = [],
                    series_data2 = [],
                    legend_data1 = ypfxBdph.world.map(item => item.label),
                    legend_data2 = ypfxBdph.china.map(item => item.label),
                    legend_data_len1 = legend_data1.length,
                    legend_data_len2 = legend_data2.length;

                this.ypfxBdphworld = ypfxBdph.world;
                this.ypfxBdphchina = ypfxBdph.china;

                // 数据全为0，显示nodata
                // let notAllZero1 = ypfxBdph.world.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // }), notAllZero2 = ypfxBdph.china.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // });

                // if (!notAllZero1) {
                //     _len1 = 0;
                // }
                // if (!notAllZero2) {
                //     _len2 = 0;
                // }

                if (_len1 > 0 || _len2 > 0) {
                    try {
                        let size1 = 0,
                            size2 = 0,
                            arr1 = [],
                            arr2 = [];
                        ypfxBdph.world.length > 0 && ypfxBdph.world.forEach(item => {
                            if (item.zong.length > 0) {
                                arr1.push(item.zong.length)
                            }
                        })
                        ypfxBdph.china.length > 0 && ypfxBdph.china.forEach(item => {
                            if (item.zong.length > 0) {
                                arr2.push(item.zong.length)
                            }
                        })
                        size1 = _.max(arr1)
                        size2 = _.max(arr2)
                        if (_len1 > 0) {
                            for (var k = 0; k < _len1; k++) {
                                yAxis_data1.unshift(ypfxBdph.world[k].label);
                            }
                            for (var j = 0; j < size1; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len1; l++) {
                                    tempArr.unshift(ypfxBdph.world[l].zong[j] ? ypfxBdph.world[l].zong[j].num : 0);
                                }
                                series_data1[j] = tempArr;
                            }
                            for (var i = 0; i < size1; i++) {
                                series_data_result1.unshift({
                                    name: legend_data1[i] + '-全球',
                                    barMaxWidth: 30,
                                    type: "bar",
                                    stack: "靶点排行-全球",
                                    data: series_data1[i]
                                });
                            }
                        }

                        if (_len2 > 0) {
                            for (var k = 0; k < _len2; k++) {
                                yAxis_data2.unshift(ypfxBdph.china[k].label);
                            }
                            for (var j = 0; j < size2; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len2; l++) {
                                    tempArr.unshift(ypfxBdph.china[l].zong[j] ? ypfxBdph.china[l].zong[j].num : 0);
                                }
                                series_data2[j] = tempArr;
                            }
                            for (var i = 0; i < size2; i++) {
                                series_data_result2.unshift({
                                    name: legend_data2[i] + '-中国',
                                    barMaxWidth: 30,
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    type: "bar",
                                    stack: "靶点排行-中国",
                                    data: series_data2[i]
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let series_data = []

                    if (series_data_result1.length > 0) {
                        series_data = series_data.concat(series_data_result1);
                    }

                    if (series_data_result2.length > 0) {
                        series_data = series_data.concat(series_data_result2);
                    }

                    this.bdph_stackbar.yAxis_data1 = yAxis_data1;
                    this.bdph_stackbar.yAxis_data2 = yAxis_data2;
                    this.bdph_stackbar.series_data = series_data;
                    this.drawBdphBar();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#bdph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#bdph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#bdph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#bdph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        bdphLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                };
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            query["targets"] = params.name
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.seriesName.includes('-中国')) {
                query["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawBdphBar() {
            const _that = this;
            let dom = "bdph-stackbar-globaldrugs",
                dataIndex = 5;
            _that.bdph_stackbar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxBdphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxBdphchina.map(item => item.label)
            _that.bdph_stackbar.echarts.off('click')
            _that.bdph_stackbar.echarts.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, _that.bdph_stackbar.echarts);
                            }
                        },
                        myMagnify: {
                            show: true,
                            title: "全屏",
                            icon: _that.fullscreenIcon,
                            onclick() {
                                window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                _that.initOpendKsh(dataIndex);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxBdphworld);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxBdphchina);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name),
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr[0].zong.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.bdph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.bdph_stackbar.yAxis_data2,

                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.bdph_stackbar.series_data
            }
            _that.bdph_stackbar.echarts.setOption(option);

            _that.bdph_stackbar.echarts.on('click', function (params) {
                _that.bdphLink(params)
            });
        },
        drawBdphBarOpen() {
            const _that = this;
            let dom = "bdph-stackbar-globaldrugs-open",
                dataIndex = 5;
            var e = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxBdphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxBdphchina.map(item => item.label)

            e.off('click')
            e.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, e);
                            }
                        },
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxBdph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxBdph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.bdph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.bdph_stackbar.yAxis_data2,

                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.bdph_stackbar.series_data
            }
            e.setOption(option);
            e.on('click', function (params) {
                _that.bdphLink(params)
            });
        },
        // 已批准适应症排行横向柱状图
        dealYpzsyzphBar(ypfxYpzsyzphSource) {
            if (this.isEmpty(ypfxYpzsyzphSource)) {
                let ypfxYpzsyzph = _.cloneDeep(ypfxYpzsyzphSource);
                let _len1 = ypfxYpzsyzph.world.length,
                    _len2 = ypfxYpzsyzph.china.length,
                    dataIndex = 6,
                    yAxis_data1 = [],
                    series_data1 = [],
                    series_data_result1 = [],
                    series_data_result2 = [],
                    yAxis_data2 = [],
                    series_data2 = [],
                    legend_data1 = ypfxYpzsyzph.world && ypfxYpzsyzph.world.map(item => item.label),
                    legend_data2 = ypfxYpzsyzph.china && ypfxYpzsyzph.china.map(item => item.label),
                    legend_data_len1 = legend_data1.length,
                    legend_data_len2 = legend_data2.length;

                this.ypfxYpzsyzphworld = ypfxYpzsyzph.world;
                this.ypfxYpzsyzphchina = ypfxYpzsyzph.china;

                // 数据全为0，显示nodata
                // let notAllZero1 = ypfxYpzsyzph.world.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // }), notAllZero2 = ypfxYpzsyzph.china.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // });
                // if (!notAllZero1) {
                //     _len1 = 0;
                // }
                // if (!notAllZero2) {
                //     _len2 = 0;
                // }

                if (_len1 > 0 || _len2 > 0) {
                    try {
                        let size1 = 0,
                            size2 = 0,
                            arr1 = [],
                            arr2 = [];
                        ypfxYpzsyzph.world.length > 0 && ypfxYpzsyzph.world.forEach(item => {
                            if (item.zong.length > 0) {
                                arr1.push(item.zong.length)
                            }
                        })
                        ypfxYpzsyzph.china.length > 0 && ypfxYpzsyzph.china.forEach(item => {
                            if (item.zong.length > 0) {
                                arr2.push(item.zong.length)
                            }
                        })
                        size1 = _.max(arr1)
                        size2 = _.max(arr2)
                        if (_len1 > 0) {
                            for (var k = 0; k < _len1; k++) {
                                yAxis_data1.unshift(ypfxYpzsyzph.world[k].label);
                            }
                            for (var j = 0; j < size1; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len1; l++) {
                                    tempArr.unshift(ypfxYpzsyzph.world[l].zong[j] !== undefined ? ypfxYpzsyzph.world[l].zong[j].num : 0);
                                }
                                series_data1[j] = tempArr;
                            }
                            for (var i = 0; i < size1; i++) {
                                series_data_result1.unshift({
                                    name: legend_data1[i] + '-全球',
                                    barMaxWidth: 30,
                                    type: "bar",
                                    stack: "已批准适应症排行-全球",
                                    data: series_data1[i]
                                });
                            }
                        }

                        if (_len2 > 0) {
                            for (var k = 0; k < _len2; k++) {
                                yAxis_data2.unshift(ypfxYpzsyzph.china[k].label);
                            }
                            for (var j = 0; j < size1; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len2; l++) {
                                    tempArr.unshift(ypfxYpzsyzph.china[l].zong[j] !== undefined ? ypfxYpzsyzph.china[l].zong[j].num : 0);
                                }
                                series_data2[j] = tempArr;
                            }
                            for (var i = 0; i < size2; i++) {
                                series_data_result2.unshift({
                                    name: legend_data2[i] + '-中国',
                                    barMaxWidth: 30,
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    type: "bar",
                                    stack: "已批准适应症排行-中国",
                                    data: series_data2[i]
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let series_data = []

                    if (series_data_result1.length > 0) {
                        series_data = series_data.concat(series_data_result1);
                    }

                    if (series_data_result2.length > 0) {
                        series_data = series_data.concat(series_data_result2);
                    }

                    this.ypzsyzph_stackbar.yAxis_data1 = yAxis_data1;
                    this.ypzsyzph_stackbar.yAxis_data2 = yAxis_data2;
                    this.ypzsyzph_stackbar.series_data = series_data;
                    this.drawYpzsyzBar();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#ypzsyzph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#ypzsyzph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#ypzsyzph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#ypzsyzph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        // 已批准适应症
        ypzsyzLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                };
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            query["indication1"] = params.name
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.seriesName.includes('-中国')) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        // 在研适应症
        zysyzLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = [];
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            query["indication2"] = params.name
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.seriesName.includes('-中国')) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        // 终止适应症
        zzsyzLink(params) {
            const _that = this;
            let tempObj = {},
                query = {
                    ..._that.putongAnaly
                },
                arr = [];
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            query["indication3"] = params.name
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.seriesName.includes('-中国')) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawYpzsyzBar() {
            const _that = this;
            let dom = "ypzsyzph-stackbar-globaldrugs",
                dataIndex = 6;
            _that.ypzsyzph_stackbar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxYpzsyzphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxYpzsyzphchina.map(item => item.label);
            _that.ypzsyzph_stackbar.echarts.off('click')
            _that.ypzsyzph_stackbar.echarts.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, _that.ypzsyzph_stackbar.echarts);
                            }
                        },
                        myMagnify: {
                            show: true,
                            title: "全屏",
                            icon: _that.fullscreenIcon,
                            onclick() {
                                window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                _that.initOpendKsh(dataIndex);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxYpzsyzph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxYpzsyzph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.ypzsyzph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.ypzsyzph_stackbar.yAxis_data2,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.ypzsyzph_stackbar.series_data
            }
            _that.ypzsyzph_stackbar.echarts.setOption(option);
            _that.ypzsyzph_stackbar.echarts.on('click', function (params) {
                _that.ypzsyzLink(params)
            });
        },
        drawYpzsyzBarOpen() {
            const _that = this;
            let dom = "ypzsyzph-stackbar-globaldrugs-open",
                dataIndex = 6;
            var e = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxYpzsyzphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxYpzsyzphchina.map(item => item.label);
            e.off('click')
            e.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, e);
                            }
                        },
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxYpzsyzph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxYpzsyzph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.ypzsyzph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.ypzsyzph_stackbar.yAxis_data2,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.ypzsyzph_stackbar.series_data
            }
            e.setOption(option);
            e.on('click', function (params) {
                _that.ypzsyzLink(params)
            });
        },
        // 在研适应症排行横向柱状图
        dealZysyzphBar(zysyzphSource) {
            if (this.isEmpty(zysyzphSource)) {
                let zysyzph = _.cloneDeep(zysyzphSource);
                let _len1 = zysyzph.world.length,
                    _len2 = zysyzph.china.length,
                    dataIndex = 7,
                    yAxis_data1 = [],
                    series_data1 = [],
                    series_data_result1 = [],
                    series_data_result2 = [],
                    yAxis_data2 = [],
                    series_data2 = [],
                    legend_data1 = zysyzph.world.map(item => item.label),
                    legend_data2 = zysyzph.china.map(item => item.label),
                    legend_data_len1 = legend_data1.length,
                    legend_data_len2 = legend_data2.length;

                this.ypfxZysyzphworld = zysyzph.world;
                this.ypfxZysyzphchina = zysyzph.china;

                // 数据全为0，显示nodata
                // let notAllZero1 = zysyzph.world.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // }), notAllZero2 = zysyzph.china.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // });

                // if (!notAllZero1) {
                //     _len1 = 0;
                // }
                // if (!notAllZero2) {
                //     _len2 = 0;
                // }
                if (_len1 > 0 || _len2 > 0) {
                    try {
                        let size1 = 0,
                            size2 = 0,
                            arr1 = [],
                            arr2 = [];
                        zysyzph.world.length > 0 && zysyzph.world.forEach(item => {
                            if (item.zong.length > 0) {
                                arr1.push(item.zong.length)
                            }
                        })
                        zysyzph.china.length > 0 && zysyzph.china.forEach(item => {
                            if (item.zong.length > 0) {
                                arr2.push(item.zong.length)
                            }
                        })
                        size1 = _.max(arr1)
                        size2 = _.max(arr2)
                        if (_len1 > 0) {
                            for (var k = 0; k < _len1; k++) {
                                yAxis_data1.unshift(zysyzph.world[k].label);
                            }
                            for (var j = 0; j < size1; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len1; l++) {
                                    tempArr.unshift(zysyzph.world[l].zong[j] !== undefined ? zysyzph.world[l].zong[j].num : 0);
                                }
                                series_data1[j] = tempArr;
                            }
                            for (var i = 0; i < size1; i++) {
                                series_data_result1.unshift({
                                    name: legend_data1[i] + '-全球',
                                    barMaxWidth: 30,
                                    type: "bar",
                                    stack: "在研适应症排行-全球",
                                    data: series_data1[i]
                                });
                            }
                        }

                        if (_len2 > 0) {
                            for (var k = 0; k < _len2; k++) {
                                yAxis_data2.unshift(zysyzph.china[k].label);
                            }
                            for (var j = 0; j < size2; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len2; l++) {
                                    tempArr.unshift(zysyzph.china[l].zong[j] !== undefined ? zysyzph.china[l].zong[j].num : 0);
                                }
                                series_data2[j] = tempArr;
                            }
                            for (var i = 0; i < size2; i++) {
                                series_data_result2.unshift({
                                    name: legend_data2[i] + '-中国',
                                    barMaxWidth: 30,
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    type: "bar",
                                    stack: "在研适应症排行-中国",
                                    data: series_data2[i]
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let series_data = []

                    if (series_data_result1.length > 0) {
                        series_data = series_data.concat(series_data_result1);
                    }

                    if (series_data_result2.length > 0) {
                        series_data = series_data.concat(series_data_result2);
                    }
                    this.zysyzph_stackbar.yAxis_data1 = yAxis_data1;
                    this.zysyzph_stackbar.yAxis_data2 = yAxis_data2;
                    this.zysyzph_stackbar.series_data = series_data;
                    this.drawZysyzphBar();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#zysyzph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#zysyzph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#zysyzph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#zysyzph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        drawZysyzphBar() {
            const _that = this;
            let dom = "zysyzph-stackbar-globaldrugs",
                dataIndex = 7;
            _that.zysyzph_stackbar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxZysyzphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxZysyzphchina.map(item => item.label)
            _that.zysyzph_stackbar.echarts.off('click')
            _that.zysyzph_stackbar.echarts.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, _that.zysyzph_stackbar.echarts);
                            }
                        },
                        myMagnify: {
                            show: true,
                            title: "全屏",
                            icon: _that.fullscreenIcon,
                            onclick() {
                                window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                _that.initOpendKsh(dataIndex);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxZysyzph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxZysyzph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.zysyzph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.zysyzph_stackbar.yAxis_data2,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.zysyzph_stackbar.series_data
            }
            _that.zysyzph_stackbar.echarts.setOption(option);
            _that.zysyzph_stackbar.echarts.on('click', function (params) {
                _that.zysyzLink(params)
            });
        },
        drawZysyzphBarOpen() {
            const _that = this;
            let dom = "zysyzph-stackbar-globaldrugs-open",
                dataIndex = 7;
            var e = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxZysyzphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxZysyzphchina.map(item => item.label)
            e.off('click')
            e.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, e);
                            }
                        },
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxZysyzph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxZysyzph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.zysyzph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.zysyzph_stackbar.yAxis_data2,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.zysyzph_stackbar.series_data
            }
            e.setOption(option);
            e.on('click', function (params) {
                _that.zysyzLink(params)
            });
        },
        // 终止适应症排行横向柱状图
        dealZzsyzphBar(zzsyzphSource) {
            if (this.isEmpty(zzsyzphSource)) {
                let zzsyzph = _.cloneDeep(zzsyzphSource);
                let _len1 = zzsyzph.world.length,
                    _len2 = zzsyzph.china.length,
                    dataIndex = 8,
                    yAxis_data1 = [],
                    series_data1 = [],
                    series_data_result1 = [],
                    series_data_result2 = [],
                    yAxis_data2 = [],
                    series_data2 = [],
                    legend_data1 = zzsyzph.world.map(item => item.label),
                    legend_data2 = zzsyzph.china.map(item => item.label),
                    legend_data_len1 = legend_data1.length,
                    legend_data_len2 = legend_data2.length;

                this.ypfxZzsyzphworld = zzsyzph.world;
                this.ypfxZzsyzphchina = zzsyzph.china;

                // 数据全为0，显示nodata
                // let notAllZero1 = zzsyzph.world.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // }), notAllZero2 = zzsyzph.china.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // });

                // if (!notAllZero1) {
                //     _len1 = 0;
                // }
                // if (!notAllZero2) {
                //     _len2 = 0;
                // }

                if (_len1 > 0 || _len2) {
                    try {
                        let size1 = 0,
                            size2 = 0,
                            arr1 = [],
                            arr2 = [];
                        zzsyzph.world.length > 0 && zzsyzph.world.forEach(item => {
                            if (item.zong.length > 0) {
                                arr1.push(item.zong.length)
                            }
                        })
                        zzsyzph.china.length > 0 && zzsyzph.china.forEach(item => {
                            if (item.zong.length > 0) {
                                arr2.push(item.zong.length)
                            }
                        })
                        size1 = _.max(arr1)
                        size2 = _.max(arr2)

                        if (_len1 > 0) {
                            for (var k = 0; k < _len1; k++) {
                                yAxis_data1.unshift(zzsyzph.world[k].label);
                            }
                            for (var j = 0; j < size1; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len1; l++) {
                                    tempArr.unshift(zzsyzph.world[l].zong[j] !== undefined ? zzsyzph.world[l].zong[j].num : 0);
                                }
                                series_data1[j] = tempArr;
                            }
                            for (var i = 0; i < size1; i++) {
                                series_data_result1.unshift({
                                    name: legend_data1[i] + '-全球',
                                    barMaxWidth: 30,
                                    type: "bar",
                                    stack: "终止适应症排行-全球",
                                    data: series_data1[i]
                                });
                            }
                        }

                        if (_len2 > 0) {
                            for (var k = 0; k < _len2; k++) {
                                yAxis_data2.unshift(zzsyzph.china[k].label);
                            }
                            for (var j = 0; j < size2; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len2; l++) {
                                    tempArr.unshift(zzsyzph.china[l].zong[j] !== undefined ? zzsyzph.china[l].zong[j].num : 0);
                                }
                                series_data2[j] = tempArr;
                            }
                            for (var i = 0; i < size2; i++) {
                                series_data_result2.unshift({
                                    name: legend_data2[i] + '-中国',
                                    barMaxWidth: 30,
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    type: "bar",
                                    stack: "终止适应症排行-中国",
                                    data: series_data2[i]
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let series_data = []

                    if (series_data_result1.length > 0) {
                        series_data = series_data.concat(series_data_result1);
                    }

                    if (series_data_result2.length > 0) {
                        series_data = series_data.concat(series_data_result2);
                    }
                    this.zzsyzph_stackbar.yAxis_data1 = yAxis_data1;
                    this.zzsyzph_stackbar.yAxis_data2 = yAxis_data2;
                    this.zzsyzph_stackbar.series_data = series_data;
                    this.drawZzsyzphBar();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#zzsyzph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#zzsyzph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#zzsyzph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#zzsyzph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        drawZzsyzphBar() {
            const _that = this;
            let dom = "zzsyzph-stackbar-globaldrugs",
                dataIndex = 8;
            _that.zzsyzph_stackbar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxZzsyzphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxZzsyzphchina.map(item => item.label);
            _that.zzsyzph_stackbar.echarts.off('click')
            _that.zzsyzph_stackbar.echarts.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, _that.zzsyzph_stackbar.echarts);
                            }
                        },
                        myMagnify: {
                            show: true,
                            title: "全屏",
                            icon: _that.fullscreenIcon,
                            onclick() {
                                window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                _that.initOpendKsh(dataIndex);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxZzsyzph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxZzsyzph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.zzsyzph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.zzsyzph_stackbar.yAxis_data2,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.zzsyzph_stackbar.series_data
            }
            _that.zzsyzph_stackbar.echarts.setOption(option);
            _that.zzsyzph_stackbar.echarts.on('click', function (params) {
                _that.zzsyzLink(params)
            });
        },
        drawZzsyzphBarOpen() {
            const _that = this;
            let dom = "zzsyzph-stackbar-globaldrugs-open",
                dataIndex = 8;
            var e = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxZzsyzphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxZzsyzphchina.map(item => item.label);
            e.off('click')
            e.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, e);
                            }
                        },
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxZzsyzph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxZzsyzph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'category',
                    data: _that.zzsyzph_stackbar.yAxis_data1,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }, {
                    gridIndex: 1,
                    type: 'category',
                    data: _that.zzsyzph_stackbar.yAxis_data2,
                    axisLabel: {
                        show: true,
                        color: "#66666",
                        formatter(value) {
                            return _that.labelLenLimit(value, 7);
                        },
                    },
                    splitLine: {
                        show: false
                    }
                }],
                backgroundColor: "#FAFBFD",
                series: _that.zzsyzph_stackbar.series_data
            }
            e.setOption(option);
            e.on('click', function (params) {
                _that.zzsyzLink(params)
            });
        },
        // 原研单位排行横向柱状图
        dealYydwphBar(yydwphSource) {
            if (this.isEmpty(yydwphSource)) {
                const _that = this;
                let yydwph = _.cloneDeep(yydwphSource);
                let _len1 = yydwph.world.length,
                    _len2 = yydwph.china.length,
                    dataIndex = 9,
                    yAxis_data1 = [],
                    series_data1 = [],
                    series_data_result1 = [],
                    series_data_result2 = [],
                    yAxis_data2 = [],
                    series_data2 = [],
                    legend_data1 = yydwph.world.map(item => item.label),
                    legend_data2 = yydwph.china.map(item => item.label),
                    legend_data_len1 = legend_data1.length,
                    legend_data_len2 = legend_data2.length;

                this.ypfxYydwphworld = yydwph.world;
                this.ypfxYydwphchina = yydwph.china;

                // 数据全为0，显示nodata
                // let notAllZero1 = yydwph.world.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // }), notAllZero2 = yydwph.china.find(item => {
                //     return item.zong.find(ite => {
                //         return ite.num != 0;
                //     });
                // });

                // if (!notAllZero1) {
                //     _len1 = 0;
                // }
                // if (!notAllZero2) {
                //     _len2 = 0;
                // }

                if (_len1 > 0 || _len2 > 0) {
                    try {
                        let size1 = 0,
                            size2 = 0,
                            arr1 = [],
                            arr2 = [];
                        yydwph.world.length > 0 && yydwph.world.forEach(item => {
                            if (item.zong.length > 0) {
                                arr1.push(item.zong.length)
                            }
                        })
                        yydwph.china.length > 0 && yydwph.china.forEach(item => {
                            if (item.zong.length > 0) {
                                arr2.push(item.zong.length)
                            }
                        })
                        size1 = _.max(arr1)
                        size2 = _.max(arr2)

                        if (_len1 > 0) {
                            for (var k = 0; k < _len1; k++) {
                                yAxis_data1.unshift(yydwph.world[k].label);
                            }
                            for (var j = 0; j < size1; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len1; l++) {
                                    tempArr.unshift(yydwph.world[l].zong[j] ? yydwph.world[l].zong[j].num : 0);
                                }
                                series_data1[j] = tempArr;
                            }
                            for (var i = 0; i < size1; i++) {
                                series_data_result1.unshift({
                                    name: legend_data1[i] + '-全球',
                                    barMaxWidth: 30,
                                    type: "bar",
                                    stack: "原研单位排行-全球",
                                    data: series_data1[i]
                                });
                            }
                        }

                        if (_len2 > 0) {
                            for (var k = 0; k < _len2; k++) {
                                yAxis_data2.unshift(yydwph.china[k].label);
                            }
                            for (var j = 0; j < size2; j++) {
                                let tempArr = [];
                                for (var l = 0; l < legend_data_len2; l++) {
                                    tempArr.unshift(yydwph.china[l].zong[j] ? yydwph.china[l].zong[j].num : 0);
                                }
                                series_data2[j] = tempArr;
                            }
                            for (var i = 0; i < size2; i++) {
                                series_data_result2.unshift({
                                    name: legend_data2[i] + '-中国',
                                    barMaxWidth: 30,
                                    xAxisIndex: 1,
                                    yAxisIndex: 1,
                                    type: "bar",
                                    stack: "原研单位排行-中国",
                                    data: series_data2[i]
                                });
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    let series_data = []

                    if (series_data_result1.length > 0) {
                        series_data = series_data.concat(series_data_result1);
                    }

                    if (series_data_result2.length > 0) {
                        series_data = series_data.concat(series_data_result2);
                    }
                    this.yydwph_stackbar.yAxis_data1 = yAxis_data1;
                    this.yydwph_stackbar.yAxis_data2 = yAxis_data2;
                    this.yydwph_stackbar.series_data = series_data;
                    this.drawYydwphBar();

                    this.recordNoData.delete(dataIndex);
                } else {
                    this.recordNoData.add(dataIndex);
                    $("#yydwph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                    $("#yydwph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
                }
            } else {
                this.recordNoData.add(dataIndex);
                $("#yydwph-stackbar-globaldrugs").html('<div class="nodata-box"></div>');
                $("#yydwph-stackbar-globaldrugs").removeAttr("_echarts_instance_");
            }
        },
        yydwLink(params) {
            const _that = this;
            let query = {
                ..._that.putongAnaly
            },
                tempObj = {};
            query["company_standard"] = params.name
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            // 中国的图表就多带上一个国家或地区为中国的筛选项
            if (params.seriesName.includes('-中国')) {
                tempObj["countries"] = ["中国"]
            }
            for (const [key, val] of Object.entries(_that.groupsAnaly)) {
                if (val.length > 0) {
                    tempObj[key] = [val]
                }
            }
            if (Object.keys(tempObj).length > 0) {
                for (let [key, val] of Object.entries(tempObj)) {
                    if (Array.isArray(val[0]) && val[0].length > 1) {
                        val[0] = val[0].join("ღ")
                    } else if (val[0].length == 1) {
                        val = val.join("ღ")
                    }
                }
                query.filter_condition = JSON.stringify(tempObj)
            }
            const { href } = _that.$router.resolve({
                path: '/globaldrugs',
                query
            })
            window.open(href, "_blank");
        },
        drawYydwphBar() {
            const _that = this;
            let dom = "yydwph-stackbar-globaldrugs",
                dataIndex = 9;
            _that.yydwph_stackbar.echarts = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxYydwphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxYydwphchina.map(item => item.label)
            _that.yydwph_stackbar.echarts.off('click')
            _that.yydwph_stackbar.echarts.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, _that.yydwph_stackbar.echarts);
                            }
                        },
                        myMagnify: {
                            show: true,
                            title: "全屏",
                            icon: _that.fullscreenIcon,
                            onclick() {
                                window._paq.push(['trackEvent', 'button', 'click', '企业版_全球药物_智能分析_' + _that.title[dataIndex] + '_全屏',])
                                _that.initOpendKsh(dataIndex);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxYydwph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxYydwph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [
                    {
                        type: 'category',
                        data: _that.yydwph_stackbar.yAxis_data1,
                        axisLabel: {
                            show: true,
                            color: "#66666",
                            formatter(value) {
                                return _that.labelLenLimit(value, 7);
                            },
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        data: _that.yydwph_stackbar.yAxis_data2,
                        axisLabel: {
                            show: true,
                            color: "#66666",
                            formatter(value) {
                                return _that.labelLenLimit(value, 7);
                            },
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                backgroundColor: "#FAFBFD",
                series: _that.yydwph_stackbar.series_data
            }
            _that.yydwph_stackbar.echarts.setOption(option);
            _that.yydwph_stackbar.echarts.on('click', function (params) {
                _that.yydwLink(params)
            });
            this.$nextTick(() => {
                this.echartsDomOpen = []
                const _that = this;
                $(".echarts").each(function () {
                    _that.echartsDomOpen.push($(this).attr("id") + '-open');
                });
            })
        },
        drawYydwphBarOpen() {
            const _that = this;
            let dom = "yydwph-stackbar-globaldrugs-open",
                dataIndex = 9;
            var e = Echarts.init(
                document.getElementById(dom),
                "westeros"
            );
            // let legend_data1 = _that.ypfxYydwphworld.map(item => item.label),
            //     legend_data2 = _that.ypfxYydwphchina.map(item => item.label)
            e.off('click')
            e.clear()
            let option = {
                toolbox: {
                    right: "20",
                    feature: {
                        mySaveAsImage: {
                            title: "保存",
                            icon: _that.saveIcon,
                            onclick() {
                                _that.getImgName(dataIndex, e);
                            }
                        },
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: function (params) {
                        let isWorld = params.seriesName.includes("-全球"),
                            isChina = params.seriesName.includes("-中国"),
                            tempData = [];

                        if (isWorld) {
                            tempData = _.cloneDeep(_that.ypfxYydwph.world);
                        } else if (isChina) {
                            tempData = _.cloneDeep(_that.ypfxYydwph.china);
                        }
                        let text = `${params.name}<br/>`,
                            arr = tempData.filter(item => item.label == params.name)[0].zong,
                            total = tempData.filter(item => item.label == params.name)[0].count;
                        text += `总数：${total}<br/>`
                        if (arr.length > 0) {
                            arr.forEach(item => {
                                text += `${item.phase}：${item.num}<br/>`
                            })
                        } else {
                            text = `${params.name}<br/>数量：${params.value ? params.value : 0
                                }`;
                        }
                        return text;
                    }
                },
                // legend: [
                //   {
                //     data: legend_data1,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '0%',
                //     bottom: 40
                //   },
                //   {
                //     data: legend_data2,
                //     type: "scroll",
                //     align: "left",
                //     width: '40%',
                //     left: '60%',
                //     bottom: 40
                //   }
                // ],
                title: [{
                    text: '全球',
                    left: '25%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }, {
                    text: '中国',
                    left: '75%',
                    bottom: _that.titleBottom,
                    textStyle: {
                        fontSize: 14
                    },
                    textAlign: 'center',
                }],
                grid: [
                    {
                        right: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    },
                    {
                        left: '52%',
                        width: '45%',
                        bottom: 80,
                        containLabel: true
                    }
                ],
                xAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }, {
                    type: 'value',
                    gridIndex: 1,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [
                    {
                        type: 'category',
                        data: _that.yydwph_stackbar.yAxis_data1,
                        axisLabel: {
                            show: true,
                            color: "#66666",
                            formatter(value) {
                                return _that.labelLenLimit(value, 7);
                            },
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        data: _that.yydwph_stackbar.yAxis_data2,
                        axisLabel: {
                            show: true,
                            color: "#66666",
                            formatter(value) {
                                return _that.labelLenLimit(value, 7);
                            },
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                backgroundColor: "#FAFBFD",
                series: _that.yydwph_stackbar.series_data
            }
            e.setOption(option);
            e.on('click', function (params) {
                _that.yydwLink(params)
            });
        },
        echartsResizeHandler() {
            if (this.dialogVisible) {
                this.initLayout();
                this.echartsResize("open-charts");
            } else {
                this.echartsResize("echarts");
            }
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
        // if (!this.$route.query) this.loadData();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.echartsResizeHandler);
    },
    mounted() {
        window.addEventListener("resize", this.echartsResizeHandler);
    },
    activated() {
        // this.update();
        // window.addEventListener("resize", this.echartsResizeHandler);
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
#ypzsyzph-stackbar-globaldrugs,
#zysyzph-stackbar-globaldrugs,
#zzsyzph-stackbar-globaldrugs {
    padding-top: 0;
    height: 366px;
}
</style>

<style lang="less">
@import "~@/assets/less/var.less";

.ywfx {
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

    .nodata-box {
        background: url('~@/assets/imgs/globaldrugs/analy/chart-nodata.png') no-repeat center;
        background-size: 275px 251px;
        width: 100%;
        height: 100%;
    }

    .hide {
        display: none;
    }

    .dialog {
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0px;
        width: 100%;
        height: calc(100%);
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
                    color: @PrimaryColor;
                    box-shadow: @BoxShadow;
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
                z-index: 9;

                .echart-title {
                    position: absolute;
                    left: 18px;
                    display: flex;
                    align-items: center;
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
                display: flex;
                overflow-y: scroll;
                overflow-x: hidden;

                .echarts-item {
                    display: inline-block;
                    margin: 0px 50px;
                    width: 1300px;
                    height: 100%;
                    overflow: hidden;
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

    .chart-title {
        position: relative !important;
    }
}
</style>