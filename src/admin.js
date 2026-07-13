import { supabase } from './supabase.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Автоматична защита: Проверка дали потребителят е логнат веднага при зареждане на страницата
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        // Ако няма логнат потребител, пренасочваме директно към Вход
        window.location.href = 'login.html';
    }
}
checkAuth();

const form = document.getElementById('add-hotel-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Взимане на стойностите от формата
        const title = document.getElementById('hotel-title').value;
        const description = document.getElementById('hotel-description').value;
        const price = document.getElementById('hotel-price').value;
        const imageFile = document.getElementById('hotel-image').files[0];

        // Проверка дали е избран файл
        if (!imageFile) {
            alert('Моля, изберете снимка за обявата!');
            return;
        }

        try {
            // 2. Взимане на текущия логнат потребител (за user_id)
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                alert('Трябва да сте влезли в профила си, за да публикувате обява!');
                window.location.href = 'login.html';
                return;
            }

            // 3. Качване на снимката в Storage Bucket 'hotel-images'
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`; // Уникално име на файла
            const filePath = `public/${fileName}`;

            // Пробваме първо с малки букви, които са стандарт за Supabase URL адресите
            const { data: storageData, error: storageError } = await supabase
                .storage
                .from('hotel-images')
                .upload(filePath, imageFile);

            if (storageError) {
                console.warn('Опит с малки букви не успея, пробваме с главни...');
                // Алтернативен опит с главни букви, ако първият се провали
                const { data: retryData, error: retryError } = await supabase
                    .storage
                    .from('HOTEL-IMAGES')
                    .upload(filePath, imageFile);
                
                if (retryError) throw retryError;
            }

            // 4. Взимане на публичния URL адрес на качената снимка (пробваме и двата варианта)
            let publicUrlResult;
            try {
                const { data } = supabase.storage.from('hotel-images').getPublicUrl(filePath);
                publicUrlResult = data.publicUrl;
            } catch {
                const { data } = supabase.storage.from('HOTEL-IMAGES').getPublicUrl(filePath);
                publicUrlResult = data.publicUrl;
            }

            // 5. Записване на данните в таблицата 'hotels'
            const { data, error: insertError } = await supabase
                .from('hotels')
                .insert([
                    {
                        title: title,
                        description: description,
                        price_per_night: parseFloat(price),
                        image_url: publicUrlResult,
                        user_id: user.id
                    }
                ]);

            if (insertError) throw insertError;

            // Успешно изпращане
            alert('Обявата е публикувана успешно!');
            form.reset();
            window.location.href = 'index.html'; // Връщане към началото

        } catch (error) {
            console.error('Грешка:', error.message);
            alert('Възникна грешка при създаването на обявата: ' + error.message);
        }
    });
}
