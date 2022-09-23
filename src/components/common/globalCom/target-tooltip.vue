<template>
  <el-tooltip effect="light" placement="right" v-if="targets_abbr || targets">
    <div slot="content" >
      <p style="word-break:break-all; ">{{targets_abbr ? '靶点简称：' + targets_abbr : ''}}</p>
      <p style="word-break:break-all; ">{{targets ? '靶点全称：' + targets : ''}}</p>
    </div>
    <div class="lineTwoHidden">{{ targets_abbr ? targets_abbr : targets }}</div>
  </el-tooltip>
</template>

<script>

export default {
  props: {
    targets: {
      type: String,
      default: () => {
        return ''
      }
    },
    targets_abbr: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
</style>
