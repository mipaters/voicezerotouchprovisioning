export type Autonomy = "Autonomous" | "Autonomous + guardrail" | "Human approval on exception";

export interface AgentProfile {
  id: string;
  role: string;
  inputs: string;
  outputs: string;
  tools: string[];
  autonomy: Autonomy;
  build: string;
}

export const AGENT_PROFILES: AgentProfile[] = [
  { id: "sales", role: "Converses with the customer, qualifies need, recommends lines/package, upsells, reads back the order.", inputs: "WhatsApp messages, profile, quote", outputs: "Structured order intent (lines, numbers, package, date)", tools: ["WhatsApp Business Platform", "Quote API", "Catalog"], autonomy: "Autonomous + guardrail", build: "Foundry agent (LLM) with a grounded product catalog, scripted fallbacks and a pricing tool; never free-forms prices" },
  { id: "profiler", role: "Looks up the existing account, PII, services and serviceability so the customer is never re-asked.", inputs: "Business name / address", outputs: "Verified account profile + serviceability", tools: ["Salesforce", "iComms", "Serviceability DB"], autonomy: "Autonomous", build: "Read-only MCP tools; PII masked in traces; entity-match confidence threshold, otherwise ask the customer" },
  { id: "order", role: "Creates account, quote and order; tokenizes payment reference.", inputs: "Confirmed order intent", outputs: "Salesforce order, iComms billing account", tools: ["Salesforce", "iComms", "Payment gateway (hosted)"], autonomy: "Autonomous + guardrail", build: "Deterministic API calls behind an idempotent order service; the LLM only fills the schema, validated before submit" },
  { id: "port", role: "Verifies port eligibility from the bill, stages port-in requests, reserves CNAM and new numbers.", inputs: "Bill image, numbers, signed LOA", outputs: "Portability result, staged port requests", tools: ["Document Intelligence", "LNP/NPAC", "CNAM DB"], autonomy: "Human approval on exception", build: "Document Intelligence for OCR; rule-based LNP checks; rejects (name/PIN mismatch) route to a human porting desk" },
  { id: "compliance", role: "Validates E911 address and regulatory requirements before anything is activated.", inputs: "Service address, numbers", outputs: "E911 registration, compliance flags", tools: ["E911 DB", "MSAG validation"], autonomy: "Human approval on exception", build: "Rules engine first, LLM only for explanation; any failed validation blocks activation" },
  { id: "orchestrator", role: "Prioritizes and routes orders (SMB fast lane vs enterprise), owns the workflow state.", inputs: "Created order", outputs: "Routing decision, task graph", tools: ["Workflow engine", "Service Bus"], autonomy: "Autonomous", build: "Durable workflow (Azure Durable Functions / Logic Apps) with agent steps as activities; priority from policy tables" },
  { id: "provisioning", role: "Provisions users, numbers, hunt group, voicemail, auto-attendant and Teams integration.", inputs: "Order + staged numbers", outputs: "Configured BroadWorks group", tools: ["Cisco BroadWorks (OCI-P / Xsi APIs)"], autonomy: "Autonomous + guardrail", build: "Typed BroadWorks tool functions; dry-run diff before commit; rollback on partial failure" },
  { id: "netconfig", role: "Configures gateway and CPE profiles for voice.", inputs: "Provisioned service, device inventory", outputs: "Device profile pushed and verified", tools: ["Device mgmt / ACS (TR-069)"], autonomy: "Autonomous + guardrail", build: "Templated device profiles; agent selects the template and verifies registration" },
  { id: "scheduling", role: "Decides self-install vs technician from CPE, offers real slots, verifies the date.", inputs: "CPE/wiring data, calendars", outputs: "Truck-roll decision, held slot", tools: ["Field Service"], autonomy: "Autonomous + guardrail", build: "Eligibility rules decide the truck roll; the agent only presents slots returned by Field Service" },
  { id: "activation", role: "On the chosen date, asks the customer to accept, concludes the port and runs the test call.", inputs: "Accepted activation, port due date", outputs: "Live service, test-call result", tools: ["BroadWorks", "LNP/NPAC", "WhatsApp template message"], autonomy: "Human approval on exception", build: "Event-driven on the FOC date; automatic rollback to the old carrier path if the test call fails" },
  { id: "quality", role: "Guardrail: validates all essentials are captured before submission and asks for missing items.", inputs: "Full order draft", outputs: "Pass / list of missing essentials", tools: ["Essentials schema", "All systems (read)"], autonomy: "Autonomous", build: "Schema + business-rule validator as a hard gate; the LLM phrases the follow-up question only" },
];

export const LAYERS = [
  { name: "Channel", color: "#25D366", items: ["WhatsApp Business Platform (Cloud API)", "Webhook gateway (Azure Container Apps)", "Secure hosted payment page (PCI PSP)", "E-sign for LOA"] },
  { name: "Agent orchestration", color: "#0099D8", items: ["Microsoft Foundry Agent Service", "Orchestrator + 10 specialist agents", "Agent Framework / Semantic Kernel", "Prompt + policy versioning"] },
  { name: "Tool & integration layer", color: "#6C5CE7", items: ["MCP servers + Azure API Management", "Salesforce · iComms · BroadWorks", "LNP/NPAC · CNAM · E911", "Field Service · Device mgmt / ACS"] },
  { name: "State & workflow", color: "#E17055", items: ["Durable workflow + Service Bus events", "Cosmos DB (conversation + order state)", "Blob Storage (bills, LOAs)", "Document Intelligence (OCR)"] },
  { name: "Trust, security & operations", color: "#A29BFE", items: ["Entra ID + managed identities, Key Vault", "Content Safety + prompt-injection shields", "Azure Monitor / App Insights tracing", "Human-in-the-loop approvals (Teams)"] },
];

export const GUARDRAILS = [
  ["LLM proposes, systems decide", "Prices, eligibility, truck-roll and port validity come from deterministic tools and rules, not model text."],
  ["Quality Agent hard gate", "No order is submitted until all six essentials validate."],
  ["Payment stays out of chat", "Card data is only ever entered on a hosted PCI page; only a token is stored."],
  ["PII minimization", "Masked in traces; least-privilege managed identities per agent; read-only where possible."],
  ["Human-in-the-loop for exceptions", "Port rejects, E911 failures and low-confidence matches create a task for a person with full context."],
  ["Full audit trail", "Every tool call, decision and latency is traced and replayable, matching the agent trace shown in the demo."],
];

export const ROADMAP = [
  ["Phase 1 · Pilot", "SMB voice adds for existing Internet customers, port-in only, human review of every order in shadow mode."],
  ["Phase 2 · Scale", "Autonomous for low-risk orders; add new-number, mobile and Teams bundles; self-install by default."],
  ["Phase 3 · Expand", "Moves/adds/changes, billing questions, and larger multi-site SMB orders; more channels (SMS, web chat)."],
];

export const DECISIONS = [
  "System-of-record boundaries: which writes may agents perform without approval?",
  "Port-in volumes and reject rates to size the human porting desk.",
  "WhatsApp consent, opt-in and data-retention policy with Legal/Privacy.",
  "Success metrics: time to order, first-time-right rate, care-call deflection.",
];
