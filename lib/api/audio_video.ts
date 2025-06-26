const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5328/api";

export async function getAudioVideo() {
  const res = await fetch(`${API_BASE}/audio_video`);
  if (!res.ok) throw new Error("Failed to fetch audio/video");
  return res.json();
}

export async function addAudioVideo(data: { name: string; type: string }) {
  const res = await fetch(`${API_BASE}/audio_video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add audio/video");
  return res.json();
}

export async function updateAudioVideo(id: number, data: { name: string; type: string }) {
  const res = await fetch(`${API_BASE}/audio_video/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update audio/video");
  return res.json();
}

export async function deleteAudioVideo(id: number) {
  const res = await fetch(`${API_BASE}/audio_video/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete audio/video");
}
