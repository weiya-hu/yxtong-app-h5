<template>
  <div
    class="more"
    :style="{ paddingBottom: showtoggle ? lineHeight + 'px' : 0 ,lineHeight: lineHeight+'px'}"
  >
    <div
      :style="{
        '-webkit-line-clamp': limit,
        'max-height': limit * lineHeight + 'px',
      }"
      :class="['more-content', classes.content]"
    >
      <span v-if="content" class="more-content_inner">{{ content }}</span>
      <span v-else class="more-content_inner">
        <slot></slot>
      </span>
    </div>
    <div
      v-show="showtoggle"
      :class="['more-btn', classes.btn]"
      @click="toggleVisit"
    >
      <i class="icon el-icon-d-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "more-text",
  data() {
    return {
      showtoggle: false,
    };
  },
  props: {
    content: {
      default: "",
      type: String,
    },
    lineHeight: {
      default: 18,
      type: Number,
    },
    // 限制的展示 行数
    limit: {
      default: 3,
      type: Number,
    },
  },
  watch: {
    $slots: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (
              $(`.${this.classes.content} .more-content_inner`).height() >
              this.lineHeight * this.limit
            ) {
              this.showtoggle = true;
            } else {
              this.showtoggle = false;
            }
          });
        }
      },
      immediate: true,
    },
    content: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (
              $(`.${this.classes.content} .more-content_inner`).height() >
              this.lineHeight * this.limit
            ) {
              this.showtoggle = true;
            } else {
              this.showtoggle = false;
            }
          });
        }
      },
      immediate: true,
    },
  },
  computed: {
    classes() {
      const str = Math.random().toString(32).substr(2, 4);
      return {
        content: "content-" + str,
        btn: "btn-" + str,
      };
    },
  },
  methods: {
    toggleVisit() {
      $("." + this.classes.content).toggleClass("visible");
      $("." + this.classes.btn).toggleClass("colspan");
    },
  },
};
</script>

<style scoped lang="less">
.more {
  position: relative;
  word-break: break-all;
  .more-content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    &.visible {
      max-height: unset !important;
      display: block;
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: unset;
      overflow: visible;
      text-overflow: visible;
    }
  }
  .more-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    cursor: pointer;
    color: #002fa7;
    &::before {
      content: "更多";
    }
    i {
      transform: rotate(90deg);
    }
    &.colspan {
      i {
        transform: rotate(-90deg);
      }
      &::before {
        content: "收起";
      }
    }
  }
}
</style>