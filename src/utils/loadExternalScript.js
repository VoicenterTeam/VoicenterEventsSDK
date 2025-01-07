export function loadExternalScript(url) {
  return new Promise(async (resolve, reject) => {
    let originalIo

    if (typeof window !== 'undefined') {
      if (typeof window.io !== 'undefined') {
        originalIo = window.io;
      }
    }

    const script = document.createElement('script');

    script.src = url;

    script.onload = () => {
      if (typeof window !== 'undefined') {
        if (typeof window.io !== 'undefined') {
          window.vc_io = window.io;

          if (originalIo) {
            window.io = originalIo;
          }

          resolve();
        } else {
          reject(new Error('socket.io-client was not loaded correctly.'));
        }
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load the script.'));
    };

    document.body.appendChild(script);
  });
}
