<template>
  <div class="detail-items">
    <div class="detail-item">
      <div class="item-title">
        <span class="text">适应症研发进展</span>
      </div>
      <!-- 自定义加载界面 -->
      <LoadingGif
        :className="'list-in-loading'"
        :classNameImg="'little-size-loading'"
        :loadFlag="loading"
        v-if="loading"
      ></LoadingGif>
      <div class="indication-box" v-else>
        <!-- 适应症研发进展图形 -->
        <div v-if="chartData.length > 0">
          <div class="title">
            <div class="indication">适应症</div>
            <div class="flex1">临床前</div>
            <div class="flex1">临床申请</div>
            <div class="flex1">临床Ⅰ期</div>
            <div class="flex1">临床Ⅱ期</div>
            <div class="flex1">临床Ⅲ期</div>
            <div class="flex1">注册申请</div>
            <div class="flex1">批准上市</div>
            <div class="company">最高阶段研发单位</div>
          </div>

          <div
            class="indication-chart"
            v-for="item in chartData"
            :key="item.indication_cn"
          >
            <div class="indication">
              <span v-if="jspdf">
                {{ item.indication_cn }}
              </span>
              <a
                v-else
                target="_blank"
                :href="`/report?indication=${item.indication_cn}`"
              >
                {{ item.indication_cn }}
              </a>
            </div>

            <!-- 临床前status_order:5 -->
            <div class="flex1 order1">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 5"
                    :class="[
                      'all-line',
                      'line',
                      item.all.status_order === 5 ? 'active' : '',
                    ]"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 5"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 5
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 5"
                    :class="[
                      'china-line',
                      'line',
                      item.china.status_order === 5 ? 'active' : '',
                    ]"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 5"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 5
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <!-- 临床申请status_order:6 -->
            <div class="flex1 no-border">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 6"
                    :class="[
                      'all-line',
                      'line',
                      item.all.status_order === 6 ? 'active' : '',
                    ]"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 6"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 6
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 6"
                    :class="[
                      'china-line',
                      'line',
                      item.china.status_order === 6 ? 'active' : '',
                    ]"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 6"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 6
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <!-- 临床1期status_order:7 -->
            <div class="flex1 no-border">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 7"
                    :class="[
                      'all-line',
                      'line',
                      item.all.status_order === 7 ? 'active' : '',
                    ]"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 7"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 7
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 7"
                    :class="[
                      'china-line',
                      'line',
                      item.china.status_order === 7 ? 'active' : '',
                    ]"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 7"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 7
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <!-- 临床2期status_order:8 -->
            <div class="flex1 no-border">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 8"
                    :class="[
                      'all-line',
                      'line',
                      item.all.status_order === 8 ? 'active' : '',
                    ]"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 8"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 8
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 8"
                    :class="[
                      'china-line',
                      'line',
                      item.china.status_order === 8 ? 'active' : '',
                    ]"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 8"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 8
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <!-- 临床3期status_order:9 -->
            <div class="flex1 no-border">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 9"
                    :class="[
                      'all-line',
                      'line',
                      item.all.status_order === 9 ? 'active' : '',
                    ]"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 9"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 9
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 9"
                    :class="[
                      'china-line',
                      'line',
                      item.china.status_order === 9 ? 'active' : '',
                    ]"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 9"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 9
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <!-- 注册申请status_order:10 -->
            <div class="flex1 no-border">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 10"
                    :class="[
                      'all-line',
                      'line',
                      item.all.status_order === 10 ? 'active' : '',
                    ]"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 10"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 10
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 10"
                    :class="[
                      'china-line',
                      'line',
                      item.china.status_order === 10 ? 'active' : '',
                    ]"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 10"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 10
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <!-- 批准上市status_order:11 -->
            <div class="flex1 border">
              <el-tooltip
                class=""
                effect="zhuce"
                placement="right"
                style="width: 100%"
              >
                <div slot="content">
                  <div class="flex1-title">全球(中国)</div>
                  <div>
                    批准上市：<span>{{ item.all ? item.all.pzss : 0 }}</span
                    ><span>({{ item.china ? item.china.pzss : 0 }})</span>
                  </div>
                  <div>
                    注册申请：<span>{{ item.all ? item.all.zcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.zcsq : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅲ期：<span>{{ item.all ? item.all.lc3q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc3q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅱ期：<span>{{ item.all ? item.all.lc2q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc2q : 0 }})</span>
                  </div>
                  <div>
                    临床Ⅰ期：<span>{{ item.all ? item.all.lc1q : 0 }}</span
                    ><span>({{ item.china ? item.china.lc1q : 0 }})</span>
                  </div>
                  <div>
                    临床申请：<span>{{ item.all ? item.all.lcsq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcsq : 0 }})</span>
                  </div>
                  <div>
                    临床前：<span>{{ item.all ? item.all.lcq : 0 }}</span
                    ><span>({{ item.china ? item.china.lcq : 0 }})</span>
                  </div>
                  <div>
                    其他：<span>{{ item.all ? item.all.other : 0 }}</span
                    ><span>({{ item.china ? item.china.other : 0 }})</span>
                  </div>
                </div>
                <div>
                  <!-- 全球 -->
                  <div
                    v-if="item.all && item.all.status_order >= 11"
                    :class="['all-line', 'line']"
                    :style="{ marginBottom: item.china ? '12px' : '0' }"
                  >
                    <div
                      class="no-active"
                      v-if="item.all.status_order !== 11"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.china.status_order >= 11
                    "
                    class="place"
                  ></div>

                  <!-- 中国 -->
                  <div
                    v-if="item.china && item.china.status_order >= 11"
                    :class="['china-line', 'line']"
                  >
                    <div
                      class="no-active"
                      v-if="item.china.status_order !== 11"
                    ></div>
                  </div>
                  <!-- 占位 中国的会挤上来 -->
                  <div
                    v-else-if="
                      item.all && item.china && item.all.status_order >= 11
                    "
                    class="place-china"
                  ></div>
                </div>
              </el-tooltip>
            </div>

            <div class="company">
              <!-- 全球 -->
              <div v-if="item.all && item.all.company.length > 0">
                <template v-if="jspdf">
                  <span v-for="(txt, index) in item.all.company" :key="txt">
                    {{ txt }}
                    <span v-if="index !== item.all.company.length - 1">;</span>
                  </span>
                  <span v-if="item.all && item.china">(全球)</span>
                </template>
                <template v-else>
                  <a
                    target="_blank"
                    :href="`/report?company=${txt}`"
                    v-for="(txt, index) in item.all.company"
                    :key="txt"
                  >
                    {{ txt }}
                    <span v-if="index !== item.all.company.length - 1">;</span>
                  </a>
                  <span v-if="item.all && item.china">(全球)</span>
                </template>
              </div>

              <!-- 中国 -->
              <div v-if="item.china && item.china.company.length > 0">
                <template v-if="jspdf">
                  <span v-for="(txt, index) in item.china.company" :key="txt">
                    {{ txt }}
                    <span v-if="index !== item.china.company.length - 1"
                      >;</span
                    >
                  </span>
                  <span v-if="item.all && item.china">(中国)</span>
                </template>
                <template v-else>
                  <a
                    target="_blank"
                    :href="`/report?company=${txt}`"
                    v-for="(txt, index) in item.china.company"
                    :key="txt"
                  >
                    {{ txt }}
                    <span v-if="index !== item.china.company.length - 1"
                      >;</span
                    >
                  </a>
                  <span v-if="item.all && item.china">(中国)</span>
                </template>
              </div>
            </div>
          </div>

          <div class="mark-box">
            <div class="all"><span></span>全球</div>
            <div class="china"><span></span>中国</div>
          </div>
        </div>

        <!-- 适应症研发进展表格 -->
        <div>
          <div v-if="!jspdf" style="text-align: right">
            <span class="export" @click="maxTotal(exportUrl, tableRes.count)"
              ><i class="iconfont">&#xe605;</i> 导出</span
            >
          </div>
          <pdfTable
            v-if="jspdf"
            :headerList="tableHead"
            :dataList="tableRes.list"
          />
          <!-- 加载完成显示部分 -->
          <el-table
            v-else
            :data="tableRes.list"
            stripe
            fixed
            border
            class="table"
            style="width: 100%"
            @sort-change="sortChange"
          >
            <el-table-column
              v-for="item in tableHead"
              :prop="item.prop"
              :min-width="item.width"
              :key="item.prop"
              :label="item.label"
              :sortable="item.sort"
              align="center"
            >
              <template slot-scope="scope">
                <div :title="scope.row[item.prop]">
                  <!-- 适应症 -->
                  <a
                    target="_blank"
                    :href="`/report?indication=${scope.row[item.prop]}`"
                    v-if="item.prop === 'indication_cn'"
                  >
                    {{ scope.row[item.prop] }}
                  </a>

                  <!-- 国家或地区 -->
                  <div v-else-if="item.prop === 'country_cn'">
                    {{ scope.row.countryList.join(";") }}
                  </div>

                  <!-- 研发单位 -->
                  <div v-else-if="item.prop === 'guifanqiye'">
                    <a
                      target="_blank"
                      :href="`/report?company=${item}`"
                      v-for="(item, index) in scope.row.guifanqiyeList"
                      :key="item"
                    >
                      {{ item }}
                      <span v-if="index !== scope.row.guifanqiyeList.length - 1"
                        >;</span
                      >
                    </a>
                  </div>

                  <div v-else>
                    {{ scope.row[item.prop] }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="tableRes.count > 10 && !jspdf"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-size="params.pageSize"
            :total="tableRes.count"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <DetailKzxx v-if="showKZXX()" :extendList="extendList"></DetailKzxx>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DetailKzxx from "./kzxx";
import pdfTable from "../pdfReport/table";
import LoadingGif from "@/components/common/globalCom/loading-gif";
import tablehead from "@/config/tablehead";
const tableFiled = tablehead.drugreport.indication;
export default {
  components: { DetailKzxx, LoadingGif, pdfTable },
  props: {
    extendList: Array,
    jspdf: {
      type: Boolean,
    },
    drugid: {
      type: String,
    },
    initData: {
      type: Object,
    },
    initEchartData: {
      type: Array,
    },
  },
  data() {
    return {
      loading: true,
      tableRes: {}, // 表格数据
      chartData: [], // 图形绘制数据
      tableHead: tableFiled,
      params: {
        page: 1,
        pageSize: 10,
      },
      exportUrl: "/api/report/developmentList?outdata=1", // 医院销售情况表格导出
    };
  },
  mounted() {
    console.log(this.jspdf, this.initData, this.initEchartData);
    if (!this.initData && !this.initEchartData) {
      this.getIndicationChart();
      this.getIndicationTbale();
    } else {
      this.loading = false;
      this.chartData = this.initEchartData;
      this.tableRes = this.initData;
      this.getHeight();
    }
  },
  methods: {
    showKZXX() {
      let flag = false;
      if (this.jspdf) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    },

    // 获取研发进展图例数据
    getIndicationChart() {
      window
        .Axios({
          method: "get",
          url: "/api/report/development",
          params: {
            drugid: this.drugid,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.loading = false;
          if (res.data && res.data.code == 200) {
            this.chartData = res.data.data;
          }
        })
        .then(this.getHeight());
    },

    // 获取研发进展表格数据
    getIndicationTbale() {
      window
        .Axios({
          method: "get",
          url: "/api/report/developmentList",
          params: {
            drugid: this.drugid,
            ...this.params,
            accesstoken: GETCOOKIEFUN("accesstoken"),
          },
        })
        .then((res) => {
          this.loading = false;

          if (res.data && res.data.code == 200) {
            this.tableRes = res.data.data;
          }
        });
    },

    // 列表排序
    sortChange(column, prop, order) {
      console.log(column);
      if (column) {
        let str = "";
        if (column.prop == "status_cn") {
          str = "status_order";
        } else {
          str = column.prop;
        }
        if (column.order == "ascending") {
          this.params.order = str + " " + "asc";
        } else if (column.order == "descending") {
          this.params.order = str + " " + "desc";
        } else {
          this.params.order = "";
        }
      }
      console.log(this.params.order);

      this.getIndicationTbale();
    },

    // 分页
    handleCurrentChange(val) {
      this.params.page = val;
      this.getIndicationTbale();
    },

    //
    getHeight() {
      this.$nextTick(() => {
        setTimeout(() => {
          let heightArr = [];

          $(".indication-chart").each(function (index) {
            heightArr.push($(this).height());
            $(this).children().css({ height: heightArr[index] });
          });
        }, 1000);
      });
    },

    //总数超过1000提示
    maxTotal(url, total) {
      if (total > 1000) {
        this.$Confirm(
          "导出",
          `当前数据量为<span class="cl-red">${total}</span>条，最大导出量为<span class="cl-red">1000</span>条，是否导出？`,
          () => {
            this.handleExport(url);
          }
        );
      } else {
        this.handleExport(url);
      }
    },
    handleExport(url) {
      window.open(
        url +
          "&drugid=" +
          this.drugid +
          "&accesstoken=" +
          GETCOOKIEFUN("accesstoken")
      );
    },
  },
};
</script>
<style lang="less">
.flex1-title {
  position: relative;
  padding-left: 15px;
}

.flex1-title::before {
  content: "·";
  font-size: 40px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
<style lang="less" scoped>
@import "~@/assets/less/var.less";
@import "../css/com.less";
.indication-box {
  padding: 10px 10px 20px 10px;
  background: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  .title {
    display: flex;
    align-items: center;
    background: #f6f8fc;
    height: 34px;
    line-height: 34px;
    font-size: 13px;
    color: #35384a;
    font-weight: 700;
    border: 1px solid #dfe5f1;

    div {
      height: 100%;
    }

    .indication {
      border-right: 1px solid #dfe5f1;
    }

    .company {
      border-left: 1px solid #dfe5f1;
    }
  }

  .indication-chart {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #35384a;
    border: 1px solid #dfe5f1;
    border-top: 0;
    min-height: 40px;

    .indication {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-right: 1px solid #dfe5f1;
    }

    .company {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-left: 1px solid #dfe5f1;
    }

    .flex1 {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .china-line {
        background-color: #90c320;
      }

      .all-line {
        background-color: #4877e8;
      }

      .line {
        width: 100%;
        height: 8px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        position: relative;
      }

      .all-line.active::after,
      .china-line.active::after {
        content: "";
        display: inline-block;
        /* Base Style */
        border: solid 4px transparent;
        border-left-color: #4877e8;
        position: absolute;
        right: -8px;
        z-index: 10;
      }

      .china-line.active::after {
        border-left-color: #90c320;
      }

      .all-line .no-active,
      .china-line .no-active {
        display: inline-block;
        width: 0;
        height: 0;
        /* Base Style */
        border: 4px solid;
        border-color: transparent #fff transparent transparent;
        position: relative;
        transform: rotate(180deg);
        position: absolute;
        right: -6px;
        z-index: 10;
      }

      .all-line .no-active::after,
      .china-line .no-active::after {
        content: "";
        position: absolute;
        right: -5px;
        top: -4px;
        border: 4px solid;
        border-color: transparent #4877e8 transparent transparent;
        z-index: 10;
      }

      .china-line .no-active::after {
        border-color: transparent #90c320 transparent transparent;
      }

      .place,
      .place-china {
        width: 100%;
        height: 8px;
        margin-bottom: 12px;
      }

      .place-china {
        margin-bottom: 0;
      }
    }

    .order1 {
      padding-left: 2px;
    }

    .no-border {
      .line {
        border-radius: 0;
      }
    }

    .border {
      .line {
        border-radius: 0;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }

  .export {
    display: inline-block;
    width: 66px;
    height: 24px;
    line-height: 24px;
    background: #4877e8;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
  }

  a {
    color: #4877e8;
  }

  .flex1 {
    flex: 1;
    text-align: center;
    min-width: 80px;
  }

  .indication {
    width: 200px;
    padding: 0 14px;
    text-align: center;
  }

  .company {
    width: 300px;
    padding: 0 14px;
    text-align: center;
  }

  .mark-box {
    margin: 10px 0 30px 0;
    text-align: center;

    .all,
    .china {
      display: inline-block;
      margin-right: 20px;

      span {
        display: inline-block;
        width: 30px;
        height: 8px;
        background: #4877e8;
        border-radius: 8px;
        margin-right: 4px;
      }
    }

    .china {
      span {
        background: #90c320;
      }
    }
  }
}
</style>
