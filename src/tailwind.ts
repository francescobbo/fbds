const THEMES = {
  govUk: {
    ".fbds-input": {
      "@apply w-full p-1.5 h-10 border-2 border-neutral-950 rounded-none appearance-none": {},
      "@apply focus:outline focus:outline-offset-0 focus:outline-yellow-400 focus:outline-[3px] focus:shadow-[inset_0_0_0_2px]": {},
      "@apply disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-inherit": {},
    },
    ".fbds-input--error": {
      "@apply border-red-600": {},
      "@apply focus:border-neutral-950": {},
    },
    ".fbds-hint": {
      "@apply sm:text-lg/5 text-gray-600 mb-2.5": {},
    },
    ".fbds-label": {
      "@apply sm:text-lg/5 text-neutral-950 mb-1": {},
    },
    ".fbds-error": {
      "@apply sm:text-lg/5 text-red-600 font-bold mb-3.5": {},
    },
    ".fbds-form-group--error": {
      "@apply border-l-4 border-red-600 pl-4": {}
    }
  },

  uswds: {
    ".fbds-input": {
      "@apply w-full p-2 h-10 border border-zinc-600 rounded-none appearance-none text-zinc-900": {},
      "@apply focus:outline focus:outline-offset-0 focus:outline-blue-500 focus:outline-4": {},
      "@apply disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-inherit": {},
    },
    ".fbds-input--error": {
      "@apply border-red-600": {},
      "@apply focus:border-gray-300": {},
    },
    ".fbds-hint": {
      "@apply sm:text-lg/5 text-gray-600 mb-2.5": {},
    },
    ".fbds-label": {
      "@apply sm:text-lg/5 text-gray-800 mb-1": {},
    },
    ".fbds-error": {
      "@apply sm:text-lg/5 text-red-600 font-bold mb-3.5": {},
    },
    ".fbds-form-group--error": {
      "@apply border-l-4 border-red-600 pl-4": {}
    }
  }
}

export default function({ addComponents }: { addComponents: (_: Record<string, Record<string, unknown>>) => void }) {
  addComponents(THEMES.uswds);
}
