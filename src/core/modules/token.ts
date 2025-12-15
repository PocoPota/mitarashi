export type Token = {
  type: string;
  children?: Array<Token>;
  value?: string;
  level?: number;
  url?: string;
  alt?: string;
  isHeader?: boolean,
  meta?: string
};