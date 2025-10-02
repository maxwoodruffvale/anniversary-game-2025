// caesarCipherMinigame.js

const CAESAR_MESSAGE = `
Hint: Caesar cipher.
Op Josvl! Nvvk qvi mpnbypun aopz vba! Aopz vul dhz wylaaf avbno. 
P’t uva zbyl ovd mhy fvb hyl pu aol nhtl iba P ovwl fvb hyl ohcpun h ylhssf mbu aptl. 
Aopz dhz zbwly kbwly mbu av thrl, lzwljphssf jvuzpklypun pa pucvsclk h sva vm aopurpun 
aivba fvb. P tpzz fvb h sva aopz dllr, lzwljphssf dpao jshzzlz zahyapun huk lclyfaopun. 

Hufdhfz, olyl pz aol ulea jsbl: aol vykly vm ubtilyz pz yvjrla slhnbl, tvbzl mhytpun, 
ltvqpz, dvyk zlhyjo
`;

export function handleCaesarCipherMinigame() {
  if (document.getElementById("caesarOverlay")) return;

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "caesarOverlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  });

  // Message box
  const box = document.createElement("div");
  Object.assign(box.style, {
    background: "#fff",
    padding: "20px",
    maxWidth: "600px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    fontSize: "16px",
    lineHeight: "1.4",
    position: "relative",
  });
  box.innerText = CAESAR_MESSAGE.trim();

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: "14px",
  });
  closeBtn.onclick = () => document.body.removeChild(overlay);
  box.appendChild(closeBtn);

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}
