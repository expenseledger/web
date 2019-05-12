export default interface Response {
  status: number;
  data: any | null;
  success: boolean;
  error: Error | null;
}
