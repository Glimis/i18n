const translateApi = require('google-translate-open-api').default

function translate(name) {
    return Promise.all([
        translateApi(name, {
            tld: "cn",
            to: "ko"
        }),
        translateApi(name, {
            tld: "cn",
            to: "ru"
        })
    ])
        .then((ress) => {
            return ress.map((res) => {
                // 需要验证,是否依然包含 ${},否则回滚,或特殊处理,可能会转换为()此处略
                return res.data[0]
            });
        })
}

exports.translateData = async function translateData(data) {
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let cn = item[1];
        if (cn) {
            try {
                let rs = await translate(cn);
                console.log('翻译', rs)
                await sleep(3000);
                item[2] = rs[0];
                item[3] = rs[1];
            } catch (e) { }
        }
    }
    return data
}

function sleep(second) {
    let time = Date.now();
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve();
        }, second)
    })
}