import sitesData from '../../data/sites.json';
import { SiteListSchema, Site } from '../types';

export function getSites(): Site[] {
  // This will throw and fail the build if the JSON is invalid
  return SiteListSchema.parse(sitesData);
}
