// Initialize EmailJS with your Public Key
(function() {
    emailjs.init("bNMnbBM8j0LWscRS3"); // Your Public Key
})();

// Global Variables
let currentStep = 1;
let selectedCategory = '';
let uploadedFiles = {
    logo: null,
    photos: [],
    docs: []
};

// ==================== STEP NAVIGATION ====================
function nextStep() {
    if (currentStep === 1 && !selectedCategory) {
        showToast('Please select a category first', 'error');
        return;
    }
    
    if (currentStep === 2 && !validateStep2()) {
        return;
    }
    
    if (currentStep < 4) {
        document.getElementById(`step${currentStep}-form`).classList.remove('active');
        document.getElementById(`step${currentStep}-indicator`).classList.remove('active');
        
        currentStep++;
        
        document.getElementById(`step${currentStep}-form`).classList.add('active');
        document.getElementById(`step${currentStep}-indicator`).classList.add('active');
        
        // Update progress bar
        document.getElementById('progressFill').style.width = `${currentStep * 25}%`;
        
        // If moving to review step, populate review content
        if (currentStep === 4) {
            populateReview();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}-form`).classList.remove('active');
        document.getElementById(`step${currentStep}-indicator`).classList.remove('active');
        
        currentStep--;
        
        document.getElementById(`step${currentStep}-form`).classList.add('active');
        document.getElementById(`step${currentStep}-indicator`).classList.add('active');
        
        // Update progress bar
        document.getElementById('progressFill').style.width = `${currentStep * 25}%`;
    }
}

// ==================== CATEGORY SELECTION ====================
function selectCategory(category) {
    selectedCategory = category;
    
    // Remove selected class from all cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    document.getElementById(`cat-${category}`).classList.add('selected');
    
    // Enable next button
    document.getElementById('nextToDetails').disabled = false;
    
    // Update details title
    const titles = {
        'school': '🏫 School Website Details',
        'hospital': '🏥 Hospital Website Details',
        'church': '⛪ Church Website Details',
        'hotel': '🏨 Hotel Website Details',
        'restaurant': '🍽️ Restaurant Website Details',
        'business': '💼 Business Website Details',
        'ngo': '🤝 NGO Website Details',
        'portfolio': '🎨 Portfolio Website Details'
    };
    
    document.getElementById('detailsTitle').textContent = titles[category] || 'Enter Your Details';
    
    // Hide all category forms
    document.querySelectorAll('[id$="Fields"]').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show selected category form
    document.getElementById(`${category}Fields`).style.display = 'block';
}

// ==================== VALIDATION ====================
function validateStep2() {
    // Add validation logic based on selected category
    // This is a basic example - you can expand based on your needs
    
    if (selectedCategory === 'school') {
        const required = ['schoolName', 'schoolRegNumber', 'schoolPrincipal', 'schoolPhone', 'schoolEmail'];
        for (let field of required) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                showToast('Please fill all required fields', 'error');
                return false;
            }
        }
    }
    
    // Add validation for other categories...
    // You can expand this based on your form structure
    
    return true;
}

// ==================== FILE HANDLING ====================
function handleFileSelect(type) {
    const input = document.getElementById(`${type}Input`);
    const fileList = document.getElementById(`${type}List`);
    
    if (type === 'logo') {
        uploadedFiles.logo = input.files[0];
        if (uploadedFiles.logo) {
            fileList.innerHTML = `<span>📎 ${uploadedFiles.logo.name}</span>`;
        } else {
            fileList.innerHTML = '';
        }
    } else if (type === 'photos') {
        uploadedFiles.photos = Array.from(input.files);
        if (uploadedFiles.photos.length > 0) {
            fileList.innerHTML = uploadedFiles.photos.map(f => 
                `<span>📷 ${f.name}</span>`
            ).join('');
        } else {
            fileList.innerHTML = '';
        }
    } else if (type === 'docs') {
        uploadedFiles.docs = Array.from(input.files);
        if (uploadedFiles.docs.length > 0) {
            fileList.innerHTML = uploadedFiles.docs.map(f => 
                `<span>📄 ${f.name}</span>`
            ).join('');
        } else {
            fileList.innerHTML = '';
        }
    }
}

// ==================== REVIEW PAGE ====================
function populateReview() {
    let html = '<div class="review-section">';
    html += '<h3>Category Selected</h3>';
    html += `<div class="review-item"><span class="label">Website Type:</span> <span class="value">${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span></div>`;
    html += '</div>';
    
    // Add all form fields based on category
    const categoryFields = document.getElementById(`${selectedCategory}Fields`);
    const inputs = categoryFields.querySelectorAll('input:not([type="checkbox"]):not([type="file"]), select, textarea');
    
    html += '<div class="review-section">';
    html += '<h3>Project Details</h3>';
    
    inputs.forEach(input => {
        if (input.id && input.value) {
            const label = input.previousElementSibling ? 
                input.previousElementSibling.textContent.replace('*', '').trim() : 
                input.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            html += `<div class="review-item"><span class="label">${label}:</span> <span class="value">${input.value}</span></div>`;
        }
    });
    
    // Add checkboxes
    const checkboxes = categoryFields.querySelectorAll('input[type="checkbox"]:checked');
    if (checkboxes.length > 0) {
        const checkboxValues = Array.from(checkboxes).map(cb => cb.value).join(', ');
        html += `<div class="review-item"><span class="label">Selected Options:</span> <span class="value">${checkboxValues}</span></div>`;
    }
    
    html += '</div>';
    
    // Add file information
    html += '<div class="review-section">';
    html += '<h3>Uploaded Files</h3>';
    
    if (uploadedFiles.logo) {
        html += `<div class="review-item"><span class="label">Logo:</span> <span class="value">${uploadedFiles.logo.name}</span></div>`;
    }
    
    if (uploadedFiles.photos.length > 0) {
        html += `<div class="review-item"><span class="label">Photos:</span> <span class="value">${uploadedFiles.photos.length} file(s)</span></div>`;
    }
    
    if (uploadedFiles.docs.length > 0) {
        html += `<div class="review-item"><span class="label">Documents:</span> <span class="value">${uploadedFiles.docs.length} file(s)</span></div>`;
    }
    
    if (!uploadedFiles.logo && uploadedFiles.photos.length === 0 && uploadedFiles.docs.length === 0) {
        html += '<div class="review-item"><span class="value">No files uploaded</span></div>';
    }
    
    html += '</div>';
    
    document.getElementById('reviewContent').innerHTML = html;
}

// ==================== GENERATE TEXT FILE CONTENT ====================
function generateProjectBrief() {
    let content = `========================================\n`;
    content += `    WEBSITE PROJECT BRIEF\n`;
    content += `    Generated: ${new Date().toLocaleString()}\n`;
    content += `========================================\n\n`;
    
    content += `CATEGORY: ${selectedCategory.toUpperCase()}\n`;
    content += `----------------------------------------\n\n`;
    
    // Get all fields from selected category
    const categoryFields = document.getElementById(`${selectedCategory}Fields`);
    
    // Group by sections
    const sections = categoryFields.querySelectorAll('.section-divider');
    
    sections.forEach(section => {
        const sectionTitle = section.querySelector('span').textContent;
        content += `\n${sectionTitle}\n`;
        content += `${'-'.repeat(sectionTitle.length)}\n`;
        
        // Get inputs that appear after this section until next section
        let nextElement = section.nextElementSibling;
        while (nextElement && !nextElement.classList.contains('section-divider')) {
            if (nextElement.classList.contains('form-group') || nextElement.classList.contains('form-row')) {
                const inputs = nextElement.querySelectorAll('input:not([type="file"]):not([type="checkbox"]), select, textarea');
                inputs.forEach(input => {
                    if (input.id && input.value) {
                        const label = input.previousElementSibling ? 
                            input.previousElementSibling.textContent.replace('*', '').trim() : 
                            input.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        content += `${label}: ${input.value}\n`;
                    }
                });
                
                // Handle checkboxes in this group
                const checkboxes = nextElement.querySelectorAll('input[type="checkbox"]:checked');
                if (checkboxes.length > 0) {
                    const checkboxGroup = nextElement.querySelector('label:not(.checkbox-label)') ? 
                        nextElement.querySelector('label:not(.checkbox-label)').textContent.replace('*', '').trim() : 
                        'Selected Options';
                    content += `${checkboxGroup}: ${Array.from(checkboxes).map(cb => cb.value).join(', ')}\n`;
                }
            }
            nextElement = nextElement.nextElementSibling;
        }
        content += '\n';
    });
    
    // Add file information
    content += `\n========================================\n`;
    content += `UPLOADED FILES\n`;
    content += `========================================\n`;
    
    if (uploadedFiles.logo) {
        content += `Logo: ${uploadedFiles.logo.name} (${(uploadedFiles.logo.size / 1024).toFixed(2)} KB)\n`;
    }
    
    if (uploadedFiles.photos.length > 0) {
        content += `\nPhotos:\n`;
        uploadedFiles.photos.forEach(file => {
            content += `  - ${file.name} (${(file.size / 1024).toFixed(2)} KB)\n`;
        });
    }
    
    if (uploadedFiles.docs.length > 0) {
        content += `\nDocuments:\n`;
        uploadedFiles.docs.forEach(file => {
            content += `  - ${file.name} (${(file.size / 1024).toFixed(2)} KB)\n`;
        });
    }
    
    content += `\n========================================\n`;
    content += `END OF BRIEF\n`;
    content += `========================================\n`;
    
    return content;
}

// ==================== SUBMIT FORM ====================
async function submitForm() {
    if (!document.getElementById('agreeTerms').checked) {
        showToast('Please confirm that the information is accurate', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Get client information
        const clientName = getClientName();
        const clientEmail = getClientEmail();
        const clientPhone = getClientPhone();
        
        // Generate the detailed project brief
        const briefContent = generateProjectBrief();
        
        // Prepare template parameters
        const templateParams = {
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            category: selectedCategory,
            project_details: briefContent,
            submitted_at: new Date().toLocaleString(),
            file_count: getFileCount()
        };
        
        console.log('Sending email with params:', templateParams); // For debugging
        
        // Send email using your credentials
        const response = await emailjs.send(
            'service_8446sxe',      // Your Service ID
            'template_wneix48',      // Your Template ID
            templateParams
        );
        
        console.log('Email sent successfully:', response);
        showToast('Project brief sent successfully! We\'ll contact you within 24 hours.', 'success');
        
        // Save a backup copy locally (optional)
        saveBackupCopy(briefContent);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            resetForm();
        }, 3000);
        
    } catch (error) {
        console.error('Error sending email:', error);
        showToast('Failed to send. Please try again or contact us directly.', 'error');
        
        // Save backup so they don't lose data
        const briefContent = generateProjectBrief();
        saveBackupCopy(briefContent);
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Project Brief';
    }
}

// Helper function to get client name
function getClientName() {
    // Try to find name fields in your form
    const nameInputs = document.querySelectorAll('input[type="text"]');
    for (let input of nameInputs) {
        if (input.id.includes('name') || input.id.includes('Name') || 
            (input.placeholder && input.placeholder.includes('name'))) {
            if (input.value) return input.value;
        }
    }
    return 'Not provided';
}

// Helper function to get client email
function getClientEmail() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    for (let input of emailInputs) {
        if (input.value) return input.value;
    }
    return 'Not provided';
}

// Helper function to get client phone
function getClientPhone() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    for (let input of phoneInputs) {
        if (input.value) return input.value;
    }
    return 'Not provided';
}

// Helper function to count uploaded files
function getFileCount() {
    let count = 0;
    if (uploadedFiles.logo) count++;
    count += uploadedFiles.photos.length;
    count += uploadedFiles.docs.length;
    return count;
}

// Helper function to save backup copy
function saveBackupCopy(content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-brief-backup-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== RESET FORM ====================
function resetForm() {
    // Reset to step 1
    while (currentStep > 1) {
        prevStep();
    }
    
    // Reset category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedCategory = '';
    document.getElementById('nextToDetails').disabled = true;
    
    // Clear all inputs
    document.querySelectorAll('input:not([type="file"]), select, textarea').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Clear file uploads
    uploadedFiles = { logo: null, photos: [], docs: [] };
    document.querySelectorAll('.file-list').forEach(list => {
        list.innerHTML = '';
    });
    
    // Hide all category forms
    document.querySelectorAll('[id$="Fields"]').forEach(form => {
        form.style.display = 'none';
    });
    
    document.getElementById('agreeTerms').checked = false;
    
    showToast('Form reset successfully', 'success');
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.style.display = 'flex';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here
    
    // Prevent form submission on enter key
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});