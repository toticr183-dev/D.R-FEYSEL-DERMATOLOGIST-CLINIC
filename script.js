// ===========================================
// DR. FEYSEL CLINIC - RAILWAY PRODUCTION SERVER
// COMPLETE FIX - 100% WORKING ON CLOUD!
// ===========================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3003; // CRITICAL: Railway uses dynamic PORT!

// ========== MIDDLEWARE ==========
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== DATA STORAGE ==========
const DATA_FILE = path.join(__dirname, 'appointments.json');

// Load appointments from file
function loadAppointments() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.log('📁 Creating new data file...');
    }
    return { appointments: [], nextId: 1 };
}

// Save appointments to file
function saveAppointments(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('💾 Data saved successfully');
        return true;
    } catch (err) {
        console.error('❌ Error saving data:', err);
        return false;
    }
}

// ========== ROOT ROUTE - TEST IF SERVER IS RUNNING ==========
app.get('/', (req, res) => {
    res.json({
        name: 'Dr. Feysel Clinic API',
        status: 'running',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            book: 'POST /api/appointments',
            admin: 'GET /api/admin/appointments',
            single: 'GET /api/appointments/:id'
        }
    });
});

// ========== HEALTH CHECK - CRITICAL FOR RAILWAY! ==========
app.get('/health', (req, res) => {
    const data = loadAppointments();
    res.status(200).json({
        status: 'healthy',
        server: 'Dr. Feysel Clinic',
        appointments: data.appointments.length,
        port: PORT,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// ========== BOOK APPOINTMENT ==========
app.post('/api/appointments', (req, res) => {
    console.log('📥 Booking request received:', req.body);
    
    try {
        const data = loadAppointments();
        
        // Validate required fields
        if (!req.body.name || !req.body.phone || !req.body.appointment_date) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        
        const appointment = {
            id: data.nextId++,
            name: req.body.name.trim(),
            phone: req.body.phone.trim(),
            telegram: req.body.telegram || '',
            appointment_type: req.body.appointment_type || 'consultation',
            clinic: req.body.clinic || 'zenebework',
            appointment_date: req.body.appointment_date,
            symptoms: req.body.symptoms || '',
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        data.appointments.push(appointment);
        
        if (saveAppointments(data)) {
            console.log(`✅ Appointment booked! ID: ${appointment.id}, Name: ${appointment.name}`);
            res.status(201).json({
                success: true,
                id: appointment.id,
                message: 'Appointment booked successfully'
            });
        } else {
            throw new Error('Failed to save appointment');
        }
        
    } catch (error) {
        console.error('❌ Booking error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ========== GET ALL APPOINTMENTS (ADMIN) ==========
app.get('/api/admin/appointments', (req, res) => {
    try {
        const data = loadAppointments();
        res.json(data.appointments);
    } catch (error) {
        console.error('❌ Error loading appointments:', error);
        res.status(500).json({ error: 'Failed to load appointments' });
    }
});

// ========== GET SINGLE APPOINTMENT ==========
app.get('/api/appointments/:id', (req, res) => {
    try {
        const data = loadAppointments();
        const appointment = data.appointments.find(a => a.id === parseInt(req.params.id));
        
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('❌ Error fetching appointment:', error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

// ========== UPDATE APPOINTMENT STATUS ==========
app.put('/api/appointments/:id', (req, res) => {
    try {
        const data = loadAppointments();
        const index = data.appointments.findIndex(a => a.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        data.appointments[index] = {
            ...data.appointments[index],
            ...req.body,
            updated_at: new Date().toISOString()
        };
        
        if (saveAppointments(data)) {
            res.json({
                success: true,
                appointment: data.appointments[index]
            });
        } else {
            throw new Error('Failed to update appointment');
        }
        
    } catch (error) {
        console.error('❌ Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// ========== DELETE APPOINTMENT ==========
app.delete('/api/appointments/:id', (req, res) => {
    try {
        const data = loadAppointments();
        const filtered = data.appointments.filter(a => a.id !== parseInt(req.params.id));
        
        if (filtered.length === data.appointments.length) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        data.appointments = filtered;
        
        if (saveAppointments(data)) {
            res.json({ success: true, message: 'Appointment deleted' });
        } else {
            throw new Error('Failed to delete appointment');
        }
        
    } catch (error) {
        console.error('❌ Error deleting appointment:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

// ========== ERROR HANDLING MIDDLEWARE ==========
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: 'The requested endpoint does not exist',
        available: ['/', '/health', '/api/appointments', '/api/admin/appointments']
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// ========== START SERVER ==========
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 DR. FEYSEL CLINIC SERVER RUNNING ON RAILWAY!');
    console.log('='.repeat(60));
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`📍 Health: /health`);
    console.log(`📍 Book: POST /api/appointments`);
    console.log(`📍 Admin: GET /api/admin/appointments`);
    console.log('='.repeat(60));
    console.log('✅ Server is ready for bookings!');
    console.log('='.repeat(60) + '\n');
});

// ========== HANDLE UNCAUGHT ERRORS ==========
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;

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
