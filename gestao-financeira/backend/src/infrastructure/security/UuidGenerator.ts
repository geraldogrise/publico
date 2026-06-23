import { randomUUID } from 'crypto';
import { IIdGenerator } from '../../application/ports/IIdGenerator';

/** Adapter de geracao de UUID usando o modulo crypto nativo. */
export class UuidGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
