/**
 * Batch Upload Service - Multi-file upload with progress tracking
 * 
 * Handles concurrent uploads with progress bars, retry logic,
 * and batch operations for efficient image management.
 */

import { validateImage, createThumbnail, fileToBase64 } from "./image.service";
import type { UploadedImage, ImageValidationOptions } from "./image.service";

export type UploadStatus = "pending" | "uploading" | "processing" | "complete" | "error" | "cancelled";

export interface BatchUploadItem {
	id: string;
	file: File;
	status: UploadStatus;
	progress: number;
	result?: UploadedImage;
	error?: string;
	retryCount: number;
	startedAt?: string;
	completedAt?: string;
}

export interface BatchUploadProgress {
	totalFiles: number;
	completedFiles: number;
	failedFiles: number;
	totalBytes: number;
	uploadedBytes: number;
	overallProgress: number;
	currentFile?: string;
	estimatedTimeRemaining?: number;
}

export interface BatchUploadOptions extends ImageValidationOptions {
	maxConcurrent?: number;
	maxRetries?: number;
	retryDelay?: number;
	onProgress?: (progress: BatchUploadProgress) => void;
	onFileComplete?: (item: BatchUploadItem) => void;
	onFileError?: (item: BatchUploadItem) => void;
}

type ProgressListener = (progress: BatchUploadProgress) => void;
type CompleteListener = (results: BatchUploadItem[]) => void;

const generateId = (): string =>
	`upload_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export class BatchUploadService {
	private queue: BatchUploadItem[] = [];
	private activeUploads = 0;
	private isCancelled = false;
	private startTime: number = 0;
	private uploadedBytes = 0;

	private progressListeners = new Set<ProgressListener>();
	private completeListeners = new Set<CompleteListener>();

	private maxConcurrent: number;
	private maxRetries: number;
	private retryDelay: number;
	private validationOptions: ImageValidationOptions;

	constructor(options: BatchUploadOptions = {}) {
		this.maxConcurrent = options.maxConcurrent ?? 3;
		this.maxRetries = options.maxRetries ?? 2;
		this.retryDelay = options.retryDelay ?? 1000;
		this.validationOptions = {
			maxSizeBytes: options.maxSizeBytes,
			allowedTypes: options.allowedTypes,
			minWidth: options.minWidth,
			minHeight: options.minHeight,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
		};
	}

	/**
	 * Add files to the upload queue
	 */
	addFiles(files: File[]): BatchUploadItem[] {
		const items: BatchUploadItem[] = files.map((file) => ({
			id: generateId(),
			file,
			status: "pending" as UploadStatus,
			progress: 0,
			retryCount: 0,
		}));

		this.queue.push(...items);
		return items;
	}

	/**
	 * Start processing the upload queue
	 */
	async start(): Promise<BatchUploadItem[]> {
		if (this.queue.length === 0) return [];

		this.isCancelled = false;
		this.startTime = Date.now();
		this.uploadedBytes = 0;

		// Process queue with concurrency limit
		const processNext = async (): Promise<void> => {
			if (this.isCancelled) return;

			const pending = this.queue.find((item) => item.status === "pending");
			if (!pending) return;

			this.activeUploads++;
			pending.status = "uploading";
			pending.startedAt = new Date().toISOString();

			try {
				await this.processItem(pending);
			} catch (error) {
				if (pending.retryCount < this.maxRetries) {
					pending.retryCount++;
					pending.status = "pending";
					await this.delay(this.retryDelay * pending.retryCount);
				} else {
					pending.status = "error";
					pending.error = error instanceof Error ? error.message : "Upload failed";
					pending.completedAt = new Date().toISOString();
					this.notifyFileError(pending);
				}
			}

			this.activeUploads--;
			this.notifyProgress();

			// Continue processing
			if (!this.isCancelled && this.hasUnfinished()) {
				await processNext();
			}
		};

		// Start concurrent uploads
		const workers = Array.from(
			{ length: Math.min(this.maxConcurrent, this.queue.length) },
			() => processNext()
		);

		await Promise.all(workers);

		// Wait for any remaining active uploads
		while (this.activeUploads > 0) {
			await this.delay(100);
		}

		this.notifyComplete();
		return this.queue;
	}

	/**
	 * Process a single upload item
	 */
	private async processItem(item: BatchUploadItem): Promise<void> {
		// Validate the image
		const validation = await validateImage(item.file, this.validationOptions);
		if (!validation.valid) {
			throw new Error(validation.errors.join("; "));
		}

		item.progress = 10;
		this.notifyProgress();

		// Simulate progress for file reading
		item.status = "processing";
		
		// Read file as base64
		const base64 = await this.readFileWithProgress(item);
		item.progress = 60;
		this.notifyProgress();

		// Get dimensions
		const dimensions = await this.getImageDimensions(item.file);
		item.progress = 70;
		this.notifyProgress();

		// Create thumbnail
		const thumbnail = await createThumbnail(item.file);
		item.progress = 90;
		this.notifyProgress();

		// Create result
		item.result = {
			id: generateId(),
			url: base64,
			thumbnailUrl: thumbnail,
			filename: this.sanitizeFilename(item.file.name),
			originalFilename: item.file.name,
			mimeType: item.file.type,
			size: item.file.size,
			width: dimensions.width,
			height: dimensions.height,
			uploadedAt: new Date().toISOString(),
		};

		item.status = "complete";
		item.progress = 100;
		item.completedAt = new Date().toISOString();
		this.uploadedBytes += item.file.size;

		this.notifyFileComplete(item);
		this.notifyProgress();
	}

	/**
	 * Read file with simulated progress
	 */
	private async readFileWithProgress(item: BatchUploadItem): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			
			reader.onprogress = (event) => {
				if (event.lengthComputable) {
					const fileProgress = (event.loaded / event.total) * 50;
					item.progress = 10 + fileProgress;
					this.notifyProgress();
				}
			};

			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.readAsDataURL(item.file);
		});
	}

	/**
	 * Get image dimensions
	 */
	private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const objectUrl = URL.createObjectURL(file);

			img.onload = () => {
				URL.revokeObjectURL(objectUrl);
				resolve({ width: img.naturalWidth, height: img.naturalHeight });
			};

			img.onerror = () => {
				URL.revokeObjectURL(objectUrl);
				reject(new Error("Failed to load image"));
			};

			img.src = objectUrl;
		});
	}

	/**
	 * Sanitize filename
	 */
	private sanitizeFilename(filename: string): string {
		return filename
			.replace(/[^a-zA-Z0-9._-]/g, "_")
			.replace(/_{2,}/g, "_")
			.toLowerCase();
	}

	/**
	 * Cancel all uploads
	 */
	cancel(): void {
		this.isCancelled = true;
		
		for (const item of this.queue) {
			if (item.status === "pending" || item.status === "uploading") {
				item.status = "cancelled";
			}
		}
		
		this.notifyProgress();
	}

	/**
	 * Retry failed uploads
	 */
	async retryFailed(): Promise<BatchUploadItem[]> {
		for (const item of this.queue) {
			if (item.status === "error" || item.status === "cancelled") {
				item.status = "pending";
				item.progress = 0;
				item.error = undefined;
				item.retryCount = 0;
			}
		}

		return this.start();
	}

	/**
	 * Remove an item from the queue
	 */
	removeItem(itemId: string): boolean {
		const index = this.queue.findIndex((item) => item.id === itemId);
		if (index === -1) return false;

		const item = this.queue[index];
		if (item.status === "uploading") {
			item.status = "cancelled";
		}

		this.queue.splice(index, 1);
		this.notifyProgress();
		return true;
	}

	/**
	 * Clear completed uploads
	 */
	clearCompleted(): void {
		this.queue = this.queue.filter((item) => item.status !== "complete");
		this.notifyProgress();
	}

	/**
	 * Clear all uploads
	 */
	clearAll(): void {
		this.cancel();
		this.queue = [];
		this.notifyProgress();
	}

	/**
	 * Get current queue
	 */
	getQueue(): BatchUploadItem[] {
		return [...this.queue];
	}

	/**
	 * Get upload progress
	 */
	getProgress(): BatchUploadProgress {
		const completed = this.queue.filter((i) => i.status === "complete").length;
		const failed = this.queue.filter((i) => i.status === "error").length;
		const totalBytes = this.queue.reduce((sum, i) => sum + i.file.size, 0);
		const currentFile = this.queue.find((i) => i.status === "uploading")?.file.name;

		let estimatedTimeRemaining: number | undefined;
		if (this.uploadedBytes > 0 && this.startTime) {
			const elapsed = Date.now() - this.startTime;
			const bytesPerMs = this.uploadedBytes / elapsed;
			const remainingBytes = totalBytes - this.uploadedBytes;
			estimatedTimeRemaining = Math.ceil(remainingBytes / bytesPerMs / 1000);
		}

		return {
			totalFiles: this.queue.length,
			completedFiles: completed,
			failedFiles: failed,
			totalBytes,
			uploadedBytes: this.uploadedBytes,
			overallProgress: this.queue.length > 0
				? Math.round((completed / this.queue.length) * 100)
				: 0,
			currentFile,
			estimatedTimeRemaining,
		};
	}

	/**
	 * Get successful results
	 */
	getResults(): UploadedImage[] {
		return this.queue
			.filter((item) => item.status === "complete" && item.result)
			.map((item) => item.result!);
	}

	/**
	 * Check if there are unfinished items
	 */
	private hasUnfinished(): boolean {
		return this.queue.some(
			(item) => item.status === "pending" || item.status === "uploading"
		);
	}

	/**
	 * Delay helper
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Event handling
	private notifyProgress(): void {
		const progress = this.getProgress();
		for (const listener of this.progressListeners) {
			listener(progress);
		}
	}

	private notifyFileComplete(item: BatchUploadItem): void {
		// Custom file complete handling can be added here
	}

	private notifyFileError(item: BatchUploadItem): void {
		// Custom file error handling can be added here
	}

	private notifyComplete(): void {
		const results = this.queue;
		for (const listener of this.completeListeners) {
			listener(results);
		}
	}

	/**
	 * Subscribe to progress updates
	 */
	onProgress(listener: ProgressListener): () => void {
		this.progressListeners.add(listener);
		return () => this.progressListeners.delete(listener);
	}

	/**
	 * Subscribe to complete event
	 */
	onComplete(listener: CompleteListener): () => void {
		this.completeListeners.add(listener);
		return () => this.completeListeners.delete(listener);
	}
}

/**
 * Create a drag and drop upload zone
 */
export const createDropZone = (
	element: HTMLElement,
	onDrop: (files: File[]) => void,
	options?: {
		acceptedTypes?: string[];
		multiple?: boolean;
		hoverClass?: string;
	}
): () => void => {
	const acceptedTypes = options?.acceptedTypes ?? ["image/*"];
	const hoverClass = options?.hoverClass ?? "drop-zone-active";

	const handleDragOver = (e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		element.classList.add(hoverClass);
	};

	const handleDragLeave = (e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		element.classList.remove(hoverClass);
	};

	const handleDrop = (e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		element.classList.remove(hoverClass);

		const files = Array.from(e.dataTransfer?.files ?? []).filter((file) =>
			acceptedTypes.some((type) => {
				if (type.endsWith("/*")) {
					return file.type.startsWith(type.replace("/*", ""));
				}
				return file.type === type;
			})
		);

		if (files.length > 0) {
			onDrop(options?.multiple === false ? [files[0]] : files);
		}
	};

	element.addEventListener("dragover", handleDragOver);
	element.addEventListener("dragleave", handleDragLeave);
	element.addEventListener("drop", handleDrop);

	// Return cleanup function
	return () => {
		element.removeEventListener("dragover", handleDragOver);
		element.removeEventListener("dragleave", handleDragLeave);
		element.removeEventListener("drop", handleDrop);
	};
};

export const batchUploadService = new BatchUploadService();
