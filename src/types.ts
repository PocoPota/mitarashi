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

  theme: {
    layout: string;
    post: string;
  }

  options: {
    cleanOutputDir: boolean;
  }
}
