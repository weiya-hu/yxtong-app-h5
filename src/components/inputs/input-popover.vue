<template>
  <el-popover :append-to-body="appendToBody" ref="popover" popper-class="input-error-popover" :content="content" placement="bottom-start" v-model="popShow" trigger="manual">
    <div :class="{'input-pop-max':popShow, 'dark-outline': true}" slot="reference">
      <slot></slot>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    accurate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popShow: false,
      content: `为提高查询效率和准确率，只查询前${this.accurate?this.inpMaxLenJq:this.inpMaxLen}字的内容。`
    }
  },
  watch: {
    value(val){
      this.getPopShow(val)
    },
    accurate(val){
      this.content = `为提高查询效率和准确率，只查询前${this.accurate?this.inpMaxLenJq:this.inpMaxLen}字的内容。`
      this.getPopShow(this.value)
    }
  },
  methods: {
    getPopShow(val) {
      setTimeout(()=>{
        let refs = this.$refs.popover
        if(refs){
          let inpWidth = refs.referenceElm.offsetWidth
          if(!this.appendToBody){
            refs.$el.childNodes[0].style.maxWidth = (inpWidth-30) + 'px'
          }
          this.popShow = _.trim(val).length > (this.accurate?this.inpMaxLenJq:this.inpMaxLen)
        }
      },600)
    }
  },
  created() {
    this.getPopShow(this.value)
  }
}
</script>

<style lang="less"> // 这里不能加scoped
@import "~@/assets/less/var.less";
.input-error-popover.el-popper {
  padding: 5px 12px;
  font-size: 12px;
  color: @Red;
  margin-top: 4px;
  min-width: auto;
  box-shadow: @BoxShadow;
}
.input-pop-max {
  input {
    border-color: @Red!important;
  }
  .c-search-input {
    box-shadow: 0px 0px 2px 0px @Red!important;
  }
}
.dark-outline:focus{
  outline: none;
}
</style>
