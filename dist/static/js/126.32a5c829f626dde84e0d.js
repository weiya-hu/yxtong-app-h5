webpackJsonp([126],{"3b/E":function(t,n,e){var a=e("uRVL");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);e("FIqI")("52651c7b",a,!0,{})},onCJ:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e("lC5x"),i=e.n(a),s=e("J0Oq"),o=e.n(s),r=e("4YfN"),c=e.n(r),d=e("bSIt"),l={data:function(){return{fid:this.$route.params.id,data:{},new_suggest:""}},computed:c()({},Object(d.b)({uid:function(t){return t.UserCenter.uid},userName:function(t){return t.UserCenter.userName}})),methods:{handleAxios:function(){var t=this,n=this.fid.split("-");window.Axios({method:"get",url:"/api/usercenter/jyfkdetail",params:{accesstoken:this.vueGetCookie("accesstoken"),fid:n[0],msg_readid:n[1],id:n[0]}}).then(function(n){if(200===n.data.code&&n.data){var e=n.data.data;t.data=e,Store.dispatch("UserCenter/handleHeaderMsgAxios",{page:1,pageSize:5})}})},submitSuggest:function(){var t=this;return o()(i.a.mark(function n(){return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.Axios({method:"post",url:"/api/usercenter/jyfkzw",params:{accesstoken:t.vueGetCookie("accesstoken"),fid:t.fid,content:t.new_suggest}}).then(function(n){200===n.data.code?t.$message({message:"提交成功!",type:"success"}):t.$message({message:"提交失败!",type:"error"})}).catch(function(t){});case 2:t.new_suggest="",t.handleAxios();case 4:case"end":return n.stop()}},n,t)}))()}},created:function(){this.handleAxios(),setTimeout(function(){var t=sessionStorage.getItem("hashLocation");window._paq.push(["setCustomUrl","https://"+t]),window._paq.push(["trackPageView","建议反馈"]),window._paq.push(["setDocumentTitle","建议反馈"])},1e3)},updated:function(){$(".feedback-one-content img").css({"max-width":"510px"})}},p={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"mc"},[e("div",{staticClass:"left-nav"},[e("router-link",{staticClass:"nav-main-lan",attrs:{to:"/usercenter/suggest"}},[t._v("建议反馈    >")])],1),t._v(" "),e("div",{staticClass:"right-view"},[e("div",{staticClass:"section"},[t._m(0),t._v(" "),e("div",{staticClass:"sec-view"},t._l(t.data.res,function(n,a){return e("div",{key:a,staticClass:"lan",class:{"part-a":"A"===n.type,"part-q":"Q"===n.type}},[e("div",{staticClass:"time"},[t._v(t._s(n.time))]),t._v(" "),"Q"===n.type?e("div",{staticClass:"msg"},[e("div",{staticClass:"photo"},[e("img",{attrs:{src:t.vueGetCookie("userPicture")}})]),t._v(" "),e("div",{staticClass:"name"},[t._v(t._s(t.userName))])]):t._e(),t._v(" "),"A"===n.type?e("div",{staticClass:"msg"},[t._m(1,!0),t._v(" "),e("div",{staticClass:"name"},[t._v("药智客服")])]):t._e(),t._v(" "),e("div",{staticClass:"feedback-one-content",domProps:{innerHTML:t._s(n.content)}})])}),0)]),t._v(" "),e("div",{staticClass:"section"},[t._m(2),t._v(" "),e("div",{staticClass:"sec-view"},[e("el-input",{staticClass:"suggest_textarea",attrs:{type:"textarea",rows:6,placeholder:"请输入您的建议反馈..."},model:{value:t.new_suggest,callback:function(n){t.new_suggest=n},expression:"new_suggest"}}),t._v(" "),e("el-button",{staticClass:"tj-btn",attrs:{type:"primary",round:"",size:"medium"},on:{click:t.submitSuggest}},[t._v("提交")])],1)])])])},staticRenderFns:[function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"head"},[n("div",{staticClass:"title"},[n("i",{staticClass:"iconfont"},[this._v("")]),n("span",[this._v("反馈详情")])])])},function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"photo"},[n("img",{attrs:{src:"/static/imgs/usercenter/kefu.jpg"}})])},function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"head"},[n("div",{staticClass:"title"},[n("i",{staticClass:"iconfont"},[this._v("")]),n("span",[this._v("新增反馈")])])])}]};var v=e("C7Lr")(l,p,!1,function(t){e("3b/E")},"data-v-81f72dca",null);n.default=v.exports},uRVL:function(t,n,e){(t.exports=e("UTlt")(!1)).push([t.i,"\n.el-input__inner[data-v-81f72dca]::-webkit-input-placeholder {\n  color: #A9ADB7;\n}\n.el-input__inner[data-v-81f72dca]::-moz-placeholder {\n  /* Mozilla Firefox 19+ */\n  color: #A9ADB7;\n}\n.el-input__inner[data-v-81f72dca]:-moz-placeholder {\n  /* Mozilla Firefox 4 to 18 */\n  color: #A9ADB7;\n}\n.el-input__inner[data-v-81f72dca]:-ms-input-placeholder {\n  /* Internet Explorer 10-11 */\n  color: #A9ADB7;\n}\n.el-checkbox__label[data-v-81f72dca] {\n  padding-left: 6px;\n  font-size: 12px;\n}\n.el-checkbox[data-v-81f72dca] {\n  font-size: 12px;\n  color: #545B6D;\n}\n.el-input[data-v-81f72dca] {\n  font-size: 12px;\n}\ninput.el-input__inner[data-v-81f72dca] {\n  border-color: #DFE5F1;\n}\nbutton.border-color[data-v-81f72dca] {\n  border-color: #DFE5F1;\n}\n.el-checkbox__inner[data-v-81f72dca] {\n  width: 12px;\n  height: 12px;\n  border-color: #DFE5F1;\n}\n.el-checkbox__inner[data-v-81f72dca]::after {\n  top: 0;\n}\n.el-select-dropdown__item[data-v-81f72dca] {\n  font-size: 12px;\n}\n/*主色为蓝色系*/\n/* @PrimaryBackgroundColor: hsl(hue(@PrimaryColor), 100%, 96%); */\n/*字体颜色*/\n/* 通用头部head部分样式 */\n/* @BorderColor: hsl(hue(@PrimaryColor), 20%, 80%); */\n/* table */\n/* @ThBackgroundColor: hsl(hue(@PrimaryColor)+12, 33%, 96%); */\n/* detail列表详情下的table */\n/* detail列表详情下的slide-section */\n/* detail列表详情下的slide-section 时光轴样式 */\n.mc .right-view[data-v-81f72dca] {\n  float: right;\n  width: 1020px;\n}\n.mc .right-view .section .sec-view[data-v-81f72dca] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.mc .right-view .section .sec-view .tj-btn[data-v-81f72dca] {\n  width: 120px;\n  height: 30px;\n  line-height: 30px;\n  border-radius: 16px;\n  padding: 0px;\n  margin: 15px 0px;\n}\n.mc .right-view .section .sec-view .lan[data-v-81f72dca] {\n  width: 100%;\n  position: relative;\n  padding-top: 40px;\n}\n.mc .right-view .section .sec-view .lan .time[data-v-81f72dca] {\n  position: absolute;\n  top: 5px;\n  width: 100%;\n  height: 20px;\n  line-height: 20px;\n  text-align: center;\n  color: #a9adb7;\n  font-size: 12px;\n}\n.mc .right-view .section .sec-view .lan .msg[data-v-81f72dca] {\n  min-width: 67px;\n  padding-top: 70px;\n  position: relative;\n}\n.mc .right-view .section .sec-view .lan .msg .photo[data-v-81f72dca] {\n  position: absolute;\n  top: 0px;\n  left: 50%;\n  margin-left: -33px;\n  overflow: hidden;\n  width: 67px;\n  height: 67px;\n  border-radius: 34px;\n}\n.mc .right-view .section .sec-view .lan .msg .photo img[data-v-81f72dca] {\n  width: 67px;\n  height: 67px;\n  display: inline-block;\n}\n.mc .right-view .section .sec-view .lan .msg .name[data-v-81f72dca] {\n  text-align: center;\n  color: #a9adb7;\n  font-size: 13px;\n}\n.mc .right-view .section .sec-view .lan .feedback-one-content[data-v-81f72dca] {\n  min-height: 22px;\n  line-height: 22px;\n  padding: 18px 30px;\n  font-size: 13px;\n  border-radius: 10px;\n  position: relative;\n  max-width: 510px;\n  word-wrap: break-word;\n  margin-top: 5px;\n  margin-bottom: 30px;\n}\n.mc .right-view .section .sec-view .lan .feedback-one-content img[data-v-81f72dca] {\n  max-width: 510px;\n}\n.mc .right-view .section .sec-view .part-q .msg[data-v-81f72dca] {\n  float: right;\n}\n.mc .right-view .section .sec-view .part-q .feedback-one-content[data-v-81f72dca] {\n  float: right;\n  color: #35384a;\n  background: #eff2fa;\n  margin-right: 20px;\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n}\n.mc .right-view .section .sec-view .part-q .feedback-one-content img[data-v-81f72dca] {\n  max-width: 510px;\n}\n.mc .right-view .section .sec-view .part-q .feedback-one-content[data-v-81f72dca]::after {\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n  content: '';\n  position: absolute;\n  right: -8px;\n  top: 22px;\n  width: 0;\n  height: 0;\n  border-top: 8px solid transparent;\n  border-bottom: 8px solid transparent;\n  border-left: 8px solid #eff2fa;\n}\n.mc .right-view .section .sec-view .part-q .feedback-one-content[data-v-81f72dca]:hover {\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n  background: #dce2f4;\n}\n.mc .right-view .section .sec-view .part-q .feedback-one-content[data-v-81f72dca]:hover::after {\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n  border-left: 8px solid #dce2f4;\n}\n.mc .right-view .section .sec-view .part-a .msg[data-v-81f72dca] {\n  float: left;\n}\n.mc .right-view .section .sec-view .part-a .feedback-one-content[data-v-81f72dca] {\n  float: left;\n  color: #fff;\n  background: #97a2bf;\n  margin-left: 20px;\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n}\n.mc .right-view .section .sec-view .part-a .feedback-one-content img[data-v-81f72dca] {\n  max-width: 510px;\n}\n.mc .right-view .section .sec-view .part-a .feedback-one-content[data-v-81f72dca]::after {\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n  content: '';\n  position: absolute;\n  left: -8px;\n  top: 22px;\n  width: 0;\n  height: 0;\n  border-top: 8px solid transparent;\n  border-bottom: 8px solid transparent;\n  border-right: 8px solid #97a2bf;\n}\n.mc .right-view .section .sec-view .part-a .feedback-one-content[data-v-81f72dca]:hover {\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n  background: #a7b0c9;\n}\n.mc .right-view .section .sec-view .part-a .feedback-one-content[data-v-81f72dca]:hover::after {\n  -webkit-transition: all 300ms;\n  transition: all 300ms;\n  border-right: 8px solid #a7b0c9;\n}\n",""])}});