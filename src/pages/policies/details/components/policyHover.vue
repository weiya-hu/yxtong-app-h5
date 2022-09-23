<template>
  <div>
    <div v-if="hoverShow" v-waiting="loading" class="hover-dom fleximg" :style="`top:${top};left:${left};right:${right};bottom:${bottom}`">
    <!-- <div v-waiting="loading" class="hover-dom fleximg" :style="`top:${top};left:${left};right:${right};bottom:${bottom}`"> -->

      <div v-if="policyDetail.title" id="policyDom">
        <div class="title" @click="()=>{toDetail(policyDetail.data_id,policyDetail.detail_type);doMatomo('企业版_政策法规_详情页_正文_'+policyDetail.title)}">{{policyDetail.title}}</div>
        <div class="flexl">
          <div v-if="policyDetail.pub_dept.length" class="flexl detail_pub_dept"><div>发布部门: </div><div class="detail_pub_date_cn length-max" :title="policyDetail.pub_dept.join('，')">{{policyDetail.pub_dept.join('，')}}</div> </div>
          <div v-if="policyDetail.pub_num" class="flexl detail_pub_dept"><div>发文字号: </div><div class="length-max" :title="policyDetail.pub_num">{{policyDetail.pub_num}}</div> </div>
        </div>
        <div class="flexl">
          <div v-if="policyDetail.validity_type_cn" class="flexl detail_pub_dept"><div>效力级别: </div><div class="detail_pub_date_cn">{{policyDetail.validity_type_cn}}</div> </div>
          <div v-if="policyDetail.data_type_cn" class="flexl detail_pub_dept"  ><div>时效性: </div><div :class="typeColorClass[policyDetail.data_type_cn] " class="fleximg">{{policyDetail.data_type_cn}}</div></div>
          
        </div>
        <div v-if="policyDetail.pub_date_cn || policyDetail.imp_date" class="flexl">
          <div class="flexl detail_pub_dept" v-if="policyDetail.pub_date_cn"><div>发布日期: </div><div class="detail_pub_date_cn">{{policyDetail.pub_date_cn}}</div></div>
          <div class="flexl detail_pub_dept" v-if="policyDetail.imp_date"><div>实施日期: </div><div>{{policyDetail.imp_date}}</div></div>
        </div>
        <div class="flexl detail_pub_dept" v-if="policyDetail.tag.length" ><div>标签: </div> 
          <div class="flexl"><div v-for="(item,i) in policyDetail.tag" :key="i" class="detail-tag fleximg" @click="toList(item)">{{item}}</div></div>
        </div>
        <!-- <div v-if="policyDetail.pub_dept.length" class="flextop policy-item"><div>发布部门:</div><div>{{policyDetail.pub_dept.join(',')}}</div></div>
        <div v-if="policyDetail.pub_num" class="flextop policy-item"><div>发文字号:</div><div>{{policyDetail.pub_num}}</div></div>
        <div v-if="policyDetail.pub_date_cn || policyDetail.imp_date" class="flexl">
          <div class="flextop policy-item" v-if="policyDetail.pub_date_cn"><div>发布日期: </div><div class="detail_pub_date_cn">{{policyDetail.pub_date_cn}}</div></div>
          <div class="flextop policy-item" v-if="policyDetail.imp_date"><div>实施日期: </div><div>{{policyDetail.imp_date}}</div></div>
        </div>
        <div v-if="policyDetail.data_type_cn || policyDetail.tag.length" class="flextop">
          <div class="flextop policy-item" v-if="policyDetail.data_type_cn" ><div>时效性: </div><div class="detail_pub_date_cn">{{policyDetail.data_type_cn}}</div></div>
          <div class="flextop policy-item" v-if="policyDetail.tag.length" ><div>标签: </div> 
            <div class="flexl tag-pre"><div v-for="(item,i) in policyDetail.tag" :key="i" class="detail-tag fleximg" @click="toList(item)">{{item}}</div></div>
          </div>
        </div> -->
      </div>
      <div v-else class="fleximg nodata"><div v-show="!loading">暂无数据</div></div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: "policyHover",
  data() {
    return {
      hoverShow:false,
      top:null,
      bottom:null,
      left:null,
      right:null,
      loading:false,
      policyDetail:{},
      isEnter:false,
      typeColorClass:{
        '现行有效':'type-green',
        '失效':'type-red',
        '部分失效':'type-yellow',
        '已被修改':'type-blue',
        '尚未生效':'type-gray',
        '征求意见稿':'type-purple',
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      let _this=this
      $('.policy-title').css('color','#002FA7')
      $('.policy-title').css('cursor','pointer')
      

      $('.policy-title').on('mouseenter',function(){
        _this.hoverShow=true
        //判断当前元素离页面底端的位置，如果太小，悬浮框定位在文字上面
        let top_bottom = window.innerHeight - $(this).offset().top > 250
        top_bottom ?(()=>{
          _this.top= ($(this).offset().top+$(this).height()-40) + 'px'
          _this.bottom = 'auto'
        })():(()=>{
          _this.top= 'auto'
          _this.bottom = ($(this).offset().top-$(this).height())+100 + 'px'
        })()
        //判断当前元素左边界是否占到屏幕可视区的一半，小于一半就用元素的left定位，大于就用right定位
        let flag = $(this).offset().left <= window.innerWidth/2
        flag ? (()=>{_this.left=$(this).offset().left-30+'px';_this.right='auto'})(): (()=>{_this.right=(window.innerWidth-($(this).offset().left+$(this).width())-30)+'px';_this.left='auto'})()
        _this.getPolicy($(this).text()).then(()=>{
          top_bottom ?(()=>{
            _this.top= ($(this).offset().top+$(this).height()-40) + 'px'
            _this.bottom = 'auto'
          })():(()=>{
            _this.top= 'auto'
            _this.bottom = (window.innerHeight-$(this).offset().top ) + 'px'
          })()
        })
      })
      
      $('.policy-title').on('mouseout',function(){
        setTimeout(()=>{
          if(!_this.isEnter){
            _this.hoverShow=false
            _this.policyDetail = {}
          }
        },10)
      })
    })

  },
  watch:{
    
    //悬浮框显示了才能监听悬浮框的事件
    hoverShow(val){
      let _this=this
      if(val){
        this.$nextTick(() => {
          $('.hover-dom').on('mouseenter',function(){
            _this.isEnter=true
          })
          $('.hover-dom').on('mouseleave',function(){
            _this.hoverShow=false
            _this.isEnter=false
            _this.policyDetail = {}
          })
        });
      }
    },
    //修改loading的背景为透明，要在loading出现时才能对其修改样式，css里面直接修改，：deep修改都不起作用
    loading(val){
      if(val){
        this.$nextTick(() => {
          setTimeout(()=>{
            $('.el-loading-mask').css('background-color','rgba(255,255,255,0)')
          },10)
        })
      }
    }
  },
  methods: {
    async getPolicy(title){
      this.loading=true
      const { data,status } = await window
        .Axios({
          method: "get",
          url: `/api/policies/reldetail`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            title,
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
      if ( status === 200 && data.data ) {
        this.loading = false;
        this.policyDetail = data.data
      } else {
        this.loading = false;
      }
    },
    toList(item){
      window.open('/policies/list?tag='+item ,'_blank')
    },
    toDetail(id,type){
      let typeObj={0:'/policies/commondetail/',1:'/policies/lawdetail/',2:'/policies/guiddetail/'}
      window.open(typeObj[type]+id ,'_blank')
    },
    doMatomo(str){
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        str,
      ]); // matomo埋点
    },
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.flextop{
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.flexwrap{
  flex-wrap: wrap;
}
.hover-dom{
  min-width: 560px;
  min-height: 257px;
  padding: 70px 40px 35px;
  overflow: hidden;
  box-sizing: border-box;
  background: #FFFFFF;
  background: url(../../../../assets/imgs/policy/hover.png) no-repeat;
  background-size: cover;
  background-position-y: 20px;
  position: fixed;
  top: 0;
  cursor: pointer;
  &:deep(.el-loading-mask){
    background-color: rgba(255, 255, 255, 0)!important;
  }
  .title{
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
    margin-bottom: 16px;
    cursor: pointer;
    &:hover{
      color: #DF9008;
      text-decoration: underline;
      text-decoration-color:#DF9008;
    }
  }
  .detail_pub_dept{
    margin-bottom: 10px;
    &>div:nth-child(1){
      width: 60px;
      text-align: right;
      font-size: 14px;
      color: #5C6973;
      line-height: 20px;
    }
    &>div:nth-child(2){
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      line-height: 20px;
      margin-left: 10px;
      
    }
    .detail_pub_date_cn{
      width: 170px;
    }
    .length-max{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    &>div.type-green,&>div.type-red,&>div.type-yellow,&>div.type-blue,&>div.type-gray,&>div.type-purple{
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 12px;
      padding: 0 10px;
      background:#90C320;
      border-radius: 2px;
    }
    &>div.type-red{
      background:#C14A27;
    }
    &>div.type-yellow{
      background:#DF9008;
    }
    &>div.type-blue{
      background:#002FA7;
    }
    &>div.type-gray{
      background:#9AA4B8;
    }
    &>div.type-purple{
      background:#8541D4;
    }
    .detail-tag{
      height: 20px;
      padding: 0 10px;
      background: #EBEEF5;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 400;
      color: #5C6973;
      margin:0 5px 5px 0;
      cursor: pointer;
      &:hover{
        background: #DF9008;
        color: #FFFFFF;
      }
    }
  }
  .policy-item{
    margin-bottom: 10px;
    &>div:nth-child(1){
      width: 60px;
      font-size: 14px;
      font-weight: 400;
      color: #5C6973;
      line-height: 20px;
      text-align: right;
      margin-right: 5px;
    }
    &>div:nth-child(2){
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
    .detail_pub_date_cn{
      width: 210px;
    }
    .detail-tag{
      height: 20px;
      padding: 0 10px;
      background: #EBEEF5;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 400;
      color: #5C6973;
      margin:0 5px 5px 0;
      cursor: pointer;
      &:hover{
        background: #DF9008;
        color: #FFFFFF;
      }
    }
  }
  .tag-pre{
    max-width: 200px;
    flex-wrap: wrap;
  }
  
}
.nodata{
  font-size: 14px;
}
</style>
