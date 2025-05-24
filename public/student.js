document.addEventListener('DOMContentLoaded', () => {
  // Load opportunities
  fetch('/jobs')
    .then(res => res.json())
    .then(jobs => {
      const oppUl = document.getElementById('opportunities');
      oppUl.innerHTML = jobs.map(job =>
        `<li>
          <strong>${job.title}</strong> at ${job.company} (${job.location})
          <button onclick="applyJob('${job._id}')">Apply</button>
        </li>`
      ).join('');
    });

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Load application status
  fetch('/applications/my', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(apps => {
      const statusUl = document.getElementById('application-status');
      statusUl.innerHTML = Array.isArray(apps) ? apps.map(app =>
          `<li>${app.jobTitle || app.jobId}: <span>${app.status}</span></li>`
        ).join('') : '<li>No applications found.</li>';
    });

  // Load events
  fetch('/events')            // For getting events
    .then(res => res.json())
    .then(events => {
      const eventsUl = document.getElementById('events');
      eventsUl.innerHTML = events.map(ev =>
        `<li>${ev.name} on ${ev.date}</li>`
      ).join('');
    });

  // Load profile info
  fetch('/profile', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(profile => {
      const profileDiv = document.getElementById('profile-info');
      profileDiv.innerHTML = `
        <p><strong>Name:</strong> ${profile.name}</p>
        <p><strong>Email:</strong> ${profile.email || 'N/A'}</p>
        <p><strong>Resume:</strong> ${profile.resume ? `<a href="${profile.resume}" target="_blank">View</a>` : 'Not uploaded'}</p>
      `;
    });

  // Resume upload
  document.getElementById('resume-upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const res = await fetch('/resume', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      alert('Resume uploaded successfully!');
      // Optionally update profile info here
    } else {
      alert(data.error || 'Upload failed');
    }
  });
});

// Example applyJob function
function applyJob(jobId) {
  const token = localStorage.getItem('token');
  fetch('/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ jobId })
  })
    .then(res => res.json())
    .then(data => alert(data.message || 'Applied!'));
}