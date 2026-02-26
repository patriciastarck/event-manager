import { useState, useEffect } from "react";

export function useTheme() {
  // Inicializa o estado buscando do localStorage ou usando 'dark' como padrão
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const body = document.body;
    
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    
    // Salva a preferência para a próxima visita
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}