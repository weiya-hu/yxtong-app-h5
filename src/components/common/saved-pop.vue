<template>
  <div class="la-saved">
    <table class="la-table">
      <tr>
        <span class="name">条件名称&nbsp;&nbsp;</span>
        <el-input v-model="value"></el-input>
        <!-- <span class="none-warn">请输入名称</span>
        <span class="over-warn">最多20个字符</span> -->
      </tr>
    </table>
    <div slot="footer" class="dialog-footer">
       <el-button @click="handleSaved" type="primary" round>提 交</el-button>
       <el-button @click="closeSavedPop" round>取 消</el-button>
    </div>
    <div class="alert">
      <!-- 保存成功 -->
      <div class="right right1" @click="hideRightAlerts()">
        <span>保存成功</span>
      </div>
      <!-- 请输入名称 -->
      <div class="wrong wrong1" @click="hideWrongAlerts()">
        <span>请输入名称</span>
      </div>
      <!-- 最多20个字符 -->
      <div class="wrong wrong2" @click="hideWrongAlerts()">
        <span>最多20个字符</span>
      </div>
      <!-- 保存失败，条件已保存 -->
      <div class="wrong wrong3" @click="hideWrongAlerts()">
        <span>保存失败，条件已保存</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    props: {
      vuex_name: { // 必须！
        type: String,
        default: ''
      }
    },
    components: {

    },
    data () {
      return {
        dbname: this.$route.path.split('/')[1],
        value: '',
      }
    },
    computed:{
      // ...mapState({
      //   storeState: state => state[this.vuex_name]
      // }),
      storeState () {
        return Store.state[this.vuex_name]
      },
    },
    watch: {
      $route () {
        this.dbname = this.$route.path.split('/')[1]
      },
    },
    created () {

    },
    methods: {
      toggleAlert(cls) { // 切换alert提示
        $('.alert').fadeIn()
        $('.alert').find('.' + cls).fadeIn()
        setTimeout(() => {
          $('.alert').fadeOut()
          $('.alert').find('.' + cls).fadeOut()
        }, 2000)
      },
      hideRightAlerts() {
        $('.alert').hide()
        this.$emit("closeSavedPop")
      },
      hideWrongAlerts() {
        $('.alert').hide()
      },
      theSizeOf(str, charset){
        var total = 0,
        charCode,
        i,
        len;
        charset = charset ? charset.toLowerCase() : '';
        if(charset === 'utf-16' || charset === 'utf16'){
          for(i = 0, len = str.length; i < len; i++){
            charCode = str.charCodeAt(i);
            if(charCode <= 0xffff){
            total += 2;
            }else{
            total += 4;
            }
          }
        }else{
          for(i = 0, len = str.length; i < len; i++){
            charCode = str.charCodeAt(i);
            if(charCode <= 0x007f) {
            total += 1;
            }else{
            total += 2;
            }
          }
        }
        console.log(total);

        return total;
      },
      initSaved () {
        console.info(this.dbname)
        let api = this.dbname==='qxba' ? 'qixiebeian' : this.dbname
        window.Axios({
          method: 'get',
          url: '/api/'+ api +'/savewherelist',
          params: {
            accesstoken: this.vueGetCookie("accesstoken"),
          }
        }).then(res => {
          if (res.data.code == 200 && res.data.data) {
            let data = res.data.data
            this.storeState.saved_options = data
          }
        }).catch(err => {
          console.log(err)
        })
      },
      handleSaved () {
        let charLen = this.theSizeOf(this.value)
        let api = this.dbname==='qxba' ? 'qixiebeian' : this.dbname
        if (this.value && charLen <= 20) {
          // 处理url，去除其中的order，page，pageSize
          let url_obj = this.storeState.search_api_param
          _.unset(url_obj, "order")
          _.unset(url_obj, "page")
          _.unset(url_obj, "pageSize")
          let checkIsSaved = false
          
          window.Axios({
            method: 'get',
            url: '/api/'+ api +'/savewhere',
            params: {
              accesstoken: this.vueGetCookie("accesstoken"),
              wherename: this.value,
              url: Qs.stringify(url_obj),
            }
          }).then(res => {
            if (res.data.code == 200) {
              checkIsSaved = true
              this.toggleAlert('right1')
              setTimeout(() => {
                this.$emit("closeSavedPop")
              }, 2000)
            } else if (res.data.code == 202) {
              this.toggleAlert('wrong3')
            }
          }).catch(err => {
            console.log(err)
          }).then(() => {
            if (checkIsSaved) {
              this.initSaved()
            }
          })

        } else if (!this.value) {
          this.toggleAlert('wrong1')
        } else if (charLen > 20) {
          this.toggleAlert('wrong2')
        }
      },
      closeSavedPop () {
        this.value = ""
        this.$emit("closeSavedPop")
      },
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/var.less";
  .la-saved{
    padding: 20px 20px 20px 80px;
    position: relative;
    table {
      width: 100%;
      tr {
        width: 100%;
        // display: flex;
        padding: 5px 0px;
        // justify-content: flex-start;
        // align-items: center;
        // flex-wrap: nowrap;
        span {
          height: 30px;
          line-height: 30px;
        }
        .name {
          width: 80px;
          float: left;
        }
        .el-input {
          width: 250px;
          padding-right: 10px;
          float: left;
        }
        .none-warn {
          color: Orange;
          width: 90px;
          display: none;
          float: left;
        }
        .over-warn {
          color: Orange;
          width: 90px;
          display: none;
          float: left;
        }
      }
    }
    .ctrl{
      .btn{
        padding: 1px;
        margin: 0px 5px;
        color: @PrimaryColor;
        border: 1px solid @PrimaryColor;
        cursor: pointer;
      }
    }
    .alert {
      z-index: 9999;
      display: none;
      width: 175px;
      height: 105px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -52.5px;
      margin-left: -87.5px;
      .right {
        position: relative;
        width: 175px;
        height: 105px;
        background: url("/static/imgs/usercenter/alert/right.png") no-repeat;
        span {
          position: absolute;
          bottom: 22px;
          left: 0px;
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      }
      .wrong {
        position: relative;
        width: 175px;
        height: 105px;
        background: url("/static/imgs/usercenter/alert/wrong.png") no-repeat;
        span {
          position: absolute;
          bottom: 22px;
          left: 0px;
          width: 100%;
          text-align: center;
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      }
      div {
        display: none;
      }
    }
    /deep/.el-input__inner{
      height: 30px;
      line-height: 30px;
      border-radius: 0px;
    }
    .dialog-footer{
      .el-button.is-round{
        width: 150px;
        padding: 7px 40px;
      }
    }
  }
</style>