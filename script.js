// ===========================================
// DR. FEYSEL CLINIC - FINAL PRODUCTION VERSION
// CONNECTS TO PM2 SERVER (localhost:3003)
// ===========================================

console.log('🏥 Dr. Feysel Clinic System Loading...');

// SERVER URL - Your PM2 server running on port 3003
const SERVER_URL = 'http://localhost:3003';
const API_URL = SERVER_URL + '/api';

// Test server connection on load
async function testServerConnection() {
    try {
        const response = await fetch(SERVER_URL + '/health');
        const data = await response.json();
        console.log('✅ Server connected:', data);
        return true;
    } catch (error) {
        console.warn('⚠️ Server not responding:', error.message);
        console.log('Please ensure server is running: pm2 start server.js');
        return false;
    }
}

// ===========================================
// 1. APPOINTMENT BOOKING (MAIN FUNCTION)
// ===========================================

async function bookAppointment(event) {
    console.log('📅 Booking appointment...');
    
    // CRITICAL: Prevent page refresh
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    // Get form data from YOUR HTML
    const appointment = {
        name: document.getElementById('patientName')?.value || '',
        phone: document.getElementById('patientPhone')?.value || '',
        telegram: document.getElementById('patientTelegram')?.value || '',
        appointment_type: document.getElementById('appointmentType')?.value || 'consultation',
        clinic: document.getElementById('clinicLocation')?.value || 'zenebework',
        appointment_date: document.getElementById('appointmentDate')?.value || '',
        symptoms: document.getElementById('symptoms')?.value || '',
        status: 'pending'
    };
    
    console.log('📊 Form data:', appointment);
    
    // Validate
    if (!appointment.name.trim()) {
        alert('❌ Please enter your full name');
        return false;
    }
    if (!appointment.phone.trim()) {
        alert('❌ Please enter your phone number');
        return false;
    }
    if (!appointment.appointment_date) {
        alert('❌ Please select preferred date');
        return false;
    }
    
    // Show loading state
    const button = document.querySelector('.btn.btn-primary.btn-block');
    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        
        // Auto-restore after 10 seconds (safety)
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 10000);
    }
    
    try {
        console.log('📤 Sending to server...');
        
        // Send to PM2 server
        const response = await fetch(API_URL + '/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        });
        
        const result = await response.json();
        console.log('📥 Server response:', result);
        
        if (result.success) {
            // 🎉 SUCCESS!
            const successMessage = `✅ Appointment booked successfully!\n\nReference: FEYSEL-${result.id}\n\nDr. Feysel will contact you at ${appointment.phone} within 2 hours.`;
            alert(successMessage);
            
            // Clear the form
            const form = document.getElementById('appointmentForm');
            if (form) {
                form.reset();
                console.log('✅ Form cleared');
            }
            
            return true;
        } else {
            throw new Error(result.error || 'Booking failed');
        }
        
    } catch (error) {
        console.error('❌ Booking error:', error);
        alert(`❌ Error: ${error.message}\n\nPlease call the clinic directly: +251 11 123 4567`);
        return false;
        
    } finally {
        // Restore button state
        if (button) {
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Book Appointment Now';
            button.disabled = false;
        }
    }
}

// ===========================================
// 2. SMOOTH SCROLL NAVIGATION
// ===========================================

function initSmoothScroll() {
    console.log('🌀 Initializing smooth scroll...');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTop);
    
    // Show/hide back to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
}

// ===========================================
// 3. MOBILE MENU TOGGLE
// ===========================================

function initMobileMenu() {
    console.log('📱 Initializing mobile menu...');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.setAttribute('aria-label', 'Menu');
    mobileMenuBtn.style.cssText = `
        display: none;
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0066cc;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 5px;
        font-size: 24px;
        z-index: 1001;
        cursor: pointer;
    `;
    
    document.body.appendChild(mobileMenuBtn);
    
    // Toggle menu function
    mobileMenuBtn.addEventListener('click', () => {
        const nav = document.querySelector('nav');
        if (nav) {
            nav.classList.toggle('mobile-show');
        }
    });
    
    // Show on mobile
    function checkMobile() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            const nav = document.querySelector('nav');
            if (nav) nav.classList.add('mobile-nav');
        } else {
            mobileMenuBtn.style.display = 'none';
            const nav = document.querySelector('nav');
            if (nav) nav.classList.remove('mobile-nav', 'mobile-show');
        }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add CSS for mobile nav
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .mobile-nav {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: white;
                padding: 80px 20px 20px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            .mobile-nav.mobile-show {
                display: block;
            }
            .mobile-nav ul {
                flex-direction: column;
                gap: 15px;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===========================================
// 4. LIVE SESSION COUNTDOWN
// ===========================================

function initLiveCountdown() {
    console.log('⏰ Initializing live session countdown...');
    
    // Update countdown every second
    function updateCountdown() {
        const countdownElement = document.querySelector('.countdown');
        if (!countdownElement) return;
        
        // Next Saturday 10:00 AM
        const now = new Date();
        const nextSaturday = new Date();
        nextSaturday.setDate(now.getDate() + (6 - now.getDay() + 7) % 7 || 7);
        nextSaturday.setHours(10, 0, 0, 0);
        
        const diff = nextSaturday - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `
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
            countdownElement.innerHTML = '<div class="live-now">🔴 LIVE NOW!</div>';
        }
    }
    
    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===========================================
// 5. FORM VALIDATION ENHANCEMENT
// ===========================================

function initFormValidation() {
    console.log('✅ Initializing form validation...');
    
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('0')) {
                value = '+251' + value.substring(1);
            }
            e.target.value = value;
        });
    }
    
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set max date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

// ===========================================
// 6. INITIALIZE EVERYTHING
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded - initializing system...');
    
    // Test server connection
    testServerConnection().then(isConnected => {
        if (!isConnected) {
            console.warn('Server not connected. Starting local server...');
            alert('⚠️ Starting local server. Please wait...');
        }
    });
    
    // 1. Connect booking button
    const bookingButton = document.querySelector('.btn.btn-primary.btn-block');
    if (bookingButton) {
        // Ensure button is type="button"
        bookingButton.type = 'button';
        
        // Remove existing listeners
        const newButton = bookingButton.cloneNode(true);
        bookingButton.parentNode.replaceChild(newButton, bookingButton);
        
        // Connect to new button
        const freshButton = document.querySelector('.btn.btn-primary.btn-block');
        freshButton.addEventListener('click', bookAppointment);
        
        console.log('✅ Booking button connected');
    }
    
    // 2. Also prevent form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            bookAppointment(e);
            return false;
        });
    }
    
    // 3. Initialize all features
    initSmoothScroll();
    initMobileMenu();
    initLiveCountdown();
    initFormValidation();
    
    console.log('🎉 Dr. Feysel Clinic System Ready!');
    console.log('📞 Server: http://localhost:3003');
    console.log('📅 API: http://localhost:3003/api/appointments');
    console.log('👨‍⚕️ Admin: http://localhost:3003/api/admin/appointments');
});

// Make functions available globally for testing
window.bookAppointment = bookAppointment;
window.testServerConnection = testServerConnection;

console.log('🏥 Dr. Feysel Clinic System Loaded Successfully!');
