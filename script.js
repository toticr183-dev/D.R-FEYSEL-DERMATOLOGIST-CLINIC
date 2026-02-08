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
