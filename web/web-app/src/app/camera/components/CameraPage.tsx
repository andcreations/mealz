import * as React from 'react';
import { useState } from 'react';
import { useCamera } from '../hooks/useCamera';

export function CameraPage() {
  const { videoRef, start, stop, takePhoto, isActive, error } = useCamera({
    facingMode: "environment",
  });

  const [lastPhotoUrl, setLastPhotoUrl] = useState<string | null>(null);

  const captureAndUpload = async () => {
    const file = await takePhoto({ type: "image/jpeg", quality: 0.9 });

    // optional preview:
    const url = URL.createObjectURL(file);
    setLastPhotoUrl(url);

    // send to backend:
    const form = new FormData();
    form.append("photo", file);

    await fetch("/api/upload", { method: "POST", body: form });
  };

  return (
    <div>
      {/* <CameraWithPicker/> */}

      {/* Put preview wherever you want */}
      <div style={{ borderRadius: 12, overflow: "hidden" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {!isActive ? (
          <button onClick={start}>Start camera</button>
        ) : (
          <>
            <button onClick={captureAndUpload}>Take photo</button>
            <button onClick={stop}>Stop</button>
          </>
        )}
      </div>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
      {lastPhotoUrl && (
        <img src={lastPhotoUrl} alt="Last capture" style={{ width: "100%", borderRadius: 12 }} />
      )}
    </div>
  );
}