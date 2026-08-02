import { isAxiosError } from "axios";

import type { AxiosError } from "axios";

import axios from "../axios";

import type {
  AssetListResponse,
  AssetResponse,
  AssetStatus,
  AssetType,
  AssetWriteInput
} from "../../types/assets";

interface ListAssetsParams {
  limit: number;
  page: number;
  status?: AssetStatus;
  type?: AssetType;
}

interface ErrorResponse {
  error?: {
    message?: string;
  };
}

function readErrorMessage(error: AxiosError<ErrorResponse>): string {
  return error.response?.data.error?.message ?? error.message ?? "Request failed.";
}

export async function listAssets(params: ListAssetsParams): Promise<AssetListResponse> {
  try {
    const response = await axios.get<AssetListResponse>("/api/assets", {
      params
    });

    return response.data;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      throw new Error(readErrorMessage(error));
    }

    throw error;
  }
}

export async function createAsset(input: AssetWriteInput): Promise<AssetResponse> {
  try {
    const response = await axios.post<AssetResponse>("/api/assets", input);

    return response.data;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      throw new Error(readErrorMessage(error));
    }

    throw error;
  }
}

export async function updateAsset(
  assetId: string,
  input: AssetWriteInput
): Promise<AssetResponse> {
  try {
    const response = await axios.patch<AssetResponse>(`/api/assets/${assetId}`, input);

    return response.data;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      throw new Error(readErrorMessage(error));
    }

    throw error;
  }
}
