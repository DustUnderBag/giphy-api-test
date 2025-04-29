import "./reset.css";
import loadingScreen from "./images/loading.gif";
import notFoundScreen from "./images/not-found.gif";

console.log("Script entry point working");

const img = document.querySelector("img#gif");
const btn = document.querySelector("button#fetch");
const searchInput = document.querySelector("input#keyword");

updateImage();

btn.addEventListener("click", updateImage);
searchInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") updateImage();
});

async function fetchUrl() {
  img.src = loadingScreen;

  if (!searchInput.value) searchInput.value = "cats";
  const keyword = searchInput.value;

  const url = `https://api.giphy.com/v1/gifs/translate?api_key=OGy2jnjHhqgtYzZ3aEIL8X43Q7w9SEoJ&s=${keyword}`;
  try {
    const request = new Request(url, { mode: "cors" });
    const response = await fetch(request);
    console.log(response);

    if (!response.ok) throw identifyError(response);
    const resultData = await response.json();

    //If no result is found with some keywords, a response with empty data will be fetched.
    //But the response status is still 200 and treated as ok, no error will be thrown.
    //Therefore, need to handle such error explicitly.
    if (resultData.data.length === 0) {
      console.log(resultData);
      console.log("No image found.");
      return notFoundScreen;
    }

    return resultData.data.images.original.url;
  } catch (error) {
    console.log(error);
    return notFoundScreen;
  }
}

function updateImage() {
  fetchUrl().then((url) => (img.src = url));
}

//To identify error code, then return an Error instance with comprehensive description of error.
function identifyError(response) {
  let msg = response.status + " ";
  if (response.status === 400) msg += "Bad Request: Incorrect request format";
  if (response.status === 401)
    msg += "Unauthorized: Issue with API Key or missing API Key";
  if (response.status === 403) msg += "Forbidden: Issue with API Key";
  if (response.status === 429)
    msg += "Too Many Requests: Number of requests exceeds rate limits";

  return new Error(msg);
}
