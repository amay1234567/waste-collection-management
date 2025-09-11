// public/app.js
document.addEventListener("DOMContentLoaded", () => {
  // Auto-detect API base (works locally + deployed)
  const API_BASE = window.location.origin;

  const form = document.getElementById("requestForm");
  const requestsList = document.getElementById("requestsList");
  const modalContainer = document.getElementById("modalContainer");
  const modalMessage = document.getElementById("modalMessage");
  const closeModalButton = document.getElementById("closeModalButton");

  // Dashboard counters
  const totalCountEl = document.getElementById("totalCount");
  const pendingCountEl = document.getElementById("pendingCount");
  const collectedCountEl = document.getElementById("collectedCount");

  // Auto-fill location from pincode
  const pincodeInput = document.getElementById("pincodeInput");
  const locationInput = document.getElementById("location");

  pincodeInput.addEventListener("blur", async () => {
    const pincode = pincodeInput.value.trim();

    if (/^\d{6}$/.test(pincode)) {
      try {
        const res = await fetch(`${API_BASE}/api/pincode/${pincode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.area) {
            locationInput.value = `${data.area}, ${data.city}, ${data.state}`;
          } else {
            locationInput.value = "";
            showModal("No area found for this pincode.");
          }
        }
      } catch (err) {
        console.error("Pincode lookup failed", err);
      }
    }
  });

  // Show modal
  function showModal(message) {
    modalMessage.textContent = message;
    modalContainer.classList.remove("hidden");
  }
  closeModalButton.addEventListener("click", () => {
    modalContainer.classList.add("hidden");
  });

  // Fetch and display requests
  async function loadRequests() {
    try {
      const res = await fetch(`${API_BASE}/api/requests`);
      if (!res.ok) throw new Error("Failed to fetch requests");

      const data = await res.json();

      // Update dashboard counts
      const total = data.length;
      const pending = data.filter(r => r.status === "Pending").length;
      const collected = data.filter(r => r.status === "Collected").length;

      totalCountEl.textContent = total;
      pendingCountEl.textContent = pending;
      collectedCountEl.textContent = collected;

      // Render requests list
      if (!data.length) {
        requestsList.innerHTML = `<p class="text-center text-gray-500 py-4">No requests yet.</p>`;
        return;
      }

      requestsList.innerHTML = data.map(r => `
        <div class="p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <p class="font-bold">Request #${r.id}</p>
            <p><strong>Location:</strong> ${r.location}</p>
            <p><strong>Waste Type:</strong> ${r.wasteType}</p>
            <p><strong>Pincode:</strong> ${r.pincode}</p>
            <p><strong>Status:</strong> 
              <span class="px-2 py-1 rounded text-white ${r.status === "Pending" ? "bg-yellow-500" : "bg-green-600"}">
                ${r.status}
              </span>
            </p>
            <p class="text-sm text-gray-500">Submitted: ${r.timestamp}</p>
          </div>
          <div class="flex gap-2">
            <button onclick="markCollected(${r.id})" class="bg-green-500 text-white px-3 py-1 rounded">Mark Collected</button>
            <button onclick="deleteRequest(${r.id})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      `).join("");
    } catch (err) {
      console.error("Error loading requests", err);
      requestsList.innerHTML = `<p class="text-center text-red-500">Failed to load requests.</p>`;
    }
  }

  // Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    const wasteType = document.getElementById("wasteType").value;
    const pincode = pincodeInput.value.trim();

    if (!/^\d{6}$/.test(pincode)) {
      showModal("Please enter a valid 6-digit pincode.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, wasteType, pincode })
      });

      if (res.ok) {
        showModal("Request submitted successfully!");
        form.reset();
        loadRequests();
      } else {
        const errData = await res.json();
        showModal(errData.error || "Error submitting request. Try again.");
      }
    } catch (err) {
      console.error("Submit failed", err);
      showModal("Error submitting request. Try again.");
    }
  });

  // Delete request
  window.deleteRequest = async (id) => {
    try {
      await fetch(`${API_BASE}/api/requests?id=${id}`, { method: "DELETE" });
      loadRequests();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Mark as Collected
  window.markCollected = async (id) => {
    try {
      await fetch(`${API_BASE}/api/requests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Collected" })
      });
      loadRequests();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Initial load
  loadRequests();
});
