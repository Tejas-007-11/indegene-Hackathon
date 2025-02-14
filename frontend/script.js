document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Function to Add Message
    function addMessage(message, type, isTyping = false) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message", type === "user" ? "user-message" : "ai-message");

        if (isTyping) {
            msgDiv.classList.add("typing"); // Add typing animation class
            msgDiv.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
        } else {
            msgDiv.textContent = message;
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return msgDiv;
    }

    // Function to Show Typing Effect
    function showTypingIndicator() {
        return addMessage("", "ai", true);
    }

    // Function to Send Message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, "user");
        userInput.value = "";

        // Show Typing Animation
        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message }),
            });

            const data = await response.json();

            // Remove Typing Animation & Show Response
            setTimeout(() => {
                typingIndicator.remove();
                addMessage(data.response, "ai");
            }, 1000); // Delay to mimic typing
        } catch (error) {
            typingIndicator.remove();
            addMessage("Error connecting to AI.", "ai");
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
