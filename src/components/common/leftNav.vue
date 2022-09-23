<template>
  <div class="menu">
    <div
      class="nav"
      v-for="(item, index) in navs"
      :key="index"
      :class="{ active: item === nowNav }"
      @click="navToContent(item, index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    navs: {
      type: Array
    },
    nowNav: {
      type: String
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    navToContent(name, index) {
      // 点击导航条类目，左右对应的激活情况改变
      this.$emit("changeNowNav", name);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.menu {
  width: 180px;
  box-sizing: border-box;
  .nav {
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 180px;
    height: 40px;
    border-radius: 4px;
    padding-left: 18px;
    margin-left: 0px;
    border-bottom: 1px solid @BorderColor;
    cursor: pointer;
    box-sizing: border-box; // 若不是border-box，则需要改变宽度
    font-size: 14px;
    &:hover {
      transition: all 500ms;
      margin-left: 0px;
      display: flex;
      width: 180px;
      height: 40px;
      background: #ffffff;
      border-radius: 4px;
      padding-left: 18px;
      position: relative;
      background: #fff;
      border-bottom: none;
      color: @PrimaryColor;
      // box-shadow: @BoxShadow;
      &::before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 40px;
        background: @PrimaryColor;
      }
    }
  }
  // 导航选项 - active
  .active {
    margin-left: 0px;
    width: 180px;
    padding-left: 18px;
    position: relative;
    background: #fff;
    border-bottom: none;
    color: @PrimaryColor;
    box-shadow: @BoxShadow;
    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 40px;
      background: @PrimaryColor;
    }
  }
}
</style>
