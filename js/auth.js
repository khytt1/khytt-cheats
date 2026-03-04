import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const authStatus = document.getElementById('authStatus');

    let isLoginMode = true;

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            authTitle.textContent = isLoginMode ? "Log In" : "Sign Up";
            authSubmitBtn.textContent = isLoginMode ? "Log In" : "Sign Up";
            toggleAuthMode.textContent = isLoginMode ? "Sign Up" : "Log In";
            // Update the text in the surrounding p tag safely
            toggleAuthMode.parentElement.childNodes[0].nodeValue = isLoginMode ? "Don't have an account? " : "Already have an account? ";
            authStatus.style.display = 'none';
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = "Processing...";
            authStatus.style.display = 'none';

            if (isLoginMode) {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        window.location.href = "index.html";
                    })
                    .catch((error) => {
                        authStatus.textContent = error.message;
                        authStatus.className = 'form-status error';
                        authStatus.style.display = 'block';
                        authSubmitBtn.disabled = false;
                        authSubmitBtn.textContent = "Log In";
                    });
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        window.location.href = "index.html";
                    })
                    .catch((error) => {
                        authStatus.textContent = error.message;
                        authStatus.className = 'form-status error';
                        authStatus.style.display = 'block';
                        authSubmitBtn.disabled = false;
                        authSubmitBtn.textContent = "Sign Up";
                    });
            }
        });
    }
});
