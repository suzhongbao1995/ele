const express = require("express");
const upPic = require("./module/upPic");
const db = require("./module/db");
const fs = require("fs");
const path = require("path");
const help = require("./module/help");
const bodyParser = require("body-parser");
const jwt = require("./module/jwt");
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/upload"));


app.post("/login", (req, res) => {
    const {adminName, adminPassword} = req.body;
    db.findOne("adminList", {
        adminName,
        adminPassword: help.md5(adminPassword)
    }, (error, adminInfo) => {
        if (adminInfo) {
            //登陆成功
            db.insertOne("adminLog", {
                loginTime: Date.now(),
                adminName
            }, (error) => {
                res.json({
                    ok: 1,
                    adminName,
                    msg: "登陆成功",
                    token: jwt.encode(adminName),
                })
            });
        } else {
            help.json(res);
        }
    })
});
//全局检测
app.all("*", (req, res, next) => {
    const token = req.headers.authorization;
    const result = jwt.decode(token);

    if (result.ok < 0) {
        res.json({
            ok: -2,
            msg: result.msg
        })
    } else {
        next()
    }
});
app.get("/token", (req, res) => {
    res.json({
        ok: 1,
        msg: "验证成功"
    })
});


//************ admin **********************
app.post('/addAdminer', (req, res) => {
    upPic(req, 'adminTitPic', obj => {
        res.json({
            ok: 1,
            msg: "success"
        })
    })
});
app.get("/adminLog", (req, res) => {
    let adminName = req.query.adminName;
    let whereObj = {};
    if (adminName) {
        whereObj = {
            adminName: new RegExp(adminName)
        }
    }
    db.count("adminLog", whereObj, function (count) {
        let pageIndex = req.query.pageIndex / 1;
        let pageNum = 4;
        let pageSum = Math.ceil(count / pageNum);
        if (pageIndex < 1) pageIndex = 1;
        if (pageSum < 1) pageSum = 1;
        if (pageIndex > pageSum) pageIndex = pageSum;

        db.find("adminLog", {
            limit: pageNum,
            sortObj: {
                loginTime: -1
            },
            skip: (pageIndex - 1) * pageNum,
            whereObj
        }, (error, loginInfo) => {
            setTimeout(() => {
                res.json({
                    ok: 1,
                    loginInfo,
                    pageSum,
                    pageIndex
                })
            }, 500)

        })
    })
});
app.delete('/adminLog', (req, res) => {
    const {adminId, pageIndex} = req.query;
    db.findOneById("adminLog", adminId, (error, adminInfo) => {
        if (adminInfo) {
            db.deleteOneById("adminLog", adminId, (error, result) => {
                res.json({
                    ok: 1,
                    msg: "删除成功",
                    pageIndex: pageIndex / 1
                })
            })
        } else {
            help.json(res);
        }

    });
});
app.put('/upPwd', (req, res) => {
    const {adminPwd, token, adminNewPass} = req.body;
    const {info, ok, msg} = jwt.decode(token);
    if (ok === 1) {
        db.findOne("adminList", {adminName: info.adminName}, (error, adminInfo) => {
            if (help.md5(adminPwd) === adminInfo.adminPassword) {
                db.updateOne("adminList", {adminName: info.adminName}, {
                    $set: {
                        adminPassword: help.md5(adminNewPass)
                    }
                }, (error, result) => {
                    res.json({
                        ok: 1,
                        msg: '修改成功'
                    })
                })
            } else {
                res.json({
                    ok: -1,
                    msg: "你输入的旧密码有误，请重新输入！！！"
                })
            }
        })
    } else {
        help.json(res, msg)
    }
});
//*********** shopType *********************
app.post('/addShopType', (req, res) => {
    upPic(req, "shopTypePic", obj => {
        if (obj.ok === 3) {
            db.insertOne("shopTypeList", {
                shopTypeName: obj.params.shopTypeName,
                addTime: Date.now(),
                shopTypePic: obj.params.newPicName
            }, (error, result) => {
                help.json(res, 1, '成功')
            })
        }
    })
});
app.get('/shopTypeList', (req, res) => {
    let shopTypeName = req.query.shopTypeName;
    let whereObj = {};
    if (shopTypeName) {
        whereObj = {
            shopTypeName: new RegExp(shopTypeName)
        }
    }
    db.count("shopTypeList", whereObj, function (count) {

        let pageIndex = req.query.pageIndex / 1;
        let pageNum = 4;
        let pageSum = Math.ceil(count / pageNum);
        if (pageIndex < 1) pageIndex = 1;
        if (pageSum < 1) pageSum = 1;
        if (pageIndex > pageSum) pageIndex = pageSum;
        db.find("shopTypeList", {
            limit: pageNum,
            sortObj: {
                addTime: -1
            },
            skip: (pageIndex - 1) * pageNum,
            whereObj
        }, (error, shopTypeInfo) => {
            res.json({
                ok: 1,
                shopTypeInfo,
                pageSum,
                pageIndex
            })
        })
    })
});
app.delete('/shopTypeList', (req, res) => {
    const {shopId, pageIndex, shopTypePic} = req.query;
    const pathLoad = path.resolve(__dirname, "./upload");
    db.findOneById("shopTypeList", shopId, (error, adminInfo) => {
        if (adminInfo) {
            db.deleteOneById("shopTypeList", shopId, (error, result) => {
                fs.unlink(pathLoad + "/" + shopTypePic, function (error) {
                    if (error) {
                        res.json({
                            ok: -1,
                            msg: error
                        })
                    } else {
                        res.json({
                            ok: 1,
                            msg: "删除成功",
                            pageIndex: pageIndex / 1
                        })
                    }
                })
            })
        } else {
            help.json(res);
        }
    });
});

//*********** shop **************************
app.get("/allShopTypeList", (req, res) => {
    db.find("shopTypeList", {
        sortObj: {
            addTime: -1
        }
    }, (error, shopTypeList) => {
        res.json({
            ok: 1,
            msg: "获取成功",
            shopTypeList
        })
    })
});
app.post("/addShop", (req, res) => {
    upPic(req, "shopPic", (obj) => {
        db.findOneById("shopTypeList", obj.params.shopTypeId, (error, shopInfo) => {
            console.log(shopInfo)
            db.insertOne("shopList", {
                addTime: Date.now(),
                shopTypeId: obj.params.shopTypeId,
                shopName: obj.params.shopName,
                shopPic: obj.params.newPicName,
                shopTypeName: shopInfo.shopTypeName
            }, (error, result) => {
                if (!error) {
                    res.json({
                        ok: 1,
                        msg: "添加成功",
                        result
                    })
                } else {
                    help.json(res)
                }
            })
            // res.json(obj);
        })
    })

});
app.get('/getShopList', (req, res) => {
    let shopName = req.query.shopName;
    let whereObj = {};
    if (shopName) {
        whereObj = {
            shopName: new RegExp(shopName)
        }
    }
    db.count("shopList", whereObj, function (count) {
        let pageIndex = req.query.pageIndex / 1;
        let pageNum = 3;
        let pageSum = Math.ceil(count / pageNum);
        if (pageIndex < 1) pageIndex = 1;
        if (pageSum < 1) pageSum = 1;
        if (pageIndex > pageSum) pageIndex = pageSum;
        db.find("shopList", {
            limit: pageNum,
            sortObj: {
                addTime: -1
            },
            skip: (pageIndex - 1) * pageNum,
            whereObj
        }, (error, shopList) => {
            res.json({
                ok: 1,
                shopList,
                pageSum,
                pageIndex
            })
        })
    })
});
app.get('/getShopListById/:shopTypeId', (req, res) => {
    db.find("shopList", {
        sortObj: {
            addTime: -1
        },
        whereObj: {
            shopTypeId: req.params.shopTypeId
        }
    }, (error, shopListById) => {
        res.json({
            ok: 1,
            shopListById
        })
    })
});
app.get('/allShopList',(req,res)=>{
    db.find("shopList",{
        sortObj:{
            addTime:-1
        }
    },(error,shopList)=>{
        res.json({
            ok:1,
            shopList
        })
    })
});
//*********** good **************************
app.post('/addGoodsTypeList', (req, res) => {
    const {shopId, goodTypeName, shopTypeId, } = req.body;
    db.findOneById("shopList",shopId,function (error,shopInfo) {
        db.insertOne("goodTypeList", {
            shopId,
            goodTypeName,
            shopTypeId,
            shopName:shopInfo.shopName,
            addTime: Date.now()
        }, (error, result) => {
            res.json({
                ok: 1,
                msg: "添加商品类别成功"
            })
        })
    })

});
app.get('/getGoodTypeList', (req, res) => {
    let goodTypeName=req.query.goodTypeName;
    let whereObj={}
    if(goodTypeName){
        whereObj={
            goodTypeName:new RegExp(goodTypeName)
        }
    }
    db.count("goodTypeList",whereObj,count=>{
        let pageIndex = req.query.pageIndex / 1;
        let pageNum = 4;
        let pageSum = Math.ceil(count / pageNum);
        if (pageIndex < 1) pageIndex = 1;
        if (pageSum < 1) pageSum = 1;
        if (pageIndex > pageSum) pageIndex = pageSum;
        db.find("goodTypeList", {
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            sortObj: {
                addTime: -1
            },
            whereObj
        }, (req, goodsTypeList) => {
            res.json({
                ok: 1,
                goodsTypeList,
                pageIndex,
                pageSum
            })
        })
    })

});
app.get('/getGoodList', (req, res) => {
    let goodName=req.query.goodName;
    let whereObj={}
    if(goodName){
        whereObj={
            goodTypeName:new RegExp(goodName)
        }
    }
    db.count("goodList",whereObj,count=>{
        let pageIndex = req.query.pageIndex / 1;
        let pageNum = 4;
        let pageSum = Math.ceil(count / pageNum);
        if (pageIndex < 1) pageIndex = 1;
        if (pageSum < 1) pageSum = 1;
        if (pageIndex > pageSum) pageIndex = pageSum;
        db.find("goodList", {
            limit:pageNum,
            skip:(pageIndex-1)*pageNum,
            sortObj: {
                addTime: -1
            },
            whereObj
        }, (req, goodsList) => {
            res.json({
                ok: 1,
                goodsList,
                pageIndex,
                pageSum
            })
        })
    })
});
app.get('/getGoodListById/:shopId', (req, res) => {
    console.log(req.params)
    db.find("goodTypeList", {
        sortObj: {
            addTime: -1
        },
        whereObj: {
            shopId:req.params.shopId
        }
    }, (error, goodsListById) => {
        res.json({
            ok: 1,
            goodsListById
        })
    })
});
app.post('/addGoods', (req, res) => {
    upPic(req, "goodPic", obj => {
        db.findOneById("goodTypeList", obj.params.goodTypeId , function (error, goodTypeInfo) {
            db.insertOne("goodList", {
                addTime: Date.now(),
                goodName: obj.params.goodName,
                goodTypeId: obj.params.goodTypeId,
                goodTypeName: goodTypeInfo.goodTypeName,
                goodPic: obj.params.newPicName,
                goodPrice: obj.params.goodPrice / 1,
                goodNum:obj.params.goodNum/1,
                isDaZhe: JSON.parse(obj.params.isDaZhe),
            }, (error, result) => {
                res.json({
                    ok: 1,
                    msg: "添加商品成功"
                })
            })
        })
    })
});


app.listen(8888, "127.0.0.1", () => {
    console.log("login has success")
});