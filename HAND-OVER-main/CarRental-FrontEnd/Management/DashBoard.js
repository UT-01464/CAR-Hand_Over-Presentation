function dashboardshow() {
    document.getElementById('dashboardcontainer').style.display = 'block';
    document.getElementById('bookingcontainer').style.display = 'none';
    document.getElementById('customercontainer').style.display = 'none';
    document.getElementById('overduecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#deviceTable tbody');
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.closeBtn');
    const carForm = document.getElementById('carForm');
    let editingRow = null;


    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        carForm.reset();
        editingRow = null;
    }


    async function loadCars() {
        try {
            const response = await fetch(`http://localhost:5027/api/Car/Allcars`);
            const cars = await response.json();
            cars.forEach(carData => createRow(carData));
        } catch (error) {
            console.error('Error loading cars:', error);
        }
    }


    function createRow(carData) {
        console.log(carData);

        const newRow = document.createElement('tr');
        const imageUrls = carData.imageUrl.split(',');
        let fullUrl = '';
        imageUrls.forEach(url => {
            fullUrl += `http://localhost:5027${url}`.trim();
            // console.log(fullUrl);
        });
        newRow.innerHTML = `
            <td>${carData.regnumber}</td>
            <td>${carData.model}</td>
            <td>${carData.brand}</td>
            <td>${carData.isAvailable}</td>
            <td><img src="${fullUrl}" alt="${carData.title} Image" style="width: 100px; height: auto;"></td>
            <td> <button class="deleteBtn">Delete</button>
           </td>
           
        `;

        newRow.dataset.id = carData.id;
        tableBody.appendChild(newRow);
        addEventListeners(newRow);
    }


    async function addRow(event) {
        event.preventDefault();

        const carData = {
            brand: document.getElementById('brand').value.trim(),
            modelName: document.getElementById('modelName').value.trim(),
            carRegNo: document.getElementById('carRegNo').value.trim(),
            description: document.getElementById('description').value.trim(),
            title: document.getElementById('title').value.trim()
        };

        const imageInput = document.getElementById('carImage');
        const imageFile = imageInput.files[0];
        // console.log(imageFile);

        const formData = new FormData();
        formData.append('title', carData.title);
        formData.append('regnumber', carData.carRegNo);
        formData.append('brand', carData.brand);
        formData.append('description', carData.description);
        formData.append('model', carData.modelName);


        if (imageFile) {
            formData.append('imagefile', imageFile);
        }
        console.log(formData.brand);

        await createCar(formData);


        closeModal();
    }


    async function createCar(formData) {
        try {
            const response = await fetch(`http://localhost:5027/api/Car/Addcar`, {
                method: 'POST',
                body: formData,
            });

            // Check if the response status is not OK (2xx)
            if (!response.ok) {
                const errorText = await response.text(); // Read response as text
                throw new Error(`Failed to create car: ${errorText}`);
            }

            const newCar = await response.json(); // Only try to parse as JSON if the response was OK
            createRow(newCar);
        } catch (error) {
            console.error('Error creating car:', error.message);
        }
    }



    async function updateCar(carData) {
        try {
            const response = await fetch(`http://localhost:5027/api/Car/${editingRow.dataset.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
            const updatedCar = await response.json();

            editingRow.cells[0].textContent = updatedCar.carRegNo;
            editingRow.cells[1].textContent = updatedCar.modelName;
            editingRow.cells[2].textContent = updatedCar.brand;
            editingRow.cells[3].textContent = updatedCar.availability;

            editingRow.dataset.year = updatedCar.year;
            editingRow.dataset.transmission = updatedCar.transmission;
            editingRow.dataset.fuel = updatedCar.fuel;
            editingRow.dataset.noOfPeople = updatedCar.noOfPeople;
            editingRow.dataset.price = updatedCar.price;
            editingRow.dataset.image = updatedCar.image;
        } catch (error) {
            console.error('Error updating car:', error);
        }
    }

    async function deleteCar(id) {
        try {
            await fetch(`http://localhost:5027/api/Car/DeletecarId/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    }

    function editRow(row) {
        editingRow = row;

        document.getElementById('brand').value = row.cells[0].textContent;
        document.getElementById('modelName').value = row.cells[1].textContent;
        document.getElementById('carRegNo').value = row.cells[2].textContent;
        document.getElementById('availability').value = row.cells[3].textContent;
        document.getElementById('year').value = row.dataset.year;
        document.getElementById('transmission').value = row.dataset.transmission;
        document.getElementById('fuel').value = row.dataset.fuel;
        document.getElementById('noOfPeople').value = row.dataset.noOfPeople;
        document.getElementById('price').value = row.dataset.price;

        openModal();
    }


    function deleteRow(row) {
        const id = row.dataset.id;
        deleteCar(id).then(() => {
            tableBody.removeChild(row);
        });
    }

    function editRow(row) {
        const id = row.dataset.id;
        updateCar(id).then(() => {
            tableBody.replaceChild(row);
        });
    }




    function addEventListeners(row) {
        const editBtn = row.querySelector('.editBtn');
        const deleteBtn = row.querySelector('.deleteBtn');
        
        editBtn.addEventListener('click', function () {
            editRow(row);
        });

        deleteBtn.addEventListener('click', function () {
            deleteRow(row);
        });
    }


    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    carForm.addEventListener('submit', addRow);
    loadCars();
});

