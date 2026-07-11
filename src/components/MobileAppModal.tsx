import React, { useState, useEffect } from 'react';
import { X, Smartphone, Play, Apple, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DownloadStatus = 'idle' | 'loading-android' | 'loading-ios' | 'success-android' | 'success-ios';

export default function MobileAppModal({ isOpen, onClose }: MobileAppModalProps) {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'loading-android' || status === 'loading-ios') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus(status === 'loading-android' ? 'success-android' : 'success-ios');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [status]);

  if (!isOpen) return null;

  const startAndroidDownload = () => {
    window.open('https://play.google.com/store/apps/details?id=com.froiden.worksuite', '_blank', 'noopener,noreferrer');
    setStatus('loading-android');
  };

  const startIosDownload = () => {
    window.open('https://apps.apple.com/us/app/worksuite/id1485601174', '_blank', 'noopener,noreferrer');
    setStatus('loading-ios');
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="font-bold text-slate-800 text-sm">Mobile App</span>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-10 flex flex-col items-center bg-slate-50/30">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            Download Mobile App
          </h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            Get mobile app on Android and iOS.
          </p>

          {/* Card Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-xs space-y-6">
            {/* Inner Card Title */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 text-sm">Download Mobile App</h3>
                <p className="text-xs text-slate-500 mt-0.5">Android and iOS links</p>
              </div>
            </div>

            {/* Interactive Screen States */}
            {status === 'idle' && (
              <div className="space-y-3">
                {/* Google Play Button */}
                <button
                  onClick={startAndroidDownload}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/10 text-slate-700 font-semibold text-sm transition-all duration-150 cursor-pointer hover:shadow-xs group"
                >
                  <Play className="h-4.5 w-4.5 fill-slate-700 group-hover:fill-indigo-600 text-slate-700 group-hover:text-indigo-600 transition-colors shrink-0" />
                  <span>Google Play</span>
                </button>

                {/* App Store Button */}
                <button
                  onClick={startIosDownload}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/10 text-slate-700 font-semibold text-sm transition-all duration-150 cursor-pointer hover:shadow-xs group"
                >
                  <Apple className="h-4.5 w-4.5 text-slate-700 group-hover:text-indigo-600 transition-colors shrink-0" />
                  <span>App Store</span>
                </button>
              </div>
            )}

            {(status === 'loading-android' || status === 'loading-ios') && (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                    {status === 'loading-android' ? 'Preparing Android APK Package...' : 'Securing App Store Connection...'}
                  </span>
                  <span>{progress}%</span>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {(status === 'success-android' || status === 'success-ios') && (
              <div className="py-2 text-center space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {status === 'success-android' ? 'Android Package Ready!' : 'iOS Link Activated!'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    {status === 'success-android' 
                      ? 'The Worksuite Mobile App download has started successfully. Check your browser downloads for the APK file!'
                      : 'Connecting you to the official Apple App Store for Worksuite. If it doesn\'t open, scan the QR Code from your console.'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer pt-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Download Again</span>
                </button>
              </div>
            )}

            {/* Inner Card Footer Label */}
            <p className="text-[11px] text-slate-400 text-center select-none pt-1">
              Use these links to install the official mobile app.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
