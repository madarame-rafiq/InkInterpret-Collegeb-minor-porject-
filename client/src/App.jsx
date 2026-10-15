
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to API...");

  useEffect(() => {
    async function checkAPI() {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("API request failed:", error);
        setMessage("Could not connect to the API.");
      }
    }

    checkAPI();
  }, []);

  return (
    <main>
      <h1>Imagination Game</h1>
      <p>{message}</p>
    </main>
  );
}

export default App;