
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

// Add .popular or .luxury class if present
// if (car.popular === 'y') carContainer.classList.add('popular');
// if (car.luxury === 'y') carContainer.classList.add('luxury');

let originalCarOrder = [];

fetch('cars.txt')
  .then(response => response.text())
  .then(async data => {
    const carsGrid = document.getElementById('cars-grid');

    // Get GBP -> BHT Current Rate
    const exchangeRate = await fetchExchangeRate();
    if (!exchangeRate) {
      console.error('Failed to fetch exchange rate. Prices in Baht will not be displayed.');
      return;
    }

    // Split the cars.txt data into individual car entries
    const cars = data.trim().split('\n\n').map(carData => {
      const car = {};
      carData.split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        car[key.trim().toLowerCase()] = value.trim();
      });
      return car;
    });

    // Store the original order for "recommended" sorting
    originalCarOrder = [...cars];

    // Append each car
    cars.forEach(car => {

      // Add car-details class + get car type
      const carType = car.type ? car.type.toLowerCase() : 'unknown';
      const carContainer = document.createElement('div');
      carContainer.classList.add('car-details', carType);

      // Adds 'data-price' attribute with GBP value
      const priceText = car['price-per-day'] || '£0.00';
      const numericPrice = parseFloat(priceText.replace('£', '').trim());
      carContainer.setAttribute('data-price', numericPrice);

      // Convert GBP price to THB (to nearest 9)
      const priceInBaht = Math.round(numericPrice * exchangeRate / 10) * 10 - 1;
      // const priceInBaht = (numericPrice * exchangeRate).toFixed(0);

      carContainer.innerHTML = `
        <h3 class="car-name">
          <span class="car-make">${capitalize(car.make)}</span>
          <span class="car-model">${capitalize(car.model)}</span>
        </h3>
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
            ${capitalize(car.gears)}
          </div>
        </div>
        <div class="car-img-container">
          <img class="car-img" src="images/cars/${car['img-name']}" alt="${capitalize(car.make)} ${capitalize(car.model)}">
        </div>
        <p class="car-price english-txt">£${numericPrice.toFixed(2)} | ฿${priceInBaht} <span class="pd">per day</span></p>
        <p class="car-price thai-txt">£${numericPrice.toFixed(2)} | ฿${priceInBaht} <span class="pd">ต่อวัน</span></p>
        <p class="insurance-cover spec-value"><span class="ic-tick">✔</span> Full Insurance Cover</p>
        <button class="car-book-btn btn-shine english-txt" style="--shine-speed: 0.9s;">&gt; BOOK</button>
        <button class="car-book-btn btn-shine thai-txt" style="--shine-speed: 0.9s;">&gt; จอง</button>
      `;

      // Check if image available
      const img = carContainer.querySelector('.car-img');
      img.onerror = () => {
        console.error(`Image not found for car: ${car.make} ${car.model} (img: ${car['img-name']})`);
        carContainer.remove(); // Remove the car container if image not found
      };

      // Redirect click to the booking form
      carContainer.addEventListener('click', () => {
        window.location.href = `vehicle-form.html?make=${encodeURIComponent(car.make)}&model=${encodeURIComponent(car.model)}`;
      });

      // Append car container
      carsGrid.appendChild(carContainer);
    });
  })
  .catch(error => console.error('Error fetching cars.txt:', error));

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);



// CHANGING LANGUAGE
function applyLanguage(isThai) {
  const changeLangSpeed = 400;

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
    // Reset to original order using the originalCarOrder array
    grid.innerHTML = ''; // Clear grid
    originalCarOrder.forEach(car => {
      const matchingElement = cars.find(el => el.querySelector('.car-make').innerText.toLowerCase() === car.make &&
                                              el.querySelector('.car-model').innerText.toLowerCase() === car.model);
      if (matchingElement) grid.appendChild(matchingElement);
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