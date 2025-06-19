function toggleForm(category) {
    const form = document.getElementById('form-' + category);
    // Собираем все открытые формы
    const openForms = Array.from(document.querySelectorAll('.add-form'))
        .filter(f => f.style.display === 'flex');
    // Если форма уже открыта — просто закрываем
    if (form.style.display === 'flex') {
        form.style.display = 'none';
        return;
    }
    // Если открыто 3 формы, закрываем самую первую
    if (openForms.length >= 3) {
        openForms[0].style.display = 'none';
    }
    // Открываем нужную форму
    form.style.display = 'flex';
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
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
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