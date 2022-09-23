<template>
  <el-table v-waiting="loading" :data="qqlc" style="width: 100%">
    <!-- <el-table-column label="登记号">
      <template slot-scope="{row}">
        <a 
        v-if="row.id"
        :href="'/clinical/'+row.id" :title="row.me_id" target="_blank"
              class="no-underline cl-blue">{{row.me_id}}</a>
        <span v-else :title="row.me_id">{{row.me_id}}</span>
      </template>
    </el-table-column> -->
    <el-table-column 
    v-for="item in tableHead"
    :key="item.label"
    :label="item.label" :prop="item.prop">
    <template slot-scope="{row}">
      <div>
        <el-popover placement="right" width="250" :trigger="row[item.prop]?'hover':''">
        <div>
          {{row[item.prop]}}
        </div>
        <a style="color: #002FA7" slot="reference" v-if="item.prop == 'title'" :href="row['jumpurl']" target="_blank">{{row[item.prop]}}</a>
        <div v-else slot="reference">{{row[item.prop]}}</div>
      </el-popover>
      </div>
    </template>
    </el-table-column>
    <template slot="append">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="qqlc_page"
        :page-size="10"
        layout="total, prev, next"  hide-on-single-page
        :total="qqlc_total"
      >
      </el-pagination>
    </template>
  </el-table>
</template>

<script>
// 全球临床table
export default {
  name: "qqlc-table",
  data() {
    return {
      qqlc: [],
      tableHead:[
        {label:'文献标题' , prop: 'title'},
        {label:'文献来源' , prop: 'qikan'},
        {label:'文献发布日期' , prop: 'day'},
        {label:'最优剂量有效性' , prop: 'yxx'},
        {label:'结果倾向' , prop: 'resultsqx'},
        {label:'结果简介' , prop: 'results'},
      ],
      qqlc_page: 0,
      qqlc_total: 0,
      loading: false
    };
  },
  props:{
    drugids:{
      default: '',
      type:String
    },
    drugname_standard: {
      default: "",
      type: String,
    },
    company_standard: {
      default: "",
      type: String,
    },
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getWxData(val);
    },
    getWxData(page = 1, count = 0) {
      this.loading = true;
      if (count>10){
        return;
      }
      if (this.drugids) {
        Axios({
          url: "/api/globaldrugs/drugClinicalLiterature",
          method: 'post',
          data: {
            drugids: this.drugids,
            page,
            pageSize: 10,
          },
        }).then(res =>{
          if (res.data.code == 200) {
            this.qqlc = res.data.data.res;
            this.qqlc_page = res.data.data.page;
            this.qqlc_total = Number(res.data.data.count);
          }
        })
        .finally(() =>{
          this.loading = false;
        });
      } else {
        setTimeout(() => {
          this.getWxData(page, count + 1);
        }, 500);
      }
    },
  },
  mounted(){
    this.getWxData();
  }
};
</script>

<style>
</style>