// Anniversary Game 2025 - JavaScript functionality
class AnniversaryGame {
    constructor() {
        this.score = 0;
        this.gameStarted = false;
        this.heartsCount = 12;
        this.clickedHearts = 0;
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Get DOM elements
        this.startBtn = document.getElementById('start-btn');
        this.scoreElement = document.getElementById('score');
        this.gameBoard = document.getElementById('game-board');
        this.gameContent = document.querySelector('.game-content');
        this.heartsContainer = document.getElementById('hearts-container');
        
        // Add event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        
        console.log('Anniversary Game initialized!');
    }
    
    startGame() {
        this.gameStarted = true;
        this.score = 0;
        this.clickedHearts = 0;
        
        // Hide start content and show game board
        this.gameContent.style.display = 'none';
        this.gameBoard.style.display = 'block';
        
        // Generate hearts
        this.generateHearts();
        
        console.log('Game started!');
    }
    
    generateHearts() {
        // Clear existing hearts
        this.heartsContainer.innerHTML = '';
        
        // Create hearts
        for (let i = 0; i < this.heartsCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.dataset.heartId = i;
            
            // Add click event listener
            heart.addEventListener('click', (e) => this.clickHeart(e));
            
            this.heartsContainer.appendChild(heart);
        }
    }
    
    clickHeart(event) {
        const heart = event.target;
        
        // Prevent clicking the same heart multiple times
        if (heart.classList.contains('clicked')) {
            return;
        }
        
        // Mark heart as clicked
        heart.classList.add('clicked');
        this.clickedHearts++;
        
        // Update score
        this.score += 10;
        this.updateScore();
        
        // Add some celebration effects
        this.createFloatingPoints(event);
        
        // Check if all hearts are clicked
        if (this.clickedHearts >= this.heartsCount) {
            setTimeout(() => this.gameComplete(), 500);
        }
        
        console.log(`Heart clicked! Score: ${this.score}`);
    }
    
    createFloatingPoints(event) {
        const points = document.createElement('div');
        points.textContent = '+10';
        points.style.cssText = `
            position: absolute;
            color: #48bb78;
            font-weight: bold;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
        
        // Position relative to click
        const rect = event.target.getBoundingClientRect();
        points.style.left = rect.left + 'px';
        points.style.top = rect.top + 'px';
        
        document.body.appendChild(points);
        
        // Remove after animation
        setTimeout(() => {
            if (points.parentNode) {
                points.parentNode.removeChild(points);
            }
        }, 1000);
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        
        // Add a little animation to the score
        this.scoreElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.scoreElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    gameComplete() {
        // Show completion message
        const completionMessage = document.createElement('div');
        completionMessage.innerHTML = `
            <h3 style="color: #48bb78; margin-bottom: 1rem;">Congratulations! 🎉</h3>
            <p style="margin-bottom: 1rem;">You found all the hearts!</p>
            <p style="margin-bottom: 2rem;">Final Score: ${this.score}</p>
            <button class="btn primary" onclick="game.resetGame()">Play Again</button>
        `;
        completionMessage.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            text-align: center;
        `;
        
        // Replace game board content
        this.gameBoard.innerHTML = '';
        this.gameBoard.appendChild(completionMessage);
        
        console.log('Game completed!');
    }
    
    resetGame() {
        this.gameStarted = false;
        this.score = 0;
        this.clickedHearts = 0;
        
        // Reset UI
        this.gameContent.style.display = 'block';
        this.gameBoard.style.display = 'none';
        this.updateScore();
        
        console.log('Game reset!');
    }
    
    // Utility method to add special anniversary messages
    showAnniversaryMessage() {
        const messages = [
            "Every moment with you is special! 💕",
            "Here's to many more anniversaries together! 🥂",
            "You make every day feel like a celebration! 🎊",
            "Love grows stronger with each passing year! 💖"
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Create a temporary message element
        const messageDiv = document.createElement('div');
        messageDiv.textContent = randomMessage;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-weight: bold;
            z-index: 1000;
            animation: slideDown 3s ease-in-out forwards;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove after animation
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
    
    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
        20%, 80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new AnniversaryGame();
    
    // Show a welcome message after a short delay
    setTimeout(() => {
        game.showAnniversaryMessage();
    }, 2000);
});

// Add some interactive features
document.addEventListener('keydown', (event) => {
    // Press 'R' to reset game
    if (event.key.toLowerCase() === 'r' && game.gameStarted) {
        game.resetGame();
    }
    
    // Press 'M' to show anniversary message
    if (event.key.toLowerCase() === 'm') {
        game.showAnniversaryMessage();
    }
});

// Export for global access (useful for debugging)
window.AnniversaryGame = AnniversaryGame;