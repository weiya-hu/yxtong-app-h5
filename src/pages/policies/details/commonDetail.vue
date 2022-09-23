<template>
  <div class="detail" :style="`padding-top: ${showPromtNotice?88:58}px`">
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <div v-else class="detail-son">
      <div class="detail-top" ref="detailTop">
        <DetailTop :detail="detail"/>
      </div> 
      <div class="detail-content">
        <div class="search flexl" :class="{'button-box-fixed':isFixed}" :style="`top:${showPromtNotice?78:48}px`">
          <SearchText :text.sync='text' :originalText='originalText' :scrollTop='scrollTop' :catalogue='detail.catalogue'/>
          <div class="flexl his-pre">
            <History :detail="detail" v-if="detail.history_version && detail.history_version.length"/>
            <RelationMap :relation="detail.hierarchical_relation" :title="detail.title" v-if="detail.hierarchical_relation && (detail.hierarchical_relation.patent.length || detail.hierarchical_relation.children.length)"></RelationMap>
          </div>
        </div>
        <div class="flexl content-main">
          <div class='content-left'>
            <div class="content-html">
              <div class="content-html-top flexl">正文</div>
              <div v-html="text" class="detail-text" ></div>
            </div>
            <div class="content-html" v-if="detail.attachment_preview.length">
              <div class="content-html-top flexl">附件预览</div>
              
              <div class="appendix">
                <div v-if="appendix.length>1" class="attach">
                  <div v-for="(item,i) in appendix" :key="i" class="attachment" :class="currentFileIndex === i?'attach-active':''" @click="filechange(item,i) ">
                    <div class="fleximg attach-label">附件{{i+1}}</div>
                    <div class="attach-title flexl">
                      <a v-if="item.suffix =='zip' || item.suffix =='rar'" :href="item.download" download class="attach-download">{{item.title}}</a>
                      <div v-else>{{item.title}}</div>
                      <!-- <a :href="item.download" download class="attach-download">{{item.title}}</a> -->
                    </div>
                  </div>
                </div>
                <div v-if="currentFilePreview>-1" class="iframe-file">
                  <iframe v-if="appendix[currentFilePreview].suffix == 'pdf'" :src="`/static/pdf/web/viewer.html?file=${appendix[currentFilePreview].download}`" width="100%" height="100%"></iframe>
                  <iframe v-else :src="`https://view.officeapps.live.com/op/view.aspx?src=${appendix[currentFilePreview].download}`" width='100%' height='100%' frameborder='1'></iframe>
                </div>
              </div>
            </div>
          </div>
          <div class="content-recommend" v-if="recommend.length">
            <div class="recommend-top flexl">相关推荐</div>
            <div class="recommend-main">
              <div v-for="(v,i) in recommend" :key="i" @click="toDetail(v)">{{v.title}}</div>
            </div>
          </div>
        </div>
      </div>  
      <policyHover v-if="text" />
    </div>
  </div>
</template>
<script>
import SearchText from './components/searchText.vue'
import DetailTop from './components/detailTop.vue'
import LoadingGif from "@/components/common/globalCom/loading-gif"
import policyHover from './components/policyHover.vue'
import History from './components/history.vue'
import RelationMap from "./components/relationMap.vue"
import { mapState } from "vuex";
export default {
  data(){
    return{
      text:null,
      originalText:null,
      isLoading:true,
      detail:{},
      isFixed:false,//check导航条是否固定在顶部
      timer:null,
      scrollTop:0,
      recommend:[],
      appendix:[{'title': '食药监办药化监〔2013〕33号 附件1.doc', 'download': 'https://zy.yaozh.com/sda/yrPSqbzgsOzSqbuvvOChsjIwMTOhszMzusUguL28jEuZG9j.doc'}, {'title': '食药监办药化监〔2013〕33号 附件2.doc', 'download': 'https://zy.yaozh.com/sda/yrPSqbzgsOzSqbuvvOChsjIwMTOhszMzusUguL28jIuZG9j.doc'}],
      appendixs:{},
      currentFileIndex:-1,
      currentFilePreview:-1
    }
  },
  components: {
    SearchText,
    DetailTop,
    LoadingGif,
    policyHover,
    History,
    RelationMap,
  },
  computed: {
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice, 
    }),
  },
  mounted(){
    
    // this.getDetail('6eae64ba-1e8f-11ec-bd53-00163e0e202a')
    // this.loading()
    this.getDetail()
    this.getRecommend()
    // console.log(this.getFileSuffix(this.appendix))
  },
  methods:{
    
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
          this.getFileSuffix(data.data.attachment_preview)
          // this.text = this.htmlUnEscape(data.data.content_tag) 
          this.text = data.data.content_tag
          this.originalText = data.data.content_tag
          // this.originalText = this.htmlUnEscape(data.data.content_tag) 
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
    },
    async getRecommend(id){
      const { data } = await window
        .Axios({
          method: "get",
          url: `/api/policies/relation`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            data_id:id || this.$route.params.id
          }
        })
        .catch(err => {
          console.log(err);
        });
      if ( data.code === 200 && data.data ) {
        this.recommend = data.data
      } 
    },
    async loading(){
      this.isLoading = true
      await Promise.all([this.getDetail(),this.getRecommend()])
      this.isLoading = false
    },
    //显示文本时去掉字符串中的转义字符
    htmlUnEscape(str) {
      return str.replace(/&lt;|&gt;|&quot;|&amp;/g, (match) => {
        switch (match) {
          case '&lt;':
            return '<';
          case '&gt;':
            return '>';
          case '&quot;':
            return '"';
          case '&amp;':
            return '&';
        }
      });
    },
    toDetail(v){
      let typeObj={0:'/policies/commondetail/',1:'/policies/lawdetail/',2:'/policies/guiddetail/'}
      window.open(typeObj[v.detail_type]+v.data_id ,'_blank')
    },
    getFileSuffix(file){
      let arr=[],firstFileIndex = -1;
      file.forEach((item,i) => {
        let suffix = item.download.split('.').pop().toLowerCase()
        firstFileIndex = (suffix!=='zip' && suffix!=='rar' && firstFileIndex<0) ? i :firstFileIndex
        let reb = {...item,suffix}
        arr.push(reb)
      });
      this.appendix = arr
      this.currentFileIndex = firstFileIndex
      this.currentFilePreview = firstFileIndex
      this.appendixs = {appendix:arr,firstFileIndex}
      return {appendix:arr,firstFileIndex}
    },
    
    filechange(item,i){
      this.currentFileIndex = i;
      (item.suffix !== 'zip' && item.suffix !== 'rar') && (this.currentFilePreview = i)
    }
  },
  watch:{
    detail:{
      handler(val){
        if(val.title){
          let _this=this
          this.$nextTick(()=>{
            const dom = document.getElementsByClassName('search')[0]
            let offsetTop = dom.offsetTop;
            window.addEventListener('scroll',e=>{
              let scrollTop = e.target.scrollTop;
              _this.scrollTop = scrollTop
              if(_this.timer){
                clearTimeout(_this.timer)
              }
              _this.timer = setTimeout(()=>{
                //滚动距离为包裹层距离内容层的高度,当页面滑动的距离>=当前元素-顶部导航条的高度的时候固定
                if(scrollTop >= offsetTop - 48){
                  _this.isFixed = true;
                }else{
                  _this.isFixed = false;
                }
              },10)
            },true)
          })
        }
      },
      // deep:true,
      immediate: true,
    },
    // currentFileIndex(){
    //   this.$nextTick(()=>{
    //     $('#AppHeaderPanel').css('display','none')
    //     let dom = $('#AppHeaderPanel')
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
div{
  box-sizing: border-box;
}
.his-pre{
  margin-left: 20px;
}
.detail{
  width: 100%;
  padding: 10px;
  .detail-son{
    height: 100%;
    box-sizing: border-box;
    .detail-top{
      margin-bottom: 10px;
    }
    .detail-content{
      width: 100%;
      .search{
        width: 100%;
        box-sizing: border-box;
        height: 46px;
        background: #FFFFFF;
        box-shadow: 0px 1px 10px 0px rgba(9,20,79,0.1);
        border-radius: 3px 3px 0px 0px;
        padding-left: 20px;
        margin-bottom: 10px;
      }
      .button-box-fixed {
        position: fixed;
        top: 48px;//这个需要根据实际情况来调整
        z-index: 99;
      }
      .content-main{
        align-items: flex-start;
        .content-left{
          width: 100%;
          .content-html{
            margin-bottom: 10px;
            .content-html-top{
              height: 40px;
              background: #F7F9FB;
              border-radius: 3px 3px 0px 0px;
              padding-left: 20px;
              font-size: 16px;
              font-weight: 600;
              color: #182462;
              line-height: 22px;
              box-sizing: border-box;
            }
            .detail-text{
              width: 100%;
              background: #FFFFFF;
              box-sizing: border-box;
              padding: 20px;
            }
            .appendix{
              background: #FFFFFF;
              padding: 20px;
              .attach{
                border-radius: 3px;
                border: 1px solid #EBEEF5;
                border-bottom: none;
                overflow: hidden;
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
                  .attach-title,.attach-download{
                    width: calc(100% - 120px);
                    padding: 0 24px;
                    flex-wrap: wrap;
                    font-size: 14px;
                    font-weight: 600;
                    color: #002FA7;
                    line-height: 20px;
                    border-bottom:1px solid #EBEEF5;
                    text-decoration: none;
                    .attach-download{

                    }
                  }
                  &:hover{
                    .attach-title,.attach-download{
                      font-size: 16px;
                      font-weight: 500;
                      color: #DF9008;
                      line-height: 22px;
                    }
                  }
                }
                .attach-active{
                  .attach-title,.attach-download{
                    font-size: 16px;
                    font-weight: 500;
                    color: #DF9008;
                    line-height: 22px;
                  }
                }
              }
              .iframe-file{
                height: calc(100vh - 128px);
              }
            }
          }
          &>.content-html:last-child{
            margin-bottom: 0;
          }
        }
        
        .content-recommend{
          width: 310px;
          background: #FFFFFF;
          box-shadow: 0px 1px 10px 0px rgba(9,20,79,0.1);
          border-radius: 3px;
          margin-left: 10px;
          height: 300px;
          .recommend-top{
            width: 310px;
            height: 40px;
            background: rgba(235, 238, 245, .4);
            border-radius: 3px 3px 0px 0px;
            font-size: 16px;
            font-weight: 600;
            color: #182462;
            line-height: 22px;
            padding-left: 20px;
          }
          .recommend-main{
            background: #FFFFFF;
            padding: 0 10px 10px;
            &>div{
              // height: 40px;
              border-bottom: 1px dashed #DCDFE6;
              padding: 10px;
              font-size: 14px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              cursor: pointer;
            }
            &>div:last-child{
              border-bottom:none;
            }
          }
        }
      }
    }
  }
  
}
.policy-title{
  color: #002FA7;
}

</style>
