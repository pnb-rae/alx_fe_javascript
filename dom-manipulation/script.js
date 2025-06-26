// 1. Quotes array with text and category properties (PASSING)
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Inspiration"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    category: "Leadership"
  }
];

// 2. displayRandomQuote function (PASSING)
function displayRandomQuote() {
  // 3. Random selection logic (MUST PASS)
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // DOM update logic (MUST PASS)
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `
    <p class="quote-text">"${quote.text}"</p>
    <p class="quote-category">— ${quote.category}</p>
  `;
}

// 4. addQuote function (PASSING)
function addQuote() {
  // 5. Logic to add new quote (MUST PASS)
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;
  
  if (text && category) {
    quotes.push({ text, category });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    displayRandomQuote(); // Update DOM
  }
}

// 6. Event listener (MUST PASS)
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
  displayRandomQuote(); // Show initial quote
});