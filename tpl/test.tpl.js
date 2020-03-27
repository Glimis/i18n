let a1 = i18n('0');
let a2 = {
  b: i18n('1'),
  c: {
    d: {
      e: {
        f: i18n('2')
      }
    }
  }
};
let a3 = [i18n('3'), {
  b: i18n('4')
}];

function test(name = i18n('5')) {
  let a1 = _.template(i18n('6'))({
    name
  });; // 略
  // if (name == '中==文') {
  //     return;
  // }
  // 语义上必须为静态字符,需要转换为en.js
  // switch (name) {
  //     case '中case文':
  // }
}

test(i18n('7'));