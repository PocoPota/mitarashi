export interface MitarashiConfig {
  site: {
    title: string;
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
