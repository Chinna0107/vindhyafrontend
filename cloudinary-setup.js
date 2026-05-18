// Cloudinary Upload Preset Setup Script
// Run this once to create the upload preset for Vindhya Pickles

const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dqmhtibfx',
  API_KEY: '347819315697656',
  API_SECRET: 'tQMhJ2mvg3xuHrErDnayR1wqh3Q'
};

async function createUploadPreset() {
  const auth = btoa(`${CLOUDINARY_CONFIG.API_KEY}:${CLOUDINARY_CONFIG.API_SECRET}`);
  
  const presetData = {
    name: 'ompickles_preset',
    unsigned: true,
    folder: 'ompickles/products',
    allowed_formats: 'jpg,jpeg,png,webp,gif',
    max_file_size: 5000000, // 5MB
    quality: 'auto',
    format: 'auto',
    transformation: [
      {
        width: 1200,
        height: 1200,
        crop: 'limit',
        quality: 'auto',
        format: 'auto'
      }
    ],
    tags: 'ompickles,products'
  };

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload_presets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(presetData)
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload preset created successfully!');
      console.log('Preset name:', result.name);
      console.log('Settings:', result.settings);
    } else {
      const error = await response.json();
      console.error('❌ Failed to create preset:', error);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Instructions for manual setup
console.log(`
🚀 Cloudinary Setup for Vindhya Pickles

Your Cloudinary Account Details:
- Cloud Name: ${CLOUDINARY_CONFIG.CLOUD_NAME}
- API Key: ${CLOUDINARY_CONFIG.API_KEY}

Manual Setup Steps:
1. Go to https://console.cloudinary.com/settings/upload
2. Click "Add upload preset"
3. Configure as follows:
   - Preset name: ompickles_preset
   - Signing mode: Unsigned ✅
   - Folder: ompickles/products
   - Allowed formats: jpg,jpeg,png,webp,gif
   - Max file size: 5000000 (5MB)
   - Quality: auto
   - Format: auto
   - Max dimensions: 1200x1200

Or run this script to create automatically:
`);

// Uncomment the line below to run the automatic setup
// createUploadPreset();