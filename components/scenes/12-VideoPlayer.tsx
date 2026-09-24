"use client";

import { SceneTransition } from "../shared/SceneTransition";

export function VideoPlayer({ onClose }: { onClose: () => void }) {
  return (
    <SceneTransition>
      <div className="relative w-full max-w-md">
        <video
          src="/assets/video-sorpresa.mp4"
          playsInline
          controls
          autoPlay
          data-testid="surprise-video"
          className="w-full rounded-2xl border-2 border-amber-400/60 bg-black"
        />
      </div>
      <button
        type="button"
        onClick={onClose}
        data-testid="video-close"
        className="min-h-[52px] min-w-[160px] rounded-full border-2 border-amber-300 px-6 py-2 font-bold text-amber-200"
      >
        ✕ Cerrar
      </button>
    </SceneTransition>
  );
}
