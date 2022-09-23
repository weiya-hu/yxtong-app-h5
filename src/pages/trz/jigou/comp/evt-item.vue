<template>
  <div class="event-item">
    <div class="event-item_head">
      <span style="display:flex;align-items:center;"
        >{{ eventObj.time }}
        <span class="round">{{ eventObj.round }}</span></span
      >
      <router-link
        :to="{ path: '/trz/rongzi/' + eventObj.data_id }"
        target="_blank"
        >查看详情</router-link
      >
    </div>
    <div class="event-item_body">
      <div class="event-item_info">
        <div>
          <span>投</span>
          <span>资</span>
          <span>对</span>
          <span>象：</span>
        </div>
        {{ eventObj.shortname }}
      </div>
      <div class="event-item_info">
        <div>
          <span>投</span>
          <span>资</span>
          <span>金</span>
          <span>额：</span>
        </div>
        <div
          style="display:flex;align-items:center;"
        >
          <span class="money"
            >{{ thousandFormatter(eventObj.guifan_amount) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "event-item",
  props: {
    eventObj: {
      type: Object
    }
  }
};
</script>
<style lang="less" scoped>
.event-item {
  width: calc(25% - 8px);
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #dae0e9;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  .round {
    margin-left: 10px;
    padding: 3px 13px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 400;
    line-height: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &_head {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    background-color: #dae0e9;
    height: 34px;
    align-items: center;
    span {
      color: #333;
      white-space: nowrap;
    }
    a {
      color: #3556b9;
      white-space: nowrap;
    }
    .round {
      border: 1px solid #3556b9;
      color: #3556b9;
      white-space: nowrap;
    }
  }
  &_body {
    padding: 10px 20px;
  }
  .event-item_info {
    display: flex;
    align-items: baseline;
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1;
    color: #333;
    .money {
      font-size: 18px;
      color: #e7af2f;
      font-weight: 600;
    }
    .unit {
      font-size: 14px;
      color: #999;
      margin-left: 10px;
    }
    div {
      display: flex;
      justify-content: space-between;
      color: #666;
    }
  }
  &:nth-child(4n) {
    margin-right: 0;
  }
  &:hover {
    transition: 0.3s;
    border-color: #3556b9;
    .event-item_head {
      background-color: #3556b9;
      span,
      a {
        color: #fff;
        text-decoration: none;
      }
      .round {
        border: 1px solid #ffffff;
        color: #ffffff;
      }
    }
  }
}
@media only screen and (max-width: 1600px) {
  .event-item {
    width: calc(33.333333333333333% - 7px);
    &:nth-child(4n) {
      margin-right: 10px;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
@media only screen and (max-width: 1400px) {
  .event-item {
    width: calc(50% - 5px);
    &:nth-child(3n) {
      margin-right: 10px;
    }
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>
