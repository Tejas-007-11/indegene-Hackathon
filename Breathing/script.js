let timer;
let seconds = 0;
const maxTime = 60;
const fullCircle = 565;

document.getElementById("start-btn").addEventListener("click", function () {
    document.getElementById("result").innerHTML = "";
    seconds = 0;
    document.getElementById("timer").style.opacity = "1";
    document.getElementById("stop-btn").disabled = true;
    document.getElementById("timer").innerText = "Inhale for 3 seconds...";

    // Reset Circle Animation
    document.querySelector(".progress-circle").style.strokeDashoffset = fullCircle;
    
    let circle = document.querySelector(".circle-container");

    // Reset animation states
    circle.classList.remove("expanding", "holding", "shrinking");

    // Start Inhale Animation
    circle.classList.add("expanding");

    let inhaleTime = 3;
    let inhaleCountdown = setInterval(() => {
        document.getElementById("timer").innerText = `Inhale: ${inhaleTime}s`;
        inhaleTime--;

        if (inhaleTime < 0) {
            clearInterval(inhaleCountdown);
            circle.classList.remove("expanding");
            circle.classList.add("holding");
            startBreathHold();
        }
    }, 1000);
});

function startBreathHold() {
    document.getElementById("timer").innerText = "Hold your breath!";
    document.getElementById("stop-btn").disabled = false;

    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").innerText = `${seconds}s`;
        updateProgress(seconds);

        if (seconds >= maxTime) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

document.getElementById("stop-btn").addEventListener("click", function () {
    clearInterval(timer);
    showResult();
});

function updateProgress(time) {
    let progress = Math.max(0, fullCircle - (fullCircle * (time / maxTime)));
    document.querySelector(".progress-circle").style.strokeDashoffset = progress;
}

function saveResult(seconds) {
    let results = JSON.parse(localStorage.getItem("lungTestResults")) || [];
    results.push({ date: new Date().toLocaleString(), time: seconds });
    localStorage.setItem("lungTestResults", JSON.stringify(results));
}

function showResult() {
  saveResult(seconds);
    let message = "";
    let statement = "";
    let tips = "";

    if (seconds < 15) {
        message = "⏳  Level: Needs Attention ⚠️💨";
        statement = "Your lungs need some love! Try deep breathing exercises and stay active to improve lung health.";
        tips = `
            🫁 Practice diaphragmatic breathing – Inhale deeply through your nose, expand your belly.<br>
            🚶 Do light cardio – Walking, cycling, or stretching helps build endurance.<br>
            🚭 Avoid smoking & pollution – Fresh air is your best friend!
        `;
    } else if (seconds >= 15 && seconds < 30) {
        message = "⏳ Level: Below Average 🌱✨";
        statement = "A good start! But there's room for improvement. Let's boost your lung capacity!";
        tips = `
            🌬️ Try pursed-lip breathing – Inhale through the nose, exhale slowly through pursed lips.<br>
            🍵 Drink warm fluids – Herbal tea & honey can help keep lungs clear.<br>
            🧍 Improve posture – Standing tall allows your lungs to expand fully.
        `;
    } else if (seconds >= 30 && seconds < 45) {
        message = "⏳ Level: Average🔄👍";
        statement = "You're doing well! A little effort can take you to the next level.";
        tips = `
            🏃 Increase aerobic activity – Try jogging, swimming, or brisk walking.<br>
            🧘 Reduce stress with mindful breathing – Deep breaths = calm mind.<br>
            🥑 Eat lung-friendly foods – Antioxidants from fruits & leafy greens help!
        `;
    } else if (seconds >= 45 && seconds < 60) {
        message = "⏳ Level: Strong Lungs 💪🫁";
        statement = "Great job! Your lungs are working efficiently.";
        tips = `
            ⏳ Try breath-hold training – See if you can push your limits safely.<br>
            💧 Stay hydrated – Drinking water helps keep airways clear.<br>
            🏋️ Maintain an active lifestyle – Keep up the great work!
        `;
    } else {
        message = "⏳ Level: Elite Breather 🏆🔥";
        statement = "Outstanding! You have exceptional lung capacity.";
        tips = `
            🌊 Experiment with pranayama or freediving techniques – Master your breath control.<br>
            ⏱️ Try interval training – Push your endurance to the next level.<br>
            🎯 Keep inspiring others – Your lungs are in top shape!
        `;
    }

    // Display the message (level) first, then the statement, then tips
    document.getElementById("result").innerHTML = `
        <h3>You lasted ${seconds} seconds!</h3>
        <p>${message}</p>
        <p><strong>${statement}</strong></p>
        <p>${tips}</p>
    `;

    // Transition to shrinking animation AFTER stopping
    let circle = document.querySelector(".circle-container");
    circle.classList.remove("holding");
    circle.classList.add("shrinking");

    // Reset shrinking animation after 3 seconds (Optional)
    setTimeout(() => {
        circle.classList.remove("shrinking");
    }, 3000);
}
