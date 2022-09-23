<template>
  <div class="search-box flexl" id="search-box">
    <div class="input-pre ">
      <input type="text" id="search-input" autocomplete="off" autofocus>
      <div class="search-number"><span id="search-num">0</span>/<span id="search-total">0</span>  </div>
    </div>
    <div id="search-up"  class="fleximg">
      <div class="arrow-img"></div>
    </div>  
     <div id="search-down" class="fleximg">
      <div class="arrow-img"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num:0
    };
  },
  props:{
    className:{
      type:String,
      required: true,
    }
  },
  mounted() {
    let _this=this
    this.$nextTick(()=>{

    
      var search_eles = null; //搜索结果元素集合
      var search_num = 0; //当前个数
      var search_total = 0; //所有查找个数

      //监听ctrl + f 事件
      $(document).unbind('keydown').bind('keydown', function(e) {
        if (e.ctrlKey && e.keyCode == 70) {
          $('#search-box').show()
          var val = $('#search-input').val();
          $('#search-input').val(val).select(); //选中当前input框
          txtSelection(val);
          return false;
        }
      })

      //实时监听输入框变化
      $("#search-input").on("input", function () {
        var val = $(this).val();
        if(val == ' ' || !val){
          reset()
          clearSelection()
        }else{
          txtSelection(val)
        }
        
        }).bind('keydown', function(e) { //实时监听输入框回车
        if (e.keyCode == 13) {
          downSelection();
          directingSelection();
          return false;
        }
      })

        //监听搜索按钮
        $('#search-btn').on('click', function() {
          var val = $("#search-input").val();
          console.log($("#search-input"))
          console.log($("#search-input").val())
        txtSelection(val)
        })
        

      //搜索高亮显示
      var txtSelection = function(searchText) { //searchText:搜索的关键字；
        if (!searchText) {
          return;
        }
        // let textRegx = /^[0-9\u4e00-\u9fa5]+$/;
        let textRegx = /^[\u4e00-\u9fa5]+$/;

        if(!textRegx.test(searchText)){
          return;
        }
        clearSelection();
        var regExp = new RegExp(searchText, 'g'); //创建正则表达式
        $(_this.className).each(function() { //这里的article为作用域，也可为body或.content
          var str = $(this).html();
          var newstr = str.replace(regExp, '<span class="search-highlight">' + searchText + '</span>'); //将找到的关键字替换，加上highlight属性；
          $(this).html(newstr); //替换
        });
        _this.num = Date.now()

        //统计查找结果
        search_eles = $('span.search-highlight');
        search_total = search_eles.length;
        $('#search-num').text(0);
        $('#search-total').text(search_total);
        if (search_total) {
          search_num = 0;
          directingSelection(); //指向第一个
        }

        // var search_num = 0; //当前个数
        // var search_total = 0; //所有查找个数


      }

      //向上查找
      var upSelection = function() {
        --search_num;
        if (search_num < 0) {
          search_num = search_total-1;
        }
      }
      $('#search-up').on('click', function() {
        if(!search_total){ return }
        upSelection();
        directingSelection();
      })

      //向下查找
      var downSelection = function() {
        ++search_num;
        if (search_num == search_total) {
          search_num = 0;
        }
      }
      $('#search-down').on('click', function() {
        if(!search_total){ return }
        downSelection();
        directingSelection();
      })


      //滚动到某一个高亮元素
      var directingSelection = function() {
        var num = search_num;

        search_eles.removeClass('class curlight')
        search_eles.eq(num).addClass('curlight');

        $('#search-num').text(num+1);
        let dom = document.getElementsByClassName('curlight')[0]
            dom.scrollIntoView({
              block:'end',  			
              behavior:'smooth'    //滚动动画
            })
        // $('html, body').animate({ //这里有可能是某个元素
        //         scrollTop: search_eles.eq(num).offset().top - 100
        //     }, 50);
      }


      //清空上一次高亮内容
      var clearSelection = function() {
        $(_this.className).each(function() { //选择器为作用域，也可为body或.content
          $(this).find('.search-highlight').each(function() { //找到所有highlight属性的元素；
            $(this).replaceWith($(this).html()); //将他们的属性去掉；
          });
        });
        
      }
      var reset = function(){
      $('#search-num').text(0);
        $('#search-total').text(0);
        search_eles=null
        search_num=0
        search_total=0
      }
      
    })
  },
  methods: {},
  watch:{
    num(){
      let _this=this
      $('.tag-item').on('click',function(){
        window.open('/policies/list?tag='+$(this).text() ,'_blank')
      })
       $('.type-item-name').on('click',function(){
        const routeLink = _this.$router.resolve({
          path: '/policies/list',
          query : {
            filter_condition: JSON.stringify({validity_type_cn:[$(this).text()]})
          }
        })
        window.open(routeLink.href, '_blank')
      })
    },
    
  }

};
</script>

<style lang="less">
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
    margin: 0 1px 0 1px;
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
.search-search-highlight { color: #DF9008; }
.curlight { background: #DF9008 !important; color: #FFFFFF;}
#search-up, #search-down { cursor: pointer; }

</style>
