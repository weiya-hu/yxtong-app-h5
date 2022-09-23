<template>
  <div class="detail-items" style="min-height: 350px" id="pzlc">
    <LoadingGif :loadFlag="isloading" v-if="isloading"></LoadingGif>
    <div class="detail-item">
      <div class="item-title">
        <span class="text">
          上市批准历程
          <el-tooltip effect="light" placement="top" v-if="!jspdf">
            <div slot="content" v-html="'按照活性成分的最早批准时间排列。'"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
          <!-- <span class="num">{{allCount}}</span> -->
        </span>
        <span class="go-btn" @click="go" v-if="show">
          <img src="@/assets/imgs/go-icon.png" width="16" height="14" />
          全球视野
        </span>
      </div>
      <div style="padding: 0 10px 10px 10px">
        <pzlcDetail :data="pzlcData" />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import pzlcDetail from "@/pages/globalapproval/detail/components/pzlc";

export default {
  props: {
    // 原料编码
    ylbm: {
      type: String,
      required: true,
    },
    jspdf: {
      type: Boolean,
    },
    pizhunHis: {
      type: Object
    }
  },
  components: {
    LoadingGif,
    pzlcDetail,
  },
  data() {
    return {
      show: false,
      isloading: true,
      activeingredient: "", // 活性成分 用于跳转到对应全球上市详情页
      pzlcData: [],
    };
  },
  mounted() {
    this.handlerPZLC();
    console.log(this.pizhunHis);
  },
  methods: {
    go() {
      const { href } = this.$router.resolve({
        path: "/globalapproval/detail",
        query: {
          activeingredient: this.activeingredient,
        },
      });
      window.open(href, "_blank");
    },
    // 批准历程
    async handlerPZLC() {
      if (this.pizhunHis) {
        this.pzlcData = this.pizhunHis.list;
        this.activeingredient = this.pizhunHis.activeingredient;
        this.isloading = false;
        return;
      }
      this.isloading = true;
      const _this = this;
      const res = await window
        .Axios({
          method: "get",
          url: `/api/report/pizhunHis`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            ylbm: _this.ylbm,
          },
        })
        .catch((err) => {
          console.log(err);
          _this.pzlcData = [];
          _this.isloading = false;
        });

      let data = res.data.data;
      if (res.data.code === 200 && res.data.data) {
        _this.pzlcData = data.list;
        _this.activeingredient = data.activeingredient;
        if (!_this.activeingredient) {
          _this.show = false;
        } else {
          _this.show = !_this.jspdf;
        }
        _this.isloading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";

.detail-items {
  margin-top: 10px;
  box-shadow: 0px 1px 8px 0px #d8e2fa;
  border-radius: 4px;
  background: #fff !important;
  position: relative;
}

.item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    top: 0 !important;
  }
}

.go-btn {
  display: flex;
  align-items: center;
  padding: 2px 10px;
  line-height: 24px;
  background: #4877e8;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin-bottom: 5px;
  margin-right: 10px;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 6px;

  img {
    margin-right: 4px;
  }
}

.fullscreen-loading {
  height: calc(100% - 50px);
  position: absolute;
}
</style>
