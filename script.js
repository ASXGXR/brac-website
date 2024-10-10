
// Dark Mode
const dark_mode = "y";
if (dark_mode) {
  document.body.classList.toggle('dark-mode');
};


// Loading Vehicles
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
fetch('cars.txt')
.then(response => response.text())
.then(data => {
  // Split data into individual car entries
  const carsData = data.trim().split('\n\n');
  const cars = carsData.map(carData => {
    const car = {};
    const lines = carData.split('\n');
    lines.forEach(line => {
      const [key, value] = line.split(': ');
      car[key.trim()] = value.trim();
    
      // Check if the car is popular
      if (key.trim().toLowerCase() === 'popular') {
        car.isPopular = true;
      }
    });    
    return car;
  });

  // Process each car and generate HTML
  cars.forEach(car => {
    const carContainer = document.createElement('div');
    carContainer.classList.add('car-details');
    
    // Create the inner HTML with car data
    carContainer.innerHTML = `
      <h3 class="car-name">
        <span class="car-make">${capitalizeFirstLetter(car.make)}</span>
        <span class="car-model">${capitalizeFirstLetter(car.model)}</span>
      </h3>
      <p class="car-price english-txt">${car['price-per-day']}<br>per day</p>
      <p class="car-price thai-txt">${car['price-per-day']}<br>ต่อวัน</p>
      <div class="car-img-container ${car.isPopular ? 'popular' : ''}">
        <img class="car-img" src="images/cars/${car['img-name']}" alt="${car.make} ${car.model}">
      </div>
      <!-- Specs -->
      <div class="specs">
        <div class="spec-item english-txt">NO. SEATS<div class="spec-value">${car.seats}</div></div>
        <div class="spec-item thai-txt">จำนวนที่นั่ง<div class="spec-value">${car.seats}</div></div> 
        <div class="spec-item english-txt">ENGINE<div class="spec-value">${car.engine}</div></div>
        <div class="spec-item thai-txt">เครื่องยนต์<div class="spec-value">${car.engine}</div></div>
        <div class="spec-item english-txt">GEARS<div class="spec-value">${car.gears}</div></div>
        <div class="spec-item thai-txt">เกียร์<div class="spec-value">${car.gears}</div></div>
      </div>
      <button class="car-book-btn btn-shine english-txt" style="--shine-speed: 0.9s;">&gt; BOOK</button>
      <button class="car-book-btn btn-shine thai-txt" style="--shine-speed: 0.9s;">&gt; จอง</button>
    `;
    
    // Determine the section based on car type
    let sectionId = car.type.toLowerCase() + 's';
    const section = document.getElementById(sectionId);

    if (section) {
      // Get the button by constructing its ID
      const buttonId = car.type.toLowerCase() + '-view-all';
      const button = document.getElementById(buttonId);

      if (button && section.contains(button)) {
        // Insert carContainer before the button
        section.insertBefore(carContainer, button);
      } else {
        // If the button is not found or not a child, append carContainer to the section
        section.appendChild(carContainer);
      }
    } else {
      console.error(`Section with id ${sectionId} not found`);
    }


  });
})
.catch(error => {
  console.error('Error fetching cars.txt:', error);
});


// DOM FULLY LOADED
document.addEventListener("DOMContentLoaded", function() {

  // CHANGING LANGUAGE
  const changeLangSpeed = 400;
  const langToggle = document.getElementById('lang-toggle');
  langToggle.addEventListener('change', function() {
    const isThai = this.checked;

    // Re-select elements dynamically in case new elements have been added
    const thaiTexts = document.querySelectorAll('.thai-txt');
    const englishTexts = document.querySelectorAll('.english-txt');

    // Hide English text with animation
    englishTexts.forEach(en => {
      en.style.transform = 'translateY(-20px)'; // Only apply the necessary transform
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
          thai.style.transform = 'translateY(20px)'; // Apply animation transform directly
          thai.style.opacity = 0;
          setTimeout(() => {
            thai.style.transform = ''; // Allow the element to return to its natural state without forcing translateY(0)
            thai.style.opacity = 1;
          }, 55);
        }, changeLangSpeed);
      });
    } else {
      // Hide Thai text and show English text
      thaiTexts.forEach(thai => {
        thai.style.transform = 'translateY(-20px)'; // Apply the necessary animation
        thai.style.opacity = 0;
        setTimeout(() => {
          thai.style.display = 'none';
        }, changeLangSpeed);
      });

      englishTexts.forEach(en => {
        setTimeout(() => {
          en.style.display = 'block';
          en.style.transform = 'translateY(20px)'; // Apply the necessary animation
          en.style.opacity = 0;
          setTimeout(() => {
            en.style.transform = ''; // Let it go back to its natural state
            en.style.opacity = 1;
          }, 55);
        }, changeLangSpeed);
      });
    }
  });
});