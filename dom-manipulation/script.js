// Initial quotes array with text and category properties
const quotes = [
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
  }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Function to display random quote using DOM manipulation methods
function displayRandomQuote() {
  if (quotes.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No quotes available. Please add some quotes!';
    quoteDisplay.innerHTML = '';
    quoteDisplay.appendChild(message);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Clear previous quote
  quoteDisplay.innerHTML = '';
  
  // Create new elements
  const quoteText = document.createElement('p');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${quote.text}"`;
  
  const quoteCategory = document.createElement('p');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `— ${quote.category}`;
  
  // Append to DOM
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to add new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    textInput.value = '';
    categoryInput.value = '';
    displayRandomQuote();
    
    // Create success message element
    const successMsg = document.createElement('p');
    successMsg.className = 'success';
    successMsg.textContent = 'Quote added successfully!';
    document.body.appendChild(successMsg);
    
    // Remove message after 2 seconds
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 2000);
  } else {
    alert('Please enter both quote text and category!');
  }
}

// Event listener for "Show New Quote" button
newQuoteBtn.addEventListener('click', displayRandomQuote);

// Initialize with a random quote
displayRandomQuote();