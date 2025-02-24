document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const service = document.getElementById('service').value;

    const reservation = {
        name,
        email,
        date,
        service
    };

    // Guardar en Firestore
    db.collection('reservations').add(reservation)
        .then(() => {
            alert("Reserva realizada con éxito.");
            updateAvailability();
            this.reset();
        })
        .catch((error) => {
            console.error("Error al guardar la reserva: ", error);
        });
});

function updateAvailability() {
    const availability = document.getElementById('availability');
    availability.innerHTML = '<h3>Disponibilidad</h3>';

    // Obtener reservas desde Firestore
    db.collection('reservations').get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                availability.innerHTML += '<p>Todas las fechas están disponibles.</p>';
            } else {
                querySnapshot.forEach((doc) => {
                    const res = doc.data();
                    availability.innerHTML += `
                        <div class="reservation-item">
                            <p><strong>Fecha:</strong> ${res.date}</p>
                            <p><strong>Servicio:</strong> ${res.service}</p>
                        </div>
                    `;
                });
            }
        })
        .catch((error) => {
            console.error("Error al obtener reservas: ", error);
        });
}

// Mostrar disponibilidad al cargar la página
updateAvailability();