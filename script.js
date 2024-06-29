"use strict";

//DATA
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements

const LabelWelcome = document.querySelector(".welcome");

const labelDate = document.querySelector(".balance-date");
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

//////////////////////////////////////////////////////////////////////////////

//creating the account user name

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

//function for display the movements in the html
const displayUI = function (account) {
  //display movements
  displayMovements(account.movements);
  //display balance
  calcDisplayBalance(account);
  //display summary
  calcDisplaySummery(account);
};

//displaing the movements in the html
const displayMovements = function (movements, sort = false) {
  //TIP : i set the sort defualt value to false , cause i want to display the movements in the original order
  containerMovements.innerHTML = "";
  //for empty the html element

  //using the slice method to creat a copy of the array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //if sort is true than sort the movements from low to high else display the movements in the original order

  movs.forEach(function (mov, index) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `  <div class="movements--row movement--${type}">
    <div class="${type}-number">${index + 1} ${type}</div>
    <div class="${type}-value">${mov.toFixed(2)} €</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
    //for insert the html element
  });
};
//accumulating the balance..........................

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  balanceLabel.textContent = `${account.balance.toFixed(2)}€`;
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

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//login the user

let currentAccount;

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

    //display movements
    displayUI(currentAccount);
  } else {
    LabelWelcome.textContent = `Wrong username or password 😢`;
    containerApp.style.opacity = 0;
  }
});

//transfering the money

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
    //update UI
    displayUI(currentAccount);
  }
});

//requesting loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  //if the amount is greater than 0 and one of the movements is greater than 10% of the amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    displayUI(currentAccount);
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

//closing the account
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

//sorting the movements
let sorted = false; //set the defualt value to false cause i want to now the movements is sorted or not to cahnge it
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("clicked");
  displayMovements(currentAccount.movements, !sorted); //using the NOT operator to change the value of sorted

  sorted = !sorted; //and again change the value after each CLICK
});
