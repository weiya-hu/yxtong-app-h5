药智数据企业版
=======
# 药智数据企业版 - vip.yaozh.com

## <i class="icon-list"></i> 索引

* [技术栈](#技术栈)
* [项目运行](#项目运行)
* [api说明](#api说明)
* [项目说明](#项目说明)
* [目标功能](#目标功能)
* [pages详解](#pages详解)
* [项目布局](#项目布局)
* [初版产品遗留题](#初版产品遗留题)
* [特殊说明](#特殊说明)

## 技术栈

-vue (前端框架，版 本2.x)
-vue - router (路由)
-vuex (状态管理)
-webpack (模块打包器)
-ES6 (语法)
-LESS (css预处理)
-npm / yarn (包管理)
-element

## 项目运行

``` bash
# install dependencies
yarn install

# serve with hot reload at your IP address at 80 port
# 如需修改为localhost:8080端口查看，需要把package.json中scripts => dev => "webpack-dev-server --host 0.0.0.0 --inline --progress --config build/webpack.dev.conf.js" 改为 "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"，并在config文件夹的index.js中的port改为8080。
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report

# run unit tests
yarn run unit

# run e2e tests
yarn run e2e

# run all tests
yarn test

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## api说明

- 本地配置代理将地址中带/api代理到http://apidb.yaozh.com
- http://apidb.yaozh.com/config/search?dbname=zhuce
    + 获取药智数据的普通搜索和高级搜索条件及相应的select选项
    + 普通搜索中的提示词接口地址为search_hint参数的值，接口传递参数使用对于的name参数的值
- http://apidb.yaozh.com/zhuce
    + 获取注册数据库筛选条件及按受理号浏览的列表内容
- http://apidb.yaozh.com/config/nav
    + 获取左侧数据库导航信息
- http://apidb.yaozh.com/zhuce/namelist?name=葡萄糖注射液
    + 按药品名称查询列表
- http://apidb.yaozh.com/zhuce/qiyelist?name=葡萄糖注射液
    + 按企业名称查询列表
    + http://apidb.yaozh.com/zhuce/qiyegroup?name=葡萄糖注射液
        * 分组查询接口
- http://apidb.yaozh.com/zhuce/namelist?name=葡萄糖注射液
    + 按药品名称查询列表
    + http://apidb.yaozh.com/zhuce/namegroup?name=葡萄糖注射液
        * 分组
- http://apidb.yaozh.com/zhuce/outdata
    + 导出列表接口
    + 当存在按不同方式搜索的导出使用参数outdata_action: 
        注册数据库对应的值分别是：'name'/ 'qiye'/base(缺省值)
    + 导出字段使用参数outdata_column： 值用逗号链接 例如：outdata_column=shoulihao=受理号,jielun=审评结论
        - 带搜索条件的完整例子:http://apidb.yaozh.com/zhuce/outdata?order=&page=1&pageSize=20&outdata_action=base&outdata_column=shoulihao=受理号,name=药品名称,zhuceleixing=注册分类,shengfen=省份
    + 面包屑接口
        - http://apidb.yaozh.com/zhuce/visualization?lang=zh-cn&name=阿莫西林
    + 注册可视化顶部接口



## 项目说明
- 原型地址：https://axhub.im/pro/a5133df546241f68/#g=1&p=index_ （密码咨询李雪梅）
- 其他项目说明在tapd新版药智数据项目中，可让李雪梅添加成员到项目组
- 设计与刘琼林沟通
- 后端接口与彭家松或者魏邦银沟通
- 产品问题与李雪梅沟通

## 目标功能
- 登录及注册
- 忘记密码及找回密码
- 可搜索数据导航
- 综合搜索
- 综合搜索结果展示
- 条件筛选
- 高级搜索
- 筛选条件选择、已选展示、筛选条件保存、清空已选条件
- 注册数据库
    + 注册数据列表展示、排序、导出、翻页
        * 按受理号展示
        * 按药品名称展示
        * 按企业名称展示
    + 详情页
        * 基本信息展示
        * 注册时光轴
        * 注册生成现场展示检查公告
        * 注册生产现场检查进度
        * 药品研发历程
        * 竞品分析
        * 扩展信息展示
    + 智能分析（可视化）
        *   基本图形展示
        *   图形切换
        *   全屏显示
    + 注册情报展示
- 订阅管理
    + 注册订阅
    + 招投标动态
账户管理


## pages详解
- home：主页
- serch：搜索结果
- membercenter：会员中心
- companyreport：企业报告
- drugreport：药物报告
- zhuce：药品注册与受理数据库
- intelligent：智能分析系统

## 项目结构及说明
 /build webpack配置
 /config 开发构建环境配置
 /dist 编译后的在线上运行的资源文件
 /node_modules依赖包
 /src 主要文件
 /src/assests  存放图片 js 样式 图标等静态资源文件
 /src/components 存放的整个项目都在用的公共组件
 /src/components/inputs普通搜索和高级搜索的相关组件，其中带left为普通搜索
 /src/components/layouts 头部底部等公用组件
 /src/config 针对业务逻辑的配置文件夹 
 /src/config/noLoginPages 配置不需要登录的页面 例如updatelog
 /src/config/tableheads 配置单独开发库对应列表的表头 参照zhuce
 /src/http   截止2019.4.11 还未添加功能 
 /src/i18n 国际化处理
 /src/pages 业务逻辑页面 例如注册数据库的相关业务都在zhuce文件里 不同文件之间没有交集 database是通用数据库的文件 
 /src/router 路由配置文件 注意通用数据库配置放在最后一项 代码注释中有说明
 /src/store  状态维护用的仓库 vuex有详细的使用文档
 /src/APP.vue  根组件
 /src/main.js 文件入口
 /static 静态资源文件 没有被webpack处理


### 查询类数据类型设计
后续就参数名、类型（规范的方式表示）、说明、示例四个方面进行规范并绘制相应的数据流图便于描述逻辑业务和后期维护

```js
nomal_filed:[
    {
        name:""         //参数名
        accurate:""     //针对参数是否精确查询  精确
        label:"",      //中文解释
        placeholder:"", //输入框提示
        search_hint:"",         //针对搜索提示词
        type:"",            //控件类型 text、date、select、fullselect
        limit:[],             //针对时间快捷选择
        value:[]       //下拉选项options
    }
]
```

> advanced_filed 格式与 nomal_filed相同

```js
filters:{
    条件a: [
        {
            key:"key1",
            doc_count:number,
            label:""
        },
        {
            key:"key2",
            doc_count:number,
            label:""
        }
    ],
    条件b: {
        key:"",
        doc_count:number,
        label:""
    }
}
```

> 普通搜索 已选条件格式

```js
query：[
    {
        name:"",
        accurate:"",
        value:""
    }
]
```

> 高级搜索 已选条件格式

```js
words：[
    {
        logic:"",
        name:"",
        accurate:"",
        value:""
    }
]

处理成下方形式：

words:_and name=ces _and guifanzhuangtaizhongwen=待审评ღ在审评ღ在审评审批中ღ待审批
```

```js
//选中筛选条件
group:{
    "zhuceleixing":["6","5"],
    "yaopinleixing":["2"]
}

处理成下方形式（ღ 作为值为数组的连接符，这是与后端约定的防止读值错误）：

filter_condition:yaopinleixing=1ღ2ღ3ღ4ღ5 _and linchuang=LღS
```

### 普通搜索参数

```js
param={
    name:value,
    name:value,
    条件a:[key1,key2],
}

处理成下方形式
name=ces&shoulihao=dadsadas&qiyemingcheng=dasda
```

> 参数说明：时间范围：注册数据库的普通查询用begainxxx=date&endxxx=date，通用数据库用逗号，数组，冒号都可以

普通搜索参数

```js
http://apidb.yaozh.com/zhuce?name=ces&filter_condition=yaopinleixing%3D1%E1%83%A62%E1%83%A63%E1%83%A64%E1%83%A65
```

高级搜索参数

```js
http://apidb.yaozh.com/zhuce?words=_and+name%3Dces+_and+guifanzhuangtaizhongwen%3D%E5%BE%85%E5%AE%A1%E8%AF%84%E1%83%A6%E5%9C%A8%E5%AE%A1%E8%AF%84%E1%83%A6%E5%9C%A8%E5%AE%A1%E8%AF%84%E5%AE%A1%E6%89%B9%E4%B8%AD%E1%83%A6%E5%BE%85%E5%AE%A1%E6%89%B9&filter_condition=yaopinleixing%3D1%E1%83%A62%E1%83%A63%E1%83%A64%E1%83%A65
```

> 参数说明：时间范围：注册数据库的普通查询用冒号例如：qiyechengbanshijian=20180512:20180614，通用数据库用逗号，数组，冒号都可以

高级搜索逻辑logic

```js
logics: [
    {
        value:""    //_and _or _not
        label:""    //与或非
    }
]
```

存高级搜索项的condition

```js
condition:[
    {
        logic:"_and"| "_or"| "_not",
        name:"",
        accurate:"精确"|undefined,
        label:"",
        value
    }
]
```

其他的独立参数 各自组件维护

```js
[page|pageSize|order]
page:number
pageSize:number
order:"asc"|"desc"
```

例如：`page` `pageSize` `order`

## 特殊说明

- components/inputs中的组件适用于各数据库的普通搜索和高级搜索输入框/下拉框/日期选择框/联级选择框
    + 截止2018年10月25日，暂只有`left-date-range-month.vue`、`left-date-range-year.vue`、`date-range-month.vue`、`date-range-year.vue`只在生物制品中使用到了
    （clearLeft和clearTheLeft方法也是生物制品中最新！）

### 导出pdf
- 涉及数据库：
    + 仿制药一致性评价动态
    + 药物报告详情
- 实现逻辑：绘制导出页面（@/pages/fzyyzx/jspdf/jspdf.vue）在页面中，不可隐藏，可定位移动到有效区域不可见。调用组件内集成方法`htmlCovertPdf`，html2canvas页面转图片，jspdf图片转pdf。`因页眉和页边距设置不同，固定数据和动态数据差异，与药物报告详情中生成pdf调用混入方法不一样`。
- 相关插件文档参考:
    + html2canvas： http://html2canvas.hertzen.com/documentation
    + Jspdf：https://github.com/MrRio/jsPDF
- `功能局限（提前告知产品）`：
    + pdf生成速度与数据量和页面数量成正比；
    + canvas跨域图片不显示；
    + 固定排版数据能够做到理想分页，每页可添加自定义页眉页脚页码（参照一致性评价动态），反之动态排版数据不能，分页会截断排版数据（参照药物报告详情）；
    + html2canvas对部分样式兼容不友好，已知element表格组件不显示边框（不一定），`<table/>`边框宽度不一致。

### 结构式检索编辑器
- 涉及数据库：
    + 结构式检索数据库
- 相关插件文档参考:
    + ketcher：https://github.com/epam/ketcher

    此插件是王总找的，当时就给过来一个压缩过的js文件，所有修改都是直接格式化后的直接修改，修改比较复杂困难，不建议大改动。已汉化部分操作提示，删掉多余功能。
- 注意的地方：
    + 此数据库需求是加到单表配置库，但跟单表库差别较大，考虑单表库的维护性最好后期单独开发；
    + 编辑器插件比较大，平时修改比较小，故没有打包进本地开发环境，本地无法访问，后续若改动大需要本地测试，可根据需要修改配置；
    + 编辑器加入3种搜索类型：精确，子结构，相似度，其中子结构由于后端数据获取特殊，采用前端分页，其他类型后端分页。

### 公共组件方法
*   位置：@/components/common/GlobalMethods/
*   包括：`确认框（$Confirm）`，`图片放大（$Img）`，`消息提示（$Message）`，`404页面（$show404）`，全部通过extend构造组件。为方便调用方法全部挂载到vue实例，方法参数具体见代码。

### 其余功能点

#### 下拉框鼠标移出隐藏
* 项目中下拉框均使用element组件，组件添加ref能够操作组件内数据，不同组件内对于下拉框的显示隐藏控制不一致，所以不同组件不同写法，统一写在func.js，`inputPopMouseleave`到`cascaderPopMouseleave`。

#### 输入框文字长度限制
* 只针对可检索的输入框，写入func.js，统一变量，一般输入框`inpMaxLen`（目前50），精确输入框`inpMaxLenJq`（目前300），后期修改限制长度直接改变量即可。
* 需添加提示的地方嵌套提示弹窗组件：`@/components/inputs/input-popover`，控制显示；方法`searchKeywords`（此方法本为公共部分参数统计方法，后改为后端统计，此方法保留做其他公共处理）控制参数。

#### 搜索词统计
* 公共部分的统计（普通高级搜索，热点搜索，条件筛选）为后端统计，前端只做除公共外的特殊搜索统计。
* 接口添加参数`searchname_zh`，值拼接方式参考医院销售数据库/api/yyxs/dlypxsqs接口，可直接调用func.js方法`keywordStatistics`，参数参考医院销售数据库或一致性评价分析系统。

#### 改写二级列表
* 为减少接口的重复调用，二级列表数据关联到一级列表数据，一级列表数据对象中添加second对象，second对象中关联单元格字段加入二级列表数据，其余操作不变。 