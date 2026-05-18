import React from 'react';
import HomeClient from '@/components/HomeClient';
import { getRankings, getSites } from '@/api/data';

export default function Home() {
  const sites = getSites();
  const rankings = getRankings();

  return <HomeClient initialSites={sites} rankings={rankings} />;
}
