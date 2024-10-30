
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const availablecarBody = document.getElementById('car-list');
    const myRentalsTableBody = document.getElementById('myRentalsTableBody');
    const rentalsModal = document.getElementById('rentalsModal');
    const closeRentalsModal = document.getElementById('closeRentalsModal');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let cars = []; // Will now refer to cars instead
    let rentals = [];

    // Display the current user's name
    if (userInfo && currentUser) {
        userInfo.textContent = `${currentUser.name}`;
    }

    // Fetch all cars from the server
    async function fetchCars() {
        try {
            const response = await fetch('http://localhost:5027/api/Car/Allcars'); // Endpoint modified to fetch all cars
            cars = await response.json(); // Store cars in cars array
            displayAvailableCars(); // Function displays available cars instead
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    }

    // Fetch the user's rentals
    async function fetchRentals() {
        try {
            const response = await fetch('http://localhost:5027/api/Manager/GetAllRentals');
            rentals = await response.json();
        } catch (error) {
            console.error('Error fetching rentals:', error);
        }
    }

    // Display available cars
    function displayAvailableCars() {
        const searchBar = document.getElementById('searchBar');
        const searchQuery = searchBar ? searchBar.value.toLowerCase() : '';

        availablecarBody.innerHTML = ''; // Clear previous content

        cars.forEach(car => {
           var findrentcar= rentals.some(rental => rental.cCarId == id);
            if (!findrentcar && (
                car.title.toLowerCase().includes(searchQuery) ||
                car.description.toLowerCase().includes(searchQuery) ||
                car.model.toLowerCase().includes(searchQuery) ||
                car.brand.toLowerCase().includes(searchQuery)
            )) {
                const carBox = document.createElement('div');
                carBox.classList.add('rent-box');
                const imageUrls = car.imageUrl.split(',');
                let fullUrl = imageUrls.map(url => `http://localhost:5027${url}`).join('');

                carBox.innerHTML = `
                    <img src="${fullUrl}" alt="${car.title}">
                    <div class="rent-layer">
                        <h4>${car.title}</h4>
                        <p>${car.description}</p>
                        <p>Model: ${car.model}</p>
                        <p>Brand: ${car.brand}</p>
                        <a href="#" onclick="rentCar('${car.id}')"><i class='bx'>Rent</i></a>
                    </div>
                `;
                availablecarBody.appendChild(carBox);
            }
        });
    }

    // Rent a car
    window.rentCar = async function (id) {
        const rental = {
            customerID: currentUser.id,
            cCarId: id,
            rentalDate: new Date().toISOString(),
            returndate: new Date().toISOString(),
            overDue: true,
            status: "Pending",
        };

        console.log('Rental Object:', rental);  // For debugging

        try {
            const response = await fetch('http://localhost:5027/api/Manager/AddRental', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rental)
            });

            if (!response.ok) {
                throw new Error('Failed to rent car');
            }

            console.log('Car rented successfully:', id);

            // Fetch updated cars and rentals after renting
            await fetchCars();
            await fetchRentals();
        } catch (error) {
            console.error('Error renting car:', error);
        }
        
    };

    // Display user's rentals in a modal window
    async function displayMyRentals() {
        const profileModal = document.getElementById('profileModal');

        // Close profile modal if open
        if (profileModal) {
            profileModal.style.display = 'none';
        }

        // Ensure rentals table body exists and clear previous content
        if (!myRentalsTableBody) return;
        myRentalsTableBody.innerHTML = '';

        try {
            // Fetch the user's rentals from the server
            const response = await fetch('http://localhost:5027/api/Manager/GetAllRentals');
            if (!response.ok) {
                throw new Error('Failed to fetch rentals');
            }

            const rentals = await response.json();
            console.log(rentals);
            console.log(cars);


            // Iterate through the user's rentals and populate the table
            rentals.forEach(rental => {
                if (rental.customerId === currentUser.id) {

                    const car = cars.find(c => c.id === rental.cCarId);
                    if (car) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${car.regnumber}</td>
                            <td>${car.brand}</td>
                            <td>${car.model}</td>
                            <td>${new Date(rental.rentalDate).toLocaleDateString()}</td>
                            <td>${rental.status}</td>
                        `;
                        myRentalsTableBody.appendChild(row); // Append row to the table
                    }
                }
            });

            // Show the modal containing the rentals
            if (rentalsModal) {
                rentalsModal.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching rentals:', error);
        }
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser');
            window.location.href = '../car-rent-greetingpage.html';
        });
    }

    // Event listener to filter cars by search input
    document.getElementById('searchBar').addEventListener('input', displayAvailableCars);

    // Event listener to trigger rentals display when "rentalhistory" button is clicked
    document.getElementById('rentalhistory').addEventListener('click', async function () {
        await fetchRentals(); // Fetch rentals before displaying them
        displayMyRentals();
    });

    // Close rentals modal
    if (closeRentalsModal) {
        closeRentalsModal.addEventListener('click', function () {
            if (rentalsModal) {
                rentalsModal.style.display = 'none'; // Hide the modal
            }
        });
    }

    // Optional: Close the modal if the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === rentalsModal) {
            rentalsModal.style.display = 'none'; // Hide the modal
        }
    });

    // Initial fetch calls
    fetchCars(); // Fetch all cars initially
    fetchRentals();
});
