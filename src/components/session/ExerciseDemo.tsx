'use client';

interface Props {
  name: string;
  muscleGroup: string;
  description: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
}

export function ExerciseDemo({ name, muscleGroup, description, mediaUrl, mediaType }: Props) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden">
      {mediaUrl ? (
        mediaType === 'video' ? (
          <video
            src={mediaUrl}
            controls
            playsInline
            muted
            loop
            className="aspect-video w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl} alt={`${name} demonstration`} className="aspect-video w-full object-cover" />
        )
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-zinc-800">
          <span className="text-4xl">🏋️</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold">{name}</h3>
        <p className="mt-0.5 text-xs uppercase tracking-wider text-zinc-500">{muscleGroup}</p>
        {description && <p className="mt-2 text-sm text-zinc-400">{description}</p>}
      </div>
    </div>
  );
}
