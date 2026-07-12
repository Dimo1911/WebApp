document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Опит за вход с:', email);
    alert('Формата работи! Следващия път ще я свържем със Supabase.');
});
