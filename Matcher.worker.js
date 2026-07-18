/**
 * matcher.worker.js
 *
 * Runs the sentence-embedding model on a background thread.
 * Everything here is off the main thread, so the page never freezes
 * while the model downloads or runs inference.
 *
 * Messages in :  {type:'init'}  |  {type:'match', text:'...'}
 * Messages out:  {type:'progress'|'ready'|'failed'|'result', ...}
 */

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';

env.allowLocalModels = false;

// Each symptom is described by a few natural phrasings. The model averages
// them into one vector, which is what incoming speech gets compared against.
const SYMPTOMS = [
  { name: "ارتفاع الحرارة", phrases: ["عندي حمى وسخونة", "حرارتي مرتفعة", "جسمي حار وأشعر بقشعريرة"] },
  { name: "ألم البطن",      phrases: ["عندي ألم في البطن", "بطني توجعني", "معدتي تؤلمني ومغص"] },
  { name: "الغثيان",        phrases: ["أشعر بالغثيان", "أريد أن أتقيأ", "عندي دوخة وغثيان"] },
  { name: "السعال",         phrases: ["عندي سعال وكحة", "أسعل كثيراً", "صدري فيه بلغم"] },
  { name: "الصداع",         phrases: ["عندي صداع", "رأسي يؤلمني", "راسي يوجعني بشدة"] },
  { name: "التهاب الحلق",   phrases: ["حلقي يؤلمني", "ألم في الحلق عند البلع", "التهاب في الحنجرة"] },
  { name: "آلام المفاصل",   phrases: ["ألم في المفاصل", "ركبتي توجعني", "أوجاع وتيبّس في الجسم"] },
];

let embedder = null;
let vectors  = null;

async function embed(text) {
  const out = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(out.data);
}

function cosine(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // vectors are already normalised
}

async function init() {
  try {
    embedder = await pipeline(
      'feature-extraction',
      'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
      {
        dtype: 'q8',
        progress_callback: p => {
          if (p.status === 'progress' && p.progress) {
            self.postMessage({ type: 'progress', percent: Math.round(p.progress) });
          }
        },
      }
    );

    vectors = [];
    for (const s of SYMPTOMS) {
      const vecs = [];
      for (const phrase of s.phrases) vecs.push(await embed(phrase));
      const mean = vecs[0].map((_, i) =>
        vecs.reduce((sum, v) => sum + v[i], 0) / vecs.length);

      // renormalise the averaged vector
      const norm = Math.sqrt(mean.reduce((s, x) => s + x * x, 0));
      vectors.push(mean.map(x => x / norm));
    }

    self.postMessage({ type: 'ready' });
  } catch (err) {
    self.postMessage({ type: 'failed', message: String(err) });
  }
}

self.onmessage = async ({ data }) => {
  if (data.type === 'init') return init();

  if (data.type === 'match') {
    if (!embedder || !vectors) {
      return self.postMessage({ type: 'result', ready: false });
    }
    try {
      const v = await embed(data.text);
      let best = 0, score = -1;
      vectors.forEach((sv, i) => {
        const sim = cosine(v, sv);
        if (sim > score) { score = sim; best = i; }
      });
      self.postMessage({
        type: 'result',
        ready: true,
        name: SYMPTOMS[best].name,
        score,
      });
    } catch {
      self.postMessage({ type: 'result', ready: false });
    }
  }
};