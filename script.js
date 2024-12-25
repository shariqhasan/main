// Function to fetch and display all Surahs
async function fetchSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();

        if (!data.data) throw new Error("Surahs data unavailable.");

        const surahs = data.data;
        const surahListContainer = document.getElementById('surah-list');

        surahs.forEach(surah => {
            const surahElement = document.createElement('div');
            surahElement.classList.add('surah-item');
            surahElement.textContent = `${surah.number}. ${surah.englishName}`;
            surahElement.addEventListener('click', () => displaySurahDetails(surah));
            surahListContainer.appendChild(surahElement);
        });
    } catch (error) {
        console.error("Error fetching Surahs:", error);
    }
}

// Function to display Surah details and its Ayahs
async function displaySurahDetails(surah) {
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
        <h3>${surah.name} (${surah.englishName})</h3>
        <p><strong>Revelation:</strong> ${surah.revelationType}</p>
        <p><strong>Number of Ayahs:</strong> ${surah.numberOfAyahs}</p>
    `;

    for (let ayahNumber = 1; ayahNumber <= surah.numberOfAyahs; ayahNumber++) {
        await displayVerse(surah, ayahNumber, detailsContainer);
    }
}

// Function to fetch and display an individual Ayah
async function displayVerse(surah, ayahNumber, detailsContainer) {
    try {
        const verseResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNumber}/ar.alafasy`);
        const verseData = await verseResponse.json();

        if (!verseData.data) throw new Error("Verse data unavailable.");

        const verseText = verseData.data.text;
        const audioUrl = verseData.data.audio;

        const translationResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNumber}/en.sahih`);
        const translationData = await translationResponse.json();
        const translationText = translationData.data ? translationData.data.text : "Translation not available.";

        const verseContainer = document.createElement('div');
        verseContainer.classList.add('verse-container');
        verseContainer.innerHTML = `
            <h3>Ayah ${ayahNumber}</h3>
            <div class="arabic-verse">${verseText}</div>
            <div class="translation-container">
                <button class="toggle-translation">Show Translation</button>
                <div class="english-translation" style="display: none;">${translationText}</div>
            </div>
            <div class="audio-container">
                ${audioUrl ? `<audio controls><source src="${audioUrl}" type="audio/mp3"></audio>` : 'Audio not available.'}
            </div>
        `;

        const toggleButton = verseContainer.querySelector('.toggle-translation');
        const translationDiv = verseContainer.querySelector('.english-translation');

        toggleButton.addEventListener('click', () => {
            const isHidden = translationDiv.style.display === "none";
            translationDiv.style.display = isHidden ? "block" : "none";
            toggleButton.textContent = isHidden ? "Hide Translation" : "Show Translation";
        });

        detailsContainer.appendChild(verseContainer);
    } catch (error) {
        console.error(`Error fetching Ayah ${ayahNumber}:`, error);
    }
}

// Fetch Surahs on page load
fetchSurahs();
