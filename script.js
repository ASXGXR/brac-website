// Changing Language

const changeLangSpeed = 400;
document.getElementById('lang-toggle').addEventListener('change', function() {
  const isThai = this.checked;

  document.querySelectorAll('.thai-txt').forEach(e => {
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
      setTimeout(() => {
        e.style.display = 'block';
        e.style.transform = 'translateY(20px)';
        e.style.opacity = 0;
        setTimeout(() => {
          e.style.transform = 'translateY(0)';
          e.style.opacity = 1;
        }, 55);
      }, changeLangSpeed);
    } else {
      // Hide Thai text and show English text
      e.style.transform = 'translateY(-20px)';
      e.style.opacity = 0;
      setTimeout(() => {
        e.style.display = 'none';
      }, changeLangSpeed);

      englishTexts.forEach(en => {
        setTimeout(() => {
          en.style.display = 'block';
          en.style.transform = 'translateY(20px)';
          en.style.opacity = 0;
          setTimeout(() => {
            en.style.transform = 'translateY(0)';
            en.style.opacity = 1;
          }, 55);
        }, changeLangSpeed);
      });
    }
  });
});



// Loading Vehicles

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
        <span class="car-make">${car.make}</span>&nbsp;
        <span class="car-model">${car.model}</span>
      </h3>
      <p class="car-price">${car['price-per-week']}<br>per week</p>
      <img class="car-img" src="images/cars/${car['img-name']}" alt="${car.make} ${car.model}">
      <!-- Specs -->
      <div class="specs">
        <div class="spec-item">NO. SEATS<div class="spec-value">${car.seats}</div></div>          
        <div class="spec-item">ENGINE<div class="spec-value">${car.engine}</div></div>
        <div class="spec-item">GEARS<div class="spec-value">${car.gears}</div></div>
      </div>
      <button class="car-book-btn btn-shine" style="--shine-speed: 0.9s;">&gt; BOOK</button>
    `;
    
    // Determine the section based on car type
    let sectionId;
    if (car.type.toLowerCase() === 'suv') {
      sectionId = 'suvs';
    } else if (car.type.toLowerCase() === 'sedan') {
      sectionId = 'sedans';
    } else {
      // If type is not recognized, skip this car or assign a default section
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.appendChild(carContainer);
    } else {
      console.error(`Section with id ${sectionId} not found`);
    }
  });
})
.catch(error => {
  console.error('Error fetching cars.txt:', error);
});