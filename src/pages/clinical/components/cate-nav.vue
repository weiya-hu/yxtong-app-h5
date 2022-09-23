<template>
  <ul class="cates-nav">
    <li v-for="(item, ix) in arrList" :key="ix">
      <h2>{{item.title}}</h2>
      <ul class="cates-nav-in">
        <li v-for="(items, ix1) in item.child" :key="ix1" :class="[items.hover?'actives':'']" @click="navFetch(ix, ix1, items.title)">
          {{items.title}}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {},
    computed: {
      ...mapState({
        param: state => state.Clinical.cate_param
      })
    },
    data () {
      return {
        checkFlag: [0,0],
        arrList: [
          {
            key: 'conditions',
            title: '疾病领域',
            child: [
              {
                hover: true,
                title: '按类别'
              } ,{
                hover: false,
                title: '按首字母顺序'
              },
            ]
          },
          {
            key: 'interventions',
            title: '药物干预',
            child: [
              {
                hover: false,
                title: '按类别'
              } ,{
                hover: false,
                title: '按首字母顺序'
              },
            ]
          },
          {
            key: 'rare',
            title: '罕见病',
            child: [
              {
                hover: false,
                title: '按首字母顺序'
              }
            ]
          },
          {
            key: 'dietary',
            title: '膳食补充剂',
            child: [
              {
                hover: false,
                title: '按类别'
              } ,{
                hover: false,
                title: '按首字母顺序'
              },
            ]
          },
          {
            key: 'sponsor',
            title: '申办者/合作者',
            child: [
              {
                hover: false,
                title: '按类别'
              } ,{
                hover: false,
                title: '按首字母顺序'
              },
            ]
          },
          {
            key: 'locations',
            title: '地区',
            child: [
              {
                hover: false,
                title: '按区域'
              },
              {
                hover: false,
                title: '可视化地图'
              },{
                hover: false,
                title: '按首字母顺序'
              },
            ]
          }
        ]
      }
    },
    watch: {

    },
    methods: {
      navFetch(ix,ix1, title){
        this.arrList[this.checkFlag[0]].child[this.checkFlag[1]].hover = false
        this.arrList[ix].child[ix1].hover = true
        this.checkFlag = [ix,ix1]
        if(title === '按首字母顺序'){
          this.param.page = 1
          this.param.pageSize = 20
          this.param.order = null
          this.param.cate = null
          this.param.name = null
          this.param.type = this.arrList[ix].key
          Store.dispatch('Clinical/getCatestand',{params:this.param})
          Store.commit('Clinical/changeBox', 'szm')
        } else if (title === '按类别'||title === '按区域'){
          this.param.name = null

          Store.dispatch('Clinical/getCate', this.arrList[ix].key)
          Store.commit('Clinical/changeBox', 'lbqu')
        } else if (title === '可视化地图'){
          this.param.name = null
          Store.dispatch('Clinical/getCate', this.arrList[ix].key)
          Store.commit('Clinical/changeBox', 'dt')
        }
      }
    }

  }
</script>

<style lang="less" scoped>
  .cates-nav{
    >li{
      h2{
        padding: 0 0 0 10px;
        font-size: 14px;
        line-height: 30px;
        font-weight: 400;
        background: #F6F8FC;
      }
    }
    .cates-nav-in{
      padding: 0 14px 0 10px;

      >li{
        font-size: 12px;
        line-height: 30px;
        border-bottom: 1px dashed #DFE5F1;
        cursor: pointer;
        box-sizing: border-box;
        &:hover{
          color: #4877e8;
        }
      }
      >li.actives{
        color: #4877e8;
      }
    }
  }
</style>
