let quotes = [];

document.addEventListener("DOMContentLoaded", () => {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit is your mind.", category: "Motivation" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    ];
    saveQuotes();
  }

  populateCategories();
  restoreLastSelectedCategory();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options except 'All'
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function restoreLastSelectedCategory() {
  const lastCategory = localStorage.getItem("selectedCategory");
  const select = document.getElementById("categoryFilter");

  if (lastCategory) {
    select.value = lastCategory;
  }
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);

  const display = document.getElementById("quoteDisplay");
  let filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filtered.length === 0) {
    display.innerText = "No quotes in this category.";
    return;
  }

  // Show a random quote from filtered set
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const { text, category: cat } = filtered[randomIndex];
  display.innerText = `"${text}" — ${cat}`;

  // Save viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify({ text, category: cat }));
}

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

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();
  alert("Quote added successfully!");
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

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

