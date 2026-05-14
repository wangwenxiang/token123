import assert from 'node:assert/strict';
import test from 'node:test';
import { SiteListSchema, type Site } from '../src/types';
import { filterSites } from '../src/lib/siteFilters';
import {
  getFreeTierLabel,
  getPaymentMethodLabels,
  getVerificationLabel,
} from '../src/lib/siteDisplay';

const baseSite: Site = {
  name: 'Alpha',
  url: 'https://alpha.example.com',
  description: '测试站点',
  models: ['gpt'],
  priceTier: 'budget',
  featured: false,
  paymentMethods: ['alipay'],
  minRecharge: '¥10',
  hasFreeTier: true,
  lastVerified: '2026-05-14',
};

test('SiteSchema parses trial decision fields and defaults unknown values conservatively', () => {
  const parsed = SiteListSchema.parse([
    {
      name: 'Legacy',
      url: 'https://legacy.example.com',
      description: '旧数据',
      models: ['gpt'],
      priceTier: 'standard',
      featured: false,
    },
  ]);

  assert.deepEqual(parsed[0].paymentMethods, []);
  assert.equal(parsed[0].minRecharge, '未知');
  assert.equal(parsed[0].hasFreeTier, null);
  assert.equal(parsed[0].lastVerified, null);
});

test('filterSites only treats explicit free tier and explicit payment methods as matches', () => {
  const sites: Site[] = [
    baseSite,
    {
      ...baseSite,
      name: 'Unknown',
      paymentMethods: [],
      hasFreeTier: null,
    },
    {
      ...baseSite,
      name: 'NoFreeTier',
      paymentMethods: ['wechat'],
      hasFreeTier: false,
    },
  ];

  assert.deepEqual(
    filterSites(sites, {
      category: 'all',
      searchTerm: '',
      paymentMethods: ['alipay'],
      onlyFreeTier: true,
    }).map((site) => site.name),
    ['Alpha'],
  );

  assert.deepEqual(
    filterSites(sites, {
      category: 'all',
      searchTerm: '',
      paymentMethods: ['wechat'],
      onlyFreeTier: false,
    }).map((site) => site.name),
    ['NoFreeTier'],
  );
});

test('display helpers expose unknown payment, free tier, and verification states', () => {
  assert.deepEqual(getPaymentMethodLabels([]), ['支付方式未验证']);
  assert.equal(getFreeTierLabel(null), '免费额度未验证');
  assert.equal(getFreeTierLabel(false), '无免费额度');
  assert.equal(getFreeTierLabel(true), '免费试用');
  assert.equal(getVerificationLabel(null), '未核验');
  assert.equal(getVerificationLabel('2026-05-14'), '核验：2026-05-14');
});
