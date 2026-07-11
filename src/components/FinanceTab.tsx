/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CreditCard, FileText, Plus, DollarSign, TrendingUp, TrendingDown,
  Building, HardDrive, FileSpreadsheet, Users, Box, ClipboardCheck, Trash2
} from 'lucide-react';
import { Invoice, Expense, Client, Project, Employee } from '../types';

// Import our modular submodules
import ProposalView from './finance/ProposalView';
import EstimateView from './finance/EstimateView';
import InvoiceView from './finance/InvoiceView';
import PaymentView from './finance/PaymentView';
import CreditNoteView from './finance/CreditNoteView';
import ExpenseView from './finance/ExpenseView';
import BankAccountView from './finance/BankAccountView';
import OrdersView from './finance/OrdersView';

interface FinanceTabProps {
  subTab: string;
  invoices: Invoice[];
  expenses: Expense[];
  clients: Client[];
  projects: Project[];
  employees: Employee[];
  onAddExpense: (expense: any) => void;
  onApproveExpense: (id: string, status: 'Approved' | 'Rejected') => void;
  onPayInvoice: (id: string) => void;
  onAddLocalInvoice: (invoice: any) => void;
}

export default function FinanceTab({
  subTab,
  invoices,
  expenses,
  clients,
  projects,
  employees,
  onAddExpense,
  onApproveExpense,
  onPayInvoice,
  onAddLocalInvoice
}: FinanceTabProps) {

  // Fallback / legacy fields for non-converted subtabs (orders/vendors)
  const customerOrders = [
    { id: 'ORD-55', item: 'Worksuite Custom Deployment Bundle', client: 'Cyberdyne Systems', amount: 12500, status: 'Processing', date: '2026-06-28' },
    { id: 'ORD-54', item: 'Premium Dev Seat Add-on (x5)', client: 'Wayne Enterprises', amount: 1200, status: 'Completed', date: '2026-06-20' },
  ];

  const vendorProducts = [
    { name: 'GCP Kubernetes Node Resource Plan', sku: 'SKU-GCP-KUBE', price: 1200, stock: 'Infinite' },
    { name: 'Workplace Dual Ergonomic Standing Desk', sku: 'SKU-FURN-DESK', price: 450, stock: 12 },
  ];

  const vendorBills = [
    { billNum: 'BIL-GCP-88', vendor: 'Google Cloud Platform', amount: 4500, dueDate: '2026-07-15', status: 'Paid' },
    { billNum: 'BIL-DEP-11', vendor: 'Office Depot', amount: 899, dueDate: '2026-07-20', status: 'Pending' },
  ];

  const getTabTitleAndDesc = () => {
    switch (subTab) {
      case 'proposals':
        return {
          title: 'Client Proposals',
          desc: 'Formulate, design, print, and track commercial proposals and agreements.'
        };
      case 'estimates':
        return {
          title: 'Project Estimates',
          desc: 'Generate project estimations, export PDFs, and easily convert them into commercial invoices.'
        };
      case 'invoices':
        return {
          title: 'Invoices Issued',
          desc: 'Oversee corporate invoices, billing addresses, partial payments, and overdue tracking.'
        };
      case 'payments':
        return {
          title: 'Payments Received',
          desc: 'Log multi-gateway transaction codes, target bank accounts, and uploaded receipt images.'
        };
      case 'creditnotes':
        return {
          title: 'Credit Notes',
          desc: 'Handle ledger adjustments, unused subscription refunds, and invoice link offsets.'
        };
      case 'expenses':
        return {
          title: 'General Expenses',
          desc: 'Audit operational purchases, travel expenses, tech node costs, and employee bills.'
        };
      case 'bankaccounts':
        return {
          title: 'Bank Accounts & Cash',
          desc: 'Audit treasury balances, route codes, and custom institution logs.'
        };
      case 'orders':
        return {
          title: 'Customer Orders',
          desc: 'Monitor checkout operations and product fulfillment queues.'
        };
      default:
        return {
          title: 'Vendors Space Portal',
          desc: 'Oversee inbound supplier invoices and software catalog stock.'
        };
    }
  };

  const { title, desc } = getTabTitleAndDesc();

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight capitalize">
            {title}
          </h2>
          <p className="text-xs text-slate-500 font-medium">{desc}</p>
        </div>
      </div>

      {/* Render modular subtabs dynamically */}
      {subTab === 'proposals' && (
        <ProposalView clients={clients} />
      )}

      {subTab === 'estimates' && (
        <EstimateView 
          clients={clients} 
          projects={projects} 
          onAddInvoiceFromEstimate={(inv) => {
            onAddLocalInvoice(inv);
            alert(`Estimate converted to Invoice ${inv.invoiceNumber} successfully! See Invoices Issued.`);
          }} 
        />
      )}

      {subTab === 'invoices' && (
        <InvoiceView 
          invoices={invoices} 
          clients={clients} 
          projects={projects} 
          onPayInvoice={onPayInvoice}
          onAddLocalInvoice={onAddLocalInvoice}
        />
      )}

      {subTab === 'payments' && (
        <PaymentView 
          invoices={invoices} 
          onAddPayment={(invoiceId, amount) => {
            // mark invoice as paid if full or partial
            onPayInvoice(invoiceId);
          }} 
        />
      )}

      {subTab === 'creditnotes' && (
        <CreditNoteView invoices={invoices} />
      )}

      {subTab === 'expenses' && (
        <ExpenseView 
          expenses={expenses}
          employees={employees}
          projects={projects}
          onAddExpense={(exp) => {
            onAddExpense({
              itemName: exp.itemName,
              purchaseFrom: exp.purchaseFrom,
              amount: exp.amount,
              employeeName: exp.employeeName
            });
          }}
          onApproveExpense={(id) => {
            onApproveExpense(id, 'Approved');
          }}
        />
      )}

      {subTab === 'bankaccounts' && (
        <BankAccountView />
      )}

      {/* Legacy/Fallback Views: Customer Orders */}
      {subTab === 'orders' && (
        <OrdersView 
          clients={clients}
          projects={projects}
          employees={employees}
        />
      )}

      {/* Legacy/Fallback Views: Vendors Space */}
      {subTab === 'vendors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Purchase Catalog / Products</h4>
                <Box className="h-4 w-4 text-slate-400" />
              </div>
              <div className="divide-y divide-slate-100">
                {vendorProducts.map((p, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${p.price}</p>
                      <p className="text-[10px] text-slate-500">Stock: {p.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bills */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Vendor Inbound Bills</h4>
                <ClipboardCheck className="h-4 w-4 text-slate-400" />
              </div>
              <div className="divide-y divide-slate-100">
                {vendorBills.map((b, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{b.billNum}</p>
                      <p className="text-slate-500 font-semibold text-[11px]">{b.vendor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${b.amount}</p>
                      <span className={`inline-block text-[9px] font-bold px-1.5 rounded ${
                        b.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
