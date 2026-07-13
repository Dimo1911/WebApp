// Импортираме Supabase клиента
import { supabase } from './supabase.js';

// Изчакваме HTML документът да се зареди напълно
document.addEventListener('DOMContentLoaded', async () => {
    const hotelsGrid = document.getElementById('hotels-grid');

    if (!hotelsGrid) return;

    try {
        // 1. Изтегляне на всички обяви от таблицата 'hotels'
        const { data: hotels, error } = await supabase
            .from('hotels')
            .select('*')
            .order('created_at', { ascending: false }); // Най-новите обяви излизат първи

        if (error) throw error;

        // 2. Проверка дали има съществуващи обяви
        if (!hotels || hotels.length === 0) {
            hotelsGrid.innerHTML = `
                <div class="col-12 text-center my-5">
                    <p class="text-muted fs-5">В момента няма активни обяви за престой. Бъдете първите, които ще публикуват!</p>
                </div>
            `;
            return;
        }

        // 3. Изчистване на статичната тестова карта от HTML шаблона
        hotelsGrid.innerHTML = '';

        // 4. Генериране на Bootstrap карта за всеки хотел от базата данни
        hotelsGrid.innerHTML = hotels.map(hotel => `
            <div class="col-md-4">
                <div class="card hotel-card shadow-sm h-100 border-0 rounded-3">
                    <img src="${hotel.image_url}" class="card-img-top rounded-top-3" alt="${hotel.title}" style="height: 220px; object-fit: cover;">
                    <div class="card-body p-4">
                        <h5 class="card-title fw-bold text-dark mb-2">${hotel.title}</h5>
                        <p class="card-text text-muted small mb-4">${hotel.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="fw-bold text-primary fs-5">
                                ${hotel.price_per_night} BGN <span class="fs-6 text-muted fw-normal">/ нощ</span>
                            </span>
                            <a href="details.html?id=${hotel.id}" class="btn btn-sm btn-outline-primary px-3 rounded-pill fw-bold">Преглед</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Грешка при зареждане на хотелите:', error.message);
        hotelsGrid.innerHTML = `
            <div class="col-12 text-center my-5 text-danger">
                Възникна грешка при зареждането на обявите. Моля, опитайте отново по-късно.
            </div>
        `;
    }
});
