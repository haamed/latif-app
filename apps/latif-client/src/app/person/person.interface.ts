export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePersonDto {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
}

export interface UpdatePersonDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    notes?: string;
}
