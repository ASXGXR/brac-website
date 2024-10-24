
// Utility function to capitalize the first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to get query parameters from the URL
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

        // Create the HTML content
        const carContent = `
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

        // Insert the car content into the container
        carDetailsContainer.innerHTML = carContent;

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