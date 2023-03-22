import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [placeInput, setPlaceInput] = useState("");
  const [preferencesInput, setPreferencesInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          place: placeInput,
          preferences: preferencesInput 
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPlaceInput("");
      setPreferencesInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <link rel="icon" href="/palm.png" />
      </Head>

      <main className={styles.main}>
        <img src="/palm.png" className={styles.icon} />
        <h3></h3>
        <form onSubmit={onSubmit}>
          <label
            htmlFor="place"
          >Where are you going?</label>
          <input
            type="text"
            id="place"
            name="place"
            placeholder="Tokyo"
            value={placeInput}
            onChange={(e) => setPlaceInput(e.target.value)}
          />
            <label
            for="duration"
          >How long are you going for?</label>
          <input
            type="text"
            id="duration"
            name="duration"
            placeholder="10 days"
            value={placeInput}
            onChange={(e) => setPlaceInput(e.target.value)}
          />
          <label
            htmlFor="preferences"
          >What are you into?</label>
          <input
            type="text"
            id="preferences"
            name="preferences"
            placeholder="Fashion, art, wong kar-wai"
            value={placeInput}
            onChange={(e) => setPlaceInput(e.target.value)}
          />
          <input type="submit" value="Plan my trip" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
