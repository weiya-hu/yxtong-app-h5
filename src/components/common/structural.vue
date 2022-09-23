<template>
  <div>
    <!-- 结构式检索弹出框 -->
    <el-dialog :visible.sync="formulaFormVisible" :append-to-body="true" width="1000px">
      <div slot="title" class="dialog-header">
        结构式检索
      </div>
      <Ketcher @getKetcherData="getKetcherData" />
    </el-dialog>

    <!-- 结构式检索按钮 -->
    <div class="hxs-btn-wrap">
      <a class="hxs-btn" @click.prevent="()=>formulaFormVisible=true">结构式检索</a>
      <el-tooltip class="item" effect="light" placement="right">
        <div slot="content">在结构式编辑器中绘制结构式，选择精确、子结构、相似检索中的一种，即可匹配出相应的化合物。</div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import Ketcher from '@/components/common/ketcher'
  export default{
    components: {
      Ketcher
    },
    data () {
      return {
        formulaFormVisible: false,
      }
    },
    methods: {
      getKetcherData(obj){
        this.$emit('getKetcherData', obj)
        this.formulaFormVisible = false
      }
    }
  }
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.hxs-btn-wrap{
  margin: 0 15px;
  .hxs-btn{
    color: @PrimaryColor;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>