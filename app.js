/* ==========================================================================
   CYRHIEL H. MORALLA - INTERACTIVE ARCHITECTURAL PORTFOLIO INTERACTION ENGINE
   Awwwards-Level Physics Easing, Dynamic Vectors, and CAD Blueprints
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* --------------------------------------------------------------------------
     01. GLOBAL ENGINE STATE
     -------------------------------------------------------------------------- */
  const state = {
    // Scroll properties
    scrollY: 0,
    targetScrollY: 0,
    scrollEase: 0.08, // Premium floaty scroll easing
    scrollVelocity: 0,
    lastScrollTime: Date.now(),
    lastScrollY: 0,
    
    // Mouse properties
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    mouseEase: 0.15,
    isCursorHovering: false,
    
    // Wireframe viewport toggle
    cadMode: false,
    
    // Drafting table tools
    draftTool: 'draw', // 'draw', 'column', 'clear'
    drawnLines: [],
    drawnColumns: [],
    gridSize: 40,
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentDragX: 0,
    currentDragY: 0
  };

  // DOM Elements cache
  const elements = {
    body: document.body,
    smoothWrapper: document.getElementById('smooth-wrapper'),
    smoothContent: document.getElementById('smooth-content'),
    customCursor: document.getElementById('custom-cursor'),
    cursorX: document.getElementById('cursor-x'),
    cursorY: document.getElementById('cursor-y'),
    wireframeToggle: document.getElementById('wireframe-toggle'),
    scrollPercentage: document.getElementById('scroll-percentage'),
    scrollVelocityHud: document.getElementById('scroll-velocity'),
    protractorNeedle: document.getElementById('protractor-needle'),
    protractorAngle: document.getElementById('protractor-angle'),
    protractorWidget: document.getElementById('scroll-protractor'),
    perspectiveGrid: document.querySelector('.perspective-grid-inner'),
    heroRotating: document.getElementById('hero-rotating-element'),
    heroProfile: document.getElementById('hero-profile-container'),
    profileCard: document.querySelector('.profile-card-3d'),
    aboutSection: document.getElementById('about'),
    isometricSvg: document.getElementById('isometric-building-svg'),
    canvas: document.getElementById('interactive-drafting-canvas'),
    activeVectorsCount: document.getElementById('active-vectors'),
    contactForm: document.getElementById('architectural-contact-form'),
    navLinks: document.querySelectorAll('.header-nav a'),
    sections: document.querySelectorAll('section')
  };

  /* --------------------------------------------------------------------------
     02. GPU-ACCELERATED INERTIA SMOOTH SCROLL ENGINE
     -------------------------------------------------------------------------- */
  function initInertiaScroll() {
    // Set virtual body height to allow native scrollbars
    function updateBodyHeight() {
      if (elements.smoothContent) {
        const contentHeight = elements.smoothContent.getBoundingClientRect().height;
        elements.body.style.height = `${contentHeight}px`;
      }
    }
    
    window.addEventListener('resize', updateBodyHeight);
    // Allow images/content to load before measuring height
    window.addEventListener('load', updateBodyHeight);
    setInterval(updateBodyHeight, 1000); // Fail-safe height check
    updateBodyHeight();

    // Monitor native window scroll to set targets
    window.addEventListener('scroll', () => {
      state.targetScrollY = window.scrollY;
    });
  }

  /* --------------------------------------------------------------------------
     03. AWWWARDS MOUSE-TRACKING CROSSHAIR & SNAPPING PHYSICS
     -------------------------------------------------------------------------- */
  function initCustomCursor() {
    // Track mouse inputs
    window.addEventListener('mousemove', (e) => {
      state.targetMouseX = e.clientX;
      state.targetMouseY = e.clientY;
    });

    // Snapping logic for magnetic buttons
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    magneticTargets.forEach(target => {
      target.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        // Calculate center of target
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;
        
        // Calculate mouse distance from target center
        const distX = e.clientX - targetCenterX;
        const distY = e.clientY - targetCenterY;
        
        // Apply magnetic spring force to pull element slightly towards cursor
        const pullStrength = 0.35;
        this.style.transform = `translate(${distX * pullStrength}px, ${distY * pullStrength}px) scale(1.05)`;
        
        // Snap cursor target coordinates directly to target center (magnet effect)
        state.targetMouseX = targetCenterX + distX * 0.2;
        state.targetMouseY = targetCenterY + distY * 0.2;
        
        // Expand crosshair magnifying ring
        elements.customCursor.classList.add('cursor-active');
      });

      target.addEventListener('mouseleave', function() {
        // Smooth snap back
        this.style.transform = 'translate(0px, 0px) scale(1)';
        elements.customCursor.classList.remove('cursor-active');
      });
    });

    // Click interactive feedback
    window.addEventListener('mousedown', () => {
      elements.customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    window.addEventListener('mouseup', () => {
      elements.customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  /* --------------------------------------------------------------------------
     04. PROFILE 3D PERSPECTIVE TILT
     -------------------------------------------------------------------------- */
  function initProfileTilt() {
    if (!elements.profileCard) return;

    elements.profileCard.addEventListener('mousemove', (e) => {
      const rect = elements.profileCard.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      
      // Relative offset from card center (-0.5 to 0.5)
      const offsetX = (e.clientX - cardX) / (rect.width / 2);
      const offsetY = (e.clientY - cardY) / (rect.height / 2);
      
      // Skew maximum bounds (15 deg)
      const rotateX = -offsetY * 15;
      const rotateY = offsetX * 15;
      
      // Update transforms inside requestAnimationFrame
      elements.profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      
      // Shift scanning neon overlay line
      const scanner = document.querySelector('.profile-scanner-line');
      if (scanner) {
        scanner.style.background = `linear-gradient(to right, transparent, var(--accent-cyan), transparent)`;
        scanner.style.boxShadow = `0 0 15px rgba(var(--accent-cyan-rgb), 0.8)`;
      }
    });

    elements.profileCard.addEventListener('mouseleave', () => {
      // Restore default flat state
      elements.profileCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      const scanner = document.querySelector('.profile-scanner-line');
      if (scanner) {
        scanner.style.background = '';
        scanner.style.boxShadow = '';
      }
    });
  }

  /* --------------------------------------------------------------------------
     05. CAD VIEWPORT ENGINE & VARIABLES SWAP
     -------------------------------------------------------------------------- */
  function initCadMode() {
    if (!elements.wireframeToggle) return;

    elements.wireframeToggle.addEventListener('click', () => {
      state.cadMode = !state.cadMode;
      
      if (state.cadMode) {
        elements.body.classList.add('theme-wireframe');
        elements.wireframeToggle.querySelector('.mode-text').textContent = 'CAD_WIREFRAME: ACTIVE';
        elements.wireframeToggle.style.borderColor = 'var(--accent-cyan)';
        elements.wireframeToggle.style.color = 'var(--accent-cyan)';
      } else {
        elements.body.classList.remove('theme-wireframe');
        elements.wireframeToggle.querySelector('.mode-text').textContent = 'CAD_WIREFRAME: OFF';
        elements.wireframeToggle.style.borderColor = '';
        elements.wireframeToggle.style.color = '';
      }
      
      // Clean drafting canvas to reflect theme color updates
      drawCanvas();
    });
  }

  /* --------------------------------------------------------------------------
     06. PORTFOLIO TABS SPECIFICATIONS ACCORDIONS
     -------------------------------------------------------------------------- */
  function initAccordions() {
    const triggers = document.querySelectorAll('.spec-item-trigger');
    
    triggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const parent = this.parentElement;
        const isActive = parent.classList.contains('active');
        
        // Collapse all specs first
        document.querySelectorAll('.spec-item-collapse').forEach(item => {
          item.classList.remove('active');
        });
        
        // Toggle target spec
        if (!isActive) {
          parent.classList.add('active');
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     07. INTERACTIVE DRAFTING CANVAS BOARD
     -------------------------------------------------------------------------- */
  function initDraftingCanvas() {
    const canvas = elements.canvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Scale canvas pixels for high-DPI displays (Silky vector shapes)
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawCanvas();
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Snap cursor inputs to a virtual architectural grid coordinate system
    function getSnappedCoords(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      // Raw coordinates relative to canvas
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      // Math grid snap
      const snapX = Math.round(x / state.gridSize) * state.gridSize;
      const snapY = Math.round(y / state.gridSize) * state.gridSize;
      
      return { x: snapX, y: snapY };
    }

    // Toggle active tools
    document.getElementById('tool-draw').addEventListener('click', function() {
      state.draftTool = 'draw';
      setActiveToolBtn(this);
    });
    
    document.getElementById('tool-column').addEventListener('click', function() {
      state.draftTool = 'column';
      setActiveToolBtn(this);
    });
    
    document.getElementById('tool-clear').addEventListener('click', function() {
      state.drawnLines = [];
      state.drawnColumns = [];
      elements.activeVectorsCount.textContent = '0';
      drawCanvas();
    });

    function setActiveToolBtn(activeBtn) {
      document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
      activeBtn.classList.add('active');
    }

    // Mouse interactive drafting handlers
    canvas.addEventListener('mousedown', (e) => {
      const coords = getSnappedCoords(e.clientX, e.clientY);
      state.isDrawing = true;
      state.startX = coords.x;
      state.startY = coords.y;
      state.currentDragX = coords.x;
      state.currentDragY = coords.y;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!state.isDrawing) return;
      const coords = getSnappedCoords(e.clientX, e.clientY);
      state.currentDragX = coords.x;
      state.currentDragY = coords.y;
      
      // Redraw grid with drag helper outline
      drawCanvas();
      drawPreview();
    });

    window.addEventListener('mouseup', () => {
      if (!state.isDrawing) return;
      state.isDrawing = false;
      
      // Commit drawn vector layers to state arrays
      if (state.draftTool === 'draw') {
        const dx = state.currentDragX - state.startX;
        const dy = state.currentDragY - state.startY;
        
        // Only save if it actually represents a line segment
        if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
          state.drawnLines.push({
            x1: state.startX,
            y1: state.startY,
            x2: state.currentDragX,
            y2: state.currentDragY,
            color: state.cadMode ? 'hsl(120, 100%, 50%)' : 'hsl(190, 100%, 50%)'
          });
        }
      } else if (state.draftTool === 'column') {
        const width = Math.max(state.gridSize, Math.abs(state.currentDragX - state.startX));
        const height = Math.max(state.gridSize, Math.abs(state.currentDragY - state.startY));
        const px = Math.min(state.startX, state.currentDragX);
        const py = Math.min(state.startY, state.currentDragY);
        
        state.drawnColumns.push({
          x: px,
          y: py,
          w: width,
          h: height,
          color: state.cadMode ? 'hsl(60, 100%, 50%)' : 'hsl(18, 100%, 54%)'
        });
      }
      
      elements.activeVectorsCount.textContent = state.drawnLines.length + state.drawnColumns.length;
      drawCanvas();
    });

    // Draw active Canvas structural drafts
    function drawCanvas() {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Draw background draft snap grids
      ctx.strokeStyle = state.cadMode ? 'rgba(34, 197, 94, 0.08)' : 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < rect.width; x += state.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < rect.height; y += state.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Draw all committed vectors (Lines)
      state.drawnLines.forEach(line => {
        ctx.strokeStyle = state.cadMode ? 'hsl(120, 100%, 50%)' : 'hsl(190, 100%, 50%)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
        
        // Draw endpoints (Drafting Nodes)
        ctx.fillStyle = state.cadMode ? 'hsl(120, 100%, 60%)' : 'hsl(190, 100%, 60%)';
        ctx.beginPath();
        ctx.arc(line.x1, line.y1, 3, 0, Math.PI * 2);
        ctx.arc(line.x2, line.y2, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw all committed columns (Hatched isometric boxes)
      state.drawnColumns.forEach(col => {
        const cyanColor = state.cadMode ? 'hsl(120, 100%, 50%)' : 'hsl(190, 100%, 50%)';
        const orangeColor = state.cadMode ? 'hsl(60, 100%, 50%)' : 'hsl(18, 100%, 54%)';
        
        ctx.strokeStyle = orangeColor;
        ctx.lineWidth = 2;
        
        // Draw column outer framing outline
        ctx.strokeRect(col.x, col.y, col.w, col.h);
        
        // Inner technical hatch (architectural concrete grid crosshatch)
        ctx.strokeStyle = state.cadMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(251, 93, 24, 0.2)';
        ctx.lineWidth = 0.5;
        const hatchGap = 10;
        
        // Draw diagonal hatch lines
        for (let i = hatchGap; i < col.w + col.h; i += hatchGap) {
          ctx.beginPath();
          ctx.moveTo(col.x + Math.max(0, i - col.h), col.y + Math.min(i, col.h));
          ctx.lineTo(col.x + Math.min(i, col.w), col.y + Math.max(0, i - col.w));
          ctx.stroke();
        }
        
        // Render dimensions annotation specs
        ctx.fillStyle = orangeColor;
        ctx.font = '8px JetBrains Mono';
        ctx.fillText(`W:${col.w}px`, col.x + 4, col.y + 12);
        ctx.fillText(`H:${col.h}px`, col.x + 4, col.y + 24);
      });
    }

    // Dynamic previews drawn on mouse drag
    function drawPreview() {
      ctx.strokeStyle = 'rgba(251, 93, 24, 0.8)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      if (state.draftTool === 'draw') {
        ctx.beginPath();
        ctx.moveTo(state.startX, state.startY);
        ctx.lineTo(state.currentDragX, state.currentDragY);
        ctx.stroke();
        
        // Compass snapping guide lines
        ctx.fillStyle = 'var(--accent-orange)';
        ctx.font = '9px JetBrains Mono';
        const length = Math.round(Math.hypot(state.currentDragX - state.startX, state.currentDragY - state.startY));
        ctx.fillText(`L: ${length}px`, state.currentDragX + 10, state.currentDragY - 10);
      } else if (state.draftTool === 'column') {
        const width = Math.max(state.gridSize, Math.abs(state.currentDragX - state.startX));
        const height = Math.max(state.gridSize, Math.abs(state.currentDragY - state.startY));
        const px = Math.min(state.startX, state.currentDragX);
        const py = Math.min(state.startY, state.currentDragY);
        
        ctx.strokeRect(px, py, width, height);
      }
      
      ctx.setLineDash([]); // Reset line dashes
    }
  }

  /* --------------------------------------------------------------------------
     08. SVG DYNAMIC SCROLL ANIMATOR (Dashoffsets)
     -------------------------------------------------------------------------- */
  function animateIsometricBlueprint() {
    if (!elements.aboutSection || !elements.isometricSvg) return;
    
    const rect = elements.aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if about section is visible
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Calculate scroll progress percentage inside this section (0 to 1)
      const totalScrollHeight = rect.height + viewportHeight;
      const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / totalScrollHeight));
      
      // Map progress to individual path lines in the isometric drawing
      const drawLines = elements.isometricSvg.querySelectorAll('.draw-line');
      drawLines.forEach((line, index) => {
        // Stagger drawing stages
        const startThreshold = index * 0.12;
        const endThreshold = Math.min(1.0, startThreshold + 0.35);
        
        let pathProgress = 0;
        if (scrollProgress > startThreshold) {
          pathProgress = Math.min(1.0, (scrollProgress - startThreshold) / (endThreshold - startThreshold));
        }
        
        // SVG Dash calculations
        const pathLength = line.getTotalLength();
        line.style.strokeDasharray = pathLength;
        // 0 offset means fully drawn, pathLength offset means hidden
        line.style.strokeDashoffset = pathLength * (1 - pathProgress);
      });
    }
  }

  /* --------------------------------------------------------------------------
     09. SYSTEM FORM TRANSMISSION PROTOCOL
     -------------------------------------------------------------------------- */
  function initContactForm() {
    if (!elements.contactForm) return;

    elements.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = elements.contactForm.querySelector('.submit-btn');
      const originText = submitBtn.querySelector('.btn-text').innerHTML;
      
      // Update HUD to alert transaction status
      submitBtn.querySelector('.btn-text').innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> DISPATCHING_METRICS...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Success dialog
        submitBtn.querySelector('.btn-text').innerHTML = '<i class="fa-solid fa-circle-check"></i> TRANSMISSION_SUCCESSFUL!';
        submitBtn.style.borderColor = 'var(--accent-cyan)';
        submitBtn.style.color = 'var(--accent-cyan)';
        
        // Reset form inputs
        elements.contactForm.reset();
        
        setTimeout(() => {
          submitBtn.querySelector('.btn-text').innerHTML = originText;
          submitBtn.disabled = false;
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }, 3000);
      }, 1500);
    });
  }

  /* --------------------------------------------------------------------------
     10. VELOCITY & SCROLL MATH TICKER (60fps requestAnimationFrame)
     -------------------------------------------------------------------------- */
  function animateEngine() {
    // 1. Inertia Smooth Scroll calculation
    const scrollDiff = state.targetScrollY - state.scrollY;
    state.scrollY += scrollDiff * state.scrollEase;
    
    // Apply transform vector
    if (elements.smoothContent) {
      elements.smoothContent.style.transform = `translate3d(0, -${state.scrollY}px, 0)`;
    }

    // 2. Scroll Velocity calculations (px/s)
    const now = Date.now();
    const timeDiff = (now - state.lastScrollTime) / 1000;
    if (timeDiff > 0) {
      const instantVelocity = Math.abs(state.scrollY - state.lastScrollY) / timeDiff;
      // Filter out raw noise using moving average (damping)
      state.scrollVelocity += (instantVelocity - state.scrollVelocity) * 0.1;
      
      if (elements.scrollVelocityHud) {
        elements.scrollVelocityHud.textContent = `${state.scrollVelocity.toFixed(1)} px/s`;
      }
      
      state.lastScrollTime = now;
      state.lastScrollY = state.scrollY;
    }

    // 3. Scroll HUD updates (Percentage)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = maxScroll > 0 ? Math.round((state.scrollY / maxScroll) * 100) : 0;
    if (elements.scrollPercentage) {
      elements.scrollPercentage.textContent = `${progressPercent}%`;
    }

    // 4. Protractor needle & angles rotations
    const protractorAngle = (progressPercent * 3.6).toFixed(0);
    if (elements.protractorNeedle) {
      elements.protractorNeedle.setAttribute('transform', `rotate(${protractorAngle}, 50, 50)`);
    }
    if (elements.protractorAngle) {
      elements.protractorAngle.textContent = protractorAngle;
    }
    if (elements.protractorWidget) {
      elements.protractorWidget.style.transform = `rotate(${-state.scrollY * 0.05}deg)`;
    }

    // 5. Scroll perspective grid skew (kinetic Awwwards visual)
    if (elements.perspectiveGrid) {
      // Skew grid proportional to velocity
      const maxSkew = 15; // deg
      const skewVal = Math.min(maxSkew, state.scrollVelocity * 0.015);
      elements.perspectiveGrid.style.transform = `rotateX(60deg) rotateZ(${state.scrollY * 0.08}deg) skewY(${skewVal * 0.5}deg)`;
    }

    // 6. Central gear rotating ornament
    if (elements.heroRotating) {
      elements.heroRotating.setAttribute('transform', `translate(500, 500) rotate(${state.scrollY * 0.15})`);
    }

    // 7. Mouse Custom Cursor interpolation
    const mouseDiffX = state.targetMouseX - state.mouseX;
    const mouseDiffY = state.targetMouseY - state.mouseY;
    state.mouseX += mouseDiffX * state.mouseEase;
    state.mouseY += mouseDiffY * state.mouseEase;
    
    if (elements.customCursor) {
      elements.customCursor.style.left = `${state.mouseX}px`;
      elements.customCursor.style.top = `${state.mouseY}px`;
    }
    
    if (elements.cursorX) elements.cursorX.textContent = Math.round(state.mouseX);
    if (elements.cursorY) elements.cursorY.textContent = Math.round(state.mouseY);

    // 8. Trigger SVG Building assembly on scroll
    animateIsometricBlueprint();

    // 9. Active viewport navigation link highlighting based on section views
    let activeSectionId = 'hero';
    elements.sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const bottom = top + sec.offsetHeight;
      if (state.scrollY >= top && state.scrollY < bottom) {
        activeSectionId = sec.getAttribute('id');
      }
    });

    elements.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === activeSectionId) {
        link.classList.add('active');
      }
    });

    // 10. Scroll Reveal elements tracking
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.85) {
        el.classList.add('revealed');
      }
    });

    // Recursively queue next drawing frame
    requestAnimationFrame(animateEngine);
  }

  /* --------------------------------------------------------------------------
     11. SYSTEM BOOTSTRAP INITIALIZATION
     -------------------------------------------------------------------------- */
  function bootstrap() {
    initInertiaScroll();
    initCustomCursor();
    initProfileTilt();
    initCadMode();
    initAccordions();
    initDraftingCanvas();
    initContactForm();
    
    // Trigger loop ticker
    requestAnimationFrame(animateEngine);
  }
  
  bootstrap();
});
