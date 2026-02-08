const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Database
const db = new sqlite3.Database('dermatology.db');

// Create professional tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        telegram TEXT,
        appointment_type TEXT DEFAULT 'consultation',
        clinic_location TEXT DEFAULT 'Zenebework',
        preferred_date TEXT,
        medical_condition TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Insert Dr. Feysel as default doctor
    db.run(`INSERT OR IGNORE INTO doctors (full_name, specialization, username, password) 
            VALUES ('Dr. Feysel Mohammed', 'Dermatology Specialist', 'drfeysel', 'dermatology2024')`);
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ==================== API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        clinic: "D.R Feysel Dermatologist Clinic",
        status: "OPERATIONAL",
        version: "1.0.0",
        time: new Date().toISOString()
    });
});

// Book appointment
app.post('/api/appointments', (req, res) => {
    const { name, phone, telegram, appointment_type, clinic_location, preferred_date, medical_condition } = req.body;
    
    if (!name || !phone) {
        return res.json({ success: false, error: 'Patient name and phone are required' });
    }
    
    db.run(`INSERT INTO appointments 
            (name, phone, telegram, appointment_type, clinic_location, preferred_date, medical_condition) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            name, 
            phone, 
            telegram || '', 
            appointment_type || 'consultation', 
            clinic_location || 'Zenebework', 
            preferred_date, 
            medical_condition || ''
        ],
        function(err) {
            if (err) {
                console.error('Database error:', err);
                res.json({ success: false, error: 'System error. Please call clinic directly.' });
            } else {
                console.log('✅ New Dermatology Appointment:', { name, phone, appointment_type });
                res.json({ 
                    success: true, 
                    message: 'Appointment request received! Dr. Feysel will contact you within 2 hours.',
                    appointment_id: this.lastID,
                    clinic: 'D.R Feysel Dermatologist Clinic'
                });
            }
        }
    );
});

// Doctor login
app.post('/api/doctor/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM doctors WHERE username = ? AND password = ?', 
        [username, password], (err, doctor) => {
            if (err || !doctor) {
                res.status(401).json({ 
                    success: false, 
                    error: 'Invalid doctor credentials' 
                });
            } else {
                res.json({ 
                    success: true, 
                    doctor: {
                        id: doctor.id,
                        name: doctor.full_name,
                        specialization: doctor.specialization
                    },
                    clinic: 'D.R Feysel Dermatologist Clinic'
                });
            }
        }
    );
});

// Get all appointments (doctor only)
app.get('/api/doctor/appointments', (req, res) => {
    db.all(`SELECT * FROM appointments ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({
                clinic: 'D.R Feysel Dermatologist Clinic',
                total: rows.length,
                appointments: rows
            });
        }
    });
});

// Update appointment status
app.patch('/api/appointments/:id/status', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    db.run('UPDATE appointments SET status = ? WHERE id = ?', 
        [status, req.params.id], function(err) {
            if (err) {
                res.status(500).json({ success: false, error: err.message });
            } else {
                res.json({ 
                    success: true, 
                    updated: this.changes,
                    message: `Appointment marked as ${status}`
                });
            }
        }
    );
});

// ==================== FRONTEND ROUTES ====================

// Main clinic website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Doctor portal
app.get('/doctor', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Doctor Portal - D.R Feysel Dermatologist Clinic</title>
            <style>
                body { font-family: Arial; padding: 40px; text-align: center; background: #f0f8ff; }
                .portal { max-width: 400px; margin: 50px auto; padding: 40px; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,100,200,0.1); }
                h2 { color: #2c5282; }
                input, button { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e0; border-radius: 8px; }
                button { background: #2c5282; color: white; font-weight: bold; cursor: pointer; }
                .credentials { background: #ebf8ff; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; color: #2d3748; }
            </style>
        </head>
        <body>
            <h1>🩺 D.R Feysel Dermatologist Clinic</h1>
            <h2>Doctor Portal</h2>
            <div class="portal">
                <input type="text" id="username" placeholder="Doctor Username" value="drfeysel">
                <input type="password" id="password" placeholder="Password" value="dermatology2024">
                <button onclick="login()">Access Patient Management</button>
                <div class="credentials">
                    <strong>Demo Credentials:</strong><br>
                    Username: drfeysel<br>
                    Password: dermatology2024
                </div>
            </div>
            <script>
                async function login() {
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    
                    try {
                        const response = await fetch('/api/doctor/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            localStorage.setItem('doctor', JSON.stringify(data.doctor));
                            window.location.href = '/doctor/dashboard';
                        } else {
                            alert('Access denied. Invalid credentials.');
                        }
                    } catch (error) {
                        alert('System unavailable. Please try again.');
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Doctor dashboard
app.get('/doctor/dashboard', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dashboard - D.R Feysel Dermatologist Clinic</title>
            <style>
                body { font-family: Arial; margin: 0; background: #f7fafc; }
                .header { background: white; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 20px; }
                .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center; }
                .stat-card h3 { color: #4a5568; margin: 0 0 10px 0; font-size: 14px; }
                .stat-card p { font-size: 24px; font-weight: bold; color: #2d3748; margin: 0; }
                table { width: 100%; background: white; border-collapse: collapse; margin: 20px; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
                th { background: #edf2f7; color: #2d3748; }
                .status { padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
                .status-pending { background: #feebc8; color: #c05621; }
                .status-confirmed { background: #c6f6d5; color: #276749; }
                button { padding: 5px 10px; margin: 2px; border: none; border-radius: 5px; cursor: pointer; }
                .btn-confirm { background: #38a169; color: white; }
                .btn-cancel { background: #e53e3e; color: white; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Doctor Dashboard - D.R Feysel Dermatologist Clinic</h1>
                <button onclick="window.location.href='/doctor'">← Logout</button>
            </div>
            
            <div class="stats">
                <div class="stat-card"><h3>Total Appointments</h3><p id="total">0</p></div>
                <div class="stat-card"><h3>Pending</h3><p id="pending">0</p></div>
                <div class="stat-card"><h3>Confirmed</h3><p id="confirmed">0</p></div>
                <div class="stat-card"><h3>Today</h3><p id="today">0</p></div>
            </div>
            
            <h2 style="padding: 0 20px;">Patient Appointments</h2>
            <div id="appointments">Loading...</div>
            
            <script>
                const doctor = JSON.parse(localStorage.getItem('doctor'));
                if (!doctor) window.location.href = '/doctor';
                
                async function loadAppointments() {
                    try {
                        const response = await fetch('/api/doctor/appointments');
                        const data = await response.json();
                        
                        // Update stats
                        document.getElementById('total').textContent = data.total;
                        
                        const pending = data.appointments.filter(a => a.status === 'pending').length;
                        const confirmed = data.appointments.filter(a => a.status === 'confirmed').length;
                        const today = data.appointments.filter(a => {
                            const aptDate = new Date(a.created_at).toDateString();
                            return aptDate === new Date().toDateString();
                        }).length;
                        
                        document.getElementById('pending').textContent = pending;
                        document.getElementById('confirmed').textContent = confirmed;
                        document.getElementById('today').textContent = today;
                        
                        // Update table
                        let html = '<table>';
                        html += '<thead><tr><th>ID</th><th>Patient</th><th>Phone</th><th>Type</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>';
                        html += '<tbody>';
                        
                        data.appointments.forEach(apt => {
                            html += \`<tr>
                                <td>\${apt.id}</td>
                                <td><b>\${apt.name}</b></td>
                                <td>\${apt.phone}</td>
                                <td>\${apt.appointment_type}</td>
                                <td><span class="status status-\${apt.status}">\${apt.status}</span></td>
                                <td>\${new Date(apt.created_at).toLocaleDateString()}</td>
                                <td>
                                    \${apt.status === 'pending' ? '<button class="btn-confirm" onclick="updateStatus(' + apt.id + ', \\'confirmed\\')">Confirm</button>' : ''}
                                    <button class="btn-cancel" onclick="updateStatus(' + apt.id + ', \\'cancelled\\')">Cancel</button>
                                </td>
                            </tr>\`;
                        });
                        
                        html += '</tbody></table>';
                        document.getElementById('appointments').innerHTML = html;
                    } catch (error) {
                        document.getElementById('appointments').innerHTML = 'Error loading appointments';
                    }
                }
                
                async function updateStatus(id, status) {
                    if (!confirm('Change appointment status to \"' + status + '\"?')) return;
                    
                    try {
                        const response = await fetch('/api/appointments/' + id + '/status', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status })
                        });
                        
                        const data = await response.json();
                        if (data.success) {
                            loadAppointments();
                        }
                    } catch (error) {
                        alert('Update failed');
                    }
                }
                
                loadAppointments();
                setInterval(loadAppointments, 10000);
            </script>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ==========================================================
    🩺 D.R FEYSEL DERMATOLOGIST CLINIC - PROFESSIONAL SYSTEM
    ==========================================================
    ✅ Patient Portal:  http://localhost:${PORT}
    ✅ Doctor Portal:   http://localhost:${PORT}/doctor
    ✅ API Health:      http://localhost:${PORT}/api/health
    ✅ Database:        dermatology.db (SQLite)
    
    🔑 Doctor Credentials:
       Username: drfeysel
       Password: dermatology2024
    
    ⏰ Started: ${new Date().toLocaleString('en-ET')}
    ==========================================================
    `);
});
