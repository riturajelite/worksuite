import React, { useState } from 'react';
import { Save, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface PaymentCredentialsSettingsProps {
  onNotify: (message: string) => void;
}

export default function PaymentCredentialsSettings({ onNotify }: PaymentCredentialsSettingsProps) {
  const [activeTab, setActiveTab] = useState<'paypal' | 'stripe' | 'razorpay' | 'paystack' | 'mollie'>('paypal');

  // PayPal States
  const [paypalStatus, setPaypalStatus] = useState(false);
  const [paypalMode, setPaypalMode] = useState('sandbox');
  const [paypalClientId, setPaypalClientId] = useState('PAYPAL_CLIENT_ID_XXXX');
  const [paypalSecret, setPaypalSecret] = useState('PAYPAL_SECRET_XXXX');

  // Stripe States
  const [stripeStatus, setStripeStatus] = useState(true);
  const [stripeMode, setStripeMode] = useState('sandbox');
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_test_51...XXXX');
  const [stripeSecretKey, setStripeSecretKey] = useState('sk_test_51...XXXX');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('whsec_...XXXX');

  // Razorpay States
  const [razorpayStatus, setRazorpayStatus] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_XXXX');
  const [razorpaySecret, setRazorpaySecret] = useState('rzp_secret_XXXX');

  // Paystack States
  const [paystackStatus, setPaystackStatus] = useState(false);
  const [paystackPublic, setPaystackPublic] = useState('pk_test_paystack_XXXX');
  const [paystackSecret, setPaystackSecret] = useState('sk_test_paystack_XXXX');

  // Mollie States
  const [mollieStatus, setMollieStatus] = useState(false);
  const [mollieKey, setMollieKey] = useState('live_mollie_api_key_XXXX');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Payment Credentials saved successfully!');
  };

  return (
    <div className="space-y-6" id="payment-credentials-settings-root">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] text-slate-400 font-medium">
          Home • Settings • Payment Credentials
        </div>
        <h2 className="text-xl font-bold text-slate-800">Payment Credentials</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1.5 scrollbar-thin">
        {[
          { key: 'paypal', label: 'PayPal' },
          { key: 'stripe', label: 'Stripe' },
          { key: 'razorpay', label: 'Razorpay' },
          { key: 'paystack', label: 'Paystack' },
          { key: 'mollie', label: 'Mollie' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-xs font-bold -mb-px border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* TAB 1: PayPal */}
          {activeTab === 'paypal' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                    <span>PayPal Status</span>
                  </span>
                  <p className="text-[11px] text-slate-500">Allow customers to check out invoices via PayPal.</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  checked={paypalStatus}
                  onChange={(e) => setPaypalStatus(e.target.checked)}
                />
              </div>

              {paypalStatus && (
                <div className="space-y-4 border-t border-slate-150 pt-4">
                  {/* Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">PayPal Mode</label>
                    <select
                      className="w-64 bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      value={paypalMode}
                      onChange={(e) => setPaypalMode(e.target.value)}
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="live">Live (Real Payments)</option>
                    </select>
                  </div>

                  {/* Client ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">PayPal Client ID *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={paypalClientId}
                      onChange={(e) => setPaypalClientId(e.target.value)}
                    />
                  </div>

                  {/* Secret */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">PayPal Secret *</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={paypalSecret}
                      onChange={(e) => setPaypalSecret(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Stripe */}
          {activeTab === 'stripe' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                    <span>Stripe Status</span>
                  </span>
                  <p className="text-[11px] text-slate-500">Enable credit cards checkout on customer invoice screens.</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  checked={stripeStatus}
                  onChange={(e) => setStripeStatus(e.target.checked)}
                />
              </div>

              {stripeStatus && (
                <div className="space-y-4 border-t border-slate-150 pt-4">
                  {/* Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Stripe Mode</label>
                    <select
                      className="w-64 bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none cursor-pointer"
                      value={stripeMode}
                      onChange={(e) => setStripeMode(e.target.value)}
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="live">Live (Real Payments)</option>
                    </select>
                  </div>

                  {/* Publishable Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Stripe Publishable Key *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={stripePublishableKey}
                      onChange={(e) => setStripePublishableKey(e.target.value)}
                    />
                  </div>

                  {/* Secret Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Stripe Secret Key *</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={stripeSecretKey}
                      onChange={(e) => setStripeSecretKey(e.target.value)}
                    />
                  </div>

                  {/* Webhook Secret */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Stripe Webhook Secret</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                      value={stripeWebhookSecret}
                      onChange={(e) => setStripeWebhookSecret(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Razorpay */}
          {activeTab === 'razorpay' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                    <span>Razorpay Status</span>
                  </span>
                  <p className="text-[11px] text-slate-500">Allow customers to pay via Razorpay UPI & Cards.</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  checked={razorpayStatus}
                  onChange={(e) => setRazorpayStatus(e.target.checked)}
                />
              </div>

              {razorpayStatus && (
                <div className="space-y-4 border-t border-slate-150 pt-4">
                  {/* Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Razorpay Key *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none"
                      value={razorpayKey}
                      onChange={(e) => setRazorpayKey(e.target.value)}
                    />
                  </div>

                  {/* Secret */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Razorpay Secret *</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono font-semibold text-slate-800 focus:outline-none"
                      value={razorpaySecret}
                      onChange={(e) => setRazorpaySecret(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Paystack */}
          {activeTab === 'paystack' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                    <span>Paystack Status</span>
                  </span>
                  <p className="text-[11px] text-slate-500">Enable Paystack gateway for African continent currencies.</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  checked={paystackStatus}
                  onChange={(e) => setPaystackStatus(e.target.checked)}
                />
              </div>

              {paystackStatus && (
                <div className="space-y-4 border-t border-slate-150 pt-4">
                  {/* Public */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Paystack Public Key *</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono"
                      value={paystackPublic}
                      onChange={(e) => setPaystackPublic(e.target.value)}
                    />
                  </div>

                  {/* Secret */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Paystack Secret Key *</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono"
                      value={paystackSecret}
                      onChange={(e) => setPaystackSecret(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Mollie */}
          {activeTab === 'mollie' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                    <span>Mollie Status</span>
                  </span>
                  <p className="text-[11px] text-slate-500">Enable Mollie checkout for iDEAL, Bancontact, and SEPA.</p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  checked={mollieStatus}
                  onChange={(e) => setMollieStatus(e.target.checked)}
                />
              </div>

              {mollieStatus && (
                <div className="space-y-4 border-t border-slate-150 pt-4">
                  {/* Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Mollie API Key *</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono"
                      value={mollieKey}
                      onChange={(e) => setMollieKey(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-start pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
