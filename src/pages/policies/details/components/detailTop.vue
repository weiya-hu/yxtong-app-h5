<template>
  <div v-if="detail.title">
    <div class="flexr top-router">
      <div v-for="item in routerLists" :key="item.path" class="flexr">
        <router-link :to="item.path" class="link">{{item.meta.title}}</router-link>
        <div>></div>
      </div>
      <div class="link-cur" v-if="curentRoute.meta">{{curentRoute.meta.title}}</div>
    </div>
    
    <div class="detail_top">
      <div class="detail-title">{{detail.title}}</div>
      <div class="title-line"></div>
      <div class="flexl">
        <div v-if="detail.pub_dept.length" class="flexl detail_pub_dept"><div>发布部门: </div><div class="detail_pub_date_cn length-max" :title="detail.pub_dept.join('，')">{{detail.pub_dept.join('，')}}</div> </div>
        <div v-if="detail.pub_num" class="flexl detail_pub_dept"><div>发文字号: </div><div class="length-max" :title="detail.pub_num">{{detail.pub_num}}</div> </div>
      </div>
      <div class="flexl">
        <div v-if="detail.validity_type_cn" class="flexl detail_pub_dept"><div>效力级别: </div><div class="detail_pub_date_cn">{{detail.validity_type_cn}}</div> </div>
        <div v-if="detail.data_type_cn" class="flexl detail_pub_dept"  ><div>时效性: </div><div :class="typeColorClass[detail.data_type_cn] " class="fleximg">{{detail.data_type_cn}}</div></div>
        
      </div>
      <div v-if="detail.pub_date_cn || detail.imp_date" class="flexl">
        <div class="flexl detail_pub_dept" v-if="detail.pub_date_cn"><div>发布日期: </div><div class="detail_pub_date_cn">{{detail.pub_date_cn}}</div></div>
        <div class="flexl detail_pub_dept" v-if="detail.imp_date"><div>实施日期: </div><div>{{detail.imp_date}}</div></div>
      </div>
      <div class="flexl detail_pub_dept" v-if="detail.tag.length" ><div>标签: </div> 
        <div class="flexl"><div v-for="(item,i) in detail.tag" :key="i" class="detail-tag fleximg" @click="toList(item)">{{item}}</div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'DetailTop',
  props:{
    detail:{
      default:{},
      type:Object
    }
  },
  data() {
    return {
      routerLists:[],
      curentRoute:{},
      typeColorClass:{
        '现行有效':'type-green',
        '失效':'type-red',
        '部分失效':'type-yellow',
        '已被修改':'type-blue',
        '尚未生效':'type-gray',
        '征求意见稿':'type-purple',
      }
    };
  },
  mounted() {
    this.routerLists = this.$route.matched.splice(1,this.$route.matched.length-2)
    this.curentRoute = this.$route.matched.pop()
  },
  watch:{
    $route(to,from)  {
      this.routerLists  = to.matched.splice(1,this.$route.matched.length-2)
      this.curentRoute = to.matched.pop()
    }
  },
  methods: {
    toList(item){
      window.open('/policies/list?tag='+item ,'_blank')
    },
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.top-router{
  margin-bottom: 10px;
  font-size: 14px;
  letter-spacing: 1px;
  .link{
    font-size: 14px;
    color: #DF9008;
    line-height: 20px;
    letter-spacing: 1px;
  }
}
.detail_top{
  padding: 10px 20px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px 0px rgba(9,20,79,0.1);
  border-radius: 3px;
  .detail-title{
    font-size: 18px;
    font-weight: 600;
    color: #182462;
    line-height: 25px;
  }
  .title-line{
    width: 100%;
    height: 1px;
    background: #EBEEF5;
    margin: 12px 0 17px ;
    position: relative;
    &::before{
      content: "";
      width: 100px;
      height: 4px;
      background: #182462;
      border-radius: 2px;
      position: absolute;
      top: -1px;
      left: 0;
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
      width: 515px;
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
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      color: #5C6973;
      margin-right: 5px;
      line-height: 12px;
      &:hover{
        background: #DF9008;
        color: #FFFFFF;
      }
    }
  }
}

</style>
