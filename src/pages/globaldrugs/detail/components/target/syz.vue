<template>
  <div class="target-syz">
    <!-- <LoadingGif :loadFlag="true" v-if="true"/> -->
    <div class="syz-section" v-if="show1">
      <div class="section-title">
        <span>适应症布局：</span>
        <!-- <span style="color: #9aa4b8">({{ ypz_count }})</span>: -->
      </div>
      <div class="section-content" v-waiting="syzbjLoading">
        <!-- 适应症数字列表 -->
        <el-table :data="indicationNumData" class="syzbj-table" border fixed>
          <el-table-column v-for="(item,index) in indicationNumThead" :prop="item.prop" :key="index"
            :min-width="item.width" :label="item.label" header-align="center" align="center">
            <template slot="header" slot-scope="scope">
              <div v-if="item.prop==='status0'" style="flex-wrap: nowrap;display: flex;align-items: center;">
                {{ item.label}}
                <el-tooltip class="zhuce" effect="zhuce" placement="right">
                  <div slot="content">
                    包括停止、暂停、撤市、无研发进展报道
                  </div>
                  <span class="section-ico-qa" style="margin-left: 4px"></span>
                </el-tooltip>
              </div>
              <div style="line-height: 1;" v-else>
                <TableHeadFilter v-if="item.prop==='indication'" name="适应症" :offset="-12" :props="{label: 'label'}"
                  :options="
                    (ypz_filters['indication']||[]).map((t) => ({label: t}))
                  " @confirm="ypz_confirm" @cancel="ypz_cancel"></TableHeadFilter>
                <span v-else>{{ item.label}}</span>
              </div>
            </template>
            <template slot-scope="scope">
              <div :title="scope.row[item.prop]">
                <!-- @click="linkYwList(scope.row, scope.row[item.prop], item.prop)"  -->
                <div v-if="
                  item.prop!=='indication'&&item.prop!=='total'
                " class="scope-bg" :style="{
  background: getIndicationBg(scope.row[item.prop]),
  color: getIndicationColor(scope.row[item.prop]),
  // cursor: scope.row[item.prop] > 0 ? 'pointer' : ''
}">
                  {{
                      scope.row[item.prop]>0? scope.row[item.prop]:""
                  }}
                </div>
                <div v-else class="scope-bg" style="padding-left: 14px">
                  {{ scope.row[item.prop]}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination v-if="indicationInitNumTotal>0&&indicationInitNumTotal>syzbjObj.pageSize"
            @current-change="syzbjHandleCurrentChange" :current-page="syzbjObj.page" :page-size="syzbjObj.pageSize"
            layout="total, prev, next" hide-on-single-page :total="indicationInitNumTotal">
          </el-pagination>
          <div class="tips-box">
            <div class="tips">*统计同靶点同适应症各个阶段的药品数量</div>
          </div>
        </div>
      </div>
    </div>
    <div class="syz-section" v-if="show2">
      <div class="section-title">
        <span>适应症进展：</span>
        <!-- <span style="color: #9aa4b8">({{ syzyfjz_count }})</span>: -->
      </div>
      <div class="section-content" v-waiting="syzjzLoading">
        <el-table class="syzjz-table" ref="syzjz" :border="true" :span-method="SpanMethod" :data="medicineInitData"
          style="width: 100%" @sort-change="syzjz_sort_change" :show-header="syzjz_show_header">
          <el-table-column min-width="140" label="适应症" prop="indication" sortable>
            <template slot="header">
              <TableHeadFilter name="适应症" :offset="-12" :props="{label: 'label'}" :options="
              (syzjz_filters['indication']||[])|options" :saved_condition="syzjz_saved_condition"
                @confirm="syzyfjz_confirm('indication',$event)" @cancel="syzyfjz_cancel('indication')"
                prop="indication">
              </TableHeadFilter>
            </template>
            <template slot-scope="scope">
              <div>
                <el-tooltip class="overflow" style="width: 100%;" effect="light" placement="right">
                  <div slot="content">
                    {{ scope.row.indication}}
                  </div>
                  <span>{{ scope.row.indication}}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="140" label="药品名称" prop="drugname" sortable>
            <template slot="header">
              <TableHeadFilter name="药品名称" :offset="-12" :props="{label: 'label'}" :options="
                (syzjz_filters['drugname']||[])|options
              " @confirm="syzyfjz_confirm('drugname',$event)" :saved_condition="syzjz_saved_condition"
                @cancel="syzyfjz_cancel('drugname')" prop="drugname">
              </TableHeadFilter>
            </template>
            <template slot-scope="scope">
              <div>
                <el-tooltip class="overflow" style="width: 100%;" effect="light" placement="right">
                  <div slot="content">
                    <div class="cl-blue" style="color: #002fa7;cursor: pointer;"
                      @click="linkDrugDetail(scope.row.hash_drugname,scope.row.hash_company)">
                      {{ scope.row.drugname}}
                    </div>
                  </div>
                  <div class="cl-blue" style="color: #002fa7;cursor: pointer;"
                    @click="linkDrugDetail(scope.row.hash_drugname,scope.row.hash_company)">
                    {{ scope.row.drugname}}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="140" label="研发单位" prop="company" sortable>
            <template slot="header">
              <TableHeadFilter name="研发单位" :offset="-12" :props="{label: 'label'}" :options="
                (syzjz_filters['company']||[])|options
              " @confirm="syzyfjz_confirm('company',$event)" :saved_condition="syzjz_saved_condition"
                @cancel="syzyfjz_cancel('company',$event)" prop="company">
              </TableHeadFilter>
            </template>
            <template slot-scope="{ row }">
              <div>
                <el-tooltip class="overflow" style="width: 100%;" effect="light" placement="right">
                  <div slot="content">
                    <div v-for="(item,index) in row.company" :key="'tooltip_'+index">
                      <span v-if="item.have_info" class="cl-blue" style="color: #002fa7;cursor: pointer;"
                        @click="linkCompanyDetail(item.hash_name)">
                        {{ item.name}}
                      </span>
                      <span v-else>{{ item.name}}</span>
                    </div>
                  </div>
                  <div v-for="(item,index) in row.company" :key="index">
                    <span v-if="item.have_info" class="cl-blue" style="color: #002fa7;cursor: pointer;"
                      @click="linkCompanyDetail(item.hash_name)">
                      {{ item.name}}
                    </span>
                    <span v-else>{{ item.name}}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="600">
            <template slot="header">
              <div class="cus-head">
                <div>临床前</div>
                <div>临床申请</div>
                <div>临床Ⅰ期</div>
                <div>临床Ⅱ期</div>
                <div>临床Ⅲ期</div>
                <div>注册申请</div>
                <div>批准上市</div>
              </div>
            </template>
            <template slot-scope="{ row }">
              <div class="line" v-if="findEnumIndex(row.worldstatus_int)>=0">
                <div v-for="(c,i) in global_line_map" :key="c" :style="{
                  backgroundColor: c,
                  left: -i*3+'%',
                  zIndex: 10-i,
                }" class="line-item" v-if="findEnumIndex(row.worldstatus_int)>=i">
                  <span :class="[
                    'line-item_label',
                    findEnumIndex(row.worldstatus_int)<2? 'dark':'',
                  ]" :style="{
  color: (i<=2? '#35384a':'#FFF')
}" v-if="findEnumIndex(row.worldstatus_int)==i" style="font-size: 12px">{{
    row.worldstatus_date
}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="各地获批状态">
            <el-table-column prop="CHINA" label="中国" min-width="120">
              <template slot-scope="{ row }">
                <div v-if="row.CHINA.flag||row.CHINA.date">
                  <span v-if="row.CHINA.flag" style="font-weight: bold;color: #9DCC40;">
                    <img src="@/assets/imgs/globaldrugs/detail/ok-globaldrugs.png" width="16" height="13" />
                  </span>
                  <span v-if="row.CHINA.date">({{ row.CHINA.date}})</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="USA" label="美国" min-width="120">
              <template slot-scope="{ row }">
                <div v-if="row.USA.flag||row.USA.date">
                  <span v-if="row.USA.flag" style="font-weight: bold;color: #9DCC40;">
                    <img src="@/assets/imgs/globaldrugs/detail/ok-globaldrugs.png" width="16" height="13" />
                  </span>
                  <span v-if="row.USA.date">({{ row.USA.date}})</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="EU" label="欧盟" min-width="120">
              <template slot-scope="{ row }">
                <div v-if="row.EU.flag||row.EU.date">
                  <span v-if="row.EU.flag" style="font-weight: bold;color: #9DCC40;">
                    <img src="@/assets/imgs/globaldrugs/detail/ok-globaldrugs.png" width="16" height="13" />
                  </span>
                  <span v-if="row.EU.date">({{ row.EU.date}})</span>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination v-if="medicationInitNumTotal>0&&medicationInitNumTotal>syzjzObj.pageSize"
            @current-change="syzjzHandleCurrentChange" :current-page="syzjzObj.page" :page-size="syzjzObj.pageSize"
            layout="total, prev, next" hide-on-single-page :total="medicationInitNumTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="syz-section" v-if="show3">
      <div class="section-title">
        <span>适应症分布：</span>
      </div>
      <div class="section-content" v-waiting="syzfbLoading">
        <el-table ref="inTable" :data="indicationStatusData" border fixed class="in-table" style="width: 100%"
          v-if="indicationInitStatusData.length>0">
          <el-table-column v-for="(item,index) in indicationStatusThead" :prop="item.field" :key="index"
            :min-width="item.field=='drugname'? 200:150" :width="item.field=='drugname'? 200:''"
            :label="item.label" :fixed="item.field=='drugname'" align="center">
            <!-- 自定义表头 -->
            <template slot="header" slot-scope="scope">
              <TableHeadSelect ref="in-Select" v-if="item.field==='drugname'" :name="item.label"
                style="line-height: 55px;" :offset="-12" :props="{label: 'label'}" :options="syzfb_filters"
                @confirm="syzfb_confirm" :saved_condition="syzfb_saved_condition" @cancel="syzfb_cancel"
                prop="drugname">
              </TableHeadSelect>
              <span v-else :title="item.label">{{ item.label}}</span>
            </template>
            <template slot-scope="scope">
              <div v-if="item.field==='drugname'" :title="scope.row[item.field]">
                <el-tooltip style="width: 100%;" effect="light">
                  <div slot="content">
                    <div>
                      <div>{{ scope.row[item.field]}}</div>
                      <div v-if="scope.row.company">{{ scope.row.company}}</div>
                    </div>
                  </div>
                  <div class="overflow">
                    <span>{{ scope.row[item.field]}}</span>
                    <span v-if="scope.row.company">({{ scope.row.company}})</span>
                  </div>
                </el-tooltip>
              </div>
              <div v-else :title="scope.row[item.field].name">
                <div class="scope-bg"
                  :style="{background: getBgColor(scope.row[item.field]).bg,color: getBgColor(scope.row[item.field]).color}">
                  {{ scope.row[item.field].name}}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination v-if="indicationInitStatusTotal>0&&indicationInitStatusTotal>syzfbObj.pageSize"
            @current-change="syzfbHandleCurrentChange" :current-page="syzfbObj.page" :page-size="syzfbObj.pageSize"
            layout="total, prev, next" hide-on-single-page :total="indicationInitStatusTotal">
          </el-pagination>
          <div class="tips-box">
            <div class="tips">*药品不同适应症的最高状态</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableHeadFilter from "@/components/common/globaldrugs/table-head-filter";
import TableHeadSelect from "@/components/common/globaldrugs/table-head-select";

// import LoadingGif from "@/components/common/globalCom/loading-gif";
const defaultFiled = [{
  prop: 'indication',
  label: "适应症",
  width: 200,
  checked: true
}, {
  prop: 'status10',
  label: "临床前",
  width: 100,
  checked: true
}, {
  prop: 'status20',
  label: "临床申请",
  width: 100,
  checked: true
}, {
  prop: 'status30',
  label: "临床Ⅰ期",
  width: 100,
  checked: true
}, {
  prop: 'status40',
  label: "临床Ⅱ期",
  width: 100,
  checked: true
}, {
  prop: 'status50',
  label: "临床Ⅲ期",
  width: 100,
  checked: true
}, {
  prop: 'status60',
  label: "注册申请",
  width: 100,
  checked: true
}, {
  prop: 'status70',
  label: "批准上市",
  width: 100,
  checked: true
}, {
  prop: 'status0',
  label: "其他",
  tips: true,
  width: 100,
  checked: true
}, {
  prop: 'total',
  label: "总计",
  width: 100,
  checked: true
}]

// 适应症板块
export default {
  name: "badian-syz",
  components: {
    TableHeadFilter,
    TableHeadSelect
  },
  // components: {LoadingGif},
  props: {
    base: {
      default: () => ({}),
      type: Object,
    },
  },
  filters: {
    options(value) {
      return value.map(t => ({ label: t }))
    }
  },
  data() {
    return {
      syzfb_filters: [],// 适应症分布表头筛选下拉框数据项
      syzfb_saved_condition: "",// 适应症进展
      syzbj_saved_condition: "",// 适应症布局
      syzjz_saved_condition: "", // 适应症研发明细 已选条件存储
      syzjz_filters: {
        indication: [],
        drugname: [],
        company: []
      }, // 适应症研发进展 筛选项
      colorData: [
        { color: "#545B6D", bg: "#FAFBFD" },
        { color: "#545B6D", bg: "#E4EAFA" },
        { color: "#FFF", bg: "#C8D6F9" },
        { color: "#FFF", bg: "#ABC2F6" },
        { color: "#FFF", bg: "#92ADF1" },
        { color: "#FFF", bg: "#648AEC" },
        { color: "#FFF", bg: "#4A78E7" },
        { color: "#FFF", bg: "#3556B9" },
      ], // 适应症布局第一个列表的背景颜色数组
      indicationNumSize: 10, // 默认展示10条数据
      indicationNumMax: 0,
      indicationInitNumTotal: 0,
      indicationNumThead: defaultFiled, //  适应症布局第一个列表的表头
      indicationStatusSize: 10, // 默认展示10条数据
      indicationNumData: [], // 适应症布局第一个列表的数量数据
      indicationInitNumData: [], // 适应症布局第一个列表所有的数据，用来做前端翻页
      indicationStatusData: [], // 适应症布局第二个列表的适应症上市状态数据
      indicationInitStatusData: [], // 适应症布局第二个列表所有的数据，用来做前端翻页
      indicationStatusThead: [], // 适应症布局第二个列表的表头数据
      indicationStatusSize: 10, // 默认展示10条数据
      indicationInitStatusTotal: 0,
      ypz: [],
      ypz_count: 0,
      ypz_filters: {}, // 已批准适应症 筛选项
      syzyfjz: [],
      syzyfjz_count: 0,
      syzbjObj: {
        order: null, // 排序
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      syzjzObj: {
        order: null, // 排序
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      syzfbObj: {
        order: null, // 排序
        page: 1, // 页数
        pageSize: 10 // 每页条数
      },
      syzbjLoading: true,
      syzjzLoading: true,
      syzfbLoading: true,
      global_line_map: [
        "#E5EFFC",
        "#C6DAFC",
        "#A2C4FE",
        "#82AEFD",
        "#4680F7",
        "#2B68F6",
        "#002FA7",
      ],
      cn_line_map: [
        "#F5FAEC",
        "#E8F3D1",
        "#D6E9AF",
        "#C1DE85",
        "#B1D666",
        "#9DCC40",
        "#85C407",
      ],
      yfmx: [],
      yfms_page: 1,
      yfms_total: 0,
      Loading: true,
      medicineData: [], // 药物进展列表显示数据
      medicineInitData: [], // 药物进展列表所有的数据，用来做前端翻页
      medicineCount: 0, // 药物进展列表count
      medicationInitNumTotal: 0,// 药物进展列表总数
      medicineSize: 10, // 默认展示10条数据
      medicineChart: [], // 药物进展图表数据
      medicineOrder: "", // 药物进展排序参数
      medicine_span_map: {},
      drugnameOrder: {
        // 控制药物名称排序按钮的激活样式
        asc: false,
        desc: false,
      },
      indicationOrder: {
        // 控制适应症排序按钮的激活样式
        asc: false,
        desc: false,
      },
      companyOrder: {
        // 控制适应症排序按钮的激活样式
        asc: false,
        desc: false,
      },
      spanArr: [],
      position: 0,
      show1: false,
      show2: false,
      show3: false,
      syzjz_orders: "", // 适应症研发进展排序条件
      syzjz_show_header: true
    };
  },
  methods: {
    syzjz_sort_change({ column, prop, order }) {
      if (prop) {
        this.syzjz_orders = `${prop} ${order == 'ascending' ? 'asc' : 'desc'}`
      } else {
        this.syzjz_orders = ''
      }
      this.syzjzHandleCurrentChange(1);
      this.setTableFilterOptions()
    },
    syzfb_confirm(payload) {
      this.syzfbLoading = true;
      this.syzfb_saved_condition = payload;
      this.indicationStatusThead = [];
      this.indicationInitStatusData = [];
      this.indicationStatusData = [];
      let params = {
        target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
        position: 3,
        level: this.syzfb_saved_condition,
        accesstoken: GETCOOKIEFUN("accesstoken"),
      };
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/targetIndication",
        params,
      });
      get_ypz.then(async (res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          let data = res.data.data.distribution;
          this.indicationStatusThead = data.table_th
            ? data.table_th
            : [];
          await this.$nextTick();
          console.log(this.indicationStatusThead);
          this.indicationInitStatusData = data.list ? data.list : [];
          this.indicationInitStatusTotal = data.count ? data.count : false;
          this.indicationStatusData = data.list ? data.list : [];
        }
        this.syzfbLoading = false;
      }).catch(err => {
        console.log(err);
        this.syzfbLoading = false;
      })
    },
    syzfb_cancel() {
      this.indicationStatusThead = [];
      this.indicationInitStatusData = [];
      this.indicationStatusData = [];
      let params = _.assign(
        {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          position: 3,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      // if (!strs) {
      //   delete params.filter_condition;
      // }
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/targetIndication",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          let data = res.data.data.distribution;
          this.indicationStatusThead = data.table_th
            ? data.table_th
            : [];
          this.indicationInitStatusData = data.list ? data.list : [];
          this.indicationInitStatusTotal = data.count ? data.count : false;
          this.indicationStatusData = data.list ? data.list : [];
        }
      })
    },
    // 转换药物明细筛选对象为字符串
    encode_conditions(obj) {
      let str = "";
      Object.keys(obj).forEach((item, index) => {
        if (index) {
          str += " _and ";
        }
        str += item;
        str += "=";
        str += obj[item].join("ღ");
      });
      return str;
    },
    // 转换药物明细筛选字符串为对象
    decode_conditions() {
      let cache = this.syzjz_saved_condition;
      let condition_array = cache.split(" _and ");
      let condition_obj = {};
      condition_array.forEach((item) => {
        if (item) {
          let [key, value] = item.split("=");
          let val = value ? value.split("ღ") : [];
          if (key && key.replace(/\s/g, '')) {
            condition_obj[key] = val;
          }
        }
      });
      return condition_obj;
    },
    // 根据接口获取联动后的 tablefilter
    setTableFilterOptions() {
      Axios({
        method: "get",
        url: '/api/globaldrugs/targetIndicationProgressLink',
        params: {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          filter_condition: this.syzjz_saved_condition
        }
      }).then(res => {
        if (res.data.code == 200) {
          // 联动 有问题 出发不了 更新，重新挂载组件会导致已选条件丢失 修改非常麻烦。
          this.syzjz_filters = res.data.data;
          this.syzjz_show_header = false;
          this.$nextTick(() => {
            this.syzjz_show_header = true;
            this.$refs.syzjz.doLayout();
          })
        }
      })
    },
    syzyfjz_confirm(key, nodes) {
      let old_condition = this.decode_conditions();
      if (nodes.length) {
        old_condition[key] = nodes.map(t => (t.label));
      } else {
        delete old_condition[key];
      }
      let new_condition = this.encode_conditions(old_condition);
      this.syzjz_saved_condition = new_condition;
      console.log(new_condition);
      this.syzjzHandleCurrentChange(1);
      this.setTableFilterOptions()
    },
    syzyfjz_cancel(key) {
      let old_condition = this.decode_conditions();
      delete old_condition[key];
      let new_condition = this.encode_conditions(old_condition);
      this.syzjz_saved_condition = new_condition;
      console.log(new_condition);
      this.syzjzHandleCurrentChange(1);
      this.setTableFilterOptions()
    },
    ypz_confirm(payload) {
      this.syzbjLoading = true;
      let strs = payload.map((t) => t.label).join("ღ");
      if (strs) {
        this.syzbj_saved_condition = "indication=" + strs;
      } else {
        this.syzbj_saved_condition = "";
      }
      let params = _.assign(
        {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          position: 1,
          filter_condition: this.syzbj_saved_condition,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      // if (!strs) {
      //   delete params.filter_condition;
      // }
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/targetIndication",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.indicationNumData = res.data.data.layout ? res.data.data.layout.list : [];
          this.indicationInitNumTotal = res.data.data.layout.count ? res.data.data.layout.count : false;
        }
        this.syzbjLoading = false;
      }).catch(err => {
        console.log(err);
        this.syzbjLoading = false;
      })
    },
    ypz_cancel() {
      let params = _.assign(
        {
          target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
          position: 1,
        },
        {
          accesstoken: GETCOOKIEFUN("accesstoken"),
        }
      );
      let get_ypz = Axios({
        method: "get",
        url: "/api/globaldrugs/targetIndication",
        params,
      });
      get_ypz.then((res) => {
        if (res.data.code == 200 && this.isEmpty(res.data.data)) {
          this.indicationNumData = res.data.data.layout ? res.data.data.layout.list : [];
          this.indicationInitNumTotal = res.data.data.layout.count ? res.data.data.layout.count : false;
        }
      });
    },
    linkDrugDetail(drugname_standard, company_standard) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_适应症_适应症进展_跳转到药品详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_适应症_适应症进展_跳转到药品详情页"
      ]);
      const { href } = this.$router.resolve({
        path: '/globaldrugs/detail',
        query: {
          drugname_standard,
          company_standard
        }
      })
      window.open(href, "_blank")
    },
    linkCompanyDetail(company_standard) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_适应症_适应症进展_跳转到企业管线详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_适应症_适应症进展_跳转到企业管线详情页"
      ]);
      const { href } = this.$router.resolve({
        path: '/globaldrugs/companyDetail',
        query: {
          company_standard
        }
      })
      window.open(href, "_blank")
    },
    getBgColor(status) {
      let phaseColorBlock = [
        {
          bg: "#FAFBFD",
          color: '#545B6D',
          label: "临床前"
        },
        {
          bg: "#E4EAFA",
          color: '#545B6D',
          label: "临床申请"
        },
        {
          bg: "#C8D6F9",
          color: '#FFF',
          label: "临床Ⅰ期"
        },
        {
          bg: "#ABC2F6",
          color: '#FFF',
          label: "临床Ⅱ期"
        },
        {
          bg: "#92ADF1",
          color: '#FFF',
          label: "临床Ⅲ期"
        },
        {
          bg: "#648AEC",
          color: '#FFF',
          label: "注册申请"
        },
        {
          bg: "#002fa7",
          color: '#FFF',
          label: "批准上市"
        }
      ],
        color = "";
      if (status.name && phaseColorBlock.filter(item => item.label === status.name).length > 0) {
        color = phaseColorBlock.filter(item => item.label === status.name)[0];
      }
      return color;
    },
    calHtable() {
      if (window.isIEAndLtIE11) {
        return;
      }
      setTimeout(
        _.debounce(() => {
          let gHeight = 8; // 表格滚动条设置的为8px，所以赋值默认为8
          let ua = navigator.userAgent.toLowerCase(); //获取用户端信息
          let info = {
            ie: /msie/.test(ua) && !/opera/.test(ua), //匹配IE浏览器
            op: /opera/.test(ua), //匹配Opera浏览器
            sa: /version.*safari/.test(ua), //匹配Safari浏览器
            ch: /chrome/.test(ua), //匹配Chrome浏览器
            ff: /gecko/.test(ua) && !/webkit/.test(ua), //匹配Firefox浏览器
          };
          // 修改滚动条的样式不兼容ie和火狐，所以需要单独处理
          if (info.ie || info.ff) {
            gHeight = 16;
            return;
          }
          // 处理表格底部和右边滚动条导致表格错位问题
          const tableWrapper = $(".in-table .el-table__body-wrapper");
          const tableBody = $(".in-table .el-table__body");
          // console.log(tableWrapper, tableBody)
          // console.log(tableWrapper[0].offsetWidth, tableBody[0].clientWidth)
          const colgroup = document.querySelector(".in-table colgroup");
          /**
           * (以下数值为滚动条高度，可以自己根据情况通过class重新修改)
           */
          //内容大于容器时
          if (!tableBody[0]) return;
          if (
            tableBody[0].clientWidth &&
            tableBody[0].clientWidth > tableWrapper[0].offsetWidth &&
            tableWrapper[0].offsetWidth
          ) {
            //设置x轴滚动
            tableWrapper[0].style.overflowX = "auto";
            //解决固定列错位 （没有错位的可以忽略以下内容）
            let fixedWrap = document.querySelector(
              ".in-table.el-table .el-table__fixed-body-wrapper"
            );
            // console.log(fixedWrap);
            if (fixedWrap) {
              fixedWrap.style.paddingBottom = gHeight + "px";
              fixedWrap.style.height = `calc(100% - ${gHeight * 3}px)`;
            }
            //解决固定列覆盖滚动条
            let fixed_left = document.querySelector(
              ".in-table.el-table .el-table__fixed"
            );
            let fixed_right = document.querySelector(
              ".in-table.el-table .el-table__fixed-right"
            );
            if (fixed_left) {
              fixed_left.style.height = `calc(100% - ${gHeight}px)`;
            }
            if (fixed_right) {
              fixed_right.style.height = `calc(100% - ${gHeight}px)`;
            }
            //解决表头偏移
            //没有原生的gutter时自己新增一个
            let gutter = colgroup.querySelector(`col[name=gutter]`);
            let gutterx = colgroup.querySelector(`col[name=gutterx]`);
            // console.log(colgroup);
            if (gutterx) {
              colgroup.removeChild(gutterx);
              gutterx = colgroup.querySelector(`col[name=gutterx]`);
              gutter = colgroup.querySelector(`.col[name=gutter]`);
            }
            if (!gutter && !gutterx) {
              // console.log(12313);
              let col = document.createElement("col");
              col.setAttribute("name", "gutterx");
              col.setAttribute("width", `${gHeight}`);
              colgroup.appendChild(col);
            }
          } else {
            tableWrapper[0].style.overflowX = "hidden";
          }
        }, 500),
        500
      );
    },
    SpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 超出20个字符显示省略号
    cutLength(str) {
      let len = String(str).length;
      let arr = [];
      let ret = "";
      if (len > 19 && window.isIEAndLtIE11) {
        arr = String(str).split("");
        arr.splice(19, len - 19, "...");
        ret = arr.join("");
      } else {
        ret = str;
      }
      return ret;
    },
    rowspan() {
      this.medicineInitData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (this.medicineInitData[index].indication === this.medicineInitData[index - 1].indication) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    // 获取适应症进展数据
    getMedicine(page, paged) {
      this.medicineSize = 10;
      this.medicineInitData = [];
      this.medicineChart = [];
      this.medicineData = [];
      this.spanArr = []
      this.syzjzLoading = true;
      window
        .Axios({
          methods: "get",
          url: "/api/globaldrugs/targetIndication",
          params: _.assign(
            {
              target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
              position: 2,
              page,
              filter_condition: this.syzjz_saved_condition,
              order: this.syzjz_orders
            },
            {
              accesstoken: GETCOOKIEFUN("accesstoken"),
            }
          ),
        })
        .then((res) => {
          this.loading = false;
          if (res.data && res.data.code === 200 && res.data.data.progress.list && res.data.data.progress.list.length > 0) {
            let data = res.data.data.progress;
            this.show2 = true;
            this.medicineInitData = data.list ? data.list : [];
            this.rowspan();
            this.medicationInitNumTotal = data.count ? data.count : false;
            if (this.medicineInitData.length <= 0) return;
            this.medicineCount = data.count;

            let arr = _.cloneDeep(this.medicineInitData);
            this.medicineData = arr.splice(0, this.medicineSize);
            if (!paged) this.syzjz_filters = data ? data.filters : {};
            this.syzjzLoading = false;
            // this.medicineChart = this.medicineChart.reverse();
            // this.$nextTick(() => {
            //   this.drawMedicineChart(this.medicineChart);
            // });
          } else {
            this.syzjzLoading = false;
            this.show2 = false;
          }
        }).catch(err => {
          console.log(err);
          this.syzjzLoading = false;
        })
    },
    // 药物进展排序
    sortChange(sort, name) {

      // 药物名称
      if (name === "drugname") {
        // 清空适应症和研发企业的激活状态
        this.indicationOrder = {
          asc: false,
          desc: false,
        };
        this.companyOrder = {
          asc: false,
          desc: false,
        };

        // asc
        if (sort === "asc") {
          // 当已经为asc排序时，就重置排序状态为空，否则为asc排序
          if (this.drugnameOrder.asc) {
            this.drugnameOrder = {
              asc: false,
              desc: false,
            };
            this.medicineOrder = ''
          } else {
            this.drugnameOrder = {
              asc: true,
              desc: false,
            };
            this.medicineOrder = `${name} ${sort}`;
          }
        } else {
          // 当已经为desc排序时，就重置排序状态为空，否则为desc排序
          if (this.drugnameOrder.desc) {
            this.drugnameOrder = {
              asc: false,
              desc: false,
            };
            this.medicineOrder = ''
          } else {
            this.drugnameOrder = {
              asc: false,
              desc: true,
            };
            this.medicineOrder = `${name} ${sort}`;
          }
        }

        this.getMedicine(this.syzjzObj.page);
      }

      // 适应症
      if (name === "indication") {
        // 清空药物名称和研发企业的激活状态
        this.drugnameOrder = {
          asc: false,
          desc: false,
        };
        this.companyOrder = {
          asc: false,
          desc: false,
        };

        // asc
        if (sort === "asc") {
          // 当已经为asc排序时，就重置排序状态为空，否则为asc排序
          if (this.indicationOrder.asc) {
            this.indicationOrder = {
              asc: false,
              desc: false,
            };
            this.medicineOrder = ''
          } else {
            this.indicationOrder = {
              asc: true,
              desc: false,
            };
            this.medicineOrder = `${name} ${sort}`;
          }
        } else {
          // 当已经为desc排序时，就重置排序状态为空，否则为desc排序
          if (this.indicationOrder.desc) {
            this.indicationOrder = {
              asc: false,
              desc: false,
            };
            this.medicineOrder = ''
          } else {
            this.indicationOrder = {
              asc: false,
              desc: true,
            };
            this.medicineOrder = `${name} ${sort}`;
          }
        }

        this.getMedicine(this.syzjzObj.page);
      }

      // 研发企业
      if (name === "company") {
        // 清空药物名称和适应症的激活状态
        this.drugnameOrder = {
          asc: false,
          desc: false,
        };
        this.indicationOrder = {
          asc: false,
          desc: false,
        };

        // asc
        if (sort === "asc") {
          // 当已经为asc排序时，就重置排序状态为空，否则为asc排序
          if (this.companyOrder.asc) {
            this.companyOrder = {
              asc: false,
              desc: false,
            };
            this.medicineOrder = ''
          } else {
            this.companyOrder = {
              asc: true,
              desc: false,
            };
            this.medicineOrder = `${name} ${sort}`;
          }
        } else {
          // 当已经为desc排序时，就重置排序状态为空，否则为desc排序
          if (this.companyOrder.desc) {
            this.companyOrder = {
              asc: false,
              desc: false,
            };
            this.medicineOrder = ''
          } else {
            this.companyOrder = {
              asc: false,
              desc: true,
            };
            this.medicineOrder = `${name} ${sort}`;
          }
        }

        this.getMedicine(this.syzjzObj.page);
      }
    },
    // 适应症布局点击数字跳转到药物列表页面
    linkYwList(col, obj, colName) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_适应症_适应症布局_跳转药物详情页");
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_适应症_适应症布局_跳转药物详情页"
      ]);
      if (obj > 0) {
        let dictionary = {
          "status10": '10', // 临床前
          "status20": '20', // 临床申请
          "status30": '30', // 临床Ⅰ期
          "status40": '40', // 临床Ⅱ期
          "status50": '50', // 临床Ⅲ期
          "status60": '60', // 注册申请
          "status70": '70', // 批准上市
          "status0": '80', // 撤市/其他
        }
        let { href } = this.$router.resolve({
          path: "/globaldrugs",
          query: {
            indication: col.indication,
            targets: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
            filter_condition: JSON.stringify({
              phase1: [dictionary[colName]]
            })
          }
        });
        window.open(href, "_blank");
      }
    },
    // 适应症布局第一个列表展开更多, 每次点击新增10条数据
    indicationNumMore() {
      this.indicationNumSize += 10;
      let arr = _.cloneDeep(this.indicationInitNumData);
      this.indicationNumData = arr.splice(0, this.indicationNumSize);
    },

    // 适应症布局第二个列表展开更多, 每次点击新增10条数据
    indicationStatusMore() {
      this.indicationStatusSize += 10;
      let arr = _.cloneDeep(this.indicationInitStatusData);
      this.indicationStatusData = arr.splice(0, this.indicationStatusSize);
    },

    // 获取适应症布局数据
    getIndication(page, paged) {
      this.syzbjLoading = true;
      this.indicationInitNumData = [];
      this.indicationNumMax = 0;
      this.indicationNumSize = 10;
      this.indicationStatusSize = 10;
      window
        .Axios({
          methods: "get",
          url: "/api/globaldrugs/targetIndication",
          params: _.assign(
            {
              target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
              position: 1,
              page,
              filter_condition: this.syzbj_saved_condition
            },
            {
              accesstoken: GETCOOKIEFUN("accesstoken"),
            }
          ),
        })
        .then((res) => {
          if (res.data && res.data.code === 200 && res.data.data.layout.list.length > 0) {
            let data = res.data.data;
            this.show1 = true;
            this.indicationInitNumData = data.layout.list ? data.layout.list : [];
            this.indicationInitNumTotal = data.layout.count ? data.layout.count : false;
            if (this.indicationInitNumData.length <= 0) return;
            this.indicationNumMax = data.layout.max;
            let arr = _.cloneDeep(this.indicationInitNumData);
            this.indicationNumData = arr.splice(0, this.indicationNumSize);
            if (!paged) this.ypz_filters = data.layout ? data.layout.filters : {};
            this.syzbjLoading = false;
          } else {
            this.syzbjLoading = false;
            this.show1 = false;
          }
        }).catch(err => {
          console.log(err);
          this.syzbjLoading = false;
        })
    },
    // 获取适应症分布数据
    getIndicationStatus(page, paged) {
      this.syzfbLoading = true;
      this.indicationStatusThead = [];
      this.indicationInitStatusData = [];
      this.indicationStatusData = [];
      this.indicationStatusSize = 10;
      window
        .Axios({
          methods: "get",
          url: "/api/globaldrugs/targetIndication",
          params: _.assign(
            {
              target: (this.base.targets_abbr ? this.base.targets_abbr : this.base.targets),
              position: 3,
              page,
              level: this.syzfb_saved_condition,
            },
            {
              accesstoken: GETCOOKIEFUN("accesstoken"),
            }
          ),
        })
        .then((res) => {
          if (res.data && res.data.code === 200 && res.data.data.distribution.list && res.data.data.distribution.list.length > 0) {
            let data = res.data.data.distribution;
            this.show3 = true;
            this.indicationStatusThead = data.table_th
              ? data.table_th
              : [];
            if (!paged) {
              this.syzfb_filters = data.levels ? data.levels : [];
            } else {
              // this.$refs["in-Select"].selectValue = this.syzfb_saved_condition;
            }
            this.indicationInitStatusData = data.list;
            this.indicationInitStatusTotal = data.count ? data.count : false;
            let arr2 = _.cloneDeep(this.indicationInitStatusData);
            this.indicationStatusData = arr2.splice(
              0,
              this.indicationStatusSize
            );
            this.syzfbLoading = false;
          } else {
            this.syzfbLoading = false;
            this.show3 = false;
          }
        }).catch(err => {
          console.log(err);
          this.syzfbLoading = false;
        })
    },
    // 获取适应症布局第一个列表的数字背景色
    getIndicationBg(num) {
      // 规则 指定十个颜色，根据最大数据值分区间进行赋色，比如最大数值为10，则一个数字对应一个颜色，比如最大数字是100，则1-10对应第一个颜色、11-20对应第二个颜色...以此类推
      // this.colorData[Math.ceil(num/Math.ceil(indicationNumMax/10))-1].bg
      if (num == 0 || this.indicationNumMax <= 0) {
        return "";
      } else {
        let index = Math.ceil(num / Math.ceil(this.indicationNumMax / 8)) - 1;
        // if (index >= this.colorData.length) {
        //   index = this.colorData.length - 1
        // }
        return this.colorData[index].bg;
      }
    },
    // 获取适应症布局第一个列表的数字颜色
    getIndicationColor(num) {
      // this.colorData[Math.ceil(num/Math.ceil(indicationNumMax/10))-1].color
      if (num == 0 || this.indicationNumMax <= 0) {
        return "";
      } else {
        let index = Math.ceil(num / Math.ceil(this.indicationNumMax / 8)) - 1;
        // if (index >= this.colorData.length) {
        //   index = this.colorData.length - 1
        // }
        return this.colorData[index].color;
      }
    },
    // 根据类型 去跳转 查看的方法
    typedJump(source, id, row) {
      let typeMap = {
        全球临床: "/clinical/" + id,
        中国临床: "/linchuangshiyan/" + id,
        注册: "/zhuce/" + id,
        中国: () => {
          if (row.link.tp == 1) {
            return `/cfdadrug/detail/${row.link.id}?pizhunwenhao=${row.link.pizhunwenhao}`;
          } else {
            return `/cfdadrug/jkdetail/${row.link.id}?pizhunwenhao=${row.link.pizhunwenhao}`;
          }
        },
        美国: `/fdadrugnew/${row.link.id}`,
        欧盟EMA: `/epyp/emadetail/${row.link.id}`,
        欧盟HMA: `/epyp/hmadetail/${row.link.id}`,
        日本: `/pmda/${row.link.id}`,
        英国: `/uk/${row.link.id}`,
        中国台湾: `/taiwan/${row.link.id}`,
        德国: `/germany/${row.link.id}`,
        加拿大: `/canada/${row.link.id}`,
        法国: `/france/${row.link.id}`,
        印度: `/india/${row.link.id}`,
        韩国: `/korean/${row.link.id}`,
      };
      return typeof typeMap[source] == 'function' ? typeMap[source]() : typeMap[source]
    },
    async syzbjHandleCurrentChange(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_适应症_适应症布局_翻页_" + val);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_适应症_适应症布局_翻页_" + val
      ]);
      this.syzbjObj.page = val;
      this.getIndication(this.syzbjObj.page, true);
    },
    async syzjzHandleCurrentChange(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_适应症_适应症进展_翻页_" + val);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_适应症_适应症进展_翻页_" + val
      ]);
      this.syzjzObj.page = val;
      this.getMedicine(this.syzjzObj.page, true);
    },
    async syzfbHandleCurrentChange(val) {
      window.ga("send", "event", "button", "click",
        "企业版_全球药物_靶点详情_适应症_适应症分布_翻页_" + val);
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        "企业版_全球药物_靶点详情_适应症_适应症分布_翻页_" + val
      ]);
      this.syzfbObj.page = val;
      this.getIndicationStatus(this.syzfbObj.page, true);
    },

    findEnumIndex(num) {
      let enums = [10, 20, 30, 40, 50, 60, 70];
      return enums.findIndex((t) => t == num);
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.calHtable();
    });
  },
  watch: {
    base: {
      async handler(val) {
        if (this.isEmpty(val)) {
          await this.getIndication(this.syzbjObj.page);
          await this.getMedicine(this.syzjzObj.page);
          await this.getIndicationStatus(this.syzfbObj.page)
          await window.addEventListener(
            "resize",
            _.debounce(() => {
              this.calHtable();
            }, 500)
          );
        }
      },
    },
    show3(val) {
      if (!this.show1 && !this.show2 && !this.show3) {
        this.$root.$emit('hide-section', '适应症')
      }
    },
    indicationStatusThead: {
      handler() {
        this.$nextTick(() => {
          this.calHtable();
        });
      },
      immediate: true,
      deep: true,
    },

    indicationStatusData: {
      handler() {
        this.$nextTick(() => {
          this.calHtable();
        });
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    window.addEventListener(
      "resize",
      _.debounce(() => {
        this.calHtable();
      }, 500)
    );
  },
};
</script>

<style scoped lang="less">
@import url(../table-style.less);

.target-syz {
  padding: 10px;
  position: relative;

  &-section {
    margin-bottom: 10px;
  }

  .section-title {
    padding: 10px;
    line-height: 1;
    font-size: 14px;
    position: relative;

    &::before {
      width: 2px;
      height: 14px;
      display: block;
      content: "";
      background-color: #002fa7;
      position: absolute;
      left: 0;
    }
  }

  .line {
    width: 100%;
    white-space: nowrap;
    padding: 3px 0px 3px 10px;
    box-sizing: border-box;
    height: 20px;

    &-item {
      height: 14px !important;
      line-height: unset !important;
      border-radius: 7px;
      width: calc(100% / 6);
      position: relative;
      display: inline-flex;

      .line-item_label {
        font-size: 12px;
        color: #fff;
        position: absolute;
        line-height: 14px;
        right: 8px;
      }
    }
  }

  .global_line {
    .dark {
      color: #a0b5ef;
    }
  }

  .china_line {
    .dark {
      color: #85c407;
    }
  }

  .yfjz-desc {
    width: 100%;
    height: 33px;
    padding: 0 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    border-left: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    box-sizing: border-box;

    .linebar {
      width: 30px;
      height: 3px;
      border-radius: 2px;
      margin-right: 5px;
    }

    span {
      line-height: 1;
    }
  }

  .yfdw {
    display: flex;
    font-size: 12px;

    .label {
      width: 50px;
    }

    .c {
      flex: 1;
    }
  }

  /deep/.el-pagination {
    border: none !important;
  }
}
</style>

<style lang="less">
@CellHeight: 34px;

.target-syz {
  .section-ico-qa {
    width: 14px;
    height: 14px;
    display: block;
    background-image: url(/static/imgs/globaldrugs/qa.png);
    background-size: cover;

    &:hover {
      background-image: url(/static/imgs/globaldrugs/qa-c.png);
    }
  }

  .syzjz-table {

    .el-table__body-wrapper .cell {
      padding-left: 6px !important
    }

    .el-table_2_column_13 {
      .cell {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }
    }

    td .cell {
      display: flex;
      justify-content: center;
      align-items: center;

      &>.line {
        overflow: unset !important;
        text-overflow: unset !important;
      }
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 2px);
    margin: 0 auto;
    border-left: 1px solid #EBEEF5 !important;
    border-right: 1px solid #EBEEF5 !important;
    border-bottom: 1px solid #EBEEF5 !important;
    position: relative;
    min-height: 67px;
  }

  .tips-box {
    margin-right: 11px;
    position: absolute;
    right: 0;

    .tips {
      float: right;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #9AA4B8;
    }
  }

  .syzbj-table,
  .in-table {

    td .cell {
      padding: 0 !important;

      div {
        height: @CellHeight;
        line-height: @CellHeight;
        max-height: fit-content !important;
        // position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }

    .el-table__body-wrapper .cell {
      // min-height: @CellHeight;
      height: @CellHeight;
      line-height: @CellHeight;
    }

    thead th>.cell {
      display: flex;
      justify-content: center;
    }
  }

  .medicine-box {
    overflow-x: auto;

    .medicine-title {
      display: flex;
      align-items: center;
      background: #f6f8fc;
      justify-content: space-between;
      height: 56px;
      font-size: 13px;
      color: #35384a;
      font-weight: 600;
      border: 1px solid #dfe5f1;
      min-width: 1460px;

      .w160 {
        width: 160px;
        min-width: 160px;
        border-right: 1px solid #dfe5f1;
        text-align: center;
        height: 100%;
        line-height: 56px;
        padding: 0 14px;
        box-sizing: border-box;
        cursor: pointer;
      }

      .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 28px;
        width: 24px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        top: -1px;

        .sort-caret {
          width: 0;
          height: 0;
          border: 5px solid transparent;
          position: absolute;
          left: 5px;
        }

        .ascending {
          top: 2px;
          border-bottom-color: #c0c4cc;
        }

        .descending {
          bottom: 3px;
          border-top-color: #c0c4cc;
        }

        .active {
          border-bottom-color: #4877e8;
        }

        .descActive {
          border-top-color: #4877e8;
        }
      }

      .flex1 {
        flex: 1;
        text-align: center;
        min-width: 80px;
        height: 100%;
        line-height: 56px;
      }

      .w360 {
        width: 360px;
        min-width: 360px;
        max-width: 360px;
        height: 100%;
        text-align: center;
        border-left: 1px solid #dfe5f1;
        box-sizing: border-box;

        .w360-title {
          height: 30px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          border-bottom: 1px solid #dfe5f1;
          box-sizing: border-box;
        }

        .w360-title2 {
          display: flex;
          align-items: center;
          width: 100%;
          height: 26px;

          >div {
            flex: 1;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border-left: 1px solid #dfe5f1;
            box-sizing: border-box;
          }

          >div:first-child {
            border-left: 0;
          }
        }
      }
    }

    .medicine-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: #35384a;
      border: 1px solid #dfe5f1;
      border-top: 0;
      min-height: 40px;
      min-width: 1460px;

      .w160 {
        width: 160px;
        min-width: 160px;
        border-right: 1px solid #dfe5f1;
        text-align: center;
        padding: 8px 14px;
        box-sizing: border-box;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .flex1 {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 80px;
        height: 56px;
        position: relative;
      }

      .flex1::before {
        content: "";
        position: absolute;
        top: 18px;
        left: 0;
        width: 100%;
        height: 20px;
        background: #f2f2f2;
        z-index: 0;
      }

      .flex-l::before {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      .flex-r::before {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      .w120 {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        min-width: 120px;
        height: 56px;
        border-left: 1px solid #dfe5f1;
        box-sizing: border-box;
      }
    }

    .line {
      width: 100%;
      height: 20px;
      background: #f2f2f2;
      text-align: center;
      position: relative;
    }

    .border-left {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .border-right {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }

  .bg5 {
    background: #e3ebfa !important;
  }

  .bg6 {
    background: #c9d6f8 !important;
  }

  .bg7 {
    background: #acc1f5 !important;
  }

  .bg8 {
    background: #90adf1 !important;
    color: #ffffff !important;
  }

  .bg9 {
    background: #648ceb !important;
    color: #ffffff !important;
  }

  .bg10 {
    background: #4877e8 !important;
    color: #ffffff !important;
  }

  .bg11 {
    background: #90c432 !important;
    color: #ffffff !important;
  }


  .medicine-box::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    cursor: pointer;
  }

  .nodata {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .in-table {

    th.is-leaf {
      background: rgb(245, 246, 250) !important;
    }

    thead {

      th>.cell {
        height: 55px;
        padding: 0 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        line-height: 55px;
      }

      // tr:first-child th:first-child {
      //   // &:before {
      //   //   content: "适应症";
      //   //   text-align: center;
      //   //   position: absolute;
      //   //   top: 10px;
      //   //   right: 20px;
      //   // }

      //   // &:after {
      //   //   content: "药物";
      //   //   text-align: center;
      //   //   position: relative;
      //   //   bottom: -10px;
      //   //   left: -50px;
      //   // }

      //   .cell {
      //     position: absolute;
      //     top: 0;
      //     left: 0;
      //     width: 205px;
      //     height: 1px;
      //     background-color: #dfe5f1;
      //     display: block;
      //     text-align: center;
      //     -ms-transform: rotate(15deg);
      //     transform: rotate(15deg);
      //     -ms-transform-origin: top left;
      //     transform-origin: top left;
      //   }
      // }
    }

    tbody {
      tr td:last-child {
        padding-right: 0;
      }
    }

    td.el-table_6_column_34 {
      // border-bottom: 1px solid #ebeef5;
    }

    .el-table__body-wrapper .cell {
      min-height: unset !important;
    }

    .el-table_6_column_34 .cell .scope-bg {
      max-height: 45px;
      font-weight: 400;
      color: #333333;
      font-size: 13px;
    }
  }

  .el-table__body-wrapper {

    .cell:hover,
    .scope-bg:hover {
      background: #eff2fa !important;
      color: #000 !important;
    }
  }

  .overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  .section-content {
    min-height: 200px;
  }

  .syzbj-table,
  .syzjz-table,
  .in-table {

    .el-table__body-wrapper .cell {
      min-height: @CellHeight;
    }

    thead th>.cell {
      justify-content: center;
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent !important;
  }

  .cl-blue {
    color: #002fa7;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .el-table tbody tr td:last-child {
    padding-right: 0 !important;
  }

  .in-table {
    .el-table__body tbody .el-table__row td:first-child {
      border: none !important;
      border-bottom: 1px solid #ebeef5 !important;
    }

    td.is-center {
      .cell>div {
        max-height: unset !important;

        .overflow {
          max-height: @CellHeight  !important;
          padding: 8px 0 8px 0px;
        }
      }
    }

    td .cell div {
      line-height: unset !important;
    }

    td.is-hidden .cell>div {

      .scope-bg {
        padding: 8px 5px;
        max-height: 45px;
      }
    }
  }
}
</style>
