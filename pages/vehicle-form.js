// vehicle-form.js

// Capitalize function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Cache for fetched data
let carsDataCache = null;

// Get query parameters from the URL
function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

// Fetch and cache car data
async function fetchCarData() {
  if (carsDataCache) return carsDataCache;
  const response = await fetch('cars.txt');
  const data = await response.text();
  carsDataCache = data.trim().split('\n\n').map(carData => {
    const car = {};
    carData.split('\n').forEach(line => {
      const [key, value] = line.split(': ');
      const trimmedKey = key.trim();
      car[trimmedKey] = value.trim();
      if (trimmedKey.toLowerCase() === 'popular') car.isPopular = true;
      if (trimmedKey.toLowerCase() === 'luxury') car.isLuxury = true;
    });
    return car;
  });
  return carsDataCache;
}

// Display the selected car
async function displaySelectedCar() {
  const params = getQueryParams();
  const selectedMake = params.make?.toLowerCase();
  const selectedModel = params.model?.toLowerCase();

  if (!selectedMake || !selectedModel) return;

  try {
    const cars = await fetchCarData();
    const selectedCar = cars.find(car =>
      car.make.toLowerCase() === selectedMake &&
      car.model.toLowerCase() === selectedModel
    );

    const carDetailsContainer = document.getElementById('car-details-container');
    if (!selectedCar || !carDetailsContainer) {
      carDetailsContainer.innerHTML = '<p>Sorry, the selected vehicle could not be found.</p>';
      return;
    }

    // Update car details
    const carName = `<span class="car-make">${capitalizeFirstLetter(selectedCar.make)}</span>
                     <span class="car-model">${capitalizeFirstLetter(selectedCar.model)}</span>`;
    const carPrice = `${selectedCar['price-per-day']} per day`;
    const carImage = `<img class="car-img" src="images/cars/${selectedCar['img-name']}" alt="${selectedCar.make} ${selectedCar.model}">`;
    const specs = `
      <div class="spec-value">
        <img src="svgs/seats.svg" alt="${selectedCar.seats} Seats">
        <p class="english-txt">${selectedCar.seats} Seats</p>
      </div>
      <div class="spec-value">
        <img src="svgs/engine.svg" alt="${selectedCar.engine} Engine">
        <p class="english-txt">${selectedCar.engine} Engine</p>
      </div>
      <div class="spec-value">
        <img src="svgs/gears.svg" alt="${selectedCar.gears} Gears">
        <p class="english-txt">${capitalizeFirstLetter(selectedCar.gears)}</p>
      </div>
      <div class="spec-value">
        <img src="svgs/bags.svg" alt="Capacity: ${selectedCar.capacity}">
        <p class="english-txt">${selectedCar.capacity} Large Bags</p>
      </div>`;

    carDetailsContainer.querySelector('.car-name').innerHTML = carName;
    carDetailsContainer.querySelector('.car-price').textContent = carPrice;
    carDetailsContainer.querySelector('.car-img-container').innerHTML = carImage;
    carDetailsContainer.querySelector('.specs').innerHTML = specs;

  } catch (error) {
    console.error('Error displaying selected car:', error);
  }
}

// Call the function to display the selected car
displaySelectedCar();




// DOC Loaded
document.addEventListener("DOMContentLoaded", function() {

  // TODAYS DATE IN INPUT FIELDS
  const formatDate = (date) => date.toISOString().split('T')[0];

  // pick-up
  const today = new Date();
  document.getElementById('pickup-date').value = formatDate(today);

  // drop-off
  // const dropoffDate = new Date();
  // dropoffDate.setDate(today.getDate() + 7);
  // document.getElementById('dropoff-date').value = formatDate(dropoffDate);



  // DROP-OFF AUTOFILL
  // const pickupLocation = document.getElementById('pickup-location');
  // const dropoffLocation = document.getElementById('dropoff-location');

  // // When the pickup location is changed, set the dropoff location to the same value
  // pickupLocation.addEventListener('change', function() {
  //   const selectedValue = this.value;

  //   // Set the dropoff location to the same as pickup location
  //   dropoffLocation.value = selectedValue;
  // });



  // BUTTON OPACITY
  const form = document.querySelector('.vehicle-form');
  const submitButton = form.querySelector('button[type="submit"]');
  const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');

  // Get initial CSS values for bottom and right
  const initialStyles = window.getComputedStyle(submitButton);
  const initialBottom = parseInt(initialStyles.bottom, 10) || 0;
  const initialRight = parseInt(initialStyles.right, 10) || 0;

  const isFormComplete = () => [...requiredFields].every(field => field.value.trim() !== '');

  const moveButtonIfScrolled = () => {
    
    const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    const threshold = 360; // Adjust this value as needed (distance in pixels from the bottom)

    if (distanceFromBottom <= threshold) {
      // Move the submit button away from the initial position
      submitButton.style.bottom = (initialBottom + 80) + 'px';
      submitButton.style.right = (initialRight + 144) + 'px';
    } else {
      // Reset the submit button to the initial position
      submitButton.style.bottom = initialBottom + 'px';
      submitButton.style.right = initialRight + 'px';
    }
  };

  const toggleSubmitButton = () => {
    if (isFormComplete()) {
      submitButton.disabled = false;
      submitButton.style.pointerEvents = 'auto';
      submitButton.classList.remove('disabled');

      // Trigger the check to see if confirm button should move
      moveButtonIfScrolled();

      // Add scroll event listener if not already added
      if (!window.hasMoveButtonScrollListener) {
        window.addEventListener('scroll', moveButtonIfScrolled);
        window.hasMoveButtonScrollListener = true;
      }
    } else {
      submitButton.disabled = true;
      submitButton.style.pointerEvents = 'none';
      submitButton.classList.add('disabled');

      // Reset the submit button to the initial position
      submitButton.style.bottom = initialBottom + 'px';
      submitButton.style.right = initialRight + 'px';

      // Remove scroll event listener if it was added
      if (window.hasMoveButtonScrollListener) {
        window.removeEventListener('scroll', moveButtonIfScrolled);
        window.hasMoveButtonScrollListener = false;
      }
    }
  };

  let formInView = false;

  const handleScroll = () => {
    if (formInView && isFormComplete()) {
      moveButtonIfScrolled();
    } else {
      // Reset the submit button to the initial position
      submitButton.style.bottom = initialBottom + 'px';
      submitButton.style.right = initialRight + 'px';
    }
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === form) {
        if (entry.isIntersecting) {
          formInView = true;

          // Start monitoring required fields
          requiredFields.forEach(field => {
            field.addEventListener('input', toggleSubmitButton);
            field.addEventListener('change', toggleSubmitButton);
          });

          // Initial check
          toggleSubmitButton();
          // Add scroll event listener
          window.addEventListener('scroll', handleScroll);
          // Initial scroll check
          handleScroll();

        } else {
          formInView = false;
          // Remove required fields listeners
          requiredFields.forEach(field => {
            field.removeEventListener('input', toggleSubmitButton);
            field.removeEventListener('change', toggleSubmitButton);
          });

          // Enable the submit button when form is not in view
          submitButton.disabled = false;
          submitButton.style.pointerEvents = 'auto';
          submitButton.classList.remove('disabled');
          // Reset button position
          submitButton.style.bottom = initialBottom + 'px';
          submitButton.style.right = initialRight + 'px';
          // Remove scroll event listener
          window.removeEventListener('scroll', handleScroll);

        }
      }
    });
  }, { threshold: 0.14 }); // Change this to change when button first gets disabled

  observer.observe(form);


});