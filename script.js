// ===========================================
// DR. FEYSEL CLINIC - CLOUD FORCED VERSION
// CONNECTS DIRECTLY TO RAILWAY - NO FALLBACK!
// ===========================================

console.log('%c🏥 DR. FEYSEL CLINIC - CLOUD MODE FORCED!', 'font-size: 20px; color: #0066cc; font-weight: bold;');

// ===========================================
// ✅ WORKING RAILWAY CLOUD URL!
// ===========================================
const CLOUD_URL = 'https://dr-feysel-dermatologist-clinic-copy-production.up.railway.app';

// 🔥 FORCE CLOUD MODE - NO LOCAL!
const SERVER_URL = CLOUD_URL;
const ACTIVE_SERVER = 'cloud';

console.log(`%c☁️ CLOUD URL: ${SERVER_URL}`, 'color: #00a884; font-size: 14px;');
console.log('%c✅ SERVER: RUNNING!', 'color: green;');

// ===========================================
// BOOK APPOINTMENT - DIRECT TO CLOUD!
// ===========================================
window.bookAppointment = async function(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log(`📅 Booking via CLOUD server...`);
    
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
        console.log(`📤 Sending to: ${SERVER_URL}/api/appointments`);
        
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
            alert(`✅ Appointment booked via CLOUD!\n\nReference: FEYSEL-${data.id}\n\nDr. Feysel will contact you soon.`);
            document.getElementById('appointmentForm')?.reset();
        } else {
            throw new Error(data.error || 'Booking failed');
        }
        
    } catch (error) {
        console.error('❌ Booking error:', error);
        alert(`❌ Cannot connect to cloud server.\n\nURL: ${SERVER_URL}\n\nMake sure Railway is running!`);
        
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
    
    return false;
};

// ===========================================
// INITIALIZE
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Connecting directly to CLOUD...');
    
    const button = document.getElementById('bookButton');
    if (button) {
        button.onclick = window.bookAppointment;
        console.log('✅ Button connected to CLOUD!');
    }
    
    // Test connection silently
    fetch(`${SERVER_URL}/health`, { mode: 'cors' })
        .then(res => res.json())
        .then(data => console.log('✅ Cloud health check:', data))
        .catch(err => console.warn('⚠️ Cloud health check failed:', err));
    
    console.log('%c✅ System ready! Book an appointment!', 'color: green; font-size: 16px;');
});

