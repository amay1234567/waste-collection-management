async function loadRequests() {
  try {
    const res = await fetch('/api/requests');
    if (!res.ok) throw new Error("Failed to fetch requests");

    const data = await res.json();
    const requestsList = document.getElementById('requestsList');
    requestsList.innerHTML = '';

    if (data.length === 0) {
      requestsList.innerHTML = `<p class="text-gray-500 text-center">No requests found.</p>`;
      return;
    }

    data.forEach(req => {
      const div = document.createElement('div');
      div.className = "bg-white p-4 rounded-lg shadow flex justify-between items-center";
      div.innerHTML = `
        <div>
          <h3 class="font-bold text-lg">${req.location}</h3>
          <p class="text-gray-600">Type: ${req.wasteType}</p>
          <span class="px-2 py-1 rounded-full ${
            req.status === 'Collected'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }">${req.status}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="updateStatus(${req.id}, 'Collected')" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow">
            Mark Collected
          </button>
          <button onclick="deleteRequest(${req.id})" 
            class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow">
            Delete
          </button>
        </div>
      `;
      requestsList.appendChild(div);
    });

  } catch (err) {
    console.error("❌ Failed to load requests", err);
    alert("⚠️ Could not load requests. Please try again.");
  }
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Update failed");
    loadRequests();
  } catch (err) {
    console.error("❌ Failed to update request", err);
    alert("⚠️ Could not update request.");
  }
}

async function deleteRequest(id) {
  try {
    const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Delete failed");
    loadRequests();
  } catch (err) {
    console.error("❌ Failed to delete request", err);
    alert("⚠️ Could not delete request.");
  }
}

// 🔹 Wait until page is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('toggleRequestsBtn');
  const section = document.getElementById('requestsSection');

  if (toggleBtn && section) {
    toggleBtn.addEventListener('click', () => {
      if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        loadRequests(); // load only when shown
        toggleBtn.textContent = "Hide My Requests";
      } else {
        section.classList.add('hidden');
        toggleBtn.textContent = "Show My Requests";
      }
    });
  }

  // Optionally load immediately
  // loadRequests();
});
