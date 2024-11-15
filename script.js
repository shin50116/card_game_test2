const gameContainer = document.getElementById("game-container");
const levelDisplay = document.getElementById("level");

let currentLevel = 1;
let oddColor = ""; // 정답 색상
let timerInterval; // 타이머 간격 저장
let startTime; // 시작 시간 저장

// 타이머 표시 초기화
const timerDisplay = document.createElement("p");
timerDisplay.id = "timer";
timerDisplay.textContent = "0.00초";
document.body.insertBefore(timerDisplay, gameContainer);

// 카드 색상 생성 함수
function generateColors(level) {
    const baseColor = getRandomColor();
    oddColor = getDifferentColor(baseColor, level); // 정답 색상 저장

    const colors = Array(50).fill(baseColor);
    const oddIndex = Math.floor(Math.random() * 50);
    colors[oddIndex] = oddColor;

    return colors;
}

// 랜덤 색상 생성
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// 다른 색상 생성 (난이도 증가에 따라 미세한 차이 적용)
function getDifferentColor(baseColor, level) {
    const colorOffset = Math.max(5, 256 - level * 12); // 20단계까지 점진적으로 미세한 차이
    const [r, g, b] = baseColor.match(/\d+/g).map(Number);

    const newR = Math.min(Math.max(r + Math.floor((Math.random() - 0.5) * colorOffset), 0), 255);
    const newG = Math.min(Math.max(g + Math.floor((Math.random() - 0.5) * colorOffset), 0), 255);
    const newB = Math.min(Math.max(b + Math.floor((Math.random() - 0.5) * colorOffset), 0), 255);

    return `rgb(${newR}, ${newG}, ${newB})`;
}

// 게임 초기화
function initGame() {
    gameContainer.innerHTML = "";
    const colors = generateColors(currentLevel);

    colors.forEach((color, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.backgroundColor = color;
        card.addEventListener("click", () => handleCardClick(color));
        gameContainer.appendChild(card);
    });

    // 첫 단계에서 타이머 시작
    if (currentLevel === 1) {
        startTimer();
    }
}

// 카드 클릭 이벤트 핸들러 (정확한 색상 값 비교)
function handleCardClick(color) {
    if (color === oddColor) { // 정답 색상 비교
        if (currentLevel === 20) { // 20단계 클리어 조건
            stopTimer(); // 타이머 정지
            const timeTaken = (Date.now() - startTime) / 1000;
            showPopup(`축하합니다! 모든 단계를 클리어했습니다! ${timeTaken.toFixed(2)}초가 걸렸습니다.`);
        } else {
            currentLevel++;
            levelDisplay.textContent = currentLevel;
            initGame();
        }
    } else {
        alert("틀렸습니다. 다시 시도하세요!");
    }
}

// 타이머 시작
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        timerDisplay.textContent = `${elapsedTime.toFixed(2)}초`;
    }, 10);
}

// 타이머 정지
function stopTimer() {
    clearInterval(timerInterval);
}

// 팝업 표시
function showPopup(message) {
    const popup = document.createElement("div");
    popup.id = "popup";

    const popupContent = document.createElement("div");
    popupContent.id = "popup-content";

    const popupMessage = document.createElement("p");
    popupMessage.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.textContent = "확인";
    closeButton.onclick = () => popup.remove(); // 팝업 제거

    popupContent.appendChild(popupMessage);
    popupContent.appendChild(closeButton);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

// 게임 시작
initGame();
