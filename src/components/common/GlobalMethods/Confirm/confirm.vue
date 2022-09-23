<template>
  <el-dialog class="dialog-actions" :visible.sync="exportVisible" :modal-append-to-body="false">
    <div slot="title" class="dialog-header">
      {{title}}
    </div>
    <div v-html="text"></div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 认</el-button>
      <el-button @click="()=>exportVisible=false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    callBack: {
      type: Function
    }
  },
  data() {
    return {
      exportVisible: true,
    }
  },
  methods: {
    confirm (){
      if (this.callBack) {
        this.callBack()
      };
      this.exportVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
