import React from 'react';
import HomeClient from '@/components/HomeClient';
import { getRankings } from '@/api/data';

export default function Home() {
  const rankings = getRankings();

  return <HomeClient rankings={rankings} />;
}
