import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Index from "../components/quiz/Index";

import "tailwindcss/tailwind.css";

export default function Home() {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const setDarkModeMediaQuery = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener("change", setDarkModeMediaQuery);
    return () =>
      darkModeMediaQuery.removeEventListener("change", setDarkModeMediaQuery);
  }, []);

  return  <Index />;
}
