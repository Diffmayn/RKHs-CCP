/**
 * Image Annotation Service - Draw on images to mark required edits
 * 
 * Provides tools for annotating images with shapes, text, arrows,
 * and highlighting areas for retouching or other modifications.
 */

export type AnnotationType = "arrow" | "rectangle" | "circle" | "freehand" | "text" | "highlight" | "blur" | "crop";

export interface Point {
	x: number;
	y: number;
}

export interface Annotation {
	id: string;
	type: AnnotationType;
	color: string;
	strokeWidth: number;
	opacity: number;
	points: Point[];
	text?: string;
	fontSize?: number;
	createdBy: string;
	createdAt: string;
	metadata?: Record<string, unknown>;
}

export interface AnnotationLayer {
	imageId: string;
	imageUrl: string;
	width: number;
	height: number;
	annotations: Annotation[];
	createdAt: string;
	updatedAt: string;
}

export interface AnnotationToolConfig {
	type: AnnotationType;
	color: string;
	strokeWidth: number;
	opacity: number;
	fontSize?: number;
}

const generateId = (): string =>
	`ann_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const DEFAULT_COLORS = [
	"#ef4444", // Red
	"#f97316", // Orange
	"#eab308", // Yellow
	"#22c55e", // Green
	"#3b82f6", // Blue
	"#8b5cf6", // Purple
	"#000000", // Black
	"#ffffff", // White
];

export class ImageAnnotationService {
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private overlayCanvas: HTMLCanvasElement | null = null;
	private overlayCtx: CanvasRenderingContext2D | null = null;
	
	private currentLayer: AnnotationLayer | null = null;
	private currentTool: AnnotationToolConfig = {
		type: "arrow",
		color: "#ef4444",
		strokeWidth: 3,
		opacity: 1,
	};
	
	private isDrawing = false;
	private currentPoints: Point[] = [];
	private history: Annotation[][] = [];
	private historyIndex = -1;
	private userId = "";

	private listeners = new Set<(layer: AnnotationLayer) => void>();

	/**
	 * Initialize the annotation canvas
	 */
	initialize(
		container: HTMLElement,
		imageUrl: string,
		imageId: string,
		userId: string
	): Promise<void> {
		this.userId = userId;

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";

			img.onload = () => {
				// Clear container
				container.innerHTML = "";
				container.style.position = "relative";

				// Create main canvas for image
				this.canvas = document.createElement("canvas");
				this.canvas.width = img.naturalWidth;
				this.canvas.height = img.naturalHeight;
				this.canvas.style.cssText = "position: absolute; top: 0; left: 0; max-width: 100%; height: auto;";
				
				this.ctx = this.canvas.getContext("2d");
				if (this.ctx) {
					this.ctx.drawImage(img, 0, 0);
				}

				// Create overlay canvas for annotations
				this.overlayCanvas = document.createElement("canvas");
				this.overlayCanvas.width = img.naturalWidth;
				this.overlayCanvas.height = img.naturalHeight;
				this.overlayCanvas.style.cssText = "position: absolute; top: 0; left: 0; max-width: 100%; height: auto; cursor: crosshair;";
				
				this.overlayCtx = this.overlayCanvas.getContext("2d");

				container.appendChild(this.canvas);
				container.appendChild(this.overlayCanvas);

				// Initialize layer
				this.currentLayer = {
					imageId,
					imageUrl,
					width: img.naturalWidth,
					height: img.naturalHeight,
					annotations: [],
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				// Setup event listeners
				this.setupEventListeners();

				resolve();
			};

			img.onerror = () => reject(new Error("Failed to load image"));
			img.src = imageUrl;
		});
	}

	/**
	 * Setup mouse/touch event listeners
	 */
	private setupEventListeners(): void {
		if (!this.overlayCanvas) return;

		const getPoint = (e: MouseEvent | TouchEvent): Point => {
			const rect = this.overlayCanvas!.getBoundingClientRect();
			const scaleX = this.overlayCanvas!.width / rect.width;
			const scaleY = this.overlayCanvas!.height / rect.height;

			if (e instanceof MouseEvent) {
				return {
					x: (e.clientX - rect.left) * scaleX,
					y: (e.clientY - rect.top) * scaleY,
				};
			} else {
				const touch = e.touches[0];
				return {
					x: (touch.clientX - rect.left) * scaleX,
					y: (touch.clientY - rect.top) * scaleY,
				};
			}
		};

		const handleStart = (e: MouseEvent | TouchEvent): void => {
			e.preventDefault();
			this.isDrawing = true;
			this.currentPoints = [getPoint(e)];
		};

		const handleMove = (e: MouseEvent | TouchEvent): void => {
			if (!this.isDrawing) return;
			e.preventDefault();

			const point = getPoint(e);
			this.currentPoints.push(point);
			this.drawPreview();
		};

		const handleEnd = (): void => {
			if (!this.isDrawing) return;
			this.isDrawing = false;

			if (this.currentPoints.length > 1) {
				this.commitAnnotation();
			}
			this.currentPoints = [];
		};

		this.overlayCanvas.addEventListener("mousedown", handleStart);
		this.overlayCanvas.addEventListener("mousemove", handleMove);
		this.overlayCanvas.addEventListener("mouseup", handleEnd);
		this.overlayCanvas.addEventListener("mouseleave", handleEnd);

		this.overlayCanvas.addEventListener("touchstart", handleStart, { passive: false });
		this.overlayCanvas.addEventListener("touchmove", handleMove, { passive: false });
		this.overlayCanvas.addEventListener("touchend", handleEnd);
	}

	/**
	 * Draw preview while drawing
	 */
	private drawPreview(): void {
		if (!this.overlayCtx || this.currentPoints.length < 1) return;

		// Clear and redraw existing annotations + preview
		this.redrawAnnotations();
		
		// Draw current annotation preview
		this.drawAnnotationShape(this.overlayCtx, {
			id: "preview",
			type: this.currentTool.type,
			color: this.currentTool.color,
			strokeWidth: this.currentTool.strokeWidth,
			opacity: this.currentTool.opacity * 0.7,
			points: this.currentPoints,
			createdBy: this.userId,
			createdAt: new Date().toISOString(),
		});
	}

	/**
	 * Commit current drawing as annotation
	 */
	private commitAnnotation(): void {
		if (!this.currentLayer || this.currentPoints.length < 2) return;

		const annotation: Annotation = {
			id: generateId(),
			type: this.currentTool.type,
			color: this.currentTool.color,
			strokeWidth: this.currentTool.strokeWidth,
			opacity: this.currentTool.opacity,
			points: [...this.currentPoints],
			fontSize: this.currentTool.fontSize,
			createdBy: this.userId,
			createdAt: new Date().toISOString(),
		};

		// Add to layer
		this.currentLayer.annotations.push(annotation);
		this.currentLayer.updatedAt = new Date().toISOString();

		// Update history
		this.historyIndex++;
		this.history = this.history.slice(0, this.historyIndex);
		this.history.push([...this.currentLayer.annotations]);

		this.redrawAnnotations();
		this.notifyListeners();
	}

	/**
	 * Draw a single annotation shape
	 */
	private drawAnnotationShape(ctx: CanvasRenderingContext2D, annotation: Annotation): void {
		const { type, color, strokeWidth, opacity, points } = annotation;
		
		ctx.save();
		ctx.globalAlpha = opacity;
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = strokeWidth;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		switch (type) {
			case "freehand":
				this.drawFreehand(ctx, points);
				break;
			case "arrow":
				this.drawArrow(ctx, points);
				break;
			case "rectangle":
				this.drawRectangle(ctx, points);
				break;
			case "circle":
				this.drawCircle(ctx, points);
				break;
			case "highlight":
				this.drawHighlight(ctx, points, color);
				break;
			case "text":
				this.drawText(ctx, points, annotation.text ?? "", annotation.fontSize ?? 16, color);
				break;
		}

		ctx.restore();
	}

	private drawFreehand(ctx: CanvasRenderingContext2D, points: Point[]): void {
		if (points.length < 2) return;
		
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		
		ctx.stroke();
	}

	private drawArrow(ctx: CanvasRenderingContext2D, points: Point[]): void {
		if (points.length < 2) return;

		const start = points[0];
		const end = points[points.length - 1];

		// Draw line
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();

		// Draw arrowhead
		const angle = Math.atan2(end.y - start.y, end.x - start.x);
		const headLength = 15 + ctx.lineWidth * 2;

		ctx.beginPath();
		ctx.moveTo(end.x, end.y);
		ctx.lineTo(
			end.x - headLength * Math.cos(angle - Math.PI / 6),
			end.y - headLength * Math.sin(angle - Math.PI / 6)
		);
		ctx.lineTo(
			end.x - headLength * Math.cos(angle + Math.PI / 6),
			end.y - headLength * Math.sin(angle + Math.PI / 6)
		);
		ctx.closePath();
		ctx.fill();
	}

	private drawRectangle(ctx: CanvasRenderingContext2D, points: Point[]): void {
		if (points.length < 2) return;

		const start = points[0];
		const end = points[points.length - 1];
		const width = end.x - start.x;
		const height = end.y - start.y;

		ctx.strokeRect(start.x, start.y, width, height);
	}

	private drawCircle(ctx: CanvasRenderingContext2D, points: Point[]): void {
		if (points.length < 2) return;

		const start = points[0];
		const end = points[points.length - 1];
		const radius = Math.sqrt(
			Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
		);

		ctx.beginPath();
		ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
		ctx.stroke();
	}

	private drawHighlight(ctx: CanvasRenderingContext2D, points: Point[], color: string): void {
		if (points.length < 2) return;

		const start = points[0];
		const end = points[points.length - 1];

		ctx.globalAlpha = 0.3;
		ctx.fillStyle = color;
		ctx.fillRect(
			start.x,
			start.y,
			end.x - start.x,
			end.y - start.y
		);
	}

	private drawText(
		ctx: CanvasRenderingContext2D,
		points: Point[],
		text: string,
		fontSize: number,
		color: string
	): void {
		if (points.length < 1 || !text) return;

		ctx.font = `${fontSize}px Arial, sans-serif`;
		ctx.fillStyle = color;
		ctx.fillText(text, points[0].x, points[0].y);
	}

	/**
	 * Redraw all annotations
	 */
	private redrawAnnotations(): void {
		if (!this.overlayCtx || !this.overlayCanvas || !this.currentLayer) return;

		this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);

		for (const annotation of this.currentLayer.annotations) {
			this.drawAnnotationShape(this.overlayCtx, annotation);
		}
	}

	// Public API

	/**
	 * Set the current tool
	 */
	setTool(config: Partial<AnnotationToolConfig>): void {
		this.currentTool = { ...this.currentTool, ...config };
	}

	/**
	 * Get current tool config
	 */
	getTool(): AnnotationToolConfig {
		return { ...this.currentTool };
	}

	/**
	 * Get available colors
	 */
	getColors(): string[] {
		return DEFAULT_COLORS;
	}

	/**
	 * Add text annotation
	 */
	addTextAnnotation(text: string, position: Point): void {
		if (!this.currentLayer) return;

		const annotation: Annotation = {
			id: generateId(),
			type: "text",
			color: this.currentTool.color,
			strokeWidth: this.currentTool.strokeWidth,
			opacity: this.currentTool.opacity,
			points: [position],
			text,
			fontSize: this.currentTool.fontSize ?? 16,
			createdBy: this.userId,
			createdAt: new Date().toISOString(),
		};

		this.currentLayer.annotations.push(annotation);
		this.redrawAnnotations();
		this.notifyListeners();
	}

	/**
	 * Remove an annotation
	 */
	removeAnnotation(annotationId: string): boolean {
		if (!this.currentLayer) return false;

		const index = this.currentLayer.annotations.findIndex((a) => a.id === annotationId);
		if (index === -1) return false;

		this.currentLayer.annotations.splice(index, 1);
		this.redrawAnnotations();
		this.notifyListeners();
		return true;
	}

	/**
	 * Clear all annotations
	 */
	clearAnnotations(): void {
		if (!this.currentLayer) return;

		this.currentLayer.annotations = [];
		this.redrawAnnotations();
		this.notifyListeners();
	}

	/**
	 * Undo last annotation
	 */
	undo(): boolean {
		if (this.historyIndex < 0 || !this.currentLayer) return false;

		this.historyIndex--;
		this.currentLayer.annotations = this.historyIndex >= 0
			? [...this.history[this.historyIndex]]
			: [];

		this.redrawAnnotations();
		this.notifyListeners();
		return true;
	}

	/**
	 * Redo annotation
	 */
	redo(): boolean {
		if (this.historyIndex >= this.history.length - 1 || !this.currentLayer) return false;

		this.historyIndex++;
		this.currentLayer.annotations = [...this.history[this.historyIndex]];

		this.redrawAnnotations();
		this.notifyListeners();
		return true;
	}

	/**
	 * Get current layer
	 */
	getLayer(): AnnotationLayer | null {
		return this.currentLayer;
	}

	/**
	 * Export annotated image
	 */
	exportImage(format: "png" | "jpeg" = "png", quality = 0.92): string {
		if (!this.canvas || !this.overlayCanvas) return "";

		// Create combined canvas
		const combined = document.createElement("canvas");
		combined.width = this.canvas.width;
		combined.height = this.canvas.height;
		
		const ctx = combined.getContext("2d");
		if (!ctx) return "";

		// Draw original image
		ctx.drawImage(this.canvas, 0, 0);
		
		// Draw annotations on top
		ctx.drawImage(this.overlayCanvas, 0, 0);

		return combined.toDataURL(`image/${format}`, quality);
	}

	/**
	 * Export annotations as JSON
	 */
	exportAnnotations(): string {
		return JSON.stringify(this.currentLayer?.annotations ?? [], null, 2);
	}

	/**
	 * Import annotations from JSON
	 */
	importAnnotations(json: string): boolean {
		if (!this.currentLayer) return false;

		try {
			const annotations = JSON.parse(json) as Annotation[];
			this.currentLayer.annotations = annotations;
			this.redrawAnnotations();
			this.notifyListeners();
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Subscribe to changes
	 */
	onChange(listener: (layer: AnnotationLayer) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private notifyListeners(): void {
		if (this.currentLayer) {
			for (const listener of this.listeners) {
				listener(this.currentLayer);
			}
		}
	}

	/**
	 * Cleanup
	 */
	destroy(): void {
		this.canvas = null;
		this.ctx = null;
		this.overlayCanvas = null;
		this.overlayCtx = null;
		this.currentLayer = null;
		this.listeners.clear();
	}
}

export const imageAnnotationService = new ImageAnnotationService();
