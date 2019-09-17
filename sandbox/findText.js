const cheerio = require("cheerio");

const html = `
<div id="navigation" class="">
   <a href="https://www.zagorodna.com">Главная</a>
   <a href="https://www.zagorodna.com/ru/novosti">Новости недвижимости</a>
   <a href="https://www.zagorodna.com/ru/novosti/bookmarks/novosti_bez_temy">Новости без темы</a>
   <p>На Венецианском острове в Киеве появится парк развлечений</p>
   <a href="https://www.zagorodna.com/ru/novosti/bookmarks/novosti_bez_temy">Новости темы</a>
</div>`;

const $ = cheerio.load(html);
const nodes = $('a:nth-child(4)').text();
console.log(`Found: ${nodes}`);


//https://www.zagorodna.com/ru/novosti/na-venecianskom-ostrove-v-kieve-poiavitsia-park-razvlecheniy.html
//На Венецианском острове в Киеве появится парк развлечений