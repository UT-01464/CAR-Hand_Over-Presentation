document.addEventListener('DOMContentLoaded', () => {
    const carList = document.getElementById('car-list');

    function fetchCars() {
        fetch('http://localhost:5027/api/Car/Allcars')  // Adjust the path as needed
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(cars => {
                addCarsToDOM(cars);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function addCarsToDOM(cars) {
        cars.forEach(car => {
            const newDiv = document.createElement('div');
            newDiv.classList.add('car-card');
            const imageUrls = car.imageUrl.split(',');
            let fullUrl = '';
            imageUrls.forEach(url => {
                 fullUrl += `http://localhost:5027${url}`.trim();
                console.log(fullUrl);
            });

            newDiv.innerHTML = `
                <div><img src='${fullUrl}' width=100px></div>
                <div class="car-details">
                    <h2>${car.title}</h2>
                    <p>Type: ${car.model}</p>
                    <p>Brand: ${car.description}</p>
                    <p>Model Year: ${car.brand}</p>
                    <p>${car.regnumber}</p>
                    <button class="rent-now">Rent Now</button>
                </div>`;

            carList.appendChild(newDiv);

            const rentNowButton = newDiv.querySelector('.rent-now');
            rentNowButton.addEventListener('click', () => {
                window.location.href = 'Login/Login.html';
            });
        });
    }

    fetchCars();
});

// read-more

document.getElementById("read-more-btn").addEventListener("click", function() {
    const extraText = document.getElementById("extra-text");
    if (extraText.style.display === "none") {
        extraText.style.display = "inline"; // Show the extra text
        this.textContent = "Read Less"; // Change the button text to 'Read Less'
    } else {
        extraText.style.display = "none"; // Hide the extra text
        this.textContent = "Read More"; // Change back to 'Read More'
    }
});

