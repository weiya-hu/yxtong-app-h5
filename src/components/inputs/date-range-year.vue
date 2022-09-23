<template>
  <div class="la-advenced-daterange">
    <el-date-picker
      v-model="dateval[0]"
      type="year"
      format="yyyy"
      value-format="yyyy"
      @change="updateValue"
      placeholder="选择开始年份"
      clearable
      :picker-options="pickerOptionsStart"
      ref="popoverStart"
      >
    </el-date-picker>
    <!-- <span class="line">-</span> -->
    <el-date-picker
      v-model="dateval[1]"
      type="year"
      format="yyyy"
      value-format="yyyy"
      @change="updateValue"
      placeholder="选择结束年份"
      clearable
      :picker-options="pickerOptionsEnd"
      ref="popoverEnd"
      >
    </el-date-picker>
  </div>
</template>

<script>
  export default{
    props:{
      vuex_name: {
        type: String,
        default () {
          return ""
        }
      },
      value:{
        type: String,
        default () {
          return ""
        }
      },
      index: {
        type: Number,
      }
    },
    data () {
      return {
        dateval:['',''],
        //defaulval:['',''],
        pickerOptionsStart:{},
        pickerOptionsEnd:{},
      }
    },
    watch: {
      value () {
        this.handleTimePicker()
      }
    },
    computed: {
      defaulval() {
        //传入普通搜索条件
          if (this.value!="") {
          var value = _.split(this.value,':',2)
          return [value[0]==""?"":new Date(value[0]),value[1]==""?"":new Date(value[1])]
        }
      }
    },
    created() {
      //用于默认传值
      if (this.value!="") {
        var value = _.split(this.value,':',2)
        this.defaulval[0] = value[0]==""?"":new Date(value[0])
        this.defaulval[1] = value[1]==""?"":new Date(value[1])
      }
    },
    methods: {
      updateValue () {
         //开始时间
        var that=this
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
            disabledDate: (time) => {
              let endTime=that.dateval[1] ? that.dateval[1] :'';
              // console.log(endTime)
              endTime=endTime.slice(0,4)+'-'+endTime.slice(4,6)
                // 若时间有误差，可加减一天1000*3600*24
                return that.dateval[1]!=''?time.getTime() >new Date(endTime).getTime():false;
            }
        })

      //结束时间
          this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
            disabledDate: (time) => {
              let endTime=that.dateval[0] ? that.dateval[0] :'';
              // console.log(endTime)
              endTime=endTime.slice(0,4)+'-'+endTime.slice(4,6)
                return  that.dateval[0]!=''?time.getTime() < new Date(endTime).getTime():false;
            }
        })

        let date="";
        date = (this.dateval[0] ? this.dateval[0] : "") + ":" + (this.dateval[1] ? this.dateval[1] : "")
        if (date == ":") { // 左右侧全部清空后，避免带入":"符号进去
          date = ""
        }
        this.$emit("updateValue", this.index, date)
      },
      // 处理BUG的方法：左侧选择时间后，点击高级搜索后，实际值传过去了，通过这个方法使之显示为肉眼可见
      handleTimePicker () {
        let componentValue = this.value
        if (componentValue !== "") {
          this.dateval[0] = componentValue.split(":")[0] === "0" ? "" : componentValue.split(":")[0]
          this.dateval[1] = componentValue.split(":")[1] === "0" ? "" : componentValue.split(":")[1]

          this.dateval = [this.dateval[0], this.dateval[1]]

          // 以下为更新父组件的value
          this.updateValue()
        } else {
          this.dateval = ["", ""]
        }

      },
    },
    mounted() {
      this.handleTimePicker()
      this.datePopMouseleave(this)
    },
  }
</script>

<style lang="less">
  .la-advenced-daterange{
    display: flex;
    justify-content: space-between;
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 148px;
    }
    .el-input__icon{
      line-height: 100%;
    }
    .el-date-editor {
      .el-input__inner {
        padding-left: 26px;
      }
    }
    .line{
      // padding: 0px 4px 0px 5px;
    }
  }
</style>
