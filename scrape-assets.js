const https = require('https');
const fs = require('fs');
const path = require('path');

function downloadHTML() {
  return new Promise((resolve, reject) => {
    https.get('https://www.diefliegengitterprofis.de/', (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractAssetURLs(html) {
  const assets = new Set();
  
  // Extrahiere img src
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    assets.add(match[1]);
  }
  
  // Extrahiere video src
  const videoRegex = /<(?:video|source)[^>]+src=["']([^"']+)["']/gi;
  while ((match = videoRegex.exec(html)) !== null) {
    assets.add(match[1]);
  }
  
  // Extrahiere background images aus style
  const bgRegex = /background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    assets.add(match[1]);
  }
  
  return Array.from(assets);
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const baseUrl = 'https://www.diefliegengitterprofis.de';
    const fullUrl = url.startsWith('http') ? url : 
                    url.startsWith('//') ? 'https:' + url :
                    url.startsWith('/') ? baseUrl + url : 
                    baseUrl + '/' + url;
    
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log(`Downloading: ${fullUrl}`);
    
    https.get(fullUrl, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${dest}`);
          resolve(true);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`→ Redirect: ${response.headers.location}`);
        resolve(false);
      } else {
        console.log(`✗ Error ${response.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`✗ Error: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('Fetching HTML...\n');
  const html = await downloadHTML();
  
  console.log('Extracting asset URLs...\n');
  const assetURLs = extractAssetURLs(html);
  
  console.log(`Found ${assetURLs.length} assets:\n`);
  assetURLs.forEach(url => console.log(`  - ${url}`));
  
  console.log('\n\nDownloading assets...\n');
  
  for (const url of assetURLs) {
    const filename = path.basename(url.split('?')[0]);
    const ext = path.extname(filename).toLowerCase();
    
    let dest;
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
      dest = path.join('public', 'images', filename);
    } else if (['.mp4', '.webm', '.ogg'].includes(ext)) {
      dest = path.join('public', 'videos', filename);
    } else {
      continue; // Skip non-media files
    }
    
    await downloadFile(url, dest);
  }
  
  console.log('\n\nDone!');
}

main().catch(console.error);
