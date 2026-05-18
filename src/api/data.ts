import sitesData from '../../data/sites.json';
import rankingData from '../../data/ranking.json';
import { RankingItem, RankingListSchema, Site, SiteListSchema } from '../types';

export function getSites(): Site[] {
  // This will throw and fail the build if the JSON is invalid
  return SiteListSchema.parse(sitesData);
}

export function getRankings(): RankingItem[] {
  return RankingListSchema.parse(rankingData);
}

export function getRanking(): RankingItem[] {
  return getRankings();
}
