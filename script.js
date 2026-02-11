// ===========================================
// DR. FEYSEL CLINIC - COMPLETE FINAL VERSION
// WITH BOOKING + SMOOTH NAV + MOBILE + EVERYTHING!
// ===========================================

console.log('🏥 COMPLETE FINAL: Dr. Feysel Clinic System');
console.log('===========================================');

// ===========================================
// 1. SERVER CONFIGURATION
// ===========================================

const SERVER_URL = 'http://localhost:3003';
const API_URL = SERVER_URL + '/api';

// ===========================================
// 2. APPOINTMENT BOOKING FUNCTION
// ===========================================

window.bookAppointment = function(event) {
    console.log('📅 BOOKING FUNCTION CALLED!');
    
    // SUPER AGGRESSIVE - STOP EVERYTHING!
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    // Get form elements
    const nameInput = document.getElementById('patientName');
    const phoneInput = document.getElementById('patientPhone');
    const telegramInput = document.getElementById('patientTelegram');
    const typeInput = document.getElementById('appointmentType');
    const clinicInput = document.getElementById('clinicLocation');
    const dateInput = document.getElementById('appointmentDate');
    const symptomsInput = document.getElementById('symptoms');
    
    // Get values with fallbacks
    const appointment = {
        name: nameInput ? nameInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        telegram: telegramInput ? telegramInput.value : '',
        appointment_type: typeInput ? typeInput.value : 'consultation',
        clinic: clinicInput ? clinicInput.value : 'zenebework',
        appointment_date: dateInput ? dateInput.value : '',
        symptoms: symptomsInput ? symptomsInput.value : '',
        status: 'pending'
    };
    
    console.log('📊 Data:', appointment);
    
    // Validate
    if (!appointment.name.trim()) {
        alert('❌ Please enter your name');
        return false;
    }
    if (!appointment.phone.trim()) {
        alert('❌ Please enter your phone number');
        return false;
    }
    if (!appointment.appointment_date) {
        alert('❌ Please select appointment date');
        return false;
    }
    
    // Button handling
    const button = document.querySelector('.btn.btn-primary.btn-block');
    let originalHTML = '';
    
    if (button) {
        originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
    }
    
    // Send to server
    fetch(API_URL + '/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(result => {
        console.log('✅ Server response:', result);
        
        if (result.success) {
            alert(`✅ Appointment booked!\n\nReference: FEYSEL-${result.id}\n\nDr. Feysel will contact you soon.`);
            
            // Reset form
            const form = document.getElementById('appointmentForm');
            if (form) form.reset();
        } else {
            alert('❌ Error: ' + (result.error || 'Booking failed'));
        }
    })
    .catch(error => {
        console.error('❌ Error:', error);
        alert('❌ Connection error. Is the server running?\n\nRun: node server.js');
    })
    .finally(() => {
        if (button) {
            button.innerHTML = originalHTML || '<i class="fas fa-paper-plane"></i> Book Appointment Now';
            button.disabled = false;
        }
    });
    
    return false;
};

// ===========================================
// 3. SMOOTH SCROLL NAVIGATION
// ===========================================

function initSmoothScroll() {
    console.log('🌀 Initializing smooth scroll...');
    
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll with offset for fixed header
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Add "Back to Top" button
    addBackToTopButton();
}

function addBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
            backToTop.style.animation = 'fadeIn 0.3s';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

// ===========================================
// 4. MOBILE MENU AND RESPONSIVE
// ===========================================

function initMobileMenu() {
    console.log('📱 Initializing mobile menu...');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.setAttribute('aria-label', 'Menu');
    
    document.body.appendChild(mobileMenuBtn);
    
    // Get navigation
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    if (nav) {
        // Add mobile nav class
        nav.classList.add('mobile-nav');
        
        // Toggle menu
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-show');
            
            // Change icon
            if (nav.classList.contains('mobile-show')) {
                mobileMenuBtn.innerHTML = '✕';
            } else {
                mobileMenuBtn.innerHTML = '☰';
            }
        });
        
        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-show');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (nav) nav.classList.remove('mobile-show');
            mobileMenuBtn.innerHTML = '☰';
        }
    });
}

// ===========================================
// 5. LIVE COUNTDOWN TIMER
// ===========================================

function initLiveCountdown() {
    console.log('⏰ Initializing live countdown...');
    
    function updateCountdown() {
        const countdownContainer = document.querySelector('.countdown');
        if (!countdownContainer) return;
        
        // Next Saturday at 10:00 AM
        const now = new Date();
        const nextSaturday = new Date();
        nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7 || 7);
        nextSaturday.setHours(10, 0, 0, 0);
        
        // If today is Saturday and past 10:00, go to next Saturday
        if (now.getDay() === 6 && now.getHours() >= 10) {
            nextSaturday.setDate(nextSaturday.getDate() + 7);
        }
        
        const diff = nextSaturday - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownContainer.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        } else {
            countdownContainer.innerHTML = '<div class="live-now">🔴 LIVE NOW! Join Dr. Feysel</div>';
        }
    }
    
    // Update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===========================================
// 6. FORM VALIDATION & ENHANCEMENT
// ===========================================

function initFormValidation() {
    console.log('✅ Initializing form validation...');
    
    // Phone number formatting
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('0')) {
                value = '+251' + value.substring(1);
            }
            if (value.length > 0 && !value.startsWith('+')) {
                value = '+251' + value;
            }
            e.target.value = value;
        });
    }
    
    // Date restrictions
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const threeMonthsLater = new Date(today);
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.max = threeMonthsLater.toISOString().split('T')[0];
    }
    
    // Character counter for symptoms
    const symptomsInput = document.getElementById('symptoms');
    if (symptomsInput) {
        symptomsInput.addEventListener('input', function(e) {
            const maxLength = 500;
            const currentLength = e.target.value.length;
            
            // Add counter if it doesn't exist
            let counter = e.target.parentNode.querySelector('.char-counter');
            if (!counter) {
                counter = document.createElement('small');
                counter.className = 'char-counter';
                e.target.parentNode.appendChild(counter);
            }
            
            counter.textContent = `${currentLength}/${maxLength}`;
            counter.style.color = currentLength > maxLength ? 'red' : '#666';
        });
    }
}

// ===========================================
// 7. ADD ALL CSS STYLES
// ===========================================

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* ========== SMOOTH SCROLL ========== */
        html {
            scroll-behavior: smooth;
        }
        
        /* ========== BACK TO TOP BUTTON ========== */
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: none;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .back-to-top:hover {
            background: #004d99;
            transform: translateY(-3px);
            box-shadow: 0 5px 20px rgba(0,102,204,0.4);
        }
        
        /* ========== MOBILE MENU ========== */
        .mobile-menu-btn {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            .mobile-nav {
                position: fixed;
                top: 0;
                left: -100%;
                width: 80%;
                height: 100vh;
                background: white;
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                z-index: 10000;
                transition: left 0.3s ease;
                padding: 80px 20px 20px;
            }
            
            .mobile-nav.mobile-show {
                left: 0;
            }
            
            .mobile-nav ul {
                flex-direction: column;
                gap: 20px;
            }
            
            .mobile-nav ul li {
                width: 100%;
            }
            
            .mobile-nav ul li a {
                display: block;
                padding: 12px 20px;
                font-size: 18px;
                border-radius: 5px;
            }
            
            .mobile-nav ul li a:hover {
                background: #f5f9ff;
            }
        }
        
        /* ========== COUNTDOWN STYLES ========== */
        .countdown {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        
        .countdown-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            min-width: 80px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .countdown-number {
            font-size: 2rem;
            font-weight: bold;
            color: #0066cc;
            display: block;
            line-height: 1;
        }
        
        .countdown-label {
            font-size: 0.9rem;
            color: #666;
            display: block;
            margin-top: 5px;
        }
        
        .live-now {
            background: #dc3545;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 1.2rem;
            animation: pulse 2s infinite;
            display: inline-block;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* ========== FORM ENHANCEMENTS ========== */
        .char-counter {
            display: block;
            text-align: right;
            font-size: 0.8rem;
            margin-top: 5px;
            color: #666;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #0066cc !important;
            box-shadow: 0 0 0 3px rgba(0,102,204,0.1) !important;
        }
        
        /* ========== ANIMATIONS ========== */
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        
        .btn-primary {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,102,204,0.3);
        }
        
        .btn-primary:active {
            transform: translateY(0);
        }
        
        /* ========== LOADING SPINNER ========== */
        .fa-spinner {
            animation: spin 1s infinite linear;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Custom styles added');
}

// ===========================================
// 8. CONNECT BUTTON (5 METHODS)
// ===========================================

function connectButton() {
    console.log('🔌 Connecting button...');
    
    const button = document.querySelector('.btn.btn-primary.btn-block');
    
    if (button) {
        // Force button type
        button.type = 'button';
        button.setAttribute('type', 'button');
        
        // Remove all listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Connect fresh button
        const freshButton = document.querySelector('.btn.btn-primary.btn-block');
        
        // Method 1: onclick
        freshButton.onclick = function(e) {
            window.bookAppointment(e);
            return false;
        };
        
        // Method 2: addEventListener
        freshButton.addEventListener('click', window.bookAppointment);
        
        // Method 3: form submission
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                window.bookAppointment(e);
                return false;
            };
        }
        
        console.log('✅ Button connected successfully!');
        return true;
    }
    
    console.log('❌ Button not found');
    return false;
}

// ===========================================
// 9. INITIALIZE EVERYTHING!
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Ready - Initializing all systems...');
    
    // Add custom styles first
    addCustomStyles();
    
    // Initialize all features
    initSmoothScroll();
    initMobileMenu();
    initLiveCountdown();
    initFormValidation();
    
    // Connect button (try multiple times)
    if (!connectButton()) {
        setTimeout(connectButton, 500);
        setTimeout(connectButton, 1000);
        setTimeout(connectButton, 2000);
    }
    
    // Test server connection
    fetch(SERVER_URL + '/health')
        .then(r => r.json())
        .then(d => console.log('✅ Server connected:', d))
        .catch(e => console.warn('⚠️ Server not running:', e.message));
    
    console.log('🎉 ALL SYSTEMS INITIALIZED!');
    console.log('✅ Smooth scroll: ACTIVE');
    console.log('✅ Mobile menu: ACTIVE');
    console.log('✅ Countdown: ACTIVE');
    console.log('✅ Form validation: ACTIVE');
    console.log('✅ Booking button: ACTIVE');
});

// ===========================================
// 10. EXPOSE FUNCTIONS GLOBALLY
// ===========================================

window.forceConnect = connectButton;
window.testButton = function() { alert('✅ Button test works!'); };
window.testServer = function() { 
    fetch(SERVER_URL + '/health')
        .then(r => r.json())
        .then(d => console.log('Server:', d))
        .catch(e => console.error('Server error:', e));
};

console.log('===========================================');
console.log('✅ COMPLETE FINAL VERSION LOADED!');
console.log('✅ All features included!');
console.log('===========================================');
