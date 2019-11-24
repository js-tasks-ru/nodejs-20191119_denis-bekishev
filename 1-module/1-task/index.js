const intervalId = setInterval(() => {
  console.log('James');
}, 10);

setTimeout(() => {
  const promise = new Promise((resolve) => {
    console.log('Richard');
    resolve('Robert');
  });

  promise
      .then((value) => {
        console.log(value);

        setTimeout(() => {
          console.log('Michael');

          clearInterval(intervalId);
        }, 10);
      });

  console.log('John');
}, 10);

// stack []
// tick []
// micro []
// macro [int, timeout]
// imm []

// stack [int, James]
// tick []
// micro []
// macro [timeout, int]
// imm []

// stack [timeout, Richard, John]
// tick []
// micro [promise]
// macro [int]
// imm []

// stack [promise, Robert]
// tick []
// micro []
// macro [int(10), time(Michael, 10)]
// imm []

// stack [int, James]
// tick []
// micro []
// macro [time(Michael, 10), int]
// imm []

// stack [time, Michael]
// tick []
// micro []
// macro []
// imm []

/*
James
Richard
John
Robert
James
Michael
* */
