/**
 * Security Service
 * 
 * Provides enhanced security features:
 * - Password hashing with PBKDF2
 * - Session management with tokens
 * - RBAC (Role-Based Access Control) management
 * - CSRF protection
 * - Input validation and sanitization
 */

export interface HashedPassword {
	hash: string;
	salt: string;
	iterations: number;
	algorithm: string;
}

export interface Session {
	id: string;
	userId: string;
	createdAt: string;
	expiresAt: string;
	lastActivity: string;
	ipAddress?: string;
	userAgent?: string;
	isActive: boolean;
}

export interface Permission {
	id: string;
	name: string;
	description: string;
	resource: string;
	actions: ("create" | "read" | "update" | "delete" | "execute")[];
}

export interface Role {
	id: string;
	name: string;
	description: string;
	permissions: string[];
	inherits?: string[];
	isSystem: boolean;
}

export interface SecurityPolicy {
	passwordMinLength: number;
	passwordRequireUppercase: boolean;
	passwordRequireLowercase: boolean;
	passwordRequireNumber: boolean;
	passwordRequireSpecial: boolean;
	passwordMaxAge: number; // Days
	sessionTimeout: number; // Minutes
	maxActiveSessions: number;
	lockoutThreshold: number;
	lockoutDuration: number; // Minutes
	csrfEnabled: boolean;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	sanitizedValue?: string;
}

// Default security policy
const DEFAULT_POLICY: SecurityPolicy = {
	passwordMinLength: 8,
	passwordRequireUppercase: true,
	passwordRequireLowercase: true,
	passwordRequireNumber: true,
	passwordRequireSpecial: false,
	passwordMaxAge: 90,
	sessionTimeout: 30,
	maxActiveSessions: 5,
	lockoutThreshold: 5,
	lockoutDuration: 15,
	csrfEnabled: true,
};

// System roles
const SYSTEM_ROLES: Role[] = [
	{
		id: "admin",
		name: "Administrator",
		description: "Full system access",
		permissions: ["*"],
		isSystem: true,
	},
	{
		id: "marketing-manager",
		name: "Marketing Manager",
		description: "Manage orders and team",
		permissions: ["orders:*", "templates:*", "reports:read", "users:read"],
		isSystem: true,
	},
	{
		id: "promo-coordinator",
		name: "Promo Coordinator",
		description: "Create and manage promotional orders",
		permissions: ["orders:create", "orders:read", "orders:update", "templates:read"],
		isSystem: true,
	},
	{
		id: "photographer",
		name: "Photographer",
		description: "View and update assigned orders",
		permissions: ["orders:read", "orders:update:own"],
		isSystem: true,
	},
	{
		id: "photo-box",
		name: "Photo Box",
		description: "View assigned orders",
		permissions: ["orders:read:assigned"],
		isSystem: true,
	},
	{
		id: "agency",
		name: "Agency",
		description: "External agency access",
		permissions: ["orders:read:assigned", "assets:read"],
		isSystem: true,
	},
];

// System permissions
const SYSTEM_PERMISSIONS: Permission[] = [
	{ id: "orders:create", name: "Create Orders", description: "Create new orders", resource: "orders", actions: ["create"] },
	{ id: "orders:read", name: "Read Orders", description: "View all orders", resource: "orders", actions: ["read"] },
	{ id: "orders:update", name: "Update Orders", description: "Modify orders", resource: "orders", actions: ["update"] },
	{ id: "orders:delete", name: "Delete Orders", description: "Remove orders", resource: "orders", actions: ["delete"] },
	{ id: "orders:*", name: "Full Order Access", description: "All order operations", resource: "orders", actions: ["create", "read", "update", "delete"] },
	{ id: "templates:create", name: "Create Templates", description: "Create order templates", resource: "templates", actions: ["create"] },
	{ id: "templates:read", name: "Read Templates", description: "View templates", resource: "templates", actions: ["read"] },
	{ id: "templates:*", name: "Full Template Access", description: "All template operations", resource: "templates", actions: ["create", "read", "update", "delete"] },
	{ id: "reports:read", name: "View Reports", description: "Access analytics and reports", resource: "reports", actions: ["read"] },
	{ id: "users:read", name: "View Users", description: "View user list", resource: "users", actions: ["read"] },
	{ id: "users:manage", name: "Manage Users", description: "Create and modify users", resource: "users", actions: ["create", "update", "delete"] },
	{ id: "assets:read", name: "View Assets", description: "Access asset library", resource: "assets", actions: ["read"] },
	{ id: "assets:upload", name: "Upload Assets", description: "Upload new assets", resource: "assets", actions: ["create"] },
];

export class SecurityService {
	private policy: SecurityPolicy = DEFAULT_POLICY;
	private sessions: Map<string, Session> = new Map();
	private roles: Map<string, Role> = new Map();
	private permissions: Map<string, Permission> = new Map();
	private csrfTokens: Map<string, string> = new Map();

	constructor() {
		// Initialize system roles and permissions
		for (const role of SYSTEM_ROLES) {
			this.roles.set(role.id, role);
		}
		for (const permission of SYSTEM_PERMISSIONS) {
			this.permissions.set(permission.id, permission);
		}
	}

	/**
	 * Hash a password using PBKDF2
	 */
	async hashPassword(password: string): Promise<HashedPassword> {
		const encoder = new TextEncoder();
		const salt = crypto.getRandomValues(new Uint8Array(16));
		const iterations = 100000;

		const keyMaterial = await crypto.subtle.importKey(
			"raw",
			encoder.encode(password),
			"PBKDF2",
			false,
			["deriveBits"]
		);

		const hash = await crypto.subtle.deriveBits(
			{
				name: "PBKDF2",
				salt: salt.buffer as ArrayBuffer,
				iterations,
				hash: "SHA-256",
			},
			keyMaterial,
			256
		);

		return {
			hash: this.arrayBufferToHex(hash),
			salt: this.arrayBufferToHex(salt.buffer as ArrayBuffer),
			iterations,
			algorithm: "PBKDF2-SHA256",
		};
	}

	/**
	 * Verify a password against a hash
	 */
	async verifyPassword(password: string, hashedPassword: HashedPassword): Promise<boolean> {
		const encoder = new TextEncoder();
		const saltArray = this.hexToArrayBuffer(hashedPassword.salt);

		const keyMaterial = await crypto.subtle.importKey(
			"raw",
			encoder.encode(password),
			"PBKDF2",
			false,
			["deriveBits"]
		);

		const hash = await crypto.subtle.deriveBits(
			{
				name: "PBKDF2",
				salt: saltArray.buffer as ArrayBuffer,
				iterations: hashedPassword.iterations,
				hash: "SHA-256",
			},
			keyMaterial,
			256
		);

		const computedHash = this.arrayBufferToHex(hash);
		return this.secureCompare(computedHash, hashedPassword.hash);
	}

	/**
	 * Validate password against policy
	 */
	validatePassword(password: string): ValidationResult {
		const errors: string[] = [];

		if (password.length < this.policy.passwordMinLength) {
			errors.push(`Password must be at least ${this.policy.passwordMinLength} characters`);
		}

		if (this.policy.passwordRequireUppercase && !/[A-Z]/.test(password)) {
			errors.push("Password must contain at least one uppercase letter");
		}

		if (this.policy.passwordRequireLowercase && !/[a-z]/.test(password)) {
			errors.push("Password must contain at least one lowercase letter");
		}

		if (this.policy.passwordRequireNumber && !/[0-9]/.test(password)) {
			errors.push("Password must contain at least one number");
		}

		if (this.policy.passwordRequireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
			errors.push("Password must contain at least one special character");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Create a new session
	 */
	createSession(userId: string, ipAddress?: string, userAgent?: string): Session {
		const sessionId = this.generateSecureToken(32);
		const now = new Date();
		const expires = new Date(now.getTime() + this.policy.sessionTimeout * 60 * 1000);

		// Check max sessions
		const userSessions = [...this.sessions.values()].filter(
			(s) => s.userId === userId && s.isActive
		);

		if (userSessions.length >= this.policy.maxActiveSessions) {
			// Invalidate oldest session
			const oldest = userSessions.sort(
				(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			)[0];
			this.invalidateSession(oldest.id);
		}

		const session: Session = {
			id: sessionId,
			userId,
			createdAt: now.toISOString(),
			expiresAt: expires.toISOString(),
			lastActivity: now.toISOString(),
			ipAddress,
			userAgent,
			isActive: true,
		};

		this.sessions.set(sessionId, session);
		return session;
	}

	/**
	 * Validate a session
	 */
	validateSession(sessionId: string): Session | null {
		const session = this.sessions.get(sessionId);
		
		if (!session || !session.isActive) {
			return null;
		}

		const now = new Date();
		const expires = new Date(session.expiresAt);

		if (now > expires) {
			this.invalidateSession(sessionId);
			return null;
		}

		// Update last activity and extend session
		session.lastActivity = now.toISOString();
		session.expiresAt = new Date(now.getTime() + this.policy.sessionTimeout * 60 * 1000).toISOString();
		
		return session;
	}

	/**
	 * Invalidate a session
	 */
	invalidateSession(sessionId: string): boolean {
		const session = this.sessions.get(sessionId);
		if (session) {
			session.isActive = false;
			return true;
		}
		return false;
	}

	/**
	 * Invalidate all sessions for a user
	 */
	invalidateAllSessions(userId: string): number {
		let count = 0;
		for (const session of this.sessions.values()) {
			if (session.userId === userId && session.isActive) {
				session.isActive = false;
				count++;
			}
		}
		return count;
	}

	/**
	 * Get active sessions for a user
	 */
	getUserSessions(userId: string): Session[] {
		return [...this.sessions.values()].filter(
			(s) => s.userId === userId && s.isActive
		);
	}

	/**
	 * Generate CSRF token
	 */
	generateCsrfToken(sessionId: string): string {
		const token = this.generateSecureToken(32);
		this.csrfTokens.set(sessionId, token);
		return token;
	}

	/**
	 * Validate CSRF token
	 */
	validateCsrfToken(sessionId: string, token: string): boolean {
		const storedToken = this.csrfTokens.get(sessionId);
		if (!storedToken) return false;
		return this.secureCompare(storedToken, token);
	}

	/**
	 * Check if user has permission
	 */
	hasPermission(userRoles: string[], permissionId: string): boolean {
		for (const roleId of userRoles) {
			const role = this.roles.get(roleId);
			if (!role) continue;

			// Check direct permissions
			if (role.permissions.includes("*")) return true;
			if (role.permissions.includes(permissionId)) return true;

			// Check wildcard permissions (e.g., "orders:*" matches "orders:create")
			const [resource] = permissionId.split(":");
			if (role.permissions.includes(`${resource}:*`)) return true;

			// Check inherited roles
			if (role.inherits) {
				if (this.hasPermission(role.inherits, permissionId)) return true;
			}
		}

		return false;
	}

	/**
	 * Get effective permissions for roles
	 */
	getEffectivePermissions(roleIds: string[]): Permission[] {
		const permissionIds = new Set<string>();

		for (const roleId of roleIds) {
			const role = this.roles.get(roleId);
			if (!role) continue;

			if (role.permissions.includes("*")) {
				// Return all permissions
				return [...this.permissions.values()];
			}

			for (const permId of role.permissions) {
				if (permId.endsWith(":*")) {
					// Wildcard - add all permissions for resource
					const resource = permId.replace(":*", "");
					for (const [id, perm] of this.permissions) {
						if (perm.resource === resource) {
							permissionIds.add(id);
						}
					}
				} else {
					permissionIds.add(permId);
				}
			}

			// Handle inherited roles
			if (role.inherits) {
				const inherited = this.getEffectivePermissions(role.inherits);
				for (const perm of inherited) {
					permissionIds.add(perm.id);
				}
			}
		}

		return [...permissionIds]
			.map((id) => this.permissions.get(id))
			.filter((p): p is Permission => p !== undefined);
	}

	/**
	 * Get all roles
	 */
	getRoles(): Role[] {
		return [...this.roles.values()];
	}

	/**
	 * Get all permissions
	 */
	getPermissions(): Permission[] {
		return [...this.permissions.values()];
	}

	/**
	 * Sanitize input to prevent XSS
	 */
	sanitizeInput(input: string): string {
		return input
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#x27;")
			.replace(/\//g, "&#x2F;");
	}

	/**
	 * Validate and sanitize email
	 */
	validateEmail(email: string): ValidationResult {
		const sanitized = email.trim().toLowerCase();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(sanitized)) {
			return {
				isValid: false,
				errors: ["Invalid email format"],
			};
		}

		return {
			isValid: true,
			errors: [],
			sanitizedValue: sanitized,
		};
	}

	/**
	 * Validate username
	 */
	validateUsername(username: string): ValidationResult {
		const sanitized = username.trim();
		const errors: string[] = [];

		if (sanitized.length < 3) {
			errors.push("Username must be at least 3 characters");
		}

		if (sanitized.length > 50) {
			errors.push("Username must be less than 50 characters");
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
			errors.push("Username can only contain letters, numbers, underscores, and hyphens");
		}

		return {
			isValid: errors.length === 0,
			errors,
			sanitizedValue: sanitized,
		};
	}

	/**
	 * Update security policy
	 */
	updatePolicy(updates: Partial<SecurityPolicy>): void {
		this.policy = { ...this.policy, ...updates };
	}

	/**
	 * Get current policy
	 */
	getPolicy(): SecurityPolicy {
		return { ...this.policy };
	}

	// Helper methods

	private generateSecureToken(length: number): string {
		const bytes = crypto.getRandomValues(new Uint8Array(length));
		return this.arrayBufferToHex(bytes);
	}

	private arrayBufferToHex(buffer: ArrayBuffer | Uint8Array): string {
		const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
		return Array.from(bytes)
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	}

	private hexToArrayBuffer(hex: string): Uint8Array {
		const bytes = new Uint8Array(hex.length / 2);
		for (let i = 0; i < hex.length; i += 2) {
			bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
		}
		return bytes;
	}

	private secureCompare(a: string, b: string): boolean {
		if (a.length !== b.length) return false;
		
		let result = 0;
		for (let i = 0; i < a.length; i++) {
			result |= a.charCodeAt(i) ^ b.charCodeAt(i);
		}
		return result === 0;
	}
}

export const securityService = new SecurityService();
