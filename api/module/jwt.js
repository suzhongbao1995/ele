const jwt = require("jwt-simple");

const key = "!@#$%&^%^%$@$%&#$%&";

module.exports = {
    //生成token
    encode(adminName, exp = 1000 * 60 * 1000) {
        return jwt.encode({
            adminName,
            exp: Date.now() + exp
        }, key)
    },
    //解析token
    decode(token) {

        try {
            const info = jwt.decode(token, key);

            if (info.exp > Date.now ()) {
                return {
                    ok: 1,
                    msg: "成功",
                    info
                }
            } else {
                return {
                    ok: -1,
                    msg: "token已经过期！！！"
                }
            }
        } catch (error) {
            return {
                ok: -1,
                msg: "解析失败"
            }
        }
    }
};