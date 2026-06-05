export type UpdateItem = {
  title: string;
  date: string;
  isNew: boolean;
};

export type SiteConfig = {
  heroLogoUrl?: string;
  heroVideoUrl?: string;
  dailyQuote?: string;
  updates?: UpdateItem[];
  ostTitle?: string;
  sidebarImage?: string;
};
