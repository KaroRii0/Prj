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

function getStorage() {
    return JSON.parse(localStorage.getItem('fridgeProducts') || '{}');
}

function setStorage(data) {
    localStorage.setItem('fridgeProducts', JSON.stringify(data));
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
    // Проверяем localStorage или системную тему
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
    console.log('Страница загружена и готова к работе!');
}); 