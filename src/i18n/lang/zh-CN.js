const lang = {
  common: {
    search: "搜索",
    login: "登录",
    register: "注册",
    logout: "退出登录"
  },
  // 单位
  unit: {
    day: "天",
    week: "周",
    month: "月",
    year: "年"
  },
  // 头部
  header: {
    navPath: {
      home: "首页",
      drug: "药物",
      newdrug: "新药",
      target: "靶点",
      company: "企业",
      consistencyEvaluation: "一致性评价",
      yyxsdata: "医院销售数据",
      intelligent: "智能分析系统",
      information: "情报系统"
    }
  },
  // 综合搜索
  cSearch: {
    common: {
      search: "搜索",
      select_placeholder: "请选择"
    },
    searchCategorys: {
      drug: {
        label: "药品",
        ph: "请输入中(英/法/日...外)文名称 或 完整受理号/批准文号"
      },
      chinesemedicine: { label: "中药", ph: "请输入中文名称" },
      devices: {
        label: "医疗器械",
        ph: "请输入中文名称  或  完整受理号/批准文号"
      },
      food: {
        label: "食品",
        ph: "请输入保健食品名称 或 完整受理号/批准文号"
      },
      cosmetics: {
        label: "化妆品",
        ph: "请输入化妆品名称 或 完整受理号/批准文号"
      },
      company: { label: "企业", ph: "请输入中文名称" },
      targets: { label: "靶点", ph: "请输入英文简称/全称/别称" },
      disease: { label: "疾病", ph: "请输入中(英)文名称" }
    }
  },
  // 搜索页面
  search: {
    main: {
      searchwords: "关键词",
      result_number: "结果共计"
    },
    report: {
      overview: "概览",
      drug_overview: "药物概述",
      zhuceshenbao: "注册申报",
      shangshipizhun: "上市批准",
      linchuangshiyan: "临床试验",
      xiaoshouedu: "销售额度",
      view_all: "查看全文报告",
      unit: {
        per_total: "个/总",
        per_year: "个/近一年",
        dollar_the_year: "美元/2017年",
        per_omr: "个/欧美日",
        per_zh: "个/中国"
      },
      // 映射
      baseInfo: {
        originatorcompany: "原研单位",
        higheststatus: "全球最高状态",
        zgss: "中国是否上市",
        categ: "药理作用",
        target: "作用靶点"
      }
    },
    data_nav: {
      data_nav: "导航"
    }
  },
  // 筛选条件
  fields: {
    common: {
      search: "搜索",
      retrieval: "检索",
      advanced_search: "高级搜索",
      filter: "条件筛选",
      save_options: "保存的条件",
      history_search: "历史搜索",
      selected_options: "已选条件",
      collect: "收藏",
      clear: "清空",
      comfirm: "确定",
      cancel: "取消",
      save_express: "保存",
      edit: "修改",
      export: "导出",
      show: "显示",
      reverse: "反选",
      check_all: "全选",
      delete: "删除",
      more: "更多",
      unmore: "收起",
      nomore: "没有更多"
    },
    Doc: {
      filters: {
        tb: "文件来源",
        titlezhema: "报告类型（EMA）",
        titlezhfda: "报告类型（FDA）",
        titlezhcde: "报告类型（CED）",
        titlezhpmda: "报告类型（PMDA）",
        year: "年份"
      }
    },
    Dae: {
      filters: {
        pubyear: "发布年份",
        bq1: "热门标签"
      }
    },
    yzx: {
      // filters: {
      //   jixing: "剂型",
      //   // pijian289: '289品规',
      //   pwjd: "批文进度",
      //   zgjd: "品种最高进度",
      //   tgqiyesel: "同品种通过企业数",
      //   zhuceleixing: "注册分类",
      //   dailiangcaigou: "带量采购品种"
      // }
    },
    zhuce: {
      // filters: {
      //   zhuceleixing: '注册分类',
      //   yaopinleixing: '药品类型',
      //   shenqingleixing: '申请类型',
      //   shenpingrenwufenlei_all: '任务类型',
      //   linchuang: '申请阶段',
      //   xulie: '审评结论',
      //   guifanzhuangtaizhongwen: '办理状态',
      //   banlizhuangtai: '办理状态',
      //   me289: '289目录',
      //   tspz: '特殊审批品种',
      //   zdzx: '重大专项品种',
      //   yxsp: '优先审评品种',
      //   gdcf: '过度重复品种',
      //   wftjcbzj: '无需开展一致性评价品种',
      //   yzxpj: '一致性评价品种',
      //   tpxzl: '突破性治疗品种',
      //   zjxzsp: '直接行政审批',
      //   guifanjixing: '剂型',
      //   gonggao1: '临床现场核查',
      //   gonggao2: '临床自查核查',
      //   report: '审评报告',
      //   instruct: '说明书'
      // }
    },
    drugReport: {
      filters: {
        compound: "复方药",
        worldstatus: "全球最高状态",
        zclx1: "中国1类药",
        leixing: "药物类型",
        chinamarked: "中国上市",
        syzbm: "适应症",
        leixingbm: "药物类型"
      }
    },
    linchuangshiyan: {
      filters: {
        laiyuan: "数据来源",
        me_status: "试验状态",
        sort: "试验分类",
        phase: "试验分期",
        leixing: "申报类型",
        yzx: "一致性评价",
        type: "药物类型",
        lhyy: "联合用药"
      }
    },
    targetdatas: {
      filters: {
        higheststatus: "最高研发阶段"
      }
    },
    newdrug: {
      filters: {
        worldstatusorder: "全球最高状态",
        zclx1: "中国1类",
        leixing: "药物类型",
        compound: "复方",
        chinamarked: "中国上市",
        fistapproval_CH: "中国首批上市时间",
        fistapproval_USA: "美国首批上市时间",
        fistapproval_JP: "日本首批上市时间",
        fistapproval_EU: "欧盟首批上市时间"
      }
    },
    companyReport: {
      filters: {
        qylx: "企业类型",
        rzlc: "融资情况"
      }
    },
    yaopinzhongbiao: {
      filters: {
        yplb: "药品类别",
        guifanjixing: "药品剂型",
        first: "中标地区",
        yibao: "医保药品",
        jiyao: "基药"
      }
    },
    zcycf: {
      filters: {
        // yplb: '药品类别',
        // guifanjixing: '药品剂型',
        // first: '中标地区',
      }
    },
    yaopinxiaoshou: {
      filters: {
        year: "数据年份"
      }
    },
    qxzhuce: {
      filters: {
        spjlid: "审批结论",
        sqlx: "申请类型",
        spztgf: "CMDE审评状态",
        blztgf: "审批状态",
        cplx: "器械/试剂",
        guobie: "国产/进口"
      }
    },
    cfdaDrug: {
      // filters: {
      //   tp: '国产/进口',
      //   type: '药品类别',
      //   pijian289: '289目录',
      //   changjianum: '同品规厂家数',
      //   shengchanshu: '同品种厂家数',
      //   yblb: '医保药品',
      //   gdcf: '过度重复品种',
      //   wftjcbzj: '无需开展一致性评价品种',
      //   guifanjixing: '剂型',
      //   jiyao: '基药'
      // }
    },
    epyp: {
      filters: {
        biosimilar: "生物类似药",
        conditionapproval: "附带条件批准",
        exceptionalcircumstance: "特殊情况批准",
        isgeneric: "通用名药",
        isorphan: "孤儿药",
        source: "数据来源",
        status: "市场状态",
        zwform: "剂型"
      }
    },
    fdaDrug: {
      filters: {
        zwform: "剂型",
        appltype: "申请类型",
        chinesecompany: "中国药企",
        marketingstatusdescription: "市场状态",
        marketingstatusid: "市场状态",
        referencedrug: "参比药物",
        referencestandard: "参比标准",
        submissionclasscode: "提交分类",
        submissionpropertytypecode: "孤儿药",
        tecode: "等效性代码"
        // firstgeneric:'首仿药'
      }
    },
    fdaDrugNew: {
      filters: {
        chinesecompany: "中国药企",
        appltype: "申请类型",
        zwform: "剂型",
        administrationroute: "给药途径",
        marketingstatusid: "市场状态",
        firstgeneric: "首仿药",
        f505b2: "505b2",
        offexclusiity: "非排他性",
        submissionpropertytypecode: "孤儿药",
        acceleration: "加速批准",
        breakthroughtherapy: "突破性疗法",
        priority: "优先审评",
        fasttrack: "快速审批",
        submissionclasscode: "提交分类",
        tecode: "等效性代码",
        referencedrug: "参比药物"
      }
    },
    qxss: {
      filters: {
        lyd: "产品来源",
        bmdh: "编码代号",
        gllb: "管理类别",
        isjk: "国产/进口",
        sf: "批准省份",
        qiyeleixing: "国内上市企业",
        ybhcfl_id: "医保耗材代码"
      }
    },
    qxba: {
      filters: {
        sf: "备案省份",
        balx: "备案类型"
      }
    },
    orangeAmerica: {
      filters: {
        appl_type: "申请类型",
        rld: "参比制剂",
        rs: "标准制剂",
        type: "市场状态",
        zl: "有无专利"
      }
    },
    orangeChina: {
      filters: {
        jinkou: "国内进口",
        // list: '289目录',
        remarks: "复核机构",
        rldf: "美国参比",
        rldj: "日本参比"
      }
    },
    shengwuzhipin: {
      filters: {
        organization: "签发机构",
        categ: "检品类别",
        qfyear: "签发年份"
      }
    },
    ShuomingshuMg: {
      filters: {
        appltype: "申请类型"
      }
    },
    ShuomingshuRb: {
      filters: {
        fenlei: "药物类型"
      }
    },
    tourongzi: {
      filters: {
        round: "事件轮次",
        area: "事件地区",
        industry: "行业领域",
        year: "时间年份"
      }
    },
    yyxs: {
      filters: {
        tag: "热门标签",
        categ: "药品类型",
        year: "销售年份",
        // yzx: "通过一致性评价",
        dailiangcaigou: "集采品种",
        // type: "国产/进口",
        yibao: "医保分类"
        // sale: "品种销售额"
      }
    },
    shuomingshuZg: {
      filters: {
        yibao: "国家医保",
        // otcsort: 'OTC分类',
        xiangqing: "说明书类型",
        // barCode: '条形码数据',
        update_at: "最新更新说明书"
      }
    },
    clinical: {
      filters: {
        register: "注册机构",
        phases: "试验分期",
        recruitment_guifan: "试验状态",
        results: "试验结果/文献",
        conditions1_guifan: "疾病领域",
        interventions1_guifan: "干预药物类别",
        sponsor1_guifan: "申办者类型",
        study_guifan: "研究类型",
        qixie: "器械相关临床试验",
        // references: "有无文献",
        gender: "	受试者性别",
      }
    }
  },
  // 列表式详情页
  lDetail: {
    baseInfo: {
      biaozhunpinhuizhishoudaori: "标准品回执收到日",
      chengbanriqi: "承办日期",
      feiyongdaozhiri: "费用收到日",
      jianyanbaogaoshoudaori: "检验报告收到日",
      shoufeiqingkuang: "收费情况",
      tongzhineirong: "通知内容",
      tongzhishijian: "通知时间",
      yaopinpizhunwenhao: "药品批准文号",
      zhuangtaikaishishijian: "状态开始时间",
      zhuceleixing: "注册分类",
      jielun: "审评结论",
      banlizhuangtai: "办理状态"
    },
    noticeInfo: {
      jianchariqi: "检查日期",
      jianchayuan: "检查人员",
      shouliriqi: "受理日期",
      jingbanren: "经办人"
    },
    devProgress: {
      zhuangtaikaishishijian: "状态开始时间：",
      chengbanriqi: "承办日期：",
      jielun: "审评结论：",
      shoulihao: "受理号：",
      qiyemingcheng: "企业名称：",
      name: "药品名称：",
      shenqingleixing_1: "申请类型：",
      zhuceleixing: "注册类型：",
      drugidStatus: "申请状态：",
      drugidTime: "批准日期：",
      title: "试验题目：",
      company: "申办单位：",
      phase: "试验分期：",
      me_status: "试验状态：",
      me_id: "登记号：",
      start: "开始时间：",
      end: "终止时间：",
      shengchanqiye: "生产企业：",
      pizhunwenhao: "批准文号：",
      yuanpizhunwenhao: "原批准文号：",
      guige: "规格：",
      drugid: "身份证编码：",
      banlizhuangtai: "办理状态：",
      none: ""
    }
  },
  hmap: {
    address: "医院地址",
    outpatient: "日门诊量",
    employee: "员工数",
    department: "科室",
    name: "医院名称",
    province: "省份",
    city: "市/区",
    county: "县",
    bed: "床位数",
    corporate: "法人",
    principal: "负责人",
    email: "邮箱",
    equipment: "医院设备",
    fax: "传真",
    grade: "医院等级",
    introduction: "简介",
    operation: "性质",
    phone: "电话",
    subjects: "诊疗项目",
    type: "医院类型",
    url: "医院网址",
    year: "建院年份",
    zipcode: "邮编",
    skey: "省重点项目",
    pkey: "国家重点项目",
    alias: "医院别名",
    clinical: "临床试验机构"
  },
  qixiebiaozhun: {
    bh: "标准编号",
    bz: "备注",
    bzlb: "标准类别",
    bzzt: "标准状态",
    cbcd: "国际国外采标标准程度",
    cbh: "采标号",
    cblx: "国际国外采标标准类型",
    cbqk: "采标情况",
    ccs: "CCS分类",
    down: "标准下载",
    dtbh: "代替标准号",
    fbdw: "标准发布单位",
    gk: "归口单位",
    ics: "ICS分类",
    jsgk: "技术归口",
    mc: "标准名称",
    pzrq: "批准日期",
    ssrq: "实施日期",
    syfw: "标准适用范围",
    tcdw: "标准提出单位",
    xbbah: "行标备案号"
  },
  //专利
  patent: {
    // fields: {
    //   uses: '用途',
    //   jurisdictionid: '司法管辖区',
    //   datarange: '数据范围',
    //   applicantids: '申请人',
    //   applicantnames: '申请(专利权)人',
    //   abstract: '摘要',
    //   claims: '权利要求',
    //   familysize: '同族专利数',
    //   citation: '引用专利',
    //   citationtype:{
    //     examiner: '审查员引用',
    //     applier: '申请人引用',
    //   },
    //   citationsource: '原始数据',
    //   citationsize: '引用数',
    //   citationed: '被引用专利',
    //   nonpatentcitations: '引用非专利文献',
    //   publicationkey: '公开(公告)号',
    //   filingnumber: '申请号',
    //   ipcclass: 'IPC分类号',
    //   inventorids: '发明人',
    //   inventornames: '发明人',
    //   keywords: '关键字',
    //   meds: '药物名称',
    //   description: '说明书',
    //   filingdate: '申请日',
    //   filingyear: '申请年份',
    //   maturedate: '到期日',
    //   expirydate: '预估到期日',
    //   expiryyear: '预估到期年份',
    //   publicationdate: '申请日',
    //   publicationyear: '公开年份',
    //   priorityfilingdates: '优先权日',
    //   priorityfilingkeys: '优先权号',
    //   publicationdate: '公开(公告)日',
    //   typeids: '技术类型',
    //   types: '技术类型',
    //   title: '专利名称',
    //   currentlegalstatus: '当前法律状态',
    //   effectiveness: '有效性',
    //   apptype: '专利类型',
    //   patentagent: '代理人',
    //   patentagency: '代理机构',
    //   legalstatus: '法律状态',
    //   patent_abstract_img : '摘要图地址'
    // },
  }
};

export default lang;
