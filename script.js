// ===========================================
// DR. FEYSEL CLINIC - CLOUD PRODUCTION VERSION
// CONNECTS TO RAILWAY 24/7/365!
// ===========================================

console.log('%c🏥 DR. FEYSEL CLINIC - CLOUD MODE', 'font-size: 20px; color: #0066cc;');

// ===========================================
// 1. YOUR RAILWAY CLOUD URL - THIS IS CRITICAL!
// ===========================================
const CLOUD_URL = 'https://dr-feysel-dermatologist-clinic-production.up.railway.app';
const LOCAL_URL = 'http://localhost:3003';

// Default to cloud
let SERVER_URL = CLOUD_URL;
let ACTIVE_SERVER = 'cloud';

// ===========================================
// 2. TEST CONNECTION
// ===========================================
async function testConnection() {
    try {
        const response = await fetch(`${SERVER_URL}/health`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`%c☁️ CLOUD SERVER ONLINE!`, 'color: green; font-size: 16px;', data);
            return true;
        }
    } catch (error) {
        console.log('☁️ Cloud not reachable, using local fallback...');
        SERVER_URL = LOCAL_URL;
        ACTIVE_SERVER = 'local';
    }
    return false;
}

// ===========================================
// 3. BOOK APPOINTMENT
// ===========================================
window.bookAppointment = async function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log(`📅 Booking via ${ACTIVE_SERVER}...`);
    
    const appointment = {
        name: document.getElementById('patientName')?.value?.trim() || '',
        phone: document.getElementById('patientPhone')?.value?.trim() || '',
        telegram: document.getElementById('patientTelegram')?.value?.trim() || '',
        appointment_type: document.getElementById('appointmentType')?.value || 'consultation',
        clinic: document.getElementById('clinicLocation')?.value || 'zenebework',
        appointment_date: document.getElementById('appointmentDate')?.value || '',
        symptoms: document.getElementById('symptoms')?.value?.trim() || '',
        status: 'pending'
    };
    
    if (!appointment.name || !appointment.phone || !appointment.appointment_date) {
        alert('❌ Please fill all required fields');
        return false;
    }
    
    const button = document.getElementById('bookButton');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    try {
        console.log(`📤 Sending to ${SERVER_URL}...`);
        
        const response = await fetch(`${SERVER_URL}/api/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointment)
        });
        
        const data = await response.json();
        console.log('📥 Response:', data);
        
        if (data.success) {
            alert(`✅ Appointment booked via CLOUD!\n\nReference: FEYSEL-${data.id}\n\nDr. Feysel will contact you soon.`);
            document.getElementById('appointmentForm')?.reset();
        } else {
            throw new Error(data.error || 'Booking failed');
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        
        if (ACTIVE_SERVER === 'cloud') {
            alert('❌ Cloud server error. Trying local server...');
            SERVER_URL = LOCAL_URL;
            ACTIVE_SERVER = 'local';
            button.innerHTML = originalText;
            button.disabled = false;
            return window.bookAppointment(event);
        } else {
            alert('❌ Cannot connect to server. Please ensure:\n\n☁️ Railway: https://dr-feysel-dermatologist-clinic-production.up.railway.app/health\n🏠 Local: pm2 start server.js');
        }
        
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
    
    return false;
};

// ===========================================
// 4. INITIALIZE
// ===========================================
window.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 Connecting to CLOUD server...');
    
    await testConnection();
    
    const button = document.getElementById('bookButton');
    if (button) {
        button.onclick = window.bookAppointment;
        console.log('✅ Button connected to CLOUD!');
    }
    
    console.log(`%c✅ System ready! Using ${ACTIVE_SERVER} server`, 'color: green;');
});

// Make global
window.testConnection = testConnection;

// ===========================================
// 4. SMOOTH SCROLL - SIMPLE
// ===========================================
window.addEventListener('load', function() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    console.log('🌀 Smooth scroll ready');
});

console.log('✅ SIMPLE WORKING VERSION READY!');
console.log('🎯 Click the Book button NOW!');
