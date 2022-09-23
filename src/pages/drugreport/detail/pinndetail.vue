<template>
  <div>
    <slide-section title="基本信息">
      <div class="tb-wrap">
        <table class="tb-t">
          <tr v-for="item in pinnTableData" :key="item.key">
            <td>{{ item.label }}</td>
            <td>
              <a
                class="link-btn"
                :href="item.value"
                target="_blank"
                v-if="item.key === 'drugbankurl'"
                >{{ item.value || "/" }}</a
              >
              <div v-else>
                <span v-html="item.value"></span>
                <span
                  class="link-btn look-btn"
                  @click="() => $Img(pinnData.structpicture)"
                  v-if="pinnData.structpicture && item.key === 'cas'"
                  >查看</span
                >
              </div>
            </td>
          </tr>
        </table>
      </div>
    </slide-section>
    <slide-section title="拓展信息" v-if="extendList && extendList.length > 0">
      <div class="extend-list">
        <ExtendButton
          v-for="(item, index) in extendList"
          :key="index"
          :item="item"
        />
      </div>
    </slide-section>
  </div>
</template>

<script>
import SlideSection from "@/components/common/slide-section";
import ExtendButton from "@/components/common/extend-button";
const pinnTableData = [
  {
    key: "ename",
    label: "药物别名"
  },
  {
    key: "leixing2",
    label: "药物类型"
  },
  {
    key: "higheststatus",
    label: "全球最高状态"
  },
  {
    key: "cas",
    label: "CAS号"
  },
  {
    key: "target",
    label: "作用靶点"
  },
  {
    key: "originatorcompany",
    label: "原研单位"
  },
  {
    key: "activecompanies",
    label: "开发公司"
  },
  {
    key: "inactivecompanies",
    label: "终止开发的公司"
  },
  {
    key: "activeindications",
    label: "开发适应症"
  },
  {
    key: "inactiveindications",
    label: "终止开发的适应症"
  },
  {
    key: "otheractions",
    label: "其它作用"
  },
  {
    key: "technologies",
    label: "技术类别"
  },
  {
    key: "update",
    label: "更新日期"
  },
  {
    key: "addeddate",
    label: "创建日期"
  },
  {
    key: "drugid",
    label: "药物编号"
  },
  {
    key: "drugbankurl",
    label: "DrugBank 网站地址"
  }
];
export default {
  components: {
    SlideSection,
    ExtendButton
  },
  props: {
    pinnData: {
      type: Object,
      default: {}
    },
    extendList: {
      type: Array,
      default: () => []
    },
    jspdf: {
      type: Boolean,
    },
  },
  data() {
    return {
      pinnTableData: pinnTableData
    };
  },
  created() {
    let newTable = [];
    _.forEach(pinnTableData, item => {
      if (this.pinnData[item.key]) {
        newTable.push({
          key: item.key,
          label: item.label,
          type: item.type,
          value: this.pinnData[item.key]
        });
      }
    });
    this.pinnTableData = newTable;
  },
  methods: {
    showKZXX() {
      let flag = false;
      if (this.jspdf) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    }}
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
.link-btn {
  color: @Blue;
  cursor: pointer;
}
.look-btn {
  margin-left: 50px;
}
</style>
