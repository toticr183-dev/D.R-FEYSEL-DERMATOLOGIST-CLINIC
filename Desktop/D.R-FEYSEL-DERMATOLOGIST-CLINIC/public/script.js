// D.R FEYSEL DERMATOLOGIST CLINIC - Frontend Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeDatePicker();
    initializeBookingForm();
    initializeMobileMenu();
    setupFormValidation();
    updateLiveDateTime();
});

// ==================== DATE & TIME FUNCTIONS ====================

function initializeDatePicker() {
    const dateInput = document.getElementById('preferredDate');
    if (!dateInput) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format as YYYY-MM-DD
    const formattedDate = tomorrow.toISOString().split('T')[0];
    dateInput.value = formattedDate;
    dateInput.min = formattedDate;
}

function updateLiveDateTime() {
    function update() {
        const now = new Date();
        const timeElements = document.querySelectorAll('.live-time');
        timeElements.forEach(el => {
            el.textContent = now.toLocaleTimeString('en-ET', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        });
    }
    
    update();
    setInterval(update, 60000);
}

// ==================== FORM VALIDATION ====================

function setupFormValidation() {
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 9 digits (Ethiopian number without country code)
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            
            e.target.value = value;
        });
        
        // Remove the "pattern" attribute that causes the browser error
        phoneInput.removeAttribute('pattern');
    }
    
    const telegramInput = document.getElementById('patientTelegram');
    if (telegramInput) {
        telegramInput.addEventListener('input', function(e) {
            if (e.target.value && !e.target.value.startsWith('@')) {
                e.target.value = '@' + e.target.value.replace('@', '');
            }
        });
    }
}

// ==================== BOOKING FORM HANDLER ====================

function initializeBookingForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: document.getElementById('patientName').value.trim(),
            phone: document.getElementById('patientPhone').value.replace(/\D/g, ''), // Remove all non-digits
            telegram: document.getElementById('patientTelegram').value.trim() || '',
            appointment_type: document.getElementById('appointmentType').value,
            clinic_location: document.getElementById('clinicLocation').value,
            preferred_date: document.getElementById('preferredDate').value,
            medical_condition: document.getElementById('medicalCondition').value.trim() || ''
        };
        
        // Validate required fields
        if (!validateFormData(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';
        submitBtn.disabled = true;
        
        try {
            // Send to backend API
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Success - show confirmation
                showSuccessMessage(result.message, result.appointment_id);
                
                // Reset form (but keep date as tomorrow)
                form.reset();
                initializeDatePicker();
                
                // Optional: Send Telegram notification
                logAppointmentToConsole(formData);
                
            } else {
                // Error from server
                showErrorMessage(result.error || 'Booking failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Booking error:', error);
            showErrorMessage('Network error. Please call +251 11 123 4567 to book directly.');
            
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateFormData(data) {
    // Check required fields
    if (!data.name || data.name.length < 2) {
        showErrorMessage('Please enter your full name (minimum 2 characters)');
        return false;
    }
    
    // FIXED: More flexible phone validation
    if (!data.phone || data.phone.length < 9) {
        showErrorMessage('Please enter a valid Ethiopian phone number (9 digits minimum)');
        return false;
    }
    
    if (!data.appointment_type) {
        showErrorMessage('Please select a consultation type');
        return false;
    }
    
    if (!data.clinic_location) {
        showErrorMessage('Please select a clinic location');
        return false;
    }
    
    if (!data.preferred_date) {
        showErrorMessage('Please select a preferred date');
        return false;
    }
    
    return true;
}

// ==================== UI FEEDBACK FUNCTIONS ====================

function showSuccessMessage(message, appointmentId) {
    // Create success modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease;
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: #38a169;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: white;
                font-size: 2.5rem;
            ">
                <i class="fas fa-check"></i>
            </div>
            <h2 style="color: #2c5282; margin-bottom: 15px;">APPOINTMENT CONFIRMED!</h2>
            <p style="margin-bottom: 20px; color: #4a5568; line-height: 1.6;">${message}</p>
            ${appointmentId ? `<p style="background: #f0fff4; padding: 10px; border-radius: 8px; color: #276749; margin: 20px 0;">
                <strong>Reference ID:</strong> DFC-${appointmentId.toString().padStart(4, '0')}
            </p>` : ''}
            <p style="color: #718096; font-size: 0.9rem; margin-bottom: 25px;">
                <i class="fas fa-info-circle"></i> You'll receive a confirmation via SMS/Telegram
            </p>
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                background: #2c5282;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                font-size: 1rem;
            ">
                <i class="fas fa-calendar-check"></i> BOOK ANOTHER
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 10000);
}

function showErrorMessage(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fed7d7;
        color: #9b2c2c;
        padding: 15px 20px;
        border-radius: 10px;
        border-left: 4px solid #e53e3e;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <div>
            <strong>Please check:</strong><br>
            ${message}
        </div>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: #9b2c2c;
            cursor: pointer;
            margin-left: 10px;
        ">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.remove();
        }
    }, 5000);
}

// ==================== UTILITY FUNCTIONS ====================

function initializeMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            if (navMenu.style.display === 'flex') {
                navMenu.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    gap: 15px;
                `;
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.style.display = 'none';
            }
        });
    }
}

function logAppointmentToConsole(data) {
    console.log('📋 New Appointment Request:', {
        patient: data.name,
        phone: data.phone,
        type: data.appointment_type,
        location: data.clinic_location,
        date: data.preferred_date,
        time: new Date().toLocaleString('en-ET')
    });
}

// ==================== ANIMATIONS ====================

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(30px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from { 
            opacity: 0;
            transform: translateX(30px);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ==================== PAGE ENHANCEMENTS ====================

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

console.log('🩺 D.R Feysel Dermatologist Clinic frontend loaded successfully');

// ==================== EASY TEST FUNCTION ====================

// Function to auto-fill form for testing
function testFillForm() {
    document.getElementById('patientName').value = 'Test Patient';
    document.getElementById('patientPhone').value = '0912345678';
    document.getElementById('appointmentType').value = 'first';
    document.getElementById('clinicLocation').value = 'zenebework';
    console.log('✅ Form filled for testing');
}

// ==================== LIVE SECTION COUNTDOWN ====================

function initializeLiveCountdown() {
    function updateLiveCountdown() {
        // Next Saturday at 10:00 AM Ethiopia Time
        const now = new Date();
        const ethiopiaTime = new Date(now.toLocaleString('en-US', {
            timeZone: 'Africa/Addis_Ababa'
        }));
        
        // Calculate next Saturday
        const daysUntilSaturday = (6 - ethiopiaTime.getDay() + 7) % 7 || 7;
        const nextSaturday = new Date(ethiopiaTime);
        nextSaturday.setDate(ethiopiaTime.getDate() + daysUntilSaturday);
        nextSaturday.setHours(10, 0, 0, 0);
        
        const timeDiff = nextSaturday - ethiopiaTime;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            // Update display if elements exist
            if (document.getElementById('liveDays')) {
                document.getElementById('liveDays').textContent = days.toString().padStart(2, '0');
                document.getElementById('liveHours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('liveMinutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('liveSeconds').textContent = seconds.toString().padStart(2, '0');
            }
        } else {
            // Session is live!
            if (document.querySelector('.live-badge-large')) {
                document.querySelector('.live-badge-large').innerHTML = '<i class="fas fa-broadcast-tower"></i> 🔴 LIVE NOW - JOIN US!';
                document.querySelector('.live-badge-large').style.animation = 'pulse 1s infinite';
            }
        }
    }
    
    updateLiveCountdown();
    setInterval(updateLiveCountdown, 1000);
}

function setSessionReminder() {
    alert('⏰ Reminder set! We\'ll notify you 30 minutes before the live session starts.\n\nJoin our Telegram group for instant notifications!');
    // In production, you would integrate with calendar API
}

// Initialize live countdown when page loads
initializeLiveCountdown();

// Live Countdown Timer
function updateLiveTimer() {
    const days = document.getElementById("liveDays");
    const hours = document.getElementById("liveHours");
    const minutes = document.getElementById("liveMinutes");
    const seconds = document.getElementById("liveSeconds");
    
    if (days && hours && minutes && seconds) {
        // Simple countdown
        let d = parseInt(days.textContent);
        let h = parseInt(hours.textContent);
        let m = parseInt(minutes.textContent);
        let s = parseInt(seconds.textContent);
        
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        
        days.textContent = d.toString().padStart(2, "0");
        hours.textContent = h.toString().padStart(2, "0");
        minutes.textContent = m.toString().padStart(2, "0");
        seconds.textContent = s.toString().padStart(2, "0");
    }
}

// Start timer if elements exist
if (document.getElementById("liveDays")) {
    setInterval(updateLiveTimer, 1000);
}
