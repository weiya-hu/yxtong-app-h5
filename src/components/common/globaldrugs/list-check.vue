<template>
  <div style="display: inline-block" class="global-check">
    <span class="action-btn" @click="handleActionShow()"><img src="~@/assets/imgs/globaldrugs/xs_icon.png" width="14px" alt=""> 显示</span>
    <img src="/static/imgs/newProjectGuide/new.png" v-if="is_show_new" @click="handleActionShow()" alt="显示" class="new-img"/>
    <el-dialog class="dialog-actions" ref="listDialog" :visible.sync="filedVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        显示
      </div>
      <div>
        <el-checkbox v-model="checkallShow" @change="handleCheckAllShow">全选</el-checkbox>
      </div>
      <div class="check-scroll-wrapper">
        <el-scrollbar>
          <el-checkbox-group v-model="showArr">
            <table class="fields-table">
              <tbody>
                <tr v-for="(item, index) in this_defaultFiled" :key="index">
                  <template v-if="!item.hide">
                    <td style="width:330px;">
                      <el-checkbox :label="(item.prop || item.field)">{{item.label}}</el-checkbox>
                      <!-- 新增new提示 -->
                      <NewProjectGuide
                        v-if="item['is_show_new']"
                        postion="显示"
                        :onlyKey="item['new_id']+`${index}`"
                        :newPosition="{top: -15,right: -26}"
                        compoentsName="字段"
                        :initItem="item"
                        :showMenban="item['is_show_new']||''">
                        <span> </span>
                      </NewProjectGuide>
                    </td>
                    <td style="width:24px;">
                      <span class="arrow-top"><i class="iconfont" v-if="index > 0" @click="handleFieldUp(index)">&#xe66b;</i></span>
                    </td>
                    <td style="width:24px;">
                      <span class="arrow-down"><i class="iconfont" v-if="index < this_defaultFiled.length-1" @click="handleFieldDown(index)">&#xe66c;</i></span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="blue_listCheck" type="primary" @click="handleShow()">确 认</el-button>
        <el-button style="background: #C0C4CC;color: #fff;" @click="()=>filedVisible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    defaultFiled: {
      default: [],
      type: Array,
    },
    showArray: {
      default: [],
      type: Array,
    },
    vuex_name: {
      type: String,
    }
  },
  data () {
    return {
      filedVisible: false,
      checkallShow: true,
      showArr: [],
      this_defaultFiled: this.defaultFiled,
      this_defaultFiled_isShow_length:0,
      isShowNew: false
    }
  },
  mounted() {
    const {this_defaultFiled} = this;
    this.this_defaultFiled = this_defaultFiled.filter((item)=>{
      return !item.hide;
    })
  },
  computed: {
    allBase () {
      return Store.state[this.vuex_name].allBase
    },
    is_show_new () {
      this.this_defaultFiled.map(item=> {
        if (item.is_show_new === 1) {
          this.isShowNew = true
        }
      })
      return this.isShowNew
    },
  },
  methods: {
    setScrollHeight(){
      this.$nextTick(()=>{
          let el = this.$refs.listDialog.$el.getElementsByClassName('el-scrollbar__wrap')
          el[0].style.maxHeight=window.screen.availHeight - 80 - 230 +'px'
      })
    },
    //全选
    handleCheckAllShow () {
      if(this.checkallShow){
        this.showArr = this.this_defaultFiled.reduce((res, item) => {
          res.push(item.prop||item.field)
          return res
        }, [])
      }else{
        this.showArr = []
      }
    },
    handleFieldDown (index) {
      var item = this.this_defaultFiled.splice(index,1)[0]
      this.this_defaultFiled.splice(index+1,0,item)
    },
    handleFieldUp (index) {
      var item = this.this_defaultFiled.splice(index,1)[0]
      this.this_defaultFiled.splice(index-1,0,item)
    },
    handleActionShow () {
      this.filedVisible = true
      if (this.allBase) {
        window.ga("send","event", "button", "click", "企业版_全球药物_列表_显示");
        window._paq.push(['trackEvent', 'button', 'click', "企业版_全球药物_列表_显示", ])
      }
    },
    handleShow () {
      let arr = this.this_defaultFiled
      let list = []
      let _this = this;
      this.this_defaultFiled = _.map(arr,item=>{
        if(this.showArr.indexOf(item.prop||item.field) != -1){
          item.checked = true
          list.push(item)
        }else{
          item.checked = false
        }
        // if(item.hide)
        return item
      })
      if (list.length<2) {
        this.$Message.error('请至少勾选两个字段')
        return false
      }
      this.$emit("changeTableHeader", list)
      this.filedVisible = false
    },
  },
  watch:{
    filedVisible:{
      handler(val){
        if(val)this.setScrollHeight()
      }
    },
    showArr(to,now){
      // console.info(to.length , this.this_defaultFiled.length)
      if(to.length >= this.this_defaultFiled.length){
        this.checkallShow = true;
      }else{
        this.checkallShow = false;
      }
    }
  },
  created() {
    _.forEach(this.showArray,(item) => {
      this.showArr.push(item.prop||item.field)
    })
  },

}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
  /deep/.el-dialog__footer{
    .blue_listCheck{
      border-color: white;
    }
  }
  .new-img {
    position: relative !important;
    top: -5px !important;
    left: -16px !important;
    cursor: pointer;
  }

  .global-check {
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
    /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #fff;
      border-color: #ebeef5;
    }
    /deep/ .el-checkbox__inner {
      border-color: #ebeef5;
    }
    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #002fa7;
    }
    /deep/ .el-checkbox__inner::after {
      border-color: #ffa914;
    }

    .el-dialog .el-dialog__header .dialog-header {
      color: #333;
      font-size: 16px;

      &::before {
        background-color: #333;
      }
    }

    .blue_listCheck {
      background-color: #002FA7;
      border-radius: 3px;
    }
  }
</style>
