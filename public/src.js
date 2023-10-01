const form = document.getElementById("form");
const userInput = document.getElementById("long-url");
const feedbackDOMHeader = document.querySelector("h3");
const feedbackDOM = document.getElementById("short-link");

feedbackDOMHeader.style.display = "none";

async function shortenUrl() {
  let longUrl = userInput.value;

  try {
    const response = await fetch("/api/v1/shorten", {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        originalUrl: longUrl,
      }),
    });

    const data = await response.json();
    const { originalUrl, shortenedUrl } = data;


    if (response.status === 400) {
      console.log(data);
      feedbackDOMHeader.style.display = "none";
      feedbackDOM.innerHTML = `<p>${Object.values(data).toString()}</p>`;
    } else {
      console.log(data);
      userInput.value = "";
      feedbackDOMHeader.style.display = "block";
      feedbackDOM.innerHTML = `<p>Shortend url: <a href="${shortenedUrl}">${shortenedUrl}</a></p>
      <p>Original url: ${originalUrl}</p>`;
    }
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  shortenUrl();
  // console.log(userInput.value);
});
