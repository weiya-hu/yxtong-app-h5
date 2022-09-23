<template>
  <div class="trz-map">
    <header-trz></header-trz>
    <!-- 根据路由判断显示投融资路由还是并购路由 -->
    <div class="left-tab">
      <div
        @click="handleTab('rongzi')"
        :class="{ active: showMap === 'rongzi' }"
      >
        投融资地图
      </div>
      <div
        @click="handleTab('binggou')"
        :class="{ active: showMap !== 'rongzi' }"
      >
        并购地图
      </div>
    </div>
    <keep-alive>
      <Rongzi v-if="showMap === 'rongzi'" ref="rongzi"></Rongzi>
      <Binggou v-if="showMap === 'binggou'"></Binggou>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderTrz from "@/components/layouts/trz/header";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import NoData from "@/components/common/trz/noData";
import Rongzi from "./map/rongzi.vue";
import Binggou from "./map/binggou.vue";
export default {
  components: {
    HeaderTrz,
    LoadingGif,
    NoData,
    Rongzi,
    Binggou,
  },
  data() {
    return {
      showMap: "",
    };
  },
  mounted() {
    this.showMap = this.$route.query.map;
  },
  watch: {
    $route: {
      handler() {
        this.showMap = this.$route.query.map;
      },
      deep: true,
    },
  },
  methods: {
    handleTab(txt) {
      this.showMap = txt;
    }
  },
};
</script>

<style lang="less" scoped>
.left-tab {
  position: fixed;
  top: 68px;
  left: 40px;
  z-index: 9999;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  color: #333;

  > div {
    margin-right: 10px;
    cursor: pointer;
    text-align: center;
    width: 100px;
    height: 28px;
    border-radius: 4px;
    line-height: 28px;
    border: 1px solid #0d1a62;
    color: #0d1a62;
    background: #fff;
    box-sizing: border-box;

    &:hover {
      color: #e7af2f;
      // border: 1px solid #E7AF2F;
    }
  }

  .active {
    color: #fff;
    background: #e7af2f;
    border: 1px solid #e7af2f;

    &:hover {
      color: #fff;
    }
  }
}
</style>
