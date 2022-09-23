<!-- 此组件使用的是 components/common/gh-analy 组件，gh-analy 是个失败品，不可复用 -->
<!-- 逻辑异常糟糕 -->
<template>
  <Main class="ypzb" >
    <!-- 保存条件 - 输入名称 弹出框 -->
    <el-dialog class="dialog-saved" :visible.sync="savedPopVisible" :modal-append-to-body="false">
      <div slot="title" class="dialog-header">
        保存条件
      </div>
      <SavedPop @closeSavedPop="closeSavedPop" vuex_name="Yaopinzhongbiao"></SavedPop>
    </el-dialog>

    <!-- 高级搜索弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" width="815px">
      <div slot="title" class="dialog-header">
        高级搜索
      </div>
      <Advanced
        :dialogFormVisible="dialogFormVisible"
        vuex_name="Yaopinzhongbiao"
        api_name="yaopinzhongbiao"
        route1="list"
        route2="analy"
        @closeAdvancedDialog="closeAdvancedDialog"
        @clearLeft="clearLeft"
        ref="advanced"></Advanced>
    </el-dialog>

    <!-- 左边部分 -->
    <div slot="left">
      <!-- 普通搜索项 -->
      <template v-for="(item, index) in vueHandleInitPutong(nomal_filed)">
        <Normal
          vuex_name="Yaopinzhongbiao"
          api_name="yaopinzhongbiao"
          :item="item"
          route1="list"
          route2="analy"
          :key="index"
          ref="ileft"></Normal>
      </template>
      <!-- 普通搜索按钮 & 高级搜索入口 -->
      <div class="advanced-search">
        <!-- 高级搜索 -->
        <span class="fr adva-icon">
          <em class="iconfont">&#xe67a;</em><a @click.prevent="handleAdvancedClick()" :class="{'abandon-click-method': nopms.gjss}">高级搜索</a>
          <el-tooltip class="item" effect="light" placement="right" v-if="helpInfo.high_holder">
            <div slot="content" v-html="helpInfo.high_holder"></div>
            <i class="el-icon-question cl-green"></i>
          </el-tooltip>
          <img src="/static/imgs/newProjectGuide/new.png" v-if="is_show_new" @click.prevent="handleAdvancedClick()" alt="高级搜索" class="new-img"/>
        </span>
        <!-- 普通搜索 -->
        <el-button class="advanced-search-btn" type="primary" size="mini" round @click="nomalSearch">搜索</el-button>
      </div>
      <!-- 条件筛选（普通/高级搜索之后的二次筛选） -->
      <Filters vuex_name="Yaopinzhongbiao" route1="list" route2="analy"></Filters>
      <!-- 保存的条件 -->
      <Saved vuex_name="Yaopinzhongbiao" api_name="yaopinzhongbiao"></Saved>
      <!-- 历史搜索 -->
    </div>

    <!-- 右边部分 -->
    <div class="la-right">
      <!-- 顶部 -->
      <section class="sec1 clearfix">
        <span class="database-name">{{allBase.dbname}}</span>
        <!-- <span class="database-num" v-if="listCount&&$route.path.split('/')[2]==='list'">{{(listCount||0).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')}}</span> -->
        <div class="sec1-right">
          <!-- <div :class="{'top-help-wrap':update_conf.log}">
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item ><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="allBase.catname">{{allBase.catname}}</el-breadcrumb-item>
              <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{allBase.dbname}}</a></el-breadcrumb-item>
            </el-breadcrumb>
          </div> -->
          <div class="top-update-wrap">
            <el-tooltip class="help-tip" effect="light" placement="bottom"  v-if="helpInfo.remark ? helpInfo.remark : ''" >
              <div slot="content">
                <el-scrollbar>
                  <div class="tip-content" v-html="helpInfo.remark ? helpInfo.remark : ''"></div>
                </el-scrollbar>
                <a class="btn default" v-if="helpInfo.url" :href="helpInfo.url" target="_blank">帮助中心</a>
              </div>
              <span><i class="el-icon-warning cl-green pr5"></i>帮助</span>
            </el-tooltip>
            {{update_conf.log}}

            <el-breadcrumb separator-class="el-icon-arrow-right" v-if="allBase.dbname">
              <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.route.indexOf('analy') > -1"><a
                  :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
              <el-breadcrumb-item v-else>{{ allBase.dbname }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.route.indexOf('analy') > -1">智能分析</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </section>
      <section class="sec2">
        <div class="la-body-tab">
          <div class="market_nav">
            <a @click.prevent="navRouteTo(1)" class="nav_one" :class="{'router-link-active': $route.path == '/yaopinzhongbiao/list' ||  $route.path == '/yaopinzhongbiao/analy'}">
              <span class="nav">
                <!-- <i class="iconfont pr5" style="font-size:20px;">&#xe638;</i> -->
                药品中标数据库</span>
            </a>
            <!-- dailiangcaigou -->
            <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/dailiangcaigou/list'}" >
              <span class="nav">
                <!-- <i class="iconfont pr5" style="font-size:20px;">&#xe643;</i> -->
              国家药品集中带量采购</span>
            </a>
            <!-- <a @click.prevent="navRouteTo(2)" class="nav_one" :class="{'router-link-active': $route.path == '/yaopinzhongbiao/analy', 'abandon-click-method': nopms.ksh}">
              <span class="nav"><i class="iconfont pr5" style="font-size:20px;">&#xe643;</i>智能分析</span>
            </a> -->
          </div>
        </div>
        <div class="search-body-content">
          <Optioned
            @showSavedPop="showSavedPop"
            @clearLeft="clearLeft"
            @clearTheLeft="clearTheLeft"
            vuex_name="Yaopinzhongbiao"
            dbname="yaopinzhongbiao"
            route1="list"
            route2="analy">
            <div class="analy fr">
              <span v-show="isShowAnaly">
                <i-wave />
                更多统计，试试<a href="javascript:void(0);" class="cl-blue" @click="showAnaly">精准分析</a>吧
              </span>
            </div>
          </Optioned>
          <i class="iconfont sh">&#xe60c;</i>
          <!-- &#xe67f; -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
        <gh-analy
          ref="ghAnaly" :class="{dn: ghAnaly.isHide}" @ananlyBClick="ananlyBClick" v-on="ghAnaly.eventObj" v-bind="ghAnaly.tmpObj" :loading="ghAnaly.loading">
        </gh-analy>
      </section>
    </div>
  </Main>
</template>

<script>
  import Saved from '@/components/common/saved'
  import SavedPop from '@/components/common/saved-pop'
  import Optioned from '@/components/common/options'
  import Normal from '@/components/common/normal'
  import Advanced from '@/components/common/advanced'
  import Filters from '@/components/common/filters-config'
  import Main from '@/components/layouts/main'
  import { mapState } from 'vuex'
  import IWave from '@/components/common/icon-wave'

  // 用于按药品名称浏览 & 按企业名称浏览 & 智能分析 的定量分析
  import GhAnaly from './components/gh-analy'

  export default{
    components: {
      Saved,
      SavedPop,
      Optioned,
      Normal,
      Advanced,
      Filters,
      Main,
      GhAnaly,
      IWave
    },
    data () {
      return {
        savedPopVisible: false,
        dialogFormVisible: false, //控制高级搜索弹框
        route: this.$route.path.split('/')[2],
        // 定量分析组件
        ghAnaly: {
          loading: false,
          isHide: true,
          totalObj: {}, //
          tmpObj: {
            A: {},
            right: []
          },
          eventObj: {}, // 保存将被绑定到 gh-analy 组件上的方法
          // API 地址
          ypfxtj: '/api/Yaopinzhongbiao/ypfxtj',
          ypfxtime: '/api/Yaopinzhongbiao/ypfxtime',
          ypfxqiye: '/api/Yaopinzhongbiao/ypfxqiye',
          ypfxfirst: '/api/Yaopinzhongbiao/ypfxfirst',
          ypfxarea: '/api/Yaopinzhongbiao/ypfxarea',
          ypfxfeiyong: '/api/Yaopinzhongbiao/ypfxfeiyong',
          ypfxqiyefx: '/api/Yaopinzhongbiao/ypfxqiyefx',
          ypfxqiyepz: '/api/Yaopinzhongbiao/ypfxqiyepz',
          ypfxqiyetime: '/api/Yaopinzhongbiao/ypfxqiyetime',
          ypfxqiyehot: '/api/Yaopinzhongbiao/ypfxqiyehot',
          getnamelist: '/api/Yaopinzhongbiao/getnamelist',
          getqiyelist: '/api/Yaopinzhongbiao/getqiyelist',
          inputyp: '/api/Yaopinzhongbiao/inputyp',
          inputqy: '/api/Yaopinzhongbiao/inputqy',
          ypfxfilter: '/api/Yaopinzhongbiao/ypfxfilter',
          qyfxfilter: '/api/Yaopinzhongbiao/qyfxfilter',
          year: [],
          company: [],
          area: [],
        },
        vuex_name: 'Yaopinzhongbiao',
        api_name: 'yaopinzhongbiao',
        isShowNew: false
      };
    },
    created () {
      if (this.$route.query.name) {
        alert(this.$route.query.name)
        let val = [this.$route.query.name]
        Store.commit('Yaopinzhongbiao/yptop', val)
        Store.commit('Yaopinzhongbiao/ypfx', val)
      }
      setTimeout(() => {
        const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
        // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
        window._paq.push(['setCustomUrl', "https://" + hashLocation]);//覆盖页面报告的url，可以自定义页面url，加上本页面路由
        window._paq.push(['trackPageView', this.allBase.dbname]);//页面名称,可以自定义页面名称
        window._paq.push(['setDocumentTitle', this.allBase.dbname])
      }, 1000);
    },
    computed:{
      ...mapState({
        nopms: state => state.Yaopinzhongbiao.nopms,
        res2: state => state.Yaopinzhongbiao.res2,
        res3: state => state.Yaopinzhongbiao.res3,
        allBase: state => state.Yaopinzhongbiao.allBase,
        helpInfo: state => state.Yaopinzhongbiao.helpInfo,
        nomal_filed: state => state.Yaopinzhongbiao.nomal_filed,
        advanced_filed: state => state.Yaopinzhongbiao.advanced_filed,
        putong: state => state.Yaopinzhongbiao.putong,
        listCount: state => state.Yaopinzhongbiao.extendCount.listCount,
        tabname: state => state.Yaopinzhongbiao.tabname,
        // 用于 定量分析，分析的 企业名称 or 药品名称的传递监听
        ypfx: state => state.Yaopinzhongbiao.ypfx,
        qiyefx: state => state.Yaopinzhongbiao.qiyefx,
        update_conf: state => state.Yaopinzhongbiao.update_conf,
      }),
      yptop: {
        get () {
          return this.$store.state.Yaopinzhongbiao.yptop
        },
        set (val) {
          this.$store.commit('Yaopinzhongbiao/yptop', val);
        }
      },
      qytop: {
        get () {
          return this.$store.state.Yaopinzhongbiao.qytop
        },
        set (val) {
          this.$store.commit('Yaopinzhongbiao/qytop', val);
        }
      },
      isShowAnaly () {
        return this.$route.path == '/yaopinzhongbiao/analy';
      },
      // 判断高级搜索旁边的new标签是否显示
      is_show_new () {
        Store.state[this.vuex_name].advanced_filed.map(item=> {
          if (item.is_show_new === 1) {
            this.isShowNew = true
          }
        })
        return this.isShowNew
      },
    },
    filters: {
      // 给数字每三位数加一个逗号
      // formatNumber (val) {
      //   val = parseInt(val)
      //   return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
      // }
    },
    watch: {
      $route () {
        this.route = this.$route.path.split('/')[2]
      },
      // 用于 定量分析
      ypfx (newVal, oldVal) {
        if (newVal.length) {
          let currNav = '药品分析';
          this.analyInitLocal(currNav, newVal);
          this.ananlyYpfxfilter(newVal[0]).then((res) => {
            this.analyApiInto(currNav, newVal[0], newVal, res.data.data.guige[0].key);
          })
          // this.analyApiInto(currNav, newVal[0], newVal, res.data.data.guige[0].key);
        }
      },
      qiyefx (newVal, oldVal) {
        if (newVal.length) {
          if (newVal[0] == oldVal[0]) {
            this.ghAnaly.isHide = false;
            return;
          } else {
            // this.ghAnaly.tmpObj.right = [];
          }
          let currNav = '企业分析';
          this.analyInitLocal(currNav, newVal);
          this.analyApiInto(currNav, newVal[0], newVal);
        }
      }
    },
    methods: {
      navRouteTo (index) {
        if (index == 1) {
          this.$router.push({ path: '/yaopinzhongbiao/list'})
        } else if (index == 2) {
          window.ga("send","event", "tab", "click", "dailiangcaigou_analy");
          window._paq.push(['trackEvent', 'tab',"click", "dailiangcaigou_analy", ])

          this.$router.push({ path: '/dailiangcaigou/list'})
          // Store.dispatch("Yaopinzhongbiao/getKshRes")
        }
      },
      // url param 参数过滤，如果值为空就不要这个参数，传入 obj
      paramDelNull (obj) {
        return Object.keys(obj).reduce((total, curr) => {
          if (obj[curr] && (obj[curr]+'').trim() != '') {
            total[curr] = obj[curr];
          }
          return total
        }, {})
      },
      // 关闭保存条件框（可能并没有起作用，可有可无）
      closeSavedPop () {
        this.savedPopVisible = false
      },
      showSavedPop () {
        this.savedPopVisible = true
      },
      showAnaly () {
        switch (this.$route.path) {
          case '/yaopinzhongbiao/list':
            if (this.tabname == 'getnamelist') {
              Store.commit('Yaopinzhongbiao/ypfx', this.res2.reduce((total, curr) => {
                return total.push(curr.guifanname) && total;
              }, []));
            } else if (this.tabname == 'getqiyelist') {
              Store.commit('Yaopinzhongbiao/qiyefx', this.res3.reduce((total, curr) => {
                return total.push(curr.guifanqiyezhongbiao) && total;
              }, []));
            }
            break;
          case '/yaopinzhongbiao/analy':
            Store.commit('Yaopinzhongbiao/ypfx', this.$store.state.Yaopinzhongbiao.yptop.reverse());
            break;
        }
        // 智能分析
        // Store.commit('Yaopinzhongbiao/ypfx', this.$store.state.Yaopinzhongbiao.yptop.reverse());
      },
      // 定量分析-------------------------------------------------
      parseHeatChart (defaArr, series) {
      // 热力图数据转换，用于将 在经过一番处理之后的数据，返回默认置空。参数 1 是，二维数组；参数 2 是覆盖二维数组中默认 0 的数据
        series.forEach((curr) => {
          defaArr[curr[0]][curr[1]] = curr[2];
        })
        return defaArr.reduce((total, curr, index) => {
          let arr = curr.reduce((tota, cur, inde) => {
            return tota.push([index, inde, cur]) && tota;
          }, []);
          return total.push(...arr) && total;
        }, [])
      },
      analyInitLocal (currNav, newVal) {
        // A
        this.ghAnaly.eventObj.ananlyAClick = this.ananlyAClick; // 绑定回调函数
        this.ghAnaly.tmpObj.A = {
          clickNav: 'ananlyAClick',
          activeValue: currNav,
          nav: [
            {label: '药品分析', value: '药品分析'},
            {label: '企业分析', value: '企业分析'},
          ]
        }
        // 以数组的形式，push 对象 到 right 里面
        // B
        this.ghAnaly.tmpObj.right = []; // 清空right。
        let r = this.ghAnaly.tmpObj.right;
        this.ghAnaly.eventObj.ananlyBClick = this.ananlyBClick;
        r.push({
          name: 'B',
          leftText: currNav,
          rightText: '返回',
          clickRight: 'ananlyBClick'
        });
        // C
        // this.ghAnaly.eventObj.ananlyCSelect = this.ananlyCSelect;
        // this.ghAnaly.eventObj.ananlyCRemote = this.ananlyCRemote;
        let C_options = newVal.map((curr, index, arr) => {
          return {label: curr, value: curr};
        })
        let tmp = currNav == '药品分析' ? '药品名称：' : '企业名称：';
        r.push({
          name: 'C',
          leftText: newVal[0],
          rightText: tmp,
          default: newVal[0],
          // btnVal: '搜索',
          loading: false,
          // clickBtn: 'ananlyCSelect',
          // 直接传递的方法不用绑定了
          remoteMethod: this.ananlyCRemote,
          handleSelect: this.ananlyCSelect,
          options: C_options
        });
        // 显示 定量分析，正在加载
        this.ghAnaly.isHide = false;
        this.ghAnaly.loading = true;
      },
      // ***  GhAnaly 初始化界面数据 ***
      // 逻辑混乱，只能不停地添加参数，来修复了。。。
      analyApiInto (currNav, searchName, moreSelect, guige, bzguige, fromGuige) {
        // 统一调用 API
        let callMethods = [];
        let tmp = bzguige;
        bzguige = bzguige && bzguige.split('*')[1];
        this.ananlyYpfxfilter(this.ghAnaly.tmpObj.right[1].leftText, guige, bzguige).then((res) => {
          let data = res.data.data;
          this.ghAnaly.area = data.first.reduce((total, curr) => {
            return total.push(curr.key) && total;
          }, []);
          this.ghAnaly.company = data.guifanqiyezhongbiao.reduce((total, curr) => {
            return total.push(curr.key) && total;
          }, []);
          this.ghAnaly.year = data.year.reduce((total, curr) => {
            return total.push(curr.key) && total;
          }, []);
          this.ghAnaly.year.sort((a,b) => {
            return parseInt(b) - parseInt(a);
          });
          return res;
        }).then((filterData) => {
          switch (currNav) {
            case '药品分析':
              callMethods = [
                this.analyYpfxtj(searchName, guige, bzguige),
                this.analyYpfxtime(searchName, null, null, guige, bzguige),
                this.analyYpfxqiye(searchName, null, null, guige, bzguige),
                this.analyYpfxfirst(searchName, null, null, guige, bzguige),
                this.analyYpfxarea(searchName, guige, bzguige),
                this.analyYpfxfeiyong(searchName, this.ghAnaly.company.slice(0, 10).join('ღ'), null, guige, bzguige),
                // this.ananlyYpfxfilter(searchName, guige, bzguige),
              ];
              break;
            case '企业分析':
              callMethods = [
                this.analyYpfxqiyefx(searchName),
                this.analyYpfxqiyepz(searchName),
                this.analyYpfxqiyetime(searchName),
                this.analyYpfxqiyehot(searchName),
                this.ananlyQyfxfilter(searchName),
              ];
              break;
          }
          // 上传请求网络的时候需要的是 星号 后面的作为参数，下面需要完整的数据设置 default2
          bzguige = tmp;
          Axios.all(callMethods)
          .then(Axios.spread((e, f, g, h, i, j, k) => {
            let right = this.ghAnaly.tmpObj.right;
            switch (currNav) {
              case '药品分析':
                // 时间、企业、地区的总数据
                // if (k.status == 200 && k.data) {
                //   let ks = k.data.data;
                //   this.ghAnaly.area = ks.first.reduce((total, curr) => {
                //     return total.push(curr.key) && total;
                //   }, []);
                //   this.ghAnaly.company = ks.guifanqiyezhongbiao.reduce((total, curr) => {
                //     return total.push(curr.key) && total;
                //   }, []);
                //   this.ghAnaly.year = ks.year.reduce((total, curr) => {
                //     return total.push(curr.key) && total;
                //   }, []);
                //   this.ghAnaly.year.sort((a,b) => {
                //     return parseInt(b) - parseInt(a);
                //   });
                // }
                // 好难过，这代码~
                if (!fromGuige) {
                  // 数据概览统计
                  if (e.status == 200 && e.data) {
                    let res = e.data.data,
                        count = res.count,
                        list = res.List;
                    right.push({
                      name: 'D',
                      data: [
                        {title: '中标地区', num: count.first, danwei: '个', tips: true},
                        {title: '中标企业', num: count.guifanqiyezhongbiao, danwei: '家'},
                        {title: '中标规格', num: count.guifanguige, danwei: '个'},
                        {title: '最新中标价', num: list.new.feiyong+'元', guige: list.new.guifanguige, company: list.new.guifanqiyezhongbiao, province: list.new.first, date:  list.new.approvaldate},
                        {title: '最早中标价', num: list.old.feiyong+'元', guige: list.old.guifanguige, company: list.old.guifanqiyezhongbiao, province: list.old.first, date:  list.old.approvaldate},
                        {title: '最高中标价', num: list.top.feiyong+'元', guige: list.top.guifanguige, company: list.top.guifanqiyezhongbiao, province: list.top.first, date:  list.top.approvaldate},
                        {title: '最低中标价', num: list.low.feiyong+'元', guige: list.low.guifanguige, company: list.low.guifanqiyezhongbiao, province: list.low.first, date:  list.low.approvaldate}
                      ]
                    });
                  }
                  // 规格筛选
                  if (filterData.status == 200 && filterData.data) {
                    let ksx = filterData.data.data;
                    let kgroup = ksx.guige.reduce((total, curr) => {
                      return total.push(curr.key) && total;
                    }, []),
                    kgroup2 = ksx.bzguige.reduce((total, curr) => {
                      return total.push(curr.key) && total;
                    }, [])
                    kgroup2.unshift('全部');
                    right.push({
                      name: 'E',
                      text: '请选择具体规格：',
                      text2: '规格',
                      text3: '（中标价为最小制剂单位的价格）',
                      text4: '规格',
                      text5: '（带包装转换比）',
                      change: this.analyShaiXuan,
                      change2: this.analyShaiXuan2,
                      group: kgroup,
                      group2: kgroup2,
                      default: kgroup[0],
                      default2: kgroup2[0],
                    });
                  }
                } else {
                  if (filterData.status == 200 && filterData.data) {
                    // 如果是点击了筛选中的规格，那么将更新下面的包装规格
                    let ksx = filterData.data.data;
                    let kgroup2 = ksx.bzguige.reduce((total, curr) => {
                      return total.push(curr.key) && total;
                    }, [])

                    kgroup2.unshift('全部');
                    right[3].group2 = kgroup2;
                    right[3].default2 = (bzguige && bzguige) || kgroup2[0];
                  }
                }
                // 时间维度
                if (f.status == 200 && f.data) {
                  // 数据按照时间从小到大排序
                  f.data.data.year.sort((a, b) => {
                    return parseInt(a.key) - parseInt(b.key);
                  })

                  let fdata = this.analyYpTimeWD(f);
                  this.ghAnaly.eventObj.ananlyFClickBtn = this.ananlyFClickBtn;
                  right.push({
                    name: 'F',
                    type: 'chart',
                    title: '时间维度分析',
                    // placeholder: '生产企业（全部）',
                    // placeholder2: '生产地区（全部）',
                    option: (() => {
                      return this.ghAnaly.company.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '生产企业（全部）',
                        value: '',
                      }]);
                    })(),
                    option2: (() => {
                      return this.ghAnaly.area.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '中标地区（全部）',
                        value: '',
                      }]);
                    })(),
                    default: '',
                    default2: '',
                    clickBtn: 'ananlyFClickBtn',
                    btnVal: '搜索',
                    yLeftTitle: '中标价（元）',
                    x: fdata.x,
                    titleChart: (() => {
                      let t = this.ghAnaly.tmpObj.right[3].default;
                      let t2 = this.ghAnaly.tmpObj.right[3].default2;
                      return t2 == '全部' ? t : t2;
                    })()+' '+this.ghAnaly.tmpObj.right[1].leftText,
                    legendData: ['中标价（最高价）','中标价（中位数）','中标价（平均价）','中标价（最低价）'],
                    series: [
                      {
                          name:'中标价（最高价）',
                          type:'line',
                          // stack 表示的是堆叠图，取消
                          // stack: '总量',
                          areaStyle: {normal: {}},
                          data: fdata.max
                      },
                      {
                          name:'中标价（中位数）',
                          type:'line',
                          // stack 表示的是堆叠图，取消
                          // stack: '总量',
                          areaStyle: {normal: {}},
                          data: fdata.middle
                      },
                      {
                          name:'中标价（平均价）',
                          type:'line',
                          // stack 表示的是堆叠图，取消
                          // stack: '总量',
                          areaStyle: {normal: {}},
                          data: fdata.avg
                      },
                      {
                          name:'中标价（最低价）',
                          type:'line',
                          // stack 表示的是堆叠图，取消
                          // stack: '总量',
                          areaStyle: {normal: {}},
                          data: fdata.min
                      }
                    ]
                  });
                }
                // 企业维度
                if (g.status == 200 && g.data) {
                  let rsp = this.analyYpQiyeWD(g);
                  this.ghAnaly.eventObj.ananlyGClickBtn = this.ananlyGClickBtn;
                  right.push({
                    name: 'G',
                    type: 'chart',
                    title: '企业维度分析',
                    // placeholder: '中标时间（全部）',
                    // placeholder2: '中标地区（全部）',
                    hasDataZoom:rsp.x.length > 10 && {
                      startValue: 0,
                      endValue: 7,
                    },
                    rotate: 45,
                    option: (() => {
                      return this.ghAnaly.year.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '中标时间（全部）',
                        value: '',
                      }]);
                    })(),
                    option2: (() => {
                      return this.ghAnaly.area.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '中标地区（全部）',
                        value: '',
                      }]);
                    })(),
                    default: '',
                    default2: '',
                    clickBtn: 'ananlyGClickBtn',
                    btnVal: '搜索',
                    x: rsp.x,
                    titleChart: (() => {
                      let t = this.ghAnaly.tmpObj.right[3].default;
                      let t2 = this.ghAnaly.tmpObj.right[3].default2;
                      return t2 == '全部' ? t : t2
                    })()+' '+this.ghAnaly.tmpObj.right[1].leftText,
                    legendData: ['中标价（最高价）','中标价（中位数）','中标价（平均价）','中标价（最低价）','中标地区数量'],
                    yLeftTitle: '中标价（元）',
                    yRightTitle: '中标地区数量（个）',
                    series: [
                      {
                        name:'中标价（最高价）',
                        type:'bar',
                        data:rsp.max
                      },
                      {
                        name:'中标价（中位数）',
                        type:'bar',
                        data:rsp.middle
                      },

                      {
                        name:'中标价（平均价）',
                        type:'bar',
                        data:rsp.avg
                      },
                      {
                        name:'中标价（最低价）',
                        type:'bar',
                        data:rsp.min
                      },
                      {
                        name:'中标地区数量',
                        type:'line',
                        yAxisIndex: 1,
                        data:rsp.line_count
                      }
                    ]
                  })
                }
                // 地区维度
                if (h.status == 200 && h.data) {
                  let rsp = this.analyYpProvinceWD(h);
                  this.ghAnaly.eventObj.ananlyHClickBtn = this.ananlyHClickBtn;
                  right.push({
                    name: 'G',
                    type: 'chart',
                    title: '地区维度分析',
                    // placeholder: '生产企业（全部）',
                    // placeholder2: '中标时间（全部）',
                    option: (() => {
                      return this.ghAnaly.company.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '生产企业（全部）',
                        value: '',
                      }]);
                    })(),
                    option2: (() => {
                      return this.ghAnaly.year.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '中标时间（全部）',
                        value: '',
                      }]);
                    })(),
                    hasDataZoom: rsp.x.length > 10 && {
                      startValue: 0,
                      endValue: 7,
                    },
                    default: '',
                    default2: '',
                    clickBtn: 'ananlyHClickBtn',
                    btnVal: '搜索',
                    x: rsp.x,
                    titleChart: (() => {
                      let t = this.ghAnaly.tmpObj.right[3].default;
                      let t2 = this.ghAnaly.tmpObj.right[3].default2;
                      return t2 == '全部' ? t : t2
                    })()+' '+this.ghAnaly.tmpObj.right[1].leftText,
                    legendData: ['中标价（最高价）','中标价（中位数）','中标价（平均价）','中标价（最低价）'],
                    yLeftTitle: '中标价（元）',
                    series: [
                      {
                        name:'中标价（最高价）',
                        type:'bar',
                        data:rsp.max
                      },
                      {
                        name:'中标价（中位数）',
                        type:'bar',
                        data:rsp.middle
                      },
                      {
                        name:'中标价（平均价）',
                        type:'bar',
                        data:rsp.avg
                      },
                      {
                        name:'中标价（最低价）',
                        type:'bar',
                        data:rsp.min
                      }
                    ]
                  });
                }
                // 中标地区热力图
                if (i.status == 200 && i.data) {
                  let first = i.data.data.first,
                      x = [], y = {}, maxValue = 0, series = [], tmp = 0;
                  first.forEach((curr, index, arr) => {
                    x.push(curr.key);
                    curr.year.buckets.forEach((cur, inde, ar) => {
                      tmp = cur.qiye.value;
                      y[cur.key] = true;
                      series.push([index, cur.key, tmp]);
                      maxValue = maxValue < tmp ? tmp : maxValue;
                    });
                  });
                  // 年份转数组
                  y = Object.keys(y);
                  // 根据y轴年份，计算series数据坐标
                  series.forEach((curr, index, arr) => {
                    curr[1] = y.indexOf(curr[1]);
                  });

                  // 没有数据的位置，默认 为0
                  let defa = [];
                  for (let i = 0; i < x.length; i++) {
                    defa[i] = [];
                    for (let j = 0; j < y.length; j++) {
                      defa[i][j] = 0;
                    }
                  }
                  series = this.parseHeatChart(defa, series);

                  right.push({
                    name: 'I',
                    type: 'chart',
                    title: '中标地区热力图',
                    subtext: '中标企业数量（个）',
                    x: x,
                    y: y,
                    xName: '省份：',
                    yName: '年份：',
                    titleChart: (() => {
                      let t = this.ghAnaly.tmpObj.right[3].default;
                      let t2 = this.ghAnaly.tmpObj.right[3].default2;
                      return t2 == '全部' ? t : t2
                    })()+' '+this.ghAnaly.tmpObj.right[1].leftText,
                    maxValue: maxValue,
                    series: series
                  });
                }
                // 搜索的下拉列表默认20个添加
                // 如果不需要改变下拉列表，就不用传
                // if (moreSelect) {
                //   let has = this.ghAnaly.tmpObj.right[1].options, jarr = [], jmap = new Map();
                //   moreSelect.forEach((curr) => {
                //     jarr.push({
                //       label: curr,
                //       value: curr
                //     });
                //   })
                //   has.concat(jarr).forEach((curr) => {
                //     jmap.set(curr.value, curr);
                //   })
                //   jarr = [];
                //   jmap.forEach((val, key) => {
                //     if (key.trim() != '') {
                //       jarr.push(val);
                //     }
                //   })
                //   // 只需要有 20 个 下拉选择框就行了
                //   has.splice(0, has.length, ...jarr);
                // }
                // 企业在执行价格分析
                if (j.status == 200 && j.data) {
                  // 转换数据
                  let rsp = this.analyYpPriceWD(j);
                  this.ghAnaly.eventObj.ananlyPriceSearch = this.ananlyPriceSearch;
                  right.push({
                    name: (() => {
                      let tmp = j.data.data.find((curr, index) => {
                        return curr.qiye.length > 4;
                      })
                      return tmp ? 'J' : 'G';
                    })(),
                    type: 'chart',
                    title: '企业在执行价格分析',
                    subtext: '最新执行中标价（元）',
                    titleChart: (() => {
                      let t = this.ghAnaly.tmpObj.right[3].default;
                      let t2 = this.ghAnaly.tmpObj.right[3].default2;
                      return t2 == '全部' ? t : t2
                    })()+' '+this.ghAnaly.tmpObj.right[1].leftText,
                    placeholder: '中标企业（全部）',
                    // placeholder2: '中标地区（全部）',
                    option: (() => {
                      return this.ghAnaly.company.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, []);
                    })(),
                    option2: (() => {
                      return this.ghAnaly.area.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '全部省份',
                        value: '',
                      }]);
                    })(),
                    xName: '企业：',
                    yName: '省份：',
                    hasDataZoom: rsp.jx.length > 5,
                    hasDataZoomX: rsp.jx.length > 5 && {
                      startValue: 0,
                      endValue: 9,
                    },
                    hasDataZoomY: rsp.jy.length > 5 && {
                      startValue: 0,
                      endValue: 9,
                    },
                    isMultiple: true,
                    default: this.ghAnaly.company.slice(0, 10),
                    default2: '',
                    clickBtn: 'ananlyPriceSearch',
                    btnVal: '搜索',
                    legendData: rsp.jLegend,
                    x: rsp.jx,
                    y: rsp.jy,
                    series: rsp.jseries
                  });
                }
                break;
              case '企业分析':
                // 时间、企业、地区的总数据
                if (i.status == 200 && i.data) {
                  i = i.data.data;
                  this.ghAnaly.area = i.first.reduce((total, curr) => {
                    return total.push(curr.key) && total;
                  }, []);
                  this.ghAnaly.year = i.year.reduce((total, curr) => {
                    return total.push(curr.key) && total;
                  }, []);
                  this.ghAnaly.year.sort((a,b) => {
                    return parseInt(b) - parseInt(a);
                  });
                }
                // 数据概览统计
                if (e.status == 200 && e.data) {
                  let res = e.data.data,
                      yppg = res.yppg.value,
                      first = res.first.value,
                      list = res.res;
                  right.push({
                    name: 'D',
                    data: [
                      {title: '中标品种', num: yppg, danwei: '个'},
                      {title: '中标地区', num: first, danwei: '个', tips: true},
                      {title: '最高中标价品种', num: list.top.guifanname, guige: list.top.guifanguige, company: list.top.feiyong, province: list.top.approvaldate, date:  list.top.first},
                      {title: '最低中标价品种', num: list.low.guifanname, guige: list.low.guifanguige, company: list.low.feiyong, province: list.low.approvaldate, date:  list.low.first},
                    ]
                  });
                }
                // 品种维度分析（Top20）
                if (f.status == 200 && f.data) {
                  // 数据排序，从高到低
                  f.data.data.guifanname.sort((a, b) => {
                    return b.first.value - a.first.value;
                  })
                  let rsp = this.analyQyPzWD(f);
                  right.push({
                    name: 'K',
                    type: 'chart',
                    title: '品种维度分析（Top20）',
                    // placeholder: '中标时间',
                    option: (() => {
                      return this.ghAnaly.year.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '中标时间（全部）',
                        value: '',
                      }]);
                    })(),
                    hasDataZoom: rsp.x.length > 10 && {
                      startValue: 0,
                      endValue: 11,
                    },
                    rotate: 45,
                    default: '',
                    clickBtn: 'ananlyKClickBtn',
                    btnVal: '搜索',
                    x: rsp.x,
                    titleChart: this.ghAnaly.tmpObj.right[1].leftText,
                    legendData: ['中标地区数量'],
                    yLeftTitle: '中标地区数量（个）',
                    series: [
                      {
                        name:'中标地区数量',
                        type:'bar',
                        data:rsp.count
                      }
                    ]
                  });
                }
                // 时间维度分析
                if (g.status == 200 && g.data) {
                  // 数据按照时间从小到大排序
                  g.data.data.year.sort((a, b) => {
                    return parseInt(a.key) - parseInt(b.key);
                  })
                  let rsp = this.analyQyTimeWD(g);
                  right.push({
                    name: 'K',
                    type: 'chart',
                    title: '时间维度分析',
                    // placeholder: '中标地区（全部）',
                    option: (() => {
                      return this.ghAnaly.area.reduce((total, curr) => {
                        return total.push({
                          label: curr,
                          value: curr
                        }) && total;
                      }, [{
                        label: '中标地区（全部）',
                        value: '',
                      }]);
                    })(),
                    hasDataZoom: rsp.x.length > 10,
                    default: '',
                    clickBtn: 'ananlyLClickBtn',
                    btnVal: '搜索',
                    x: rsp.x,
                    titleChart: this.ghAnaly.tmpObj.right[1].leftText,
                    legendData: ['中标品种数量'],
                    yLeftTitle: '中标品种数量（个）',
                    series: [
                      {
                        name:'中标品种数量',
                        type:'line',
                        data:rsp.count
                      }
                    ]
                  });
                }
                // 搜索的下拉列表默认20个添加
                // 如果不需要改变下拉列表，就不用传
                // if (moreSelect) {
                //   let has = this.ghAnaly.tmpObj.right[1].options, harr = [], hmap = new Map();
                //   moreSelect.forEach((curr) => {
                //     harr.push({
                //       label: curr,
                //       value: curr
                //     });
                //   })
                //   has.concat(harr).forEach((curr) => {
                //     hmap.set(curr.value, curr);
                //   })
                //   harr = [];
                //   hmap.forEach((curr, index) => {
                //     if (index.trim() != '') {
                //       harr.push(curr);
                //     }
                //   })
                //   // 只需要有 20 个 下拉选择框就行了
                //   has.splice(0, has.length, ...harr);
                // }
                // 中标地区热力图
                if (h.status == 200 && h.data) {
                  let hres = h.data.data.first, hx = new Set(), hy = new Set(), hseries = [], hMaxValue = 0;
                  hres.forEach((curr, index, arr) => {
                    hx.add(curr.key);
                    curr.year.buckets.forEach((cur, inde, ar) => {
                      hy.add(cur.key);
                      hseries.push([
                        curr.key,
                        cur.key,
                        cur.yearcount.value
                      ]);
                      hMaxValue = cur.yearcount.value > hMaxValue ? cur.yearcount.value : hMaxValue;
                    })
                  })
                  hx = Array.from(hx);
                  hy = Array.from(hy);
                  // 左侧时间按照从小到大（从下到上）
                  hy.sort((a, b) => {
                    return parseInt(a) - parseInt(b);
                  })
                  hseries.forEach((curr, index, arr) => {
                    curr[0] = hx.indexOf(curr[0]);
                    curr[1] = hy.indexOf(curr[1]);
                  })
                  // 没有数据的位置，默认 为0
                  let defa = [];
                  for (let i = 0; i < hx.length; i++) {
                    defa[i] = [];
                    for (let j = 0; j < hy.length; j++) {
                      defa[i][j] = 0;
                    }
                  }
                  hseries = this.parseHeatChart(defa, hseries);

                  right.push({
                    name: 'I',
                    type: 'chart',
                    title: '中标地区热力图',
                    subtext: '中标品种数量（个）',
                    x: hx,
                    y: hy,
                    inverse: true,
                    xName: '省份：',
                    yName: '年份：',
                    titleChart: this.ghAnaly.tmpObj.right[1].leftText,
                    maxValue: hMaxValue,
                    series: hseries
                  });
                }
                break;
            }
            // 所有请求加载完毕
            this.$refs.ghAnaly.setChart();
            this.ghAnaly.loading = false;
          }))
          .catch( err => {
            console.error(err);
            this.ghAnaly.loading = false;
          })
        })
      },
      analyDataList (apiStr, page, pageSize) {
        let param = {}, state = this.$store.state.Yaopinzhongbiao, // 储存axios获取数据的API参数
            sparam = state.putong,  //  普通搜索的条件
            swords = state.gaoji,  //  高级搜索的条件
            sgroup = state.shaixuan;  //  筛选搜索的条件

        if (state.gaoji.words) {
          param = _.assign({}, swords, sgroup, {page: page || 1, pageSize: pageSize || 20});
        } else {
          param = _.assign({}, sparam, sgroup, {page: page || 1, pageSize: pageSize || 20});
        }

        return Axios.get(apiStr, {
          params: _.assign(param, {
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      analyYpfxtj (searchName, guige, bzguige) {
        // 数据概览统计
        return Axios.get(this.ghAnaly.ypfxtj, {
          params: this.paramDelNull(this.keywordStatistics({
            name: searchName,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          },{name: "药品分析"}))
        });
      },
      analyYpfxtime (searchName, company, province, guige, bzguige) {
        // 时间维度
        return Axios.get(this.ghAnaly.ypfxtime, {
          params: this.paramDelNull({
            name: searchName,
            qiye: company,
            first: province,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      analyYpfxqiye (searchName, year, province, guige, bzguige) {
        // 企业维度
        return Axios.get(this.ghAnaly.ypfxqiye, {
          params: this.paramDelNull({
            name: searchName,
            year: year,
            first: province,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      analyYpfxfirst (searchName, company, year, guige, bzguige) {
        // 地区维度
        return Axios.get(this.ghAnaly.ypfxfirst, {
          params: this.paramDelNull({
            name: searchName,
            qiye: company,
            year: year,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      analyYpfxarea (searchName, guige, bzguige) {
        // 中标地区热力图
        return Axios.get(this.ghAnaly.ypfxarea, {
          params: {
            name: searchName,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        });
      },
      analyYpfxfeiyong (searchName, company, province, guige, bzguige) {
        // 企业在执行价格分析
        return Axios.get(this.ghAnaly.ypfxfeiyong, {
          params: this.paramDelNull({
            name: searchName,
            qiye: company,
            first: province,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      ananlyYpfxfilter (searchName, guige, bzguige) {
        return Axios.get(this.ghAnaly.ypfxfilter, {
          params: this.paramDelNull({
            name: searchName,
            guige: guige,
            bzguige: bzguige,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      // 企业分析
      analyYpfxqiyefx (searchName) {
        // 企业分析---数据概览
        return Axios.get(this.ghAnaly.ypfxqiyefx, {
          params: this.paramDelNull(this.keywordStatistics({
            name: searchName,
            accesstoken: GETCOOKIEFUN("accesstoken")
          },{name: "企业分析"}))
        });
      },
      analyYpfxqiyepz (searchName, year) {
        // 企业分析---品种维度分析
        return Axios.get(this.ghAnaly.ypfxqiyepz, {
          params: this.paramDelNull({
            name: searchName,
            year: year,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      analyYpfxqiyetime (searchName, province) {
        // 企业分析---时间维度分析
        return Axios.get(this.ghAnaly.ypfxqiyetime, {
          params: this.paramDelNull({
            name: searchName,
            first: province,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      analyYpfxqiyehot (searchName) {
        // 企业分析---中标地区热力图
        return Axios.get(this.ghAnaly.ypfxqiyehot, {
          params: this.paramDelNull({
            name: searchName,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      ananlyQyfxfilter (searchName) {
        return Axios.get(this.ghAnaly.qyfxfilter, {
          params: this.paramDelNull({
            name: searchName,
            accesstoken: GETCOOKIEFUN("accesstoken")
          })
        });
      },
      // Right 数据转换
      analyYpTimeWD (data) {
        let x = [], max = [], min = [], avg = [], middle = [],
            year = data.data.data.year;
        year.forEach((curr, index, arr) => {
          x.push(curr.key);
          max.push(curr.max);
          min.push(curr.min);
          avg.push(curr.avg);
          middle.push(curr.percentiles);
        })
        return {
          x, max, min, avg, middle
        }
      },
      analyYpQiyeWD (data) {
        let qiye = data.data.data.qiye,
            x = [], max = [], min = [], middle = [], avg = [], line_count = [];
        qiye.forEach((curr, index, arr) => {
          x.push(curr.key);
          max.push(curr.max);
          min.push(curr.min);
          avg.push(curr.avg);
          middle.push(curr.percentiles);
          line_count.push(curr.doc_count);
        })
        return {
          x, max, min, middle, avg, line_count
        }
      },
      analyYpProvinceWD (data) {
        let first = data.data.data.first,
            x = [], max = [], min = [], middle = [], avg = [];
        first.forEach((curr, index, arr) => {
          x.push(curr.key);
          max.push(curr.max);
          min.push(curr.min);
          avg.push(curr.avg);
          middle.push(curr.percentiles);
        })
        return {
          x, max, min, middle, avg
        }
      },
      analyYpPriceWD (data) {
        let jx = [], jy = [], jseries = [],
            jone = [], jtwo = [], jthree = [], jfour = [], jLegend = [],
            jall = [jone, jtwo, jthree, jfour],
            j = data.data.data;
        // 遍历整个数组，是否存在某个省份的企业数量超过 4个
        let tmp = j.find((curr, index) => {
          return curr.qiye.length > 4;
        })
        if (tmp) {
          jx = new Set();
          jy = new Set();
          j.forEach((curr, index, arr) => {
            jy.add(curr.first);
            curr.qiye.forEach((cur, inde, ar) => {
              jx.add(cur.name);
              jseries.push([
                cur.name,
                curr.first,
                cur.feiyong
              ]);
            })
          })
          jx = Array.from(jx);
          jy = Array.from(jy);
          // 记录最大最小值，用于 markPotin 的Max 和 Min 值
          let markPoints = {max_val: 0, min_val: 99999999};
          jseries.forEach((curr, index, arr) => {
            if (curr[2] > markPoints.max_val) {
              markPoints.max_val = curr[2];
              markPoints.maxCoord = [curr[0], curr[1]];
            } else if (curr[2] < markPoints.min_val) {
              markPoints.min_val = curr[2];
              markPoints.minCoord = [curr[0], curr[1]];
            }

            curr[0] = jx.indexOf(curr[0]);
            curr[1] = jy.indexOf(curr[1]);

          })
          jseries = [{
            type: 'scatter',
            // 设置数据圆点的大小
            // 按比例设置 最大不超过 40，最小不超过 14
            symbolSize: function (val) {
              return (1-(markPoints.max_val - val[2])/(markPoints.max_val - markPoints.min_val))*(40-14)+14;
            },
            markPoint: {
              label: {
                normal: {
                    show: false
                }
              },
              data: [
                {
                    coord: markPoints.maxCoord,
                    symbol: 'image://http://db.yaozh.com/Public/images/sicons/scatter-max.png',
                    symbolSize: [24, 18],
                    symbolOffset: ['100%', '-110%']
                },
                {
                    coord: markPoints.minCoord,
                    symbol: 'image://http://db.yaozh.com/Public/images/sicons/scatter-min.png',
                    symbolSize: [24, 18],
                    symbolOffset: ['100%', '-110%']
                }
              ]
            },
            data: jseries
          }]
        } else {
          j.forEach((curr, index, arr) => {
            jx.push(curr.first)
            curr.qiye.forEach((cur, inde, ar) => {
              jall[inde].push(cur.feiyong)
              if (!index) {
                jLegend.push(cur.name)
              }
            })
          })
          jseries = jLegend.reduce((total, curr, index, arr) => {
            return total.push({
              name: jLegend[index],
              type: 'bar',
              data: jall[index]
            }) && total;
          }, [])
        }
        return {
          jx, jy, jseries, jone, jtwo, jthree, jfour, jLegend, jall
        }
      },
      analyQyPzWD (data) {
        let res = data.data.data.guifanname,
            x = [], count = [];
        this.ghAnaly.eventObj.ananlyKClickBtn = this.ananlyKClickBtn;
        res.forEach((curr, index, arr) => {
          x.push(curr.key);
          count.push(curr.first.value);
        })
        return {
          x, count
        }
      },
      analyQyTimeWD (data) {
        let year = data.data.data.year,
            x = [], count = [];
        this.ghAnaly.eventObj.ananlyLClickBtn = this.ananlyLClickBtn;
        year.forEach((curr, index, arr) => {
          x.push(curr.key);
          count.push(curr.doc_count);
        })
        return {
          x, count
        }
      },
      // ***  GhAnaly 触发事件 ***
      ananlyAClick (index, targetNav) {
        if (this.ghAnaly.loading) {
          // 数据未加载完成，禁止切换.
          return;
        }
        // 点击 左侧导航
        // 保存当前的数据对象
        let ga = this.ghAnaly;
        // let sourceNav = ga.tmpObj.A.activeValue;
        // ga.totalObj[sourceNav] = ga.tmpObj.right;
        // 清空右侧数据
        ga.tmpObj.right = [];
        // 切换左侧的导航
        ga.tmpObj.A.activeValue = targetNav;
        // 切换右侧的数据
        // if (ga.totalObj[targetNav]) {
        if (0) {
          // 如果缓存有数据
          // ga.tmpObj.right = ga.totalObj[targetNav];
        } else {
          // 没有数据
          ga.loading = true;
          switch (targetNav) {
            case '药品分析':

              if (this.yptop.length) {
                this.analyInitLocal(targetNav, this.yptop);
                // this.analyApiInto(targetNav, this.yptop[0]);

                this.ananlyYpfxfilter(this.yptop[0]).then((res) => {
                  this.analyApiInto(targetNav, this.yptop[0], null, res.data.data.guige[0].key);
                })
              } else {
                this.analyDataList(ga.getnamelist, 1, 1)
                .then(res => {
                  let tmp = [];
                  res = res.data.data.List.res;
                  res.forEach((curr, index, arr) => {
                    tmp.push(curr.guifanname);
                  })
                  this.yptop = tmp;
                  this.analyInitLocal(targetNav, tmp);
                  // this.analyApiInto(targetNav, tmp[0]);
                  this.ananlyYpfxfilter(tmp[0]).then((res) => {
                    this.analyApiInto(targetNav, tmp[0], null, res.data.data.guige[0].key);
                  })
                })
                .catch(err => {
                  console.error(err);
                  ga.tmpObj.right = [];
                })
              }
              break;
            case '企业分析':
              if (this.qytop.length) {
                this.analyInitLocal(targetNav, this.qytop);
                this.analyApiInto(targetNav, this.qytop[0]);
              } else {
                this.analyDataList(ga.getqiyelist)
                .then(res => {
                  let tmp = [];
                  res = res.data.data.List.res;
                  res.forEach((curr, index, arr) => {
                    tmp.push(curr.guifanqiyezhongbiao);
                  })
                  this.qytop = tmp;
                  this.analyInitLocal(targetNav, tmp);
                  this.analyApiInto(targetNav, tmp[0]);
                })
                .catch(err => {
                  console.error(err);
                  ga.tmpObj.right = [];
                })
              }
              break;
          }
        }
      },
      ananlyBClick () {
        // 点击 返回智能分析
        this.ghAnaly.isHide = true;
        this.ghAnaly.totalObj = {};
      },
      ananlyCSelect (currNav, index, objVal) {
        // C 选中搜索出来的下拉列表
        if (objVal.value.trim() != '') {

          this.analyInitLocal(currNav, [objVal.value]);

          switch (currNav) {
            case '药品分析':
              this.ananlyYpfxfilter(objVal.value).then((res) => {
                this.analyApiInto(currNav, objVal.value, null, res.data.data.guige[0].key);
              })
              break;
            case '企业分析':
              this.analyApiInto(currNav, objVal.value);
              break;
          }

        }
      },
      ananlyCRemote (currNav, index, args) {
        // C 的select远程搜索
        // 正在加载...
        if (args.str.trim() != '') {
          this.ghAnaly.tmpObj.right[index].loading = true;
          this.debounceCRemote(this, currNav, index, args.str, args.cb);
        } else {
          args.cb([]);
        }
      },
      debounceCRemote: _.debounce((context, currNav, index, query, cb) => {
        // 好像 在编译和执行时  this 并不是一样的，不是 vue 对象？？？？
        var url = '', ga = context.ghAnaly;
        switch (currNav) {
          case '药品分析':
            url = ga.inputyp;
            break;
          case '企业分析':
            url = ga.inputqy;
            break;
        }
        Axios.get(url, {
          params: {
            name: query,
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            switch (currNav) {
              case '药品分析':
                res = res.data.data.res.name;
                break;
              case '企业分析':
                res = res.data.data.qiye;
                break;
              default:
                res = [];
                break;
            }
            cb(res.reduce((total, curr) => {
              return total.push({
                value: curr.key
              }) && total;
            }, []));
            // ga.tmpObj.right[index].options = res.reduce((total, curr) => {
            //   return total.push({
            //     label: curr.key,
            //     value: curr.key
            //   }) && total;
            // }, []);
          } else {
            // ga.tmpObj.right[index].options = [];
            cb([]);
          }
          ga.tmpObj.right[index].loading = false;
        })
        .catch(err => {
          // ga.tmpObj.right[index].options = [];
          cb([]);
          ga.tmpObj.right[index].loading = false;
        })
      }, 0, false),
      analyShaiXuan (currNav, index, query, query2) {
        if (query == '全部') {
          query = null;
        }
        // 规格筛选
        let tmp = this.ghAnaly.tmpObj, defaultVal2 = tmp.right[index].default2;
        this.ghAnaly.loading = true;
        tmp.right.length = 4;
        setTimeout(() => {
          // this.ghAnaly.loading = false;
          this.analyApiInto(currNav, tmp.right[1].leftText, null, query, null, true);
        }, 50)
      },
      analyShaiXuan2 (currNav, index, query, query2) {
        if (query == '全部') {
          query = null;
        }
        if (query2 == '全部') {
          query2 = null;
        }
        // 规格筛选2
        let tmp = this.ghAnaly.tmpObj, defaultVal = tmp.right[index].default;
        this.ghAnaly.loading = true;
        tmp.right.length = 4;
        setTimeout(() => {
          // this.ghAnaly.loading = false;
          this.analyApiInto(currNav, tmp.right[1].leftText, null, query, query2, true);

        }, 50)

      },
      ananlyFClickBtn (currNav, index, val, val2) {
        // 药品分析+++时间维度分析---搜索按钮
        // if (!val && !val2) {
        //   return;
        // }
        let item = this.ghAnaly.tmpObj.right[index];
        this.ghAnaly.loading = true;
        this.analyYpfxtime(
          this.ghAnaly.tmpObj.right[1].leftText, val, val2, this.ghAnaly.tmpObj.right[3].default,
          (this.ghAnaly.tmpObj.right[3].default2 == '全部'?null:this.ghAnaly.tmpObj.right[3].default2.split('*')[1])
        ).then(res => {
          if (res.data.code == 200 && res.data) {
            // 数据按照时间从小到大排序（啥东西都要前端处理，任务太重了。。。。）
            res.data.data.year.sort((a, b) => {
              return parseInt(a.key) - parseInt(b.key);
            })

            let rsp = this.analyYpTimeWD(res);
            item.series = [
              {
                  name:'中标价（最高价）',
                  type:'line',
                  // stack 表示的是堆叠图，取消
                  // stack: '总量',
                  areaStyle: {normal: {}},
                  data: rsp.max
              },
              {
                  name:'中标价（中位数）',
                  type:'line',
                  // stack 表示的是堆叠图，取消
                  // stack: '总量',
                  areaStyle: {normal: {}},
                  data: rsp.middle
              },
              {
                  name:'中标价（平均价）',
                  type:'line',
                  // stack 表示的是堆叠图，取消
                  // stack: '总量',
                  areaStyle: {normal: {}},
                  data: rsp.avg
              },
              {
                  name:'中标价（最低价）',
                  type:'line',
                  // stack 表示的是堆叠图，取消
                  // stack: '总量',
                  areaStyle: {normal: {}},
                  data: rsp.min
              }
            ];
            item.x = rsp.x;
            this.$refs.ghAnaly.setChart();
          }
          this.ghAnaly.loading = false;
        }).catch(err => {
          console.error(err);
          this.ghAnaly.loading = false;
        })
      },
      ananlyGClickBtn (currNav, index, val, val2) {
        // 药品分析+++企业维度分析---搜索按钮
        // if (!val && !val2) {
        //   return;
        // }
        let item = this.ghAnaly.tmpObj.right[index];
        this.ghAnaly.loading = true;
        this.analyYpfxqiye(
          this.ghAnaly.tmpObj.right[1].leftText, val, val2, this.ghAnaly.tmpObj.right[3].default,
          (this.ghAnaly.tmpObj.right[3].default2 == '全部'?null:this.ghAnaly.tmpObj.right[3].default2.split('*')[1])
        ).then(res => {
          if (res.data.code == 200 && res.data) {
            let rsp = this.analyYpQiyeWD(res);
            item.series = [
              {
                name:'中标价（最高价）',
                type:'bar',
                data:rsp.max
              },
              {
                name:'中标价（中位数）',
                type:'bar',
                data:rsp.middle
              },

              {
                name:'中标价（平均价）',
                type:'bar',
                data:rsp.avg
              },
              {
                name:'中标价（最低价）',
                type:'bar',
                data:rsp.min
              },
              {
                name:'中标地区数量',
                type:'line',
                yAxisIndex: 1,
                data:rsp.line_count
              }
            ];
            item.x = rsp.x;
            this.$refs.ghAnaly.setChart();
          }
          this.ghAnaly.loading = false;
        }).catch(err => {
          console.error(err);
          this.ghAnaly.loading = false;
        })
      },
      ananlyHClickBtn (currNav, index, val, val2) {
        // 药品分析+++地区维度分析---搜索按钮
        // if (!val && !val2) {
        //   return;
        // }
        let item = this.ghAnaly.tmpObj.right[index];
        this.ghAnaly.loading = true;
        this.analyYpfxfirst(
          this.ghAnaly.tmpObj.right[1].leftText, val, val2, this.ghAnaly.tmpObj.right[3].default,
          (this.ghAnaly.tmpObj.right[3].default2 == '全部'?null:this.ghAnaly.tmpObj.right[3].default2.split('*')[1])
        ).then(res => {
          if (res.data.code == 200 && res.data) {
            let rsp = this.analyYpProvinceWD(res);
            item.series = [
              {
                name:'中标价（最高价）',
                type:'bar',
                data:rsp.max
              },
              {
                name:'中标价（中位数）',
                type:'bar',
                data:rsp.middle
              },
              {
                name:'中标价（平均价）',
                type:'bar',
                data:rsp.avg
              },
              {
                name:'中标价（最低价）',
                type:'bar',
                data:rsp.min
              }
            ];
            item.x = rsp.x;
            this.$refs.ghAnaly.setChart();
          }
          this.ghAnaly.loading = false;
        }).catch(err => {
          console.error(err);
          this.ghAnaly.loading = false;
        })
      },
      ananlyPriceSearch (currNav, index, arrVal, val2) {
        // 药品分析+++企业在执行价格分析
        // if (!arrVal.length && !val2) {
        //   return;
        // }
        let item = this.ghAnaly.tmpObj.right[index];
        this.ghAnaly.loading = true;
        this.analyYpfxfeiyong(
          this.ghAnaly.tmpObj.right[1].leftText, arrVal.join && arrVal.join('ღ') || arrVal, val2, this.ghAnaly.tmpObj.right[3].default,
          (this.ghAnaly.tmpObj.right[3].default2 == '全部'?null:this.ghAnaly.tmpObj.right[3].default2.split('*')[1])
        ).then(res => {
          if (res.data.code == 200 && res.data.data.length) {
            let rsp = this.analyYpPriceWD(res);
            let tmp = res.data.data.find((curr, index) => {
              return curr.qiye.length > 4;
            })
            let useName = tmp ? 'J' : 'G';

            if (useName == 'G') {
              // 条形图
              item.series = rsp.jseries;
              this.ghAnaly.tmpObj.right.splice(index, 1, Object.assign(item, {
                name: 'L',
                hasDataZoom: rsp.jx.length > 5,
                x: rsp.jx,
                // titleChart: this.ghAnaly.tmpObj.right[1].default,
                legendData: rsp.jLegend,
                yLeftTitle: '最新执行中标价（元）',
                series: rsp.jseries
              }));
            } else {
              // 热力图
              item.series = rsp.jseries;
              this.ghAnaly.tmpObj.right.splice(index, 1, Object.assign(item, {
                name: 'J',
                subtext: '最新执行中标价（元）',
                // titleChart: this.ghAnaly.tmpObj.right[1].default,
                hasDataZoom: rsp.jx.length > 5,
                hasDataZoomX: rsp.jx.length > 5 && {
                  startValue: 0,
                  endValue: 9,
                },
                hasDataZoomY: rsp.jy.length > 5 && {
                  startValue: 0,
                  endValue: 9,
                },
                x: rsp.jx,
                y: rsp.jy,
                series: rsp.jseries
              }));
            }
          }
          // 手动调用子组件的图表绘制
          this.$refs.ghAnaly.setChart();
          this.ghAnaly.loading = false;
        }).catch(err => {
          console.error(err);
          this.ghAnaly.loading = false;
        })
      },
      ananlyKClickBtn (currNav, index, val) {
        // 企业分析+++品种维度
        // if (!val) {
        //   return;
        // }
        let item = this.ghAnaly.tmpObj.right[index];
        this.ghAnaly.loading = true;
        this.analyYpfxqiyepz(this.ghAnaly.tmpObj.right[1].leftText, val).then(res => {
          if (res.data.code == 200 && res.data) {
            // 数据排序，从高到低
            res.data.data.guifanname.sort((a, b) => {
              return b.first.value - a.first.value;
            })
            let rsp = this.analyQyPzWD(res);
            item.series = [
              {
                name:'中标地区数量',
                type:'bar',
                data:rsp.count
              }
            ];
            item.x = rsp.x;
            this.$refs.ghAnaly.setChart();
          }
          this.ghAnaly.loading = false;
        }).catch(err => {
          console.error(err);
          this.ghAnaly.loading = false;
        })
      },
      ananlyLClickBtn (currNav, index, val) {
        // 企业分析+++时间维度
        // if (!val) {
        //   return;
        // }
        let item = this.ghAnaly.tmpObj.right[index];
        this.ghAnaly.loading = true;
        this.analyYpfxqiyetime(this.ghAnaly.tmpObj.right[1].leftText, val).then(res => {
          if (res.data.code == 200 && res.data) {
            let rsp = this.analyQyTimeWD(res);
            item.series = [
              {
                name:'中标品种数量',
                type:'line',
                data:rsp.count
              }
            ]
            item.x = rsp.x;
            this.$refs.ghAnaly.setChart();
          }
          this.ghAnaly.loading = false;
        }).catch(err => {
          console.error(err);
          this.ghAnaly.loading = false;
        })
      },
      //获取普通搜索
      nomalSearch () {
        Store.commit("Yaopinzhongbiao/conditions",[])
        //清空高级搜索条件和筛选项
        Store.commit('Yaopinzhongbiao/groups',{})
        if (this.route=='list') {
          Store.dispatch('Yaopinzhongbiao/nomalSearch')
        }else if(this.route=='analy'){
          Store.dispatch('Yaopinzhongbiao/getKshRes')
        }
      },
      // 点击左侧栏中的“高级搜索”触发的事件
      handleAdvancedClick () {
        if (!this.nopms.gjss) {
          this.dialogFormVisible = true

          if (this.$refs.advanced) { // 第一次点击之后才渲染，所以加此判定
            this.$refs.advanced.initConditions()
          }
        }
      },
      // 关闭高级搜索框（可能并没有起作用，可有可无）
      closeAdvancedDialog () {
        this.dialogFormVisible = false
      },
      // 高级搜索框中：点击搜索后，清空左侧普通搜索内容（仅肉眼）事件
      clearLeft () {
        this.vueClearLeft()
      },
      // 已选条件部分：点击x后，清空左侧对应的普通搜索内容（仅肉眼）事件
      clearTheLeft (option) {
        this.vueClearTheLeft(option)
      },
      echartsResizeHandler() {
        let screen_width = window.innerWidth;
        $(".dialog .chart").width(screen_width - 440);
        // let list = $(".dialog .chart")
        // Array.prototype.forEach.call(list, (item) => {
        //   Echarts.init(item, 'yaozh_theme').resize()
        // });
        this.echartsResize($(".dialog .chart"))
      }
    },
    mounted () {
      Store.dispatch("Yaopinzhongbiao/getBaseInfo").then(() => {
        this.vueTogglePmsTooltip()
      })
      this.vueRouteFrom("Yaopinzhongbiao")
      window.addEventListener('resize', this.echartsResizeHandler);
    },
  }
</script>

<style lang="less">
@import "~@/assets/less/app.less";
@import "~@/assets/less/var.less";
  .ypzb {
    .el-dialog {
      border-radius: 20px!important;
    }
    // .la-left-side{
    //   .el-input__inner{
    //     height: 30px;
    //     line-height: 30px;
    //     border-radius: 15px;
    //   }
    //   .la-input{
    //     padding: 0px 15px;
    //   }
    //   .title{
    //     padding: 10px 0px 4px;
    //     font-size: 14px;
    //     .title-right{
    //       float: right;
    //       color: @FontColor3;
    //     }
    //   }
    //   .la-date{
    //     padding: 0px 15px;
    //     .shortcut-date{
    //       font-size: @FontSizeSmall;
    //       .el-radio{
    //         margin-bottom: 10px;
    //       }
    //       .el-radio+.el-radio{
    //         margin: 0px 2px 2px 0px;
    //       }
    //       .el-radio__label{
    //         padding: 0px 2px 0px;
    //         margin: 0px 5px;
    //         font-size: @FontSizeSmall;
    //       }
    //     }
    //     .date-range{
    //       .el-radio__label{
    //         padding-left: 4px;
    //         font-size: @FontSizeSmall;
    //       }
    //       .el-input__inner{
    //         padding: 0px 0px 0px 20px;
    //       }
    //       .el-date-editor.el-input, .el-date-editor.el-input__inner{
    //         width: 100px;
    //       }
    //       .el-input__prefix{
    //         left: 3px;
    //       }
    //       .el-input__icon{
    //         width: 11px;
    //         line-height: 30px;
    //       }
    //     }
    //   }
    //   .item{
    //     padding-bottom: 20px;
    //   }
    //   .item-title{
    //     display: block;
    //     height: 30px;
    //     padding-left: 15px;
    //     line-height: 30px;
    //     font-size: @FontSize;
    //     background-color: @PrimaryBackgroundColor;
    //   }
    //   .el-dialog__header{
    //     padding: 20px 0px;
    //     font-size: 15px;
    //     border-bottom: 1px solid @BorderColor;
    //     .dialog-header{
    //       padding: 0px 30px;
    //     }
    //   }
    // }
    .la-right{
      .sec1{
        height: 60px;
        line-height: 60px;
        padding-left: 30px;
        text-align: bottom;
        .database-name{
          color: @PrimaryColor;
          font-size: 28px;
        }
        .database-num{
          font-size: 26px;
          font-weight: 900;
        }
        .sec1-right{
          float: right;
          .help-tip{
            padding-right: 10px;
          }
        }
      }
       .sec2{

        .market_nav{
          // box-shadow: @BoxShadow;
          .nav_one{
            width: 50%;
            .nav {
              i {
                font-size: 26px;
                margin-right: 4px;
                font-weight: normal;
              }
            }
          }
        }
        .la-body-tab{
          box-shadow:0 -4px 5px -3px #c4d3f8;
        }
      }
    }
    .search-body-content {
      width: 100%;
      position: relative;
      .sh {
        position: absolute;
        right: 26px;
        top: 16px;
        cursor: pointer;
        z-index: 7;
        display: none;
      }
      .analy {
        display: inline-block;
      }
    }
    // el-dialog遮罩层样式（背景色）
    .v-modal {
      background: rgba(102,102,102, .4);
    }

    .new-img {
      position: absolute;
      top: 0;
      cursor: pointer;
    }
  }

</style>
