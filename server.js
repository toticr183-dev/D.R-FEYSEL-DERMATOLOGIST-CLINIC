// ===========================================
// DR. FEYSEL CLINIC - RAILWAY PRODUCTION SERVER
// HEALTHCHECK FIXED - GUARANTEED TO WORK!
// ===========================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Railway injects this!

// ========== MIDDLEWARE ==========
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ========== SIMPLE DATA STORAGE ==========
const DATA_FILE = path.join(__dirname, 'appointments.json');

function loadAppointments() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (err) {
        console.log('Creating new data file...');
    }
    return { appointments: [], nextId: 1 };
}

function saveAppointments(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Save error:', err);
        return false;
    }
}

// ========== HEALTH CHECK - SIMPLE & FAST ==========
// THIS MUST RESPOND QUICKLY FOR RAILWAY!
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: Date.now(),
        message: 'Dr. Feysel Clinic is running!'
    });
});

// ========== ROOT ROUTE ==========
app.get('/', (req, res) => {
    res.json({
        name: 'Dr. Feysel Clinic',
        status: 'running',
        endpoints: ['/health', '/api/appointments', '/api/admin/appointments']
    });
});

// ========== BOOK APPOINTMENT ==========
app.post('/api/appointments', (req, res) => {
    try {
        const data = loadAppointments();
        
        const appointment = {
            id: data.nextId++,
            name: req.body.name || '',
            phone: req.body.phone || '',
            telegram: req.body.telegram || '',
            appointment_type: req.body.appointment_type || 'consultation',
            clinic: req.body.clinic || 'zenebework',
            appointment_date: req.body.appointment_date || '',
            symptoms: req.body.symptoms || '',
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        data.appointments.push(appointment);
        saveAppointments(data);
        
        res.json({ 
            success: true, 
            id: appointment.id,
            message: 'Appointment booked!'
        });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== GET APPOINTMENTS ==========
app.get('/api/admin/appointments', (req, res) => {
    const data = loadAppointments();
    res.json(data.appointments);
});

// ========== START SERVER ==========
app.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(50));
    console.log(`✅ HEALTHCHECK FIXED! Server running on port ${PORT}`);
    console.log(`🌍 Health: /health`);
    console.log('='.repeat(50) + '\n');
});
