import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axiosInstance from "@/src/lib/axios";
import { AxiosError } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: string;
      data?: unknown;
      params?: unknown;
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// export const api = createApi({
//   reducerPath: "api",
//   baseQuery: axiosBaseQuery(),
//   endpoints: () => ({}),
// });

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query<any, void>({
      query: () => ({
        url: "https://jsonplaceholder.typicode.com/users",
      }),
    }),
  }),
});

export const { useGetUsersQuery } = api;