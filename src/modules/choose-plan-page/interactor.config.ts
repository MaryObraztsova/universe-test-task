import { InternalFileType } from '../../shared/types';
import { PaymentPlanId } from '../../use-cases/get-subscription-products';
import check from "./assets/check.svg";
import cross from "./assets/cross.svg";
import { Bullet } from './interactor.types';

export const SELECTED_PLAN_SEARCH_KEY = 'plan';

export const interactorImagesFormat = [
  InternalFileType.HEIC,
  InternalFileType.SVG,
  InternalFileType.PNG,
  InternalFileType.BMP,
  InternalFileType.EPS,
  InternalFileType.GIF,
  InternalFileType.TIFF,
  InternalFileType.WEBP,
  InternalFileType.JPG,
  InternalFileType.JPEG,
] as const satisfies InternalFileType[];

export const BULLETS_BY_PLAN_ID = {
  [PaymentPlanId.MONTHLY]:[
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly.bullet1",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly.bullet2",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly.bullet3",
    },
    {
      imgSrc: cross,
      bullText: "payment_page.plans.monthly.bullet4",
      bullClassName: "text-[#878787]",
    },
    {
      imgSrc: cross,
      bullText: "payment_page.plans.monthly.bullet5",
      bullClassName: "text-[#878787]",
    },
    {
      imgSrc: cross,
      bullText: "payment_page.plans.monthly.bullet6",
      bullClassName: "text-[#878787]",
    },
    {
      imgSrc: cross,
      bullText: "payment_page.plans.monthly.bullet7",
      bullClassName: "text-[#878787]",
    },
    {
      imgSrc: cross,
      bullText: "payment_page.plans.monthly.bullet8",
      bullClassName: "text-[#878787]",
    },
  ],
  [PaymentPlanId.MONTHLY_FULL]: [
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet1",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet2",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet3",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet4",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet5",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet6",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet7",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.monthly_full.bullet8",
    },
  ],
  [PaymentPlanId.ANNUAL]:[
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet1",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet2",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet3",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet4",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet5",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet6",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet7",
    },
    {
      imgSrc: check,
      bullText: "payment_page.plans.annual.bullet8",
    },
  ]
} as const satisfies Record<PaymentPlanId.MONTHLY | PaymentPlanId.MONTHLY_FULL |PaymentPlanId.ANNUAL, Bullet[]>;