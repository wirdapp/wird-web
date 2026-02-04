import { File, Upload, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
	value?: File | null;
	onChange?: (file: File | null) => void;
	accept?: string;
	maxSize?: number;
	disabled?: boolean;
	className?: string;
	placeholder?: string;
	error?: string;
}

export function FileUpload({
	value,
	onChange,
	accept,
	maxSize,
	disabled = false,
	className,
	placeholder = "Click to upload or drag and drop",
	error,
}: FileUploadProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);
	const [localError, setLocalError] = React.useState<string | null>(null);

	const handleFileChange = (file: File | null) => {
		if (file && maxSize && file.size > maxSize) {
			setLocalError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
			return;
		}
		setLocalError(null);
		onChange?.(file);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		handleFileChange(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (disabled) return;
		const file = e.dataTransfer.files?.[0] || null;
		handleFileChange(file);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		if (!disabled) setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleRemove = () => {
		onChange?.(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const displayError = error || localError;

	return (
		<div className={cn("w-full", className)}>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				onChange={handleInputChange}
				disabled={disabled}
				className="sr-only"
				id="file-upload"
			/>

			{!value ? (
				<label
					htmlFor="file-upload"
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={cn(
						"flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
						isDragging
							? "border-primary bg-primary/5"
							: "border-input hover:border-primary/50 hover:bg-muted/50",
						disabled && "cursor-not-allowed opacity-50",
						displayError && "border-destructive",
					)}
				>
					<div className="flex flex-col items-center justify-center py-4">
						<Upload className="h-8 w-8 mb-2 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">{placeholder}</p>
						{accept && <p className="text-xs text-muted-foreground mt-1">Accepted: {accept}</p>}
					</div>
				</label>
			) : (
				<div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
					<File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">{value.name}</p>
						<p className="text-xs text-muted-foreground">{(value.size / 1024).toFixed(1)} KB</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleRemove}
						disabled={disabled}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}

			{displayError && <p className="text-sm text-destructive mt-1">{displayError}</p>}
		</div>
	);
}

export interface ImageUploadProps extends Omit<FileUploadProps, "accept"> {
	preview?: boolean;
}

export function ImageUpload({ value, onChange, preview = true, ...props }: ImageUploadProps) {
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (value && preview) {
			const url = URL.createObjectURL(value);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}
		setPreviewUrl(null);
	}, [value, preview]);

	if (value && previewUrl && preview) {
		return (
			<div className={cn("relative w-full", props.className)}>
				<img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
				<Button
					type="button"
					variant="destructive"
					size="icon"
					className="absolute top-2 right-2 h-6 w-6"
					onClick={() => onChange?.(null)}
					disabled={props.disabled}
				>
					<X className="h-3 w-3" />
				</Button>
			</div>
		);
	}

	return <FileUpload value={value} onChange={onChange} accept="image/*" {...props} />;
}
