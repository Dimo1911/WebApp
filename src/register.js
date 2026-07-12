import { supabase } from './supabase.js';

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Използваме вградената функция на Supabase за създаване на потребител
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert('Грешка при регистрация: ' + error.message);
    } else {
        alert('Успешна регистрация! Проверете имейла си за потвърждение.');
        window.location.href = 'login.html'; // Връща потребителя към входа
    }
});

