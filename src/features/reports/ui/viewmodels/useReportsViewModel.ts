import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { SalesReport, ReportPeriod } from "@features/reports/domain/entities/Report";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useReportsViewModel() {
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [date, setDate] = useState<string>(() => {
    const today = new Date().toISOString().split("T")[0];
    return today || "";
  });

  const { data, isLoading, error, refetch } = useQuery<ApiResponse<SalesReport>>({
    queryKey: ["reports", period, date],
    queryFn: () =>
      apiClient
        .get("/reports/sales", { params: { period, date } })
        .then((res) => res.data),
  });

  return {
    report: data?.data,
    period,
    date,
    isLoading,
    error,
    setPeriod,
    setDate,
    refetch,
  };
}
