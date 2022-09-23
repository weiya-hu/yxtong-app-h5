<template>
  <div class="company-item">
    <div class="fl-1 text-over" style="padding-left: 20px"><router-link :to="`/trz/qiye/${item.wyuid}`" target="_blank">{{item.companyname}}</router-link></div>
    <div class="fl-300 text-over">{{item.country}} <span v-if="item.province">-</span> {{item.province}} <span v-if="item.city">-</span> {{item.city}}</div>
    <div class="fl-120">{{item.establishmenttime}}</div>
    <div class="fl-120">{{item.people}}</div>
    <div class="fl-120">{{item.round}}</div>
    <div class="fl-300 text-over">{{item.technology}}</div>
    <div class="fl-300 text-over">{{item.applicationscenarios}}</div>
  </div>
</template>

<script>
export default {
  name: "company-item",
  props: {
    item: {
      companyname: String,
      country: String,
      province: String,
      city: String,
      establishmenttime: String,
      people: String,
      round: String,
      context: String
    },
  },
};
</script>

<style lang="less" scoped>
.company-item {
  position: relative;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #666;
  >div {
    padding-right: 10px;
    box-sizing: border-box;
  }
  a:hover {
    text-decoration: none;
    color: #E7AF2F;
  }
  .text-over {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fl-1 {
    color: #0d1a62;
    width: 300px;
    box-sizing: border-box;
    a {
      color: #0d1a62;
      &:hover {
        text-decoration: none;
        color: #E7AF2F;
      }
    }
  }
  .fl-200 {
    width: 200px;
  }
  .fl-300 {
    width: 300px;
  }
  .fl-400 {
    width: 400px;
  }
  .fl-120 {
    width: 120px;
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
