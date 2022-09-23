<template>
  <div class="pzlc">
    <div class="rzlc" v-if="pzlcList.length">
      <div class="rzlc-warp" ref="rzlcwarp" id="rzlcwarp">
        <div class="rzlc-scroll">
          <div :class="['rzlc-item', { active: handlerActive(item, index) }]" v-for="(item, index) in pzlcList"
            :key="item.source">
            <div :class="['dot', { active: handlerActive(item, index) }]"></div>
            <div class="inner">
              <div class="bd">
                <div class="info">
                  <div style="display: flex;align-items: center;margin-bottom: 2px;">
                    <img :src="
                      '/static/imgs/globalapproval/' +
                      handlerIcon(item.source)
                    " class="icon" />
                    <span :style="highlightSource(0, index, item.source)">{{
                      item.source
                    }}</span>
                  </div>
                  <div :style="highlightSource(1, index, item.source)">
                    {{ item.mindate }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pzlcList: []
    };
  },
  watch: {
    data: {
      handler(val) {
        this.pzlcList = val;
      },
      deep: true
    }
  },
  mounted() {
    this.pzlcList = this.data;
    this.$nextTick(() => {
      this.calcPZLCList();
    });
    window.addEventListener("resize", () => {
      this.calcPZLCList();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.calcPZLCList();
    });
  },
  methods: {
    handlerActive(item, index) {
      let color = "";
      if (index === 0 || ["中国"].includes(item.source)) {
        color = "active";
      }
      return color;
    },
    calcPZLCList() {
      let totalW = $("#rzlcwarp").width(),
        countryW = $(".inner").width(),
        marginLR =
          ((totalW - countryW * (this.pzlcList.length / 2)) /
            this.pzlcList.length) *
          2;
      if (totalW > 1200) {
        marginLR =
          (totalW - countryW * (this.pzlcList.length / 2 + 1)) /
          this.pzlcList.length;
      } else {
        marginLR =
          ((totalW - countryW * (this.pzlcList.length / 2)) /
            this.pzlcList.length) *
          2;
      }
      // $(".rzlc-item").css("margin", `0 ${marginLR}px`);
    },
    highlightSource(type, index, source) {
      let styles = "";
      if (type == 0) {
        styles =
          "font-size: 14px;font-weight: 600;height: 13px;line-height: 13px;color: #545B6D;";
        if (index == 0 || ["中国"].includes(source))
          styles = "font-size: 16px;color: #4877e8;";
        return styles;
      } else if (type == 1) {
        styles =
          "font-size: 12px;font-weight: 400;height: 13px;line-height: 13px;color: #666666;";
        if (index == 0 || ["中国"].includes(source)) styles = "color: #4877e8;";
        return styles;
      }
    },
    handlerIcon(source) {
      let icon = "";
      switch (source) {
        case "美国":
          icon = "United States of America";
          break;
        case "中国":
        case "中国台湾":
          icon = "China";
          break;
        case "日本":
          icon = "Japan";
          break;
        case "英国":
          icon = "Great Britain";
          break;
        case "法国":
          icon = "France";
          break;
        case "德国":
          icon = "Germany";
          break;
        case "加拿大":
          icon = "Canada";
          break;
        case "印度":
          icon = "India";
          break;
        case "欧盟EMA":
        case "欧盟HMA":
          icon = "Europe";
          break;
        case "韩国":
          icon = "South Korea";
          break;
      }
      icon += ".png";
      return icon;
    }
  }
};
</script>

<style lang="less" scoped>
.pzlc {
  .rzlc {
    margin: 0 10px;
    width: calc(100% - 20px);
    min-width: 800px;
    position: relative;
    overflow: hidden;

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 184px;
      width: 100%;
      height: 1px;
      z-index: 1;
      background: #d8d8d8;
    }
  }

  .rzlc-warp {
    width: 100%;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .rzlc-scroll {
    white-space: nowrap;
    padding: 170px 0px; // 170px100px
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-around;
  }

  .rzlc-item {
    position: relative;
    height: 1px;
    background-color: #dae0e9;
    display: inline-block;
    transition: all 0.05s ease-in;

    * {
      transition: all 0.05s ease-in;
    }

    z-index: 2;

    .inner {
      width: 90px;
      height: 60px;
      overflow: hidden;
      position: absolute;
      left: -35px;
      background-color: #fff;
      font-size: 13px;
      z-index: 5;
      border-radius: 4px;

      .bd {
        padding: 7px 18px;

        .info {
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          font-size: 13px;
          line-height: 16px;
          font-weight: 600;
          color: #545b6d;

          .icon {
            width: 20px;
            height: 20px;
            margin-right: 3px;
          }

          label {
            width: 68px;
            color: #666;
            display: flex;
            justify-content: space-between;
            flex-shrink: 0;
          }

          .money {
            color: #e7af2f;
            font-size: 18px;
            vertical-align: middle;
            display: inline-block;
            margin-top: -5px;
          }

          >div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .dot {
      width: 5px;
      height: 5px;
      background: #cccccc;
      border-radius: 50%;
      position: absolute;
      z-index: 9;
      left: 2px;

      &.active {
        background: #3556b9;
      }
    }

    &:nth-child(even) {
      .dot {
        top: -25px;
      }
    }

    &:nth-child(odd) {
      .dot {
        top: 45px;
      }
    }

    &:before {
      content: "";
      position: absolute;
      left: 3px;
      width: 1px;
      z-index: 1;
      border-right: 1px dashed #d8d8d8;
      height: 30px;
    }

    &.active::before {
      border-right: 1px solid #3556b9;
    }

    &:after {
      content: "";
      position: absolute;
      top: 10px;
      left: 0;
      width: 9px;
      height: 9px;
      background-color: #fff;
      border: 1px solid #cccccc;
      border-radius: 50%;
      z-index: 2;
    }

    &.active::after {
      background: #3556b9;
      border: none;
    }

    &:nth-child(even) {
      &:before {
        top: -20px;
      }

      .inner {
        top: -80px;
      }
    }

    &:nth-child(odd) {
      &:before {
        top: 17px;
      }

      .inner {
        top: 50px;
      }
    }

    &.active {
      .inner {
        border-color: #3556b9;

        .hd {
          background-color: #3556b9;
          color: #fff;

          a {
            color: #fff;
          }

          em {
            color: #fff;
            border-color: #fff;
          }
        }
      }
    }
  }
}
</style>
