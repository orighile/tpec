
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export interface AppError extends Error {
  code?: string;
  details?: any;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: AppError | Error | string, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);

    let title = "Something went wrong";
    let description = "Please try again later.";

    if (typeof error === 'string') {
      description = error;
    } else if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('duplicate key')) {
        title = "Duplicate Entry";
        description = "This item already exists.";
      } else if (error.message.includes('foreign key')) {
        title = "Invalid Reference";
        description = "Referenced item no longer exists.";
      } else if (error.message.includes('not authenticated')) {
        title = "Authentication Required";
        description = "Please sign in to continue.";
      } else if (error.message.includes('insufficient privileges')) {
        title = "Access Denied";
        description = "You don't have permission to perform this action.";
      } else if (error.message.includes('network')) {
        title = "Network Error";
        description = "Please check your internet connection.";
      } else {
        description = error.message;
      }
    }

    toast({
      title,
      description,
      variant: "destructive",
    });
  }, [toast]);

  const handleSuccess = useCallback((message: string, title = "Success") => {
    toast({
      title,
      description: message,
    });
  }, [toast]);

  return {
    handleError,
    handleSuccess,
  };
};
