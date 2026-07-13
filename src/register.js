import { supabase } from './supabase.js';

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Паролите не съвпадат!');
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;

            alert('Регистрацията е успешна! Можете да влезете в профила си.');
            window.location.href = 'login.html';

        } catch (error) {
            console.error('Грешка при регистрация:', error.message);
            alert('Грешка при регистрация: ' + error.message);
        }
    });
}
