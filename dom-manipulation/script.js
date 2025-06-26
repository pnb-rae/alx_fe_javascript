// Initial quotes array
let quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    category: "Inspiration"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    category: "Leadership"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    category: "Life"
  },
  {
    text: "Stay hungry, stay foolish.",
    category: "Motivation"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "Perseverance"
  }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = '<p class="quote-text">No quotes available. Please add some quotes!</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p class="quote-text">"${quote.text}"</p>
    <p class="quote-category">— ${quote.category}</p>
  `;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    textInput.value = '';
    categoryInput.value = '';
    showRandomQuote();
  } else {
    alert('Please enter both quote text and category!');
  }
}

// Create form for adding quotes (already in HTML)
// function createAddQuoteForm() {
//   // Form is already in HTML
// }

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);

// Initialize with a random quote
showRandomQuote();