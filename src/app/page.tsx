"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";


const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API


export default function Home() {
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false)
  const [explanation, setExplanation] = useState('')

  const trainingPrompt = [
    {
      "parts": [{
        "text": "Now I want you to act as a code explainer, if I give you a piece of code then you have to explain me tha code in a single response , just give me the explaination don't give anything else"
      }],
      "role": 'user'
    },
    {
      "parts": [
        {
          "text": "okay"
        }
      ],
      "role": "model"
    }
  ]

  const explainthiscode = async () => {
    let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY

    let messageToSend = [
      ...trainingPrompt,
      {
        "parts": [{
          "text": code
        }
        ],
        "role": "user"
      }
    ]

    setIsSending(true)

    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": messageToSend
      })
    })

    let resjson = await res.json()
    setIsSending(false)

    let responseMessage = resjson.candidates[0].content.parts[0].text
    // console.log(responseMessage)
    setExplanation(responseMessage);
  }
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <textarea className={styles.input} placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)} />

        {
          explanation.length > 0 ?
            <p className={styles.fixed}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{explanation}</span>
            </p>
            :
            <p className={styles.notfixed}>
              Promt is empty...
            </p>
        }
      </div>
      {
        isSending ?
          <button className={styles.button}
          >Sending...</button>
          :
          <button className={styles.button}
            onClick={explainthiscode}
          >Explain</button>
      }
    </div>
  );
}
