
function bookingHistoryShow() {
    document.getElementById('bookingcontainer').style.display = 'block';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}





// Function to display rentals
async function displayRentals() {
    try {
        const rentalResponse = await fetch('http://localhost:5027/api/Manager/GetAllRentals');
        const rentals = await rentalResponse.json();
          console.log(rentals);

        const customerResponse = await fetch('http://localhost:5027/api/Customer/GetAllCustomer');
        const customers = await customerResponse.json();
        console.log(customers);

        const carResponse = await fetch('http://localhost:5027/api/Car/Allcars');
        const cars = await carResponse.json();
        console.log(cars);

        const rentalTable = document.getElementById('rental-body');
        rentalTable.innerHTML = ''; 

        rentals.forEach((rental) => {


            const customer = customers.find(c => c.id === rental.customerId) || { name: 'Unknown', nic: 'Unknown', phoneNo: 'Unknown' };
            const car = cars.find(c => c.id === rental.cCarId) || { regnumber: 'Unknown' };

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.nic}</td>
                <td>${customer.name}</td>
                <td>${customer.phoneNo}</td>
                <td>${car.regnumber}</td>
                <td>${rental.rentalDate}</td>
                <td>${rental.status}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="acceptRental('${rental.id}')">Accept</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectRental('${rental.id}')">Reject</button>
                </td>
            `;
            rentalTable.appendChild(row);
        });

        if (rentals.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7">No rentals found.</td>';
            rentalTable.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching rentals:', error);
        const rentalTable = document.getElementById('rental-body');
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">Error fetching rentals.</td>';
        rentalTable.appendChild(row);
    }
}


window.onload = displayRentals();


// Function to accept a rental request
async function acceptRental(rentalId) {
    try {
        const response = await fetch(`http://localhost:5027/api/Manager/AcceptRental/${rentalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            displayRentals(); // Refresh the rentals table
        } else {
            console.error('Error accepting rental:', await response.text());
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

// Function to reject a rental request
async function rejectRental(rentalId) {


    try {
        const response = await fetch(`http://localhost:5027/api/Manager/RejectRental/${rentalId}`, {
            method: 'DELETE', // Assuming DELETE is used for rejection
        });

        if (response.ok) {

            displayRentals(); // Refresh the rentals table
        } else {
            console.error('Error rejecting rental:', await response.text());
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

