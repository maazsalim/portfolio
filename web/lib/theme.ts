export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs inline in <head> before first paint, so the page never flashes the
 * wrong theme. Uses the saved choice if there is one, otherwise follows
 * the system setting (and keeps following it if it changes).
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,k="${THEME_STORAGE_KEY}",m=window.matchMedia("(prefers-color-scheme: dark)"),s=localStorage.getItem(k);d.dataset.theme=s==="light"||s==="dark"?s:m.matches?"dark":"light";m.addEventListener("change",function(e){if(!localStorage.getItem(k))d.dataset.theme=e.matches?"dark":"light"})}catch(e){}})()`;
