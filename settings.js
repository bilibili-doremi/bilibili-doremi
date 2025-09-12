function saveOptions() {
  const url = document.getElementById('json-url').value;
  chrome.storage.sync.set(
    {
      customJsonUrl: url,
    },
    () => {
      // Clear the local content when a URL is saved
      chrome.storage.local.remove('customJsonContent', () => {
        const status = document.getElementById('status-message');
        status.textContent = '选项已保存。';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      });
    },
  );
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      customJsonUrl: '',
    },
    (items) => {
      document.getElementById('json-url').value = items.customJsonUrl;
    },
  );
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    chrome.storage.local.set({ customJsonContent: content }, () => {
      // Clear the sync URL when a file is loaded
      chrome.storage.sync.remove('customJsonUrl', () => {
        document.getElementById('json-url').value = '';
        const status = document.getElementById('status-message');
        status.textContent = '本地文件已加载并保存。';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      });
    });
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);
document
  .getElementById('json-file-picker')
  .addEventListener('change', handleFileSelect);