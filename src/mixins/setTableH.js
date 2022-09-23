export default {
  data () {
    return {
    }
  },
  methods: {
    calHtable (num) {
      setTimeout(() => {
        const h0 = document.documentElement.clientHeight
        const h1 = $('.la-header').outerHeight() || $('.la-header-globaldrugs').outerHeight()
        const h2 = $('.sec1').outerHeight()
        const h3 = $('.la-body-tab').outerHeight()
        const h4 = $('.la-optioned').outerHeight()
        const h5 = $('.el-tabs__header').outerHeight()
        const h6 = num>=0?num:58 // $('.el-pagination').outerHeight() 分页高度写定58

        const h7 = $('.actions').outerHeight()
        const h8 = $('.card-hand').outerHeight() // 药物报告
        const h9 = $('.cate-search').outerHeight() // 全球临床试验数据库-分类浏览

        let h =  h0 - (h1?h1:0) - (h2?h2:0) - (h3?h3:0) - (h4?h4:0) - (h5?h5:h7?h7:0) - (h8?h7?h8-h7:h8:0) - (h9?h9:0) - h6
        if (this.$route.path.indexOf('globaldrugs')>-1) {
          h = h - 30

          if (h4>0) {
            h = h + h4
          }
          console.log(h);
        }
        // console.log(h0, h1, h2, h3, h4, h5, h6, h7, h8)
        this.tableHeight = h
        // 解决tab切换
        $('.not-loading>.item_content1>.el-table').css({ // 单表
          height: h
        })
        $('.not-loading>.el-table').css({
          height: h
        })
        $('.drug-lists').css({
          height: h,
          overflowY: 'auto'
        })

        let gHeight = 10 // 表格滚动条设置的为10px，所以赋值默认为10
        let ua = navigator.userAgent.toLowerCase();  //获取用户端信息
        let info = {
            ie : /msie/ .test(ua) && !/opera/ .test(ua),  //匹配IE浏览器
            op : /opera/ .test(ua),  //匹配Opera浏览器
            sa : /version.*safari/.test(ua),  //匹配Safari浏览器
            ch : /chrome/.test(ua),  //匹配Chrome浏览器
            ff : /gecko/.test(ua) && !/webkit/.test(ua)  //匹配Firefox浏览器
        }
        // 修改滚动条的样式不兼容ie和火狐，所以需要单独处理
        if(info.ie || info.ff) {
          gHeight = 16
        }
        // console.log(gHeight)
        // console.log(this.vuex_name);
        // 处理表格底部和右边滚动条导致表格错位问题
        const tableWrapper = document.querySelector('.el-table__body-wrapper')
        const tableBody = document.querySelector('.el-table__body')
        // console.log(tableBody)
        const colgroup = document.querySelector("colgroup");
        /**
          * (以下数值为滚动条高度，可以自己根据情况通过class重新修改)
          */
        //内容大于容器时
        if (!tableBody) return
        if (this.$route.path.indexOf('globaldrugs')>-1) return
        if (tableBody.clientWidth > tableWrapper.offsetWidth) {

          //设置x轴滚动
          tableWrapper.style.overflowX = 'auto'
          //解决固定列错位 （没有错位的可以忽略以下内容）
          let fixedWrap = document.querySelector('.el-table .el-table__fixed-body-wrapper')
          if (fixedWrap) {
            fixedWrap.style.paddingBottom = gHeight + 'px'
            fixedWrap.style.height = `calc(100% - ${gHeight*3}px)`
            console.log(fixedWrap.getBoundingClientRect().height)
          }
          //解决固定列覆盖滚动条
          let fixed_left = document.querySelector('.el-table .el-table__fixed')
          let fixed_right = document.querySelector('.el-table .el-table__fixed-right')
          if (fixed_left) {
          fixed_left.style.height = `calc(100% - ${gHeight}px)`
          }
          if (fixed_right) {
          fixed_right.style.height = `calc(100% - ${gHeight}px)`
          }
          //解决表头偏移
          //没有原生的gutter时自己新增一个
          const gutter = colgroup.querySelector(`col[name=gutter]`)
          const gutterx = colgroup.querySelector(`col[name=gutterx]`)
          if (!gutter && !gutterx) {
          let col = document.createElement('col')
          col.setAttribute('name', 'gutterx')
          col.setAttribute('width', `${gHeight}`)
          colgroup.appendChild(col)
          }
        }
      }, 300)
    },
    regFoldEven (num) {
      let shElement = $('.sh')
      let optionedE = $('.la-optioned')
      let tabsNav = $('.el-tabs__nav')

      shElement.hide()
      optionedE.removeAttr('style').removeAttr('attr-hid')

      let oph = optionedE.innerHeight()
      if(oph <= 46 || oph == 55){
      }else{
        shElement.html('&#xe60c;').show()
        shElement.unbind().click(() => {
          if(optionedE.attr('attr-hid')){
            optionedE.removeAttr('style').removeAttr('attr-hid')
            shElement.html('&#xe60c;')

            this.calHtable(num)
          }else{
            optionedE.attr('attr-hid', 1).css({
              'height': '45px',
              'overflow': 'hidden'
            })
            shElement.html('&#xe67f;')

            this.calHtable(num)
          }
        })
      }

      if(tabsNav.length){
        tabsNav.unbind().click(() => {
          this.calHtable(num)
        })
      }

      let card = $('.card-hand')
      if(card.outerHeight()){
        card.unbind().click(() => {
          this.calHtable(num)
        })
      }
    },
    registerEven (num) {
      this.regFoldEven(num)
      this.calHtable(num)
    }
  }
}
