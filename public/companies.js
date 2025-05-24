const API_BASE_URL = 'http://localhost:5500';
const token = localStorage.getItem('token');

// Ensure jobs are loaded when the page starts
document.addEventListener('DOMContentLoaded', loadJobListings);

// Job Posting Form Submission Handler
document.getElementById('postJobForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Ensure user is authenticated
  if (!token) {
    alert('You must be logged in to post a job.');
    return;
  }

  const title = this.title.value;
  const location = this.location.value;
  const description = this.description.value;

  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, location, description }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Job posted successfully!');
      this.reset(); // Clear form after success
      loadJobListings(); // Refresh job listings
    } else {
      alert(data.error || 'Failed to post job');
    }
  } catch (err) {
    console.error('Error posting job:', err);
    alert('Error connecting to server');
  }
});

// Function to load posted jobs dynamically
async function loadJobListings() {
  const jobListEl = document.getElementById('jobList');

  try {
    const res = await fetch(`${API_BASE_URL}/jobs`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const jobs = await res.json();
    if (!Array.isArray(jobs)) throw new Error('Jobs data is not an array');

    jobListEl.innerHTML = jobs.map(job =>
      `<li>
        <strong>${job.title}</strong> at ${job.companyName || 'Unknown'} (${job.location})
      </li>`
    ).join('');
  } catch (err) {
    console.error('Error fetching jobs:', err);
    jobListEl.innerHTML = '<li>Failed to load jobs</li>';
  }
}