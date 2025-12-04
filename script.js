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

  // Scroll animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(animateOnScroll, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => {
    // Check if element is already in viewport (e.g., hero section)
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInViewport && el.closest('.hero')) {
      // Animate hero elements immediately on load
      setTimeout(() => {
        el.classList.add('animated');
      }, 100);
    } else {
      // Observe other elements for scroll trigger
      observer.observe(el);
    }
  });
});