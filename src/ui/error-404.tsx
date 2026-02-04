import { ReactComponent as WirdLogo } from "assets/icons/Shared/wirdLogo.svg";

export const Error404 = () => {
	return (
		<div className="flex min-h-[500px] h-screen flex-col items-center justify-center gap-4">
			<div className="error-page p-16 rounded-2xl shadow-[0_0_16px_rgba(100,100,100,0.1)]">
				<WirdLogo />
				<hr />
				<h2>404 Not Found</h2>
				<p>Sorry, the page you are looking for does not exist.</p>
				<a href="/dashboard">Go to Home</a>
			</div>
		</div>
	);
};
