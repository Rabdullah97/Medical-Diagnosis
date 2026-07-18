# Medical Diagnosis — Voice-Driven Symptom Checker

A web application that helps people understand what their symptoms might indicate, before they see a doctor. Users can either **speak their symptoms aloud** or select them from a list, and the system returns likely conditions with plain-language descriptions, common signs, and basic guidance.

Built through a collaboration between the **AI & Robot Club** and the **Student Council of the College of Applied Medical Sciences (CAMS)** at Imam Abdulrahman Bin Faisal University.

---

## ⚠️ Important

This is an **educational project**, not a medical device. It does not diagnose illness and must not be used to make health decisions. Anyone with a health concern should consult a qualified healthcare professional.

---

## What it does

- **Voice input** — describe symptoms naturally instead of navigating menus
- **Manual selection** — pick symptoms from a structured list
- **Condition matching** — surfaces conditions consistent with the reported symptoms
- **Plain-language output** — each result includes a description, typical signs, and general guidance
- **Referral prompt** — consistently directs users toward professional care

---

## Why I built it

The collaboration with CAMS students shaped the whole approach. Their consistent feedback was that symptom-checker tools tend to fail in one of two ways: they either overwhelm people with clinical terminology, or they alarm them by leading with worst-case conditions.

So the design goal was not maximum diagnostic accuracy — it was **appropriate confidence**. Results are framed as possibilities worth discussing with a doctor, never as conclusions. Voice input exists for the same reason: someone feeling unwell should not have to work through a long form to get useful information.

---

## Tech Stack

<!-- TODO: confirm this table against your actual code -->

| Component | Technology |
|---|---|
| Interface | HTML5, CSS3 |
| Logic | JavaScript |
| Voice recognition | Web Speech API |

---

## Running it locally

```bash
git clone https://github.com/Rabdullah97/Medical-Diagnosis.git
cd Medical-Diagnosis
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

> Voice input relies on the Web Speech API, which has the broadest support in Chrome and Edge. Microphone access requires `localhost` or HTTPS.

---

## Project Structure

<!-- TODO: update to match your actual files -->

```
Medical-Diagnosis/
├── index.html          
├── style.css          
├── script.js         
└── data/             
```

---

## Acknowledgements

A joint project of the AI & Robot Club and the CAMS Student Council, IAU — November 2024. Thanks to the medical sciences students who reviewed the condition descriptions for clarity and appropriate tone.
