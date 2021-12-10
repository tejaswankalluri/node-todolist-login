const navTogglemenu = document.querySelector(".nav_toggle");
const hamberger = document.querySelector("#hamberger");
const copyright = document.querySelector(".copyright");
navTogglemenu.addEventListener("click", (e) => {
  navTogglemenu.style.display = "none";
});
// =============== navbar mobile event =================
hamberger.addEventListener("click", (e) => {
  const x = navTogglemenu.style.display;
  if (x == "none") {
    navTogglemenu.style.display = "block";
  } else {
    navTogglemenu.style.display = "none";
  }
});
