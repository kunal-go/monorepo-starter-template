import { ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";
import { db } from "./db";

export type WriteTransaction = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export type ReadTransaction = WriteTransaction | typeof db;

export function getDb() {
  return {
    writeTx: (fn: (tx: WriteTransaction) => Promise<any>) => db.transaction(fn),
    readTx: db,
  };
}
