const calendarData = {
    year: 2025,
    months: [
        {name: "Janeiro", number: 1, days: 31},
        {name: "Fevereiro", number: 2, days: 28},
        {name: "Março", number: 3, days: 31},
        {name: "Abril", number: 4, days: 30},
        {name: "Maio", number: 5, days: 31},
        {name: "Junho", number: 6, days: 30},
        {name: "Julho", number: 7, days: 31},
        {name: "Agosto", number: 8, days: 31},
        {name: "Setembro", number: 9, days: 30},
        {name: "Outubro", number: 10, days: 31},
        {name: "Novembro", number: 11, days: 30},
        {name: "Dezembro", number: 12, days: 31}
    ],
    weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
};

let dateNames = JSON.parse(localStorage.getItem('dateNames')) || {};
let dateColors = JSON.parse(localStorage.getItem('dateColors')) || {};
let currentSelectedDate = null;

// Elementos
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const nameInput = document.getElementById('name-input');
const colorInput = document.getElementById('color-input');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const btnClear = document.getElementById('btn-clear');

// Função para renderizar o calendário
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';
    calendarData.months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-container';

        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.innerText = month.name;
        monthDiv.appendChild(monthTitle);

        // Dias da semana
        const weekRow = document.createElement('div');
        weekRow.className = 'week-row';
        calendarData.weekdays.forEach(weekday => {
            const weekDayDiv = document.createElement('div');
            weekDayDiv.className = 'weekday';
            weekDayDiv.innerText = weekday;
            weekRow.appendChild(weekDayDiv);
        });
        monthDiv.appendChild(weekRow);

        // Dias do mês
        const daysRow = document.createElement('div');
        daysRow.className = 'days-row';
        const firstDay = new Date(calendarData.year, month.number - 1, 1).getDay();
        for (let i = 0; i < firstDay; i++) {
            const blankDiv = document.createElement('div');
            daysRow.appendChild(blankDiv);
        }
        for (let day = 1; day <= month.days; day++) {
            const dateStr = formatDate(calendarData.year, month.number, day);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.dataset.date = dateStr;
            dayDiv.innerText = day;
            dayDiv.onclick = () => openModal(dateStr);

            if (dateNames[dateStr]) {
                dayDiv.setAttribute('data-has-name', 'true');
                dayDiv.style.backgroundColor = dateColors[dateStr] || "#26C485";
                dayDiv.style.color = "#fff";
                const nameSpan = document.createElement('span');
                nameSpan.className = 'day-name';
                nameSpan.innerText = dateNames[dateStr];
                dayDiv.appendChild(nameSpan);
            } else {
                dayDiv.removeAttribute('data-has-name');
                dayDiv.style.backgroundColor = "#fff";
                dayDiv.style.color = "#21808d";
            }
            daysRow.appendChild(dayDiv);
        }
        monthDiv.appendChild(daysRow);
        grid.appendChild(monthDiv);
    });
}

function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function openModal(dateStr) {
    currentSelectedDate = dateStr;
    modal.classList.remove('hidden');
    nameInput.value = dateNames[dateStr] || '';
    colorInput.value = dateColors[dateStr] || "#26C485";
    nameInput.focus();
}

function closeModal() {
    modal.classList.add('hidden');
    currentSelectedDate = null;
}

function persistData() {
    localStorage.setItem('dateNames', JSON.stringify(dateNames));
    localStorage.setItem('dateColors', JSON.stringify(dateColors));
}

modalClose.onclick = closeModal;
modalOverlay.onclick = closeModal;
btnCancel.onclick = closeModal;

btnSave.onclick = () => {
    if (!currentSelectedDate) return;
    const nome = nameInput.value.trim();
    // pega SEMPRE a cor atual do input de cor
    const cor = colorInput.value && colorInput.value !== "#fff" ? colorInput.value : "#26C485";
    if (nome !== "") {
        dateNames[currentSelectedDate] = nome;
        dateColors[currentSelectedDate] = cor;
    } else {
        delete dateNames[currentSelectedDate];
        delete dateColors[currentSelectedDate];
    }
    persistData();
    closeModal();
    renderCalendar();
};

btnClear.onclick = () => {
    if (!currentSelectedDate) return;
    delete dateNames[currentSelectedDate];
    delete dateColors[currentSelectedDate];
    persistData();
    closeModal();
    renderCalendar();
};

window.onload = renderCalendar;
