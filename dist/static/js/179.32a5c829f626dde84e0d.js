webpackJsonp([179],{TVRb:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=e("4YfN"),i=e.n(n),s=e("ZJ3O"),r=e("mFEs"),l=e("KY3a"),d=e("xDdP"),o=e("nYX6"),p=e("bSIt"),c=e("VVWQ"),v=o.a.cfdadrug.Detailfdadrugxq,f=o.a.cfdadrug.Detailyssq,h=o.a.cfdadrug.Detailspls,b={components:{SlideSection:r.a,LaFooter:d.a,ExtendButton:l.a,LoadingGif:s.a},mixins:[c.a],data:function(){return{isLoading:!0,isLoadingNum:4,id:"",data:{},scroll:"",heightArr:[],hasPartOne:!0,hasPartTwo:!1,hasPartThree:!1,hasPartFour:!1,hasExtend:!1,yfxx:{},jbxx:{List:{},Title:{}},ypxxListData:{List:[],tableHead:v},lsspListData:{list:[],tableHead:f},splsListData:{list:[],tableHead:h},sull:"",pass:"",passtwo:"",passthree:"",extendList:[]}},computed:i()({},Object(p.b)({nopms:function(t){return t.FdaDrug.nopms},allBase:function(t){return t.FdaDrug.allBase},helpInfo:function(t){return t.FdaDrug.helpInfo}})),methods:{handleAAA:function(t){return-1!==t.indexOf("/appletter/")?"Letter":-1!==t.indexOf("/label/")?"Label":-1!==t.indexOf("/nda/")?"Review":void 0},handleAxiosJbxxList:function(){var t=this;window.Axios({method:"get",url:"/api/fdadrug/"+this.$route.params.id,params:{accesstoken:GETCOOKIEFUN("accesstoken")}}).then(function(a){if(200===a.data.code&&a.data){var e=a.data.data;t.jbxx=e,t.getExtendList("fdadrug",e.extendList)}}).then(this.removeLoading)},LoadListData:function(){var t=this;window.Axios({method:"get",url:"/api/fdadrug/getLssp?id="+this.$route.params.id}).then(function(a){if(200===a.data.code&&a.data.data){var e=a.data.data;t.lsspListData.list=e.list;var n=t.lsspListData.list[0].applicationdocsurl?t.lsspListData.list[0].applicationdocsurl.split("/"):"";t.pass=n?n[4]:""}}).then(this.removeLoading)},LoadSplsData:function(){var t=this;window.Axios({method:"get",url:"/api/fdadrug/getSpls?id="+this.$route.params.id}).then(function(a){if(200===a.data.code&&null!==a.data.data){var e=a.data.data;t.splsListData.list=e.list,t.hasPartFour=!0}else t.hasPartFour=!1}).then(this.removeLoading)},handleAxios:function(){var t=this;Axios.get("/api/fdadrug/getYpxx?id="+this.$route.params.id).then(function(a){if(200===a.data.code&&a.data.data){var e=a.data.data;t.ypxxListData.List=e.List,t.hasPartOne=!0,t.hasPartTwo=!0,t.hasPartThree=!0}}).catch(function(t){}).then(this.removeLoading)},removeLoading:function(){this.isLoadingNum=this.isLoadingNum-1,this.isLoadingNum||(this.isLoading=!1)}},created:function(){var t=this;this.nopms.xqy||this.handleAxios(),this.LoadListData(),this.handleAxiosJbxxList(),this.LoadSplsData(),setTimeout(function(){var a=sessionStorage.getItem("hashLocation");window._paq.push(["setCustomUrl","https://"+a]),window._paq.push(["trackPageView",t.allBase.dbname]),window._paq.push(["setDocumentTitle",t.allBase.dbname])},1e3)},mounted:function(){Store.dispatch("FdaDrug/getBaseInfo")},activated:function(){this.vueRouteToNoPms(this.nopms.xqy)},updated:function(){this.vueRouteToNoPms(this.nopms.xqy),this.vueTogglePmsTooltip()}},x={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{ref:"wrapper",staticClass:"wrapper"},[t.isLoading?e("LoadingGif",{attrs:{loadFlag:t.isLoading}}):e("div",{staticClass:"detail-list"},[e("div",{staticClass:"detail-header"},[e("div",{staticClass:"header-left"},[e("div",{staticClass:"left-top"},[e("span",{staticClass:"top-id",attrs:{title:t.jbxx.Title.drugname}},[t._v(t._s(t.jbxx.Title.drugname))]),t._v(" "),e("span",{staticClass:"top-num"},[t._v(t._s(t.jbxx.Title.applno))]),t._v(" "),"否"!==t.jbxx.List.submissionpropertytypecode?e("span",{staticClass:"id-green"},[t._v(t._s(t.jbxx.Title.submissionpropertytypecode))]):t._e()])]),t._v(" "),e("div",{staticClass:"header-right"},[e("div",{staticClass:"breadcrumb-f"},[t.helpInfo.remark&&t.helpInfo.remark?e("el-tooltip",{staticClass:"help-tip",attrs:{effect:"light",placement:"bottom"}},[e("div",{attrs:{slot:"content"},slot:"content"},[e("el-scrollbar",[e("div",{staticClass:"tip-content",domProps:{innerHTML:t._s(t.helpInfo.remark?t.helpInfo.remark:"")}})]),t._v(" "),t.helpInfo.url?e("a",{staticClass:"btn default",attrs:{href:t.helpInfo.url,target:"_blank"}},[t._v("帮助中心")]):t._e()],1),t._v(" "),e("span",[e("i",{staticClass:"el-icon-warning cl-green"}),t._v(" 帮助")])]):t._e(),t._v(" "),e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",[e("a",{attrs:{href:"/home"}},[t._v("首页")])]),t._v(" "),t.allBase.catname?e("el-breadcrumb-item",[t._v(t._s(t.allBase.catname))]):t._e(),t._v(" "),e("el-breadcrumb-item",[e("a",{attrs:{href:"/"+t.allBase.dbename}},[t._v(t._s(t.allBase.dbname))])]),t._v(" "),e("el-breadcrumb-item",[e("span",{staticClass:"FontColor"},[t._v(t._s(t.jbxx.Title.drugname))])])],1)],1)])]),t._v(" "),e("div",{staticClass:"main"},[e("div",{staticClass:"left-nav"},[e("div",{staticClass:"nav-list nav-event",on:{click:t.handleNavClick}},[t.hasPartOne?e("a",{staticClass:"nav-item active"},[t._v("基本信息")]):t._e(),t._v(" "),t.hasPartTwo?e("a",{staticClass:"nav-item"},[t._v("与该申请号相关的药品信息")]):t._e(),t._v(" "),t.hasPartThree?e("a",{staticClass:"nav-item"},[t._v("原始申请或者临时审批")]):t._e(),t._v(" "),t.hasPartFour?e("a",{staticClass:"nav-item"},[t._v("审批历史")]):t._e(),t._v(" "),t.hasExtend?e("a",{staticClass:"nav-item"},[t._v("扩展信息")]):t._e()])]),t._v(" "),e("div",{staticClass:"right-list"},[t.hasPartOne?e("slide-section",{staticClass:"the-part",attrs:{title:"基本信息"}},[e("div",{staticClass:"tb-wrap"},[e("table",{staticClass:"tb-t"},[e("tr",[e("td",[t._v("申请类型")]),t._v(" "),e("td",[t._v(t._s(t.jbxx.List.appltype))])]),t._v(" "),e("tr",[e("td",[t._v("活性成分")]),t._v(" "),e("td",[t._v(t._s(t.jbxx.List.activeingredient))])]),t._v(" "),e("tr",[e("td",[t._v("申请机构")]),t._v(" "),e("td",[t._v(t._s(t.jbxx.List.sponsorname))])]),t._v(" "),e("tr",[e("td",[t._v("孤儿药")]),t._v(" "),e("td",[t._v(t._s(t.jbxx.List.submissionpropertytypecode))])]),t._v(" "),t.jbxx.List.targets?e("tr",[e("td",[t._v("靶点")]),t._v(" "),e("td",[t._v(t._s(t.jbxx.List.targets))])]):t._e()])])]):t._e(),t._v(" "),t.hasPartTwo?e("slide-section",{staticClass:"the-part",attrs:{title:"与该申请号相关的药品信息"}},[e("div",{staticClass:"tb-wrap"},[e("el-table",{staticClass:"table",staticStyle:{width:"100%"},attrs:{data:t.ypxxListData.List,stripe:"",fixed:""}},t._l(t.ypxxListData.tableHead,function(a){return e("el-table-column",{key:a.prop,attrs:{prop:a.prop,"min-width":a.width,label:a.label},scopedSlots:t._u([{key:"default",fn:function(n){return["drugname"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.drugname)+"\n                    ")]):t._e(),t._v(" "),"activeingredient"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.activeingredient)+"\n                    ")]):t._e(),t._v(" "),"strength"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.strength)+"\n                    ")]):t._e(),t._v(" "),"form"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.form)+"\n                    ")]):t._e(),t._v(" "),"marketingstatusid"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.marketingstatusid)+"\n                    ")]):t._e(),t._v(" "),"referencedrug"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.referencedrug)+"\n                    ")]):t._e(),t._v(" "),"referencestandard"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.referencestandard)+"\n                    ")]):t._e(),t._v(" "),"tecode"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.tecode)+"\n                    ")]):t._e()]}}],null,!0)})}),1)],1)]):t._e(),t._v(" "),t.hasPartThree?e("slide-section",{staticClass:"the-part",attrs:{title:"原始申请或者临时审批"}},[e("div",{staticClass:"tb-wrap"},[e("el-table",{staticClass:"table",staticStyle:{width:"100%"},attrs:{data:t.lsspListData.list,stripe:"",fixed:""}},t._l(t.lsspListData.tableHead,function(a){return e("el-table-column",{key:a.prop,attrs:{prop:a.prop,"min-width":a.width,label:a.label},scopedSlots:t._u([{key:"default",fn:function(n){return["submissionstatusdate"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissionstatusdate)+"\n                    ")]):t._e(),t._v(" "),"submissiontype"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissiontype)+"\n                    ")]):t._e(),t._v(" "),"submissionstatus"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissionstatus)+"\n                    ")]):t._e(),t._v(" "),"submissionclasscode"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissionclasscode)+"\n                    ")]):t._e(),t._v(" "),"reviewpriority"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.reviewpriority)+"\n                    ")]):t._e(),t._v(" "),"applicationdocsurl"===a.prop?e("div",[e("span",{domProps:{innerHTML:t._s(n.row.url)}})]):t._e()]}}],null,!0)})}),1)],1)]):t._e(),t._v(" "),t.hasPartFour?e("slide-section",{staticClass:"the-part",attrs:{title:"审批历史"}},[e("div",{staticClass:"tb-wrap"},[e("el-table",{staticClass:"table",staticStyle:{width:"100%"},attrs:{data:t.splsListData.list,stripe:"",fixed:""}},t._l(t.splsListData.tableHead,function(a){return e("el-table-column",{key:a.prop,attrs:{prop:a.prop,"min-width":a.width,label:a.label},scopedSlots:t._u([{key:"default",fn:function(n){return""!==n.row.submissiontype?["submissionstatusdate"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissionstatusdate)+"\n                    ")]):t._e(),t._v(" "),"submissiontype"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissiontype)+"\n                    ")]):t._e(),t._v(" "),"submissionno"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissionno)+"\n                    ")]):t._e(),t._v(" "),"submissionclasscode"===a.prop?e("div",[t._v("\n                      "+t._s(n.row.submissionclasscode)+"\n                    ")]):t._e(),t._v(" "),"applicationdocsurl"===a.prop?e("div",t._l(n.row.applicationdocsurl,function(a,n){return e("p",{key:n},[e("a",{staticStyle:{color:"#4877e8"},attrs:{href:a,target:"_blank"}},[e("div",{domProps:{innerHTML:t._s(t.handleAAA(a))}})])])}),0):t._e()]:void 0}}],null,!0)})}),1)],1)]):t._e(),t._v(" "),t.hasExtend?e("slide-section",{staticClass:"the-part",attrs:{title:"扩展信息"}},[e("div",{staticClass:"extend-list"},t._l(t.extendList,function(t,a){return e("ExtendButton",{key:a,attrs:{item:t}})}),1)]):t._e()],1)])])],1)},staticRenderFns:[]};var m=e("C7Lr")(b,x,!1,function(t){e("muOD")},"data-v-06d80a24",null);a.default=m.exports},kGcU:function(t,a,e){(t.exports=e("UTlt")(!1)).push([t.i,'\n.el-input__inner[data-v-06d80a24]::-webkit-input-placeholder {\n  color: #A9ADB7;\n}\n.el-input__inner[data-v-06d80a24]::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #A9ADB7;\n}\n.el-input__inner[data-v-06d80a24]:-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #A9ADB7;\n}\n.el-input__inner[data-v-06d80a24]:-ms-input-placeholder {\n  /* Internet Explorer 10-11 */\n  color: #A9ADB7;\n}\n.el-checkbox__label[data-v-06d80a24] {\n  padding-left: 6px;\n  font-size: 12px;\n}\n.el-checkbox[data-v-06d80a24] {\n  font-size: 12px;\n  color: #545B6D;\n}\n.el-input[data-v-06d80a24] {\n  font-size: 12px;\n}\ninput.el-input__inner[data-v-06d80a24] {\n  border-color: #DFE5F1;\n}\nbutton.border-color[data-v-06d80a24] {\n  border-color: #DFE5F1;\n}\n.el-checkbox__inner[data-v-06d80a24] {\n  width: 12px;\n  height: 12px;\n  border-color: #DFE5F1;\n}\n.el-checkbox__inner[data-v-06d80a24]::after {\n  top: 0;\n}\n.el-select-dropdown__item[data-v-06d80a24] {\n  font-size: 12px;\n}\n/*主色为蓝色系*/\n/* @PrimaryBackgroundColor: hsl(hue(@PrimaryColor), 100%, 96%); */\n/*字体颜色*/\n/* 通用头部head部分样式 */\n/* @BorderColor: hsl(hue(@PrimaryColor), 20%, 80%); */\n/* table */\n/* @ThBackgroundColor: hsl(hue(@PrimaryColor)+12, 33%, 96%); */\n/* detail列表详情下的table */\n/* detail列表详情下的slide-section */\n/* detail列表详情下的slide-section 时光轴样式 */\n.wrapper[data-v-06d80a24] {\n  min-width: 1231px;\n}\n.wrapper .linkPrimaryColor[data-v-06d80a24] {\n  color: #4877e8;\n}\n.wrapper .detail-list[data-v-06d80a24] {\n  position: relative;\n  padding: 0 10px 0 10px;\n}\n.wrapper .detail-list .detail-header[data-v-06d80a24] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  height: 40px;\n}\n.wrapper .detail-list .detail-header .header-left[data-v-06d80a24] {\n  padding-bottom: 5px;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n}\n.wrapper .detail-list .detail-header .header-left .left-top[data-v-06d80a24] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: calc(100vw - 30px);\n}\n.wrapper .detail-list .detail-header .header-left .top-id[data-v-06d80a24] {\n  max-width: 60vw;\n  display: inline-block;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  height: 22px;\n  line-height: 20px;\n  font-size: 18px;\n  font-family: Source Han Sans CN;\n  font-weight: bold;\n  color: #545b6d;\n  margin-right: 30px;\n}\n.wrapper .detail-list .detail-header .header-left .top-num[data-v-06d80a24] {\n  display: inline-block;\n  font-size: 16px;\n  line-height: 1;\n  font-weight: bold;\n  margin-right: 10px;\n  white-space: nowrap;\n}\n.wrapper .detail-list .detail-header .header-left .top-name[data-v-06d80a24] {\n  display: inline-block;\n  font-size: 20px;\n  line-height: 1;\n  margin-right: 10px;\n  white-space: nowrap;\n}\n.wrapper .detail-list .detail-header .header-left .id-green[data-v-06d80a24] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0 10px;\n  border-radius: 10px;\n  height: 22px;\n  line-height: 22px;\n  background: #90c31f;\n  color: #fff;\n  white-space: nowrap;\n  font-size: 12px;\n  font-family: Microsoft YaHei;\n  font-weight: 400;\n  margin-left: 0;\n}\n.wrapper .detail-list .detail-header .header-left span.id-green + span.id-green[data-v-06d80a24] {\n  margin-left: 20px !important;\n}\n.wrapper .detail-list .detail-header .header-left .bg-blue[data-v-06d80a24] {\n  background: #4877e8;\n}\n.wrapper .detail-list .detail-header .header-left .bg-green[data-v-06d80a24] {\n  background: #90c31f;\n}\n.wrapper .detail-list .detail-header .header-left .bg-orange[data-v-06d80a24] {\n  background: #f77d54;\n}\n.wrapper .detail-list .detail-header .header-left .left-bottom[data-v-06d80a24] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n  white-space: nowrap;\n  margin-right: 20px;\n}\n.wrapper .detail-list .detail-header .header-left .left-bottom .bottom-name[data-v-06d80a24] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 13px;\n  margin-left: 0;\n  height: 20px;\n  line-height: 20px;\n  font-family: Source Han Sans CN;\n  font-weight: 400;\n  color: #606266;\n  white-space: nowrap;\n}\n.wrapper .detail-list .detail-header .header-left .left-bottom .company-name[data-v-06d80a24] {\n  margin-left: 20px;\n  margin-right: 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 13px;\n  height: 20px;\n  line-height: 20px;\n  font-family: Source Han Sans CN;\n  font-weight: 400;\n  color: #4877e8;\n}\n.wrapper .detail-list .detail-header .header-left .left-bottom .company-name a[data-v-06d80a24] {\n  color: #4877e8;\n}\n.wrapper .detail-list .detail-header .header-left .left-bottom[data-v-06d80a24] .el-breadcrumb {\n  margin-top: 2px;\n}\n.wrapper .detail-list .detail-header .header-left .fontw[data-v-06d80a24] {\n  font-weight: 700;\n}\n.wrapper .detail-list .detail-header .header-right .breadcrumb-f[data-v-06d80a24] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: end;\n      -ms-flex-align: end;\n          align-items: flex-end;\n}\n.wrapper .detail-list .detail-header .header-right .breadcrumb-f[data-v-06d80a24] .el-breadcrumb {\n  display: block;\n  padding-right: 0;\n}\n.wrapper .detail-list .detail-header .header-right .breadcrumb-f .help-tip[data-v-06d80a24] {\n  margin-right: 5px;\n  display: inline-block;\n  line-height: 1;\n}\n.wrapper .detail-list .header-fixed[data-v-06d80a24] {\n  width: 100%;\n  position: fixed;\n  z-index: 99;\n  background: #eff2fa;\n  padding: 20px 10px 15px 10px;\n  right: 0;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  -webkit-box-shadow: 0px 0px 10px 2px #c4d3f8;\n          box-shadow: 0px 0px 10px 2px #c4d3f8;\n}\n.wrapper .detail-list .anim-none[data-v-06d80a24] {\n  -webkit-animation: none;\n          animation: none;\n}\n.wrapper .detail-list .main[data-v-06d80a24] {\n  position: relative;\n  -webkit-transition-property: marginTop;\n  transition-property: marginTop;\n  -webkit-transition-duration: 1s;\n          transition-duration: 1s;\n}\n.wrapper .detail-list .main .classified-in[data-v-06d80a24] {\n  position: relative;\n}\n.wrapper .detail-list .main .left-nav-in[data-v-06d80a24],\n.wrapper .detail-list .main .left-nav[data-v-06d80a24] {\n  position: fixed;\n  top: 88px;\n  left: 10px;\n}\n.wrapper .detail-list .main .left-nav-in .nav-list .nav-item[data-v-06d80a24],\n.wrapper .detail-list .main .left-nav .nav-list .nav-item[data-v-06d80a24] {\n  text-decoration: none;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 180px;\n  padding: 13px 0;\n  border-radius: 4px;\n  padding-left: 18px;\n  margin-left: 0px;\n  border-bottom: 1px solid #dfe5f1;\n  cursor: pointer;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  font-size: 14px;\n}\n.wrapper .detail-list .main .left-nav-in .nav-list .nav-item[data-v-06d80a24]:hover,\n.wrapper .detail-list .main .left-nav .nav-list .nav-item[data-v-06d80a24]:hover {\n  -webkit-transition: all 500ms;\n  transition: all 500ms;\n  margin-left: 0px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  width: 180px;\n  height: 100%;\n  background: #ffffff;\n  border-radius: 4px;\n  padding-left: 18px;\n  position: relative;\n  background: #fff;\n  border-bottom: none;\n  color: #4877e8;\n}\n.wrapper .detail-list .main .left-nav-in .nav-list .nav-item[data-v-06d80a24]:hover::before,\n.wrapper .detail-list .main .left-nav .nav-list .nav-item[data-v-06d80a24]:hover::before {\n  content: "";\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: #4877e8;\n  border-radius: 4px;\n}\n.wrapper .detail-list .main .left-nav-in .nav-list .active[data-v-06d80a24],\n.wrapper .detail-list .main .left-nav .nav-list .active[data-v-06d80a24] {\n  margin-left: 0px;\n  width: 180px;\n  padding-left: 18px;\n  position: relative;\n  background: #fff;\n  border-bottom: none;\n  color: #4877e8;\n  -webkit-box-shadow: 0px 0px 5px rgba(196, 211, 248, 0.9);\n          box-shadow: 0px 0px 5px rgba(196, 211, 248, 0.9);\n}\n.wrapper .detail-list .main .left-nav-in .nav-list .active[data-v-06d80a24]::before,\n.wrapper .detail-list .main .left-nav .nav-list .active[data-v-06d80a24]::before {\n  content: "";\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: #4877e8;\n  border-radius: 4px;\n}\n.wrapper .detail-list .main .right-list[data-v-06d80a24] {\n  padding-left: 190px;\n  padding-top: 50px;\n}\n@-webkit-keyframes headermove-data-v-06d80a24 {\nfrom {\n    -webkit-transform: translate(0, -100%);\n            transform: translate(0, -100%);\n}\nto {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0);\n}\n}\n@keyframes headermove-data-v-06d80a24 {\nfrom {\n    -webkit-transform: translate(0, -100%);\n            transform: translate(0, -100%);\n}\nto {\n    -webkit-transform: translate(0, 0);\n            transform: translate(0, 0);\n}\n}\n',""])},muOD:function(t,a,e){var n=e("kGcU");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);e("FIqI")("9fa02bd6",n,!0,{})}});