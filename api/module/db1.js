const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;// 属性，可以通过该属性的connect方法连接你的数据库
function _connect(cb) {
    mongoClient.connect("mongodb://127.0.0.1:27017",{ useNewUrlParser: true },function (err,client) {
        if(err) console.log("连接失败");
        else{
            const db = client.db("1908");
            cb(db);
        }
    })
}
/*插入一条记录。
* 给指定的集合插入指定的记录
* coll:操作的集合名
* insObj:插入的文档
* cb;插入成功的返回值*/
module.exports.insertOne = function (coll,insObj,cb) {
    _connect(function (db) {
        db.collection(coll).insertOne(insObj,function (err,results) {
            // 将插入的结果返回出去
            cb(err,results);
        })
    })
}
/*
* 查找多条
* coll:查找的集合名字
* obj:
*   whereObj:查找的条件
*   sortObj:排序
*   limit:查找前多少条
*   skip:跳过多少条*/
module.exports.find = function (coll,obj,cb) {
    obj.whereObj = obj.whereObj || {};
    obj.sortObj = obj.sortObj || {};
    obj.limit = obj.limit || 0;
    obj.skip = obj.skip || 0;
    _connect(function (db) {
        db.collection(coll)
            .find(obj.whereObj)
            .sort(obj.sortObj)
            .limit(obj.limit)
            .skip(obj.skip)
            .toArray(function (err,results) {
                cb(err,results);
            })
    })
}

/*根据ID查找文档*/
module.exports.findOneById = function (coll,id,cb) {
    _connect(function (db) {
        db.collection(coll).findOne({
            _id:mongodb.ObjectId(id)
        },cb)
    })
}
/*
* 根据条件获得指定集合的总文档数量
* coll:集合名
* whereObj:条件
* cb;回调*/
module.exports.count = function (coll,whereObj,cb) {
    _connect(function (db) {
        db.collection(coll).countDocuments(whereObj).then(function (count) {
            cb(count);
        })
    })
}
/*根据ID删除指定的集合文档
** coll:集合名
* id:删除的文档ID
* cb:回调*/
module.exports.deleteOneById = function (coll,id,cb) {
    _connect(function (db) {
        db.collection(coll).deleteOne({
            _id:mongodb.ObjectId(id)// 将字符串转换为mongodb ObjectId类型
        },cb)
    })
}
/*
* 根据ID进行修改*/
module.exports.updateOneById = function (coll,id,upObj,cb) {
    _connect(function (db) {
        // 第一个是条件，第二个参数是你要修改的内容
        db.collection(coll).updateOne({
            _id:mongodb.ObjectId(id)
        },upObj,cb)
    })
}



module.exports._connect = _connect;