export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return res.status(400).json({ error: 'No file' });
    }

    const cloudinaryData = new FormData();
    cloudinaryData.append('file', file);
    cloudinaryData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
      { method: 'POST', body: cloudinaryData }
    );

    const data = await upload.json();
    return res.status(200).json({ url: data.secure_url });
    
  } catch (err) {
    return res.status(500).json({ error: 'Upload failed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};