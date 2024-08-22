

// Fungsi untuk menampilkan notifikasi
function showNotification(message, isOnline) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notification.style.backgroundColor = isOnline ? '#4CAF50' : '#F44336';
    notificationText.textContent = message;
    
    notification.classList.add('show');
    notification.style.display = 'block'; // Ensure the notification is displayed
    
    setTimeout(() => {
        notification.classList.remove('show');
        notification.style.display = 'none'; // Remove from layout after hiding
    }, 4000);
}

// Fungsi untuk menghasilkan pesan lucu
function getFunnyMessage(isOnline) {
    const onlineMessages = [
        "Wah, sinyal kuat! Kamu siap menjelajah dunia maya!",
        "Internet kembali! Selamat tinggal dunia nyata!",
        "Anda telah terhubung kembali ke matrix. Selamat berselancar!",
        "Internet: ON. Produktivitas: OFF. Mari procrastinate!"
    ];
    
    const offlineMessages = [
        "Oops! Internet menghilang seperti kaus kaki di mesin cuci.",
        "Houston, we have a problem. Internet telah meninggalkan gedung.",
        "Internet sedang istirahat sejenak. Mungkin sedang minum kopi?",
        "Koneksi putus! Waktunya berinteraksi dengan manusia sungguhan."
    ];
    
    const messages = isOnline ? onlineMessages : offlineMessages;
    return messages[Math.floor(Math.random() * messages.length)];
}

// Fungsi untuk memeriksa status koneksi
function checkOnlineStatus() {
    if (navigator.onLine) {
        showNotification(getFunnyMessage(true), true);
    } else {
        showNotification(getFunnyMessage(false), false);
    }
}

// Event listener untuk perubahan status online/offline
window.addEventListener('online', () => checkOnlineStatus());
window.addEventListener('offline', () => checkOnlineStatus());

// Periksa status saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => checkOnlineStatus());


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navbarLinks = document.getElementById('navbarLinks');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const pasteBtn = document.getElementById('pasteBtn');
    const urlInput = document.getElementById('urlInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const languageSelect = document.getElementById('languageSelect');

    // Menu Toggle
    menuToggle.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Paste Button
    pasteBtn.addEventListener('click', () => {
        navigator.clipboard.readText().then(text => {
            urlInput.value = text;
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    });

    // Download Button
    downloadBtn.addEventListener('click', fetchData);

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                if (navbarLinks.classList.contains('active')) {
                    navbarLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Language Change
    let currentLang = 'id';

    function changeLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        document.documentElement.lang = lang;
    }

    languageSelect.addEventListener('change', function() {
        changeLanguage(this.value);
    });

    // Scroll Animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top <= windowHeight * 0.8) {
                el.classList.add('show');
            } else {
                el.classList.remove('show');
            }
        });
    }

    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Initial check

    // Initialize default language
    changeLanguage('id');
});



// Fetch data function
async function fetchData() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const content = document.getElementById('content');
    const spinner = document.getElementById('spinner');

    content.innerHTML = '';
    spinner.style.display = 'block';

    if (!urlInput) {
        content.innerHTML = '<p class="text-danger">Silakan masukkan URL yang valid.</p>';
        spinner.style.display = 'none';
        return;
    }

    let apiUrl;
    if (urlInput.includes('tiktok.com')) {
        apiUrl = `https://api.tiklydown.eu.org/api/download/v5?url=${encodeURIComponent(urlInput)}`;
    } else if (urlInput.includes('spotify.com')) {
        apiUrl = `https://itzpire.com/download/spotify?url=${encodeURIComponent(urlInput)}`;
    } else if (urlInput.includes('instagram.com')) {
        if (urlInput.includes('/reel/') || urlInput.includes('/p/')) {
            apiUrl = `https://api.nyxs.pw/dl/ig?url=${encodeURIComponent(urlInput)}`;
        } else {
            content.innerHTML = '<p class="text-red-500 font-semibold">Invalid Instagram URL. Please enter a valid Instagram reel or post URL.</p>';
            spinner.style.display = 'none';
            return;
        }
    } else if (urlInput.includes('facebook.com')) {
        apiUrl = `https://apis.ryzendesu.vip/api/downloader/fbdl?url=${encodeURIComponent(urlInput)}`;
    } else if (urlInput.includes('twitter.com') || urlInput.includes('x.com')) {
        apiUrl = `https://itzpire.com/download/twitter?url=${encodeURIComponent(urlInput)}`;
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Invalid URL. Please enter a TikTok, Spotify, Instagram, Facebook, or Twitter URL.</p>';
        spinner.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Render content based on the platform
        if (urlInput.includes('tiktok.com')) {
            renderTikTokContent(data);
        } else if (urlInput.includes('spotify.com')) {
            renderSpotifyContent(data);
        } else if (urlInput.includes('instagram.com')) {
            renderInstagramContent(data, urlInput);
        } else if (urlInput.includes('facebook.com')) {
            renderFacebookContent(data, urlInput);
        } else if (urlInput.includes('twitter.com') || urlInput.includes('x.com')) {
            renderTwitterContent(data);
        }
    } catch (error) {
        console.error(error);
        content.innerHTML = '<p class="text-red-500 font-semibold">An error occurred while fetching data.</p>';
    } finally {
        spinner.style.display = 'none';
    }
}

function renderTikTokContent(data) {
    const content = document.getElementById('content');
    if (data.result.id) {
        const { title, play, hdplay, music, size, author, images, digg_count, comment_count, share_count, cover, hd_size } = data.result;
        content.innerHTML = `
            <div class="card mb-4">
                <div class="card-custom">
                    <img src="${author.avatar}" alt="Author Avatar" class="small-avatar rounded-circle mr-3 responsive-img">
                    <span class="font-bold">${author.nickname} (@${author.unique_id})</span>
                </div>
                <div class="mb-4">
                    <p class="font-semibold text-lg">${title}</p>
                </div>
                <div id="media-content" class="mb-4">
                    <img src="${cover}" alt="Video Thumbnail" class="responsive-img rounded-lg mb-2">
                </div>
                <div class="flex justify-between text-center mb-4">
                    <div>
                        <span>👍</span><br>
                        ${digg_count} Likes
                    </div>
                    <div>
                        <span>💬</span><br>
                        ${comment_count} Comments
                    </div>
                    <div>
                        <span>🔗</span><br>
                        ${share_count} Shares
                    </div>
                </div>
                <div class="text-center mb-4">
                    ${hdplay ? `<a href="${hdplay}" download class="btn btn-primary-custom">Download Video HD</a> | Size: ${hd_size.format || 'N/A'}` : ''}
                    ${play ? `<a href="${play}" download class="btn btn-primary-custom">Download Video SD</a> | Size: ${size.format || 'N/A'}` : ''}
                    ${music ? `<a href="${music}" download class="btn btn-primary-custom">Download Music</a>` : ''}
                </div>
            </div>
        `;

        const mediaContent = document.getElementById('media-content');
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                const imageElement = document.createElement('div');
                imageElement.className = 'mb-4';
                imageElement.innerHTML = `
                    <img src="${image}" alt="TikTok Image ${index + 1}" class="responsive-img rounded-lg mb-2">
                    <a href="${image}" download class="btn btn-primary-custom">Download Image ${index + 1}</a>
                `;
                mediaContent.appendChild(imageElement);
            });
        }
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Failed to fetch TikTok data.</p>';
    }
}
