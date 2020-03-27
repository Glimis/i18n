let a1 = '中let文'

let a2 = {
    b: '中obj文',
    c: {
        d: {
            e: {
                f: '中obj_obj文'
            }
        }
    }
}

let a3 = ['中arr文', {
    b: '中arr_obj文'
}]

function test(name = '中=文') {
    let a1 = '中' + name + '文'
    // 略
    // if (name == '中==文') {
    //     return;
    // }
    // 语义上必须为静态字符,需要转换为en.js
    // switch (name) {
    //     case '中case文':
    // }
}

test('中fn文')