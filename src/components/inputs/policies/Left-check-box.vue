<template>
  <div class="policies-left-check-box">
    <el-checkbox-group v-model="checkData" @change="saveData" :min="1">
      <el-checkbox v-for="(txt, index) in item.value" :key="index" :label="txt.value">{{ txt.label }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: {
    vuex_name: {
      type: String,
      default() {
        return "";
      },
    },
    api_name: {
      type: String,
      default() {
        return "";
      },
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      checkData: ["title", "tag"],
    };
  },
  computed: {
    queryStr() {
      return Store.state[this.vuex_name].query;
    },
  },
  watch: {
  },
  created() {
    console.log(Store.state[this.vuex_name].query);
    for (var i = 0; i < this.queryStr.length; i++) {
      if (this.item.name === this.queryStr[i].name) {
        this.checkData = this.queryStr[i].value.split(",");
      }
    }
  },
  activated() {
    for (var i = 0; i < this.queryStr.length; i++) {
      if (this.item.name === this.queryStr[i].name) {
        this.checkData = this.queryStr[i].value.split(",");
      }
    }
  },
  methods: {
    saveData(data) {
      console.log(data);
      Store.commit(this.vuex_name + '/checkData', data)
      if (data) {
        Store.commit(this.vuex_name + "/query", {
          opt: 1,
          param: {
            name: this.item.name,
            label: this.item.label,
            value: data.join(","),
            type: this.item.type,
          },
        });
        Store.commit(
          this.vuex_name + "/queryStr",
          Store.state[this.vuex_name].query
        );
      } else {
        _.remove(Store.state[this.vuex_name].query, (n) => {
          let isExist = this.item.name.indexOf(n.name) === 0;
          return isExist;
        });
        Store.commit(
          this.vuex_name + "/queryStr",
          Store.state[this.vuex_name].query
        );
      }
    },
  },
  mounted() {
    Store.commit(this.vuex_name + "/query", {
      opt: 1,
      param: {
        name: this.item.name,
        label: this.item.label,
        value: this.checkData.join(","),
        type: this.item.type,
      },
    });
    Store.commit(
      this.vuex_name + "/queryStr",
      Store.state[this.vuex_name].query
    );
    console.log(Store.state[this.vuex_name].query);
  },
};
</script>

<style lang="less" scoped>
.policies-left-check-box {
  padding: 8px 14px 0 10px;

  /deep/ .el-checkbox__label {
    font-weight: 400;
    font-size: 14px;
  }

  /deep/ .el-checkbox+.el-checkbox {
    margin-left: 10px;
  }

  /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #df9008;
  }

  /deep/ .el-checkbox__inner {
    width: 14px;
    height: 14px;
    position: relative;
    top: -2px;
    background: #e8ecf1;
    border-color: #e8ecf1;
    border-radius: 2px;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #df9008;
    border-color: #df9008;
  }
}
</style>
