<template>
    <div class="marquee-kz">
        <!-- 升级消息公告 -->
        <div class="prompt-notice">
            <div class="prompt-content">
                <img src="~@/assets/imgs/notice_icon.png" />
                <div class="text-container">
                    <div class="content">
                        <p v-if="noticeMsgStr.length - (61 * noticeMsg.length - 1) > 70" class="text"
                            v-html="noticeMsgStr"></p>
                        <p v-else v-html="noticeMsgStr"></p>
                    </div>
                </div>
                <img @click="closeNotice" class="close_notice_icon" src="~@/assets/imgs/notice_close.png" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        // 公告信息数组
        noticeMsg: {
            type: Array
        }
    },
    data() {
        return {
            noticeMsgStr: ""// 公告内容
        }
    },
    computed: {
        ...mapState({
            showPromtNotice: state => state.showPromtNotice,
        }),
    },
    mounted() {
        this.$nextTick(() => {
            this.noticeMsgStr = "";
            this.noticeMsg.length > 0 && this.noticeMsg.forEach((item, index) => {
                this.noticeMsgStr += item.content;
                if (index == this.noticeMsg.length - 1) {
                    if (item.vip_link) {
                        this.noticeMsgStr = `<a href="${item.vip_link}" target="_blank">` + this.noticeMsgStr + "</a>";
                    }
                }
            })
        })
    },
    methods: {
        closeNotice() {
            this.$emit("closeNotice");
        },
    },
}
</script>

<style lang="less" scoped>
.marquee-kz {
    color: #FFF;
    width: 100%;

    .prompt-notice {
        z-index: 99999;
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #fff5f2;

        .prompt-content {
            width: 1200px;
            margin: 0 auto;
            display: flex;
            height: 100%;
            overflow: hidden;

            img {
                height: 10px;
                margin-top: 10px;
            }

            .text-container {
                width: calc(100% - 40px);
                margin: 0 auto;
                overflow: hidden;

                .content {
                    height: 100%;

                    @keyframes scroll {
                        from {
                            transform: translateX(70%);
                        }

                        to {
                            transform: translateX(-100%);
                        }
                    }

                    p {
                        height: 100%;
                    }

                    .text {
                        white-space: nowrap;
                        color: #545B6D;
                        animation: scroll 40s linear infinite;
                        display: inline-block;

                        &:hover {
                            animation-play-state: paused;
                        }
                    }
                }
            }

            .close_notice_icon {
                cursor: pointer;
            }
        }
    }
}
</style>