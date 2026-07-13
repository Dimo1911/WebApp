import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Взимане на уникалното ID на хотела от URL адреса
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');

    if (!hotelId) {
        alert('Не е намерен такъв хотел!');
        window.location.href = 'index.html';
        return;
    }

    let pricePerNight = 0;

    // Елементи от страницата
    const hotelTitle = document.getElementById('hotel-title');
    const hotelDescription = document.getElementById('hotel-description');
    const hotelImage = document.getElementById('hotel-image');
    const imageLoading = document.getElementById('image-loading');
    const priceDisplay = document.getElementById('price-per-night');
    
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const calculatorSection = document.getElementById('calculator-section');
    const totalNightsDisplay = document.getElementById('total-nights');
    const totalPriceDisplay = document.getElementById('total-price');
    const bookingForm = document.getElementById('booking-form');

    try {
        // 2. Изтегляне на хотела от Supabase по ID
        const { data: hotel, error } = await supabase
            .from('hotels')
            .select('*')
            .eq('id', hotelId)
            .single();

        if (error || !hotel) throw error;

        // 3. Попълване на данните на екрана
        pricePerNight = hotel.price_per_night;
        hotelTitle.innerText = hotel.title;
        hotelDescription.innerText = hotel.description;
        priceDisplay.innerText = pricePerNight;
        
        // Показване на динамичната снимка от Storage
        hotelImage.src = hotel.image_url;
        imageLoading.style.display = 'none';
        hotelImage.style.display = 'block';

    } catch (error) {
        console.error('Грешка при зареждане на детайлите:', error.message);
        alert('Грешка при зареждане на информацията за обявата.');
        window.location.href = 'index.html';
    }

    // 4. Логика на автоматичния калкулатор за цена
    function calculateTotalPrice() {
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);

        if (checkInInput.value && checkOutInput.value && checkOutDate > checkInDate) {
            // Изчисляване на разликата в милисекунди и превръщането им в дни
            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const totalPrice = nights * pricePerNight;

            // Визуализиране на резултата
            totalNightsDisplay.innerText = nights;
            totalPriceDisplay.innerText = totalPrice;
            calculatorSection.style.display = 'block';
        } else {
            calculatorSection.style.display = 'none';
        }
    }

    checkInInput.addEventListener('change', calculateTotalPrice);
    checkOutInput.addEventListener('change', calculateTotalPrice);

    // 5. Поведение на нефункционалния бутон за резервация
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Благодарим Ви! Вашата заявка за резервация беше изпратена успешно до собственика.');
            bookingForm.reset();
            calculatorSection.style.display = 'none';
        });
    }
});
