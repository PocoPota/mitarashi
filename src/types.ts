export interface MitarashiConfig {
  site: {
    title: string;
    description?: string;
    baseUrl?: string;
  };

  paths: {
    contentDir: string;
    outputDir: string;
    templateDir: string;
  };
}
