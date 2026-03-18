const yearEl = document.getElementById("year");
const commandEl = document.getElementById("typed-command");
const outputEl = document.getElementById("command-output");
const progressEl = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sectionEls = [...document.querySelectorAll("main section[id]")];
const backToTopBtn = document.getElementById("backToTop");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const commandFlow = [
  {
    cmd: "whoami",
    output: "Ravipati Venkata Sai Mohan Kumar Bhanu, cybersecurity-focused CSE student.",
  },
  {
    cmd: "show project",
    output: "Anti-malware Extension loaded: AI and signature-based malware detection.",
  },
  {
    cmd: "list certifications",
    output: "CompTIA Security+, Quick Heal DFIR, and CompTIA Network+ (Since Aug 2025).",
  },
];

let flowIndex = 0;
let charIndex = 0;

function typeCommand() {
  const current = commandFlow[flowIndex];
  commandEl.textContent = current.cmd.slice(0, charIndex);
  charIndex += 1;

  if (charIndex <= current.cmd.length) {
    setTimeout(typeCommand, 75);
  } else {
    outputEl.textContent = current.output;
    setTimeout(() => {
      charIndex = 0;
      flowIndex = (flowIndex + 1) % commandFlow.length;
      commandEl.textContent = "";
      outputEl.textContent = "";
      typeCommand();
    }, 2200);
  }
}

typeCommand();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      const finalValue = Number(target.dataset.count || "0");
      let current = 0;
      const increment = Math.max(1, Math.round(finalValue / 35));

      const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
          target.textContent = String(finalValue);
          clearInterval(timer);
          observer.unobserve(target);
          return;
        }
        target.textContent = String(current);
      }, 35);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll(".stat-number").forEach((n) => statObserver.observe(n));

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (y / height) * 100;

  progressEl.style.width = `${Math.min(progress, 100)}%`;

  if (header && y > 12) {
    header.classList.add("is-scrolled");
  } else if (header) {
    header.classList.remove("is-scrolled");
  }

  if (backToTopBtn) {
    backToTopBtn.classList.toggle("visible", y > 260);
  }

  const marker = y + 180;
  let activeId = sectionEls[0]?.id || "";

  sectionEls.forEach((section) => {
    if (section.offsetTop <= marker) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
  });
});

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const chips = document.querySelectorAll(".chip");
const projectCards = document.querySelectorAll(".project-card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((btn) => btn.classList.remove("is-active"));
    chip.classList.add("is-active");

    const selected = chip.dataset.filter;
    projectCards.forEach((card) => {
      const show = selected === "all" || card.dataset.category === selected;
      card.style.display = show ? "block" : "none";
    });
  });
});

const tiltCards = document.querySelectorAll("[data-tilt]");

if (window.matchMedia("(pointer:fine)").matches) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 6;
      card.style.transform = `perspective(850px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(850px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

const magneticTargets = document.querySelectorAll(".btn, .chip, .back-to-top");

if (window.matchMedia("(pointer:fine)").matches) {
  magneticTargets.forEach((el) => {
    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.12}px, ${dy * 0.12}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
}

function spawnSparks(x, y) {
  for (let i = 0; i < 4; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    const offsetX = (Math.random() - 0.5) * 26;
    const offsetY = (Math.random() - 0.5) * 26;
    spark.style.left = `${x + offsetX}px`;
    spark.style.top = `${y + offsetY}px`;
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }
}

document.querySelectorAll(".btn, .chip, .nav a, .back-to-top").forEach((el) => {
  el.addEventListener("click", (event) => {
    spawnSparks(event.clientX, event.clientY);
  });
});

const hexCanvas = document.getElementById("hexCanvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hexCanvas instanceof HTMLCanvasElement) {
  const ctx = hexCanvas.getContext("2d");

  if (ctx) {
    const pointer = {
      x: window.innerWidth * 0.55,
      y: window.innerHeight * 0.35,
      active: false,
    };

    const baseRadius = 40;
    const depth = 11;
    const spacingX = baseRadius * 1.72;
    const spacingY = baseRadius * 1.5 + depth * 0.2;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let lastTime = performance.now();
    let time = 0;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      hexCanvas.width = Math.floor(width * dpr);
      hexCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function getHexPoints(cx, cy, radius) {
      const points = [];
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        points.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        });
      }
      return points;
    }

    function drawPath(points) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i += 1) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
    }

    function distance(ax, ay, bx, by) {
      const dx = ax - bx;
      const dy = ay - by;
      return Math.hypot(dx, dy);
    }

    function pseudoRandom(seed) {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }

    function getRandomGlow(cx, cy, indexSeed) {
      return 0;
    }

    function influenceAt(cx, cy) {
      if (!pointer.active) return 0;
      const pointerRange = 140;
      const pointerDist = distance(cx, cy, pointer.x, pointer.y);
      return Math.max(0, 1 - pointerDist / pointerRange);
    }

    function drawHexPrism(cx, cy, radius, influence, randomGlow, indexSeed) {
      const top = getHexPoints(cx, cy, radius);
      const bottom = top.map((p) => ({ x: p.x, y: p.y + depth }));

      const baseShade = 0.48 + 0.05 * Math.sin(time * 0.9 + indexSeed);
      drawPath(top);
      const topGradient = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
      topGradient.addColorStop(0, `rgba(20, 32, 58, ${baseShade + 0.08})`);
      topGradient.addColorStop(1, `rgba(9, 16, 30, ${baseShade})`);
      ctx.fillStyle = topGradient;
      ctx.fill();

      const visibleFaces = [1, 2, 3];
      visibleFaces.forEach((i) => {
        const next = (i + 1) % 6;
        ctx.beginPath();
        ctx.moveTo(top[i].x, top[i].y);
        ctx.lineTo(top[next].x, top[next].y);
        ctx.lineTo(bottom[next].x, bottom[next].y);
        ctx.lineTo(bottom[i].x, bottom[i].y);
        ctx.closePath();

        const sideGradient = ctx.createLinearGradient(top[i].x, top[i].y, bottom[i].x, bottom[i].y);
        sideGradient.addColorStop(0, "rgba(9, 15, 28, 0.7)");
        sideGradient.addColorStop(1, "rgba(4, 8, 16, 0.9)");
        ctx.fillStyle = sideGradient;
        ctx.fill();
      });

      drawPath(top);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(56, 84, 128, 0.48)";
      ctx.stroke();

      visibleFaces.forEach((i) => {
        const next = (i + 1) % 6;
        ctx.beginPath();
        ctx.moveTo(top[i].x, top[i].y);
        ctx.lineTo(top[next].x, top[next].y);
        ctx.lineTo(bottom[next].x, bottom[next].y);
        ctx.lineTo(bottom[i].x, bottom[i].y);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(20, 34, 54, 0.7)";
        ctx.stroke();
      });

      if (influence > 0.02 || randomGlow > 0.05) {
        // Glow effect removed - keeping geometry only
      }
    }

    function drawHex(cx, cy, radius, indexSeed) {
      const influence = influenceAt(cx, cy);
      const randomGlow = pointer.active ? 0 : getRandomGlow(cx, cy, indexSeed);
      drawHexPrism(cx, cy, radius, influence, randomGlow, indexSeed);
    }

    function drawFrame(now) {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      time += delta;

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "rgba(2, 7, 16, 0.5)");
      bg.addColorStop(1, "rgba(2, 10, 20, 0.82)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      let rowIndex = 0;
      for (let y = -baseRadius; y <= height + baseRadius; y += spacingY) {
        const offsetX = rowIndex % 2 === 0 ? 0 : spacingX / 2;
        let colIndex = 0;

        for (let x = -baseRadius; x <= width + baseRadius; x += spacingX) {
          const cx = x + offsetX;
          const cy = y;
          drawHex(cx, cy, baseRadius, rowIndex * 0.5 + colIndex * 0.3);
          colIndex += 1;
        }

        rowIndex += 1;
      }

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    }

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;

      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    });

    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    document.addEventListener("mouseleave", () => {
      pointer.active = false;

      if (prefersReducedMotion) {
        drawFrame(performance.now());
      }
    });
    resizeCanvas();
    drawFrame(performance.now());

    if (prefersReducedMotion) {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      drawFrame(performance.now());
    }
  }
}
