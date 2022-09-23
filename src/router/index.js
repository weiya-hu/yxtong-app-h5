import App from "@/App";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
  path: "/",
  // 顶层路由，对应index.html
  component: App,
  // 二级路由。对应App.vue
  children: [{
    path: "",
    redirect: "/introduce"
  },
  //产品介绍页
  {
    path: "/introduce",
    component: () =>
      import("@/pages/introduce/introduce"),
  },
  //产品介绍页移动
  {
    path: "/introducemobile",
    component: () =>
      import("@/pages/introduce/introducemobile"),
  },
  // 问券调查
  {
    path: "/qs",
    redirect: "/qs/stoped",
    component: () => import("@/pages/qs/base"),
    children: [{
      path: '/qs/stoped',
      component: () => import("@/pages/qs/stoped"),
      meta: {
        title: "药智数据企业版 - 智能决策，洞见未来"
      }
    },
    {
      path: '/qs/ok',
      component: () => import("@/pages/qs/stoped"),
      meta: {
        title: "药智数据企业版 - 智能决策，洞见未来"
      }
    },
    {
      path: '/qs/:token',
      component: () => import("@/pages/qs/main"),
      meta: {
        title: "药智数据企业版 - 智能决策，洞见未来"
      }
    }
    ]
  },
  // 无权限全屏页
  {
    path: "/no-permission",
    component: () =>
      import("@/pages/permission/no-permission")
  },

  // 无权限全屏页-投融资
  {
    path: "/trz-no-permission",
    component: () =>
      import("@/pages/permission/no-permission-trz")
  },
  // 医院销售数据放大测试版无权限全屏页
  {
    path: "/yyxs-large-no-permission",
    component: () =>
      import("@/pages/permission/yyxs-no-permission")
  },
  // vip文献 vipdetail
  {
    path: "/literature",
    component: () =>
      import("@/pages/vipwenxian/base"),
    meta: {
      title: "文献"
    }
  },
  {
    path: "/literature/detail/:id",
    component: () =>
      import("@/pages/vipwenxian/lists/detail"),
    meta: {
      title: "文献"
    }
  },
  // 首页
  {
    path: "/home",
    component: () =>
      import("@/pages/home/home")
  },

  // 登录注册页
  {
    path: "/login",
    component: () =>
      import("@/pages/login/login"),
    meta: {
      title: "登录页-药智数据企业版"
    }
  },

  //版本更新日志
  {
    path: "/updatelog",
    component: () =>
      import("@/pages/updatelog/list"),
    meta: {
      title: "更新日志"
    }
  },
  //客户服务页
  {
    path: "/service",
    component: () =>
      import("@/pages/service/service"),
  },
  // 会员中心
  {
    path: "/usercenter",
    redirect: "/usercenter/message",
    component: () =>
      import("@/pages/usercenter/base"),
    children: [
      // 1、消息通知
      {
        path: "/usercenter/message",
        component: () =>
          import("@/pages/usercenter/message/base"),
        meta: {
          title: "消息通知"
        }
      },
      // 通知详情
      {
        path: "/usercenter/message/:id",
        component: () =>
          import("@/pages/usercenter/message/detail"),
        meta: {
          title: "消息通知"
        }
      },
      // 2、订阅管理
      {
        path: "/usercenter/take",
        redirect: "/usercenter/take/dynamic",
        component: () =>
          import("@/pages/usercenter/take/base")
      },
      // 订阅动态
      {
        path: "/usercenter/take/dynamic",
        component: () =>
          import("@/pages/usercenter/take/detail/dynamic"),
        meta: {
          title: "订阅动态"
        }
      },
      {
        path: "/usercenter/take/dynamic/slh/:id",
        component: () =>
          import("@/pages/usercenter/take/include/slh"),
        meta: {
          title: "订阅动态"
        }
      },
      {
        path: "/usercenter/take/dynamic/other/:id",
        component: () =>
          import("@/pages/usercenter/take/include/other"),
        meta: {
          title: "订阅动态"
        }
      },
      // 投融资并购消息详情页
      {
        path: "/usercenter/take/dynamic/trzMsg/:id",
        component: () =>
          import("@/pages/usercenter/take/include/trzMsgDetail"),
        meta: {
          title: "订阅动态"
        }
      },
      // 全球药物2.0 消息详情页
      {
        path: "/usercenter/take/dynamic/gldrugs/:id",
        component: () =>
          import("@/pages/usercenter/take/include/globaldrugs"),
        meta: {
          title: "订阅动态"
        }
      },
      {
        path: "/usercenter/take/condition",
        component: () =>
          import("@/pages/usercenter/take/detail/condition"),
        meta: {
          title: "订阅动态"
        }
      },
      {
        path: "/usercenter/take/new",
        name: "usercenter_take_new",
        component: () =>
          import("@/pages/usercenter/take/detail/new"),
        meta: {
          title: "订阅动态"
        }
      },
      // 3、收藏管理
      {
        path: "/usercenter/collect",
        redirect: "/usercenter/collect/database",
        component: () =>
          import("@/pages/usercenter/collect/base"),
        meta: {
          title: "收藏管理"
        }
      },
      {
        path: "/usercenter/collect/database",
        component: () =>
          import("@/pages/usercenter/collect/cl-database"),
        meta: {
          title: "收藏管理"
        }
      },
      {
        path: "/usercenter/collect/page",
        component: () =>
          import("@/pages/usercenter/collect/cl-page"),
        meta: {
          title: "收藏管理"
        }
      },
      {
        path: "/usercenter/collect/company",
        component: () =>
          import("@/pages/usercenter/collect/cl-company"),
        meta: {
          title: "收藏管理"
        }
      },
      // 4、搜索记录
      {
        path: "/usercenter/history",
        redirect: "/usercenter/history/saved",
        component: () =>
          import("@/pages/usercenter/history/base"),
        meta: {
          title: "搜索记录"
        }
      },
      {
        path: "/usercenter/history/saved",
        component: () =>
          import("@/pages/usercenter/history/hs-saved"),
        meta: {
          title: "搜索记录"
        }
      },
      {
        path: "/usercenter/suggest",
        component: () =>
          import("@/pages/usercenter/suggest/base"),
        meta: {
          title: "建议反馈"
        }
      },
      {
        path: "/usercenter/suggest/:id",
        component: () =>
          import("@/pages/usercenter/suggest/detail"),
        meta: {
          title: "建议反馈"
        }
      },
      // 6、账号管理
      {
        path: "/usercenter/account",
        component: () =>
          import("@/pages/usercenter/account/base"),
        meta: {
          title: "账号管理"
        }
      }
    ]
  },

  // 搜索页
  {
    path: "/search",
    component: () =>
      import("@/pages/search/search"),
    meta: {
      title: "综合搜索结果"
    }
  },

  // 智能分析系统
  {
    path: "/intelligent",
    component: () =>
      import("@/pages/intelligent/intelligent"),
    meta: {
      title: "智能分析系统"
    }
  },

  // 情报系统
  {
    path: "/information",
    component: () =>
      import("@/pages/information/information"),
    meta: {
      title: "情报系统"
    }
  },

  // 注册数据库
  {
    path: "/zhuce",
    redirect: "/zhuce/list",
    component: () =>
      import("@/pages/zhuce/zhuce"),
    name: "database_zhuce_index",
    children: [{
      path: "/zhuce/list",
      component: () =>
        import("@/pages/zhuce/list"),
      name: "database_zhuce"
    },
    {
      path: "/zhuce/analy",
      component: () =>
        import("@/pages/zhuce/analy"),
      name: "database_zhuce_analy"
    },
    {
      path: "/zhuce/analy_breed",
      component: () =>
        import("@/pages/zhuce/analy_breed"),
      name: "database_zhuce_analy_breed"
    }
    ]
  },
  // 注册数据库 - 详情页(不能放到/zhuce的children内)
  {
    path: "/zhuce/:id",
    component: () =>
      import("@/pages/zhuce/detail/detail")
  },

  // 中国临床数据库
  {
    path: "/linchuangshiyan",
    redirect: "/linchuangshiyan/list",
    component: () =>
      import("@/pages/linchuangshiyan/base"),
    name: "database_linchuangshiyan_index",
    children: [{
      path: "/linchuangshiyan/list",
      component: () =>
        import("@/pages/linchuangshiyan/list"),
      name: "database_linchuangshiyan"
    },
    {
      path: "/linchuangshiyan/analy",
      component: () =>
        import("@/pages/linchuangshiyan/analy"),
      name: "database_linchuangshiyan_analy"
    }
    ]
  },
  // 中国临床数据库 - 详情页
  {
    path: "/linchuangshiyan/:id",
    component: () =>
      import("@/pages/linchuangshiyan/detail/detail")
  },
  // 药物报告 - 列表页
  {
    path: "/report",
    component: () =>
      import("@/pages/drugreport/base"),
    name: "database_report"
  },
  // 药物报告 - 详情页
  {
    path: "/report/:id",
    component: () =>
      import("@/pages/drugreport/detail/base")
  },

  // 全球药物2.0 - 列表页
  {
    path: "/globaldrugs",
    redirect: "/globaldrugs/list",
    component: () =>
      import("@/pages/globaldrugs/base"),
    name: "database_globaldrugs",
    children: [{
      path: "/globaldrugs/list",
      component: () =>
        import("@/pages/globaldrugs/list"),
    }]
  },
  // 全球药物2.0 - 药品对比
  {
    path: '/globaldrugs/contrast',
    component: () => import('@/pages/globaldrugs/contrast'),
    name: "databse_globaldrugs_constrast"
  },
  // 全球药物2.0 - 智能分析
  {
    path: '/globaldrugs/analysis',
    component: () => import('@/pages/globaldrugs/analy'),
    name: "database_globaldrugs_analy",
  },
  // 全球药物2.0 - 时光轴详情
  {
    path: '/globaldrugs/shiguang',
    component: () => import('@/pages/globaldrugs/shiguang'),
    name: "database_globaldrugs_shiguang"
  },
  // 全球药物2.0 - 药品详情页
  {
    path: '/globaldrugs/detail',
    component: () => import('@/pages/globaldrugs/detail'),
    name: "databse_globaldrugs_detail"
  },
  // 全球药物2.0 - 企业管线
  {
    path: '/globaldrugs/companyDetail',
    component: () => import('@/pages/globaldrugs/company/detail'),
    name: "databse_globaldrugs_companyDetail",
  },
  // 全球药物2.0 - 靶点详情页
  {
    path: '/globaldrugs/target/detail',
    component: () => import('@/pages/globaldrugs/detail/target'),
    name: "databse_globaldrugs_detail_target",
  },
  // 全球药物2.0 - PDF模板页
  {
    path: '/globaldrugs/pdf/drugs',
    component: () => import('@/pages/globaldrugs/pdf/drugs'),
    name: "databse_globaldrugs_pdf_drugs",
  },
  // 企业报告 - 列表页
  {
    path: "/company",
    component: () =>
      import("@/pages/companyreport/base"),
    name: "database_company"
  },
  // 企业报告 - 详情页
  {
    path: "/company/:id",
    component: () =>
      import("@/pages/companyreport/detail/base")
  },

  // 企业筛选系统 - 列表页
  {
    path: "/company_filter",
    redirect: "/company_filter/list",
    component: () =>
      import("@/pages/companyFilter/base"),
    name: "database_company_filter",
    children: [{
      path: "/company_filter/list",
      component: () =>
        import("@/pages/companyFilter/list"),
    }]
  },

  // 企业报告 - 详情页
  {
    path: "/company_filter/:id",
    component: () =>
      import("@/pages/companyFilter/detail/base")
  },

  // 审评文档 - 列表页
  {
    path: "/doc",
    component: () =>
      import("@/pages/doc/base"),
    name: "database_doc"
  },
  // 审评文档 - 详情页
  {
    path: "/doc/:id",
    component: () =>
      import("@/pages/doc/detail/detail")
  },

  // 审评文档 - 列表页
  {
    path: "/dae",
    component: () =>
      import("@/pages/dae/base"),
    name: "database_dae"
  },
  // 审评文档 - 详情页
  {
    path: "/dae/:id",
    component: () =>
      import("@/pages/dae/detail/detail")
  },

  // 上市药品
  // 上市药品 - 全球
  {
    path: "/globalapproval",
    component: () =>
      import("@/pages/globalapproval/base"),
    name: "database_globalapproval",
    redirect: "/globalapproval/list",
    children: [{
      path: "list",
      component: () =>
        import("@/pages/globalapproval/list")
    },
    {
      path: "/globalapproval/analy",
      component: () =>
        import("@/pages/globalapproval/analy"),
      name: "database_globalapproval_analy"
    }
    ]
  },
  // 上市药品 - 全球详情页
  {
    path: "/globalapproval/detail",
    component: () =>
      import("@/pages/globalapproval/detail/detail"),
    name: "database_globalapproval_detail"
  },
  {
    path: "/globalapproval/scatter-graph",
    component: () =>
      import("@/pages/globalapproval/scatter-graph")
  },
  // 上市药品 - 中国
  {
    path: "/cfdadrug",
    component: () =>
      import("@/pages/cfdadrug/china/cfdadrug"),
    name: "database_cfdadrug",
    redirect: "/cfdadrug/list",
    children: [{
      path: "list",
      component: () =>
        import("@/pages/cfdadrug/china/list")
    },
    {
      path: "analy",
      component: () =>
        import("@/pages/cfdadrug/china/analy")
    }
    ]
  },
  // 上市药品 - 中国国产的详情
  {
    path: "/cfdadrug/detail/:id",
    component: () =>
      import("@/pages/cfdadrug/china/detail/chinaDetail")
  },
  // 上市药品 - 中国进口详情
  {
    path: "/cfdadrug/jkdetail/:id",
    component: () =>
      import("@/pages/cfdadrug/china/detail/importDetail")
  },
  // 上市药品 - 美国
  {
    path: "/fdadrug",
    redirect: "/fdadrugnew/list",
    component: () =>
      import("@/pages/cfdadrug/america/fdadrug"),
    name: "database_fdadrug"
  },
  // 上市药品- 美国复杂详情页面
  {
    path: "/fdadrug/:id",
    component: () =>
      import("@/pages/cfdadrug/america/detail/detail")
  },
  // 上市药品 - 欧盟
  {
    path: "/epyp",
    component: () =>
      import("@/pages/cfdadrug/europe/epyp"),
    name: "database_epyp",
    redirect: "/epyp/list",
    children: [{
      path: "list",
      component: () =>
        import("@/pages/cfdadrug/europe/list")
    },
    {
      path: "analy",
      component: () =>
        import("@/pages/cfdadrug/europe/analy")
    }
    ]
  },
  //上市药品 - 欧盟ema的详情
  {
    path: "/epyp/emadetail/:id",
    component: () =>
      import("@/pages/cfdadrug/europe/detail/emadetail")
  },
  //上市药品 - 欧盟hma的详情
  {
    path: "/epyp/hmadetail/:id",
    component: () =>
      import("@/pages/cfdadrug/europe/detail/hmadetail")
  },
  // 上市药品 - 日本
  {
    path: "/pmda",
    component: () =>
      import("@/pages/cfdadrug/japan/pmda"),
    name: "database_pmda"
  },
  {
    path: "/pmda/:id",
    component: () =>
      import("@/pages/cfdadrug/japan/detail/detail")
  },
  // // 说明书
  // // 说明书 - 中国药品
  {
    path: "/instruct",
    component: () =>
      import("@/pages/instruct/china/base"),
    name: "database_instruct"
  },
  {
    path: "/instruct/:id",
    name: "ChinaShuomingshuDetail1",
    component: () =>
      import("@/pages/instruct/china/detail/detail")
  },
  // 图文说明书详情页
  {
    path: "/instruct/graphics/:id",
    name: "ChinaGraphicsShuomingshuDetail1",
    component: () =>
      import("@/pages/instruct/china/detail/graphics-detail")
  },
  // 图文说明书详情-修订页面
  {
    path: "/instruct/revise/:id",
    name: "ChinaDetail1Revise",
    component: () =>
      import("@/pages/instruct/china/detail/revise")
  },
  // 说明书 - 美国药品
  {
    path: "/fdalabel",
    component: () =>
      import("@/pages/instruct/america/base"),
    name: "database_fdalabel"
  },
  // 说明书 - 日本药品
  {
    path: "/jp_shuomingshu",
    component: () =>
      import("@/pages/instruct/japan/base"),
    name: "database_jp_shuomingshu"
  },
  // 说明书 - 超说明药品
  {
    path: "/unlabeleduse",
    component: () =>
      import("@/pages/instruct/unlabeleduse/base"),
    name: "database_unlabeleduse"
  },
  {
    path: "/unlabeleduse/:id",
    component: () =>
      import("@/pages/instruct/unlabeleduse/detail/detail")
  },

  // 药品中标数据库
  {
    path: "/yaopinzhongbiao",
    redirect: "/yaopinzhongbiao/list",
    component: () =>
      import("@/pages/yaopinzhongbiao/base"),
    name: "database_yaopinzhongbiao_index",
    children: [{
      path: "/yaopinzhongbiao/list",
      component: () =>
        import("@/pages/yaopinzhongbiao/list"),
      name: "database_yaopinzhongbiao"
    },
    {
      path: "/yaopinzhongbiao/analy",
      component: () =>
        import("@/pages/yaopinzhongbiao/analy"),
      name: "database_yaopinzhongbiao_analy"
    }
    ]
  },

  // 带量采购数据库
  {
    path: "/dailiangcaigou",
    redirect: "/dailiangcaigou/list",
    component: () =>
      import("@/pages/dailiangcaigou/base"),
    name: "database_dailiangcaigou_index",
    children: [{
      path: "/dailiangcaigou/list",
      component: () =>
        import("@/pages/dailiangcaigou/list"),
      name: "database_dailiangcaigou"
    }]
  },

  // 带量采购精准分析路由
  {
    path: "/dailiangcaigou/analysis",
    component: () =>
      import("@/pages/dailiangcaigou/analysis"),
    name: "database_dailiangcaigou_analysis",
    meta: {
      title: '国家药品集中带量采购'
    }
  },

  // 带量采购数据库 - 详情页(不能放到/dailiangcaigou的children内)
  {
    path: "/dailiangcaigou/detail",
    component: () =>
      import("@/pages/dailiangcaigou/detail/detail"),
    name: "database_dailiangcaigou_detail"
  },
  // 生物制品数据库
  {
    path: "/pqf",
    redirect: "/pqf/list",
    component: () =>
      import("@/pages/shengwuzhipin/base"),
    name: "database_pqf_index",
    children: [{
      path: "/pqf/list",
      component: () =>
        import("@/pages/shengwuzhipin/list"),
      name: "database_pqf"
    },
    {
      path: "/pqf/analy",
      component: () =>
        import("@/pages/shengwuzhipin/analy"),
      name: "database_pqf_analy"
    }
    ]
  },
  //生物制品数据库的详情页
  {
    path: "/pqf/:id",
    component: () =>
      import("@/pages/shengwuzhipin/detail/detail.vue")
  },

  //医疗器械上市数据库 - 器械标准
  {
    path: "/qxss",
    component: () =>
      import("@/pages/qixieshangshi/qxss/qxss"),
    name: "database_qxss"
  },
  //医疗器械上市数据库 - 器械标准- 国产的详情
  {
    path: "/qxss/:id",
    component: () =>
      import("@/pages/qixieshangshi/qxss/detail/qxssdetail")
  },

  //医疗器械上市数据库 - 器械备案
  {
    path: "/qxba",
    component: () =>
      import("@/pages/qixieshangshi/qxba/qxba"),
    name: "database_qxba"
  },
  //医疗器械上市数据库 - 器械备案详情页面
  {
    path: "/qxba/:id",
    component: () =>
      import("@/pages/qixieshangshi/qxba/detail/qxbadetail")
  },

  // 药品销售数据库
  {
    path: "/ypxs",
    redirect: "/ypxs/list",
    component: () =>
      import("@/pages/yaopinxiaoshou/base"),
    name: "database_ypxs_index",
    children: [{
      path: "/ypxs/list",
      component: () =>
        import("@/pages/yaopinxiaoshou/list"),
      name: "database_ypxs"
    },
    {
      path: "/ypxs/analy",
      component: () =>
        import("@/pages/yaopinxiaoshou/analy"),
      name: "database_ypxs_analy"
    }
    ]
  },
  // 药品销售数据库 - 详情页(不能放到/ypxs的children内)
  {
    path: "/ypxs/:id",
    component: () =>
      import("@/pages/yaopinxiaoshou/detail/detail")
  },
  // 美国橙皮书
  {
    path: "/fdaproducts",
    component: () =>
      import("@/pages/orange/america/base"),
    name: "database_fdaproducts"
  },
  // 美国橙皮书 - 详情页
  {
    path: "/fdaproducts/:id",
    component: () =>
      import("@/pages/orange/america/detail/detail")
  },
  // 中国橙皮书
  {
    path: "/orangebook",
    component: () =>
      import("@/pages/orange/china/base"),
    name: "database_orangebook"
  },
  // 中国橙皮书 - 详情页
  {
    path: "/orangebook/:id",
    component: () =>
      import("@/pages/orange/china/detail/detail")
  },

  // 药物合成数据库 - 原料药
  {
    path: "/ywfzk",
    component: () =>
      import("@/pages/yaowuhecheng/ywfzk/base"),
    name: "database_ywfzk"
  },
  // 药物合成数据库 - 原料药 - 详情
  {
    path: "/ywfzk/:id",
    component: () =>
      import("@/pages/yaowuhecheng/ywfzk/detail/detail")
  },
  // 药物合成数据库 - 中间体
  {
    path: "/fzk1",
    component: () =>
      import("@/pages/yaowuhecheng/fzk1/base"),
    name: "database_fzk1"
  },
  // 药物合成数据库 - 中间体 - 详情
  {
    path: "/fzk1/:id",
    component: () =>
      import("@/pages/yaowuhecheng/fzk1/detail/detail")
  },
  // 器械注册
  {
    path: "/qxzhuce",
    component: () =>
      import("@/pages/qxzhuce/base"),
    name: "database_qxzhuce"
  },
  {
    path: "/qxzhuce/:id",
    component: () =>
      import("@/pages/qxzhuce/detail/detail")
  },

  /* 帮助中心 */
  {
    path: "/help",
    redirect: "/help/list",
    component: () =>
      import("@/pages/help/help"),
    meta: {
      title: "帮助中心"
    },
    children: [{
      path: "/help/list",
      component: () =>
        import("@/pages/help/list"),
      meta: {
        title: "帮助中心"
      }
    }]
  },
  /* 帮助中心 */
  // 帮助中心详情页
  {
    path: "/help/detail/:id",
    component: () =>
      import("@/pages/help/detail/detail"),
    meta: {
      title: "帮助中心"
    }
  },
  // 一致性评价进度
  {
    path: "/yzxjd",
    component: () =>
      import("@/pages/yzxpj/yzxpj")
  },
  //仿制药一致性评价
  {
    path: "/yzx",
    redirect: "/yzx/pjdt",
    component: () =>
      import("@/pages/fzyyzx/fzyyzx"),
    name: "database_yzx_index",
    children: [{
      path: "/yzx/pjdt",
      component: () =>
        import("@/pages/fzyyzx/pjdt"),
      name: "database_fzyyzx_pjdt"
    },
    {
      path: "/yzx/pjjd",
      component: () =>
        import("@/pages/fzyyzx/pjjd"),
      name: "database_fzyyzx_pjjd"
    },
    {
      path: "/yzx/pjzc",
      component: () =>
        import("@/pages/fzyyzx/pjzc"),
      name: "database_fzyyzx_pjzc"
    }
    ]
  },
  {
    path: "/yzx/detail",
    component: () =>
      import("@/pages/fzyyzx/detail/detail"),
    name: "database_fzyyzx_detail"
  },

  // 医院销售数据库
  {
    path: "/yyxs",
    redirect: "/yyxs/list",
    component: () =>
      import("@/pages/yiyuanxiaoshou/base"),
    name: "database_yyxs_index",
    children: [{
      path: "/yyxs/list",
      component: () =>
        import("@/pages/yiyuanxiaoshou/list"),
      name: "database_yyxs"
    },
    {
      path: "/yyxs/analy",
      component: () =>
        import("@/pages/yiyuanxiaoshou/analy"),
      name: "database_yyxs_analy"
    },
    {
      path: "/yyxs/analy_amount",
      component: () =>
        import("@/pages/yiyuanxiaoshou/analy_amount"),
      name: "database_yyxs_analy_amount"
    }
    ]
  },
  // 中药处方数据库
  {
    path: "/chufang",
    redirect: "/chufang/list",
    component: () =>
      import("@/pages/zcycf/base"),
    name: "database_chufang_index",
    children: [{
      path: "/chufang/list",
      component: () =>
        import("@/pages/zcycf/list"),
      name: "database_chufang"
    },
    {
      path: "/chufang/analy",
      component: () =>
        import("@/pages/zcycf/analy"),
      name: "database_chufang_analy"
    }
    ]
  },
  {
    path: "/chufang/:id",
    component: () =>
      import("@/pages/zcycf/detail/detail")
  },
  // 靶点数据库
  {
    path: "/targetdatas",
    redirect: "/targetdatas/list",
    component: () =>
      import("@/pages/targetdatas/base"),
    name: "database_targetdatas_index",
    children: [{
      path: "/targetdatas/list",
      component: () =>
        import("@/pages/targetdatas/list"),
      name: "database_targetdatas"
    }]
  },
  {
    path: "/targetdatas/:id",
    component: () =>
      import("@/pages/targetdatas/detail/detail")
  },
  // 新药数据库
  {
    path: "/newdrug",
    redirect: "/newdrug/list",
    component: () =>
      import("@/pages/newdrug/base"),
    name: "database_newdrug_index",
    children: [{
      path: "/newdrug/list",
      component: () =>
        import("@/pages/newdrug/list"),
      name: "database_newdrug"
    }]
  },
  {
    path: "/newdrug/:id",
    component: () =>
      import("@/pages/newdrug/detail/detail")
  },
  // 医院销售数据库
  {
    path: "/yyxsdata",
    component: () =>
      import("@/pages/yyxsdata/base"),
    name: "database_yyxsdata_index",
    meta: {
      title: "医院销售数据库"
    }
  },
  // 美国上市数据库新
  {
    path: "/fdadrugnew",
    redirect: "/fdadrugnew/list",
    component: () =>
      import("@/pages/fdadrugnew/base"),
    name: "database_fdadrugnew_index",
    children: [{
      path: "/fdadrugnew/list",
      component: () =>
        import("@/pages/fdadrugnew/list"),
      name: "database_fdadrugnew"
    },
    {
      path: "/fdadrugnew/analy",
      component: () =>
        import("@/pages/fdadrugnew/analy"),
      name: "database_fdadrugnew_analy"
    }
    ]
  },
  {
    path: "/fdadrugnew/:id",
    component: () =>
      import("@/pages/fdadrugnew/detail/detail")
  },
  {
    path: "/fdadrugnew/:id/cber",
    component: () =>
      import("@/pages/fdadrugnew/detail/detail-cber")
  },
  // 全球临床试验数据库(升级)
  {
    path: "/clinical",
    redirect: "/clinical/list",
    component: () =>
      import("@/pages/clinical/base"),
    name: "database_clinical_index",
    children: [{
      path: "/clinical/list",
      component: () =>
        import("@/pages/clinical/list"),
      name: "database_clinical"
    }]
  },
  {
    path: "/clinical/cate",
    redirect: "/clinical/cate",
    component: () =>
      import("@/pages/clinical/base"),
    name: "database_clinical_cate",
    children: [{
      path: "/clinical/cate",
      component: () =>
        import("@/pages/clinical/catelist"),
      name: "database_clinical_catelist"
    },
    {
      path: "/clinical/analy",
      component: () =>
        import("@/pages/clinical/analy"),
      name: "database_clinical_analy"
    }
    ]
  },
  {
    path: "/clinical/:id",
    component: () =>
      import("@/pages/clinical/detail/detail")
  },

  // 药品不良反应检测信息分析预警系统
  {
    path: "/faers",
    redirect: "/faers/list",
    component: () =>
      import("@/pages/faers/base"),
    name: "database_faers_index",
    children: [{
      path: "/faers/list",
      component: () =>
        import("@/pages/faers/list"),
      name: "database_faers"
    }]
  },

  // 药品不良反应检测信息分析预警系统详情页
  {
    path: "/faers/:id",
    component: () =>
      import("@/pages/faers/detail/detail")
  },

  // 导航地图
  {
    path: "/nav",
    component: () =>
      import("@/pages/nav/base"),
    name: "database_nav_index",
    meta: {
      title: "导航地图"
    }
  },
  // 投融资数据库
  {
    path: "/tourongzi",
    redirect: "/tourongzi/list",
    component: () =>
      import("@/pages/tourongzi/base"),
    name: "database_tourongzi_index",
    children: [{
      path: "/tourongzi/list",
      component: () =>
        import("@/pages/tourongzi/list"),
      name: "database_tourongzi"
    },
    {
      path: "/tourongzi/analy",
      component: () =>
        import("@/pages/tourongzi/analy"),
      name: "database_tourongzi_analy"
    }
    ]
  },
  //投融资数据库 - 详情页面
  {
    path: "/tourongzi/:id",
    component: () =>
      import("@/pages/tourongzi/detail/detail")
  },
  // 综合搜索结果页
  {
    path: "/trz/comprehensiveSearch",
    component: () =>
      import("@/pages/trz/search/comprehensiveSearch"),
    name: "database_trz_comprehensiveSearch",
    meta: {
      title: "投资格局综合搜索结果"
    }
  },
  // 投融资数据库-首页
  {
    path: "/trz",
    redirect: "/trz/home",
    component: () =>
      import("@/pages/trz/home"),
    children: [{
      path: "/trz/home",
      component: () =>
        import("@/pages/trz/index"),
      name: "database_trz_index",
      meta: {
        title: "药智数据企业版-健康产业投资格局"
      }
    },
    // 新闻动态首页
    {
      path: "/trz/news",
      component: () =>
        import("@/pages/trz/news/index"),
      name: "database_trz_news",
      meta: {
        title: "新闻动态"
      }
    },
    // 新闻动态详情页
    {
      path: "/trz/news/:id",
      component: () =>
        import("@/pages/trz/news/detail/detail"),
      name: "database_trz_news_detail",
      meta: {
        title: "新闻动态详情页"
      }
    },
    // 投融资事件首页
    {
      path: "/trz/rongzi",
      component: () =>
        import("@/pages/trz/rongzi/index"),
      name: "database_trz_rongzi",
      meta: {
        title: "投融资事件"
      }
    },
    // 投融资事件详情
    {
      path: "/trz/rongzi/:id",
      component: () =>
        import("@/pages/trz/rongzi/detail/detail"),
      name: "database_trz_rongzi_detail",
      meta: {
        title: "投融资事件详情页"
      }
    },
    // 并购事件首页
    {
      path: "/trz/binggou",
      component: () =>
        import("@/pages/trz/binggou/index"),
      name: "database_trz_binggou",
      meta: {
        title: "并购事件"
      }
    },
    // 并购事件详情
    {
      path: "/trz/binggou/:id",
      component: () =>
        import("@/pages/trz/binggou/detail/detail"),
      name: "database_trz_binggou_detail",
      meta: {
        title: "并购事件详情页"
      }
    },
    // 医药交易
    {
      path: "/trz/kuajing",
      component: () =>
        import("@/pages/trz/kuajing/index"),
      name: "database_trz_kuajing",
      meta: {
        title: "医药交易"
      }
    },
    // 医药交易详情
    {
      path: "/trz/kuajing/:id",
      component: () =>
        import("@/pages/trz/kuajing/detail/detail"),
      name: "database_trz_kuajing_detail",
      meta: {
        title: "医药交易详情页"
      }
    },
    // 投资机构首页
    {
      path: "/trz/jigou",
      component: () =>
        import("@/pages/trz/jigou/index"),
      name: "database_trz_jigou",
      meta: {
        title: "投资机构"
      }
    },
    // 投资机构首页
    {
      path: "/trz/jigou/:id",
      component: () =>
        import("@/pages/trz/jigou/detail"),
      name: "database_trz_jigou_detail",
      meta: {
        title: "投资机构详情"
      }
    },
    // 融资企业首页
    {
      path: "/trz/qiye",
      component: () =>
        import("@/pages/trz/qiye/index"),
      name: "database_trz_qiye",
      meta: {
        title: "融资企业"
      }
    },
    // 融资企业详情页
    {
      path: "/trz/qiye/:id",
      component: () =>
        import("@/pages/trz/qiye/detail/detail"),
      name: "database_trz_qiye_detail",
      meta: {
        title: "融资企业详情页"
      }
    },
    // 投融资分析报告
    {
      path: "/trz/report",
      component: () =>
        import("@/pages/trz/analy/report"),
      name: "database_trz_report",
      meta: {
        title: "投融资分析报告"
      }
    },
    // 投融资并购地图
    {
      path: "/trz/map",
      component: () =>
        import("@/pages/trz/analy/map"),
      name: "database_trz_map",
      meta: {
        title: "投融资并购地图"
      }
    },
    // 医药产业链
    {
      path: "/trz/industry",
      component: () =>
        import("@/pages/trz/analy/industry"),
      name: "database_trz_industry",
      meta: {
        title: "医药产业链"
      }
    }
      // TODO
      // 路由待定
      // 数据分析首页
      // {
      //     path: "/trz/analy",
      //     component: () =>
      //         import ("@/pages/trz/qiye/index"),
      //     name: "database_trz_analy",
      //     meta: {
      //         title: "数据分析"
      //     }
      // }
    ]
  },

  // 医药宏观数据分析系统
  {
    path: "/indicator",
    redirect: "/indicator",
    component: () =>
      import("@/pages/indicator/home"),
    children: [{
      path: "/indicator",
      component: () =>
        import("@/pages/indicator/index"),
      name: "database_indicator_index",
      meta: {
        title: "药智数据企业版-宏观医药健康产业大数据分析系统"
      }
    },]
  },

  // 政策法规
  {
    path: "/policies",
    redirect: "/policies/home",
    meta: {
      title: "药智数据企业版-医药政策法规智能决策分析系统"
    },
    component: () =>
      import("@/pages/policies/home"),
    children: [{
      path: "/policies/home",
      component: () =>
        import("@/pages/policies/index"),
      name: "database_policies_index",
      meta: {
        title: "药智数据企业版-医药政策法规智能决策分析系统"
      }
    },
    // 列表
    {
      path: "/policies/list",
      component: () =>
        import("@/pages/policies/base"),
      name: "database_policies_base",
    },
    // 政策法规-一般详情页
    {
      path: "/policies/commondetail/:id",
      component: () => import("@/pages/policies/details/commonDetail.vue"),
      name: "database_policies_commondetail",
      meta: {
        title: "详情页"
      }
    },
    // 政策法规-法律法规详情页
    {
      path: "/policies/lawdetail/:id",
      component: () => import("@/pages/policies/details/lawDetail.vue"),
      name: "database_policies_lawdetail",
      meta: {
        title: "详情页"
      }
    },
    // 政策法规-指导原则详情页
    {
      path: "/policies/guiddetail/:id",
      component: () => import("@/pages/policies/details/guidDetail.vue"),
      name: "database_policies_guiddetail",
      meta: {
        title: "详情页"
      }
    },

    ]
  },
  // 海关进出口数据
  {
    path: "/iframe_content",
    component: () =>
      import("@/pages/iframe_content/index")
  },

  /* 通用数据库组件 start */
  /* ！！！！！**注意**此区间的router配置放在本页的最末尾！！！！！ */
  {
    path: "/:dbname",
    component: () =>
      import("@/pages/database/base")
  },
  // （通用）单表 - 详情页
  {
    path: "/:dbname/:id",
    component: () =>
      import("@/pages/database/detail/detail")
  }
    /* 通用数据库组件 end */
  ]
}];

const router = new VueRouter({
  mode: "history",
  routes: routes
});

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err)
// }

export default router;
