export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const injectScript = (url: string) =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = (event) => {
      reject(new Error(`Failed to load script: ${url} (${event})`));
    };

    document.head.appendChild(script);
  });
