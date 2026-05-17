/**
 * ЧИСТЫЙ ДОМ — JavaScript
 * Интерактивность: калькулятор, FAQ, мобильное меню, 3D сцена, анимации
 */

// Локальные шрифты
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Three.js
import * as THREE from "three";

// Стили
import "../css/main.css";

// ============================================
// Мобильное меню
// ============================================
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const burger = document.querySelector(".header__burger");
  menu.classList.toggle("header__mobile-menu--open");
  burger.classList.toggle("header__burger--active");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const burger = document.querySelector(".header__burger");
  menu.classList.remove("header__mobile-menu--open");
  burger.classList.remove("header__burger--active");
}

// ============================================
// Шапка при скролле
// ============================================
function handleHeaderScroll() {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.classList.add("header--scrolled");
  } else {
    header.classList.remove("header--scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll, { passive: true });

// ============================================
// Плавный скролл для якорных ссылок
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ============================================
// FAQ Аккордеон
// ============================================
function toggleFaq(button) {
  const item = button.closest(".faq__item");
  const answer = item.querySelector(".faq__answer");
  const isOpen = item.classList.contains("faq__item--open");

  // Закрываем все остальные плавно
  document.querySelectorAll(".faq__item").forEach(function (el) {
    if (el !== item && el.classList.contains("faq__item--open")) {
      const otherAnswer = el.querySelector(".faq__answer");
      otherAnswer.style.maxHeight = otherAnswer.scrollHeight + "px";
      requestAnimationFrame(function () {
        otherAnswer.style.maxHeight = "0px";
      });
      el.classList.remove("faq__item--open");
    }
  });

  if (!isOpen) {
    // Открываем: сначала сбрасываем, потом ставим точную высоту
    answer.style.maxHeight = "0px";
    requestAnimationFrame(function () {
      answer.style.maxHeight = answer.scrollHeight + "px";
    });
    item.classList.add("faq__item--open");
  } else {
    // Закрываем: сначала фиксируем текущую высоту, потом в 0
    answer.style.maxHeight = answer.scrollHeight + "px";
    requestAnimationFrame(function () {
      answer.style.maxHeight = "0px";
    });
    item.classList.remove("faq__item--open");
  }
}

// Экспортируем глобально, чтобы onclick в HTML работал
window.toggleFaq = toggleFaq;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// ============================================
// Калькулятор
// ============================================
const basePrices = {
  weekly: { 1: 2500, 2: 3500, 3: 4500, 4: 6000 },
  deep: { 1: 4500, 2: 6500, 3: 8500, 4: 11000 },
  renovation: { 1: 7000, 2: 10000, 3: 13000, 4: 17000 },
};

const typeLabels = {
  weekly: "Поддерживающая",
  deep: "Генеральная",
  renovation: "После ремонта",
};

const roomLabels = {
  1: "1 комната",
  2: "2 комнаты",
  3: "3 комнаты",
  4: "4+ комнаты",
};

let currentType = "weekly";
let currentPets = "no";

function selectCleaningType(button) {
  document.querySelectorAll(".calc-form__chip").forEach(function (chip) {
    chip.classList.remove("calc-form__chip--active");
  });
  button.classList.add("calc-form__chip--active");
  currentType = button.getAttribute("data-type");
  calculatePrice();
}

function selectPets(button) {
  document.querySelectorAll(".calc-form__toggle").forEach(function (toggle) {
    toggle.classList.remove("calc-form__toggle--active");
  });
  button.classList.add("calc-form__toggle--active");
  currentPets = button.getAttribute("data-pets");
  calculatePrice();
}

function calculatePrice() {
  const rooms = document.getElementById("roomSelect").value;
  const base = basePrices[currentType][rooms] || 3500;
  const multiplier = currentPets === "yes" ? 1.2 : 1;
  const price = Math.round(base * multiplier);

  // Анимация изменения цены
  const amountEl = document.getElementById("priceAmount");
  animateNumber(amountEl, price);

  // Обновляем тип и комнаты
  document.getElementById("resultType").textContent = typeLabels[currentType];
  document.getElementById("resultRooms").textContent = roomLabels[rooms];
  if (currentPets === "yes") {
    document.getElementById("resultRooms").textContent += " • С животными";
  }

  // Обновляем ссылку на WhatsApp
  const message =
    "Здравствуйте! Хочу заказать уборку:\n" +
    "Тип: " +
    typeLabels[currentType] +
    "\n" +
    "Комнат: " +
    roomLabels[rooms] +
    "\n" +
    "Животные: " +
    (currentPets === "yes" ? "Да" : "Нет") +
    "\n" +
    "Примерная стоимость: " +
    price.toLocaleString("ru-RU") +
    " ₽";

  document.getElementById("orderButton").href =
    "https://wa.me/+79218919258?text=" + encodeURIComponent(message);
}

function animateNumber(element, target) {
  const current = parseInt(element.textContent.replace(/\s/g, "")) || 0;
  const duration = 400;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(current + (target - current) * easeProgress);
    element.textContent = value.toLocaleString("ru-RU");

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

window.selectCleaningType = selectCleaningType;
window.selectPets = selectPets;
window.calculatePrice = calculatePrice;

// ============================================
// Анимация появления при скролле
// ============================================
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    ".service-card, .advantage, .calc-form, .calc-result, .faq__item, .cta__card",
  );

  revealElements.forEach(function (el) {
    el.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

// ============================================
// 3D Сцена (Three.js)
// ============================================
function init3DScene() {
  const container = document.getElementById("hero3d");
  if (!container) return;

  // Three.js импортирован как модуль
  if (!THREE) {
    console.warn("Three.js не загружен");
    return;
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Освещение
  const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight("#FFFFFF", 1.0);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight("#F4F1EC", 0.4);
  dirLight2.position.set(-3, -2, 3);
  scene.add(dirLight2);

  // Материал (синий цвет из CSS переменной)
  const material = new THREE.MeshPhysicalMaterial({
    color: "#4A5CAA",
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  // Объекты
  const objects = [];

  // Икосаэдры
  const spherePositions = [
    { x: 1.5, y: 1.2, z: -1 },
    { x: -1.8, y: -0.5, z: 0.5 },
    { x: 2.2, y: -1.5, z: 1 },
    { x: -0.8, y: 2, z: -0.5 },
  ];

  spherePositions.forEach(function (pos, i) {
    const geometry = new THREE.IcosahedronGeometry(0.8 + i * 0.15, 1);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    scene.add(mesh);
    objects.push({
      mesh: mesh,
      speed: 0.5 + i * 0.2,
      offset: i * 1.5,
    });
  });

  // Кубы
  const cubePositions = [
    { x: -2, y: 0.8, z: 1.5 },
    { x: 1, y: -1.8, z: -0.5 },
    { x: 3, y: 0.5, z: 0.8 },
    { x: -0.5, y: -0.8, z: 2 },
  ];

  cubePositions.forEach(function (pos, i) {
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    scene.add(mesh);
    objects.push({
      mesh: mesh,
      speed: 0.4 + i * 0.15,
      offset: i * 2 + 0.5,
    });
  });

  // Анимация
  const clock = new THREE.Clock();
  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    objects.forEach(function (obj) {
      obj.mesh.rotation.x += 0.005;
      obj.mesh.rotation.y += 0.01;
      obj.mesh.position.y += Math.sin(time * obj.speed + obj.offset) * 0.002;
      obj.mesh.position.x +=
        Math.cos(time * obj.speed * 0.5 + obj.offset) * 0.001;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  window.addEventListener("resize", function () {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ============================================
// Инициализация
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  calculatePrice();
  initRevealAnimations();
  init3DScene();
});
