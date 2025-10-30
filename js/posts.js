const API = 'https://linkedin-backend-r9nq.onrender.com/api';


const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Show user info on navbar
document.getElementById('user-info').innerText = user?.name || 'Guest';

// Redirect if not logged in (optional, depending on your design)
if (!token || !user?.name) {
  alert("Please log in first!");
  window.location.href = 'login.html';
}


// Load feed
async function loadFeed() {
  try {
    const res = await fetch(`${API}/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`Failed to load feed: ${res.status}`);
    const posts = await res.json();

    const feed = document.getElementById('feed');
    if (!Array.isArray(posts)) throw new Error('Posts response is not an array');

    feed.innerHTML = posts.map(p => `
      <div class="post">
        <h4>${p.name}</h4>
        <p>${p.content}</p>
        <small>${new Date(p.created_at).toLocaleString()}</small>
      </div>
    `).join('');
  } catch (err) {
    console.error("Error loading feed:", err);
  }
}
