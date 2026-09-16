import { FactCheckSource } from '@/domain/types/analysis';

export interface IFactCheckGateway {
  search(query: string): Promise<FactCheckSource[]>;
}
