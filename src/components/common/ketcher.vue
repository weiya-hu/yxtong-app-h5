<template>
  <div class="ketcher-wrap">
    <div>
      <iframe id="ketcher" class="ketcher-iframe" src="/ketcher/"></iframe>
      <div class="right-wrap">
        <ul>
          <li><el-radio v-model="type" label='1'>精确</el-radio></li>
          <li><el-radio v-model="type" label='3'>子结构</el-radio></li>
          <li><el-radio v-model="type" label='2'>相似度</el-radio></li>
        </ul>
        <el-select class="simi-sel" v-model="simi" :disabled="type!='2'">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="clearfix"></div>
    <div class="btn-wrap">
      <el-button @click="getKetcherData" type="primary" round>搜 索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {
      type: '1',
      simi:0.6,
      options: [{
        value: 0.6,
        label: '60%'
      },{
        value: 0.7,
        label: '70%'
      },{
        value: 0.8,
        label: '80%'
      },{
        value: 0.9,
        label: '90%'
      }],
      smilescode:""
    }
  },
  computed: {

  },
  mounted(){
    
  },
  methods: {
    getKetcherData (){
      /*let params = {type:this.type,smilescode:'C1=CC=CC=C1',simi:this.simi}
      this.$emit('getKetcherData', params)*/
      ga("send", "event", "button", "click","structuralsearch_search")
        window._paq.push(['trackEvent', 'button', 'click', "structuralsearch_search", ])

      let ketcherNode = $("#ketcher")[0].contentWindow;
      this.smilescode = ketcherNode.getSmiles();
      if (!this.smilescode) {
        this.$Message.error('结构式不能为空！')
      } else if (ketcherNode.getCheck()){
        this.$Message.error('结构式错误！')
      } else {
        let params = {type:this.type,smilescode:this.smilescode,simi:this.simi}
        if (this.type!='2') {
          params.simi = 1
        };
        this.$emit('getKetcherData', params)
      };
    },
  }
}
</script>

<style lang="less" scoped>
.ketcher-wrap {
  padding-bottom: 20px;
}
.ketcher-iframe {
  width: 84%;
  border: none;
  height: 500px;
}
.right-wrap {
  float: right;
  width: 15%;
  margin-top: 117px;
  li {
    margin-top: 20px;
  }
}
.simi-sel {
  margin-top: 5px;
}
.btn-wrap {
  margin-left: 34px;
  button {
    padding: 7px 40px;
  }
}
</style>
