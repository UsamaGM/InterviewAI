import { AxiosError } from "axios";

export const handleError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with an error status
      return `${defaultMessage}: Server responded with status ${
        error.response.status
      } - ${error.response.data.message || error.response.statusText}`;
    } else if (error.request) {
      // Request was made but no response was received
      return `${defaultMessage}: No response received from server`;
    } else {
      // Something happened in setting up the request
      return `${defaultMessage}: ${error.message}`;
    }
  } else {
    // Generic error
    return `${defaultMessage}: ${
      error instanceof Error ? error.message : error
    }`;
  }
};
