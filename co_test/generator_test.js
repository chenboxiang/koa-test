/**
 * Author: chenboxiang
 * Date: 14-4-17
 * Time: 下午12:43
 */
"use strict";

//function delay(time, callback) {
//    setTimeout(function() {
//        if (typeof callback === "function") {
//            callback("Sleep for " + time);
//        }
//    }, time);
//
//    return time;
//}
//
//function *myDelayedMessages(resume) {
//    console.log(yield delay(1000, resume));
//    console.log(yield delay(1200, resume));
//}
//
//function run(generatorFunction) {
//    var generatorItr = generatorFunction(resume);
//
//    function resume(callbackValue) {
//        console.log(generatorItr.next(callbackValue));
//    }
//
//    console.log("xx", generatorItr.next());
//}
//
//run(myDelayedMessages);

//var generatorItr = myDelayedMessages();
//console.log(generatorItr.next());
//console.log(generatorItr.next());
//console.log(generatorItr.next());

//function* genFunc () {
//    console.log(yield 1)
//    console.log(yield 2)
//}
//var gen = genFunc()
//console.log(gen.next()) // 此时generator内部执行到 yield 1 并暂停，但还未对result赋值！
//// 即使异步也可以！
//setTimeout(function () {
//    gen.next(123) // 给result赋值并继续执行，输出: 123
//}, 1000)

function *example() {
    console.log("he", yield 'he');
    var hello = yield 'hello';
    console.log("he", hello);
    var world = yield 'world';
    console.log("world", world);
}
var gen = example();
var ret = gen.next();
//try {
    ret = gen.throw(new Error("throw error"));
//} catch (err) {
//    console.log("error", err);
//}

console.log(ret);

//ret = gen.next(ret.value);
//console.log(ret);
////ret = gen.next();
////console.log(ret);
//ret = gen.next(ret.value);
//console.log(ret);