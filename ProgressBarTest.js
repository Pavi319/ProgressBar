progressBar = require('../ProgressBar/ProgressBar');

const bar = new progressBar('downloading [:bar] :percent :eta',{total: 100, width:40,complete: '=',incomplete: '-',callback: showFive,timeout: 500})

// let timer = setInterval(function() {
//   bar.tick(10)
//   if(bar.complete) {
//     console.log('\nComplete\n');
//     clearInterval(timer)
//   }
// },1000);




let sum = 0;
let steps=0;
let time = new Date()
// let timer2 = setInterval(()=>{
//   steps++;
//   //sum = Math.random()*10
//   sum += 2;
//   // console.log(sum)
//   bar.progress(sum)
//   if(bar.complete) {
//     console.log('\n Complete \n');
//     clearInterval(timer2)
//   }
// },5000);




let timerFn = function(){

  steps++;
  //sum = Math.random()*10
  sum += 2;
  // console.log(sum)
  bar.progress(sum)
  if(bar.complete) {
   console.log('\n Complete \n');
   return clearTimeout(timer3);
  }
   timer3 = setTimeout(timerFn,Math.random()*10*(100-sum));
}

let timer3=setTimeout(timerFn,Math.random()*5000)





// var bar = new progressBar(':bar', { total: 12, renderRule: 16, complete: '=', incomplete: '3', head : 'D'});
// var timer = setInterval(function () {
//   bar.tick();
//   if (bar.complete) {
//     console.log('\ncomplete\n');
//     clearInterval(timer);
//   }
// }, 100);
// var bar = new progressBar(':current: :token1 :token2', { total: 3 })
// bar.tick({
//   'token1': "Hello",
//   'token2': "World!\n"
// })
// bar.tick(2, {
//   'token1': "Goodbye",
//   'token2': "World!"
// })

// var https = require('https');

// var req = https.request({
//   host: 'download.github.com',
//   port: 443,
//   path: '/visionmedia-node-jscoverage-0d4608a.zip'
// });

// req.on('response', function(res){
//   var len = parseInt(res.headers['content-length'], 30);
//   var bar = new progressBar('  downloading [:bar] :rate/bps :percent :eta', {
//     complete: '=',
//     incomplete: ' ',
//     width: 50,
//     total: len,
//     callback: showFive()
//   });

//   res.on('data', function (chunk) {
//     var timer = setInterval(function () {
//         bar.tick(chunk.length);
//         if (bar.complete) {
//           console.log('\ncomplete\n');
//           clearInterval(timer);
//         }
//       },100);
//   });

//   res.on('end', function () {
//     console.log('\n');
//   });
// });
function showFive(){
  console.log('\nSteps, ',steps);
  let finish = new Date()
  console.log(finish-time)
}
// req.end();