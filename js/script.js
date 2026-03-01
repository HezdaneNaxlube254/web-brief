// State management
let currentStep = 1;
let selectedCategory = '';
let uploadedFiles = {
    logo: [],
    photos: [],
    docs: []
};

// Category selection
function selectCategory(category) {
    selectedCategory = category;
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById(`cat-${category}`).classList.add('selected');
    
    document.getElementById('nextToDetails').disabled = false;
    showCategoryFields(category);
}

function showCategoryFields(category) {
    // Hide all field sets
    document.querySelectorAll('[id$="Fields"]').forEach(f => f.style.display = 'none');
    
    // Show selected category fields
    if (category === 'hospital') document.getElementById('hospitalFields').style.display = 'block';
    else if (category === 'school') document.getElementById('schoolFields').style.display = 'block';
    else if (category === 'church') document.getElementById('churchFields').style.display = 'block';
    else if (category === 'hotel') document.getElementById('hotelFields').style.display = 'block';
    else if (category === 'restaurant') document.getElementById('restaurantFields').style.display = 'block';
    else if (category === 'business') document.getElementById('businessFields').style.display = 'block';
    else if (category === 'ngo') document.getElementById('ngoFields').style.display = 'block';
    else if (category === 'portfolio') document.getElementById('portfolioFields').style.display = 'block';
    
    // Update title
    const titles = {
        hospital: 'Hospital Details',
        school: 'School Details',
        church: 'Church Details',
        hotel: 'Hotel Details',
        restaurant: 'Restaurant Details',
        business: 'Business Details',
        ngo: 'NGO Details',
        portfolio: 'Portfolio Details'
    };
    document.getElementById('detailsTitle').textContent = titles[category] || 'Your Details';
}

// Navigation
function nextStep() {
    if (currentStep < 4) {
        if (currentStep === 1 && !selectedCategory) {
            showToast('Please select a website category', 'error');
            return;
        }
        
        if (currentStep === 2 && !validateDetails()) {
            return;
        }
        
        currentStep++;
        updateStepDisplay();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step${i}-indicator`);
        const form = document.getElementById(`step${i}-form`);
        
        if (i === currentStep) {
            indicator?.classList.add('active');
            form?.classList.add('active');
        } else {
            indicator?.classList.remove('active');
            form?.classList.remove('active');
        }
    }
    
    document.getElementById('progressFill').style.width = (currentStep * 25) + '%';
    
    if (currentStep === 4) {
        populateReview();
    }
}

// Validation
function validateDetails() {
    let isValid = true;
    let errorMessage = '';
    
    if (selectedCategory === 'school') {
        const name = document.getElementById('schoolName')?.value;
        const phone = document.getElementById('schoolPhone')?.value;
        const principal = document.getElementById('schoolPrincipal')?.value;
        
        if (!name) { isValid = false; errorMessage = 'School name is required'; }
        else if (!principal) { isValid = false; errorMessage = 'Principal name is required'; }
        else if (!phone) { isValid = false; errorMessage = 'Phone number is required'; }
    }
    else if (selectedCategory === 'hospital') {
        const name = document.getElementById('hospitalName')?.value;
        const phone = document.getElementById('hospitalPhone')?.value;
        
        if (!name) { isValid = false; errorMessage = 'Hospital name is required'; }
        else if (!phone) { isValid = false; errorMessage = 'Phone number is required'; }
    }
    else if (selectedCategory === 'church') {
        const name = document.getElementById('churchName')?.value;
        const pastor = document.getElementById('churchPastor')?.value;
        
        if (!name) { isValid = false; errorMessage = 'Church name is required'; }
        else if (!pastor) { isValid = false; errorMessage = 'Pastor name is required'; }
    }
    else if (selectedCategory === 'business') {
        const name = document.getElementById('businessName')?.value;
        const contact = document.getElementById('businessContact')?.value;
        
        if (!name) { isValid = false; errorMessage = 'Business name is required'; }
        else if (!contact) { isValid = false; errorMessage = 'Contact person is required'; }
    }
    
    if (!isValid) {
        showToast(errorMessage, 'error');
    }
    
    return isValid;
}

// File handling
function handleFileSelect(type) {
    const input = document.getElementById(type + 'Input');
    const list = document.getElementById(type + 'List');
    
    for (let file of input.files) {
        uploadedFiles[type].push({
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            type: file.type
        });
    }
    
    displayFiles(type);
    input.value = '';
}

function displayFiles(type) {
    const list = document.getElementById(type + 'List');
    list.innerHTML = '';
    
    uploadedFiles[type].forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <span><i class="fas fa-file"></i> ${file.name} (${file.size})</span>
            <i class="fas fa-times" onclick="removeFile('${type}', ${index})"></i>
        `;
        list.appendChild(item);
    });
}

function removeFile(type, index) {
    uploadedFiles[type].splice(index, 1);
    displayFiles(type);
}

// Review
function populateReview() {
    let html = '<table class="review-table">';
    
    html += `<tr><td>Category:</td><td>${selectedCategory}</td></tr>`;
    
    if (selectedCategory === 'school') {
        html += `
            <tr><td>School Name:</td><td>${document.getElementById('schoolName')?.value || '-'}</td></tr>
            <tr><td>Principal:</td><td>${document.getElementById('schoolPrincipal')?.value || '-'}</td></tr>
            <tr><td>Phone:</td><td>${document.getElementById('schoolPhone')?.value || '-'}</td></tr>
            <tr><td>Email:</td><td>${document.getElementById('schoolEmail')?.value || '-'}</td></tr>
            <tr><td>Address:</td><td>${document.getElementById('schoolAddress')?.value || '-'}</td></tr>
            <tr><td>School Type:</td><td>${document.getElementById('schoolType')?.value || '-'}</td></tr>
        `;
    }
    else if (selectedCategory === 'hospital') {
        html += `
            <tr><td>Hospital Name:</td><td>${document.getElementById('hospitalName')?.value || '-'}</td></tr>
            <tr><td>Phone:</td><td>${document.getElementById('hospitalPhone')?.value || '-'}</td></tr>
            <tr><td>Email:</td><td>${document.getElementById('hospitalEmail')?.value || '-'}</td></tr>
        `;
    }
    else if (selectedCategory === 'church') {
        html += `
            <tr><td>Church Name:</td><td>${document.getElementById('churchName')?.value || '-'}</td></tr>
            <tr><td>Pastor:</td><td>${document.getElementById('churchPastor')?.value || '-'}</td></tr>
            <tr><td>Phone:</td><td>${document.getElementById('churchPhone')?.value || '-'}</td></tr>
        `;
    }
    else if (selectedCategory === 'business') {
        html += `
            <tr><td>Business Name:</td><td>${document.getElementById('businessName')?.value || '-'}</td></tr>
            <tr><td>Contact:</td><td>${document.getElementById('businessContact')?.value || '-'}</td></tr>
            <tr><td>Phone:</td><td>${document.getElementById('businessPhone')?.value || '-'}</td></tr>
        `;
    }
    
    const totalFiles = uploadedFiles.logo.length + uploadedFiles.photos.length + uploadedFiles.docs.length;
    html += `<tr><td>Files Uploaded:</td><td>${totalFiles} file(s)</td></tr>`;
    
    html += '</table>';
    document.getElementById('reviewContent').innerHTML = html;
}

// Form submission
function submitForm() {
    if (!document.getElementById('agreeTerms').checked) {
        showToast('Please confirm that the information is accurate', 'error');
        return;
    }
    
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<span class="loading"></span> Submitting...';
    btn.disabled = true;
    
    // Set flag for thank you page
    sessionStorage.setItem('formSubmitted', 'true');
    
    const formData = {
        category: selectedCategory,
        submittedAt: new Date().toLocaleString(),
        details: {},
        files: uploadedFiles
    };
    
    if (selectedCategory === 'school') {
        formData.details = {
            name: document.getElementById('schoolName')?.value,
            regNumber: document.getElementById('schoolRegNumber')?.value,
            type: document.getElementById('schoolType')?.value,
            category: document.getElementById('schoolCategory')?.value,
            year: document.getElementById('schoolYear')?.value,
            motto: document.getElementById('schoolMotto')?.value,
            vision: document.getElementById('schoolVision')?.value,
            mission: document.getElementById('schoolMission')?.value,
            principal: document.getElementById('schoolPrincipal')?.value,
            principalTitle: document.getElementById('schoolPrincipalTitle')?.value,
            principalPhone: document.getElementById('schoolPrincipalPhone')?.value,
            principalEmail: document.getElementById('schoolPrincipalEmail')?.value,
            phone: document.getElementById('schoolPhone')?.value,
            phone2: document.getElementById('schoolPhone2')?.value,
            whatsapp: document.getElementById('schoolWhatsApp')?.value,
            email: document.getElementById('schoolEmail')?.value,
            admissionsPhone: document.getElementById('schoolAdmissionsPhone')?.value,
            admissionsEmail: document.getElementById('schoolAdmissionsEmail')?.value,
            address: document.getElementById('schoolAddress')?.value,
            city: document.getElementById('schoolCity')?.value,
            county: document.getElementById('schoolCounty')?.value,
            postal: document.getElementById('schoolPostal')?.value,
            maps: document.getElementById('schoolMaps')?.value,
            levels: Array.from(document.getElementById('schoolLevels')?.selectedOptions || []).map(o => o.value).join(', '),
            curriculum: Array.from(document.getElementById('schoolCurriculum')?.selectedOptions || []).map(o => o.value).join(', '),
            students: document.getElementById('schoolStudents')?.value,
            teachers: document.getElementById('schoolTeachers')?.value,
            ratio: document.getElementById('schoolRatio')?.value,
            classSize: document.getElementById('schoolClassSize')?.value,
            subjects: document.getElementById('schoolSubjects')?.value,
            achievements: document.getElementById('schoolAchievements')?.value,
            facilities: Array.from(document.querySelectorAll('#schoolFields input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            classrooms: document.getElementById('schoolClassrooms')?.value,
            labs: document.getElementById('schoolLabs')?.value,
            land: document.getElementById('schoolLand')?.value,
            area: document.getElementById('schoolArea')?.value,
            feesMin: document.getElementById('schoolFeesMin')?.value,
            feesMax: document.getElementById('schoolFeesMax')?.value,
            paymentMethods: Array.from(document.querySelectorAll('#schoolFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('schoolPaybill')?.value,
            bank: document.getElementById('schoolBank')?.value,
            requirements: document.getElementById('schoolRequirements')?.value,
            admissionPeriod: document.getElementById('schoolAdmissionPeriod')?.value,
            sports: document.getElementById('schoolSports')?.value,
            clubs: document.getElementById('schoolClubs')?.value,
            website: document.getElementById('schoolWebsite')?.value,
            facebook: document.getElementById('schoolFacebook')?.value,
            twitter: document.getElementById('schoolTwitter')?.value,
            instagram: document.getElementById('schoolInstagram')?.value,
            youtube: document.getElementById('schoolYoutube')?.value,
            linkedin: document.getElementById('schoolLinkedin')?.value,
            deputies: document.getElementById('schoolDeputies')?.value,
            hods: document.getElementById('schoolHODs')?.value,
            bog: document.getElementById('schoolBOG')?.value,
            accreditations: document.getElementById('schoolAccreditations')?.value,
            memberships: document.getElementById('schoolMemberships')?.value,
            history: document.getElementById('schoolHistory')?.value,
            usp: document.getElementById('schoolUSP')?.value,
            events: document.getElementById('schoolEvents')?.value,
            other: document.getElementById('schoolOther')?.value
        };
    }
    
    // Send email
    document.getElementById('emailCategory').value = formData.category;
    document.getElementById('emailDetails').value = JSON.stringify(formData.details, null, 2);
    document.getElementById('emailFiles').value = JSON.stringify(formData.files, null, 2);
    document.getElementById('emailTimestamp').value = formData.submittedAt;
    
    document.getElementById('emailForm').submit();
    
    showToast('Project brief submitted! Redirecting...', 'success');
    
    // Redirect after a moment
    setTimeout(() => {
        window.location.href = 'thankyou.html';
    }, 2000);
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    
    toast.className = 'toast show';
    if (type === 'error') {
        toast.classList.add('error');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for any date fields
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.setAttribute('min', today);
    });
});