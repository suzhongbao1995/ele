module.exports.md5 = function (v) {
    const md5 = require("md5");
    let str = "#%$#%*^(*&((&*";
    return md5(v + str);
};

module.exports.json = function (res, ok = -1, msg = "网络链接错误") {
    res.json({
        ok,
        msg
    })
};

module.exports.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
module.exports.getNewTime = function () {
    var time = new Date();
    return time.getFullYear() +
        "-" + (time.getMonth() + 1).toString().padStart(2, "0") +
        "-" + time.getDate().toString().padStart(2, "0") +
        " " + time.getHours().toString().padStart(2, "0") +
        ":" + time.getMinutes().toString().padStart(2, "0") +
        ":" + time.getSeconds().toString().padStart(2, "0")
};
module.exports.throttle=function (callback,wait,type=1) {
    if(type===1){
        var  previous=0;
    }else if(type===2){
        var  timeout;
    }
    return function () {
        let me=this;
        let args=arguments;
        if(type===1){
            let now=Date.now();
            if(now-previous>wait){
                callback.apply(me,args);
                previous=now;
            }
        }else if(type===2){
            if(!timeout){
                timeout=setTimeout(()=>{
                    timeout=null;
                    callback(me,args);
                },wait)
            }
        }
    }
};


