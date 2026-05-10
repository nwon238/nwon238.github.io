// Canvas starfield
const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');
let stars = [], shootingStars = [], W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 3000);
    for (let i = 0; i < count; i++) {
        const type = Math.random();
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: type < 0.7 ? Math.random() * 0.8 + 0.2 : Math.random() * 1.5 + 0.8,
            alpha: Math.random() * 0.6 + 0.2,
            speed: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2,
            color: type < 0.5 ? '#f0eee8' : type < 0.8 ? '#c8d8f8' : '#d4a847'
        });
    }
}

function spawnShootingStar() {
    if (Math.random() < 0.002) {
        const startX = Math.random() * W;
        shootingStars.push({
            x: startX, y: 0,
            vx: (Math.random() - 0.5) * 4 + 2,
            vy: Math.random() * 3 + 2,
            len: Math.random() * 80 + 60,
            alpha: 1,
            life: 1
        });
    }
}

function drawStars(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
        const twinkle = Math.sin(t * s.speed + s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * twinkle;
        ctx.fill();
    });

    // Shooting stars
    shootingStars = shootingStars.filter(ss => ss.life > 0);
    shootingStars.forEach(ss => {
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * ss.len / 4, ss.y - ss.vy * ss.len / 4);
        grad.addColorStop(0, `rgba(240,238,232,${ss.life * 0.9})`);
        grad.addColorStop(1, 'rgba(240,238,232,0)');
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * ss.len / 4, ss.y - ss.vy * ss.len / 4);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = ss.life;
        ctx.stroke();
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.018;
    });
    ctx.globalAlpha = 1;
}

let t = 0;
function loop() {
    t += 0.5;
    spawnShootingStar();
    drawStars(t);
    requestAnimationFrame(loop);
}

resize();
initStars();
loop();
window.addEventListener('resize', () => { resize(); initStars(); });

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, .project-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursor.style.background = '#f0eee8';
        ring.style.width = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = 'rgba(212,168,71,0.7)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '6px';
        cursor.style.height = '6px';
        cursor.style.background = '#d4a847';
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'rgba(212,168,71,0.4)';
    });
});

// Scroll progress
const progressLine = document.getElementById('progressLine');
const indicator = document.getElementById('scrollIndicator');
let hideTimer, reappearTimer;

setTimeout(() => indicator.classList.add('visible'), 2000);

window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressLine.style.width = pct + '%';

    if (window.scrollY > 80) {
        indicator.classList.remove('visible');

        clearTimeout(reappearTimer);
        reappearTimer = setTimeout(() => {
            if (window.scrollY > 80) indicator.classList.add('visible');
        }, 3000);
    } else {
        indicator.classList.add('visible');
    }
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(r => obs.observe(r));
