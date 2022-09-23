
import store from '@/store'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    permission:[],
    othervipcategory:[],
    othervipcategoryDetail:[],
    accesstoken:'',
    isLoading:true
  },
  mutations: {
    permission(state, Payload) {
      // console.info(Payload)
      state.permission = Payload
    },
    accesstoken(state, Payload) {      
      state.accesstoken = Payload
    },
    othervipcategoryDetail(state, Payload) {      
      state.othervipcategoryDetail = Payload
    },
    isLoading(state, Payload) {      
      state.isLoading = Payload
    },
    othervipcategory(state, Payload) {      
      state.othervipcategory = Payload
    },
  },
  actions: {
    getPremission({commit,state},Payload){
      window.Axios({
        method:'post',
        url:'/api/config/othervip',
        params:{
            accesstoken: state.accesstoken,
        }
      }).then((res)=>{
          if(res.data.code == 200 && res.data){
              let data=res.data.data
              // let arr = ['维普数据库','万方数据库'];
              let arr = [];
              data.map((val)=>{
                arr.push(val.dbname);
              })             
              commit("isLoading",false)              
              commit("permission",arr)              
          }
          
      }).catch((err) => {
        commit("isLoading",false)   
          console.log(err)
      })
    },
    getOthervipcategory({commit,state,dispatch},Pay){  
      let Payload = Pay || {};   
      console.info(Payload) 
      commit("isLoading",true)  
      dispatch('getPremission');      
      window.Axios({
          method:'post',
          url:'/api/config/othervipcategory',
          data:{
              accesstoken:  state.accesstoken,
              pid:Payload.pid 
          }
      }).then((res)=>{
          if(res.data.code == 200 && res.data){
            if(!Payload.pid){
              commit("othervipcategory",res.data.data) 
            }else{
              commit("othervipcategoryDetail",res.data.data) 
              
            }
            
          }   
          commit("isLoading",false)          
      }).catch((err) => {
              console.log(err)
              commit("isLoading",false)   
          })
      },
    
  }
}
