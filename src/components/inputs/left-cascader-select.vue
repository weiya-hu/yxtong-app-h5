<template>
  <div class="la-cascader">
    <div class="title">
      <label class="title-label">
        <NewProjectGuide  postion="基础" :onlyKey="item['new_id']" :newPosition="{ right: item.statement ? -40 : -26 }" display="inline" compoentsName="检索功能" :initItem="item" :showMenban="item['is_show_new']">{{item.label}}</NewProjectGuide>
        <!-- {{item.label}} -->
      </label>
      <el-tooltip v-if="item.statement"
        effect="light"
        placement="right"
        >
        <div slot="content" v-html="item.statement"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
      <el-tooltip
        v-else
        effect="light"
        placement="right"
        content="ATC分类，即解剖学治疗学及化学分类系统。一个药物可能同时对应多个分类，默认为检索药物的主分类，勾选多分类时可检索多个。">
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
      <el-checkbox class="title-right" @change="changeClassify" v-model="atcs_sel" size="mini">多分类</el-checkbox>
    </div>
    <div>
      <el-cascader
        class="la-advenced-cascader"
        :placeholder="item.placeholder"
        :options="options"
        :props="cascaderConfig"
        @change="updateValue"
        v-model="value"
        separator=">"
        filterable
        change-on-select
        clearable
        ref="popoverCascader"
      ></el-cascader>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      vuex_name: {
        type: String,
        default () {
          return ""
        }
      },
      item:{
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        value: [],
        cascaderConfig: {
          label: 'label',
          value: 'value',
          children: 'children'
        },
        options: [],
        atcs_sel: false,
      };
    },
    computed: {
      storeState () {
        return Store.state[this.vuex_name]
      },
      vuexQuery() {
        return Store.state[this.vuex_name].queryStr;
      }
    },
    watch: {
      vuexQuery: {
        handler(val) {
          var array = JSON.parse(val)
          this.value = []
          this.atcs_sel = false
          for (var i = 0; i < array.length; i++) {
            if (this.item.name === array[i].name) {
              this.value = array[i].show
              this.atcs_sel = array[i].atcs_sel
            }
          }
        },
        deep:true
      },

    },
    created () {
      let options = this.item.value
      if (this.vuex_name) {
        this.storeState.query.forEach(e => {
          if(e.name === this.item.name){
            this.value = e.show
            this.atcs_sel = e.atcs_sel=='1'||e.atcs_sel
          }
        })
      };

      for(let key in options){
        this.options.push(options[key])
      }
    },
    mounted () {
      this.cascaderPopMouseleave(this)
    },
    methods:{
      changeClassify () {
        let query = this.storeState.query
        _.forEach(query, (item) => {
          if (item.name==='atc') {
            item.atcs_sel = this.atcs_sel
          };
        })
        console.log(this.storeState.query)
      },
      updateValue (update_value) {
        let last_index = update_value.length-1
        let last_value = update_value[last_index]
        let value =  {opt:1,param:{name:'atc',value:last_value, show: update_value, atcs_sel: this.atcs_sel, label: this.storeState.match_putong.atc,type:"fullselect"}}
        //opt=1增加条件或者替换已有条件
        if (value.opt&&value.opt==1) {
          if (this.storeState.query.length == 0) {
            this.storeState.query.push(value.param)
          } else {
            for (let i = 0,l = this.storeState.query.length; i < l; i++) {
              if (value.param.name==this.storeState.query[i].name) {
                // 需要判断last_value值存在才去重新赋值，否则的话直接删除当前的param，不然会传给后端一个undefind值导致筛选不出数据
                if(value.param.value) {
                  this.storeState.query[i] = value.param;
                } else {
                  this.storeState.query.splice(i,1)
                }
                break;
              } else {
                if (i == l-1) {
                  this.storeState.query.push(value.param)
                  break;
                }
              }
            }
          }
        } else {
          this.storeState.query = value
        }
        Store.commit(this.vuex_name + "/queryStr", Store.state[this.vuex_name].query)
      }
    },
  }
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
.la-cascader{
  padding: 0 14px 0 10px;
  .el-cascader{
    width: 100%;
    .el-input__inner{
      background-color: @InputBgColor;
    }
  }
  .title{
    padding: 10px 0px 4px;
    font-size: 14px;
    color: #333;
    .title-label{

    }
    .title-right{
      float: right;
      color: @FontColor3;
    }
  }
}
</style>
