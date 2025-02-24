// Autenticar al administrador
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Iniciar sesión con Firebase Authentication
    auth.signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            document.getElementById('login').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            loadReservations();
        })
        .catch((error) => {
            alert("Usuario o contraseña incorrectos.");
            console.error("Error de autenticación: ", error);
        });
});

// Cargar reservas desde Firestore
function loadReservations() {
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = '<h3>Reservas Actuales</h3>';

    db.collection('reservations').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                reservationsList.innerHTML += '<p>No hay reservas actualmente.</p>';
            } else {
                querySnapshot.forEach((doc) => {
                    const res = doc.data();
                    reservationsList.innerHTML += `
                        <div class="reservation-item">
                            <p><strong>Nombre:</strong> ${res.name}</p>
                            <p><strong>Email:</strong> ${res.email}</p>
                            <p><strong>Fecha:</strong> ${res.date}</p>
                            <p><strong>Servicio:</strong> ${res.service}</p>
                            <button onclick="deleteReservation('${doc.id}')">Eliminar</button>
                        </div>
                    `;
                });
            }
        })
        .catch((error) => {
            console.error("Error al obtener reservas: ", error);
        });
}

// Eliminar reserva
function deleteReservation(id) {
    db.collection('reservations').doc(id).delete()
        .then(() => {
            alert("Reserva eliminada con éxito.");
            loadReservations();
        })
        .catch((error) => {
            console.error("Error al eliminar la reserva: ", error);
        });
}