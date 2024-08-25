
// Function to generate an image using Monster API
async function generateImage(prompt) {
  const endpoint = 'https://api.monsterapi.ai/v1/generate/txt2img';
  const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjMyMjgyOTNkZTI4MWM3YzMzOTJhMTBjZTk2MGExMDlmIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDgtMjVUMDc6MDA6MDcuMzE4NTEwIn0.1T9a1l2NWFIyD6afTRHefEbuONJWok72YYjRqfck1po'; // Replace with your API key

  // Simulated dummy data
  const requestBody = {
    prompt: prompt,
    aspect_ratio: 'portrait',
    guidance_scale: '12.5'
  };

  try {
    // Send the POST request to generate the image
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json' // Content-Type for JSON payload
      },
      body: JSON.stringify(requestBody) // Send JSON payload
    });

    // Parse the JSON response
    const data = await response.json();

    if (response.ok) {
      console.log('Request accepted successfully');
      console.log('Process ID:', data.process_id);
      console.log('Status URL:', data.status_url);
      
      // Poll for status
      await checkStatus(data.status_url, apiKey);
    } else {
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

// Function to check the status of the image generation request
async function checkStatus(statusUrl, apiKey) {
  try {
    const interval = 5000; // Poll every 5 seconds

    while (true) {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.status === 'COMPLETED') {
          console.log('Image generation completed');
          console.log('Generated Image URLs:', data.result.output);
          break;
        } else if (data.status === 'FAILED') {
          console.error('Image generation failed');
          break;
        } else {
          console.log('Status:', data.status);
        }
      } else {
        console.error('Error:', data);
        break;
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

// Example usage
generateImage('detailed sketch of lion by greg rutkowski, beautiful, intricate, ultra realistic, elegant, art by artgerm');
