export async function loadScript(src: string, globalVar?: string): Promise<void> {
  if (globalVar && globalVar in window) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.body.appendChild(s);
  });
}
