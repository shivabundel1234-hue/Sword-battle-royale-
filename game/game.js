const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fit container
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();
    canvas.width = 900;
    canvas.height = 600;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game Constants
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const PLAYER_SIZE = 30;
const ENEMY_SIZE = 30;
const ATTACK_RANGE = 80;
const NORMAL_DAMAGE = 10;
const POWER_DAMAGE = 25;
const ENEMY_SPEED = 2;
const PLAYER_SPEED = 6;

// Player Object
const player = {
    x: 150,
    y: GAME_HEIGHT / 2,
    size: PLAYER_SIZE,
    color: '#00ffff',
    speed: PLAYER_SPEED,
    hp: 100,
    maxHp: 100,
    attackCooldown: 0,
    isPowerAttacking: false,
    powerCharge: 0,
    maxPowerCharge: 60,
    angle: 0
};

// Game State
let gameState = {
    enemies: [],
    score: 0,
    wave: 1,
    waveEnemyCount: 3,
    gameOver: false,
    targetX: player.x,
    targetY: player.y,
    particles: [],
    isPaused: false
};

// Enemy Factory
function createEnemy(x, y) {
    return {
        x: x,
        y: y,
        size: ENEMY_SIZE,
        color: '#ff4444',
        speed: ENEMY_SPEED + (gameState.wave * 0.3),
        hp: 50 + (gameState.wave * 10),
        maxHp: 50 + (gameState.wave * 10),
        attackCooldown: 0,
        angle: 0
    };
}

// Initialize Wave
function initWave() {
    gameState.enemies = [];
    const enemyCount = gameState.waveEnemyCount + gameState.wave;
    
    for (let i = 0; i < enemyCount; i++) {
        const angle = (i / enemyCount) * Math.PI * 2;
        const distance = 250;
        const x = GAME_WIDTH / 2 + Math.cos(angle) * distance;
        const y = GAME_HEIGHT / 2 + Math.sin(angle) * distance;
        gameState.enemies.push(createEnemy(x, y));
    }
    
    showWaveMessage(`WAVE ${gameState.wave} - ${enemyCount} Enemies!`);
}

function showWaveMessage(text) {
    const waveInfo = document.getElementById('waveInfo');
    waveInfo.textContent = text;
    waveInfo.classList.add('show');
    setTimeout(() => waveInfo.classList.remove('show'), 2000);
}

// Particle System
function createParticle(x, y, color, vx, vy) {
    gameState.particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        life: 30,
        maxLife: 30,
        color: color,
        size: 4
    });
}

function updateParticles() {
    gameState.particles = gameState.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity
        p.life--;
        return p.life > 0;
    });
}

function drawParticles() {
    gameState.particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
    });
}

// Input Handling
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.targetX = (e.clientX - rect.left) * (canvas.width / rect.width);
    gameState.targetY = (e.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    gameState.targetX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    gameState.targetY = (touch.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener('mousedown', () => {
    startPowerAttack();
});

canvas.addEventListener('mouseup', () => {
    performAttack();
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPowerAttack();
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    performAttack();
});

function startPowerAttack() {
    if (player.attackCooldown <= 0 && !gameState.gameOver) {
        player.isPowerAttacking = true;
        player.powerCharge = 0;
    }
}

function performAttack() {
    if (player.isPowerAttacking) {
        const damage = player.powerCharge >= player.maxPowerCharge ? POWER_DAMAGE : NORMAL_DAMAGE;
        player.isPowerAttacking = false;
        
        gameState.enemies.forEach(enemy => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < ATTACK_RANGE) {
                enemy.hp -= damage;
                
                // Create hit particles
                for (let i = 0; i < 5; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 3 + Math.random() * 2;
                    createParticle(
                        enemy.x,
                        enemy.y,
                        '#ff6666',
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    );
                }
                
                // Flash effect
                enemy.flash = 10;
            }
        });
        
        player.attackCooldown = 15;
    }
}

// Player Movement
function movePlayer() {
    const dx = gameState.targetX - player.x;
    const dy = gameState.targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
        player.angle = Math.atan2(dy, dx);
    }
    
    // Boundary check
    player.x = Math.max(player.size / 2, Math.min(GAME_WIDTH - player.size / 2, player.x));
    player.y = Math.max(player.size / 2, Math.min(GAME_HEIGHT - player.size / 2, player.y));
}

// Enemy AI
function updateEnemies() {
    gameState.enemies.forEach((enemy, index) => {
        // Move towards player
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
            enemy.angle = Math.atan2(dy, dx);
        }
        
        // Boundary check
        enemy.x = Math.max(enemy.size / 2, Math.min(GAME_WIDTH - enemy.size / 2, enemy.x));
        enemy.y = Math.max(enemy.size / 2, Math.min(GAME_HEIGHT - enemy.size / 2, enemy.y));
        
        // Attack player if close
        if (distance < 50) {
            player.hp -= 0.4;
            enemy.attackCooldown = 20;
        }
        
        // Remove dead enemies
        if (enemy.hp <= 0) {
            gameState.score += 100 + (gameState.wave * 50);
            createParticle(enemy.x, enemy.y, '#ffff00', 0, -2);
            gameState.enemies.splice(index, 1);
        }
        
        // Flash on hit
        if (enemy.flash) enemy.flash--;
    });
}

// Check Wave Completion
function checkWaveCompletion() {
    if (gameState.enemies.length === 0 && !gameState.waveTransition) {
        gameState.waveTransition = true;
        setTimeout(() => {
            gameState.wave++;
            player.hp = Math.min(player.maxHp, player.hp + 30);
            initWave();
            gameState.waveTransition = false;
        }, 2000);
    }
}

// Drawing Functions
function drawPlayer() {
    // Body
    ctx.fillStyle = player.color;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
    ctx.shadowBlur = 0;
    
    // Sword
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const swordLength = 45;
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(
        player.x + Math.cos(player.angle) * swordLength,
        player.y + Math.sin(player.angle) * swordLength
    );
    ctx.stroke();
    
    // Power charge indicator
    if (player.isPowerAttacking) {
        const chargePercent = Math.min(player.powerCharge / player.maxPowerCharge, 1);
        player.powerCharge++;
        
        ctx.strokeStyle = `rgb(255, ${255 * (1 - chargePercent)}, 0)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x, player.y - 50, 20 + chargePercent * 10, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // HP Bar
    const hpPercent = player.hp / player.maxHp;
    const barWidth = 50;
    const barHeight = 8;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x - barWidth / 2, player.y - 45, barWidth, barHeight);
    
    ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(player.x - barWidth / 2, player.y - 45, barWidth * hpPercent, barHeight);
    
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(player.x - barWidth / 2, player.y - 45, barWidth, barHeight);
}

function drawEnemies() {
    gameState.enemies.forEach(enemy => {
        // Flash effect
        const flashAlpha = enemy.flash ? 0.5 : 0;
        
        // Body
        ctx.fillStyle = enemy.color;
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 1 - flashAlpha;
        ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        
        // Sword
        ctx.strokeStyle = '#ff9900';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const swordLength = 40;
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(
            enemy.x + Math.cos(enemy.angle) * swordLength,
            enemy.y + Math.sin(enemy.angle) * swordLength
        );
        ctx.stroke();
        
        // HP Bar
        const hpPercent = enemy.hp / enemy.maxHp;
        const barWidth = 40;
        const barHeight = 6;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - 35, barWidth, barHeight);
        
        ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - 35, barWidth * hpPercent, barHeight);
        
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1;
        ctx.strokeRect(enemy.x - barWidth / 2, enemy.y - 35, barWidth, barHeight);
    });
}

function drawUI() {
    document.getElementById('playerHp').textContent = Math.max(0, Math.floor(player.hp));
    document.getElementById('wave').textContent = gameState.wave;
    document.getElementById('score').textContent = gameState.score;
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60);
    
    ctx.fillStyle = '#ffff00';
    ctx.font = '32px Arial';
    ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
    ctx.fillText(`Wave Reached: ${gameState.wave}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60);
    
    ctx.fillStyle = '#00ffff';
    ctx.font = '20px Arial';
    ctx.fillText('Refresh the page to play again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120);
    
    ctx.textAlign = 'left';
}

// Main Game Loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'rgba(15, 52, 96, 0.1)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    if (!gameState.gameOver) {
        movePlayer();
        updateEnemies();
        updateParticles();
        checkWaveCompletion();
        
        // Update cooldowns
        if (player.attackCooldown > 0) player.attackCooldown--;
        
        // Check game over
        if (player.hp <= 0) {
            gameState.gameOver = true;
        }
    }
    
    // Draw game
    drawEnemies();
    drawPlayer();
    drawParticles();
    drawUI();
    
    if (gameState.gameOver) {
        drawGameOver();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
initWave();
gameLoop();
