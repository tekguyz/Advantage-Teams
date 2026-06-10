// components/dashboard/support-questions.ts

export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = [
  {
    q: "How does Advantage Software — Teams help representatives receive proper credit?",
    a: "By linking physical handset extensions directly to active CRM profiles, any client interaction is auto-routed to the correct representative. Shift leads get dynamic live charts proving authentic project engagement, giving staff proof and credit for their external work."
  },
  {
    q: "Why are some customer satisfaction surveys skipped?",
    a: "Our quality standards limit surveys to meaningful call interactions. Calls under 2 minutes are skipped to filter out answering machines, quick drops, or misdials, and client handsets are capped at 1 survey per day to block duplication."
  },
  {
    q: "What is the Focus Level metric and how is it used by Advantage Software — Teams?",
    a: "Focus level analyzes representative activity. It is calculated by dividing logged system updates by duration. If updates per hour are lower than 40%, the system flags a 'Review' tag so supervisors can easily clear or verify them manually."
  },
  {
    q: "How does the CRM database mapping synchronizer run?",
    a: "Once a call meets compliance requirements, our SMS system dispatches the survey. When the client responds, results map directly back to their CRM profile timeline so no documentation is lost."
  }
];
