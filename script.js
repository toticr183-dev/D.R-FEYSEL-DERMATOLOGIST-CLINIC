// ===========================================
// DR. FEYSEL CLINIC - ULTIMATE SIMPLE FIX
// WORKS WITH YOUR EXACT BUTTON
// ===========================================

console.log('🏥 ULTIMATE SIMPLE FIX LOADED');

// ===========================================
// 1. SERVER CONFIG
// ===========================================
const SERVER_URL = 'http://localhost:3003';
const API_URL = SERVER_URL + '/api';

// ===========================================
// 2. BOOKING FUNCTION - KEEP IT SIMPLE!
// ===========================================
window.bookAppointment = function(event) {
    // STOP EVERYTHING!
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('📅 Booking started...');
    
    // Get form data
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
    
    // Validate
    if (!appointment.name || !appointment.phone || !appointment.appointment_date) {
        alert('❌ Please fill all required fields');
        return false;
    }
    
    // Button loading state
    const button = event?.target || document.querySelector('.btn.btn-primary.btn-block');
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
    }
    
    // Send to server
    fetch(API_URL + '/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(`✅ Appointment booked! ID: ${data.id}`);
            document.getElementById('appointmentForm')?.reset();
        } else {
            alert('❌ Booking failed');
        }
    })
    .catch(err => {
        console.error(err);
        alert('❌ Server not running. Start: node server.js');
    })
    .finally(() => {
        if (button) {
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Book Appointment Now';
            button.disabled = false;
        }
    });
    
    return false;
};

// ===========================================
// 3. SUPER SIMPLE BUTTON CONNECTION
// ===========================================

// Run IMMEDIATELY
(function connectNow() {
    console.log('🔌 Looking for button...');
    
    const button = document.querySelector('.btn.btn-primary.btn-block');
    
    if (button) {
        console.log('✅ Button FOUND! Connecting...');
        
        // Force button type
        button.setAttribute('type', 'button');
        
        // DIRECT CONNECTION - SIMPLEST!
        button.onclick = window.bookAppointment;
        
        console.log('🎯 Button CONNECTED! Ready to book.');
        return true;
    } else {
        console.log('⏳ Button not found, retrying...');
        setTimeout(connectNow, 100); // Try again in 100ms
        return false;
    }
})();

// ===========================================
// 4. SMOOTH SCROLL - SIMPLE VERSION
// ===========================================
setTimeout(function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    console.log('🌀 Smooth scroll activated');
}, 200);

// ===========================================
// 5. MOBILE MENU - SIMPLE VERSION
// ===========================================
setTimeout(function() {
    // Create mobile menu button
    if (!document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.style.cssText = `
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
            z-index: 10000;
            cursor: pointer;
        `;
        document.body.appendChild(menuBtn);
        
        // Only show on mobile
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        }
        
        window.addEventListener('resize', function() {
            menuBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        });
        
        // Toggle menu
        const nav = document.querySelector('nav');
        if (nav) {
            menuBtn.onclick = function() {
                nav.classList.toggle('mobile-show');
                menuBtn.innerHTML = nav.classList.contains('mobile-show') ? '✕' : '☰';
            };
        }
    }
}, 200);

// ===========================================
// 6. ADD BASIC CSS
// ===========================================
setTimeout(function() {
    const style = document.createElement('style');
    style.textContent = `
        .mobile-show { display: block !important; }
        @media (max-width: 768px) {
            nav ul { display: none; }
            nav.mobile-show ul { display: flex; flex-direction: column; position: fixed; top: 0; left: 0; width: 80%; height: 100vh; background: white; padding: 80px 20px; box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index: 9999; }
            .back-to-top { display: none !important; }
        }
        .back-to-top { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: #0066cc; color: white; border: none; border-radius: 50%; font-size: 24px; cursor: pointer; display: none; z-index: 9999; }
    `;
    document.head.appendChild(style);
}, 200);

console.log('✅ ULTIMATE SIMPLE FIX READY!');
console.log('🎯 Click the Book button NOW - it WILL work!');
