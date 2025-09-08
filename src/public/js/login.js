async function login() {
    const jwt = require('jsonwebtoken');
    const formData = new FormData();
    formData.append('usuario', document.getElementById('document-number'));
    formData.append('usuario', document.getElementById('password'));

    try {
        await fetch('auth/login', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(data => {
            if (data.status == 'success') {
                alert(data.message);
                localStorage.setItem();
                localStorage.setItem();
                window.location.href = '/home'
            }
        });
    } catch (err) {
        console.log('Error en la conexion o JSON invalido: ', err);
        alert('Error en la conexion. Por favor, intenta de nuevo');
    }
}

function formLoginSubmission() {
    const form = document.getElementById('formContent');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await login();
        });
    }
}

formLoginSubmission();

