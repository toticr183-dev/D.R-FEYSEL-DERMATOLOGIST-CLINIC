// ==================== DOCTOR PORTAL - IMPROVED VERSION ====================

// Doctor login page - MORE PROFESSIONAL
app.get('/doctor', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Medical Portal - D.R Feysel Dermatologist Clinic</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Poppins', sans-serif; 
                    background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .medical-portal {
                    background: white;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 450px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .portal-header {
                    background: linear-gradient(90deg, #2c5282, #38a169);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .portal-header h1 {
                    font-size: 1.8rem;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }
                .portal-header p {
                    opacity: 0.9;
                    font-size: 0.9rem;
                }
                .portal-body {
                    padding: 40px;
                }
                .form-group {
                    margin-bottom: 25px;
                }
                .form-group label {
                    display: block;
                    color: #4a5568;
                    margin-bottom: 8px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .form-group input {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .form-group input:focus {
                    outline: none;
                    border-color: #4299e1;
                    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
                }
                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(90deg, #2c5282, #38a169);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: transform 0.3s;
                }
                .login-btn:hover {
                    transform: translateY(-2px);
                }
                .credentials-box {
                    background: #f7fafc;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 25px;
                    border-left: 4px solid #4299e1;
                }
                .credentials-box h4 {
                    color: #2d3748;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .credential-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .credential-item:last-child {
                    border-bottom: none;
                }
                .label {
                    color: #718096;
                }
                .value {
                    color: #2d3748;
                    font-weight: 500;
                }
                .back-link {
                    text-align: center;
                    margin-top: 25px;
                }
                .back-link a {
                    color: #4299e1;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .error-message {
                    background: #fed7d7;
                    color: #9b2c2c;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    display: none;
                    border-left: 4px solid #e53e3e;
                }
                @media (max-width: 480px) {
                    .portal-body { padding: 30px 20px; }
                    .portal-header { padding: 25px 20px; }
                }
            </style>
        </head>
        <body>
            <div class="medical-portal">
                <div class="portal-header">
                    <h1><i class="fas fa-user-md"></i> MEDICAL STAFF PORTAL</h1>
                    <p>D.R Feysel Dermatologist Clinic - Secure Access</p>
                </div>
                
                <div class="portal-body">
                    <div id="errorMessage" class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <span id="errorText"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="doctorUsername"><i class="fas fa-user"></i> Medical ID</label>
                        <input type="text" id="doctorUsername" placeholder="Enter your medical ID" value="drfeysel">
                    </div>
                    
                    <div class="form-group">
                        <label for="doctorPassword"><i class="fas fa-lock"></i> Security Code</label>
                        <input type="password" id="doctorPassword" placeholder="Enter security code" value="dermatology2024">
                    </div>
                    
                    <button class="login-btn" onclick="doctorLogin()">
                        <i class="fas fa-sign-in-alt"></i> ACCESS MEDICAL DASHBOARD
                    </button>
                    
                    <div class="credentials-box">
                        <h4><i class="fas fa-key"></i> DEMO ACCESS</h4>
                        <div class="credential-item">
                            <span class="label">Medical ID:</span>
                            <span class="value">drfeysel</span>
                        </div>
                        <div class="credential-item">
                            <span class="label">Security Code:</span>
                            <span class="value">dermatology2024</span>
                        </div>
                        <div class="credential-item">
                            <span class="label">Role:</span>
                            <span class="value">Dermatology Specialist</span>
                        </div>
                    </div>
                    
                    <div class="back-link">
                        <a href="/"><i class="fas fa-arrow-left"></i> Back to Patient Portal</a>
                    </div>
                </div>
            </div>

            <script>
                async function doctorLogin() {
                    const username = document.getElementById('doctorUsername').value.trim();
                    const password = document.getElementById('doctorPassword').value.trim();
                    const errorDiv = document.getElementById('errorMessage');
                    const errorText = document.getElementById('errorText');
                    
                    // Hide error
                    errorDiv.style.display = 'none';
                    
                    if (!username || !password) {
                        showError('Please enter both Medical ID and Security Code');
                        return;
                    }
                    
                    try {
                        const response = await fetch('/api/doctor/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            // Store doctor info
                            localStorage.setItem('medical_staff', JSON.stringify(data.doctor));
                            localStorage.setItem('clinic', data.clinic);
                            
                            // Redirect to dashboard
                            window.location.href = '/doctor/dashboard';
                        } else {
                            showError('Access denied. Invalid credentials.');
                        }
                    } catch (error) {
                        console.error('Login error:', error);
                        showError('Medical system unavailable. Please try again.');
                    }
                }
                
                function showError(message) {
                    const errorDiv = document.getElementById('errorMessage');
                    const errorText = document.getElementById('errorText');
                    errorText.textContent = message;
                    errorDiv.style.display = 'flex';
                    errorDiv.style.alignItems = 'center';
                    errorDiv.style.gap = '10px';
                }
                
                // Enter key support
                document.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') doctorLogin();
                });
                
                // Auto-focus on username
                document.getElementById('doctorUsername').focus();
            </script>
        </body>
        </html>
    `);
});
