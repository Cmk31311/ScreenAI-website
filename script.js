// Smooth scroll for in-page links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]');
  const nav = document.querySelector('.nav');
  const navHeight = nav ? nav.offsetHeight : 0;
  
  links.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - navHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  // Initialize animations after a small delay to ensure CSS is loaded
  function initAnimations() {
    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    // Set initial state - elements should be hidden initially
    animatedElements.forEach(el => {
      // Reset to initial animation state
      el.style.opacity = '0';
      if (el.classList.contains('slide-in-up')) {
        el.style.transform = 'translateY(20px)';
      } else if (el.classList.contains('slide-in-down')) {
        el.style.transform = 'translateY(-20px)';
      } else if (el.classList.contains('slide-in-left')) {
        el.style.transform = 'translateX(-20px)';
      } else if (el.classList.contains('slide-in-right')) {
        el.style.transform = 'translateX(20px)';
      } else if (el.classList.contains('blur-in')) {
        el.style.filter = 'blur(8px)';
        el.style.transform = 'scale(0.99)';
      } else if (el.classList.contains('fade-in')) {
        el.style.transform = 'scale(0.98)';
      }
    });

    // Create Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Trigger animation by removing inline styles and adding animated class
          el.style.opacity = '';
          el.style.transform = '';
          el.style.filter = '';
          el.classList.add('animated');
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Wait for next frame to ensure CSS is loaded
  requestAnimationFrame(() => {
    setTimeout(initAnimations, 50);
  });

  // Waitlist form handling with EmailJS
  const waitlistForm = document.getElementById('waitlist-form');
  const waitlistMessage = document.getElementById('waitlist-message');
  const waitlistSubmit = document.getElementById('waitlist-submit');
  
  if (waitlistForm) {
    // Check if EmailJS is loaded and configured
    const EMAILJS_PUBLIC_KEY = 'PhRpRIzYYlCizbcfF';
    const EMAILJS_SERVICE_ID = 'service_avcwb2i';
    const EMAILJS_TEMPLATE_ID = 'template_9h7hj05';
    
    const isEmailJSConfigured = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && 
                                 EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && 
                                 EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
    
    if (typeof emailjs !== 'undefined' && isEmailJSConfigured) {
      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('waitlist-email').value;
      const submitButton = waitlistSubmit;
      const originalText = submitButton.textContent;
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      waitlistMessage.style.display = 'none';
      
      // Check if EmailJS is properly configured
      if (!isEmailJSConfigured || typeof emailjs === 'undefined') {
        waitlistMessage.textContent = 'Email service not configured. Please contact us at cmkadhar3@gmail.com';
        waitlistMessage.style.color = 'var(--warning)';
        waitlistMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        return;
      }
      
      try {
        // Send email to user
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: email,
          to_name: email.split('@')[0],
          from_name: 'SCAI Team',
          message: 'Thank you for joining the SCAI waitlist! We\'ll send you updates on SCAI soon.',
          subject: 'Welcome to SCAI Waitlist'
        });
        
        // Show success message
        waitlistMessage.textContent = '✓ Check your email! We\'ve sent you a confirmation.';
        waitlistMessage.style.color = 'var(--success)';
        waitlistMessage.style.display = 'block';
        
        // Reset form
        waitlistForm.reset();
        
      } catch (error) {
        console.error('EmailJS Error:', error);
        waitlistMessage.textContent = 'Something went wrong. Please try again or contact us at cmkadhar3@gmail.com';
        waitlistMessage.style.color = 'var(--error)';
        waitlistMessage.style.display = 'block';
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }
});