function saveOptions() {
  const url = document.getElementById('json-url').value;
  chrome.storage.sync.set(
    {
      customJsonUrl: url,
    },
    function () {
      const status = document.getElementById('status-message');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 2000);
    },
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      customJsonUrl: '',
    },
    function (items) {
      document.getElementById('json-url').value = items.customJsonUrl;
    },
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);
