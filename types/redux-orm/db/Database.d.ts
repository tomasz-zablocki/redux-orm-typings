import { ModelClassMap, OrmState } from '../ORM';
import { CREATE, DELETE, EXCLUDE, FAILURE, FILTER, ORDER_BY, SUCCESS, UPDATE } from '../constants';
import { Table, TableSpec } from './Table';
import { SerializableMap } from '../helpers';
import { AnyModel } from '../Model';

export type QueryType = typeof FILTER | typeof EXCLUDE | typeof ORDER_BY;

export interface QueryClause<Payload extends object = {}> {
    type: QueryType;
    payload: Payload;
}

export interface Query {
    table: string;
    clauses: QueryClause[];
}

export interface QuerySpec {
    query: Query;
}

export type DbAction = typeof CREATE | typeof UPDATE | typeof DELETE;

export type DbActionResult = typeof SUCCESS | typeof FAILURE;

export interface UpdateSpec<Payload = any> {
    action: DbAction;
    payload?: Payload;
    query?: Query;
}

export interface UpdateResult<T extends Array<typeof AnyModel>, Payload extends object = {}> {
    status: DbActionResult;
    state: OrmState<ModelClassMap<T>>;
    payload: Payload;
}

export interface QueryResult<Row extends SerializableMap = {}> {
    rows: ReadonlyArray<Row>;
}

export interface Transaction {
    batchToken: any;
    withMutations: boolean;
}

export interface SchemaSpec<TSchema extends Array<typeof AnyModel>> {
    tables: { [K in keyof ModelClassMap<TSchema>]: TableSpec<ModelClassMap<TSchema>> };
}

export interface DB<
    TSchema extends Array<typeof AnyModel>,
    MClassMap extends ModelClassMap<TSchema> = ModelClassMap<TSchema>,
    Tables = { [K in keyof MClassMap]: Table<MClassMap[K]> }
> {
    getEmptyState(): OrmState<MClassMap>;
    query(tables: Tables, querySpec: QuerySpec, state: OrmState<MClassMap>): QueryResult;
    update(
        tables: Tables,
        updateSpec: UpdateSpec,
        tx: Transaction,
        state: OrmState<MClassMap>
    ): UpdateResult<MClassMap>;
    describe<K extends keyof Tables>(k: K): Tables[K];
}

export type DBCreator = typeof createDatabase;

export function createDatabase<TSchema extends Array<typeof AnyModel>>(schemaSpec: SchemaSpec<TSchema>): DB<TSchema>;

export default createDatabase;
