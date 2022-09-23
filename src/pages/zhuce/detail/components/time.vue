<template>
  <div class="time-node" id="timeNode" ref="timeNode">
    <LoadingGif
      :className="'list-in-loading'"
      :classNameImg="'little-size-loading'"
      :loadFlag="isLoading"
      v-if="isLoading"
    ></LoadingGif>
    <div class="time-info" v-if="isExportTimeImg">
      <div class="box1">
        <span class="info-slh">{{ info.shoulihao }}注册时光轴</span>
      </div>
      <div class="box2">
        <span v-if="info.name" class="info-content"
          >药品名称：<span>{{ info.name }}</span></span
        >
        <span v-if="info.qiyemingcheng" class="info-content"
          >NMPA企业名称：<span>{{ info.qiyemingcheng }}</span></span
        >
        <span v-if="info.guifanqiyemingcheng" class="info-content"
          >CDE企业名称：<span>{{ info.guifanqiyemingcheng }}</span></span
        >
      </div>
      <div class="box3">
        <div class="info-content">
          时间：<span>{{ getTime() }}</span>
        </div>
        <div class="info-content" style="margin-right: 0">
          来源：<span>药智数据企业版</span>
        </div>
      </div>
    </div>
    <el-button
      v-if="isLoading === false && isExportTimeImg === false"
      class="time-export"
      type="primary"
      size="mini"
      round
      @click="
        exportImg('timeNode', `${info.shoulihao}注册时光轴-药智数据企业版`)
      "
      >生成图片</el-button
    >
    <div
      class="node"
      :class="{
        'big-node': item.drupMenu.node_type,
        'little-node': !item.drupMenu.node_type,
        'node-blue': nodeColor === 'blue',
        'node-green': nodeColor === 'green',
        'node-gray':
          (item.drupMenu.label == '完成技术审评' &&
            !item.drupMenu.date &&
            !item.drupMenu.is_lamp) ||
          (item.drupMenu.label == '开始技术审评' && !item.drupMenu.is_lamp),
      }"
      :id="item.drupMenu.id ? `node${item.drupMenu.id}` : `node${index}`"
      v-for="(item, index) in timeData"
      :key="index"
    >
      <!-- 点左边部分 -->
      <div class="node-left">
        <!-- 历时 -->
        <div
          class="during-time"
          v-if="item.drupMenu.time"
          @click.stop="showGreenNode(item, $event)"
        >
          <span class="tip">点击显示时光轴节点</span>
          <span class="name">{{ item.drupMenu.time }}</span>
          <span class="point-arrow"></span>
        </div>
        <!-- 具体时间 -->
        <div class="concrete-time" v-if="item.drupMenu.date">
          {{ item.drupMenu.date }}
        </div>
      </div>

      <!-- 点 -->
      <div
        class="dot"
        :class="{
          'big-dot': item.drupMenu.node_type === 'parent',
          'little-dot': item.drupMenu.node_type !== 'parent',
        }"
      >
        <div class="line"></div>
      </div>

      <!-- 点右边部分 -->
      <div class="node-right">
        <div class="content">
          <div class="first-part">
            <div
              class="part-name"
              :class="{
                'part-name-url':
                  (item.drupMenu.label === '通知临床实验数据现场核查' ||
                    item.drupMenu.label === '纳入自查核查品种') &&
                  item.drupMenu.append &&
                  item.drupMenu.append.url,
              }"
              :title="
                item.drupMenu.label === '通知临床实验数据现场核查' ||
                item.drupMenu.label === '纳入自查核查品种'
                  ? item.drupMenu.append && item.drupMenu.append.laiyuan
                  : ''
              "
            >
              {{ item.drupMenu.label }}
              <!-- 纳入优先审评品种 -->
              <span
                style="margin-left: 10px; font-weight: bold"
                v-if="
                  item.drupMenu.label === '纳入优先审评品种' &&
                  item.drupMenu.append &&
                  item.drupMenu.append.remarks
                "
              >
                纳入理由：{{
                  item.drupMenu.append && item.drupMenu.append.remarks
                }}
              </span>
              <!-- 通知临床实验数据现场核查 、纳入自查核查品种-->
              <span
                v-if="
                  (item.drupMenu.label === '通知临床实验数据现场核查' ||
                    item.drupMenu.label === '纳入自查核查品种') &&
                  item.drupMenu.append &&
                  item.drupMenu.append.url
                "
                @click="jumpUrl(item.drupMenu.append.url)"
                class="iconfont iconfont-link-btn"
                >&#xe617;</span
              >
              <!-- 通知临床实验数据现场核查详细信息 -->
              <el-popover
                placement="right"
                width="430"
                trigger="hover"
                :append-to-body="true"
                v-if="
                  item.drupMenu.label === '通知临床实验数据现场核查' &&
                  Object.keys(item.drupMenu.append.xianchanghecha).length > 0
                "
              >
                <div class="detail-content">
                  <div>
                    <span class="title">申报单位</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.shenbaodanwei
                    }}</span>
                  </div>

                  <div>
                    <span class="title">申报单位责任人</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.sbdwfzr
                    }}</span>
                  </div>

                  <div>
                    <span class="title">临床试验组长单位</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.lcsyzzdw
                    }}</span>
                  </div>

                  <div>
                    <span class="title">主要研究者</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.zhuyaoyanjiuzhe
                    }}</span>
                  </div>

                  <div>
                    <span class="title">合同研究组织</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.htyjzz
                    }}</span>
                  </div>

                  <div>
                    <span class="title">合同研究组织负责人</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.htyjzzfzr
                    }}</span>
                  </div>

                  <div>
                    <span class="title">Ⅰ期/BE临床试验机构</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.belcsyjg_1
                    }}</span>
                  </div>

                  <div>
                    <span class="title">Ⅰ期/BE主要研究者</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.bezyyjz_1
                    }}</span>
                  </div>

                  <div>
                    <span class="title">Ⅰ期/BE分析测试单位</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.befxcsdw_1
                    }}</span>
                  </div>

                  <div>
                    <span class="title">Ⅰ期/BE分析测试主要研究者</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.befxcszyyjz_1
                    }}</span>
                  </div>

                  <div>
                    <span class="title">Ⅰ期/BE合同研究组织</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.behtyjzz_1
                    }}</span>
                  </div>

                  <div>
                    <span class="title">Ⅰ期/BE合同研究组织负责人</span>
                    <span class="info">{{
                      item.drupMenu.append.xianchanghecha.behtyjzzfzr_1
                    }}</span>
                  </div>
                </div>
                <el-button slot="reference" class="detail-info"
                  >详细信息</el-button
                >
              </el-popover>

              <!-- 拟纳入优先审评品种公示 、 拟纳入突破性治疗品种公示 -->
              <span
                style="margin-left: 10px; font-weight: bold"
                v-if="
                  (item.drupMenu.label === '拟纳入优先审评品种公示' ||
                    item.drupMenu.label === '拟纳入突破性治疗品种公示') &&
                  item.drupMenu.append &&
                  Object.keys(item.drupMenu.append.beizhu).length > 0
                "
                >({{ item.drupMenu.append.beizhu.date }}
                {{
                  item.drupMenu.append.beizhu &&
                  item.drupMenu.append.beizhu.remarks
                }})</span
              >
            </div>
            <div
              class="part-more"
              v-if="item.drupMenu.infoLabel"
              ref="partMore"
            >
              <div class="more-line"></div>

              <!-- 图标的区别：新，补 -->
              <div
                class="option1_xin"
                v-if="item.drupMenu.infoLabel.indexOf('新') > -1"
              >
                {{ item.drupMenu.infoLabel }}
              </div>
              <div
                class="option1_bu"
                v-else-if="item.drupMenu.infoLabel.indexOf('补') > -1"
              >
                {{ item.drupMenu.infoLabel }}
              </div>

              <!-- 评审状态 -->
              <div class="option2" v-if="item.drupMenu.pingshenzhuangtai">
                {{ item.drupMenu.pingshenzhuangtai }}
              </div>

              <div class="option3" v-if="item.drupMenu.gongshileibie">
                <div v-if="item.drupMenu.infoLabel == '新报任务'">
                  <span>{{ item.drupMenu.gongshileibie }}</span>
                </div>
                <div v-else>
                  <span
                    v-if="
                      typeof item.drupMenu.xuhao === 'string' ||
                      typeof item.drupMenu.xuhao === 'number'
                    "
                    >{{ item.drupMenu.gongshileibie }}</span
                  >
                  <span
                    v-else-if="
                      !item.drupMenu.xuhao ||
                      item.drupMenu.xuhao == '[]' ||
                      item.drupMenu.xuhao == '' ||
                      item.drupMenu.xuhao.length < 1
                    "
                    >{{ item.drupMenu.gongshileibie }}</span
                  >
                  <div v-else class="option-flag">
                    <span
                      v-for="(txt, index) in item.drupMenu.xuhao"
                      :key="index"
                      class="txt"
                      >{{ txt.type == "2" ? "(专业)" : "(综合)" }}&nbsp;&nbsp;{{
                        txt.shenpingbumen
                      }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="option4" v-if="item.drupMenu.shenpingrenwufenlei">
                {{ item.drupMenu.shenpingrenwufenlei }}
              </div>

              <div class="option5">
                <span v-if="item.drupMenu.yzxpj_xuhao" class="option-flag">
                  <span class="txt">序号: {{ item.drupMenu.yzxpj_xuhao }}</span>
                </span>
                <span v-if="item.drupMenu.infoLabel == '新报任务'">
                  <span
                    v-if="
                      !item.drupMenu.xuhao ||
                      item.drupMenu.xuhao == '[]' ||
                      item.drupMenu.xuhao == '' ||
                      item.drupMenu.xuhao.length < 1
                    "
                  ></span>
                  <span v-else>
                    <span
                      v-if="
                        (typeof item.drupMenu.xuhao === 'string' ||
                          typeof item.drupMenu.xuhao === 'number') &&
                        item.drupMenu.xuhao
                      "
                      >序号/排队号：{{ item.drupMenu.xuhao
                      }}<span v-if="item.drupMenu.pdh" style="color: #f77d56"
                        >/{{ item.drupMenu.pdh }}</span
                      ></span
                    >
                    <span v-else class="option-flag">
                      <span
                        v-for="(txt, index) in item.drupMenu.xuhao"
                        :key="index"
                        class="txt"
                      >
                        <span v-if="txt.xuhao"
                          >序号/排队号：{{ txt.xuhao }}</span
                        >
                        <span v-if="txt.pdh" style="color: #f77d56"
                          >/{{ txt.pdh }}</span
                        ></span
                      >
                    </span>
                  </span>
                </span>
                <span v-else>
                  <span
                    v-if="
                      !item.drupMenu.xuhao ||
                      item.drupMenu.xuhao == '[]' ||
                      item.drupMenu.xuhao == '' ||
                      item.drupMenu.xuhao.length < 1
                    "
                  ></span>
                  <span v-else>
                    <span
                      v-if="
                        (typeof item.drupMenu.xuhao === 'string' ||
                          typeof item.drupMenu.xuhao === 'number') &&
                        item.drupMenu.xuhao
                      "
                      >序号/排队号：{{ item.drupMenu.xuhao
                      }}<span v-if="item.drupMenu.pdh" style="color: #f77d56"
                        >/{{ item.drupMenu.pdh }}</span
                      ></span
                    >
                    <span v-else class="option-flag">
                      <span
                        v-for="(txt, index) in item.drupMenu.xuhao"
                        :key="index"
                        class="txt"
                      >
                        <span v-if="txt.xuhao"
                          >序号/排队号：{{ txt.xuhao }}</span
                        >
                        <span v-if="txt.pdh" style="color: #f77d56"
                          >/{{ txt.pdh }}</span
                        ></span
                      >
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div
            class="second-part"
            v-if="item.drupMenu.label === '开始技术审评'"
          >
            <!-- 技术审评各专业 -->
            <div class="part-left">
              <!-- 情况1 - 普通新报 -->
              <div
                class="major"
                v-for="(txt, key, index) in item.append.zhuanye"
                :key="index"
                v-if="item.drupMenu.yzxpj !== 1"
              >
                <div v-if="key !== 'zhuanyemax'">
                  <div class="major-name" v-if="key === 'tongji'">统计专业</div>
                  <div class="major-name" v-else-if="key === 'yaoliduli'">
                    药理毒理专业
                  </div>
                  <div class="major-name" v-else-if="key === 'yaoxue'">
                    药学专业
                  </div>
                  <div class="major-name" v-else-if="key === 'linchuang'">
                    临床专业
                  </div>
                  <div class="major-name" v-else-if="key === 'linchuangyaoli'">
                    临床药理专业
                  </div>
                  <div class="major-name" v-else-if="key === 'hegui'">
                    合规专业
                  </div>
                  <!-- 确定步骤条的背景选择 -->
                  <!-- 3步骤 - 普通新报任务 -->
                  <!-- 时光轴这里有多轮展示 -->
                  <template v-if="txt.constructor == Array">
                    <div
                      v-for="(sub_item, idx) in txt"
                      :key="idx"
                      class="major-steps-three array-three"
                      :class="{
                        three0: Object.keys(sub_item).length === 0,
                        three1:
                          sub_item.daishenpin &&
                          !sub_item.zaishenpin &&
                          !sub_item.wanchengshenpin,
                        three2:
                          sub_item.zaishenpin && !sub_item.wanchengshenpin,
                        three3: sub_item.wanchengshenpin,
                      }"
                    >
                      <div class="step step1" v-if="sub_item.daishenpin">
                        <span class="step-name">{{
                          sub_item.daishenpin.label
                        }}</span>
                        <span class="step-time">{{
                          sub_item.daishenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div
                        class="step step1"
                        v-else-if="Object.keys(sub_item).length === 0"
                      >
                        <span class="step-name">{{
                          item.append.zhuanye.zhuanyemax.label
                        }}</span>
                        <span class="step-time">{{
                          item.append.zhuanye.zhuanyemax.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div class="step step2" v-if="sub_item.zaishenpin">
                        <span class="step-name">{{
                          sub_item.zaishenpin.label
                        }}</span>
                        <span class="step-time">{{
                          sub_item.zaishenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div class="step step3" v-if="sub_item.wanchengshenpin">
                        <span class="step-name">{{
                          sub_item.wanchengshenpin.label
                        }}</span>
                        <span class="step-time">{{
                          sub_item.wanchengshenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="major-steps-three"
                      :class="{
                        three0: Object.keys(txt).length === 0,
                        three1:
                          txt.daishenpin &&
                          !txt.zaishenpin &&
                          !txt.wanchengshenpin,
                        three2: txt.zaishenpin && !txt.wanchengshenpin,
                        three3: txt.wanchengshenpin,
                      }"
                    >
                      <div class="step step1" v-if="txt.daishenpin">
                        <span class="step-name">{{
                          txt.daishenpin.label
                        }}</span>
                        <span class="step-time">{{
                          txt.daishenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div
                        class="step step1"
                        v-else-if="Object.keys(txt).length === 0"
                      >
                        <span class="step-name">{{
                          item.append.zhuanye.zhuanyemax.label
                        }}</span>
                        <span class="step-time">{{
                          item.append.zhuanye.zhuanyemax.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div class="step step2" v-if="txt.zaishenpin">
                        <span class="step-name">{{
                          txt.zaishenpin.label
                        }}</span>
                        <span class="step-time">{{
                          txt.zaishenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div class="step step3" v-if="txt.wanchengshenpin">
                        <span class="step-name">{{
                          txt.wanchengshenpin.label
                        }}</span>
                        <span class="step-time">{{
                          txt.wanchengshenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- 情况2 - 一致性新报 - 4专业 -->
              <div
                class="major"
                v-for="(txt, key, index) in item.append.zhuanye"
                :key="index"
                v-if="item.drupMenu.yzxpj === 1"
              >
                <div v-if="key !== 'zhuanyemax'">
                  <div class="major-name" v-if="key === 'tongji'">统计专业</div>
                  <div class="major-name" v-else-if="key === 'yaoliduli'">
                    药理毒理专业
                  </div>
                  <div class="major-name" v-else-if="key === 'yaoxue'">
                    药学专业
                  </div>
                  <div class="major-name" v-else-if="key === 'linchuang'">
                    临床专业
                  </div>
                  <div class="major-name" v-else-if="key === 'linchuangyaoli'">
                    临床药理专业
                  </div>
                  <div class="major-name" v-else-if="key === 'hegui'">
                    合规专业
                  </div>
                  <!-- 确定步骤条的背景选择 -->
                  <!-- 2步骤 - 一致性新报任务 -->
                  <template v-if="txt.constructor == Array">
                    <div
                      v-for="(sub_item, idx) in txt"
                      :key="idx"
                      class="major-steps-two"
                      :class="{
                        two0: Object.keys(sub_item).length === 0,
                        two1: sub_item.zaishenpin && !sub_item.wanchengshenpin,
                        two2: sub_item.wanchengshenpin,
                      }"
                    >
                      <div class="step step1" v-if="sub_item.zaishenpin">
                        <span class="step-name">{{
                          sub_item.zaishenpin.label
                        }}</span>
                        <span class="step-time">{{
                          sub_item.zaishenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div
                        class="step step1"
                        v-else-if="Object.keys(sub_item).length === 0"
                      >
                        <span class="step-name">{{
                          item.append.zhuanye.zhuanyemax.label
                        }}</span>
                        <span class="step-time">{{
                          item.append.zhuanye.zhuanyemax.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div class="step step2" v-if="sub_item.wanchengshenpin">
                        <span class="step-name">{{
                          sub_item.wanchengshenpin.label
                        }}</span>
                        <span class="step-time">{{
                          sub_item.wanchengshenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="major-steps-two"
                      :class="{
                        two0: Object.keys(txt).length === 0,
                        two1: txt.zaishenpin && !txt.wanchengshenpin,
                        two2: txt.wanchengshenpin,
                      }"
                    >
                      <div class="step step1" v-if="txt.zaishenpin">
                        <span class="step-name">{{
                          txt.zaishenpin.label
                        }}</span>
                        <span class="step-time">{{
                          txt.zaishenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div
                        class="step step1"
                        v-else-if="Object.keys(txt).length === 0"
                      >
                        <span class="step-name">{{
                          item.append.zhuanye.zhuanyemax.label
                        }}</span>
                        <span class="step-time">{{
                          item.append.zhuanye.zhuanyemax.date.split(" ")[0]
                        }}</span>
                      </div>
                      <div class="step step2" v-if="txt.wanchengshenpin">
                        <span class="step-name">{{
                          txt.wanchengshenpin.label
                        }}</span>
                        <span class="step-time">{{
                          txt.wanchengshenpin.date.split(" ")[0]
                        }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- 备注部分 - 若无备注则隐藏 -->
            <div
              class="part-right"
              v-if="Object.keys(item.append.beizhu).length !== 0"
            >
              <div class="pop-arrow"><i class="iconfont">&#xe60c;</i></div>
              <div class="right-main">
                <div class="bz">备注</div>
                <ul class="beizhu">
                  <li
                    class="bz-item"
                    v-for="(txt, index) in item.append.beizhu"
                    :key="index"
                  >
                    <div class="date">{{ txt.regtime }}</div>
                    <div class="desc" v-html="txt.beizhu"></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- NMPA 邮寄日期单独显示的信息 -->
          <div
            class="three-part"
            v-if="
              item.drupMenu.label === 'NMPA 邮寄日期' &&
              item.drupMenu.append.length > 0
            "
          >
            <div v-for="(txt, i) in item.drupMenu.append" :key="i">
              <span>{{ txt.name }}</span>
              <span>{{ txt.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 新报/补充流程右侧增加“最新变化”和“最新变化时间” -->
      <div
        class="node-newest"
        ref="newest"
        v-if="
          (item.drupMenu.label.indexOf('新报') !== -1 ||
            item.drupMenu.label.indexOf('补充') !== -1) &&
          Object.keys(item.drupMenu.change).length > 0
        "
      >
        <!-- 花括号ui -->
        <div>
          <div class="newest-top"></div>
          <div class="newest-line"></div>
          <div class="newest-bottom"></div>
          <div class="newest-triangle"></div>
        </div>

        <!-- 最新变化信息 -->
        <div class="new-content">
          <div>最新变化：{{ item.drupMenu.change.change }}</div>
          <div>变化时间：{{ item.drupMenu.change.changeTime }}</div>
        </div>
      </div>
    </div>

    <!-- 时光轴结论 -->
    <div v-if="Object.keys(jielunObj).length > 0" class="node-jielun">
      <img src="../../../../../static/imgs/timeline/node-jielun.png" alt="" />
      <span class="pzh m10">{{ jielunObj.append.jielun }}</span>
      <span v-if="jielunObj.append.pizhunwenhao_arr.length>0">
        (批准文号：
        <span  v-for="(item,index) in jielunObj.append.pizhunwenhao_arr" :key="index">
          <a
            class="pzh"
            :href="item.url"
            v-if="item.url"
            target="_blank"
            >{{ item.title }} </a
          >
          <span v-else>{{ item.title }}</span>
          <span v-if="index !==jielunObj.append.pizhunwenhao_arr.length-1">;</span>
        </span>
        )
      </span>
    </div>

    <!-- <exportTimeImg :info="info" ref="exportTimeImg"></exportTimeImg> -->
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import html2canvas from "html2canvas";
import { createLogger } from "vuex";
export default {
  props: {
    info: {
      type: Object,
      default: {
        return: {},
      },
    },
  },
  data() {
    return {
      isLoading: true,
      timeData: [],
      nodeColor: "blue",
      activeDate: "", // 记录当前点击的是哪个时光轴节点
      jielunObj: {}, // 结论
      isExportTimeImg: false, // 控制导出图片的顶部信息是否显示
    };
  },
  components: {
    LoadingGif,
  },
  watch: {},

  created() {
    this.getTimeNode();
  },

  mounted() {
    let _this = this;
    // this.getHeight()
    window.onresize = function () {
      _this.getHeight();
    };
  },

  methods: {
    // 获取时光轴节点数据
    getTimeNode() {
      window
        .Axios({
          method: "get",
          url: "/api/zhuce/timeline",
          params: {
            id: this.$route.params.id,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.isLoading = false;
          if (res.data.code === 200 && res.data.data) {
            this.timeData = res.data.data;
            // 判断数组最后一项是不是结论，如果是提出来单独渲染
            if (this.timeData[this.timeData.length - 1].name === "jielun") {
              this.jielunObj = this.timeData.pop();
              console.log(this.jielunObj);
            }
          }
        })
        .then(this.handleHasPart) // 判定是否有时光轴这一PART
        .then(this.getHeight); // 动态计算高度
    },

    handleHasPart() {
      let hasPart = false;
      if (Object.keys(this.timeData).length !== 0) {
        hasPart = true;
      } else {
        hasPart = false;
      }
      // 向父组件传值
      this.$emit("emitTimeLine", hasPart);
    },

    // 激活时光轴的点击事件
    showGreenNode(item, e) {
      // 先判断当前激活的时光轴节点和上次点击的节点是否一样，如果一样移出所有的类名node-green，并清空记录的当前时光轴节点
      if (this.activeDate === item.drupMenu.date) {
        // 移出所有的类名node-green
        $(".node").removeClass("node-green");
        // 清空记录的当前时光轴节点
        this.activeDate = "";
      } else {
        // 获取当前点击时光轴节点的父级.node节点
        let parentNode = e.currentTarget.parentNode.parentNode;
        $(".node").removeClass("node-green");
        // 这里的id是根据和后端约定好的id(例如进入新报id:xinbaoStart,新报完成技术审评id：xinbaoEnd)，所以在找id的时候只需要通过replace()方法替换就好了
        $(`#${parentNode.id.replace(/Start/, "End")} .line`).removeClass(
          "dot-bule"
        );
        $(".line").removeClass("dot-bule");
        // 当前id到下一个id之间的节点(包括他们自己)添加类名node-green表示激活状态
        $(parentNode)
          .addClass("node-green")
          .nextUntil(`#${parentNode.id.replace(/Start/, "End")}`)
          .addClass("node-green");
        $(`#${parentNode.id.replace(/Start/, "End")}`).addClass("node-green");
        $(`#${parentNode.id.replace(/Start/, "End")} .line`).addClass(
          "dot-bule"
        );
        // 记录当前点击的时光轴节点，用于判断再次点击时清空所用
        this.activeDate = item.drupMenu.date;
      }
    },

    getHeight() {
      this.$nextTick(() => {
        // 动态设置新报/补充流程的右侧花括号的高度
        // 获取所有的花括号(newest)的refs实例
        let refArr = this.$refs["newest"];
        if (refArr && refArr.length > 0) {
          // 遍历所有的refs实例
          for (let i = 0; i < refArr.length; i++) {
            console.log($(`#${refArr[i].parentNode.id}`).height());
            // 给所有的花括号节点(newest)设置高度
            $(refArr[i]).css({
              // 这里的height是根据和后端约定好的id(例如进入新报id:xinbaoStart,新报完成技术审评id：xinbaoEnd)来获取两个id之间的高度
              height:
               $(`#${refArr[i].parentNode.id}`).height() > 72 ? $(`#${refArr[i].parentNode.id.replace(/Start/, "End")}`).offset().top - $(refArr[i].parentNode).offset().top - 90 - ($(`#${refArr[i].parentNode.id}`).height()-72) : $(`#${refArr[i].parentNode.id.replace(/Start/, "End")}`).offset().top - $(refArr[i].parentNode).offset().top - 90, // 90：为进入新报节点到开始技术审评节点的高度
              top: $(`#${refArr[i].parentNode.id}`).height() > 72 ? $(`#${refArr[i].parentNode.id}`).height() + 30 : 90
            });
          }
        }

        // 动态设置时光轴点下面的线的高度
        let heightArr = [];
        let nodeNum = $(".node").length;

        $(".node").each(function () {
          heightArr.push($(this).height());
        });
        $(".dot .line").each(function (index) {
          if (index === nodeNum - 1) {
            $(this).css({ height: 0 });
          } else {
            $(this).css({ height: heightArr[index] });
          }
        });

        let refPart = this.$refs["partMore"];
        if (refPart && refPart.length > 0) {
          // 遍历所有的refs实例
          for (let i = 0; i < refPart.length; i++) {
            // 给所有的.part-more节点(partMore)设置margin-left
            // console.log($(refPart[i]).prev().width());
            $(refPart[i]).css({
              "margin-left": $(refPart[i]).prev().width() + 5,
            });
          }
        }
      });
    },

    // 通知临床试验数据现场核查点击跳转事件
    jumpUrl(url) {
      window.ga(
        "send",
        "event",
        "button",
        "click",
        "vip_zhuce_shiguangzhou_remarks_url"
      );
      window.open(url);
    },

    // 返回当前时间
    getTime() {
      let date = new Date();
      let y = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      let h = `${date.getHours()}:${
        date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes()
      }`;
      return y + " " + h;
    },

    exportImg(divText, imgText) {
      if (this.isIE()) {
        this.$Message.error("该功能只适用非IE内核浏览器，请更换浏览器");
        return false;
      }
      this.$emit("changeLoading", true);
      this.isExportTimeImg = true;
      window.ga(
        "send",
        "event",
        "button",
        "click",
        `vip_zhuce_${this.info.shoulihao}_sgztp`
      );
      window._paq.push([
        "trackEvent",
        "button",
        "click",
        `vip_zhuce_${this.info.shoulihao}_sgztp`,
      ]);
      this.$nextTick(() => {
        setTimeout(() => {
          let canvasID = this.$refs[divText];
          let that = this;
          let a = document.createElement("a");
          html2canvas(canvasID).then((canvas) => {
            let dom = document.body.appendChild(canvas);
            dom.style.display = "none";
            a.style.display = "none";
            document.body.removeChild(dom);
            let blob = that.dataURLToBlob(dom.toDataURL("image/png"));
            a.setAttribute("href", URL.createObjectURL(blob));
            //这块是保存图片操作  可以设置保存的图片的信息
            a.setAttribute("download", imgText + ".png");
            a.setAttribute("target", "_blank");
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(blob);
            document.body.removeChild(a);
            this.isExportTimeImg = false;
            that.$emit("changeLoading", false);
          });
        }, 500);
      });
    },

    //图片格式转换方法
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/less/var.less";
.detail-content {
  > div {
    display: flex;
    justify-content: space-between;
    line-height: 30px;

    .title {
      color: #545b6d;
      flex: 1;
    }

    .info {
      color: #717a91;
      flex: 1;
    }
  }
}
.time-node {
  padding: 20px 0 20px 60px;
  position: relative;

  .time-info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-right: 40px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #dfe5f1;
    margin-bottom: 20px;
    align-items: baseline;

    .box1 {
      width: 260px;

      span {
        margin-right: 0;
      }
    }

    .box2 {
      flex: 1;
      margin-right: 40px;
    }

    .box3 {
      width: 160px;

      div {
        margin-right: 0;
      }
    }

    .info-slh {
      font-size: 18px;
      font-weight: 600;
      color: #545b6d;
      margin-right: 30px;
    }

    .info-content {
      font-size: 14px;
      color: #868ea3;
      margin-right: 30px;
      span {
        color: #545b6d;
      }
    }
  }

  .time-export {
    display: inline-block;
    padding: 6px 0px;
    width: 80px;
    box-sizing: border-box;
    border-radius: 4px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    z-index: 10;
  }

  .dot-bule {
    background: @TimeMainBlue !important;
  }

  .detail-info {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-left: 15px;
    color: #fff;
    background: #4877e8;
    border-radius: 12px;
    font-size: 12px;
    cursor: pointer;
  }

  .node-jielun {
    margin-top: 20px;
    margin-left: 301px;
    padding-top: 15px;
    box-sizing: border-box;
    font-size: 15px;
    // border-top: 1px dashed @TimeMainGray;

    .pzh {
      color: #4877e8;
    }

    .m10 {
      margin-right: 10px;
    }
  }

  .node {
    display: flex;
    justify-content: flex-start;
    position: relative;

    .node-newest {
      position: absolute;
      left: 1400px;
      top: 90px;
      > div {
        height: 100%;
      }

      .newest-line {
        width: 1px;
        height: 100%;
        border-left: 1px dashed #4877e8;
      }

      .newest-top {
        position: absolute;
        width: 15px;
        height: 15px;
        border-style: dashed;
        border-color: #4877e8;
        border-width: 0px;
        border-top-width: 1px;
        border-right-width: 1px;
        top: -15px;
        left: -15px;
        border-top-right-radius: 15px;
      }

      .newest-bottom {
        position: absolute;
        width: 15px;
        height: 15px;
        border-style: dashed;
        border-color: #4877e8;
        border-width: 0px;
        border-bottom-width: 1px;
        border-right-width: 1px;
        bottom: -15px;
        left: -15px;
        border-bottom-right-radius: 15px;
      }

      .newest-triangle {
        width: 10px;
        height: 10px;
        position: absolute;
        top: 50%;
        transform: translate(-50%) rotate(45deg);
        background: #fff;
        border-top: 1px dashed #4877e8;
        border-right: 1px dashed #4877e8;
      }

      .new-content {
        width: 250px;
        height: auto;
        position: absolute;
        top: 50%;
        transform: translateY(-50% + 10);
        left: 15px;
        color: #545b6d;
      }
    }

    .node-left {
      width: 250px;
      height: 36px;
      display: flex;
      justify-content: flex-end;

      .during-time {
        display: flex;
        justify-content: flex-end;
        position: relative;
        font-size: 13px;
        color: @TimeFontGray;
        height: 36px;
        line-height: 36px;
        white-space: nowrap;
        cursor: pointer;

        .tip {
          position: absolute;
          color: #e74c3c;
          left: 0;
          bottom: -22px;
          display: none;
        }

        &:hover {
          .tip {
            display: inline-block;
          }
        }

        .name {
          display: inline-block;
          height: 36px;
          line-height: 36px;
          font-size: 13px;
          vertical-align: center;
          .num {
            display: inline-block;
            height: 36px;
            line-height: 36px;
            font-size: 16px;
            font-weight: bold;
            vertical-align: center;
          }
        }

        .point-arrow {
          display: inline-block;
          width: 40px;
          height: 36px;
          background: url(/static/imgs/timeline/point.jpg) 0 10px no-repeat;
        }
      }
    }

    .dot {
      width: 36px;
      height: 36px;
      margin: 0px 13px;
      position: relative;
      .line {
        position: absolute;
        top: 17px;
        left: 17px;
        width: 2px;
        height: 36px;
        background: @TimeMainBlue;
      }
    }
  }

  /*
    *大型节点
    */
  // MAIN - BIG
  .big-node {
    position: relative;
    // 大点蓝色
    &.node-blue {
      color: @TimeMainBlue;
      .dot {
        .line {
          background: @TimeMainBlue;
        }
      }
      .big-dot {
        &:before {
          background: @TimeLightBlue;
        }
        &:after {
          background: @TimeMainBlue;
        }
      }
      .node-left {
        .concrete-time {
          color: @TimeMainBlue;
        }
      }
      .node-right {
        .content {
          .first-part {
            color: @TimeMainBlue;
          }
        }
      }
    }
    // 大点绿色
    &.node-green {
      color: @TimeMainGreen;
      .node-left {
        color: @TimeMainGreen;
        .during-time {
          cursor: pointer;
          color: @TimeMainGreen;
          .point-arrow {
            background: url(/static/imgs/timeline/point_active.jpg) 0 10px
              no-repeat;
          }
        }
        .concrete-time {
          color: @TimeMainGreen;
        }
      }
      .dot {
        .line {
          background: @TimeMainGreen;
        }
      }
      .big-dot {
        &:before {
          background: Lighten(@TimeMainGreen, 40%);
        }
        &:after {
          background: @TimeMainGreen;
        }
      }
      .node-left {
        .concrete-time {
          color: @TimeMainGreen;
        }
      }
      .node-right {
        .content {
          .first-part {
            // color: @TimeMainGreen;
          }
        }
      }
    }
    // 大点绿点蓝线
    &.node-green-blue {
      color: @TimeMainGreen;
      .node-left {
        color: @TimeMainGreen;
        .during-time {
          cursor: pointer;
          color: @TimeMainGreen;
          .point-arrow {
            background: url(/static/imgs/timeline/point_active.jpg) 0 10px
              no-repeat;
          }
        }
        .concrete-time {
          color: @TimeMainGreen;
        }
      }
      .dot {
        .line {
          background: @TimeMainBlue;
        }
      }
      .big-dot {
        &:before {
          background: Lighten(@TimeMainGreen, 40%);
        }
        &:after {
          background: @TimeMainGreen;
        }
      }
      .node-left {
        .concrete-time {
          color: @TimeMainGreen;
        }
      }
      .node-right {
        .content {
          .first-part {
            // color: @TimeMainGreen;
          }
        }
      }
    }
    // 大点灰色
    &.node-gray {
      color: @TimeMainGray;
      .dot {
        .line {
          background: @TimeMainGray;
        }
      }
      .big-dot {
        &:before {
          background: @TimeLightGray;
        }
        &:after {
          background: @TimeMainGray;
        }
      }
      .node-left {
        .concrete-time {
          color: @TimeMainGray;
        }
      }
      .node-right {
        .content {
          .first-part {
            color: @TimeMainGray;
          }
        }
      }
    }
    .big-dot {
      position: relative;
      &:before {
        content: "";
        width: 28px;
        height: 28px;
        border-radius: 100%;
        background: @TimeLightBlue;
        position: absolute;
        top: 4px;
        left: 4px;
      }
      &:after {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        background: @TimeMainBlue;
      }
    }
    // 圆点左边
    .node-left {
      .concrete-time {
        line-height: 36px;
        color: @TimeMainBlue;
        font-size: 13px;
        font-weight: bold;
      }
    }
    // 圆点右边
    .node-right {
      display: flex;
      justify-content: flex-start;
      .content {
        .first-part {
          color: @TimeMainBlue;
          font-size: 15px;
          font-weight: bold;
          line-height: 36px;
        }
      }
    }
  }

  /*
    *小型节点
    */
  // MAIN - LITTLE
  .little-node {
    //  小点蓝色
    &.node-blue {
      color: @TimeFontGray;
      .dot {
        .line {
          background: @TimeMainBlue;
        }
      }
      .little-dot {
        &:after {
          background: @TimeMainBlue;
        }
      }
    }
    //  小点灰色
    &.node-gray {
      color: @TimeMainGray;
      .dot {
        .line {
          background: @TimeMainGray;
        }
      }
      .little-dot {
        &:after {
          background: @TimeMainGray;
        }
      }
    }
    //  小点绿色
    &.node-green {
      color: @TimeFontGray;
      .node-left {
        color: @TimeMainGreen;
        .during-time {
          cursor: pointer;
          color: @TimeMainGreen;
          .point-arrow {
            background: url(/static/imgs/timeline/point_active.jpg) 0 10px
              no-repeat;
          }
        }
        .concrete-time {
          color: @TimeMainGreen;
        }
      }
      .dot {
        .line {
          background: @TimeMainGreen;
        }
      }
      .little-dot {
        &:after {
          background: @TimeMainGreen;
        }
      }
    }
    // 绿点蓝线
    &.node-green-blue {
      color: @TimeFontGray;
      .node-left {
        color: @TimeMainGreen;
        .during-time {
          cursor: pointer;
          color: @TimeMainGreen;
          .point-arrow {
            background: url(/static/imgs/timeline/point_active.jpg) 0 10px
              no-repeat;
          }
        }
        .concrete-time {
          color: @TimeMainGreen;
        }
      }
      .dot {
        .line {
          background: @TimeMainBlue;
        }
      }
      .little-dot {
        &:after {
          background: @TimeMainGreen;
        }
      }
    }
    .little-dot {
      position: relative;
      &:after {
        content: "";
        position: absolute;
        top: 13px;
        left: 13px;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: @TimeMainBlue;
      }
    }
    // 圆点左边
    .node-left {
      color: @TimeFontGray;
      .concrete-time {
        position: relative;
        color: @TimeFontGray;
        line-height: 36px;
        font-size: 13px;
      }
    }
    // 圆点右边
    .node-right {
      display: flex;
      justify-content: flex-start;
      max-width: 800px;
      .content {
        .first-part {
          font-size: 13px;
          line-height: 36px;
          // display: flex;
          // justify-content: flex-start;
          position: relative;
          .part-name {
            z-index: 10;
            // background: #fff;
            display: inline-block;
            color: #545b6d;
          }
          .part-name-url {
            color: #4877e8;
            .iconfont-link-btn {
              margin-left: 6px;
              cursor: pointer;
            }
          }
          .part-more {
            position: relative;
            display: flex !important;
            justify-content: flex-start;
            left: 0;
            top: -38px;
            .more-line {
              white-space: nowrap;
              z-index: 1;
              color: @BorderColor;
              padding-left: 250px;
              height: 0px;
              margin-top: 18px;
              border-top: 1px dashed @BorderColor;
              overflow: hidden;
            }
            .option1_xin {
              white-space: nowrap;
              min-width: 110px;
              font-size: 13px;
              color: @TimeMainBlue;
              margin-left: 13px;
              padding-left: 20px;
              background: url(/static/imgs/timeline/xin_icon.jpg) 0 8px
                no-repeat;
            }
            .option1_bu {
              white-space: nowrap;
              min-width: 110px;
              font-size: 13px;
              color: @TimeMainBlue;
              margin-left: 13px;
              padding-left: 20px;
              background: url(/static/imgs/timeline/bu_icon.jpg) 0 8px no-repeat;
            }
            .option1_wait {
              white-space: nowrap;
              min-width: 110px;
              font-size: 13px;
              color: @TimeMainBlue;
              margin-left: 13px;
              padding-left: 20px;
              background: url(/static/imgs/timeline/check_wait_icon.png) 0 8px
                no-repeat;
            }
            .option2 {
              white-space: nowrap;
              box-sizing: border-box;
              min-width: 75px;
              padding: 0px 8px;
              font-size: 13px;
              height: 22px;
              line-height: 22px;
              margin-top: 7px;
              color: #fff;
              border-radius: 11px;
              background: @TimeMainGreen;
              text-align: center;
              margin-left: 13px;
            }
            .option3 {
              white-space: nowrap;
              font-size: 13px;
              color: @TimeMainBlue;
              margin-left: 13px;
            }
            .option4 {
              white-space: nowrap;
              min-width: 50px;
              font-size: 13px;
              color: @TimeMainBlue;
              height: 22px;
              line-height: 22px;
              border-radius: 11px;
              border: 1px solid @TimeMainBlue;
              text-align: center;
              margin-left: 13px;
              margin-top: 7px;
              padding: 0px 8px;
            }
            .option5 {
              white-space: nowrap;
              min-width: 135px;
              font-size: 13px;
              color: @TimeMainBlue;
              margin-left: 13px;
            }
            .option-flag {
              display: flex;
              flex-direction: column;
              padding-top: 5px;
              .txt {
                line-height: 26px;
              }
            }
          }
        }
        .second-part {
          display: flex !important;
          justify-content: flex-start;
          flex-wrap: nowrap;
          .part-left {
            width: 490px;
            margin: 20px;
            .major {
              .major-name {
                font-size: 13px;
                color: @TimeFontGray;
              }
              .major-steps-three {
                display: flex;
                justify-content: flex-start;
                flex-wrap: nowrap;
                width: 490px;
                height: 20px;
                margin-top: 8px;
                margin-bottom: 12px;
                position: relative;
                .step {
                  height: 20px;
                  line-height: 20px;
                  padding-left: 10px;
                  box-sizing: border-box;
                  .step-name {
                    display: inline-block;
                  }
                  .step-time {
                    display: inline-block;
                    padding-left: 4px;
                  }
                }
                .step1 {
                  white-space: nowrap;
                  overflow: hidden;
                  position: absolute;
                  left: 0px;
                  width: 175px;
                }
                .step2 {
                  white-space: nowrap;
                  overflow: hidden;
                  position: absolute;
                  left: 175px;
                  width: 155px;
                }
                .step3 {
                  white-space: nowrap;
                  overflow: hidden;
                  position: absolute;
                  left: 338px;
                  width: 160px;
                }
              }
              .three0 {
                background: url(/static/imgs/timeline/three_steps_0.jpg)
                  no-repeat;
                background-size: cover;
                .step {
                  color: @TimeFontGray;
                }
              }
              .three1 {
                background: url(/static/imgs/timeline/three_steps_1.jpg) 0 0
                  no-repeat;
                background-size: cover;
                .step1 {
                  color: #fff;
                }
                .step2 {
                  color: @TimeFontGray;
                }
                .step3 {
                  color: @TimeFontGray;
                }
              }
              .three2 {
                background: url(/static/imgs/timeline/three_steps_2.jpg) 0 0
                  no-repeat;
                background-size: cover;
                .step1 {
                  color: #fff;
                }
                .step2 {
                  color: #fff;
                }
                .step3 {
                  color: @TimeFontGray;
                }
              }
              .three3 {
                background: url(/static/imgs/timeline/three_steps_3.jpg) 0 0
                  no-repeat;
                background-size: cover;
                .step {
                  color: #fff;
                }
              }
              .major-steps-two {
                display: flex;
                justify-content: flex-start;
                flex-wrap: nowrap;
                width: 480px;
                height: 20px;
                margin-top: 8px;
                margin-bottom: 12px;
                position: relative;
                .step {
                  height: 20px;
                  line-height: 20px;
                  padding-left: 10px;
                  box-sizing: border-box;
                  .step-name {
                    display: inline-block;
                  }
                  .step-time {
                    display: inline-block;
                    padding-left: 4px;
                  }
                }
                .step1 {
                  white-space: nowrap;
                  overflow: hidden;
                  position: absolute;
                  left: 0px;
                  width: 260px;
                }
                .step2 {
                  white-space: nowrap;
                  overflow: hidden;
                  position: absolute;
                  left: 260px;
                  width: 220px;
                }
              }
              .two0 {
                background: url(/static/imgs/timeline/two_steps_0.jpg) 0 0
                  no-repeat;
                .step1 {
                  color: @TimeFontGray;
                }
                .step2 {
                  color: @TimeFontGray;
                }
              }
              .two1 {
                background: url(/static/imgs/timeline/two_steps_1.jpg) 0 0
                  no-repeat;
                .step1 {
                  color: #fff;
                }
                .step2 {
                  color: @TimeFontGray;
                }
              }
              .two2 {
                background: url(/static/imgs/timeline/two_steps_2.jpg) 0 0
                  no-repeat;
                .step1 {
                  color: #fff;
                }
                .step2 {
                  color: #fff;
                }
              }
            }
          }
          .part-right {
            margin-top: 20px;
            width: 430px;
            background: @TimeBgGray;
            border-radius: 15px;
            position: relative;
            border: 1px dashed @BorderColor;
            margin-left: 20px;
            box-sizing: border-box;
            padding: 15px;
            display: flex;
            justify-content: flex-start;
            .pop-arrow {
              position: absolute;
              bottom: -11px;
              left: 179px;
              width: 22px;
              height: 22px;
              line-height: 22px;
              font-size: 20px;
              color: @BorderColor;
              background: @TimeBgGray;
              border-radius: 100%;
              border: 1px dashed @BorderColor;
              text-align: center;
              cursor: pointer;
            }
            .right-main {
              display: flex;
              justify-content: flex-start;
              .bz {
                width: 50px;
                font-size: 14px;
                font-weight: 600;
                line-height: 22px;
              }
              .beizhu {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                font-size: 13px;
                .bz-item {
                  display: flex;
                  justify-content: flex-start;
                  line-height: 22px;
                  .date {
                    display: flex;
                    white-space: nowrap;
                    margin-right: 15px;
                  }
                  .desc {
                  }
                }
              }
            }
          }
        }

        .three-part {
          padding: 10px 20px;
        }
      }
    }
  }
  @media screen and(max-width: 1800px) {
    .time-node {
      .time-info {
        margin-right: 20px;
      }
    }

    .little-node {
      .node-right {
        .content {
          .first-part {
            flex-direction: column;
            justify-content: flex-start;
            .part-more {
              position: relative;
              margin-left: 10px !important;
              top: 0;
              .more-line {
                display: none;
              }
            }
          }
          .second-part {
            flex-direction: column;
            .part-right {
              width: 476px;
              margin-bottom: 20px;
            }
          }
        }
      }
    }

    .node {
      .node-newest {
        left: 940px;
      }
    }
  }
  @media screen and(max-width: 1550px) {
    .little-node {
      .node-right {
        max-width: 500px;
      }
    }
  }
}

@media screen and(max-width: 1800px) {
  .time-node {
    padding-left: 20px;
  }
}
</style>
