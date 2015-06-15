# html-layout-tool

一个简单的用于快速推进html构建交付的工具，仅需要一个javascript文件，就能像大多数后端模板引擎一样工作

A easy tool for create html though combine modules quickly, just one javascript file, you can use html like some back-end template engine.

* 模板嵌套渲染      nested module
* for语法           syntax for
* if语法            syntax if
* 变量替换          support variables
* 生成模板引擎格式  build to another template engine

## First

首先该工具基于 jquery 和 seajs 库，你可以在 ```dist/1.0.0/htmlt-1.0.0-all.js``` 里找到它们，你也可以使用其它库进行替换。

你必须将这些 html 页面运行在服务器环境下，可以是 ```nodejs```、```apache```、```nginx`等……

TODO:后面会在grunt里集成一个webserver以方便使用

如果你想要使用 生成模板 功能，你还必须得安排 ```node``` 和 ```gruntjs```。

You will install jquery and seajs first, but I build them to ```dist/1.0.0/htmlt-1.0.0-all```, you can use it directly or replace it.

And you must run the html in web-server, such ```nodejs```, ```apache```, ```nginx`...

TODO:Add a web-server in gruntjs later.

If you want to build, you have to install ```node``` and ```gruntjs```.

## Getting start

一个标准的页面应该是这样的：

The standard html look like this:

```
<!DOCTYPE html>
<html>
    <head></head>
    <body></body>
    <script src="dist/1.0.0/htmlt.js"></script>
</html>
```

你只需确认是否加载了 ```htmlt.js``` 文件。

Make sure you load the ```htmlt.js```.

## Documentation

你能在 ```demo/page/api.html``` 查看相应的功能示例

You can find the api in ```demo/page/api.html``` to learn about.

## Demo

```demo/page/index.html```

```demo/page/home.html```

```demo/page/list.html```

```demo/page/api.html```

## Lisence

The MIT License (MIT)

Copyright (c) 2015 darkty2009@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.