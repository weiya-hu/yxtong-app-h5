<template>
  <div class="rongzi-item">
    <div class="rongzi-item_left">
      <div class="left-time">
        <div>{{ item.time.slice(0, 4) }}</div>
        <div style="font-weight: 600">
          {{ item.time.slice(5, 10) }}
        </div>
      </div>
      <div class="left-info">
        <div class="left-info-title">
          <span style="color: #3556b9; font-size: 16px;font-weight: bold;cursor: pointer;" @click="goComprehensiveSearch(item.guifanname || item.brandname || item.brandname_en,'drug')" v-if="item.guifanname || item.brandname || item.brandname_en">【{{item.guifanname || item.brandname || item.brandname_en}}】</span>
          <span style="color: #3556b9; font-size: 16px;font-weight: bold;cursor: pointer;" @click="goComprehensiveSearch(item.targets_abbr || item.targets,'targets')" v-if="item.targets_abbr || item.targets">【{{item.targets_abbr || item.targets}}】</span>
          <router-link
            :to="`/trz/kuajing/${item.data_id}`"
            target="_blank"
            class="title"
            >{{ item.guifan_item ? item.guifan_item : item.item }}
          </router-link>
          <span
            class="tag"
            v-if="item.applicationscenarios.length > 0"
            v-for="(txt, i) in item.applicationscenarios"
            :key="i+item"
            >{{ txt }}</span
          >
          <span
            class="tag"
            v-if="item.therapeuticarea.length > 0"
            v-for="(txt, i) in item.therapeuticarea"
            :key="i"
            >{{ txt }}</span
          >
        </div>

        <div class="left-box">
          <div
            class="left-info-touzifang"
            v-if="item.transferorArr && item.transferorArr.length > 0"
          >
            <span class="label">卖方/合作方：</span>
            <span
              v-for="touzifang in item.transferorArr"
              :key="touzifang.name"
              class="touzifang-item"
              :class="{ 'no-click': !touzifang.jgWyuid && !touzifang.gsWyuid }"
              @click="toDetail(touzifang)"
              >{{ touzifang.name }}</span
            >
          </div>

          <div
            class="left-info-touzifang"
            v-if="item.buyerArr && item.buyerArr.length > 0"
          >
            <span class="label">买方/合作方：</span>
            <span
              v-for="touzifang in item.buyerArr"
              :key="touzifang.name"
              class="touzifang-item"
              :class="{ 'no-click': !touzifang.jgWyuid && !touzifang.gsWyuid }"
              @click="toDetail(touzifang)"
              >{{ touzifang.name }}</span
            >
          </div>

          <div class="left-amount">
            交易金额：<span
              >总金额{{
                item.guifan_totalamount
              }}</span
            >，<span
              >首付款{{item.guifan_downpayment
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "kuajing-item",
  created() {
  },
  props: {
    item: {
      time: String,
      acquirer: String,
      shortname: String,
      guifan_amount: String,
      purposeofm_a: String,
    },
  },
  methods: {
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
    goComprehensiveSearch(searchwords,comprehensive) {
      const routeData = this.$router.resolve({
        path: '/search',
        query: {
          comprehensive: comprehensive,
          searchwords: searchwords,
          source: 1
        }
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style lang="less" scoped>
.rongzi-item {
  position: relative;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_left {
    display: flex;
    flex: 1;
    align-items: center;
    .left-info {
      flex: 1;
    }
    .left-info-title {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #09144f;

      &:hover {
        text-decoration: none;
        color: #e7af2f;
      }
    }
    .tag {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      line-height: 1;
      padding: 5px;
      background-color: #3556b9;
      margin-left: 10px;
      border-radius: 4px;
    }
    .tag1 {
      font-size: 12px;
      color: #fff;
      font-weight: normal;
      line-height: 10px;
      padding: 5px;
      margin-left: 10px;
      border-radius: 4px;
      border: 1px solid #3556b9;
      color: #3556b9;
      box-sizing: border-box;
    }
    .left-time {
      width: 90px;
      font-size: 14px;
      color: #666;
    }

    .left-box {
      display: flex;
    }

    .left-info-touzifang {
      font-size: 14px;
      margin-right: 20px;
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

    .left-amount {
      font-size: 14px;
      color: #666;

      span {
        color: #09144f;
      }
    }
  }
  .label {
    width: 70px;
    font-size: 13px;
    color: #666;
  }
  &::after {
    content: "";
    width: calc(100% - 40px);
    border-bottom: 1px dotted #dae0e9;
    position: absolute;
    bottom: 0;
  }
  &:hover {
    background-color: #f5f8fc;
  }
}
</style>
