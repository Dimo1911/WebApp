// Импортираме Bootstrap стиловете за консистентен дизайн във Vite
import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './supabase.js';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Реален опит за вход в Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // При успешен вход: Пренасочваме потребителя към Админ панела
            alert('Успешен вход в системата!');
            window.location.href = 'admin.html';

        } catch (error) {
            console.error('Грешка при вход:', error.message);
            alert('Невалиден имейл или парола: ' + error.message);
        }
    });
}
