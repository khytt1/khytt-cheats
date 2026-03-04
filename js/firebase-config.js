import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYpLli5rKmbRswxzx37Ey9dSQOaQJ5JgY",
    authDomain: "khytt-cheats.firebaseapp.com",
    projectId: "khytt-cheats",
    storageBucket: "khytt-cheats.firebasestorage.app",
    messagingSenderId: "727861028649",
    appId: "1:727861028649:web:22865800d4fb5c1cea7938"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged, signOut };

// Global UI handling for Logged-In state
document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('navLoginLink');
    if (loginLink) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                loginLink.textContent = "Sign Out";
                loginLink.href = "#";
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    signOut(auth).then(() => {
                        window.location.reload();
                    });
                });
            } else {
                loginLink.textContent = "Log In";
                loginLink.href = "login.html";
            }
        });
    }
});
