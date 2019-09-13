const cheerio = require("cheerio");

const html = `<div class="trans-container">
<h1>H1 title</h1>
<ul>
   <li><p class="wordGroup">
      jj&nbspj
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
<h2>H2 title</h2>
</div>`;

const $ = cheerio.load(html);
//$('li').each((i, el) => console.log("item:", $(el).text()));
const textToSearch = "H2 title";
const found = $(`h1:contains("${textToSearch}"),h2:contains("${textToSearch}"),h3:contains("${textToSearch}")`).text();
console.log(`Found: ${found}`);
