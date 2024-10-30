document.addEventListener('DOMContentLoaded', async function () {
    const Container = document.getElementById("Login-Container");
    const registerbtn = document.getElementById("register");
    const loginbtn = document.getElementById("login");

    let users = [];
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:5027/api/Customer/GetAllCustomer');
            users = await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Toggle to sign-up form
    registerbtn.addEventListener('click', () => {
        Container.classList.add("active");
    });

    // Toggle to sign-in form
    loginbtn.addEventListener('click', () => {
        Container.classList.remove("active");
    });
    await Promise.all([fetchUsers()]);

    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        if (currentUser === 'users') {
            window.location.href = '../User/User.html';
        }
    }
    const loginForm = document.getElementById('loginForm');


    if (loginForm) {
        loginForm.addEventListener('submit',async function (e) {
            e.preventDefault();
            const NICNumber = document.getElementById('NICNumber').value;
            const password = document.getElementById('Password').value;
            console.log(users);

            const user = users.find(u => u.nic == NICNumber && u.password == password);
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = '../User/User.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

        const registerForm = document.getElementById('userCreationForm');
    
    
            // Register form submission
            if (registerForm) {
                registerForm.addEventListener('submit',async function (e) {
                    e.preventDefault();
                    const username = document.getElementById('createFullName').value;
                    const phoneNo = document.getElementById('phoneNo').value;
                    const nic = document.getElementById('createNIC').value;
                    const licence = document.getElementById('createLicense').value;
                    const password = document.getElementById('createPassword').value;
                    const Email = document.getElementById('createEmail').value;
        
                    const userData = {
                        name: username,
                        phoneNo: phoneNo,
                        nic: nic,
                        licence: licence,
                        password: password,
                        email: Email
                    };
                    if (users.some(u => u.nic === nic)) {
                        alert('nic already exists');
                        return;
                    }
        
                    try {
                        // Send POST request to register customer
                        const response = await fetch('http://localhost:5027/api/Customer/Add_customer', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(userData)
                        });
        
                        if (response.ok) {
                            // If registration is successful, fetch users again and reset the form
                            await fetchUsers();
                            alert('Registration successful. Please login.');
                            registerForm.reset();
                        } else {
                            const errorMessage = await response.json();
                            alert(`Registration failed: ${errorMessage.message}`);
                        }
                    } catch (error) {
                        console.error('Error registering user:', error);
                        alert('Error occurred during registration');
                    }
                });
            }
        
});
