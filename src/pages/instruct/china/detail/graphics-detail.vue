<template>
  <div class="wrapper instruct-graphics" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list">
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" v-if="data_content.name" :title="data_content.name">{{ data_content.name }}</span>
            <div class="tag">
              <div>
                <div class="left-bottom" v-if="data_content.guifanqiye">
                  <span class="bottom-name">{{ data_content.guifanqiye }}</span>
                </div>
                <!-- <span class="id-green" v-if="data_title.second">{{
                data_title.second
            }}</span> -->
                <span class="id-green bg-blue" v-if="data_content.yibao == '1'" title="国家医保">国家医保</span>
                <span class="id-green bg-green" v-if="data_content.otcsort" :title="data_content.otcsort">
                  {{ data_content.otcsort }}
                </span>
                <span class="id-green bg-orange" v-if="data_content.yuanyan == 1 ? '原研' : ''"
                  :title="data_content.yuanyan == 1 ? '原研' : ''">
                  {{ data_content.yuanyan == 1 ? '原研' : ''}}
                </span>
                <span class="id-green" style="background: #5898FF;" v-if="data_content.yzxpj == '是'" title="一致性评价">
                  一致性评价
                </span>
                <span class="id-green" style="background: #5898FF;" v-if="data_content.leibie"
                  :title="data_content.leibie">
                  {{ data_content.leibie }}
                </span>
                <span class="id-green" style="background: #77C2F6;" v-if="data_content.tsdrug"
                  :title="data_content.tsdrug">
                  {{ data_content.tsdrug }}
                </span>
              </div>
              <p class="guige" v-if="isEmpty(data_content.guige)" :title="ToText(data_content.guige)">{{
              ToText(data_content.guige) }}
              </p>
            </div>
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{ allBase.dbname }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!-- 详情模板1 -->
      <div class="main analysis-html">
        <div class="left-nav" :style="dynamicCalcPisition()">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item parent-nav active2" v-if="
              isEmpty(timeData) ||
              isEmpty(nameData) ||
              data_content.chengfen ||
              data_content.xingzhuang ||
              data_content.zhuzhi ||
              data_content.guige ||
              data_content.yongfa ||
              data_content.fanying ||
              data_content.jingji ||
              data_content.zhuyi ||
              isEmpty(yfData) ||
              data_content.child ||
              data_content.old ||
              data_content.xianghuzhuoyong ||
              data_content.guoliang ||
              data_content.clinical ||
              data_content.yaoli ||
              data_content.donglixue ||
              data_content.zhucang ||
              data_content.baozhuang ||
              data_content.youxiaoqi ||
              data_content.zhixingbiaozhun ||
              data_content.pizhunwenhao ||
              data_content.source
            " @click="nav1Show = !nav1Show">药品说明书
              <img src="@/assets/imgs/nav/arrow-active.png" v-if="nav1Show" class="icon" height="7" width="11" />
              <img src="@/assets/imgs/nav/arrow.png" v-else class="icon" height="11" width="7" />
            </a>
            <Collapse v-show="nav1Show">
              <div class="container nav-event" v-show="nav1Show">
                <a class="nav-item sub-nav-item" v-if="isEmpty(timeData)">修改日期</a>
                <a class="nav-item sub-nav-item" v-if="isEmpty(nameData)">药品名称</a>
                <a class="nav-item sub-nav-item" v-if="data_content.chengfen">成份</a>
                <a class="nav-item sub-nav-item" v-if="data_content.xingzhuang">性状</a>
                <a class="nav-item sub-nav-item" v-if="data_content.zhuzhi">{{
                data_content.bianma.indexOf("Z") > -1 ? "功能主治" : "适应症"
                }}</a>
                <a class="nav-item sub-nav-item" v-if="data_content.guige">规格</a>
                <a class="nav-item sub-nav-item" v-if="data_content.yongfa">用法用量</a>
                <a class="nav-item sub-nav-item" v-if="data_content.fanying">不良反应</a>
                <a class="nav-item sub-nav-item" v-if="data_content.jingji">禁忌</a>
                <a class="nav-item sub-nav-item" v-if="data_content.zhuyi">注意事项</a>
                <a class="nav-item sub-nav-item" v-if="isEmpty(yfData)">孕妇及哺乳期妇女用药</a>
                <a class="nav-item sub-nav-item" v-if="data_content.child">儿童用药</a>
                <a class="nav-item sub-nav-item" v-if="data_content.old">老年用药</a>
                <a class="nav-item sub-nav-item" v-if="data_content.xianghuzhuoyong">药物相互作用</a>
                <a class="nav-item sub-nav-item" v-if="data_content.guoliang">药物过量</a>
                <a class="nav-item sub-nav-item" v-if="data_content.clinical">临床试验</a>
                <a class="nav-item sub-nav-item" v-if="data_content.yaoli">药理毒理</a>
                <a class="nav-item sub-nav-item" v-if="data_content.donglixue">药代动力学</a>
                <a class="nav-item sub-nav-item" v-if="data_content.zhucang">贮藏</a>
                <a class="nav-item sub-nav-item" v-if="data_content.baozhuang">包装</a>
                <a class="nav-item sub-nav-item" v-if="data_content.youxiaoqi">有效期</a>
                <a class="nav-item sub-nav-item" v-if="data_content.zhixingbiaozhun">执行标准</a>
                <a class="nav-item sub-nav-item" v-if="data_content.pizhunwenhao">批准文号</a>
                <a class="nav-item sub-nav-item" v-if="data_content.source">生产企业</a>
                <a class="nav-item sub-nav-item" v-if="data.content_file_path">说明书详情</a>
              </div>
            </Collapse>
            <a class="nav-item parent-nav" v-if="
              data_content.hzyyjd ||
              data_content.renshenfenji ||
              data_content.buruqifenji ||
              data_content.yibao == '国家医保' ||
              data_content.otcsort ||
              data_content.atc
            " @click="nav2Show = !nav2Show">药智信息<img src="@/assets/imgs/nav/arrow-active.png" v-if="nav2Show"
                class="icon" height="7" width="11" />
              <img src="@/assets/imgs/nav/arrow.png" v-else class="icon" height="11" width="7" /></a>
            <Collapse>
              <div v-if="
                data_content.hzyyjd ||
                data_content.renshenfenji ||
                data_content.buruqifenji ||
                data_content.yibao == '国家医保' ||
                data_content.otcsort ||
                data_content.atc
              " class="container nav-event" v-show="nav2Show">
                <a v-if="data_content.hzyyjd" class="nav-item sub-nav-item">患者用药交代</a>
                <a v-if="data_content.renshenfenji" class="nav-item sub-nav-item">妊娠分级</a>
                <a v-if="data_content.buruqifenji" class="nav-item sub-nav-item">哺乳期分级</a>
                <a v-if="data_content.yibao == '国家医保'" class="nav-item sub-nav-item">医保类别</a>
                <a v-if="data_content.otcsort" class="nav-item sub-nav-item">OTC分类</a>
                <a class="nav-item sub-nav-item" v-if="data_content.atc">ATC分类</a>
              </div>
            </Collapse>
            <a v-if="unlabeleduse.datas.length > 0" class="nav-item parent-nav sub-nav-item alone-nav">超说明书用药</a>
            <a v-if="drugs.datas.length > 0" class="nav-item parent-nav sub-nav-item alone-nav">药物警戒</a>
            <a v-if="history.datas.length > 0" class="nav-item parent-nav sub-nav-item alone-nav">说明书历史版本</a>
            <a v-if="other.datas.length > 0" class="nav-item parent-nav sub-nav-item alone-nav">其他厂家说明书推荐</a>

            <a v-if="extendList && extendList.length > 0" class="nav-item parent-nav sub-nav-item alone-nav">扩展信息</a>

            <!--这里的name 和 css 类名第一个字段要一样-->
          </div>
        </div>
        <div class="right-list" :style="dynamicCalcPisition2()">
          <div class="list-in-left" :class="{
            'list-in-left-no-img': !data.Image || data.Image.length === 0
          }">
            <!-- 修改日期 -->
            <slide-lan :title="'药品说明书'" class="the-part part-one part-active the-alone">
              <template v-slot:header>
                <div>
                  <div v-if="isEmpty(data_showtuwenbutton) && data_showtuwenbutton.is_show == 1"
                    @click="linkTuWenPage(data_showtuwenbutton)" class="btn">查看文字版本</div>
                </div>
              </template>
              <table class="tb-xdrq" v-if="isEmpty(timeData)">
                <tr v-if="data_content.hezhunri">
                  <td class="part-detail-title">核准日期：</td>
                  <td>
                    <div class="reset-style" style="word-break: break-all;word-wrap: break-word;"
                      v-html="data_content.hezhunri"></div>
                  </td>
                </tr>
                <tr v-if="data_content.xiugairi">
                  <td class="part-detail-title">修改日期：</td>
                  <td>
                    <div class="reset-style" style="word-break: break-all;word-wrap: break-word;"
                      v-html="data_content.xiugairi"></div>
                  </td>
                </tr>
              </table>

              <div class="tips">
                <div class="name">{{ data_content.name }}说明书</div>
                <div style="display:flex;align-items:center;flex-direction: column;">
                  <p class="info">
                    <img src="@/assets/imgs/instruct/exclamation-mark.png" height="14" width="14"
                      style="margin-right: 6px;" />
                    {{
                    data_content.otcsort
                    ? "请仔细阅读说明书并按说明使用或在药师指导下购买和使用"
                    : "请仔细阅读说明书并在医师指导下使用"
                    }}
                  </p>
                  <p class="warning" v-if="data_content.warning" v-html="data_content.warning"></p>
                </div>
              </div>
            </slide-lan>

            <!-- 药品名称 -->
            <slide-lan :title="'【药品名称】'" class="the-part part-three" v-if="isEmpty(nameData)">
              <table class="tb-jbxx">
                <tr v-if="data_content.name">
                  <td class="part-detail-title">通用名称：</td>
                  <td>
                    <div class="link-div" @click="goList('name', data_content.name)" v-html="data_content.name"></div>
                  </td>
                </tr>
                <tr v-if="data_content.shangpinname">
                  <td class="part-detail-title">商品名称：</td>
                  <td>
                    <div class="link-div" @click="goList('name', data_content.shangpinname)"
                      v-html="data_content.shangpinname"></div>
                  </td>
                </tr>
                <tr v-if="data_content.englishname">
                  <td class="part-detail-title">英文名称：</td>
                  <td>
                    <div class="link-div" @click="goList('name', data_content.englishname)"
                      v-html="data_content.englishname"></div>
                  </td>
                </tr>
              </table>
            </slide-lan>

            <!-- 成份 -->
            <slide-lan :title="'【成份】'" class="the-part part-four" v-if="data_content.chengfen">
              <div class="reset-style" v-html="data_content.chengfen"></div>
            </slide-lan>

            <!-- 性状 -->
            <slide-lan :title="'【性状】'" class="the-part part-five" v-if="data_content.chengfen">
              <div class="reset-style" v-html="data_content.xingzhuang"></div>
            </slide-lan>

            <!-- 适应症 -->
            <slide-lan :title="
              data_content.bianma.indexOf('Z') > -1
                ? '【功能主治】'
                : '【适应症】'
            " class="the-part part-six" v-if="data_content.zhuzhi">
              <div class="reset-style" v-html="data_content.zhuzhi"></div>
            </slide-lan>

            <!-- 规格 -->
            <slide-lan :title="'【规格】'" class="the-part part-seven" v-if="data_content.guige">
              <div class="reset-style" v-html="data_content.guige"></div>
            </slide-lan>

            <!-- 用法用量 -->
            <slide-lan :title="'【用法用量】'" class="the-part part-eight" v-if="data_content.yongfa">
              <div class="reset-style" v-html="data_content.yongfa"></div>
            </slide-lan>

            <!-- 不良反应 -->
            <slide-lan :title="'【不良反应】'" class="the-part part-nine" v-if="data_content.fanying">
              <div class="reset-style" v-html="data_content.fanying"></div>
            </slide-lan>

            <!-- 禁忌 -->
            <slide-lan :title="'【禁忌】'" class="the-part part-ten" v-if="data_content.jingji">
              <div class="reset-style" v-html="data_content.jingji"></div>
            </slide-lan>

            <!-- 注意事项 -->
            <slide-lan :title="'【注意事项】'" class="the-part part-eleven" v-if="data_content.zhuyi">
              <div class="reset-style zhuyi" v-html="data_content.zhuyi"></div>
            </slide-lan>

            <!-- 孕妇及哺乳期妇女用药 -->
            <slide-lan :title="'【孕妇及哺乳期妇女用药】'" class="the-part part-twelve" v-if="isEmpty(yfData)">
              <div class="reset-style" v-html="data_content.pregnant"></div>
            </slide-lan>

            <!-- 儿童用药 -->
            <slide-lan :title="'【儿童用药】'" class="the-part part-thirteen" v-if="data_content.child">
              <div class="reset-style" v-html="data_content.child"></div>
            </slide-lan>

            <!-- 老年用药 -->
            <slide-lan :title="'【老年用药】'" class="the-part part-fourteen" v-if="data_content.old">
              <div class="reset-style" v-html="data_content.old"></div>
            </slide-lan>

            <!-- 药物相互作用 -->
            <slide-lan :title="'【药物相互作用】'" class="the-part part-fifteen" v-if="data_content.xianghuzhuoyong">
              <div class="reset-style" v-html="data_content.xianghuzhuoyong"></div>
            </slide-lan>

            <!-- 药物过量 -->
            <slide-lan :title="'【药物过量】'" class="the-part part-sixteen" v-if="data_content.guoliang">
              <div class="reset-style" v-html="data_content.guoliang"></div>
            </slide-lan>

            <!-- 临床试验 -->
            <slide-lan :title="'【临床试验】'" class="the-part part-seventeen" v-if="data_content.clinical">
              <div class="reset-style" v-html="data_content.clinical"></div>
            </slide-lan>

            <!-- 药理毒理 -->
            <slide-lan :title="'【药理毒理】'" class="the-part part-eighteen" v-if="data_content.yaoli">
              <div class="reset-style" v-html="data_content.yaoli"></div>
            </slide-lan>

            <!-- 药代动力学 -->
            <slide-lan :title="'【药代动力学】'" class="the-part part-nineteen" v-if="data_content.donglixue">
              <div class="reset-style" v-html="data_content.donglixue"></div>
            </slide-lan>

            <!-- 贮藏 -->
            <slide-lan :title="'【贮藏】'" class="the-part part-twenty" v-if="data_content.zhucang">
              <div class="reset-style" v-html="data_content.zhucang"></div>
            </slide-lan>

            <!-- 包装 -->
            <slide-lan :title="'【包装】'" class="the-part part-twenty-one" v-if="data_content.baozhuang">
              <div class="reset-style" v-html="data_content.baozhuang"></div>
            </slide-lan>

            <!-- 有效期 -->
            <slide-lan :title="'【有效期】'" class="the-part part-twenty-two" v-if="data_content.youxiaoqi">
              <div class="reset-style" v-html="data_content.youxiaoqi"></div>
            </slide-lan>

            <!-- 执行标准 -->
            <slide-lan :title="'【执行标准】'" class="the-part part-twenty-three" v-if="data_content.zhixingbiaozhun">
              <div class="reset-style" v-html="data_content.zhixingbiaozhun"></div>
            </slide-lan>

            <!-- 批准文号 -->
            <slide-lan :title="'【批准文号】'" class="the-part part-twenty-four" v-if="data_content.pizhunwenhao">
              <div class="reset-style" v-html="data_content.pizhunwenhao"></div>
            </slide-lan>

            <!-- 生产企业 -->
            <slide-lan :title="'【生产企业】'" class="the-part part-twenty-five the-qiye" v-if="data_content.source">
              <div class="part-detail-title" style="display: flex;align-items: center;font-weight: normal;">
                企业名称：
                <div v-if="isEmpty(data_content.qiyebianma) && data_content.source_is_show_url == 1" class="link-div"
                  style="display: inline-block" @click="goCompany_filter(data_content.qiyebianma)"
                  v-html="data_content.source"></div>
                <div v-else style="display: inline-block;" v-html="data_content.source"></div>
              </div>
            </slide-lan>

            <!-- 说明书详情 -->
            <slide-lan v-if="isEmpty(data.content_file_path)" :title="'【说明书详情】'" class="the-part part-twenty-five-one">
              <template v-slot:header>
                <img v-if="data.graphic_type == 1" class="magnifier" src="@/assets/imgs/instruct/magnifier.png"
                  width="28" height="28" title="点击放大" @click="() => $Img(data.content_file_path)" />
              </template>
              <img v-if="data.graphic_type == 1" width="100%" :src="data.content_file_path" />
              <iframe v-else-if="data.graphic_type == 2"
                :src="`/static/pdf/web/viewer.html?file=${encodeURIComponent(data.content_file_path)}`" width="100%"
                height="956px"></iframe>
            </slide-lan>

            <!-- 药智信息 -->
            <slide-lan :title="'药智信息'" class="the-part part-twenty-six the-alone" v-if="
              data_content.hzyyjd ||
              data_content.renshenfenji ||
              data_content.buruqifenji ||
              data_content.yibao == '国家医保' ||
              data_content.otcsort ||
              data_content.atc
            ">
            </slide-lan>

            <!-- 患者用药交代 -->
            <slide-lan :title="'【患者用药交代】'" class="the-part part-twenty-seven" v-if="data_content.hzyyjd">
              <div class="part-detail-content" v-html="data_content.hzyyjd"></div>
            </slide-lan>

            <!-- 妊娠分级 -->
            <slide-lan :title="'【妊娠分级】'" class="the-part part-twenty-eighteen" v-if="data_content.renshenfenji">
              <div class="part-detail-content" v-html="data_content.renshenfenji"></div>
            </slide-lan>

            <!-- 哺乳期分级 -->
            <slide-lan :title="'【哺乳期分级】'" class="the-part part-twenty-nineteen" v-if="data_content.buruqifenji">
              <div class="part-detail-content" v-html="data_content.buruqifenji"></div>
            </slide-lan>

            <!-- 国家医保 -->
            <slide-lan :title="'【医保类别】'" class="the-part part-thirty" v-if="data_content.yibao == '国家医保'">
              <div class="part-detail-content" v-html="data_content.yibao"></div>
            </slide-lan>

            <!-- 【OTC分类】 -->
            <slide-lan :title="'【OTC分类】'" class="the-part part-thirty-one" v-if="data_content.otcsort">
              <div class="part-detail-content" v-html="data_content.otcsort"></div>
            </slide-lan>

            <!-- 【ATC分类】 -->
            <slide-lan :title="'【ATC分类】'" class="the-part part-three" v-if="data_content.atc">
              <div class="part-detail-content">
                <div v-for="(item, index) in getAtcNames(data_content.atc)" :key="item" class="clearfix">
                  <div class="atc link" @click="linkList(item)">{{ item }}</div><br />
                  <span style="line-height: 20px;height: 20px;display: flex;margin-top: 5px;">
                    {{ getAtc(item,data_content.atcarr) }}
                  </span>
                  <br v-if="index % 2 != 0" />
                </div>
              </div>
            </slide-lan>

            <!-- 超说明书用药 -->
            <slide-lan v-if="unlabeleduse.currentDatas.length > 0" :title="'超说明书用药'"
              class="the-part part-fourty the-alone">
              <el-table :data="unlabeleduse.currentDatas" style="width: 100%;" header-cell-class-name="header-class"
                cell-class-name="cell-class" border stripe>
                <el-table-column v-for="item in unlabeleduse.tableHead" :prop="item.field"
                  :min-width="item.field_width || item.width || 150" :key="item.field" :label="item.label">
                  <template slot-scope="{row}">
                    <!-- <el-tooltip effect="light">
                      <div slot="content"> -->
                    <el-popover trigger="hover" popper-class="instruct-detail-tooltip">
                      <div v-if="item.field === 'indication'" class="td-line2">
                        {{row[item.field]}}
                      </div>
                      <div v-else-if="item.field === 'name'" @click="linkToUnlabeleduse(row)" class="link">
                        {{row[item.field]}}
                      </div>
                      <div v-else>
                        {{row[item.field]}}
                      </div>
                      <!-- </div> -->

                      <template slot="reference">
                        <div v-if="item.field === 'indication'" class="td-line2">
                          {{row[item.field]}}
                        </div>
                        <div v-else-if="item.field === 'name'" @click="linkToUnlabeleduse(row)" class="link overflow">
                          {{row[item.field]}}
                        </div>
                        <div v-else class="overflow">
                          {{row[item.field]}}
                        </div>
                      </template>
                    </el-popover>
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination v-if="unlabeleduse.count>unlabeleduse.pageSize" @current-change="unlabeledusePageChange"
                :current-page="unlabeleduse.page" :page-size="unlabeleduse.pageSize" layout="total, prev, pager, next"
                :total="unlabeleduse.count">
              </el-pagination>
            </slide-lan>
            <el-dialog :visible.sync="dialogVisible" width="1200px" :modal-append-to-body="false" @closed="dialogClose">
              <div slot="title" class="dialog-header">
                {{ modalObj.title }}
              </div>
              <div v-html="modalObj.content"></div>
            </el-dialog>

            <!-- 药物警戒 -->
            <slide-lan v-if="drugs.currentDatas.length > 0" :title="'药物警戒'" class="the-part part-fifty the-alone">
              <el-table :data="drugs.currentDatas" style="width: 100%;" header-cell-class-name="header-class"
                cell-class-name="cell-class" border stripe>
                <el-table-column v-for="item in drugs.tableHead" :prop="item.field"
                  :min-width="item.field_width || item.width || 150" :key="item.field" :label="item.label">
                  <template slot-scope="{row}">
                    <!-- <el-tooltip effect="light">
                      <div slot="content"> -->
                    <el-popover trigger="hover" popper-class="instruct-detail-tooltip">
                      <div v-if="item.field === 'name' && isEmpty(row.content)" @click="infoModal(row)" class="link">
                        {{row[item.field]}}
                      </div>
                      <div v-else-if="item.field === 'name' && !isEmpty(row.content)">
                        {{row[item.field]}}
                      </div>
                      <div v-else>
                        {{row[item.field]}}
                      </div>
                      <!-- </div> -->

                      <template slot="reference">
                        <div v-if="item.field === 'name' && isEmpty(row.content)" @click="infoModal(row)"
                          class="link overflow">
                          {{row[item.field]}}
                        </div>
                        <div v-else-if="item.field === 'name' && !isEmpty(row.content)" class="overflow">
                          {{row[item.field]}}
                        </div>
                        <div v-else class="overflow">
                          {{row[item.field]}}
                        </div>
                      </template>
                    </el-popover>
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination v-if="drugs.count>drugs.pageSize" @current-change="drugsPageChange"
                :current-page="drugs.page" :page-size="drugs.pageSize" layout="total, prev, pager, next"
                :total="drugs.count">
              </el-pagination>
            </slide-lan>

            <!-- 说明书历史版本 -->
            <slide-lan v-if="history.currentDatas.length > 0" :title="'说明书历史版本'" class="the-part part-sixty the-alone">
              <el-table :default-sort="{prop: 'zuixinxiugairi', order: 'descending'}" :data="history.currentDatas"
                style="width: 100%;" header-cell-class-name="header-class" cell-class-name="cell-class" border stripe>
                <el-table-column v-for="item in history.tableHead" :prop="item.field"
                  :min-width="item.field_width || item.width || 150" :key="item.field" :label="item.label"
                  :sortable="item.sortable || false">
                  <template slot-scope="{row}">
                    <!-- <el-tooltip effect="light">
                      <div slot="content"> -->
                    <el-popover trigger="hover" popper-class="instruct-detail-tooltip">
                      <div v-if="item.field === 'name'" @click="linkTypeDetail(row)" class="link">
                        {{row.name}}<span v-if="isEmpty(row.shangpinname)">（{{ row.shangpinname }}）</span>
                      </div>
                      <div v-else-if="item.field === 'guige'">
                        {{ToText(row[item.field])}}
                      </div>
                      <div v-else>
                        {{row[item.field]}}
                      </div>
                      <!-- </div> -->

                      <template slot="reference">
                        <div v-if="item.field === 'name'" style="display:flex;align-items:center"
                          @click="linkTypeDetail(row)" class="link">
                          <div class="name-table">
                            <span>{{row.name}}</span>
                            <span v-if="isEmpty(row.shangpinname)">（{{ row.shangpinname }}）</span>
                          </div>
                          <div :class="['cell-tag','tag', Number(row.xiangqing) == 1 ? 'text' : 'img']"
                            v-if="Number(row.xiangqing) > 0">{{
                            Number(row.xiangqing) == 1 ? '文' : '图' }}</div>
                        </div>
                        <div v-else-if="item.field === 'guige'" class="td-line2">
                          {{ToText(row[item.field])}}
                        </div>
                        <div v-else-if="item.field === 'pizhunwenhao'" class="td-line2">
                          {{row[item.field]}}
                        </div>
                        <div v-else class="overflow">
                          {{row[item.field]}}
                        </div>
                      </template>
                    </el-popover>
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination v-if="history.count>history.pageSize" @current-change="historyPageChange"
                :current-page="history.page" :page-size="history.pageSize" layout="total, prev, pager, next"
                :total="history.count">
              </el-pagination>
            </slide-lan>

            <!-- 其他厂家说明书推荐 -->
            <slide-lan v-if="other.currentDatas.length > 0" :title="'其他厂家说明书推荐'"
              class="the-part part-seventy the-alone">
              <el-table :default-sort="{prop: 'zuixinxiugairi', order: 'descending'}" :data="other.currentDatas"
                style="width: 100%;" header-cell-class-name="header-class" cell-class-name="cell-class" border stripe>
                <el-table-column v-for="item in other.tableHead" :prop="item.field"
                  :min-width="item.field_width || item.width || 150" :key="item.field" :label="item.label"
                  :sortable="item.sortable || false">
                  <template slot-scope="{row}">
                    <!-- <el-tooltip effect="light">
                      <div slot="content"> -->
                    <el-popover trigger="hover" popper-class="instruct-detail-tooltip">
                      <div v-if="item.field === 'name'" @click="linkTypeDetail(row)" class="link">
                        {{row.name}}<span v-if="isEmpty(row.shangpinname)">（{{ row.shangpinname }}）</span>
                      </div>
                      <div v-else-if="item.field === 'guige'">
                        {{ToText(row[item.field])}}
                      </div>
                      <div v-else>
                        {{row[item.field]}}
                      </div>
                      <!-- </div> -->

                      <template slot="reference">
                        <div v-if="item.field === 'name'" style="display:flex;align-items:center"
                          @click="linkTypeDetail(row)" class="link">
                          <div class="name">
                            <span>{{row.name}}</span>
                            <span v-if="isEmpty(row.shangpinname)">（{{ row.shangpinname }}）</span>
                          </div>
                          <div :class="['cell-tag','tag', Number(row.xiangqing) == 1 ? 'text' : 'img']"
                            v-if="Number(row.xiangqing) > 0">{{
                            Number(row.xiangqing) == 1 ? '文' : '图' }}</div>
                        </div>
                        <div v-else-if="item.field === 'guige'" class="td-line2">
                          {{ToText(row[item.field])}}
                        </div>
                        <div v-else-if="item.field === 'pizhunwenhao'" class="td-line2">
                          {{row[item.field]}}
                        </div>
                        <div v-else class="overflow">
                          {{row[item.field]}}
                        </div>
                      </template>
                    </el-popover>
                    <!-- </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
              <div class="btn-area">
                <div class="more-btn" @click="lookMore">查看全部</div>
              </div>
              <!-- <el-pagination v-if="other.count>other.pageSize" @current-change="otherPageChange"
                :current-page="other.page" :page-size="other.pageSize" layout="total, prev, pager, next"
                :total="other.count">
              </el-pagination> -->
            </slide-lan>

            <slide-lan :title="'扩展信息'" class="the-part part-eighty the-alone"
              v-if="extendList && extendList.length > 0">
              <div class="extend-list">
                <ExtendButton class="reset-style" v-for="(item, index) in extendList" :key="index" :item="item">
                </ExtendButton>
              </div>
            </slide-lan>
          </div>
          <div class="list-in-right" v-if="data.Image && data.Image.length > 0">
            <slide-lan :title="'包装图片'" class="the-part part-twenty-six the-alone">
              <img title="点击放大" @click="() => $Img(item)" v-for="(item, index) in data.Image" :key="index" :src="item"
                alt="" class="right_img" />
            </slide-lan>
          </div>
        </div>
      </div>
    </div>
    <la-footer></la-footer>
  </div>
</template>
<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import ExtendButton from "@/components/common/extend-button";
import SlideLan from "@/components/common/slide-lan";
import LaFooter from "@/components/layouts/footer";
import detailScrollMixins from "@/mixins/detailScroll.js";
import { mapState } from "vuex";
import Collapse from "@/assets/js/Collapse.js";

export default {
  components: {
    LoadingGif,
    SlideLan,
    LaFooter,
    ExtendButton,
    Collapse
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      dialogVisible: false,
      modalObj: {
        title: "",
        content: ""
      },
      nav1Show: true,
      nav2Show: false,
      isLoading: true,
      id: this.$route.params.id,
      scroll: "",
      data: {},
      heightArr: [],
      // 数据
      data_title: {},
      // 数据模板0
      data_content: {},
      data_showtuwenbutton: {}, // 图文跳转按钮 0.无 1.查看文字详情 2.查看图片详情
      timeData: {}, // 修改日期
      nameData: {}, // 药品名称
      yfData: {}, // 孕妇及哺乳期妇女用药
      yzData: {}, // 药智信息
      // 超说明书用药
      unlabeleduse: {
        datas: [],
        currentDatas: [],
        page: 1,
        pageSize: 2,
        count: 0,
        loading: true,
        tableHead: [
          { label: "药品名称", field: "name" },
          { label: "超说明书适应症", field: "shiyingzheng" },
          { label: "批准适应症", field: "indication" },
        ],
      },
      // 药物警戒
      drugs: {
        datas: [],
        currentDatas: [],
        page: 1,
        pageSize: 2,
        count: 0,
        loading: true,
        tableHead: [
          { label: "期数", field: "period" },
          { label: "标题", field: "name" },
          { label: "涉及适应症", field: "Indication" },
          { label: "来源", field: "source" },
        ],
      },
      // 说明书历史版本
      history: {
        datas: [],
        currentDatas: [],
        page: 1,
        pageSize: 2,
        count: 0,
        loading: true,
        tableHead: [
          { label: "药物名称", field: "name" },
          { label: "规格", field: "guige" },
          { label: "批准文号", field: "pizhunwenhao" },
          { label: "最新修改日期", field: "zuixinxiugairi", sortable: true },
        ],
      },
      // 其他厂家说明书推荐
      other: {
        datas: [],
        currentDatas: [],
        page: 1,
        pageSize: 5,
        count: 0,
        loading: true,
        tableHead: [
          { label: "药物名称", field: "name" },
          { label: "规格", field: "guige" },
          { label: "说明书来源", field: "guifanqiye" },
          { label: "批准文号", field: "pizhunwenhao" },
          { label: "最新修改日期", field: "zuixinxiugairi", sortable: true },
        ],
      },
      // 扩展信息
      extendList: []
    };
  },
  computed: {
    ...mapState({
      nopms: state => state.ShuomingshuZg.nopms,
      allBase: state => state.ShuomingshuZg.allBase,
      helpInfo: state => state.ShuomingshuZg.helpInfo
    })
  },
  watch: {
    showPromtNotice(val) {
      if (val) {
        let headerHeight = $(".detail-header").height() || 0,
          noticeHeight = $(".la-header").height() || 0,
          height = 0;
        console.log(headerHeight, noticeHeight);
        headerHeight += 30;
        height = headerHeight + noticeHeight;
        $(".left-nav").css("height", "calc(100% - 120px)");
        if ($(".left-nav").css("top")) {
          $(".left-nav").css("top", height + 'px');
        }
      } else {
        $(".left-nav").css("height", "calc(100% - 100px)");
        if ($(".left-nav").css("top")) $(".left-nav").css("top", height + 'px');
      }
      this.dynamicCalcPisition()
      this.dynamicCalcPisition2()
    }
  },
  methods: {
    // 跳转到企业筛选系统去 带企业名称参数
    goCompany_filter(qiyebianma) {
      let { href } = this.$router.resolve({
        path: `/company_filter/${qiyebianma}`,
      })
      window.open(href, "_blank");
    },
    // 查看全部
    lookMore() {
      let { href } = this.$router.resolve({
        path: '/instruct',
        query: {
          name: this.data_content.name
        }
      })
      window.open(href, "_blank");
    },
    linkTypeDetail(row) {
      if (Number(row.xiangqing) > 0) {
        let path = ''
        switch (Number(row.xiangqing)) {
          // 文字详情页
          case 1:
            path = `/instruct/${row.id}`
            break;
          // 图片详情页
          case 2:
            path = `/instruct/graphics/${row.id}`
            break;
          // 修订详情页
          // case 3:
          //   path = `/instruct/graphics/${row.id}`
          //   break;
        }
        let { href } = this.$router.resolve({
          path
        })
        window.open(href, "_blank");
      }
    },
    dialogClose() {
      this.dialogVisible = false;
      this.modalObj.title = ''
      this.modalObj.content = ''
    },
    // 药物警戒-点击标题弹出正文弹框
    infoModal(row) {
      this.modalObj.title = row.name;
      this.modalObj.content = row.content;
      this.dialogVisible = true;
    },
    linkToUnlabeleduse(row) {
      let { href } = this.$router.resolve({
        path: `/unlabeleduse/${row.id}`
      });
      window.open(href, "_blank");
    },
    unlabeledusePageChange(page = 1) {
      this.unlabeleduse.currentDatas = this.unlabeleduse.datas.slice((page - 1) * this.unlabeleduse.pageSize, page * this.unlabeleduse.pageSize)
    },
    drugsPageChange(page = 1) {
      this.drugs.currentDatas = this.drugs.datas.slice((page - 1) * this.drugs.pageSize, page * this.drugs.pageSize)
    },
    historyPageChange(page = 1) {
      this.history.currentDatas = this.history.datas.slice((page - 1) * this.history.pageSize, page * this.history.pageSize)
    },
    otherPageChange(page = 1) {
      this.other.currentDatas = this.other.datas.slice((page - 1) * this.other.pageSize, page * this.other.pageSize)
    },
    dynamicCalcPisition() {
      let headerHeight = $(".detail-header").height() || 0,
        noticeHeight = $(".la-header").height() || 0,
        height = 0;
      headerHeight += 30;
      height = headerHeight + noticeHeight;
      console.log(headerHeight, noticeHeight);
      return {
        top: height + 'px',
        height: `${this.showPromtNotice ? 'calc(100% - 148px)' : 'calc(100% - 128px)'
          }`
      }
    },
    dynamicCalcPisition2() {
      let headerHeight = $(".detail-header").height() || 0;
      return {
        'padding-top': (headerHeight + 30) + 'px'
      }
    },
    // 跳转到图文版本详情页判断
    linkTuWenPage(showtuwenbutton) {
      // 跳转到文字版本
      if (showtuwenbutton.is_show == 1) {
        this.$router.push({
          path: `/instruct/${showtuwenbutton.id}`
        })
      }
    },
    linkList(atc) {
      let { href } = this.$router.resolve({
        path: "/instruct",
        query: {
          atc
        }
      });
      window.open(href, "_blank");
    },
    handleScroll() {
      // let top = $(".main").offset().top,
      //   leftNav = $(".left-nav");
      // if (top <= 50) {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 98) + "px");
      // } else {
      //   leftNav.css("top", (this.showPromtNotice ? 118 : 88) + "px");
      // }
    },
    goList(key, val) {
      val = val.replace(/<.*?>/gi, "");
      window.open(`/instruct?${key}=${val}`, "_blank");
    },
    // 加载完后移除加载界面
    removeLoading() {
      this.isLoading = false;
    },
    isEmpty(obj) {
      return _.keys(obj).length > 0;
    },
    handleAxios() {
      const that = this;
      let handlObj = (data, list) => {
        return _.omitBy(_.pick(data, list), _.isEmpty);
      };
      window
        .Axios({
          method: "get",
          url: "/api/instruct/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken")
          }
        })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let data = res.data.data;
            this.data = data;
            // 修改日期
            this.timeData = handlObj(data.Content, ["hezhunri", "xiugairi"]);
            // 药品名称
            this.nameData = handlObj(data.Content, [
              "name",
              "englishname",
              "shangpinname"
            ]);
            // 孕妇及哺乳期妇女用药
            this.yfData = handlObj(data.Content, [
              "pregnant",
              "renshenfenji",
              "buruqifenji"
            ]);
            // 药智信息
            this.yzData = handlObj(data.Content, [
              "yibao",
              "otcsort",
              "atc",
              "atcarr"
            ]);

            // 图文版本跳转按钮
            this.data_showtuwenbutton = data.showtuwenbutton;

            // 获取扩展信息的数据
            this.getExtendList("instruct", data.extendList);
            // 一一对应获取数据
            this.data_title = data.Title ? data.Title : {};
            this.data_content = data.Content;

            // 超说明书用药
            this.unlabeleduse.count = data.unlabeleduse.length;
            this.unlabeleduse.datas = data.unlabeleduse;
            this.unlabeleduse.currentDatas = this.unlabeleduse.datas.slice((this.unlabeleduse.page - 1) * this.unlabeleduse.pageSize, this.unlabeleduse.page * this.unlabeleduse.pageSize)
            this.unlabeleduse.loading = false;

            // 药物警戒
            this.drugs.count = data.drugs.length;
            this.drugs.datas = data.drugs;
            this.drugs.currentDatas = this.drugs.datas.slice((this.drugs.page - 1) * this.drugs.pageSize, this.drugs.page * this.drugs.pageSize)
            this.drugs.loading = false;

            // 说明书历史版本
            this.history.count = data.history.length;
            this.history.datas = data.history;
            this.history.currentDatas = this.history.datas.slice((this.history.page - 1) * this.history.pageSize, this.history.page * this.history.pageSize)
            this.history.loading = false;

            // 其他厂家说明书推荐
            this.other.count = data.other.length;
            this.other.datas = data.other;
            this.other.currentDatas = this.other.datas.slice((this.other.page - 1) * this.other.pageSize, this.other.page * this.other.pageSize)
            this.other.loading = false;

            this.dynamicCalcPisition()
            this.dynamicCalcPisition2()
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(this.removeLoading);
    },

    // 获取atc的中文
    getAtc(name, arr) {
      let str = "";
      if (arr) {
        for (let index in arr[name]) {
          str += arr[name][index].shuoming + " > ";
        }
        str = _.trimEnd(str, " > "); // 去除最后多余的" > "
      }
      return str;
    },
    getAtcNames(name) {
      return name ? name.replace(/\s+/g, "").split(";") : [];
    }
  },
  created() {
    setTimeout(() => {
      const hashLocation = sessionStorage.getItem("hashLocation"); //缓存中获取当前页面的路由名称
      // 注意, 这里使用全路径匹配,在hash模式中,因为地址会携带#,所以页面报告中的url需要重新覆盖一下, 将#去除
      window._paq.push(["setCustomUrl", "https://" + hashLocation]); //覆盖页面报告的url，可以自定义页面url，加上本页面路由
      window._paq.push(["trackPageView", this.allBase.dbname]); //页面名称,可以自定义页面名称
      window._paq.push(["setDocumentTitle", this.allBase.dbname]);
    }, 1000);
  },
  mounted() {
    Store.dispatch("ShuomingshuZg/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    this.isLoading = true;
    this.vueRouteToNoPms(this.nopms.xqy);
    this.handleAxios();
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

.link-div {
  text-decoration: underline;
  cursor: pointer;
  color: @Blue;
}

.instruct-detail-tooltip {
  min-width: unset !important;
  max-width: 400px;
  box-shadow: 1px 1px 4px 0px rgba(216, 222, 234, 0.5), -1px -1px 4px 0px rgba(216, 222, 234, 0.5);
}

.Reset() {
  padding: 0;
  margin: 0;
}

.instruct-company-name {
  width: 100%;
}

.wrapper.instruct-graphics {

  .btn-area {
    display: flex;
    justify-content: flex-end;

    .more-btn {
      margin-top: 10px;
      width: 90px;
      height: 24px;
      background: #4877E8;
      border-radius: 4px;
      line-height: 24px;
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      text-align: center;
      cursor: pointer;
    }
  }

  .el-dialog {
    box-shadow: 3px 3px 8px 0px rgb(188 188 188 / 70%);
    border-radius: 12px;

    .el-dialog__body {
      max-height: 500px;
      overflow: auto;
    }
  }

  .icon {
    display: flex;
    margin-right: 20px;
  }

  .detail-list {
    padding-bottom: 10px;

    .header-fixed {
      background: #FFFFFF;
      padding: 10px !important;
      height: auto !important;
      box-shadow: 0px 1px 8px 0px #d8e2fa;
    }

    .detail-header .header-left .left-top {
      width: unset !important;

      .tag {
        display: flex;
        flex-direction: column;

        &>div {
          display: flex;
          align-items: center;
        }

        span:not(:first-child) {
          margin-left: 10px !important;
        }
      }

      .top-id {
        max-width: 30vw !important;
        margin-right: 10px !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .guige {
        height: 15px;
        line-height: 13px;
        font-size: 13px;
        font-weight: 400;
        color: #545B6D;
        margin-top: 10px;
        max-width: 30vw !important;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .el-breadcrumb {
      display: inline-flex;
      white-space: nowrap;
    }

    .analysis-html {
      td {
        &>div {
          * {
            .Reset();
          }
        }
      }
    }

    // 主要信息部分
    .main {
      .reset-style {
        * {
          .Reset();
        }
      }

      /* 注意事项单独处理没有闭合的标签 2022-05-13 产品：张明 */
      .zhuyi * {
        white-space: normal;
      }

      .left-nav {
        overflow-y: auto;
        padding-bottom: 20px;
        box-sizing: border-box;
        background: #f0f2f9;
        z-index: 99;
      }

      // 右边 - 详细列表
      .right-list {
        display: flex;
        justify-content: space-between;

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .magnifier {
            cursor: pointer;
            margin-right: 36px;
          }
        }

        .el-table {
          .el-table__row td {
            border: none !important;
            height: 54px;
          }

          tbody td>.cell {
            display: flex;
          }
        }

        .header-class {
          height: 34px;
          line-height: 34px;

          .cell {
            font-size: 13px;
            line-height: 13px;
            font-weight: 600;
            color: #545B6D;
          }
        }

        .cell-class {
          height: 13px;
          line-height: 13px;
          font-size: 13px;
          font-weight: 400;
          color: #545B6D;

          .overflow {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
          }
        }

        .td-line2 {
          font-size: 13px;
          font-weight: 400;
          color: #545B6D;
          line-height: 19px;
          max-height: unset;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
        }

        .el-tooltip {
          height: 100%;
        }

        .el-pagination {
          .el-pagination__total {
            height: 13px;
            line-height: 20px;
            font-size: 13px;
            font-weight: 400;
            color: #666666 !important;
          }

          .btn-prev,
          .btn-next {
            border: 1px solid #DFE5F1;
          }

          .btn-prev {
            border-radius: 4px 0px 0px 4px;
          }

          .btn-next {
            border-radius: 0px 4px 4px 0px;
          }
        }

        .the-alone {
          box-shadow: 0px 1px 8px 0px #d8e2fa;
          border-radius: 4px;

          &:not(:first-child) {
            margin-top: 10px;
          }

          .header {
            height: 40px;
            line-height: 40px;
            background: #eff2fa;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:not(:first-child) {
              margin-top: 10px;
            }

            .lc {
              font-size: 16px;
              margin-left: 20px;
              font-weight: 600;
            }

            // .lc::before {
            //   width: 0;
            //   height: 0;
            // }
          }

          .content {
            border-bottom: unset;
          }
        }

        .list-in-left {
          // padding-right: 384px;
          display: inline-block;
          font-size: 13px;
          flex: 1;

          .the-alone {
            box-shadow: 0px 1px 8px 0px #d8e2fa;
            border-radius: 4px;

            &:not(:first-child) {
              margin-top: 10px;
            }

            .header {
              height: 40px;
              line-height: 40px;
              background: #eff2fa;

              &:not(:first-child) {
                margin-top: 10px;
              }

              .lc {
                font-size: 16px;
                margin-left: 20px;
                font-weight: 600;
              }

              // .lc::before {
              //   width: 0;
              //   height: 0;
              // }
            }

            .content {
              border-bottom: unset;
            }
          }

          .the-part {
            .part-detail-title {
              font-weight: bold;
              line-height: 22px;
              display: inline-block;
              vertical-align: top;
              white-space: nowrap;
            }

            .part-detail-content {
              margin: 5px 0 15px 0;
              line-height: 22px;

              * {
                .Reset();
              }
            }
          }

          .part-three {
            .content {
              // padding-top: 0 !important;
            }

            .clearfix {
              .atc {
                display: inline;
                height: 20px;
                line-height: 20px;
                font-size: 13px;
                font-weight: 400;
                padding-bottom: 2px;
                color: #545B6D;
                border-bottom: 1px solid #4877E8;
              }

              .link {
                color: #4877E8;
                cursor: pointer;
              }
            }
          }

          .the-qiye {
            .content {
              border-bottom: unset;
            }
          }

          .part-active {
            .header {
              .lc {
                color: #4877e8;
              }

              .lc::before {
                // background-color: #4877e8;
              }
            }
          }

          .part-one {

            .btn {
              padding: 0 8px;
              font-size: 14px;
              height: 24px;
              line-height: 24px;
              font-weight: 400;
              color: #FFFFFF;
              background: #4877E8;
              border-radius: 4px;
              margin-right: 24px;
              cursor: pointer;
            }

            .tb-jbxx {
              td {
                min-height: 22px;
                line-height: 22px;
              }

              tr {
                td {
                  img {
                    max-width: 200px;
                  }

                  &:nth-of-type(1) {
                    font-weight: bold;
                    text-align: right;
                    vertical-align: text-top;
                    padding-right: 10px;
                    min-width: 80px;
                  }

                  &:nth-of-type(2) {
                    div {
                      min-height: 22px;
                      line-height: 22px;
                    }
                  }
                }
              }
            }
          }

          .part-eight {
            .tb-xdrq {
              td {
                min-height: 22px;
                line-height: 22px;
              }

              tr {
                td {
                  &:nth-of-type(1) {
                    font-weight: bold;
                    text-align: right;
                    vertical-align: text-top;
                    padding-right: 10px;
                    min-width: 80px;
                  }

                  &:nth-of-type(2) {
                    div {
                      min-height: 22px;
                      line-height: 22px;
                      max-height: 66px;
                      overflow: hidden;
                    }
                  }
                }
              }
            }
          }
        }

        .tips {
          display: flex;
          // height: 40px;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: #f77b52;
          box-sizing: border-box;

          .warning {
            margin-top: 10px;
            // height: 13px;
            // line-height: 13px;
            font-size: 13px;
            font-weight: 500;
            color: #545B6D;
          }

          .name {
            height: 20px;
            font-size: 20px;
            font-weight: 600;
            color: #545b6d;
            line-height: 20px;
            margin: 30px 0 10px 0;
          }

          .gth {
            width: 14px;
            height: 14px;
            line-height: 14px;
            border-radius: 50%;
            text-align: center;
            border: 1px solid #f77b52;
            font-size: 12px;
            margin-right: 6px;
          }

          .info {
            font-size: 13px;
            line-height: 13px;
            display: flex;
            align-items: center;
          }
        }

        .list-in-left-no-img {
          width: 100%;
          padding-right: 0;
        }

        .list-in-right {
          width: 380px;
          display: inline-block;
          margin-left: 10px;

          // position: absolute;
          // right: 0;
          // top: 0px;
          .content {
            padding: 30px 40px !important;
            width: auto;
            height: auto;

            .right_img {
              display: block;
              width: 262px;
              margin: 0 auto;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .left-nav {

    .active,
    .active::before,
    .nav-item,
    .nav-item:hover,
    .nav-item:hover::before {
      height: 40px !important;
    }

    .nav-item:hover,
    .active {
      border-radius: 4px;
      color: #4877e8 !important;
    }
  }
}

.slide-lan .content {
  margin: 0 20px;
  padding: 15px 0 10px 0 !important;
  border-bottom: 0 !important;
}

.slide-lan .header .lc {
  margin-left: 10px !important;
}

@media screen and (max-width: 1600px) {}

@media screen and (max-width: 1400px) {}

@media all and (-ms-high-contrast: none),
(-ms-high-contrast: active) {

  .left-bottom,
  .bottom-name,
  .id-green {
    display: block !important;
  }
}

.slide-lan .header .lc::before {
  background: none !important;
}

.sub-nav-item:hover {
  background: none !important;
  box-shadow: none !important;
}

.nav-item.sub-nav-item:hover {
  .nav-item.sub-nav-item::before {
    background: none !important;
  }
}

.nav-item:hover::before {
  background: none !important;
}

.nav-item:not(:first-child) {
  border-top: 1px solid #dfe5f1;
}

.nav-item {
  padding-left: 22px !important;
  border-bottom: 0 !important;
}

.parent-nav:hover,
.parent-nav.active:hover {

  .parent-nav::before,
  .active::before {
    background: #4877e8 !important;
  }
}

.active:hover::before {
  background: #4877e8 !important;
}

.nav-item.sub-nav-item.active,
.nav-item.sub-nav-item.active::before {
  background: transparent !important;
}

.nav-item.sub-nav-item.active {
  box-shadow: none !important;
}

.nav-item:hover::before {
  background: none !important;
}

.parent-nav {
  height: 40px;
  background: #ffffff;
  box-shadow: 0px 1px 8px 0px rgba(216, 226, 250, 0.5);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #545b6d;
  line-height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    margin-top: 10px;
  }
}

.parent-nav.active {
  .parent-nav::before {
    background: #4877e8 !important;
  }
}

.parent-nav:hover {
  background: #fff !important;
}

.active2 {
  color: #4877e8 !important;
}

.active2::before {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: @PrimaryColor;
  border-radius: 4px;
}
</style>


<style lang="less" scoped>
.link {
  font-size: 13px;
  font-weight: 400;
  color: #4877E8;
  cursor: pointer;
  overflow: unset;
}

.name-table {
  width: calc(100% - 30px);
  flex-shrink: 0;
  min-width: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tag {
  width: 30px;
  max-width: 100%;
  flex-shrink: 0;
}

.cell-tag {
  width: 30px;
  height: 13px;
  line-height: 13px;
  font-size: 13px;
  border-radius: 7px;
  font-weight: 400;
  color: #FFFFFF;
  text-align: center;
  display: inline-block;
  margin-left: 5px !important;
}

.img {
  background: #90C320;
}

.text {
  background: #F5A623;
}
</style>