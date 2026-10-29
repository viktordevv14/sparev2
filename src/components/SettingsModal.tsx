import React, { useState } from 'react';
import { InventorySettings, AdminAccount } from '../types/inventory';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Save, 
  Check, 
  AlertTriangle, 
  Download, 
  Upload, 
  Database, 
  RefreshCw, 
  CheckCircle2,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { checkFirebaseConnection, FirebaseConnectionStatus } from '../lib/firebase';
import { COMPANY_ADMIN_ACCOUNT } from '../data/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InventorySettings;
  onSaveSettings: (settings: InventorySettings) => void;
  onResetData: () => void;
  onBackupJson: () => void;
  onRestoreJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adminAccounts?: AdminAccount[];
  currentAdmin?: AdminAccount | null;
  onSaveAdminAccount?: (account: AdminAccount) => void;
  onDeleteAdminAccount?: (id: string) => void;
  onSignInGoogle?: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetData,
  onBackupJson,
  onRestoreJson,
  adminAccounts = [],
  currentAdmin,
}) => {
  const [form, setForm] = useState<InventorySettings>(() => ({
    ...settings,
    adminAccessCode: settings.adminPassword || settings.adminAccessCode || 'Panzer@2026',
    adminPassword: settings.adminPassword || settings.adminAccessCode || 'Panzer@2026',
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [testingFirebase, setTestingFirebase] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseConnectionStatus | null>(null);

  if (!isOpen) return null;

  const companyAdmin = adminAccounts[0] || currentAdmin || COMPANY_ADMIN_ACCOUNT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: InventorySettings = {
      ...form,
      adminAccessCode: form.adminPassword || form.adminAccessCode || 'Panzer@2026',
      adminPassword: form.adminPassword || form.adminAccessCode || 'Panzer@2026',
    };
    onSaveSettings(updatedSettings);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleTestFirebase = async () => {
    setTestingFirebase(true);
    try {
      const res = await checkFirebaseConnection();
      setFirebaseStatus(res);
    } catch {
      setFirebaseStatus({
        connected: false,
        message: 'Connection check timed out or failed.',
      });
    } finally {
      setTestingFirebase(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">Store & Administrative Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {savedNotice && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. COMPANY ADMIN ACCOUNT & PASSWORD AUTHENTICATION            */}
          {/* ============================================================= */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-800" />
                <span className="font-bold text-slate-900 text-xs">Company Administrator Account</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-emerald-400 font-bold">
                SOLE SUPER ADMIN
              </span>
            </div>

            {/* Admin Profile Box */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 truncate">
                      {companyAdmin.displayName || 'Panzer Company Administrator'}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block truncate">
                    {companyAdmin.email || 'admin@panzerautoparts.co.ke'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold shrink-0">
                Active Owner
              </span>
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Company Admin Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.adminPassword || form.adminAccessCode || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      adminPassword: val,
                      adminAccessCode: val,
                    });
                  }}
                  placeholder="e.g. Panzer@2026"
                  className="w-full p-2 bg-white border border-slate-300 focus:border-slate-900 rounded-lg font-mono text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Required to access the Admin Management Portal from the storefront.
              </span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 2. CURRENCY & EXCHANGE RATES                                  */}
          {/* ============================================================= */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Currency Symbol
              </label>
              <input
                type="text"
                required
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: KSh</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Currency Code (ISO)
              </label>
              <input
                type="text"
                required
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Default: KES</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                USD to KSh Rate
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={form.usdToKshRate || 130}
                onChange={(e) => setForm({ ...form, usdToKshRate: parseFloat(e.target.value) || 130 })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">1 USD = {form.usdToKshRate || 130} KSh</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                VAT / Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={form.defaultTaxRatePercent}
                onChange={(e) => setForm({ ...form, defaultTaxRatePercent: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Standard VAT rate</span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 3. BUSINESS DETAILS FOR INVOICES                              */}
          {/* ============================================================= */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Business / Company Name
            </label>
            <input
              type="text"
              required
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Physical Warehouse Address
            </label>
            <input
              type="text"
              value={form.businessAddress}
              onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="text"
                value={form.businessPhone}
                onChange={(e) => setForm({ ...form, businessPhone: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Business Email
              </label>
              <input
                type="email"
                value={form.businessEmail || ''}
                onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
                placeholder="orders@panzerautoparts.co.ke"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                BRS Company Reg #
              </label>
              <input
                type="text"
                value={form.businessRegNumber || ''}
                onChange={(e) => setForm({ ...form, businessRegNumber: e.target.value })}
                placeholder="e.g. PVT-EYU7821 / CPR/2021/849204"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                M-Pesa Paybill No.
              </label>
              <input
                type="text"
                value={form.mpesaPaybillNumber || ''}
                onChange={(e) => setForm({ ...form, mpesaPaybillNumber: e.target.value })}
                placeholder="e.g. 849204"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                M-Pesa Buy Goods Till
              </label>
              <input
                type="text"
                value={form.mpesaTillNumber || ''}
                onChange={(e) => setForm({ ...form, mpesaTillNumber: e.target.value })}
                placeholder="e.g. 948201"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          {/* ============================================================= */}
          {/* 4. CLOUD DATABASE SYNCHRONIZATION                             */}
          {/* ============================================================= */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Database Synchronization</span>
              </span>
              <button
                type="button"
                onClick={handleTestFirebase}
                disabled={testingFirebase}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${testingFirebase ? 'animate-spin' : ''}`} />
                <span>{testingFirebase ? 'Testing Connection...' : 'Test Database Connection'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Live Status:</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Cloud Database Active</span>
                </span>
              </div>

              {firebaseStatus && (
                <div className={`mt-2 p-2.5 rounded-lg border flex items-center gap-2 ${
                  firebaseStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium text-xs">{firebaseStatus.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* 5. DATA BACKUP & RESTORE                                      */}
          {/* ============================================================= */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block font-semibold text-slate-700 mb-2">
              Database Backup & Portability
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBackupJson}
                className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Full Backup (JSON)</span>
              </button>

              <label className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onRestoreJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ============================================================= */}
          {/* 6. RESET DEMO DATA                                            */}
          {/* ============================================================= */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block font-semibold text-rose-700 mb-1">
              Reset System Data
            </span>
            <p className="text-[11px] text-slate-500 mb-2">
              Reset inventory catalog, stock levels, and sales ledger back to the preloaded automotive demonstration database.
            </p>
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Catalog</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Are you sure? This will replace your current edits with initial sample parts.</span>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetData();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer"
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
