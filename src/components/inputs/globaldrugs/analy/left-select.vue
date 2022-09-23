<template >
  <div class="la-select">
    <div class="title">
      <div class="flex">
        <label class="title-label">
          <NewProjectGuide postion="基础" :onlyKey="item['new_id']" :newPosition="{ right: item.statement ? -40 : -26 }"
            compoentsName="检索功能" :initItem="item" :showMenban="item['is_show_new']">{{ item.label }}</NewProjectGuide>
        </label>
        <el-tooltip v-if="item.statement" effect="light" placement="right">
          <div slot="content" v-html="item.statement"></div>
          <span class="section-ico-qa"></span>
        </el-tooltip>
      </div>
    </div>
    <el-select v-model="value" :placeholder="item.placeholder" @change="changeValue" :popper-append-to-body="false"
      multiple collapse-tags ref="popoverSelect">
      <el-option v-for="(option, index) in optionsValue" :key="index" :title="option.label" :label="option.label"
        :value="option.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const defaultItem = {
  name: "",
  type: "select",
  label: "",
  placeholder: "",
  accurate: "",
  search_hint: "",
  value: [],
};
export default {
  props: {
    vuex_name: {
      type: String,
      default() {
        return ""
      }
    },
    api_name: {
      type: String,
      default() {
        return ""
      }
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      value: [],
      defaultOptions: [],
      labelArray: []
    }
  },

  computed: {
    ...mapState({
      putong: state => state.Database.putongAnaly,
    }),
    storeState() {
      return Store.state[this.vuex_name]
    },
    vuexQuery() {
      return Store.state[this.vuex_name].queryStrAnaly
    },
    optionsValue() {
      if (!this.defaultOptions.length) {
        for (let item of this.item.value) {
          this.defaultOptions.push(item)
        }
      }
      return this.defaultOptions
    }
  },
  watch: {
    vuexQuery: {
      handler(val) {
        var array = JSON.parse(val)
        this.value = []
        for (var i = 0; i < array.length; i++) {
          if (this.item.name === array[i].name) {
            this.value = array[i].value.split('ღ')
          }
        }
      },
      deep: true
    },
  },
  created() {
    //第一次搜索将putong赋值给value
    let putong = this.putong,
      obj = this.item;
    _.forEach(obj, (item) => {
      _.forEach(putong, (items, key) => {
        // 因为精确搜索在字段名后面加了_eq导致匹配不上，所以这里先判断_eq存在先删除_eq在比较
        if (key.indexOf('_eq')) {
          key = key.replace('_eq', '')
        }

        if (item === key) {
          this.value = items.split('ღ')
        };
      })
    })
  },
  mounted() {
    this.selectPopMouseleave(this)
  },
  methods: {
    changeValue(opt) {
      this.labelArray = []
      for (var i = 0; i < this.value.length; i++) {
        let items = this.value[i]
        let obj = {}
        obj = this.optionsValue.find((item) => {
          return item.value === items;
        });
        this.labelArray.push(obj.label)
      }
      Store.commit(this.vuex_name + "/queryAnaly", {
        opt: 1,
        param: {
          name: this.item.name,
          label: this.item.label,
          accurate: this.item.accurate,
          value: this.value.join("ღ"),
          selectLabel: this.labelArray.join("、"),
          type: this.item.type
        }
      })
      // Store.commit(this.vuex_name + "/queryStrAnaly", Store.state[this.vuex_name].query)
    }
  },
}
</script>

<style lang="less">
@import "~@/assets/less/var.less";

.la-select {
  padding: 0 14px 0 10px;

  .el-select {
    width: 100%;

    .el-input__inner {
      background-color: @InputBgColor;
    }
  }

  .title {
    padding: 10px 0px 4px;
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .flex {
      display: flex;
      align-items: center;
    }

    .title-label {}

    .title-right {
      float: right;
      color: @FontColor3;
    }
  }
}

.el-select-dropdown {
  max-width: 220px !important;
}

.section-ico-qa {
  width: 14px;
  height: 14px;
  display: block;
  margin-left: 5px;
  background-image: url(/static/imgs/globaldrugs/qa.png);
  background-size: cover;

  &:hover {
    background-image: url(/static/imgs/globaldrugs/qa-c.png);
  }
}
</style>
