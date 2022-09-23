<template>
  <div class="la-date">
    <div class="title">
      <label class="title-label">
        <!-- {{initItem.label}} -->
        <NewProjectGuide   postion="基础" :onlyKey="initItem['new_id']" :newPosition="{ right: initItem.statement ? -40 : -26 }" display="inline" compoentsName="检索功能" :initItem="initItem" :showMenban="initItem['is_show_new']">{{initItem.label}}</NewProjectGuide>
      </label>
      <el-tooltip v-if="initItem.statement"
                  effect="light"
                  placement="right"
                  >
                  <div slot="content" v-html="initItem.statement"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
      <el-tooltip v-else-if="initItem.field=='yxq' && initItem.label=='有效日期' && vuex_name == 'Qxss'" effect="light" placement="right">
        <div slot="content" v-html="helpDesc.validDate"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
    </div>
    <div v-if="initItem.limit.length!=0" class="shortcut-date">
      <el-radio v-for="(date,index) in initItem.limit" v-model='kjdate' :label="index" :key="index" @change="update(0)" @click.native.prevent="handleRadioClick(index)" ref="radoo">最近{{date.count}}{{$t('unit.'+ date.unit)}}({{date.num}})</el-radio>
    </div>
    <div class="date-range">
      <el-date-picker
        type="date"
        v-model="dateval[0]"
        @change="update(1)"
        placeholder="选择日期"
        size="mini"
        format="yyyy-MM-dd"
        value-format="yyyyMMdd"
        clearable
        :picker-options="pickerOptionsStart"
        ref="popoverStart"
        >
      </el-date-picker>
      <span>-</span>
      <el-date-picker
        type="date"
        v-model="dateval[1]"
        @change="update(1)"
        placeholder="选择日期"
        size="mini"
        format="yyyy-MM-dd"
        value-format="yyyyMMdd"
        clearable
        :picker-options="pickerOptionsEnd"
        ref="popoverEnd"
        >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import Moment from "moment"


const defaultItem = {
  name: "",
  type: "date",
  label: "",
  placeholder: "",
  limit: []
}

export default {
  props: {
    vuex_name: {
      type: String,
      default () {
        return ""
      }
    },
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: String,
      default() {
        return "请选择时间";
      }
    }
  },
  data() {
    return {
      dateval: ["", ""],
      kjdate: false,
      helpDesc: {
        validDate: 'Ⅱ类、Ⅲ类2014年后国家局规定，该两类医疗器械注册证有效期为五年'
      },
      pickerOptionsStart:{},
      pickerOptionsEnd:{},
      // startDate:null,
      // endDate:null
    };
  },
  watch: {
    kjdate() {},
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val);
        this.dateval = ["", ""];
        for (var i = 0; i < array.length; i++) {
          if (this.initItem.name === array[i].name) {
            let val = array[i].value
            if (val) {
              this.dateval[0] = val.split(":")[0];
              this.dateval[1] = val.split(":")[1];
            }
          }
        }
      },
      deep:true
    }
  },
  computed: {
    //经过格式化后的item
    initItem() {
      return Object.assign({}, defaultItem, this.item)
    },
    vuexQuery() {
      return Store.state[this.vuex_name].queryStr;
    }
  },
  methods: {
    handleRadioClick(index) {
      let kj = this.kjdate
      if (kj === 0 || kj === 1) {
        if (index !== kj) { // 选中后未取消选择时，点击另一个选项
          this.kjdate = index
          this.update(0)
        } else { // 选中后未取消选择时，点击已选中选项
          this.kjdate = false
          this.update(1)
        }
      } else { // 未选中，点击所需选项
        this.kjdate = index
        this.update(0)
      }
    },
    computeKjDate() {
      for (var i = this.initItem.limit.length - 1; i >= 0; i--) {
        if (i == this.kjdate) {
          let start = Moment().subtract(this.initItem.limit[i].count, this.initItem.limit[i].unit).format("YYYYMMDD");
          return start + ":" + Moment().format("YYYYMMDD");
        }
      }
    },
    //计算时间段 unit:单位 count:数量
    computedDate(unit, count) {
      moment().subtract(count, unit);
    },
    update(index) {
      //开始时间
      var that=this
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
            disabledDate: (time) => {
              let endTime=that.dateval[1] ? that.dateval[1] :'';
              endTime=endTime.slice(0,4)+'-'+endTime.slice(4,6)+'-'+endTime.slice(6,8);
                // 若时间有误差，可加减一天1000*3600*24
                return that.dateval[1]!=''?time.getTime() >= new Date(endTime).getTime():false;
            }
        })

      //结束时间
         this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
            disabledDate: (time) => {
              let endTime=that.dateval[0] ? that.dateval[0] :'';
              endTime=endTime.slice(0,4)+'-'+endTime.slice(4,6)+'-'+endTime.slice(6,8);
                return  that.dateval[0]!=''?time.getTime() < new Date(endTime).getTime()-(1000*3600*24):false;
            }
        })




      let date = "";
      if (index == 1 ) {
        this.kjdate = false;
        date = (parseInt(this.dateval[0]) ? this.dateval[0] : '') + ":" + (parseInt(this.dateval[1]) ? this.dateval[1] : '');
      } else {
        this.dateval = ["", ""]; //清空输入框日期
        date = this.computeKjDate();
      }
      Store.commit(this.vuex_name + "/query", {
        opt: 1,
        param: { name: this.initItem.name, label: this.initItem.label, value: date, type: this.initItem.type }
      });
      Store.commit(this.vuex_name + "/queryStr", Store.state[this.vuex_name].query)
      // console.log(date);
    },
    //鼠标移出隐藏下拉框
    popMouseleave(){
      $("body").on("mouseleave",".el-picker-panel",()=>{
        this.$nextTick(()=>{
          if (this.$refs.popoverStart) {
            this.$refs.popoverStart.pickerVisible = false
          };
          if (this.$refs.popoverEnd) {
            this.$refs.popoverEnd.pickerVisible = false
          };
        })
      })
    }
  },
  created() {
    if (this.item.value) {
      this.dateval[0] = this.item.value.split(":")[0]
      this.dateval[1] = this.item.value.split(":")[1]
    }
  },
  mounted() {
    this.datePopMouseleave(this)
  },
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.la-date {
  padding: 0 14px 0 10px;

  .title {
    padding: 10px 0px 4px;
    font-size: 14px;
    color: #333;
    .title-right {
      float: right;
      color: @FontColor3;
    }
  }
  .shortcut-date {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: @FontSizeSmall;
    .el-radio {
      margin-bottom: 10px!important;
    }
    .el-radio + .el-radio {
      margin: 0px 2px 2px 0px;
    }
    .el-radio__label {
      padding: 0px 2px 0px;
      margin: 0px 5px;
      font-size: @FontSizeSmall;
    }
  }
  .date-range {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    .el-radio__label {
      padding-left: 4px;
      font-size: @FontSizeSmall;
    }
    .el-input__inner {
      padding: 0 0 0 22px !important;
      background-color: @InputBgColor;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: calc(50% - 8px)!important;
    }
    .el-input__prefix {
      left: 8px!important;
    }
    .el-input__icon {
      width: 10px;
      line-height: 28px;
    }
  }
}
</style>
