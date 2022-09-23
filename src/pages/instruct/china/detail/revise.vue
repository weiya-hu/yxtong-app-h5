<template>
  <div class="revise">
    <LoadingGif :loadFlag="isLoading" v-if="isLoading" />
    <div v-else>
      <div class="revise-top flexl"></div>
      <div class="revise-top flexl revise-top-fixed" :style="`top:${showPromtNotice?78:48}px`">
        <div class="revise-name">{{detail.name}}</div>
        <div class="revise-qiye">{{detail.guifanqiye}}</div>
        <div class="revise-date">{{detail.zuixinxiugairi}}</div>
      </div>
      <div class="revise-main">
        <div class="revise-menu"></div>
        <div class="revise-menu revise-menu-fixed" :style="`top:${showPromtNotice?128:98}px`">
          <div v-for="(v,i) in menu" :key="i" >
            <div v-if="i===0 && detail.notice_history.length>0 ||
              i===2 && detail.related_drug.length>0 ||
              i===3 && extend.length>0 ||
              i===1" 
              class="menu-item" 
              :class="menuActive === i?'menu-active':''" 
              @click="()=>{menuActive = i;menuChange(i)}"
            >
              <div class="menu-title">{{v}}</div>
              <div class="menu-arrow"></div>
            </div>
          </div>
        </div>
        <div class="revise-content">
          <div class='content-item menu0' v-if="detail.notice_history && detail.notice_history.length">
          <!-- <div class='content-item menu0'> -->
            <div class="content-title flexl">历史修订公告</div>
            <div class="content-main content-main-page" v-if="his_data.length">
              <div class="his-pre">
                <div v-for="(v,i) in his_data" :key="i" class="flexl his-item" @click="toRevise(v.id)">
                  <div class="his-date">发布日期：<span>{{v.zuixinxiugairi}}</span></div>
                  <div class="his-title">标题：<span>{{v.title}}</span></div>
                </div>
              </div>
              <el-pagination
                class="page-more"
                small
                background
                layout="total,prev, pager, next"
                @current-change="getHisData($event)"
                :current-page.sync="his_page"
                :page-size="his_size"
                :total="detail.notice_history.length">
              </el-pagination>
              <!-- <el-pagination
                class="page-more"
                small
                background
                layout="total,prev, pager, next"
                @current-change="getHisData($event)"
                :current-page.sync="his_page"
                :page-size="his_size"
                :total="7">
              </el-pagination> -->
            </div>
          </div>
          <div class='content-item menu1'>
            <div class="content-title  flexl">正文</div>
            <div class="content-main">
              <div class="text-pre">
                <div class="text-title">{{detail.title}}</div>
                <div v-html="detail.content"></div>
              </div>
            </div>
          </div>
          <div class='content-item menu2' v-if="detail.related_drug && detail.related_drug.length" width="100%">
            <div class="content-title flexl">相关药品</div>
            <div class="content-main content-main-page">
              <table v-if="relateList.length" class="relate-table">
                <tr v-for="(v,idx) in relateList" :key="idx">
                  <td v-for="(item,i) in v" :key="i"><div class="fleximg" @click="toList(item.name)">{{item.name}}</div></td>
                </tr>
              </table>
              <el-pagination
                class="page-more"
                small
                background
                layout="total,prev, pager, next"
                @current-change="getRelateData($event)"
                :current-page.sync="rel_page"
                :page-size="rel_size"
                :total="detail.related_drug.length">
              </el-pagination>
            </div>
          </div>
          <div class='content-item menu3' v-if="extend.length">
            <div class="content-title flexl">扩展信息</div>
            <div class="content-main flexl extent-pre">
              <ExtendButton  class="reset-style" v-for="(item,i) in extend" :key="i" :item="item">
              </ExtendButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif"
import ExtendButton from "@/components/common/extend-button";
import { mapState } from "vuex"
export default {
  name: "ChinaDetail1Revise",
  components :{
    LoadingGif,
    ExtendButton,
  },
  data() {
    return {
      detail:{},//详细页信息
      menu:['历史修订公告','正文','相关药品','扩展信息'],
      menuActive:0,//目录当前下标
      his_data:[],//历史修订公告当前页数据
      his_total:null,//历史修订公告总条数
      his_page:1,//历史修订公告当前页
      his_size:2,//历史修订公告每页条数
      rel_total:null,//相关药品总条数
      rel_page:1,//相关药品当前页
      rel_size:25,//相关药品每页条数
      extend:[],//扩展信息
      isLoading:true,
      relateList:[],//相关药品当前页数据
      scrollTop:0,//页面滚动条滚动的距离
    };
  },
  computed: {
    ...mapState({
      showPromtNotice: (state) => state.showPromtNotice, 
    }),
  },
  mounted() {
    this.getDetail()
    let _this=this
    // this.getDetail('7152847340000100')
    window.addEventListener('scroll' ,e=>{
        let scrollTop = e.target.scrollTop;
        _this.scrollTop = scrollTop
      },true
    )
  },
  methods: {
    async getDetail(id){
      this.isLoading=true
      const {data} =await window
        .Axios({
          method: "get",
          url: `/api/instruct/detailxiuding`,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            id:id || this.$route.params.id
          }
        })
        .catch(err => {
          console.log(err);
        });
      if ( data.code === 200 && data.data ) {
        this.getExtend(data.data.name,data.data.bianma)
        this.getRelateData(1,data.data.related_drug)
        this.detail = data.data
        this.menuActive = data.data.notice_history.length?0:1
        // let m =[
        //   {title: "关于修订磷酸奥司他韦胶囊a明书的通知",zuixinxiugairi: "2021-31-01"},
        //   {title: "关于修订磷w司他韦胶囊说明书的通知",zuixinxiugairi: "2521-01-01"},
        //   {title: "关于修订磷酸奥司他韦u说明书的通知",zuixinxiugairi: "2051-01-01"},
        //   {title: "关于修订磷酸s说明书的通知",zuixinxiugairi: "2024-31-01"},
        //   {title: "关于修订磷v奥司他韦胶囊说明书的通知",zuixinxiugairi: "2021-03-01"},
        //   {title: "关于修订磷酸奥n韦胶囊说明书的通知",zuixinxiugairi: "2021-01-01"},
        //   {title: "关于修订磷酸奥司他韦胶l书的通知",zuixinxiugairi: "2051-01-01"},
        // ]
        // this.getHisData(1,m)
        this.getHisData(1,data.data.notice_history)
      } 
    },
    async getExtend(name,bianma){
      const {data} =await window
        .Axios({
          method: "get",
          url: `/api/instruct/extendlistfun`,
          params: {
            name,bianma,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          }
        })
        .catch(err => {
          console.log(err);
        });
        this.isLoading=false
      if ( data.code === 200 && data.data ) {
        this.extend = data.data
      } 
    },
    getHisData(val,array){
      console.log(val,array)
      let arr = array ? JSON.parse(JSON.stringify(array)) :  JSON.parse(JSON.stringify(this.detail.notice_history))
      // let arr =[
      //     {title: "关于修订磷酸奥司他韦胶囊a明书的通知",zuixinxiugairi: "2021-31-01"},
      //     {title: "关于修订磷w司他韦胶囊说明书的通知",zuixinxiugairi: "2521-01-01"},
      //     {title: "关于修订磷酸奥司他韦u说明书的通知",zuixinxiugairi: "2051-01-01"},
      //     {title: "关于修订磷酸s说明书的通知",zuixinxiugairi: "2024-31-01"},
      //     {title: "关于修订磷v奥司他韦胶囊说明书的通知",zuixinxiugairi: "2021-03-01"},
      //     {title: "关于修订磷酸奥n韦胶囊说明书的通知",zuixinxiugairi: "2021-01-01"},
      //     {title: "关于修订磷酸奥司他韦胶l书的通知",zuixinxiugairi: "2051-01-01"},
      //   ]
      this.his_data = arr.splice((val-1)*this.his_size,this.his_size) 
    },
    getRelateData(val,array){
      let arr = array?JSON.parse(JSON.stringify(array)) : JSON.parse(JSON.stringify(this.detail.related_drug))
      let reback = arr.splice((val-1)*this.rel_size,this.rel_size) 
      this.relateList= this.getRelateArr( reback )
    },
    toBiaozhun(url){
      window.open(url,'_blank')
    },
    getRelateArr(arr){
      let array = JSON.parse(JSON.stringify(arr)),returnArr=[],time=[0,1,2,3,4]
      time.forEach(v=>{
        let reback = array.splice(v*5,5)
        reback .length && returnArr.push(reback)
        array = JSON.parse(JSON.stringify(arr))
      })
      return returnArr
    },
    menuChange(i){
      let _this = this
      let dom = document.getElementsByClassName('menu'+i)[0]
      console.log()
      $('.el-scrollbar__wrap,.el-scrollbar__wrap--hidden-default').animate({ //这里是滚动的那个盒子
        scrollTop: $(dom).offset().top + _this.scrollTop - (_this.showPromtNotice?128:98)
      }, 150,'linear');
    },
    toList(name){
      window.open('/instruct?name='+name ,'_blank')
    },
    toRevise( id ){
      window.open('/instruct/revise/'+id ,'_blank')
    } 
  }
};
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
div{
  box-sizing: border-box;
}
.Reset() {
  padding: 0;
  margin: 0;
}
.page-more{
  position: relative;
  left: -14px;
}
.reset-style {
  * {
    .Reset();
  }
}
.revise{
  .revise-top{
    height: 40px;
    background: #FFFFFF;
    box-shadow: 0px 1px 8px 0px #D8E2FA;
    padding-left: 10px;
    .revise-name{
      font-size: 18px;
      font-weight: 600;
      color: #545B6D;
      line-height: 20px;
    }
    .revise-qiye,.revise-date{
      font-size: 13px;
      font-weight: 400;
      color: #545B6D;
      line-height: 14px;
      margin-left: 10px;
    }
  }
  .revise-top-fixed{
    position: fixed;
    top: 48px;
    left: 0;
    width: 100%;
    z-index: 12;
  }
  .revise-menu-fixed{
    position: fixed;
    top: 98px;
    left: 10px;
    width: 100%;
  }
  .revise-main{
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    .revise-menu{
      width: 180px;
      margin-right: 10px;
      box-sizing: border-box;
      .menu-item{
        width: 180px;
        height: 40px;
        background: #FFFFFF;
        box-shadow: 0px 1px 8px 0px rgba(216,226,250,0.5);
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        cursor: pointer;
        .menu-title{
          font-size: 14px;
          font-weight: 400;
          color: #545B6D;
          line-height: 20px;
        }
        // .menu-arrow{
        //   width: 7px;
        //   height: 11px;
        //   background: url(../../../../assets/imgs/instruct/arrow_right.png) no-repeat;
        //   background-size: contain;
        // }
        
      }
      .menu-item:hover,.menu-active{
        &::before{
          content: "";
          width: 5px;
          height: 100%;
          background: #4877E8;
          border-radius: 3px;
          position: absolute;
          left: 0;
          top: 0;
        }
        .menu-title{
          color: #4877E8;
        }
        // .menu-arrow{
        //   width: 11px;
        //   height: 7px;
        //   background: url(../../../../assets/imgs/instruct/arrow_down.png) no-repeat;
        //   background-size: contain;
        // }
      }
    }
    .revise-content{
      width: calc(100% - 190px);
      .content-item{
        background: #FFFFFF;
        box-shadow: 0px 1px 8px 0px #D8E2FA;
        border-radius: 4px;
        margin-bottom: 10px;
        .content-title{
          height: 40px;
          background: #EFF2FA;
          border-radius: 4px 4px 0px 0px;
          padding-left: 20px;
          font-size: 16px;
          font-weight: 600;
          color: #545B6D;
          line-height: 20px;
        }
        .content-main{
          padding: 20px;
          .text-pre{
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #DFE5F1;
            padding: 20px 16px;
            .text-title{
              font-size: 20px;
              font-weight: 600;
              color: #545B6D;
              line-height: 20px;
              margin-bottom: 16px;
              text-align: center;
            }
          }
          .extent-item{
            height: 28px;
            border-radius: 14px;
            border: 1px solid #4877E8;
            padding: 0 22px;
            font-size: 13px;
            font-weight: 400;
            color: #4877E8;
            line-height: 18px;
            margin:0 10px 10px 0;
            cursor: pointer;
            &:hover{
              background: #4877E8;
              color: #FFFFFF;
            }
          }
          .relate-table{
            width: 100%;
            // border-top: 1px solid #DFE5F1;
            border-left: 1px solid #DFE5F1;
            overflow: hidden;
            >tr:first-child>td{
              border-top: 1px solid #DFE5F1;
            }
            td{
              display: inline-block;
              width: 20%;
              max-width: 20%;
              border-right: 1px solid #DFE5F1;
              border-bottom: 1px solid #DFE5F1;
              box-sizing: border-box;
              overflow: hidden;
              &>div{
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                height: 35px;
                font-size: 13px;
                font-weight: 400;
                color: #545B6D;
                line-height: 20px;
                text-decoration: underline;
                text-decoration-color: #545B6D;
                cursor: pointer;
              }
            }
          }
          .his-pre>.his-item:first-child{
            margin-top: 0;
          }
          .his-item{
            height: 45px;
            border-radius: 4px;
            border: 1px solid #DAE0E9;
            margin-top: 10px;
            padding: 0 16px;
            cursor: pointer;
            .his-date{
              font-size: 14px;
              font-weight: 400;
              color: #545B6D;
              line-height: 20px;
              margin-right: 40px;
              &>span{
                font-size: 16px;
                font-weight: 600;
                color: #545B6D;
                line-height: 20px;
              }
            }
            .his-title{
              font-size: 16px;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              &>span{
                font-size: 16px;
                font-weight: 600;
                color: #545B6D;
                line-height: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
        .content-main-page{
          padding-bottom: 4px;
        }
        .extent-pre{
          padding: 15px 20px 5px;
          flex-wrap: wrap;
        }
      }
    }
  }
}

</style>
