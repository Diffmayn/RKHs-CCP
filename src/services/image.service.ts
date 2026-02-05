/**
 * Image Service - Handles image upload, validation, and processing
 * 
 * Provides functionality for uploading, validating, resizing,
 * and managing images for photo orders.
 */

export interface ImageUploadResult {
	success: boolean;
	image?: UploadedImage;
	error?: string;
}

export interface UploadedImage {
	id: string;
	url: string;
	thumbnailUrl?: string;
	filename: string;
	originalFilename: string;
	mimeType: string;
	size: number;
	width?: number;
	height?: number;
	uploadedAt: string;
}

export interface ImageValidationOptions {
	maxSizeBytes?: number;
	allowedTypes?: string[];
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ALLOWED_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
];

const generateId = (): string =>
	`img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

const sanitizeFilename = (filename: string): string => {
	return filename
		.replace(/[^a-zA-Z0-9._-]/g, "_")
		.replace(/_{2,}/g, "_")
		.toLowerCase();
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
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
};

export const validateImage = async (
	file: File,
	options: ImageValidationOptions = {}
): Promise<{ valid: boolean; errors: string[] }> => {
	const errors: string[] = [];
	const maxSize = options.maxSizeBytes ?? DEFAULT_MAX_SIZE;
	const allowedTypes = options.allowedTypes ?? DEFAULT_ALLOWED_TYPES;

	// Check file type
	if (!allowedTypes.includes(file.type)) {
		errors.push(
			`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(", ")}`
		);
	}

	// Check file size
	if (file.size > maxSize) {
		const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
		const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
		errors.push(`File too large: ${fileSizeMB}MB. Maximum size: ${maxSizeMB}MB`);
	}

	// Check dimensions if specified
	if (
		options.minWidth ||
		options.minHeight ||
		options.maxWidth ||
		options.maxHeight
	) {
		try {
			const dimensions = await getImageDimensions(file);

			if (options.minWidth && dimensions.width < options.minWidth) {
				errors.push(`Image width (${dimensions.width}px) is below minimum (${options.minWidth}px)`);
			}

			if (options.minHeight && dimensions.height < options.minHeight) {
				errors.push(`Image height (${dimensions.height}px) is below minimum (${options.minHeight}px)`);
			}

			if (options.maxWidth && dimensions.width > options.maxWidth) {
				errors.push(`Image width (${dimensions.width}px) exceeds maximum (${options.maxWidth}px)`);
			}

			if (options.maxHeight && dimensions.height > options.maxHeight) {
				errors.push(`Image height (${dimensions.height}px) exceeds maximum (${options.maxHeight}px)`);
			}
		} catch {
			errors.push("Failed to read image dimensions");
		}
	}

	return { valid: errors.length === 0, errors };
};

export const createThumbnail = async (
	file: File,
	maxWidth = 200,
	maxHeight = 200
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(objectUrl);

			const canvas = document.createElement("canvas");
			let { naturalWidth: width, naturalHeight: height } = img;

			// Calculate new dimensions maintaining aspect ratio
			if (width > maxWidth || height > maxHeight) {
				const ratio = Math.min(maxWidth / width, maxHeight / height);
				width = Math.round(width * ratio);
				height = Math.round(height * ratio);
			}

			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Failed to get canvas context"));
				return;
			}

			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL("image/jpeg", 0.7));
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("Failed to load image for thumbnail"));
		};

		img.src = objectUrl;
	});
};

export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
};

export class ImageService {
	private readonly validationOptions: ImageValidationOptions;
	private readonly uploadedImages: Map<string, UploadedImage> = new Map();

	constructor(options: ImageValidationOptions = {}) {
		this.validationOptions = options;
	}

	async upload(file: File): Promise<ImageUploadResult> {
		// Validate the image
		const validation = await validateImage(file, this.validationOptions);
		if (!validation.valid) {
			return {
				success: false,
				error: validation.errors.join("; "),
			};
		}

		try {
			// Get dimensions
			const dimensions = await getImageDimensions(file);

			// Convert to base64 (in a real app, this would upload to a server)
			const base64 = await fileToBase64(file);
			const thumbnail = await createThumbnail(file);

			const image: UploadedImage = {
				id: generateId(),
				url: base64,
				thumbnailUrl: thumbnail,
				filename: sanitizeFilename(file.name),
				originalFilename: file.name,
				mimeType: file.type,
				size: file.size,
				width: dimensions.width,
				height: dimensions.height,
				uploadedAt: new Date().toISOString(),
			};

			this.uploadedImages.set(image.id, image);

			return { success: true, image };
		} catch (error) {
			console.error("[ImageService] Upload failed:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Upload failed",
			};
		}
	}

	async uploadMultiple(files: File[]): Promise<ImageUploadResult[]> {
		const results = await Promise.all(files.map((file) => this.upload(file)));
		return results;
	}

	getImage(id: string): UploadedImage | undefined {
		return this.uploadedImages.get(id);
	}

	deleteImage(id: string): boolean {
		return this.uploadedImages.delete(id);
	}

	getAllImages(): UploadedImage[] {
		return Array.from(this.uploadedImages.values());
	}

	clearAll(): void {
		this.uploadedImages.clear();
	}

	formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
	}
}

export const imageService = new ImageService();
