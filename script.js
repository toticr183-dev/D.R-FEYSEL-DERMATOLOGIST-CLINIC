// ===========================================
// DR. FEYSEL CLINIC - MINIMAL WORKING VERSION
// STEP 1: JUST MAKE BOOKING WORK
// ===========================================

console.log('🚀 STEP 1: Starting fresh...');

// 1. SUPABASE SETUP (YOUR KEY)
const SUPABASE_URL = 'https://iihgacjyaxtkvzpbprcq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaGdhY2p5YXh0a3Z6cGJwcmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDU2MTEsImV4cCI6MjA4NjIyMTYxMX0.nNN5abbsrDGBIpNGm7fQTN8EcpkmJxUL6lXRUsqbMnY';

// 2. INITIALIZE
let db;
try {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Database connected');
} catch (err) {
    console.error('❌ Database error:', err);
}

// 3. SIMPLE TEST FUNCTION
window.testBooking = async function() {
    console.log('🧪 TEST: Starting booking test...');
    
    // Simple test data
    const testAppointment = {
        name: 'Test Patient',
        phone: '+251911223344',
        clinic: 'zenebework',
        appointment_date: '2024-03-25',
        status: 'pending'
    };
    
    console.log('Sending:', testAppointment);
    
    try {
        const { data, error } = await db
            .from('appointments')
            .insert([testAppointment])
            .select();
        
        if (error) {
            console.error('❌ Error:', error);
            alert('Test failed: ' + error.message);
        } else {
            console.log('✅ Success! ID:', data[0].id);
            alert('🎉 TEST PASSED! Appointment ID: ' + data[0].id);
        }
    } catch (err) {
        console.error('❌ Exception:', err);
        alert('Exception: ' + err.message);
    }
};

// 4. CONNECT REAL BUTTON
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded');
    
    // Find booking button
    const bookButton = document.querySelector('.btn.btn-primary.btn-block');
    console.log('Found button?', !!bookButton);
    
    if (bookButton) {
        // Change type to prevent form submit
        bookButton.type = 'button';
        
        // Add simple click handler
        bookButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('🎯 Button clicked!');
            
            // Get form data
            const appointment = {
                name: document.getElementById('patientName')?.value || 'No name',
                phone: document.getElementById('patientPhone')?.value || 'No phone',
                clinic: document.getElementById('clinicLocation')?.value || 'zenebework',
                appointment_date: document.getElementById('appointmentDate')?.value || '2024-03-25',
                status: 'pending'
            };
            
            console.log('Form data:', appointment);
            
            // Disable button
            bookButton.disabled = true;
            bookButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            
            try {
                const { data, error } = await db
                    .from('appointments')
                    .insert([appointment])
                    .select();
                
                if (error) throw error;
                
                alert(`✅ Success! Booked appointment ID: ${data[0].id}`);
                document.getElementById('appointmentForm')?.reset();
                
            } catch (error) {
                console.error('Booking error:', error);
                alert('❌ Failed: ' + error.message);
            } finally {
                bookButton.disabled = false;
                bookButton.innerHTML = '<i class="fas fa-paper-plane"></i> Book Appointment Now';
            }
        });
        
        console.log('✅ Button connected!');
    }
    
    // Test connection
    if (db) {
        db.from('appointments').select('count', { count: 'exact', head: true })
            .then(result => {
                console.log('📊 Database has', result.count || 0, 'appointments');
            });
    }
});

console.log('🚀 STEP 1 COMPLETE: System ready for testing!');
