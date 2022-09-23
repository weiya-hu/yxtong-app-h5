<template>
  <div class="fxxx_items">
    <div class="zcsb_item">
      <div class="item_content">
        <el-table
          :data="data"
          stripe
          fixed
          class="table"
          style="width: 100%">
          <el-table-column
            v-for="item in tableHead"
            :prop="item.prop"
            :min-width="item.width"
            :key="item.prop"
            :label="item.label">
            <template slot-scope="scope">
              <div v-if="item.prop === 'pizhunwenhao'">
                <span v-if="vueCheckListPms('Yzx', item.label)" class="cell-shoulihao-wrap">
                  <router-link v-if="scope.row.tp=='1'" tag="a" :to="{path:'/cfdadrug/detail/' + scope.row.xuhao}" class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.pizhunwenhao||'/' }}
                  </router-link>
                  <router-link v-else tag="a" :to="{path:'/cfdadrug/jkdetail/' + scope.row.xuhao}" class="cell-shoulihao no-underline cl-blue" target="_blank">
                    {{ scope.row.pizhunwenhao||'/' }}
                  </router-link>
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'brandname'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.brandname||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'guige'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.guige||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'qiye'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.qiye||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'name'">
                <span v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.name||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
              <div v-if="item.prop === 'pwjd'">
                <span :class="yzxjdClass(scope.row.pwjd)" v-if="vueCheckListPms('Yzx', item.label)">
                  {{ scope.row.pwjd||'/' }}
                </span>
                <span v-else class="abandon-click-method">暂无权限</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <el-pagination
          v-if="pageData.count > 10"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-size="params.pageSize"
          layout="total, prev, pager, next"
          :total="pageData.count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props:{
      bianma:{
        type:String,
      },
      qiyebianmatz:{
        type:String,
      },
      tb:{
        type:String,
      },
    },
    computed:{
      ...mapState({
        yzxjd: state => state.Yzx.yzxjd,
      }),
      tableHead () {
        return this.qiyebianmatz ? this.tableHead_qy : this.tableHead_pz
      }
    },
    data(){
      return{
        params:{
          pageSize: 10,
          page: 1,
          tb: this.tb,
          accesstoken: GETCOOKIEFUN("accesstoken")
        },
        tabs:{
          tabsWidth: 0,         //tabs
          tabsWapWidth: 0,      //tabs-wap
          tabsSpace: 0,
          marginLeft: 0,
        },
        groupList: [],
        data: [],
        pageData: {},
        tableHead_pz: [
          {
            prop: "pizhunwenhao",
            label: "批准文号",
            width: 150, //最少宽度
          }, {
            prop: "brandname",
            label: "商品名",
            width: 150, //最少宽度
          }, {
            prop: "guige",
            label: "规格",
            width: 150, //最少宽度
          }, {
            prop: "qiye",
            label: "企业名称",
            width: 150, //最少宽度
          }, {
            prop: "pwjd",
            label: "当前进度",
            width: 150, //最少宽度
          }
        ],
        tableHead_qy: [
          {
            prop: "pizhunwenhao",
            label: "批准文号",
            width: 150, //最少宽度
          }, {
            prop: "name",
            label: "药品名称",
            width: 150, //最少宽度
          }, {
            prop: "brandname",
            label: "商品名",
            width: 150, //最少宽度
          }, {
            prop: "guige",
            label: "规格",
            width: 150, //最少宽度
          }, {
            prop: "pwjd",
            label: "当前进度",
            width: 150, //最少宽度
          }
        ],
        activeTab: 'all',
      }
    },
    created (){

    },
    watch: {
      groupList () {
        this.$nextTick(() => {
          this.initTabsWidth()
        })
      }
    },
    methods:{
      yzxjdClass (code) {
        return `yzxjd-btn yzxjd-btn-${this.yzxjd[code]}`
      },
      //获取列表数据
      handleAxios () {
        this.$emit('update:isloading',true);
        if (this.bianma) {
          this.params.bianma = this.bianma
        }else{
          this.params.qiyebianmatz = this.qiyebianmatz
        }
        window.Axios({
          method: 'get',
          url: '/api/yzx/bylist',
          params: this.params
        }).then(res => {
          this.$emit('update:isloading',false);
          if (res.data.code === 200 && res.data) {
            let data = res.data.data
            this.data = data.res
            this.pageData = data
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // pageSize 改变时会触发
      handleSizeChange(val) {
        this.$emit('update:isloading',true);
        this.params.pageSize = val
        this.handleAxios()
      },
      // currentPage 改变时会触发
      handleCurrentChange(val) {
        this.$emit('update:isloading',true);
        this.params.page = val
        this.handleAxios()
      },
    },
    mounted () {
      this.handleAxios()
    },
}
</script>

<style lang="less" scoped>
@import "./css/com.less";
</style>
