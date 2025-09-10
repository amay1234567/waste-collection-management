async function loadRequests() {
  try {
    const res = await fetch('/api/requests');
    const data = await res.json();

    const requestsList = document.getElementById('requestsList');
    requestsList.innerHTML = '';

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
          <button onclick="updateStatus(${req.id}, 'Collected')" class="bg-blue-500 text-white px-2 py-1 rounded">Mark Collected</button>
          <button onclick="deleteRequest(${req.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      `;
      requestsList.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load requests", err);
  }
}

async function updateStatus(id, status) {
  await fetch(`/api/requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  loadRequests();
}

async function deleteRequest(id) {
  await fetch(`/api/requests/${id}`, { method: 'DELETE' });
  loadRequests();
}

// 🔹 Wait until page is fully loaded
window.onload = () => {
  const toggleBtn = document.getElementById('toggleRequestsBtn');
  const section = document.getElementById('requestsSection');

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
};
