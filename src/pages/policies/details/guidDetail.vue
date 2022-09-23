<template>
  <div class="guid-detail" :style="`padding-top:${showPromtNotice?88:58}px`">
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <div v-else class="detail-son">
      <div class="detail-top" ref="detailTop">
        <DetailTop :detail="detail"/>
      </div> 
      <div class="guid-detail-content">
        <div v-if="detail.attachment_en_cn.length>1" class="attach">
          <div v-for="(item,i) in detail.attachment_en_cn" :key="i" class="attachment" :class="currentFileIndex === i?'attach-active':''" @click="currentFileIndex=i">
            <div class="fleximg attach-label">附件{{i+1}}</div>
            <div class="attach-title flexl">{{item.title}}</div>
          </div>
        </div>
        <div class="guid-detail-trans" :class="detail.attachment_en_cn[currentFileIndex].zh?'flexb':'fleximg'">
          <div>原文</div>
          <div class="flexl"  v-if="detail.attachment_en_cn[currentFileIndex].zh && detail.attachment_en_cn[currentFileIndex].en">机器翻译
            <el-tooltip class="item tooltips-position" effect="light" placement="right" popper-class="tooltip-guid-detail">
              <div slot="content" >此文档由机器翻译提供，可能存在错误，如有疑问，点击资询<span class="online" @click="toOnline">在线客服</span></div>
              <div  class="fleximg problem-img"><img src="../../../assets/imgs/policy/proplem.png" alt=""> </div>
            </el-tooltip>
          </div>
        </div>
        <div class="fleximg guid-doc">
          <!-- <iframe :src="detail.attachment_en_cn[currentFileIndex].cn" type="application/pdf" width="100%" height="100%"></iframe> -->
            <iframe :src="`/static/pdf/web/viewer.html?file=${detail.attachment_en_cn[currentFileIndex].en || detail.attachment_en_cn[currentFileIndex].zh}`" width="100%" height="100%"></iframe>
            <iframe v-if="detail.attachment_en_cn[currentFileIndex].zh && detail.attachment_en_cn[currentFileIndex].en" :src="`/static/pdf/web/viewer.html?file=${detail.attachment_en_cn[currentFileIndex].zh}`" width="100%" height="100%" ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoadingGif from "@/components/common/globalCom/loading-gif"
import DetailTop from './components/detailTop.vue'
export default {
  components: {
    LoadingGif,
    DetailTop,
  },
  data(){
    return{
      isLoading:true,
      detail:{},
      currentFileIndex:0,
    }
  },
   computed: {
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice, 
    }),
  },
  mounted() {
    // this.getDetail('c6103770-1e8e-11ec-bd53-00163e0e202a')
    this.getDetail()
  },
  methods: {
    async getDetail(id){
      const { data } = await window
        .Axios({
          method: "get",
          url: `/api/policies/detail`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            data_id:id || this.$route.params.id
          }
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
      if ( data.code === 200 && data.data ) {
        this.detail = data.data
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    },
    toOnline(){
      window.open('https://1537030.udesk.cn/im_client/?web_plugin_id=103301&agent_id=208981&group_id=300631&c_name=lt1&c_desc=%E5%86%85%E9%83%A8%E4%B8%93%E7%94%A8&c_email=374145071@qq.com&nonce=dd18e804-b72d-4bba-ba68-bd3f10f45261&timestamp=1661239007914&web_token=374145071@qq.com&signature=C4768869C9478136C3FB03A594B8C4AF6CBED9D0','_blank')
    }
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.guid-detail{
  padding: 10px;
  div{box-sizing: border-box;}
  font-family: PingFangSC-Medium, PingFang SC;
  .flexb{
    display: flex;
    justify-content:space-around;
    align-items: center;
  }
  .detail-son{
    .detail-top{
      margin-bottom: 10px;
      // background: #ffffff;
    }
    .guid-detail-content{
      background: #ffffff;
      padding: 10px 20px 20px;
      .attach{
        border-radius: 3px;
        border: 1px solid #EBEEF5;
        border-bottom: none;
        overflow: hidden;
        margin-bottom: 10px;
        .attachment{
          display: flex;
          min-height: 28px;
          width: 100%;
          cursor: pointer;
          .attach-label{
            width: 120px;
            background: #EBEEF5;
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            line-height: 20px;
            border-bottom:1px solid #FFFFFF;
          }
          .attach-title{
            width: calc(100% - 120px);
            padding: 0 24px;
            flex-wrap: wrap;
            font-size: 14px;
            font-weight: 600;
            color: #002FA7;
            line-height: 20px;
            border-bottom:1px solid #EBEEF5;
          }
          &:hover{
            .attach-title{
              font-size: 16px;
              font-weight: 500;
              color: #DF9008;
              line-height: 22px;
            }
          }
        }
        .attach-active{
          .attach-title{
            font-size: 16px;
            font-weight: 500;
            color: #DF9008;
            line-height: 22px;
          }
        }
      }
      .guid-detail-trans{
        height: 30px;
        background: #EBEEF5;
        &>div{
          font-size: 14px;
          font-weight: 600;
          color: #182462;
          line-height: 20px;
          .problem-img{
            width: 16px;
            margin-left: 5px;
          }
          .online{
            color:#182462 ;
            text-decoration: #182462;
            cursor: pointer;
          }
        }
      }
      .guid-doc{
        height: calc(100vh - 78px);
        padding: 20px;
        border: 1px solid #EBEEF5;

      }
    }
  }
}
</style>
