function toggleForm(category) {
    const form = document.getElementById('form-' + category);
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'flex';
    } else {
        form.style.display = 'none';
    }
}

function addProduct(event, category) {
    event.preventDefault();
    const form = document.getElementById('form-' + category);
    const list = document.getElementById('list-' + category);
    const name = form.elements['name'].value.trim();
    const expiry = form.elements['expiry'].value.trim();
    const desc = form.elements['desc'].value.trim();
    if (!name) return;
    let text = name;
    if (expiry) text += ' (Срок: ' + expiry + ')';
    if (desc) text += ' — ' + desc;
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
    form.reset();
    form.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена и готова к работе!');
}); 