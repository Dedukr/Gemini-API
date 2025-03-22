function sendRequest() {
  let formData = new FormData();
  let file = document.getElementById("id_image").files[0];
  let question = document.getElementById("id_question").value;

  formData.append("image", file);
  formData.append("question", question);
  document.getElementById("response").innerText = "Waiting for the response...";

  fetch("http://127.0.0.1:8000/api/ask/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.getElementById("response").innerText = "Error: " + data.error;
      } else {
        document.getElementById("response").innerText =
          data.answer || data.error;
      }
    });
}
