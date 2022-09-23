import { mapState } from "vuex";
import setTableHMixins from "@/mixins/setTableH";

export default {
    mixins: [setTableHMixins],
    data() {
        return {
            tempIndex: 0,
            partDisTop: [],
            isClick: false,
            isClick2: true,
            recordD: 0,
            spacingH: 0, // 针对像美国上市中间布局添加的高度计算
            topP: 20,
            bottomP: 15,
            leftP: 10, // 有变更后相应得药物报告和企业报告详情文件也要调整
            bottomB: 10,
            scrollNum: 0 // 记录当前
        };
    },
    computed: {
        ...mapState({
            showPromtNotice: state => state.showPromtNotice
        })
    },
    watch: {
        isLoading(val) {
            if (!val) {
                this.$nextTick(function () {
                    this.getPartsHeight();
                });
            }
        },
        showPromtNotice: {
            handler(val) {
                console.log(val);
                this.$nextTick(() => {
                    if (val) $(".left-nav").css("top", $(".left-nav").css("top") + 30);
                });
                if (document.querySelector(".header-fixed"))
                    document.querySelector(".header-fixed").style.top =
                        (val ? 78 : 48) + "px";
            }
        }
    },
    methods: {
        getPartsHeight() {
            let part = $(".the-part");
            const h = $(".detail-header").outerHeight();
            this.partDisTop = [this.spacingH ? this.spacingH - h - this.bottomP : 0];
            this.selH = [this.spacingH];
            for (let i = 0; i < part.length; i++) {
                let ph = part.eq(i).outerHeight() + this.bottomB - 10;
                this.partDisTop.push(ph - h - this.bottomP + _.sum(this.selH));
                this.selH.push(ph);
            }
        },
        clickActive(totalIndex, e, isScroll) {
            let part = $(".the-part");
            part.removeClass("part-active");
            part.eq(totalIndex).addClass("part-active");
            $(".nav-item.sub-nav-item").removeClass("active");
            if (isScroll) {
                $(".nav-item.sub-nav-item")
                    .eq(totalIndex)
                    .addClass("active");
            }

            $(".parent-nav.active2").removeClass("active2");

            $(".sub-nav-item")
                .eq(totalIndex)
                .parent()
                .prev()
                .addClass("active2");

            $(".parent-nav.sub-nav-item").removeClass("active active2");

            $(".parent-nav.nav-item").removeClass("active");

            if (e && e.target) {
                if ($(e.target).hasClass("alone-nav")) {
                    $(e.target).addClass("active2");
                } else {
                    $(e.target).addClass("active");
                }
            }
        },
        handleNavClick(e) {
            if ($(e.target).hasClass("nav-item")) {
                const that = this;
                this.isClick = true;
                let index = $(e.target).index();
                this.isClick2 = true;

                if (that.$route.fullPath.includes("/instruct")) {
                    let totalIndex = Array.from(
                        document.querySelectorAll(".nav-item.sub-nav-item")
                    ).indexOf(e.target);

                    // 如果是只有一级标题没有子标题的菜单 这里需要索引增加1防止定位错误
                    if ($(e.target).hasClass("alone-nav") || $(e.target).parent().prev().text() === '药智信息') {
                        totalIndex++;
                    }
                    that.tempIndex = totalIndex;
                    console.log($(e.target).text(), totalIndex);
                    // $(".nav-item.sub-nav-item")
                    //     .removeClass("active")
                    //     .eq(totalIndex)
                    //     .addClass("active");

                    this.clickActive(totalIndex, e);
                    that.getPartsHeight(totalIndex);
                    if (!$(e.target).hasClass("parent-nav") || $(e.target).hasClass("alone-nav")) {
                        that.$parent.wrap.scrollTop = that.partDisTop[totalIndex];
                    }
                } else {
                    let part = $(".the-part");
                    part.removeClass("part-active");
                    $(e.target)
                        .parent()
                        .children()
                        .removeClass("active");
                    $(e.target).addClass("active");
                    part.eq(index).addClass("part-active");
                    that.getPartsHeight(index);
                    if (!$(e.target).hasClass("parent-nav") || $(e.target).hasClass("alone-nav")) {
                        that.$parent.wrap.scrollTop = that.partDisTop[index];
                    }
                }
            }
        },
        handleScrolls() {
            const that = this;
            let top = this.$parent.wrap.scrollTop;
            let navHeight = $(".main .left-nav .nav-list").outerHeight();
            let wrapperHeight = $(".wrapper").outerHeight();
            // 判断上次左侧导航的滚动条位置和本次滚动调位置是否相等，如果相等则return  （如果继续执行下面的滚动条赋值代码的话,左侧导航会一直停留在当前位置）
            if (this.scrollNum === top / (wrapperHeight / navHeight)) {
                return;
            }
            // 记录当前左侧滚动条的滚动的位置
            this.scrollNum = top / (wrapperHeight / navHeight);
            $(".main .left-nav").scrollTop(top / (wrapperHeight / navHeight));
            this.getPartsHeight();
            // console.log(top)
            // console.log(this.partDisTop)
            if (top > this.recordD) {
                if (top > $(".detail-header").height() + this.topP + this.bottomP) {
                    // $(".detail-header").addClass(
                    //     `header-fixed ${this.isClick ? "anim-none" : ""}`
                    // );

                    $(".main").css({
                        marginTop: 0
                    });

                    if (top > this.partDisTop[0]) {
                        let top = $(".la-header").height() +
                            $(".detail-header").height() +
                            this.topP +
                            this.bottomP +
                            10;
                        // 如果是药品说明书的图文详情页这里滚动之后左侧导航的高度要减去15px才等于正常的
                        if (['ChinaShuomingshuDetail1', 'ChinaGraphicsShuomingshuDetail1'].includes(this.$route.name)) {
                            top -= 15;
                        }
                        $(".left-nav").css({
                            transition: !this.isClick ? "top .2s" : "none",
                            position: "fixed",
                            top,
                            left: $(".la-menu").outerWidth() + this.leftP
                        });
                    }
                }
            } else {
                if (top < this.partDisTop[0]) {
                    $(".left-nav").removeAttr("style");
                }
                // if (top < 1) {
                // $(".detail-header").removeClass("header-fixed anim-none");
                // $(".main").removeAttr("style");
                // }
            }

            this.recordD = top;
            this.isClick = false;
            top += 20;

            if (this.$route.fullPath.includes("/instruct")) {
                for (let i = 0; i < this.partDisTop.length; i++) {
                    if (top > this.partDisTop[i] && top < this.partDisTop[i + 1]) {
                        let tempIndex = i;

                        console.log(this.isClick2);
                        if (this.isClick2 == false) {
                            this.clickActive(tempIndex, null, true);

                            $(".the-part").removeClass("part-active");
                            $(".the-part")
                                .eq(i)
                                .addClass("part-active");
                        }
                        this.isClick2 = false;
                        return false;
                    }
                    if (top > this.partDisTop[this.partDisTop.length - 1]) {
                        // $(".sub-nav-item.active").removeClass("active");
                        // $(".sub-nav-item")
                        //     .eq(this.partDisTop.length - 1)
                        //     .addClass("active");

                        if (this.isClick2 == false) {
                            this.clickActive(this.partDisTop.length - 1, null, true);
                            $(".the-part").removeClass("part-active");
                            $(".the-part")
                                .eq(this.partDisTop.length - 1)
                                .addClass("part-active");
                        } else this.isClick2 = false;
                        // $(".nav-event>.nav-item")
                        //     .eq(this.partDisTop.length - 1)
                        //     .parent()
                        //     .prev()
                        //     .find(".parent-nav")
                        //     .addClass("active");

                        // $(".parent-nav.active2").removeClass("active2");
                        // console.log(2);
                        // $(".nav-event>.nav-item")
                        //     .eq(this.partDisTop.length - 1)
                        //     .parent()
                        //     .prev()
                        //     .addClass("active2");
                        return false;
                    }
                }
            } else {
                for (let i = 0; i < this.partDisTop.length; i++) {
                    if (top > this.partDisTop[i] && top < this.partDisTop[i + 1]) {
                        $(".the-part").removeClass("part-active");
                        $(".the-part")
                            .eq(i)
                            .addClass("part-active");

                        $(".nav-event>.nav-item").removeClass("active");
                        $(".nav-event>.nav-item")
                            .eq(i)
                            .addClass("active");
                        return false;
                    }
                    if (top > this.partDisTop[this.partDisTop.length - 1]) {
                        $(".the-part").removeClass("part-active");
                        $(".the-part")
                            .eq(this.partDisTop.length - 1)
                            .addClass("part-active");

                        $(".nav-event>.nav-item").removeClass("active");
                        $(".nav-event>.nav-item")
                            .eq(this.partDisTop.length - 1)
                            .addClass("active");
                        return false;
                    }
                }
            }
            if (document.querySelector(".header-fixed")) {
                document.querySelector(".header-fixed").style.top =
                    (this.showPromtNotice ? 78 : 48) + "px !important";
            }
        }
    },
    mounted() {
        window.addEventListener("scroll", this.handleScrolls, true);
    }
};
