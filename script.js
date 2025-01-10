
// DARK MODE

const dark_mode = "y";
if (dark_mode) {
  document.body.classList.toggle('dark-mode');
};



// GBP -> BHT EXCHANGE RATE

async function fetchExchangeRate() {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=GBP&to=THB');
    const data = await response.json();
    return data.rates.THB;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}



// LOAD VEHICLES INTO GRID

let originalCarOrder = [];

fetch('cars.txt')
  .then(response => response.text())
  .then(async data => {
    const carsGrid = document.getElementById('cars-grid');
    const exchangeRate = await fetchExchangeRate();
    if (!exchangeRate) {
      console.error('Failed to fetch exchange rate.');
      return;
    }

    const cars = data.trim().split('\n\n').map(carData => {
      const car = {};
      carData.split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        car[key.trim().toLowerCase()] = value.trim();
      });
      return car;
    });

    let loadedCars = 0;
    let placeholdersRemoved = false;

    cars.forEach(car => {
      const carType = car.type ? car.type.toLowerCase() : 'unknown';
      const carContainer = document.createElement('div');
      carContainer.classList.add('car-details', carType);

      const priceText = car['price-per-day'] || '£0.00';
      const numericPrice = parseFloat(priceText.replace('£', '').trim());
      carContainer.setAttribute('data-price', numericPrice);
      const priceInBaht = Math.round(numericPrice * exchangeRate / 10) * 10 - 1;

      // Add .popular or .luxury class if present
      if (car.popular === 'y') carContainer.classList.add('popular');
      if (car.luxury === 'y') carContainer.classList.add('luxury');

      carContainer.innerHTML = `
        <h3 class="car-name">
          <span class="car-make">${capitalize(car.make)}</span>
          <span class="car-model">${capitalize(car.model)}</span>
        </h3>
        <p class="insurance-cover spec-value">
          <svg class="ic-tick" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 42.121 41.242" fill="currentColor"><path d="M15.186 41.112C10.671 42.956.165 24.65 0 21.055c9.39-8.909 10.84 3.641 15.532 9.622.585.563 1.621 3.473 2.393 2.552 5.678-9.826 10.476-20.102 15.331-30.347C34.914.11 38.689-.297 41.596.16c1.967.967-2.203 5.806-2.476 7.668-5.641 9.175-11.974 32.719-23.934 33.284Z"/></svg>
          <span class="english-txt">Full Insurance Cover</span>
          <span class="thai-txt">ประกันภัยแบบเต็มรูปแบบ</span>
        </p>
        <div class="car-img-container">
          <img class="car-img" src="images/cars/${car['img-name']}" alt="${capitalize(car.make)} ${capitalize(car.model)}">
        </div>
        <p class="car-price english-txt">£${numericPrice.toFixed(2)} | ฿${priceInBaht} <span class="pd">per day</span></p>
        <p class="car-price thai-txt">£${numericPrice.toFixed(2)} | ฿${priceInBaht} <span class="pd">ต่อวัน</span></p>
        <div class="specs">
          <div class="spec-value">
            <img src="svgs/seats.svg" alt="${car.seats} Seats">
            <p class="english-txt">${car.seats}</p>
            <p class="thai-txt">${car.seats} ที่นั่ง</p>
          </div>
          <div class="spec-value">
            <img src="svgs/bags.svg" alt="Capacity: ${car.capacity}">
            ${car.capacity}
          </div>
          <div class="spec-value">
            <img src="svgs/engine.svg" alt="${car.engine} Engine">
            <p class="english-txt">${car.engine}</p>
            <p class="thai-txt">${car.engine} เครื่องยนต์</p>
          </div>
          <div class="spec-value">
            <img src="svgs/gears.svg" alt="${car.gears} Gears">
            ${car.gears === 'automatic' 
                ? '<span class="english-txt">Automatic</span> <span class="thai-txt">อัตโนมัติ</span>' 
                : `<span class="english-txt">${capitalize(car.gears)}</span>`}
          </div>
        </div>
      `;

      const img = carContainer.querySelector('.car-img');
      carsGrid.appendChild(carContainer);

      if (!placeholdersRemoved && carsGrid.children.length >= 9) {
        const placeholders = document.querySelectorAll('.car-details.placeholder');
        placeholders.forEach(placeholder => placeholder.remove());
        placeholdersRemoved = true;
      }

      carContainer.addEventListener('click', () => {
        window.location.href = `vehicle-form.html?make=${encodeURIComponent(car.make)}&model=${encodeURIComponent(car.model)}`;
      });

      img.onload = () => {
        originalCarOrder.push(car);
        loadedCars++;
      };

      img.onerror = () => {
        console.error(`Image not found: ${car['img-name']}`);
        carContainer.remove();
        loadedCars++;
      };
    });
  })
  .catch(error => console.error('Error fetching cars.txt:', error));

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);



// CHANGING LANGUAGE
function applyLanguage(isThai) {
  const changeLangSpeed = 400;

  // Set CSS variable for popular text based on language
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--popular-text', isThai ? 'var(--popular-text-th)' : 'var(--popular-text-en)');
  rootStyle.setProperty('--lux-text', isThai ? 'var(--lux-text-th)' : 'var(--lux-text-en)');

  // Re-select elements dynamically in case new elements have been added
  const thaiTexts = document.querySelectorAll('.thai-txt');
  const englishTexts = document.querySelectorAll('.english-txt');

  // Hide English text with animation
  englishTexts.forEach(en => {
    en.style.transform = 'translateY(-20px)';
    en.style.opacity = 0;
    setTimeout(() => {
      en.style.display = 'none';
    }, changeLangSpeed);
  });

  if (isThai) {
    // Show Thai text with animation
    thaiTexts.forEach(thai => {
      setTimeout(() => {
        thai.style.display = 'block';
        thai.style.transform = 'translateY(20px)';
        thai.style.opacity = 0;
        setTimeout(() => {
          thai.style.transform = '';
          thai.style.opacity = 1;
        }, 55);
      }, changeLangSpeed);
    });
  } else {
    // Hide Thai text and show English text
    thaiTexts.forEach(thai => {
      thai.style.transform = 'translateY(-20px)';
      thai.style.opacity = 0;
      setTimeout(() => {
        thai.style.display = 'none';
      }, changeLangSpeed);
    });

    englishTexts.forEach(en => {
      setTimeout(() => {
        en.style.display = 'block';
        en.style.transform = 'translateY(20px)';
        en.style.opacity = 0;
        setTimeout(() => {
          en.style.transform = '';
          en.style.opacity = 1;
        }, 55);
      }, changeLangSpeed);
    });
  }
}
// Exposes language function globally
window.applyLanguage = applyLanguage;



// DOC FULLY LOADED
document.addEventListener("DOMContentLoaded", function() {

  // Event listener for language toggle
  const langToggle = document.getElementById('lang-toggle');
  langToggle.addEventListener('change', function() {
    const isThai = this.checked;
    applyLanguage(isThai);
  });

});


// FILTER CARS BASED ON CHECKBOXES
const carTypes = ['sedan', 'suv', 'pickup', 'van'];
const filterCars = () => {
  const selectedTypes = carTypes.filter(type => document.getElementById(`show-${type}`).checked);
  const showAll = selectedTypes.length === 0;
  document.querySelectorAll('.car-details').forEach(car => {
    car.style.display = showAll || selectedTypes.some(type => car.classList.contains(type)) ? '' : 'none';
  });
};

carTypes.forEach(type => {
  document.getElementById(`show-${type}`).addEventListener('change', filterCars);
});

// Initially, show all cars
filterCars();



// SORT DROPDOWN

document.querySelector('.sort-button').addEventListener('click', function(event) {
  event.stopPropagation(); // Prevents the click from bubbling up to the document
  document.querySelector('.sort-dropdown').classList.toggle('show');
});

// Update the sort type and trigger sorting
document.querySelectorAll('.sort-option').forEach(function(option) {
  option.addEventListener('click', function() {
    document.getElementById('sort-type').innerText = this.innerText;
    document.querySelector('.sort-dropdown').classList.remove('show');
    
    const sortType = this.dataset.sort;
    sortCars(sortType);
  });
});

// Closes dropdown if clicked outside
document.addEventListener('click', function() {
  var dropdown = document.querySelector('.sort-dropdown');
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});
// Sort logic
function sortCars(sortType) {
  const grid = document.getElementById('cars-grid');
  const cars = Array.from(grid.querySelectorAll('.car-details'));

  let sortedCars;
  if (sortType === 'price-asc') {
    sortedCars = cars.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (sortType === 'price-desc') {
    sortedCars = cars.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  } else if (sortType === 'recommended') {
    grid.innerHTML = ''; // Clear grid
    originalCarOrder.forEach(car => {
      const matchingElement = cars.find(el => 
        el.querySelector('.car-make').innerText.toLowerCase() === car.make.toLowerCase() &&
        el.querySelector('.car-model').innerText.toLowerCase() === car.model.toLowerCase()
      );
      if (matchingElement) {
        grid.appendChild(matchingElement);
      }
    });
    return;
  }

  // Reattach sorted elements to the grid
  grid.innerHTML = '';
  sortedCars.forEach(car => grid.appendChild(car));
}



// SCROLL TO CARS

function scrollToCars() {
  const carsSection = document.querySelector('.cars-section');
  const offset = 0.27 * window.innerHeight; // 20vh offset
  const position = carsSection.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: position, behavior: 'smooth' });
}