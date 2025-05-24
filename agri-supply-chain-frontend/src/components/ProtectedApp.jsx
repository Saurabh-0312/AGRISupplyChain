// ProtectedApp.jsx
import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import App from "../App";

function ProtectedApp() {
  return (
    <>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
          <SignIn redirectUrl="/" />
        </div>
      </SignedOut>
    </>
  );
}

export default ProtectedApp;
