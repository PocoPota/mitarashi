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
    customSyntaxFile?: string;
  };

  theme: {
    layout: string;
    post: string;
  }

  options: {
    cleanOutputDir: boolean;
  }
}

export type CustomSyntaxRule =
  | {
      rule_type: "inline";
      pattern: string;
      toNode: {
        type: string;
      };
      template: string;
    }
  | {
      rule_type: "block";
      start: string;
      end: string;
      meta?: string;
      toNode: {
        type: string;
      };
      template: string;
    };