
const { jsPDF } = window.jspdf;
// import jsPDF from "jspdf";

export default {
    data() {
        return {
            pdfcontent: null,
            pdffont: window.font,
        }
    },
    methods: {
        html2pdf(node, scale) {
            return new Promise(resolve => {
                this.pdfcontent.html(node, {
                    callback: function (pdf) {
                        resolve(pdf)
                    },
                    x: 0,
                    y: 0,
                    html2canvas: {
                        useCORS: true,
                        scale: scale||0.62,
                        dpi: 96,
                        backgroundColor: '#ffffff', 
                    },
                })
            })
        },
        async init(options) {
            this.pdfcontent = null;
            this.pdfcontent = await new jsPDF('p', 'pt', 'a4');
            this.pdfcontent.addFileToVFS('wqyhei.ttf', this.pdffont);
            options.fontfaces.forEach(font => {
                this.pdfcontent.addFont('wqyhei.ttf', font, 'normal')
                this.pdfcontent.setFont(font,'normal');
            });
        },
        /**
         * 
         * @param {HTMLElement} node 
         * @param {string} filename 
         */
        async generate(node, filename, scale) {
            // node.style.width = `${this.pdfcontent.getPageWidth()}px`;
            
            var pageHeight = (this.pdfcontent.getPageHeight() - 160)*0.62;
            console.log(pageHeight); // 这个是 换算到pdf高度的
            var pageNums = Math.ceil(node.clientHeight / this.pdfcontent.getPageHeight()); // 根据高度 预估页数 不会多于这个数字
            console.log(pageNums, 'pageNums');
            console.log(node.clientHeight, 'content height');
            console.log(pageHeight, 'page height');
            var sections = node.querySelectorAll('.section');
            for (let i = 0;i<sections.length;i++) {
                let height = sections[i].clientHeight;
                if (height<=pageHeight) {
                    sections[i].style.height = pageHeight+'px'
                } else {
                    var scalePage = Math.ceil(height/pageHeight);
                    sections[i].style.height = (pageHeight*scalePage)+'px'
                }
            }
            const pdf = await this.html2pdf(node, scale);
            let pageCount = pdf.internal.getNumberOfPages();
            while(pageCount>pageNums) {
                pdf.deletePage(pageCount);
                pageCount-=1;
            }
            pdf.save(filename+'.pdf');
        }
    },
}