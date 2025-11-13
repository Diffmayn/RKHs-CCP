import type {
	AuthLogger,
	AuthUser,
	AuthUserRecord,
	PhotoOrder,
	PhotoOrderWithAccess,
	StorageProvider,
} from "../types";

export interface AuthServiceOptions {
	storage?: StorageProvider;
	logger?: AuthLogger;
	users?: Record<string, AuthUserRecord>;
}

export const AUTH_STORAGE_KEY = "current_user";

const createDefaultStorage = (): StorageProvider => {
	if (typeof window !== "undefined" && window.localStorage) {
		return window.localStorage;
	}

	const memoryStore = new Map<string, string>();
	return {
		getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key)! : null),
		setItem: (key, value) => memoryStore.set(key, value),
		removeItem: (key) => memoryStore.delete(key),
	};
};

const defaultLogger: Required<AuthLogger> = {
	debug: console.debug.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console),
};

const cloneUserRecord = (record: AuthUserRecord): AuthUserRecord => ({
	password: record.password,
	user: { ...record.user, features: { ...(record.user.features || {}) } },
});

const TEST_USERS: Record<string, AuthUserRecord> = {
	promo1: cloneUserRecord({
		password: "promo123",
		user: {
			id: "user-promo1",
			name: "Sarah Johnson",
			email: "sarah.johnson@company.com",
			role: "Promo Coordinator",
			department: "Marketing",
			purchaseGroups: [100, 200],
		},
	}),
	promo2: cloneUserRecord({
		password: "promo123",
		user: {
			id: "user-promo2",
			name: "Lars Nielsen",
			email: "lars.nielsen@company.com",
			role: "Promo Coordinator",
			department: "Marketing",
			purchaseGroups: [300, 400],
		},
	}),
	photo1: cloneUserRecord({
		password: "photo123",
		user: {
			id: "user-photo1",
			name: "Mike Rodriguez",
			email: "mike.rodriguez@company.com",
			role: "Photographer",
			department: "Creative",
		},
	}),
	photo2: cloneUserRecord({
		password: "photo123",
		user: {
			id: "user-photo2",
			name: "Emily Chen",
			email: "emily.chen@company.com",
			role: "Photographer",
			department: "Creative",
		},
	}),
	photobox1: cloneUserRecord({
		password: "photobox123",
		user: {
			id: "user-photobox1",
			name: "Alex Turner",
			email: "alex.turner@company.com",
			role: "Photo Box",
			department: "Creative",
		},
	}),
	agency1: cloneUserRecord({
		password: "agency123",
		user: {
			id: "user-agency1",
			name: "Camilla Sorensen",
			email: "camilla.sorensen@agency-partner.com",
			role: "Agency",
			department: "External Agency",
		},
	}),
	marketing1: cloneUserRecord({
		password: "marketing123",
		user: {
			id: "user-marketing1",
			name: "David Thompson",
			email: "david.thompson@company.com",
			role: "Marketing Manager",
			department: "Marketing",
		},
	}),
	admin1: cloneUserRecord({
		password: "admin123",
		user: {
			id: "user-admin1",
			name: "Jennifer Smith",
			email: "jennifer.smith@company.com",
			role: "Admin",
			department: "IT",
		},
	}),
};

const applyFeatureFlags = (user: AuthUser): AuthUser => ({
	...user,
	features: {
		...(user.features || {}),
		gpt5CodexPreview: true,
	},
});

const ensureTestUsersFeatureFlags = (
	users: Record<string, AuthUserRecord>
): Record<string, AuthUserRecord> => {
	const result: Record<string, AuthUserRecord> = {};

	for (const [username, record] of Object.entries(users)) {
		result[username.toLowerCase()] = {
			password: record.password,
			user: applyFeatureFlags({ ...record.user }),
		};
	}

	return result;
};

export class AuthService {
	private readonly storage: StorageProvider;

	private readonly logger: Required<AuthLogger>;

	private readonly testUsers: Record<string, AuthUserRecord>;

	private currentUser: AuthUser | null = null;

	constructor(options: AuthServiceOptions = {}) {
		this.storage = options.storage ?? createDefaultStorage();
		this.logger = {
			...defaultLogger,
			...options.logger,
		};
		this.testUsers = ensureTestUsersFeatureFlags(options.users ?? TEST_USERS);

		this.loadSession();
	}

	private loadSession() {
		try {
			const payload = this.storage.getItem(AUTH_STORAGE_KEY);
			if (!payload) {
				this.currentUser = null;
				return;
			}

			const parsed = JSON.parse(payload) as AuthUser;
			this.currentUser = applyFeatureFlags(parsed);
		} catch (error) {
			this.logger.warn("Failed to load auth session", error);
			this.currentUser = null;
		}
	}

	private saveSession() {
		try {
			if (this.currentUser) {
				this.storage.setItem(
					AUTH_STORAGE_KEY,
					JSON.stringify(this.currentUser)
				);
			} else {
				this.storage.removeItem(AUTH_STORAGE_KEY);
			}
		} catch (error) {
			this.logger.warn("Failed to persist auth session", error);
		}
	}

	private setCurrentUser(user: AuthUser | null) {
		this.currentUser = user ? applyFeatureFlags(user) : null;
		this.saveSession();
	}

	private resolveUserRecord(username: string): AuthUserRecord | undefined {
		if (!username) {
			return undefined;
		}

		const key = username.trim().toLowerCase();
		return this.testUsers[key];
	}

	login(username: string, password: string): boolean {
		const record = this.resolveUserRecord(username);
		if (!record) {
			return false;
		}

		if (record.password !== password) {
			return false;
		}

		this.setCurrentUser({ ...record.user });
		return true;
	}

	logout() {
		this.setCurrentUser(null);
	}

	getCurrentUser(): AuthUser | null {
		return this.currentUser;
	}

	isAuthenticated(): boolean {
		return this.currentUser !== null;
	}

	canViewAllOrders(): boolean {
		const user = this.currentUser;
		if (!user) {
			return false;
		}

		return ["Admin", "Marketing Manager", "Agency"].includes(user.role);
	}

	canCreateOrders(): boolean {
		const user = this.currentUser;
		if (!user) {
			return false;
		}

		return ["Admin", "Marketing Manager", "Promo Coordinator"].includes(
			user.role
		);
	}

	canEditOrder(order: PhotoOrder): boolean {
		const user = this.currentUser;
		if (!user) {
			return false;
		}

		switch (user.role) {
			case "Admin":
			case "Marketing Manager":
			case "Agency":
				return true;
			case "Promo Coordinator":
				return order.createdBy === user.id;
			case "Photographer":
			case "Photo Box":
				return order.assignedTo === user.id;
			default:
				return false;
		}
	}

	canUploadImages(): boolean {
		const user = this.currentUser;
		if (!user) {
			return false;
		}

		return [
			"Admin",
			"Marketing Manager",
			"Photographer",
			"Photo Box",
			"Agency",
		].includes(user.role);
	}

	canManageOrders(): boolean {
		const user = this.currentUser;
		if (!user) {
			return false;
		}

		return ["Admin", "Marketing Manager", "Promo Coordinator"].includes(
			user.role
		);
	}

	getFilteredOrders(allOrders: PhotoOrder[]): PhotoOrderWithAccess[] {
		const user = this.currentUser;
		if (!user) {
			return [];
		}

		this.logger.debug(
			"Filtering orders",
			user.id,
			user.role,
			"total:",
			allOrders.length
		);

		switch (user.role) {
			case "Admin":
			case "Marketing Manager":
			case "Agency":
				return allOrders as PhotoOrderWithAccess[];

			case "Promo Coordinator": {
				const purchaseGroups = Array.isArray(user.purchaseGroups)
					? user.purchaseGroups
					: [];

				return allOrders.map((order) => {
					const hasAccess =
						purchaseGroups.length === 0 ||
						order.purchaseGroup === undefined ||
						purchaseGroups.includes(order.purchaseGroup);

					const target = order as PhotoOrderWithAccess;

					if (Object.prototype.hasOwnProperty.call(target, "hasPurchaseGroupAccess")) {
						target.hasPurchaseGroupAccess = hasAccess;
					} else {
						try {
							Object.defineProperty(target, "hasPurchaseGroupAccess", {
								configurable: true,
								enumerable: false,
								writable: true,
								value: hasAccess,
							});
						} catch (error) {
							this.logger.warn(
								"Failed to define access flag on order, falling back to assignment",
								error
							);
							target.hasPurchaseGroupAccess = hasAccess;
						}
					}

					return target;
				});
			}

			case "Photographer":
			case "Photo Box":
				return allOrders.filter((order) => order.assignedTo === user.id);

			default:
				return [];
		}
	}

	getUserIdByName(name: string): string | null {
		const searchName = name.trim().toLowerCase();

		for (const record of Object.values(this.testUsers)) {
			if (record.user.name.trim().toLowerCase() === searchName) {
				return record.user.id;
			}
		}

		return null;
	}
}

export type { AuthUser, PhotoOrder } from "../types";
