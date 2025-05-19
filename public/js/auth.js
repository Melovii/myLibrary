const registerForm = document.querySelector("#register-form");
const usernameInput = document.getElementById('usernameReg');
const passwordInput = document.getElementById('passwordReg');
const usernameError = document.getElementById('usernameReg-error');
const passwordError = document.getElementById('passwordReg-error');
const registerSuccessMessage = document.getElementById('registerSuccessMessage');

const registerPopupButton = document.querySelector("#register");
const registerCloseButton = document.querySelector('#registerCloseButton');
const registerPopup = document.querySelector('.registerPopup');
const registerCenter = document.querySelector('#registerCenter');

const POPUP_CLOSE_DELAY = 2500;

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

function clearMessages() {
  usernameError.textContent = '';
  passwordError.textContent = '';
  registerSuccessMessage.style.display = 'none';
  registerSuccessMessage.textContent = '';
}

function openRegisterPopup() {
  toggleRegisterPopup(true);
}

function closeRegisterPopup() {
  toggleRegisterPopup(false);
  registerForm.reset();
  clearMessages();
}

// Open popup form
registerPopupButton.addEventListener('click', openRegisterPopup);

// Close popup form
registerCloseButton.addEventListener('click', closeRegisterPopup);

// Handle register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  let hasError = false;

  if (!username) {
    usernameError.textContent = 'Username is required.';
    hasError = true;
  }
  if (!password) {
    passwordError.textContent = 'Password is required.';
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
      passwordError.textContent = result.error || 'Registration failed';
      return;
    }

    registerSuccessMessage.textContent = 'User registered successfully! You can now log in.';
    registerSuccessMessage.style.display = 'block';

    setTimeout(() => {
      closeRegisterPopup();
    }, POPUP_CLOSE_DELAY);

  } catch (err) {
    console.error(err);
    passwordError.textContent = 'Network error, please try again.';
  }
});
