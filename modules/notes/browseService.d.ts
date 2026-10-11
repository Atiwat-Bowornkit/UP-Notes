export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PublishedNotesOptions {
  searchQuery?: string;
  category?: string;
  faculty?: string;
  program?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  notes?: any[] | null;
  prismaClient?: any | null;
}

export interface PublishedNotesResult {
  success: boolean;
  error?: string;
  data: any[];
  pagination: PaginationMetadata;
}

export declare function getPublishedNotes(options?: PublishedNotesOptions): Promise<PublishedNotesResult>;
export declare function getPublishedNoteById(noteId: string, prismaClient?: any): Promise<any | null>;
export declare const CATEGORY_MAP: Record<string, string>;
