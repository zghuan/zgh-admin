import CryptoJS from 'Crypto-js';
import bcrypt from 'bcryptjs';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import md5 from 'js-md5';
import {
    ServerRequest
} from 'http';
var Base64 = require('js-base64').Base64;

let util = {}

util.arrayInsert = function (a, b, c) {
    var len = parseInt(b.length / a);
    for (var i = 0; i < len; i++) {
        b.splice(a * (i + 1) + i, 0, c);
    }
    return b
}


//AES  
var random = (Math.random() * 10).toString()
util.encryption = function () {
    var key = CryptoJS.enc.Utf8.parse('TE53DAH32R9VMHEP');
    var initVector = CryptoJS.enc.Utf8.parse('ZEM82JFYEJDHMKG0');
    var ciphertext = null
    ciphertext = CryptoJS.AES.encrypt(random, key, {
        iv: initVector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
    return ciphertext
}
//BCRYPTY
util.bcryptSecret = function (data) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(random, salt);
    return hash
}





util.dataDecodeSecret = function (data) {
    var encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var result = CryptoJS.AES.decrypt(encryptedBase64Str, CryptoJS.enc.Utf8.parse("ZEM82JFYEJDHMKG0"), {
        iv: CryptoJS.enc.Utf8.parse("ZEM82JFYEJDHMKG0"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var txt = (CryptoJS.enc.Utf8.stringify(result).toString());
    return txt
}

util.md5Base64Sign = function (param) {
    var obj = {}
    obj.param = Base64.encode(JSON.stringify(param));
    obj.sign = md5(param + $fn.sign)
    return obj
}

util.exportExcel = function (dom, name) {
    var date = new Date().getTime()
    var wb = XLSX.utils.table_to_book(dom);
    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
    });
    try {
        FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
        }), name + date + '.xlsx')
    } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
    }
    return wbout
}
util.sort = function (array) {
    return array = array.sort(function (x, y) {
        var i = x.value - y.value
        if (i == 0) {
            i = x.minTran - y.minTran
        }
        return i;
    })
}
util.arrayRepet = function (arr) {
    return Array.from(new Set(arr))
}
util.fillerTime = function (time) {
    if (typeof time === 'string') {
        time = number(time)
    }
    var date = new Date(time)
    var time1 = date.toLocaleString('chinese', {
        hour12: false
    })

    var a = time1.split(' ')[0].toString().replace(/_/g, '-')
    var b = time1.split(' ')[1].toString().replace(/_/g, ':')

    return a + ' ' + b
}
util.setStorage = function (type, key, value) {
    if (type == 'session' || null) {
        return window.sessionStorage.setItem(key, JSON.stringify(value))
    } else {
        return window.localStorage.setItem(key, JSON.stringify(value))
    }

}
util.getStorage = function (type, key) {
    if (type == 'session' || null) {
        return JSON.parse(window.sessionStorage.getItem(key) || [])
    } else {
        return JSON.parse(window.localStorage.getItem(key) || [])
    }
}
util.cutstr = function(string,length){
    return false
}
export default util;