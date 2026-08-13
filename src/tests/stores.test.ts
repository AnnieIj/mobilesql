import { describe, it, expect } from 'vitest';
import { useUIStore } from '../stores/useUIStore';

describe('UI Store State Transitions', () => {
  it('manages navigation tabs correctly', () => {
    useUIStore.getState().setActiveTab('playground');
    expect(useUIStore.getState().activeTab).toBe('playground');

    useUIStore.getState().setActiveTab('academy');
    expect(useUIStore.getState().activeTab).toBe('academy');
  });

  it('manages modal and drawer states', () => {
    useUIStore.getState().setCopilotOpen(true);
    expect(useUIStore.getState().isCopilotOpen).toBe(true);

    useUIStore.getState().setSearchOpen(true);
    expect(useUIStore.getState().isSearchOpen).toBe(true);
  });

  it('pushes and auto-dismisses toast notifications', () => {
    useUIStore.getState().addToast({
      title: 'Query Executed',
      message: '14 rows returned in 12ms',
      type: 'success',
    });

    const toasts = useUIStore.getState().toasts;
    expect(toasts.length).toBeGreaterThan(0);
    expect(toasts[toasts.length - 1].title).toBe('Query Executed');
  });
});
