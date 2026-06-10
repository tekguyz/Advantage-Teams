// components/dashboard/support-questions.ts

export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = [
  {
    q: "How does this platform help our team members?",
    a: "It automatically connects call details directly to client profiles. This ensures reps receive instant, accurate credit for helping customers, completely removing the need for manual logs or reports."
  },
  {
    q: "How does the automatic customer survey work?",
    a: "After a customer wraps up a helpful chat, they receive a simple feedback question. Their rating is instantly saved back to their history so supervisors can see team achievements and highlight success stories."
  },
  {
    q: "Why are some calls kept out of the survey system?",
    a: "We want to respect our customers' time. The system ignores very short calls under two minutes (like quick misdials or busy signals) and limits surveys to a maximum of one request per customer each day."
  },
  {
    q: "What do the 'Review' status tags mean?",
    a: "These flags highlight team members who might need quick assistance or setup checks. Supervisors can easily look over these records and clear the alert with a single click in the Team Performance board."
  }
];
