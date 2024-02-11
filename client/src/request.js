export async function request(url, settings) {
  try {
    const res = await fetch(url, settings);
    const data = await res.json();
    return data;
  } catch (err) {
    swal(err.message, {
      buttons: false,
      timer: 3000,
      className: "error-box",
    });
  }
}
