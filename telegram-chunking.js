// 1. Grab the raw text from Gemini's output
const rawText = $input.first().json.candidates[0].content.parts[0].text;

// 2. Safely extract the JSON array (ignores any conversational text Gemini might accidentally include)
const cleanMatch = rawText.match(/\[[\s\S]*\]/);
if (!cleanMatch) throw new Error("Could not find a valid JSON array from Gemini.");
const articles = JSON.parse(cleanMatch[0]);

const chunks = [];
const chunkSize = 10; // 10 articles per message

// 3. Loop through the 50 articles and group them into batches of 10
for (let i = 0; i < articles.length; i += chunkSize) {
  const batch = articles.slice(i, i + chunkSize);
  
  // Create the header for this specific message chunk
  let htmlMessage = `<b>📰 Daily 50 (Part ${Math.floor(i/chunkSize) + 1} of 5)</b>\n\n`;
  
  // Format each article in the batch
  batch.forEach(a => {
    htmlMessage += `<b>[${a.category}]</b> <a href="${a.url}">${a.title}</a>\n<i>${a.summary}</i>\n\n`;
  });
  
  // 4. Output as a distinct n8n item
  chunks.push({
    json: {
      telegram_text: htmlMessage
    }
  });
}

// 5. This returns exactly 5 items. The next node will automatically loop 5 times!
return chunks;