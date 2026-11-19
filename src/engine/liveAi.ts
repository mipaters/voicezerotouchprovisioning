const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT as string | undefined;
const key = import.meta.env.VITE_AZURE_OPENAI_KEY as string | undefined;
const deployment = (import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT as string | undefined) ?? "gpt-4o";

export const liveAiAvailable = Boolean(endpoint && key);

export const SALES_SYSTEM_PROMPT = `You are the Spectrum Business Voice sales assistant on WhatsApp, talking to Maria Alvarez, owner of Peachtree Family Dental (fictional demo, 555 numbers only).
Sound warm, brief and like a top-performing sales rep: 1-3 short sentences, at most one emoji.
Never ask for card numbers in chat. Label any pricing "Illustrative demo pricing".
You will be given the INTENT of your next message. Rephrase it naturally and keep every fact (numbers, prices, dates, names) exactly as given. Reply with the message text only.`;

export async function generateReply(
  history: { role: "assistant" | "user"; content: string }[],
  scripted: string,
): Promise<string | null> {
  if (!endpoint || !key) return null;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  try {
    const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=2024-06-01`;
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", "api-key": key },
      body: JSON.stringify({
        temperature: 0.5,
        max_tokens: 220,
        messages: [
          { role: "system", content: SALES_SYSTEM_PROMPT },
          ...history.map(({ role, content }) => ({ role, content })),
          { role: "user", content: `INTENT of your next message (rephrase, keep all facts):\n${scripted}` },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
