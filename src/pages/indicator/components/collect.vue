<template>
  <div class="indicator-collect">
    <el-input
        placeholder="输入关键字查询我的收藏"
        v-model="filterText"
        @input="collectChange"
        @keyup.native.enter="getCollectList"
      >
    </el-input>
    <div v-if="collectList.length > 0">
      <div class="my-collect">
        <div v-for="(item, index) in collectList" :key="item.id" class="collect">
          <span @click="handleCollect(item, index)" :class="{'active': activeIndex === index}">{{ item.wherename }}</span>
          <el-tooltip content="点击取消收藏" effect="light" placement="top">
            <img
              src="../../../..//static/imgs/indicator/collect.png"
              width="14"
              alt=""
              @click="cancelCollect(item)"
            />
          </el-tooltip>
        </div>
      </div>
    </div>

    <div v-else class="node-data">
      <img src="../../../../static/imgs/trz/no_data.png" alt="" />
      <div>请添加收藏</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: "",
      collectList: [],
      activeIndex: -1,
    };
  },
  created() {},
  mounted() {
    this.getCollectList();
  },
  methods: {
    // 获取收藏列表
    getCollectList() {
      window
        .Axios({
          method: "get",
          url: "/api/Macropharmaindicators/savewherelist",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.collectList = res.data.data;
          }
        });
    },

    collectChange(val) {
      // 当大于2个字符再去请求接口
      if(val.length>=2) {
        window
        .Axios({
          method: "get",
          url: "/api/Macropharmaindicators/searchWhere",
          params: {
            bookmark: val,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            this.collectList = res.data.data;
          }
        });
      } else {
        this.getCollectList()
      }
    },

    // 点击我的收藏，获取参数，传递参数
    handleCollect(item, index) {
      this.activeIndex = index
      this.$emit("getCollectData", item);
    },

    // 重置激活的收藏
    resetIndex() {
      this.activeIndex = -1
    },
    // 取消收藏
    cancelCollect(item) {
      window
        .Axios({
          method: "get",
          url: "/api/Macropharmaindicators/delsavewhere",
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            id: item.id
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.getCollectList()
            this.$message({
              message: "删除成功",
              type: "success",
            });
          }
        })
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-input__inner {
  height: 30px;
}
.indicator-collect {
  padding: 5px 14px 5px 10px;

  .my-collect {
    margin-top: 20px;
    border-top: 1px dotted #dfe5f1;

    .collect {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      color: #545b6d;
      border-bottom: 1px dotted #dfe5f1;

      img,
      span {
        cursor: pointer;
      }

      .active {
        color: #f4a622;
      }
    }
  }

  .node-data {
    text-align: center;
    color: #999;
  }
}
</style>
