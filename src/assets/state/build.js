var fs = require('fs')
// var imgBuf = fs.readFileSync('./Aland.png')
// console.log(imgBuf.toString('base64'))

var sou = fs.readFileSync('default.csv', 'utf-8').replace(/\r\n/g,'\n')
sou = sou.split('\n')
var res = sou.reduce(function (res, item, index) {
  if(!item) {
    return res
  }
  item = item.split(',')
  var name = item[1].replace(/^\s*|\s*$/g, '')
  if(index == 0){
    item.push('src')
    res.push(item.join(','))
  }else if(fs.existsSync('icons/'+item[1]+'.png')){
    item.push(fs.readFileSync('icons/'+item[1]+'.png').toString('base64'))
    res.push(item.join(','))
  }
  return res
}, [])

fs.writeFileSync('index.csv', res.join('\r\n'))
