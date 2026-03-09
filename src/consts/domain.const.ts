// Use relative path for production (Vercel proxy) and full URL for development
export const DOMAIN_API = import.meta.env.DEV
  ? "https://final-project-tawny-two-47.vercel.app/api"
  : "/api";
