import { useCallback } from "react";
import { API_URL } from "../config";
import useFetch from "../use-fetch";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";

export type FileUploadRequest = File;

export type ScrapeFormData = {
  url: string;
  type: string;
};

export function useScrapeService() {
  const fetchClient = useFetch();

  return useCallback(
    (data: ScrapeFormData) => {
      return fetchClient(`${API_URL}/scrape`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then(wrapperFetchJsonResponse<any>);
    },
    [fetchClient]
  );
}
