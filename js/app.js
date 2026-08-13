document.addEventListener('DOMContentLoaded', function() {
  // --- Theme Management (Enforce Light Theme Only) ---
  const htmlElement = document.documentElement;
  htmlElement.classList.remove('dark');
  localStorage.setItem('theme', 'light');

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --- Active Link Highlight ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function highlightLink(links) {
    links.forEach(link => {
      const href = link.getAttribute('href');
      const isHome = href === 'index.html' || href === '/';
      const isHomePath = currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '';

      if (isHome && isHomePath) {
        link.classList.add('text-primary', 'active');
        link.classList.remove('text-gray-700');
      } else if (!isHome && href && currentPath.endsWith(href)) {
        link.classList.add('text-primary', 'active');
        link.classList.remove('text-gray-700');
      } else {
        link.classList.remove('text-primary', 'active');
        if (href && href !== '#') {
          link.classList.add('text-gray-700');
        }
      }
    });
  }

  highlightLink(navLinks);
  highlightLink(mobileNavLinks);


  // --- Typing Animation (if target element exists) ---
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const skills = [
      'Frontend Development • UI/UX • AI Enthusiast • Web Developer',
      'React • TypeScript • Tailwind CSS • Vanilla JS',
      'AI-Assisted Coding • Workflow Automation • Prompting',
      'Beautiful Interfaces • Micro-animations • Responsive Layouts'
    ];
    let currentSkillIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function typeSkill() {
      if (!typingElement) return;
      const currentSkill = skills[currentSkillIndex];
      if (!isDeleting) {
        typingElement.textContent = currentSkill.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        if (currentCharIndex === currentSkill.length) {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        typingElement.textContent = currentSkill.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        if (currentCharIndex === 0) {
          isDeleting = false;
          currentSkillIndex = (currentSkillIndex + 1) % skills.length;
        }
      }
      const speed = isDeleting ? 30 : 60;
      setTimeout(typeSkill, speed);
    }
    typeSkill();
  }


  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --- IntersectionObserver Animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        if (entry.target.classList.contains('progress-bar')) {
          const width = entry.target.dataset.width || entry.target.style.width;
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 200);
        }
        if (entry.target.id === 'hero-image') {
          entry.target.style.animation = 'slideInRight 1.2s ease forwards';
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.skill-card, .project-card, .progress-bar, #hero-image, .animate-on-scroll');
  animateElements.forEach(el => {
    observer.observe(el);
  });

  // --- Project Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        filterBtns.forEach(b => {
          b.classList.remove('active');
        });
        this.classList.add('active');
        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-out';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML || submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission success
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.add('bg-green-500');
        submitBtn.classList.remove('bg-primary');
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-green-500');
          submitBtn.classList.add('bg-primary');
          contactForm.reset();
        }, 2500);
      }, 1200);
    });
  }
});

