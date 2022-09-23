<template>
  <section
  v-if="!hide"
  :index="idx"
  class="section">
    <div class="section-head">
      <div class="section-head_left">
        <span class="name">
          {{ name }}
          <i v-if="count" style="font-style: normal">({{count}})</i>
        </span>
        <el-tooltip
          class="desc"
          effect="light"
          :content="desc"
          placement="top-start"
        >
          <span class="section-ico-qa"></span>
        </el-tooltip>
      </div>
      <div class="section-head_right">
          <slot name="head"></slot>
      </div>
    </div>
    <div class="section-body">
        <slot/>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    idx: {
        type: Number,
        default: 0
    },
    name: {
      type: String,
      default: "name",
    },
    desc: {
      type: String,
      default: "section describe",
    },
  },
  data(){
    return {
      count: 0,
      hide:false
    }
  },
  mounted() {
    this.$root.$on(this.name, payload => {
      this.count = payload.count;
      this.hide = payload.hide;
    })
  }
};
</script>

<style scoped lang="less">
.section {
  background: #ffffff;
  box-shadow: 0px 1px 10px 0px rgba(9, 20, 79, 0.1);
  border-radius: 3px;
  min-height: 100px;
  margin-bottom: 10px;
  width: calc(100% - 10px);
  &-head {
    height: 36px;
    background: rgba(235, 238, 245, 0.5);
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 3px 3px 0 0;
    .name {
        color:#333333;
        font-weight: bold;
    }
    .section-ico-qa {
      width: 14px;
      height: 14px;
      display: block;
      background-image: url(/static/imgs/globaldrugs/qa.png);
      background-size: cover;
      &:hover {
        background-image: url(/static/imgs/globaldrugs/qa-c.png);
      }
    }
    &_left {
        display: flex;
        align-items: center;
        .desc {
            width: 14px;
            height: 14px;
            margin-left: 5px;
        }
    }
  }
}

</style>
