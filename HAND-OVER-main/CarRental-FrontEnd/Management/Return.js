
function returnShow() {
    document.getElementById('returncontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
}


// Function to return cars
async function returncars() {
    const nic = document.getElementById('return-nic').value;
    const registrationNumber = document.getElementById('return-registration').value;

    try {
        // Fetch all customers, cars, and rentals
        let [customersResponse, carsResponse, rentalsResponse] = await Promise.all([
            fetch('http://localhost:5027/api/Customer/GetAllCustomer'),
            fetch('http://localhost:5027/api/Car/Allcars'),
            fetch('http://localhost:5027/api/Manager/GetAllRentals')
        ]);

        const customers = await customersResponse.json();
        const cars = await carsResponse.json();
        const rentals = await rentalsResponse.json();
        console.log(cars);
        console.log(customers);

        // Find the customer by NIC
        const customer = customers.find(c => c.nic == nic);
        console.log(customer.id);


        if (!customer) {
            alert('Customer not found');
            return;
        }

        // Find the cars by registration number
        const car = cars.find(c => c.regnumber == registrationNumber);
        if (!car) {
            alert('cars not found');
            return;
        }
        console.log(car.id);

        const rental = rentals.find(r => r.customerId === customer.id && r.cCarId === car.id);
        console.log(rental);



        if (!rental) {
            alert('Rental record not found or already processed');
            return;
        }

        const returnCarsResponse = await fetch(`http://localhost:5027/api/Manager/car-return/${rental.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(returnCarsResponse);

        if (!returnCarsResponse.ok) {
            alert('Failed to process cars return');
            return;
        }

        alert('cars returned successfully!');
        document.getElementById('return-car-form').reset();

    } catch (error) {
        console.error('Error during car return:', error);
        alert('An error occurred while processing the return.');
    }
}

// Attach form submission handler
window.onload = function () {
    const form = document.getElementById('return-car-form');
    form.onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission to server
        returncars();
    };
};
