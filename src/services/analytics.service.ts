/**
 * Analytics Dashboard Service
 * 
 * Provides KPIs, charts, order statistics, and performance metrics
 * for monitoring photo order workflow efficiency.
 */

import type { PhotoOrder } from "../types";

export interface OrderStats {
	total: number;
	byStatus: Record<string, number>;
	byType: Record<string, number>;
	byOwner: Record<string, number>;
	byMonth: Record<string, number>;
}

export interface KPI {
	id: string;
	name: string;
	value: number;
	previousValue?: number;
	unit: string;
	trend: "up" | "down" | "stable";
	trendPercent: number;
	target?: number;
	isPositive: boolean;
}

export interface ChartData {
	labels: string[];
	datasets: ChartDataset[];
}

export interface ChartDataset {
	label: string;
	data: number[];
	backgroundColor?: string | string[];
	borderColor?: string;
	fill?: boolean;
}

export interface TimeRange {
	start: Date;
	end: Date;
	label: string;
}

export interface PerformanceMetric {
	name: string;
	current: number;
	average: number;
	best: number;
	worst: number;
	unit: string;
}

export interface AnalyticsSnapshot {
	generatedAt: string;
	timeRange: TimeRange;
	kpis: KPI[];
	orderStats: OrderStats;
	charts: {
		ordersTrend: ChartData;
		statusDistribution: ChartData;
		typeBreakdown: ChartData;
		topOwners: ChartData;
	};
	performance: PerformanceMetric[];
}

// Preset time ranges
export const TIME_RANGES = {
	today: (): TimeRange => {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		return { start, end: now, label: "Today" };
	},
	thisWeek: (): TimeRange => {
		const now = new Date();
		const dayOfWeek = now.getDay();
		const start = new Date(now);
		start.setDate(now.getDate() - dayOfWeek);
		start.setHours(0, 0, 0, 0);
		return { start, end: now, label: "This Week" };
	},
	thisMonth: (): TimeRange => {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), 1);
		return { start, end: now, label: "This Month" };
	},
	lastMonth: (): TimeRange => {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const end = new Date(now.getFullYear(), now.getMonth(), 0);
		return { start, end, label: "Last Month" };
	},
	thisQuarter: (): TimeRange => {
		const now = new Date();
		const quarter = Math.floor(now.getMonth() / 3);
		const start = new Date(now.getFullYear(), quarter * 3, 1);
		return { start, end: now, label: "This Quarter" };
	},
	thisYear: (): TimeRange => {
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 1);
		return { start, end: now, label: "This Year" };
	},
	last7Days: (): TimeRange => {
		const now = new Date();
		const start = new Date(now);
		start.setDate(now.getDate() - 7);
		return { start, end: now, label: "Last 7 Days" };
	},
	last30Days: (): TimeRange => {
		const now = new Date();
		const start = new Date(now);
		start.setDate(now.getDate() - 30);
		return { start, end: now, label: "Last 30 Days" };
	},
	last90Days: (): TimeRange => {
		const now = new Date();
		const start = new Date(now);
		start.setDate(now.getDate() - 90);
		return { start, end: now, label: "Last 90 Days" };
	},
};

// Chart color palette
const COLORS = {
	primary: "#3b82f6",
	success: "#22c55e",
	warning: "#f59e0b",
	danger: "#ef4444",
	info: "#06b6d4",
	purple: "#8b5cf6",
	pink: "#ec4899",
	palette: [
		"#3b82f6", "#22c55e", "#f59e0b", "#ef4444",
		"#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6",
		"#f97316", "#6366f1", "#84cc16", "#a855f7",
	],
};

export class AnalyticsService {
	private orders: PhotoOrder[] = [];
	private previousOrders: PhotoOrder[] = [];
	private listeners = new Set<(snapshot: AnalyticsSnapshot) => void>();

	/**
	 * Update data source
	 */
	setOrders(orders: PhotoOrder[], previousPeriodOrders?: PhotoOrder[]): void {
		this.orders = orders;
		this.previousOrders = previousPeriodOrders ?? [];
	}

	/**
	 * Filter orders by time range
	 */
	private filterByTimeRange(orders: PhotoOrder[], range: TimeRange): PhotoOrder[] {
		return orders.filter((order) => {
			const orderDate = new Date(order.createdAt ?? order.shootDate ?? Date.now());
			return orderDate >= range.start && orderDate <= range.end;
		});
	}

	/**
	 * Calculate order statistics
	 */
	calculateStats(range?: TimeRange): OrderStats {
		const filtered = range ? this.filterByTimeRange(this.orders, range) : this.orders;

		const stats: OrderStats = {
			total: filtered.length,
			byStatus: {},
			byType: {},
			byOwner: {},
			byMonth: {},
		};

		for (const order of filtered) {
			// By status
			const status = order.status || "unknown";
			stats.byStatus[status] = (stats.byStatus[status] ?? 0) + 1;

			// By type
			const type = order.orderType || "unknown";
			stats.byType[type] = (stats.byType[type] ?? 0) + 1;

			// By owner
			const owner = order.orderOwner || "unassigned";
			stats.byOwner[owner] = (stats.byOwner[owner] ?? 0) + 1;

			// By month
			const date = new Date(order.createdAt ?? order.shootDate ?? Date.now());
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
			stats.byMonth[monthKey] = (stats.byMonth[monthKey] ?? 0) + 1;
		}

		return stats;
	}

	/**
	 * Calculate KPIs
	 */
	calculateKPIs(range?: TimeRange): KPI[] {
		const currentOrders = range ? this.filterByTimeRange(this.orders, range) : this.orders;
		
		// Calculate previous period for comparison
		let previousOrders: PhotoOrder[] = [];
		if (range) {
			const duration = range.end.getTime() - range.start.getTime();
			const previousRange: TimeRange = {
				start: new Date(range.start.getTime() - duration),
				end: new Date(range.end.getTime() - duration),
				label: "Previous Period",
			};
			previousOrders = this.filterByTimeRange(this.previousOrders.length > 0 ? this.previousOrders : this.orders, previousRange);
		}

		const calculateTrend = (current: number, previous: number): { trend: "up" | "down" | "stable"; percent: number } => {
			if (previous === 0) return { trend: current > 0 ? "up" : "stable", percent: 0 };
			const percent = ((current - previous) / previous) * 100;
			return {
				trend: percent > 1 ? "up" : percent < -1 ? "down" : "stable",
				percent: Math.abs(Math.round(percent)),
			};
		};

		// Calculate metrics
		const totalOrders = currentOrders.length;
		const prevTotalOrders = previousOrders.length;
		const totalTrend = calculateTrend(totalOrders, prevTotalOrders);

		const completedOrders = currentOrders.filter((o) => o.status === "complete" || o.status === "delivered").length;
		const prevCompletedOrders = previousOrders.filter((o) => o.status === "complete" || o.status === "delivered").length;
		const completedTrend = calculateTrend(completedOrders, prevCompletedOrders);

		const pendingOrders = currentOrders.filter((o) => o.status === "pending" || o.status === "draft").length;
		const prevPendingOrders = previousOrders.filter((o) => o.status === "pending" || o.status === "draft").length;
		const pendingTrend = calculateTrend(pendingOrders, prevPendingOrders);

		const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
		const prevCompletionRate = prevTotalOrders > 0 ? (prevCompletedOrders / prevTotalOrders) * 100 : 0;
		const completionTrend = calculateTrend(completionRate, prevCompletionRate);

		// Average articles per order
		const avgArticles = totalOrders > 0
			? currentOrders.reduce((sum, o) => sum + (o.articles?.length ?? 0), 0) / totalOrders
			: 0;
		const prevAvgArticles = prevTotalOrders > 0
			? previousOrders.reduce((sum, o) => sum + (o.articles?.length ?? 0), 0) / prevTotalOrders
			: 0;
		const articlesTrend = calculateTrend(avgArticles, prevAvgArticles);

		// Unique owners active
		const activeOwners = new Set(currentOrders.map((o) => o.orderOwner).filter(Boolean)).size;
		const prevActiveOwners = new Set(previousOrders.map((o) => o.orderOwner).filter(Boolean)).size;
		const ownersTrend = calculateTrend(activeOwners, prevActiveOwners);

		return [
			{
				id: "total-orders",
				name: "Total Orders",
				value: totalOrders,
				previousValue: prevTotalOrders,
				unit: "",
				trend: totalTrend.trend,
				trendPercent: totalTrend.percent,
				isPositive: true,
			},
			{
				id: "completed-orders",
				name: "Completed Orders",
				value: completedOrders,
				previousValue: prevCompletedOrders,
				unit: "",
				trend: completedTrend.trend,
				trendPercent: completedTrend.percent,
				isPositive: true,
			},
			{
				id: "pending-orders",
				name: "Pending Orders",
				value: pendingOrders,
				previousValue: prevPendingOrders,
				unit: "",
				trend: pendingTrend.trend,
				trendPercent: pendingTrend.percent,
				isPositive: false, // Lower is better
			},
			{
				id: "completion-rate",
				name: "Completion Rate",
				value: Math.round(completionRate * 10) / 10,
				previousValue: Math.round(prevCompletionRate * 10) / 10,
				unit: "%",
				trend: completionTrend.trend,
				trendPercent: completionTrend.percent,
				target: 90,
				isPositive: true,
			},
			{
				id: "avg-articles",
				name: "Avg Articles/Order",
				value: Math.round(avgArticles * 10) / 10,
				previousValue: Math.round(prevAvgArticles * 10) / 10,
				unit: "",
				trend: articlesTrend.trend,
				trendPercent: articlesTrend.percent,
				isPositive: true,
			},
			{
				id: "active-owners",
				name: "Active Team Members",
				value: activeOwners,
				previousValue: prevActiveOwners,
				unit: "",
				trend: ownersTrend.trend,
				trendPercent: ownersTrend.percent,
				isPositive: true,
			},
		];
	}

	/**
	 * Generate chart data for orders trend over time
	 */
	generateOrdersTrendChart(range?: TimeRange): ChartData {
		const filtered = range ? this.filterByTimeRange(this.orders, range) : this.orders;

		// Group by date
		const byDate: Record<string, number> = {};
		for (const order of filtered) {
			const date = new Date(order.createdAt ?? order.shootDate ?? Date.now());
			const dateKey = date.toISOString().split("T")[0];
			byDate[dateKey] = (byDate[dateKey] ?? 0) + 1;
		}

		// Sort dates and generate labels
		const sortedDates = Object.keys(byDate).sort();
		
		return {
			labels: sortedDates.map((d) => {
				const date = new Date(d);
				return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
			}),
			datasets: [
				{
					label: "Orders",
					data: sortedDates.map((d) => byDate[d]),
					borderColor: COLORS.primary,
					backgroundColor: `${COLORS.primary}33`,
					fill: true,
				},
			],
		};
	}

	/**
	 * Generate status distribution pie chart
	 */
	generateStatusDistributionChart(range?: TimeRange): ChartData {
		const stats = this.calculateStats(range);

		const labels = Object.keys(stats.byStatus);
		const data = Object.values(stats.byStatus);

		return {
			labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
			datasets: [
				{
					label: "Orders by Status",
					data,
					backgroundColor: COLORS.palette.slice(0, labels.length),
				},
			],
		};
	}

	/**
	 * Generate order type breakdown chart
	 */
	generateTypeBreakdownChart(range?: TimeRange): ChartData {
		const stats = this.calculateStats(range);

		const labels = Object.keys(stats.byType);
		const data = Object.values(stats.byType);

		return {
			labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
			datasets: [
				{
					label: "Orders by Type",
					data,
					backgroundColor: COLORS.palette.slice(0, labels.length),
				},
			],
		};
	}

	/**
	 * Generate top owners bar chart
	 */
	generateTopOwnersChart(range?: TimeRange, limit = 10): ChartData {
		const stats = this.calculateStats(range);

		// Sort by count descending
		const sorted = Object.entries(stats.byOwner)
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit);

		return {
			labels: sorted.map(([owner]) => owner),
			datasets: [
				{
					label: "Orders by Owner",
					data: sorted.map(([, count]) => count),
					backgroundColor: COLORS.primary,
				},
			],
		};
	}

	/**
	 * Calculate performance metrics
	 */
	calculatePerformanceMetrics(range?: TimeRange): PerformanceMetric[] {
		const filtered = range ? this.filterByTimeRange(this.orders, range) : this.orders;

		// Orders per day
		const byDate: Record<string, number> = {};
		for (const order of filtered) {
			const date = new Date(order.createdAt ?? order.shootDate ?? Date.now());
			const dateKey = date.toISOString().split("T")[0];
			byDate[dateKey] = (byDate[dateKey] ?? 0) + 1;
		}
		
		const ordersPerDay = Object.values(byDate);
		const avgOrdersPerDay = ordersPerDay.length > 0
			? ordersPerDay.reduce((a, b) => a + b, 0) / ordersPerDay.length
			: 0;

		// Articles per order
		const articlesPerOrder = filtered.map((o) => o.articles?.length ?? 0);
		const avgArticles = articlesPerOrder.length > 0
			? articlesPerOrder.reduce((a, b) => a + b, 0) / articlesPerOrder.length
			: 0;

		return [
			{
				name: "Orders Per Day",
				current: ordersPerDay[ordersPerDay.length - 1] ?? 0,
				average: Math.round(avgOrdersPerDay * 10) / 10,
				best: Math.max(...ordersPerDay, 0),
				worst: Math.min(...ordersPerDay, 0),
				unit: "orders",
			},
			{
				name: "Articles Per Order",
				current: articlesPerOrder[articlesPerOrder.length - 1] ?? 0,
				average: Math.round(avgArticles * 10) / 10,
				best: Math.max(...articlesPerOrder, 0),
				worst: Math.min(...articlesPerOrder, 0),
				unit: "articles",
			},
			{
				name: "Total Articles",
				current: articlesPerOrder.reduce((a, b) => a + b, 0),
				average: Math.round(articlesPerOrder.reduce((a, b) => a + b, 0) / (Object.keys(byDate).length || 1)),
				best: 0,
				worst: 0,
				unit: "articles",
			},
		];
	}

	/**
	 * Generate complete analytics snapshot
	 */
	generateSnapshot(range?: TimeRange): AnalyticsSnapshot {
		const effectiveRange = range ?? TIME_RANGES.thisMonth();

		return {
			generatedAt: new Date().toISOString(),
			timeRange: effectiveRange,
			kpis: this.calculateKPIs(effectiveRange),
			orderStats: this.calculateStats(effectiveRange),
			charts: {
				ordersTrend: this.generateOrdersTrendChart(effectiveRange),
				statusDistribution: this.generateStatusDistributionChart(effectiveRange),
				typeBreakdown: this.generateTypeBreakdownChart(effectiveRange),
				topOwners: this.generateTopOwnersChart(effectiveRange),
			},
			performance: this.calculatePerformanceMetrics(effectiveRange),
		};
	}

	/**
	 * Export analytics to CSV
	 */
	exportToCSV(snapshot: AnalyticsSnapshot): string {
		const lines: string[] = [];

		// Header
		lines.push("Photo Order Analytics Report");
		lines.push(`Generated: ${snapshot.generatedAt}`);
		lines.push(`Period: ${snapshot.timeRange.label}`);
		lines.push("");

		// KPIs
		lines.push("Key Performance Indicators");
		lines.push("Metric,Value,Previous,Trend,Change %");
		for (const kpi of snapshot.kpis) {
			lines.push(`"${kpi.name}",${kpi.value}${kpi.unit},${kpi.previousValue ?? "N/A"},${kpi.trend},${kpi.trendPercent}%`);
		}
		lines.push("");

		// Order Stats
		lines.push("Order Statistics");
		lines.push(`Total Orders,${snapshot.orderStats.total}`);
		lines.push("");
		
		lines.push("Status Breakdown");
		for (const [status, count] of Object.entries(snapshot.orderStats.byStatus)) {
			lines.push(`${status},${count}`);
		}
		lines.push("");

		lines.push("Type Breakdown");
		for (const [type, count] of Object.entries(snapshot.orderStats.byType)) {
			lines.push(`${type},${count}`);
		}

		return lines.join("\n");
	}

	/**
	 * Subscribe to analytics updates
	 */
	onUpdate(listener: (snapshot: AnalyticsSnapshot) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	/**
	 * Refresh and notify listeners
	 */
	refresh(range?: TimeRange): void {
		const snapshot = this.generateSnapshot(range);
		for (const listener of this.listeners) {
			listener(snapshot);
		}
	}
}

export const analyticsService = new AnalyticsService();
