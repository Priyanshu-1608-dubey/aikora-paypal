export const getApiBase = () => {
  const host = window.location.hostname;
  const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();
  if (!isCapacitor && (host === "localhost" || host === "127.0.0.1")) {
    return "http://localhost:8080";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:8080";
};
