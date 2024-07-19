// src/components/install-prompt-button.tsx

"use client";

import { useEffect, useState } from "react";
import InstallPromptDialog from "./install-prompt-dialog";

export default function InstallPromptButton() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      // Empêcher l'affichage automatique de la bannière
      event.preventDefault();
      // Stocker l'événement pour pouvoir l'utiliser plus tard
      window.deferredPrompt = event;

      // Afficher la boîte de dialogue personnalisée
      setShowDialog(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleAccept = async () => {
    // Afficher la bannière d'installation
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    // Réinitialiser l'événement
    window.deferredPrompt = null;
    setShowDialog(false);
  };

  const handleDecline = () => {
    console.log("User declined the install prompt");
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && (
        <InstallPromptDialog
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </>
  );
}