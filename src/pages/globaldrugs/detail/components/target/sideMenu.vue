<template>
    <div class="menu">
        <div v-for="(menu, index) in menus.filter(item => !item.hidden)" :key="index"
            :class="['menu-item', index == value ? 'menu-item_active' : '']" @click="changeHandler(index)">
            <img v-if="index == value" class="ico" :src="menu.ico1" alt="">
            <img v-else class="ico" :src="menu.ico" alt="">
            <span class="name">{{ menu.name }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sideMenu',
    props: {
        menus: {
            type: Array,
            default: () => []
        },
        value: {
            type: Number,
            default: 0
        }
    },
    methods: {
        changeHandler(i) {
            window.ga("send", "event", "button", "click",
                "企业版_全球药物_靶点详情_左侧菜单_" + this.menus.filter(item => !item.hidden)[i]
            );
            window._paq.push([
                "trackEvent",
                "button",
                "click",
                "企业版_全球药物_靶点详情_左侧菜单_" + this.menus.filter(item => !item.hidden)[i]
            ]);
            this.$emit('input', i)
        }
    }
}
</script>

<style scoped lang="less">
.menu {
    overflow: hidden;
}

.menu-item {
    padding: 0 10px;
    height: 40px;
    display: flex;
    align-items: center;
    position: relative;
    user-select: none;
    cursor: pointer;
    flex-wrap: nowrap;

    .ico {
        width: 14px;
        margin-right: 10px;
    }

    .name {
        font-size: 14px;
        color: #000F32;
        font-weight: 400;
        white-space: nowrap;
        flex: 1;
    }

    &:after {
        width: calc(100% - 20px);
        border-bottom: 1px solid #EBEEF5;
        content: '';
        display: 'block';
        position: absolute;
        bottom: 0;
        left: 10px;
    }

    &_active {
        box-shadow: 0px 1px 8px 0px rgba(9, 20, 79, 0.1);

        .name {
            font-weight: 500;
        }

        &:after {
            position: absolute;
            top: 0;
            left: 0;
            border-bottom: none;
            width: 2px;
            height: 100%;
            background-color: #002FA7;
        }
    }
}
</style>