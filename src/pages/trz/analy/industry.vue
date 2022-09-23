<template>
  <div>
    <header-trz></header-trz>
    医药产业链
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderTrz from "@/components/layouts/trz/header";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import NoData from "@/components/common/trz/noData";
export default {
  components: {
    HeaderTrz,
    LoadingGif,
    NoData
  },
}
</script>

<style lang="less" scoped>
</style>
