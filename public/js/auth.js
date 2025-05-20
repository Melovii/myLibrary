const registerForm = document.querySelector("#register-form");
const usernameRegInput = document.getElementById('usernameReg');
const passwordRegInput = document.getElementById('passwordReg');
const usernameRegError = document.getElementById('usernameReg-error');
const passwordRegError = document.getElementById('passwordReg-error');
const registerSuccessMessage = document.getElementById('registerSuccessMessage');

const registerPopupButton = document.querySelector("#register");
const registerCloseButton = document.querySelector('#registerCloseButton');
const registerPopup = document.querySelector('.registerPopup');
const registerCenter = document.querySelector('#registerCenter');

const usernameLoginInput = document.getElementById('usernameLogin');
const passwordLoginInput = document.getElementById('passwordLogin');
const usernameLoginError = document.getElementById('usernameLogin-error');
const passwordLoginError = document.getElementById('passwordLogin-error');
const loginSuccessMessage = document.getElementById('loginSuccessMessage');


const POPUP_CLOSE_DELAY = 1500;

function toggleRegisterPopup(show) {
  if (show) {
    registerPopup.classList.add('active');
    registerCenter.classList.add('active');
    document.body.classList.add('no-scroll');
  } else {
    registerPopup.classList.remove('active');
    registerCenter.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

function clearRegisterMessages() {
  usernameRegError.textContent = '';
  passwordRegError.textContent = '';
  registerSuccessMessage.style.display = 'none';
  registerSuccessMessage.textContent = '';
}

function openRegisterPopup() {
  toggleRegisterPopup(true);
}

function closeRegisterPopup() {
  toggleRegisterPopup(false);
  registerForm.reset();
  clearRegisterMessages();
}

// Open register popup form
registerPopupButton.addEventListener('click', openRegisterPopup);

// Close register popup form
registerCloseButton.addEventListener('click', closeRegisterPopup);

// Handle register register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearRegisterMessages();

  const username = usernameRegInput.value.trim();
  const password = passwordRegInput.value.trim();
  let hasError = false;

  if (!username) {
    usernameRegError.textContent = 'Username is required.';
    hasError = true;
  }
  if (!password) {
    passwordRegError.textContent = 'Password is required.';
    hasError = true;
  }

  if (hasError) return;

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password })
    });

    const result = await response.json();

    if (!response.ok) {
      passwordRegError.textContent = result.error || 'Registration failed';
      return;
    }

    registerSuccessMessage.textContent = 'User registered successfully! You can now log in.';
    registerSuccessMessage.style.display = 'block';

    setTimeout(() => {
      closeRegisterPopup();
    }, POPUP_CLOSE_DELAY);

  } catch (err) {
    console.error(err);
    passwordRegError.textContent = 'Network error, please try again.';
  }
});


/* ----------------------------------------------------------------------- */

const loginForm = document.querySelector("#login-form");
const loginPopupButton = document.querySelector("#login");
const loginCloseButton = document.querySelector("#loginCloseButton");
const loginPopup = document.querySelector(".loginPopup");
const loginCenter = document.querySelector("#loginCenter");

function toggleLoginPopup(show) {
  if (show) {
    loginPopup.classList.add('active');
    loginCenter.classList.add('active');
    document.body.classList.add('no-scroll');
  } else {
    loginPopup.classList.remove('active');
    loginCenter.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

function clearLoginMessages() {
  usernameLoginError.textContent = '';
  passwordLoginError.textContent = '';
  loginSuccessMessage.style.display = 'none';
  loginSuccessMessage.textContent = '';
}

function openLoginPopup() {
  toggleLoginPopup(true);
}

function closeLoginPopup() {
  toggleLoginPopup(false);
  loginForm.reset();
  clearLoginMessages();
}

// Open login popup form
loginPopupButton.addEventListener('click', openLoginPopup);

// Close login popup form
loginCloseButton.addEventListener('click', closeLoginPopup);

// Handle login register form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearLoginMessages();
  let hasError = false;

  const username = usernameLoginInput.value.trim();
  const password = passwordLoginInput.value.trim();
  if (!username) {
    usernameLoginError.textContent = 'Username is required.';
    hasError = true;
  }
  if (!password) {
    passwordLoginError.textContent = 'Password is required.';
    hasError = true;
  }
  if (hasError) return;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password })
    });

    const result = await response.json();

    if (!response.ok) {
      passwordLoginError.textContent = result.error || 'Login failed';
      return;
    }

    // Save user ID to localStorage
    // localStorage.setItem('userId', result.userId);

    loginSuccessMessage.textContent = 'User logged in successfully!';
    loginSuccessMessage.style.display = 'block';

    setTimeout(() => {
      window.location.href = '../library.html';
    }, POPUP_CLOSE_DELAY);

  } catch (err) {
    console.error(err);
    passwordLoginError.textContent = 'Network error, please try again.';
  }
});

// document.getElementById('logout').addEventListener('click', () => {
//   window.location.href = '/logout';
// });


