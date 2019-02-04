export default interface IResponse {
  status: number;
  data: any | null;
  success: boolean;
  error: Error | null;
}
