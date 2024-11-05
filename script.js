
// DARK MODE
const dark_mode = "y";
if (dark_mode) {
  document.body.classList.toggle('dark-mode');
};


// CHANGE LANGUAGE
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

// Expose the function globally
window.applyLanguage = applyLanguage;


// CAPITALISE
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// CHECK CAR IMAGE
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// HANDLE VEHICLE SELECTION
function selectVehicle(car) {
  const make = encodeURIComponent(car.make);
  const model = encodeURIComponent(car.model);
  window.location.href = `vehicle-form.html?make=${make}&model=${model}`; // Pass car make and model
}


// LOAD VEHICLES INTO GRID
fetch('cars.txt')
.then(response => response.text())
.then(data => {
  // Split data into individual car entries
  const cars = data.trim().split('\n\n').map(carData => {
    const car = {};
    carData.split('\n').forEach(line => {
      const [key, value] = line.split(': ');
      const trimmedKey = key.trim();
      car[trimmedKey] = value.trim();
      // Check if the car is popular or luxury
      if (trimmedKey.toLowerCase() === 'popular') car.isPopular = true;
      if (trimmedKey.toLowerCase() === 'luxury') car.isLuxury = true;
    });
    return car;
  });

  // Check if image exists for each car
  Promise.all(
    cars.map(car =>
      checkImageExists(`images/cars/${car['img-name']}`).then(exists => (exists ? car : null))
    )
  ).then(carsWithImages => {
    // Image exists
    carsWithImages.filter(Boolean).forEach(car => {
      const carContainer = document.createElement('div');
      carContainer.classList.add('car-details');

      // Extract specs
      const seats = car.seats;
      const capacity = car.capacity;
      const engine = car.engine;
      const gears = car.gears;

      // Create the inner HTML with car data
      carContainer.innerHTML = `
      <h3 class="car-name">
        <span class="car-make">${capitalizeFirstLetter(car.make)}</span>
        <span class="car-model">${capitalizeFirstLetter(car.model)}</span>
      </h3>
      <p class="car-price english-txt">${car['price-per-day']}<br>per day</p>
      <p class="car-price thai-txt">${car['price-per-day']}<br>ต่อวัน</p>
      <div class="car-img-container ${car.isPopular ? 'popular' : ''} ${car.isLuxury ? 'luxury' : ''}">
        <img class="car-img" src="/images/cars/${car['img-name']}" alt="${car.make} ${car.model}">
      </div>
      <!-- Specs -->
      <div class="specs">
        <div class="spec-value">
          <img src="/svgs/seats.svg" alt="${seats} Seats">
          <p class="english-txt">${seats} Seats</p>
          <p class="thai-txt">${seats} ที่นั่ง</p>
        </div>
        <div class="spec-value">
          <img src="/svgs/bags.svg" alt="Capacity: ${capacity}">${capacity}
        </div>
        <div class="spec-value">
          <img src="/svgs/engine.svg" alt="${engine} Engine">
          <p class="english-txt">${engine} Engine</p>
          <p class="thai-txt">${engine} เครื่องยนต์</p>
        </div>
        <div class="spec-value">
          <img src="/svgs/gears.svg" alt="${gears} Gears"> ${capitalizeFirstLetter(gears)}
        </div>
      </div>
      <button class="car-book-btn btn-shine english-txt" style="--shine-speed: 0.9s;">&gt; BOOK</button>
      <button class="car-book-btn btn-shine thai-txt" style="--shine-speed: 0.9s;">&gt; จอง</button>
      `;

      // Attach vehicle selection handler
      carContainer.addEventListener('click', function() {
        selectVehicle(car);  // Call the new function
      });

      // Determine the section based on car type
      const section = document.getElementById(car.type.toLowerCase() + 's');
      if (section) {
        const button = document.getElementById(car.type.toLowerCase() + '-view-all');
        if (button && section.contains(button)) {
          // Insert carContainer before the button
          section.insertBefore(carContainer, button);
        } else {
          // Append carContainer to the section
          section.appendChild(carContainer);
        }
      } else {
        console.error(`Section with id ${car.type.toLowerCase()}s not found`);
      }
    });
  });
})
.catch(error => console.error('Error fetching cars.txt:', error));


// DOC FULLY LOADED
document.addEventListener("DOMContentLoaded", function() {

  // CHANGING LANGUAGE
  const langToggle = document.getElementById('lang-toggle');

  // Event listener for language toggle switch
  langToggle.addEventListener('change', function() {
    // When switch is toggled
    const isThai = this.checked;
    applyLanguage(isThai);
  });

  // Optionally, call reapplyLanguage on page load to set initial state
  // For example, if you want to default to English:
  // reapplyLanguage(false);

});






// SUV/SEDAN/PICKUP CHECKBOXES

const carTypes = ['sedans', 'suvs', 'pickups'];

function toggleDisplay(showAll) {
  carTypes.forEach(type => {
    const grid = document.getElementById(type);
    const title = document.getElementById(`${type}-title`);
    const checkbox = document.getElementById(`show-${type}`);

    const displayStyle = showAll || checkbox.checked ? 'grid' : 'none';
    const titleStyle = showAll || checkbox.checked ? 'block' : 'none';

    grid.style.display = displayStyle;
    title.style.display = titleStyle;
  });
}
function onCarTypeChange() {
  carTypes.forEach(type => {
    document.getElementById(`show-${type}`).addEventListener('change', () => {
      const anyChecked = carTypes.some(type => document.getElementById(`show-${type}`).checked);
      toggleDisplay(!anyChecked);
    });
  });
}
// Initial call to set up event listeners and show all by default
onCarTypeChange();
toggleDisplay(true);


// SORT DROPDOWN - FUNCTION

document.querySelector('.sort-button').addEventListener('click', function(event) {
  event.stopPropagation(); // Prevents the click from bubbling up to the document
  document.querySelector('.sort-dropdown').classList.toggle('show');
});
// Update the sort type when an option is clicked
document.querySelectorAll('.sort-option').forEach(function(option) {
  option.addEventListener('click', function() {
    document.getElementById('sort-type').innerText = this.innerText;
    document.querySelector('.sort-dropdown').classList.remove('show');
  });
});
// Close the dropdown if clicked outside
document.addEventListener('click', function() {
  var dropdown = document.querySelector('.sort-dropdown');
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});


// SCROLL TO CARS

function scrollToCars() {
  const carsSection = document.querySelector('.cars-section');
  const offset = 0.27 * window.innerHeight; // 20vh offset
  const position = carsSection.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: position, behavior: 'smooth' });
}




// VEHICLE FORM - DISPLAY IMAGE
function displaySelectedCar() {
  const urlParams = new URLSearchParams(window.location.search);
  const make = decodeURIComponent(urlParams.get('make'));
  const model = decodeURIComponent(urlParams.get('model'));

  // Fetch the car data from cars.txt
  fetch('cars.txt')
    .then(response => response.text())
    .then(data => {
      const cars = data.trim().split('\n\n').map(carData => {
        const car = {};
        carData.split('\n').forEach(line => {
          const [key, value] = line.split(': ');
          car[key.trim()] = value.trim();
        });
        return car;
      });

      // Find the matching car based on the make and model
      const selectedCar = cars.find(car => car.make.toLowerCase() === make.toLowerCase() && car.model.toLowerCase() === model.toLowerCase());

      if (selectedCar) {
        // Create HTML for the selected car
        const carDetailsHTML = `
          <h3 class="car-name">
            <span class="car-make">${capitalizeFirstLetter(selectedCar.make)}</span>
            <span class="car-model">${capitalizeFirstLetter(selectedCar.model)}</span>
          </h3>
          <p class="car-price english-txt">${selectedCar['price-per-day']} per day</p>
          <div class="car-img-container">
            <img class="car-img" src="/images/cars/${selectedCar['img-name']}" alt="${selectedCar.make} ${selectedCar.model}">
          </div>
          <div class="specs">
            <div class="spec-value">
              <img src="/svgs/seats.svg" alt="${selectedCar.seats} Seats">
              <p class="english-txt">${selectedCar.seats} Seats</p>
            </div>
            <div class="spec-value">
              <img src="/svgs/engine.svg" alt="${selectedCar.engine} Engine">
              <p class="english-txt">${selectedCar.engine} Engine</p>
            </div>
            <div class="spec-value">
              <img src="/svgs/gears.svg" alt="${selectedCar.gears} Gears"> ${capitalizeFirstLetter(selectedCar.gears)}
            </div>
            <div class="spec-value">
              <img src="/svgs/bags.svg" alt="Capacity: ${selectedCar.capacity}">${selectedCar.capacity}
            </div>
          </div>
        `;

        // Insert the car details into the page
        document.getElementById('selected-car').innerHTML = carDetailsHTML;
      } else {
        console.error('Car not found');
      }
    })
    .catch(error => console.error('Error fetching car data:', error));
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Call the function to display the selected car when the page loads
displaySelectedCar();
