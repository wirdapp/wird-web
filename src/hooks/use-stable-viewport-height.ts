import { useEffect, useState } from "react";

/**
 * Captures viewport height once on mount, before any virtual keyboard interaction.
 * Returns a stable pixel value that won't change when the keyboard opens/closes.
 */
export function useStableViewportHeight(): number | null {
	const [height, setHeight] = useState<number | null>(null);

	useEffect(() => {
		setHeight(window.visualViewport?.height ?? window.innerHeight);
	}, []);

	return height;
}
