export interface MitarashiConfig {
  site: {
    siteTitle: string;
    description?: string;
    baseUrl?: string;
  };

  paths: {
    postsDir: string;
    outputDir: string;
    templateDir: string;
  };

  options: {
    cleanOutputDir: boolean;
  }
}
