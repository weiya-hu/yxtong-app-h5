<template>
    <el-container >
        <el-aside v-if="$slots.aside">
            <slot name="aside" ></slot>
        </el-aside>
        <el-main >
            <slot name="main"></slot>
        </el-main>
    </el-container>
</template>
<script>
export default {
    name: 'trz-main',
    mounted() {
        console.log(this.$slots);
    }
}
</script>
<style lang="less" scoped>
.el-container {
    padding-top: 64px;
    height: calc(100vh);
}
</style>
