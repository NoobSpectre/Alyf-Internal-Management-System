export type TProject = {
  project_id?: string;
  project_name: string; // s1
  location_id: string; // s1
  lat_long: [number, number] | []; // s1
  bhk_configuration: string; // s1
  property_count: string; // s1
  total_shares: string; // s1
  available_shares: string; // s1
  total_shares_to_display: string; // s1
  available_shares_to_display: string; // s1
  plot_area: string; // s1
  carpet_area: string; // s1
  super_area: string; // s1
  built_up_area: string; // s1
  category: string; // s1
  property_type: string; // s1
  available_buy_options: string; // s1
  soldout: boolean; // s1
  is_test_project: boolean; // s1
  is_active_in_website: boolean; // s1
  is_featured_project: boolean; // s1
  investment_breakdown: TJson[] | null;
  other_charges: TJson[] | null;
  full_investment_breakdown: TJson[] | null;
  full_other_charges: TJson[] | null;
  project_media: { images: TUploadedFile[]; videos: TUploadedVideo[] };
  brochure_url: string | null;
  location_description: string[];
  project_description: string[];
  rental_prospect_description: string[];
  stages_completed: number;
  amenities: string[];
  features: string[];
  created_at: string;
  updated_at: string;
  hero_images: string[];
  deleted: boolean;
};

export type TDescription = {
  location_description: { title: string; details: { value: string }[] };
  project_description: { title: string; details: { value: string }[] };
  rental_prospect_description: { title: string; details: { value: string }[] };
};

export type TSeasonDate = {
  day: number;
  month: number;
};

export type TDateRange = {
  start_date: TSeasonDate;
  end_date: TSeasonDate;
};

export type TLocation = {
  location_id: string;
  location_name: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  seasons: {
    [key: string]: TDateRange[];
  };
  special_days_calender: {
    [key: string]: ({
      name: string;
    } & TDateRange)[];
  };
  display_location: string;
};

export type TUploadedFile = {
  id: string;
  url: string;
  tags: string[];
};

export type TUploadedVideo = TUploadedFile & {
  poster: string;
  type: string;
};

export type Filetypes = {
  image: TUploadedFile;
  video: TUploadedVideo;
};

export type TJson = {
  name: string;
  label: string;
  amount: number;
};

export type TOption = {
  id: string;
  label: string;
  value: string;
};

export type TConfig = {
  config_id: string;
  tags: TOption[];
  amenities: (TOption & { iconUrl: string })[];
  features: (TOption & { iconUrl: string })[];
  property_types: TOption[];
  available_buy_options: TOption[];
  bhk_configurations: TOption[];
  categories: TOption[];
};

export type TStageProps = {
  id?: string;
  resource: string;
  colorMode: "light" | "dark";
  isPhone: boolean;
  grid_template_cols: string;
  gap_between_label_and_input: string;
  isProjectDataLoading: boolean;
  projectData?: TProject;
};

export type TLocalStorageItems =
  | "uploaded_images"
  | "uploaded_videos"
  | "uploaded_pdf"
  | "recent_uploads";

export type TImageArray = {
  bathroom: string[];
  bedroom: string[];
  hall: string[];
  kitchen: string[];
  exterior: string[];
  interior: string[];
  walkthrough: string[];
  facade: string[];
  bath: string[];
};

export type TUserRoles = "PANEL_USER" | "PANEL_ADMIN";
