export interface LandField {
  id: string;
  name: string;
  areaSize: number; // in hectares
  location: string;
  cropType?: string;
  plantedDate?: string;
  expectedHarvestDate?: string;
}
