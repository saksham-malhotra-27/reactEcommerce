import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const generateImage = async (req: Request, res: Response) => {
  
 const { prompt } = req.body;
  const endpoint = 'https://api.monsterapi.ai/v1/generate/txt2img';
  const apiKey = `${process.env.API_KEY}`; // Replace with your API key

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const requestBody = {
    prompt: prompt,
    aspect_ratio: 'portrait',
    guidance_scale: '12.5',
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Request accepted successfully');
      console.log('Process ID:', data.process_id);
      console.log('Status URL:', data.status_url);

      // Call the checkStatus function to poll for the image generation status
      const imageUrls = await checkStatus(data.status_url, apiKey);

      if (imageUrls) {
        // Download the image and serve it from your server
        const localImagePaths = await downloadImages(imageUrls);

        return res.status(200).json({ message: 'Image generated successfully', imageUrls: localImagePaths });
      } else {
        return res.status(500).json({ error: 'Image generation failed' });
      }
    } else {
      return res.status(response.status).json({ error: data });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
 
};

const checkStatus = async (statusUrl: string, apiKey: string): Promise<string[] | null> => {
  const interval = 5000; // Poll every 5 seconds

  try {
    while (true) {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'COMPLETED') {
          console.log('Image generation completed');
          console.log('Generated Image URLs:', data.result.output);
          return data.result.output;
        } else if (data.status === 'FAILED') {
          console.error('Image generation failed');
          return null;
        } else {
          console.log('Status:', data.status);
        }
      } else {
        console.error('Error:', data);
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
};

const downloadImages = async (imageUrls: string[]): Promise<string[]> => {
  const downloadedImages: string[] = [];

  // Convert import.meta.url to a file path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Set the directory to save images to `backend/public/images`
  const imagesDirectory = path.join(__dirname, '../../../frontend/public/images');

  // Ensure the directory exists
  if (!fs.existsSync(imagesDirectory)) {
    fs.mkdirSync(imagesDirectory, { recursive: true });
  }

  for (const url of imageUrls) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageName = path.basename(url);
      const imagePath = path.join(imagesDirectory, imageName);

      fs.writeFileSync(imagePath, response.data);

      downloadedImages.push(`/images/${imageName}`);
      console.log(downloadImages)
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }


  return downloadedImages;
};

export { generateImage };
