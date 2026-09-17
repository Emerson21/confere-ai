export interface UrlMetadata {
  originalUrl: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface IUrlMetadataGateway {
  fetchMetadata(url: string): Promise<UrlMetadata>;
}
