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

  // Initialize animations smoothly without flickering
  function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportMargin = 200; // Extra margin for smooth animation start

    // Helper function to check if element is in or near viewport
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return rect.top < viewportHeight + viewportMargin && rect.bottom > -viewportMargin;
    }

    // Helper function to trigger animation smoothly
    function triggerAnimation(el) {
      // Force a reflow to ensure CSS initial state is painted
      void el.offsetHeight;
      
      // Use requestAnimationFrame for smooth transition
      requestAnimationFrame(() => {
        el.classList.add('animated');
      });
    }

    // Separate elements into visible and below-viewport
    const visibleElements = [];
    const belowViewportElements = [];

    animatedElements.forEach(el => {
      if (isInViewport(el)) {
        visibleElements.push(el);
      } else {
        belowViewportElements.push(el);
      }
    });

    // Animate visible elements immediately with slight stagger
    visibleElements.forEach((el, index) => {
      // Small delay for smooth staggered animation effect
      setTimeout(() => {
        triggerAnimation(el);
      }, 100 + (index * 80));
    });

    // Create Intersection Observer for elements below viewport
    if (belowViewportElements.length > 0) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            triggerAnimation(el);
            observer.unobserve(el);
          }
        });
      }, observerOptions);

      belowViewportElements.forEach(el => {
        observer.observe(el);
      });
    }
  }

  // Initialize as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Use requestAnimationFrame to ensure smooth start
      requestAnimationFrame(initAnimations);
    });
  } else {
    // DOM ready, initialize on next frame
    requestAnimationFrame(initAnimations);
  }

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