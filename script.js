function toggleForm(category) {
    const form = document.getElementById('form-' + category);
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'flex';
    } else {
        form.style.display = 'none';
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
    console.log('Страница загружена и готова к работе!');
}); 