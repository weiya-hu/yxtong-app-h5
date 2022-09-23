<template>
  <div class="detail-qyfx">
    <!-- 左侧主要部分 [运营数据，药物研发，中标地区热力分布图] -->
    <div class="part-left">
      <!-- 左1 - 运营数据 -->
      <div class="column">
        <!-- HEAD -->
        <div class="head mb30">
          <span class="title">运营数据</span>
        </div>
        <!-- VIEW -->
        <div class="view yysj">
          <!-- echarts - 市值（年均市值） - 折线图 -->
          <div v-show="sz_xdata.length" id="echarts_sz" class="the-chart">
            <div class="echarts" ref="echarts_sz"></div>
          </div>
          <!-- 暂无数据 -->
          <div v-show="!sz_xdata.length" class="nodata-box">
            <div class="bg-nodata">
              <div class="bg-img"></div>
            </div>
            <div class="title">
              市值（年均市值）
            </div>
          </div>
          <!-- 表格 - 信息 -->
          <table class="tb-msg">
            <tr>
              <td>股票名称</td>
              <td>{{tableList.gpmc ? tableList.gpmc : '无'}}</td>
            </tr>
            <tr>
              <td>股票代码</td>
              <td>{{tableList.gpdm ? tableList.gpdm : '无'}}</td>
            </tr>
            <tr>
              <td>总股本</td>
              <td>{{tableList.zgb ? tableList.zgb : '无'}}</td>
            </tr>
            <tr>
              <td>上市模块</td>
              <td>{{tableList.ssbk ? tableList.ssbk : '无'}}</td>
            </tr>
            <tr>
              <td>上市日期</td>
              <td>{{tableList.ssrq ? tableList.ssrq : '无'}}</td>
            </tr>
            <tr>
              <td>成立日期</td>
              <td>{{tableList.clrq ? tableList.clrq : '无'}}</td>
            </tr>
          </table>
          <!-- echarts - 营收趋势 - 柱形图 -->
          <div v-show="ysqs_xdata.length" id="echarts_ysqs" class="the-chart">
            <div class="echarts" ref="echarts_ysqs"></div>
            <!-- <div class="name">营收趋势</div> -->
          </div>
          <!-- 暂无数据 -->
          <div v-show="!ysqs_xdata.length" class="nodata-box dt" :style="{height: ysyfNoData ? 'auto' : '398px'}">
            <div style="display: table-cell;vertical-align: middle">
              <div class="bg-nodata">
                <div class="bg-img"></div>
              </div>
              <div class="title">
                营收趋势
              </div>
            </div>
          </div>
          <!-- echarts - 研发投入 - 柱形&折线图 -->
          <div v-show="groupList.yftrb && groupList.yftrb.length" id="echarts_yftr" class="the-chart">
            <div class="echarts" ref="echarts_yftr"></div>
            <!-- <div class="name">研发投入</div> -->
          </div>
          <!-- 暂无数据 -->
          <div v-show="groupList.yftrb && !groupList.yftrb.length" class="nodata-box dt" :style="{height: ysyfNoData ? 'auto' : '398px'}">
            <div style="display: table-cell;vertical-align: middle">
              <div class="bg-nodata">
                <div class="bg-img"></div>
              </div>
              <div class="title">
                研发投入
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 左2 - 药物研发 -->
      <div class="column">
        <!-- HEAD -->
        <div class="head mb30">
          <span class="title">药物研发</span>
        </div>
        <!-- VIEW -->
        <div class="view ywyf">
          <!-- echarts - 申报趋势 - 折线图 -->
          <div v-show="sbqs_xdata.length" id="echarts_sbqs" class="the-chart">
            <div class="echarts" ref="echarts_sbqs"></div>
            <!-- <div class="name">申报趋势</div> -->
          </div>
          <!-- 暂无数据 -->
          <div v-show="!sbqs_xdata.length" class="nodata-box">
            <div class="bg-nodata">
              <div class="bg-img"></div>
            </div>
            <div class="title">
              申报趋势
            </div>
          </div>
          <!-- echarts - 国内临床试验 - 柱形图 -->
          <div v-show="gnlcsy_xdata.length" id="echarts_gnlcsy" class="the-chart">
            <div class="echarts" ref="echarts_gnlcsy"></div>
            <!-- <div class="name">国内临床试验</div> -->
          </div>
          <!-- 暂无数据 -->
          <div v-show="!gnlcsy_xdata.length" class="nodata-box">
            <div class="bg-nodata">
              <div class="bg-img"></div>
            </div>
            <div class="title">
              国内临床试验
            </div>
          </div>
        </div>
      </div>
      <!-- 左3 - 中标地区热力分布图 -->
      <div class="column">
        <!-- HEAD -->
        <div class="head mb30">
          <span class="title">中标地区热力分布图</span>
        </div>
        <!-- VIEW -->
        <div class="view zbdqrlfb">
          <!-- echarts - 中标地区热力分布图 -->
          <div v-show="zbdqrlfb_xdata.length" id="echarts_zbdqrlfb" class="the-chart">
            <div class="echarts" ref="echarts_zbdqrlfb"></div>
            <!-- <div class="range-msg">中标品种数量（个）</div> -->
          </div>
          <!-- 暂无数据 -->
          <div v-show="!zbdqrlfb_xdata.length" class="nodata-box">
            <div class="bg-nodata" style="background: transparent">
              <div class="bg-img"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧次要部分 [[企业排行榜，相关新闻]，广告部分] -->
    <div class="part-right">
      <!-- [企业排行榜，相关新闻] -->
      <div class="part-up">
        <!-- 右1 - 企业排行榜 -->
        <div class="column little-column">
          <!-- HEAD -->
          <div class="head">
            <span class="title">企业排行榜</span>
          </div>
          <!-- VIEW -->
          <div class="view phb">
            <div class="sec phb1">
              <!-- <div class="title">
                <span class="name">企业排行</span>
                <el-tooltip class="tip" effect="light" content="提示文字" placement="top">
                  <i class="iconfont cl-green">&#xe628;</i>
                </el-tooltip>
              </div> -->
              <div class="content">
                <div class="company-rank" v-if="rankList.length" @mouseout="handleCompanyRankMouseOut()">
                  <a
                  class="cp-wrap"
                  :class="{'cp-spe-wrap': (rankList.length == 2 && rankList[0].rank == 1 && index == 0) || (rankList.length == 2 && rankList[0].rank != 1 && index == 1) || (rankList.length == 3 && index == 1)}"
                  v-for="(comp, index) in rankList"
                  :key="index"
                  :title="comp.qymc"
                  @mouseover="handleRankMouseOver(index)"
                  @click="handleRankClick(comp)">
                    <div class="cp-circle">
                      <img :src="comp.logo" :alt="comp.qymc">
                    </div>
                    <div class="xuhao">{{comp.rank}}</div>
                    <div class="this-cp">{{handleMaxLength(comp.qymc)}}</div>
                  </a>
                  <div class="line" :class="{'short-line': rankList.length == 2}"></div>

                  <!-- <div class="cp-spe-wrap">
                    <div class="cp-circle">
                      <img :src="rankList[1].logo" :alt="rankList[1].qymc">
                    </div>
                    <div class="xuhao">{{rankList[1].rank}}</div>
                    <div class="this-cp">{{ankList[1].qymc}}</div>
                  </div>
                  <div class="line"></div>
                  <div class="cp-wrap">
                    <div class="cp-circle">
                      <img :src="rankList[2].logo" :alt="rankList[2].qymc">
                    </div>
                    <div class="xuhao">{{rankList[2].rank}}</div>
                    <div class="this-cp">{{ankList[2].qymc}}</div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右2 - 相关新闻 -->
        <!-- <div class="column little-column">
          <div class="head">
            <span class="title">相关新闻</span>
            <a class="more" href="">查看更多  ></a>
          </div>
          <div class="view xgxw">
            <ul class="news-list">
              <li class="news-item">
                <i class="iconfont">&#xe757;</i>
                <a href="" class="news-title" title="新闻内容1">新闻内容1</a>
                <div class="news-msg">
                  <span class="from">药智网</span>
                  <span class="time">2018-07-02</span>
                </div>
              </li>
              <li class="news-item">
                <i class="iconfont">&#xe757;</i>
                <a href="" class="news-title" title="新闻内容2">新闻内容2</a>
                <div class="news-msg">
                  <span class="from">药智数据</span>
                  <span class="time">2018-07-05</span>
                </div>
              </li>
              <li class="news-item">
                <i class="iconfont">&#xe757;</i>
                <a href="" class="news-title" title="新闻内容3">新闻内容3</a>
                <div class="news-msg">
                  <span class="from">药智汇</span>
                  <span class="time">2018-07-07</span>
                </div>
              </li>
              <li class="news-item">
                <i class="iconfont">&#xe757;</i>
                <a href="" class="news-title" title="新闻内容4">新闻内容4</a>
                <div class="news-msg">
                  <span class="from">药智专利通</span>
                  <span class="time">2018-07-11</span>
                </div>
              </li>
              <li class="news-item">
                <i class="iconfont">&#xe757;</i>
                <a href="" class="news-title" title="新闻内容5">新闻内容5</a>
                <div class="news-msg">
                  <span class="from">药智新闻</span>
                  <span class="time">2018-07-18</span>
                </div>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
      <!-- 广告部分 -->
      <!-- <div class="part-down">
        <a href="www.yaozh.com"><img src="/static/imgs/companyreport/ad_1.jpg" alt=""></a>
        <a href="db.yaozh.com"><img src="/static/imgs/companyreport/ad_2.jpg" alt=""></a>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      id: this.$route.path.split("/")[2],
      // api数据接收
      tableList: {}, // 获取表格中的数据（只取有用的）
      groupList: {}, // 获取的echarts的api数据
      rankList: [],

      // 市值 - 折线图
      echarts_sz: {},
      sz_xdata: [],
      sz_ydata: [],
      // 营收趋势 - 柱形图
      echarts_ysqs: {},
      ysqs_xdata: [],
      ysqs_ydata1: [], // 营业收入
      ysqs_ydata2: [], // 营业成本
      ysqs_ydata3: [], // 净利润
      // 研发投入 - 柱形&折线图
      echarts_yftr: {},
      yftr_xdata: [],
      yftr_ydata1: [], // 研发投入合计
      yftr_ydata2: [], // 研发人员数量
      // 申报趋势 - 折线图
      echarts_sbqs: {},
      sbqs_xdata: [],
      sbqs_ydata1: [], // 申报
      sbqs_ydata2: [], // 批准
      // 国内临床试验 - 柱形图
      echarts_gnlcsy: {},
      gnlcsy_xdata: [], // 期数（如1、2、3期或其他）
      gnlcsy_ydata1: [], // 主动暂停
      gnlcsy_ydata2: [], // 尚未开始
      gnlcsy_ydata3: [], // 已完成
      gnlcsy_ydata4: [], // 暂停或中断
      gnlcsy_ydata5: [], // 进行中
      gnlcsy_ydata6: [], // 结束
      gnlcsy_ydata7: [], // 进行中（尚未招募） => 注意：括号为中文括号（下同）
      gnlcsy_ydata8: [], // 进行中（招募中）
      gnlcsy_ydata9: [], // 进行中（招募完成）
      // 中标地区热力分布图
      echarts_zbdqrlfb: {},
      zbdqrlfb_xdata: [], // 省份
      zbdqrlfb_ydata: [], // 年份
      zbdqrlfb_maindata: [], // 某省某年对应的数量
      zbdqrlfb_maxnum: 100, // 最大上限值
    }
  },
  computed: {
    // 营收趋势 研发投入 都没有数据的时候，需要改变和上面的距离
    ysyfNoData () {
      return !(this.ysqs_xdata && this.ysqs_xdata.length) && !(this.groupList.yftrb && this.groupList.yftrb.length)
    },
    ...mapState({
      client_width: state => state.Layouts.client_width,
    })
  },
  methods: {
    handleMaxLength (str) {
      let arr = String(str).split("")
      let len = arr.length
      if (arr.length > 15) {
        arr.splice(14, len - 14, '...')
      }
      let ret = arr.join("")
      return ret
    },
    // 鼠标事件
    handleCompanyRankMouseOut () {
      let index = 1
      if (this.rankList.length == 2 && this.rankList[0].rank == 1) {
        index = 0
      }
      $('.cp-wrap').removeClass('cp-spe-wrap')
      $('.cp-wrap').eq(index).addClass('cp-spe-wrap')
    },
    handleRankMouseOver (index) {
      $('.cp-wrap').removeClass('cp-spe-wrap')
      $('.cp-wrap').eq(index).addClass('cp-spe-wrap')
    },
    handleRankClick (comp) {
      if (comp.qyzs == '1') {
        this.$router.push({
          path: '/company/' + comp.id
        })
      }
    },
    async handleAxios () {
      await window.Axios({
        method: 'get',
        url: '/api/company/qyfx',
        params: {
          id: this.id
        }
      })
      .then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.groupList = data.GroupList
        }
      }).catch((err) => {
        console.log(err)
      })

      window.Axios({
        method: "get",
        url: '/api/company/' + this.id,
        params: {
          accesstoken: GETCOOKIEFUN("accesstoken")
        }
      }).then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.tableList = data
        }
      }).catch((err) => {
        console.log(err)
      })

      Axios.get('/api/company/qyph?id=' + this.id)
      .then((res) => {
        if (res.data.code === 200 && res.data) {
          let data = res.data.data
          this.rankList = data.res
        }
      }).catch((err) => {
        console.log(err)
      })

      // 在 IE 下，图表绘制时，container的宽度有问题，猜测是需要等待vue将响应式应用完成之后，才有正确的宽度去绘制。
      setTimeout(() => {
        this.handleEchartsDraw()
      }, 0)
    },
    // echarts的数据处理 - 汇总
    handleAllData () {
      this.handleSzData()
      this.handleYsqsData()
      this.handleYftrData()
      this.handleSbqsData()
      this.handleGnlcsyData()
      this.handleZbdqrlfbData()
    },
    handleSzData () { // 市值
      for (let value of this.groupList.sz) {
        this.sz_xdata.push(value.year)
        this.sz_ydata.push(value.lgsz)
      }
    },
    handleYsqsData () { // 营收趋势
      for (let value of this.groupList.srb) {
        this.ysqs_xdata.push(value.year)
        this.ysqs_ydata1.push(value.yyshouru)
        this.ysqs_ydata2.push(value.yychengben)
        this.ysqs_ydata3.push(value.yylirun)
      }
    },
    handleYftrData () { // 研发投入
      let yftr_xdata1 = []
      let yftr_xdata2 = []
      for (let value of this.groupList.cpyfmx) {
        yftr_xdata1.push(value.year)
        this.yftr_ydata1.push(value.yanfatouru)
      }
      for (let value of this.groupList.yftrb) {
        yftr_xdata2.push(value.year)
        this.yftr_ydata2.push(value.yanfaren)
      }
      // 处理两个数据的年份数量、具体不一致的情况
      if (yftr_xdata1.length >= yftr_xdata2.length) {
        for (let index in yftr_xdata1) {
          if (_.indexOf(yftr_xdata2, yftr_xdata1[index]) === -1) {
            this.yftr_ydata2.splice(index, 0, "0")
          }
        }
        this.yftr_xdata = yftr_xdata1
      } else if (yftr_xdata1.length < yftr_xdata2.length) {
        for (let index in yftr_xdata2) {
          if (_.indexOf(yftr_xdata1, yftr_xdata2[index]) === -1) {
            this.yftr_ydata1.splice(index, 0, "0")
          }
        }
        this.yftr_xdata = yftr_xdata2
      }
    },
    handleSbqsData () { // 申报趋势
      let sbqs_xdata1 = []
      let sbqs_xdata2 = []
      // 申报
      for (let value of this.groupList.sbqs.shenbao) {
        sbqs_xdata1.push(value.key_as_string.split("-")[0])
        this.sbqs_ydata1.push(value.doc_count)
      }
      // 批准
      for (let value of this.groupList.sbqs.pizhun) {
        sbqs_xdata2.push(value.key_as_string.split("-")[0])
        this.sbqs_ydata2.push(value.doc_count)
      }
      // 处理两个数据的年份数量、具体不一致的情况
      if (sbqs_xdata1.length >= sbqs_xdata2.length) {
        for (let index in sbqs_xdata1) {
          if (_.indexOf(sbqs_xdata2, sbqs_xdata1[index]) === -1) {
            this.sbqs_ydata2.splice(index, 0, "0")
          }
        }
        this.sbqs_xdata = sbqs_xdata1
      } else if (sbqs_xdata1.length < sbqs_xdata2.length) {
        for (let index in sbqs_xdata2) {
          if (_.indexOf(sbqs_xdata1, sbqs_xdata2[index]) === -1) {
            this.sbqs_ydata1.splice(index, 0, "0")
          }
        }
        this.sbqs_xdata = sbqs_xdata2
      }
    },
    handleGnlcsyData () { // 国内临床试验
      let phases = ['主动暂停', '尚未开始','已完成','暂停或中断', '进行中', '结束', '进行中（尚未招募）', '进行中（招募中）', '进行中（招募完成）']
      let statusArr = []
      for (let value of this.groupList.linchuangshiyan.data) {
        this.gnlcsy_xdata.push(value.phase)

        let arr = value.status.split(',') // xxx=xx
        let finArr = [] // {xxx: xx}
        for (let item of arr) {
          let key = item.split('=')[0]
          let val = item.split('=')[1]
          let obj = {}

          switch (key)
          {
            case '主动暂停': obj = {'主动暂停': val}; break;
            case '尚未开始': obj = {'尚未开始': val}; break;
            case '已完成': obj = {'已完成': val}; break;
            case '暂停或中断': obj = {'暂停或中断': val}; break;
            case '进行中': obj = {'进行中': val}; break;
            case '结束': obj = {'结束': val}; break;
            case '进行中（尚未招募）': obj = {'进行中（尚未招募）': val}; break;
            case '进行中（招募中）': obj = {'进行中（招募中）': val}; break;
            case '进行中（招募完成）': obj = {'进行中（招募完成）': val}; break;
          }

          finArr.push(obj)
        }

        let keyArr = []
        let valArr = []
        for (let val of finArr) {
          keyArr.push((_.keys(val))[0])
          valArr.push((_.values(val))[0])
        }

        if (_.indexOf(keyArr, '主动暂停') !== -1) {
          this.gnlcsy_ydata1.push(valArr[_.indexOf(keyArr, '主动暂停')])
        } else {
          this.gnlcsy_ydata1.push("0")
        }
        if (_.indexOf(keyArr, '尚未开始') !== -1) {
          this.gnlcsy_ydata2.push(valArr[_.indexOf(keyArr, '尚未开始')])
        } else {
          this.gnlcsy_ydata2.push("0")
        }
        if (_.indexOf(keyArr, '已完成') !== -1) {
          this.gnlcsy_ydata3.push(valArr[_.indexOf(keyArr, '已完成')])
        } else {
          this.gnlcsy_ydata3.push("0")
        }
        if (_.indexOf(keyArr, '暂停或中断') !== -1) {
          this.gnlcsy_ydata4.push(valArr[_.indexOf(keyArr, '暂停或中断')])
        } else {
          this.gnlcsy_ydata4.push("0")
        }
        if (_.indexOf(keyArr, '进行中') !== -1) {
          this.gnlcsy_ydata5.push(valArr[_.indexOf(keyArr, '进行中')])
        } else {
          this.gnlcsy_ydata5.push("0")
        }
        if (_.indexOf(keyArr, '结束') !== -1) {
          this.gnlcsy_ydata6.push(valArr[_.indexOf(keyArr, '结束')])
        } else {
          this.gnlcsy_ydata6.push("0")
        }
        if (_.indexOf(keyArr, '进行中（尚未招募）') !== -1) {
          this.gnlcsy_ydata7.push(valArr[_.indexOf(keyArr, '进行中（尚未招募）')])
        } else {
          this.gnlcsy_ydata7.push("0")
        }
        if (_.indexOf(keyArr, '进行中（招募中）') !== -1) {
          this.gnlcsy_ydata8.push(valArr[_.indexOf(keyArr, '进行中（招募中）')])
        } else {
          this.gnlcsy_ydata8.push("0")
        }
        if (_.indexOf(keyArr, '进行中（招募完成）') !== -1) {
          this.gnlcsy_ydata9.push(valArr[_.indexOf(keyArr, '进行中（招募完成）')])
        } else {
          this.gnlcsy_ydata9.push("0")
        }
      }
    },
    handleZbdqrlfbData () { // 中标地区热力分布
      let data = [] // 储存最终处理好的data
      let allYears = []
      // 确定最小年份 和 最大年份
      let min = 99999
      let max = -1
      let yaopinzhongbiao = this.groupList.sbqs.yaopinzhongbiao ? this.groupList.sbqs.yaopinzhongbiao : []
      for (let value of yaopinzhongbiao) {
        this.zbdqrlfb_xdata.push(value.area)

        let everyYear = [] // 每一个省的有数据的年份
        for (let item of value.years) {
          if(item.key != '') {
            everyYear.push(Number(item.key))
          }
        }
        everyYear.sort() // 从小到大排序

        // 确定所有省份中最小的年份
        if (min > everyYear[0]) {
          min = everyYear[0]
        }
        // 确定所有省份中最大的年份
        if (max < everyYear[everyYear.length - 1]) {
          max = everyYear[everyYear.length - 1]
        }
      }
      // 确定最终的年份区间
      let ylabel = min
      for (let i = 0; i <= max - min; i++, ylabel++) {
        this.zbdqrlfb_ydata.push(ylabel)
      }

      // 原数据按年份排序 - 最终存入allYears这个数组中
      for (let value of yaopinzhongbiao) {
        let years = []
        for (let item of this.zbdqrlfb_ydata) {
          let obj = {}
          obj[item] = 0
          years.push(obj)
        }

        for (let item of value.years) {
          if (_.indexOf(this.zbdqrlfb_ydata, Number(item.key)) !== -1 && item.key != '') {
            let theYear = Number(item.key)
            let newObj = {}
            newObj[Number(item.key)] = item.doc_count
            years.splice(_.indexOf(this.zbdqrlfb_ydata, Number(item.key)), 1, newObj)
          }
        }
        allYears.push(years) // 每个省份按年份排序后（并针对无数据置零处理后）放入最终的数据数组
      }

      // 处理为正确的三位组数格式 => data => this.zbdqrlfb_maindata
      for (let i = 0; i < this.zbdqrlfb_xdata.length; i++) {
        for (let j = 0; j < this.zbdqrlfb_ydata.length; j++) {
          data.push([i, j, _.values(allYears[i][j])[0]])
          if (this.zbdqrlfb_maxnum < _.values(allYears[i][j])[0]) {
            this.zbdqrlfb_maxnum = _.values(allYears[i][j])[0]
          }
        }
      }

      this.zbdqrlfb_maindata = data
    },
    // echarts的绘制 - 汇总
    async handleEchartsDraw () {
      await this.handleAllData()
      this.drawLineSz()
      this.drawBarYsqs()
      this.drawBarYftr()
      this.drawLineSbqs()
      this.drawBarGnlcsy()
      this.drawHeatmapZbdqrlfb()
    },
    // 市值 - 折线图
    drawLineSz () {
      let dom = this.$refs.echarts_sz
      this.echarts_sz = Echarts.init(dom, 'yaozh_theme')
      this.echarts_sz.setOption({
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisTick: {
            // show: false,
          },
          axisLabel: {
            interval: 0,
            color: '#000',
          },
          data: this.sz_xdata,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#000',
          },
        },
        tooltip:{
          show: true,
          trigger: 'axis',
        },
        grid:{
          show: false,
          containLabel: true,
          top: 10,
          bottom: 70,
        },
        legend: {
          data: ['市值（单位：亿元）'],
          bottom: 20,
          selectedMode: false,
        },
        series: [{
          name: '市值（单位：亿元）',
          data: this.sz_ydata,
          type: 'line'
        }],
        title: {
          text: "市值（年均市值）",
          x: "center",
          bottom: 0,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14",
      })
    },
    // 营收趋势 - 柱形图
    drawBarYsqs () {
      let dom = this.$refs.echarts_ysqs
      this.echarts_ysqs = Echarts.init(dom, 'yaozh_theme')
      this.echarts_ysqs.setOption({
        xAxis: [
          {
            type: 'category',
            axisTick: {
              show: true,
              interval: 0
            },
            data: this.ysqs_xdata,
          }
        ],
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#000',
            formatter: function (value, index) {
              let texts = value / 10000

              return texts + '亿';
            }
          },
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
        },
        grid:{
          show: false,
          containLabel: true,
          top: 10,
          bottom: 70,
        },
        legend: {
          data: [{
            name: '营业收入(万元)',
            icon: 'circle'
          },
          {
            name: '营业成本(万元)',
            icon: 'circle'
          },
          {
            name: '净利润(万元)',
            icon: 'circle'
          }],
          bottom: 20,
        },
        series: [{
          name: '营业收入(万元)',
          type: 'bar',
          barGap: 0,
          data: this.ysqs_ydata1,
          barWidth: 18,
        },
        {
          name: '营业成本(万元)',
          type: 'bar',
          data: this.ysqs_ydata2,
          barWidth: 18,
        },
        {
          name: '净利润(万元)',
          type: 'bar',
          data: this.ysqs_ydata3,
          barWidth: 18,
          barGap: '10%'
        }],
        title: {
          text: "营收趋势",
          x: "center",
          bottom: 0,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14",
      })
    },
    // 研发投入 - 柱形&折线图
    drawBarYftr () {
      let dom = this.$refs.echarts_yftr
      this.echarts_yftr = Echarts.init(dom, 'yaozh_theme')
      this.echarts_yftr.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          }
        },
        grid:{
          show: false,
          containLabel: true,
          top: 10,
          bottom: 70,
        },
        legend: {
          data:[
            {
              name: '研发投入合计（万元）',
              icon: 'circle'
            },
            {
              name: '研发人员数量（人）'
            }
          ],
          bottom: 20,
        },
        xAxis: [
          {
            type: 'category',
            data: this.yftr_xdata,
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '研发投入合计（万元）',
            axisLabel: {
              formatter: '{value}万'
            },
          },
          {
            type: 'value',
            name: '研发人员数量（人）',
          }
        ],
        series: [
          {
            name:'研发投入合计（万元）',
            type:'bar',
            barWidth: 38,
            data:this.yftr_ydata1,
          },
          {
            name:'研发人员数量（人）',
            type:'line',
            yAxisIndex: 1,
            data:this.yftr_ydata2,
          }
        ],
        title: {
          text: "研发投入",
          x: "center",
          bottom: 0,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14",
      })
    },
    // 申报趋势 - 折线图
    drawLineSbqs () {
      let dom = this.$refs.echarts_sbqs
      this.echarts_sbqs = Echarts.init(dom, 'yaozh_theme')
      this.echarts_sbqs.setOption({
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisTick: {
            // show: false,
          },
          axisLabel: {
            interval: 0,
            color: '#000',
            rotate: 45,
          },
          data: this.sbqs_xdata,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#000',
          },
        },
        tooltip: [{
          show: true,
          trigger: 'axis',
        }],
        grid:{
          show: false,
          containLabel: true,
          top: 10,
          bottom: 70,
        },
        legend: {
          data: ['申报', '批准'],
          bottom: 20,
        },
        series: [{
          name: '申报',
          data: this.sbqs_ydata1,
          type: 'line'
        },
        {
          name: '批准',
          data: this.sbqs_ydata2,
          type: 'line'
        }],
        title: {
          text: "申报趋势",
          x: "center",
          bottom: 0,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14",
      })
    },
    // 国内临床试验 - 柱形图
    drawBarGnlcsy () {
      let dom = this.$refs.echarts_gnlcsy
      this.echarts_gnlcsy = Echarts.init(dom, 'yaozh_theme')
      this.echarts_gnlcsy.setOption({
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid:{
          show: false,
          containLabel: true,
          // top: 10,
          // bottom: 50,
          // left: 150,
        },
        legend: {
          data: ['主动暂停', '尚未开始','已完成','暂停或中断', '进行中', '结束', '进行中（尚未招募）', '进行中（招募中）', '进行中（招募完成）'],
          bottom: 30,
          padding: [40, 50, 0, 50],
          type: 'scroll',
        },
        xAxis:  {
          type: 'value',
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          }
        },
        yAxis: {
          type: 'category',
          data: this.gnlcsy_xdata,
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
          zlevel: 10,
        },
        series: [
          {
            name: '主动暂停',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata1,
          },
          {
            name: '尚未开始',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata2,
          },
          {
            name: '已完成',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata3,
          },
          {
            name: '暂停或中断',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata4,
          },
          {
            name: '进行中',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata5,
          },
          {
            name: '结束',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata6,
          },
          {
            name: '进行中（尚未招募）',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata7,
          },
          {
            name: '进行中（招募中）',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata8,
          },
          {
            name: '进行中（招募完成）',
            type: 'bar',
            stack: '总量',
            label: {
              show: false,
              // color: '#000',
              // formatter: function(params) {
              //   if (params.value > 0) {
              //     return params.value;
              //   } else {
              //     return '';
              //   }
              // },
            },
            data: this.gnlcsy_ydata9,
          }
        ],
        title: {
          text: "国内临床试验",
          x: "center",
          bottom: 0,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14",
      })
    },
    // 中标地区热力分布图
    drawHeatmapZbdqrlfb () {
      let hours = this.zbdqrlfb_xdata // 横坐标 - 省份
      let days = this.zbdqrlfb_ydata // 纵坐标 - 年份

      let data = this.zbdqrlfb_maindata // 具体对应的数据（该省份当年的数量）

      data = data.map(function (item) {
          return [item[0], item[1], item[2]];
      });

      let dom = this.$refs.echarts_zbdqrlfb
      this.echarts_zbdqrlfb = Echarts.init(dom, 'yaozh_theme')
      this.echarts_zbdqrlfb.setOption({
        tooltip: {
          position: 'top'
        },
        grid: {
          containLabel: true,
          // right: 80,
          // height: '75%',
        },
        xAxis: {
          type: 'category',
          data: hours,
          splitArea: {
            show: true
          },
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#aaa',
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#c6daf0',
            }
          },
        },
        yAxis: {
          type: 'category',
          data: days,
          splitArea: {
            show: true
          },
          axisLabel: {
            interval: 0,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#aaa',
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#c6daf0',
            }
          },
        },
        visualMap: [
          {
            calculable: true,
            min: 0,
            max: this.zbdqrlfb_maxnum, //根据具体最大值来确定
            right: 5,
            bottom: 31,
            align: 'left',
            calculable: true,
            realtime: false,
            itemHeight: 333,
            itemWidth: 10,
          }
        ],
        series: [{
          type: 'heatmap',
          data: data,
          tooltip: {
            formatter: function (params) {
              let year = Math.min.apply(null,days);
              for (let i = 0; i < params.value[1]; i++) {
                year++
              }
              return '<b>'+params.name+'</b>地区在'+'<b>'+year+'</b>年<br/>中标品种数量是'+'<b>'+params.value[2]+'</b>（个）'
            }
          },
          label: {
            show: true,
            color: '#000',
            fontWeight: 'bold',
            formatter: function(params) {
              if (Number(params.value[2]) > 0) {
                return params.value[2];
              } else {
                return '0';
              }
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
          },
        }],
        title: {
          text: "中标品种数量（个）",
          right: 0,
          top: 20,
          textStyle: {
            fontSize: "12",
            color: "#646A7A"
          },
          fontSize: "8"
        },
        fontSize: "14",
      })
    }
  },
  created() {
    // 获取api数据
    this.handleAxios()
  },
  mounted () {
    // this.handleAllData()
    // 绘制所有echarts图形
    // this.handleEchartsDraw()
  },
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";

// 本页的样式
.detail-qyfx {
  color: @FontColor;
  // height: 2000px;
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding-right: 360px;
  border-radius: 4px;
  .dt {
    display: table;
  }
  .nodata-box {
    width: 50%;
    text-align: center;
    background: transparent;
    .bg-nodata {
      width: 374px;
      height: 212px;
      line-height: 212px;
      background: #fafcff;
      display: inline-block;
      vertical-align: middle;
      .bg-img {
        width: 100%;
        height: 100%;
        background: url('/static/imgs/nodata.png') center center no-repeat;
      }
    }
    .title {
      line-height: 40px;
    }
  }

  // 左
  .part-left {
    width: 100%;
    background: #fff;
    box-shadow: @BoxShadow;
    border-radius: 4px;
    // height: 1000px;
    // 左1 - 运营数据
    .yysj {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      // echarts的样式单独用id规划
      // 表格样式
      .tb-msg {
        //margin: 0 auto;
        margin: 0px 0px 0px 50px;
        margin-bottom: 20px;
        tr {
          td {
            border: 1px solid @BorderColorNew;
            padding: 10px 10px 10px 40px;
            box-sizing: border-box;
            font-size:13px;
            &:first-of-type {
              background: #f6f8fc;
              width: 132px;
              font-weight:bold;
            }
            &:last-of-type {
              background: #fff;
              width: 136px;
            }
          }
        }
      }
    }
    // 左2 - 药物研发
    .ywyf {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      // echarts的样式单独用id规划
    }
    // 左3 - 中标地区热力分布图
    .zbdqrlfb {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
    }
  }
  // 右
  .part-right {
    border-radius: 4px;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0;
    box-sizing: border-box;
    width: 350px;
    background: #fff;
    box-shadow: @BoxShadow;

    // 上
    .part-up {
      // background: #fff;
      // box-shadow: @BoxShadow;
      // min-height: 150px;
      // margin-bottom: 13px;
      // 右1 - 企业排行榜
      .phb {
        .sec {
          padding-top: 20px;
          &:not(:last-of-type) {
            border-bottom: 1px dashed @BorderColor;
          }
          .title {
            height: 30px;
            line-height: 30px;
            .name {
              font-size: 13px;
              display: inline-block;
              margin-right: 6px;
            }
          }
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            margin-top: 13px;
            padding-bottom: 20px;
            .company-rank {
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              .cp-wrap {
                transition: all 200ms;
                cursor: pointer;
                z-index: 10;
                position: relative;
                width: 50px;
                height: 90px;
                padding: 0px 18px 50px 18px;
                text-decoration: none;
                .cp-circle {
                  transition: all 200ms;
                  width: 48px;
                  height: 48px;
                  border: 1px solid @BorderColor;
                  box-shadow: 0px 0px 10px @BorderColor;
                  border-radius: 50%;
                  overflow: hidden;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 9px 0px;
                  img {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                  }
                }
                .xuhao {
                  transition: all 200ms;
                  text-align: center;
                  height: 28px;
                  line-height: 28px;
                  font-size: 13px;
                  font-weight: bold;
                }
                .this-cp {
                  transition: all 0ms;
                  visibility: hidden;
                  width: 100px;
                  max-height: 36px;
                  text-align: center;
                  position: absolute;
                  top: 90px;
                  left: 50%;
                  margin-left: -50px;
                  color: @PrimaryColor;
                  font-size: 12px;
                  line-height: 18px;
                  margin-top: 5px;
                  font-weight: bold;
                }
              }

              .cp-spe-wrap {
                transition: all 200ms;
                z-index: 10;
                position: relative;
                .cp-circle {
                  transition: all 200ms;
                  transform: scale(1.2);
                  border-radius: 50%;
                  border: 2px solid @PrimaryColor!important;
                  box-shadow: 0px 0px 10px Lighten(@PrimaryColor, 10%)!important;
                  overflow: hidden;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  img {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                  }
                }
                .xuhao {
                  transition: all 200ms;
                  text-align: center;
                  height: 28px;
                  line-height: 28px;
                  font-size: 14px;
                  color: @PrimaryColor;
                  font-weight: bold;
                }
                .this-cp {
                  transition: all 200ms;
                  visibility: visible;
                  width: 100px;
                  max-height: 36px;
                  text-align: center;
                  position: absolute;
                  top: 90px;
                  left: 50%;
                  margin-left: -50px;
                  color: @PrimaryColor;
                  font-size: 12px;
                  line-height: 18px;
                  margin-top: 5px;
                  font-weight: bold;
                }
              }
            }
            .line {
              z-index: 9;
              position: absolute;
              height: 1px;
              width: 210px;
              background: #dfe5f1;
              bottom: 105px;
              left: 50%;
              margin-left: -105px;
              &.short-line {
                width: 120px!important;
                margin-left: -60px!important;
              }
            }
            // .this-cp {
            //   text-align: center;
            //   width: 100px;
            //   color: @PrimaryColor;
            //   font-size: 12px;
            //   line-height: 18px;
            //   margin-top: 5px;
            //   font-weight: bold;
            // }
          }
        }
      }
      // 右2 - 相关新闻
      .xgxw {
        margin-left: 18px;
        padding-top: 20px;
        .news-list {
          .news-item {
            position: relative;
            margin-bottom: 16px;
            &:hover {
              .iconfont, .news-title {
                color: @PrimaryColor;
              }
            }
            .iconfont {
              display: inline-block;
              width: 18px;
              height: 18px;
              line-height: 18px;
              font-size: 20px;
              text-align: center;
              position: absolute;
              left: -22px;
            }
            .news-title {
              // display: inline-block;
              font-size: 13px;
              min-height: 18px;
              max-height: 36px;
              font-weight: bold;
              line-height: 18px;
              // text-overflow: ellipsis; //TODO: 暂时不起作用
              // 暂用方案：限制最大两行（可能有兼容性问题）
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .news-msg {
              color: #a9adb7;
              font-size: 12px;
              margin-top: 6px;
              .from {
                display: inline-block;
                margin-right: 15px;
              }
              .time {

              }
            }
          }
        }
      }
    }
    // 下
    .part-down {
      a {
        display: block;
        width: 100%;
        height: 140px;
        box-shadow: @BoxShadow;
        margin-bottom: 11px;
        img {
          display: block;
          width: 100%;
          height: 140px;
        }
      }
    }
  }
}
// 通用的column样式
.column {
  &.little-column {
    padding-bottom: 16px!important;
    .head {
      margin-bottom: 0px!important;
      .title {
        margin-left: 18px!important;
      }

    }
  }
  width: 100%;
  padding: 10px 0px 20px 0px;
  .head {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #dfe5f1;
    margin-bottom: 16px;
    &.mb30 {
      margin-bottom: 30px;
    }
    .title {
      display: inline-block;
      margin-left: 32px;
      height: 29px;
      line-height: 29px;
      color: @PrimaryColor;
      font-size: 14px;
      padding: 0px 10px 0px 4px;
      border-bottom: 3px solid @PrimaryColor;
    }
    .more {
      display: inline-block;
      margin-right: 25px;
      color: @PrimaryColor;
      font-size: 13px;
    }
  }
  .view {
    padding-left: 18px;
    padding-right: 28px;
  }
}


// 每张echarts的name的位置，处于图表的下方居中
// .echarts+.name {
//   height: 40px;
//   line-height: 40px;
//   font-size: 14px;
//   font-weight: bold;
//   text-align: center;
// }
.the-chart {
  margin: 20px 0px;

}
// 市值 - 折线图
#echarts_sz {
  width: 50%;
  .echarts {
    width: 100%;
    height: 300px;
  }
}
// 营收趋势 - 柱形图
#echarts_ysqs {
  width: 50%;
  .echarts {
    width: 100%;
    height: 340px;
  }
}
// 研发投入 - 柱形&折线图
#echarts_yftr {
  width: 50%;
  .echarts {
    width: 100%;
    height: 340px;
  }
}
// 申报趋势 - 折线图
#echarts_sbqs {
  width: 50%;
  .echarts {
    width: 100%;
    height: 310px;
  }
}
// 国内临床试验 - 柱形图
#echarts_gnlcsy {
  width: 50%;
  .echarts {
    width: 100%;
    height: 310px;
  }
}
// 中标地区热力分布图
#echarts_zbdqrlfb {
  width: 920px;
  position: relative;
  .echarts {
    width: 100%;
    height: 440px;
  }
  .range-msg {
    position: absolute;
    right: -55px;
    top: 200px;
    transform: rotate(-90deg);
    font-size: 12px;
    font-weight: bold;
  }
}
@media screen and (min-width: 1600px) and (max-width: 1860px){
  .detail-qyfx{
    .nodata-box{
      margin: 50px auto;
    }
  }
  // 营收趋势 - 柱形图
  #echarts_ysqs {
    width: 80%;
    margin: 80px auto 20px;
  }
  // 研发投入 - 柱形&折线图
  #echarts_yftr {
    width: 80%;
    margin: 80px auto 20px;
  }
  // 申报趋势 - 折线图
  #echarts_sbqs {
    width: 80%;
    margin: 20px auto;
  }
  // 国内临床试验 - 柱形图
  #echarts_gnlcsy {
    width: 80%;
    margin: 50px auto;
  }
}
@media screen and (min-width:1500px) and (max-width: 1599px){
  .detail-qyfx{
    padding-right: 0px;
  }
  .part-right{
    display: none;
  }
  // 营收趋势 - 柱形图
  #echarts_ysqs {
    width: 50%;
  }
  // 研发投入 - 柱形&折线图
  #echarts_yftr {
    width: 50%;
  }
  // 申报趋势 - 折线图
  #echarts_sbqs {
    width: 50%;
  }
  // 国内临床试验 - 柱形图
  #echarts_gnlcsy {
    width: 50%;
  }
}
@media screen and (max-width: 1499px){
  .detail-qyfx{
    padding-right: 0px;
  }
  .part-right{
    display: none;
  }
  .detail-qyfx{
    .nodata-box{
      margin: 50px auto;
    }
  }
  // 营收趋势 - 柱形图
  #echarts_ysqs {
    width: 80%;
    margin: 80px auto 20px;
  }
  // 研发投入 - 柱形&折线图
  #echarts_yftr {
    width: 80%;
    margin: 80px auto 20px;
  }
  // 申报趋势 - 折线图
  #echarts_sbqs {
    width: 80%;
    margin: 20px auto;
  }
  // 国内临床试验 - 柱形图
  #echarts_gnlcsy {
    width: 80%;
    margin: 50px auto;
  }
}
</style>
