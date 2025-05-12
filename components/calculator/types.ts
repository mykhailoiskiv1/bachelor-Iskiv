export type CalcProjectType = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    categories: CalcCategory[];
};

export type CalcCategory = {
    id: number;
    name: string;
    slug: string;
    description?: string;
};

export type CalcCondition = {
    id: number;
    label: string;
    description?: string;
    multiplier: number;
};

export type CalcItem = {
    id: number;
    name: string;
    description?: string;
    unitType: 'M2' | 'ITEM' | 'HOUR' | 'FIXED';
    minPrice: number;
    maxPrice: number;
    baseMin: number;
    baseMax: number;
    conditions: CalcCondition[];
};

export type SelectedItemState = {
    quantity: number;
    conditionIds: number[];
};

export type ContactForm = {
    name: string;
    email: string;
    phone: string;
    postcode: string;
};

export type Step =
    | 'contact'
    | 'category'
    | 'items'
    | 'urgency'
    | 'summary';
