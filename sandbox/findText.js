const cheerio = require("cheerio");

const html = `<div class="trans-container">
<h1><span>H1 Title</span></h1>
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
const textToSearch = "H1 title";
const found = $(`h1:icontains("${textToSearch}"),h2:icontains("${textToSearch}"),h3:icontains("${textToSearch}")`).text();
console.log(`Found: ${found}`);

//<div id="navigation" class=""><a href="https://www.zagorodna.com">Главная</a> &gt; <a href="https://www.zagorodna.com/ru/novosti">Новости недвижимости</a> &gt; <a href="https://www.zagorodna.com/ru/novosti/bookmarks/novosti_bez_temy">Новости без темы</a> &gt; <p class="selectorgadget_suggested">На Венецианском острове в Киеве появится парк развлечений</p></div>
//https://www.zagorodna.com/ru/novosti/na-venecianskom-ostrove-v-kieve-poiavitsia-park-razvlecheniy.html
//На Венецианском острове в Киеве появится парк развлечений