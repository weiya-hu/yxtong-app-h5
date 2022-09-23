<template>
  <div class="la-fullselect">
    <div class="title">
      <label class="title-label"><NewProjectGuide :onlyKey="item['new_id']" :newPosition="{ right: item.statement ? -40 : -26 }" display="inline" compoentsName="检索功能" :initItem="item" :showMenban="item['is_show_new']">{{item.label}}</NewProjectGuide></label>
      <!-- <label class="title-label">{{item.label}}</label> -->
      <el-tooltip v-if="item.statement"
                  effect="light"
                  placement="right"
                  >
                  <div slot="content" v-html="item.statement"></div>
        <i class="el-icon-question cl-green"></i>
      </el-tooltip>
    </div>
    <el-cascader
      v-model="value"
      class="la-advenced-fullselect"
      :placeholder="item.placeholder"
      :options="options"
      :props="cascaderConfig"
      @change="updateValue"
      separator=">"
      filterable
      change-on-select
      clearable
      ref="popoverCascader"
    ></el-cascader>
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
        type:Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        value:[],
        cascaderConfig: {
          label: 'label',
          value: 'value',
          children: 'children',
          level: 'level',
        },
        options: []
      };
    },
    computed: {
      storeState () {
        return Store.state[this.vuex_name]
      },
      vuexQuery() {
        return Store.state[this.vuex_name].queryStrAnaly;
      }
    },
    watch: {
      vuexQuery: {
        handler(val) {
          var array = JSON.parse(val)
          this.value = []
          for (var i = 0; i < array.length; i++) {
            if (this.item.name === array[i].name) {
              this.value = array[i].value.split('⊙')
            }
          }
        },
        deep:true
      },
    },
    created () {
      //第一次搜索将putong赋值给value
      let putong = this.storeState.putongAnaly,
      obj = this.item;
      _.forEach(obj, (item) => {
        _.forEach(putong, (items,key) => {
          if (item === key) {
            this.value = items.split('⊙')
          };
        })
      })

      let options = this.item.value
      for(let key in options){
        this.options.push(options[key])
      }
    },
    mounted() {
      this.cascaderPopMouseleave(this)
    },
    methods:{
      updateValue (update_value) {
        let name = this.item.name
        let new_value = update_value.join("⊙")

        let value = {opt: 1,param:{name: name, value: new_value, label: this.item.label,type:"fullselect"}}

        Store.commit(this.vuex_name + "/queryAnaly", value)
        // Store.commit(this.vuex_name + "/queryStrAnaly", Store.state[this.vuex_name].query)
        // }
      }
    }
  }
</script>
<style lang="less">
@import "~@/assets/less/var.less";
.la-fullselect{
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
