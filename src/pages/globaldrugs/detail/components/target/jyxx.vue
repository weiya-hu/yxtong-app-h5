<template>
  <div class="globaldrugs-jyxx" style="padding: 10px 10px">
    <div v-waiting="jyxxLoading">
      <el-table :data="res" border stripe :header-cell-style="{
        background: '#F5F6FA',
        color: '#333333',
        fontSize: '14px',
        fontWeight: 'bold',
      }">
        <el-table-column v-for="(item,i) in tableHead" :prop="item.prop" :key="i+'_index'" :min-width="item.width"
          :label="item.label">
          <template slot-scope="scope">
            <!-- 项目类型 -->
            <template v-if="item.prop==='type_item'">
              <div>{{ scope.row.type_item}}</div>
              <span class="trz-tag" v-if="scope.row.type">{{
                  scope.row.type
              }}</span>
            </template>

            <!-- 项目名称 -->
            <template v-else-if="item.prop==='guifan_item'">
              <div>
                <router-link style="color: #09144f" :to="`/trz/kuajing/${scope.row.data_id}`" target="_blank"
                  class="title text2line" :title="
                    scope.row.guifan_item
                      ? scope.row.guifan_item
                      :scope.row.item
                  ">{{
    scope.row.guifan_item
      ? scope.row.guifan_item
      :scope.row.item
}}
                </router-link>

                <div>
                  <span class="trz-tag" style="cursor: pointer" :title="
                    '药品:'+scope.row.guifanname||
                    scope.row.brandname||
                    scope.row.brandname_en
                  " @click="
  goComprehensiveSearch(
    scope.row.guifanname||
    scope.row.brandname||
    scope.row.brandname_en,
    'drug'
  )
" v-if="
  scope.row.guifanname||
  scope.row.brandname||
  scope.row.brandname_en
">药品:{{
    scope.row.guifanname||
    scope.row.brandname||
    scope.row.brandname_en
}}</span>
                  <span class="trz-tag" style="cursor: pointer" :title="
                    '靶点:'+(scope.row.targets_abbr||scope.row.targets)
                  " @click="
  goComprehensiveSearch(
    scope.row.targets_abbr||scope.row.targets,
    'targets'
  )
" v-if="scope.row.targets_abbr||scope.row.targets">靶点:{{
    scope.row.targets_abbr||scope.row.targets
}}</span>
                </div>
              </div>
              <!-- <span class="trz-tag" v-if="scope.row.type">{{scope.row.type}}</span> -->
            </template>

            <!-- 买方合作方 -->
            <template v-else-if="item.prop==='buyer'">
              <div class="text2line">
                <span v-for="touzifang in scope.row.buyerArr" :key="touzifang.name" class="touzifang-item"
                  :title="touzifang.name" :class="{
                    'no-click': !touzifang.jgWyuid&&!touzifang.gsWyuid,
                  }" @click="toDetail(touzifang)">{{ touzifang.name}}</span>
              </div>

              <p style="color: #3556b9; margin-top: 5px; font-size: 12px">
                <span>
                  {{ scope.row.buyer_address.country}}
                </span>
                <span v-if="scope.row.buyer_address.province">
                  -{{ scope.row.buyer_address.province}}
                </span>
                <span v-if="scope.row.buyer_address.city">
                  -{{ scope.row.buyer_address.city}}
                </span>
              </p>
            </template>

            <!-- 买方合作方 -->
            <template v-else-if="item.prop==='transferor'">
              <div class="text2line">
                <span v-for="touzifang in scope.row.transferorArr" :key="touzifang.name" class="touzifang-item"
                  :title="touzifang.name" :class="{
                    'no-click': !touzifang.jgWyuid&&!touzifang.gsWyuid,
                  }" @click="toDetail(touzifang)">{{ touzifang.name}}</span>
              </div>
              <p style="color: #3556b9; margin-top: 5px; font-size: 12px">
                <span>
                  {{ scope.row.transferor_address.country}}
                </span>
                <span v-if="scope.row.transferor_address.province">
                  -{{ scope.row.transferor_address.province}}
                </span>
                <span v-if="scope.row.transferor_address.city">
                  -{{ scope.row.transferor_address.city}}
                </span>
              </p>
            </template>

            <!-- 治疗领域 -->
            <template v-else-if="item.prop==='guifan_therapeuticarea'">
              <div v-if="scope.row.therapeuticarea.length>0">
                {{ scope.row.therapeuticarea.join(",")}}
              </div>
            </template>

            <!-- 合作类型 -->
            <template v-else-if="item.prop==='guifan_cooperationtype'">
              <div>
                {{ scope.row.guifan_cooperationtype}}
              </div>
              <p class="hzlx text2line" :title="'权益类型:'+scope.row.guifan_quanyileixing"
                v-if="scope.row.guifan_quanyileixing">
                权益类型:{{ scope.row.guifan_quanyileixing}}
              </p>
            </template>

            <div v-else :title="scope.row[item.prop]">
              {{ scope.row[item.prop]}}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @current-change="handleCurrentChange" :current-page="param.page" :page-size="param.pageSize"
        layout="total, prev, pager, next, jumper" :total="Number(total)"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  watch: {
    base: {
      async handler(val) {
        if (val) {
          this.targets = this.base.targets_abbr ? this.base.targets_abbr : this.base.targets;
          this.getJyxxdata();
        }
      },
      deep: true
    },
    show(val) {
      if (!val) {
        this.$root.$emit('hide-section', '交易信息')
      }
    }
  },
  data() {
    return {
      show: false,
      targets: "",
      res: [],
      param: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      tableHead: [
        {
          prop: "time",
          label: "时间",
          width: 100, //最少宽度
        },
        {
          prop: "dealstage",
          label: "项目阶段",
          width: 90, //最少宽度
        },
        {
          prop: "type_item",
          label: "项目类型",
          width: 90, //最少宽度
        },
        {
          prop: "guifan_item",
          label: "项目名称",
          width: 300, //最少宽度
        },
        {
          prop: "buyer",
          label: "买方/合作方",
          width: 200, //最少宽度
        },
        {
          prop: "transferor",
          label: "卖方/合作方",
          width: 200, //最少宽度
        },
        {
          prop: "guifan_therapeuticarea",
          label: "治疗领域/应用场景",
          width: 150, //最少宽度
        },
        {
          prop: "guifan_cooperationtype",
          label: "合作类型",
          width: 120, //最少宽度
        },
        {
          prop: "guifan_totalamount",
          label: "总金额",
          width: 120, //最少宽度
        },
        {
          prop: "guifan_downpayment",
          label: "首付款",
          width: 120, //最少宽度
        },
      ],
      jyxxLoading: true,
    };
  },
  methods: {
    // 获取交易信息数据
    getJyxxdata() {
      this.jyxxLoading = true;
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/tradingInfo",
          params: {
            ...this.param,
            targets: this.targets,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.jyxxLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.show = true;
            this.res = res.data.data.res;
            this.total = res.data.data.count;
          } else {
            this.show = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.show = false;
        });
    },
    handleCurrentChange(val) {
      this.param.page = val;
      this.getJyxxdata();
    },
    toDetail(val) {
      let path = "";
      console.log(val);
      if (!val.gsWyuid && !val.jgWyuid) return false;
      // 如果gsWyuid存在跳转到企业详情
      if (val.gsWyuid) path = `/trz/qiye/${val.gsWyuid}`;

      // 如果jgWyuid存在跳转到企业详情
      if (val.jgWyuid) path = `/trz/jigou/${val.jgWyuid}`;
      const { href } = this.$router.resolve({
        path: path,
      });
      window.open(href, "_blank");
    },
    // 链接到企业版综合搜索页
    goComprehensiveSearch(searchwords, comprehensive) {
      const routeData = this.$router.resolve({
        path: "/search",
        query: {
          comprehensive: comprehensive,
          searchwords: searchwords,
          source: 1,
        },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="less">
.globaldrugs-jyxx {
  .trz-tag {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    color: #3556b9;
    font-size: 12px;
    font-weight: 500;
    box-sizing: border-box;
    margin-top: 5px;
  }

  .title {
    &:hover {
      text-decoration: none;
      color: #e7af2f !important;
    }
  }

  .touzifang-item {
    margin-right: 10px;
    color: #09144f;
    cursor: pointer;

    &:hover {
      text-decoration: none;
      color: #e7af2f;
    }
  }

  .no-click {
    cursor: unset;

    &:hover {
      color: #09144f;
    }
  }

  .el-table tbody td>.cell {
    padding: 8px 14px;
  }

  .el-table td .cell {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
  }

  .el-table td .cell>div {
    overflow: unset;
    text-overflow: unset;
    display: block;
    -webkit-line-clamp: unset;
    -webkit-box-orient: unset;
    max-height: unset;
  }

  .el-table {
    color: #333;
  }

  .el-table thead {
    color: #666;
  }

  .el-table thead th>.cell {
    height: 34px;
    line-height: 34px;
  }

  .el-table__row,
  .el-table thead {
    font-size: 14px;
  }

  .text2line {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
  }

  .hzlx {
    color: #868ea3;
    font-size: 12px;
  }
}
</style>
