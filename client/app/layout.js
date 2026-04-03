import "./globals.css";

export const metadata = {
  title: "Event Requirement Form",
  description: "Submit your event requirements across a guided multi-step form.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
