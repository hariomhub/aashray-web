export const productDetails: Record<string, { bold: string; text: string }[]> = {
  "compliancequest": [
    { bold: "Role-Based Learning", text: "Automatically tailor compliance learning to a person's role, department, seniority and responsibilities so employees learn what actually applies to them." },
    { bold: "AI Regulatory Expert", text: "Ask questions about regulations in natural language and get simple, contextual explanations, examples and guidance instead of having to read lengthy regulatory documents." },
    { bold: "Personalized Learning Paths", text: "Create individual learning journeys based on role, regulatory requirements, knowledge gaps and assigned compliance topics." },
    { bold: "Interactive Learning & Assessments", text: "Combine short lessons, videos, questions, scenarios, quizzes and assessments to make compliance learning more engaging and measurable." },
    { bold: "Gamification & Progress Tracking", text: "Use scores, badges, streaks, leaderboards and progress dashboards to encourage employees to complete their learning and improve knowledge." },
    { bold: "Multilingual & Voice AI", text: "Allow users to interact with the regulatory expert using voice and multiple languages, making complex compliance topics easier to understand." },
    { bold: "Central Regulatory Content Updates", text: "Maintain regulatory learning centrally so updates to regulations and compliance content can be distributed to customer environments while allowing organizations to control what they activate." }
  ],
  "niyamsaathi": [
    { bold: "Compliance Control Management", text: "Create, assign and track compliance controls across teams, departments, locations and regulations." },
    { bold: "AI Evidence Checker", text: "Upload evidence and let AI determine whether it sufficiently addresses the control, explain gaps and identify what additional evidence may be required." },
    { bold: "AI Compliance Advisor", text: "Ask questions about controls and receive practical guidance on what needs to be done, what evidence is expected and where gaps may exist." },
    { bold: "Cross-Regulation Control Mapping", text: "Identify similar requirements across different regulations and reuse relevant controls and evidence instead of starting from scratch for every framework." },
    { bold: "Auditor Workspace", text: "Give internal and external auditors structured access to controls, evidence, findings and audit trails needed for review." },
    { bold: "Executive Compliance Dashboard", text: "Give executives a consolidated view of readiness, risks, outstanding controls, overdue actions, business units and progress." },
    { bold: "ComplianceQuest Integration", text: "Connect compliance learning completion with control readiness so organizations can see whether required employee learning has been completed alongside compliance activities." }
  ],
  "e-sehmati": [
    { bold: "Consent Management", text: "Capture, record, update, withdraw and manage customer consent throughout its lifecycle with a complete history of each consent transaction." },
    { bold: "API-First Consent Gateway", text: "Organizations can integrate E-Sehmati into their existing mobile apps, websites, CRM systems and other customer-facing applications through APIs." },
    { bold: "Omnichannel Consent", text: "Manage consent whether the customer interacts digitally, visits a branch, uses a call center or provides consent through an offline/paper process that is subsequently digitized." },
    { bold: "Data Principal Rights", text: "Manage privacy requests through a structured workflow covering request, verification, assignment, action, SLA tracking and completion." },
    { bold: "Child Consent", text: "Support parent/guardian consent journeys using mobile-number and OTP-based verification, with the consent transaction and verification journey maintained as evidence." },
    { bold: "DPO Privacy Dashboard", text: "Give privacy teams visibility into consent status, withdrawals, purposes, requests, SLAs, trends and outstanding privacy actions." },
    { bold: "Governed Data Lifecycle", text: "Support controlled deletion workflows with soft deletion and integration with Microsoft Purview Data Lifecycle Management and Microsoft Audit, while keeping the architecture extensible for other lifecycle platforms." }
  ],
  "tprm": [
    { bold: "Vendor Risk Assessment", text: "Assess third parties using risk-based questionnaires and regulatory requirements to understand the risks associated with each vendor." },
    { bold: "Secure Vendor Portal", text: "Give vendors a controlled workspace to complete assessments, submit information and upload supporting evidence." },
    { bold: "AI Evidence Validation", text: "Use AI to review vendor evidence, identify missing or insufficient documents and help teams validate whether submitted evidence addresses the requirement." },
    { bold: "Vendor Lifecycle Management", text: "Manage vendors from initial onboarding and assessment through approval, periodic reassessment, monitoring and eventual offboarding." },
    { bold: "Regulation-Aware Assessments", text: "Build assessments around applicable privacy, cybersecurity and regulatory requirements rather than relying only on generic vendor questionnaires." },
    { bold: "Contract & DPA Intelligence", text: "Analyze vendor contracts and DPAs to identify important privacy, security and compliance provisions, missing requirements and renewal/expiry obligations." },
    { bold: "Executive Third-Party Risk Dashboard", text: "Give leadership a consolidated view of vendor risk, high-risk suppliers, outstanding evidence, expiring documents, assessments and remediation requirements." }
  ],
  "surveillance": [
    { bold: "Multi-Vendor Camera Support", text: "Monitor feeds from different camera vendors without requiring a separate vendor-specific SDK for each camera system." },
    { bold: "Built-In Video Object Detection", text: "Identify configurable visual objects such as people, bags, vehicles and other supported sensitive video objects." },
    { bold: "Natural-Language Rule Creation", text: "Describe a video security policy in plain language and turn it into a structured detection rule." },
    { bold: "Context-Aware Video Rules", text: "Create rules using object type, color, speed, count, time of day, sequences and relationships between objects." },
    { bold: "Time & Sequence Intelligence", text: "Detect patterns that depend on what happened before or after another event, including ordered events and time-based conditions." },
    { bold: "DLP-Style Alerts", text: "When video activity matches a configured rule, generate an alert that can be reviewed as a potential video security incident." },
    { bold: "Human-in-the-Loop Incident Handling", text: "AI and rule logic help identify and correlate potential incidents, while a human remains responsible for reviewing and deciding the appropriate action." }
  ],
  "safe-gen": [
    { bold: "Personalized Digital Nudges", text: "Instead of simply blocking activity, Safe Gen gives children contextual nudges that help them recognize what they are doing and make better choices." },
    { bold: "Adaptive Child Experience", text: "Adjust the type, timing and style of guidance according to the child's age, behavior patterns, context and previous response to interventions." },
    { bold: "Self-Correction Model", text: "Encourage children to recognize their own behavior and choose healthier actions, building habits rather than creating dependence on parental intervention." },
    { bold: "Parent Privacy Controls", text: "Allow parents to choose how much sensitive behavioral information they want to see, rather than making detailed child activity automatically visible." },
    { bold: "Anonymous School Insights", text: "Give schools class-level and aggregated insights without directly identifying individual students in the normal teacher experience." },
    { bold: "Controlled Exceptional Access", text: "Individual identity can be accessed only through an authorized, exceptional administrative process, with appropriate controls and auditability." },
    { bold: "Cross-Device Digital Wellbeing", text: "Provide a consistent wellbeing framework across supported child devices and environments, including home and school contexts." }
  ],
  "protection-mark": [
    { bold: "Always-On Visible Watermark", text: "Keep sensitive information visibly associated with the user and device while it is displayed on screen." },
    { bold: "Configurable Identity Markers", text: "Configure the information displayed in the watermark, such as user identity, device information, date/time, organization or classification." },
    { bold: "Screenshot Protection", text: "When supported screen-capture methods are used, the visible watermark remains associated with the captured content, making the source easier to identify." },
    { bold: "Screen-Sharing Protection", text: "Keep the watermark visible when protected content is presented or shared through virtual meeting environments such as Teams or Zoom." },
    { bold: "Camera-Photo Deterrence", text: "Because the watermark is already displayed on the screen, photographs taken of sensitive content can retain the identifying information." },
    { bold: "Invisible Ink", text: "Add a hidden pattern/code to protected screen content as an additional layer of protection beyond the visible watermark." },
    { bold: "Policy-Based Protection", text: "Configure where and how ProtectionMark is applied based on organizational security policies, users, devices and content sensitivity." }
  ]
};
