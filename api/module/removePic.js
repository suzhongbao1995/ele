const formidable=require("formidable");
const fs=require("fs");
const path=require("path");
const uploadDir = path.resolve(__dirname,"../upload")

module.exports=function (req , picName , callback) {
        const form=new formidable.IncomingForm()
    form.uploadDir = uploadDir
    form.keepExtensions=true;

}