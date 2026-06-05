import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";

import App from "./App.tsx";
import "./index.css";

const publishableKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string) || "";

if (!publishableKey) {
	// Render a visible error so it's obvious why Clerk sign-in won't work.
	const root = document.getElementById("root")!;
	root.innerHTML = `
		<div style="font-family: system-ui, sans-serif; padding: 24px; max-width:780px; margin:40px auto;">
			<h1 style="color:#b91c1c;">Clerk not configured</h1>
			<p>Student sign-in requires a Clerk publishable key. Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <strong>client/.env</strong> or your environment.</p>
			<p>Example (.env):</p>
			<pre style="background:#f3f4f6;padding:12px;border-radius:6px;">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</pre>
			<p>If you already set it, restart the dev server after changing the file.</p>
		</div>
	`;
} else {
	createRoot(document.getElementById("root")!).render(
		<ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
			<App />
		</ClerkProvider>
	);
}
