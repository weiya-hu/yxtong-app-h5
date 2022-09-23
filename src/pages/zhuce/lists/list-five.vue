<template>
  <div class="la-list zhuce-list5">
    <List :loading="listLoading" :nodata="res5 && !res5.length">
      <el-table
        :data="res5"
        fixed
        ref="ElTable"
        :height="tableHeight"
        style="width: 100%"
        v-if="show_table"
      >
        <el-table-column
          v-for="item in tableHead"
          :prop="item.prop"
          :key="item.prop"
          :width="item.prop == 'name' ? 215 : ''"
          :min-width="item.width"
          :label="item.label"
        >
          <!-- 自定义表头 -->
          <template :slot="'header'" slot-scope="scope">
            <div v-if="item.prop === 'jinzhan'" class="jinzhan-title-box">
              <div>临床申请</div>
              <div>临床审评</div>
              <div>补充申请</div>
              <div>批准临床</div>
              <div>补充申请</div>
              <div>上市申请</div>
              <div>上市审评</div>
              <div>补充申请</div>
              <div>批准上市</div>
              <div>补充申请</div>
            </div>
            <span v-else>
              {{ item.label }}
            </span>
          </template>

          <template slot-scope="scope">
            <div>
              <!-- 品种 -->
              <template v-if="item.prop === 'name'">
                <div class="pz-box">
                  <router-link
                    :to="{
                      path:
                        '/zhuce/list?name1=' +
                        scope.row.guifanname +
                        '&qiyemingcheng=' +
                        scope.row.guifanqiyezhongbiao,
                    }"
                    tag="a"
                    target="_blank"
                    class="name"
                    :title="scope.row.guifanname"
                  >
                    {{ scope.row.guifanname }}
                  </router-link>
                  <div class="tag" v-if="scope.row.data_type == 2">
                    改良型新药
                  </div>
                  <div class="tag" v-if="scope.row.data_type == 3">一致性</div>
                </div>
                <div>{{ scope.row.guifanqiyezhongbiao }}</div>
              </template>

              <!-- 阶段 -->
              <template v-else-if="item.prop === 'jinzhan'">
                <div class="line">
                  <!-- 临床申请  和后端约定对应的数字为1 -->
                  <div class="item" v-if="scope.row.new_status_data.order >= 1">
                    <span
                      class="item-info"
                      v-if="
                        scope.row.apply_clinical.newDate ||
                        scope.row.apply_clinical.oldDate ||
                        scope.row.apply_clinical.shoulihao ||
                        scope.row.apply_clinical.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.apply_clinical.newDate"
                        >
                          {{ scope.row.apply_clinical.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content"
                          v-if="scope.row.apply_clinical.oldDate"
                        >
                          {{ scope.row.apply_clinical.oldDate }}
                          <img
                            class="old"
                            src="/static/imgs/zhuce/old.png"
                            alt=""
                          />
                        </div>
                      </div>

                      <el-popover
                        placement="bottom"
                        width="560"
                        :open-delay="500"
                        trigger="hover"
                      >
                        <div v-loading="cardLoading" class="card-table-box">
                          <el-table
                            :data="cardData"
                            :header-cell-style="{
                              background: '#ffff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }"
                            class="card-table"
                          >
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column
                              v-for="item in cardHead"
                              :prop="item.prop"
                              :key="item.prop"
                              :min-width="item.width"
                              :label="item.label"
                            >
                              <template slot-scope="scope2">
                                <div>
                                  <template v-if="item.prop === 'shoulihao'">
                                    <!-- 受理号跳转 -->
                                    <router-link
                                      tag="a"
                                      :to="{
                                        path: '/zhuce/' + scope2.row.id,
                                      }"
                                      class="no-underline cl-blue"
                                      target="_blank"
                                    >
                                      {{ scope2.row.shoulihao }}
                                    </router-link>
                                  </template>

                                  <!-- 结论 -->
                                  <template v-else-if="item.prop === 'jielun'">
                                    <span
                                      :class="{
                                        'bg-green-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') ===
                                            0,
                                        'bg-orange-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') !==
                                            0,
                                      }"
                                      >{{ scope2.row.jielun }}</span
                                    >
                                  </template>

                                  <template v-else>
                                    <span>{{ scope2.row[item.prop] }}</span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          slot="reference"
                          @mouseover="
                            mouseoverData(scope.row.apply_clinical.shoulihao)
                          "
                          v-if="
                            scope.row.apply_clinical.shoulihao.split(';')
                              .length > 2
                          "
                        >
                          <img
                            class="more"
                            src="/static/imgs/zhuce/more.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>
                  <!-- 需要比较 最高阶段的最新时间（如果没有最新，取最早）与该数据中最大的时间，分别记为A和B
                  如果A=B，那么整个进度都为第二种颜色（蓝色）；
                  如果A<B，那么B对应那个阶段及往前是第二种颜色（蓝色）、B对应那个阶段往后是第一种颜色（灰色）。 -->
                  <!-- 临床审评 和后端约定对应的数字为2 -->
                  <div
                    class="item"
                    :class="{
                      item2:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        2 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 2"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.clinical_review.newDate ||
                        scope.row.clinical_review.oldDate ||
                        scope.row.clinical_review.shoulihao ||
                        scope.row.clinical_review.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.clinical_review.newDate"
                        >
                          {{ scope.row.clinical_review.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content"
                          v-if="scope.row.clinical_review.status"
                          :style="{
                            color:
                              scope.row.clinical_review.status == '未被批准'
                                ? '#F77B52'
                                : '#545B6D',
                          }"
                        >
                          {{ scope.row.clinical_review.status }}
                        </div>
                      </div>

                      <el-popover
                        placement="bottom"
                        width="560"
                        :open-delay="500"
                        trigger="hover"
                      >
                        <div v-loading="cardLoading" class="card-table-box">
                          <el-table
                            :data="cardData"
                            :header-cell-style="{
                              background: '#ffff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }"
                            class="card-table"
                          >
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column
                              v-for="item in cardHead"
                              :prop="item.prop"
                              :key="item.prop"
                              :min-width="item.width"
                              :label="item.label"
                            >
                              <template slot-scope="scope2">
                                <div>
                                  <template v-if="item.prop === 'shoulihao'">
                                    <!-- 受理号跳转 -->
                                    <router-link
                                      tag="a"
                                      :to="{
                                        path: '/zhuce/' + scope2.row.id,
                                      }"
                                      class="no-underline cl-blue"
                                      target="_blank"
                                    >
                                      {{ scope2.row.shoulihao }}
                                    </router-link>
                                  </template>

                                  <!-- 结论 -->
                                  <template v-else-if="item.prop === 'jielun'">
                                    <span
                                      :class="{
                                        'bg-green-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') ===
                                            0,
                                        'bg-orange-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') !==
                                            0,
                                      }"
                                      >{{ scope2.row.jielun }}</span
                                    >
                                  </template>

                                  <template v-else>
                                    <span>{{ scope2.row[item.prop] }}</span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          slot="reference"
                          @mouseover="
                            mouseoverData(scope.row.clinical_review.shoulihao)
                          "
                          v-if="
                            scope.row.clinical_review.shoulihao.split(';')
                              .length > 2
                          "
                        >
                          <img
                            class="more"
                            src="/static/imgs/zhuce/more.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 补充申请1 和后端约定对应的数字为3 -->
                  <div
                    class="item"
                    :class="{
                      item3:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        3 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 3"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.supple_apply1.newDate ||
                        scope.row.supple_apply1.oldDate ||
                        scope.row.supple_apply1.shoulihao ||
                        scope.row.supple_apply1.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.supple_apply1.newDate"
                        >
                          {{ scope.row.supple_apply1.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content f12"
                          v-if="scope.row.supple_apply1.shoulihao"
                        >
                          共<el-popover
                            placement="bottom"
                            width="560"
                            :open-delay="500"
                            trigger="hover"
                            v-if="
                              scope.row.supple_apply1.shoulihao.split(';')
                                .length > 2
                            "
                          >
                            <div v-loading="cardLoading" class="card-table-box">
                              <el-table
                                :data="cardData"
                                :header-cell-style="{
                                  background: '#ffff',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }"
                                class="card-table"
                              >
                                <el-table-column type="index" width="50">
                                </el-table-column>
                                <el-table-column
                                  v-for="item in cardHead"
                                  :prop="item.prop"
                                  :key="item.prop"
                                  :min-width="item.width"
                                  :label="item.label"
                                >
                                  <template slot-scope="scope2">
                                    <div>
                                      <template
                                        v-if="item.prop === 'shoulihao'"
                                      >
                                        <!-- 受理号跳转 -->
                                        <router-link
                                          tag="a"
                                          :to="{
                                            path: '/zhuce/' + scope2.row.id,
                                          }"
                                          class="no-underline cl-blue"
                                          target="_blank"
                                        >
                                          {{ scope2.row.shoulihao }}
                                        </router-link>
                                      </template>

                                      <!-- 结论 -->
                                      <template
                                        v-else-if="item.prop === 'jielun'"
                                      >
                                        <span
                                          :class="{
                                            'bg-green-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) === 0,
                                            'bg-orange-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) !== 0,
                                          }"
                                          >{{ scope2.row.jielun }}</span
                                        >
                                      </template>

                                      <template v-else>
                                        <span>{{ scope2.row[item.prop] }}</span>
                                      </template>
                                    </div>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <span
                              class="num"
                              slot="reference"
                              @mouseover="
                                mouseoverData(scope.row.supple_apply1.shoulihao)
                              "
                              @click="
                                gotoListOne(scope.row.supple_apply1.shoulihao)
                              "
                              >{{
                                scope.row.supple_apply1.shoulihao.split(";")
                                  .length
                              }}</span
                            >
                          </el-popover>
                          <span
                            class="num"
                            @click="
                              gotoListOne(scope.row.supple_apply1.shoulihao)
                            "
                            v-else
                            >{{
                              scope.row.supple_apply1.shoulihao.split(";")
                                .length
                            }}</span
                          >
                          条信息
                        </div>
                      </div>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 批准临床 和后端约定对应的数字为4 -->
                  <div
                    class="item"
                    :class="{
                      item4:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        4 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 4"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.clinical_approval.newDate ||
                        scope.row.clinical_approval.oldDate ||
                        scope.row.clinical_approval.shoulihao ||
                        scope.row.clinical_approval.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.clinical_approval.newDate"
                        >
                          {{ scope.row.clinical_approval.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content"
                          v-if="scope.row.clinical_approval.oldDate"
                        >
                          {{ scope.row.clinical_approval.oldDate }}
                          <img
                            class="old"
                            src="/static/imgs/zhuce/old.png"
                            alt=""
                          />
                        </div>
                      </div>

                      <el-popover
                        placement="bottom"
                        width="560"
                        :open-delay="500"
                        trigger="hover"
                      >
                        <div v-loading="cardLoading" class="card-table-box">
                          <el-table
                            :data="cardData"
                            :header-cell-style="{
                              background: '#ffff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }"
                            class="card-table"
                          >
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column
                              v-for="item in cardHead"
                              :prop="item.prop"
                              :key="item.prop"
                              :min-width="item.width"
                              :label="item.label"
                            >
                              <template slot-scope="scope2">
                                <div>
                                  <template v-if="item.prop === 'shoulihao'">
                                    <!-- 受理号跳转 -->
                                    <router-link
                                      tag="a"
                                      :to="{
                                        path: '/zhuce/' + scope2.row.id,
                                      }"
                                      class="no-underline cl-blue"
                                      target="_blank"
                                    >
                                      {{ scope2.row.shoulihao }}
                                    </router-link>
                                  </template>

                                  <!-- 结论 -->
                                  <template v-else-if="item.prop === 'jielun'">
                                    <span
                                      :class="{
                                        'bg-green-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') ===
                                            0,
                                        'bg-orange-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') !==
                                            0,
                                      }"
                                      >{{ scope2.row.jielun }}</span
                                    >
                                  </template>

                                  <template v-else>
                                    <span>{{ scope2.row[item.prop] }}</span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          slot="reference"
                          @mouseover="
                            mouseoverData(scope.row.clinical_approval.shoulihao)
                          "
                          v-if="
                            scope.row.clinical_approval.shoulihao.split(';')
                              .length > 2
                          "
                        >
                          <img
                            class="more"
                            src="/static/imgs/zhuce/more.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 补充申请2 和后端约定对应的数字为5 -->
                  <div
                    class="item"
                    :class="{
                      item5:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        5 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 5"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.supple_apply2.newDate ||
                        scope.row.supple_apply2.oldDate ||
                        scope.row.supple_apply2.shoulihao ||
                        scope.row.supple_apply2.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.supple_apply2.newDate"
                        >
                          {{ scope.row.supple_apply2.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content f12"
                          v-if="scope.row.supple_apply2.shoulihao"
                        >
                          共<el-popover
                            placement="bottom"
                            width="560"
                            :open-delay="500"
                            trigger="hover"
                            v-if="
                              scope.row.supple_apply2.shoulihao.split(';')
                                .length > 2
                            "
                          >
                            <div v-loading="cardLoading" class="card-table-box">
                              <el-table
                                :data="cardData"
                                :header-cell-style="{
                                  background: '#ffff',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }"
                                class="card-table"
                              >
                                <el-table-column type="index" width="50">
                                </el-table-column>
                                <el-table-column
                                  v-for="item in cardHead"
                                  :prop="item.prop"
                                  :key="item.prop"
                                  :min-width="item.width"
                                  :label="item.label"
                                >
                                  <template slot-scope="scope2">
                                    <div>
                                      <template
                                        v-if="item.prop === 'shoulihao'"
                                      >
                                        <!-- 受理号跳转 -->
                                        <router-link
                                          tag="a"
                                          :to="{
                                            path: '/zhuce/' + scope2.row.id,
                                          }"
                                          class="no-underline cl-blue"
                                          target="_blank"
                                        >
                                          {{ scope2.row.shoulihao }}
                                        </router-link>
                                      </template>

                                      <!-- 结论 -->
                                      <template
                                        v-else-if="item.prop === 'jielun'"
                                      >
                                        <span
                                          :class="{
                                            'bg-green-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) === 0,
                                            'bg-orange-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) !== 0,
                                          }"
                                          >{{ scope2.row.jielun }}</span
                                        >
                                      </template>

                                      <template v-else>
                                        <span>{{ scope2.row[item.prop] }}</span>
                                      </template>
                                    </div>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <span
                              class="num"
                              slot="reference"
                              @mouseover="
                                mouseoverData(scope.row.supple_apply2.shoulihao)
                              "
                              @click="
                                gotoListOne(scope.row.supple_apply2.shoulihao)
                              "
                              >{{
                                scope.row.supple_apply2.shoulihao.split(";")
                                  .length
                              }}</span
                            >
                          </el-popover>
                          <span
                            class="num"
                            @click="
                              gotoListOne(scope.row.supple_apply2.shoulihao)
                            "
                            v-else
                            >{{
                              scope.row.supple_apply2.shoulihao.split(";")
                                .length
                            }}</span
                          >条信息
                        </div>
                      </div>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 上市申请 和后端约定对应的数字为6 -->
                  <div
                    class="item"
                    :class="{
                      item6:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        6 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 6"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.listing_application.newDate ||
                        scope.row.listing_application.oldDate ||
                        scope.row.listing_application.shoulihao ||
                        scope.row.listing_application.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.listing_application.newDate"
                        >
                          {{ scope.row.listing_application.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content"
                          v-if="scope.row.listing_application.oldDate"
                        >
                          {{ scope.row.listing_application.oldDate }}
                          <img
                            class="old"
                            src="/static/imgs/zhuce/old.png"
                            alt=""
                          />
                        </div>
                      </div>

                      <el-popover
                        placement="bottom"
                        width="560"
                        :open-delay="500"
                        trigger="hover"
                      >
                        <div v-loading="cardLoading" class="card-table-box">
                          <el-table
                            :data="cardData"
                            :header-cell-style="{
                              background: '#ffff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }"
                            class="card-table"
                          >
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column
                              v-for="item in cardHead"
                              :prop="item.prop"
                              :key="item.prop"
                              :min-width="item.width"
                              :label="item.label"
                            >
                              <template slot-scope="scope2">
                                <div>
                                  <template v-if="item.prop === 'shoulihao'">
                                    <!-- 受理号跳转 -->
                                    <router-link
                                      tag="a"
                                      :to="{
                                        path: '/zhuce/' + scope2.row.id,
                                      }"
                                      class="no-underline cl-blue"
                                      target="_blank"
                                    >
                                      {{ scope2.row.shoulihao }}
                                    </router-link>
                                  </template>

                                  <!-- 结论 -->
                                  <template v-else-if="item.prop === 'jielun'">
                                    <span
                                      :class="{
                                        'bg-green-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') ===
                                            0,
                                        'bg-orange-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') !==
                                            0,
                                      }"
                                      >{{ scope2.row.jielun }}</span
                                    >
                                  </template>

                                  <template v-else>
                                    <span>{{ scope2.row[item.prop] }}</span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          slot="reference"
                          @mouseover="
                            mouseoverData(
                              scope.row.listing_application.shoulihao
                            )
                          "
                          v-if="
                            scope.row.listing_application.shoulihao.split(';')
                              .length > 2
                          "
                        >
                          <img
                            class="more"
                            src="/static/imgs/zhuce/more.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 上市审评 和后端约定对应的数字为7 -->
                  <div
                    class="item"
                    :class="{
                      item7:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        7 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 7"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.listing_review.newDate ||
                        scope.row.listing_review.oldDate ||
                        scope.row.listing_review.shoulihao ||
                        scope.row.listing_review.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.listing_review.newDate"
                        >
                          {{ scope.row.listing_review.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content"
                          v-if="scope.row.listing_review.status"
                          :style="{
                            color:
                              scope.row.listing_review.status == '未被批准'
                                ? '#F77B52'
                                : '#545B6D',
                          }"
                        >
                          {{ scope.row.listing_review.status }}
                        </div>
                      </div>

                      <el-popover
                        placement="bottom"
                        width="560"
                        :open-delay="500"
                        trigger="hover"
                      >
                        <div v-loading="cardLoading" class="card-table-box">
                          <el-table
                            :data="cardData"
                            :header-cell-style="{
                              background: '#ffff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }"
                            class="card-table"
                          >
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column
                              v-for="item in cardHead"
                              :prop="item.prop"
                              :key="item.prop"
                              :min-width="item.width"
                              :label="item.label"
                            >
                              <template slot-scope="scope2">
                                <div>
                                  <template v-if="item.prop === 'shoulihao'">
                                    <!-- 受理号跳转 -->
                                    <router-link
                                      tag="a"
                                      :to="{
                                        path: '/zhuce/' + scope2.row.id,
                                      }"
                                      class="no-underline cl-blue"
                                      target="_blank"
                                    >
                                      {{ scope2.row.shoulihao }}
                                    </router-link>
                                  </template>

                                  <!-- 结论 -->
                                  <template v-else-if="item.prop === 'jielun'">
                                    <span
                                      :class="{
                                        'bg-green-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') ===
                                            0,
                                        'bg-orange-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') !==
                                            0,
                                      }"
                                      >{{ scope2.row.jielun }}</span
                                    >
                                  </template>

                                  <template v-else>
                                    <span>{{ scope2.row[item.prop] }}</span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          slot="reference"
                          @mouseover="
                            mouseoverData(scope.row.listing_review.shoulihao)
                          "
                          v-if="
                            scope.row.listing_review.shoulihao.split(';')
                              .length > 2
                          "
                        >
                          <img
                            class="more"
                            src="/static/imgs/zhuce/more.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 补充申请3 和后端约定对应的数字为8 -->
                  <div
                    class="item"
                    :class="{
                      item8:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        8 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 8"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.supple_apply3.newDate ||
                        scope.row.supple_apply3.oldDate ||
                        scope.row.supple_apply3.shoulihao ||
                        scope.row.supple_apply3.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.supple_apply3.newDate"
                        >
                          {{ scope.row.supple_apply3.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content f12"
                          v-if="scope.row.supple_apply3.shoulihao"
                        >
                          共<el-popover
                            placement="bottom"
                            width="560"
                            :open-delay="500"
                            trigger="hover"
                            v-if="
                              scope.row.supple_apply3.shoulihao.split(';')
                                .length > 2
                            "
                          >
                            <div v-loading="cardLoading" class="card-table-box">
                              <el-table
                                :data="cardData"
                                :header-cell-style="{
                                  background: '#ffff',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }"
                                class="card-table"
                              >
                                <el-table-column type="index" width="50">
                                </el-table-column>
                                <el-table-column
                                  v-for="item in cardHead"
                                  :prop="item.prop"
                                  :key="item.prop"
                                  :min-width="item.width"
                                  :label="item.label"
                                >
                                  <template slot-scope="scope2">
                                    <div>
                                      <template
                                        v-if="item.prop === 'shoulihao'"
                                      >
                                        <!-- 受理号跳转 -->
                                        <router-link
                                          tag="a"
                                          :to="{
                                            path: '/zhuce/' + scope2.row.id,
                                          }"
                                          class="no-underline cl-blue"
                                          target="_blank"
                                        >
                                          {{ scope2.row.shoulihao }}
                                        </router-link>
                                      </template>

                                      <!-- 结论 -->
                                      <template
                                        v-else-if="item.prop === 'jielun'"
                                      >
                                        <span
                                          :class="{
                                            'bg-green-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) === 0,
                                            'bg-orange-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) !== 0,
                                          }"
                                          >{{ scope2.row.jielun }}</span
                                        >
                                      </template>

                                      <template v-else>
                                        <span>{{ scope2.row[item.prop] }}</span>
                                      </template>
                                    </div>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <span
                              class="num"
                              slot="reference"
                              @mouseover="
                                mouseoverData(scope.row.supple_apply3.shoulihao)
                              "
                              @click="
                                gotoListOne(scope.row.supple_apply3.shoulihao)
                              "
                              >{{
                                scope.row.supple_apply3.shoulihao.split(";")
                                  .length
                              }}</span
                            >
                          </el-popover>
                          <span
                            class="num"
                            @click="
                              gotoListOne(scope.row.supple_apply3.shoulihao)
                            "
                            v-else
                            >{{
                              scope.row.supple_apply3.shoulihao.split(";")
                                .length
                            }}</span
                          >条信息
                        </div>
                      </div>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 批准上市 和后端约定对应的数字为9 -->
                  <div
                    class="item"
                    :class="{
                      item9:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        9 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 9"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.approval_listing.newDate ||
                        scope.row.approval_listing.oldDate ||
                        scope.row.approval_listing.shoulihao ||
                        scope.row.approval_listing.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.approval_listing.newDate"
                        >
                          {{ scope.row.approval_listing.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content"
                          v-if="scope.row.approval_listing.oldDate"
                        >
                          {{ scope.row.approval_listing.oldDate }}
                          <img
                            class="old"
                            src="/static/imgs/zhuce/old.png"
                            alt=""
                          />
                        </div>
                      </div>

                      <el-popover
                        placement="bottom"
                        width="560"
                        :open-delay="500"
                        trigger="hover"
                      >
                        <div v-loading="cardLoading" class="card-table-box">
                          <el-table
                            :data="cardData"
                            :header-cell-style="{
                              background: '#ffff',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }"
                            class="card-table"
                          >
                            <el-table-column type="index" width="50">
                            </el-table-column>
                            <el-table-column
                              v-for="item in cardHead"
                              :prop="item.prop"
                              :key="item.prop"
                              :min-width="item.width"
                              :label="item.label"
                            >
                              <template slot-scope="scope2">
                                <div>
                                  <template v-if="item.prop === 'shoulihao'">
                                    <!-- 受理号跳转 -->
                                    <router-link
                                      tag="a"
                                      :to="{
                                        path: '/zhuce/' + scope2.row.id,
                                      }"
                                      class="no-underline cl-blue"
                                      target="_blank"
                                    >
                                      {{ scope2.row.shoulihao }}
                                    </router-link>
                                  </template>

                                  <!-- 结论 -->
                                  <template v-else-if="item.prop === 'jielun'">
                                    <span
                                      :class="{
                                        'bg-green-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') ===
                                            0,
                                        'bg-orange-br':
                                          scope2.row.jielun &&
                                          scope2.row.jielun.indexOf('批准') !==
                                            0,
                                      }"
                                      >{{ scope2.row.jielun }}</span
                                    >
                                  </template>

                                  <template v-else>
                                    <span>{{ scope2.row[item.prop] }}</span>
                                  </template>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div
                          slot="reference"
                          @mouseover="
                            mouseoverData(scope.row.approval_listing.shoulihao)
                          "
                          v-if="
                            scope.row.approval_listing.shoulihao.split(';')
                              .length > 2
                          "
                        >
                          <img
                            class="more"
                            src="/static/imgs/zhuce/more.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>

                  <!-- 补充申请4 和后端约定对应的数字为10 -->
                  <div
                    class="item"
                    :class="{
                      item10:
                        scope.row.new_status_data.newStatusDate <
                          scope.row.new_status_data.maxDate &&
                        10 >= scope.row.new_status_data.order1,
                    }"
                    v-if="scope.row.new_status_data.order >= 10"
                  >
                    <span
                      class="item-info"
                      v-if="
                        scope.row.supple_apply4.newDate ||
                        scope.row.supple_apply4.oldDate ||
                        scope.row.supple_apply4.shoulihao ||
                        scope.row.supple_apply4.status
                      "
                    >
                      <div>
                        <div
                          class="content"
                          v-if="scope.row.supple_apply4.newDate"
                        >
                          {{ scope.row.supple_apply4.newDate }}
                          <img
                            class="new"
                            src="/static/imgs/zhuce/new.png"
                            alt=""
                          />
                        </div>
                        <div
                          class="content f12"
                          v-if="scope.row.supple_apply4.shoulihao"
                        >
                          共<el-popover
                            placement="bottom"
                            width="560"
                            :open-delay="500"
                            trigger="hover"
                            v-if="
                              scope.row.supple_apply4.shoulihao.split(';')
                                .length > 2
                            "
                          >
                            <div v-loading="cardLoading" class="card-table-box">
                              <el-table
                                :data="cardData"
                                :header-cell-style="{
                                  background: '#ffff',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }"
                                class="card-table"
                              >
                                <el-table-column type="index" width="50">
                                </el-table-column>
                                <el-table-column
                                  v-for="item in cardHead"
                                  :prop="item.prop"
                                  :key="item.prop"
                                  :min-width="item.width"
                                  :label="item.label"
                                >
                                  <template slot-scope="scope2">
                                    <div>
                                      <template
                                        v-if="item.prop === 'shoulihao'"
                                      >
                                        <!-- 受理号跳转 -->
                                        <router-link
                                          tag="a"
                                          :to="{
                                            path: '/zhuce/' + scope2.row.id,
                                          }"
                                          class="no-underline cl-blue"
                                          target="_blank"
                                        >
                                          {{ scope2.row.shoulihao }}
                                        </router-link>
                                      </template>

                                      <!-- 结论 -->
                                      <template
                                        v-else-if="item.prop === 'jielun'"
                                      >
                                        <span
                                          :class="{
                                            'bg-green-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) === 0,
                                            'bg-orange-br':
                                              scope2.row.jielun &&
                                              scope2.row.jielun.indexOf(
                                                '批准'
                                              ) !== 0,
                                          }"
                                          >{{ scope2.row.jielun }}</span
                                        >
                                      </template>

                                      <template v-else>
                                        <span>{{ scope2.row[item.prop] }}</span>
                                      </template>
                                    </div>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <span
                              class="num"
                              slot="reference"
                              @mouseover="
                                mouseoverData(scope.row.supple_apply4.shoulihao)
                              "
                              @click="
                                gotoListOne(scope.row.supple_apply4.shoulihao)
                              "
                              >{{
                                scope.row.supple_apply4.shoulihao.split(";")
                                  .length
                              }}</span
                            >
                          </el-popover>
                          <span
                            v-else
                            class="num"
                            @click="
                              gotoListOne(scope.row.supple_apply4.shoulihao)
                            "
                            >{{
                              scope.row.supple_apply4.shoulihao.split(";")
                                .length
                            }}</span
                          >
                          条信息
                        </div>
                      </div>
                    </span>
                    <span v-else class="no-data">-</span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="positon: relative">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="param.page"
          :page-sizes="[20, 30, 50]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="speciesProdevCount"
          :disabled="nopms.fy"
          :class="{ 'abandon-click-method': nopms.fy }"
        >
        </el-pagination>
        <span class="out-of-page cl-red">限于内容篇幅，部分结果未予显示</span>
      </div>
    </List>
  </div>
</template>

<script>
import LoadingGif from "@/components/common/globalCom/loading-gif";
import List from "@/components/layouts/list";
import { mapState } from "vuex";
import commonMixins from "@/mixins/common.js";
import setTableHMixins from "@/mixins/setTableH.js";
export default {
  components: {
    LoadingGif,
    List,
  },
  mixins: [commonMixins, setTableHMixins],
  data() {
    return {
      tableHead: [
        {
          prop: "name",
          label: "品种",
          width: 215, //最少宽度
        },
        {
          prop: "jinzhan",
          label: "",
          width: 1380, //最少宽度
        },
      ],
      show_table: true,
      cardLoading: false, // 卡片弹窗加载效果
      cardData: [], // 弹窗表格数据
      cardHead: [
        {
          prop: "shoulihao",
          label: "受理号",
          width: 140,
        },
        {
          prop: "chengbanriqi",
          label: "承办日期",
          width: 120,
        },
        {
          prop: "zhuangtaikaishishijian",
          label: "状态开始时间",
          width: 120,
        },
        {
          prop: "jielun",
          label: "审评结论",
          width: 100,
        },
      ],
      tableHeight:
        document.documentElement.clientHeight - 48 - 60 - 60 - 50 - 88,
    };
  },
  computed: {
    //同时获取多个属性
    ...mapState({
      tableconf: (state) => state.Zhuce.tableconf,
      allBase: (state) => state.Zhuce.allBase,
      res5: (state) =>
        _.keys(state.Zhuce.res5).length ? state.Zhuce.res5 : [],
      errocode: (state) => state.Zhuce.error,
      listLoading: (state) => state.Zhuce.listLoading,
      speciesProdevCount: (state) => state.Zhuce.speciesProdevCount,
      param: (state) => state.Zhuce.speciesProdev_param, // 附加参数(存于vuex内)
      nopms: (state) => state.Zhuce.nopms,
      order: (state) => state.Zhuce.order,
    }),
  },
  // safari浏览器回到当前页面会导致样式错乱问题，由于使用了keepalive所以需要在activated生命周期中在调一次计算方法
  activated() {
    this.registerEven();
  },
  watch: {
    res5: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true,
    },
    tableHead: {
      handler() {
        this.$nextTick(() => {
          this.registerEven();
        });
      },
      immediate: true,
    },
  },
  methods: {
    // 鼠标移入获取弹窗受理号数据
    mouseoverData(shoulihao) {
      console.log(shoulihao);
      this.cardLoading = true;
      this.cardData = [];
      window
        .Axios({
          method: "get",
          url: "/api/zhuce/speciesProdevList",
          params: {
            shoulihao: shoulihao,
            pageSize: 1000,
          },
        })
        .then((res) => {
          this.cardLoading = false;
          if (res.data.data) {
            this.cardData = res.data.data.res;
          }
        });
    },

    // 补充申请点击跳转到默认列表
    gotoListOne(shoulihao) {
      let shoulihao1 = shoulihao.replace(/;/g, "ღ");
      console.log(shoulihao1);
      let routeData = this.$router.resolve({
        path: `/zhuce/list?fourth_condition=shoulihao1=${shoulihao1}`,
      });
      window.open(routeData.href, "_blank");
    },
    handleCurrentChange(val) {
      this.param.page = val;
      if (val * this.param.pageSize <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Zhuce/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
    handleSizeChange(val) {
      this.param.page = 1;
      this.param.pageSize = val;
      if (val * this.param.page <= 1500) {
        $(".out-of-page").hide();
        Store.dispatch("Zhuce/nomalSearch", { params: this.param });
      } else {
        $(".out-of-page").show();
      }
    },
  },
  created() {},
};
</script>

<style lang="less">
@import "~@/assets/less/var.less";
.card-table-box {
  padding: 5px 8px 15px 8px;
  box-sizing: border-box;
  max-height: 400px;
  overflow: auto;
  .card-table {
    td,
    th {
      border-bottom: 1px solid #dfe5f1;
    }
  }
  .card-table thead th > .cell {
    height: 40px;
    line-height: 40px;
  }

  .card-table tbody td > .cell {
    padding: 12px 0 12px 14px;
  }
  .card-table tbody tr td:last-child {
    padding-right: 16px;
  }
}
.zhuce-list5 {
  .el-table {
    .bg-green-br {
      // display: inline-block;
      text-align: center;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 10px;
      background-color: @Green;
      color: #fff;
      max-width: 80px;
      overflow: hidden;
    }
    .bg-orange-br {
      // display: inline-block;
      text-align: center;
      font-size: 12px;
      padding: 4px 10px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      background-color: @Orange;
      color: #fff;
      max-width: 80px;
      overflow: hidden;
    }
    td .cell {
      overflow: unset;
      text-overflow: unset;
      display: block;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
    }

    td .cell > div {
      overflow: unset;
      text-overflow: unset;
      display: block;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
      max-height: unset;
    }

    .jinzhan-title-box {
      width: 100%;
      display: flex;
      padding: 0;
      line-height: 28px;

      div {
        flex: 1;
        padding: 0;
        text-align: center;
        position: relative;
        line-height: 28px;
      }
    }

    .pz-box {
      display: flex;
      .name {
        max-width: 130px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-decoration: underline;
        margin-bottom: 2px;
        margin-right: 5px;

        &:hover {
          color: #4877e8;
        }
      }

      .tag {
        height: 20px;
        // border-radius: 2px;
        // border: 1px solid #4877e8;
        // padding: 0 5px;
        // box-sizing: border-box;
        font-size: 12px;
        color: #4877e8;
      }
    }

    .line {
      width: 100%;
      white-space: nowrap;
      box-sizing: border-box;
      height: 44px;
      position: relative;
      // display: flex;
      .item {
        height: 44px;
        border-radius: 24px;
        width: calc(100% / 8);
        position: absolute;
        display: inline-block;
        font-size: 12px;

        .item-info {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          .content {
            display: flex;
            align-items: center;

            .new,
            .old {
              width: 26px;
              height: 12px;
              margin-left: 2px;
            }
          }

          .f12 {
            font-size: 12px;
          }

          .num {
            color: #4877e8 !important;
            cursor: pointer;
          }
        }

        .more {
          width: 14px;
          height: 11px;
          margin-left: 8px;
          cursor: pointer;
        }

        .no-data {
          display: table;
          width: 100%;
          height: 100%;
          line-height: 44px;
          text-align: center;
        }
      }

      .item:not(:first-child) {
        .item-info {
          position: absolute;
          left: 25%;
        }
      }

      .item:nth-of-type(1) {
        background: #e4ebfc;
        left: 0%;
        z-index: 10;

        .item-info {
          position: absolute;
          left: 20%;
        }
      }
      .item:nth-of-type(2) {
        background: #dae4fa;
        left: 10%;
        z-index: 9;
      }
      .item:nth-of-type(3) {
        background: #d1ddf9;
        left: 20%;
        z-index: 8;
      }
      .item:nth-of-type(4) {
        background: #c8d6f8;
        left: 30%;
        z-index: 7;
      }
      .item:nth-of-type(5) {
        background: #bfd0f7;
        left: 40%;
        z-index: 6;
      }
      .item:nth-of-type(6) {
        background: #b6c9f6;
        left: 50%;
        z-index: 5;
      }
      .item:nth-of-type(7) {
        background: #acc2f4;
        left: 60%;
        z-index: 4;
      }
      .item:nth-of-type(8) {
        background: #a3bbf3;
        left: 70%;
        z-index: 3;
      }
      .item:nth-of-type(9) {
        background: #94b1f3;
        left: 80%;
        z-index: 2;
      }
      .item:nth-of-type(10) {
        background: #82a3f0;
        left: 88.5%;
        z-index: 1;

        .item-info {
          position: absolute;
          left: 35%;
        }
      }

      .item2 {
        background: #fcfdfd !important;
      }
      .item3 {
        background: #f7fafa !important;
      }
      .item4 {
        background: #f3f6f9 !important;
      }
      .item5 {
        background: #f0f5f7 !important;
      }
      .item6 {
        background: #f0f1f7 !important;
      }
      .item7 {
        background: #f1f4fb !important;
      }
      .item8 {
        background: #edf0f6 !important;
      }
      .item9 {
        background: #e4ebf1 !important;
      }
      .item10 {
        background: #e1e6f0 !important;
      }

      @media screen and (min-width: 2000px) {
        .item {
          .item-info {
            position: absolute;
            left: 32% !important;
          }
        }

        .item:nth-of-type(10) {
          left: 88%;
          .item-info {
            position: absolute;
            left: 42% !important;
          }
        }
      }
    }
  }

  .el-table tbody tr td:last-child {
    padding-right: 24px;
  }
}

.row-class-position {
  position: relative;
  .row-absolute {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30px;
    writing-mode: vertical-lr;
    line-height: 30px;
    text-align: center;
    letter-spacing: 1px;
    display: none;
    color: #fff;
    overflow: hidden;
    cursor: pointer;
  }
  &:hover {
    .row-absolute {
      display: block;
    }
  }
}
.extensible-table {
  .extensible-td {
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: @PrimaryColor;
      font-weight: 600;
    }
  }
  .extensible-num-td {
    cursor: pointer;
    > span > span {
      white-space: nowrap;
    }
    .num-text {
      text-decoration: underline;
      &:hover {
        color: @PrimaryColor;
        font-weight: 600;
      }
    }
  }
  tr.el-table__row--striped {
    td {
      &.active {
        color: @PrimaryColor;
        font-weight: 600;
        background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
          10px bottom #f5f8fb;
      }
    }
  }
  td {
    position: relative;
    .el-icon-caret-top {
      font-size: 20px;
      display: none;
    }
    &.active {
      color: @PrimaryColor;
      font-weight: 600;
      background: url("~@/assets/imgs/zhuce/el-icon-caret-top.png") no-repeat
        10px bottom;
    }
  }
}
</style>
