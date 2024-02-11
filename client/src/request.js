export async function request(url, settings) {
  try {
    const res = await fetch(url, settings);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = await res.json();
    if (data.status === "success") {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    alert(err.message);
  }
}
