"use strict";
​
var Promise = require("bluebird"),
  async = require("async"),
  exerciseUtils = require("./utils");
​
var readFile = exerciseUtils.readFile,
  promisifiedReadFile = exerciseUtils.promisifiedReadFile,
  blue = exerciseUtils.blue,
  magenta = exerciseUtils.magenta;
​
var args = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});
​
module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE,
};
​
// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  var problem = module.exports["problem" + arg];
  if (problem) problem();
});
​
function problemA() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
  
  // callback version
  async.each(
    ["poem-two/stanza-01.txt", "poem-two/stanza-02.txt"],
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log("-- A. callback version --");
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log("-- A. callback version done --");
    }
    );
    */
​
  // promise version
  Promise.all([
    promisifiedReadFile("poem-two/stanza-01.txt"),
    promisifiedReadFile("poem-two/stanza-02.txt"),
  ]).then((stanzas) => {
    stanzas.forEach((stanza) => blue(stanza));
    console.log("done");
  });
}
​
function problemB() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */
​
  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
​
  // callback version
  // async.each(
  //   filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log("-- B. callback version --");
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log("-- B. callback version done --");
  //   }
  // );
​
  // promise version
  var promesas = filenames.map((file) => promisifiedReadFile(file));
​
  Promise.all(promesas).then((stanzas) => {
    stanzas.forEach((stanza) => blue(stanza));
    console.log("done");
  });
}
​
function problemC() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
  
  
  // callback version
  async.eachSeries(
    filenames,
    function (filename, eachDone) {
      readFile(filename, function (err, stanza) {
        console.log("-- C. callback version --");
        blue(stanza);
        eachDone();
      });
    },
    function (err) {
      console.log("-- C. callback version done --");
    }
    );
    */
​
  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
​
  // var p1 = promisifiedReadFile(filenames[0]);
​
  // var p2 = p1.then((stanza) => {
  //   blue(stanza);
  //   return promisifiedReadFile(filenames[1]);
  // });
​
  // var p3 = p2.then((stanza) => {
  //   blue(stanza);
  //   return promisifiedReadFile(filenames[2]);
  // });
​
  //p3 = p1.then.then
​
  // [1, 2, 3, 4, 5, 6, 7, 8]
  // promise version
  for (
    let i = 1, p = promisifiedReadFile(filenames[0]);
    i <= filenames.length;
    i++
  ) {
    p = p.then((stanza) => {
      blue(stanza);
      if (i === filenames.length) {
        console.log("done");
      } else {
        return promisifiedReadFile(filenames[i]);
      }
    });
  }
}
​
function problemD() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */
​
  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = "wrong-file-name-" + (randIdx + 1) + ".txt";
​
  // callback version
  // async.eachSeries(
  //   filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log("-- D. callback version --");
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(new Error(err));
  //     console.log("-- D. callback version done --");
  //   }
  // );
​
  // promise version
  for (
    let i = 1, p = promisifiedReadFile(filenames[0]);
    i <= filenames.length;
    i++
  ) {
    p = p.then((stanza) => {
      blue(stanza);
​
      if (i === filenames.length) {
        console.log("done");
      } else {
        return promisifiedReadFile(filenames[i]);
      }
    });
​
    if (i === filenames.length) {
      p.catch((err) => {
        magenta(new Error(err));
        console.log("done");
      });
    }
  }
}
​
//p.then.then.then.....catch
​
function problemE() {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */
​
  var fs = require("fs");
  function promisifiedWriteFile(filename, str) {
    // tu código aquí
  }
}