const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const Sentiment = require('sentiment');  // Correct import
const sentiment = new Sentiment();  // Initialize sentiment analyzer

const app = express();
app.use(cors()); // Enable CORS for frontend requests

// Hardcoded Amazon product URL
const amazonUrl = "https://www.amazon.com/HP-i3-1125G4-Processor-Anti-Glare-Accessories/dp/B0CJQVVSL2";

// Route to scrape reviews
app.get('/scrape-reviews', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(amazonUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.a-size-base.review-text', { timeout: 5000 });

    const reviews = await page.evaluate(() => {
      const reviewElements = Array.from(document.querySelectorAll('.a-size-base.review-text'));
      return reviewElements.map((reviewElement) => reviewElement.innerText);
    });

    if (reviews.length === 0) {
      throw new Error('No reviews found');
    }

    // Analyzing reviews with sentiment
    const reviewsWithSentiment = reviews.map((review) => {
      const sentimentResult = sentiment.analyze(review);  // Using the analyze method
      return {
        text: review,
        sentimentScore: sentimentResult.score,
        sentimentComparative: sentimentResult.comparative,
      };
    });

    await browser.close();
    res.json({ reviews: reviewsWithSentiment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Start server on port 5002
app.listen(5002, () => {
  console.log('Server is running on port 5002');
});
