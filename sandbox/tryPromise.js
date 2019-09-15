var promise1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 1000, "foo1");
})
    .then(val => {return val})
    .catch(err => null);
var promise2 = 402;
var promise3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 2000, "foo3");
});

var pr = [promise1, promise2, promise3];

Promise.all(pr)
    .catch(function(e) {
        console.log(e);
        return pr;
    })
    .then(function(values) {
        console.log(values);
    });
// expected output: Array [3, 42, "foo"]
