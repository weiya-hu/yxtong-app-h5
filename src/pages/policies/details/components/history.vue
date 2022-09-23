<template>
  <div class="history">
    <div class="history-txt fleximg">本法变迁</div>
    <div class="history-main" :style="`left:-${left}px`">
      <div class="more-show"></div>
      <div class="triangle" :style="`left:${left+35}px`"></div>
      <div class="history-content">
        <div class="history-list">
          <div class="content-item" v-if="detail.history_version && detail.history_version.length">
          <div class="content-title flexl">本法变迁
            <el-tooltip class="item tooltips-position" effect="light" placement="right">
              <div slot="content">本部法律或行政法规的变迁沿革一览表</div>
              <div class="fleximg problem-img"><img src="../../../../assets/imgs/policy/proplem.png" alt=""> </div>
            </el-tooltip>
            <!-- <div @click="()=>bfShow = !bfShow" class="fleximg putawayimg" :class="bfShow?'putaway-rever':''"><img src="../../../../assets/imgs/policy/putaway.png" alt=""> </div> -->
          </div>
          <div class="bfbq">
            <div class="bf-last flexf">
              <div class="bf-pub_date_cn">{{detail.history_version[0].pub_date_cn}}</div>
              <div class="flextop bf-circular" :class="detail.history_version.length===1?'afternone':''"><img src="../../../../assets/imgs/policy/circular_blue.png" alt=""></div>
              <div class="bf-title">
                <div>{{detail.history_version[0].title}}</div>
                <div @click="()=>{toDetail(detail.history_version[0].code_data_id,detail.history_version[0].code_detail_type);doMatomo('企业版_政策法规_详情页_本法变迁_'+detail.history_version[0].code)}">{{detail.history_version[0].code}}</div>
              </div>
            </div>
            <div class="bf-items">
              <div class="bf-last  flexf" v-for="(item,i) in detail.history_version" :key="i">
                <div class="bf-pub_date_cn">{{item.pub_date_cn}}</div>
                <div class="flextop bf-circular" :class="detail.history_version.length===1?'afternone':''"><img src="../../../../assets/imgs/policy/circular.png" alt=""></div>
                <div class="bf-title">
                  <div @click="()=>{toDetail(item.pr_data_id,item.detail_type);doMatomo('企业版_政策法规_详情页_本法变迁_'+item.title)}">{{item.title}}</div>
                  <div @click="()=>{toDetail(item.code_data_id,item.code_detail_type);doMatomo('企业版_政策法规_详情页_本法变迁_'+item.code)}">{{item.code}}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="history-line"><div></div><div></div><div></div></div>
        <div class="history-bottom"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name:'History',
  props:{
    detail:{
      default:{},
      type:Object
    }
  },
  data() {
    return {
      left:0
    };
  },
  mounted() {
    console.log($('.history-txt').offset().left)
    this.left = $('.history-txt').offset().left-10
  },
  methods: {}
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.flexf{
    display: flex;
  }
.history{
  margin-right: 5px;
  position: relative;
  &:hover{
    .history-main{
      display: flex;
    }
  }
  .history-txt{
    height: 28px;
    background: #9AA4B8;
    border-radius: 2px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    cursor: pointer;
    &:hover{
      background: #DF9008;
    }
  }
  .history-main{
    position: absolute;
    display: none;
    top: 38px;
    left: -554px;
    z-index: 10;
    .triangle{
      width: 0;
      height: 0;
      /* 给定四个边框大小、实线、这里为了隐藏将边款颜色设置为透明色 */
      border: 10px solid transparent;
      /* 给需要留下的边框给定边框颜色，让其显示出来 */
      border-top-color: #FFFFFF;
      transform: rotate(-65deg);
      position: absolute;
      top: -5px;
      left: 585px;
      z-index: 11;
    }
    .more-show{
      width: 75px;
      height: 35px;
      position: absolute;
      top:-10px;
      left: 555px;
    }
    .history-content{
      min-width: 635px;
      background: #FFFFFF;
      box-shadow: 0px 1px 20px 0px rgba(9,20,79,0.3);
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      .history-list{
        padding: 0 20px 10px;
        .content-item{ 
          background: #FFFFFF;
          overflow: hidden;
          .content-title{
            height: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            line-height: 22px;
            border-bottom: 1px solid #EBEEF5;
            position: relative;
            .problem-img{
              width: 16px;
              margin-left: 10px;
              cursor: pointer;
            }
          }
        }
        .bfbq{
          padding: 18px 0 0;
          .bf-last{
            .bf-pub_date_cn{
              width: 80px;
              text-align: right;
              font-size: 14px;
              font-weight: 400;
              color: #5C6973;
              line-height: 20px;
              white-space: nowrap;
            }
            .bf-circular{
              width: 10px;
              margin: 0 20px;
              position: relative;
              top: 2px;
              &>img{
                width: 10px;
                height: 10px;
              }
              &::after{
                content: "";
                width: 1px;
                height:calc(100% - 9px);
                background: #DCDFE6;
                position: absolute;
                top: 14px;
                left: 5px;
              }
            }
            .afternone{
               &::after{
                display: none;
               }
            }
            .bf-title{
              padding-bottom: 20px;
              &>div:nth-child(1){
                font-size: 16px;
                font-weight: 600;
                color: #002FA7;
                line-height: 22px;
                
              }
              &>div:nth-child(2){
                font-size: 12px;
                font-weight: 400;
                color: #5C6973;
                line-height: 17px;
                margin-top: 3px;
                cursor: pointer;
                &:hover{
                  color: #DF9008;
                  text-decoration: underline;
                  text-decoration-color:#DF9008;
                }
              }
            }
          }
          .bf-items{
            .bf-last{
              .bf-title{
                &>div:nth-child(1){
                  font-size: 14px;
                  font-weight: 600;
                  color: #333333;
                  line-height: 20px;
                  cursor: pointer;
                  &:hover{
                    color: #DF9008;
                    text-decoration: underline;
                     text-decoration-color:#DF9008;
                  }
                }
                &>div:nth-child(2):hover{
                  color: #DF9008;
                  text-decoration: underline;
                  text-decoration-color:#DF9008;
                }
              }
            }
          }
          .bf-items>.bf-last:last-child{
            .bf-circular::after{
              display: none;
            }
          }
        }

      }
      .history-bottom{
        width: 100%;
        height: 2px;
        background: #182462;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .history-line{
        &>div:nth-child(1){
          width: 30px;
          height: 1px;
          background: #182462;
          transform: rotate(45deg);
          position: absolute;
          right: -4px;
          top: 2px;
        }
        &>div:nth-child(2){
          width: 50px;
          height: 1px;
          background: #182462;
          transform: rotate(45deg);
          position: absolute;
          right: -14px;
          top: 9px;
        }
        &>div:nth-child(3){
          width: 60px;
          height: 1px;
          background: #182462;
          transform: rotate(45deg);
          position: absolute;
          right: -16px;
          top: 13px;
        }
      }
    }
  }
  
  
}

</style>
