// vehicle-form.js

// Capitalize function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get query parameters from the URL
function getQueryParams() {
  const params = {};
  window.location.search.substring(1).split('&').forEach(param => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

// Fetch car data and display the selected car
function displaySelectedCar() {
  const params = getQueryParams();
  const selectedMake = params.make;
  const selectedModel = params.model;

  // Fetch cars.txt
  fetch('cars.txt')
    .then(response => response.text())
    .then(data => {
      // Parse the cars data
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

      // Find the car matching the make and model
      const selectedCar = cars.find(car => {
        return car.make.toLowerCase() === selectedMake.toLowerCase() &&
               car.model.toLowerCase() === selectedModel.toLowerCase();
      });

      if (selectedCar) {
        // Display the car details
        const carDetailsContainer = document.getElementById('car-details-container');

        // Extract specs
        const seats = selectedCar.seats;
        const capacity = selectedCar.capacity;
        const engine = selectedCar.engine;
        const gears = selectedCar.gears;
        const pricePerDay = selectedCar['price-per-day'];
        const imgName = selectedCar['img-name'];

        // Get the elements inside the car-details-container
        const carNameElement = carDetailsContainer.querySelector('.car-name');
        const carPriceElement = carDetailsContainer.querySelector('.car-price');
        const carImgContainer = carDetailsContainer.querySelector('.car-img-container');
        const specsElement = carDetailsContainer.querySelector('.specs');

        // Set the content for each element if it exists
        if (carNameElement) {
          carNameElement.innerHTML = `
            <span class="car-make">${capitalizeFirstLetter(selectedCar.make)}</span>
            <span class="car-model">${capitalizeFirstLetter(selectedCar.model)}</span>
          `;
        }

        if (carPriceElement) {
          carPriceElement.textContent = `${selectedCar['price-per-day']} per day`;
        }

        if (carImgContainer) {
          carImgContainer.innerHTML = `
            <img class="car-img" src="images/cars/${selectedCar['img-name']}" alt="${selectedCar.make} ${selectedCar.model}">
          `;
        }

        if (specsElement) {
          specsElement.innerHTML = `
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
            </div>
          `;
        }


      } else {
        console.error('Selected car not found');
        // Optionally display a message to the user
        const carDetailsContainer = document.getElementById('car-details-container');
        carDetailsContainer.innerHTML = '<p>Sorry, the selected vehicle could not be found.</p>';
      }
    })
    .catch(error => console.error('Error fetching cars.txt:', error));
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