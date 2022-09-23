<template>
    <div class="wrapper" :style="{height: showPromtNotice? 'calc(100vh - 78px)':'calc(100vh - 48px)'}">
        <!-- <LoadingGif :loadFlag="detailLoading" :style="{ top: (showPromtNotice ? '78' : '48') + 'px' }"
            v-if="detailLoading" /> -->
        <template v-if="!showNoData">
            <div class="wrapper-head">
                <div class="wrapper-head_left">
                    <span v-if="(basic.targets_abbr? basic.targets_abbr:basic.targets)" class="name">{{
                            basic.targets_abbr? basic.targets_abbr:basic.targets
                    }}</span>
                    <span class="tag green" v-if="basic.worldstatus.global&&basic.worldstatus.global.name">
                        <span class="text">{{
                                basic.worldstatus.global.name
                        }}</span></span>
                </div>
                <div class="wrapper-head_right">
                    <span style="color: #333;">
                        当前位置：
                        <router-link @click="tongjiHandler(allBase.dbename)" to="/home" style="color: #002fa7;">首页
                        </router-link>
                        >
                        <router-link @click="tongjiHandler(allBase.dbename)" to="/globaldrugs" style="color: #002fa7;">
                            {{
                                    allBase.dbname
                            }}</router-link>
                        >
                        <i style="font-style: normal;color: #333;">靶点详情</i>
                    </span>
                </div>
            </div>
            <div class="wrapper-main">
                <div class="wrapper-menu" :style="{width: expanded? '180px':'0'}">
                    <side-menu :menus="menus" v-model="activeMenu"></side-menu>
                    <div class="wrapper-fold" @click="expanded=!expanded">
                        <i v-if="expanded" class="arrow-left"></i>
                        <i v-else class="arrow-right"></i>
                    </div>
                </div>
                <div ref="scrolling" class="wrapper-content scrolling-wrapper"
                    :style="{width: expanded? 'calc(100% - 190px)':'calc(100% - 10px)'}">
                    <content-section v-for="(item,idx) in menus.filter((item) => !item.hidden)" :key="item.name"
                        :name="item.name" :desc="item.desc" :idx="idx">

                        <template v-if="item.name=='竞争格局'" #head>
                            <div style="display: flex; align-items: center">
                                <span style="font-size: 13px; color: #333; line-height: 1">靶点名称：</span>
                                <el-autocomplete v-model="target" class="jzgj-searcher"
                                    :fetch-suggestions="querySearchAsync2" :popper-append-to-body="false" clearable
                                    ref="popoverAutoInput" @select="handleSelect2">
                                    <template slot-scope="{ item }">
                                        <div style="
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    " :title="item.value">
                                            {{ item.value}}
                                        </div>
                                    </template>
                                </el-autocomplete>
                            </div>
                        </template>
                        <component :is="item.component" :idx="idx" :base="basic" />
                    </content-section>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="wrapper-head">
                <div class="wrapper-head_left">
                    <span class="name" style="font-weight: normal;">暂无数据</span>
                </div>
                <div class="wrapper-head_right">
                    <span style="color: #333;">
                        当前位置：
                        <router-link @click="tongjiHandler('首页')" to="/home" style="color: #002fa7;">首页</router-link>
                        >
                        <router-link @click="tongjiHandler('全球药物')" to="/globaldrugs" style="color: #002fa7;">全球药物
                        </router-link>
                        >
                        <i style="font-style: normal;color: #333;">靶点详情</i>
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SideMenu from "../detail/components/target/sideMenu";
import ContentSection from "../detail/components/target/contentSection";
import Bdgl from "../detail/components/target/bdgl";
import Syz from "../detail/components/target/syz";
import Jzgj from "../detail/components/target/jzgj";
import Xwzx from "../detail/components/target/xwzx";
import Jyxx from "../detail/components/target/jyxx";
import { mapState } from 'vuex'

export default {
    data() {
        return {
            expanded: true, // 侧边菜单是否展开
            target: "", // 药品进度进展靶点
            menus: [
                {
                    component: Bdgl,
                    name: "靶点概览",
                    ico: "/static/imgs/globaldrugs/ywgl_ico.png",
                    ico1: "/static/imgs/globaldrugs/ywgl_ico-c.png",
                    desc: "靶点概述集合了关于靶点的基础信息等。",
                },
                {
                    component: Syz,
                    name: "适应症",
                    ico: "/static/imgs/globaldrugs/syz_ico.png",
                    ico1: "/static/imgs/globaldrugs/syz_ico-c.png",
                    desc: "适应症统计并展示了适应症的批准国家或地区情况，也展示了在研适应症的最高状态及详细信息。",
                },
                {
                    component: Jzgj,
                    name: "竞争格局",
                    ico: "/static/imgs/globaldrugs/jzgj_ico.png",
                    ico1: "/static/imgs/globaldrugs/jzgj_ico-c.png",
                    desc: "竞争格局首先统计了靶点药品的分布情况及药品的的研发进度。",
                },
                {
                    component: Xwzx,
                    name: "新闻资讯",
                    ico: "/static/imgs/globaldrugs/xwzx_ico.png",
                    ico1: "/static/imgs/globaldrugs/xwzx_ico-c.png",
                    desc: "新闻资讯收集并展示了该靶点下关于研发进展、企业官网、适应症信息、合作开发等内容。",
                },
                {
                    component: Jyxx,
                    name: "交易信息",
                    ico: "/static/imgs/globaldrugs/company/jyxx.png",
                    ico1: "/static/imgs/globaldrugs/company/jyxx_active.png",
                    desc: "该靶点相关的药品/项目交易信息，可进入投资格局-医药交易数据库查看更多交易信息。",
                },
            ],
            basic: {
                zgss: false,
                zclx_1: false,
                yxsp: false,
                tpxzl: false,
                higheststatus: false,
                othername: "",
                leixing2: "",
                cate: "",
                company: {
                    company_standard: [],
                    coo_company: [],
                    per_company: [],
                },
                indication: {},
                targets: [],
                worldstatus: {
                    china: { name: '', date: '' },
                    global: { name: '', date: '' },
                },
                firstmarket: {},
                atcarr: {},
                pharmaco: {
                    pharmacodynamics: "",
                    mechanism_of_action: "",
                    protein: "",
                    halflife: "",
                    toxicity: "",
                    absorption: "",
                    volume: "",
                    metabolism: "",
                    route: "",
                    clearance: "",
                },
                structpicture: "",
                chemicalname: "",
                cas: "",
                formulations: "",
                formulaweight: "",
                summary: "",
                extendList: "",
            },
            basic: {
                alias: "",
                generalfunction: "",
                indication: {},
                kind: "",
                organism: "",
                sequence: "",
                statistics: {},
                targets: "",
                targets_abbr: "",
                uniprotid: "",
                uniprotname: "",
                worldstatus: []
            },
            //   activeMenu: 0,
            scorllObserved: [],
            bdmc: "",
            detailLoading: true, // 加载中
            drugname_standard: '',
            company_standard: '',
            showNoData: false,
            observer: null,
        };
    },
    components: {
        LoadingGif,
        SideMenu,
        ContentSection,
        Bdgl,
        Syz,
        Jyxx
    },
    computed: {
        ...mapState({
            names: state => state.Normal.names,
            allBase: state => state.Globaldrugs.allBase,
            showPromtNotice: (state) => state.showPromtNotice
        }),
        activeMenu: {
            get() {
                let observed = this.scorllObserved.sort((a, b) => a - b);
                return observed.length ? observed[0] : 0;
            },
            set(v) {
                let sections = document.querySelectorAll(".section");
                let top = sections[v].offsetTop;
                // let root = document.querySelector(".el-scrollbar__wrap");
                let root = document.querySelector(".scrolling-wrapper");
                root.scrollTo(0, top);
            },
        },
    },
    methods: {
        tongjiHandler(name) {
            window.ga("send", "event", "button", "click", "企业版_" + name);
            window._paq.push([
                "trackEvent",
                "button",
                "click",
                "企业版_" + name
            ]);
        },
        // 板块左上搜索框输入事件传递
        handleSelect2(e) {
            window.ga("send", "event", "button", "click",
                "企业版_全球药物_靶点详情_竞争格局_靶点名称");
            window._paq.push([
                "trackEvent",
                "button",
                "click",
                "企业版_全球药物_靶点详情_竞争格局_靶点名称"
            ]);
            this.$root.$emit("search", e.value);
        },
        // 药品进度输入框下拉提示
        querySearchAsync2(queryString, callback) {
            // 限制2个级以上的字符在做搜索提示
            if (queryString.length < 2) {
                callback([]);
                return;
            }

            window
                .Axios({
                    methods: "get",
                    url: "/api/globaldrugs/targetInput",
                    params: {
                        target: queryString
                    },
                })
                .then((res) => {
                    if (res.data == "") {
                        callback([]);
                    } else {
                        let data = [];
                        for (let i = 0, l = res.data.data.length; i < l; i++) {
                            data.push({ value: res.data.data[i] });
                        }
                        callback(data);
                    }
                })
                .catch((thrown) => {
                    console.log("请求出错了");
                });
        },
        // 导出事件分发
        exportExcel(e) {
            this.$root.$emit("export", e);
        },
        // 滚动状态监听
        scrollingObserve() {
            if (this.observer) {
                this.observer.disconnect();
            }
            const observerOptions = {
                threshold: 0,
                root: this.$refs.scrolling,
            };
            const observerCallback = (entries) => {
                entries.forEach((item) => {
                    if (item.isIntersecting) {
                        // 在可视区域 记录模块IDX
                        // this.scorllObserved.push(item.target.parentNode.__vue__.idx);
                        this.scorllObserved.push(item.target.__vue__.idx);
                    } else {
                        // 不在可视区域 移除记录模块IDX
                        // this.scorllObserved = this.scorllObserved.filter((t) => t != item.target.parentNode.__vue__.idx);
                        this.scorllObserved = this.scorllObserved.filter(
                            (t) => t != item.target.__vue__.idx
                        );
                    }
                });
            };
            this.observer = new IntersectionObserver(
                observerCallback,
                observerOptions
            );
            const targets = document.querySelectorAll(".section");
            targets.forEach((target) => {
                this.observer.observe(target);
            });
        },
        // 获取基本概览信息的接口 ，进入页面触发
        getBasicInfo() {
            const { target } = this.$route.query;
            const _that = this;
            this.bdmc = target
            Axios({
                method: "get",
                url: "/api/globaldrugs/targetOverView",
                params: {
                    target
                },
            }).then((res) => {
                this.detailLoading = false;
                this.scrollingObserve();
                if (res.data.code == 200) {
                    this.basic = res.data.data;
                    this.target = this.basic.targets_abbr ? this.basic.targets_abbr : this.basic.targets;


                    if (_that.$route.query.activeModule) {
                        this.$nextTick(() => {
                            setTimeout(() => {
                                _that.activeMenu = _that.menus.findIndex(item => item.name === this.$route.query.activeModule);
                            }, 1500);
                        })
                    }
                } else if (res.data.code == 11048) {
                    // 暂无数据
                    this.showNoData = true;
                }
            }).catch(err => {
                this.detailLoading = false;
            })
        },
    },
    mounted() {
        Store.dispatch("Globaldrugs/getBaseInfo").then(() => {
            this.vueTogglePmsTooltip();
            document.title = this.names.globaldrugs + "-靶点详情"
        });
        this.getBasicInfo();
        this.$root.$on("hide-section", (name) => {
            this.scrollingObserve();
            this.menus = this.menus.map((t) => {
                if (t.name == name) {
                    return { ...t, hidden: true };
                } else {
                    return t;
                }
            });
        });
    },
};
</script>

<style lang="less" scoped>
.wrapper {
    min-width: 1231px;
    position: relative;
    height: calc(100vh - 48px);
}

.wrapper-head {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 1px 5px 0px rgba(9, 20, 79, 0.1);
    padding: 0 10px;
    box-sizing: border-box;

    .wrapper-head_left {
        display: flex;
        align-items: flex-end;
    }

    .name {
        font-size: 20px;
        color: #333;
        font-weight: bold;
        line-height: 20px;
    }

    .tag {
        display: flex;
        align-items: center;
        font-size: 12px;
        border: 1px solid #002fa7;
        color: #002fa7;
        margin-left: 10px;
        border-radius: 3px;
        padding: 3px 10px;

        .text {
            height: 12px;
            line-height: 12px;
        }

        &.green {
            background-color: #9dcc40;
            border-color: #9dcc40;
            color: #fff;
        }
    }
}

.la-app-main {
    background: #F5F8FC;
}

.wrapper-main {
    height: calc(100% - 70px);
    display: flex;
    margin-top: 10px;
    background-color: #f5f8fc;
    position: relative;

    .wrapper-menu {
        width: 180px;
        margin-right: 10px;
        background: #ffffff;
        box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
        border-radius: 0px 3px 0px 0px;
        position: relative;
        transition: .3s;

        .wrapper-fold {
            width: 8px;
            height: 36px;
            background-color: #97a2be;
            color: #fff;
            position: absolute;
            top: calc(50% - 18px);
            right: -8px;
            display: flex;
            align-items: center;

            i.arrow-left {
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-right: 7px solid #f0f3fa;
                border-bottom: 6px solid transparent;
                display: inline-block;
            }

            i.arrow-right {
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-left: 7px solid #f0f3fa;
                border-bottom: 6px solid transparent;
                display: inline-block;
            }

            &:hover {
                background-color: #4a4e68;
                cursor: pointer;
            }
        }
    }

    .wrapper-content {
        width: calc(100% - 190px);
        overflow: auto;
        position: relative;

        .export {
            cursor: pointer;
            user-select: none;
        }
    }
}

/deep/.jzgj-searcher {
    .el-input__inner {
        height: 20px;
        font-size: 12px;
        color: #002FA7;
        font-weight: 400;
    }

    .el-input {
        height: 20px;
        display: block;
    }
}

/deep/.el-icon-arrow-down {
    width: 11px !important;
    height: 11px !important;
    font-size: 13px !important;
    box-sizing: content-box !important;
    align-items: center;
}
</style>