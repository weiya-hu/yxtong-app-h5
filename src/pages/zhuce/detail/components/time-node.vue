<template>
  <!-- big-node,little-node控制点的大小;node-blue,node-green,node-gray控制点的颜色 -->
  <div
    class="node"
    :class="{
      'big-node':
        mainName === 'NMPA受理' ||
        mainName === '三合一审评' ||
        mainName === 'CDE承办' ||
        mainName === 'NMPA审批',
      'little-node':
        mainName !== 'NMPA受理' &&
        mainName !== 'CDE承办' &&
        mainName !== 'NMPA审批' &&
        mainName !== '三合一审评',
      'node-blue': nodeColor === 'blue',
      'node-green': nodeColor === 'green',
      'node-gray': noActive
    }"
  >
    <!-- 点 - 左 -->
    <div class="node-left">
      <!-- 最左侧 - 耗时部分 -->
      <!-- 总历时 -->
      <div id="during-zls" class="during-time" v-if="duringZlsStart">
        <span class="name">总历时：<span class="num">000</span>天</span>
        <span class="point-arrow"></span>
      </div>
      <!-- 排队时长 -->
      <div
        id="during-pdsc"
        class="during-time"
        v-if="
          mainName === '开始技术审评' &&
            mainTime !== '' &&
            diffInfoMin.date &&
            diffInfoPsMin.date &&
            diffInfoMin.infoLabel.indexOf('新报') !== -1
        "
      >
        <span class="name"
          >排队时长：<span class="num">{{ duringPdsc }}</span
          >天</span
        >
        <span class="point-arrow"></span>
      </div>
      <!-- 新报审批时长 -->
      <div
        id="during-xbspsc"
        class="during-time"
        v-if="
          mainName === '完成技术审评' &&
            mainTime !== '' &&
            diffInfo.pingshenMax.date &&
            diffInfo.pingshenMin.date &&
            diffInfo.min.infoLabel.indexOf('新报') !== -1
        "
      >
        <span class="name"
          >新报审批时长：<span class="num">{{ duringXbspsc }}</span
          >天</span
        >
        <span class="point-arrow"></span>
      </div>
      <!-- 补充审评时长 -->
      <div
        :id="'during-bcspsc-' + duringIndex"
        class="during-time"
        v-if="
          mainName === '完成技术审评' &&
            mainTime !== '' &&
            diffInfo.pingshenMax.date &&
            diffInfo.pingshenMin.date &&
            diffInfo.min.infoLabel.indexOf('补充') !== -1
        "
      >
        <span class="name"
          >补充审评时长：<span class="num">{{ duringBcspsc }}</span
          >天</span
        >
        <span class="point-arrow"></span>
      </div>
      <!-- 审批时长 -->
      <div
        id="during-spsc"
        class="during-time"
        v-if="
          mainName.indexOf('NMPA 审批完毕') !== -1 &&
            mainTime !== '' &&
            diffInfoArr[0].date &&
            diffInfoArr[1].date
        "
      >
        <span class="name"
          >审批时长：<span class="num">{{ duringSpsc }}</span
          >天</span
        >
        <span class="point-arrow"></span>
      </div>

      <!-- 具体时间 -->
      <div class="concrete-time">{{ mainTime }}</div>
    </div>
    <!-- 点 -->
    <div
      class="dot"
      :class="{
        'big-dot':
          mainName === 'NMPA受理' ||
          mainName === '三合一审评' ||
          mainName === 'NMPA审批' ||
          mainName === 'CDE承办',
        'little-dot':
          mainName !== 'NMPA受理' ||
          mainName !== '三合一审评' ||
          (mainName !== 'NMPA审批' && mainName !== 'CDE承办')
      }"
    >
      <div class="line"></div>
    </div>
    <!-- 点 - 右 -->
    <div class="node-right">
      <!-- 详细内容 -->
      <div class="content">
        <div class="first-part">
          <div class="part-name">{{ mainName }}</div>
          <div
            class="part-more"
            v-if="
              mainName === '进入新报任务' ||
                mainName === '进入一致性评价新报任务' ||
                mainName === '进入补充资料任务' ||
                mainName === '进入一致性评价补充资料任务' ||
                mainName === '进入一致性评价补充任务' ||
                (id === 'threeheone_xcjianchajigou' && !taskDesc.date)
            "
          >
            <div class="more-line"></div>
            <!-- 图标的区别：1、新，2、补 -->
            <div
              class="option1_xin"
              v-if="
                taskDesc.infoLabel &&
                  (mainName === '进入新报任务' ||
                    mainName === '进入一致性评价新报任务')
              "
            >
              {{ taskDesc.infoLabel }}
            </div>
            <div
              class="option1_bu"
              v-else-if="
                taskDesc.infoLabel &&
                  (mainName === '进入补充资料任务' ||
                    mainName === '进入一致性评价补充资料任务' ||
                    mainName === '进入一致性评价补充任务')
              "
            >
              {{ taskDesc.infoLabel }}
            </div>
            <div
              class="option1_wait"
              v-if="id === 'threeheone_xcjianchajigou' && taskDesc.label"
            >
              {{ taskDesc.label }}
            </div>
            <div class="option2" v-if="taskDesc.pingshenzhuangtai">
              {{ taskDesc.pingshenzhuangtai }}
            </div>
            <div class="option3" v-if="taskDesc.gongshileibie">
              <div v-if="taskDesc.infoLabel == '新报任务'">
                <span>{{ taskDesc.gongshileibie }}</span>
              </div>
              <div v-else>
                <span
                  v-if="
                    typeof taskDesc.xuhao === 'string' ||
                      typeof taskDesc.xuhao === 'number'
                  "
                  >{{ taskDesc.gongshileibie }}</span
                >
                <span
                  v-else-if="
                    !taskDesc.xuhao ||
                      taskDesc.xuhao == '[]' ||
                      taskDesc.xuhao == '' ||
                      taskDesc.xuhao.length < 1
                  "
                  >{{ taskDesc.gongshileibie }}</span
                >
                <div v-else class="option-flag">
                  <span
                    v-for="(item, index) in taskDesc.xuhao"
                    :key="index"
                    class="txt"
                    >{{ item.type == "2" ? "(专业)" : "(综合)" }}&nbsp;&nbsp;{{
                      item.shenpingbumen
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div class="option4" v-if="taskDesc.shenpingrenwufenlei">
              {{ taskDesc.shenpingrenwufenlei }}
            </div>
            <div class="option5">
              <span v-if="taskDesc.yzxpj_xuhao" class="option-flag">
                <span class="txt">序号: {{ taskDesc.yzxpj_xuhao }}</span>
              </span>
              <span v-if="taskDesc.infoLabel == '新报任务'">
                <span
                  v-if="
                    !taskDesc.xuhao ||
                      taskDesc.xuhao == '[]' ||
                      taskDesc.xuhao == '' ||
                      taskDesc.xuhao.length < 1
                  "
                ></span>
                <span v-else>
                  <span
                    v-if="
                      typeof taskDesc.xuhao === 'string' ||
                        typeof taskDesc.xuhao === 'number'
                    "
                    >序号/排队号：{{ taskDesc.xuhao
                    }}<span v-if="taskDesc.pdh" style="color:#f77d56"
                      >/{{ taskDesc.pdh }}</span
                    ></span
                  >
                  <span v-else class="option-flag">
                    <span
                      v-for="(item, index) in taskDesc.xuhao"
                      :key="index"
                      class="txt"
                      >序号/排队号：{{ item.xuhao }}/<span
                        style="color:#f77d56"
                        >{{ item.pdh }}</span
                      ></span
                    >
                  </span>
                </span>
              </span>
              <span v-else>
                <span
                  v-if="
                    !taskDesc.xuhao ||
                      taskDesc.xuhao == '[]' ||
                      taskDesc.xuhao == '' ||
                      taskDesc.xuhao.length < 1
                  "
                ></span>
                <span v-else>
                  <span
                    v-if="
                      typeof taskDesc.xuhao === 'string' ||
                        typeof taskDesc.xuhao === 'number'
                    "
                    >序号/排队号：{{ taskDesc.xuhao
                    }}<span v-if="taskDesc.pdh" style="color:#f77d56"
                      >/{{ taskDesc.pdh }}</span
                    ></span
                  >
                  <span v-else class="option-flag">
                    <span
                      v-for="(item, index) in taskDesc.xuhao"
                      :key="index"
                      class="txt"
                      >序号/排队号：{{ item.xuhao }}/<span
                        style="color:#f77d56"
                        >{{ item.pdh }}</span
                      ></span
                    >
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="second-part" v-if="mainName === '开始技术审评'">
          <!-- 技术审评各专业 -->
          <div class="part-left">
            <!-- 情况1 - 普通新报 - 3专业 -->
            <div
              class="major"
              v-for="(item, key, index) in handleRt(taskDetailZhuanye)"
              :key="index+'key'"
              v-if="preNode.indexOf('一致性') === -1"
            >
              <div v-if="key !== 'zhuanyemax'">
                <div class="major-name" v-if="key === 'tongji'">统计专业</div>
                <div class="major-name" v-else-if="key === 'yaoliduli'">药理毒理专业</div>
                <div class="major-name" v-else-if="key === 'yaoxue'">药学专业</div>
                <div class="major-name" v-else-if="key === 'linchuang'">临床专业</div>
                <div class="major-name" v-else-if="key === 'linchuangyaoli'">临床药理专业</div>
                <div class="major-name" v-else-if="key === 'hegui'">合规专业</div>
                <!-- 确定步骤条的背景选择 -->
                <!-- 3步骤 - 普通新报任务 -->
                <div
                  class="major-steps-three"
                  :class="{
                    three0: Object.keys(item).length === 0,
                    three1:
                      item.daishenpin &&
                      !item.zaishenpin &&
                      !item.wanchengshenpin,
                    three2: item.zaishenpin && !item.wanchengshenpin,
                    three3: item.wanchengshenpin
                  }"
                >
                  <div class="step step1" v-if="item.daishenpin">
                    <span class="step-name">{{ item.daishenpin.label }}</span>
                    <span class="step-time">{{
                      item.daishenpin.date.split(" ")[0]
                    }}</span>
                  </div>
                  <div
                    class="step step1"
                    v-else-if="Object.keys(item).length === 0"
                  >
                    <span class="step-name">{{
                      taskDetailZhuanye.zhuanyemax.label
                    }}</span>
                    <span class="step-time">{{
                      taskDetailZhuanye.zhuanyemax.date.split(" ")[0]
                    }}</span>
                  </div>
                  <div class="step step2" v-if="item.zaishenpin">
                    <span class="step-name">{{ item.zaishenpin.label }}</span>
                    <span class="step-time">{{
                      item.zaishenpin.date.split(" ")[0]
                    }}</span>
                  </div>
                  <div class="step step3" v-if="item.wanchengshenpin">
                    <span class="step-name">{{
                      item.wanchengshenpin.label
                    }}</span>
                    <span class="step-time">{{
                      item.wanchengshenpin.date.split(" ")[0]
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 情况2 - 一致性新报 - 4专业 -->
            <div
              class="major"
              v-for="(item, key, index) in handleRt(taskDetailZhuanye)"
              :key="index"
              v-if="preNode.indexOf('一致性') > -1"
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
                <div class="major-name" v-else-if="key === 'linchuangyaoli'">临床药理专业</div>
                <div class="major-name" v-else-if="key === 'hegui'">合规专业</div>
                <!-- 确定步骤条的背景选择 -->
                <!-- 2步骤 - 一致性新报任务 -->
                <div
                  class="major-steps-two"
                  :class="{
                    two0: Object.keys(item).length === 0,
                    two1: item.zaishenpin && !item.wanchengshenpin,
                    two2: item.wanchengshenpin
                  }"
                >
                  <div class="step step1" v-if="item.zaishenpin">
                    <span class="step-name">{{ item.zaishenpin.label }}</span>
                    <span class="step-time">{{
                      item.zaishenpin.date.split(" ")[0]
                    }}</span>
                  </div>
                  <div
                    class="step step1"
                    v-else-if="Object.keys(item).length === 0"
                  >
                    <span class="step-name">{{
                      taskDetailZhuanye.zhuanyemax.label
                    }}</span>
                    <span class="step-time">{{
                      taskDetailZhuanye.zhuanyemax.date.split(" ")[0]
                    }}</span>
                  </div>
                  <div class="step step2" v-if="item.wanchengshenpin">
                    <span class="step-name">{{
                      item.wanchengshenpin.label
                    }}</span>
                    <span class="step-time">{{
                      item.wanchengshenpin.date.split(" ")[0]
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 备注部分 - 若无备注则隐藏 -->
          <div
            class="part-right"
            v-if="Object.keys(taskDetailBeizhu).length !== 0"
          >
            <div class="pop-arrow"><i class="iconfont">&#xe60c;</i></div>
            <div class="right-main">
              <div class="bz">备注</div>
              <ul class="beizhu">
                <li
                  class="bz-item"
                  v-for="(item, index) in taskDetailBeizhu"
                  :key="index"
                >
                  <div class="date">{{ item.regtime }}</div>
                  <div class="desc" v-html="item.beizhu"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theLineHeight: 0
    };
  },
  computed: {},
  watch: {},
  props: {
    // 用于判断是一次性还是正常的节点
    preNode: {
      default: "",
      type: String
    },
    // 数据
    data: {
      default: function() {
        return {};
      },
      type: Object
    },
    id: {
      default: "",
      type: String
    },
    // 默认蓝色，可选blue,green,gray
    nodeColor: {
      default: "blue",
      type: String
    },
    // 默认为空，可选总历时，排队时长，补充审评时长，审批时长 等。注：有duringTimeName则有duringTime
    duringTimeName: {
      default: "",
      type: String
    },
    duringTime: {
      type: Number
    },
    // 点右边，名称
    mainName: {
      default: "",
      type: String
    },
    // 点左边，具体时间
    mainTime: {
      default: "",
      type: String
    },
    // taskDesc
    hasTaskDesc: {
      default: false,
      type: Boolean
    },
    taskDesc: {
      default: function() {
        return {};
      },
      type: Object
    },
    // taskDetail
    hasTaskDetail: {
      default: false,
      type: Boolean
    },
    taskDetail: {
      default: function() {
        return [];
      },
      type: Array
    },
    taskDetailZhuanye: {
      default: function() {
        return {};
      },
      type: Object
    },
    taskDetailBeizhu: {
      default: function() {
        return [];
      },
      type: Array
    },
    taskDetailYx: {
      default: function() {
        return {};
      },
      type: Object
    },
    taskDetailYldl: {
      default: function() {
        return {};
      },
      type: Object
    },
    taskDetailLc: {
      default: function() {
        return {};
      },
      type: Object
    },
    taskDetailWeiqidong: {
      default: function() {
        return {};
      },
      type: Object
    },
    // 历时相关
    // 区分新报和补充
    diffInfo: {
      default: function() {
        return {};
      },
      type: Object
    },
    // 专为=>审批时长
    diffInfoArr: {
      default: function() {
        return [];
      },
      type: Array
    },
    // diffInfoMin和diffInfoPsMin 专为=>排队时长
    diffInfoMin: {
      default: function() {
        return {};
      },
      type: Object
    },
    diffInfoPsMin: {
      default: function() {
        return {};
      },
      type: Object
    },
    // 审批时长
    duringSpsc: {
      type: Number
    },
    // 补充审评时长
    duringBcspsc: {
      type: Number
    },
    // 新报审评时长
    duringXbspsc: {
      type: Number
    },
    // 排队时长 - 新报才有
    duringPdsc: {
      type: Number
    },
    // 是否是总历时可以开始显示的节点
    duringZlsStart: {
      default: false,
      type: Boolean
    },
    // 区别多轮补充的index
    duringIndex: {
      type: Number
    },
    // 进度是否到此
    noActive: {
      type: Boolean
    }
  },
  methods: {
    handleRt(option) {
      return option;
    },
    // 序列号/排队号 去重 【暂时没用到】
    unique(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.xuhao) && res.set(arr.xuhao, 1));
    }
  },
  mounted() {
    let that = this;
    // 审批时长 - hover
    $("#during-spsc").hover(
      function() {
        if (that.mainName === "NMPA 审批完毕") {
          $("#during-spsc")
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green-blue");

          $("#during-spsc")
            .parents(".node")
            .prevUntil("#cfda_kssp")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");

          $("#during-spsc")
            .parents(".node")
            .siblings("#cfda_kssp")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");
        }
      },
      function() {
        if (that.mainName === "NMPA 审批完毕") {
          $("#during-spsc")
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-spsc")
            .parents(".node")
            .prevUntil("#cfda_kssp")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-spsc")
            .parents(".node")
            .siblings("#cfda_kssp")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");
        }
      }
    );

    // 补充审评时长 - hover
    $("#during-bcspsc-" + that.duringIndex).hover(
      function() {
        if (typeof that.duringIndex === "number") {
          $("#during-bcspsc-" + that.duringIndex)
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green-blue");

          $("#during-bcspsc-" + that.duringIndex)
            .parents(".node")
            .prevUntil("#cde_buchong_min_" + that.duringIndex)
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");

          $("#during-bcspsc-" + that.duringIndex)
            .parents(".node")
            .siblings("#cde_buchong_min_" + that.duringIndex)
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");
        }
      },
      function() {
        if (typeof that.duringIndex === "number") {
          $("#during-bcspsc-" + that.duringIndex)
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-bcspsc-" + that.duringIndex)
            .parents(".node")
            .prevUntil("#cde_buchong_min_" + that.duringIndex)
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-bcspsc-" + that.duringIndex)
            .parents(".node")
            .siblings("#cde_buchong_min_" + that.duringIndex)
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");
        }
      }
    );

    // 新报审评时长 - hover
    $("#during-xbspsc").hover(
      function() {
        if (that.mainName === "完成技术审评") {
          $("#during-xbspsc")
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green-blue");

          $("#during-xbspsc")
            .parents(".node")
            .prevUntil("#cde_xinbao_min")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");

          $("#during-xbspsc")
            .parents(".node")
            .siblings("#cde_xinbao_min")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");
        }
      },
      function() {
        if (that.mainName === "完成技术审评") {
          $("#during-xbspsc")
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-xbspsc")
            .parents(".node")
            .prevUntil("#cde_xinbao_min")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-xbspsc")
            .parents(".node")
            .siblings("#cde_xinbao_min")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");
        }
      }
    );

    // 排队时长 - hover
    $("#during-pdsc").hover(
      function() {
        if (that.mainName === "开始技术审评") {
          $("#during-pdsc")
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green-blue");

          $("#during-pdsc")
            .parents(".node")
            .prevUntil("#cde_xinbao")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");

          $("#during-pdsc")
            .parents(".node")
            .siblings("#cde_xinbao")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-green");
        }
      },
      function() {
        if (that.mainName === "开始技术审评") {
          $("#during-pdsc")
            .parents(".node")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-pdsc")
            .parents(".node")
            .prevUntil("#cde_xinbao")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");

          $("#during-pdsc")
            .parents(".node")
            .siblings("#cde_xinbao")
            .removeClass("node-blue")
            .removeClass("node-green")
            .removeClass("node-gray")
            .removeClass("node-green-blue")
            .addClass("node-blue");
        }
      }
    );

    // 获取 序列号/排队号 高度
    let op3 = $(".option3");
    if (op3.height() > 36) {
      op3.parents(".node.little-node").css("height", op3.height() + "px");
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";

/*
 *大小节点共用
 */
.node {
  display: flex;
  justify-content: flex-start;
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
  .node-left {
    width: 240px;
    height: 36px;
    display: flex;
    justify-content: flex-end;
    .during-time {
      display: flex;
      justify-content: flex-end;
      font-size: 13px;
      color: @TimeFontGray;
      height: 36px;
      line-height: 360px;
      white-space: nowrap;
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
        display: flex;
        justify-content: flex-start;
        position: relative;
        .part-name {
          z-index: 10;
          // background: #fff;
        }
        .part-name-url {
          color: #4877e8;
          .iconfont-link-btn {
            margin-left: 6px;
            cursor: pointer;
          }
        }
        .part-more {
          position: absolute;
          display: flex !important;
          justify-content: flex-start;
          left: 0;
          top: 0;
          .more-line {
            white-space: nowrap;
            z-index: 1;
            color: @BorderColor;
            padding-left: 450px;
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
            background: url(/static/imgs/timeline/xin_icon.jpg) 0 8px no-repeat;
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
          width: 480px;
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
                left: 330px;
                width: 150px;
              }
            }
            .three0 {
              background: url(/static/imgs/timeline/three_steps_0.jpg) 0 0
                no-repeat;
              .step {
                color: @TimeFontGray;
              }
            }
            .three1 {
              background: url(/static/imgs/timeline/three_steps_1.jpg) 0 0
                no-repeat;
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
          margin-top: 50px;
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
    }
  }
}
@media screen and(max-width: 1800px) {
  .little-node {
    .node-right {
      .content {
        .first-part {
          flex-direction: column;
          justify-content: flex-start;
          .part-more {
            position: relative;
            margin-left: 10px;
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
}
@media screen and(max-width: 1550px) {
  .little-node {
    .node-right {
      max-width: 500px;
    }
  }
}
</style>
