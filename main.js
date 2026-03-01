/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║        ♥  NOTRE AVENTURE — Romantic Platformer  ♥        ║
 * ║   Moteur : Phaser 3 | 100% statique | GitHub Pages OK    ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * PERSONNALISATION RAPIDE :
 *   → messagesSouvenirs  : tableau des messages courts (ligne ~20)
 *   → messageFinal       : message affiché à la victoire  (ligne ~35)
 *   → PLAYER_SPRITE      : chemin vers ton image joueur   (ligne ~43)
 */

// ═══════════════════════════════════════════════════════════
//  💬  MESSAGES PERSONNALISABLES
// ═══════════════════════════════════════════════════════════

const messagesSouvenirs = [
  "Notre premier fou rire 😄",
  "Ton sourire me calme instantanément 😊",
  "Ce soir où on a regardé les étoiles 🌟",
  "Ta voix quand tu rigoles 🎶",
  "Le jour où tout a commencé ❤️",
  "Nos petits rituels du matin ☕",
  "Quand tu prends ma main sans raison 🤝",
  "Ton courage qui m'inspire chaque jour 💪",
  "Ces fous rires à 3h du matin 🌙",
  "Chaque je t'aime qui compte double 💕",
  "Nos projets qui me font vibrer 🌈",
  "Toi, simplement toi. 🌸",
];

const messageFinal =
  "Tu as traversé chaque obstacle avec moi, comme dans la vraie vie.\n" +
  "Merci d'être mon aventure préférée. ♥\n" +
  "Je t'aime plus que tous les niveaux du monde.";

// ═══════════════════════════════════════════════════════════
//  ⚙️  CONFIG TECHNIQUE
// ═══════════════════════════════════════════════════════════

const PLAYER_SPRITE = './assets/player.png';

const GAME_W        = 800;
const GAME_H        = 450;
const LEVEL_W       = 5000;
const LEVEL_H       = 450;
const GRAVITY       = 800;
const PLAYER_SPEED  = 220;
const JUMP_VELOCITY = -520;
const MSG_DURATION  = 2800;

// ═══════════════════════════════════════════════════════════
//  🎨  PALETTE DE COULEURS
// ═══════════════════════════════════════════════════════════
const COL = {
  PLATFORM:   0x7b2d8b,
  PLATFORM_T: 0xd46adf,
  SPIKE:      0xff3344,
  ENEMY:      0xff6622,
  ENEMY_EYE:  0xffffff,
  HEART:      0xff2266,
  HEART_GLOW: 0xff99bb,
  STAR:       0xffe566,
  LETTER_BG:  0xff69b4,
  FINAL:      0xff2266,
  FINAL_GLOW: 0xffaad4,
  UI_BG:      0x1a0030,
  MSG_BG:     0x5a0070,
};

// ═══════════════════════════════════════════════════════════
//  🗺️  DONNÉES DU NIVEAU
// ═══════════════════════════════════════════════════════════

const PLATFORMS = [
  [0,    410, 900,  40],
  [950,  410, 600,  40],
  [1600, 410, 500,  40],
  [2150, 410, 800,  40],
  [3000, 410, 700,  40],
  [3750, 410, 600,  40],
  [4400, 410, 600,  40],
  [300,  310, 180,  18],
  [560,  250, 160,  18],
  [800,  190, 200,  18],
  [1050, 280, 180,  18],
  [1300, 220, 160,  18],
  [1550, 310, 140,  18],
  [1750, 240, 200,  18],
  [2050, 180, 180,  18],
  [2300, 270, 160,  18],
  [2500, 200, 180,  18],
  [2700, 310, 160,  18],
  [2900, 240, 200,  18],
  [3100, 180, 160,  18],
  [3350, 290, 180,  18],
  [3600, 210, 200,  18],
  [3800, 310, 160,  18],
  [4000, 240, 200,  18],
  [4200, 160, 180,  18],
  [4450, 280, 160,  18],
  [4700, 200, 180,  18],
  [4850, 310, 200,  18],
];

const ENEMIES = [
  [620,  390, 550,  750],
  [1100, 260, 1050, 1220],
  [1900, 390, 1800, 2050],
  [2400, 180, 2300, 2480],
  [2800, 390, 2700, 2960],
  [3200, 160, 3100, 3330],
  [3700, 390, 3600, 3850],
  [4100, 220, 4000, 4180],
  [4600, 390, 4450, 4750],
];

const SPIKES = [
  [870,  394],
  [1560, 394],
  [2140, 394],
  [2990, 394],
  [3740, 394],
  [4390, 394],
];

const SOUVENIRS_DATA = [
  [330,  285, 'heart'],
  [820,  165, 'star'],
  [1080, 255, 'heart'],
  [1560, 285, 'letter'],
  [2070, 155, 'heart'],
  [2510, 175, 'star'],
  [2920, 215, 'heart'],
  [3120, 155, 'letter'],
  [3620, 185, 'heart'],
  [4010, 215, 'star'],
  [4210, 135, 'heart'],
  [4720, 175, 'heart'],
];

const FINAL_HEART = { x: 4930, y: 260 };

// ═══════════════════════════════════════════════════════════
//  🎮  SCENE PRINCIPALE
// ═══════════════════════════════════════════════════════════

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  preload() {
    this.load.image('player', PLAYER_SPRITE);
    this.load.on('loaderror', (file) => {
      if (file.key === 'player') this._playerLoadFailed = true;
    });
  }

  create() {
    this._score      = 0;
    this._souvenirs  = 0;
    this._totalSouv  = SOUVENIRS_DATA.length;
    this._gameOver   = false;
    this._won        = false;
    this._msgTimer   = null;

    this._buildWorld();
    this._buildPlayer();
    this._buildSouvenirs();
    this._buildFinalHeart();
    this._buildUI();
    this._setupCamera();
    this._setupControls();
    this._setupCollisions();
  }

  _buildWorld() {
    // Fond dégradé violet nuit
    const bg = this.add.graphics();
    for (let y = 0; y < LEVEL_H; y++) {
      const t = y / LEVEL_H;
      const r = Phaser.Math.Linear(0x0d, 0x3d, t);
      const b = Phaser.Math.Linear(0x1a, 0x50, t);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, 0, b), 1);
      bg.fillRect(0, y, LEVEL_W, 1);
    }

    // Étoiles parallaxe
    const stars = this.add.graphics();
    stars.setScrollFactor(0.2);
    for (let i = 0; i < 180; i++) {
      const sx    = Phaser.Math.Between(0, LEVEL_W);
      const sy    = Phaser.Math.Between(0, LEVEL_H * 0.75);
      const size  = Math.random() < 0.2 ? 2 : 1;
      const alpha = 0.4 + Math.random() * 0.6;
      stars.fillStyle(0xffffff, alpha);
      stars.fillCircle(sx, sy, size);
    }

    // Plateformes
    this._platforms = this.physics.add.staticGroup();
    PLATFORMS.forEach(([px, py, pw, ph]) => {
      const g = this.add.graphics();
      g.fillStyle(COL.PLATFORM, 1);
      g.fillRect(0, 0, pw, ph);
      g.fillStyle(COL.PLATFORM_T, 1);
      g.fillRect(0, 0, pw, 4);
      g.fillStyle(COL.PLATFORM_T, 0.3);
      for (let dx = 10; dx < pw - 10; dx += 20) {
        g.fillRect(dx, ph - 6, 8, 3);
      }
      g.generateTexture(`plat_${px}_${py}`, pw, ph);
      g.destroy();
      const plat = this._platforms.create(px + pw / 2, py + ph / 2, `plat_${px}_${py}`);
      plat.setDisplaySize(pw, ph);
      plat.refreshBody();
    });

    // Piques
    this._spikes = this.physics.add.staticGroup();
    SPIKES.forEach(([sx, sy]) => {
      const g = this.add.graphics();
      g.fillStyle(COL.SPIKE, 1);
      g.fillTriangle(0, 16, 16, 0, 32, 16);
      g.generateTexture(`spike_${sx}_${sy}`, 32, 16);
      g.destroy();
      const sp = this._spikes.create(sx + 16, sy + 8, `spike_${sx}_${sy}`);
      sp.setDisplaySize(32, 16);
      sp.refreshBody();
    });

    // Ennemis
    this._enemies   = this.physics.add.group();
    this._enemyData = [];
    ENEMIES.forEach(([ex, ey, el, er]) => {
      const g = this.add.graphics();
      g.fillStyle(COL.ENEMY, 1);
      g.fillRoundedRect(0, 0, 36, 36, 6);
      g.fillStyle(COL.ENEMY_EYE, 1);
      g.fillCircle(10, 12, 5);
      g.fillCircle(26, 12, 5);
      g.fillStyle(0x000000, 1);
      g.fillCircle(11, 12, 2.5);
      g.fillCircle(27, 12, 2.5);
      g.lineStyle(2, 0x000000, 1);
      g.beginPath(); g.moveTo(6, 6);  g.lineTo(15, 9);  g.strokePath();
      g.beginPath(); g.moveTo(21, 9); g.lineTo(30, 6);  g.strokePath();
      g.generateTexture(`enemy_${ex}`, 36, 36);
      g.destroy();
      const en = this._enemies.create(ex, ey - 18, `enemy_${ex}`);
      en.setDisplaySize(36, 36);
      en.setGravityY(GRAVITY);
      en.setVelocityX(-80);
      en.setCollideWorldBounds(false);
      this._enemyData.push({ sprite: en, left: el, right: er, dir: -1 });
    });
  }

  _buildPlayer() {
    if (this._playerLoadFailed || !this.textures.exists('player')) {
      const g = this.add.graphics();
      g.fillStyle(0xff69b4, 1);
      g.fillRoundedRect(4, 10, 28, 30, 5);
      g.fillStyle(0xffd699, 1);
      g.fillCircle(18, 8, 10);
      g.fillStyle(0x333333, 1);
      g.fillCircle(14, 7, 2.5);
      g.fillCircle(22, 7, 2.5);
      g.lineStyle(1.5, 0xcc3366, 1);
      g.beginPath();
      g.arc(18, 11, 4, 0.3, Math.PI - 0.3);
      g.strokePath();
      g.fillStyle(0xaa4400, 1);
      g.fillRect(8, 0, 20, 5);
      g.fillRect(6, 5, 6, 4);
      g.fillRect(24, 5, 6, 4);
      g.generateTexture('player', 36, 40);
      g.destroy();
    }
    this._player = this.physics.add.sprite(80, 360, 'player');
    this._player.setDisplaySize(36, 40);
    this._player.setCollideWorldBounds(false);
    this._player.setGravityY(GRAVITY);
    this._player.setDepth(10);
    this.tweens.add({
      targets: this._player,
      scaleX: { from: 1, to: 1.04 },
      scaleY: { from: 1, to: 0.97 },
      yoyo: true, repeat: -1, duration: 600,
      ease: 'Sine.easeInOut',
    });
  }

  _buildSouvenirs() {
    this._souvenirGroup = this.physics.add.staticGroup();
    SOUVENIRS_DATA.forEach(([cx, cy, type], index) => {
      const key = `souvenir_${index}`;
      const g   = this.add.graphics();

      if (type === 'heart') {
        g.fillStyle(COL.HEART, 1);
        g.beginPath();
        g.moveTo(16, 24);
        g.bezierCurveTo(0, 14, 0, 4, 8, 4);
        g.bezierCurveTo(12, 4, 16, 8, 16, 8);
        g.bezierCurveTo(16, 8, 20, 4, 24, 4);
        g.bezierCurveTo(32, 4, 32, 14, 16, 24);
        g.fillPath();
        g.fillStyle(0xffffff, 0.35);
        g.fillCircle(11, 9, 3);
        g.generateTexture(key, 32, 28);

      } else if (type === 'star') {
        g.fillStyle(COL.STAR, 1);
        const cx2 = 16, cy2 = 16, outerR = 14, innerR = 6, pts = 5;
        g.beginPath();
        for (let i = 0; i < pts * 2; i++) {
          const angle = (i * Math.PI) / pts - Math.PI / 2;
          const r     = i % 2 === 0 ? outerR : innerR;
          const x     = cx2 + r * Math.cos(angle);
          const y     = cy2 + r * Math.sin(angle);
          i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.closePath(); g.fillPath();
        g.fillStyle(0xffffff, 0.4);
        g.fillCircle(13, 12, 3);
        g.generateTexture(key, 32, 32);

      } else {
        g.fillStyle(COL.LETTER_BG, 1);
        g.fillRoundedRect(0, 4, 30, 22, 3);
        g.fillStyle(0xff1493, 1);
        g.fillTriangle(0, 4, 15, 16, 30, 4);
        g.lineStyle(1, 0xffffff, 0.5);
        g.beginPath(); g.moveTo(4, 14); g.lineTo(26, 14); g.strokePath();
        g.beginPath(); g.moveTo(4, 20); g.lineTo(26, 20); g.strokePath();
        g.generateTexture(key, 30, 26);
      }

      g.destroy();
      const sv = this._souvenirGroup.create(cx, cy, key);
      sv.setData('type', type);
      sv.setData('idx', index);
      sv.refreshBody();
      this.tweens.add({
        targets: sv, y: cy - 8, yoyo: true, repeat: -1,
        duration: 900 + index * 60, ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: sv, alpha: { from: 0.8, to: 1 },
        yoyo: true, repeat: -1, duration: 600,
      });
    });
  }

  _buildFinalHeart() {
    const { x, y } = FINAL_HEART;
    const g = this.add.graphics();
    for (let r = 60; r > 0; r -= 10) {
      g.fillStyle(COL.FINAL_GLOW, 0.04);
      g.fillCircle(40, 40, r);
    }
    g.fillStyle(COL.FINAL, 1);
    g.beginPath();
    g.moveTo(40, 65);
    g.bezierCurveTo(10, 45, 5, 20, 18, 15);
    g.bezierCurveTo(28, 10, 40, 20, 40, 20);
    g.bezierCurveTo(40, 20, 52, 10, 62, 15);
    g.bezierCurveTo(75, 20, 70, 45, 40, 65);
    g.fillPath();
    g.fillStyle(0xffffff, 0.3);
    g.fillCircle(28, 23, 6);
    g.generateTexture('finalHeart', 80, 75);
    g.destroy();
    this._finalHeart = this.physics.add.staticSprite(x, y, 'finalHeart');
    this._finalHeart.setDepth(5);
    this.tweens.add({
      targets: this._finalHeart,
      scaleX: { from: 1, to: 1.12 },
      scaleY: { from: 1, to: 1.12 },
      yoyo: true, repeat: -1, duration: 700,
      ease: 'Sine.easeInOut',
    });
    this._heartAngle = 0;
  }

  _buildUI() {
    this._uiBg = this.add.graphics();
    this._uiBg.setScrollFactor(0).setDepth(20);
    this._uiBg.fillStyle(COL.UI_BG, 0.75);
    this._uiBg.fillRoundedRect(8, 8, 300, 44, 8);

    this._scoreTxt = this.add.text(20, 16, 'Score : 0', {
      fontSize: '16px', fill: '#ffe0f0', fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(21);

    this._souvTxt = this.add.text(170, 16, `0 / ${this._totalSouv}`, {
      fontSize: '16px', fill: '#ffe0f0',
    }).setScrollFactor(0).setDepth(21);

    this._msgBg = this.add.graphics();
    this._msgBg.setScrollFactor(0).setDepth(22).setAlpha(0);

    this._msgTxt = this.add.text(GAME_W / 2, GAME_H - 45, '', {
      fontSize: '15px', fill: '#ffffff', fontStyle: 'italic',
      align: 'center', wordWrap: { width: GAME_W - 60 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(23).setAlpha(0);

    this.add.text(GAME_W - 10, 16,
      'Fleches : Bouger   Espace : Sauter   R : Rejouer',
      { fontSize: '11px', fill: '#aa88aa' }
    ).setOrigin(1, 0).setScrollFactor(0).setDepth(21);
  }

  _setupCamera() {
    this.cameras.main.setBounds(0, 0, LEVEL_W, LEVEL_H);
    this.cameras.main.startFollow(this._player, true, 0.1, 0.1);
    this.physics.world.setBounds(0, 0, LEVEL_W, LEVEL_H + 200);
  }

  _setupControls() {
    this._cursors = this.input.keyboard.createCursorKeys();
    this._keyR    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  _setupCollisions() {
    this.physics.add.collider(this._player, this._platforms);
    this.physics.add.collider(this._enemies, this._platforms);
    this.physics.add.overlap(this._player, this._souvenirGroup, this._collectSouvenir, null, this);
    this.physics.add.overlap(this._player, this._spikes,        this._hitSpike,        null, this);
    this.physics.add.overlap(this._player, this._enemies,       this._hitEnemy,        null, this);
    this.physics.add.overlap(this._player, this._finalHeart,    this._win,             null, this);
  }

  update() {
    if (this._gameOver || this._won) {
      if (Phaser.Input.Keyboard.JustDown(this._keyR)) this._restart();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this._keyR)) { this._restart(); return; }

    const { left, right, space } = this._cursors;
    const onGround = this._player.body.blocked.down;

    if (left.isDown) {
      this._player.setVelocityX(-PLAYER_SPEED);
      this._player.setFlipX(true);
    } else if (right.isDown) {
      this._player.setVelocityX(PLAYER_SPEED);
      this._player.setFlipX(false);
    } else {
      this._player.setVelocityX(this._player.body.velocity.x * 0.82);
    }

    if ((Phaser.Input.Keyboard.JustDown(space) ||
         Phaser.Input.Keyboard.JustDown(this._cursors.up)) && onGround) {
      this._player.setVelocityY(JUMP_VELOCITY);
      this._spawnJumpParticles();
    }

    if (this._player.y > LEVEL_H + 100) this._hitSpike();

    this._updateEnemies();
    this._updateHeartParticles();
  }

  _updateEnemies() {
    this._enemyData.forEach(data => {
      const { sprite, left, right } = data;
      if (sprite.active) {
        if (sprite.x < left)  { sprite.setVelocityX(80);  sprite.setFlipX(true);  data.dir =  1; }
        if (sprite.x > right) { sprite.setVelocityX(-80); sprite.setFlipX(false); data.dir = -1; }
      }
    });
  }

  _spawnJumpParticles() {
    const px = this._player.x;
    const py = this._player.y + 18;
    for (let i = 0; i < 6; i++) {
      const p = this.add.graphics();
      p.fillStyle(COL.HEART_GLOW, 0.9);
      p.fillCircle(0, 0, 4);
      p.setPosition(px + Phaser.Math.Between(-12, 12), py);
      p.setDepth(8);
      this.tweens.add({
        targets: p,
        x: p.x + Phaser.Math.Between(-20, 20),
        y: py + Phaser.Math.Between(-25, 5),
        alpha: 0, scaleX: 0.2, scaleY: 0.2,
        duration: 400, ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
  }

  _updateHeartParticles() {
    this._heartAngle += 0.04;
    const { x, y } = FINAL_HEART;
    if (Math.random() < 0.15) {
      const angle = Math.random() * Math.PI * 2;
      const r     = 50 + Math.random() * 20;
      const px2   = x + Math.cos(angle) * r;
      const py2   = y + Math.sin(angle) * r;
      const size  = 1.5 + Math.random() * 2;
      const p = this.add.graphics();
      p.fillStyle(COL.FINAL_GLOW, 0.8);
      p.fillCircle(0, 0, size);
      p.setPosition(px2, py2);
      p.setDepth(4);
      this.tweens.add({
        targets: p, y: py2 - 20, alpha: 0,
        duration: 900 + Math.random() * 600,
        ease: 'Power1', onComplete: () => p.destroy(),
      });
    }
  }

  _collectSouvenir(player, souvenir) {
    if (!souvenir.active) return;
    const idx  = souvenir.getData('idx');
    const type = souvenir.getData('type');
    const pts  = type === 'heart' ? 100 : type === 'star' ? 150 : 120;
    this._score     += pts;
    this._souvenirs += 1;
    this._burstEffect(souvenir.x, souvenir.y,
      type === 'heart' ? COL.HEART : type === 'star' ? COL.STAR : COL.LETTER_BG);
    souvenir.disableBody(true, true);
    this._scoreTxt.setText(`Score : ${this._score}`);
    this._souvTxt.setText(`${this._souvenirs} / ${this._totalSouv}`);
    const msg = messagesSouvenirs[idx % messagesSouvenirs.length];
    this._showMessage(msg);
  }

  _burstEffect(px, py, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 60 + Math.random() * 80;
      const p = this.add.graphics();
      p.fillStyle(color, 1);
      p.fillCircle(0, 0, 3 + Math.random() * 3);
      p.setPosition(px, py);
      p.setDepth(15);
      this.tweens.add({
        targets: p,
        x: px + Math.cos(angle) * speed,
        y: py + Math.sin(angle) * speed,
        alpha: 0, scaleX: 0.1, scaleY: 0.1,
        duration: 500 + Math.random() * 300,
        ease: 'Power2', onComplete: () => p.destroy(),
      });
    }
  }

  _showMessage(text) {
    if (this._msgTimer) { this._msgTimer.remove(); this._msgTimer = null; }
    this._msgTxt.setText(text);
    this._msgTxt.setAlpha(1);
    const tw = this._msgTxt.width + 30;
    const th = this._msgTxt.height + 16;
    this._msgBg.clear();
    this._msgBg.fillStyle(COL.MSG_BG, 0.85);
    this._msgBg.fillRoundedRect(GAME_W / 2 - tw / 2, GAME_H - 45 - th / 2, tw, th, 10);
    this._msgBg.lineStyle(1.5, COL.HEART_GLOW, 0.8);
    this._msgBg.strokeRoundedRect(GAME_W / 2 - tw / 2, GAME_H - 45 - th / 2, tw, th, 10);
    this._msgBg.setAlpha(1);
    this._msgTimer = this.time.delayedCall(MSG_DURATION, () => {
      this.tweens.add({ targets: [this._msgTxt, this._msgBg], alpha: 0, duration: 500 });
    });
  }

  _hitSpike() {
    if (this._gameOver || this._won) return;
    this._gameOver = true;
    this._player.setVelocity(0);
    this._player.setActive(false).setVisible(false);
    this._burstEffect(this._player.x, this._player.y, COL.SPIKE);
    this.time.delayedCall(600, () => {
      showOverlay(
        'Game Over',
        'Score : ' + this._score + '  |  Souvenirs : ' + this._souvenirs + '/' + this._totalSouv,
        'On recommence ensemble\nChaque chute est une nouvelle chance de s\'elever.',
        false
      );
    });
  }

  _hitEnemy(player, enemy) {
    if (this._gameOver || this._won) return;
    const py   = player.body.y + player.body.height;
    const ey   = enemy.body.y;
    const diff = py - ey;
    if (diff < 16 && player.body.velocity.y > 0) {
      this._burstEffect(enemy.x, enemy.y, COL.ENEMY);
      enemy.disableBody(true, true);
      this._score += 200;
      this._scoreTxt.setText('Score : ' + this._score);
      player.setVelocityY(JUMP_VELOCITY * 0.6);
      this._showMessage('Bravo, tu l\'as eu !');
    } else {
      this._hitSpike();
    }
  }

  _win() {
    if (this._gameOver || this._won) return;
    this._won = true;
    this._player.setVelocity(0);
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 80, () => {
        this._burstEffect(
          this._player.x + Phaser.Math.Between(-50, 50),
          this._player.y + Phaser.Math.Between(-50, 20),
          COL.HEART
        );
      });
    }
    this.time.delayedCall(1000, () => {
      showOverlay(
        'Bravo, Mon Amour !',
        'Score final : ' + this._score + '  |  Souvenirs : ' + this._souvenirs + '/' + this._totalSouv,
        messageFinal,
        true
      );
    });
  }

  _restart() {
    hideOverlay();
    this._gameOver = false;
    this._won      = false;
    this.scene.restart();
  }
}

// ═══════════════════════════════════════════════════════════
//  OVERLAY HTML
// ═══════════════════════════════════════════════════════════

function showOverlay(title, subtitle, message, isWin) {
  document.getElementById('overlay-title').textContent   = title;
  document.getElementById('overlay-subtitle').textContent = subtitle;
  document.getElementById('overlay-message').textContent  = message;
  const box = document.getElementById('overlay-box');
  box.style.borderColor = isWin ? '#ffdd00' : '#ff4466';
  box.style.boxShadow   = isWin
    ? '0 0 50px rgba(255,220,0,0.6), inset 0 0 30px rgba(255,220,0,0.1)'
    : '0 0 40px rgba(255,50,70,0.5), inset 0 0 30px rgba(255,50,70,0.1)';
  document.getElementById('overlay').classList.add('show');
}

function hideOverlay() {
  document.getElementById('overlay').classList.remove('show');
}

// ═══════════════════════════════════════════════════════════
//  INITIALISATION PHASER
// ═══════════════════════════════════════════════════════════

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#1a0020',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width:  GAME_W,
    height: GAME_H,
    min: { width: 320,  height: 180  },
    max: { width: 1920, height: 1080 },
  },
};

const game = new Phaser.Game(config);

document.getElementById('btn-replay').addEventListener('click', () => {
  hideOverlay();
  const scene = game.scene.getScene('GameScene');
  if (scene) { scene._gameOver = false; scene._won = false; scene.scene.restart(); }
});

