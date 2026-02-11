// ===========================================
// DR. FEYSEL CLINIC - CLOUD PRODUCTION VERSION
// WITH YOUR LIVE RAILWAY URL! ☁️
// ===========================================

console.log('%c🏥 DR. FEYSEL CLINIC - CLOUD MODE ACTIVE!', 'font-size: 20px; color: #0066cc; font-weight: bold;');

// ===========================================
// 🔥 YOUR LIVE RAILWAY CLOUD URL! 🔥
// ===========================================
// 🔥 UPDATE TO YOUR NEW WORKING URL!
const CLOUD_URL = 'https://dr-feysel-dermatologist-clinic-copy-production.up.railway.app';
const LOCAL_URL = 'http://localhost:3003';

// Default to cloud
let SERVER_URL = CLOUD_URL;
let ACTIVE_SERVER = 'cloud';

// ===========================================
// TEST CONNECTION TO CLOUD
// ===========================================
async function testConnection() {
    try {
        console.log('☁️ Testing connection to Railway cloud...');
        
        const response = await fetch(`${SERVER_URL}/health`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('%c✅ CLOUD SERVER ONLINE! 24/7/365!', 'color: green; font-size: 16px;', data);
            return true;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.log('☁️ Cloud not reachable, switching to local fallback...');
        SERVER_URL = LOCAL_URL;
        ACTIVE_SERVER = 'local';
        return false;
    }
}

// ===========================================
// BOOK APPOINTMENT - CONNECTS TO CLOUD!
// ===========================================
window.bookAppointment = async function(event) {
    'use strict';
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log(`📅 Booking via ${ACTIVE_SERVER.toUpperCase()} server...`);
    console.log(`🌐 URL: ${SERVER_URL}`);
    
    // Get form data
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
    
    // Validate
    if (!appointment.name) {
        alert('❌ Please enter your full name');
        return false;
    }
    if (!appointment.phone) {
        alert('❌ Please enter your phone number');
        return false;
    }
    if (!appointment.appointment_date) {
        alert('❌ Please select appointment date');
        return false;
    }
    
    // Button loading state
    const button = document.getElementById('bookButton');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    try {
        console.log(`📤 Sending to ${SERVER_URL}/api/appointments...`);
        
        const response = await fetch(`${SERVER_URL}/api/appointments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(appointment)
        });
        
        const data = await response.json();
        console.log('📥 Server response:', data);
        
        if (data.success) {
            // SUCCESS! 🎉
            const emoji = ACTIVE_SERVER === 'cloud' ? '☁️' : '🏠';
            alert(`✅ Appointment booked via ${emoji} ${ACTIVE_SERVER.toUpperCase()}!\n\n` +
                  `Reference: FEYSEL-${data.id}\n\n` +
                  `Dr. Feysel will contact you within 2 hours.`);
            
            // Clear form
            const form = document.getElementById('appointmentForm');
            if (form) form.reset();
            
            console.log(`%c✅ Booking successful! ID: ${data.id}`, 'color: green;');
        } else {
            throw new Error(data.error || 'Booking failed');
        }
        
    } catch (error) {
        console.error('❌ Booking error:', error);
        
        // Try local fallback if cloud fails
        if (ACTIVE_SERVER === 'cloud') {
            console.log('🔄 Cloud failed, trying local fallback...');
            SERVER_URL = LOCAL_URL;
            ACTIVE_SERVER = 'local';
            button.innerHTML = originalText;
            button.disabled = false;
            return window.bookAppointment(event);
        }
        
        alert('❌ Cannot connect to server.\n\n' +
              '☁️ Cloud: ' + CLOUD_URL + '\n' +
              '🏠 Local: Make sure server is running with: pm2 start server.js');
        
    } finally {
        // Restore button
        button.innerHTML = originalText;
        button.disabled = false;
    }
    
    return false;
};

// ===========================================
// INITIALIZE EVERYTHING
// ===========================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 Page loaded - connecting to cloud...');
    
    // Test connection
    await testConnection();
    
    // Connect booking button
    const button = document.getElementById('bookButton');
    if (button) {
        button.onclick = window.bookAppointment;
        console.log('✅ Booking button connected to ' + ACTIVE_SERVER + ' server!');
    }
    
    // Show status
    if (ACTIVE_SERVER === 'cloud') {
        console.log('%c☁️ CLOUD MODE: 24/7/365! Patients can book while you sleep!', 'color: green; font-size: 14px;');
    } else {
        console.log('%c🏠 LOCAL MODE: Server running on your PC', 'color: orange;');
    }
    
    console.log('%c✅ System ready! Click "Book Appointment Now"!', 'color: #0066cc;');
});

// Expose globally
window.testConnection = testConnection;
window.SERVER_URL = SERVER_URL;
window.ACTIVE_SERVER = ACTIVE_SERVER;

console.log('%c☁️ CLOUD URL: ' + CLOUD_URL, 'color: #0066cc; font-weight: bold;');
console.log('%c✅ Script loaded! Ready to book via CLOUD!', 'color: green;');
