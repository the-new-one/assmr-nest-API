/* eslint-disable @typescript-eslint/no-unused-vars */
interface ResponseData<T> {
  code: number;
  status: number;
  message: string;
  data: T;
}
