<template>
  <div class="la-menu" :class="{'la-menu-scaled': scaled}" v-if="path.indexOf('/login') == -1">
    <el-scrollbar>
    <!-- 搜索部分 -->
    <div class="la-menu-search">
      <div class="title" :class="{'at-home': $route.path === '/home'}" v-if="!scaled">
        <i class="title-icon iconfont" @click="swicthMenu">&#xe684;</i>
        <el-input
          placeholder="搜索数据库关键词"
          v-model="input"
          size="small"
          class="search-input"
          @focus="getNavMapData"
          clearable>
        </el-input>
      </div>
      <div class="title" @click="swicthMenu" v-else>
        <i class="title-icon iconfont">&#xe684;</i>
        <span class="short-label">搜索</span>
      </div>

    </div>
    <!-- 搜索结果 -->
    <div class="menu-item" id="search-res">
      <div v-if="!scaled" class="title">
        <i class="title-icon iconfont">&#xe633;</i>
        <div class="label">
          <span>搜索结果</span>
        </div>
        <i class="arrow-icon iconfont">&#xe61c;</i>
      </div>
      <div v-else class="title">
        <i class="title-icon iconfont">&#xe633;</i>
        <span class="short-label">结果</span>
      </div>
      <div class="submenu">
        <template v-for="lists in resultList" v-if="resultList.length">
          <span class="group-title" v-html="lists.label"> </span>
            <ul class="group-list">
              <li v-for="list in lists.group">
                <router-link class="group-item" tag="a" :to="'/'+list.href" :title="list.title" v-if="list.href.indexOf('http') != 0">
                  <i class="iconfont li-style">&#xe757;</i>
                  <span v-html="colorKeyword(list.label, input, list.internal)" :class="{'internal': list.internal}"></span>
                  <span :class="navStatus(list.navlabel)">{{statusIcon(list.navlabel)}}</span>
                </router-link>
                <a class="group-item" :href="list.href" :title="list.title" target="_blank" v-else>
                  <i class="iconfont li-style">&#xe757;</i>
                  <span v-html="colorKeyword(list.label, input, list.internal)" :class="{'internal': list.internal}"></span>
                </a>
              </li>
            </ul>
        </template>
        <div class="menu-nodata" v-if="!resultList.length">
          <img src="~@/assets/imgs/menu-nodata.png">
          <div class="msg">对不起，小智暂时没有找到相关数据，<span v-if="allList.length===0&&allNavMapList.length===0">换个关键词试试吧~</span></div>
        </div>
        <span v-if="isNavMore" class="nav-link" :class="{'nav-link-center':isNavMore&&allList.length===0}" @click="goNav">去导航地图查看更多结果</span>
      </div>
    </div>
    <!-- 后端获取数据列表 -->
    <div class="menu-item" v-for="item in menuList" :key="item.label">
      <div v-if="item.groupList[0].group.length>0||item.shortlabel=='其他'||item.shortlabel == '导航'">
        <div v-if="!scaled " class="title miniheight" :style="item.shortlabel=='其他'||item.shortlabel == '导航'? 'cursor: pointer;': ''"  @click.stop="getLabelOne($event)" >
          <i class="title-icon iconfont" v-html="item.icon"></i>
          <div class="label">
            <span v-if="item.label != '其他'">{{item.label}}</span>
            <span @click="directOther" style="display:block;width:100%;" v-else>其他</span>
            <el-tooltip v-if="item.tooltip" class="item tooltip" effect="light" placement="right-end" >
              <div slot="content" v-html="item.tooltip"></div>
              <i class="icon el-icon-question"></i>
            </el-tooltip>
          </div>
          <!-- <i class="arrow-icon iconfont">&#xe61c;</i> -->
          <i class="el-icon-arrow-right" v-if="item.groupList[0].group.length>0"></i>
        </div>
        <div v-else class="title" :style="item.shortlabel=='其他'||item.shortlabel == '导航'? 'cursor: pointer;': ''" @click.stop="getLabelTwo($event)">
          <i class="title-icon iconfont" v-html="item.icon"></i>
          <span class="short-label">{{item.shortlabel}}</span>
        </div>
        <div class="submenu" v-if="item.type != 2"  >
          <template v-for="lists in item.groupList">
            <span class="group-title" v-html="lists.label"></span>
            <ul class="group-list">
              <li v-for="list in lists.group">
                <router-link class="group-item" tag="a" :to="'/'+list.href" :title="list.title" v-if="list.href.indexOf('http') != 0">
                  <i class="iconfont li-style">&#xe757;</i>
                  <span v-html="list.label" :class="{'internal': list.internal}"></span>
                  <span :class="navStatus(list.navlabel)">{{statusIcon(list.navlabel)}}</span>
                </router-link>
                <a class="group-item" :href="list.href" :title="list.title" target="_blank" v-else>
                  <i class="iconfont li-style">&#xe757;</i><span v-html="list.label" :class="{'internal': list.internal}"></span>
                </a>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    </el-scrollbar>
  </div>
</template>

<script>
const PinyinMatch = require("pinyin-match")
import { debug, debuglog } from 'util';
import { mapState } from 'vuex'
import detailScrollMixins from "@/mixins/detailScroll";

export default {
  mixins: [detailScrollMixins],
  name: 'LaMenu',
  data () {
    return {
      scaled: this.$route.path.split('/')[1] !== 'home',
      input: '',
      menuList:[],
      resultList: [],
      path: this.$route.path,
      allList: [],
      isNavMore: false,
    }
  },
  computed: {
    ...mapState({
      navMapData: state => state.Nav.navMapData,
      allNavMapList: state => state.Nav.allNavMapList,
      userData: state => state.UserCenter.accountData,
      showPromtNotice: state => state.showPromtNotice
    })
  },
  watch: {
    $route () {
      this.changeScaled()
    },
    input: window._.debounce(function(val){
      this.getSearchResult()
      Store.commit("Nav/updateValue",val)
      this.isNavMore = this.allNavMapList.length>this.allList.length
    },300),
    userData () {
      this.getNavData()
    },
    showPromtNotice: {
      handler(val) {
        document.querySelector(".la-menu").style.paddingTop = (val ? 78 : 48) + 'px';
      }
    }
  },
  methods: {
    getNavData() {
      let that = this
      window.Axios({
        method: 'get',
        url: '/api/config/nav'
      }).then(res=>{
        this.menuList = []
        let data = res.data.data;
        let iconConfig = this.iconConfig
        let userGradeId = this.userData.grade_id
        let isInside = this.insideUserList.indexOf(userGradeId) > -1
        data.forEach((item) => {
          let iconList = _.find(iconConfig,{label:item.label})
          item.icon = iconList.icon
          let list = JSON.parse(JSON.stringify(item))
          let groupList = list.groupList[0].group = []
          item.groupList[0].group.forEach((items) => {
            if (isInside) {
              if (items.internal) {
                items.label += "（内）"
              }
            } else {
              if(items.internal) {
                return
              }
            }
            groupList.push(items)
          })
          this.menuList.push(list)

        })

        try {
          that.frontEndLog(that.$route.path, {
            handlerType: 'refresh',
            handlerTypeDesc: '首页导航数据为空',
            token: GETCOOKIEFUN("accesstoken")
          })
        } catch (error) {
          console.info(error)
        }
      }).catch ((error)=>{
        console.info(error)
      })
    },
    goNav() {
      ga("send", "event", "button", "click","sidebarnav_searchresults_more")
      window._paq.push(['trackEvent', 'button', 'click',  "sidebarnav_searchresults_more", ])

      Store.commit("Nav/setKeyValue",this.input)
      if(this.$route.name==='database_nav_index') {
        this.scaled = true
        this.input = ""
      }else{
        this.$router.push({
          path:'/nav'
        })
      }
    },
    getNavMapData() {
      if(this.navMapData.length===0){
        Store.dispatch("Nav/getNavMapData")
      }
    },
    // 切换数据库导航样式
    swicthMenu () {
      if (this.$route.path.split('/')[1] !== 'home'/* && this.$route.path.split('/')[1] !== 'literature' */ ) {
        this.scaled = !this.scaled;
      }
    },
    changeScaled () {
      this.scaled = this.$route.path.split('/')[1] !== 'home' /* && this.$route.path.split('/')[1] !== 'literature' */
      this.input = ''
    },
    // 显示搜索结果
    getSearchResult (){
      let value = this.input.trim().toUpperCase()
      let mnl = this.menuList
      let length = this.menuList.length
      let theArr = []
      let allList = []
      // 输入不为空时，显示搜索的结果
      if (value !== '') {
        for (let i = 0; i < length; i++) {
          let getOne = (mnl[i].groupList instanceof Array) ? mnl[i].groupList[0] : Object.values(mnl[i].groupList)[0]
          let groupBefore = []
          let getOneGroup = getOne.group

          for (let item of getOneGroup) {
            if (item.label.toUpperCase().indexOf(value) !== -1||PinyinMatch.match(item.label,value)) {
              groupBefore.push(item)
              allList.push(item)
            }
          }
          // 某类中含有搜索结果时，采push到数组内
          if (groupBefore.length !== 0) {
            // 要添加进去的新建对象
            let addIn = {
              "label": getOne.label,
              "group": groupBefore
            }
            theArr.push(addIn)
          }
        }
        this.resultList = theArr
        this.allList = allList
        $('#search-res').show()
      } else {
        $('#search-res').hide()
      }
    },
    colorKeyword(word, key, isInternal) { // 高亮关键词
      word = word.replace(key, `<span style='color:#ffab2a'>${key}</span>`)
      return word
    },
    getLabelOne(e){
      // let labelVal=e.target.children[1].firstChild.innerText
       let labelVal=e.currentTarget.children[1].firstChild.innerText
      if(labelVal == 'VIP尊享' ){
        this.$router.push({
          path:'/literature'
        })
      }
      if(labelVal == '导航地图' ){
        this.$router.push({
          path:'/nav'
        })
      }

    },
    getLabelTwo(e){
      let labelVal=e.currentTarget.lastChild.innerText
      if(labelVal == '其他' ){
        this.$router.push({
          path:'/literature'
        })
      }
      if(labelVal == '导航' ){
        this.$router.push({
          path:'/nav'
        })
      }
    },
    statusIcon(status) {
      switch(status) {
        case 1: return '【新】'; break;
        case 2: return '【热】'; break;
        case 3: return '【荐】'; break;
        default: return ''; break;
      }
    },
    navStatus(label) {
      return label==1? 'new': label==2? 'hot': 'recommand';
    },
    directOther() {
      this.$router.push({
        path: '/literature'
      })
    }
  },
  created(){
    if(this.userData.grade_id){
      this.getNavData()
    }
  },
  mounted() {
    if (document.querySelector(".la-menu")) document.querySelector(".la-menu").style.paddingTop = (this.showPromtNotice ? 78 : 48) + 'px';
    if (document.querySelector(".la-left-side")) document.querySelector(".la-left-side").style.top = (this.showPromtNotice ? 78 : 48) + 'px';
  }
}

</script>

<style lang="less" scoped>
  @import "~@/assets/less/var.less";
  @width: 295px;
  @titlewidth: 50px;
  @labelwidth: 200px;
  @height: 100%;

  i {
    user-select: none; // iconfont（i标签内）不能被选中
  }
  .new {
    color: #90c31f;
  }
  .hot {
    color: #ff1f01;
  }
  .recommand {
    color: #f5a623;
  }
  .internal {
    color: @MenuOrange;
  }
  .la-menu{
    position: fixed;
    box-sizing: border-box;
    width: 301px;
    left: 0px;
    top: 0px;
    padding-top: 48px;
    z-index: 1998;
    min-height: @height;
    border-right: 1px solid @BorderColor;
    background-color: @menuBackgroundColor;
    box-shadow: @BoxShadow;

    .el-scrollbar {
      position: absolute;
      height: 100%;
      overflow: visible;
    }
    .el-scrollbar__wrap {
      overflow-x:hidden;
    }

    .la-menu-search{
      .at-home {
        .title-icon {
          display: none!important;
        }
        .search-input {
          margin-left: 18px;
          width: @labelwidth + 50px!important;
        }
      }
      .title {
        padding: 0px;

        .title-icon {
          display: inline-block;
          width: @titlewidth;
          text-align: center;
          cursor: pointer;
        }
        .search-input {
          height: @InputLineHeight;
          width: @labelwidth + 10px;
          padding: 10px 0px;
          .el-input--small .el-input__inner{
            border-radius: 15px;

          }
          .el-input__inner{
            background-color: @InputBgColor;

          }
        }
      }

    }
    .menu-item{// box-sizing: border-box;
      user-select: none; // 不能被选中为文字
      width: @width;
      border: none;
      &:hover, &.hover{
        background: @menuHoverBackgroundColor;
        .title{
          color: @White;
        }

        .submenu{
          display: block;
        }
      }
      .title{
        box-sizing: border-box;
        height: 55px;
        width: @width;
        padding: 0px;
        font-size: @FontSize;
        color: @FontColor;
        // border-bottom: 1px solid #eee;
        line-height: 50px;
        text-align: left;
        // cursor: pointer ;
       &.titlehover{
         cursor:pointer;
       }
        &:hover{
          color: @White;
          background-color: @menuHoverBackgroundColor;
        }
        .title-icon{
          display: inline-block;
          width: @titlewidth;
          text-align: center;
        }
        .label{
          display: inline-block;
          width: @labelwidth;
           .titlehover:hover{
          cursor: pointer;
        }
        }
        .tooltip{
          color: @Green;
        }
      }
      .miniheight{
        height:50px !important;
        position: relative;
        z-index: 2001;
      }

    }
    .submenu{
      z-index: 2001;
      display: none;
      position: absolute;
      top: @Space + 5px;
      left: @width;
      width: 267px;
      height: calc(@height - @Space - 48px);
      background-color: @menuHoverBackgroundColor;
      color: @White;
      overflow: auto;
      .group-title{
        display: block;
        width: 217px;
        padding: 20px 20px 5px 30px;
        font-size: @FontSizeSmall + 2;
      }
      .group-list{
        li{
          font-size: @FontSizeSmall;
          height: 30px;
          line-height: 30px;
          padding: 0px;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          // transition: background-color 100ms;
          .group-item {
            // 注意：z-inde只在position为非static（默认）的情况下生效
            position: relative;
            text-decoration: none;
            color: @White;
            display: inline-block;
            width: 100%;
            height: 100%;
            padding: 0px 10px 0px 25px;
            box-sizing: border-box;
            // z-index: 100;
            .li-style{
              font-size: @FontSize + 2;
              vertical-align: middle;
            }
            a{
              color: @White;
              text-decoration: none;
            }
          }
          // &::after {
          //   content: '';
          //   position: absolute;
          //   right: -100%;
          //   top: 0;
          //   width: 100%;
          //   height: 30px;
          //   background: @PrimaryColor;
          //   transition: right 200ms;
          //   z-index: 1;
          // }
          &:hover{
            // &::after{
            //   right: 0px;
            //   transition: right 200ms;
            // }
            background-color: @PrimaryColor;
            // transition: background-color 300ms;
          }
        }
      }
    }
    &.la-menu-scaled{
      width: 51px!important;
      height: calc(100vh - 48px);
      box-shadow: none;
      .la-menu-search{
        .title{
          height: 55px;
          line-height: 55px;
          &:hover{
            background-color: @menuHoverBackgroundColor;
          }
        }
      }
      .menu-item,.la-menu-search{
        width:  @titlewidth;
        .title{
          width: @titlewidth;
          text-align: center;
          &:hover{
            color: @White;
            .title-icon{
              position: relative;
              top: -7px;
            }
           .short-label{
              display: block;
            }
          }
          .title-icon{
            position: relative;
            // top: 0px;
            top: -7px;
            display: inline-block;
            vertical-align: middle;
            transition: all 200ms;
          }
          .short-label{
            margin-top: -25px;
            // display: none;
            display: block;
            font-size: @FontSizeSmall;
            line-height: 24px;
            transition: all 200ms;
          }

        }
      }
      .submenu{
        // left: @titlewidth;
        left: 42px;
      }
    }
  }
  #search-res {
    display: none;
    .title {
      background: #35384a;
      color: #fff;
    }
    .submenu {
      z-index: 190!important;
      display: block;
      overflow: auto;
      .menu-nodata {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0px 12px;
        img {
          display: block;
          padding-top: 130px;
          padding-bottom: 10px;
        }
        .msg {
          color: #fff;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }
.nav-link {
  display: block;
  color: #ffab2a;
  margin: 20px 0 0 28px;
  text-decoration: underline;
  cursor: pointer;
}
.nav-link-center {
  text-align: center;
  margin: 10px 0 0 0;
}
</style>
