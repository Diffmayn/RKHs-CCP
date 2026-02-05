/**
 * Comment Service - Handles order comments and notes
 * 
 * Provides functionality for adding, editing, and managing
 * comments on photo orders with support for mentions and threading.
 */

import type { AuthUser, PhotoOrder } from "../types";

export interface OrderComment {
	id: string;
	orderId: string;
	authorId: string;
	authorName: string;
	content: string;
	mentions?: string[];
	parentId?: string;
	createdAt: string;
	updatedAt?: string;
	isEdited?: boolean;
	attachments?: CommentAttachment[];
}

export interface CommentAttachment {
	id: string;
	filename: string;
	url: string;
	mimeType: string;
	size: number;
}

export interface CommentServiceOptions {
	storage?: Storage;
	maxCommentLength?: number;
	maxAttachmentSize?: number;
}

const STORAGE_KEY = "order_comments";
const DEFAULT_MAX_LENGTH = 2000;
const DEFAULT_MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB

const generateId = (): string =>
	`cmt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const extractMentions = (content: string): string[] => {
	const mentionPattern = /@([a-zA-Z0-9._-]+)/g;
	const matches = content.match(mentionPattern);
	return matches ? matches.map((m) => m.slice(1)) : [];
};

const sanitizeContent = (content: string): string => {
	return content
		.trim()
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<[^>]*on\w+\s*=/gi, "<");
};

export class CommentService {
	private readonly storage: Storage;
	private readonly maxCommentLength: number;
	private readonly maxAttachmentSize: number;
	private comments: Map<string, OrderComment[]>;

	constructor(options: CommentServiceOptions = {}) {
		this.storage = options.storage ?? (typeof window !== "undefined" ? window.localStorage : new Map() as unknown as Storage);
		this.maxCommentLength = options.maxCommentLength ?? DEFAULT_MAX_LENGTH;
		this.maxAttachmentSize = options.maxAttachmentSize ?? DEFAULT_MAX_ATTACHMENT_SIZE;
		this.comments = new Map();
		this.loadComments();
	}

	private loadComments(): void {
		try {
			const stored = this.storage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as Record<string, OrderComment[]>;
				this.comments = new Map(Object.entries(parsed));
			}
		} catch (error) {
			console.warn("[CommentService] Failed to load comments:", error);
		}
	}

	private saveComments(): void {
		try {
			const obj = Object.fromEntries(this.comments);
			this.storage.setItem(STORAGE_KEY, JSON.stringify(obj));
		} catch (error) {
			console.warn("[CommentService] Failed to save comments:", error);
		}
	}

	getComments(orderId: string): OrderComment[] {
		return this.comments.get(orderId) ?? [];
	}

	getThreadedComments(orderId: string): OrderComment[] {
		const comments = this.getComments(orderId);
		const rootComments = comments.filter((c) => !c.parentId);
		
		return rootComments.map((root) => ({
			...root,
			replies: comments.filter((c) => c.parentId === root.id),
		})) as unknown as OrderComment[];
	}

	addComment(
		orderId: string,
		content: string,
		author: AuthUser,
		parentId?: string
	): OrderComment | null {
		const sanitized = sanitizeContent(content);
		
		if (!sanitized || sanitized.length > this.maxCommentLength) {
			console.warn("[CommentService] Invalid comment content");
			return null;
		}

		const comment: OrderComment = {
			id: generateId(),
			orderId,
			authorId: author.id,
			authorName: author.name,
			content: sanitized,
			mentions: extractMentions(sanitized),
			parentId,
			createdAt: new Date().toISOString(),
		};

		const orderComments = this.comments.get(orderId) ?? [];
		orderComments.push(comment);
		this.comments.set(orderId, orderComments);
		this.saveComments();

		return comment;
	}

	editComment(
		orderId: string,
		commentId: string,
		newContent: string,
		userId: string
	): OrderComment | null {
		const orderComments = this.comments.get(orderId);
		if (!orderComments) return null;

		const index = orderComments.findIndex((c) => c.id === commentId);
		if (index === -1) return null;

		const comment = orderComments[index];
		if (comment.authorId !== userId) {
			console.warn("[CommentService] User not authorized to edit comment");
			return null;
		}

		const sanitized = sanitizeContent(newContent);
		if (!sanitized || sanitized.length > this.maxCommentLength) {
			return null;
		}

		orderComments[index] = {
			...comment,
			content: sanitized,
			mentions: extractMentions(sanitized),
			updatedAt: new Date().toISOString(),
			isEdited: true,
		};

		this.saveComments();
		return orderComments[index];
	}

	deleteComment(orderId: string, commentId: string, userId: string): boolean {
		const orderComments = this.comments.get(orderId);
		if (!orderComments) return false;

		const comment = orderComments.find((c) => c.id === commentId);
		if (!comment || comment.authorId !== userId) {
			return false;
		}

		// Also delete replies
		const filtered = orderComments.filter(
			(c) => c.id !== commentId && c.parentId !== commentId
		);
		
		this.comments.set(orderId, filtered);
		this.saveComments();
		return true;
	}

	getCommentCount(orderId: string): number {
		return this.comments.get(orderId)?.length ?? 0;
	}

	getMentionsForUser(userId: string): OrderComment[] {
		const mentions: OrderComment[] = [];
		
		for (const comments of this.comments.values()) {
			for (const comment of comments) {
				if (comment.mentions?.includes(userId)) {
					mentions.push(comment);
				}
			}
		}

		return mentions.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}

	clearOrderComments(orderId: string): void {
		this.comments.delete(orderId);
		this.saveComments();
	}
}

export const commentService = new CommentService();
