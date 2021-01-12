// @deno-types="https://cdn.jsdelivr.net/gh/justjavac/deno_cheerio/cheerio.d.ts"
import cheerio from "https://dev.jspm.io/cheerio/index.js";

const $ = cheerio.load('<h2 class="title">Hello world</h2>');

$("h2.title").text("Hello Deno!");
$("h2").addClass("deno");

console.log($.html());

export interface HtmlImage {
  readonly src?: string;
  readonly alt?: string;
  readonly width?: number | string;
  readonly height?: number | string;
  readonly imageElem: cheerio.CheerioElement;
}
