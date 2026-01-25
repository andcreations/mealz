import { useCallback, useEffect, useRef, useState } from 'react';

export type FacingMode = 'user' | 'environment';

export interface UseCameraOptions {
  facingMode?: FacingMode;
  widthIdeal?: number;
  heightIdeal?: number;
  onReady?: () => void;
}

export function useCamera(options: UseCameraOptions = {}) {
  const {
    facingMode = 'environment',
    widthIdeal = 1280,
    heightIdeal = 720,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const waitForVideoReady = useCallback(
    (video: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        if (video.readyState >= 1 && video.videoWidth > 0) {
          resolve();
        } else {
          const handler = () => {
            video.removeEventListener('loadedmetadata', handler);
            resolve();
          };
          video.addEventListener('loadedmetadata', handler, { once: true });
        }
      }),
    [],
  );

  const start = useCallback(
    async () => {
      setError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode,
            width: { ideal: widthIdeal },
            height: { ideal: heightIdeal },
          },
        });
        streamRef.current = stream;

        if (!videoRef.current) {
          throw new Error('Video element not mounted yet.');
        }
        videoRef.current.srcObject = stream;

        // iOS Safari likes an explicit play()
        await videoRef.current.play();

        // wait for video to be ready
        await waitForVideoReady(videoRef.current);
        setIsActive(true);

        // notify that the video is ready
        options.onReady?.();
      } catch (error: any) {
        setIsActive(false);
        setError(error?.message ?? 'Failed to start camera');
      }
    },
    [facingMode, widthIdeal, heightIdeal],
  );

  const stop = useCallback(
    () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsActive(false);
    },
    [],
  );

  // Capture current frame to a File
  const takePhoto = useCallback(
    async (
      opts: {
        type?: 'image/jpeg' | 'image/png';
        quality?: number; // only for jpeg/webp
        fileName?: string;
      } = {},
    ) => {
      const video = videoRef.current;
      if (!video) {
        throw new Error('Video not ready');
      }
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        throw new Error('Video has no data yet');
      }

      const type = opts.type ?? 'image/jpeg';
      const quality = opts.quality ?? 0.92;
      const fileName =
        opts.fileName ?? `photo_${new Date().toISOString().replace(/[:.]/g, '-')}.${type === 'image/png' ? 'png' : 'jpg'}`;

      // use actual video dimensions for best quality
      const width = video.videoWidth;
      const height = video.videoHeight;

      // create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // draw image to canvas
      const ctx2d = canvas.getContext('2d');
      if (!ctx2d) {
        throw new Error('No 2D canvas context');
      }
      ctx2d.drawImage(video, 0, 0, width, height);

      // create blob
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => (blob
            ? resolve(blob)
            : reject(new Error('Failed to create image blob'))
          ),
          type,
          type === 'image/jpeg' ? quality : undefined,
        );
      });

      return new File([blob], fileName, { type });
    },
    [],
  );

  useEffect(
    () => {
      // cleanup on unmount
      return () => stop();
    },
    [stop],
  );

  return { videoRef, start, stop, takePhoto, isActive, error };
}
