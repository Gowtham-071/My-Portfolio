// ==================== 3D CANVAS GLOBE - FIXED ====================
document.addEventListener('DOMContentLoaded', function() {
  
  const canvas = document.getElementById('skillGlobe');
  if (!canvas) {
    console.error('❌ Canvas element not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  const size = 500;
  canvas.width = size;
  canvas.height = size;
  
  console.log('✅ Canvas initialized:', size, 'x', size);
  
  // Programming language badges for globe
  const badges = [
    { name: 'Python', url: 'https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54' },
    { name: 'Java', url: 'https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white' },
    { name: 'JavaScript', url: 'https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E' },
    { name: 'HTML5', url: 'https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white' },
    { name: 'CSS3', url: 'https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white' },
    { name: 'SQL', url: 'https://img.shields.io/badge/SQL-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white' },
    { name: 'C', url: 'https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white' },
    { name: 'NumPy', url: 'https://img.shields.io/badge/numpy-013243.svg?style=for-the-badge&logo=numpy&logoColor=white' },
    { name: 'Pandas', url: 'https://img.shields.io/badge/pandas-150458.svg?style=for-the-badge&logo=pandas&logoColor=white' },
    { name: 'TensorFlow', url: 'https://img.shields.io/badge/TensorFlow-FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white' },
    { name: 'Flask', url: 'https://img.shields.io/badge/flask-000.svg?style=for-the-badge&logo=flask&logoColor=white' },
    { name: 'MySQL', url: 'https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white' },
    { name: 'MongoDB', url: 'https://img.shields.io/badge/MongoDB-4ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white' },
    { name: 'GCP', url: 'https://img.shields.io/badge/GoogleCloud-4285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white' },
    { name: 'Docker', url: 'https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white' }
  ];
  
  const icons = [];
  const loadedImages = [];
  const radius = 180;
  let rotationX = 0.1;
  let rotationY = 0;
  let autoRotate = true;
  let imagesLoaded = 0;
  
  // Load badge images
  badges.forEach((badge, index) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImages[index] = img;
      imagesLoaded++;
      console.log(`✅ Image loaded: ${badge.name} (${imagesLoaded}/${badges.length})`);
    };
    img.onerror = () => {
      console.error(`❌ Failed to load: ${badge.name}`);
    };
    img.src = badge.url;
    
    // Calculate 3D position using Fibonacci sphere
    const offset = 2 / badges.length;
    const increment = Math.PI * (3 - Math.sqrt(5));
    
    const y = index * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = index * increment;
    
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    
    icons.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      index: index
    });
  });
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, size, size);
    
    if (autoRotate) {
      rotationY += 0.005;
    }
    
    // Sort by Z for proper layering
    const sorted = icons.map((icon, i) => {
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      
      // Rotate around Y axis
      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      
      // Rotate around X axis
      const rotatedY = icon.y * cosX - rotatedZ * sinX;
      const finalZ = icon.y * sinX + rotatedZ * cosX;
      
      return { ...icon, rotatedX, rotatedY, finalZ };
    }).sort((a, b) => a.finalZ - b.finalZ);
    
    // Render icons
    sorted.forEach(icon => {
      const img = loadedImages[icon.index];
      if (!img) return;
      
      const scale = 500 / (500 + icon.finalZ);
      const x2d = icon.rotatedX * scale + size / 2;
      const y2d = icon.rotatedY * scale + size / 2;
      
      const iconSize = 60 * scale;
      const opacity = Math.max(0.3, Math.min(1, (icon.finalZ + radius * 1.5) / (radius * 2)));
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, x2d - iconSize / 2, y2d - iconSize / 2, iconSize, iconSize);
      ctx.restore();
    });
    
    requestAnimationFrame(animate);
  }
  
  // Start animation after small delay to ensure images load
  setTimeout(() => {
    console.log('🎬 Starting animation...');
    animate();
  }, 500);
  
  // Interaction
  canvas.addEventListener('mouseenter', () => {
    autoRotate = false;
  });
  
  canvas.addEventListener('mouseleave', () => {
    autoRotate = true;
  });
  
  let isDragging = false;
  let lastX, lastY;
  
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    autoRotate = false;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    
    rotationY += deltaX * 0.01;
    rotationX += deltaY * 0.01;
    
    lastX = e.clientX;
    lastY = e.clientY;
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      setTimeout(() => {
        autoRotate = true;
      }, 1000);
    }
  });
});

// ==================== CGPA COUNTER ANIMATION - FIXED ====================
window.addEventListener('load', function() {
  console.log('🎯 Initializing counter animations...');
  
  const counters = document.querySelectorAll('.count-up');
  
  counters.forEach(counter => {
    const target = parseFloat(counter.dataset.target);
    const isDecimal = target === 8.00;
    let current = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = progress * (2 - progress);
      current = target * easeProgress;
      
      if (isDecimal) {
        counter.textContent = current.toFixed(2);
      } else {
        counter.textContent = Math.floor(current) + '+';
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Final value
        if (isDecimal) {
          counter.textContent = '8.00';
        } else {
          counter.textContent = target + '+';
        }
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
  
  console.log('✅ Counter animations started!');
});

// ==================== ACCORDION TIMELINE - FIXED ====================
function toggleTimeline(header) {
  const item = header.parentElement;
  const wasActive = item.classList.contains('active');
  
  // Close all
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('active');
  });
  
  // Open clicked one if it wasn't active
  if (!wasActive) {
    item.classList.add('active');
  }
  
  console.log('🔄 Timeline toggled');
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==================== NAVBAR SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(10, 10, 10, 1)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
  } else {
    navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// ==================== CAROUSEL AUTO-ROTATOR WITH SYNCHRONIZED TIMING ====================
const carouselState = {
  'sit-event': { current: 0, total: 2, interval: null, duration: 3000 },        // 2 images: 3s per image = 6s total
  'cause-2025': { current: 0, total: 2, interval: null, duration: 3000 },       // 2 images: 3s per image = 6s total
  'social-service': { current: 0, total: 4, interval: null, duration: 3000 }    // 4 images: 3s per image = 12s total
  // SIT & CAUSE: 6s each, Social Service: 12s - staggered swaps based on completion
};

function switchCarousel(carouselName, imageIndex) {
  const card = document.querySelector(`[data-carousel="${carouselName}"]`);
  if (!card) return;

  // Update state
  carouselState[carouselName].current = imageIndex;

  // Hide all images and dots
  const images = card.querySelectorAll('.carousel-image');
  const dots = card.querySelectorAll('.dot');
  
  images.forEach((img, i) => {
    img.classList.toggle('active', i === imageIndex);
  });
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === imageIndex);
  });

  // Reset auto-rotation interval with proper timing
  clearInterval(carouselState[carouselName].interval);
  carouselState[carouselName].interval = setInterval(() => {
    const nextIndex = (carouselState[carouselName].current + 1) % carouselState[carouselName].total;
    switchCarousel(carouselName, nextIndex);
  }, carouselState[carouselName].duration);
}

// Initialize auto-rotation for all carousels with synchronized timing
function initializeCarousels() {
  Object.keys(carouselState).forEach(carouselName => {
    const state = carouselState[carouselName];
    state.interval = setInterval(() => {
      const nextIndex = (state.current + 1) % state.total;
      switchCarousel(carouselName, nextIndex);
    }, state.duration);
  });
}

// Start carousels when page loads
document.addEventListener('DOMContentLoaded', initializeCarousels);


console.log('🚀 Portfolio fully loaded!');
console.log('✨ Features: 3D Globe, CGPA Animation, Accordion Timeline');
console.log('📧 Contact form emails sent to: saigowtham712@gmail.com via FormSubmit');