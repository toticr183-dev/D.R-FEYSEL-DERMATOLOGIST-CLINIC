// ===========================================
// DR. FEYSEL CLINIC - SIMPLE WORKING VERSION
// 100% GUARANTEED TO WORK WITH YOUR BUTTON
// ===========================================

console.log('🚀 SIMPLE WORKING VERSION LOADED');

// ===========================================
// 1. SERVER SETUP
// ===========================================
const SERVER_URL = 'http://localhost:3003';
const API_URL = SERVER_URL + '/api';

// ===========================================
// 2. BOOKING FUNCTION - SUPER SIMPLE
// ===========================================
window.bookAppointment = function(event) {
    // Stop everything!
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log('📅 Booking started...');
    
    // Get values DIRECTLY from your HTML IDs
    const appointment = {
        name: document.getElementById('patientName').value,
        phone: document.getElementById('patientPhone').value,
        telegram: document.getElementById('patientTelegram').value || '',
        appointment_type: document.getElementById('appointmentType').value,
        clinic: document.getElementById('clinicLocation').value,
        appointment_date: document.getElementById('appointmentDate').value,
        symptoms: document.getElementById('symptoms').value || '',
        status: 'pending'
    };
    
    console.log('📊 Data:', appointment);
    
    // Simple validation
    if (!appointment.name || !appointment.phone || !appointment.appointment_date) {
        alert('❌ Please fill all required fields');
        return false;
    }
    
    // Button loading state
    const button = document.querySelector('.btn.btn-primary.btn-block');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    // Send to server
    fetch(API_URL + '/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Server response:', data);
        
        if (data.success) {
            alert(`✅ Appointment booked!\nID: ${data.id}\nDr. Feysel will contact you soon.`);
            document.getElementById('appointmentForm').reset();
        } else {
            alert('❌ Booking failed');
        }
    })
    .catch(error => {
        console.error('❌ Error:', error);
        alert('❌ Server not running!\n\nRun: node server.js');
    })
    .finally(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    });
    
    return false;
};

// ===========================================
// 3. CONNECT BUTTON - DIRECTO!
// ===========================================
// Wait for everything to load
window.addEventListener('load', function() {
    console.log('🔌 Connecting button...');
    
    // Get your button
    const button = document.querySelector('.btn.btn-primary.btn-block');
    
    if (button) {
        // DIRECT connection - SIMPLE!
        button.onclick = window.bookAppointment;
        console.log('✅ BUTTON CONNECTED! Ready to book.');
    } else {
        console.error('❌ Button not found!');
    }
});

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
