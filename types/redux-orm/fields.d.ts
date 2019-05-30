import Model from './Model';
import { Serializable } from './helpers';

export class Field {
    readonly index: boolean;
}

export interface AttributeOpts {
    getDefault?: () => any;
}

export class Attribute extends Field {
    constructor(opts?: AttributeOpts);
}

export interface AttributeWithDefault extends Attribute {
    getDefault(): Serializable;
}

export interface RelationalFieldOpts {
    to: string;
    relatedName?: string;
    through?: string;
    throughFields?: {
        to: string;
        from: string;
    };
    as?: string;
}

export class RelationalField extends Field {
    constructor(toModelName: string, relatedName?: string);
    constructor(opts: RelationalFieldOpts);
    getBackwardsFieldName(model: typeof Model): string;
}

export class OneToOne extends RelationalField {}

export class ForeignKey extends RelationalField {
    readonly index: true;
}

export class ManyToMany extends RelationalField {
    readonly index: false;
}

export interface AttrCreator {
    (opts?: AttributeOpts): {} extends AttributeOpts ? Attribute : AttributeWithDefault;
}

export interface FkCreator {
    (toModelName: string, relatedName?: string): ForeignKey;
    (opts: RelationalFieldOpts): ForeignKey;
}

export interface ManyCreator {
    (toModelName: string, relatedName?: string): ManyToMany;
    (opts: RelationalFieldOpts): ManyToMany;
}

export interface OneToOneCreator {
    (toModelName: string, relatedName?: string): OneToOne;
    (opts: RelationalFieldOpts): OneToOne;
}

export const attr: AttrCreator;

export const oneToOne: OneToOneCreator;

export const fk: FkCreator;

export const many: ManyCreator;

export interface FieldSpecMap {
    [K: string]: Attribute | ForeignKey | ManyToMany | OneToOne;
}

export interface VirtualFieldSpecMap {
    [K: string]: ForeignKey | ManyToMany | OneToOne;
}
