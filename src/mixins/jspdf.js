/*
 * @Author: your name
 * @Date: 2021-06-21 15:18:00
 * @LastEditTime: 2021-06-24 11:32:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vip/src/mixins/jspdf.js
 */
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import $ from "jquery"
// import Axios from "_axios@0.18.1@axios";
export default {
  methods: {
    htmlCovertPdf(selector, title) {
      let element = document.querySelector(selector);
      let scale = window.devicePixelRatio; // 获取设备像素比
      html2canvas(element, {
        useCORS: true,
        scale: scale
        /* dpi: 96,
                                                        scale: 2,
                                                        useCORS: true, */
      }).then(canvas => {
        let pdf = new jsPDF("p", "mm", "a4"); //A4纸，纵向
        let ctx = canvas.getContext("2d"),
          a4w = 194,
          a4h = 281, //A4大小，210mm x 297mm
          imgHeight = Math.floor((a4h * canvas.width) / a4w), //按A4显示比例换算一页图像的像素高度
          renderedHeight = 0;
        pdf.page = 1;

        while (renderedHeight < canvas.height) {
          var child = document.createElement("p");
          child.innerHTML = pdf.page;
          let page = document.createElement("canvas");
          page.width = canvas.width;
          page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页
          //用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page
            .getContext("2d")
            .putImageData(
              ctx.getImageData(
                0,
                renderedHeight,
                canvas.width,
                Math.min(imgHeight, canvas.height - renderedHeight)
              ),
              0,
              0
            );
          pdf.addImage(
            page.toDataURL("image/jpeg", 1.0),
            "JPEG",
            8,
            8,
            a4w,
            Math.min(a4h, (a4w * page.height) / page.width)
          ); //添加图像到页面，保留10mm边距
          pdf.setFontSize(8);
          pdf.text(105, 295, pdf.page + "");
          pdf.page++;
          renderedHeight += imgHeight;
          if (renderedHeight < canvas.height) {
            pdf.addPage(); //如果后面还有内容，添加一个空页
          }
          //delete page;
        }
        //this.$emit("update:isloading", false);
        pdf.save(`${title}.pdf`, { returnPromise: true }).then(() => {
          setTimeout(() => {
            this.$emit("update:jspdf", false);
            this.$emit("update:isloading", false);
          }, 500);
        });
      });
    },
    convertToBlob(_base64) {
      let byteString = _base64.split(",")[1],
        mimeString = _base64
          .split(",")[0]
          .split(":")[1]
          .split(";")[0],
        ab = new ArrayBuffer(byteString.length),
        ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {
        type: mimeString
      });
    },
    htmlConvertImg(selector, file_name, currIndex) {
      return new Promise((resolve, reject) => {
        let element = document.querySelector(selector),
          scale = window.devicePixelRatio,
          dpi = 96 * 3; // 获取设备像素比
        html2canvas(element, {
          useCORS: true,
          scale,
          dpi
        }).then(async canvas => {
          let ctx = canvas.getContext("2d"),
            a4w = 194,
            a4h = 281, //A4大小，210mm x 297mm
            imgHeight = Math.floor((a4h * canvas.width) / a4w), //按A4显示比例换算一页图像的像素高度
            renderedHeight = 0,
            baseImgArr = [];

          while (renderedHeight < canvas.height) {
            let page = document.createElement("canvas");
            page.width = canvas.width;
            page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页
            await page
              .getContext("2d")
              .putImageData(
                ctx.getImageData(
                  0,
                  renderedHeight,
                  canvas.width,
                  Math.min(imgHeight, canvas.height - renderedHeight)
                ),
                0,
                0
              );
            let blobArr = URL.createObjectURL(
              this.convertToBlob(page.toDataURL("image/jpeg", 1.0))
            );
            baseImgArr.push(page.toDataURL("image/jpeg", 1.0)); // base64格式的src有可能过长"too large"，因此需要转成blob格式
            renderedHeight += imgHeight;
          }
          // if (isFirst == false) {
          //   setTimeout(() => {
          //     this.$emit("update:jspdf", false);
          //     this.$emit("update:isloading", false);
          //   }, 500);
          // }
          resolve(baseImgArr);
        });
      });
    }
  }
};
