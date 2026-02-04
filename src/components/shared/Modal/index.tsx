import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalProps {
	setOpenModal: (open: boolean) => void;
	title: string;
	content: string;
	cancelBtn: string;
	deleteBtn: string;
	deleteFunction: () => void;
}

export default function Modal(props: ModalProps) {
	const handleCloseBtnChange = () => {
		props.setOpenModal(false);
	};

	return (
		<Dialog open={true} onOpenChange={handleCloseBtnChange}>
			<DialogContent className="max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-center">{props.title}</DialogTitle>
				</DialogHeader>

				<DialogDescription className="text-center text-lg py-4">
					{props.content}
				</DialogDescription>

				<DialogFooter className="flex justify-center gap-2 sm:justify-center">
					<Button variant="outline" onClick={handleCloseBtnChange}>
						{props.cancelBtn}
					</Button>
					<Button variant="destructive" onClick={() => props.deleteFunction()}>
						{props.deleteBtn}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
