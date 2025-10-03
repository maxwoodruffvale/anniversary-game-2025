// passwordGame.js
export function handlePasswordMinigame() {
  const overlay = document.createElement("div");
  overlay.id = "passwordOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  });

  const container = document.createElement("div");
  Object.assign(container.style, {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
  });

  const label = document.createElement("div");
  label.textContent = "Enter the password:";
  label.style.marginBottom = "10px";

  const input = document.createElement("input");
  input.type = "password";
  input.style.padding = "5px";
  input.style.marginBottom = "10px";
  input.style.width = "200px";
  input.style.display = "block";
  input.style.margin = "0 auto 10px auto";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  Object.assign(submitBtn.style, {
    padding: "5px 10px",
    cursor: "pointer",
  });

  submitBtn.onclick = () => {
    if (input.value === "10032023") {
      window.location.href = encodeURI("https://drive.google.com/file/d/1PS9BD4u9ec5WirV6dE3oME5--k_lNmID/view?usp=sharing");
    } else {
      alert("❌ Incorrect password. Try again.");
      overlay.remove();
    }
  };

  container.appendChild(label);
  container.appendChild(input);
  container.appendChild(submitBtn);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
}
