<template>
  <div class="company-item">
    <div class="fl-1 jigou-name">
      <router-link :to="`/trz/jigou/${item.wyuid}`" target="_blank">{{
        item.companyname
      }}</router-link>
    </div>
    <div class="fl-200 tags">
      <span class="tag1" v-if="item.nature">{{ item.nature }}</span>
      <span class="tag" v-if="item.province">{{ item.province }}</span>
    </div>
    <div class="desc text-over">
      <span>投资阶段：</span>{{ item.stage }}
    </div>
    <div class="desc info">
      <span>机构简介：</span> <div class="line-over" style="flex: 1;" >{{ item.context }}</div>
    </div>
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
      context: String,
    },
  },
};
</script>

<style lang="less" scoped>
.company-item {
  position: relative;
  padding: 10px 20px;
  width: calc(25% - 8px);
  border: 1px solid #dae0e9;
  margin-top: 10px;
  margin-right: 10px;
  box-sizing: border-box;
  height: 160px;
  border-radius: 4px;
  .jigou-name {
    font-size: 16px;
    font-weight: 600;
    color: #09144f;
    margin-bottom: 8px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    a {
      color: #09144F;
    }
  }
  .tags {
    margin-bottom: 16px;
  }
  .tag {
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #3556b9;
    border: 1px solid #3556b9;
    display: inline-block;
    margin-right: 10px;
  }

  .tag1 {
    font-size: 12px;
    color: #fff;
    font-weight: normal;
    line-height: 1;
    padding: 5px;
    background-color: #3556b9;
    border-radius: 4px;
    margin-right: 10px;
    display: inline-block;
  }
  .desc {
    font-size: 13px;
    color: #333;
    span {
      color: #666;
    }
  }

  .info {
    display: flex;
    justify-content: space-between;
    span {
      width: 65px;
    }
  }

  &:nth-child(4n) {
    margin-right: 0;
  }
  a:hover {
    text-decoration: none;
    color: #e7af2f;
  }
  .text-over {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .line-over {
    max-height: 40px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    border-color: #e7af2f;
    a {
      color: #e7af2f;
    }
  }
}
@media only screen and (max-width: 1400px) {
  .company-item {
    width: calc(33.333333333333333% - 7px);
    &:nth-child(4n) {
      margin-right: 10px;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
