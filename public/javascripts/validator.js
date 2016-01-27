var rgx = {
    username: /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/,
    nickname: /^.{1,20}$/,
    password: /^[0-9a-zA-Z\-_]{6,12}$/
};
var errorMsg = {
    username:           '6~18位英文字母、数字或下划线，英文字母开头',
    sid:                '学号8位数字，不能以0开头',
    password:           '6~12位数字、大小写字母、中划线、下划线',
    confirm_password:   '密码两次输入不一致',
    phone:              '电话11位数字，不能以0开头',
    email:              '邮箱不合法'
};

function validate(k, v) {
    var result = {};
    result.status = v.match(rgx[k]) !== null;
    result.error = result.status ? '' : errorMsg[k];
    return result;
}

function validateAll(userInfo) {
    var result = { status: true };
    for (var k in rgx) {
        if (userInfo.hasOwnProperty(k)) {
            result[k] = validate(k, userInfo[k]);
            result.status = result.status && result[k].status;
        }
    }
    return result;
}

function validateKeys(userInfo, keys) {
    var result = {
        isValid: true,
        errorMsg: ''
    };
    for (var k = 0; k < keys.length; ++k) {
        if (userInfo.hasOwnProperty(keys[k]) && userInfo[keys[k]].match(rgx[keys[k]]) === null) {
            result.isValid = false;
            result.errorMsg = errorMsg[keys[k]];
        }
    }
    return result;
}

function validateConfirmPassword(p, cp) {
    var result = {};
    result.status = p === cp;
    result.error = result.status ? '' : errorMsg['confirm_password'];
    return result;
}

if (typeof(exports) === 'object') {
    exports.validate = validateKeys;
}
