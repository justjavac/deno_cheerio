# deno_cheerio

[![Build Status](https://github.com/justjavac/deno_cheerio/workflows/ci/badge.svg?branch=master)](https://github.com/justjavac/deno_cheerio/actions)

> 记录一次在 Deno 中使用 cheerio 库的过程。

如何在 Deno 中使用 [cheerio](https://github.com/cheeriojs/cheerio)。

cheerio 是一个非常流行的 npm 包，为服务器特别定制的，快速、灵活、实施的 jQuery 核心实现。可以说 cheerio 就是一个 Node.js
版的 jQuery。

那么我们在 Deno 中如何使用这个库呢？

## 使用

如果直接在 Deno 中使用源码，像这样：

```ts
import * as Cheerio from "https://raw.githubusercontent.com/cheeriojs/cheerio/v1.0.0/lib/cheerio.js";
```

会报错：

```plain
error: Uncaught ReferenceError: require is not defined
var parse = require('./parse'),
            ^
    at https://raw.githubusercontent.com/cheeriojs/cheerio/v1.0.0/lib/cheerio.js:6:13
```

因为 Deno 并不支持 commonjs 规范，只支持 esm。

因此我们必需借助 jspm.io（或其他类似服务）来将 commonjs 转换为兼容的 esm 格式。

我们可以这样：

```ts
import cheerio from "https://dev.jspm.io/npm:cheerio/index.js";

const $ = cheerio.load('<h2 class="title">Hello world</h2>');

$("h2.title").text("Hello Deno!");
$("h2").addClass("deno");

console.log($.html());
```

我们试着运行一下：

```shell
deno run mod.ts
```

成功输出了 `<h2 class="title deno">Hello Deno!</h2>`。

## 添加 TypeScript 支持

好在 @types 仓库提供了 cheerio 的类型定义文件，我们在 mod.ts 顶部增加一行：

```diff
+// @deno-types="https://dev.jspm.io/@types/cheerio/index.d.ts"
 import cheerio from "https://dev.jspm.io/cheerio/index.js";
```

运行一下，又报错了

```plain
error: relative import path "node" not prefixed with / or ./ or ../ Imported 
from "https://dev.jspm.io/npm:@types/cheerio@0.22.21/index.d.ts"
```

看来这个 d.ts 文件和 deno 不兼容，把这个文件下载到本地，新建 cheerio.d.ts 改造一下。

问题出在第 14 行，`/// <reference types="node" />` 与 Deno 不兼容，于是删掉这一行：

```diff
-/// <reference types="node" />
-
```

再次运行，又报错：

```plain
error: TS2580 [ERROR]: Cannot find name 'Buffer'. Do you need to install type definitions for node? Try `npm i @types/node`.
  load(html: string | Buffer, options?: CheerioOptionsInterface): CheerioStatic;
                      ~~~~~~
    at https://cdn.jsdelivr.net/gh/justjavac/deno_cheerio/cheerio.d.ts:310:23
```

`Buffer` 是 nodejs 的类型，所以报错了。

其实 Deno 也有 `Buffer`，我们需要使用 `Deno.Buffer` 来引用，考虑到 Deno 的 `Buffer` 和 Node.js
的并不兼容，于是直接删掉这个类型。

(补充 2021-04-19，Deno 1.9 已经放弃了 `Deno.Buffer`，在 2.0 会将其移除)

```diff
-  load(html: string | Buffer, options?: CheerioOptionsInterface): CheerioStatic;
+  load(html: string, options?: CheerioOptionsInterface): CheerioStatic;
```

再次运行，终于得到了我们想要的结果：

```plain
<h2 class="title deno">Hello Deno!</h2>
```

## 例子

```bash
deno run https://cdn.jsdelivr.net/gh/justjavac/deno_cheerio/mod.ts
```

## License

[deno_cheerio](https://github.com/justjavac/deno_cheerio) is released under the
MIT License. See the bundled [LICENSE](./LICENSE) file for details.
