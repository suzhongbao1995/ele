const express = require("express");
const request = require("request");
const path = require("path");
const app = express();
app.use(express.static(path.resolve(__dirname,"../")))
app.get("/movie",function (req,res) {
    request("https://douban.uieee.com/v2/movie/top250?count="+req.query.count+"&start="+req.query.start,function (err,response,body) {
        if(!err && response.statusCode === 200){
            res.json(JSON.parse(body))
        }else{
            res.json({
                ok:-1,
                msg:"网络连接错误"
            })
        }
    })
})
app.listen(80,function () {
    console.log("success");
})