export default function AIDisclosureBanner() {
  return (
    <div
      id="ai-disclosure-banner"
      style={{
        width: "100%",
        background: "#000",
        color: "#fff",
        textAlign: "center",
        padding: "10px",
        fontSize: "14px",
        position: "relative",
        zIndex: 99999
      }}
    >
      This system uses AI (Sentinel Engine) to process and analyze requests.
    </div>
  );
}
