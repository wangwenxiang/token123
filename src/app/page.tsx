import React from 'react';
import HomeClient from '@/components/HomeClient';
import { getSites } from '@/api/data';

export default function Home() {
  const sites = getSites();

  return <HomeClient initialSites={sites} />;
}
