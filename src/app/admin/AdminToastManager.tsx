'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'welcome' | 'uploaded' | 'saved' | 'info' | 'error';
  duration?: number;
}

export default function AdminToastManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id, duration: toast.duration || 4500 };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    // 1. Initial "Welcome Admin" Toast on first session visit
    if (typeof window !== 'undefined') {
      const welcomed = sessionStorage.getItem('admin_welcome_shown');
      if (!welcomed) {
        sessionStorage.setItem('admin_welcome_shown', 'true');
        addToast({
          title: 'Welcome Admin 👋',
          message: 'Atharva Real Infra Control Panel is active & ready.',
          type: 'welcome',
          duration: 4500
        });
      }
    }

    // 2. Custom global window event listener
    const handleCustomToast = (event: any) => {
      if (event.detail) {
        addToast(event.detail);
      }
    };
    window.addEventListener('admin-toast', handleCustomToast);

    // Global method for direct triggering
    (window as any).showAdminToast = (title: string, message: string, type: ToastItem['type'] = 'saved') => {
      addToast({ title, message, type });
    };

    return () => {
      window.removeEventListener('admin-toast', handleCustomToast);
    };
  }, []);

  // 3. Listen to URL Search Query Params (e.g. ?toast=uploaded, ?toast=saved, ?toast=welcome)
  useEffect(() => {
    if (!searchParams) return;
    const toastParam = searchParams.get('toast');
    
    if (toastParam === 'uploaded') {
      addToast({
        title: 'Properties Successfully Uploaded 🎉',
        message: 'Your property listing has been published to the live website.',
        type: 'uploaded',
        duration: 5000
      });
      clearToastParam();
    } else if (toastParam === 'bulk_uploaded') {
      addToast({
        title: 'Bulk Properties Uploaded 📊',
        message: 'All properties from the Excel sheet have been imported & published!',
        type: 'uploaded',
        duration: 5500
      });
      clearToastParam();
    } else if (toastParam === 'saved') {
      addToast({
        title: 'Changes Done ✨',
        message: 'Your updates and configuration changes were saved successfully.',
        type: 'saved',
        duration: 4500
      });
      clearToastParam();
    } else if (toastParam === 'welcome') {
      addToast({
        title: 'Welcome Admin 👋',
        message: 'Atharva Real Infra Control Panel is active & ready.',
        type: 'welcome',
        duration: 4500
      });
      clearToastParam();
    }
  }, [searchParams, pathname]);

  const clearToastParam = () => {
    if (typeof window !== 'undefined' && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('toast');
      window.history.replaceState({}, document.title, url.toString());
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '420px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((t) => {
        let borderColor = '#C9A24E'; // Gold default
        let icon = '✨';
        let bgGradient = 'linear-gradient(135deg, #0C241C 0%, #163E32 100%)';

        if (t.type === 'welcome') {
          borderColor = '#C9A24E';
          icon = '👋';
        } else if (t.type === 'uploaded') {
          borderColor = '#10B981';
          icon = '🎉';
          bgGradient = 'linear-gradient(135deg, #064E3B 0%, #0C241C 100%)';
        } else if (t.type === 'saved') {
          borderColor = '#3B82F6';
          icon = '✨';
        } else if (t.type === 'error') {
          borderColor = '#EF4444';
          icon = '⚠️';
          bgGradient = 'linear-gradient(135deg, #450A0A 0%, #0C241C 100%)';
        }

        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              background: bgGradient,
              border: `1.5px solid ${borderColor}`,
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4), 0 0 15px rgba(201, 162, 78, 0.15)',
              borderRadius: '12px',
              padding: '16px 18px',
              color: '#F7F4EC',
              position: 'relative',
              overflow: 'hidden',
              animation: 'adminToastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <style>{`
              @keyframes adminToastSlideIn {
                from { opacity: 0; transform: translateY(-16px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes toastProgress {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>

            {/* Icon Bubble */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                flexShrink: 0
              }}
            >
              {icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '0.3px' }}>
                {t.title}
              </div>
              <div style={{ fontSize: '0.86rem', color: '#D1D5DB', lineHeight: 1.4, fontWeight: 500 }}>
                {t.message}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '1.1rem',
                cursor: 'pointer',
                padding: '2px 4px',
                lineHeight: 1,
                borderRadius: '4px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              aria-label="Close notification"
            >
              ✕
            </button>

            {/* Bottom Progress Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: borderColor,
                animation: `toastProgress ${t.duration || 4500}ms linear forwards`
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
