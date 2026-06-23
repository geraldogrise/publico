/** Port para hashing de senha (implementado com bcrypt na infraestrutura). */
export interface IPasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
