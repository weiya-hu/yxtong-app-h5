<template>
  <div>
    <div class="keyword">
      <div class="ke-title">关键词检索</div>
      <el-autocomplete class="inline-input" v-model="value" :fetch-suggestions="querySearch" placeholder="活性成分中英文"
        :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
    </div>
    <div v-if="value" element-loading-spinner="el-icon-loading" v-loading="filter_loading" style="min-height: 50px">
      <template v-if="areas.length && types.length">
        <div class="filters">条件筛选</div>
        <el-collapse v-model="activeFilter">
          <el-collapse-item title="剂型" name="type">
            <div class="keyword">
              <div v-for="(item, idx) in types" :key="item.value">
                <el-checkbox v-show="idx < hideTypes" v-model="item.checked">{{ item.label }}({{ item.nums }})
                </el-checkbox>
              </div>
              <div class="controls">
                <a v-if="types.length > 5" @click="hideChange('types')"><span>{{ hideTypes == 5 ? "更多" : "收起"
                }}</span><i class="icon el-icon-d-arrow-right"></i></a>
                <el-button size="mini" type="primary" @click="searchForChartTypes">
                  筛选
                </el-button>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="area">
            <template slot="title">
              国家或地区(按活性成分)
              <el-tooltip effect="light" placement="right">
                <div slot="content">
                  对应的勾选框中，选择‘√’表示在该国家或地区上市的药品；选择‘×’表示排除是在该国家上市的药品数据；为空则表示对该国家不做选择。
                </div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <div class="keyword">
              <div v-for="(item, idx) in areas" :key="item.value">
                <VCheckBox v-show="idx < hideAreas" :value="item.checked" @change="checkedChange($event, idx, item)">{{
                item.label }}({{ item.nums }})</VCheckBox>
              </div>
              <div class="controls">
                <!-- <a v-if="areas.length > 5" @click="hideChange('areas')"
                  ><span>{{ hideAreas == 5 ? "更多国家" : "收起" }}</span
                  ><i class="icon el-icon-d-arrow-right"></i
                ></a> -->
                <el-button size="mini" type="primary" @click="searchForChartAreas">
                  筛选
                </el-button>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="area_formulation">
            <template slot="title">
              国家或地区(按制剂)
              <el-tooltip effect="light" placement="right">
                <div slot="content">
                  对应的勾选框中，选择‘√’表示在该国家或地区上市的药品；选择‘×’表示排除是在该国家上市的药品数据；为空则表示对该国家不做选择。
                </div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <div class="keyword">
              <div v-for="(item, idx) in areas_formulation" :key="item.value">
                <VCheckBox v-show="idx < hideAreas_formulation" :value="item.checked"
                  @change="checkedChange2($event, idx, item)">{{ item.label }}({{ item.nums }})</VCheckBox>
              </div>
              <div class="controls">
                <!-- <a v-if="areas.length > 5" @click="hideChange('areas')"
                  ><span>{{ hideAreas == 5 ? "更多国家" : "收起" }}</span
                  ><i class="icon el-icon-d-arrow-right"></i
                ></a> -->
                <el-button size="mini" type="primary" @click="searchForChartAreas_formulation">
                  筛选
                </el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </template>
      <template v-else>
        <div style="padding: 15px; text-align: center; font-size: 12px;color: #999">
          暂无数据...
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import VCheckBox from "./Checkbox";
export default {
  props: {
    value: "",
    types: [],
    areas: [],
    areas_formulation: [],
    filter_loading: false
  },
  data() {
    return {
      activeFilter: [],
      hideTypes: 5,
      hideAreas: 5,
      hideAreas_formulation: 5
    };
  },
  watch: {
    areas(newVal) {
      this.hideAreas = newVal.length;
    },
    areas_formulation(newVal) {
      this.hideAreas_formulation = newVal.length;
    },
  },
  components: { VCheckBox },
  methods: {
    handleSelect(e) {
      let obj = e.value ? e.value : e;
      this.$parent.$parent.isloading = true;
      this.$emit("input", obj);
    },
    querySearch(queryString, cb) {
      Axios.get("/api/globalapproval/input?cname=" + queryString).then(res => {
        if (res.data.code == 200) {
          cb(
            res.data.data.map(t => ({
              value: t
            }))
          );
        } else {
          cb([]);
        }
      });
    },
    checkedChange(e, index, item) {
      this.$emit("checkChange", e, index, item);
    },
    checkedChange2(e, index, item) {
      this.$emit("checkChange2", e, index, item);
    },
    hideChange(types) {
      if (types == "types") {
        this.hideTypes = this.hideTypes == 5 ? this.types.length : 5;
      } else {
        this.hideAreas = this.areas.length;
      }
    },
    searchForChartTypes() {
      let parent = this.$parent.$parent.$parent;
      parent.inputChange(parent.keyword, parent.types, parent.areas, parent.areas_formulation);
      this.$emit("search", this.types, this.areas, this.areas_formulation);
    },
    searchForChartAreas() {
      let parent = this.$parent.$parent.$parent;
      parent.inputChange(parent.keyword, parent.types, parent.areas, parent.areas_formulation);
      this.$emit("search", this.types, this.areas, this.areas_formulation);
    },
    searchForChartAreas_formulation() {
      let parent = this.$parent.$parent.$parent;
      parent.inputChange(parent.keyword, parent.types, parent.areas, parent.areas_formulation);
      console.log(parent)
      this.$emit("search", this.types, this.areas, this.areas_formulation);
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/less/var.less";

.ke-title {
  padding: 10px 0px 4px;
  font-size: 14px;
  color: #333;
}

.keyword {
  padding: 0 14px 0 10px;
  margin-bottom: 10px;

  .el-input__inner {
    background-color: @InputBgColor;
  }

  .controls {
    padding: 10px 0;

    a {
      padding-right: 20px;
    }

    button {
      padding: 4px 15px;
    }
  }
}

.filters {
  display: block;
  height: 30px;
  padding-left: 10px;
  line-height: 30px;
  font-size: 14px;
  background-color: #f6f8fc;
  color: #333;
}

// 手风琴样式
/deep/ .el-collapse-item__content {
  padding-bottom: 0;
  font-size: @FontSizeSmall;
}

/deep/.el-autocomplete {
  width: 100% !important;
}

.el-collapse {
  border: 0px;
}

.el-collapse-item {
  padding: 0px 14px 0 10px;

  .el-checkbox-group {
    max-height: 24 * 5px;
    /*5是与FILTER_DEFAULT_SHOW_LENGTH的值保持一致*/
    overflow-y: hidden;

    &.all-group {
      max-height: none;
    }
  }

  &:last-child {
    .el-collapse-item__header {
      border: 0px;
    }
  }

  // &.is-active {
  //   border-left: 2px solid @PrimaryColor;
  //   padding-left: 18px;
  // }

  /deep/.el-collapse-item__header {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px dashed #dfe5f1;
    margin-bottom: 1px;
    color: #333;
    font-size: @FontSizeSmall;

    &.is-active {
      color: @PrimaryColor;

      .header-icon {
        color: @PrimaryColor;
      }
    }
  }

  /deep/.el-collapse-item__wrap {
    border-bottom: 1px dashed #ebeef5;
  }

  /deep/.el-collapse-item__arrow {
    line-height: 30px;
    margin-right: 0;
  }
}
</style>
