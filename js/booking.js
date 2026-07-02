// Booking Form Handler
function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');

    if (!bookingForm) return;

    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Handle form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            coachingType: document.getElementById('coachingType').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            message: document.getElementById('bookingMessage').value
        };

        // Validate form
        if (!validateBookingForm(formData)) {
            return;
        }

        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            // TODO: Send to backend API
            // const response = await fetch('/api/bookings', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showBookingConfirmation(formData);

            // Reset form
            bookingForm.reset();

            // Send confirmation email (would be handled by backend)
            console.log('Booking confirmation email would be sent to:', formData.email);

        } catch (error) {
            console.error('Booking error:', error);
            showNotification('There was an error processing your booking. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Validate booking form
function validateBookingForm(data) {
    // Check all required fields
    if (!data.name || !data.email || !data.phone || !data.coachingType || !data.date || !data.time) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Validate phone
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }

    // Check if date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showNotification('Please select a future date', 'error');
        return false;
    }

    // Check if date is not on Sunday (assuming no Sunday sessions)
    if (selectedDate.getDay() === 0) {
        showNotification('Sessions are not available on Sundays', 'error');
        return false;
    }

    return true;
}

// Show booking confirmation
function showBookingConfirmation(data) {
    const modal = document.createElement('div');
    modal.className = 'modal active';

    // Format date
    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format time
    const time = formatTime(data.time);

    // Get coaching type label
    const coachingTypeSelect = document.getElementById('coachingType');
    const coachingTypeLabel = coachingTypeSelect.options[coachingTypeSelect.selectedIndex].text;

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>Booking Confirmed!</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: #10b981;"></i>
                    </div>
                    <h4 style="margin-bottom: 1rem;">Your session has been booked!</h4>
                    <p style="color: #6b7280;">A confirmation email has been sent to <strong>${data.email}</strong></p>
                </div>

                <div style="background: #f3f4f6; padding: 2rem; border-radius: 15px; margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 1.5rem; text-align: center;">Session Details</h4>

                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; align-items: start; gap: 1rem;">
                            <i class="fas fa-user-circle" style="color: #10b981; margin-top: 0.25rem;"></i>
                            <div>
                                <strong>Name:</strong><br>
                                ${data.name}
                            </div>
                        </div>

                        <div style="display: flex; align-items: start; gap: 1rem;">
                            <i class="fas fa-briefcase" style="color: #10b981; margin-top: 0.25rem;"></i>
                            <div>
                                <strong>Coaching Type:</strong><br>
                                ${coachingTypeLabel}
                            </div>
                        </div>

                        <div style="display: flex; align-items: start; gap: 1rem;">
                            <i class="fas fa-calendar-alt" style="color: #10b981; margin-top: 0.25rem;"></i>
                            <div>
                                <strong>Date:</strong><br>
                                ${formattedDate}
                            </div>
                        </div>

                        <div style="display: flex; align-items: start; gap: 1rem;">
                            <i class="fas fa-clock" style="color: #10b981; margin-top: 0.25rem;"></i>
                            <div>
                                <strong>Time:</strong><br>
                                ${time}
                            </div>
                        </div>

                        ${data.message ? `
                        <div style="display: flex; align-items: start; gap: 1rem;">
                            <i class="fas fa-comment" style="color: #10b981; margin-top: 0.25rem;"></i>
                            <div>
                                <strong>Your Message:</strong><br>
                                ${data.message}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p style="margin: 0; font-size: 0.95rem;">
                        <i class="fas fa-info-circle" style="color: #f59e0b;"></i>
                        <strong>Reminder:</strong> You can cancel or reschedule up to 24 hours before your session.
                    </p>
                </div>

                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Save booking to localStorage for user reference
    saveBooking(data);
}

// Format time
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

// Save booking to localStorage
function saveBooking(data) {
    const bookings = JSON.parse(localStorage.getItem('almasFitnessBookings') || '[]');
    bookings.push({
        ...data,
        bookingId: Date.now(),
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('almasFitnessBookings', JSON.stringify(bookings));
}

// Contact Form Handler
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            // TODO: Send to backend API
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();

        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Newsletter Form Handler
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = newsletterForm.querySelector('input[type="email"]').value;

        // Show loading state
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            // TODO: Send to backend API or email service
            // const response = await fetch('/api/newsletter', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            showNotification('Successfully subscribed to newsletter!', 'success');
            newsletterForm.reset();

        } catch (error) {
            console.error('Newsletter error:', error);
            showNotification('There was an error subscribing. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Initialize all forms
document.addEventListener('DOMContentLoaded', () => {
    setupBookingForm();
    setupContactForm();
    setupNewsletterForm();
});
