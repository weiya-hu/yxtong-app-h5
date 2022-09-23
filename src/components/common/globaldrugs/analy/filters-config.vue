<template>
  <div class="filter-globaldrugs">
    <div v-if="hasFilters" class="filter item" :class="{
      'abandon-click-method': nopms && nopms.tjsx,
      'is-disabled': nopms && nopms.tjsx,
    }">
      <transition-group name="flip-list" class="tb-t" tag="table" appear>
        <tr v-for="(key, index) in keys" v-if="filtersAnaly[key] && filtersAnaly[key].length > 0" :key="key">
          <td>{{ match_shaixuanAnaly[key] }}：</td>
          <td>
            <template slot="title" v-if="getFiltersCname(key) == '特殊情况批准'">
              {{ getFiltersCname(key) }}
              <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                <div slot="content" v-html="helpDesc.exceptionalCase"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <template slot="title" v-else-if="
              getFiltersCname(key) == '附带条件批准' &&
              vuex_name == 'Epyp'
            ">
              {{ getFiltersCname(key) }}
              <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                <div slot="content" v-html="helpDesc.incidentalConditions"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <template slot="title" v-else-if="
              getFiltersCname(key) == '国产/进口' && vuex_name == 'Qxss'
            ">
              {{ getFiltersCname(key) }}
              <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                <div slot="content" v-html="helpDesc.domesticOrImport"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <template slot="title" v-else-if="
              getFiltersCname(key) == '剂型' && vuex_name == 'Epyp'
            ">
              {{ getFiltersCname(key) }}
              <el-tooltip class="tooltips-incidentalConditions" effect="light" placement="right">
                <div slot="content" v-html="helpDesc.epypTips"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <template slot="title" v-else-if="
              getFiltersCname(key) == '等效性代码' &&
              vuex_name == 'FdaDrug'
            ">
              {{ getFiltersCname(key) }}
              <el-tooltip effect="light" placement="right">
                <div slot="content" v-html="helpDesc.dengxiao"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <template slot="title" v-else-if="
              getFiltersCname(key) == '参比药物' &&
              vuex_name == 'FdaDrug'
            ">
              {{ getFiltersCname(key) }}
              <el-tooltip effect="light" placement="right">
                <div slot="content" v-html="helpDesc.canbi"></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <template slot="title" v-else>
              <NewProjectGuide :onlyKey="filtersAnaly[key]['new_id']" :newPosition="{
                right: filtersAnaly[key].statement ? -40 : -26,
              }" display="inline" compoentsName="筛选功能" postion="条件" :initItem="filtersAnaly[key]"
                :showMenban="filtersAnaly[key]['is_show_new']">{{ getFiltersCname(key) }}</NewProjectGuide>

              <el-tooltip effect="light" placement="right" v-if="filtersAnaly && filtersAnaly[key].statement">
                <div slot="content" v-html="
                  filtersAnaly[key].statement ? filtersAnaly[key].statement : ''
                "></div>
                <i class="el-icon-question cl-green"></i>
              </el-tooltip>
            </template>
            <!--增加树形控件，实现多级条件筛选 (注册数据库的优先审评品yxsp种为多级下拉、不良反应数据库的occr_country为多级下拉、中国上市的dailiangcaigou1为多级下拉)-->
            <div v-if="
              key === 'typeLevel' ||
              key === 'yxsply' ||
              key === 'occr_country' ||
              key === 'zhuangtai' ||
              (vuex_name === 'CfdaDrug' && key === 'dailiangcaigou1') ||
              (vuex_name === 'Clinical' && key === 'results')
            " style="position: relative">
              <el-input :placeholder="(vuex_name === 'Clinical' && key === 'results') ? '请输入文献期刊名称检索' : '输入关键字进行过滤'"
                v-model="filterText" @input="filterChange(index)" @change="filterChange(index)">
              </el-input>
              <div class="trees">
                <!-- 不良反应数据库的occr_country字段勾选父节点的时候需要筛选出所有的子节点传给后端，所以需要判断 check-strictly=" key !== 'occr_country'-->
                <!-- 中国上市的dailiangcaigou1字段勾选父节点的时候需要筛选出所有的子节点传给后端，所以需要判断 check-strictly=" key !== 'dailiangcaigou1''-->
                <el-tree :indent="6" node-key="key" class="filter-tree" :data="filtersAnaly[key]"
                  :props="{ children: 'children', label: 'label' }" show-checkbox :default-checked-keys="checked[key]"
                  :default-expanded-keys="checked[key]" :filter-node-method="filterNode" @check="
                    (data, checkTree) =>
                      checkGA(key, data, index, checkTree)
                  " @node-expand="nodeExpand" @node-collapse="nodeCollapse" @check-change="
  (data, checkTree, checkTreeChild) =>
    checkChange(
      data,
      checkTree,
      checkTreeChild,
      index,
      key
    )
" :ref="'tree' + index" :check-strictly="
  key !== 'occr_country' && key !== 'dailiangcaigou1' && key !== 'typeLevel' && key !== 'results'
">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span class="num" v-if="node.label !== '热门期刊'">({{ data.doc_count }})</span>
                  </span>
                </el-tree>
              </div>
            </div>
            <div v-else-if="
              vuex_name === 'Globalapproval' && key === 'source'
            ">
              <div v-for="(item, idx) in filtersAnaly[key]" :key="item.value">
                <VCheckBox :value="item.checked" @change="checkedChange($event, idx, item, filters, key)">
                  <span>{{ item.label }}</span>
                  <span class="num">({{ item.doc_count }})</span>
                </VCheckBox>
              </div>
            </div>
            <div style="display: flex;flex-wrap: wrap;" v-else-if="vuex_name === 'Globaldrugs' && key === 'indication_standard'">
              <el-checkbox-group v-model="checked[key]"  :class="{ yaowuhuaxiang: key === 'yaowuhuaxiang', 'line1': status }" class="indication_standard">
                  <el-checkbox v-for="(type, index) in filtersAnaly[key]" :label="type.key" :key="index"
                    @change="checkGA(key, type)">
                    <span>{{ type.label }}</span>
                    <span class="num">({{ type.doc_count }})</span>
                </el-checkbox>
              </el-checkbox-group>
              <span v-if="showMoreStatus" class="indication_standard more-btn" @click="showMoreHandler">
                <span>更多</span>
                <i class="icon el-icon-d-arrow-right"></i>
              </span>
            </div>
            <div style="display: flex;flex-wrap: wrap;" v-else-if="vuex_name === 'Globaldrugs' && key === 'countries'">
              <el-checkbox-group v-model="checked[key]"  :class="{ yaowuhuaxiang: key === 'yaowuhuaxiang', 'line1': status2 }" class="countries">
                  <el-checkbox v-for="(type, index) in filtersAnaly[key]" :label="type.key" :key="index"
                    @change="checkGA(key, type)">
                    <span>{{ type.label }}</span>
                    <span class="num">({{ type.doc_count }})</span>
                </el-checkbox>
              </el-checkbox-group>
              <span v-if="showMoreStatus2" class="countries more-btn" @click="showMoreHandler2">
                <span>更多</span>
                <i class="icon el-icon-d-arrow-right"></i>
              </span>
            </div>
            <el-checkbox-group v-model="checked[key]" v-else :class="{ yaowuhuaxiang: key === 'yaowuhuaxiang' }">
              <el-checkbox v-for="(type, index) in filtersAnaly[key]" :label="type.key" :key="index"
                @change="checkGA(key, type)">
                <span>{{ type.label }}</span>
                <span class="num">({{ type.doc_count }})</span>
              </el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
      </transition-group>
    </div>
    <div class="btn-area">
      <div class="data-count">
        数据总量：<span class="num">{{ thousandFormatter(dataCount) }}</span>
      </div>
      <div class="right-area">
        <div class="search" @click="searchHandler">确定</div>
        <el-button round class="border-color" @click="clearHandler">清空已选条件
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VCheckBox from "@/pages/globalapproval/scatter-graph/components/Checkbox";
//筛选条件默认显示数 修改此值 需要修改对应的css值
const FILTER_DEFAULT_SHOW_LENGTH = 6;
export default {
  components: { VCheckBox },
  props: {
    vuex_name: {
      // 必须！
      type: String,
      default: "",
    },
    dbname: {
      // 没有定量分析不要绑定此属性！（可参考药品销售数据库示例，截止9月30日，暂时只有药品销售/药品中标/生物制品这三个数据库有定量分析）
      type: String,
      default: "",
    },
    route1: {
      // 同route2，route3，含有可视化分析才绑定这三个属性（比如注册有list/analy/qb，而其他大多数只有两个属性，route3不绑定）
      type: String,
      default: "",
    },
    route2: {
      type: String,
      default: "",
    },
    route3: {
      type: String,
      default: "",
    },
    route4: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showMoreStatus: false,
      status: false,
      showMoreStatus2: false,
      status2: false,
      defaultExpanded: [],
      defaultExpanded2: [],
      filterText: "",
      filterText2: "",
      checked: {},
      filterList: [],
      filter_default_len: FILTER_DEFAULT_SHOW_LENGTH,
      helpDesc: {
        incidentalConditions:
          "同时满足以下要求的药品申请，人用药品委员会（CHMP）可以授予有条件批准：申请人可能能够提供全面数据；能够满足未被满足的医疗需求；药品即时使用的收益大于因缺少正常审批的数据而带来的风险。附带条件批准的产品有效期为一年，每年续期一次。",
        exceptionalCase:
          "申请人可以提出申请但无法提供正常申请的有关安全性和有效性的全部数据，原因如下：① 产品的适应症人群太少，难以获得预期的充分数据；② 以当前的科学认知水平无法获得充分数据；③ 搜集这些信息与公认的医学伦理学原则相违背。只作为处方药管理且只在严格的监督下使用。",
        domesticOrImport: "境内注册器械、境外注册器械",
        canbi:
          "简称RLD，是指在我国批准上市，用于仿制药注册申请的参照药品。通常是具有完整规范的安全性和有效性研究数据的药品。",
        dengxiao:
          "目的是能够让使用者快速了解收录的药品是否治疗等效及是否采用了生物等效性试验确定治疗等效。",
        epypTips: "此功能只针对于筛选HMA批准上市的相关数据。",
      },
      filterKeys: [],
      sourceValue: 0,
    };
  },
  computed: {
    dataCount() {
      return Store.state[this.vuex_name].dataCount;
    },
    storeState() {
      return Store.state[this.vuex_name];
    },
    route() {
      // route 从 data 移动到 computed，防止固化
      return this.$route.path.split("/")[2];
    },
    match_shaixuanAnaly() {
      return Store.state[this.vuex_name].match_shaixuanAnaly;
    },
    filtersAnaly() {
      return Store.state[this.vuex_name].filtersAnaly;
    },
    filtersAnalyLoading() {
      return Store.state[this.vuex_name].filtersAnalyLoading;
    },
    filters1Analy() {
      return Store.state[this.vuex_name].filters1Analy;
    },
    groups() {
      return Store.state[this.vuex_name].groupsAnaly;
    },
    filtersSourceAnaly() {
      return Store.state["Globalapproval"].filtersSourceAnaly;
    },
    nopms() {
      return Store.state[this.vuex_name].nopms;
    },
    keys() {
      this.filters1Analy.forEach((item2) => {
        item2.sort = Number(item2.sort);
      });
      let arr = _.orderBy(this.filters1Analy, ["sort"], ["desc"]),
        keys = [];
      arr.forEach((item) => {
        keys.push(item.field);
      });
      return Store.state[this.vuex_name].filtersList || keys;
    },
    hasFilters() {
      let FIE = false;
      if (this.filtersAnaly && Object.keys(this.filtersAnaly).length) {
        for (let key in this.filtersAnaly) {
          if (this.filtersAnaly[key].length) {
            FIE = true;

            if (this.keys.map(item => item.field === 'indication_standard').length > 0) {
              this.$nextTick(() => {
                let contentHeight = $(".el-checkbox-group.indication_standard").height();
                if (contentHeight >= 70) {
                  this.showMoreStatus = true;
                  this.status = true;
                } else {
                  this.showMoreStatus = false; // 适应症 - 已批准
                  this.status = false; // 适应症 - 已批准
                }
              })
            }

            if (this.keys.map(item => item.field === 'countries').length > 0) {
              this.$nextTick(() => {
                let contentHeight = $(".el-checkbox-group.countries").height();
                if (contentHeight >= 70) {
                  this.showMoreStatus2 = true;
                  this.status2 = true;
                } else {
                  this.showMoreStatus2 = false; // 适应症 - 已批准
                  this.status2 = false; // 适应症 - 已批准
                }
              })
            }
          }
        }
      }
      return FIE;
    }
  },
  methods: {
    showMoreHandler() {
      const _that = this
      this.$nextTick(() => {
        _that.$parent.resetFilterHeight()
        _that.$parent.getFilterHeight()
      })
      let obj = $(`.indication_standard.more-btn`);
      if (obj.find("span").text() == "更多") {
        this["status"] = false;
        obj.find("span").text('收起')
        obj.find("i").css('transform', 'rotate(-90deg)')
      } else {
        this["status"] = true;
        obj.find("span").text('更多')
        obj.find("i").css('transform', 'rotate(90deg)')
      }
    },
    showMoreHandler2() {
      const _that = this
      this.$nextTick(() => {
        _that.$parent.resetFilterHeight()
        _that.$parent.getFilterHeight()
      })
      let obj = $(`.countries.more-btn`);
      if (obj.find("span").text() == "更多") {
        this["status2"] = false;
        obj.find("span").text('收起')
        obj.find("i").css('transform', 'rotate(-90deg)')
      } else {
        this["status2"] = true;
        obj.find("span").text('更多')
        obj.find("i").css('transform', 'rotate(90deg)')
      }
    },
    clearHandler() {
      Store.commit("Globaldrugs/filtersAnalyLoading", true);
      if (this.storeState.queryAnaly) {
        //this.storeState.query = []
        Store.commit(this.vuex_name + "/queryAnaly", []);
      }
      if (this.storeState.putongAnaly) {
        Store.commit(this.vuex_name + "/putongAnaly", {});
        //this.storeState.putong = {}
      }
      if (this.storeState.conditionsAnaly) {
        // this.storeState.conditions = []
        Store.commit(this.vuex_name + "/conditionsAnaly", []);
      }

      if (this.storeState.filtersSourceAnaly) {
        this.storeState.filtersSourceAnaly = [];
        Store.commit(this.vuex_name + "/filtersSourceAnaly", []);
      }
      if (this.storeState.groupsAnaly) {
        Store.commit(this.vuex_name + "/groupsAnaly", []);
      }
      if (this.vuex_name == "Zhuce") {
        Store.commit(this.vuex_name + "/shaixuanNodesAnaly", []);
      }
      Store.commit(this.vuex_name + "/queryStrAnaly", this.storeState.queryAnaly);
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4) {
          if (this.vuex_name == "Zhuce") {
            Store.dispatch(this.vuex_name + "/getKshRes_Breed");
          }
        }
      } else {
        Store.dispatch(this.vuex_name + "/getKshRes", this.storeState.putongAnaly);
      }
      this.getDataCount();// 获取数据总量

      this.showMoreStatus = false;
      this.status = false;
      this.showMoreStatus2 = false;
      this.status2 = false;
    },
    searchHandler() {
      this.$emit('clearPhase')
      window.ga("send", "event", "button", "click", "企业版_全球药物_智能分析_条件筛选_确定");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_智能分析_条件筛选_确定",
      ]);
      Store.commit(this.vuex_name + "/groupsAnaly", this.checked);
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4) {
          if (this.vuex_name == "Zhuce") {
            Store.dispatch(this.vuex_name + "/getKshRes_Breed");
          }
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
      this.getDataCount();// 获取数据总量

      this.showMoreStatus = false;
      this.status = false;
      this.showMoreStatus2 = false;
      this.status2 = false;
    },
    handlerTreeData(key) { },
    checkChange(data, checkTree, checkTreeChild, index, key) {
      if (key === "zhuangtai" && this.vuex_name == "Zhuce") {
        let nodes = this.$refs["tree" + index][0].getCheckedNodes();
        Store.commit(this.vuex_name + "/shaixuanNodesAnaly", nodes);
        // console.log(nodes);
      }
      let checkedKeys = this.$refs["tree" + index][0].getCheckedKeys();

      if (key === 'typeLevel') {
        checkedKeys.map((v, i) => {
          if (v.indexOf('__') < 0) {
            checkedKeys.splice(i, 1)
          }
        })
      }
      this.checked[key] = checkedKeys;
    },
    checkChange2(data, checkTree, checkTreeChild, index, key) {
      // this.checked[key] = this.$refs["tree2" + index][0].getCheckedKeys();
    },
    filterChange(index) {
      this.$refs["tree" + index][0].filter(this.filterText);
    },
    filterChange2(index) {
      this.$refs["tree2" + index][0].filter(this.filterText2);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    filterNode2(value, data) {
      if (!value) return true;
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    //添加collapse model值，使路由参数可以展开
    initActive() {
      // this.filterList = []
      _.forEach(this.keys, (item, index) => {
        for (let key in this.groups) {
          if (this.groups[key].length) {
            if (item === key) {
              this.filterList.push(index);
            }
          }
        }
      });
      // console.info(this.filterList)
      // this.activeNames = this.filterList
    },
    init() {
      for (let key in this.filtersAnaly) {
        this.$set(
          this.checked,
          key,
          this.groups == undefined ? [] : this.groups[key] || []
        );
      }
      console.log(this.checked);
      for (const [key, val] of Object.entries(this.filtersAnaly)) {
        // console.log(this.filters1Analy, this.filtersAnaly);
        this.filters1Analy.forEach((item2) => {
          item2.sort = Number(item2.sort);
          // 特殊处理全球上市国家与地区条件筛选
          if (
            this.vuex_name === "Globalapproval" &&
            key === "source" &&
            item2.field === "source"
          ) {
            this.filtersAnaly[key] = this.filtersAnaly[key].map((v) => ({
              label: v.label,
              key: v.key,
              doc_count: v.doc_count,
              checked: 0,
            }));
            if (this.storeState.filtersSourceAnaly.length > 0) {
              this.filtersAnaly[key].forEach((val, index) => {
                this.storeState.filtersSourceAnaly.forEach((item) => {
                  if (val.label === item.label) {
                    this.filtersAnaly[key][index].checked = item.checked;
                  }
                });
              });
            }
          }

          if (key === item2.field && item2.statement) {
            this.filtersAnaly[key].statement = item2.statement;
            this.filtersAnaly[key].sort = item2.sort;
          }
          if (key === item2.field && item2.is_show_new) {
            this.filtersAnaly[key].is_show_new = item2.is_show_new;
            this.filtersAnaly[key].field = item2.field;
            this.filtersAnaly[key].label = item2.label;
            this.filtersAnaly[key].name = item2.name;
            this.filtersAnaly[key].new_content = item2.new_content;
            this.filtersAnaly[key].new_id = item2.new_id;
            this.filtersAnaly[key].new_time = item2.new_time;
            this.filtersAnaly[key].new_type = item2.new_type;
            this.filtersAnaly[key].sort = item2.sort;
            this.filtersAnaly[key].type = item2.type;
          }
        });
      }
      console.log(this.filtersAnaly);
      // this.initActive()
    },
    handleChange() {
      this.$emit("change", this.checked);
    },
    changeBox(value) {
      this.checked[value.label];
    },
    // 筛选 主标题的英文名 返回 中文名
    getFiltersCname(option) {
      for (let key in this.match_shaixuanAnaly) {
        if (option == key) {
          return this.match_shaixuanAnaly[key];
        }
      }
    },
    searchFilter() {
      Store.commit(this.vuex_name + "/groupsAnaly", this.checked);
      if (this.vuex_name === "Globalapproval") {
        Store.commit(this.vuex_name + "/filtersSourceAnaly", this.filtersAnaly["source"]);
      }
      console.log(this.route, this.route1, this.route2)
      if (this.route) {
        if (this.route == this.route1) {
          Store.dispatch(this.vuex_name + "/nomalSearch");
        } else if (this.route == this.route2) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route3) {
          Store.dispatch(this.vuex_name + "/getKshRes");
        } else if (this.route == this.route4) {
          if (this.vuex_name == "Zhuce") {
            Store.dispatch(this.vuex_name + "/getKshRes_Breed");
          }
        }
      } else {
        Store.dispatch(this.vuex_name + "/nomalSearch");
      }
    },
    showMore(event) {
      let name = "all-group";
      let icon = ["el-icon-d-arrow-right", "el-icon-d-arrow-left"];
      let checkbox_group =
        event.currentTarget.parentElement.parentElement.children[0];
      let className = checkbox_group.className.split(" ");
      let index = className.indexOf(name);
      if (index == -1) {
        className.push(name);
        event.currentTarget.children[0].innerText = "收起";
        event.currentTarget.children[1].className = "icon " + icon[1];
      } else {
        className.splice(index, 1);
        event.currentTarget.children[0].innerText = "更多";
        event.currentTarget.children[1].className = "icon " + icon[0];
      }
      checkbox_group.className = className.join(" ");
    },

    checkedChange(e, index, item, filters, key) {
      console.log(e, index, item, filters, key);
      this.defaultExpanded = [];
      window.ga(
        "send",
        "event",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + item.label
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + item.label,
      ]);

      let shaixuan = this.storeState.match_shaixuan_valuesAnaly;

      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][item.key] = item.label;
      Store.commit(
        this.vuex_name + "/match_shaixuan_valuesAnaly",
        _.assign({}, this.storeState.match_shaixuan_valuesAnaly, shaixuan)
      );

      this.$set(this.filtersAnaly[key], index, { ...item, checked: e });
    },

    checkGA(key, data, index, checkTree) {
      console.log(checkTree);
      this.defaultExpanded = [];
      window.ga(
        "send",
        "event",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label,
      ]);
      let shaixuan = this.storeState.match_shaixuan_valuesAnaly;

      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][data.key] = data.label;
      console.log(shaixuan);
      Store.commit(
        this.vuex_name + "/match_shaixuan_valuesAnaly",
        _.assign({}, this.storeState.match_shaixuan_valuesAnaly, shaixuan)
      );
    },
    checkGA2(data, checkTree, key, index) {
      console.log(data, checkTree, key, index);
      /**
       * 获取树结构已选节点：如果是父节点下子节点全选则只获取父节点。如果父节点下的子节点未全选则只获取对应勾选的子节点。采用递归获取所需要的节点
       * @param {*} store === this.$refs.tree.store
       * @returns
       */
      let store = this.$refs["tree2" + index][0].store;
      const checkedNodes = [];
      const traverse = function (node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        childNodes.forEach((child) => {
          // child.checked表示子孙节点被选中了，checked状态的节点不需要继续递归。
          if (child.checked) {
            checkedNodes.push(child.data);
          }
          // child.indeterminate 表示该节点的子孙节点部分被选中。如果是indeterminate的节点，需要继续递归这个过程
          if (child.indeterminate) {
            traverse(child);
          }
        });
      };
      traverse(store);
      this.checked[key] = [];
      checkedNodes.forEach((item) => {
        this.checked[key].push(item.key);
      });
      console.log(checkedNodes, this.checked);
      this.defaultExpanded2 = [];
      window.ga(
        "send",
        "event",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label
      );
      window._paq.push([
        "trackEvent",
        "option",
        "click",
        this.vuex_name + "_filter_condition_" + key + "_" + data.label,
      ]);

      let shaixuan = this.storeState.match_shaixuan_valuesAnaly;
      shaixuan[key] = shaixuan[key] ? shaixuan[key] : {};
      shaixuan[key][data.key] = data.label;
      console.log(shaixuan);
      Store.commit(
        this.vuex_name + "/match_shaixuan_valuesAnaly",
        _.assign({}, this.storeState.match_shaixuan_valuesAnaly, shaixuan)
      );
    },
    nodeExpand(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeExpand2(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = a.level > 1 ? a.level * 18 + 6 : 24;

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeCollapse(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    nodeCollapse2(d, a, f) {
      let start = document.querySelector(".trees").scrollLeft;
      let end = (a.level > 1 ? a.level * 18 + 6 : 24) - (a.level > 1 ? 18 : 24);

      this._easeout(start, end, 2, function (value) {
        document.querySelector(".trees").scrollLeft = value;
      });
    },
    _easeout(start, end, rate, callback) {
      var _end = end;
      if (start == end || typeof start != "number") {
        return;
      }
      end = end || 0;
      rate = rate || 2;

      var step = function () {
        start = start + (end - start) / rate;
        if (Math.abs(start - _end) < 1) {
          callback(end, true);
          return;
        }
        callback(start, false);
        requestAnimationFrame(step);
      };
      step();
    },
    getDataCount() {
      window
        .Axios({
          method: "get",
          url: "/api/globaldrugs/analyCount",
          params: this.storeState.paramAnaly
        })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            let data = res.data.data;
            this.dataCount = data;
          }
        }).catch(err => {
          console.log(err);
        })
    }
  },
  watch: {
    filtersAnaly: {
      handler() {
        this.init();
        if (this.keys.map(item => item.field === 'indication_standard').length > 0) {
          const _that = this
          this.$nextTick(() => {
            let contentHeight = $(".el-checkbox-group.indication_standard").height();
            console.log(contentHeight)
            if (contentHeight >= 70) {
              _that.showMoreStatus = true;
              _that.status = true;
            } else {
              _that.showMoreStatus = false; // 适应症 - 已批准
              _that.status = false; // 适应症 - 已批准
            }
          })
        }

        if (this.keys.map(item => item.field === 'countries').length > 0) {
          const _that = this
          this.$nextTick(() => {
            let contentHeight = $(".el-checkbox-group.countries").height();
            console.log(contentHeight)
            if (contentHeight >= 70) {
              _that.showMoreStatus2 = true;
              _that.status2 = true;
            } else {
              _that.showMoreStatus2 = false; // 适应症 - 已批准
              _that.status2 = false; // 适应症 - 已批准
            }
          })
        }
      }
      },
      immediate: true,
    },
    groups() {
      this.filterText = "";
      this.filterText2 = "";
      this.init();
    },
    filtersSourceAnaly() {
      this.init();
    },
    filtersAnalyLoading(val) {
      if (!val) {
    }
  },
  updated() {
    this.vueTogglePmsTooltip();
    // if ($(".all-group").length > 0) {
    //   let node = $(".all-group");
    //   node.each(function () {
    //     if ($(this).next().children(".show-more")[0]) {
    //       $(this).next().children(".show-more")[0].children[0].innerText =
    //         "收起";
    //     }
    //   });
    // }
  },
  mounted() {
    if (this.vuex_name === "Globaldrugs") {
      // this.getDataCount();// 获取数据总量
    }
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

.turn {
  height: 20px;
  width: 20px;
  background: url("~@/assets/imgs/icon-loading.png") center center no-repeat;
  animation: turn 1.5s linear infinite;
}

@keyframes turn {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.filter {
  .item-title {
    display: block;
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
    font-size: @FontSize;
    background-color: @SerchBackgroundColor;
    color: #333;
  }

  .item {
    padding-bottom: 10px;
  }


  .all-group {
    max-height: none !important;
  }

  /deep/.el-tree-node>.el-tree-node__children {
    overflow: initial;
  }

  /deep/.el-tree-node__content>.el-checkbox {
    margin-right: 2px;
  }

  /deep/.el-tree-node__content>.el-tree-node__expand-icon {
    padding: 5px;
  }

  /deep/.el-input__inner {
    height: 26px;
    font-size: 12px;
    margin-bottom: 5px;
    padding: 0 10px;
  }

  .trees-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trees {
    position: relative;
    // max-height: 266px;
    // overflow: auto;
  }

  .el-checkbox {
    display: block;
    margin-top: 0;

    .el-checkbox__label {
      font-size: 12px;
    }
  }

  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }

  .num {
    color: @FontColor3;
  }

  .show-more {
    // padding-right: 20px;

    .icon {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      /* IE 9 */
      -moz-transform: rotate(0deg);
      /* Firefox */
      -webkit-transform: rotate(90deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(90deg);
      /* Opera */
    }
  }

  .control-filter {
    padding: 4px 15px;
    border-radius: 4px;
  }
}

.flip-list-move {
  transition: transform 0.4s ease-out;
}

.el-zoom-in-top-enter-active {
  transition: all 0.5s;
}

.el-zoom-in-top-leave-active {
  transition: all 0.5s;
}

.is-disabled {
  cursor: not-allowed !important;
  color: @NoPmsColor  !important;

  * {
    cursor: not-allowed !important;
    color: @NoPmsColor  !important;
  }
}

.abandon-click-method,
.yyxs-abandon-click-method {
  cursor: not-allowed !important;
  color: @NoPmsColor  !important;
  text-decoration: none !important;

  &:hover {
    color: @NoPmsColor  !important;
  }

  * {
    cursor: not-allowed !important;
  }
}

/deep/.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  line-height: 30px;

  .el-checkbox:not(:last-child) {
    margin-right: 15px;
  }
}

.tb-t {
  width: 100%;

  tr {
    height: 30px;
    border-bottom: 1px solid #EBEEF5;

    &:last-child {
      border-bottom: none;
    }

    td:first-child {
      padding-left: 15px;
      width: 210px;
      white-space: nowrap;
      height: 13px;
      line-height: 13px;
      font-size: 13px;
      font-weight: 500;
      color: #333333;
      border-right: 1px solid #EBEEF5;
      background: #FAFBFD;
    }

    td:last-child {
      padding-left: 10px;
      border: 1px solid #EBEEF5;
    }
  }
}

.num {
  margin-left: 3px;
  color: #9AA4B8 !important;
}

.btn-area {
  height: 28px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  position: relative;

  .data-count {
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-left: 15px;

    .num {
      height: 16px;
      line-height: 16px;
      font-size: 16px;
      color: #FFA914 !important;
    }
  }

  .right-area {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;

    .search {
      padding: 7px 26px;
      height: 14px;
      background: #002FA7;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      cursor: pointer;
    }
  }
}
</style>

<style lang="less">
.filter-globaldrugs {
  padding: 0 10px;
  width: calc(100% - 20px);

  .border-color {
    height: 100%;
    background: none;
    color: #606266;
    margin-left: 10px;
    display: flex;
    justify-content: center;

    &:focus,
    &:hover {
      color: #4877E8;
      border-color: rgb(200, 214, 248);
      background-color: rgb(237, 241, 253);
    }
  }

  .is-round {
    width: 120px;
    padding: 7px 40px;
    border-radius: 4px !important;
  }

  .el-checkbox__label {
    span:first-child {
      height: 12px;
      font-size: 12px;
      line-height: 12px;
      font-weight: 400;
    }
  }

  .el-checkbox {
    display: flex;
    align-items: center;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #fff;
    border-color: #ebeef5;
  }

  .el-checkbox__inner {
    border-color: #ebeef5;
  }

  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #002fa7;
  }

  .el-checkbox__inner::after {
    border-color: #ffa914;
  }

  .la-input .title .title-right {
    color: #9aa4b8;
  }

  input.el-input__inner {
    border-color: #ebeef5;
  }

  .el-input__icon.el-icon-date {
    color: #ffa914;
  }

.line1 {
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 30px;
}

.more-btn {
  z-index: 3;
  line-height: 28px;
  cursor: pointer;
  color: #002fa8;

  .icon {
    transform: rotate(90deg);
  }
}
}
</style>