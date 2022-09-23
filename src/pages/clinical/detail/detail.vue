<template>
  <div class="wrapper clinical-detail" ref="wrapper">
    <!-- 自定义加载界面 -->
    <LoadingGif :loadFlag="isLoading" v-if="isLoading"></LoadingGif>
    <!-- 加载完成显示部分 -->
    <div class="detail-list" v-else>
      <div class="detail-header header-fixed">
        <div class="header-left">
          <div class="left-top">
            <span class="top-id" :title="data.title">{{ data.title }}</span>
          </div>

          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><a href="/home">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item><a :href="'/' + allBase.dbename">{{
                allBase.dbname
            }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>详情页</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="main">
        <div class="left-nav" :style="{ top: (showPromtNotice ? 128 : 98) + 'px' }">
          <div class="nav-list nav-event" @click="handleNavClick">
            <a class="nav-item active">基本信息</a>
            <a class="nav-item" v-if="showSYLC">试验历程</a>
            <a class="nav-item" v-if="showSYXX">试验信息</a>
            <a class="nav-item" v-if="showZMXX">招募信息</a>
            <a class="nav-item" v-if="showJGXX">机构/研究者信息</a>
            <a class="nav-item" id="lcjg" v-if="showLCJG">临床结果文献</a>
            <a class="nav-item" v-if="showSYWJ">试验文件</a>
            <a class="nav-item" v-if="extendList && extendList.length">扩展信息</a>
          </div>
        </div>
        <div class="right-list">
          <slide-section :title="'基本信息'" ref="ScrollDom_1" class="the-part">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="data.title">
                  <td>试验通俗题目</td>
                  <td colspan="3">
                    <span>{{ data.title }}</span>
                  </td>
                </tr>
                <tr v-if="data.stitle">
                  <td>试验专业题目</td>
                  <td colspan="3">
                    <span>{{ data.stitle }}</span>
                  </td>
                </tr>
                <tr v-if="data.me_id">
                  <td>登记号</td>
                  <td colspan="3">
                    <span>{{ data.me_id }}</span>
                  </td>
                </tr>
                <tr v-if="man_info.otherids">
                  <td>其它研究编号</td>
                  <td colspan="3">
                    <span>{{ man_info.otherids }}</span>
                  </td>
                </tr>
                <tr v-if="data.register">
                  <td>注册地区</td>
                  <td colspan="3">
                    <span>{{ data.register }}</span>
                  </td>
                </tr>
                <tr v-if="data.recruitment || data.recruitment_guifan">
                  <td>试验状态</td>
                  <td colspan="3">
                    <p>{{ data.recruitment }}</p>
                    <p>{{ data.recruitment_guifan }}</p>
                  </td>
                </tr>
                <tr v-if="data.phases">
                  <td>试验分期</td>
                  <td colspan="3">
                    <span>{{ data.phases }}</span>
                  </td>
                </tr>
                <tr v-if="data.conditions1_guifan">
                  <td>疾病领域</td>
                  <td colspan="3">
                    <span>{{ data.conditions1_guifan }}</span>
                  </td>
                </tr>
                <tr v-if="data.conditions">
                  <td>疾病</td>
                  <td colspan="3">
                    <div class="td-line5" v-if="data.conditions">
                      <p v-html="data.conditions"></p>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.rare">
                  <td>罕见病</td>
                  <td colspan="3">
                    <div class="td-line5" v-if="data.rare">
                      <p v-html="data.rare"></p>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.interventions1_guifan">
                  <td>干预药物类别</td>
                  <td colspan="3">
                    <span>{{ data.interventions1_guifan }}</span>
                  </td>
                </tr>
                <tr v-if="data.dietary1_guifan">
                  <td>膳食补充剂类别</td>
                  <td colspan="3">
                    <span>{{ data.dietary1_guifan }}</span>
                  </td>
                </tr>
                <tr v-if="data.name_guifan">
                  <td>药物名称</td>
                  <td colspan="3">
                    <span>{{ data.name_guifan }}</span>
                  </td>
                </tr>
                <tr v-if="data.targets && data.targets.length">
                  <td>靶点全称</td>
                  <td class="td5" colspan="3">
                    <div class="td-line5">
                      <p v-for="(item, ix) in data.targets" :key="ix">
                        <a :href="
                          `https://${baseUrl}.yaozh.com/targetdatas/` +
                          item.id
                        " v-if="item.id" target="_blank" style="color: #4877e8">{{ item.name }}</a>
                        <span v-else>{{ item.name }}</span>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.targets_abbr && data.targets_abbr.length">
                  <td>靶点简称</td>
                  <td class="td5" colspan="3">
                    <div class="td-line5">
                      <p v-for="(item, ix) in data.targets_abbr" :key="ix">
                        <a :href="
                          `https://${baseUrl}.yaozh.com/targetdatas/` +
                          item.id
                        " v-if="item.id" target="_blank" style="color: #4877e8">{{ item.name }}</a>
                        <span v-else>{{ item.name }}</span>
                      </p>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.biomarker">
                  <td>生物标志物</td>
                  <td colspan="3">
                    <span>{{ data.biomarker }}</span>
                  </td>
                </tr>
                <tr v-if="data.liaofa">
                  <td>疗法类型</td>
                  <td colspan="3">
                    <span>{{ data.liaofa }}</span>
                  </td>
                </tr>
                <tr v-if="test_info.study_guifan">
                  <td>研究类型</td>
                  <td colspan="3">
                    <span>{{ test_info.study_guifan }}</span>
                  </td>
                </tr>
                <tr v-if="data.countries">
                  <td>试验国家/地区</td>
                  <td colspan="3">
                    <span>{{ data.countries }}</span>
                  </td>
                </tr>
                <tr v-if="data.fanwei">
                  <td>国际多中心试验</td>
                  <td colspan="3">
                    <span>{{ data.fanwei }}</span>
                  </td>
                </tr>
                <tr v-if="data.sponsor1_guifan">
                  <td>申办者/合作者类型</td>
                  <td colspan="3">
                    <span>{{ data.sponsor1_guifan }}</span>
                  </td>
                </tr>
                <tr v-if="data.sponsors">
                  <td>申办者</td>
                  <td colspan="3">
                    <span>{{ data.sponsors }}</span>
                  </td>
                </tr>
                <tr v-if="man_info.collaborator">
                  <td>合作者</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <p v-html="man_info.collaborator"></p>
                    </div>
                  </td>
                </tr>
                <tr v-if="man_info.funded">
                  <td>责任方</td>
                  <td colspan="3">
                    <span>{{ man_info.funded }}</span>
                  </td>
                </tr>
                <tr v-if="man_info.dmc">
                  <td>是否有数据监测委员会</td>
                  <td>
                    <span>{{ man_info.dmc }}</span>
                  </td>
                </tr>
                <tr v-if="man_info.regulated">
                  <td>是否FDA管制产品</td>
                  <td colspan="3">
                    <p v-html="man_info.regulated.replace(/;|；/g, ';<br>')"></p>
                  </td>
                </tr>
                <tr v-if="data.received">
                  <td>登记日期</td>
                  <td colspan="3">
                    <span>{{ data.received }}</span>
                  </td>
                </tr>
                <tr v-if="data.updated">
                  <td>最新变更日期</td>
                  <td colspan="3">
                    <span>{{ data.updated }}</span>
                  </td>
                </tr>
                <tr v-if="data.updateds">
                  <td>
                    最新公示日期
                    <el-tooltip class="item tooltips-position" effect="light" placement="right">
                      <div slot="content">
                        指最新一次试验内容变更后的公示日期。
                      </div>
                      <i class="el-icon-question cl-green"></i>
                    </el-tooltip>
                  </td>
                  <td colspan="3">
                    <span>{{ data.updateds }}</span>
                  </td>
                </tr>
                <tr v-if="data.keyword">
                  <td>试验关键词</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <p v-html="data.keyword"></p>
                    </div>
                  </td>
                </tr>
                <tr v-if="data.url">
                  <td>试验详情</td>
                  <td colspan="3">
                    <span @click="gaEvent(data.url)" class="span-a">查看</span>
                  </td>
                </tr>
                <!-- <tr v-if="data.interventions">
                  <td>干预措施</td>
                  <td colspan="3">
                    <div class="td-line5">
                      <p v-html="data.interventions"></p>
                    </div>
                  </td>
                </tr> -->
              </table>
            </div>
          </slide-section>

          <slide-section :title="'试验历程'" ref="ScrollDom_2" class="the-part part-two" v-if="showSYLC">
            <div class="tb-wrap">
              <div class="course-ul">
                <div class="status-block" v-if="test_course.firstreceived_days !== ''">
                  <!-- 提前提交 -->
                  <div class="status beforehand" v-if="test_course.firstreceived_days < 0">
                    提前<span class="day">{{ Math.abs(test_course.firstreceived_days) }}天</span>
                  </div>
                  <!-- 按时提交 -->
                  <div class="status ontime" v-else-if="test_course.firstreceived_days == 0">
                    按时提交
                  </div>
                  <!-- 延迟 -->
                  <div class="status delay" v-else-if="test_course.firstreceived_days >= 1">
                    延迟<span class="day">{{ Math.abs(test_course.firstreceived_days) }}天</span>
                  </div>
                </div>
                <div class="div_box" v-if="test_courseArr.length > 0" :style="{ flex: index == 0 ? '0' : '1' }"
                  v-for="(item, index) in test_courseArr" :key="index">
                  <template>
                    <div class="li-even" :class="{
                      dashBorder:
                        data.register === registerName &&
                        cyleBtnName[item.key] &&
                        cyleBtnName[item.key]['type'] == '计划',
                    }" v-if="index != 0">
                      <div v-if="timeSpentHandler(item) > 0" class="time-spent">
                        用时：{{ timeSpentHandler(item) }}天
                      </div>
                      <div v-if="timeSpentHandler(item) > 0" class="time-spent-line"></div>
                    </div>
                    <div class="li-odd" :class="{
                      mainComplete:
                        data.register === registerName &&
                        cyleBtnName[item.key] &&
                        cyleBtnName[item.key]['type'] == '计划',
                    }">
                      <!-- <span> -->
                      <!-- <template
                        v-if="
                          data.register === registerName &&
                          (cyleBtnName[item.key]['type'])
                        "
                        >({{
                          cyleBtnName[item.key]['type']
                        }})</template
                      > -->
                      <!-- </span> -->
                      <div :class="[
                        'empty-circle',
                        data.register === registerName &&
                          cyleBtnName[item.key] &&
                          cyleBtnName[item.key]['type'] == '计划'
                          ? 'empty-circle-b'
                          : '',
                        cyleBtnName[item.key] &&
                          cyleBtnName[item.key]['name'] == '试验结果公布'
                          ? 'borderBlue'
                          : '',
                      ]">
                        <!-- 前面这两个节点 临床验登记和首次公司这俩都是实心的 直接写死即可 因为他们就只有一个时间 没有计划和实际这两种情况 和产品向海罡于2022-5-20 16:40 讨论 -->
                        <div :class="[
                          (cyleBtnName[item.key] &&
                            cyleBtnName[item.key]['type'] == '实际') ||
                            index < 2
                            ? 'empty-circle-in'
                            : '',
                          data.register === registerName &&
                            cyleBtnName[item.key] &&
                            cyleBtnName[item.key]['type'] == '计划'
                            ? 'empty-circle-in-b'
                            : '',
                          cyleBtnName[item.key] &&
                            cyleBtnName[item.key]['name'] == '试验结果公布'
                            ? 'backgroundBlue'
                            : '',
                        ]"></div>
                      </div>
                      <div class="info" :class="
                        cyleBtnName[item.key] &&
                          cyleBtnName[item.key]['name'] == '试验结果公布'
                          ? 'special'
                          : ''
                      ">
                        <span class="first-title">{{
                            cyleBtnName[item.key] &&
                            cyleBtnName[item.key]["name"]
                        }}<span v-if="
  cyleBtnName[item.key] &&
  cyleBtnName[item.key]['name'] == '试验结果公布'
">
                            <el-tooltip class="item tooltips-position" style="margin-left: 10px" effect="light"
                              placement="right">
                              <div slot="content">
                                《FDA
                                修正案》规定要求在试验主要完成后1年内提交试验结果，否则可能面临每天最高
                                1 万美元的民事罚款。
                              </div>
                              <i class="el-icon-question cl-green"></i>
                            </el-tooltip>
                          </span></span>
                        <span class="second-title">{{ item.val[0] }}</span>
                        <span class="second-title" v-if="item.val[1]">{{
                            item.val[1]
                        }}</span>
                      </div>
                    </div>
                  </template>

                  <!-- <template v-if="item.key == 'received'">
                  <div class="li-even" v-if="index != 0"></div>
                  <div class="li-odd">
                    <span>{{ test_course.received }}</span>
                    <div class="empty-circle"></div>
                    <span>临床试验登记</span>
                  </div>
                </template>
                <template v-if="item.key == 'receiveds'">
                  <div class="li-even" v-if="index != 0"></div>
                  <div class="li-odd">
                    <span>{{ test_course.receiveds }}</span>
                    <div class="empty-circle"></div>
                    <span>首次公示</span>
                  </div>
                </template>
                <template v-if="item.key == 'start' || item.key == 'start_s'">
                  <div class="li-even" v-if="index != 0"></div>
                  <div class="li-odd">
                    <span>
                      {{
                        test_course[item.key]
                      }}
                      <template
                        v-if="
                          data.register === registerName &&
                          (test_course[item.key])
                        "
                        >({{ item.key == 'start' ? "实际" : "计划" }})</template
                      >
                    </span>
                    <div
                      :class="[
                        'empty-circle',
                        data.register === registerName &&
                        item.key !== 'start' &&
                        item.key == 'start_s'
                          ? 'empty-circle-b'
                          : '',
                      ]"
                    ></div>
                    <span>开始</span>
                  </div>
                </template>
                <template v-if="item.key == 'firstreceived'">
                  <div class="li-even" v-if="index != 0"></div>
                  <div class="li-odd">
                    <span>{{ test_course.firstreceived }}</span>
                    <div class="empty-circle"></div>
                    <span>首次结果</span>
                  </div>
                </template>
                <template
                  v-if="item.key == 'completions' || item.key == 'completions_s'"
                >
                  <div class="li-even" v-if="index != 0"></div>
                  <div class="li-odd">
                    <span>
                      {{
                        test_course.completions
                          ? test_course.completions
                          : test_course.completions_s
                      }}
                      <template
                        v-if="
                          data.register === registerName &&
                          (test_course.completions || test_course.completions_s)
                        "
                        >({{
                          test_course.completions ? "实际" : "计划"
                        }})</template
                      >
                    </span>
                    <div
                      :class="[
                        'empty-circle',
                        data.register === registerName &&
                        !test_course.completions &&
                        test_course.completions_s
                          ? 'empty-circle-b'
                          : '',
                      ]"
                    ></div>
                    <span>主要完成</span>
                  </div>
                </template>
                <template
                  v-if="item.key == 'completion' || item.key == 'completion_s'"
                >
                  <div class="li-even" v-if="index != 0"></div>
                  <div class="li-odd">
                    <span>
                      {{
                        test_course.completion
                          ? test_course.completion
                          : test_course.completion_s
                      }}
                      <template
                        v-if="
                          data.register === registerName &&
                          (test_course.completion || test_course.completion_s)
                        "
                        >({{
                          test_course.completion ? "实际" : "计划"
                        }})</template
                      >
                    </span>
                    <div
                      :class="[
                        'empty-circle',
                        data.register === registerName &&
                        !test_course.completion &&
                        test_course.completion_s
                          ? 'empty-circle-b'
                          : '',
                      ]"
                    ></div>
                    <span>完成</span>
                  </div>
                </template> -->
                </div>
              </div>
              <div v-if="test_course.all_days != ''" class="all-days" :style="{ width: allDaysWidth + 'px' }">
                <div class="line2">
                  <span class="text">总用时：<span style="
                        height: 18px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #545b6d;
                        line-height: 18px;
                      ">{{ test_course.all_days }}天</span></span>
                  <span class="line"></span>
                </div>
                <div class="bottom-line">
                  <div class="line1"></div>
                  <div class="line3"></div>
                </div>
              </div>
            </div>
          </slide-section>

          <slide-section :title="'试验信息'" ref="ScrollDom_3" class="the-part" v-if="showSYXX">
            <template v-if="test_info.summary">
              <div class="detail-title"><span class="in">试验简介</span></div>
              <div class="tb-wrap">
                <p v-html="test_info.summary"></p>
              </div>
            </template>
            <template v-if="test_info.description">
              <div class="detail-title">
                <span class="in">试验详情介绍</span>
              </div>
              <div class="tb-wrap">
                <p class="max-790" v-html="test_info.description"></p>
              </div>
            </template>
            <!-- <template v-if="test_info.study_guifan">
              <div class="detail-title" style="margin-bottom: 20px">
                <span class="in">研究类型:</span>
                <span class="rela-span">{{ test_info.study_guifan }}</span>
              </div>
            </template> -->
            <template v-if="
              data.register == 'ClinicalTrials.gov美国'
                ? test_info.studydesignsList.length > 0
                : test_info.studydesigns
            ">
              <div class="detail-title"><span class="in">试验设计</span></div>
              <div class="tb-wrap">
                <!-- 注册机构（register字段）值=ClinicalTrials.gov美国 显示规则：遇到分号“；”，换一行-->
                <!-- 注册机构（register字段）值≠ClinicalTrials.gov美国 显示规则：遇到一个“<br>”，换一行 -->
                <!-- v-html="test_info.studydesigns.replace(/;|；/g, ';<br>')" -->
                <!-- <p v-if="data.register == 'ClinicalTrials.gov美国'"
                  v-html="test_info.studydesigns.replace(/;|；/g, ';<br>')"></p>
                <p v-else v-html="test_info.studydesigns"></p> -->
                <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="test_info.studydesignsList"
                  class="custom-table">
                  <el-table-column :width="item.width" :class-name="item.label.includes('描述') ? 'td-line5' : ''"
                    v-for="(item, ix) in studydesignsHead" :prop="item.prop" :key="'studydesigns' + ix"
                    :label="item.label">
                    <template slot-scope="scope">
                      <el-tooltip v-if="item.label.includes('描述')" class="item tooltips-position" effect="light">
                        <div slot="content">
                          {{ scope.row[item.prop] }}
                        </div>
                        <span>{{ scope.row[item.prop] }}</span>
                      </el-tooltip>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <p v-else v-html="test_info.studydesigns"></p>
              </div>
            </template>
            <template v-if="
              data.register == 'ClinicalTrials.gov美国'
                ? test_info.studyarmsList.length > 0
                : test_info.studyarms
            ">
              <div class="detail-title"><span class="in">试验分组</span></div>
              <div class="tb-wrap">
                <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="test_info.studyarmsList"
                  class="custom-table">
                  <el-table-column :width="item.width" :class-name="item.label.includes('描述') ? 'td-line5' : ''"
                    v-for="(item, ix) in studyarmsHead" :prop="item.prop" :key="'studyarms' + ix" :label="item.label">
                    <template slot-scope="scope">
                      <el-tooltip v-if="item.label.includes('描述')" class="item tooltips-position" effect="light">
                        <div slot="content">
                          {{ scope.row[item.prop] }}
                        </div>
                        <span>{{ scope.row[item.prop] }}</span>
                      </el-tooltip>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <p v-else v-html="test_info.studyarms"></p>
              </div>
            </template>
            <template v-if="
              data.register == 'ClinicalTrials.gov美国'
                ? test_info.interventionsList.length > 0
                : data.interventions
            ">
              <div class="detail-title"><span class="in">干预措施</span></div>
              <div class="tb-wrap">
                <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="test_info.interventionsList"
                  class="custom-table">
                  <el-table-column :width="item.width" :class-name="item.label.includes('描述') ? 'td-line5' : ''"
                    v-for="(item, ix) in interventionsHead" :prop="item.prop" :key="'interventions' + ix"
                    :label="item.label">
                    <template slot-scope="scope">
                      <el-tooltip v-if="item.label.includes('描述')" class="item tooltips-position" effect="light">
                        <div slot="content">
                          {{ scope.row[item.prop] }}
                        </div>
                        <span>{{ scope.row[item.prop] }}</span>
                      </el-tooltip>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <p v-else v-html="data.interventions"></p>
              </div>
            </template>
            <template v-if="
              data.register == 'ClinicalTrials.gov美国'
                ? test_info.measuresList.length > 0
                : test_info.measures
            ">
              <div class="detail-title">
                <span class="in">主要结果指标</span>
              </div>
              <div class="tb-wrap">
                <!-- 注册机构（register字段）值=ClinicalTrials.gov美国 显示规则：遇到分号“；”，换一行 遇到一个“<br>”，换2行-->
                <!-- 注册机构（register字段）值≠ClinicalTrials.gov美国 显示规则：遇到一个“<br>”，换一行 -->
                <!-- <p v-if="data.register === registerName" v-html="
                  test_info.measures
                    .replace(/<br>/g, '<br><br>')
                    .replace(/;|；/g, ';<br>')
                "></p>
                <p v-else v-html="test_info.measures"></p> -->
                <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="test_info.measuresList"
                  class="custom-table">
                  <el-table-column :width="item.width" :class-name="
                    item.label.includes('描述') ||
                      item.label.includes('主要结果指标')
                      ? 'td-line5'
                      : ''
                  " v-for="(item, ix) in measuresHead" :prop="item.prop" :key="'measures' + ix" :label="item.label">
                    <template slot-scope="scope">
                      <el-tooltip v-if="
                        item.label.includes('描述') ||
                        item.label.includes('主要结果指标')
                      " class="item tooltips-position" effect="light">
                        <div slot="content">
                          {{ scope.row[item.prop] }}
                        </div>
                        <span>{{ scope.row[item.prop] }}</span>
                      </el-tooltip>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <p v-else v-html="test_info.measures"></p>
              </div>
            </template>
            <template v-if="
              data.register == 'ClinicalTrials.gov美国'
                ? test_info.measuressList.length > 0
                : test_info.measuress
            ">
              <div class="detail-title">
                <span class="in">次要结果指标</span>
              </div>
              <div class="tb-wrap">
                <!-- 注册机构（register字段）值=ClinicalTrials.gov美国 显示规则：遇到分号“；”，换一行 遇到一个“<br>”，换2行-->
                <!-- 注册机构（register字段）值≠ClinicalTrials.gov美国 显示规则：遇到一个“<br>”，换一行 -->
                <!-- <p v-if="data.register === registerName" v-html="
                  test_info.measuress
                    .replace(/<br>/g, '<br><br>')
                    .replace(/;|；/g, ';<br>')
                "></p>
                <p v-else v-html="test_info.measuress"></p> -->
                <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="test_info.measuressList"
                  class="custom-table">
                  <el-table-column :width="item.width" :class-name="
                    item.label.includes('描述') ||
                      item.label.includes('次要结果指标')
                      ? 'td-line5'
                      : ''
                  " v-for="(item, ix) in measuressHead" :prop="item.prop" :key="'measuress' + ix"
                    :label="item.label">
                    <template slot-scope="scope">
                      <el-tooltip v-if="
                        item.label.includes('描述') ||
                        item.label.includes('次要结果指标')
                      " class="item tooltips-position" effect="light">
                        <div slot="content">
                          {{ scope.row[item.prop] }}
                        </div>
                        <span>{{ scope.row[item.prop] }}</span>
                      </el-tooltip>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <p v-else v-html="test_info.measuress"></p>
              </div>
            </template>
            <!-- <template v-if="test_info.results || test_info.resultsurl">
              <div class="detail-title" style="margin-bottom: 20px">
                <span class="in">试验结果:</span>
                <span class="rela-span">{{
                  test_info.results ? test_info.results : ""
                }}</span>
                <span
                  @click="gaEvent(test_info.resultsurl)"
                  class="rela-span span-a"
                  v-if="test_info.resultsurl"
                  >查看详情</span
                >
              </div>
            </template> -->
            <!-- <template
              v-if="
                test_info.related_literature &&
                  test_info.related_literature.length
              "
            >
              <div class="detail-title"><span class="in">相关文献</span></div>
              <div class="tb-wrap">
                <p
                  v-for="(item, ix) in test_info.related_literature"
                  :key="ix"
                  class="overflow-g"
                >
                  <template v-if="item.title">
                    <span
                      v-if="item.url1"
                      @click="gaEvent(item.url1, item.title, ix + 1)"
                      class="span-a"
                      :title="item.title"
                      >{{ item.title }}</span
                    >
                    <span
                      v-else-if="item.url2"
                      @click="gaEvent(item.url2, item.title, ix + 1)"
                      class="span-a"
                      :title="item.title"
                      >{{ item.title }}</span
                    >
                    <span
                      v-else-if="item.url3"
                      @click="gaEvent(item.url3, item.title, ix + 1)"
                      class="span-a"
                      :title="item.title"
                      >{{ item.title }}</span
                    >
                    <span v-else :title="item.title">{{ item.title }}</span>
                  </template>
                </p>
              </div>
            </template> -->
          </slide-section>

          <slide-section :title="'招募信息'" ref="ScrollDom_4" class="the-part" v-if="showZMXX">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-if="recruitment_info.enrollment">
                  <td>受试者样本大小</td>
                  <td colspan="3">
                    <span>{{ recruitment_info.enrollment }}</span>
                  </td>
                </tr>
                <tr v-if="recruitment_info.gender">
                  <td>受试者性别</td>
                  <td colspan="3">
                    <span>{{ recruitment_info.gender }}</span>
                  </td>
                </tr>
                <tr v-if="recruitment_info.jkssz">
                  <td>是否有健康受试者</td>
                  <td colspan="3">
                    <span>{{ recruitment_info.jkssz }}</span>
                  </td>
                </tr>
                <tr v-if="recruitment_info.age">
                  <td>受试者年龄范围</td>
                  <td colspan="3">
                    <span>{{ recruitment_info.age }}</span>
                  </td>
                </tr>
                <tr v-if="recruitment_info.min">
                  <td>受试者最小年龄</td>
                  <td colspan="3">
                    <span>{{ recruitment_info.min }}</span>
                  </td>
                </tr>
                <tr v-if="recruitment_info.max">
                  <td>受试者最大年龄</td>
                  <td colspan="3">
                    <span>{{ recruitment_info.max }}</span>
                  </td>
                </tr>
                <!-- <tr>
                  <td>招募联系</td>
                  <td colspan="3">
                    <p v-html="recruitment_info.contacts"></p>
                  </td>
                </tr> -->
              </table>

              <template v-if="
                data.register == 'ClinicalTrials.gov美国'
                  ? recruitment_info.contactsList.length > 0
                  : recruitment_info.contacts
              ">
                <div class="detail-title">
                  <span class="in">招募联系</span>
                </div>
                <div class="tb-wrap">
                  <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="recruitment_info.contactsList"
                    class="custom-table">
                    <el-table-column :width="item.width" :class-name="
                      item.label.includes('描述') ? 'td-line5' : ''
                    " v-for="(item, ix) in contactsHead" :prop="item.prop" :key="'contacts' + ix"
                      :label="item.label">
                      <template slot-scope="scope">
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <p v-else v-html="recruitment_info.contacts"></p>
                </div>
              </template>

              <template v-if="
                data.register == 'ClinicalTrials.gov美国'
                  ? recruitment_info.rxbzList.length > 0
                  : recruitment_info.rxbz
              ">
                <div class="detail-title"><span class="in">入选标准</span></div>
                <div class="tb-wrap">
                  <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="recruitment_info.rxbzList"
                    class="custom-table">
                    <el-table-column width="100" type="index" label="序号" :index="indexMethod">
                    </el-table-column>
                    <el-table-column :width="item.width" :class-name="
                      item.label.includes('入选标准') ? 'td-line5' : ''
                    " v-for="(item, ix) in rxbzHead" :prop="item.prop" :key="'rxbz' + ix" :label="item.label">
                      <template slot-scope="scope">
                        <el-tooltip v-if="item.label.includes('入选标准')" class="item tooltips-position" effect="light">
                          <div slot="content">
                            {{ scope.row[item.prop] }}
                          </div>
                          <span>{{ scope.row[item.prop] }}</span>
                        </el-tooltip>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <p v-else v-html="recruitment_info.rxbz"></p>
                </div>
              </template>
              <template v-if="
                data.register == 'ClinicalTrials.gov美国'
                  ? recruitment_info.pcbzList.length > 0
                  : recruitment_info.pcbz
              ">
                <div class="detail-title"><span class="in">排除标准</span></div>
                <div class="tb-wrap">
                  <el-table border v-if="data.register == 'ClinicalTrials.gov美国'" :data="recruitment_info.pcbzList"
                    class="custom-table">
                    <el-table-column width="100" type="index" label="序号" :index="indexMethod">
                    </el-table-column>
                    <el-table-column :width="item.width" :class-name="
                      item.label.includes('排除标准') ? 'td-line5' : ''
                    " v-for="(item, ix) in pcbzHead" :prop="item.prop" :key="'pcbz' + ix" :label="item.label">
                      <template slot-scope="scope">
                        <el-tooltip v-if="item.label.includes('排除标准')" class="item tooltips-position" effect="light">
                          <div slot="content">
                            {{ scope.row[item.prop] }}
                          </div>
                          <span>{{ scope.row[item.prop] }}</span>
                        </el-tooltip>
                        <span v-else>{{ scope.row[item.prop] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <p v-else v-html="recruitment_info.pcbz"></p>
                </div>
              </template>
            </div>
          </slide-section>

          <slide-section :title="'机构/研究者信息'" ref="ScrollDom_5" class="the-part" v-if="showJGXX">
            <div class="tb-wrap">
              <template v-if="man_info.researcherList.length > 0">
                <div class="detail-title">
                  <span class="in">主要研究者</span>
                </div>
                <div class="tb-wrap">
                  <el-table border :data="man_info.researcherList" class="custom-table">
                    <el-table-column :width="item.width" :class-name="
                      item.label.includes('描述') ? 'td-line5' : ''
                    " v-for="(item, ix) in researcherHead" :prop="item.prop" :key="'researcher' + ix"
                      :label="item.label">
                      <template slot-scope="scope">
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>

              <template v-if="man_info.institutesList.length > 0">
                <div class="detail-title"><span class="in">试验机构</span></div>
                <div class="tb-wrap">
                  <!-- <p v-html="man_info.rxbz"></p> -->

                  <el-table border :data="man_info.institutesList" class="custom-table">
                    <el-table-column :width="item.width" :class-name="
                      item.label.includes('描述') ? 'td-line5' : ''
                    " v-for="(item, ix) in institutesHead" :prop="item.prop" :key="'institutes' + ix"
                      :label="item.label">
                      <template slot-scope="scope">
                        <span :title="scope.row[item.prop]">{{
                            scope.row[item.prop]
                        }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </div>
          </slide-section>

          <slide-section :title="'临床结果文献'" ref="ScrollDom_6" class="the-part" v-if="showLCJG">
            <template v-if="
              data.clinicalresults.length > 0 &&
              data.clinicalresults.some((item) => item.ly == '官方')
            ">
              <div class="detail-title">
                <span class="in">官网结果</span>
              </div>
              <div class="tb-wrap">
                <!-- <span @click="gaEvent(test_info.resultsurl)" class="rela-span span-a"
                  v-if="test_info.resultsurl">查看详情</span> -->
                <el-table border :data="data.clinicalresults.filter(item => item.ly == '官方')" class="custom-table">
                  <el-table-column :width="item.width" :class-name="item.label.includes('描述') ? 'td-line5' : ''"
                    v-for="(item, ix) in clinicalresultsHead" :prop="item.prop" :key="'clinicalresults' + ix"
                    :label="item.label">
                    <template slot-scope="scope">
                      <span v-if="item.prop != 'title'">
                          {{scope.row[item.prop]}}
                      </span>
                      <span v-else class="span-a" @click="
                        gaEvent(scope.row.url1, scope.row.title, ix + 1)
                      ">{{ scope.row[item.prop] }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
            <template v-if="
              data.clinicalresults.length > 0 &&
              data.clinicalresults.some((item) => item.ly == '文献')
            ">
              <div class="detail-title"><span class="in">试验文献</span></div>
              <div class="tb-wrap">
                <el-table border :data="data.clinicalresults.filter(item => item.ly == '文献')" class="custom-table overflow-g">
                  <el-table-column :width="item.width" :class-name="
                    item.label.includes('结果简介') ||
                      item.label.includes('结论简介')
                      ? 'td-line5'
                      : ''
                  " v-for="(item, ix) in clinicalresults2Head" :key="'clinicalresults2' + ix" :label="item.label">
                    <template slot-scope="scope">
                      <span v-if="item.prop != 'title'">
                        <el-tooltip v-if="
                          item.label.includes('结果简介') ||
                          item.label.includes('结论简介')
                        " class="item tooltips-position" effect="light" placement="right">
                          <div slot="content">
                            {{ scope.row[item.prop] }}
                          </div>
                          <span>{{ scope.row[item.prop] }}</span>
                        </el-tooltip>
                        <span class="">{{ scope.row[item.prop] }}</span>
                      </span>
                      <span v-else>
                        <span v-if="scope.row.url1" @click="
                          gaEvent(scope.row.url1, scope.row.title, ix + 1)
                        " class="span-a" :title="scope.row.title">{{ scope.row.title }}</span>
                        <span v-else-if="scope.row.url2" @click="
                          gaEvent(scope.row.url2, scope.row.title, ix + 1)
                        " class="span-a" :title="scope.row.title">{{ scope.row.title }}</span>
                        <span v-else-if="scope.row.url3" @click="
                          gaEvent(scope.row.url3, scope.row.title, ix + 1)
                        " class="span-a" :title="scope.row.title">{{ scope.row.title }}</span>
                        <span v-else :title="scope.row.title">{{
                            scope.row.title
                        }}</span>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </slide-section>

          <slide-section :title="'试验文件'" ref="ScrollDom_7" class="the-part" v-if="showSYWJ">
            <div class="tb-wrap">
              <table class="tb-t">
                <tr v-for="(item, index) in data.down" v-if="item.downurl" :key="'down' + index">
                  <td style="background: #fff">
                    <a :href="item.downurl" style="color: #4877e8" target="_blank">
                      {{ item.downname }}
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          </slide-section>

          <slide-section :title="'扩展信息'" ref="ScrollDom_8" class="the-part" v-if="extendList && extendList.length">
            <div class="extend-list">
              <ExtendButton v-for="(item, index) in extendList" :key="index" :item="item"></ExtendButton>
            </div>
          </slide-section>
        </div>
      </div>
    </div>
    <la-footer></la-footer>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import SlideSection from "@/components/common/slide-section";
import LaFooter from "@/components/layouts/footer";
import ExtendButton from "@/components/common/extend-button";
import { mapState } from "vuex";
import detailScrollMixins from "@/mixins/detailScroll.js";

export default {
  components: {
    LoadingGif,
    SlideSection,
    LaFooter,
    ExtendButton,
  },
  mixins: [detailScrollMixins],
  data() {
    return {
      baseUrl:
        location.href.includes("vip-dev") || location.href.includes("vip-local")
          ? "vip-dev"
          : "vip",
      showSYWJ: true, // 是否显示试验文件
      showLCJG: true, // 是否显示临床结果
      showJGXX: true, // 是否显示机构/研究者信息
      showZMXX: true, // 是否显示招募信息
      showSYXX: true, // 是否显示试验信息
      showSYLC: true, // 是否显示试验历程
      allDaysWidth: 0,
      // 试验设计表头
      studydesignsHead: [
        {
          prop: "DesignAllocation",
          label: "设计分配",
          minWidth: 200,
        },
        {
          prop: "DesignInterventionModel",
          label: "干预模型",
          minWidth: 200,
        },
        {
          prop: "DesignPrimaryPurpose",
          label: "主要目的",
          minWidth: 200,
        },
        {
          prop: "DesignInterventionModelDescription",
          label: "设计描述",
        },
        {
          prop: "DesignMasking",
          label: "盲法类型",
          minWidth: 200,
        },
        {
          prop: "DesignWhoMasked",
          label: "设盲人员",
          minWidth: 200,
        },
        {
          prop: "DesignMaskingDescription",
          label: "盲法描述",
        },
      ],
      // 试验分组表头
      studyarmsHead: [
        {
          prop: "ArmGroupLabel",
          label: "名称",
          width: 300,
        },
        {
          prop: "ArmGroupType",
          label: "类型",
          width: 300,
        },
        {
          prop: "ArmGroupInterventionName",
          label: "干预",
          width: 300,
        },
        {
          prop: "ArmGroupDescription",
          label: "描述",
        },
      ],
      // 干预措施表头
      interventionsHead: [
        {
          prop: "InterventionArmGroupLabel",
          label: "组别",
          width: 300,
        },
        {
          prop: "InterventionType",
          label: "类型",
          width: 300,
        },
        {
          prop: "InterventionName",
          label: "名称",
          width: 300,
        },
        {
          prop: "InterventionOtherName",
          label: "其他名称",
          width: 300,
        },
        {
          prop: "InterventionDescription",
          label: "描述",
        },
      ],
      // 主要结果指标表头
      measuresHead: [
        {
          prop: "PrimaryOutcomeMeasure",
          label: "主要结果指标",
          minWidth: 200,
        },
        {
          prop: "PrimaryOutcomeTimeFrame",
          label: "时间",
          minWidth: 200,
        },
        {
          prop: "PrimaryOutcomeDescription",
          label: "描述",
        },
      ],
      // 次要结果指标表头
      measuressHead: [
        {
          prop: "SecondaryOutcomeMeasure",
          label: "次要结果指标",
          minWidth: 200,
        },
        {
          prop: "SecondaryOutcomeTimeFrame",
          label: "时间",
          minWidth: 200,
        },
        {
          prop: "SecondaryOutcomeDescription",
          label: "描述",
        },
      ],
      // 招募联系表头
      contactsHead: [
        {
          prop: "CentralContactName",
          label: "联系人",
        },
        {
          prop: "CentralContactRole",
          label: "联系人角色",
        },
        {
          prop: "CentralContactPhone",
          label: "联系电话",
        },
        {
          prop: "CentralContactEMail",
          label: "联系邮件",
        },
      ],
      // 入选标准表头
      rxbzHead: [
        {
          prop: "rxbz",
          label: "入选标准",
        },
      ],
      // 排除标准表头
      pcbzHead: [
        {
          prop: "pcbz",
          label: "排除标准",
        },
      ],
      // 主要研究者表头
      researcherHead: [
        {
          prop: "OverallOfficialName",
          label: "姓名",
        },
        {
          prop: "OverallOfficialRole",
          label: "职责",
        },
        {
          prop: "OverallOfficialAffiliation",
          label: "所在单位",
        },
      ],
      // 试验机构表头
      institutesHead: [
        {
          prop: "LocationFacility",
          label: "机构名称",
        },
        {
          prop: "LocationCountry",
          label: "国家",
        },
        {
          prop: "LocationState",
          label: "省份",
        },
        {
          prop: "LocationCity",
          label: "城市",
        },
        {
          prop: "LocationZip",
          label: "邮编",
        },
      ],
      // 官方结果表头
      clinicalresultsHead: [
        {
          prop: "title",
          label: "官方结果详情",
        },
        {
          prop: "day",
          label: "官方发布日期",
        },
        {
          prop: "yxx",
          label: "最优剂量有效性",
        },
      ],
      // 试验文献表头
      clinicalresults2Head: [
        {
          prop: "title",
          label: "文献详情",
          minWidth: 200,
        },
        {
          prop: "qikan",
          label: "文献来源",
          minWidth: 200,
        },
        {
          prop: "day",
          label: "文献发布日期",
          minWidth: 200,
        },
        {
          prop: "yxx",
          label: "最优剂量有效性",
          minWidth: 200,
        },
        {
          prop: "resultsqx",
          label: "结果倾向",
          minWidth: 200,
        },
        {
          prop: "results",
          label: "结果简介",
        },
        {
          prop: "conclusions",
          label: "结论简介",
        },
      ],
      registerName: "ClinicalTrials.gov美国",
      isLoading: true,
      id: this.$route.params.id,
      data: {},
      test_course: {
        firstreceived_days: "",
        firstreceived: "",
        firstreceived_s: "",
        all_days: "",
      },
      test_info: {
        summary: "",
        description: "",
        studydesignsList: [],
        studydesigns: "",
        studyarmsList: [],
        studyarms: "",
        measuresList: [],
        measuressList: [],
        measuress: "",
      },
      recruitment_info: {
        enrollment: "",
        gender: "",
        jkssz: "",
        age: "",
        min: "",
        max: "",
        contactsList: [],
        contacts: "",
        rxbzList: [],
        rxbz: "",
        pcbzList: [],
        pcbz: "",
      },
      man_info: {
        otherids: "",
        collaborator: "",
        funded: "",
        dmc: "",
        regulated: "",
        researcherList: [],
        institutesList: [],
      },
      extendList: [], // 扩展信息
      isTrueSelectNum: 1,
      timeFlagId: null, //节流
      test_courseArr: [],
      cyleBtnName: {
        received: { name: "临床试验登记", type: "" },
        receiveds: { name: "首次公示", type: "" },
        start: { name: "开始", type: "实际" },
        start_s: { name: "开始", type: "计划" },
        completions: { name: "主要完成", type: "实际" },
        completions_s: { name: "主要完成", type: "计划" },
        completion: { name: "完成", type: "实际" },
        completion_s: { name: "完成", type: "计划" },
        firstreceived: { name: "试验结果公布", type: "实际" },
        firstreceived_s: { name: "试验结果公布", type: "计划" },
      },
    };
  },
  computed: {
    ...mapState({
      allBase: (state) => state.Clinical.allBase,
      helpInfo: (state) => state.Clinical.helpInfo,
      nopms: (state) => state.Clinical.nopms,
    }),
  },
  watch: {
    showPromtNotice(val) {
      if (val) {
        if ($(".left-nav").css("top")) {
          $(".left-nav").css("top", "128px");
        }
      } else {
        if ($(".left-nav").css("top")) $(".left-nav").css("top", "98px");
      }
    },
  },
  methods: {
    timeSpentHandler(obj) {
      let value;
      switch (obj.key) {
        case "receiveds":
          value = this.test_course["receiveds_days"];
          break;
        case "start":
          value = this.test_course["start_days"];
          break;
        case "completions":
          value = this.test_course["completions_days"];
          break;
        case "completion":
          value = this.test_course["completion_days"];
          break;
      }
      return value;
    },
    indexMethod(index) {
      return index + 1;
    },
    gaEvent(a, b, c) {
      window.ga(
        "send",
        "event",
        "link",
        "click",
        `${this.data.me_id}_${b ? b : a}${c ? "_" + c : ""}`
      );
      window._paq.push([
        "trackEvent",
        "link",
        "click",
        `${this.data.me_id}_${b ? b : a}${c ? "_" + c : ""}`,
      ]);
      window.open(a, "_blank");
    },
    scroll_down(moduleName) {
      setTimeout(() => {
        $(".slide-section").each(function () {
          let title = $(this).find(".lc").text();
          if (title === moduleName) {
            var city_top = $(this).offset().top;
            $(".el-scrollbar__wrap.el-scrollbar__wrap--hidden-default").animate(
              { scrollTop: city_top },
              600
            );
          }
        });
      }, 50);
    },
    handleAxios() {
      // 基本信息
      window
        .Axios({
          method: "get",
          url: "/api/clinical/" + this.id,
          params: {
            accesstoken: GETCOOKIEFUN("accesstoken"),
            msg_readid: this.$route.query.msg_readid,
          },
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data;
            this.data = datas;
            this.test_course = datas.test_course;
            this.test_info = datas.test_info;

            this.recruitment_info = datas.recruitment_info;
            let rxbzList = [];
            this.recruitment_info.rxbzList &&
              this.recruitment_info.rxbzList.forEach((item) => {
                rxbzList.push({ rxbz: item });
              });
            this.recruitment_info.rxbzList = rxbzList;
            let pcbzList = [];
            this.recruitment_info.pcbzList &&
              this.recruitment_info.pcbzList.forEach((item) => {
                pcbzList.push({ pcbz: item });
              });
            this.recruitment_info.pcbzList = pcbzList;
            this.man_info = datas.man_info;
            this.getExtendList("clinical", datas.extendList);
            this.test_courseArrFun(datas.test_course);

            this.showSYXX =
              this.test_info.summary ||
              this.test_info.description ||
              this.test_info.studydesignsList.length > 0 ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.test_info.studyarmsList.length > 0
                : this.test_info.studyarms) ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.test_info.interventionsList.length > 0
                : this.data.interventions) ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.test_info.measuresList.length > 0
                : this.test_info.measures) ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.test_info.measuressList.length > 0
                : this.test_info.measuress) ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.test_info.measuressList.length > 0
                : this.test_info.measuress);

            if (this.data.register == "ClinicalTrials.gov美国") {
              this.showSYLC =
                this.test_course.firstreceived_days != "" ||
                this.test_course.firstreceived ||
                this.test_course.firstreceived_s ||
                this.test_course.all_days != "" ||
                this.test_courseArr.length > 0;
            } else {
              this.showSYLC = false;
            }

            this.showZMXX =
              this.recruitment_info.enrollment ||
              this.recruitment_info.gender ||
              this.recruitment_info.jkssz ||
              this.recruitment_info.age ||
              this.recruitment_info.min ||
              this.recruitment_info.max ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.recruitment_info.contactsList.length > 0
                : this.recruitment_info.contacts) ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.recruitment_info.rxbzList.length > 0
                : this.recruitment_info.rxbz) ||
              (this.data.register == "ClinicalTrials.gov美国"
                ? this.recruitment_info.pcbzList.length > 0
                : this.recruitment_info.pcbz);

            this.showJGXX =
              this.man_info.researcherList.length > 0 ||
              this.man_info.institutesList.length > 0;

            this.showLCJG =
              this.data.clinicalresults.length > 0 &&
              (this.data.clinicalresults.some((item) => item.ly == "官方") ||
                this.data.clinicalresults.some((item) => item.ly == "文献"));

            this.showSYWJ =
              this.data.down.length > 0 &&
              this.data.down.some((item) => item.downurl != "");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(this.removeLoading);
    },
    test_courseArrFun(obj) {
      let arr = [];
      for (var i in obj) {
        if (obj[i]) {
          let value = this.cyleBtnName[i] && this.cyleBtnName[i]["type"];
          let str = value ? "（" + value + "）" : "";
          let objs = {
            key: i,
            val: [obj[i] + str],
          };
          arr.push(objs);
        }
      }

      arr.sort(function (a, b) {
        // 排序顺序规则临床试验登记——首次公示——开始——主要完成——完成——首次结果
        var order = [
          "received",
          "receiveds",
          "start_s",
          "start",
          "completions_s",
          "completions",
          "completion_s",
          "completion",
          "firstreceived_s",
          "firstreceived",
        ];
        return order.indexOf(a.key) - order.indexOf(b.key);
      });
      arr.map((item, i) => {
        // 当开始的计划和实际时间都存在的时候需要合并显示
        if (obj.start && obj.start_s) {
          if (item.key === "start") {
            item.val.unshift(arr[i - 1].val[0]);
            arr.splice(i - 1, 1);
          }
        }
        // 当主要完成的计划和实际时间都存在的时候需要合并显示
        if (obj.completions && obj.completions_s) {
          if (item.key === "completions") {
            item.val.unshift(arr[i - 1].val[0]);
            arr.splice(i - 1, 1);
          }
        }
        // 当完成的计划和实际时间都存在的时候需要合并显示
        if (obj.completion && obj.completion_s) {
          if (item.key === "completion") {
            item.val.unshift(arr[i - 1].val[0]);
            arr.splice(i - 1, 1);
          }
        }
        // 当完成的计划和实际时间都存在的时候需要合并显示
        if (obj.firstreceived && obj.firstreceived_s) {
          if (item.key === "firstreceived") {
            item.val.unshift(arr[i - 1].val[0]);
            arr.splice(i - 1, 1);
          }
        }
      });
      // TODO 这里的注释的字段 是因为在试验里程时间轴上用不到这些字段 如果加上会导致时间轴上将这些作为节点显示
      let fields = [
        // 'all_days',           // 总用时

        "received", // 临床试验登记
        // 'receiveds_days',     // 用时
        "receiveds", // 首次公示

        "start_s", // 开始-计划
        // 'start_days',         // 用时
        "start", // 开始-实际

        "completions_s", // 主要完成-计划
        // 'completions_days',   // 用时
        "completions", // 主要完成-实际

        "completion_s", // 完成-计划
        // 'completion_days',    // 用时
        "completion", // 完成-实际

        "firstreceived_s", // 试验结果公布-计划
        // 'firstreceived_days', // 用时
        "firstreceived", // 试验结果公布-实际
      ];
      if (this.test_course.firstreceived_s || this.test_course.firstreceived) {
        // fields.push('firstreceived_s', 'firstreceived')
      }
      this.test_courseArr = arr.filter((item) => fields.includes(item.key));
      // let key1 = this.test_courseArr.filter(ite => ite.key == 'firstreceived'),
      //   key2 = this.test_courseArr.filter(ite => ite.key == 'firstreceived_s'),
      //   tempArr = [];
      // this.test_courseArr.forEach(item => {
      //   if (key1.length > 0 && key1[0].val.length > 0 && key2.length > 0 && key2[0].val.length > 0) {
      //     tempArr = [key1[0].val[0], key2[0].val[0]]
      //   }
      //   console.log(tempArr);
      // })

      const that = this;
      // 如果完成实际时间
      if (this.test_course.all_days != "") {
        setTimeout(() => {
          that.calcSylc();
          window.addEventListener("resize", () => {
            that.calcSylc();
          });
        }, 100);
      }
    },
    calcSylc() {
      let domLen = $(".div_box").find(".li-odd").length,
        width1 = 0,
        width2 = 0;
      for (let index = 0; index < domLen; index++) {
        let flag = $(".div_box:eq(" + index + ") .li-odd");
        if (flag) {
          let title = flag.find(".first-title").text().trim();
          if (title == "临床试验登记") {
            width1 = flag.find(".empty-circle").offset().left;
          } else if (title == "完成") {
            width2 = flag.find(".empty-circle").offset().left;
          }
        }
      }
      this.allDaysWidth = width2 - width1 - 1;
    },
    // 加载完后移除加载界面
    removeLoading() {
      if (this.$route.query && this.$route.query.linkModule) {
        this.$nextTick(() => {
          this.scroll_down(this.$route.query.linkModule);

          setTimeout(() => {
            $("#lcjg").addClass("active").siblings().removeClass("active");
          }, 800);
        });
      }
      this.isLoading = false;
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
    if (!this.nopms.xqy) {
      this.handleAxios();
    }
    Store.dispatch("Clinical/getBaseInfo");
    window.addEventListener("scroll", this.handleScroll, true);
  },
  activated() {
    this.vueRouteToNoPms(this.nopms.xqy);
  },
  updated() {
    this.vueRouteToNoPms(this.nopms.xqy);
    this.vueTogglePmsTooltip();
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "~@/assets/less/detailCom.less";

@FontsizeSmall: 13px;
@FontsizeSmallBold: bold;

.span-a {
  cursor: pointer;
  color: #4877e8;

  &:hover {
    text-decoration: underline;
  }
}

.wrapper {
  .detail-list {
    .main {
      .right-list {
        .max-790 {
          max-height: 790px;
          overflow-y: auto;
        }

        // PART 2
        .part-two {
          .tb-wrap {
            position: relative;
            display: flex;
            padding: 0 20px;
            height: 210px;
            flex-direction: column-reverse;
            justify-content: center;
          }

          .course-ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            width: 100%;

            .status-block {
              position: absolute;
              top: -50px;
              right: 5px;
            }

            .div_box {
              display: flex;
              flex: 1;
              height: 100px;
            }

            .li-odd {
              width: auto;
              // display: flex;
              text-align: center;
              flex-direction: column;
              align-items: center;

              .borderBlue {
                border-color: #4877e8 !important;
              }

              .backgroundBlue {
                background: #4877e8 !important;
              }

              .empty-circle {
                box-sizing: border-box;
                width: 25px;
                height: 25px;
                background: #ffffff;
                border: 1px solid #545b6d;
                z-index: 1;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto;

                .empty-circle-in {
                  width: 9px;
                  height: 9px;
                  background: #545b6d;
                  border-radius: 50%;
                }
              }

              .special span {
                font-weight: 600 !important;
                color: #4877e8 !important;
              }

              .info {

                .first-title,
                .second-title {
                  height: auto;
                  display: flex;
                  white-space: nowrap;
                  justify-content: center;
                  color: #333333;
                }

                .first-title {
                  height: 20px;
                  font-size: 14px;
                  // font-weight: 600;
                  line-height: 20px;
                }

                .second-title {
                  height: 18px;
                  font-size: 13px;
                  font-weight: 400;
                  line-height: 18px;
                }
              }

              .empty-circle-b {
                border: 1px solid #dfe5f1;
              }

              .empty-circle-in.empty-circle-in-b {
                width: 0;
              }

              >span {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 40px;
                line-height: 28px;
                font-size: 14px;
                white-space: nowrap;

                span {
                  display: block;
                  line-height: 18px;
                }
              }
            }

            .mainComplete.li-odd {
              .info {
                .first-title {
                  height: 20px;
                  font-size: 14px;
                  font-weight: lighter;
                  color: #666666;
                  line-height: 20px;
                }

                .second-title {
                  height: 18px;
                  font-size: 13px;
                  font-weight: lighter;
                  color: #666666;
                  line-height: 18px;
                }
              }
            }

            .info {
              margin-top: 18px;
            }

            .li-even {
              // flex: 1;
              position: relative;
              height: 1px;
              background: #4877e8;
              top: 12px;
              width: calc(100% - 70px);

              .time-spent {
                white-space: nowrap;
                height: 17px;
                font-size: 12px;
                font-weight: lighter;
                color: #868ea3;
                line-height: 17px;
                position: absolute;
                left: 50%;
                transform: translate(-50%, -36px);
              }

              .time-spent-line {
                height: 13px;
                border: 0.5px dashed #dfe5f1;
                position: absolute;
                left: 50%;
                transform: translate(-50%, -15px);
              }
            }

            .dashBorder {
              border: 0.5px dashed #dfe5f1;
              height: 0;
              background: none;
            }

            .li-even::before {
              // content: "";
              // position: absolute;
              // top: -5px;
              // left: 50%;
              // border-top: 3px solid #4877e8;
              // border-right: 3px solid #4877e8;
              // border-radius: 2px;
              // height: 10px;
              // width: 10px;
              // transform: rotate(45deg);
            }

            // .li-even:nth-child(1) {
            //   display: none;
            // }
          }

          .all-days {
            width: 1200px;
            margin-top: 10px;
            margin-left: 42px;
            height: 85px;
            display: flex;
            position: relative;
            flex-direction: column;

            .bottom-line {
              border: 0.5px dashed #dfe5f1;
              border-bottom: 0;
              width: 100%;
              height: 45px;
              margin-top: 45px;
            }
          }

          .line1,
          .line3 {
            // height: 30px;
            // border: 0.5px dashed #DFE5F1;
            // width: 0;
          }

          .line2 {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);

            .line {
              width: 0;
              border: 0.5px dashed #dfe5f1;
              height: 17px;
              position: absolute;
              top: 25px;
              left: -25px;
              background: none;
            }

            .text {
              display: flex;
              height: 18px;
              white-space: nowrap;
            }
          }

          .line {
            width: 1px;
            height: 83px;
            background: #979797;
            margin: 0 80px;
          }

          .status {
            display: flex;
            justify-content: center;
            align-items: baseline;
            white-space: nowrap;
            width: 120px;
            height: 34px;
            border-radius: 3px;
            font-size: 13px;
            font-weight: 400;
            color: #ffffff;
          }

          .day {
            font-size: 20px;
            font-weight: bold;
          }

          .beforehand {
            background: #90c320;
          }

          .ontime {
            background: #4877e8;
            align-items: center;
          }

          .delay {
            background: #f77b52;
          }
        }

        .tb-wrap {
          font-size: 13px;
        }
      }
    }
  }
}

.wrapper .detail-list .detail-header .header-left .left-top {
  width: auto;
}

.top-id {
  max-width: 80vw !important;
  display: block !important;
}

/deep/.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
}
</style>

<style lang="less">
.el-tooltip__popper {
  div {
    max-height: 400px;
    overflow-y: auto;
  }
}

.clinical-detail {

  .td-line5,
  .el-table .td-line5 .cell {
    // max-height: 100px;
    -webkit-line-clamp: 5 !important;
    // overflow-y: auto !important;
    padding-bottom: 0;
  }

  // .el-table .td-line5 .cell span {
  //   max-height: 100px;
  //   overflow-y: auto;
  //   display: block;
  // }

  .el-table .cell.el-tooltip {
    white-space: normal !important;
    width: 100% !important;
  }

  .el-table td .cell {
    -webkit-line-clamp: 5;
  }

  .el-table tbody td>.cell {
    padding-bottom: 2px;
  }
}
</style>
