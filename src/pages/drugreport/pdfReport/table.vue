<template>
  <div v-if="dataList">
    <table border="1" cellspacing="0" class="pdf-table">
      <tr>
        <th v-for="item in headerList" :key="item.prop">{{ item.label }}</th>
      </tr>
      <tr v-for="(item, i) in dataList.slice(0, 8)" :key="i">
        <td v-for="key in headerList" :key="key.prop">
          <div v-if="key.prop == 'zhuceleixing' && type == 1">
            {{ item.yaopinleixing_1 + item[key.prop] }}
          </div>
          <div v-if="key.prop === 'start'">
            <span
              v-if="item.register !== 'ClinicalTrials.gov美国'"
              :title="item.start"
              >{{ item.start }}</span
            >
            <template v-else>
              <p v-if="item.start_s" class="dis">{{ item.start_s }}(预计)</p>
              <p v-if="item.start" class="dis">{{ item.start }}(实际)</p>
            </template>
          </div>
          <div v-if="key.prop === 'bianma'">
            {{ item.yibao }}
          </div>
          <div v-if="key.prop === 'download'">
            <!-- <a :href="item.down" v-if="item.down" target="_blank"><i class="el-icon-download"></i></a> -->
            <div class="download">
              <div>
                /
              </div>
            </div>
          </div>
          <div v-else v-html="handlerHTML(i, key.prop)"></div>
        </td>
      </tr>
    </table>
    <p v-if="dataList.length > 8" class="pdf-tabel-more">
      更多数据请在网页中导出
    </p>
  </div>
</template>
<script>
export default {
  props: {
    headerList: {
      type: Array,
    },
    dataList: {
      type: Array,
    },
    // 标识类型
    // 1：全球药物传过来的
    type: {
      type: [String, Number],
    },
  },
  methods: {
    handlerHTML(index, prop) {
      return this.dataList[index][prop];
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
.pdf-table {
  width: 100%;
  text-align: center;
  border: 1px solid #ebeef5;
  border-color: #ebeef5;
  table-layout: fixed;
  font-size: 16px;
  th {
    background: #eaeef9;
    padding: 5px;
  }
  td {
    padding: 5px;
    word-wrap: break-word;
    word-break: normal;
  }
  tr:nth-child(odd) {
    background: #f5f8fb;
  }
}
.pdf-tabel-more {
  text-align: center;
  color: #666;
  margin-top: 10px;
}
.download {
  position: relative;
  &:hover {
    .download-icon {
      transition: all 100ms;
      background-color: @PrimaryColor;
      color: #fff;
    }
    .fujian-cl {
      transition: all 500ms;
      transform: translateX(0px);
      width: auto;
      opacity: 1;
    }
  }
  .download-icon {
    transition: all 100ms;
    z-index: 10;
    display: inline-block;
    position: relative;
    // top: 0px;
    // right: 0px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    background-color: #fff;
    color: @PrimaryColor;
    font-size: 12px;
    text-align: center;
    border-radius: 13px;
    font-size: 16px;
  }
  .fujian-cl {
    transition: all 500ms;
    transform: translateX(-10px);
    z-index: 9;
    opacity: 0;
    position: absolute;
    left: 30px;
    top: 0px;
    width: 0px;
    max-width: 144px;
    max-height: 20px;
    border-radius: 10px;
    margin-top: 3px;
    background-color: @GrayBackgroundColor;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .fujian {
      min-width: 44px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: @PrimaryColor;
      }
    }
  }
}
</style>


