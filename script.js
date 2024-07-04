"use strict";

//DATA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-06-24T17:01:17.194Z",
    "2024-06-30T23:36:17.929Z",
    "2024-07-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2021-04-18T18:49:59.371Z",
    "2021-04-16T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2010-06-25T14:19:59.371Z",
    "2011-01-01T15:15:43.035Z",
    "2016-07-26T12:01:20.894Z",
    "2018-11-30T09:08:16.867Z",
    "2019-02-25T06:04:23.907Z",
    "2020-04-10T14:43:26.374Z",
    "2021-01-05T04:18:46.235Z",
    "2021-02-25T16:33:36.386Z",
  ],
  currency: "DKK",
  locale: "da-DK",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2015-04-01T10:17:24.185Z",
    "2016-05-08T14:11:59.604Z",
    "2017-07-26T17:01:17.194Z",
    "2019-12-23T07:42:02.383Z",
    "2021-01-28T09:15:04.904Z",
  ],
  currency: "SYP",
  locale: "syr-SY",
};

const accounts = [account1, account2, account3, account4];

// Elements ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const LabelWelcome = document.querySelector(".welcome");

const labelDate = document.querySelector(".balance-date-label");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".value-in");
const labelSumOut = document.querySelector(".value-out");
const labelSumInterest = document.querySelector(".value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector("#content");
const containerMovements = document.querySelector(".movements");
const balanceLabel = document.querySelector(".balance-value");

const btnLogin = document.querySelector(".login__btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const btnTransfer = document.querySelector(".btn--transfer");
const btnLoan = document.querySelector(".btn--loan");
const btnClose = document.querySelector(".btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputTransferTo = document.querySelector(".transfer--to");
const inputTransferAmount = document.querySelector(".transfer--amount");
const inputLoanAmount = document.querySelector(".loan--amount");
const inputCloseUsername = document.querySelector(".close--user");
const inputClosePin = document.querySelector(".close--pin");

//fundemetals /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentAccount, Timer;
let sorted = false; //set the defualt value to false cause i want to now the movements is sorted or not to cahnge it

//get time ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const now = new Date();
// const year = now.getFullYear();
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const day = `${now.getDate()}`.padStart(2, 0);
// const hour = now.getHours();
// const minute = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  // weekday: 'long',
};

//functions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//function for display the UI in the html ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const displayUI = function (account) {
  //display movements
  displayMovements(account);
  //display balance
  calcDisplayBalance(account);
  //display summary
  calcDisplaySummery(account);
};

//creating the account user name ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//step 1 :
//const acc = account4.owner.toLowercase().split(' ').map(name => name[0]).join('');

//step 2 :
// //   accs.forEach(function(acc){
// accs.username = acc.toLowercase().split(' ').map(name =>  name[0]).join('')});
const creatUsername = function (accs) {
  //loop over the array
  accs.forEach(function (acc) {
    //create the username and add it to the object
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0]) //we using the map for create a new array
      .join("");
  });
};
creatUsername(accounts);
console.log(accounts);

//currency formater function ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const currFormat = function (value, locale, currency) {
  //value is what to shuild formated
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//movements dates function ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const formatMovementsDays = function (locale, date) {
  //return the days passed by absolute value
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  //TIP: there is no problem with to much return, because when it return true , we want to finish the function
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //and if the days passed is more than 7 then we want to display the date in the format : day/month/year
  // const year = date.getFullYear();
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(daysPassed);
};

//timer function ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const startedTimerLogout = function () {
  const tick = function () {
    let min = String(Math.trunc(Time / 60)).padStart(2, 0);
    let sec = String(Time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    //count down the timer
    if (Time === 0) {
      clearInterval(Timer);
      //display UI and message
      LabelWelcome.textContent = `Log i to get started`; //split the name and display only the first name
      containerApp.style.opacity = 0;
    }

    //decrease the time
    Time--;
  };
  let Time = 600;
  const Timer = setInterval(tick, 1000);
  return Timer;
};

//displaing the movements in the html --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const displayMovements = function (acc, sort = false) {
  //TIP : i set the sort defualt value to false , cause i want to display the movements in the original order
  containerMovements.innerHTML = "";
  //for empty the html element

  //using the slice method to creat a copy of the array
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; //if sort is true than sort the movements from low to high else display the movements in the original order
  console.log(movs);

  movs.forEach(function (mov, index) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[index]);

    const displayDate = formatMovementsDays(acc.locale, date);
    const curr = currFormat(mov, acc.locale, acc.currency);
    const html = `  <div class="movements--row movement--${type}">
    <div class="${type}-number">${index + 1} ${type}</div>
     <div class="${type}-date">${displayDate}</div>
    <div class="${type}-value">${curr}</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
    //for insert the html element
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
  });
};

//accumulating the balance --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  const currency = currFormat(
    account.balance,
    account.locale,
    account.currency
  );
  console.log(currency);
  balanceLabel.textContent = `${currency}`;
};

//displaying the summary in the html
const calcDisplaySummery = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outcomes = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const interest = account.movements
    .filter((mov) => mov > 0) // Filter out positive movements (deposits)
    .map((deposit) => (deposit * currentAccount.interestRate) / 100) // Calculate interest for each deposit
    .filter((int) => int >= 1) // Filter out interest amounts less than 1
    .reduce((acc, mov) => acc + mov, 0); // Sum up the interests

  labelSumIn.textContent = `${currFormat(
    incomes,
    account.locale,
    account.currency
  )}`;
  labelSumOut.textContent = `${currFormat(
    Math.abs(outcomes),
    account.locale,
    account.currency
  )}`;

  labelSumInterest.textContent = `${currFormat(
    interest,
    account.locale,
    account.currency
  )}`;
};

//Event listeners ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//BTN Login ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); //prevent form from submitting
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  ); //check if the user exist
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //if the username exist than check the pin correct or not
    //display UI and message
    LabelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(" ")[0]
    }`; //split the name and display only the first name
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); //blur the input field

    //reset the timer
    if (Timer) clearInterval(Timer);
    Timer = startedTimerLogout();

    //display movements
    displayUI(currentAccount);
  } else {
    LabelWelcome.textContent = `Wrong username or password 😢`;
    containerApp.style.opacity = 0;
  }
});

//BTN transfering the money ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update the movements date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update UI
    displayUI(currentAccount);

    //reset the timer
    if (Timer) clearInterval(Timer);
    Timer = startedTimerLogout();
  }
});

//BTN requesting loan ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  //if the amount is greater than 0 and one of the movements is greater than 10% of the amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //add timer to accept the loan like reeal world
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);

      //update the movements date
      currentAccount.movementsDates.push(new Date().toISOString());

      //update UI
      displayUI(currentAccount);
    }, 2500);
  }
  //reset the timer
  if (Timer) clearInterval(Timer);
  Timer = startedTimerLogout();

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

//BTN closing the account ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    //find the index
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    //delete the account
    //TIP: this will return the new array , so there is no need to assign it to the new variable
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
  LabelWelcome.textContent = "Log in to get started";
});

//BTN sorting the movements ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("clicked");
  displayMovements(currentAccount, !sorted); //using the NOT operator to change the value of sorted

  sorted = !sorted; //and again change the value after each CLICK

  //reset the timer
  if (Timer) clearInterval(Timer);
  Timer = startedTimerLogout();
});
