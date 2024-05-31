import scrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./app/**/*.tsx", "./components/**/*.tsx", "./contexts/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			boxShadow: {
				default: "2px 2px 0px rgba(0, 0, 0, 1)",
				"default-md": "4px 4px 0px rgba(0, 0, 0, 1)",
				"default-lg": "8px 8px 0px rgba(0, 0, 0, 1)",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		scrollbar,
	],
} satisfies Config;
