/**
 * Integration Services
 * 
 * Provides integrations with external systems:
 * - Calendar sync (iCal/Google Calendar)
 * - Report export (PDF, Excel, CSV)
 * - Webhook notifications
 * - Email notifications
 */

import type { PhotoOrder } from "../types";

// Calendar Integration

export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	start: Date;
	end: Date;
	location?: string;
	attendees?: string[];
	url?: string;
	reminders?: CalendarReminder[];
	metadata?: Record<string, string>;
}

export interface CalendarReminder {
	method: "email" | "popup";
	minutesBefore: number;
}

export interface ICalendarExport {
	events: CalendarEvent[];
	calendarName: string;
}

export class CalendarService {
	/**
	 * Create calendar event from photo order
	 */
	createEventFromOrder(order: PhotoOrder, durationMinutes = 60): CalendarEvent {
		const shootDate = order.shootDate ? new Date(order.shootDate) : new Date();
		
		return {
			id: `order-${order.orderId ?? order.orderNumber}`,
			title: `Photo Shoot: ${order.orderId ?? order.orderNumber}`,
			description: this.generateEventDescription(order),
			start: shootDate,
			end: new Date(shootDate.getTime() + durationMinutes * 60 * 1000),
			location: order.shootLocation ?? order.location,
			attendees: order.orderOwner ? [order.orderOwner] : [],
			reminders: [
				{ method: "popup", minutesBefore: 60 },
				{ method: "email", minutesBefore: 1440 }, // 1 day before
			],
			metadata: {
				orderId: order.orderId ?? order.orderNumber ?? "",
				orderType: order.orderType ?? "",
				articleCount: String(order.articles?.length ?? 0),
			},
		};
	}

	private generateEventDescription(order: PhotoOrder): string {
		const lines: string[] = [];
		
		lines.push(`Order ID: ${order.orderId}`);
		lines.push(`Type: ${order.orderType ?? "Not specified"}`);
		lines.push(`Owner: ${order.orderOwner ?? "Unassigned"}`);
		lines.push(`Articles: ${order.articles?.length ?? 0}`);
		
		if (order.shootBrief) {
			lines.push("");
			lines.push("Brief:");
			lines.push(order.shootBrief.substring(0, 500));
		}

		return lines.join("\n");
	}

	/**
	 * Export to iCal format
	 */
	exportToICal(events: CalendarEvent[], calendarName = "Photo Orders"): string {
		const lines: string[] = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//RKH Photo Orders//EN",
			`X-WR-CALNAME:${calendarName}`,
		];

		for (const event of events) {
			lines.push("BEGIN:VEVENT");
			lines.push(`UID:${event.id}@rkhphotoorders`);
			lines.push(`DTSTAMP:${this.formatICalDate(new Date())}`);
			lines.push(`DTSTART:${this.formatICalDate(event.start)}`);
			lines.push(`DTEND:${this.formatICalDate(event.end)}`);
			lines.push(`SUMMARY:${this.escapeICalText(event.title)}`);
			
			if (event.description) {
				lines.push(`DESCRIPTION:${this.escapeICalText(event.description)}`);
			}
			if (event.location) {
				lines.push(`LOCATION:${this.escapeICalText(event.location)}`);
			}
			if (event.url) {
				lines.push(`URL:${event.url}`);
			}

			// Add reminders
			for (const reminder of event.reminders ?? []) {
				lines.push("BEGIN:VALARM");
				lines.push(`TRIGGER:-PT${reminder.minutesBefore}M`);
				lines.push(`ACTION:${reminder.method === "email" ? "EMAIL" : "DISPLAY"}`);
				lines.push(`DESCRIPTION:Reminder: ${event.title}`);
				lines.push("END:VALARM");
			}

			lines.push("END:VEVENT");
		}

		lines.push("END:VCALENDAR");
		return lines.join("\r\n");
	}

	/**
	 * Generate Google Calendar URL
	 */
	generateGoogleCalendarUrl(event: CalendarEvent): string {
		const params = new URLSearchParams({
			action: "TEMPLATE",
			text: event.title,
			dates: `${this.formatGoogleDate(event.start)}/${this.formatGoogleDate(event.end)}`,
		});

		if (event.description) {
			params.set("details", event.description);
		}
		if (event.location) {
			params.set("location", event.location);
		}

		return `https://calendar.google.com/calendar/render?${params.toString()}`;
	}

	private formatICalDate(date: Date): string {
		return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
	}

	private formatGoogleDate(date: Date): string {
		return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
	}

	private escapeICalText(text: string): string {
		return text
			.replace(/\\/g, "\\\\")
			.replace(/;/g, "\\;")
			.replace(/,/g, "\\,")
			.replace(/\n/g, "\\n");
	}

	/**
	 * Download iCal file
	 */
	downloadICal(events: CalendarEvent[], filename = "photo-orders.ics"): void {
		const icalContent = this.exportToICal(events);
		const blob = new Blob([icalContent], { type: "text/calendar" });
		const url = URL.createObjectURL(blob);
		
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

// Report Export Service

export interface ReportConfig {
	title: string;
	subtitle?: string;
	dateRange?: { start: Date; end: Date };
	includeCharts?: boolean;
	includeSummary?: boolean;
	columns: ReportColumn[];
	groupBy?: string;
	sortBy?: string;
	sortDirection?: "asc" | "desc";
}

export interface ReportColumn {
	field: string;
	header: string;
	width?: number;
	format?: "text" | "number" | "currency" | "date" | "boolean";
	align?: "left" | "center" | "right";
}

export interface ReportData {
	config: ReportConfig;
	rows: Record<string, unknown>[];
	summary?: Record<string, number | string>;
	generatedAt: string;
}

export class ReportExportService {
	/**
	 * Export to CSV
	 */
	exportToCSV(data: ReportData): string {
		const { config, rows } = data;
		const lines: string[] = [];

		// Header row
		lines.push(config.columns.map((col) => `"${col.header}"`).join(","));

		// Data rows
		for (const row of rows) {
			const values = config.columns.map((col) => {
				const value = this.getNestedValue(row, col.field);
				return this.formatCSVValue(value, col.format);
			});
			lines.push(values.join(","));
		}

		// Summary row if present
		if (data.summary && config.includeSummary) {
			lines.push("");
			lines.push("Summary");
			for (const [key, value] of Object.entries(data.summary)) {
				lines.push(`"${key}","${value}"`);
			}
		}

		return lines.join("\n");
	}

	/**
	 * Export to Excel XML (simplified)
	 */
	exportToExcel(data: ReportData): string {
		const { config, rows } = data;
		
		let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
		xml += '<?mso-application progid="Excel.Sheet"?>\n';
		xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
		xml += '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
		xml += '  <Styles>\n';
		xml += '    <Style ss:ID="Header"><Font ss:Bold="1"/></Style>\n';
		xml += '    <Style ss:ID="Date"><NumberFormat ss:Format="yyyy-mm-dd"/></Style>\n';
		xml += '  </Styles>\n';
		xml += `  <Worksheet ss:Name="${config.title.substring(0, 31)}">\n`;
		xml += "    <Table>\n";

		// Header row
		xml += "      <Row>\n";
		for (const col of config.columns) {
			xml += `        <Cell ss:StyleID="Header"><Data ss:Type="String">${this.escapeXml(col.header)}</Data></Cell>\n`;
		}
		xml += "      </Row>\n";

		// Data rows
		for (const row of rows) {
			xml += "      <Row>\n";
			for (const col of config.columns) {
				const value = this.getNestedValue(row, col.field);
				const { type, formatted } = this.formatExcelValue(value, col.format);
				xml += `        <Cell><Data ss:Type="${type}">${this.escapeXml(formatted)}</Data></Cell>\n`;
			}
			xml += "      </Row>\n";
		}

		xml += "    </Table>\n";
		xml += "  </Worksheet>\n";
		xml += "</Workbook>";

		return xml;
	}

	/**
	 * Export to HTML (for PDF generation)
	 */
	exportToHTML(data: ReportData): string {
		const { config, rows } = data;

		let html = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>${config.title}</title>
	<style>
		body { font-family: Arial, sans-serif; margin: 40px; }
		h1 { color: #333; margin-bottom: 5px; }
		h2 { color: #666; font-size: 14px; font-weight: normal; margin-top: 0; }
		table { border-collapse: collapse; width: 100%; margin-top: 20px; }
		th { background: #f5f5f5; padding: 10px; text-align: left; border: 1px solid #ddd; }
		td { padding: 8px 10px; border: 1px solid #ddd; }
		tr:nth-child(even) { background: #fafafa; }
		.summary { margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
		.footer { margin-top: 30px; color: #999; font-size: 12px; }
		.align-right { text-align: right; }
		.align-center { text-align: center; }
	</style>
</head>
<body>
	<h1>${config.title}</h1>
	${config.subtitle ? `<h2>${config.subtitle}</h2>` : ""}
	
	<table>
		<thead>
			<tr>
				${config.columns.map((col) => `<th>${col.header}</th>`).join("\n\t\t\t\t")}
			</tr>
		</thead>
		<tbody>
			${rows.map((row) => `
			<tr>
				${config.columns.map((col) => {
					const value = this.getNestedValue(row, col.field);
					const formatted = this.formatHTMLValue(value, col.format);
					const align = col.align ? ` class="align-${col.align}"` : "";
					return `<td${align}>${formatted}</td>`;
				}).join("\n\t\t\t\t")}
			</tr>`).join("")}
		</tbody>
	</table>`;

		if (data.summary && config.includeSummary) {
			html += `
	<div class="summary">
		<strong>Summary</strong>
		<ul>
			${Object.entries(data.summary).map(([key, value]) => `<li>${key}: ${value}</li>`).join("\n\t\t\t")}
		</ul>
	</div>`;
		}

		html += `
	<div class="footer">
		Generated: ${new Date(data.generatedAt).toLocaleString()}
	</div>
</body>
</html>`;

		return html;
	}

	/**
	 * Download report
	 */
	download(content: string, filename: string, mimeType: string): void {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
		return path.split(".").reduce((o: Record<string, unknown> | undefined, p: string) => 
			o ? (o as Record<string, unknown>)[p] as Record<string, unknown> | undefined : undefined, 
			obj as Record<string, unknown> | undefined
		);
	}

	private formatCSVValue(value: unknown, format?: string): string {
		if (value === null || value === undefined) return '""';
		
		if (format === "date" && value) {
			return `"${new Date(value as string).toLocaleDateString()}"`;
		}
		
		if (typeof value === "string") {
			return `"${value.replace(/"/g, '""')}"`;
		}
		
		return String(value);
	}

	private formatExcelValue(value: unknown, format?: string): { type: string; formatted: string } {
		if (value === null || value === undefined) {
			return { type: "String", formatted: "" };
		}

		if (format === "number" || format === "currency") {
			return { type: "Number", formatted: String(value) };
		}

		if (format === "date" && value) {
			return { type: "String", formatted: new Date(value as string).toISOString().split("T")[0] };
		}

		if (format === "boolean") {
			return { type: "String", formatted: value ? "Yes" : "No" };
		}

		return { type: "String", formatted: String(value) };
	}

	private formatHTMLValue(value: unknown, format?: string): string {
		if (value === null || value === undefined) return "-";

		if (format === "date" && value) {
			return new Date(value as string).toLocaleDateString();
		}

		if (format === "currency" && typeof value === "number") {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
		}

		if (format === "boolean") {
			return value ? "✓" : "✗";
		}

		return String(value);
	}

	private escapeXml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
	}
}

// Webhook Service

export interface WebhookConfig {
	id: string;
	name: string;
	url: string;
	secret?: string;
	events: WebhookEvent[];
	headers?: Record<string, string>;
	enabled: boolean;
	retryCount: number;
	createdAt: string;
	lastTriggered?: string;
	lastStatus?: number;
}

export type WebhookEvent = 
	| "order.created"
	| "order.updated"
	| "order.deleted"
	| "order.status_changed"
	| "order.assigned"
	| "comment.added"
	| "asset.uploaded";

export interface WebhookPayload {
	event: WebhookEvent;
	timestamp: string;
	data: unknown;
	signature?: string;
}

export interface WebhookResult {
	success: boolean;
	statusCode?: number;
	error?: string;
	duration: number;
}

export class WebhookService {
	private webhooks: Map<string, WebhookConfig> = new Map();
	private deliveryLog: Map<string, WebhookResult[]> = new Map();

	/**
	 * Register a webhook
	 */
	register(config: Omit<WebhookConfig, "id" | "createdAt">): WebhookConfig {
		const webhook: WebhookConfig = {
			...config,
			id: `webhook_${Date.now()}`,
			createdAt: new Date().toISOString(),
		};

		this.webhooks.set(webhook.id, webhook);
		return webhook;
	}

	/**
	 * Update webhook
	 */
	update(webhookId: string, updates: Partial<WebhookConfig>): WebhookConfig | undefined {
		const webhook = this.webhooks.get(webhookId);
		if (!webhook) return undefined;

		const updated = { ...webhook, ...updates, id: webhook.id };
		this.webhooks.set(webhookId, updated);
		return updated;
	}

	/**
	 * Delete webhook
	 */
	delete(webhookId: string): boolean {
		return this.webhooks.delete(webhookId);
	}

	/**
	 * Get all webhooks
	 */
	getAll(): WebhookConfig[] {
		return [...this.webhooks.values()];
	}

	/**
	 * Trigger webhooks for an event
	 */
	async trigger(event: WebhookEvent, data: unknown): Promise<Map<string, WebhookResult>> {
		const results = new Map<string, WebhookResult>();

		const matchingWebhooks = [...this.webhooks.values()].filter(
			(w) => w.enabled && w.events.includes(event)
		);

		const promises = matchingWebhooks.map(async (webhook) => {
			const result = await this.deliver(webhook, event, data);
			results.set(webhook.id, result);

			// Update webhook status
			webhook.lastTriggered = new Date().toISOString();
			webhook.lastStatus = result.statusCode;

			// Log delivery
			const log = this.deliveryLog.get(webhook.id) ?? [];
			log.unshift(result);
			this.deliveryLog.set(webhook.id, log.slice(0, 100)); // Keep last 100
		});

		await Promise.all(promises);
		return results;
	}

	/**
	 * Deliver webhook payload
	 */
	private async deliver(
		webhook: WebhookConfig,
		event: WebhookEvent,
		data: unknown
	): Promise<WebhookResult> {
		const startTime = performance.now();

		const payload: WebhookPayload = {
			event,
			timestamp: new Date().toISOString(),
			data,
		};

		// Generate signature if secret is set
		if (webhook.secret) {
			payload.signature = await this.generateSignature(JSON.stringify(payload), webhook.secret);
		}

		try {
			const response = await fetch(webhook.url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Webhook-Event": event,
					...(payload.signature ? { "X-Webhook-Signature": payload.signature } : {}),
					...webhook.headers,
				},
				body: JSON.stringify(payload),
			});

			return {
				success: response.ok,
				statusCode: response.status,
				duration: performance.now() - startTime,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				duration: performance.now() - startTime,
			};
		}
	}

	/**
	 * Generate HMAC signature
	 */
	private async generateSignature(payload: string, secret: string): Promise<string> {
		const encoder = new TextEncoder();
		const key = await crypto.subtle.importKey(
			"raw",
			encoder.encode(secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"]
		);

		const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
		return Array.from(new Uint8Array(signature))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	}

	/**
	 * Get delivery log for webhook
	 */
	getDeliveryLog(webhookId: string): WebhookResult[] {
		return this.deliveryLog.get(webhookId) ?? [];
	}

	/**
	 * Test webhook
	 */
	async test(webhookId: string): Promise<WebhookResult> {
		const webhook = this.webhooks.get(webhookId);
		if (!webhook) {
			return { success: false, error: "Webhook not found", duration: 0 };
		}

		return this.deliver(webhook, "order.created", {
			test: true,
			message: "This is a test webhook delivery",
		});
	}
}

// Email Notification Service (Template-based)

export interface EmailTemplate {
	id: string;
	name: string;
	subject: string;
	htmlBody: string;
	textBody?: string;
	variables: string[];
}

export interface EmailConfig {
	from: string;
	replyTo?: string;
	provider: "smtp" | "sendgrid" | "ses" | "console";
}

export class EmailNotificationService {
	private templates: Map<string, EmailTemplate> = new Map();
	private config: EmailConfig = {
		from: "noreply@rkhphotoorders.com",
		provider: "console",
	};

	constructor() {
		this.initializeDefaultTemplates();
	}

	private initializeDefaultTemplates(): void {
		const templates: EmailTemplate[] = [
			{
				id: "order-created",
				name: "Order Created",
				subject: "New Photo Order: {{orderId}}",
				htmlBody: `
					<h2>New Photo Order Created</h2>
					<p>Order <strong>{{orderId}}</strong> has been created.</p>
					<ul>
						<li><strong>Type:</strong> {{orderType}}</li>
						<li><strong>Owner:</strong> {{orderOwner}}</li>
						<li><strong>Shoot Date:</strong> {{shootDate}}</li>
						<li><strong>Articles:</strong> {{articleCount}}</li>
					</ul>
					<p><a href="{{orderUrl}}">View Order</a></p>
				`,
				variables: ["orderId", "orderType", "orderOwner", "shootDate", "articleCount", "orderUrl"],
			},
			{
				id: "order-assigned",
				name: "Order Assigned",
				subject: "Order Assigned to You: {{orderId}}",
				htmlBody: `
					<h2>Order Assigned</h2>
					<p>You have been assigned to order <strong>{{orderId}}</strong>.</p>
					<p><strong>Shoot Date:</strong> {{shootDate}}</p>
					<p>{{shootBrief}}</p>
					<p><a href="{{orderUrl}}">View Order Details</a></p>
				`,
				variables: ["orderId", "shootDate", "shootBrief", "orderUrl"],
			},
			{
				id: "order-status-changed",
				name: "Order Status Changed",
				subject: "Order {{orderId}} Status: {{newStatus}}",
				htmlBody: `
					<h2>Order Status Updated</h2>
					<p>Order <strong>{{orderId}}</strong> status has changed.</p>
					<p><strong>Previous Status:</strong> {{oldStatus}}</p>
					<p><strong>New Status:</strong> {{newStatus}}</p>
					<p><strong>Changed By:</strong> {{changedBy}}</p>
					<p><a href="{{orderUrl}}">View Order</a></p>
				`,
				variables: ["orderId", "oldStatus", "newStatus", "changedBy", "orderUrl"],
			},
			{
				id: "comment-added",
				name: "New Comment",
				subject: "New Comment on Order {{orderId}}",
				htmlBody: `
					<h2>New Comment</h2>
					<p><strong>{{authorName}}</strong> commented on order <strong>{{orderId}}</strong>:</p>
					<blockquote>{{commentText}}</blockquote>
					<p><a href="{{orderUrl}}">View Order</a></p>
				`,
				variables: ["orderId", "authorName", "commentText", "orderUrl"],
			},
			{
				id: "shoot-reminder",
				name: "Shoot Reminder",
				subject: "Reminder: Photo Shoot Tomorrow - {{orderId}}",
				htmlBody: `
					<h2>Shoot Reminder</h2>
					<p>This is a reminder that you have a photo shoot scheduled for tomorrow.</p>
					<ul>
						<li><strong>Order:</strong> {{orderId}}</li>
						<li><strong>Date:</strong> {{shootDate}}</li>
						<li><strong>Location:</strong> {{shootLocation}}</li>
						<li><strong>Articles:</strong> {{articleCount}}</li>
					</ul>
					<p><a href="{{orderUrl}}">Review Order Details</a></p>
				`,
				variables: ["orderId", "shootDate", "shootLocation", "articleCount", "orderUrl"],
			},
		];

		for (const template of templates) {
			this.templates.set(template.id, template);
		}
	}

	/**
	 * Send email notification
	 */
	async send(
		templateId: string,
		to: string | string[],
		variables: Record<string, string>
	): Promise<{ success: boolean; error?: string }> {
		const template = this.templates.get(templateId);
		if (!template) {
			return { success: false, error: `Template not found: ${templateId}` };
		}

		const recipients = Array.isArray(to) ? to : [to];
		const subject = this.interpolate(template.subject, variables);
		const htmlBody = this.interpolate(template.htmlBody, variables);
		const textBody = template.textBody
			? this.interpolate(template.textBody, variables)
			: this.stripHtml(htmlBody);

		// In production, send via configured provider
		// For now, log to console
		if (this.config.provider === "console") {
			console.log("=== Email Notification ===");
			console.log(`To: ${recipients.join(", ")}`);
			console.log(`From: ${this.config.from}`);
			console.log(`Subject: ${subject}`);
			console.log(`Body:\n${textBody}`);
			console.log("==========================");
			return { success: true };
		}

		// Implement actual email sending based on provider
		return { success: true };
	}

	/**
	 * Interpolate template variables
	 */
	private interpolate(template: string, variables: Record<string, string>): string {
		return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? "");
	}

	/**
	 * Strip HTML tags for plain text
	 */
	private stripHtml(html: string): string {
		return html
			.replace(/<[^>]*>/g, "")
			.replace(/\s+/g, " ")
			.trim();
	}

	/**
	 * Get all templates
	 */
	getTemplates(): EmailTemplate[] {
		return [...this.templates.values()];
	}

	/**
	 * Update template
	 */
	updateTemplate(templateId: string, updates: Partial<EmailTemplate>): EmailTemplate | undefined {
		const template = this.templates.get(templateId);
		if (!template) return undefined;

		const updated = { ...template, ...updates, id: template.id };
		this.templates.set(templateId, updated);
		return updated;
	}

	/**
	 * Configure email settings
	 */
	configure(config: Partial<EmailConfig>): void {
		this.config = { ...this.config, ...config };
	}
}

// Export service instances
export const calendarService = new CalendarService();
export const reportExportService = new ReportExportService();
export const webhookService = new WebhookService();
export const emailNotificationService = new EmailNotificationService();
