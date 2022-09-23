<template>
    <div class="iframe_content" v-waiting="loading"
        :style="{'min-height': showPromtNotice? 'calc(100vh - 78px)':'calc(100vh - 48px)'}">
        <iframe :src="iframeUrl"></iframe>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            loading: true,
            iframeUrl: '', // 要打开的地址
        }
    },
    computed: {
        ...mapState({
            showPromtNotice: (state) => state.showPromtNotice,
            menuList: state => state.UserCenter.menuList
        })
    },
    mounted() {
    },
    watch: {
        menuList: {
            handler(val) {
                if (val.length > 0) {
                    this.getUrl()
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        getUrlParam(url, name) {
            // 未传参，返回空
            if (!url || !name) return null;
            // 查询参数：先通过search取值，如果取不到就通过hash来取
            var after = url.split("?")[1];
            // 地址栏URL没有查询参数，返回空
            if (!after) return null;
            // 如果查询参数中没有"name"，返回空
            if (after.indexOf(name) === -1) return null;

            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            // 当地址栏参数存在中文时，需要解码，不然会乱码
            var r = decodeURI(after).match(reg);
            // 如果url中"name"没有值，返回空
            if (!r) return null;
            return r[2];
        },
        getUrl() {
            this.loading = true;
            let type = '';
            this.menuList.length > 0 && this.menuList.forEach(item => {
                if (item.label === '市场') {
                    item.groupList.length > 0 && item.groupList[0].group.forEach(subItem => {
                        if (subItem.label === '海关进出口数据') {
                            document.title = subItem.label
                            type = this.getUrlParam(subItem.href, 'type')
                            console.log(type);
                        }
                    })
                }
            })
            window
                .Axios({
                    method: "get",
                    url: "/api/config/getIframeUrl",
                    params: {
                        accesstoken: GETCOOKIEFUN("accesstoken"),
                        type
                    },
                })
                .then((res) => {
                    if (res.data.code === 200 && res.data) {
                        let data = res.data.data;
                        if (this.isEmpty(data.url)) {
                            this.iframeUrl = data.url;
                        } else {
                            // 如果为空字符串，表示没权限 跳转到无权限页面
                            this.iframeUrl = ''
                            this.$router.push({
                                path: "/no-permission"
                            });
                        }
                    }
                    this.loading = false
                })
                .catch((err) => {
                    console.error(err);
                    this.loading = false
                });
        }
    }
}
</script>

<style lang="less">
.iframe_content {
    position: relative;
    overflow: hidden;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }
}
</style>