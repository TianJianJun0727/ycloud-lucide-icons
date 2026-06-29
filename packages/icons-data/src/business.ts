import { billingIcon } from './business-icons/billing';
import { campaignIcon } from './business-icons/campaign';
import { cartIcon } from './business-icons/cart';
import { chatbotIcon } from './business-icons/chatbot';
import { companyIcon } from './business-icons/company';
import { contactIcon } from './business-icons/contact';
import { ctwaIcon } from './business-icons/ctwa';
import { developersIcon } from './business-icons/developers';
import { helpIcon } from './business-icons/help';
import { homeIcon } from './business-icons/home';
import { inboxIcon } from './business-icons/inbox';
import { integrationIcon } from './business-icons/integration';
import { journeyIcon } from './business-icons/journey';
import { logoutIcon } from './business-icons/logout';
import { orderIcon } from './business-icons/order';
import { partnerIcon } from './business-icons/partner';
import { pinIcon } from './business-icons/pin';
import { settingsIcon } from './business-icons/settings';
import { whatsappIcon } from './business-icons/whatsapp';

export * from './business-icons/billing';
export * from './business-icons/campaign';
export * from './business-icons/cart';
export * from './business-icons/chatbot';
export * from './business-icons/company';
export * from './business-icons/contact';
export * from './business-icons/ctwa';
export * from './business-icons/developers';
export * from './business-icons/help';
export * from './business-icons/home';
export * from './business-icons/inbox';
export * from './business-icons/integration';
export * from './business-icons/journey';
export * from './business-icons/logout';
export * from './business-icons/order';
export * from './business-icons/partner';
export * from './business-icons/pin';
export * from './business-icons/settings';
export * from './business-icons/whatsapp';

export interface BusinessIconDefinition {
  name: string;
  svg: string;
  dataUri: string;
}

export const businessIconNames = [
  'billing',
  'campaign',
  'cart',
  'chatbot',
  'company',
  'contact',
  'ctwa',
  'developers',
  'help',
  'home',
  'inbox',
  'integration',
  'journey',
  'logout',
  'order',
  'partner',
  'pin',
  'settings',
  'whatsapp',
] as const;
export type BusinessIconName = (typeof businessIconNames)[number];

export const businessIcons = {
  billing: billingIcon,
  campaign: campaignIcon,
  cart: cartIcon,
  chatbot: chatbotIcon,
  company: companyIcon,
  contact: contactIcon,
  ctwa: ctwaIcon,
  developers: developersIcon,
  help: helpIcon,
  home: homeIcon,
  inbox: inboxIcon,
  integration: integrationIcon,
  journey: journeyIcon,
  logout: logoutIcon,
  order: orderIcon,
  partner: partnerIcon,
  pin: pinIcon,
  settings: settingsIcon,
  whatsapp: whatsappIcon,
} as const satisfies Record<string, BusinessIconDefinition>;

export function getBusinessIcon(name: BusinessIconName) {
  return businessIcons[name];
}
