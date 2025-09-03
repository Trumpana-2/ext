chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'downloadImages') {
    const { images, naming, domain, timestamp } = msg;
    let count = 0;
    let failed = [];
    const queue = [...images];
    function next() {
      if (!queue.length) {
        sendResponse({ done: true, failed });
        return;
      }
      const img = queue.shift();
      const url = img.url;
      const filename = `Wavas/${domain}/${timestamp}/${naming.replace('{index}', count+1)}`;
      chrome.downloads.download({
        url,
        filename,
        conflictAction: 'uniquify',
        saveAs: false
      }, (downloadId) => {
        if (chrome.runtime.lastError || !downloadId) {
          failed.push({ url, reason: chrome.runtime.lastError?.message || 'Unknown' });
        }
        count++;
        setTimeout(next, 300); // queue delay
      });
    }
    next();
    return true; // async
  }
});
