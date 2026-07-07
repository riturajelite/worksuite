/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tax {
  name: string;
  rate: number; // percentage
}

export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  leadName: string;
  clientCompany: string;
  clientEmail: string;
  date: string;
  validTill: string;
  status: 'Accepted' | 'Waiting' | 'Declined' | 'Draft';
  currency: string;
  items: LineItem[];
  discount: number; // flat or percentage
  discountType: 'flat' | 'percent';
  tax: number; // percentage
  notes: string;
  attachments?: string[];
  templateName?: string;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  projectName: string;
  amount: number;
  validTill: string;
  status: 'Accepted' | 'Pending' | 'Declined' | 'Draft';
  items: LineItem[];
  discount: number;
  discountType: 'flat' | 'percent';
  tax: number;
  notes: string;
  templateName?: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  projectName: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft' | 'Sent' | 'Partial';
  billingAddress: string;
  shippingAddress: string;
  currency: string;
  exchangeRate: number;
  paymentDetails: string;
  items: LineItem[];
  discount: number;
  discountType: 'flat' | 'percent';
  tax: number;
  isRecurring: boolean;
  recurringCycle?: string; // Weekly, Monthly, Quarterly, Yearly
  timelogHours?: number;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  amount: number;
  paymentDate: string;
  gateway: string; // Stripe, PayPal, Bank Wire, Cash, Cheque
  transactionId: string;
  bankAccount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  receiptFile?: string;
}

export interface CreditNoteRecord {
  id: string;
  creditNoteNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  amount: number;
  date: string;
  reason: string;
  status: 'Applied' | 'Unused' | 'Refunded';
}

export interface ExpenseRecord {
  id: string;
  itemName: string;
  purchaseFrom: string;
  amount: number;
  purchaseDate: string;
  employeeName: string;
  projectName?: string;
  category: string; // Travel, Tech, Marketing, Office Supplies, Meals, Other
  bankAccount: string;
  currency: string;
  exchangeRate: number;
  description: string;
  billFile?: string;
  isRecurring: boolean;
  recurringInterval?: string; // Monthly, Yearly
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface BankAccountRecord {
  id: string;
  name: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  sortCode: string;
  accountType: 'Checking' | 'Savings' | 'Credit Card' | 'Cash / Vault';
  currency: string;
  openingBalance: number;
  currentBalance: number;
  contactNumber: string;
  status: 'Active' | 'Inactive';
  logoUrl?: string;
}
