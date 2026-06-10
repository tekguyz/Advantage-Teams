// components/dashboard/support-questions.ts

export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = [
  {
    q: "How do I get credit for my calls?",
    a: "Our system connects physical phone logs directly to customer files, so call completions are credited automatically. You don't need to write manual logs or reports—just focus on helping customers, and the platform handles the tracking in the background."
  },
  {
    q: "How does the outbound survey work?",
    a: "Once a call lasting longer than two minutes wraps up, the system safely texts the customer a quick satisfaction rating. This prevents billing misdials or busy signals from sending blank requests, and ensures high-quality customer insights."
  },
  {
    q: "Where do customer ratings go?",
    a: "All satisfaction ratings are instantly linked to the customer's history. They also update your performance scores in real time on this dashboard, allowing team leads to easily highlight and celebrate great service."
  },
  {
    q: "How do I clear a review flag?",
    a: "If a focus alarm triggers a review tag, supervisors can easily look over the active assignment details on the 'Team Performance' board and clear the alert with a single click—no complex overrides or administrative work required."
  }
];
