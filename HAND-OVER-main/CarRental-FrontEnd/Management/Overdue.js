function overdueShow() {
    document.getElementById('overduecontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}
async function checkOverdueRentals() {
    try {
        const customerResponse = await fetch('http://localhost:5027/api/Customer/GetAllCustomer');
        const customers = await customerResponse.json();
        console.log(customers);

        const managerResponse = await fetch('http://localhost:5027/api/Manager/CheckAndUpdateOverdueRentals');
        const updatedCustomers = await managerResponse.json();

        const rentalResponse = await fetch('http://localhost:5027/api/Manager/GetAllRentals');
        const rentals = await rentalResponse.json();

        const now = new Date();
        const overdueList = document.getElementById('overdue-list');
        overdueList.innerHTML = '';

        rentals.forEach(customer => {
               forEach(rental => {
                const returnDate = new Date(rental.returnDate);
                const overdueTime = now - returnDate;
                const overdueDays = overdueTime / (1000 * 60 * 60 * 24); 
                if (!rental.status== "return"&& rental.overdue == 1) { // Check if overdue by 1 or more days
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${customer.nic}</td>
                        <td>${customer.name}</td>
                        <td>${new Date(rental.rentaldate).toLocaleString()}</td>
                        <td>${returnDate.toLocaleString()}</td>
                        <td>${overdueDays.toFixed(2)} days</td>
                        <td>${(overdueDays * 24).toFixed(2)} hours</td>
                    `;
                    overdueList.appendChild(row);
                }
            });
        });

        if (overdueList.innerHTML === '') {
            overdueList.innerHTML = '<tr><td colspan="6">No overdue rentals found</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


window.onload = checkOverdueRentals();
