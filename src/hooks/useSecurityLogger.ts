import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSecurityLogger = () => {
  const logSecurityEvent = useCallback(async (
    eventType: string,
    eventData?: any,
    userId?: string
  ) => {
    try {
      await supabase.rpc('log_security_event', {
        _event_type: eventType,
        _event_data: eventData || null,
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  return { logSecurityEvent };
};