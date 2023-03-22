import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [placeInput, setPlaceInput] = useState("");
  const [preferencesInput, setPreferencesInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    setDisabled(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          place: placeInput,
          preferences: preferencesInput,
          duration: durationInput 
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setDisabled(false)
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPlaceInput("");
      setPreferencesInput("");
      setDurationInput("");
      setDisabled(false)
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
            htmlFor="duration"
          >How long are you going for?</label>
          <input
            type="text"
            id="duration"
            name="duration"
            placeholder="10 days"
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
          />
          <label
            htmlFor="preferences"
          >What are you into?</label>
          <input
            type="text"
            id="preferences"
            name="preferences"
            placeholder="Fashion, art, wong kar-wai"
            value={preferencesInput}
            onChange={(e) => setPreferencesInput(e.target.value)}
          />
          <input type="submit" value="Plan my trip" disabled={disabled}/>
        </form>
        <body><div className={styles.result}> {result} </div></body>
      </main>
    </div>
  );
}
