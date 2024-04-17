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
console.log(labelSumInterest);
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const balanceLabel = document.querySelector(".balance-value");

//////////////////////////////////////////////////////////////////////////////

//displaing the movements in the html
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  //for empty the html element

  movements.forEach(function (mov, index) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `  <div class="movements--row movement--${type}">
    <div class="${type}-number">${index + 1} ${type}</div>
    <div class="${type}-value">${mov} €</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
    //for insert the html element
  });

  //accumulating the balance..........................
  const calcDisplayBalance = function (movements) {
    const balance = movements.reduce((acc, mov) => acc + mov, 0);
    balanceLabel.textContent = `${balance}€`;
  };

  calcDisplayBalance(account1.movements);

  //displaying the summary in the html
  const calcDisplaySummery = function (movements) {
    const incomes = movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);

    const outcomes = movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);

    const interest = movements
      .filter((mov) => mov > 0) // Filter out positive movements (deposits)
      .map((deposit) => (deposit * 1.2) / 100) // Calculate interest for each deposit
      .filter((int) => int >= 1) // Filter out interest amounts less than 1
      .reduce((acc, mov) => acc + mov, 0); // Sum up the interests
    console.log(interest);

    labelSumIn.textContent = `${incomes}€`;
    labelSumOut.textContent = `${Math.abs(outcomes)}€`;

    labelSumInterest.textContent = `${interest}€`;
  };

  calcDisplaySummery(account1.movements);
};

displayMovements(account1.movements);

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
