export class VideoService {
  async createAsset(_url: string): Promise<{ assetId: string; playbackId: string }> {
    // TODO: Implement Mux or Cloudflare Stream integration
    throw new Error("Not implemented");
  }

  async getPlaybackUrl(_playbackId: string, _signed = true): Promise<string> {
    // TODO: Implement signed playback URL generation
    throw new Error("Not implemented");
  }

  async deleteAsset(_assetId: string): Promise<void> {
    // TODO: Implement asset deletion
    throw new Error("Not implemented");
  }
}
