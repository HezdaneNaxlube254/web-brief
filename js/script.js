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
    // Add basic validation for other categories as needed
    else if (selectedCategory === 'hotel') {
        const name = document.getElementById('hotelName')?.value;
        const phone = document.getElementById('hotelPhone')?.value;
        if (!name) { isValid = false; errorMessage = 'Hotel name is required'; }
        else if (!phone) { isValid = false; errorMessage = 'Phone number is required'; }
    }
    else if (selectedCategory === 'restaurant') {
        const name = document.getElementById('restaurantName')?.value;
        const phone = document.getElementById('restaurantPhone')?.value;
        if (!name) { isValid = false; errorMessage = 'Restaurant name is required'; }
        else if (!phone) { isValid = false; errorMessage = 'Phone number is required'; }
    }
    else if (selectedCategory === 'ngo') {
        const name = document.getElementById('ngoName')?.value;
        const director = document.getElementById('ngoDirector')?.value;
        if (!name) { isValid = false; errorMessage = 'Organization name is required'; }
        else if (!director) { isValid = false; errorMessage = 'Director name is required'; }
    }
    else if (selectedCategory === 'portfolio') {
        const name = document.getElementById('portfolioName')?.value;
        if (!name) { isValid = false; errorMessage = 'Name is required'; }
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
    else if (selectedCategory === 'hotel') {
        html += `
            <tr><td>Hotel Name:</td><td>${document.getElementById('hotelName')?.value || '-'}</td></tr>
            <tr><td>Phone:</td><td>${document.getElementById('hotelPhone')?.value || '-'}</td></tr>
        `;
    }
    else if (selectedCategory === 'restaurant') {
        html += `
            <tr><td>Restaurant Name:</td><td>${document.getElementById('restaurantName')?.value || '-'}</td></tr>
            <tr><td>Phone:</td><td>${document.getElementById('restaurantPhone')?.value || '-'}</td></tr>
        `;
    }
    else if (selectedCategory === 'ngo') {
        html += `
            <tr><td>Organization Name:</td><td>${document.getElementById('ngoName')?.value || '-'}</td></tr>
            <tr><td>Director:</td><td>${document.getElementById('ngoDirector')?.value || '-'}</td></tr>
        `;
    }
    else if (selectedCategory === 'portfolio') {
        html += `
            <tr><td>Name:</td><td>${document.getElementById('portfolioName')?.value || '-'}</td></tr>
        `;
    }
    
    const totalFiles = uploadedFiles.logo.length + uploadedFiles.photos.length + uploadedFiles.docs.length;
    html += `<tr><td>Files Uploaded:</td><td>${totalFiles} file(s)</td></tr>`;
    
    html += '</table>';
    document.getElementById('reviewContent').innerHTML = html;
}

// Form submission with client email capture
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
    
    // Collect details based on selected category AND set client contact info
    if (selectedCategory === 'school') {
        formData.details = {
            name: document.getElementById('schoolName')?.value || '',
            regNumber: document.getElementById('schoolRegNumber')?.value || '',
            type: document.getElementById('schoolType')?.value || '',
            category: document.getElementById('schoolCategory')?.value || '',
            year: document.getElementById('schoolYear')?.value || '',
            motto: document.getElementById('schoolMotto')?.value || '',
            vision: document.getElementById('schoolVision')?.value || '',
            mission: document.getElementById('schoolMission')?.value || '',
            principal: document.getElementById('schoolPrincipal')?.value || '',
            principalTitle: document.getElementById('schoolPrincipalTitle')?.value || '',
            principalPhone: document.getElementById('schoolPrincipalPhone')?.value || '',
            principalEmail: document.getElementById('schoolPrincipalEmail')?.value || '',
            phone: document.getElementById('schoolPhone')?.value || '',
            phone2: document.getElementById('schoolPhone2')?.value || '',
            whatsapp: document.getElementById('schoolWhatsApp')?.value || '',
            email: document.getElementById('schoolEmail')?.value || '',
            admissionsPhone: document.getElementById('schoolAdmissionsPhone')?.value || '',
            admissionsEmail: document.getElementById('schoolAdmissionsEmail')?.value || '',
            address: document.getElementById('schoolAddress')?.value || '',
            city: document.getElementById('schoolCity')?.value || '',
            county: document.getElementById('schoolCounty')?.value || '',
            postal: document.getElementById('schoolPostal')?.value || '',
            maps: document.getElementById('schoolMaps')?.value || '',
            levels: Array.from(document.getElementById('schoolLevels')?.selectedOptions || []).map(o => o.value).join(', '),
            curriculum: Array.from(document.getElementById('schoolCurriculum')?.selectedOptions || []).map(o => o.value).join(', '),
            students: document.getElementById('schoolStudents')?.value || '',
            teachers: document.getElementById('schoolTeachers')?.value || '',
            ratio: document.getElementById('schoolRatio')?.value || '',
            classSize: document.getElementById('schoolClassSize')?.value || '',
            subjects: document.getElementById('schoolSubjects')?.value || '',
            achievements: document.getElementById('schoolAchievements')?.value || '',
            facilities: Array.from(document.querySelectorAll('#schoolFields input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            classrooms: document.getElementById('schoolClassrooms')?.value || '',
            labs: document.getElementById('schoolLabs')?.value || '',
            land: document.getElementById('schoolLand')?.value || '',
            area: document.getElementById('schoolArea')?.value || '',
            feesMin: document.getElementById('schoolFeesMin')?.value || '',
            feesMax: document.getElementById('schoolFeesMax')?.value || '',
            paymentMethods: Array.from(document.querySelectorAll('#schoolFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('schoolPaybill')?.value || '',
            bank: document.getElementById('schoolBank')?.value || '',
            requirements: document.getElementById('schoolRequirements')?.value || '',
            admissionPeriod: document.getElementById('schoolAdmissionPeriod')?.value || '',
            sports: document.getElementById('schoolSports')?.value || '',
            clubs: document.getElementById('schoolClubs')?.value || '',
            website: document.getElementById('schoolWebsite')?.value || '',
            facebook: document.getElementById('schoolFacebook')?.value || '',
            twitter: document.getElementById('schoolTwitter')?.value || '',
            instagram: document.getElementById('schoolInstagram')?.value || '',
            youtube: document.getElementById('schoolYoutube')?.value || '',
            linkedin: document.getElementById('schoolLinkedin')?.value || '',
            deputies: document.getElementById('schoolDeputies')?.value || '',
            hods: document.getElementById('schoolHODs')?.value || '',
            bog: document.getElementById('schoolBOG')?.value || '',
            accreditations: document.getElementById('schoolAccreditations')?.value || '',
            memberships: document.getElementById('schoolMemberships')?.value || '',
            history: document.getElementById('schoolHistory')?.value || '',
            usp: document.getElementById('schoolUSP')?.value || '',
            events: document.getElementById('schoolEvents')?.value || '',
            other: document.getElementById('schoolOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('schoolEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('schoolPrincipal')?.value || document.getElementById('schoolName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('schoolPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('schoolEmail')?.value || '';
    }
    else if (selectedCategory === 'hospital') {
        formData.details = {
            name: document.getElementById('hospitalName')?.value || '',
            regNumber: document.getElementById('hospitalRegNumber')?.value || '',
            year: document.getElementById('hospitalYear')?.value || '',
            tagline: document.getElementById('hospitalTagline')?.value || '',
            vision: document.getElementById('hospitalVision')?.value || '',
            mission: document.getElementById('hospitalMission')?.value || '',
            history: document.getElementById('hospitalHistory')?.value || '',
            ceo: document.getElementById('hospitalCEO')?.value || '',
            ceoTitle: document.getElementById('hospitalCEOTitle')?.value || '',
            phone: document.getElementById('hospitalPhone')?.value || '',
            email: document.getElementById('hospitalEmail')?.value || '',
            emergencyPhone: document.getElementById('hospitalEmergencyPhone')?.value || '',
            ambulancePhone: document.getElementById('hospitalAmbulancePhone')?.value || '',
            whatsapp: document.getElementById('hospitalWhatsApp')?.value || '',
            phone2: document.getElementById('hospitalPhone2')?.value || '',
            address: document.getElementById('hospitalAddress')?.value || '',
            city: document.getElementById('hospitalCity')?.value || '',
            county: document.getElementById('hospitalCounty')?.value || '',
            postal: document.getElementById('hospitalPostal')?.value || '',
            maps: document.getElementById('hospitalMaps')?.value || '',
            weekday: document.getElementById('hospitalWeekday')?.value || '',
            saturday: document.getElementById('hospitalSaturday')?.value || '',
            sunday: document.getElementById('hospitalSunday')?.value || '',
            emergencyHours: document.getElementById('hospitalEmergencyHours')?.value || '',
            branchCount: document.getElementById('hospitalBranchCount')?.value || '',
            branches: document.getElementById('hospitalBranches')?.value || '',
            departments: Array.from(document.querySelectorAll('#hospitalFields input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            otherDepartments: document.getElementById('hospitalOtherDepartments')?.value || '',
            services: document.getElementById('hospitalServices')?.value || '',
            specialized: document.getElementById('hospitalSpecialized')?.value || '',
            equipment: document.getElementById('hospitalEquipment')?.value || '',
            doctorCount: document.getElementById('hospitalDoctorCount')?.value || '',
            nurseCount: document.getElementById('hospitalNurseCount')?.value || '',
            specialists: document.getElementById('hospitalSpecialists')?.value || '',
            insurancePartners: Array.from(document.querySelectorAll('#hospitalFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            otherInsurance: document.getElementById('hospitalOtherInsurance')?.value || '',
            nhifNumber: document.getElementById('hospitalNHIF')?.value || '',
            paymentMethods: Array.from(document.querySelectorAll('#hospitalFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('hospitalPaybill')?.value || '',
            bank: document.getElementById('hospitalBank')?.value || '',
            patients: document.getElementById('hospitalPatients')?.value || '',
            beds: document.getElementById('hospitalBeds')?.value || '',
            years: document.getElementById('hospitalYears')?.value || '',
            daily: document.getElementById('hospitalDaily')?.value || '',
            awards: document.getElementById('hospitalAwards')?.value || '',
            facilities: Array.from(document.querySelectorAll('#hospitalFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            land: document.getElementById('hospitalLand')?.value || '',
            area: document.getElementById('hospitalArea')?.value || '',
            website: document.getElementById('hospitalWebsite')?.value || '',
            facebook: document.getElementById('hospitalFacebook')?.value || '',
            twitter: document.getElementById('hospitalTwitter')?.value || '',
            instagram: document.getElementById('hospitalInstagram')?.value || '',
            linkedin: document.getElementById('hospitalLinkedin')?.value || '',
            youtube: document.getElementById('hospitalYoutube')?.value || '',
            accreditations: document.getElementById('hospitalAccreditations')?.value || '',
            licenses: document.getElementById('hospitalLicenses')?.value || '',
            testimonials: document.getElementById('hospitalTestimonials')?.value || '',
            usp: document.getElementById('hospitalUSP')?.value || '',
            events: document.getElementById('hospitalEvents')?.value || '',
            other: document.getElementById('hospitalOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('hospitalEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('hospitalCEO')?.value || document.getElementById('hospitalName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('hospitalPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('hospitalEmail')?.value || '';
    }
    else if (selectedCategory === 'church') {
        formData.details = {
            name: document.getElementById('churchName')?.value || '',
            denomination: document.getElementById('churchDenomination')?.value || '',
            year: document.getElementById('churchYear')?.value || '',
            motto: document.getElementById('churchMotto')?.value || '',
            vision: document.getElementById('churchVision')?.value || '',
            mission: document.getElementById('churchMission')?.value || '',
            pastor: document.getElementById('churchPastor')?.value || '',
            pastorTitle: document.getElementById('churchPastorTitle')?.value || '',
            pastorPhone: document.getElementById('churchPastorPhone')?.value || '',
            pastorEmail: document.getElementById('churchPastorEmail')?.value || '',
            leaders: document.getElementById('churchLeaders')?.value || '',
            phone: document.getElementById('churchPhone')?.value || '',
            email: document.getElementById('churchEmail')?.value || '',
            whatsapp: document.getElementById('churchWhatsApp')?.value || '',
            phone2: document.getElementById('churchPhone2')?.value || '',
            address: document.getElementById('churchAddress')?.value || '',
            city: document.getElementById('churchCity')?.value || '',
            county: document.getElementById('churchCounty')?.value || '',
            postal: document.getElementById('churchPostal')?.value || '',
            maps: document.getElementById('churchMaps')?.value || '',
            sundayServices: document.getElementById('churchSundayServices')?.value || '',
            weekdayServices: document.getElementById('churchWeekdayServices')?.value || '',
            otherMeetings: document.getElementById('churchOtherMeetings')?.value || '',
            ministries: Array.from(document.querySelectorAll('#churchFields input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            otherMinistries: document.getElementById('churchOtherMinistries')?.value || '',
            ministryLeaders: document.getElementById('churchMinistryLeaders')?.value || '',
            annualEvents: document.getElementById('churchAnnualEvents')?.value || '',
            upcomingEvents: document.getElementById('churchUpcomingEvents')?.value || '',
            givingMethods: Array.from(document.querySelectorAll('#churchFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('churchPaybill')?.value || '',
            bank: document.getElementById('churchBank')?.value || '',
            givingLink: document.getElementById('churchGivingLink')?.value || '',
            attendance: document.getElementById('churchAttendance')?.value || '',
            members: document.getElementById('churchMembers')?.value || '',
            cells: document.getElementById('churchCells')?.value || '',
            pastors: document.getElementById('churchPastors')?.value || '',
            facilities: Array.from(document.querySelectorAll('#churchFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            capacity: document.getElementById('churchCapacity')?.value || '',
            land: document.getElementById('churchLand')?.value || '',
            website: document.getElementById('churchWebsite')?.value || '',
            facebook: document.getElementById('churchFacebook')?.value || '',
            youtube: document.getElementById('churchYoutube')?.value || '',
            instagram: document.getElementById('churchInstagram')?.value || '',
            livestream: document.getElementById('churchLivestream')?.value || '',
            podcast: document.getElementById('churchPodcast')?.value || '',
            sermons: document.getElementById('churchSermons')?.value || '',
            resources: document.getElementById('churchResources')?.value || '',
            history: document.getElementById('churchHistory')?.value || '',
            values: document.getElementById('churchValues')?.value || '',
            outreach: document.getElementById('churchOutreach')?.value || '',
            missions: document.getElementById('churchMissions')?.value || '',
            other: document.getElementById('churchOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('churchEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('churchPastor')?.value || document.getElementById('churchName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('churchPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('churchEmail')?.value || '';
    }
    else if (selectedCategory === 'hotel') {
        formData.details = {
            name: document.getElementById('hotelName')?.value || '',
            type: document.getElementById('hotelType')?.value || '',
            stars: document.getElementById('hotelStars')?.value || '',
            year: document.getElementById('hotelYear')?.value || '',
            tagline: document.getElementById('hotelTagline')?.value || '',
            motto: document.getElementById('hotelMotto')?.value || '',
            description: document.getElementById('hotelDescription')?.value || '',
            manager: document.getElementById('hotelManager')?.value || '',
            managerPhone: document.getElementById('hotelManagerPhone')?.value || '',
            phone: document.getElementById('hotelPhone')?.value || '',
            email: document.getElementById('hotelEmail')?.value || '',
            whatsapp: document.getElementById('hotelWhatsApp')?.value || '',
            phone2: document.getElementById('hotelPhone2')?.value || '',
            address: document.getElementById('hotelAddress')?.value || '',
            city: document.getElementById('hotelCity')?.value || '',
            county: document.getElementById('hotelCounty')?.value || '',
            postal: document.getElementById('hotelPostal')?.value || '',
            maps: document.getElementById('hotelMaps')?.value || '',
            landmark: document.getElementById('hotelLandmark')?.value || '',
            totalRooms: document.getElementById('hotelTotalRooms')?.value || '',
            occupancy: document.getElementById('hotelOccupancy')?.value || '',
            roomTypes: document.getElementById('hotelRoomTypes')?.value || '',
            roomAmenities: Array.from(document.querySelectorAll('#hotelFields input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            facilities: Array.from(document.querySelectorAll('#hotelFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            otherAmenities: document.getElementById('hotelOtherAmenities')?.value || '',
            restaurantName: document.getElementById('hotelRestaurantName')?.value || '',
            cuisine: document.getElementById('hotelCuisine')?.value || '',
            breakfast: document.getElementById('hotelBreakfast')?.value || '',
            lunch: document.getElementById('hotelLunch')?.value || '',
            dinner: document.getElementById('hotelDinner')?.value || '',
            roomService: document.getElementById('hotelRoomService')?.value || '',
            checkIn: document.getElementById('hotelCheckIn')?.value || '',
            checkOut: document.getElementById('hotelCheckOut')?.value || '',
            cancellation: document.getElementById('hotelCancellation')?.value || '',
            childPolicy: document.getElementById('hotelChildPolicy')?.value || '',
            petPolicy: document.getElementById('hotelPetPolicy')?.value || '',
            paymentMethods: Array.from(document.querySelectorAll('#hotelFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('hotelPaybill')?.value || '',
            bank: document.getElementById('hotelBank')?.value || '',
            years: document.getElementById('hotelYears')?.value || '',
            occupancyRate: document.getElementById('hotelOccupancyRate')?.value || '',
            employees: document.getElementById('hotelEmployees')?.value || '',
            awards: document.getElementById('hotelAwards')?.value || '',
            website: document.getElementById('hotelWebsite')?.value || '',
            booking: document.getElementById('hotelBooking')?.value || '',
            airbnb: document.getElementById('hotelAirbnb')?.value || '',
            facebook: document.getElementById('hotelFacebook')?.value || '',
            instagram: document.getElementById('hotelInstagram')?.value || '',
            tripAdvisor: document.getElementById('hotelTripAdvisor')?.value || '',
            rating: document.getElementById('hotelRating')?.value || '',
            testimonials: document.getElementById('hotelTestimonials')?.value || '',
            attractions: document.getElementById('hotelAttractions')?.value || '',
            history: document.getElementById('hotelHistory')?.value || '',
            sustainability: document.getElementById('hotelSustainability')?.value || '',
            corporate: document.getElementById('hotelCorporate')?.value || '',
            offers: document.getElementById('hotelOffers')?.value || '',
            other: document.getElementById('hotelOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('hotelEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('hotelManager')?.value || document.getElementById('hotelName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('hotelPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('hotelEmail')?.value || '';
    }
    else if (selectedCategory === 'restaurant') {
        formData.details = {
            name: document.getElementById('restaurantName')?.value || '',
            type: document.getElementById('restaurantType')?.value || '',
            cuisine: Array.from(document.getElementById('restaurantCuisine')?.selectedOptions || []).map(o => o.value).join(', '),
            year: document.getElementById('restaurantYear')?.value || '',
            tagline: document.getElementById('restaurantTagline')?.value || '',
            description: document.getElementById('restaurantDescription')?.value || '',
            manager: document.getElementById('restaurantManager')?.value || '',
            managerPhone: document.getElementById('restaurantManagerPhone')?.value || '',
            phone: document.getElementById('restaurantPhone')?.value || '',
            email: document.getElementById('restaurantEmail')?.value || '',
            whatsapp: document.getElementById('restaurantWhatsApp')?.value || '',
            phone2: document.getElementById('restaurantPhone2')?.value || '',
            address: document.getElementById('restaurantAddress')?.value || '',
            city: document.getElementById('restaurantCity')?.value || '',
            county: document.getElementById('restaurantCounty')?.value || '',
            postal: document.getElementById('restaurantPostal')?.value || '',
            maps: document.getElementById('restaurantMaps')?.value || '',
            weekday: document.getElementById('restaurantWeekday')?.value || '',
            saturday: document.getElementById('restaurantSaturday')?.value || '',
            sunday: document.getElementById('restaurantSunday')?.value || '',
            holidays: document.getElementById('restaurantHolidays')?.value || '',
            menu: document.getElementById('restaurantMenu')?.value || '',
            signature: document.getElementById('restaurantSignature')?.value || '',
            dietary: Array.from(document.querySelectorAll('#restaurantFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            price: document.getElementById('restaurantPrice')?.value || '',
            priceRange: document.getElementById('restaurantPriceRange')?.value || '',
            facilities: Array.from(document.querySelectorAll('#restaurantFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            capacity: document.getElementById('restaurantCapacity')?.value || '',
            tables: document.getElementById('restaurantTables')?.value || '',
            reservation: document.getElementById('restaurantReservation')?.value || '',
            reservationContact: document.getElementById('restaurantReservationContact')?.value || '',
            paymentMethods: Array.from(document.querySelectorAll('#restaurantFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('restaurantPaybill')?.value || '',
            deliveryPlatforms: Array.from(document.querySelectorAll('#restaurantFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            deliveryFee: document.getElementById('restaurantDeliveryFee')?.value || '',
            minOrder: document.getElementById('restaurantMinOrder')?.value || '',
            deliveryAreas: document.getElementById('restaurantDeliveryAreas')?.value || '',
            website: document.getElementById('restaurantWebsite')?.value || '',
            facebook: document.getElementById('restaurantFacebook')?.value || '',
            instagram: document.getElementById('restaurantInstagram')?.value || '',
            twitter: document.getElementById('restaurantTwitter')?.value || '',
            tiktok: document.getElementById('restaurantTikTok')?.value || '',
            deliveryLink: document.getElementById('restaurantDeliveryLink')?.value || '',
            rating: document.getElementById('restaurantRating')?.value || '',
            testimonials: document.getElementById('restaurantTestimonials')?.value || '',
            chefs: document.getElementById('restaurantChefs')?.value || '',
            headChef: document.getElementById('restaurantHeadChef')?.value || '',
            totalStaff: document.getElementById('restaurantTotalStaff')?.value || '',
            languages: document.getElementById('restaurantLanguages')?.value || '',
            awards: document.getElementById('restaurantAwards')?.value || '',
            entertainment: document.getElementById('restaurantEntertainment')?.value || '',
            events: document.getElementById('restaurantEvents')?.value || '',
            privateEvents: document.getElementById('restaurantPrivateEvents')?.value || '',
            story: document.getElementById('restaurantStory')?.value || '',
            sourcing: document.getElementById('restaurantSourcing')?.value || '',
            offers: document.getElementById('restaurantOffers')?.value || '',
            other: document.getElementById('restaurantOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('restaurantEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('restaurantManager')?.value || document.getElementById('restaurantName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('restaurantPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('restaurantEmail')?.value || '';
    }
    else if (selectedCategory === 'business') {
        formData.details = {
            name: document.getElementById('businessName')?.value || '',
            regNumber: document.getElementById('businessRegNumber')?.value || '',
            year: document.getElementById('businessYear')?.value || '',
            type: document.getElementById('businessType')?.value || '',
            industry: document.getElementById('businessIndustry')?.value || '',
            tagline: document.getElementById('businessTagline')?.value || '',
            vision: document.getElementById('businessVision')?.value || '',
            mission: document.getElementById('businessMission')?.value || '',
            description: document.getElementById('businessDescription')?.value || '',
            contact: document.getElementById('businessContact')?.value || '',
            contactTitle: document.getElementById('businessContactTitle')?.value || '',
            contactPhone: document.getElementById('businessContactPhone')?.value || '',
            contactEmail: document.getElementById('businessContactEmail')?.value || '',
            phone: document.getElementById('businessPhone')?.value || '',
            email: document.getElementById('businessEmail')?.value || '',
            phone2: document.getElementById('businessPhone2')?.value || '',
            whatsapp: document.getElementById('businessWhatsApp')?.value || '',
            address: document.getElementById('businessAddress')?.value || '',
            city: document.getElementById('businessCity')?.value || '',
            county: document.getElementById('businessCounty')?.value || '',
            postal: document.getElementById('businessPostal')?.value || '',
            maps: document.getElementById('businessMaps')?.value || '',
            weekday: document.getElementById('businessWeekday')?.value || '',
            saturday: document.getElementById('businessSaturday')?.value || '',
            sunday: document.getElementById('businessSunday')?.value || '',
            holidays: document.getElementById('businessHolidays')?.value || '',
            products: document.getElementById('businessProducts')?.value || '',
            pricing: document.getElementById('businessPricing')?.value || '',
            target: document.getElementById('businessTarget')?.value || '',
            usp: document.getElementById('businessUSP')?.value || '',
            employees: document.getElementById('businessEmployees')?.value || '',
            directors: document.getElementById('businessDirectors')?.value || '',
            team: document.getElementById('businessTeam')?.value || '',
            clients: document.getElementById('businessClients')?.value || '',
            projects: document.getElementById('businessProjects')?.value || '',
            awards: document.getElementById('businessAwards')?.value || '',
            paymentMethods: Array.from(document.querySelectorAll('#businessFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('businessPaybill')?.value || '',
            bank: document.getElementById('businessBank')?.value || '',
            branchCount: document.getElementById('businessBranchCount')?.value || '',
            branches: document.getElementById('businessBranches')?.value || '',
            website: document.getElementById('businessWebsite')?.value || '',
            facebook: document.getElementById('businessFacebook')?.value || '',
            twitter: document.getElementById('businessTwitter')?.value || '',
            instagram: document.getElementById('businessInstagram')?.value || '',
            linkedin: document.getElementById('businessLinkedin')?.value || '',
            youtube: document.getElementById('businessYoutube')?.value || '',
            certifications: document.getElementById('businessCertifications')?.value || '',
            memberships: document.getElementById('businessMemberships')?.value || '',
            licenses: document.getElementById('businessLicenses')?.value || '',
            testimonials: document.getElementById('businessTestimonials')?.value || '',
            history: document.getElementById('businessHistory')?.value || '',
            values: document.getElementById('businessValues')?.value || '',
            csr: document.getElementById('businessCSR')?.value || '',
            events: document.getElementById('businessEvents')?.value || '',
            other: document.getElementById('businessOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('businessEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('businessContact')?.value || document.getElementById('businessName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('businessPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('businessEmail')?.value || '';
    }
    else if (selectedCategory === 'ngo') {
        formData.details = {
            name: document.getElementById('ngoName')?.value || '',
            regNumber: document.getElementById('ngoRegNumber')?.value || '',
            year: document.getElementById('ngoYear')?.value || '',
            status: document.getElementById('ngoStatus')?.value || '',
            type: document.getElementById('ngoType')?.value || '',
            area: document.getElementById('ngoArea')?.value || '',
            vision: document.getElementById('ngoVision')?.value || '',
            mission: document.getElementById('ngoMission')?.value || '',
            motto: document.getElementById('ngoMotto')?.value || '',
            description: document.getElementById('ngoDescription')?.value || '',
            values: document.getElementById('ngoValues')?.value || '',
            director: document.getElementById('ngoDirector')?.value || '',
            directorTitle: document.getElementById('ngoDirectorTitle')?.value || '',
            directorPhone: document.getElementById('ngoDirectorPhone')?.value || '',
            directorEmail: document.getElementById('ngoDirectorEmail')?.value || '',
            phone: document.getElementById('ngoPhone')?.value || '',
            email: document.getElementById('ngoEmail')?.value || '',
            phone2: document.getElementById('ngoPhone2')?.value || '',
            whatsapp: document.getElementById('ngoWhatsApp')?.value || '',
            address: document.getElementById('ngoAddress')?.value || '',
            city: document.getElementById('ngoCity')?.value || '',
            county: document.getElementById('ngoCounty')?.value || '',
            postal: document.getElementById('ngoPostal')?.value || '',
            maps: document.getElementById('ngoMaps')?.value || '',
            chair: document.getElementById('ngoChair')?.value || '',
            boardSize: document.getElementById('ngoBoardSize')?.value || '',
            leadership: document.getElementById('ngoLeadership')?.value || '',
            fulltime: document.getElementById('ngoFulltime')?.value || '',
            parttime: document.getElementById('ngoParttime')?.value || '',
            volunteers: document.getElementById('ngoVolunteers')?.value || '',
            programs: document.getElementById('ngoPrograms')?.value || '',
            pastProjects: document.getElementById('ngoPastProjects')?.value || '',
            beneficiaries: document.getElementById('ngoBeneficiaries')?.value || '',
            children: document.getElementById('ngoChildren')?.value || '',
            women: document.getElementById('ngoWomen')?.value || '',
            schools: document.getElementById('ngoSchools')?.value || '',
            communities: document.getElementById('ngoCommunities')?.value || '',
            achievements: document.getElementById('ngoAchievements')?.value || '',
            donors: document.getElementById('ngoDonors')?.value || '',
            partners: document.getElementById('ngoPartners')?.value || '',
            corporate: document.getElementById('ngoCorporate')?.value || '',
            budget: document.getElementById('ngoBudget')?.value || '',
            fundingSources: Array.from(document.querySelectorAll('#ngoFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            donationMethods: Array.from(document.querySelectorAll('#ngoFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('ngoPaybill')?.value || '',
            bank: document.getElementById('ngoBank')?.value || '',
            donationLink: document.getElementById('ngoDonationLink')?.value || '',
            accreditations: document.getElementById('ngoAccreditations')?.value || '',
            reports: document.getElementById('ngoReports')?.value || '',
            audit: document.getElementById('ngoAudit')?.value || '',
            website: document.getElementById('ngoWebsite')?.value || '',
            facebook: document.getElementById('ngoFacebook')?.value || '',
            twitter: document.getElementById('ngoTwitter')?.value || '',
            instagram: document.getElementById('ngoInstagram')?.value || '',
            linkedin: document.getElementById('ngoLinkedin')?.value || '',
            youtube: document.getElementById('ngoYoutube')?.value || '',
            stories: document.getElementById('ngoStories')?.value || '',
            testimonials: document.getElementById('ngoTestimonials')?.value || '',
            publications: document.getElementById('ngoPublications')?.value || '',
            press: document.getElementById('ngoPress')?.value || '',
            events: document.getElementById('ngoEvents')?.value || '',
            volunteerOpps: document.getElementById('ngoVolunteerOpps')?.value || '',
            needs: document.getElementById('ngoNeeds')?.value || '',
            other: document.getElementById('ngoOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('ngoEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('ngoDirector')?.value || document.getElementById('ngoName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('ngoPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('ngoEmail')?.value || '';
    }
    else if (selectedCategory === 'portfolio') {
        formData.details = {
            name: document.getElementById('portfolioName')?.value || '',
            title: document.getElementById('portfolioTitle')?.value || '',
            year: document.getElementById('portfolioYear')?.value || '',
            location: document.getElementById('portfolioLocation')?.value || '',
            tagline: document.getElementById('portfolioTagline')?.value || '',
            bio: document.getElementById('portfolioBio')?.value || '',
            phone: document.getElementById('portfolioPhone')?.value || '',
            email: document.getElementById('portfolioEmail')?.value || '',
            whatsapp: document.getElementById('portfolioWhatsApp')?.value || '',
            phone2: document.getElementById('portfolioPhone2')?.value || '',
            address: document.getElementById('portfolioAddress')?.value || '',
            city: document.getElementById('portfolioCity')?.value || '',
            country: document.getElementById('portfolioCountry')?.value || '',
            skills: Array.from(document.getElementById('portfolioSkills')?.selectedOptions || []).map(o => o.value).join(', '),
            otherSkills: document.getElementById('portfolioOtherSkills')?.value || '',
            tools: document.getElementById('portfolioTools')?.value || '',
            languages: document.getElementById('portfolioLanguages')?.value || '',
            services: document.getElementById('portfolioServices')?.value || '',
            pricing: document.getElementById('portfolioPricing')?.value || '',
            paymentModel: document.getElementById('portfolioPaymentModel')?.value || '',
            project1Title: document.getElementById('portfolioProject1Title')?.value || '',
            project1Desc: document.getElementById('portfolioProject1Desc')?.value || '',
            project2Title: document.getElementById('portfolioProject2Title')?.value || '',
            project2Desc: document.getElementById('portfolioProject2Desc')?.value || '',
            project3Title: document.getElementById('portfolioProject3Title')?.value || '',
            project3Desc: document.getElementById('portfolioProject3Desc')?.value || '',
            moreProjects: document.getElementById('portfolioMoreProjects')?.value || '',
            clients: document.getElementById('portfolioClients')?.value || '',
            testimonials: document.getElementById('portfolioTestimonials')?.value || '',
            experience: document.getElementById('portfolioExperience')?.value || '',
            education: document.getElementById('portfolioEducation')?.value || '',
            certifications: document.getElementById('portfolioCertifications')?.value || '',
            memberships: document.getElementById('portfolioMemberships')?.value || '',
            awards: document.getElementById('portfolioAwards')?.value || '',
            publications: document.getElementById('portfolioPublications')?.value || '',
            website: document.getElementById('portfolioWebsite')?.value || '',
            behance: document.getElementById('portfolioBehance')?.value || '',
            dribbble: document.getElementById('portfolioDribbble')?.value || '',
            github: document.getElementById('portfolioGithub')?.value || '',
            linkedin: document.getElementById('portfolioLinkedin')?.value || '',
            instagram: document.getElementById('portfolioInstagram')?.value || '',
            twitter: document.getElementById('portfolioTwitter')?.value || '',
            facebook: document.getElementById('portfolioFacebook')?.value || '',
            youtube: document.getElementById('portfolioYoutube')?.value || '',
            tiktok: document.getElementById('portfolioTikTok')?.value || '',
            availability: document.getElementById('portfolioAvailability')?.value || '',
            workType: document.getElementById('portfolioWorkType')?.value || '',
            preferredLocation: document.getElementById('portfolioPreferredLocation')?.value || '',
            paymentMethods: Array.from(document.querySelectorAll('#portfolioFields .checkbox-label input[type=checkbox]:checked')).map(cb => cb.value).join(', '),
            paybill: document.getElementById('portfolioPaybill')?.value || '',
            unique: document.getElementById('portfolioUnique')?.value || '',
            industries: document.getElementById('portfolioIndustries')?.value || '',
            hobbies: document.getElementById('portfolioHobbies')?.value || '',
            exhibitions: document.getElementById('portfolioExhibitions')?.value || '',
            other: document.getElementById('portfolioOther')?.value || ''
        };
        
        // Set client contact info for email reply
        document.getElementById('clientEmail').value = document.getElementById('portfolioEmail')?.value || '';
        document.getElementById('clientName').value = document.getElementById('portfolioName')?.value || '';
        document.getElementById('clientPhone').value = document.getElementById('portfolioPhone')?.value || '';
        document.getElementById('replytoEmail').value = document.getElementById('portfolioEmail')?.value || '';
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