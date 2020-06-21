// function doSomething() {
//     var d = new Date(),
//         h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - (d.getMinutes() % 1)) + 1, 0, 0),
//         e = h - d;
//     setTimeout(function () {
//         doSomething();
//         timedText();
//     }, e);
// }

// doSomething();

// function timedText() {

//     function shuffle(array) {
//         var currentIndex = array.length,
//             temporaryValue, randomIndex;

//         // While there remain elements to shuffle...
//         while (0 !== currentIndex) {

//             // Pick a remaining element...
//             randomIndex = Math.floor(Math.random() * currentIndex);
//             currentIndex -= 1;

//             // And swap it with the current element.
//             temporaryValue = array[currentIndex];
//             array[currentIndex] = array[randomIndex];
//             array[randomIndex] = temporaryValue;
//         }

//         return array;
//     }


//     var numbers = []
//     for (var i = 1; i <= 45; i++) {
//         numbers.push(i)
//     }
//     shuffle(numbers);

//     console.log(numbers);

//     setTimeout(function () {
//         var numbersStarted = document.getElementById("txt").innerHTML = "Start";
//         numbersStarted;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 100);
//     setTimeout(function () {
//         var numbers0 = document.getElementById("txt").innerHTML = numbers[0];
//         numbers0;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 1000);
//     setTimeout(function () {
//         var numbers1 = document.getElementById("txt").innerHTML = numbers[1];
//         numbers1;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 2000);
//     setTimeout(function () {
//         var numbers2 = document.getElementById("txt").innerHTML = numbers[2];
//         numbers2;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 3000);
//     setTimeout(function () {
//         var numbers3 = document.getElementById("txt").innerHTML = numbers[3];
//         numbers3;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 4000);
//     setTimeout(function () {
//         var numbers4 = document.getElementById("txt").innerHTML = numbers[4];
//         numbers4;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 5000);
//     setTimeout(function () {
//         var numbersStopped = document.getElementById("txt").innerHTML = "Done";
//         numbersStopped;
//         $("#txt").fadeOut(750);
//         $("#txt").fadeIn(750);
//     }, 6000);
// }

// var timer_var = setInterval(timerClock, 1000);

// function timerClock() {
//     // var dateVar = new Date();
//     // document.getElementById("clockID").innerHTML = dateVar.toLocaleTimeString();
// }