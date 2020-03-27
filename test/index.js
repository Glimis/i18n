const { getDic } = require('../src/getDic')
const fs = require('fs')
const generate = require('@babel/generator').default
const xlsx = require('node-xlsx')
const { translateData } = require('../src/translate')
/**
 *  一个通用的翻译流程
 * 
 */
void async function () {
    const { ast, dic } = getDic(fs.readFileSync('../tpl/test.js', 'utf-8'))
    // 1.写入字典  -- 运行时使用  字典又分业务集合
    fs.writeFileSync('../tpl/test.i18n.json', JSON.stringify(dic, 2, 4), 'utf-8')

    // 2.写入excel  -- 翻译用   翻译通常统一,为了返写,需要记录字典的地址
    let data = [['../tpl/test.i18n.json']]
    for (let key in dic) {
        let item = [key, dic[key].zh]
        data.push(item)
    }
    const res = xlsx.build([{
        name: 'Sheet1',
        data
    }])
    fs.writeFileSync('../tpl/i18n.xlsx', res, 'utf-8')

    // 3.替换模板
    const output = generate(ast)
    fs.writeFileSync('../tpl/test.tpl.js', output.code, 'utf-8')

    // 4.excel 上传/下载   -- 通常会将excel放入系统系统,依赖密码检测

    // 5.也可能会有中间层,如翻译人员按照自己的格式  会有 translate2excel
    // 如果要求在快速翻译,直接谷歌翻译  【谷歌翻译,通过git获取最新的读取token的方式】
    // 如果翻译需要语义,页面 需要提供url地址

    // 6.excel替换  -- 反写
    const excelSheet = xlsx.parse(fs.readFileSync('../tpl/i18n.xlsx'))
    excelData = excelSheet[0].data

    // 加一个翻译
    let dataContent = excelData.slice(1)
    await translateData(dataContent)

    excelData = [excelData[0], ...dataContent]

    let pathName
    let dicData
    for (let i = 0; i < excelData.length; i++) {
        // 假设此处为地址
        if (!excelData[i][1]) {
            // 储存上次数据
            pathName && fs.writeFileSync(pathName, JSON.stringify(dicData, 2, 4))
            pathName = excelData[i][0]
            dicData = {}
        } else {
            // 根据格式转换
            dicData[excelData[i][0]] = {
                zh: excelData[i][1],
                ko: excelData[i][2] || excelData[i][1],
                ru: excelData[i][3] || excelData[i][1]
            }
        }
    }

    fs.writeFileSync(pathName, JSON.stringify(dicData, 2, 4))
}()