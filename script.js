// ===========================================
// DR. FEYSEL CLINIC - FINAL WORKING VERSION
// ===========================================

// 🔑 YOUR SUPABASE KEY
const SUPABASE_URL = 'https://iihgacjyaxtkvzpbprcq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaGdhY2p5YXh0a3Z6cGJwcmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDU2MTEsImV4cCI6MjA4NjIyMTYxMX0.nNN5abbsrDGBIpNGm7fQTN8EcpkmJxUL6lXRUsqbMnY';

console.log('🏥 Clinic system starting...');

// Initialize database
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===========================================
// BOOKING FUNCTION (WITH PAGE REFRESH FIX)
// ===========================================

async function bookAppointment(event) {
    // ⚠️ CRITICAL: PREVENT PAGE REFRESH
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    console.log('📅 Booking started (no refresh)');
    
    // Get form data
    const appointment = {
        name: document.getElementById('patientName')?.value || '',
        phone: document.getElementById('patientPhone')?.value || '',
        clinic: document.getElementById('clinicLocation')?.value || 'zenebework',
        appointment_date: document.getElementById('appointmentDate')?.value || '',
        telegram: document.getElementById('telegramUsername')?.value || null,
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
    
    // Show loading
    const button = document.getElementById('bookButton');
    if (button) {
        button.disabled = true;
        button.textContent = 'Booking...';
    }
    
    try {
        console.log('📤 Sending to database...');
        
        const { data, error } = await db
            .from('appointments')
            .insert([appointment])
            .select();
        
        console.log('📥 Response:', { data, error });
        
        if (error) {
            console.error('❌ Database error:', error);
            alert(`❌ Error: ${error.message}\n\nPlease call the clinic.`);
            return false;
        }
        
        // 🎉 SUCCESS!
        const successMessage = `✅ Appointment booked!\n\nReference: FEYSEL-${data[0].id}\n\nDr. Feysel will contact you soon.`;
        console.log('🎉 Success!', successMessage);
        alert(successMessage);
        
        // Clear form
        const form = document.getElementById('appointmentForm');
        if (form) form.reset();
        
        return true;
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        alert('❌ Unexpected error. Please try again or call the clinic.');
        return false;
        
    } finally {
        // Reset button
        if (button) {
            button.disabled = false;
            button.textContent = 'Book Appointment';
        }
    }
}

// ===========================================
// PREVENT ALL FORM SUBMISSIONS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 Page loaded');
    
    // Prevent ALL form submissions on the page
    document.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Connect booking button
    const button = document.getElementById('bookButton');
    if (button) {
        button.addEventListener('click', bookAppointment);
        console.log('✅ Button connected');
    } else {
        console.warn('⚠️ Button not found. Check HTML for id="bookButton"');
        
        // Try to find any submit button
        const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
        submitButtons.forEach(btn => {
            btn.type = 'button';
            btn.addEventListener('click', bookAppointment);
            console.log('Fixed button:', btn);
        });
    }
    
    // Test database connection
    db.from('appointments').select('count', { count: 'exact', head: true })
        .then(({ count, error }) => {
            if (error) {
                console.warn('Database note:', error.message);
            } else {
                console.log(`📊 Database ready. Appointments: ${count}`);
            }
        });
    
    console.log('✅ Clinic system ready!');
});

// Global prevention
window.addEventListener('beforeunload', () => {
    console.log('Page unload prevented if booking in progress');
});
    // Validate required fields
    if (!appointmentData.name || appointmentData.name === 'Not provided') {
        alert('❌ Please enter your name');
        return;
    }
    
    if (!appointmentData.phone || appointmentData.phone === 'Not provided') {
        alert('❌ Please enter your phone number');
        return;
    }
    
    // Show loading state
    const button = document.querySelector('#bookButton, button[type="submit"]');
    if (button) {
        const originalText = button.textContent;
        button.textContent = 'Booking...';
        button.disabled = true;
        
        // Revert button after 5 seconds (safety)
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 5000);
    }
    
    try {
        console.log('Sending appointment:', appointmentData);
        
        // INSERT INTO DATABASE
        const { data, error } = await db
            .from('appointments')
            .insert([appointmentData])
            .select();
        
        if (error) {
            console.error('Database error:', error);
            throw new Error(`Database error: ${error.message}`);
        }
        
        // SUCCESS!
        console.log('Appointment created:', data[0]);
        
        // Show success message
        alert(`✅ Appointment booked successfully!\n\nDr. Feysel will contact you at ${appointmentData.phone} within 2 hours.\n\nYour reference ID: FEYSEL-${data[0].id}`);
        
        // Clear form if it exists
        const form = document.querySelector('form');
        if (form) form.reset();
        
        return { success: true, appointmentId: data[0].id };
        
    } catch (error) {
        console.error('Booking failed:', error);
        
        // User-friendly error messages
        let userMessage = 'Booking failed. ';
        
        if (error.message.includes('RLS')) {
            userMessage += 'Please enable Row Level Security policies in Supabase.';
        } else if (error.message.includes('JWT')) {
            userMessage += 'API key issue. Please check your Supabase configuration.';
        } else if (error.message.includes('network')) {
            userMessage += 'Network error. Please check your internet connection.';
        } else {
            userMessage += 'Please call the clinic directly or try again later.';
        }
        
        alert('❌ ' + userMessage);
        return { success: false, error: error.message };
        
    } finally {
        // Reset button state
        if (button) {
            button.textContent = 'Book Appointment';
            button.disabled = false;
        }
    }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function getValue(selector) {
    const element = document.querySelector(selector);
    return element ? element.value : null;
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ===========================================
// INITIALIZE WEBSITE
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Dr. Feysel Clinic website loaded');
    
    // Connect booking button(s)
    const bookButtons = document.querySelectorAll('#bookButton, .book-button, button[type="submit"]');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            bookAppointment(e);
        });
    });
    
    // Test database connection quietly
    db.from('appointments').select('count', { count: 'exact', head: true })
        .then(({ count, error }) => {
            if (error) {
                console.warn('Database note:', error.message);
            } else {
                console.log(`Database connected. Total appointments: ${count}`);
            }
        });
});

// ===========================================
// ADMIN PANEL LINK (Optional)
// ===========================================

// Add this button somewhere in your website for Dr. Feysel
function addAdminButton() {
    const adminButton = document.createElement('button');
    adminButton.textContent = '👨‍⚕️ Admin Panel';
    adminButton.style.position = 'fixed';
    adminButton.style.bottom = '20px';
    adminButton.style.right = '20px';
    adminButton.style.padding = '10px 15px';
    adminButton.style.background = '#0066cc';
    adminButton.style.color = 'white';
    adminButton.style.border = 'none';
    adminButton.style.borderRadius = '5px';
    adminButton.style.cursor = 'pointer';
    adminButton.style.zIndex = '1000';
    
    adminButton.onclick = function() {
        window.open('admin.html', '_blank');
    };
    
    document.body.appendChild(adminButton);
}

// Uncomment to add admin button
// addAdminButton();


document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Countdown Timer for Live Session
    function updateCountdown() {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3); // 3 days from now
        targetDate.setHours(10, 0, 0, 0); // 10:00 AM
        
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // If countdown is over, set for next week
            targetDate.setDate(targetDate.getDate() + 7);
            const newDistance = targetDate - now;
            updateDisplay(newDistance);
            return;
        }
        
        updateDisplay(distance);
    }
    
    function updateDisplay(distance) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    
    // Booking Option Selection
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            optionCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Update form based on selection
            const type = this.dataset.type;
            updateBookingForm(type);
        });
    });
    
    function updateBookingForm(type) {
        const clinicSelect = document.getElementById('clinicLocation');
        const appointmentType = document.getElementById('appointmentType');
        
        switch(type) {
            case 'online':
                clinicSelect.value = 'online';
                appointmentType.value = 'consultation';
                break;
            case 'followup':
                appointmentType.value = 'followup';
                break;
            default:
                clinicSelect.value = 'zenebework';
        }
    }
    
    // Appointment Form Submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading
            const spinner = document.getElementById('loadingSpinner');
            if (spinner) spinner.style.display = 'flex';
            
            // Simulate API call
            setTimeout(() => {
                if (spinner) spinner.style.display = 'none';
                
                // Show success message
                alert('✅ Appointment booked successfully! You will receive confirmation via SMS and Telegram.');
                
                // Reset form
                appointmentForm.reset();
                
                // Reset booking options
                optionCards.forEach(card => card.classList.remove('active'));
                document.querySelector('.option-card[data-type="clinic"]').classList.add('active');
            }, 1500);
        });
    }
    
    // Live Session Buttons
    const reminderBtn = document.getElementById('reminderBtn');
    if (reminderBtn) {
        reminderBtn.addEventListener('click', function() {
            alert('🔔 Reminder set! We will notify you 1 hour before the live session.');
            this.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
            this.disabled = true;
        });
    }
    
    const joinLiveBtn = document.getElementById('joinLiveBtn');
    if (joinLiveBtn) {
        joinLiveBtn.addEventListener('click', function() {
            alert('🎥 Live session will start soon. The link will be activated 15 minutes before start time.');
        });
    }
    
    // Quick Booking FAB
    const quickBookBtn = document.getElementById('quickBookBtn');
    if (quickBookBtn) {
        quickBookBtn.addEventListener('click', function() {
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Language Switch
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In real implementation, you would change content language here
            const lang = this.textContent.toLowerCase();
            console.log('Switching to:', lang);
        });
    });
    
    // Form Date Validation - Set min date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Smooth Scroll for Navigation Links
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
    
    // Active Navigation on Scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Telegram Integration Simulation
    const telegramLinks = document.querySelectorAll('a[href*="telegram"], .telegram-fab');
    telegramLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('telegram')) {
                console.log('📱 Opening Telegram...');
                // In production, this would open Telegram app or web
            }
        });
    });
});
