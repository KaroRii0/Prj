function toggleForm(category) {
    const form = document.getElementById('form-' + category);
    // Закрываем все формы
    document.querySelectorAll('.add-form').forEach(f => {
        if (f !== form) f.style.display = 'none';
    });
    // Переключаем текущую форму
    if (form.style.display === 'flex') {
        form.style.display = 'none';
    } else {
        form.style.display = 'flex';
    }
}

// --- Холодильники ---
function getFridges() {
    return JSON.parse(localStorage.getItem('fridges') || '["Мой холодильник"]');
}
function setFridges(arr) {
    localStorage.setItem('fridges', JSON.stringify(arr));
}
function getActiveFridge() {
    return localStorage.getItem('activeFridge') || getFridges()[0] || 'Мой холодильник';
}
function setActiveFridge(name) {
    localStorage.setItem('activeFridge', name);
}
let editingFridge = null;
function renderFridgeList() {
    const ul = document.getElementById('fridge-list');
    const fridges = getFridges();
    const active = getActiveFridge();
    ul.innerHTML = '';
    fridges.forEach(name => {
        const li = document.createElement('li');
        if (editingFridge === name) {
            // Режим редактирования
            const input = document.createElement('input');
            input.type = 'text';
            input.value = name;
            input.className = 'fridge-edit-input';
            input.autofocus = true;
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Сохранить';
            saveBtn.className = 'fridge-edit-btn';
            saveBtn.onclick = () => {
                const newName = input.value.trim();
                if (!newName || newName === name) { editingFridge = null; renderFridgeList(); return; }
                let fridgesArr = getFridges();
                if (fridgesArr.includes(newName)) {
                    alert('Холодильник с таким названием уже есть!');
                    return;
                }
                // Переименовываем в localStorage
                const all = JSON.parse(localStorage.getItem('fridgeProductsAll') || '{}');
                all[newName] = all[name] || {};
                delete all[name];
                localStorage.setItem('fridgeProductsAll', JSON.stringify(all));
                fridgesArr = fridgesArr.map(f => f === name ? newName : f);
                setFridges(fridgesArr);
                if (active === name) setActiveFridge(newName);
                editingFridge = null;
                renderFridgeList();
                renderAllCategories();
            };
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Отмена';
            cancelBtn.className = 'fridge-edit-btn';
            cancelBtn.onclick = () => { editingFridge = null; renderFridgeList(); };
            li.appendChild(input);
            li.appendChild(saveBtn);
            li.appendChild(cancelBtn);
        } else {
            const span = document.createElement('span');
            span.textContent = name;
            span.style.cursor = 'pointer';
            if (name === active) {
                span.style.fontWeight = 'bold';
                span.style.color = '#3366cc';
            }
            span.onclick = () => {
                setActiveFridge(name);
                renderFridgeList();
                renderAllCategories();
                closeFridgeDropdown();
            };
            li.appendChild(span);
            // Кнопки справа
            const actions = document.createElement('div');
            actions.className = 'fridge-actions';
            // Кнопка редактирования
            const editBtn = document.createElement('button');
            editBtn.className = 'fridge-edit-btn';
            editBtn.title = 'Переименовать холодильник';
            editBtn.innerHTML = '✏️';
            editBtn.onclick = (e) => {
                e.stopPropagation();
                editingFridge = name;
                renderFridgeList();
            };
            actions.appendChild(editBtn);
            // Кнопка удаления
            if (fridges.length > 1) {
                const delBtn = document.createElement('button');
                delBtn.className = 'fridge-delete-btn';
                delBtn.title = 'Удалить холодильник';
                delBtn.innerHTML = '✖';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    showConfirmModal('Вы уверены, что хотите удалить этот холодильник?', function() {
                        deleteFridge(name);
                    });
                };
                actions.appendChild(delBtn);
            }
            li.appendChild(actions);
        }
        ul.appendChild(li);
    });
    updateCurrentFridgeName();
}
function deleteFridge(name) {
    let fridges = getFridges();
    fridges = fridges.filter(f => f !== name);
    setFridges(fridges);
    // Удаляем продукты этого холодильника
    const all = JSON.parse(localStorage.getItem('fridgeProductsAll') || '{}');
    delete all[name];
    localStorage.setItem('fridgeProductsAll', JSON.stringify(all));
    // Переключаемся на первый оставшийся
    setActiveFridge(fridges[0]);
    renderFridgeList();
    renderAllCategories();
}
function closeFridgeDropdown() {
    document.getElementById('fridge-list-dropdown').style.display = 'none';
}
function openFridgeDropdown() {
    document.getElementById('fridge-list-dropdown').style.display = 'flex';
    renderFridgeList();
}
// --- Продукты с учётом холодильника ---
function getStorage() {
    const all = JSON.parse(localStorage.getItem('fridgeProductsAll') || '{}');
    const fridge = getActiveFridge();
    return all[fridge] || {};
}
function setStorage(data) {
    const all = JSON.parse(localStorage.getItem('fridgeProductsAll') || '{}');
    const fridge = getActiveFridge();
    all[fridge] = data;
    localStorage.setItem('fridgeProductsAll', JSON.stringify(all));
}

function renderCategory(category) {
    const list = document.getElementById('list-' + category);
    if (!list) return;
    list.innerHTML = '';
    const data = getStorage();
    const items = data[category] || [];
    items.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'product-item';
        const textSpan = document.createElement('span');
        textSpan.className = 'product-text';
        textSpan.textContent = item;
        // Кнопка удаления
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.title = 'Удалить';
        delBtn.innerHTML = '✖';
        delBtn.onclick = function() { deleteProduct(category, idx); };
        li.appendChild(textSpan);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

function deleteProduct(category, idx) {
    const data = getStorage();
    if (!data[category]) return;
    data[category].splice(idx, 1);
    setStorage(data);
    renderCategory(category);
}

function addProduct(event, category) {
    event.preventDefault();
    const form = document.getElementById('form-' + category);
    const name = form.elements['name'].value.trim();
    const expiry = form.elements['expiry'].value.trim();
    const desc = form.elements['desc'].value.trim();
    if (!name) return;
    let text = name;
    if (expiry) text += ' (Срок: ' + expiry + ')';
    if (desc) text += ' — ' + desc;
    // Сохраняем в localStorage
    const data = getStorage();
    if (!data[category]) data[category] = [];
    data[category].push(text);
    setStorage(data);
    renderCategory(category);
    form.reset();
    form.style.display = 'none';
}

function renderAllCategories() {
    const categories = [
        'dairy','vegfruit','meat','fish','sausage','cheese','eggs','sauces','semis','leftovers','frozen','butter','yogurt','greens','other'
    ];
    categories.forEach(renderCategory);
}

let confirmCallback = null;
function showConfirmModal(message, onYes) {
    const modal = document.getElementById('modal-confirm');
    modal.querySelector('.modal-message').textContent = message;
    modal.style.display = 'flex';
    confirmCallback = onYes;
}

function updateCurrentFridgeName() {
    const el = document.getElementById('current-fridge-name');
    if (el) el.textContent = 'Текущий холодильник: ' + getActiveFridge();
}

document.addEventListener('DOMContentLoaded', function() {
    renderAllCategories();
    // Тема
    const themeBtn = document.getElementById('theme-toggle');
    function setTheme(mode) {
        if (mode === 'dark') {
            document.body.classList.add('dark-theme');
            themeBtn.textContent = '☀️ Светлая тема';
        } else {
            document.body.classList.remove('dark-theme');
            themeBtn.textContent = '🌙 Тёмная тема';
        }
    }
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(theme);
    themeBtn.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-theme');
        const newTheme = isDark ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    // Холодильники
    const fridgeToggle = document.getElementById('fridge-list-toggle');
    const fridgeDropdown = document.getElementById('fridge-list-dropdown');
    fridgeToggle.onclick = function() {
        if (fridgeDropdown.style.display === 'none' || fridgeDropdown.style.display === '') {
            openFridgeDropdown();
        } else {
            closeFridgeDropdown();
        }
    };
    document.addEventListener('click', function(e) {
        if (!fridgeDropdown.contains(e.target) && e.target !== fridgeToggle) {
            closeFridgeDropdown();
        }
    });
    document.getElementById('fridge-add-form').onsubmit = function(e) {
        e.preventDefault();
        const input = document.getElementById('fridge-add-input');
        const name = input.value.trim();
        if (!name) return;
        let fridges = getFridges();
        if (fridges.includes(name)) {
            alert('Холодильник с таким названием уже есть!');
            return;
        }
        fridges.push(name);
        setFridges(fridges);
        setActiveFridge(name);
        renderFridgeList();
        renderAllCategories();
        input.value = '';
        closeFridgeDropdown();
    };
    renderFridgeList();
    console.log('Страница загружена и готова к работе!');
    document.getElementById('modal-yes').onclick = function() {
        document.getElementById('modal-confirm').style.display = 'none';
        if (typeof confirmCallback === 'function') confirmCallback();
    };
    document.getElementById('modal-no').onclick = function() {
        document.getElementById('modal-confirm').style.display = 'none';
        confirmCallback = null;
    };
    updateCurrentFridgeName();
}); 