/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            backdropBlur: {
                xs: "3px",
            },
        },
    },
    plugins: [],
};
