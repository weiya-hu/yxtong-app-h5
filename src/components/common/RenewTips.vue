/*
  续约提示弹窗
 */
 <template>
   <div class="RenewTips">
      <div class="divRenew" v-if="RenewTips && guideRenewsFlags && videoFlag"></div>
      <div class="jiantRenew"  v-if="RenewTips && guideRenewsFlags && videoFlag">
        <img src="/static/imgs/renew/scope1.png" />
      </div>

    <el-dialog class="dialog-actions justOne"  @close="closeRenew" :modal-append-to-body=false :close-on-click-modal=false :visible="RenewTips&& guideRenewsFlags && videoFlag">
      <div slot="title" class="renew_h"></div>
      <div class="renew">
        <div class="renew_l">
          <img src="/static/imgs/renew/yaoxiaoz.png" alt="">
        </div>
        <div class="renew_r">
          <div class="renew_r1">
            您已经成为
            <span class="color1"> 药智数据企业版VIP </span>
            <strong class="color2"> {{tipsTime.startday}} </strong> 天了！
          </div>
          <div class="renew_r2">剩余VIP权限 <strong class="color2"> {{tipsTime.endday}} </strong>  天</div>
          <div class="renew_r3">
            <p>为保证正常使用，您可以提前联系客服，准备续约流程。</p>
            <p>同时，也期待您反馈使用中的任何问题。 </p>
            <p>客服热线：<span class="color1">400-678-0778</span></p>
          </div>
        </div>
      </div>
      <div slot="footer" class="renew_b">
        <div class="renew_b1">
          <el-button @click="onRenew" type="primary">我要续约</el-button>
          <el-button @click="RemoteLoginClose" >反馈问题</el-button>
        </div>
        <div class="renew_b2">
          <span @click="vipoverduemsg">一周内不再提醒</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible1" :modal-append-to-body="false" width="820px" >
      <div slot="title" class="dialog-header">
        问题反馈
      </div>
      <DialogFeedback @closeDialog="closeDialogs"></DialogFeedback>
    </el-dialog>
    <RenewBase :filedVisible="filedVisible" @closeD="filedVisible=false" @closeDs="closeDsClick" />
   </div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from "vuex"
  import DialogFeedback from '@/components/common/dialog-feedback'
  import RenewBase from '@/pages/usercenter/renew/base'

  export default {
    components:{
      DialogFeedback,
      RenewBase
    },
    data() {
      return {
        guideRenewsFlags: false,
        filedVisible: false,
        videoFlag: false,
        dialogFormVisible1: false,
        RenewTips: false,
        tipsTime: {
          endday: "",
          startday: ""
        }
      }
    },
    mounted(){

    },
    computed:{
      ...mapState({
        accountData:state => state.UserCenter.accountData,
        stepNumHome: state => state.UserCenter.stepNumHome,
        guideFlagsRenew: state => state.UserCenter.guideFlagsRenew,
      }),
    },
    watch: {
      RenewTips: {
        handler(val) {
          if(val){
            this.$nextTick(() => {
              $('.divRenew').width(parseInt($('.la-header-dropdown').outerWidth())+20)
            })
          }
        },
        immediate: true
      },
      guideRenewsFlags: {
        handler(val) {
          if(val){
            this.$nextTick(() => {
              $('.divRenew').width(parseInt($('.la-header-dropdown').outerWidth())+20)
            })
          }
        },
        immediate: true
      },
      videoFlag(val) {
        if(val){
          this.$nextTick(() => {
            $('.divRenew').width(parseInt($('.la-header-dropdown').outerWidth())+20)
          })
        }
      },
      accountData: {
        handler(val) {
          this.getDataUser()
        },
        // deep:true
      },
      $route (to, from) {
        let toPath = to.path
        let fromPath = from.path
      },
      stepNumHome: {
        handler(val) {
          if(val){
            this.videoFlag = true
          }
        },
        immediate:true
      },
      guideFlagsRenew: {
        handler(val) {
          if(val){
            this.guideRenewsFlags = true
          }
        },
        immediate:true
      },
    },
    methods:{
      closeDialogs () {
        this.dialogFormVisible1=false
        this.RenewTips=false
        Store.dispatch("UserCenter/renewTipsAPPA", true)
      },
      closeDsClick () {
        this.filedVisible=false
        this.RenewTips=false
        Store.dispatch("UserCenter/renewTipsAPPA", true)
      },
      getDataUser () {
        if(this.accountData.uid && this.$route.path === "/home"){
          if([62,63,64,65,84,85,86].some(e => e === this.accountData.grade_id)){
            Store.dispatch("UserCenter/renewTipsAPPA", true)
            return
          }
          this.vipoverdue(this.accountData.uid)
        }
      },
      onRenew () {
        this.filedVisible = true
      },

      closeRenew () {
        this.RenewTips = false
        Store.dispatch("UserCenter/renewTipsAPPA", true)
      },
      RemoteLoginClose () {
        this.dialogFormVisible1 = true
      },
      vipoverduemsg () {
        window.Axios({
          method: 'get',
          url: '/api/user/vipoverduemsg',
          params: {
            uid: this.accountData.uid
          }
        }).then(res => {
          if(res.data.code === 200){
            this.RenewTips = false
            Store.dispatch("UserCenter/renewTipsAPPA", true)
          }
        })
      },
      vipoverdue (uid) {
        window.Axios({
          method: 'get',
          url: '/api/user/vipoverdue',
          header: {
            'Cache-Control': 'no-cache'
          },
          params: {
            uid,
            timestap: (new Date()).getTime()
          }
        }).then(res => {

          if(res.data.code === 200){
            let status = res.data.data.status
            this.RenewTips = status.status === 1 ? true : false // 0不提醒 1提醒
            this.tipsTime = status

            Store.dispatch("UserCenter/renewTipsAPPA", status.status === 0 ? true : false)
            // if(this.vueGetCookie('guide-close') === '1'){
            //   Store.dispatch("UserCenter/guideFlagsRenewA", true)
            //   this.guideRenewsFlags = true
            // }
          }
        })
      }
    },
    created () {
      this.getDataUser()
    }
  }
 </script>
 <style lang="less" scoped>
    @import "~@/assets/less/var.less";
    .RenewTips{
      /deep/.v-modal {
        z-index: 2999 !important;
        background: transparent !important;
      }
      /deep/.el-dialog__wrapper{
        z-index: 3000 !important;
      }
      .justOne{
        /deep/.el-dialog {
          z-index: 3000 !important;
          border-radius: 20px!important;
          width: 600px;
          // height: 279px;
          box-shadow: -3px 2px 16px 0px rgba(188, 188, 188, .6);
        }
        /deep/.el-dialog__header{
          padding: 0;
          // height: 0;
          // line-height: 0;
          // border: none;
        }
        /deep/.el-dialog__header:after{
          height: 0;
        }
        /deep/.el-dialog__footer{
          padding: 10px 20px 20px;
          border-top: none;
        }
      }
      .jiantRenew{
        position: fixed;
        right: 70px;
        top: 50px;
        width: 580px;
        height: 400px;
        z-index: 3000;
        >img{
          height: 100%;
          width: 100%;
        }
      }
      .divRenew{
        position: fixed;
        right: 0;
        top: 0;
        height: 48px;
        width: 200px;
        box-shadow: 0 0 0 10000px rgba(102,102,102, .4);
        z-index: 3000;
      }
      .renew{
        display: flex;
        justify-content: center;
        align-items: center;

        .renew_r{
          margin-left: 20px;
        }

        .renew_r1,
        .renew_r2{
          font-size: 15px;
          line-height: 1.5;

        }
        .renew_r3{
          margin-top: 10px;

          >p{
            margin: 0;
            line-height: 2;
            font-size: 13px;
          }
        }
      }

      .renew_b1{
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

      }

      .renew_b2{
        margin-top: 15px;
        text-align: right;
        >span{
          color: @Orange;
          cursor: pointer;
        }
      }


      .color1{
        color: @Blue;
      }
      .color2{
        color: @Orange;
      }

    }
 </style>
