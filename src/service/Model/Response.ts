export default class Response<T> {
  public status: number;
  public data: T | null;
  public success: boolean;
  public error: Error | null;
}
