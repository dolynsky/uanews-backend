const cheerio = require("cheerio");

const html = `<div class="trans-container">
<ul>
   <li><p class="wordGroup">
      jjj
      <div>aaaaa</div>
      <div>bbbbb</div>
      <div>ccccc</div>
      ttt
   </p></li>
   <li><p class="wordGroup">
      ppp
      <div>ddddd</div>
      <div>eeeee</div>
      <div>fffff</div>
      zzz
   </p></li>
</ul>
</div>`;

const $ = cheerio.load(html);
$('li').each((i, el) => console.log("item:", $(el).text()));
// const tags = $(".wordGroup");
// console.log("tags:", tags.length);
// tags.each((i, el) => console.log($(el).contents().length));


function getText(node) {
    return node
        .contents()
        .map(function() {
            return this.type === "text" ? $(this).text() + " " : getText(this);
        })
        .get()
        .join("");
}
