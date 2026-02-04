import { Spinner } from "@/components/ui/spinner";

export default function Loader() {
	return (
		<main className="flex w-full bg-white h-[calc(100vh-300px)] items-center justify-center gap-4 flex-col">
			<Spinner size="lg" />
		</main>
	);
}
