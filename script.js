'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// /////////////////////////////////////////////
// my work

// display movemnets
const displaymovements = (movements, sort = false) => {
  containerMovements.innerHTML = '';

  const sorted = sort ? movements.slice().sort((a, b) => a - b) : movements;

  sorted.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//  CalcandDisplayBalance
const calcDisplayedBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.innerHTML = `${acc.balance}€`;
};

// SUMMARY
const calcDisplaySummary = acc => {
  const IN = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const OUT = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  const INTERSET = Number(acc.balance) * 0.012;

  labelSumIn.innerHTML = IN;
  labelSumOut.innerHTML = OUT;
  labelSumInterest.innerHTML = INTERSET;
};

// create username
const createUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

// UPDATEUI
const updateUI = acc => {
  displaymovements(acc.movements);
  calcDisplayedBalance(acc);
  calcDisplaySummary(acc);
};

let currentAcc;
// add envents
// LOGIN
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  const pin = Number(inputLoginPin.value);

  if (pin && pin === currentAcc.pin) {
    labelWelcome.innerHTML = `Welcome, ${currentAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = '100';
    updateUI(currentAcc);
  }

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

// TRANSFERMONEY
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount &&
    reciverAcc &&
    amount < currentAcc.balance &&
    reciverAcc.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-amount);
    reciverAcc.movements.push(amount);

    updateUI(currentAcc);
  }

  inputTransferTo.value = inputTransferAmount.value = '';

  console.log(reciverAcc);
});

// LOAN
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const anyDesposit = currentAcc.movements.some(mov => mov >= amount * 0.1);

  if (amount && anyDesposit) {
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
  }

  inputLoanAmount.value = '';
});

// CLOSEACC
inputClosePin.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAcc.username
    );

    // Delete account
    accounts.splice(index, 1);
    console.log(accounts);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// SORT

let sorting = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displaymovements(currentAcc.movements, !sorting);
  sorting = !sorting;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
