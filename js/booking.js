// Stripe Configuration
// IMPORTANT: Replace with your actual Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE'; // Get this from https://dashboard.stripe.com/apikeys
const stripe = window.Stripe ? window.Stripe(STRIPE_PUBLISHABLE_KEY) : null;

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

        // Get coaching type select element
        const coachingTypeSelect = document.getElementById('coachingType');
        const selectedOption = coachingTypeSelect.options[coachingTypeSelect.selectedIndex];
        const price = selectedOption.getAttribute('data-price');

        // Get form data
        const formData = {
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            coachingType: coachingTypeSelect.value,
            coachingTypeLabel: selectedOption.text,
            price: parseFloat(price),
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
            // Save booking data to localStorage for retrieval after payment
            localStorage.setItem('pendingBooking', JSON.stringify(formData));

            // Proceed to payment
            await processPayment(formData);

        } catch (error) {
            console.error('Booking error:', error);
            showNotification('There was an error processing your booking. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Process payment with Stripe
async function processPayment(formData) {
    // Check if Stripe is available
    if (!stripe || STRIPE_PUBLISHABLE_KEY === 'pk_test_YOUR_KEY_HERE') {
        // Stripe not configured - show payment placeholder
        showPaymentPlaceholder(formData);
        return;
    }

    try {
        // In a real implementation, you would:
        // 1. Send booking data to your backend
        // 2. Backend creates a Stripe Checkout Session
        // 3. Backend returns the session ID
        // 4. Redirect to Stripe Checkout

        // Example backend call:
        // const response = await fetch('/api/create-checkout-session', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         bookingData: formData,
        //         amount: formData.price * 100, // Stripe uses cents
        //         currency: 'usd'
        //     })
        // });
        // const { sessionId } = await response.json();
        // await stripe.redirectToCheckout({ sessionId });

        // For now, show payment placeholder
        showPaymentPlaceholder(formData);

    } catch (error) {
        console.error('Payment error:', error);
        throw error;
    }
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

// Show payment placeholder (when Stripe is not configured)
function showPaymentPlaceholder(formData) {
    const modal = document.createElement('div');
    modal.className = 'modal active';

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>Complete Your Payment</h3>
                <button class="modal-close" onclick="location.reload()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <i class="fas fa-credit-card" style="font-size: 4rem; color: #10b981;"></i>
                    </div>
                    <h4 style="margin-bottom: 1rem;">Session Details</h4>
                </div>

                <div style="background: #f3f4f6; padding: 2rem; border-radius: 15px; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <span><strong>Service:</strong></span>
                        <span>${formData.coachingTypeLabel}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <span><strong>Date:</strong></span>
                        <span>${new Date(formData.date).toLocaleDateString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <span><strong>Time:</strong></span>
                        <span>${formatTime(formData.time)}</span>
                    </div>
                    <hr style="border: none; border-top: 1px solid #d1d5db; margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700;">
                        <span>Total Amount:</span>
                        <span style="color: #10b981;">$${formData.price.toFixed(2)}</span>
                    </div>
                </div>

                <div style="background: #fef3c7; padding: 1rem 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p style="margin: 0; font-size: 0.95rem; text-align: center;">
                        <i class="fas fa-info-circle" style="color: #f59e0b;"></i>
                        <strong>Payment Integration Required</strong><br>
                        <span style="font-size: 0.875rem;">
                            To accept payments, you need to set up your Stripe account.<br>
                            See the setup instructions in PAYMENT_INTEGRATION.md
                        </span>
                    </p>
                </div>

                <div style="display: grid; gap: 1rem;">
                    <button class="btn btn-primary btn-block" onclick="window.open('https://dashboard.stripe.com/register', '_blank')">
                        <i class="fas fa-external-link-alt"></i> Set Up Stripe Account
                    </button>
                    <button class="btn btn-secondary btn-block" onclick="location.reload()">
                        Go Back
                    </button>
                </div>

                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 0.875rem; color: #6b7280; text-align: center; margin: 0;">
                        <strong>For testing:</strong> Your booking details have been saved.<br>
                        In production, users will be redirected to Stripe Checkout to complete payment.
                    </p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Save booking for demonstration
    saveBooking(formData);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            location.reload();
        }
    });
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
