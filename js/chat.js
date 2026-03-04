import { auth, db, onAuthStateChanged } from './firebase-config.js';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatSubmit = document.getElementById('chatSubmit');

    let currentUser = null;

    if (chatMessages && chatForm) {
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            if (user) {
                chatInput.disabled = false;
                chatSubmit.disabled = false;
                chatInput.placeholder = "Type a message...";
            } else {
                chatInput.disabled = true;
                chatSubmit.disabled = true;
                chatInput.placeholder = "Please log in to chat.";
            }
        });

        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(50));
        onSnapshot(q, (snapshot) => {
            chatMessages.innerHTML = '';
            const msgs = [];
            snapshot.forEach((doc) => {
                msgs.push(doc.data());
            });
            msgs.reverse(); // Display oldest to newest

            msgs.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'chat-message';

                const author = document.createElement('span');
                author.className = 'chat-author';
                author.textContent = msg.email ? msg.email.split('@')[0] : 'Anonymous';

                const text = document.createElement('span');
                text.className = 'chat-text';
                text.textContent = msg.text;

                div.appendChild(author);
                div.appendChild(document.createTextNode(': '));
                div.appendChild(text);

                chatMessages.appendChild(div);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (text && currentUser) {
                chatInput.value = '';
                try {
                    await addDoc(collection(db, "messages"), {
                        text: text,
                        uid: currentUser.uid,
                        email: currentUser.email,
                        createdAt: serverTimestamp()
                    });
                } catch (error) {
                    console.error("Error writing document: ", error);
                }
            }
        });
    }
});
