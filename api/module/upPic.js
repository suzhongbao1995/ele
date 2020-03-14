const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const uploadDir = path.resolve(__dirname,"../upload");
/*
* 上传模块
* req:请求对象
* picName:表单元素当中提交文件的名字
* cb:回调
* {
*   ok:-1,错误，1：未上传图片 2、图片格式不正确 3、上传成功
* }*/
module.exports = function (req,picName,cb) {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.parse(req,function (err,params,file) {
        if(err) cb({ok:-1,msg:"网络连接错误"})
        else{
            const picInfo = file[picName];
            if(picInfo.size<=0){
                fs.unlink(picInfo.path,function (err) {
                    cb({
                        ok:1,
                        msg:"请选择您要上传的图片",
                        params
                    })
                })
            }else{
                // 验证上传文件是否合法
                const index = picInfo.name.lastIndexOf(".");
                const keepName = picInfo.name.substr(index).toLowerCase();
                const keepArr = ['.png',".gif",".jpg"];
                // 扩展名是否在允许范围以内。
                const newPicName = Date.now()+keepName;
                if(keepArr.includes(keepName)){// 上传的格式正确
                    fs.rename(picInfo.path,uploadDir+"/"+newPicName,function (err) {
                        params.newPicName=newPicName;
                        cb({
                            ok:3,
                            msg:"上传成功",
                            params
                        })
                    });
                }else{
                    fs.unlink(picInfo.path,function (err) {
                        cb({
                            ok:2,
                            msg:"请上传符合要求的图片，目前支持'.png','.gif','jpg'"
                        })
                    })
                }
            }
        }
    })
}
// const form=require("formidable");
// const path=require("path");
// const fs=require("fs");
// const uploadDir=path.resolve(__dirname,"../upload");
//
//
// module.exports=function (req,picName,cb) {
//     const form=new formidable.IncomingForm();
//     form.uploadDir=uploadDir;
//     form.keepExtensions=true;
//     form.parse(req,(error,params,file)=>{
//         if(error) cb({ok:1,msg:"网络链接错误"})
//         else{
//             const picInfo=file[picName];
//             if(picInfo.size<=0){
//                 fs.unlink(picInfo.path,(error)=> {
//                     cb({
//                         ok:1,
//                         msg:"请选择您要上传的图片",
//                         params
//                     })
//                 })
//             }else{
//                 const index=picInfo.name.lastIndexOf(".")
//                 const keepName=picInfo.name.substr(index).toLowerCase();
//                 const keepArr=[".png",".jpg",".gif"];
//                 const newPicName=Date.now()+keepName
//                 if(keepArr.includes(keepName)){
//                     params.newpicName=newPicName
//                     cb({
//                         ok:3,
//                         msg:"上传成功",
//                         params
//                     })
//                 }else{
//                     fs.unlink(picInfo.path,(error)=>{
//                         cb({
//                             ok:2,
//                             msg:"请上传符合格式的图片，目前支持'.png','.gif','jpg'"
//                         })
//                     })
//                 }
//             }
//         }
//     })
// }