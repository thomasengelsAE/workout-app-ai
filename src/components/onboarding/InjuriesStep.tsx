'use client';

import { useState } from 'react';

interface Props {
  injuries: string[];
  onChange: (injuries: string[]) => void;
}

export function InjuriesStep({ injuries, onChange }: Props) {
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...injuries, trimmed]);
    setInput('');
  };

  const remove = (index: number) => {
    onChange(injuries.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Any injuries?</h2>
        <p className="mt-1 text-zinc-400">
          We'll adapt your program to work around them. You can skip this step if you're injury-free.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="e.g. left shoulder injury"
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:bg-indigo-700"
        >
          Add
        </button>
      </div>

      {injuries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {injuries.map((injury, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            >
              <span className="text-sm">{injury}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="ml-2 text-zinc-400 hover:text-red-400"
                aria-label="Remove injury"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {injuries.length === 0 && (
        <p className="text-center text-sm text-zinc-500">No injuries logged — great!</p>
      )}
    </div>
  );
}
