import { Button } from "components/ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({
	children,
	loading = false,
	disabled,
	...props
}: React.ComponentProps<typeof Button> & { loading?: boolean }) => {
	return (
		<Button type="submit" disabled={loading || disabled} {...props}>
			{loading && <Loader2 className="size-4 animate-spin" />}
			{children}
		</Button>
	);
};
