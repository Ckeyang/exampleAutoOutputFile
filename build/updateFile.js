var fs = require('fs'); //文件读写
var configPath = "./index.html";
//剔除其他项目的配置文件
updateProjectName(configPath, function(text) {
  console.log(text)
  fs.writeFile(configPath,text,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
       if(err){
           console.log("文件写入失败")
       }else{
           console.log("文件写入成功");
       }
  })
})
//修改config的配置
function updateProjectName(filePath, suc) {
//   var reg = /(\.css|\.js)\?v=\d+/g;
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.log('file read error!');
      throw err;
    }
    var time = (new Date()).getTime();
    var text = data.replace('//192.168.30.253:8010/web-apps/apps/api/documents/api.js',process.argv[2])
    suc(text);
  });
}