// nav.js

// Adding Nav
const navbarElement = document.getElementById('navbar');
fetch('/nav.html')
.then(response => response.text())
.then(data => {
  navbarElement.innerHTML = data;

  const navButtons = navbarElement.querySelector('.nav-buttons');

  // Check if not on the main page
  if (window.location.pathname !== '/') {
    navButtons.insertAdjacentHTML('afterbegin', `
      <a href="/" class="nav-btn english-txt">HOME</a>
      <a href="/" class="nav-btn thai-txt">หน้าหลัก</a>
    `);
  }

  // Highlight current page's nav item
  const currentPath = window.location.pathname;

  // For all nav buttons (both <a> and <button> elements)
  const navItems = navButtons.querySelectorAll('.nav-btn');

  navItems.forEach(navItem => {
    let itemPath = null;

    if (navItem.tagName.toLowerCase() === 'a') {
      itemPath = navItem.getAttribute('href');
    } else if (navItem.tagName.toLowerCase() === 'button') {
      itemPath = navItem.getAttribute('data-page');
    }

    if (itemPath) {
      // Handle absolute URLs
      if (itemPath.startsWith('http') || itemPath.startsWith('//')) {
        const url = new URL(itemPath, window.location.origin);
        itemPath = url.pathname;
      }

      // Compare itemPath with currentPath
      if (itemPath === currentPath) {
        // Apply the --primary-color style to this nav item
        navItem.classList.add('active-nav-item');
      }
    }
  });

  // Optional: Add click event listeners to buttons for navigation
  navItems.forEach(navItem => {
    if (navItem.tagName.toLowerCase() === 'button') {
      const page = navItem.getAttribute('data-page');
      navItem.addEventListener('click', () => {
        window.location.href = page;
      });
    }
  });

  // Nav Scrolling
  let lastScrollTop = 0;
  const root = document.documentElement;
  const nav = navbarElement.querySelector('nav');
  const navHeight = getComputedStyle(root).getPropertyValue('--nav-height');
  const scrollThreshold = 5; // amount to scroll down
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop + scrollThreshold) {
          nav.style.top = `-${navHeight}`; // Hide nav
        } else if (scrollTop < lastScrollTop) {
          nav.style.top = '0'; // Show nav
        }
        lastScrollTop = Math.max(scrollTop, 0); // For mobile devices / negative scrolling
        ticking = false;
      });
      ticking = true; // Ensures one update per frame
    }
  });

  // Hamburger code
  const hamburger = navbarElement.querySelector('.hamburger');
  hamburger.addEventListener('click', () => {
    navButtons.classList.toggle('nav-buttons--open');
  });
});