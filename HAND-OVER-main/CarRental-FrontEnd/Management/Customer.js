function customersShow() {
    document.getElementById('customercontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';

    populateCustomerTable();
}

async function populateCustomerTable() {
    const customerBody = document.getElementById('customer-body');
    customerBody.innerHTML = '';

    try {
        // Fetch users and rentals from your API
        const [usersResponse, rentalsResponse] = await Promise.all([ 
            fetch('http://localhost:5027/api/Customer/GetAllCustomer'),  
            fetch('http://localhost:5027/api/Manager/GetAllRentals') 
        ]);

        const users = await usersResponse.json();
        const rentals = await rentalsResponse.json();

        users.forEach(user => {
            const row = document.createElement('tr');
            const customerRentals = rentals.filter(rental => rental.customerId == user.id);

            let rentalHistory = '<ul>';
            customerRentals.forEach(rental => {
                rentalHistory += `<li>Reg: ${rental.cCarId}, Date: ${rental.rentalDate}</li>`;
            });
            rentalHistory += '</ul>';

            // Make username clickable
            const usernameCell = document.createElement('td');
            usernameCell.textContent = user.name;
            usernameCell.style.cursor = 'pointer'; // Indicate it's clickable
            usernameCell.onclick = () => viewRentalHistory(user.nic);

            row.innerHTML = `
                 <td>${user.name}</td>
                <td>${user.nic}</td>
                <td>${user.licence}</td>
                <td>${user.email}</td>
                <td>${rentalHistory}</td>
            `;

            customerBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


async function viewRentalHistory(id) {
    const [rentalsResponse] = await Promise.all([ 
   
        fetch('http://localhost:5027/api/Manager/GetAllRentals') 
    ]);
    const rentals = await rentalsResponse.json();
    const userRentals = rentals.filter(rental => rental.customerId === id);

    let rentalDetails = 'Rental History:\n';
    userRentals.forEach(rental => {
        rentalDetails += `Reg: ${rental.cCarId}, Date: ${rental.rentalDate}\n`;
    });

    if (userRentals.length === 0) {
        rentalDetails = 'No rental history found for this NIC.';
    }

    alert(`Showing rental history for NIC: ${nic}\n\n${rentalDetails}`);
}
