import store from "@/store";
import route from "@/router"
import Axios from "axios";

export default {
    namespaced: true,
    state: {
        checkData: ['title', 'tag'],    // 默认关键词检索下方的checkbox
        total: 0,
        isSearch: false,
        param: {},
        activeTabName: "",
        parent_type: "",
        pageObj: {},
        listObj: {
            "法律": {
                page: 1,
                list: []
            }
        },
        tab: {},
        listLoading: true, // 控制表格中数据的加载清空
        error: 0, // 错误码
        tabname: 'first',
        path: "/api/policies", // 维护当前搜索请求接口
        list: [],
        tabs: [],
        ypll_param: { // 按药品浏览查询页的附加参数
            order: null, // 排序
            page: 1, // 页数
            pageSize: 20 // 每页条数
        },
        xmjz_param: { // 项目进展查询页的附加参数
            order: null, // 排序
            page: 1, // 页数
            pageSize: 20 // 每页条数
        },
        qyll_param: { // 按企业浏览查询页的附加参数
            order: null, // 排序
            page: 1, // 页数
            pageSize: 20 // 每页条数
        },
        bdll_param: { // 按靶点浏览查询页的附加参数
            order: null, // 排序
            page: 1, // 页数
            pageSize: 20 // 每页条数
        },
        syzll_param: { // 按适应症查询页的附加参数
            order: null, // 排序
            page: 1, // 页数
            pageSize: 20 // 每页条数
        },
        //高级查询
        advanced_filed: [], // 高级搜索列举项（来源于API的原始数据）
        highFilters: {}, // 高级搜索条件筛选数据
        highGroups: {},
        order: {},
        nomal_filed: [{
            label: "关键词检索",
            name: "keywords",
            placeholder: "请输入关键词",
            type: "text"
        }, {
            name: "keywordsType",
            type: "policiescheck",
            value: [{
                label: "标题",
                value: "title"
            },
            {
                label: "标签",
                value: "tag"
            },
            {
                label: "正文",
                value: "content"
            },
            ]
        },], // 普通搜索项
        query: [
            //   {
            //   name: "keywords",
            //   type: "policiescheck",
            //   value: "title,tag",
            // }
        ],
        queryStr: "", // 由于监听不到数组变化，需监听query时，转成字符串
        putong: {},
        groups: {}, // 已选筛选条件
        shaixuan: {},
        //热点查询
        // hot_filter_filed: {}, // 热门信息筛选列举项（来源于API的原始数据）
        // hot_filter_filedCopy: {}, // 用于已选条件展示使用
        hot_checked: {}, // 已选热门筛选条件
        hot: {}, // 热门筛选条件所用的储存对象（主要用于API前的处理）
        filters: {}, // 条件筛选结果
        filters1: [], // 添加问号标注添加条件筛选
        res1: {}, // 按药品浏览
        res2: {}, // 项目进展
        res3: {}, // 按企业浏览
        res4: {}, // 按靶点浏览
        res5: {}, // 按适应症浏览
        iffirstCommonIn: true, //连接跳转搜索进这个界面
        // 匹配
        match_putong: {
            comprehensive_drug: "综合搜索（药品）",
            comprehensive_company: "综合搜索（企业）",
            comprehensive_devices: "综合搜索（医疗器械）",
            comprehensive_chinesemedicine: "综合搜索（中药材）",
            comprehensive_targets: "综合搜索（靶点）",
            comprehensive_disease: "综合搜索（疾病）"
        },
        // match_shaixuan: {
        //   'compound': '复方药',
        //   'worldstatus': '全球最高状态',
        //   'zclx1': '中国1类药',
        // },
        match_shaixuan: {},
        match_shaixuan_values: {},
        // match_shaixuan_values_high: {}, // 高级搜索中的条件筛选选项，用于已选条件回显
        search_api_param: {},
        saved_options: [],
        allBase: {},
        tableconf: [],
        helpInfo: {},
        update_conf: [],
        fourth: {},
        nopms: {
            list: [],
            detail: []
        },
        gaoji: {}, // 高级搜索查询条件所用的储存对象（主要用于API前的处理）
        match_gaoji: {},
        norules: {},
        conditions: [], // 已选高级搜索查询条件 格式请查看readme.md
        conditionsFilter: [], // 已选高级搜索条件筛选数据
        isGetCount: false,
        // 可视化结果
        kshRes: {
            noClear: true
        },
    },
    mutations: {
        gaoji(state, Payload) {
            let words = "";
            let atcs_sel = false;
            _.map(Payload, (item, index) => {
                if (item.value) {
                    // 去空
                    if (item.atcs_sel) {
                        atcs_sel = true;
                    }
                    if (index == 0) {
                        words = item.value.length ?
                            item.logic +
                            " " +
                            (item.accurate ? item.name + "_eq" : item.name) +
                            "=" +
                            (_.isArray(item.value) ?
                                _.join(
                                    _.map(item.value, n => {
                                        return n;
                                    }),
                                    "ღ"
                                ) :
                                item.value) :
                            "";
                    } else {
                        words += item.value.length ?
                            " " +
                            item.logic +
                            " " +
                            (item.accurate ? item.name + "_eq" : item.name) +
                            "=" +
                            (_.isArray(item.value) ?
                                _.join(
                                    _.map(item.value, n => {
                                        return n;
                                    }),
                                    "ღ"
                                ) :
                                item.value) :
                            "";
                    }
                }
            });
            state.gaoji = atcs_sel ? {
                words: words,
                atcs_sel: 1
            } : {
                words: words
            };
        },
        conditions(state, Payload) {
            state.conditions = Payload;
        },
        conditionsFilter(state, Payload) {
            state.conditionsFilter = Payload;
        },
        match_gaoji(state, Payload) {
            // state.match_gaoji = Payload
            for (let item of Payload) {
                _.set(state.match_gaoji, item.name, item.label);
            }
        },
        // 高级搜索项
        advancedFiled(state, Payload) {
            state.advanced_filed = Payload;
        },
        nopms(state, Payload) {
            state.nopms = Payload;
        },
        norules(state, Payload) {
            state.norules = Payload;
        },
        fourth(state, Payload) {
            if (Payload instanceof Array) {
                this.iffirstCommonIn = true;
            } else {
                this.iffirstCommonIn = false;
            }
            let fourth_condition = "";
            _.map(Payload, (item, index) => {
                if (index == 0) {
                    fourth_condition = item.logic + " " + item.name + "=" + item.value;
                } else {
                    fourth_condition +=
                        " " + item.logic + " " + item.name + "=" + item.value;
                }
            });
            state.fourth = fourth_condition ? {
                fourth_condition: fourth_condition
            } : {};
        },
        allBase(state, Payload) {
            state.allBase = Payload;
        },
        order(state, Payload) {
            state.order = Payload;
        },
        tableconf(state, Payload) {
            state.tableconf = Payload;
        },
        helpInfo(state, Payload) {
            state.helpInfo = Payload;
        },
        update_conf(state, Payload) {
            state.update_conf = Payload;
        },
        saved_options(state, Payload) {
            state.saved_options = Payload;
        },
        search_api_param(state, Payload) {
            let obj = _.omit(Payload, ["order", "page", "pageSize"]);
            state.search_api_param = obj;
        },
        match_putong(state, Payload) {
            // state.match_putong = Payload
            for (let item of Payload) {
                _.set(state.match_putong, item.name, item.label);
            }
        },
        match_shaixuan(state, Payload) {
            state.match_shaixuan = Payload;
        },
        match_shaixuan_values(state, Payload) {
            state.match_shaixuan_values = Payload;
        },
        // match_shaixuan_values_high(state, Payload) {
        //   state.match_shaixuan_values_high = Payload;
        //   console.log(state.match_shaixuan_values_high);
        // },
        pdfHandlerStatus(state, Payload) {
            state.tpdfHandlerStatusest = Payload;
        },
        listLoading(state, Payload) {
            state.listLoading = Payload;
        },
        error(state, Payload) {
            state.error = Payload;
        },
        path(state, Payload) {
            state.path = Payload;
        },
        nomalFiled(state, Payload) {
            state.nomal_filed = Payload;
        },
        highFilters(state, Payload) {
            state.highFilters = Payload;
        },
        highGroups(state, Payload) {
            state.highGroups = Payload;
        },
        tabname(state, Payload) {
            state.tabname = Payload
        },
        paramPage(state, Payload) {
            state.param.page = Payload;
        },
        paramPagesize(state, Payload) {
            state.param.pageSize = Payload;
        },
        // 按药品浏览查询的API数据
        res1(state, Payload) {
            state.res1 = Payload
        },
        // 项目进展查询的API数据
        res2(state, Payload) {
            state.res2 = Payload
        },
        // 按企业浏览查询的API数据
        res3(state, Payload) {
            state.res3 = Payload
        },
        // 按靶点浏览查询的API数据
        res4(state, Payload) {
            state.res4 = Payload
        },
        // 按适应症查询的API数据
        res5(state, Payload) {
            state.res5 = Payload
        },
        query(state, Payload) {
            // opt=1增加条件 或 替换已有条件
            if (Payload.opt && Payload.opt == 1) {
                if (state.query.length == 0) {
                    state.query.push(Payload.param);
                } else {
                    for (let i = 0, l = state.query.length; i < l; i++) {
                        if (Payload.param.name == state.query[i].name) {
                            if (
                                Payload.param.value == "" ||
                                Payload.param.value == ":" ||
                                Payload.param.value == undefined
                            ) {
                                // **清除**此条件
                                //将无效的输入条件移除
                                _.remove(state.query, n => {
                                    return n.name.indexOf(Payload.param.name) == 0;
                                });
                            } else {
                                // **替代**此条件
                                state.query[i] = Payload.param;
                            }
                            break;
                        } else {
                            if (i == l - 1) {
                                state.query.push(Payload.param);
                                break;
                            }
                        }
                    }
                }
            } else {
                state.query = Payload;
            }
        },
        queryStr(state) {
            state.queryStr = JSON.stringify(state.query);
        },
        putong(state, Payload) {
            if (Payload) {
                if (Payload.length) {
                    let obj = {};
                    for (let i = 0; i < Payload.length; i++) {
                        let iname = Payload[i].name;
                        let ilabel = Payload[i].label;
                        let iaccurate = Payload[i].accurate;
                        let pivalue = Payload[i].value;
                        let atcs_sel = Payload[i].atcs_sel;
                        //atc多分类
                        if (atcs_sel) {
                            obj.atcs_sel = 1;
                        }

                        if (pivalue) {
                            _.set(obj, iaccurate ? iname + "_eq" : iname, pivalue);
                        } else {
                            _.omit(obj, iaccurate ? iname + "_eq" : iname);
                        }
                    }
                    console.log(obj);
                    state.putong = obj;
                } else {
                    state.putong = {};
                }
            }
        },
        groups(state, Payload) {
            state.groups = Payload;
        },
        shaixuan(state, Payload) {
            let group = "";

            _.map(Payload, (item, index) => {
                if (item.length > 0) {
                    // 去空
                    if (group == "") {
                        group = index + "=" + _.join(item, "ღ");
                    } else {
                        group += " " + "_and" + " " + index + "=" + _.join(item, "ღ");
                    }
                }
            });

            if (group != "") {
                state.shaixuan = {
                    filter_condition: group
                };
            } else {
                state.shaixuan = {};
            }
        },
        hot_checked(state, Payload) {
            state.hot_checked = Payload
        },
        hot(state, Payload) {
            let hotcheckeds = ''
            _.map(Payload, (item, index) => {
                if (item.length > 0) { // 去空
                    if (hotcheckeds == '') {
                        hotcheckeds = index + '=' + _.join(item, 'ღ')
                    } else {
                        hotcheckeds += ' ' + '_and' + ' ' + index + '=' + _.join(item, 'ღ')
                    }
                }
            })
            if (hotcheckeds != '') {
                state.hot = {
                    'hot_condition': hotcheckeds
                }
            } else {
                state.hot = {}
            }
        },
        // 条件筛选结果
        filters(state, Payload) {
            state.filters = Payload;
        },
        // 条件筛选结果项
        filters1(state, Payload) {
            state.filters1 = Payload;
        },
        // // 热门信息筛选项
        // hot_filter_filed(state, Payload) {
        //     state.hot_filter_filed = Payload
        //     if (Object.keys(state.hot_filter_filedCopy).length <= 0) {
        //         state.hot_filter_filedCopy = Payload
        //     }
        // },
        list(state, Payload) {
            state.list = Payload;
        },
        tabs(state, Payload) {
            state.tabs = Payload;
        },
        pageObj(state, Payload) {
            state.pageObj = Payload;
        },
        listObj(state, Payload) {
            state.listObj = Payload;
        },
        parent_type(state, Payload) {
            state.parent_type = Payload;
        },
        tab(state, Payload) {
            state.tab = Payload;
        },
        activeTabName(state, Payload) {
            state.activeTabName = Payload;
        },
        param(state, Payload) {
            state.param = Payload;
        },
        isSearch(state, Payload) {
            Payload == undefined ? false : Payload
            state.isSearch = Payload;
        },
        total(state, Payload) {
            state.total = Payload;
        },
        checkData(state, Payload) {
            state.checkData = Payload;
        },
    },
    actions: {
        getTabs(state, params) {
            let paramsObj = {
                accesstoken: GETCOOKIEFUN("accesstoken"),
            }
            if (this.vue.isEmpty(params)) {
                paramsObj = Object.assign(paramsObj, params);
            }
            return window
                .Axios({
                    method: "get",
                    url: "/api/policies/validitytype",
                    params: paramsObj
                })
        },
        yfjdParams(state, Payload) {
            state.commit("yfjdParams", Payload);
        },
        // 普通搜索 和 高级搜索 通用方法
        async nomalSearch(state, Payload) {
            state.commit("listLoading", true);
            if (!this.iffirstCommonIn) {
                state.commit("fourth", state.state.fourth_checked);
            }
            this.iffirstCommonIn = false;
            // 确定api的url
            if (Payload !== undefined) {
                if (Payload.path) {
                    state.commit("path", Payload.path);
                }
            }
            let param = {}; // 储存axios获取数据的API参数
            // state.state.putong = {}
            // state.state.shaixuan = {}

            // 避免ename和其他普通搜索添加同时被带入搜索
            if (state.state.query.length > 1) {
                _.remove(state.state.query, function (n) {
                    return n.name == "ename";
                });
            }
            // if (state.state.query && state.state.query.length != 0) {
            // state.commit("putong", state.state.query)
            // }
            if (Payload && !Payload.queryToPutong) {
                // 不把query的状态传给putong
            } else {
                let keywordsTypeObj = {
                    name: "keywordsType",
                    type: "policiescheck",
                    value: state.state.checkData.join(',')
                }
                let keywordsTypeArr = _.cloneDeep(state.state.query)
                keywordsTypeArr.push(keywordsTypeObj)
                state.commit("query", keywordsTypeArr);
                state.commit("putong", state.state.query);
            }
            console.log(state.state.groups)
            state.commit("gaoji", state.state.conditions);
            state.commit("shaixuan", state.state.groups);
            state.commit('hot', state.state.hot_checked)
            let swords = state.state.gaoji;
            let sparam = state.state.putong;
            let sgroup = state.state.shaixuan;
            let sfourth = state.state.fourth;
            let shot = state.state.hot
            if (state.state.gaoji.words) {
                param = (Payload && Payload.params) ? _.assign({}, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {
                    page: 1,
                    pageSize: state.state[(state.state.tabname === 'first' ? 'ypll' : state.state.tabname === 'projectGroup' ? 'xmjz' : state.state.tabname === 'companyGroup' ? 'qyll' : state.state.tabname === 'targetGroup' ? 'bdll' : 'syzll') + '_param'].pageSize
                })
            } else {
                param = (Payload && Payload.params) ? _.assign({}, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
                    page: 1,
                    pageSize: state.state[(state.state.tabname === 'first' ? 'ypll' : state.state.tabname === 'projectGroup' ? 'xmjz' : state.state.tabname === 'companyGroup' ? 'qyll' : state.state.tabname === 'targetGroup' ? 'bdll' : 'syzll') + '_param'].pageSize
                })
            }
            //关键词统计方法
            param = _.assign(param, this.vue.searchKeywords(state.state, Payload))

            // 当没有跟其他参数时，正常搜索，回到第一页
            if (!Payload || Payload === state.state.putong) {
                // if (!this.vue.isEqual('policies', param, false)) {
                //   state.commit('kshRes', {
                //     noClear: true
                //   })
                // }

                state.commit('res1', [])
                state.commit('res2', [])
                state.commit('res3', [])
                state.commit('res4', [])
                state.commit('res5', [])
                state.commit('order', {})
                state.state.ypll_param.page = 1
                state.state.ypll_param.order = null
                state.state.xmjz_param.page = 1
                state.state.xmjz_param.order = null
                state.state.qyll_param.page = 1
                state.state.qyll_param.order = null
                state.state.bdll_param.page = 1
                state.state.bdll_param.order = null
                state.state.syzll_param.page = 1
                state.state.syzll_param.order = null
            }
            let paramAfter = _.omit(param, ['order', 'page', 'pageSize'])
            if (Qs.stringify(state.state.search_api_param) != Qs.stringify(paramAfter)) {
                state.commit('res1', [])
                state.commit('res2', [])
                state.commit('res3', [])
                state.commit('res4', [])
                state.commit('res5', [])
                state.commit('order', {})
            }
            state.commit('search_api_param', paramAfter)
            if (param.order == null) {
                this.vue.getSearchParams('policies', state, param, null, Payload)
            }
            // this.vue.getSearchParams("policies", state, param);

            param.pageSize = 20;
            if (route.currentRoute.query && route.currentRoute.query.cite_xzfg) {
                let cite_xzfg = '',
                    arr = Array.from(JSON.parse(route.currentRoute.query.cite_xzfg))
                console.log(arr)
                arr.forEach((item, i) => {
                    cite_xzfg += item + (i < arr.length - 1 ? 'ღ' : '')
                })
                param.filter_condition += ' _and cite_xzfg=' + cite_xzfg;
            }

            state.commit('param', param)

            try {
                let res = await Promise.all([state.dispatch('getTabs', _.assign(param, {
                    accesstoken: GETCOOKIEFUN("accesstoken")
                }))]);
                if (res[0].data.code === 200 && res[0].data) {
                    let data = res[0].data.data;
                    let pageObj = {}
                    data.forEach(item => {
                        pageObj[item.key] = {
                            page: 1,
                            pageSize: 20,
                            total: Number(item.doc_count)
                        }
                    })
                    // if (Payload.parent_type) {
                    //     let tab = data.filter(item => item.key === Payload.params.parent_type);
                    //     console.log(tab);
                    //     state.commit('tab', tab[0]);
                    // } else {
                    // }
                    state.commit('pageObj', pageObj);
                    state.commit('tabs', data);
                    state.commit('tab', data[0]);
                    state.commit('activeTabName', data[0].key)
                    state.commit('parent_type', data[0].key)

                    let paramsObj = _.assign(param, {
                        accesstoken: GETCOOKIEFUN("accesstoken")
                    })

                    if (state.state.parent_type) {
                        paramsObj = _.assign(paramsObj, {
                            accesstoken: GETCOOKIEFUN("accesstoken")
                        })
                    }
                    return window
                        .Axios({
                            method: "get",
                            url: state.state.path,
                            params: paramsObj
                        })
                        .then(async subRes => {
                            if (subRes.data.code === 200 && subRes.data) {
                                let data2 = subRes.data.data.res;
                                let pageObj = _.cloneDeep(state.state.pageObj)
                                if (!state.state.parent_type) { pageObj[''].total = Number(subRes.data.data.count); }
                                else { pageObj[state.state.parent_type].total = Number(subRes.data.data.count); }
                                state.commit('pageObj', pageObj);
                                state.commit('total', Number(subRes.data.data.count));
                                state.commit("error", 0);
                                state.commit("list", subRes.data.data);
                                state.commit("listLoading", false);

                                let status = Object.keys(state.state.putong).length > 1 ||
                                    (state.state.gaoji && state.state.gaoji.words) ||
                                    (state.state.fourth && state.state.fourth.fourth_condition) ||
                                    (state.state.shaixuan && state.state.shaixuan.filter_condition)
                                state.commit('isSearch', status)
                                return subRes;
                            } else if (subRes.data.code == 404) {
                                state.commit("error", 404);
                                state.commit("listLoading", false);
                                state.commit('total', 0);
                                state.commit("list", []);
                                state.commit('pageObj', {});
                            }
                        })
                        .catch(subRes => {
                            console.error(subRes)
                            state.commit("error", 500);
                            state.commit("listLoading", false);
                            state.commit('total', 0);
                            state.commit("list", []);
                            state.commit('pageObj', {});
                            return subRes.data.code;
                        });
                } else {
                    state.commit('tabs', []);
                    state.commit('tab', '');
                    state.commit('total', 0);
                    state.commit("listLoading", false);
                    state.commit("list", []);
                    state.commit('pageObj', {});
                    state.commit('activeTabName', '')
                }
            } catch (error) {
                console.error(error);
                state.commit('total', 0);
                state.commit('tabs', []);
                state.commit('tab', '');
                state.commit("listLoading", false);
                state.commit("list", []);
                state.commit('pageObj', {});
                state.commit('activeTabName', '')
            }
        },
        getGroupRes(state, Payload) {
            // 高级搜索不为空则使用高级搜索
            let param = {} // 储存axios获取数据的API参数

            let sparam = state.state.putong
            let swords = state.state.gaoji
            let sgroup = state.state.shaixuan
            let sfourth = state.state.fourth
            let shot = state.state.hot

            if (state.state.gaoji.words) {
                param = (Payload && Payload.params) ? _.assign({}, Payload.params, sfourth, swords, sgroup, shot, Payload.params) : _.assign({}, sfourth, swords, sgroup, shot, {
                    page: 1,
                    pageSize: state.state.param.pageSize
                })
            } else {
                param = (Payload && Payload.params) ? _.assign({}, Payload.params, sfourth, sparam, sgroup, shot, Payload.params) : _.assign({}, sfourth, sparam, sgroup, shot, {
                    page: 1,
                    pageSize: state.state.param.pageSize
                })
            }

            return window.Axios({
                method: 'get',
                url: Payload.path,
                params: param
            })
        },
        getFiled(state) {
            state.commit("match_putong", state.state.nomal_filed);
            return window
                .Axios({
                    method: "get",
                    url: "/api/config/search?dbname=policies"
                })
                .then(res => {
                    if (res.data.code === 200 && res.data) {
                        let data = res.data.data;
                        // // 普通搜索项
                        // state.commit("nomalFiled", res.data.data.normal);
                        // state.commit('match_putong', data.normal)
                        // state.commit(
                        //   "match_putong",
                        //   res.data.data.normal.concat([
                        //     {
                        //       label: "词冠（干、尾）",
                        //       name: "ename",
                        //       placeholder: "",
                        //       type: "text"
                        //     }
                        //   ])
                        // );
                        state.commit("filters1", data.filter);
                        let match_shaixuan_Obj = {};
                        data.filter.length > 0 &&
                            data.filter.forEach(item => {
                                match_shaixuan_Obj[item.field] = item.label;
                            });
                        state.commit("match_shaixuan", match_shaixuan_Obj);
                    }
                });
        },
        getBaseInfo(state, Payload) {
            return window
                .Axios({
                    method: "get",
                    url: "/api/config/view?dbname=policies",
                    params: {
                        accesstoken: GETCOOKIEFUN("accesstoken")
                    }
                })
                .then(res => {
                    if (res.data.code === 200 && res.data.data) {
                        let data = res.data.data;
                        if (data.baseconf.dbname) {
                            store.commit("Normal/names", {
                                name: data.baseconf.dbename,
                                dbname: data.baseconf.dbname
                            });
                        }

                        state.commit("tableconf", data.tableconf);
                        state.commit("allBase", data.baseconf);
                        state.commit("helpInfo", data.helpconf);
                        state.commit("update_conf", data.updatelog);
                        // 权限处理 start
                        state.commit("norules", data.norules);
                        for (let item of state.state.norules.common) {
                            switch (item.name) {
                                case "高级搜索":
                                    state.state.nopms.gjss = true;
                                    break;
                                case "条件筛选":
                                    state.state.nopms.tjsx = true;
                                    break;
                                case "可视化":
                                    state.state.nopms.visualization = true;
                                    break;
                                case "详情页":
                                    state.state.nopms.read = true;
                                    break;
                                case "导出(默认300)":
                                    state.state.nopms.dc = true;
                                    break;
                                case "翻页(最大75)":
                                    state.state.nopms.fy = true;
                                    break;
                                case "热点搜索":
                                    state.state.nopms.rdss = true;
                                    break;
                            }
                        }

                        for (let item of state.state.norules.exclusive) {
                            switch (item.action) {
                                case "rss":
                                    state.state.nopms.rss = true;
                                    break;
                                    break
                                case 'compare':
                                    state.state.nopms.compare = true;
                                    break
                                case "getcg":
                                    state.state.nopms.getcg = true;
                                    break;
                            }
                        }

                        state.state.nopms.list = data.norules.list;
                        state.state.nopms.detail = data.norules.detail;
                        // 权限处理 end
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
};
