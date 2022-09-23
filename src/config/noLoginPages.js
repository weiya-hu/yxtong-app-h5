import Axios from 'axios';
import crypto from 'crypto-js';

// let obj = ['/login','/updatelog'];  //之前这种 登录后再跳到登录页 不会跳到首页  有问题
let obj = ['/updatelog','/introduce','/service', '/qs'];

function changeHref(_this,callback) {
  let router = _this.$route.path
  var flag = false
  if(typeof router == "string"){ 
    flag = obj.some((element) => {
      // if(router.indexOf(element))
      return router.indexOf(element) == 0
      
    });
  }
  // alert(flag)
  let accesstoken = _this.vueGetCookie('accesstoken')
  if(!accesstoken && flag){
    loginWWW(_this,function(data){
      if(router.indexOf('/introduce') == 0 ){
        callback(flag,'introduce',data);
      }else{
        callback(flag);
      }
      
    });
  }else{
    callback(flag);
  }

  
}

// 时间戳+随机字符串 生成签名
// function getSignature(strArr) {
//   let str = strArr.sort((a, b) => {
//     a = a.charCodeAt(0);
//     b = b.charCodeAt(0);
//     return a-b;
//   }).join('');
//   return crypto.MD5(crypto.SHA1(str).toString()).toString().toUpperCase();
// }

function loginWWW(_this,callback){//老版项目登录后
  let timeStamp = Date.now();
  let randStr = Math.random().toString(36).slice(2); // 生成随机字符串
  // console.info(_this.getSignature([timeStamp+'', randStr, 'newdb']))
  Axios.post('/api/synclogin', {            
    timeStamp: timeStamp,
    randStr: randStr,
    signature: _this.getSignature([timeStamp+'', randStr, 'newdb']),            
  }).then(res => {    
    // console.info(JSON.stringify(res));
    // alert(JSON.stringify(res)); 
    let _data = res.data;   
    
    if (_data.code == 200) {
      let accessToken = _data.data.accessToken
      _this.vueSetCookie('accesstoken', accessToken)
      _this.vueSetCookie('userPicture', _data.data.picture)
      _this.vueSetCookie('userName', _data.data.username )
      delete _data.data.accessToken;
      _this.$store.commit('UserCenter/accountData', Object.assign({}, _this.$store.state.UserCenter.accountData, _data.data));
      callback( _data.data)
      // alert(flag)
    }else{
      callback()
      // console.info(_data)
    } 
    
  }).catch(err => { 
    callback()
    console.error(err);
  })
}

export default changeHref;