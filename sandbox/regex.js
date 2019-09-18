const s = "12:11 19.09.2019 blablabla";
const match = s.replace(/(\d+):(\d+).(\d+)\.(\d)+\.(\d+).+/, "$5 $4 $3 $1 $2");
console.log(match);
