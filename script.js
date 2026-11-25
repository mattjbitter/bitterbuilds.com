// Copy email
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

document.getElementById('copyEmail').addEventListener('click', async () => {
  const email = document.getElementById('emailLink').href.replace('mailto:', '');
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
  } catch {
    showToast(email);
  }
});
