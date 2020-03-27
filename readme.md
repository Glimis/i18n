提供几种常见的国际化-中英切换标准写法和特殊处理方案

# 前言
## 必然刷新与不解决内容
- 动态内容/翻译 
    
    如商品简单的信息进行翻译
- 业务布局 

    特殊语言布局处理,尤其是俄文
- 图片

    图片【带文案】,宣传图【民族敏感信息】
- 颜色

    颜色与语义有关,通常与业务相关  【经典的股市红绿】
- 币种与数字切换

    属于语义切换
- 量词

    {{number}}个苹果

。。。

以上内容都属于国际化/个性化,此处都不解决

## 前端无刷新要求

主要指html文案切换,对于js动态信息,影响不大

1. 内容与后台无关
2. `响应式`  【特指html】

更换语言包很简单,让语言生效,涉及到让组件更新视图【此时文案已经存在页面】

如果不是响应式的,则需要将所有组件手动刷新,以重新引用文案 

如果不提供,依然需要全局刷新



# 通用方案

特指,开始时,就准备国际化

## html
1. 纯静态
    
    提供`[lang].html`  【 markdown走起】

2. 模板 

    可后端,使用模板语法替换   【包括后端/前端模板】

注:
其他方案,都依赖js

## 综合
1. api

- 状态信息 

    后端自定义status或json传递status,代表状态,前端根据状态,进行转换

    此类操作只是单纯的 `码表转换`,码表可以通过cdn进行优化,前端处理更新更快

- 内容

    `Content-Language`

    通常涉及到`数据库`级的码表或业务库或翻译


2. ejs/jsp 等后端模板

    特点:

    - 语法混用

        如js+html写在一起 【不同语法,处理方案不一样】
    -  方案混用

        可纯后端,可纯前端也可半前半后

    方案:

    - html

        就是模板,直接改

    - js

    1. 将翻译直接写入js,会产生html + js混合   
    2. 抽离,单独的js使用函数与占位符,进行调用 【如i18n("xxx")】
    3. 语言包,可以存在js中,进行全局依赖
    4. 可以是直接生成业务信息,将业务信息存在input[hidden]中,js使用id获取dataSource


3. jq组件

    核心方式是`解耦`,所有文案写在语言包/原型中  

    通过修改语言包/原型中,即可达到动态修改的目的

    对于视图已存在的情况 【如日历】

    必须初始化

4. vue

    vue-i18n

# 特殊处理
特指使用了闭包,强耦合【写死】等开始没注意的中文处理方案  【英文...,算了】

- 提供[lang].js

强转,无需解决强耦合,但会产生过多的资源,占网络资源


- 业务代码 + lang

1. 使用正则/ast获取中文

    中文规则用正则,但需要做连字处理,如数字,字母空格 等其他特殊情况

    主要是为了防止语意

2. 转化内占位符

    此处特指js

    html  【改了就成模板了】

    vue/template  【转换为模板格式】

详情见例子