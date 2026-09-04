%%writefile script.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize active view
    switchView('client');

    // Initial setup for the date input to prevent past dates
    const inputFecha = document.getElementById('inputFecha');
    const today = new Date();
    // Set initial date if it's in the past (example: 2026-08-24 is far in the future)
    // For current date logic, uncomment and modify below if needed
    // const year = today.getFullYear();
    // const month = String(today.getMonth() + 1).padStart(2, '0');
    // const day = String(today.getDate()).padStart(2, '0');
    // if (inputFecha.value < `${year}-${month}-${day}`) {
    //     inputFecha.value = `${year}-${month}-${day}`;
    // }

    // Update modal date on date input change
    inputFecha.addEventListener('change', updateModalContent);

    // Update modal content initially
    updateModalContent();
});

function switchView(view) {
    document.getElementById('clientView').classList.remove('active');
    document.getElementById('dashView').classList.remove('active');
    document.getElementById(view + 'View').classList.add('active');

    document.getElementById('btnViewClient').classList.remove('btn-primary', 'btn-outline-warning');
    document.getElementById('btnViewDash').classList.remove('btn-primary', 'btn-outline-warning');

    if (view === 'client') {
        document.getElementById('btnViewClient').classList.add('btn-primary');
        document.getElementById('btnViewDash').classList.add('btn-outline-warning');
    } else {
        document.getElementById('btnViewDash').classList.add('btn-primary');
        document.getElementById('btnViewClient').classList.add('btn-outline-warning');
    }
}

let currentPeople = 4;
function changePeople(delta) {
    currentPeople += delta;
    if (currentPeople < 1) currentPeople = 1; // Minimum 1 person
    document.getElementById('numPersonas').innerText = `${currentPeople} Personas`;
    updateModalContent();
}

function selectHour(button) {
    const hourButtons = document.querySelectorAll('.btn-hour');
    hourButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    updateModalContent();
}

function selectZone(event, zoneName) {
    event.preventDefault();
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.classList.add('text-secondary');
    });
    event.target.classList.add('active');
    event.target.classList.remove('text-secondary');

    document.getElementById('zonaTitle').innerText = zoneName;
    document.getElementById('zonaSubtitle').innerText = 'Haz clic en una mesa verde para ver la ventana de reserva';
    // You might want to update the displayed tables based on the selected zone here
}

let selectedTable = { id: '01', capacity: 4 }; // Default selected table
function openModal(tableId, tableCapacity) {
    selectedTable = { id: tableId, capacity: tableCapacity };
    document.getElementById('modalOverlay').classList.add('active');
    updateModalContent();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function updateModalContent() {
    const inputFecha = document.getElementById('inputFecha').value;
    const activeHourButton = document.querySelector('.btn-hour.active');
    const selectedHour = activeHourButton ? activeHourButton.innerText : 'N/A';
    const numPersonas = currentPeople;

    // Format date for modal
    const dateParts = inputFecha.split('-');
    const year = dateParts[0];
    const month = new Date(year, dateParts[1] - 1, 1).toLocaleString('es', { month: 'long' });
    const day = dateParts[2];
    const formattedDate = `Hoy, ${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}`;

    document.getElementById('modalTableTitle').innerText = `Mesa #${selectedTable.id} — Salón Principal`;
    document.getElementById('modalFecha').innerText = formattedDate;
    document.getElementById('modalHora').innerText = selectedHour;
    document.getElementById('modalPersonas').innerText = `${numPersonas} comensales`;
    document.getElementById('modalTableNum').innerText = `#${selectedTable.id} · Cap. ${selectedTable.capacity} pers.`;

    // Update the button text for the reserve button on the side
    const reserveSideButton = document.querySelector('.btn-reserve-side');
    if (reserveSideButton) {
        reserveSideButton.onclick = () => openModal(selectedTable.id, selectedTable.capacity);
        reserveSideButton.innerHTML = `<i class="fa-solid fa-calendar-check me-2"></i> Reservar Mesa ${selectedTable.id}`;
    }
}

function confirmBooking(event) {
    event.preventDefault();
    alert('Reserva confirmada! (Lógica de envío de formulario aquí)');
    closeModal();
    // Add actual form submission logic or AJAX call here
}
