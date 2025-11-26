import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "PersonalHub - Your Personal Management Solution",
  description: "Organize your life, boost productivity, and stay connected with PersonalHub",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navigation />
        {children}
        <Footer />
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
