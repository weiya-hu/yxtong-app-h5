<template>
  <div class="imgShow">
    <span @click="dialogVisible = true" class="colorBlue" v-if="url">
      查看
    </span>
    <span v-else>{{ $route.path.includes("/instruct") ? "" : "/" }}</span>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800"
      v-if="url"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <div slot="title" class="dialog-header">
        包装图片
      </div>
      <div>
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="(item, index) in url" :key="index">
            <div class="imgbox">
              <div class="imgOne">
                <img
                  class="imgOne_img"
                  @click="scaleImg(item)"
                  :src="item"
                  alt="药品图片"
                />
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false

      // url:[
      //   'http://zy.yaozh.com/newdb/upload/image/default-pic.png',
      //   '/static/imgs/usercenter/nodata.png',
      //   '/static/imgs/usercenter/header-more-msg.png',
      // ]
    };
  },
  props: ["url"],
  methods: {
    scaleImg(item) {
      this.dialogVisible = false;
      this.$Img(item);
    }
  }
};
</script>

<style lang="less" scope>
.imgShow {
  display: inline;
  .colorBlue {
    color: #4a77e8;
    cursor: pointer;
  }
  .el-dialog__header {
    height: 50px;
  }
  .imgbox {
    height: 250px;
    width: 400px;
    display: table;
    // border: 1px solid #ccc;
    .imgOne {
      text-align: center;
      display: table-cell;
      vertical-align: middle;
      .imgOne_img {
        max-height: 200px;
        max-width: 400px;
      }
    }
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
}
</style>
