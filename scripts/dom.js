const startBtn = document.getElementById("start-btn");
const msgBox = document.getElementById("message-box");

// displays message after game over
const displayFinalMessage = () => {
    const h1 = document.createElement("h1");
    const p = document.createElement("p");
    const githubBtn = document.createElement("a");

    h1.innerText = userWins ? "Congrats ! You won ! 🎉" : "Computer won 😥";
    p.innerText = "Thank you for playing ! Find this game on Github.";
    githubBtn.innerText = "Repo on GitHub";
    githubBtn.href = "https://github.com/kecav/flappy-birds-js/";

    msgBox.innerHTML = "";
    msgBox.append(h1, p, githubBtn);
    msgBox.style.display = "block";
};

// starts game on button press
startBtn.addEventListener("click", () => {
    msgBox.style.display = "none";
    gamePlay();
});