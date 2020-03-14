// const request=require("request");
// const querystring=require("querystring")
// const { getRandom }=require("./help");
//
//
// module.exports=function (phoneId,cb) {
//     const code=getRandom(100000,999999);
//     const mobile=phoneId;
//     const tpl_id="169208";
//     const tpl_value="#code#"+code;//将自己编辑的随六位随机数发给第三方服务器，并保存一份给相应给客户端验证
//     const key="24f00b1b45abce3f2c1acacf64baacd8";
//     var url="http://v.juhe.cn/sms/send?"+querystring.stringify({
//         mobile,
//         tpl_id,
//         tpl_value,
//         key
//     });
//     console.log(url);
//     request(url,(error,response,body)=>{
//         console.log(body);
//             if(!error&&response.statusCode===200){
//                 cb({
//                     ok:1,
//                     code//将验证码返回客户端
//                 })
//             }else{
//                 cb({
//                     ok:-1,
//                     msg:"发送失败"
//                 })
//             }
//     })
// }



// 13870083309
const { getRandom } = require("./help");
const querystring = require("querystring");
const request = require("request");

// 发送验证码
module.exports = function (phoneId,cb) {
    // http://v.juhe.cn/sms/send?mobile=手机号码&tpl_id=短信模板ID&tpl_value=%23code%23%3D654654&key=
    const code = getRandom(100000,999999);
    const mobile = phoneId;
    const tpl_id = "169208";
    const tpl_value = "#code#="+code;
    const key = "24f00b1b45abce3f2c1acacf64baacd8"
    console.log(tpl_value);
    let url = "http://v.juhe.cn/sms/send";
    url += "?"+querystring.stringify({
        mobile,
        tpl_id,
        tpl_value,
        key
    })
    console.log(url);
    request(url,function (err,response,body) {
        console.log(body);
        if(!err && response.statusCode === 200){
            cb({
                ok:1,
                code
            })
        }else{
            cb({
                ok:-1,
                msg:"发送失败"
            })
        }
    })
}
