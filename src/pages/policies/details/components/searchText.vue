<template>
  <div class="search-box flexl" id="search-box">
    <div class="input-pre ">
      <input type="text" autofocus id="search-input" v-model="inputValue" @input="inputChange" @keydown="enterBtn" autocomplete="off" placeholder="搜索关键词...">
      <div class="search-number"><span id="search-num">{{search_num}}</span>/<span id="search-total">{{search_total}}</span></div>
    </div>
    <div id="search-up" @click="upSearch" class="fleximg">
      <div class="arrow-img"></div>
    </div>  
    <div id="search-down" @click="downSearch" class="fleximg">
      <div class="arrow-img"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "searchText",
  props:{
    //正文文本
   text: {
      default: "",
      type: String,
    },
    //最原始的文本，恢复初始值时用到
    originalText: {
      default: "",
      type: String,
    },
    //页面的滚动距离，在父组件已经监听了，子组件中就不重复监听了，直接用父组件的数据
    scrollTop:{
      default: 0,
      type: Number,
    },
    //效力级别跳转的时候会用到，需要数据里面的tags
    catalogue:{
      default: [],
      type: Array,
    }
  },
  data() {
    return {
      search_eles: null,//搜索结果元素集合
      search_num: 0,//当前个数
      search_total: 0,//所有查找个数
      inputValue:this.$route.query.keywords,//输入框是初始值为页面url的keyword
    }
  },
  watch:{
    text(){
      let _this = this
      $('.type-item-name').on('click',function(){
        _this.doMatomo('企业版_政策法规_详情页_正文_效力级别')
        let tagIndex = ($(this)[0].dataset.tags).split(',')
        let tag = _this.catalogue[tagIndex[0]].children[tagIndex[1]].tags
        let str = tag[0]
        tag.splice(1,tag.length).forEach(item=>{
          str = `${str}&tag=${item}`
        })
        window.open('/policies/list?tag='+str+'&validity_type_cn='+ $(this).text(),'_blank')
      })
      $('.tag-item').on('click',function(){
        window.open('/policies/list?tag='+$(this).text() ,'_blank')
      })
      //进入页面url中有keyword时执行搜索，在法律法规详情页中需在监听到有文本传入才能执行，不然不起效果
      if(this.$route.query.keywords){
        this.searchDo()
      }
    }
  },
  mounted() {
    //进入页面url中有keyword时执行搜索，一般详情页中使用
    if(this.$route.query.keywords && this.$route.name=='database_policies_commondetail'){
      this.searchDo(()=>{//这里的回调函数是在搜索过后input不是什么原因失去了焦点，在回调里面再获取焦点
        setTimeout(()=>{
          $('#search-input').focus()
        },2000)
        
      })

    }
  },
  methods: {
    
    //搜索按钮
    searchDo(callback){
		  this.txtSelection(this.inputValue)
      callback && callback()
    },
    txtSelection(searchText){
      if (!searchText) {
        return;
      }
      let textRegx = /^[\u4e00-\u9fa5]+$/;
      if(!textRegx.test(searchText)){
        return;
      }
      this.clearSelection();
      var regExp = new RegExp(searchText, 'g'); //创建正则表达式
      let txt = this.originalText
      var newstr = txt.replace(regExp, '<font class="search-highlight">' + searchText + '</font>'); //将找到的关键字替换，加上search-highlight属性；
      this.$emit('update:text', newstr);
      // this.$emit('textChange',newstr)
      //统计查找结果
      this.$nextTick(()=>{
        this.search_eles = $('font.search-highlight');
        this.search_total = this.search_eles.length;
        this.search_num=0;
        if (this.search_total) {
          this.search_num = 0;
          this.directingSelection(); //指向第一个
        }
      })
      
    },
    inputChange(){
      // console.log(this.inputValue)
      // console.log(this.inputValue && 1)
      (!this.inputValue || this.inputValue == ' ') && this.clearSelection();
      (this.inputValue && this.inputValue != ' ') && this.txtSelection(this.inputValue);
    },
    clearSelection() {
      this.search_eles= null
      this.search_num= 0
      $('#search-num').text(0);
      this.search_total= 0
      this.$emit('update:text', this.originalText);
      // this.$emit('textChange',this.originalText)
    },
    //滚动到某一个高亮元素
	  directingSelection () {
      let _this = this;
      var num = this.search_num;
      this.search_eles.removeClass('class curlight')
      this.search_eles.eq(num).addClass('curlight');
      $('#search-num').text(num+1);
      let dom = document.getElementsByClassName('curlight')[0]
      //这个滚动动画失效了，采用了下面的方法
        // dom.scrollIntoView({
        //   block:'end',  			
        //   behavior:'smooth'    //滚动动画
        // })
      //元素不在可视区域才滚动，元素最小距离底部30px
      if ($(dom).offset().top >= window.innerHeight -30 || $(dom).offset().top<0) {
        $('.el-scrollbar__wrap,.el-scrollbar__wrap--hidden-default').animate({ 
          scrollTop: $(dom).offset().top - 150 + (_this.scrollTop ? _this.scrollTop+55:0) - (_this.showPromtNotice?30:0)
        }, 150,'linear'); 
      }
    },
    //向下查找
    downSelection() {
      this.search_num ++;
      if (this.search_num == this.search_total) {
        this.search_num = 0;
      }
    },
    downSearch(){
      if(!this.inputValue || this.inputValue == ' '){
        return
      }
      this.downSelection();
		  this.directingSelection();
    },
    //向上查找
    upSelection () {
      this.search_num -- ;
      if (this.search_num < 0) {
        this.search_num = this.search_total-1;
      }
    },
    upSearch() {
      if(!this.inputValue || this.inputValue == ' '){
        return
      }
      this.upSelection();
      this.directingSelection();
    },
    enterBtn(e){
      if(!this.search_total){return}
      if (e.keyCode == 13) {
        this.downSelection();
        this.directingSelection();
        return false;
      }
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

<style lang="less" >
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
#search-box {
  background: #fff; 
  .input-pre{
    width: 272px;
    position: relative;
    box-sizing: border-box;
    #search-input{
      width: 272px;
      height: 28px;
      background: #FFFFFF;
      border-radius: 3px;
      border: 1px solid #DCDFE6;
      padding-left: 10px;
      box-sizing: border-box;
    }
    .search-number{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5C6973;
      line-height: 20px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  #search-up{
    width: 28px;
    height: 28px;
    background: #EBEEF5;
    border-radius: 2px;
    margin: 0 1px 0 2px;
    .arrow-img{
      width: 10px;
      height: 6px;
      background: url(../../../../assets/imgs/policy/arrow_up.png) no-repeat;
    }
  }
  #search-up:hover{
    background: #DF9008;
    .arrow-img{
      width: 10px;
      height: 6px;
      background: url(../../../../assets/imgs/policy/arrow_up_white.png) no-repeat;
      background-size: 10px 6px;
    }
  }
  #search-down{
    width: 28px;
    height: 28px;
    background: #EBEEF5;
    border-radius: 2px;
    margin: 0 1px;
    .arrow-img{
      width: 10px;
      height: 6px;
      background: url(../../../../assets/imgs/policy/arrow_down.png) no-repeat;
    }
  }
  #search-down:hover{
    background: #DF9008;
    .arrow-img{
      width: 10px;
      height: 6px;
      background: url(../../../../assets/imgs/policy/arrow_down_white.png) no-repeat;
      background-size: 10px 6px;
    }
  }
}
.search-highlight { color: #DF9008; }
.curlight { background: #DF9008 !important; color: #FFFFFF;}
#search-up, #search-down { cursor: pointer; }
</style>
