let quotes = [];

document.addEventListener("DOMContentLoaded", () => {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
    saveQuotes();
  }

  populateCategories();
  restoreLastSelectedCategory();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  // Auto-sync every 30s
  setInterval(syncWithServer, 30000);
});

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote from current filter
function showRandomQuote() {
  const currentCategory = document.getElementById("categoryFilter").value;
  const applicableQuotes = currentCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === currentCategory);

  if (applicableQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * applicableQuotes.length);
  const { text, category } = applicableQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${text}" — ${category}`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify({ text, category }));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  populateCategories();
  filterQuotes();
  alert("Quote added successfully!");
}

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Filter quotes by category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);

  const display = document.getElementById("quoteDisplay");
  let filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filtered.length === 0) {
    display.innerText = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const { text, category: cat } = filtered[randomIndex];
  display.innerText = `"${text}" — ${cat}`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify({ text, category: cat }));
}

// Restore last selected filter
function restoreLastSelectedCategory() {
  const lastCategory = localStorage.getItem("selectedCategory");
  const select = document.getElementById("categoryFilter");

  if (lastCategory) {
    select.value = lastCategory;
  }
}

// Export quotes as JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulated server sync
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts?_limit=5";

function syncWithServer() {
  fetch(SERVER_URL)
    .then(res => res.json())
    .then(serverQuotes => {
      const formatted = serverQuotes.map(post => ({
        text: post.title,
        category: "Server"
      }));

      let conflicts = 0;

      formatted.forEach(serverQuote => {
        const exists = quotes.some(q => q.text === serverQuote.text);
        if (!exists) {
          quotes.push(serverQuote);
        } else {
          const local = quotes.find(q => q.text === serverQuote.text);
          if (local.category !== serverQuote.category) {
            local.category = serverQuote.category; // server wins
            conflicts++;
          }
        }
      });

      saveQuotes();
      populateCategories();
      filterQuotes();

      if (conflicts > 0) {
        notifyUser(`${conflicts} conflict(s) resolved using server data.`);
      } else {
        notifyUser("Synced with server successfully.");
      }
    })
    .catch(err => {
      notifyUser("Failed to sync with server.");
      console.error("Server sync failed:", err);
    });
}

// Notify user
function notifyUser(message) {
  let existing = document.getElementById("notification");
  if (!existing) {
    existing = document.createElement("div");
    existing.id = "notification";
    existing.style.position = "fixed";
    existing.style.bottom = "10px";
    existing.style.right = "10px";
    existing.style.padding = "10px";
    existing.style.background = "#222";
    existing.style.color = "#fff";
    existing.style.borderRadius = "5px";
    existing.style.zIndex = "1000";
    document.body.appendChild(existing);
  }
  existing.innerText = message;
  setTimeout(() => existing.remove(), 5000);
}


