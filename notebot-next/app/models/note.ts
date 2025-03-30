
export interface Note {
    id?: string;
    type?: "kb" | "article" | "blog" | "note";
    title?: string;
    content?: string;
    author?: string;
    tags?: string[];
  }