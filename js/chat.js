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

        // Query all messages (no limit) and order chronologically
        const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

        onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
            const msgs = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // To handle local writes before they hit the server, we use a future date placeholder
                // This ensures your own new messages appear at the bottom instantly.
                const timeStr = data.createdAt ? data.createdAt.toMillis() : Date.now() + 10000;
                msgs.push({ time: timeStr, ...data, id: doc.id });
            });

            // Re-enforce chronological sort just in case
            msgs.sort((a, b) => a.time - b.time);

            chatMessages.innerHTML = '';
            msgs.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'chat-message';

                const author = document.createElement('span');
                author.className = 'chat-author';
                author.textContent = msg.displayName ? msg.displayName : (msg.email ? msg.email.split('@')[0] : 'Anonymous');

                const text = document.createElement('span');
                text.className = 'chat-text';
                text.textContent = msg.text;

                div.appendChild(author);
                div.appendChild(document.createTextNode(': '));
                div.appendChild(text);

                chatMessages.appendChild(div);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, (error) => {
            console.error("Firebase Listener Error: ", error);
            chatInput.placeholder = "Error connecting to secure server.";
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
                        displayName: currentUser.displayName || null,
                        createdAt: serverTimestamp()
                    });
                } catch (error) {
                    console.error("Error writing document: ", error);
                    alert("Message failed to send. Check your Firestore Security Rules.");
                }
            }
        });
    }
});
