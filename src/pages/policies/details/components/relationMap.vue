<template>
    <!-- <div class="relation" :style="`height:${250+childNode.length*10}px`"> -->
    <div class="relation">
      <div @click="relationShow = !relationShow" class="relation-txt">位阶关系</div>
      <div v-if="relationShow" class="relation-main">
        <HeaderPolicies></HeaderPolicies>
        <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick" :on-line-click="onLineClick" :on-node-expand="onNodeExpand" />
      </div>
      <div class="flexl relation-bottom" v-if="relationShow">
        <div class="fleximg warnimg"><img src="../../../../assets/imgs/policy/warn.png"></div>
        <div class="warn-txt">法律法规的位阶关系图，上位法是下位法的效力依据，下位法不得与上位法的规定相抵触</div>
      </div>
    </div>
 </template>

 <script>
 import RelationGraph from 'relation-graph'
 import HeaderPolicies from "@/components/layouts/policies/header-policies";
 export default {
   name: 'relationMap',
   components: { RelationGraph,HeaderPolicies, },
   props:{
    relation:{
      default:{},
      type:Object
    },
    title:{
      default:"",
      type:String
    },
    isShow:{
      default:false,
      type:Boolean
    }
   },
   data() {
     return {
      relationShow:false,
       graphOptions: {
         allowSwitchLineShape: true,
         allowSwitchJunctionPoint: true,
         defaultJunctionPoint: 'tb',
         defaultFocusRootNode: false,
         allowShowMiniToolBar:false,
         defaultLineShape:3,
         defaultNodeShape:1,
         disableZoom:false,
         disableDragNode:true,
         moveToCenterWhenResize:true,
         allowShowZoomMenu:true,
         allowShowMiniToolBar:true,
         allowSwitchLineShape:false,
         allowSwitchJunctionPoint:false,
         layouts:[
            {
              'label': '树',
              'layoutName': 'tree',
              'layoutClassName': 'seeks-layout-center',
              'from': 'top',
              // 通过这4个属性来调整 tree-层级距离&节点距离
              'min_per_width':'210',
              'max_per_width': '210',
              'min_per_height': '250',
              'max_per_height':'250',
              'levelDistance': '' // 如果此选项有值，则优先级高于上面那4个选项
            }
          ],
         // 这里可以参考"Graph 图谱"中的参数进行设置
       },
       childNode:[],
       nodeData:{},
       patentNode:[],
       nodes:[],
       links:[],
     }
   },
   mounted() {
     
    
    
   },
   watch:{
    isShow(val){
      if(val){
        // this.$refs.seeksRelationGraph.refresh()
        // this.patentNode.length &&  $('.rel-map-canvas').css({'position':'relative','left':'550px'})
        // this.$refs.seeksRelationGraph.downloadAsImage()
      }
    },
    relationShow(val){
      if(val){
        this.$nextTick(()=>{
          this.showSeeksGraph(this.getNodes())
          this.$refs.seeksRelationGraph.refresh()
          this.relation.patent.length &&  $('.rel-map-canvas').css({'position':'relative','top':'150px'})
          console.log($('.c-mini-toolbar>div:nth-child(1)'))
          $('.c-mini-toolbar>div:nth-child(1)').css('display','none')
          $('.c-mini-toolbar>div:last-child').css('display','none')

          let dom = $('<div class="c-mb-button"><div class="exit-img-pre"><div class="exit-img"></div></div>退出</div>')
          $('.c-mini-toolbar').prepend(dom)
          $('.c-mini-toolbar>div:nth-child(1)').on('click',()=>{
            this.relationShow = false
          })
          
          setTimeout(()=>{
            $('.c-btn-open-close>span').css('background-color','#182462')
          },10)
          
        })
        // this.$refs.seeksRelationGraph.refresh()
      }
    }
   },
   methods: {
    
     showSeeksGraph(nodes) {
       var __graph_json_data = {
        //  rootId: this.relation.patent.length?nodes.arr[1].id:'main',
          rootId: 'main',
         nodes:nodes.arr,
         links:nodes.links,
        //  nodes: [
        //    { id: 'a', text: 'A', styleClass:'node-style'},
        //    { id: 'b', text: 'B', styleClass:'node-style' },
        //    { id: 'c', text: 'C', styleClass:'node-style'},
        //    { id: 'e', text: 'E', styleClass:'node-style'},
        //    { id: 'd', text: 'd',}
        //  ],
        //  links: [
        //    { from: 'a', to: 'b',  color: '#333333' },
        //    { from: 'a', to: 'c',color: '#333333'},
        //    { from: 'a', to: 'e',color: '#333333'},
        //     { from: 'd', to: 'a',color: '#333333'},
        //   //  { from: 'b', to: 'e',}
        //  ]
       }
       // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置 
       this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
         // Called when the relation-graph is completed 
       })
     },
     getNodes(){
      let arr = [],links=[],array=[],dataObj={},patentNode=[];
      let item={ id: 'main', text: this.title, styleClass:'node-style-main'}
      arr.push(item)
      this.relation.patent.length && (()=>{
        this.relation.patent.forEach((element,i) => {
          let itm = element.patent.length?{ id: 'patent'+i, text: element.title, styleClass:'node-style-patent',expandHolderPosition:'top',expanded:false,data:element}:{ id: 'patent'+i, text: element.title, styleClass:'node-style-patent'}
          let link = {from:'patent'+i,to:'main',color:'#C5C3CC'}
          dataObj['patent'+i] = element
          arr.push(itm)
          patentNode.push(itm)
          links.push(link)
        });
      })()
      this.relation.children.length && (()=>{
        this.relation.children.forEach((element,i) => {
          let it = element.children.length?{ id: 'children'+i, text: element.title, styleClass:'node-style-child',expandHolderPosition:'bottom',expanded:false,data:element}:{ id: 'children'+i, text: element.title, styleClass:'node-style-child'}
          let link = {from:'main',to:'children'+i,color:'#C5C3CC'}
          dataObj['children'+i] = element
          arr.push(it)
          array.push(it)
          links.push(link)
        });
      })()
      this.childNode = array
      this.patentNode = patentNode
      this.nodeData=dataObj
      this.nodes = arr
      this.links = links
      return {arr,links}
     },
    onNodeExpand(node,e){
      let dataObj=JSON.parse(JSON.stringify(this.nodeData))
      if(dataObj[node.id+'_expanded']){
        return
      }
      let arr=[],links=[]
      console.log(node.data.children)
      if(node.data.children && node.data.children.length){
        node.data.children.forEach((ele,j)=>{
            let it = { id: node.id+'_'+j, text: ele.title, styleClass:'node-style-child'}
            let link = {from:node.id,to:node.id+'_'+j,color:'#C5C3CC'}
            dataObj[node.id+'_'+j] = ele
            dataObj[node.id+'_expanded'] = true
            arr.push(it)
            // patentNode.push(it)
            links.push(link)
          })
        console.log(arr,links)
        this.nodeData=dataObj
        this.$refs.seeksRelationGraph.appendJsonData({nodes:arr,links:links})
        this.$refs.seeksRelationGraph.refresh()
        this.$refs.seeksRelationGraph.focusNodeById(node.id)
      }
      if(node.data.patent && node.data.patent.length){
        node.data.patent.forEach((ele,j)=>{
            let it = { id: node.id+'_'+j, text: ele.title, styleClass:'node-style-patent'}
            let link = {from:node.id+'_'+j,to:node.id,color:'#C5C3CC'}
            dataObj[node.id+'_'+j] = ele
            dataObj[node.id+'_expanded'] = true
            arr.push(it)
            // patentNode.push(it)
            links.push(link)
          })
        console.log(arr,links)
        this.nodeData=dataObj
        this.$refs.seeksRelationGraph.appendJsonData({nodes:arr,links:links})
        this.$refs.seeksRelationGraph.refresh()
        $('.rel-map-canvas').css({'top':'0'})
        this.$refs.seeksRelationGraph.focusNodeById(node.id)
      }
    },
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject,)
      let data = this.nodeData[nodeObject.id]
      this.doMatomo('企业版_政策法规_详情页_位阶关系_'+data.title)
      this.toDetail(data.data_id,data.detail_type)
    },
     onLineClick(lineObject, $event) {
       console.log('onLineClick:', lineObject)
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

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
.c-mb-button{
  text-align: center;
  .exit-img-pre{
    padding: 5px 0;
  }
  .exit-img{
    width: 16px;
    height: 16px;
    margin: 0 auto ;
    
    background: url(../../../../assets/imgs/policy/exit.png) no-repeat;
  }
  &:hover{
    background: #DF9008 !important;
    border-top: none !important;
    color: #FFFFFF;
    .exit-img{
      background: url(../../../../assets/imgs/policy/exit_white.png) no-repeat;
    }
  }
}
.relation{
  cursor: pointer;
  .relation-txt{
    height: 28px;
    padding: 0 10px;
    background: #9AA4B8;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 28px;
    &:hover{
      background: #DF9008;
    }
  }
  .relation-main{
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
  }
  .relation-bottom{
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
    .warnimg{
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
    .warn-txt{
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
  }
}
.node-style-main{
  padding: 4px 25px !important;
  background: #182462!important;
  border: none!important;
  border-radius: 3px!important;
  &>div{
    &>span{
      line-height: 20px;
      color: #FFFFFF!important;
      font-size: 14px!important;
    }
  }
}
.node-style-patent{
  padding: 4px 25px !important;
  background: #EBEEF5!important;
  border: none!important;
  border-radius: 3px!important;
  cursor: pointer!important;
  
  &>div{
    width: 153px;
    &>span{
      line-height: 20px;
      color: #333333!important;
      font-size: 14px!important;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.node-style-child{
  padding: 4px 15px !important;
  background: #FFFFFF!important;
  border: 1px solid #182462!important;
  border-radius: 3px!important;
  cursor: pointer!important;
  &>div{
    width: 153px;
    &>span{
      line-height: 20px;
      color: #182462!important;
      font-size: 14px!important;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 20;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
