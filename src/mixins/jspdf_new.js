/*
 * @Author: your name
 * @Date: 2021-06-21 15:18:00
 * @LastEditTime: 2021-06-24 11:32:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vip/src/mixins/jspdf.js
 */
import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import moment from "moment";
const { jsPDF } = window.jspdf;
// import $ from "jquery"
// import Axios from "_axios@0.18.1@axios";
export default {
    methods: {
        htmlConvertImg(selector, file_name, currIndex) {
            return new Promise((resolve, reject) => {
                let element = document.querySelector(selector),
                    scale = window.devicePixelRatio,
                    dpi = 96 * 6; // 获取设备像素比
                if (this.$router.history.current.path === "/trz/report")
                    scale = scale;
                else scale = 0.8;
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
                        console.log(
                            renderedHeight,
                            Math.min(imgHeight, canvas.height - renderedHeight)
                        );
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
                        baseImgArr.push(page); // 不进行转换base64操作 直接返回生成的 canvas 节点
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
        },
        /**
         *
         * @param {canvas节点的数组} pages
         * pdf.addImage  支持 直接添加 canvas标签。
         */
        async pdfed(pages, fileName) {
            let a4w = 194,
                a4h = 281;
            let start = new Date().getTime();
            let pdf = new jsPDF("p", "mm", "a4");
            pdf.page = 1;
            const NOW = moment().format("YYYYMMDDHHmmss");
            for (let i = 0; i < pages.length; i++) {

                pdf.addImage(
                    pages[i],
                    "WEBP",
                    8,
                    0,
                    a4w,
                    Math.min(a4h, (a4w * pages[i].height) / pages[i].width)
                );
                pdf.setFontSize(8);
                pdf.text(105, 295, pdf.page + "");
                if (i < pages.length - 1) {
                    pdf.addPage();
                }
                pdf.page++;
            }
            let during = new Date().getTime() - start;
            console.log(during, "：PDF生成耗时");
            return pdf.save(fileName + ".pdf", { returnPromise: true });
        }
    }
};