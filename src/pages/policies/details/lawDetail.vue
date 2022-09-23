<template>
  <div class="law-detail" :style="`padding-top:${showPromtNotice?88:58}px`">
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <div v-else class="detail-son">
      <div class="detail-top" ref="detailTop">
        <DetailTop :detail="detail"/>
      </div> 
      <div class="check flexl" :class="{'button-box-fixed':isFixed}" :style="`top:${showPromtNotice?78:48}px`">
        <div class="check-btns flexl">
          <div @click="()=>{isExplain=1;doMatomo('企业版_政策法规_详情页_解读版_解读版')}" class="fleximg" :class="isExplain?'check-btns-active':''">解读版</div>
          <div @click="()=>{isExplain=0;doMatomo('企业版_政策法规_详情页_原文_原文')}" class="fleximg"  :class="!isExplain?'check-btns-active':''">原文</div>
        </div>
        <!-- <SearchText :text.sync='text' :originalText='originalText' /> -->
        <!-- <searchVue :className="isExplain? '.content-txt':'.content-yuanw'" > -->
        <!-- <searchVue className=".content-txt" /> -->
        <SearchText :text.sync='text' :originalText='originalText' :scrollTop='scrollTop' :catalogue='detail.catalogue'/>
        <div class="flexl his-pre">
          <History :detail="detail" v-if="detail.history_version && detail.history_version.length"/>
          <RelationMap :relation="detail.hierarchical_relation" :title="detail.title" v-if="detail.hierarchical_relation && (detail.hierarchical_relation.patent.length || detail.hierarchical_relation.children.length)"></RelationMap>
        </div>
        
      </div>
      
      <div class="main flexb">
        <div id="menu" class="menu" :class="{'menu-box-fixed':isFixed_menu}" :style="`height:calc(100vh - ${showPromtNotice?124:94}px);top:${showPromtNotice?124:94}px`">
          <div class="menu-son">
            <div class="menu-title">目录</div>
            <div class="menu-title-line"></div>
            <div class="menu-content">
              <div v-for="(item,i) in detail.catalogue" :key="i" class="menu-content-item">
                <div class="menu-catalogue1" @click="tocontent('poilicy-catalogue'+i)">{{item.catalogue}} {{item.content}}</div>
                <div v-if="item.children && item.children.length">
                  <div v-for="(itm,ix) in item.children" :key="ix">
                    <div class="menu-catalogue2" @click="tocontent('poilicy-catalogue'+i+'a'+ix)">{{itm.catalogue}}</div>
                    <!-- <div v-if="itm.children && itm.children.length">
                      <div v-for="(im,idx) in itm.children" :key="idx">
                        <div>{{im.catalogue}}</div>
                      </div>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isFixed_menu"  class="menu"></div>
        <div class="content"> 
          <!-- <div class="content-item" v-if="detail.history_version && detail.history_version.length">
            <div class="content-title flexl">本法变迁
              <el-tooltip class="item tooltips-position" effect="light" placement="right">
                <div slot="content">本部法律或行政法规的变迁沿革一览表</div>
                <div class="fleximg problem-img"><img src="../../../assets/imgs/policy/proplem.png" alt=""> </div>
              </el-tooltip>
              <div @click="()=>bfShow = !bfShow" class="fleximg putawayimg" :class="bfShow?'putaway-rever':''"><img src="../../../assets/imgs/policy/putaway.png" alt=""> </div>
            </div>
            <div v-show="bfShow" class="bfbq">
              <div class="bf-last flexf">
                <div class="bf-pub_date_cn">{{detail.history_version[0].pub_date_cn}}</div>
                <div class="flextop bf-circular" :class="detail.history_version.length===1?'afternone':''"><img src="../../../assets/imgs/policy/circular_blue.png" alt=""></div>
                <div class="bf-title">
                  <div>{{detail.history_version[0].title}}</div>
                  <div @click="()=>{toDetail(detail.history_version[0].code_data_id,detail.history_version[0].code_detail_type);doMatomo('企业版_政策法规_详情页_本法变迁_'+detail.history_version[0].code)}">{{detail.history_version[0].code}}</div>
                </div>
              </div>
              <div class="bf-items">
                <div class="bf-last  flexf" v-for="(item,i) in history_version" :key="i">
                  <div class="bf-pub_date_cn">{{item.pub_date_cn}}</div>
                  <div class="flextop bf-circular" :class="history_version.length===1?'afternone':''"><img src="../../../assets/imgs/policy/circular.png" alt=""></div>
                  <div class="bf-title">
                    <div @click="()=>{toDetail(item.pr_data_id,item.detail_type);doMatomo('企业版_政策法规_详情页_本法变迁_'+item.title)}">{{item.title}}</div>
                    <div @click="()=>{toDetail(item.code_data_id,item.code_detail_type);doMatomo('企业版_政策法规_详情页_本法变迁_'+item.code)}">{{item.code}}</div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          <div class="content-item" v-if="detail.hierarchical_relation && (detail.hierarchical_relation.patent.length || detail.hierarchical_relation.children.length)">
            <div class="content-title flexl">位阶关系
              <el-tooltip class="item tooltips-position" effect="light" placement="right">
                <div slot="content">法律的位阶关系图，上位法是下位法的效力依据，下位法不得与上位法的规定相抵触</div>
                <div class="fleximg problem-img" ><img src="../../../assets/imgs/policy/proplem.png" alt=""> </div>
              </el-tooltip>
              <div @click="wjShow = !wjShow" class="fleximg putawayimg" :class="wjShow?'putaway-rever':''"><img src="../../../assets/imgs/policy/putaway.png" alt=""> </div>
            </div>
            <div v-show="wjShow" class="wjgx fleximg">
              <RelationMap :relation="detail.hierarchical_relation" :title="detail.title" :isShow='wjShow'/>
            </div>
          </div> -->
          
          <div class="content-item ">
            <!-- <div class="content-title flexl">正文 <div class="outline fleximg" @click="()=>{outlineShow=!outlineShow;doMatomo(outlineShow?'企业版_政策法规_详情页_正文_大纲视图':'企业版_政策法规_详情页_大纲视图_普通视图')}">{{outlineShow?'正文':'大纲视图'}}</div></div> -->
            <div class="content-title flexb">正文 <Outline :data="jxfbData" :secendCatalogueNum='secendCatalogueNum'/></div>
            <!-- <div v-show="!outlineShow"> -->
            <div>
              <div v-if="text" class="content-txt" :class="isExplain?'':'content-yuanw'"  v-html="text" ></div>
              <div v-else class="content-txt" :class="isExplain?'':'content-yuanw'">
                <div v-for="(item,index) in detail.catalogue" :key="index">
                  <div class="catalogue1" :class="`poilicy-catalogue${index}`">{{item.catalogue}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.content}}</div>
                  <div v-if="item.children && item.children.length">
                    <div v-for="(itm,i) in item.children" :key="i">
                      <div>
                        <div class="catalogue2" :class="`poilicy-catalogue${index}a${i}`">{{itm.catalogue}}&nbsp;&nbsp;&nbsp;&nbsp;{{itm.content}}</div>
                        <div class="flexl flextop tag-type" v-if=" isExplain && (itm.tags.length || itm.validity_type_arr.length)">
                          <div v-if="itm.tags.length" class="flexl flextop">
                            <div class="fleximg tagimg"><img src="../../../assets/imgs/policy/tag.png" alt=""></div>
                            <div class="flexl flexwrap tag-item-pre">
                              <div v-for="(tag,t) in itm.tags" :key="t" class="tag-item fleximg" @click="toList(tag)">{{tag}}</div>
                            </div>
                          </div>
                          <div v-if="itm.validity_type_arr.length" class="flexl flextop">
                            <div class="fleximg typeimg"><img src="../../../assets/imgs/policy/vali.png" alt=""></div>
                            <div class="flexl flextop flexwrap">
                              <div v-for="(type,tp) in itm.validity_type_arr" :key="tp"  class="type-item" @click="toValiType(type.name,itm.tags)"><span class="type-item-name" :data-tags="[index,i].join(',')">{{type.name}}</span><span class="type-item-num">({{type.doc_count}})</span></div>
                            </div>
                          </div>
                        </div>
                        <div class="dashed-line"></div>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
              </div>
              
            </div>
            
            <!-- <div v-if="outlineShow" class="right-list" >
              <Outline :data="jxfbData" />
            </div> -->
          </div>
          <div class="content-item content-item-text" v-if="detail.cite && detail.cite.length">
            <div class="content-title flexl">引用本法
              <el-tooltip class="item tooltips-position" effect="light" placement="right">
                <div slot="content">引用本部法律或行政法规的相关文件</div>
                <div  class="fleximg problem-img"><img src="../../../assets/imgs/policy/proplem.png" alt=""> </div>
              </el-tooltip>
              <!-- <div @click="()=>yyShow = !yyShow" class="fleximg putawayimg" :class="yyShow?'putaway-rever':''"><img src="../../../assets/imgs/policy/putaway.png" alt=""> </div> -->
            </div>
            <div v-show="yyShow" class="yybf flexl">
              <div v-for="(item,i) in detail.cite" :key="i" @click="()=>{toVali(item.title);doMatomo('企业版_政策法规_详情页_引用本法_效力级别')}">{{item.title}} <span>({{item.doc_count}})</span> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DetailTop from './components/detailTop.vue'
import { mapState } from "vuex"
import LoadingGif from "@/components/common/globalCom/loading-gif"
import RelationMap from "./components/relationMap.vue"
import searchVue from './components/search.vue'
import Outline from "./components/outline.vue"
import policyHover from './components/policyHover.vue'
import SearchText from './components/searchText.vue'
import History from './components/history.vue'


export default {
  data() {
    return {
      isLoading:true,
      detail:{},
      text:null,//法律文本
      originalText:null,//法律文本
      isExplain:1,//是否是解读版
      bfShow:false,
      wjShow:false,
      yyShow:true,
      outlineShow:false,
      jxfbData:[],
      history_version:[],
      timer:null,
		  isFixed:false,//check导航条是否固定在顶部
      scrollTop:0,//点击目录页面滚动到相应位置的时候用
      isFixed_menu:false,
      secendCatalogueNum:0,
    };
  },
  components: {
    LoadingGif,
    DetailTop,
    RelationMap,
    searchVue,
    Outline,
    policyHover,
    SearchText,
    History,
  },
  mounted() {
    // this.getDetail('4e88c31a-1e8f-11ec-bd53-00163e0e202a')
    this.getDetail()
  },
  computed: {
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice, 
    }),
  },
  watch:{
    isLoading(val){
      let _this=this;
      if(!val){
        this.$nextTick(()=>{
          const dom = document.getElementsByClassName('check')[0];
          const dom_menu = document.getElementsByClassName('menu')[0];
          let offsetTop_check = dom.offsetTop,offsetTop_menu = dom_menu.offsetTop;
          //监听页面滚动事件，固定搜索框
          window.addEventListener('scroll' ,e=>{
              //这里会监听目录的滚动条，判断不是目录的滚动条是页面的滚动条之后才做下面的事
              if(!e.target.getAttribute('id')){  
                let scrollTop = e.target.scrollTop;
                _this.scrollTop = scrollTop
                if(_this.timer){
                  clearTimeout(_this.timer)
                }
                _this.timer = setTimeout(()=>{
                  //滚动距离为包裹层距离内容层的高度,当页面滑动的距离>=当前元素-顶部导航条的高度的时候固定
                  //check盒子的固定
                  if(scrollTop >= (offsetTop_check - 48)){
                    _this.isFixed = true;
                  }else{
                    _this.isFixed = false;
                  }
                  //目录盒子的固定
                  if(scrollTop >= (offsetTop_menu - 94)){
                    _this.isFixed_menu = true;
                  }else{
                    _this.isFixed_menu = false;
                  }

                  //正文滚动，目录跟随滚动
                  $('.menu').animate({ 
                    scrollTop:  ((scrollTop-560)/$('.law-detail')[0].offsetHeight)*$('.menu-son')[0].offsetHeight
                  }, 0,'linear');
                },10)
                //盒子滚动去掉高亮样式
                $('div.highlight-catalogue').removeClass('class highlight-catalogue')
              }
            },true
          )
          //给文本搜索组件传值，页面vue条件渲染完成后再传值给组件
          _this.text = $('.content-txt').html()
          _this.originalText = $('.content-txt').html()
        })
      }
    }
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
        let historys = JSON.parse(JSON.stringify(data.data.history_version))
        // let historys = JSON.parse(JSON.stringify(this.history_version))
        this.detail = data.data
        // this.text = data.data.content
        // this.originalText = data.data.content
        this.isLoading = false;
        this.history_version = historys.splice(1,historys.length)
        let outlineData =this.getOutlineData(data.data.catalogue,data.data.title)
        this.jxfbData=outlineData
      } else {
        this.isLoading = false;
      }
    },
    tocontent(str){
      // console.log(str)
      let _this = this
      let dom = document.getElementsByClassName(str)[0]
      // dom.scrollIntoViewIfNeeded(true)
      // dom.scrollIntoView({
      //   block:'end',  			
      //   behavior:'smooth'    //滚动动画
      // })
      // 
      $('.el-scrollbar__wrap,.el-scrollbar__wrap--hidden-default').animate({ //这里是滚动的那个盒子
        scrollTop: $(dom).offset().top - 150 + (_this.scrollTop ? _this.scrollTop+55:0) - (_this.showPromtNotice?30:0)
      }, 150,'linear',()=>{
        //滚动完了之后当前这一条加上高亮样式
        setTimeout(()=>{dom.className += ' highlight-catalogue'},150) 
      });
      // dom.scrollTo({top: 180, behavior: 'smooth'})
    },
    //传值catalogue
    getOutlineData(val,title){
      let arr=[],secendCatalogueNum = 0;
      val.forEach(item=>{
        let itm={
          name:item.catalogue+'：'+item.content,
          // children:this.getSecond(item.children),
          _children:this.getSecond(item.children),
        }
        secendCatalogueNum +=item.children.length
        
        arr.push(itm)
      })
      this.secendCatalogueNum = secendCatalogueNum
      let obj={
        name:title,
        children:arr
      }
      return [obj]
    },
    getSecond(array){
      if(array.length === 0)return []
      let arr=[]
      array.forEach(item=>{
        arr.push(this.getTags(item))
      })
      return arr
    },
    getTags(val){
      // return {name:val.catalogue+'：'+val.content}
      if(val.tags.length===0 && val.validity_type_arr.length===0){
        return {name:(val.catalogue+'：'+val.content).substr(0,50),title:val.catalogue+'：'+val.content}
      }else if(val.tags.length>0 && val.validity_type_arr.length===0){
        let arr=[]
        val.tags.forEach(unit=>{
          arr.push({name:unit})
        })
        let ele = {
          name:(val.catalogue+'：'+val.content).substr(0,50),
          title:val.catalogue+'：'+val.content,
          // children:[
          //   {name:'标签',children:arr}
          // ],
          _children:[
            {name:'标签',children:arr}
          ],
        }
        return ele
      }else if(val.tags.length===0 && val.validity_type_arr.length>0){
        let arr=[]
        val.validity_type_arr.forEach(unit=>{
          arr.push({name:`${unit.name}(${unit.doc_count})`})
        })
        let ele = {
          name:(val.catalogue+'：'+val.content).substr(0,50),
          title:val.catalogue+'：'+val.content,
          // children:[
          //   {name:'智能发现',children:arr}
          // ],
          _children:[
            {name:'智能发现',children:arr}
          ]
        }
        return ele
      }else{
        let arrTags=[],arrVali=[]
        val.tags.forEach(unit=>{
          arrTags.push({name:unit})
        })
        val.validity_type_arr.forEach(unit=>{
          arrVali.push({name:`${unit.name}(${unit.doc_count})`})
        })
        let ele = {
          name:(val.catalogue+'：'+val.content).substr(0,50),
          title:val.catalogue+'：'+val.content,
          // children:[
          //   {name:'标签',children:arrTags},
          //   {name:'智能发现',children:arrVali}
          // ],
          _children:[
            {name:'标签',children:arrTags},
            {name:'智能发现',children:arrVali}
          ],
        }
        return ele
      }
    },
    toList(item){
      window.open('/policies/list?tag='+item ,'_blank')
    },
    toVali(type){
      const routeLink = this.$router.resolve({
        path: '/policies/list',
        query : {
          filter_condition: JSON.stringify({validity_type_cn:[type]}),
          cite_xzfg:JSON.stringify(this.detail.cite_xzfg)
        }
      })
      window.open(routeLink.href, '_blank')
    },
    toValiType(type,tags){
      this.doMatomo('企业版_政策法规_详情页_正文_效力级别')
      let tag = JSON.parse(JSON.stringify(tags))
      let str = tag[0]
      
      tag.splice(1,tag.length).forEach(item=>{
        str = `${str}&tag=${item}`
      })
      window.open('/policies/list?tag='+str+'&validity_type_cn='+ type,'_blank')
      str = ''
      
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
.law-detail{
  padding: 10px;
  div{box-sizing: border-box;}
  .flextop{
    align-items: flex-start;
  }
  .flexf{
    display: flex;
  }
  .flexwrap{
    flex-wrap: wrap;
  }
  .highlight-catalogue{
    color: #DF9008!important;
    font-weight:600!important;
  }
  .detail-son{
    .detail-top{
      margin-bottom: 10px;
      // background: #ffffff;
    }
    .check{
      height: 46px;
      background: #FFFFFF;
      box-shadow: 0px 1px 10px 0px rgba(9,20,79,0.1);
      border-radius: 3px 3px 0px 0px;
      margin-bottom: 10px;
      padding:0 20px;
      box-sizing: border-box;
      .check-btns{
        margin-right: 19px;
        >div{
          width: 80px;
          height: 28px;
          background: #C0C4CC;
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 20px;
          margin-right: 1px;
          cursor: pointer;
          &:hover{
            background: #DF9008;
          }
        }
        .check-btns-active{
          background: #DF9008;
        }
      }
      .his-pre{
        margin-left: 20px;
      }
    }
    .button-box-fixed {
      width: calc(100vw - 20px);
      position: fixed;
      top: 48px;//这个需要根据实际情况来调整
      z-index: 99;
      box-shadow: 0 6px 12px 0 rgb(0 0 0 / 5%);
    }

    .main{
      width: 100%;
      align-items: flex-start !important;
      justify-content: space-between;
      .menu{
        width:240px;
        background: #FFFFFF;
        display: table-cell;
        padding: 10px 20px 0;
        overflow: auto;
        .menu-title{
          background: #FFFFFF;
          padding:0 0 0 11px;
          font-size: 16px;
          
          font-weight: 600;
          color: #182462;
          line-height: 22px;
          position: relative;
          &::before{
            content: "";
            width: 2px;
            height: 100%;
            background: #182462;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        .menu-title-line{
          width: 100%;
          height: 1px;
          border: 1px solid #EBEEF5;
          margin: 10px 0;
        }
        .menu-content{
          .menu-content-item{
            padding-bottom: 10px;
          }
          .menu-catalogue1{
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            line-height: 20px;
            margin: 10px 0;
            cursor: pointer;
          }
          .menu-catalogue2{
            font-size: 14px;
            font-weight: 400;
            color: #5C6973;
            line-height: 20px;
            padding-left: 14px;
            margin: 10px 0;
            cursor: pointer;
          }
        }
        
      }
      .menu-box-fixed{
        position: fixed;
        top: 94px;//这个需要根据实际情况来调整
        z-index: 98;
      }
      .content{
        width:calc(100% - 250px);
        .content-item{ 
          background: #FFFFFF;
          box-shadow: 0px 1px 10px 0px rgba(9,20,79,0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 10px;
          transition: all 0.5s linear;
          will-change: height;
          .content-title{
            height: 40px;
            padding:0 20px;
            background: rgba(235, 238, 245, 0.4);
            border-radius: 3px 3px 0px 0px;
            font-size: 16px;
            
            font-weight: 600;
            color: #182462;
            line-height: 22px;
            position: relative;
            .problem-img{
              width: 16px;
              margin-left: 10px;
              cursor: pointer;
            }
            .putawayimg{
              width:14px;
              position: absolute;
              right: 20px;
              top: 50%;
              transform: translateY(-50%);
              cursor: pointer;
              transition: all 0.3s linear;
            }
            .putaway-rever{
              transform: rotate(180deg);
            }
            .outline{
              font-size: 14px;
              font-weight: 400;
              color: #002FA7;
              line-height: 20px;
              cursor: pointer;
              // position: absolute;
              // right: 20px;
              // top: 50%;
              // transform: translateY(-50%);
            }
          }
          .dashed-line{
            width: 100%;
            height: 1px;
            // border-bottom: 1px dashed #DCDFE6;
            margin: 10px 0;
          }
          .content-txt,.content-yuanw{
            padding: 15px 20px;
            // max-height: 500px;
            overflow: auto;
            box-sizing: border-box;
            .catalogue1{
              font-size: 16px;
              
              font-weight: 600;
              color: #333333;
              line-height: 22px;
              margin: 10px 0;
            }
            .catalogue2{
                font-size: 16px;
                font-weight: 400;
                color: #333333;
                line-height: 20px;
                margin: 6px 0;
              }
              .tagimg{
                width: 12px;
                margin-right: 5px;
                position: relative;
                top: 2px;
              }
              .tag-item-pre{
                max-height: 37px;
              }
              .tag-item{
                cursor: pointer;
                height: 20px;
                background: #EBEEF5;
                border-radius: 2px;
                font-size: 12px;
                font-weight: 400;
                color: #5C6973;
                line-height: 12px;
                padding: 0 10px;
                margin:0 5px 5px 0;
                &:hover{
                  background: #DF9008;
                  color:#FFFFFF
                }
              }
              .typeimg{
                width: 12px;
                margin:0 7px 0 16px;
                position: relative;
                top: 3px;
              }
              .type-item{
                cursor: pointer;
                margin-right: 10px;
                .type-item-name{
                  font-size: 12px;
                  font-weight: 500;
                  color: #002FA7;
                  line-height: 17px;
                }
                .type-item-num{
                  color: #333333;
                }
                &:hover{
                  color: #DF9008;
                  text-decoration: underline;
                  text-decoration-color: #DF9008;
                  &>span{
                  color: #DF9008;
                }
                }
                
              }
              
          }
          .content-yuanw{
            .tag-type{
              display: none !important;
            }
          }
        }
        .content-item-text{
          margin-bottom: 0;
        }
        .bfbq{
          padding: 18px 20px 0;
          .bf-last{
            .bf-pub_date_cn{
              width: 80px;
              text-align: right;
              font-size: 14px;
              font-weight: 400;
              color: #5C6973;
              line-height: 20px;
            }
            .bf-circular{
              width: 10px;
              margin: 0 20px;
              position: relative;
              top: 6px;
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
                top: 10px;
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
        .wjgx{
          width: 100%;
        }
        .yybf{
          padding: 10px 20px;
          flex-wrap: wrap;
          &>div{
            padding: 4px 10px;
            border-radius: 3px;
            border: 1px solid #182462;
            font-size: 14px;
            font-weight: 600;
            color: #182462;
            line-height: 20px;
            margin:0 10px 10px 0;
            cursor: pointer;
            &>span{
              color: #333333;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
}
.flextop{
  display: flex;
  justify-content: flex-start;
}
.right-list {
      width: calc(100vw - 270px);
      min-width: 1100px;
      margin-left: 10px;
      padding-top: 0 !important;
      padding-left: unset !important;

      .border-box {
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        border: 1px solid #dfe5f1;

        .chart {
          width: 100%;
          height: 100%;
        }
      }
    }
</style>
