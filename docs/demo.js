import("../confetti.js").then((confetti) => {
  function fireCanons() {
    confetti.default.start({
      timeout: 0,
      amount: 1,
      rootEl: document.getElementById("confettidemo"),
    });
  }

  const btn = document.getElementById("clickme");
  btn.addEventListener("click", function () {
    fireCanons();
  });
});
