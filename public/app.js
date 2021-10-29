const form = document.querySelector('#loginfrom');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const regform = document.querySelector('#registerform');
const regusername = document.querySelector('#regusername');
const regemail = document.querySelector('#email');
const regpassword = document.querySelector('#regpassword');

form.addEventListener('submit', e => {
    e.preventDefault();
    const loginDetails = {
        email: username.value,
        password: password.value
    };
    console.log(loginDetails);
    fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginDetails)
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === 'success'){
           localStorage.setItem('token', response.token)
           location.href = response.redirect; 
        } else {
            alert('There is no person with that login')
        }
    })
    .catch(err => {
        console.log(err);
    })
});

regform.addEventListener('submit', e => {
   e.preventDefault();
   const registerDetails = {
       name: regusername.value,
       email: regemail.value,
       password: regpassword.value
    };

    fetch('/api/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerDetails)
    })
    .then(res => res.json())
    .then(response => {
        if(response.status === 'success'){
            localStorage.setItem('token', response.token)
            location.href = response.redirect;
    } else {
        alert('Failed to register')
    }
    })
    .catch(err =>{
        console.log(err);
    })
});