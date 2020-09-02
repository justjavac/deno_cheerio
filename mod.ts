import cheerio from "https://dev.jspm.io/cheerio/index.js";

const $ = cheerio.load('<h2 class="title">Hello world</h2>');

$("h2.title").text("Hello Deno!");
$("h2").addClass("deno");

console.log($.html());
