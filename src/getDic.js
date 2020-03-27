const { parse } = require('@babel/parser')
const traverse = require("@babel/traverse").default
const generate = require('@babel/generator').default
/**
 * 获取js中的中文
 * 
 * 使用transformFileSync通过js获取也可
 * 获取使用webpack-plugin也可   【直接扫描项目所有信息】
 * 
 * 使用正则也可,但需要处理注释
 * 
 * 此处在外层使用fs获取jsCode,内部获取字典信息或中文相关节点信息 【用于标记】
 * 
 */
let $dic = {}
// let $config = {}
let $i = 0
let $options
exports.getDic = function getDic(jsCode, options = {
    sourceType: "module",
    plugins: [
        // 其他babel系组件,此处使用typescript占坑,其实打满即可 -。-
        "typescript"
    ]
}) {
    $i = 0
    // $config = config
    // 字典
    $dic = {}
    $options = options
    // 1.获取ast
    let ast = parse(jsCode, options)
    // 获取所有中文,需要测试Type, babel中不到300个类型,在大型项目中扫一次就行了
    // 可以配合正则,测试类型是否全部到位
    debugger
    traverse(ast, {
        VariableDeclarator(path) {
            // let a = '中文'
            path.node.init && recordDic(path, path.node, path.node.init, 'init')
            // let a = '中' + name + '文'
            path.node.init && path.node.init.operator && path.node.init.operator == '+' && recordDicExp(path, path.node);
        },
        // let b = { c : '中文'} ,let d = [{e: '中xx文'}]
        ObjectProperty(path) {
            recordDic(path, path.node, path.node.value, 'value')
        },
        // let d = ['中x文']
        ArrayExpression(path) {
            path.node.elements.forEach((item, i) => {
                recordDic(path, path.node.elements, item, i)
            })
        },
        // function a(name = '测试')
        AssignmentPattern(path) {
            recordDic(path, path.node, path.node.right, 'right')
        },
        // test("测试")
        CallExpression(path) {
            path.node.arguments.forEach((item, i) => {
                recordDic(path, path.node.arguments, item, i)
            });
        },
        // case "中文"
        // 这个只能手动记录
        // SwitchCase(path) {
        //     recordCase(path, path.node, path.node.test)
        // }
    })
    return {
        ast,
        dic: $dic
    }
}
/**
 * UTF - 8(Unicode)
 *  - u4e00 - u9fa5(中文)
 *  - x3130 - x318F(韩文)
 *  - xAC00 - xD7A3(韩文)
 *  - u0800 - u4e00(日文)
 * 
 * utf-8会根据gbk等其他字符集进行拓展 
 * 到目前为止 0x3400 - 0x4DB5 也属于中文  【CJK－Ext A 区】
 * 不过上诉中文过于生僻,此处略
 */
// 此处要求必须中文开头,可以包含数字,字母,符号,以及中文,以提取具体文案   --- 或正则使用
// const zhReg = /[\u4e00-\u9fa5]+[\u4e00-\u9fa5_a-zA-Z0-9_。？！、，]*/g;
// 此处使用ast 只要文案中包含中文,就可以记录
const zhReg = /[\u4e00-\u9fa5]/
// 写入字典
function recordDic(path, parent, node, nodeInParentName) {
    if (!node) {
        return
    }
    const value = node.value
    if (zhReg.test(value)) {
        // 将节点信息,注入到字典/数组中
        // 此处只用$i 简单的处理站位符
        // 可以增加配置信息,此处强制更新 - -
        // if ($config.replace) {
        $dic[$i] = {
            zh: value
        }
        // 可以使用 t.callExpression(callee, arguments)
        let ast = parse(`i18n('${$i}')`, $options)

        // 根据父类类型,进行处理,此处省写
        parent[nodeInParentName] = ast.program.body[0].expression

        // node.value = `i18n('${$i}')`
        // 使用
        generate()
        $i++
        // } else {
        //     $dic[value] = {
        //         zh: value
        //     }
        // }
    }
}

/**
 * 处理表达式
 * let a = '中' + name + '文'  -> _.template(`中${name}文`,{name})
 *                                `中${name}文` 也是可以的
 */
function recordDicExp(path, node) {
    // 使用正则处理 --》 仅用于处理展示中的情况
    let code = generate(node).code
    // 将code 转换为模板
    let params = []
    // 1.第一次替换,合并参数
    code = code
        // 前置正则 略
        .replace(/(.[^=]*=)(.*)$/, (it, left, right) => {
            let value = right
                .replace(/'\s*\+\s*([^+]*)+\s*(\+\s*\')?/g, function (item, name) {
                    params.push(name)
                    return '${name}'
                })
            $dic[$i] = {
                zh: value
            }
            value = `i18n('${$i}')`
            $i++
            return left + `_.template(${value})({${params.join()}})`
        })

    // 2.转换为ast
    let ast = parse(code, $options)
    path.parent.declarations = ast.program.body
}