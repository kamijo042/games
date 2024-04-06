// ゲームキャンバスとコンテキストの取得
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// プレイヤーの設定
var player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    speed: 5
};

// 弾の設定
var bullets = [];
var bulletSpeed = 5;

// キーの状態を保持するオブジェクト
var keys = {};

// 敵の設定
var enemies = [];
var enemySpeed = 2;

// ゲームオーバーのフラグ
var gameOver = false;

// イベントリスナーの追加
document.addEventListener("keydown", function(event) {
    keys[event.keyCode] = true;
});

document.addEventListener("keyup", function(event) {
    delete keys[event.keyCode];
});

// プレイヤーの描画
function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 弾の描画
function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach(function(bullet) {
        ctx.fillRect(bullet.x, bullet.y, 5, 5);
    });
}

// 敵の描画
function drawEnemies() {
    ctx.fillStyle = "green";
    enemies.forEach(function(enemy) {
        ctx.fillRect(enemy.x, enemy.y, 20, 20);
    });
}

// 衝突の判定
function collisionDetection() {
    bullets.forEach(function(bullet, bulletIndex) {
        enemies.forEach(function(enemy, enemyIndex) {
            if (bullet.x < enemy.x + 20 &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + 20 &&
                bullet.y + 5 > enemy.y) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    enemies.forEach(function(enemy) {
        if (player.x < enemy.x + 20 &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + 20 &&
            player.y + player.height > enemy.y) {
            gameOver = true;
        }
    });
}

// ゲームのメインループ
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // プレイヤーの移動
        if (keys[37] && player.x > 0) {
            player.x -= player.speed;
        }
        if (keys[39] && player.x < canvas.width - player.width) {
            player.x += player.speed;
        }

        // 弾の発射
        if (keys[32]) {
            bullets.push({x: player.x + player.width / 2, y: player.y});
        }

        // 弾の移動
        bullets.forEach(function(bullet) {
            bullet.y -= bulletSpeed;
        });

        // 敵の生成
        if (Math.random() < 0.02) {
            enemies.push({x: Math.random() * canvas.width, y: 0});
        }

        // 敵の移動
        enemies.forEach(function(enemy) {
            enemy.y += enemySpeed;
        });

        // 描画
        drawPlayer();
        drawBullets();
        drawEnemies();

        // 衝突判定
        collisionDetection();

        requestAnimationFrame(gameLoop);
    } else {
        // ゲームオーバー
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}

// ゲームの開始
gameLoop();
