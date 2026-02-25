const BASE_URL =
  "https://script.google.com/macros/s/AKfycbz6Px_ZrLJdcYTpyxkb0mdUqLWGNekJupdn5PRqEtjZq9H95t-yaBWwSWscaFVg_U54/exec";

export async function checkIn(payload) {
  const response = await fetch(`${BASE_URL}?path=presence/checkin`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Server error");
  }

  return response.json();
}
