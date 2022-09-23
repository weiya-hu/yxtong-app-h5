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
          <router-link
            :to="`/trz/binggou/${item.data_id}`"
            target="_blank"
            class="title"
            >{{ item.acquirer }}
            <span v-if="item.shortname">并购 {{ item.shortname }}</span>
          </router-link>
          <span class="tag" v-if="item.applicationscenarios.length>0" v-for="(txt,i) in item.applicationscenarios" :key="i">{{ txt }}</span>
          <span class="tag1" v-if="item.province">{{ item.province }}</span>
        </div>
        <div class="left-info-touzifang" v-if="item.guifan_amount">
          <span class="label">并购金额：</span>
          <span class="touzifang-item">{{ item.guifan_amount }}</span>
        </div>
      </div>
    </div>
    <div class="rongzi-item_right" v-if="item.purposeofm_a">
      <span class="label">并购目的：</span>
      <span>{{ item.purposeofm_a }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "rongzi-item",
  created() {
    console.log(this.item);
  },
  props: {
    item: {
      time: String,
      acquirer: String,
      shortname: String,
      guifan_amount: String,
      purposeofm_a: String
    }
  }
};
</script>

<style lang="less" scoped>
.rongzi-item {
  position: relative;
  padding: 10px 20px;
  padding-right: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_left {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 700px;
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
    .left-info-touzifang {
      font-size: 14px;
    }
    .touzifang-item {
      margin-right: 10px;
      color: #09144f;
    }
  }
  .rongzi-item_right {
    color: #333;
    font-size: 13px;
    flex: 1;
    overflow: hidden;
    display: flex;
    margin-left: 50px;
    span:last-child {
      max-height: 40px;
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
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
