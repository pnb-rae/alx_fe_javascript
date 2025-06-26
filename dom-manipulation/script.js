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

  // Periodic sync
  setInterval(syncQuotes, 30000);
});

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerText = `"${random.text}" — ${random.category}`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(random));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  populateCategories();
  filterQuotes();

  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

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

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);

  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  const display = document.getElementById("quoteDisplay");

  if (filtered.length === 0) {
    display.innerText = "No quotes in this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerText = `"${random.text}" — ${random.category}`;
}

function restoreLastSelectedCategory() {
  const last = localStorage.getItem("selectedCategory");
  if (last) {
    document.getElementById("categoryFilter").value = last;
  }
}

// ✅ Required: must be async
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();
    return data.map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    notifyUser("Failed to fetch from server.");
    console.error("Fetch error:", error);
    return [];
  }
}

// ✅ Required: must be async and call fetchQuotesFromServer()
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let conflicts = 0;

  serverQuotes.forEach(serverQuote => {
    const localMatch = quotes.find(q => q.text === serverQuote.text);
    if (!localMatch) {
      quotes.push(serverQuote);
    } else if (localMatch.category !== serverQuote.category) {
      localMatch.category = serverQuote.category; // conflict: server wins
      conflicts++;
    }
  });

  saveQuotes();
  populateCategories();
  filterQuotes();

  if (conflicts > 0) {
    notifyUser(`${conflicts} conflict(s) resolved from server.`);
  } else {
    notifyUser("Quotes synced with server.");
  }
}

// ✅ Required: POST using async/await
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}

// ✅ Required: notify user on sync/conflict
function notifyUser(message) {
  let box = document.getElementById("notification");
  if (!box) {
    box = document.createElement("div");
    box.id = "notification";
    box.style.position = "fixed";
    box.style.bottom = "10px";
    box.style.right = "10px";
    box.style.padding = "10px";
    box.style.background = "#333";
    box.style.color = "#fff";
    box.style.borderRadius = "5px";
    box.style.zIndex = "1000";
    document.body.appendChild(box);
  }
  box.innerText = message;
  setTimeout(() => box.remove(), 5000);
}




