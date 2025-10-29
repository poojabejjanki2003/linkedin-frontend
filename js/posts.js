const API = 'https://linkedin-backend-r9ng.onrender.com/api';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Show user info on navbar
document.getElementById('user-info').innerText = user?.name || 'Guest';

// Redirect if not logged in (optional, depending on your design)
if (!token) {
  alert("Please log in first!");
  window.location.href = 'login.html';
}

// Load feed
async function loadFeed() {
  try {
    const res = await fetch(`${API}/posts`);
    const posts = await res.json();

    const feed = document.getElementById('feed');
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
loadFeed();

// Post creation
const postForm = document.getElementById('postForm');
postForm.addEventListener('submit', async e => {
  e.preventDefault();
  const content = document.getElementById('content').value.trim();

  if (!content) return alert('Post content cannot be empty!');

  try {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (res.ok) {
      document.getElementById('content').value = '';
      loadFeed();
    } else if (res.status === 401 || res.status === 403) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    } else {
      alert('Failed to post.');
    }
  } catch (err) {
    console.error("Error posting content:", err);
  }
});
