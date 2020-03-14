
const mongodb=require("mongodb");
const mongoClient=mongodb.MongoClient;
/* 链接数据库 */
function _connect(callback) {
    mongoClient.connect("mongodb://127.0.0.1/27017" ,{ useNewUrlParser: true } ,(error,client)=>{
        if(error) console.log("数据据库连接失败")
        else{
            const db=client.db("ele1908");
            callback(db);
        }
    })
};
module.exports.insertOne=function (coll,insObj,cb) {
    _connect(db=>{
        db.collection(coll).insertOne(insObj,(error,results)=>{
            cb(error,results)
        })
    })
};
/*  查找 */
module.exports.findOne=function(coll,whereObj,cb){
        _connect(function (db) {
            db.collection(coll).findOne(whereObj,(error,results)=>{
                cb(error,results)
            })
        })
};
module.exports.findOneById=function(coll,id,cb){
    _connect(db=>{
        db.collection(coll).findOne({
            _id:mongodb.ObjectId(id)
        },cb)
    })
};
module.exports.find=function (coll,obj,cb) {
    obj.whereObj=obj.whereObj||{};
    obj.sortObj=obj.sortObj||{};
        obj.limit=obj.limit||0;
        obj.skip=obj.skip||0;
    _connect(db=>{
        db.collection(coll).find(obj.whereObj).sort(obj.sortObj).limit(obj.limit).skip(obj.skip).toArray((error,results)=>{
            cb(error,results);
        })
    })
};
module.exports.count=function (coll,whereObj,cb) {
    _connect(db=>{
        db.collection(coll).countDocuments(whereObj).then((count)=>{
            cb(count);
        })
    })
};
/* 删除 */
module.exports.deleteOneById=function (coll,id,cb) {
    _connect(db=>{
        db.collection(coll).deleteOne({
            _id:mongodb.ObjectId(id)
        },cb)
    })
};
module.exports.deleteOne=function(coll,whereObj,cb){
    _connect(db=>{
        db.collection(coll).deleteOne(whereObj,cb)
    })
};

/* 修改 */
module.exports.updateOneById=function (coll,id,upObj,cb) {
    _connect(db=>{
        db.collection(coll).updateOne({
            _id:mongodb.ObjectId(id)
        },upObj,cb)
    })
};
module.exports.updateOne=function(coll,whereObj,upObj,cb){
        _connect(db=>{
            db.collection(coll).updateOne(whereObj,upObj,cb)
        })
};
module.exports.updateManyById=function(coll,whereObj,upObj,cb){
    // 第一个是条件，第二个参数是你要修改的内容
    _connect(db=>{
        db.collection(coll).updateMany(whereObj,upObj,cb);
    })
}
module.exports._connect=_connect;
