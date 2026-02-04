const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.diefliegengitterprofis.de';

// Liste der Assets zum Herunterladen (basierend auf typischen Website-Strukturen)
const assets = [
  // Bilder
  { url: '/img/hero.jpg', dest: 'public/images/hero.jpg' },
  { url: '/img/hero-bg.jpg', dest: 'public/images/hero-bg.jpg' },
  { url: '/images/hero.jpg', dest: 'public/images/hero.jpg' },
  { url: '/assets/images/hero.jpg', dest: 'public/images/hero.jpg' },
  
  // Beispielbilder
  { url: '/img/beispiel-1.jpg', dest: 'public/images/beispiel-1.jpg' },
  { url: '/img/beispiel-2.jpg', dest: 'public/images/beispiel-2.jpg' },
  { url: '/img/beispiel-3.jpg', dest: 'public/images/beispiel-3.jpg' },
  { url: '/img/beispiel-4.jpg', dest: 'public/images/beispiel-4.jpg' },
  { url: '/img/beispiel-5.jpg', dest: 'public/images/beispiel-5.jpg' },
  { url: '/img/beispiel-6.jpg', dest: 'public/images/beispiel-6.jpg' },
  
  // Video
  { url: '/video/promo.mp4', dest: 'public/videos/promo.mp4' },
  { url: '/videos/promo.mp4', dest: 'public/videos/promo.mp4' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('http') ? url : baseUrl + url;
    const dir = path.dirname(dest);
    
    // Erstelle Verzeichnis falls nicht vorhanden
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log(`Downloading: ${fullUrl} -> ${dest}`);
    
    https.get(fullUrl, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${dest}`);
          resolve();
        });
      } else if (response.statusCode === 404) {
        console.log(`✗ Not found: ${fullUrl}`);
        resolve(); // Nicht abbrechen bei 404
      } else {
        console.log(`✗ Error ${response.statusCode}: ${fullUrl}`);
        resolve();
      }
    }).on('error', (err) => {
      console.log(`✗ Error: ${fullUrl} - ${err.message}`);
      resolve();
    });
  });
}

async function downloadAll() {
  console.log('Starting asset download...\n');
  
  for (const asset of assets) {
    await downloadFile(asset.url, asset.dest);
  }
  
  console.log('\nDownload complete!');
}

downloadAll();
