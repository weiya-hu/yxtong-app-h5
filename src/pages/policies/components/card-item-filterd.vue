<template>
    <div class="card-item-filterd">
        <div class="list">
            <!-- 如果是法律类型的话 使用另外一个卡片组件 -->
            <div v-if="listLoading===false" v-for="(listItem,listIndex) in list" :key="listItem.data_id+listIndex"
                class="list-item">
                <div v-if="listItem.is_laws==1">
                    <div style="height: 22px;" class="title overflow spec" :title="listItem.title">
                        <span @click="linkDetail(listItem)" v-html="highlightKeyword(listItem.title)"></span>
                    </div>
                    <div class="spec" :title="listItem.catalogue+listItem.detail_content">
                        <div class="title" style="white-space: nowrap;margin-right:10px;display:inline;"
                            v-html="highlightKeyword(listItem.catalogue)">
                        </div>
                        <div class="title" v-html="highlightKeyword(listItem.detail_content)">
                        </div>
                    </div>
                    <div class="info-block">
                        <div v-if="listItem.detailTag.length>0" class="tag">
                            <img src="/static/imgs/policies/tag.png" style="margin-right: 2px" width="12" height="12" />
                            <span v-for="tagItem in listItem.detailTag" @click="linkSearchPage(tagItem)" :key="tagItem"
                                class="tag-text tag" style="
                    cursor: pointer;
                    padding: 2px 10px;
                    background: #ebeef5;
                  ">
                                {{ tagItem}}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="title" :title="listItem.title">
                        <span @click="linkDetail(listItem)" v-html="highlightKeyword(listItem.title)"></span>
                    </div>
                    <div class="info-block">
                        <div v-if="listItem.tag.length>0" class="tag">
                            <img src="/static/imgs/policies/tag.png" style="margin-right: 2px" width="12" height="12" />
                            <span v-for="tagItem in listItem.tag" @click="linkSearchPage(tagItem)" :key="tagItem"
                                class="tag-text tag" style="
                    cursor: pointer;
                    padding: 2px 10px;
                    background: #ebeef5;
                  ">
                                {{ tagItem}}
                            </span>
                        </div>

                        <div v-if="isEmpty(listItem.pub_date_cn)" class="tag">
                            <img src="/static/imgs/policies/clock.png" style="margin-right: 2px" width="12"
                                height="12" />
                            <span class="tag-text">
                                {{ listItem.pub_date_cn|formatDate}}
                            </span>
                        </div>

                        <div v-if="listItem.pub_dept.length>0" class="tag">
                            <img src="/static/imgs/policies/company.png" style="margin-right: 2px" width="12"
                                height="12" />
                            <span style="display: inline-block;" v-for="(tagItem,tagIndex) in listItem.pub_dept"
                                :key="tagItem" class="tag-text">
                                {{ formatPub_Dept(tagItem,tagIndex,listItem.pub_dept)}}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="paganation">
            <el-pagination @current-change="handleCurrentChange($event,tab.key)" :current-page="pageObj[tab.key].page"
                :page-size="pageObj[tab.key].pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Moment from "moment"

export default {
    props: {
        // tab数据源
        tabs: {
            type: Array,
            default: () => []
        },
        // 当前tab对象 包含tab名称、数量
        tab: {
            type: Object,
            default: () => ({})
        },
        // 列表数据源
        list: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            cardList: [],
            tabData: [],
            activeNames: [],    // 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array)
        }
    },
    computed: {
        ...mapState({
            showPromtNotice: (state) => state.showPromtNotice,
            pageObj: (state) => state.Policies.pageObj,
            parent_type: (state) => state.Policies.parent_type,
            putong: (state) => state.Policies.putong,
            isSearch: (state) => state.Policies.isSearch,
            listLoading: (state) => state.Policies.listLoading,
            conditions: (state) => state.Policies.conditions,
            total: (state) => state.Policies.total,
        })
    },
    filters: {
        formatDate(val) {
            return Moment(val).format("YYYY-MM-DD");
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        formatPub_Dept(tagItem, tagIndex, pub_dept) {
            return tagItem + (tagIndex < pub_dept.length - 1 ? "、" : "");
        },
        async linkSearchPage(value) {
            let conditions = [];
            if (value) {
                conditions.push({
                    accurate: false,
                    atcs_sel: undefined,
                    is_show_new: undefined,
                    label: "标签",
                    logic: "_and",
                    name: "tag",
                    new_content: undefined,
                    new_id: undefined,
                    new_type: "1",
                    show: undefined,
                    statement: undefined,
                    type: undefined,
                    value: value,
                })
            }
            await Store.commit('Policies/conditions', conditions);
            await Store.commit('Policies/gaoji', this.conditions)
            await Store.dispatch("Policies/nomalSearch");
        },
        linkDetail(obj) {
            let routes = ['commondetail', 'lawdetail', 'guiddetail']
            const { href } = this.$router.resolve({
                path: `/policies/${routes[obj.detail_type]}/${obj.data_id}`,
            });
            window.open(href, "_blank");
        },
        highlightKeyword(title) {
            function findAll(str, x) {
                var results = [];
                var len = str.length;
                var pos = 0;
                while (pos < len) {
                    pos = str.indexOf(x, pos);
                    if (pos === -1) break;
                    results.push(pos);
                    pos = pos + 1;
                }
                return results;
            }
            let text = "";
            function highlight(txt, value) {
                var found = findAll(txt, value);
                // 如果找到了关键词，则加入高亮显示
                if (found.length > 0) {
                    for (var i = 0; i < txt.length; i++) {
                        for (var j in found) {
                            if (i == found[j]) {
                                text = txt
                                    .split(value)
                                    .join(`<span class="keyword">${value}</span>`);
                            }
                        }
                    }
                } else {
                    // 没有找到就用原本的title
                    text = txt;
                }
            }
            highlight(title, this.putong.keywords);
            return text;
        },
        handleCurrentChange(val, key) {
            if (val * this.pageObj[key].pageSize <= 1500) {
                $(".out-of-page").hide();
                Store.commit('Policies/listLoading', true);
                let obj = _.cloneDeep(this.pageObj);
                obj[key].page = val;
                Store.commit('Policies/pageObj', obj);
                this.$emit('handleCurrentChange', obj, key)
            } else {
                $(".out-of-page").show();
            }
        },
        handlerClick(obj) {
            // this.activeNames = []
            this.activeNames.push(obj.key);
            Store.commit('Policies/parent_type', obj.key);
            this.$emit('handleCurrentChange', obj, this.pageObj[obj.key])
        }
    },
}
</script>

<style lang="less">
.card-item-filterd {

    .el-pagination {
        padding: 15px 10px 15px 0;

        .el-select .el-input {
            width: 75px;
        }

        .el-pager li {
            min-width: 28px;
            height: 28px;
            line-height: 28px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            color: #5c6973;
            font-size: 14px;
            font-weight: normal;
        }

        .more {
            margin-left: 8px;
            border: 0 !important;
        }

        .el-icon-more::before {
            color: #DDDDDD;
        }

        .el-pagination__total {
            font-size: 13px;
            color: #5c6973;
            height: 28px;
            line-height: 28px;
        }

        .el-select .el-input .el-input__inner {
            border-radius: 4px;
            border-color: #dcdfe6;
            height: 28px;
            color: #5c6973;
        }

        .btn-prev,
        .btn-next {
            width: 28px;
            height: 28px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            color: #5c6973;
        }

        .btn-next {
            margin-left: 8px;
        }

        .el-pager {
            .number {
                height: 28px;
                line-height: 28px;
                background: #ffffff;
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                color: #666;
                margin-left: 8px;
                font-size: 14px;
                font-weight: normal;
            }

            .active {
                background: #002fa7;
                color: #ffffff;
            }
        }
    }

    .el-tabs__item.is-active>span {
        color: #182462;
        font-weight: 500;
    }

    .el-collapse {
        border: 0 !important;

        .el-collapse-item {
            &:not(:first-child) {
                margin-top: 20px;
            }

            .el-collapse-item__header {
                font-size: 16px;
                color: #182462;
                position: relative;
                height: 40px;
                line-height: 40px;
                box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
                border-radius: 3px 3px 0px 0px;
                padding-left: 10px;
                border: 0 !important;

                .num {
                    color: #5c6973;
                    font-size: 16px;
                    margin-left: 5px;
                }

                .el-collapse-item__arrow {
                    margin-right: 0 !important;
                }

                .el-icon-arrow-right {
                    width: 14px;
                    height: 9px;
                    background: url(/static/imgs/policies/right-icon.png) no-repeat center;
                    background-size: cover;
                    transform: rotate(90deg);
                    position: absolute;
                    right: 10px;
                    top: calc(50% - 5px);

                    &.is-active {
                        transform: rotate(180deg) !important;
                    }

                    &::before {
                        content: "" !important;
                    }
                }
            }

            .el-collapse-item__wrap {
                border: 0 !important;
            }

            .el-collapse-item__content {
                background: #fafbfd;
                border-radius: 3px;
                padding: 15px 10px 20px 10px;
            }
        }
    }

    .list {
        // overflow-y: scroll;
        padding-left: 13px;

        .list-item {
            &:not(:first-child) {
                border-top: 1px dashed #DCDFE6;
                margin-top: 15px;
                margin-bottom: 15px;
                padding-top: 15px;
            }

            .overflow {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .title {
                max-height: 44px;
                line-height: 22px;
                font-size: 14px;
                font-weight: 500;
                color: #182462;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                position: relative;
                max-width: 85%;

                span:hover {
                    font-weight: 600;
                    color: #df9008 !important;
                    background: none !important;
                    border-bottom: 1px solid #df9008;
                    cursor: pointer;

                    .keyword {
                        font-weight: 600;
                        color: #df9008 !important;
                        background: none !important;
                    }

                    &::after {
                        content: "";
                        height: 1px;
                        background: #df9008;
                    }
                }
            }

            .spec {
                display: flex;

                &:hover {
                    .title {
                        // font-weight: 600;
                        // color: #df9008 !important;
                        // background: none !important;

                        span {
                            font-weight: 500 !important;
                            border: 0 !important;
                            color: #FFF !important;
                            background: #df9008 !important;
                            cursor: text !important;
                        }

                        .keyword {
                            // font-weight: 600;
                            // color: #df9008 !important;
                            // background: none !important;
                        }
                    }
                }
            }

            .info-block {
                width: 100%;
                display: flex;
                align-items: center;
                margin-top: 10px;

                .tag {
                    height: 16px;
                    line-height: 16px;
                    display: flex;
                    align-items: center;

                    img {
                        vertical-align: middle;
                    }

                    // &:nth-of-type(2) {
                    //     display: flex;
                    //     align-items: center;
                    // }

                    &:first-child {
                        width: auto;
                        max-width: 100%;
                        flex-shrink: 0;

                        .tag-text {
                            &:not(:first-child) {
                                margin-left: 5px;
                            }
                        }
                    }

                    &:last-child {
                        width: auto;
                        flex-shrink: 1;
                        min-width: 0;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    &:not(:first-child) {
                        margin-left: 15px;
                    }

                    .tag-text {
                        height: 12px;
                        line-height: 12px;
                        font-size: 12px;
                        font-weight: 400;
                        color: #5c6973;
                        border-radius: 2px;
                        white-space: nowrap;
                    }

                    .tag-text.tag:hover {
                        color: #fff;
                        background: #DF9008 !important;
                    }
                }
            }
        }

        /deep/.el-pagination {
            .btn-prev,
            .btn-next {
                height: 28px;
                width: 28px;
                line-height: 28px;
                padding-right: 0px;
                padding-left: 0px;
                border: 1px solid #dfe5f1;
                border-radius: 4px;
                margin-right: 8px;
            }

            .el-pager li {
                min-width: 28px;
                height: 28px;
                line-height: 28px;
                border: 1px solid #dfe5f1;
                border-radius: 4px;
                margin-right: 8px;
                background-color: #fff;
                font-weight: normal;
            }

            .el-pager li.active {
                color: #fff;
                background-color: #3556b9;
            }

            .el-pagination__total {
                min-width: 28px;
                height: 28px;
                line-height: 28px;
            }

            .el-input__inner {
                border-radius: 4px;
                font-size: 13px;
            }
        }
    }

    .paganation {
        .out-of-page {
            left: 0 !important;
        }
    }

    .keyword {
        background: #DF9008;
        color: #FFF;
    }
}
</style>