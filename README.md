# sourceMap

对于 Source Map，想必大家并不陌生，在前端开发中通常要压缩 JavaScript，CSS，以减小体积，加快网页显示。但带来的后果是如果出现错误，就会导致无法定位错误，这时 Source Map 应运而生。举个例子， jQuery 1.9 引入了 Source Map，打开 <http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js>，最后一行是这样的：

```js
//@ sourceMappingURL=jquery.min.map
```

## uglify-es

uglify-js 是最常用的 JavaScript 代码压缩工具，但只支持到 ES5，uglify-es 支持 ES6+ 并且兼容 uglify-js，所以本节使用 uglify-es。

source-map-support 是一个在 Node.js 环境下支持 Source Map 的模块。

--原文引自<https://github.com/nswbmw/node-in-debugging/blob/master/4.1%20Source%20Map.md>

原生项目个人比较喜欢用gulp,这里我修改为使用gulp的操作:

```
 $ npm i gulp-uglify-es -D
 $ npm i gulp-sourcemaps -S
```

生成 app.js 和 app.js.map 文件,并运行app.js

```
\sourceMap\dist\js\app.js:4
  throw new Error('error!!!')
        ^
Error: error!!!
    at sayHello(c:\Surpass-Strong\sourceMap\dist\js\app.js:4:9)
```

如果删掉最后那行sourceMap注释,则无法显示正确的错误栈

```
\sourceMap\dist\js\app.js:1
function sayHello(r){throw new Error("error!!!")}require("source-map-support").install(),sayHello("World");
                           ^
Error: error!!!
    at sayHello (c:\Surpass-Strong\sourceMap\dist\js\app.js:1:28)
```

### gulp

整理了下之前gulpfile的旧写法,当然也可写入（我前面有提及过）在package.json内配置执行js.
