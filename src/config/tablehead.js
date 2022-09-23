import Moment from "moment";
var date = new Date();
var year = date.getFullYear();
export default {
  zhuce: {
    slh: [{
        prop: "shoulihao",
        label: "受理号",
        sort: "custom", //是否排序
        width: 120, //最少宽度
        okWidth: 140, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "zhuceleixing",
        label: "注册分类",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        sort: "custom",
        width: 90,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "qiyemingcheng",
        label: "企业名称",
        sort: "custom",
        width: 150,
        checked: true,
        tips: true //表头后面是否有提示
      },
      {
        prop: "qiyelianheshenbao",
        label: "联合申报企业名称",
        sort: "custom",
        width: 200,
        checked: true
      },
      {
        prop: "banlizhuangtai",
        label: "办理状态",
        width: 100,
        checked: true
      },
      {
        prop: "zhuangtaikaishishijian",
        label: "状态开始时间",
        sort: "custom",
        width: 120,
        okWidth: 150, //指定宽度
        checked: true
      },
      {
        prop: "shenpingrenwufenlei",
        label: "任务类型",
        sort: "custom",
        width: 100,
        checked: false
      },
      {
        prop: "xuhao",
        label: "序号",
        sort: "custom",
        width: 80,
        checked: false
      },
      {
        prop: "linchuangdate",
        label: "临床试验默认许可日期",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: false
      },
      {
        prop: "shenpingdate",
        label: "完成审评日期",
        sort: "custom",
        width: 80,
        okWidth: 150, //指定宽度
        checked: false
      },
      {
        prop: "jielun",
        label: "审评结论",
        width: 70,
        okWidth: 130,
        checked: true,
        tips: true //表头后面是否有提示
      },
      {
        prop: "tspz",
        label: "特殊审批",
        width: 40,
        checked: false
      },
      {
        prop: "zdzx",
        label: "重大专项",
        width: 40,
        checked: false
      },
      {
        prop: "yxsp",
        label: "优先审评",
        width: 40,
        checked: false
      },
      {
        prop: "gdcf",
        label: "过度重复品种",
        width: 100,
        checked: false
      },
      {
        prop: "wftjcbzj",
        label: "无需开展一致性评价品种",
        width: 100,
        checked: false
      },
      {
        prop: "tpxzl",
        label: "突破性治疗品种",
        width: 40,
        checked: false
      },
      {
        prop: "zjxzsp",
        label: "直接行政审批",
        width: 40,
        checked: false
      },
      {
        prop: "shengfen",
        label: "省份",
        width: 50,
        checked: false
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "report",
        label: "审评报告",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "instruct",
        label: "说明书",
        width: 100, //最少宽度
        checked: false //默认是否选择
      }
    ],
    slhExport: [{
        prop: "shoulihao",
        label: "受理号",
        sort: "custom", //是否排序
        width: 120, //最少宽度
        okWidth: 140, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "zhuceleixing",
        label: "注册分类",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        sort: "custom",
        width: 90,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "qiyemingcheng",
        label: "企业名称",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "qiyelianheshenbao",
        label: "联合申报企业名称",
        sort: "custom",
        width: 180,
        checked: true
      },
      {
        prop: "banlizhuangtai",
        label: "办理状态",
        width: 100,
        checked: true
      },
      {
        prop: "zhuangtaikaishishijian",
        label: "状态开始时间",
        sort: "custom",
        width: 120,
        okWidth: 150, //指定宽度
        checked: true
      },
      {
        prop: "shenpingrenwufenlei",
        label: "任务类型",
        sort: "custom",
        width: 100,
        checked: false
      },
      {
        prop: "xuhao",
        label: "序号",
        sort: "custom",
        width: 80,
        checked: false
      },
      {
        prop: "linchuangdate",
        label: "临床试验默认许可日期",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: false
      },
      {
        prop: "buchongdate",
        label: "完成审评日期",
        sort: "custom",
        width: 80,
        okWidth: 150, //指定宽度
        checked: false
      },
      {
        prop: "jielun",
        label: "审评结论",
        width: 100,
        okWidth: 130,
        checked: true
      },
      {
        prop: "tspz",
        label: "特殊审批",
        width: 40,
        checked: false
      },
      {
        prop: "zdzx",
        label: "重大专项",
        width: 40,
        checked: false
      },
      {
        prop: "yxsp",
        label: "优先审评",
        width: 40,
        checked: false
      },
      {
        prop: "gdcf",
        label: "过度重复品种",
        width: 100,
        checked: false
      },
      {
        prop: "wftjcbzj",
        label: "无需开展一致性评价品种",
        width: 100,
        checked: false
      },
      {
        prop: "tpxzl",
        label: "突破性治疗品种",
        width: 40,
        checked: false
      },
      {
        prop: "zjxzsp",
        label: "直接行政审批",
        width: 40,
        checked: false
      },
      {
        prop: "shengfen",
        label: "省份",
        width: 50,
        checked: false
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "report",
        label: "审评报告",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "instruct",
        label: "说明书",
        width: 100, //最少宽度
        checked: false //默认是否选择
      }
    ],
    ypmc: [{
        prop: "guifanname",
        label: "药品名称",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "yaopin_high",
        label: "最高状态",
        width: 100,
        checked: true
      },
      {
        prop: "zhuangtaidate1",
        label: "最新状态时间",
        width: 110,
        checked: true
      },
      {
        prop: "company_max",
        label: "最多申报公司",
        width: 150,
        checked: true
      },
      {
        prop: "shenbaonum",
        label: "申报总数",
        sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "changjianum",
        label: "已申报企业数",
        // sort: "custom",
        width: 120,
        checked: true,
        tips: true //表头后面是否有提示
      },
      {
        prop: "guoshennum",
        label: "已过评企业数",
        // sort: "custom",
        width: 120,
        checked: true,
      },
      {
        prop: "shenbaolinchuang",
        label: "申报临床",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "shenbaoshengchan",
        label: "申报生产",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "buchongshenqing",
        label: "补充申请",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "xinyaoshenqing",
        label: "新药申请",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "fangzhishenqing",
        label: "仿制申请",
        // sort: "custom",
        width: 70,
        checked: true
      }
    ],
    ypmcExpand: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150,
        okWidth: 140 //指定宽度
      },
      // {
      //   prop:"zhucefenlei",
      //   label:"注册分类",
      //   width:80,
      // },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        width: 80,
        okWidth: 120 //指定宽度
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        width: 100,
        sort: "custom",
        okWidth: 120 //指定宽度
      },
      {
        prop: "qiyemingcheng",
        label: "企业名称",
        okWidth: 500 //指定宽度
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 150
      },
      {
        prop: "jielun",
        label: "审评结论",
        // sort: "custom",
        okWidth: 120 //指定宽度
      },
      {
        prop: "zhuangtaidate1",
        label: "最高状态时间",
        sort: "custom",
        width: 150,
        okWidth: 120 //指定宽度
      },
      {
        prop: "zhuangtaidate1",
        label: "最新状态时间",
        width: 150,
        okWidth: 120 //指定宽度
      }
    ],
    ypmcExpandTwo: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150,
        okWidth: 140 //指定宽度
      },
      {
        prop: "yaopinleixing_1",
        label: "注册分类",
        width: 80
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        width: 80,
        okWidth: 120 //指定宽度
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        width: 100,
        sort: "custom",
        okWidth: 120 //指定宽度
      },
      {
        prop: "qiyemingcheng",
        label: "企业名称",
        okWidth: 500 //指定宽度
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 150
      },
      {
        prop: "zhuangtaidate1",
        label: "状态开始时间(药智)",
        sort: "custom",
        width: 150,
        okWidth: 120 //指定宽度
      },
      {
        prop: "jielun",
        label: "审评结论",
        // sort: "custom",
        okWidth: 120 //指定宽度
      }
    ],
    qy: [{
        prop: "guifanqiyezhongbiao",
        label: "企业名称",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "yaopin_high",
        label: "最高状态",
        width: 110,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "zhuangtaidate1",
        label: "最新状态时间",
        width: 120,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "zdsbpz",
        label: "最多申报品种",
        width: 150,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "shenbaonum",
        label: "申报总数",
        sort: "custom",
        width: 100,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "pingzhongnum",
        label: `已申报品种数`,
        // sort: "custom",
        width: 120,
        okWidth: 210, //指定宽度
        checked: true,
        tips: true //表头后面是否有提示
      },
      {
        prop: "shenbaolinchuang",
        label: "申报临床",
        // sort: "custom",
        width: 70,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "shenbaoshengchan",
        label: "申报生产",
        // sort: "custom",
        width: 70,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "buchongshenqing",
        label: "补充申请",
        width: 70
        // sort: "custom",
      },
      {
        prop: "xinyaoshenqing",
        label: "新药申请",
        // sort: "custom",
        width: 70,
        okWidth: 210, //指定宽度
        checked: true
      },
      {
        prop: "fangzhishenqing",
        label: "仿制申请",
        // sort: "custom",
        width: 70,
        okWidth: 210, //指定宽度
        checked: true
      }
    ],
    qyExpand: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150,
        okWidth: 130 //指定宽度
      },
      {
        prop: "name",
        label: "药品名称"
      },
      // {
      //   prop:"zhucefenlei",
      //   label:"注册分类",
      // },
      {
        prop: "shenqingleixing",
        label: "申请类型",
        okWidth: 120 //指定宽度
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        sort: "custom",
        width: 100,
        okWidth: 120 //指定宽度
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 100
      },
      {
        prop: "jielun",
        label: "审评结论",
        // sort: "custom",
        okWidth: 120 //指定宽度
      },
      {
        prop: "zhuangtaidate1",
        sort: "custom",
        label: "最高状态时间",
        width: 150,
        okWidth: 120 //指定宽度
      },
      {
        prop: "zhuangtaidate1",
        label: "最新状态时间",
        width: 150,
        okWidth: 120 //指定宽度
      }
    ],
    qyExpandTwo: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150,
        okWidth: 140 //指定宽度
      },
      {
        prop: "name",
        label: "药品名称",
        okWidth: 500 //指定宽度
      },
      {
        prop: "yaopinleixing_1",
        label: "注册分类",
        width: 80
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        width: 80,
        okWidth: 120 //指定宽度
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        width: 100,
        sort: "custom",
        okWidth: 120 //指定宽度
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 150
      },
      {
        prop: "zhuangtaidate1",
        label: "状态开始时间(药智)",
        sort: "custom",
        width: 150,
        okWidth: 120 //指定宽度
      },
      {
        prop: "jielun",
        label: "审评结论",
        // sort: "custom",
        okWidth: 120 //指定宽度
      }
    ],
    species: [{
        prop: "guifanname",
        label: "药品名称",
        width: 150,
        checked: true
      }, {
        prop: "guifanqiyezhongbiao",
        label: "企业名称",
        width: 150,
        checked: true
      }, {
        prop: "yaopin_high",
        label: "最高状态",
        width: 110,
        checked: true
      }, {
        prop: "zhuangtaidate1",
        label: "最新状态时间",
        width: 120,
        checked: true
      }, {
        prop: "shenbaonum",
        label: "申报总数",
        sort: "custom",
        width: 120,
        checked: true
      }, {
        prop: "shenbaolinchuang",
        label: "申报临床",
        width: 80,
        checked: true
      },
      {
        prop: "shenbaoshengchan",
        label: "申报生产",
        width: 80,
        checked: true
      },
      {
        prop: "buchongshenqing",
        label: "补充申请",
        width: 80,
        checked: true
      },
      {
        prop: "xinyaoshenqing",
        label: "新药申请",
        width: 80,
        checked: true
      },
      {
        prop: "fangzhishenqing",
        label: "仿制申请",
        width: 80,
        checked: true
      }
    ],
    speciesExpand: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150,
      },
      {
        prop: "name",
        label: "药品名称",
        width: 150,
      },
      {
        prop: "guifanqiyemingcheng",
        label: "企业名称",
        width: 150,
      },
      {
        prop: "yaopinleixing_1",
        label: "注册分类",
        width: 100,
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        width: 120,
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        sort: "custom",
        width: 120,
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 120
      },
      {
        prop: "jielun",
        label: "审评结论",
        // sort: "custom",
        width: 120
      },
      {
        prop: "zhuangtaidate1",
        sort: "custom",
        label: "最高状态时间",
        width: 150,
      },
      {
        prop: "zhuangtaidate1",
        label: "最新状态时间",
        sort: "custom",
        width: 150,
      }
    ],
    speciesExpandTwo: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150,
      },
      {
        prop: "name",
        label: "药品名称",
        width: 150,
      },
      {
        prop: "guifanqiyemingcheng",
        label: "企业名称",
        width: 150,
      },
      {
        prop: "yaopinleixing_1",
        label: "注册分类",
        width: 100,
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        width: 120,
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        sort: "custom",
        width: 120,
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 120
      },
      {
        prop: "jielun",
        label: "审评结论",
        // sort: "custom",
        width: 120
      }
    ]
  },
  drugreport: {
    sspz: {
      china: [{
          prop: "drugid",
          label: "批准号",
          checked: true //默认是否选择
        }, {
          prop: "name",
          label: "药品名称",
          checked: true //默认是否选择
        },
        {
          prop: "company",
          label: "企业名称",
          checked: true //默认是否选择
        },
        {
          prop: "zwform",
          label: "剂型",
          checked: true //默认是否选择
        },
        {
          prop: "status",
          label: "市场状态",
          checked: true //默认是否选择
        },
        {
          prop: "date",
          label: "批准日期",
          checked: true //默认是否选择
        },
      ],
      us: [{
          prop: "drugid",
          label: "批准号",
          checked: true //默认是否选择
        }, {
          prop: "name",
          label: "药品名称",
          checked: true //默认是否选择
        },
        {
          prop: "company",
          label: "企业名称",
          checked: true //默认是否选择
        },
        {
          prop: "zwform",
          label: "剂型",
          checked: true //默认是否选择
        },
        {
          prop: "status",
          label: "市场状态",
          checked: true //默认是否选择
        },
        {
          prop: "date",
          label: "批准日期",
          checked: true //默认是否选择
        },
      ],
      eu: [{
          prop: "drugid",
          label: "批准号",
          checked: true //默认是否选择
        }, {
          prop: "name",
          label: "药品名称",
          checked: true //默认是否选择
        },
        {
          prop: "company",
          label: "企业名称",
          checked: true //默认是否选择
        },
        {
          prop: "zwform",
          label: "剂型",
          checked: true //默认是否选择
        },
        {
          prop: "status",
          label: "市场状态",
          checked: true //默认是否选择
        },
        {
          prop: "date",
          label: "批准日期",
          checked: true //默认是否选择
        },
        {
          prop: "source",
          label: "来源",
          checked: true //默认是否选择
        },
      ],
      jp: [{
          prop: "drugid",
          label: "批准号",
          checked: true //默认是否选择
        }, {
          prop: "name",
          label: "药品名称",
          checked: true //默认是否选择
        },
        {
          prop: "company",
          label: "企业名称",
          checked: true //默认是否选择
        },
        {
          prop: "zwform",
          label: "剂型",
          checked: true //默认是否选择
        },
        {
          prop: "status",
          label: "市场状态",
          checked: true //默认是否选择
        },
        {
          prop: "date",
          label: "批准日期",
          checked: true //默认是否选择
        },
      ],
      other: [{
          prop: "source",
          label: "国家或地区",
          checked: true //默认是否选择
        }, {
          prop: "name",
          label: "药品名称",
          checked: true //默认是否选择
        },
        {
          prop: "company",
          label: "企业名称",
          checked: true //默认是否选择
        },
        {
          prop: "zwform",
          label: "剂型",
          checked: true //默认是否选择
        },
        {
          prop: "status",
          label: "市场状态",
          checked: true //默认是否选择
        },
        {
          prop: "date",
          label: "批准日期",
          checked: true //默认是否选择
        },
      ],
      countries: [{
          prop: "cname",
          label: "国家或地区",
          checked: true //默认是否选择
        },
        {
          prop: "company",
          label: "上市公司",
          checked: true //默认是否选择
        },
        {
          prop: "sbm",
          label: "商标名",
          checked: true //默认是否选择
        },
        {
          prop: "zfm",
          label: "活性成分",
          checked: true //默认是否选择
        },
        {
          prop: "syzy",
          label: "适应症",
          checked: true //默认是否选择
        },
        {
          prop: "status",
          label: "状态",
          checked: true //默认是否选择
        }
      ]
    },
    biaozhun: [{
        prop: "name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "source",
        label: "标准来源",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "page",
        label: "页码",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "download",
        label: "文件下载",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    instruct: [{
        prop: "name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "source",
        label: "来源",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "更新时间",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "download",
        label: "文件下载",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    yaopinzhongbiao: [{
        prop: "name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "brandname",
        label: "商品名",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "baozhuanguige2",
        label: "包装转换比",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "packaging",
        label: "单位",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "feiyong",
        label: "中标价 (元)",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shengchanqiye",
        label: "生产企业",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "bidder",
        label: "投标企业",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "first",
        label: "中标省份",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "approvaldate",
        label: "发布日期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    clinical: [{
        prop: "me_id",
        label: "登记号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "title",
        label: "试验题目",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "conditions_guifan",
        label: "疾病",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "interventions_guifan",
        label: "干预措施",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "recruitment",
        label: "试验状态",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "phases",
        label: "研究分期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "countries",
        label: "国家或地区",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "start",
        label: "开始日期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    ypxs: [{
        prop: "brandname",
        label: "商品名",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_4",
        label: (year - 5).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_3",
        label: (year - 4).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_2",
        label: (year - 3).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_1",
        label: (year - 2).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_0",
        label: (year - 1).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    yyxsThead: [{
        prop: "guifanname",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanqiye",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_4",
        label: (year - 5).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_3",
        label: (year - 4).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_2",
        label: (year - 3).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_1",
        label: (year - 2).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year_0",
        label: (year - 1).toString(),
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    zhuce: [{
        prop: "shoulihao",
        label: "受理号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuceleixing",
        label: "注册分类",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shenqingleixing_1",
        label: "申请类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "chengbanriqi",
        label: "承办日期",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "qiyemingcheng",
        label: "企业名称",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuangtai",
        label: "办理状态(药智)",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuangtaidate1",
        label: "状态开始时间(药智)",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jielun",
        label: "审评结论",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }
    ],
    parent: {
      cn: [{
          prop: "PN",
          label: "公开(公告)号",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "APN",
          label: "申请号",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "PBD",
          label: "公开(公告)日",
          width: 80, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "EED",
          label: "到期日(估算)",
          width: 80, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "TTL",
          label: "专利名称",
          width: 180, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "AN",
          label: "申请(专利权)人",
          width: 180, //最少宽度
          checked: true //默认是否选择
        }
      ],
      us: [{
          prop: "appl_no",
          label: "申请号",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "patent_no",
          label: "专利号",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "patent_expire_date_text",
          label: "到期日(估算)",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "drug_substance_flag",
          label: "化合物专利",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "drug_product_flag",
          label: "产品专利",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "patent_use_code",
          label: "专利用途码",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "delist_flag",
          label: "专利撤销标识",
          width: 100, //最少宽度
          checked: true //默认是否选择
        }
      ],
      all: [{
          prop: "PN",
          label: "公开(公告)号",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "TPI",
          label: "技术类型",
          width: 100, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "PBD",
          label: "公开(公告)日",
          width: 80, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "EED",
          label: "到期日(估算)",
          width: 80, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "TTL",
          label: "专利名称",
          width: 180, //最少宽度
          checked: true //默认是否选择
        },
        {
          prop: "AN",
          label: "申请(专利权)人",
          width: 180, //最少宽度
          checked: true //默认是否选择
        }
      ]
    },
    indication: [{
      prop: "indication_cn",
      label: "适应症",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "status_cn",
      label: "研发阶段",
      sort: "custom",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "country_cn",
      label: "国家/地区",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "guifanqiye",
      label: "研发单位",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "update",
      label: "日期",
      sort: "custom",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }]

  },
  companyreport: {
    // 基础信息 表头
    DetailJcxx: [{
        prop: "qymc",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "fddb",
        label: "企业法人",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jyzt",
        label: "经营状态",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jyfw",
        label: "经营范围",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 注册申报 表头
    DetailZcsb: [{
        prop: "zhuce.shoulihao",
        label: "受理号",
        width: 120, //最少宽度
        okWidth: 120, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.shenqingleixing_1",
        label: "申请类型",
        width: 90, //最少宽度
        okWidth: 90, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.guifanjixing",
        label: "剂型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.yaopingleixing_1+zhuce.zhuceleixing",
        label: "注册分类",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.chengbanriqi",
        label: "承办日期",
        width: 100, //最少宽度
        okWidth: 100, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.banlizhuangta",
        label: "办理状态",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.zhuangtaikaishishijian",
        label: "状态开始日期",
        width: 120, //最少宽度
        okWidth: 120, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "ss_jielun.jielun",
        label: "审评结论",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 中标信息 表头
    DetailZbxx: [{
        prop: "yaopintongyongming",
        label: "药品通用名",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jixing",
        label: "剂型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "baozhuangzhuanhuanbi",
        label: "包装转换比",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "danwei",
        label: "单位",
        width: 70, //最少宽度
        okWidth: 70, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhongbiaojia",
        label: "中标价（元）",
        width: 120, //最少宽度
        okWidth: 120, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "toubiaoqiye",
        label: "投标企业",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhongbiaoshengfen",
        label: "中标省份",
        width: 110, //最少宽度
        okWidth: 110, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "faburiqi",
        label: "发布日期",
        width: 145, //最少宽度
        okWidth: 145, //宽度
        checked: true //默认是否选择
      }
    ],
    // 临床试验 - 国内临床试验 表头
    DetailLcsy1: [{
        prop: "linchuangshiyan.dengjiid",
        label: "登记号",
        width: 70, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.title",
        label: "实验题目",
        width: 110, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.name",
        label: "药物名称",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.type",
        label: "药物类型",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.indication",
        label: "适应症",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.me_status",
        label: "试验状态",
        width: 110, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.phase",
        label: "试验分期",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.institutes",
        label: "试验机构",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "linchuangshiyan.date",
        label: "登记时间",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 临床试验 - 国外临床试验 表头
    DetailLcsy2: [{
        prop: "zhuceid",
        label: "注册号",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "phase",
        label: "实验分期",
        width: 60, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "condition",
        label: "疾病领域",
        width: 220, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "exportdate",
        label: "登记时间",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "status",
        label: "招募状态",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ptitle",
        label: "试验题目",
        width: 200, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 风险信息 表头
    DetailFxxx: [{
        prop: "ypzl.pitchno",
        label: "药品批号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypzl.name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypzl.specification",
        label: "药品规格",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypzl.unpasseditem",
        label: "不合格项目",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypzl.regulation",
        label: "体检依据",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypzl.reportdate",
        label: "公开(公告日)",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypzl.file",
        label: "公告来源",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 生产认证
    DetailScrz1: [{
        prop: "zhengshubianhao",
        label: "证书编号",
        width: 80, //最少宽度
        okWidth: 100, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "renzhengfanwei",
        label: "认证范围",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "gmpbanben",
        label: "认证版本",
        width: 150, //最少宽度
        okWidth: 200, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "fazhengriqi",
        label: "发证日期",
        width: 130, //最少宽度
        okWidth: 130, //宽度
        checked: true //默认是否选择
      },
      {
        prop: "jiezhiriqi",
        label: "有效期截止日",
        width: 100, //最少宽度
        okWidth: 140, //宽度
        checked: true //默认是否选择
      }
    ],
    DetailScrz2: [{
        prop: "no",
        label: "备案编号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "备案类型",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "通用名(拟评价)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "form",
        label: "剂型(拟评价)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "规格(拟评价)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name2",
        label: "通用名(拟参比)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "form2",
        label: "剂型(拟参比)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength2",
        label: "规格(拟参比)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "number",
      //   label: "289目录品种",
      //   width: 120, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "holder",
        label: "持证商",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company2",
        label: "生产厂/产地",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "备案时间",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }
    ],
    //年报数据-营收情况
    DetailNbsj: [{
        prop: "zhuce.shoulihao",
        label: "类型名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.name",
        label: "营业收入（万元）",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.shenqingleixing_1",
        label: "营业收入比上年同期增减 (%)",
        width: 210, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.guifanjixing",
        label: "营业成本（万元）",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.yaopingleixing_1+zhuce.zhuceleixing",
        label: "营业成本比上年增减(%)",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.chengbanriqi",
        label: "营业利润（万元）",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.banlizhuangta",
        label: "毛利率（%）",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.zhuangtaikaishishijian",
        label: "毛利率比上年增减(%)",
        width: 200, //最少宽度
        checked: true //默认是否选择
      }
    ],
    //年报数据-研发情况
    DetailYfqk: [{
        prop: "zhuce.shoulihao",
        label: "药品名称",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.name",
        label: "注册分类",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.shenqingleixing_1",
        label: "功能主治",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.guifanjixing",
        label: "注册阶段",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.yaopingleixing_1+zhuce.zhuceleixing",
        label: "进展情况",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.chengbanriqi",
        label: "本期研发投入金额 （万元）",
        width: 200,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.banlizhuangta",
        label: "本期金额较上年同期变动比例(%)",
        width: 230,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.zhuangtaikaishishijian",
        label: "累计研发投入（万元）",
        width: 200,
        checked: true //默认是否选择
      }
    ],
    //年报数据-产销量
    DetailCxl: [{
        prop: "zhuce.shoulihao",
        label: "药品名称",
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.name",
        label: "单位",
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.shenqingleixing_1",
        label: "销售类",
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.guifanjixing",
        label: "生产量",
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.yaopingleixing_1+zhuce.zhuceleixing",
        label: "库存量",
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.chengbanriqi",
        label: "销售量比上年增减(%)",
        width: 180,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.banlizhuangta",
        label: "生产量比上年增减(%)",
        width: 180,
        checked: true //默认是否选择
      },
      {
        prop: "zhuce.zhuangtaikaishishijian",
        label: "库存量比上年增减 (%)",
        width: 180,
        checked: true //默认是否选择
      }
    ],
    // 专利布局
    DetailZlbj1: [{
        prop: "shoulihao",
        label: "公开(公告)号",
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "申请号",
        checked: true //默认是否选择
      },
      {
        prop: "shenqingleixing_1",
        label: "专利名称",
        checked: true //默认是否选择
      },
      {
        prop: "zhuceleixing",
        label: "专利类型",
        checked: true //默认是否选择
      },
      {
        prop: "chengbanriqi",
        label: "法律状态",
        checked: true //默认是否选择
      },
      {
        prop: "qiyemingcheng",
        label: "公开(公告日)",
        checked: true //默认是否选择
      },
      {
        prop: "banlizhuangta",
        label: "预估到期日",
        checked: true //默认是否选择
      }
    ],
    DetailZlbj2: [{
        prop: "zhengshubianhao",
        label: "证书编号",
        checked: true //默认是否选择
      },
      {
        prop: "renzhengfanwei",
        label: "认证范围",
        checked: true //默认是否选择
      },
      {
        prop: "gmpbanben",
        label: "认证版本",
        checked: true //默认是否选择
      },
      {
        prop: "fazhengriqi",
        label: "发证日期",
        checked: true //默认是否选择
      },
      {
        prop: "jiezhiriqi",
        label: "有效期截止日",
        checked: true //默认是否选择
      }
    ],
    DetailZlbj3: [{
        prop: "no",
        label: "备案编号",
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "备案类型",
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "通用名(拟评价)",
        checked: true //默认是否选择
      },
      {
        prop: "form",
        label: "剂型(拟评价)",
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "规格(拟评价)",
        checked: true //默认是否选择
      },
      {
        prop: "name2",
        label: "通用名(拟参比)",
        checked: true //默认是否选择
      },
      {
        prop: "form2",
        label: "剂型(拟参比)",
        checked: true //默认是否选择
      },
      {
        prop: "strength2",
        label: "规格(拟参比)",
        checked: true //默认是否选择
      },
      // {
      //   prop: "number",
      //   label: "289目录品种",
      //   checked: true //默认是否选择
      // },
      {
        prop: "holder",
        label: "持证商",
        checked: true //默认是否选择
      },
      {
        prop: "company2",
        label: "生产厂/产地",
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "备案时间",
        checked: true //默认是否选择
      }
    ],
    DetailYpsx1: [{
        prop: "shangpinming",
        label: "商品名",
        checked: true //默认是否选择
      },
      {
        prop: "tongyongming",
        label: "通用名",
        checked: true //默认是否选择
      },
      {
        prop: "cntongyongming",
        label: "通用名（中文）",
        checked: true //默认是否选择
      },
      {
        prop: "xiaoshoue",
        label: "销售额（万元/RMB）",
        checked: true //默认是否选择
      },
      {
        prop: "nianfen",
        label: "年份",
        checked: true //默认是否选择
      }
    ],
    DetailYpsx2: [{
        prop: "yaopinmingcheng",
        label: "药品名称",
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        checked: true //默认是否选择
      },
      {
        prop: "xiaoliang",
        label: "销量",
        checked: true //默认是否选择
      },
      {
        prop: "danwei",
        label: "单位",
        checked: true //默认是否选择
      },
      {
        prop: "pihao",
        label: "批号",
        checked: true //默认是否选择
      },
      {
        prop: "qianfariqi",
        label: "签发日期",
        checked: true //默认是否选择
      },
      {
        prop: "youxiaoqi",
        label: "有效期",
        checked: true //默认是否选择
      }
    ]
  },
  orange: {
    america: [{
        prop: "appl_no",
        label: "申请号",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "product_no",
        label: "产品号",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "trade_name",
        label: "商品名",
        width: 150, //最少宽度
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "中文活性成分",
        width: 120, //最少宽度
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "ingredient",
        label: "活性成分",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "df_route",
        label: "剂型/给药途径",
        sort: "custom", //是否排序
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "规格/剂量",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "applicant",
        label: "申请机构",
        width: 120, //最少宽度
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "pzendtime",
        label: "批准截止时间",
        width: 120, //最少宽度
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "rld",
        label: "参比制剂",
        width: 130, //最少宽度
        sort: "custom", //是否排序
        checked: true, //默认是否选择
        tips: true //表头后面是否有提示
      },
      {
        prop: "rs",
        label: "标准制剂",
        width: 120, //最少宽度
        checked: true, //默认是否选择
        tips: true //表头后面是否有提示
      },
      {
        prop: "type",
        label: "市场状态",
        checked: true //默认是否选择
      },
      {
        prop: "te_code",
        label: "TE",
        sort: "custom", //是否排序
        checked: true, //默认是否选择
        tips: true //表头后面是否有提示
      }
    ],
    FdaProductsDetail1: [{
        prop: "appl_no",
        label: "申请号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "product_no",
        label: "产品号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "patent_no",
        label: "专利号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuanliendtime",
        label: "专利到期日",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drug_substance_flag",
        label: "物质专利",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drug_product_flag",
        label: "产品专利",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "patent_use_code",
        label: "专利用途码",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "delist_flag",
        label: "专利撤销标识",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    FdaProductsDetail2: [{
        prop: "appl_no",
        label: "申请号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "product_no",
        label: "产品号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "exclusivity_code",
        label: "专营保护码",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "exclusivity_endtime",
        label: "专营保护到期日",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    FdaProductsDetail3: [{
        prop: "appl_no",
        label: "申请号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "product_no",
        label: "产品号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "patent_no",
        label: "专利号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "patent_expire_date_text",
        label: "专利到期日",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drug_substance_flag",
        label: "物质专利",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drug_product_flag",
        label: "产品专利",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "patent_use_code",
        label: "专利用途码",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    china: [{
        prop: "name",
        label: "药品名称",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jixing",
        label: "剂型",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "piwen",
        label: "批文数量",
        sort: "custom",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "活性成分",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ename",
        label: "活性成分(英文)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "rldf",
        label: "美国参比",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "rldj",
        label: "日本参比",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "originalc",
        label: "本剂型原研",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }
      // ,{
      //   prop: "bigdata_analy",
      //   label: "大数据分析",
      //   width: 100,   //最少宽度
      //   checked: true //默认是否选择
      // }
    ],
    chinaDetail1: [{
        prop: "name",
        label: "药品名称",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "bcs",
        label: "BCS分类",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "tradename",
        label: "商标名",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "file",
        label: "文件",
        width: 200, //最少宽度
        checked: true //默认是否选择
      }
    ],
    chinaDetail2: [{
        prop: "drug",
        label: "药品名称",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "bcs",
        label: "BCS分类",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "规格",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "file",
        label: "文件",
        width: 200, //最少宽度
        checked: true //默认是否选择
      }
    ],
    chinaDetail3: [{
        prop: "no",
        label: "序号",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品通用名",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ename",
        label: "英文名称",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "tradename",
        label: "商标名",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "规格",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "form",
        label: "剂型",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company",
        label: "持证商",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "Remarks1",
        label: "备注",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    chinaDetail4: [{
        prop: "name",
        label: "药品名称",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "tradename",
        label: "商标名",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "药品规格",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company",
        label: "参比持有公司",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "country",
        label: "参比上市国家",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }
    ],
    chinaDetail5: [{
        prop: "no",
        label: "备案编号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company",
        label: "申请公司",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "类别",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "通用名(拟评价)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength",
        label: "规格(拟评价)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name2",
        label: "通用名(拟参比)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "strength2",
        label: "规格(拟参比)",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "holder",
        label: "持证商",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company2",
        label: "生产厂/产地",
        width: 140, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  yaowuhecheng: {
    ywfzk: [{
        prop: "enden",
        label: "原料药编号",
        width: 110, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "inn",
        label: "药物名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "hxm",
        label: "化学名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "casn",
        label: "CAS登记号",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "fzs",
        label: "原料药分子式",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "lxs",
        label: "合成路线数",
        sort: "custom",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "more",
        label: "合成路线挖掘",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    fzk1: [{
        prop: "en",
        label: "分子编号",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "pinm",
        label: "品名",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "casn",
        label: "CAS号",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "fzs",
        label: "分子式",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "more",
        label: "合成路线挖掘",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  cfdadrug: {
    //中国上市药品数据库-表头
    Detailcfdadrug: [{
        prop: "pizhunwenhao",
        label: "批准文号/注册证号",
        width: 110, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        tips: true,
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shengchanqiye",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "tpz",
        label: "同品种数（同品规数）",
        tips: true,
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "批准日期",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "mah",
        label: "上市许可持有人",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "shiyingzheng",
        label: "适应症",
        width: 180, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "gdcf",
        label: "过度重复品种",
        width: 180, //最少宽度
        tips: true,
        checked: false //默认是否选择
      },
      {
        prop: "wftjcbzj",
        label: "无需开展一致性评价品种",
        width: 200, //最少宽度
        tips: true,
        checked: false //默认是否选择
      }
    ],
    nameExpand: [{
        prop: "pizhunwenhao",
        label: "批准文号/注册证号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "mah",
        label: "上市许可持有人",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shengchanqiye",
        label: "生产单位",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "药品类别",
        width: 70, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "authorizationday",
        label: "批准日期",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    nameExpandTwo: [{
        prop: "shengchanqiye",
        label: "生产单位",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "pizhunwenhao",
        label: "批准文号/注册证号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "mah",
        label: "上市许可持有人",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "药品类别",
        width: 70, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "authorizationday",
        label: "批准日期",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    qyExpand: [{
        prop: "pizhunwenhao",
        label: "批准文号/注册证号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "mah",
        label: "上市许可持有人",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shengchanqiye",
        label: "生产单位",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "药品类别",
        width: 70, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "authorizationday",
        label: "批准日期",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    qyExpandTwo: [{
        prop: "name",
        label: "药品名称",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "pizhunwenhao",
        label: "批准文号/注册证号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "mah",
        label: "上市许可持有人",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shengchanqiye",
        label: "生产单位",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "type",
        label: "药品类别",
        width: 70, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "authorizationday",
        label: "批准日期",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    //中国上市药品按药品浏览-表头
    chinatoname: [{
        prop: "name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "xianzhupiwenshu",
        sort: "custom",
        label: "注册批文数",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "xianzhuchangjiashu",
        label: "注册厂家数",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "lastpiwenshijian",
        label: "最新注册时间",
        sort: "custom",
        width: 120, //最少宽度
        checked: true, //默认是否选择
        tips: true //表头后面是否有提示
      }
      // {
      //   prop: "piwenshijian",
      //   label: "最早批文时间",
      //   sort: 'custom',
      //   width: 120,   //最少宽度
      //   checked: true //默认是否选择
      // }
    ],
    chinatoqiye: [{
        prop: "guifanqiye",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "xianzhupiwenshu",
        label: "注册批文数",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "xianzhuchepinzhongshu",
        label: "注册品种数",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "lastpiwenshijian",
        label: "最新注册时间",
        sort: "custom",
        width: 120, //最少宽度
        checked: true, //默认是否选择
        tips: true
      }
      // {
      //   prop: "piwenshijian",
      //   label: "最早批文时间",
      //   sort: 'custom',
      //   width: 120,   //最少宽度
      //   checked: true //默认是否选择
      // }
    ],
    //欧盟上市药品数据库-表头
    Detailepyp: [{
        prop: "name",
        label: "商品名",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "活性成分(中文)",
        width: 110, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "active",
        label: "活性成分(英文)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "atc",
        label: "ATC编码",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "批准日期",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "changshang",
        label: "上市许可持有人",
        width: 180, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "status",
        label: "市场状态",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zwform",
        label: "剂型",
        checked: false //默认是否选择
      }
    ],
    // 欧盟上市药品数据库-按活性成分浏览
    epypHxcf: [{
      prop: "ylbm",
      label: "活性成分(药智)",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cname",
      label: "活性成分(中文)",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "pizhun_count",
      label: "已批准数",
      sort: "custom",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cheshi_count",
      label: "已撤市数",
      sort: "custom",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "epypzhuce_count",
      label: "审评中",
      sort: "custom",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "holder_count",
      label: "上市许可持有人数",
      width: 150, //最少宽度
      sort: "custom",
      checked: true //默认是否选择
    }, {
      prop: "new_date",
      label: "最新批准日期",
      width: 120, //最少宽度
      sort: "custom",
      checked: true //默认是否选择
    }, {
      prop: "old_date",
      label: "最早批准日期",
      sort: "custom",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }],
    // 欧盟上市药品数据库-按活性成分浏览-二级列表
    epypHxcfExpand: [{
      prop: "changshang",
      label: "上市许可持有人",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "num",
      label: "产品编号",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "name",
      label: "商品名称",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "active",
      label: "活性成分(英文)",
      width: 130, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "ylbm",
      label: "活性成分(药智)",
      width: 130, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cname",
      label: "活性成分(中文)",
      width: 130, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "atc",
      label: "ATC编码",
      width: 130, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "date",
      label: "批准日期",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "zwstatus",
      label: "市场状态",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }],

    // 欧盟上市药品数据库-按活性成分浏览-审评中字段点击展开的二级列表内容
    epypHxcfSpz: [{
      prop: "commonname",
      label: "通用名称",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cname",
      label: "中文名称",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "type",
      label: "药品类型",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "acceleration",
      label: "加速审评",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "orphan",
      label: "孤儿药",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "generic",
      label: "仿制药",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "evaluationdate",
      label: "审评起始日期",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "therapeuticarea",
      label: "治疗领域",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, ],
    // 欧盟上市药品-按上市许可持有人浏览
    holder: [{
      prop: "changshang",
      label: "上市许可持有人",
      width: 200, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "pizhun_count",
      label: "已获批品种数(总数)",
      sort: "custom",
      width: 150, //最少宽度
      checked: true, //默认是否选择
      tips: true
    }, {
      prop: "cheshi_count",
      label: "已撤市品种数(总数)",
      sort: "custom",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "new_date",
      label: "最新批准品种日期",
      sort: "custom",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "old_date",
      label: "最早批准品种日期",
      width: 150, //最少宽度
      sort: "custom",
      checked: true //默认是否选择
    }],
    // 欧盟上市药品数据库-按上市许可持有人浏览-二级列表
    holderExpand: [{
        prop: "num",
        label: "产品编号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "name",
        label: "商品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "active",
        label: "活性成分(英文)",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "ylbm",
      //   label: "活性成分(药智)",
      //   width: 130, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "cname",
        label: "活性成分(中文)",
        width: 130, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "atc",
        label: "ATC编码",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "date",
        label: "批准日期",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "changshang",
        label: "上市许可持有人",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "zwstatus",
        label: "市场状态",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 欧盟上市-正在审评
    epypzhuce: [{
      prop: "commonname",
      label: "通用名称",
      width: 220, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cname",
      label: "中文名称",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "type",
      label: "药品类型",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "acceleration",
      label: "加速审评",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "orphan",
      label: "孤儿药",
      width: 70, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "generic",
      label: "仿制药",
      width: 70, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "evaluationdate",
      label: "审评起始日期",
      width: 120, //最少宽度
      sort: "custom",
      checked: true //默认是否选择
    }, {
      prop: "therapeuticarea",
      label: "治疗领域",
      width: 220, //最少宽度
      checked: true //默认是否选择
    }],
    //美国上市药品数据库-表头
    Detailfdadrug: [{
        prop: "applno",
        label: "申请号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "appltype",
        label: "申请类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drugname",
        label: "商品名",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "activeingredient",
        label: "活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "中文活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "form",
        label: "剂型/给药途径",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionstatusdate",
        label: "批准日期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sponsorname",
        label: "申请机构",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      }
    ],
    //美国上市详情页面药品信息的表格
    Detailfdadrugxq: [{
        prop: "strength",
        label: "规格/剂量",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "route",
        label: "剂型/给药途径",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "marketingstatusid",
        label: "市场状态",
        tips: true,
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "referencedrug",
        label: "参比制剂",
        tips: true,
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "referencestandard",
        label: "参比标准",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "tecode",
        label: "等效性代码",
        tips: true,
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "patent",
        label: "橙皮书信息",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    //美国上市详情页面原始申请的表格
    Detailyssq: [{
        prop: "submissionstatusdate",
        label: "提交状态日期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissiontype",
        label: "提交类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionstatus",
        label: "审批类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionclasscode",
        label: "提交分类",
        tips: true,
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "reviewpriority",
        label: "审批分类",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "applicationdocsurl",
        label: "标签/说明书等",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    //美国上市详情页面审批历史的表格
    Detailspls: [{
        prop: "submissionstatusdate",
        label: "提交状态日期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissiontype",
        label: "提交类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionno",
        label: "提交编号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionclasscode",
        label: "变更分类",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "applicationdocsurl",
        label: "标签/说明书等",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    Detailndc: [{
        prop: "productndc",
        label: "NDC号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "proprietaryname",
        label: "商品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "nonproprietaryname",
        label: "通用名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "dosageformname",
        label: "剂型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "routename",
        label: "给药途径",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "startmarketingdate",
        label: "批准时间",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "labelername",
        label: "申请机构",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    Detailequivalent: [{
        prop: "drugname",
        label: "商品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "applno",
        label: "申请号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sponsorname",
        label: "申请机构",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionstatusdate1",
        label: "批准日期",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    //日本上市药品数据库-表头
    Detailpmda: [{
        prop: "approvalnumber",
        label: "批准号",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "tname",
        label: "商品名称(日文)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "活性成分(日文)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jan",
        label: "活性成分(英文)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "活性成分(中文)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "company",
        label: "制造商与经销商",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "上市时间",
        sort: "custom",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "producttypename",
        label: "药效分类",
        width: 80, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shuoming",
        label: "ATC分类",
        width: 90, //最少宽度
        checked: true, //默认是否选择
        tips: true
      },
      {
        prop: "zwform",
        label: "剂型",
        width: 80, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "pdf_url",
        label: "说明书",
        width: 70, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "if_url",
        label: "IF文件(综述资料)",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  epyp: {
    main: [{
        prop: "huoxingchengfen",
        label: "活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "中文名称",
        width: 150,
        checked: true
      },
      {
        prop: "enname",
        label: "商品名",
        width: 150,
        checked: true
      },
      {
        prop: "atcbianma",
        label: "ATC编码",
        width: 100,
        checked: true
      },
      {
        prop: "pizhunriqi",
        label: "批准日期",
        width: 100,
        checked: true
      },
      {
        prop: "chiyouren",
        label: "上市许可持有人",
        width: 100,
        checked: true
      },
      {
        prop: "state",
        label: "市场状态",
        width: 100,
        checked: true
      }
    ]
  },
  yaopinzhongbiao: {
    slh: [{
        prop: "name",
        label: "药品通用名",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zwylbm",
        label: "活性成分",
        sort: false, //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "jixing",
        label: "剂型",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanguige",
        label: "规格",
        sort: false, //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "baozhuanguige2",
        label: "包装转换比",
        sort: false, //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "packaging",
        label: "单位",
        sort: false, //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "feiyong",
        label: "中标价",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "feiyong_uint",
        label: "最小制剂单位价格",
        width: 180, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "qlevel",
        label: "质量层次",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "shengchanqiye",
        label: "生产企业",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "approvaldate",
        label: "发布时间",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "first",
        label: "中标地区",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "bidder",
        label: "投标企业",
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "remarks2",
        label: "备注",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "source",
        label: "来源文件",
        sort: false, //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "yibao",
        label: "医保药品",
        width: 100, //最少宽度
        checked: true, //默认是否选择
        hide: true // 显示选择影藏此字段
      },
      {
        prop: "jiyao",
        label: "基药",
        width: 100, //最少宽度
        checked: true, //默认是否选择
        hide: true
      }
    ],
    ypmc: [{
        prop: "guifanname",
        label: "药品规范名",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "count_zhongbiao",
        label: "中标数量",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "count_guifanjixing",
        label: "剂型数量",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "count_guifanguige",
        label: "规格数量",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "count_guifanqiye",
        label: "中标企业数量",
        // sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "count_first",
        label: "中标地区数量",
        // sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "max_feiyong",
        label: "最高中标价(元)",
        // sort: "custom",
        width: 110,
        checked: true
      },
      {
        prop: "min_feiyong",
        label: "最低中标价(元)",
        // sort: "custom",
        width: 110,
        checked: true
      },
      {
        prop: "ypfx",
        label: "药品分析",
        sort: false,
        width: 70,
        checked: true
      }
    ],
    ypmcExpand: [{
        prop: "name",
        label: "药品通用名",
        sort: "custom",
        width: 180
      },
      {
        prop: "jixing",
        label: "剂型",
        sort: "custom",
        width: 180
      },
      {
        prop: "guifanguige",
        label: "规格",
        sort: "custom",
        width: 100
      },
      {
        prop: "baozhuanguige2",
        label: "包装转换比",
        width: 100
      },
      {
        prop: "packaging",
        label: "单位",
        sort: "custom",
        width: 100
      },
      {
        prop: "feiyong",
        label: "中标价",
        sort: "custom",
        width: 100
      },
      {
        prop: "shengchanqiye",
        label: "生产企业",
        sort: "custom",
        width: 180
      },
      {
        prop: "approvaldate",
        label: "发布时间",
        sort: "custom",
        width: 120
      },
      {
        prop: "first",
        label: "中标地区",
        sort: "custom",
        width: 120
      },
      {
        prop: "bidder",
        label: "投标企业",
        sort: "custom",
        width: 120
      },
      {
        prop: "remarks2",
        label: "备注",
        width: 120
      },
      {
        prop: "source",
        label: "来源文件",
        width: 120
      }
      // {
      //   prop:"zscp",
      //   label:"招商产品",
      //   width:120,
      // }
    ],
    qy: [{
        prop: "guifanqiyezhongbiao",
        label: "企业规范名",
        sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "count_zhongbiao",
        label: "中标数量",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "count_name",
        label: "药品数量",
        width: 70,
        // sort: "custom",
        checked: true
      },
      {
        prop: "count_guifanjixing",
        label: "剂型数量",
        // sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "count_guifanguige",
        label: "规格数量",
        //sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "count_first",
        label: "中标地区数量",
        //sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "max_feiyong",
        label: "最高中标价(元)",
        //sort: "custom",
        width: 110,
        checked: true
      },
      {
        prop: "min_feiyong",
        label: "最低中标价(元)",
        //sort: "custom",
        width: 110,
        checked: true
      },
      {
        prop: "qyfx",
        label: "企业分析",
        width: 70,
        checked: true
      },
      {
        prop: "zdsbpz",
        label: "最多申报品种",
        width: 100,
        okWidth: 210, //指定宽度
        checked: true
      }
    ],
    qyExpand: [{
        prop: "name",
        label: "药品通用名",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "jixing",
        label: "剂型",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "guifanguige",
        label: "规格",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "baozhuanguige2",
        label: "包装转换比",
        width: 100,
        checked: true
      },
      {
        prop: "packaging",
        label: "单位",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "feiyong",
        label: "中标价",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "shengchanqiye",
        label: "生产企业",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "approvaldate",
        label: "发布时间",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "first",
        label: "中标地区",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "bidder",
        label: "投标企业",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "remarks2",
        label: "备注",
        width: 100
      },
      {
        prop: "source",
        label: "来源文件",
        width: 100,
        checked: true
      }
      // {
      //   prop:"zscp",
      //   label:"招商产品",
      //   width:100,
      //   checked:true
      // }
    ]
  },
  tourongzi: {
    trz: [{
        prop: "type",
        label: "事件类型",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "receiver",
        label: "受资方",
        // sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "round",
        label: "轮次",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "money",
        label: "金额（万元）",
        sort: "custom", //是否排序
        // sort: true, //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "funders",
        label: "出资方",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "area",
        label: "发生地区",
        // sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "date",
        label: "事件时间",
        // sort: true, //是否排序
        sort: "custom", //是否排序
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "detail",
        label: "详情",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  qxss: {
    Detailqxss: [{
        prop: "name",
        label: "器械名称",
        width: 100,
        checked: true //默认是否选择
      },
      {
        prop: "zczbh",
        label: "注册证编号",
        width: 120,
        checked: true, //默认是否选择
        tips: true
      },
      {
        prop: "jgzc",
        label: "结构及组成/主要组成成分",
        width: 180,
        checked: false //默认是否选择
      },
      {
        prop: "xhgg",
        label: "型号规格",
        width: 120,
        checked: false //默认是否选择
      },
      {
        prop: "syfw",
        label: "适用范围/预期用途",
        width: 150,
        checked: false //默认是否选择
      },
      {
        prop: "zcrmc",
        label: "注册人名称",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "qiyeleixing",
        label: "国内上市企业",
        width: 120,
        checked: false //默认是否选择
      },
      {
        prop: "specificationcodescqy",
        label: "医保耗材代码数量",
        width: 120,
        checked: false //默认是否选择
      },
      {
        prop: "phone",
        label: "企业联系电话",
        width: 150,
        checked: false, //默认是否选择
        tips: true //表头后面是否有提示
      },
      {
        prop: "qiyeurl",
        label: "网址",
        width: 80,
        checked: false //默认是否选择
      },
      {
        prop: "pzrq",
        label: "批准日期",
        width: 120,
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "yxq",
        label: "有效期至",
        width: 120,
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "bmdh",
        label: "编码代号",
        width: 100,
        checked: true //默认是否选择
      },
      {
        prop: "bmdh2018",
        label: "编码代号2018版",
        width: 150,
        checked: true //默认是否选择
      },
      {
        prop: "gllb",
        label: "管理类别",
        width: 120,
        checked: true, //默认是否选择
        tips: true
      },
      {
        prop: "sf",
        label: "批准省份",
        width: 100,
        checked: true //默认是否选择
      }
    ]
  },
  qxba: {
    Detailqxba: [{
        prop: "name",
        label: "器械名称",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "bah",
        label: "备案号",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "ggxh",
        label: "型号规格",
        width: 120,
        checked: false //默认是否选择
      },
      {
        prop: "cf",
        label: "产品描述",
        width: 120,
        checked: false //默认是否选择
      },
      {
        prop: "yqyt",
        label: "预期用途",
        width: 120,
        checked: false //默认是否选择
      },
      {
        prop: "barmc",
        label: "备案人名称",
        width: 150,
        checked: true, //默认是否选择
        tips: true
      },
      {
        prop: "dlr",
        label: "代理人名称",
        width: 150,
        checked: true, //默认是否选择
        tips: true
      },
      {
        prop: "phone",
        label: "企业联系电话",
        width: 150,
        checked: false, //默认是否选择
        tips: true //表头后面是否有提示
      },
      {
        prop: "qiyeurl",
        label: "网址",
        width: 80,
        checked: false //默认是否选择
      },
      // {
      //   prop: "me_cplb",
      //   label: "产品类别",
      //   sort: "custom", //是否排序
      //   checked: true //默认是否选择
      // },
      {
        prop: "barq",
        label: "备案日期",
        width: 120,
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "balx",
        label: "备案类型",
        width: 120,
        checked: true //默认是否选择
      },
      {
        prop: "sf",
        label: "省份",
        width: 80,
        checked: true //默认是否选择
      }
    ]
  },
  yaopinxiaoshou: {
    xsnf: [{
        prop: "brandname",
        label: "商品名",
        sort: "custom", //是否排序
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "通用名",
        sort: "custom",
        checked: true
      },
      {
        prop: "cname",
        label: "通用名(中文)",
        sort: "custom",
        checked: true
      },
      {
        prop: "shuoming",
        label: "ATC分类",
        checked: true,
        tips: true
      },
      {
        prop: "company",
        label: "生产企业",
        sort: "custom",
        checked: true,
        tips: true
      },
      {
        prop: "value",
        label: "销售额(万元/RMB)",
        width: 180,
        sort: "custom",
        checked: true,
        tips: true
      },
      {
        prop: "oldvalue",
        label: "销售额(原始)",
        checked: true,
        tips: true
      },
      {
        prop: "oldunit",
        label: "货币单位(原始)",
        checked: true,
        tips: true
      },
      {
        prop: "year",
        label: "年份",
        sort: "custom",
        checked: true
      },
      {
        prop: "targets",
        label: "靶点",
        sort: "custom",
        checked: false
      }
    ],
    ypmc: [{
        prop: "name",
        label: "药品通用名",
        sort: "custom",
        checked: true,
        width: "100px"
        // okWidth:'25%'
      },
      {
        prop: "cname",
        label: "通用名(中文)",
        sort: "custom",
        checked: true
        // okWidth:'25%'
      },
      {
        prop: "sp_count",
        label: "商品品种",
        checked: true,
        // sort: "custom",
        okWidth: "150"
      },
      {
        prop: "atc_count",
        label: "治疗领域",
        checked: true,
        // sort: "custom",
        okWidth: "150"
      },
      {
        prop: "qy_count",
        label: "生产企业",
        // sort: "custom",
        checked: true,
        okWidth: "150"
      },
      {
        prop: "yaopinfenxi",
        label: "药品分析",
        checked: true,
        okWidth: "120"
      }
    ],
    ypmcExpand: [{
        prop: "brandname",
        label: "商品名",
        sort: "custom"
      },
      {
        prop: "atc",
        label: "治疗领域",
        sort: "custom"
      },
      {
        prop: "company",
        label: "生产企业",
        sort: "custom"
      },
      {
        prop: "unit",
        width: 150,
        label: "销售单位"
      }
    ],
    qy: [{
        prop: "company",
        label: "生产企业",
        sort: "custom",
        checked: true,
        okWidth: "450px"
      },
      {
        prop: "sp_count",
        label: "商品品种",
        // sort: "custom",
        checked: true
        // okWidth:'80'
      },
      {
        prop: "atc_count",
        label: "治疗领域",
        // sort: "custom",
        checked: true
        // okWidth:'80'
      },
      {
        prop: "qiyefenxi",
        label: "企业分析",
        checked: true
      }
    ],
    qyExpand: [{
        prop: "brandname",
        label: "商品名",
        sort: "custom"
      },
      {
        prop: "name",
        label: "通用名",
        sort: "custom"
      },
      {
        prop: "atc",
        label: "治疗领域",
        sort: "custom"
      },
      {
        prop: "unit",
        width: 150,
        label: "销售单位"
      }
    ]
  },
  shengwuzhipin: {
    slh: [{
        prop: "pihao",
        label: "批号",
        width: 100, //最少宽度
        checked: true, //默认是否选择
        okWidth: "120px"
      },
      {
        prop: "name",
        label: "检品名称",
        // sort: "custom", //是否排序
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "piliang",
        label: "销量",
        sort: "custom", //是否排序
        width: 80, //最少宽度
        checked: true, //默认是否选择
        okWidth: "100px"
      },
      {
        prop: "packaging",
        label: "单位",
        width: 60, //最少宽度
        checked: true, //默认是否选择
        okWidth: "80px"
      },
      {
        prop: "qiye",
        label: "生产企业",
        // sort: "custom", //是否排序
        width: 120, //最少宽度
        checked: true //默认是否选择
        // ,okWidth:'150px'
      },
      {
        prop: "date",
        label: "签发日期",
        sort: "custom", //是否排序
        width: 90, //最少宽度
        checked: true, //默认是否选择
        okWidth: "130px"
      },
      {
        prop: "youxiaoqi",
        label: "有效期",
        sort: "custom", //是否排序
        width: 90, //最少宽度
        checked: true, //默认是否选择
        okWidth: "130px"
      },
      {
        prop: "qfzh",
        label: "签发证号",
        width: 110, //最少宽度
        checked: true //默认是否选择
      }
    ],
    ypmc: [{
        prop: "name",
        label: "检品名称",
        // sort: "custom",
        width: 200,
        checked: true
      },
      {
        prop: "piliang",
        label: "销售总量",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "guige",
        label: "检品规格",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "qiye",
        label: "生产企业",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "xsmx",
        label: "销售明细",
        width: 100,
        checked: true
      },
      {
        prop: "ypfx",
        label: "药品分析",
        width: 100,
        checked: true
      }
    ],
    ypmcExpand: [{
        prop: "pihao",
        label: "批号",
        width: 180
      },
      {
        prop: "guige",
        label: "规格",
        width: 60
      },
      {
        prop: "piliang",
        label: "销量",
        sort: "custom",
        width: 100
      },
      {
        prop: "packaging",
        label: "单位",
        width: 100
      },
      {
        prop: "caijiqiye",
        label: "生产企业",
        // sort: "custom",
        width: 190
      },
      {
        prop: "date",
        label: "签发日期",
        // sort: "custom",
        width: 100
      },
      {
        prop: "youxiaoqi",
        label: "有效期",
        // sort: "custom",
        width: 180
      }
    ],
    qy: [{
        prop: "qiye",
        label: "生产企业",
        // sort: "custom",
        width: 200,
        checked: true
      },
      {
        prop: "piliang",
        label: "销售总量",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "name",
        label: "检品数量",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "xsmx",
        label: "销售明细",
        width: 100,
        checked: true
      },
      {
        prop: "qyfx",
        label: "企业分析",
        width: 100,
        checked: true
      }
    ],
    qyExpand: [{
        prop: "pihao",
        label: "批号",
        width: 100,
        checked: true
      },
      {
        prop: "name",
        label: "检品名称",
        // sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "guige",
        label: "规格",
        width: 100,
        checked: true
      },
      {
        prop: "piliang",
        label: "销量",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "packaging",
        label: "单位",
        width: 100,
        checked: true
      },
      {
        prop: "date",
        label: "签发日期",
        sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "youxiaoqi",
        label: "有效期",
        sort: "custom",
        width: 100,
        checked: true
      }
    ]
  },
  usercenter: {
    // 订阅条件
    dytj: [{
        prop: "dingyueshujuku",
        label: "订阅数据库",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "dingyuefenlei",
        label: "订阅分类",
        width: 90,
        checked: true
      },
      {
        prop: "guanjianzi",
        label: "关键字",
        width: 185,
        checked: true
      },
      {
        prop: "jieshoupinlv",
        label: "接收频率",
        width: 120,
        checked: true
      },
      {
        prop: "jieshoufangshi",
        label: "接收方式",
        width: 170,
        checked: true
      },
      {
        prop: "dingyueshijian",
        label: "订阅时间",
        width: 170,
        checked: true
      },
      {
        prop: "caozuo",
        label: "操作",
        width: 100,
        checked: true
      }
    ],
    // 收藏的数据库
    sc_sjk: [{
        prop: "shujukumingcheng",
        label: "数据库名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shujuliang",
        label: "数据量",
        width: 90,
        checked: true
      },
      {
        prop: "zuijingengxinshijian",
        label: "最近更新时间",
        width: 185,
        checked: true
      },
      {
        prop: "shoucangshijian",
        label: "收藏时间",
        width: 120,
        checked: true
      },
      {
        prop: "caozuo",
        label: "操作",
        width: 100,
        checked: true
      }
    ],
    // 收藏的页面
    sc_ym: [{
        prop: "biaoti",
        label: "标题",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shoucangshijian",
        label: "收藏时间",
        width: 120,
        checked: true
      },
      {
        prop: "caozuo",
        label: "操作",
        width: 100,
        checked: true
      }
    ],
    // 收藏的企业
    sc_qy: [{
        prop: "qiyemingcheng",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shoucangshijian",
        label: "收藏时间",
        width: 120,
        checked: true
      },
      {
        prop: "caozuo",
        label: "操作",
        width: 100,
        checked: true
      }
    ],
    // 搜索记录 - 保存的条件
    hs_saved: [{
        prop: "wherename",
        label: "检索条件",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "dbname",
        label: "数据库",
        width: 120,
        checked: true
      },
      {
        prop: "addtime",
        label: "保存日期",
        width: 120,
        checked: true
      },
      {
        prop: "caozuo",
        label: "操作",
        width: 100,
        checked: true
      }
    ],
    // 建议反馈 - 我的反馈
    my_suggest: [{
        prop: "fankuineirong",
        label: "反馈内容",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "fankuiriqi",
        label: "反馈日期",
        width: 150,
        checked: true
      },
      {
        prop: "zhuangtai",
        label: "状态",
        width: 100,
        checked: true
      },
      {
        prop: "caozuo",
        label: "操作",
        width: 100,
        checked: true
      }
    ]
  },
  qxzhuce: {
    list: [{
        prop: "slh",
        label: "受理号",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "器械名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sqlx",
        label: "申请类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sqqy",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "fysdr",
        sort: "custom",
        label: "费用收到日",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "spzt",
        label: "CMDE审评状态",
        width: 155, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "blzt",
        label: "审批状态",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ztkssj",
        sort: "custom",
        label: "审批状态开始时间",
        width: 170, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "spjl",
        label: "审批结论",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  yzx: {
    pw: [{
        prop: "pizhunwenhao",
        label: "批准文号",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "药品名称",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "qiye",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "chenbanriqi",
        sort: "custom",
        label: "申报时间",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "enddate",
        sort: "custom",
        label: "通过时间",
        width: 90, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "pwjd",
        label: "当前进度",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "be",
        sort: "custom",
        label: "BE试验时间",
        width: 130, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "bebeian",
        sort: "custom",
        label: "BE备案时间",
        width: 130, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "rldbeian",
        sort: "custom",
        label: "参比备案时间",
        width: 130, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "targets",
        sort: "custom",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "dailiangcaigou",
        label: "带量采购品种",
        width: 120, //最少宽度
        checked: false, //默认是否选择
        tips: true
      },
      {
        prop: "shuoming",
        label: "ATC分类",
        width: 100, //最少宽度
        checked: true, //默认是否选择
        tips: true
      }
    ],
    pz: [{
        prop: "name",
        label: "药品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "pizhunwenhao",
        sort: "custom",
        label: "批文数量",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guige",
        label: "规格数量",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "qiye",
        label: "企业数量",
        sort: "custom",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "yzxtype",
        label: "通过/视同通过",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zgjd",
        label: "最高进度",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "xiangqing",
        label: "各企业进度",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    qy: [{
        prop: "qiye",
        label: "企业名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "pizhunwenhao",
        sort: "custom",
        label: "批文数量",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name",
        label: "品种数量",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "yzxtype",
        label: "通过/视同通过",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "xiangqing",
        label: "各品种进度",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  structural: [{
      prop: "str_image",
      label: "结构式",
      width: 200, //最少宽度
      checked: true //默认是否选择
    },
    {
      prop: "CAS",
      label: "CAS号",
      width: 200, //最少宽度
      checked: true //默认是否选择
    },
    {
      prop: "COMPOUND_SUMMARY",
      label: "药物名称",
      width: 200, //最少宽度
      checked: true //默认是否选择
    },
    {
      prop: "MOLECULAR_FORMULA",
      label: "分子式",
      width: 200, //最少宽度
      checked: true //默认是否选择
    },
    {
      prop: "ID",
      label: "详情查看",
      width: 200, //最少宽度
      checked: true //默认是否选择
    }
  ],
  yyxs: {
    year: [{
        prop: "guifanname",
        label: "药品名称",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanguige",
        label: "规格",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "zhuangliang2",
        label: "装量",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanqiye",
        label: "生产企业",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sale",
        sort: "custom",
        label: "销售额(万元)",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "amount",
        sort: "salenum",
        label: "销售量(片/粒/袋/支)",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "year",
        sort: "custom",
        label: "年份",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "quarter",
        sort: "custom",
        label: "季度",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets",
        sort: "custom",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
    ],
    hxcf: [{
        prop: "zwylbm",
        label: "活性成分",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanname",
        label: "品种",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanqiye",
        label: "生产企业",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypfx",
        label: "药品分析",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    yptym: [{
        prop: "guifanname",
        label: "药品名称",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanguige",
        label: "规格",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanqiye",
        label: "生产企业",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "ypfx",
        label: "药品分析",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ],
    qy: [{
        prop: "guifanqiye",
        label: "生产企业",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "guifanname",
        label: "品种",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "qyfx",
        label: "企业分析",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  zcycf: {
    ls: [{
        prop: "name",
        label: "药品名称",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "source",
        label: "标准来源",
        sort: "custom",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "page",
        label: "页 码",
        sort: "custom",
        width: 60, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "chufangs",
        label: "处 方",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "",
        label: "处方溯源",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "down",
        label: "处方原文",
        width: 100, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  linchuangshiyan: {
    djh: [{
        prop: "me_id",
        label: "登记号",
        sort: "custom", //是否排序
        width: 120, //最少宽度
        okWidth: 160, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "title",
        label: "试验通俗题目",
        // sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "name_guifan",
        label: "药物名称",
        // sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "type",
        label: "药物类型",
        // sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: false
      },
      {
        prop: "indication",
        label: "适应症",
        // sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100,
        checked: false
      },
      {
        prop: "lhyy",
        label: "联合用药",
        width: 140,
        checked: false
      },
      {
        prop: "me_status",
        label: "试验状态",
        sort: "custom",
        width: 80,
        checked: true
      },
      {
        prop: "phase",
        label: "试验分期",
        sort: "custom",
        width: 120,
        checked: true
        // tips:true //表头后面是否有提示
      },
      {
        prop: "sort",
        label: "试验分类",
        width: 100,
        checked: false
      },
      {
        prop: "size",
        label: "目标入组人数",
        sort: "custom",
        width: 120,
        checked: false
      },
      {
        prop: "company",
        label: "申办者单位",
        // sort: "custom",
        width: 100,
        checked: true
      },
      {
        prop: "institutes",
        label: "试验机构",
        // sort: "custom",
        width: 80,
        checked: true
      },
      {
        prop: "date",
        label: "登记日期",
        sort: "custom",
        width: 80,
        okWidth: 130, //指定宽度
        checked: true
      },
      {
        prop: "start",
        label: "试验开始时间",
        sort: "custom",
        width: 80,
        okWidth: 150, //指定宽度
        checked: false
      },
      {
        prop: "end",
        label: "试验终止时间",
        width: 70,
        sort: "custom",
        okWidth: 130,
        checked: false
      },
      {
        prop: "sgzday",
        label: "最新状态日期",
        sort: "custom",
        width: 150,
        okWidth: 150,
        checked: true
      }
    ],
    ypmc: [{
        prop: "name_guifan",
        label: "药物名称",
        // sort: "custom",
        width: 150,
        checked: true
      },
      {
        prop: "count_djh",
        label: "登记总数",
        sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "count_qiyemingcheng",
        label: "申办者单位总数",
        width: 130,
        checked: true,
        sort: "custom"
      },
      {
        prop: "count_institutes",
        label: "试验机构总数",
        width: 110,
        checked: true,
        sort: "custom"
      },
      {
        prop: "me_statusint3",
        label: "尚未开始",
        sort: "custom",
        width: 80,
        checked: true
      },
      {
        prop: "me_statusint1",
        label: "进行中",
        sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "me_statusint2",
        label: "已完成",
        sort: "custom",
        width: 70,
        checked: true
      },
      {
        prop: "me_statusint4",
        label: "暂停或中断",
        sort: "custom",
        width: 100,
        checked: true
      }
    ],
    ypmcExpand: [{
        prop: "me_id",
        label: "登记号",
        width: 150,
        okWidth: 200 //指定宽度
      },
      {
        prop: "title",
        label: "试验通俗题目",
        width: 300
      },
      {
        prop: "company",
        label: "申办者单位",
        width: 150
      },
      {
        prop: "me_status",
        label: "试验状态",
        width: 80
      },
      {
        prop: "phase",
        label: "试验分期",
        width: 80
      },
      {
        prop: "institutes",
        label: "试验机构",
        width: 150
      },
      {
        prop: "date",
        label: "登记日期",
        okWidth: 120 //指定宽度
      },
      {
        prop: "sgzday",
        label: "最新状态日期",
        okWidth: 140 //指定宽度
      }
    ],
    qy: [{
        prop: "qiyemingcheng",
        label: "申办单位",
        // sort: "custom",
        width: 150,
        checked: true
        // tips:true //表头后面是否有提示
      },
      {
        prop: "count_djh",
        label: "登记总数",
        sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "count_name",
        label: `药品数量`,
        sort: "custom",
        width: 90,
        checked: true
        // tips:true //表头后面是否有提示
      },
      {
        prop: "count_institutes",
        label: "试验机构总数",
        width: 120,
        checked: true,
        sort: "custom"
      },
      {
        prop: "me_statusint3",
        label: "尚未开始",
        sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "me_statusint1",
        label: "进行中",
        sort: "custom",
        width: 80,
        checked: true
      },
      {
        prop: "me_statusint2",
        label: "已完成",
        width: 80,
        checked: true,
        sort: "custom"
      },
      {
        prop: "me_statusint4",
        label: "暂停或中断",
        sort: "custom",
        width: 100,
        checked: true
      }
    ],
    qyExpand: [{
        prop: "me_id",
        label: "登记号",
        width: 120,
        okWidth: 200 //指定宽度
      },
      {
        prop: "title",
        label: "试验通俗题目",
        width: 300
      },
      {
        prop: "name_guifan",
        label: "药物名称",
        width: 150
      },
      {
        prop: "me_status",
        label: "试验状态",
        width: 80
      },
      {
        prop: "phase",
        label: "试验分期",
        width: 80
      },
      {
        prop: "institutes",
        label: "试验机构",
        width: 150
      },
      {
        prop: "date",
        label: "登记日期",
        okWidth: 120 //指定宽度
      },
      {
        prop: "sgzday",
        label: "最新状态日期",
        okWidth: 140 //指定宽度
      }
    ],
    syjg: [{
        prop: "institutes_guifan",
        label: "试验机构",
        width: 150,
        checked: true
      },
      {
        prop: "count_djh",
        label: "登记总数",
        sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "count_name",
        label: `药品数量`,
        sort: "custom",
        width: 90,
        checked: true
        // tips:true //表头后面是否有提示
      },
      {
        prop: "count_qiyemingcheng",
        label: "申办者单位总数",
        width: 130,
        checked: true,
        sort: "custom"
      },
      {
        prop: "me_statusint3",
        label: "尚未开始",
        sort: "custom",
        width: 90,
        checked: true
      },
      {
        prop: "me_statusint1",
        label: "进行中",
        sort: "custom",
        width: 80,
        checked: true
      },
      {
        prop: "me_statusint2",
        label: "已完成",
        width: 80,
        checked: true,
        sort: "custom"
      },
      {
        prop: "me_statusint4",
        label: "暂停或中断",
        sort: "custom",
        width: 100,
        checked: true
      }
    ],
    syjgExpand: [{
        prop: "me_id",
        label: "登记号",
        width: 120,
        okWidth: 200 //指定宽度
      },
      {
        prop: "title",
        label: "试验通俗题目",
        width: 300
      },
      {
        prop: "name_guifan",
        label: "药物名称",
        width: 150
      },
      {
        prop: "me_status",
        label: "试验状态",
        width: 80
      },
      {
        prop: "phase",
        label: "试验分期",
        width: 80
      },
      {
        prop: "institutes",
        label: "申办者单位",
        width: 150
      },
      {
        prop: "date",
        label: "登记日期",
        okWidth: 120 //指定宽度
      },
      {
        prop: "sgzday",
        label: "最新状态日期",
        okWidth: 140 //指定宽度
      }
    ]
  },
  targetdatas: {
    bd: [{
        prop: "target",
        label: "靶点名称",
        width: 300, //最少宽度
        okWidth: 300, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "genename",
        label: "靶点简称",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "kind",
        label: "靶点类型",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "higheststatus",
        label: "最高研发阶段",
        sort: "custom",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_xgyw",
        label: "相关药物",
        sort: "custom",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_sbzs",
        label: "中国申报总数",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      // {
      //     prop: "count_sblc",
      //     label: "中国申报临床",
      //     sort: "custom",
      //     width: 150, //最少宽度
      //     okWidth: 150, //指定宽度
      //     checked: true //默认是否选择
      // },
      // {
      //     prop: "count_pzlc",
      //     label: "中国批准临床",
      //     sort: "custom",
      //     width: 150, //最少宽度
      //     okWidth: 150, //指定宽度
      //     checked: true //默认是否选择
      // },
      {
        prop: "count_lcsy",
        label: "中国临床",
        width: 150, //最少宽度
        sort: "custom",
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      // {
      //     prop: "count_zgss",
      //     label: "中国上市",
      //     width: 150, //最少宽度
      //     sort: "custom",
      //     okWidth: 150, //指定宽度
      //     checked: true //默认是否选择
      // },
      {
        prop: "count_qqlc",
        label: "全球临床",
        width: 150, //最少宽度
        sort: "custom",
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      // {
      //     prop: "count_sqss",
      //     label: "中国申请上市",
      //     sort: "custom",
      //     width: 150, //最少宽度
      //     okWidth: 150, //指定宽度
      //     checked: true //默认是否选择
      // },
      // {
      //     prop: "count_sspz",
      //     label: "中国上市批准",
      //     sort: "custom",
      //     width: 150, //最少宽度
      //     okWidth: 150, //指定宽度
      //     checked: true //默认是否选择
      // }
    ]
  },
  newdrug: {
    xy: [{
        prop: "name",
        label: "药物名称",
        width: 200, //最少宽度
        okWidth: 200, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "originatorcompany_02",
        label: "原研单位",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "othercompany",
        label: "研发公司",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "activeindications",
        label: "在研适应症",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets_abbr",
        label: "靶点名称",
        width: 100, //最少宽度
        checked: true, //默认是否选择
        tips: true //表头后面是否有提示
      },
      {
        prop: "higheststatus",
        label: "全球最高状态",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_zgsblc",
        label: "中国申报临床",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_zgpzblc",
        label: "中国批准临床",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_zglcsy",
        label: "中国临床试验",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_zgsqss",
        label: "中国申请上市",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "count_zgsspz",
        label: "中国上市批准",
        sort: "custom",
        width: 150, //最少宽度
        okWidth: 150, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "fistapproval",
        label: "首批上市时间",
        width: 170, //最少宽度
        okWidth: 170, //指定宽度
        checked: false //默认是否选择
      }
    ]
  },
  fdadrugnew: {
    sqh: [
      // hide: true // 显示选择影藏此字段
      {
        prop: "applno",
        label: "申请号",
        width: 180, //最少宽度
        okWidth: 180, //指定宽度
        checked: true //默认是否选择
      },
      {
        prop: "appltype",
        label: "申请类型",
        width: 100, //最少宽度
        checked: true, //默认是否选择
        tips: true
      },
      {
        prop: "drugname",
        label: "商品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "activeingredient",
        label: "活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "route",
        label: "剂型/给药途径",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionstatusdate1",
        label: "批准日期",
        sort: "custom",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sponsorname",
        label: "申请机构",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "ndc",
        label: "NDC号",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "marketingstatusid",
        label: "市场状态",
        width: 120, //最少宽度
        tips: true,
        checked: false //默认是否选择
      },
      {
        prop: "f505b2",
        label: "505b2",
        tips: true,
        width: 120, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "offexclusiity",
        label: "非排他性",
        tips: true,
        width: 120, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "acceleration",
        label: "加速批准",
        tips: true,
        width: 120, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "breakthroughtherapy",
        label: "突破性疗法",
        tips: true,
        width: 130, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "priority",
        label: "优先审评",
        tips: true,
        width: 120, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "fasttrack",
        label: "快速审批",
        tips: true,
        width: 120, //最少宽度
        checked: false //默认是否选择
      }
    ],
    sqhExpand: [{
      prop: "strength",
      label: "规格/剂量",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "route",
      label: "剂型/给药途径",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "marketingstatusid",
      label: "市场状态",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "referencedrug",
      label: "参比制剂",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "referencestandard",
      label: "参比标准",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }],
    tymc: [{
        prop: "activeingredient",
        label: "活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "cname",
        label: "中文名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "yishangshi_count",
        label: "已上市数",
        width: 90, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "yicheshi_count",
        label: "已撤市数",
        width: 90, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "zandingpizhun_count",
        label: "暂定批准数",
        width: 100, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "shenqingjigou_count",
        label: "申请机构数",
        width: 100, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "new_pizhun_date",
        label: "最新批准日期",
        width: 110, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "zuizao_pizhun_date",
        label: "最早批准日期",
        width: 150, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      }
    ],
    tymcExpand: [{
        prop: "applno",
        label: "申请号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "appltype",
        label: "申请类型",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drugname",
        label: "商品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "activeingredient",
        label: "活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "route",
        label: "剂型/给药途径",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionstatusdate1",
        label: "批准日期",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "sponsorname",
        label: "申请机构",
        width: 150, //最少宽度
        checked: true //默认是否选择
      }
    ],
    sqjg: [{
        prop: "sponsorname",
        label: "申请机构",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "shangshi_pinzhong_count",
        label: "上市品种数(总数)",
        width: 160, //最少宽度
        sort: "custom",
        tips: true,
        checked: true //默认是否选择
      },
      {
        prop: "cheshi_pinzhong_count",
        label: "撤市品种数(总数)",
        width: 140, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "zanding_pizhun_pinzhong_count",
        label: "暂定批准品种数(总数)",
        width: 165, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "orphan_drug_pinzhong_count",
        label: "孤儿药品种数(总数)",
        width: 155, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "new_pinzhong_pizhun_date",
        label: "最新品种批准日期",
        width: 145, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      },
      {
        prop: "zuizao_pinzhong_pizhun_date",
        label: "最早品种批准日期",
        width: 145, //最少宽度
        sort: "custom",
        checked: true //默认是否选择
      }
    ],
    sqjgExpand: [{
        prop: "activeingredient",
        label: "活性成分",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "applno",
        label: "申请号",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "appltype",
        label: "申请类型",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "drugname",
        label: "商品名称",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "route",
        label: "剂型/给药途径",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "submissionstatusdate1",
        label: "批准日期",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }
    ]
  },
  clinical: {
    qqlc: [{
        prop: "me_id",
        label: "登记号",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "title",
        label: "试验题目",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "name_guifan",
        label: "药物名称",
        width: 100, //最少宽度
        checked: false //默认是否选择
      },
      {
        prop: "conditions1_guifan",
        label: "疾病领域",
        width: 120, //最少宽度
        checked: false, //默认是否选择
        tips: true
      },
      {
        prop: "conditions_guifan",
        label: "疾病",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "interventions1_guifan",
        label: "干预药物类别",
        width: 120, //最少宽度
        checked: false, //默认是否选择
        tips: true
      },
      {
        prop: "interventions_guifan",
        label: "干预措施",
        width: 100, //最少宽度
        checked: true
      },
      {
        prop: "targets",
        label: "靶点",
        width: 100, //最少宽度
        checked: false, //默认是否选择
        tips: true //表头后面是否有提示
      },
      {
        prop: "sponsor1_guifan",
        label: "申办者类型",
        width: 120, //最少宽度
        checked: false, //默认是否选择
        tips: true
      },
      {
        prop: "sponsors",
        label: "申办者",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "register",
        label: "注册机构",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "study_guifan",
        label: "研究类型",
        width: 140, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "recruitment",
        label: "试验状态",
        width: 100, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "phases",
        label: "试验分期",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "results",
        label: "试验结果/文献",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "countries",
        label: "试验国家/地区",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "received",
        label: "登记日期",
        sort: "custom",
        width: 130, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "start",
        label: "开始日期",
        width: 150,
        checked: false,
        tips: true
      },
      {
        prop: "completion",
        label: "完成日期",
        width: 150,
        checked: false,
        tips: true
      },
      {
        prop: "updated",
        label: "最新变更日期",
        sort: "custom",
        width: 150, //最少宽度
        checked: false //默认是否选择
      }
    ],
    // 按疾病领域浏览
    jbly: [{
        prop: "conditions1_guifan",
        label: "疾病领域",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "phase0",
      //   label: "phase0",
      //   width: 80, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "early_phase1",
        label: "Early phase1",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1",
        label: "phase1",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1or2",
        label: "phase1/phase2",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2",
        label: "phase2",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2or3",
        label: "phase2/phase3",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase3",
        label: "phase3",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase4",
        label: "phase4",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 按疾病领域浏览二级列表
    jblyExpand: [{
        prop: "conditions2",
        label: "",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "phase0",
      //   label: "phase0",
      //   width: 80, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "early_phase1",
        label: "Early phase1",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1",
        label: "phase1",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1or2",
        label: "phase1/phase2",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2",
        label: "phase2",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2or3",
        label: "phase2/phase3",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase3",
        label: "phase3",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase4",
        label: "phase4",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 按干预药物浏览
    gyyw: [{
        prop: "interventions1_guifan",
        label: "药物类别",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "phase0",
      //   label: "phase0",
      //   width: 80, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "early_phase1",
        label: "Early phase1",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1",
        label: "phase1",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1or2",
        label: "phase1/phase2",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2",
        label: "phase2",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2or3",
        label: "phase2/phase3",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase3",
        label: "phase3",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase4",
        label: "phase4",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 按干预药物浏览
    gyywExpand: [{
        prop: "interventions2",
        label: "",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "phase0",
      //   label: "phase0",
      //   width: 80, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "early_phase1",
        label: "Early phase1",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1",
        label: "phase1",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1or2",
        label: "phase1/phase2",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2",
        label: "phase2",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2or3",
        label: "phase2/phase3",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase3",
        label: "phase3",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase4",
        label: "phase4",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 按申办者合作者浏览
    spz: [{
        prop: "sponsor1_guifan",
        label: "申办者/合作者类型",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "phase0",
      //   label: "phase0",
      //   width: 80, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "early_phase1",
        label: "Early phase1",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1",
        label: "phase1",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1or2",
        label: "phase1/phase2",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2",
        label: "phase2",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2or3",
        label: "phase2/phase3",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase3",
        label: "phase3",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase4",
        label: "phase4",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 按申办者合作者浏览二级列表
    spzExpand: [{
        prop: "sponsor2",
        label: "",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      // {
      //   prop: "phase0",
      //   label: "phase0",
      //   width: 80, //最少宽度
      //   checked: true //默认是否选择
      // },
      {
        prop: "early_phase1",
        label: "Early phase1",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1",
        label: "phase1",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase1or2",
        label: "phase1/phase2",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2",
        label: "phase2",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase2or3",
        label: "phase2/phase3",
        width: 120, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase3",
        label: "phase3",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }, {
        prop: "phase4",
        label: "phase4",
        width: 80, //最少宽度
        checked: true //默认是否选择
      }
    ],
    // 按临床结果浏览
    lcjg: [{
      prop: "me_id",
      label: "登记号",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phases",
      label: "试验分期",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "conditions1_guifan",
      label: "疾病领域",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "conditions_guifan",
      label: "疾病",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "interventions1_guifan",
      label: "药物类别",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "name_guifan",
      label: "药物名称",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "targets",
      label: "靶点",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "biomarker",
      label: "生物标志物",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "yxx",
      label: "最优剂量有效性",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "liaofa",
      label: "疗法类型",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "sponsors",
      label: "申办者",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "collaborator",
      label: "合作者",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "received",
      label: "试验登记日期",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "title",
      label: "结果详情",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, ]
  },
  globalapproval: { // 全球上市
    // 按活性名称浏览表头
    hxcf: [{
      prop: "activeingredient",
      label: "活性成分(英文)",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cname",
      label: "活性成分(中文)",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "zwform",
      label: "剂型",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "olddate",
      label: "最早批准日期",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "oldsource",
      label: "国家或地区",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "newestdate",
      label: "最新批准日期",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "newsource",
      label: "国家或地区",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "oldchina",
      label: "中国最早批准日期",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "newchina",
      label: "中国最新批准日期",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "zhucecount",
      label: "中国申报",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "chinesecompany",
      label: "中国企业",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "fensantu",
      label: "单品种分析",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }],
    // 活性成分2级列表
    hxcfExpand: [{
      prop: "source",
      label: "国家或地区",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "drugid",
      label: "批准号",
      width: 150, //最少宽度
      tips: true,
      checked: true //默认是否选择
    }, {
      prop: "name",
      label: "药品名称",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "activeingredient",
      label: "活性成分(英文)",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "cname",
      label: "活性成分(中文)",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "company",
      label: "企业名称",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "administrationroute",
      label: "给药途径",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "zwform",
      label: "剂型",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "status",
      label: "市场状态",
      width: 80, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "date",
      label: "批准日期",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "fensantu",
      label: "单品种分析",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }],
    // 按企业名称浏览
    qymc: [{
      prop: "guifanqiye",
      label: "企业名称",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "activeingredientCounts",
      label: "上市品种数(总数)",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "newestdate",
      label: "最新品种批准日期",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "olddate",
      label: "最早品种批准日期",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "chinesecompany",
      label: "在中国上市品种数",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "zhucecount",
      label: "在中国申报品种数",
      width: 100, //最少宽度
      checked: true //默认是否选择
    }, ]
  },
  // 全球药物2.0
  globaldrugs: {
    // 项目进展
    project: [{
        prop: "drugname_standard",
        label: "项目名称",
        width: 200, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "targets_abbr",
        label: "靶点",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "indication_standard",
        label: "适应症",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "indication_zlly",
        label: "治疗领域",
        width: 120, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "project",
        label: "项目进度",
        sort: 'custom',
        width: 780, //最少宽度
        checked: true //默认是否选择
      },
      {
        prop: "coo_company",
        label: "合作企业",
        width: 150, //最少宽度
        checked: true //默认是否选择
      },
    ],
    // 按企业浏览
    company: [{
      prop: "company_standard",
      label: "企业名称",
      sort: "custom", //是否排序
      width: 200, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "allcount",
      label: "药品数量",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase7",
      label: "批准上市",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase6",
      label: "注册申请",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase5",
      label: "临床Ⅲ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase4",
      label: "临床Ⅱ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase3",
      label: "临床Ⅰ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase2",
      label: "临床申请",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase1",
      label: "临床前",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase0",
      label: "其他",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }],
    // 按企业浏览二级列表
    companyExpand: [{
      prop: "drugname_standard",
      label: "药品名称",
      width: 200, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "leixing2",
      label: "药品分类",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "targets_abbr",
      label: "靶点",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "indication_all",
      label: "适应症",
      width: 250, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phase1",
      label: "全球最高阶段",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phase2",
      label: "中国最高阶段",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "date",
      label: "最新状态时间",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, ],

    // 按靶点浏览
    target: [{
      prop: "targets_abbr",
      label: "靶点名称",
      sort: "custom", //是否排序
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "allcount",
      label: "药品数量",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase7",
      label: "批准上市",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase6",
      label: "注册申请",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase5",
      label: "临床Ⅲ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase4",
      label: "临床Ⅱ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase3",
      label: "临床Ⅰ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase2",
      label: "临床申请",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase1",
      label: "临床前",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase0",
      label: "其他",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }],

    // 按靶点浏览二级列表
    targetExpand: [{
      prop: "drugname_standard",
      label: "药品名称",
      width: 200, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "leixing2",
      label: "药品分类",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "company",
      label: "研发企业",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "indication_all",
      label: "适应症",
      width: 250, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phase1",
      label: "全球最高阶段",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phase2",
      label: "中国最高阶段",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "date",
      label: "最新状态时间",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, ],

    // 按适应症浏览
    indication: [{
      prop: "indication_standard",
      label: "适应症名称",
      width: 150, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "allcount",
      label: "药品数量",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase7",
      label: "批准上市",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase6",
      label: "注册申请",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase5",
      label: "临床Ⅲ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase4",
      label: "临床Ⅱ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase3",
      label: "临床Ⅰ期",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase2",
      label: "临床申请",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase1",
      label: "临床前",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }, {
      prop: "phase0",
      label: "其他",
      width: 100, //最少宽度
      sort: "custom", //是否排序
      checked: true //默认是否选择
    }],

    // 按适应症浏览二级列表
    indicationExpand: [{
      prop: "drugname_standard",
      label: "药品名称",
      width: 200, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "leixing2",
      label: "药品分类",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "targets_abbr",
      label: "靶点",
      width: 120, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "company",
      label: "研发企业",
      width: 150, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phase1",
      label: "全球最高阶段",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "phase2",
      label: "中国最高阶段",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, {
      prop: "date",
      label: "最新状态时间",
      width: 90, //最少宽度
      checked: true //默认是否选择
    }, ],
  }
};
